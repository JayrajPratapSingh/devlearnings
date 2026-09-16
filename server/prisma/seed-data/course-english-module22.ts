/**
 * English Speaking Complete Course — Module 22: Articles, Quantifiers
 * & Obligation. GAP-FILL module (Part VIII, supplementary grammar
 * foundations), added after a post-completion audit alongside Module
 * 21. Covers three genuinely common Hindi-speaker gaps this course
 * had not yet addressed directly: the definite article "the" (Hindi
 * has no articles at all, so this is a structural blind spot, not a
 * vocabulary gap), the countable/uncountable distinction behind
 * much/many, and the real difference between "must" and "have to."
 *
 * Lesson 1: "The" — when English needs it, and when it deliberately
 *           doesn't.
 * Lesson 2: Much, many, a lot of, and the countable/uncountable
 *           distinction underneath all of them.
 * Lesson 3: Must, have to, should & need to — genuine differences in
 *           obligation, not interchangeable synonyms.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_22: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-the-definite-article',
    title: '"The" — When English Needs It, and When It Doesn\'t',
    titleHi: '"The" — Jab English Ko Chahiye, Aur Jab Nahi',
    description:
      'Hindi has no articles at all, which makes "the" one of the hardest, most invisible parts of English — this lesson makes the invisible rule visible.',
    descriptionHi:
      'Hindi mein bilkul articles nahi hote, jo "the" ko English ke sabse hard, sabse invisible parts mein se ek banata hai — ye lesson invisible rule ko visible banata hai.',
    difficulty: 'HARD',
    duration: 25,
    order: 1,

    analogy: {
      en: '**"The" is a pointing finger; "a/an" is an open hand.** "I saw a dog" opens a hand toward any dog, unspecified. "I saw the dog" points a finger at one specific dog both speaker and listener already know about. Hindi simply doesn\'t have this pointing finger built into its grammar, which is exactly why it\'s easy to forget it in English.',
      hi: '"The" ek pointing finger hai; "a/an" ek open hand hai. "I saw a dog" ek hand kisi bhi dog ki taraf open karta hai, unspecified. "I saw the dog" ek finger point karta hai ek specific dog pe jise speaker aur listener dono already jaante hain. Hindi mein simply ye pointing finger uski grammar mein built-in nahi hai, jo exactly reason hai ki English mein ise bhoolna aasan hai.',
    },

    simple: `**Use "the" when both speaker and listener know exactly which one
you mean:**

"I fed **the** dog." (a specific dog you both know — maybe your own)
· "Close **the** door, please." (there's one obvious door in the
room) · "**The** sun is bright today." (there's only one sun)

**Use "a/an" (or no article) when introducing something new, or
speaking generally:**

"I saw **a** dog on my walk." (a new, unspecified dog, first
mention) · "Dogs are loyal animals." (dogs in general, no article at
all)

**A common pattern: "a/an" the first time, "the" every time after:**

"I bought **a** book. **The** book was really interesting." (second
mention — now you both know exactly which book)

**No article at all, for general/plural/uncountable statements:**

"I like coffee." (coffee in general) · "Cats are independent." (cats
in general) — adding "the" here would wrongly suggest one specific,
known coffee or one specific group of cats.

**Some fixed exceptions simply have to be learned**: "the internet,"
"the news," but "school," "home," "work" usually take no article at
all ("I went to school," not "I went to the school," when talking
about attending in the normal sense).`,
    simpleHi: `**"The" use karo jab speaker aur listener dono exactly jaante hain kaunsa tumhara matlab hai:**

"I fed **the** dog." (ek specific dog jise tum dono jaante ho — shayad
tumhara khud ka) · "Close **the** door, please." (room mein ek obvious
door hai) · "**The** sun is bright today." (sirf ek sun hai)

**"A/an" (ya koi article nahi) use karo jab kuch naya introduce kar
rahe ho, ya generally baat kar rahe ho:**

"I saw **a** dog on my walk." (ek naya, unspecified dog, first
mention) · "Dogs are loyal animals." (dogs generally, koi article
nahi)

**Ek common pattern: pehli baar "a/an", uske baad har baar "the":**

"I bought **a** book. **The** book was really interesting." (second
mention — ab tum dono exactly jaante ho kaunsi book)

**Koi article bilkul nahi, general/plural/uncountable statements ke
liye:**

"I like coffee." (coffee generally) · "Cats are independent." (cats
generally) — yahan "the" add karna wrongly suggest karega ek specific,
known coffee ya ek specific group of cats.

**Kuch fixed exceptions simply seekhne padte hain**: "the internet,"
"the news," par "school," "home," "work" usually koi article nahi lete
(sirf "I went to school," "I went to the school" nahi, jab normal
sense mein attend karne ke baare mein baat karte ho).`,

    content: `**Why this is structurally invisible to a Hindi speaker, in a way
that's different from every other gap this course has covered.**

Every other grammar point in this course — tenses, connectors, even
the dropped article on job titles from Module 2 — has SOME Hindi
equivalent, even if it works differently. Articles have no Hindi
equivalent at all: Hindi simply doesn't mark "a specific one we both
know" versus "any one" versus "the whole category" the way English
does. This isn't a translation mismatch to correct — it's an entirely
new grammatical category to build from scratch, which is exactly why
it deserves direct, explicit attention rather than being picked up by
osmosis.

**The core test — do speaker and listener both already know exactly
which one — is the single most reliable rule, more useful than trying
to memorize a long list of cases.** "Pass me the salt" (there's one
salt shaker on this table, both of you know which) versus "I need to
buy some salt" (not a specific, known salt, just the category).
Running this test consciously, at least at first, resolves the large
majority of real article decisions.

**The "a/an" then "the" pattern reflects the most common real
information structure in a story or explanation.** New information
gets "a/an" (or no article for plurals/uncountables); once it's
established, later mentions of that exact same thing get "the." This
pattern shows up constantly in storytelling, instructions, and
explanations — noticing it in things you read is one of the fastest
ways to internalize the underlying logic.

**A handful of genuinely fixed exceptions (the internet, the news,
the weather, but school/home/work/bed with no article for their
normal, expected use) simply have to be memorized individually,
exactly like irregular verbs.** There's no deeper logic to derive
these from — they're historical fixed phrases, and the practical
approach is the same as any other closed list: learn them directly
through exposure rather than searching for a rule that explains them.`,
    contentHi: `**Ye structurally ek Hindi speaker ke liye invisible kyun hai, ek tareeke se jo is course ke har doosre gap se different hai.**

Is course ka har doosra grammar point — tenses, connectors, even
Module 2 ka dropped article job titles pe — Hindi mein KUCH equivalent
rakhta hai, chahe wo differently kaam kare. Articles ka Hindi mein
bilkul koi equivalent nahi hai: Hindi simply "ek specific ek jise hum
dono jaante hain" versus "koi bhi ek" versus "poori category" ko mark
nahi karti jaise English karti hai. Ye ek translation mismatch nahi hai
correct karne ke liye — ye ek poori tarah nayi grammatical category
hai scratch se build karne ke liye, yahi exactly reason hai ki ise
direct, explicit attention deserve karti hai, osmosis se pick up hone
ke bajaye.

**Core test — kya speaker aur listener dono already exactly jaante
hain kaunsa — single sabse reliable rule hai, ek lambi list of cases
memorize karne ki koshish karne se zyada useful.** "Pass me the salt"
(is table pe ek salt shaker hai, tum dono jaante ho kaunsa) versus "I
need to buy some salt" (ek specific, known salt nahi, sirf category).
Is test ko consciously run karna, kam se kam pehle, real article
decisions ka large majority resolve karta hai.

**"A/an" phir "the" pattern ek story ya explanation ke sabse common
real information structure ko reflect karta hai.** Naya information
"a/an" leta hai (ya plurals/uncountables ke liye koi article nahi); ek
baar establish ho jaaye, exact same cheez ke baad wale mentions "the"
lete hain. Ye pattern storytelling, instructions, aur explanations
mein constantly appear hota hai — jo tum padhte ho usme ise notice
karna underlying logic ko internalize karne ka sabse fast tareekon
mein se ek hai.

**Kuch genuinely fixed exceptions (the internet, the news, the
weather, par school/home/work/bed unke normal, expected use ke liye
koi article nahi) simply individually memorize karne padte hain,
exactly irregular verbs jaise.** Inhe derive karne ke liye koi deeper
logic nahi hai — ye historical fixed phrases hain, aur practical
approach kisi bhi doosre closed list jaisa hai: inhe directly exposure
se seekho, ek rule dhoondhne ke bajaye jo inhe explain kare.`,

    readingPassage: `Yesterday, I bought a book at the store near my house. The book was about the history of India. I read it on the train. I go to work every day, but I don't usually read on the way — the book made the trip more interesting. Have you read anything good lately?`,
    readingPassageHi: `Yesterday, maine ek book khareedi the store near my house pe. The book India ki history ke baare mein thi. Maine ise train pe padha. Main har din work jaata hoon, but main usually raste mein padhta nahi hoon — book ne trip ko zyada interesting bana diya. Have you read anything good lately?`,

    vocabulary: [
      {
        word: 'specific',
        wordHi: 'specific (vishisht)',
        meaning: 'one particular thing, clearly identified, not just any one',
        meaningHi: 'ek particular cheez, clearly identified, koi bhi ek nahi',
        example: 'The specific book I mean is on the top shelf.',
        exampleHi: 'The specific book I mean is on the top shelf.',
        pronunciation: 'spi-SIF-ik',
      },
      {
        word: 'category',
        wordHi: 'category (varg)',
        meaning: 'a general group or class of things',
        meaningHi: 'cheezon ka ek general group ya class',
        example: 'Coffee, as a category, includes many types.',
        exampleHi: 'Coffee, as a category, includes many types.',
        pronunciation: 'KAT-i-gor-ee',
      },
      {
        word: 'mention',
        wordHi: 'mention (zikr)',
        meaning: 'to refer to or say something briefly',
        meaningHi: 'kisi cheez ka zikr karna ya briefly kehna',
        example: 'On second mention, you can say "the" instead of "a."',
        exampleHi: 'On second mention, you can say "the" instead of "a."',
        pronunciation: 'MEN-shun',
      },
      {
        word: 'exception',
        wordHi: 'exception (apwad)',
        meaning: 'something that doesn\'t follow the usual rule',
        meaningHi: 'kuch jo usual rule follow nahi karta',
        example: '"The internet" is an exception worth memorizing.',
        exampleHi: '"The internet" is an exception worth memorizing.',
        pronunciation: 'ik-SEP-shun',
      },
    ],

    examples: [
      {
        title: 'The "a/an" then "the" pattern in one short story',
        titleHi: '"A/an" phir "the" pattern ek short story mein',
        code: `I met a woman at the conference. The woman turned out to be my old classmate! We talked for an hour, and the conversation was wonderful.`,
        output: 'New things get "a/an"; once established, they get "the."',
        explain:
          'Notice "a woman" and "an hour" are new information getting "a/an," while "the woman" and "the conversation" refer back to something already introduced.',
        explainHi:
          'Notice karo "a woman" aur "an hour" naya information hain "a/an" lete hue, jabki "the woman" aur "the conversation" kisi aisi cheez ko refer karte hain jo already introduce ho chuki hai.',
      },
      {
        title: 'No article for general statements',
        titleHi: 'General statements ke liye koi article nahi',
        code: `I love music. Music brings people together.
(Not: "I love the music. The music brings people together.")`,
        output: 'Speaking about music in general takes no article at all.',
        explain:
          'Adding "the" here would wrongly suggest one specific, known piece of music — the general, uncountable category needs no article.',
        explainHi:
          'Yahan "the" add karna wrongly suggest karega ek specific, known piece of music — general, uncountable category ko koi article nahi chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: '"I like the music." (meaning music in general, not one specific piece)',
        right: '"I like music."',
        why: 'Speaking about a whole category in general takes no article — adding "the" incorrectly implies one specific, already-known piece of music.',
        whyHi: 'Ek poori category ke baare mein generally baat karna koi article nahi leta — "the" add karna incorrectly ek specific, already-known piece of music imply karta hai.',
      },
      {
        wrong: '"I saw dog on my walk." (dropping the article on first mention of a specific, countable thing)',
        right: '"I saw a dog on my walk."',
        why: 'A single, countable thing being newly introduced needs "a/an" — dropping it entirely is a common gap left by Hindi having no article system to transfer from.',
        whyHi: 'Ek single, countable cheez jo newly introduce ho rahi hai use "a/an" chahiye — ise poori tarah drop karna ek common gap hai jo Hindi mein koi article system na hone se aata hai transfer karne ke liye.',
      },
    ],

    realWorld: [
      {
        en: '**Telling any story or giving any explanation** relies constantly on the "a/an" then "the" pattern to introduce and then refer back to people, places, and things.',
        hi: '**Koi bhi story batana ya koi bhi explanation dena** constantly "a/an" phir "the" pattern pe rely karta hai logon, jagahon, aur cheezon ko introduce aur phir refer back karne ke liye.',
      },
      {
        en: '**Writing or speaking in a professional context** (emails, reports, presentations) requires consistent, correct article use to sound polished and avoid ambiguity about what\'s being referred to.',
        hi: '**Ek professional context mein likhna ya bolna** (emails, reports, presentations) consistent, correct article use require karta hai polished sound karne aur ambiguity avoid karne ke liye ki kya refer kiya ja raha hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it really that big a deal if I get articles wrong sometimes?',
        qHi: 'Kya ye really itni badi baat hai agar main kabhi kabhi articles galat karoon?',
        a: 'Missing or wrong articles rarely block understanding entirely — English speakers will usually follow your meaning. But since Hindi has no equivalent system at all, this is one of the most reliable "tells" of a non-native speaker, and getting it right measurably increases how polished and fluent you sound.',
        aHi: 'Missing ya wrong articles rarely understanding ko poori tarah block karte hain — English speakers usually tumhara meaning follow kar lenge. Par kyunki Hindi mein koi equivalent system bilkul nahi hai, ye ek non-native speaker ke sabse reliable "tells" mein se ek hai, aur ise sahi karna measurably badhata hai tum kitna polished aur fluent sound karte ho.',
      },
      {
        q: 'Why do "school," "home," and "work" not need an article, but "the office" does?',
        qHi: '"School," "home," aur "work" ko article kyun nahi chahiye, par "the office" ko chahiye?',
        a: 'This is genuinely one of the fixed exceptions worth memorizing — these specific words drop the article when referring to their normal, expected function (attending school, being at home, doing your job), but "the office," "the store," and most other places keep the normal article rules.',
        aHi: 'Ye genuinely ek fixed exception hai memorize karne layak — ye specific words article drop karte hain jab unke normal, expected function ko refer karte hain (school attend karna, ghar pe hona, apna kaam karna), par "the office," "the store," aur zyadatar doosri places normal article rules rakhti hain.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, tell a short two-sentence story introducing a person or thing with "a/an," then referring back to it with "the."',
        taskHi: 'Zor se, ek short two-sentence story batao ek person ya thing ko "a/an" se introduce karte hue, phir "the" se usse refer back karte hue.',
        hint: '"I saw a cat outside. The cat looked hungry, so I gave it some food."',
        hintHi: '"I saw a cat outside. The cat looked hungry, so I gave it some food."',
      },
      {
        task: 'Out loud, say three general statements about categories (a food, an animal, an activity) with no article at all.',
        taskHi: 'Zor se, teen general statements bolo categories ke baare mein (ek food, ek animal, ek activity) bina kisi article ke.',
        hint: '"I love mangoes." "Dogs are friendly." "Reading relaxes me."',
        hintHi: '"I love mangoes." "Dogs are friendly." "Reading relaxes me."',
      },
    ],

    keyTakeaways: [
      'Use "the" when both speaker and listener already know exactly which one is meant; use "a/an" (or no article) for something new or general.',
      'Hindi has no article system at all — this is a genuinely new grammatical category to build, not a translation mismatch to fix.',
      'A very common pattern: "a/an" on first mention, "the" on every mention after, once both people know which one is meant.',
      'General, plural, or uncountable statements (coffee, dogs, music) usually take no article at all.',
      'A handful of fixed exceptions (the internet, the news, but school/home/work with no article) simply have to be memorized directly.',
    ],
    keyTakeawaysHi: [
      '"The" use karo jab speaker aur listener dono already exactly jaante hain kaunsa matlab hai; "a/an" (ya koi article nahi) use karo kisi naye ya general cheez ke liye.',
      'Hindi mein bilkul koi article system nahi hai — ye ek genuinely nayi grammatical category hai build karne ke liye, ek translation mismatch nahi fix karne ke liye.',
      'Ek bahut common pattern: first mention pe "a/an", uske baad har mention pe "the", ek baar dono log jaante hain kaunsa matlab hai.',
      'General, plural, ya uncountable statements (coffee, dogs, music) usually koi article nahi lete.',
      'Kuch fixed exceptions (the internet, the news, par school/home/work koi article ke bina) simply directly memorize karne padte hain.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-quantifiers-much-many-countable',
    title: 'Much, Many & the Countable/Uncountable Split',
    titleHi: 'Much, Many Aur Countable/Uncountable Split',
    description:
      '"How much water?" and "How many bottles?" ask genuinely different kinds of questions — the whole system depends on one hidden distinction underneath every noun.',
    descriptionHi:
      '"How much water?" aur "How many bottles?" genuinely different tarah ke questions poochte hain — poora system ek hidden distinction pe depend karta hai har noun ke neeche.',
    difficulty: 'HARD',
    duration: 25,
    order: 2,

    analogy: {
      en: '**Countable nouns are eggs in a carton; uncountable nouns are water in a bucket.** You can count eggs one by one — one egg, two eggs — but you can\'t count water the same way; you measure it instead (a glass of water, a lot of water). Every quantifier in English — much, many, a few, a little — is built around which of these two categories a noun falls into.',
      hi: 'Countable nouns ek carton mein eggs hain; uncountable nouns ek bucket mein water hai. Tum eggs ko ek-ek karke count kar sakte ho — one egg, two eggs — par tum water ko usi tarah count nahi kar sakte; tum ise iske bajaye measure karte ho (a glass of water, a lot of water). English ka har quantifier — much, many, a few, a little — is baat pe built hai ki noun in do categories mein se kis mein aata hai.',
    },

    simple: `**Countable nouns can be counted one by one, and have a plural
form:**

one book, two books · one idea, two ideas · one person, two people

**Uncountable nouns can't be counted one by one, and have no plural
form:**

water · information · advice · money · furniture · rice

**Match the quantifier to the noun type:**

- **Many** + countable (plural): "How many books do you have?"
- **Much** + uncountable: "How much water do you need?"
- **A few** + countable: "I have a few ideas."
- **A little** + uncountable: "I need a little advice."
- **A lot of / lots of** + either: "I have a lot of books." / "I have
  a lot of water."

**A genuinely useful shortcut**: "a lot of" works with both types, so
when unsure, it's the safest default. "Much" and "many" are also very
common in negative sentences and questions ("I don't have much time,"
"How many people came?"), even though in positive statements "a lot
of" is often more natural ("I have a lot of time" rather than "I have
much time").`,
    simpleHi: `**Countable nouns ko ek-ek karke count kiya ja sakta hai, aur inka ek plural form hota hai:**

one book, two books · one idea, two ideas · one person, two people

**Uncountable nouns ko ek-ek karke count nahi kiya ja sakta, aur inka koi plural form nahi hota:**

water · information · advice · money · furniture · rice

**Quantifier ko noun type se match karo:**

- **Many** + countable (plural): "How many books do you have?"
- **Much** + uncountable: "How much water do you need?"
- **A few** + countable: "I have a few ideas."
- **A little** + uncountable: "I need a little advice."
- **A lot of / lots of** + either: "I have a lot of books." / "I have
  a lot of water."

**Ek genuinely useful shortcut**: "a lot of" dono types ke saath kaam
karta hai, so jab unsure ho, ye safest default hai. "Much" aur "many"
bhi negative sentences aur questions mein bahut common hain ("I don't
have much time," "How many people came?"), chahe positive statements
mein "a lot of" often zyada natural hai ("I have a lot of time" "I
have much time" ke bajaye).`,

    content: `**Why this distinction genuinely matters, beyond just picking the
right word.**

The countable/uncountable split isn't arbitrary — it reflects
whether English treats something as made of distinct, separable units
(books, ideas, people) or as a continuous mass (water, information,
furniture). This distinction determines an entire cluster of grammar
choices at once: whether a noun takes a plural "-s," whether it needs
"a/an," and which quantifier (much vs. many) correctly pairs with it —
getting the underlying category right unlocks all three simultaneously.

**A specific, genuinely common trap: some nouns are countable in
Hindi's conceptual world but uncountable in English's, and vice
versa.** "Information," "advice," and "furniture" feel like they
should be countable (you can imagine "one piece of information," "one
piece of advice") but are grammatically uncountable in English — no
plural "-s," and "much"/"a little," not "many"/"a few." This mismatch
between the two languages' categorization is precisely why these
specific words cause repeated, predictable mistakes.

**"A lot of" is grammatically flexible in a way "much" and "many" are
not, which makes it a genuinely reliable default.** Both "much" and
"many" require knowing the noun's category correctly; "a lot of"
works identically with either, which is exactly why it's the safer,
more common choice, especially in positive statements. "Much" and
"many" remain very natural specifically in negative sentences and
questions.

**For an uncountable noun, expressing "one unit" of it requires a
separate counting word.** "One water" is not correct; "one glass of
water," "one piece of advice," "one bag of rice" supplies the missing
countable unit that the uncountable noun itself lacks. This
"container/unit + of + uncountable noun" pattern is worth learning
directly, since it's the standard way English counts things that
can't be counted on their own.`,
    contentHi: `**Ye distinction genuinely kyun matter karta hai, sirf sahi word choose karne se aage.**

Countable/uncountable split arbitrary nahi hai — ye reflect karta hai
ki English kisi cheez ko distinct, separable units ki tarah treat
karti hai (books, ideas, people) ya ek continuous mass ki tarah
(water, information, furniture). Ye distinction ek poora cluster of
grammar choices ek saath decide karta hai: kya ek noun plural "-s"
leta hai, kya ise "a/an" chahiye, aur kaunsa quantifier (much vs.
many) correctly usse pair karta hai — underlying category sahi karna
teeno ko simultaneously unlock kar deta hai.

**Ek specific, genuinely common trap: kuch nouns Hindi ke conceptual
world mein countable hain par English mein uncountable, aur vice
versa.** "Information," "advice," aur "furniture" aisa feel karte hain
ki ye countable hone chahiye (tum imagine kar sakte ho "one piece of
information," "one piece of advice") par ye grammatically English mein
uncountable hain — koi plural "-s" nahi, aur "much"/"a little,"
"many"/"a few" nahi. Do languages ke categorization ke beech ye
mismatch precisely reason hai ki ye specific words repeated,
predictable mistakes cause karte hain.

**"A lot of" grammatically flexible hai ek tareeke se jo "much" aur
"many" nahi hain, jo ise ek genuinely reliable default banata hai.**
Dono "much" aur "many" ko noun ki category correctly janna chahiye;
"a lot of" identically kaam karta hai kisi ke saath bhi, jo exactly
reason hai ki ye safer, zyada common choice hai, especially positive
statements mein. "Much" aur "many" phir bhi bahut natural hain
specifically negative sentences aur questions mein.

**Ek uncountable noun ke liye, iska "one unit" express karne ke liye
ek separate counting word chahiye.** "One water" correct nahi hai;
"one glass of water," "one piece of advice," "one bag of rice" wo
missing countable unit supply karta hai jo uncountable noun khud mein
nahi rakhta. Ye "container/unit + of + uncountable noun" pattern
directly seekhne layak hai, kyunki ye standard tareeka hai jisse
English un cheezon ko count karti hai jo apne aap count nahi ho
saktin.`,

    readingPassage: `I don't have much time today, but I do have a few minutes. Can I give you a piece of advice? Don't worry too much about making mistakes — everyone makes a lot of them while learning. How many languages have you tried to learn? I've only tried one, but I've put a lot of effort into it.`,
    readingPassageHi: `Mere paas aaj much time nahi hai, but mere paas a few minutes hain. Can I give you a piece of advice? Mistakes karne ke baare mein too much worry mat karo — sabhi seekhte waqt a lot of unse karte hain. How many languages ne tumne seekhne ki koshish ki hai? Maine sirf ek try kiya hai, but maine a lot of effort ise use daala hai.`,

    vocabulary: [
      {
        word: 'countable',
        wordHi: 'countable (ginne yogya)',
        meaning: 'able to be counted individually, with a plural form',
        meaningHi: 'individually count kiya ja sakta hai, ek plural form ke saath',
        example: '"Book" is a countable noun.',
        exampleHi: '"Book" is a countable noun.',
        pronunciation: 'KOWN-tuh-buhl',
      },
      {
        word: 'uncountable',
        wordHi: 'uncountable (agunit)',
        meaning: 'not able to be counted individually, no plural form',
        meaningHi: 'individually count nahi kiya ja sakta, koi plural form nahi',
        example: '"Water" is an uncountable noun.',
        exampleHi: '"Water" is an uncountable noun.',
        pronunciation: 'un-KOWN-tuh-buhl',
      },
      {
        word: 'a piece of',
        wordHi: 'a piece of (ek tukda)',
        meaning: 'a counting unit used for an uncountable noun',
        meaningHi: 'ek counting unit ek uncountable noun ke liye use hota hai',
        example: 'Let me give you a piece of advice.',
        exampleHi: 'Let me give you a piece of advice.',
        pronunciation: 'uh pees uv',
      },
      {
        word: 'effort',
        wordHi: 'effort (prayaas)',
        meaning: 'the energy or work put into achieving something',
        meaningHi: 'energy ya kaam jo kisi cheez achieve karne mein lagaya jaata hai',
        example: "I've put a lot of effort into learning English.",
        exampleHi: "I've put a lot of effort into learning English.",
        pronunciation: 'EF-ert',
      },
    ],

    examples: [
      {
        title: 'Countable and uncountable side by side',
        titleHi: 'Countable aur uncountable side by side',
        code: `Countable: How many chairs do we need? We need a few more.
Uncountable: How much rice should I cook? Just a little.`,
        output: 'The same question structure, adapted to each noun type.',
        explain:
          'Notice "chairs" takes "many"/"a few" while "rice" takes "much"/"a little" — matching the quantifier to the noun type is the entire skill here.',
        explainHi:
          'Notice karo "chairs" "many"/"a few" leta hai jabki "rice" "much"/"a little" leta hai — quantifier ko noun type se match karna yahan poora skill hai.',
      },
      {
        title: 'The trap: nouns that feel countable but grammatically aren\'t',
        titleHi: 'Trap: nouns jo countable feel karte hain par grammatically nahi hain',
        code: `Wrong: I need some informations. I have many advices for you.
Right: I need some information. I have a lot of advice for you.`,
        output: '"Information" and "advice" are uncountable in English, with no plural "-s."',
        explain:
          'These specific words are worth memorizing directly as uncountable, since they feel like they should be countable but aren\'t — a genuinely common, predictable mistake worth watching for.',
        explainHi:
          'Ye specific words directly memorize karne layak hain uncountable ki tarah, kyunki ye feel karte hain ki countable hone chahiye par nahi hain — ek genuinely common, predictable mistake jispe dhyan dena hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"I need some informations." / "She gave me many advices."',
        right: '"I need some information." / "She gave me a lot of advice."',
        why: '"Information" and "advice" are uncountable in English, even though they feel like they should have a plural — this is a specific, common mismatch between how Hindi and English categorize these particular concepts.',
        whyHi: '"Information" aur "advice" English mein uncountable hain, chahe wo feel karein ki inka plural hona chahiye — ye Hindi aur English ke beech ek specific, common mismatch hai ye particular concepts categorize karne mein.',
      },
      {
        wrong: '"How much people came to the party?" (using "much" with a countable plural noun)',
        right: '"How many people came to the party?"',
        why: '"People" is countable (one person, two people) — "many" is needed, not "much," which pairs only with uncountable nouns.',
        whyHi: '"People" countable hai (one person, two people) — "many" chahiye, "much" nahi, jo sirf uncountable nouns ke saath pair hota hai.',
      },
    ],

    realWorld: [
      {
        en: '**Shopping and cooking** ("How much rice do we have?", "How many onions do we need?") depend constantly on correctly distinguishing countable from uncountable ingredients.',
        hi: '**Shopping aur cooking** ("How much rice do we have?", "How many onions do we need?") constantly countable ko uncountable ingredients se correctly distinguish karne pe depend karte hain.',
      },
      {
        en: '**Discussing time, money, and information at work** ("I don\'t have much time," "How much does this cost?", "I need more information") relies heavily on correctly using uncountable quantifiers in exactly these common business contexts.',
        hi: '**Kaam pe time, money, aur information discuss karna** ("I don\'t have much time," "How much does this cost?", "I need more information") heavily in exact common business contexts mein uncountable quantifiers correctly use karne pe rely karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Is there a list of common uncountable nouns I should just memorize?',
        qHi: 'Kya ek list hai common uncountable nouns ki jo mujhe bas memorize karni chahiye?',
        a: 'Yes, a short, high-value list is worth learning directly: information, advice, furniture, money, news, luggage, and food-related mass nouns like rice, water, and bread. These specific words cause the most predictable mistakes precisely because they feel countable but grammatically aren\'t.',
        aHi: 'Haan, ek short, high-value list directly seekhne layak hai: information, advice, furniture, money, news, luggage, aur food-related mass nouns jaise rice, water, aur bread. Ye specific words sabse predictable mistakes cause karte hain precisely kyunki ye countable feel karte hain par grammatically nahi hain.',
      },
      {
        q: 'Can I just always use "a lot of" and avoid this whole distinction?',
        qHi: 'Kya main hamesha "a lot of" use kar sakta hoon aur ye poora distinction avoid kar sakta hoon?',
        a: 'For positive statements, yes — "a lot of" is a genuinely safe, flexible default. But "much" and "many" are still very common and natural in negative sentences and questions ("I don\'t have much time," "How many did you buy?"), so it\'s worth learning both rather than avoiding them entirely.',
        aHi: 'Positive statements ke liye, haan — "a lot of" ek genuinely safe, flexible default hai. Par "much" aur "many" phir bhi bahut common aur natural hain negative sentences aur questions mein ("I don\'t have much time," "How many did you buy?"), so dono seekhna worth hai poori tarah avoid karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, ask a "how much" question about an uncountable noun and a "how many" question about a countable one from your own life.',
        taskHi: 'Zor se, apni khud ki zindagi se ek uncountable noun ke baare mein ek "how much" question poocho aur ek countable ke baare mein ek "how many" question.',
        hint: '"How much water do you drink daily?" "How many books have you read this year?"',
        hintHi: '"How much water do you drink daily?" "How many books have you read this year?"',
      },
      {
        task: 'Out loud, correctly use "information" and "advice" in a sentence each, without adding a plural "-s."',
        taskHi: 'Zor se, "information" aur "advice" ko ek-ek sentence mein correctly use karo, koi plural "-s" add kiye bina.',
        hint: '"I need some information about the schedule." "Can you give me some advice?"',
        hintHi: '"I need some information about the schedule." "Can you give me some advice?"',
      },
    ],

    keyTakeaways: [
      'Countable nouns can be counted individually and have a plural (book/books); uncountable nouns cannot and have no plural (water, information).',
      'Match the quantifier to the type: many/a few + countable; much/a little + uncountable; a lot of works with either.',
      'Some nouns (information, advice, furniture) feel countable but are grammatically uncountable in English — a specific, common Hindi-English mismatch.',
      'For an uncountable noun, express "one unit" with a counting word: a piece of advice, a glass of water, a bag of rice.',
      '"A lot of" is a safe, flexible default, but "much" and "many" remain natural and common in negative sentences and questions.',
    ],
    keyTakeawaysHi: [
      'Countable nouns individually count ho sakte hain aur inka plural hota hai (book/books); uncountable nouns nahi ho sakte aur inka koi plural nahi (water, information).',
      'Quantifier ko type se match karo: many/a few + countable; much/a little + uncountable; a lot of dono ke saath kaam karta hai.',
      'Kuch nouns (information, advice, furniture) countable feel karte hain par English mein grammatically uncountable hain — ek specific, common Hindi-English mismatch.',
      'Ek uncountable noun ke liye, "one unit" express karo ek counting word ke saath: a piece of advice, a glass of water, a bag of rice.',
      '"A lot of" ek safe, flexible default hai, par "much" aur "many" phir bhi natural aur common hain negative sentences aur questions mein.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-must-have-to-should-need-to',
    title: 'Must, Have To, Should & Need To',
    titleHi: 'Must, Have To, Should Aur Need To',
    description:
      '"You must be tired" and "You have to be tired" would mean genuinely different things if "must" and "have to" were truly interchangeable — they aren\'t.',
    descriptionHi:
      '"You must be tired" aur "You have to be tired" genuinely different cheezein mean karenge agar "must" aur "have to" truly interchangeable hote — wo nahi hain.',
    difficulty: 'HARD',
    duration: 25,
    order: 3,

    analogy: {
      en: '**"Must" is a rule you set for yourself from inside; "have to" is a rule someone else set, coming from outside.** "I must finish this" sounds like your own internal drive talking. "I have to finish this by 5pm" sounds like a deadline someone else imposed. Same obligation, two genuinely different sources.',
      hi: '"Must" ek rule hai jo tum khud ke liye andar se set karte ho; "have to" ek rule hai jo kisi aur ne set kiya, bahar se aata hua. "I must finish this" tumhare apne internal drive jaisa sound karta hai. "I have to finish this by 5pm" ek deadline jaisa sound karta hai jo kisi aur ne impose kiya. Same obligation, do genuinely different sources.',
    },

    simple: `**"Must" — strong obligation, often from the speaker's own sense of
importance:**

"I must call my mother today." (I feel this is important, personally)

**"Have to" — obligation from an outside rule, requirement, or
circumstance:**

"I have to submit this form by Friday." (an external deadline, not
my personal choice)

**"Should" — advice or a recommendation, much weaker than must/have
to:**

"You should drink more water." (a suggestion, not a strict rule)

**"Need to" — a practical necessity, often more neutral than must:**

"I need to buy groceries." (a practical requirement, said plainly)

**Negative forms mean genuinely different things — this is the single
most important trap:**

"You **must not** touch that." (strong prohibition — don't do it) ·
"You **don't have to** come." (no obligation either way — optional,
your choice)

**A quick way to choose**: internal urgency → must. External
rule/deadline → have to. Gentle advice → should. Plain practical
requirement → need to.`,
    simpleHi: `**"Must" — strong obligation, often speaker ke apne sense of importance se:**

"I must call my mother today." (mujhe lagta hai ye important hai,
personally)

**"Have to" — ek outside rule, requirement, ya circumstance se
obligation:**

"I have to submit this form by Friday." (ek external deadline, meri
personal choice nahi)

**"Should" — advice ya ek recommendation, must/have to se bahut kam
strong:**

"You should drink more water." (ek suggestion, ek strict rule nahi)

**"Need to" — ek practical necessity, often must se zyada neutral:**

"I need to buy groceries." (ek practical requirement, plainly kaha
gaya)

**Negative forms genuinely different cheezein mean karte hain — ye
single sabse important trap hai:**

"You **must not** touch that." (strong prohibition — mat karo) · "You
**don't have to** come." (koi obligation nahi, koi bhi taraf — optional,
tumhari choice)

**Choose karne ka ek quick tareeka**: internal urgency → must. External
rule/deadline → have to. Gentle advice → should. Plain practical
requirement → need to.`,

    content: `**Why "must" and "have to" genuinely aren't synonyms, despite both
translating to a similar-feeling obligation.**

The real difference is about the SOURCE of the obligation, not its
strength. "Must" traditionally signals the speaker's own authority or
personal conviction — a parent saying "you must be home by 9" is
speaking from their own authority; a student saying "I must study
tonight" is expressing personal urgency. "Have to" signals an
obligation coming from outside the speaker — a rule, a deadline, a
circumstance neither party invented. In casual modern speech, "have
to" is genuinely more common overall, but the distinction still
matters, especially in the negative forms.

**The negative forms are where this distinction becomes genuinely
critical, not just stylistic.** "You must not be late" is a strong
prohibition — an instruction not to do something. "You don't have to
be early" states the complete opposite kind of thing — that there's no
obligation at all, that being early is entirely optional. Confusing
these two negatives doesn't just sound slightly off — it can
communicate the exact opposite of what you mean.

**"Should" sits in a genuinely different, much softer category:
advice, not obligation.** "You should see a doctor" recommends without
demanding — the listener remains free to disagree or ignore it without
breaking a rule. This connects directly to Module 7's request/
suggestion phrases — "should" functions similarly to a strong
suggestion, not a command.

**"Need to" is often the most neutral, practical choice among all
four, useful specifically when you want to state a requirement without
implying either personal authority (must) or an external rule (have
to).** "I need to leave soon" simply states a practical fact about
what's required, without taking a stance on where that requirement
comes from — which is exactly why it's often the safest, most natural
default in everyday conversation.`,
    contentHi: `**"Must" aur "have to" genuinely synonyms kyun nahi hain, dono ek similar-feeling obligation mein translate karne ke bawajood.**

Real difference obligation ke SOURCE ke baare mein hai, uski strength
ke baare mein nahi. "Must" traditionally speaker ki apni authority ya
personal conviction signal karta hai — ek parent kehta hai "you must
be home by 9" apni khud ki authority se bol raha hai; ek student kehta
hai "I must study tonight" personal urgency express kar raha hai.
"Have to" ek obligation signal karta hai jo speaker ke bahar se aata
hai — ek rule, ek deadline, ek circumstance jo kisi ne invent nahi
kiya. Casual modern speech mein, "have to" genuinely overall zyada
common hai, par distinction phir bhi matter karta hai, especially
negative forms mein.

**Negative forms wo jagah hain jahan ye distinction genuinely critical
ban jaata hai, sirf stylistic nahi.** "You must not be late" ek strong
prohibition hai — kuch na karne ki instruction. "You don't have to be
early" bilkul opposite tarah ki cheez state karta hai — ki koi
obligation bilkul nahi hai, ki early hona poori tarah optional hai. In
do negatives ko confuse karna sirf thoda off sound nahi karta — ye
exactly jo tumhara matlab hai uska opposite communicate kar sakta hai.

**"Should" ek genuinely different, bahut softer category mein baithta
hai: advice, obligation nahi.** "You should see a doctor" bina demand
kiye recommend karta hai — listener free rehta hai disagree karne ya
ignore karne ke liye bina ek rule tode. Ye directly Module 7's
request/suggestion phrases se connect hota hai — "should" ek strong
suggestion jaisa function karta hai, ek command nahi.

**"Need to" often teeno ke beech sabse neutral, practical choice hai,
useful specifically jab tum ek requirement state karna chahte ho bina
personal authority (must) ya ek external rule (have to) implying
kiye.** "I need to leave soon" simply ek practical fact state karta
hai jo required hai, bina stance liye ki wo requirement kahan se aati
hai — jo exactly reason hai ki ye often everyday conversation mein
safest, most natural default hai.`,

    readingPassage: `I have a busy day today. I have to finish a report by noon — my manager set that deadline. I also feel like I must call my sister; it's been too long. You should really try to relax more, my friend always tells me, but honestly, I need to focus on work right now. I don't have to go to the gym today, so maybe I'll rest instead.`,
    readingPassageHi: `Aaj mera ek busy day hai. I have to finish a report by noon — mere manager ne wo deadline set ki. Mujhe bhi lagta hai I must call my sister; bahut time ho gaya hai. You should really try to relax more, mera friend hamesha mujhe kehta hai, but honestly, I need to focus on work right now. I don't have to go to the gym today, so maybe main iske bajaye rest karunga.`,

    vocabulary: [
      {
        word: 'obligation',
        wordHi: 'obligation (dayitva)',
        meaning: 'something you are required to do',
        meaningHi: 'kuch jo tumhe karna required hai',
        example: 'I have an obligation to finish this project.',
        exampleHi: 'I have an obligation to finish this project.',
        pronunciation: 'ob-li-GEY-shun',
      },
      {
        word: 'prohibition',
        wordHi: 'prohibition (nishedh)',
        meaning: 'a rule that forbids something',
        meaningHi: 'ek rule jo kisi cheez ko forbid karta hai',
        example: "There's a strict prohibition on smoking here.",
        exampleHi: "There's a strict prohibition on smoking here.",
        pronunciation: 'proh-i-BISH-un',
      },
      {
        word: 'optional',
        wordHi: 'optional (vaikalpik)',
        meaning: 'not required — a matter of choice',
        meaningHi: 'required nahi — ek choice ki baat',
        example: 'Attending the party is optional.',
        exampleHi: 'Attending the party is optional.',
        pronunciation: 'OP-shuh-nuhl',
      },
      {
        word: 'deadline',
        wordHi: 'deadline (samay seema)',
        meaning: 'the time by which something must be finished',
        meaningHi: 'wo time jab tak kuch finish hona chahiye',
        example: 'I have to meet this deadline by Friday.',
        exampleHi: 'I have to meet this deadline by Friday.',
        pronunciation: 'DED-lyn',
      },
    ],

    examples: [
      {
        title: 'Four obligation words, four different feels',
        titleHi: 'Char obligation words, char different feels',
        code: `Must: I must apologize to her — I feel really bad about this.
Have to: I have to submit this by 5pm, it's the company policy.
Should: You should try the new cafe, it's really good.
Need to: I need to buy milk on the way home.`,
        output: 'Each sentence uses obligation genuinely differently, from internal urgency to plain necessity.',
        explain:
          'Saying all four out loud back to back helps you feel the real difference in tone, not just memorize a rule about them.',
        explainHi:
          'Sab chaaron ko back to back zor se bolna real difference in tone feel karne mein help karta hai, sirf ek rule memorize karne ke bajaye.',
      },
      {
        title: '"Must not" vs. "don\'t have to" — opposite meanings',
        titleHi: '"Must not" vs. "don\'t have to" — opposite meanings',
        code: `You must not share this password with anyone. (strong prohibition)
You don't have to share your opinion if you're not comfortable. (no obligation, your choice)`,
        output: 'Both are negative, but they mean genuinely opposite things.',
        explain:
          'This is the single most important trap in this lesson — confusing these two can communicate the exact opposite of what you intend.',
        explainHi:
          'Ye lesson ka single sabse important trap hai — in dono ko confuse karna exactly wo jo tum intend karte ho uska opposite communicate kar sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: 'Using "must not" and "don\'t have to" as if they mean the same thing',
        right: '"Must not" = strong prohibition (don\'t do it). "Don\'t have to" = no obligation either way (your choice).',
        why: 'These negative forms mean genuinely opposite things — one forbids an action, the other simply removes any requirement to do it. Confusing them can reverse your intended meaning entirely.',
        whyHi: 'Ye negative forms genuinely opposite cheezein mean karte hain — ek ek action forbid karta hai, doosra simply use karne ki koi requirement hataata hai. Inhe confuse karna tumhare intended meaning ko poori tarah reverse kar sakta hai.',
      },
      {
        wrong: 'Using "must" for every obligation, including ones that come from an external rule or deadline',
        right: '"I have to submit this by Friday" (an external deadline) rather than "I must submit this by Friday."',
        why: 'While both are understandable, "have to" more naturally signals an obligation coming from outside you (a rule, a deadline), while "must" traditionally signals personal urgency or authority.',
        whyHi: 'Chahe dono understandable hain, "have to" zyada naturally ek obligation signal karta hai jo tumhare bahar se aata hai (ek rule, ek deadline), jabki "must" traditionally personal urgency ya authority signal karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Workplace rules and deadlines** ("I have to be in the office by 9," "You have to get manager approval") rely almost entirely on "have to" to describe externally imposed requirements.',
        hi: '**Workplace rules aur deadlines** ("I have to be in the office by 9," "You have to get manager approval") almost poori tarah "have to" pe rely karte hain externally imposed requirements describe karne ke liye.',
      },
      {
        en: '**Giving gentle advice to a friend** ("You should really rest more," "You should try this") relies on "should" specifically because it recommends without commanding.',
        hi: '**Ek friend ko gentle advice dena** ("You should really rest more," "You should try this") specifically "should" pe rely karta hai kyunki ye command kiye bina recommend karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'In everyday conversation, do native speakers actually maintain the must/have to distinction, or has it blurred?',
        qHi: 'Everyday conversation mein, kya native speakers actually must/have to distinction maintain karte hain, ya ye blur ho gaya hai?',
        a: 'It has genuinely blurred somewhat in casual speech — "have to" is used very broadly today, including for personal urgency ("I have to see this movie!"). But the distinction still matters clearly in the negative forms (must not vs. don\'t have to), which never blur, so that part is worth learning precisely.',
        aHi: 'Casual speech mein ye genuinely somewhat blur ho gaya hai — "have to" aaj bahut broadly use hota hai, personal urgency ke liye bhi ("I have to see this movie!"). Par distinction phir bhi negative forms mein clearly matter karta hai (must not vs. don\'t have to), jo kabhi blur nahi hote, so wo part precisely seekhne layak hai.',
      },
      {
        q: 'What\'s the softest way to tell someone they need to do something, without sounding demanding?',
        qHi: 'Kisi ko batana ki unhe kuch karna hai sabse soft tareeka kya hai, demanding sound kiye bina?',
        a: '"You might want to..." or "should" is genuinely softer than "have to" or "must" — "You might want to double-check that" recommends gently, leaving the listener in control, unlike a direct obligation word.',
        aHi: '"You might want to..." ya "should" genuinely "have to" ya "must" se softer hai — "You might want to double-check that" gently recommend karta hai, listener ko control mein chhodte hue, ek direct obligation word ke unlike.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, say one sentence each with "must," "have to," "should," and "need to" about your own real day.',
        taskHi: 'Zor se, "must," "have to," "should," aur "need to" ke saath apne khud ke real din ke baare mein ek-ek sentence bolo.',
        hint: '"I must..." (something personally urgent) "I have to..." (an external deadline) "I should..." (advice to yourself) "I need to..." (a practical task)',
        hintHi: '"I must..." (kuch personally urgent) "I have to..." (ek external deadline) "I should..." (khud ko advice) "I need to..." (ek practical task)',
      },
      {
        task: 'Out loud, say the difference between "You must not touch that" and "You don\'t have to touch that," explaining the meaning of each.',
        taskHi: 'Zor se, "You must not touch that" aur "You don\'t have to touch that" ke beech difference bolo, har ek ka meaning explain karte hue.',
        hint: '"Must not" forbids it. "Don\'t have to" just means it\'s optional.',
        hintHi: '"Must not" ise forbid karta hai. "Don\'t have to" ka matlab bas ye hai ki ye optional hai.',
      },
    ],

    keyTakeaways: [
      '"Must" traditionally signals personal urgency or authority; "have to" signals an obligation from an external rule or circumstance.',
      '"Should" is advice, much weaker than an obligation — the listener remains free to disagree.',
      '"Need to" is often the most neutral, practical choice, stating a requirement without implying where it comes from.',
      'The negative forms mean genuinely opposite things: "must not" forbids an action; "don\'t have to" removes any obligation, making it optional.',
      'In casual speech, "have to" is used very broadly today, but the must-not/don\'t-have-to distinction never blurs and is worth learning precisely.',
    ],
    keyTakeawaysHi: [
      '"Must" traditionally personal urgency ya authority signal karta hai; "have to" ek external rule ya circumstance se obligation signal karta hai.',
      '"Should" advice hai, ek obligation se bahut weaker — listener disagree karne ke liye free rehta hai.',
      '"Need to" often sabse neutral, practical choice hai, ek requirement state karta hai bina implying kiye ye kahan se aata hai.',
      'Negative forms genuinely opposite cheezein mean karte hain: "must not" ek action forbid karta hai; "don\'t have to" koi bhi obligation hataata hai, ise optional banate hue.',
      'Casual speech mein, "have to" aaj bahut broadly use hota hai, par must-not/don\'t-have-to distinction kabhi blur nahi hota aur precisely seekhne layak hai.',
    ],
  },
];
