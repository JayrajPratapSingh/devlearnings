/**
 * English Speaking Complete Course — Module 14: Shopping, Travel &
 * Directions, lessons 1-3.
 *
 * Lesson 1: Shopping — asking about price, size, and availability, and
 *           the polite way to browse without committing to buy.
 * Lesson 2: Asking for and giving directions — prepositions of place
 *           and movement that carry almost all the real information.
 * Lesson 3: Travel English — airports, hotels, and taxis, the three
 *           settings where a traveler needs working vocabulary fastest.
 */

import type { CourseLesson } from './course-js-module1';

export const ENGLISH_MODULE_14: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'eng-shopping-english',
    title: 'Shopping — Price, Size & Just Browsing',
    titleHi: 'Shopping — Price, Size Aur Just Browsing',
    description:
      '"I\'m just browsing, thanks" is one of the most useful sentences in English — it lets you look without committing, politely and clearly.',
    descriptionHi:
      '"I\'m just browsing, thanks" English mein sabse useful sentences mein se ek hai — ye tumhe dekhne deta hai commit kiye bina, politely aur clearly.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**"Just browsing" is a small, polite sign you hang on yourself, telling a shop assistant "not yet" without saying no to their help entirely.** It keeps the interaction warm while giving you space, the same way glancing at a menu without ordering yet doesn\'t offend a waiter.',
      hi: '"Just browsing" ek chhota, polite sign hai jo tum apne aap pe latka dete ho, ek shop assistant ko "abhi nahi" batate hue unki help ko poori tarah na kahe bina. Ye interaction ko warm rakhta hai jabki tumhe space deta hai, jaise ek menu ko dekhna order kiye bina ek waiter ko offend nahi karta.',
    },

    simple: `**When a shop assistant offers help:**

"Can I help you find anything?" → "I'm just browsing, thanks." / "Yes,
I'm looking for [item]."

**Asking about price:**

"How much is this?" · "How much does this cost?" · "What's the
price?"

**Asking about size or fit:**

"Do you have this in a medium?" · "Do you have a bigger size?" ·
"Can I try this on?"

**Asking about availability:**

"Do you have this in blue?" · "Is this in stock?" · "Do you have any
more of these?"

**At the checkout:**

"Can I pay by card?" · "Do you take cash?" · "Can I get a receipt,
please?"`,
    simpleHi: `**Jab ek shop assistant help offer karta hai:**

"Can I help you find anything?" → "I'm just browsing, thanks." / "Yes,
I'm looking for [item]."

**Price ke baare mein poochna:**

"How much is this?" · "How much does this cost?" · "What's the
price?"

**Size ya fit ke baare mein poochna:**

"Do you have this in a medium?" · "Do you have a bigger size?" ·
"Can I try this on?"

**Availability ke baare mein poochna:**

"Do you have this in blue?" · "Is this in stock?" · "Do you have any
more of these?"

**Checkout pe:**

"Can I pay by card?" · "Do you take cash?" · "Can I get a receipt,
please?"`,

    content: `**Why "just browsing" is a genuinely important phrase to have
ready, beyond its literal meaning.**

Many shops around the world have a cultural convention of a staff
member offering to help almost immediately upon entry. "Just
browsing, thanks" is the accepted, polite way to decline that specific
offer without seeming rude or dismissive — it acknowledges the offer
was made and kindly says you don't need it yet, leaving the door open
to ask for help later.

**"How much is this?" and "How much does this cost?" are both
completely correct, with a subtle structural difference.** "How much
is this?" treats price as a simple state of being (like "this is red"
→ "how much is this?"). "How much does this cost?" treats "cost" as an
action the item does. Both are used constantly and interchangeably in
real shopping conversations.

**"Try on" is a specific phrasal verb worth knowing precisely for
clothing and accessories** — it means putting on an item specifically
to see if it fits or looks right, not to actually wear it out. "Can I
try this on?" is the standard, expected way to ask this in a clothing
store, and staff will point you to a fitting room in response.

**Payment vocabulary varies by country but a few phrases are nearly
universal**: "Can I pay by card?" and "Do you take cash?" work almost
everywhere English is spoken for commerce, making them safe, reliable
defaults when traveling or shopping somewhere new.`,
    contentHi: `**"Just browsing" genuinely ek important phrase kyun hai ready
rakhne layak, apne literal meaning se aage.**

Duniya bhar mein kayi shops mein ek cultural convention hai ek staff
member ka entry pe almost immediately help offer karna. "Just
browsing, thanks" us specific offer ko decline karne ka accepted,
polite tareeka hai bina rude ya dismissive lage — ye acknowledge karta
hai ki offer diya gaya tha aur kindly kehta hai tumhe abhi zaroorat
nahi, baad mein help maangne ke liye door open chhodte hue.

**"How much is this?" aur "How much does this cost?" dono completely
correct hain, ek subtle structural difference ke saath.** "How much is
this?" price ko ek simple state of being ki tarah treat karta hai
(jaise "this is red" → "how much is this?"). "How much does this
cost?" "cost" ko ek action ki tarah treat karta hai jo item karta hai.
Dono constantly aur interchangeably use hote hain real shopping
conversations mein.

**"Try on" ek specific phrasal verb hai janne layak precisely clothing
aur accessories ke liye** — iska matlab hai ek item pehenna specifically
ye dekhne ke liye ki ye fit karta hai ya sahi dikhta hai, use actually
bahar pehen kar jaane ke liye nahi. "Can I try this on?" ek clothing
store mein ye poochne ka standard, expected tareeka hai, aur staff
response mein tumhe ek fitting room ki taraf point karega.

**Payment vocabulary country ke hisaab se vary karti hai par kuch
phrases nearly universal hain**: "Can I pay by card?" aur "Do you take
cash?" almost har jagah kaam karte hain jahan English commerce ke liye
boli jaati hai, inhe safe, reliable defaults banate hue jab travel
kiya jaaye ya kahin nayi jagah shopping ki jaaye.`,

    readingPassage: `I walked into a clothing store. "Can I help you find anything?" the assistant asked. "I'm just browsing, thanks," I said. A few minutes later, I found a nice jacket. "How much is this?" I asked. "It's $40," she said. "Can I try this on?" I asked, and she pointed me to the fitting room. It fit perfectly, so I bought it.`,
    readingPassageHi: `Main ek clothing store mein gaya. "Can I help you find anything?" assistant ne poocha. "I'm just browsing, thanks," maine kaha. Kuch minutes baad, mujhe ek achhi jacket mili. "How much is this?" maine poocha. "It's $40," usne kaha. "Can I try this on?" maine poocha, aur usne mujhe fitting room ki taraf point kiya. Ye perfectly fit hui, so maine ise khareed liya.`,

    vocabulary: [
      {
        word: 'browsing',
        wordHi: 'browsing (dekhna/ghumna)',
        meaning: 'looking at things in a shop without a specific plan to buy yet',
        meaningHi: 'ek shop mein cheezein dekhna bina abhi buy karne ke specific plan ke',
        example: "I'm just browsing, thanks.",
        exampleHi: "I'm just browsing, thanks.",
        pronunciation: 'BROW-zing',
      },
      {
        word: 'try on',
        wordHi: 'try on (pehen kar dekhna)',
        meaning: 'to put on clothing to see if it fits or looks good',
        meaningHi: 'clothing pehenna ye dekhne ke liye ki fit karta hai ya achha dikhta hai',
        example: 'Can I try this jacket on?',
        exampleHi: 'Can I try this jacket on?',
        pronunciation: 'try on',
      },
      {
        word: 'in stock',
        wordHi: 'in stock (uplabdh)',
        meaning: 'available to buy right now',
        meaningHi: 'abhi buy karne ke liye available',
        example: 'Is this shirt in stock in a large size?',
        exampleHi: 'Is this shirt in stock in a large size?',
        pronunciation: 'in stok',
      },
      {
        word: 'receipt',
        wordHi: 'receipt (rasid)',
        meaning: 'a paper or digital proof of purchase',
        meaningHi: 'ek purchase ka paper ya digital proof',
        example: 'Can I get a receipt, please?',
        exampleHi: 'Can I get a receipt, please?',
        pronunciation: 'ri-SEET',
      },
    ],

    examples: [
      {
        title: 'A complete shopping interaction',
        titleHi: 'Ek complete shopping interaction',
        code: `Assistant: Can I help you find anything?
Customer: Yes, actually — do you have this shirt in a medium?
Assistant: Let me check... yes, we do. Would you like to try it on?
Customer: Yes, please.`,
        output: 'A natural back-and-forth from offer to size question to trying it on.',
        explain:
          'Notice the customer directly states what they need rather than just browsing — both responses to the opening question are equally natural depending on the situation.',
        explainHi:
          'Notice karo customer directly state karta hai unhe kya chahiye, sirf browse karne ke bajaye — opening question ke dono responses equally natural hain situation ke hisaab se.',
      },
      {
        title: 'Declining help politely',
        titleHi: 'Help ko politely decline karna',
        code: `Assistant: Let me know if you need any help!
Customer: I will, thank you! Just browsing for now.`,
        output: '"Just browsing" keeps the door open without needing help immediately.',
        explain:
          'Adding "for now" or "I will, thank you" makes the decline even warmer, signaling you might ask for help shortly, just not this exact moment.',
        explainHi:
          '"for now" ya "I will, thank you" add karna decline ko even warmer banata hai, signal karte hue ki tum shortly help maang sakte ho, bas is exact moment nahi.',
      },
    ],

    mistakes: [
      {
        wrong: 'Staying silent or walking away without a word when an assistant offers help you don\'t need',
        right: '"I\'m just browsing, thanks!"',
        why: 'A brief, polite acknowledgment is expected in most English-speaking shopping cultures — silence can come across as rude or awkward, even though no harm is intended.',
        whyHi: 'Ek brief, polite acknowledgment zyadatar English-speaking shopping cultures mein expected hai — silence rude ya awkward aa sakta hai, chahe koi harm intend na ho.',
      },
      {
        wrong: '"How much this?" (missing "is" or "does")',
        right: '"How much is this?" or "How much does this cost?"',
        why: 'The question needs a verb ("is" or "does") to be grammatically complete — dropping it is a common simplification that still communicates but sounds noticeably incomplete.',
        whyHi: 'Question ko grammatically complete hone ke liye ek verb chahiye ("is" ya "does") — ise drop karna ek common simplification hai jo phir bhi communicate karta hai par noticeably incomplete sound karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Any shopping trip while traveling or living somewhere English is spoken** — clothing stores, markets, pharmacies, electronics shops — relies on this exact set of phrases as a reliable, universal toolkit.',
        hi: '**Kisi bhi shopping trip pe travel karte waqt ya kahin rehte waqt jahan English boli jaati hai** — clothing stores, markets, pharmacies, electronics shops — is exact set of phrases pe rely karta hai ek reliable, universal toolkit ki tarah.',
      },
      {
        en: '**Online customer service chats** often use the same core phrases in written form — "Is this in stock?", "Do you take [payment method]?" — making this vocabulary useful beyond in-person shopping too.',
        hi: '**Online customer service chats** often same core phrases ko written form mein use karte hain — "Is this in stock?", "Do you take [payment method]?" — is vocabulary ko in-person shopping se aage bhi useful banate hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Is it rude to say "just browsing" if the assistant is being very friendly and persistent?',
        qHi: 'Kya "just browsing" kehna rude hai agar assistant bahut friendly aur persistent ho raha hai?',
        a: 'Not at all — it\'s a completely standard, expected response and doesn\'t need justification. Saying it warmly with a smile and a "thank you" keeps the interaction pleasant on both sides.',
        aHi: 'Bilkul nahi — ye ek completely standard, expected response hai aur justification ki zaroorat nahi. Ise warmly ek smile aur ek "thank you" ke saath kehna interaction ko dono sides pe pleasant rakhta hai.',
      },
      {
        q: 'What\'s the difference between "How much is this?" and "How much does this cost?"',
        qHi: '"How much is this?" aur "How much does this cost?" mein kya farak hai?',
        a: 'Essentially none in practical use — both ask for the price and are used interchangeably. The only difference is structural: one treats price as a state ("is"), the other as an action the item performs ("cost").',
        aHi: 'Practical use mein essentially koi nahi — dono price maangte hain aur interchangeably use hote hain. Sirf farak structural hai: ek price ko ek state ki tarah treat karta hai ("is"), doosra ek action ki tarah jo item perform karta hai ("cost").',
      },
    ],

    exercises: [
      {
        task: 'Out loud, respond to "Can I help you find anything?" both ways: once declining politely, once asking for a specific item.',
        taskHi: 'Zor se, "Can I help you find anything?" ko dono tareekon se respond karo: ek baar politely decline karke, ek baar ek specific item ke liye poochte hue.',
        hint: '"I\'m just browsing, thanks!" / "Yes, I\'m looking for a blue shirt."',
        hintHi: '"I\'m just browsing, thanks!" / "Yes, I\'m looking for a blue shirt."',
      },
      {
        task: 'Out loud, ask about price, size, and payment method for an imaginary item you\'re buying.',
        taskHi: 'Zor se, price, size, aur payment method ke baare mein poocho ek imaginary item ke liye jo tum khareed rahe ho.',
        hint: '"How much is this? Do you have it in a large? Can I pay by card?"',
        hintHi: '"How much is this? Do you have it in a large? Can I pay by card?"',
      },
    ],

    keyTakeaways: [
      '"I\'m just browsing, thanks" is the standard, polite way to decline immediate help while shopping.',
      '"How much is this?" and "How much does this cost?" are both correct and used interchangeably.',
      '"Try on" specifically means putting on clothing to check fit or look, not to actually wear it out.',
      '"Can I pay by card?" and "Do you take cash?" are nearly universal, reliable payment phrases.',
      'A brief, polite response to a shop assistant\'s offer is expected — silence can come across as rude even without that intention.',
    ],
    keyTakeawaysHi: [
      '"I\'m just browsing, thanks" shopping karte waqt immediate help decline karne ka standard, polite tareeka hai.',
      '"How much is this?" aur "How much does this cost?" dono correct hain aur interchangeably use hote hain.',
      '"Try on" specifically matlab hai clothing pehenna fit ya look check karne ke liye, use actually bahar pehen kar jaane ke liye nahi.',
      '"Can I pay by card?" aur "Do you take cash?" nearly universal, reliable payment phrases hain.',
      'Ek shop assistant ke offer ka ek brief, polite response expected hai — silence rude aa sakta hai bina us intention ke bhi.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'eng-asking-giving-directions',
    title: 'Asking for & Giving Directions',
    titleHi: 'Directions Poochna Aur Dena',
    description:
      '"Go past the bank, and it\'s on your left" — small prepositions like "past," "on," and "at" carry almost all the actual information in directions.',
    descriptionHi:
      '"Go past the bank, and it\'s on your left" — chhote prepositions jaise "past," "on," aur "at" almost saari actual information carry karte hain directions mein.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Directions are a spoken map, and prepositions are the roads drawn on it.** "Turn left AT the light, go PAST the bank, it\'s ON your right" — remove the small words "at," "past," and "on," and the map becomes meaningless, even though the nouns (light, bank, right) are all still there.',
      hi: 'Directions ek spoken map hain, aur prepositions us pe draw ki gayi roads hain. "Turn left AT the light, go PAST the bank, it\'s ON your right" — chhote words "at," "past," aur "on" hatao, aur map meaningless ban jaata hai, chahe nouns (light, bank, right) sab abhi bhi wahan hon.',
    },

    simple: `**Asking for directions:**

"Excuse me, how do I get to [place]?" · "Is [place] near here?" ·
"Could you tell me the way to [place]?"

**Common direction-giving phrases:**

"Go straight." · "Turn left/right at [landmark]." · "Go past [place]."
· "It's on your left/right." · "It's across from [place]." · "It's
next to [place]." · "Keep going for two blocks."

**Prepositions that carry the real information:**

- **at** a specific point: "turn left at the light"
- **on** a side: "it's on your right"
- **past** something you walk beyond: "go past the bank"
- **across from** directly opposite: "it's across from the park"
- **next to** right beside: "it's next to the pharmacy"

**A useful closing habit**: repeating the directions back briefly
confirms you understood — "So, straight, then left at the light,
past the bank — got it, thanks!"`,
    simpleHi: `**Directions poochna:**

"Excuse me, how do I get to [place]?" · "Is [place] near here?" ·
"Could you tell me the way to [place]?"

**Common direction-giving phrases:**

"Go straight." · "Turn left/right at [landmark]." · "Go past [place]."
· "It's on your left/right." · "It's across from [place]." · "It's
next to [place]." · "Keep going for two blocks."

**Prepositions jo real information carry karte hain:**

- **at** ek specific point pe: "turn left at the light"
- **on** ek side pe: "it's on your right"
- **past** kisi cheez ke aage jo tum walk karte ho: "go past the bank"
- **across from** directly opposite: "it's across from the park"
- **next to** bilkul beside: "it's next to the pharmacy"

**Ek useful closing habit**: directions ko briefly wapas repeat karna
confirm karta hai ki tumhe samajh aaya — "So, straight, then left at
the light, past the bank — got it, thanks!"`,

    content: `**Why prepositions specifically carry so much of a direction's real
meaning.**

A direction sentence is mostly built from nouns everyone already
knows (bank, light, park) — the actual navigational information lives
almost entirely in the small connecting words. "The bank" tells you
what landmark to look for; "past the bank" tells you to keep walking
beyond it; "at the bank" tells you to turn right there. Swapping one
preposition for another can completely change where you end up, which
is why they deserve focused attention rather than being treated as
unimportant filler words.

**"Across from" and "next to" describe two genuinely different
spatial relationships, easy to confuse.** "Across from" means directly
opposite, usually with something between you (a street, a space) —
like a store facing another across a road. "Next to" means immediately
beside, with no gap — like two shops sharing a wall. Mixing these up
can send someone to the wrong side of a street entirely.

**Repeating directions back is a genuinely practical habit, not just
politeness.** Directions are usually given once, quickly, often by
someone in a hurry — briefly repeating the key turns back ("so straight,
then left, past the bank") gives the other person a chance to correct
a misunderstanding immediately, before you've walked the wrong way for
ten minutes.

**"Excuse me" is doing real, specific work as an opener for asking
directions from a stranger.** It signals a polite interruption before
the actual question, softening what would otherwise be an abrupt
approach to someone who wasn't expecting to be spoken to.`,
    contentHi: `**Prepositions specifically ek direction ka itna real meaning kyun carry karte hain.**

Ek direction sentence mostly un nouns se bana hota hai jo sab already
jaante hain (bank, light, park) — actual navigational information
almost poori tarah chhote connecting words mein rehti hai. "The bank"
tumhe batata hai kaunsa landmark dhoondhna hai; "past the bank" tumhe
batata hai iske aage walk karte rehna hai; "at the bank" tumhe batata
hai wahan turn karna hai. Ek preposition ko doosre se swap karna
completely change kar sakta hai tum kahan pahunchte ho, yahi reason
hai ki wo focused attention deserve karte hain, unimportant filler
words ki tarah treat hone ke bajaye.

**"Across from" aur "next to" do genuinely different spatial
relationships describe karte hain, confuse karna aasan.** "Across
from" directly opposite matlab hai, usually beech mein kuch ke saath
(ek street, ek space) — jaise ek store doosre ko ek road ke across face
karta hai. "Next to" immediately beside matlab hai, koi gap nahi —
jaise do shops ek wall share karte hain. Inhe mix up karna kisi ko
ek street ke poori tarah wrong side pe bhej sakta hai.

**Directions ko wapas repeat karna ek genuinely practical habit hai,
sirf politeness nahi.** Directions usually ek baar di jaati hain,
quickly, often kisi ke through jo hurry mein hai — key turns ko briefly
wapas repeat karna ("so straight, then left, past the bank") doosre
person ko ek misunderstanding turant correct karne ka chance deta hai,
das minutes tak wrong way walk karne se pehle.

**"Excuse me" real, specific kaam kar raha hai ek opener ki tarah ek
stranger se directions poochne ke liye.** Ye ek polite interruption
signal karta hai actual question se pehle, kisi ko approach karne mein
otherwise abrupt cheez ko soften karte hue jo expect nahi kar raha tha
ki usse baat ki jaayegi.`,

    readingPassage: `Excuse me, how do I get to the train station? Go straight for two blocks, then turn left at the traffic light. Go past the bakery, and the station is on your right, across from the park. So, straight, then left at the light, past the bakery, on the right — got it, thank you so much!`,
    readingPassageHi: `Excuse me, main train station kaise pahunch sakta hoon? Do blocks ke liye straight jaao, phir traffic light pe left turn karo. Bakery ko past karo, aur station tumhare right pe hai, park ke across. So, straight, then left at the light, past the bakery, on the right — got it, thank you so much!`,

    vocabulary: [
      {
        word: 'landmark',
        wordHi: 'landmark (pehchaan chinh)',
        meaning: 'a recognizable building or feature used to give directions',
        meaningHi: 'ek recognizable building ya feature directions dene ke liye use hota hai',
        example: 'The clock tower is a well-known landmark.',
        exampleHi: 'The clock tower is a well-known landmark.',
        pronunciation: 'LAND-mahrk',
      },
      {
        word: 'block',
        wordHi: 'block (block)',
        meaning: 'the distance along a street between two cross streets',
        meaningHi: 'ek street ke saath do cross streets ke beech ka distance',
        example: 'Walk two blocks and turn right.',
        exampleHi: 'Walk two blocks and turn right.',
        pronunciation: 'blok',
      },
      {
        word: 'across from',
        wordHi: 'across from (ke saamne)',
        meaning: 'directly opposite something',
        meaningHi: 'kisi cheez ke directly opposite',
        example: 'The cafe is across from the bookstore.',
        exampleHi: 'The cafe is across from the bookstore.',
        pronunciation: 'uh-KROS from',
      },
      {
        word: 'next to',
        wordHi: 'next to (ke bagal mein)',
        meaning: 'immediately beside, with no gap',
        meaningHi: 'immediately beside, koi gap nahi',
        example: 'The pharmacy is next to the supermarket.',
        exampleHi: 'The pharmacy is next to the supermarket.',
        pronunciation: 'nekst too',
      },
    ],

    examples: [
      {
        title: 'A full set of directions',
        titleHi: 'Directions ka ek full set',
        code: `Go straight for one block. Turn right at the pharmacy. Go past the school, and the library is on your left, next to the park.`,
        output: 'Every preposition placed precisely matters for reaching the right place.',
        explain:
          'Reading this aloud while imagining walking the route helps train your ear to hear exactly what each preposition is doing.',
        explainHi:
          'Ise zor se padhna route walk karne ka imagine karte hue tumhare kaan ko train karta hai exactly sunne ke liye har preposition kya kar raha hai.',
      },
      {
        title: 'Confirming directions by repeating them back',
        titleHi: 'Directions ko wapas repeat karke confirm karna',
        code: `A: Turn left at the bank, then it's the second building on your right.
B: Okay, so left at the bank, second building on the right — got it, thanks!`,
        output: 'A quick repetition catches any misunderstanding immediately.',
        explain:
          'This habit costs almost nothing and can save a lot of time if something was misheard the first time.',
        explainHi:
          'Ye habit almost kuch nahi lagta aur bahut time bacha sakta hai agar kuch pehli baar misheard hua ho.',
      },
    ],

    mistakes: [
      {
        wrong: 'Confusing "across from" and "next to" — using them interchangeably',
        right: '"Across from" = directly opposite (with something between); "next to" = immediately beside (no gap).',
        why: 'These describe genuinely different spatial relationships — mixing them up can send someone to search on the wrong side of a street entirely.',
        whyHi: 'Ye genuinely different spatial relationships describe karte hain — inhe mix up karna kisi ko ek street ke poori tarah wrong side pe search karne bhej sakta hai.',
      },
      {
        wrong: 'Walking away after receiving directions without repeating any of it back',
        right: '"So, straight, then left at the light — got it, thank you!"',
        why: 'A brief repetition gives the direction-giver a chance to correct any misunderstanding immediately, before you\'ve walked the wrong way.',
        whyHi: 'Ek brief repetition direction-giver ko ek chance deta hai kisi bhi misunderstanding ko turant correct karne ka, tumhare wrong way walk karne se pehle.',
      },
    ],

    realWorld: [
      {
        en: '**Navigating a new city while traveling**, especially before relying on a map app, or when a map app\'s directions don\'t quite match what you see, depends entirely on understanding and giving these phrases confidently.',
        hi: '**Ek nayi city navigate karna travel karte waqt**, especially ek map app pe rely karne se pehle, ya jab ek map app ki directions exactly wo match na karein jo tum dekhte ho, poori tarah in phrases ko confidently samajhne aur dene pe depend karta hai.',
      },
      {
        en: '**Giving directions to a delivery driver, a guest, or a new colleague finding the office** — a common, practical everyday need for clear, correctly prepositioned directions.',
        hi: '**Ek delivery driver, ek guest, ya ek naye colleague ko directions dena jo office dhoondh raha hai** — clear, correctly prepositioned directions ke liye ek common, practical everyday need.',
      },
    ],

    interviewQA: [
      {
        q: 'What if I genuinely don\'t know the directions someone is asking me for?',
        qHi: 'Agar mujhe genuinely wo directions nahi pata jo koi mujhse poochh raha hai?',
        a: '"Sorry, I\'m not sure — I\'m not from around here" or "Sorry, I don\'t know this area well" are both honest, polite, and completely acceptable responses. There\'s no obligation to guess or invent directions.',
        aHi: '"Sorry, I\'m not sure — I\'m not from around here" ya "Sorry, I don\'t know this area well" dono honest, polite, aur completely acceptable responses hain. Guess karne ya directions invent karne ki koi obligation nahi hai.',
      },
      {
        q: 'Is "how do I get to..." the only way to ask for directions?',
        qHi: 'Kya "how do I get to..." directions poochne ka sirf ek tareeka hai?',
        a: 'No — "Is [place] near here?", "Could you point me toward [place]?", and "Am I going the right way for [place]?" are all natural alternatives, useful in slightly different situations depending on how much you already know.',
        aHi: 'Nahi — "Is [place] near here?", "Could you point me toward [place]?", aur "Am I going the right way for [place]?" sab natural alternatives hain, thodi different situations mein useful depending on tumhe already kitna pata hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, give directions from your own front door to the nearest shop, using at least three different prepositions.',
        taskHi: 'Zor se, apne front door se nearest shop tak directions do, kam se kam teen alag prepositions use karke.',
        hint: 'Try to use "at," "past," and "on" or "next to" all in one set of directions.',
        hintHi: '"at," "past," aur "on" ya "next to" sabko ek set of directions mein use karne ki koshish karo.',
      },
      {
        task: 'Out loud, practice asking a stranger for directions to the nearest train station, then repeat back an imaginary set of directions they gave you.',
        taskHi: 'Zor se, ek stranger se nearest train station ke directions poochna practice karo, phir ek imaginary set of directions wapas repeat karo jo unhone di.',
        hint: '"Excuse me, how do I get to the train station?" ... "So straight, then right at the light — got it, thanks!"',
        hintHi: '"Excuse me, how do I get to the train station?" ... "So straight, then right at the light — got it, thanks!"',
      },
    ],

    keyTakeaways: [
      'Directions carry most of their real information in prepositions (at, on, past, across from, next to), not in the nouns.',
      '"Across from" means directly opposite; "next to" means immediately beside — genuinely different, easy to confuse.',
      'Repeating directions back briefly is a practical habit that catches misunderstandings before you\'ve walked the wrong way.',
      '"Excuse me" is the standard, polite opener for asking a stranger anything, including directions.',
      'It\'s completely fine to say you don\'t know an area rather than guessing at directions.',
    ],
    keyTakeawaysHi: [
      'Directions apni real information mostly prepositions mein carry karte hain (at, on, past, across from, next to), nouns mein nahi.',
      '"Across from" directly opposite matlab hai; "next to" immediately beside matlab hai — genuinely different, confuse karna aasan.',
      'Directions ko briefly wapas repeat karna ek practical habit hai jo misunderstandings ko catch karta hai tumhare wrong way walk karne se pehle.',
      '"Excuse me" ek stranger se kuch bhi poochne ka standard, polite opener hai, directions including.',
      'Ye completely fine hai kehna ki tumhe ek area nahi pata, directions guess karne ke bajaye.',
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'eng-travel-english-airports-hotels-taxis',
    title: 'Travel English — Airports, Hotels & Taxis',
    titleHi: 'Travel English — Airports, Hotels Aur Taxis',
    description:
      'Three settings where a traveler needs working vocabulary immediately — checking in, checking in again, and getting somewhere.',
    descriptionHi:
      'Teen settings jahan ek traveler ko turant working vocabulary chahiye — check in karna, phir se check in karna, aur kahin pahunchna.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Travel English is a survival kit, not a full toolbox — a small set of phrases that need to work reliably under pressure.** You don\'t need to discuss philosophy at an airport counter; you need "I have a connecting flight" to come out correctly the first time, under stress, in a hurry.',
      hi: 'Travel English ek survival kit hai, ek poora toolbox nahi — phrases ka ek chhota set jo pressure ke neeche reliably kaam karna chahiye. Tumhe ek airport counter pe philosophy discuss karne ki zaroorat nahi; tumhe "I have a connecting flight" pehli baar sahi se bahar aane ki zaroorat hai, stress mein, hurry mein.',
    },

    simple: `**At the airport:**

"I'd like to check in for my flight." · "I have a connecting flight to
[city]." · "Where's the boarding gate?" · "Is my flight on time?" ·
"I'd like an aisle/window seat, please."

**At a hotel:**

"I have a reservation under [name]." · "What time is check-out?" ·
"Could I get a wake-up call at [time]?" · "Is breakfast included?" ·
"Could you call a taxi for me, please?"

**In a taxi:**

"Can you take me to [place], please?" · "How much will it cost,
roughly?" · "Could you stop here, please?" · "Keep the change."

**A genuinely useful habit for all three settings**: having your key
information (booking reference, reservation name, destination address)
ready to say clearly and simply, since these interactions often happen
quickly and sometimes with background noise.`,
    simpleHi: `**Airport pe:**

"I'd like to check in for my flight." · "I have a connecting flight to
[city]." · "Where's the boarding gate?" · "Is my flight on time?" ·
"I'd like an aisle/window seat, please."

**Ek hotel mein:**

"I have a reservation under [name]." · "What time is check-out?" ·
"Could I get a wake-up call at [time]?" · "Is breakfast included?" ·
"Could you call a taxi for me, please?"

**Ek taxi mein:**

"Can you take me to [place], please?" · "How much will it cost,
roughly?" · "Could you stop here, please?" · "Keep the change."

**Teeno settings ke liye ek genuinely useful habit**: apni key
information (booking reference, reservation name, destination
address) ready rakhna clearly aur simply bolne ke liye, kyunki ye
interactions often quickly hote hain aur kabhi kabhi background noise
ke saath.`,

    content: `**Why travel vocabulary is worth learning as fixed, ready-made
phrases rather than building sentences from scratch each time.**

Airport, hotel, and taxi interactions typically happen quickly, often
with some time pressure (a queue behind you, a flight boarding soon)
and sometimes in a noisy environment. This is precisely the situation
where having a phrase ready as a fixed unit — rather than constructing
it word by word under stress — genuinely helps: "I have a connecting
flight to Delhi" said smoothly and immediately is far more effective
than the same information assembled slowly and hesitantly.

**"Connecting flight" is a specific, important piece of vocabulary
because it changes what staff need to do for you.** It signals that
your journey isn't over at this airport — you need timing information
and possibly help navigating to a different gate for a second flight,
which is genuinely different information from someone whose journey
ends there.

**"A reservation under [name]" is the standard, expected phrase at a
hotel front desk**, and knowing it precisely avoids the fumbling that
comes from an unclear paraphrase. Hotels search their system by the
name a booking was made under, so stating it clearly and immediately
speeds up check-in considerably.

**In a taxi, "roughly" before asking about cost is a genuinely useful
softening word.** Fares can vary with traffic and route, so "How much
will it cost, roughly?" invites a realistic estimate rather than
demanding an impossible, exact-to-the-cent answer before the trip has
even started.`,
    contentHi: `**Travel vocabulary fixed, ready-made phrases ki tarah seekhne layak kyun hai, har baar scratch se sentences banane ke bajaye.**

Airport, hotel, aur taxi interactions typically quickly hote hain,
often kuch time pressure ke saath (tumhare peeche ek queue, ek flight
jaldi boarding) aur kabhi kabhi ek noisy environment mein. Ye
precisely wo situation hai jahan ek phrase ko ek fixed unit ki tarah
ready rakhna — word by word stress mein construct karne ke bajaye —
genuinely help karta hai: "I have a connecting flight to Delhi" smoothly
aur immediately bola gaya same information ko slowly aur hesitantly
assemble karne se kahin zyada effective hai.

**"Connecting flight" ek specific, important vocabulary hai kyunki ye
change karta hai staff ko tumhare liye kya karna hai.** Ye signal karta
hai ki tumhara journey is airport pe khatam nahi hua — tumhe timing
information chahiye aur possibly ek different gate tak navigate karne
mein help chahiye ek second flight ke liye, jo genuinely different
information hai us se jiska journey wahin end hota hai.

**"A reservation under [name]" ek hotel front desk pe standard,
expected phrase hai**, aur ise precisely janna un fumbling se bachata
hai jo ek unclear paraphrase se aati hai. Hotels apna system search
karte hain us naam se jispe ek booking hui thi, so ise clearly aur
immediately state karna check-in ko considerably speed up karta hai.

**Ek taxi mein, cost poochne se pehle "roughly" ek genuinely useful
softening word hai.** Fares traffic aur route ke saath vary kar sakte
hain, so "How much will it cost, roughly?" ek realistic estimate
invite karta hai, ek impossible, exact-to-the-cent answer demand karne
ke bajaye trip shuru hone se pehle.`,

    readingPassage: `I arrived at the airport and said, "I'd like to check in for my flight, and I have a connecting flight to London." At the hotel, I said, "I have a reservation under Priya Sharma." The front desk gave me my room key right away. Later, I took a taxi and said, "Can you take me to the museum, please? How much will it cost, roughly?"`,
    readingPassageHi: `Main airport pahuncha aur kaha, "I'd like to check in for my flight, and I have a connecting flight to London." Hotel mein, maine kaha, "I have a reservation under Priya Sharma." Front desk ne mujhe turant mera room key de diya. Baad mein, maine ek taxi li aur kaha, "Can you take me to the museum, please? How much will it cost, roughly?"`,

    vocabulary: [
      {
        word: 'connecting flight',
        wordHi: 'connecting flight (jodne wali udaan)',
        meaning: 'a second flight taken after landing to reach your final destination',
        meaningHi: 'ek second flight jo land hone ke baad li jaati hai final destination tak pahunchne ke liye',
        example: 'I have a connecting flight to Tokyo.',
        exampleHi: 'I have a connecting flight to Tokyo.',
        pronunciation: 'kuh-NEK-ting flyt',
      },
      {
        word: 'reservation',
        wordHi: 'reservation (aarakshan)',
        meaning: 'a booking made in advance for a hotel room, table, or similar',
        meaningHi: 'ek booking jo advance mein ki gayi hai ek hotel room, table, ya similar ke liye',
        example: 'I have a reservation for two nights.',
        exampleHi: 'I have a reservation for two nights.',
        pronunciation: 'rez-er-VEY-shun',
      },
      {
        word: 'check-out',
        wordHi: 'check-out (check-out)',
        meaning: 'the process of leaving a hotel and returning your room',
        meaningHi: 'ek hotel chhodne aur apna room wapas dene ka process',
        example: 'What time is check-out tomorrow?',
        exampleHi: 'What time is check-out tomorrow?',
        pronunciation: 'chek-owt',
      },
      {
        word: 'roughly',
        wordHi: 'roughly (lagbhag)',
        meaning: 'approximately, not exactly',
        meaningHi: 'approximately, exactly nahi',
        example: 'How much will it cost, roughly?',
        exampleHi: 'How much will it cost, roughly?',
        pronunciation: 'RUF-lee',
      },
    ],

    examples: [
      {
        title: 'Checking in at an airport counter',
        titleHi: 'Ek airport counter pe check in karna',
        code: `A: I'd like to check in for my flight to Singapore, please.
B: Sure, may I see your passport? ... Great, here's your boarding pass. Your gate is B12.
A: Thank you! What time does boarding start?`,
        output: 'A smooth, efficient check-in exchange.',
        explain:
          'Notice how short and direct this is — airport staff handle this exact exchange hundreds of times a day, so clear, simple phrases work best for everyone.',
        explainHi:
          'Notice karo ye kitna short aur direct hai — airport staff exactly ye exchange din mein sainkdon baar handle karte hain, so clear, simple phrases sabke liye best kaam karte hain.',
      },
      {
        title: 'Checking into a hotel',
        titleHi: 'Ek hotel mein check in karna',
        code: `A: Hi, I have a reservation under Arjun Mehta.
B: Let me check... yes, found it. Here's your key. Breakfast is included, from 7 to 10am.
A: Perfect, thank you!`,
        output: 'Stating the reservation name immediately speeds up the whole interaction.',
        explain:
          'Leading with "I have a reservation under [name]" gives the front desk exactly what they need to search for, right away, rather than a longer explanation.',
        explainHi:
          '"I have a reservation under [name]" se lead karna front desk ko exactly wo deta hai jo unhe search karne ke liye chahiye, turant, ek lambi explanation ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: '"I have booking on my name Priya." (word-for-word translated structure)',
        right: '"I have a reservation under the name Priya." / "I have a reservation under Priya."',
        why: 'English uses "under the name" or simply "under" to describe whose name a booking is registered to — "on my name" is a direct translation pattern that sounds noticeably non-standard.',
        whyHi: 'English "under the name" ya simply "under" use karti hai ye describe karne ke liye ki booking kiske naam se registered hai — "on my name" ek direct translation pattern hai jo noticeably non-standard sound karta hai.',
      },
      {
        wrong: 'Demanding an exact price from a taxi driver before the trip starts: "Tell me the exact cost right now."',
        right: '"How much will it cost, roughly?"',
        why: 'Traffic and route can affect the final fare, so asking for a rough estimate is more realistic and natural than demanding an exact figure upfront.',
        whyHi: 'Traffic aur route final fare ko affect kar sakte hain, so ek rough estimate poochna ek exact figure upfront demand karne se zyada realistic aur natural hai.',
      },
    ],

    realWorld: [
      {
        en: '**International travel of any kind** — flying, staying in hotels, taking taxis in an unfamiliar city — makes this exact vocabulary a genuine, frequent necessity rather than optional extra knowledge.',
        hi: '**Kisi bhi tarah ka international travel** — fly karna, hotels mein rukna, ek unfamiliar city mein taxis lena — is exact vocabulary ko ek genuine, frequent necessity banata hai, optional extra knowledge nahi.',
      },
      {
        en: '**Business travel specifically** often compresses these interactions into very short windows between meetings, making fast, reliable, ready-made phrases even more valuable than in leisure travel.',
        hi: '**Specifically business travel** often in interactions ko meetings ke beech bahut short windows mein compress karta hai, fast, reliable, ready-made phrases ko leisure travel se bhi zyada valuable banate hue.',
      },
    ],

    interviewQA: [
      {
        q: 'What should I say if I miss my connecting flight?',
        qHi: 'Agar meri connecting flight miss ho jaaye to mujhe kya kehna chahiye?',
        a: '"Excuse me, I\'ve missed my connecting flight to [city] — could you help me rebook?" clearly states the problem and what you need, letting airline staff act quickly on your specific situation.',
        aHi: '"Excuse me, I\'ve missed my connecting flight to [city] — could you help me rebook?" clearly problem state karta hai aur tumhe kya chahiye, airline staff ko tumhari specific situation pe quickly act karne dete hue.',
      },
      {
        q: 'Is it rude to ask a taxi driver for a rough price before getting in?',
        qHi: 'Kya ek taxi driver se andar baithne se pehle ek rough price poochna rude hai?',
        a: 'Not at all — it\'s a completely normal, sensible question, especially in a new city or country. "How much will it cost, roughly, to get to [place]?" is a standard, expected question before starting a taxi ride.',
        aHi: 'Bilkul nahi — ye ek completely normal, sensible question hai, especially ek nayi city ya country mein. "How much will it cost, roughly, to get to [place]?" ek taxi ride start karne se pehle ek standard, expected question hai.',
      },
    ],

    exercises: [
      {
        task: 'Out loud, practice checking in at an imaginary hotel front desk, stating your reservation name and asking about breakfast.',
        taskHi: 'Zor se, ek imaginary hotel front desk pe check in karna practice karo, apna reservation name state karte hue aur breakfast ke baare mein poochte hue.',
        hint: '"I have a reservation under [your name]. Is breakfast included?"',
        hintHi: '"I have a reservation under [your name]. Is breakfast included?"',
      },
      {
        task: 'Out loud, practice giving a taxi driver a destination and asking for a rough price.',
        taskHi: 'Zor se, ek taxi driver ko ek destination dena aur ek rough price poochna practice karo.',
        hint: '"Can you take me to the airport, please? How much will it cost, roughly?"',
        hintHi: '"Can you take me to the airport, please? How much will it cost, roughly?"',
      },
    ],

    keyTakeaways: [
      'Travel phrases are worth learning as fixed, ready-made units, since airport/hotel/taxi interactions happen quickly and often under time pressure.',
      '"I have a connecting flight to [city]" is important because it changes what staff need to help you with.',
      '"I have a reservation under [name]" is the standard, expected way to check in at a hotel front desk.',
      '"How much will it cost, roughly?" is the natural way to ask a taxi driver for a price estimate before the trip.',
      'Having key information (booking name, destination, connecting city) ready to say clearly and simply saves time and reduces stress.',
    ],
    keyTakeawaysHi: [
      'Travel phrases fixed, ready-made units ki tarah seekhne layak hain, kyunki airport/hotel/taxi interactions quickly hote hain aur often time pressure ke neeche.',
      '"I have a connecting flight to [city]" important hai kyunki ye change karta hai staff ko tumhari kaise help karni hai.',
      '"I have a reservation under [name]" ek hotel front desk pe check in karne ka standard, expected tareeka hai.',
      '"How much will it cost, roughly?" ek taxi driver se trip se pehle ek price estimate poochne ka natural tareeka hai.',
      'Key information (booking name, destination, connecting city) ko clearly aur simply bolne ke liye ready rakhna time bachata hai aur stress kam karta hai.',
    ],
  },
];
