/**
 * DSA Complete Course — Module 3: Hashing, lesson 2.
 *
 * Collision resolution: chaining versus open addressing, the two
 * standard answers to "what happens when two different keys hash to
 * the same bucket?" this course's previous lesson deliberately left
 * open. Broken framing: treating collisions as a bug to be prevented
 * entirely, rather than an expected event to be handled — a hash table
 * whose bucket can only ever hold exactly one entry silently loses data
 * the instant two keys collide, overwriting the first key's value with
 * the second's. Fixed by covering the two standard, correct ways to
 * handle a collision without losing data: chaining (each bucket holds a
 * small list of everything that landed there) and open addressing
 * (a colliding entry is placed in a different, nearby open slot
 * according to a defined probing rule).
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_3_PART2: CourseLesson[] = [
  {
    slug: 'collision-resolution-chaining-open-addressing',
    title: 'Collision Resolution: Chaining and Open Addressing',
    titleHi: 'Collision Resolution: Chaining Aur Open Addressing',
    description: 'A hash table whose bucket array can only hold one entry per slot silently loses data the instant two different keys happen to hash to the same index — the second key\'s insertion quietly overwrites the first key\'s value, with no error, no warning, and no indication anything went wrong at all.',
    descriptionHi: 'Ek hash table jiska bucket array prati-slot sirf ek entry rakh sakta hai chupchaap data khota hai us pal jab do alag keys samyog se usi index par hash hoti hain — doosri key ki insertion chupchaap pehli key ki value ko overwrite kar deti hai, koi error nahi, koi chetaavni nahi, aur koi sanket nahi ki kuch bhi galat hua.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A hotel with exactly one bed per room number, versus a hotel where a room can hold multiple beds, or a hotel where the front desk\'s policy is "if your assigned room is full, we will walk you to the next available room and remember where we sent you."** The one-bed-per-room hotel has no actual PLAN for what happens when two different reservations are assigned to the same room number by its own booking formula — if this happens, whichever guest checks in second either finds the first guest\'s belongings and cannot tell whose room it actually is, or worse, the front desk simply hands over the key and treats the first guest as having never existed, silently losing their reservation entirely. The multiple-beds-per-room hotel has an actual answer: when a room is assigned two reservations, both guests\' beds simply go in the same room, and checking in means checking every bed in that specific room to find the one with your name on it — a small, local list, not a search through the whole hotel. The walk-to-the-next-room hotel has a different but equally valid answer: if a guest\'s assigned room is occupied, the front desk moves them to a specific, predictable NEARBY room according to a fixed rule everyone agrees on (try the next room, then the one after that, and so on), and checking in later means checking that same predictable sequence of rooms until the right one is found. A hash table whose bucket can only ever hold one entry, silently overwriting on collision, is the one-bed-per-room hotel: data is silently lost the moment two keys collide. Chaining (each bucket holds a small list) is the multiple-beds-per-room hotel. Open addressing (a colliding entry moves to a different slot via a fixed rule) is the walk-to-the-next-room hotel — both are genuine, standard, data-safe answers to the exact same question, with real trade-offs between them.',
      hi: '**Ek hotel jismein prati room number bilkul ek bed hai, versus ek hotel jahan ek room kayi beds rakh sakta hai, ya ek hotel jahan front desk ki policy hai "agar tumhaara assigned room bhara hua hai, hum tumhe agle upalabdh room tak le jaayenge aur yaad rakhenge ki humne tumhe kahaan bheja."** Ek-bed-prati-room hotel ke paas koi asli PLAN nahi hai us baare mein jo hota hai jab do alag reservations uski apni booking formula dwara usi room number ko assign ki jaati hain — agar ye hota hai, jo bhi guest doosra check in karta hai ya toh pehle guest ki cheezein paata hai aur ye nahi bata sakta ki asal mein room kiska hai, ya bura, front desk bas chaabi de deta hai aur pehle guest ko aise treat karta hai jaise wo kabhi maujood hi na ho, chupchaap unki reservation poori tarah kho dete hue. Kayi-beds-prati-room hotel ke paas ek asli jawaab hai: jab ek room ko do reservations assign ki jaati hain, dono guests ke beds bas usi room mein jaate hain, aur check in karna matlab hai us khaas room mein har bed check karna apna naam waala dhoondhne ke liye — ek chhoti, local list, poore hotel ke through ek search nahi. Agle-room-tak-chalne-waala hotel ka ek alag par barabar valid jawaab hai: agar ek guest ka assigned room bhara hua hai, front desk unhe ek khaas, predictable NAZDEEKI room mein move karta hai ek fixed rule ke anusaar jispar sab sahmat hain (agla room try karo, phir uske baad wala, waghaira), aur baad mein check in karna matlab hai rooms ke usi predictable sequence ko check karna jab tak sahi wala na mile. Ek hash table jiska bucket kabhi sirf ek entry rakh sakta hai, collision par chupchaap overwrite karte hue, ek-bed-prati-room hotel hai: data chupchaap khota hai us pal jab do keys takraati hain. Chaining (har bucket ek chhoti list rakhta hai) kayi-beds-prati-room hotel hai. Open addressing (ek takraati entry ek fixed rule ke zariye ek alag slot mein move hoti hai) agle-room-tak-chalne-waala hotel hai — dono bilkul usi sawaal ke asli, standard, data-safe jawaab hain, unke beech asli trade-offs ke saath.',
    },

    simple: `**Start broken.** A bucket that can only hold one entry, silently overwriting on collision:

\`\`\`js
class BrokenHashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(undefined); // one SLOT, not a list
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    this.buckets[this.hash(key)] = value; // silently overwrites anything already there
  }
  get(key) {
    return this.buckets[this.hash(key)];
  }
}
\`\`\`

This works correctly right up until two different keys happen to compute the same hash index — this course\'s previous lesson established that collisions are mathematically expected, not rare edge cases. The moment \`"cat"\` and \`"act"\` (an anagram pair, and therefore identical under a hash function that sums character codes) both hash to the same index, calling \`set("act", ...)\` after \`set("cat", ...)\` silently discards \`"cat"\`\'s stored value entirely, with no error and no indication anything was lost — the single \`buckets[index]\` slot can only ever hold one value at a time.

**The fix, option 1: chaining — each bucket holds a small list**

\`\`\`js
class ChainedHashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null).map(() => []); // each slot is a LIST
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((entry) => entry[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]); // collisions coexist in the same bucket's list
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

\`\`\`ts
class ChainedHashTable {
  private buckets: [string, unknown][][];
  private size: number;
  constructor(size: number = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((entry) => entry[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

Each bucket is itself a small array (a "chain") rather than a single value slot, so when \`"cat"\` and \`"act"\` collide, both entries genuinely coexist in the same bucket\'s list — \`set\` checks whether THIS SPECIFIC key already exists within the bucket before deciding to update or append, and \`get\` scans within that one bucket to find the exact matching key, rather than assuming the bucket holds only one thing. No data is ever silently lost, regardless of how many keys collide into the same bucket.`,

    simpleHi: `**Toote hue se shuru.** Ek bucket jo sirf ek entry rakh sakta hai, collision par chupchaap overwrite karte hue:

\`\`\`js
class BrokenHashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(undefined); // ek SLOT, ek list nahi
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    this.buckets[this.hash(key)] = value; // chupchaap jo bhi wahaan hai use overwrite karta hai
  }
  get(key) {
    return this.buckets[this.hash(key)];
  }
}
\`\`\`

Ye sahi tarike se kaam karta hai bilkul us pal tak jab do alag keys samyog se samaan hash index ganti hain — is course ka pehle wala lesson sthaapit karta hai ki collisions mathematically expected hain, durlabh edge cases nahi. Jis pal \`"cat"\` aur \`"act"\` (ek anagram joda, aur isliye identical ek hash function ke neeche jo character codes jodta hai) dono usi index par hash hoti hain, \`set("cat", ...)\` ke baad \`set("act", ...)\` bulaana chupchaap \`"cat"\` ki stored value ko poori tarah discard karta hai, koi error nahi aur koi sanket nahi ki kuch khoya, kyunki akela \`buckets[index]\` slot kabhi ek waqt mein sirf ek value rakh sakta hai.

**Fix, option 1: chaining — har bucket ek chhoti list rakhta hai**

\`\`\`js
class ChainedHashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null).map(() => []); // har slot ek LIST hai
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((entry) => entry[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]); // collisions usi bucket ki list mein saath rehte hain
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

\`\`\`ts
class ChainedHashTable {
  private buckets: [string, unknown][][];
  private size: number;
  constructor(size: number = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((entry) => entry[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

Har bucket khud ek chhota array hai (ek "chain") ek akele value slot ke bajaye, isliye jab \`"cat"\` aur \`"act"\` takraate hain, dono entries sach mein usi bucket ki list mein saath rehte hain — \`set\` check karta hai ki kya YE KHAAS key pehle se bucket ke andar maujood hai update ya append karne ka faisla lene se pehle, aur \`get\` us ek bucket ke andar scan karta hai bilkul mel khaati key dhoondhne ke liye, ye maanne ke bajaye ki bucket sirf ek cheez rakhta hai. Koi bhi data kabhi chupchaap nahi khota, chahe kitni bhi keys usi bucket mein takraayein.`,

    content: `## The fix, option 2: open addressing — probe to the next open slot

\`\`\`js
class OpenAddressingHashTable {
  constructor(size = 16) {
    this.keys = new Array(size).fill(undefined);
    this.values = new Array(size).fill(undefined);
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size; // linear probing: try the next slot
    }
    this.keys[index] = key;
    this.values[index] = value;
  }
  get(key) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) return this.values[index];
      index = (index + 1) % this.size; // follow the same probing sequence
    }
    return undefined;
  }
}
\`\`\`

\`\`\`ts
class OpenAddressingHashTable {
  private keys: (string | undefined)[];
  private values: unknown[];
  private size: number;
  constructor(size: number = 16) {
    this.keys = new Array(size).fill(undefined);
    this.values = new Array(size).fill(undefined);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    let index = this.hash(key);
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size;
    }
    this.keys[index] = key;
    this.values[index] = value;
  }
  get(key: string): unknown {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) return this.values[index];
      index = (index + 1) % this.size;
    }
    return undefined;
  }
}
\`\`\`

Rather than each slot holding a list, open addressing keeps exactly one key and one value per slot, but when \`set\` finds its computed slot already occupied by a DIFFERENT key, it "probes" forward — here, using the simplest probing rule, linear probing, which just tries the very next slot, wrapping back to the start if needed — until it finds either the same key (to update) or a genuinely empty slot (to insert into). \`get\` follows the exact same probing sequence: starting at the key\'s computed hash index, it walks forward through occupied slots, checking each one, until it either finds the matching key or reaches a genuinely empty slot, which means the key was never inserted at all.

## The real trade-offs between chaining and open addressing

\`\`\`
Chaining:
  + simple to reason about; a bucket can grow arbitrarily without
    needing to touch any other bucket
  + performance degrades gracefully as more collisions occur
  - each entry needs extra memory for the list/chain structure itself

Open addressing:
  + all data lives directly in one contiguous array — often better
    performance in practice due to CPU cache behavior
  - deletion is genuinely trickier (removing an entry can break the
    probing sequence for entries that were placed after it)
  - performance can degrade sharply as the table fills up, since probe
    sequences get longer the fewer empty slots remain
\`\`\`

Neither approach is universally "better" — both are genuine, standard, production-used solutions to the exact same problem, and the choice between them is a real engineering trade-off. Chaining is often preferred when simplicity and graceful degradation under heavy collision matter most, and it does not require ever "running out of space" the way open addressing does, since a bucket\'s own chain can simply keep growing. Open addressing is often preferred in performance-critical, memory-constrained contexts, since keeping all data in one contiguous block of memory tends to interact better with how modern CPUs cache data, at the cost of more careful handling required for deletion and a hard ceiling on how full the table can get before performance degrades sharply.

## Why this connects directly to load factor, the subject of the next lesson

Both chaining and open addressing genuinely solve the correctness problem this lesson opened with — neither one silently loses data on a collision — but neither one solves the PERFORMANCE problem that arises when a hash table has far more entries than buckets: chains grow long, and open-addressing probe sequences grow long, in both cases pushing the average lookup cost away from \`O(1)\` and back toward \`O(n)\`. Keeping this from happening is the job of tracking a hash table\'s load factor and resizing the bucket array before it gets too full — the subject this course\'s next lesson covers in full.`,

    contentHi: `## Fix, option 2: open addressing — agle khaali slot tak probe karna

\`\`\`js
class OpenAddressingHashTable {
  constructor(size = 16) {
    this.keys = new Array(size).fill(undefined);
    this.values = new Array(size).fill(undefined);
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size; // linear probing: agla slot try karo
    }
    this.keys[index] = key;
    this.values[index] = value;
  }
  get(key) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) return this.values[index];
      index = (index + 1) % this.size; // wahi probing sequence follow karo
    }
    return undefined;
  }
}
\`\`\`

\`\`\`ts
class OpenAddressingHashTable {
  private keys: (string | undefined)[];
  private values: unknown[];
  private size: number;
  constructor(size: number = 16) {
    this.keys = new Array(size).fill(undefined);
    this.values = new Array(size).fill(undefined);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    let index = this.hash(key);
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size;
    }
    this.keys[index] = key;
    this.values[index] = value;
  }
  get(key: string): unknown {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) return this.values[index];
      index = (index + 1) % this.size;
    }
    return undefined;
  }
}
\`\`\`

Har slot ek list rakhne ke bajaye, open addressing prati slot bilkul ek key aur ek value rakhta hai, par jab \`set\` apna gana gaya slot pehle se ek ALAG key dwara occupied paata hai, ye aage "probe" karta hai — yahaan, sabse saadha probing rule istemal karte hue, linear probing, jo bas bilkul agla slot try karta hai, zaroorat padne par shuru mein wapas wrap karte hue — jab tak ye ya toh wahi key (update karne ke liye) ya ek sach mein khaali slot (insert karne ke liye) nahi paata. \`get\` bilkul wahi probing sequence follow karta hai: key ke gane gaye hash index se shuru hote hue, ye occupied slots ke through aage chalta hai, har ek check karte hue, jab tak ye ya toh mel khaati key paata hai ya ek sach mein khaali slot tak pahunchta hai, jiska matlab hai key kabhi insert hi nahi hui.

## Chaining aur open addressing ke beech asli trade-offs

\`\`\`
Chaining:
  + tark karna aasaan; ek bucket kisi bhi doosre bucket ko chhue bina
    manmaana badh sakta hai
  + performance jaise-jaise collisions hote hain achhi tarah degrade hoti hai
  - har entry ko list/chain structure ke liye khud atirikt memory chahiye

Open addressing:
  + sab data seedhe ek contiguous array mein rehta hai — CPU cache
    vyavahaar ki wajah se practice mein aksar behtar performance
  - deletion sach mein zyaada mushkil hai (ek entry hataana un entries
    ke liye probing sequence tod sakta hai jo iske baad rakhi gayi thi)
  - performance sharply degrade ho sakti hai jaise table bharta hai,
    kyunki probe sequences lambi hoti hain jitne kam khaali slots bachte hain
\`\`\`

Koi bhi approach universal roop se "behtar" nahi hai — dono bilkul usi samasya ke asli, standard, production-istemal-hone-waale solutions hain, aur unke beech chunaav ek asli engineering trade-off hai. Chaining aksar tab pasand kiya jaata hai jab simplicity aur bhaari collision ke neeche achhi degradation sabse zyaada maayne rakhte hain, aur ise kabhi "jagah khatam hone" ki zaroorat nahi hoti jaisa open addressing hoti hai, kyunki ek bucket ki apni chain bas badhti reh sakti hai. Open addressing aksar performance-critical, memory-limited contexts mein pasand ki jaati hai, kyunki sab data ko ek contiguous block memory mein rakhna aksar is baat se behtar interact karta hai ki modern CPUs data ko kaise cache karte hain, deletion ke liye zyaada savdhaan handling ki keemat par aur ek sakht ceiling par ki table kitna bhar sakta hai isse pehle ki performance sharply degrade ho.

## Ye seedhe load factor se kyun judta hai, agle lesson ka vishay

Chaining aur open addressing dono sach mein us correctness samasya ko sulajhaate hain jise is lesson ne shuru mein khola — koi bhi ek collision par chupchaap data nahi khota — par koi bhi us PERFORMANCE samasya ko nahi sulajhaata jo tab uthti hai jab ek hash table mein buckets se kaafi zyaada entries hoti hain: chains lambi ho jaati hain, aur open-addressing probe sequences lambi ho jaati hain, dono cases mein average lookup keemat ko \`O(1)\` se door aur wapas \`O(n)\` ki taraf dhakelte hue. Ise hone se rokna ek hash table ke load factor ko track karne aur bucket array ko bahut bharne se pehle resize karne ka kaam hai — vishay jise is course ka agla lesson poori tarah cover karta hai.`,

    examples: [
      {
        title: 'Broken: one slot per bucket, silently overwriting on collision',
        titleHi: 'Toota: prati bucket ek slot, collision par chupchaap overwrite',
        code: `set(key, value) {
  this.buckets[this.hash(key)] = value; // overwrites silently on collision
}`,
        codeJs: `class BrokenHashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(undefined);
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    this.buckets[this.hash(key)] = value;
  }
  get(key) {
    return this.buckets[this.hash(key)];
  }
}
// "cat" and "act" hash identically (same characters) — the second
// set() call silently destroys the first key's value`,
        codeTs: `class BrokenHashTable {
  private buckets: unknown[];
  private size: number;
  constructor(size: number = 16) {
    this.buckets = new Array(size).fill(undefined);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    this.buckets[this.hash(key)] = value;
  }
  get(key: string): unknown {
    return this.buckets[this.hash(key)];
  }
}`,
        output: `set("cat", 1); set("act", 2); get("cat") returns 2, not 1 — "cat"'s
value was silently overwritten, with no error or warning at all.`,
        explain: 'A single-value slot per bucket has no way to distinguish which key it currently holds, so a colliding second key silently destroys the first key\'s value.',
        explainHi: 'Prati bucket ek-value slot ke paas ye alag karne ka koi tarika nahi hai ki abhi ye kaunsi key rakhta hai, isliye ek takraati doosri key chupchaap pehli key ki value nasht kar deti hai.',
      },
      {
        title: 'Fixed with chaining: each bucket holds a small list',
        titleHi: 'Chaining se theek: har bucket ek chhoti list rakhta hai',
        code: `const bucket = this.buckets[this.hash(key)]; // an array, not a single slot
const existing = bucket.find((e) => e[0] === key);
if (existing) existing[1] = value; else bucket.push([key, value]);`,
        codeJs: `class ChainedHashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((entry) => entry[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}`,
        codeTs: `class ChainedHashTable {
  private buckets: [string, unknown][][];
  private size: number;
  constructor(size: number = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((entry) => entry[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}`,
        outputJs: `set("cat", 1); set("act", 2); get("cat") correctly still returns 1,
and get("act") correctly returns 2 — both coexist in the same
bucket's list, with neither overwriting the other.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Because each bucket holds a list rather than a single value, both colliding keys are stored side by side, and set correctly checks for the specific key before overwriting anything.',
        explainHi: 'Kyunki har bucket ek akeli value ke bajaye ek list rakhta hai, dono takraati keys saath-saath store hoti hain, aur \`set\` kuch bhi overwrite karne se pehle sahi tarike se khaas key check karta hai.',
      },
      {
        title: 'Fixed with open addressing: probing to the next open slot',
        titleHi: 'Open addressing se theek: agle khaali slot tak probing',
        code: `let index = this.hash(key);
while (this.keys[index] !== undefined && this.keys[index] !== key) {
  index = (index + 1) % this.size;
}`,
        codeJs: `class OpenAddressingHashTable {
  constructor(size = 16) {
    this.keys = new Array(size).fill(undefined);
    this.values = new Array(size).fill(undefined);
    this.size = size;
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key, value) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size;
    }
    this.keys[index] = key;
    this.values[index] = value;
  }
  get(key) {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) return this.values[index];
      index = (index + 1) % this.size;
    }
    return undefined;
  }
}`,
        codeTs: `class OpenAddressingHashTable {
  private keys: (string | undefined)[];
  private values: unknown[];
  private size: number;
  constructor(size: number = 16) {
    this.keys = new Array(size).fill(undefined);
    this.values = new Array(size).fill(undefined);
    this.size = size;
  }
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }
  set(key: string, value: unknown): void {
    let index = this.hash(key);
    while (this.keys[index] !== undefined && this.keys[index] !== key) {
      index = (index + 1) % this.size;
    }
    this.keys[index] = key;
    this.values[index] = value;
  }
  get(key: string): unknown {
    let index = this.hash(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) return this.values[index];
      index = (index + 1) % this.size;
    }
    return undefined;
  }
}`,
        outputJs: `set("cat", 1); set("act", 2); get("cat") correctly returns 1 and
get("act") correctly returns 2 — "act" was probed into the next
open slot rather than overwriting "cat"'s slot.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Both set and get follow the exact same probing sequence, so a colliding key is consistently placed in, and later found at, a different slot than the one that was already occupied.',
        explainHi: '\`set\` aur \`get\` dono bilkul wahi probing sequence follow karte hain, isliye ek takraati key consistently ek alag slot mein rakhi jaati hai, aur baad mein wahaan paayi jaati hai, us se jo pehle se occupied tha.',
      },
    ],

    mistakes: [
      {
        wrong: `this.buckets[this.hash(key)] = value;
// a single-value slot, silently overwritten on collision`,
        right: `const bucket = this.buckets[this.hash(key)]; // a list
bucket.push([key, value]); // or update the existing entry for this key`,
        why: 'A hash table\'s bucket must be able to hold more than one entry, since collisions are mathematically expected — a single-value slot silently loses data the instant two keys collide.',
        whyHi: 'Ek hash table ka bucket ek se zyaada entry rakhne mein saksham hona chahiye, kyunki collisions mathematically expected hain — ek akeli-value slot chupchaap data khota hai us pal jab do keys takraati hain.',
      },
      {
        wrong: `// treating collisions as a rare bug to eliminate entirely
// (e.g. by trying to design a "perfect" hash function with zero collisions)`,
        right: `// designing the hash table to handle collisions correctly
// (via chaining or open addressing), since some collisions are
// mathematically unavoidable with a finite number of buckets`,
        why: 'With more possible keys than available buckets, some collisions are guaranteed by the pigeonhole principle — the correct engineering response is handling them safely, not trying to prevent them entirely.',
        whyHi: 'Upalabdh buckets se zyaada sambhaavit keys ke saath, kuch collisions pigeonhole principle dwara guaranteed hain — sahi engineering jawaab unhe surakshit roop se handle karna hai, unhe poori tarah rokne ki koshish karna nahi.',
      },
      {
        wrong: `// removing an entry from an open-addressing table by simply
// setting its slot back to "empty"`,
        right: `// marking a removed slot as a special "deleted" marker, distinct
// from "never used", so probing sequences for OTHER keys placed
// after it are not incorrectly broken`,
        why: 'In open addressing, marking a removed slot as plainly "empty" can incorrectly break the probing sequence for a different key that was placed further along that same sequence — a genuinely tricky, real implementation detail.',
        whyHi: 'Open addressing mein, ek hataaye gaye slot ko saadhe "khaali" ki tarah maarka karna ek doosri key ke liye probing sequence ko galat tarike se tod sakta hai jo usi sequence mein aage rakhi gayi thi — ek sach mein mushkil, asli implementation detail.',
      },
    ],

    realWorld: [
      {
        en: '**Java\'s HashMap uses chaining internally (with a further optimization converting long chains into balanced trees), while Python\'s dict uses open addressing** — both are real, production, widely used implementations choosing different, valid answers to the same trade-off.',
        hi: '**Java ka \`HashMap\` internally chaining istemal karta hai (ek aur optimization ke saath jo lambi chains ko balanced trees mein badalti hai), jabki Python ka \`dict\` open addressing istemal karta hai** — dono asli, production, widely used implementations hain jo usi trade-off ke alag, valid jawaab chunte hain.',
      },
      {
        en: '**"How would you handle a hash collision?" is a genuinely standard technical interview question**, specifically testing whether a candidate knows collisions are expected and understands at least one correct way to handle them.',
        hi: '**"Ek hash collision ko tum kaise handle karoge?" ek sach mein standard technical interview sawaal hai**, khaas taur par ye test karte hue ki kya ek candidate jaanta hai collisions expected hain aur unhe handle karne ka kam se kam ek sahi tarika samajhta hai.',
      },
      {
        en: '**Deletion in an open-addressing hash table being genuinely trickier than insertion is a well-documented, real implementation challenge**, not an exaggeration for teaching purposes.',
        hi: '**Ek open-addressing hash table mein deletion ka insertion se sach mein zyaada mushkil hona ek achhi tarah documented, asli implementation chunauti hai**, teaching maksad ke liye ek baddhaayi hui baat nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a hash collision an expected, unavoidable event rather than a sign of a poorly designed hash function, and what does a correct hash table implementation need to do about it?',
        qHi: 'Ek hash collision ek expected, bachne-yogya-na-event kyun hai ek kharaab design ki gayi hash function ka sanket ke bajaye, aur ek sahi hash table implementation ko iske baare mein kya karna chahiye?',
        a: 'A hash table\'s bucket array necessarily has a finite, fixed number of slots, while the space of possible keys that could theoretically be inserted is typically vastly larger, and often unbounded, than that fixed number of buckets — a hash table backed by 16 buckets can theoretically be asked to store far more than 16 distinct keys over its lifetime. By the pigeonhole principle, if there are more possible keys than available buckets, it is mathematically guaranteed that at least some pair of distinct keys will compute to the exact same bucket index under any given hash function, no matter how carefully that hash function is designed. This means collisions are not evidence of a flaw in the hash function specifically; they are an unavoidable mathematical consequence of mapping a larger space of possible inputs onto a smaller, fixed space of buckets. Given this, a correctly designed hash table cannot simply assume collisions will not happen, or treat them as an error case to reject — it must have an actual, defined mechanism for correctly storing and later retrieving multiple keys that happen to share the same bucket index, without losing any of their associated data. The two standard, correct mechanisms for this are chaining, where each bucket itself holds a small list capable of storing more than one key-value pair, and open addressing, where a colliding key is instead placed into a different, nearby slot according to a fixed, agreed-upon rule that both insertion and lookup follow consistently. A hash table implementation that instead allows a bucket to hold only a single value, silently overwriting whatever was there before whenever a new key happens to collide with an existing one, is not merely handling a rare edge case poorly — it is fundamentally broken, since it will predictably and silently lose data as soon as the hash table is used at any realistic scale.',
        aHi: 'Ek hash table ke bucket array mein zaroori roop se ek seemit, fixed tadaad ke slots hote hain, jabki sambhaavit keys ki jagah jo theoretically insert ki jaa sakti hai aksar us fixed tadaad ke buckets se bahut zyaada badi hoti hai, aur aksar unbounded, hoti hai — 16 buckets se backed ek hash table se theoretically apni umr mein 16 se kaafi zyaada alag keys store karne ko poocha jaa sakta hai. Pigeonhole principle dwara, agar upalabdh buckets se zyaada sambhaavit keys hain, ye mathematically guaranteed hai ki kam se kam alag keys ki koi jodi kisi bhi diye gaye hash function ke neeche bilkul samaan bucket index ganegi, chahe wo hash function kitni bhi savdhaani se design kiya gaya ho. Iska matlab hai collisions khaas taur par hash function mein ek kharaabi ka saboot nahi hain; wo sambhaavit inputs ki ek badi jagah ko buckets ki ek chhoti, fixed jagah par map karne ka ek bachne-yogya-na mathematical parinaam hain. Ise dekhte hue, ek sahi tarike se design ki gayi hash table simply ye nahi maan sakti ki collisions nahi honge, ya unhe ek error case ki tarah reject karne ke liye treat nahi kar sakti — iske paas ek asli, define kiya gaya mechanism hona chahiye kayi keys ko sahi tarike se store aur baad mein retrieve karne ke liye jo samyog se samaan bucket index share karti hain, unke associated data mein se kuch bhi khoye bina. Iske liye do standard, sahi mechanisms chaining hain, jahan har bucket khud ek chhoti list rakhta hai jo ek se zyaada key-value pair store karne mein saksham hai, aur open addressing, jahan ek takraati key iske bajaye ek alag, nazdeeki slot mein rakhi jaati hai ek fixed, sahmat rule ke anusaar jise insertion aur lookup dono consistently follow karte hain. Ek hash table implementation jo iske bajaye ek bucket ko sirf ek akeli value rakhne deta hai, chupchaap jo bhi pehle wahaan tha use overwrite karte hue jab bhi ek nayi key samyog se ek maujood key se takraati hai, sirf ek durlabh edge case ko kharaab tarike se handle nahi kar raha — ye buniyaadi roop se toota hai, kyunki ye predictably aur chupchaap data khoyega jaise hi hash table kisi bhi waastavik scale par istemal ki jaati hai.',
      },
      {
        q: 'What are the genuine trade-offs between chaining and open addressing as collision-resolution strategies, and why is neither one universally the "correct" choice?',
        qHi: 'Chaining aur open addressing ke beech collision-resolution strategies ki tarah asli trade-offs kya hain, aur inmein se koi bhi universal roop se "sahi" chunaav kyun nahi hai?',
        a: 'Chaining\'s core advantage is its conceptual simplicity and graceful degradation: since each bucket independently manages its own small list, a bucket that happens to receive many colliding keys simply grows longer, without requiring any coordination with or effect on any other bucket, and there is no hard ceiling on how many entries the table as a whole can hold, since chains can, in principle, keep growing indefinitely. Its cost is that each individual entry requires additional memory beyond just the key and value themselves, to support the list or chain structure connecting entries within the same bucket. Open addressing\'s core advantage is that all of a hash table\'s data lives directly within one single, contiguous block of memory, with no separate list structures needed per bucket, which in practice often performs better than chaining due to how modern computer hardware caches memory — accessing contiguous memory tends to be faster than following separate list pointers scattered around memory. Its costs are twofold and genuinely significant: deletion is meaningfully trickier to implement correctly, since simply marking a slot as empty after removing its entry can incorrectly break the probing sequence that a different key, placed into a later slot because this one was occupied at the time, depends on to be found again; and performance can degrade sharply, rather than gracefully, as the table fills up, since probe sequences (the number of slots that must be checked before finding an empty one or the target key) tend to grow rapidly once a large fraction of the available slots are already occupied. Neither approach dominates the other across every situation — chaining is often favored when simplicity of implementation and predictable degradation under heavy collision matter most, while open addressing is often favored in performance-critical or memory-constrained contexts willing to accept the added complexity around deletion and the need to keep the table\'s fill level below a certain threshold. Real, production systems make both choices: this is a genuine engineering trade-off decided based on a system\'s specific priorities, not a settled question with one universally correct answer.',
        aHi: 'Chaining ka core faayda iski conceptual saadgi aur achhi degradation hai: kyunki har bucket azaadi se apni chhoti list manage karta hai, ek bucket jo samyog se kayi takraati keys paata hai bas lambi ho jaata hai, kisi bhi doosre bucket ke saath coordination ya asar ki zaroorat ke bina, aur koi sakht ceiling nahi hai ki poori table kitni entries rakh sakti hai, kyunki chains, siddhaant mein, hamesha ke liye badhti reh sakti hain. Iski keemat ye hai ki har akeli entry ko sirf key aur value se aage atirikt memory chahiye, us list ya chain structure ko support karne ke liye jo usi bucket ke andar entries ko jodta hai. Open addressing ka core faayda ye hai ki ek hash table ka sab data seedhe ek akele, contiguous memory ke block mein rehta hai, prati bucket koi alag list structures ki zaroorat nahi, jo practice mein aksar chaining se behtar perform karta hai is baat ki wajah se ki modern computer hardware memory ko kaise cache karta hai — contiguous memory ko access karna aksar memory mein bikhri alag list pointers ko follow karne se tez hota hai. Iski keemat do-taraffa aur sach mein mahatvapoorn hain: deletion ko sahi tarike se lagu karna maayne-yogya roop se zyaada mushkil hai, kyunki iski entry hataane ke baad ek slot ko simply khaali maarka karna ek doosri key ke liye probing sequence ko galat tarike se tod sakta hai jo, ek baad ke slot mein rakhi gayi kyunki ye us waqt occupied tha, dobara mile jaane ke liye ispar nirbhar karti hai; aur performance sharply, achhi tarah nahi, degrade ho sakti hai jaise table bharta hai, kyunki probe sequences (khaali ek dhoondhne ya target key milne se pehle jitne slots check kiye jaane chahiye) tezi se badhne ki jhukaav rakhte hain ek baar upalabdh slots ka ek bada hissa pehle se occupied ho. Koi bhi approach doosre par har sthiti mein havi nahi hota — chaining aksar tab favor ki jaati hai jab implementation ki saadgi aur bhaari collision ke neeche predictable degradation sabse zyaada maayne rakhte hain, jabki open addressing aksar performance-critical ya memory-limited contexts mein favor ki jaati hai jo deletion ke aas-paas jodi gayi complexity aur table ki fill level ko ek khaas threshold se neeche rakhne ki zaroorat sweekaar karne ko taiyaar hain. Asli, production systems dono chunaav karte hain: ye ek asli engineering trade-off hai jo ek system ki khaas priorities ke aadhaar par tay kiya jaata hai, ek suljha hua sawaal nahi jiska ek universal roop se sahi jawaab ho.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken single-slot hash table from this lesson. Insert "cat" then "act" (which hash identically under a character-code-sum hash function), and confirm the first value is silently lost.',
        taskHi: 'Is lesson ka toota single-slot hash table banao. \`"cat"\` phir \`"act"\` insert karo (jo ek character-code-sum hash function ke neeche identical hash hote hain), aur confirm karo ki pehli value chupchaap kho jaati hai.',
        hint: 'Confirm both strings genuinely hash to the same index first, by calling the hash function directly on both, before testing set/get.',
        hintHi: 'Pehle confirm karo ki dono strings sach mein usi index par hash hoti hain, hash function ko dono par seedhe bulaake, \`set\`/\`get\` test karne se pehle.',
      },
      {
        task: 'Build the chaining-based fix from this lesson. Insert several colliding keys into the same bucket and inspect the bucket\'s contents directly to confirm all of them coexist correctly.',
        taskHi: 'Is lesson ka chaining-based fix banao. Kayi takraati keys usi bucket mein insert karo aur seedhe bucket ki contents inspect karo confirm karne ke liye ki wo sab sahi tarike se saath rehte hain.',
        hint: 'Log the specific bucket array (this.buckets[hash(key)]) directly after inserting several colliding keys to see every entry it holds.',
        hintHi: 'Kayi takraati keys insert karne ke baad seedhe khaas bucket array (\`this.buckets[hash(key)]\`) log karo har entry dekhne ke liye jo ye rakhta hai.',
      },
      {
        task: 'Build the open-addressing fix from this lesson. Insert three keys that all hash to the same initial index, then trace by hand which actual slot each one ends up in, following the linear-probing rule.',
        taskHi: 'Is lesson ka open-addressing fix banao. Teen keys insert karo jo sab samaan shuruaati index par hash hoti hain, phir haath se trace karo ki har ek asal mein kaunse slot mein khatam hota hai, linear-probing rule follow karte hue.',
        hint: 'Log the index each key actually ends up stored at (not just the initial hash) to confirm your hand trace against the code\'s actual behavior.',
        hintHi: 'Wo index log karo jahan har key asal mein store hone mein khatam hoti hai (sirf shuruaati hash nahi) apne haath-se-trace ko code ke asli vyavahaar ke khilaaf confirm karne ke liye.',
      },
    ],

    keyTakeaways: [
      'A hash collision (two different keys hashing to the same bucket index) is mathematically expected, not a sign of a poorly designed hash function — it follows directly from the pigeonhole principle.',
      'A hash table bucket that can only hold a single value silently loses data the instant two keys collide, overwriting the first key\'s value with the second\'s.',
      'Chaining resolves collisions by letting each bucket hold a small list, so multiple colliding entries coexist and are distinguished by checking each one\'s actual key.',
      'Open addressing resolves collisions by probing to a different, nearby slot according to a fixed rule (like linear probing), which both insertion and lookup must follow consistently.',
      'Neither chaining nor open addressing is universally better — chaining favors simplicity and graceful degradation, while open addressing favors cache-friendly memory layout at the cost of trickier deletion.',
      'Both collision-resolution strategies solve correctness (no lost data) but not performance — long chains or long probe sequences still degrade average lookup cost, which is what tracking load factor and resizing (this course\'s next lesson) addresses.',
    ],
    keyTakeawaysHi: [
      'Ek hash collision (do alag keys jo usi bucket index par hash hoti hain) mathematically expected hai, ek kharaab design ki gayi hash function ka sanket nahi — ye seedhe pigeonhole principle se aata hai.',
      'Ek hash table bucket jo sirf ek akeli value rakh sakta hai chupchaap data khota hai us pal jab do keys takraati hain, pehli key ki value ko doosri se overwrite karte hue.',
      'Chaining collisions ko sulajhaata hai har bucket ko ek chhoti list rakhne dekar, taaki kayi takraati entries saath rehti hain aur har ek ki asli key check karke alag ki jaati hain.',
      'Open addressing collisions ko sulajhaata hai ek alag, nazdeeki slot tak probe karke ek fixed rule ke anusaar (jaisa linear probing), jise insertion aur lookup dono consistently follow karne chahiye.',
      'Na chaining na open addressing universal roop se behtar hai — chaining saadgi aur achhi degradation favor karta hai, jabki open addressing cache-friendly memory layout favor karta hai zyaada mushkil deletion ki keemat par.',
      'Dono collision-resolution strategies correctness sulajhaati hain (koi kho hua data nahi) par performance nahi — lambi chains ya lambe probe sequences abhi bhi average lookup keemat ko degrade karte hain, jo load factor track karna aur resize karna (is course ka agla lesson) sambodhit karta hai.',
    ],
  },
];
