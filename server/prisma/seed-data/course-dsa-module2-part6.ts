/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 6.
 *
 * Range queries when the array also CHANGES: the Fenwick tree (binary indexed
 * tree) and the segment tree. Builds directly on this module's lesson 3 (prefix
 * sums, which answer a range sum in O(1) but assume the array never changes)
 * and on this course's Module 13 lesson 2 (the `i & -i` lowest-set-bit trick
 * that a Fenwick tree is built on). Broken example: keeping the prefix-sum array
 * from lesson 3 and rebuilding it after every update — each rebuild is O(n), so
 * a workload of q updates interleaved with q queries costs O(q * n), which is
 * worse than having no precomputation at all if updates outnumber queries.
 * Fixed with a Fenwick tree, where each slot stores the sum of a power-of-two
 * sized block ending at its index, so both "add to one element" and "prefix sum
 * up to i" walk only O(log n) slots. The lesson then generalises to a segment
 * tree for operations that are not invertible (min, max, gcd), which prefix
 * sums and Fenwick trees cannot handle.
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

export const DSA_MODULE_2_PART6: CourseLesson[] = [
  {
    slug: 'range-queries-with-updates-fenwick-segment-tree',
    title: 'Range Queries With Updates: Fenwick Tree and Segment Tree',
    titleHi: 'Updates Ke Saath Range Queries: Fenwick Tree Aur Segment Tree',
    description: 'Keeping the prefix-sum array from the prefix-sums lesson and rebuilding it whenever a single element changes. Each rebuild walks the whole array, so a stream of q updates mixed with q range queries costs O(q times n) — and if updates are frequent, the precomputation you added to make queries fast has made the program slower than doing nothing.',
    descriptionHi: 'Prefix-sums lesson se prefix-sum array rakhna aur jab bhi ek akela element badalta hai ise dobara banaana. Har rebuild poora array chalta hai, isliye q updates ki ek stream q range queries ke saath milkar O(q guna n) kharch karti hai — aur agar updates aksar hain, jo precomputation aapne queries tez karne ke liye jodi thi usne program ko kuch na karne se slow bana diya.',
    difficulty: 'HARD',
    duration: 28,
    order: 6,

    analogy: {
      en: '**A shop that wants both a running grand total and the ability to correct one day\'s takings, without re-adding the whole ledger.** If the owner keeps only the daily figures, answering "what did we take between March and August" means adding up every day in that span — slow, but a correction is trivial: change one number. If instead they keep a running total after every day, that question is one subtraction, but correcting a single day in March means rewriting every running total from March to today. Both extremes are bad when corrections and questions are equally common. The fix is a middle layout: alongside the daily figures, keep a small set of pre-added block totals — one covering the last two days, one covering the last four, one covering the last eight, and so on at doubling sizes. Any span you are asked about can be assembled from a handful of these blocks rather than from every day, and any single-day correction only touches the handful of blocks that happen to contain that day. Because the block sizes double, both the number of blocks needed to cover a span and the number containing any given day grow like the number of times you can halve the ledger — a dozen or so steps even for a ledger of thousands of days.',
      hi: '**Ek dukaan jo ek running grand total aur ek din ki takings theek karne ki kshamata dono chahti hai, bina poora ledger dobara jode.** Agar maalik sirf daily figures rakhta hai, "March aur August ke beech humne kya liya" ka jawaab dena matlab us span mein har din jodna — slow, par ek correction trivial hai: ek number badlo. Agar iske bajaye wo har din ke baad ek running total rakhte hain, wo sawaal ek subtraction hai, par March mein ek akela din theek karna matlab March se aaj tak har running total dobara likhna. Jab corrections aur sawaal barabar aam hain dono extremes kharab hain. Fix ek beech ka layout hai: daily figures ke saath, pehle-se-jode block totals ka ek chhota set rakho — ek pichhle do din cover karta hua, ek pichhle chaar cover karta hua, ek pichhle aath, aur aise hi doguna hote sizes par. Koi bhi span jiske baare mein aapse poocha jaata hai in blocks ki ek mutthi se assemble ho sakta hai na ki har din se, aur koi bhi single-day correction sirf un mutthi bhar blocks ko chhoota hai jinmein samyog se wo din hai. Kyunki block sizes doguni hoti hain, ek span cover karne ko zaroori blocks ki tadaad aur kisi bhi diye gaye din ko rakhne waalon ki tadaad dono utni badhti hain jitni baar aap ledger halve kar sakte ho — hazaaron dinon ke ledger ke liye bhi ek dozen ya aise steps.',
    },

    simple: `**Start broken.** Prefix sums plus a rebuild on every update:

\`\`\`js
// From this module's prefix-sums lesson: query is O(1), but the array is FIXED.
function buildPrefix(a) {
  const p = [0];
  for (const x of a) p.push(p[p.length - 1] + x);
  return p;                                     // p[i+1] - p[j] = sum of a[j..i]
}

class RangeSumBroken {
  constructor(a) { this.a = a; this.p = buildPrefix(a); }
  query(i, j) { return this.p[j + 1] - this.p[i]; }     // O(1) — good
  update(i, value) {
    this.a[i] = value;
    this.p = buildPrefix(this.a);                       // O(n) REBUILD — the problem
  }
}
\`\`\`

The query is genuinely O(1), but every update throws away the whole precomputation and redoes it. With \`q\` updates on an array of \`n\` elements that is O(q * n): for \`n = 100000\` and \`q = 100000\` it is 10^10 operations. This course's Module 14 lesson 2 puts that far past the budget.

Note the naive alternative is no better: keeping only the raw array makes update O(1) but query O(n), and a mixed workload is O(q * n) again. Neither extreme wins when updates and queries are both frequent.

**The fix: a Fenwick tree — each slot stores a power-of-two sized block**

\`\`\`js
class FenwickTree {
  constructor(n) { this.n = n; this.t = new Array(n + 1).fill(0); }   // 1-INDEXED

  // add 'delta' to element i (0-indexed input, converted to 1-indexed inside)
  update(i, delta) {
    for (let x = i + 1; x <= this.n; x += x & -x) {    // x & -x = lowest set bit (Module 13)
      this.t[x] += delta;                             // every block containing i
    }
  }

  // sum of a[0..i] inclusive
  prefix(i) {
    let s = 0;
    for (let x = i + 1; x > 0; x -= x & -x) {          // walk down, block by block
      s += this.t[x];
    }
    return s;
  }

  query(i, j) { return this.prefix(j) - this.prefix(i - 1); }   // sum of a[i..j]
}
\`\`\`

\`\`\`ts
class FenwickTree {
  private t: number[];
  constructor(private n: number) { this.t = new Array<number>(n + 1).fill(0); }
  update(i: number, delta: number): void {
    for (let x = i + 1; x <= this.n; x += x & -x) this.t[x]! += delta;
  }
  prefix(i: number): number {
    let s = 0;
    for (let x = i + 1; x > 0; x -= x & -x) s += this.t[x]!;
    return s;
  }
  query(i: number, j: number): number { return this.prefix(j) - this.prefix(i - 1); }
}
\`\`\`

Slot \`x\` stores the sum of the \`x & -x\` elements ending at \`x\`. So slot 8 (binary 1000) covers eight elements, slot 6 (binary 110) covers two, slot 5 (binary 101) covers one. Both loops move by the lowest set bit — \`prefix\` strips bits off going down, \`update\` adds bits going up — and a number has at most \`log2(n)\` bits, so **both operations are O(log n)**. A mixed workload of q updates and q queries drops from O(q * n) to O(q log n): for the numbers above, from 10^10 to about 1.7 million.

Building from an existing array is n updates, O(n log n) — or O(n) with the in-place trick shown in the deep dive.`,

    simpleHi: `**Toote hue se shuru.** Prefix sums plus har update par ek rebuild:

\`\`\`js
// Is module ke prefix-sums lesson se: query O(1) hai, par array FIXED hai.
function buildPrefix(a) {
  const p = [0];
  for (const x of a) p.push(p[p.length - 1] + x);
  return p;                                     // p[i+1] - p[j] = a[j..i] ka sum
}

class RangeSumBroken {
  constructor(a) { this.a = a; this.p = buildPrefix(a); }
  query(i, j) { return this.p[j + 1] - this.p[i]; }     // O(1) — achha
  update(i, value) {
    this.a[i] = value;
    this.p = buildPrefix(this.a);                       // O(n) REBUILD — samasya
  }
}
\`\`\`

Query sach mein O(1) hai, par har update poori precomputation phenkta hai aur ise dobara karta hai. \`n\` elements ke ek array par \`q\` updates ke saath wo O(q * n) hai: \`n = 100000\` aur \`q = 100000\` ke liye ye 10^10 operations hai. Is course ka Module 14 lesson 2 use budget se kaafi aage rakhta hai.

Dhyaan do naive vikalp behtar nahi hai: sirf raw array rakhna update ko O(1) par query ko O(n) banaata hai, aur ek mixed workload phir O(q * n) hai. Jab updates aur queries dono aksar hain koi bhi extreme nahi jeetta.

**Fix: ek Fenwick tree — har slot ek power-of-two size ka block store karta hai**

\`\`\`js
class FenwickTree {
  constructor(n) { this.n = n; this.t = new Array(n + 1).fill(0); }   // 1-INDEXED

  // element i mein 'delta' jodo (0-indexed input, andar 1-indexed mein convert)
  update(i, delta) {
    for (let x = i + 1; x <= this.n; x += x & -x) {    // x & -x = lowest set bit (Module 13)
      this.t[x] += delta;                             // har block jismein i hai
    }
  }

  // a[0..i] ka sum inclusive
  prefix(i) {
    let s = 0;
    for (let x = i + 1; x > 0; x -= x & -x) {          // neeche chalo, block by block
      s += this.t[x];
    }
    return s;
  }

  query(i, j) { return this.prefix(j) - this.prefix(i - 1); }   // a[i..j] ka sum
}
\`\`\`

\`\`\`ts
class FenwickTree {
  private t: number[];
  constructor(private n: number) { this.t = new Array<number>(n + 1).fill(0); }
  update(i: number, delta: number): void {
    for (let x = i + 1; x <= this.n; x += x & -x) this.t[x]! += delta;
  }
  prefix(i: number): number {
    let s = 0;
    for (let x = i + 1; x > 0; x -= x & -x) s += this.t[x]!;
    return s;
  }
  query(i: number, j: number): number { return this.prefix(j) - this.prefix(i - 1); }
}
\`\`\`

Slot \`x\` \`x\` par khatam hone waale \`x & -x\` elements ka sum store karta hai. Toh slot 8 (binary 1000) aath elements cover karta hai, slot 6 (binary 110) do cover karta hai, slot 5 (binary 101) ek. Dono loops lowest set bit se move karte hain — \`prefix\` neeche jaate hue bits strip karta hai, \`update\` upar jaate hue bits jodta hai — aur ek number mein zyaada se zyaada \`log2(n)\` bits hain, isliye **dono operations O(log n) hain**. q updates aur q queries ka ek mixed workload O(q * n) se O(q log n) par girta hai: upar ke numbers ke liye, 10^10 se lagbhag 1.7 million par.

Ek maujooda array se banaana n updates hai, O(n log n) — ya deep dive mein dikhaaye in-place trick se O(n).`,

    content: `## Why the two bit loops cover exactly the right blocks

\`\`\`
Fenwick slot x stores the sum of the (x & -x) elements ENDING at x.

x   binary   x & -x   covers (1-indexed)
1   0001     1        [1]
2   0010     2        [1..2]
3   0011     1        [3]
4   0100     4        [1..4]
5   0101     1        [5]
6   0110     2        [5..6]
7   0111     1        [7]
8   1000     8        [1..8]

prefix(7):  start x = 7 -> add t[7] (covers [7]);   7 - 1 = 6
            x = 6 -> add t[6] (covers [5..6]);      6 - 2 = 4
            x = 4 -> add t[4] (covers [1..4]);      4 - 4 = 0  stop
            blocks [7] + [5..6] + [1..4] = [1..7] exactly, no overlap, no gap.
            Three steps because 7 is binary 111 — one step per set bit.

update(5): start x = 5 -> t[5] covers [5], contains index 5.  5 + 1 = 6
           x = 6 -> t[6] covers [5..6], contains 5.           6 + 2 = 8
           x = 8 -> t[8] covers [1..8], contains 5.           8 + 8 = 16 > n stop
           Exactly the slots whose block contains index 5 — one step per level.
\`\`\`

Stripping the lowest set bit repeatedly (\`x -= x & -x\`) removes one 1-bit each time, so \`prefix\` takes as many steps as there are set bits in the index, at most \`log2(n)\`. Adding the lowest set bit (\`x += x & -x\`) carries upward to the next larger enclosing block, which also happens at most \`log2(n)\` times. Both bounds come straight from the fact that a number below \`n\` has at most \`log2(n)\` bits — this course's Module 13 lesson 2 derived the \`x & -x\` identity itself.

## Building in O(n) instead of O(n log n)

\`\`\`js
static from(a) {
  const ft = new FenwickTree(a.length);
  // seed each slot with its own element, then push each slot into its parent
  for (let i = 0; i < a.length; i++) ft.t[i + 1] = a[i];
  for (let x = 1; x <= a.length; x++) {
    const parent = x + (x & -x);
    if (parent <= a.length) ft.t[parent] += ft.t[x];   // each slot contributes once
  }
  return ft;
}
\`\`\`

Calling \`update\` n times is O(n log n). This build is O(n): every slot is added into its single parent exactly once, so the total work is one addition per slot. The same "each element contributes to a bounded number of places" accounting appeared in this course's Module 8 lesson 3 for O(n) heapify.

## When a Fenwick tree is NOT enough: segment trees

\`\`\`
A Fenwick tree computes a range from prefix(j) - prefix(i-1). That subtraction
requires the operation to be INVERTIBLE:
  sum      -> invertible (subtract)              Fenwick works
  xor      -> invertible (xor again)             Fenwick works
  count    -> invertible (subtract)              Fenwick works
  min/max  -> NOT invertible                     Fenwick does NOT work
  gcd      -> NOT invertible                     Fenwick does NOT work

You cannot recover min(a[3..7]) from min(a[0..7]) and min(a[0..2]).
For non-invertible but ASSOCIATIVE operations, use a segment tree.
\`\`\`

\`\`\`js
// Iterative segment tree: size 2n, leaves live at t[n .. 2n-1].
class SegmentTree {
  constructor(a, combine = (x, y) => Math.min(x, y), identity = Infinity) {
    this.n = a.length;
    this.combine = combine;
    this.identity = identity;
    this.t = new Array(2 * this.n).fill(identity);
    for (let i = 0; i < this.n; i++) this.t[this.n + i] = a[i];          // leaves
    for (let i = this.n - 1; i > 0; i--)                                 // internal nodes
      this.t[i] = combine(this.t[2 * i], this.t[2 * i + 1]);
  }

  update(i, value) {
    let x = this.n + i;
    this.t[x] = value;
    for (x = Math.floor(x / 2); x >= 1; x = Math.floor(x / 2)) {         // walk to the root
      this.t[x] = this.combine(this.t[2 * x], this.t[2 * x + 1]);
    }
  }

  query(l, r) {                                    // inclusive [l, r]
    let res = this.identity;
    let lo = l + this.n, hi = r + this.n + 1;      // half-open [lo, hi)
    while (lo < hi) {
      if (lo & 1) res = this.combine(res, this.t[lo++]);   // lo is a right child: take it
      if (hi & 1) res = this.combine(res, this.t[--hi]);   // hi is a right child: take hi-1
      lo = Math.floor(lo / 2); hi = Math.floor(hi / 2);
    }
    return res;
  }
}
\`\`\`

The segment tree stores an explicit binary tree of ranges: leaf \`n + i\` is element \`i\`, and every internal node holds the combination of its two children. Update rewrites one leaf and then repairs the \`log n\` ancestors on the path to the root. Query climbs from both ends, absorbing whole nodes whenever a node lies entirely inside the range — the two \`if (lo & 1)\` / \`if (hi & 1)\` tests are exactly "is this node a right child, meaning its parent sticks out of my range". Both operations are O(log n), and it works for **any associative combine** — min, max, gcd, matrix product — as long as you supply the matching identity value.

## Choosing between them

\`\`\`
                        build   update   range query   code size   operations
prefix sums (lesson 3)  O(n)    O(n)     O(1)          tiny        invertible, NO updates
Fenwick tree            O(n)    O(log n) O(log n)      small       invertible only (sum, xor)
segment tree            O(n)    O(log n) O(log n)      medium      any associative op
segment tree + lazy     O(n)    O(log n) O(log n)      large       + RANGE updates

Rule of thumb:
  no updates at all           -> prefix sums. Do not over-engineer.
  updates + sums only         -> Fenwick tree (half the code of a segment tree)
  updates + min/max/gcd       -> segment tree
  updates to a whole RANGE    -> segment tree with lazy propagation
\`\`\`

The most common mistake is reaching for a segment tree when the array never changes — this module's lesson 3 already solves that in five lines with O(1) queries. Match the structure to the operations, exactly as this course's Module 14 lesson 4 sets out.`,

    contentHi: `## Do bit loops bilkul sahi blocks kyun cover karte hain

\`\`\`
Fenwick slot x, x par KHATAM hone waale (x & -x) elements ka sum store karta hai.

x   binary   x & -x   cover (1-indexed)
1   0001     1        [1]
2   0010     2        [1..2]
3   0011     1        [3]
4   0100     4        [1..4]
5   0101     1        [5]
6   0110     2        [5..6]
7   0111     1        [7]
8   1000     8        [1..8]

prefix(7):  x = 7 se shuru -> t[7] jodo ([7] cover);   7 - 1 = 6
            x = 6 -> t[6] jodo ([5..6] cover);         6 - 2 = 4
            x = 4 -> t[4] jodo ([1..4] cover);         4 - 4 = 0  ruko
            blocks [7] + [5..6] + [1..4] = bilkul [1..7], koi overlap nahi, koi gap nahi.
            Teen steps kyunki 7 binary 111 hai — prati set bit ek step.

update(5): x = 5 se shuru -> t[5] [5] cover karta hai, ismein index 5 hai.  5 + 1 = 6
           x = 6 -> t[6] [5..6] cover karta hai, ismein 5 hai.              6 + 2 = 8
           x = 8 -> t[8] [1..8] cover karta hai, ismein 5 hai.              8 + 8 = 16 > n ruko
           Bilkul wo slots jinke block mein index 5 hai — prati level ek step.
\`\`\`

Lowest set bit ko baar-baar strip karna (\`x -= x & -x\`) har baar ek 1-bit hataata hai, isliye \`prefix\` utne steps leta hai jitne index mein set bits hain, zyaada se zyaada \`log2(n)\`. Lowest set bit jodna (\`x += x & -x\`) agle bade enclosing block tak upar carry karta hai, jo bhi zyaada se zyaada \`log2(n)\` baar hota hai. Dono bounds seedhe is tathya se aate hain ki \`n\` se neeche ek number mein zyaada se zyaada \`log2(n)\` bits hain — is course ke Module 13 lesson 2 ne \`x & -x\` identity khud derive ki.

## O(n log n) ke bajaye O(n) mein banaana

\`\`\`js
static from(a) {
  const ft = new FenwickTree(a.length);
  // har slot ko apne element se seed karo, phir har slot ko iske parent mein push karo
  for (let i = 0; i < a.length; i++) ft.t[i + 1] = a[i];
  for (let x = 1; x <= a.length; x++) {
    const parent = x + (x & -x);
    if (parent <= a.length) ft.t[parent] += ft.t[x];   // har slot ek baar yogdaan deta hai
  }
  return ft;
}
\`\`\`

\`update\` ko n baar call karna O(n log n) hai. Ye build O(n) hai: har slot apne akele parent mein bilkul ek baar joda jaata hai, isliye kul kaam prati slot ek addition hai. Wahi "har element ek bounded tadaad jagahon mein yogdaan deta hai" hisaab is course ke Module 8 lesson 3 mein O(n) heapify ke liye aaya.

## Jab ek Fenwick tree KAAFI NAHI hai: segment trees

\`\`\`
Ek Fenwick tree ek range ko prefix(j) - prefix(i-1) se compute karta hai. Wo
subtraction operation ke INVERTIBLE hone ki maang karta hai:
  sum      -> invertible (subtract)              Fenwick kaam karta hai
  xor      -> invertible (phir xor)              Fenwick kaam karta hai
  count    -> invertible (subtract)              Fenwick kaam karta hai
  min/max  -> invertible NAHI                    Fenwick kaam NAHI karta
  gcd      -> invertible NAHI                    Fenwick kaam NAHI karta

Aap min(a[0..7]) aur min(a[0..2]) se min(a[3..7]) recover nahi kar sakte.
Non-invertible par ASSOCIATIVE operations ke liye, ek segment tree istemal karo.
\`\`\`

\`\`\`js
// Iterative segment tree: size 2n, leaves t[n .. 2n-1] par rehte hain.
class SegmentTree {
  constructor(a, combine = (x, y) => Math.min(x, y), identity = Infinity) {
    this.n = a.length;
    this.combine = combine;
    this.identity = identity;
    this.t = new Array(2 * this.n).fill(identity);
    for (let i = 0; i < this.n; i++) this.t[this.n + i] = a[i];          // leaves
    for (let i = this.n - 1; i > 0; i--)                                 // internal nodes
      this.t[i] = combine(this.t[2 * i], this.t[2 * i + 1]);
  }

  update(i, value) {
    let x = this.n + i;
    this.t[x] = value;
    for (x = Math.floor(x / 2); x >= 1; x = Math.floor(x / 2)) {         // root tak chalo
      this.t[x] = this.combine(this.t[2 * x], this.t[2 * x + 1]);
    }
  }

  query(l, r) {                                    // inclusive [l, r]
    let res = this.identity;
    let lo = l + this.n, hi = r + this.n + 1;      // half-open [lo, hi)
    while (lo < hi) {
      if (lo & 1) res = this.combine(res, this.t[lo++]);   // lo ek right child hai: ise lo
      if (hi & 1) res = this.combine(res, this.t[--hi]);   // hi ek right child hai: hi-1 lo
      lo = Math.floor(lo / 2); hi = Math.floor(hi / 2);
    }
    return res;
  }
}
\`\`\`

Segment tree ranges ka ek explicit binary tree store karta hai: leaf \`n + i\` element \`i\` hai, aur har internal node apne do children ka combination rakhta hai. Update ek leaf dobara likhta hai aur phir root tak path par \`log n\` ancestors theek karta hai. Query dono chhoron se chadhta hai, poore nodes absorb karte hue jab bhi ek node poori tarah range ke andar hai — do \`if (lo & 1)\` / \`if (hi & 1)\` tests bilkul "kya ye node ek right child hai, matlab iska parent meri range se bahar nikalta hai" hain. Dono operations O(log n) hain, aur ye **kisi bhi associative combine** ke liye kaam karta hai — min, max, gcd, matrix product — jab tak aap matching identity value dete ho.

## Unke beech chunna

\`\`\`
                        build   update   range query   code size   operations
prefix sums (lesson 3)  O(n)    O(n)     O(1)          tiny        invertible, KOI updates NAHI
Fenwick tree            O(n)    O(log n) O(log n)      chhota      sirf invertible (sum, xor)
segment tree            O(n)    O(log n) O(log n)      medium      koi bhi associative op
segment tree + lazy     O(n)    O(log n) O(log n)      bada        + RANGE updates

Rule of thumb:
  bilkul koi updates nahi        -> prefix sums. Over-engineer mat karo.
  updates + sirf sums            -> Fenwick tree (segment tree ka aadha code)
  updates + min/max/gcd          -> segment tree
  ek poori RANGE par updates     -> lazy propagation ke saath segment tree
\`\`\`

Sabse aam galti ek segment tree ki taraf pahunchna hai jab array kabhi badalta hi nahi — is module ka lesson 3 pehle hi ise paanch lines mein O(1) queries ke saath solve karta hai. Structure ko operations se match karo, bilkul jaisa is course ka Module 14 lesson 4 batata hai.`,

    examples: [
      {
        title: 'Broken: rebuilding the prefix array on every update',
        titleHi: 'Toota: har update par prefix array dobara banaana',
        code: `update(i, value) {
  this.a[i] = value;
  this.p = buildPrefix(this.a);   // O(n) — throws away all the precomputation
}`,
        codeJs: `class RangeSumBroken {
  constructor(a) { this.a = a; this.p = this.build(a); }
  build(a) { const p = [0]; for (const x of a) p.push(p[p.length-1] + x); return p; }
  query(i, j) { return this.p[j + 1] - this.p[i]; }
  update(i, v) { this.a[i] = v; this.p = this.build(this.a); }
}
// n = 100000, q = 100000 updates -> ~10^10 operations -> minutes, not milliseconds`,
        codeTs: `class RangeSumBroken {
  private p: number[];
  constructor(private a: number[]) { this.p = this.build(a); }
  private build(a: number[]): number[] {
    const p = [0];
    for (const x of a) p.push(p[p.length - 1]! + x);
    return p;
  }
  query(i: number, j: number): number { return this.p[j + 1]! - this.p[i]!; }
  update(i: number, v: number): void { this.a[i] = v; this.p = this.build(this.a); }
}`,
        output: `// correct, but O(n) per update — O(q * n) for a mixed workload`,
        explain: 'Prefix sums assume the array is immutable. One changed element invalidates every prefix from that index onward, so the whole array is re-scanned, and the precomputation is paid for again on every single update.',
        explainHi: 'Prefix sums maante hain ki array immutable hai. Ek badla element us index se aage har prefix invalidate karta hai, isliye poora array dobara scan hota hai, aur precomputation har akele update par phir se pay hoti hai.',
      },
      {
        title: 'Fixed: Fenwick tree, both operations O(log n)',
        titleHi: 'Theek: Fenwick tree, dono operations O(log n)',
        code: `for (let x = i + 1; x <= n; x += x & -x) t[x] += delta;   // update: climb
for (let x = i + 1; x > 0;  x -= x & -x) s += t[x];      // prefix: descend`,
        codeJs: `class FenwickTree {
  constructor(n) { this.n = n; this.t = new Array(n + 1).fill(0); }
  update(i, delta) { for (let x = i + 1; x <= this.n; x += x & -x) this.t[x] += delta; }
  prefix(i) { let s = 0; for (let x = i + 1; x > 0; x -= x & -x) s += this.t[x]; return s; }
  query(i, j) { return this.prefix(j) - this.prefix(i - 1); }
}
const ft = new FenwickTree(8);
[3, 2, -1, 6, 5, 4, -3, 3].forEach((v, i) => ft.update(i, v));
console.log(ft.query(0, 7));   // 19
console.log(ft.query(2, 5));   // 14  (-1 + 6 + 5 + 4)
ft.update(3, 4);               // a[3] += 4, so a[3] becomes 10
console.log(ft.query(2, 5));   // 18  — the update cost only log(8) = 3 steps`,
        codeTs: `class FenwickTree {
  private t: number[];
  constructor(private n: number) { this.t = new Array<number>(n + 1).fill(0); }
  update(i: number, delta: number): void {
    for (let x = i + 1; x <= this.n; x += x & -x) this.t[x]! += delta;
  }
  prefix(i: number): number {
    let s = 0;
    for (let x = i + 1; x > 0; x -= x & -x) s += this.t[x]!;
    return s;
  }
  query(i: number, j: number): number { return this.prefix(j) - this.prefix(i - 1); }
}`,
        outputJs: `19
14
18`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each slot holds the sum of a power-of-two block ending at its index. prefix strips one set bit per step and update adds one per step, so both take at most log2(n) steps — the whole workload drops from O(q*n) to O(q log n).',
        explainHi: 'Har slot apne index par khatam hone waale ek power-of-two block ka sum rakhta hai. prefix prati step ek set bit strip karta hai aur update prati step ek jodta hai, isliye dono zyaada se zyaada log2(n) steps lete hain — poora workload O(q*n) se O(q log n) par girta hai.',
      },
      {
        title: 'Segment tree: range MIN, which a Fenwick tree cannot do',
        titleHi: 'Segment tree: range MIN, jo ek Fenwick tree nahi kar sakta',
        code: `// min is not invertible: you cannot get min(a[3..7]) from min(a[0..7]) and min(a[0..2])`,
        codeJs: `const st = new SegmentTree([5, 2, 8, 1, 9, 3], (x, y) => Math.min(x, y), Infinity);
console.log(st.query(0, 5));   // 1
console.log(st.query(0, 2));   // 2   (min of 5, 2, 8)
console.log(st.query(3, 5));   // 1   (min of 1, 9, 3)
st.update(3, 7);               // a[3] = 7
console.log(st.query(3, 5));   // 3   (min of 7, 9, 3) — one leaf write + log n repairs`,
        codeTs: `const st = new SegmentTree([5, 2, 8, 1, 9, 3], (x: number, y: number) => Math.min(x, y), Infinity);`,
        outputJs: `1
2
1
3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A segment tree stores the combined value for every range node, so a query assembles the answer from whole nodes without needing subtraction. That makes it work for any associative operation, not just invertible ones.',
        explainHi: 'Ek segment tree har range node ke liye combined value store karta hai, isliye ek query jawaab poore nodes se assemble karti hai bina subtraction ki zaroorat ke. Wo ise kisi bhi associative operation ke liye kaam karvaata hai, sirf invertible ke liye nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `// treating the Fenwick tree as 0-indexed
update(i, delta) { for (let x = i; x <= n; x += x & -x) t[x] += delta; }
// x = 0 -> 0 & -0 === 0 -> x += 0 -> INFINITE LOOP`,
        right: `update(i, delta) { for (let x = i + 1; x <= n; x += x & -x) t[x] += delta; }
// internally 1-indexed: index 0 becomes x = 1, and 1 & -1 === 1, so x advances`,
        why: 'A Fenwick tree must be 1-indexed because the bit trick relies on a non-zero lowest set bit. At x = 0 the expression x & -x is 0, so x never advances and the loop spins forever.',
        whyHi: 'Ek Fenwick tree 1-indexed hona chahiye kyunki bit trick ek non-zero lowest set bit par nirbhar karta hai. x = 0 par expression x & -x 0 hai, isliye x kabhi aage nahi badhta aur loop hamesha ghoomta hai.',
      },
      {
        wrong: `// passing an absolute value to update() instead of a delta
ft.update(i, newValue);   // Fenwick update ADDS — this corrupts every enclosing block`,
        right: `ft.update(i, newValue - currentValue[i]);   // pass the DIFFERENCE
currentValue[i] = newValue;                 // and keep the raw array alongside`,
        why: 'Fenwick update adds delta into every block containing i. Passing an absolute value adds it on top of what is already there. To set an element you must first know its current value and pass the difference, so keep the raw array too.',
        whyHi: 'Fenwick update i waale har block mein delta jodta hai. Ek absolute value pass karna ise pehle se maujood ke upar jodta hai. Ek element set karne ke liye aapko pehle iski current value jaanni chahiye aur antar pass karna chahiye, isliye raw array bhi rakho.',
      },
      {
        wrong: `// using a Fenwick tree for range minimum
ftMin.query(i, j) === ftMin.prefix(j) - ftMin.prefix(i - 1);   // meaningless for min`,
        right: `// min is not invertible — use a segment tree (or a sparse table if there are
// no updates at all).`,
        why: 'The Fenwick range query is a subtraction of two prefixes, which only recovers a range for invertible operations like sum and xor. There is no way to subtract one minimum from another to get the minimum of the difference range.',
        whyHi: 'Fenwick range query do prefixes ka ek subtraction hai, jo sirf sum aur xor jaise invertible operations ke liye ek range recover karta hai. Ek minimum se doosra subtract karke antar range ka minimum paane ka koi tarika nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Competitive-programming and database engines use Fenwick trees for running rank and order-statistics queries** — "how many records so far are below this value" with the counts changing as rows are inserted.',
        hi: '**Competitive-programming aur database engines running rank aur order-statistics queries ke liye Fenwick trees istemal karte hain** — "ab tak kitne records is value se neeche hain" counts ke saath jo rows insert hone par badalte hain.',
      },
      {
        en: '**Leaderboards and analytics dashboards** need "sum/count over this time window" while new events keep arriving — exactly the update-and-query mix that prefix sums cannot serve.',
        hi: '**Leaderboards aur analytics dashboards** ko "is time window par sum/count" chahiye jabki naye events aate rehte hain — bilkul wo update-and-query mix jise prefix sums serve nahi kar sakte.',
      },
      {
        en: '**Collaborative editors and interval schedulers use segment trees with lazy propagation** to apply an edit or a booking across a whole range in O(log n) rather than touching every position.',
        hi: '**Collaborative editors aur interval schedulers lazy propagation ke saath segment trees istemal karte hain** ek edit ya ek booking ko ek poori range par O(log n) mein lagaane ke liye na ki har position chhoo kar.',
      },
    ],

    interviewQA: [
      {
        q: 'You have an array with many range-sum queries AND many single-element updates. Walk through why prefix sums fail and what you would use instead.',
        qHi: 'Aapke paas bahut range-sum queries AUR bahut single-element updates waala ek array hai. Samjhaao prefix sums kyun fail hote hain aur aap iske bajaye kya istemal karoge.',
        a: 'Prefix sums work by precomputing, for every index, the sum of everything up to that index, which makes a range sum a single subtraction of two precomputed values, so queries are constant time. The precomputation, however, encodes the entire array: changing one element at position i invalidates every prefix value from i to the end, because each of those totals included the old value. Repairing them means walking from i to the end of the array, which is linear in the worst case, and rebuilding from scratch is linear too. So with q updates you pay q times n just for the updates, and that dominates everything the fast queries saved. If updates are as frequent as queries, the precomputation is a net loss compared to simply summing each range on demand. The structure that fixes this is a Fenwick tree, also called a binary indexed tree. Instead of storing one total per prefix, it stores partial sums over blocks whose sizes are powers of two, arranged so that any prefix can be assembled from at most log n of those blocks, and any single index belongs to at most log n of them. A prefix query starts at the index and repeatedly strips the lowest set bit, adding one block each time; an update starts at the index and repeatedly adds the lowest set bit, adjusting each enclosing block. Both loops run once per bit, so both are logarithmic, and a mixed workload of q updates and q queries costs q log n instead of q times n. For a hundred thousand of each that is roughly one and a half million operations instead of ten billion. I would add one caveat: the Fenwick range query is a subtraction of two prefixes, so it only works for invertible operations like sum, count, and xor. If the queries were range minimum or maximum or gcd, subtraction is meaningless and I would use a segment tree instead, which stores a combined value per range node and assembles answers from whole nodes without needing an inverse.',
        aHi: 'Prefix sums har index ke liye us index tak sab kuch ka sum precompute karke kaam karte hain, jo ek range sum ko do precomputed values ka ek akela subtraction banaata hai, isliye queries constant time hain. Precomputation, halaanki, poore array ko encode karti hai: position i par ek element badalna i se end tak har prefix value invalidate karta hai, kyunki un totals mein se har ek mein purani value thi. Unhe theek karna matlab i se array ke end tak chalna, jo worst case mein linear hai, aur shuru se dobara banaana bhi linear hai. Toh q updates ke saath aap sirf updates ke liye q guna n dete ho, aur wo har us cheez par haavi hai jo tez queries ne bachaayi. Agar updates queries jitne aksar hain, precomputation har range on demand sum karne ke muqaable ek net nuksaan hai. Jo structure ise theek karta hai wo ek Fenwick tree hai, jise binary indexed tree bhi kehte hain. Prati prefix ek total store karne ke bajaye, ye un blocks par partial sums store karta hai jinke sizes two ki powers hain, aise arrange kiye ki koi bhi prefix un blocks mein se zyaada se zyaada log n se assemble ho sake, aur koi bhi akela index unmein se zyaada se zyaada log n ka hissa ho. Ek prefix query index par shuru hoti hai aur baar-baar lowest set bit strip karti hai, har baar ek block jodte hue; ek update index par shuru hota hai aur baar-baar lowest set bit jodta hai, har enclosing block adjust karte hue. Dono loops prati bit ek baar chalte hain, isliye dono logarithmic hain. Ek caveat: Fenwick range query do prefixes ka subtraction hai, isliye ye sirf sum, count, aur xor jaise invertible operations ke liye kaam karta hai. Agar queries range minimum ya maximum ya gcd hoti, subtraction arthheen hai aur main iske bajaye ek segment tree istemal karta.',
      },
      {
        q: 'When would you choose a segment tree over a Fenwick tree, and when is neither the right answer?',
        qHi: 'Aap ek Fenwick tree ke muqaable ek segment tree kab chunoge, aur kab koi bhi sahi jawaab nahi hai?',
        a: 'The deciding factor between the two is whether the operation you need is invertible. A Fenwick tree answers a range by computing the prefix up to the right end and subtracting the prefix up to just before the left end. That subtraction is only meaningful when the operation has an inverse, which is true for sum, for count, and for xor, since xor is its own inverse. It is not true for minimum, maximum, or greatest common divisor: knowing the minimum of the first eight elements and the minimum of the first two tells you nothing about the minimum of elements three through eight, because the overall minimum may have come from either part and cannot be cancelled out. A segment tree does not subtract. It stores, for every node, the combined value of the range that node covers, and a query walks up from both ends absorbing entire nodes that lie fully inside the requested range. Since it only ever combines and never inverts, it works for any associative operation, which covers min, max, gcd, matrix products, and custom merges. The price is roughly double the code and double the memory, so when the operation is a sum I prefer the Fenwick tree for being short and hard to get wrong. A segment tree with lazy propagation is the next step up, needed when updates apply to a whole range at once rather than to a single element. Neither is the right answer in two situations. If the array never changes, prefix sums from earlier in this module already give constant-time queries with a five-line build, and a tree is pure over-engineering. And if the array never changes but the query is a minimum, a sparse table gives constant-time range minimum after an n log n build, which beats a segment tree for that specific read-only case.',
        aHi: 'Dono ke beech nirnaayak factor ye hai ki jo operation aapko chahiye wo invertible hai ya nahi. Ek Fenwick tree ek range ka jawaab right end tak prefix compute karke aur left end se theek pehle tak prefix subtract karke deta hai. Wo subtraction tabhi arthpoorn hai jab operation ka ek inverse hai, jo sum, count, aur xor ke liye sach hai, kyunki xor apna khud ka inverse hai. Ye minimum, maximum, ya greatest common divisor ke liye sach nahi hai: pehle aath elements ka minimum aur pehle do ka minimum jaanna aapko elements teen se aath ke minimum ke baare mein kuch nahi batata, kyunki kul minimum kisi bhi hisse se aa sakta tha aur cancel nahi kiya jaa sakta. Ek segment tree subtract nahi karta. Ye har node ke liye us range ki combined value store karta hai jo node cover karta hai, aur ek query dono chhoron se upar chalti hai poore nodes absorb karte hue jo poori tarah maangi gayi range ke andar hain. Kyunki ye sirf combine karta hai aur kabhi invert nahi, ye kisi bhi associative operation ke liye kaam karta hai. Keemat lagbhag do guna code aur do guni memory hai, isliye jab operation ek sum hai main Fenwick tree prefer karta hoon chhota aur galat karna mushkil hone ke liye. Lazy propagation ke saath ek segment tree agla step hai, zaroori jab updates ek akele element ke bajaye ek poori range par ek saath lagte hain. Do situations mein koi bhi sahi jawaab nahi. Agar array kabhi nahi badalta, is module mein pehle ke prefix sums pehle se ek paanch-line build ke saath constant-time queries dete hain, aur ek tree shuddh over-engineering hai. Aur agar array kabhi nahi badalta par query ek minimum hai, ek sparse table ek n log n build ke baad constant-time range minimum deta hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement FenwickTree with update, prefix and query. Build it from [3,2,-1,6,5,4,-3,3] and verify query(0,7)=19, query(2,5)=14. Then check every range (i,j) against a brute-force sum over the raw array.',
        taskHi: 'update, prefix aur query ke saath FenwickTree implement karo. Ise [3,2,-1,6,5,4,-3,3] se banao aur verify karo query(0,7)=19, query(2,5)=14. Phir har range (i,j) ko raw array par ek brute-force sum ke against check karo.',
        hint: 'Loop all pairs i <= j and compare ft.query(i,j) with a.slice(i, j+1).reduce((s,x)=>s+x, 0). Any mismatch usually means an off-by-one in the 1-indexing.',
        hintHi: 'Sab pairs i <= j loop karo aur ft.query(i,j) ko a.slice(i, j+1).reduce((s,x)=>s+x, 0) se compare karo. Koi bhi mismatch aksar 1-indexing mein ek off-by-one matlab hai.',
      },
      {
        task: 'Deliberately make the Fenwick tree 0-indexed (drop the + 1) and observe the infinite loop at index 0. Then instrument update and prefix with a step counter and confirm both take at most ceil(log2(n)) steps for every index.',
        taskHi: 'Jaan-boojhkar Fenwick tree ko 0-indexed banao (+ 1 hatao) aur index 0 par infinite loop dekho. Phir update aur prefix ko ek step counter se instrument karo aur confirm karo dono har index ke liye zyaada se zyaada ceil(log2(n)) steps lete hain.',
        hint: 'At x = 0, x & -x is 0, so x += 0 never advances. For the counter, an index with many set bits (like 7 = 111) takes the most steps in prefix; a low index takes the most in update.',
        hintHi: 'x = 0 par, x & -x 0 hai, isliye x += 0 kabhi aage nahi badhta. Counter ke liye, bahut set bits waala ek index (jaise 7 = 111) prefix mein sabse zyaada steps leta hai; ek low index update mein sabse zyaada.',
      },
      {
        task: 'Implement the iterative SegmentTree with a pluggable combine. Instantiate it three times over the same array — with min, with max, and with sum — and verify each against brute force, including after several updates.',
        taskHi: 'Ek pluggable combine ke saath iterative SegmentTree implement karo. Ise usi array par teen baar instantiate karo — min ke saath, max ke saath, aur sum ke saath — aur har ek ko brute force ke against verify karo, kai updates ke baad sameet.',
        hint: 'The identity must match the operation: Infinity for min, -Infinity for max, 0 for sum. Passing the wrong identity gives answers that are correct for full ranges but wrong for partial ones.',
        hintHi: 'Identity operation se match honi chahiye: min ke liye Infinity, max ke liye -Infinity, sum ke liye 0. Galat identity pass karna aise jawaab deta hai jo poori ranges ke liye sahi par partial ke liye galat hain.',
      },
    ],

    keyTakeaways: [
      'Prefix sums give O(1) range queries but assume the array never changes — one update invalidates every later prefix, so a mixed update/query workload is O(q * n).',
      'A Fenwick tree (binary indexed tree) stores partial sums over power-of-two blocks, giving O(log n) point update AND O(log n) prefix query; a mixed workload drops to O(q log n).',
      'Both Fenwick loops move by the lowest set bit: prefix strips it (x -= x & -x) walking down, update adds it (x += x & -x) walking up. A number has at most log2(n) bits, which is the bound.',
      'A Fenwick tree MUST be 1-indexed — at x = 0 the expression x & -x is 0 and the loop never advances. Also, update() ADDS a delta; to set a value, pass newValue minus the current one.',
      'Fenwick only works for INVERTIBLE operations (sum, count, xor), because a range is prefix(j) - prefix(i-1). For min, max, or gcd use a segment tree, which combines whole nodes and never needs an inverse.',
      'Match the structure to the workload: no updates -> prefix sums; updates + sums -> Fenwick; updates + non-invertible ops -> segment tree; range updates -> segment tree with lazy propagation.',
    ],
    keyTakeawaysHi: [
      'Prefix sums O(1) range queries dete hain par maante hain ki array kabhi nahi badalta — ek update har baad ka prefix invalidate karta hai, isliye ek mixed update/query workload O(q * n) hai.',
      'Ek Fenwick tree (binary indexed tree) power-of-two blocks par partial sums store karta hai, O(log n) point update AUR O(log n) prefix query deta hai; ek mixed workload O(q log n) par girta hai.',
      'Dono Fenwick loops lowest set bit se move karte hain: prefix ise strip karta hai (x -= x & -x) neeche chalte hue, update ise jodta hai (x += x & -x) upar chalte hue. Ek number mein zyaada se zyaada log2(n) bits hain, jo bound hai.',
      'Ek Fenwick tree 1-indexed HONA CHAHIYE — x = 0 par expression x & -x 0 hai aur loop kabhi aage nahi badhta. Saath hi, update() ek delta JODTA hai; ek value set karne ke liye, newValue minus current pass karo.',
      'Fenwick sirf INVERTIBLE operations (sum, count, xor) ke liye kaam karta hai, kyunki ek range prefix(j) - prefix(i-1) hai. min, max, ya gcd ke liye ek segment tree istemal karo, jo poore nodes combine karta hai aur kabhi ek inverse nahi chahta.',
      'Structure ko workload se match karo: koi updates nahi -> prefix sums; updates + sums -> Fenwick; updates + non-invertible ops -> segment tree; range updates -> lazy propagation ke saath segment tree.',
    ],
  },
];
