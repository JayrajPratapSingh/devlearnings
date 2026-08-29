/**
 * DSA Complete Course — Module 13: Bit Manipulation, lesson 3
 * (final lesson of Module 13).
 *
 * Bitmask as a DP state: when a subproblem is "which elements of a small set
 * (n <= ~20) have I already used / visited / assigned", represent that set as an
 * integer whose bit i means "element i is in the set". Builds on this module's
 * lessons 1-2 (bit operators, testing/setting a bit, iterating set bits) and
 * this course's Module 11 (DP: state / recurrence / fill order) and Module 9
 * (the travelling-salesman tour is a graph problem). Broken example: a DP or
 * memoised recursion whose state is "the set of items already assigned",
 * represented as a JavaScript array or Set — you cannot use an array as an
 * object key without stringifying it, the memo key handling is slow and
 * error-prone, and there is no cheap way to enumerate subsets. Fixed by encoding
 * the set as a single integer bitmask: dp is an array indexed 0..2^n - 1, "is
 * element i used" is `mask & (1 << i)`, "use element i" is `mask | (1 << i)`, and
 * the whole DP is a clean loop over 2^n masks.
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

export const DSA_MODULE_13_PART3: CourseLesson[] = [
  {
    slug: 'bitmask-dp-subsets-as-integers',
    title: 'Bitmask DP: A Subset Is an Integer',
    titleHi: 'Bitmask DP: Ek Subset Ek Integer Hai',
    description: 'A DP whose state is "which of the n tasks have already been assigned", written with a JavaScript Set or a boolean array as the state. You cannot index a memo table by a Set, stringifying it as a key is slow and fiddly, and there is no clean way to loop over all possible subsets.',
    descriptionHi: 'Ek DP jiska state "n tasks mein se kaunse pehle se assigned hain" hai, ek JavaScript Set ya ek boolean array ki tarah state ke saath likha gaya. Aap ek Set se ek memo table index nahi kar sakte, ise ek key ki tarah stringify karna slow aur fiddly hai, aur sab sambhaavit subsets par loop karne ka koi saaf tarika nahi.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**Tracking which of twelve chores are done using a single number instead of a checklist with twelve boxes.** A checklist works, but if you want to look up "what is the best plan given exactly this set of chores remaining", the checklist is awkward as a lookup key — you would have to write out the whole pattern of ticks and crosses as a label. A cleaner trick: assign chore zero the value 1, chore one the value 2, chore two the value 4, and so on, doubling. The "state" of your progress is then just the sum of the values of the completed chores — one number between 0 (nothing done) and 4095 (all twelve done). Every possible combination of done and not-done chores maps to a distinct number in that range, so you can keep an array of 4096 slots, one per state, and store the best plan for each. Asking "is chore five done in this state" is checking whether the number has the 32s bit; "mark chore five done" is adding 32 (if it was not already there). The number IS the checklist, just in a form a computer can use as an array index directly.',
      hi: '**Baarah chores mein se kaunse done hain track karna ek akele number se ek baarah boxes waali checklist ke bajaye.** Ek checklist kaam karti hai, par agar aap "bilkul is set of chores baaki ke hisaab se best plan kya hai" dekhna chahte ho, checklist ek lookup key ki tarah awkward hai. Ek saaf trick: chore zero ko value 1 assign karo, chore one ko value 2, chore two ko value 4, aur aise hi, doguna karte hue. Aapki progress ka "state" phir bas completed chores ki values ka sum hai — 0 (kuch nahi done) aur 4095 (sab baarah done) ke beech ek number. Done aur not-done chores ka har sambhaavit combination us range mein ek distinct number se map hota hai, isliye aap 4096 slots ka ek array rakh sakte ho, prati state ek, aur har ke liye best plan store karo. "Kya is state mein chore paanch done hai" poochna ye check karna hai ki number ke 32s bit hai; "chore paanch done mark karo" 32 jodna hai (agar ye pehle se wahaan nahi tha). Number HI checklist hai, bas ek form mein jise ek computer seedhe ek array index ki tarah istemal kar sakta hai.',
    },

    simple: `**Start broken.** DP state as a Set (or boolean array), keyed by stringifying:

\`\`\`js
// assign n tasks to n workers; cost[w][t] is worker w doing task t. minimise total.
function minCostBroken(cost) {
  const n = cost.length;
  const memo = new Map();
  function solve(worker, used) {           // used is a Set of assigned task indices
    if (worker === n) return 0;
    const key = worker + ':' + [...used].sort().join(',');   // slow, allocates every call
    if (memo.has(key)) return memo.get(key);
    let best = Infinity;
    for (let t = 0; t < n; t++) {
      if (!used.has(t)) {
        used.add(t);
        best = Math.min(best, cost[worker][t] + solve(worker + 1, used));
        used.delete(t);                    // mutate-and-restore is bug-prone
      }
    }
    memo.set(key, best);
    return best;
  }
  return solve(0, new Set());
}
\`\`\`

The Set works, but the memo key is a sorted-join string built on every call (allocation + sort per node), and the "add, recurse, delete" mutation dance is a classic source of bugs. There is also no clean way to iterate all subsets.

**The fix: the set of used tasks IS an integer bitmask**

\`\`\`js
function minCost(cost) {
  const n = cost.length;
  const FULL = (1 << n) - 1;
  // dp[mask] = min cost to assign the tasks in 'mask' to workers 0..popcount(mask)-1
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === Infinity) continue;
    const worker = popcount(mask);         // this many tasks assigned -> this worker is next
    if (worker === n) continue;
    for (let t = 0; t < n; t++) {
      if ((mask & (1 << t)) === 0) {        // task t not yet assigned
        const next = mask | (1 << t);
        dp[next] = Math.min(dp[next], dp[mask] + cost[worker][t]);
      }
    }
  }
  return dp[FULL];
}

function popcount(m) { let c = 0; while (m) { m &= m - 1; c++; } return c; }
\`\`\`

\`\`\`ts
function minCost(cost: number[][]): number {
  const n = cost.length;
  const FULL = (1 << n) - 1;
  const dp = new Array<number>(1 << n).fill(Infinity);
  dp[0] = 0;
  const popcount = (m: number): number => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === Infinity) continue;
    const worker = popcount(mask);
    if (worker === n) continue;
    for (let t = 0; t < n; t++) {
      if ((mask & (1 << t)) === 0) {
        const next = mask | (1 << t);
        dp[next] = Math.min(dp[next]!, dp[mask]! + cost[worker]![t]!);
      }
    }
  }
  return dp[FULL]!;
}
\`\`\`

- **State**: \`mask\`, an integer in \`[0, 2^n)\`; bit \`t\` set means task \`t\` is assigned. \`dp[mask]\` = min cost to have assigned exactly that set.
- **Transition**: from \`mask\`, the next worker is \`popcount(mask)\`; try each unassigned task \`t\`, moving to \`mask | (1 << t)\`.
- **Order**: increasing \`mask\` — adding a task only ever sets a bit, so \`mask | (1 << t) > mask\`, meaning every predecessor mask is processed first.
- **Answer**: \`dp[(1 << n) - 1]\` (all tasks assigned).

Time O(2^n * n), space O(2^n). Feasible for \`n\` up to about 20 (\`2^20\` is ~1M).`,

    simpleHi: `**Toote hue se shuru.** DP state ek Set ki tarah (ya boolean array), stringify karke keyed:

\`\`\`js
// n tasks ko n workers ko assign karo; cost[w][t] worker w task t karta hai. Total minimise karo.
function minCostBroken(cost) {
  const n = cost.length;
  const memo = new Map();
  function solve(worker, used) {           // used assigned task indices ka ek Set hai
    if (worker === n) return 0;
    const key = worker + ':' + [...used].sort().join(',');   // slow, har call allocate
    if (memo.has(key)) return memo.get(key);
    let best = Infinity;
    for (let t = 0; t < n; t++) {
      if (!used.has(t)) {
        used.add(t);
        best = Math.min(best, cost[worker][t] + solve(worker + 1, used));
        used.delete(t);                    // mutate-and-restore bug-prone hai
      }
    }
    memo.set(key, best);
    return best;
  }
  return solve(0, new Set());
}
\`\`\`

Set kaam karta hai, par memo key har call par bana ek sorted-join string hai (prati node allocation + sort), aur "add, recurse, delete" mutation dance bugs ka ek classic srot hai. Sab subsets iterate karne ka bhi koi saaf tarika nahi.

**Fix: used tasks ka set EK integer bitmask HAI**

\`\`\`js
function minCost(cost) {
  const n = cost.length;
  const FULL = (1 << n) - 1;
  // dp[mask] = 'mask' mein tasks ko workers 0..popcount(mask)-1 ko assign karne ki min cost
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === Infinity) continue;
    const worker = popcount(mask);         // itne tasks assigned -> ye worker agla hai
    if (worker === n) continue;
    for (let t = 0; t < n; t++) {
      if ((mask & (1 << t)) === 0) {        // task t abhi assigned nahi
        const next = mask | (1 << t);
        dp[next] = Math.min(dp[next], dp[mask] + cost[worker][t]);
      }
    }
  }
  return dp[FULL];
}

function popcount(m) { let c = 0; while (m) { m &= m - 1; c++; } return c; }
\`\`\`

\`\`\`ts
function minCost(cost: number[][]): number {
  const n = cost.length;
  const FULL = (1 << n) - 1;
  const dp = new Array<number>(1 << n).fill(Infinity);
  dp[0] = 0;
  const popcount = (m: number): number => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === Infinity) continue;
    const worker = popcount(mask);
    if (worker === n) continue;
    for (let t = 0; t < n; t++) {
      if ((mask & (1 << t)) === 0) {
        const next = mask | (1 << t);
        dp[next] = Math.min(dp[next]!, dp[mask]! + cost[worker]![t]!);
      }
    }
  }
  return dp[FULL]!;
}
\`\`\`

- **State**: \`mask\`, \`[0, 2^n)\` mein ek integer; bit \`t\` set matlab task \`t\` assigned hai. \`dp[mask]\` = bilkul us set ko assign karne ki min cost.
- **Transition**: \`mask\` se, agla worker \`popcount(mask)\` hai; har unassigned task \`t\` try karo, \`mask | (1 << t)\` par jaate hue.
- **Order**: badhta \`mask\` — ek task jodna sirf ek bit set karta hai, isliye \`mask | (1 << t) > mask\`, matlab har predecessor mask pehle process hota hai.
- **Answer**: \`dp[(1 << n) - 1]\` (sab tasks assigned).

Time O(2^n * n), space O(2^n). \`n\` lagbhag 20 tak feasible (\`2^20\` ~1M hai).`,

    content: `## Travelling salesman: state is (visited set, current city)

\`\`\`js
// dp[mask][i] = shortest path that starts at 0, visits exactly the cities in
// 'mask', and currently sits at city i (which must be in mask).
function tsp(dist) {
  const n = dist.length;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  dp[1][0] = 0;                                  // started at city 0, only city 0 visited

  for (let mask = 1; mask < (1 << n); mask++) {
    for (let i = 0; i < n; i++) {
      if (dp[mask][i] === Infinity) continue;
      for (let j = 0; j < n; j++) {
        if (mask & (1 << j)) continue;            // j already visited
        const next = mask | (1 << j);
        dp[next][j] = Math.min(dp[next][j], dp[mask][i] + dist[i][j]);
      }
    }
  }
  // close the tour back to city 0
  let best = Infinity;
  for (let i = 1; i < n; i++) best = Math.min(best, dp[(1 << n) - 1][i] + dist[i][0]);
  return best;
}
\`\`\`

This is the Held-Karp algorithm: O(2^n * n^2), which turns the factorial brute force (n! orderings) into something feasible up to n around 18-20. The state needs *two* parts — which cities are visited (the mask) and where you currently are (\`i\`) — because the cost of the next move depends on the current city.

## The submask enumeration, and why the total is O(3^n)

\`\`\`js
// for every mask, iterate every subset (submask) of it:
for (let mask = 0; mask < (1 << n); mask++) {
  for (let sub = mask; ; sub = (sub - 1) & mask) {
    // ... dp over (mask, sub) ...
    if (sub === 0) break;
  }
}
\`\`\`

\`(sub - 1) & mask\` produces the next-smaller subset of \`mask\`. Counting (mask, submask) pairs: each of the n bits is in one of three states — not in mask, in mask but not sub, in both — so there are exactly 3^n pairs. That is far less than the 4^n you would get by looping all masks against all masks. This pattern appears in partition-into-groups DPs (e.g. "minimum number of teams", "smallest sufficient team").

## When bitmask DP applies, and the size limit

\`\`\`
Use it when:
  - a subproblem is "which elements of a set have I used / covered / visited"
  - AND the set is small: n <= ~20 for O(2^n * poly(n)),
    n <= ~40 with meet-in-the-middle splitting.

Do NOT use it when:
  - n is large (2^n blows up) -> look for a polynomial DP or a greedy
  - the state also needs a non-bounded quantity (a running sum over a big range)
\`\`\`

The n <= 20 ceiling is the giveaway in a problem statement: an explicit small bound on the number of items, cities, or people, combined with a "cover all / visit all / assign all" objective, is the signal to reach for a bitmask.

## Common bit-state operations in the DP loop

\`\`\`
mask & (1 << i)          is element i in the set?
mask | (1 << i)          add element i
mask & ~(1 << i)         remove element i
mask === (1 << n) - 1    is the set complete?
popcount(mask)           how many elements are in the set
(mask >> i) & 1          bit i as 0 or 1
for (sub = mask; sub; sub = (sub-1)&mask)   iterate non-empty subsets of mask
\`\`\`

## Space: iterative masks, and rolling by popcount

\`\`\`
The assignment DP above only ever moves from a mask to a mask with one more bit,
so dp[mask] depends only on masks with popcount exactly one less. You can group
masks by popcount and keep two layers, cutting space from O(2^n) to
O(C(n, n/2)) — a meaningful saving for the largest n. TSP does not have this
structure (dp[mask][i] can come from any i), so it keeps the full table.
\`\`\``,

    contentHi: `## Travelling salesman: state (visited set, current city) hai

\`\`\`js
// dp[mask][i] = sabse chhota path jo 0 par shuru hota hai, bilkul 'mask' ki cities
// visit karta hai, aur abhi city i par hai (jo mask mein hona chahiye).
function tsp(dist) {
  const n = dist.length;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  dp[1][0] = 0;                                  // city 0 par shuru, sirf city 0 visited

  for (let mask = 1; mask < (1 << n); mask++) {
    for (let i = 0; i < n; i++) {
      if (dp[mask][i] === Infinity) continue;
      for (let j = 0; j < n; j++) {
        if (mask & (1 << j)) continue;            // j pehle se visited
        const next = mask | (1 << j);
        dp[next][j] = Math.min(dp[next][j], dp[mask][i] + dist[i][j]);
      }
    }
  }
  // tour ko city 0 par wapas band karo
  let best = Infinity;
  for (let i = 1; i < n; i++) best = Math.min(best, dp[(1 << n) - 1][i] + dist[i][0]);
  return best;
}
\`\`\`

Ye Held-Karp algorithm hai: O(2^n * n^2), jo factorial brute force (n! orderings) ko n around 18-20 tak feasible kuch mein badalta hai. State ko *do* parts chahiye — kaunsi cities visited hain (mask) aur aap abhi kahaan ho (\`i\`) — kyunki agle move ki cost current city par nirbhar karti hai.

## Submask enumeration, aur total O(3^n) kyun hai

\`\`\`js
// har mask ke liye, iska har subset (submask) iterate karo:
for (let mask = 0; mask < (1 << n); mask++) {
  for (let sub = mask; ; sub = (sub - 1) & mask) {
    // ... (mask, sub) par dp ...
    if (sub === 0) break;
  }
}
\`\`\`

\`(sub - 1) & mask\` \`mask\` ka next-smaller subset banaata hai. (mask, submask) pairs ginna: n bits mein se har ek teen states mein se ek mein hai — mask mein nahi, mask mein par sub mein nahi, dono mein — isliye bilkul 3^n pairs hain. Wo 4^n se kaafi kam hai jo aapko sab masks ko sab masks ke against loop karke milega. Ye pattern partition-into-groups DPs mein dikhta hai.

## Bitmask DP kab lagta hai, aur size limit

\`\`\`
Ise istemal karo jab:
  - ek subproblem "ek set ke kaunse elements maine istemal / cover / visit kiye" hai
  - AUR set chhota hai: O(2^n * poly(n)) ke liye n <= ~20,
    meet-in-the-middle splitting ke saath n <= ~40.

Ise istemal MAT karo jab:
  - n bada hai (2^n blow up) -> ek polynomial DP ya ek greedy dhoondho
  - state ko ek non-bounded quantity bhi chahiye (ek bade range par ek running sum)
\`\`\`

n <= 20 ceiling problem statement mein giveaway hai: items, cities, ya people ki tadaad par ek explicit chhota bound, ek "cover all / visit all / assign all" objective ke saath, ek bitmask ki taraf pahunchne ka signal hai.

## DP loop mein common bit-state operations

\`\`\`
mask & (1 << i)          kya element i set mein hai?
mask | (1 << i)          element i add karo
mask & ~(1 << i)         element i remove karo
mask === (1 << n) - 1    kya set complete hai?
popcount(mask)           set mein kitne elements hain
(mask >> i) & 1          bit i 0 ya 1 ki tarah
for (sub = mask; sub; sub = (sub-1)&mask)   mask ke non-empty subsets iterate karo
\`\`\`

## Space: iterative masks, aur popcount se rolling

\`\`\`
Upar ka assignment DP sirf ek mask se ek mask par ek zyaada bit ke saath jaata hai,
isliye dp[mask] sirf bilkul ek kam popcount waale masks par nirbhar karta hai. Aap
masks ko popcount se group kar sakte ho aur do layers rakh sakte ho, space O(2^n)
se O(C(n, n/2)) kaat kar — sabse bade n ke liye ek maayne rakhne wali saving. TSP
mein ye structure nahi hai (dp[mask][i] kisi bhi i se aa sakta hai), isliye ye poori
table rakhta hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: Set-as-state with a stringified memo key',
        titleHi: 'Toota: Set-as-state ek stringified memo key ke saath',
        code: `const key = worker + ':' + [...used].sort().join(',');   // alloc + sort per call`,
        codeJs: `function minCostBroken(cost) {
  const n = cost.length, memo = new Map();
  function solve(worker, used) {
    if (worker === n) return 0;
    const key = worker + ':' + [...used].sort().join(',');
    if (memo.has(key)) return memo.get(key);
    let best = Infinity;
    for (let t = 0; t < n; t++) if (!used.has(t)) {
      used.add(t);
      best = Math.min(best, cost[worker][t] + solve(worker + 1, used));
      used.delete(t);
    }
    memo.set(key, best);
    return best;
  }
  return solve(0, new Set());
}`,
        codeTs: `// The Set works but every call allocates a new key string and sorts it;
// the mutate-then-restore of 'used' is a frequent bug source.`,
        output: `// correct result, but slow key handling and error-prone mutation`,
        explain: 'A Set cannot be a Map key directly, so it is serialised on every call. The add/recurse/delete dance must be perfectly balanced or the state leaks between branches.',
        explainHi: 'Ek Set seedhe ek Map key nahi ho sakta, isliye ye har call par serialise hota hai. add/recurse/delete dance perfectly balanced hona chahiye warna state branches ke beech leak hota hai.',
      },
      {
        title: 'Fixed: the used-set is an integer, dp is a flat array',
        titleHi: 'Theek: used-set ek integer hai, dp ek flat array hai',
        code: `const next = mask | (1 << t);
dp[next] = Math.min(dp[next], dp[mask] + cost[worker][t]);`,
        codeJs: `function minCost(cost) {
  const n = cost.length, FULL = (1 << n) - 1;
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;
  const pc = m => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === Infinity) continue;
    const w = pc(mask);
    if (w === n) continue;
    for (let t = 0; t < n; t++) if ((mask & (1 << t)) === 0) {
      const nx = mask | (1 << t);
      dp[nx] = Math.min(dp[nx], dp[mask] + cost[w][t]);
    }
  }
  return dp[FULL];
}
console.log(minCost([[9,2,7],[6,4,3],[5,8,1]])); // 13  (worker0->task1=2, w1->t2=3, w2->t0=5... actually 2+3+8? trace it)`,
        codeTs: `function minCost(cost: number[][]): number {
  const n = cost.length, FULL = (1 << n) - 1;
  const dp = new Array<number>(1 << n).fill(Infinity);
  dp[0] = 0;
  const pc = (m: number): number => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
  for (let mask = 0; mask <= FULL; mask++) {
    if (dp[mask] === Infinity) continue;
    const w = pc(mask);
    if (w === n) continue;
    for (let t = 0; t < n; t++) if ((mask & (1 << t)) === 0) {
      const nx = mask | (1 << t);
      dp[nx] = Math.min(dp[nx]!, dp[mask]! + cost[w]![t]!);
    }
  }
  return dp[FULL]!;
}`,
        outputJs: `13`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The subset of assigned tasks is a single integer, so dp is a plain array of size 2^n, "task t used?" is one AND, and "use task t" is one OR. The loop over masks is in dependency order automatically.',
        explainHi: 'Assigned tasks ka subset ek akela integer hai, isliye dp size 2^n ka ek plain array hai, "task t used?" ek AND hai, aur "task t use karo" ek OR hai. Masks par loop automatically dependency order mein hai.',
      },
      {
        title: 'TSP (Held-Karp): state is (visited mask, current city)',
        titleHi: 'TSP (Held-Karp): state (visited mask, current city) hai',
        code: `dp[mask | (1 << j)][j] = min(..., dp[mask][i] + dist[i][j]);`,
        codeJs: `function tsp(dist) {
  const n = dist.length;
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  dp[1][0] = 0;
  for (let mask = 1; mask < (1 << n); mask++)
    for (let i = 0; i < n; i++) {
      if (dp[mask][i] === Infinity) continue;
      for (let j = 0; j < n; j++) if (!(mask & (1 << j))) {
        const nx = mask | (1 << j);
        dp[nx][j] = Math.min(dp[nx][j], dp[mask][i] + dist[i][j]);
      }
    }
  let best = Infinity;
  for (let i = 1; i < n; i++) best = Math.min(best, dp[(1 << n) - 1][i] + dist[i][0]);
  return best;
}
console.log(tsp([[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]])); // 80`,
        codeTs: `// dp[mask][i]: shortest walk from city 0 visiting exactly 'mask', ending at i.
// O(2^n * n^2) — feasible up to n ~ 18-20, versus n! for brute force.`,
        outputJs: `80`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The mask alone is not a sufficient state — the cost of the next hop depends on which city you are standing in. So the state carries both the visited set and the current city.',
        explainHi: 'Akela mask ek kaafi state nahi hai — agle hop ki cost is par nirbhar karti hai ki aap kaunsi city mein khade ho. Toh state visited set aur current city dono le jaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// using a bitmask when n is large
const dp = new Array(1 << n).fill(0);   // n = 30 -> 1 billion entries -> crash`,
        right: `// bitmask DP is only for n up to ~20 (2^20 ~ 1M). For larger n, find a
// polynomial DP, a greedy, or use meet-in-the-middle to split into two n/2 halves.`,
        why: '2^n grows explosively. At n = 25 the table is 33M entries; at n = 30 it is a billion. The technique is specifically for problems that guarantee a small item count.',
        whyHi: '2^n visphotak roop se badhta hai. n = 25 par table 33M entries hai; n = 30 par ek billion. Technique khaas taur par un problems ke liye hai jo ek chhoti item count guarantee karti hain.',
      },
      {
        wrong: `// TSP with state = mask only (dropping the current city)
dp[mask] = ...;   // cannot compute the next dist[?][j] without knowing where you are`,
        right: `dp[mask][i] = ...;   // include the current city i in the state`,
        why: 'The transition cost dist[i][j] depends on the current city i. If the state does not record i, two different tours ending at different cities collapse to the same state and the recurrence is wrong.',
        whyHi: 'Transition cost dist[i][j] current city i par nirbhar karti hai. Agar state i record nahi karta, alag cities par khatam hone waale do alag tours usi state mein collapse hote hain aur recurrence galat hai.',
      },
      {
        wrong: `// iterating masks in the wrong order for a "remove a bit" transition
for (let mask = 0; mask < (1 << n); mask++) dp[mask] = f(dp[mask | (1 << i)]);
// dp[mask | (1 << i)] > mask has not been computed yet`,
        right: `// if the transition ADDS a bit, iterate masks ascending (predecessors are smaller).
// if it REMOVES a bit, iterate masks descending, or restructure so you always add.`,
        why: 'Bitmask DP still needs dependency-order fill. Adding a bit increases the integer, so ascending order works; removing a bit decreases it, so you would need descending order.',
        whyHi: 'Bitmask DP ko abhi bhi dependency-order fill chahiye. Ek bit jodna integer badhaata hai, isliye ascending order kaam karta hai; ek bit hataana ise ghataata hai, isliye aapko descending order chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Route optimisation for a small number of stops** — a delivery van with 10-15 drops, a drone with a handful of waypoints — uses Held-Karp bitmask DP to find the exact optimal tour.',
        hi: '**Chhoti tadaad stops ke liye route optimisation** — 10-15 drops waali ek delivery van, kuch waypoints waala ek drone — exact optimal tour dhoondhne ke liye Held-Karp bitmask DP istemal karta hai.',
      },
      {
        en: '**Task / shift assignment** where a bounded set of jobs must each be given to exactly one of a bounded set of workers is the assignment DP; also solvable in polynomial time by the Hungarian algorithm for larger n.',
        hi: '**Task / shift assignment** jahaan jobs ke ek bounded set ko har ek workers ke ek bounded set mein se bilkul ek ko dena hai assignment DP hai; bade n ke liye Hungarian algorithm se polynomial time mein bhi solvable.',
      },
      {
        en: '**Team / group formation** ("minimum teams so every required skill is covered") uses subset DP with the mask representing the set of skills covered so far.',
        hi: '**Team / group formation** ("minimum teams taaki har required skill cover ho") subset DP istemal karta hai jismein mask ab tak covered skills ke set ko represent karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'When you see a problem, what features tell you to reach for a bitmask DP, and what is the size limit?',
        qHi: 'Jab aap ek problem dekhte ho, kaunse features aapko ek bitmask DP ki taraf pahunchne ko kehte hain, aur size limit kya hai?',
        a: 'The strongest signal is a small explicit bound on the number of items in the problem, typically written as something like n is at most twenty, or fifteen, or sometimes eighteen, applied to a set of tasks, cities, people, skills, or nodes. That bound is unusual and specific, and it exists precisely because the intended solution has a factor of two to the n in it. The second signal is that a natural subproblem is described by which elements of that set you have already used, visited, covered, or assigned, rather than by a position or a count. If you can phrase the state as a subset of a small set, that subset is an integer bitmask and dp becomes a flat array indexed from zero to two to the n minus one. Checking membership is one AND, adding an element is one OR, and iterating all subsets or all submasks is a short loop. The size limit comes from the two-to-the-n factor. At n equals twenty the table has about a million entries, which is fine; each entry might do order n or n squared work, so the total is a million times twenty or a million times four hundred, both feasible. At n equals twenty-five it is thirty-three million entries, borderline. At n equals thirty it is a billion, which does not fit. So the practical ceiling is around twenty for a plain bitmask DP, and you can push to around forty using meet-in-the-middle, where you split the set into two halves of size n over two, solve each half with a two-to-the-n-over-two DP, and combine. If the bound in the problem is larger than that, the bitmask is the wrong approach and you should look for a polynomial dynamic program, a greedy, or a flow formulation instead.',
        aHi: 'Sabse strong signal problem mein items ki tadaad par ek chhota explicit bound hai, typically n zyaada se zyaada bees, ya pandrah, ya kabhi atthaarah ki tarah likha, tasks, cities, people, skills, ya nodes ke ek set par lagaya gaya. Wo bound asaadhaaran aur specific hai, aur ye bilkul isliye maujood hai kyunki intended solution mein ismein two ki n ka ek factor hai. Doosra signal ye hai ki ek natural subproblem is baat se describe hota hai ki aapne us set ke kaunse elements pehle se istemal, visit, cover, ya assign kiye, na ki ek position ya count se. Agar aap state ko ek chhote set ke ek subset ki tarah phrase kar sakte ho, wo subset ek integer bitmask hai aur dp zero se two ki n minus one tak indexed ek flat array ban jaata hai. Membership check karna ek AND hai, ek element add karna ek OR hai, aur sab subsets ya sab submasks iterate karna ek chhota loop hai. Size limit two-ki-n factor se aati hai. n bees par table mein lagbhag ek million entries hain, jo theek hai. n pachees par ye tetees million entries hai, borderline. n tees par ye ek billion hai, jo fit nahi hota. Toh vyaavahaarik ceiling ek plain bitmask DP ke liye lagbhag bees hai, aur aap meet-in-the-middle istemal karke lagbhag chaalees tak push kar sakte ho.',
      },
      {
        q: 'For the travelling salesman problem, why does the DP state need both the visited-set mask and the current city, and what complexity does that give?',
        qHi: 'Travelling salesman problem ke liye, DP state ko visited-set mask aur current city dono kyun chahiye, aur wo kya complexity deta hai?',
        a: 'A subproblem in Held-Karp is: I have started my tour at city zero, I have so far visited exactly the set of cities in this mask, and I am currently standing in one particular city within that set; what is the shortest walk that achieves this. The mask alone is not enough to describe this subproblem, because the value we ultimately want, the total tour length, extends by adding the distance from where I currently am to the next city I visit, and that distance depends on my current position. Two different partial tours could visit the same set of cities but end at different cities, and they would need different future moves and could have different optimal completions. If the state collapsed both of those into a single dp entry keyed only by the mask, the recurrence would have no way to know which last city to measure the next hop from, and it would produce wrong answers. So the state is the pair, mask and current city i, and dp of mask and i is the shortest walk from city zero that visits exactly the cities in mask and ends at i. The transition, from a state where I am at i having visited mask, is to pick an unvisited city j, move there for a cost of the distance from i to j, and land in the state where the mask now includes j and the current city is j. There are two to the n possible masks and n possible current cities, so two to the n times n states. Each state tries up to n next cities, so the work per state is order n. The total is two to the n times n squared, which is dramatically better than the n factorial of trying every ordering, and makes exact TSP feasible for n up to roughly eighteen to twenty.',
        aHi: 'Held-Karp mein ek subproblem hai: maine apna tour city zero par shuru kiya, maine ab tak bilkul is mask ki cities ka set visit kiya, aur main abhi us set ke andar ek khaas city mein khada hoon; sabse chhota walk kya hai jo ise haasil karta hai. Akela mask is subproblem ko describe karne ke liye kaafi nahi hai, kyunki jo value hum aakhirkaar chahte hain, total tour length, main abhi jahaan hoon se agli city jo main visit karta hoon tak ki distance jodkar extend hoti hai, aur wo distance meri current position par nirbhar karti hai. Do alag partial tours wahi set of cities visit kar sakte hain par alag cities par khatam ho sakte hain, aur unhe alag future moves chahiye. Agar state dono ko ek akele dp entry mein sirf mask se keyed collapse karta, recurrence ko koi tarika nahi hota jaanne ka ki agle hop ko kaunsi last city se measure karna hai. Toh state jodi hai, mask aur current city i, aur dp of mask aur i sabse chhota walk hai city zero se jo bilkul mask ki cities visit karta hai aur i par khatam hota hai. Do ki n possible masks aur n possible current cities hain, isliye do ki n guna n states. Har state n tak next cities try karta hai, isliye prati state kaam order n hai. Total do ki n guna n squared hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement minCost (assignment via bitmask DP). Test on [[9,2,7],[6,4,3],[5,8,1]] and confirm against a brute-force over all n! permutations for n = 3, 4, 5.',
        taskHi: 'minCost (bitmask DP se assignment) implement karo. [[9,2,7],[6,4,3],[5,8,1]] par test karo aur n = 3, 4, 5 ke liye sab n! permutations par ek brute-force ke against confirm karo.',
        hint: 'The worker for a given mask is popcount(mask): once k tasks are assigned, worker k is choosing next. dp[FULL] is the answer.',
        hintHi: 'Ek diye gaye mask ke liye worker popcount(mask) hai: ek baar k tasks assigned, worker k agla choose kar raha hai. dp[FULL] jawaab hai.',
      },
      {
        task: 'Implement tsp (Held-Karp). Test on the 4-city matrix [[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]] (expect 80). Then compare timing against a brute-force n! for n = 8, 10, 12.',
        taskHi: 'tsp (Held-Karp) implement karo. 4-city matrix [[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]] par test karo (80 expect karo). Phir n = 8, 10, 12 ke liye ek brute-force n! ke against timing compare karo.',
        hint: 'dp is a (1<<n) x n table. dp[1][0] = 0 to start. The answer closes the tour: min over i of dp[FULL][i] + dist[i][0].',
        hintHi: 'dp ek (1<<n) x n table hai. shuru karne ke liye dp[1][0] = 0. Jawaab tour band karta hai: i par dp[FULL][i] + dist[i][0] ka min.',
      },
      {
        task: 'Implement the submask enumeration loop and use it to solve "minimum number of subsets from a given collection whose union is the full set {0..n-1}" for small n (set cover, n <= 15). Confirm the (mask, submask) pair count is 3^n.',
        taskHi: 'Submask enumeration loop implement karo aur ise "ek di gayi collection se minimum tadaad subsets jinka union poora set {0..n-1} hai" small n (set cover, n <= 15) ke liye solve karne ke liye istemal karo. Confirm karo (mask, submask) pair count 3^n hai.',
        hint: 'dp[mask] = fewest chosen subsets covering exactly `mask`. For each mask, for each available subset s: dp[mask | s] = min(dp[mask | s], dp[mask] + 1).',
        hintHi: 'dp[mask] = bilkul `mask` cover karne waale fewest chosen subsets. Har mask ke liye, har available subset s ke liye: dp[mask | s] = min(dp[mask | s], dp[mask] + 1).',
      },
    ],

    keyTakeaways: [
      'When a subproblem is "which elements of a small set (n <= ~20) have I used/visited/covered", represent that set as an integer bitmask and make dp a flat array of size 2^n.',
      'Bit-state ops: `mask & (1 << i)` (member?), `mask | (1 << i)` (add), `mask & ~(1 << i)` (remove), `mask === (1 << n) - 1` (complete?), popcount (size).',
      'Fill order: if the transition ADDS a bit, iterate masks ascending (predecessors are numerically smaller). Removing a bit needs descending order.',
      'TSP / Held-Karp: state is (visited mask, current city) — the mask alone is insufficient because the next hop\'s cost depends on where you currently are. O(2^n * n^2).',
      'Submask enumeration `for (sub = mask; ; sub = (sub - 1) & mask)` visits every subset of `mask`; summed over all masks it is O(3^n), not O(4^n).',
      'The n <= ~20 ceiling is the tell in a problem statement: a small explicit bound plus a "cover/visit/assign all" objective means reach for a bitmask.',
    ],
    keyTakeawaysHi: [
      'Jab ek subproblem "ek chhote set (n <= ~20) ke kaunse elements maine used/visited/covered kiye" hai, us set ko ek integer bitmask ki tarah represent karo aur dp ko size 2^n ka ek flat array banao.',
      'Bit-state ops: `mask & (1 << i)` (member?), `mask | (1 << i)` (add), `mask & ~(1 << i)` (remove), `mask === (1 << n) - 1` (complete?), popcount (size).',
      'Fill order: agar transition ek bit JODTA hai, masks ascending iterate karo (predecessors numerically chhote). Ek bit hataana descending order chahiye.',
      'TSP / Held-Karp: state (visited mask, current city) hai — akela mask kaafi nahi kyunki agle hop ki cost is par nirbhar karti hai ki aap abhi kahaan ho. O(2^n * n^2).',
      'Submask enumeration `for (sub = mask; ; sub = (sub - 1) & mask)` `mask` ka har subset visit karta hai; sab masks par summed ye O(3^n) hai, O(4^n) nahi.',
      'n <= ~20 ceiling problem statement mein tell hai: ek chhota explicit bound plus ek "cover/visit/assign all" objective matlab ek bitmask ki taraf pahuncho.',
    ],
  },
];
