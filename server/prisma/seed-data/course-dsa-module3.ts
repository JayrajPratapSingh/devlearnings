/**
 * DSA Complete Course — Module 3: Hashing, lesson 1.
 *
 * How a hash table actually achieves O(1) average lookup internally —
 * this course's Module 1 first lesson already showed that a Map beats
 * a linear scan, but treated it as a black box; this lesson opens that
 * box. Broken example: a hand-rolled "dictionary" backed by a plain
 * array of [key, value] pairs, found via a linear scan — genuinely
 * correct, and exactly the same shape as this course's very first
 * lesson's broken example, but built here specifically to be taken
 * apart and rebuilt into a real hash table. Fixed by adding a hash
 * function that converts a key directly into a numeric bucket index,
 * so a lookup computes exactly where to look rather than scanning to
 * find out — with a second, deliberately bad hash function shown
 * immediately after to preview why an uneven hash function can quietly
 * degrade this same structure back toward linear-scan behavior, setting
 * up this module's next lesson on collision resolution.
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

export const DSA_MODULE_3: CourseLesson[] = [
  {
    slug: 'hash-tables-how-they-work',
    title: 'Hash Tables: How They Actually Work Internally',
    titleHi: 'Hash Tables: Ye Asal Mein Internally Kaise Kaam Karte Hain',
    description: 'This course\'s very first lesson showed that a Map beats a linear scan for looking up a student by ID, treating Map as a trusted black box. This lesson opens that box: a hash table is not magic — it is a plain array, plus one small function that decides exactly where in that array each key belongs.',
    descriptionHi: 'Is course ke bilkul pehle lesson ne darsaaya ki ek Map ek student ko ID se dhoondhne ke liye linear scan se behtar hai, \`Map\` ko ek bharosemand black box maankar. Ye lesson us box ko kholta hai: ek hash table jaadu nahi hai — ye ek saadha array hai, plus ek chhota function jo bilkul tay karta hai ki us array mein har key kahaan belong karti hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A coat check where every coat is simply hung on the nearest available hook in the order it arrives, so retrieving any specific coat later means checking hooks one by one until the right one turns up — versus a coat check where the attendant computes a specific hook number directly from your name using a fixed formula, hangs your coat on exactly that hook, and retrieves it later by running the exact same formula and walking straight there.** In the arrive-in-order coat check, finding a specific coat among a thousand others requires checking hooks one at a time, since nothing about where a coat ended up relates to whose coat it is — the only way to know is to look, and in the worst case, that means checking every single hook. In the formula-based coat check, the attendant never needs to search at all: your name is fed into the same fixed formula both when your coat is hung up and when it is retrieved, producing the exact same hook number both times, so retrieval is a direct walk to one specific hook, not a search through any of them. A plain array of key-value pairs, found via a linear scan, is the arrive-in-order coat check — correct, but every lookup costs a search proportional to how many coats are already hung. A hash table is the formula-based coat check: a hash function takes a key and computes, directly, the exact bucket index that key belongs in, both when inserting and when looking up, turning what would otherwise be a search into a direct computation.',
      hi: '**Ek coat check jahan har coat bas nazdeeki upalabdh hook par latkaaya jaata hai jis order mein wo aata hai, isliye baad mein kisi khaas coat ko retrieve karna matlab hooks ko ek-ek karke check karna jab tak sahi wala na mile — versus ek coat check jahan attendant seedhe tumhaare naam se ek fixed formula istemal karke ek khaas hook number ganta hai, tumhaara coat bilkul us hook par latkaata hai, aur baad mein isse bilkul wahi formula chalaake aur seedhe wahaan chalke retrieve karta hai.** Aane-ke-order-mein coat check mein, ek hazaar mein se ek khaas coat dhoondhna hooks ko ek-ek karke check karna maangta hai, kyunki ek coat kahaan khatam hua iske baare mein kuch bhi ye nahi darsata ki wo kiska coat hai — jaanne ka akela tarika dekhna hai, aur sabse bure case mein, iska matlab hai har akela hook check karna. Formula-based coat check mein, attendant ko kabhi khoj karne ki zaroorat hi nahi hoti: tumhaara naam usi fixed formula mein daala jaata hai dono jab tumhaara coat latkaaya jaata hai aur jab ise retrieve kiya jaata hai, dono baar bilkul wahi hook number banaate hue, isliye retrieval ek seedha chalna hai ek khaas hook tak, unmein se kisi ke through ek khoj nahi. Key-value pairs ka ek saadha array, ek linear scan ke zariye dhoondha gaya, aane-ke-order-mein coat check hai — sahi, par har lookup ek khoj kharch karta hai jo isse anupaatik hai ki pehle se kitni coats latki hain. Ek hash table formula-based coat check hai: ek hash function ek key leta hai aur seedhe ganta hai, bilkul us bucket index ko jismein wo key belong karti hai, dono jab insert kiya jaata hai aur jab lookup kiya jaata hai, wo cheez badalte hue jo anyatha ek khoj hoti ek seedhe computation mein.',
    },

    simple: `**Start broken.** A hand-rolled "dictionary" backed by a plain array, found via linear scan:

\`\`\`js
class SlowDictionary {
  constructor() {
    this.entries = []; // an array of [key, value] pairs
  }

  set(key, value) {
    for (const entry of this.entries) {
      if (entry[0] === key) { entry[1] = value; return; }
    }
    this.entries.push([key, value]);
  }

  get(key) {
    for (const entry of this.entries) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
\`\`\`

This is genuinely correct — \`get\` and \`set\` both work exactly as expected. This is, deliberately, the exact same shape as this course\'s very first lesson: finding a key requires scanning the \`entries\` array, one pair at a time, until a match is found (or the end is reached), costing \`O(n)\` in the worst case for both \`get\` and \`set\`. This lesson takes this specific structure apart to show what actually needs to change to turn it into a real hash table.

**The fix: a hash function that computes exactly where a key belongs**

\`\`\`js
class HashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }

  hash(key) { // converts a key into a valid index into this.buckets
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }

  set(key, value) {
    const index = this.hash(key); // compute WHERE, don't search for it
    this.buckets[index].push([key, value]);
  }

  get(key) {
    const index = this.hash(key); // same computation, same destination
    const bucket = this.buckets[index];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
\`\`\`

\`\`\`ts
class HashTable {
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
    const index = this.hash(key);
    this.buckets[index].push([key, value]);
  }

  get(key: string): unknown {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
\`\`\`

\`hash(key)\` is the entire idea: it takes a key and computes a number — here, by summing each character\'s numeric code and taking the remainder when divided by the table\'s size — that is guaranteed to be a valid index into \`this.buckets\`. Both \`set\` and \`get\` call the exact same \`hash\` function on the exact same key, so they always agree on which bucket a given key belongs in. \`get\` no longer needs to search the ENTIRE table — it computes the one bucket the key must be in, and only scans within that single, typically small bucket, rather than every entry ever inserted.`,

    simpleHi: `**Toote hue se shuru.** Ek haath se banaayi gayi "dictionary" ek saadhe array se backed, linear scan ke zariye dhoondhi gayi:

\`\`\`js
class SlowDictionary {
  constructor() {
    this.entries = []; // [key, value] pairs ka ek array
  }

  set(key, value) {
    for (const entry of this.entries) {
      if (entry[0] === key) { entry[1] = value; return; }
    }
    this.entries.push([key, value]);
  }

  get(key) {
    for (const entry of this.entries) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
\`\`\`

Ye sach mein sahi hai — \`get\` aur \`set\` dono bilkul waisa kaam karte hain jaisa ummeed hai. Ye, jaan-boojhkar, is course ke bilkul pehle lesson jaisi shape hai: ek key dhoondhna \`entries\` array ko scan karna maangta hai, ek waqt mein ek joda, jab tak ek match na mile (ya ant na aa jaaye), sabse bure case mein \`get\` aur \`set\` dono ke liye \`O(n)\` kharch karte hue. Ye lesson is khaas structure ko alag karta hai ye dikhaane ke liye ki ise ek asli hash table mein badalne ke liye asal mein kya badalna chahiye.

**Fix: ek hash function jo bilkul ganta hai ki ek key kahaan belong karti hai**

\`\`\`js
class HashTable {
  constructor(size = 16) {
    this.buckets = new Array(size).fill(null).map(() => []);
    this.size = size;
  }

  hash(key) { // ek key ko this.buckets mein ek valid index mein badalta hai
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.size;
  }

  set(key, value) {
    const index = this.hash(key); // KAHAAN gino, ise khojne ke bajaye
    this.buckets[index].push([key, value]);
  }

  get(key) {
    const index = this.hash(key); // wahi computation, wahi destination
    const bucket = this.buckets[index];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
\`\`\`

\`\`\`ts
class HashTable {
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
    const index = this.hash(key);
    this.buckets[index].push([key, value]);
  }

  get(key: string): unknown {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
\`\`\`

\`hash(key)\` poora idea hai: ye ek key leta hai aur ek number ganta hai — yahaan, har character ke numeric code ko jodkar aur table ke size se divide karne par remainder lekar — jise \`this.buckets\` mein ek valid index hone ki guarantee hai. \`set\` aur \`get\` dono bilkul usi \`hash\` function ko bilkul usi key par bulaate hain, isliye wo hamesha isse sahmat hote hain ki ek di gayi key kaunse bucket mein belong karti hai. \`get\` ko ab POORI table search karne ki zaroorat nahi hai — ye us ek bucket ko ganta hai jismein key hona chahiye, aur sirf us akele, aksar chhote bucket ke andar scan karta hai, har us entry ke bajaye jo kabhi insert ki gayi.`,

    content: `## Why this is O(1) on average, and what "on average" is hiding

\`\`\`
hash(key) computation:  O(key length) — usually treated as O(1) since
                         key length is typically small and bounded,
                         independent of how many entries the table holds

bucket scan after hashing: O(bucket size) — this is the part that
                         depends on HOW MANY keys landed in the same
                         bucket, not on the table's total entry count
\`\`\`

Computing \`hash(key)\` costs time proportional to the key\'s own length, which is typically small and does not grow as more entries are added to the table — a 10-character string key costs the same to hash whether the table holds 10 entries or 10 million. The genuinely interesting part is the bucket scan afterward: if keys are spread out roughly evenly across all the buckets, each individual bucket holds only a small handful of entries on average, regardless of the table\'s total size, which is what makes the overall lookup \`O(1)\` on average. This "on average" is doing real work in that sentence, and it depends entirely on the hash function actually spreading keys out evenly — which this lesson\'s next example breaks on purpose.

## A deliberately bad hash function: what happens when spreading fails

\`\`\`js
function terribleHash(key) {
  return 0; // every single key maps to the exact same bucket
}
\`\`\`

Nothing about the \`HashTable\` class this lesson built REQUIRES the hash function to spread keys out evenly — a hash function that always returns \`0\`, mapping every possible key into the exact same single bucket, is still a completely valid function by the class\'s own rules; \`get\` and \`set\` would still agree on which bucket to use, and the code would still run without errors. What breaks is the performance guarantee: with every key crammed into one bucket, the "scan within the bucket" step degrades back into a full linear scan through every entry ever inserted — exactly the \`O(n)\` cost of the broken \`SlowDictionary\` this lesson opened with, despite the code technically still being "a hash table." This is the direct, concrete reason a genuinely good hash function — one that spreads realistic keys out roughly evenly across buckets — is not a minor implementation detail; it is the entire basis for the \`O(1)\` average-case guarantee that makes a hash table worth using over a plain array in the first place.

## Setting up the next lesson: what happens when two DIFFERENT keys land in the same bucket

Even with a genuinely good hash function, two different keys can still occasionally compute to the exact same bucket index — this is called a collision, and it is not a bug or a sign of a bad hash function; with a large enough number of possible keys and a finite number of buckets, some collisions are mathematically unavoidable. This lesson\'s \`HashTable\` implementation already handles this correctly, almost accidentally: each bucket is itself a small array capable of holding more than one entry, and \`get\` scans within that bucket to find the exact matching key. This specific way of handling collisions — each bucket holding a small list of everything that hashed there — is called chaining, and it is one of two genuinely standard approaches; this course\'s next lesson covers chaining in full depth alongside its main alternative, open addressing, and the real trade-offs between them.`,

    contentHi: `## Ye average mein O(1) kyun hai, aur "average mein" kya chhupaata hai

\`\`\`
hash(key) computation:  O(key length) — aksar O(1) maana jaata hai kyunki
                         key length aksar chhoti aur bounded hoti hai,
                         is baat se azaad ki table mein kitni entries hain

Hashing ke baad bucket scan: O(bucket size) — ye wo hissa hai jo is
                         baat par nirbhar karta hai ki KITNI keys usi
                         bucket mein utri, table ki total entry count
                         par nahi
\`\`\`

\`hash(key)\` ganne mein key ki apni lambaayi ke anupaat mein samay lagta hai, jo aksar chhoti hoti hai aur badhti nahi jaise table mein zyaada entries jodi jaati hain — ek 10-character string key ko hash karne mein samaan samay lagta hai chahe table 10 entries rakhta ho ya 10 million. Sach mein dilchasp hissa baad ka bucket scan hai: agar keys lagbhag barabar sab buckets ke aar-paar failaayi hui hain, har akela bucket average mein sirf mutthi-bhar entries rakhta hai, table ke total size se azaad, jo overall lookup ko average mein \`O(1)\` banaata hai. Ye "average mein" us vaakya mein asli kaam kar raha hai, aur ye poori tarah is baat par nirbhar karta hai ki hash function asal mein keys ko barabar failaata hai — jise is lesson ka agla example jaan-boojhkar todta hai.

## Ek jaan-boojhkar kharaab hash function: kya hota hai jab failaana fail ho jaata hai

\`\`\`js
function terribleHash(key) {
  return 0; // har akeli key bilkul usi bucket mein map hoti hai
}
\`\`\`

Is lesson ne jo \`HashTable\` class banaayi uske baare mein kuch bhi hash function ko keys ko barabar failaane ki MAANG nahi karta — ek hash function jo hamesha \`0\` return karta hai, har sambhaavit key ko bilkul usi akele bucket mein map karte hue, class ke apne rules dwara phir bhi ek poori tarah valid function hai; \`get\` aur \`set\` phir bhi sahmat honge ki kaunsa bucket istemal karna hai, aur code phir bhi bina errors ke chalega. Jo tootta hai wo performance guarantee hai: har key ek bucket mein thonsi jaane ke saath, "bucket ke andar scan karo" kadam wapas ek poori linear scan mein girta hai har us entry ke through jo kabhi insert ki gayi — bilkul wo \`O(n)\` keemat jo is lesson ne toote \`SlowDictionary\` se shuru mein kholi, is baat ke bawajood ki code technically abhi bhi "ek hash table" hai. Ye seedha, thos kaaran hai ki ek sach mein achha hash function — ek jo waastavik keys ko lagbhag barabar buckets ke aar-paar failaata hai — ek chhoti implementation detail nahi hai; ye poora aadhaar hai \`O(1)\` average-case guarantee ka jo ek hash table ko shuru mein ek saadhe array par istemal karne laayak banaata hai.

## Agla lesson set up karna: kya hota hai jab do ALAG keys usi bucket mein utarti hain

Ek sach mein achhe hash function ke saath bhi, do alag keys kabhi-kabhi bilkul usi bucket index ki ganana kar sakti hain — ise collision kaha jaata hai, aur ye ek bug ya kharaab hash function ka sanket nahi hai; sambhaavit keys ki ek kaafi badi tadaad aur seemit buckets ke saath, kuch collisions mathematically bachne-yogya nahi hain. Is lesson ka \`HashTable\` implementation ise pehle se sahi tarike se handle karta hai, lagbhag samyog se: har bucket khud ek chhota array hai jo ek se zyaada entry rakh sakta hai, aur \`get\` sahi mel khaati key dhoondhne ke liye us bucket ke andar scan karta hai. Collisions ko handle karne ka ye khaas tarika — har bucket kuch bhi jo wahaan hash hua uski ek chhoti list rakhte hue — chaining kaha jaata hai, aur ye do sach mein standard approaches mein se ek hai; is course ka agla lesson chaining ko poori gehraayi mein cover karta hai iske mukhya alternative, open addressing, ke saath, aur unke beech asli trade-offs.`,

    examples: [
      {
        title: 'Broken: a plain array of pairs, found via linear scan',
        titleHi: 'Toota: pairs ka ek saadha array, linear scan ke zariye dhoondha gaya',
        code: `for (const entry of this.entries) {
  if (entry[0] === key) return entry[1];
}`,
        codeJs: `class SlowDictionary {
  constructor() {
    this.entries = [];
  }
  set(key, value) {
    for (const entry of this.entries) {
      if (entry[0] === key) { entry[1] = value; return; }
    }
    this.entries.push([key, value]);
  }
  get(key) {
    for (const entry of this.entries) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
// O(n) per get/set, exactly this course's very first lesson's problem`,
        codeTs: `class SlowDictionary {
  private entries: [string, unknown][] = [];
  set(key: string, value: unknown): void {
    for (const entry of this.entries) {
      if (entry[0] === key) { entry[1] = value; return; }
    }
    this.entries.push([key, value]);
  }
  get(key: string): unknown {
    for (const entry of this.entries) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}
// fully valid TypeScript — the cost is architectural, not a type error`,
        output: `Correct, but each get/set scans the entire entries array in the
worst case — cost grows directly with how many entries exist.`,
        explain: 'Nothing about a key indicates where in the array to look, so both get and set must scan from the beginning until a match is found or the array ends.',
        explainHi: 'Ek key ke baare mein kuch bhi ye nahi darsata ki array mein kahaan dekhna hai, isliye \`get\` aur \`set\` dono ko shuru se scan karna chahiye jab tak ek match na mile ya array khatam na ho.',
      },
      {
        title: 'Fixed: a hash function computes exactly where a key belongs',
        titleHi: 'Theek: ek hash function bilkul ganta hai ki ek key kahaan belong karti hai',
        code: `hash(key) {
  let total = 0;
  for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
  return total % this.size;
}`,
        codeJs: `class HashTable {
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
    this.buckets[this.hash(key)].push([key, value]);
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}`,
        codeTs: `class HashTable {
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
    this.buckets[this.hash(key)].push([key, value]);
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key)];
    for (const entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}`,
        outputJs: `get and set both compute the same bucket index directly from the
key, scanning only within that one small bucket rather than the
entire table — O(1) on average, given an even hash function.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Both operations agree on the same bucket via the same hash function, turning a full-table search into a direct computation followed by a small, local scan.',
        explainHi: 'Dono operations usi \`hash\` function ke zariye usi bucket se sahmat hote hain, ek poori-table search ko ek seedhe computation mein badalte hue us ke baad ek chhota, local scan.',
      },
      {
        title: 'A deliberately bad hash function degrading performance back to O(n)',
        titleHi: 'Ek jaan-boojhkar kharaab hash function performance ko wapas O(n) mein giraata hai',
        code: `hash(key) {
  return 0; // every key lands in the same bucket
}`,
        codeJs: `class BadHashTable extends HashTable {
  hash(key) {
    return 0; // ignores the key entirely — always the same bucket
  }
}
// still technically "a hash table" by the class's own rules,
// but every single key collides into bucket 0`,
        codeTs: `class BadHashTable extends HashTable {
  protected hash(key: string): number {
    return 0;
  }
}`,
        outputJs: `Every key ends up in bucket 0. get() must now scan through
every single entry ever inserted to find a match — the exact
O(n) cost of the broken SlowDictionary this lesson opened with.`,
        outputTs: `// Identical degraded behaviour, fully typed.`,
        explain: 'Nothing in the class enforces that a hash function spreads keys out evenly — a poor hash function silently degrades the same code back to linear-scan performance.',
        explainHi: 'Class mein kuch bhi ye lagu nahi karta ki ek hash function keys ko barabar failaaye — ek kharaab hash function chupchaap usi code ko wapas linear-scan performance mein giraata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `for (const entry of this.entries) { if (entry[0] === key) return entry[1]; }
// scanning every entry to find a key`,
        right: `const bucket = this.buckets[this.hash(key)];
for (const entry of bucket) { if (entry[0] === key) return entry[1]; }`,
        why: 'Scanning every entry ignores the fact that a hash function can compute directly where a key belongs, turning a full-table search into a search within one small bucket.',
        whyHi: 'Har entry ko scan karna is tathya ko ignore karta hai ki ek hash function seedhe gan sakta hai ki ek key kahaan belong karti hai, ek poori-table search ko ek chhote bucket ke andar ek search mein badalte hue.',
      },
      {
        wrong: `hash(key) { return 0; } // technically valid, disastrously bad`,
        right: `hash(key) { /* spread keys roughly evenly across all buckets */ }`,
        why: 'A hash function that maps every key to the same bucket is still technically valid by a hash table\'s own rules, but silently destroys the O(1) average-case guarantee the entire structure exists to provide.',
        whyHi: 'Ek hash function jo har key ko usi bucket mein map karta hai ek hash table ke apne rules dwara technically abhi bhi valid hai, par chupchaap us \`O(1)\` average-case guarantee ko nasht karta hai jise pradaan karne ke liye poori structure maujood hai.',
      },
      {
        wrong: `// assuming a hash table's O(1) is guaranteed unconditionally,
