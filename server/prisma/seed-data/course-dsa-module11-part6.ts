/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 6
 * (final lesson of Module 11).
 *
 * Interval DP: the subproblem state is a contiguous range [i, j] of a sequence,
 * and the recurrence tries every possible SPLIT POINT k inside that range,
 * combining the answers for [i, k] and [k, j] (or [i, k-1] and [k+1, j]). Builds
 * on this module's lessons 3 and 5 (2D tables) and this course's Module 6
 * (recursion: "try every option and take the best"). Broken example: "matrix
 * chain multiplication" — given a chain of matrices, choose the parenthesisation
 * that minimises the total scalar multiplications — solved by recursively trying
 * every parenthesisation, which is Catalan-number many (exponential). Fixed with
 * a 2D table dp[i][j] = the minimum cost to fully multiply the sub-chain from i
 * to j, computed as the min over every split k of dp[i][k] + dp[k+1][j] + (cost
 * of the one multiplication that joins the two halves). The table must be filled
 * by INCREASING interval length, because dp[i][j] depends on strictly shorter
 * intervals. O(n^3). Palindrome partitioning and "burst balloons" are the same
 * shape.
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

export const DSA_MODULE_11_PART6: CourseLesson[] = [
  {
    slug: 'dp-interval-split-point',
    title: 'Interval DP: State Is a Range, Transition Is a Split Point',
    titleHi: 'Interval DP: State Ek Range Hai, Transition Ek Split Point',
    description: 'Choosing how to parenthesise a chain of matrix multiplications to minimise the total number of scalar multiplications, by recursively trying every possible parenthesisation. The number of ways to parenthesise a chain of n matrices is the (n-1)th Catalan number, which grows roughly like 4^n — hopeless past a handful of matrices.',
    descriptionHi: 'Matrix multiplications ki ek chain ko kaise parenthesise karein choose karna kul scalar multiplications ki tadaad minimise karne ke liye, recursively har sambhaavit parenthesisation try karke. n matrices ki ek chain ko parenthesise karne ke tarike (n-1)vaan Catalan number hai, jo lagbhag 4^n ki tarah badhta hai — mutthi bhar matrices ke baad nirasha.',
    difficulty: 'HARD',
    duration: 26,
    order: 6,

    analogy: {
      en: '**Planning how to combine a row of ingredients into one dish, where you can only ever mix two adjacent piles at a time and each mix has a cost that depends on the two pile sizes.** You have piles laid out left to right. The final dish is one big pile, and it was formed by the last mix, which combined a left group and a right group. That last mix could have happened at any of the boundaries between adjacent piles — after pile 1, after pile 2, and so on. Whichever boundary it was, the left group had to be fully combined into one pile first, and so did the right group, and those are smaller versions of the exact same problem. So the best plan for the whole row is: for every possible position of the final mix, add up the best cost to combine everything to its left, the best cost to combine everything to its right, and the cost of that final mix itself, then keep the smallest total. To compute those left and right costs you need the answers for shorter stretches of the row, so you work out all the length-two stretches first, then length-three, and so on, until you reach the full row. You never write out a full mixing plan; you fill a triangular table of "best cost to combine piles i through j".',
      hi: '**Ingredients ki ek row ko ek dish mein combine karna plan karna, jahaan aap sirf do adjacent piles ek baar mein mix kar sakte ho aur har mix ki ek cost hai jo do pile sizes par nirbhar karti hai.** Aapke paas piles left se right rakhi hain. Antim dish ek badi pile hai, aur ye aakhri mix se bani, jisne ek left group aur ek right group combine kiya. Wo aakhri mix adjacent piles ke beech kisi bhi boundary par ho sakta tha — pile 1 ke baad, pile 2 ke baad, aur aise hi. Jo bhi boundary thi, left group ko pehle poori tarah ek pile mein combine hona pada, aur right group ko bhi, aur wo bilkul usi problem ke chhote versions hain. Toh poori row ke liye best plan hai: antim mix ki har sambhaavit position ke liye, iske left mein sab kuch combine karne ki best cost, iske right mein sab kuch combine karne ki best cost, aur us antim mix ki khud ki cost jodo, phir sabse chhota total rakho. Un left aur right costs ko compute karne ke liye aapko row ke chhote stretches ke jawaab chahiye, isliye aap pehle sab length-two stretches nikaalte ho, phir length-three, aur aise hi, jab tak aap poori row tak pahunch jao. Aap ek poora mixing plan kabhi nahi likhte; aap "piles i se j combine karne ki best cost" ki ek triangular table bharte ho.',
    },

    simple: `**Start broken.** Matrix chain multiplication by trying every parenthesisation:

\`\`\`js
// dims[k-1] x dims[k] is the shape of matrix k. Multiplying an a x b by a b x c
// matrix costs a*b*c scalar multiplications.
function mcmBrute(dims, i, j) {
  if (i === j) return 0;                          // a single matrix: nothing to multiply
  let best = Infinity;
  for (let k = i; k < j; k++) {                   // last multiplication joins [i..k] and [k+1..j]
    const cost = mcmBrute(dims, i, k)
               + mcmBrute(dims, k + 1, j)
               + dims[i - 1] * dims[k] * dims[j];
    best = Math.min(best, cost);
  }
  return best;
}
\`\`\`

Correct, but the recursion re-solves \`mcmBrute(dims, i, k)\` for the same \`(i, k)\` across many different outer split choices. The number of distinct parenthesisations is Catalan(n-1), exponential. The state that fully describes a subproblem: **the range of matrices \`[i, j]\` to be multiplied together**.

**The fix: dp[i][j] = min cost to fully multiply the sub-chain i..j**

\`\`\`js
function matrixChain(dims) {
  const n = dims.length - 1;                      // number of matrices
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let len = 2; len <= n; len++) {            // fill by INCREASING interval length
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {               // try every split point
        const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
        if (cost < dp[i][j]) dp[i][j] = cost;
      }
    }
  }
  return dp[1][n];
}
\`\`\`

\`\`\`ts
function matrixChain(dims: number[]): number {
  const n = dims.length - 1;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i]![j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i]![k]! + dp[k + 1]![j]! + dims[i - 1]! * dims[k]! * dims[j]!;
        if (cost < dp[i]![j]!) dp[i]![j] = cost;
      }
    }
  }
  return dp[1]![n]!;
}
\`\`\`

- **State**: \`dp[i][j]\` = minimum scalar multiplications to reduce matrices \`i\` through \`j\` to a single matrix.
- **Recurrence**: the final multiplication splits the chain at some \`k\` (\`i <= k < j\`), combining an already-reduced \`[i..k]\` with an already-reduced \`[k+1..j]\`. That last step costs \`dims[i-1] * dims[k] * dims[j]\`. Minimise over all \`k\`.
- **Base case**: \`dp[i][i] = 0\` (one matrix, nothing to do).
- **Order**: **by increasing interval length**, because \`dp[i][j]\` depends on \`dp[i][k]\` and \`dp[k+1][j]\`, which are strictly shorter intervals.
- **Answer**: \`dp[1][n]\`.

O(n^2) states times O(n) split points each = **O(n^3)**.

**Why the fill order is different from a grid DP**

In lesson 3's grid DP, filling row by row worked because \`dp[r][c]\` only needed cells above and to the left. Here \`dp[i][j]\` needs \`dp[i][k]\` (same row, to the left) *and* \`dp[k+1][j]\` (a lower row, in the same column region). Neither pure row-major nor column-major order guarantees both are ready. Iterating by **interval length** does: every interval strictly shorter than \`[i, j]\` is filled before \`[i, j]\` is touched, and \`[i, k]\` and \`[k+1, j]\` are both strictly shorter.`,

    simpleHi: `**Toote hue se shuru.** Matrix chain multiplication har parenthesisation try karke:

\`\`\`js
// dims[k-1] x dims[k] matrix k ka shape hai. Ek a x b ko ek b x c
// matrix se multiply karna a*b*c scalar multiplications kharch karta hai.
function mcmBrute(dims, i, j) {
  if (i === j) return 0;                          // ek akela matrix: multiply karne ko kuch nahi
  let best = Infinity;
  for (let k = i; k < j; k++) {                   // aakhri multiplication [i..k] aur [k+1..j] ko jodta hai
    const cost = mcmBrute(dims, i, k)
               + mcmBrute(dims, k + 1, j)
               + dims[i - 1] * dims[k] * dims[j];
    best = Math.min(best, cost);
  }
  return best;
}
\`\`\`

Sahi, par recursion \`mcmBrute(dims, i, k)\` ko usi \`(i, k)\` ke liye kayi alag outer split choices ke aar-paar re-solve karti hai. Distinct parenthesisations ki tadaad Catalan(n-1) hai, exponential. Wo state jo ek subproblem ko poori tarah describe karta hai: **saath multiply hone waali matrices ki range \`[i, j]\`**.

**Fix: dp[i][j] = sub-chain i..j ko poori tarah multiply karne ki min cost**

\`\`\`js
function matrixChain(dims) {
  const n = dims.length - 1;                      // matrices ki tadaad
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

  for (let len = 2; len <= n; len++) {            // BADHTI interval length se bharo
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {               // har split point try karo
        const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
        if (cost < dp[i][j]) dp[i][j] = cost;
      }
    }
  }
  return dp[1][n];
}
\`\`\`

\`\`\`ts
function matrixChain(dims: number[]): number {
  const n = dims.length - 1;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i]![j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i]![k]! + dp[k + 1]![j]! + dims[i - 1]! * dims[k]! * dims[j]!;
        if (cost < dp[i]![j]!) dp[i]![j] = cost;
      }
    }
  }
  return dp[1]![n]!;
}
\`\`\`

- **State**: \`dp[i][j]\` = matrices \`i\` se \`j\` ko ek akele matrix mein reduce karne ke minimum scalar multiplications.
- **Recurrence**: antim multiplication chain ko kisi \`k\` par split karta hai (\`i <= k < j\`), ek pehle-se-reduced \`[i..k]\` ko ek pehle-se-reduced \`[k+1..j]\` ke saath combine karte hue. Wo aakhri step \`dims[i-1] * dims[k] * dims[j]\` kharch karta hai. Sab \`k\` par minimise karo.
- **Base case**: \`dp[i][i] = 0\` (ek matrix, kuch karne ko nahi).
- **Order**: **badhti interval length se**, kyunki \`dp[i][j]\` \`dp[i][k]\` aur \`dp[k+1][j]\` par nirbhar karta hai, jo sakhti se chhote intervals hain.
- **Answer**: \`dp[1][n]\`.

O(n^2) states guna prati ek O(n) split points = **O(n^3)**.

**Fill order ek grid DP se alag kyun hai**

Lesson 3 ke grid DP mein, row by row bharna kaam karta tha kyunki \`dp[r][c]\` ko sirf upar aur left ki cells chahiye thi. Yahaan \`dp[i][j]\` ko \`dp[i][k]\` (wahi row, left) *aur* \`dp[k+1][j]\` (ek lower row, usi column region mein) chahiye. Na pure row-major na column-major order dono ready hone ki guarantee deta hai. **Interval length** se iterate karna deta hai: \`[i, j]\` se sakhti se chhota har interval \`[i, j]\` ko chhue jaane se pehle bhara jaata hai, aur \`[i, k]\` aur \`[k+1, j]\` dono sakhti se chhote hain.`,

    content: `## Palindrome partitioning: minimum cuts

\`\`\`js
// Minimum cuts so that every piece of s is a palindrome.
function minCut(s) {
  const n = s.length;
  // isPal[i][j] = is s[i..j] a palindrome?  (a small interval DP itself)
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
    }
  }
  // cuts[i] = min cuts for the prefix s[0..i]
  const cuts = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (isPal[0][i]) { cuts[i] = 0; continue; }
    let best = i;                                  // worst case: cut before every character
    for (let j = 1; j <= i; j++) {
      if (isPal[j][i]) best = Math.min(best, cuts[j - 1] + 1);
    }
    cuts[i] = best;
  }
  return cuts[n - 1];
}
\`\`\`

Two interval-flavoured tables: \`isPal[i][j]\` is a classic interval DP (a range is a palindrome iff its ends match and its interior is a palindrome — fill by increasing length, or by decreasing \`i\`). The \`cuts\` array is a 1D DP that uses \`isPal\` as an O(1) oracle: \`cuts[i] = 1 + min over j of cuts[j-1]\` where \`s[j..i]\` is a palindrome.

## Burst balloons: the split point is the LAST balloon burst, not the first

\`\`\`js
// nums[i] is a balloon's value. Bursting balloon i gives left * i * right coins,
// where left/right are the currently-adjacent balloons. Maximise total coins.
function maxCoins(nums) {
  const a = [1, ...nums, 1];                       // padding so edge balloons have neighbours
  const n = a.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let len = 2; len < n; len++) {              // len = distance between the two fixed ends
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      // k is the LAST balloon burst in the open interval (i, j)
      for (let k = i + 1; k < j; k++) {
        const coins = a[i] * a[k] * a[j] + dp[i][k] + dp[k][j];
        if (coins > dp[i][j]) dp[i][j] = coins;
      }
    }
  }
  return dp[0][n - 1];
}
\`\`\`

The insight that makes this an interval DP: iterate over which balloon is burst **last** within \`(i, j)\`. When balloon \`k\` is last, its neighbours at that moment are exactly \`a[i]\` and \`a[j]\` (everything strictly between has already gone), so its burst is worth \`a[i]*a[k]*a[j]\`, and the two sides \`(i, k)\` and \`(k, j)\` are independent, already-solved subproblems. Choosing the *last* action rather than the first is a recurring trick in interval DP — it fixes the two boundary values so the sub-intervals become independent.

## The interval-DP checklist

\`\`\`
1. State:      dp[i][j] over a contiguous range [i, j].
2. Recurrence: loop a split point k inside [i, j]; combine dp of the two pieces
               plus the cost/gain of the step that joins them at k.
               (Sometimes k is the FIRST element handled, sometimes the LAST —
                pick whichever makes the two sub-ranges independent.)
3. Base case:  the smallest ranges — dp[i][i] = 0, or length-1/length-2 handled directly.
4. Order:      BY INCREASING INTERVAL LENGTH. Never row-major.
5. Answer:     dp[0][n-1] or dp[1][n] (the whole range).
6. Cost:       O(n^2) intervals x O(n) split points = O(n^3) typically.
\`\`\`

## Why "increasing length" is the only safe fill order here

\`\`\`
dp[i][j] reads dp[i][k] and dp[k+1][j] for every k in [i, j).
  - dp[i][k] has the same left end i but a smaller right end -> shorter interval.
  - dp[k+1][j] has a larger left end but the same right end -> shorter interval.

Both operands are strictly shorter than [i, j]. If you fill all intervals of
length L before any interval of length L+1, then whenever you compute dp[i][j]
its operands (all of length < j - i + 1) are already done. Row-major or
column-major order mixes interval lengths and can read an unfilled cell.
\`\`\``,

    contentHi: `## Palindrome partitioning: minimum cuts

\`\`\`js
// Minimum cuts taaki s ka har piece ek palindrome ho.
function minCut(s) {
  const n = s.length;
  // isPal[i][j] = kya s[i..j] ek palindrome hai?  (khud ek chhota interval DP)
  const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
    }
  }
  // cuts[i] = prefix s[0..i] ke liye min cuts
  const cuts = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    if (isPal[0][i]) { cuts[i] = 0; continue; }
    let best = i;                                  // worst case: har character se pehle cut
    for (let j = 1; j <= i; j++) {
      if (isPal[j][i]) best = Math.min(best, cuts[j - 1] + 1);
    }
    cuts[i] = best;
  }
  return cuts[n - 1];
}
\`\`\`

Do interval-flavoured tables: \`isPal[i][j]\` ek classic interval DP hai (ek range ek palindrome hai jab iske ends match karte hain aur iska interior ek palindrome hai — badhti length se bharo, ya ghatte \`i\` se). \`cuts\` array ek 1D DP hai jo \`isPal\` ko ek O(1) oracle ki tarah istemal karta hai: \`cuts[i] = 1 + j par cuts[j-1] ka min\` jahaan \`s[j..i]\` ek palindrome hai.

## Burst balloons: split point AAKHRI balloon burst hai, pehla nahi

\`\`\`js
// nums[i] ek balloon ki value hai. Balloon i burst karna left * i * right coins deta hai,
// jahaan left/right abhi-adjacent balloons hain. Kul coins maximise karo.
function maxCoins(nums) {
  const a = [1, ...nums, 1];                       // padding taaki edge balloons ke neighbours hon
  const n = a.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let len = 2; len < n; len++) {              // len = do fixed ends ke beech doori
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      // k open interval (i, j) mein AAKHRI balloon burst hai
      for (let k = i + 1; k < j; k++) {
        const coins = a[i] * a[k] * a[j] + dp[i][k] + dp[k][j];
        if (coins > dp[i][j]) dp[i][j] = coins;
      }
    }
  }
  return dp[0][n - 1];
}
\`\`\`

Wo insight jo ise ek interval DP banaata hai: is par iterate karo ki \`(i, j)\` ke andar kaunsa balloon **aakhri** burst hota hai. Jab balloon \`k\` aakhri hai, us pal iske neighbours bilkul \`a[i]\` aur \`a[j]\` hain (sakhti se beech ka sab kuch pehle se jaa chuka), toh iska burst \`a[i]*a[k]*a[j]\` ke laayak hai, aur do sides \`(i, k)\` aur \`(k, j)\` swatantra, pehle-se-solved subproblems hain. Pehli action ke bajaye *aakhri* choose karna interval DP mein ek recurring trick hai — ye do boundary values fix karta hai taaki sub-intervals swatantra ho jaayein.

## Interval-DP checklist

\`\`\`
1. State:      dp[i][j] ek contiguous range [i, j] par.
2. Recurrence: [i, j] ke andar ek split point k loop karo; do pieces ke dp ko combine
               karo plus us step ki cost/gain jo unhe k par jodta hai.
               (Kabhi k PEHLA handle kiya element hai, kabhi AAKHRI —
                jo bhi do sub-ranges ko swatantra banaaye use chuno.)
3. Base case:  sabse chhoti ranges — dp[i][i] = 0, ya length-1/length-2 seedhe handle.
4. Order:      BADHTI INTERVAL LENGTH SE. Kabhi row-major nahi.
5. Answer:     dp[0][n-1] ya dp[1][n] (poori range).
6. Cost:       O(n^2) intervals x O(n) split points = typically O(n^3).
\`\`\`

## "Badhti length" yahaan ekmatra safe fill order kyun hai

\`\`\`
dp[i][j] har k in [i, j) ke liye dp[i][k] aur dp[k+1][j] padhta hai.
  - dp[i][k] ka wahi left end i par ek chhota right end -> chhota interval.
  - dp[k+1][j] ka ek bada left end par wahi right end -> chhota interval.

Dono operands [i, j] se sakhti se chhote hain. Agar aap length L ke sab intervals
length L+1 ke kisi interval se pehle bharte ho, toh jab bhi aap dp[i][j] compute
karte ho iske operands (sab length < j - i + 1) pehle se done hain. Row-major ya
column-major order interval lengths mix karta hai aur ek unfilled cell padh sakta hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: matrix chain by trying every parenthesisation',
        titleHi: 'Toota: matrix chain har parenthesisation try karke',
        code: `for (let k = i; k < j; k++)
  best = Math.min(best, mcm(i, k) + mcm(k+1, j) + dims[i-1]*dims[k]*dims[j]);`,
        codeJs: `function mcmBrute(dims, i, j) {
  if (i === j) return 0;
  let best = Infinity;
  for (let k = i; k < j; k++)
    best = Math.min(best, mcmBrute(dims, i, k) + mcmBrute(dims, k + 1, j)
                        + dims[i - 1] * dims[k] * dims[j]);
  return best;
}
console.log(mcmBrute([10, 30, 5, 60], 1, 3)); // 4500  — but Catalan-many calls`,
        codeTs: `function mcmBrute(dims: number[], i: number, j: number): number {
  if (i === j) return 0;
  let best = Infinity;
  for (let k = i; k < j; k++)
    best = Math.min(best, mcmBrute(dims, i, k) + mcmBrute(dims, k + 1, j)
                        + dims[i - 1]! * dims[k]! * dims[j]!);
  return best;
}`,
        output: `4500`,
        explain: 'Every parenthesisation is tried, and the sub-chain (i, k) is re-solved for the same (i, k) under many different outer splits. The count is the Catalan number, ~4^n.',
        explainHi: 'Har parenthesisation try hoti hai, aur sub-chain (i, k) usi (i, k) ke liye kayi alag outer splits ke tahat re-solve hoti hai. Count Catalan number hai, ~4^n.',
      },
      {
        title: 'Fixed: dp[i][j] filled by increasing interval length',
        titleHi: 'Theek: dp[i][j] badhti interval length se bhara',
        code: `for (let len = 2; len <= n; len++)
  for (let i = 1; i + len - 1 <= n; i++) {
    const j = i + len - 1;
    for (let k = i; k < j; k++)
      dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j]);
  }`,
        codeJs: `function matrixChain(dims) {
  const n = dims.length - 1;
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let len = 2; len <= n; len++)
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++)
        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j]);
    }
  return dp[1][n];
}
console.log(matrixChain([10, 30, 5, 60])); // 4500  in O(n^3)`,
        codeTs: `function matrixChain(dims: number[]): number {
  const n = dims.length - 1;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let len = 2; len <= n; len++)
    for (let i = 1; i + len - 1 <= n; i++) {
      const j = i + len - 1;
      dp[i]![j] = Infinity;
      for (let k = i; k < j; k++)
        dp[i]![j] = Math.min(dp[i]![j]!, dp[i]![k]! + dp[k + 1]![j]! + dims[i - 1]! * dims[k]! * dims[j]!);
    }
  return dp[1]![n]!;
}`,
        outputJs: `4500`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'n^2 range states, each minimised over n split points. Filling by interval length guarantees dp[i][k] and dp[k+1][j] (both shorter) are ready. O(n^3).',
        explainHi: 'n^2 range states, har ek n split points par minimised. Interval length se bharna guarantee karta hai ki dp[i][k] aur dp[k+1][j] (dono chhote) ready hain. O(n^3).',
      },
      {
        title: 'Burst balloons: iterate over the LAST balloon burst',
        titleHi: 'Burst balloons: AAKHRI balloon burst par iterate karo',
        code: `for (let k = i + 1; k < j; k++)
  dp[i][j] = Math.max(dp[i][j], a[i]*a[k]*a[j] + dp[i][k] + dp[k][j]);`,
        codeJs: `function maxCoins(nums) {
  const a = [1, ...nums, 1];
  const n = a.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len < n; len++)
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      for (let k = i + 1; k < j; k++)
        dp[i][j] = Math.max(dp[i][j], a[i] * a[k] * a[j] + dp[i][k] + dp[k][j]);
    }
  return dp[0][n - 1];
}
console.log(maxCoins([3, 1, 5, 8])); // 167`,
        codeTs: `function maxCoins(nums: number[]): number {
  const a = [1, ...nums, 1];
  const n = a.length;
  const dp = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let len = 2; len < n; len++)
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      for (let k = i + 1; k < j; k++)
        dp[i]![j] = Math.max(dp[i]![j]!, a[i]! * a[k]! * a[j]! + dp[i]![k]! + dp[k]![j]!);
    }
  return dp[0]![n - 1]!;
}`,
        outputJs: `167`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Choosing k as the LAST balloon burst in (i, j) fixes its neighbours as a[i] and a[j], making the two sub-intervals independent. That is what turns an order-dependent problem into a clean interval DP.',
        explainHi: 'k ko (i, j) mein AAKHRI balloon burst chunna iske neighbours ko a[i] aur a[j] fix karta hai, do sub-intervals ko swatantra banate hue. Wahi ek order-dependent problem ko ek saaf interval DP mein badalta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// filling an interval DP row by row
for (let i = 1; i <= n; i++)
  for (let j = i; j <= n; j++) { ... dp[i][j] uses dp[k+1][j] ... }
// dp[k+1][j] is in a LOWER row that has not been filled yet`,
        right: `for (let len = 2; len <= n; len++)
  for (let i = 1; i + len - 1 <= n; i++) { const j = i + len - 1; ... }`,
        why: 'dp[i][j] depends on dp[k+1][j], which lives in row k+1 > i. Row-major order (i outer) reaches dp[i][j] before row k+1 is done, reading garbage. Filling by interval length fixes this.',
        whyHi: 'dp[i][j] dp[k+1][j] par nirbhar karta hai, jo row k+1 > i mein hai. Row-major order (i bahar) dp[i][j] par row k+1 done hone se pehle pahunchta hai, kachra padhte hue. Interval length se bharna ise theek karta hai.',
      },
      {
        wrong: `// matrix chain: including k or k+1 in the wrong sub-range
const cost = dp[i][k - 1] + dp[k][j] + ...;   // off by one -> wrong split semantics`,
        right: `const cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];`,
        why: 'The split at k means "[i..k] reduced to one matrix, [k+1..j] reduced to one matrix, then multiply those two". The two sub-ranges must partition [i, j] exactly with no gap and no overlap.',
        whyHi: 'k par split ka matlab "[i..k] ek matrix mein reduced, [k+1..j] ek matrix mein reduced, phir un dono ko multiply". Do sub-ranges ko [i, j] ko bilkul partition karna chahiye bina gap aur bina overlap.',
      },
      {
        wrong: `// burst balloons: iterating over which balloon is burst FIRST
// then the sub-intervals are NOT independent (their neighbours keep changing)`,
        right: `// iterate over which balloon is burst LAST in (i, j).
// then its neighbours are exactly a[i] and a[j], and the sides are independent.`,
        why: 'If k is burst first, the remaining balloons\' neighbours shift as more burst, so dp[i][k] and dp[k][j] would not be self-contained. Making k last freezes the boundary values a[i], a[j].',
        whyHi: 'Agar k pehle burst hota hai, baaki balloons ke neighbours shift hote hain jaise aur burst hote hain, isliye dp[i][k] aur dp[k][j] self-contained nahi hote. k ko aakhri banana boundary values a[i], a[j] freeze karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Query optimisers in databases** choose a join order for a chain of tables using matrix-chain-style interval DP — the cost of joining depends on intermediate result sizes, exactly like scalar-multiplication counts.',
        hi: '**Databases mein query optimisers** tables ki ek chain ke liye ek join order matrix-chain-style interval DP se chunte hain — joining ki cost intermediate result sizes par nirbhar karti hai, bilkul scalar-multiplication counts ki tarah.',
      },
      {
        en: '**Optimal binary search tree construction** — arrange keys with known access frequencies so total expected lookup cost is minimal — is an interval DP over key ranges, splitting on which key is the root.',
        hi: '**Optimal binary search tree construction** — jaani gayi access frequencies waali keys ko aise arrange karo ki kul expected lookup cost minimal ho — key ranges par ek interval DP hai, is par split karte hue ki kaunsi key root hai.',
      },
      {
        en: '**RNA secondary-structure prediction** in bioinformatics maximises the number of valid base pairs with an interval DP over subsequences of the RNA strand.',
        hi: '**Bioinformatics mein RNA secondary-structure prediction** RNA strand ke subsequences par ek interval DP se valid base pairs ki tadaad maximise karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must an interval DP be filled by increasing interval length, when a grid DP can be filled row by row?',
        qHi: 'Ek interval DP ko badhti interval length se kyun bhara jaana chahiye, jab ek grid DP row by row bhara jaa sakta hai?',
        a: 'The fill order for any DP must respect the dependency direction: every cell must be computed only after all the cells its recurrence reads. In a grid DP like unique paths, the cell at row r and column c depends on the cell directly above and the cell directly to the left. Both of those have either a smaller row or a smaller column, and iterating rows outer, columns inner, guarantees that when you reach any cell, everything with a smaller row is entirely done and everything to its left in the current row is done. So row-major order is a valid topological order of the dependency graph. An interval DP is different. The cell dp of i and j depends on dp of i and k, and dp of k plus one and j, for every split point k between i and j. Consider dp of i and k: it has the same left endpoint i but a right endpoint k that is less than j, so it is a shorter interval. Consider dp of k plus one and j: it has a left endpoint k plus one that is greater than i but the same right endpoint j, so it is also a shorter interval. Every dependency is a strictly shorter interval, but the dependencies are scattered across different rows and columns of the two-dimensional table. In particular dp of k plus one and j sits in row k plus one, which is below row i, so if you filled the table row by row with i increasing, you would try to compute dp of i and j while row k plus one is still empty. The one ordering that always works is by interval length: fill every interval of length two, then every interval of length three, and so on. Because both dependencies are strictly shorter than the current interval, they were both filled in an earlier length pass, regardless of where they sit in the table.',
        aHi: 'Kisi bhi DP ke liye fill order ko dependency direction ka samman karna chahiye: har cell sirf tab compute hona chahiye jab uska recurrence jo sab cells padhta hai wo done hon. Unique paths jaise ek grid DP mein, row r aur column c par cell seedhe upar ki cell aur seedhe left ki cell par nirbhar karta hai. Un dono ka ya toh ek chhota row hai ya ek chhota column, aur rows bahar, columns andar iterate karna guarantee karta hai ki jab aap kisi cell par pahunchte ho, chhote row waala sab kuch poori tarah done hai aur current row mein iske left ka sab kuch done hai. Toh row-major order dependency graph ka ek valid topological order hai. Ek interval DP alag hai. Cell dp of i aur j dp of i aur k, aur dp of k plus one aur j par nirbhar karta hai, har split point k ke liye. dp of i aur k par vichaar karo: iska wahi left endpoint i par ek right endpoint k hai jo j se kam hai, toh ye ek chhota interval hai. dp of k plus one aur j par vichaar karo: iska ek left endpoint k plus one hai jo i se bada hai par wahi right endpoint j, toh ye bhi ek chhota interval hai. Har dependency ek sakhti se chhota interval hai, par dependencies do-dimensional table ke alag rows aur columns mein bikhri hain. Khaas taur par dp of k plus one aur j row k plus one mein baithta hai, jo row i ke neeche hai, isliye agar aapne table ko i badhte hue row by row bhara, aap dp of i aur j compute karne ki koshish karte jab row k plus one abhi bhi khaali hai. Ek ordering jo hamesha kaam karti hai wo interval length se hai: length two ka har interval bharo, phir length three ka har interval, aur aise hi. Kyunki dono dependencies current interval se sakhti se chhote hain, wo dono ek pehle length pass mein bhare gaye, chahe wo table mein kahin bhi baithe hon.',
      },
      {
        q: 'In burst balloons, why does iterating over the LAST balloon burst work when iterating over the FIRST does not?',
        qHi: 'Burst balloons mein, AAKHRI balloon burst par iterate karna kyun kaam karta hai jab PEHLE par nahi karta?',
        a: 'The difficulty in burst balloons is that when you burst a balloon, its coin reward depends on its two currently-adjacent balloons, and those neighbours change as other balloons are burst. So the reward for bursting a given balloon is not a fixed number; it depends on the order. For an interval DP you need to break the range into two independent sub-ranges whose answers can be computed without knowing what happens in the other, and independence is exactly what the changing-neighbours problem destroys. Now suppose you decide to iterate over which balloon in the open interval from i to j is burst first, calling it k. At the moment k is burst first, its neighbours are its immediate array neighbours, which is fine, but after k is gone, the balloons on its left and the balloons on its right are no longer separated by k; a balloon just left of k now has, as a potential future neighbour, a balloon that used to be on the right of k. So the left sub-range and the right sub-range are not independent: bursting order in one affects the neighbours available in the other. The recurrence would not decompose. Iterating over which balloon is burst last flips this. If k is the last balloon burst inside the open interval from i to j, then at the moment it bursts, every other balloon strictly between i and j is already gone, so k\'s only remaining neighbours are the balloons at positions i and j themselves, which are fixed and outside the interval. Its reward is therefore exactly a of i times a of k times a of j, a constant. And everything that happened before, on the left part from i to k and the right part from k to j, happened entirely within those sub-intervals with i, k, and j as untouched walls, so the two sides are genuinely independent subproblems. Choosing the last action to fix the boundary is the standard move that makes interval DP applicable to order-dependent problems.',
        aHi: 'Burst balloons mein mushkil ye hai ki jab aap ek balloon burst karte ho, iska coin reward iske do abhi-adjacent balloons par nirbhar karta hai, aur wo neighbours badalte hain jaise doosre balloons burst hote hain. Toh ek diye gaye balloon ko burst karne ka reward ek fixed number nahi hai; ye order par nirbhar karta hai. Ek interval DP ke liye aapko range ko do swatantra sub-ranges mein todna hai jinke jawaab doosre mein kya hota hai jaane bina compute ho sakein, aur independence bilkul wahi hai jo changing-neighbours problem nasht karti hai. Ab maano aap tay karte ho ki i se j tak open interval mein kaunsa balloon pehle burst hota hai par iterate karein, use k kaho. Jis pal k pehle burst hota hai, iske neighbours iske immediate array neighbours hain, jo theek hai, par k ke jaane ke baad, iske left ke balloons aur iske right ke balloons ab k se separated nahi hain; k ke bilkul left ka ek balloon ab, ek sambhaavit future neighbour ki tarah, ek balloon rakhta hai jo k ke right par hua karta tha. Toh left sub-range aur right sub-range swatantra nahi hain: ek mein bursting order doosre mein available neighbours ko prabhaavit karta hai. Recurrence decompose nahi hoti. Kaunsa balloon aakhri burst hota hai par iterate karna ise palat deta hai. Agar k i se j tak open interval ke andar aakhri balloon burst hai, toh jis pal ye burst hota hai, i aur j ke sakhti se beech har doosra balloon pehle se jaa chuka hai, isliye k ke ekmatra baaki neighbours positions i aur j par balloons khud hain, jo fixed aur interval ke bahar hain. Iska reward isliye bilkul a of i times a of k times a of j hai, ek constant. Aur jo bhi pehle hua, i se k tak left part par aur k se j tak right part par, poori tarah un sub-intervals ke andar hua i, k, aur j ke achhoote walls ki tarah, isliye do sides sach mein swatantra subproblems hain.',
      },
    ],

    exercises: [
      {
        task: 'Implement matrixChain (bottom-up, by interval length). Test on dims [10,30,5,60] (expect 4500) and [40,20,30,10,30] (expect 26000). Deliberately switch to row-major fill order and confirm the answer becomes wrong.',
        taskHi: 'matrixChain (bottom-up, interval length se) implement karo. dims [10,30,5,60] (4500 expect karo) aur [40,20,30,10,30] (26000 expect karo) par test karo. Jaan-boojhkar row-major fill order par switch karo aur confirm karo jawaab galat ho jaata hai.',
        hint: 'The bug is reading dp[k+1][j] before row k+1 is filled. Print dp after each length pass to see the diagonals fill outward.',
        hintHi: 'Bug row k+1 bharne se pehle dp[k+1][j] padhna hai. Har length pass ke baad dp print karo diagonals ko bahar bharte dekhne ke liye.',
      },
      {
        task: 'Implement minCut for palindrome partitioning using the isPal interval table plus the cuts 1D DP. Test "aab" (expect 1), "aba" (expect 0), "abccba" (expect 0).',
        taskHi: 'isPal interval table plus cuts 1D DP istemal karke palindrome partitioning ke liye minCut implement karo. "aab" (1 expect karo), "aba" (0 expect karo), "abccba" (0 expect karo) par test karo.',
        hint: 'Fill isPal by decreasing i, increasing j: isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1]). Then cuts[i] = 0 if s[0..i] is a palindrome, else 1 + min cuts[j-1] over palindromic s[j..i].',
        hintHi: 'isPal ko ghatte i, badhte j se bharo: isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1]). Phir cuts[i] = 0 agar s[0..i] ek palindrome hai, warna palindromic s[j..i] par 1 + min cuts[j-1].',
      },
      {
        task: 'Implement maxCoins (burst balloons) with the "last balloon burst" recurrence. Test [3,1,5,8] (expect 167) and [1,5] (expect 10). Add sentinel 1s at both ends of the padded array.',
        taskHi: '"aakhri balloon burst" recurrence ke saath maxCoins (burst balloons) implement karo. [3,1,5,8] (167 expect karo) aur [1,5] (10 expect karo) par test karo. Padded array ke dono ends par sentinel 1s jodo.',
        hint: 'a = [1, ...nums, 1]. dp[i][j] over the OPEN interval (i, j): for k from i+1 to j-1, dp[i][j] = max(dp[i][j], a[i]*a[k]*a[j] + dp[i][k] + dp[k][j]).',
        hintHi: 'a = [1, ...nums, 1]. dp[i][j] OPEN interval (i, j) par: k ke liye i+1 se j-1 tak, dp[i][j] = max(dp[i][j], a[i]*a[k]*a[j] + dp[i][k] + dp[k][j]).',
      },
    ],

    keyTakeaways: [
      'Interval DP: state is a contiguous range dp[i][j]; the recurrence loops a split point k inside [i, j] and combines the answers for the two sub-ranges plus the cost of joining them at k.',
      'Matrix chain: dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j]. O(n^2) intervals x O(n) splits = O(n^3).',
      'Fill order MUST be by increasing interval length. Both dp[i][k] and dp[k+1][j] are strictly shorter intervals, but they are scattered across rows/columns, so row-major order reads unfilled cells.',
      'Sometimes the split point is the FIRST element handled, sometimes the LAST. Choose whichever makes the two sub-ranges independent — burst balloons needs "k burst last" so its neighbours are fixed as a[i] and a[j].',
      'isPal[i][j] (is s[i..j] a palindrome) is itself a small interval DP: ends match AND interior is a palindrome; used as an O(1) oracle by palindrome-partitioning.',
      'Real uses: database join-order optimisation, optimal BST construction, RNA structure prediction — all "combine adjacent pieces, choose the split" problems.',
    ],
    keyTakeawaysHi: [
      'Interval DP: state ek contiguous range dp[i][j] hai; recurrence [i, j] ke andar ek split point k loop karta hai aur do sub-ranges ke jawaab plus unhe k par jodne ki cost combine karta hai.',
      'Matrix chain: dp[i][j] = k par dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j] ka min. O(n^2) intervals x O(n) splits = O(n^3).',
      'Fill order badhti interval length se HONA CHAHIYE. dp[i][k] aur dp[k+1][j] dono sakhti se chhote intervals hain, par wo rows/columns ke aar-paar bikhre hain, isliye row-major order unfilled cells padhta hai.',
      'Kabhi split point PEHLA handle kiya element hai, kabhi AAKHRI. Jo bhi do sub-ranges ko swatantra banaaye use chuno — burst balloons ko "k aakhri burst" chahiye taaki iske neighbours a[i] aur a[j] fix hon.',
      'isPal[i][j] (kya s[i..j] ek palindrome hai) khud ek chhota interval DP hai: ends match AUR interior ek palindrome; palindrome-partitioning dwara ek O(1) oracle ki tarah istemal.',
      'Asli use: database join-order optimisation, optimal BST construction, RNA structure prediction — sab "adjacent pieces combine karo, split choose karo" problems.',
    ],
  },
];
