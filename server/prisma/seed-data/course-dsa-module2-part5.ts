/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 5.
 *
 * Matrix / grid patterns: treating a 2D array as a first-class shape with its
 * own idioms — boundary-shrinking spiral traversal, in-place rotation via
 * transpose-then-reverse, 4-directional flood fill, and using the first row and
 * column as in-place marker storage. Builds on this course's Module 1 lesson 5
 * (arrays in memory, in-place two-pointer techniques) and previews Module 9
 * (a grid is a graph whose neighbours are computed instead of stored). Broken
 * example: rotating an n-by-n image 90 degrees clockwise by allocating a whole
 * second matrix and copying into it — correct, but O(n^2) extra memory for a
 * transformation that can be done with swaps; and the naive "just swap
 * matrix[r][c] with matrix[c][r] everywhere" attempt, which transposes each pair
 * twice and leaves the matrix unchanged. Fixed with the two-step in-place idiom:
 * transpose (swap across the main diagonal, visiting only c > r), then reverse
 * each row. The lesson also gives the direction-vector idiom for grid traversal
 * and the "mark visited by mutating the grid" trick.
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

export const DSA_MODULE_2_PART5: CourseLesson[] = [
  {
    slug: 'matrix-grid-patterns',
    title: 'Matrix & Grid Patterns: Spiral, Rotate, Flood Fill',
    titleHi: 'Matrix Aur Grid Patterns: Spiral, Rotate, Flood Fill',
    description: 'Rotating an n-by-n image 90 degrees clockwise by building a whole second matrix and copying every cell into its new position. It is correct, but it doubles the memory for a transformation that only ever moves values between existing cells — and the obvious in-place attempt, swapping matrix[r][c] with matrix[c][r] for every pair, visits each pair twice and leaves the matrix exactly as it started.',
    descriptionHi: 'Ek n-by-n image ko 90 degrees clockwise rotate karna ek poori doosri matrix banaakar aur har cell ko iski nayi position mein copy karke. Ye sahi hai, par ye ek aise transformation ke liye memory doguna karta hai jo sirf maujooda cells ke beech values move karta hai — aur spasht in-place prayaas, har pair ke liye matrix[r][c] ko matrix[c][r] se swap karna, har pair ko do baar visit karta hai aur matrix ko bilkul waisa hi chhodta hai jaisa shuru hua.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Turning a framed photograph on a wall versus repainting it on a new canvas.** If someone asks you to rotate a picture a quarter turn, the wasteful approach is to get a blank canvas the same size and repaint every single dot in its new position — you end up with two pictures and twice the wall space used. The efficient approach uses the fact that a rotation is just a rearrangement of dots that are already there: first flip the picture along its top-left-to-bottom-right diagonal (which swaps rows with columns), then flip it left-to-right. Two simple mirror operations, performed on the picture itself, compose into exactly a quarter turn. The important subtlety in the first flip: if you mirror across the diagonal by walking every cell, you touch each pair of mirrored cells twice — once from each side — and the second touch undoes the first, so the picture comes back unchanged. You must walk only the cells on one side of the diagonal. The same "walk only half" caution applies to any in-place swap-based transformation.',
      hi: '**Ek deewaar par ek framed photograph ghumaana versus ise ek naye canvas par dobara paint karna.** Agar koi aapse ek picture ko ek chauthaai ghumaane ko kehta hai, faaltu approach ek utne hi size ka khaali canvas laana aur har akela dot iski nayi position mein dobara paint karna hai — aap do pictures aur do guni deewaar jagah istemal karke khatam hote ho. Efficient approach is baat ka istemal karta hai ki ek rotation bas un dots ka ek rearrangement hai jo pehle se wahaan hain: pehle picture ko iske top-left-se-bottom-right diagonal ke saath flip karo (jo rows ko columns se swap karta hai), phir ise left-se-right flip karo. Do saral mirror operations, picture par khud kiye gaye, bilkul ek chauthaai ghumaav mein compose hote hain. Pehle flip mein mahatvapoorn sookshmta: agar aap har cell chalkar diagonal ke aar-paar mirror karte ho, aap har mirrored cells ke pair ko do baar chhoote ho — har side se ek baar — aur doosra sparsh pehle ko undo karta hai, isliye picture na-badla wapas aata hai. Aapko sirf diagonal ke ek side ki cells chalni chahiye. Wahi "sirf aadha chalo" saavdhaani kisi bhi in-place swap-based transformation par lagti hai.',
    },

    simple: `**Start broken.** Rotate an n x n matrix 90 degrees clockwise, two failed ways:

\`\`\`js
// Attempt 1: allocate a whole new matrix — correct, but O(n^2) extra space
function rotateCopy(m) {
  const n = m.length;
  const out = Array.from({ length: n }, () => new Array(n));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      out[c][n - 1 - r] = m[r][c];     // the destination formula for a 90-degree turn
  return out;                          // caller must now use 'out', not 'm'
}

// Attempt 2: "just transpose in place" — but it visits every pair TWICE
function transposeBroken(m) {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)                     // c starts at 0, not at r
      [m[r][c], m[c][r]] = [m[c][r], m[r][c]];
  return m;   // unchanged! swapping (0,1)<->(1,0) then later (1,0)<->(0,1) undoes it
}
\`\`\`

Attempt 1 works but doubles memory and forces the caller to switch to a new array. Attempt 2 is the classic in-place bug: when \`c\` runs the full width, the pair \`(r, c)\` and \`(c, r)\` are each swapped once from each side, and the second swap restores the original.

**The fix: transpose (upper triangle only), then reverse each row**

\`\`\`js
function rotate(m) {
  const n = m.length;

  // 1. transpose: mirror across the main diagonal, visiting only c > r
  for (let r = 0; r < n; r++)
    for (let c = r + 1; c < n; c++)               // c starts at r + 1
      [m[r][c], m[c][r]] = [m[c][r], m[r][c]];

  // 2. reverse each row left-to-right
  for (const row of m) row.reverse();

  return m;                                        // rotated in place
}
\`\`\`

\`\`\`ts
function rotate(m: number[][]): number[][] {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = r + 1; c < n; c++)
      [m[r]![c], m[c]![r]] = [m[c]![r]!, m[r]![c]!];
  for (const row of m) row.reverse();
  return m;
}
\`\`\`

Transpose turns rows into columns; reversing each row then flips the horizontal order. Composed, they are exactly a 90-degree clockwise rotation. Starting the inner loop at \`c = r + 1\` visits each mirrored pair exactly once, which is what makes the in-place version correct. O(n^2) time (every cell is touched a constant number of times) and **O(1) extra space**.

**Spiral traversal: shrink four boundaries instead of tracking direction**

\`\`\`js
function spiralOrder(m) {
  if (m.length === 0) return [];
  const out = [];
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(m[top][c]);        // left -> right
    top++;
    for (let r = top; r <= bottom; r++) out.push(m[r][right]);      // top -> bottom
    right--;
    if (top <= bottom) {                                            // guard: row still exists
      for (let c = right; c >= left; c--) out.push(m[bottom][c]);   // right -> left
      bottom--;
    }
    if (left <= right) {                                            // guard: column still exists
      for (let r = bottom; r >= top; r--) out.push(m[r][left]);     // bottom -> top
      left++;
    }
  }
  return out;
}
\`\`\`

Four numbers describe the un-visited rectangle. Walk its top edge and shrink \`top\`; walk the right edge and shrink \`right\`; and so on. The two \`if\` guards before the bottom and left passes are essential: on a single remaining row or column, those edges were already consumed by the first two passes, and without the guards you would emit them a second time.`,

    simpleHi: `**Toote hue se shuru.** Ek n x n matrix ko 90 degrees clockwise rotate karo, do fail hue tarike:

\`\`\`js
// Prayaas 1: ek poori nayi matrix allocate karo — sahi, par O(n^2) extra space
function rotateCopy(m) {
  const n = m.length;
  const out = Array.from({ length: n }, () => new Array(n));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      out[c][n - 1 - r] = m[r][c];     // ek 90-degree turn ke liye destination formula
  return out;                          // caller ko ab 'out' istemal karna hai, 'm' nahi
}

// Prayaas 2: "bas in place transpose karo" — par ye har pair ko DO BAAR visit karta hai
function transposeBroken(m) {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)                     // c 0 par shuru, r par nahi
      [m[r][c], m[c][r]] = [m[c][r], m[r][c]];
  return m;   // na-badla! (0,1)<->(1,0) swap karke phir baad mein (1,0)<->(0,1) ise undo karta hai
}
\`\`\`

Prayaas 1 kaam karta hai par memory doguni karta hai aur caller ko ek naye array par switch karne ke liye majboor karta hai. Prayaas 2 classic in-place bug hai: jab \`c\` poori width chalta hai, pair \`(r, c)\` aur \`(c, r)\` har side se ek baar swap hote hain, aur doosra swap original restore karta hai.

**Fix: transpose (sirf upper triangle), phir har row reverse karo**

\`\`\`js
function rotate(m) {
  const n = m.length;

  // 1. transpose: main diagonal ke aar-paar mirror, sirf c > r visit karte hue
  for (let r = 0; r < n; r++)
    for (let c = r + 1; c < n; c++)               // c r + 1 par shuru
      [m[r][c], m[c][r]] = [m[c][r], m[r][c]];

  // 2. har row ko left-se-right reverse karo
  for (const row of m) row.reverse();

  return m;                                        // jagah par rotated
}
\`\`\`

\`\`\`ts
function rotate(m: number[][]): number[][] {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = r + 1; c < n; c++)
      [m[r]![c], m[c]![r]] = [m[c]![r]!, m[r]![c]!];
  for (const row of m) row.reverse();
  return m;
}
\`\`\`

Transpose rows ko columns mein badalta hai; phir har row reverse karna horizontal order palatta hai. Compose hokar, wo bilkul ek 90-degree clockwise rotation hain. Inner loop ko \`c = r + 1\` par shuru karna har mirrored pair ko bilkul ek baar visit karta hai, jo in-place version ko sahi banaata hai. O(n^2) time aur **O(1) extra space**.

**Spiral traversal: direction track karne ke bajaye chaar boundaries shrink karo**

\`\`\`js
function spiralOrder(m) {
  if (m.length === 0) return [];
  const out = [];
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(m[top][c]);        // left -> right
    top++;
    for (let r = top; r <= bottom; r++) out.push(m[r][right]);      // top -> bottom
    right--;
    if (top <= bottom) {                                            // guard: row abhi bhi hai
      for (let c = right; c >= left; c--) out.push(m[bottom][c]);   // right -> left
      bottom--;
    }
    if (left <= right) {                                            // guard: column abhi bhi hai
      for (let r = bottom; r >= top; r--) out.push(m[r][left]);     // bottom -> top
      left++;
    }
  }
  return out;
}
\`\`\`

Chaar numbers un-visited rectangle ko describe karte hain. Iska top edge chalo aur \`top\` shrink karo; right edge chalo aur \`right\` shrink karo; aur aise hi. Bottom aur left passes se pehle do \`if\` guards zaroori hain: ek akeli bachi row ya column par, wo edges pehle do passes se pehle hi consume ho chuke, aur guards ke bina aap unhe doosri baar emit karte.`,

    content: `## The direction-vector idiom: neighbours without a stored graph

\`\`\`js
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];   // up, down, left, right
// for 8-directional (including diagonals), add [-1,-1], [-1,1], [1,-1], [1,1]

function neighbours(grid, r, c) {
  const out = [];
  for (const [dr, dc] of DIRS) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
      out.push([nr, nc]);                          // in-bounds only
    }
  }
  return out;
}
\`\`\`

A grid is a graph — this course's Module 9 makes that explicit — but you never build an adjacency list for it. A cell's neighbours are *computed* by adding each direction vector and rejecting the out-of-bounds results. Writing the four (or eight) deltas as a constant array and looping them is what turns four near-identical copy-pasted blocks into one loop, and it is where most grid bugs are avoided.

## Flood fill / number of islands: DFS or BFS over the grid

\`\`\`js
// Count connected regions of '1's in a grid of '1' (land) and '0' (water).
function numIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function sink(r, c) {                             // DFS flood fill
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;   // out of bounds
    if (grid[r][c] !== '1') return;                          // water, or already sunk
    grid[r][c] = '0';                                        // MARK VISITED by mutating
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  }

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }        // each fresh '1' = a new island

  return count;
}
\`\`\`

Two things carry the whole algorithm. First, the outer double loop plus "count a new island only when we find an unvisited land cell" is exactly the connected-components pattern from this course's Module 9 — every fresh start is one component. Second, marking a cell visited by *overwriting it in the grid* replaces a separate \`visited\` set, saving O(rows * cols) space. If you must not modify the input, keep a parallel boolean grid instead.

The recursion depth is the size of the largest island, so on a grid that is one huge landmass (say 1000 by 1000, a million cells) a recursive flood fill can overflow the call stack — this course's Module 6 warned about exactly this. Switch to an explicit stack or a BFS queue when the grid can be large:

\`\`\`js
function sinkIterative(grid, sr, sc) {
  const stack = [[sr, sc]];
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) continue;
    if (grid[r][c] !== '1') continue;
    grid[r][c] = '0';
    for (const [dr, dc] of DIRS) stack.push([r + dr, c + dc]);
  }
}
\`\`\`

## Set matrix zeroes: using row 0 and column 0 as the marker storage

\`\`\`js
// If any cell is 0, set its whole row and whole column to 0. In place, O(1) extra space.
function setZeroes(m) {
  const rows = m.length, cols = m[0].length;
  let firstColHasZero = false;

  // pass 1: record which rows/cols must be zeroed, IN the first row and column
  for (let r = 0; r < rows; r++) {
    if (m[r][0] === 0) firstColHasZero = true;      // column 0 needs its own flag
    for (let c = 1; c < cols; c++) {
      if (m[r][c] === 0) { m[r][0] = 0; m[0][c] = 0; }
    }
  }

  // pass 2: apply the markers, working BACKWARDS so the markers survive until read
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 1; c--) {
      if (m[r][0] === 0 || m[0][c] === 0) m[r][c] = 0;
    }
    if (firstColHasZero) m[r][0] = 0;
  }
  return m;
}
\`\`\`

The naive fix — zeroing a row the moment you see a zero — is wrong, because the zeroes you write are indistinguishable from original zeroes and cascade until the whole matrix is zero. The standard repair is a two-pass approach with a separate marker array; the O(1)-space version reuses the first row and column as that marker array, which costs one extra boolean for the overlapping cell \`m[0][0]\`. Note the second pass runs backwards so that a marker in row 0 or column 0 is still intact when the cells depending on it are written.

## The recurring grid checklist

\`\`\`
1. Bounds first. Every neighbour access needs 0 <= r < rows and 0 <= c < cols.
   Write the guard once in a helper or at the top of the visit function.
2. Direction deltas as a constant array. Never copy-paste four blocks.
3. Decide how "visited" is stored: mutate the grid (free, destroys input) or a
   parallel boolean grid (O(rows*cols), keeps input intact).
4. Watch recursion depth. A recursive flood fill on a large grid can overflow;
   use an explicit stack or BFS queue.
5. For in-place transforms, work out whether each cell/pair is visited once.
   Half-loops (c starting at r+1) and reversed passes exist for that reason.
6. cols is m[0].length — guard the empty-matrix case before reading m[0].
\`\`\``,

    contentHi: `## Direction-vector idiom: bina store kiye graph ke neighbours

\`\`\`js
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];   // up, down, left, right
// 8-directional (diagonals sameet) ke liye, [-1,-1], [-1,1], [1,-1], [1,1] jodo

function neighbours(grid, r, c) {
  const out = [];
  for (const [dr, dc] of DIRS) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
      out.push([nr, nc]);                          // sirf in-bounds
    }
  }
  return out;
}
\`\`\`

Ek grid ek graph hai — is course ka Module 9 ise explicit banaata hai — par aap iske liye kabhi ek adjacency list nahi banaate. Ek cell ke neighbours har direction vector jodkar aur out-of-bounds nateeje reject karke *compute* hote hain. Chaar (ya aath) deltas ko ek constant array ki tarah likhna aur unhe loop karna wo hai jo chaar lagbhag-samaan copy-paste blocks ko ek loop mein badalta hai, aur yahi jagah hai jahaan adhikaansh grid bugs bachte hain.

## Flood fill / number of islands: grid par DFS ya BFS

\`\`\`js
// '1' (land) aur '0' (water) ke ek grid mein '1's ke connected regions gino.
function numIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  function sink(r, c) {                             // DFS flood fill
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;   // bounds ke bahar
    if (grid[r][c] !== '1') return;                          // water, ya pehle se sunk
    grid[r][c] = '0';                                        // mutate karke VISITED MARK karo
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  }

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }        // har fresh '1' = ek naya island

  return count;
}
\`\`\`

Do cheezein poora algorithm le jaati hain. Pehli, outer double loop plus "ek naya island tabhi gino jab hum ek unvisited land cell paayein" bilkul is course ke Module 9 ka connected-components pattern hai — har fresh start ek component hai. Doosri, ek cell ko *grid mein overwrite karke* visited mark karna ek alag \`visited\` set ko replace karta hai, O(rows * cols) space bachaate hue. Agar aapko input modify nahi karna, iske bajaye ek parallel boolean grid rakho.

Recursion depth sabse bade island ka size hai, isliye ek aise grid par jo ek bada landmass hai (maano 1000 by 1000, ek million cells) ek recursive flood fill call stack overflow kar sakta hai — is course ke Module 6 ne bilkul iski chetaavni di. Jab grid bada ho sakta hai ek explicit stack ya ek BFS queue par switch karo:

\`\`\`js
function sinkIterative(grid, sr, sc) {
  const stack = [[sr, sc]];
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) continue;
    if (grid[r][c] !== '1') continue;
    grid[r][c] = '0';
    for (const [dr, dc] of DIRS) stack.push([r + dr, c + dc]);
  }
}
\`\`\`

## Set matrix zeroes: row 0 aur column 0 ko marker storage ki tarah istemal karna

\`\`\`js
// Agar koi cell 0 hai, iski poori row aur poora column 0 set karo. Jagah par, O(1) extra space.
function setZeroes(m) {
  const rows = m.length, cols = m[0].length;
  let firstColHasZero = false;

  // pass 1: record karo kaunsi rows/cols zero honi chahiye, PEHLI row aur column MEIN
  for (let r = 0; r < rows; r++) {
    if (m[r][0] === 0) firstColHasZero = true;      // column 0 ko apna flag chahiye
    for (let c = 1; c < cols; c++) {
      if (m[r][c] === 0) { m[r][0] = 0; m[0][c] = 0; }
    }
  }

  // pass 2: markers lagao, PEECHHE kaam karte hue taaki markers padhe jaane tak bachein
  for (let r = rows - 1; r >= 0; r--) {
    for (let c = cols - 1; c >= 1; c--) {
      if (m[r][0] === 0 || m[0][c] === 0) m[r][c] = 0;
    }
    if (firstColHasZero) m[r][0] = 0;
  }
  return m;
}
\`\`\`

Naive fix — jis pal aap ek zero dekho us row ko zero karna — galat hai, kyunki jo zeroes aap likhte ho wo original zeroes se alag nahi pehchaane jaate aur cascade karte hain jab tak poori matrix zero na ho jaaye. Standard repair ek alag marker array ke saath ek two-pass approach hai; O(1)-space version pehli row aur column ko us marker array ki tarah reuse karta hai, jo overlapping cell \`m[0][0]\` ke liye ek extra boolean kharch karta hai. Dhyaan do doosra pass peechhe chalta hai taaki row 0 ya column 0 mein ek marker abhi bhi salaamat ho jab ispar nirbhar cells likhi jaati hain.

## Dohraaya jaane wala grid checklist

\`\`\`
1. Bounds pehle. Har neighbour access ko 0 <= r < rows aur 0 <= c < cols chahiye.
   Guard ek baar ek helper mein ya visit function ke top par likho.
2. Direction deltas ek constant array ki tarah. Kabhi chaar blocks copy-paste mat karo.
3. Tay karo "visited" kaise store hota hai: grid mutate karo (muft, input nasht karta hai)
   ya ek parallel boolean grid (O(rows*cols), input salaamat rakhta hai).
4. Recursion depth par dhyaan do. Ek bade grid par ek recursive flood fill overflow
   ho sakta hai; ek explicit stack ya BFS queue istemal karo.
5. In-place transforms ke liye, nikaalo ki har cell/pair ek baar visit hota hai ya nahi.
   Half-loops (c r+1 par shuru) aur reversed passes usi wajah se maujood hain.
6. cols m[0].length hai — m[0] padhne se pehle empty-matrix case guard karo.
\`\`\``,

    examples: [
      {
        title: 'Broken: transposing with a full inner loop undoes itself',
        titleHi: 'Toota: ek poore inner loop se transpose karna khud ko undo karta hai',
        code: `for (let c = 0; c < n; c++)          // c from 0 -> each pair swapped twice
  [m[r][c], m[c][r]] = [m[c][r], m[r][c]];`,
        codeJs: `function transposeBroken(m) {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      [m[r][c], m[c][r]] = [m[c][r], m[r][c]];
  return m;
}
console.log(transposeBroken([[1,2],[3,4]])); // [[1,2],[3,4]] — unchanged!`,
        codeTs: `function transposeBroken(m: number[][]): number[][] {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      [m[r]![c], m[c]![r]] = [m[c]![r]!, m[r]![c]!];
  return m;
}`,
        output: `[[1, 2], [3, 4]]`,
        explain: 'The pair (0,1) and (1,0) is swapped once when r=0,c=1 and swapped back when r=1,c=0. Every off-diagonal pair is touched from both sides, so the second swap cancels the first.',
        explainHi: 'Pair (0,1) aur (1,0) ek baar swap hota hai jab r=0,c=1 aur wapas swap hota hai jab r=1,c=0. Har off-diagonal pair dono sides se chhua jaata hai, isliye doosra swap pehle ko cancel karta hai.',
      },
      {
        title: 'Fixed: transpose upper triangle, then reverse each row',
        titleHi: 'Theek: upper triangle transpose karo, phir har row reverse karo',
        code: `for (let c = r + 1; c < n; c++)      // c from r+1 -> each pair swapped ONCE
  [m[r][c], m[c][r]] = [m[c][r], m[r][c]];
for (const row of m) row.reverse();`,
        codeJs: `function rotate(m) {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = r + 1; c < n; c++)
      [m[r][c], m[c][r]] = [m[c][r], m[r][c]];
  for (const row of m) row.reverse();
  return m;
}
console.log(rotate([[1,2,3],[4,5,6],[7,8,9]]));
// [[7,4,1],[8,5,2],[9,6,3]] — rotated 90 degrees clockwise, in place`,
        codeTs: `function rotate(m: number[][]): number[][] {
  const n = m.length;
  for (let r = 0; r < n; r++)
    for (let c = r + 1; c < n; c++)
      [m[r]![c], m[c]![r]] = [m[c]![r]!, m[r]![c]!];
  for (const row of m) row.reverse();
  return m;
}`,
        outputJs: `[[7, 4, 1], [8, 5, 2], [9, 6, 3]]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Transpose mirrors across the main diagonal (rows become columns); reversing each row then flips left-right. Together that is exactly a 90-degree clockwise turn, in O(1) extra space.',
        explainHi: 'Transpose main diagonal ke aar-paar mirror karta hai (rows columns ban jaati hain); phir har row reverse karna left-right palatta hai. Saath wo bilkul ek 90-degree clockwise turn hai, O(1) extra space mein.',
      },
      {
        title: 'Number of islands: flood fill with the grid as the visited marker',
        titleHi: 'Number of islands: grid ko visited marker ki tarah lekar flood fill',
        code: `if (grid[r][c] === '1') { count++; sink(r, c); }   // each fresh land cell = new island`,
        codeJs: `const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];
function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function sink(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] !== '1') return;
    grid[r][c] = '0';
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === '1') { count++; sink(r, c); }
  return count;
}
console.log(numIslands([
  ['1','1','0','0'],
  ['1','1','0','0'],
  ['0','0','1','0'],
  ['0','0','0','1'],
])); // 3`,
        codeTs: `const DIRS: [number, number][] = [[-1,0],[1,0],[0,-1],[0,1]];
function numIslands(grid: string[][]): number {
  if (!grid.length) return 0;
  const rows = grid.length, cols = grid[0]!.length;
  let count = 0;
  const sink = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r]![c] !== '1') return;
    grid[r]![c] = '0';
    for (const [dr, dc] of DIRS) sink(r + dr, c + dc);
  };
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r]![c] === '1') { count++; sink(r, c); }
  return count;
}`,
        outputJs: `3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The outer loop starts a flood fill only at land cells that have not been sunk yet, so each start is exactly one new connected component. Overwriting land with water is the visited marker, so no extra set is needed.',
        explainHi: 'Outer loop ek flood fill sirf un land cells par shuru karta hai jo abhi sunk nahi hue, isliye har start bilkul ek naya connected component hai. Land ko water se overwrite karna visited marker hai, isliye koi extra set nahi chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `// forgetting the bounds check before reading a neighbour
for (const [dr, dc] of DIRS) {
  if (grid[r + dr][c + dc] === '1') ...   // throws when r+dr is -1 or rows`,
        right: `for (const [dr, dc] of DIRS) {
  const nr = r + dr, nc = c + dc;
  if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
  if (grid[nr][nc] === '1') ...`,
        why: 'Every edge and corner cell has neighbours outside the grid. Reading grid[-1] gives undefined and then indexing it throws; reading grid[rows] does the same. The bounds guard must come before any access.',
        whyHi: 'Har edge aur corner cell ke neighbours grid ke bahar hain. grid[-1] padhna undefined deta hai aur phir ise index karna throw karta hai; grid[rows] padhna wahi karta hai. Bounds guard kisi bhi access se pehle aana chahiye.',
      },
      {
        wrong: `// spiral traversal without the row/column-still-exists guards
for (let c = right; c >= left; c--) out.push(m[bottom][c]);   // re-emits a single row
bottom--;`,
        right: `if (top <= bottom) {
  for (let c = right; c >= left; c--) out.push(m[bottom][c]);
  bottom--;
}`,
        why: 'When only one row remains, the left-to-right pass already consumed it and top has moved past bottom. Without the guard the bottom pass walks that same row again in reverse, duplicating every value.',
        whyHi: 'Jab sirf ek row bachti hai, left-to-right pass pehle hi ise consume kar chuka hai aur top bottom ke aage nikal chuka hai. Guard ke bina bottom pass usi row ko ulta phir chalta hai, har value duplicate karte hue.',
      },
      {
        wrong: `// set-matrix-zeroes by zeroing a row the moment a zero is seen
if (m[r][c] === 0) { zeroRow(m, r); zeroCol(m, c); }
// the zeroes you write look identical to original zeroes -> cascade`,
        right: `// two passes: first RECORD which rows/cols to zero, then APPLY the records.
// (The O(1)-space variant records into row 0 and column 0.)`,
        why: 'Writing zeroes during the scan makes new zeroes indistinguishable from input zeroes, so the scan keeps triggering on its own output and eventually zeroes the whole matrix.',
        whyHi: 'Scan ke dauraan zeroes likhna naye zeroes ko input zeroes se alag nahi pehchaanne deta, isliye scan apne khud ke output par trigger karta rehta hai aur aakhirkaar poori matrix zero kar deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Image processing** — rotation, transpose, and flip are exactly these matrix operations, and libraries do them in place for the same memory reason.',
        hi: '**Image processing** — rotation, transpose, aur flip bilkul ye matrix operations hain, aur libraries unhe usi memory wajah se jagah par karti hain.',
      },
      {
        en: '**Paint-bucket fill in any drawing app is flood fill** — pick a start pixel, spread to 4- or 8-connected neighbours of the same colour, repaint as you go.',
        hi: '**Kisi bhi drawing app mein paint-bucket fill flood fill hai** — ek start pixel chuno, usi colour ke 4- ya 8-connected neighbours tak phailo, chalte-chalte dobara paint karo.',
      },
      {
        en: '**Game maps and board logic** (minesweeper reveal, territory counting, pathable-region checks) are grid traversals with direction vectors and a visited marker.',
        hi: '**Game maps aur board logic** (minesweeper reveal, territory ginna, pathable-region checks) direction vectors aur ek visited marker ke saath grid traversals hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain why transpose-then-reverse rotates a matrix 90 degrees clockwise, and why the transpose loop must start its inner index at r + 1.',
        qHi: 'Samjhaao ki transpose-phir-reverse ek matrix ko 90 degrees clockwise kyun rotate karta hai, aur kyun transpose loop ko apna inner index r + 1 par shuru karna chahiye.',
        a: 'Think about where a single value has to end up. In a 90-degree clockwise rotation of an n by n matrix, the value at row r, column c must move to row c, column n minus 1 minus r. The top-left corner goes to the top-right, the top-right goes to the bottom-right, and so on. Now consider the two operations separately. Transposing swaps the value at row r, column c with the value at row c, column r, so after transposing, the value originally at r, c sits at row c, column r. Then reversing each row horizontally maps column index r to column index n minus 1 minus r, while leaving the row index alone. So after both steps, the value that started at row r, column c is at row c, column n minus 1 minus r, which is exactly the rotation target. The two mirror operations compose into the quarter turn. As for the inner loop bound: a transpose is a swap of the pair at r, c with the pair at c, r, and each such unordered pair appears twice if you iterate the full square, once as r, c and once as c, r. Performing the swap both times returns the pair to its original arrangement, so the matrix comes out unchanged. Starting the inner index at r plus one visits only the cells strictly above the main diagonal, which hits each unordered off-diagonal pair exactly once. Cells on the diagonal itself, where r equals c, need no swap at all since they map to themselves. This "iterate only one side" caution applies generally to in-place symmetric swaps.',
        aHi: 'Socho ek akeli value ko kahaan khatam hona hai. Ek n by n matrix ke 90-degree clockwise rotation mein, row r, column c par value ko row c, column n minus 1 minus r par jaana chahiye. Top-left corner top-right par jaata hai, top-right bottom-right par, aur aise hi. Ab do operations alag se socho. Transpose row r, column c par value ko row c, column r par value se swap karta hai, isliye transpose ke baad, jo value asal mein r, c par thi wo row c, column r par baithti hai. Phir har row ko horizontally reverse karna column index r ko column index n minus 1 minus r par map karta hai, row index ko akela chhodte hue. Toh dono steps ke baad, jo value row r, column c par shuru hui wo row c, column n minus 1 minus r par hai, jo bilkul rotation target hai. Do mirror operations chauthaai turn mein compose hote hain. Inner loop bound ke baare mein: ek transpose r, c par pair ka c, r par pair ke saath ek swap hai, aur har aisa unordered pair do baar aata hai agar aap poora square iterate karte ho, ek baar r, c ki tarah aur ek baar c, r ki tarah. Swap dono baar karna pair ko iski original arrangement par wapas laata hai, isliye matrix na-badla nikalta hai. Inner index ko r plus one par shuru karna sirf main diagonal ke sakhti se upar ki cells visit karta hai, jo har unordered off-diagonal pair ko bilkul ek baar hit karta hai.',
      },
      {
        q: 'For counting islands in a grid, when would you mutate the grid to mark visited versus keeping a separate visited structure, and what is the risk with a recursive flood fill?',
        qHi: 'Ek grid mein islands ginne ke liye, aap grid ko visited mark karne ke liye kab mutate karoge versus ek alag visited structure rakhoge, aur ek recursive flood fill ke saath risk kya hai?',
        a: 'Mutating the grid, for instance overwriting land cells with water as you sink them, is the cheaper option: it costs no extra memory at all, and the check "is this cell still land" doubles as the visited test. I would use it whenever the caller has told me the input may be modified, or when the grid is a scratch copy I own. The cost is that the input is destroyed, so if the caller needs the original grid afterwards, or if the same grid must be traversed again for a second query, mutation is wrong and I would allocate a parallel boolean array of the same dimensions and mark visits there. That costs rows times columns booleans, which for a large grid is real but usually acceptable. A third option, if the grid must stay intact and memory is tight, is to mutate during the traversal and then restore the original values in a second pass, though that is rarely worth the added complexity. The risk with the recursive version is call-stack depth. The recursion goes as deep as the number of cells in the largest connected region, because the flood fill does not return until it has walked the entire island. On a grid that is mostly one landmass, say a thousand by a thousand grid that is entirely land, the depth reaches a million frames, which overflows the stack in every mainstream runtime. The fix is to convert the depth-first recursion into an explicit loop with a stack array, pushing neighbour coordinates and popping them, or to use a breadth-first queue instead. Both keep the frontier on the heap rather than the call stack, so the only limit is available memory.',
        aHi: 'Grid mutate karna, jaise land cells ko water se overwrite karna jab aap unhe sink karte ho, sasta option hai: ise koi extra memory bilkul nahi lagti, aur check "kya ye cell abhi bhi land hai" visited test ki tarah bhi kaam karta hai. Main ise tab istemal karunga jab caller ne mujhe bataya hai ki input modify ho sakta hai, ya jab grid ek scratch copy hai jo meri hai. Cost ye hai ki input nasht ho jaata hai, isliye agar caller ko baad mein original grid chahiye, ya agar usi grid ko ek doosri query ke liye dobara traverse karna hai, mutation galat hai aur main usi dimensions ka ek parallel boolean array allocate karunga aur wahaan visits mark karunga. Wo rows guna columns booleans kharch karta hai, jo ek bade grid ke liye asli par aksar acceptable hai. Recursive version ke saath risk call-stack depth hai. Recursion utni gehri jaati hai jitne sabse bade connected region mein cells hain, kyunki flood fill tab tak return nahi karta jab tak ye poora island na chal le. Ek aise grid par jo zyaadaatar ek landmass hai, maano ek hazaar by ek hazaar grid jo poori tarah land hai, depth ek million frames tak pahunchti hai, jo har mainstream runtime mein stack overflow karti hai. Fix depth-first recursion ko ek stack array ke saath ek explicit loop mein convert karna hai, neighbour coordinates push aur pop karte hue, ya iske bajaye ek breadth-first queue istemal karna.',
      },
    ],

    exercises: [
      {
        task: 'Implement rotate (transpose + reverse) and verify on a 3x3 and a 4x4. Then deliberately change the inner loop to start at c = 0 and confirm the matrix comes back unchanged — the double-swap bug.',
        taskHi: 'rotate (transpose + reverse) implement karo aur ek 3x3 aur ek 4x4 par verify karo. Phir jaan-boojhkar inner loop ko c = 0 par shuru karne ke liye badlo aur confirm karo matrix na-badla wapas aata hai — double-swap bug.',
        hint: 'For [[1,2,3],[4,5,6],[7,8,9]] the answer is [[7,4,1],[8,5,2],[9,6,3]]. Also try rotating four times and confirm you get the original back.',
        hintHi: '[[1,2,3],[4,5,6],[7,8,9]] ke liye jawaab [[7,4,1],[8,5,2],[9,6,3]] hai. Chaar baar rotate karke bhi try karo aur confirm karo aapko original wapas milta hai.',
      },
      {
        task: 'Implement spiralOrder with the four shrinking boundaries. Test on a 3x3, a single row [[1,2,3]], a single column [[1],[2],[3]], and a 3x4. Then remove the two if-guards and find the input where it duplicates values.',
        taskHi: 'Chaar shrinking boundaries ke saath spiralOrder implement karo. Ek 3x3, ek single row [[1,2,3]], ek single column [[1],[2],[3]], aur ek 3x4 par test karo. Phir do if-guards hatao aur wo input dhoondho jahaan ye values duplicate karta hai.',
        hint: 'The single-row and single-column cases are exactly where the guards matter: after the first two passes, top > bottom or left > right, and the unguarded third/fourth pass re-walks the same cells.',
        hintHi: 'Single-row aur single-column cases bilkul wahaan hain jahaan guards maayne rakhte hain: pehle do passes ke baad, top > bottom ya left > right, aur unguarded teesra/chautha pass usi cells ko dobara chalta hai.',
      },
      {
        task: 'Implement numIslands both recursively and with an explicit stack. Build a 200x200 grid that is entirely land and confirm the recursive version overflows the call stack while the iterative one does not.',
        taskHi: 'numIslands ko recursively aur ek explicit stack ke saath dono implement karo. Ek 200x200 grid banao jo poori tarah land hai aur confirm karo recursive version call stack overflow karta hai jabki iterative nahi.',
        hint: 'A 200x200 all-land grid is 40,000 cells, so the recursion depth reaches 40,000 — enough to overflow in most JS engines. Wrap it in a try/catch to observe the RangeError.',
        hintHi: 'Ek 200x200 all-land grid 40,000 cells hai, isliye recursion depth 40,000 tak pahunchti hai — adhikaansh JS engines mein overflow ke liye kaafi. RangeError dekhne ke liye ise ek try/catch mein wrap karo.',
      },
    ],

    keyTakeaways: [
      'Rotate a square matrix 90 degrees clockwise in O(1) extra space by transposing (mirror across the main diagonal) then reversing each row.',
      'In-place symmetric swaps must visit each pair ONCE — start the transpose inner loop at c = r + 1, or every pair is swapped twice and the matrix is unchanged.',
      'Spiral traversal: track four boundaries (top, bottom, left, right) and shrink one after each edge walk. Guard the bottom and left passes with "does this row/column still exist".',
      'A grid is a graph whose neighbours are COMPUTED, not stored: keep the direction deltas in a constant array and loop them, with the bounds check before every access.',
      'Flood fill (number of islands): the outer double loop starts a fill only at unvisited land, so each start is one connected component. Mutating the grid is a free visited marker if the input may be modified.',
      'A recursive flood fill recurses as deep as the largest region — use an explicit stack or a BFS queue on large grids to avoid a stack overflow.',
    ],
    keyTakeawaysHi: [
      'Ek square matrix ko O(1) extra space mein 90 degrees clockwise rotate karo transpose karke (main diagonal ke aar-paar mirror) phir har row reverse karke.',
      'In-place symmetric swaps ko har pair EK BAAR visit karna chahiye — transpose inner loop ko c = r + 1 par shuru karo, warna har pair do baar swap hota hai aur matrix na-badla rehta hai.',
      'Spiral traversal: chaar boundaries (top, bottom, left, right) track karo aur har edge walk ke baad ek shrink karo. Bottom aur left passes ko "kya ye row/column abhi bhi hai" se guard karo.',
      'Ek grid ek graph hai jiske neighbours COMPUTE hote hain, store nahi: direction deltas ko ek constant array mein rakho aur unhe loop karo, har access se pehle bounds check ke saath.',
      'Flood fill (number of islands): outer double loop ek fill sirf unvisited land par shuru karta hai, isliye har start ek connected component hai. Grid mutate karna ek muft visited marker hai agar input modify ho sakta hai.',
      'Ek recursive flood fill sabse bade region jitna gehra recurse karta hai — stack overflow bachne ke liye bade grids par ek explicit stack ya ek BFS queue istemal karo.',
    ],
  },
];
