/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 2.
 *
 * 1D DP: problems where a subproblem is described by a single index, and the
 * answer at index i is built from a constant number of earlier indices. Builds
 * on this module's lesson 1 (state / recurrence / base case / fill order /
 * space) and this course's Module 2 (Kadane's maximum-subarray, which is a
 * 1D DP in disguise). Broken example: "house robber" — pick a subset of houses
 * with no two adjacent to maximise the loot — solved by trying every subset,
 * which is 2^n. Fixed by defining dp[i] = the best loot considering houses
 * 0..i, with the recurrence dp[i] = max(dp[i-1], dp[i-2] + nums[i]) ("skip
 * house i, or rob it and add the best from two back"). O(n), then O(1) with two
 * rolling variables. The lesson also covers coin change (dp over amount) to show
 * the same 1D shape with a different transition (a loop over choices).
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

export const DSA_MODULE_11_PART2: CourseLesson[] = [
  {
    slug: 'dp-1d-house-robber-coin-change',
    title: '1D DP: State Is One Index (House Robber, Coin Change)',
    titleHi: '1D DP: State Ek Index Hai (House Robber, Coin Change)',
    description: 'The "house robber" problem — choose houses to rob with no two adjacent, maximising the total — approached by enumerating every valid subset of houses. There are exponentially many subsets, so this is O(2^n) and unusable past about 30 houses, even though the answer only ever depends on a couple of earlier decisions.',
    descriptionHi: '"House robber" problem — bina do adjacent ke lootne ke liye houses chuno, kul ko maximise karte hue — houses ke har valid subset ko enumerate karke approach kiya gaya. Exponentially bahut subsets hain, isliye ye O(2^n) hai aur lagbhag 30 houses ke baad unusable hai, chahe jawaab sirf kuch pehle ke decisions par nirbhar karta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Walking along a row of market stalls, deciding at each one whether to stop and buy, where you cannot buy at two stalls in a row (the shopkeepers gossip).** The exhausting way to plan the best route is to write out every possible pattern of "buy / skip" for the whole row and total up each one. But you do not need the whole history to make a good decision at stall i — you only need two numbers: the best total you could have if you definitely skip stall i, and the best total if you stop here. If you skip stall i, your best is just whatever your best was at stall i minus one. If you stop at stall i, you add its value to your best from stall i minus two (because stall i minus one had to be skipped). Take the larger of those two, write it down as "best through stall i", and move on. You are carrying forward exactly two running totals, updating them once per stall. By the last stall you have the answer, and you never enumerated a single full pattern.',
      hi: '**Market stalls ki ek row ke saath chalna, har ek par tay karna ki rukein aur khareedein, jahaan aap do stalls par lagaataar nahi khareed sakte (shopkeepers gossip karte hain).** Best route plan karne ka thakaane wala tarika poori row ke liye "buy / skip" ka har sambhaavit pattern likhna aur har ek ka total nikaalna hai. Par aapko stall i par ek achha decision lene ke liye poori history nahi chahiye — aapko sirf do numbers chahiye: best total jo aapke paas ho sakta hai agar aap stall i ko zaroor skip karo, aur best total agar aap yahaan ruko. Agar aap stall i skip karte ho, aapka best bas wo hai jo stall i minus one par aapka best tha. Agar aap stall i par rukte ho, aap iski value ko stall i minus two se apne best mein jodte ho (kyunki stall i minus one ko skip karna pada). Un dono mein se bade ko lo, ise "stall i ke through best" ki tarah likho, aur aage badho. Aap bilkul do running totals aage le jaa rahe ho, unhe prati stall ek baar update karte hue. Aakhri stall tak aapke paas jawaab hai, aur aapne ek bhi poora pattern enumerate nahi kiya.',
    },

    simple: `**Start broken.** House robber by trying every non-adjacent subset:

\`\`\`js
function robBrute(nums, i = 0) {
  if (i >= nums.length) return 0;
  const rob = nums[i] + robBrute(nums, i + 2);   // rob house i, skip i+1
  const skip = robBrute(nums, i + 1);            // skip house i
  return Math.max(rob, skip);
}
\`\`\`

This is correct — at each house you either rob it (and jump two ahead) or skip it. But it branches into two at every house and the branches overlap (\`robBrute(nums, i+2)\` is reached from both \`i\` and \`i+1\`), so it is \`O(2^n)\`. This module's lesson 1 recipe applies: define a state, write a recurrence, fill in order.

**The fix: dp[i] = best loot considering houses 0..i**

\`\`\`js
function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  const dp = new Array(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(
      dp[i - 1],              // skip house i -> best is the same as through i-1
      dp[i - 2] + nums[i],    // rob house i -> its value plus best from two houses back
    );
  }
  return dp[n - 1];
}
\`\`\`

\`\`\`ts
function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0]!;
  const dp = new Array<number>(n);
  dp[0] = nums[0]!;
  dp[1] = Math.max(nums[0]!, nums[1]!);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1]!, dp[i - 2]! + nums[i]!);
  }
  return dp[n - 1]!;
}
\`\`\`

Following the recipe:

- **State**: \`dp[i]\` = the maximum loot obtainable from houses \`0\` through \`i\`.
- **Recurrence**: at house \`i\` you either skip it (so \`dp[i] = dp[i-1]\`) or rob it (so you could not have robbed \`i-1\`, and \`dp[i] = dp[i-2] + nums[i]\`). Take the max.
- **Base cases**: \`dp[0] = nums[0]\`; \`dp[1] = max(nums[0], nums[1])\`.
- **Order**: increasing \`i\`.
- **Answer**: \`dp[n-1]\`.

That is O(n) time, O(n) space.

**The fix, further: O(1) space with two rolling variables**

\`\`\`js
function robO1(nums) {
  let prev2 = 0, prev1 = 0;                    // dp[i-2], dp[i-1]
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
\`\`\`

\`dp[i]\` reads only \`dp[i-1]\` and \`dp[i-2]\`, so two variables suffice — the same collapse as climbing stairs in lesson 1.`,

    simpleHi: `**Toote hue se shuru.** House robber har non-adjacent subset try karke:

\`\`\`js
function robBrute(nums, i = 0) {
  if (i >= nums.length) return 0;
  const rob = nums[i] + robBrute(nums, i + 2);   // house i loot, i+1 skip
  const skip = robBrute(nums, i + 1);            // house i skip
  return Math.max(rob, skip);
}
\`\`\`

Ye sahi hai — har house par aap ya toh ise loot te ho (aur do aage kood te ho) ya ise skip karte ho. Par ye har house par do mein branch karta hai aur branches overlap karti hain (\`robBrute(nums, i+2)\` \`i\` aur \`i+1\` dono se pahuncha jaata hai), isliye ye \`O(2^n)\` hai. Is module ke lesson 1 ka recipe lagta hai: ek state define karo, ek recurrence likho, order mein bharo.

**Fix: dp[i] = houses 0..i ko dekhkar best loot**

\`\`\`js
function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  const dp = new Array(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(
      dp[i - 1],              // house i skip -> best i-1 ke through jaisa hi
      dp[i - 2] + nums[i],    // house i loot -> iski value plus do houses peechhe se best
    );
  }
  return dp[n - 1];
}
\`\`\`

\`\`\`ts
function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0]!;
  const dp = new Array<number>(n);
  dp[0] = nums[0]!;
  dp[1] = Math.max(nums[0]!, nums[1]!);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 1]!, dp[i - 2]! + nums[i]!);
  }
  return dp[n - 1]!;
}
\`\`\`

Recipe follow karte hue:

- **State**: \`dp[i]\` = houses \`0\` se \`i\` tak se haasil maximum loot.
- **Recurrence**: house \`i\` par aap ya toh ise skip karte ho (toh \`dp[i] = dp[i-1]\`) ya ise loot te ho (toh aap \`i-1\` loot nahi sakte the, aur \`dp[i] = dp[i-2] + nums[i]\`). Max lo.
- **Base cases**: \`dp[0] = nums[0]\`; \`dp[1] = max(nums[0], nums[1])\`.
- **Order**: badhta \`i\`.
- **Answer**: \`dp[n-1]\`.

Wo O(n) time, O(n) space hai.

**Fix, aur: do rolling variables ke saath O(1) space**

\`\`\`js
function robO1(nums) {
  let prev2 = 0, prev1 = 0;                    // dp[i-2], dp[i-1]
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
\`\`\`

\`dp[i]\` sirf \`dp[i-1]\` aur \`dp[i-2]\` padhta hai, isliye do variables kaafi hain — lesson 1 mein climbing stairs jaisa hi collapse.`,

    content: `## Coin change: 1D DP where the transition is a loop over choices

\`\`\`js
// Fewest coins to make 'amount' from unlimited coins of the given denominations.
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;                                       // zero coins make amount 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
\`\`\`

- **State**: \`dp[a]\` = fewest coins to make exactly amount \`a\`.
- **Recurrence**: to make \`a\`, the last coin used was some \`c\` from \`coins\`; the rest is \`dp[a - c]\`. So \`dp[a] = 1 + min over c of dp[a - c]\`.
- **Base case**: \`dp[0] = 0\`.
- **Order**: increasing \`a\` (each \`dp[a]\` depends only on smaller amounts).
- **Answer**: \`dp[amount]\`, or \`-1\` if still \`Infinity\` (unreachable).

The difference from house robber: instead of a fixed two-term recurrence, the transition loops over every coin. Complexity is O(amount * number-of-coins) — the state count times the per-state work, exactly as lesson 1 framed it.

## The same shape shows up again and again

\`\`\`
"Maximum sum non-adjacent"           dp[i] = max(dp[i-1], dp[i-2] + nums[i])
"Decode ways" (digits -> letters)    dp[i] = (valid 1-digit? dp[i-1]) + (valid 2-digit? dp[i-2])
"Fewest perfect squares summing to n" dp[a] = 1 + min over sq of dp[a - sq]
"Longest increasing run"             dp[i] = (nums[i] > nums[i-1]) ? dp[i-1] + 1 : 1
"Kadane's max subarray" (Module 2)   dp[i] = max(nums[i], dp[i-1] + nums[i])
\`\`\`

All are: one index of state, a recurrence reaching back a constant distance (house robber, decode) or looping over a choice set (coin change, perfect squares), and usually an O(1)-space collapse because only the last one or two states matter.

## Recovering WHICH houses were robbed, not just the total

\`\`\`js
function robWithChoice(nums) {
  const n = nums.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 0; dp[1] = nums[0] ?? 0;
  for (let i = 2; i <= n; i++) dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);

  // walk backwards: at position i, was house i-1 robbed?
  const chosen = [];
  let i = n;
  while (i >= 1) {
    if (i >= 2 && dp[i - 2] + nums[i - 1] >= dp[i - 1]) { chosen.push(i - 1); i -= 2; }
    else if (i === 1 && nums[0] >= dp[1] - 1e-9) { chosen.push(0); i -= 1; }
    else i -= 1;
  }
  return { total: dp[n], houses: chosen.reverse() };
}
\`\`\`

When you need the actual decisions (not just the optimal value), keep the full \`dp\` array and, after filling it, walk backwards: at each state, check which branch of the \`max\` produced \`dp[i]\` and step accordingly. This "reconstruct by re-deriving the choice" technique reappears in every DP where the question asks for the solution itself.

## Why the brute force is exponential and the DP is not

\`\`\`
Brute force: at each of n houses, two choices, and the choices are not
  independent -> a tree of up to 2^n leaves. Even with pruning it is exponential
  because the number of valid non-adjacent subsets grows like the Fibonacci
  numbers, ~1.618^n.

DP: there are only n possible "prefix ending at house i" subproblems. Solve each
  once. n states x O(1) work = O(n).
\`\`\`

The exponential-to-linear jump is the whole point of recognising the 1D DP structure: the brute force is exploring a tree whose distinct nodes number only n.`,

    contentHi: `## Coin change: 1D DP jahaan transition choices par ek loop hai

\`\`\`js
// Di gayi denominations ke unlimited coins se 'amount' banane ke sabse kam coins.
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;                                       // zero coins amount 0 banate hain
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
\`\`\`

- **State**: \`dp[a]\` = bilkul amount \`a\` banane ke sabse kam coins.
- **Recurrence**: \`a\` banane ke liye, istemal kiya aakhri coin \`coins\` se koi \`c\` tha; baaki \`dp[a - c]\` hai. Toh \`dp[a] = 1 + c par dp[a - c] ka min\`.
- **Base case**: \`dp[0] = 0\`.
- **Order**: badhta \`a\` (har \`dp[a]\` sirf chhote amounts par nirbhar karta hai).
- **Answer**: \`dp[amount]\`, ya \`-1\` agar abhi bhi \`Infinity\` (unreachable).

House robber se antar: ek fixed two-term recurrence ke bajaye, transition har coin par loop karta hai. Complexity O(amount * coins-ki-tadaad) hai — state count guna prati-state kaam, bilkul jaisa lesson 1 ne framed kiya.

## Wahi shape baar-baar dikhta hai

\`\`\`
"Maximum sum non-adjacent"           dp[i] = max(dp[i-1], dp[i-2] + nums[i])
"Decode ways" (digits -> letters)    dp[i] = (valid 1-digit? dp[i-1]) + (valid 2-digit? dp[i-2])
"n tak sum hone waale sabse kam perfect squares" dp[a] = 1 + sq par dp[a - sq] ka min
"Longest increasing run"             dp[i] = (nums[i] > nums[i-1]) ? dp[i-1] + 1 : 1
"Kadane's max subarray" (Module 2)   dp[i] = max(nums[i], dp[i-1] + nums[i])
\`\`\`

Sab hain: state ka ek index, ek recurrence jo ek constant doori peechhe pahunchta hai (house robber, decode) ya ek choice set par loop karta hai (coin change, perfect squares), aur aksar ek O(1)-space collapse kyunki sirf aakhri ek ya do states maayne rakhti hain.

## Recover karna KAUNSE houses loote gaye, sirf total nahi

\`\`\`js
function robWithChoice(nums) {
  const n = nums.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 0; dp[1] = nums[0] ?? 0;
  for (let i = 2; i <= n; i++) dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);

  // peechhe chalo: position i par, kya house i-1 loota gaya?
  const chosen = [];
  let i = n;
  while (i >= 1) {
    if (i >= 2 && dp[i - 2] + nums[i - 1] >= dp[i - 1]) { chosen.push(i - 1); i -= 2; }
    else if (i === 1 && nums[0] >= dp[1] - 1e-9) { chosen.push(0); i -= 1; }
    else i -= 1;
  }
  return { total: dp[n], houses: chosen.reverse() };
}
\`\`\`

Jab aapko asli decisions chahiye (sirf optimal value nahi), poora \`dp\` array rakho aur, ise bharne ke baad, peechhe chalo: har state par, check karo \`max\` ki kaunsi branch ne \`dp[i]\` banaaya aur uske hisaab se step karo. Ye "choice dobara nikaalkar reconstruct karo" technique har DP mein dikhti hai jahaan sawaal solution khud maangta hai.

## Brute force exponential kyun hai aur DP nahi

\`\`\`
Brute force: n houses mein se har ek par, do choices, aur choices swatantra nahi
  hain -> 2^n tak leaves ka ek tree. Pruning ke saath bhi ye exponential hai
  kyunki valid non-adjacent subsets ki tadaad Fibonacci numbers ki tarah badhti
  hai, ~1.618^n.

DP: sirf n sambhaavit "house i par khatam hone waala prefix" subproblems hain.
  Har ek ek baar solve karo. n states x O(1) kaam = O(n).
\`\`\`

Exponential-se-linear jump 1D DP structure pehchaanne ka poora point hai: brute force ek aisa tree explore kar raha hai jiske distinct nodes sirf n hain.`,

    examples: [
      {
        title: 'Broken: house robber by enumerating subsets',
        titleHi: 'Toota: house robber subsets enumerate karke',
        code: `const rob = nums[i] + robBrute(nums, i + 2);
const skip = robBrute(nums, i + 1);
return Math.max(rob, skip);`,
        codeJs: `function robBrute(nums, i = 0) {
  if (i >= nums.length) return 0;
  return Math.max(nums[i] + robBrute(nums, i + 2), robBrute(nums, i + 1));
}
console.log(robBrute([2, 7, 9, 3, 1])); // 12  — but O(2^n), slow past ~35 houses`,
        codeTs: `function robBrute(nums: number[], i = 0): number {
  if (i >= nums.length) return 0;
  return Math.max(nums[i]! + robBrute(nums, i + 2), robBrute(nums, i + 1));
}`,
        output: `12`,
        explain: 'Two branches per house, overlapping (i+2 is reached from both i and i+1). The count of recursive calls grows like the Fibonacci sequence, ~1.618^n.',
        explainHi: 'Prati house do branches, overlapping (i+2 i aur i+1 dono se pahuncha jaata hai). Recursive calls ki count Fibonacci sequence ki tarah badhti hai, ~1.618^n.',
      },
      {
        title: 'Fixed: dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
        titleHi: 'Theek: dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
        code: `dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);`,
        codeJs: `function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  const dp = new Array(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++) dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  return dp[n - 1];
}
console.log(rob([2, 7, 9, 3, 1])); // 12  in O(n)`,
        codeTs: `function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0]!;
  const dp = new Array<number>(n);
  dp[0] = nums[0]!;
  dp[1] = Math.max(nums[0]!, nums[1]!);
  for (let i = 2; i < n; i++) dp[i] = Math.max(dp[i - 1]!, dp[i - 2]! + nums[i]!);
  return dp[n - 1]!;
}`,
        outputJs: `12`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Only n subproblems: "best loot through house i". Each is a max of two already-computed values, so the whole thing is O(n) time.',
        explainHi: 'Sirf n subproblems: "house i ke through best loot". Har ek do pehle-se-compute values ka max hai, isliye poori cheez O(n) time hai.',
      },
      {
        title: 'Coin change: transition loops over the coin choices',
        titleHi: 'Coin change: transition coin choices par loop karta hai',
        code: `for (const c of coins)
  if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);`,
        codeJs: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
console.log(coinChange([1, 2, 5], 11)); // 3  (5 + 5 + 1)
console.log(coinChange([2], 3));        // -1 (impossible)`,
        codeTs: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a]!, dp[a - c]! + 1);
  return dp[amount] === Infinity ? -1 : dp[amount]!;
}`,
        outputJs: `3
-1`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Same 1D state (amount), but the recurrence tries every coin as the last one used. O(amount * coins) = state count times per-state work.',
        explainHi: 'Wahi 1D state (amount), par recurrence har coin ko aakhri istemal kiye gaye ki tarah try karta hai. O(amount * coins) = state count guna prati-state kaam.',
      },
    ],

    mistakes: [
      {
        wrong: `// house robber recurrence using dp[i-1] instead of dp[i-2] when robbing
dp[i] = Math.max(dp[i - 1], dp[i - 1] + nums[i]); // robbing i AND i-1 -> adjacent, invalid`,
        right: `dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]); // robbing i means i-1 was skipped`,
        why: 'Robbing house i forbids house i-1, so the best you can add to nums[i] is dp[i-2], not dp[i-1]. Using dp[i-1] there allows an illegal adjacent pair.',
        whyHi: 'House i loot na house i-1 ko forbid karta hai, isliye nums[i] mein jo best aap jod sakte ho wo dp[i-2] hai, dp[i-1] nahi. Wahaan dp[i-1] istemal karna ek illegal adjacent pair allow karta hai.',
      },
      {
        wrong: `// coin change: dp[0] left as Infinity
const dp = new Array(amount + 1).fill(Infinity);
// dp[0] is Infinity, so dp[c] = dp[0] + 1 = Infinity -> nothing is ever reachable`,
        right: `const dp = new Array(amount + 1).fill(Infinity);
dp[0] = 0;   // base case: it takes 0 coins to make amount 0`,
        why: 'Every reachable amount is built by adding one coin to a smaller amount, and the chain bottoms out at 0. If dp[0] is not seeded to 0, the "+1" propagation never starts and every answer is Infinity.',
        whyHi: 'Har reachable amount ek chhote amount mein ek coin jodkar banta hai, aur chain 0 par bottom out hoti hai. Agar dp[0] 0 par seed nahi hai, "+1" propagation kabhi shuru nahi hoti aur har jawaab Infinity hai.',
      },
      {
        wrong: `// collapsing to O(1) space but updating prev1/prev2 in the wrong order
prev1 = Math.max(prev1, prev2 + x);
prev2 = prev1;   // prev2 now gets the NEW prev1, not the old one`,
        right: `const cur = Math.max(prev1, prev2 + x);
prev2 = prev1;   // shift: old prev1 becomes prev2
prev1 = cur;     // new value becomes prev1`,
        why: 'The rolling update must use a temporary. Overwriting prev1 first and then copying it into prev2 loses the value prev2 was supposed to receive, corrupting every later step.',
        whyHi: 'Rolling update ko ek temporary istemal karna chahiye. Pehle prev1 overwrite karna aur phir ise prev2 mein copy karna wo value kho deta hai jo prev2 ko milni thi, har baad ke step ko corrupt karte hue.',
      },
    ],

    realWorld: [
      {
        en: '**Ad and content scheduling** — "pick a set of non-overlapping slots to maximise revenue" — is the house-robber family: the choice at each slot depends only on a bounded window of earlier choices.',
        hi: '**Ad aur content scheduling** — "revenue maximise karne ke liye non-overlapping slots ka ek set chuno" — house-robber family hai: har slot par choice sirf pehle ke choices ki ek bounded window par nirbhar karti hai.',
      },
      {
        en: '**Coin change / making-change logic** appears in payment systems, vending machines, and currency exchange, where "fewest units" or "is this amount representable" is exactly the dp-over-amount recurrence.',
        hi: '**Coin change / making-change logic** payment systems, vending machines, aur currency exchange mein dikhti hai, jahaan "sabse kam units" ya "kya ye amount representable hai" bilkul dp-over-amount recurrence hai.',
      },
      {
        en: '**Text justification and line-breaking** (as in TeX) is a 1D DP: dp[i] = minimum "badness" to lay out the first i words, choosing where the last line break goes.',
        hi: '**Text justification aur line-breaking** (TeX mein jaisa) ek 1D DP hai: dp[i] = pehle i words lay out karne ki minimum "badness", chunte hue aakhri line break kahaan jaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through deriving the house-robber recurrence from scratch, and explain how you would pick the state.',
        qHi: 'House-robber recurrence ko shuru se derive karna samjhaao, aur samjhaao ki aap state kaise chunoge.',
        a: 'Start by asking what a subproblem looks like. The full problem is "best loot over houses zero through n minus one with no two adjacent". A natural subproblem is the same question restricted to a prefix: best loot over houses zero through i. Call that dp of i. The reason a prefix is the right state is that once you have committed to a decision at house i, everything to the right of i is a fresh, independent instance of the same problem, and everything to the left is summarised by a single number, dp of i minus one or dp of i minus two, depending on whether house i minus one is available. So one index fully captures a subproblem. Now the recurrence. At house i you have exactly two options. Option one, you do not rob house i. Then the best you can do over houses zero through i is exactly the best you could do over houses zero through i minus one, because house i contributes nothing and imposes no new constraint. That term is dp of i minus one. Option two, you rob house i, collecting nums of i. Robbing i means you were not allowed to rob house i minus one, so the best loot you could have accumulated before i is the best over houses zero through i minus two, which is dp of i minus two. That term is dp of i minus two plus nums of i. The answer for dp of i is the larger of these two. Base cases handle the smallest prefixes: dp of zero is nums of zero, and dp of one is the max of nums zero and nums one. Fill i upward since each dp of i needs the two below it, and the answer is dp of n minus one. Finally, because dp of i reads only the previous two entries, the array collapses to two rolling variables and the space becomes constant.',
        aHi: 'Ye poochkar shuru karo ki ek subproblem kaisa dikhta hai. Poori problem hai "houses zero se n minus one par best loot bina do adjacent ke". Ek natural subproblem wahi sawaal hai ek prefix tak seemit: houses zero se i par best loot. Use dp of i kaho. Ek prefix sahi state kyun hai iska kaaran ye hai ki ek baar aap house i par ek decision commit kar dete ho, i ke right mein har cheez usi problem ka ek fresh, swatantra instance hai, aur left mein har cheez ek akele number se summarise hoti hai, dp of i minus one ya dp of i minus two, is baat par nirbhar ki house i minus one available hai ya nahi. Toh ek index ek subproblem ko poori tarah capture karta hai. Ab recurrence. House i par aapke bilkul do options hain. Option ek, aap house i ko loot te nahi. Toh houses zero se i par best jo aap kar sakte ho wo bilkul best hai jo aap houses zero se i minus one par kar sakte the, kyunki house i kuch yogdaan nahi deta aur koi naya constraint nahi lagaata. Wo term dp of i minus one hai. Option do, aap house i loot te ho, nums of i collect karte hue. i loot na matlab aapko house i minus one loot na allowed nahi tha, isliye i se pehle jo best loot aap jama kar sakte the wo houses zero se i minus two par best hai, jo dp of i minus two hai. Wo term dp of i minus two plus nums of i hai. dp of i ke liye jawaab in dono mein se bada hai. Base cases sabse chhote prefixes handle karte hain: dp of zero nums of zero hai, aur dp of one nums zero aur nums one ka max hai. i ko upar bharo kyunki har dp of i ko iske neeche ke do chahiye, aur jawaab dp of n minus one hai. Aakhir mein, kyunki dp of i sirf pichhli do entries padhta hai, array do rolling variables mein collapse ho jaata hai aur space constant ho jaata hai.',
      },
      {
        q: 'House robber has a fixed two-term recurrence; coin change loops over the coins. What determines whether a 1D DP transition is O(1) or O(k) per state, and how does that affect the overall complexity?',
        qHi: 'House robber ka ek fixed two-term recurrence hai; coin change coins par loop karta hai. Kya tay karta hai ki ek 1D DP transition prati state O(1) hai ya O(k), aur wo overall complexity ko kaise prabhaavit karta hai?',
        a: 'The per-state transition cost is the number of smaller states that dp of the current state depends on, plus the work to combine them. In house robber, the answer at index i is a function of exactly two earlier states, dp of i minus one and dp of i minus two, so computing each state is constant work, and with n states the whole DP is O of n. In coin change, the answer at amount a can be reached by using any one of the k coin denominations as the last coin, so dp of a depends on up to k earlier states, dp of a minus c for each coin c, and computing it means taking a minimum over k values. That makes each state O of k work, and with amount plus one states the DP is O of amount times k. The general rule is that a 1D DP\'s running time is the number of states times the per-state transition cost, and the transition cost is dictated by how many choices you have to consider at each step. A recurrence that reaches back a fixed, small number of positions is constant per state; one that loops over a set of moves, coins, jump lengths, previous partition points, is linear in the size of that set per state. This also tells you where to look for speedups: if the per-state loop is the bottleneck, techniques like maintaining a running minimum, a monotonic deque, or a prefix-sum structure can sometimes reduce the transition from O of k back down to O of one, turning an O of n times k DP into O of n.',
        aHi: 'Prati-state transition cost chhote states ki tadaad hai jinpar current state ka dp nirbhar karta hai, plus unhe combine karne ka kaam. House robber mein, index i par jawaab bilkul do pehle ke states ka function hai, dp of i minus one aur dp of i minus two, isliye har state compute karna constant kaam hai, aur n states ke saath poora DP O of n hai. Coin change mein, amount a par jawaab k coin denominations mein se kisi ek ko aakhri coin ki tarah istemal karke pahuncha jaa sakta hai, isliye dp of a k tak pehle ke states par nirbhar karta hai, har coin c ke liye dp of a minus c, aur ise compute karna matlab k values par ek minimum lena. Wo har state ko O of k kaam banaata hai, aur amount plus one states ke saath DP O of amount times k hai. General rule ye hai ki ek 1D DP ka running time states ki tadaad guna prati-state transition cost hai, aur transition cost is baat se tay hota hai ki har step par aapko kitni choices consider karni hain. Ek recurrence jo ek fixed, chhoti tadaad positions peechhe pahunchta hai wo prati state constant hai; ek jo moves, coins, jump lengths, pichhle partition points ke ek set par loop karta hai wo us set ke size mein prati state linear hai. Ye aapko ye bhi batata hai ki speedups kahaan dhoondhein: agar prati-state loop bottleneck hai, ek running minimum, ek monotonic deque, ya ek prefix-sum structure maintain karne jaisi techniques kabhi-kabhi transition ko O of k se wapas O of one par kam kar sakti hain, ek O of n times k DP ko O of n mein badalte hue.',
      },
    ],

    exercises: [
      {
        task: 'Implement rob (O(n) dp) and robO1 (O(1) rolling). Test on [2,7,9,3,1] (expect 12), [2,1,1,2] (expect 4), and a single-element array. Confirm robO1 matches rob everywhere.',
        taskHi: 'rob (O(n) dp) aur robO1 (O(1) rolling) implement karo. [2,7,9,3,1] (12 expect karo), [2,1,1,2] (4 expect karo), aur ek single-element array par test karo. Confirm karo robO1 har jagah rob se mel khaata hai.',
        hint: 'For [2,1,1,2] the answer is nums[0] + nums[3] = 4, not nums[1] + nums[3] = 3. Trace dp by hand to see why.',
        hintHi: '[2,1,1,2] ke liye jawaab nums[0] + nums[3] = 4 hai, nums[1] + nums[3] = 3 nahi. Kyun dekhne ke liye dp haath se trace karo.',
      },
      {
        task: 'Implement coinChange. Test [1,2,5] amount 11 (expect 3), [2] amount 3 (expect -1), [1] amount 0 (expect 0). Then implement coinChangeCount (number of DISTINCT combinations, not fewest coins) and note how the loop order changes.',
        taskHi: 'coinChange implement karo. [1,2,5] amount 11 (3 expect karo), [2] amount 3 (-1 expect karo), [1] amount 0 (0 expect karo). Phir coinChangeCount implement karo (DISTINCT combinations ki tadaad, sabse kam coins nahi) aur note karo loop order kaise badalta hai.',
        hint: 'For counting distinct combinations, loop coins OUTSIDE and amount inside, so each coin is considered once per combination — otherwise you count permutations.',
        hintHi: 'Distinct combinations ginne ke liye, coins ko BAHAR loop karo aur amount andar, taaki har coin prati combination ek baar consider ho — warna aap permutations ginte ho.',
      },
      {
        task: 'Implement "decode ways": given a digit string like "226", count how many ways it decodes to letters (A=1..Z=26). "226" -> "BZ", "VF", "BBF" -> 3. Use dp[i] = ways to decode the first i characters.',
        taskHi: '"decode ways" implement karo: ek digit string jaisi "226" diya gaya, gino ise kitne tarikon se letters mein decode hota hai (A=1..Z=26). "226" -> "BZ", "VF", "BBF" -> 3. dp[i] = pehle i characters decode karne ke tarike istemal karo.',
        hint: 'dp[i] += dp[i-1] if s[i-1] is 1-9; dp[i] += dp[i-2] if s[i-2..i-1] is 10-26. Watch the "0" cases: "0" alone is invalid, "10" and "20" are valid but "30" is not.',
        hintHi: 'dp[i] += dp[i-1] agar s[i-1] 1-9 hai; dp[i] += dp[i-2] agar s[i-2..i-1] 10-26 hai. "0" cases dekho: akela "0" invalid hai, "10" aur "20" valid hain par "30" nahi.',
      },
    ],

    keyTakeaways: [
      '1D DP: a subproblem is described by a single index i, and dp[i] is built from a bounded number of earlier states (or a loop over choices).',
      'House robber: dp[i] = max(dp[i-1] (skip house i), dp[i-2] + nums[i] (rob it, so i-1 was skipped)). O(n), then O(1) with two rolling variables.',
      'Coin change: dp[a] = 1 + min over coins c of dp[a - c], with dp[0] = 0. The transition loops over the coin set, so it is O(amount * numCoins).',
      'Per-state cost = number of earlier states the recurrence reads. Fixed-distance lookback = O(1) per state; loop over k choices = O(k) per state.',
      'To recover the actual choices (not just the optimal value), keep the full dp array and walk backwards, checking which branch of the max/min produced each dp[i].',
      'The same 1D shape covers max-non-adjacent-sum, decode ways, perfect-squares, longest-run, and Kadane\'s max subarray from Module 2.',
    ],
    keyTakeawaysHi: [
      '1D DP: ek subproblem ek akele index i se describe hota hai, aur dp[i] ek bounded tadaad pehle ke states se banta hai (ya choices par ek loop).',
      'House robber: dp[i] = max(dp[i-1] (house i skip), dp[i-2] + nums[i] (loot, toh i-1 skip hua)). O(n), phir do rolling variables ke saath O(1).',
      'Coin change: dp[a] = 1 + coins c par dp[a - c] ka min, dp[0] = 0 ke saath. Transition coin set par loop karta hai, isliye ye O(amount * numCoins) hai.',
      'Prati-state cost = pehle ke states ki tadaad jo recurrence padhta hai. Fixed-distance lookback = prati state O(1); k choices par loop = prati state O(k).',
      'Asli choices recover karne ke liye (sirf optimal value nahi), poora dp array rakho aur peechhe chalo, check karte hue max/min ki kaunsi branch ne har dp[i] banaaya.',
      'Wahi 1D shape max-non-adjacent-sum, decode ways, perfect-squares, longest-run, aur Module 2 ke Kadane\'s max subarray ko cover karta hai.',
    ],
  },
];
