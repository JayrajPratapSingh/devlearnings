/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 4.
 *
 * The 0/1 knapsack: the canonical "choose a subset of items to maximise value
 * subject to a capacity constraint" DP. Builds on this module's lesson 3 (2D DP:
 * state is two indices) and previews this course's Module 12 (why a greedy
 * "best value-per-weight first" choice is optimal for the FRACTIONAL knapsack
 * but not the 0/1 one). Broken example: 0/1 knapsack solved by trying all 2^n
 * subsets of the items — correct, but exponential and unusable past ~25 items.
 * Fixed with a 2D DP whose state is (number of items considered so far, capacity
 * still available): dp[i][w] = the best value using a subset of the first i
 * items whose total weight is at most w. The transition at item i is "leave it"
 * (dp[i-1][w]) versus "take it" (value[i] + dp[i-1][w - weight[i]], if it fits).
 * O(n*W) time — "pseudo-polynomial" because W is a numeric value, not an input
 * length — then O(W) space by keeping one row and iterating w downward.
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

export const DSA_MODULE_11_PART4: CourseLesson[] = [
  {
    slug: 'dp-0-1-knapsack',
    title: '0/1 Knapsack: Choosing a Subset Under a Constraint',
    titleHi: '0/1 Knapsack: Ek Constraint Ke Tahat Ek Subset Chunna',
    description: 'Packing a bag of limited weight capacity with items, each having a weight and a value, to maximise total value — solved by generating every possible subset of items and checking which fits best. There are 2^n subsets, so this is exponential and stops being usable around 25 items.',
    descriptionHi: 'Seemit weight capacity ke ek bag ko items se pack karna, har ek ka ek weight aur ek value, kul value maximise karne ke liye — items ke har sambhaavit subset ko generate karke aur check karke ki kaunsa sabse achha fit hota hai. 2^n subsets hain, isliye ye exponential hai aur lagbhag 25 items par usable hona band ho jaata hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 4,

    analogy: {
      en: '**Deciding, item by item, what to take on a trip when your suitcase has a fixed weight allowance.** You go through your possessions one at a time. For each item you face a clean yes-or-no: pack it or leave it. To make the best overall choice you would like to know, for every possible amount of allowance still left, the best total value you can achieve using only the items you have not yet considered. You build this up backwards from the last item. For the last item alone: if it fits in the remaining allowance, taking it is worth its value, otherwise it is worth nothing. Now step back to the second-to-last item. For each amount of remaining allowance, you compare two futures: one where you skip this item and inherit the best value the last item could give you with the same allowance, and one where you take this item, subtract its weight from the allowance, and add its value to the best the last item can give you with the reduced allowance. You keep the better future. Repeat all the way back to the first item, and the entry for "all items available, full allowance" is your answer. You never enumerate a single full packing list; you just fill a grid of allowance-versus-items-remaining.',
      hi: '**Item by item tay karna, ek trip par kya lena hai jab aapke suitcase ka ek fixed weight allowance hai.** Aap apni cheezon ke through ek baar mein ek jaate ho. Har item ke liye aapke saamne ek saaf haan-ya-na hai: ise pack karo ya chhodo. Sabse achha overall choice karne ke liye aap jaanna chahoge, har sambhaavit baaki allowance ki maatra ke liye, best total value jo aap sirf un items se haasil kar sakte ho jinhe aapne abhi tak consider nahi kiya. Aap ise aakhri item se peechhe banate ho. Akele aakhri item ke liye: agar ye baaki allowance mein fit hota hai, ise lena iski value ke laayak hai, warna ye kuch nahi ke laayak. Ab doosre-se-aakhri item par peechhe step karo. Har baaki allowance ki maatra ke liye, aap do futures compare karte ho: ek jahaan aap is item ko skip karte ho aur best value inherit karte ho jo aakhri item aapko usi allowance ke saath de sakta hai, aur ek jahaan aap is item ko lete ho, iska weight allowance se subtract karte ho, aur iski value best mein jodte ho jo aakhri item aapko kam allowance ke saath de sakta hai. Aap behtar future rakhte ho. Pehle item tak poori tarah peechhe dohraao, aur "sab items available, poora allowance" ke liye entry aapka jawaab hai. Aap ek bhi poori packing list enumerate nahi karte; aap bas allowance-versus-items-remaining ka ek grid bharte ho.',
    },

    simple: `**Start broken.** 0/1 knapsack by enumerating every subset:

\`\`\`js
function knapsackBrute(weights, values, capacity, i = 0) {
  if (i === weights.length) return 0;
  const leave = knapsackBrute(weights, values, capacity, i + 1);
  let take = 0;
  if (weights[i] <= capacity) {
    take = values[i] + knapsackBrute(weights, values, capacity - weights[i], i + 1);
  }
  return Math.max(leave, take);
}
\`\`\`

Correct — at each item you branch on take-or-leave. But it is \`O(2^n)\`: two branches per item, and the branches overlap because different early choices can lead to the same \`(i, remaining capacity)\` situation. That overlap is the DP signal. The state that fully describes a subproblem: **which item index we are at, and how much capacity remains**.

**The fix: dp[i][w] = best value from the first i items within capacity w**

\`\`\`js
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = best value considering items 0..i-1 with capacity w
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1], val = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];                        // leave item i-1
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i][w], val + dp[i - 1][w - wt]); // take it
      }
    }
  }
  return dp[n][capacity];
}
\`\`\`

\`\`\`ts
function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1]!, val = values[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      dp[i]![w] = dp[i - 1]![w]!;
      if (wt <= w) dp[i]![w] = Math.max(dp[i]![w]!, val + dp[i - 1]![w - wt]!);
    }
  }
  return dp[n]![capacity]!;
}
\`\`\`

- **State**: \`dp[i][w]\` = the maximum value achievable using a subset of the first \`i\` items whose total weight is \`<= w\`.
- **Recurrence**: for item \`i-1\`, either **leave it** and inherit \`dp[i-1][w]\`, or **take it** (only if \`weight[i-1] <= w\`) for \`value[i-1] + dp[i-1][w - weight[i-1]]\`. Take the max.
- **Base case**: \`dp[0][w] = 0\` for all \`w\` (no items -> no value).
- **Order**: \`i\` increasing (each row depends only on the row above).
- **Answer**: \`dp[n][capacity]\`.

O(n * capacity) time and space. This is called **pseudo-polynomial**: it is polynomial in the numeric value \`capacity\`, but \`capacity\` takes only \`log(capacity)\` bits to write down, so it is exponential in the *input size*.

**The fix, further: O(capacity) space — one row, iterate w DOWNWARD**

\`\`\`js
function knapsackO1(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i], val = values[i];
    for (let w = capacity; w >= wt; w--) {         // DOWNWARD is essential
      dp[w] = Math.max(dp[w], val + dp[w - wt]);
    }
  }
  return dp[capacity];
}
\`\`\`

The recurrence reads \`dp[i-1][w - wt]\` — a *smaller* \`w\` from the *previous* row. If you iterate \`w\` upward in a single row, \`dp[w - wt]\` would already have been updated to the current row's value, meaning you could take item \`i\` twice. Iterating \`w\` **downward** guarantees \`dp[w - wt]\` still holds the previous row's value when you read it. This is the "check which neighbour the recurrence reads before collapsing a dimension" rule from lesson 3, and here it forces the loop direction.`,

    simpleHi: `**Toote hue se shuru.** 0/1 knapsack har subset enumerate karke:

\`\`\`js
function knapsackBrute(weights, values, capacity, i = 0) {
  if (i === weights.length) return 0;
  const leave = knapsackBrute(weights, values, capacity, i + 1);
  let take = 0;
  if (weights[i] <= capacity) {
    take = values[i] + knapsackBrute(weights, values, capacity - weights[i], i + 1);
  }
  return Math.max(leave, take);
}
\`\`\`

Sahi — har item par aap take-or-leave par branch karte ho. Par ye \`O(2^n)\` hai: prati item do branches, aur branches overlap karti hain kyunki alag early choices usi \`(i, remaining capacity)\` situation tak le jaa sakti hain. Wo overlap DP signal hai. Wo state jo ek subproblem ko poori tarah describe karta hai: **hum kaunse item index par hain, aur kitni capacity baaki hai**.

**Fix: dp[i][w] = capacity w ke andar pehle i items se best value**

\`\`\`js
function knapsack(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = items 0..i-1 ko capacity w ke saath dekhkar best value
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1], val = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];                        // item i-1 chhodo
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i][w], val + dp[i - 1][w - wt]); // ise lo
      }
    }
  }
  return dp[n][capacity];
}
\`\`\`

\`\`\`ts
function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1]!, val = values[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      dp[i]![w] = dp[i - 1]![w]!;
      if (wt <= w) dp[i]![w] = Math.max(dp[i]![w]!, val + dp[i - 1]![w - wt]!);
    }
  }
  return dp[n]![capacity]!;
}
\`\`\`

- **State**: \`dp[i][w]\` = pehle \`i\` items ke ek subset se haasil maximum value jiska kul weight \`<= w\` hai.
- **Recurrence**: item \`i-1\` ke liye, ya toh **ise chhodo** aur \`dp[i-1][w]\` inherit karo, ya **ise lo** (sirf agar \`weight[i-1] <= w\`) \`value[i-1] + dp[i-1][w - weight[i-1]]\` ke liye. Max lo.
- **Base case**: sab \`w\` ke liye \`dp[0][w] = 0\` (koi items nahi -> koi value nahi).
- **Order**: \`i\` badhta (har row sirf upar ki row par nirbhar karti hai).
- **Answer**: \`dp[n][capacity]\`.

O(n * capacity) time aur space. Ise **pseudo-polynomial** kehte hain: ye numeric value \`capacity\` mein polynomial hai, par \`capacity\` likhne mein sirf \`log(capacity)\` bits lagte hain, isliye ye *input size* mein exponential hai.

**Fix, aur: O(capacity) space — ek row, w ko NEECHE iterate karo**

\`\`\`js
function knapsackO1(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i], val = values[i];
    for (let w = capacity; w >= wt; w--) {         // NEECHE zaroori hai
      dp[w] = Math.max(dp[w], val + dp[w - wt]);
    }
  }
  return dp[capacity];
}
\`\`\`

Recurrence \`dp[i-1][w - wt]\` padhta hai — *previous* row se ek *chhota* \`w\`. Agar aap \`w\` ko ek single row mein upar iterate karte ho, \`dp[w - wt]\` pehle se current row ki value par update ho chuka hota, matlab aap item \`i\` do baar le sakte the. \`w\` ko **neeche** iterate karna guarantee karta hai ki \`dp[w - wt]\` abhi bhi previous row ki value rakhta hai jab aap ise padhte ho. Ye lesson 3 ka "collapse karne se pehle check karo recurrence kaunsa neighbour padhta hai" rule hai, aur yahaan ye loop direction majboor karta hai.`,

    content: `## Reconstructing WHICH items were chosen

\`\`\`js
function knapsackItems(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w)
        dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
    }
  }
  // walk back: at (i, w), item i-1 was taken iff dp[i][w] !== dp[i-1][w]
  const chosen = [];
  let w = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { chosen.push(i - 1); w -= weights[i - 1]; }
  }
  return { value: dp[n][capacity], items: chosen.reverse() };
}
\`\`\`

The full 2D table is needed for reconstruction: at cell \`(i, w)\`, if \`dp[i][w]\` differs from \`dp[i-1][w]\`, the improvement came from taking item \`i-1\`, so record it and reduce \`w\` by its weight. This means the O(capacity)-space version can give you the optimal *value* but not the item list — a common trade-off in DP.

## Related "subset under a numeric constraint" problems, same shape

\`\`\`
"Subset sum" — is there a subset summing to exactly T?
    dp[i][t] = dp[i-1][t] OR dp[i-1][t - nums[i-1]]   (boolean instead of max value)

"Partition equal subset sum" — split into two equal-sum halves?
    subset sum with T = total / 2

"Target sum" — assign + or - to each number to hit a target?
    rearranges to a subset-sum problem

"Coin change 2" (count combinations) — unbounded, iterate w UPWARD
    (each coin reusable, so you WANT dp[w - c] to be the current row)
\`\`\`

Bounded (0/1) versus unbounded is exactly the loop direction: **downward \`w\`** means each item is used at most once (0/1 knapsack); **upward \`w\`** means an item can be reused (unbounded knapsack, coin change).

## Unbounded knapsack: one line different

\`\`\`js
function unboundedKnapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let w = 1; w <= capacity; w++) {              // w outer, upward
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= w) dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  return dp[capacity];
}
\`\`\`

Here \`dp[w - weights[i]]\` is intentionally the *current* pass's value, so an item can be picked again. Same table, same recurrence; the only change is which direction the reuse is allowed.

## Why greedy fails for 0/1 knapsack (preview of Module 12)

\`\`\`
Greedy "take the highest value-per-weight item that still fits, repeat":
  items: A (w=10, v=60), B (w=20, v=100), C (w=30, v=120), capacity=50
  value/weight: A=6, B=5, C=4  -> greedy takes A then B: value 160, weight 30
  optimal: B + C = value 220, weight 50
\`\`\`

Greedy is optimal for the *fractional* knapsack (you can take a slice of an item), because you can always top up the bag with a fraction of the next-best item. For 0/1 you cannot slice, so a locally-best choice can block a better combination. This course's Module 12 develops exactly when greedy is and is not safe.`,

    contentHi: `## Reconstruct karna KAUNSE items chune gaye

\`\`\`js
function knapsackItems(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w)
        dp[i][w] = Math.max(dp[i][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
    }
  }
  // peechhe chalo: (i, w) par, item i-1 tab liya gaya jab dp[i][w] !== dp[i-1][w]
  const chosen = [];
  let w = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { chosen.push(i - 1); w -= weights[i - 1]; }
  }
  return { value: dp[n][capacity], items: chosen.reverse() };
}
\`\`\`

Reconstruction ke liye poori 2D table chahiye: cell \`(i, w)\` par, agar \`dp[i][w]\` \`dp[i-1][w]\` se alag hai, sudhaar item \`i-1\` lene se aaya, toh ise record karo aur \`w\` ko iske weight se kam karo. Iska matlab O(capacity)-space version aapko optimal *value* de sakta hai par item list nahi — DP mein ek aam trade-off.

## Sambandhit "ek numeric constraint ke tahat subset" problems, wahi shape

\`\`\`
"Subset sum" — kya bilkul T tak sum hone waala ek subset hai?
    dp[i][t] = dp[i-1][t] OR dp[i-1][t - nums[i-1]]   (max value ke bajaye boolean)

"Partition equal subset sum" — do barabar-sum halves mein split?
    T = total / 2 ke saath subset sum

"Target sum" — ek target hit karne ke liye har number ko + ya - assign karo?
    ek subset-sum problem mein rearrange hota hai

"Coin change 2" (combinations gino) — unbounded, w ko UPAR iterate karo
    (har coin reusable, toh aap CHAHTE ho dp[w - c] current row ho)
\`\`\`

Bounded (0/1) versus unbounded bilkul loop direction hai: **neeche \`w\`** matlab har item zyaada se zyaada ek baar istemal (0/1 knapsack); **upar \`w\`** matlab ek item reuse ho sakta hai (unbounded knapsack, coin change).

## Unbounded knapsack: ek line alag

\`\`\`js
function unboundedKnapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let w = 1; w <= capacity; w++) {              // w bahar, upar
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= w) dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  return dp[capacity];
}
\`\`\`

Yahaan \`dp[w - weights[i]]\` jaan-boojhkar *current* pass ki value hai, taaki ek item dobara pick ho sake. Wahi table, wahi recurrence; ekmatra badlaav ye hai ki reuse kis direction mein allowed hai.

## 0/1 knapsack ke liye greedy kyun fail hota hai (Module 12 ka preview)

\`\`\`
Greedy "sabse zyaada value-per-weight item jo abhi fit hota hai lo, dohraao":
  items: A (w=10, v=60), B (w=20, v=100), C (w=30, v=120), capacity=50
  value/weight: A=6, B=5, C=4  -> greedy A phir B leta hai: value 160, weight 30
  optimal: B + C = value 220, weight 50
\`\`\`

Greedy *fractional* knapsack ke liye optimal hai (aap ek item ka ek slice le sakte ho), kyunki aap hamesha bag ko next-best item ke ek fraction se top up kar sakte ho. 0/1 ke liye aap slice nahi kar sakte, isliye ek locally-best choice ek behtar combination ko block kar sakti hai. Is course ka Module 12 bilkul develop karta hai kab greedy safe hai aur kab nahi.`,

    examples: [
      {
        title: 'Broken: 0/1 knapsack by enumerating all subsets',
        titleHi: 'Toota: 0/1 knapsack sab subsets enumerate karke',
        code: `const leave = knapsackBrute(w, v, cap, i + 1);
const take = (w[i] <= cap) ? v[i] + knapsackBrute(w, v, cap - w[i], i + 1) : 0;
return Math.max(leave, take);`,
        codeJs: `function knapsackBrute(w, v, cap, i = 0) {
  if (i === w.length) return 0;
  const leave = knapsackBrute(w, v, cap, i + 1);
  const take = w[i] <= cap ? v[i] + knapsackBrute(w, v, cap - w[i], i + 1) : 0;
  return Math.max(leave, take);
}
console.log(knapsackBrute([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9  — but O(2^n)`,
        codeTs: `function knapsackBrute(w: number[], v: number[], cap: number, i = 0): number {
  if (i === w.length) return 0;
  const leave = knapsackBrute(w, v, cap, i + 1);
  const take = w[i]! <= cap ? v[i]! + knapsackBrute(w, v, cap - w[i]!, i + 1) : 0;
  return Math.max(leave, take);
}`,
        output: `9`,
        explain: 'Two branches per item, and different early take/leave choices converge to the same (i, remaining-capacity) state — overlapping subproblems, so the 2^n exploration is wasteful.',
        explainHi: 'Prati item do branches, aur alag early take/leave choices usi (i, remaining-capacity) state par converge karti hain — overlapping subproblems, isliye 2^n exploration faaltu hai.',
      },
      {
        title: 'Fixed: dp[i][w], leave vs take',
        titleHi: 'Theek: dp[i][w], leave vs take',
        code: `dp[i][w] = dp[i - 1][w];                                  // leave
if (wt <= w) dp[i][w] = Math.max(dp[i][w], val + dp[i - 1][w - wt]); // take`,
        codeJs: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1], val = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (wt <= w) dp[i][w] = Math.max(dp[i][w], val + dp[i - 1][w - wt]);
    }
  }
  return dp[n][capacity];
}
console.log(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9  (items with weight 3 and 4)`,
        codeTs: `function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1]!, val = values[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      dp[i]![w] = dp[i - 1]![w]!;
      if (wt <= w) dp[i]![w] = Math.max(dp[i]![w]!, val + dp[i - 1]![w - wt]!);
    }
  }
  return dp[n]![capacity]!;
}`,
        outputJs: `9`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'State is (items considered, capacity left). n*(capacity+1) distinct subproblems, each an O(1) leave-vs-take max. O(n*capacity).',
        explainHi: 'State (considered items, baaki capacity) hai. n*(capacity+1) distinct subproblems, har ek ek O(1) leave-vs-take max. O(n*capacity).',
      },
      {
        title: 'O(capacity) space: one row, iterate w downward',
        titleHi: 'O(capacity) space: ek row, w ko neeche iterate karo',
        code: `for (let w = capacity; w >= wt; w--)
  dp[w] = Math.max(dp[w], val + dp[w - wt]);   // downward -> item used at most once`,
        codeJs: `function knapsackO1(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i], val = values[i];
    for (let w = capacity; w >= wt; w--) dp[w] = Math.max(dp[w], val + dp[w - wt]);
  }
  return dp[capacity];
}
console.log(knapsackO1([1, 3, 4, 5], [1, 4, 5, 7], 7)); // 9`,
        codeTs: `function knapsackO1(weights: number[], values: number[], capacity: number): number {
  const dp = new Array<number>(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i]!, val = values[i]!;
    for (let w = capacity; w >= wt; w--) dp[w] = Math.max(dp[w]!, val + dp[w - wt]!);
  }
  return dp[capacity]!;
}`,
        outputJs: `9`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Iterating w downward means dp[w - wt] still holds the previous item-row\'s value when read, so each item is counted at most once. Upward would let an item be taken repeatedly.',
        explainHi: 'w ko neeche iterate karna matlab dp[w - wt] padhe jaane par abhi bhi previous item-row ki value rakhta hai, isliye har item zyaada se zyaada ek baar ginta hai. Upar ek item ko baar-baar lene deta.',
      },
    ],

    mistakes: [
      {
        wrong: `// O(capacity) space knapsack iterating w UPWARD (turns 0/1 into unbounded)
for (let w = wt; w <= capacity; w++) dp[w] = Math.max(dp[w], val + dp[w - wt]);
// dp[w - wt] may already include item i -> item i counted multiple times`,
        right: `for (let w = capacity; w >= wt; w--) dp[w] = Math.max(dp[w], val + dp[w - wt]);`,
        why: 'In a single-row 0/1 knapsack, dp[w - wt] must be the value BEFORE item i was considered. Upward iteration overwrites lower w first, so dp[w - wt] can already include item i, letting it be picked again.',
        whyHi: 'Ek single-row 0/1 knapsack mein, dp[w - wt] item i consider hone SE PEHLE ki value honi chahiye. Upar iteration pehle chhote w overwrite karta hai, isliye dp[w - wt] pehle se item i include kar sakta hai, ise dobara pick karne dete hue.',
      },
      {
        wrong: `// state that omits remaining capacity
function dp(i) { ... }   // cannot decide "take item i" without knowing capacity left`,
        right: `function dp(i, w) { ... }   // both the item index AND the remaining capacity`,
        why: 'Whether taking an item is possible and worthwhile depends on how much capacity is left. A state of just the item index cannot express the constraint, so it cannot be a correct DP state.',
        whyHi: 'Ek item lena mumkin aur laayak hai ya nahi ye is par nirbhar karta hai ki kitni capacity baaki hai. Sirf item index ka ek state constraint express nahi kar sakta, isliye ye ek sahi DP state nahi ho sakta.',
      },
      {
        wrong: `// reporting the item list from the O(capacity)-space version
knapsackO1(...) // returns the optimal VALUE but the single row cannot reconstruct choices`,
        right: `// keep the full n x capacity table if you need the actual items;
// the space-optimised version only gives the optimal value.`,
        why: 'Reconstruction walks the 2D table comparing dp[i][w] with dp[i-1][w]. The collapsed single row has thrown away the per-item history, so it can only tell you the best achievable value.',
        whyHi: 'Reconstruction 2D table chalta hai dp[i][w] ko dp[i-1][w] se compare karte hue. Collapsed single row ne per-item history phenk di, isliye ye aapko sirf sabse achhi haasil value bata sakta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Budget allocation** — "pick projects to fund to maximise expected return within a fixed budget" — is 0/1 knapsack with money as capacity, used in portfolio construction and R&D planning.',
        hi: '**Budget allocation** — "ek fixed budget ke andar expected return maximise karne ke liye projects chuno" — money ko capacity ki tarah 0/1 knapsack hai, portfolio construction aur R&D planning mein istemal.',
      },
      {
        en: '**Cargo and container loading** maximises shipped value under a weight or volume limit — the classic knapsack, and the reason the problem is named after a bag.',
        hi: '**Cargo aur container loading** ek weight ya volume limit ke tahat shipped value maximise karta hai — classic knapsack, aur wajah ki problem ek bag ke naam par hai.',
      },
      {
        en: '**Ad-slot and bandwidth auctions** choose a subset of bids to accept that maximises revenue without exceeding inventory — subset-sum / knapsack DP under a capacity constraint.',
        hi: '**Ad-slot aur bandwidth auctions** accept karne ke liye bids ka ek subset chunte hain jo revenue maximise kare bina inventory se zyaada — ek capacity constraint ke tahat subset-sum / knapsack DP.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is the state for 0/1 knapsack (item index, remaining capacity), and why does the recurrence have exactly two cases?',
        qHi: '0/1 knapsack ke liye state (item index, remaining capacity) kyun hai, aur recurrence ke bilkul do cases kyun hain?',
        a: 'A subproblem in knapsack is: given a set of items still under consideration and an amount of capacity still available, what is the best total value you can pack. Two facts make the item index and the remaining capacity a sufficient description of that subproblem. First, the items are considered in a fixed order, so "which items are still under consideration" is fully captured by a single number: the index of the next item to decide on. Everything before that index has already been decided, and its contribution is folded into how much capacity remains and is not otherwise relevant. Second, the only thing the earlier decisions affect about the future is how much capacity they consumed; the future does not care which specific items filled that capacity, only the total. So the pair, next item index and remaining capacity, contains everything needed to solve the rest optimally, and nothing redundant. Now the recurrence. When you reach a given item, you have a binary decision: include it in the bag or not. There is no third option, because an item is either fully in or fully out in the 0/1 version. If you leave it, the best you can do is whatever the best is for the remaining items with the same capacity, because this item contributes nothing and removes nothing. If you take it, you gain its value, but the capacity available for the remaining items drops by this item\'s weight, and taking it is only possible if the item fits in the current capacity at all. The answer for the subproblem is the maximum of those two options. Two cases, because the decision has two outcomes.',
        aHi: 'Knapsack mein ek subproblem hai: abhi vichaar mein items ka ek set aur abhi available capacity ki ek maatra diye gaye, best total value jo aap pack kar sakte ho. Do tathya item index aur remaining capacity ko us subproblem ka ek kaafi vivaran banate hain. Pehla, items ek fixed order mein consider hote hain, isliye "kaunse items abhi vichaar mein hain" ek akele number se poori tarah capture hota hai: agla item jispar decide karna hai uska index. Us index se pehle sab kuch pehle se decide ho chuka hai, aur iska yogdaan is baat mein fold ho jaata hai ki kitni capacity baaki hai aur anyatha sambandhit nahi hai. Doosra, ekmatra cheez jo earlier decisions future ke baare mein prabhaavit karti hain wo ye hai ki unhone kitni capacity khapat ki; future parwaah nahi karta ki kaunse specific items ne wo capacity bhari, sirf total. Toh jodi, agla item index aur remaining capacity, mein baaki ko optimally solve karne ke liye zaroori sab kuch hai, aur kuch redundant nahi. Ab recurrence. Jab aap ek diye gaye item par pahunchte ho, aapke paas ek binary decision hai: ise bag mein include karo ya nahi. Koi teesra option nahi, kyunki 0/1 version mein ek item ya toh poori tarah andar hai ya poori tarah bahar. Agar aap ise chhodte ho, best jo aap kar sakte ho wo hai jo best baaki items ke liye usi capacity ke saath hai, kyunki ye item kuch yogdaan nahi deta aur kuch nahi hataata. Agar aap ise lete ho, aap iski value paate ho, par baaki items ke liye available capacity is item ke weight se girti hai, aur ise lena sirf tab mumkin hai jab item current capacity mein fit hota hai. Subproblem ke liye jawaab un do options ka maximum hai. Do cases, kyunki decision ke do outcomes hain.',
      },
      {
        q: 'Knapsack DP is called "pseudo-polynomial" and runs in O(n*W). Explain what pseudo-polynomial means and why the distinction matters.',
        qHi: 'Knapsack DP ko "pseudo-polynomial" kehte hain aur ye O(n*W) mein chalta hai. Samjhaao pseudo-polynomial ka kya matlab hai aur ye farak kyun maayne rakhta hai.',
        a: 'Running time is normally measured as a function of the size of the input, where size means the number of symbols it takes to write the input down. For knapsack, the input consists of n items, each with a weight and a value, plus the capacity W. Writing n items down takes on the order of n numbers, and writing the capacity W down takes about log W bits, because a number is written in binary or decimal, not in unary. The DP runs in time proportional to n times W. The n factor is genuinely polynomial in the input size. But the W factor is not: W as a quantity can be exponentially large relative to log W, the number of bits used to express it. So a modest-looking input, say thirty items and a capacity written as a ten-digit number, has a small textual size but forces the DP to fill a table with billions of cells. An algorithm is called pseudo-polynomial when its running time is polynomial in the numeric values appearing in the input but exponential in the input\'s bit-length. The distinction matters for two reasons. Practically, it tells you the DP is fine when capacities are small or bounded, and useless when they are huge, which is exactly when you would reach for an approximation algorithm or a different formulation instead. Theoretically, it is why 0/1 knapsack is NP-hard yet has this DP: the DP does not contradict NP-hardness because it is not polynomial in the true input size, only in the value of W. A problem that had a genuinely polynomial-in-input-size algorithm would be in P.',
        aHi: 'Running time normally input ke size ke ek function ki tarah maapa jaata hai, jahaan size matlab input likhne mein kitne symbols lagte hain. Knapsack ke liye, input mein n items hain, har ek ka ek weight aur ek value, plus capacity W. n items likhne mein lagbhag n numbers lagte hain, aur capacity W likhne mein lagbhag log W bits, kyunki ek number binary ya decimal mein likha jaata hai, unary mein nahi. DP n guna W ke anupaat mein time mein chalta hai. n factor sach mein input size mein polynomial hai. Par W factor nahi hai: W ek maatra ke roop mein log W, ise express karne ke liye istemal bits ki tadaad, ke saapeksh exponentially bada ho sakta hai. Toh ek modest-dikhne wala input, maano tees items aur ek das-digit number ki tarah likhi capacity, ka ek chhota textual size hai par DP ko billions of cells waali ek table bharne ke liye majboor karta hai. Ek algorithm ko pseudo-polynomial kehte hain jab iska running time input mein aane waali numeric values mein polynomial hai par input ki bit-length mein exponential. Farak do wajahon se maayne rakhta hai. Vyaavahaarik roop se, ye aapko batata hai ki DP theek hai jab capacities chhoti ya bounded hain, aur bekaar jab wo bade hain, jo bilkul tab hai jab aap iske bajaye ek approximation algorithm ya ek alag formulation ki taraf pahunchoge. Sidhaantik roop se, yahi wajah hai ki 0/1 knapsack NP-hard hai phir bhi iska ye DP hai: DP NP-hardness ka virodh nahi karta kyunki ye asli input size mein polynomial nahi hai, sirf W ki value mein.',
      },
    ],

    exercises: [
      {
        task: 'Implement knapsack (2D dp), knapsackO1 (one row, w downward), and knapsackItems (with reconstruction). Test on weights [1,3,4,5], values [1,4,5,7], capacity 7 — expect value 9, items {weight 3, weight 4}.',
        taskHi: 'knapsack (2D dp), knapsackO1 (ek row, w neeche), aur knapsackItems (reconstruction ke saath) implement karo. weights [1,3,4,5], values [1,4,5,7], capacity 7 par test karo — value 9 expect karo, items {weight 3, weight 4}.',
        hint: 'Deliberately change knapsackO1 to iterate w upward and watch it return a wrong (too high) value — that is the 0/1-becomes-unbounded bug.',
        hintHi: 'Jaan-boojhkar knapsackO1 ko w upar iterate karne ke liye badlo aur dekho ye ek galat (bahut zyaada) value return karta hai — wo 0/1-banta-unbounded bug hai.',
      },
      {
        task: 'Implement "partition equal subset sum": return true if the array can be split into two subsets with equal sums. Reduce it to subset-sum with target = total / 2 (and return false immediately if total is odd).',
        taskHi: '"partition equal subset sum" implement karo: true return karo agar array ko barabar sums waale do subsets mein split kiya jaa sakta hai. Ise target = total / 2 ke saath subset-sum mein reduce karo (aur total odd hone par turant false return karo).',
        hint: 'dp[t] = can we form sum t from some subset. dp[0] = true. For each num, iterate t downward: dp[t] = dp[t] || dp[t - num].',
        hintHi: 'dp[t] = kya hum kisi subset se sum t bana sakte hain. dp[0] = true. Har num ke liye, t ko neeche iterate karo: dp[t] = dp[t] || dp[t - num].',
      },
      {
        task: 'Implement unboundedKnapsack (items reusable) and verify that on weights [1,3,4], values [15,50,60], capacity 8 it returns 120 (item of weight 4, twice), whereas 0/1 knapsack returns 110.',
        taskHi: 'unboundedKnapsack (items reusable) implement karo aur verify karo ki weights [1,3,4], values [15,50,60], capacity 8 par ye 120 return karta hai (weight 4 ka item, do baar), jabki 0/1 knapsack 110 return karta hai.',
        hint: 'The only difference from the O(capacity)-space 0/1 version is iterating w UPWARD, so dp[w - weight] can include the same item already picked this pass.',
        hintHi: 'O(capacity)-space 0/1 version se ekmatra farak w ko UPAR iterate karna hai, taaki dp[w - weight] usi item ko include kar sake jo is pass mein pehle se pick hua.',
      },
    ],

    keyTakeaways: [
      '0/1 knapsack state: (item index i, remaining capacity w). dp[i][w] = best value from the first i items with total weight <= w.',
      'Recurrence has exactly two cases: leave item i (dp[i-1][w]) or take it (value[i] + dp[i-1][w - weight[i]], only if it fits). Take the max.',
      'O(n*W) time, "pseudo-polynomial" — polynomial in the numeric capacity W, but W needs only log W bits, so it is exponential in the input size.',
      'Collapse to O(W) space with one row, iterating w DOWNWARD so dp[w - wt] still holds the pre-item value. Iterating upward turns 0/1 into unbounded knapsack.',
      'Reconstructing which items were chosen needs the full 2D table (compare dp[i][w] with dp[i-1][w]); the O(W)-space version only gives the optimal value.',
      'Greedy (highest value-per-weight first) is optimal for FRACTIONAL knapsack but not 0/1 — you cannot slice an item, so a local best can block a better combination.',
    ],
    keyTakeawaysHi: [
      '0/1 knapsack state: (item index i, remaining capacity w). dp[i][w] = pehle i items se best value kul weight <= w ke saath.',
      'Recurrence ke bilkul do cases hain: item i chhodo (dp[i-1][w]) ya ise lo (value[i] + dp[i-1][w - weight[i]], sirf agar ye fit hota hai). Max lo.',
      'O(n*W) time, "pseudo-polynomial" — numeric capacity W mein polynomial, par W ko sirf log W bits chahiye, isliye ye input size mein exponential hai.',
      'O(W) space mein collapse karo ek row ke saath, w ko NEECHE iterate karte hue taaki dp[w - wt] abhi bhi pre-item value rakhe. Upar iterate karna 0/1 ko unbounded knapsack mein badalta hai.',
      'Kaunse items chune gaye reconstruct karne ke liye poori 2D table chahiye (dp[i][w] ko dp[i-1][w] se compare karo); O(W)-space version sirf optimal value deta hai.',
      'Greedy (sabse zyaada value-per-weight pehle) FRACTIONAL knapsack ke liye optimal hai par 0/1 ke liye nahi — aap ek item slice nahi kar sakte, isliye ek local best ek behtar combination block kar sakta hai.',
    ],
  },
];
