/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 3.
 *
 * 2D DP: a subproblem is described by TWO indices — usually a cell (row, col) in
 * a grid, or a pair of positions in two sequences. Builds on this module's
 * lesson 2 (1D DP: state, recurrence, fill order, space collapse) and this
 * course's Module 7 (a grid is a graph; each cell's answer depends on its
 * neighbours). Broken example: "count the paths from the top-left to the
 * bottom-right of an m-by-n grid, moving only right or down" solved by a plain
 * recursion that branches right and down at every cell — the branches overlap
 * heavily (a cell in the middle is reached along many prefixes) so the call
 * count is exponential. Fixed with a 2D table: dp[r][c] = number of ways to
 * reach cell (r, c) = dp[r-1][c] + dp[r][c-1]. Fill row by row. O(m*n), then
 * O(n) by keeping only the previous row (or the current row updated in place).
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

export const DSA_MODULE_11_PART3: CourseLesson[] = [
  {
    slug: 'dp-2d-grids-and-paths',
    title: '2D DP: State Is Two Indices (Grid Paths, Min Path Sum)',
    titleHi: '2D DP: State Do Indices Hai (Grid Paths, Min Path Sum)',
    description: 'Counting the number of ways to walk from the top-left corner of an m-by-n grid to the bottom-right, moving only right or down. A plain recursion branches into "go right" and "go down" at every cell, and those branches keep re-reaching the same interior cells, so the call count is exponential in the grid size.',
    descriptionHi: 'Ek m-by-n grid ke top-left corner se bottom-right tak chalne ke tarike ginna, sirf right ya down move karte hue. Ek plain recursion har cell par "right jao" aur "down jao" mein branch karta hai, aur wo branches usi interior cells ko baar-baar re-reach karte hain, isliye call count grid size mein exponential hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 3,

    analogy: {
      en: '**Counting the routes a delivery rider can take across a one-way grid of streets, where every street only allows travel east or south.** To reach a particular intersection, the rider must have arrived either from the intersection directly to its west or the one directly to its north — there is no other way in. So the number of distinct routes to any intersection is simply the number of routes to its western neighbour plus the number to its northern neighbour. If you fill in a map of "routes to here" starting from the depot in the top-left corner and sweeping across each row left to right, then top to bottom, every intersection you reach already has both the values it needs written next door. The whole grid gets labelled in one sweep, and the bottom-right corner holds the total. Trying to do this by imagining every possible route one at a time is hopeless — the number of routes is astronomical — but the map only has as many cells as the grid, and each is filled with a single addition.',
      hi: '**Ek one-way grid of streets ke aar-paar ek delivery rider ke routes ginna, jahaan har street sirf east ya south travel allow karti hai.** Ek khaas intersection par pahunchne ke liye, rider ko ya toh iske seedhe west waale intersection se ya seedhe north waale se aaya hona chahiye — andar aane ka koi doosra tarika nahi. Toh kisi bhi intersection tak distinct routes ki tadaad bas iske western neighbour tak routes ki tadaad plus northern neighbour tak ki tadaad hai. Agar aap top-left corner ke depot se shuru karte hue aur har row ko left se right, phir top se bottom sweep karte hue "yahaan tak routes" ka ek map bharte ho, har intersection jispar aap pahunchte ho pehle se dono values jinhe iski zaroorat hai bagal mein likhi hain. Poori grid ek sweep mein label ho jaati hai, aur bottom-right corner total rakhta hai. Ise har sambhaavit route ko ek baar mein ek imagine karke karne ki koshish nirasha hai — routes ki tadaad astronomical hai — par map mein sirf utni cells hain jitni grid, aur har ek ek akele addition se bharti hai.',
    },

    simple: `**Start broken.** Count right/down paths across an \`m x n\` grid by recursion:

\`\`\`js
function pathsBrute(m, n, r = 0, c = 0) {
  if (r === m - 1 && c === n - 1) return 1;      // reached the bottom-right
  if (r >= m || c >= n) return 0;                // fell off the grid
  return pathsBrute(m, n, r + 1, c) + pathsBrute(m, n, r, c + 1); // down + right
}
\`\`\`

Every cell branches into "down" and "right", and interior cells are reached along many different prefixes — cell \`(2, 2)\` is on the path \`(0,0)->(1,0)->(2,0)->(2,1)->(2,2)\` and also \`(0,0)->(0,1)->(1,1)->(2,1)->(2,2)\` and dozens more. The number of leaf paths is a binomial coefficient, exponential in \`m + n\`. This module's lesson 2 recipe extends to two indices.

**The fix: dp[r][c] = number of ways to reach cell (r, c)**

\`\`\`js
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r][c] += dp[r - 1][c];       // arrived from above
      if (c > 0) dp[r][c] += dp[r][c - 1];       // arrived from the left
    }
  }
  return dp[m - 1][n - 1];
}
\`\`\`

\`\`\`ts
function uniquePaths(m: number, n: number): number {
  const dp = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[0]![0] = 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r]![c]! += dp[r - 1]![c]!;
      if (c > 0) dp[r]![c]! += dp[r]![c - 1]!;
    }
  }
  return dp[m - 1]![n - 1]!;
}
\`\`\`

Following the recipe:

- **State**: \`dp[r][c]\` = number of right/down paths from \`(0,0)\` to \`(r,c)\`.
- **Recurrence**: you can only enter \`(r,c)\` from above \`(r-1,c)\` or from the left \`(r,c-1)\`, so \`dp[r][c] = dp[r-1][c] + dp[r][c-1]\`.
- **Base case**: \`dp[0][0] = 1\` (one way to be at the start: stand there).
- **Order**: any order where \`(r-1,c)\` and \`(r,c-1)\` are done first — row by row, left to right, works.
- **Answer**: \`dp[m-1][n-1]\`.

O(m*n) time and space.

**The fix, further: O(n) space by keeping only one row**

\`\`\`js
function uniquePathsO1(m, n) {
  const row = new Array(n).fill(1);             // row 0: exactly one way to each cell
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];                     // row[c] is still the previous row's value here
    }
  }
  return row[n - 1];
}
\`\`\`

\`dp[r][c]\` needs only the cell directly above and the cell directly left. Update a single array left to right: when you read \`row[c]\` it still holds row \`r-1\`'s value (the "above"), and \`row[c-1]\` has already been updated to row \`r\`'s value (the "left"). One row of storage, O(n).`,

    simpleHi: `**Toote hue se shuru.** Ek \`m x n\` grid ke aar-paar right/down paths recursion se gino:

\`\`\`js
function pathsBrute(m, n, r = 0, c = 0) {
  if (r === m - 1 && c === n - 1) return 1;      // bottom-right pahunche
  if (r >= m || c >= n) return 0;                // grid se gir gaye
  return pathsBrute(m, n, r + 1, c) + pathsBrute(m, n, r, c + 1); // down + right
}
\`\`\`

Har cell "down" aur "right" mein branch karta hai, aur interior cells kayi alag prefixes par pahunche jaate hain — cell \`(2, 2)\` path \`(0,0)->(1,0)->(2,0)->(2,1)->(2,2)\` par aur \`(0,0)->(0,1)->(1,1)->(2,1)->(2,2)\` par aur dozens aur par hai. Leaf paths ki tadaad ek binomial coefficient hai, \`m + n\` mein exponential. Is module ke lesson 2 ka recipe do indices tak extend hota hai.

**Fix: dp[r][c] = cell (r, c) tak pahunchne ke tarike**

\`\`\`js
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r][c] += dp[r - 1][c];       // upar se aaye
      if (c > 0) dp[r][c] += dp[r][c - 1];       // left se aaye
    }
  }
  return dp[m - 1][n - 1];
}
\`\`\`

\`\`\`ts
function uniquePaths(m: number, n: number): number {
  const dp = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[0]![0] = 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r]![c]! += dp[r - 1]![c]!;
      if (c > 0) dp[r]![c]! += dp[r]![c - 1]!;
    }
  }
  return dp[m - 1]![n - 1]!;
}
\`\`\`

Recipe follow karte hue:

- **State**: \`dp[r][c]\` = \`(0,0)\` se \`(r,c)\` tak right/down paths ki tadaad.
- **Recurrence**: aap \`(r,c)\` mein sirf upar \`(r-1,c)\` se ya left \`(r,c-1)\` se pravesh kar sakte ho, toh \`dp[r][c] = dp[r-1][c] + dp[r][c-1]\`.
- **Base case**: \`dp[0][0] = 1\` (start par hone ka ek tarika: wahaan khade raho).
- **Order**: koi bhi order jahaan \`(r-1,c)\` aur \`(r,c-1)\` pehle done hon — row by row, left se right, kaam karta hai.
- **Answer**: \`dp[m-1][n-1]\`.

O(m*n) time aur space.

**Fix, aur: sirf ek row rakhkar O(n) space**

\`\`\`js
function uniquePathsO1(m, n) {
  const row = new Array(n).fill(1);             // row 0: har cell tak bilkul ek tarika
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];                     // row[c] yahaan abhi bhi pichhli row ki value hai
    }
  }
  return row[n - 1];
}
\`\`\`

\`dp[r][c]\` ko sirf seedhe upar ki cell aur seedhe left ki cell chahiye. Ek akele array ko left se right update karo: jab aap \`row[c]\` padhte ho ye abhi bhi row \`r-1\` ki value rakhta hai ("upar"), aur \`row[c-1]\` pehle se row \`r\` ki value par update ho chuka hai ("left"). Ek row ka storage, O(n).`,

    content: `## Min path sum: the same table, a min instead of a sum

\`\`\`js
// grid[r][c] is the cost of stepping on cell (r, c); minimise total cost
// on a right/down path from top-left to bottom-right.
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dp[0][0] = grid[0][0];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const fromTop  = r > 0 ? dp[r - 1][c] : Infinity;
      const fromLeft = c > 0 ? dp[r][c - 1] : Infinity;
      dp[r][c] = grid[r][c] + Math.min(fromTop, fromLeft);
    }
  }
  return dp[m - 1][n - 1];
}
\`\`\`

Identical structure to \`uniquePaths\`: the state is a cell, the recurrence combines the cell above and the cell left, the fill order is row by row. Only the combining operation changed — from "add the counts" to "take the cheaper predecessor and add this cell's cost". Many grid DPs are this table with a different combine: longest path of increasing values, maximum gold collected, largest all-1s square (\`dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])\` if the cell is 1).

## Obstacles: the recurrence barely changes

\`\`\`js
function uniquePathsWithObstacles(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = grid[0][0] === 1 ? 0 : 1;           // blocked start -> zero paths
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) { dp[r][c] = 0; continue; } // an obstacle: no path passes through
      if (r > 0) dp[r][c] += dp[r - 1][c];
      if (c > 0) dp[r][c] += dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}
\`\`\`

A blocked cell simply contributes zero paths, so you set its \`dp\` to 0 and skip. This is typical of grid DP: extra constraints usually become an extra guard inside the same double loop, not a new algorithm.

## Two indices, two sequences: the other shape of 2D DP

\`\`\`
Not every 2D DP is a grid. The next lesson's knapsack has state (item index,
remaining capacity). The lesson after that has state (position in string A,
position in string B). In all of these, dp is a 2D table and the recurrence
reads a small, fixed set of neighbouring cells; the "fill in dependency order"
and "collapse a dimension if only the last row is needed" ideas carry over
unchanged.
\`\`\`

The unifying view: a 2D DP is a DP whose subproblem needs two numbers to
describe, and whose table is filled so that each cell's dependencies (a bounded
set of other cells) are ready before it.

## When the O(n)-space collapse is and is not safe

\`\`\`
Safe to collapse to one row when: dp[r][c] depends only on dp[r-1][*] and
  dp[r][c'] for c' < c (i.e. the current row's already-updated cells and the
  previous row). Update left to right in place.

NOT safe when: dp[r][c] also needs dp[r-1][c+1] (a cell to the upper-RIGHT,
  which the in-place update has already overwritten). Then keep two explicit
  rows, or iterate that dimension in the opposite direction.
\`\`\`

Check the recurrence's exact dependencies before collapsing. The classic bug is overwriting a value the current cell still needs — always trace which neighbours the recurrence reads and confirm none of them has been clobbered yet.`,

    contentHi: `## Min path sum: wahi table, sum ke bajaye ek min

\`\`\`js
// grid[r][c] cell (r, c) par step karne ki cost hai; top-left se bottom-right tak
// ek right/down path par kul cost minimise karo.
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dp[0][0] = grid[0][0];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const fromTop  = r > 0 ? dp[r - 1][c] : Infinity;
      const fromLeft = c > 0 ? dp[r][c - 1] : Infinity;
      dp[r][c] = grid[r][c] + Math.min(fromTop, fromLeft);
    }
  }
  return dp[m - 1][n - 1];
}
\`\`\`

\`uniquePaths\` jaisa hi structure: state ek cell hai, recurrence upar ki cell aur left ki cell ko combine karta hai, fill order row by row hai. Sirf combining operation badla — "counts jodo" se "sasta predecessor lo aur is cell ki cost jodo". Kayi grid DPs ye table hain ek alag combine ke saath: badhti values ka longest path, maximum gold collect kiya, sabse bada all-1s square (\`dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1])\` agar cell 1 hai).

## Obstacles: recurrence mushkil se badalta hai

\`\`\`js
function uniquePathsWithObstacles(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = grid[0][0] === 1 ? 0 : 1;           // blocked start -> zero paths
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) { dp[r][c] = 0; continue; } // ek obstacle: koi path ismein se nahi guzarta
      if (r > 0) dp[r][c] += dp[r - 1][c];
      if (c > 0) dp[r][c] += dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}
\`\`\`

Ek blocked cell bas zero paths yogdaan deti hai, toh aap iska \`dp\` 0 set karte ho aur skip karte ho. Ye grid DP ka typical hai: extra constraints aksar usi double loop ke andar ek extra guard ban jaate hain, ek naya algorithm nahi.

## Do indices, do sequences: 2D DP ka doosra shape

\`\`\`
Har 2D DP ek grid nahi hai. Agle lesson ke knapsack ka state (item index,
remaining capacity) hai. Uske baad wale lesson ka state (string A mein position,
string B mein position) hai. In sab mein, dp ek 2D table hai aur recurrence ek
chhota, fixed set neighbouring cells padhta hai; "dependency order mein bharo" aur
"ek dimension collapse karo agar sirf aakhri row chahiye" ideas na-badla carry
over hote hain.
\`\`\`

Unifying view: ek 2D DP ek DP hai jiske subproblem ko describe karne ke liye do
numbers chahiye, aur jiski table aise bharti hai ki har cell ki dependencies (doosri
cells ka ek bounded set) iske pehle ready ho.

## O(n)-space collapse kab safe hai aur kab nahi

\`\`\`
Ek row mein collapse karna safe jab: dp[r][c] sirf dp[r-1][*] aur c' < c ke liye
  dp[r][c'] par nirbhar karta hai (matlab current row ki pehle-se-updated cells aur
  previous row). Left se right in place update karo.

NAHI safe jab: dp[r][c] ko dp[r-1][c+1] bhi chahiye (upper-RIGHT ki ek cell, jise
  in-place update pehle se overwrite kar chuka hai). Tab do explicit rows rakho, ya
  us dimension ko opposite direction mein iterate karo.
\`\`\`

Collapse karne se pehle recurrence ki exact dependencies check karo. Classic bug ek value overwrite karna hai jo current cell ko abhi bhi chahiye — hamesha trace karo recurrence kaunse neighbours padhta hai aur confirm karo unmein se koi abhi tak clobber nahi hua.`,

    examples: [
      {
        title: 'Broken: recursion re-reaches interior cells exponentially',
        titleHi: 'Toota: recursion interior cells ko exponentially re-reach karta hai',
        code: `return pathsBrute(m, n, r + 1, c) + pathsBrute(m, n, r, c + 1);`,
        codeJs: `function pathsBrute(m, n, r = 0, c = 0) {
  if (r === m - 1 && c === n - 1) return 1;
  if (r >= m || c >= n) return 0;
  return pathsBrute(m, n, r + 1, c) + pathsBrute(m, n, r, c + 1);
}
console.log(pathsBrute(3, 3)); // 6  — but exponential for larger grids`,
        codeTs: `function pathsBrute(m: number, n: number, r = 0, c = 0): number {
  if (r === m - 1 && c === n - 1) return 1;
  if (r >= m || c >= n) return 0;
  return pathsBrute(m, n, r + 1, c) + pathsBrute(m, n, r, c + 1);
}`,
        output: `6`,
        explain: 'Each cell branches into down and right, and every interior cell is reached along many prefixes, so the number of recursive calls is a binomial coefficient — exponential in m + n.',
        explainHi: 'Har cell down aur right mein branch karta hai, aur har interior cell kayi prefixes par pahuncha jaata hai, isliye recursive calls ki tadaad ek binomial coefficient hai — m + n mein exponential.',
      },
      {
        title: 'Fixed: dp[r][c] = dp[r-1][c] + dp[r][c-1]',
        titleHi: 'Theek: dp[r][c] = dp[r-1][c] + dp[r][c-1]',
        code: `if (r > 0) dp[r][c] += dp[r - 1][c];
if (c > 0) dp[r][c] += dp[r][c - 1];`,
        codeJs: `function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r][c] += dp[r - 1][c];
      if (c > 0) dp[r][c] += dp[r][c - 1];
    }
  return dp[m - 1][n - 1];
}
console.log(uniquePaths(3, 7)); // 28`,
        codeTs: `function uniquePaths(m: number, n: number): number {
  const dp = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[0]![0] = 1;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (r > 0) dp[r]![c]! += dp[r - 1]![c]!;
      if (c > 0) dp[r]![c]! += dp[r]![c - 1]!;
    }
  return dp[m - 1]![n - 1]!;
}`,
        outputJs: `28`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'There are only m*n distinct cells. Each holds "ways to reach here", computed once as the sum of the cell above and the cell left. O(m*n).',
        explainHi: 'Sirf m*n distinct cells hain. Har ek "yahaan tak pahunchne ke tarike" rakhta hai, upar ki cell aur left ki cell ke sum ki tarah ek baar compute kiya. O(m*n).',
      },
      {
        title: 'Min path sum: the same table with min + cost',
        titleHi: 'Min path sum: wahi table min + cost ke saath',
        code: `dp[r][c] = grid[r][c] + Math.min(fromTop, fromLeft);`,
        codeJs: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dp[0][0] = grid[0][0];
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const t = r > 0 ? dp[r - 1][c] : Infinity;
      const l = c > 0 ? dp[r][c - 1] : Infinity;
      dp[r][c] = grid[r][c] + Math.min(t, l);
    }
  return dp[m - 1][n - 1];
}
console.log(minPathSum([[1,3,1],[1,5,1],[4,2,1]])); // 7  (1->3->1->1->1)`,
        codeTs: `function minPathSum(grid: number[][]): number {
  const m = grid.length, n = grid[0]!.length;
  const dp = Array.from({ length: m }, () => new Array<number>(n).fill(Infinity));
  dp[0]![0] = grid[0]![0]!;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      const t = r > 0 ? dp[r - 1]![c]! : Infinity;
      const l = c > 0 ? dp[r]![c - 1]! : Infinity;
      dp[r]![c] = grid[r]![c]! + Math.min(t, l);
    }
  return dp[m - 1]![n - 1]!;
}`,
        outputJs: `7`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Same state (a cell), same neighbours (above and left), same fill order. Only the combine changed: take the cheaper of the two predecessors and add this cell\'s cost.',
        explainHi: 'Wahi state (ek cell), wahi neighbours (upar aur left), wahi fill order. Sirf combine badla: do predecessors mein se sasta lo aur is cell ki cost jodo.',
      },
    ],

    mistakes: [
      {
        wrong: `// wrong fill order: reading dp[r][c-1] before the inner loop has set it
for (let c = 0; c < n; c++)
  for (let r = 0; r < m; r++) { ... dp[r][c] += dp[r][c - 1]; }
// column-major here means dp[r][c-1] IS filled — but dp[r-1][c] may not be`,
        right: `for (let r = 0; r < m; r++)
  for (let c = 0; c < n; c++) { ... } // row-major: both dp[r-1][c] and dp[r][c-1] are ready`,
        why: 'The recurrence reads the cell above and the cell left. The loop order must guarantee both are computed before dp[r][c]. Row-major (r outer, c inner) does; some other orders do not.',
        whyHi: 'Recurrence upar ki cell aur left ki cell padhta hai. Loop order ko guarantee karna chahiye ki dono dp[r][c] se pehle compute hon. Row-major (r bahar, c andar) karta hai; kuch doosre orders nahi.',
      },
      {
        wrong: `// obstacle grid: forgetting to zero out the obstacle cell
if (r > 0) dp[r][c] += dp[r - 1][c];   // obstacle cell still accumulates paths
if (c > 0) dp[r][c] += dp[r][c - 1];   // and passes them on -> overcount`,
        right: `if (grid[r][c] === 1) { dp[r][c] = 0; continue; }  // no path passes through an obstacle
if (r > 0) dp[r][c] += dp[r - 1][c];
if (c > 0) dp[r][c] += dp[r][c - 1];`,
        why: 'An obstacle cell must contribute zero paths downstream. If you let it accumulate and forward path counts, every cell beyond it overcounts by the paths that "walked through" the wall.',
        whyHi: 'Ek obstacle cell ko downstream zero paths yogdaan dena chahiye. Agar aap ise path counts jama aur forward karne dete ho, iske aage har cell un paths se overcount karti hai jo wall se "chal kar guzre".',
      },
      {
        wrong: `// O(n)-space collapse when the recurrence also needs the upper-right cell
for (let c = 0; c < n; c++) row[c] = row[c] + row[c - 1] + rowAbove[c + 1];
// row[c+1] was already overwritten to the current row's value`,
        right: `// if the recurrence reads dp[r-1][c+1], keep TWO explicit rows,
// or iterate c from right to left so c+1 still holds the previous row.`,
        why: 'In-place single-row collapse only works if every cell the recurrence reads is either the previous row (untouched) or an already-updated current-row cell to the LEFT. A dependency on the upper-right breaks that.',
        whyHi: 'In-place single-row collapse sirf tab kaam karta hai jab recurrence jo har cell padhta hai wo ya toh previous row (achhooti) ho ya LEFT ki ek already-updated current-row cell. Upper-right par ek dependency use todti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Seam carving** (content-aware image resizing) is a 2D DP: dp[r][c] = minimum energy of a vertical seam ending at pixel (r, c) = energy(r,c) + min of the three cells above it.',
        hi: '**Seam carving** (content-aware image resizing) ek 2D DP hai: dp[r][c] = pixel (r, c) par khatam hone waale ek vertical seam ki minimum energy = energy(r,c) + iske upar ki teen cells ka min.',
      },
      {
        en: '**Dynamic time warping** for speech and gesture recognition aligns two time series with a 2D DP table, cell (i, j) = cost of matching the first i samples of one signal to the first j of the other.',
        hi: '**Dynamic time warping** speech aur gesture recognition ke liye do time series ko ek 2D DP table se align karta hai, cell (i, j) = ek signal ke pehle i samples ko doosre ke pehle j se match karne ki cost.',
      },
      {
        en: '**Grid-based game pathfinding with terrain costs** and route planners use min-path-sum-style DP (or Dijkstra when moves are not restricted to right/down) to find the cheapest traversal.',
        hi: '**Terrain costs ke saath grid-based game pathfinding** aur route planners min-path-sum-style DP (ya Dijkstra jab moves right/down tak seemit nahi) istemal karte hain sabse saste traversal dhoondhne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'For the grid-paths problem, explain why dp[r][c] = dp[r-1][c] + dp[r][c-1] is correct, and how you would choose the loop order.',
        qHi: 'Grid-paths problem ke liye, samjhaao ki dp[r][c] = dp[r-1][c] + dp[r][c-1] sahi kyun hai, aur aap loop order kaise chunoge.',
        a: 'The state dp of r and c is defined as the number of distinct right-or-down paths from the start cell to cell r, c. The recurrence follows from a single observation about how you can arrive at cell r, c. Every path that ends at r, c must take some final step, and because moves are restricted to right or down, that final step was either a downward move from the cell directly above, r minus one and c, or a rightward move from the cell directly to the left, r and c minus one. There is no third way to enter the cell. Moreover, these two sets of paths are disjoint: a path whose last step was downward is different from any path whose last step was rightward, because they differ in that last step. So the total count of paths ending at r, c is exactly the count ending at the cell above plus the count ending at the cell to the left, which is the recurrence. The base case is the start cell, which has exactly one path to it: the empty path where you simply stand there. Cells in the first row have only a left neighbour, cells in the first column only an above neighbour, and the guards handle that. For the loop order, the requirement is that when you compute dp of r, c, both dp of r minus one, c and dp of r, c minus one already hold their final values. Iterating rows from top to bottom and, within each row, columns from left to right satisfies this: the cell above is in an earlier, fully completed row, and the cell to the left is earlier in the current row. Column-major order, columns outer and rows inner, would also work by the symmetric argument. What would not work is any order that computes some dp of r, c before one of its two predecessors.',
        aHi: 'State dp of r aur c ko start cell se cell r, c tak distinct right-or-down paths ki tadaad ki tarah define kiya gaya. Recurrence is baat ke ek akele observation se follow hota hai ki aap cell r, c par kaise pahunch sakte ho. Har path jo r, c par khatam hota hai ko koi final step lena chahiye, aur kyunki moves right ya down tak seemit hain, wo final step ya toh seedhe upar ki cell, r minus one aur c, se ek downward move tha, ya seedhe left ki cell, r aur c minus one, se ek rightward move. Cell mein pravesh karne ka koi teesra tarika nahi. Iske alaava, ye do sets of paths disjoint hain: ek path jiska aakhri step downward tha kisi bhi path se alag hai jiska aakhri step rightward tha, kyunki wo us aakhri step mein alag hain. Toh r, c par khatam hone waale paths ki kul count bilkul upar ki cell par khatam hone waali count plus left ki cell par khatam hone waali count hai, jo recurrence hai. Base case start cell hai, jiske paas ispar bilkul ek path hai: khaali path jahaan aap bas wahaan khade ho. First row ki cells ke sirf ek left neighbour hai, first column ki cells ke sirf ek upar neighbour, aur guards use handle karte hain. Loop order ke liye, requirement ye hai ki jab aap dp of r, c compute karte ho, dono dp of r minus one, c aur dp of r, c minus one pehle se apni final values rakhte hon. Rows ko top se bottom aur, har row ke andar, columns ko left se right iterate karna ise satisfy karta hai: upar ki cell ek pehle, poori tarah complete row mein hai, aur left ki cell current row mein pehle hai. Column-major order, columns bahar aur rows andar, bhi symmetric argument se kaam karega. Jo kaam nahi karega wo koi bhi order hai jo kisi dp of r, c ko iske do predecessors mein se ek se pehle compute karta hai.',
      },
      {
        q: 'How do you decide whether a 2D DP can be reduced from O(m*n) space to O(n), and what is the danger if you get it wrong?',
        qHi: 'Aap kaise tay karte ho ki ek 2D DP ko O(m*n) space se O(n) tak kam kiya jaa sakta hai, aur agar aap ise galat karte ho toh khatra kya hai?',
        a: 'The reduction works when computing any cell in row r requires reading only cells from row r minus one and cells from row r that are earlier in the sweep, meaning to the left if you iterate columns left to right. If that is true, you do not need any row before r minus one, so instead of storing all m rows you keep a single array of length n and update it in place as you move down the grid. When you are partway through row r, the entries you have not yet reached still hold row r minus one\'s values, which serve as the "above" input, and the entries you have already updated hold row r\'s values, which serve as the "left" input. That is exactly the two things the grid-paths and min-path-sum recurrences need, so both collapse to O of n. The danger is a recurrence that also reads a cell the in-place update has already destroyed. The common case is a dependency on the upper-right cell, dp of r minus one and c plus one. When you are computing column c in the single-row scheme, column c plus one was updated on the previous iteration of an earlier row... no — column c plus one has not been touched yet this row, so it still holds row r minus one. Actually the dangerous case is a dependency on dp of r and c plus one, the current row to the right, or dp of r minus one and c minus one, the upper-left, once you have overwritten column c minus one. The safe procedure is: before collapsing, write out every cell the recurrence reads, and for each, check whether at the moment you compute dp of r, c that cell still holds the value you need. If any of them has already been overwritten by the current sweep, you must either keep two explicit rows, or reverse the iteration direction of one dimension so the needed cell is read before it is clobbered. Getting it wrong produces silently wrong answers on some inputs, not a crash, which makes it a nasty bug to catch.',
        aHi: 'Reduction tab kaam karta hai jab row r mein kisi bhi cell ko compute karne ke liye sirf row r minus one ki cells aur row r ki cells padhni hoti hain jo sweep mein pehle hain, matlab left mein agar aap columns ko left se right iterate karte ho. Agar wo sach hai, aapko r minus one se pehle koi row nahi chahiye, isliye sab m rows store karne ke bajaye aap length n ka ek akela array rakhte ho aur ise in place update karte ho jaise aap grid mein neeche jaate ho. Jab aap row r ke beech mein ho, jo entries aap abhi tak nahi pahunche wo abhi bhi row r minus one ki values rakhti hain, jo "upar" input ki tarah serve karti hain, aur jo entries aap pehle se update kar chuke ho wo row r ki values rakhti hain, jo "left" input ki tarah serve karti hain. Wo bilkul do cheezein hain jo grid-paths aur min-path-sum recurrences ko chahiye, isliye dono O of n mein collapse ho jaate hain. Khatra ek recurrence hai jo ek aisi cell bhi padhta hai jise in-place update pehle se nasht kar chuka hai. Safe procedure ye hai: collapse karne se pehle, har cell likho jo recurrence padhta hai, aur har ek ke liye, check karo ki jis pal aap dp of r, c compute karte ho wo cell abhi bhi wo value rakhti hai jo aapko chahiye. Agar unmein se koi pehle se current sweep dwara overwrite ho chuki hai, aapko ya toh do explicit rows rakhni hain, ya ek dimension ki iteration direction reverse karni hai taaki zaroori cell clobber hone se pehle padhi jaaye. Ise galat karna kuch inputs par chupchaap galat jawaab banaata hai, ek crash nahi, jo ise pakadne ke liye ek naasty bug banaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement uniquePaths (2D dp) and uniquePathsO1 (single row). Test on 3x7 (expect 28), 3x3 (expect 6), 1xN (expect 1). Confirm the two agree for all sizes up to 15x15.',
        taskHi: 'uniquePaths (2D dp) aur uniquePathsO1 (single row) implement karo. 3x7 (28 expect karo), 3x3 (6 expect karo), 1xN (1 expect karo) par test karo. Confirm karo dono 15x15 tak sab sizes ke liye sahmat hain.',
        hint: 'For the O(n) version, initialise row to all 1s (that is row 0), then for each subsequent row do row[c] += row[c-1] for c from 1.',
        hintHi: 'O(n) version ke liye, row ko sab 1s par initialise karo (wo row 0 hai), phir har agli row ke liye c ko 1 se row[c] += row[c-1] karo.',
      },
      {
        task: 'Implement minPathSum. Test on [[1,3,1],[1,5,1],[4,2,1]] (expect 7). Then extend it to also return the actual path (list of cells) by walking backwards from the bottom-right, at each cell choosing the predecessor with the smaller dp value.',
        taskHi: 'minPathSum implement karo. [[1,3,1],[1,5,1],[4,2,1]] par test karo (7 expect karo). Phir ise asli path (cells ki list) bhi return karne ke liye extend karo bottom-right se peechhe chalte hue, har cell par chhoti dp value waale predecessor ko chunte hue.',
        hint: 'From (r, c), the previous cell is (r-1, c) if dp[r-1][c] <= dp[r][c-1] (and r > 0), else (r, c-1). Stop at (0, 0), then reverse.',
        hintHi: '(r, c) se, previous cell (r-1, c) hai agar dp[r-1][c] <= dp[r][c-1] (aur r > 0), warna (r, c-1). (0, 0) par ruko, phir reverse karo.',
      },
      {
        task: 'Implement "maximal square": given a binary grid, find the area of the largest square containing only 1s. Use dp[r][c] = side length of the largest all-1s square whose bottom-right corner is (r, c).',
        taskHi: '"maximal square" implement karo: ek binary grid diya gaya, sirf 1s waale sabse bade square ka area dhoondho. dp[r][c] = sabse bade all-1s square ki side length jiska bottom-right corner (r, c) hai istemal karo.',
        hint: 'If grid[r][c] === 1: dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]). The answer is max(dp[r][c])^2. This is a 2D DP that reads THREE neighbours.',
        hintHi: 'Agar grid[r][c] === 1: dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]). Jawaab max(dp[r][c])^2 hai. Ye ek 2D DP hai jo TEEN neighbours padhta hai.',
      },
    ],

    keyTakeaways: [
      '2D DP: a subproblem needs two numbers to describe — usually a grid cell (r, c) or a pair of positions in two sequences. dp is a 2D table.',
      'Grid paths: dp[r][c] = dp[r-1][c] + dp[r][c-1] (you can only enter a cell from above or from the left). Base case dp[0][0] = 1. Fill row by row.',
      'Min path sum is the same table with a different combine: dp[r][c] = grid[r][c] + min(above, left). Many grid DPs are this table with a swapped operation.',
      'Extra constraints (obstacles, blocked cells) usually become a guard inside the same double loop — set dp to 0 and continue — not a new algorithm.',
      'Collapse O(m*n) space to O(n) by keeping one row, updated in place left to right — but ONLY if the recurrence reads only the previous row and already-updated current-row cells to the left.',
      'Choose the loop order so that every cell the recurrence depends on is computed before it. Row-major works for the "above + left" recurrence.',
    ],
    keyTakeawaysHi: [
      '2D DP: ek subproblem ko describe karne ke liye do numbers chahiye — aksar ek grid cell (r, c) ya do sequences mein positions ka ek pair. dp ek 2D table hai.',
      'Grid paths: dp[r][c] = dp[r-1][c] + dp[r][c-1] (aap ek cell mein sirf upar se ya left se pravesh kar sakte ho). Base case dp[0][0] = 1. Row by row bharo.',
      'Min path sum wahi table hai ek alag combine ke saath: dp[r][c] = grid[r][c] + min(above, left). Kayi grid DPs ye table hain ek swapped operation ke saath.',
      'Extra constraints (obstacles, blocked cells) aksar usi double loop ke andar ek guard ban jaate hain — dp ko 0 set karo aur continue — ek naya algorithm nahi.',
      'O(m*n) space ko O(n) mein collapse karo ek row rakhkar, in place left se right update kiya — par SIRF agar recurrence sirf previous row aur left ki already-updated current-row cells padhta hai.',
      'Loop order aise chuno ki har cell jispar recurrence nirbhar karta hai iske pehle compute ho. Row-major "above + left" recurrence ke liye kaam karta hai.',
    ],
  },
];