// regardless of how the hash function actually behaves`,
        right: `// recognizing O(1) as an AVERAGE-case guarantee that depends
// specifically on the hash function spreading keys out evenly`,
        why: 'A hash table\'s O(1) is not an unconditional guarantee like array index access — it depends entirely on the quality of the hash function actually being used.',
        whyHi: 'Ek hash table ka \`O(1)\` array index access jaisi ek bina-shart guarantee nahi hai — ye poori tarah us hash function ki quality par nirbhar karta hai jo asal mein istemal ki jaa rahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**JavaScript\'s own Map and Object, Python\'s dict, and Java\'s HashMap are all real, production hash table implementations built around exactly this hash-function-plus-buckets idea**, not a simplified teaching model.',
        hi: '**JavaScript ke apne \`Map\` aur \`Object\`, Python ke \`dict\`, aur Java ke \`HashMap\` sab asli, production hash table implementations hain bilkul isi hash-function-plus-buckets idea ke aas-paas banaaye gaye**, ek simplified teaching model nahi.',
      },
      {
        en: '**"Explain how a hash map works internally" and "why is hash map lookup O(1)?" are genuinely standard, frequently asked technical interview questions**, specifically testing whether a candidate understands the mechanism, not just how to call .get() and .set().',
        hi: '**"Batao ki ek hash map internally kaise kaam karta hai" aur "hash map lookup \`O(1)\` kyun hai?" sach mein standard, aksar poochhe jaane waale technical interview sawaal hain**, khaas taur par ye test karte hue ki kya ek candidate mechanism samajhta hai, sirf \`.get()\` aur \`.set()\` bulaana nahi.',
      },
      {
        en: '**Real security vulnerabilities (hash-flooding denial-of-service attacks) have historically exploited exactly the failure mode this lesson\'s "bad hash function" example demonstrates**, by deliberately choosing keys that all collide into the same bucket.',
        hi: '**Asli security vulnerabilities (hash-flooding denial-of-service attacks) ne historically bilkul us failure mode ka istemal kiya hai jise is lesson ka "kharaab hash function" example darsata hai**, jaan-boojhkar aisi keys chunkar jo sab usi bucket mein takraayein.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a hash table\'s lookup cost described as O(1) "on average" rather than simply O(1), and what specifically has to be true for that average-case guarantee to actually hold?',
        qHi: 'Ek hash table ki lookup keemat ko "average mein" \`O(1)\` kyun kaha jaata hai simply \`O(1)\` ke bajaye, aur khaas taur par kya sach hona chahiye us average-case guarantee ke asal mein tikne ke liye?',
        a: 'A hash table lookup consists of two genuinely separate steps: first, computing the hash function on the given key to determine which bucket it should be in, and second, scanning within that specific bucket to find the exact matching entry. The first step\'s cost is proportional to the key\'s own length, which is typically small and does not grow as the table itself grows, so it is reasonably treated as a constant, O(1) cost. The second step\'s cost, however, is proportional to how many entries happen to be sitting in that particular bucket — and this is where the "on average" qualifier becomes load-bearing. If the hash function spreads keys out roughly evenly across all available buckets, then, on average, each bucket ends up holding only a small, roughly constant number of entries regardless of how many total entries the table holds, which is what makes the bucket-scanning step also roughly constant on average. This average-case behavior depends entirely on the hash function actually achieving that even spread; nothing about a hash table\'s own structure enforces this as an unconditional guarantee. If the hash function is poorly designed, or if inputs happen to be specifically chosen to collide (as in a deliberate hash-flooding attack), a large fraction, or even all, of the entries can end up crammed into a small number of buckets, or even a single bucket, at which point the bucket-scanning step degrades back toward a full linear scan, giving the hash table a worst-case cost of O(n), identical to the plain, unindexed array this lesson\'s broken example used. The O(1) guarantee is therefore fundamentally a statement about the typical, average behavior under a well-designed hash function spreading realistic keys evenly, not an unconditional property of the data structure itself the way array index access\'s O(1) guarantee is.',
        aHi: 'Ek hash table lookup do sach mein alag steps se bana hai: pehla, di gayi key par hash function ganna ye tay karne ke liye ki ye kaunse bucket mein hona chahiye, aur doosra, us khaas bucket ke andar scan karna bilkul mel khaati entry dhoondhne ke liye. Pehle step ki keemat key ki apni lambaayi ke anupaat mein hai, jo aksar chhoti hoti hai aur table khud badhne par nahi badhti, isliye ise vaajbi taur par ek constant, \`O(1)\` keemat maana jaata hai. Doosre step ki keemat, halaanki, is baat ke anupaat mein hai ki us khaas bucket mein samyog se kitni entries baithi hain — aur yahaan "average mein" qualifier bhaar-vaahak ban jaata hai. Agar hash function keys ko lagbhag barabar sab upalabdh buckets ke aar-paar failaata hai, toh, average mein, har bucket lagbhag ek chhoti, roughly constant tadaad ki entries rakhne mein khatam hota hai is baat se azaad ki table kul milaake kitni entries rakhta hai, jo bucket-scanning step ko bhi average mein lagbhag constant banaata hai. Ye average-case vyavahaar poori tarah is baat par nirbhar karta hai ki hash function asal mein wo barabar failaav haasil karta hai; ek hash table ki apni structure ke baare mein kuch bhi ise ek bina-shart guarantee ki tarah lagu nahi karta. Agar hash function kharaab design kiya gaya hai, ya agar inputs samyog se khaas taur par takraane ke liye chune gaye hain (jaisa ek jaan-boojhkar hash-flooding attack mein), entries ka ek bada hissa, ya bilkul sab, buckets ki ek chhoti tadaad mein, ya ek akele bucket mein bhi, thonse jaa sakte hain, us bindu par bucket-scanning step wapas ek poori linear scan ki taraf girta hai, hash table ko ek worst-case keemat \`O(n)\` deta hue, us saadhe, na-indexed array jaisa hi jise is lesson ka toota example istemal karta hai. \`O(1)\` guarantee isliye buniyaadi roop se ek achhi-tarah-design-ki-gayi hash function ke neeche waastavik keys ko barabar failaate hue typical, average vyavahaar ke baare mein ek bayaan hai, khud data structure ki koi bina-shart property nahi jaisa array index access ki \`O(1)\` guarantee hai.',
      },
      {
        q: 'Why does a hash function that always returns the same bucket index (like returning 0 for every key) technically still satisfy the requirements of a hash table, and why is this specifically dangerous rather than merely suboptimal?',
        qHi: 'Ek hash function jo hamesha samaan bucket index return karta hai (jaisa har key ke liye 0 return karna) technically ek hash table ki zarooratein kyun poori karta hai phir bhi, aur ye khaas taur par khatarnaak kyun hai sirf suboptimal hone ke bajaye?',
        a: 'A hash table\'s own internal logic only requires two things of its hash function: that it always produces a valid index within the bounds of the bucket array, and that it produces the SAME index every time it is given the SAME key, so that a value stored for a given key can later be found again using that same key. A hash function that ignores its input entirely and always returns a fixed value, such as 0, technically satisfies both of these requirements perfectly — every call produces a valid index, and that index is always identical for identical (and, in this specific broken case, for every possible) key, so get and set remain internally consistent with each other and the code runs without error. This is precisely why the mistake is dangerous rather than simply producing an obviously broken program: nothing about the code itself signals that anything is wrong, since it satisfies the structure\'s own minimal correctness requirements, and a superficial test checking only whether values can be stored and retrieved correctly would pass without revealing the problem at all. What actually breaks is a property the structure\'s correctness does not depend on but its usefulness entirely does: the assumption that keys will be spread out reasonably evenly across the available buckets, which is what keeps the scan within each individual bucket small. With every key colliding into the same single bucket, that bucket\'s own internal list grows to contain every single entry ever inserted into the table, and searching within it becomes functionally identical to a full linear scan through all of them — the hash table silently degrades into having the exact same worst-case performance as the plain unindexed array this lesson began with, all while still being a technically valid, technically correct hash table by its own internal rules. This same underlying failure mode, in its real-world form, is precisely what a hash-flooding denial-of-service attack deliberately exploits: an attacker who can predict or control a hash function\'s specific behavior can choose input keys specifically engineered to all collide into the same bucket, deliberately forcing a system\'s hash table into its worst-case, linear-scan behavior in order to degrade its performance.',
        aHi: 'Ek hash table ka apna internal logic apne hash function se sirf do cheezein maangta hai: ki ye hamesha bucket array ki seemaon ke andar ek valid index banaaye, aur ki ye SAMAAN key diye jaane par hamesha SAMAAN index banaaye, taaki ek di gayi key ke liye store ki gayi value baad mein usi key istemal karke dobara mil sake. Ek hash function jo apna input poori tarah ignore karta hai aur hamesha ek fixed value return karta hai, jaisa 0, technically in dono zarooraton ko poori tarah poora karta hai — har call ek valid index banaata hai, aur wo index hamesha identical (aur, is khaas toote case mein, har sambhaavit) key ke liye identical hai, isliye \`get\` aur \`set\` ek doosre ke saath internally consistent rehte hain aur code bina error ke chalta hai. Yahi bilkul wajah hai ki galti khatarnaak hai sirf ek spashta roop se toota program banaane ke bajaye: code ke baare mein khud kuch bhi ye sanket nahi deta ki kuch galat hai, kyunki ye structure ki apni minimal correctness zaroorton ko poora karta hai, aur ek superficial test jo sirf ye check karta hai ki kya values sahi tarike se store aur retrieve ki jaa sakti hain samasya ko bilkul darsaaye bina paas ho jaayega. Jo asal mein tootta hai wo ek property hai jispar structure ki correctness nirbhar nahi karti par uski upyogita poori tarah karti hai: ye dhaarna ki keys upalabdh buckets ke aar-paar vaajbi roop se failaayi jaayengi, jo har akele bucket ke andar scan ko chhota rakhta hai. Har key ke usi akele bucket mein takraane ke saath, us bucket ki apni internal list badhkar table mein kabhi bhi insert ki gayi har entry ko rakhne lagti hai, aur iske andar khoj karna functionally un sab ke through ek poori linear scan jaisa ban jaata hai — hash table chupchaap us saadhe na-indexed array jaisa hi worst-case performance rakhne mein degrade ho jaata hai jise is lesson ne shuru mein kiya, in sab ke bawajood technically ek valid, technically sahi hash table hote hue apne internal rules dwara. Ye wahi underlying failure mode, iske asli-duniya roop mein, bilkul wo hai jise ek hash-flooding denial-of-service attack jaan-boojhkar istemal karta hai: ek attacker jo ek hash function ke khaas vyavahaar ko predict ya control kar sakta hai input keys chun sakta hai khaas taur par engineer ki gayi sab ko usi bucket mein takraane ke liye, jaan-boojhkar ek system ke hash table ko iske worst-case, linear-scan vyavahaar mein majboor karte hue iski performance ko degrade karne ke liye.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken SlowDictionary and the fixed HashTable from this lesson. Add a counter that tracks how many comparisons get() performs, and confirm the fixed version genuinely performs fewer comparisons on a table with many entries.',
        taskHi: 'Is lesson ka toota \`SlowDictionary\` aur theek \`HashTable\` dono banao. Ek counter jodo jo track karta hai ki \`get()\` kitne comparisons perform karta hai, aur confirm karo ki theek version sach mein kam comparisons perform karta hai kayi entries waali ek table par.',
        hint: 'Insert several hundred distinct keys into both structures before comparing how many comparisons a single get() call requires in each.',
        hintHi: 'Compare karne se pehle kayi sau alag keys dono structures mein insert karo ki har ek mein ek akela \`get()\` call ko kitne comparisons chahiye.',
      },
      {
        task: 'Build the deliberately bad hash function (returning 0 always) from this lesson\'s third example. Insert 1,000 distinct keys and confirm, by inspecting bucket contents directly, that all 1,000 landed in the same bucket.',
        taskHi: 'Is lesson ke teesre example se jaan-boojhkar kharaab hash function banaao (hamesha 0 return karte hue). 1,000 alag keys insert karo aur seedhe bucket contents inspect karke confirm karo ki sab 1,000 usi bucket mein utri.',
        hint: 'Log this.buckets[0].length after inserting all 1,000 keys, and compare it against the length of any other bucket.',
        hintHi: 'Sab 1,000 keys insert karne ke baad \`this.buckets[0].length\` log karo, aur ise kisi doosre bucket ki length se compare karo.',
      },
      {
        task: 'Write a slightly better hash function than the one this lesson used (summing character codes), and explain in one sentence what specific weakness your new function addresses, if any — or why the original is already reasonable.',
        taskHi: 'Is lesson ne jo istemal kiya (character codes jodna) us se thoda behtar hash function likho, aur ek vaakya mein samjhaao ki tumhaara naya function kaunsi khaas kamzori sambodhit karta hai, agar koi hai — ya asli pehle se vaajbi kyun hai.',
        hint: 'Consider whether the simple sum-of-character-codes approach might produce the same hash for different strings that are anagrams of each other, and think about whether that matters.',
        hintHi: 'Vichaar karo ki kya saadha sum-of-character-codes approach un alag strings ke liye samaan hash bana sakta hai jo ek doosre ke anagrams hain, aur socho ki kya ye maayne rakhta hai.',
      },
    ],

    keyTakeaways: [
      'A hash table is a plain array of buckets plus a hash function that converts any key into a valid index, letting a lookup compute where to look instead of scanning to find out.',
      'A hash function\'s own cost is proportional to the key\'s length, typically treated as O(1) since it does not grow with the table\'s size.',
      'A hash table\'s O(1) lookup cost is an AVERAGE-case guarantee that depends entirely on the hash function spreading keys out roughly evenly across buckets.',
      'A hash function that maps every key to the same bucket is still technically valid by the structure\'s own rules, but silently degrades performance back to a full O(n) linear scan.',
      'Two different keys landing in the same bucket (a collision) is not a bug — it is mathematically expected with a finite number of buckets, and is handled by this lesson\'s next topic: collision resolution.',
      'A well-designed hash function is not a minor implementation detail — it is the entire basis for the performance guarantee that makes a hash table worth using over a plain array.',
    ],
    keyTakeawaysHi: [
      'Ek hash table buckets ka ek saadha array hai plus ek hash function jo kisi bhi key ko ek valid index mein badalta hai, ek lookup ko ye ganne dete hue ki kahaan dekhna hai pata lagaane ke liye scan karne ke bajaye.',
      'Ek hash function ki apni keemat key ki lambaayi ke anupaat mein hai, aksar \`O(1)\` maani jaati hai kyunki ye table ke size ke saath nahi badhti.',
      'Ek hash table ki \`O(1)\` lookup keemat ek AVERAGE-case guarantee hai jo poori tarah is baat par nirbhar karti hai ki hash function keys ko buckets ke aar-paar lagbhag barabar failaata hai.',
      'Ek hash function jo har key ko usi bucket mein map karta hai structure ke apne rules dwara technically abhi bhi valid hai, par chupchaap performance ko wapas ek poori \`O(n)\` linear scan mein degrade karta hai.',
      'Do alag keys ka usi bucket mein utarna (ek collision) ek bug nahi hai — ye mathematically expected hai buckets ki ek seemit tadaad ke saath, aur is lesson ke agle topic dwara handle kiya jaata hai: collision resolution.',
      'Ek achhi-tarah-design-ki-gayi hash function ek chhoti implementation detail nahi hai — ye poora aadhaar hai us performance guarantee ka jo ek hash table ko ek saadhe array par istemal karne laayak banaata hai.',
    ],
  },
];
