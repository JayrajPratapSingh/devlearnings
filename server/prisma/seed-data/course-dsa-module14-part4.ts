/**
 * DSA Complete Course — Module 14: Pro-Level Patterns & Interview Strategy,
 * lesson 4 (final lesson of Module 14 and of the DSA Complete Course).
 *
 * Optimising a working solution: the systematic moves that take a correct-but-
 * slow brute force down to the target complexity, and a full worked end-to-end
 * example that applies the whole course. Builds on every module. Broken example:
 * having a correct O(n^2) solution and staring at it with no idea how to make it
 * faster, treating "optimise" as a flash of insight rather than a checklist.
 * Fixed with an ordered list of optimisation moves — (1) remove redundant
 * recomputation with memoisation, (2) replace a repeated scan with a running
 * quantity, (3) replace a linear lookup with a hash map or a heap, (4) replace
 * a pairwise comparison with sorting + two pointers or binary search, (5)
 * replace a full recompute per query with a precomputed structure (prefix sums,
 * segment tree), (6) find a mathematical shortcut — applied in order to the
 * brute force until the complexity budget is met. The lesson closes with one
 * problem taken from raw statement to optimal solution using the whole method.
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

export const DSA_MODULE_14_PART4: CourseLesson[] = [
  {
    slug: 'optimising-a-working-solution-worked-example',
    title: 'Optimising a Working Solution: The Checklist and a Worked Example',
    titleHi: 'Ek Working Solution Optimise Karna: Checklist Aur Ek Worked Example',
    description: 'Having a correct O(n squared) brute force and then just staring at it, hoping optimisation arrives as a sudden insight. Without a systematic set of moves to try, you either freeze or randomly rewrite code, and the target complexity stays out of reach.',
    descriptionHi: 'Ek sahi O(n varg) brute force hona aur phir bas ise ghoorna, ummeed karte hue ki optimisation ek achaanak insight ki tarah aaye. Try karne ke moves ke ek systematic set ke bina, aap ya toh freeze karte ho ya randomly code rewrite karte ho, aur target complexity pahunch se bahar rehti hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 4,

    analogy: {
      en: '**Speeding up a slow kitchen by working through a fixed list of bottlenecks, not by "trying harder".** A professional does not just cook faster. They look at where time is actually being lost and apply a known fix to each: things being chopped fresh every order that could be prepped once in the morning (precompute); the same walk to the pantry made twenty times a shift that could be one trip with a tray (batch the repeated work); hunting through an unsorted shelf for an ingredient that could be in a labelled bin (replace a linear search with direct lookup); two cooks bumping into each other because the layout forces it (reorganise the data flow). Each fix is a specific, repeatable intervention matched to a specific kind of waste. Optimising an algorithm is the same discipline: you do not "think harder" about the O(n squared) solution, you run down a list — is there recomputation to cache, a repeated scan to replace with a running total, a linear lookup to turn into a hash map, a pairwise comparison to replace with sorting — and apply whichever move removes the bottleneck the complexity analysis points at.',
      hi: '**Ek slow kitchen ko bottlenecks ki ek fixed list ke through kaam karke tez karna, "zyaada koshish" karke nahi.** Ek professional bas tezi se cook nahi karta. Wo dekhte hain kahaan samay asal mein kho raha hai aur har ek par ek known fix lagaate hain: cheezein jo har order fresh chopped hoti hain jo subah ek baar prepped ho sakti thin (precompute); pantry tak wahi walk ek shift mein bees baar kiya jo ek trip ek tray ke saath ho sakta tha (repeated work batch karo); ek unsorted shelf ke through ek ingredient dhoondhna jo ek labelled bin mein ho sakta tha (ek linear search ko direct lookup se badlo); do cooks ek doosre se takraate hain kyunki layout majboor karta hai (data flow reorganise karo). Har fix ek specific, dohraaye-jaane-yogya intervention hai ek specific kism ke waste se matched. Ek algorithm optimise karna wahi discipline hai: aap O(n varg) solution ke baare mein "zyaada mushkil se nahi sochte", aap ek list neeche chalte ho — kya cache karne ke liye recomputation hai, ek running total se badalne ke liye ek repeated scan, ek hash map mein badalne ke liye ek linear lookup, sorting se badalne ke liye ek pairwise comparison — aur jo bhi move bottleneck hataata hai jispar complexity analysis point karta hai use lagaate ho.',
    },

    simple: `**Start broken.** A correct brute force, and no plan to speed it up:

\`\`\`js
// "count pairs (i, j) with i < j and nums[i] + nums[j] === target"
function countPairsBrute(nums, target) {
  let count = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) count++;
  return count;
}
// O(n^2). n = 10^5 -> 10^10 -> too slow. Now what? *stares*
\`\`\`

**The fix: run the optimisation checklist, in order**

\`\`\`
1. REDUNDANT RECOMPUTATION -> memoise / cache
   Does the code solve the same subproblem more than once? Add a memo (top-down
   DP) or a table (bottom-up). Turns exponential into polynomial.

2. REPEATED SCAN -> running quantity
   Does an inner loop rescan a range to compute a sum / min / max / count that
   changes by O(1) as the outer loop advances? Maintain it incrementally.
   Turns O(n^2) into O(n).  (Kadane, sliding window, prefix balance.)

3. LINEAR LOOKUP -> hash map / set / heap
   Does the code scan a list to check membership, find a value, or find the
   min/max? A hash map makes membership/lookup O(1); a heap makes
   repeated-min O(log n).  Turns O(n^2) into O(n) or O(n log n).

4. PAIRWISE COMPARISON -> sort + two pointers / binary search
   Does the code compare every pair? Sorting first (O(n log n)) often lets a
   two-pointer sweep or a binary search replace the inner loop.
   Turns O(n^2) into O(n log n).

5. RECOMPUTE PER QUERY -> precomputed structure
   Are there many queries, each re-scanning the data? Precompute prefix sums
   (range sum in O(1)), a sparse table (range min in O(1)), or a segment /
   Fenwick tree (range query + update in O(log n)).

6. MATHEMATICAL SHORTCUT
   Is there a closed form? A combinatorial identity, a formula for the sum, a
   parity/modular argument, matrix exponentiation for a linear recurrence
   (O(log n) instead of O(n))?
\`\`\`

**Applied to the pair-count problem: move 3 (hash map)**

\`\`\`js
function countPairs(nums, target) {
  const seen = new Map();           // value -> how many times seen so far
  let count = 0;
  for (const x of nums) {
    count += seen.get(target - x) || 0;   // each earlier 'target - x' forms a pair with x
    seen.set(x, (seen.get(x) || 0) + 1);
  }
  return count;
}
\`\`\`

\`\`\`ts
function countPairs(nums: number[], target: number): number {
  const seen = new Map<number, number>();
  let count = 0;
  for (const x of nums) {
    count += seen.get(target - x) ?? 0;
    seen.set(x, (seen.get(x) ?? 0) + 1);
  }
  return count;
}
\`\`\`

The inner loop "scan the rest of the array for a matching partner" became "ask the hash map how many matching partners I have already seen" — O(1) instead of O(n). Total: O(n).`,

    simpleHi: `**Toote hue se shuru.** Ek sahi brute force, aur ise tez karne ka koi plan nahi:

\`\`\`js
// "pairs (i, j) gino jismein i < j aur nums[i] + nums[j] === target"
function countPairsBrute(nums, target) {
  let count = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) count++;
  return count;
}
// O(n^2). n = 10^5 -> 10^10 -> bahut slow. Ab kya? *ghoorta*
\`\`\`

**Fix: optimisation checklist chalao, order mein**

\`\`\`
1. REDUNDANT RECOMPUTATION -> memoise / cache
   Kya code wahi subproblem ek baar se zyaada solve karta hai? Ek memo (top-down
   DP) ya ek table (bottom-up) add karo. Exponential ko polynomial banaata hai.

2. REPEATED SCAN -> running quantity
   Kya ek inner loop ek range ko dobara scan karta hai ek sum / min / max / count
   compute karne ke liye jo outer loop badhne par O(1) se badalta hai? Ise
   incrementally maintain karo. O(n^2) ko O(n) banaata hai.

3. LINEAR LOOKUP -> hash map / set / heap
   Kya code ek list scan karta hai membership check karne, ek value dhoondhne, ya
   min/max dhoondhne ke liye? Ek hash map membership/lookup ko O(1) banaata hai;
   ek heap repeated-min ko O(log n) banaata hai. O(n^2) ko O(n) ya O(n log n).

4. PAIRWISE COMPARISON -> sort + two pointers / binary search
   Kya code har pair compare karta hai? Pehle sorting (O(n log n)) aksar ek
   two-pointer sweep ya ek binary search ko inner loop replace karne deta hai.
   O(n^2) ko O(n log n).

5. RECOMPUTE PER QUERY -> precomputed structure
   Kya bahut queries hain, har ek data dobara scan karti? Prefix sums (range sum
   O(1) mein), ek sparse table (range min O(1) mein), ya ek segment / Fenwick
   tree (range query + update O(log n) mein) precompute karo.

6. MATHEMATICAL SHORTCUT
   Kya ek closed form hai? Ek combinatorial identity, sum ke liye ek formula, ek
   parity/modular argument, ek linear recurrence ke liye matrix exponentiation
   (O(n) ke bajaye O(log n))?
\`\`\`

**Pair-count problem par lagaya: move 3 (hash map)**

\`\`\`js
function countPairs(nums, target) {
  const seen = new Map();           // value -> ab tak kitni baar dekha
  let count = 0;
  for (const x of nums) {
    count += seen.get(target - x) || 0;   // har earlier 'target - x' x ke saath ek pair banaata hai
    seen.set(x, (seen.get(x) || 0) + 1);
  }
  return count;
}
\`\`\`

\`\`\`ts
function countPairs(nums: number[], target: number): number {
  const seen = new Map<number, number>();
  let count = 0;
  for (const x of nums) {
    count += seen.get(target - x) ?? 0;
    seen.set(x, (seen.get(x) ?? 0) + 1);
  }
  return count;
}
\`\`\`

Inner loop "matching partner ke liye baaki array scan karo" "hash map se poocho maine kitne matching partners pehle se dekhe" ban gaya — O(n) ke bajaye O(1). Total: O(n).`,

    content: `## A full worked example, statement to optimal

\`\`\`
PROBLEM: "You are given an array of house prices along a street. A thief robs a
contiguous stretch of houses. Robbing a stretch [i, j] yields the sum of prices
in it, MINUS a fixed alarm cost C (charged once per stretch, regardless of
length). Return the maximum profit, or 0 if every stretch loses money."

PHASE 1 CLARIFY: prices can be negative? -> yes. C >= 0. Empty stretch allowed
  (profit 0)? -> yes, that is the "rob nothing" option. n up to 2 x 10^5.

PHASE 2 EXAMPLE: prices = [3, -2, 5, -1, 4], C = 3.
  Best stretch: [3, -2, 5, -1, 4] sums to 9, minus 3 = 6. Check smaller ones:
  [5, -1, 4] = 8 - 3 = 5. [3, -2, 5] = 6 - 3 = 3. So the answer is 6.

PHASE 3 BRUTE FORCE: try every [i, j], sum it, subtract C, take the max.
  Two nested loops for i, j plus an inner sum -> O(n^3). Or precompute prefix
  sums for O(n^2). With n = 2e5, O(n^2) = 4e10 -> too slow.

PHASE 4 OPTIMISE:
  Feature read: "maximum sum over a contiguous stretch" -> Kadane's algorithm
  (Module 2 / Module 11 lesson 2), which is the "repeated scan -> running
  quantity" move (checklist item 2).
  The alarm cost C is subtracted once per non-empty stretch, so the profit of a
  non-empty stretch is (its sum) - C. Maximising that is: maximise the sum with
  Kadane, then subtract C, then compare against 0 (rob nothing).

  dp / running: best = max subarray sum ending at i
      = max(prices[i], best_prev + prices[i])
  track the global max of 'best'.

PHASE 5 CODE:
\`\`\`

\`\`\`js
function maxRobberyProfit(prices, C) {
  let bestEndingHere = -Infinity;
  let bestAnywhere = -Infinity;
  for (const p of prices) {
    bestEndingHere = Math.max(p, bestEndingHere + p);   // Kadane running quantity
    bestAnywhere = Math.max(bestAnywhere, bestEndingHere);
  }
  const bestNonEmpty = bestAnywhere - C;                // pay the alarm once
  return Math.max(0, bestNonEmpty);                     // "rob nothing" is always an option
}
\`\`\`

\`\`\`ts
function maxRobberyProfit(prices: number[], C: number): number {
  let bestEndingHere = -Infinity;
  let bestAnywhere = -Infinity;
  for (const p of prices) {
    bestEndingHere = Math.max(p, bestEndingHere + p);
    bestAnywhere = Math.max(bestAnywhere, bestEndingHere);
  }
  return Math.max(0, bestAnywhere - C);
}
\`\`\`

\`\`\`
PHASE 6 TEST: prices = [3,-2,5,-1,4], C = 3.
  p=3:  bestEndingHere = max(3, -inf) = 3.  bestAnywhere = 3.
  p=-2: bestEndingHere = max(-2, 1) = 1.    bestAnywhere = 3.
  p=5:  bestEndingHere = max(5, 6) = 6.     bestAnywhere = 6.
  p=-1: bestEndingHere = max(-1, 5) = 5.    bestAnywhere = 6.
  p=4:  bestEndingHere = max(4, 9) = 9.     bestAnywhere = 9.
  return max(0, 9 - 3) = 6.  Correct.
  Edge: all negative prices -> bestAnywhere < 0, minus C still < 0, return 0. Correct.

PHASE 7 ANALYSE: one pass, O(1) work per element -> O(n) time, O(1) space.
  The alarm cost turned out to be a constant offset, not a complication.
\`\`\`

## The optimisation moves mapped to their modules

\`\`\`
1. memoise / tabulate         -> Module 11 (DP)
2. running quantity           -> Module 2 (Kadane, prefix balance), Module 12 lesson 4
3. hash map / set / heap      -> Module 3 (hashing), Module 8 (heap)
4. sort + two pointers / bsearch -> Module 2, Module 10
5. precomputed structure      -> prefix sums (Module 2), segment/Fenwick tree, Module 13 (i & -i)
6. math shortcut              -> Module 1 (analysis), matrix exponentiation, combinatorics
\`\`\`

## When you have applied every move and it is still too slow

\`\`\`
- Re-read the constraints. Maybe O(n sqrt(n)) or O(n log^2 n) is acceptable and
  you were aiming too low.
- Consider whether the problem is NP-hard (subset/partition/tour with large n
  and no structure). If so, it wants an approximation or a heuristic, and the
  interviewer expects you to say so.
- Look for a different STATE. Many DP speedups come from realising the state can
  be smaller (drop a dimension) or the transition can be made O(1) with a
  running min / monotonic deque / convex-hull trick.
\`\`\`

## The course in one paragraph

Every technique in this course is a specific answer to "the brute force does
redundant work of a specific kind". Nested loops that recompute overlapping
subproblems become DP. Inner loops that rescan a range become a running
quantity or a monotonic structure. Linear membership checks become hash sets.
Pairwise comparisons become a sort followed by two pointers or binary search.
Repeated graph searches over a growing set of connections become union-find.
"Most important next, repeatedly" becomes a heap. The skill is not memorising
the techniques; it is looking at a slow correct solution, naming the kind of
waste, and reaching for the matching move.`,

    contentHi: `## Ek poora worked example, statement se optimal

\`\`\`
PROBLEM: "Aapko ek street ke saath house prices ka ek array diya jaata hai. Ek
thief houses ka ek contiguous stretch robs karta hai. Ek stretch [i, j] robs
karna ismein prices ka sum yield karta hai, MINUS ek fixed alarm cost C (prati
stretch ek baar charge kiya, length se bekhabar). Maximum profit return karo, ya
0 agar har stretch paisa khota hai."

PHASE 1 CLARIFY: prices negative ho sakti hain? -> haan. C >= 0. Empty stretch
  allowed (profit 0)? -> haan, wo "kuch nahi robs karo" option hai. n up to 2 x 10^5.

PHASE 2 EXAMPLE: prices = [3, -2, 5, -1, 4], C = 3.
  Best stretch: [3, -2, 5, -1, 4] 9 tak sum, minus 3 = 6. Chhote check karo:
  [5, -1, 4] = 8 - 3 = 5. [3, -2, 5] = 6 - 3 = 3. Toh answer 6 hai.

PHASE 3 BRUTE FORCE: har [i, j] try karo, ise sum karo, C subtract karo, max lo.
  i, j ke liye do nested loops plus ek inner sum -> O(n^3). Ya prefix sums
  precompute karke O(n^2). n = 2e5 ke saath, O(n^2) = 4e10 -> bahut slow.

PHASE 4 OPTIMISE:
  Feature read: "ek contiguous stretch par maximum sum" -> Kadane's algorithm
  (Module 2 / Module 11 lesson 2), jo "repeated scan -> running quantity" move
  (checklist item 2) hai.
  Alarm cost C prati non-empty stretch ek baar subtract hota hai, isliye ek
  non-empty stretch ka profit (iska sum) - C hai. Ise maximise karna: Kadane se
  sum maximise karo, phir C subtract karo, phir 0 (kuch nahi robs karo) ke against compare.

  dp / running: best = i par khatam hone waala max subarray sum
      = max(prices[i], best_prev + prices[i])
  'best' ka global max track karo.

PHASE 5 CODE: (upar English content mein)
PHASE 6 TEST: (upar English content mein trace)
PHASE 7 ANALYSE: ek pass, prati element O(1) kaam -> O(n) time, O(1) space.
  Alarm cost ek constant offset nikla, ek complication nahi.
\`\`\`

## Optimisation moves unke modules se mapped

\`\`\`
1. memoise / tabulate         -> Module 11 (DP)
2. running quantity           -> Module 2 (Kadane, prefix balance), Module 12 lesson 4
3. hash map / set / heap      -> Module 3 (hashing), Module 8 (heap)
4. sort + two pointers / bsearch -> Module 2, Module 10
5. precomputed structure      -> prefix sums (Module 2), segment/Fenwick tree, Module 13 (i & -i)
6. math shortcut              -> Module 1 (analysis), matrix exponentiation, combinatorics
\`\`\`

## Jab aapne har move lagaya aur ye abhi bhi bahut slow hai

\`\`\`
- Constraints dobara padho. Shayad O(n sqrt(n)) ya O(n log^2 n) acceptable hai aur
  aap bahut neeche aim kar rahe the.
- Vichaar karo kya problem NP-hard hai (bade n aur koi structure na waala
  subset/partition/tour). Agar haan, ye ek approximation ya ek heuristic chahti
  hai, aur interviewer ummeed karta hai ki aap kaho.
- Ek alag STATE dhoondho. Kayi DP speedups ye realise karne se aate hain ki state
  chhota ho sakta hai (ek dimension drop karo) ya transition ek running min /
  monotonic deque / convex-hull trick se O(1) banaya jaa sakta hai.
\`\`\`

## Course ek paragraph mein

Is course mein har technique "brute force ek specific kism ka redundant kaam
karta hai" ka ek specific jawaab hai. Nested loops jo overlapping subproblems
recompute karte hain DP bante hain. Inner loops jo ek range dobara scan karte
hain ek running quantity ya ek monotonic structure bante hain. Linear membership
checks hash sets bante hain. Pairwise comparisons ek sort ke baad two pointers ya
binary search bante hain. Connections ke ek badhte set par repeated graph
searches union-find bante hain. "Most important next, repeatedly" ek heap banta
hai. Skill techniques yaad karna nahi hai; ye ek slow sahi solution dekhna, waste
ki kism name karna, aur matching move ki taraf pahunchna hai.`,

    examples: [
      {
        title: 'Checklist move 2: repeated scan -> running quantity (Kadane)',
        titleHi: 'Checklist move 2: repeated scan -> running quantity (Kadane)',
        code: `bestEndingHere = Math.max(p, bestEndingHere + p);   // was: rescan every subarray`,
        codeJs: `// O(n^2): for each i, for each j >= i, sum nums[i..j], track the max
// O(n):   maintain "best sum ending here" incrementally
function maxSubarray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
console.log(maxSubarray([-2,1,-3,4,-1,2,1,-5,4])); // 6  ([4,-1,2,1])`,
        codeTs: `function maxSubarray(nums: number[]): number {
  let cur = nums[0]!, best = nums[0]!;
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i]!, cur + nums[i]!);
    best = Math.max(best, cur);
  }
  return best;
}`,
        outputJs: `6`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The O(n^2) version rescans a subarray to compute each sum. The O(n) version notices that "best sum ending at i" changes by O(1) from "best sum ending at i-1", so it maintains it instead of recomputing.',
        explainHi: 'O(n^2) version har sum compute karne ke liye ek subarray dobara scan karta hai. O(n) version notice karta hai ki "i par khatam hone waala best sum" "i-1 par khatam hone waala best sum" se O(1) se badalta hai, isliye ye ise recompute karne ke bajaye maintain karta hai.',
      },
      {
        title: 'Checklist move 4: pairwise -> sort + two pointers (3Sum)',
        titleHi: 'Checklist move 4: pairwise -> sort + two pointers (3Sum)',
        code: `nums.sort(); for each i: two-pointer sweep on nums[i+1..]  // was: 3 nested loops`,
        codeJs: `function threeSum(nums) {
  nums = [...nums].sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;      // skip duplicate anchors
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const s = nums[i] + nums[lo] + nums[hi];
      if (s === 0) {
        res.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++; hi--;
      } else if (s < 0) lo++;
      else hi--;
    }
  }
  return res;
}
console.log(threeSum([-1,0,1,2,-1,-4])); // [[-1,-1,2],[-1,0,1]]`,
        codeTs: `function threeSum(nums: number[]): number[][] {
  nums = [...nums].sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const s = nums[i]! + nums[lo]! + nums[hi]!;
      if (s === 0) { res.push([nums[i]!, nums[lo]!, nums[hi]!]); lo++; hi--; }
      else if (s < 0) lo++; else hi--;
    }
  }
  return res;
}`,
        outputJs: `[[-1, -1, 2], [-1, 0, 1]]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Three nested loops are O(n^3). Sorting first (O(n log n)) lets a two-pointer sweep replace the inner two loops: fix one element, then move lo/hi inward based on the running sum. O(n^2) overall.',
        explainHi: 'Teen nested loops O(n^3) hain. Pehle sorting (O(n log n)) ek two-pointer sweep ko inner do loops replace karne deta hai: ek element fix karo, phir running sum ke aadhaar par lo/hi ko andar move karo. Kul O(n^2).',
      },
      {
        title: 'Checklist move 5: recompute per query -> prefix sums',
        titleHi: 'Checklist move 5: recompute per query -> prefix sums',
        code: `prefix[j+1] - prefix[i]   // range sum in O(1), was O(n) per query`,
        codeJs: `class RangeSum {
  constructor(nums) {
    this.prefix = [0];
    for (const x of nums) this.prefix.push(this.prefix[this.prefix.length - 1] + x);
  }
  query(i, j) { return this.prefix[j + 1] - this.prefix[i]; }   // sum of nums[i..j]
}
const rs = new RangeSum([3, 1, 4, 1, 5, 9]);
console.log(rs.query(1, 3)); // 6  (1 + 4 + 1)
console.log(rs.query(0, 5)); // 23`,
        codeTs: `class RangeSum {
  private prefix: number[] = [0];
  constructor(nums: number[]) {
    for (const x of nums) this.prefix.push(this.prefix[this.prefix.length - 1]! + x);
  }
  query(i: number, j: number): number { return this.prefix[j + 1]! - this.prefix[i]!; }
}`,
        outputJs: `6
23`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Answering q range-sum queries by scanning each range is O(q * n). One O(n) precompute of prefix sums makes every subsequent query O(1), for O(n + q) total. (For range queries WITH updates, use a Fenwick or segment tree.)',
        explainHi: 'q range-sum queries ka jawaab har range scan karke O(q * n) hai. Prefix sums ka ek O(n) precompute har agli query ko O(1) banaata hai, kul O(n + q) ke liye. (Updates WAALI range queries ke liye, ek Fenwick ya segment tree istemal karo.)',
      },
    ],

    mistakes: [
      {
        wrong: `// treating "optimise" as needing a flash of insight, and freezing when it
// does not come`,
        right: `// run the checklist in order: recomputation -> memoise; repeated scan ->
// running quantity; linear lookup -> hash/heap; pairwise -> sort + pointers;
// per-query rescan -> precompute; then look for a math shortcut.`,
        why: 'Optimisation is a small set of repeatable moves matched to kinds of waste, not inspiration. The complexity analysis of the brute force tells you which move to apply.',
        whyHi: 'Optimisation waste ki kismon se matched dohraaye-jaane-yogya moves ka ek chhota set hai, prerna nahi. Brute force ka complexity analysis aapko batata hai kaunsa move lagaana hai.',
      },
      {
        wrong: `// optimising the wrong part — shaving a constant off an O(n) loop when the
// O(n^2) inner loop is the actual bottleneck`,
        right: `// find the DOMINANT term first (the nested loop, the per-query rescan), and
// attack that. A 2x speedup on the non-dominant part changes nothing.`,
        why: 'Total complexity is dominated by the largest term. Optimising anything else is invisible in the asymptotic analysis and usually a waste of interview time.',
        whyHi: 'Total complexity sabse badi term se haavi hoti hai. Kuch aur optimise karna asymptotic analysis mein invisible hai aur aksar interview time ki barbaadi hai.',
      },
      {
        wrong: `// applying a heavy structure (segment tree) when a simple one (prefix sum)
// suffices because there are no updates`,
        right: `// match the structure to the operations: no updates + range sum -> prefix
// sum; updates + range sum -> Fenwick; updates + range min -> segment tree.`,
        why: 'A prefix-sum array is O(n) build and O(1) query with almost no code. A segment tree is far more code and more bug surface; use it only when updates rule out the simpler option.',
        whyHi: 'Ek prefix-sum array O(n) build aur O(1) query hai lagbhag koi code nahi. Ek segment tree kaafi zyaada code aur zyaada bug surface hai; ise sirf tab istemal karo jab updates simpler option rule out karte hain.',
      },
    ],

    realWorld: [
      {
        en: '**Performance work in production follows the same order** — profile to find the dominant cost, then apply a known fix (cache, batch, index, precompute) to that specific hot spot, not a scattershot rewrite.',
        hi: '**Production mein performance work wahi order follow karta hai** — dominant cost dhoondhne ke liye profile karo, phir us specific hot spot par ek known fix (cache, batch, index, precompute) lagao, ek scattershot rewrite nahi.',
      },
      {
        en: '**Database query tuning is this checklist** — a full scan becomes an index lookup (move 3), a repeated subquery becomes a materialised view or CTE (move 1/5), a nested-loop join becomes a hash join (move 3/4).',
        hi: '**Database query tuning ye checklist hai** — ek full scan ek index lookup banta hai (move 3), ek repeated subquery ek materialised view ya CTE banta hai (move 1/5), ek nested-loop join ek hash join banta hai (move 3/4).',
      },
      {
        en: '**Caching layers, CDN edge computation, and precomputed aggregates** in real systems are all "recompute per request -> precomputed structure" (move 5) at architecture scale.',
        hi: '**Caching layers, CDN edge computation, aur precomputed aggregates** asli systems mein sab architecture scale par "prati request recompute -> precomputed structure" (move 5) hain.',
      },
    ],

    interviewQA: [
      {
        q: 'You have a correct O(n squared) solution and the constraint requires O(n log n). Walk through how you would find the optimisation systematically.',
        qHi: 'Aapke paas ek sahi O(n varg) solution hai aur constraint O(n log n) chahta hai. Samjhaao aap optimisation systematically kaise dhoondhoge.',
        a: 'I start by pinpointing exactly where the n squared comes from. It is almost always a nested loop, so I ask what the inner loop is doing on each pass of the outer loop. There are a few common answers, and each maps to a specific fix. If the inner loop is recomputing a value, a sum, a minimum, a count, over a range that only changes by a little as the outer loop advances one step, then I do not need to recompute it from scratch; I maintain it incrementally as a running quantity, and the inner loop disappears, taking the solution to linear. That is the Kadane and sliding-window pattern. If the inner loop is searching the array for a specific value or checking membership, I replace that linear search with a hash map or a hash set, which answers the same question in constant time, again collapsing the inner loop and giving linear time overall. If the inner loop is finding the minimum or maximum among a changing set of candidates, I use a heap, which gives me that in logarithmic time, for n log n overall. If the inner loop is comparing the current element against every other element to find a pair with some property, I sort the array first, which costs n log n, and then a two-pointer sweep or a binary search replaces the inner loop, so the total is n log n. If instead the problem has many queries and each one rescans the data, I precompute a structure once, prefix sums for range sums, a sparse table for range minimums, a Fenwick tree if there are also updates, so each query becomes constant or logarithmic. I try these in roughly that order, checking after each whether the resulting complexity meets the constraint. Usually one of them fits, and the trace I did to identify what the inner loop was doing tells me which one.',
        aHi: 'Main bilkul pinpoint karke shuru karta hoon ki n squared kahaan se aata hai. Ye lagbhag hamesha ek nested loop hai, isliye main poochta hoon ki inner loop outer loop ke har pass par kya kar raha hai. Kuch aam jawaab hain, aur har ek ek specific fix se map hota hai. Agar inner loop ek value recompute kar raha hai, ek sum, ek minimum, ek count, ek range par jo outer loop ke ek step aage badhne par sirf thoda badalti hai, toh mujhe ise shuru se recompute karne ki zaroorat nahi; main ise ek running quantity ki tarah incrementally maintain karta hoon, aur inner loop gaayab ho jaata hai, solution ko linear le jaate hue. Wo Kadane aur sliding-window pattern hai. Agar inner loop array ko ek specific value ke liye search kar raha hai ya membership check kar raha hai, main us linear search ko ek hash map ya hash set se replace karta hoon, jo wahi sawaal constant time mein jawaab deta hai. Agar inner loop candidates ke ek badalte set mein minimum ya maximum dhoond raha hai, main ek heap istemal karta hoon. Agar inner loop current element ko har doosre element ke against compare kar raha hai ek pair dhoondhne ke liye, main pehle array sort karta hoon, aur phir ek two-pointer sweep ya ek binary search inner loop replace karta hai. Agar problem mein bahut queries hain aur har ek data dobara scan karti hai, main ek baar ek structure precompute karta hoon. Main inhe lagbhag us order mein try karta hoon, har ke baad check karte hue ki resulting complexity constraint meet karti hai.',
      },
      {
        q: 'Summarise how the whole course fits together — what is the single idea behind all the techniques?',
        qHi: 'Sankshep mein batao poora course kaise saath fit hota hai — sab techniques ke peechhe ek akela idea kya hai?',
        a: 'The single idea is that every technique in the course is a specific, reusable fix for a specific kind of redundant work that a naive brute force does. Start from the observation that you can almost always write a correct but slow solution to an algorithm problem: enumerate every possibility and check each one. That brute force is slow for one of a handful of reasons, and each reason has a matching technique. If the brute force solves the same subproblem over and over because its recursion tree overlaps, the fix is to remember each subproblem\'s answer, which is dynamic programming, either top-down with a memo or bottom-up with a table. If the brute force has an inner loop that rescans a range to compute a quantity that barely changes as the outer loop moves, the fix is to maintain that quantity incrementally as a running value, which is the sliding window, Kadane, and prefix-balance family. If the brute force scans a list to test membership or find a value, the fix is a hash set or hash map for constant-time lookup. If it repeatedly needs the smallest or largest of a changing collection, the fix is a heap. If it compares every pair of elements, the fix is usually to sort first and then sweep with two pointers or search with binary search. If it re-explores a graph every time connections are added, the fix is union-find. If a subproblem is described by which elements of a small set have been used, the fix is a bitmask as the state. The data structures, trees, graphs, heaps, hash tables, are the supporting cast that make these fixes possible. So the skill the course builds is not memorising algorithms; it is the habit of writing the brute force, analysing exactly why it is slow, naming the kind of waste, and reaching for the technique that removes that specific waste.',
        aHi: 'Ek akela idea ye hai ki course mein har technique ek specific, dohraaye-jaane-yogya fix hai ek specific kism ke redundant kaam ke liye jo ek naive brute force karta hai. Is observation se shuru karo ki aap lagbhag hamesha ek algorithm problem ka ek sahi par slow solution likh sakte ho: har possibility enumerate karo aur har ek check karo. Wo brute force mutthi bhar kaaranon mein se ek se slow hai, aur har kaaran ka ek matching technique hai. Agar brute force wahi subproblem baar-baar solve karta hai kyunki iska recursion tree overlap karta hai, fix har subproblem ka jawaab yaad rakhna hai, jo dynamic programming hai. Agar brute force ka ek inner loop hai jo ek range dobara scan karta hai ek quantity compute karne ke liye jo outer loop ke move karne par mushkil se badalti hai, fix us quantity ko ek running value ki tarah incrementally maintain karna hai. Agar brute force ek list scan karta hai membership test karne ya ek value dhoondhne ke liye, fix ek hash set ya hash map hai. Agar ye baar-baar ek badalti collection ka sabse chhota ya bada chahta hai, fix ek heap hai. Agar ye har pair of elements compare karta hai, fix aksar pehle sort karna aur phir two pointers se sweep ya binary search se search karna hai. Toh course jo skill banaata hai wo algorithms yaad karna nahi hai; ye brute force likhne, thik-thik analyse karne ki aadat hai ki ye kyun slow hai, waste ki kism name karna, aur us technique ki taraf pahunchna jo us specific waste ko hataata hai.',
      },
    ],

    exercises: [
      {
        task: 'Take the O(n^2) pair-count brute force and apply move 4 (sort + two pointers) instead of move 3 (hash map). Compare the two: which is simpler, which is faster in practice, which handles duplicates more naturally.',
        taskHi: 'O(n^2) pair-count brute force lo aur move 3 (hash map) ke bajaye move 4 (sort + two pointers) lagao. Dono compare karo: kaunsa simpler hai, kaunsa practice mein tez hai, kaunsa duplicates ko zyaada naturally handle karta hai.',
        hint: 'Sort, then lo=0, hi=n-1; if sum < target lo++, if > target hi--, if == target count the pair(s) and move both. Watch duplicate handling: count runs of equal values.',
        hintHi: 'Sort karo, phir lo=0, hi=n-1; agar sum < target lo++, agar > target hi--, agar == target pair(s) gino aur dono move karo. Duplicate handling dekho: equal values ke runs gino.',
      },
      {
        task: 'Work the "maxRobberyProfit" example end to end yourself: write out phases 1-7 for prices = [-5, -1, -3] with C = 2 (expect 0) and prices = [2, -1, 2, -1, 2] with C = 1 (expect 3).',
        taskHi: '"maxRobberyProfit" example khud end to end work karo: prices = [-5, -1, -3] with C = 2 (0 expect karo) aur prices = [2, -1, 2, -1, 2] with C = 1 (3 expect karo) ke liye phases 1-7 likho.',
        hint: 'For [2,-1,2,-1,2]: Kadane gives max subarray sum 4 (the whole array), minus C = 1 -> 3. For all-negative, Kadane\'s best is negative, minus C still negative, so return 0.',
        hintHi: '[2,-1,2,-1,2] ke liye: Kadane max subarray sum 4 deta hai (poora array), minus C = 1 -> 3. All-negative ke liye, Kadane ka best negative hai, minus C abhi bhi negative, isliye 0 return karo.',
      },
      {
        task: 'Pick three problems you have solved before. For each, identify: the brute force and its complexity, which optimisation move you applied, and the final complexity. Confirm every one is an instance of a checklist move.',
        taskHi: 'Teen problems chuno jo aapne pehle solve ki. Har ek ke liye, pehchaano: brute force aur iski complexity, kaunsa optimisation move aapne lagaya, aur final complexity. Confirm karo har ek ek checklist move ka instance hai.',
        hint: 'If a problem does not fit any of the six moves cleanly, it may combine two (sort THEN binary search on the answer, or BFS THEN DP), or it may need a structure not in the list (trie, disjoint set on a grid).',
        hintHi: 'Agar ek problem chhe moves mein se kisi mein saaf fit nahi hoti, ye do combine kar sakti hai (sort PHIR answer par binary search, ya BFS PHIR DP), ya ise list mein na waali ek structure chahiye (trie, ek grid par disjoint set).',
      },
    ],

    keyTakeaways: [
      'Optimisation is a checklist of repeatable moves matched to kinds of waste, not a flash of insight. Identify where the dominant complexity term comes from, then apply the matching move.',
      'The moves, in rough order: (1) recomputation -> memoise/tabulate; (2) repeated scan -> running quantity; (3) linear lookup -> hash map/set/heap; (4) pairwise comparison -> sort + two pointers/binary search; (5) per-query rescan -> precomputed structure; (6) mathematical shortcut.',
      'Attack the DOMINANT term first. A speedup on a non-dominant part is invisible in the asymptotic analysis.',
      'Match the data structure to the operations: no updates + range sum -> prefix sum; updates + range sum -> Fenwick; updates + range min -> segment tree.',
      'The whole course: a brute force is slow for one of a few specific reasons, and each technique is the targeted fix for one reason. The skill is naming the kind of waste, not memorising algorithms.',
      'If every move is applied and it is still too slow: re-check the constraints (maybe O(n sqrt n) is allowed), consider NP-hardness (approximation), or look for a smaller DP state / an O(1) transition.',
    ],
    keyTakeawaysHi: [
      'Optimisation waste ki kismon se matched dohraaye-jaane-yogya moves ki ek checklist hai, ek flash of insight nahi. Pehchaano dominant complexity term kahaan se aata hai, phir matching move lagao.',
      'Moves, rough order mein: (1) recomputation -> memoise/tabulate; (2) repeated scan -> running quantity; (3) linear lookup -> hash map/set/heap; (4) pairwise comparison -> sort + two pointers/binary search; (5) per-query rescan -> precomputed structure; (6) mathematical shortcut.',
      'DOMINANT term ko pehle attack karo. Ek non-dominant part par ek speedup asymptotic analysis mein invisible hai.',
      'Data structure ko operations se match karo: no updates + range sum -> prefix sum; updates + range sum -> Fenwick; updates + range min -> segment tree.',
      'Poora course: ek brute force kuch specific kaaranon mein se ek se slow hai, aur har technique ek kaaran ke liye targeted fix hai. Skill waste ki kism name karna hai, algorithms yaad karna nahi.',
      'Agar har move lagaya aur ye abhi bhi bahut slow hai: constraints dobara check karo (shayad O(n sqrt n) allowed hai), NP-hardness vichaar karo (approximation), ya ek chhota DP state / ek O(1) transition dhoondho.',
    ],
  },
];
