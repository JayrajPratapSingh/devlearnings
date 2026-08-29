/**
 * DSA Complete Course — Module 14: Pro-Level Patterns & Interview Strategy,
 * lesson 2.
 *
 * Reading the constraints to budget your complexity: the size of the input tells
 * you which time complexities are acceptable, which in turn narrows the set of
 * techniques worth considering — often before you have any idea how to solve the
 * problem. Builds on this course's Module 1 (Big-O) and every technique module.
 * Broken example: designing an O(n^2) solution, coding it, and only discovering
 * at submission that n can be 10^6, so it times out — when a five-second glance
 * at the constraint would have ruled O(n^2) out immediately and pointed toward
 * O(n log n) or O(n). Fixed with a lookup table from input size to acceptable
 * complexity (n <= 12 -> exponential; n <= 500 -> O(n^3); n <= 5000 -> O(n^2);
 * n <= 10^6 -> O(n log n) or O(n); n <= 10^9 -> O(log n) or a formula) plus the
 * "~10^8 simple operations per second" rule of thumb for estimating.
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

export const DSA_MODULE_14_PART2: CourseLesson[] = [
  {
    slug: 'reading-constraints-to-budget-complexity',
    title: 'Reading Constraints: Budgeting Your Complexity',
    titleHi: 'Constraints Padhna: Apni Complexity Budget Karna',
    description: 'Designing and fully coding an O(n squared) solution, feeling good about it, and only finding out at submission that the constraint says n can be up to one million — so it needs 10^12 operations and times out. A single glance at "n <= 10^6" before writing anything would have told you O(n squared) was off the table.',
    descriptionHi: 'Ek O(n varg) solution design aur poori tarah code karna, iske baare mein achha mehsoos karna, aur sirf submission par pata chalna ki constraint kehta hai n ek million tak ho sakta hai — isliye ise 10^12 operations chahiye aur ye timeout hota hai. Kuch bhi likhne se pehle "n <= 10^6" par ek akeli nazar aapko bata deti ki O(n varg) table se bahar tha.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**Choosing a mode of transport by first checking the distance.** If someone asks you to get somewhere, the very first thing that determines your options is how far it is. Two hundred metres: walk. Five kilometres: bike or bus. Three hundred kilometres: train or car. Six thousand kilometres: fly, there is no other realistic option. You do not agonise over which bicycle to take before knowing the trip is intercontinental. The distance eliminates whole categories of transport instantly, and only then do you choose among the ones that remain. Input size does exactly this for algorithms. The constraint on n is the distance, and it eliminates whole categories of time complexity before you know anything about the actual problem. If n can be a million, any approach that would do a million times a million steps is off the table, full stop, and you only consider approaches that stay near a million times a small factor. If n is only twenty, an approach that tries all two-to-the-twenty possibilities is perfectly fine, and you should be looking for exactly that kind of exponential structure. Reading the constraint first is not a formality; it is the single fastest way to shrink the space of things worth thinking about.',
      hi: '**Pehle distance check karke transport ka ek mode chunna.** Agar koi aapse kahin pahunchne ko kehta hai, sabse pehli cheez jo aapke options determine karti hai wo ye hai ki ye kitni door hai. Do sau meter: chalo. Paanch kilometre: bike ya bus. Teen sau kilometre: train ya car. Chhe hazaar kilometre: udo, koi doosra realistic option nahi. Aap ye jaanne se pehle ki trip intercontinental hai kaunsi bicycle leni hai ispar agonise nahi karte. Distance turant poori transport categories eliminate karta hai, aur sirf tab aap bache hue mein se chunte ho. Input size algorithms ke liye bilkul ye karta hai. n par constraint distance hai, aur ye poori time complexity categories eliminate karta hai actual problem ke baare mein kuch jaanne se pehle. Agar n ek million ho sakta hai, koi bhi approach jo ek million guna ek million steps kare table se bahar hai, poora stop, aur aap sirf un approaches par vichaar karte ho jo ek million guna ek chhote factor ke paas rehte hain. Agar n sirf bees hai, ek approach jo sab do-ki-bees possibilities try karti hai poori tarah theek hai. Pehle constraint padhna ek formality nahi hai; ye sochne laayak cheezon ki space chhota karne ka sabse tez tarika hai.',
    },

    simple: `**Start broken.** Design first, check constraints last:

\`\`\`
You design a clean O(n^2) DP, code 40 lines, and submit.
"Time limit exceeded on test 7."
You scroll up: "1 <= n <= 200000".
n^2 = 4 x 10^10. At ~10^8 ops/sec that is ~400 seconds. Never had a chance.
\`\`\`

**The fix: size-to-complexity table, checked BEFORE choosing an approach**

\`\`\`
n (or the dominant input size)     acceptable time complexity
--------------------------------   -----------------------------------------
n <= 10-12                         O(n!)            permutations, brute force
n <= 18-22                         O(2^n * n)       bitmask DP, subset search
n <= 100                           O(n^4)           4 nested loops, heavy DP
n <= 500                           O(n^3)           Floyd-Warshall, interval DP
n <= 5000                          O(n^2)           pairwise DP, O(n^2) scans
n <= 100000                        O(n log n)       sort-based, heap, segment tree
n <= 1000000                       O(n) or O(n log n)  single/few passes
n <= 100000000                     O(n) with a small constant, or O(log n)
n <= 10^18                         O(log n), O(1), or a closed-form formula
--------------------------------   -----------------------------------------
The rule of thumb: a modern machine does roughly 10^8 to 10^9 SIMPLE
operations per second. Multiply your complexity by the constraint, compare
to ~10^8 for a 1-2 second limit.
\`\`\`

**Worked estimates**

\`\`\`
n = 10^5, O(n^2)      -> 10^10 ops -> ~100 s          TOO SLOW
n = 10^5, O(n log n)  -> ~1.7 x 10^6 ops -> instant   FINE
n = 10^6, O(n)        -> 10^6 ops -> instant          FINE
n = 40,   O(2^n)      -> 10^12 ops -> hours           TOO SLOW (try meet-in-the-middle)
n = 20,   O(2^n * n)  -> 2 x 10^7 ops -> instant      FINE
n = 500,  O(n^3)      -> 1.25 x 10^8 ops -> ~1 s      BORDERLINE, usually fine
\`\`\`

The constraint is doing your first round of technique elimination for free. If \`n <= 20\` and the problem is about subsets, the constraint is *telling you* to think bitmask. If \`n <= 10^6\`, it is telling you the answer is a sort or a linear pass, not a clever quadratic DP.`,

    simpleHi: `**Toote hue se shuru.** Pehle design karo, constraints last check karo:

\`\`\`
Aap ek saaf O(n^2) DP design karte ho, 40 lines code karte ho, aur submit karte ho.
"Time limit exceeded on test 7."
Aap upar scroll karte ho: "1 <= n <= 200000".
n^2 = 4 x 10^10. ~10^8 ops/sec par wo ~400 seconds hai. Kabhi mauka nahi tha.
\`\`\`

**Fix: size-to-complexity table, ek approach chunne SE PEHLE check kiya gaya**

\`\`\`
n (ya dominant input size)         acceptable time complexity
--------------------------------   -----------------------------------------
n <= 10-12                         O(n!)            permutations, brute force
n <= 18-22                         O(2^n * n)       bitmask DP, subset search
n <= 100                           O(n^4)           4 nested loops, heavy DP
n <= 500                           O(n^3)           Floyd-Warshall, interval DP
n <= 5000                          O(n^2)           pairwise DP, O(n^2) scans
n <= 100000                        O(n log n)       sort-based, heap, segment tree
n <= 1000000                       O(n) ya O(n log n)  single/few passes
n <= 100000000                     ek chhote constant ke saath O(n), ya O(log n)
n <= 10^18                         O(log n), O(1), ya ek closed-form formula
--------------------------------   -----------------------------------------
Rule of thumb: ek aadhunik machine lagbhag 10^8 se 10^9 SIMPLE operations prati
second karti hai. Apni complexity ko constraint se multiply karo, ek 1-2 second
limit ke liye ~10^8 se compare karo.
\`\`\`

**Worked estimates**

\`\`\`
n = 10^5, O(n^2)      -> 10^10 ops -> ~100 s          BAHUT SLOW
n = 10^5, O(n log n)  -> ~1.7 x 10^6 ops -> turant   THEEK
n = 10^6, O(n)        -> 10^6 ops -> turant          THEEK
n = 40,   O(2^n)      -> 10^12 ops -> ghante         BAHUT SLOW (meet-in-the-middle try karo)
n = 20,   O(2^n * n)  -> 2 x 10^7 ops -> turant      THEEK
n = 500,  O(n^3)      -> 1.25 x 10^8 ops -> ~1 s      BORDERLINE, aksar theek
\`\`\`

Constraint aapki technique elimination ka pehla round muft mein kar raha hai. Agar \`n <= 20\` aur problem subsets ke baare mein hai, constraint aapko *bata raha hai* bitmask sochne ko. Agar \`n <= 10^6\`, ye bata raha hai jawaab ek sort ya ek linear pass hai, ek clever quadratic DP nahi.`,

    content: `## Space budget, and integer overflow

\`\`\`
Typical memory limit: 256 MB. A number array holds ~64 million 4-byte ints or
~32 million 8-byte doubles. So:
  - an int[10^7] is fine; an int[10^9] is not.
  - a 2D DP table of size n x m must have n*m within a few tens of millions.
  - a 2^n bitmask DP: n <= 25 or so before the array itself is too big.

Integer range:
  - sums / products can overflow. In JS, integers stay exact only up to 2^53.
    A sum of 10^6 values each up to 10^9 is 10^15 -- fine. A product, or 10^12
    values, is not. Use BigInt when the safe range is exceeded.
  - problems often say "answer modulo 10^9 + 7" precisely because the true
    answer overflows -- take the mod at every step, not just at the end.
\`\`\`

## Constraints as hints toward the technique

\`\`\`
"n <= 20"            -> bitmask DP, subset enumeration, meet-in-the-middle
"n <= 40"            -> meet-in-the-middle (split into two 2^20 halves)
"n <= 500"           -> O(n^3): all-pairs shortest path, interval DP, O(n^2)
                        DP with an O(n) transition
"n <= 10^5, values <= 10^9"  -> cannot index by value; sort or use a hash map /
                        coordinate compression
"values <= 100"     -> counting sort, or a DP indexed by value
"the array is sorted" (stated in constraints)  -> two pointers / binary search
"q queries, each ..."  -> per-query cost must be small; precompute (prefix sums,
                        sparse table, segment tree) so each query is O(1) or O(log n)
"the tree has up to 10^5 nodes"  -> O(n) or O(n log n) tree DP / Euler tour,
                        NOT O(n^2) all-pairs
\`\`\`

## The multi-parameter case

\`\`\`
When there are several sizes (n items, W capacity, q queries, V vertices,
E edges), the acceptable complexity is a product/sum of them:
  knapsack: O(n * W), fine when n * W <= ~10^8
  graph BFS: O(V + E), fine when V + E <= ~10^6
  "n strings of total length L": the bound is usually O(L), not O(n * maxlen)

Read every number in the constraints block. A problem with n <= 10^5 AND
"the sum of all array lengths <= 10^5" is telling you the total work is bounded
by 10^5 even though any single array could be large.
\`\`\`

## What "borderline" means and how to handle it

\`\`\`
If your estimate lands at 10^8 to 5 x 10^8 operations for a 1-2 second limit,
it is borderline. Options:
  - reduce the constant factor: avoid allocations in the inner loop, use typed
    arrays, hoist invariant computations
  - a log-factor improvement (n^2 -> n^2 / 64 with a bitset, or n log n -> n)
  - accept it and code carefully; many judges are lenient by 2-3x

If it lands above 10^9, do not code it -- find a better complexity class first.
\`\`\``,

    contentHi: `## Space budget, aur integer overflow

\`\`\`
Typical memory limit: 256 MB. Ek number array ~64 million 4-byte ints ya
~32 million 8-byte doubles rakhta hai. Toh:
  - ek int[10^7] theek hai; ek int[10^9] nahi.
  - size n x m ka ek 2D DP table ka n*m kuch tens of millions ke andar hona chahiye.
  - ek 2^n bitmask DP: n <= 25 ya aise before array khud bahut bada ho.

Integer range:
  - sums / products overflow ho sakte hain. JS mein, integers sirf 2^53 tak exact
    rehte hain. 10^6 values ka ek sum har ek 10^9 tak 10^15 hai -- theek. Ek product,
    ya 10^12 values, nahi. Jab safe range paar ho BigInt istemal karo.
  - problems aksar kehti hain "answer modulo 10^9 + 7" bilkul isliye kyunki asli
    jawaab overflow hota hai -- har step par mod lo, sirf ant mein nahi.
\`\`\`

## Constraints technique ki taraf hints ki tarah

\`\`\`
"n <= 20"            -> bitmask DP, subset enumeration, meet-in-the-middle
"n <= 40"            -> meet-in-the-middle (do 2^20 halves mein split)
"n <= 500"           -> O(n^3): all-pairs shortest path, interval DP, ek O(n)
                        transition ke saath O(n^2) DP
"n <= 10^5, values <= 10^9"  -> value se index nahi kar sakte; sort ya ek hash map /
                        coordinate compression istemal karo
"values <= 100"     -> counting sort, ya value se indexed ek DP
"array sorted hai" (constraints mein batayi gayi)  -> two pointers / binary search
"q queries, har ..."  -> prati-query cost chhoti honi chahiye; precompute karo (prefix
                        sums, sparse table, segment tree) taaki har query O(1) ya O(log n) ho
"tree ke 10^5 tak nodes hain"  -> O(n) ya O(n log n) tree DP / Euler tour,
                        O(n^2) all-pairs NAHI
\`\`\`

## Multi-parameter case

\`\`\`
Jab kayi sizes hain (n items, W capacity, q queries, V vertices, E edges),
acceptable complexity unka product/sum hai:
  knapsack: O(n * W), theek jab n * W <= ~10^8
  graph BFS: O(V + E), theek jab V + E <= ~10^6
  "total length L ki n strings": bound aksar O(L) hai, O(n * maxlen) nahi

Constraints block mein har number padho. n <= 10^5 AUR "sab array lengths ka
sum <= 10^5" waali ek problem aapko bata rahi hai ki total kaam 10^5 se bandha
hai chahe koi ek array bada ho sakta hai.
\`\`\`

## "Borderline" ka kya matlab hai aur ise kaise handle karein

\`\`\`
Agar aapka estimate ek 1-2 second limit ke liye 10^8 se 5 x 10^8 operations par
utarta hai, ye borderline hai. Options:
  - constant factor kam karo: inner loop mein allocations avoid karo, typed arrays
    istemal karo, invariant computations hoist karo
  - ek log-factor sudhaar (n^2 -> n^2 / 64 ek bitset se, ya n log n -> n)
  - ise accept karo aur dhyaan se code karo; kayi judges 2-3x se lenient hain

Agar ye 10^9 se upar utarta hai, ise code mat karo -- pehle ek behtar complexity class dhoondho.
\`\`\``,

    examples: [
      {
        title: 'The estimate that saves 40 minutes',
        titleHi: 'Wo estimate jo 40 minute bachaata hai',
        code: `// constraint: n <= 2 * 10^5. Candidate: O(n^2) DP.
// 2e5 squared = 4e10. At 1e8 ops/sec -> 400 seconds. REJECT before coding.`,
        codeJs: `// Instead, look for O(n log n): often "sort + two pointers", or
// "sort + binary search", or "one pass + a heap".
// e.g. "max pairs summing under a limit" becomes sort + two pointers, O(n log n).
function maxPairsUnder(nums, limit) {
  nums = [...nums].sort((a, b) => a - b);
  let i = 0, j = nums.length - 1, pairs = 0;
  while (i < j) {
    if (nums[i] + nums[j] < limit) { pairs++; i++; j--; }
    else j--;
  }
  return pairs;
}`,
        codeTs: `function maxPairsUnder(nums: number[], limit: number): number {
  nums = [...nums].sort((a, b) => a - b);
  let i = 0, j = nums.length - 1, pairs = 0;
  while (i < j) {
    if (nums[i]! + nums[j]! < limit) { pairs++; i++; j--; }
    else j--;
  }
  return pairs;
}`,
        output: `// O(n log n) instead of O(n^2) — chosen because the constraint ruled O(n^2) out`,
        explain: 'Multiplying the candidate complexity by the constraint and comparing to ~10^8 takes five seconds and immediately eliminates approaches that cannot pass. Do this before designing.',
        explainHi: 'Candidate complexity ko constraint se multiply karna aur ~10^8 se compare karna paanch second leta hai aur turant un approaches ko eliminate karta hai jo pass nahi ho sakte. Ise design karne se pehle karo.',
      },
      {
        title: 'Constraint says "n <= 15" -> that IS the hint',
        titleHi: 'Constraint kehta hai "n <= 15" -> WOHI hint hai',
        code: `// n <= 15 and "assign every task" -> 2^15 = 32768 states -> bitmask DP`,
        codeJs: `// The tiny bound is not incidental. n <= 15 with a "cover all / visit all /
// assign all" objective means the intended solution is O(2^n * poly(n)).
// If you were reaching for a greedy or a polynomial DP, the constraint is
// telling you to reconsider.
const statesForN15 = 1 << 15;   // 32768 — trivially small
const workPerState = 15;
// total ~ 500k operations — instant`,
        codeTs: `const statesForN15: number = 1 << 15;
const workPerState = 15;`,
        output: `32768`,
        explain: 'A suspiciously small explicit bound (n <= 15, 18, 20) combined with a subset/assignment objective is a direct signal to use bitmask DP or meet-in-the-middle. The constraint is part of the problem statement.',
        explainHi: 'Ek shakki roop se chhota explicit bound (n <= 15, 18, 20) ek subset/assignment objective ke saath bitmask DP ya meet-in-the-middle istemal karne ka ek seedha signal hai. Constraint problem statement ka hissa hai.',
      },
      {
        title: 'Modulo arithmetic when the answer overflows',
        titleHi: 'Modulo arithmetic jab jawaab overflow hota hai',
        code: `dp[i] = (dp[i - 1] + dp[i - 2]) % MOD;   // take the mod at EVERY step`,
        codeJs: `const MOD = 1_000_000_007;
function countWays(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, (a + b) % MOD];   // keep every intermediate within the modulus
  }
  return b;
}
console.log(countWays(100));   // a large number, but correct mod 1e9+7`,
        codeTs: `const MOD = 1_000_000_007;
function countWays(n: number): number {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, (a + b) % MOD];
  return b;
}`,
        output: `// correct result modulo 1e9+7`,
        explain: 'When the constraint says "answer modulo 1e9+7", the true answer does not fit in a normal integer. Apply the modulus after every addition/multiplication so intermediates stay bounded — never let it grow and mod once at the end.',
        explainHi: 'Jab constraint kehta hai "answer modulo 1e9+7", asli jawaab ek normal integer mein fit nahi hota. Har addition/multiplication ke baad modulus lagao taaki intermediates bounded rahein — kabhi ise badhne mat do aur ant mein ek baar mod.',
      },
    ],

    mistakes: [
      {
        wrong: `// designing and coding before reading the constraint block`,
        right: `// read the constraints first: multiply your candidate complexity by the
// largest input size, compare to ~10^8. Only then design.`,
        why: 'The constraint eliminates entire complexity classes for free. Skipping it means you risk fully implementing an approach that could never pass, and finding out too late to recover.',
        whyHi: 'Constraint poori complexity classes muft mein eliminate karta hai. Ise skip karna matlab aap ek aisi approach poori tarah implement karne ka risk lete ho jo kabhi pass nahi ho sakti, aur recover karne ke liye bahut der se pata chalna.',
      },
      {
        wrong: `// ignoring a secondary constraint like "sum of all lengths <= 10^5"
// and budgeting O(n * maxLen) when the real bound is O(totalLen)`,
        right: `// read EVERY number in the constraints. "Sum of ..." bounds mean the total
// work across all inputs is bounded, which is often much tighter than n * max.`,
        why: 'A per-item constraint and an aggregate constraint give very different budgets. "n <= 10^5 strings, total length <= 10^5" allows O(total length), not O(n * longest string).',
        whyHi: 'Ek per-item constraint aur ek aggregate constraint bahut alag budgets dete hain. "n <= 10^5 strings, total length <= 10^5" O(total length) allow karta hai, O(n * longest string) nahi.',
      },
      {
        wrong: `// letting a DP value grow unbounded when the problem says "modulo 1e9+7"
let total = 0; for (...) total += ways;   // overflows past 2^53`,
        right: `let total = 0; for (...) total = (total + ways) % MOD;`,
        why: 'The "modulo" phrasing exists because the true count is astronomically large. You must reduce modulo the given prime at every step, or intermediate values lose precision (in JS, past 2^53) or overflow (in fixed-width languages).',
        whyHi: '"Modulo" phrasing isliye maujood hai kyunki asli count astronomically bada hai. Aapko har step par diye gaye prime se reduce karna chahiye, warna intermediate values precision khote hain (JS mein, 2^53 ke baad) ya overflow (fixed-width languages mein).',
      },
    ],

    realWorld: [
      {
        en: '**Capacity planning is exactly this estimate** — "we have 10 million rows and 200 ms; that budgets O(rows) with a small constant, so an O(rows log rows) sort is borderline and O(rows squared) is impossible".',
        hi: '**Capacity planning bilkul ye estimate hai** — "humare paas 10 million rows aur 200 ms hai; wo ek chhote constant ke saath O(rows) budget karta hai, isliye ek O(rows log rows) sort borderline hai aur O(rows squared) asambhav hai".',
      },
      {
        en: '**Choosing a data structure for a service** starts from the request rate and data size: 100k lookups/sec over 1M keys means O(1) hash access, not an O(log n) tree, and definitely not an O(n) scan.',
        hi: '**Ek service ke liye ek data structure chunna** request rate aur data size se shuru hota hai: 1M keys par 100k lookups/sec matlab O(1) hash access, ek O(log n) tree nahi, aur bilkul ek O(n) scan nahi.',
      },
      {
        en: '**Query cost estimation in databases** multiplies row counts by per-row work to decide between a nested-loop join (fine for small tables) and a hash or merge join (needed at scale) — the same size-to-strategy reasoning.',
        hi: '**Databases mein query cost estimation** row counts ko per-row work se multiply karta hai ek nested-loop join (chhoti tables ke liye theek) aur ek hash ya merge join (scale par zaroori) ke beech decide karne ke liye — wahi size-to-strategy reasoning.',
      },
    ],

    interviewQA: [
      {
        q: 'The interviewer says n can be up to 10^5. What does that tell you before you have even understood the problem?',
        qHi: 'Interviewer kehta hai n 10^5 tak ho sakta hai. Problem samajhne se pehle bhi wo aapko kya batata hai?',
        a: 'It tells me the acceptable time complexity is roughly O of n log n, and possibly O of n, but almost certainly not O of n squared. The reasoning is a back-of-the-envelope operation count. A typical machine executes on the order of a hundred million to a billion simple operations per second, and a typical time limit is one or two seconds, so the total number of primitive operations the solution can afford is around a hundred million to a few hundred million. If n is ten to the fifth, then n squared is ten to the tenth, which is a hundred times over budget and would take on the order of a minute or two, so any approach whose running time is quadratic in n is ruled out immediately. On the other hand, n log n for n equal to ten to the fifth is about one point seven million operations, which is trivially within budget, as is plain linear. So before I know anything about what the problem is asking, I know I should be looking for a solution built around sorting, a heap, a balanced tree or segment tree, a single or double pass with a running quantity, or binary search, and I should be actively suspicious of any idea that involves comparing every pair of elements. This shapes which techniques I even consider. If I later find myself sketching a nested loop over all pairs, the constraint is a red flag that I have the wrong approach, and I go back to the feature list to find one that fits the budget.',
        aHi: 'Ye mujhe batata hai ki acceptable time complexity lagbhag O of n log n hai, aur shayad O of n, par lagbhag zaroor O of n squared nahi. Reasoning ek back-of-the-envelope operation count hai. Ek typical machine prati second lagbhag ek sau million se ek billion simple operations execute karti hai, aur ek typical time limit ek ya do second hai, isliye solution jitne primitive operations afford kar sakta hai wo lagbhag ek sau million se kuch sau million hai. Agar n das ki paanchvi power hai, toh n squared das ki dasvi power hai, jo budget se ek sau guna zyaada hai aur ek do minute lega, isliye koi bhi approach jiska running time n mein quadratic hai turant rule out ho jaata hai. Doosri taraf, das ki paanchvi power ke n ke liye n log n lagbhag ek point saat million operations hai, jo trivially budget ke andar hai, jaise plain linear. Toh problem kya poochta hai iske baare mein kuch jaanne se pehle, main jaanta hoon ki mujhe sorting, ek heap, ek balanced tree ya segment tree, ek running quantity ke saath ek single ya double pass, ya binary search ke aas-paas bana ek solution dhoondhna chahiye, aur mujhe har us idea par sakriya roop se shakki hona chahiye jismein har element pair compare karna hai.',
      },
      {
        q: 'A problem gives n <= 22 and asks for the minimum cost to visit a set of locations. How does the constraint drive your approach?',
        qHi: 'Ek problem n <= 22 deta hai aur locations ke ek set ko visit karne ki minimum cost poochta hai. Constraint aapki approach kaise chalaata hai?',
        a: 'A bound as small and specific as twenty-two is almost never incidental. It is there because the intended solution has a factor of two to the n in its running time, and two to the twenty-two is about four million, which times a small polynomial in n is comfortably within a second. Combined with the fact that the problem is about visiting a set of locations, which is a set-coverage or ordering objective, this points squarely at a bitmask dynamic program, specifically the Held-Karp formulation for the travelling-salesman-style problem. The state is a pair: an integer bitmask recording which locations have been visited so far, and the index of the location you are currently at, because the cost of your next move depends on where you are. The number of states is two to the n times n, roughly four million times twenty-two, and each state considers up to n next locations, so the total work is two to the n times n squared, which is on the order of a hundred million and fits. If the constraint had been n up to forty instead, two to the forty would be a trillion and out of reach, and I would switch to meet-in-the-middle: split the locations into two halves of twenty, solve subset costs for each half in two to the twenty time, and combine. If the constraint had been n up to a hundred thousand, a bitmask would be impossible and I would have to conclude the exact problem is intractable at that scale and either the problem has extra structure I am missing or it wants an approximation. So the tiny bound is not just permission to use an exponential algorithm; it is a strong hint that an exponential algorithm over subsets is exactly what is expected.',
        aHi: 'Bees-do jitna chhota aur specific bound lagbhag kabhi incidental nahi hota. Ye isliye hai kyunki intended solution ke running time mein two ki n ka ek factor hai, aur two ki bees-do lagbhag chaar million hai, jo n mein ek chhote polynomial guna aaraam se ek second ke andar hai. Is baat ke saath ki problem locations ke ek set ko visit karne ke baare mein hai, jo ek set-coverage ya ordering objective hai, ye seedhe ek bitmask dynamic program par point karta hai, khaas taur par travelling-salesman-style problem ke liye Held-Karp formulation. State ek jodi hai: ek integer bitmask jo record karta hai ki ab tak kaunse locations visit hue, aur us location ka index jispar aap abhi ho, kyunki aapke agle move ki cost is par nirbhar karti hai ki aap kahaan ho. States ki tadaad two ki n guna n hai, lagbhag chaar million guna bees-do, aur har state n tak next locations consider karta hai, isliye total kaam two ki n guna n squared hai, jo lagbhag ek sau million hai aur fit hota hai. Agar constraint iske bajaye n up to chaalees hota, two ki chaalees ek trillion hota aur pahunch se bahar, aur main meet-in-the-middle par switch karta.',
      },
    ],

    exercises: [
      {
        task: 'For each (n, candidate complexity) pair, decide FINE / BORDERLINE / TOO SLOW for a 2-second limit: (10^5, O(n^2)); (10^5, O(n sqrt(n))); (5000, O(n^2)); (10^6, O(n log n)); (25, O(2^n)); (18, O(2^n * n^2)); (300, O(n^3)); (10^9, O(n)).',
        taskHi: 'Har (n, candidate complexity) pair ke liye, ek 2-second limit ke liye FINE / BORDERLINE / TOO SLOW decide karo: (10^5, O(n^2)); (10^5, O(n sqrt(n))); (5000, O(n^2)); (10^6, O(n log n)); (25, O(2^n)); (18, O(2^n * n^2)); (300, O(n^3)); (10^9, O(n)).',
        hint: 'Expected: too slow; borderline (~3e7, fine); fine (2.5e7); fine; borderline-to-slow (3.3e7 for 2^25 alone, fine, but constants matter); fine (~8.5e7); fine (2.7e7); too slow (10^9 with any per-element work).',
        hintHi: 'Expected: too slow; borderline (~3e7, fine); fine (2.5e7); fine; borderline-to-slow; fine (~8.5e7); fine (2.7e7); too slow.',
      },
      {
        task: 'Given a problem with "1 <= n <= 10^5" and "1 <= a[i] <= 10^9", explain why you cannot use counting sort or a value-indexed array, and name two techniques that handle large values.',
        taskHi: '"1 <= n <= 10^5" aur "1 <= a[i] <= 10^9" waali ek problem diye gaye, samjhaao ki aap counting sort ya ek value-indexed array kyun nahi istemal kar sakte, aur do techniques ka naam do jo bade values handle karti hain.',
        hint: 'A value-indexed array would need 10^9 slots (~4 GB). Use a hash map keyed by value, or coordinate compression (map the n distinct values to ranks 0..n-1).',
        hintHi: 'Ek value-indexed array ko 10^9 slots chahiye (~4 GB). Value se keyed ek hash map istemal karo, ya coordinate compression (n distinct values ko ranks 0..n-1 par map karo).',
      },
      {
        task: 'Take a DP you have written and identify: the state count, the per-state transition cost, the resulting time complexity, and the space. Then check both against a plausible constraint (say n, m <= 1000) and decide if it passes.',
        taskHi: 'Ek DP lo jo aapne likhi aur pehchaano: state count, per-state transition cost, resulting time complexity, aur space. Phir dono ko ek plausible constraint (maano n, m <= 1000) ke against check karo aur decide karo kya ye pass hota hai.',
        hint: 'For a 2D DP over two sequences: n*m states, O(1) transition -> O(n*m) time, O(n*m) or O(min(n,m)) space. At n=m=1000 that is 10^6 — comfortably fine.',
        hintHi: 'Do sequences par ek 2D DP ke liye: n*m states, O(1) transition -> O(n*m) time, O(n*m) ya O(min(n,m)) space. n=m=1000 par wo 10^6 hai — aaraam se theek.',
      },
    ],

    keyTakeaways: [
      'Read the constraint block BEFORE designing. Multiply your candidate time complexity by the largest input size and compare to ~10^8 (the rough number of simple operations per second-ish budget).',
      'Size-to-complexity: n <= ~12 -> O(n!); n <= ~20 -> O(2^n); n <= 500 -> O(n^3); n <= 5000 -> O(n^2); n <= 10^5 -> O(n log n); n <= 10^6 -> O(n); n <= 10^18 -> O(log n) or a formula.',
      'A suspiciously small explicit bound (n <= 15/18/20) plus a subset/assignment/visit-all objective is a direct hint to use bitmask DP or meet-in-the-middle.',
      'Read EVERY number in the constraints. "Sum of all lengths <= X" bounds the total work at O(X), which is often far tighter than O(n * max).',
      'Space: ~256 MB, so int[10^7] is fine but int[10^9] is not; a 2D table\'s n*m must stay within tens of millions.',
      '"Answer modulo 1e9+7" means the true answer overflows — apply the modulus after every operation, not once at the end. In JS, plain integers are exact only to 2^53.',
    ],
    keyTakeawaysHi: [
      'Design karne SE PEHLE constraint block padho. Apni candidate time complexity ko sabse bade input size se multiply karo aur ~10^8 se compare karo (prati second-ish budget simple operations ki rough tadaad).',
      'Size-to-complexity: n <= ~12 -> O(n!); n <= ~20 -> O(2^n); n <= 500 -> O(n^3); n <= 5000 -> O(n^2); n <= 10^5 -> O(n log n); n <= 10^6 -> O(n); n <= 10^18 -> O(log n) ya ek formula.',
      'Ek shakki roop se chhota explicit bound (n <= 15/18/20) plus ek subset/assignment/visit-all objective bitmask DP ya meet-in-the-middle istemal karne ka ek seedha hint hai.',
      'Constraints mein HAR number padho. "Sab lengths ka sum <= X" total kaam ko O(X) par bound karta hai, jo aksar O(n * max) se kaafi tighter hai.',
      'Space: ~256 MB, isliye int[10^7] theek hai par int[10^9] nahi; ek 2D table ka n*m tens of millions ke andar rehna chahiye.',
      '"Answer modulo 1e9+7" matlab asli jawaab overflow hota hai — har operation ke baad modulus lagao, ant mein ek baar nahi. JS mein, plain integers sirf 2^53 tak exact hain.',
    ],
  },
];
