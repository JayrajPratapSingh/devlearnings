/**
 * DSA Complete Course — Module 10: Sorting & Searching, lesson 1.
 *
 * Why the elementary sorts are O(n^2), why comparison sorting cannot beat
 * O(n log n), and merge sort as the clean divide-and-conquer that hits that
 * bound. Builds on this course's Module 1 (Big-O, analysing nested loops),
 * Module 6 (the recursion tree), and Module 4 (merging two sorted linked lists —
 * the merge step here is exactly that idea on arrays). Broken example: sorting a
 * large array with insertion sort (or bubble / selection) — every one of these
 * compares each element against many others, so the work is proportional to
 * n^2, and at a million elements that is a trillion operations. Fixed with merge
 * sort: split the array in half, sort each half recursively, then merge the two
 * sorted halves in one linear pass. The recursion is log n levels deep and each
 * level does O(n) merging work, so the total is a guaranteed O(n log n), and the
 * merge preserves the relative order of equal elements (it is "stable").
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

export const DSA_MODULE_10: CourseLesson[] = [
  {
    slug: 'merge-sort-divide-and-conquer',
    title: 'Merge Sort: The O(n log n) Divide and Conquer',
    titleHi: 'Merge Sort: O(n log n) Divide Aur Conquer',
    description: 'Sorting a million-element array with insertion sort. It is short, in-place, and genuinely fast on tiny or nearly-sorted inputs — but on a large shuffled array every element is compared against a large fraction of the others, so the work grows as n squared, and a million elements means on the order of a trillion comparisons.',
    descriptionHi: 'Ek million-element array ko insertion sort se sort karna. Ye chhota, in-place, aur tiny ya nearly-sorted inputs par sach mein tez hai — par ek bade shuffled array par har element doosron ke ek bade hisse ke against compare hota hai, isliye kaam n varg ki tarah badhta hai, aur ek million elements matlab lagbhag ek trillion comparisons.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**Alphabetising a huge stack of exam papers, alone versus with a team that splits the work.** Doing it alone the naive way: pick up a paper, walk it down the growing sorted pile until it is in the right spot, insert it, repeat. Early on this is quick because the sorted pile is small, but by the time the pile has half a million papers in it, placing each remaining paper means walking past a huge number of them. The total walking is enormous. The divide-and-conquer way: hand half the stack to a colleague and keep half yourself; each of you splits your half again and hands pieces to more people, until everyone is holding just one or two papers, which are trivially "sorted". Then the merging back up begins: two people each holding a small sorted pile stand together and combine them into one sorted pile by repeatedly taking whichever of their two top papers comes first alphabetically — a single pass through both piles, no walking back. Those combined piles merge with other combined piles, and so on up the chain. Each round of merging touches every paper once, and there are only about twenty rounds for a million papers (because you can only halve a million about twenty times), so the total work is a million times twenty, not a million times a million.',
      hi: '**Ek bade exam papers ke stack ko alphabetise karna, akele versus ek team ke saath jo kaam baant leti hai.** Ise akele naive tarike se karna: ek paper uthao, ise badhte sorted pile ke neeche chalao jab tak ye sahi jagah par na ho, insert karo, dohraao. Shuru mein ye jaldi hai kyunki sorted pile chhoti hai, par jab pile mein aadha million papers ho jaate hain, har baaki paper rakhna matlab unmein se ek bade number ke paas se chalna. Kul chalna bahut bada hai. Divide-and-conquer tarika: aadha stack ek colleague ko do aur aadha khud rakho; aap dono apna aadha phir split karte ho aur tukde aur logon ko dete ho, jab tak har koi sirf ek ya do papers na rakhe, jo trivially "sorted" hain. Phir merging wapas upar shuru hoti hai: do log har ek ek chhoti sorted pile pakde saath khade hote hain aur unhe ek sorted pile mein combine karte hain baar-baar jo bhi unke do top papers mein pehle alphabetically aata hai use lekar — dono piles se ek akela pass, wapas koi chalna nahi. Wo combined piles doosri combined piles ke saath merge hoti hain, aur aise hi chain ke upar. Merging ka har round har paper ko ek baar chhoota hai, aur ek million papers ke liye sirf lagbhag bees rounds hain (kyunki aap ek million ko sirf lagbhag bees baar halve kar sakte ho), isliye kul kaam ek million guna bees hai, ek million guna ek million nahi.',
    },

    simple: `**Start broken.** Insertion sort — for each element, slide it left into its sorted position:

\`\`\`js
function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const val = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > val) { a[j + 1] = a[j]; j--; }  // shift bigger elements right
    a[j + 1] = val;
  }
  return a;
}
\`\`\`

For each of \`n\` elements, the inner \`while\` may walk back over all the elements before it. On a reverse-sorted array it walks the full distance every time: \`1 + 2 + 3 + ... + (n-1)\` comparisons, which is about \`n^2 / 2\`. This course's Module 1 lesson on analysing nested loops is exactly this shape — a loop inside a loop where the inner one scales with the outer index. At \`n = 1,000,000\` that is ~500 billion operations. (Insertion sort *is* the right choice for very small arrays or nearly-sorted data, where the inner loop barely moves — but not as a general-purpose sort.)

**The fix: merge sort — split, sort each half, merge**

\`\`\`js
function mergeSort(a) {
  if (a.length <= 1) return a;                       // base case (Module 6)
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);    // <= keeps equal elements' order -> stable
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
\`\`\`

\`\`\`ts
function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
}

function merge(left: number[], right: number[]): number[] {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i]! <= right[j]!) out.push(left[i++]!);
    else out.push(right[j++]!);
  }
  while (i < left.length) out.push(left[i++]!);
  while (j < right.length) out.push(right[j++]!);
  return out;
}
\`\`\`

The \`merge\` step is the same two-pointer merge this course's Module 4 used to combine two sorted linked lists: walk a pointer along each sorted input and repeatedly take the smaller head. It is a single O(n) pass. The recursion halves the array each time, so it bottoms out after \`log2(n)\` levels, and every level's merges together touch all \`n\` elements once. \`n\` elements times \`log n\` levels is O(n log n) — and unlike insertion sort's \`n^2\`, this holds for *every* input, sorted or shuffled or reversed.`,

    simpleHi: `**Toote hue se shuru.** Insertion sort — har element ke liye, ise left mein iski sorted position mein slide karo:

\`\`\`js
function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const val = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > val) { a[j + 1] = a[j]; j--; }  // bade elements right shift karo
    a[j + 1] = val;
  }
  return a;
}
\`\`\`

\`n\` elements mein se har ek ke liye, inner \`while\` iske pehle sab elements ke paas se peechhe chal sakta hai. Ek reverse-sorted array par ye har baar poori doori chalta hai: \`1 + 2 + 3 + ... + (n-1)\` comparisons, jo lagbhag \`n^2 / 2\` hai. Is course ke Module 1 ka nested loops analyse karne wala lesson bilkul ye shape hai — ek loop ke andar ek loop jahaan inner outer index ke saath scale karta hai. \`n = 1,000,000\` par wo ~500 billion operations hai. (Insertion sort bahut chhote arrays ya nearly-sorted data ke liye SAHI chunaav HAI, jahaan inner loop mushkil se hilta hai — par ek general-purpose sort ki tarah nahi.)

**Fix: merge sort — split karo, har half sort karo, merge karo**

\`\`\`js
function mergeSort(a) {
  if (a.length <= 1) return a;                       // base case (Module 6)
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);    // <= barabar elements ka order rakhta hai -> stable
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
\`\`\`

\`\`\`ts
function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
}

function merge(left: number[], right: number[]): number[] {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i]! <= right[j]!) out.push(left[i++]!);
    else out.push(right[j++]!);
  }
  while (i < left.length) out.push(left[i++]!);
  while (j < right.length) out.push(right[j++]!);
  return out;
}
\`\`\`

\`merge\` step wahi two-pointer merge hai jise is course ke Module 4 ne do sorted linked lists combine karne ke liye istemal kiya: har sorted input par ek pointer chalao aur baar-baar chhota head lo. Ye ek akela O(n) pass hai. Recursion har baar array ko halve karta hai, isliye ye \`log2(n)\` levels ke baad bottom out hota hai, aur har level ke merges saath sab \`n\` elements ko ek baar chhoote hain. \`n\` elements guna \`log n\` levels O(n log n) hai — aur insertion sort ke \`n^2\` ke ulat, ye *har* input ke liye hold karta hai, sorted ya shuffled ya reversed.`,

    content: `## Why O(n log n) is a hard floor for comparison sorts

\`\`\`
A comparison sort only learns about the data by asking "is x < y?". Each such
question has two outcomes, so after k questions the algorithm can distinguish at
most 2^k different situations.

There are n! possible orderings of n distinct elements, and the algorithm must
be able to tell them all apart to sort correctly. So it needs:
  2^k >= n!   =>   k >= log2(n!)   =>   k >= ~n log2(n)   (Stirling's approximation)
\`\`\`

No comparison-based sort — not merge sort, not quicksort, not heapsort, not any clever future one — can beat O(n log n) in the worst case, because it simply cannot ask enough yes/no questions to identify the right permutation faster. Merge sort and heapsort *hit* this bound in the worst case; quicksort hits it on average. The only way to go faster is to stop comparing and exploit structure in the keys themselves, which this module's non-comparison-sort lesson covers.

## The recursion tree, level by level

\`\`\`
                    [n]                        level 0:  one merge of size n      -> n work
                  /     \\
             [n/2]       [n/2]                 level 1:  two merges, n/2 each     -> n work
             /  \\         /  \\
        [n/4] [n/4]   [n/4] [n/4]              level 2:  four merges, n/4 each    -> n work
          ...                                  ...
      [1][1] [1][1] ...  [1][1]                level log n: n merges of size 1   -> n work

Total: (n work per level) x (log n levels) = O(n log n)
\`\`\`

This course's Module 6 lesson on analysing recursion is the tool: the cost is not "how deep" or "how wide" alone, but depth times the work at each level. Merge sort keeps the per-level work constant at O(n) — every level re-touches all n elements exactly once during merging — and there are log n levels, giving the product.

## Stability, and why merge sort has it for free

\`\`\`js
// records sorted by age; two people are both 30
[{name:'A',age:30}, {name:'B',age:25}, {name:'C',age:30}]

// a STABLE sort keeps A before C (their original relative order):
[{name:'B',age:25}, {name:'A',age:30}, {name:'C',age:30}]
\`\`\`

In \`merge\`, when \`left[i]\` and \`right[j]\` compare equal, the \`<=\` test takes from \`left\` first. Since \`left\` holds elements that were earlier in the original array, equal elements come out in their original order. This matters when sorting by a secondary key (sort by age, having already sorted by name, and people of the same age stay in name order). Quicksort is not naturally stable; heapsort is not stable; merge sort is.

## The space cost, and the in-place trade-off

\`\`\`
merge sort as written: O(n) extra space (the 'out' arrays and the slices).
There is an in-place merge sort, but the in-place merge is intricate and slow
in practice, so the O(n)-space version is what is normally used.

Contrast:
  quicksort  - O(log n) stack space, sorts within the array         (next lesson)
  heapsort   - O(1) extra space, sorts within the array             (Module 8)
  merge sort - O(n) extra space, but the only stable one of the three
\`\`\`

When memory is tight, heapsort or in-place quicksort win. When stability matters, or when merging is natural (merging sorted files that do not fit in memory — "external sort"), merge sort is the right pick.`,

    contentHi: `## Comparison sorts ke liye O(n log n) ek hard floor kyun hai

\`\`\`
Ek comparison sort data ke baare mein sirf "kya x < y?" poochkar seekhta hai. Har
aisa sawaal ke do outcomes hain, isliye k sawaalon ke baad algorithm zyaada se
zyaada 2^k alag situations ko alag kar sakta hai.

n distinct elements ki n! sambhaavit orderings hain, aur algorithm ko sahi sort
karne ke liye unhe sab alag bata paana chahiye. Toh use chahiye:
  2^k >= n!   =>   k >= log2(n!)   =>   k >= ~n log2(n)   (Stirling's approximation)
\`\`\`

Koi comparison-based sort — na merge sort, na quicksort, na heapsort, na koi chalaak future waala — worst case mein O(n log n) ko haara nahi sakta, kyunki ye bas sahi permutation ko tez pehchaanne ke liye kaafi yes/no sawaal nahi pooch sakta. Merge sort aur heapsort is bound ko worst case mein *hit* karte hain; quicksort ise average par hit karta hai. Tez jaane ka ekmatra tarika comparing rokna aur keys mein khud structure exploit karna hai, jise is module ka non-comparison-sort lesson cover karta hai.

## Recursion tree, level by level

\`\`\`
                    [n]                        level 0:  size n ka ek merge        -> n kaam
                  /     \\
             [n/2]       [n/2]                 level 1:  do merges, n/2 har ek     -> n kaam
             /  \\         /  \\
        [n/4] [n/4]   [n/4] [n/4]              level 2:  chaar merges, n/4 har ek  -> n kaam
          ...                                  ...
      [1][1] [1][1] ...  [1][1]                level log n: size 1 ke n merges     -> n kaam

Kul: (prati level n kaam) x (log n levels) = O(n log n)
\`\`\`

Is course ke Module 6 ka recursion analyse karne wala lesson tool hai: cost sirf "kitna gehra" ya "kitna chaura" nahi, balki depth guna har level par kaam. Merge sort prati-level kaam ko O(n) par constant rakhta hai — har level merging ke dauraan sab n elements ko bilkul ek baar dobara chhoota hai — aur log n levels hain, product dete hue.

## Stability, aur merge sort ke paas ye muft mein kyun hai

\`\`\`js
// records age se sorted; do log dono 30 ke hain
[{name:'A',age:30}, {name:'B',age:25}, {name:'C',age:30}]

// ek STABLE sort A ko C se pehle rakhta hai (unka original relative order):
[{name:'B',age:25}, {name:'A',age:30}, {name:'C',age:30}]
\`\`\`

\`merge\` mein, jab \`left[i]\` aur \`right[j]\` barabar compare karte hain, \`<=\` test pehle \`left\` se leta hai. Kyunki \`left\` un elements ko rakhta hai jo original array mein pehle the, barabar elements apne original order mein bahar aate hain. Ye maayne rakhta hai jab ek secondary key se sort karte ho (age se sort karo, pehle se name se sort karke, aur ek hi age ke log name order mein rehte hain). Quicksort naturally stable nahi hai; heapsort stable nahi hai; merge sort hai.

## Space cost, aur in-place trade-off

\`\`\`
merge sort jaisa likha gaya: O(n) extra space ('out' arrays aur slices).
Ek in-place merge sort hai, par in-place merge jatil aur practice mein slow hai,
isliye O(n)-space version wahi hai jo normally istemal hota hai.

Contrast:
  quicksort  - O(log n) stack space, array ke andar sort karta hai   (agla lesson)
  heapsort   - O(1) extra space, array ke andar sort karta hai        (Module 8)
  merge sort - O(n) extra space, par teeno mein ekmatra stable
\`\`\`

Jab memory tight hai, heapsort ya in-place quicksort jeette hain. Jab stability maayne rakhti hai, ya jab merging natural hai (sorted files merge karna jo memory mein fit nahi hote — "external sort"), merge sort sahi pick hai.`,

    examples: [
      {
        title: 'Broken: insertion sort is O(n squared) on large shuffled data',
        titleHi: 'Toota: insertion sort bade shuffled data par O(n varg) hai',
        code: `while (j >= 0 && a[j] > val) { a[j + 1] = a[j]; j--; } // inner loop walks back`,
        codeJs: `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const val = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > val) { a[j + 1] = a[j]; j--; }
    a[j + 1] = val;
  }
  return a;
}
console.log(insertionSort([5, 2, 4, 6, 1, 3])); // [1,2,3,4,5,6] — correct, but O(n^2)`,
        codeTs: `function insertionSort(a: number[]): number[] {
  for (let i = 1; i < a.length; i++) {
    const val = a[i]!;
    let j = i - 1;
    while (j >= 0 && a[j]! > val) { a[j + 1] = a[j]!; j--; }
    a[j + 1] = val;
  }
  return a;
}`,
        output: `[1, 2, 3, 4, 5, 6]`,
        explain: 'For each of n elements the inner while can shift all preceding elements. On reverse-sorted input that is 1 + 2 + ... + (n-1) ~= n squared / 2 operations.',
        explainHi: 'n elements mein se har ek ke liye inner while sab pehle ke elements shift kar sakta hai. Reverse-sorted input par wo 1 + 2 + ... + (n-1) ~= n varg / 2 operations hai.',
      },
      {
        title: 'Fixed: merge sort splits, sorts, and merges in O(n log n)',
        titleHi: 'Theek: merge sort split karta hai, sort karta hai, aur O(n log n) mein merge karta hai',
        code: `const mid = a.length >> 1;
return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));`,
        codeJs: `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
}
function merge(l, r) {
  const out = []; let i = 0, j = 0;
  while (i < l.length && j < r.length) out.push(l[i] <= r[j] ? l[i++] : r[j++]);
  return out.concat(l.slice(i)).concat(r.slice(j));
}
console.log(mergeSort([5, 2, 4, 6, 1, 3])); // [1, 2, 3, 4, 5, 6]`,
        codeTs: `function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
}
function merge(l: number[], r: number[]): number[] {
  const out: number[] = []; let i = 0, j = 0;
  while (i < l.length && j < r.length) out.push(l[i]! <= r[j]! ? l[i++]! : r[j++]!);
  return out.concat(l.slice(i)).concat(r.slice(j));
}`,
        outputJs: `[1, 2, 3, 4, 5, 6]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'log n levels of recursion, each doing O(n) merging work across all its subproblems. The product is O(n log n) for every input, not just favourable ones.',
        explainHi: 'log n levels ki recursion, har ek apne sab subproblems par O(n) merging kaam karta hai. Product har input ke liye O(n log n) hai, sirf favourable ke liye nahi.',
      },
      {
        title: 'Stability: equal elements keep their original order',
        titleHi: 'Stability: barabar elements apna original order rakhte hain',
        code: `if (left[i] <= right[j]) out.push(left[i++]); // <= (not <) takes from LEFT on a tie`,
        codeJs: `function mergeStable(l, r) {
  const out = []; let i = 0, j = 0;
  while (i < l.length && j < r.length) {
    if (l[i].age <= r[j].age) out.push(l[i++]); // tie -> left first
    else out.push(r[j++]);
  }
  return out.concat(l.slice(i)).concat(r.slice(j));
}
// left came from earlier in the array, so equal ages stay in original order`,
        codeTs: `type Rec = { name: string; age: number };
function mergeStable(l: Rec[], r: Rec[]): Rec[] {
  const out: Rec[] = []; let i = 0, j = 0;
  while (i < l.length && j < r.length) {
    if (l[i]!.age <= r[j]!.age) out.push(l[i++]!);
    else out.push(r[j++]!);
  }
  return out.concat(l.slice(i)).concat(r.slice(j));
}`,
        outputJs: `// two records with age 30 come out in the same order they went in`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Because the left half holds elements that were earlier in the input, preferring left on a tie means equal keys never get reordered — that is exactly what "stable" means.',
        explainHi: 'Kyunki left half un elements ko rakhta hai jo input mein pehle the, tie par left prefer karna matlab barabar keys kabhi reorder nahi hote — wahi "stable" ka matlab hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// merge sort with no base case
function mergeSort(a) {
  const mid = a.length >> 1;
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
  // a.slice(0, 0) is [], mergeSort([]) recurses on [] forever -> stack overflow
}`,
        right: `function mergeSort(a) {
  if (a.length <= 1) return a;   // base case first (Module 6)
  ...
}`,
        why: 'Without the length <= 1 check, a one-element array splits into an empty half and a one-element half, and mergeSort recurses on the one-element half unchanged forever.',
        whyHi: 'length <= 1 check ke bina, ek one-element array ek empty half aur ek one-element half mein split hota hai, aur mergeSort one-element half par na-badla hamesha recurse karta hai.',
      },
      {
        wrong: `// forgetting to drain the leftover tail after one side is exhausted
while (i < left.length && j < right.length) { ... }
return out;   // whichever side still has elements is silently dropped`,
        right: `while (i < left.length && j < right.length) { ... }
while (i < left.length) out.push(left[i++]);   // drain the rest
while (j < right.length) out.push(right[j++]);`,
        why: 'The main loop stops as soon as EITHER side runs out. The other side still has its (already sorted) remaining elements, and they must be appended or they vanish from the output.',
        whyHi: 'Main loop tab rukta hai jaise hi KOI EK side khatam hoti hai. Doosri side ke abhi bhi apne (pehle se sorted) baaki elements hain, aur unhe append karna chahiye warna wo output se gaayab ho jaate hain.',
      },
      {
        wrong: `// using < instead of <= in the merge comparison, then calling it "stable"
if (left[i] < right[j]) out.push(left[i++]);   // on a tie, takes from RIGHT`,
        right: `if (left[i] <= right[j]) out.push(left[i++]); // on a tie, takes from LEFT -> stable`,
        why: 'With strict <, a tie sends the RIGHT element (which was later in the original array) out first, reordering equal elements. Use <= to make merge sort stable.',
        whyHi: 'Strict < ke saath, ek tie RIGHT element (jo original array mein baad mein tha) ko pehle bahar bhejta hai, barabar elements ko reorder karte hue. merge sort ko stable banane ke liye <= istemal karo.',
      },
    ],

    realWorld: [
      {
        en: '**Many standard-library sorts are merge-sort variants** — Python\'s and Java\'s (for objects) use Timsort, a merge sort tuned to exploit already-sorted runs, chosen specifically because it is stable and O(n log n) guaranteed.',
        hi: '**Kayi standard-library sorts merge-sort variants hain** — Python ka aur Java ka (objects ke liye) Timsort istemal karte hain, ek merge sort jo pehle-se-sorted runs exploit karne ke liye tuned hai, khaas taur par isliye chuna gaya kyunki ye stable aur O(n log n) guaranteed hai.',
      },
      {
        en: '**External sorting** — sorting a file far larger than RAM — is merge sort: split into memory-sized chunks, sort each, write them out, then merge the sorted chunks in a streaming pass (this course\'s Module 8 k-way merge).',
        hi: '**External sorting** — RAM se kaafi bade file ko sort karna — merge sort hai: memory-sized chunks mein split karo, har ek sort karo, unhe likho, phir sorted chunks ko ek streaming pass mein merge karo (is course ka Module 8 k-way merge).',
      },
      {
        en: '**The O(n log n) comparison-sort lower bound is why interviewers accept "it cannot be done faster with comparisons"** as a complete answer — and why they then ask whether the keys have exploitable structure.',
        hi: '**O(n log n) comparison-sort lower bound wajah hai ki interviewers "ise comparisons ke saath tez nahi kiya jaa sakta" ko ek poora jawaab maante hain** — aur kyun wo phir poochte hain ki kya keys mein exploitable structure hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain why no comparison-based sort can be faster than O(n log n) in the worst case.',
        qHi: 'Samjhaao ki koi comparison-based sort worst case mein O(n log n) se tez kyun nahi ho sakta.',
        a: 'A comparison sort gathers all of its information about the input by asking questions of the form "is element x less than element y?". Each such question has exactly two possible answers, so it is one bit of information. After the algorithm has asked k questions, the sequence of yes/no answers it has received is a string of k bits, and there are only 2 to the power k distinct such strings. Now consider what the algorithm has to accomplish. The input is some permutation of n distinct elements, and there are n factorial possible permutations. Two different permutations require two different sequences of moves to sort them into order, so the algorithm must end up in a different internal state — having received a different answer string — for every one of the n factorial permutations. If it ever received the same answer string for two different input permutations, it would perform the same rearrangement on both, and could not sort both correctly. So the number of distinct answer strings the algorithm can produce, 2 to the power k, must be at least n factorial. Taking the logarithm base 2 of both sides, k must be at least log base 2 of n factorial. By Stirling\'s approximation, log base 2 of n factorial is approximately n times log base 2 of n. So in the worst case the algorithm must ask on the order of n log n questions, and since each question is at least constant work, its running time is at least on the order of n log n. This is a lower bound on the entire class of comparison sorts, not a statement about any particular algorithm, and it is why merge sort and heapsort, which achieve O(n log n) worst case, are considered optimal comparison sorts.',
        aHi: 'Ek comparison sort input ke baare mein apni saari jaankaari "kya element x element y se kam hai?" roop ke sawaal poochkar ikattha karta hai. Har aisa sawaal ke bilkul do sambhaavit jawaab hain, isliye ye ek bit jaankaari hai. Algorithm ke k sawaal poochne ke baad, jo yes/no jawaab isne paaye unka sequence k bits ki ek string hai, aur sirf 2 ki power k alag aisi strings hain. Ab socho algorithm ko kya poora karna hai. Input n distinct elements ka koi permutation hai, aur n factorial sambhaavit permutations hain. Do alag permutations ko order mein sort karne ke liye do alag moves ke sequences chahiye, isliye algorithm ko ek alag internal state mein khatam hona chahiye — ek alag answer string paakar — n factorial permutations mein se har ek ke liye. Agar isne kabhi do alag input permutations ke liye wahi answer string paayi, ye dono par wahi rearrangement karta, aur dono ko sahi sort nahi kar sakta. Toh alag answer strings ki tadaad jo algorithm bana sakta hai, 2 ki power k, kam se kam n factorial honi chahiye. Dono sides ka log base 2 lekar, k kam se kam n factorial ka log base 2 hona chahiye. Stirling\'s approximation se, n factorial ka log base 2 lagbhag n guna n ka log base 2 hai. Toh worst case mein algorithm ko lagbhag n log n sawaal poochne chahiye, aur kyunki har sawaal kam se kam constant kaam hai, iska running time kam se kam lagbhag n log n hai. Ye poore comparison sorts ke class par ek lower bound hai, kisi khaas algorithm ke baare mein ek kathan nahi, aur yahi wajah hai ki merge sort aur heapsort, jo O(n log n) worst case achieve karte hain, optimal comparison sorts maane jaate hain.',
      },
      {
        q: 'Merge sort, quicksort, and heapsort are all O(n log n) on average. Why does merge sort remain a common default despite needing O(n) extra space?',
        qHi: 'Merge sort, quicksort, aur heapsort sab average par O(n log n) hain. Merge sort O(n) extra space chahne ke baawajood ek aam default kyun rehta hai?',
        a: 'Merge sort has three properties that the other two do not all share, and for many real workloads at least one of them is decisive. First, it is stable: equal elements keep their original relative order. This is essential whenever you sort by one key after having sorted by another, which is extremely common in practice, and neither quicksort nor heapsort provides it without extra bookkeeping. Second, its O(n log n) is a worst-case guarantee, not an average. Quicksort has an O(n squared) worst case that, while avoidable with good pivot selection, is a real risk under adversarial input, and some systems cannot tolerate that tail. Merge sort has no bad input at all. Third, merge sort\'s access pattern is sequential — it reads and writes runs of consecutive elements — which makes it a natural fit for data that does not live in fast random-access memory: sorting a file on disk, or merging sorted streams from a network, where the algorithm literally cannot jump around. Heapsort\'s scattered heap indexing is terrible for that. The O(n) space cost is real, but for in-memory sorting of a few million records it is a few tens of megabytes, which is usually acceptable, and library implementations like Timsort reduce it further by merging in-place-ish over detected runs. So the trade is: pay some memory, get stability, a hard worst-case bound, and cache- and IO-friendly access. When memory is genuinely the binding constraint, that is when heapsort or in-place quicksort take over.',
        aHi: 'Merge sort ke teen properties hain jo doosre do sab share nahi karte, aur kayi asli workloads ke liye unmein se kam se kam ek nirnaayak hai. Pehla, ye stable hai: barabar elements apna original relative order rakhte hain. Ye zaroori hai jab bhi aap ek key se sort karte ho doosri se sort karne ke baad, jo practice mein bahut aam hai, aur na quicksort na heapsort ise extra bookkeeping ke bina deta hai. Doosra, iska O(n log n) ek worst-case guarantee hai, ek average nahi. Quicksort ka ek O(n varg) worst case hai jo, achhe pivot selection se avoidable hone ke baawajood, adversarial input ke tahat ek asli risk hai, aur kuch systems us tail ko tolerate nahi kar sakte. Merge sort ka koi bad input bilkul nahi. Teesra, merge sort ka access pattern sequential hai — ye lagaataar elements ke runs padhta aur likhta hai — jo ise us data ke liye ek natural fit banata hai jo fast random-access memory mein nahi rehta: ek file ko disk par sort karna, ya ek network se sorted streams merge karna, jahaan algorithm literally around jump nahi kar sakta. Heapsort ka bikhra hua heap indexing uske liye bahut kharab hai. O(n) space cost asli hai, par kuch million records ke in-memory sorting ke liye ye kuch tens of megabytes hai, jo aksar acceptable hai, aur Timsort jaise library implementations ise detected runs par in-place-ish merge karke aur kam karte hain. Toh trade hai: kuch memory do, stability, ek hard worst-case bound, aur cache- aur IO-friendly access lo. Jab memory sach mein binding constraint hai, tab heapsort ya in-place quicksort le lete hain.',
      },
    ],

    exercises: [
      {
        task: 'Implement mergeSort and merge exactly as shown. Test on [5,2,4,6,1,3], on an already-sorted array, and on a reverse-sorted array — confirm all three come out sorted with the same code path.',
        taskHi: 'mergeSort aur merge bilkul jaisa dikhaaya gaya waise implement karo. [5,2,4,6,1,3] par, ek pehle-se-sorted array par, aur ek reverse-sorted array par test karo — confirm karo teeno usi code path ke saath sorted aate hain.',
        hint: 'Add a counter that increments on every comparison in merge. Print it for each of the three inputs — the counts should be very close, unlike insertion sort where reverse-sorted is far worse.',
        hintHi: 'Ek counter jodo jo merge mein har comparison par increment kare. Teeno inputs ke liye ise print karo — counts bahut kareeb hone chahiye, insertion sort ke ulat jahaan reverse-sorted kaafi kharab hai.',
      },
      {
        task: 'Sort an array of {name, age} records by age with your stable merge sort. Verify that two records with the same age come out in the same order they appeared in the input.',
        taskHi: 'Apne stable merge sort se {name, age} records ke ek array ko age se sort karo. Verify karo ki ek hi age ke do records usi order mein aate hain jismein wo input mein aaye.',
        hint: 'Use <= (not <) when comparing ages in merge. Test with [{n:"A",age:2},{n:"B",age:1},{n:"C",age:2}] and confirm A stays before C.',
        hintHi: 'merge mein ages compare karte waqt <= (not <) istemal karo. [{n:"A",age:2},{n:"B",age:1},{n:"C",age:2}] se test karo aur confirm karo A, C se pehle rehta hai.',
      },
      {
        task: 'Empirically compare insertion sort and merge sort. Time each on random arrays of size 1000, 2000, 4000, 8000. Confirm insertion sort roughly quadruples each time while merge sort a bit more than doubles.',
        taskHi: 'insertion sort aur merge sort ko empirically compare karo. Har ek ko size 1000, 2000, 4000, 8000 ke random arrays par time karo. Confirm karo insertion sort har baar lagbhag chaar guna hota hai jabki merge sort double se thoda zyaada.',
        hint: 'Use the same shuffled array for both at each size. The crossover where merge sort wins is usually somewhere between n=30 and n=100.',
        hintHi: 'Har size par dono ke liye wahi shuffled array istemal karo. Crossover jahaan merge sort jeetta hai aksar n=30 aur n=100 ke beech kahin hai.',
      },
    ],

    keyTakeaways: [
      'Elementary sorts (insertion, bubble, selection) are O(n squared) because each element is compared against many others — fine for tiny or nearly-sorted data, not for large arrays.',
      'No comparison-based sort can beat O(n log n) worst case: with only yes/no comparisons it needs ~log2(n!) ~= n log n of them to distinguish all n! orderings.',
      'Merge sort: split in half, sort each half recursively, merge the two sorted halves in one linear pass. log n levels times O(n) work per level = O(n log n), for every input.',
      'The merge step is Module 4\'s two-pointer merge of sorted sequences. Preferring the LEFT element on a tie (<=) makes merge sort stable.',
      'Merge sort costs O(n) extra space. Heapsort (O(1) space) and in-place quicksort (O(log n) stack) trade stability for lower memory.',
      'Merge sort is the default when stability matters, when a hard worst-case bound is required, or when access must be sequential (external / streaming sorts).',
    ],
    keyTakeawaysHi: [
      'Elementary sorts (insertion, bubble, selection) O(n varg) hain kyunki har element doosron ke against compare hota hai — tiny ya nearly-sorted data ke liye theek, bade arrays ke liye nahi.',
      'Koi comparison-based sort O(n log n) worst case ko haara nahi sakta: sirf yes/no comparisons ke saath use sab n! orderings alag karne ke liye ~log2(n!) ~= n log n chahiye.',
      'Merge sort: aadha split karo, har half recursively sort karo, do sorted halves ko ek linear pass mein merge karo. log n levels guna prati level O(n) kaam = O(n log n), har input ke liye.',
      'merge step Module 4 ka sorted sequences ka two-pointer merge hai. Tie par LEFT element prefer karna (<=) merge sort ko stable banata hai.',
      'Merge sort O(n) extra space kharch karta hai. Heapsort (O(1) space) aur in-place quicksort (O(log n) stack) stability ko kam memory ke liye trade karte hain.',
      'Merge sort default hai jab stability maayne rakhti hai, jab ek hard worst-case bound zaroori hai, ya jab access sequential hona chahiye (external / streaming sorts).',
    ],
  },
];
