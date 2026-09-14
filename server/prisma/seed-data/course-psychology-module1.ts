/**
 * Psychology for Developers — Module 1: How the Mind Actually Processes Information, lessons 1-3.
 *
 * Lesson 1: Working memory limits and why they're a hard constraint on interface/API design.
 * Lesson 2: Attention as a genuinely limited, spendable resource.
 * Lesson 3: Cognitive load theory (intrinsic/extraneous/germane) as the load-bearing concept for design.
 */

import type { CourseLesson } from './course-js-module1';

export const PSYCH_MODULE_1: CourseLesson[] = [
  /* ══════════════════════ Lesson 1 ══════════════════════ */
  {
    slug: 'psych-working-memory-limits',
    title: 'Working Memory Limits — A Hard Constraint, Not a Suggestion',
    titleHi: 'Working Memory Limits — Ek Hard Constraint, Ek Suggestion Nahi',
    description:
      "Before any UX principle or design pattern, the actual physical fact they all rest on: a person can hold only a small number of discrete items in active working memory at once. This isn't a design guideline that can be argued around — it's a measured, physical limit of human cognition.",
    descriptionHi:
      'Kisi bhi UX principle ya design pattern se pehle, wo actual physical fact jispe wo sab rest karte hain: ek insaan ek time pe active working memory mein sirf ek chhoti number of discrete items hold kar sakta hai. Ye koi design guideline nahi hai jise argue karke around kiya ja sake — ye human cognition ki ek measured, physical limit hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: "**A kitchen counter of a genuinely fixed size, versus an infinite pantry in the next room.** A cook can only have a handful of ingredients actively out on the counter at once, being worked with right now — the pantry next door might hold thousands of items, but everything not currently on the counter is effectively unavailable to the immediate task until the cook deliberately walks over and brings it back. Making the counter physically bigger isn't an option; the cook has to work skillfully WITHIN this fixed space — grouping related ingredients together, putting away what's not needed for the current step, bringing things out only when they're actually about to be used. A person's working memory is exactly this counter, and it is not negotiable in size: long-term memory (the pantry) can store a vast amount, but only a small handful of items can be actively \"out\" and manipulated in conscious thought at any one moment, and every interface a person interacts with is effectively asking them to work on that same small counter.",
      hi: 'Ek genuinely fixed size ka kitchen counter, versus agle room mein ek infinite pantry. Ek cook ke paas ek time pe counter pe muthi bhar ingredients hi actively out ho sakte hain, abhi ke saath kaam kiye ja rahe — agle darwaze ki pantry mein hazaron items ho sakte hain, par jo bhi currently counter pe nahi hai wo immediate task ke liye effectively unavailable hai jab tak cook deliberately walk karke wapas na le aaye. Counter ko physically bada banana ek option nahi hai; cook ko is fixed space ke ANDAR skillfully kaam karna padta hai — related ingredients ko saath group karna, current step ke liye zaroorat na hone wali cheez ko put away karna, cheezein bahar sirf tab laana jab wo actually use hone wali hon. Ek insaan ki working memory exactly ye counter hai, aur ye size mein non-negotiable hai: long-term memory (pantry) ek vast amount store kar sakti hai, par sirf muthi bhar items hi actively "out" ho sakte hain aur conscious thought mein kisi bhi ek moment pe manipulate kiye ja sakte hain, aur har interface jisse ek insaan interact karta hai effectively unhe wahi chhote counter pe kaam karne ko keh raha hai.',
    },

    simple: `**The actual, measured finding — and why "7±2" needs a modern
correction:**

\`\`\`
George Miller's 1956 paper "The Magical Number Seven, Plus or Minus
Two" measured that people can hold roughly 5-9 discrete chunks of
information in working memory at once.

Modern research (Cowan, 2001, and subsequent replications) revised
this downward for ACTIVE manipulation (as opposed to simple recall) to
roughly 4 chunks — still small, still finite, still a real, physical
ceiling, not a rough guess.

The critical word is CHUNK, not "item" — a chunk is whatever a person
has learned to treat as one unit. "F", "B", "I" are three chunks to
someone unfamiliar with them, but "FBI" is ONE chunk to someone who
already recognizes it as a unit. This is why grouping/formatting
genuinely increases effective capacity — not by cheating the limit,
but by reducing how many actual chunks the same information requires.
\`\`\`

**Why this directly, mechanically explains a specific, common UI
failure — an unformatted, long identifier:**

\`\`\`
Phone number with no formatting: 5551234567
  -> 10 individual digit-chunks — genuinely exceeds working memory
     capacity to hold and verify at a glance

Phone number formatted: (555) 123-4567
  -> 3 chunks (area code, prefix, line number) — comfortably within
     capacity, verifiable at a glance

Nothing about the SECOND number's information content changed. What
changed is how many chunks the SAME information was organized into —
this is the mechanism, not a stylistic preference.
\`\`\`

**A concrete implementation — chunking a value for display, directly
applying the mechanism above:**

\`\`\`ts
function chunkForDisplay(digits, groupSizes) {
  // groupSizes e.g. [3, 3, 4] for a US phone number
  let result = '';
  let position = 0;
  for (const size of groupSizes) {
    result += digits.slice(position, position + size);
    position += size;
    if (position < digits.length) result += '-';
  }
  return result;
}

chunkForDisplay('5551234567', [3, 3, 4]);
// "555-123-4567" — 3 chunks instead of 10, same underlying information
\`\`\`

**Why this is a hard constraint on API and code design too, not just
visual UI:** a function signature with 8 unrelated positional
parameters, or a deeply nested conditional a reader has to hold multiple
active states of in their head simultaneously to trace through,
genuinely exceeds the same working-memory ceiling this lesson
establishes — a developer reading that code is doing the exact same
kind of active chunk-manipulation as a user reading an unformatted phone
number. This is why "reduce the number of things a reader must hold
active at once" is not a vague code-quality platitude — it's a direct
application of a measured cognitive limit, the same one Module 10 will
apply specifically to interface design and Module 1's chunk concept
underlies directly.

**Why "just add more items and let people scroll/search" doesn't
sidestep this limit:** the limit isn't about how much information total
a system can present — it's about how much can be ACTIVELY held and
compared at once during a single task. A settings screen with 200
options, searchable, doesn't violate this limit by itself; a single
screen demanding a visitor compare 12 similarly-worded options
side-by-side to make one decision does, regardless of how the other 188
options are organized elsewhere.`,

    simpleHi: `**Actual, measured finding — aur "7±2" ko ek modern correction kyun
chahiye:**

\`\`\`
George Miller ke 1956 paper "The Magical Number Seven, Plus or Minus
Two" ne measure kiya ki log ek time pe roughly 5-9 discrete chunks of
information working memory mein hold kar sakte hain.

Modern research (Cowan, 2001, aur subsequent replications) ne ise
ACTIVE manipulation ke liye (simple recall ke bajaye) roughly 4 chunks
tak downward revise kiya — abhi bhi chhota, abhi bhi finite, abhi bhi
ek real, physical ceiling, ek rough guess nahi.

Critical word CHUNK hai, "item" nahi — ek chunk kuch bhi hai jise ek
insaan ne ek unit ki tarah treat karna seekh liya hai. "F", "B", "I"
teen chunks hain kisi ke liye jo unse unfamiliar hai, par "FBI" EK
chunk hai kisi ke liye jo ise already ek unit ki tarah recognize karta
hai. Yahi wajah hai grouping/formatting genuinely effective capacity
badhata hai — limit ko cheat karke nahi, balki ye kam karke ki wahi
information ko kitne actual chunks chahiye.
\`\`\`

**Ye directly, mechanically ek specific, common UI failure kyun
explain karta hai — ek unformatted, long identifier:**

\`\`\`
Phone number koi formatting ke bina: 5551234567
  -> 10 individual digit-chunks — genuinely working memory capacity
     exceed karta hai ek glance mein hold aur verify karne ke liye

Phone number formatted: (555) 123-4567
  -> 3 chunks (area code, prefix, line number) — comfortably capacity
     ke andar, ek glance mein verifiable

Doosre number ki information content mein kuch nahi badla. Kya badla
wo hai ki wahi information kitne chunks mein organize ki gayi — ye
mechanism hai, ek stylistic preference nahi.
\`\`\`

**Ek concrete implementation — ek value ko display ke liye chunk
karna, upar wale mechanism ko directly apply karte hue:**

\`\`\`ts
function chunkForDisplay(digits, groupSizes) {
  // groupSizes jaise [3, 3, 4] ek US phone number ke liye
  let result = '';
  let position = 0;
  for (const size of groupSizes) {
    result += digits.slice(position, position + size);
    position += size;
    if (position < digits.length) result += '-';
  }
  return result;
}

chunkForDisplay('5551234567', [3, 3, 4]);
// "555-123-4567" — 10 ke bajaye 3 chunks, wahi underlying information
\`\`\`

**Ye API aur code design pe bhi ek hard constraint kyun hai, sirf
visual UI pe nahi:** ek function signature jiske 8 unrelated positional
parameters hon, ya ek deeply nested conditional jise trace karne ke liye
ek reader ko multiple active states apne head mein simultaneously hold
karne padte hon, genuinely wahi working-memory ceiling exceed karta hai
jise ye lesson establish karta hai — us code ko padhne wala ek developer
exactly wahi kism ka active chunk-manipulation kar raha hai jaise ek
unformatted phone number padhne wala ek user. Yahi wajah hai "ek reader
ko ek time pe kitni cheezein active hold karni hain kam karo" koi vague
code-quality platitude nahi hai — ye ek measured cognitive limit ka
direct application hai, wahi jise Module 10 specifically interface
design pe apply karega aur Module 1 ka chunk concept directly underlie
karta hai.

**"Bas zyada items add karo aur logon ko scroll/search karne do" is
limit ko sidestep kyun nahi karta:** limit is baare mein nahi hai ki ek
system total kitni information present kar sakta hai — ye is baare mein
hai ki ek single task ke dauran kitni ACTIVELY hold aur compare ki ja
sakti hai ek saath. 200 options wali ek settings screen, searchable,
apne aap mein is limit ko violate nahi karti; ek single screen jo ek
visitor ko ek decision lene ke liye 12 similarly-worded options
side-by-side compare karne ki demand karti hai karti hai, chahe baaki
188 options kahin aur kaise bhi organized hon.`,

    content: `## Why "7±2" needed the Cowan revision, and why the revision matters
practically, not just academically

Miller's original 1956 finding measured a range (5-9) that became
popularly rounded to "seven" — a number that stuck in cultural memory
partly because it was a convenient, memorable figure, not because it
was the most precise available. Nelson Cowan's 2001 review of decades
of subsequent research found that when a task requires ACTIVE
manipulation of items (rather than passive recognition or recall aided
by chunking strategies), genuine capacity is closer to about 4 chunks.
This matters practically because a designer relying on the more generous
"7" figure to justify a 7-item navigation menu or a 7-field form section
is working from a looser constraint than the one that actually governs
active decision-making tasks — the stricter, ~4-chunk figure is the more
appropriate one to design against for any interface asking a person to
actively compare, decide, or manipulate, rather than passively browse.

## Why a "chunk" — not a raw item — is the actual unit, and why this
is the single most actionable insight in this lesson

The critical nuance is that working memory's limit applies to chunks,
where a chunk is defined by what the person's own prior learning has
taught them to treat as one unit, not by any objective property of the
information itself. This is precisely why formatting a phone number,
grouping related form fields, or naming a well-understood pattern (a
"singleton," a "factory") doesn't cheat the limit — it genuinely reduces
the number of discrete chunks the same information requires, by
leveraging chunks the reader has already learned. This reframes "reduce
cognitive load" from a vague aspiration into a concrete, checkable
question: does this specific formatting or naming choice reduce the
actual chunk count for someone with reasonable, expected background
knowledge?

## Why this is a hard ceiling rather than something skilled design can
simply push past

Unlike many soft usability preferences that vary by context or user
sophistication, working memory capacity is a measured property of human
neurology — it does not meaningfully increase with expertise, motivation,
or good design intent. An expert user facing a task that genuinely
requires holding 8 unrelated, unchunkable pieces of information active
simultaneously will struggle just as an novice would, though an expert
may have more available chunks to draw on (their domain expertise turns
what would be many raw items into fewer, larger chunks). This is why
the correct response to a task exceeding this limit is never "make the
user more careful or expert" — it's restructuring the task itself to
require fewer simultaneously-active chunks.

## How this founds every later module in this course

This lesson's mechanism is the literal foundation Module 10's interface-
design patterns (progressive disclosure, chunking) implement directly,
and it underlies Module 6's choice-architecture lesson (more options to
actively compare means more chunks a decision-maker must hold) and
Module 16's code-review lesson (a large diff exceeds the same ceiling a
reviewer's working memory imposes). Every subsequent module that
discusses "reducing complexity" or "simplifying a decision" is, at its
mechanistic core, discussing how to reduce the actual chunk count against
this same, non-negotiable ceiling.`,

    contentHi: `## "7±2" ko Cowan revision kyun chahiye thi, aur ye revision practically kyun matter karta hai, sirf academically nahi

Miller ki original 1956 finding ne ek range (5-9) measure kiya jo
popularly "seven" tak round ho gaya — ek number jo cultural memory mein
partly isliye atka kyunki ye ek convenient, memorable figure tha, is
wajah se nahi ki ye available sabse precise tha. Nelson Cowan ki 2001
review ne decades ki subsequent research ki jab ye find kiya ki jab ek
task ko items ki ACTIVE manipulation chahiye (passive recognition ya
chunking strategies se aided recall ke bajaye), genuine capacity roughly
4 chunks ke close hai. Ye practically matter karta hai kyunki ek
designer jo zyada generous "7" figure pe rely karta hai ek 7-item
navigation menu ya ek 7-field form section justify karne ke liye ek
looser constraint se kaam kar raha hai us se jo actually active
decision-making tasks ko govern karta hai — stricter, ~4-chunk figure
kisi bhi interface ke against design karne ke liye zyada appropriate hai
jo ek insaan se actively compare, decide, ya manipulate karne ko poochti
hai, passively browse karne ke bajaye.

## Ek "chunk" — ek raw item nahi — actual unit kyun hai, aur ye is lesson mein single sabse actionable insight kyun hai

Critical nuance ye hai ki working memory ki limit chunks pe apply hoti
hai, jahan ek chunk us cheez se define hota hai jo insaan ki apni prior
learning ne unhe ek unit ki tarah treat karna sikhaya hai, information
khud ki kisi bhi objective property se nahi. Yahi exactly wajah hai ek
phone number ko format karna, related form fields ko group karna, ya
ek well-understood pattern ko naam dena ("singleton," "factory") limit
ko cheat nahi karta — ye genuinely un discrete chunks ki number kam
karta hai jo wahi information chahta hai, un chunks ka leverage karke
jo reader already seekh chuka hai. Ye "cognitive load kam karo" ko ek
vague aspiration se ek concrete, checkable question mein reframe karta
hai: kya ye specific formatting ya naming choice reasonable, expected
background knowledge wale kisi ke liye actual chunk count kam karta
hai?

## Ye ek hard ceiling kyun hai us cheez ke bajaye jise skilled design simply push past kar sake

Kai soft usability preferences ke unlike jo context ya user
sophistication ke hisaab se vary karte hain, working memory capacity
human neurology ki ek measured property hai — ye expertise, motivation,
ya achhi design intent ke saath meaningfully increase nahi hoti. Ek
expert user jo ek task face kar raha hai jise genuinely 8 unrelated,
unchunkable pieces of information ko simultaneously active hold karna
chahiye ek novice ki tarah hi struggle karega, chahe ek expert ke paas
draw karne ke liye zyada available chunks ho sakte hain (unki domain
expertise wo cheez jo many raw items hote us se fewer, larger chunks
mein badal deti hai). Yahi wajah hai is limit ko exceed karne wale ek
task ka correct response kabhi "user ko zyada careful ya expert banao"
nahi hai — ye task khud ko restructure karna hai taaki kam
simultaneously-active chunks chahiye.

## Ye is course ke har baad wale module ko kaise found karta hai

Is lesson ka mechanism wo literal foundation hai jise Module 10 ke
interface-design patterns (progressive disclosure, chunking) directly
implement karte hain, aur ye Module 6 ke choice-architecture lesson ko
underlie karta hai (actively compare karne ke liye zyada options matlab
hai ek decision-maker ko zyada chunks hold karne chahiye) aur Module 16
ke code-review lesson ko (ek bada diff wahi ceiling exceed karta hai jo
ek reviewer ki working memory impose karti hai). Har subsequent module
jo "complexity kam karna" ya "ek decision simplify karna" discuss karta
hai, apne mechanistic core mein, discuss kar raha hai ki actual chunk
count ko us wahi, non-negotiable ceiling ke against kaise kam kiya
jaaye.`,

    examples: [
      {
        title: 'A chunking utility applied to both a phone number and a credit card number, demonstrating the same mechanism twice',
        titleHi: 'Ek chunking utility phone number aur credit card number dono pe applied, wahi mechanism do baar demonstrate karte hue',
        codeJs: `function chunkForDisplay(rawDigits, groupSizes, separator = '-') {
  let result = '';
  let position = 0;
  for (const size of groupSizes) {
    if (position >= rawDigits.length) break;
    result += rawDigits.slice(position, position + size);
    position += size;
    if (position < rawDigits.length) result += separator;
  }
  return result;
}

// A US phone number: 10 raw digit-chunks -> 3 chunks
console.log(chunkForDisplay('5551234567', [3, 3, 4]));
// "555-123-4567"

// A credit card number: 16 raw digit-chunks -> 4 chunks
console.log(chunkForDisplay('4111111111111111', [4, 4, 4, 4]));
// "4111-1111-1111-1111"

// Same mechanism, same function — the underlying information's chunk
// count is what changed, not the amount of information itself`,
        codeTs: `function chunkForDisplay(rawDigits: string, groupSizes: number[], separator = '-'): string {
  let result = '';
  let position = 0;
  for (const size of groupSizes) {
    if (position >= rawDigits.length) break;
    result += rawDigits.slice(position, position + size);
    position += size;
    if (position < rawDigits.length) result += separator;
  }
  return result;
}

// A US phone number: 10 raw digit-chunks -> 3 chunks
console.log(chunkForDisplay('5551234567', [3, 3, 4]));
// "555-123-4567"

// A credit card number: 16 raw digit-chunks -> 4 chunks
console.log(chunkForDisplay('4111111111111111', [4, 4, 4, 4]));
// "4111-1111-1111-1111"

// Same mechanism, same function — the underlying information's chunk
// count is what changed, not the amount of information itself`,
        code: `function chunkForDisplay(rawDigits, groupSizes, separator = '-') {
  let result = '', position = 0;
  for (const size of groupSizes) {
    result += rawDigits.slice(position, position + size);
    position += size;
    if (position < rawDigits.length) result += separator;
  }
  return result;
}`,
        output: "'555-123-4567' and '4111-1111-1111-1111' — both reduce a raw digit string exceeding the ~4-chunk active-manipulation limit down to a chunk count comfortably within it, using the identical mechanism.",
        explain: "The SAME function, with different groupSizes, correctly chunks two completely different kinds of identifiers — demonstrating that this isn't a phone-number-specific trick, but a direct, general application of the working-memory mechanism this lesson establishes: reduce the discrete chunk count, regardless of what the underlying data represents.",
        explainHi: "WAHI function, alag groupSizes ke saath, do poori tarah alag kism ke identifiers ko correctly chunk karta hai — demonstrate karte hue ki ye koi phone-number-specific trick nahi hai, balki is lesson ke establish kiye working-memory mechanism ka ek direct, general application hai: discrete chunk count kam karo, chahe underlying data kuch bhi represent kare.",
      },
    ],

    mistakes: [
      {
        wrong: `// A function signature demanding 8 unrelated positional arguments —
// exceeding working memory's active-manipulation ceiling for anyone
// calling or reading it
function createUser(name, email, age, country, role, isActive, createdBy, notifyByEmail) {
  // A caller has to correctly recall the MEANING of each position,
  // holding all 8 slots active in memory just to call this correctly —
  // exactly the chunk-count problem this lesson describes
}

createUser('Priya', 'p@x.com', 28, 'IN', 'admin', true, 'system', false);
// Which boolean is which? A reader has to trace back to the signature
// every single time — the same "unformatted phone number" problem`,
        right: `// Grouping related parameters into ONE object — reducing the actual
// chunk count a caller/reader must hold active
function createUser({ name, email, age, country, role, isActive, createdBy, notifyByEmail }) {
  // Still the same 8 pieces of information, but now ONE chunk (the
  // options object) instead of 8 separately-ordered positional slots
}

createUser({
  name: 'Priya', email: 'p@x.com', age: 28, country: 'IN',
  role: 'admin', isActive: true, createdBy: 'system', notifyByEmail: false,
});
// Each value is self-labeled at the call site — no position to
// misremember, and the whole call reads as one coherent chunk`,
        why: "Eight unrelated positional parameters genuinely exceed the ~4-chunk active-manipulation limit this lesson establishes for anyone calling or reading the function — a reader has to actively hold each position's meaning simultaneously. Grouping them into one labeled object reduces this to effectively one chunk, the same underlying mechanism as formatting a phone number.",
        whyHi: "Aath unrelated positional parameters genuinely ~4-chunk active-manipulation limit exceed karte hain jise ye lesson establish karta hai kisi ke liye bhi jo function ko call ya padhta hai — ek reader ko har position ka meaning simultaneously actively hold karna padta hai. Unhe ek labeled object mein group karna ise effectively ek chunk tak kam karta hai, wahi underlying mechanism jo ek phone number ko format karne ka hai.",
      },
    ],

    realWorld: [
      {
        en: "A production banking app deliberately formats account numbers, routing numbers, and transaction amounts with visual grouping (spaces, dashes, comma separators) specifically because a customer manually verifying a large wire transfer is performing exactly the kind of active, high-stakes chunk-comparison this lesson's mechanism governs, where exceeding the working-memory ceiling directly increases the real risk of an unnoticed error.",
        hi: 'Ek production banking app deliberately account numbers, routing numbers, aur transaction amounts ko visual grouping (spaces, dashes, comma separators) ke saath format karta hai specifically kyunki ek customer jo manually ek bade wire transfer ko verify kar raha hai exactly wo kism ka active, high-stakes chunk-comparison perform kar raha hai jise is lesson ka mechanism govern karta hai, jahan working-memory ceiling exceed karna directly ek unnoticed error ke real risk ko badhata hai.',
      },
    ],

    interviewQA: [
      {
        q: "What is the actual, modern figure for working memory's active-manipulation capacity, and why did it change from Miller's original '7±2'?",
        qHi: "Working memory ki active-manipulation capacity ke liye actual, modern figure kya hai, aur ye Miller ke original '7±2' se kyun badla?",
        a: "Modern research (Cowan, 2001) revised the figure to approximately 4 chunks specifically for tasks requiring active manipulation, as opposed to Miller's broader 1956 range of 5-9 which included passive recall aided by chunking strategies. The stricter ~4-chunk figure is the more appropriate one to design against for any interface asking someone to actively compare or decide, not just browse.",
        aHi: 'Modern research (Cowan, 2001) ne figure ko approximately 4 chunks tak revise kiya specifically un tasks ke liye jinhe active manipulation chahiye, Miller ke broader 1956 range 5-9 ke bajaye jisme chunking strategies se aided passive recall shamil tha. Stricter ~4-chunk figure kisi bhi interface ke against design karne ke liye zyada appropriate hai jo kisi se actively compare ya decide karne ko poochti hai, sirf browse nahi.',
      },
      {
        q: "Why does formatting a phone number (or grouping function parameters into an object) genuinely reduce cognitive load, rather than just look tidier?",
        qHi: 'Ek phone number ko format karna (ya function parameters ko ek object mein group karna) genuinely cognitive load kyun kam karta hai, sirf zyada tidy dikhne ke bajaye?',
        a: "Working memory's limit applies to chunks, not raw items — a chunk is whatever a person has learned to treat as one unit. Grouping related digits or parameters reduces the actual number of discrete chunks the same information requires to hold and process, which is a direct, measurable reduction in cognitive demand, not merely a stylistic preference.",
        aHi: 'Working memory ki limit chunks pe apply hoti hai, raw items pe nahi — ek chunk kuch bhi hai jise ek insaan ne ek unit ki tarah treat karna seekh liya hai. Related digits ya parameters ko group karna un discrete chunks ki actual number kam karta hai jo wahi information hold aur process karne ke liye chahiye, jo cognitive demand mein ek direct, measurable reduction hai, sirf ek stylistic preference nahi.',
      },
    ],

    exercises: [
      {
        task: "A settings page presents 9 unrelated, similarly-worded toggle switches in a flat, unlabeled list, asking a user to review all of them before saving. Using this lesson's mechanism, explain why this specific design genuinely exceeds working-memory capacity, and propose a restructuring that would not.",
        taskHi: 'Ek settings page 9 unrelated, similarly-worded toggle switches ko ek flat, unlabeled list mein present karta hai, ek user se sab save karne se pehle review karne ko poochte hue. Is lesson ke mechanism ka use karke, explain karo ki ye specific design genuinely working-memory capacity kyun exceed karta hai, aur ek restructuring propose karo jo na kare.',
        hint: "Think about how grouping the 9 toggles into a smaller number of clearly-labeled categories would change the actual chunk count a user must hold active while reviewing them.",
        hintHi: '9 toggles ko clearly-labeled categories ki ek chhoti number mein group karna actual chunk count ko kaise badlega jo ek user ko unhe review karte waqt active hold karna chahiye ye socho.',
      },
    ],

    keyTakeaways: [
      "Working memory's active-manipulation capacity is a measured, physical limit of human cognition (~4 chunks per Cowan's 2001 revision), not a soft design guideline that can be argued around.",
      "The actual unit is the CHUNK, defined by what a person's prior learning has taught them to treat as one unit — not a raw item count — which is why formatting and grouping genuinely reduce cognitive demand rather than merely improving aesthetics.",
      "This is a hard ceiling that expertise or good intentions cannot push past directly — the correct response to a task exceeding it is restructuring the task to require fewer simultaneously-active chunks, never asking users to simply be more careful.",
      "This mechanism directly founds Module 10's interface-design patterns, Module 6's choice-architecture lesson, and Module 16's code-review lesson — every later discussion of 'reducing complexity' in this course traces back to this same, non-negotiable ceiling.",
    ],
    keyTakeawaysHi: [
      'Working memory ki active-manipulation capacity human cognition ki ek measured, physical limit hai (~4 chunks Cowan ke 2001 revision ke hisaab se), koi soft design guideline nahi jise argue karke around kiya ja sake.',
      'Actual unit CHUNK hai, jo us cheez se define hota hai jise ek insaan ki prior learning ne unhe ek unit ki tarah treat karna sikhaya — ek raw item count nahi — yahi wajah hai formatting aur grouping genuinely cognitive demand kam karte hain sirf aesthetics improve karne ke bajaye.',
      'Ye ek hard ceiling hai jise expertise ya achhi intentions directly push past nahi kar sakte — ise exceed karne wale ek task ka correct response task ko restructure karna hai taaki kam simultaneously-active chunks chahiye, users ko bas zyada careful hone ko kehna kabhi nahi.',
      'Ye mechanism directly Module 10 ke interface-design patterns, Module 6 ke choice-architecture lesson, aur Module 16 ke code-review lesson ko found karta hai — is course mein "complexity kam karna" ki har baad wali discussion wapas isi wahi, non-negotiable ceiling tak trace hoti hai.',
    ],
  },

  /* ══════════════════════ Lesson 2 ══════════════════════ */
  {
    slug: 'psych-attention-as-a-limited-resource',
    title: 'Attention as a Genuinely Limited, Spendable Resource',
    titleHi: 'Attention Ek Genuinely Limited, Spendable Resource Ki Tarah',
    description:
      "Working memory (Lesson 1) is one hard limit; attention is a related but genuinely distinct one — a resource that gets consumed by whatever it's directed at, cannot be meaningfully split across simultaneous tasks despite the popular myth of 'multitasking,' and directly determines what a person even notices.",
    descriptionHi:
      "Working memory (Lesson 1) ek hard limit hai; attention ek related par genuinely distinct wala hai — ek resource jo consume hota hai jispe bhi ye directed hai, simultaneous tasks ke across meaningfully split nahi ho sakta 'multitasking' ki popular myth ke bawajood, aur directly determine karta hai ki ek insaan kya notice bhi karta hai.",
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: "**A single spotlight on a dark stage, versus the (false) belief that you could point two spotlights at two different actors from the exact same lamp at the exact same time.** A single spotlight genuinely illuminates only where it's currently pointed — everything outside its beam exists on the stage, but is effectively invisible to anyone relying on that light to see. You can move the spotlight rapidly back and forth between two actors, creating an ILLUSION of covering both, but at any given instant, the light is genuinely on only one of them — the other is, for that instant, in the dark. \"Multitasking\" as commonly imagined — genuinely, simultaneously attending to two demanding things — is exactly this impossible second lamp: what actually happens when a person believes they're multitasking on two attention-demanding tasks is the spotlight rapidly switching back and forth, with a real, measurable cost (called a switching cost) paid every single time it moves, and each task actually receiving full illumination only in brief, alternating slices, never both at once.",
      hi: 'Ek dark stage pe ek single spotlight, versus ye (false) belief ki aap wahi exact lamp se do alag actors pe wahi exact time pe do spotlights point kar sakte ho. Ek single spotlight genuinely sirf wahi illuminate karta hai jahan ye currently pointed hai — uske beam ke bahar sab kuch stage pe exist karta hai, par us light pe rely karne wale kisi ke liye bhi effectively invisible hai. Aap spotlight ko do actors ke beech rapidly back and forth move kar sakte ho, dono ko cover karne ka ek ILLUSION create karte hue, par kisi bhi given instant pe, light genuinely sirf unme se ek pe hai — doosra, us instant ke liye, dark mein hai. "Multitasking" jaise commonly imagine kiya jata hai — genuinely, simultaneously do demanding cheezon pe attend karna — exactly ye impossible doosra lamp hai: jab ek insaan believe karta hai ki wo do attention-demanding tasks pe multitask kar raha hai actually kya hota hai spotlight ka rapidly back and forth switch karna hai, ek real, measurable cost (jise switching cost kaha jata hai) har single baar move hone pe pay ki gayi, aur har task actually full illumination sirf brief, alternating slices mein receive karta hai, kabhi dono ek saath nahi.',
    },

    simple: `**The actual mechanism — attention as selective, exclusive
allocation, not a divisible resource:**

\`\`\`
Attention research (going back to Broadbent's filter model, refined
across decades of cognitive psychology) establishes: attention operates
as a SELECTIVE filter, genuinely allocated to one thing at a time for
tasks requiring active cognitive processing, not passively split like
a resource pool divided into fractions.

"Multitasking" on two attention-demanding tasks (writing an email while
in a meeting, reading a message while driving) is actually RAPID
SWITCHING — the spotlight moving back and forth — and every switch
incurs a real, measured cost:
  - Time lost re-establishing context on the task being returned to
  - A genuine error-rate increase on both tasks compared to doing
    either alone, sequentially
  - This is a REPLICATED FINDING (task-switching cost research,
    starting with Rogers & Monsell, 1995, and extensively confirmed
    since), not a productivity-guru talking point
\`\`\`

**Why this directly explains a specific, common product-design and
engineering-practice failure — interrupting a task in progress:**

\`\`\`ts
// A notification system that interrupts a user mid-task with anything
// non-urgent forces exactly the costly switch this lesson describes
function shouldInterruptImmediately(notification, userContext) {
  // WRONG default: interrupt for everything, regardless of the user's
  // current attentional state
  return true;
}

// A design that respects attention as a limited resource — batching
// non-urgent interruptions to natural task-boundary moments
function shouldInterruptImmediately(notification, userContext) {
  if (notification.priority === 'urgent') return true; // a genuine exception
  return userContext.isAtNaturalBreakpoint; // otherwise, wait for one
}
\`\`\`

**Why "attentional blindness" is the other critical, often-missed
half of this mechanism:** attention doesn't just determine how quickly
something is processed — it determines whether something is
CONSCIOUSLY NOTICED AT ALL. The famous "invisible gorilla" experiment
(Simons & Chabris, 1999) had participants count basketball passes in a
video; roughly half failed to notice a person in a gorilla suit walking
directly through the scene, because their attention was fully allocated
elsewhere. This is why a critical error message appearing while a user's
attention is fully engaged elsewhere on the screen can be, quite
literally, never consciously perceived — not read carelessly, but
genuinely not seen, the same mechanism the gorilla experiment
demonstrated.

**Why this connects directly to, but is distinct from, Lesson 1's
working-memory limit:** working memory limits how much can be actively
held and manipulated once something has been attended to; attention
determines what gets INTO working memory in the first place, and
whether it's processed with full versus divided resources. A perfectly
chunked, well-formatted piece of information (Lesson 1's solution) is
still useless if a person's attention was never actually directed at
it — which is why a critical alert needs to actively capture attention
(motion, sound, position) BEFORE its content's chunking quality matters
at all.`,

    simpleHi: `**Actual mechanism — attention selective, exclusive allocation ki
tarah, ek divisible resource nahi:**

\`\`\`
Attention research (Broadbent ke filter model tak wapas jaata hua,
cognitive psychology ke decades ke across refined) establish karta hai:
attention ek SELECTIVE filter ki tarah operate karta hai, genuinely ek
time pe ek cheez ko allocated active cognitive processing chahne wale
tasks ke liye, passively ek resource pool ki tarah split nahi hota jo
fractions mein divided ho.

Do attention-demanding tasks pe "Multitasking" (ek meeting mein ek email
likhna, driving karte waqt ek message padhna) actually RAPID SWITCHING
hai — spotlight back and forth move ho raha hai — aur har switch ek
real, measured cost incur karta hai:
  - Us task pe context re-establish karne mein lost time jispe wapas
    aaya gaya
  - Dono tasks pe ek genuine error-rate increase ek se compare mein
    sequentially akela karne ke
  - Ye ek REPLICATED FINDING hai (task-switching cost research, Rogers
    & Monsell, 1995 se shuru, aur tab se extensively confirmed), ek
    productivity-guru talking point nahi
\`\`\`

**Ye directly ek specific, common product-design aur engineering-
practice failure ko kyun explain karta hai — ek task ko progress mein
interrupt karna:**

\`\`\`ts
// Ek notification system jo ek user ko mid-task kisi bhi non-urgent
// cheez se interrupt karta hai exactly wahi costly switch force karta
// hai jise ye lesson describe karta hai
function shouldInterruptImmediately(notification, userContext) {
  // GALAT default: har cheez ke liye interrupt karo, user ke current
  // attentional state se independently
  return true;
}

// Ek design jo attention ko ek limited resource ki tarah respect karta
// hai — non-urgent interruptions ko natural task-boundary moments tak
// batch karna
function shouldInterruptImmediately(notification, userContext) {
  if (notification.priority === 'urgent') return true; // ek genuine exception
  return userContext.isAtNaturalBreakpoint; // otherwise, ek ka wait karo
}
\`\`\`

**"Attentional blindness" is mechanism ka doosra critical, aksar-
missed half kyun hai:** attention sirf ye determine nahi karta ki kuch
kitni jaldi process hota hai — ye determine karta hai ki kuch
CONSCIOUSLY NOTICE HOTA HAI YA BILKUL NAHI. Famous "invisible gorilla"
experiment (Simons & Chabris, 1999) mein participants ko ek video mein
basketball passes count karne ko kaha gaya; roughly aadhe ek gorilla
suit mein ek person ko directly scene ke through chalte hue notice
karne mein fail hue, kyunki unka attention poori tarah kahin aur
allocated tha. Yahi wajah hai ek critical error message jo appear hota
hai jab ek user ka attention screen pe kahin aur poori tarah engaged
hai, quite literally, kabhi consciously perceive nahi ho sakta — carelessly
padha nahi gaya, balki genuinely nahi dekha gaya, wahi mechanism jise
gorilla experiment demonstrate karta hai.

**Ye directly Lesson 1 ki working-memory limit se kaise connect hota
hai, par uske alag hai:** working memory limit karti hai ki ek baar
kisi cheez ko attend kiye jaane ke baad kitna actively hold aur
manipulate ho sakta hai; attention determine karta hai ki pehli jagah
working memory mein kya jaata hai, aur kya ise full versus divided
resources ke saath process kiya jata hai. Ek perfectly chunked, well-
formatted piece of information (Lesson 1 ka solution) abhi bhi useless
hai agar ek insaan ka attention kabhi actually uspe directed hi nahi
hua — yahi wajah hai ek critical alert ko actively attention capture
karna chahiye (motion, sound, position) uski content ki chunking
quality bilkul matter karne se PEHLE.`,

    content: `## Why "multitasking" is measurably a myth for attention-demanding
tasks, not just an inefficient habit

Rogers and Monsell's 1995 task-switching research, and the substantial
body of replication since, established that switching between two
tasks requiring active attention incurs a genuine, measurable cost each
time: time lost re-establishing context, and an elevated error rate on
both tasks compared to completing them sequentially. This isn't a claim
that people are simply bad at time management — it's a finding about
the actual mechanism of attention itself, which functions as a
selective filter directed at one thing at a time for cognitively
demanding tasks, not a resource that can be genuinely divided and run
in parallel the way a computer's threads can be.

## Why attentional blindness is a structurally different phenomenon
from working memory limits, and why both matter for design

Simons and Chabris's 1999 "invisible gorilla" experiment demonstrated
something distinct from Lesson 1's working-memory ceiling: it's not
that participants held the gorilla in memory and then forgot it — a
genuine majority never consciously perceived it entering their visual
field at all, because their attention was fully allocated to a
different task (counting passes). This means attention determines the
gate information must pass through before working memory limits even
become relevant — a perfectly designed, well-chunked piece of
information is functionally useless if a person's attention was never
directed toward it in the first place.

## Why respecting attention as a limited resource requires
structural, not just content, changes to design

Because attention cannot be meaningfully split, and switching it incurs
a real cost, the practical implication for interruption design is
structural: batching non-urgent interruptions to natural task-boundary
moments (rather than firing the instant information becomes available)
reduces the number of costly context-switches a person is forced
through, and genuinely improves both task completion and the quality
of attention paid to the interrupting content itself. This is a
different lever than Lesson 1's chunking — chunking makes information
easier to process once attended to; respecting attention determines
whether, and how well, it gets attended to in the first place.

## How this lesson connects forward to Module 14 and Module 17

This lesson's attention mechanism is what Module 14 (designing for
stress and high-stakes contexts) builds on directly — acute stress
further narrows attention's already-selective scope, making the
gorilla-experiment-style blindness even more likely exactly when missing
something critical is most costly. It's also the direct foundation for
Module 17's discussion of flow state and the real cost of
context-switching in engineering work — an interrupted developer is
experiencing precisely the switching-cost mechanism this lesson
establishes, not simply losing a few seconds of typing time.`,

    contentHi: `## "Multitasking" attention-demanding tasks ke liye measurably ek myth kyun hai, sirf ek inefficient habit nahi

Rogers aur Monsell ki 1995 task-switching research, aur tab se
substantial body of replication ne establish kiya ki active attention
chahne wale do tasks ke beech switch karna har baar ek genuine,
measurable cost incur karta hai: context re-establish karne mein lost
time, aur dono tasks pe ek elevated error rate unhe sequentially
complete karne ke comparison mein. Ye ye claim nahi hai ki log simply
time management mein bure hain — ye attention ke actual mechanism ke
baare mein ek finding hai, jo cognitively demanding tasks ke liye ek
time pe ek cheez ki taraf directed ek selective filter ki tarah
function karta hai, ek resource nahi jise genuinely divide karke
parallel mein chalaya ja sake wahi tarike se jaise ek computer ke
threads.

## Attentional blindness working memory limits se structurally alag phenomenon kyun hai, aur dono design ke liye kyun matter karte hain

Simons aur Chabris ka 1999 "invisible gorilla" experiment ne Lesson 1 ke
working-memory ceiling se alag kuch demonstrate kiya: ye nahi ki
participants ne gorilla ko memory mein hold kiya aur phir bhool gaye —
ek genuine majority ne ise apne visual field mein enter karte hue kabhi
consciously perceive hi nahi kiya, kyunki unka attention poori tarah ek
alag task (passes count karna) ko allocated tha. Iska matlab hai
attention wo gate determine karta hai jise information ko working
memory limits bhi relevant hone se pehle guzarna chahiye — ek perfectly
designed, well-chunked piece of information functionally useless hai
agar ek insaan ka attention pehli jagah uski taraf directed hi nahi
hua.

## Attention ko ek limited resource ki tarah respect karna structural, sirf content, changes design mein kyun chahta hai

Kyunki attention meaningfully split nahi ho sakta, aur ise switch karna
ek real cost incur karta hai, interruption design ke liye practical
implication structural hai: non-urgent interruptions ko natural
task-boundary moments tak batch karna (information available hote hi
fire karne ke bajaye) un costly context-switches ki number kam karta hai
jinse ek insaan force kiya jaata hai, aur genuinely dono task completion
aur interrupting content pe diye gaye attention ki quality ko improve
karta hai. Ye Lesson 1 ki chunking se ek alag lever hai — chunking
information ko ek baar attended hone ke baad process karna aasan banata
hai; attention ko respect karna determine karta hai ki kya, aur kitni
achhi tarah, ye pehli jagah attend hota hai.

## Ye lesson forward Module 14 aur Module 17 se kaise connect karta hai

Is lesson ka attention mechanism wo hai jispe Module 14 (stress aur
high-stakes contexts ke liye design karna) directly build karta hai —
acute stress attention ke already-selective scope ko aur narrow kar
deta hai, gorilla-experiment-style blindness ko aur zyada likely banate
hue exactly tab jab kuch critical miss karna sabse zyada costly hai. Ye
Module 17 ki flow state aur engineering work mein context-switching ki
real cost ki discussion ka bhi direct foundation hai — ek interrupted
developer exactly wahi switching-cost mechanism experience kar raha hai
jise ye lesson establish karta hai, sirf typing time ke kuch seconds
kho nahi raha.`,

    examples: [
      {
        title: 'A notification-batching function that respects attention as a limited resource',
        titleHi: 'Ek notification-batching function jo attention ko ek limited resource ki tarah respect karta hai',
        codeJs: `function classifyNotification(notification, userContext) {
  const URGENT_TYPES = ['security-alert', 'payment-failed', 'data-loss-risk'];

  if (URGENT_TYPES.includes(notification.type)) {
    return { deliverNow: true, reason: 'genuinely urgent — interruption cost is justified' };
  }

  if (userContext.isAtNaturalBreakpoint) {
    // e.g. between form steps, after saving, on a list view rather
    // than mid-edit — a moment where a switch cost is minimal
    return { deliverNow: true, reason: 'user is at a natural task boundary' };
  }

  return { deliverNow: false, reason: 'queue for next natural breakpoint' };
}

function processIncomingNotifications(notifications, userContext) {
  const toDeliverNow = [];
  const toQueue = [];

  for (const n of notifications) {
    const decision = classifyNotification(n, userContext);
    (decision.deliverNow ? toDeliverNow : toQueue).push(n);
  }

  return { toDeliverNow, toQueue };
}`,
        codeTs: `interface Notification {
  type: string;
  id: string;
}

interface UserContext {
  isAtNaturalBreakpoint: boolean;
}

interface ClassificationResult {
  deliverNow: boolean;
  reason: string;
}

function classifyNotification(notification: Notification, userContext: UserContext): ClassificationResult {
  const URGENT_TYPES = ['security-alert', 'payment-failed', 'data-loss-risk'];

  if (URGENT_TYPES.includes(notification.type)) {
    return { deliverNow: true, reason: 'genuinely urgent — interruption cost is justified' };
  }

  if (userContext.isAtNaturalBreakpoint) {
    // e.g. between form steps, after saving, on a list view rather
    // than mid-edit — a moment where a switch cost is minimal
    return { deliverNow: true, reason: 'user is at a natural task boundary' };
  }

  return { deliverNow: false, reason: 'queue for next natural breakpoint' };
}

function processIncomingNotifications(
  notifications: Notification[],
  userContext: UserContext,
): { toDeliverNow: Notification[]; toQueue: Notification[] } {
  const toDeliverNow: Notification[] = [];
  const toQueue: Notification[] = [];

  for (const n of notifications) {
    const decision = classifyNotification(n, userContext);
    (decision.deliverNow ? toDeliverNow : toQueue).push(n);
  }

  return { toDeliverNow, toQueue };
}`,
        code: `function classifyNotification(notification, userContext) {
  if (URGENT_TYPES.includes(notification.type)) return { deliverNow: true };
  if (userContext.isAtNaturalBreakpoint) return { deliverNow: true };
  return { deliverNow: false }; // queue instead of interrupting
}`,
        output:
          "A genuine security alert interrupts immediately regardless of context; a routine 'comment added' notification waits until the user reaches a natural breakpoint (finishing a form, returning to a list view) rather than firing mid-task — reducing the number of costly attention-switches this lesson's mechanism identifies as genuinely harmful.",
        explain:
          "The function explicitly encodes this lesson's central distinction: not all interruptions are equal, and the ones that don't genuinely justify a switching cost should be deferred to a moment where that cost is naturally lower, rather than treated as free simply because the information became available.",
        explainHi:
          "Function explicitly is lesson ki central distinction ko encode karta hai: sab interruptions equal nahi hain, aur wo jo genuinely ek switching cost justify nahi karte unhe ek aise moment tak defer kiya jaana chahiye jahan wo cost naturally kam hai, use free treat karne ke bajaye simply kyunki information available ho gayi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Firing every notification the instant it's generated, regardless
// of whether it's genuinely urgent or the user's current attentional state
function onNewActivity(activity) {
  showNotificationImmediately(activity);
  // A "someone liked your comment" notification interrupts a user
  // mid-way through filling out a complex, high-stakes form — forcing
  // exactly the costly attention-switch this lesson describes, for
  // something that didn't remotely justify it
}`,
        right: `// Distinguishing genuinely urgent interruptions from ones that can
// wait for a natural task boundary
function onNewActivity(activity, userContext) {
  const decision = classifyNotification(activity, userContext);
  if (decision.deliverNow) {
    showNotificationImmediately(activity);
  } else {
    queueForNextBreakpoint(activity);
  }
}`,
        why: "Attention cannot be meaningfully split, and every forced switch incurs a real, measured cost (Rogers & Monsell, 1995). Interrupting a user mid-task for something non-urgent forces this cost for no genuine benefit — the correct default batches non-urgent information to a moment where the switching cost is naturally minimal.",
        whyHi:
          "Attention meaningfully split nahi ho sakta, aur har forced switch ek real, measured cost incur karta hai (Rogers & Monsell, 1995). Ek user ko mid-task kisi non-urgent cheez ke liye interrupt karna is cost ko force karta hai bina kisi genuine benefit ke — correct default non-urgent information ko ek aise moment tak batch karta hai jahan switching cost naturally minimal hai.",
      },
    ],

    realWorld: [
      {
        en: "A production email client deliberately batches non-urgent notification badges and delays their delivery until a user closes their current compose window or returns to the inbox list, specifically because usability research on their own product showed that mid-compose interruptions measurably increased both composition time and error rate — a direct, applied instance of task-switching cost.",
        hi: 'Ek production email client deliberately non-urgent notification badges ko batch karta hai aur unki delivery ko tab tak delay karta hai jab tak ek user apni current compose window band nahi karta ya inbox list pe wapas nahi aata, specifically kyunki apne product pe usability research ne dikhaya ki mid-compose interruptions ne measurably composition time aur error rate dono badhaye — task-switching cost ka ek direct, applied instance.',
      },
    ],

    interviewQA: [
      {
        q: "Why is 'multitasking' on two attention-demanding tasks considered a measurable myth rather than simply an inefficient habit?",
        qHi: "Do attention-demanding tasks pe 'multitasking' ko simply ek inefficient habit ke bajaye ek measurable myth kyun mana jaata hai?",
        a: "Task-switching research (Rogers & Monsell, 1995, and extensive replication since) established that attention functions as a selective filter directed at one thing at a time for cognitively demanding tasks, not a divisible resource. What's perceived as multitasking is actually rapid switching, and each switch incurs a measured cost — time lost re-establishing context, and an elevated error rate on both tasks compared to sequential completion.",
        aHi: 'Task-switching research (Rogers & Monsell, 1995, aur tab se extensive replication) ne establish kiya ki attention cognitively demanding tasks ke liye ek time pe ek cheez ki taraf directed ek selective filter ki tarah function karta hai, ek divisible resource nahi. Jo multitasking ki tarah perceive kiya jata hai actually rapid switching hai, aur har switch ek measured cost incur karta hai — context re-establish karne mein lost time, aur sequential completion ke comparison mein dono tasks pe ek elevated error rate.',
      },
      {
        q: "What did the 'invisible gorilla' experiment demonstrate about attention, and why is it distinct from a working-memory limitation?",
        qHi: "'Invisible gorilla' experiment ne attention ke baare mein kya demonstrate kiya, aur ye ek working-memory limitation se distinct kyun hai?",
        a: "It demonstrated that attention determines whether something is consciously perceived at all, not just how well it's remembered afterward — roughly half of participants fully focused on a counting task never consciously noticed a person in a gorilla suit walking through the scene. This is distinct from a working-memory limit (Lesson 1), which governs how much can be actively held once something has already been attended to.",
        aHi: 'Ise demonstrate kiya ki attention determine karta hai ki kya kuch bhi consciously perceive hota hai, sirf ye nahi ki baad mein kitni achhi tarah yaad rakha jaata hai — ek counting task pe poori tarah focused participants mein se roughly aadhe ne kabhi consciously notice nahi kiya ek gorilla suit mein ek person ko scene ke through chalte hue. Ye ek working-memory limit (Lesson 1) se distinct hai, jo govern karta hai ki ek baar kisi cheez ko already attend kiye jaane ke baad kitna actively hold kiya ja sakta hai.',
      },
    ],

    exercises: [
      {
        task: "A team's product fires a promotional pop-up the instant a user scrolls past a certain point on a page, regardless of what the user is currently doing (reading a long article, filling a form). Using this lesson's mechanism, explain the actual cost this design choice imposes, and propose a rule for when the pop-up should actually fire.",
        taskHi: 'Ek team ka product ek promotional pop-up fire karta hai jaise hi ek user ek page pe ek certain point se aage scroll karta hai, chahe user currently kya kar raha ho (ek lamba article padhna, ek form fill karna). Is lesson ke mechanism ka use karke, explain karo ki ye design choice actually kya cost impose karta hai, aur ek rule propose karo ki pop-up ko actually kab fire karna chahiye.',
        hint: "Consider what a forced attention-switch mid-task costs (Rogers & Monsell's finding), and what a 'natural breakpoint' would look like on this specific page.",
        hintHi: 'Consider karo ki ek forced attention-switch mid-task kya cost karta hai (Rogers & Monsell ki finding), aur is specific page pe ek "natural breakpoint" kaisa dikhega.',
      },
    ],

    keyTakeaways: [
      "Attention functions as a selective filter allocated to one thing at a time for cognitively demanding tasks, not a divisible resource — 'multitasking' on two such tasks is actually rapid, costly switching (Rogers & Monsell, 1995).",
      "Attention determines whether something is consciously perceived at all, not just how well it's processed once noticed — the 'invisible gorilla' experiment demonstrated genuine attentional blindness, distinct from a working-memory limit.",
      "Respecting attention as limited requires structural design changes (batching non-urgent interruptions to natural task boundaries), not just better content formatting.",
      "This lesson's mechanism is the direct foundation for Module 14's stress-and-attention discussion and Module 17's flow-state and context-switching-cost lesson.",
    ],
    keyTakeawaysHi: [
      "Attention cognitively demanding tasks ke liye ek time pe ek cheez ki taraf allocated ek selective filter ki tarah function karta hai, ek divisible resource nahi — do aisi tasks pe 'multitasking' actually rapid, costly switching hai (Rogers & Monsell, 1995).",
      "Attention determine karta hai ki kya kuch bhi consciously perceive hota hai bilkul, sirf ye nahi ki notice hone ke baad kitni achhi tarah process hota hai — 'invisible gorilla' experiment ne genuine attentional blindness demonstrate ki, ek working-memory limit se distinct.",
      "Attention ko limited ki tarah respect karna structural design changes chahta hai (non-urgent interruptions ko natural task boundaries tak batch karna), sirf better content formatting nahi.",
      "Is lesson ka mechanism Module 14 ki stress-and-attention discussion aur Module 17 ke flow-state aur context-switching-cost lesson ka direct foundation hai.",
    ],
  },

  /* ══════════════════════ Lesson 3 ══════════════════════ */
  {
    slug: 'psych-cognitive-load-theory',
    title: 'Cognitive Load Theory — Intrinsic, Extraneous & Germane Load',
    titleHi: 'Cognitive Load Theory — Intrinsic, Extraneous Aur Germane Load',
    description:
      "Closing this module by combining Lessons 1-2 into the single most load-bearing framework for design: cognitive load theory's three-way split of intrinsic (inherent to the task), extraneous (imposed by bad design), and germane (productive learning effort) load — and why only one of these three is worth spending a user's limited capacity on.",
    descriptionHi:
      'Is module ko Lessons 1-2 ko combine karte hue close karna design ke liye single sabse load-bearing framework mein: cognitive load theory ka three-way split intrinsic (task ke liye inherent), extraneous (bad design se imposed), aur germane (productive learning effort) load ka — aur in teen mein se sirf ek user ki limited capacity spend karne layak kyun hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: "**A hiker's limited energy budget for a climb, split between the genuinely necessary effort of the actual elevation gain, the wasted effort of navigating around unnecessary obstacles someone poorly placed on the trail, and the beneficial effort of learning better hiking technique along the way.** A hiker climbing a real mountain has a fixed, limited energy budget for the day. Some of that energy is unavoidably spent on the mountain's actual elevation — the task's genuine, irreducible difficulty, no different regardless of how good the trail is. Separately, if the trail is poorly maintained — badly marked, forcing unnecessary detours around obstacles that could have been cleared — a real chunk of that same limited energy is wasted on difficulty that has nothing to do with the mountain itself and everything to do with poor trail design; removing those obstacles doesn't make the climb easier in some artificial sense, it removes genuinely pointless waste. And separately still, some effort spent noticing footing patterns or breathing technique is entirely worthwhile, building a skill the hiker keeps for future climbs. A person's cognitive capacity working through any task splits exactly this way: INTRINSIC load is the mountain's real elevation — the task's genuine, irreducible complexity. EXTRANEOUS load is the badly-marked trail — complexity imposed by poor design that helps no one and should be removed entirely. GERMANE load is the beneficial technique-building — productive effort that genuinely builds durable understanding. Good design's entire job is eliminating the second kind while never touching the other two.",
      hi: 'Ek hiker ka ek climb ke liye limited energy budget, actual elevation gain ke genuinely necessary effort, kisi ne trail pe poorly place kiye unnecessary obstacles ke around navigate karne ke wasted effort, aur raaste mein better hiking technique seekhne ke beneficial effort ke beech split. Ek real mountain climb kar raha ek hiker ke paas din ke liye ek fixed, limited energy budget hai. Us energy ka kuch hissa unavoidably mountain ki actual elevation pe spend hota hai — task ki genuine, irreducible difficulty, chahe trail kitni bhi achhi ho ye alag nahi. Separately, agar trail poorly maintained hai — badly marked, obstacles ke around unnecessary detours force karte hue jo clear ki ja sakti thi — wahi limited energy ka ek real chunk aisi difficulty pe waste hota hai jiska mountain khud se koi lena-dena nahi aur poor trail design se sab kuch lena-dena hai; un obstacles ko hatana climb ko kisi artificial sense mein aasan nahi banata, ye genuinely pointless waste hatata hai. Aur separately abhi bhi, footing patterns ya breathing technique notice karne mein spent kuch effort poori tarah worthwhile hai, ek skill build karte hue jise hiker future climbs ke liye rakhta hai. Kisi bhi task ke through kaam kar rahi ek insaan ki cognitive capacity exactly is tarike se split hoti hai: INTRINSIC load mountain ki real elevation hai — task ki genuine, irreducible complexity. EXTRANEOUS load badly-marked trail hai — poor design se imposed complexity jo kisi ki help nahi karti aur poori tarah hataayi jaani chahiye. GERMANE load beneficial technique-building hai — productive effort jo genuinely durable understanding build karta hai. Achhe design ka poora kaam doosri kism ko eliminate karna hai kabhi doosre do ko touch kiye bina.',
    },

    simple: `**The three-way split, precisely defined — from John Sweller's
cognitive load theory (1988), the framework that unifies Lessons 1-2:**

\`\`\`
INTRINSIC load — the genuine, irreducible complexity of the task
itself. Calculating a mortgage payment with multiple variables is
inherently more complex than adding two numbers — no amount of good
design removes this difficulty, because it's a real property of the
task, not an artifact of how it's presented.

EXTRANEOUS load — complexity imposed by POOR PRESENTATION of the same
task, contributing nothing to actually solving it. A confusingly
organized form asking for the SAME information as a well-organized one
adds pure extraneous load — this is the ONLY category good design work
should target for elimination.

GERMANE load — the productive mental effort of actually building
understanding, forming durable mental models, or learning a transferable
skill. Working through a well-designed tutorial that builds genuine
understanding is germane load — effortful, but productively so.
\`\`\`

**Why this three-way split resolves an otherwise-confusing design
disagreement — "simpler is always better" vs. "this needs some
friction":**

\`\`\`ts
// A form with confusing labels, inconsistent layout, and no clear
// grouping — PURE EXTRANEOUS LOAD, unrelated to the actual task
// difficulty. This should always be removed.
function badForm() {
  return \`
    <input placeholder="thing1" />
    <input placeholder="val" />
    <input placeholder="the other one" />
  \`; // unclear what each field is FOR — extraneous, not intrinsic
}

// A tax-filing form asking genuinely necessary, unavoidable questions
// about deductions — INTRINSIC load, a property of tax law itself,
// not the form's design. Removing these questions wouldn't simplify
// the form; it would make it produce wrong answers.
function necessarilyComplexForm() {
  return \`
    <label>Mortgage interest deduction (see IRS Schedule A)</label>
    <input name="mortgageInterest" />
    <label>Charitable contribution deduction</label>
    <input name="charitableContributions" />
  \`; // genuinely necessary complexity — good design ORGANIZES this,
     // it cannot ELIMINATE it without producing incorrect results
}
\`\`\`

**The critical, most commonly missed distinction — a task LOOKING
simple is not the same as a task genuinely reducing intrinsic load:**
hiding a form's genuinely necessary fields behind a misleadingly simple
first screen, only to reveal the real complexity later, doesn't reduce
intrinsic load at all — it just moves WHEN the same irreducible
complexity is encountered, and can genuinely increase frustration by
violating the trust an initially-simple appearance created. Real
intrinsic-load reduction only happens by making the underlying task
itself objectively less complex (fewer genuinely necessary decisions,
better defaults reducing what must be actively decided) — not by
hiding complexity and calling it simplicity.

**Why germane load is worth spending capacity on, and why this
matters for anything explicitly educational (like this course
itself):** a tutorial, onboarding flow, or piece of documentation that
eliminates ALL effort — including the productive kind — can produce
someone who completed the steps without genuinely understanding
anything, unable to transfer that "knowledge" to a slightly different
situation. This is why good learning design deliberately preserves
certain productive difficulties (working through a problem rather than
being shown the answer immediately) while still aggressively eliminating
extraneous load (confusing instructions, poor formatting) — the two
target completely different categories of the same finite budget.

**How this lesson closes Module 1 by unifying Lessons 1-2:** intrinsic
load is fundamentally about Lesson 1's working-memory ceiling — how
many genuinely necessary chunks a task requires holding active.
Extraneous load is what happens when Lesson 2's attention gets misspent
on presentation problems instead of the actual task. Cognitive load
theory's real contribution is naming these as three genuinely distinct
categories competing for the exact same finite capacity this module
established — which is precisely why "reduce cognitive load" is
actionable only once you can say which of the three kinds you mean.`,

    simpleHi: `**Three-way split, precisely defined — John Sweller ki cognitive
load theory (1988) se, wo framework jo Lessons 1-2 ko unify karta hai:**

\`\`\`
INTRINSIC load — khud task ki genuine, irreducible complexity. Kai
variables ke saath ek mortgage payment calculate karna inherently do
numbers add karne se zyada complex hai — koi bhi amount of good design
is difficulty ko nahi hatata, kyunki ye task ki ek real property hai,
ise present kaise kiya jata hai uska artifact nahi.

EXTRANEOUS load — wahi task ke POOR PRESENTATION se imposed complexity,
actually ise solve karne mein kuch bhi contribute na karte hue. Ek
confusingly organized form jo wahi information poochta hai jo ek well-
organized wala pure extraneous load add karta hai — ye EKMATRA category
hai jise good design work eliminate karne ke liye target karna chahiye.

GERMANE load — actually understanding build karne, durable mental
models banane, ya ek transferable skill seekhne ka productive mental
effort. Ek well-designed tutorial ke through kaam karna jo genuine
understanding build karta hai germane load hai — effortful, par
productively.
\`\`\`

**Ye three-way split ek otherwise-confusing design disagreement kaise
resolve karta hai — "simpler hamesha better hai" vs. "isko kuch
friction chahiye":**

\`\`\`ts
// Ek form confusing labels, inconsistent layout, aur clear grouping ke
// bina — PURE EXTRANEOUS LOAD, actual task difficulty se unrelated. Ise
// hamesha remove karna chahiye.
function badForm() {
  return \`
    <input placeholder="thing1" />
    <input placeholder="val" />
    <input placeholder="the other one" />
  \`; // unclear ki har field kis LIYE hai — extraneous, intrinsic nahi
}

// Ek tax-filing form jo deductions ke baare mein genuinely necessary,
// unavoidable questions poochta hai — INTRINSIC load, tax law ki khud
// ki ek property, form ke design ki nahi. In questions ko remove karna
// form ko simplify nahi karega; ye ise galat answers produce karwaega.
function necessarilyComplexForm() {
  return \`
    <label>Mortgage interest deduction (see IRS Schedule A)</label>
    <input name="mortgageInterest" />
    <label>Charitable contribution deduction</label>
    <input name="charitableContributions" />
  \`; // genuinely necessary complexity — good design ISE ORGANIZE karta
     // hai, ise incorrect results produce kiye bina ELIMINATE nahi kar sakta
}
\`\`\`

**Critical, sabse commonly missed distinction — ek task ka SIMPLE
DIKHNA wahi cheez nahi hai jo ek task ka genuinely intrinsic load kam
karna:** ek form ke genuinely necessary fields ko ek misleadingly simple
first screen ke peeche chhupaana, sirf real complexity ko baad mein
reveal karne ke liye, intrinsic load ko bilkul kam nahi karta — ye sirf
move karta hai ki wahi irreducible complexity KAB encounter hoti hai,
aur genuinely frustration badha sakta hai us trust ko violate karke jo
ek initially-simple appearance ne create ki. Real intrinsic-load
reduction sirf tab hota hai jab underlying task khud ko objectively kam
complex banaya jaaye (kam genuinely necessary decisions, better defaults
jo kam karte hain jo actively decide karna hai) — complexity ko chhupakar
aur ise simplicity bulane se nahi.

**Germane load capacity spend karne layak kyun hai, aur ye kisi bhi
explicitly educational cheez (jaise ye course khud) ke liye kyun matter
karta hai:** ek tutorial, onboarding flow, ya documentation ka piece jo
SAARA effort eliminate karta hai — productive kism samet — kisi ko
produce kar sakta hai jisne steps complete kiye bina genuinely kuch
samjhe, us "knowledge" ko ek thodi alag situation mein transfer karne
mein unable. Yahi wajah hai good learning design deliberately certain
productive difficulties preserve karta hai (ek problem ke through kaam
karna answer turant dikhaye jaane ke bajaye) jabki abhi bhi aggressively
extraneous load eliminate karta hai (confusing instructions, poor
formatting) — do wahi finite budget ke poori tarah alag categories
target karte hain.

**Ye lesson Lessons 1-2 ko unify karke Module 1 ko kaise close karta
hai:** intrinsic load fundamentally Lesson 1 ki working-memory ceiling
ke baare mein hai — ek task ko kitne genuinely necessary chunks active
hold karne chahiye. Extraneous load wo hai jo hota hai jab Lesson 2 ka
attention actual task ke bajaye presentation problems pe misspent hota
hai. Cognitive load theory ka real contribution inhe teen genuinely
distinct categories ki tarah naam dena hai jo exact wahi finite capacity
ke liye compete karte hain jise ye module ne establish kiya — yahi
exactly wajah hai "cognitive load kam karo" actionable hai sirf ek baar
jab aap keh sako ki teen mein se kaunse kism ka matlab hai.`,

    content: `## Why cognitive load theory's three-way split, rather than a
single "complexity" measure, is the actually useful framework

Sweller's 1988 framework's genuine contribution is refusing to treat
"complexity" as one undifferentiated quantity — because the correct
design response differs entirely depending on which category a given
piece of difficulty falls into. Intrinsic load should be organized and
communicated clearly but not eliminated (since eliminating it produces
incorrect or incomplete results). Extraneous load should be eliminated
entirely, with no tradeoff, since it contributes nothing to the actual
task. Germane load should be deliberately preserved in learning
contexts, since removing it produces completion without understanding.
Treating all difficulty as one thing to minimize collapses these three
genuinely different design responses into one, which is precisely why
"just make it simpler" is often unhelpful, contradictory advice without
this distinction.

## Why "looking simple" and "genuinely reducing intrinsic load" are
different, and confusing them is a common, real design failure

A multi-step wizard that defers a form's genuinely necessary complexity
to later screens doesn't reduce the total intrinsic load a person must
eventually process — the mortgage calculation still requires the same
inputs, the tax form still needs the same information. What it can
genuinely do is reduce load AT ANY GIVEN MOMENT by not requiring all of
it simultaneously (directly applying Lesson 1's chunking mechanism
across time rather than space), which is a real, valid technique — but
it is not the same claim as "this task became less complex," and
presenting it as pure simplification when the same complexity resurfaces
later can produce real frustration from a broken expectation, not
genuine relief.

## Why germane load is not something to eliminate even though it is,
by definition, effortful

A tempting but incorrect reading of "reduce cognitive load" treats all
effort as bad. Germane load is specifically the effort of building a
durable, transferable mental model — struggling productively through a
problem rather than being handed the answer produces genuinely different,
better-retained learning outcomes than passive reception, a well-
replicated finding in learning science (sometimes called desirable
difficulty). This is why this course itself, and any well-designed
educational material, deliberately preserves certain kinds of effort
(exercises without immediately-visible answers, examples requiring the
reader to trace through logic) rather than treating "as easy as possible"
as the universal goal — extraneous load is the enemy; germane load, in
the right context, is the entire point.

## How this lesson closes Module 1 as the unifying framework for
everything that follows

Intrinsic load is fundamentally an application of Lesson 1's working-
memory ceiling — a task's genuine, irreducible chunk count. Extraneous
load is what happens when Lesson 2's limited, selective attention gets
consumed by presentation problems rather than the task itself,
representing pure waste of that same limited resource. Cognitive load
theory's real, actionable contribution is giving these three categories
distinct names, which is precisely what allows every subsequent module
in this course — Module 6's choice architecture, Module 10's interface
design, Module 13's cognitive accessibility — to make a precise claim
("this specific change removes extraneous load without touching
intrinsic load") rather than the vague, often self-contradictory
instruction to simply "make it simpler."`,

    contentHi: `## Cognitive load theory ka three-way split, ek single "complexity" measure ke bajaye, actually useful framework kyun hai

Sweller ke 1988 framework ka genuine contribution "complexity" ko ek
undifferentiated quantity ki tarah treat karne se refuse karna hai —
kyunki correct design response poori tarah is baat pe depend karti hai
ki ek given piece of difficulty kaunsi category mein aata hai. Intrinsic
load ko clearly organize aur communicate kiya jaana chahiye par
eliminate nahi (kyunki ise eliminate karna incorrect ya incomplete
results produce karta hai). Extraneous load ko poori tarah eliminate
kiya jaana chahiye, koi tradeoff ke bina, kyunki ye actual task mein
kuch contribute nahi karta. Germane load ko learning contexts mein
deliberately preserve kiya jaana chahiye, kyunki ise hatana understanding
ke bina completion produce karta hai. Har difficulty ko minimize karne
layak ek cheez ki tarah treat karna in teen genuinely alag design
responses ko ek mein collapse kar deta hai, yahi exactly wajah hai "bas
ise simpler banao" aksar unhelpful, contradictory advice hoti hai is
distinction ke bina.

## "Simple dikhna" aur "genuinely intrinsic load kam karna" alag kyun hain, aur inhe confuse karna ek common, real design failure hai

Ek multi-step wizard jo ek form ki genuinely necessary complexity ko
baad ki screens tak defer karta hai us total intrinsic load ko kam nahi
karta jo ek insaan ko eventually process karni chahiye — mortgage
calculation ko abhi bhi wahi inputs chahiye, tax form ko abhi bhi wahi
information chahiye. Kya ye genuinely kar sakta hai ANY GIVEN MOMENT pe
load kam karna ise ek saath sab kuch require na karte hue (directly
Lesson 1 ke chunking mechanism ko space ke bajaye time ke across apply
karte hue), jo ek real, valid technique hai — par ye "ye task kam
complex ho gaya" wale claim jaisa nahi hai, aur ise pure simplification
ki tarah present karna jab wahi complexity baad mein resurface hoti hai
ek broken expectation se real frustration produce kar sakta hai, genuine
relief nahi.

## Germane load ko eliminate karne layak kuch kyun nahi hai chahe ye, definition se, effortful ho

"Cognitive load kam karo" ka ek tempting par incorrect reading har
effort ko bura treat karta hai. Germane load specifically ek durable,
transferable mental model build karne ka effort hai — ek problem ke
through productively struggle karna answer haath mein diye jaane se
genuinely alag, better-retained learning outcomes produce karta hai
passive reception se, learning science mein ek well-replicated finding
(kabhi kabhi desirable difficulty kaha jata hai). Yahi wajah hai ye
course khud, aur koi bhi well-designed educational material,
deliberately certain kism ka effort preserve karta hai (exercises jinke
answers immediately-visible nahi hain, examples jinhe reader ko logic
ke through trace karna chahiye) "as easy as possible" ko universal goal
ki tarah treat karne ke bajaye — extraneous load enemy hai; germane
load, sahi context mein, poora point hai.

## Ye lesson baaki sab kuch ke liye unifying framework ki tarah Module 1 ko kaise close karta hai

Intrinsic load fundamentally Lesson 1 ki working-memory ceiling ka ek
application hai — ek task ka genuine, irreducible chunk count.
Extraneous load wo hai jo hota hai jab Lesson 2 ka limited, selective
attention presentation problems se consume hota hai actual task ke
bajaye, wahi limited resource ke pure waste ko represent karte hue.
Cognitive load theory ka real, actionable contribution in teen
categories ko distinct names dena hai, jo exactly wo hai jo is course
mein har subsequent module ko — Module 6 ka choice architecture,
Module 10 ka interface design, Module 13 ki cognitive accessibility —
ek precise claim karne deta hai ("ye specific change extraneous load
hatata hai intrinsic load ko touch kiye bina") vague, aksar
self-contradictory instruction ke bajaye simply "ise simpler banao."`,

    examples: [
      {
        title: 'Distinguishing extraneous load (removable) from intrinsic load (organizable but not removable) in the same form',
        titleHi: 'Extraneous load (removable) ko intrinsic load (organizable par removable nahi) se wahi form mein distinguish karna',
        codeJs: `// BEFORE — extraneous load (confusing labels, no grouping) layered
// on top of genuinely necessary intrinsic complexity (tax law requires
// these specific pieces of information)
function taxFormBefore() {
  return \`
    <input placeholder="val1" />       <!-- what IS this? -->
    <input placeholder="ded amt" />     <!-- unclear abbreviation -->
    <input placeholder="the thing2" />  <!-- meaningless label -->
  \`;
}

// AFTER — the SAME intrinsic complexity (three genuinely required tax
// inputs), but extraneous load removed via clear labeling and grouping
function taxFormAfter() {
  return \`
    <fieldset>
      <legend>Mortgage Interest Deduction</legend>
      <label for="mortgageInterest">Total mortgage interest paid this year</label>
      <input id="mortgageInterest" name="mortgageInterest" />
    </fieldset>
    <fieldset>
      <legend>Charitable Contributions</legend>
      <label for="charitable">Total charitable donations (with receipts)</label>
      <input id="charitable" name="charitable" />
    </fieldset>
  \`;
  // Still requires the same three pieces of tax information — the
  // INTRINSIC load is unchanged and cannot be removed without
  // producing an incorrect tax filing. What changed is purely
  // EXTRANEOUS: clarity, labeling, grouping.
}`,
        codeTs: `// BEFORE — extraneous load (confusing labels, no grouping) layered
// on top of genuinely necessary intrinsic complexity (tax law requires
// these specific pieces of information)
function taxFormBefore(): string {
  return \`
    <input placeholder="val1" />       <!-- what IS this? -->
    <input placeholder="ded amt" />     <!-- unclear abbreviation -->
    <input placeholder="the thing2" />  <!-- meaningless label -->
  \`;
}

// AFTER — the SAME intrinsic complexity (three genuinely required tax
// inputs), but extraneous load removed via clear labeling and grouping
function taxFormAfter(): string {
  return \`
    <fieldset>
      <legend>Mortgage Interest Deduction</legend>
      <label for="mortgageInterest">Total mortgage interest paid this year</label>
      <input id="mortgageInterest" name="mortgageInterest" />
    </fieldset>
    <fieldset>
      <legend>Charitable Contributions</legend>
      <label for="charitable">Total charitable donations (with receipts)</label>
      <input id="charitable" name="charitable" />
    </fieldset>
  \`;
  // Still requires the same three pieces of tax information — the
  // INTRINSIC load is unchanged and cannot be removed without
  // producing an incorrect tax filing. What changed is purely
  // EXTRANEOUS: clarity, labeling, grouping.
}`,
        code: `<fieldset>
  <legend>Mortgage Interest Deduction</legend>
  <label for="mortgageInterest">Total mortgage interest paid this year</label>
  <input id="mortgageInterest" name="mortgageInterest" />
</fieldset>`,
        output:
          "Both versions require the exact same three tax-relevant inputs (identical intrinsic load — tax law's actual requirement), but the second version's clear labeling and grouping eliminate the extraneous load of guessing what each cryptic field means — a person's cognitive capacity in the second version is spent entirely on the genuine tax question, not on decoding the form itself.",
        explain:
          "This example demonstrates the lesson's central distinction concretely: the intrinsic complexity (three required tax fields) is held constant across both versions, isolating the change to purely extraneous load — proving the improvement comes from eliminating unnecessary presentation difficulty, not from removing any genuinely required information.",
        explainHi:
          "Ye example is lesson ki central distinction ko concretely demonstrate karta hai: intrinsic complexity (teen required tax fields) dono versions ke across constant rakhi gayi hai, change ko purely extraneous load tak isolate karte hue — prove karte hue ki improvement unnecessary presentation difficulty ko eliminate karne se aata hai, kisi genuinely required information ko hatane se nahi.",
      },
    ],

    mistakes: [
      {
        wrong: `// Treating "reduce cognitive load" as "remove any friction, including
// productive learning effort" — collapsing all three categories into one
function generateTutorial(concept) {
  return \`Here is the concept: \${concept}. Here is the answer to the
practice problem: \${getAnswer(concept)}.\`;
  // Removing the productive struggle of attempting the problem
  // eliminates GERMANE load — the exact category that should be
  // preserved for genuine learning to occur — mistaking it for
  // extraneous load that should be removed`,
        right: `// Distinguishing extraneous load (eliminate: confusing instructions)
// from germane load (preserve: the productive struggle itself)
function generateTutorial(concept) {
  return \`Here is the concept, explained clearly: \${concept}.

Now attempt this practice problem yourself: \${getPracticeProblem(concept)}
(A hint is available if you get stuck, but try first — working through
this productively is how the understanding actually forms.)\`;
  // Extraneous load (unclear explanation) is eliminated by explaining
  // the concept clearly. Germane load (the productive effort of
  // attempting the problem) is deliberately preserved.
}`,
        why: "Cognitive load theory distinguishes extraneous load (pure waste, always worth eliminating) from germane load (productive effort that builds genuine understanding). Removing the productive struggle of a practice problem doesn't reduce harmful complexity — it eliminates the exact mechanism that produces durable learning, mistaking the beneficial category for the harmful one.",
        whyHi:
          "Cognitive load theory extraneous load (pure waste, hamesha eliminate karne layak) ko germane load (productive effort jo genuine understanding build karta hai) se distinguish karta hai. Ek practice problem ke productive struggle ko hatana harmful complexity kam nahi karta — ye exact mechanism eliminate karta hai jo durable learning produce karta hai, beneficial category ko harmful wali samajh kar.",
      },
    ],

    realWorld: [
      {
        en: "A production coding-bootcamp curriculum deliberately keeps its practice exercises' solutions hidden behind an extra click (preserving germane load — the productive struggle of attempting the problem first) while investing heavily in clear, well-formatted problem statements and unambiguous instructions (eliminating extraneous load), specifically because internal data showed students who saw solutions immediately retained measurably less than those who attempted the problem first.",
        hi: 'Ek production coding-bootcamp curriculum deliberately apne practice exercises ke solutions ko ek extra click ke peeche hidden rakhta hai (germane load preserve karte hue — pehle problem attempt karne ka productive struggle) jabki clear, well-formatted problem statements aur unambiguous instructions mein heavily invest karta hai (extraneous load eliminate karte hue), specifically kyunki internal data ne dikhaya ki students jinhone solutions immediately dekhe unhone un se measurably kam retain kiya jinhone pehle problem attempt kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What are the three categories of cognitive load in Sweller\'s theory, and why does the correct design response differ for each?',
        qHi: 'Sweller ki theory mein cognitive load ki teen categories kya hain, aur har ek ke liye correct design response kyun alag hai?',
        a: "Intrinsic load (the task's genuine, irreducible complexity) should be organized clearly but not eliminated, since removing it produces incorrect or incomplete results. Extraneous load (complexity from poor presentation, unrelated to the task) should be eliminated entirely with no tradeoff. Germane load (the productive effort of genuinely building understanding) should be deliberately preserved in learning contexts, since removing it produces completion without comprehension.",
        aHi: 'Intrinsic load (task ki genuine, irreducible complexity) ko clearly organize kiya jaana chahiye par eliminate nahi, kyunki ise hatana incorrect ya incomplete results produce karta hai. Extraneous load (poor presentation se complexity, task se unrelated) ko poori tarah eliminate kiya jaana chahiye koi tradeoff ke bina. Germane load (genuinely understanding build karne ka productive effort) ko learning contexts mein deliberately preserve kiya jaana chahiye, kyunki ise hatana comprehension ke bina completion produce karta hai.',
      },
      {
        q: "Why is making a task 'look simpler' by deferring its complexity to later screens not the same as genuinely reducing intrinsic load?",
        qHi: "Ek task ko 'simpler dikhana' uski complexity ko baad ki screens tak defer karke genuinely intrinsic load kam karne jaisa kyun nahi hai?",
        a: "The task's total genuine, irreducible complexity (its intrinsic load) doesn't change — the same information is still eventually required. What deferring complexity can genuinely achieve is reducing load at any single moment by not requiring it all simultaneously, a valid technique, but a different claim than 'this task became less complex' — presenting deferred complexity as elimination can produce real frustration when it resurfaces.",
        aHi: 'Task ki total genuine, irreducible complexity (uska intrinsic load) nahi badalta — wahi information abhi bhi eventually required hai. Complexity ko defer karna genuinely kya achieve kar sakta hai kisi bhi single moment pe load kam karna hai ise ek saath sab require na karke, ek valid technique, par "ye task kam complex ho gaya" se alag claim — deferred complexity ko elimination ki tarah present karna real frustration produce kar sakta hai jab ye resurface hoti hai.',
      },
    ],

    exercises: [
      {
        task: "A team redesigns a complex insurance-claim form by hiding most fields behind a friendly 'Let's get started!' first screen with only a name field, revealing dozens of required fields across subsequent screens. They market this as 'reducing cognitive load.' Using this lesson's three-way distinction, evaluate this claim precisely.",
        taskHi: 'Ek team ek complex insurance-claim form ko redesign karti hai zyadatar fields ko ek friendly \'Let\'s get started!\' first screen ke peeche chhupate hue sirf ek name field ke saath, subsequent screens ke across dozens of required fields reveal karte hue. Wo ise \'cognitive load kam karna\' ki tarah market karte hain. Is lesson ke three-way distinction use karke, is claim ko precisely evaluate karo.',
        hint: "Ask specifically: did the total intrinsic load (the actual information insurance law/process requires) change at all, or was only the moment-to-moment load redistributed across time?",
        hintHi: 'Specifically poochho: kya total intrinsic load (wo actual information jo insurance law/process require karta hai) bilkul badla, ya sirf moment-to-moment load time ke across redistribute kiya gaya?',
      },
    ],

    keyTakeaways: [
      "Sweller's cognitive load theory splits difficulty into three genuinely distinct categories: intrinsic (the task's real, irreducible complexity — organize, don't eliminate), extraneous (complexity from poor presentation — always eliminate), and germane (productive learning effort — deliberately preserve).",
      "A task 'looking simpler' by deferring complexity to later screens doesn't reduce total intrinsic load — it redistributes when the same required complexity is encountered, a different and more limited claim than genuine simplification.",
      "Germane load should not be eliminated even though it's effortful by definition — removing the productive struggle of learning produces completion without durable, transferable understanding.",
      "This lesson unifies Module 1: intrinsic load applies Lesson 1's working-memory ceiling to a task's genuine complexity, and extraneous load is Lesson 2's limited attention being wasted on presentation rather than the task itself.",
    ],
    keyTakeawaysHi: [
      "Sweller ki cognitive load theory difficulty ko teen genuinely distinct categories mein split karti hai: intrinsic (task ki real, irreducible complexity — organize karo, eliminate nahi), extraneous (poor presentation se complexity — hamesha eliminate karo), aur germane (productive learning effort — deliberately preserve karo).",
      "Ek task ka complexity ko baad ki screens tak defer karke 'simpler dikhana' total intrinsic load kam nahi karta — ye redistribute karta hai ki wahi required complexity kab encounter hoti hai, genuine simplification se ek alag aur zyada limited claim.",
      'Germane load ko eliminate nahi kiya jaana chahiye chahe ye definition se effortful ho — learning ke productive struggle ko hatana durable, transferable understanding ke bina completion produce karta hai.',
      "Ye lesson Module 1 ko unify karta hai: intrinsic load Lesson 1 ki working-memory ceiling ko ek task ki genuine complexity pe apply karta hai, aur extraneous load Lesson 2 ka limited attention hai jo task ke bajaye presentation pe waste ho raha hai.",
    ],
  },
];
