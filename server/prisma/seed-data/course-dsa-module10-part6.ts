/**
 * DSA Complete Course — Module 10: Sorting & Searching, lesson 6.
 *
 * Divide and conquer as a PARADIGM, and the Master Theorem for reading off
 * the complexity of a D&C recurrence without drawing the recursion tree every
 * time. Merge sort (lesson 1) and quicksort (lesson 2) are the two canonical
 * examples the learner already has; this lesson names the shared shape
 * (T(n) = a*T(n/b) + f(n)), gives the three-case shortcut for its solution,
 * and applies D&C to problems that are NOT sorting: counting inversions
 * (piggy-backed on merge sort) and maximum subarray by splitting.
 *
 * Broken example: guessing that "it splits in half and recurses, so it must
 * be O(n log n)" — which is wrong for f(n) that is not linear. A split with
 * O(n^2) combine work is O(n^2), not O(n log n); a split with O(1) combine
 * (binary search) is O(log n).
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts. Also scan for stray
 * Devanagari/Cyrillic look-alikes and RUN every code sample in node.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_10_PART6: CourseLesson[] = [
  {
    slug: 'divide-and-conquer-and-the-master-theorem',
    title: 'Divide and Conquer and the Master Theorem',
    titleHi: 'Divide And Conquer Aur Master Theorem',
    description: 'Assuming that any algorithm which splits its input in half and recurses on both halves must run in n-log-n time. Merge sort does, but the reasoning is a shortcut that skips the one thing that actually decides the complexity: how much work happens at each level to split the input and combine the results. Change that work and the same split-in-half structure runs in linear, or quadratic, or logarithmic time.',
    descriptionHi: 'Ye maan lena ki koi bhi algorithm jo apne input ko aadha baant deta hai aur dono aadhon par recurse karta hai wo n-log-n samay mein chalega. Merge sort chalta hai, par tark ek shortcut hai jo wo ek cheez chhod deta hai jo asal mein complexity tay karti hai: input baantne aur nateeje jodne ke liye har level par kitna kaam hota hai. Us kaam ko badlo aur wahi split-in-half structure linear, ya quadratic, ya logarithmic samay mein chalta hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 6,

    analogy: {
      en: '**Sorting a warehouse of returned parcels by handing half the pile to each of two assistants, who each hand half of their pile to two more, and so on — and asking how long the whole job takes.** Everyone agrees the pile is halved at each level, so there are about log-n levels. The part people skip is the work you personally do at your level: after your two assistants hand their finished sub-piles back, how much effort is it to merge them into one sorted pile? If merging two sorted sub-piles is a single walk down both — proportional to the number of parcels you were handed — then every level in total does about n parcels of merging, and log-n levels times n is the familiar n-log-n. But suppose merging is sloppier and takes effort proportional to the number of parcels squared; then the top level alone does n-squared work and dominates everything, and the whole job is n-squared regardless of the neat halving. And if the "combine" step is trivial — you just pick which assistant\'s answer to keep and throw the other away, as in looking up a word in a dictionary — then only one branch matters at each level, and log-n levels of constant work is just log-n. The halving sets up the levels; the per-level work decides the total.',
      hi: '**Lautaaye gaye parcels ke ek warehouse ko sort karna do assistants mein se har ek ko aadha dher dekar, jo har ek apna aadha dher do aur ko dete hain, aur aage — aur poochhna ki poora kaam kitna samay leta hai.** Sab sahmat hain ki dher har level par aadha hota hai, isliye lagbhag log-n levels hain. Jo hissa log chhodte hain wo kaam hai jo aap khud apne level par karte ho: aapke do assistants apne poore sub-piles wapas dene ke baad, unhe ek sorted pile mein merge karne mein kitni mehnat hai? Agar do sorted sub-piles merge karna dono par ek akela walk hai — aapko diye gaye parcels ki tadaad ke anupaatik — toh har level kul lagbhag n parcels ka merging karta hai, aur log-n levels guna n wahi jaana-pehchaana n-log-n hai. Par maano merging aur sloppy hai aur parcels ki tadaad ke varg ke anupaatik mehnat leti hai; toh sirf top level n-squared kaam karta hai aur sab kuch par haavi hota hai, aur poora kaam n-squared hai chahe saaf halving ho. Aur agar "combine" step trivial hai — aap bas chunte ho kaunse assistant ka jawaab rakhna hai aur doosra phenk dete ho, jaise ek dictionary mein ek shabd dhoondhna — toh har level par sirf ek branch maayne rakhti hai, aur constant kaam ke log-n levels bas log-n hai. Halving levels set up karta hai; prati-level kaam total tay karta hai.',
    },

    simple: `**Start broken.** "It splits in half and recurses, so it must be O(n log n)":

\`\`\`js
// This function splits in half and recurses on BOTH halves...
function maxSubarrayDC(a, lo = 0, hi = a.length - 1) {
  if (lo === hi) return a[lo];
  const mid = (lo + hi) >> 1;
  const left  = maxSubarrayDC(a, lo, mid);
  const right = maxSubarrayDC(a, mid + 1, hi);
  const cross = maxCrossing(a, lo, mid, hi);   // <-- how expensive is THIS?
  return Math.max(left, right, cross);
}

// ...if maxCrossing is O(n) -> T(n) = 2T(n/2) + O(n) -> O(n log n).  Fine.
// but write maxCrossing as an O(n^2) double loop and the SAME split-in-half
// structure is now O(n^2). The halving did not save you.
\`\`\`

The split-and-recurse shape alone tells you almost nothing. What determines the total cost is the recurrence \`T(n) = a * T(n/b) + f(n)\`, where \`a\` is how many subproblems you make, \`b\` is the factor by which each shrinks, and \`f(n)\` is the work to split and combine at this level. \`O(n log n)\` is just *one* of the possible answers.

**The fix: the Master Theorem — read the complexity off the three numbers**

\`\`\`
T(n) = a * T(n/b) + f(n)          a >= 1,  b > 1

Compare f(n) against  n^(log_b a)   — call that exponent  c* = log_b a

  CASE 1  f(n) grows SLOWER than n^c*        ->  T(n) = O(n^c*)
          (the leaves dominate)
  CASE 2  f(n) grows AS n^c* (times log^k)   ->  T(n) = O(n^c* * log^(k+1) n)
          (every level costs the same)
  CASE 3  f(n) grows FASTER than n^c*        ->  T(n) = O(f(n))
          (the root dominates; needs a regularity check, almost always holds)
\`\`\`

\`\`\`js
// merge sort:   T(n) = 2 T(n/2) + O(n).   a=2, b=2 -> c* = log2(2) = 1.
//               f(n) = n = n^1 = n^c*      -> CASE 2, k=0 -> O(n log n)

// binary search: T(n) = 1 T(n/2) + O(1).  a=1, b=2 -> c* = log2(1) = 0.
//               f(n) = 1 = n^0 = n^c*      -> CASE 2, k=0 -> O(log n)

// "split in half, O(n^2) combine": T(n) = 2 T(n/2) + O(n^2). c* = 1.
//               f(n) = n^2 grows FASTER than n^1  -> CASE 3 -> O(n^2)

// Karatsuba multiplication: T(n) = 3 T(n/2) + O(n).  c* = log2(3) ~ 1.585.
//               f(n) = n grows SLOWER than n^1.585   -> CASE 1 -> O(n^1.585)
\`\`\`

You do not draw the recursion tree every time. You read off \`a\`, \`b\`, \`f(n)\`, compute \`c* = log_b a\`, and compare \`f(n)\` to \`n^c*\`. That comparison — slower, equal, or faster — picks the case and hands you the answer.`,

    simpleHi: `**Toote hue se shuru.** "Ye aadha baantta hai aur recurse karta hai, isliye ye O(n log n) hoga":

\`\`\`js
// Ye function aadha baantta hai aur DONO aadhon par recurse karta hai...
function maxSubarrayDC(a, lo = 0, hi = a.length - 1) {
  if (lo === hi) return a[lo];
  const mid = (lo + hi) >> 1;
  const left  = maxSubarrayDC(a, lo, mid);
  const right = maxSubarrayDC(a, mid + 1, hi);
  const cross = maxCrossing(a, lo, mid, hi);   // <-- YE kitna mehenga hai?
  return Math.max(left, right, cross);
}

// ...agar maxCrossing O(n) hai -> T(n) = 2T(n/2) + O(n) -> O(n log n).  Theek.
// par maxCrossing ko ek O(n^2) double loop ki tarah likho aur WAHI split-in-half
// structure ab O(n^2) hai. Halving ne aapko nahi bachaaya.
\`\`\`

Akela split-and-recurse shape aapko lagbhag kuch nahi batata. Jo total cost tay karta hai wo recurrence \`T(n) = a * T(n/b) + f(n)\` hai, jahaan \`a\` ye hai ki aap kitne subproblems banate ho, \`b\` wo factor hai jisse har ek sikudta hai, aur \`f(n)\` is level par split aur combine karne ka kaam hai. \`O(n log n)\` bas sambhav jawaabon mein se *ek* hai.

**Fix: Master Theorem — teen numbers se complexity padho**

\`\`\`
T(n) = a * T(n/b) + f(n)          a >= 1,  b > 1

f(n) ko  n^(log_b a)  ke against compare karo — us exponent ko  c* = log_b a  kaho

  CASE 1  f(n), n^c* se DHEEME badhta hai        ->  T(n) = O(n^c*)
          (leaves haavi hain)
  CASE 2  f(n), n^c* ke ROOP mein badhta hai (guna log^k)  ->  T(n) = O(n^c* * log^(k+1) n)
          (har level ki cost samaan)
  CASE 3  f(n), n^c* se TEZ badhta hai           ->  T(n) = O(f(n))
          (root haavi; ek regularity check chahiye, lagbhag hamesha hota hai)
\`\`\`

\`\`\`js
// merge sort:   T(n) = 2 T(n/2) + O(n).   a=2, b=2 -> c* = log2(2) = 1.
//               f(n) = n = n^1 = n^c*      -> CASE 2, k=0 -> O(n log n)

// binary search: T(n) = 1 T(n/2) + O(1).  a=1, b=2 -> c* = log2(1) = 0.
//               f(n) = 1 = n^0 = n^c*      -> CASE 2, k=0 -> O(log n)

// "aadha baanto, O(n^2) combine": T(n) = 2 T(n/2) + O(n^2). c* = 1.
//               f(n) = n^2, n^1 se TEZ badhta hai  -> CASE 3 -> O(n^2)

// Karatsuba multiplication: T(n) = 3 T(n/2) + O(n).  c* = log2(3) ~ 1.585.
//               f(n) = n, n^1.585 se DHEEME badhta hai   -> CASE 1 -> O(n^1.585)
\`\`\`

Aap har baar recursion tree nahi banate. Aap \`a\`, \`b\`, \`f(n)\` padhte ho, \`c* = log_b a\` compute karte ho, aur \`f(n)\` ko \`n^c*\` se compare karte ho. Wo tulna — dheeme, barabar, ya tez — case chunti hai aur aapko jawaab deti hai.`,

    content: `## The recurrence, drawn as a tree

\`\`\`
T(n) = a T(n/b) + f(n)

level 0:            f(n)                                 <- 1 node, cost f(n)
level 1:      f(n/b)  f(n/b) ... (a of them)             <- a nodes, cost a*f(n/b)
level 2:   f(n/b^2) ...            (a^2 of them)         <- a^2 nodes
...
level L:   the leaves, there are a^L of them, L = log_b n

The a^L leaves number a^(log_b n) = n^(log_b a) = n^c*.

Total = sum over all levels of (nodes at that level) x (cost per node).
Which end of that sum dominates is exactly the three cases:
  leaves win     -> CASE 1, answer O(n^c*)
  all levels tie -> CASE 2, answer O(n^c* log n)
  root wins      -> CASE 3, answer O(f(n))
\`\`\`

The Master Theorem is just the closed-form result of doing that sum. You do not need to redo the sum — you need to know which of \`f(n)\` and \`n^c*\` is bigger.

## Worked: counting inversions, riding on merge sort

An inversion is a pair \`i < j\` with \`a[i] > a[j]\` — a measure of how unsorted the array is. Brute force is O(n^2). Merge sort counts them for free during the merge:

\`\`\`js
function countInversions(a) {
  a = a.slice();
  function sortCount(lo, hi) {
    if (hi - lo <= 1) return 0;
    const mid = (lo + hi) >> 1;
    let inv = sortCount(lo, mid) + sortCount(mid, hi);

    // merge a[lo..mid) and a[mid..hi), counting cross inversions
    const merged = [];
    let i = lo, j = mid;
    while (i < mid && j < hi) {
      if (a[i] <= a[j]) {
        merged.push(a[i++]);
      } else {
        merged.push(a[j++]);
        inv += mid - i;            // a[i..mid) are ALL > a[j] -> that many inversions
      }
    }
    while (i < mid) merged.push(a[i++]);
    while (j < hi)  merged.push(a[j++]);
    for (let k = 0; k < merged.length; k++) a[lo + k] = merged[k];
    return inv;
  }
  return sortCount(0, a.length);
}

console.log(countInversions([2, 4, 1, 3, 5]));   // 3  -> (2,1) (4,1) (4,3)
console.log(countInversions([5, 4, 3, 2, 1]));   // 10 -> fully reversed
\`\`\`

The recurrence is \`T(n) = 2T(n/2) + O(n)\` — identical to merge sort — so it is \`O(n log n)\`. The one insight is \`inv += mid - i\`: when \`a[j]\` is placed before \`a[i]\`, every remaining element in the left half is also greater than \`a[j]\`, and there are \`mid - i\` of them.

## Worked: maximum subarray by divide and conquer

\`\`\`js
function maxSubarray(a) {
  function go(lo, hi) {
    if (lo === hi) return a[lo];
    const mid = (lo + hi) >> 1;
    const left  = go(lo, mid);
    const right = go(mid + 1, hi);

    let sum = 0, leftBest = -Infinity;
    for (let i = mid; i >= lo; i--) { sum += a[i]; leftBest = Math.max(leftBest, sum); }
    sum = 0; let rightBest = -Infinity;
    for (let i = mid + 1; i <= hi; i++) { sum += a[i]; rightBest = Math.max(rightBest, sum); }

    return Math.max(left, right, leftBest + rightBest);   // best crossing the middle
  }
  return go(0, a.length - 1);
}
console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));   // 6  -> [4,-1,2,1]
\`\`\`

The crossing scan is \`O(n)\`, so \`T(n) = 2T(n/2) + O(n) = O(n log n)\`. Kadane\'s algorithm (Module 11) solves the same problem in \`O(n)\` — the D&C version is here to show the paradigm, and because "max subarray, prove it with divide and conquer" is a classic interview follow-up.

## The recognition checklist

\`\`\`
"split the input, solve the pieces, combine"          divide and conquer
"analyse T(n) = a T(n/b) + f(n)"                       Master Theorem, compare f(n) to n^(log_b a)
"count inversions / reverse pairs"                     merge sort + count during merge, O(n log n)
"closest pair of points"                               D&C by x-coordinate, O(n log n)
"kth smallest without full sort"                        quickselect (lesson 2), O(n) average
"multiply huge numbers / polynomials faster"           Karatsuba / FFT, sub-quadratic

Interview tell: the size drops by a constant FACTOR (not a constant amount)
each recursive call, and you do some non-recursive work to glue the results.
The complexity question is always "how big is the glue work versus n^(log_b a)".
\`\`\``,

    contentHi: `## Recurrence, ek tree ki tarah banaayi

\`\`\`
T(n) = a T(n/b) + f(n)

level 0:            f(n)                                 <- 1 node, cost f(n)
level 1:      f(n/b)  f(n/b) ... (a itne)                <- a nodes, cost a*f(n/b)
level 2:   f(n/b^2) ...            (a^2 itne)            <- a^2 nodes
...
level L:   leaves, unmein a^L itne hain, L = log_b n

a^L leaves ki tadaad a^(log_b n) = n^(log_b a) = n^c* hai.

Total = sab levels par yog (us level par nodes) x (prati node cost).
Us yog ka kaunsa sira haavi hai wahi teen cases hain:
  leaves jeette      -> CASE 1, jawaab O(n^c*)
  sab levels barabar -> CASE 2, jawaab O(n^c* log n)
  root jeette        -> CASE 3, jawaab O(f(n))
\`\`\`

Master Theorem bas us yog ko karne ka closed-form nateeja hai. Aapko yog dobara karne ki zaroorat nahi — aapko jaanna hai ki \`f(n)\` aur \`n^c*\` mein se kaunsa bada hai.

## Worked: inversions ginna, merge sort par sawaar

Ek inversion ek jodi \`i < j\` hai jahaan \`a[i] > a[j]\` — array kitna unsorted hai iska ek maap. Brute force O(n^2) hai. Merge sort unhe merge ke dauraan muft ginta hai:

\`\`\`js
function countInversions(a) {
  a = a.slice();
  function sortCount(lo, hi) {
    if (hi - lo <= 1) return 0;
    const mid = (lo + hi) >> 1;
    let inv = sortCount(lo, mid) + sortCount(mid, hi);

    // a[lo..mid) aur a[mid..hi) merge karo, cross inversions ginte hue
    const merged = [];
    let i = lo, j = mid;
    while (i < mid && j < hi) {
      if (a[i] <= a[j]) {
        merged.push(a[i++]);
      } else {
        merged.push(a[j++]);
        inv += mid - i;            // a[i..mid) SAB > a[j] -> utni inversions
      }
    }
    while (i < mid) merged.push(a[i++]);
    while (j < hi)  merged.push(a[j++]);
    for (let k = 0; k < merged.length; k++) a[lo + k] = merged[k];
    return inv;
  }
  return sortCount(0, a.length);
}

console.log(countInversions([2, 4, 1, 3, 5]));   // 3  -> (2,1) (4,1) (4,3)
console.log(countInversions([5, 4, 3, 2, 1]));   // 10 -> poori tarah reversed
\`\`\`

Recurrence \`T(n) = 2T(n/2) + O(n)\` hai — merge sort jaisa hi — isliye ye \`O(n log n)\` hai. Ek insight \`inv += mid - i\` hai: jab \`a[j]\` ko \`a[i]\` se pehle rakha jaata hai, left half ka har baaki element bhi \`a[j]\` se bada hai, aur unmein \`mid - i\` itne hain.

## Worked: divide and conquer se maximum subarray

\`\`\`js
function maxSubarray(a) {
  function go(lo, hi) {
    if (lo === hi) return a[lo];
    const mid = (lo + hi) >> 1;
    const left  = go(lo, mid);
    const right = go(mid + 1, hi);

    let sum = 0, leftBest = -Infinity;
    for (let i = mid; i >= lo; i--) { sum += a[i]; leftBest = Math.max(leftBest, sum); }
    sum = 0; let rightBest = -Infinity;
    for (let i = mid + 1; i <= hi; i++) { sum += a[i]; rightBest = Math.max(rightBest, sum); }

    return Math.max(left, right, leftBest + rightBest);   // middle ko cross karne waala best
  }
  return go(0, a.length - 1);
}
console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));   // 6  -> [4,-1,2,1]
\`\`\`

Crossing scan \`O(n)\` hai, isliye \`T(n) = 2T(n/2) + O(n) = O(n log n)\`. Kadane ka algorithm (Module 11) usi problem ko \`O(n)\` mein solve karta hai — D&C version yahaan paradigm dikhaane ko hai, aur kyunki "max subarray, divide and conquer se saabit karo" ek classic interview follow-up hai.

## Pehchaanne ki checklist

\`\`\`
"input baanto, tukde solve karo, combine karo"       divide and conquer
"T(n) = a T(n/b) + f(n) analyse karo"                 Master Theorem, f(n) ko n^(log_b a) se compare
"inversions / reverse pairs gino"                     merge sort + merge ke dauraan gino, O(n log n)
"closest pair of points"                              x-coordinate se D&C, O(n log n)
"poore sort ke bina kth smallest"                     quickselect (lesson 2), O(n) average
"vishaal numbers / polynomials tez guna karo"         Karatsuba / FFT, sub-quadratic

Interview sanket: size har recursive call ek constant FACTOR se girta hai
(ek constant maatra se nahi), aur aap nateeje jodne ke liye kuch non-recursive
kaam karte ho. Complexity sawaal hamesha "glue kaam n^(log_b a) ke mukaable kitna bada hai".
\`\`\``,

    examples: [
      {
        title: 'Broken: assuming split-in-half means O(n log n)',
        titleHi: 'Toota: split-in-half ka matlab O(n log n) maan lena',
        code: `const cross = maxCrossingSlow(a, lo, mid, hi);   // O(n^2) double loop
// T(n) = 2T(n/2) + O(n^2)  ->  O(n^2), NOT O(n log n)`,
        codeJs: `function maxCrossingSlow(a, lo, mid, hi) {
  let best = -Infinity;
  for (let i = lo; i <= mid; i++)
    for (let j = mid + 1; j <= hi; j++) {
      let s = 0;
      for (let k = i; k <= j; k++) s += a[k];
      best = Math.max(best, s);
    }
  return best;
}
function maxSubarraySlow(a, lo = 0, hi = a.length - 1) {
  if (lo === hi) return a[lo];
  const mid = (lo + hi) >> 1;
  return Math.max(
    maxSubarraySlow(a, lo, mid),
    maxSubarraySlow(a, mid + 1, hi),
    maxCrossingSlow(a, lo, mid, hi));
}
const a = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubarraySlow(a));   // 6 — correct value, but the combine is cubic-ish`,
        codeTs: `function maxSubarraySlow(a: number[], lo = 0, hi = a.length - 1): number {
  if (lo === hi) return a[lo]!;
  const mid = (lo + hi) >> 1;
  return Math.max(
    maxSubarraySlow(a, lo, mid),
    maxSubarraySlow(a, mid + 1, hi),
    /* an O(n^2)+ crossing scan */ 0);
}`,
        outputJs: `6`,
        outputTs: `// Right answer, wrong complexity: the split-in-half structure did not make
