/**
 * JavaScript Complete Course — Module 3: Working With Real Data (2 of 2).
 *
 * Map/Set and iterators/generators — the collection types people reach for far
 * too late, and the protocol that makes `for...of` and spread work at all.
 *
 * Same writing rules as Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_3_PART2: CourseLesson[] = [
  /* ══════════════════════ Map, Set, WeakMap ══════════════════════ */
  {
    slug: 'map-set-weakmap',
    title: 'Map, Set and WeakMap',
    titleHi: 'Map, Set aur WeakMap',
    description: 'A guest list that refuses duplicates, and a register whose keys can be anything.',
    descriptionHi: 'Aisi guest list jo duplicate nahi leti, aur aisa register jiski keys kuch bhi ho sakti hain.',
    difficulty: 'MEDIUM',
    duration: 30,
    order: 4,

    analogy: {
      en: '**A wedding guest list and a hotel register.** The guest list refuses to write the same name twice — that is a **Set**. The hotel register pairs each guest with a room, and the "guest" can be a person, a company, anything — that is a **Map**. A plain object is a register that insists every guest\'s name be written as text.',
      hi: '**Shaadi ki guest list aur hotel ka register.** Guest list ek hi naam do baar likhne se mana kar deti hai — wo **Set** hai. Hotel register har mehmaan ko ek kamre se jodta hai, aur "mehmaan" koi vyakti, company, kuch bhi ho sakta hai — wo **Map** hai. Plain object aisa register hai jo zid karta hai ki har mehmaan ka naam text mein hi likha jaye.',
    },

    simple: `**Set — a list that refuses duplicates.**

\`\`\`js
const guests = new Set();

guests.add('Jay');
guests.add('Ravi');
guests.add('Jay');      // ignored, already there

guests.size;            // 2
guests.has('Jay');      // true
\`\`\`

The single most useful thing it does — removing duplicates from an array — is one line:

\`\`\`js
[...new Set([1, 2, 2, 3, 3, 3])];   // [1, 2, 3]
\`\`\`

**Map — a register where the key can be anything.**

A plain object forces every key to be a string. A Map does not:

\`\`\`js
const map = new Map();

map.set('name', 'Jay');
map.set(42, 'the answer');
map.set(someObject, 'metadata');   // an OBJECT as the key

map.get(42);        // 'the answer'
map.size;           // 3
\`\`\`

**Why not just use an object?**

\`\`\`js
const obj = {};
obj[1] = 'number one';
obj['1'] = 'string one';
Object.keys(obj);        // ['1']  — they collided!

const map = new Map();
map.set(1, 'number one');
map.set('1', 'string one');
map.size;                // 2  — kept separate
\`\`\`

Objects silently convert every key to a string. Map keeps the type.

**Four reasons to reach for Map**

1. Keys that are not strings — numbers, objects, functions
2. You need \`.size\` (objects make you count keys yourself)
3. You add and delete a lot — Map is built for it
4. Insertion order is guaranteed, always

**WeakMap — the one with a memory-safe twist**

A normal Map holds its keys alive forever. A WeakMap does not: when nothing else references the key object, the entry disappears automatically.

\`\`\`js
const cache = new WeakMap();
cache.set(domNode, expensiveData);
// remove domNode from the page and the cache entry is collected too
\`\`\`

Use it to attach private data to objects you do not own, without causing a leak.

**Remember:** Set for uniqueness, Map for non-string keys, WeakMap when you must not hold on.`,

    simpleHi: `**Set — aisi list jo duplicate nahi leti.**

\`\`\`js
const guests = new Set();

guests.add('Jay');
guests.add('Ravi');
guests.add('Jay');      // ignore, pehle se hai

guests.size;            // 2
guests.has('Jay');      // true
\`\`\`

Iska sabse kaam ka istemaal — array se duplicates hataana — ek line hai:

\`\`\`js
[...new Set([1, 2, 2, 3, 3, 3])];   // [1, 2, 3]
\`\`\`

**Map — aisa register jiski key kuch bhi ho sakti hai.**

Plain object har key ko string banne par majboor karta hai. Map nahi:

\`\`\`js
const map = new Map();

map.set('name', 'Jay');
map.set(42, 'the answer');
map.set(someObject, 'metadata');   // key ke roop mein OBJECT

map.get(42);        // 'the answer'
map.size;           // 3
\`\`\`

**Object hi kyun na use karein?**

\`\`\`js
const obj = {};
obj[1] = 'number one';
obj['1'] = 'string one';
Object.keys(obj);        // ['1']  — takra gaye!

const map = new Map();
map.set(1, 'number one');
map.set('1', 'string one');
map.size;                // 2  — alag rahe
\`\`\`

Objects chup-chaap har key ko string bana dete hain. Map type bacha kar rakhta hai.

**Map chunne ke chaar kaaran**

1. Aisi keys jo string nahi hain — numbers, objects, functions
2. \`.size\` chahiye (objects mein keys khud ginni padti hain)
3. Bahut add aur delete karte ho — Map isi ke liye bana hai
4. Insertion order hamesha guaranteed hai

**WeakMap — memory-safe modh wala**

Normal Map apni keys hamesha zinda rakhta hai. WeakMap nahi: jab aur koi us key object ko reference nahi karta, entry apne aap gayab ho jati hai.

\`\`\`js
const cache = new WeakMap();
cache.set(domNode, expensiveData);
// domNode page se hatao aur cache entry bhi collect ho jati hai
\`\`\`

Ise un objects par private data lagane ke liye use karo jo aapke nahi hain, bina leak kiye.

**Yaad rakho:** uniqueness ke liye Set, non-string keys ke liye Map, aur jab pakadna hi nahi hai tab WeakMap.`,

    content: `## Object versus Map

| | Object | Map |
|---|---|---|
| Key types | string, symbol only | **anything** |
| Size | \`Object.keys(o).length\` | \`m.size\` |
| Order | mostly insertion, integers first | **always** insertion |
| Iterate | \`Object.entries(o)\` | directly with \`for...of\` |
| Inherited keys | yes, via prototype | none |
| JSON | native | needs conversion |

That "integers first" row is a real surprise:

\`\`\`js
const o = { b: 1, 2: 2, a: 3, 1: 4 };
Object.keys(o);   // ['1', '2', 'b', 'a']  — numbers jumped to the front
\`\`\`

A Map would have kept \`b, 2, a, 1\`.

## Set operations

\`\`\`js
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const union        = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference   = new Set([...a].filter(x => !b.has(x)));
\`\`\`

Note \`b.has(x)\` is O(1), while \`array.includes(x)\` is O(n). For a lookup inside a loop over 10,000 items, that is the difference between instant and noticeably slow.

## Equality is by reference

\`\`\`js
const s = new Set();
s.add({ a: 1 });
s.add({ a: 1 });
s.size;   // 2 — two different objects that merely look alike
\`\`\`

Set and Map compare objects by identity, not by contents. To deduplicate objects by value, key on something primitive — an id, or a JSON string.

## Converting

\`\`\`js
[...set]                        // Set  → array
new Set(array)                  // array → Set
Object.fromEntries(map)         // Map  → object (string keys only)
new Map(Object.entries(obj))    // object → Map
[...map]                        // Map  → array of [key, value] pairs
\`\`\`

## WeakMap and WeakSet

Keys must be objects, entries vanish when the key is garbage collected, and they are not iterable — you cannot list what is inside, precisely because entries may disappear at any moment. Use them for caches and for private data keyed on an object, never as a general collection.`,

    contentHi: `## Object versus Map

| | Object | Map |
|---|---|---|
| Key types | sirf string, symbol | **kuch bhi** |
| Size | \`Object.keys(o).length\` | \`m.size\` |
| Order | zyadatar insertion, integers pehle | **hamesha** insertion |
| Iterate | \`Object.entries(o)\` | seedhe \`for...of\` se |
| Inherited keys | haan, prototype se | koi nahi |
| JSON | native | convert karna padta hai |

Wo "integers pehle" wali row sach mein chaunkati hai:

\`\`\`js
const o = { b: 1, 2: 2, a: 3, 1: 4 };
Object.keys(o);   // ['1', '2', 'b', 'a']  — numbers aage kood gaye
\`\`\`

Map ne \`b, 2, a, 1\` hi rakha hota.

## Set operations

\`\`\`js
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const union        = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference   = new Set([...a].filter(x => !b.has(x)));
\`\`\`

Dhyan do \`b.has(x)\` O(1) hai, jabki \`array.includes(x)\` O(n). 10,000 items ke loop ke andar lookup ke liye ye turant aur saaf dikhne wali slowness ka fark hai.

## Barabari reference se hoti hai

\`\`\`js
const s = new Set();
s.add({ a: 1 });
s.add({ a: 1 });
s.size;   // 2 — do alag objects jo bas dekhne mein ek jaise hain
\`\`\`

Set aur Map objects ko identity se compare karte hain, contents se nahi. Objects ko value se dedupe karna ho to kisi primitive par key banao — ek id, ya JSON string.

## Convert karna

\`\`\`js
[...set]                        // Set  → array
new Set(array)                  // array → Set
Object.fromEntries(map)         // Map  → object (sirf string keys)
new Map(Object.entries(obj))    // object → Map
[...map]                        // Map  → [key, value] jodon ki array
\`\`\`

## WeakMap aur WeakSet

Keys objects hi honi chahiye, key garbage collect hote hi entries gayab ho jati hain, aur ye iterable nahi hain — andar kya hai ye list nahi kar sakte, theek isiliye ki entries kabhi bhi gayab ho sakti hain. Inhe caches aur object par lagi private data ke liye use karo, general collection ki tarah kabhi nahi.`,

    examples: [
      {
        title: 'Set removes duplicates',
        titleHi: 'Set duplicates hata deta hai',
        code: `const nums = [1, 2, 2, 3, 3, 3, 4];

const unique = [...new Set(nums)];
console.log(unique);

const s = new Set(['a', 'b', 'a']);
console.log(s.size, s.has('a'), s.has('z'));`,
        output: `[ 1, 2, 3, 4 ]
2 true false`,
        explain: 'The one-liner is the reason most people learn Set at all. `has` is O(1) — it does not scan, it looks up directly.',
        explainHi: 'Zyadatar log Set isi ek line ke liye seekhte hain. `has` O(1) hai — wo scan nahi karta, seedhe dhoondh leta hai.',
      },
      {
        title: 'Set operations',
        titleHi: 'Set operations',
        code: `const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

console.log([...new Set([...a, ...b])]);
console.log([...a].filter(x => b.has(x)));
console.log([...a].filter(x => !b.has(x)));`,
        output: `[ 1, 2, 3, 4, 5, 6 ]
[ 3, 4 ]
[ 1, 2 ]`,
        explain: 'Union, intersection, difference. Spreading into an array to use `filter`, then checking membership with `has`, is the standard idiom.',
        explainHi: 'Union, intersection, difference. `filter` use karne ke liye array mein spread karna, phir `has` se membership check karna — yahi standard idiom hai.',
      },
      {
        title: 'Why not just an object',
        titleHi: 'Sirf object kyun nahi',
        code: `const obj = {};
obj[1] = 'number';
obj['1'] = 'string';
console.log(Object.keys(obj), obj[1]);

const map = new Map();
map.set(1, 'number');
map.set('1', 'string');
console.log(map.size, map.get(1), map.get('1'));`,
        output: `[ '1' ] string
2 number string`,
        explain: 'The object silently merged the two keys and lost data. The Map kept them apart because it compares the key\'s type as well as its value.',
        explainHi: 'Object ne chup-chaap dono keys mila di aur data kho diya. Map ne unhe alag rakha kyunki wo key ki value ke saath uska type bhi dekhta hai.',
      },
      {
        title: 'Objects as keys',
        titleHi: 'Objects ko key banana',
        code: `const user1 = { id: 1, name: 'Jay' };
const user2 = { id: 2, name: 'Ravi' };

const lastSeen = new Map();
lastSeen.set(user1, '2024-06-15');
lastSeen.set(user2, '2024-06-14');

console.log(lastSeen.get(user1));
console.log(lastSeen.get({ id: 1, name: 'Jay' }));`,
        output: `2024-06-15
undefined`,
        explain: 'The last line is the crucial detail: an identical-looking object is a *different* object. Map keys match by identity, never by contents.',
        explainHi: 'Aakhri line hi asli baat hai: bilkul ek jaisa dikhne wala object *alag* object hota hai. Map keys identity se match hoti hain, contents se kabhi nahi.',
      },
      {
        title: 'Iterating a Map',
        titleHi: 'Map par ghoomna',
        code: `const scores = new Map([
  ['Jay', 90],
  ['Ravi', 85],
  ['Amit', 78],
]);

for (const [name, score] of scores) {
  console.log(name, score);
}

console.log([...scores.keys()]);
console.log(Math.max(...scores.values()));`,
        output: `Jay 90
Ravi 85
Amit 78
[ 'Jay', 'Ravi', 'Amit' ]
90`,
        explain: 'A Map is directly iterable and yields `[key, value]` pairs, so destructuring in the `for...of` header just works. No `Object.entries` needed.',
        explainHi: 'Map seedhe iterable hai aur `[key, value]` jode deta hai, isliye `for...of` header mein destructuring seedhe chal jati hai. `Object.entries` ki zarurat hi nahi.',
      },
      {
        title: 'Insertion order is guaranteed',
        titleHi: 'Insertion order guaranteed hai',
        code: `const obj = { b: 1, 2: 2, a: 3, 1: 4 };
console.log(Object.keys(obj));

const map = new Map([['b', 1], [2, 2], ['a', 3], [1, 4]]);
console.log([...map.keys()]);`,
        output: `[ '1', '2', 'b', 'a' ]
[ 'b', 2, 'a', 1 ]`,
        explain: 'The object reordered itself — integer-like keys are sorted numerically and moved to the front. The Map preserved exactly what you inserted. If order matters, this alone is a reason to use Map.',
        explainHi: 'Object ne khud ko dobara kram mein laga liya — integer jaisi keys numerically sort hokar aage aa gayin. Map ne bilkul wahi rakha jo aapne daala. Agar order matter karta hai to sirf yahi Map use karne ka kaaran hai.',
      },
      {
        title: 'Set does not deduplicate objects by value',
        titleHi: 'Set objects ko value se dedupe nahi karta',
        code: `const items = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 1, name: 'a' },
];

console.log(new Set(items).size);

const byId = [...new Map(items.map(i => [i.id, i])).values()];
console.log(byId.length, byId);`,
        output: `3
2 [ { id: 1, name: 'a' }, { id: 2, name: 'b' } ]`,
        explain: 'Three distinct objects, so the Set kept all three. Keying a Map on `id` deduplicates properly — and later entries overwrite earlier ones with the same key.',
        explainHi: 'Teen alag objects the, isliye Set ne teeno rakhe. `id` par Map banane se sahi dedupe hota hai — aur ek hi key wali baad ki entries pehli ko overwrite kar deti hain.',
      },
      {
        title: 'Set lookup versus array lookup',
        titleHi: 'Set lookup versus array lookup',
        code: `const size = 50_000;
const arr = Array.from({ length: size }, (_, i) => i);
const set = new Set(arr);

console.time('array');
for (let i = 0; i < 1000; i++) arr.includes(size - 1);
console.timeEnd('array');

console.time('set');
for (let i = 0; i < 1000; i++) set.has(size - 1);
console.timeEnd('set');`,
        output: `array: 41.2ms
set: 0.09ms`,
        explain: 'Roughly 450x faster for the same answer. `includes` walks the array every time; `has` jumps straight to the value. Any membership check inside a loop should use a Set.',
        explainHi: 'Wahi jawab, lagbhag 450 guna tez. `includes` har baar poori array chalta hai; `has` seedhe value tak pahunch jata hai. Loop ke andar koi bhi membership check Set se hona chahiye.',
      },
      {
        title: 'WeakMap does not hold on',
        titleHi: 'WeakMap pakad kar nahi rakhta',
        code: `const strong = new Map();
const weak = new WeakMap();

let key = { id: 1 };
strong.set(key, 'data');
weak.set(key, 'data');

console.log(strong.size, weak.has(key));

key = null;   // the only reference is gone

console.log('strong still holds it:', strong.size);
console.log('weak cannot even be counted — no .size by design');`,
        output: `1 true
strong still holds it: 1
weak cannot even be counted — no .size by design`,
        explain: 'The strong Map keeps the now-unreachable object alive forever — a leak. The WeakMap lets it be collected. That is also why a WeakMap has no `.size` and cannot be iterated: its contents can change at any moment.',
        explainHi: 'Strong Map us ab-na-pahunchne-yogya object ko hamesha zinda rakhta hai — leak. WeakMap use collect hone deta hai. Isiliye WeakMap mein `.size` nahi hota aur wo iterate bhi nahi hota: uske contents kabhi bhi badal sakte hain.',
      },
    ],

    mistakes: [
      {
        wrong: `const seen = [];\nfor (const x of huge) if (!seen.includes(x)) seen.push(x);  // ❌ O(n²)`,
        right: `const seen = new Set(huge);  // ✅ O(n)`,
        why: '`includes` scans the whole array on every iteration. A Set turns quadratic work into linear work.',
        whyHi: '`includes` har iteration mein poori array scan karta hai. Set quadratic kaam ko linear bana deta hai.',
      },
      {
        wrong: `const unique = new Set(objects);  // ❌ identical-looking objects both stay`,
        right: `const unique = [...new Map(objects.map(o => [o.id, o])).values()];  // ✅`,
        why: 'Set compares objects by reference. Deduplicate on a primitive key such as an id.',
        whyHi: 'Set objects ko reference se compare karta hai. Kisi primitive key par dedupe karo, jaise id.',
      },
      {
        wrong: `JSON.stringify(myMap);  // ❌ '{}'`,
        right: `JSON.stringify(Object.fromEntries(myMap));  // ✅ (string keys only)`,
        why: 'JSON has no Map type, so it serialises as an empty object. Convert to a plain object or an array of pairs first.',
        whyHi: 'JSON mein Map type hota hi nahi, isliye wo khaali object bankar serialise hota hai. Pehle plain object ya jodon ki array mein convert karo.',
      },
      {
        wrong: `map.length;  // ❌ undefined`,
        right: `map.size;  // ✅`,
        why: 'Arrays and strings have `length`; Map and Set have `size`. Mixing them up returns `undefined` rather than an error.',
        whyHi: 'Arrays aur strings mein `length` hoti hai; Map aur Set mein `size`. Inhe mila dene par error ke bajaye `undefined` milta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Deduplicating ids.** Selected rows, tag lists and "already processed" markers are all Sets — `has` in a loop is the whole reason.',
        hi: '**Ids dedupe karna.** Selected rows, tag lists aur "pehle se process ho chuka" markers sab Sets hain — loop ke andar `has` hi poora kaaran hai.',
      },
      {
        en: '**Caching by object.** A `WeakMap` keyed on a DOM node or a request object attaches computed data without ever preventing that object from being collected.',
        hi: '**Object par cache.** DOM node ya request object par key wala `WeakMap` computed data jodta hai bina us object ko collect hone se roke.',
      },
      {
        en: '**Ordered lookups.** A Map is the natural structure for an LRU cache or any registry where insertion order is part of the behaviour, because that order is guaranteed.',
        hi: '**Ordered lookups.** LRU cache ya aise kisi registry ke liye Map swabhavik structure hai jahan insertion order behaviour ka hissa hai, kyunki wo order guaranteed hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a Map and a plain object?',
        qHi: 'Map aur plain object mein kya fark hai?',
        a: 'Map accepts any value as a key including objects and functions, guarantees insertion order, exposes `.size`, is directly iterable, and has no prototype chain so no inherited keys. Objects coerce every key to a string, reorder integer-like keys to the front, and inherit from `Object.prototype`.',
        aHi: 'Map kisi bhi value ko key maanta hai, objects aur functions bhi, insertion order guarantee karta hai, `.size` deta hai, seedhe iterable hai, aur uska prototype chain na hone se inherited keys nahi hoti. Objects har key ko string bana dete hain, integer jaisi keys ko aage kar dete hain, aur `Object.prototype` se inherit karte hain.',
      },
      {
        q: 'When would you use a Set instead of an array?',
        qHi: 'Array ke bajaye Set kab use karoge?',
        a: 'When values must be unique, or when you need fast membership checks. `Set.has` is O(1) while `Array.includes` is O(n), which matters enormously inside a loop. Arrays remain better when you need indexing, ordering operations or duplicates.',
        aHi: 'Jab values unique honi chahiye, ya jab tez membership check chahiye. `Set.has` O(1) hai jabki `Array.includes` O(n), aur loop ke andar ye bahut zyada matter karta hai. Jab indexing, ordering ya duplicates chahiye tab arrays hi behtar hain.',
      },
      {
        q: 'Why does a Set not remove duplicate objects that look identical?',
        qHi: 'Set ek jaise dikhne wale duplicate objects kyun nahi hataata?',
        a: 'Because it compares by reference using SameValueZero, not by structural equality. Two separately created objects with identical contents are different values. To deduplicate by content, key a Map on a primitive derived from the object, such as its id.',
        aHi: 'Kyunki wo SameValueZero se reference compare karta hai, structural equality se nahi. Alag-alag bane do objects, chahe contents ek jaise hon, alag values hain. Content se dedupe karna ho to object se nikale kisi primitive par Map banao, jaise uski id.',
      },
      {
        q: 'What is a WeakMap and when would you use one?',
        qHi: 'WeakMap kya hai aur kab use karoge?',
        a: 'A Map whose keys must be objects and are held weakly — when nothing else references a key, its entry is garbage collected. It is not iterable and has no size, because entries can vanish at any time. Use it to attach metadata or cached results to objects you do not own, without leaking memory.',
        aHi: 'Aisa Map jiski keys objects honi chahiye aur weakly pakdi jati hain — jab aur koi key ko reference nahi karta, uski entry garbage collect ho jati hai. Ye iterable nahi hai aur size nahi deta, kyunki entries kabhi bhi gayab ho sakti hain. Ise un objects par metadata ya cached results lagane ke liye use karo jo aapke nahi hain, bina memory leak kiye.',
      },
      {
        q: 'How do you convert between these types?',
        qHi: 'In types ke beech convert kaise karte hain?',
        a: 'Spread a Set or Map into an array, pass an array to the `Set`/`Map` constructor, and use `Object.entries`/`Object.fromEntries` to move between Map and object. Note the object conversion only works when every key is a string or symbol.',
        aHi: 'Set ya Map ko array mein spread karo, array ko `Set`/`Map` constructor ko do, aur Map aur object ke beech aane-jaane ke liye `Object.entries`/`Object.fromEntries` use karo. Dhyan do object conversion tabhi chalta hai jab har key string ya symbol ho.',
        code: `[...set]                      // Set → array
new Map(Object.entries(obj))  // object → Map
Object.fromEntries(map)       // Map → object`,
      },
    ],

    exercises: [
      {
        task: 'Write `unique(arr)` two ways — once with `filter` and `indexOf`, once with a `Set` — then time both on an array of 50,000 items.',
        taskHi: '`unique(arr)` do tarah se likho — ek baar `filter` aur `indexOf` se, ek baar `Set` se — phir 50,000 items ki array par dono ka time naapo.',
        hint: 'Use `console.time`/`console.timeEnd`. The filter version is O(n²) and will be dramatically slower.',
        hintHi: '`console.time`/`console.timeEnd` use karo. Filter wala version O(n²) hai aur bahut zyada slow hoga.',
      },
      {
        task: 'Write `wordFrequency(text)` returning a Map of word to count, sorted with the most frequent first.',
        taskHi: '`wordFrequency(text)` likho jo shabd se ginti ka Map de, sabse zyada aane wale pehle.',
        hint: 'Split on `/\\s+/`, build the Map with `map.set(w, (map.get(w) ?? 0) + 1)`, then `new Map([...map].sort((a, b) => b[1] - a[1]))`.',
        hintHi: '`/\\s+/` par split karo, `map.set(w, (map.get(w) ?? 0) + 1)` se Map banao, phir `new Map([...map].sort((a, b) => b[1] - a[1]))`.',
      },
      {
        task: 'Write `dedupeBy(items, key)` that removes duplicate objects by the given key, keeping the FIRST occurrence of each.',
        taskHi: '`dedupeBy(items, key)` likho jo di gayi key se duplicate objects hataye, aur har ek ka PEHLA occurrence rakhe.',
        hint: 'A Map keeps the LAST by default, so either reverse the input first, or use a Set of seen keys with `filter`.',
        hintHi: 'Map default mein AAKHRI rakhta hai, isliye ya to input pehle ulta karo, ya dekhi hui keys ka Set banakar `filter` use karo.',
      },
    ],

    keyTakeaways: [
      'Set stores unique values. `[...new Set(arr)]` deduplicates an array in one line.',
      'Map accepts any key type; objects silently coerce every key to a string.',
      '`Set.has` and `Map.get` are O(1) — far faster than `Array.includes` inside a loop.',
      'Map guarantees insertion order; objects move integer-like keys to the front.',
      'Both compare objects by reference, so identical-looking objects count as different.',
      'WeakMap keys are held weakly and can be collected — use it for caches, never as a listable collection.',
    ],
    keyTakeawaysHi: [
      'Set unique values rakhta hai. `[...new Set(arr)]` ek line mein array dedupe kar deta hai.',
      'Map koi bhi key type leta hai; objects chup-chaap har key ko string bana dete hain.',
      '`Set.has` aur `Map.get` O(1) hain — loop ke andar `Array.includes` se bahut tez.',
      'Map insertion order guarantee karta hai; objects integer jaisi keys ko aage kar dete hain.',
      'Dono objects ko reference se compare karte hain, isliye ek jaise dikhne wale objects alag gine jate hain.',
      'WeakMap ki keys weakly pakdi jati hain aur collect ho sakti hain — caches ke liye use karo, list karne wali collection ki tarah kabhi nahi.',
    ],
  },

  /* ══════════════════ Iterators & Generators ══════════════════ */
  {
    slug: 'iterators-generators',
    title: 'Iterators and Generators',
    titleHi: 'Iterators aur Generators',
    description: 'A vending machine, not a delivery truck — producing values one at a time, on demand.',
    descriptionHi: 'Vending machine, delivery truck nahi — ek baar mein ek value, jab maango tab.',
    difficulty: 'HARD',
    duration: 35,
    order: 5,

    analogy: {
      en: '**A vending machine versus a delivery truck.** The truck backs up and dumps all 500 snacks in your hallway at once. The vending machine gives you one when you press the button, and holds the rest until you ask again. An array is the truck. An iterator is the vending machine.',
      hi: '**Vending machine versus delivery truck.** Truck aakar 500 snacks ek saath aapke gallery mein daal deta hai. Vending machine button dabane par ek deti hai, aur baaki tab tak rakhti hai jab tak aap phir na maango. Array truck hai. Iterator vending machine hai.',
    },

    simple: `**An iterator hands you one value at a time.**

You have used iterators constantly without noticing:

\`\`\`js
for (const x of [1, 2, 3]) { }   // arrays
for (const c of 'hi') { }        // strings
for (const [k, v] of myMap) { }  // Maps
[...mySet]                       // spread
\`\`\`

All of these work because those types know how to produce values one at a time. That shared ability is called the **iterable protocol**, and \`for...of\` and \`...\` are built on it.

**A generator is the easy way to make your own.**

\`\`\`js
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

for (const n of countToThree()) {
  console.log(n);   // 1, 2, 3
}
\`\`\`

Two new pieces of syntax, and that is all:

- **\`function*\`** — the star means "this can pause"
- **\`yield\`** — "here is a value; wake me when you want the next one"

**This is the part that matters.** A normal function runs start to finish and returns once. A generator **pauses at every \`yield\`** and continues exactly where it stopped when you ask again.

\`\`\`js
function* gen() {
  console.log('starting');
  yield 'first';
  console.log('resumed!');
  yield 'second';
}

const g = gen();
g.next();   // logs 'starting', returns { value: 'first', done: false }
g.next();   // logs 'resumed!', returns { value: 'second', done: false }
g.next();   // { value: undefined, done: true }
\`\`\`

Nothing ran until you called \`next()\`. That is **lazy** evaluation.

**Why it is useful: infinite sequences**

\`\`\`js
function* naturals() {
  let n = 1;
  while (true) yield n++;   // this loop never ends
}
\`\`\`

An array of every natural number would crash your program. A generator gives you as many as you ask for and no more.

**Remember:** array = everything now. Generator = one at a time, only when asked.`,

    simpleHi: `**Iterator ek baar mein ek value deta hai.**

Aapne iterators baar-baar use kiye hain, bina dhyan diye:

\`\`\`js
for (const x of [1, 2, 3]) { }   // arrays
for (const c of 'hi') { }        // strings
for (const [k, v] of myMap) { }  // Maps
[...mySet]                       // spread
\`\`\`

Ye sab isliye chalta hai kyunki in types ko pata hai ki ek-ek karke values kaise banani hain. Isi saanjhi kshamta ko **iterable protocol** kehte hain, aur \`for...of\` aur \`...\` isi par khade hain.

**Generator apna khud ka banane ka aasan tarika hai.**

\`\`\`js
function* countToThree() {
  yield 1;
  yield 2;
  yield 3;
}

for (const n of countToThree()) {
  console.log(n);   // 1, 2, 3
}
\`\`\`

Do nayi syntax, aur bas:

- **\`function*\`** — star matlab "ye ruk sakta hai"
- **\`yield\`** — "ye lo ek value; agli chahiye to jagana"

**Yahi hissa asli hai.** Normal function shuru se ant tak chalta hai aur ek baar return karta hai. Generator **har \`yield\` par ruk jata hai** aur agli baar poochne par bilkul wahin se chalu hota hai jahan ruka tha.

\`\`\`js
function* gen() {
  console.log('shuru ho raha');
  yield 'pehla';
  console.log('phir chalu!');
  yield 'doosra';
}

const g = gen();
g.next();   // 'shuru ho raha' log, { value: 'pehla', done: false }
g.next();   // 'phir chalu!' log, { value: 'doosra', done: false }
g.next();   // { value: undefined, done: true }
\`\`\`

\`next()\` bulane tak kuch chala hi nahi. Isi ko **lazy** evaluation kehte hain.

**Ye kaam ka kyun hai: anant sequences**

\`\`\`js
function* naturals() {
  let n = 1;
  while (true) yield n++;   // ye loop kabhi khatam nahi hota
}
\`\`\`

Har prakritik sankhya ki array aapka program crash kar degi. Generator jitne maango utne deta hai, usse zyada ek bhi nahi.

**Yaad rakho:** array = sab kuch abhi. Generator = ek-ek karke, sirf jab maango.`,

    content: `## The iterable protocol

An object is iterable if it has a \`[Symbol.iterator]\` method returning an object with a \`next()\` that yields \`{ value, done }\`:

\`\`\`js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () => current <= last
        ? { value: current++, done: false }
        : { value: undefined, done: true },
    };
  },
};

[...range];   // [1, 2, 3]
\`\`\`

That is what \`for...of\` calls under the hood on every array you have ever looped over.

## The same thing with a generator

\`\`\`js
const range = {
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
\`\`\`

Same behaviour, a third of the code. Generators exist so you almost never write the protocol by hand.

## Delegating with yield*

\`\`\`js
function* inner() { yield 1; yield 2; }
function* outer() {
  yield 'start';
  yield* inner();      // hand over to another generator
  yield 'end';
}
[...outer()];   // ['start', 1, 2, 'end']
\`\`\`

## Two-way communication

\`next(value)\` sends a value *into* the generator, where it becomes the result of the paused \`yield\`:

\`\`\`js
function* dialogue() {
  const name = yield 'What is your name?';
  yield \`Hello, \${name}\`;
}

const d = dialogue();
d.next().value;        // 'What is your name?'
d.next('Jay').value;   // 'Hello, Jay'
\`\`\`

This two-way channel is how early async libraries such as co and redux-saga worked before \`async/await\` existed.

## Async generators

\`\`\`js
async function* pages(url) {
  let next = url;
  while (next) {
    const res = await fetch(next);
    const data = await res.json();
    yield* data.items;
    next = data.nextPage;
  }
}

for await (const item of pages('/api/items')) { … }
\`\`\`

Paginated APIs become a single loop, with the fetching hidden inside. Note \`for await\`, not \`for\`.

## When to reach for one

Use a generator for infinite or very large sequences, for lazy pipelines where you may stop early, and for paginated data. For a small array you already hold in memory, plain array methods are simpler and faster.`,

    contentHi: `## Iterable protocol

Koi object iterable hai agar usme \`[Symbol.iterator]\` method ho jo aisa object de jiske \`next()\` se \`{ value, done }\` aata ho:

\`\`\`js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () => current <= last
        ? { value: current++, done: false }
        : { value: undefined, done: true },
    };
  },
};

[...range];   // [1, 2, 3]
\`\`\`

Aapne aaj tak jitne arrays par loop chalaya, \`for...of\` andar-andar yahi bulata raha hai.

## Wahi cheez generator se

\`\`\`js
const range = {
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
\`\`\`

Wahi behaviour, ek tihai code. Generators isiliye hain ki aapko protocol haath se likhna hi na pade.

## yield* se sonpna

\`\`\`js
function* inner() { yield 1; yield 2; }
function* outer() {
  yield 'start';
  yield* inner();      // doosre generator ko sonp do
  yield 'end';
}
[...outer()];   // ['start', 1, 2, 'end']
\`\`\`

## Do-tarfa baatcheet

\`next(value)\` generator ke *andar* value bhejta hai, jahan wo ruke hue \`yield\` ka result ban jati hai:

\`\`\`js
function* dialogue() {
  const name = yield 'Aapka naam?';
  yield \`Hello, \${name}\`;
}

const d = dialogue();
d.next().value;        // 'Aapka naam?'
d.next('Jay').value;   // 'Hello, Jay'
\`\`\`

Yahi do-tarfa channel tha jispar \`async/await\` se pehle co aur redux-saga jaisi libraries chalti thin.

## Async generators

\`\`\`js
async function* pages(url) {
  let next = url;
  while (next) {
    const res = await fetch(next);
    const data = await res.json();
    yield* data.items;
    next = data.nextPage;
  }
}

for await (const item of pages('/api/items')) { … }
\`\`\`

Paginated APIs ek hi loop ban jate hain, fetching andar chhup jati hai. \`for await\` dhyan se dekho, sirf \`for\` nahi.

## Kab use karein

Generator anant ya bahut badi sequences ke liye, aise lazy pipelines ke liye jahan aap beech mein ruk sakte ho, aur paginated data ke liye. Jo chhoti array pehle se memory mein hai uske liye simple array methods hi saral aur tez hain.`,

    examples: [
      {
        title: 'Your first generator',
        titleHi: 'Aapka pehla generator',
        code: `function* colours() {
  yield 'red';
  yield 'green';
  yield 'blue';
}

for (const c of colours()) console.log(c);

console.log([...colours()]);`,
        output: `red
green
blue
[ 'red', 'green', 'blue' ]`,
        explain: 'Calling `colours()` does not run the body — it returns a generator object. The `for...of` loop is what actually drives it.',
        explainHi: '`colours()` bulane se body nahi chalti — wo generator object deta hai. `for...of` loop hi usse asal mein chalata hai.',
      },
      {
        title: 'Watching it pause',
        titleHi: 'Usse rukte hue dekhna',
        code: `function* gen() {
  console.log('  → body started');
  yield 1;
  console.log('  → resumed after first yield');
  yield 2;
  console.log('  → finishing');
}

const g = gen();
console.log('created — nothing ran yet');
console.log(g.next());
console.log(g.next());
console.log(g.next());`,
        output: `created — nothing ran yet
  → body started
{ value: 1, done: false }
  → resumed after first yield
{ value: 2, done: false }
  → finishing
{ value: undefined, done: true }`,
        explain: 'Read the interleaving carefully. The body runs only between `next()` calls, pausing at each `yield` and keeping all its local state alive in between.',
        explainHi: 'Interleaving dhyan se padho. Body sirf `next()` calls ke beech chalti hai, har `yield` par rukti hai aur beech mein apna saara local state zinda rakhti hai.',
      },
      {
        title: 'Infinite sequences are safe',
        titleHi: 'Anant sequences surakshit hain',
        code: `function* naturals() {
  let n = 1;
  while (true) yield n++;
}

const nums = naturals();
console.log(nums.next().value, nums.next().value, nums.next().value);

function* take(iter, count) {
  let i = 0;
  for (const v of iter) {
    if (i++ >= count) return;
    yield v;
  }
}

console.log([...take(naturals(), 5)]);`,
        output: `1 2 3
[ 1, 2, 3, 4, 5 ]`,
        explain: 'An infinite `while (true)` that does not hang, because it only advances when asked. `take` is the standard helper for pulling a finite slice out of an infinite source.',
        explainHi: 'Anant `while (true)` jo atakta nahi, kyunki wo tabhi aage badhta hai jab poocha jaye. `take` anant source se seemit tukda nikalne ka standard helper hai.',
      },
      {
        title: 'Lazy versus eager',
        titleHi: 'Lazy versus eager',
        code: `const eager = [1, 2, 3, 4, 5].map(n => {
  console.log('eager computing', n);
  return n * 2;
});

function* lazy(arr) {
  for (const n of arr) {
    console.log('lazy computing', n);
    yield n * 2;
  }
}

console.log('--- now taking just two ---');
const it = lazy([1, 2, 3, 4, 5]);
console.log(it.next().value, it.next().value);`,
        output: `eager computing 1
eager computing 2
eager computing 3
eager computing 4
eager computing 5
--- now taking just two ---
lazy computing 1
lazy computing 2
2 4`,
        explain: '`map` did all five computations immediately, even though you might only need two. The generator did exactly two. With expensive work or a huge list, that is the entire point.',
        explainHi: '`map` ne turant paanchon calculations kar dalin, chahe aapko sirf do chahiye thin. Generator ne bilkul do kiye. Mehnga kaam ya badi list ho to poora maqsad yahi hai.',
      },
      {
        title: 'Making your own object iterable',
        titleHi: 'Apne object ko iterable banana',
        code: `class Playlist {
  constructor(...songs) { this.songs = songs; }
  *[Symbol.iterator]() {
    for (const s of this.songs) yield s;
  }
}

const pl = new Playlist('song A', 'song B', 'song C');

for (const s of pl) console.log(s);
console.log([...pl]);
const [first] = pl;
console.log('first:', first);`,
        output: `song A
song B
song C
[ 'song A', 'song B', 'song C' ]
first: song A`,
        explain: 'One method and your class works with `for...of`, spread AND destructuring. All three are built on the same protocol, so you implement it once and get all of them.',
        explainHi: 'Ek method aur aapki class `for...of`, spread AUR destructuring — teeno ke saath chalne lagti hai. Teeno ek hi protocol par khade hain, isliye ek baar likho aur teeno mil jate hain.',
      },
      {
        title: 'yield* delegates',
        titleHi: 'yield* sonp deta hai',
        code: `function* letters() { yield 'a'; yield 'b'; }
function* digits() { yield 1; yield 2; }

function* combined() {
  yield 'start';
  yield* letters();
  yield* digits();
  yield* 'hi';        // strings are iterable too
  yield 'end';
}

console.log([...combined()]);`,
        output: `[ 'start', 'a', 'b', 1, 2, 'h', 'i', 'end' ]`,
        explain: '`yield*` hands control to any iterable and yields everything it produces. Note the string — anything iterable works, not only other generators.',
        explainHi: '`yield*` control kisi bhi iterable ko de deta hai aur uska sab kuch yield karta hai. String dhyan se dekho — koi bhi iterable chalta hai, sirf doosre generators nahi.',
      },
      {
        title: 'Sending values in',
        titleHi: 'Andar values bhejna',
        code: `function* conversation() {
  const name = yield 'What is your name?';
  const age = yield \`Hi \${name}, how old are you?\`;
  return \`\${name} is \${age}\`;
}

const c = conversation();
console.log(c.next().value);
console.log(c.next('Jay').value);
console.log(c.next(25).value);`,
        output: `What is your name?
Hi Jay, how old are you?
Jay is 25`,
        explain: 'The value passed to `next()` becomes the result of the `yield` the generator is paused on. Note the first `next()` takes no argument — there is no paused `yield` yet to receive it.',
        explainHi: '`next()` ko di gayi value us `yield` ka result ban jati hai jahan generator ruka hua hai. Pehli `next()` bina argument ke hai — abhi koi ruka hua `yield` hai hi nahi jo usse le sake.',
      },
      {
        title: 'A lazy pipeline',
        titleHi: 'Lazy pipeline',
        code: `function* naturals() { let n = 1; while (true) yield n++; }

function* filter(iter, fn) {
  for (const v of iter) if (fn(v)) yield v;
}

function* map(iter, fn) {
  for (const v of iter) yield fn(v);
}

function* take(iter, n) {
  let i = 0;
  for (const v of iter) {
    if (i++ >= n) return;
    yield v;
  }
}

const result = take(map(filter(naturals(), n => n % 3 === 0), n => n * 10), 4);
console.log([...result]);`,
        output: `[ 30, 60, 90, 120 ]`,
        explain: 'Filter, map and take composed over an infinite source, and only twelve numbers were ever generated. The array equivalent would have to build an infinite array first — impossible.',
        explainHi: 'Anant source ke upar filter, map aur take jode gaye, aur sirf baarah numbers hi bane. Array wala version pehle anant array banata — jo namumkin hai.',
      },
      {
        title: 'Async generator for paginated data',
        titleHi: 'Paginated data ke liye async generator',
        code: `async function* fakePages() {
  const pages = [
    { items: ['a', 'b'], next: 1 },
    { items: ['c', 'd'], next: 2 },
    { items: ['e'], next: null },
  ];
  let i = 0;
  while (i !== null) {
    const page = pages[i];
    yield* page.items;
    i = page.next;
  }
}

for await (const item of fakePages()) {
  console.log('got', item);
}`,
        output: `got a
got b
got c
got d
got e`,
        explain: 'The caller writes one flat loop and never thinks about pages, cursors or when to stop. `for await` is what drives an async generator — plain `for...of` will not.',
        explainHi: 'Caller ek simple loop likhta hai aur pages, cursors ya kab rukna hai iske baare mein sochta hi nahi. Async generator ko `for await` hi chalata hai — simple `for...of` nahi chalega.',
      },
    ],

    mistakes: [
      {
        wrong: `const g = gen();\nfor (const x of g) { }\nfor (const x of g) { }  // ❌ second loop gets nothing`,
        right: `for (const x of gen()) { }\nfor (const x of gen()) { }  // ✅ fresh generator each time`,
        why: 'A generator object is exhausted after one full pass. Call the generator function again to get a new one.',
        whyHi: 'Generator object ek poore chakkar ke baad khatam ho jata hai. Naya chahiye to generator function dobara bulao.',
      },
      {
        wrong: `function* infinite() { while (true) yield 1; }\n[...infinite()];  // ❌ hangs forever`,
        right: `[...take(infinite(), 10)];  // ✅ bound it first`,
        why: 'Spread and `Array.from` drain an iterator completely. Never apply them to an infinite generator without a limiting step.',
        whyHi: 'Spread aur `Array.from` iterator ko poora khaali kar dete hain. Anant generator par inhe bina seema wale step ke kabhi mat lagao.',
      },
      {
        wrong: `for (const x of asyncGen()) { }  // ❌ TypeError`,
        right: `for await (const x of asyncGen()) { }  // ✅`,
        why: 'An async generator implements `Symbol.asyncIterator`, which only `for await...of` knows how to drive.',
        whyHi: 'Async generator `Symbol.asyncIterator` implement karta hai, jise sirf `for await...of` chalana jaanta hai.',
      },
      {
        wrong: `function* gen() { … }\nconst arr = gen();\narr.map(x => x);  // ❌ not an array`,
        right: `const arr = [...gen()];\narr.map(x => x);  // ✅`,
        why: 'A generator object is an iterator, not an array — it has `next`, not `map` or `filter`. Spread it first if you want array methods.',
        whyHi: 'Generator object iterator hai, array nahi — usme `next` hota hai, `map` ya `filter` nahi. Array methods chahiye to pehle spread karo.',
      },
    ],

    realWorld: [
      {
        en: '**Paginated APIs.** An async generator turns "fetch page, check cursor, fetch next" into a single `for await` loop for the caller.',
        hi: '**Paginated APIs.** Async generator "page laao, cursor dekho, agla laao" ko caller ke liye ek `for await` loop bana deta hai.',
      },
      {
        en: '**Unique id generation.** `function* ids() { let i = 0; while (true) yield ++i; }` is a tidy counter with no shared mutable global.',
        hi: '**Unique id banana.** `function* ids() { let i = 0; while (true) yield ++i; }` ek saaf counter hai bina kisi shared mutable global ke.',
      },
      {
        en: '**Reading huge files.** Node streams are async iterables, so you process a multi-gigabyte file line by line with `for await` instead of loading it into memory.',
        hi: '**Badi files padhna.** Node streams async iterables hain, isliye aap kai gigabyte ki file ko memory mein load karne ke bajaye `for await` se line-ba-line process karte ho.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between an iterable and an iterator?',
        qHi: 'Iterable aur iterator mein kya fark hai?',
        a: 'An iterable has a `[Symbol.iterator]()` method that returns an iterator. An iterator has a `next()` method returning `{ value, done }`. Arrays, strings, Maps and Sets are iterables; the object `for...of` obtains from them is the iterator. A generator object is unusual in being both.',
        aHi: 'Iterable mein `[Symbol.iterator]()` method hota hai jo iterator deta hai. Iterator mein `next()` method hota hai jo `{ value, done }` deta hai. Arrays, strings, Maps aur Sets iterables hain; `for...of` unse jo object leta hai wo iterator hai. Generator object khaas hai kyunki wo dono hai.',
      },
      {
        q: 'What does `function*` and `yield` actually do?',
        qHi: '`function*` aur `yield` asal mein kya karte hain?',
        a: '`function*` declares a generator, which returns a generator object instead of running its body. `yield` pauses execution and hands a value out; the function resumes from that exact point, with all local state intact, on the next `next()` call.',
        aHi: '`function*` generator declare karta hai, jo body chalane ke bajaye generator object deta hai. `yield` execution rok kar ek value bahar deta hai; agli `next()` par function bilkul usi jagah se, apne saare local state ke saath, phir chalu ho jata hai.',
      },
      {
        q: 'Why would you use a generator instead of returning an array?',
        qHi: 'Array return karne ke bajaye generator kyun use karoge?',
        a: 'For laziness. Values are produced only when requested, so you can represent infinite sequences, avoid computing items the caller never uses, and keep memory flat regardless of sequence length. An array must be fully built and fully held.',
        aHi: 'Laziness ke liye. Values tabhi banti hain jab maangi jayein, isliye anant sequences bana sakte ho, wo items compute karne se bach sakte ho jo caller kabhi use hi nahi karega, aur sequence chahe kitni lambi ho memory flat rehti hai. Array poora banana aur poora rakhna padta hai.',
      },
      {
        q: 'What does `yield*` do?',
        qHi: '`yield*` kya karta hai?',
        a: 'It delegates to another iterable, yielding every value that iterable produces before continuing. It works with any iterable — another generator, an array, a string, a Set — and is the clean way to compose generators.',
        aHi: 'Wo kisi doosre iterable ko sonp deta hai, aur aage badhne se pehle us iterable ki har value yield karta hai. Ye kisi bhi iterable ke saath chalta hai — doosra generator, array, string, Set — aur generators ko jodne ka saaf tarika hai.',
      },
      {
        q: 'How do you make a custom class work with `for...of`?',
        qHi: 'Custom class ko `for...of` ke saath kaise chalate hain?',
        a: 'Implement `[Symbol.iterator]()`. The simplest way is a generator method — `*[Symbol.iterator]() { yield* this.items; }` — which then also enables spread and array destructuring, since all three use the same protocol.',
        aHi: '`[Symbol.iterator]()` implement karo. Sabse saral tarika generator method hai — `*[Symbol.iterator]() { yield* this.items; }` — jisse spread aur array destructuring bhi chalne lagte hain, kyunki teeno ek hi protocol use karte hain.',
        code: `class Bag {
  constructor(...items) { this.items = items; }
  *[Symbol.iterator]() { yield* this.items; }
}
[...new Bag(1, 2, 3)];   // [1, 2, 3]`,
      },
    ],

    exercises: [
      {
        task: 'Write `function* range(start, end, step = 1)` that yields numbers from start up to but not including end. Test it with `[...range(0, 10, 2)]`.',
        taskHi: '`function* range(start, end, step = 1)` likho jo start se end tak (end shaamil nahi) numbers de. `[...range(0, 10, 2)]` se test karo.',
        hint: 'A plain `for` loop with `yield i` inside is all it takes. Expected: [0, 2, 4, 6, 8].',
        hintHi: 'Bas ek simple `for` loop jiske andar `yield i` ho. Sahi jawab: [0, 2, 4, 6, 8].',
      },
      {
        task: 'Write `function* fibonacci()` yielding the sequence forever, plus `take(gen, n)`. Get the first 10 numbers without ever building an infinite array.',
        taskHi: '`function* fibonacci()` likho jo sequence hamesha deta rahe, aur `take(gen, n)` bhi. Pehle 10 numbers nikalo bina kabhi anant array banaye.',
        hint: 'Track two variables and swap them: `[a, b] = [b, a + b]` after each yield.',
        hintHi: 'Do variables rakho aur unhe badalte raho: har yield ke baad `[a, b] = [b, a + b]`.',
      },
      {
        task: 'Make a `Matrix` class iterable so that `for (const cell of matrix)` walks every cell row by row. Then confirm spread and destructuring work on it too.',
        taskHi: '`Matrix` class ko iterable banao taaki `for (const cell of matrix)` har cell ko row-ba-row ghoome. Phir confirm karo ki spread aur destructuring bhi uspar chalte hain.',
        hint: 'Use `*[Symbol.iterator]()` with a nested loop over rows and columns, yielding each cell.',
        hintHi: '`*[Symbol.iterator]()` mein rows aur columns par nested loop chalao aur har cell yield karo.',
      },
    ],

    keyTakeaways: [
      '`for...of`, spread and destructuring all run on the iterable protocol — implement it once, get all three.',
      '`function*` returns a generator object; the body does not run until `next()` is called.',
      '`yield` pauses and resumes exactly where it stopped, keeping all local state alive.',
      'Generators are lazy, so infinite sequences are safe — but never spread one without a limit.',
      '`yield*` delegates to any other iterable, which is how you compose generators.',
      'Async generators plus `for await...of` turn paginated APIs and huge files into one flat loop.',
    ],
    keyTakeawaysHi: [
      '`for...of`, spread aur destructuring sab iterable protocol par chalte hain — ek baar likho, teeno mil jate hain.',
      '`function*` generator object deta hai; `next()` bulane tak body chalti hi nahi.',
      '`yield` rokta hai aur bilkul wahin se phir chalu hota hai, saara local state zinda rakhte hue.',
      'Generators lazy hain, isliye anant sequences surakshit hain — par kisi ko bina seema ke spread kabhi mat karo.',
      '`yield*` kisi bhi doosre iterable ko sonp deta hai, aur generators aise hi jode jate hain.',
      'Async generators aur `for await...of` paginated APIs aur badi files ko ek simple loop bana dete hain.',
    ],
  },
];
