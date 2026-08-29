/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 3.
 *
 * Prefix sums: precomputing cumulative totals once so that the sum of
 * ANY range can be answered in O(1), rather than re-summing that range
 * from scratch on every query. Broken example: a function answering
 * many different "sum of elements from index i to j" range queries by
 * looping through each requested range every single time — genuinely
 * correct, but paying an O(range length) cost per query, which becomes
 * O(n) per query in the worst case, and O(n * q) overall for q queries.
 * Fixed by building one array of running totals up front, letting any
 * range sum be computed as a single subtraction of two precomputed
 * values, turning each query into O(1) after an O(n) one-time setup.
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

export const DSA_MODULE_2_PART3: CourseLesson[] = [
  {
    slug: 'prefix-sums',
    title: 'Prefix Sums: Answering Range Queries Instantly',
    titleHi: 'Prefix Sums: Range Queries Ka Turant Jawaab Dena',
    description: 'A dashboard answering "what were total sales between day 40 and day 90?" style questions re-loops through the requested range and adds every value inside it, every single time a question is asked — on a dataset with a million days and a thousand different questions asked per minute, this is a genuinely measurable, avoidable cost.',
    descriptionHi: 'Ek dashboard jo "day 40 aur day 90 ke beech total sales kya thi?" jaise sawaalon ka jawaab deta hai maangi gayi range ke through dobara loop karta hai aur iske andar har value ko jodta hai, har akeli baar jab ek sawaal poocha jaata hai — ek million days aur prati minute poochhe jaane waale ek hazaar alag sawaalon waale dataset par, ye ek sach mein naapa-jaane-laayak, bachne-laayak keemat hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 3,

    analogy: {
      en: '**An accountant who, every single time someone asks "what were our total earnings between March and July?", walks back to the filing cabinet and re-adds every individual day\'s receipts from scratch, versus an accountant who keeps a single running ledger where each day\'s entry already shows the cumulative total from the very beginning up through that day, letting any range\'s total be found with a single subtraction.** The first accountant, asked the same style of question forty times a day for forty different date ranges, redoes the same underlying addition work over and over — March through July\'s daily receipts get re-added in full for every single query that happens to include any part of that range, even though the answer to "total earnings up through July" never actually changes once July has passed. The second accountant, having already written down "cumulative total through this day" once for every day in the ledger, answers ANY range question — March through July, January through December, any two dates at all — with a single subtraction: the cumulative total through the end of the range, minus the cumulative total through just before the start of the range. Answering a "sum between index i and j" query by looping through and re-adding every element in that range, every single time a query is asked, is the first accountant: correct, but repeating the same addition work across every query that touches overlapping ground. Building one array of running totals once, up front, and answering every subsequent range query with a single subtraction, is the second accountant: the expensive part (building the cumulative ledger) happens exactly once, and every question afterward is answered almost instantly.',
      hi: '**Ek accountant jo, har akeli baar jab koi poochta hai "March aur July ke beech hamaari total earnings kya thi?", filing cabinet tak wapas jaata hai aur har akele din ki receipts ko shuru se dobara jodta hai, versus ek accountant jo ek akela chalta ledger rakhta hai jahan har din ki entry pehle se bilkul shuruaat se us din tak ka cumulative total darsaati hai, kisi bhi range ka total ek akele subtraction se dhoondhne diya jaata hai.** Pehla accountant, ek din mein chalis alag date ranges ke liye chalis baar isi tarah ka sawaal poocha gaya, wahi underlying addition kaam baar-baar dobara karta hai — March se July ki daily receipts poori tarah dobara jodi jaati hain har akeli query ke liye jo samyog se us range ka koi hissa shaamil karti hai, chahe "July tak total earnings" ka jawaab asal mein kabhi nahi badalta ek baar July guzar chuka ho. Doosra accountant, jisne pehle se "is din tak cumulative total" ek baar likha hai ledger mein har din ke liye, KISI BHI range sawaal ka jawaab deta hai — March se July, January se December, kisi bhi do dates ka — ek akele subtraction se: range ke ant tak cumulative total, minus range ke shuru se bilkul pehle tak cumulative total. Ek "index i aur j ke beech sum" query ka jawaab dena us range mein har element ko loop karke aur dobara jodke, har akeli baar jab ek query poochi jaati hai, pehla accountant hai: sahi, par usi addition kaam ko har us query ke aar-paar dohraate hue jo overlapping zameen chhuti hai. Ek array ke chalte totals ko ek baar, pehle se, banaana, aur har baad ki range query ka jawaab ek akele subtraction se dena, doosra accountant hai: mehenga hissa (cumulative ledger banaana) bilkul ek baar hota hai, aur baad ka har sawaal lagbhag turant jawaab diya jaata hai.',
    },

    simple: `**Start broken.** Re-summing the requested range from scratch on every query:

\`\`\`js
function rangeSum(nums, i, j) {
  let sum = 0;
  for (let k = i; k <= j; k++) {
    sum += nums[k]; // re-adds every element in the range, every single call
  }
  return sum;
}
// asking for the same overlapping range repeatedly re-does the same work
\`\`\`

This is genuinely correct — each call to \`rangeSum\` returns the right answer. The waste appears only when this function is called MANY times, especially with overlapping ranges: \`rangeSum(nums, 0, 100)\` and \`rangeSum(nums, 0, 105)\` share 101 identical elements between them, yet the second call re-adds every single one of those shared elements from scratch, exactly as if the first call had never happened. Each individual call costs \`O(range length)\`, which is \`O(n)\` in the worst case — so \`q\` queries against an array of \`n\` elements cost \`O(n * q)\` total, even though most of that work is a repeat of a calculation already done.

**The fix: precompute cumulative totals once, answer every query with a subtraction**

\`\`\`js
function buildPrefixSums(nums) {
  const prefix = [0]; // prefix[k] = sum of the first k elements (prefix[0] = sum of zero elements = 0)
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix, i, j) {
  return prefix[j + 1] - prefix[i]; // sum from i to j, in O(1)
}
\`\`\`

\`\`\`ts
function buildPrefixSums(nums: number[]): number[] {
  const prefix: number[] = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix: number[], i: number, j: number): number {
  return prefix[j + 1] - prefix[i];
}
\`\`\`

\`prefix[k]\` is built to hold the sum of the FIRST \`k\` elements of \`nums\`, computed once, up front, at a total cost of \`O(n)\`. The sum of any range from index \`i\` to \`j\` (inclusive) can then be found without touching a single element of \`nums\` directly: \`prefix[j + 1]\` is the total up through \`j\`, and \`prefix[i]\` is the total up through, but not including, \`i\` — subtracting the second from the first leaves exactly the elements from \`i\` to \`j\`, and nothing else. Every subsequent range query, no matter how many are asked, costs \`O(1)\`, turning the total cost for \`q\` queries from \`O(n * q)\` into \`O(n) + O(q)\`, since the one-time \`O(n)\` setup is paid exactly once, not once per query.`,

    simpleHi: `**Toote hue se shuru.** Har query par maangi gayi range ko shuru se dobara jodna:

\`\`\`js
function rangeSum(nums, i, j) {
  let sum = 0;
  for (let k = i; k <= j; k++) {
    sum += nums[k]; // range mein har element ko dobara jodta hai, har akeli call
  }
  return sum;
}
// wahi overlapping range baar-baar poochhna wahi kaam dobara karta hai
\`\`\`

Ye sach mein sahi hai — \`rangeSum\` ki har call sahi jawaab return karti hai. Barbaadi sirf tab dikhti hai jab ye function KAYI BAAR bulaaya jaata hai, khaas taur par overlapping ranges ke saath: \`rangeSum(nums, 0, 100)\` aur \`rangeSum(nums, 0, 105)\` unke beech 101 identical elements share karte hain, phir bhi doosri call un shared elements mein se har ek ko shuru se dobara jodta hai, bilkul jaise pehli call kabhi hui hi na ho. Har akeli call \`O(range length)\` kharch karti hai, jo worst case mein \`O(n)\` hai — isliye \`n\` elements ke ek array ke khilaaf \`q\` queries kul milaake \`O(n * q)\` kharch karti hain, chahe us kaam ka adhikaansh ek pehle se ki gayi calculation ka dohraav hai.

**Fix: cumulative totals ko ek baar precompute karo, har query ka jawaab ek subtraction se do**

\`\`\`js
function buildPrefixSums(nums) {
  const prefix = [0]; // prefix[k] = pehle k elements ka sum (prefix[0] = zero elements ka sum = 0)
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix, i, j) {
  return prefix[j + 1] - prefix[i]; // i se j tak sum, O(1) mein
}
\`\`\`

\`\`\`ts
function buildPrefixSums(nums: number[]): number[] {
  const prefix: number[] = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix: number[], i: number, j: number): number {
  return prefix[j + 1] - prefix[i];
}
\`\`\`

\`prefix[k]\` \`nums\` ke PEHLE \`k\` elements ka sum rakhne ke liye banaayi jaati hai, ek baar, pehle se, \`O(n)\` ki ek total keemat par gani jaati hai. Index \`i\` se \`j\` (dono sameet) tak kisi bhi range ka sum phir \`nums\` ke ek bhi element ko seedhe chhue bina dhoondha jaa sakta hai: \`prefix[j + 1]\` \`j\` tak ka total hai, aur \`prefix[i]\` \`i\` tak ka, par ise shaamil kiye bina, total hai — doosre ko pehle se ghataana bilkul \`i\` se \`j\` tak ke elements chhodta hai, aur kuch aur nahi. Har baad ki range query, chahe kitni bhi poochi jaayein, \`O(1)\` kharch karti hai, \`q\` queries ke liye total keemat ko \`O(n * q)\` se \`O(n) + O(q)\` mein badalte hue, kyunki ek-baar ka \`O(n)\` setup bilkul ek baar chukaaya jaata hai, prati query nahi.`,

    content: `## Why prefix[k] represents "the first k elements", and the role of the leading zero

\`\`\`
nums:     [3, 1, 4, 1, 5]
prefix:   [0, 3, 4, 8, 9, 14]
           ↑  ↑  ↑  ↑  ↑  ↑
      0 elements
          1 element (3)
             2 elements (3+1)
                3 elements (3+1+4)
                   4 elements (3+1+4+1)
                      5 elements (3+1+4+1+5)
\`\`\`

\`prefix\` is deliberately built with one MORE entry than \`nums\` itself — \`prefix[0]\` represents the sum of the first ZERO elements, which is \`0\` by definition, and \`prefix[k]\` for \`k >= 1\` represents the sum of the first \`k\` elements of \`nums\`. This deliberate off-by-one shift is exactly what makes the subtraction formula \`prefix[j + 1] - prefix[i]\` work correctly for the range from index \`i\` to \`j\` inclusive, including the edge case where \`i = 0\` (a range starting at the very beginning of \`nums\`) — without the leading zero, that specific edge case would require a separate, special-cased check rather than being handled uniformly by the exact same subtraction as every other range.

## The general prefix-sum principle: precompute once, answer many queries cheaply

\`\`\`
Total cost without prefix sums:  O(n) setup avoided, but O(range length) PER query
Total cost with prefix sums:     O(n) setup ONCE, then O(1) per query

For q queries: O(n * q) without prefix sums, vs O(n) + O(q) = O(n + q) with them
\`\`\`

The specific trade this technique makes is paying a one-time \`O(n)\` cost up front, in exchange for turning every subsequent range-sum query into \`O(1)\`. This trade is worth making specifically when many queries will be asked against the same, unchanging data — the more queries asked, the more the one-time setup cost is amortized across them, and the more dramatic the total savings compared to re-summing each range from scratch. If only a single range sum is ever needed, prefix sums offer no advantage at all (building the prefix array costs the same \`O(n)\` as just summing the one requested range directly) — the technique specifically earns its cost when the SAME underlying data will be queried repeatedly, with different ranges, which is precisely the shape of the dashboard-style scenario this lesson opened with.

## What prefix sums do not solve: when the underlying data changes

\`\`\`js
nums[3] = 100; // nums changed — but prefix[4], prefix[5], ... are now all STALE
\`\`\`

A genuinely important limitation is that a prefix-sum array becomes stale the moment the underlying \`nums\` array is modified — changing a single element invalidates every prefix-sum entry from that position onward, since each of those entries was computed assuming the old value. If the underlying data needs to change frequently, alongside frequent range queries, naively rebuilding the entire prefix array after every single change costs \`O(n)\` per update, which may erase the benefit prefix sums were meant to provide in the first place. This is a genuine, real trade-off worth naming explicitly: prefix sums are the right tool specifically for READ-heavy scenarios against unchanging or rarely-changing data — a scenario involving frequent updates alongside frequent range queries calls for a more advanced structure (a Fenwick tree or segment tree, briefly previewed in this course\'s final pro-level module) that supports both operations efficiently, rather than plain prefix sums.`,

    contentHi: `## \`prefix[k]\` "pehle k elements" darsata hai kyun, aur shuru ke zero ki bhoomika

\`\`\`
nums:     [3, 1, 4, 1, 5]
prefix:   [0, 3, 4, 8, 9, 14]
           ↑  ↑  ↑  ↑  ↑  ↑
      0 elements
          1 element (3)
             2 elements (3+1)
                3 elements (3+1+4)
                   4 elements (3+1+4+1)
                      5 elements (3+1+4+1+5)
\`\`\`

\`prefix\` jaan-boojhkar \`nums\` khud se ek ZYAADA entry ke saath banaayi jaati hai — \`prefix[0]\` pehle ZERO elements ka sum darsata hai, jo paribhaasha se \`0\` hai, aur \`prefix[k]\` \`k >= 1\` ke liye \`nums\` ke pehle \`k\` elements ka sum darsata hai. Ye jaan-boojhkar liya gaya off-by-one shift bilkul wahi hai jo subtraction formula \`prefix[j + 1] - prefix[i]\` ko index \`i\` se \`j\` tak (dono sameet) ki range ke liye sahi tarike se kaam karaata hai, edge case sameet jahan \`i = 0\` hai (ek range jo \`nums\` ke bilkul shuru mein shuru hoti hai) — shuru ke zero ke bina, us khaas edge case ko ek alag, khaas-case-kiya-gaya check chahiye hota har doosri range ki tarah usi subtraction dwara samaan roop se handle hone ke bajaye.

## General prefix-sum siddhaant: ek baar precompute karo, kayi queries ka sasta jawaab do

\`\`\`
Prefix sums ke bina total keemat:  O(n) setup avoid kiya gaya, par O(range length) PRATI query
Prefix sums ke saath total keemat: O(n) setup EK BAAR, phir O(1) prati query

q queries ke liye: O(n * q) prefix sums ke bina, vs O(n) + O(q) = O(n + q) unke saath
\`\`\`

Ye technique jo khaas trade banaati hai wo hai pehle se ek-baar-ki \`O(n)\` keemat chukaana, har baad ki range-sum query ko \`O(1)\` mein badalne ke badle. Ye trade khaas taur par tab lene laayak hai jab usi, na-badalti data ke khilaaf kayi queries poochi jaayengi — jitni zyaada queries poochi jaati hain, ek-baar-ka setup keemat unke aar-paar utna zyaada amortized hoti hai, aur total bachat utni zyaada naatakiya hoti hai har range ko shuru se dobara jodne ke saapeksh. Agar sirf ek akela range sum kabhi zaruri hai, prefix sums koi faayda bilkul nahi pradaan karte (prefix array banaana wahi \`O(n)\` kharch karta hai jitna sirf ek maangi gayi range ko seedhe jodna) — technique khaas taur par tab apni keemat kamaata hai jab WAHI underlying data baar-baar query ki jaayegi, alag ranges ke saath, jo bilkul us dashboard-jaise scenario ki shape hai jo is lesson ne shuru mein kholi.

## Prefix sums kya nahi sulajhaate: jab underlying data badalti hai

\`\`\`js
nums[3] = 100; // nums badla — par prefix[4], prefix[5], ... ab sab STALE hain
\`\`\`

Ek sach mein mahatvapoorn limitation ye hai ki ek prefix-sum array us pal stale ho jaata hai jab underlying \`nums\` array modify kiya jaata hai — ek akele element ko badalna us position se aage har prefix-sum entry ko invalidate karta hai, kyunki un entries mein se har ek purani value maankar gani gayi thi. Agar underlying data ko baar-baar badalne ki zaroorat hai, baar-baar range queries ke saath, naive roop se poore prefix array ko har akele badlaav ke baad dobara banaana prati-update \`O(n)\` kharch karta hai, jo shaayad us faayde ko mita de jise prefix sums shuru mein pradaan karne ke liye the. Ye ek asli, thos trade-off hai jise explicitly naam dena vazan rakhta hai: prefix sums khaas taur par READ-heavy scenarios ke liye sahi tool hain na-badalti ya kam-badalti data ke khilaaf — ek scenario jismein baar-baar updates baar-baar range queries ke saath shaamil hain ek zyaada advanced structure maangta hai (ek Fenwick tree ya segment tree, is course ke aakhri pro-level module mein sankshep mein preview kiya gaya) jo dono operations ko kushalta se support karta hai, saadhe prefix sums ke bajaye.`,

    examples: [
      {
        title: 'Broken: re-summing the requested range on every query',
        titleHi: 'Toota: har query par maangi gayi range ko dobara jodna',
        code: `function rangeSum(nums, i, j) {
  let sum = 0;
  for (let k = i; k <= j; k++) sum += nums[k];
  return sum;
}`,
        codeJs: `function rangeSum(nums, i, j) {
  let sum = 0;
  for (let k = i; k <= j; k++) {
    sum += nums[k];
  }
  return sum;
}
// each call costs O(range length), overlapping ranges redo shared work`,
        codeTs: `function rangeSum(nums: number[], i: number, j: number): number {
  let sum = 0;
  for (let k = i; k <= j; k++) {
    sum += nums[k];
  }
  return sum;
}
// fully valid TypeScript — the waste is a missed pattern, not a type error`,
        output: `rangeSum([3, 1, 4, 1, 5], 1, 3) correctly returns 6, but calling
this many times with overlapping ranges repeats the same additions.`,
        explain: 'Every call re-adds its entire range from scratch, redoing work already done by any previous call whose range overlapped with this one.',
        explainHi: 'Har call apni poori range ko shuru se dobara jodta hai, kisi bhi pichli call ka kaam dobara karte hue jiski range isse overlap karti thi.',
      },
      {
        title: 'Fixed: precomputed prefix sums, O(1) per query',
        titleHi: 'Theek: precomputed prefix sums, prati query O(1)',
        code: `const prefix = [0];
for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
function rangeSum(i, j) { return prefix[j + 1] - prefix[i]; }`,
        codeJs: `function buildPrefixSums(nums) {
  const prefix = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix, i, j) {
  return prefix[j + 1] - prefix[i];
}`,
        codeTs: `function buildPrefixSums(nums: number[]): number[] {
  const prefix: number[] = [0];
  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }
  return prefix;
}

function rangeSum(prefix: number[], i: number, j: number): number {
  return prefix[j + 1] - prefix[i];
}`,
        outputJs: `Given prefix = buildPrefixSums([3, 1, 4, 1, 5]) = [0, 3, 4, 8, 9, 14],
rangeSum(prefix, 1, 3) returns prefix[4] - prefix[1] = 9 - 3 = 6,
matching the brute force, in O(1) regardless of the range's length.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The one-time O(n) setup pays for itself the moment more than one range query is asked, since every query afterward costs only a single subtraction.',
        explainHi: 'Ek-baar ka \`O(n)\` setup khud ke liye kharch chukaata hai us pal jab ek se zyaada range query poochi jaati hai, kyunki har baad ki query sirf ek akela subtraction kharch karti hai.',
      },
      {
        title: 'Confirming the leading zero handles the i = 0 edge case correctly',
        titleHi: 'Confirm karna ki shuru ka zero \`i = 0\` edge case ko sahi tarike se handle karta hai',
        code: `rangeSum(prefix, 0, 2); // sum of the first 3 elements
// = prefix[3] - prefix[0] = 8 - 0 = 8, no special case needed`,
        codeJs: `const prefix = buildPrefixSums([3, 1, 4, 1, 5]); // [0, 3, 4, 8, 9, 14]

console.log(rangeSum(prefix, 0, 2)); // 8 (3 + 1 + 4)
console.log(rangeSum(prefix, 0, 0)); // 3 (just the first element)`,
        codeTs: `const prefix: number[] = buildPrefixSums([3, 1, 4, 1, 5]);

console.log(rangeSum(prefix, 0, 2));
console.log(rangeSum(prefix, 0, 0));`,
        outputJs: `Both calls return correct results using the exact same subtraction
formula as any other range, with no special-case branch needed for
a range starting at index 0.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Because prefix[0] is defined as 0 (the sum of zero elements), the formula prefix[j+1] - prefix[i] handles i = 0 uniformly, without a separate check.',
        explainHi: 'Kyunki \`prefix[0]\` \`0\` ki tarah define kiya gaya hai (zero elements ka sum), formula \`prefix[j+1] - prefix[i]\` \`i = 0\` ko samaan roop se handle karta hai, ek alag check ke bina.',
      },
    ],

    mistakes: [
      {
        wrong: `function rangeSum(nums, i, j) {
  let sum = 0;
  for (let k = i; k <= j; k++) sum += nums[k];
  return sum;
}
// called many times against the same unchanging array with overlapping ranges`,
        right: `const prefix = buildPrefixSums(nums); // built once
function rangeSum(i, j) { return prefix[j + 1] - prefix[i]; }
// O(1) per query after the one-time O(n) setup`,
        why: 'Re-summing each requested range from scratch redoes work shared by overlapping ranges, costing O(n * q) for q queries instead of the O(n + q) prefix sums achieve.',
        whyHi: 'Har maangi gayi range ko shuru se dobara jodna overlapping ranges dwara share ki gayi kaam dobara karta hai, \`q\` queries ke liye \`O(n * q)\` kharch karte hue us \`O(n + q)\` ke bajaye jo prefix sums haasil karte hain.',
      },
      {
        wrong: `const prefix = [nums[0]]; // missing the leading zero
for (let i = 1; i < nums.length; i++) prefix.push(prefix[i - 1] + nums[i]);
function rangeSum(i, j) { return i === 0 ? prefix[j] : prefix[j] - prefix[i - 1]; }`,
        right: `const prefix = [0]; // leading zero included
for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
function rangeSum(i, j) { return prefix[j + 1] - prefix[i]; } // no special case`,
        why: 'Omitting the leading zero forces a separate special-case check for ranges starting at index 0, adding unnecessary complexity that the standard prefix-sum construction avoids entirely.',
        whyHi: 'Shuru ka zero chhodna index 0 se shuru hone waali ranges ke liye ek alag khaas-case check majboor karta hai, bekaar complexity jodte hue jise standard prefix-sum construction poori tarah avoid karta hai.',
      },
      {
        wrong: `nums[3] = 100;
rangeSum(prefix, 2, 5); // using the OLD prefix array after nums changed`,
        right: `nums[3] = 100;
const prefix = buildPrefixSums(nums); // rebuild before querying again`,
        why: 'A prefix-sum array becomes stale the instant the underlying array is modified — querying it without rebuilding first silently returns an incorrect, outdated answer.',
        whyHi: 'Ek prefix-sum array us pal stale ho jaata hai jab underlying array modify kiya jaata hai — dobara banaaye bina ise query karna chupchaap ek galat, purana jawaab return karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Analytics dashboards answering "totals between two dates" queries are a genuinely common real-world use case for prefix sums**, since the underlying daily data rarely changes once a day has passed, but the same range is queried repeatedly with different boundaries.',
        hi: '**Do dates ke beech totals poochne waale analytics dashboards prefix sums ke liye ek sach mein aam asli-duniya use case hain**, kyunki underlying daily data shaayad hi kabhi badalta hai ek baar din guzar jaaye, par wahi range baar-baar alag boundaries ke saath query ki jaati hai.',
      },
      {
        en: '**"Range Sum Query - Immutable" is a genuinely standard, widely known practice problem specifically designed to teach the prefix-sum pattern**, and variations of it appear frequently in real interviews.',
        hi: '**"Range Sum Query - Immutable" ek sach mein standard, widely known practice problem hai khaas taur par prefix-sum pattern sikhaane ke liye design ki gayi**, aur iske variations asli interviews mein aksar dikhte hain.',
      },
      {
        en: '**Fenwick trees (Binary Indexed Trees) and segment trees, briefly previewed in this course\'s final module, are real, production-used data structures that extend the prefix-sum idea to support efficient updates alongside range queries.**',
        hi: '**Fenwick trees (Binary Indexed Trees) aur segment trees, is course ke aakhri module mein sankshep mein preview kiye gaye, asli, production-istemal-hone-waale data structures hain jo prefix-sum idea ko range queries ke saath kushal updates support karne ke liye badhaate hain.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does building a prefix-sum array turn every subsequent range query into O(1), and under what specific circumstances does this technique actually pay off compared to re-summing each range directly?',
        qHi: 'Ek prefix-sum array banaana har baad ki range query ko \`O(1)\` mein kyun badalta hai, aur khaas taur par kin sthitiyon mein ye technique asal mein faayda deti hai seedhe har range ko dobara jodne ke saapeksh?',
        a: 'A prefix-sum array stores, for every position k, the cumulative total of all elements from the very beginning of the original array up through position k, computed once via a single O(n) pass. Once this array exists, the sum of any arbitrary range from index i to index j can be found through a single subtraction: the cumulative total through j, minus the cumulative total through just before i, leaves exactly the elements within the requested range and nothing else, since everything before index i has been subtracted away from the total through j. This subtraction involves exactly two array lookups and one subtraction operation, a fixed, constant amount of work entirely independent of how long the requested range actually is, which is precisely why each query costs O(1) once the prefix array exists. This technique pays off specifically when the number of range queries asked against the same underlying data is large enough that the one-time O(n) cost of building the prefix array is outweighed by the savings gained across all of those queries. If only a single range sum is ever needed, prefix sums provide no benefit at all, since building the full prefix array costs the same O(n) that directly summing the one requested range would have cost anyway — the technique specifically earns its value when many different range queries will be asked against data that does not change, since the one-time setup cost gets amortized across every subsequent O(1) query, producing a total cost of O(n) plus O(q) for q queries, which is dramatically cheaper than O(n) multiplied by q once q grows large.',
        aHi: 'Ek prefix-sum array, har position \`k\` ke liye, asli array ke bilkul shuru se position \`k\` tak har element ka cumulative total store karta hai, ek akele \`O(n)\` pass ke zariye ek baar gana gaya. Ek baar ye array maujood ho jaaye, index \`i\` se index \`j\` tak kisi bhi manmaani range ka sum ek akele subtraction ke zariye dhoondha jaa sakta hai: \`j\` tak cumulative total, minus \`i\` se bilkul pehle tak cumulative total, bilkul wo elements chhodta hai jo maangi gayi range ke andar hain aur kuch aur nahi, kyunki index \`i\` se pehle ki har cheez \`j\` tak ke total se ghataa di gayi hai. Is subtraction mein bilkul do array lookups aur ek subtraction operation shaamil hai, ek fixed, constant kaam jo poori tarah is baat se azaad hai ki maangi gayi range asal mein kitni lambi hai, jo bilkul isliye hai ki ek baar prefix array maujood hone ke baad har query \`O(1)\` kharch karti hai. Ye technique khaas taur par tab faayda deti hai jab usi underlying data ke khilaaf poochi gayi range queries ki tadaad itni badi ho ki prefix array banaane ki ek-baar-ki \`O(n)\` keemat un sab queries ke aar-paar milane waali bachat se kam ho jaaye. Agar sirf ek akela range sum kabhi zaruri hai, prefix sums bilkul koi faayda pradaan nahi karte, kyunki poora prefix array banaana wahi \`O(n)\` kharch karta hai jo seedhe ek maangi gayi range ko sum karna anyway kharch karta. Technique khaas taur par apni keemat tab kamaati hai jab usi na-badalti data ke khilaaf kayi alag range queries poochi jaayengi, kyunki ek-baar ka setup keemat har baad ki \`O(1)\` query ke aar-paar amortized ho jaata hai, \`q\` queries ke liye ek total keemat \`O(n)\` plus \`O(q)\` banaate hue, jo ek baar \`q\` bada ho jaaye \`O(n)\` ko \`q\` se guna kiye gaye se naatakiya roop se sasta hai.',
      },
      {
        q: 'Why does a prefix-sum array become invalid the moment the underlying data changes, and what does this imply about when prefix sums are, and are not, the right tool?',
        qHi: 'Ek prefix-sum array us pal invalid kyun ho jaata hai jab underlying data badalta hai, aur iska matlab kya hai is baare mein ki prefix sums sahi tool hain, aur kab nahi hain?',
        a: 'Every entry in a prefix-sum array is computed as a cumulative total built directly from the specific values that existed in the underlying array at the moment the prefix array was constructed. If any single element of the underlying array is subsequently changed, every prefix-sum entry from that element\'s position onward was computed using the OLD, now-incorrect value, and is therefore no longer an accurate cumulative total — querying the prefix array after such a change, without rebuilding it, will silently produce a wrong answer, since nothing about querying the array itself detects or flags that the underlying assumption it depends on no longer holds. This directly implies a genuine, practical limitation on when prefix sums are the appropriate technique to reach for: they are specifically well suited to situations where the underlying data is read many times, with many different range queries, but changes rarely or never once queries begin, since the one-time cost of building the prefix array is only worth paying if that array remains valid across many subsequent queries. In a scenario where updates to the underlying data happen frequently, interleaved with frequent range queries, plain prefix sums become a poor fit, since naively rebuilding the entire array after every single update costs O(n) per update, potentially erasing the benefit the technique was meant to provide, or worse, silently returning stale results if a rebuild is forgotten after an update. Scenarios that genuinely need both frequent updates and frequent range queries call for a more sophisticated structure specifically designed to support both efficiently — a Fenwick tree or segment tree, which this course\'s final module previews conceptually — rather than plain prefix sums, which trade the ability to handle updates cheaply for extremely cheap queries against otherwise-static data.',
        aHi: 'Ek prefix-sum array mein har entry ek cumulative total ki tarah gani jaati hai jo seedhe un khaas values se banaayi jaati hai jo underlying array mein us pal maujood thi jab prefix array banaayi gayi thi. Agar underlying array ka koi bhi akela element baad mein badla jaata hai, us element ki position se aage har prefix-sum entry PURANI, ab-galat value ka istemal karke gani gayi thi, aur isliye ab ek sahi cumulative total nahi hai — aise badlaav ke baad, ise dobara banaaye bina, prefix array ko query karna chupchaap ek galat jawaab banaayega, kyunki array ko khud query karne ke baare mein kuch bhi detect ya flag nahi karta ki jis underlying dhaarna par ye nirbhar karta hai wo ab nahi tikti. Ye seedhe ek asli, vyaavahaarik limitation darsata hai is baare mein ki prefix sums kab pakadne laayak upyukt technique hain: wo khaas taur par un sthitiyon ke liye achhi tarah suit karte hain jahan underlying data kayi baar padhi jaati hai, kayi alag range queries ke saath, par shaayad hi kabhi ya kabhi nahi badalti ek baar queries shuru hoti hain, kyunki prefix array banaane ki ek-baar-ki keemat sirf tab chukaane laayak hai agar wo array kayi baad ki queries ke aar-paar valid rehta hai. Ek scenario mein jahan underlying data mein updates baar-baar hote hain, baar-baar range queries ke saath interleaved, saadhe prefix sums ek kharaab fit ban jaate hain, kyunki naive roop se poore array ko har akele update ke baad dobara banaana prati-update \`O(n)\` kharch karta hai, sambhaavit roop se us faayde ko mitaate hue jise technique pradaan karne ke liye thi, ya aur bura, chupchaap stale nateeje return karta hai agar ek update ke baad dobara banaana bhool jaaye. Sthitiyaan jinhe sach mein baar-baar updates aur baar-baar range queries dono chahiye ek zyaada sophisticated structure maangte hain jo khaas taur par dono ko kushalta se support karne ke liye design ki gayi hai — ek Fenwick tree ya segment tree, jise is course ka aakhri module conceptually preview karta hai — saadhe prefix sums ke bajaye, jo updates ko sasta handle karne ki kshamta ko anyatha-static data ke khilaaf ati-sasti queries ke liye trade karte hain.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (re-sum from scratch) and fixed (prefix-sum) rangeSum functions from this lesson. Call each 10,000 times with random overlapping ranges against a 100,000-item array, and time both using console.time/console.timeEnd.',
        taskHi: 'Is lesson ke toote (shuru se dobara sum) aur theek (prefix-sum) \`rangeSum\` functions dono banao. Har ek ko 10,000 baar random overlapping ranges ke saath ek 100,000-item array ke khilaaf bulaao, aur dono ko \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Generate random ranges using Math.floor(Math.random() * nums.length) for both the start and end of each query, ensuring the start is always less than or equal to the end.',
        hintHi: 'Har query ke start aur end dono ke liye \`Math.floor(Math.random() * nums.length)\` istemal karke random ranges banaao, ye sunishchit karte hue ki start hamesha end ke barabar ya usse chhota ho.',
      },
      {
        task: 'Build the prefix sum array for nums = [3, 1, 4, 1, 5] by hand, writing down each prefix[k] value before checking it against the buildPrefixSums function\'s actual output.',
        taskHi: '\`nums = [3, 1, 4, 1, 5]\` ke liye prefix sum array haath se banaao, har \`prefix[k]\` value ko \`buildPrefixSums\` function ke asli output ke khilaaf check karne se pehle likhte hue.',
        hint: 'Remember prefix has one more entry than nums, starting with prefix[0] = 0.',
        hintHi: 'Yaad rakho \`prefix\` mein \`nums\` se ek zyaada entry hai, \`prefix[0] = 0\` se shuru hote hue.',
      },
      {
        task: 'Deliberately modify one element of nums after building its prefix-sum array, then query a range that includes the modified element without rebuilding. Confirm the result is silently wrong, then fix it by rebuilding the array.',
        taskHi: 'Jaan-boojhkar \`nums\` ke ek element ko iske prefix-sum array banaane ke baad modify karo, phir ek range query karo jo modified element ko shaamil karti hai bina dobara banaaye. Confirm karo ki nateeja chupchaap galat hai, phir array ko dobara banaake ise theek karo.',
        hint: 'Compare the query result before and after the modification to see the stale, incorrect value directly, before fixing it.',
        hintHi: 'Modification se pehle aur baad ke query nateeje ki tulna karo stale, galat value ko seedhe dekhne ke liye, ise theek karne se pehle.',
      },
    ],

    keyTakeaways: [
      'A prefix-sum array stores, at each position, the cumulative total from the beginning up through that position, computed once via a single O(n) pass.',
      'Any range sum from index i to j can then be found via a single subtraction (prefix[j+1] - prefix[i]), turning O(range length) per query into O(1) per query.',
      'The leading zero entry (prefix[0] = 0) exists specifically to let the same subtraction formula handle ranges starting at index 0 without a separate special case.',
      'Prefix sums pay off specifically when many range queries are asked against the same, unchanging data — the one-time O(n) setup cost is amortized across all of them.',
      'A prefix-sum array becomes stale the instant the underlying array changes — querying it without rebuilding silently returns an incorrect, outdated answer.',
      'Scenarios needing both frequent updates and frequent range queries call for a more advanced structure (a Fenwick tree or segment tree) rather than plain prefix sums.',
    ],
    keyTakeawaysHi: [
      'Ek prefix-sum array, har position par, shuru se us position tak cumulative total store karta hai, ek akele \`O(n)\` pass ke zariye ek baar gana gaya.',
      'Index \`i\` se \`j\` tak koi bhi range sum phir ek akele subtraction (\`prefix[j+1] - prefix[i]\`) ke zariye dhoondha jaa sakta hai, prati-query \`O(range length)\` ko prati-query \`O(1)\` mein badalte hue.',
      'Shuru ka zero entry (\`prefix[0] = 0\`) khaas taur par isliye maujood hai taaki wahi subtraction formula index 0 se shuru hone waali ranges ko ek alag khaas case ke bina handle kar sake.',
      'Prefix sums khaas taur par tab faayda dete hain jab usi, na-badalti data ke khilaaf kayi range queries poochi jaati hain — ek-baar ka \`O(n)\` setup keemat un sab ke aar-paar amortized hota hai.',
      'Ek prefix-sum array us pal stale ho jaata hai jab underlying array badalta hai — dobara banaaye bina ise query karna chupchaap ek galat, purana jawaab return karta hai.',
      'Sthitiyaan jinhe baar-baar updates aur baar-baar range queries dono chahiye ek zyaada advanced structure (ek Fenwick tree ya segment tree) maangte hain saadhe prefix sums ke bajaye.',
    ],
  },
];
