/**
 * JavaScript Complete Course — Module 1, the collections half.
 *
 * Arrays and objects: the two shapes almost all real data arrives in. Split out
 * of `course-js-module1.ts` for file size only; seeded as part of Module 1.
 *
 * Same writing rules as the rest of Module 1:
 *   1. Open with something from real life, not from programming.
 *   2. One idea per entry. If it needs two, it needs two lessons.
 *   3. No word the reader has not met yet, unless you define it in the sentence.
 *   4. Every example shows its output. Never make the reader guess.
 */

import type { CourseLesson } from './course-js-module1';

export const JS_MODULE_1_PART3: CourseLesson[] = [
  /* ══════════════════════ Arrays & Array Methods ══════════════════════ */
  {
    slug: 'arrays-and-methods',
    title: 'Arrays and Array Methods',
    titleHi: 'Arrays aur Array Methods',
    description: 'A numbered train of values, and the three methods that replace almost every loop you would write.',
    descriptionHi: 'Numbered coaches wali train, aur wo teen methods jo aapke lagbhag har loop ki jagah le lete hain.',
    difficulty: 'EASY',
    duration: 35,
    order: 7,

    analogy: {
      en: '**A train with numbered coaches.** Coach numbering starts at 0, not 1. `map` repaints every coach and gives you a new train. `filter` keeps only the coaches you want, as a new train. `reduce` melts the whole train down into one single thing.',
      hi: '**Numbered coaches wali train.** Coach ki ginti 0 se shuru hoti hai, 1 se nahi. `map` har coach ko naya rang deta hai aur nayi train deta hai. `filter` sirf pasand ke coaches rakhta hai, nayi train ban jaati hai. `reduce` poori train ko pighla kar ek hi cheez bana deta hai.',
    },

    simple: `**An array is a numbered list.**

\`\`\`js
const cart = ['shirt', 'shoes', 'cap'];

cart[0];        // 'shirt'  ← counting starts at ZERO
cart.length;    // 3
cart[cart.length - 1];  // 'cap'  ← the last one
\`\`\`

**Three methods replace almost every loop.** Learn these and you rarely write \`for\` again.

**\`map\` — change every item, get a new array of the same length**

\`\`\`js
const prices = [100, 200, 300];
const withTax = prices.map(p => p * 1.18);
// [118, 236, 354]
\`\`\`

*Repaint every coach.* Three in, three out.

**\`filter\` — keep only some items, get a shorter array**

\`\`\`js
const cheap = prices.filter(p => p < 250);
// [100, 200]
\`\`\`

*Keep only the coaches you want.* Your function answers yes or no; \`true\` keeps it.

**\`reduce\` — squash everything into one value**

\`\`\`js
const total = prices.reduce((sum, p) => sum + p, 0);
// 600
\`\`\`

*Melt the whole train into one lump.* The \`0\` at the end is the starting value.

**The rule that saves you hours**

Some methods **change** the original array. Some return a **new** one and leave the original alone.

- Changes the original: \`push\`, \`pop\`, \`shift\`, \`unshift\`, \`splice\`, \`sort\`, \`reverse\`
- Returns a new array: \`map\`, \`filter\`, \`slice\`, \`concat\`

If a value mysteriously changed somewhere else in your app, it was almost certainly one of the first group.

**Remember:** \`map\` = same size, \`filter\` = smaller, \`reduce\` = one value.`,

    simpleHi: `**Array ek numbered list hai.**

\`\`\`js
const cart = ['shirt', 'shoes', 'cap'];

cart[0];        // 'shirt'  ← ginti ZERO se shuru hoti hai
cart.length;    // 3
cart[cart.length - 1];  // 'cap'  ← aakhri wala
\`\`\`

**Teen methods lagbhag har loop ki jagah le lete hain.** Ye seekh lo to \`for\` shayad hi likhna pade.

**\`map\` — har item badlo, utni hi lambi nayi array milegi**

\`\`\`js
const prices = [100, 200, 300];
const withTax = prices.map(p => p * 1.18);
// [118, 236, 354]
\`\`\`

*Har coach ko naya rang do.* Teen andar, teen bahar.

**\`filter\` — sirf kuch items rakho, chhoti array milegi**

\`\`\`js
const cheap = prices.filter(p => p < 250);
// [100, 200]
\`\`\`

*Sirf pasand ke coaches rakho.* Aapka function haan ya na kehta hai; \`true\` matlab rakh lo.

**\`reduce\` — sab kuch dabakar ek value banao**

\`\`\`js
const total = prices.reduce((sum, p) => sum + p, 0);
// 600
\`\`\`

*Poori train pighla kar ek lump.* Aakhir wala \`0\` shuruaati value hai.

**Wo rule jo aapke ghante bachayega**

Kuch methods original array ko **badal** dete hain. Kuch **nayi** array dete hain aur original ko haath nahi lagate.

- Original badal dete hain: \`push\`, \`pop\`, \`shift\`, \`unshift\`, \`splice\`, \`sort\`, \`reverse\`
- Nayi array dete hain: \`map\`, \`filter\`, \`slice\`, \`concat\`

Agar app mein kahin koi value rahasyamayi tarike se badal gayi, to lagbhag pakka pehle group ka koi method tha.

**Yaad rakho:** \`map\` = utni hi badi, \`filter\` = chhoti, \`reduce\` = ek value.`,

    content: `## The methods worth knowing

| Method | Returns | Changes original? |
|---|---|---|
| \`map(fn)\` | new array, same length | no |
| \`filter(fn)\` | new array, ≤ length | no |
| \`reduce(fn, init)\` | one value | no |
| \`find(fn)\` | first match, or \`undefined\` | no |
| \`findIndex(fn)\` | index of first match, or \`-1\` | no |
| \`some(fn)\` | \`true\` if **any** match | no |
| \`every(fn)\` | \`true\` if **all** match | no |
| \`includes(v)\` | \`true\` if value present | no |
| \`slice(a, b)\` | a copied section | no |
| \`push / pop\` | new length / removed item | **yes** |
| \`splice(i, n)\` | removed items | **yes** |
| \`sort(fn)\` | the same array, reordered | **yes** |
| \`reverse()\` | the same array, reversed | **yes** |

## The sort trap

\`sort()\` converts everything to strings by default, then sorts alphabetically:

\`\`\`js
[10, 9, 100].sort();            // [10, 100, 9]   😱
[10, 9, 100].sort((a, b) => a - b);  // [9, 10, 100] ✅
\`\`\`

\`"100"\` comes before \`"9"\` alphabetically, the same way "apple" comes before "b". Always pass a compare function for numbers.

And \`sort\` mutates. To keep the original, copy first: \`[...nums].sort(...)\`.

## Chaining

Because \`map\` and \`filter\` return arrays, they chain — and the chain reads like a sentence:

\`\`\`js
const total = orders
  .filter(o => o.status === 'paid')
  .map(o => o.amount)
  .reduce((sum, a) => sum + a, 0);
\`\`\`

*Take paid orders, take their amounts, add them up.*`,

    contentHi: `## Jaanne layak methods

| Method | Kya deta hai | Original badalta hai? |
|---|---|---|
| \`map(fn)\` | nayi array, utni hi lambi | nahi |
| \`filter(fn)\` | nayi array, ≤ lambi | nahi |
| \`reduce(fn, init)\` | ek value | nahi |
| \`find(fn)\` | pehla match, ya \`undefined\` | nahi |
| \`findIndex(fn)\` | pehle match ka index, ya \`-1\` | nahi |
| \`some(fn)\` | \`true\` agar **koi ek** match kare | nahi |
| \`every(fn)\` | \`true\` agar **sab** match karein | nahi |
| \`includes(v)\` | \`true\` agar value maujood hai | nahi |
| \`slice(a, b)\` | copy kiya hua hissa | nahi |
| \`push / pop\` | nayi length / hataya item | **haan** |
| \`splice(i, n)\` | hataye gaye items | **haan** |
| \`sort(fn)\` | wahi array, naye kram mein | **haan** |
| \`reverse()\` | wahi array, ulti | **haan** |

## sort ka jaal

\`sort()\` default mein sab kuch string bana kar alphabetically sort karta hai:

\`\`\`js
[10, 9, 100].sort();            // [10, 100, 9]   😱
[10, 9, 100].sort((a, b) => a - b);  // [9, 10, 100] ✅
\`\`\`

\`"100"\` alphabetically \`"9"\` se pehle aata hai, waise hi jaise "apple" "b" se pehle aata hai. Numbers ke liye hamesha compare function do.

Aur \`sort\` mutate karta hai. Original bachana ho to pehle copy karo: \`[...nums].sort(...)\`.

## Chaining

Chunki \`map\` aur \`filter\` arrays dete hain, wo chain hote hain — aur chain ek vaakya jaisi padhti hai:

\`\`\`js
const total = orders
  .filter(o => o.status === 'paid')
  .map(o => o.amount)
  .reduce((sum, a) => sum + a, 0);
\`\`\`

*Paid orders lo, unke amounts lo, jod do.*`,

    examples: [
      {
        title: 'Reading and counting',
        titleHi: 'Padhna aur ginna',
        code: `const cart = ['shirt', 'shoes', 'cap'];

console.log(cart[0]);
console.log(cart[2]);
console.log(cart[5]);
console.log(cart.length);
console.log(cart[cart.length - 1]);`,
        output: `shirt
cap
undefined
3
cap`,
        explain: 'Index 5 does not exist, and JavaScript does not crash — it hands you `undefined`. That silence is why off-by-one bugs survive so long.',
        explainHi: 'Index 5 hai hi nahi, aur JavaScript crash nahi karta — chup-chaap `undefined` de deta hai. Isi khamoshi ki wajah se off-by-one bugs itni der zinda rehte hain.',
      },
      {
        title: 'map — same size, every item changed',
        titleHi: 'map — utni hi size, har item badla',
        code: `const prices = [100, 200, 300];

const withTax = prices.map(p => p * 1.18);
const labels = prices.map(p => \`₹\${p}\`);

console.log(withTax);
console.log(labels);
console.log(prices);   // untouched`,
        output: `[ 118, 236, 354.00000000000006 ]
[ '₹100', '₹200', '₹300' ]
[ 100, 200, 300 ]`,
        explain: 'Three in, three out, every time. The original is untouched. (The ugly `.00000000000006` is normal floating-point maths, not a bug in your code.)',
        explainHi: 'Teen andar, teen bahar, har baar. Original ko haath nahi laga. (Wo bhadda `.00000000000006` normal floating-point maths hai, aapke code ka bug nahi.)',
      },
      {
        title: 'filter — keep what passes the test',
        titleHi: 'filter — jo test paas kare wahi rakho',
        code: `const users = [
  { name: 'Jay', age: 25, active: true },
  { name: 'Ravi', age: 17, active: false },
  { name: 'Amit', age: 30, active: true },
];

console.log(users.filter(u => u.age >= 18).map(u => u.name));
console.log(users.filter(u => u.active).length);`,
        output: `[ 'Jay', 'Amit' ]
2`,
        explain: 'Your function must answer true or false. `true` keeps the item. Notice how filter then map reads like the sentence "adults, then their names".',
        explainHi: 'Aapka function true ya false dena chahiye. `true` matlab item rakh lo. Dhyan do filter phir map "adults, phir unke naam" jaisa padhta hai.',
      },
      {
        title: 'reduce — squash into one value',
        titleHi: 'reduce — dabakar ek value',
        code: `const prices = [100, 200, 300];

const total = prices.reduce((sum, p) => sum + p, 0);
const max = prices.reduce((big, p) => (p > big ? p : big), 0);

console.log(total);
console.log(max);`,
        output: `600
300`,
        explain: '`sum` carries forward between rounds; `p` is the current item. The `0` at the end is where `sum` starts. Never omit that starting value — on an empty array, reduce without one throws.',
        explainHi: '`sum` round-dar-round aage badhta hai; `p` current item hai. Aakhir wala `0` wahan se `sum` shuru hota hai. Wo starting value kabhi mat chhodo — khaali array par bina uske reduce error deta hai.',
      },
      {
        title: 'reduce for grouping — the powerful case',
        titleHi: 'Grouping ke liye reduce — takatwar case',
        code: `const items = [
  { type: 'fruit', name: 'apple' },
  { type: 'veg', name: 'carrot' },
  { type: 'fruit', name: 'mango' },
];

const grouped = items.reduce((acc, item) => {
  (acc[item.type] ||= []).push(item.name);
  return acc;
}, {});

console.log(grouped);`,
        output: `{ fruit: [ 'apple', 'mango' ], veg: [ 'carrot' ] }`,
        explain: 'reduce is not only for numbers — the accumulator can be an object. This grouping pattern shows up constantly in real code.',
        explainHi: 'reduce sirf numbers ke liye nahi hai — accumulator object bhi ho sakta hai. Ye grouping pattern asli code mein baar-baar aata hai.',
      },
      {
        title: 'find, some, every, includes',
        titleHi: 'find, some, every, includes',
        code: `const nums = [4, 8, 15, 16, 23];

console.log(nums.find(n => n > 10));
console.log(nums.findIndex(n => n > 10));
console.log(nums.find(n => n > 100));
console.log(nums.some(n => n > 20));
console.log(nums.every(n => n > 0));
console.log(nums.includes(15));`,
        output: `15
2
undefined
true
true
true`,
        explain: '`find` returns the item; `filter` returns an array. If you only need one match, `find` stops at the first hit instead of scanning everything.',
        explainHi: '`find` item deta hai; `filter` array deta hai. Agar sirf ek match chahiye to `find` pehle hit par ruk jata hai, poora scan nahi karta.',
      },
      {
        title: 'The sort trap',
        titleHi: 'sort ka jaal',
        code: `const nums = [10, 9, 100, 1];

console.log([...nums].sort());
console.log([...nums].sort((a, b) => a - b));
console.log([...nums].sort((a, b) => b - a));

const names = ['Ravi', 'amit', 'Jay'];
console.log([...names].sort());`,
        output: `[ 1, 10, 100, 9 ]
[ 1, 9, 10, 100 ]
[ 100, 10, 9, 1 ]
[ 'Jay', 'Ravi', 'amit' ]`,
        explain: 'Default sort compares text, so `9` lands last. Always pass `(a, b) => a - b` for numbers. And capital letters sort before lowercase — use `localeCompare` for names.',
        explainHi: 'Default sort text compare karta hai, isliye `9` aakhir mein aata hai. Numbers ke liye hamesha `(a, b) => a - b` do. Aur capital letters lowercase se pehle aate hain — naamon ke liye `localeCompare` use karo.',
      },
      {
        title: 'Mutating versus non-mutating',
        titleHi: 'Mutating versus non-mutating',
        code: `const original = [3, 1, 2];

const mapped = original.map(n => n * 2);
console.log(original);

original.sort((a, b) => a - b);
console.log(original);   // changed!

const safe = [3, 1, 2];
const sorted = [...safe].sort((a, b) => a - b);
console.log(safe, sorted);`,
        output: `[ 3, 1, 2 ]
[ 1, 2, 3 ]
[ 3, 1, 2 ] [ 1, 2, 3 ]`,
        explain: '`map` left the original alone. `sort` rewrote it in place. `[...arr]` makes a copy first — this one habit prevents a whole category of "why did my data change?" bugs.',
        explainHi: '`map` ne original ko chhua nahi. `sort` ne usi ko badal diya. `[...arr]` pehle copy bana leta hai — bas ye ek aadat "mera data badal kaise gaya?" wale poore bug category se bacha leti hai.',
      },
      {
        title: 'Chaining — reads like a sentence',
        titleHi: 'Chaining — vaakya jaisa padhta hai',
        code: `const orders = [
  { item: 'shirt', amount: 500, paid: true },
  { item: 'shoes', amount: 2000, paid: false },
  { item: 'cap', amount: 300, paid: true },
];

const revenue = orders
  .filter(o => o.paid)
  .map(o => o.amount)
  .reduce((sum, a) => sum + a, 0);

console.log(revenue);`,
        output: `800`,
        explain: 'Read it out loud: paid orders, their amounts, added up. The equivalent `for` loop needs a counter, an `if`, and a running total — three chances to make a mistake.',
        explainHi: 'Zor se padho: paid orders, unke amounts, jod diye. Isi ka `for` loop version chahiye counter, ek `if`, aur ek running total — galti karne ke teen mauke.',
      },
    ],

    mistakes: [
      {
        wrong: `const sorted = prices.sort();  // ❌ mutates AND sorts as text`,
        right: `const sorted = [...prices].sort((a, b) => a - b);  // ✅`,
        why: 'Two bugs in one line: `sort` rewrites the original array, and without a compare function it sorts numbers alphabetically.',
        whyHi: 'Ek line mein do bug: `sort` original array ko badal deta hai, aur bina compare function ke numbers ko alphabetically sort karta hai.',
      },
      {
        wrong: `const doubled = nums.map(n => { n * 2; });  // ❌ [undefined, ...]`,
        right: `const doubled = nums.map(n => n * 2);  // ✅`,
        why: 'Adding braces to an arrow function means you must `return`. Without it every item becomes `undefined`.',
        whyHi: 'Arrow function mein braces lagate hi `return` likhna zaroori ho jata hai. Bina uske har item `undefined` ban jata hai.',
      },
      {
        wrong: `const total = items.reduce((s, i) => s + i.price);  // ❌ no initial value`,
        right: `const total = items.reduce((s, i) => s + i.price, 0);  // ✅`,
        why: 'Without an initial value, reduce uses the first element as the seed — so `s` starts as an object, not a number, and an empty array throws a TypeError.',
        whyHi: 'Bina initial value ke reduce pehle element ko hi seed bana leta hai — isliye `s` object se shuru hota hai, number se nahi, aur khaali array par TypeError aata hai.',
      },
      {
        wrong: `const found = users.filter(u => u.id === id)[0];  // ❌ scans everything`,
        right: `const found = users.find(u => u.id === id);  // ✅ stops at the first hit`,
        why: '`filter` always walks the whole array and builds a new one. `find` returns as soon as it matches.',
        whyHi: '`filter` hamesha poori array ghoomta hai aur nayi array banata hai. `find` match milte hi return kar deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Rendering lists in React.** `items.map(i => <Card key={i.id} {...i} />)` is the single most common line in a React codebase — it is exactly the `map` you just learned.',
        hi: '**React mein lists render karna.** `items.map(i => <Card key={i.id} {...i} />)` React codebase ki sabse aam line hai — ye bilkul wahi `map` hai jo aapne abhi seekha.',
      },
      {
        en: '**Search and filters.** Every "show only in-stock", "under ₹500", "5-star only" toggle is a `filter` chained onto the product list.',
        hi: '**Search aur filters.** Har "sirf in-stock dikhao", "₹500 se kam", "sirf 5-star" toggle product list par laga hua ek `filter` hi hai.',
      },
      {
        en: '**Cart totals and dashboards.** Any "sum", "average", "count by category" number on a screen is a `reduce` — including the grouping pattern you saw above.',
        hi: '**Cart totals aur dashboards.** Screen par dikhne wala koi bhi "sum", "average", "category ke hisaab se count" ek `reduce` hi hai — upar wala grouping pattern bhi.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `map` and `forEach`?',
        qHi: '`map` aur `forEach` mein kya fark hai?',
        a: '`map` returns a new array built from what your callback returns. `forEach` returns `undefined` and exists purely for side effects. If you are building a new array, use `map`; if you are just doing something per item, use `forEach`.',
        aHi: '`map` nayi array deta hai jo aapke callback ke return se banti hai. `forEach` `undefined` deta hai aur sirf side effects ke liye hai. Nayi array bana rahe ho to `map`; har item par bas kuch kar rahe ho to `forEach`.',
      },
      {
        q: 'Why does `[10, 9, 100].sort()` give `[10, 100, 9]`?',
        qHi: '`[10, 9, 100].sort()` `[10, 100, 9]` kyun deta hai?',
        a: 'Default sort converts each element to a string and compares them lexicographically, so `"100"` sorts before `"9"` just as "ab" sorts before "b". Pass a comparator — `(a, b) => a - b` — to sort numerically.',
        aHi: 'Default sort har element ko string bana kar lexicographically compare karta hai, isliye `"100"` `"9"` se pehle aata hai, waise hi jaise "ab" "b" se pehle. Numeric sort ke liye comparator do — `(a, b) => a - b`.',
      },
      {
        q: 'Which array methods mutate the original?',
        qHi: 'Kaunse array methods original ko badal dete hain?',
        a: '`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, and `fill`. Everything else — `map`, `filter`, `slice`, `concat`, `reduce` — returns something new and leaves the original alone.',
        aHi: '`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, aur `fill`. Baaki sab — `map`, `filter`, `slice`, `concat`, `reduce` — kuch naya dete hain aur original ko chhodte hain.',
      },
      {
        q: 'How would you implement `map` using `reduce`?',
        qHi: '`reduce` se `map` kaise banaoge?',
        a: 'Start with an empty array as the accumulator, push the transformed value each round, and return the accumulator. It demonstrates that `reduce` is the general form and `map`/`filter` are specialised cases of it.',
        aHi: 'Accumulator ko khaali array se shuru karo, har round mein transform ki hui value push karo, aur accumulator return karo. Isse pata chalta hai ki `reduce` general form hai aur `map`/`filter` uske hi khaas roop hain.',
        code: `const map = (arr, fn) =>
  arr.reduce((acc, item, i) => { acc.push(fn(item, i)); return acc; }, []);

map([1, 2, 3], n => n * 2);  // [2, 4, 6]`,
      },
      {
        q: 'What is the difference between `slice` and `splice`?',
        qHi: '`slice` aur `splice` mein kya fark hai?',
        a: '`slice(start, end)` copies a section into a new array and does not touch the original. `splice(start, count, ...items)` removes and/or inserts **in place**, changing the original and returning the removed items.',
        aHi: '`slice(start, end)` ek hissa copy karke nayi array deta hai aur original ko chhuta nahi. `splice(start, count, ...items)` **wahin par** hataata/daalta hai, original badal deta hai aur hataye gaye items return karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Given `[1, 2, 3, 4, 5, 6]`, use one chain to get the sum of the squares of only the even numbers.',
        taskHi: '`[1, 2, 3, 4, 5, 6]` diya hai — ek hi chain se sirf even numbers ke squares ka sum nikalo.',
        hint: 'filter for even (`n % 2 === 0`), map to `n * n`, reduce with a starting value of 0. Expected answer: 56.',
        hintHi: 'even ke liye filter (`n % 2 === 0`), `n * n` ke liye map, aur 0 se shuru karke reduce. Sahi jawab: 56.',
      },
      {
        task: 'Given an array of `{ name, marks }` objects, find the top scorer using `reduce`, then get the class average.',
        taskHi: '`{ name, marks }` objects ki array di hai — `reduce` se top scorer nikalo, phir class ka average.',
        hint: 'For the top scorer, carry the current best object forward: `(best, s) => s.marks > best.marks ? s : best`. Average is sum divided by `length`.',
        hintHi: 'Top scorer ke liye ab tak ka best object aage le jao: `(best, s) => s.marks > best.marks ? s : best`. Average = sum bata `length`.',
      },
      {
        task: 'Write `unique(arr)` that removes duplicates, twice: once with `filter` + `indexOf`, and once with a `Set`. Compare how readable each is.',
        taskHi: '`unique(arr)` do tarike se likho: ek baar `filter` + `indexOf` se, ek baar `Set` se. Dono mein se kaunsa padhne mein aasan hai, compare karo.',
        hint: 'The Set version is one line: `[...new Set(arr)]`. The filter version keeps an item only when its first index equals the current index.',
        hintHi: 'Set wala version ek line hai: `[...new Set(arr)]`. Filter wala item tabhi rakhta hai jab uska pehla index current index ke barabar ho.',
      },
    ],

    keyTakeaways: [
      'Indexes start at 0; the last item is at `length - 1`; a missing index gives `undefined`, not an error.',
      '`map` = same length, every item transformed. `filter` = shorter, items that passed. `reduce` = one value.',
      'Always give `reduce` a starting value, or it breaks on empty arrays.',
      '`sort()` sorts as text and mutates — use `[...arr].sort((a, b) => a - b)` for numbers.',
      'push/pop/splice/sort/reverse mutate; map/filter/slice/concat do not.',
      '`find` stops at the first match; `filter` always scans everything.',
    ],
    keyTakeawaysHi: [
      'Index 0 se shuru hote hain; aakhri item `length - 1` par hai; na hone wala index `undefined` deta hai, error nahi.',
      '`map` = utni hi lambi, har item badla. `filter` = chhoti, jo paas hue. `reduce` = ek value.',
      '`reduce` ko hamesha starting value do, warna khaali array par toot jayega.',
      '`sort()` text ki tarah sort karta hai aur mutate karta hai — numbers ke liye `[...arr].sort((a, b) => a - b)`.',
      'push/pop/splice/sort/reverse mutate karte hain; map/filter/slice/concat nahi.',
      '`find` pehle match par ruk jata hai; `filter` hamesha poora scan karta hai.',
    ],
  },

  /* ══════════════════ Objects, Destructuring & Spread ══════════════════ */
  {
    slug: 'objects-destructuring',
    title: 'Objects, Destructuring and Spread',
    titleHi: 'Objects, Destructuring aur Spread',
    description: 'Labelled data, unpacking it in one line, and the copy that is shallower than it looks.',
    descriptionHi: 'Label wala data, use ek line mein kholna, aur wo copy jo dikhne se zyada uthli hai.',
    difficulty: 'EASY',
    duration: 32,
    order: 8,

    analogy: {
      en: '**An ID card.** An array is a numbered queue — item 0, item 1. An object is an ID card: fields have *names*, not numbers. You do not ask for "field 2", you ask for "date of birth".',
      hi: '**Ek ID card.** Array ek numbered line hai — item 0, item 1. Object ek ID card hai: fields ke *naam* hote hain, number nahi. Aap "field 2" nahi maangte, aap "date of birth" maangte ho.',
    },

    simple: `**An object stores values by name, not by number.**

\`\`\`js
const user = {
  name: 'Jay',
  age: 25,
  city: 'Pune',
};

user.name;      // 'Jay'   ← dot notation
user['name'];   // 'Jay'   ← same thing
\`\`\`

Use the dot. Use brackets only when the key is in a variable:

\`\`\`js
const field = 'age';
user[field];    // 25   ← dot would look for a key literally called "field"
\`\`\`

**Destructuring — unpacking in one line**

Instead of this:

\`\`\`js
const name = user.name;
const age = user.age;
\`\`\`

Write this:

\`\`\`js
const { name, age } = user;
\`\`\`

*Take the fields called name and age out of user and make variables with those names.* Arrays work too, by position:

\`\`\`js
const [first, second] = ['a', 'b'];
\`\`\`

**Spread — the photocopier**

\`\`\`js
const updated = { ...user, city: 'Mumbai' };
\`\`\`

*Copy everything from user, then overwrite city.* The original \`user\` is untouched. This is how you "change" data without changing it — the pattern React and Redux are built on.

**The one catch: the copy is shallow.**

\`{ ...user }\` copies the top level only. If a field holds another object, both copies point at the **same** inner object. Change it through one and the other sees it too.

**Two life-savers**

\`\`\`js
user?.address?.city   // undefined instead of a crash
user.nickname ?? 'friend'   // fallback only if null/undefined
\`\`\`

**Remember:** dot to read, \`{ }\` to unpack, \`...\` to copy — and the copy is only one level deep.`,

    simpleHi: `**Object values ko naam se rakhta hai, number se nahi.**

\`\`\`js
const user = {
  name: 'Jay',
  age: 25,
  city: 'Pune',
};

user.name;      // 'Jay'   ← dot notation
user['name'];   // 'Jay'   ← wahi cheez
\`\`\`

Dot use karo. Brackets sirf tab jab key kisi variable mein ho:

\`\`\`js
const field = 'age';
user[field];    // 25   ← dot "field" naam ki key dhoondhta, jo hai hi nahi
\`\`\`

**Destructuring — ek line mein kholna**

Ye likhne ke bajaye:

\`\`\`js
const name = user.name;
const age = user.age;
\`\`\`

Ye likho:

\`\`\`js
const { name, age } = user;
\`\`\`

*user se name aur age naam ke fields nikaalo aur unhi naamon ke variables bana do.* Arrays bhi chalte hain, position se:

\`\`\`js
const [first, second] = ['a', 'b'];
\`\`\`

**Spread — photocopy machine**

\`\`\`js
const updated = { ...user, city: 'Mumbai' };
\`\`\`

*user se sab copy karo, phir city ko badal do.* Original \`user\` ko haath nahi laga. Data ko badle bina "badalne" ka yahi tarika hai — React aur Redux isi par khade hain.

**Ek pech: copy uthli (shallow) hoti hai.**

\`{ ...user }\` sirf top level copy karta hai. Agar kisi field mein doosra object hai, to dono copies **usi ek** andar wale object ko point karti hain. Ek se badlo to doosri ko bhi dikh jata hai.

**Do jaan-bachane wale**

\`\`\`js
user?.address?.city   // crash ki jagah undefined
user.nickname ?? 'friend'   // fallback sirf null/undefined par
\`\`\`

**Yaad rakho:** padhne ko dot, kholne ko \`{ }\`, copy ko \`...\` — aur copy sirf ek level gehri hai.`,

    content: `## Reading safely

\`\`\`js
user.address.city        // 💥 crashes if address is missing
user?.address?.city      // undefined — no crash
user.name ?? 'Anonymous' // fallback for null/undefined only
\`\`\`

Optional chaining (\`?.\`) stops the moment it meets \`null\` or \`undefined\` and hands back \`undefined\` instead of throwing. It works on calls and indexes too: \`obj.method?.()\`, \`arr?.[0]\`.

## Destructuring, fully

\`\`\`js
const { name, age = 18 } = user;             // default when missing
const { name: fullName } = user;             // rename
const { address: { city } = {} } = user;     // nested, with a safety net
const { id, ...rest } = user;                // pull one out, keep the rest

function greet({ name, city = 'somewhere' }) { … }   // in parameters
\`\`\`

The last one is everywhere in React: \`function Card({ title, onClick })\`.

## Shallow copy, precisely

\`\`\`js
const a = { name: 'Jay', prefs: { theme: 'dark' } };
const b = { ...a };

b.name = 'Ravi';          // a.name is still 'Jay'      ✅ separate
b.prefs.theme = 'light';  // a.prefs.theme is 'light'   ❌ shared!
\`\`\`

Top-level fields are copied. Nested objects are **shared references**. For a genuinely independent copy use \`structuredClone(a)\`.

## Walking an object

\`\`\`js
Object.keys(user);     // ['name', 'age', 'city']
Object.values(user);   // ['Jay', 25, 'Pune']
Object.entries(user);  // [['name','Jay'], ['age',25], ['city','Pune']]

for (const [key, value] of Object.entries(user)) { … }
\`\`\`

\`Object.entries\` plus \`for...of\` is cleaner than \`for...in\` and skips inherited keys automatically.`,

    contentHi: `## Safely padhna

\`\`\`js
user.address.city        // 💥 address na ho to crash
user?.address?.city      // undefined — crash nahi
user.name ?? 'Anonymous' // fallback sirf null/undefined par
\`\`\`

Optional chaining (\`?.\`) \`null\` ya \`undefined\` milte hi ruk jata hai aur error ke bajaye \`undefined\` de deta hai. Ye calls aur indexes par bhi chalta hai: \`obj.method?.()\`, \`arr?.[0]\`.

## Destructuring, poora

\`\`\`js
const { name, age = 18 } = user;             // na ho to default
const { name: fullName } = user;             // naam badalna
const { address: { city } = {} } = user;     // nested, safety net ke saath
const { id, ...rest } = user;                // ek nikaalo, baaki rakho

function greet({ name, city = 'somewhere' }) { … }   // parameters mein
\`\`\`

Aakhri wala React mein har jagah hai: \`function Card({ title, onClick })\`.

## Shallow copy, theek se

\`\`\`js
const a = { name: 'Jay', prefs: { theme: 'dark' } };
const b = { ...a };

b.name = 'Ravi';          // a.name abhi bhi 'Jay'       ✅ alag
b.prefs.theme = 'light';  // a.prefs.theme 'light' ho gaya ❌ shared!
\`\`\`

Top-level fields copy hote hain. Nested objects **shared reference** hote hain. Sach mein alag copy chahiye to \`structuredClone(a)\` use karo.

## Object par ghoomna

\`\`\`js
Object.keys(user);     // ['name', 'age', 'city']
Object.values(user);   // ['Jay', 25, 'Pune']
Object.entries(user);  // [['name','Jay'], ['age',25], ['city','Pune']]

for (const [key, value] of Object.entries(user)) { … }
\`\`\`

\`Object.entries\` + \`for...of\` \`for...in\` se saaf hai aur inherited keys apne aap chhod deta hai.`,

    examples: [
      {
        title: 'Dot versus bracket',
        titleHi: 'Dot versus bracket',
        code: `const user = { name: 'Jay', 'home city': 'Pune' };

console.log(user.name);
console.log(user['home city']);

const field = 'name';
console.log(user[field]);
console.log(user.field);`,
        output: `Jay
Pune
Jay
undefined`,
        explain: 'The last line is the lesson. `user.field` looks for a key literally named "field". When the key lives in a variable you must use brackets.',
        explainHi: 'Aakhri line hi seekh hai. `user.field` "field" naam ki key dhoondhta hai. Jab key kisi variable mein ho to brackets hi lagane padenge.',
      },
      {
        title: 'Destructuring — the same thing, shorter',
        titleHi: 'Destructuring — wahi cheez, chhoti',
        code: `const user = { name: 'Jay', age: 25, city: 'Pune' };

const name1 = user.name;
const age1 = user.age;

const { name, age, country = 'India' } = user;

console.log(name1, age1);
console.log(name, age, country);`,
        output: `Jay 25
Jay 25 India`,
        explain: '`country` was not in the object, so the default kicked in. Defaults fire only when the value is `undefined` — exactly like function parameters.',
        explainHi: '`country` object mein tha hi nahi, isliye default laga. Defaults sirf tab lagte hain jab value `undefined` ho — bilkul function parameters ki tarah.',
      },
      {
        title: 'Renaming and nesting',
        titleHi: 'Rename aur nesting',
        code: `const res = {
  data: { user: { name: 'Jay', id: 7 } },
  status: 200,
};

const { data: { user: { name: userName, id } }, status } = res;

console.log(userName, id, status);`,
        output: `Jay 7 200`,
        explain: '`name: userName` renames on the way out — useful when two objects both have a `name`. Nesting this deep is legal but hard to read; two shallow steps often beat one deep one.',
        explainHi: '`name: userName` nikalte waqt naam badal deta hai — kaam ka jab do objects mein `name` ho. Itni gehri nesting legal hai par padhne mein mushkil; do chhote steps aksar ek gehre se behtar hote hain.',
      },
      {
        title: 'Destructuring in function parameters',
        titleHi: 'Function parameters mein destructuring',
        code: `function greet({ name, city = 'somewhere' }) {
  return \`Hi \${name} from \${city}\`;
}

console.log(greet({ name: 'Jay', city: 'Pune' }));
console.log(greet({ name: 'Ravi' }));`,
        output: `Hi Jay from Pune
Hi Ravi from somewhere`,
        explain: 'The caller passes one object; the function names exactly the fields it needs. This is the React props pattern — `function Card({ title, onClick })`.',
        explainHi: 'Caller ek object bhejta hai; function sirf zaroori fields ke naam leta hai. Yahi React props ka pattern hai — `function Card({ title, onClick })`.',
      },
      {
        title: 'Spread — copy and override',
        titleHi: 'Spread — copy karo aur badlo',
        code: `const user = { name: 'Jay', age: 25, city: 'Pune' };

const moved = { ...user, city: 'Mumbai' };
const withRole = { ...user, role: 'admin' };

console.log(moved);
console.log(withRole);
console.log(user);   // untouched`,
        output: `{ name: 'Jay', age: 25, city: 'Mumbai' }
{ name: 'Jay', age: 25, city: 'Pune', role: 'admin' }
{ name: 'Jay', age: 25, city: 'Pune' }`,
        explain: 'Later keys win, so putting `city` after the spread overrides it. Put it *before* the spread and the original would win instead — order matters.',
        explainHi: 'Baad wali keys jeetti hain, isliye spread ke baad `city` likhne se wo override ho gayi. Spread se *pehle* likhte to original jeet jata — order matter karta hai.',
      },
      {
        title: 'The shallow copy trap',
        titleHi: 'Shallow copy ka jaal',
        code: `const a = { name: 'Jay', prefs: { theme: 'dark' } };
const b = { ...a };

b.name = 'Ravi';
console.log(a.name);

b.prefs.theme = 'light';
console.log(a.prefs.theme);   // 😱`,
        output: `Jay
light`,
        explain: 'The top-level `name` was truly copied. But `prefs` is one object that both `a` and `b` point at — spread copied the *pointer*, not the contents. This is the number one source of "I only changed the copy!" bugs.',
        explainHi: 'Top-level `name` sach mein copy hua. Par `prefs` ek hi object hai jise `a` aur `b` dono point karte hain — spread ne *pointer* copy kiya, andar ka saaman nahi. "Maine to sirf copy badli thi!" wale bugs ka number one kaaran yahi hai.',
      },
      {
        title: 'Deep copy when you need it',
        titleHi: 'Jab sach mein deep copy chahiye',
        code: `const a = { name: 'Jay', prefs: { theme: 'dark' } };

const shallow = { ...a };
const deep = structuredClone(a);

shallow.prefs.theme = 'light';
console.log(a.prefs.theme);

deep.prefs.theme = 'sepia';
console.log(a.prefs.theme);`,
        output: `light
light`,
        explain: 'The second change did not leak back — `deep` is fully independent. `structuredClone` is built into modern Node and browsers, and it beats the old `JSON.parse(JSON.stringify(x))` trick, which silently destroys Dates, Maps and undefined.',
        explainHi: 'Doosra change wapas leak nahi hua — `deep` poori tarah alag hai. `structuredClone` modern Node aur browsers mein built-in hai, aur ye purane `JSON.parse(JSON.stringify(x))` jugaad se behtar hai, jo Dates, Maps aur undefined ko chup-chaap kha jata hai.',
      },
      {
        title: 'Optional chaining — no more crashes',
        titleHi: 'Optional chaining — ab crash nahi',
        code: `const user = { name: 'Jay' };

console.log(user?.address?.city);
console.log(user?.address?.city ?? 'Not provided');
console.log(user.getName?.());

try {
  console.log(user.address.city);
} catch (e) {
  console.log('Crashed:', e.message);
}`,
        output: `undefined
Not provided
undefined
Crashed: Cannot read properties of undefined (reading 'city')`,
        explain: 'Compare the first and last lines — same data, one returns `undefined` calmly and the other takes down the page. Pair `?.` with `??` to get a safe read plus a sensible default.',
        explainHi: 'Pehli aur aakhri line compare karo — data wahi hai, ek chup-chaap `undefined` deti hai aur doosri poora page gira deti hai. `?.` ko `??` ke saath jodo to safe read aur sahi default dono mil jate hain.',
      },
      {
        title: 'Rest — pull one out, keep the rest',
        titleHi: 'Rest — ek nikaalo, baaki rakho',
        code: `const user = { id: 7, password: 'secret', name: 'Jay', city: 'Pune' };

const { password, ...safe } = user;
console.log(safe);

const { id, ...withoutId } = user;
console.log(Object.keys(withoutId));`,
        output: `{ id: 7, name: 'Jay', city: 'Pune' }
[ 'password', 'name', 'city' ]`,
        explain: 'This is the standard way to strip a field before sending data to the client — pull `password` out and send `safe`. One line, no mutation.',
        explainHi: 'Client ko data bhejne se pehle koi field hataane ka yahi standard tarika hai — `password` nikaalo aur `safe` bhejo. Ek line, koi mutation nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `const copy = original;\ncopy.name = 'New';  // ❌ original.name changed too`,
        right: `const copy = { ...original };\ncopy.name = 'New';  // ✅`,
        why: 'Assignment copies the reference, not the object. Both names point at the same object until you spread.',
        whyHi: 'Assignment reference copy karta hai, object nahi. Jab tak spread nahi karoge, dono naam ek hi object ko point karte hain.',
      },
      {
        wrong: `const copy = { ...state };\ncopy.user.name = 'New';  // ❌ state.user.name changed`,
        right: `const copy = { ...state, user: { ...state.user, name: 'New' } };  // ✅`,
        why: 'Spread is one level deep. To change something nested, spread every level down to it — or use `structuredClone`.',
        whyHi: 'Spread ek hi level gehra hai. Nested cheez badalni ho to us tak har level spread karo — ya `structuredClone` use karo.',
      },
      {
        wrong: `const city = user.address.city;  // ❌ crashes when address is missing`,
        right: `const city = user?.address?.city ?? 'Unknown';  // ✅`,
        why: 'API data is not guaranteed to have every field. Optional chaining turns a page-breaking crash into a harmless `undefined`.',
        whyHi: 'API data mein har field ho, iski guarantee nahi hai. Optional chaining page todne wale crash ko seedhe-saade `undefined` mein badal deta hai.',
      },
      {
        wrong: `const key = 'age';\nconsole.log(user.key);  // ❌ undefined`,
        right: `const key = 'age';\nconsole.log(user[key]);  // ✅ 25`,
        why: 'Dot notation takes the literal name after the dot. A key held in a variable needs bracket notation.',
        whyHi: 'Dot notation dot ke baad ka literal naam leta hai. Variable mein rakhi key ke liye bracket notation chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**React state updates.** `setUser({ ...user, name: newName })` is the required pattern — React only re-renders when it sees a *new* object, so mutating the old one shows nothing on screen.',
        hi: '**React state updates.** `setUser({ ...user, name: newName })` zaroori pattern hai — React tabhi re-render karta hai jab usse *naya* object dikhe, isliye purana mutate karne se screen par kuch nahi hota.',
      },
      {
        en: '**API responses.** Every fetch returns nested objects with optional fields, so `data?.user?.profile?.avatar ?? defaultAvatar` is the everyday shape of reading them safely.',
        hi: '**API responses.** Har fetch nested objects deta hai jisme optional fields hote hain, isliye `data?.user?.profile?.avatar ?? defaultAvatar` unhe safely padhne ka rozmarra ka tarika hai.',
      },
      {
        en: '**Stripping secrets.** `const { password, ...safeUser } = user` before sending a response is how you avoid leaking a password hash to the browser.',
        hi: '**Secrets hataana.** Response bhejne se pehle `const { password, ...safeUser } = user` likhna hi wo tarika hai jisse password hash browser tak nahi pahunchta.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a shallow copy and a deep copy?',
        qHi: 'Shallow copy aur deep copy mein kya fark hai?',
        a: 'A shallow copy duplicates only top-level properties; nested objects remain shared references, so mutating one is visible in the other. A deep copy recursively duplicates everything, giving two fully independent objects. `{...obj}` and `Object.assign` are shallow; `structuredClone(obj)` is deep.',
        aHi: 'Shallow copy sirf top-level properties duplicate karti hai; nested objects shared reference hi rehte hain, isliye ek ko badlo to doosre mein bhi dikhta hai. Deep copy sab kuch recursively duplicate karti hai, do poori tarah alag objects milte hain. `{...obj}` aur `Object.assign` shallow hain; `structuredClone(obj)` deep hai.',
      },
      {
        q: 'What does optional chaining do, and how does it differ from `&&`?',
        qHi: 'Optional chaining kya karta hai, aur `&&` se kaise alag hai?',
        a: '`a?.b` returns `undefined` if `a` is `null` or `undefined`, otherwise reads `b`. `a && a.b` looks similar but short-circuits on *any* falsy value, so it also stops on `0` and `""` — which may be legitimate values. `?.` checks only for null and undefined.',
        aHi: '`a?.b` `undefined` deta hai agar `a` `null` ya `undefined` ho, warna `b` padhta hai. `a && a.b` dikhne mein waisa hi hai par *kisi bhi* falsy value par ruk jata hai, isliye `0` aur `""` par bhi ruk jata hai — jo shayad valid values hon. `?.` sirf null aur undefined check karta hai.',
      },
      {
        q: 'How do you remove a property from an object without mutating it?',
        qHi: 'Bina mutate kiye object se property kaise hataayein?',
        a: 'Destructure it out and collect the remainder with rest syntax. `delete obj.key` also works but mutates the original, which breaks React state and any code relying on immutability.',
        aHi: 'Use destructure karke nikaal do aur baaki ko rest syntax se jama kar lo. `delete obj.key` bhi chalta hai par original mutate karta hai, jo React state aur immutability par tikey har code ko toad deta hai.',
        code: `const { password, ...rest } = user;  // rest has everything except password`,
      },
      {
        q: 'Why does React require `{ ...state }` instead of mutating state directly?',
        qHi: 'React ko state seedhe mutate karne ke bajaye `{ ...state }` kyun chahiye?',
        a: 'React decides whether to re-render by comparing the old and new state by reference. Mutating keeps the same reference, so React sees no change and skips the render. Spreading creates a new object with a new reference, which triggers the update.',
        aHi: 'React purani aur nayi state ko reference se compare karke tay karta hai ki re-render karna hai ya nahi. Mutate karne se reference wahi rehta hai, isliye React ko koi change nahi dikhta aur wo render skip kar deta hai. Spread naya object banata hai naye reference ke saath, jisse update trigger hota hai.',
      },
      {
        q: 'What is the difference between `Object.keys`, `Object.values` and `Object.entries`?',
        qHi: '`Object.keys`, `Object.values` aur `Object.entries` mein kya fark hai?',
        a: 'They all return arrays of the object\'s own enumerable properties: `keys` gives the property names, `values` gives the values, and `entries` gives `[key, value]` pairs — which pairs perfectly with `for...of` destructuring.',
        aHi: 'Teeno object ki apni enumerable properties ki array dete hain: `keys` property naam deta hai, `values` values deta hai, aur `entries` `[key, value]` jode deta hai — jo `for...of` destructuring ke saath bilkul fit baithta hai.',
      },
    ],

    exercises: [
      {
        task: 'Given `{ name: "Jay", address: { city: "Pune", pin: "411001" } }`, destructure `name` and `city` in a single statement, renaming `city` to `homeCity`.',
        taskHi: '`{ name: "Jay", address: { city: "Pune", pin: "411001" } }` diya hai — ek hi statement mein `name` aur `city` destructure karo, aur `city` ka naam `homeCity` rakho.',
        hint: '`const { name, address: { city: homeCity } } = user;`',
        hintHi: '`const { name, address: { city: homeCity } } = user;`',
      },
      {
        task: 'Write `updateCity(user, newCity)` that returns a NEW user object with the city changed, leaving the original completely untouched. Prove it by logging the original afterwards.',
        taskHi: '`updateCity(user, newCity)` likho jo NAYA user object de jisme city badli ho, aur original bilkul waisa hi rahe. Baad mein original log karke proof do.',
        hint: 'If `city` is nested inside `address`, you must spread both levels: `{ ...user, address: { ...user.address, city: newCity } }`.',
        hintHi: 'Agar `city` `address` ke andar hai to dono levels spread karne padenge: `{ ...user, address: { ...user.address, city: newCity } }`.',
      },
      {
        task: 'Write `countBy(items, key)` that returns how many times each value of that key appears. For `[{type:"a"},{type:"b"},{type:"a"}]` and `"type"` it should give `{ a: 2, b: 1 }`.',
        taskHi: '`countBy(items, key)` likho jo bataye ki us key ki har value kitni baar aayi. `[{type:"a"},{type:"b"},{type:"a"}]` aur `"type"` par `{ a: 2, b: 1 }` aana chahiye.',
        hint: 'Use `reduce` with `{}` as the starting value, and bracket notation because the key is in a variable: `acc[item[key]] = (acc[item[key]] ?? 0) + 1`.',
        hintHi: '`reduce` ko `{}` se shuru karo, aur bracket notation use karo kyunki key variable mein hai: `acc[item[key]] = (acc[item[key]] ?? 0) + 1`.',
      },
    ],

    keyTakeaways: [
      'Objects store values by name; use the dot to read, and brackets when the key is in a variable.',
      '`const { a, b } = obj` unpacks in one line, with defaults and renaming available.',
      '`{ ...obj, field: newValue }` copies then overrides — later keys win.',
      'Spread is ONE level deep. Nested objects stay shared; use `structuredClone` for a real deep copy.',
      '`?.` reads safely through missing fields; `??` supplies a default only for null and undefined.',
      '`const { secret, ...rest } = obj` removes a field without mutating the original.',
    ],
    keyTakeawaysHi: [
      'Objects values ko naam se rakhte hain; padhne ko dot, aur key variable mein ho to brackets.',
      '`const { a, b } = obj` ek line mein khol deta hai, defaults aur rename ke saath.',
      '`{ ...obj, field: newValue }` copy karke override karta hai — baad wali keys jeetti hain.',
      'Spread EK level gehra hai. Nested objects shared rehte hain; asli deep copy ke liye `structuredClone`.',
      '`?.` missing fields se safely padhta hai; `??` sirf null aur undefined par default deta hai.',
      '`const { secret, ...rest } = obj` bina mutate kiye field hata deta hai.',
    ],
  },
];
