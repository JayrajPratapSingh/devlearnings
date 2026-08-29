/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 5.
 *
 * Two-sequence DP: the subproblem state is a pair of positions, one in each of
 * two sequences (or two positions in one sequence). Longest common subsequence
 * (LCS) and edit distance are the canonical examples; longest increasing
 * subsequence (LIS) is a one-sequence variant with a well-known O(n log n)
 * speed-up. Builds on this module's lesson 3 (2D DP over a table) and this
 * course's Module 10 (binary search — used for the fast LIS). Broken example:
 * LCS solved by generating every subsequence of one string (2^n of them) and
 * testing membership in the other — exponential. Fixed with a 2D table
 * dp[i][j] = LCS length of the first i characters of A and the first j of B,
 * with the recurrence "if A[i-1] === B[j-1] the two match, so 1 + dp[i-1][j-1];
 * otherwise drop one character from whichever side and take the better of
 * dp[i-1][j] and dp[i][j-1]". O(m*n). Edit distance is the same table with three
 * operations. LIS gets its own treatment: O(n^2) DP, then O(n log n) with a
 * patience-sorting tails array and binary search.
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

export const DSA_MODULE_11_PART5: CourseLesson[] = [
  {
    slug: 'dp-two-sequence-lcs-edit-distance-lis',
    title: 'Two-Sequence DP: LCS, Edit Distance, and Fast LIS',
    titleHi: 'Two-Sequence DP: LCS, Edit Distance, Aur Fast LIS',
    description: 'Finding the longest common subsequence of two strings by generating every subsequence of the first string and checking each against the second. One string of length n has 2^n subsequences, so this is exponential and unusable past about 20 characters.',
    descriptionHi: 'Do strings ka longest common subsequence dhoondhna pehli string ke har subsequence ko generate karke aur har ek ko doosri ke against check karke. Length n ki ek string ke 2^n subsequences hain, isliye ye exponential hai aur lagbhag 20 characters ke baad unusable hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 5,

    analogy: {
      en: '**Comparing two people\'s travel itineraries to find the longest trip they could have taken together.** Each itinerary is a list of cities in order. You want the longest sequence of cities that appears, in the same order (not necessarily consecutively), in both lists. The brute-force approach is to write out every possible sub-itinerary of the first person\'s trip and check whether the second person also visited those cities in that order — but there are exponentially many sub-itineraries. The smarter way walks both lists from the front, one city at a time, tracking a grid: "the best shared trip using the first i cities of list one and the first j of list two". If the i-th city of list one equals the j-th city of list two, that city can extend a shared trip, so the answer here is one more than the best shared trip using the first i minus one and j minus one cities. If they differ, at least one of these two cities is not part of the best shared trip, so you take the better of two options: ignore list one\'s i-th city, or ignore list two\'s j-th city. Filling this grid row by row gives the answer in the bottom-right corner, and you never enumerate a single sub-itinerary.',
      hi: '**Do logon ki travel itineraries compare karna sabse lambi trip dhoondhne ke liye jo wo saath le sakte the.** Har itinerary order mein cities ki ek list hai. Aap sabse lambi cities ki sequence chahte ho jo, usi order mein (zaroori nahi lagaataar), dono lists mein aati hai. Brute-force approach pehle vyakti ki trip ke har sambhaavit sub-itinerary ko likhna aur check karna hai ki doosre vyakti ne bhi wo cities us order mein visit ki — par exponentially bahut sub-itineraries hain. Chalaak tarika dono lists ko saamne se chalta hai, ek baar mein ek city, ek grid track karte hue: "list one ki pehli i cities aur list two ki pehli j se best shared trip". Agar list one ki i-vaan city list two ki j-vaan city ke barabar hai, wo city ek shared trip ko extend kar sakti hai, toh yahaan jawaab pehli i minus one aur j minus one cities se best shared trip se ek zyaada hai. Agar wo alag hain, in do cities mein se kam se kam ek best shared trip ka hissa nahi hai, toh aap do options mein se behtar lete ho: list one ki i-vaan city ignore karo, ya list two ki j-vaan city ignore karo. Ise grid row by row bharna bottom-right corner mein jawaab deta hai, aur aap ek bhi sub-itinerary enumerate nahi karte.',
    },

    simple: `**Start broken.** Longest common subsequence by generating subsequences:

\`\`\`js
function lcsBrute(a, b, i = 0, j = 0) {
  if (i === a.length || j === b.length) return 0;
  if (a[i] === b[j]) return 1 + lcsBrute(a, b, i + 1, j + 1);   // match: use both
  return Math.max(lcsBrute(a, b, i + 1, j), lcsBrute(a, b, i, j + 1)); // skip one side
}
\`\`\`

This is correct, but when the characters differ it branches into two, and those branches overlap: \`lcsBrute(a, b, i+1, j+1)\` is reached from both \`(i+1, j)\` and \`(i, j+1)\`. The number of calls is exponential in \`m + n\`. The state that fully describes a subproblem: **how far into A, and how far into B**.

**The fix: dp[i][j] = LCS length of A[0..i) and B[0..j)**

\`\`\`js
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];          // characters match: extend the diagonal
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // drop one character from A or B
      }
    }
  }
  return dp[m][n];
}
\`\`\`

\`\`\`ts
function lcs(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i]![j] = a[i - 1] === b[j - 1]
        ? 1 + dp[i - 1]![j - 1]!
        : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
  }
  return dp[m]![n]!;
}
\`\`\`

- **State**: \`dp[i][j]\` = length of the LCS of the first \`i\` characters of \`A\` and the first \`j\` of \`B\`.
- **Recurrence**: if \`A[i-1] === B[j-1]\`, these characters can be the last pair of a common subsequence, so \`dp[i][j] = 1 + dp[i-1][j-1]\`. Otherwise, at least one of them is not used, so \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`.
- **Base case**: \`dp[0][j] = dp[i][0] = 0\` (empty string has no common subsequence).
- **Order**: row by row; each cell reads the one above, the one left, and the one diagonally up-left, all already filled.
- **Answer**: \`dp[m][n]\`.

O(m*n) time and space; O(n) space by keeping two rows (the recurrence needs \`dp[i-1][j-1]\`, which is lost if you collapse to one row without a saved diagonal).

**Edit distance: the same table, three operations instead of two**

\`\`\`js
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => new Array(n + 1).fill(0).map((_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];              // no edit needed
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],      // delete A[i-1]
          dp[i][j - 1],      // insert B[j-1]
          dp[i - 1][j - 1],  // substitute A[i-1] -> B[j-1]
        );
      }
    }
  }
  return dp[m][n];
}
\`\`\`

Same state \`(i, j)\`, same table shape. When the characters differ, instead of "the max of dropping one side", it is "1 plus the min over delete / insert / substitute". The base cases carry meaning: \`dp[i][0] = i\` (delete all \`i\` characters of \`A\`), \`dp[0][j] = j\` (insert all \`j\` characters of \`B\`).`,

    simpleHi: `**Toote hue se shuru.** Longest common subsequence subsequences generate karke:

\`\`\`js
function lcsBrute(a, b, i = 0, j = 0) {
  if (i === a.length || j === b.length) return 0;
  if (a[i] === b[j]) return 1 + lcsBrute(a, b, i + 1, j + 1);   // match: dono istemal karo
  return Math.max(lcsBrute(a, b, i + 1, j), lcsBrute(a, b, i, j + 1)); // ek side skip karo
}
\`\`\`

Ye sahi hai, par jab characters alag hain ye do mein branch karta hai, aur wo branches overlap karti hain: \`lcsBrute(a, b, i+1, j+1)\` \`(i+1, j)\` aur \`(i, j+1)\` dono se pahuncha jaata hai. Calls ki tadaad \`m + n\` mein exponential hai. Wo state jo ek subproblem ko poori tarah describe karta hai: **A mein kitna aage, aur B mein kitna aage**.

**Fix: dp[i][j] = A[0..i) aur B[0..j) ka LCS length**

\`\`\`js
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];          // characters match: diagonal extend karo
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // A ya B se ek character drop karo
      }
    }
  }
  return dp[m][n];
}
\`\`\`

\`\`\`ts
function lcs(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i]![j] = a[i - 1] === b[j - 1]
        ? 1 + dp[i - 1]![j - 1]!
        : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
    }
  }
  return dp[m]![n]!;
}
\`\`\`

- **State**: \`dp[i][j]\` = \`A\` ke pehle \`i\` characters aur \`B\` ke pehle \`j\` ke LCS ki length.
- **Recurrence**: agar \`A[i-1] === B[j-1]\`, ye characters ek common subsequence ka aakhri pair ho sakte hain, toh \`dp[i][j] = 1 + dp[i-1][j-1]\`. Warna, unmein se kam se kam ek istemal nahi hota, toh \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`.
- **Base case**: \`dp[0][j] = dp[i][0] = 0\` (khaali string ka koi common subsequence nahi).
- **Order**: row by row; har cell upar wali, left wali, aur diagonally up-left wali padhta hai, sab pehle se bhari.
- **Answer**: \`dp[m][n]\`.

O(m*n) time aur space; do rows rakhkar O(n) space (recurrence ko \`dp[i-1][j-1]\` chahiye, jo kho jaata hai agar aap ek saved diagonal ke bina ek row mein collapse karte ho).

**Edit distance: wahi table, do ke bajaye teen operations**

\`\`\`js
function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => new Array(n + 1).fill(0).map((_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];              // koi edit zaroori nahi
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],      // A[i-1] delete karo
          dp[i][j - 1],      // B[j-1] insert karo
          dp[i - 1][j - 1],  // substitute A[i-1] -> B[j-1]
        );
      }
    }
  }
  return dp[m][n];
}
\`\`\`

Wahi state \`(i, j)\`, wahi table shape. Jab characters alag hain, "ek side drop karne ka max" ke bajaye, ye "1 plus delete / insert / substitute par min" hai. Base cases arth le jaate hain: \`dp[i][0] = i\` (\`A\` ke sab \`i\` characters delete karo), \`dp[0][j] = j\` (\`B\` ke sab \`j\` characters insert karo).`,

    content: `## Longest increasing subsequence: O(n^2) DP first

\`\`\`js
// dp[i] = length of the longest increasing subsequence ENDING at index i
function lisN2(nums) {
  const dp = new Array(nums.length).fill(1);       // each element alone is an LIS of length 1
  let best = nums.length ? 1 : 0;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}
\`\`\`

This is a 1D DP (one index of state), but the transition loops over all earlier indices, so it is O(n^2). The recurrence: \`dp[i]\` is 1 plus the best \`dp[j]\` among indices \`j < i\` with \`nums[j] < nums[i]\`.

## Fast LIS: O(n log n) with a "tails" array and binary search

\`\`\`js
function lisNLogN(nums) {
  const tails = [];   // tails[k] = smallest possible tail of an increasing subsequence of length k+1
  for (const x of nums) {
    // find the first tail >= x  (lower_bound, from Module 10)
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);   // x extends the longest subsequence
    else tails[lo] = x;                       // x replaces a tail, making future extension easier
  }
  return tails.length;
}
\`\`\`

\`tails\` is kept sorted. For each new \`x\`, binary-search for where it belongs: if it is larger than every tail, it lengthens the longest increasing subsequence; otherwise it overwrites the smallest tail that is \`>= x\`, which does not change any subsequence length but leaves a smaller tail that is easier to build on later. The length of \`tails\` at the end is the LIS length. \`tails\` is NOT itself a valid LIS — only its length is meaningful. The binary search is exactly the \`lowerBound\` from this course's Module 10, and it is what turns the inner O(n) scan into O(log n).

## Reconstructing the actual LCS string, not just its length

\`\`\`js
function lcsString(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? 1 + dp[i - 1][j - 1]
        : Math.max(dp[i - 1][j], dp[i][j - 1]);

  let i = m, j = n, out = '';
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { out = a[i - 1] + out; i--; j--; }   // matched -> part of the LCS
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;                       // came from above
    else j--;                                                        // came from the left
  }
  return out;
}
\`\`\`

As with every DP that must return the solution and not just its size: keep the full table, then walk backwards from \`dp[m][n]\`, at each cell re-deriving which branch of the recurrence produced it.

## The three-shape family and their neighbour cells

\`\`\`
LCS:            dp[i][j] from dp[i-1][j-1] (match), dp[i-1][j], dp[i][j-1]
Edit distance:  dp[i][j] from the same three cells
Longest palindromic subsequence: dp[i][j] over a SINGLE string, from
                dp[i+1][j-1] (match), dp[i+1][j], dp[i][j-1]   -- fill by increasing length
Regex / wildcard matching: dp[i][j] = does pattern[0..j) match text[0..i);
                transitions depend on whether pattern[j-1] is a literal, ., or *
\`\`\`

All are 2D tables indexed by two positions, filled so that each cell's small fixed set of predecessors is ready. The palindrome variant is filled by increasing substring length rather than row by row, because \`dp[i][j]\` needs \`dp[i+1][j-1]\` (a shorter inner substring).`,

    contentHi: `## Longest increasing subsequence: pehle O(n^2) DP

\`\`\`js
// dp[i] = index i par KHATAM hone waale longest increasing subsequence ki length
function lisN2(nums) {
  const dp = new Array(nums.length).fill(1);       // har element akela length 1 ka ek LIS hai
  let best = nums.length ? 1 : 0;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}
\`\`\`

Ye ek 1D DP hai (state ka ek index), par transition sab pehle ke indices par loop karta hai, isliye ye O(n^2) hai. Recurrence: \`dp[i]\` 1 plus best \`dp[j]\` hai indices \`j < i\` mein jinke \`nums[j] < nums[i]\`.

## Fast LIS: ek "tails" array aur binary search ke saath O(n log n)

\`\`\`js
function lisNLogN(nums) {
  const tails = [];   // tails[k] = length k+1 ke ek increasing subsequence ka sabse chhota sambhaavit tail
  for (const x of nums) {
    // pehla tail >= x dhoondho  (lower_bound, Module 10 se)
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);   // x longest subsequence ko extend karta hai
    else tails[lo] = x;                       // x ek tail replace karta hai, future extension aasaan banate hue
  }
  return tails.length;
}
\`\`\`

\`tails\` sorted rakha jaata hai. Har naye \`x\` ke liye, binary-search karo ki ye kahaan hai: agar ye har tail se bada hai, ye longest increasing subsequence ko lamba karta hai; warna ye sabse chhote tail ko overwrite karta hai jo \`>= x\` hai, jo kisi subsequence length ko nahi badalta par ek chhota tail chhodta hai jispar baad mein banana aasaan hai. Ant mein \`tails\` ki length LIS length hai. \`tails\` khud ek valid LIS NAHI hai — sirf iski length arthpoorn hai. Binary search bilkul is course ke Module 10 ka \`lowerBound\` hai, aur ye wahi hai jo inner O(n) scan ko O(log n) mein badalta hai.

## Asli LCS string reconstruct karna, sirf iski length nahi

\`\`\`js
function lcsString(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? 1 + dp[i - 1][j - 1]
        : Math.max(dp[i - 1][j], dp[i][j - 1]);

  let i = m, j = n, out = '';
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) { out = a[i - 1] + out; i--; j--; }   // matched -> LCS ka hissa
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--;                       // upar se aaya
    else j--;                                                        // left se aaya
  }
  return out;
}
\`\`\`

Har us DP ki tarah jise solution return karna hai sirf iska size nahi: poori table rakho, phir \`dp[m][n]\` se peechhe chalo, har cell par dobara nikaalte hue ki recurrence ki kaunsi branch ne ise banaaya.

## Teen-shape family aur unki neighbour cells

\`\`\`
LCS:            dp[i][j] dp[i-1][j-1] (match), dp[i-1][j], dp[i][j-1] se
Edit distance:  dp[i][j] usi teen cells se
Longest palindromic subsequence: dp[i][j] ek AKELI string par, dp[i+1][j-1]
                (match), dp[i+1][j], dp[i][j-1] se  -- badhti length se bharo
Regex / wildcard matching: dp[i][j] = kya pattern[0..j) text[0..i) se match karta hai;
                transitions is par nirbhar karte hain ki pattern[j-1] ek literal, ., ya * hai
\`\`\`

Sab 2D tables hain do positions se indexed, aise bhare ki har cell ke chhote fixed set predecessors ready hon. Palindrome variant badhti substring length se bharta hai row by row ke bajaye, kyunki \`dp[i][j]\` ko \`dp[i+1][j-1]\` chahiye (ek chhota inner substring).`,

    examples: [
      {
        title: 'Broken: LCS by branching on skip-A vs skip-B',
        titleHi: 'Toota: LCS skip-A vs skip-B par branch karke',
        code: `if (a[i] === b[j]) return 1 + lcsBrute(a, b, i + 1, j + 1);
return Math.max(lcsBrute(a, b, i + 1, j), lcsBrute(a, b, i, j + 1));`,
        codeJs: `function lcsBrute(a, b, i = 0, j = 0) {
  if (i === a.length || j === b.length) return 0;
  if (a[i] === b[j]) return 1 + lcsBrute(a, b, i + 1, j + 1);
  return Math.max(lcsBrute(a, b, i + 1, j), lcsBrute(a, b, i, j + 1));
}
console.log(lcsBrute("AGCAT", "GAC")); // 2  — but O(2^(m+n))`,
        codeTs: `function lcsBrute(a: string, b: string, i = 0, j = 0): number {
  if (i === a.length || j === b.length) return 0;
  if (a[i] === b[j]) return 1 + lcsBrute(a, b, i + 1, j + 1);
  return Math.max(lcsBrute(a, b, i + 1, j), lcsBrute(a, b, i, j + 1));
}`,
        output: `2`,
        explain: 'On a mismatch the recursion branches two ways, and (i+1, j+1) is reachable from both branches, so the same (i, j) subproblem is re-solved exponentially many times.',
        explainHi: 'Ek mismatch par recursion do tarah branch karti hai, aur (i+1, j+1) dono branches se reachable hai, isliye wahi (i, j) subproblem exponentially bahut baar re-solve hota hai.',
      },
      {
        title: 'Fixed: dp[i][j] — match extends the diagonal',
        titleHi: 'Theek: dp[i][j] — match diagonal extend karta hai',
        code: `dp[i][j] = a[i-1] === b[j-1]
  ? 1 + dp[i-1][j-1]
  : Math.max(dp[i-1][j], dp[i][j-1]);`,
        codeJs: `function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? 1 + dp[i - 1][j - 1]
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}
console.log(lcs("AGCAT", "GAC")); // 2   (e.g. "AC" or "GA")`,
        codeTs: `function lcs(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i]![j] = a[i - 1] === b[j - 1]
        ? 1 + dp[i - 1]![j - 1]!
        : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
  return dp[m]![n]!;
}`,
        outputJs: `2`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'm*n distinct (i, j) states. Each is O(1): a diagonal +1 on a match, or the max of the up/left cell on a mismatch. O(m*n) total.',
        explainHi: 'm*n distinct (i, j) states. Har ek O(1): match par ek diagonal +1, ya mismatch par up/left cell ka max. Kul O(m*n).',
      },
      {
        title: 'Fast LIS: tails array + binary search',
        titleHi: 'Fast LIS: tails array + binary search',
        code: `// binary-search for the first tail >= x; extend if none, else overwrite it`,
        codeJs: `function lisNLogN(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1; else hi = mid;
    }
    if (lo === tails.length) tails.push(x); else tails[lo] = x;
  }
  return tails.length;
}
console.log(lisNLogN([10, 9, 2, 5, 3, 7, 101, 18])); // 4  ([2,3,7,101] or [2,5,7,18])`,
        codeTs: `function lisNLogN(nums: number[]): number {
  const tails: number[] = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < x) lo = mid + 1; else hi = mid;
    }
    if (lo === tails.length) tails.push(x); else tails[lo] = x;
  }
  return tails.length;
}`,
        outputJs: `4`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'tails stays sorted; each element does one O(log n) binary search to either extend the longest subsequence or lower an existing tail. O(n log n) total. tails\' length is the answer (its contents are not a valid LIS).',
        explainHi: 'tails sorted rehta hai; har element ek O(log n) binary search karta hai ya toh longest subsequence extend karne ke liye ya ek maujooda tail kam karne ke liye. Kul O(n log n). tails ki length jawaab hai (iski contents ek valid LIS nahi).',
      },
    ],

    mistakes: [
      {
        wrong: `// LCS recurrence adding 1 on a mismatch
dp[i][j] = a[i-1] === b[j-1]
  ? 1 + dp[i-1][j-1]
  : 1 + Math.max(dp[i-1][j], dp[i][j-1]);   // WRONG: nothing was matched`,
        right: `dp[i][j] = a[i-1] === b[j-1]
  ? 1 + dp[i-1][j-1]
  : Math.max(dp[i-1][j], dp[i][j-1]);       // no +1: on a mismatch you only drop a char`,
        why: 'The "+1" represents one more matched character. On a mismatch nothing new is matched — you are just deciding which side to advance past — so adding 1 inflates the length.',
        whyHi: '"+1" ek aur matched character darsata hai. Ek mismatch par kuch naya matched nahi hota — aap bas tay kar rahe ho kaunsa side aage badhaana hai — toh 1 jodna length inflate karta hai.',
      },
      {
        wrong: `// edit distance base cases both left as 0
const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
// dp[i][0] should be i (delete i chars), dp[0][j] should be j (insert j chars)`,
        right: `for (let i = 0; i <= m; i++) dp[i][0] = i;
for (let j = 0; j <= n; j++) dp[0][j] = j;`,
        why: 'Turning a length-i string into the empty string costs i deletions, not 0. Leaving these base cases at 0 makes the DP think an arbitrary prefix can be matched for free.',
        whyHi: 'Ek length-i string ko khaali string mein badalna i deletions kharch karta hai, 0 nahi. In base cases ko 0 par chhodna DP ko sochta hai ki ek arbitrary prefix muft mein match ho sakta hai.',
      },
      {
        wrong: `// treating the LIS 'tails' array as an actual longest increasing subsequence
return tails;   // its LENGTH is right, but its contents are often not a valid LIS`,
        right: `return tails.length;   // only the length is meaningful; reconstruct separately if needed`,
        why: 'tails[k] is the smallest tail of ANY length-(k+1) increasing subsequence, updated independently at each position. The final array\'s length equals the LIS length, but the values may not form an increasing subsequence of the input.',
        whyHi: 'tails[k] KISI length-(k+1) increasing subsequence ka sabse chhota tail hai, har position par swatantra roop se update kiya. Antim array ki length LIS length ke barabar hai, par values input ki ek increasing subsequence nahi bana sakti.',
      },
    ],

    realWorld: [
      {
        en: '**`git diff`, `diff`, and merge tools** compute the LCS of two files\' lines, then report the non-common lines as additions and deletions.',
        hi: '**`git diff`, `diff`, aur merge tools** do files ki lines ka LCS compute karte hain, phir non-common lines ko additions aur deletions ki tarah report karte hain.',
      },
      {
        en: '**Spell-check and fuzzy matching** rank candidates by edit distance to the query; autocorrect picks the lowest-distance dictionary word.',
        hi: '**Spell-check aur fuzzy matching** candidates ko query tak edit distance se rank karte hain; autocorrect sabse-kam-distance dictionary word chunta hai.',
      },
      {
        en: '**Bioinformatics sequence alignment** (DNA / protein comparison) is edit distance with domain-specific costs for insertions, deletions, and substitutions — the same 2D table, different weights.',
        hi: '**Bioinformatics sequence alignment** (DNA / protein comparison) insertions, deletions, aur substitutions ke liye domain-specific costs ke saath edit distance hai — wahi 2D table, alag weights.',
      },
    ],

    interviewQA: [
      {
        q: 'Derive the LCS recurrence and explain why the mismatch case takes a max of two cells rather than considering both.',
        qHi: 'LCS recurrence derive karo aur samjhaao ki mismatch case dono consider karne ke bajaye do cells ka max kyun leta hai.',
        a: 'Define dp of i and j as the length of the longest common subsequence of the first i characters of A and the first j characters of B. Consider the last characters, A at index i minus one and B at index j minus one. There are two situations. If they are equal, then there is a longest common subsequence that uses this matched pair as its final element: you can always take an optimal common subsequence of the shorter prefixes and append this shared character, and no optimal solution can do better than including a free match at the end. So dp of i and j is one plus dp of i minus one and j minus one. If the last characters differ, they cannot both be the final character of a common subsequence, because a common subsequence has exactly one last character and it must equal both A\'s and B\'s contribution at that position. So at least one of A\'s i-th character and B\'s j-th character is not used in the optimal common subsequence for this subproblem. If A\'s character is not used, the answer is the same as dp of i minus one and j, since dropping an unused character changes nothing. If B\'s character is not used, the answer is dp of i and j minus one. We do not know which case holds, so we take the maximum of the two. We do not need to consider dropping both characters as a separate case, because dropping both gives dp of i minus one and j minus one, and that value is already less than or equal to both dp of i minus one and j and dp of i and j minus one, since removing a character can only keep the LCS the same or shorten it. So the two-cell max already dominates the drop-both option.',
        aHi: 'dp of i aur j ko A ke pehle i characters aur B ke pehle j characters ke longest common subsequence ki length ki tarah define karo. Aakhri characters par vichaar karo, A index i minus one par aur B index j minus one par. Do situations hain. Agar wo barabar hain, toh ek longest common subsequence hai jo is matched pair ko iske final element ki tarah istemal karti hai: aap hamesha chhote prefixes ka ek optimal common subsequence le sakte ho aur is shared character ko append kar sakte ho, aur koi optimal solution ant mein ek free match include karne se behtar nahi kar sakta. Toh dp of i aur j one plus dp of i minus one aur j minus one hai. Agar aakhri characters alag hain, wo dono ek common subsequence ke final character nahi ho sakte, kyunki ek common subsequence ka bilkul ek last character hai aur ise A aur B dono ke us position par yogdaan ke barabar hona chahiye. Toh A ke i-vaan character aur B ke j-vaan character mein se kam se kam ek is subproblem ke optimal common subsequence mein istemal nahi hota. Agar A ka character istemal nahi hota, jawaab dp of i minus one aur j jaisa hai, kyunki ek unused character drop karna kuch nahi badalta. Agar B ka character istemal nahi hota, jawaab dp of i aur j minus one hai. Hum nahi jaante kaunsa case hai, toh hum dono ka maximum lete hain. Humein dono characters drop karne ko ek alag case ki tarah consider karne ki zaroorat nahi, kyunki dono drop karna dp of i minus one aur j minus one deta hai, aur wo value pehle se dono dp of i minus one aur j aur dp of i aur j minus one se kam ya barabar hai, kyunki ek character hataana LCS ko sirf same rakh sakta hai ya chhota kar sakta hai. Toh two-cell max pehle se drop-both option par haavi hai.',
      },
      {
        q: 'The O(n^2) LIS DP is intuitive. Explain how the O(n log n) version works and why the "tails" array is not itself a longest increasing subsequence.',
        qHi: 'O(n^2) LIS DP intuitive hai. Samjhaao O(n log n) version kaise kaam karta hai aur "tails" array khud ek longest increasing subsequence kyun nahi hai.',
        a: 'The fast version maintains an array called tails, kept sorted in increasing order, where the invariant is that tails at index k holds the smallest value that can be the final element of some increasing subsequence of length k plus one, among all such subsequences seen so far. For each new number x from the input, you binary-search tails for the leftmost position whose value is greater than or equal to x. Two things can happen. If that position is past the end of tails, x is larger than every current tail, so x can be appended to the longest increasing subsequence we have, and tails grows by one. Otherwise, x is less than or equal to the tail at that position, and we overwrite that entry with x. This overwrite does not change the length of any subsequence, because a subsequence of that length already existed, but it records that we can now achieve that same length ending in a smaller value, which makes it strictly easier for future elements to extend. Since tails is always sorted, the binary search is O of log n, and there are n elements, giving O of n log n overall. The length of tails at the end is the LIS length, because tails only grows when a genuinely longer increasing subsequence becomes possible. But the contents of tails are not a valid increasing subsequence of the input, and generally are not. The reason is that different positions in tails get overwritten at different times by numbers that appeared at different points in the input, so the values in tails may not even occur in the input in the left-to-right order that tails lists them. tails is a bookkeeping structure that tracks achievable lengths and their best possible endpoints; only its length carries meaning. To recover an actual LIS you keep a parallel array of predecessor indices and reconstruct at the end.',
        aHi: 'Fast version tails naam ka ek array maintain karta hai, badhte order mein sorted rakha gaya, jahaan invariant ye hai ki tails index k par sabse chhoti value rakhta hai jo length k plus one ke kisi increasing subsequence ka final element ho sakti hai, ab tak dekhi gayi sab aisi subsequences mein. Input se har naye number x ke liye, aap tails ko leftmost position ke liye binary-search karte ho jiski value x se greater ya equal hai. Do cheezein ho sakti hain. Agar wo position tails ke end se aage hai, x har current tail se bada hai, toh x ko humaare paas jo longest increasing subsequence hai usme append kiya jaa sakta hai, aur tails ek se badhta hai. Warna, x us position par tail se kam ya barabar hai, aur hum us entry ko x se overwrite karte hain. Ye overwrite kisi subsequence ki length nahi badalta, kyunki us length ka ek subsequence pehle se maujood tha, par ye record karta hai ki hum ab wahi length ek chhoti value mein khatam hote hue haasil kar sakte hain, jo future elements ke liye extend karna sakhti se aasaan banaata hai. Kyunki tails hamesha sorted hai, binary search O of log n hai, aur n elements hain, kul O of n log n dete hue. Ant mein tails ki length LIS length hai, kyunki tails sirf tab badhta hai jab ek sach mein lamba increasing subsequence sambhav ho jaata hai. Par tails ki contents input ki ek valid increasing subsequence nahi hai, aur aam taur par nahi hai. Kaaran ye hai ki tails mein alag positions alag samay par un numbers dwara overwrite hoti hain jo input mein alag points par aaye, isliye tails mein values input mein us left-to-right order mein bhi na aaye jismein tails unhe list karta hai. Ek asli LIS recover karne ke liye aap predecessor indices ka ek parallel array rakhte ho aur ant mein reconstruct karte ho.',
      },
    ],

    exercises: [
      {
        task: 'Implement lcs (length) and lcsString (the actual subsequence). Test on "AGGTAB"/"GXTXAYB" (LCS "GTAB", length 4) and "ABC"/"DEF" (length 0).',
        taskHi: 'lcs (length) aur lcsString (asli subsequence) implement karo. "AGGTAB"/"GXTXAYB" (LCS "GTAB", length 4) aur "ABC"/"DEF" (length 0) par test karo.',
        hint: 'For reconstruction, walk from dp[m][n]: if chars match, prepend and go diagonally; else move toward the larger of the up/left neighbour.',
        hintHi: 'Reconstruction ke liye, dp[m][n] se chalo: agar chars match, prepend karo aur diagonally jao; warna up/left neighbour mein se bade ki taraf move karo.',
      },
      {
        task: 'Implement editDistance with the i/j base cases set correctly. Test "horse"/"ros" (expect 3), "intention"/"execution" (expect 5), "abc"/"abc" (expect 0).',
        taskHi: 'i/j base cases sahi set karke editDistance implement karo. "horse"/"ros" (3 expect karo), "intention"/"execution" (5 expect karo), "abc"/"abc" (0 expect karo) par test karo.',
        hint: 'dp[i][0] = i and dp[0][j] = j. On a mismatch: 1 + min(delete dp[i-1][j], insert dp[i][j-1], substitute dp[i-1][j-1]).',
        hintHi: 'dp[i][0] = i aur dp[0][j] = j. Ek mismatch par: 1 + min(delete dp[i-1][j], insert dp[i][j-1], substitute dp[i-1][j-1]).',
      },
      {
        task: 'Implement lisN2 (O(n^2)) and lisNLogN (O(n log n)). Test both on [10,9,2,5,3,7,101,18] (expect 4), a strictly increasing array (expect n), a strictly decreasing array (expect 1). Confirm they always agree.',
        taskHi: 'lisN2 (O(n^2)) aur lisNLogN (O(n log n)) implement karo. Dono ko [10,9,2,5,3,7,101,18] (4 expect karo), ek strictly increasing array (n expect karo), ek strictly decreasing array (1 expect karo) par test karo. Confirm karo wo hamesha sahmat hain.',
        hint: 'The binary search in lisNLogN is lower_bound: first index whose tail is >= x. If x is bigger than all tails, push; otherwise overwrite tails[lo].',
        hintHi: 'lisNLogN mein binary search lower_bound hai: pehla index jiska tail >= x hai. Agar x sab tails se bada hai, push karo; warna tails[lo] overwrite karo.',
      },
    ],

    keyTakeaways: [
      'Two-sequence DP: state is a pair of positions (i in A, j in B). dp[i][j] compares prefixes A[0..i) and B[0..j).',
      'LCS: if A[i-1] === B[j-1], dp[i][j] = 1 + dp[i-1][j-1] (extend the diagonal); else dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (drop one char). No +1 on a mismatch.',
      'Edit distance: same table. On a match, dp[i][j] = dp[i-1][j-1]; on a mismatch, 1 + min(delete, insert, substitute). Base cases dp[i][0] = i, dp[0][j] = j.',
      'LIS has an O(n^2) 1D DP (dp[i] = 1 + best dp[j] with nums[j] < nums[i]) and an O(n log n) version using a sorted "tails" array and binary search (Module 10 lower_bound).',
      'The "tails" array\'s LENGTH is the LIS length, but its contents are generally NOT a valid increasing subsequence — reconstruct separately with predecessor links.',
      'To return the solution string (not just its length), keep the full 2D table and walk backwards from dp[m][n], re-deriving which recurrence branch produced each cell.',
    ],
    keyTakeawaysHi: [
      'Two-sequence DP: state positions ka ek pair hai (A mein i, B mein j). dp[i][j] prefixes A[0..i) aur B[0..j) compare karta hai.',
      'LCS: agar A[i-1] === B[j-1], dp[i][j] = 1 + dp[i-1][j-1] (diagonal extend karo); warna dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (ek char drop karo). Mismatch par koi +1 nahi.',
      'Edit distance: wahi table. Match par, dp[i][j] = dp[i-1][j-1]; mismatch par, 1 + min(delete, insert, substitute). Base cases dp[i][0] = i, dp[0][j] = j.',
      'LIS ka ek O(n^2) 1D DP hai (dp[i] = 1 + best dp[j] jismein nums[j] < nums[i]) aur ek O(n log n) version ek sorted "tails" array aur binary search (Module 10 lower_bound) istemal karke.',
      '"tails" array ki LENGTH LIS length hai, par iski contents aam taur par ek valid increasing subsequence NAHI — predecessor links ke saath alag se reconstruct karo.',
      'Solution string return karne ke liye (sirf iski length nahi), poori 2D table rakho aur dp[m][n] se peechhe chalo, dobara nikaalte hue ki kaunsi recurrence branch ne har cell banaayi.',
    ],
  },
];