// this O(n log n) — the combine step did the opposite.`,
        explain: 'The recursion still halves the input, but the crossing computation is O(n^2) (or worse with the inner sum loop). By the Master Theorem, f(n) = n^2 grows faster than n^(log2 2) = n, so this is Case 3 and the answer is O(n^2). "Splits in half" tells you b=2 and a=2 and nothing about f(n).',
        explainHi: 'Recursion abhi bhi input aadha karta hai, par crossing computation O(n^2) hai (ya inner sum loop ke saath aur kharaab). Master Theorem se, f(n) = n^2, n^(log2 2) = n se tez badhta hai, isliye ye Case 3 hai aur jawaab O(n^2) hai. "Aadha baantta hai" aapko b=2 aur a=2 batata hai aur f(n) ke baare mein kuch nahi.',
      },
      {
        title: 'Fixed: O(n) combine, and reading the Master Theorem',
        titleHi: 'Theek: O(n) combine, aur Master Theorem padhna',
        code: `// linear crossing scan -> T(n) = 2T(n/2) + O(n) -> Case 2 -> O(n log n)`,
        codeJs: `function maxSubarray(a) {
  function go(lo, hi) {
    if (lo === hi) return a[lo];
    const mid = (lo + hi) >> 1;
    const left = go(lo, mid), right = go(mid + 1, hi);
    let sum = 0, lb = -Infinity;
    for (let i = mid; i >= lo; i--) { sum += a[i]; lb = Math.max(lb, sum); }
    sum = 0; let rb = -Infinity;
    for (let i = mid + 1; i <= hi; i++) { sum += a[i]; rb = Math.max(rb, sum); }
    return Math.max(left, right, lb + rb);
  }
  return go(0, a.length - 1);
}
console.log(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));   // 6
console.log(maxSubarray([1]));                               // 1
console.log(maxSubarray([-3, -1, -2]));                      // -1

// Master Theorem applied to the three sorts/searches you know:
// merge sort:    2 T(n/2) + O(n)   -> c* = 1, f = n     -> Case 2 -> O(n log n)
// binary search: 1 T(n/2) + O(1)   -> c* = 0, f = 1     -> Case 2 -> O(log n)
// this function: 2 T(n/2) + O(n)   -> c* = 1, f = n     -> Case 2 -> O(n log n)`,
        codeTs: `function maxSubarray(a: number[]): number {
  function go(lo: number, hi: number): number {
    if (lo === hi) return a[lo]!;
    const mid = (lo + hi) >> 1;
    const left = go(lo, mid), right = go(mid + 1, hi);
    let sum = 0, lb = -Infinity;
    for (let i = mid; i >= lo; i--) { sum += a[i]!; lb = Math.max(lb, sum); }
    sum = 0; let rb = -Infinity;
    for (let i = mid + 1; i <= hi; i++) { sum += a[i]!; rb = Math.max(rb, sum); }
    return Math.max(left, right, lb + rb);
  }
  return go(0, a.length - 1);
}`,
        outputJs: `6
1
-1`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Two subproblems (a=2), each half the size (b=2), so c* = log2(2) = 1. The combine work f(n) is a linear scan, n = n^1 = n^c*, which is Case 2 with k=0: O(n^c* log n) = O(n log n). The all-negative case returns the largest single element because the recursion base returns a[lo] directly.',
        explainHi: 'Do subproblems (a=2), har ek aadhe size ka (b=2), isliye c* = log2(2) = 1. Combine kaam f(n) ek linear scan hai, n = n^1 = n^c*, jo k=0 ke saath Case 2 hai: O(n^c* log n) = O(n log n). All-negative case sabse bada akela element lautaata hai kyunki recursion base a[lo] seedhe lautaata hai.',
      },
      {
        title: 'Count inversions during the merge — O(n log n)',
        titleHi: 'Merge ke dauraan inversions gino — O(n log n)',
        code: `if (a[i] > a[j]) { merged.push(a[j++]); inv += mid - i; }
// every unmerged left element is also > a[j]`,
        codeJs: `function countInversions(a) {
  a = a.slice();
  function sc(lo, hi) {
    if (hi - lo <= 1) return 0;
    const mid = (lo + hi) >> 1;
    let inv = sc(lo, mid) + sc(mid, hi);
    const m = []; let i = lo, j = mid;
    while (i < mid && j < hi) {
      if (a[i] <= a[j]) m.push(a[i++]);
      else { m.push(a[j++]); inv += mid - i; }
    }
    while (i < mid) m.push(a[i++]);
    while (j < hi) m.push(a[j++]);
    for (let k = 0; k < m.length; k++) a[lo + k] = m[k];
    return inv;
  }
  return sc(0, a.length);
}
console.log(countInversions([2, 4, 1, 3, 5]));   // 3
console.log(countInversions([5, 4, 3, 2, 1]));   // 10
console.log(countInversions([1, 2, 3, 4, 5]));   // 0`,
        codeTs: `function countInversions(a: number[]): number {
  a = a.slice();
  function sc(lo: number, hi: number): number {
    if (hi - lo <= 1) return 0;
    const mid = (lo + hi) >> 1;
    let inv = sc(lo, mid) + sc(mid, hi);
    const m: number[] = []; let i = lo, j = mid;
    while (i < mid && j < hi) {
      if (a[i]! <= a[j]!) m.push(a[i++]!);
      else { m.push(a[j++]!); inv += mid - i; }
    }
    while (i < mid) m.push(a[i++]!);
    while (j < hi) m.push(a[j++]!);
    for (let k = 0; k < m.length; k++) a[lo + k] = m[k]!;
    return inv;
  }
  return sc(0, a.length);
}`,
        outputJs: `3
10
0`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'A fully reversed array of 5 elements has C(5,2) = 10 inversions; a sorted array has 0. The trick is inv += mid - i: when a[j] jumps ahead of a[i], all mid - i remaining left-half elements form an inversion with a[j], counted in one shot instead of one at a time.',
        explainHi: '5 elements ke ek poori tarah reversed array mein C(5,2) = 10 inversions hain; ek sorted array mein 0. Trick inv += mid - i hai: jab a[j] a[i] se aage koodta hai, sab mid - i baaki left-half elements a[j] ke saath ek inversion banate hain, ek baar mein gina jaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// applying the Master Theorem when the subproblems are NOT equal size
// quicksort worst case: T(n) = T(n-1) + T(0) + O(n)
// -> this is NOT a T(n/b) shape; the Master Theorem does not apply`,
        right: `// the Master Theorem needs a T(n/b) with b > 1 (a constant FACTOR shrink).
// T(n-1) + O(n) unrolls to O(n^2) by summation, not by the Master Theorem.`,
        why: 'The Master Theorem is specifically for recurrences where every subproblem is n divided by a constant b greater than 1. Quicksort\'s worst case shrinks by a constant amount (n to n-1), not a constant factor, so its recurrence is T(n) = T(n-1) + O(n), which you solve by expanding the sum to O(n^2). Matching the wrong template gives a wrong answer.',
        whyHi: 'Master Theorem khaas taur par un recurrences ke liye hai jahaan har subproblem n divided by ek constant b hai jo 1 se bada hai. Quicksort ka worst case ek constant maatra se sikudta hai (n se n-1), ek constant factor se nahi, isliye iska recurrence T(n) = T(n-1) + O(n) hai, jise aap yog ko O(n^2) tak failaakar solve karte ho.',
      },
      {
        wrong: `// counting inversions: inv++ instead of inv += mid - i
else { merged.push(a[j++]); inv++; }   // counts only ONE inversion per step`,
        right: `else { merged.push(a[j++]); inv += mid - i; }   // a[j] is less than ALL of a[i..mid)`,
        why: 'When a[j] is merged ahead of a[i], it is smaller than a[i] and — because the left half is sorted — smaller than every element from i to mid-1. That is mid - i inversions in one move. Counting just one misses all the others and undercounts badly on reversed input.',
        whyHi: 'Jab a[j] ko a[i] se aage merge kiya jaata hai, wo a[i] se chhota hai aur — kyunki left half sorted hai — i se mid-1 tak har element se chhota hai. Wo ek move mein mid - i inversions hai. Sirf ek ginna baaki sab chhoot jaata hai aur reversed input par bahut kam ginta hai.',
      },
      {
        wrong: `// Case 3 without checking regularity, then being surprised it fails
// T(n) = 2 T(n/2) + n/log n  -> f(n) = n/log n, c* = 1
// f(n) is NOT polynomially larger than n^1 -> Case 3 does NOT apply here`,
        right: `// Case 3 requires f(n) to be polynomially LARGER than n^c* (an n^epsilon gap),
// AND a*f(n/b) <= k*f(n) for some k < 1. n/log n fails the first condition.`,
        why: 'The three cases do not cover every recurrence. Case 3 needs f(n) to beat n^c* by a polynomial factor, not just by a logarithmic one. Recurrences like 2T(n/2) + n/log n fall in the gap between cases and need the Akra-Bazzi method or a direct tree sum. Know that the theorem has holes.',
        whyHi: 'Teen cases har recurrence cover nahi karte. Case 3 ko f(n) ko n^c* ko ek polynomial factor se haraana chahiye, sirf ek logarithmic se nahi. 2T(n/2) + n/log n jaise recurrences cases ke beech ke gap mein girte hain aur Akra-Bazzi method ya ek seedhe tree sum ki zaroorat hai. Jaano ki theorem mein chhed hain.',
      },
    ],

    realWorld: [
      {
        en: '**Numerical libraries** choose between schoolbook, Karatsuba, and FFT-based multiplication by input size — each is a divide-and-conquer recurrence with a different f(n), and the Master Theorem is how the crossover points are derived.',
        hi: '**Numerical libraries** input size se schoolbook, Karatsuba, aur FFT-based multiplication ke beech chunte hain — har ek ek alag f(n) waala divide-and-conquer recurrence hai, aur Master Theorem se crossover points nikaale jaate hain.',
      },
      {
        en: '**Databases and analytics** count inversions (or "discordant pairs") to compute rank-correlation statistics like Kendall\'s tau on large columns; the merge-sort-based O(n log n) count is what makes it feasible at scale.',
        hi: '**Databases aur analytics** bade columns par Kendall\'s tau jaise rank-correlation statistics compute karne ke liye inversions (ya "discordant pairs") ginte hain; merge-sort-based O(n log n) count ise scale par sambhav banaata hai.',
      },
      {
        en: '**Computational geometry** (collision detection, nearest-neighbour queries) leans on divide-and-conquer by coordinate — closest pair of points is the textbook O(n log n) example, and its combine step is the classic "only check points within a strip" trick.',
        hi: '**Computational geometry** (collision detection, nearest-neighbour queries) coordinate se divide-and-conquer par tiki hai — closest pair of points textbook O(n log n) udaharan hai, aur iska combine step classic "sirf ek strip ke andar points check karo" trick hai.',
      },
    ],

    interviewQA: [
      {
        q: 'State the Master Theorem and use it to explain why merge sort is O(n log n) but binary search is O(log n).',
        qHi: 'Master Theorem batao aur ise istemal karke samjhaao ki merge sort O(n log n) kyun hai par binary search O(log n) kyun hai.',
        a: 'The Master Theorem solves recurrences of the form T of n equals a times T of n over b, plus f of n, where a is at least one, b is strictly greater than one, and f is the non-recursive work done to divide and combine at each level. The key quantity is the exponent c-star, defined as the logarithm of a to the base b, which is the exponent such that the number of leaves in the recursion tree is n to the c-star. You then compare f of n against n to the c-star. If f grows polynomially slower, the leaves dominate and the answer is n to the c-star. If f grows at the same rate, possibly times a power of log n, every level of the tree costs about the same and the answer is n to the c-star times log n to one higher power. If f grows polynomially faster and a mild regularity condition holds, the root dominates and the answer is just f of n. For merge sort, you split into two subproblems, so a is two, each of half the size, so b is two, and c-star is log base two of two, which is one. The combine work is the linear merge, so f of n is n, which equals n to the c-star. That is the middle case with the log power at zero, giving n to the one times log n, which is n log n. For binary search, you make only one recursive call — you look at the middle and then recurse into just the left half or just the right half, never both — so a is one, b is two, and c-star is log base two of one, which is zero. The combine work is a single comparison, so f of n is constant, which is n to the zero, matching n to the c-star. Again the middle case, giving n to the zero times log n, which is log n. The whole difference between the two is a: merge sort recurses on both halves and pays for merging them, binary search recurses on one half and pays nothing to combine.',
        aHi: 'Master Theorem T of n equals a times T of n over b, plus f of n roop ki recurrences solve karta hai, jahaan a kam se kam ek hai, b sakhti se ek se bada hai, aur f har level par divide aur combine karne ka non-recursive kaam hai. Mukhya maatra exponent c-star hai, a ka logarithm base b ke roop mein paribhaashit, jo wo exponent hai jaise recursion tree mein leaves ki tadaad n to the c-star hai. Phir aap f of n ko n to the c-star ke against compare karte ho. Agar f polynomially dheeme badhta hai, leaves haavi hain aur jawaab n to the c-star hai. Agar f usi dar par badhta hai, shaayad log n ki ek power guna, tree ka har level lagbhag samaan cost karta hai aur jawaab n to the c-star guna log n ek zyaada power tak hai. Agar f polynomially tez badhta hai aur ek halka regularity condition tikta hai, root haavi hai aur jawaab bas f of n hai. Merge sort ke liye, aap do subproblems mein baantte ho, isliye a do hai, har ek aadhe size ka, isliye b do hai, aur c-star log base two of two hai, jo ek hai. Combine kaam linear merge hai, isliye f of n n hai, jo n to the c-star ke barabar hai. Wo beech ka case hai log power zero par, n to the one guna log n dete hue, jo n log n hai. Binary search ke liye, aap sirf ek recursive call karte ho — aap middle dekhte ho aur phir sirf left half ya sirf right half mein recurse karte ho, kabhi dono nahi — isliye a ek hai, b do hai, aur c-star log base two of one hai, jo zero hai.',
      },
      {
        q: 'How do you count the inversions in an array in better than O(n^2), and why does the merge step get the count for free?',
        qHi: 'Aap ek array mein inversions ko O(n^2) se behtar mein kaise ginte ho, aur merge step count ko muft mein kaise paata hai?',
        a: 'An inversion is a pair of indices i less than j where the earlier element is larger than the later one, so the count of inversions measures how far the array is from sorted — zero for a sorted array, n choose two for a fully reversed one. The brute force checks every pair, which is quadratic. The better approach is to piggy-back on merge sort. Merge sort already recursively sorts the left half and the right half and then merges them, and its recurrence is two T of n over two plus linear, which is n log n. The observation is that inversions come in three kinds: both endpoints in the left half, both in the right half, or one in each. The recursive calls on the two halves count the first two kinds. The merge step counts the third kind, and it can do so without any extra passes. During the merge you are walking a pointer through each sorted half and repeatedly taking the smaller front element. Whenever the front of the right half is smaller than the front of the left half, you take the right element — and at that moment, every element still remaining in the left half is also larger than that right element, because the left half is sorted. So instead of counting one inversion, you add the number of elements left in the left half, which is mid minus the left pointer, in a single step. Summing those contributions across the whole merge gives all the cross inversions for that level. Because this piggy-backs exactly on the merge sort structure and only adds a constant amount of work per merge step, the total complexity stays n log n. The one bug to avoid is incrementing the count by one instead of by the number of remaining left elements — that undercounts every time the right element jumps past more than one left element.',
        aHi: 'Ek inversion indices i less than j ki ek jodi hai jahaan pehla element baad waale se bada hai, isliye inversions ki count maapti hai ki array sorted se kitna door hai — ek sorted array ke liye zero, ek poori tarah reversed ke liye n choose two. Brute force har jodi check karta hai, jo quadratic hai. Behtar approach merge sort par sawaar hona hai. Merge sort pehle se recursively left half aur right half sort karta hai aur phir unhe merge karta hai, aur iska recurrence two T of n over two plus linear hai, jo n log n hai. Avlokan ye hai ki inversions teen tarah ke hote hain: dono endpoints left half mein, dono right half mein, ya har mein ek. Do aadhon par recursive calls pehle do tarah ginte hain. Merge step teesra tarah ginta hai, aur ye bina kisi atirikt pass ke aisa kar sakta hai. Merge ke dauraan aap har sorted half mein ek pointer chala rahe ho aur baar-baar chhota front element le rahe ho. Jab bhi right half ka front left half ke front se chhota hai, aap right element lete ho — aur us pal, left half mein abhi bhi baaki har element bhi us right element se bada hai, kyunki left half sorted hai. Toh ek inversion ginne ke bajaye, aap left half mein bache elements ki tadaad jodte ho, jo mid minus left pointer hai, ek akele step mein.',
      },
    ],

    exercises: [
      {
        task: 'For each recurrence, state a, b, c* = log_b(a), and the Master Theorem case and answer: (1) T(n)=2T(n/2)+n, (2) T(n)=T(n/2)+1, (3) T(n)=4T(n/2)+n, (4) T(n)=2T(n/2)+n^2, (5) T(n)=3T(n/2)+n.',
        taskHi: 'Har recurrence ke liye, a, b, c* = log_b(a), aur Master Theorem case aur jawaab batao: (1) T(n)=2T(n/2)+n, (2) T(n)=T(n/2)+1, (3) T(n)=4T(n/2)+n, (4) T(n)=2T(n/2)+n^2, (5) T(n)=3T(n/2)+n.',
        hint: '(1) c*=1, f=n, Case 2 -> O(n log n). (2) c*=0, f=1, Case 2 -> O(log n). (3) c*=2, f=n, Case 1 -> O(n^2). (4) c*=1, f=n^2, Case 3 -> O(n^2). (5) c*=log2(3)~1.585, f=n, Case 1 -> O(n^1.585).',
        hintHi: '(1) c*=1, f=n, Case 2 -> O(n log n). (2) c*=0, f=1, Case 2 -> O(log n). (3) c*=2, f=n, Case 1 -> O(n^2). (4) c*=1, f=n^2, Case 3 -> O(n^2). (5) c*=log2(3)~1.585, f=n, Case 1 -> O(n^1.585).',
      },
      {
        task: 'Implement countInversions with the merge-based method. Verify [2,4,1,3,5] -> 3, [5,4,3,2,1] -> 10, [1,2,3,4,5] -> 0. Then change "inv += mid - i" to "inv++" and show it undercounts on [3,2,1] (should be 3, becomes 2).',
        taskHi: 'countInversions ko merge-based method se implement karo. Verify karo [2,4,1,3,5] -> 3, [5,4,3,2,1] -> 10, [1,2,3,4,5] -> 0. Phir "inv += mid - i" ko "inv++" mein badlo aur dikhao ki [3,2,1] par ye kam ginta hai (3 hona chahiye, 2 ban jaata hai).',
        hint: 'On [3,2,1], the split is [3] and [2,1]. Sorting [2,1] finds 1 inversion. Merging [3] with [1,2]: 1 < 3 (inv += 1), 2 < 3 (inv += 1) -> 2 more, total 3. With inv++ the merge only adds 1 per element taken from the right, missing that 3 beats both.',
        hintHi: '[3,2,1] par, split [3] aur [2,1] hai. [2,1] sort karne se 1 inversion milta hai. [3] ko [1,2] ke saath merge karna: 1 < 3 (inv += 1), 2 < 3 (inv += 1) -> 2 aur, kul 3. inv++ ke saath merge right se liye har element par sirf 1 jodta hai.',
      },
      {
        task: 'Implement maxSubarray by divide and conquer (linear crossing scan). Verify [-2,1,-3,4,-1,2,1,-5,4] -> 6, [1] -> 1, [-3,-1,-2] -> -1. Then state its recurrence and confirm via the Master Theorem that it is O(n log n), and note that Kadane does it in O(n).',
        taskHi: 'maxSubarray ko divide and conquer se implement karo (linear crossing scan). Verify karo [-2,1,-3,4,-1,2,1,-5,4] -> 6, [1] -> 1, [-3,-1,-2] -> -1. Phir iska recurrence batao aur Master Theorem se confirm karo ki ye O(n log n) hai, aur note karo ki Kadane ise O(n) mein karta hai.',
        hint: 'The recurrence is T(n) = 2T(n/2) + O(n): two halves, plus a linear scan outward from the midpoint for the best crossing sum. c* = 1, f = n, Case 2 -> O(n log n).',
        hintHi: 'Recurrence T(n) = 2T(n/2) + O(n) hai: do aadhe, plus midpoint se baahar ek linear scan best crossing sum ke liye. c* = 1, f = n, Case 2 -> O(n log n).',
      },
    ],

    keyTakeaways: [
      '"Splits in half and recurses" does NOT imply O(n log n). The complexity depends entirely on f(n) — the per-level work to divide and combine.',
      'Master Theorem: for T(n) = a*T(n/b) + f(n), compute c* = log_b(a) and compare f(n) to n^c*. Slower -> O(n^c*); equal -> O(n^c* log n); faster -> O(f(n)).',
      'Merge sort: 2T(n/2) + O(n), c*=1, f=n -> Case 2 -> O(n log n). Binary search: 1T(n/2) + O(1), c*=0, f=1 -> Case 2 -> O(log n). The only difference is a.',
      'The theorem needs a T(n/b) shape with b > 1 (constant-factor shrink). T(n) = T(n-1) + O(n) is a constant-amount shrink — solve it by summation, giving O(n^2).',
      'Count inversions in O(n log n) by piggy-backing on merge sort: when a[j] merges ahead of a[i], add mid - i (all remaining left elements beat a[j]).',
      'Maximum subarray by D&C is O(n log n) with a linear crossing scan; Kadane (Module 11) does it in O(n). D&C is the paradigm demo and a common interview follow-up.',
      'Case 3 needs f(n) polynomially (not just logarithmically) larger than n^c*, plus a regularity check. Recurrences like 2T(n/2) + n/log n fall in a gap the theorem does not cover.',
    ],
    keyTakeawaysHi: [
      '"Aadha baantta hai aur recurse karta hai" ka matlab O(n log n) NAHI hai. Complexity poori tarah f(n) par nirbhar karti hai — divide aur combine karne ka prati-level kaam.',
      'Master Theorem: T(n) = a*T(n/b) + f(n) ke liye, c* = log_b(a) compute karo aur f(n) ko n^c* se compare karo. Dheeme -> O(n^c*); barabar -> O(n^c* log n); tez -> O(f(n)).',
      'Merge sort: 2T(n/2) + O(n), c*=1, f=n -> Case 2 -> O(n log n). Binary search: 1T(n/2) + O(1), c*=0, f=1 -> Case 2 -> O(log n). Ekmatra antar a hai.',
      'Theorem ko b > 1 waala T(n/b) shape chahiye (constant-factor sikudan). T(n) = T(n-1) + O(n) ek constant-maatra sikudan hai — ise yog se solve karo, O(n^2) dete hue.',
      'Merge sort par sawaar hokar O(n log n) mein inversions gino: jab a[j] a[i] se aage merge hota hai, mid - i jodo (sab baaki left elements a[j] ko haraate hain).',
      'D&C se maximum subarray ek linear crossing scan ke saath O(n log n) hai; Kadane (Module 11) ise O(n) mein karta hai. D&C paradigm demo aur ek aam interview follow-up hai.',
      'Case 3 ko f(n) ko n^c* se polynomially (sirf logarithmically nahi) bada chahiye, plus ek regularity check. 2T(n/2) + n/log n jaise recurrences ek gap mein girte hain jo theorem cover nahi karta.',
    ],
  },
];
