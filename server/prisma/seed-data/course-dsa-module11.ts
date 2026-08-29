/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 1.
 *
 * The two properties that make a problem a DP problem — overlapping subproblems
 * and optimal substructure — and the two ways to exploit them: memoization
 * (top-down: recurse, but cache each subproblem's answer) and tabulation
 * (bottom-up: fill an array of subproblem answers in dependency order). Builds
 * directly on this course's Module 6 lesson 4 (which introduced memoising naive
 * Fibonacci) and Module 8 lesson 3 (aggregate analysis: counting DISTINCT
 * subproblems). Broken example: naive recursive "climbing stairs" (or Fibonacci)
 * — it re-solves the same subproblem an exponential number of times because the
 * call tree branches and the branches overlap. Fixed first with a memo (a
 * Map/array that turns every repeat call into an O(1) lookup, collapsing the
 * exponential tree to O(n) distinct subproblems), then with tabulation (drop the
 * recursion entirely and fill dp[0..n] in order), then with O(1) rolling state.
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

export const DSA_MODULE_11: CourseLesson[] = [
  {
    slug: 'dp-overlapping-subproblems-memo-vs-tab',
    title: 'Dynamic Programming: Overlapping Subproblems, Memo vs Tabulation',
    titleHi: 'Dynamic Programming: Overlapping Subproblems, Memo vs Tabulation',
    description: 'Counting the ways to climb n stairs taking 1 or 2 steps at a time, with the natural recursion ways(n) = ways(n-1) + ways(n-2). It is correct and reads beautifully, but it recomputes ways(n-2) twice, ways(n-3) three times, ways(n-4) five times, and the total number of calls grows exponentially — the same subproblem solved over and over.',
    descriptionHi: 'n seedhiyaan chadhne ke tarike ginna ek baar mein 1 ya 2 steps lekar, natural recursion ways(n) = ways(n-1) + ways(n-2) ke saath. Ye sahi hai aur khoobsurat padhta hai, par ye ways(n-2) ko do baar, ways(n-3) ko teen baar, ways(n-4) ko paanch baar recompute karta hai, aur kul calls ki tadaad exponentially badhti hai — wahi subproblem baar-baar solve hota hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**Answering "how many days until the festival?" by asking the person next to you, who asks the person next to them, all the way down a long row of people.** If everyone just passes the question along and passes the answer back, and there is only one chain, that is fine. But now imagine the question splits: to answer, each person must ask BOTH of the two people in front of them and add the results. Person 10 asks persons 9 and 8. Person 9 asks 8 and 7. So person 8 gets asked by both 10 and 9, and person 7 gets asked by 9 and 8 and eventually many others — the same people are interrupted with the same question again and again, and the total number of questions explodes. The fix is a shared whiteboard: the first time anyone works out their answer, they write it on the board next to their name. After that, anyone who needs that person\'s answer just reads the board instead of asking. Now each person computes their answer exactly once, and the whole row settles in time proportional to its length. You can go further: since each person only needs the two people ahead of them, you can walk the row from the front writing answers as you go, and never recurse at all — just carry the last two numbers forward.',
      hi: '**"Festival mein kitne din baaki hain?" ka jawaab apne bagal waale vyakti se poochkar dena, jo apne bagal waale se poochta hai, logon ki ek lambi row mein neeche tak.** Agar har koi bas sawaal aage pass karta hai aur jawaab wapas pass karta hai, aur sirf ek chain hai, wo theek hai. Par ab socho sawaal split hota hai: jawaab dene ke liye, har vyakti ko apne saamne DONO logon se poochna hai aur nateeje jodne hain. Vyakti 10 vyakti 9 aur 8 se poochta hai. Vyakti 9, 8 aur 7 se poochta hai. Toh vyakti 8 se 10 aur 9 dono poochte hain, aur vyakti 7 se 9 aur 8 aur aakhirkaar kayi doosre — wahi log wahi sawaal se baar-baar interrupt hote hain, aur kul sawaalon ki tadaad phat jaati hai. Fix ek saanjha whiteboard hai: pehli baar jab koi apna jawaab nikaalta hai, wo ise board par apne naam ke bagal likhta hai. Uske baad, jise us vyakti ka jawaab chahiye wo poochne ke bajaye bas board padhta hai. Ab har vyakti apna jawaab bilkul ek baar compute karta hai, aur poori row apni length ke anupaat mein samay mein settle hoti hai. Aap aur aage jaa sakte ho: kyunki har vyakti ko sirf apne aage ke do log chahiye, aap row ko saamne se chalte hue jawaab likh sakte ho, aur bilkul recurse nahi — bas aakhri do numbers aage le jao.',
    },

    simple: `**Start broken.** Count ways to climb \`n\` stairs (1 or 2 steps at a time):

\`\`\`js
function waysNaive(n) {
  if (n <= 2) return n;                       // 1 stair: 1 way, 2 stairs: 2 ways
  return waysNaive(n - 1) + waysNaive(n - 2); // last step was a 1 or a 2
}
\`\`\`

The recurrence is correct — the final move was either a single step (from \`n-1\`) or a double (from \`n-2\`). But look at the call tree for \`waysNaive(5)\`:

\`\`\`
                    ways(5)
                  /        \\
             ways(4)        ways(3)
             /     \\        /     \\
        ways(3)  ways(2)  ways(2) ways(1)
        /    \\
   ways(2)  ways(1)
\`\`\`

\`ways(3)\` is computed twice, \`ways(2)\` three times. For \`ways(n)\` the number of calls is itself roughly \`ways(n)\`, which grows like \`1.618^n\` — exponential. This course's Module 6 lesson 4 showed the exact same shape for naive Fibonacci. The two properties that make this a **dynamic programming** problem:

- **Overlapping subproblems**: the recursion asks the same question (\`ways(3)\`, \`ways(2)\`, ...) many times.
- **Optimal substructure**: the answer for \`n\` is built directly from the answers for smaller inputs (\`n-1\` and \`n-2\`), with no need to reconsider how those were obtained.

**Fix step 1: memoization — cache each subproblem's answer (top-down)**

\`\`\`js
function waysMemo(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);        // already solved -> O(1)
  const result = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
\`\`\`

The recursion is untouched — you have just added a cache. The first time \`ways(3)\` is computed it goes in the map; every later request returns instantly. The call tree collapses: there are only \`n\` distinct subproblems, each solved once, so the whole thing is **O(n)** time and O(n) space.

**Fix step 2: tabulation — fill an array bottom-up (no recursion)**

\`\`\`js
function waysTab(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];  // dependencies already filled
  return dp[n];
}
\`\`\`

\`\`\`ts
function waysTab(n: number): number {
  if (n <= 2) return n;
  const dp = new Array<number>(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1]! + dp[i - 2]!;
  return dp[n]!;
}
\`\`\`

Same O(n), but iterative — no recursion stack, and the fill order is explicit: \`dp[i]\` is computed only after \`dp[i-1]\` and \`dp[i-2]\` already hold their answers.

**Fix step 3: O(1) space — only the last two values matter**

\`\`\`js
function waysO1(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;                           // dp[i-2], dp[i-1]
  for (let i = 3; i <= n; i++) { [a, b] = [b, a + b]; }
  return b;
}
\`\`\`

Since \`dp[i]\` needs only \`dp[i-1]\` and \`dp[i-2]\`, you can throw the rest of the array away and carry two rolling variables — O(1) space.`,

    simpleHi: `**Toote hue se shuru.** \`n\` seedhiyaan chadhne ke tarike gino (ek baar mein 1 ya 2 steps):

\`\`\`js
function waysNaive(n) {
  if (n <= 2) return n;                       // 1 seedhi: 1 tarika, 2 seedhiyaan: 2 tarike
  return waysNaive(n - 1) + waysNaive(n - 2); // aakhri step ek 1 ya ek 2 tha
}
\`\`\`

Recurrence sahi hai — aakhri move ya toh ek single step tha (\`n-1\` se) ya ek double (\`n-2\` se). Par \`waysNaive(5)\` ke liye call tree dekho:

\`\`\`
                    ways(5)
                  /        \\
             ways(4)        ways(3)
             /     \\        /     \\
        ways(3)  ways(2)  ways(2) ways(1)
        /    \\
   ways(2)  ways(1)
\`\`\`

\`ways(3)\` do baar compute hota hai, \`ways(2)\` teen baar. \`ways(n)\` ke liye calls ki tadaad khud lagbhag \`ways(n)\` hai, jo \`1.618^n\` ki tarah badhti hai — exponential. Is course ke Module 6 lesson 4 ne naive Fibonacci ke liye bilkul yahi shape dikhaaya. Do properties jo ise ek **dynamic programming** problem banaati hain:

- **Overlapping subproblems**: recursion wahi sawaal (\`ways(3)\`, \`ways(2)\`, ...) kayi baar poochti hai.
- **Optimal substructure**: \`n\` ke liye jawaab seedhe chhote inputs (\`n-1\` aur \`n-2\`) ke jawaabon se banta hai, bina dobara sochne ke ki wo kaise haasil hue.

**Fix step 1: memoization — har subproblem ka jawaab cache karo (top-down)**

\`\`\`js
function waysMemo(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);        // pehle se solved -> O(1)
  const result = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
\`\`\`

Recursion achhooti hai — aapne bas ek cache jodi. Pehli baar jab \`ways(3)\` compute hota hai ye map mein jaata hai; har baad ki request turant return hoti hai. Call tree collapse hota hai: sirf \`n\` distinct subproblems hain, har ek ek baar solved, isliye poori cheez **O(n)** time aur O(n) space hai.

**Fix step 2: tabulation — ek array bottom-up bharo (koi recursion nahi)**

\`\`\`js
function waysTab(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];  // dependencies pehle se bhari
  return dp[n];
}
\`\`\`

\`\`\`ts
function waysTab(n: number): number {
  if (n <= 2) return n;
  const dp = new Array<number>(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1]! + dp[i - 2]!;
  return dp[n]!;
}
\`\`\`

Wahi O(n), par iterative — koi recursion stack nahi, aur fill order spasht hai: \`dp[i]\` sirf tab compute hota hai jab \`dp[i-1]\` aur \`dp[i-2]\` pehle se apne jawaab rakhte hain.

**Fix step 3: O(1) space — sirf aakhri do values maayne rakhti hain**

\`\`\`js
function waysO1(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;                           // dp[i-2], dp[i-1]
  for (let i = 3; i <= n; i++) { [a, b] = [b, a + b]; }
  return b;
}
\`\`\`

Kyunki \`dp[i]\` ko sirf \`dp[i-1]\` aur \`dp[i-2]\` chahiye, aap baaki array phenk sakte ho aur do rolling variables le jaa sakte ho — O(1) space.`,

    content: `## Memoization versus tabulation, side by side

\`\`\`
                     Memoization (top-down)          Tabulation (bottom-up)
Structure            recursion + a cache             a loop filling an array
Which subproblems    only the ones actually needed   every subproblem in the range
  get computed         to answer the top-level call    (even unreachable ones)
Order                 driven by the recursion         you choose it explicitly
Stack                 O(depth) call stack (can        no recursion stack
                        overflow on large n)
Space optimisation    harder (cache holds all keys)   easy (drop old rows / use
                                                        rolling variables)
When it is easier     the recurrence is natural but   the dependency order is
                        the fill order is awkward       simple (1D or 2D forward)
\`\`\`

Both are the same algorithm — solve each subproblem once, reuse the answer. Memoization is often the quickest to write because you just take the naive recursion and add a cache. Tabulation is usually what you refine to, because the explicit fill order makes space optimisation obvious and removes the stack-overflow risk.

## Identifying a DP problem: the two required properties

\`\`\`
1. OPTIMAL SUBSTRUCTURE
   The optimal answer to the whole problem can be constructed from optimal
   answers to subproblems. (Climbing stairs: ways(n) = ways(n-1) + ways(n-2).
   Shortest path: the shortest path to X is the shortest path to some neighbour
   of X, plus that last edge.)

2. OVERLAPPING SUBPROBLEMS
   A plain recursion solves the same subproblem many times. (If every
   subproblem were distinct, caching would not help and you would just have
   divide-and-conquer — e.g. merge sort has optimal substructure but NOT
   overlapping subproblems, so it is not a DP problem.)
\`\`\`

Both must hold. Optimal substructure without overlap is divide-and-conquer (Module 10\'s merge sort). Overlap without a way to combine subproblem answers into the whole is just... a slow recursion with no fix. DP is exactly the intersection.

## The method, as a checklist you apply to any candidate

\`\`\`
1. State:       what parameters fully describe a subproblem?
                (climbing stairs: just the number of stairs left, i)
2. Recurrence:  how is dp[state] built from smaller states?
                (dp[i] = dp[i-1] + dp[i-2])
3. Base cases:  the smallest states, answered directly.
                (dp[1] = 1, dp[2] = 2)
4. Order:       fill states so every dependency is ready first.
                (increasing i)
5. Answer:      which state holds the final result? (dp[n])
6. Optimise:    does dp[i] depend on only the last few states? -> rolling vars.
\`\`\`

Every DP lesson in this module is an application of these six steps to a different shape of state — 1D, 2D grids, subset-with-capacity (knapsack), two-sequence, and intervals.

## Why counting DISTINCT subproblems gives the complexity

\`\`\`
DP time = (number of distinct subproblems) x (work to combine each, given its
          dependencies are already solved)

Climbing stairs: n distinct states, O(1) to combine each -> O(n).
Edit distance (later lesson): m*n distinct states, O(1) each -> O(m*n).
Knapsack (later lesson): n*W distinct states, O(1) each -> O(n*W).
\`\`\`

This course's Module 8 lesson 3 used exactly this "count the distinct pieces of work, not the naive call count" reasoning for heapify. In DP it is the standard way to state the running time: the size of the memo table times the per-cell work.`,

    contentHi: `## Memoization versus tabulation, saath-saath

\`\`\`
                     Memoization (top-down)          Tabulation (bottom-up)
Structure            recursion + ek cache            ek loop jo ek array bharta hai
Kaunse subproblems   sirf wo jo asal mein            range mein har subproblem
  compute hote hain    top-level call ke liye chahiye  (unreachable bhi)
Order                recursion se chalta hai         aap ise explicitly chunte ho
Stack                O(depth) call stack (bade n     koi recursion stack nahi
                       par overflow ho sakta hai)
Space optimisation   mushkil (cache sab keys rakhta) aasaan (purani rows drop / rolling vars)
Kab aasaan hai       recurrence natural hai par      dependency order saral hai
                       fill order awkward              (1D ya 2D forward)
\`\`\`

Dono wahi algorithm hain — har subproblem ek baar solve karo, jawaab reuse karo. Memoization aksar likhne mein sabse tez hai kyunki aap bas naive recursion lete ho aur ek cache jodte ho. Tabulation aksar wo hai jispar aap refine karte ho, kyunki spasht fill order space optimisation ko spasht banaata hai aur stack-overflow risk hataata hai.

## Ek DP problem pehchaanna: do zaroori properties

\`\`\`
1. OPTIMAL SUBSTRUCTURE
   Poori problem ka optimal jawaab subproblems ke optimal jawaabon se banaya jaa
   sakta hai. (Climbing stairs: ways(n) = ways(n-1) + ways(n-2). Shortest path:
   X tak shortest path X ke kisi neighbour tak shortest path plus wo aakhri edge hai.)

2. OVERLAPPING SUBPROBLEMS
   Ek plain recursion wahi subproblem kayi baar solve karti hai. (Agar har
   subproblem distinct hota, caching madad nahi karti aur aapke paas bas
   divide-and-conquer hota — jaise merge sort ka optimal substructure hai par
   overlapping subproblems NAHI, isliye ye ek DP problem nahi hai.)
\`\`\`

Dono hone chahiye. Overlap ke bina optimal substructure divide-and-conquer hai (Module 10 ka merge sort). Subproblem jawaabon ko poore mein combine karne ke tarike ke bina overlap bas... ek slow recursion hai bina fix ke. DP bilkul intersection hai.

## Method, ek checklist ki tarah jise aap kisi bhi candidate par lagaate ho

\`\`\`
1. State:       kaunse parameters ek subproblem ko poori tarah describe karte hain?
                (climbing stairs: bas baaki seedhiyon ki tadaad, i)
2. Recurrence:  dp[state] chhote states se kaise banta hai?
                (dp[i] = dp[i-1] + dp[i-2])
3. Base cases:  sabse chhote states, seedhe jawaab diye gaye.
                (dp[1] = 1, dp[2] = 2)
4. Order:       states aise bharo ki har dependency pehle ready ho.
                (badhta i)
5. Answer:      kaunsa state final result rakhta hai? (dp[n])
6. Optimise:    kya dp[i] sirf aakhri kuch states par nirbhar karta hai? -> rolling vars.
\`\`\`

Is module mein har DP lesson in chhe steps ka ek alag shape ke state par application hai — 1D, 2D grids, subset-with-capacity (knapsack), two-sequence, aur intervals.

## DISTINCT subproblems ginna complexity kyun deta hai

\`\`\`
DP time = (distinct subproblems ki tadaad) x (har ek ko combine karne ka kaam,
          uski dependencies pehle se solved diye gaye)

Climbing stairs: n distinct states, har ek O(1) combine -> O(n).
Edit distance (baad ka lesson): m*n distinct states, har ek O(1) -> O(m*n).
Knapsack (baad ka lesson): n*W distinct states, har ek O(1) -> O(n*W).
\`\`\`

Is course ke Module 8 lesson 3 ne heapify ke liye bilkul yahi "kaam ke distinct tukde gino, naive call count nahi" tark istemal kiya. DP mein ye running time batane ka standard tarika hai: memo table ka size guna prati-cell kaam.`,

    examples: [
      {
        title: 'Broken: naive recursion recomputes subproblems exponentially',
        titleHi: 'Toota: naive recursion subproblems ko exponentially recompute karti hai',
        code: `function waysNaive(n) {
  if (n <= 2) return n;
  return waysNaive(n - 1) + waysNaive(n - 2);   // ways(n-2) computed via both branches
}`,
        codeJs: `let calls = 0;
function waysNaive(n) {
  calls++;
  if (n <= 2) return n;
  return waysNaive(n - 1) + waysNaive(n - 2);
}
console.log(waysNaive(30), calls); // 1346269  and  ~2.7 million calls`,
        codeTs: `function waysNaive(n: number): number {
  if (n <= 2) return n;
  return waysNaive(n - 1) + waysNaive(n - 2);
}`,
        output: `1346269   (with ~2.7 million recursive calls for n = 30)`,
        explain: 'The call tree branches into two at every node and the branches overlap, so the number of calls grows like 1.618^n. Each subproblem is re-solved from scratch many times.',
        explainHi: 'Call tree har node par do mein branch karta hai aur branches overlap karti hain, isliye calls ki tadaad 1.618^n ki tarah badhti hai. Har subproblem kayi baar shuru se re-solve hota hai.',
      },
      {
        title: 'Fixed: memoization collapses the tree to O(n)',
        titleHi: 'Theek: memoization tree ko O(n) mein collapse karta hai',
        code: `if (memo.has(n)) return memo.get(n);
const result = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
memo.set(n, result);`,
        codeJs: `function waysMemo(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);
  const result = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
console.log(waysMemo(30)); // 1346269  in ~30 real computations`,
        codeTs: `function waysMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = waysMemo(n - 1, memo) + waysMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}`,
        outputJs: `1346269`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The recursion is unchanged; a cache is added. Each of the n distinct subproblems is computed once and then served from the map, so total work is O(n).',
        explainHi: 'Recursion na-badla hai; ek cache jodi gayi. n distinct subproblems mein se har ek ek baar compute hota hai aur phir map se serve hota hai, isliye kul kaam O(n) hai.',
      },
      {
        title: 'Fixed further: tabulation, then O(1) rolling state',
        titleHi: 'Aur theek: tabulation, phir O(1) rolling state',
        code: `let a = 1, b = 2;
for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
return b;`,
        codeJs: `function waysTab(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
function waysO1(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
console.log(waysTab(30), waysO1(30)); // 1346269  1346269`,
        codeTs: `function waysO1(n: number): number {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
        outputJs: `1346269 1346269`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Tabulation fills dp[3..n] in order with no recursion. Since dp[i] needs only the previous two entries, the array can be replaced by two rolling variables for O(1) space.',
        explainHi: 'Tabulation dp[3..n] ko order mein bharta hai bina recursion ke. Kyunki dp[i] ko sirf pichhli do entries chahiye, array ko O(1) space ke liye do rolling variables se badla jaa sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// "memoizing" but recreating the cache on every top-level call, or per-call
function ways(n) {
  const memo = new Map();   // fresh empty cache EVERY call -> caches nothing across the tree
  ...
}`,
        right: `function ways(n, memo = new Map()) { ... }   // one cache threaded through all recursive calls
// or define memo once outside and pass it in`,
        why: 'The cache only helps if every recursive call in the same computation shares it. Creating a new Map inside the function means each call starts empty and the exponential blow-up returns.',
        whyHi: 'Cache sirf tab madad karta hai jab usi computation mein har recursive call ise share kare. Function ke andar ek naya Map banana matlab har call khaali shuru hoti hai aur exponential blow-up wapas aata hai.',
      },
      {
        wrong: `// tabulation with the wrong fill order — reading dp[i+1] before it is set
for (let i = n; i >= 1; i--) dp[i] = dp[i + 1] + dp[i + 2]; // dp[i+1], dp[i+2] not filled yet`,
        right: `for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2]; // fill in dependency order`,
        why: 'Tabulation requires every state to be computed only after the states it depends on. If the recurrence reads dp[i-1] and dp[i-2], you must iterate i upward, not downward.',
        whyHi: 'Tabulation ko har state ko sirf tab compute karna chahiye jab wo states jinpar ye nirbhar karta hai. Agar recurrence dp[i-1] aur dp[i-2] padhta hai, aapko i ko upar iterate karna chahiye, neeche nahi.',
      },
      {
        wrong: `// applying DP to a problem with optimal substructure but NO overlapping subproblems
// e.g. memoising merge sort by subarray range -> every range is distinct, cache never hits`,
        right: `// check for overlap first. If every subproblem is unique, it is divide-and-conquer,
// and a memo only adds overhead.`,
        why: 'DP pays off only when the same subproblem recurs. A memo on a problem whose subproblems are all distinct spends memory and lookup time for zero cache hits.',
        whyHi: 'DP sirf tab faayda deta hai jab wahi subproblem dobara aata hai. Ek aisi problem par memo jiske subproblems sab distinct hain zero cache hits ke liye memory aur lookup time kharch karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Diff and version-control merge algorithms** are the edit-distance DP (a later lesson in this module) — computing the minimum set of insertions and deletions to turn one file into another.',
        hi: '**Diff aur version-control merge algorithms** edit-distance DP hain (is module mein ek baad ka lesson) — ek file ko doosri mein badalne ke liye insertions aur deletions ka minimum set compute karna.',
      },
      {
        en: '**Spell checkers and fuzzy search** rank suggestions by edit distance to the typed word — a memoised recurrence over prefixes of the two strings.',
        hi: '**Spell checkers aur fuzzy search** suggestions ko type kiye gaye shabd tak edit distance se rank karte hain — do strings ke prefixes par ek memoised recurrence.',
      },
      {
        en: '**Resource allocation and budgeting** — "maximise value delivered within a fixed budget / headcount / time" — is knapsack DP (a later lesson), used in project planning and ad-slot auctions.',
        hi: '**Resource allocation aur budgeting** — "ek fixed budget / headcount / time ke andar deliver ki gayi value maximise karo" — knapsack DP hai (ek baad ka lesson), project planning aur ad-slot auctions mein istemal.',
      },
    ],

    interviewQA: [
      {
        q: 'What two properties must a problem have to be solvable by dynamic programming, and how do they map to memoization and tabulation respectively?',
        qHi: 'Ek problem mein kaunsi do properties honi chahiye dynamic programming se solve hone ke liye, aur wo memoization aur tabulation se kramsha kaise map hoti hain?',
        a: 'The two properties are optimal substructure and overlapping subproblems, and both are required. Optimal substructure means the optimal solution to the full problem can be assembled from optimal solutions to strictly smaller subproblems, without ever having to revisit how those subproblems were solved. This is what lets you write a recurrence at all: the answer for a given state is some combination of the answers for states it depends on. If a problem lacks optimal substructure, there is no recurrence to memoise or tabulate. Overlapping subproblems means that a straightforward recursive expansion of that recurrence would compute the same subproblem many times over, because the recursion tree branches and the branches ask for common subproblems. This is what makes caching pay off. If subproblems never overlap, each is computed once anyway and a cache is pure overhead, and the algorithm is really divide-and-conquer, like merge sort. Now the mapping. Memoization exploits both properties by keeping the natural recursion that optimal substructure gives you, and adding a cache so that the overlap is neutralised: the first time a subproblem is solved its answer is stored, and every subsequent request for it is a lookup. Tabulation exploits the same two properties from the other end: it observes that the subproblems form a dependency graph, orders them so that every subproblem comes after everything it depends on, and fills a table of answers in that order with a plain loop, no recursion. Both compute each distinct subproblem exactly once; they differ only in control flow and in which subproblems get touched: memoization computes only the ones the top-level call actually needs, tabulation fills the whole table.',
        aHi: 'Do properties optimal substructure aur overlapping subproblems hain, aur dono zaroori hain. Optimal substructure ka matlab poori problem ka optimal solution sakhti se chhote subproblems ke optimal solutions se assemble kiya jaa sakta hai, bina kabhi dobara dekhe ki wo subproblems kaise solve hue. Yahi aapko ek recurrence likhne deta hai bilkul: ek diye gaye state ke liye jawaab un states ke jawaabon ka koi combination hai jinpar ye nirbhar karta hai. Agar ek problem mein optimal substructure nahi hai, memoise ya tabulate karne ke liye koi recurrence nahi hai. Overlapping subproblems ka matlab us recurrence ka ek seedha recursive expansion wahi subproblem kayi baar compute karta, kyunki recursion tree branch karta hai aur branches common subproblems maangte hain. Yahi caching ko faaydemand banaata hai. Agar subproblems kabhi overlap nahi karte, har ek waise bhi ek baar compute hota hai aur ek cache shuddh overhead hai, aur algorithm asal mein divide-and-conquer hai, merge sort ki tarah. Ab mapping. Memoization dono properties exploit karta hai natural recursion rakhkar jo optimal substructure aapko deta hai, aur ek cache jodkar taaki overlap neutralise ho: pehli baar jab ek subproblem solve hota hai iska jawaab store hota hai, aur har baad ki request ek lookup hai. Tabulation usi do properties ko doosre chhor se exploit karta hai: ye dekhta hai ki subproblems ek dependency graph banate hain, unhe aise order karta hai ki har subproblem har us cheez ke baad aaye jispar ye nirbhar karta hai, aur us order mein jawaabon ki ek table ek plain loop se bharta hai, koi recursion nahi. Dono har distinct subproblem ko bilkul ek baar compute karte hain; wo sirf control flow mein aur kaunse subproblems chhue jaate hain mein alag hain: memoization sirf wo compute karta hai jo top-level call asal mein chahti hai, tabulation poori table bharta hai.',
      },
      {
        q: 'You have memoised a recursion and it works. When and why would you rewrite it as bottom-up tabulation?',
        qHi: 'Aapne ek recursion memoise ki aur ye kaam karti hai. Aap ise bottom-up tabulation ki tarah kab aur kyun dobara likhoge?',
        a: 'There are three main reasons to convert. The first is stack safety. A memoised recursion still recurses to the full depth of the dependency chain before any answer comes back, so on an input with a long chain — say a DP over a string of length one hundred thousand — the call stack can overflow even though the total work is linear. Tabulation has no recursion and no such limit. The second is space optimisation. Once the subproblems are laid out in an explicit fill order, it usually becomes visible that each state depends on only the last row, or the last two entries, of the table. That lets you throw away everything older and keep a constant or one-dimensional amount of state instead of the whole table. This optimisation is much harder to see and apply inside a recursion, where the cache holds every key that was ever queried. The third is constant factors and predictability. A tight loop over an array has better cache locality and no function-call overhead per subproblem, so tabulation is typically faster by a meaningful constant, and its running time is easy to state precisely as table size times per-cell work. The trade-off is that tabulation computes every subproblem in the range, including ones the top-level query would never have reached, whereas memoization is lazy. So for a problem where only a sparse subset of the state space is actually reachable, memoization can be faster and you might keep it. And memoization is almost always quicker to write first, so a common workflow is: memoise to get it correct, then convert to tabulation and optimise space once the recurrence is confirmed.',
        aHi: 'Convert karne ke teen mukhya kaaran hain. Pehla stack safety hai. Ek memoised recursion abhi bhi dependency chain ki poori depth tak recurse karti hai isse pehle ki koi jawaab wapas aaye, isliye ek lambi chain waale input par — maano length ek lakh ki ek string par DP — call stack overflow ho sakta hai chahe kul kaam linear hai. Tabulation mein koi recursion aur aisi koi limit nahi. Doosra space optimisation hai. Ek baar subproblems ek spasht fill order mein rakhe jaate hain, aksar drishyaman ho jaata hai ki har state sirf table ki aakhri row, ya aakhri do entries par nirbhar karta hai. Wo aapko har purani cheez phenkne aur poori table ke bajaye ek constant ya one-dimensional maatra state rakhne deta hai. Ye optimisation ek recursion ke andar dekhna aur lagaana kaafi mushkil hai, jahaan cache har key rakhta hai jo kabhi query hui. Teesra constant factors aur predictability hai. Ek array par ek tight loop ka behtar cache locality aur prati subproblem koi function-call overhead nahi, isliye tabulation typically ek maayne rakhne waale constant se tez hai, aur iska running time table size guna prati-cell kaam ki tarah thik-thik batana aasaan hai. Trade-off ye hai ki tabulation range mein har subproblem compute karta hai, un waale bhi jinpar top-level query kabhi nahi pahunchti, jabki memoization lazy hai. Toh ek aisi problem ke liye jahaan state space ka sirf ek sparse subset asal mein reachable hai, memoization tez ho sakta hai aur aap ise rakh sakte ho. Aur memoization lagbhag hamesha pehle likhne mein tez hai, isliye ek aam workflow hai: sahi paane ke liye memoise karo, phir tabulation mein convert karo aur ek baar recurrence confirm ho space optimise karo.',
      },
    ],

    exercises: [
      {
        task: 'Implement waysNaive, waysMemo, waysTab, and waysO1 for climbing stairs. Add a call counter to the naive one. Compare call counts / timings for n = 10, 20, 30, 40.',
        taskHi: 'Climbing stairs ke liye waysNaive, waysMemo, waysTab, aur waysO1 implement karo. Naive waale mein ek call counter jodo. n = 10, 20, 30, 40 ke liye call counts / timings compare karo.',
        hint: 'The naive version becomes visibly slow around n = 40. The other three should be instant for any n up to a few thousand (watch for integer precision beyond ~78).',
        hintHi: 'Naive version n = 40 ke aas-paas drishyaman roop se slow ho jaata hai. Baaki teen kuch hazaar tak kisi bhi n ke liye turant hone chahiye (~78 ke baad integer precision ke liye dhyaan do).',
      },
      {
        task: 'Solve "min cost climbing stairs": cost[i] is the cost to step on stair i; you can start at index 0 or 1 and take 1 or 2 steps; find the minimum total cost to reach the top (past the last index). Do it with memoization, then convert to O(1)-space tabulation.',
        taskHi: '"min cost climbing stairs" solve karo: cost[i] stair i par step karne ki cost hai; aap index 0 ya 1 par shuru kar sakte ho aur 1 ya 2 steps le sakte ho; top (aakhri index ke aage) tak pahunchne ki minimum kul cost dhoondho. Ise memoization se karo, phir O(1)-space tabulation mein convert karo.',
        hint: 'State: dp[i] = min cost to reach stair i. Recurrence: dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Answer: min(dp[n-1], dp[n-2]).',
        hintHi: 'State: dp[i] = stair i tak pahunchne ki min cost. Recurrence: dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Answer: min(dp[n-1], dp[n-2]).',
      },
      {
        task: 'Take a problem with optimal substructure but no overlap — e.g. "sum of an array via recursive split in half" — and confirm that memoising it by range gives zero cache hits. Explain in one sentence why it is divide-and-conquer, not DP.',
        taskHi: 'Ek aisi problem lo jiska optimal substructure hai par koi overlap nahi — jaise "ek array ka sum recursive split in half se" — aur confirm karo ki ise range se memoise karna zero cache hits deta hai. Ek vaakya mein samjhaao ki ye divide-and-conquer kyun hai, DP nahi.',
        hint: 'Every (lo, hi) range in the split is distinct — no two recursive calls ever ask for the same range — so the memo Map grows to O(n) entries and never returns a cached value.',
        hintHi: 'Split mein har (lo, hi) range distinct hai — koi do recursive calls kabhi wahi range nahi maangti — isliye memo Map O(n) entries tak badhta hai aur kabhi ek cached value return nahi karta.',
      },
    ],

    keyTakeaways: [
      'A problem is a DP problem if it has optimal substructure (the answer builds from answers to smaller subproblems) AND overlapping subproblems (a naive recursion re-solves the same ones).',
      'Optimal substructure without overlap is divide-and-conquer (e.g. merge sort), not DP — a memo would never hit.',
      'Memoization (top-down): keep the natural recursion, add a cache so each subproblem is computed once. Fast to write; risks stack overflow; computes only needed states.',
      'Tabulation (bottom-up): fill an array of subproblem answers in dependency order with a loop. No recursion; makes space optimisation obvious; fills the whole table.',
      'The method: (1) define the state, (2) write the recurrence, (3) base cases, (4) fill order, (5) which state is the answer, (6) optimise space if dp depends on only recent states.',
      'DP running time = (number of distinct subproblems) x (work per subproblem) — the memo-table size times the per-cell cost.',
    ],
    keyTakeawaysHi: [
      'Ek problem ek DP problem hai agar iska optimal substructure hai (jawaab chhote subproblems ke jawaabon se banta hai) AUR overlapping subproblems (ek naive recursion wahi ko re-solve karti hai).',
      'Overlap ke bina optimal substructure divide-and-conquer hai (jaise merge sort), DP nahi — ek memo kabhi hit nahi karta.',
      'Memoization (top-down): natural recursion rakho, ek cache jodo taaki har subproblem ek baar compute ho. Likhne mein tez; stack overflow ka risk; sirf zaroori states compute karta hai.',
      'Tabulation (bottom-up): subproblem jawaabon ka ek array dependency order mein ek loop se bharo. Koi recursion nahi; space optimisation ko spasht banaata hai; poori table bharta hai.',
      'Method: (1) state define karo, (2) recurrence likho, (3) base cases, (4) fill order, (5) kaunsa state jawaab hai, (6) space optimise karo agar dp sirf haaliya states par nirbhar karta hai.',
      'DP running time = (distinct subproblems ki tadaad) x (prati subproblem kaam) — memo-table size guna prati-cell cost.',
    ],
  },
];
