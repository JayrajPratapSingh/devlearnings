/**
 * DSA Complete Course — Module 12: Greedy Algorithms, lesson 3.
 *
 * Greedy that repeatedly picks the best pair/element via a heap: Huffman coding
 * is the canonical example, and "minimum cost to connect ropes / merge stones
 * pairwise" is the same algorithm. Builds on this module's lessons 1 and 2 (the
 * greedy-choice property, the exchange argument) and this course's Module 8 (the
 * min-heap). Broken example: building a Huffman-style merge tree by combining
 * items in arbitrary order (e.g. left to right) — this produces a valid tree but
 * not one with minimum total weighted depth, so the resulting code is longer
 * than necessary. Fixed by always merging the TWO SMALLEST remaining items,
 * pulled from a min-heap, and pushing their combined weight back. Each merge is
 * O(log n) and there are n-1 merges, so O(n log n). The exchange argument: in an
 * optimal tree the two lowest-frequency symbols can always be made siblings at
 * the deepest level, so merging them first loses nothing.
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

export const DSA_MODULE_12_PART3: CourseLesson[] = [
  {
    slug: 'greedy-with-a-heap-huffman',
    title: 'Greedy With a Heap: Huffman Coding and Pairwise Merging',
    titleHi: 'Ek Heap Ke Saath Greedy: Huffman Coding Aur Pairwise Merging',
    description: 'Building a merge tree for Huffman coding by combining symbols in whatever order they appear, two at a time, left to right. Every merge is valid and you end with one tree, but its total weighted path length is not minimal, so the codes it assigns are longer on average than they need to be.',
    descriptionHi: 'Huffman coding ke liye ek merge tree banaana symbols ko jis order mein wo aate hain us mein combine karke, ek baar mein do, left se right. Har merge valid hai aur aap ek tree ke saath khatam hote ho, par iski kul weighted path length minimal nahi hai, isliye ye jo codes assign karta hai wo average mein zaroorat se lambe hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Combining a pile of weighted sacks into one, two at a time, where each combine costs the sum of the two sacks\' weights and you want the least total cost.** If you combine sacks carelessly — grab any two, merge, repeat — a heavy sack can end up being combined again and again, paying its weight into the total every single time it is part of a merge. The cheap strategy is the opposite: always combine the two LIGHTEST sacks currently in the pile. A light sack merged early becomes part of a heavier sack, but the heaviest sacks are only touched at the very end, so they contribute to the total the fewest number of times. Concretely, the number of times a sack\'s original weight is added to the total equals how many merges it participates in, which equals its depth in the tree of merges. Merging light things first pushes the light things deep (many merges, but small weight) and keeps the heavy things shallow (few merges). To always find the two lightest quickly, keep the sacks in a min-heap: pull two, merge, push the combined sack back, repeat until one remains.',
      hi: '**Weighted sacks ke ek dher ko ek mein combine karna, ek baar mein do, jahaan har combine do sacks ke weights ka sum kharch karta hai aur aap sabse kam kul cost chahte ho.** Agar aap sacks ko carelessly combine karte ho — koi bhi do lo, merge karo, dohraao — ek bhaari sack baar-baar combine ho sakta hai, har baar jab ye ek merge ka hissa hai apna weight total mein deta hua. Sasti strategy ulta hai: hamesha dher mein abhi ke do SABSE HALKE sacks combine karo. Ek halka sack jaldi merge kiya ek bhaari sack ka hissa banta hai, par sabse bhaari sacks sirf bilkul ant mein chhue jaate hain, isliye wo total mein sabse kam baar yogdaan dete hain. Thos roop se, ek sack ka original weight total mein kitni baar joda jaata hai wo iske hisse waali merges ki tadaad ke barabar hai, jo merges ke tree mein iski depth ke barabar hai. Halki cheezein pehle merge karna halki cheezon ko gehra dhakelta hai (kayi merges, par chhota weight) aur bhaari cheezon ko chhichhla rakhta hai (kam merges). Do sabse halke ko hamesha jaldi dhoondhne ke liye, sacks ko ek min-heap mein rakho: do nikaalo, merge karo, combined sack wapas push karo, dohraao jab tak ek bache.',
    },

    simple: `**Start broken.** Build a merge tree by combining items in given order:

\`\`\`js
function mergeCostBroken(weights) {
  let list = [...weights];
  let cost = 0;
  while (list.length > 1) {
    const a = list.shift(), b = list.shift();     // just take the first two
    cost += a + b;
    list.push(a + b);                             // put the merged item at the end
  }
  return cost;
}

// weights = [4, 3, 2, 6]
// merge 4+3 = 7 (cost 7), list [2, 6, 7]
// merge 2+6 = 8 (cost 15), list [7, 8]
// merge 7+8 = 15 (cost 30). Total 30.
// Optimal: merge 2+3=5, then 4+5=9, then 6+9=15 -> total 29.
\`\`\`

Combining in arbitrary order lets a large partial sum get merged again early, paying its whole weight into the total repeatedly. The total cost equals the sum over all original items of (item weight times its depth in the merge tree), so you want heavy items shallow.

**The fix: always merge the two smallest, via a min-heap**

\`\`\`js
function mergeCost(weights) {
  const heap = new MinHeap();                     // this course's Module 8
  for (const w of weights) heap.insert(w);

  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.extractMin();
    const b = heap.extractMin();
    cost += a + b;
    heap.insert(a + b);                           // the combined item re-enters the contest
  }
  return cost;
}
\`\`\`

\`\`\`ts
function mergeCost(weights: number[]): number {
  const heap = new MinHeapOf<number>((x, y) => x - y);
  for (const w of weights) heap.insert(w);
  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.extractMin()!;
    const b = heap.extractMin()!;
    cost += a + b;
    heap.insert(a + b);
  }
  return cost;
}
\`\`\`

Pull the two smallest, merge them (adding their sum to the running cost), and push the combined weight back so it competes to be merged again. \`n - 1\` merges, each with two \`extractMin\`s and one \`insert\` at O(log n): total **O(n log n)**.

**Huffman coding is exactly this, tracking the tree**

\`\`\`js
function huffman(freqs) {   // freqs: { symbol -> count }
  const heap = new MinHeap();  // nodes ordered by weight
  for (const [sym, f] of Object.entries(freqs)) heap.insert({ weight: f, sym, left: null, right: null });

  while (heap.size() > 1) {
    const a = heap.extractMin();
    const b = heap.extractMin();
    heap.insert({ weight: a.weight + b.weight, sym: null, left: a, right: b });
  }
  const root = heap.extractMin();

  // assign codes: left = '0', right = '1'
  const codes = {};
  (function walk(node, path) {
    if (node.sym !== null) { codes[node.sym] = path || '0'; return; }
    walk(node.left, path + '0');
    walk(node.right, path + '1');
  })(root, '');
  return codes;
}
\`\`\`

The two rarest symbols become siblings at the bottom (longest codes); the commonest symbol ends up shallow (shortest code). This minimises the expected code length, which is the sum over symbols of (frequency times code length) — the same quantity as the merge cost above.`,

    simpleHi: `**Toote hue se shuru.** Items ko diye gaye order mein combine karke ek merge tree banao:

\`\`\`js
function mergeCostBroken(weights) {
  let list = [...weights];
  let cost = 0;
  while (list.length > 1) {
    const a = list.shift(), b = list.shift();     // bas pehle do lo
    cost += a + b;
    list.push(a + b);                             // merged item ant mein rakho
  }
  return cost;
}

// weights = [4, 3, 2, 6]
// merge 4+3 = 7 (cost 7), list [2, 6, 7]
// merge 2+6 = 8 (cost 15), list [7, 8]
// merge 7+8 = 15 (cost 30). Total 30.
// Optimal: merge 2+3=5, phir 4+5=9, phir 6+9=15 -> total 29.
\`\`\`

Arbitrary order mein combine karna ek bade partial sum ko dobara jaldi merge hone deta hai, apna poora weight total mein baar-baar deta hua. Kul cost sab original items par (item weight guna merge tree mein iski depth) ke sum ke barabar hai, isliye aap bhaari items chhichhle chahte ho.

**Fix: hamesha do sabse chhote merge karo, ek min-heap ke zariye**

\`\`\`js
function mergeCost(weights) {
  const heap = new MinHeap();                     // is course ka Module 8
  for (const w of weights) heap.insert(w);

  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.extractMin();
    const b = heap.extractMin();
    cost += a + b;
    heap.insert(a + b);                           // combined item dobara contest mein aata hai
  }
  return cost;
}
\`\`\`

\`\`\`ts
function mergeCost(weights: number[]): number {
  const heap = new MinHeapOf<number>((x, y) => x - y);
  for (const w of weights) heap.insert(w);
  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.extractMin()!;
    const b = heap.extractMin()!;
    cost += a + b;
    heap.insert(a + b);
  }
  return cost;
}
\`\`\`

Do sabse chhote nikaalo, unhe merge karo (unka sum running cost mein jodte hue), aur combined weight wapas push karo taaki ye dobara merge hone ke liye compete kare. \`n - 1\` merges, har ek do \`extractMin\`s aur ek \`insert\` O(log n) par: kul **O(n log n)**.

**Huffman coding bilkul ye hai, tree track karte hue**

\`\`\`js
function huffman(freqs) {   // freqs: { symbol -> count }
  const heap = new MinHeap();  // nodes weight se ordered
  for (const [sym, f] of Object.entries(freqs)) heap.insert({ weight: f, sym, left: null, right: null });

  while (heap.size() > 1) {
    const a = heap.extractMin();
    const b = heap.extractMin();
    heap.insert({ weight: a.weight + b.weight, sym: null, left: a, right: b });
  }
  const root = heap.extractMin();

  // codes assign karo: left = '0', right = '1'
  const codes = {};
  (function walk(node, path) {
    if (node.sym !== null) { codes[node.sym] = path || '0'; return; }
    walk(node.left, path + '0');
    walk(node.right, path + '1');
  })(root, '');
  return codes;
}
\`\`\`

Do sabse durlabh symbols bottom par siblings bante hain (sabse lambe codes); sabse aam symbol chhichhla khatam hota hai (sabse chhota code). Ye expected code length minimise karta hai, jo symbols par (frequency guna code length) ka sum hai — upar ke merge cost jaisi hi quantity.`,

    content: `## Why "merge the two smallest" is optimal: the exchange argument

\`\`\`
Claim: there is an optimal merge tree in which the two smallest items x and y
are siblings at the maximum depth.

Proof: take any optimal tree. Let a and b be two siblings at the maximum depth
(some pair always is). Suppose x (a smallest item) is not one of them; x sits
at some shallower or equal depth. Swap x with a. The change in total cost is
(depth(a) - depth(x)) * (x - a). Since a is at max depth, depth(a) >= depth(x),
and since x is a smallest item, x <= a, so the product is <= 0 — cost did not
increase. Do the same to put y opposite x. Now x and y are the deepest siblings
in a tree that is still optimal. Merging x and y first builds exactly that
sibling pair, so the greedy first step loses nothing, and the rest is a smaller
instance of the same problem.
\`\`\`

This is the same exchange-argument shape as interval scheduling in lesson 1: assume an optimal solution, show a swap toward the greedy choice never makes it worse.

## The cost formula that both problems minimise

\`\`\`
total cost = sum over leaves of (leaf weight) x (leaf depth)

Merge cost: every time an item is inside a merge, its weight is added once. An
  item at depth d is inside d merges (once at each level on the way up).
Huffman: the compressed size in bits is sum of (symbol frequency) x (code
  length), and code length = leaf depth.

Same objective. Both are minimised by pushing large weights toward the root
(shallow) and small weights toward the leaves (deep), which is precisely what
"always merge the two smallest" does.
\`\`\`

## Variants that are the same algorithm

\`\`\`
"Connect n ropes into one at minimum cost, cost = sum of the two joined"
    -> mergeCost exactly.

"Minimum cost to merge stones" (K=2 case)
    -> mergeCost. (General K needs interval DP, Module 11 lesson 6.)

"Last stone weight II" is NOT this — it is a subset-sum / partition DP, because
    the operation is a DIFFERENCE not a sum. Watch for the operation.
\`\`\`

## Ties, and why they do not matter

\`\`\`
When several items share the smallest weight, it does not matter which two the
heap hands you — any choice among equal-weight smallest items leads to the same
minimum total cost, because the exchange argument only used "x <= a" and
"y <= b", which hold for any smallest pair.
\`\`\`

So a stable tie-break in the heap is a nicety for reproducible output, not a
correctness requirement.

## A quick MinHeapOf for objects

\`\`\`ts
class MinHeapOf<T> {
  private a: T[] = [];
  constructor(private cmp: (x: T, y: T) => number) {}
  size() { return this.a.length; }
  insert(v: T) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(this.a[p]!, this.a[i]!) <= 0) break;
      [this.a[i], this.a[p]] = [this.a[p]!, this.a[i]!];
      i = p;
    }
  }
  extractMin(): T | undefined {
    const n = this.a.length;
    if (n === 0) return undefined;
    const min = this.a[0];
    const last = this.a.pop()!;
    if (n > 1) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i; const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.a.length && this.cmp(this.a[l]!, this.a[s]!) < 0) s = l;
        if (r < this.a.length && this.cmp(this.a[r]!, this.a[s]!) < 0) s = r;
        if (s === i) break;
        [this.a[i], this.a[s]] = [this.a[s]!, this.a[i]!];
        i = s;
      }
    }
    return min;
  }
}
\`\`\``,

    contentHi: `## "Do sabse chhote merge karo" optimal kyun hai: exchange argument

\`\`\`
Daawa: ek optimal merge tree hai jismein do sabse chhote items x aur y
maximum depth par siblings hain.

Proof: koi optimal tree lo. a aur b maximum depth par do siblings hon (koi pair
hamesha hota hai). Maano x (ek sabse chhota item) unmein se ek nahi hai; x kisi
chhichhle ya barabar depth par hai. x ko a se swap karo. Kul cost mein badlaav
(depth(a) - depth(x)) * (x - a) hai. Kyunki a max depth par hai, depth(a) >=
depth(x), aur kyunki x ek sabse chhota item hai, x <= a, isliye product <= 0 —
cost nahi badhi. Wahi karo y ko x ke opposite rakhne ke liye. Ab x aur y ek
tree mein sabse gehre siblings hain jo abhi bhi optimal hai. x aur y ko pehle
merge karna bilkul wo sibling pair banaata hai, isliye greedy pehla step kuch
nahi khota, aur baaki usi problem ka ek chhota instance hai.
\`\`\`

Ye lesson 1 mein interval scheduling jaisa hi exchange-argument shape hai: ek optimal solution maano, dikhao greedy choice ki taraf ek swap ise kabhi kharab nahi karta.

## Wo cost formula jo dono problems minimise karti hain

\`\`\`
total cost = leaves par (leaf weight) x (leaf depth) ka sum

Merge cost: har baar jab ek item ek merge ke andar hai, iska weight ek baar joda
  jaata hai. Depth d par ek item d merges ke andar hai (upar jaate waqt har level
  par ek baar).
Huffman: bits mein compressed size (symbol frequency) x (code length) ka sum hai,
  aur code length = leaf depth.

Wahi objective. Dono bade weights ko root ki taraf (chhichhla) aur chhote weights
ko leaves ki taraf (gehra) dhakelne se minimise hote hain, jo bilkul wo hai jo
"hamesha do sabse chhote merge karo" karta hai.
\`\`\`

## Variants jo wahi algorithm hain

\`\`\`
"n ropes ko minimum cost par ek mein connect karo, cost = do joined ka sum"
    -> mergeCost bilkul.

"Stones merge karne ki minimum cost" (K=2 case)
    -> mergeCost. (General K ko interval DP chahiye, Module 11 lesson 6.)

"Last stone weight II" ye NAHI hai — ye ek subset-sum / partition DP hai, kyunki
    operation ek ANTAR hai ek sum nahi. Operation ke liye dhyaan do.
\`\`\`

## Ties, aur wo kyun maayne nahi rakhti

\`\`\`
Jab kayi items sabse chhota weight share karte hain, ye maayne nahi rakhta ki heap
aapko kaunse do deta hai — equal-weight sabse chhote items mein koi bhi choice usi
minimum kul cost tak le jaati hai, kyunki exchange argument ne sirf "x <= a" aur
"y <= b" istemal kiya, jo kisi bhi sabse chhote pair ke liye hold karte hain.
\`\`\`

Toh heap mein ek stable tie-break reproducible output ke liye ek nicety hai, ek correctness requirement nahi.

## Objects ke liye ek quick MinHeapOf

\`\`\`ts
class MinHeapOf<T> {
  private a: T[] = [];
  constructor(private cmp: (x: T, y: T) => number) {}
  size() { return this.a.length; }
  insert(v: T) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cmp(this.a[p]!, this.a[i]!) <= 0) break;
      [this.a[i], this.a[p]] = [this.a[p]!, this.a[i]!];
      i = p;
    }
  }
  extractMin(): T | undefined {
    const n = this.a.length;
    if (n === 0) return undefined;
    const min = this.a[0];
    const last = this.a.pop()!;
    if (n > 1) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i; const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.a.length && this.cmp(this.a[l]!, this.a[s]!) < 0) s = l;
        if (r < this.a.length && this.cmp(this.a[r]!, this.a[s]!) < 0) s = r;
        if (s === i) break;
        [this.a[i], this.a[s]] = [this.a[s]!, this.a[i]!];
        i = s;
      }
    }
    return min;
  }
}
\`\`\``,

    examples: [
      {
        title: 'Broken: merge in arbitrary order',
        titleHi: 'Toota: arbitrary order mein merge',
        code: `const a = list.shift(), b = list.shift();
cost += a + b;
list.push(a + b);`,
        codeJs: `function mergeCostBroken(weights) {
  let list = [...weights], cost = 0;
  while (list.length > 1) {
    const a = list.shift(), b = list.shift();
    cost += a + b;
    list.push(a + b);
  }
  return cost;
}
console.log(mergeCostBroken([4, 3, 2, 6])); // 30  — optimal is 29`,
        codeTs: `function mergeCostBroken(weights: number[]): number {
  let list = [...weights], cost = 0;
  while (list.length > 1) {
    const a = list.shift()!, b = list.shift()!;
    cost += a + b;
    list.push(a + b);
  }
  return cost;
}`,
        output: `30`,
        explain: 'Merging the first two (4+3=7) puts a large partial sum back early, so it gets merged again while still large, paying its weight into the total an extra time.',
        explainHi: 'Pehle do merge karna (4+3=7) ek bade partial sum ko jaldi wapas rakhta hai, isliye ye abhi bhi bade hote hue dobara merge hota hai, apna weight total mein ek extra baar deta hua.',
      },
      {
        title: 'Fixed: merge the two smallest via a min-heap',
        titleHi: 'Theek: ek min-heap ke zariye do sabse chhote merge karo',
        code: `const a = heap.extractMin(), b = heap.extractMin();
cost += a + b;
heap.insert(a + b);`,
        codeJs: `function mergeCost(weights) {
  const heap = new MinHeapOf((x, y) => x - y);
  for (const w of weights) heap.insert(w);
  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.extractMin(), b = heap.extractMin();
    cost += a + b;
    heap.insert(a + b);
  }
  return cost;
}
console.log(mergeCost([4, 3, 2, 6])); // 29  (2+3=5, 4+5=9, 6+9=15)`,
        codeTs: `function mergeCost(weights: number[]): number {
  const heap = new MinHeapOf<number>((x, y) => x - y);
  for (const w of weights) heap.insert(w);
  let cost = 0;
  while (heap.size() > 1) {
    const a = heap.extractMin()!, b = heap.extractMin()!;
    cost += a + b;
    heap.insert(a + b);
  }
  return cost;
}`,
        outputJs: `29`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Small weights are merged early and end up deep; large weights are merged last and stay shallow, so each large weight is added to the total the fewest times. O(n log n) with the heap.',
        explainHi: 'Chhote weights jaldi merge hote hain aur gehre khatam hote hain; bade weights aakhri mein merge hote hain aur chhichhle rehte hain, isliye har bada weight total mein sabse kam baar joda jaata hai. Heap ke saath O(n log n).',
      },
      {
        title: 'Huffman: the two rarest symbols get the longest codes',
        titleHi: 'Huffman: do sabse durlabh symbols ko sabse lambe codes milte hain',
        code: `heap.insert({ weight: a.weight + b.weight, left: a, right: b });`,
        codeJs: `// freqs { a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 }
// merges: (5,9)->14, (12,13)->25, (14,16)->30, (25,30)->55, (45,55)->100
// codes: f='0', c='100', d='101', a='1100', b='1101', e='111'
// 'a' and 'b' (rarest) get 4-bit codes; 'f' (commonest) gets 1 bit.`,
        codeTs: `// The tree is built by repeatedly merging the two lowest-weight nodes.
// Expected bits per symbol = sum(freq_i * codelen_i) is minimised.`,
        output: `f='0', e='111', c='100', d='101', a='1100', b='1101'`,
        explain: 'Because merges always combine the two smallest, the least frequent symbols sink to the deepest leaves (longest codes) and the most frequent stays near the root (shortest code), minimising total encoded length.',
        explainHi: 'Kyunki merges hamesha do sabse chhote combine karti hain, sabse kam frequent symbols sabse gehre leaves tak doobte hain (sabse lambe codes) aur sabse frequent root ke paas rehta hai (sabse chhota code), kul encoded length minimise karte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `// merging the two LARGEST instead of the two smallest
const a = heap.extractMax(), b = heap.extractMax();`,
        right: `const a = heap.extractMin(), b = heap.extractMin();`,
        why: 'Merging largest-first makes big weights deep (many merges, big cost each) and small weights shallow — it maximises the total instead of minimising it. The objective is minimised by heavy-shallow, light-deep.',
        whyHi: 'Largest-first merge karna bade weights ko gehra banaata hai (kayi merges, har ek badi cost) aur chhote weights ko chhichhla — ye total ko minimise karne ke bajaye maximise karta hai. Objective heavy-shallow, light-deep se minimise hota hai.',
      },
      {
        wrong: `// forgetting to push the merged weight back into the heap
const a = heap.extractMin(), b = heap.extractMin();
cost += a + b;
// missing: heap.insert(a + b);  -> the combined group never gets merged again`,
        right: `cost += a + b;
heap.insert(a + b);   // the combined group re-enters and will be merged later`,
        why: 'A merge produces a new group whose weight must keep participating. Dropping it means the tree never fully connects and the cost is wrong (and the heap empties too early).',
        whyHi: 'Ek merge ek naya group banaata hai jiska weight participate karta rehna chahiye. Ise drop karna matlab tree kabhi poori tarah connect nahi hota aur cost galat hai (aur heap bahut jaldi khaali ho jaata hai).',
      },
      {
        wrong: `// using this greedy for "minimum cost to merge stones" with K > 2 groups per merge`,
        right: `// K = 2 -> this greedy. K > 2 (merge exactly K adjacent piles) -> interval DP
// (Module 11 lesson 6), because the merges are constrained to be adjacent.`,
        why: 'The pairwise "merge any two smallest" greedy assumes any two groups can be merged. When merges must combine K adjacent piles, adjacency constraints break the greedy and you need an interval DP.',
        whyHi: 'Pairwise "koi bhi do sabse chhote merge karo" greedy maanta hai ki koi bhi do groups merge ho sakte hain. Jab merges ko K adjacent piles combine karna hai, adjacency constraints greedy ko todte hain aur aapko ek interval DP chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Huffman coding is inside ZIP, gzip, JPEG, PNG and MP3** — the final entropy-coding stage that assigns shorter bit patterns to more frequent symbols.',
        hi: '**Huffman coding ZIP, gzip, JPEG, PNG aur MP3 ke andar hai** — antim entropy-coding stage jo zyaada frequent symbols ko chhote bit patterns assign karta hai.',
      },
      {
        en: '**File and log merging pipelines** that combine sorted runs pairwise choose the two smallest runs each round to minimise total bytes moved — the same "merge the two smallest" greedy.',
        hi: '**File aur log merging pipelines** jo sorted runs ko pairwise combine karti hain har round do sabse chhote runs chunte hain kul bytes moved minimise karne ke liye — wahi "do sabse chhote merge karo" greedy.',
      },
      {
        en: '**Optimal prefix codes for network protocols and databases** (dictionary-style column compression) are built with Huffman or its variant, Package-Merge, for length-limited codes.',
        hi: '**Network protocols aur databases ke liye optimal prefix codes** (dictionary-style column compression) Huffman ya iske variant, Package-Merge se banaaye jaate hain, length-limited codes ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does "always merge the two smallest" minimise the total merge cost? Give the exchange argument.',
        qHi: '"Hamesha do sabse chhote merge karo" kul merge cost kyun minimise karta hai? Exchange argument do.',
        a: 'The total cost of a sequence of pairwise merges equals, for each original item, its weight multiplied by the number of merges it participates in, and that number is exactly the item\'s depth in the binary tree of merges. So minimising total cost means arranging the tree so that heavy items are shallow, near the root, and light items are deep, near the leaves. The greedy always merges the two currently-smallest items and pushes their combined weight back. To see this is optimal, take any optimal merge tree and look at two leaves that are siblings at the maximum depth; such a pair always exists because the deepest level has at least two nodes and a node at max depth has a sibling. Call them a and b. Let x be one of the two globally smallest original items. If x is not already one of a or b, x sits at some depth no greater than the maximum. Swap the positions of x and a in the tree. The total cost changes by the depth of a minus the depth of x, times the weight of x minus the weight of a. The first factor is greater than or equal to zero because a was at maximum depth. The second factor is less than or equal to zero because x is a globally smallest item, so its weight is no larger than a\'s. The product of a non-negative and a non-positive number is non-positive, so the swap did not increase the cost, and the resulting tree is still optimal. Apply the same swap to move the other smallest item, y, into b\'s old position. Now x and y are siblings at maximum depth in an optimal tree, which is exactly the structure the greedy first merge creates. So merging the two smallest first is consistent with some optimal solution, and after that merge the remaining problem is a strictly smaller instance of the same kind, so induction finishes the proof.',
        aHi: 'Pairwise merges ke ek sequence ki kul cost, har original item ke liye, iske weight guna wo kitni merges mein participate karta hai ke barabar hai, aur wo tadaad bilkul merges ke binary tree mein item ki depth hai. Toh kul cost minimise karna matlab tree aise arrange karna ki bhaari items chhichhle hon, root ke paas, aur halke items gehre hon, leaves ke paas. Greedy hamesha do abhi-sabse-chhote items merge karta hai aur unka combined weight wapas push karta hai. Ye optimal hai dekhne ke liye, koi optimal merge tree lo aur do leaves dekho jo maximum depth par siblings hain; aisa ek pair hamesha maujood hai kyunki sabse gehre level par kam se kam do nodes hain aur max depth par ek node ka ek sibling hota hai. Unhe a aur b kaho. x do globally sabse chhote original items mein se ek ho. Agar x pehle se a ya b nahi hai, x kisi aisi depth par hai jo maximum se zyaada nahi. Tree mein x aur a ki positions swap karo. Kul cost a ki depth minus x ki depth, guna x ka weight minus a ka weight, se badalti hai. Pehla factor zero se greater ya equal hai kyunki a maximum depth par tha. Doosra factor zero se less ya equal hai kyunki x ek globally sabse chhota item hai. Ek non-negative aur ek non-positive number ka product non-positive hai, isliye swap ne cost nahi badhaayi, aur resulting tree abhi bhi optimal hai. Wahi swap doosre sabse chhote item, y, ko b ki purani position mein move karne ke liye lagao. Ab x aur y ek optimal tree mein maximum depth par siblings hain, jo bilkul wo structure hai jo greedy pehla merge banaata hai.',
      },
      {
        q: 'You are asked "minimum cost to connect all ropes, where connecting two ropes of lengths a and b costs a + b". Walk through your solution and its complexity.',
        qHi: 'Aapse poocha jaata hai "sab ropes connect karne ki minimum cost, jahaan lengths a aur b ki do ropes connect karna a + b kharch karta hai". Apna solution aur iski complexity samjhaao.',
        a: 'This is the pairwise merge problem exactly. Each connection combines two ropes into one whose length is the sum, and the cost of that connection is the sum. The total cost over all connections is what we minimise. I recognise it as the same objective as Huffman: total cost equals, for each original rope, its length times the number of connections it ends up inside, which is its depth in the tree of connections, so I want long ropes shallow and short ropes deep. The algorithm is: put all rope lengths into a min-heap. Then repeatedly extract the two smallest, add their sum to a running cost, and insert that sum back into the heap. Stop when one rope remains; the running cost is the answer. The correctness is the exchange argument: in any optimal connection tree, the two shortest ropes can be made the deepest siblings without increasing cost, so connecting them first is safe, and the rest is a smaller instance. For complexity, building the heap from n lengths is O of n. Then there are n minus one connection rounds, and each round does two extract-min operations and one insert, all O of log n on a heap of at most n elements. So the total is O of n log n time and O of n space for the heap. If the lengths were already given sorted, there is an alternative O of n approach using two queues instead of a heap, but the heap version is the standard answer and handles the unsorted case directly.',
        aHi: 'Ye bilkul pairwise merge problem hai. Har connection do ropes ko ek mein combine karta hai jiski length sum hai, aur us connection ki cost sum hai. Sab connections par kul cost wo hai jo hum minimise karte hain. Main ise Huffman jaisa hi objective pehchaanta hoon: kul cost, har original rope ke liye, iski length guna wo kitni connections ke andar khatam hota hai ke barabar hai, jo connections ke tree mein iski depth hai, isliye main lambi ropes chhichhli aur chhoti ropes gehri chahta hoon. Algorithm hai: sab rope lengths ko ek min-heap mein daalo. Phir baar-baar do sabse chhote extract karo, unka sum ek running cost mein jodo, aur wo sum wapas heap mein insert karo. Ruko jab ek rope bache; running cost jawaab hai. Correctness exchange argument hai: kisi bhi optimal connection tree mein, do sabse chhoti ropes ko sabse gehre siblings banaya jaa sakta hai bina cost badhaaye, isliye unhe pehle connect karna safe hai, aur baaki ek chhota instance hai. Complexity ke liye, n lengths se heap banaana O of n hai. Phir n minus one connection rounds hain, aur har round do extract-min operations aur ek insert karta hai, sab zyaada se zyaada n elements ke heap par O of log n. Toh kul O of n log n time aur heap ke liye O of n space hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement mergeCost with a min-heap (reuse Module 8\'s MinHeap or the MinHeapOf above). Test on [4,3,2,6] (expect 29), [1,2,3,4,5] (expect 33), a single element (expect 0). Also implement mergeCostBroken and confirm it is worse.',
        taskHi: 'Ek min-heap ke saath mergeCost implement karo (Module 8 ka MinHeap ya upar ka MinHeapOf reuse karo). [4,3,2,6] (29 expect karo), [1,2,3,4,5] (33 expect karo), ek single element (0 expect karo) par test karo. mergeCostBroken bhi implement karo aur confirm karo ye kharab hai.',
        hint: 'For [1,2,3,4,5]: merge 1+2=3 (cost 3), 3+3=6 (cost 9), 4+5=9 (cost 18), 6+9=15 (cost 33).',
        hintHi: '[1,2,3,4,5] ke liye: merge 1+2=3 (cost 3), 3+3=6 (cost 9), 4+5=9 (cost 18), 6+9=15 (cost 33).',
      },
      {
        task: 'Implement huffman(freqs) returning a { symbol -> code } map, and a decode(bits, root) function. Verify that encoding a string with the codes and decoding it round-trips, and that the encoded length equals sum(freq * codeLen).',
        taskHi: 'huffman(freqs) implement karo jo ek { symbol -> code } map return kare, aur ek decode(bits, root) function. Verify karo ki ek string ko codes se encode karke aur decode karke round-trip hota hai, aur ki encoded length sum(freq * codeLen) ke barabar hai.',
        hint: 'Prefix codes: no code is a prefix of another, so decoding is unambiguous — walk the tree bit by bit from the root, emit the symbol at each leaf, restart at the root.',
        hintHi: 'Prefix codes: koi code doosre ka prefix nahi, isliye decoding unambiguous hai — root se bit by bit tree chalo, har leaf par symbol emit karo, root par restart karo.',
      },
      {
        task: 'Compare the Huffman encoded size against a fixed-length encoding (ceil(log2(alphabet size)) bits per symbol) for a few texts with skewed letter frequencies. Report the compression ratio.',
        taskHi: 'Kuch texts ke liye jinki letter frequencies skewed hain Huffman encoded size ko ek fixed-length encoding (prati symbol ceil(log2(alphabet size)) bits) ke against compare karo. Compression ratio report karo.',
        hint: 'English text over 26 letters would be 5 bits/symbol fixed; Huffman typically gets it to ~4.2 bits/symbol because e, t, a, o are far more common than z, q, x.',
        hintHi: '26 letters par English text 5 bits/symbol fixed hoga; Huffman typically ise ~4.2 bits/symbol tak leta hai kyunki e, t, a, o z, q, x se kaafi zyaada common hain.',
      },
    ],

    keyTakeaways: [
      'Greedy-with-a-heap: repeatedly pull the best (usually two smallest) items from a min-heap, combine them, and push the result back. n-1 rounds x O(log n) = O(n log n).',
      'Pairwise merge cost / rope connecting: always merge the two smallest. The total cost = sum of (item weight x its depth in the merge tree), minimised by keeping heavy items shallow.',
      'Huffman coding is exactly this, tracking the tree: the two lowest-frequency symbols become the deepest siblings (longest codes), the commonest symbol stays shallow (shortest code).',
      'The exchange argument: in any optimal tree, the two smallest items can be swapped to the maximum depth without increasing cost, so merging them first loses nothing.',
      'Forgetting to push the combined weight back into the heap breaks the algorithm — the merged group must keep participating in future merges.',
      'This greedy assumes any two groups can be merged. If merges are constrained (K adjacent piles, K > 2), you need an interval DP (Module 11 lesson 6) instead.',
    ],
    keyTakeawaysHi: [
      'Greedy-with-a-heap: baar-baar ek min-heap se best (aksar do sabse chhote) items nikaalo, unhe combine karo, aur result wapas push karo. n-1 rounds x O(log n) = O(n log n).',
      'Pairwise merge cost / rope connecting: hamesha do sabse chhote merge karo. Kul cost = (item weight x merge tree mein iski depth) ka sum, bhaari items chhichhle rakhkar minimise hota hai.',
      'Huffman coding bilkul ye hai, tree track karte hue: do sabse kam-frequency symbols sabse gehre siblings bante hain (sabse lambe codes), sabse aam symbol chhichhla rehta hai (sabse chhota code).',
      'Exchange argument: kisi bhi optimal tree mein, do sabse chhote items ko maximum depth par swap kiya jaa sakta hai bina cost badhaaye, isliye unhe pehle merge karna kuch nahi khota.',
      'Combined weight ko heap mein wapas push karna bhool jaana algorithm todta hai — merged group ko future merges mein participate karte rehna chahiye.',
      'Ye greedy maanta hai ki koi bhi do groups merge ho sakte hain. Agar merges constrained hain (K adjacent piles, K > 2), aapko ek interval DP (Module 11 lesson 6) chahiye.',
    ],
  },
];
