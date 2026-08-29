/**
 * DSA Complete Course — Module 10: Sorting & Searching, lesson 5
 * (final lesson of Module 10).
 *
 * Non-comparison sorting: counting sort and radix sort, which beat the
 * O(n log n) comparison-sort lower bound by not comparing elements at all.
 * Builds on this module's lesson 1 (the O(n log n) lower bound proof for
 * comparison sorts) and this course's Module 3 (buckets / direct indexing).
 * Broken example: sorting a huge array of small integers — say ten million
 * values all in the range 0 to 1000 — with merge sort, paying O(n log n) when
 * the keys' structure allows O(n). Fixed with counting sort: make one pass to
 * tally how many times each value appears, then a second pass to write the
 * values back out in order, using the tallies. O(n + k) where k is the size of
 * the value range. Radix sort extends this to larger integers by counting-
 * sorting one digit at a time from least significant to most, staying O(d(n+k)).
 * The lesson is clear about the precondition: these only work for keys that map
 * to a bounded integer range.
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

export const DSA_MODULE_10_PART5: CourseLesson[] = [
  {
    slug: 'counting-sort-and-radix-sort',
    title: 'Counting Sort and Radix Sort: Beating O(n log n)',
    titleHi: 'Counting Sort Aur Radix Sort: O(n log n) Ko Haraana',
    description: 'Sorting ten million integers that are all between 0 and 1000 by handing them to merge sort. It works and it is O(n log n) — but the values fall in a tiny fixed range, and that structure makes an O(n) sort possible. Using a comparison sort here pays for flexibility the data does not need.',
    descriptionHi: 'Ek crore integers ko sort karna jo sab 0 aur 1000 ke beech hain unhe merge sort ko dekar. Ye kaam karta hai aur O(n log n) hai — par values ek chhoti fixed range mein aati hain, aur wo structure ek O(n) sort mumkin banaata hai. Yahaan ek comparison sort istemal karna us flexibility ke liye pay karta hai jo data ko nahi chahiye.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Sorting a huge box of loose coins.** If someone hands you thousands of mixed coins and asks you to arrange them from smallest denomination to largest, the comparison approach — pick up two coins, decide which is worth less, repeat — is slow and unnecessary. Coins are not arbitrary values; they come in a small fixed set of denominations. So you do this instead: set out a labelled cup for each denomination, and go through the box once, dropping each coin into its cup. One pass, no coin compared against another. Then walk the cups in order — 1s, then 2s, then 5s, then 10s — and tip each cup back into a line. The coins come out fully sorted, and the total work was one pass to distribute plus one pass to collect, regardless of how many coins there were. The trick only works because there is a small, known set of possible values and you can make one cup per value. If the coins could be any real number of rupees, you could not set out a cup for each, and you would be back to comparing. That is exactly the line between counting sort and comparison sort.',
      hi: '**Ek bade loose coins ke box ko sort karna.** Agar koi aapko hazaaron mixed coins deta hai aur aapse unhe sabse chhoti denomination se sabse badi tak arrange karne ko kehta hai, comparison approach — do coins uthao, tay karo kaunsa kam ka hai, dohraao — slow aur anaavashyak hai. Coins arbitrary values nahi hain; wo denominations ke ek chhote fixed set mein aate hain. Toh aap iske bajaye ye karte ho: har denomination ke liye ek labelled cup rakho, aur box ke through ek baar jao, har coin ko iske cup mein daalte hue. Ek pass, koi coin doosre ke against compare nahi. Phir cups ko order mein chalo — 1s, phir 2s, phir 5s, phir 10s — aur har cup ko wapas ek line mein tip karo. Coins poori tarah sorted bahar aate hain, aur kul kaam distribute karne ke liye ek pass plus collect karne ke liye ek pass tha, chahe kitne bhi coins the. Trick sirf isliye kaam karta hai kyunki sambhaavit values ka ek chhota, known set hai aur aap prati value ek cup bana sakte ho. Agar coins koi bhi real number of rupees ho sakte, aap har ke liye ek cup nahi rakh sakte, aur aap wapas comparing par hote. Ye bilkul counting sort aur comparison sort ke beech ki line hai.',
    },

    simple: `**Start broken.** Sorting values known to be in \`[0, k]\` with a comparison sort:

\`\`\`js
// 10,000,000 integers, every one in [0, 1000]
const sorted = bigArray.slice().sort((a, b) => a - b);   // O(n log n)
\`\`\`

This is correct, but it does \`n log n\` comparisons — about \`10^7 * 23 ~= 2.3 * 10^8\` operations — to sort data whose values span only 1001 distinct possibilities. This module's lesson 1 proved \`O(n log n)\` is the floor for *comparison* sorts, but that proof assumed the only tool is "is x < y?". When you know the keys are small bounded integers, you have a better tool.

**The fix: counting sort — tally, then write back**

\`\`\`js
function countingSort(a, maxValue) {
  const count = new Array(maxValue + 1).fill(0);
  for (const x of a) count[x]++;              // pass 1: how many of each value

  const out = [];
  for (let v = 0; v <= maxValue; v++) {
    for (let c = 0; c < count[v]; c++) out.push(v);   // pass 2: emit each value count[v] times
  }
  return out;
}

countingSort([4, 2, 2, 8, 3, 3, 1], 8); // [1, 2, 2, 3, 3, 4, 8]
\`\`\`

\`\`\`ts
function countingSort(a: number[], maxValue: number): number[] {
  const count = new Array<number>(maxValue + 1).fill(0);
  for (const x of a) count[x]!++;
  const out: number[] = [];
  for (let v = 0; v <= maxValue; v++) {
    for (let c = 0; c < count[v]!; c++) out.push(v);
  }
  return out;
}
\`\`\`

No two elements are ever compared. Pass 1 is \`O(n)\`. Pass 2 writes exactly \`n\` values total (the inner loop runs \`count[v]\` times, and the \`count[v]\` values sum to \`n\`), plus \`O(k)\` to walk the \`count\` array itself. Total: **\`O(n + k)\`**, where \`k = maxValue + 1\`. When \`k\` is small relative to \`n\` — a million records with a status field of 5 values, ages 0 to 120, exam scores 0 to 100 — this is a genuine linear sort, faster than any comparison sort can be.

**Stable counting sort, for sorting records by an integer key**

\`\`\`js
function countingSortStable(records, key, maxValue) {
  const count = new Array(maxValue + 1).fill(0);
  for (const r of records) count[key(r)]++;

  // prefix sums: count[v] becomes the FINAL index where the first v-keyed record goes
  for (let v = 1; v <= maxValue; v++) count[v] += count[v - 1];

  const out = new Array(records.length);
  for (let i = records.length - 1; i >= 0; i--) {   // iterate BACKWARDS to stay stable
    const v = key(records[i]);
    out[--count[v]] = records[i];
  }
  return out;
}
\`\`\`

To sort *records* (not bare numbers) and keep equal-keyed records in their original order, turn the counts into prefix sums — so \`count[v]\` tells you the exact output slot for the next record with key \`v\` — then place records from the back of the input forward. Walking backwards is what makes it stable, which matters because radix sort (below) depends on it.`,

    simpleHi: `**Toote hue se shuru.** \`[0, k]\` mein jaani gayi values ko ek comparison sort se sort karna:

\`\`\`js
// 10,000,000 integers, har ek [0, 1000] mein
const sorted = bigArray.slice().sort((a, b) => a - b);   // O(n log n)
\`\`\`

Ye sahi hai, par ye \`n log n\` comparisons karta hai — lagbhag \`10^7 * 23 ~= 2.3 * 10^8\` operations — us data ko sort karne ke liye jiski values sirf 1001 distinct possibilities span karti hain. Is module ke lesson 1 ne saabit kiya \`O(n log n)\` *comparison* sorts ke liye floor hai, par wo proof maana ki ekmatra tool "kya x < y?" hai. Jab aap jaante ho keys chhote bounded integers hain, aapke paas ek behtar tool hai.

**Fix: counting sort — tally karo, phir wapas likho**

\`\`\`js
function countingSort(a, maxValue) {
  const count = new Array(maxValue + 1).fill(0);
  for (const x of a) count[x]++;              // pass 1: har value ke kitne

  const out = [];
  for (let v = 0; v <= maxValue; v++) {
    for (let c = 0; c < count[v]; c++) out.push(v);   // pass 2: har value ko count[v] baar emit karo
  }
  return out;
}

countingSort([4, 2, 2, 8, 3, 3, 1], 8); // [1, 2, 2, 3, 3, 4, 8]
\`\`\`

\`\`\`ts
function countingSort(a: number[], maxValue: number): number[] {
  const count = new Array<number>(maxValue + 1).fill(0);
  for (const x of a) count[x]!++;
  const out: number[] = [];
  for (let v = 0; v <= maxValue; v++) {
    for (let c = 0; c < count[v]!; c++) out.push(v);
  }
  return out;
}
\`\`\`

Koi do elements kabhi compare nahi hote. Pass 1 \`O(n)\` hai. Pass 2 bilkul \`n\` values kul likhta hai (inner loop \`count[v]\` baar chalta hai, aur \`count[v]\` values \`n\` tak sum karti hain), plus \`count\` array khud chalne ke liye \`O(k)\`. Kul: **\`O(n + k)\`**, jahaan \`k = maxValue + 1\`. Jab \`k\` \`n\` ke saapeksh chhota hai — ek million records ek 5 values ke status field ke saath, ages 0 se 120, exam scores 0 se 100 — ye ek sach mein linear sort hai, kisi bhi comparison sort se tez.

**Stable counting sort, records ko ek integer key se sort karne ke liye**

\`\`\`js
function countingSortStable(records, key, maxValue) {
  const count = new Array(maxValue + 1).fill(0);
  for (const r of records) count[key(r)]++;

  // prefix sums: count[v] wo FINAL index ban jaata hai jahaan pehla v-keyed record jaata hai
  for (let v = 1; v <= maxValue; v++) count[v] += count[v - 1];

  const out = new Array(records.length);
  for (let i = records.length - 1; i >= 0; i--) {   // stable rehne ke liye PEECHHE iterate karo
    const v = key(records[i]);
    out[--count[v]] = records[i];
  }
  return out;
}
\`\`\`

*Records* (bare numbers nahi) ko sort karne aur barabar-keyed records ko unke original order mein rakhne ke liye, counts ko prefix sums mein badlo — taaki \`count[v]\` aapko key \`v\` waale agle record ke liye exact output slot batata hai — phir records ko input ke peechhe se aage rakho. Peechhe chalna wahi hai jo ise stable banaata hai, jo maayne rakhta hai kyunki radix sort (neeche) ispar nirbhar karta hai.`,

    content: `## Radix sort: counting sort applied digit by digit

\`\`\`
Sort [329, 457, 657, 839, 436, 720, 355] by counting-sorting one digit at a time,
least significant digit (LSD) first:

by 1s digit:  720, 355, 436, 457, 657, 329, 839
by 10s digit: 720, 329, 436, 839, 355, 457, 657
by 100s digit: 329, 355, 436, 457, 657, 720, 839   <- fully sorted
\`\`\`

Each pass is a *stable* counting sort on one digit (range 0 to 9, so \`k = 10\`). Because each pass is stable, the ordering achieved by the previous, less-significant passes is preserved among elements that tie on the current digit. After processing all \`d\` digits, the array is fully sorted. Cost: \`d\` passes, each \`O(n + 10)\`, so \`O(d(n + k))\`. For 32-bit integers processed one byte at a time, \`d = 4\` and \`k = 256\`, giving \`O(4(n + 256)) = O(n)\` for large \`n\`.

\`\`\`js
function radixSort(a) {
  let arr = a.slice();
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    arr = countingByDigit(arr, exp);   // stable counting sort on the digit at 'exp'
  }
  return arr;
}

function countingByDigit(a, exp) {
  const count = new Array(10).fill(0);
  for (const x of a) count[Math.floor(x / exp) % 10]++;
  for (let d = 1; d < 10; d++) count[d] += count[d - 1];
  const out = new Array(a.length);
  for (let i = a.length - 1; i >= 0; i--) {
    const d = Math.floor(a[i] / exp) % 10;
    out[--count[d]] = a[i];
  }
  return out;
}
\`\`\`

## Why radix sort must use a stable inner sort, and go LSD-first

\`\`\`
LSD radix: sort by the least significant digit first, then the next, etc.
Correctness depends on each digit-sort being STABLE.

After sorting by the 1s digit, all numbers ending in 3 are in their correct
relative order among themselves. When the 10s-digit pass then groups numbers by
their 10s digit, a stable sort keeps the earlier 1s-digit order WITHIN each
10s-digit group. If the digit-sort were not stable, the 10s pass would scramble
the 1s-digit ordering and the final result would be wrong.
\`\`\`

This is precisely why lesson 1's discussion of stability was not academic: radix sort is the headline application where a sort being stable is load-bearing for correctness, not just a nicety.

## The precondition, stated plainly

\`\`\`
Counting sort needs: keys are integers (or map cleanly to integers) in a range
  [0, k] where k is not enormous relative to n. Memory is O(k).

Radix sort needs: keys are fixed-width integers (or fixed-length strings), so
  there is a bounded number of digits d.

Neither works for: arbitrary floating-point values, arbitrary-length strings
  with no bound, or anything where you only have a "less than" comparator and no
  way to extract bounded integer keys.
\`\`\`

If \`k\` is close to or larger than \`n^2\` (e.g. sorting a thousand 64-bit hashes), counting sort's \`O(k)\` memory and time make it worse than an \`O(n log n)\` comparison sort. The rule of thumb: counting/radix sort wins when \`k\` (or \`d \* radix\`) is \`O(n)\` or smaller.

## Bucket sort: the same idea for uniformly distributed reals

\`\`\`
If keys are real numbers spread roughly uniformly over [0, 1):
  - make n buckets, put key x into bucket floor(x * n)
  - each bucket gets ~1 element on average -> sort each bucket with insertion sort
  - concatenate the buckets
  Expected O(n); worst case O(n^2) if the distribution is skewed and one bucket
  gets everything.
\`\`\`

Bucket sort trades counting sort's "exact known range" requirement for a "roughly uniform distribution" assumption, extending the distribute-then-collect idea to continuous keys.`,

    contentHi: `## Radix sort: counting sort digit by digit lagaya gaya

\`\`\`
[329, 457, 657, 839, 436, 720, 355] ko ek baar mein ek digit counting-sort karke sort karo,
least significant digit (LSD) pehle:

1s digit se:  720, 355, 436, 457, 657, 329, 839
10s digit se: 720, 329, 436, 839, 355, 457, 657
100s digit se: 329, 355, 436, 457, 657, 720, 839   <- poori tarah sorted
\`\`\`

Har pass ek digit par ek *stable* counting sort hai (range 0 se 9, isliye \`k = 10\`). Kyunki har pass stable hai, pichhle, kam-significant passes se haasil kiya gaya ordering un elements ke beech preserve hota hai jo current digit par tie karte hain. Sab \`d\` digits process karne ke baad, array poori tarah sorted hai. Cost: \`d\` passes, har ek \`O(n + 10)\`, isliye \`O(d(n + k))\`. 32-bit integers ke liye ek baar mein ek byte process kiye gaye, \`d = 4\` aur \`k = 256\`, bade \`n\` ke liye \`O(4(n + 256)) = O(n)\` dete hue.

\`\`\`js
function radixSort(a) {
  let arr = a.slice();
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    arr = countingByDigit(arr, exp);   // 'exp' par digit par stable counting sort
  }
  return arr;
}

function countingByDigit(a, exp) {
  const count = new Array(10).fill(0);
  for (const x of a) count[Math.floor(x / exp) % 10]++;
  for (let d = 1; d < 10; d++) count[d] += count[d - 1];
  const out = new Array(a.length);
  for (let i = a.length - 1; i >= 0; i--) {
    const d = Math.floor(a[i] / exp) % 10;
    out[--count[d]] = a[i];
  }
  return out;
}
\`\`\`

## Radix sort ko ek stable inner sort kyun istemal karna chahiye, aur LSD-first jaana chahiye

\`\`\`
LSD radix: pehle least significant digit se sort karo, phir agla, waghaira.
Correctness har digit-sort ke STABLE hone par nirbhar karti hai.

1s digit se sort karne ke baad, 3 par khatam hone waale sab numbers apne beech apne
sahi relative order mein hain. Jab 10s-digit pass phir numbers ko unke 10s digit se
group karta hai, ek stable sort har 10s-digit group ke ANDAR pehle ka 1s-digit order
rakhta hai. Agar digit-sort stable na hota, 10s pass 1s-digit ordering ko scramble
karta aur final nateeja galat hota.
\`\`\`

Yahi bilkul wajah hai ki lesson 1 ki stability ki charcha academic nahi thi: radix sort headline application hai jahaan ek sort ka stable hona correctness ke liye load-bearing hai, sirf ek nicety nahi.

## Precondition, saaf-saaf bataya gaya

\`\`\`
Counting sort ko chahiye: keys integers hain (ya saaf-saaf integers tak map hote hain)
  ek range [0, k] mein jahaan k, n ke saapeksh bahut bada nahi hai. Memory O(k) hai.

Radix sort ko chahiye: keys fixed-width integers hain (ya fixed-length strings), isliye
  digits d ki ek bounded tadaad hai.

Koi bhi kaam nahi karta: arbitrary floating-point values, koi bound na waali
  arbitrary-length strings, ya kuch bhi jahaan aapke paas sirf ek "less than" comparator
  hai aur bounded integer keys extract karne ka koi tarika nahi.
\`\`\`

Agar \`k\` \`n^2\` ke kareeb ya usse bada hai (jaise ek hazaar 64-bit hashes sort karna), counting sort ki \`O(k)\` memory aur time ise ek \`O(n log n)\` comparison sort se kharab banate hain. Rule of thumb: counting/radix sort jeetta hai jab \`k\` (ya \`d \* radix\`) \`O(n)\` ya chhota hai.

## Bucket sort: uniformly distributed reals ke liye wahi idea

\`\`\`
Agar keys real numbers hain jo [0, 1) par lagbhag uniformly phaile hain:
  - n buckets banao, key x ko bucket floor(x * n) mein daalo
  - har bucket ko average mein ~1 element milta hai -> har bucket ko insertion sort se sort karo
  - buckets ko concatenate karo
  Expected O(n); worst case O(n^2) agar distribution skewed hai aur ek bucket ko sab kuch milta hai.
\`\`\`

Bucket sort counting sort ki "exact known range" requirement ko ek "roughly uniform distribution" assumption ke liye trade karta hai, distribute-then-collect idea ko continuous keys tak extend karte hue.`,

    examples: [
      {
        title: 'Broken: comparison sort on small bounded integers',
        titleHi: 'Toota: chhote bounded integers par comparison sort',
        code: `bigArray.sort((a, b) => a - b);   // O(n log n) for values that span only [0, 1000]`,
        codeJs: `// 10,000,000 values, all in [0, 1000]
const sorted = bigArray.slice().sort((a, b) => a - b);
// ~2.3e8 comparison operations to order data with 1001 distinct values`,
        codeTs: `const sorted: number[] = bigArray.slice().sort((a, b) => a - b);`,
        output: `// correct, but pays O(n log n) when O(n) is possible`,
        explain: 'The O(n log n) lower bound only applies to sorts that learn about the data solely through comparisons. Small integer keys carry structure a comparison sort throws away.',
        explainHi: 'O(n log n) lower bound sirf un sorts par lagta hai jo data ke baare mein sirf comparisons ke zariye seekhte hain. Chhote integer keys structure le jaate hain jo ek comparison sort phenk deta hai.',
      },
      {
        title: 'Fixed: counting sort — O(n + k), no comparisons',
        titleHi: 'Theek: counting sort — O(n + k), koi comparisons nahi',
        code: `for (const x of a) count[x]++;                       // tally
for (let v = 0; v <= maxValue; v++)
  for (let c = 0; c < count[v]; c++) out.push(v);    // emit`,
        codeJs: `function countingSort(a, maxValue) {
  const count = new Array(maxValue + 1).fill(0);
  for (const x of a) count[x]++;
  const out = [];
  for (let v = 0; v <= maxValue; v++)
    for (let c = 0; c < count[v]; c++) out.push(v);
  return out;
}
console.log(countingSort([4, 2, 2, 8, 3, 3, 1], 8)); // [1, 2, 2, 3, 3, 4, 8]`,
        codeTs: `function countingSort(a: number[], maxValue: number): number[] {
  const count = new Array<number>(maxValue + 1).fill(0);
  for (const x of a) count[x]!++;
  const out: number[] = [];
  for (let v = 0; v <= maxValue; v++)
    for (let c = 0; c < count[v]!; c++) out.push(v);
  return out;
}`,
        outputJs: `[1, 2, 2, 3, 3, 4, 8]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'One pass to count occurrences, one pass to write values back in order. Total work is O(n) for the passes plus O(k) to walk the count array — linear when k is small.',
        explainHi: 'Occurrences ginne ke liye ek pass, values wapas order mein likhne ke liye ek pass. Kul kaam passes ke liye O(n) plus count array chalne ke liye O(k) hai — linear jab k chhota hai.',
      },
      {
        title: 'Radix sort: stable counting sort per digit, LSD first',
        titleHi: 'Radix sort: prati digit stable counting sort, LSD pehle',
        code: `for (let exp = 1; max / exp > 0; exp *= 10)
  arr = countingByDigit(arr, exp);   // stable sort on the current digit`,
        codeJs: `function radixSort(a) {
  let arr = a.slice();
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const count = new Array(10).fill(0);
    for (const x of arr) count[Math.floor(x / exp) % 10]++;
    for (let d = 1; d < 10; d++) count[d] += count[d - 1];
    const out = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
      const d = Math.floor(arr[i] / exp) % 10;
      out[--count[d]] = arr[i];
    }
    arr = out;
  }
  return arr;
}
console.log(radixSort([329, 457, 657, 839, 436, 720, 355]));
// [329, 355, 436, 457, 657, 720, 839]`,
        codeTs: `function radixSort(a: number[]): number[] {
  let arr = a.slice();
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const count = new Array<number>(10).fill(0);
    for (const x of arr) count[Math.floor(x / exp) % 10]!++;
    for (let d = 1; d < 10; d++) count[d]! += count[d - 1]!;
    const out = new Array<number>(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
      const d = Math.floor(arr[i]! / exp) % 10;
      out[--count[d]!] = arr[i]!;
    }
    arr = out;
  }
  return arr;
}`,
        outputJs: `[329, 355, 436, 457, 657, 720, 839]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each pass stably counting-sorts on one digit, least significant first. Stability preserves the ordering from earlier digits among elements that tie on the current one, so after d passes the array is fully sorted.',
        explainHi: 'Har pass ek digit par stably counting-sort karta hai, least significant pehle. Stability un elements ke beech pehle ke digits ka ordering preserve karti hai jo current par tie karte hain, isliye d passes ke baad array poori tarah sorted hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// using counting sort when k is huge relative to n
countingSort(thousandRandom64BitInts, Number.MAX_SAFE_INTEGER); // allocates a gigantic array`,
        right: `// counting sort is only worthwhile when k = O(n). For k >> n, use a
// comparison sort (O(n log n)) instead.`,
        why: 'Counting sort allocates and scans an array of size k. If k is far larger than n, that O(k) memory and time dominate and make it slower and heavier than an O(n log n) comparison sort.',
        whyHi: 'Counting sort size k ka ek array allocate aur scan karta hai. Agar k, n se kaafi bada hai, wo O(k) memory aur time haavi hote hain aur ise ek O(n log n) comparison sort se slow aur bhaari banaate hain.',
      },
      {
        wrong: `// radix sort using a NON-stable inner sort (or iterating forwards in the placement)
for (let i = 0; i < a.length; i++) out[count[d]++] = a[i]; // forward -> not stable`,
        right: `for (let i = a.length - 1; i >= 0; i--) out[--count[d]] = a[i]; // backward -> stable`,
        why: 'Radix sort relies on each digit-pass preserving the order established by previous passes among elements that tie on the current digit. A non-stable pass scrambles that, and the final result is wrong.',
        whyHi: 'Radix sort har digit-pass par nirbhar karta hai jo pichhle passes se sthaapit order un elements ke beech preserve kare jo current digit par tie karte hain. Ek non-stable pass use scramble karta hai, aur final nateeja galat hai.',
      },
      {
        wrong: `// radix sort MSD-first with a naive merge-back, losing the sub-orderings
// (MSD radix is possible but needs careful recursion per bucket — LSD is simpler)`,
        right: `// LSD (least-significant-digit) radix: process digits from least to most
// significant, one full stable pass each. Simple and correct.`,
        why: 'LSD radix works because a stable pass on a more-significant digit keeps the fully-sorted-by-less-significant-digits order within each group. Doing MSD first without per-bucket recursion loses that property.',
        whyHi: 'LSD radix kaam karta hai kyunki ek zyaada-significant digit par ek stable pass har group ke andar poori-tarah-kam-significant-digits-se-sorted order rakhta hai. MSD pehle karna bina per-bucket recursion ke wo property kho deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Sorting fixed-width keys at scale** — network packet timestamps, fixed-length IDs, database row keys — often uses radix sort in high-performance systems because it beats O(n log n) and its passes are cache-friendly sequential scans.',
        hi: '**Scale par fixed-width keys sort karna** — network packet timestamps, fixed-length IDs, database row keys — aksar high-performance systems mein radix sort istemal karta hai kyunki ye O(n log n) ko haraata hai aur iske passes cache-friendly sequential scans hain.',
      },
      {
        en: '**Counting sort is the standard way to sort by a low-cardinality field** — sorting millions of records by a status enum, a month, a rating from 1 to 5 — in one linear pass with a tiny count array.',
        hi: '**Counting sort ek low-cardinality field se sort karne ka standard tarika hai** — millions of records ko ek status enum, ek month, 1 se 5 rating se sort karna — ek linear pass mein ek tiny count array ke saath.',
      },
      {
        en: '**Suffix-array and string-processing algorithms** use radix sort on tuples of character ranks as an inner step, because the ranks are bounded integers and O(n log n) per round would blow the overall budget.',
        hi: '**Suffix-array aur string-processing algorithms** character ranks ke tuples par radix sort ko ek inner step ki tarah istemal karte hain, kyunki ranks bounded integers hain aur prati round O(n log n) overall budget uda deta.',
      },
    ],

    interviewQA: [
      {
        q: 'Counting sort runs in O(n + k) and beats the O(n log n) comparison-sort lower bound. Does it violate the lower bound? Explain.',
        qHi: 'Counting sort O(n + k) mein chalta hai aur O(n log n) comparison-sort lower bound ko haraata hai. Kya ye lower bound ka ullanghan karta hai? Samjhaao.',
        a: 'It does not violate the lower bound, because the lower bound is a statement about a specific model of computation, and counting sort operates outside that model. The O(n log n) bound was proved for comparison sorts, meaning algorithms whose only way to learn about the input is to ask "is element x less than element y", getting a single bit back each time. The proof counts how many such bits you need to distinguish all n factorial possible orderings, and concludes you need on the order of n log n comparisons in the worst case. Counting sort never performs a single element-to-element comparison. Instead it uses the value of each key directly as an array index: it reads key x and increments count at position x. That is a completely different primitive operation, and it extracts far more than one bit of information per step, because an integer key in a range of size k carries log base 2 of k bits, and counting sort uses all of them at once by indexing. The cost of this power is a precondition the comparison model does not impose: the keys must be integers in a bounded range, and you pay O(k) memory and time to set up and traverse the count array. So the two are not competitors on the same terms. Comparison sorts are fully general — they work on anything with a total order and a comparator. Counting and radix sort are specialised — they need bounded integer keys, and in exchange for that restriction they escape the comparison model\'s lower bound entirely and run in linear time. The interview-safe phrasing is: "the lower bound applies to comparison sorts; counting sort is not one, so it is not bound by it, but it only works when the keys are small bounded integers."',
        aHi: 'Ye lower bound ka ullanghan nahi karta, kyunki lower bound computation ke ek khaas model ke baare mein ek kathan hai, aur counting sort us model ke bahar operate karta hai. O(n log n) bound comparison sorts ke liye saabit hua tha, matlab algorithms jinke paas input ke baare mein seekhne ka ekmatra tarika "kya element x element y se kam hai" poochna hai, har baar ek akela bit wapas paate hue. Proof ginta hai kitne aise bits aapko sab n factorial sambhaavit orderings alag karne ke liye chahiye, aur nishkarsh nikaalta hai ki aapko worst case mein lagbhag n log n comparisons chahiye. Counting sort kabhi ek akela element-to-element comparison nahi karta. Iske bajaye ye har key ki value ko seedhe ek array index ki tarah istemal karta hai: ye key x padhta hai aur position x par count increment karta hai. Wo ek poori tarah alag primitive operation hai, aur ye prati step ek bit se kaafi zyaada jaankaari extract karta hai, kyunki size k ki ek range mein ek integer key k ka log base 2 bits le jaati hai, aur counting sort un sab ko ek saath indexing se istemal karta hai. Is power ki cost ek precondition hai jo comparison model impose nahi karta: keys ek bounded range mein integers hone chahiye, aur aap count array set up aur traverse karne ke liye O(k) memory aur time pay karte ho. Toh dono usi terms par competitors nahi hain. Comparison sorts poori tarah general hain — wo kisi bhi cheez par kaam karte hain jiska ek total order aur ek comparator hai. Counting aur radix sort specialised hain — unhe bounded integer keys chahiye, aur us restriction ke badle wo comparison model ke lower bound se poori tarah bach jaate hain aur linear time mein chalte hain. Interview-safe phrasing hai: "lower bound comparison sorts par lagta hai; counting sort ek nahi hai, isliye ye isse bound nahi hai, par ye sirf tab kaam karta hai jab keys chhote bounded integers hon."',
      },
      {
        q: 'Why does radix sort require its per-digit sort to be stable, and why does it process digits from least significant to most significant?',
        qHi: 'Radix sort ko apni prati-digit sort stable kyun chahiye, aur ye digits ko least significant se most significant kyun process karta hai?',
        a: 'Radix sort builds up a full ordering by sorting on one digit at a time. After it sorts on the least significant digit, the array is correctly ordered with respect to that digit alone. Then it sorts on the next digit. The crucial requirement is that this second sort must not disturb the ordering the first sort achieved among any elements that have the same second digit. Those elements tie on the current digit, so the sort has no opinion about their relative order and must leave them exactly as it found them, which is the definition of a stable sort. If the per-digit sort were unstable, sorting on the tens digit could reorder two numbers that share a tens digit but differ in the ones digit, throwing away the ones-digit ordering the previous pass established, and the final array would not be sorted. So stability is not a nice-to-have here; it is what makes the whole layered approach correct. As for direction: processing least significant first is what lets each later pass be a single flat stable sort. When you sort on the most significant digit last, elements are grouped by that digit, and within each group the earlier passes have already sorted by every less significant digit, so the group is internally correct and the outer grouping completes the sort. If you went most significant first instead, after the first pass you would have groups sorted by the top digit, but to finish you would need to recursively sort within each group independently, which is more bookkeeping and more code. Least-significant-digit-first radix avoids the recursion: d flat stable passes, done.',
        aHi: 'Radix sort ek baar mein ek digit par sort karke ek poora ordering banaata hai. Least significant digit par sort karne ke baad, array us digit ke saapeksh sahi ordered hai. Phir ye agle digit par sort karta hai. Mahatvapoorn requirement ye hai ki ye doosra sort us ordering ko disturb na kare jo pehle sort ne un elements ke beech haasil ki jinka wahi doosra digit hai. Wo elements current digit par tie karte hain, isliye sort ki unke relative order ke baare mein koi raay nahi aur use unhe bilkul waise chhodna chahiye jaise mila, jo ek stable sort ki paribhaasha hai. Agar prati-digit sort unstable hota, tens digit par sort karna do numbers ko reorder kar sakta hai jo ek tens digit share karte hain par ones digit mein alag hain, ones-digit ordering ko phenkte hue jo pichhle pass ne sthaapit ki, aur final array sorted nahi hota. Toh stability yahaan nice-to-have nahi hai; ye wahi hai jo poore layered approach ko sahi banaati hai. Direction ke baare mein: least significant pehle process karna wahi hai jo har baad ke pass ko ek akela flat stable sort hone deta hai. Jab aap most significant digit par aakhri mein sort karte ho, elements us digit se grouped hote hain, aur har group ke andar pehle ke passes ne pehle se har kam significant digit se sort kar liya, isliye group aandarik roop se sahi hai aur outer grouping sort poora karta hai. Agar aap iske bajaye most significant pehle jaate, pehle pass ke baad aapke paas top digit se sorted groups hote, par khatam karne ke liye aapko har group ke andar swatantra roop se recursively sort karna padta, jo zyaada bookkeeping aur zyaada code hai. Least-significant-digit-first radix recursion avoid karta hai: d flat stable passes, done.',
      },
    ],

    exercises: [
      {
        task: 'Implement countingSort(a, maxValue). Test on [4,2,2,8,3,3,1] (max 8), on an array of 100000 random values in [0, 50], and confirm the output equals a comparison-sorted copy. Time both on the large input.',
        taskHi: 'countingSort(a, maxValue) implement karo. [4,2,2,8,3,3,1] (max 8) par, [0, 50] mein 100000 random values ke ek array par test karo, aur confirm karo output ek comparison-sorted copy ke barabar hai. Bade input par dono time karo.',
        hint: 'For n = 100000 and k = 51, counting sort should be noticeably faster than .sort(). Print the ratio.',
        hintHi: 'n = 100000 aur k = 51 ke liye, counting sort .sort() se dhyaan-dene-yogya tez hona chahiye. Ratio print karo.',
      },
      {
        task: 'Implement stable countingSortStable(records, key, maxValue) with prefix sums and backward placement. Sort records {name, score} by score in [0, 100], and verify two records with the same score keep their input order.',
        taskHi: 'prefix sums aur backward placement ke saath stable countingSortStable(records, key, maxValue) implement karo. Records {name, score} ko score se [0, 100] mein sort karo, aur verify karo ki ek hi score ke do records apna input order rakhte hain.',
        hint: 'After building the prefix sums, iterate the input from last to first: out[--count[key(r)]] = r. Test with [{n:"A",s:5},{n:"B",s:3},{n:"C",s:5}] — A must stay before C.',
        hintHi: 'Prefix sums banane ke baad, input ko last se first iterate karo: out[--count[key(r)]] = r. [{n:"A",s:5},{n:"B",s:3},{n:"C",s:5}] se test karo — A ko C se pehle rehna chahiye.',
      },
      {
        task: 'Implement radixSort for non-negative integers. Test on [329,457,657,839,436,720,355] and on 100000 random values up to 1,000,000. Confirm it matches a comparison sort and trace one full digit pass by hand.',
        taskHi: 'Non-negative integers ke liye radixSort implement karo. [329,457,657,839,436,720,355] par aur 1,000,000 tak 100000 random values par test karo. Confirm karo ye ek comparison sort se mel khaata hai aur ek poora digit pass haath se trace karo.',
        hint: 'Loop exp = 1, 10, 100, ... while Math.floor(max / exp) > 0. Each pass is the stable counting sort on (x / exp) % 10. Reassign arr = out after each pass.',
        hintHi: 'exp = 1, 10, 100, ... loop karo jab tak Math.floor(max / exp) > 0. Har pass (x / exp) % 10 par stable counting sort hai. Har pass ke baad arr = out reassign karo.',
      },
    ],

    keyTakeaways: [
      'The O(n log n) lower bound only applies to COMPARISON sorts. Counting and radix sort do not compare elements, so they are not bound by it — but they need bounded integer keys.',
      'Counting sort: tally how many of each value (pass 1), then write each value out that many times in order (pass 2). O(n + k), where k is the value range size.',
      'Stable counting sort (for records): turn counts into prefix sums, then place records from the back of the input forward so equal keys keep their order.',
      'Radix sort: stable-counting-sort one digit at a time, least significant first. O(d(n + k)) — effectively O(n) for fixed-width integer keys.',
      'Radix sort REQUIRES a stable per-digit sort and LSD-first order — otherwise a later digit-pass scrambles the ordering from earlier passes.',
      'Use counting/radix sort only when k (or digits * radix) is O(n) or smaller. For k >> n, a comparison sort is better.',
    ],
    keyTakeawaysHi: [
      'O(n log n) lower bound sirf COMPARISON sorts par lagta hai. Counting aur radix sort elements compare nahi karte, isliye wo isse bound nahi hain — par unhe bounded integer keys chahiye.',
      'Counting sort: gino har value ke kitne (pass 1), phir har value ko utni baar order mein likho (pass 2). O(n + k), jahaan k value range size hai.',
      'Stable counting sort (records ke liye): counts ko prefix sums mein badlo, phir records ko input ke peechhe se aage rakho taaki barabar keys apna order rakhein.',
      'Radix sort: ek baar mein ek digit stable-counting-sort karo, least significant pehle. O(d(n + k)) — fixed-width integer keys ke liye asal mein O(n).',
      'Radix sort ko ek stable prati-digit sort aur LSD-first order CHAHIYE — warna ek baad ka digit-pass pehle ke passes se ordering scramble karta hai.',
      'Counting/radix sort sirf tab istemal karo jab k (ya digits * radix) O(n) ya chhota hai. k >> n ke liye, ek comparison sort behtar hai.',
    ],
  },
];
