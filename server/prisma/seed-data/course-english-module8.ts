/**
 * English Speaking Complete Course — Module 8: Describing People,
 * Places & Things, lessons 1-3.
 *
 * Lesson 1: Adjective order — a real, surprisingly rigid pattern
 *           native speakers follow without ever being taught it
 *           explicitly.
 * Lesson 2: "There is / there are" for describing what exists in a
 *           place, and the singular/plural agreement mistake this
 *           structure invites.
 * Lesson 3: Comparisons (-er/more, -est/most) for describing people,
 *           places, and things against each other.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_8: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-adjective-order',
    title: 'Adjective Order — A Rule Native Speakers Never Learned',
    titleHi: 'Adjective Order — Ek Rule Jo Native Speakers Ne Kabhi Seekha Hi Nahi',
    description:
      '"A big old red car" sounds right; "a red old big car" sounds wrong — for a rule almost no native speaker could actually state out loud.',
    descriptionHi:
      '"A big old red car" sahi sound karta hai; "a red old big car" galat sound karta hai — ek rule ke liye jise almost koi bhi native speaker actually zor se state nahi kar sakta.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Adjective order is like the order you naturally put on clothes — underwear before trousers, socks before shoes — nobody taught you the sequence directly, but doing it backward feels obviously wrong the moment you try.** English speakers absorb adjective order the same way, through years of hearing it, not through a rule anyone recited to them.',
      hi: 'Adjective order un clothes pehnne ke order jaisa hai jo tum naturally pehente ho — underwear trousers se pehle, socks shoes se pehle — kisi ne tumhe sequence directly nahi sikhaya, par ise backward karna obviously galat feel karta hai jis pal tum try karo. English speakers adjective order isi tarah absorb karte hain, saalon sunne se, kisi rule se nahi jo kisi ne unhe recite kiya ho.',
    },

    simple: `**A rough, practical order for stacking multiple adjectives before
a noun:**

opinion → size → age → shape → color → origin → material → purpose +
noun

"a **beautiful** (opinion) **small** (size) **old** (age) **round**
(shape) **wooden** (material) table"

**In practice, you'll rarely stack more than two or three adjectives
at once — and the order below covers almost every everyday case:**

- Opinion + noun: "a **lovely** house"
- Size + age + noun: "a **big old** house"
- Age + color + noun: "an **old red** car"
- Size + shape + color + noun: "a **small round blue** ball"

**A useful shortcut**: opinion words (nice, beautiful, lovely) almost
always come first, and where something is from or what it's made of
(Indian, wooden, cotton) almost always comes last, right before the
noun.`,
    simpleHi: `**Ek noun se pehle multiple adjectives stack karne ka ek rough, practical order:**

opinion → size → age → shape → color → origin → material → purpose +
noun

"a **beautiful** (opinion) **small** (size) **old** (age) **round**
(shape) **wooden** (material) table"

**Practice mein, tum rarely ek saath do ya teen se zyada adjectives
stack karoge — aur neeche wala order almost har everyday case cover
karta hai:**

- Opinion + noun: "a **lovely** house"
- Size + age + noun: "a **big old** house"
- Age + color + noun: "an **old red** car"
- Size + shape + color + noun: "a **small round blue** ball"

**Ek useful shortcut**: opinion words (nice, beautiful, lovely) almost
hamesha pehle aate hain, aur kuch kahan se hai ya kis cheez se bana hai
(Indian, wooden, cotton) almost hamesha last mein aata hai, noun se
bilkul pehle.`,

    content: `**Why this rule matters even though almost nobody consciously
knows it.**

Native English speakers don't memorize this order as a rule — they
absorb it unconsciously through years of hearing millions of correctly
ordered phrases. This means a native listener genuinely notices when
the order is scrambled, even if they couldn't explain the rule
themselves if you asked them directly. "A red big car" sounds
distinctly "off" to them, even though every individual word is
perfectly correct — the problem is purely about sequence.

**Hindi doesn't enforce this same rigid order**, which is exactly why
this is worth learning explicitly as a non-native speaker — you're
learning consciously what a native speaker learned unconsciously
before age five. This isn't a sign that Hindi speakers make more
"mistakes" here than in other areas; it's simply an area where a rule
exists that has to be learned deliberately rather than absorbed as a
small child.

**A genuinely practical simplification: you rarely need the full
eight-category order.** Real speech almost always uses just two or
three adjectives together at most. The two anchors worth remembering
most: opinion words tend to go first ("a nice small room," not "a
small nice room"), and origin/material words tend to go right before
the noun ("a small Indian restaurant," not "an Indian small
restaurant").

**This rule applies only when STACKING multiple adjectives before one
noun — a single adjective never has an "order" problem.** "A big
house" or "an old car" alone are always fine; the challenge only
appears once you start combining two or more.`,
    contentHi: `**Ye rule kyun matter karta hai chahe almost koi consciously ye jaanta nahi.**

Native English speakers is order ko ek rule ki tarah memorize nahi
karte — wo ise unconsciously absorb karte hain saalon millions
correctly ordered phrases sunne se. Iska matlab ek native listener
genuinely notice karta hai jab order scrambled hota hai, chahe wo khud
rule explain na kar paayein agar tum unse directly poocho. "A red big
car" unhe distinctly "off" sound karta hai, chahe har individual word
perfectly correct ho — problem purely sequence ke baare mein hai.

**Hindi ye same rigid order enforce nahi karti**, yahi exactly reason
hai ki ye ek non-native speaker ke liye explicitly seekhne layak hai —
tum consciously wo seekh rahe ho jo ek native speaker ne unconsciously
age five se pehle seekha. Ye sign nahi hai ki Hindi speakers yahan
doosri areas se zyada "mistakes" karte hain; ye simply ek area hai
jahan ek rule exist karta hai jise deliberately seekhna padta hai, ek
chhote bacche ki tarah absorb karne ke bajaye.

**Ek genuinely practical simplification: tumhe rarely poore eight-
category order ki zaroorat hoti hai.** Real speech almost hamesha
zyada se zyada do ya teen adjectives saath mein use karti hai. Do
anchors jo sabse zyada yaad rakhne layak hain: opinion words pehle
jaate hain ("a nice small room," "a small nice room" nahi), aur
origin/material words noun se bilkul pehle jaate hain ("a small Indian
restaurant," "an Indian small restaurant" nahi).

**Ye rule sirf tab apply hota hai jab multiple adjectives ek noun se
pehle STACK ho rahe hon — ek single adjective ko kabhi "order"
problem nahi hoti.** "A big house" ya "an old car" akele hamesha fine
hain; challenge sirf tab appear hota hai jab tum do ya zyada combine
karna start karte ho.`,

    readingPassage: `Let me describe my grandmother's house. It's a beautiful old house with a small red door. Inside, there's a big wooden table in the kitchen. My favorite room is the cozy little living room, with an old blue sofa. It's a wonderful place, full of happy memories.`,
    readingPassageHi: `Main apni grandmother ke ghar ko describe karta hoon. It's a beautiful old house with a small red door. Andar, there's a big wooden table kitchen mein. Mera favorite room hai cozy little living room, ek old blue sofa ke saath. It's a wonderful place, happy memories se bhara hua.`,

    vocabulary: [
      {
        word: 'cozy',
        wordHi: 'cozy (aramdaayak)',
        meaning: 'warm and comfortable',
        meaningHi: 'warm aur comfortable',
        example: "It's a cozy little cafe.",
        exampleHi: "It's a cozy little cafe.",
        pronunciation: 'KOH-zee',
      },
      {
        word: 'wooden',
        wordHi: 'wooden (lakdi ka)',
        meaning: 'made of wood',
        meaningHi: 'lakdi se bana hua',
        example: 'We have a wooden dining table.',
        exampleHi: 'We have a wooden dining table.',
        pronunciation: 'WOOD-en',
      },
      {
        word: 'favorite',
        wordHi: 'favorite (sabse pasandida)',
        meaning: 'liked more than any other',
        meaningHi: 'kisi aur se zyada pasand kiya gaya',
        example: 'This is my favorite room in the house.',
        exampleHi: 'This is my favorite room in the house.',
        pronunciation: 'FEY-ver-it',
      },
      {
        word: 'memory',
        wordHi: 'memory (yaad)',
        meaning: 'something remembered from the past',
        meaningHi: 'ek cheez jo past se yaad hai',
        example: 'I have wonderful memories of this place.',
        exampleHi: 'I have wonderful memories of this place.',
        pronunciation: 'MEM-uh-ree',
      },
    ],

    examples: [
      {
        title: 'Adjective order across several short descriptions',
        titleHi: 'Adjective order kayi short descriptions mein',
        code: `a beautiful old house   (opinion + age)
a small red car         (size + color)
a big Indian city        (size + origin)
a lovely wooden table    (opinion + material)`,
        output: 'Each pair follows the opinion/size/age...material/purpose sequence.',
        explain:
          'Reading pairs like this out loud, and noticing that the reverse order sounds distinctly wrong, is the fastest way to internalize this pattern.',
        explainHi:
          'Aise pairs zor se padhna, aur notice karna ki reverse order distinctly galat sound karta hai, is pattern ko internalize karne ka sabse fast tareeka hai.',
      },
      {
        title: 'Stacking three adjectives',
        titleHi: 'Teen adjectives stack karna',
        code: `a beautiful small wooden box   (opinion + size + material)`,
        output: 'A natural three-adjective stack, in the correct order.',
        explain:
          '"A wooden small beautiful box" uses the exact same three words but sounds distinctly wrong — the meaning is identical, only the order has changed.',
        explainHi:
          '"A wooden small beautiful box" exact same teen words use karta hai par distinctly galat sound karta hai — meaning identical hai, sirf order change hua hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"A red big car."',
        right: '"A big red car."',
        why: 'Size comes before color in the standard adjective order — this specific reversal is one of the most common ways the rule gets broken, since both words feel equally "descriptive" without an obvious reason to favor one order.',
        whyHi: 'Standard adjective order mein color se pehle size aata hai — ye specific reversal ek sabse common tareeka hai jispe rule toota hai, kyunki dono words equally "descriptive" feel karte hain bina ek order ko favor karne ka obvious reason ke.',
      },
      {
        wrong: '"An Indian big city." (origin before size)',
        right: '"A big Indian city."',
        why: 'Origin (Indian) belongs right before the noun, near the very end of the order — size comes much earlier. This reversal is common because origin feels like an important, defining fact, but its correct position is still near the end.',
        whyHi: 'Origin (Indian) noun se bilkul pehle belong karta hai, order ke bilkul end ke paas — size bahut pehle aata hai. Ye reversal common hai kyunki origin ek important, defining fact jaisa feel karta hai, par uski correct position phir bhi end ke paas hai.',
      },
    ],

    realWorld: [
      {
        en: '**Describing a place you visited, a product, or a person in conversation** — nearly every rich, detailed description in English relies on stacking two or three adjectives correctly ordered.',
        hi: '**Ek jagah describe karna jo tumne visit ki, ek product, ya ek person conversation mein** — nearly har rich, detailed description English mein do ya teen adjectives ko correctly ordered stack karne pe rely karti hai.',
      },
      {
        en: '**Writing a product description or a review** ("a comfortable small modern chair") depends on this exact ordering to sound natural and professional rather than awkward.',
        hi: '**Ek product description ya review likhna** ("a comfortable small modern chair") is exact ordering pe depend karta hai natural aur professional sound karne ke liye, awkward nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Do I really need to memorize all eight categories of this order?',
        qHi: 'Kya mujhe genuinely is order ki sab eight categories memorize karni hain?',
        a: 'No — in real speech, you\'ll almost never stack more than two or three adjectives at once. Focus on the two most useful anchors: opinion words go first, and origin/material words go last, right before the noun. The middle categories (size, age, shape, color) will come with practice and exposure.',
        aHi: 'Nahi — real speech mein, tum almost kabhi ek saath do ya teen se zyada adjectives stack nahi karoge. Do sabse useful anchors pe focus karo: opinion words pehle jaate hain, aur origin/material words last mein jaate hain, noun se bilkul pehle. Middle categories (size, age, shape, color) practice aur exposure ke saath aayengi.',
      },
      {
        q: 'What happens if I use the wrong order — will people still understand me?',
        qHi: 'Agar main galat order use karoon to kya hoga — kya log mujhe phir bhi samajhenge?',
        a: 'Yes, you\'ll almost always be understood — this is a naturalness issue, not a comprehension-breaking one. But getting it right is a genuinely high-value, low-effort way to sound noticeably more fluent, since it\'s something native speakers are very sensitive to even unconsciously.',
        aHi: 'Haan, tum almost hamesha samjhe jaoge — ye ek naturalness issue hai, comprehension-breaking nahi. Par ise sahi karna ek genuinely high-value, low-effort tareeka hai noticeably zyada fluent sound karne ka, kyunki ye ek cheez hai jiske liye native speakers bahut sensitive hain even unconsciously.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, put these adjectives in the correct order and describe a real object near you: "wooden," "small," "old."',
        taskHi: 'Zor se, in adjectives ko correct order mein rakho aur apne paas ek real object describe karo: "wooden," "small," "old."',
        hint: '"a small old wooden [object]" (age comes before material)',
        hintHi: '"a small old wooden [object]" (age material se pehle aata hai)',
      },
      {
        task: 'Out loud, describe your hometown using at least two stacked adjectives in the correct order.',
        taskHi: 'Zor se, apne hometown ko describe karo kam se kam do stacked adjectives correct order mein use karke.',
        hint: '"a beautiful small city" or "a big old town" — opinion/size before age, age before everything else.',
        hintHi: '"a beautiful small city" ya "a big old town" — opinion/size age se pehle, age baaki sab se pehle.',
      },
    ],

    keyTakeaways: [
      'Native speakers follow a rough adjective order (opinion, size, age, shape, color, origin, material) unconsciously, without ever memorizing it as a rule.',
      'In practice, most sentences stack only two or three adjectives — full eight-category order is rarely needed.',
      'The two most useful anchors: opinion words go first, origin/material words go last, right before the noun.',
      'A single adjective never has an order problem — the challenge only appears when stacking two or more.',
      'Getting this wrong is usually still understood, but fixing it is a high-value, low-effort way to sound more fluent.',
    ],
    keyTakeawaysHi: [
      'Native speakers ek rough adjective order follow karte hain (opinion, size, age, shape, color, origin, material) unconsciously, ise kabhi ek rule ki tarah memorize kiye bina.',
      'Practice mein, zyadatar sentences sirf do ya teen adjectives stack karte hain — full eight-category order rarely zaroorat hoti hai.',
      'Do sabse useful anchors: opinion words pehle jaate hain, origin/material words last mein jaate hain, noun se bilkul pehle.',
      'Ek single adjective ko kabhi order problem nahi hoti — challenge sirf tab appear hota hai jab do ya zyada stack karte ho.',
      'Ise galat karna usually phir bhi samjha jaata hai, par ise fix karna zyada fluent sound karne ka ek high-value, low-effort tareeka hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-there-is-there-are',
    title: '"There Is" & "There Are" — Describing What Exists',
    titleHi: '"There Is" Aur "There Are" — Kya Exist Karta Hai Describe Karna',
    description:
      '"There is a park near my house" and "there are many parks in this city" — one small word, "is" or "are," that has to match what comes right after it.',
    descriptionHi:
      '"There is a park near my house" aur "there are many parks in this city" — ek chhota word, "is" ya "are," jise match karna hota hai us cheez se jo uske turant baad aati hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**"There is/are" is like pointing at a place and announcing what you see there.** "There is a shop" points and names one thing; "there are many shops" points and names several — the pointing word itself ("there") never changes, only the "is/are" that follows.',
      hi: 'Ek "there is/are" ek jagah pe point karke announce karne jaisa hai ki tum wahan kya dekhte ho. "There is a shop" point karta hai aur ek cheez naam leta hai; "there are many shops" point karta hai aur kayi naam leta hai — pointing word khud ("there") kabhi change nahi hota, sirf "is/are" jo follow karta hai.',
    },

    simple: `**"There is" (singular) and "there are" (plural) describe what
exists in a place:**

- "**There is** a park near my house." (one park)
- "**There are** many parks in this city." (several parks)
- "**There is** a problem with this plan." (one problem)
- "**There are** two ways to solve this." (two ways)

**The rule: match "is/are" to the noun that comes right after it, not
to anything earlier in the sentence.**

**Negative and question forms:**

"There isn't a bank nearby." · "There aren't any seats left." · "Is
there a bathroom here?" · "Are there any tickets left?"

**Past tense versions work the same way:**

"There **was** a storm last night." (singular) · "There **were** many
people at the event." (plural)`,
    simpleHi: `**"There is" (singular) aur "there are" (plural) describe karte hain kya ek jagah exist karta hai:**

- "**There is** a park near my house." (ek park)
- "**There are** many parks in this city." (kayi parks)
- "**There is** a problem with this plan." (ek problem)
- "**There are** two ways to solve this." (do ways)

**Rule: "is/are" ko us noun se match karo jo uske turant baad aata
hai, sentence mein pehle kisi cheez se nahi.**

**Negative aur question forms:**

"There isn't a bank nearby." · "There aren't any seats left." · "Is
there a bathroom here?" · "Are there any tickets left?"

**Past tense versions same tareeke se kaam karti hain:**

"There **was** a storm last night." (singular) · "There **were** many
people at the event." (plural)`,

    content: `**Why "there is/are" is genuinely useful, distinct from just "have."**

"I have a park near my house" doesn't work in English the way it
might feel like it should from a direct translation instinct — "have"
describes possession or a relationship to the subject ("I have a
car"), while "there is/are" simply announces the existence of
something in a place, with no ownership implied. "There is a park near
my house" describes the park existing nearby; it doesn't belong to
you.

**The specific, easy-to-miss trap: matching "is/are" to the WRONG
noun.** In "There is a book and two pens on the table," English
convention actually matches the verb to whichever noun comes
immediately after "there," which here is "a book" (singular) — so
"is" is correct even though a plural noun follows later in the list.
This detail trips up even careful learners, since the instinct is to
look at the whole list rather than just the very next word.

**"There's" is the natural spoken contraction of "there is," used
constantly in casual speech** — "There's a shop around the corner."
There is no equally common contraction for "there are" in the same
way ("there're" exists but sounds awkward and is rarely used), so
"there are" is usually said in full.

**A common, specific overuse case worth flagging directly: describing
a problem or issue.** "There is a problem with the plan" is the
natural way to introduce an issue in English — a Hindi-influenced
alternative like "a problem is there in the plan" is understandable
but noticeably reordered compared to the standard English shape.`,
    contentHi: `**"There is/are" genuinely useful kyun hai, "have" se distinct.**

"I have a park near my house" English mein waise kaam nahi karta jaisa
ek direct translation instinct se feel ho sakta hai — "have" possession
ya subject se ek relationship describe karta hai ("I have a car"),
jabki "there is/are" simply kisi jagah mein kisi cheez ke existence ko
announce karta hai, koi ownership implied nahi. "There is a park near
my house" park ko nearby exist karte hue describe karta hai; ye
tumhara nahi hai.

**Specific, easy-to-miss trap: "is/are" ko WRONG noun se match karna.**
"There is a book and two pens on the table" mein, English convention
actually verb ko us noun se match karti hai jo "there" ke turant baad
aata hai, jo yahan "a book" hai (singular) — so "is" correct hai chahe
ek plural noun baad mein list mein follow kare. Ye detail careful
learners ko bhi trip up karta hai, kyunki instinct poori list dekhne
ka hota hai, sirf bilkul next word dekhne ka nahi.

**"There's" "there is" ka natural spoken contraction hai, casual speech
mein constantly use hota hai** — "There's a shop around the corner."
"There are" ke liye same tarah ka koi equally common contraction nahi
hai ("there're" exist karta hai par awkward sound karta hai aur rarely
use hota hai), so "there are" usually full mein bola jaata hai.

**Ek common, specific overuse case jo directly flag karne layak hai:
ek problem ya issue describe karna.** "There is a problem with the
plan" English mein ek issue introduce karne ka natural tareeka hai — ek
Hindi-influenced alternative jaisa "a problem is there in the plan"
understandable hai par standard English shape ke comparison mein
noticeably reordered hai.`,

    readingPassage: `Let me tell you about my neighborhood. There is a park near my house, and there are many trees around it. There is also a small shop on the corner, but there aren't many restaurants nearby. There was a new cafe that opened last month, and it's already popular.`,
    readingPassageHi: `Main tumhe apne neighborhood ke baare mein batata hoon. There is a park near my house, aur there are many trees around it. There is also a small shop on the corner, but there aren't many restaurants nearby. There was a new cafe jo pichhle mahine open hua, aur ye already popular hai.`,

    vocabulary: [
      {
        word: 'nearby',
        wordHi: 'nearby (aas-paas)',
        meaning: 'close to a place, not far',
        meaningHi: 'ek jagah ke close, door nahi',
        example: 'There is a good bakery nearby.',
        exampleHi: 'There is a good bakery nearby.',
        pronunciation: 'NEER-by',
      },
      {
        word: 'neighborhood',
        wordHi: 'neighborhood (mohalla)',
        meaning: 'the area around where you live',
        meaningHi: 'wo area jahan tum rehte ho uske aas-paas',
        example: 'I love my neighborhood — it\'s very quiet.',
        exampleHi: 'I love my neighborhood — it\'s very quiet.',
        pronunciation: 'NEY-ber-hood',
      },
      {
        word: 'popular',
        wordHi: 'popular (lokpriya)',
        meaning: 'liked by many people',
        meaningHi: 'kayi logon ko pasand',
        example: 'This restaurant is very popular.',
        exampleHi: 'This restaurant is very popular.',
        pronunciation: 'POP-yoo-ler',
      },
      {
        word: 'corner',
        wordHi: 'corner (kona)',
        meaning: 'the point where two streets or walls meet',
        meaningHi: 'wo point jahan do streets ya walls milte hain',
        example: 'The shop is on the corner of the street.',
        exampleHi: 'The shop is on the corner of the street.',
        pronunciation: 'KOR-ner',
      },
    ],

    examples: [
      {
        title: 'Describing a place with there is/are',
        titleHi: 'There is/are se ek jagah describe karna',
        code: `There is a library in my town. There are also two parks and a small market. There isn't a large mall, but there are plenty of small shops.`,
        output: 'is/are switches correctly based on the noun right after it each time.',
        explain:
          'Notice each "is" or "are" matches the very next noun (a library = singular is; two parks = plural are) — this is the exact skill to practice.',
        explainHi:
          'Notice karo har "is" ya "are" bilkul next noun se match karta hai (a library = singular is; two parks = plural are) — ye exact skill hai practice karne layak.',
      },
      {
        title: 'The tricky case: matching the very next noun in a list',
        titleHi: 'Tricky case: list mein bilkul next noun ko match karna',
        code: `There is a pen, a notebook, and two books on the desk.`,
        output: '"is" is correct because "a pen" (singular) comes immediately after "there."',
        explain:
          'Even though the list includes plural "two books" later, the verb only agrees with the very first noun right after "there" — this is the specific detail worth double-checking in longer lists.',
        explainHi:
          'Chahe list mein baad mein plural "two books" include hai, verb sirf bilkul pehle noun se agree karta hai "there" ke turant baad — ye specific detail hai jo lambi lists mein double-check karne layak hai.',
      },
    ],

    mistakes: [
      {
        wrong: '"There is a park and two shops on this street." (using singular "is" but not checking the very next noun carefully)',
        right: 'This is actually already correct — "is" matches "a park," the noun immediately following "there."',
        why: 'This is included to highlight the rule directly: many learners second-guess this sentence and incorrectly "fix" it to "are," not realizing the rule cares only about the very next noun, not the whole list.',
        whyHi: 'Ye rule ko directly highlight karne ke liye include kiya gaya hai: kayi learners is sentence ko second-guess karte hain aur incorrectly ise "are" mein "fix" kar dete hain, realize kiye bina ki rule sirf bilkul next noun ki parwah karta hai, poori list ki nahi.',
      },
      {
        wrong: '"A problem is there with this plan."',
        right: '"There is a problem with this plan."',
        why: 'English consistently starts this structure with "there," not with the subject — reordering it this way is a common, direct-translation-influenced pattern that sounds noticeably non-standard.',
        whyHi: 'English consistently is structure ko "there" se start karti hai, subject se nahi — ise is tarah reorder karna ek common, direct-translation-influenced pattern hai jo noticeably non-standard sound karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Describing a place to someone unfamiliar with it** — a neighborhood, a hotel, a city — relies almost entirely on "there is/are" to list what exists there.',
        hi: '**Kisi jagah ko describe karna kisi ke liye jo usse unfamiliar hai** — ek neighborhood, ek hotel, ek city — almost poori tarah "there is/are" pe rely karta hai wahan kya exist karta hai list karne ke liye.',
      },
      {
        en: '**Raising an issue or a concern politely** ("There is a small problem with the schedule") is a very common, natural way to introduce a topic without sounding blunt.',
        hi: '**Ek issue ya concern politely raise karna** ("There is a small problem with the schedule") ek bahut common, natural tareeka hai ek topic introduce karne ka bina blunt sound kiye.',
      },
    ],

    interviewQA: [
      {
        q: 'How do I decide between "there is" and "there\'s" — are they always interchangeable?',
        qHi: '"there is" aur "there\'s" ke beech kaise decide karoon — kya ye hamesha interchangeable hain?',
        a: '"There\'s" is the natural, common contraction of "there is" in speech and casual writing — completely interchangeable with "there is" in almost every situation. In more formal writing, "there is" written out in full is sometimes preferred, but both are correct.',
        aHi: '"There\'s" speech aur casual writing mein "there is" ka natural, common contraction hai — almost har situation mein "there is" ke saath completely interchangeable. Zyada formal writing mein, "there is" full mein likha hua kabhi kabhi preferred hai, par dono correct hain.',
      },
      {
        q: 'What if I genuinely don\'t know if something is singular or plural when I start the sentence?',
        qHi: 'Agar mujhe genuinely nahi pata ki kuch singular hai ya plural jab main sentence start karta hoon?',
        a: 'This is exactly why checking the very next noun (not planning the whole sentence in advance) helps — decide "is" or "are" the instant you know what comes right after "there," rather than trying to plan the entire sentence structure before you start speaking.',
        aHi: 'Yahi exactly reason hai ki bilkul next noun check karna (poora sentence advance mein plan karne ke bajaye) help karta hai — "is" ya "are" decide karo us instant jab tumhe pata chale kya "there" ke turant baad aata hai, poore sentence structure ko bolna start karne se pehle plan karne ki koshish karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, describe your own street or neighborhood using at least three "there is/are" sentences.',
        taskHi: 'Zor se, apni street ya neighborhood describe karo kam se kam teen "there is/are" sentences use karke.',
        hint: '"There is a... near my house. There are also...".',
        hintHi: '"There is a... near my house. There are also...".',
      },
      {
        task: 'Say this corrected out loud: "A big park is there near my office." Find and fix the reordering mistake.',
        taskHi: 'Ise zor se correct karke bolo: "A big park is there near my office." Reordering mistake dhoondo aur fix karo.',
        hint: '"There is a big park near my office."',
        hintHi: '"There is a big park near my office."',
      },
    ],

    keyTakeaways: [
      '"There is" (singular) and "there are" (plural) announce the existence of something in a place — not possession like "have."',
      'Match "is/are" to the very next noun after "there," even in a list where later nouns are a different number.',
      '"There\'s" is the natural spoken contraction of "there is," used constantly in casual speech.',
      'Past tense: "there was" (singular), "there were" (plural) — same agreement logic.',
      'English always starts this structure with "there" — never reorder it to put the subject first ("a problem is there").',
    ],
    keyTakeawaysHi: [
      '"There is" (singular) aur "there are" (plural) ek jagah mein kisi cheez ke existence ko announce karte hain — "have" jaisa possession nahi.',
      '"Is/are" ko "there" ke bilkul baad wale noun se match karo, ek list mein bhi jahan baad wale nouns ek different number ke hon.',
      '"There\'s" "there is" ka natural spoken contraction hai, casual speech mein constantly use hota hai.',
      'Past tense: "there was" (singular), "there were" (plural) — same agreement logic.',
      'English hamesha is structure ko "there" se start karti hai — ise kabhi reorder mat karo subject ko pehle rakhne ke liye ("a problem is there").',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-comparisons',
    title: 'Comparing People, Places & Things',
    titleHi: 'Logon, Jagah Aur Cheezon Ko Compare Karna',
    description:
      '"Bigger" vs. "more expensive" — a short, mostly predictable rule for when to add "-er/-est" and when to use "more/most" instead.',
    descriptionHi:
      '"Bigger" vs. "more expensive" — ek short, mostly predictable rule ke liye ki kab "-er/-est" add karna hai aur kab "more/most" use karna hai iske bajaye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Short words get a small badge pinned directly on them ("-er"); long words get handed a separate flag to carry in front ("more").** "Big" is short enough to wear "-er" directly: "bigger." "Expensive" is too long to pin anything onto comfortably, so it carries "more" in front instead: "more expensive."',
      hi: 'Chhote words ko ek chhota badge directly unpe pin ho jaata hai ("-er"); lambe words ko ek separate flag milta hai front mein carry karne ke liye ("more"). "Big" itna short hai ki "-er" directly pehen sakta hai: "bigger." "Expensive" kuch bhi comfortably pin karne ke liye too long hai, so ye "more" front mein carry karta hai iske bajaye: "more expensive."',
    },

    simple: `**Short adjectives (usually one syllable) add "-er" / "-est":**

big → bigg**er** → the bigg**est** · fast → fast**er** → the fast**est**
· old → old**er** → the old**est**

**Long adjectives (usually three or more syllables, and many
two-syllable ones) use "more" / "most" instead:**

expensive → **more** expensive → the **most** expensive · beautiful →
**more** beautiful → the **most** beautiful

**Two-syllable adjectives are the tricky middle group — some go each
way, and it's worth learning them individually:**

happy → happ**ier** (changes "y" to "i" + er) · famous → **more**
famous

**A small set of adjectives are irregular and don't follow either
pattern:**

good → **better** → the **best** · bad → **worse** → the **worst** ·
far → **farther/further** → the **farthest/furthest**

**Comparing two things uses "than":**

"This city is bigger **than** my hometown."`,
    simpleHi: `**Short adjectives (usually ek syllable) "-er" / "-est" add karte hain:**

big → bigg**er** → the bigg**est** · fast → fast**er** → the fast**est**
· old → old**er** → the old**est**

**Long adjectives (usually teen ya zyada syllables, aur kayi two-
syllable wale) "more" / "most" use karte hain iske bajaye:**

expensive → **more** expensive → the **most** expensive · beautiful →
**more** beautiful → the **most** beautiful

**Two-syllable adjectives tricky middle group hain — kuch ek taraf
jaate hain, kuch doosri taraf, aur inhe individually seekhna worth
hai:**

happy → happ**ier** ("y" ko "i" mein change karta hai + er) · famous →
**more** famous

**Kuch adjectives ka ek chhota set irregular hai aur na hi pattern
follow karta hai:**

good → **better** → the **best** · bad → **worse** → the **worst** ·
far → **farther/further** → the **farthest/furthest**

**Do cheezon ko compare karna "than" use karta hai:**

"This city is bigger **than** my hometown."`,

    content: `**Why syllable count, roughly, decides which comparison form to
use.**

The pattern isn't arbitrary: shorter words physically accommodate an
added ending more comfortably, while longer words become awkward to
pronounce with "-er/-est" tacked on ("expensiver" is genuinely
difficult to say smoothly). "More/most" sidesteps this by adding a
separate word in front instead of stretching the adjective itself —
this is a practical, sound-based reason behind the rule, not an
arbitrary grammar decision.

**Two-syllable adjectives are the genuine gray zone, and native
speakers themselves sometimes vary.** Adjectives ending in "-y" (happy,
easy, busy) almost always take "-er/-est" with a spelling change
(happy → happier, easy → easier). Many other two-syllable adjectives
(famous, modern, careful) use "more/most" instead. When genuinely
unsure with an unfamiliar two-syllable word, "more/most" is the safer
default choice, since it's never wrong grammatically, only sometimes
slightly less natural than the alternative.

**Irregular comparisons (good/better/best, bad/worse/worst) simply
have to be memorized**, the same way irregular past tense verbs do —
there's no shortcut or pattern to derive them from, only familiarity
built through use.

**"Than" is required when directly comparing two named things, but
optional when the comparison is general or implied.** "This city is
bigger than my hometown" needs "than" because a specific second thing
is named; "This city is much bigger" (comparing to some unstated,
general standard) doesn't need it at all.`,
    contentHi: `**Syllable count, roughly, kyun decide karta hai kaunsa comparison form use karna hai.**

Pattern arbitrary nahi hai: shorter words physically ek added ending
ko zyada comfortably accommodate karte hain, jabki longer words "-er/-
est" ke saath awkward ban jaate hain pronounce karne mein
("expensiver" genuinely smoothly bolna difficult hai). "More/most" ise
sidestep karta hai adjective khud ko stretch karne ke bajaye ek
separate word front mein add karke — ye rule ke peeche ek practical,
sound-based reason hai, ek arbitrary grammar decision nahi.

**Two-syllable adjectives genuine gray zone hain, aur native speakers
khud kabhi kabhi vary karte hain.** "-y" pe end hone wale adjectives
(happy, easy, busy) almost hamesha "-er/-est" lete hain ek spelling
change ke saath (happy → happier, easy → easier). Kayi doosre two-
syllable adjectives (famous, modern, careful) "more/most" use karte
hain iske bajaye. Jab ek unfamiliar two-syllable word ke saath
genuinely unsure ho, "more/most" safer default choice hai, kyunki ye
kabhi grammatically galat nahi hai, sirf kabhi kabhi alternative se
thoda kam natural hota hai.

**Irregular comparisons (good/better/best, bad/worse/worst) ko simply
memorize karna padta hai**, jaise irregular past tense verbs — inhe
derive karne ke liye koi shortcut ya pattern nahi hai, sirf use se
built familiarity hai.

**"Than" required hai jab directly do named cheezon ko compare karte
ho, par optional hai jab comparison general ya implied ho.** "This
city is bigger than my hometown" ko "than" chahiye kyunki ek specific
second cheez name ki gayi hai; "This city is much bigger" (ek
unstated, general standard se compare karte hue) ko bilkul zaroorat
nahi hai.`,

    readingPassage: `I want to compare my two favorite cities. Mumbai is bigger than my hometown, and it's much busier too. But my hometown is quieter and, in my opinion, more beautiful. The people there are friendlier, but the job opportunities in Mumbai are definitely better. Both cities are special in their own way.`,
    readingPassageHi: `Main apne do favorite cities compare karna chahta hoon. Mumbai meri hometown se bigger hai, aur ye much busier bhi hai. Par meri hometown quieter hai aur, meri opinion mein, more beautiful hai. Wahan ke log friendlier hain, par Mumbai mein job opportunities definitely better hain. Dono cities apne apne tareeke se special hain.`,

    vocabulary: [
      {
        word: 'compare',
        wordHi: 'compare (tulna karna)',
        meaning: 'to look at two or more things to see how they are different or similar',
        meaningHi: 'do ya zyada cheezon ko dekhna ye jaanne ke liye ki wo kaise different ya similar hain',
        example: "Let's compare these two options.",
        exampleHi: "Let's compare these two options.",
        pronunciation: 'kuhm-PAIR',
      },
      {
        word: 'opportunity',
        wordHi: 'opportunity (avsar)',
        meaning: 'a chance to do something good',
        meaningHi: 'kuch achha karne ka ek chance',
        example: 'This job is a great opportunity.',
        exampleHi: 'This job is a great opportunity.',
        pronunciation: 'op-er-TOO-ni-tee',
      },
      {
        word: 'friendly',
        wordHi: 'friendly (mitrata purn)',
        meaning: 'kind and pleasant toward others',
        meaningHi: 'doosron ke prati kind aur pleasant',
        example: 'The people in this town are very friendly.',
        exampleHi: 'The people in this town are very friendly.',
        pronunciation: 'FREND-lee',
      },
      {
        word: 'quiet',
        wordHi: 'quiet (shaant)',
        meaning: 'making little or no noise',
        meaningHi: 'kam ya bilkul noise na banana',
        example: 'I prefer a quiet neighborhood.',
        exampleHi: 'I prefer a quiet neighborhood.',
        pronunciation: 'KWY-et',
      },
    ],

    examples: [
      {
        title: 'Short and long adjectives compared side by side',
        titleHi: 'Short aur long adjectives side by side compared',
        code: `Short: fast -> faster -> the fastest
Long: interesting -> more interesting -> the most interesting`,
        output: 'The pattern splits cleanly by roughly how long the word is.',
        explain:
          'Saying both patterns out loud back to back helps train your ear for which one a new adjective is likely to need before you\'ve even memorized it individually.',
        explainHi:
          'Dono patterns ko back to back zor se bolna tumhare kaan ko train karta hai ye samajhne mein ki ek naya adjective kaunsa likely use karega, use individually memorize kiye bina bhi.',
      },
      {
        title: 'Irregular comparisons in a real sentence',
        titleHi: 'Real sentence mein irregular comparisons',
        code: `This restaurant is better than the one we tried last week, but the prices are worse.`,
        output: 'good/better and bad/worse used correctly in the same sentence.',
        explain:
          'These irregular forms show up constantly in everyday opinions and comparisons, making them worth memorizing early even though they don\'t follow the regular pattern.',
        explainHi:
          'Ye irregular forms everyday opinions aur comparisons mein constantly aate hain, inhe jaldi memorize karna worth banate hue chahe wo regular pattern follow na karein.',
      },
    ],

    mistakes: [
      {
        wrong: '"This city is more big than my hometown." (using "more" with a short adjective)',
        right: '"This city is bigger than my hometown."',
        why: 'Short, one-syllable adjectives like "big" take "-er," not "more" — combining both ("more bigger") or using only "more" with a short word both sound distinctly non-standard.',
        whyHi: 'Short, one-syllable adjectives jaise "big" "-er" lete hain, "more" nahi — dono combine karna ("more bigger") ya sirf "more" use karna ek short word ke saath dono distinctly non-standard sound karte hain.',
      },
      {
        wrong: '"This is the most fast car." (using "most" with a short adjective)',
        right: '"This is the fastest car."',
        why: 'The superlative form follows the same short/long split as the comparative — a short adjective like "fast" needs "-est," not "most."',
        whyHi: 'Superlative form comparative jaisa hi short/long split follow karta hai — ek short adjective jaisa "fast" ko "-est" chahiye, "most" nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Comparing products, prices, or options while shopping** ("this one is cheaper," "that one is more comfortable") is one of the most frequent, practical everyday uses of comparisons.',
        hi: '**Shopping karte waqt products, prices, ya options compare karna** ("this one is cheaper," "that one is more comfortable") comparisons ka sabse frequent, practical everyday uses mein se ek hai.',
      },
      {
        en: '**Sharing opinions about places, food, or experiences with friends** ("this restaurant is better than the last one") relies heavily and naturally on comparative forms.',
        hi: '**Friends ke saath jagah, khana, ya experiences ke baare mein opinions share karna** ("this restaurant is better than the last one") heavily aur naturally comparative forms pe rely karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How can I tell if a two-syllable adjective uses "-er" or "more"?',
        qHi: 'Main kaise pata karoon ki ek two-syllable adjective "-er" use karta hai ya "more"?',
        a: "If it ends in \"-y\" (happy, easy, busy), it almost always takes \"-er/-est\" with the \"y\" changed to \"i.\" Otherwise, when genuinely unsure, \"more/most\" is the safer default — it's grammatically acceptable for nearly any adjective, even ones that also have an \"-er\" form.",
        aHi: "Agar ye \"-y\" pe end hota hai (happy, easy, busy), ye almost hamesha \"-er/-est\" leta hai \"y\" ko \"i\" mein change karke. Otherwise, jab genuinely unsure ho, \"more/most\" safer default hai — ye grammatically acceptable hai nearly kisi bhi adjective ke liye, un ke liye bhi jinke paas ek \"-er\" form bhi hai.",
      },
      {
        q: 'Do I always need "than" when making a comparison?',
        qHi: 'Kya mujhe hamesha "than" chahiye jab main ek comparison bana raha hoon?',
        a: '"Than" is needed only when you\'re directly naming the second thing being compared to ("bigger than my hometown"). When the comparison is general or the second item is already clear from context, "than" is often dropped ("This one is much better.").',
        aHi: '"Than" sirf tab zaroorat hoti hai jab tum directly doosri cheez ko naam de rahe ho jispe compare kiya ja raha hai ("bigger than my hometown"). Jab comparison general hai ya doosra item already context se clear hai, "than" often drop ho jaata hai ("This one is much better.").',
      },
    ],

    exercises: [
      {
        task: 'Out loud, compare two cities, foods, or people you know, using at least one "-er" comparison and one "more" comparison.',
        taskHi: 'Zor se, do cities, foods, ya logon ko compare karo jinhe tum jaante ho, kam se kam ek "-er" comparison aur ek "more" comparison use karke.',
        hint: '"[Thing A] is [adjective]-er than [Thing B]." "[Thing A] is more [adjective] than [Thing B]."',
        hintHi: '"[Thing A] is [adjective]-er than [Thing B]." "[Thing A] is more [adjective] than [Thing B]."',
      },
      {
        task: 'Say these irregular comparisons out loud three times each: good/better/best, bad/worse/worst.',
        taskHi: 'In irregular comparisons ko zor se teen baar har ek bolo: good/better/best, bad/worse/worst.',
        hint: 'Use each one in a real sentence about your own life to help it stick.',
        hintHi: 'Har ek ko apni real zindagi ke ek sentence mein use karo ise stick karne mein help ke liye.',
      },
    ],

    keyTakeaways: [
      'Short adjectives (usually one syllable) add "-er"/"-est": bigger, the biggest.',
      'Long adjectives (usually three-plus syllables, and many two-syllable ones) use "more"/"most": more expensive, the most expensive.',
      'Two-syllable "-y" adjectives (happy, easy) take "-er/-est" with a spelling change; other two-syllable adjectives often use "more/most."',
      'Irregular comparisons (good/better/best, bad/worse/worst) must be memorized — no pattern predicts them.',
      '"Than" is needed when directly naming the second thing being compared to; it\'s dropped when the comparison is general.',
    ],
    keyTakeawaysHi: [
      'Short adjectives (usually ek syllable) "-er"/"-est" add karte hain: bigger, the biggest.',
      'Long adjectives (usually teen-plus syllables, aur kayi two-syllable wale) "more"/"most" use karte hain: more expensive, the most expensive.',
      'Two-syllable "-y" adjectives (happy, easy) "-er/-est" lete hain ek spelling change ke saath; doosre two-syllable adjectives often "more/most" use karte hain.',
      'Irregular comparisons (good/better/best, bad/worse/worst) memorize karne padte hain — koi pattern inhe predict nahi karta.',
      '"Than" zaroorat hoti hai jab directly doosri cheez ko naam diya jaaye jispe compare ho raha hai; ye drop hota hai jab comparison general ho.',
    ],
  },
];
