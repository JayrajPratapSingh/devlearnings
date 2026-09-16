/**
 * English Speaking Complete Course — Module 12: Comparing,
 * Contrasting & Giving Reasons, lessons 1-3. Closes Part IV
 * (Expressing Yourself).
 *
 * Lesson 1: Because/so — cause and effect, and the direction each
 *           connector points in.
 * Lesson 2: But/although/however — contrast connectors and the real
 *           difference in how formal or spoken each one feels.
 * Lesson 3: Combining connectors into one longer, more fluent-sounding
 *           sentence — the payoff lesson that closes Part IV by tying
 *           this module's connectors to the whole course so far.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_12: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-because-so-cause-and-effect',
    title: 'Because & So — Cause and Effect',
    titleHi: 'Because Aur So — Cause Aur Effect',
    description:
      '"I stayed home because it was raining" and "It was raining, so I stayed home" say the same thing in opposite directions — and only one connector fits each direction.',
    descriptionHi:
      '"I stayed home because it was raining" aur "It was raining, so I stayed home" same cheez opposite directions mein kehte hain — aur sirf ek connector har direction ko fit karta hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**"Because" points backward to the reason; "so" points forward to the result — like an arrow that can only face one way at a time.** "I stayed home because it was raining" points back at the rain as the reason. "It was raining, so I stayed home" points forward from the rain to what happened next.',
      hi: '"Because" backward point karta hai reason ki taraf; "so" forward point karta hai result ki taraf — ek arrow jaisa jo ek time pe sirf ek taraf face kar sakta hai. "I stayed home because it was raining" peeche point karta hai rain ki taraf as the reason. "It was raining, so I stayed home" aage point karta hai rain se jo baad mein hua.',
    },

    simple: `**"Because" introduces the REASON — it can go in the middle or at
the start of a sentence:**

"I stayed home **because** it was raining." · "**Because** it was
raining, I stayed home."

**"So" introduces the RESULT — it always comes after the reason,
never before it:**

"It was raining, **so** I stayed home." (not "So I stayed home, it
was raining.")

**A simple way to remember the direction:**

reason **because** result ← reason is the point
reason, **so** result ← result is the point

**Both are correct — the choice depends on which part you want to
emphasize:**

Emphasize the reason: "I stayed home because it was raining."
Emphasize the result: "It was raining, so I stayed home."`,
    simpleHi: `**"Because" REASON introduce karta hai — ye sentence ke middle ya
start mein ja sakta hai:**

"I stayed home **because** it was raining." · "**Because** it was
raining, I stayed home."

**"So" RESULT introduce karta hai — ye hamesha reason ke baad aata
hai, kabhi pehle nahi:**

"It was raining, **so** I stayed home." ("So I stayed home, it was
raining." nahi)

**Direction yaad rakhne ka ek simple tareeka:**

reason **because** result ← reason point hai
reason, **so** result ← result point hai

**Dono correct hain — choice is baat pe depend karta hai ki tum kaunsa
part emphasize karna chahte ho:**

Reason emphasize karo: "I stayed home because it was raining."
Result emphasize karo: "It was raining, so I stayed home."`,

    content: `**Why the same two facts can be joined in two genuinely different
ways, with a real difference in emphasis.**

"Because" and "so" both connect a cause and an effect, but they
structure a sentence around a different piece of information as the
main point. Starting with "because" tends to foreground the
explanation itself, useful when someone is asking "why?" Starting with
the situation and following it with "so" foregrounds the outcome,
useful when the result is what actually matters to the listener right
now.

**"Because" can appear in two positions with a small punctuation
difference.** "I stayed home because it was raining" (no comma needed,
"because" clause at the end) versus "Because it was raining, I stayed
home" (a comma needed after the introductory clause, when "because"
opens the sentence). Both orders are equally correct and common in
speech.

**"So" has a fixed position: it always follows the reason, connecting
forward to the result — it cannot open a sentence to introduce a
reason the way "because" can.** This isn't arbitrary; "so" specifically
signals "and therefore," which requires the cause to already be stated
before it can point forward to an effect.

**A common, specific slip worth flagging: using both "because" and
"so" in the same sentence for the same logical link**, like "Because
it was raining, so I stayed home." English uses one connector or the
other for a single cause-effect relationship, not both together — this
double-marking pattern likely comes from a Hindi sentence structure
where both directions can be marked at once, but it reads as redundant
in English.`,
    contentHi: `**Same do facts ko do genuinely different tareekon se kaise joda ja sakta hai, emphasis mein ek real difference ke saath.**

"Because" aur "so" dono ek cause aur ek effect ko connect karte hain,
par wo ek sentence ko ek different information ke piece ke around
structure karte hain main point ki tarah. "Because" se start karna
explanation ko khud foreground karta hai, useful jab koi "why?" poochh
raha ho. Situation se start karna aur ise "so" se follow karna outcome
ko foreground karta hai, useful jab result wo cheez hai jo listener ko
abhi actually matter karti hai.

**"Because" do positions mein appear ho sakta hai ek chhoti punctuation
difference ke saath.** "I stayed home because it was raining" (koi
comma zaroorat nahi, "because" clause end mein) versus "Because it was
raining, I stayed home" (ek comma zaroorat introductory clause ke
baad, jab "because" sentence open karta hai). Dono orders equally
correct aur common hain speech mein.

**"So" ki ek fixed position hai: ye hamesha reason follow karta hai,
forward connect karte hue result ki taraf — ye ek sentence open nahi
kar sakta ek reason introduce karne ke liye jaise "because" kar sakta
hai.** Ye arbitrary nahi hai; "so" specifically "and therefore" signal
karta hai, jise cause ko already stated hona chahiye pehle isse ek
effect ki taraf forward point karne se pehle.

**Ek common, specific slip jo flag karne layak hai: same sentence mein
same logical link ke liye "because" aur "so" dono use karna**, jaise
"Because it was raining, so I stayed home." English ek single cause-
effect relationship ke liye ek connector ya doosra use karti hai, dono
saath mein nahi — ye double-marking pattern likely ek Hindi sentence
structure se aata hai jahan dono directions ek saath mark ho sakte
hain, par English mein ye redundant padhta hai.`,

    readingPassage: `I was late to work today because my alarm didn't go off. Because I was late, I missed the morning meeting. My manager understood, so it wasn't a big problem. I felt bad about it, so I decided to set two alarms from now on.`,
    readingPassageHi: `Main aaj kaam pe late tha because meri alarm nahi baji. Because I was late, maine morning meeting miss ki. Mere manager ko samajh aa gaya, so it wasn't a big problem. Mujhe iske baare mein bura laga, so maine decide kiya ab se do alarms set karunga.`,

    vocabulary: [
      {
        word: 'because',
        wordHi: 'because (kyunki)',
        meaning: 'used to introduce the reason for something',
        meaningHi: 'kisi cheez ke reason ko introduce karne ke liye use hota hai',
        example: 'I was late because of traffic.',
        exampleHi: 'I was late because of traffic.',
        pronunciation: 'bi-KAWZ',
      },
      {
        word: 'so',
        wordHi: 'so (isliye)',
        meaning: 'used to introduce a result',
        meaningHi: 'ek result ko introduce karne ke liye use hota hai',
        example: 'It was raining, so I took an umbrella.',
        exampleHi: 'It was raining, so I took an umbrella.',
        pronunciation: 'soh',
      },
      {
        word: 'alarm',
        wordHi: 'alarm (alarm)',
        meaning: 'a device or sound that wakes you up or warns you',
        meaningHi: 'ek device ya sound jo tumhe jagata hai ya warn karta hai',
        example: 'My alarm didn\'t go off this morning.',
        exampleHi: 'My alarm didn\'t go off this morning.',
        pronunciation: 'uh-LAHRM',
      },
      {
        word: 'reason',
        wordHi: 'reason (karan)',
        meaning: 'the cause or explanation for something',
        meaningHi: 'kisi cheez ka cause ya explanation',
        example: 'What\'s the reason for the delay?',
        exampleHi: 'What\'s the reason for the delay?',
        pronunciation: 'REE-zuhn',
      },
    ],

    examples: [
      {
        title: 'The same fact pair joined both ways',
        titleHi: 'Same fact pair dono tareekon se joda gaya',
        code: `Emphasizing the reason: I was tired because I didn't sleep well.
Emphasizing the result: I didn't sleep well, so I was tired.`,
        output: 'Same two facts, structured around a different point of emphasis.',
        explain:
          'Saying both versions out loud back to back helps you feel the subtle shift in what each sentence is really "about," even though the underlying facts are identical.',
        explainHi:
          'Dono versions ko back to back zor se bolna help karta hai feel karne mein subtle shift jo har sentence really "about" hai, chahe underlying facts identical hon.',
      },
      {
        title: '"Because" opening a sentence, with a comma',
        titleHi: '"Because" ek sentence open kar raha hai, ek comma ke saath',
        code: `Because the store was closed, we went home empty-handed.`,
        output: 'The introductory "because" clause is followed by a comma before the main clause.',
        explain:
          'This is a completely natural, common way to open a sentence — notice the comma marks the boundary between the reason clause and the main clause that follows.',
        explainHi:
          'Ye ek completely natural, common tareeka hai ek sentence open karne ka — notice karo comma reason clause aur us main clause ke beech ki boundary mark karta hai jo follow karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"Because it was raining, so I stayed home." (using both connectors for the same link)',
        right: '"Because it was raining, I stayed home." OR "It was raining, so I stayed home."',
        why: 'English uses just one connector — "because" or "so" — for a single cause-effect relationship, never both together. Using both is redundant, even though it can feel natural coming from a sentence structure that marks both directions at once.',
        whyHi: 'English ek single cause-effect relationship ke liye sirf ek connector use karti hai — "because" ya "so" — kabhi dono saath nahi. Dono use karna redundant hai, chahe ye ek sentence structure se natural feel ho jo dono directions ko ek saath mark karti hai.',
      },
      {
        wrong: '"So I stayed home, it was raining." (putting "so" before the reason)',
        right: '"It was raining, so I stayed home."',
        why: '"So" always follows the reason and points forward to the result — it can never introduce a sentence before the cause has been stated.',
        whyHi: '"So" hamesha reason follow karta hai aur result ki taraf forward point karta hai — ye kabhi ek sentence introduce nahi kar sakta cause state hone se pehle.',
      },
    ],

    realWorld: [
      {
        en: '**Explaining a delay, a decision, or a mistake at work** ("I missed the deadline because the client changed the requirements") relies directly on cleanly connecting cause and effect.',
        hi: '**Kaam pe ek delay, decision, ya mistake explain karna** ("I missed the deadline because the client changed the requirements") directly cause aur effect ko cleanly connect karne pe rely karta hai.',
      },
      {
        en: '**Telling a story or explaining what happened and why** in everyday conversation depends heavily on switching naturally between "because" and "so" depending on what you want to emphasize.',
        hi: '**Ek story batana ya explain karna kya hua aur kyun** everyday conversation mein heavily "because" aur "so" ke beech naturally switch karne pe depend karta hai depending on jo tum emphasize karna chahte ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it wrong to start a sentence with "Because"?',
        qHi: 'Kya "Because" se ek sentence start karna galat hai?',
        a: 'No, this is a common myth — "Because it was raining, I stayed home" is completely correct as long as the "because" clause is followed by a comma and a complete main clause. What\'s actually incorrect is leaving a "because" clause standing alone with no main clause attached at all ("Because it was raining." as a complete sentence).',
        aHi: 'Nahi, ye ek common myth hai — "Because it was raining, I stayed home" completely correct hai jab tak "because" clause ke baad ek comma aur ek complete main clause ho. Jo actually incorrect hai wo ek "because" clause ko akela chhodna bina kisi main clause ke attach kiye ("Because it was raining." ek complete sentence ki tarah).',
      },
      {
        q: 'Can "so" ever mean something other than "therefore" in casual speech?',
        qHi: 'Kya "so" kabhi casual speech mein "therefore" ke alawa kuch aur mean kar sakta hai?',
        a: 'Yes — casually, "so" is also used just to start a new topic or story ("So, I saw this movie yesterday...") without a strict cause-effect meaning. That\'s a separate, conversational use, distinct from the cause-effect "so" this lesson focuses on.',
        aHi: 'Haan — casually, "so" ek naya topic ya story start karne ke liye bhi use hota hai ("So, I saw this movie yesterday...") bina ek strict cause-effect meaning ke. Ye ek separate, conversational use hai, us cause-effect "so" se distinct jispe ye lesson focus karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, join these two facts using "because": "I was happy." + "I got good news."',
        taskHi: 'Zor se, in do facts ko "because" use karke jodo: "I was happy." + "I got good news."',
        hint: '"I was happy because I got good news."',
        hintHi: '"I was happy because I got good news."',
      },
      {
        task: 'Out loud, join the same two facts using "so" instead, changing which fact comes first.',
        taskHi: 'Zor se, same do facts ko "so" use karke jodo iske bajaye, ye change karte hue kaunsa fact pehle aata hai.',
        hint: '"I got good news, so I was happy."',
        hintHi: '"I got good news, so I was happy."',
      },
    ],

    keyTakeaways: [
      '"Because" introduces the reason and can appear mid-sentence or at the start (with a comma).',
      '"So" introduces the result and always follows the reason — it can never open a sentence.',
      'Never use both "because" and "so" together for the same cause-effect link — pick one.',
      'The choice between them shifts emphasis: "because" foregrounds the reason, "so" foregrounds the result.',
      'It\'s completely correct to start a sentence with "Because," as long as a full main clause follows the comma.',
    ],
    keyTakeawaysHi: [
      '"Because" reason introduce karta hai aur mid-sentence ya start mein appear ho sakta hai (ek comma ke saath).',
      '"So" result introduce karta hai aur hamesha reason follow karta hai — ye kabhi ek sentence open nahi kar sakta.',
      'Kabhi "because" aur "so" dono ek saath same cause-effect link ke liye use mat karo — ek choose karo.',
      'Inke beech choice emphasis shift karti hai: "because" reason ko foreground karta hai, "so" result ko foreground karta hai.',
      'Ek sentence ko "Because" se start karna completely correct hai, jab tak comma ke baad ek full main clause follow kare.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-but-although-however',
    title: 'But, Although & However — Showing Contrast',
    titleHi: 'But, Although Aur However — Contrast Dikhana',
    description:
      'Three ways to say "on the other hand" — one casual, one flexible, one that belongs mostly in writing and formal speech.',
    descriptionHi:
      '"On the other hand" kehne ke teen tareeke — ek casual, ek flexible, ek jo mostly writing aur formal speech mein belong karta hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**"But," "although," and "however" all turn a sentence around a corner — they just do it with a different level of formality, like three ways to say "actually, wait" in casual chat, an essay, and a courtroom.** All three point the same direction; they just dress differently.',
      hi: '"But," "although," aur "however" sab ek sentence ko ek corner ke around ghumate hain — wo bas ise ek different formality level ke saath karte hain, jaise "actually, wait" kehne ke teen tareeke casual chat, ek essay, aur ek courtroom mein. Teeno same direction point karte hain; wo bas differently dress karte hain.',
    },

    simple: `**"But" joins two contrasting clauses in one sentence — the most
casual, common option:**

"I wanted to go, **but** I was too tired."

**"Although" can start OR sit in the middle of a sentence, joining
two ideas with a slightly more flexible, natural-sounding contrast:**

"**Although** I was tired, I went anyway." · "I went anyway,
**although** I was tired."

**"However" usually starts its OWN sentence, often after a period or
semicolon — more formal, more common in writing:**

"I was tired. **However**, I went anyway." · "I was tired; **however**,
I went anyway."

**A quick way to choose**: "but" for casual speech, "although" for
either speech or slightly more careful writing, "however" for formal
writing or a more deliberate, considered spoken point.`,
    simpleHi: `**"But" ek sentence mein do contrasting clauses joda hai — sabse
casual, common option:**

"I wanted to go, **but** I was too tired."

**"Although" ek sentence start YA middle mein baith sakta hai, do
ideas ko ek thoda zyada flexible, natural-sounding contrast se jode
hue:**

"**Although** I was tired, I went anyway." · "I went anyway,
**although** I was tired."

**"However" usually apna OWN sentence start karta hai, often ek
period ya semicolon ke baad — zyada formal, writing mein zyada
common:**

"I was tired. **However**, I went anyway." · "I was tired; **however**,
I went anyway."

**Choose karne ka ek quick tareeka**: "but" casual speech ke liye,
"although" ya to speech ke liye ya thodi zyada careful writing ke
liye, "however" formal writing ya ek zyada deliberate, considered
spoken point ke liye.`,

    content: `**Why these three words, all meaning roughly "contrast," genuinely
occupy different registers.**

"But" is the default, unmarked choice in everyday spoken English —
short, simple, and appropriate almost everywhere casual. "Although"
sits a step up in formality while still working comfortably in
speech; it also has genuine structural flexibility, able to open a
sentence or sit in the middle without changing meaning. "However" is
the most formal of the three, most commonly appearing at the start of
its own sentence in writing, and while it's used in speech too, it
tends to signal a more deliberate, considered point rather than a
quick, casual aside.

**Punctuation genuinely differs between them, and getting it wrong is
a common, specific mistake.** "But" never gets a comma before the main
clause it's joining within one sentence. "However" at the start of a
sentence is typically followed by a comma: "However, I went anyway."
Mixing up these punctuation patterns is a small, technical detail
that mostly matters in writing rather than speech.

**"Although" clauses can come first or second with zero change in
meaning, which is genuinely useful flexibility.** "Although I was
tired, I went" and "I went, although I was tired" communicate exactly
the same contrast — choosing the order is purely about which part you
want the listener to hear first, a stylistic choice rather than a
grammatical one.

**Overusing "however" in casual speech can sound stiff or
overly formal**, the linguistic equivalent of using very formal
vocabulary in a relaxed setting. For everyday spoken contrast, "but"
is usually the more natural default, with "although" as a good
alternative when a sentence has already used "but" recently and needs
some variety.`,
    contentHi: `**Ye teen words, sab roughly "contrast" mean karte hain, genuinely different registers kyun occupy karte hain.**

"But" everyday spoken English mein default, unmarked choice hai —
short, simple, aur almost har jagah casually appropriate. "Although"
formality mein ek step upar baithta hai jabki phir bhi speech mein
comfortably kaam karta hai; iski genuine structural flexibility bhi
hai, ek sentence open karne ya middle mein baithne mein saksham, bina
meaning change kiye. "However" teeno mein sabse formal hai, most
commonly writing mein apne own sentence ke start mein appear karta
hai, aur chahe ye speech mein bhi use hota hai, ye ek zyada
deliberate, considered point signal karta hai, ek quick, casual aside
nahi.

**Punctuation genuinely inke beech differ karti hai, aur ise galat
karna ek common, specific mistake hai.** "But" ko kabhi ek comma nahi
milta us main clause se pehle jise ye ek sentence ke andar joda hai.
"However" sentence ke start mein typically ek comma se follow hota
hai: "However, I went anyway." In punctuation patterns ko mix up karna
ek chhota, technical detail hai jo mostly writing mein matter karta
hai, speech mein nahi.

**"Although" clauses pehle ya doosre aa sakte hain zero meaning change
ke saath, jo genuinely useful flexibility hai.** "Although I was
tired, I went" aur "I went, although I was tired" exactly same
contrast communicate karte hain — order choose karna purely is baare
mein hai ki tum kaunsa part listener ko pehle sunwana chahte ho, ek
stylistic choice hai, grammatical nahi.

**Casual speech mein "however" ko overuse karna stiff ya overly
formal sound kar sakta hai**, ek relaxed setting mein bahut formal
vocabulary use karne ka linguistic equivalent. Everyday spoken
contrast ke liye, "but" usually zyada natural default hai, "although"
ek achha alternative hai jab ek sentence ne recently "but" already
use kiya ho aur kuch variety chahiye.`,

    readingPassage: `I really wanted to go to the party, but I had too much work. Although I was disappointed, I understood it was the right choice. My friend said the party was fun. However, she also said she left early because she was tired. I guess everyone has their limits.`,
    readingPassageHi: `Main really party mein jaana chahta tha, but I had too much work. Although main disappointed tha, main samajhta tha ki ye right choice thi. Mere friend ne kaha party fun thi. However, usne bhi kaha ki wo jaldi chali gayi kyunki wo tired thi. Guess sabki apni limits hoti hain.`,

    vocabulary: [
      {
        word: 'although',
        wordHi: 'although (halanki)',
        meaning: 'despite the fact that; used to show contrast',
        meaningHi: 'is fact ke bawajood ki; contrast dikhane ke liye use hota hai',
        example: 'Although it was raining, we went for a walk.',
        exampleHi: 'Although it was raining, we went for a walk.',
        pronunciation: 'awl-DHOH',
      },
      {
        word: 'however',
        wordHi: 'however (phir bhi/lekin)',
        meaning: 'used to introduce a contrasting idea, usually at the start of a sentence',
        meaningHi: 'ek contrasting idea introduce karne ke liye use hota hai, usually sentence ke start mein',
        example: 'I was tired. However, I finished the work.',
        exampleHi: 'I was tired. However, I finished the work.',
        pronunciation: 'how-EV-er',
      },
      {
        word: 'disappointed',
        wordHi: 'disappointed (nirash)',
        meaning: 'feeling sad because something didn\'t happen as hoped',
        meaningHi: 'sad feel karna kyunki kuch hope ki tarah nahi hua',
        example: 'I was disappointed that I couldn\'t go.',
        exampleHi: 'I was disappointed that I couldn\'t go.',
        pronunciation: 'dis-uh-POYN-tid',
      },
      {
        word: 'limit',
        wordHi: 'limit (seema)',
        meaning: 'the point beyond which something cannot continue',
        meaningHi: 'wo point jiske aage kuch continue nahi ho sakta',
        example: 'Everyone has their own limits.',
        exampleHi: 'Everyone has their own limits.',
        pronunciation: 'LIM-it',
      },
    ],

    examples: [
      {
        title: 'The same contrast in three registers',
        titleHi: 'Same contrast teen registers mein',
        code: `Casual: I wanted to go, but I was too tired.
Flexible: Although I was tired, I wanted to go.
Formal: I was tired. However, I wanted to go.`,
        output: 'One idea, three genuinely different levels of formality.',
        explain:
          'Practicing all three out loud for the same idea builds a feel for which one fits a text message to a friend versus a formal email to a client.',
        explainHi:
          'Same idea ke liye teeno ko zor se practice karna ek feel banata hai ki kaunsa ek friend ko text message ke liye fit karta hai versus ek client ko ek formal email.',
      },
      {
        title: 'Punctuation differences side by side',
        titleHi: 'Punctuation differences side by side',
        code: `I like tea, but I don't like coffee. (comma before "but," no comma after)
I like tea. However, I don't like coffee. (period before, comma after "however")`,
        output: 'Two genuinely different punctuation patterns for a similar contrast.',
        explain:
          'These punctuation rules matter most in writing — in speech, a natural pause does the same job the comma does on the page.',
        explainHi:
          'Ye punctuation rules writing mein sabse zyada matter karte hain — speech mein, ek natural pause wahi kaam karta hai jo comma page pe karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"I like tea, however I don\'t like coffee." (using "however" like "but," mid-sentence with just a comma)',
        right: '"I like tea, but I don\'t like coffee." OR "I like tea. However, I don\'t like coffee."',
        why: '"However" doesn\'t join two clauses the way "but" does within one sentence with just a comma — it typically needs its own sentence (or a semicolon) rather than a plain comma splice.',
        whyHi: '"However" do clauses ko "but" ki tarah nahi jodta ek sentence ke andar sirf ek comma ke saath — ise typically apna own sentence chahiye (ya ek semicolon) ek plain comma splice ke bajaye.',
      },
      {
        wrong: 'Using "however" constantly in casual conversation instead of "but"',
        right: '"But" is the natural default for casual speech; save "however" for more formal or deliberate moments.',
        why: 'Overusing the most formal of the three connectors in relaxed, everyday conversation can sound stiff or overly careful compared to the natural "but."',
        whyHi: 'Teeno mein sabse formal connector ko relaxed, everyday conversation mein overuse karna "but" ke comparison mein stiff ya overly careful sound kar sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Everyday casual conversation** relies almost entirely on "but" for contrast — it\'s the natural, unmarked default nearly everyone reaches for without thinking.',
        hi: '**Everyday casual conversation** almost poori tarah "but" pe rely karti hai contrast ke liye — ye natural, unmarked default hai jise nearly har koi bina soche reach karta hai.',
      },
      {
        en: '**Formal writing, reports, and professional emails** lean on "however" to mark a considered, deliberate contrast — "The results were positive. However, further testing is recommended."',
        hi: '**Formal writing, reports, aur professional emails** "however" pe lean karte hain ek considered, deliberate contrast mark karne ke liye — "The results were positive. However, further testing is recommended."',
      },
    ],

    interviewQA: [
      {
        q: 'Can "although" and "but" always be used interchangeably?',
        qHi: 'Kya "although" aur "but" hamesha interchangeably use ho sakte hain?',
        a: 'Almost always in meaning, but not always in structure — "but" must sit between the two clauses ("I was tired, but I went"), while "although" can also open the sentence ("Although I was tired, I went"), which "but" cannot do.',
        aHi: 'Almost hamesha meaning mein, par hamesha structure mein nahi — "but" ko do clauses ke beech baithna padta hai ("I was tired, but I went"), jabki "although" sentence bhi open kar sakta hai ("Although I was tired, I went"), jo "but" nahi kar sakta.',
      },
      {
        q: 'Is it wrong to use "however" in spoken conversation at all?',
        qHi: 'Kya "however" ko spoken conversation mein bilkul use karna galat hai?',
        a: 'Not wrong at all — it\'s used in speech too, especially for a more considered or serious point. It just tends to sound noticeably more formal than "but," so it\'s worth reserving for moments where that slightly heavier tone actually fits.',
        aHi: 'Bilkul galat nahi — ye speech mein bhi use hota hai, especially ek zyada considered ya serious point ke liye. Ye bas "but" se noticeably zyada formal sound karta hai, isliye un moments ke liye reserve karne layak hai jahan wo thoda heavier tone actually fit kare.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, express the same contrast three ways using "but," "although," and "however": "I was hungry." + "I didn\'t eat."',
        taskHi: 'Zor se, same contrast teen tareekon se express karo "but," "although," aur "however" use karke: "I was hungry." + "I didn\'t eat."',
        hint: '"I was hungry, but I didn\'t eat." "Although I was hungry, I didn\'t eat." "I was hungry. However, I didn\'t eat."',
        hintHi: '"I was hungry, but I didn\'t eat." "Although I was hungry, I didn\'t eat." "I was hungry. However, I didn\'t eat."',
      },
      {
        task: 'Out loud, use "although" to open a sentence about your own recent experience, then say the same idea again with "although" in the middle instead.',
        taskHi: 'Zor se, "although" use karo apne recent experience ke baare mein ek sentence open karne ke liye, phir same idea phir se bolo "although" ko middle mein use karke iske bajaye.',
        hint: '"Although it was late, I finished my work." / "I finished my work, although it was late."',
        hintHi: '"Although it was late, I finished my work." / "I finished my work, although it was late."',
      },
    ],

    keyTakeaways: [
      '"But" is the casual, default contrast connector, joining two clauses within one sentence.',
      '"Although" is flexible — it can open a sentence or sit in the middle, with the same meaning either way.',
      '"However" is more formal, typically starting its own sentence (after a period or semicolon), followed by a comma.',
      'Never join two clauses with just "however" and a comma the way "but" does — it needs its own sentence or a semicolon.',
      'Overusing "however" in casual speech can sound stiff — "but" is usually the more natural everyday default.',
    ],
    keyTakeawaysHi: [
      '"But" casual, default contrast connector hai, ek sentence ke andar do clauses ko jodta hai.',
      '"Although" flexible hai — ye ek sentence open kar sakta hai ya middle mein baith sakta hai, dono tareeke se same meaning ke saath.',
      '"However" zyada formal hai, typically apna own sentence start karta hai (ek period ya semicolon ke baad), ek comma se follow hota hua.',
      'Kabhi do clauses ko sirf "however" aur ek comma se mat jodo jaise "but" karta hai — ise apna own sentence ya ek semicolon chahiye.',
      'Casual speech mein "however" ko overuse karna stiff sound kar sakta hai — "but" usually zyada natural everyday default hai.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-combining-connectors',
    title: 'Combining Connectors — Sounding Genuinely Fluent',
    titleHi: 'Connectors Ko Combine Karna — Genuinely Fluent Sound Karna',
    description:
      'A longer, well-connected sentence, closing Part IV by combining everything from this module into fluent, natural-sounding speech.',
    descriptionHi:
      'Ek lambi, well-connected sentence, Part IV ko close karti hai is module se sab kuch combine karke fluent, natural-sounding speech mein.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Short, disconnected sentences are individual bricks; connectors are the mortar that turns them into a wall.** "I was tired. I went to the party. I had fun." are three solid bricks with no structure holding them together. "Although I was tired, I went to the party, and I ended up having fun" is a wall — the same bricks, now genuinely built into something.',
      hi: 'Short, disconnected sentences individual bricks hain; connectors wo mortar hain jo unhe ek wall mein badal dete hain. "I was tired. I went to the party. I had fun." teen solid bricks hain bina kisi structure ke jo unhe saath rakhe. "Although I was tired, I went to the party, and I ended up having fun" ek wall hai — same bricks, ab genuinely kuch mein banaye gaye.',
    },

    simple: `**Short, disconnected sentences work, but sound choppy:**

"I was tired. I went to the party. I had fun."

**The same facts, combined with connectors, sound more fluent:**

"**Although** I was tired, I went to the party, **and** I ended up
having a lot of fun."

**A useful process for combining ideas:**

1. Identify the relationship between your ideas: cause/effect
   (because/so), contrast (but/although/however), or simple addition
   (and).
2. Pick ONE connector that matches that relationship.
3. Join two, or at most three, ideas — more than that in one sentence
   starts to feel overloaded.

**Don't over-combine every single sentence.** A short sentence here
and there, even after learning to combine, adds natural rhythm and
emphasis — real fluent speech is a mix of short and combined
sentences, not combined sentences constantly.`,
    simpleHi: `**Short, disconnected sentences kaam karte hain, par choppy sound karte hain:**

"I was tired. I went to the party. I had fun."

**Same facts, connectors ke saath combine kiye gaye, zyada fluent
sound karte hain:**

"**Although** I was tired, I went to the party, **and** I ended up
having a lot of fun."

**Ideas ko combine karne ka ek useful process:**

1. Apne ideas ke beech relationship identify karo: cause/effect
   (because/so), contrast (but/although/however), ya simple addition
   (and).
2. Ek EK connector choose karo jo us relationship ko match kare.
3. Do, ya zyada se zyada teen, ideas ko jodo — usse zyada ek sentence
   mein overloaded feel karna start ho jaata hai.

**Har single sentence ko over-combine mat karo.** Ek short sentence
kahin kahin, combine karna seekhne ke baad bhi, natural rhythm aur
emphasis add karta hai — real fluent speech short aur combined
sentences ka ek mix hai, constantly combined sentences nahi.`,

    content: `**Why combining sentences with connectors is one of the clearest,
most learnable signals of genuine fluency.**

Beginners often speak in short, correct, but disconnected sentences —
"I was tired. I went to the party. I had fun." Every sentence here is
grammatically perfect, yet the overall effect sounds choppy and
somewhat childlike, because English at a fluent level relies heavily
on connectors to show HOW ideas relate to each other, not just that
they occurred. Learning to combine ideas with the right connector is
one of the most direct paths from "correct" to "fluent-sounding"
speech.

**The skill is identifying the right relationship, not memorizing a
list of connectors in isolation.** Before choosing a word, ask: is
this a cause/effect ("because"/"so"), a contrast ("but"/"although"/
"however"), or a simple addition ("and")? Once the relationship is
clear, the correct connector follows naturally — this module and the
ones before it have already covered each piece individually; this
lesson is entirely about combining them.

**Overloading a single sentence with too many combined ideas backfires
just as much as under-combining.** "Although I was tired, I went to
the party, and I had fun, but I left early because I had work the next
day, so I couldn't stay too late" crams too much into one breath and
becomes genuinely hard to follow, even though every individual
connector is used correctly. Two or three ideas per sentence is a
reliable, natural limit.

**Genuinely fluent speech deliberately mixes sentence lengths.** Native
speakers don't combine every single sentence maximally — a short,
punchy sentence right after a longer, combined one is a real, common
rhythm ("Although I was tired, I went to the party anyway. It was
worth it.") This variation, not just combining itself, is part of
what makes speech sound natural rather than mechanically applying a
rule everywhere.`,
    contentHi: `**Connectors se sentences combine karna genuine fluency ke sabse clear, sabse learnable signals mein se ek kyun hai.**

Beginners often short, correct, par disconnected sentences mein bolte
hain — "I was tired. I went to the party. I had fun." Yahan har
sentence grammatically perfect hai, phir bhi overall effect choppy aur
somewhat childlike sound karta hai, kyunki English ek fluent level pe
heavily connectors pe rely karti hai ye dikhane ke liye ki ideas ek
doosre se KAISE related hain, sirf ye nahi ki wo occur hue. Sahi
connector se ideas combine karna seekhna "correct" se "fluent-
sounding" speech tak ek sabse direct raste mein se ek hai.

**Skill sahi relationship identify karna hai, connectors ki ek list
ko isolation mein memorize karna nahi.** Ek word choose karne se
pehle, poocho: kya ye ek cause/effect hai ("because"/"so"), ek
contrast ("but"/"although"/"however"), ya ek simple addition ("and")?
Ek baar relationship clear ho jaaye, correct connector naturally
follow karta hai — ye module aur isse pehle wale already har piece ko
individually cover kar chuke hain; ye lesson poori tarah inhe combine
karne ke baare mein hai.

**Ek single sentence ko bahut zyada combined ideas se overload karna
utna hi backfire karta hai jitna under-combining.** "Although I was
tired, I went to the party, and I had fun, but I left early because I
had work the next day, so I couldn't stay too late" ek breath mein
bahut zyada cram karta hai aur genuinely follow karna hard ban jaata
hai, chahe har individual connector correctly use ho. Do ya teen ideas
per sentence ek reliable, natural limit hai.

**Genuinely fluent speech deliberately sentence lengths mix karti
hai.** Native speakers har single sentence ko maximally combine nahi
karte — ek short, punchy sentence turant ek lambi, combined sentence
ke baad ek real, common rhythm hai ("Although I was tired, I went to
the party anyway. It was worth it.") Ye variation, sirf combining khud
nahi, wo hai jo speech ko natural banata hai, sab jagah ek rule ko
mechanically apply karne ke bajaye.`,

    readingPassage: `Let me tell you about my day. Although I woke up late, I managed to get to work on time, and I felt really productive. I had a big presentation, so I was a bit nervous, but it actually went really well. My manager was impressed, and I felt proud afterward. It was a good day.`,
    readingPassageHi: `Main tumhe apne din ke baare mein batata hoon. Although main der se uthaa, I managed to get to work on time, aur main really productive feel kar raha tha. Meri ek badi presentation thi, so main thoda nervous tha, but it actually went really well. Mere manager impressed the, aur main uske baad proud feel kar raha tha. It was a good day.`,

    vocabulary: [
      {
        word: 'combine',
        wordHi: 'combine (jodna/milana)',
        meaning: 'to join two or more things together',
        meaningHi: 'do ya zyada cheezon ko saath jodna',
        example: 'Let\'s combine these two sentences into one.',
        exampleHi: 'Let\'s combine these two sentences into one.',
        pronunciation: 'kuhm-BYN',
      },
      {
        word: 'productive',
        wordHi: 'productive (utpaadak)',
        meaning: 'achieving a lot of useful work',
        meaningHi: 'bahut saara useful kaam achieve karna',
        example: 'I had a really productive morning.',
        exampleHi: 'I had a really productive morning.',
        pronunciation: 'pruh-DUK-tiv',
      },
      {
        word: 'manage to',
        wordHi: 'manage to (kaamyaab hona)',
        meaning: 'to succeed in doing something, often despite difficulty',
        meaningHi: 'kuch karne mein succeed hona, often difficulty ke bawajood',
        example: 'I managed to finish everything on time.',
        exampleHi: 'I managed to finish everything on time.',
        pronunciation: 'MAN-ij too',
      },
      {
        word: 'impressed',
        wordHi: 'impressed (prabhavit)',
        meaning: 'feeling admiration because of something well done',
        meaningHi: 'admiration feel karna kyunki kuch achhe se kiya gaya',
        example: 'My teacher was impressed with my work.',
        exampleHi: 'My teacher was impressed with my work.',
        pronunciation: 'im-PREST',
      },
    ],

    examples: [
      {
        title: 'Choppy vs. combined, side by side',
        titleHi: 'Choppy vs. combined, side by side',
        code: `Choppy: I finished my work. I was tired. I went to sleep early.
Combined: Because I was tired after finishing my work, I went to sleep early.`,
        output: 'Same three facts, one version sounds noticeably more fluent.',
        explain:
          'Neither version is grammatically wrong, but reading both out loud makes it easy to hear which one sounds more like natural, fluent speech.',
        explainHi:
          'Koi bhi version grammatically galat nahi hai, par dono ko zor se padhna aasan banata hai sunna ki kaunsa zyada natural, fluent speech jaisa sound karta hai.',
      },
      {
        title: 'Mixing sentence lengths naturally',
        titleHi: 'Sentence lengths naturally mix karna',
        code: `Although the meeting ran long and I had to skip lunch, I still managed to finish my report on time. I was relieved.`,
        output: 'One long, combined sentence followed by one short, punchy one.',
        explain:
          'This mix — a longer combined sentence followed by a short one — is exactly the kind of natural rhythm fluent speakers use, rather than combining absolutely everything.',
        explainHi:
          'Ye mix — ek lambi combined sentence ek short wale se followed — exactly wo natural rhythm hai jo fluent speakers use karte hain, absolutely sab kuch combine karne ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: 'Speaking only in short, disconnected sentences: "I woke up. I ate breakfast. I went to work." for an entire conversation',
        right: 'Combine related ideas: "After I woke up and ate breakfast, I headed to work."',
        why: 'Short, correct sentences work but sound choppy and less fluent when used exclusively — combining related ideas with connectors is a genuine, learnable step toward more natural-sounding speech.',
        whyHi: 'Short, correct sentences kaam karte hain par choppy aur less fluent sound karte hain jab exclusively use kiye jaayein — related ideas ko connectors se combine karna zyada natural-sounding speech ki taraf ek genuine, learnable step hai.',
      },
      {
        wrong: 'Cramming four or five ideas into one overloaded sentence with multiple connectors',
        right: 'Limit to two or three ideas per sentence, and let a short sentence stand alone sometimes.',
        why: 'Overloading a single sentence makes it hard to follow, even when every connector is grammatically correct — natural fluency includes knowing when to stop combining and start a new sentence.',
        whyHi: 'Ek single sentence ko overload karna use follow karna hard bana deta hai, chahe har connector grammatically correct ho — natural fluency mein ye janna shaamil hai ki kab combine karna rokna hai aur ek naya sentence start karna hai.',
      },
    ],

    realWorld: [
      {
        en: '**Telling a well-structured story about your day, a trip, or an experience** — the kind covered throughout this course — relies directly on this skill to sound like natural, connected speech rather than a list of facts.',
        hi: '**Apne din, ek trip, ya ek experience ke baare mein ek well-structured story batana** — is poore course mein cover kiya gaya tarah ka — directly is skill pe rely karta hai natural, connected speech jaisa sound karne ke liye, facts ki ek list ki jagah.',
      },
      {
        en: '**Explaining a decision or a situation clearly in a meeting or interview** — combining cause, contrast, and result into one coherent explanation makes a stronger impression than a string of short, flat statements.',
        hi: '**Ek meeting ya interview mein ek decision ya situation ko clearly explain karna** — cause, contrast, aur result ko ek coherent explanation mein combine karna ek stronger impression banata hai short, flat statements ki ek string se.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I know when a sentence has too many combined ideas?',
        qHi: 'Mujhe kaise pata chalega jab ek sentence mein bahut zyada combined ideas hain?',
        a: "A good rule of thumb: if you run out of breath saying it out loud, or if you lose track of the original point by the end, it's probably combining too much. Two or three ideas per sentence is usually the sweet spot for spoken English.",
        aHi: "Ek achha rule of thumb: agar ise zor se bolte waqt tumhari breath khatam ho jaaye, ya agar tum end tak original point ka track kho do, ye probably bahut zyada combine kar raha hai. Do ya teen ideas per sentence usually spoken English ke liye sweet spot hai.",
      },
      {
        q: "Should I try to combine every single sentence I say to sound more fluent?",
        qHi: "Kya mujhe zyada fluent sound karne ke liye har single sentence combine karne ki koshish karni chahiye?",
        a: "No — genuinely fluent speech mixes short and combined sentences naturally, rather than combining everything maximally. A short sentence for emphasis right after a longer, combined one is a completely normal, even desirable rhythm.",
        aHi: "Nahi — genuinely fluent speech naturally short aur combined sentences mix karti hai, sab kuch maximally combine karne ke bajaye. Emphasis ke liye ek short sentence turant ek lambi, combined wale ke baad ek completely normal, even desirable rhythm hai.",
      },
    ],

    exercises: [
      {
        task: 'Out loud, combine these three short sentences into one fluent sentence using appropriate connectors: "I was hungry. I didn\'t have time to cook. I ordered food."',
        taskHi: 'Zor se, in teen short sentences ko ek fluent sentence mein combine karo appropriate connectors use karke: "I was hungry. I didn\'t have time to cook. I ordered food."',
        hint: '"Because I was hungry but didn\'t have time to cook, I ordered food."',
        hintHi: '"Because I was hungry but didn\'t have time to cook, I ordered food."',
      },
      {
        task: 'Out loud, describe your day using at least one combined sentence with a connector, and at least one short, standalone sentence — practicing the natural mix.',
        taskHi: 'Zor se, apna din describe karo kam se kam ek combined sentence ek connector ke saath use karke, aur kam se kam ek short, standalone sentence — natural mix practice karte hue.',
        hint: 'End with a short, punchy sentence for emphasis, like "It was a good day."',
        hintHi: 'Ek short, punchy sentence pe end karo emphasis ke liye, jaise "It was a good day."',
      },
    ],

    keyTakeaways: [
      'Combining short, related sentences with connectors (because/so, but/although/however, and) is a direct path to sounding more fluent.',
      'First identify the relationship between ideas (cause/effect, contrast, addition), then pick the matching connector.',
      'Limit combined sentences to two or three ideas — overloading one sentence makes it hard to follow, even if grammatically correct.',
      'Genuinely fluent speech mixes short and combined sentences — don\'t combine absolutely everything.',
      'This lesson ties together every connector from this module — the skill now is choosing and combining them naturally in real speech.',
    ],
    keyTakeawaysHi: [
      'Short, related sentences ko connectors se combine karna (because/so, but/although/however, and) zyada fluent sound karne ka ek direct raasta hai.',
      'Pehle ideas ke beech relationship identify karo (cause/effect, contrast, addition), phir matching connector choose karo.',
      'Combined sentences ko do ya teen ideas tak limit karo — ek sentence ko overload karna use follow karna hard bana deta hai, chahe grammatically correct ho.',
      'Genuinely fluent speech short aur combined sentences mix karti hai — absolutely sab kuch combine mat karo.',
      'Ye lesson is module ke har connector ko saath tie karta hai — ab skill hai unhe naturally real speech mein choose aur combine karna.',
    ],
  },
];
