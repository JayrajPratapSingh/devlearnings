/**
 * DSA Complete Course — Module 10: Sorting & Searching, lesson 2.
 *
 * Quicksort: divide-and-conquer by partitioning around a pivot, and the pivot-
 * choice problem. Builds on this module's lesson 1 (merge sort, divide and
 * conquer) and this course's Module 9 (Dijkstra's "avoid the bad case by not
 * being predictable"). Broken example: quicksort that always picks the first
 * (or last) element as the pivot — on an already-sorted or reverse-sorted array
 * every partition is maximally lopsided (one side empty), the recursion depth
 * becomes n, and the whole sort degrades to O(n^2), precisely on the inputs you
 * would most hope are fast. Fixed by choosing the pivot randomly (or as the
 * median of three sampled elements): the expected running time becomes O(n log
 * n), and an adversary can no longer feed a worst-case input because they cannot
 * predict the pivots. The lesson also covers in-place partitioning (Lomuto) and
 * why quicksort is usually the fastest sort in practice despite the worst case.
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

export const DSA_MODULE_10_PART2: CourseLesson[] = [
  {
    slug: 'quicksort-partition-and-pivots',
    title: 'Quicksort: Partitioning and the Pivot Problem',
    titleHi: 'Quicksort: Partitioning Aur Pivot Ki Samasya',
    description: 'A textbook quicksort that always uses the first element as the pivot. It is fast on random data, but hand it an array that is already sorted — or exactly reverse-sorted — and every partition puts n minus 1 elements on one side and zero on the other, the recursion goes n levels deep, and it runs in O(n squared): worst on the inputs you would most expect to be easy.',
    descriptionHi: 'Ek textbook quicksort jo hamesha pehle element ko pivot ki tarah istemal karta hai. Ye random data par tez hai, par ise ek array do jo pehle se sorted hai — ya bilkul reverse-sorted — aur har partition n minus 1 elements ek side aur zero doosri par daalta hai, recursion n levels gehri jaati hai, aur ye O(n varg) mein chalti hai: un inputs par sabse kharab jinhe aap sabse zyaada aasaan ummeed karoge.',
    difficulty: 'HARD',
    duration: 26,
    order: 2,

    analogy: {
      en: '**Splitting a class into "shorter than me" and "taller than me" to line them up by height.** You pick one student as the reference, and everyone else moves to one side of them or the other. If your reference student happens to be near the median height, the two groups are roughly equal, you repeat inside each group, and after about log n rounds everyone is placed. But suppose you always pick whoever is standing at the front of the line as your reference. If the line happened to already be in height order, the front student is the shortest, so everyone goes to the "taller" side and nobody goes to the "shorter" side — you have split n students into a group of 0 and a group of n minus 1. Repeat, and you peel off one student per round: n rounds instead of log n. The catch is not that picking the front student is inherently bad; it is that picking it *predictably* lets the worst case happen exactly when the line is already ordered. Pick the reference student at random each time and no arrangement of the line is reliably bad, because nobody can arrange the line to defeat a choice they cannot predict.',
      hi: '**Ek class ko "mujhse chhota" aur "mujhse lamba" mein baantna unhe height se line mein lagaane ke liye.** Aap ek student ko reference chunte ho, aur baaki har koi unke ek side ya doosri par jaata hai. Agar aapka reference student samyog se median height ke paas hai, do groups lagbhag barabar hain, aap har group ke andar dohraate ho, aur lagbhag log n rounds ke baad har koi rakha jaata hai. Par maano aap hamesha jo line ke saamne khada hai use apna reference chunte ho. Agar line samyog se pehle se height order mein thi, saamne wala student sabse chhota hai, isliye har koi "lamba" side par jaata hai aur koi "chhota" side par nahi — aapne n students ko 0 ke group aur n minus 1 ke group mein split kiya. Dohraao, aur aap prati round ek student chheelte ho: log n ke bajaye n rounds. Catch ye nahi hai ki saamne wala student chunna aandarik roop se kharab hai; ye hai ki ise *predictably* chunna worst case ko bilkul tab hone deta hai jab line pehle se ordered hai. Reference student ko har baar random chuno aur line ka koi arrangement bharose se kharab nahi hai, kyunki koi line ko ek aise choice ko haraane ke liye arrange nahi kar sakta jise wo predict nahi kar sakte.',
    },

    simple: `**Start broken.** Quicksort with a fixed first-element pivot:

\`\`\`js
function quicksortBroken(a) {
  if (a.length <= 1) return a;
  const pivot = a[0];                    // ALWAYS the first element
  const less = [], greaterOrEqual = [];
  for (let i = 1; i < a.length; i++) {
    (a[i] < pivot ? less : greaterOrEqual).push(a[i]);
  }
  return [...quicksortBroken(less), pivot, ...quicksortBroken(greaterOrEqual)];
}
\`\`\`

On random input this is fine — the pivot lands somewhere in the middle, both sides are roughly \`n/2\`, and the recursion is \`log n\` deep. But on \`[1, 2, 3, ..., n]\` the pivot is always the current minimum, \`less\` is always empty, \`greaterOrEqual\` always has everything else, and the recursion is \`n\` levels deep doing \`O(n)\` work each: \`O(n^2)\`. The same happens on reverse-sorted input, and on an array of all-equal elements. These are common real inputs, not contrived ones.

**The fix: pick the pivot randomly (or as median-of-three)**

\`\`\`js
function quicksort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quicksort(a, lo, p - 1);
  quicksort(a, p + 1, hi);
  return a;
}

function partition(a, lo, hi) {
  // random pivot, swapped to the end so the scan logic is simple
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi], a[r]];
  const pivot = a[hi];

  let i = lo;                            // boundary: a[lo..i-1] are all < pivot
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
  }
  [a[i], a[hi]] = [a[hi], a[i]];         // put the pivot in its final place
  return i;                              // pivot index — it is now sorted forever
}
\`\`\`

\`\`\`ts
function quicksort(a: number[], lo = 0, hi = a.length - 1): number[] {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quicksort(a, lo, p - 1);
  quicksort(a, p + 1, hi);
  return a;
}

function partition(a: number[], lo: number, hi: number): number {
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi]!, a[r]!];
  const pivot = a[hi]!;
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
  }
  [a[i], a[hi]] = [a[hi]!, a[i]!];
  return i;
}
\`\`\`

A random pivot lands, on average, near the middle, so both sides are usually a constant fraction of the whole and the recursion is \`O(log n)\` deep with \`O(n)\` work per level — \`O(n log n)\` expected. Crucially, no fixed input triggers the worst case any more, because the pivots are unpredictable — this is the same "defeat the adversary by not being predictable" idea this course's Module 9 noted for avoiding Dijkstra-style bad cases. This \`partition\` is also **in-place**: it rearranges \`a\` using swaps and O(1) extra space, unlike merge sort's O(n) auxiliary arrays.`,

    simpleHi: `**Toote hue se shuru.** Ek fixed first-element pivot ke saath quicksort:

\`\`\`js
function quicksortBroken(a) {
  if (a.length <= 1) return a;
  const pivot = a[0];                    // HAMESHA pehla element
  const less = [], greaterOrEqual = [];
  for (let i = 1; i < a.length; i++) {
    (a[i] < pivot ? less : greaterOrEqual).push(a[i]);
  }
  return [...quicksortBroken(less), pivot, ...quicksortBroken(greaterOrEqual)];
}
\`\`\`

Random input par ye theek hai — pivot beech mein kahin utarta hai, dono sides lagbhag \`n/2\` hain, aur recursion \`log n\` gehri hai. Par \`[1, 2, 3, ..., n]\` par pivot hamesha current minimum hai, \`less\` hamesha khaali hai, \`greaterOrEqual\` mein hamesha baaki sab hai, aur recursion \`n\` levels gehri hai har ek \`O(n)\` kaam karti hui: \`O(n^2)\`. Wahi reverse-sorted input par hota hai, aur all-equal elements ke ek array par. Ye aam asli inputs hain, banaaye hue nahi.

**Fix: pivot ko random chuno (ya median-of-three ki tarah)**

\`\`\`js
function quicksort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quicksort(a, lo, p - 1);
  quicksort(a, p + 1, hi);
  return a;
}

function partition(a, lo, hi) {
  // random pivot, end par swap kiya taaki scan logic saral ho
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi], a[r]];
  const pivot = a[hi];

  let i = lo;                            // boundary: a[lo..i-1] sab < pivot hain
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
  }
  [a[i], a[hi]] = [a[hi], a[i]];         // pivot ko iski final jagah par rakho
  return i;                              // pivot index — ye ab hamesha ke liye sorted hai
}
\`\`\`

\`\`\`ts
function quicksort(a: number[], lo = 0, hi = a.length - 1): number[] {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quicksort(a, lo, p - 1);
  quicksort(a, p + 1, hi);
  return a;
}

function partition(a: number[], lo: number, hi: number): number {
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi]!, a[r]!];
  const pivot = a[hi]!;
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
  }
  [a[i], a[hi]] = [a[hi]!, a[i]!];
  return i;
}
\`\`\`

Ek random pivot, average mein, beech ke paas utarta hai, isliye dono sides aksar poore ka ek constant fraction hain aur recursion \`O(log n)\` gehri hai prati level \`O(n)\` kaam ke saath — \`O(n log n)\` expected. Mahatvapoorn baat, koi fixed input ab worst case trigger nahi karta, kyunki pivots unpredictable hain — ye wahi "predictable na hokar adversary ko haraao" idea hai jo is course ke Module 9 ne Dijkstra-style bad cases avoid karne ke liye note kiya. Ye \`partition\` **in-place** bhi hai: ye \`a\` ko swaps aur O(1) extra space se rearrange karta hai, merge sort ke O(n) auxiliary arrays ke ulat.`,

    content: `## The Lomuto partition, step by step

\`\`\`
a = [7, 2, 9, 4, 3]   pivot chosen and moved to the end -> pivot = 3, a = [7, 2, 9, 4, 3]
                       i marks the boundary: everything left of i is < 3

j=0: a[0]=7, not < 3. skip.                     i=0  a=[7,2,9,4,3]
j=1: a[1]=2, < 3. swap a[0],a[1]; i=1.          i=1  a=[2,7,9,4,3]
j=2: a[2]=9, not < 3. skip.                     i=1  a=[2,7,9,4,3]
j=3: a[3]=4, not < 3. skip.                     i=1  a=[2,7,9,4,3]
end: swap a[i]=a[1] with pivot a[4].            i=1  a=[2,3,9,4,7]

return 1. a[1]=3 is now in its final sorted position. Recurse on a[0..0] and a[2..4].
\`\`\`

The invariant is that \`a[lo..i-1]\` holds everything seen so far that is less than the pivot, \`a[i..j-1]\` holds everything seen so far that is greater or equal, and \`a[j..hi-1]\` is unexamined. Each step either extends the "greater or equal" region (skip) or swaps a small element into the "less" region and grows it. After the pivot is dropped in at index \`i\`, that element is permanently placed — every quicksort recursion sorts at least one more element for good.

## Why the worst case is O(n squared) and the average is O(n log n)

\`\`\`
Worst case: every partition is maximally unbalanced (0 and n-1).
  T(n) = T(n-1) + O(n)  =>  n + (n-1) + (n-2) + ... = O(n^2)
  Recursion depth is n, so also O(n) stack space (risk of overflow).

Average / expected (random pivot): each partition splits into some
  fraction : (1 - fraction). Even a lopsided-but-constant 1:9 split gives
  a recursion depth of log base 10/9 of n, still O(log n), with O(n) work
  per level  =>  O(n log n).
\`\`\`

The key insight is that quicksort does not need a perfectly balanced split — it only needs the split to be a *constant fraction* away from the ends, on average, which a random pivot guarantees. This course's Module 1 lesson on recursion cost shows why any constant-fraction split still gives log-depth recursion.

## Hoare's partition, and the all-equal-elements trap

\`\`\`js
// Lomuto (above) does O(n) swaps even when all elements are equal, and on an
// all-equal array it splits 0 : n-1 every time -> O(n^2). Two fixes:

// 1. Hoare partition: two pointers moving inward, fewer swaps, handles duplicates better.
// 2. Three-way partition ("Dutch national flag"): split into < pivot, == pivot, > pivot,
//    so runs of equal keys are removed from the recursion in one step -> O(n) on all-equal input.
\`\`\`

Production quicksorts use a three-way partition (or a variant) precisely so that an array with many repeated keys — extremely common in real data — does not hit the quadratic case. If your interview problem has lots of duplicates, mention three-way partitioning.

## Introsort: quicksort with a heapsort safety net

\`\`\`
Real library sorts (C++ std::sort) run quicksort but track the recursion depth.
If the depth exceeds ~2 log n (a sign the pivots are going badly), they switch
that subarray to heapsort, which is guaranteed O(n log n).

Result: quicksort's speed on the overwhelming majority of inputs, heapsort's
worst-case guarantee as a fallback, and insertion sort for the tiny leaf
subarrays where its low overhead wins.
\`\`\`

This hybrid is why "quicksort has an O(n squared) worst case" is true but rarely matters in a well-built standard library — the library has already handled it. This course's Module 8 covered heapsort as exactly this kind of guaranteed fallback.`,

    contentHi: `## Lomuto partition, step by step

\`\`\`
a = [7, 2, 9, 4, 3]   pivot chuna aur end par move kiya -> pivot = 3, a = [7, 2, 9, 4, 3]
                       i boundary mark karta hai: i ke left mein sab kuch < 3

j=0: a[0]=7, < 3 nahi. skip.                    i=0  a=[7,2,9,4,3]
j=1: a[1]=2, < 3. swap a[0],a[1]; i=1.          i=1  a=[2,7,9,4,3]
j=2: a[2]=9, < 3 nahi. skip.                    i=1  a=[2,7,9,4,3]
j=3: a[3]=4, < 3 nahi. skip.                    i=1  a=[2,7,9,4,3]
end: swap a[i]=a[1] with pivot a[4].            i=1  a=[2,3,9,4,7]

return 1. a[1]=3 ab iski final sorted position mein hai. a[0..0] aur a[2..4] par recurse.
\`\`\`

Invariant ye hai ki \`a[lo..i-1]\` ab tak dekhi gayi har cheez rakhta hai jo pivot se kam hai, \`a[i..j-1]\` ab tak dekhi gayi har cheez rakhta hai jo greater ya equal hai, aur \`a[j..hi-1]\` unexamined hai. Har step ya toh "greater or equal" region ko extend karta hai (skip) ya ek chhote element ko "less" region mein swap karta hai aur ise badhaata hai. Pivot ko index \`i\` par daalne ke baad, wo element hamesha ke liye rakha gaya — har quicksort recursion kam se kam ek aur element ko hamesha ke liye sort karti hai.

## Worst case O(n varg) aur average O(n log n) kyun hai

\`\`\`
Worst case: har partition maximally unbalanced (0 aur n-1).
  T(n) = T(n-1) + O(n)  =>  n + (n-1) + (n-2) + ... = O(n^2)
  Recursion depth n hai, isliye O(n) stack space bhi (overflow ka risk).

Average / expected (random pivot): har partition kisi fraction : (1 - fraction)
  mein split hota hai. Ek lopsided-par-constant 1:9 split bhi n ka log base 10/9
  recursion depth deta hai, abhi bhi O(log n), prati level O(n) kaam ke saath
  =>  O(n log n).
\`\`\`

Kunji insight ye hai ki quicksort ko ek perfectly balanced split nahi chahiye — use sirf split ko ends se ek *constant fraction* door hona chahiye, average mein, jise ek random pivot guarantee karta hai. Is course ke Module 1 ka recursion cost lesson dikhaata hai kyun koi constant-fraction split abhi bhi log-depth recursion deta hai.

## Hoare ka partition, aur all-equal-elements jaal

\`\`\`js
// Lomuto (upar) O(n) swaps karta hai chahe sab elements barabar hon, aur ek
// all-equal array par har baar 0 : n-1 split karta hai -> O(n^2). Do fixes:

// 1. Hoare partition: do pointers andar ki taraf badhte hue, kam swaps, duplicates behtar handle.
// 2. Three-way partition ("Dutch national flag"): < pivot, == pivot, > pivot mein split,
//    taaki barabar keys ke runs ek step mein recursion se hataaye jaayein -> all-equal input par O(n).
\`\`\`

Production quicksorts ek three-way partition (ya ek variant) istemal karte hain bilkul isliye taaki bahut repeated keys waala ek array — asli data mein bahut aam — quadratic case hit na kare. Agar aapke interview problem mein bahut duplicates hain, three-way partitioning ka zikr karo.

## Introsort: heapsort safety net ke saath quicksort

\`\`\`
Asli library sorts (C++ std::sort) quicksort chalate hain par recursion depth track karte hain.
Agar depth ~2 log n se zyaada ho jaati hai (ek nishaan ki pivots kharab jaa rahe hain), wo
us subarray ko heapsort par switch karte hain, jo guaranteed O(n log n) hai.

Nateeja: inputs ke bhaari bahumat par quicksort ki speed, heapsort ki worst-case
guarantee ek fallback ki tarah, aur tiny leaf subarrays ke liye insertion sort jahaan
iska low overhead jeetta hai.
\`\`\`

Ye hybrid wajah hai ki "quicksort ka ek O(n varg) worst case hai" sach hai par ek achhe-bane standard library mein shaayad hi maayne rakhta hai — library ne ise pehle se handle kar liya. Is course ke Module 8 ne heapsort ko bilkul is tarah ke guaranteed fallback ki tarah cover kiya.`,

    examples: [
      {
        title: 'Broken: fixed first-element pivot is O(n squared) on sorted input',
        titleHi: 'Toota: fixed first-element pivot sorted input par O(n varg) hai',
        code: `const pivot = a[0];   // always the first element
// on [1,2,3,...,n] the pivot is always the minimum -> one side always empty`,
        codeJs: `function quicksortBroken(a) {
  if (a.length <= 1) return a;
  const pivot = a[0];
  const less = [], ge = [];
  for (let i = 1; i < a.length; i++) (a[i] < pivot ? less : ge).push(a[i]);
  return [...quicksortBroken(less), pivot, ...quicksortBroken(ge)];
}
// quicksortBroken([1,2,3,4,5,6,7,8]) — correct output, but n levels of recursion`,
        codeTs: `function quicksortBroken(a: number[]): number[] {
  if (a.length <= 1) return a;
  const pivot = a[0]!;
  const less: number[] = [], ge: number[] = [];
  for (let i = 1; i < a.length; i++) (a[i]! < pivot ? less : ge).push(a[i]!);
  return [...quicksortBroken(less), pivot, ...quicksortBroken(ge)];
}`,
        output: `[1, 2, 3, 4, 5, 6, 7, 8]`,
        explain: 'On sorted or reverse-sorted input the first element is always an extreme, so one partition is empty and the other has everything — recursion depth n, total work O(n squared).',
        explainHi: 'Sorted ya reverse-sorted input par pehla element hamesha ek extreme hai, isliye ek partition khaali hai aur doosre mein sab kuch — recursion depth n, kul kaam O(n varg).',
      },
      {
        title: 'Fixed: random pivot, in-place Lomuto partition',
        titleHi: 'Theek: random pivot, in-place Lomuto partition',
        code: `const r = lo + Math.floor(Math.random() * (hi - lo + 1));
[a[r], a[hi]] = [a[hi], a[r]];   // random pivot to the end, then partition`,
        codeJs: `function quicksort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const p = partition(a, lo, hi);
  quicksort(a, lo, p - 1);
  quicksort(a, p + 1, hi);
  return a;
}
function partition(a, lo, hi) {
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi], a[r]];
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}
console.log(quicksort([7, 2, 9, 4, 3, 8, 1])); // [1, 2, 3, 4, 7, 8, 9]`,
        codeTs: `function partition(a: number[], lo: number, hi: number): number {
  const r = lo + Math.floor(Math.random() * (hi - lo + 1));
  [a[r], a[hi]] = [a[hi]!, a[r]!];
  const pivot = a[hi]!;
  let i = lo;
  for (let j = lo; j < hi; j++) if (a[j]! < pivot) { [a[i], a[j]] = [a[j]!, a[i]!]; i++; }
  [a[i], a[hi]] = [a[hi]!, a[i]!];
  return i;
}`,
        outputJs: `[1, 2, 3, 4, 7, 8, 9]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A random pivot averages out to a near-middle split, giving O(log n) depth and O(n log n) expected time, and no fixed input can force the worst case since pivots are unpredictable.',
        explainHi: 'Ek random pivot average mein ek near-middle split deta hai, O(log n) depth aur O(n log n) expected time deta hai, aur koi fixed input worst case majboor nahi kar sakta kyunki pivots unpredictable hain.',
      },
      {
        title: 'Three-way partition survives all-equal input',
        titleHi: 'Three-way partition all-equal input se bachta hai',
        code: `// split into  [ < pivot | == pivot | > pivot ]  and only recurse on the outer two`,
        codeJs: `function quicksort3(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const pivot = a[lo + ((hi - lo) >> 1)];
  let lt = lo, i = lo, gt = hi;
  while (i <= gt) {
    if (a[i] < pivot) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
    else if (a[i] > pivot) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
    else i++;
  }
  quicksort3(a, lo, lt - 1);
  quicksort3(a, gt + 1, hi);
  return a;
}
console.log(quicksort3([5, 5, 5, 5, 5])); // [5,5,5,5,5] in O(n), not O(n^2)`,
        codeTs: `function quicksort3(a: number[], lo = 0, hi = a.length - 1): number[] {
  if (lo >= hi) return a;
  const pivot = a[lo + ((hi - lo) >> 1)]!;
  let lt = lo, i = lo, gt = hi;
  while (i <= gt) {
    if (a[i]! < pivot) { [a[lt], a[i]] = [a[i]!, a[lt]!]; lt++; i++; }
    else if (a[i]! > pivot) { [a[i], a[gt]] = [a[gt]!, a[i]!]; gt--; }
    else i++;
  }
  quicksort3(a, lo, lt - 1);
  quicksort3(a, gt + 1, hi);
  return a;
}`,
        outputJs: `[5, 5, 5, 5, 5]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'All elements equal to the pivot are grouped in the middle and never recursed on, so an array of identical keys is handled in a single linear pass instead of degrading to quadratic.',
        explainHi: 'Pivot ke barabar sab elements beech mein group ho jaate hain aur kabhi recurse nahi hote, isliye identical keys ka ek array quadratic mein degrade hone ke bajaye ek akele linear pass mein handle hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// fixed pivot (first or last element) with no randomisation
const pivot = a[hi];   // predictable -> O(n^2) on sorted / reverse-sorted / adversarial input`,
        right: `const r = lo + Math.floor(Math.random() * (hi - lo + 1));
[a[r], a[hi]] = [a[hi], a[r]];   // randomise, THEN use a[hi] as pivot`,
        why: 'A predictable pivot lets sorted, reverse-sorted, or maliciously crafted input force every partition to be maximally unbalanced. Randomising the pivot makes the worst case a matter of unlucky chance, not input shape.',
        whyHi: 'Ek predictable pivot sorted, reverse-sorted, ya maliciously banaaye gaye input ko har partition ko maximally unbalanced majboor karne deta hai. Pivot randomise karna worst case ko unlucky chance ki baat banaata hai, input shape ki nahi.',
      },
      {
        wrong: `// recursion condition off by one, re-including the pivot
function quicksort(a, lo, hi) {
  const p = partition(a, lo, hi);
  quicksort(a, lo, p);       // includes the already-placed pivot -> infinite recursion
  quicksort(a, p, hi);
}`,
        right: `quicksort(a, lo, p - 1);   // strictly below the pivot
quicksort(a, p + 1, hi);   // strictly above the pivot`,
        why: 'partition returns the pivot\'s final index, and that element is permanently sorted. Recursing on ranges that still include it never shrinks the problem and loops forever.',
        whyHi: 'partition pivot ka final index return karta hai, aur wo element hamesha ke liye sorted hai. Un ranges par recurse karna jo abhi bhi ise include karte hain problem ko kabhi chhota nahi karta aur hamesha loop karta hai.',
      },
      {
        wrong: `// claiming quicksort is stable and using it to sort by a secondary key`,
        right: `// quicksort is NOT stable — partitioning swaps distant elements. Use merge
// sort (lesson 1) when equal elements must keep their relative order.`,
        why: 'Partitioning moves elements across long distances, so two equal keys can have their order flipped. If stability matters, quicksort is the wrong choice regardless of its speed.',
        whyHi: 'Partitioning elements ko lambi dooriyon par move karta hai, isliye do barabar keys ka order palat sakta hai. Agar stability maayne rakhti hai, quicksort galat chunaav hai chahe iski speed kuch bhi ho.',
      },
    ],

    realWorld: [
      {
        en: '**C++ `std::sort` is introsort** — quicksort with a random-ish pivot, falling back to heapsort if recursion goes too deep and to insertion sort for tiny subarrays. It is the default because it is fastest in practice on typical data.',
        hi: '**C++ `std::sort` introsort hai** — ek random-ish pivot ke saath quicksort, recursion bahut gehri jaane par heapsort par aur tiny subarrays ke liye insertion sort par girta hua. Ye default hai kyunki ye typical data par practice mein sabse tez hai.',
      },
      {
        en: '**Quickselect** — quicksort\'s partition step used to find the kth smallest element without fully sorting — runs in O(n) average and is the fastest way to answer "kth largest" on a mutable array (this course\'s Module 8 noted it as the alternative to a heap).',
        hi: '**Quickselect** — quicksort ka partition step kth sabse chhota element bina poori tarah sort kiye dhoondhne ke liye istemal — O(n) average mein chalta hai aur ek mutable array par "kth largest" ka jawaab dene ka sabse tez tarika hai (is course ke Module 8 ne ise ek heap ke vikalp ki tarah note kiya).',
      },
      {
        en: '**Databases and query engines** use partition-based sorting for large intermediate results, and specifically use three-way partitioning because join keys and group-by keys have heavy duplication.',
        hi: '**Databases aur query engines** bade intermediate results ke liye partition-based sorting istemal karte hain, aur khaas taur par three-way partitioning istemal karte hain kyunki join keys aur group-by keys mein bhaari duplication hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Quicksort has an O(n squared) worst case, yet it is the most common default sort. Explain the apparent contradiction.',
        qHi: 'Quicksort ka ek O(n varg) worst case hai, phir bhi ye sabse aam default sort hai. Ispasht virodhabhaas samjhaao.',
        a: 'The worst case is real but it is both rare and defensible. Quicksort\'s cost is dominated by how balanced its partitions are. A perfectly unbalanced partition — everything on one side, nothing on the other — happens when the pivot is an extreme value, and if you always pick the pivot from a fixed position, then a sorted or reverse-sorted input triggers that on every partition and the algorithm degrades to quadratic. The fix is to pick the pivot randomly, or as the median of a few sampled elements. Once the pivot is random, no specific input shape is bad, because the input cannot be arranged to defeat a choice the algorithm makes unpredictably at runtime. The worst case still exists in theory — you could get unlucky and pick a bad pivot at every level — but the probability of that decays exponentially, and for any array large enough to care about, it is astronomically unlikely. On top of that, real library sorts are introsort: they run randomised quicksort but monitor recursion depth, and if it grows past about two log n, which signals the pivots are going badly, they switch that subarray to heapsort, which is guaranteed O(n log n). So the library gets quicksort\'s constant-factor speed advantage on essentially all inputs and a hard worst-case bound as a safety net. And quicksort is fast in practice for reasons Big-O hides: its inner loop is a tight sequential scan with excellent cache behaviour and very few instructions per element, which beats merge sort\'s extra memory traffic and heapsort\'s cache-hostile index jumps.',
        aHi: 'Worst case asli hai par ye durlabh aur defensible dono hai. Quicksort ki cost is baat se haavi hoti hai ki iske partitions kitne balanced hain. Ek perfectly unbalanced partition — sab kuch ek side, kuch nahi doosre par — tab hota hai jab pivot ek extreme value hai, aur agar aap hamesha pivot ko ek fixed position se chunte ho, toh ek sorted ya reverse-sorted input ise har partition par trigger karta hai aur algorithm quadratic mein degrade ho jaata hai. Fix pivot ko random chunna hai, ya kuch sampled elements ke median ki tarah. Ek baar pivot random hai, koi khaas input shape kharab nahi hai, kyunki input ko ek aise choice ko haraane ke liye arrange nahi kiya jaa sakta jo algorithm runtime par unpredictably karta hai. Worst case abhi bhi theory mein maujood hai — aap unlucky ho sakte ho aur har level par ek kharab pivot chun sakte ho — par uski probability exponentially decay hoti hai, aur kisi bhi array ke liye jo parwaah karne ke liye kaafi bada hai, ye astronomically unlikely hai. Iske upar, asli library sorts introsort hain: wo randomised quicksort chalate hain par recursion depth monitor karte hain, aur agar ye lagbhag do log n se aage badhta hai, jo signal karta hai ki pivots kharab jaa rahe hain, wo us subarray ko heapsort par switch karte hain, jo guaranteed O(n log n) hai. Toh library ko essentially sab inputs par quicksort ka constant-factor speed advantage aur ek hard worst-case bound ek safety net ki tarah milta hai. Aur quicksort practice mein tez hai un wajahon se jo Big-O chhupata hai: iska inner loop ek tight sequential scan hai excellent cache behaviour aur prati element bahut kam instructions ke saath, jo merge sort ke extra memory traffic aur heapsort ke cache-hostile index jumps ko haraata hai.',
      },
      {
        q: 'Why does an array of all-equal elements break a naive quicksort, and how does three-way partitioning fix it?',
        qHi: 'All-equal elements ka ek array ek naive quicksort ko kyun todta hai, aur three-way partitioning ise kaise theek karta hai?',
        a: 'A two-way partition, like Lomuto, divides the array into "less than the pivot" and "greater than or equal to the pivot". If every element equals the pivot, the "less than" side gets nothing and the "greater than or equal" side gets all n minus 1 non-pivot elements. That is the maximally unbalanced split, and it repeats at every level, so an array of identical keys takes n levels of recursion doing O(n) work each — quadratic — even though the array is, in a sense, already sorted. This is not an exotic case: real datasets are full of repeated keys, like sorting millions of records by a status field with five possible values. Three-way partitioning, also called the Dutch national flag partition, splits the array into three regions instead of two: elements strictly less than the pivot, elements equal to the pivot, and elements strictly greater. The equal region can be any size, and crucially the algorithm never recurses into it — those elements are already in their final sorted positions relative to each other, since they are all equal. It only recurses on the strictly-less and strictly-greater regions. So on an all-equal array, the first partition puts every element into the equal region in one linear pass and the recursion terminates immediately: O(n) total. On an array with a handful of distinct values each repeated many times, every level of recursion strips out one entire value\'s worth of elements, so the depth is bounded by the number of distinct values rather than by n. This is why production quicksorts always use a three-way or similar partition rather than the textbook two-way one.',
        aHi: 'Ek two-way partition, Lomuto ki tarah, array ko "pivot se kam" aur "pivot se greater ya equal" mein baantta hai. Agar har element pivot ke barabar hai, "less than" side ko kuch nahi milta aur "greater than or equal" side ko sab n minus 1 non-pivot elements milte hain. Wo maximally unbalanced split hai, aur ye har level par dohraata hai, isliye identical keys ka ek array n levels ki recursion leta hai har ek O(n) kaam karti hui — quadratic — chahe array, ek arth mein, pehle se sorted hai. Ye ek exotic case nahi hai: asli datasets repeated keys se bhare hain, jaise millions of records ko ek status field se sort karna jismein paanch sambhaavit values hain. Three-way partitioning, jise Dutch national flag partition bhi kehte hain, array ko do ke bajaye teen regions mein split karta hai: pivot se sakhti se kam elements, pivot ke barabar elements, aur sakhti se greater. Equal region kisi bhi size ka ho sakta hai, aur mahatvapoorn baat algorithm ismein kabhi recurse nahi karta — wo elements pehle se ek doosre ke saapeksh apni final sorted positions mein hain, kyunki wo sab barabar hain. Ye sirf strictly-less aur strictly-greater regions par recurse karta hai. Toh ek all-equal array par, pehla partition har element ko ek linear pass mein equal region mein daalta hai aur recursion turant terminate hoti hai: O(n) kul. Ek array par jismein mutthi bhar distinct values har ek bahut baar repeated hain, recursion ka har level ek poori value ke elements strip out karta hai, isliye depth n ke bajaye distinct values ki tadaad se bandhi hai. Yahi wajah hai ki production quicksorts hamesha ek three-way ya samaan partition istemal karte hain na ki textbook two-way waala.',
      },
    ],

    exercises: [
      {
        task: 'Implement in-place quicksort with the random-pivot Lomuto partition. Test on random arrays, an already-sorted array, and a reverse-sorted array of size 5000 — confirm all three run fast (unlike the fixed-pivot version on the last two).',
        taskHi: 'Random-pivot Lomuto partition ke saath in-place quicksort implement karo. Random arrays par, ek pehle-se-sorted array par, aur size 5000 ke ek reverse-sorted array par test karo — confirm karo teeno tez chalte hain (fixed-pivot version ke ulat aakhri do par).',
        hint: 'Add a global counter for partition calls. The fixed-pivot version on sorted input does ~5000 partitions; the random-pivot version does ~log2(5000) ~= 13 levels worth.',
        hintHi: 'partition calls ke liye ek global counter jodo. Sorted input par fixed-pivot version ~5000 partitions karta hai; random-pivot version ~log2(5000) ~= 13 levels worth karta hai.',
      },
      {
        task: 'Implement the three-way (Dutch flag) partition quicksort. Test on [5,5,5,5,5,5], on [3,1,3,1,3,1], and on a random array with only values 0, 1, 2. Confirm the all-equal case is O(n).',
        taskHi: 'Three-way (Dutch flag) partition quicksort implement karo. [5,5,5,5,5,5] par, [3,1,3,1,3,1] par, aur sirf values 0, 1, 2 waale ek random array par test karo. Confirm karo all-equal case O(n) hai.',
        hint: 'The three pointers lt, i, gt maintain: a[lo..lt-1] < pivot, a[lt..i-1] == pivot, a[gt+1..hi] > pivot, a[i..gt] unexamined. Only recurse on the < and > regions.',
        hintHi: 'Teen pointers lt, i, gt maintain karte hain: a[lo..lt-1] < pivot, a[lt..i-1] == pivot, a[gt+1..hi] > pivot, a[i..gt] unexamined. Sirf < aur > regions par recurse karo.',
      },
      {
        task: 'Implement quickselect(a, k): use the partition step to find the kth smallest element without fully sorting. After partitioning, recurse only into the side that contains index k. Test that it matches a[sorted][k].',
        taskHi: 'quickselect(a, k) implement karo: kth sabse chhota element bina poori tarah sort kiye dhoondhne ke liye partition step istemal karo. Partition ke baad, sirf us side mein recurse karo jismein index k hai. Test karo ki ye a[sorted][k] se mel khaata hai.',
        hint: 'After p = partition(a, lo, hi): if p === k return a[k]; if k < p recurse on (lo, p-1); else recurse on (p+1, hi). Average O(n) because you only follow one side.',
        hintHi: 'p = partition(a, lo, hi) ke baad: agar p === k return a[k]; agar k < p (lo, p-1) par recurse; warna (p+1, hi) par recurse. Average O(n) kyunki aap sirf ek side follow karte ho.',
      },
    ],

    keyTakeaways: [
      'Quicksort: pick a pivot, partition the array into elements < pivot and elements >= pivot, recurse on each side. The pivot ends in its final sorted position.',
      'A fixed pivot (first/last element) is O(n squared) on sorted, reverse-sorted, or adversarial input — every partition is maximally unbalanced.',
      'A random pivot (or median-of-three) gives O(n log n) expected time and makes the worst case a matter of bad luck, not input shape.',
      'Quicksort partitions in place: O(1) extra space per call, O(log n) stack on average — less memory than merge sort. But it is NOT stable.',
      'An all-equal or heavily-duplicated array breaks two-way partitioning; three-way (Dutch flag) partitioning groups equal keys in the middle and never recurses on them.',
      'Introsort = randomised quicksort + switch to heapsort when recursion goes too deep + insertion sort for tiny subarrays. This is what real standard libraries ship.',
    ],
    keyTakeawaysHi: [
      'Quicksort: ek pivot chuno, array ko elements < pivot aur elements >= pivot mein partition karo, har side par recurse karo. Pivot apni final sorted position mein khatam hota hai.',
      'Ek fixed pivot (first/last element) sorted, reverse-sorted, ya adversarial input par O(n varg) hai — har partition maximally unbalanced hai.',
      'Ek random pivot (ya median-of-three) O(n log n) expected time deta hai aur worst case ko bad luck ki baat banaata hai, input shape ki nahi.',
      'Quicksort in place partition karta hai: prati call O(1) extra space, average par O(log n) stack — merge sort se kam memory. Par ye stable NAHI hai.',
      'Ek all-equal ya bhaari-duplicated array two-way partitioning ko todta hai; three-way (Dutch flag) partitioning barabar keys ko beech mein group karta hai aur unpar kabhi recurse nahi karta.',
      'Introsort = randomised quicksort + recursion bahut gehri jaane par heapsort par switch + tiny subarrays ke liye insertion sort. Ye wahi hai jo asli standard libraries bhejti hain.',
    ],
  },
];
