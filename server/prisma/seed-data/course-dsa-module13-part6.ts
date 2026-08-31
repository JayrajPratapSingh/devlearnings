/**
 * DSA Complete Course — Module 13: Bit Manipulation & Math Essentials, lesson 6.
 *
 * Counting: the combinatorics an interview actually asks for. Module 6 taught
 * how to GENERATE permutations and combinations; this lesson is about COUNTING
 * them without generating — n! , nCr, Pascal's triangle, the "grid paths =
 * C(m+n, n)" identity, the Catalan numbers (unique BSTs, balanced-parens
 * count, distinct full binary trees, polygon triangulations), and stars and
 * bars for "how many ways to split k identical items into n groups". Builds
 * directly on lesson 5's modular inverse — every "return the count modulo
 * 1e9+7" problem needs nCr mod p.
 *
 * Broken example: computing nCr as factorial(n) / (factorial(r) * factorial(n-r))
 * with plain numbers. factorial(21) already exceeds Number.MAX_SAFE_INTEGER,
 * so the division operates on rounded garbage and the "count" is wrong for any
 * n above about 20 — long before the answer itself would overflow.
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

export const DSA_MODULE_13_PART6: CourseLesson[] = [
  {
    slug: 'counting-combinatorics-pascal-catalan',
    title: 'Counting: Combinations, Pascal, and the Catalan Numbers',
    titleHi: 'Ginti: Combinations, Pascal, Aur Catalan Numbers',
    description: 'Computing "n choose r" the way the formula is written — n factorial divided by r factorial times (n minus r) factorial — using ordinary numbers. It is correct on paper, but 21 factorial is already larger than the largest integer JavaScript can hold exactly, so for any n past about 20 the three factorials are rounded before the division and the count comes out wrong, even when the true answer would fit comfortably.',
    descriptionHi: '"n choose r" ko waise compute karna jaise formula likha hai — n factorial divided by r factorial guna (n minus r) factorial — saamaanya numbers istemal karke. Ye kaagaz par sahi hai, par 21 factorial pehle se sabse bade integer se bada hai jise JavaScript bilkul rakh sakta hai, isliye lagbhag 20 se aage kisi bhi n ke liye teen factorials division se pehle round ho jaate hain aur count galat nikalta hai, tab bhi jab asli jawaab aaraam se fit hota.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Working out how many different five-card hands a deck can produce, and choosing between two ways to do the arithmetic.** The textbook way multiplies 52 by 51 by 50 by 49 by 48, then divides by 5 by 4 by 3 by 2 by 1. If you insist on finishing the top multiplication completely before touching the division, the intermediate number gets enormous fast — and if your calculator can only display so many digits, it silently rounds, and everything after that is a guess. The careful way alternates: multiply by 52, divide by 1, multiply by 51, divide by 2, and so on, keeping the running value small at every step. This works because the running value is always a valid "how many hands of this size" count, which is a whole number, so each division comes out exact. A different question — "how many ways can I arrange n pairs of brackets so they are properly nested" — turns out to have its own famous sequence of answers, the same sequence that counts the shapes of a binary tree with n nodes and the ways to cut a polygon into triangles. Recognising that a counting problem is one of these named sequences means you look up a one-line formula instead of building a recursion.',
      hi: '**Ye nikaalna ki ek deck kitne alag paanch-card haath bana sakta hai, aur arithmetic karne ke do tarikon ke beech chunna.** Textbook tarika 52 ko 51 se 50 se 49 se 48 se guna karta hai, phir 5 se 4 se 3 se 2 se 1 se bhaag karta hai. Agar aap division ko chhoone se pehle top multiplication ko poori tarah khatam karne par ada rehte ho, beech ka number tezi se vishaal ho jaata hai — aur agar aapka calculator sirf itne ank dikha sakta hai, ye chupchaap round karta hai, aur uske baad sab kuch ek anumaan hai. Saavdhaan tarika alternate karta hai: 52 se guna, 1 se bhaag, 51 se guna, 2 se bhaag, aur aage, har step par running value ko chhota rakhte hue. Ye kaam karta hai kyunki running value hamesha ek valid "is size ke kitne haath" count hai, jo ek poora number hai, isliye har bhaag exact nikalta hai. Ek alag sawaal — "main n jodi brackets ko kitne tarikon se vyavasthit kar sakta hoon taaki wo sahi tarah nested hon" — ka apna prasiddh jawaabon ka sequence nikalta hai, wahi sequence jo n nodes waale ek binary tree ke shapes aur ek polygon ko triangles mein kaatne ke tarike ginta hai. Ye pehchaanna ki ek counting problem in named sequences mein se ek hai matlab aap ek recursion banane ke bajaye ek ek-line formula dekhte ho.',
    },

    simple: `**Start broken.** nCr straight from the formula, plain numbers:

\`\`\`js
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}
function nCrNaive(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

console.log(nCrNaive(5, 2));    // 10   OK
console.log(nCrNaive(20, 10));  // 184756   OK (just barely)
console.log(nCrNaive(25, 12));  // 5200300  -> actual is 5200300, but...
console.log(nCrNaive(30, 15));  // 155117519.99999997  -> WRONG, should be 155117520
\`\`\`

\`21!\` is about \`5.1e19\`, past \`Number.MAX_SAFE_INTEGER\` (\`9.007e15\`). Once any of the three factorials rounds, the division is operating on inexact values and you get a non-integer "count". The answer \`nCr(30,15)\` is only \`155,117,520\` — tiny — but the *intermediate* \`30!\` destroyed the precision.

**The fix: multiply and divide in lockstep, keeping the running value exact**

\`\`\`js
function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);                 // C(n, r) === C(n, n - r); pick the smaller
  let result = 1;
  for (let i = 1; i <= r; i++) {
    result = result * (n - r + i) / i;    // running value stays a valid binomial coeff -> integer
  }
  return Math.round(result);              // round away tiny floating-point dust
}

console.log(nCr(30, 15));      // 155117520
console.log(nCr(52, 5));       // 2598960
console.log(nCr(10, 0));       // 1
\`\`\`

\`\`\`ts
function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}
\`\`\`

The identity is \`C(n, r) = C(n, r-1) * (n - r + 1) / r\`. Because every partial product \`C(n, 1), C(n, 2), ...\` is itself a whole number (a real count of something), each division lands exactly, and the running value never grows beyond the final answer. For large answers that must be reported modulo a prime, you compute factorials mod p and use the modular inverse from lesson 5 instead of real division.`,

    simpleHi: `**Toote hue se shuru.** Formula se seedhe nCr, plain numbers:

\`\`\`js
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}
function nCrNaive(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

console.log(nCrNaive(5, 2));    // 10   OK
console.log(nCrNaive(20, 10));  // 184756   OK (bas kisi tarah)
console.log(nCrNaive(25, 12));  // 5200300
console.log(nCrNaive(30, 15));  // 155117519.99999997  -> GALAT, 155117520 hona chahiye
\`\`\`

\`21!\` lagbhag \`5.1e19\` hai, \`Number.MAX_SAFE_INTEGER\` (\`9.007e15\`) se aage. Ek baar teen factorials mein se koi round hota hai, division inexact values par chalta hai aur aapko ek non-integer "count" milta hai. Jawaab \`nCr(30,15)\` sirf \`155,117,520\` hai — chhota — par *beech* ka \`30!\` precision nasht kar diya.

**Fix: guna aur bhaag lockstep mein, running value ko exact rakhte hue**

\`\`\`js
function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);                 // C(n, r) === C(n, n - r); chhota chuno
  let result = 1;
  for (let i = 1; i <= r; i++) {
    result = result * (n - r + i) / i;    // running value ek valid binomial coeff rehti hai -> integer
  }
  return Math.round(result);              // chhote floating-point dust ko round karo
}

console.log(nCr(30, 15));      // 155117520
console.log(nCr(52, 5));       // 2598960
console.log(nCr(10, 0));       // 1
\`\`\`

\`\`\`ts
function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}
\`\`\`

Identity \`C(n, r) = C(n, r-1) * (n - r + 1) / r\` hai. Kyunki har partial product \`C(n, 1), C(n, 2), ...\` khud ek poora number hai (kisi cheez ka ek asli count), har division bilkul land karta hai, aur running value kabhi antim jawaab se aage nahi badhti. Bade jawaabon ke liye jo ek prime ka modulo report hone chahiye, aap factorials mod p compute karte ho aur asli division ke bajaye lesson 5 se modular inverse istemal karte ho.`,

    content: `## Pascal's triangle — nCr with only addition

\`\`\`
        1
       1 1
      1 2 1
     1 3 3 1
    1 4 6 4 1

C(n, r) = C(n-1, r-1) + C(n-1, r)      each entry is the sum of the two above it

Use it when you need MANY binomial coefficients (a whole row, or nCr for all
small n up to N): O(N^2) to fill the table, O(1) per lookup after.
\`\`\`

\`\`\`js
function pascal(N) {
  const C = Array.from({ length: N + 1 }, () => new Array(N + 1).fill(0));
  for (let n = 0; n <= N; n++) {
    C[n][0] = 1;
    for (let r = 1; r <= n; r++) C[n][r] = C[n - 1][r - 1] + C[n - 1][r];
  }
  return C;
}
\`\`\`

## Grid paths: "only right and down" is C(m+n, n)

\`\`\`
A path from the top-left of an m-by-n grid to the bottom-right, moving only
right or down, is a sequence of exactly m DOWNs and n RIGHTs in some order.
Choosing WHICH of the m+n steps are the DOWNs fixes the path.

  number of unique paths = C(m + n, m) = C(m + n, n)
\`\`\`

This is the "Unique Paths" problem solved in O(min(m, n)) with the \`nCr\` above, instead of an O(m*n) DP table. Any "count the monotone lattice paths / count the ways using exactly a of X and b of Y" reduces to one binomial coefficient.

## The Catalan numbers — one sequence, many disguises

\`\`\`
Cat(0)=1, Cat(1)=1, Cat(2)=2, Cat(3)=5, Cat(4)=14, Cat(5)=42, Cat(6)=132, ...

Closed form:   Cat(n) = C(2n, n) / (n + 1)
Recurrence:    Cat(n) = sum over i in [0, n-1] of  Cat(i) * Cat(n-1-i)

Cat(n) counts ALL of these (they are the same problem):
  - distinct binary search tree SHAPES with n nodes  ("Unique BSTs")
  - strings of n pairs of parentheses that are balanced
  - ways to fully parenthesise a product of n+1 factors
  - monotone lattice paths that never cross the diagonal
  - ways to triangulate a convex polygon with n+2 sides
  - distinct full binary trees with n+1 leaves
\`\`\`

\`\`\`js
function catalan(n) {
  // via the recurrence — O(n^2), and the values stay exact for n up to ~30
  const cat = new Array(n + 1).fill(0);
  cat[0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 0; j < i; j++) cat[i] += cat[j] * cat[i - 1 - j];
  return cat[n];
}
// catalan(3) -> 5   (the 5 BST shapes with 3 nodes)
\`\`\`

If an interview problem asks "how many distinct trees / how many valid bracket strings / how many ways to split", compute the first few by hand — 1, 1, 2, 5, 14 — and if they match, it is Catalan and you write the recurrence in four lines.

## Stars and bars — splitting k identical items into n groups

\`\`\`
"How many ways to write k = x1 + x2 + ... + xn with each xi >= 0"
  = C(k + n - 1, n - 1)          (place n-1 dividers among k + n - 1 slots)

"...with each xi >= 1"
  = C(k - 1, n - 1)              (give everyone 1 first, then distribute k - n)

Shows up as: "distribute k identical coins to n people", "number of
non-negative integer solutions", "ways to place k balls in n boxes".
\`\`\`

## The recognition checklist

\`\`\`
"n choose r", "how many committees / subsets of size r"    nCr (lockstep multiply/divide)
"...MANY of them, or mod p"                                 Pascal table, or factorials + inverse
"unique paths in a grid, right/down only"                  C(m + n, n)
"number of distinct BSTs / balanced bracket strings"       Catalan: C(2n,n)/(n+1) or the recurrence
"ways to triangulate a polygon / parenthesise a product"   Catalan
"distribute k identical items into n bins"                  stars and bars: C(k+n-1, n-1)
"count arrangements with repeated elements"                 n! / (c1! c2! ... ck!)   (multinomial)

Interview tell: the question starts with "how many" and asks for a NUMBER, not
a list. If generating them all would be exponential but the count is wanted,
there is almost always a formula or a small DP.
\`\`\``,

    contentHi: `## Pascal's triangle — sirf addition se nCr

\`\`\`
        1
       1 1
      1 2 1
     1 3 3 1
    1 4 6 4 1

C(n, r) = C(n-1, r-1) + C(n-1, r)      har entry uske upar ke do ka sum hai

Ise tab istemal karo jab aapko KAYI binomial coefficients chahiye (ek poori row,
ya N tak sab chhote n ke liye nCr): table bharne ko O(N^2), uske baad prati lookup O(1).
\`\`\`

\`\`\`js
function pascal(N) {
  const C = Array.from({ length: N + 1 }, () => new Array(N + 1).fill(0));
  for (let n = 0; n <= N; n++) {
    C[n][0] = 1;
    for (let r = 1; r <= n; r++) C[n][r] = C[n - 1][r - 1] + C[n - 1][r];
  }
  return C;
}
\`\`\`

## Grid paths: "sirf right aur down" C(m+n, n) hai

\`\`\`
Ek m-by-n grid ke top-left se bottom-right tak ek path, sirf right ya down
move karte hue, kisi kram mein bilkul m DOWNs aur n RIGHTs ka ek sequence hai.
KAUNSE m+n steps DOWNs hain ye chunna path tay karta hai.

  unique paths ki tadaad = C(m + n, m) = C(m + n, n)
\`\`\`

Ye "Unique Paths" problem hai jo upar ke \`nCr\` ke saath O(min(m, n)) mein solve hoti hai, ek O(m*n) DP table ke bajaye. Koi bhi "monotone lattice paths gino / bilkul a X aur b Y istemal karke tarike gino" ek binomial coefficient mein ghatti hai.

## Catalan numbers — ek sequence, kayi bhes

\`\`\`
Cat(0)=1, Cat(1)=1, Cat(2)=2, Cat(3)=5, Cat(4)=14, Cat(5)=42, Cat(6)=132, ...

Closed form:   Cat(n) = C(2n, n) / (n + 1)
Recurrence:    Cat(n) = [0, n-1] mein i par yog of  Cat(i) * Cat(n-1-i)

Cat(n) in SABKO ginta hai (ye wahi problem hain):
  - n nodes waale distinct binary search tree SHAPES  ("Unique BSTs")
  - n jodi parentheses ki strings jo balanced hain
  - n+1 factors ke ek product ko poori tarah parenthesise karne ke tarike
  - monotone lattice paths jo kabhi diagonal cross nahi karte
  - ek convex polygon ko n+2 sides ke saath triangulate karne ke tarike
  - n+1 leaves waale distinct full binary trees
\`\`\`

\`\`\`js
function catalan(n) {
  // recurrence se — O(n^2), aur values n up to ~30 ke liye exact rehti hain
  const cat = new Array(n + 1).fill(0);
  cat[0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 0; j < i; j++) cat[i] += cat[j] * cat[i - 1 - j];
  return cat[n];
}
// catalan(3) -> 5   (3 nodes waale 5 BST shapes)
\`\`\`

Agar ek interview problem poochhti hai "kitne distinct trees / kitne valid bracket strings / kitne tarike split karne ke", pehle kuch haath se compute karo — 1, 1, 2, 5, 14 — aur agar wo match karte hain, ye Catalan hai aur aap recurrence chaar lines mein likhte ho.

## Stars and bars — k samaan items ko n groups mein baantna

\`\`\`
"k = x1 + x2 + ... + xn likhne ke kitne tarike jahaan har xi >= 0"
  = C(k + n - 1, n - 1)          (k + n - 1 slots mein n-1 dividers rakho)

"...jahaan har xi >= 1"
  = C(k - 1, n - 1)              (pehle sabko 1 do, phir k - n baanto)

Ye dikhta hai: "k samaan coins n logon ko baanto", "non-negative integer
solutions ki tadaad", "k balls ko n boxes mein rakhne ke tarike".
\`\`\`

## Pehchaanne ki checklist

\`\`\`
"n choose r", "size r ki kitni committees / subsets"      nCr (lockstep multiply/divide)
"...unmein se KAYI, ya mod p"                              Pascal table, ya factorials + inverse
"ek grid mein unique paths, sirf right/down"              C(m + n, n)
"distinct BSTs / balanced bracket strings ki tadaad"      Catalan: C(2n,n)/(n+1) ya recurrence
"ek polygon triangulate / ek product parenthesise karne ke tarike"  Catalan
"k samaan items ko n bins mein baanto"                    stars and bars: C(k+n-1, n-1)
"repeated elements waale arrangements gino"               n! / (c1! c2! ... ck!)   (multinomial)

Interview sanket: sawaal "kitne" se shuru hota hai aur ek NUMBER maangta hai, ek
list nahi. Agar un sabko generate karna exponential hoga par count chahiye,
lagbhag hamesha ek formula ya ek chhota DP hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: nCr via three factorials',
        titleHi: 'Toota: teen factorials se nCr',
        code: `factorial(n) / (factorial(r) * factorial(n - r))   // factorial(21) > 2^53`,
        codeJs: `function factorial(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
function nCrNaive(n, r) { return factorial(n) / (factorial(r) * factorial(n - r)); }
console.log(nCrNaive(5, 2));     // 10
console.log(nCrNaive(20, 10));   // 184756
console.log(nCrNaive(30, 15));   // 155117519.99999997  (want 155117520)
console.log(nCrNaive(40, 20));   // 137846528819.99998  (want 137846528820)
console.log('factorial(21) =', factorial(21), '> MAX_SAFE?', factorial(21) > Number.MAX_SAFE_INTEGER);`,
        codeTs: `function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}
function nCrNaive(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r));
}`,
        outputJs: `10
184756
155117519.99999997
137846528819.99998
factorial(21) = 51090942171709440000 > MAX_SAFE? true`,
        outputTs: `// Non-integer "counts" appear once any factorial rounds — well before the
// answer itself would overflow.`,
        explain: 'nCr(30,15) is only 155,117,520 and fits easily, but 30! is astronomically large and rounds long before the division. The result is a non-integer, a dead giveaway that precision was lost mid-computation. The problem is the intermediate size, not the answer size.',
        explainHi: 'nCr(30,15) sirf 155,117,520 hai aur aaraam se fit hota hai, par 30! khagoliya roop se bada hai aur division se kaafi pehle round hota hai. Nateeja ek non-integer hai, ek pakka sanket ki precision beech-computation mein khoyi. Samasya beech ka size hai, jawaab ka size nahi.',
      },
      {
        title: 'Fixed: lockstep multiply and divide',
        titleHi: 'Theek: lockstep guna aur bhaag',
        code: `result = result * (n - r + i) / i;   // running value is always a valid C(n, i)`,
        codeJs: `function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= r; i++) result = result * (n - r + i) / i;
  return Math.round(result);
}
console.log(nCr(30, 15));   // 155117520
console.log(nCr(40, 20));   // 137846528820
console.log(nCr(52, 5));    // 2598960
console.log(nCr(10, 0));    // 1
console.log(nCr(6, 9));     // 0  (r > n)

// grid paths: an m x n grid, right/down only
const uniquePaths = (m, n) => nCr(m + n - 2, m - 1);
console.log(uniquePaths(3, 7));   // 28
console.log(uniquePaths(3, 3));   // 6`,
        codeTs: `function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}`,
        outputJs: `155117520
137846528820
2598960
1
0
28
6`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Each step computes C(n, i) from C(n, i-1) by multiplying in one more numerator term and dividing by i. Because every C(n, i) is a genuine integer count, the division is exact (Math.round mops up sub-ulp float dust). The running value never exceeds the answer, so 2^53 is never in danger for realistic n.',
        explainHi: 'Har step C(n, i) ko C(n, i-1) se compute karta hai ek aur numerator term guna karke aur i se bhaag karke. Kyunki har C(n, i) ek asli integer count hai, division exact hai (Math.round sub-ulp float dust saaf karta hai). Running value kabhi jawaab se aage nahi badhti, isliye vaastavik n ke liye 2^53 kabhi khatre mein nahi.',
      },
      {
        title: 'Catalan: unique BSTs and balanced parentheses',
        titleHi: 'Catalan: unique BSTs aur balanced parentheses',
        code: `for (j in [0, i-1]) cat[i] += cat[j] * cat[i - 1 - j];   // split on the root position`,
        codeJs: `function catalan(n) {
  const cat = new Array(n + 1).fill(0);
  cat[0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 0; j < i; j++) cat[i] += cat[j] * cat[i - 1 - j];
  return cat[n];
}
console.log(catalan(0), catalan(1), catalan(2), catalan(3), catalan(4), catalan(5));
console.log('unique BSTs with 4 nodes:', catalan(4));        // 14
console.log('balanced "()" strings, 3 pairs:', catalan(3));  // 5

// closed form via nCr, same answers
const nCr = (n, r) => { if (r<0||r>n) return 0; r=Math.min(r,n-r); let x=1; for(let i=1;i<=r;i++) x=x*(n-r+i)/i; return Math.round(x); };
const catalanClosed = (n) => nCr(2 * n, n) / (n + 1);
console.log(catalanClosed(5), catalanClosed(6));   // 42 132`,
        codeTs: `function catalan(n: number): number {
  const cat = new Array<number>(n + 1).fill(0);
  cat[0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 0; j < i; j++) cat[i]! += cat[j]! * cat[i - 1 - j]!;
  return cat[n]!;
}`,
        outputJs: `1 1 2 5 14 42
unique BSTs with 4 nodes: 14
balanced "()" strings, 3 pairs: 5
42 132`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'The recurrence splits an n-node BST on which node is the root: i nodes go left, n-1-i go right, and the counts multiply. Summing over every root position gives Cat(n). The closed form C(2n,n)/(n+1) gives the same sequence 1,1,2,5,14,42,132.',
        explainHi: 'Recurrence ek n-node BST ko is par split karta hai ki kaunsa node root hai: i nodes left jaate hain, n-1-i right, aur counts guna hote hain. Har root position par yog Cat(n) deta hai. Closed form C(2n,n)/(n+1) wahi sequence 1,1,2,5,14,42,132 deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// nCr by finishing the numerator, then dividing
let num = 1;
for (let i = n - r + 1; i <= n; i++) num *= i;   // num overflows for r not tiny
let den = 1;
for (let i = 1; i <= r; i++) den *= i;
return num / den;`,
        right: `let result = 1;
for (let i = 1; i <= r; i++) result = result * (n - r + i) / i;   // interleave -> stays small
return Math.round(result);`,
        why: 'Computing the full numerator before dividing lets it grow to nearly n!, which overflows Number for modest n even when C(n, r) is small. Interleaving keeps the running value equal to a partial binomial coefficient, which never exceeds the final answer and is always an exact integer.',
        whyHi: 'Bhaag karne se pehle poora numerator compute karna use lagbhag n! tak badhne deta hai, jo maamooli n ke liye Number overflow karta hai tab bhi jab C(n, r) chhota hai. Interleave karna running value ko ek partial binomial coefficient ke barabar rakhta hai, jo kabhi antim jawaab se aage nahi badhta aur hamesha ek exact integer hai.',
      },
      {
        wrong: `// Catalan recurrence with the wrong split index
for (let j = 0; j <= i; j++) cat[i] += cat[j] * cat[i - j];   // j <= i and cat[i-j]`,
        right: `for (let j = 0; j < i; j++) cat[i] += cat[j] * cat[i - 1 - j];   // j < i, left has j, right has i-1-j`,
        why: 'For an i-node tree, one node is the root and the other i-1 split as j on the left and i-1-j on the right. The index must be i-1-j, and j must stop before i (so the left subtree cannot take all i nodes). Using i-j double-counts and includes an impossible i-node left subtree, giving numbers that are too large.',
        whyHi: 'Ek i-node tree ke liye, ek node root hai aur baaki i-1, j left par aur i-1-j right par split hote hain. Index i-1-j hona chahiye, aur j ko i se pehle rukna chahiye (taaki left subtree saare i nodes na le). i-j istemal karna double-count karta hai aur ek namumkin i-node left subtree shaamil karta hai, bahut bade numbers dete hue.',
      },
      {
        wrong: `// forgetting C(n, r) == C(n, n - r) and looping r times when r is large
r = 15;  n = 30;  // loops 15 times — fine here, but for r = n - 2 it loops n - 2 times`,
        right: `r = Math.min(r, n - r);   // C(30, 28) becomes C(30, 2) -> loop only twice`,
        why: 'C(n, r) and C(n, n-r) are equal, so choosing the smaller one halves the worst-case loop length and, more importantly, keeps intermediate values smaller. C(1000, 998) computed as-is loops 998 times; as C(1000, 2) it loops twice.',
        whyHi: 'C(n, r) aur C(n, n-r) barabar hain, isliye chhota chunna worst-case loop length aadha karta hai aur, zyaada mahatvapurna, beech ki values chhoti rakhta hai. C(1000, 998) jaise-hai compute kiya 998 baar loop karta hai; C(1000, 2) ki tarah wo do baar loop karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Probability and statistics engines** — hypergeometric tests, binomial confidence intervals, poker hand odds — compute binomial coefficients constantly, and the lockstep method (or log-gamma for very large n) is what keeps them numerically stable.',
        hi: '**Probability aur statistics engines** — hypergeometric tests, binomial confidence intervals, poker hand odds — binomial coefficients lagataar compute karte hain, aur lockstep method (ya bahut bade n ke liye log-gamma) unhe numerically stable rakhta hai.',
      },
      {
        en: '**Compilers and query planners** use Catalan-number reasoning to count the ways an expression or a join can be parenthesised, which bounds the search space a cost-based optimiser has to explore.',
        hi: '**Compilers aur query planners** Catalan-number tark istemal karte hain ye ginne ke liye ki ek expression ya ek join kitne tarikon se parenthesise ho sakta hai, jo us search space ko bound karta hai jise ek cost-based optimiser explore karna hota hai.',
      },
      {
        en: '**Combinatorial test generation and allocation** — "distribute N test cases across M workers", "count configurations with K identical resources in P slots" — is stars and bars, turning an enumeration into a single formula.',
        hi: '**Combinatorial test generation aur allocation** — "N test cases M workers mein baanto", "P slots mein K samaan resources waale configurations gino" — stars and bars hai, ek enumeration ko ek akele formula mein badalte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Compute "n choose r" without overflow. Why is the naive factorial formula wrong long before the answer overflows?',
        qHi: 'Bina overflow "n choose r" compute karo. Naive factorial formula jawaab overflow hone se kaafi pehle kyun galat hai?',
        a: 'The naive approach computes n factorial, r factorial, and n-minus-r factorial separately and then divides. The problem is that factorials grow explosively: twenty-one factorial is already about five times ten to the nineteenth, which is past the largest integer a double-precision float can represent exactly, around nine times ten to the fifteenth. Once any of those three factorials exceeds that limit, it is stored as an approximation, and dividing approximations gives you an approximation — you often see a result like 155117519.9999 where the true count is 155117520, a non-integer, which is impossible for a genuine count and a clear sign that precision was lost. Crucially this happens even when the final answer is small and would fit fine; the damage is done by the intermediate factorial, not the result. The fix is to interleave the multiplications and divisions so the running value never gets large. Use the identity that C of n and r equals C of n and r minus one, times n minus r plus one, divided by r. Starting from C of n and zero, which is one, you multiply by the next numerator term and divide by the next denominator term, alternating, for r steps. The reason every division comes out exact is that each partial result is itself a valid binomial coefficient — a real count of something — hence a whole number, so dividing lands cleanly. I also replace r with the smaller of r and n minus r first, since C of n and r equals C of n and n minus r, which shortens the loop and keeps the values even smaller. A final Math.round cleans up the last bit of floating-point dust. If the problem wants the answer modulo a prime, I switch to computing factorials modulo that prime and use the modular inverse — from the modular arithmetic lesson, the inverse of x is x to the power p minus two — in place of real division, because in modular arithmetic you cannot divide directly.',
        aHi: 'Naive approach n factorial, r factorial, aur n-minus-r factorial alag compute karta hai aur phir bhaag karta hai. Samasya ye hai ki factorials visfotak roop se badhte hain: ikkis factorial pehle se lagbhag paanch guna das ki unnisvi power hai, jo sabse bade integer se aage hai jise ek double-precision float bilkul darshaa sakta hai, lagbhag nau guna das ki pandravi power. Ek baar un teen factorials mein se koi us seema se aage jaata hai, ise ek approximation ki tarah store kiya jaata hai, aur approximations bhaag karna aapko ek approximation deta hai — aap aksar 155117519.9999 jaisa nateeja dekhte ho jahaan asli count 155117520 hai, ek non-integer, jo ek asli count ke liye namumkin hai. Mahatvapurna baat ye tab bhi hota hai jab antim jawaab chhota hai aur theek fit hota. Fix multiplications aur divisions ko interleave karna hai taaki running value kabhi bada na ho. Ye identity istemal karo ki C of n aur r, C of n aur r minus ek guna n minus r plus ek bhaag r ke barabar hai. Har division exact kyun nikalta hai iska kaaran ye hai ki har partial result khud ek valid binomial coefficient hai — kisi cheez ka ek asli count — isliye ek poora number. Agar problem ek prime ka modulo chahti hai, main us prime ka modulo factorials compute karne par switch karta hoon aur asli division ki jagah modular inverse istemal karta hoon.',
      },
      {
        q: 'You are asked "how many structurally unique BSTs store values 1..n". Recognise the pattern and derive the recurrence.',
        qHi: 'Aapse poochha jaata hai "kitne structurally unique BSTs values 1..n store karte hain". Pattern pehchaano aur recurrence nikaalo.',
        a: 'The first move is to compute the answer for small n by hand. For n equal to zero there is one tree, the empty tree. For one node, one tree. For two nodes, two shapes. For three nodes, five. That sequence — one, one, two, five, fourteen, forty-two — is the Catalan numbers, and recognising it immediately tells me there is a clean closed form and a simple recurrence. To derive the recurrence directly: in a BST storing the values one through n, whichever value you pick as the root, say the value k, splits the remaining values into those less than k, which must all go into the left subtree, and those greater than k, which must all go into the right subtree. There are k minus one values below and n minus k values above. Crucially, the number of distinct left-subtree shapes depends only on how many nodes it has, not on which specific values, because any set of that size can be arranged into the same collection of BST shapes. So the number of trees with root k is the number of BST shapes on k minus one nodes times the number on n minus k nodes. Summing over every possible root k from one to n gives the total. Writing G of n for the count, G of n is the sum over k from one to n of G of k minus one times G of n minus k, with G of zero equal to one. Reindexing, that is the sum over i from zero to n minus one of G of i times G of n minus one minus i, which is exactly the Catalan recurrence. Computing it bottom up with a table is order n squared time and order n space. Alternatively the closed form is C of two n and n, divided by n plus one, which is order n with the lockstep binomial method. Both give one, one, two, five, fourteen for the first few n.',
        aHi: 'Pehla kadam chhote n ke liye jawaab haath se compute karna hai. n barabar zero ke liye ek tree hai, empty tree. Ek node ke liye, ek tree. Do nodes ke liye, do shapes. Teen nodes ke liye, paanch. Wo sequence — ek, ek, do, paanch, chaudah, biyaalis — Catalan numbers hain, aur ise pehchaanna turant mujhe batata hai ki ek saaf closed form aur ek saral recurrence hai. Recurrence seedhe nikaalne ko: ek BST mein jo values ek se n store karta hai, aap jo bhi value root chunte ho, maano value k, baaki values ko unmein baant deta hai jo k se kam hain, jo sab left subtree mein jaane chahiye, aur jo k se bade hain, jo sab right subtree mein jaane chahiye. k minus ek values neeche hain aur n minus k values upar. Mahatvapurna baat, distinct left-subtree shapes ki tadaad sirf is par nirbhar karti hai ki ismein kitne nodes hain, kaunse khaas values nahi. Toh root k waale trees ki tadaad k minus ek nodes par BST shapes ki tadaad guna n minus k par tadaad hai. Har sambhav root k par yog kul deta hai. G of n ki tarah likhne par, G of n, k ke ek se n tak G of k minus ek guna G of n minus k ka yog hai, G of zero barabar ek ke saath.',
      },
    ],

    exercises: [
      {
        task: 'Implement nCr with the lockstep method and the C(n,r)=C(n,n-r) shortcut. Verify nCr(30,15)=155117520, nCr(52,5)=2598960, nCr(10,0)=1, nCr(6,9)=0. Then implement nCrNaive with factorials and show nCr(40,20) differs (one is a clean integer, the other is not).',
        taskHi: 'nCr ko lockstep method aur C(n,r)=C(n,n-r) shortcut ke saath implement karo. Verify karo nCr(30,15)=155117520, nCr(52,5)=2598960, nCr(10,0)=1, nCr(6,9)=0. Phir nCrNaive ko factorials ke saath implement karo aur dikhao ki nCr(40,20) alag hai (ek saaf integer hai, doosra nahi).',
        hint: 'nCr(40,20) is 137846528820. The naive version returns 137846528819.99998 because 40! (about 8e47) rounds catastrophically. Math.round would "fix" the display but the underlying computation already lost bits.',
        hintHi: 'nCr(40,20) 137846528820 hai. Naive version 137846528819.99998 lautaata hai kyunki 40! (lagbhag 8e47) vinaashkari roop se round hota hai. Math.round display "theek" karega par underlying computation pehle hi bits kho chuka.',
      },
      {
        task: 'Implement uniquePaths(m, n) = nCr(m + n - 2, m - 1) for an m x n grid, right/down moves only. Verify uniquePaths(3, 7) = 28, uniquePaths(3, 3) = 6, uniquePaths(1, 1) = 1. Then write the O(m*n) DP version and confirm they agree on a 10x10 grid (48620).',
        taskHi: 'uniquePaths(m, n) = nCr(m + n - 2, m - 1) ko ek m x n grid ke liye implement karo, sirf right/down moves. Verify karo uniquePaths(3, 7) = 28, uniquePaths(3, 3) = 6, uniquePaths(1, 1) = 1. Phir O(m*n) DP version likho aur confirm karo ki wo ek 10x10 grid par sahmat hain (48620).',
        hint: 'A path is m-1 downs and n-1 rights in some order; choosing which of the m+n-2 steps are downs fixes the path, so it is C(m+n-2, m-1). The DP fills grid[i][j] = grid[i-1][j] + grid[i][j-1].',
        hintHi: 'Ek path kisi kram mein m-1 downs aur n-1 rights hai; kaunse m+n-2 steps downs hain ye chunna path tay karta hai, isliye ye C(m+n-2, m-1) hai. DP grid[i][j] = grid[i-1][j] + grid[i][j-1] bharta hai.',
      },
      {
        task: 'Implement catalan(n) via the recurrence. Verify the first seven values are 1, 1, 2, 5, 14, 42, 132. Then implement catalanClosed(n) = nCr(2n, n) / (n + 1) and confirm both give 16796 for n = 10.',
        taskHi: 'catalan(n) ko recurrence se implement karo. Verify karo ki pehli saat values 1, 1, 2, 5, 14, 42, 132 hain. Phir catalanClosed(n) = nCr(2n, n) / (n + 1) implement karo aur confirm karo ki dono n = 10 ke liye 16796 dete hain.',
        hint: 'The recurrence cat[i] += cat[j] * cat[i-1-j] for j in [0, i). If you write cat[i-j] instead of cat[i-1-j], or let j reach i, the counts blow up past the real Catalan sequence.',
        hintHi: 'Recurrence cat[i] += cat[j] * cat[i-1-j] j ke [0, i) mein liye. Agar aap cat[i-1-j] ke bajaye cat[i-j] likhte ho, ya j ko i tak pahunchne dete ho, counts asli Catalan sequence se aage phat jaate hain.',
      },
    ],

    keyTakeaways: [
      'Never compute nCr as n! / (r! (n-r)!) with plain numbers — 21! already exceeds 2^53, so the division rounds and the "count" is non-integer long before the answer would overflow.',
      'Compute nCr in lockstep: result = result * (n - r + i) / i for i in 1..r. Every partial value is a real binomial coefficient (an integer), so each division is exact and the running value never exceeds the answer.',
      'Use C(n, r) = C(n, n - r): replace r with min(r, n - r) to shorten the loop and shrink intermediates.',
      'Pascal\'s triangle: C(n, r) = C(n-1, r-1) + C(n-1, r), addition only. Use it when you need many coefficients — O(N^2) table, O(1) lookups.',
      'Grid paths (right/down only) in an m x n grid = C(m + n - 2, m - 1). Any "arrange exactly a of X and b of Y" is one binomial coefficient.',
      'Catalan numbers 1,1,2,5,14,42,132 count: unique BST shapes, balanced parenthesis strings, polygon triangulations, ways to parenthesise a product, full binary trees. Cat(n) = C(2n,n)/(n+1), or the recurrence sum cat[j]*cat[n-1-j].',
      'Stars and bars: distributing k identical items into n groups is C(k + n - 1, n - 1) (each xi >= 0) or C(k - 1, n - 1) (each xi >= 1).',
      'For a count modulo a prime, compute factorials mod p and use the modular inverse (lesson 5) instead of real division.',
    ],
    keyTakeawaysHi: [
      'nCr ko kabhi n! / (r! (n-r)!) plain numbers se compute mat karo — 21! pehle se 2^53 se aage hai, isliye division round hota hai aur "count" non-integer hai jawaab overflow hone se kaafi pehle.',
      'nCr ko lockstep mein compute karo: result = result * (n - r + i) / i i ke 1..r mein liye. Har partial value ek asli binomial coefficient (ek integer) hai, isliye har division exact hai aur running value kabhi jawaab se aage nahi badhti.',
      'C(n, r) = C(n, n - r) istemal karo: r ko min(r, n - r) se badlo loop chhota karne aur intermediates sikodne ko.',
      'Pascal\'s triangle: C(n, r) = C(n-1, r-1) + C(n-1, r), sirf addition. Ise tab istemal karo jab aapko kayi coefficients chahiye — O(N^2) table, O(1) lookups.',
      'Grid paths (sirf right/down) ek m x n grid mein = C(m + n - 2, m - 1). Koi bhi "bilkul a X aur b Y arrange karo" ek binomial coefficient hai.',
      'Catalan numbers 1,1,2,5,14,42,132 ginte hain: unique BST shapes, balanced parenthesis strings, polygon triangulations, ek product parenthesise karne ke tarike, full binary trees. Cat(n) = C(2n,n)/(n+1), ya recurrence sum cat[j]*cat[n-1-j].',
      'Stars and bars: k samaan items ko n groups mein baantna C(k + n - 1, n - 1) hai (har xi >= 0) ya C(k - 1, n - 1) (har xi >= 1).',
      'Ek prime ka modulo count ke liye, factorials mod p compute karo aur asli division ke bajaye modular inverse (lesson 5) istemal karo.',
    ],
  },
];
