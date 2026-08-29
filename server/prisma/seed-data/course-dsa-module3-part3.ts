/**
 * DSA Complete Course — Module 3: Hashing, lesson 3.
 *
 * Load factor and resizing: why a hash table's O(1) average lookup
 * quietly stops holding if the number of entries keeps growing while
 * the number of buckets stays fixed, and how resizing (rebuilding into
 * a bigger bucket array once a load-factor threshold is crossed) keeps
 * the average bucket size bounded forever. Broken example: a hash table
 * with a permanently fixed bucket count, whose average bucket size, and
 * therefore average lookup cost, grows without limit as more entries
 * are inserted, exactly reproducing the "bad hash function" failure
 * mode from this module's first lesson through neglect rather than a
 * bad hash function. Fixed by tracking load factor (entries divided by
 * bucket count) and resizing to a larger bucket array, rehashing every
 * existing entry, once load factor crosses a threshold — an expensive
 * O(n) operation that happens rarely enough to make insertion still
 * O(1) on amortized average.
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

export const DSA_MODULE_3_PART3: CourseLesson[] = [
  {
    slug: 'load-factor-and-resizing',
    title: 'Load Factor and Resizing',
    titleHi: 'Load Factor Aur Resizing',
    description: 'A hash table starts with 16 buckets and never grows them, no matter how many entries are inserted — after 100,000 entries are added, every bucket holds an average of 6,250 entries, and every single lookup now scans thousands of entries, silently reproducing the exact O(n) failure mode a bad hash function would cause, without the hash function ever actually being bad.',
    descriptionHi: 'Ek hash table 16 buckets ke saath shuru hoti hai aur unhe kabhi nahi badhaati, chahe kitni bhi entries insert ki jaayein — 100,000 entries jodne ke baad, har bucket average 6,250 entries rakhta hai, aur ab har akeli lookup hazaaron entries scan karti hai, chupchaap bilkul wahi \`O(n)\` failure mode reproduce karte hue jise ek kharaab hash function ka kaaran banata, hash function ke asal mein kabhi kharaab hue bina.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**A parking garage with a fixed 100 spaces that never adds a single new level, no matter how many more cars a growing office building above it brings in over the years, versus a garage that proactively adds an entire new level the moment the existing ones cross 75% full.** The fixed garage feels perfectly fine on day one, with only a handful of cars parked — finding an empty spot, or a specific car, is quick, since there is plenty of open space to search through. As the office building above it fills up over the years, the same 100 spaces are asked to hold more and more cars, and eventually every level is packed nearly solid — finding a specific car now means walking past rows and rows of other cars, and finding an empty spot means circling the entire garage multiple times, despite absolutely nothing about the garage\'s OWN design having changed since day one. The proactively-expanding garage never lets this happen: the moment occupancy crosses a set threshold, an entire new level is added, spreading the same number of cars across more space and keeping the average number of cars per level, and therefore the time to find any specific one, roughly constant no matter how large the building above eventually grows. A hash table with a permanently fixed number of buckets is the never-expanding garage: it performs beautifully with few entries and silently, gradually degrades as more are added, not because anything about its hash function got worse, but purely because the same fixed number of buckets is being asked to hold an ever-growing number of entries. Tracking load factor and resizing once it crosses a threshold is the proactively-expanding garage: the bucket count grows along with the entries, keeping the average number of entries per bucket, and therefore lookup cost, bounded forever.',
      hi: '**Ek parking garage jismein 100 fixed spaces hain jo kabhi ek bhi naya level nahi jodta, chahe iske oopar ek badhti office building saalon mein kitni bhi zyaada cars laaye, versus ek garage jo maujood levels ke 75% bharne ke pal poori tarah ek poora naya level jodta hai.** Fixed garage pehle din bilkul theek mehsoos hota hai, sirf mutthi-bhar cars park ki gayi ke saath — ek khaali spot, ya ek khaas car, dhoondhna tez hai, kyunki search karne ke liye kaafi khaali jagah hai. Jaise iske oopar office building saalon mein bharti hai, wahi 100 spaces ko zyaada se zyaada cars rakhne ko poocha jaata hai, aur aakhirkaar har level lagbhag solid pack ho jaata hai — ab ek khaas car dhoondhna matlab hai doosri cars ki row-dar-row se guzarna, aur ek khaali spot dhoondhna matlab hai poore garage ko kayi baar chakkar lagaana, is baat ke bawajood ki garage ki APNI design ke baare mein bilkul kuch bhi pehle din se nahi badla. Proactively-expand-hone-waala garage ise kabhi hone nahi deta: jis pal occupancy ek set threshold ko paar karti hai, ek poora naya level jodha jaata hai, wahi tadaad ki cars ko zyaada jagah mein failaate hue aur prati-level cars ki average tadaad, aur isliye kisi bhi khaas ko dhoondhne ka samay, lagbhag constant rakhte hue chahe oopar ki building aakhirkaar kitni bhi badi ho jaaye. Ek hash table jismein hamesha ke liye ek fixed tadaad ke buckets hain never-expand-hone-waala garage hai: ye kam entries ke saath khoobsoorti se perform karta hai aur chupchaap, dheere-dheere degrade hota hai jaise zyaada jodi jaati hain, is wajah se nahi ki iski hash function ke baare mein kuch kharaab hua, sirf isliye kyunki wahi fixed tadaad ke buckets ko hamesha-badhti hui entries ki tadaad rakhne ko poocha jaa raha hai. Load factor track karna aur ek threshold paar hone par resize karna proactively-expand-hone-waala garage hai: bucket count entries ke saath badhta hai, prati-bucket entries ki average tadaad, aur isliye lookup keemat, ko hamesha ke liye bounded rakhte hue.',
    },

    simple: `**Start broken.** A hash table with a permanently fixed bucket count:

\`\`\`js
class FixedHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []); // ALWAYS 16, forever
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.buckets.length;
  }
  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

This is exactly the correctly-chained hash table from this module\'s previous lesson — collisions are handled safely, and no data is ever lost. With only a few dozen entries, this performs beautifully: 16 buckets holding a handful of entries each means every lookup scans only a tiny bucket. The problem appears only as entries keep being added: with 16 buckets and 100,000 entries, EVERY bucket holds an average of 6,250 entries, regardless of how evenly the hash function spreads keys out — the bucket count itself never grew to keep pace, so \`get\`\'s "scan within one small bucket" step quietly stops being small, degrading back toward the exact same \`O(n)\` this module\'s first lesson\'s "bad hash function" example caused, except here the hash function was never actually bad — the bucket count simply never grew.

**The fix: track load factor, and resize once it crosses a threshold**

\`\`\`js
class ResizingHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
    this.count = 0;
  }
  hash(key, bucketCount) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % bucketCount;
  }
  set(key, value) {
    const loadFactor = this.count / this.buckets.length;
    if (loadFactor > 0.75) this.resize(); // proactively grow BEFORE it gets too full

    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) { existing[1] = value; return; }
    bucket.push([key, value]);
    this.count++;
  }
  resize() {
    const oldBuckets = this.buckets;
    this.buckets = new Array(oldBuckets.length * 2).fill(null).map(() => []); // double the size
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.buckets[this.hash(key, this.buckets.length)].push([key, value]); // rehash every entry
      }
    }
  }
  get(key) {
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

\`\`\`ts
class ResizingHashTable {
  private buckets: [string, unknown][][];
  private count: number;
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
    this.count = 0;
  }
  private hash(key: string, bucketCount: number): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % bucketCount;
  }
  set(key: string, value: unknown): void {
    const loadFactor = this.count / this.buckets.length;
    if (loadFactor > 0.75) this.resize();

    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) { existing[1] = value; return; }
    bucket.push([key, value]);
    this.count++;
  }
  private resize(): void {
    const oldBuckets = this.buckets;
    this.buckets = new Array(oldBuckets.length * 2).fill(null).map(() => []);
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.buckets[this.hash(key, this.buckets.length)].push([key, value]);
      }
    }
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

\`loadFactor\` — the number of entries divided by the number of buckets — is checked before every insert. Once it exceeds \`0.75\` (a genuinely standard threshold), \`resize()\` doubles the bucket array\'s size and re-inserts every single existing entry into it, recomputing each one\'s hash against the NEW, larger bucket count (an entry\'s bucket index depends on the total bucket count, so every entry\'s correct position changes when that count changes). This keeps the average number of entries per bucket bounded, roughly constant, no matter how large the table grows overall — exactly the parking garage that adds a new level before it gets too full, rather than the one that never adds levels at all.`,

    simpleHi: `**Toote hue se shuru.** Ek hash table hamesha ke liye fixed bucket count ke saath:

\`\`\`js
class FixedHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []); // HAMESHA 16, hamesha ke liye
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.buckets.length;
  }
  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

Ye bilkul is module ke pehle wale lesson ki sahi-tarike-se-chained hash table hai — collisions surakshit roop se handle ki jaati hain, aur koi data kabhi nahi khota. Sirf kuch dozen entries ke saath, ye khoobsoorti se perform karta hai: 16 buckets har ek mein mutthi-bhar entries rakhte hue matlab hai har lookup sirf ek chhota bucket scan karta hai. Samasya sirf tab dikhti hai jaise entries jodi jaati rehti hain: 16 buckets aur 100,000 entries ke saath, HAR bucket average 6,250 entries rakhta hai, is baat se azaad ki hash function keys ko kitna barabar failaata hai — bucket count khud kabhi raftaar milaane ke liye nahi badha, isliye \`get\` ka "ek chhote bucket ke andar scan karo" step chupchaap chhota hona band kar deta hai, wapas bilkul usi \`O(n)\` ki taraf degrade hote hue jise is module ke pehle lesson ke "kharaab hash function" example ne kiya, siwaay yahaan hash function asal mein kabhi kharaab thi hi nahi — bucket count bas kabhi badha hi nahi.

**Fix: load factor track karo, aur ek threshold paar hone par resize karo**

\`\`\`js
class ResizingHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
    this.count = 0;
  }
  hash(key, bucketCount) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % bucketCount;
  }
  set(key, value) {
    const loadFactor = this.count / this.buckets.length;
    if (loadFactor > 0.75) this.resize(); // bahut bharne se PEHLE proactively badhaao

    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) { existing[1] = value; return; }
    bucket.push([key, value]);
    this.count++;
  }
  resize() {
    const oldBuckets = this.buckets;
    this.buckets = new Array(oldBuckets.length * 2).fill(null).map(() => []); // size double karo
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.buckets[this.hash(key, this.buckets.length)].push([key, value]); // har entry rehash karo
      }
    }
  }
  get(key) {
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

\`\`\`ts
class ResizingHashTable {
  private buckets: [string, unknown][][];
  private count: number;
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
    this.count = 0;
  }
  private hash(key: string, bucketCount: number): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % bucketCount;
  }
  set(key: string, value: unknown): void {
    const loadFactor = this.count / this.buckets.length;
    if (loadFactor > 0.75) this.resize();

    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) { existing[1] = value; return; }
    bucket.push([key, value]);
    this.count++;
  }
  private resize(): void {
    const oldBuckets = this.buckets;
    this.buckets = new Array(oldBuckets.length * 2).fill(null).map(() => []);
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.buckets[this.hash(key, this.buckets.length)].push([key, value]);
      }
    }
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
\`\`\`

\`loadFactor\` — entries ki tadaad ko buckets ki tadaad se divide kiya gaya — har insert se pehle check kiya jaata hai. Ek baar ye \`0.75\` (ek sach mein standard threshold) se aage jaata hai, \`resize()\` bucket array ka size double karta hai aur har akeli maujood entry ko ismein dobara insert karta hai, har ek ka hash NAYE, bade bucket count ke khilaaf dobara ganta hue (ek entry ka bucket index total bucket count par nirbhar karta hai, isliye har entry ki sahi position badalti hai jab ye count badalta hai). Ye prati-bucket entries ki average tadaad ko bounded, lagbhag constant rakhta hai, chahe table overall kitni bhi badi ho jaaye — bilkul wahi parking garage jo bahut bharne se pehle ek naya level jodta hai, us se jo kabhi levels bilkul nahi jodta.`,

    content: `## Why resizing keeps insert O(1) on AMORTIZED average, despite resizing itself costing O(n)

\`\`\`
Resize cost: O(n) — every existing entry must be rehashed and re-inserted

But resizing only happens roughly every time the table DOUBLES in size:
  resize at 12 entries (16 * 0.75), resize at 24, resize at 48, resize at 96...

Total cost of all resizes up to n entries: 12 + 24 + 48 + ... ≈ 2n
Spread across n inserts: 2n / n = O(1) per insert, ON AVERAGE
\`\`\`

Resizing itself is genuinely expensive — an \`O(n)\` operation, since every single existing entry must be rehashed against the new bucket count and re-inserted. If resizing happened on every single insert, insertion would be \`O(n)\` per call, not \`O(1)\`. The reason this does not happen in practice is that resizing only occurs roughly once every time the table\'s entry count DOUBLES, since the threshold check is based on load factor (entries divided by buckets), and doubling the bucket count each time keeps that threshold from being crossed again until roughly twice as many entries have been added. Summing the cost of every resize that occurs while growing to \`n\` total entries produces a total resizing cost that is itself only roughly proportional to \`n\` (not \`n\` squared, or worse), meaning that when this total resizing cost is spread — "amortized" — evenly across all \`n\` individual insert operations, each individual insert\'s SHARE of that cost averages out to a small constant, giving insertion an \`O(1)\` AMORTIZED average cost, even though any single specific insert call that happens to trigger a resize is, by itself, genuinely \`O(n)\` at that moment.

## Why doubling the bucket size specifically, rather than adding a small fixed amount

\`\`\`
Doubling:      resize triggers at 12, 24, 48, 96, 192... (exponentially spaced)
Adding a fixed amount (e.g. +16 buckets each time): resize triggers at
               12, 24, 36, 48, 60... (linearly spaced) — far more frequent
               relative to how large the table has grown
\`\`\`

Growing the bucket array by DOUBLING it, rather than by adding some small, fixed number of buckets each time, is specifically what keeps the total resizing cost bounded to roughly \`O(n)\` overall. If the bucket count instead grew by a small, fixed amount every time, resizes would need to happen far more frequently relative to the table\'s current size as the table grows large, and the total cost of all those resizes would grow faster than \`n\`, breaking the \`O(1)\` amortized guarantee this lesson\'s doubling strategy specifically provides. This is a genuinely deliberate, mathematically necessary choice, not an arbitrary implementation detail — real hash table implementations, including JavaScript\'s own \`Map\`, use this same doubling (or similarly exponential) growth strategy for exactly this reason.

## The removal side: shrinking, and why many implementations skip it

A hash table\'s load factor can also become too LOW — if many entries are removed after a table has grown large, the table may end up with far more buckets than it needs, wasting memory without providing any benefit, since a mostly-empty bucket array does not improve lookup speed beyond what a smaller one already would. Some hash table implementations shrink the bucket array when load factor drops below a low threshold, mirroring the growth logic in reverse; many practical implementations simply do not bother, accepting some wasted memory as a reasonable trade for the added complexity shrinking would introduce, particularly since a table that shrank and then immediately grew again (a common access pattern) would pay redundant resizing costs in both directions. Whether to shrink is a genuine, secondary design decision, considerably less critical than growing, since an overly large but still-functional bucket array is a memory inefficiency, not a correctness or average-case performance problem the way a table that never grows at all is.`,

    contentHi: `## Resizing insert ko AMORTIZED average mein \`O(1)\` kyun rakhta hai, is baat ke bawajood ki resizing khud \`O(n)\` kharch karta hai

\`\`\`
Resize keemat: O(n) — har maujood entry ko rehash aur dobara-insert karna chahiye

Par resizing lagbhag har baar hoti hai jab table SIZE mein DOUBLE hoti hai:
  12 entries par resize (16 * 0.75), 24 par resize, 48 par resize, 96 par resize...

n entries tak sab resizes ki total keemat: 12 + 24 + 48 + ... ≈ 2n
n inserts ke aar-paar failaayi gayi: 2n / n = O(1) prati insert, AVERAGE MEIN
\`\`\`

Resizing khud sach mein mehenga hai — ek \`O(n)\` operation, kyunki har akeli maujood entry ko naye bucket count ke khilaaf rehash aur dobara-insert kiya jaana chahiye. Agar resizing har akele insert par hoti, insertion prati call \`O(n)\` hota, \`O(1)\` nahi. Ye practice mein na hone ka kaaran ye hai ki resizing lagbhag ek baar hoti hai har baar jab table ki entry count DOUBLE hoti hai, kyunki threshold check load factor (entries ko buckets se divide kiya gaya) par aadhaarit hai, aur har baar bucket count double karna us threshold ko dobara paar hone se rokta hai jab tak lagbhag doogunni tadaad entries na jodi gayi hon. \`n\` total entries tak badhte hue har resize ki keemat jodna ek total resizing keemat banaata hai jo khud sirf lagbhag \`n\` ke anupaat mein hai (\`n\` squared, ya usse bura nahi), matlab jab ye total resizing keemat failaayi jaati hai — "amortized" — samaan roop se sab \`n\` akele insert operations ke aar-paar, har akele insert ka us keemat ka SHARE average mein ek chhote constant tak simat jaata hai, insertion ko ek \`O(1)\` AMORTIZED average keemat dete hue, chahe koi bhi akela khaas insert call jo samyog se ek resize trigger karta hai, khud, us pal genuinely \`O(n)\` ho.

## Bucket size khaas taur par double karna kyun, ek chhota fixed amount jodne ke bajaye

\`\`\`
Doubling:      resize trigger hota hai 12, 24, 48, 96, 192... (exponentially spaced)
Ek fixed amount jodna (jaise +16 buckets har baar): resize trigger hota hai
               12, 24, 36, 48, 60... (linearly spaced) — kaafi zyaada baar
               table kitna bada ho chuka hai iske saapeksh
\`\`\`

Bucket array ko DOUBLE karke badhaana, har baar kuch chhota, fixed tadaad ke buckets jodne ke bajaye, khaas taur par wahi hai jo total resizing keemat ko overall lagbhag \`O(n)\` par bounded rakhta hai. Agar bucket count iske bajaye har baar ek chhote, fixed tadaad se badhta, resizes ko table ki current size ke saapeksh kaafi zyaada baar hone ki zaroorat hoti jaise table bada hota hai, aur un sab resizes ki total keemat \`n\` se tez badhti, us \`O(1)\` amortized guarantee ko todte hue jise is lesson ki doubling strategy khaas taur par pradaan karti hai. Ye ek sach mein jaan-boojhkar, mathematically zaruri chunaav hai, ek manmaani implementation detail nahi — asli hash table implementations, JavaScript ka apna \`Map\` sameet, bilkul isi doubling (ya samaan roop se exponential) growth strategy ka istemal karte hain bilkul isi kaaran se.

## Hataane waala pehlu: simatna, aur kayi implementations ise kyun chhod dete hain

Ek hash table ka load factor bhi bahut KAM ban sakta hai — agar kayi entries table ke bada hone ke baad hataayi jaati hain, table zaroorat se kaafi zyaada buckets ke saath khatam ho sakti hai, memory barbaad karte hue bina koi faayda pradaan kiye, kyunki ek adhikaansh-khaali bucket array lookup speed ko us se aage nahi sudhaarta jo ek chhota pehle se karega. Kuch hash table implementations bucket array ko simataate hain jab load factor ek kam threshold se neeche girta hai, growth logic ko ulta darsaate hue; kayi vyaavahaarik implementations simply parwaah nahi karte, kuch barbaad hui memory ko us atirikt complexity ke liye ek vaajbi trade ki tarah sweekaar karte hue jo simatna introduce karega, khaas taur par kyunki ek table jo simat gayi aur phir turant dobara badh gayi (ek aam access pattern) dono directions mein bekaar resizing keemat chukaayegi. Simatna hai ya nahi ek asli, dvitiyak design faisla hai, badhne se kaafi kam mahatvapoorn, kyunki ek zyaada bada par phir bhi-kaam-karta bucket array ek memory na-kushalta hai, ek sahihata ya average-case performance samasya nahi jaisa ek table jo kabhi bilkul nahi badhta hai.`,

    examples: [
      {
        title: 'Broken: a permanently fixed bucket count degrading as entries grow',
        titleHi: 'Toota: hamesha fixed bucket count entries badhne ke saath degrade hote hue',
        code: `class FixedHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []); // never grows
  }
}`,
        codeJs: `class FixedHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
  }
  hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.buckets.length;
  }
  set(key, value) {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key) {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
// with 100,000 entries and 16 buckets, average bucket size is 6,250`,
        codeTs: `class FixedHashTable {
  private buckets: [string, unknown][][] = new Array(16).fill(null).map(() => []);
  private hash(key: string): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % this.buckets.length;
  }
  set(key: string, value: unknown): void {
    const bucket = this.buckets[this.hash(key)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) existing[1] = value;
    else bucket.push([key, value]);
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}
// fully valid TypeScript — the degradation is architectural, not a type error`,
        output: `Fast with a few dozen entries. After 100,000 entries, every lookup
scans an average bucket of roughly 6,250 entries — O(n)-like behavior
despite a genuinely good hash function.`,
        explain: 'The hash function spreads keys out evenly across the 16 buckets it has, but 16 buckets were never enough for 100,000 entries in the first place — the bucket count itself never grew.',
        explainHi: 'Hash function keys ko 16 buckets ke aar-paar barabar failaata hai jo iske paas hain, par 16 buckets shuru mein hi 100,000 entries ke liye kaafi nahi the — bucket count khud kabhi nahi badha.',
      },
      {
        title: 'Fixed: tracking load factor and resizing before it gets too full',
        titleHi: 'Theek: load factor track karna aur bahut bharne se pehle resize karna',
        code: `const loadFactor = this.count / this.buckets.length;
if (loadFactor > 0.75) this.resize(); // double the buckets, rehash everything`,
        codeJs: `class ResizingHashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
    this.count = 0;
  }
  hash(key, bucketCount) {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % bucketCount;
  }
  set(key, value) {
    if (this.count / this.buckets.length > 0.75) this.resize();
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) { existing[1] = value; return; }
    bucket.push([key, value]);
    this.count++;
  }
  resize() {
    const old = this.buckets;
    this.buckets = new Array(old.length * 2).fill(null).map(() => []);
    for (const bucket of old) {
      for (const [k, v] of bucket) {
        this.buckets[this.hash(k, this.buckets.length)].push([k, v]);
      }
    }
  }
  get(key) {
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}`,
        codeTs: `class ResizingHashTable {
  private buckets: [string, unknown][][] = new Array(16).fill(null).map(() => []);
  private count: number = 0;
  private hash(key: string, bucketCount: number): number {
    let total = 0;
    for (let i = 0; i < key.length; i++) total += key.charCodeAt(i);
    return total % bucketCount;
  }
  set(key: string, value: unknown): void {
    if (this.count / this.buckets.length > 0.75) this.resize();
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const existing = bucket.find((e) => e[0] === key);
    if (existing) { existing[1] = value; return; }
    bucket.push([key, value]);
    this.count++;
  }
  private resize(): void {
    const old = this.buckets;
    this.buckets = new Array(old.length * 2).fill(null).map(() => []);
    for (const bucket of old) {
      for (const [k, v] of bucket) {
        this.buckets[this.hash(k, this.buckets.length)].push([k, v]);
      }
    }
  }
  get(key: string): unknown {
    const bucket = this.buckets[this.hash(key, this.buckets.length)];
    const entry = bucket.find((e) => e[0] === key);
    return entry ? entry[1] : undefined;
  }
}`,
        outputJs: `With 100,000 entries, the bucket count has doubled roughly 13 times
(16 → 32 → 64 → ... → ~131,072), keeping the average bucket size
small and roughly constant throughout.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The bucket count grows alongside the entry count, keeping the average entries-per-bucket, and therefore lookup cost, bounded regardless of how large the table grows overall.',
        explainHi: 'Bucket count entry count ke saath badhta hai, average entries-prati-bucket, aur isliye lookup keemat, ko bounded rakhte hue chahe table overall kitni bhi badi ho jaaye.',
      },
      {
        title: 'Confirming amortized O(1): total resize cost stays proportional to n',
        titleHi: 'Amortized O(1) confirm karna: total resize keemat n ke anupaat mein rehti hai',
        code: `// resizes happen at 12, 24, 48, 96, 192 entries...
// total work across all resizes ≈ 12 + 24 + 48 + 96 + 192 ≈ 2 * 192`,
        codeJs: `let totalRehashOperations = 0;
let threshold = 12; // 16 * 0.75
let bucketCount = 16;

while (threshold < 100000) {
  totalRehashOperations += threshold; // resizing rehashes every existing entry
  bucketCount *= 2;
  threshold = bucketCount * 0.75;
}

console.log(totalRehashOperations); // roughly 2x the final entry count, not n²`,
        codeTs: `let totalRehashOperations: number = 0;
let threshold: number = 12;
let bucketCount: number = 16;

while (threshold < 100000) {
  totalRehashOperations += threshold;
  bucketCount *= 2;
  threshold = bucketCount * 0.75;
}

console.log(totalRehashOperations);`,
        outputJs: `The total work summed across every resize that occurs while growing
to 100,000 entries is roughly 200,000 — proportional to n, not n²,
confirming that spreading this cost across n inserts gives O(1) per
insert on amortized average.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Because bucket count doubles each time, the resize thresholds form a geometric sequence whose sum is proportional to the final count, keeping total resizing cost, and therefore amortized insert cost, low.',
        explainHi: 'Kyunki bucket count har baar double hoti hai, resize thresholds ek geometric sequence banate hain jiska sum aakhri count ke anupaat mein hai, total resizing keemat, aur isliye amortized insert keemat, ko kam rakhte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `class HashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []); // never resized
  }
}`,
        right: `class HashTable {
  constructor() {
    this.buckets = new Array(16).fill(null).map(() => []);
    this.count = 0; // tracked so load factor can be checked before every insert
  }
}`,
        why: 'A hash table that never resizes its bucket array performs beautifully at small scale, then silently degrades toward O(n) lookups as entries keep growing, regardless of hash function quality.',
        whyHi: 'Ek hash table jo apna bucket array kabhi resize nahi karti chhoti scale par khoobsoorti se perform karti hai, phir chupchaap \`O(n)\` lookups ki taraf degrade hoti hai jaise entries badhti rehti hain, hash function ki quality se azaad.',
      },
      {
        wrong: `resize() {
  this.buckets = new Array(this.buckets.length + 16).fill(null).map(() => []);
  // adding a small FIXED amount each time
}`,
        right: `resize() {
  this.buckets = new Array(this.buckets.length * 2).fill(null).map(() => []);
  // DOUBLING each time
}`,
        why: 'Growing the bucket array by a small fixed amount, rather than doubling it, requires resizing far more often relative to the table\'s size, breaking the O(1) amortized guarantee doubling specifically provides.',
        whyHi: 'Bucket array ko ek chhote fixed amount se badhaana, ise double karne ke bajaye, table ke size ke saapeksh kaafi zyaada baar resize karna maangta hai, us \`O(1)\` amortized guarantee ko todte hue jise doubling khaas taur par pradaan karta hai.',
      },
      {
        wrong: `resize() {
  const newBuckets = new Array(this.buckets.length * 2).fill(null).map(() => []);
  for (const bucket of this.buckets) {
    for (const entry of bucket) newBuckets[this.hash(entry[0])].push(entry);
    // BUG: this.hash(key) still divides by the OLD bucket count
  }
}`,
        right: `resize() {
  const newBuckets = new Array(this.buckets.length * 2).fill(null).map(() => []);
  for (const bucket of this.buckets) {
    for (const entry of bucket) newBuckets[this.hash(entry[0], newBuckets.length)].push(entry);
    // hash recomputed against the NEW bucket count
  }
}`,
        why: 'An entry\'s correct bucket index depends on the total bucket count — rehashing against the old count during a resize places entries incorrectly, since the bucket count itself just changed.',
        whyHi: 'Ek entry ka sahi bucket index total bucket count par nirbhar karta hai — ek resize ke dauraan purani count ke khilaaf rehash karna entries ko galat tarike se rakhta hai, kyunki bucket count khud abhi badla hai.',
      },
    ],

    realWorld: [
      {
        en: '**JavaScript\'s own Map, Python\'s dict, and Java\'s HashMap all genuinely track load factor internally and resize (typically doubling) once a threshold is crossed** — this is real, production behavior, not a simplified teaching model.',
        hi: '**JavaScript ka apna \`Map\`, Python ka \`dict\`, aur Java ka \`HashMap\` sab sach mein internally load factor track karte hain aur resize karte hain (aksar double karte hue) ek baar threshold paar hone par** — ye asli, production vyavahaar hai, ek simplified teaching model nahi.',
      },
      {
        en: '**A load factor threshold of 0.75 is a genuinely standard, widely used default across many real hash table implementations**, balancing memory usage against how full a table is allowed to get before performance degrades.',
        hi: '**\`0.75\` ka load factor threshold kayi asli hash table implementations mein ek sach mein standard, widely used default hai**, memory usage ko is baat ke khilaaf balance karte hue ki performance degrade hone se pehle ek table kitna bhar sakta hai.',
      },
      {
        en: '**"Explain amortized time complexity" is a genuinely standard, frequently asked technical interview question**, and a hash table\'s resizing behavior is one of the most commonly used concrete examples to explain it with.',
        hi: '**"Amortized time complexity samjhaao" ek sach mein standard, aksar poochha jaane waala technical interview sawaal hai**, aur ek hash table ka resizing vyavahaar ise samjhaane ke liye sabse aam istemal hone waale thos examples mein se ek hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a hash table\'s insert operation described as O(1) "amortized" rather than simply O(1), given that resizing itself is genuinely an O(n) operation?',
        qHi: 'Ek hash table ka insert operation "amortized" \`O(1)\` kyun bataaya jaata hai simply \`O(1)\` ke bajaye, ye dekhte hue ki resizing khud sach mein ek \`O(n)\` operation hai?',
        a: 'Any single specific call to insert that happens to trigger a resize is, in that individual moment, genuinely expensive — it must rehash and re-insert every existing entry into the newly enlarged bucket array, an O(n) operation with respect to however many entries existed at that point. If this cost were paid on every single insert call, the correct description of insert\'s complexity would simply be O(n), not O(1). What actually happens is that resizing is triggered rarely — specifically, only when the load factor crosses a fixed threshold — and because the bucket array doubles in size each time a resize occurs, the number of entries the table can hold before the NEXT resize is required also roughly doubles. This means resizes occur at entry counts that grow geometrically (roughly 12, 24, 48, 96, and so on), and the total amount of rehashing work performed across ALL of the resizes that occur while growing the table up to some final size n turns out to be proportional to n itself, not to n squared or any faster-growing quantity, specifically because of this doubling pattern. Amortized analysis is the technique of taking this total cost, summed across every operation in a long sequence (here, n individual insert calls, only a small number of which actually trigger a resize), and dividing it evenly across all of them to determine the AVERAGE cost per operation, rather than looking at any single operation\'s worst-case cost in isolation. Since the total resizing cost across n inserts is itself proportional to n, dividing that total by n individual inserts yields a small constant average cost per insert — this is precisely what "O(1) amortized" communicates: not that every single insert call individually costs a small constant amount, since some specific calls are genuinely expensive, but that the AVERAGE cost per insert, calculated across a long sequence of operations, is a small constant, which is the property that actually matters for reasoning about a hash table\'s overall performance across many operations.',
        aHi: 'Insert ki koi bhi khaas call jo samyog se ek resize trigger karti hai, us akele pal mein, sach mein mehengi hai — ise har maujood entry ko naye badhaaye gaye bucket array mein rehash aur dobara-insert karna chahiye, ek \`O(n)\` operation us waqt maujood jitni bhi entries thi unke saapeksh. Agar ye keemat har akeli insert call par chukaayi jaati, insert ki complexity ka sahi varnan simply \`O(n)\` hota, \`O(1)\` nahi. Jo asal mein hota hai wo ye hai ki resizing durlabh roop se trigger hoti hai — khaas taur par, sirf tab jab load factor ek fixed threshold paar karta hai — aur kyunki bucket array har baar jab resize hoti hai size mein double hota hai, entries ki tadaad jo table AGLI resize zaruri hone se pehle rakh sakta hai bhi lagbhag double hoti hai. Iska matlab hai resizes entry counts par hoti hain jo geometrically badhti hain (lagbhag 12, 24, 48, 96, waghaira), aur un SAB resizes ke aar-paar perform kiya gaya rehashing kaam ki total tadaad jo table ko kisi aakhri size \`n\` tak badhaate hue hote hain \`n\` khud ke anupaat mein nikalti hai, \`n\` squared ya kisi tezi-se-badhti quantity ke nahi, khaas taur par is doubling pattern ki wajah se. Amortized vishleshan is total keemat ko lena hai, ek lambi sequence mein har operation ke aar-paar joda gaya (yahaan, \`n\` akele insert calls, jinmein se sirf ek chhoti tadaad asal mein ek resize trigger karti hai), aur ise samaan roop se un sab ke aar-paar divide karke prati-operation AVERAGE keemat tay karna, kisi akele operation ki worst-case keemat ko alag-thalag mein dekhne ke bajaye. Kyunki \`n\` inserts ke aar-paar total resizing keemat khud \`n\` ke anupaat mein hai, us total ko \`n\` akele inserts se divide karna prati-insert ek chhota constant average keemat deta hai — yahi bilkul wo hai jo "\`O(1)\` amortized" sanchaar karta hai: ye nahi ki har akeli insert call vyaktigat roop se ek chhoti constant tadaad kharch karti hai, kyunki kuch khaas calls sach mein mehengi hain, balki ye ki prati-insert AVERAGE keemat, operations ki ek lambi sequence ke aar-paar gani gayi, ek chhota constant hai, jo wo property hai jo asal mein kayi operations ke aar-paar ek hash table ki overall performance ke baare mein tark karne ke liye maayne rakhti hai.',
      },
      {
        q: 'Why does doubling the bucket size specifically matter for keeping insert amortized O(1), rather than simply growing the bucket array by a small fixed amount each time it needs to grow?',
        qHi: 'Insert ko amortized \`O(1)\` rakhne ke liye khaas taur par bucket size ko double karna kyun maayne rakhta hai, har baar jab bucket array ko badhne ki zaroorat hai ek chhote fixed amount se badhaane ke bajaye?',
        a: 'The specific mathematical property that keeps the total cost of all resizes proportional to n, rather than growing faster than n, depends directly on how quickly the bucket count grows each time a resize occurs. When the bucket array doubles in size at each resize, the entry counts at which successive resizes are triggered form a geometric sequence — each resize point is roughly twice the previous one. A well-known property of geometric sequences is that their sum is dominated by, and stays proportional to, the LAST term in the sequence, meaning the total rehashing work summed across every resize up to reaching n entries stays proportional to n itself. If, instead, the bucket array grew by adding only some small, fixed number of additional buckets at each resize (for instance, always adding exactly 16 more buckets, regardless of the table\'s current size), the entry counts at which resizes are triggered would instead form an arithmetic sequence, spaced linearly rather than geometrically. This means that as the table grows larger, resizes would need to happen increasingly often relative to how large the table already is, and critically, the total rehashing work summed across all of these more-frequent resizes grows faster than n — proportional to n squared, in fact, since each resize still costs O(current size) to rehash, and now there are O(n) such resizes instead of O(log n) of them. Dividing this n-squared total cost across n individual inserts yields an average cost per insert that is proportional to n, not a constant, meaning insert would no longer genuinely be O(1) amortized under a fixed-increment growth strategy — it is specifically the exponential, doubling growth pattern that keeps the total resizing cost low enough, relative to the number of entries added, for the amortized average to work out to a constant.',
        aHi: 'Wo khaas mathematical property jo sab resizes ki total keemat ko \`n\` ke anupaat mein rakhti hai, \`n\` se tez badhne ke bajaye, seedhe is baat par nirbhar karti hai ki bucket count har baar jab ek resize hoti hai kitni tezi se badhta hai. Jab bucket array har resize par size mein double hota hai, wo entry counts jinpar successive resizes trigger hoti hain ek geometric sequence banate hain — har resize point pichle se lagbhag dooguna hai. Geometric sequences ki ek jaani-pehchaani property ye hai ki unka sum sequence ke AAKHRI term dwara dominant hota hai, aur uske anupaat mein rehta hai, matlab \`n\` entries tak pahunchne tak har resize ke aar-paar joda gaya total rehashing kaam \`n\` khud ke anupaat mein rehta hai. Agar, iske bajaye, bucket array har resize par sirf kuch chhote, fixed tadaad ke atirikt buckets jodkar badhta (misal ke taur par, hamesha bilkul 16 aur buckets jodte hue, table ki current size se azaad), wo entry counts jinpar resizes trigger hoti hain iske bajaye ek arithmetic sequence banaate, linearly spaced geometrically ke bajaye. Iska matlab hai jaise table bada hota hai, resizes ko table ke pehle se kitna bada hai iske saapeksh badhti hui baar hone ki zaroorat hogi, aur mahatvapoorn baat, in zyaada-baar-hone-waali resizes ke aar-paar joda gaya total rehashing kaam \`n\` se tez badhta hai — asal mein \`n\` squared ke anupaat mein, kyunki har resize abhi bhi rehash karne ke liye \`O(current size)\` kharch karta hai, aur ab unke \`O(log n)\` ke bajaye \`O(n)\` aisi resizes hain. Is \`n\`-squared total keemat ko \`n\` akele inserts ke aar-paar divide karna prati-insert ek average keemat deta hai jo \`n\` ke anupaat mein hai, ek constant nahi, matlab insert ab sach mein amortized \`O(1)\` nahi hoga ek fixed-increment growth strategy ke neeche — ye khaas taur par exponential, doubling growth pattern hai jo total resizing keemat ko kaafi kam rakhta hai, jodi gayi entries ki tadaad ke saapeksh, amortized average ko ek constant ban jaane ke liye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken FixedHashTable and the fixed ResizingHashTable from this lesson. Insert 100,000 distinct keys into each, then log the average bucket size (total entries divided by bucket count) for both.',
        taskHi: 'Is lesson ka toota \`FixedHashTable\` aur theek \`ResizingHashTable\` dono banao. Har ek mein 100,000 alag keys insert karo, phir dono ke liye average bucket size log karo (total entries ko bucket count se divide kiya gaya).',
        hint: 'Generate 100,000 distinct keys using a loop appending an incrementing number to a string, like `key-${i}`.',
        hintHi: 'Ek loop istemal karke 100,000 alag keys banao jo ek badhte number ko ek string mein jodta hai, jaisa \`key-${i}\`.',
      },
      {
        task: 'Add a console.log inside resize() logging the old and new bucket counts every time it runs, then insert enough entries to trigger several resizes. Confirm the bucket count genuinely doubles each time.',
        taskHi: '\`resize()\` ke andar ek \`console.log\` jodo jo purana aur naya bucket count log karta hai har baar jab ye chalta hai, phir itni entries insert karo ki kayi resizes trigger hon. Confirm karo ki bucket count sach mein har baar double hoti hai.',
        hint: 'Insert entries in a loop and watch the console output to see resizes happening at roughly 12, 24, 48, 96 entries, matching this lesson\'s explanation.',
        hintHi: 'Ek loop mein entries insert karo aur console output dekho resizes ko lagbhag 12, 24, 48, 96 entries par hote hue dekhne ke liye, is lesson ke spashteekaran se mel khaate hue.',
      },
      {
        task: 'Deliberately introduce the bug from this lesson\'s third mistake (rehashing against the OLD bucket count during resize). Insert enough entries to trigger a resize, then confirm get() incorrectly fails to find entries that were inserted before the resize.',
        taskHi: 'Is lesson ki teesri galti ka bug jaan-boojhkar introduce karo (resize ke dauraan PURANI bucket count ke khilaaf rehash karna). Itni entries insert karo ki ek resize trigger ho, phir confirm karo ki \`get()\` galti se un entries ko dhoondhne mein fail hota hai jo resize se pehle insert ki gayi thi.',
        hint: 'Insert a specific, easily recognizable key before triggering the resize, then try to get() it afterward to see the failure directly.',
        hintHi: 'Resize trigger karne se pehle ek khaas, aasaani se pehchaanne-yogya key insert karo, phir baad mein failure ko seedhe dekhne ke liye ise \`get()\` karne ki koshish karo.',
      },
    ],

    keyTakeaways: [
      'A hash table with a permanently fixed bucket count performs beautifully at small scale, then silently degrades toward O(n) lookups as more entries are added, regardless of hash function quality.',
      'Load factor (entries divided by bucket count) is checked before insertion, and resizing (rebuilding into a larger bucket array) happens once it crosses a threshold, typically 0.75.',
      'Resizing itself is a genuinely expensive O(n) operation, since every existing entry must be rehashed against the new, larger bucket count and re-inserted.',
      'Doubling the bucket count at each resize, rather than growing it by a small fixed amount, is what keeps the total cost of all resizes proportional to n rather than n squared.',
      'Spreading the total resizing cost across all n insert operations gives insertion an O(1) AMORTIZED average cost, even though any single insert call that triggers a resize is genuinely O(n) at that moment.',
      'Shrinking a hash table when load factor drops too low is a secondary, often-skipped design decision, since an oversized but functional bucket array wastes memory but does not break correctness or average lookup cost.',
    ],
    keyTakeawaysHi: [
      'Ek hash table jismein hamesha ke liye fixed bucket count hai chhoti scale par khoobsoorti se perform karti hai, phir chupchaap \`O(n)\` lookups ki taraf degrade hoti hai jaise zyaada entries jodi jaati hain, hash function ki quality se azaad.',
      'Load factor (entries ko bucket count se divide kiya gaya) insertion se pehle check kiya jaata hai, aur resizing (ek bade bucket array mein dobara banaana) hoti hai ek baar ye ek threshold paar karta hai, aksar \`0.75\`.',
      'Resizing khud ek sach mein mehenga \`O(n)\` operation hai, kyunki har maujood entry ko naye, bade bucket count ke khilaaf rehash aur dobara-insert kiya jaana chahiye.',
      'Har resize par bucket count ko double karna, ise ek chhote fixed amount se badhaane ke bajaye, wahi hai jo sab resizes ki total keemat ko \`n\` ke anupaat mein rakhta hai \`n\` squared ke bajaye.',
      'Total resizing keemat ko sab \`n\` insert operations ke aar-paar failaana insertion ko ek \`O(1)\` AMORTIZED average keemat deta hai, chahe koi bhi akela insert call jo ek resize trigger karta hai us pal genuinely \`O(n)\` ho.',
      'Ek hash table ko simataana jab load factor bahut kam gir jaaye ek dvitiyak, aksar-chhoda-jaane-waala design faisla hai, kyunki ek zyaada-bada par kaam karta bucket array memory barbaad karta hai par sahihata ya average lookup keemat nahi todta.',
    ],
  },
];
