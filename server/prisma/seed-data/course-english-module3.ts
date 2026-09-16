/**
 * English Speaking Complete Course — Module 3: Family, Numbers, Time &
 * Daily Routine, lessons 1-3. Closes Part I (Foundations).
 *
 * Lesson 1: Family members and the possessive "'s" that frequently goes
 *           missing ("My father name is..." instead of "My father's
 *           name is...").
 * Lesson 2: Numbers and telling time — including the teen/ty stress
 *           pair (thirteen vs. thirty) that connects straight back to
 *           Module 1's word-stress lesson.
 * Lesson 3: Daily routine with simple present for habits, closing on
 *           this course's single highest-value grammar correction so
 *           far: present continuous overused for habitual actions
 *           ("I am waking up at 6am daily" instead of "I wake up at
 *           6am every day").
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_3: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-talking-about-family',
    title: 'Talking About Your Family',
    titleHi: 'Apni Family Ke Baare Mein Baat Karna',
    description:
      'Family words, "have" for family size, and the possessive \'s that quietly goes missing: "my father name" vs. "my father\'s name".',
    descriptionHi:
      'Family words, family size ke liye "have", aur wo possessive \'s jo chupke se missing ho jaata hai: "my father name" vs. "my father\'s name".',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**The apostrophe-s is a small tag that says "this belongs to that person" — like a nametag on a bag at a family gathering.** Without the tag, you can still point at the bag and the father and guess they\'re connected; with the tag ("father\'s name"), there is no guessing at all.',
      hi: 'Apostrophe-s ek chhota tag hai jo kehta hai "ye us person ka hai" — jaise ek family gathering mein ek bag pe nametag. Tag ke bina, tum phir bhi bag aur father dono ki taraf point kar sakte ho aur guess kar sakte ho ki wo connected hain; tag ke saath ("father\'s name"), koi guessing hi nahi hoti.',
    },

    simple: `**Family words:**

- Parents: mother/mom, father/dad
- Siblings: brother, sister
- Extended: grandmother/grandfather, uncle, aunt, cousin
- Your own: husband, wife, son, daughter

**Talking about family size, with "have":**

"I have two brothers and one sister." · "I have a big family." · "I
have three cousins."

**The possessive 's shows something belongs to someone:**

- "My father's name is Ramesh." (NOT "My father name is Ramesh")
- "My sister's favorite color is blue."
- "My parents' house is in Pune." (plural "parents" — the apostrophe
  moves to the end: parents')

**A quick way to check yourself**: if you can ask "whose name?" and
answer "my father's," you need the 's — it marks ownership.`,
    simpleHi: `**Family words:**

- Parents: mother/mom, father/dad
- Siblings: brother, sister
- Extended: grandmother/grandfather, uncle, aunt, cousin
- Apna: husband, wife, son, daughter

**Family size ke baare mein baat karna, "have" ke saath:**

"I have two brothers and one sister." · "I have a big family." · "I
have three cousins."

**Possessive 's dikhata hai ki kuch kisi ka hai:**

- "My father's name is Ramesh." ("My father name is Ramesh" NAHI)
- "My sister's favorite color is blue."
- "My parents' house is in Pune." (plural "parents" — apostrophe end
  mein move ho jaata hai: parents')

**Apne aap ko check karne ka ek quick tareeka**: agar tum "whose name?"
poochh sakte ho aur "my father's" answer de sakte ho, tumhe 's chahiye —
ye ownership mark karta hai.`,

    content: `**Why "my father name" specifically loses the 's.**

In Hindi, "mera papa ka naam" places "ka" between father and name to
show possession — but "ka/ki/ke" doesn't map onto a single small
sound the way English's 's does, so it's easy for the marker to simply
not transfer when translating in your head. The result, "my father
name," is completely understandable but immediately signals a direct
translation rather than natural English.

**The rule, precisely**: add 's to a singular noun to show
possession — "my sister's book," "the dog's tail," "Ramesh's car." For
a plural noun that already ends in "s" (like "parents"), you only add
the apostrophe, no extra "s" — "my parents' house," not "my parents's
house."

**"Have" vs. "there is/are" for family — both work, differently.**
"I have two brothers" puts you at the center. "There are four people
in my family" describes the group as a whole. Both are natural; use
whichever fits what you want to emphasize.

**Describing relationships, not just listing them, makes this feel
like conversation instead of a form.** Compare "I have one brother" to
"I have one older brother — we're very close." The second version
gives the listener something to respond to, exactly like the
closing-comment technique from Module 2's final lesson.`,
    contentHi: `**"my father name" specifically 's kyun kho deta hai.**

Hindi mein, "mera papa ka naam" "ka" ko father aur naam ke beech rakhta
hai possession dikhane ke liye — par "ka/ki/ke" English ke 's jaisi ek
single chhoti sound pe map nahi hota, isliye ye aasan hai ki marker
simply transfer na ho jab tum apne mind mein translate kar rahe ho.
Result, "my father name," completely understandable hai par immediately
ek direct translation signal karta hai, natural English nahi.

**Rule, precisely**: possession dikhane ke liye ek singular noun mein
's add karo — "my sister's book," "the dog's tail," "Ramesh's car." Ek
plural noun ke liye jo already "s" pe end hota hai (jaise "parents"),
tum sirf apostrophe add karte ho, extra "s" nahi — "my parents' house,"
"my parents's house" nahi.

**"Have" vs. "there is/are" family ke liye — dono kaam karte hain,
differently.** "I have two brothers" tumhe center mein rakhta hai.
"There are four people in my family" group ko poori tarah describe
karta hai. Dono natural hain; jo bhi tum emphasize karna chahte ho use
choose karo.

**Relationships describe karna, sirf list karna nahi, ise ek form ki
jagah conversation jaisa feel karata hai.** Compare karo "I have one
brother" ko "I have one older brother — we're very close." Doosra
version listener ko kuch deta hai jispe respond kare, exactly jaise
Module 2 ke final lesson ka closing-comment technique.`,

    readingPassage: `Let me tell you about my family. I have a small family. My father's name is Ramesh, and my mother's name is Sunita. I have one younger sister. Her name is Anjali, and we are very close. My grandparents live with us too. I love my family very much.`,
    readingPassageHi: `Main tumhe apni family ke baare mein batata hoon. I have a small family. My father's name is Ramesh, aur my mother's name is Sunita. Meri ek choti behen hai. Uska naam Anjali hai, aur hum bahut close hain. My grandparents humare saath rehte hain. Mujhe apni family bahut pasand hai.`,

    vocabulary: [
      {
        word: 'sibling',
        wordHi: 'sibling (bhai-behen)',
        meaning: 'a brother or sister',
        meaningHi: 'ek bhai ya behen',
        example: 'I have two siblings — a brother and a sister.',
        exampleHi: 'I have two siblings — a brother and a sister.',
        pronunciation: 'SIB-ling',
      },
      {
        word: 'close (to someone)',
        wordHi: 'close (kareeb)',
        meaning: 'emotionally connected to someone',
        meaningHi: 'kisi se emotionally connected hona',
        example: "My sister and I are very close.",
        exampleHi: "My sister and I are very close.",
        pronunciation: 'klohs',
      },
      {
        word: 'grandparents',
        wordHi: 'grandparents (dada-dadi/nana-nani)',
        meaning: 'your parents\' parents',
        meaningHi: 'tumhare parents ke parents',
        example: 'My grandparents live in a village.',
        exampleHi: 'My grandparents live in a village.',
        pronunciation: 'GRAND-pair-ents',
      },
      {
        word: 'older / younger',
        wordHi: 'older / younger (bada / chota)',
        meaning: 'used to describe age compared to yourself',
        meaningHi: 'apne comparison mein age describe karne ke liye use hota hai',
        example: 'I have an older brother and a younger sister.',
        exampleHi: 'I have an older brother and a younger sister.',
        pronunciation: 'OHL-der / YUNG-er',
      },
    ],

    examples: [
      {
        title: 'Introducing family with the possessive correctly placed',
        titleHi: 'Family introduce karna possessive sahi jagah pe rakhte hue',
        code: `I have a big family. My father's name is Suresh, and he's a teacher. My mother's name is Kavita, and she runs a small shop. I also have an older brother — his name is Vikram.`,
        output: 'Every family member\'s name is correctly marked with \'s.',
        explain:
          'Notice every single name is introduced with the pattern "[relation]\'s name is [name]" — practicing this exact shape until it\'s automatic prevents the \'s from quietly disappearing.',
        explainHi:
          'Notice karo har ek naam "[relation]\'s name is [name]" pattern se introduce hota hai — is exact shape ko practice karna jab tak automatic na ho jaaye \'s ko chupke se disappear hone se rokta hai.',
      },
      {
        title: 'Plural possessive: parents\'',
        titleHi: 'Plural possessive: parents\'',
        code: `My parents' anniversary is in December.
My grandparents' house has a big garden.`,
        output: 'The apostrophe comes after the "s" for a plural noun.',
        explain:
          'Since "parents" and "grandparents" already end in "s", the possessive apostrophe goes at the very end with no extra "s" added — a small but noticeable detail in formal writing.',
        explainHi:
          'Kyunki "parents" aur "grandparents" already "s" pe end hote hain, possessive apostrophe bilkul end mein jaata hai bina koi extra "s" add kiye — ek chhota par formal writing mein noticeable detail.',
      },
    ],

    mistakes: [
      {
        wrong: '"My father name is Ramesh."',
        right: "\"My father's name is Ramesh.\"",
        why: 'Hindi\'s "ka/ki/ke" marks possession differently than English\'s single "\'s", so this small marker often gets dropped entirely when translating directly. English always needs the \'s on a singular possessor.',
        whyHi: 'Hindi ka "ka/ki/ke" possession ko English ke single "\'s" se differently mark karta hai, isliye ye chhota marker often poori tarah drop ho jaata hai direct translate karte waqt. English ko hamesha \'s chahiye ek singular possessor pe.',
      },
      {
        wrong: '"I have two brother." (missing plural "s" on the noun itself)',
        right: '"I have two brothers."',
        why: 'When a number greater than one is used, the noun itself needs a plural "s" — this is separate from the possessive \'s and easy to conflate with it while focusing on the harder rule.',
        whyHi: 'Jab ek se zyada number use hota hai, noun ko khud ek plural "s" chahiye — ye possessive \'s se alag hai aur harder rule pe focus karte waqt isse confuse karna aasan hai.',
      },
    ],

    realWorld: [
      {
        en: '**Filling out forms and giving personal details** (school admissions, visa applications, job forms) frequently ask for "father\'s name" and "mother\'s name" exactly in that possessive form — recognizing and using it correctly matters beyond just speaking.',
        hi: '**Forms bharna aur personal details dena** (school admissions, visa applications, job forms) frequently "father\'s name" aur "mother\'s name" exactly us possessive form mein poochte hain — ise sahi se recognize aur use karna sirf bolne se zyada matter karta hai.',
      },
      {
        en: '**Casual conversation about your background** — talking naturally about your family is one of the most common small-talk topics with new colleagues, neighbors, or friends, especially early in a relationship.',
        hi: '**Apne background ke baare mein casual conversation** — apni family ke baare mein naturally baat karna nayi colleagues, neighbors, ya friends ke saath sabse common small-talk topics mein se ek hai, especially ek relationship ki shuruaat mein.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I need to say "my father\'s name" every time, or can I shorten it?',
        qHi: 'Kya mujhe har baar "my father\'s name" kehna hai, ya main isse shorten kar sakta hoon?',
        a: 'In casual speech, once your father has been mentioned, you can simply say "he\'s a teacher" or "his name is..." — using "his/her" instead of repeating "my father\'s" every time actually sounds more natural, not less.',
        aHi: 'Casual speech mein, ek baar tumhare father ka mention ho jaaye, tum simply "he\'s a teacher" ya "his name is..." keh sakte ho — har baar "my father\'s" repeat karne ke bajaye "his/her" use karna actually zyada natural sound karta hai, kam nahi.',
      },
      {
        q: 'What\'s the difference between "I have one brother" and "I have a brother"?',
        qHi: '"I have one brother" aur "I have a brother" mein kya farak hai?',
        a: 'Almost none in meaning — "a" is the more common, natural choice in casual conversation. "One" is used when the number itself is the important or surprising part of the sentence, for example if someone asks specifically "how many brothers do you have?"',
        aHi: 'Meaning mein almost koi farak nahi — "a" casual conversation mein zyada common, natural choice hai. "One" tab use hota hai jab number khud sentence ka important ya surprising part ho, for example agar koi specifically poochhe "how many brothers do you have?"',
      },
    ],

    exercises: [
      {
        task: 'Out loud, introduce three members of your family using the correct possessive: "My [relation]\'s name is [name]."',
        taskHi: 'Zor se, apni family ke teen members ko sahi possessive use karke introduce karo: "My [relation]\'s name is [name]."',
        hint: 'Add one small detail about each person after their name, like their job or one thing you like about them.',
        hintHi: 'Har person ke naam ke baad ek chhota detail add karo, jaise unki job ya ek cheez jo tumhe unke baare mein pasand hai.',
      },
      {
        task: 'Say this corrected out loud three times: "My mother name is teacher" is wrong on two counts — find and fix both mistakes, then say the correct sentence.',
        taskHi: 'Ise zor se teen baar correct karke bolo: "My mother name is teacher" do wajah se galat hai — dono mistakes dhoondo aur fix karo, phir correct sentence bolo.',
        hint: '"My mother\'s name is Sunita, and she is a teacher." (the possessive was missing, and "name is teacher" confuses name with profession)',
        hintHi: '"My mother\'s name is Sunita, and she is a teacher." (possessive missing tha, aur "name is teacher" naam ko profession se confuse karta hai)',
      },
    ],

    keyTakeaways: [
      'Use \'s to show possession on a singular noun: "my father\'s name," never "my father name."',
      'For a plural noun already ending in "s" (parents, grandparents), only add the apostrophe: "parents\' house."',
      'A number greater than one needs a plural noun too: "two brothers," not "two brother."',
      '"Have" centers you ("I have two brothers"); "there are" describes the group ("there are four people in my family") — both are natural.',
      'Adding one small detail about a family member (their job, your closeness) turns a list into a real conversation.',
    ],
    keyTakeawaysHi: [
      "'s use karo possession dikhane ke liye ek singular noun pe: \"my father's name,\" kabhi \"my father name\" nahi.",
      'Ek plural noun ke liye jo already "s" pe end hota hai (parents, grandparents), sirf apostrophe add karo: "parents\' house."',
      'Ek se zyada number ko bhi plural noun chahiye: "two brothers," "two brother" nahi.',
      '"Have" tumhe center mein rakhta hai ("I have two brothers"); "there are" group ko describe karta hai ("there are four people in my family") — dono natural hain.',
      'Ek family member ke baare mein ek chhota detail add karna (unki job, tumhari closeness) ek list ko real conversation mein badal deta hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-numbers-and-telling-time',
    title: 'Numbers & Telling Time',
    titleHi: 'Numbers Aur Time Batana',
    description:
      'Thirteen vs. thirty — a stress difference that can change the whole meaning of a number — plus the natural way to ask for and tell the time.',
    descriptionHi:
      'Thirteen vs. thirty — ek stress difference jo ek number ka poora meaning change kar sakta hai — plus time poochne aur batane ka natural tareeka.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**"Thirteen" and "thirty" are like two road signs that look almost identical from a distance — only a small detail tells them apart, and getting it wrong sends you to a completely different place.** Say "thirTEEN" (stress at the end) for 13, and "THIRty" (stress at the start) for 30 — a real, practical use of the word-stress skill from Module 1.',
      hi: '"Thirteen" aur "thirty" do road signs jaise hain jo duur se almost identical dikhte hain — sirf ek chhota detail unhe alag batata hai, aur ise galat karna tumhe ek completely different jagah bhej deta hai. "thirTEEN" (end pe stress) kaho 13 ke liye, aur "THIRty" (shuru mein stress) 30 ke liye — Module 1 ke word-stress skill ka ek real, practical use.',
    },

    simple: `**The teens (13-19) vs. the tens (20, 30, 40...): the stress moves.**

- 13 = thir**TEEN** (stress at the end)
- 30 = **THIR**ty (stress at the start)
- 14 = four**TEEN**, 40 = **FOR**ty
- 15 = fif**TEEN**, 50 = **FIF**ty

Getting this wrong is one of the most common ways an address, a phone
number, or a price gets misunderstood — "I'll be there at 13" heard as
"30" changes a real plan.

**Asking for the time:**

"What time is it?" · "What's the time?" · "Do you have the time?"

**Telling the time:**

- 3:00 → "three o'clock"
- 3:15 → "quarter past three" or "three fifteen"
- 3:30 → "half past three" or "three thirty"
- 3:45 → "quarter to four" or "three forty-five"

Both the "past/to" style and the simple "hour + minutes" style
(three fifteen, three forty-five) are completely natural — the
"past/to" style just sounds a little more traditional.`,
    simpleHi: `**Teens (13-19) vs. tens (20, 30, 40...): stress move ho jaata hai.**

- 13 = thir**TEEN** (end pe stress)
- 30 = **THIR**ty (shuru mein stress)
- 14 = four**TEEN**, 40 = **FOR**ty
- 15 = fif**TEEN**, 50 = **FIF**ty

Ise galat karna ek address, phone number, ya price ke misunderstand
hone ka ek most common tareeka hai — "I'll be there at 13" "30" sunayi
dena ek real plan change kar deta hai.

**Time poochna:**

"What time is it?" · "What's the time?" · "Do you have the time?"

**Time batana:**

- 3:00 → "three o'clock"
- 3:15 → "quarter past three" ya "three fifteen"
- 3:30 → "half past three" ya "three thirty"
- 3:45 → "quarter to four" ya "three forty-five"

Dono "past/to" style aur simple "hour + minutes" style (three fifteen,
three forty-five) completely natural hain — "past/to" style bas thoda
zyada traditional sound karta hai.`,

    content: `**Why the teen/ty stress pair specifically causes real confusion.**

Unlike most vocabulary mix-ups, which only sound slightly odd, mixing
up thirteen and thirty genuinely changes the information — a wrong
apartment number, an incorrect price, a missed meeting time. This
makes it worth deliberately overcorrecting on: when a number in this
range genuinely matters (an address, a price, a phone number), say it
slowly and let the stress be obvious, rather than trusting the
listener to guess correctly.

**"What is the time in your watch?" is a specific, common Indian
English phrase to retire.** A watch shows the time; you don't ask the
time "in" it. The natural options — "What time is it?", "What's the
time?", "Do you have the time?" — never need "in your watch" at all;
if you must reference the watch itself, "What does your watch say?"
is the natural way.

**"Half past" literally means thirty minutes AFTER the hour, not
before** — a genuinely common point of confusion since it doesn't
follow an obvious pattern. "Half past three" = 3:30, not 2:30. "Quarter
to four," by contrast, means fifteen minutes BEFORE four = 3:45 — "to"
signals movement toward the next hour.

**In everyday speech, the simple hour-plus-minutes style is
increasingly more common than "past/to,"** especially among younger
speakers and in digital contexts (a text message is far more likely to
say "meet at 3:45" than "meet at quarter to four"). Both are correct;
knowing both means you'll understand either style when you hear it.`,
    contentHi: `**Teen/ty stress pair specifically real confusion kyun cause karta hai.**

Zyadatar vocabulary mix-ups ke unlike, jo sirf thoda odd sound karte
hain, thirteen aur thirty mix up karna genuinely information change
kar deta hai — ek galat apartment number, ek incorrect price, ek missed
meeting time. Ye deliberately overcorrect karne layak banata hai: jab
is range mein ek number genuinely matter karta hai (ek address, ek
price, ek phone number), ise slowly bolo aur stress ko obvious hone do,
listener ko sahi guess karne pe trust karne ke bajaye.

**"What is the time in your watch?" ek specific, common Indian English
phrase hai jise retire karna hai.** Ek watch time dikhata hai; tum time
"in" usme nahi poochte. Natural options — "What time is it?", "What's
the time?", "Do you have the time?" — kabhi "in your watch" ki
zaroorat nahi hoti; agar tumhe watch khud reference karna hai, "What
does your watch say?" natural tareeka hai.

**"Half past" literally hour ke THIRTY MINUTES BAAD ka matlab hai,
pehle ka nahi** — ek genuinely common confusion point kyunki ye ek
obvious pattern follow nahi karta. "Half past three" = 3:30, 2:30 nahi.
"Quarter to four," iske contrast mein, four se fifteen minutes PEHLE ka
matlab hai = 3:45 — "to" next hour ki taraf movement signal karta hai.

**Everyday speech mein, simple hour-plus-minutes style "past/to" se
increasingly zyada common hai,** especially younger speakers mein aur
digital contexts mein (ek text message "meet at quarter to four" se
kahin zyada "meet at 3:45" kehne ki possibility rakhta hai). Dono
correct hain; dono janna matlab hai tum kisi bhi style ko samjhoge jab
suno.`,

    readingPassage: `Excuse me, what time is it? It's quarter past three. My meeting is at three thirty, so I have thirteen minutes. Wait, not thirty minutes — thirteen minutes! I need to hurry. Thank you for telling me the time.`,
    readingPassageHi: `Excuse me, what time is it? It's quarter past three. Meri meeting three thirty pe hai, so mere paas thirteen minutes hain. Wait, thirty minutes nahi — thirteen minutes! Mujhe hurry karni padegi. Time batane ke liye thank you.`,

    vocabulary: [
      {
        word: "o'clock",
        wordHi: "o'clock (baje)",
        meaning: 'used after a number to say the exact hour, with no extra minutes',
        meaningHi: 'ek number ke baad use hota hai exact hour batane ke liye, koi extra minutes ke bina',
        example: "The meeting starts at four o'clock.",
        exampleHi: "The meeting starts at four o'clock.",
        pronunciation: 'uh-KLOK',
      },
      {
        word: 'quarter',
        wordHi: 'quarter (chauthai)',
        meaning: 'a fourth part — used for fifteen minutes, a quarter of an hour',
        meaningHi: 'ek chauthai bhaag — fifteen minutes ke liye use hota hai, ghante ka ek quarter',
        example: "It's quarter past five.",
        exampleHi: "It's quarter past five.",
        pronunciation: 'KWOR-ter',
      },
      {
        word: 'half',
        wordHi: 'half (aadha)',
        meaning: 'exactly the middle point — used for thirty minutes, half an hour',
        meaningHi: 'exactly beech ka point — thirty minutes ke liye use hota hai, aadha ghanta',
        example: "It's half past seven.",
        exampleHi: "It's half past seven.",
        pronunciation: 'haf',
      },
      {
        word: 'hurry',
        wordHi: 'hurry (jaldi karna)',
        meaning: 'to move or act quickly',
        meaningHi: 'jaldi move ya act karna',
        example: "I need to hurry, I'm running late.",
        exampleHi: "I need to hurry, I'm running late.",
        pronunciation: 'HUR-ee',
      },
    ],

    examples: [
      {
        title: 'Asking for and giving the time naturally',
        titleHi: 'Naturally time poochna aur dena',
        code: `A: Excuse me, do you have the time?
B: Sure, it's quarter to six.
A: Thanks! I need to catch a train at six fifteen.`,
        output: 'Two different time styles used naturally in the same conversation.',
        explain:
          '"Quarter to six" and "six fifteen" are both used naturally here — notice how either style flows fine in real conversation, and a fluent speaker mixes both without thinking about it.',
        explainHi:
          '"Quarter to six" aur "six fifteen" dono yahan naturally use hote hain — notice karo kaise koi bhi style real conversation mein aasani se flow karta hai, aur ek fluent speaker bina soche dono mix karta hai.',
      },
      {
        title: 'Stress makes the difference between 13 and 30 clear',
        titleHi: 'Stress 13 aur 30 ke beech ka farak clear karta hai',
        code: `Room thirTEEN (13) — stress at the end
Room THIRty (30) — stress at the start

I'll call you at 3:13. → "three thirTEEN"
I'll call you at 3:30. → "three THIRty"`,
        output: 'Exaggerating the stress removes almost all ambiguity.',
        explain:
          'When a number in this range genuinely matters — a room number, an appointment time — deliberately exaggerating the stress removes almost all risk of being misheard.',
        explainHi:
          'Jab is range mein ek number genuinely matter karta hai — ek room number, ek appointment time — deliberately stress ko exaggerate karna almost sab misheard hone ka risk hata deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"What is the time in your watch?"',
        right: '"What time is it?" or "Do you have the time?"',
        why: 'A watch shows the time; English doesn\'t phrase the question as happening "in" it. This is a specific, recognizable Indian English phrase that a small rewording fixes completely.',
        whyHi: 'Ek watch time dikhata hai; English question ko "in" usme hote hue phrase nahi karti. Ye ek specific, recognizable Indian English phrase hai jise ek chhota rewording completely fix kar deta hai.',
      },
      {
        wrong: 'Saying "thirteen" and "thirty" with the same, flat stress',
        right: 'thirTEEN (stress at the end) vs. THIRty (stress at the start)',
        why: 'This isn\'t a vocabulary error but a pronunciation one that can genuinely change meaning — a listener relies entirely on stress to tell these two numbers apart, since the words otherwise sound very similar.',
        whyHi: 'Ye ek vocabulary error nahi hai balki ek pronunciation error hai jo genuinely meaning change kar sakta hai — ek listener poori tarah stress pe depend karta hai in do numbers ko alag batane ke liye, kyunki words otherwise bahut similar sound karte hain.',
      },
    ],

    realWorld: [
      {
        en: '**Booking appointments, catching trains or flights, and giving your address** all depend on numbers in the teens/tens range being heard correctly — the stakes for getting the stress right are genuinely higher here than in most vocabulary.',
        hi: '**Appointments book karna, trains ya flights pakadna, aur apna address dena** sab depend karte hain teens/tens range ke numbers sahi se sune jaane pe — stress sahi karne ke stakes yahan genuinely zyada high hain zyadatar vocabulary se.',
      },
      {
        en: '**Casual daily exchanges** — asking a stranger for the time is one of the most common, lowest-pressure ways to practice a real, short interaction with someone you don\'t know.',
        hi: '**Casual daily exchanges** — ek stranger se time poochna ek sabse common, lowest-pressure tareeka hai kisi ke saath ek real, short interaction practice karne ka jise tum nahi jaante.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it OK to just say the time in numbers, like "it\'s three thirty" instead of "half past three"?',
        qHi: 'Kya time ko sirf numbers mein kehna theek hai, jaise "half past three" ke bajaye "it\'s three thirty"?',
        a: 'Yes, completely — the plain hour-plus-minutes style is just as correct and, in many everyday contexts, more common than "half past" or "quarter to". Use whichever feels more natural to you.',
        aHi: 'Haan, completely — plain hour-plus-minutes style utna hi correct hai aur, kayi everyday contexts mein, "half past" ya "quarter to" se zyada common hai. Jo bhi tumhe zyada natural lage wo use karo.',
      },
      {
        q: 'How do I say times like 3:05 or 3:50 that don\'t fit "quarter" or "half"?',
        qHi: 'Main 3:05 ya 3:50 jaise times kaise kahoon jo "quarter" ya "half" mein fit nahi hote?',
        a: 'Just say the hour and minutes directly: "three oh five" or "three fifty". You can also say "five past three" or "ten to four" — but the plain number style always works and is the simplest to rely on.',
        aHi: 'Bas hour aur minutes directly kaho: "three oh five" ya "three fifty". Tum "five past three" ya "ten to four" bhi keh sakte ho — par plain number style hamesha kaam karta hai aur rely karne ke liye simplest hai.',
      },
    ],

    exercises: [
      {
        task: 'Say these five numbers out loud, exaggerating the stress each time: 13/30, 14/40, 15/50, 16/60, 19/90.',
        taskHi: 'In paanch numbers ko zor se bolo, har baar stress exaggerate karte hue: 13/30, 14/40, 15/50, 16/60, 19/90.',
        hint: 'Teens stress the END ("-TEEN"); tens stress the START ("THIR-", "FOR-", "FIF-").',
        hintHi: 'Teens END pe stress karte hain ("-TEEN"); tens START pe stress karte hain ("THIR-", "FOR-", "FIF-").',
      },
      {
        task: 'Look at a clock or your phone right now and say the current time out loud in both styles: "it\'s [hour] [minutes]" and the "past/to" style.',
        taskHi: 'Abhi ek clock ya apna phone dekho aur current time ko zor se dono styles mein bolo: "it\'s [hour] [minutes]" aur "past/to" style.',
        hint: 'If it\'s not close to :15, :30, or :45, the plain number style ("it\'s four fifty-two") is the easiest to use.',
        hintHi: 'Agar ye :15, :30, ya :45 ke close nahi hai, plain number style ("it\'s four fifty-two") use karne mein sabse easy hai.',
      },
    ],

    keyTakeaways: [
      'Teens stress the end (thirTEEN); tens stress the start (THIRty) — this genuinely changes meaning, not just accent.',
      '"What is the time in your watch?" should become "What time is it?" or "Do you have the time?"',
      '"Half past three" means 3:30 (thirty minutes after); "quarter to four" means 3:45 (fifteen minutes before).',
      'The plain hour-plus-minutes style ("three forty-five") is just as correct as "quarter to four," and often more common.',
      'When a number in the teens/tens range genuinely matters (address, price, time), say it slowly with clear stress.',
    ],
    keyTakeawaysHi: [
      'Teens end pe stress karte hain (thirTEEN); tens start pe stress karte hain (THIRty) — ye genuinely meaning change karta hai, sirf accent nahi.',
      '"What is the time in your watch?" "What time is it?" ya "Do you have the time?" ban jaana chahiye.',
      '"Half past three" ka matlab 3:30 hai (thirty minutes baad); "quarter to four" ka matlab 3:45 hai (fifteen minutes pehle).',
      'Plain hour-plus-minutes style ("three forty-five") utna hi correct hai jitna "quarter to four," aur often zyada common.',
      'Jab teens/tens range mein ek number genuinely matter karta hai (address, price, time), ise slowly clear stress ke saath bolo.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-daily-routine-simple-present',
    title: 'Daily Routine — Simple Present for Habits',
    titleHi: 'Daily Routine — Habits Ke Liye Simple Present',
    description:
      'Why "I wake up at 6am" is right and "I am waking up at 6am daily" is not — the single highest-value fix in this whole module.',
    descriptionHi:
      '"I wake up at 6am" kyun sahi hai aur "I am waking up at 6am daily" kyun nahi — is poore module ka single highest-value fix.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Simple present is a photo of a routine; "-ing" is a video of something happening right now.** "I wake up at 6am" is a snapshot true every single day. "I am waking up" describes one specific moment happening as you speak — you can\'t use a video to describe something that happens every day, and you can\'t use a photo to describe something happening live.',
      hi: 'Simple present ek routine ki photo hai; "-ing" ek video hai kisi cheez ka jo abhi ho raha hai. "I wake up at 6am" ek snapshot hai jo har din true hai. "I am waking up" ek specific moment describe karta hai jo tum bolte waqt ho raha hai — tum ek video use nahi kar sakte kisi cheez describe karne ke liye jo har din hoti hai, aur ek photo use nahi kar sakte kisi cheez describe karne ke liye jo live ho rahi hai.',
    },

    simple: `**For habits, routines, and facts, use simple present — no "-ing":**

- "I wake up at 6am." (habit, every day)
- "She works in an office." (fact, generally true)
- "We eat dinner at 8pm." (routine)

**Reserve "-ing" (present continuous) for RIGHT NOW, in this exact
moment:**

- "I am waking up right now." (happening as you speak — unusual to
  actually say this, but shows the rule)
- "She is working right now." (currently, at this moment)

**Adding "daily," "every day," "usually," or "always" is a strong
signal you need simple present, not "-ing":**

"I am going to the gym daily" → "I go to the gym daily" ✓

**Third person needs an extra "s" that "I/you/we/they" don't:**

I wake up · you wake up · **she wakes up** · we wake up · **he
goes** to work · they wake up`,
    simpleHi: `**Habits, routines, aur facts ke liye, simple present use karo — koi "-ing" nahi:**

- "I wake up at 6am." (habit, har din)
- "She works in an office." (fact, generally true)
- "We eat dinner at 8pm." (routine)

**"-ing" (present continuous) ko RIGHT NOW, is exact moment ke liye
reserve karo:**

- "I am waking up right now." (bolte waqt ho raha hai — actually ye
  kehna unusual hai, par rule dikhata hai)
- "She is working right now." (currently, is moment pe)

**"daily," "every day," "usually," ya "always" add karna ek strong
signal hai ki tumhe simple present chahiye, "-ing" nahi:**

"I am going to the gym daily" → "I go to the gym daily" ✓

**Third person ko ek extra "s" chahiye jo "I/you/we/they" ko nahi
chahiye:**

I wake up · you wake up · **she wakes up** · we wake up · **he
goes** to work · they wake up`,

    content: `**Why "I am waking up at 6am daily" is this module's single most
important correction.**

Hindi's present continuous ("main uth raha hoon") genuinely covers
more ground than English's does — it comfortably describes both "I am
waking up right now" AND, in many everyday Hindi sentences, a general
habit. English draws a hard, non-negotiable line between the two: a
routine or habit is simple present ("I wake up"), and only a specific
action truly happening at the moment of speaking is "-ing" ("I am
waking up"). This single grammar difference is the real source of one
of the most frequent, most noticeable patterns in Hindi-speaker
English — sentences like "I am going to gym daily," "I am doing this
job since 2019," "she is liking this song" all come from the same root
cause.

**The clearest test: can you add "right now" to the sentence and have
it still make sense?** "I am waking up right now" — makes sense, use
"-ing". "I wake up right now" — doesn't fit, because "right now" and a
routine don't belong in the same sentence. If a time word like "daily,"
"every day," "usually," "often," or "always" is already in the
sentence, that's your signal: use simple present, never "-ing".

**Third-person -s is a small, separate rule easy to forget while
focused on the bigger continuous-tense issue.** "She wake up" (missing
the -s) is a different, smaller mistake than "she is waking up daily"
(wrong tense entirely) — both are common, but the fix for each is
different, so it helps to think about them as two separate checks:
first, is this a habit (simple present) or a right-now action
("-ing")? Second, if it's simple present and the subject is he/she/it,
does the verb have its -s?

**Sequencing words turn a list of separate facts into a genuine
routine.** "First, I wake up. Then, I have breakfast. After that, I
go to work" reads as a real routine being described, not just five
disconnected facts — "first," "then," "after that," and "finally" are
doing real, useful work here.`,
    contentHi: `**"I am waking up at 6am daily" is module ka single sabse important correction kyun hai.**

Hindi ka present continuous ("main uth raha hoon") genuinely English
se zyada ground cover karta hai — ye comfortably "I am waking up right
now" DONO describe karta hai AUR, kayi everyday Hindi sentences mein,
ek general habit bhi. English in dono ke beech ek hard, non-negotiable
line kheenchti hai: ek routine ya habit simple present hai ("I wake
up"), aur sirf ek specific action jo truly bolte waqt ho raha hai
"-ing" hai ("I am waking up"). Ye single grammar difference Hindi-
speaker English ke sabse frequent, sabse noticeable patterns mein se ek
ka real source hai — sentences jaise "I am going to gym daily," "I am
doing this job since 2019," "she is liking this song" sab same root
cause se aate hain.

**Sabse clear test: kya tum sentence mein "right now" add kar sakte ho
aur wo phir bhi make sense kare?** "I am waking up right now" — make
sense karta hai, "-ing" use karo. "I wake up right now" — fit nahi
karta, kyunki "right now" aur ek routine same sentence mein belong
nahi karte. Agar ek time word jaise "daily," "every day," "usually,"
"often," ya "always" already sentence mein hai, ye tumhara signal hai:
simple present use karo, kabhi "-ing" nahi.

**Third-person -s ek chhota, separate rule hai jise bigger continuous-
tense issue pe focus karte waqt bhoolna aasan hai.** "She wake up"
(-s missing) ek different, chhoti mistake hai "she is waking up daily"
(poori tarah galat tense) se — dono common hain, par har ek ka fix
alag hai, isliye inhe do separate checks ki tarah sochna helpful hai:
pehla, kya ye ek habit hai (simple present) ya ek right-now action
("-ing")? Doosra, agar ye simple present hai aur subject he/she/it hai,
kya verb mein uska -s hai?

**Sequencing words alag facts ki ek list ko ek genuine routine mein
badal dete hain.** "First, I wake up. Then, I have breakfast. After
that, I go to work" ek real routine describe hote hue padhta hai,
sirf paanch disconnected facts nahi — "first," "then," "after that,"
aur "finally" yahan real, useful kaam kar rahe hain.`,

    readingPassage: `Let me tell you about my daily routine. First, I wake up at six o'clock. Then, I have breakfast with my family. After that, I go to work. I usually work for eight hours. In the evening, I come back home, and I have dinner at eight. Finally, I read a book before I sleep. This is my routine every single day.`,
    readingPassageHi: `Main tumhe apni daily routine ke baare mein batata hoon. First, main six o'clock pe wake up karta hoon. Then, main apni family ke saath breakfast karta hoon. After that, main kaam pe jaata hoon. Main usually eight hours kaam karta hoon. Evening mein, main ghar wapas aata hoon, aur main eight baje dinner karta hoon. Finally, main sone se pehle ek kitaab padhta hoon. Ye meri routine har single din hai.`,

    vocabulary: [
      {
        word: 'wake up',
        wordHi: 'wake up (jaagna/uthna)',
        meaning: 'to stop sleeping',
        meaningHi: 'sona band karna',
        example: 'I wake up at six every morning.',
        exampleHi: 'I wake up at six every morning.',
        pronunciation: 'weyk up',
      },
      {
        word: 'routine',
        wordHi: 'routine (dinacharya)',
        meaning: 'a fixed pattern of things you do regularly',
        meaningHi: 'ek fixed pattern jo tum regularly karte ho',
        example: 'My morning routine takes about an hour.',
        exampleHi: 'My morning routine takes about an hour.',
        pronunciation: 'roo-TEEN',
      },
      {
        word: 'usually',
        wordHi: 'usually (aam taur pe)',
        meaning: 'most of the time; as a general habit',
        meaningHi: 'zyadatar time; ek general habit ke roop mein',
        example: 'I usually have tea in the morning.',
        exampleHi: 'I usually have tea in the morning.',
        pronunciation: 'YOO-zhoo-uh-lee',
      },
      {
        word: 'finally',
        wordHi: 'finally (aakhir mein)',
        meaning: 'as the last step, after everything else',
        meaningHi: 'last step ki tarah, baaki sab kuch ke baad',
        example: 'Finally, I go to sleep around eleven.',
        exampleHi: 'Finally, I go to sleep around eleven.',
        pronunciation: 'FY-nuh-lee',
      },
    ],

    examples: [
      {
        title: 'A full routine using simple present and sequencing words',
        titleHi: 'Ek poori routine simple present aur sequencing words use karte hue',
        code: `First, I wake up at 6:30. Then, I go for a short walk. After that, I get ready for work. I usually leave the house by 9. In the evening, I come back around 7, and finally, I relax and watch something before bed.`,
        output: 'Six habitual actions, all in simple present, joined by sequencing words.',
        explain:
          'Notice every single verb stays in simple present — "wake up," "go," "get ready," "leave," "come back," "relax" — none of them switch to "-ing", because every one of them is a routine, not a right-now action.',
        explainHi:
          'Notice karo har single verb simple present mein rehta hai — "wake up," "go," "get ready," "leave," "come back," "relax" — koi bhi "-ing" mein switch nahi hota, kyunki har ek routine hai, right-now action nahi.',
      },
      {
        title: 'The exact fix: continuous tense wrongly used for a habit',
        titleHi: 'Exact fix: continuous tense galat se ek habit ke liye use hua',
        code: `Wrong: I am going to the gym daily since last month.
Right: I go to the gym daily. I've been doing it since last month.`,
        output: 'The habit itself uses simple present; only the duration needs a different structure.',
        explain:
          'The habit ("go to the gym") is simple present. The idea of "since last month" is better expressed with "I\'ve been doing it since..." — a slightly more advanced structure this course returns to later, but simple present alone already fixes the main error here.',
        explainHi:
          'Habit ("go to the gym") simple present hai. "Since last month" ka idea "I\'ve been doing it since..." se better express hota hai — ek thoda zyada advanced structure jispe ye course baad mein wapas aata hai, par akela simple present already yahan main error fix kar deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"I am waking up at 6am daily."',
        right: '"I wake up at 6am every day."',
        why: 'A daily habit needs simple present, not "-ing". The word "daily" is itself a strong signal that continuous tense is the wrong choice — a habit is never something happening only in this one moment.',
        whyHi: 'Ek daily habit ko simple present chahiye, "-ing" nahi. Word "daily" khud ek strong signal hai ki continuous tense galat choice hai — ek habit kabhi kuch aisa nahi hota jo sirf is ek moment mein ho raha ho.',
      },
      {
        wrong: '"She go to work at nine." (missing the third-person -s)',
        right: '"She goes to work at nine."',
        why: 'He/she/it in simple present always needs an -s on the verb. This is a separate, smaller rule from the continuous-tense issue, easy to still get wrong even after fixing the bigger mistake.',
        whyHi: 'Simple present mein he/she/it ko hamesha verb pe -s chahiye. Ye continuous-tense issue se ek separate, chhota rule hai, jise bigger mistake fix karne ke baad bhi galat karna aasan hai.',
      },
    ],

    realWorld: [
      {
        en: '**Describing your work schedule or routine in an interview or to a new colleague** — "I usually start work at 9 and finish around 6" is one of the most commonly needed sentences in professional small talk.',
        hi: '**Apna work schedule ya routine describe karna ek interview mein ya ek nayi colleague ko** — "I usually start work at 9 and finish around 6" professional small talk mein sabse commonly needed sentences mein se ek hai.',
      },
      {
        en: '**Health and lifestyle conversations** ("How often do you exercise?", "What time do you usually sleep?") are built almost entirely on this exact simple-present-for-habits pattern.',
        hi: '**Health aur lifestyle conversations** ("How often do you exercise?", "What time do you usually sleep?") almost poori tarah is exact simple-present-for-habits pattern pe bani hoti hain.',
      },
    ],

    interviewQA: [
      {
        q: 'If something is a habit I started recently, like going to the gym for the last month, which tense should I use?',
        qHi: 'Agar kuch ek habit hai jo maine recently start ki hai, jaise pichhle mahine se gym jaana, mujhe kaunsa tense use karna chahiye?',
        a: 'The habit itself is still simple present: "I go to the gym." To add when it started, "I\'ve been going to the gym since last month" is the natural way — a structure this course covers properly later, but for now, keep the habit itself in simple present regardless of how recently it started.',
        aHi: 'Habit khud abhi bhi simple present hai: "I go to the gym." Ye kab start hui add karne ke liye, "I\'ve been going to the gym since last month" natural tareeka hai — ek structure jo ye course baad mein properly cover karta hai, par abhi ke liye, habit khud simple present mein rakho chahe ye kitni recently start hui ho.',
      },
      {
        q: 'Is "-ing" ever correct for something that happens regularly?',
        qHi: 'Kya "-ing" kabhi correct hai kisi cheez ke liye jo regularly hoti hai?',
        a: 'Rarely, and only for a temporary phase, not a permanent habit — "I\'m working late this week" (temporary, this week only) versus "I work late on Fridays" (a permanent, ongoing routine). If in doubt, a genuine daily/weekly routine is almost always simple present.',
        aHi: 'Rarely, aur sirf ek temporary phase ke liye, ek permanent habit ke liye nahi — "I\'m working late this week" (temporary, sirf is week) versus "I work late on Fridays" (ek permanent, ongoing routine). Agar doubt ho, ek genuine daily/weekly routine almost hamesha simple present hoti hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, describe your own morning routine using at least four simple-present verbs and two sequencing words (first, then, after that, finally).',
        taskHi: 'Zor se, apni morning routine describe karo kam se kam char simple-present verbs aur do sequencing words use karke (first, then, after that, finally).',
        hint: '"First, I... Then, I... After that, I... Finally, I..." — fill each gap with a real habit from your actual morning.',
        hintHi: '"First, I... Then, I... After that, I... Finally, I..." — har gap ko apni actual morning ke ek real habit se bharo.',
      },
      {
        task: 'Say this corrected out loud: "My brother is working in Delhi since two years and he is going to office daily." Find and fix both tense mistakes.',
        taskHi: 'Ise zor se correct karke bolo: "My brother is working in Delhi since two years and he is going to office daily." Dono tense mistakes dhoondo aur fix karo.',
        hint: '"My brother has been working in Delhi for two years, and he goes to the office daily." (habit = simple present; duration needs a different structure covered later in this course)',
        hintHi: '"My brother has been working in Delhi for two years, and he goes to the office daily." (habit = simple present; duration ko ek alag structure chahiye jo is course mein baad mein cover hoga)',
      },
    ],

    keyTakeaways: [
      'Habits, routines, and facts use simple present ("I wake up"); only a right-now action uses "-ing" ("I am waking up").',
      '"Daily," "every day," "usually," and "always" are strong signals that simple present is correct, not "-ing".',
      'This single grammar difference is the source of some of the most common Hindi-speaker English patterns — worth fixing deliberately.',
      'He/she/it in simple present always needs an -s on the verb ("she wakes up") — a separate, smaller rule from the tense choice itself.',
      'Sequencing words (first, then, after that, finally) turn a list of habits into a real, connected routine.',
    ],
    keyTakeawaysHi: [
      'Habits, routines, aur facts simple present use karte hain ("I wake up"); sirf ek right-now action "-ing" use karta hai ("I am waking up").',
      '"Daily," "every day," "usually," aur "always" strong signals hain ki simple present correct hai, "-ing" nahi.',
      'Ye single grammar difference kuch sabse common Hindi-speaker English patterns ka source hai — deliberately fix karne layak.',
      'Simple present mein he/she/it ko hamesha verb pe -s chahiye ("she wakes up") — tense choice se ek separate, chhota rule.',
      'Sequencing words (first, then, after that, finally) habits ki ek list ko ek real, connected routine mein badal dete hain.',
    ],
  },
];
