/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 8.
 *
 * The two extensions of the prefix-sum idea from lesson 3:
 *   1. 2D prefix sums — answer "sum of any rectangle" in O(1) after an O(rows*cols)
 *      build, using inclusion-exclusion.
 *   2. Difference arrays — the MIRROR of prefix sums. Prefix sums make range
 *      QUERIES O(1) on a fixed array; difference arrays make range UPDATES O(1),
 *      then one prefix pass materialises the final array. Also the 2D form
 *      (the "corner trick" / imos method) for stamping rectangles.
 *
 * Broken example: applying q range-updates by looping over each range and
 * adding to every cell — O(q * n), which times out when both are 10^5; and
 * recomputing a submatrix sum by nested loops every query — O(q * rows * cols).
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts. Also scan for stray
 * Devanagari/Cyrillic look-alikes and RUN every code sample in node.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_2_PART8: CourseLesson[] = [
  {
    slug: 'two-d-prefix-sums-and-difference-arrays',
    title: '2D Prefix Sums and Difference Arrays',
    titleHi: '2D Prefix Sums Aur Difference Arrays',
    description: 'Answering "what is the sum inside this rectangle of the grid" by looping over every cell of the rectangle on each query, and applying a batch of "add v to every element from index l to r" updates by looping over each range. Both are correct and both blow up: 100,000 queries over a 1,000 by 1,000 grid is 100 billion cell reads.',
    descriptionHi: '"Grid ke is rectangle ke andar sum kya hai" ko har query par rectangle ki har cell par loop karke jawaab dena, aur "index l se r tak har element mein v jodo" updates ke ek batch ko har range par loop karke lagana. Dono sahi hain aur dono phat jaate hain: 1,000 by 1,000 grid par 100,000 queries 100 arab cell reads hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 8,

    analogy: {
      en: '**Two opposite bookkeeping habits for a shared expense ledger.** The first habit answers questions fast: at the end of every day you also write down the running grand total so far, so when someone asks "how much did we spend between the 3rd and the 17th" you subtract two totals and answer instantly, without re-adding a single line. That is a prefix sum. The second habit is for when the entries themselves keep changing in bulk: instead of walking into the ledger and editing every line from the 3rd to the 17th to add a correction, you write just two notes — "+50 starting on the 3rd" and "-50 starting on the 18th" — and leave the ledger untouched. Only once, at the very end, do you sweep through from the top, carrying a running adjustment, and stamp the real corrected number onto each line. Ten thousand bulk corrections cost ten thousand pairs of notes and then one final sweep, instead of ten thousand slow edits. The grid version of the fast-question habit adds up whole rectangles using four corner totals and a bit of add-and-subtract; the grid version of the bulk-correction habit stamps a rectangle by leaving four little notes at its corners and doing one two-directional sweep at the end.',
      hi: '**Ek shared expense ledger ke liye do ulti bookkeeping aadatein.** Pehli aadat sawaalon ka jawaab tez deti hai: har din ke ant mein aap ab tak ka running grand total bhi likh lete ho, isliye jab koi poochhta hai "humne 3 aur 17 ke beech kitna kharch kiya" aap do totals ghata dete ho aur turant jawaab dete ho, ek bhi line dobara jode bina. Wo ek prefix sum hai. Doosri aadat tab ke liye hai jab entries khud thok mein badalti rehti hain: ledger mein jaakar 3 se 17 tak har line ko ek correction jodne ke liye edit karne ke bajaye, aap sirf do note likhte ho — "3 se shuru +50" aur "18 se shuru -50" — aur ledger ko achhoota chhod dete ho. Sirf ek baar, bilkul ant mein, aap upar se sweep karte ho, ek running adjustment le jaate hue, aur har line par asli corrected number stamp karte ho. Das hazaar thok corrections das hazaar jodi note aur phir ek antim sweep kharch karti hain, das hazaar dheeme edits ke bajaye. Tez-sawaal aadat ka grid version poore rectangles ko chaar corner totals aur thode add-and-subtract se jodta hai; thok-correction aadat ka grid version ek rectangle ko iske corners par chaar chhote note chhodkar aur ant mein ek do-directional sweep karke stamp karta hai.',
    },

    simple: `**Start broken.** Recompute rectangle sums per query; apply range updates one cell at a time:

\`\`\`js
// submatrix sum: nested loop over the rectangle, every query
function rectSumBrute(grid, r1, c1, r2, c2) {
  let s = 0;
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++) s += grid[r][c];
  return s;                       // O((r2-r1) * (c2-c1)) PER QUERY
}

// range updates: add v to arr[l..r], one element at a time, for every update
function applyUpdatesBrute(n, updates) {
  const arr = new Array(n).fill(0);
  for (const [l, r, v] of updates)
    for (let i = l; i <= r; i++) arr[i] += v;    // O(n) PER UPDATE
  return arr;
}
\`\`\`

With 10^5 queries on a 10^3 x 10^3 grid, the first is 10^11 operations. With 10^5 range updates on a 10^5 array, the second is 10^10. Both time out.

**The fix (queries): a 2D prefix table, then inclusion-exclusion**

\`\`\`js
function buildPrefix2D(grid) {
  const R = grid.length, C = grid[0].length;
  const P = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      P[r + 1][c + 1] = grid[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
  return P;
}

// sum of grid[r1..r2][c1..c2], inclusive, in O(1)
function rectSum(P, r1, c1, r2, c2) {
  return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
}
\`\`\`

**The fix (updates): a difference array, then one prefix pass**

\`\`\`js
function applyUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;                 // start adding v at l
    diff[r + 1] -= v;             // stop adding v after r
  }
  const arr = new Array(n).fill(0);
  arr[0] = diff[0];
  for (let i = 1; i < n; i++) arr[i] = arr[i - 1] + diff[i];   // prefix pass
  return arr;
}

console.log(applyUpdates(5, [[1, 3, 2], [2, 4, 3], [0, 0, -1]]));
// [-1, 2, 5, 5, 3]
\`\`\`

\`\`\`ts
function applyUpdates(n: number, updates: number[][]): number[] {
  const diff = new Array<number>(n + 1).fill(0);
  for (const [l, r, v] of updates) { diff[l!] += v!; diff[r! + 1] -= v!; }
  const arr = new Array<number>(n).fill(0);
  arr[0] = diff[0]!;
  for (let i = 1; i < n; i++) arr[i] = arr[i - 1]! + diff[i]!;
  return arr;
}
\`\`\`

Prefix sums and difference arrays are inverse operations. A prefix sum turns \`[a, b, c]\` into running totals; a difference array turns it back into \`[a, b-a, c-b]\`. Because \`prefix(diff(x)) === x\`, you can record every range update as two point-changes on \`diff\`, then run one prefix pass to get the fully-updated array. O(q + n) instead of O(q * n).`,

    simpleHi: `**Toote hue se shuru.** Prati query rectangle sums dobara compute karo; range updates ek cell ek baar mein lagao:

\`\`\`js
// submatrix sum: rectangle par nested loop, har query
function rectSumBrute(grid, r1, c1, r2, c2) {
  let s = 0;
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++) s += grid[r][c];
  return s;                       // PRATI QUERY O((r2-r1) * (c2-c1))
}

// range updates: arr[l..r] mein v jodo, ek element ek baar mein, har update ke liye
function applyUpdatesBrute(n, updates) {
  const arr = new Array(n).fill(0);
  for (const [l, r, v] of updates)
    for (let i = l; i <= r; i++) arr[i] += v;    // PRATI UPDATE O(n)
  return arr;
}
\`\`\`

10^3 x 10^3 grid par 10^5 queries ke saath, pehla 10^11 operations hai. 10^5 array par 10^5 range updates ke saath, doosra 10^10 hai. Dono time out.

**Fix (queries): ek 2D prefix table, phir inclusion-exclusion**

\`\`\`js
function buildPrefix2D(grid) {
  const R = grid.length, C = grid[0].length;
  const P = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      P[r + 1][c + 1] = grid[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
  return P;
}

// grid[r1..r2][c1..c2] ka sum, inclusive, O(1) mein
function rectSum(P, r1, c1, r2, c2) {
  return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
}
\`\`\`

**Fix (updates): ek difference array, phir ek prefix pass**

\`\`\`js
function applyUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;                 // l par v jodna shuru karo
    diff[r + 1] -= v;             // r ke baad v jodna band karo
  }
  const arr = new Array(n).fill(0);
  arr[0] = diff[0];
  for (let i = 1; i < n; i++) arr[i] = arr[i - 1] + diff[i];   // prefix pass
  return arr;
}

console.log(applyUpdates(5, [[1, 3, 2], [2, 4, 3], [0, 0, -1]]));
// [-1, 2, 5, 5, 3]
\`\`\`

\`\`\`ts
function applyUpdates(n: number, updates: number[][]): number[] {
  const diff = new Array<number>(n + 1).fill(0);
  for (const [l, r, v] of updates) { diff[l!] += v!; diff[r! + 1] -= v!; }
  const arr = new Array<number>(n).fill(0);
  arr[0] = diff[0]!;
  for (let i = 1; i < n; i++) arr[i] = arr[i - 1]! + diff[i]!;
  return arr;
}
\`\`\`

Prefix sums aur difference arrays ulte operations hain. Ek prefix sum \`[a, b, c]\` ko running totals mein badalta hai; ek difference array ise wapas \`[a, b-a, c-b]\` mein badalta hai. Kyunki \`prefix(diff(x)) === x\`, aap har range update ko \`diff\` par do point-changes ki tarah record kar sakte ho, phir ek prefix pass chalakar poori-updated array paa sakte ho. O(q * n) ke bajaye O(q + n).`,

    content: `## 2D prefix sums: the inclusion-exclusion picture

\`\`\`
P[r][c] = sum of everything in the rectangle from (0,0) to (r-1, c-1).

BUILD each cell from three already-computed neighbours:
  P[r+1][c+1] = grid[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]
                            (above)      (left)       (double-counted overlap)

QUERY the rectangle (r1,c1)..(r2,c2) inclusive:

     c1        c2
  +----+---------+
  | A  |    B    |   r1        want = full - top - left + top-left-corner
  +----+---------+                  = P[r2+1][c2+1]
  | C  |  WANT   |   r2              - P[r1][c2+1]      (strip B, above)
  +----+---------+                  - P[r2+1][c1]      (strip C, to the left)
                                    + P[r1][c1]        (A was subtracted twice)
\`\`\`

Both build and query use the same idea: a rectangle is a big rectangle minus two overlapping strips plus the corner that got removed twice. The +1 padding row and column (so \`P\` is \`(R+1) x (C+1)\`) removes every \`r == 0\` / \`c == 0\` special case.

## Difference arrays: range-add in O(1), the mirror of prefix sums

\`\`\`
prefix sum:      given a fixed array, answer "sum of arr[l..r]" in O(1)
difference array: given range-add updates, produce the final array in O(n)

diff is defined so that arr[i] = diff[0] + diff[1] + ... + diff[i]
  => to add v to arr[l..r], you only need:
       diff[l]   += v      (from l onward, the running sum is v higher)
       diff[r+1] -= v      (from r+1 onward, cancel it back out)

After ALL updates are recorded, one prefix pass over diff rebuilds arr.
\`\`\`

This is the single most common "why is my solution O(q*n)" fix in range problems. If the queries are "add to a range" and you only need the array *after* all of them, never use a loop per update.

## 2D difference array: stamp a rectangle with four corner marks

\`\`\`js
// add v to every cell of the rectangle (r1,c1)..(r2,c2), for many rectangles
function stampRectangles(R, C, rects) {
  const d = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (const [r1, c1, r2, c2, v] of rects) {
    d[r1][c1]     += v;
    d[r1][c2 + 1] -= v;
    d[r2 + 1][c1] -= v;
    d[r2 + 1][c2 + 1] += v;          // the corner cancelled twice, add it back
  }
  // 2D prefix pass turns the marks into the actual grid
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (r > 0) d[r][c] += d[r - 1][c];
      if (c > 0) d[r][c] += d[r][c - 1];
      if (r > 0 && c > 0) d[r][c] -= d[r - 1][c - 1];
    }
  return d.slice(0, R).map((row) => row.slice(0, C));
}
\`\`\`

The four marks are the same inclusion-exclusion pattern as the 2D query, run in reverse: you leave a \`+v\` and \`-v\` at the corners of the region, and the prefix pass spreads them into a solid filled rectangle.

## Which tool for which question

\`\`\`
fixed array, many "sum of a range" queries           1D prefix sum      (lesson 3)
fixed grid, many "sum of a rectangle" queries         2D prefix sum
many "add v to a range", read the array ONCE at end   1D difference array
many "add v to a rectangle", read grid ONCE at end    2D difference array
array CHANGES between queries (point update + range q) Fenwick / segtree (M2 L6)
count of values in a range, offline                   difference array on value-space

Interview tell: "you are given a list of updates/bookings/reservations, then
asked about the final state" -> difference array. "you are asked repeated
range-sum questions on data that does not change" -> prefix sum.
\`\`\``,

    contentHi: `## 2D prefix sums: inclusion-exclusion ki tasveer

\`\`\`
P[r][c] = (0,0) se (r-1, c-1) tak ke rectangle mein sab kuch ka sum.

Har cell ko teen pehle-se-compute padosiyon se BUILD karo:
  P[r+1][c+1] = grid[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]
                            (upar)       (baayen)      (dugna-gina overlap)

Rectangle (r1,c1)..(r2,c2) inclusive QUERY karo:

     c1        c2
  +----+---------+
  | A  |    B    |   r1        chahiye = poora - upar - baayen + upar-baayen-corner
  +----+---------+                     = P[r2+1][c2+1]
  | C  |  WANT   |   r2                 - P[r1][c2+1]      (strip B, upar)
  +----+---------+                      - P[r2+1][c1]      (strip C, baayen)
                                        + P[r1][c1]        (A do baar ghata)
\`\`\`

Build aur query dono wahi idea istemal karte hain: ek rectangle ek bada rectangle minus do overlapping strips plus wo corner hai jo do baar hataaya gaya. +1 padding row aur column (taaki \`P\` \`(R+1) x (C+1)\` ho) har \`r == 0\` / \`c == 0\` special case hataa deta hai.

## Difference arrays: O(1) mein range-add, prefix sums ka darpan

\`\`\`
prefix sum:      ek fixed array diye, "arr[l..r] ka sum" O(1) mein jawaab do
difference array: range-add updates diye, final array O(n) mein banao

diff aise paribhaashit hai ki arr[i] = diff[0] + diff[1] + ... + diff[i]
  => arr[l..r] mein v jodne ko, aapko sirf chahiye:
       diff[l]   += v      (l se aage, running sum v zyaada hai)
       diff[r+1] -= v      (r+1 se aage, ise wapas cancel karo)

SAB updates record hone ke BAAD, diff par ek prefix pass arr dobara banaata hai.
\`\`\`

Ye range problems mein "mera solution O(q*n) kyun hai" ka sabse aam fix hai. Agar queries "ek range mein jodo" hain aur aapko array sirf un sab ke *baad* chahiye, kabhi prati update ek loop mat istemal karo.

## 2D difference array: chaar corner marks se ek rectangle stamp karo

\`\`\`js
// rectangle (r1,c1)..(r2,c2) ki har cell mein v jodo, kayi rectangles ke liye
function stampRectangles(R, C, rects) {
  const d = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (const [r1, c1, r2, c2, v] of rects) {
    d[r1][c1]     += v;
    d[r1][c2 + 1] -= v;
    d[r2 + 1][c1] -= v;
    d[r2 + 1][c2 + 1] += v;          // corner do baar cancel hua, wapas jodo
  }
  // 2D prefix pass marks ko asli grid mein badalta hai
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (r > 0) d[r][c] += d[r - 1][c];
      if (c > 0) d[r][c] += d[r][c - 1];
      if (r > 0 && c > 0) d[r][c] -= d[r - 1][c - 1];
    }
  return d.slice(0, R).map((row) => row.slice(0, C));
}
\`\`\`

Chaar marks wahi inclusion-exclusion pattern hain jo 2D query hai, ulta chalaaya gaya: aap region ke corners par ek \`+v\` aur \`-v\` chhodte ho, aur prefix pass unhe ek thos bhare rectangle mein failaata hai.

## Kaunse sawaal ke liye kaunsa tool

\`\`\`
fixed array, kayi "ek range ka sum" queries              1D prefix sum      (lesson 3)
fixed grid, kayi "ek rectangle ka sum" queries            2D prefix sum
kayi "ek range mein v jodo", array ant mein EK BAAR padho  1D difference array
kayi "ek rectangle mein v jodo", grid ant mein EK BAAR     2D difference array
array queries ke beech BADALTA hai (point update + range)  Fenwick / segtree (M2 L6)
ek range mein values ki ginti, offline                     value-space par difference array

Interview sanket: "aapko updates/bookings/reservations ki ek list di jaati hai,
phir final state ke baare mein poochha jaata hai" -> difference array. "aapse
badalte-na-waale data par baar-baar range-sum sawaal poochhe jaate hain" -> prefix sum.
\`\`\``,

    examples: [
      {
        title: 'Broken: nested loop per submatrix query',
        titleHi: 'Toota: prati submatrix query nested loop',
        code: `for (let r = r1; r <= r2; r++)
  for (let c = c1; c <= c2; c++) s += grid[r][c];   // O(area) per query`,
        codeJs: `function rectSumBrute(grid, r1, c1, r2, c2) {
  let s = 0;
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++) s += grid[r][c];
  return s;
}
const grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
let reads = 0;
function counted(grid, r1, c1, r2, c2) { for (let r=r1;r<=r2;r++) for (let c=c1;c<=c2;c++) reads++; return rectSumBrute(grid,r1,c1,r2,c2); }
console.log(counted(grid, 0, 0, 2, 2), counted(grid, 1, 1, 2, 2), counted(grid, 0, 1, 1, 2));
console.log('cell reads for 3 queries:', reads);`,
        codeTs: `function rectSumBrute(grid: number[][], r1: number, c1: number, r2: number, c2: number): number {
  let s = 0;
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++) s += grid[r]![c]!;
  return s;
}`,
        outputJs: `45 28 16
cell reads for 3 queries: 17`,
        outputTs: `// Correct sums, but every query re-reads its whole rectangle.`,
        explain: 'Three small queries already touch 17 cells. Scale the grid to 1000x1000 and run 100,000 queries and the reads run into the hundreds of billions — the sums are right, the approach is unusable.',
        explainHi: 'Teen chhoti queries pehle se 17 cells chhoo leti hain. Grid ko 1000x1000 tak scale karo aur 100,000 queries chalao aur reads sau arab tak pahunch jaate hain — sums sahi hain, approach istemal ke laayak nahi.',
      },
      {
        title: 'Fixed: 2D prefix table, O(1) rectangle sums',
        titleHi: 'Theek: 2D prefix table, O(1) rectangle sums',
        code: `P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]   // inclusion-exclusion`,
        codeJs: `function buildPrefix2D(grid) {
  const R = grid.length, C = grid[0].length;
  const P = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      P[r + 1][c + 1] = grid[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
  return P;
}
function rectSum(P, r1, c1, r2, c2) {
  return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
}
const grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const P = buildPrefix2D(grid);
console.log(rectSum(P, 0, 0, 2, 2));   // 45
console.log(rectSum(P, 1, 1, 2, 2));   // 28
console.log(rectSum(P, 0, 1, 1, 2));   // 16`,
        codeTs: `function buildPrefix2D(grid: number[][]): number[][] {
  const R = grid.length, C = grid[0]!.length;
  const P = Array.from({ length: R + 1 }, () => new Array<number>(C + 1).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      P[r + 1]![c + 1] = grid[r]![c]! + P[r]![c + 1]! + P[r + 1]![c]! - P[r]![c]!;
  return P;
}`,
        outputJs: `45
28
16`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Build is O(R*C) once. After that every rectangle sum is four array reads and three arithmetic ops, regardless of the rectangle\'s size. The padding row/column of zeros is what lets r1 or c1 be 0 without a special case.',
        explainHi: 'Build ek baar O(R*C) hai. Uske baad har rectangle sum chaar array reads aur teen arithmetic ops hai, rectangle ki size chahe kuch bhi ho. Zeros ki padding row/column wo hai jo r1 ya c1 ko bina special case ke 0 hone deta hai.',
      },
      {
        title: 'Difference array: q range-adds in O(q + n)',
        titleHi: 'Difference array: O(q + n) mein q range-adds',
        code: `diff[l] += v; diff[r + 1] -= v;   // record
for (i) arr[i] = arr[i-1] + diff[i];  // one pass materialises it`,
        codeJs: `function applyUpdates(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, v] of updates) { diff[l] += v; diff[r + 1] -= v; }
  const arr = new Array(n).fill(0);
  arr[0] = diff[0];
  for (let i = 1; i < n; i++) arr[i] = arr[i - 1] + diff[i];
  return arr;
}
console.log(applyUpdates(5, [[1, 3, 2], [2, 4, 3], [0, 0, -1]]));
// flight-booking style: [[1,2,10],[2,3,20],[2,5,25]] over n=5
console.log(applyUpdates(5, [[0, 1, 10], [1, 2, 20], [1, 4, 25]]));`,
        codeTs: `function applyUpdates(n: number, updates: number[][]): number[] {
  const diff = new Array<number>(n + 1).fill(0);
  for (const [l, r, v] of updates) { diff[l!] += v!; diff[r! + 1] -= v!; }
  const arr = new Array<number>(n).fill(0);
  arr[0] = diff[0]!;
  for (let i = 1; i < n; i++) arr[i] = arr[i - 1]! + diff[i]!;
  return arr;
}`,
        outputJs: `[ -1, 2, 5, 5, 3 ]
[ 10, 55, 45, 25, 25 ]`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Each update is two writes to diff regardless of how wide the range is. The single prefix pass at the end turns the "start adding here / stop adding here" marks into the final values. The n+1 size gives diff[r+1] a valid slot when r is the last index.',
        explainHi: 'Har update diff par do writes hai chahe range kitni bhi chaudi ho. Ant mein ek prefix pass "yahaan jodna shuru / yahaan jodna band" marks ko final values mein badal deta hai. n+1 size diff[r+1] ko ek valid slot deta hai jab r aakhri index ho.',
      },
    ],

    mistakes: [
      {
        wrong: `// difference array without the +1 slot
const diff = new Array(n).fill(0);
diff[l] += v;
diff[r + 1] -= v;      // when r === n-1, this writes diff[n] -> out of bounds / silently ignored`,
        right: `const diff = new Array(n + 1).fill(0);   // one extra slot for the r === n-1 case
diff[l] += v;
diff[r + 1] -= v;`,
        why: 'A range ending at the last index needs to cancel its contribution at r+1 = n, one past the end. Size the diff array to n+1 so that write lands somewhere real. Without it, the last few elements keep an uncancelled +v and come out too large.',
        whyHi: 'Aakhri index par khatam hone waali ek range ko apna yogdaan r+1 = n par cancel karna hota hai, end se ek aage. diff array ko n+1 size do taaki wo write kahin asli jagah lande. Iske bina, aakhri kuch elements ek un-cancelled +v rakhte hain aur bahut bade nikalte hain.',
      },
      {
        wrong: `// 2D prefix query forgetting to add back the corner
return P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1];   // missing + P[r1][c1]`,
        right: `return P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1];`,
        why: 'The top strip and the left strip overlap in the top-left corner region, so subtracting both removes that corner twice. Adding P[r1][c1] back once restores it. This is the same inclusion-exclusion correction the build step uses — miss it and every query that is not flush against an edge is wrong.',
        whyHi: 'Top strip aur left strip top-left corner region mein overlap karte hain, isliye dono ghataana us corner ko do baar hataata hai. P[r1][c1] ek baar wapas jodna use bahaal karta hai. Ye wahi inclusion-exclusion correction hai jo build step istemal karta hai — ise chhoodo aur har query jo ek edge ke against flush nahi hai wo galat hai.',
      },
      {
        wrong: `// using a difference array when queries interleave with updates
diff[l] += v; diff[r+1] -= v;
// ...then a query asks for the current value of arr[k] before all updates are in`,
        right: `// if reads and writes interleave, use a Fenwick tree / segment tree (Module 2 lesson 6)
// difference arrays only work when ALL updates come first, then you read once`,
        why: 'A difference array is not a live data structure — it only holds "pending" marks until the single prefix pass materialises them. If a query needs the true value mid-stream, the marks have not been spread yet. Interleaved update-and-query is exactly what Fenwick trees are for.',
        whyHi: 'Ek difference array ek live data structure nahi hai — ye sirf "pending" marks rakhta hai jab tak ek prefix pass unhe materialise na kare. Agar ek query ko beech-dhaara mein asli value chahiye, marks abhi failaaye nahi gaye. Interleaved update-and-query bilkul wo hai jiske liye Fenwick trees hain.',
      },
    ],

    realWorld: [
      {
        en: '**Image processing** uses the 2D prefix sum (the "integral image" or "summed-area table") to compute the average brightness of any rectangular region in constant time — the core primitive behind box blur and the Viola-Jones face detector.',
        hi: '**Image processing** kisi bhi rectangular region ki average brightness ko constant time mein compute karne ke liye 2D prefix sum ("integral image" ya "summed-area table") istemal karta hai — box blur aur Viola-Jones face detector ke peechhe ka core primitive.',
      },
      {
        en: '**Booking and reservation systems** — flight seat counts, hotel room inventory over date ranges — apply hundreds of thousands of "reserve N units from day A to day B" as difference-array marks, then one pass gives the load on every day.',
        hi: '**Booking aur reservation systems** — flight seat counts, date ranges par hotel room inventory — laakhon "din A se din B tak N units reserve karo" ko difference-array marks ki tarah lagaate hain, phir ek pass har din par load deta hai.',
      },
      {
        en: '**Map and heatmap tiling** stamps many overlapping rectangular contributions (coverage areas, signal strength) with 2D difference marks and one prefix pass, instead of painting each rectangle cell by cell.',
        hi: '**Map aur heatmap tiling** kayi overlapping rectangular contributions (coverage areas, signal strength) ko 2D difference marks aur ek prefix pass se stamp karta hai, har rectangle ko cell dar cell paint karne ke bajaye.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the relationship between a prefix sum and a difference array, and when you would reach for each.',
        qHi: 'Ek prefix sum aur ek difference array ke beech ka rishta samjhaao, aur aap har ek ke liye kab pahunchoge.',
        a: 'They are inverse transformations of an array. The prefix sum of an array replaces each position with the sum of everything up to and including it, so it turns increments into running totals. The difference array does the opposite: it replaces each position with how much it changed from the position before, so the first element stays and every other element becomes itself minus its predecessor. Applying one and then the other gets you back to the original array, which is the key fact that makes the technique work. You reach for a prefix sum when the array is fixed and you get many questions of the form "what is the sum of the elements between index l and index r". You build the prefix sum once in linear time, and then each such query is a single subtraction of two prefix values, constant time. You reach for a difference array in the mirror-image situation: the queries are updates of the form "add some value v to every element between l and r", there are many of them, and you only need to see the final array once all the updates are applied. Instead of looping over each range, which is linear per update, you record each update as just two edits to the difference array — add v at l, subtract v at r plus one — which is constant per update. After all updates are recorded, a single prefix-sum pass over the difference array reconstructs the fully updated array. So the total cost drops from the number of updates times the array length down to the number of updates plus the array length. The decision rule in an interview: if the data does not change and you are asked range-sum questions, prefix sum; if you are given a batch of range updates and asked about the end state, difference array; if reads and writes are interleaved so you need the true value in the middle of the update stream, neither — that is a Fenwick tree or segment tree.',
        aHi: 'Wo ek array ke ulte transformations hain. Ek array ka prefix sum har position ko usse aur us sameet sab kuch ke sum se badal deta hai, isliye ye increments ko running totals mein badalta hai. Difference array ulta karta hai: ye har position ko ismein aur usse pehle waali position se kitna badla usse badal deta hai, isliye pehla element rehta hai aur har doosra element khud minus apna poorvavarti ban jaata hai. Ek lagana aur phir doosra aapko wapas mool array par le aata hai, jo mukhya tathya hai jo technique ko kaam karwaata hai. Aap ek prefix sum ke liye tab pahunchte ho jab array fixed hai aur aapko "index l aur index r ke beech elements ka sum kya hai" roop ke kayi sawaal milte hain. Aap prefix sum ek baar linear time mein banate ho, aur phir har aisi query do prefix values ka ek akela subtraction hai, constant time. Aap ek difference array ke liye darpan-chhavi sthiti mein pahunchte ho: queries "l aur r ke beech har element mein koi value v jodo" roop ke updates hain, unmein se kayi hain, aur aapko final array sirf ek baar chahiye jab sab updates lag jaayein. Har range par loop karne ke bajaye, jo prati update linear hai, aap har update ko difference array par sirf do edits ki tarah record karte ho — l par v jodo, r plus ek par v ghatao — jo prati update constant hai. Sab updates record hone ke baad, difference array par ek akela prefix-sum pass poori-updated array dobara banaata hai.',
      },
      {
        q: 'Derive the 2D prefix-sum query formula and explain why there is a +1 padding row and column.',
        qHi: '2D prefix-sum query formula nikaalo aur samjhaao ki ek +1 padding row aur column kyun hai.',
        a: 'Define P at row r and column c to be the sum of all grid cells strictly above row r and strictly left of column c — that is, the sum of the rectangle from the top-left corner up to but not including row r and column c. Now I want the sum of a query rectangle whose top-left cell is at row r1, column c1 and whose bottom-right cell is at row r2, column c2, inclusive. Picture the big rectangle from the origin down to just past row r2 and column c2; its total is P at r2 plus 1, c2 plus 1. From that I need to remove the horizontal strip above my query rectangle, which is P at r1, c2 plus 1, and the vertical strip to the left of it, which is P at r2 plus 1, c1. But those two strips overlap in the small rectangle that is both above and to the left of my query region, so I have subtracted that overlap twice. I add it back once: P at r1, c1. So the query is P[r2+1][c2+1] minus P[r1][c2+1] minus P[r2+1][c1] plus P[r1][c1]. The build step uses the same inclusion-exclusion in the other direction: each P cell is its grid value plus the cell above plus the cell to the left minus the diagonal cell that both of those include. As for the padding: without it, the query formula references P at r1 and c1, and when the query rectangle is flush against the top or left edge, r1 or c1 is zero, so you would be indexing P at negative one. By defining P to have an extra row 0 and column 0 that are all zeros, and shifting every real cell down and right by one, those edge cases just read a legitimate zero instead of needing a branch. It makes the code a single clean expression with no special handling for the first row or column.',
        aHi: 'P ko row r aur column c par paribhaashit karo ki wo row r ke sakht upar aur column c ke sakht baayen sab grid cells ka sum hai — matlab, top-left corner se row r aur column c tak par unhe shaamil kiye bina rectangle ka sum. Ab main ek query rectangle ka sum chahta hoon jiska top-left cell row r1, column c1 par hai aur jiska bottom-right cell row r2, column c2 par hai, inclusive. Origin se bilkul row r2 aur column c2 se aage tak ke bade rectangle ki kalpana karo; iska total P at r2 plus 1, c2 plus 1 hai. Usmein se mujhe apne query rectangle ke upar ki horizontal strip hataani hai, jo P at r1, c2 plus 1 hai, aur iske baayen ki vertical strip, jo P at r2 plus 1, c1 hai. Par wo do strips us chhote rectangle mein overlap karti hain jo mere query region ke upar aur baayen dono hai, isliye maine wo overlap do baar ghataaya. Main ise ek baar wapas jodta hoon: P at r1, c1. Toh query P[r2+1][c2+1] minus P[r1][c2+1] minus P[r2+1][c1] plus P[r1][c1] hai. Padding ke baare mein: iske bina, query formula P ko r1 aur c1 par reference karta hai, aur jab query rectangle top ya left edge ke against flush hai, r1 ya c1 zero hai, isliye aap P ko minus ek par index karte. P ko ek atirikt row 0 aur column 0 dekar jo sab zeros hain, aur har asli cell ko ek se neeche aur daayen shift karke, wo edge cases bas ek jaayaz zero padhte hain ek branch ki zaroorat ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Implement buildPrefix2D and rectSum. Verify on [[1,2,3],[4,5,6],[7,8,9]]: whole grid -> 45, bottom-right 2x2 -> 28, top row -> 6. Then remove the "+ P[r1][c1]" term and find a query that becomes wrong (any rectangle not touching the top or left edge).',
        taskHi: 'buildPrefix2D aur rectSum implement karo. [[1,2,3],[4,5,6],[7,8,9]] par verify karo: poora grid -> 45, bottom-right 2x2 -> 28, top row -> 6. Phir "+ P[r1][c1]" term hataao aur ek query dhoondho jo galat ho jaati hai (koi bhi rectangle jo top ya left edge nahi chhoota).',
        hint: 'rectSum(P, 1, 1, 2, 2) should be 28 (5+6+8+9). Without the corner term you get 28 - P[1][1] = 28 - 1 = 27. Rectangles flush against row 0 or column 0 stay correct because P[r1][c1] is zero there anyway.',
        hintHi: 'rectSum(P, 1, 1, 2, 2) 28 hona chahiye (5+6+8+9). Corner term ke bina aapko 28 - P[1][1] = 28 - 1 = 27 milta hai. Row 0 ya column 0 ke against flush rectangles sahi rehte hain kyunki P[r1][c1] wahaan waise bhi zero hai.',
      },
      {
        task: 'Implement applyUpdates with the difference array. Verify applyUpdates(5, [[1,3,2],[2,4,3],[0,0,-1]]) -> [-1,2,5,5,3]. Then shrink diff to size n (drop the +1) and run an update whose range ends at index n-1; observe the last element come out too large.',
        taskHi: 'applyUpdates ko difference array se implement karo. Verify karo applyUpdates(5, [[1,3,2],[2,4,3],[0,0,-1]]) -> [-1,2,5,5,3]. Phir diff ko size n tak chhota karo (+1 hataao) aur ek aisa update chalao jiski range index n-1 par khatam hoti hai; aakhri element bahut bada nikalte dekho.',
        hint: 'Update [2, 4, 3] on n=5 needs diff[5] -= 3. If diff has length 5, that write is either an error or silently creates index 5 without it feeding the prefix pass, so arr[4] keeps the +3 that was never cancelled.',
        hintHi: 'n=5 par update [2, 4, 3] ko diff[5] -= 3 chahiye. Agar diff ki length 5 hai, wo write ya toh ek error hai ya chupchaap index 5 banaata hai bina use prefix pass mein feed kiye, isliye arr[4] wo +3 rakhta hai jo kabhi cancel nahi hua.',
      },
      {
        task: 'Implement stampRectangles (2D difference array). On a 4x4 zero grid, stamp [0,0,1,1,+5] and [1,1,3,3,+2], then verify cell [1][1] is 7, cell [0][0] is 5, cell [3][3] is 2, and cell [2][0] is 0.',
        taskHi: 'stampRectangles (2D difference array) implement karo. Ek 4x4 zero grid par, [0,0,1,1,+5] aur [1,1,3,3,+2] stamp karo, phir verify karo ki cell [1][1] 7 hai, cell [0][0] 5 hai, cell [3][3] 2 hai, aur cell [2][0] 0 hai.',
        hint: 'Cell [1][1] is inside both rectangles, so 5 + 2 = 7. The four corner marks per rectangle plus the 2D prefix pass spread each +v into a solid block; overlaps just add.',
        hintHi: 'Cell [1][1] dono rectangles ke andar hai, isliye 5 + 2 = 7. Prati rectangle chaar corner marks plus 2D prefix pass har +v ko ek thos block mein failaate hain; overlaps bas jud jaate hain.',
      },
    ],

    keyTakeaways: [
      '2D prefix sum: P[r+1][c+1] = grid[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]. Build once in O(R*C), then any rectangle sum is O(1).',
      'Rectangle query: P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]. The last term adds back the corner subtracted by both strips (inclusion-exclusion).',
      'The +1 padding row and column of zeros removes every r==0 / c==0 special case from both build and query.',
      'A difference array is the inverse of a prefix sum: prefix(diff(x)) === x. It makes range-ADD updates O(1) each, then one prefix pass materialises the final array — O(q + n) instead of O(q * n).',
      'To add v to arr[l..r]: diff[l] += v and diff[r+1] -= v. Size diff to n+1 so the r == n-1 case has a real slot to write.',
      '2D difference array stamps a rectangle with four corner marks (+v, -v, -v, +v) then a 2D prefix pass — the query formula run in reverse.',
      'Difference arrays only work when ALL updates come first and you read the array once. If reads and writes interleave, use a Fenwick tree / segment tree (Module 2 lesson 6).',
    ],
    keyTakeawaysHi: [
      '2D prefix sum: P[r+1][c+1] = grid[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]. Ek baar O(R*C) mein build karo, phir koi bhi rectangle sum O(1) hai.',
      'Rectangle query: P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]. Aakhri term wo corner wapas jodta hai jo dono strips ne ghataaya (inclusion-exclusion).',
      'Zeros ki +1 padding row aur column build aur query dono se har r==0 / c==0 special case hataa deti hai.',
      'Ek difference array ek prefix sum ka inverse hai: prefix(diff(x)) === x. Ye range-ADD updates ko har ek O(1) banaata hai, phir ek prefix pass final array ko materialise karta hai — O(q * n) ke bajaye O(q + n).',
      'arr[l..r] mein v jodne ko: diff[l] += v aur diff[r+1] -= v. diff ko n+1 size do taaki r == n-1 case ke paas likhne ko ek asli slot ho.',
      '2D difference array ek rectangle ko chaar corner marks (+v, -v, -v, +v) phir ek 2D prefix pass se stamp karta hai — query formula ulta chalaaya gaya.',
      'Difference arrays sirf tab kaam karte hain jab SAB updates pehle aayein aur aap array ek baar padho. Agar reads aur writes interleave karein, ek Fenwick tree / segment tree istemal karo (Module 2 lesson 6).',
    ],
  },
];
