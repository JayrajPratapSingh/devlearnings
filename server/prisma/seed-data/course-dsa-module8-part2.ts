/**
 * DSA Complete Course — Module 8: Heaps & Priority Queues, lesson 2.
 *
 * insert and extractMin in full, via sift-up and sift-down. Directly builds on
 * this module's first lesson (the completeness invariant and the 2i+1 / 2i+2 /
 * (i-1)/2 index arithmetic) and on this course's Module 6 recursion-ordering
 * lesson (sift-down is a clean single-path recursive descent). Broken example:
 * to remove the minimum (the root), filling the resulting hole by shifting the
 * whole array left by one — this is O(n) AND it silently re-parents almost every
 * node, so the heap property is destroyed even though the array still "looks
 * fine". Fixed with the standard technique: swap the root with the LAST element,
 * pop the last element off, then sift the new root DOWN — repeatedly swap it
 * with its smaller child until neither child is smaller. insert is the mirror
 * image: append the new value at the end (which keeps the tree complete), then
 * sift it UP — repeatedly swap it with its parent while it is smaller. Each
 * operation touches exactly one root-to-leaf path, so each is O(log n).
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

export const DSA_MODULE_8_PART2: CourseLesson[] = [
  {
    slug: 'heap-sift-up-sift-down',
    title: 'Sift Up, Sift Down: How Insert and Extract Actually Work',
    titleHi: 'Sift Up, Sift Down: Insert Aur Extract Asal Mein Kaise Kaam Karte Hain',
    description: 'Removing the minimum from a heap and then "closing the gap" by shifting the whole backing array left by one position. The array still looks like a heap at a glance, but almost every node now has different children than before, and the heap property is quietly broken everywhere.',
    descriptionHi: 'Ek heap se minimum hataana aur phir poore backing array ko ek position left shift karke "gap band karna". Array ek nazar mein abhi bhi ek heap jaisa dikhta hai, par lagbhag har node ke ab pehle se alag children hain, aur heap property har jagah chupchaap toot gayi hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 2,

    analogy: {
      en: '**A pyramid of stacked cans where you can only ever remove the single can at the very top, and the pile must stay a neat pyramid.** If you pull the top can off, there is now a dip where it was. The wrong instinct is to slide every can over to close the dip — that reshuffles the entire pyramid and topples the ordering. The right move: take one can from the very bottom corner (the last one placed), set it on top where the gap is, and then let it sink. It is almost certainly too heavy to sit up there, so it trades places with the lighter of the two cans just below it, then again with the lighter of the next two, and so on straight down one column until it finally rests on cans that are all lighter than it. Adding a can is the mirror image: you place it in the next open spot at the bottom, and if it is lighter than the can above it, it floats up one level, and keeps floating up its column until the can above it is lighter. In both cases only one vertical column of the pyramid is ever disturbed — never the whole thing — which is exactly why each operation stays cheap even when the pyramid is enormous.',
      hi: '**Stacked cans ka ek pyramid jahaan aap sirf bilkul upar wala akela can hata sakte ho, aur dher ek saaf pyramid rehna chahiye.** Agar aap top can kheench lete ho, ab wahaan ek dip hai jahaan wo tha. Galat instinct hai har can ko slide karke dip band karna — ye poore pyramid ko dobara shuffle karta hai aur ordering ko gira deta hai. Sahi kadam: bilkul neeche ke corner se ek can lo (aakhri rakha gaya), use upar rakho jahaan gap hai, aur phir use doobne do. Ye lagbhag zaroor wahaan upar baithne ke liye bahut bhaari hai, isliye ye apne bilkul neeche ke do cans mein se halke waale se jagah badalta hai, phir agle do mein se halke se, aur aise hi seedhe neeche ek column mein jab tak ye aakhirkaar un cans par nahi tikta jo sab isse halke hain. Ek can jodna mirror image hai: aap ise neeche agli khaali jagah par rakhte ho, aur agar ye iske upar waale can se halka hai, ye ek level upar float karta hai, aur apne column mein upar float karta rehta hai jab tak iske upar wala can halka na ho. Dono maamlon mein pyramid ka sirf ek vertical column disturb hota hai — kabhi poora nahi — jo bilkul wajah hai ki har operation sasta rehta hai chahe pyramid bahut bada ho.',
    },

    simple: `**Start broken.** You have a valid min-heap and you want to remove the minimum (always the root, index 0). The tempting move — take element 0, then shift everything left to fill the hole:

\`\`\`js
function extractMinBroken(heap) {
  const min = heap[0];
  heap.shift();        // remove index 0, slide every other element left by one
  return min;
}

let heap = [1, 3, 6, 5, 9, 8]; //   1 / (3, 6) / (5, 9, 8)
extractMinBroken(heap);
console.log(heap);     // [3, 6, 5, 9, 8]
\`\`\`

The returned value (\`1\`) is correct, and \`[3, 6, 5, 9, 8]\` even *looks* like it might be a heap. It is not. Before the shift, the node \`5\` sat at index 3 and its parent was index 1 (value \`3\`). After \`shift()\`, \`5\` is at index 2, so its parent is now index 0 — and index 0 holds \`3\`... that happens to still be fine here, but look at \`9\`: it moved from index 4 to index 3, so its parent went from index 1 to index 1 again — value \`3\` then \`6\` now. The shift re-parents almost every node according to the 2i+1 rule, and nothing re-checks the heap property. \`shift()\` is also O(n) because it physically moves every element.

**The fix: swap root with the last element, pop, then sift the new root down**

\`\`\`js
function extractMin(heap) {
  const min = heap[0];
  const last = heap.pop();          // remove the last leaf — keeps the tree complete
  if (heap.length > 0) {
    heap[0] = last;                 // put it at the root
    siftDown(heap, 0);              // and let it sink to its correct level
  }
  return min;
}

function siftDown(heap, i) {
  const n = heap.length;
  while (true) {
    let smallest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && heap[l] < heap[smallest]) smallest = l;
    if (r < n && heap[r] < heap[smallest]) smallest = r;
    if (smallest === i) break;      // neither child is smaller — done
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    i = smallest;                   // follow the swap down one level
  }
}
\`\`\`

\`\`\`ts
function siftDown(heap: number[], i: number): void {
  const n = heap.length;
  while (true) {
    let smallest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && heap[l]! < heap[smallest]!) smallest = l;
    if (r < n && heap[r]! < heap[smallest]!) smallest = r;
    if (smallest === i) break;
    [heap[i], heap[smallest]] = [heap[smallest]!, heap[i]!];
    i = smallest;
  }
}
\`\`\`

Moving the *last* element to the root is the key: removing the last leaf is the only removal that keeps the tree complete without moving anything else. That new root is probably too big to be there, so \`siftDown\` walks it down one path — at each step it swaps with the smaller of its two children (smaller, so the parent-below-children rule holds for *both* children afterward) and stops when both children are larger. Only one root-to-leaf path is touched, so it is O(log n).

**insert is the mirror image: append, then sift up**

\`\`\`js
function insert(heap, value) {
  heap.push(value);                 // new leaf at the end — tree stays complete
  siftUp(heap, heap.length - 1);
}

function siftUp(heap, i) {
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (heap[parent] <= heap[i]) break; // parent already smaller — done
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
}
\`\`\`

Appending keeps the tree complete for free. The new value might be smaller than its parent, so \`siftUp\` swaps it upward along the single path to the root until its parent is smaller. Again one path, O(log n).`,

    simpleHi: `**Toote hue se shuru.** Aapke paas ek valid min-heap hai aur aap minimum hataana chahte ho (hamesha root, index 0). Lubhaavna kadam — element 0 lo, phir sab kuch left shift karke hole bharo:

\`\`\`js
function extractMinBroken(heap) {
  const min = heap[0];
  heap.shift();        // index 0 hatao, har doosre element ko ek left slide karo
  return min;
}

let heap = [1, 3, 6, 5, 9, 8]; //   1 / (3, 6) / (5, 9, 8)
extractMinBroken(heap);
console.log(heap);     // [3, 6, 5, 9, 8]
\`\`\`

Return ki gayi value (\`1\`) sahi hai, aur \`[3, 6, 5, 9, 8]\` toh *dikhta* bhi hai jaise ye ek heap ho sakta hai. Ye nahi hai. Shift se pehle, node \`5\` index 3 par baitha tha aur iska parent index 1 tha (value \`3\`). \`shift()\` ke baad, \`5\` index 2 par hai, isliye iska parent ab index 0 hai — aur index 0 mein \`3\` hai... jo yahaan abhi bhi theek hai, par \`9\` dekho: ye index 4 se index 3 par gaya, isliye iska parent index 1 se index 1 hi gaya — value \`3\` phir \`6\` ab. Shift lagbhag har node ko 2i+1 rule ke hisaab se re-parent karta hai, aur kuch bhi heap property dobara check nahi karta. \`shift()\` bhi O(n) hai kyunki ye har element ko physically hilaata hai.

**Fix: root ko last element se swap karo, pop karo, phir naye root ko sift down karo**

\`\`\`js
function extractMin(heap) {
  const min = heap[0];
  const last = heap.pop();          // last leaf hatao — tree complete rehta hai
  if (heap.length > 0) {
    heap[0] = last;                 // ise root par rakho
    siftDown(heap, 0);              // aur ise iske sahi level tak doobne do
  }
  return min;
}

function siftDown(heap, i) {
  const n = heap.length;
  while (true) {
    let smallest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && heap[l] < heap[smallest]) smallest = l;
    if (r < n && heap[r] < heap[smallest]) smallest = r;
    if (smallest === i) break;      // koi bhi child chhota nahi — ho gaya
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    i = smallest;                   // swap ko ek level neeche follow karo
  }
}
\`\`\`

\`\`\`ts
function siftDown(heap: number[], i: number): void {
  const n = heap.length;
  while (true) {
    let smallest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && heap[l]! < heap[smallest]!) smallest = l;
    if (r < n && heap[r]! < heap[smallest]!) smallest = r;
    if (smallest === i) break;
    [heap[i], heap[smallest]] = [heap[smallest]!, heap[i]!];
    i = smallest;
  }
}
\`\`\`

*Last* element ko root par le jaana kunji hai: last leaf hataana ekmatra removal hai jo tree ko bina kuch aur hilaaye complete rakhta hai. Wo naya root shayad wahaan hone ke liye bahut bada hai, isliye \`siftDown\` ise ek path neeche chalata hai — har step par ye apne do children mein se chhote se swap karta hai (chhote, taaki parent-neeche-children rule *dono* children ke liye baad mein hold kare) aur rukta hai jab dono children bade hon. Sirf ek root-se-leaf path chhua jaata hai, isliye ye O(log n) hai.

**insert mirror image hai: append, phir sift up**

\`\`\`js
function insert(heap, value) {
  heap.push(value);                 // ant mein naya leaf — tree complete rehta hai
  siftUp(heap, heap.length - 1);
}

function siftUp(heap, i) {
  while (i > 0) {
    const parent = (i - 1) >> 1;
    if (heap[parent] <= heap[i]) break; // parent pehle se chhota — ho gaya
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
}
\`\`\`

Append karna tree ko muft mein complete rakhta hai. Nayi value iske parent se chhoti ho sakti hai, isliye \`siftUp\` ise root tak ke akele path par upar swap karta hai jab tak iska parent chhota na ho. Phir ek path, O(log n).`,

    content: `## Walking through one extractMin, step by step

\`\`\`
Start:  [1, 3, 6, 5, 9, 8]              1
                                      /   \\
                                    3       6
                                   / \\     /
                                  5   9   8

1. min = 1. Move last element (8) to the root, pop it:  [8, 3, 6, 5, 9]

        8            <- 8 is bigger than its children, sift it down
      /   \\
    3       6
   / \\
  5   9

2. children of index 0 are 3 (idx 1) and 6 (idx 2). Smaller is 3. Swap:
   [3, 8, 6, 5, 9]

        3
      /   \\
    8       6
   / \\
  5   9

3. now at index 1. children are 5 (idx 3) and 9 (idx 4). Smaller is 5. Swap:
   [3, 5, 6, 8, 9]

        3
      /   \\
    5       6
   / \\
  8   9

4. now at index 3. 2*3+1 = 7 is past the end — no children. Stop.
   Result: [3, 5, 6, 8, 9] — a valid min-heap, and the min (1) was returned.
\`\`\`

Compare this with the broken \`shift()\` version: \`shift()\` produced \`[3, 6, 5, 9, 8]\`, where index 1 (\`6\`) has a child at index 3 (\`9\`) and index 4 (\`8\`) — fine here — but index 2 (\`5\`) has child at index 5 which is past the end, and crucially the sibling relationship and every node's parent silently changed with nothing re-validating them. The correct version only ever moved elements along one path and re-checked the property at each swap.

## Why swap with the SMALLER child, not just any child that is smaller

\`\`\`js
// WRONG: swap with the left child whenever the left child is smaller
if (l < n && heap[l] < heap[i]) { swap(i, l); i = l; continue; }
if (r < n && heap[r] < heap[i]) { swap(i, r); i = r; continue; }
\`\`\`

If the node being sifted down is larger than *both* children, swapping it with the left child alone can leave the (now promoted) left child still larger than the right child — the heap property between the new parent and the right child is violated. Swapping with the **smaller** of the two children guarantees that after the swap, the promoted child is smaller than both its new siblings-position value and the other child. This course's Module 6 lesson on recursion ordering is relevant here: \`siftDown\` is really a recursive descent where "pick the smaller child and recurse into it" is the single branch followed each time — getting the branch choice wrong breaks correctness, exactly as it did in that lesson's traversal examples.

## Both operations are O(log n) for the same structural reason

\`\`\`
A complete binary tree with n nodes has height floor(log2(n)).
siftUp   walks from some node straight up to the root:   <= height swaps
siftDown walks from the root straight down to some leaf:  <= height swaps
\`\`\`

Neither operation ever branches or backtracks — each follows exactly one path between the root and a leaf, doing O(1) work (a comparison or two and maybe a swap) per level. This course's Module 1 established that the number of times you can halve n before reaching 1 is log2(n); a complete binary tree has that many levels because each level holds twice as many nodes as the one above. So insert and extractMin are both O(log n), and peek (just reading index 0) is O(1).

## A minimal, complete MinHeap class

\`\`\`ts
class MinHeap {
  private a: number[] = [];

  size(): number { return this.a.length; }
  peek(): number | undefined { return this.a[0]; }

  insert(value: number): void {
    this.a.push(value);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p]! <= this.a[i]!) break;
      [this.a[i], this.a[p]] = [this.a[p]!, this.a[i]!];
      i = p;
    }
  }

  extractMin(): number | undefined {
    const n = this.a.length;
    if (n === 0) return undefined;
    const min = this.a[0];
    const last = this.a.pop()!;
    if (n > 1) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.a.length && this.a[l]! < this.a[s]!) s = l;
        if (r < this.a.length && this.a[r]! < this.a[s]!) s = r;
        if (s === i) break;
        [this.a[i], this.a[s]] = [this.a[s]!, this.a[i]!];
        i = s;
      }
    }
    return min;
  }
}
\`\`\``,

    contentHi: `## Ek extractMin ke through chalna, step by step

\`\`\`
Shuru:  [1, 3, 6, 5, 9, 8]              1
                                      /   \\
                                    3       6
                                   / \\     /
                                  5   9   8

1. min = 1. Last element (8) ko root par le jao, ise pop karo:  [8, 3, 6, 5, 9]

        8            <- 8 apne children se bada hai, ise sift down karo
      /   \\
    3       6
   / \\
  5   9

2. index 0 ke children 3 (idx 1) aur 6 (idx 2) hain. Chhota 3 hai. Swap:
   [3, 8, 6, 5, 9]

        3
      /   \\
    8       6
   / \\
  5   9

3. ab index 1 par. children 5 (idx 3) aur 9 (idx 4) hain. Chhota 5 hai. Swap:
   [3, 5, 6, 8, 9]

        3
      /   \\
    5       6
   / \\
  8   9

4. ab index 3 par. 2*3+1 = 7 end ke aage hai — koi children nahi. Ruko.
   Nateeja: [3, 5, 6, 8, 9] — ek valid min-heap, aur min (1) return hua.
\`\`\`

Ise toote \`shift()\` version se compare karo: \`shift()\` ne \`[3, 6, 5, 9, 8]\` banaaya, jahaan index 1 (\`6\`) ka child index 3 (\`9\`) aur index 4 (\`8\`) par hai — yahaan theek — par index 2 (\`5\`) ka child index 5 par hai jo end ke aage hai, aur mahatvapoorn baat sibling relationship aur har node ka parent chupchaap badal gaya bina kuch unhe dobara validate kiye. Sahi version ne sirf ek path par elements hilaaye aur har swap par property dobara check ki.

## SMALLER child se swap kyun, sirf koi bhi child jo chhota hai usse nahi

\`\`\`js
// GALAT: left child se swap karo jab bhi left child chhota ho
if (l < n && heap[l] < heap[i]) { swap(i, l); i = l; continue; }
if (r < n && heap[r] < heap[i]) { swap(i, r); i = r; continue; }
\`\`\`

Agar sift down ho raha node *dono* children se bada hai, ise akele left child se swap karna (ab promote hua) left child ko abhi bhi right child se bada chhod sakta hai — naye parent aur right child ke beech heap property violate hoti hai. Do children mein se **chhote** se swap karna guarantee karta hai ki swap ke baad, promote hua child apni nayi siblings-position value aur doosre child dono se chhota hai. Is course ka Module 6 ka recursion ordering lesson yahaan sambandhit hai: \`siftDown\` asal mein ek recursive descent hai jahaan "chhota child chuno aur usme recurse karo" har baar follow ki gayi akeli branch hai — branch chunaav galat karna correctness todta hai, bilkul jaise us lesson ke traversal examples mein hua.

## Dono operations usi structural wajah se O(log n) hain

\`\`\`
n nodes waale ek complete binary tree ki height floor(log2(n)) hai.
siftUp   kisi node se seedhe root tak upar chalta hai:   <= height swaps
siftDown root se seedhe kisi leaf tak neeche chalta hai:  <= height swaps
\`\`\`

Koi bhi operation kabhi branch ya backtrack nahi karta — har ek root aur ek leaf ke beech bilkul ek path follow karta hai, prati level O(1) kaam karte hue (ek-do comparison aur shayad ek swap). Is course ke Module 1 ne sthaapit kiya ki 1 tak pahunchne se pehle aap n ko kitni baar halve kar sakte ho wo log2(n) hai; ek complete binary tree mein utne levels hote hain kyunki har level upar waale se do guna nodes rakhta hai. Toh insert aur extractMin dono O(log n) hain, aur peek (bas index 0 padhna) O(1) hai.

## Ek minimal, complete MinHeap class

\`\`\`ts
class MinHeap {
  private a: number[] = [];

  size(): number { return this.a.length; }
  peek(): number | undefined { return this.a[0]; }

  insert(value: number): void {
    this.a.push(value);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p]! <= this.a[i]!) break;
      [this.a[i], this.a[p]] = [this.a[p]!, this.a[i]!];
      i = p;
    }
  }

  extractMin(): number | undefined {
    const n = this.a.length;
    if (n === 0) return undefined;
    const min = this.a[0];
    const last = this.a.pop()!;
    if (n > 1) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.a.length && this.a[l]! < this.a[s]!) s = l;
        if (r < this.a.length && this.a[r]! < this.a[s]!) s = r;
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
        title: 'Broken: filling the root hole by shifting the array left',
        titleHi: 'Toota: root hole ko array left shift karke bharna',
        code: `const min = heap[0];
heap.shift();   // O(n), and re-parents almost every node with no re-check
return min;`,
        codeJs: `function extractMinBroken(heap) {
  const min = heap[0];
  heap.shift();
  return min;
}
let heap = [1, 3, 6, 5, 9, 8];
extractMinBroken(heap);
console.log(heap); // [3, 6, 5, 9, 8] — not a valid heap, and shift() was O(n)`,
        codeTs: `function extractMinBroken(heap: number[]): number | undefined {
  const min = heap[0];
  heap.shift();
  return min;
}`,
        output: `[3, 6, 5, 9, 8]`,
        explain: 'shift() slides every element down one index, so each node inherits a completely different parent under the 2i+1 rule, and nothing re-establishes the heap property. It is also O(n) work.',
        explainHi: 'shift() har element ko ek index neeche slide karta hai, isliye har node 2i+1 rule ke tahat ek poori tarah alag parent inherit karta hai, aur kuch bhi heap property dobara sthaapit nahi karta. Ye O(n) kaam bhi hai.',
      },
      {
        title: 'Fixed: last-to-root then sift down',
        titleHi: 'Theek: last-to-root phir sift down',
        code: `const min = heap[0];
heap[0] = heap.pop();  // last leaf to the root, tree stays complete
siftDown(heap, 0);     // sink it to its level — one path, O(log n)
return min;`,
        codeJs: `function extractMin(heap) {
  const min = heap[0];
  const last = heap.pop();
  if (heap.length > 0) { heap[0] = last; siftDown(heap, 0); }
  return min;
}
let heap = [1, 3, 6, 5, 9, 8];
console.log(extractMin(heap)); // 1
console.log(heap);             // [3, 5, 6, 8, 9] — still a valid min-heap`,
        codeTs: `function extractMin(heap: number[]): number | undefined {
  const min = heap[0];
  const last = heap.pop()!;
  if (heap.length > 0) { heap[0] = last; siftDown(heap, 0); }
  return min;
}`,
        outputJs: `1
[3, 5, 6, 8, 9]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Removing the last leaf is the only removal that leaves the tree complete. The moved-up value then sinks along a single path, swapping with the smaller child each level, until both children are larger.',
        explainHi: 'Last leaf hataana ekmatra removal hai jo tree ko complete chhodta hai. Upar hilaayi gayi value phir ek akele path par doobti hai, har level chhote child se swap karte hue, jab tak dono children bade na hon.',
      },
      {
        title: 'insert: append then sift up',
        titleHi: 'insert: append phir sift up',
        code: `heap.push(value);            // new leaf at the end
siftUp(heap, heap.length - 1); // float it up while smaller than its parent`,
        codeJs: `function insert(heap, value) {
  heap.push(value);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p] <= heap[i]) break;
    [heap[i], heap[p]] = [heap[p], heap[i]];
    i = p;
  }
}
let heap = [3, 5, 6, 8, 9];
insert(heap, 1);
console.log(heap); // [1, 3, 6, 5, 9, 8]  (1 rose from the last slot to the root)`,
        codeTs: `function insert(heap: number[], value: number): void {
  heap.push(value);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[p]! <= heap[i]!) break;
    [heap[i], heap[p]] = [heap[p]!, heap[i]!];
    i = p;
  }
}`,
        outputJs: `[1, 3, 6, 5, 9, 8]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Appending keeps the tree complete. The new value then swaps upward along the single path to the root, stopping as soon as its parent is smaller or equal.',
        explainHi: 'Append karna tree ko complete rakhta hai. Nayi value phir root tak ke akele path par upar swap karti hai, jaise hi iska parent chhota ya barabar ho ruk jaati hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// sift down by swapping with the first child that is smaller
if (heap[l] < heap[i]) { swap(i, l); i = l; }
else if (heap[r] < heap[i]) { swap(i, r); i = r; }`,
        right: `// sift down by swapping with the SMALLER of the two children
let s = i;
if (l < n && heap[l] < heap[s]) s = l;
if (r < n && heap[r] < heap[s]) s = r;
if (s !== i) { swap(i, s); i = s; }`,
        why: 'If the node is bigger than both children, promoting the left child can leave it still bigger than the right child. Swapping with the smaller child guarantees the new parent is below both children.',
        whyHi: 'Agar node dono children se bada hai, left child ko promote karna use abhi bhi right child se bada chhod sakta hai. Chhote child se swap karna guarantee karta hai ki naya parent dono children se neeche hai.',
      },
      {
        wrong: `function extractMin(heap) {
  const min = heap[0];
  heap[0] = heap[heap.length - 1]; // copy last to root
  heap.length--;                   // shrink
  siftDown(heap, 0);
  // BUG when heap had exactly 1 element: heap[0] = heap[0], then length 0, ok
  // BUG when heap is empty: heap[0] is undefined, siftDown compares undefined
  return min;
}`,
        right: `function extractMin(heap) {
  if (heap.length === 0) return undefined;
  const min = heap[0];
  const last = heap.pop();
  if (heap.length > 0) { heap[0] = last; siftDown(heap, 0); }
  return min;
}`,
        why: 'Extracting from an empty heap, or the transition from size 1 to size 0, needs explicit handling — otherwise siftDown runs on undefined values or the last element gets left in place.',
        whyHi: 'Ek khaali heap se extract karna, ya size 1 se size 0 ka transition, explicit handling chahta hai — warna siftDown undefined values par chalta hai ya last element apni jagah reh jaata hai.',
      },
      {
        wrong: `// sifting up but comparing against a child instead of the parent
while (i > 0) {
  const p = (i - 1) >> 1;
  if (heap[i] <= heap[2*i + 1]) break; // wrong node
  ...
}`,
        right: `while (i > 0) {
  const p = (i - 1) >> 1;
  if (heap[p] <= heap[i]) break;       // compare with the PARENT
  [heap[i], heap[p]] = [heap[p], heap[i]];
  i = p;
}`,
        why: 'sift-up only ever needs to compare the moving node with its parent — the subtree below it was already a valid heap before the insert, so nothing downward needs checking.',
        whyHi: 'sift-up ko sirf hilte hue node ko iske parent se compare karna hota hai — iske neeche ka subtree insert se pehle pehle se ek valid heap tha, isliye neeche kuch check karne ki zaroorat nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Python\'s `heapq` module is exactly this**: `heapq.heappush` is sift-up, `heapq.heappop` is last-to-root-then-sift-down, both on a plain list — there is no heap object, just functions over an array, the same design as this lesson.',
        hi: '**Python ka `heapq` module bilkul yahi hai**: `heapq.heappush` sift-up hai, `heapq.heappop` last-to-root-phir-sift-down hai, dono ek saadhaaran list par — koi heap object nahi, bas ek array par functions, is lesson jaisa hi design.',
      },
      {
        en: '**Event-driven simulations** keep a min-heap of upcoming events keyed by timestamp; processing the next event is one `extractMin`, and scheduling a follow-up event is one `insert` — both O(log n) even with millions of pending events.',
        hi: '**Event-driven simulations** aane waale events ka ek min-heap rakhte hain timestamp se keyed; agla event process karna ek `extractMin` hai, aur ek follow-up event schedule karna ek `insert` hai — dono O(log n) chahe laakhon pending events hon.',
      },
      {
        en: '**A change to an element\'s priority** (common in Dijkstra) is handled either by sift-up/sift-down from that element\'s position, or more often by just inserting the new priority and ignoring stale entries when they surface — this course\'s Module 9 uses the second approach.',
        hi: '**Ek element ki priority mein badlaav** (Dijkstra mein aam) ya toh us element ki position se sift-up/sift-down se handle kiya jaata hai, ya aksar bas nayi priority insert karke aur stale entries ko ignore karke jab wo saamne aati hain — is course ka Module 9 doosra approach istemal karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'When removing the minimum from a heap, why move the LAST element to the root specifically, rather than promoting one of the root\'s children into the empty spot?',
        qHi: 'Ek heap se minimum hataate waqt, khaas taur par LAST element ko root par kyun le jaayein, root ke kisi child ko khaali jagah par promote karne ke bajaye?',
        a: 'The heap has two invariants that must both survive every operation: the shape invariant (the tree stays a complete binary tree — every level full except the last, which fills left to right) and the ordering invariant (every parent is <= its children). Removing the root leaves a hole at the top. If you promote one of its children into that hole, you have moved the hole down one level, and now that child has a hole where it used to be, so you promote one of ITS children, and so on — the hole walks down some path to a leaf. The problem is which leaf: the hole ends up wherever the chain of "promote the smaller child" happens to lead, which is almost never the last position of the last level. So the tree is no longer complete — it has a gap somewhere in the middle of the bottom level — and the clean array representation with its index arithmetic breaks, because 2i+1 now sometimes points at a gap. Moving the last element to the root instead fixes the shape first: the last element is by definition the one whose removal keeps the tree complete, so plucking it out and dropping it onto the root leaves a perfectly complete tree immediately. That element is now almost certainly in the wrong place for the ordering invariant (it was a leaf, probably large), so you then restore ordering with a single sift-down along one path. Doing shape first, then ordering, keeps each step simple and keeps the whole operation to one root-to-leaf traversal, which is what makes it O(log n).',
        aHi: 'Heap ke do invariants hain jinhe har operation se bachna chahiye: shape invariant (tree ek complete binary tree rehta hai — last ke alaava har level bhara, jo left se right bharta hai) aur ordering invariant (har parent <= iske children). Root hataana upar ek hole chhodta hai. Agar aap iske kisi child ko us hole mein promote karte ho, aapne hole ko ek level neeche hilaaya, aur ab us child ke paas ek hole hai jahaan ye pehle tha, isliye aap ISKE kisi child ko promote karte ho, aur aise hi — hole kisi path se ek leaf tak neeche chalta hai. Samasya ye hai kaunsa leaf: hole wahaan khatam hota hai jahaan "chhota child promote karo" ki chain le jaati hai, jo lagbhag kabhi last level ki last position nahi hoti. Toh tree ab complete nahi hai — iske bottom level ke beech mein kahin ek gap hai — aur saaf array representation apni index arithmetic ke saath toot jaati hai, kyunki 2i+1 ab kabhi-kabhi ek gap par point karta hai. Iske bajaye last element ko root par le jaana pehle shape theek karta hai: last element paribhaasha se wo hai jiska hataana tree ko complete rakhta hai, isliye ise nikaalkar root par daalna turant ek poori tarah complete tree chhodta hai. Wo element ab lagbhag zaroor ordering invariant ke liye galat jagah hai (ye ek leaf tha, shayad bada), isliye aap phir ordering ko ek akele sift-down se ek path par restore karte ho. Pehle shape, phir ordering karna har step ko saral rakhta hai aur poore operation ko ek root-se-leaf traversal tak rakhta hai, jo ise O(log n) banaata hai.',
      },
      {
        q: 'Insert appends the new value and sifts up; the sift-up only compares against parents and never looks at the new node\'s children. Why is that safe?',
        qHi: 'Insert nayi value append karta hai aur sift up karta hai; sift-up sirf parents ke against compare karta hai aur naye node ke children ko kabhi nahi dekhta. Wo surakshit kyun hai?',
        a: 'Right before the insert, the entire array is a valid heap: every parent is <= its children everywhere. The new value is appended as a new leaf at the end. A leaf has no children, so at the moment of insertion the only place the heap property could possibly be violated is between the new leaf and its parent — everywhere else in the tree is untouched and was already valid. Sift-up checks exactly that one relationship. If the new value is >= its parent, nothing is wrong and you stop immediately. If it is smaller, you swap it with its parent. Now consider what that swap did: the new value moved up one level, and its old parent moved down into the leaf position. The value that moved down is <= whatever is below it (it was a valid parent a moment ago, and its children did not change), so the property holds there. The value that moved up is now compared against ITS new parent, and the same reasoning repeats. The one subtlety people worry about is the new value\'s new sibling after a swap — but the new value is now smaller than the parent it just displaced, and that parent was <= its other child (the sibling), so by transitivity the new value is <= its sibling too. So the only comparison that can ever reveal a problem is the moving node against its parent, one level at a time, all the way up until either the parent is smaller or the node reaches the root.',
        aHi: 'Insert se theek pehle, poora array ek valid heap hai: har jagah har parent <= iske children. Nayi value ant mein ek naye leaf ki tarah append hoti hai. Ek leaf ke koi children nahi, isliye insertion ke pal ekmatra jagah jahaan heap property violate ho sakti hai wo naye leaf aur iske parent ke beech hai — tree mein har doosri jagah achhooti hai aur pehle se valid thi. Sift-up bilkul us ek relationship ko check karta hai. Agar nayi value iske parent se >= hai, kuch galat nahi hai aur aap turant ruk jaate ho. Agar ye chhoti hai, aap ise iske parent se swap karte ho. Ab socho us swap ne kya kiya: nayi value ek level upar gayi, aur iska purana parent leaf position mein neeche gaya. Jo value neeche gayi wo iske neeche jo bhi hai usse <= hai (ye ek pal pehle ek valid parent thi, aur iske children nahi badle), isliye property wahaan hold karti hai. Jo value upar gayi wo ab ISKE naye parent ke against compare hoti hai, aur wahi tark dohraata hai. Ek subtlety jiski log chinta karte hain wo swap ke baad nayi value ka naya sibling hai — par nayi value ab us parent se chhoti hai jise isne abhi hataaya, aur wo parent iske doosre child (sibling) se <= tha, isliye transitivity se nayi value iske sibling se bhi <= hai. Toh ekmatra comparison jo kabhi ek samasya reveal kar sakta hai wo hilta hua node iske parent ke against hai, ek baar mein ek level, poori tarah upar jab tak ya toh parent chhota ho ya node root tak pahunch jaaye.',
      },
    ],

    exercises: [
      {
        task: 'Implement siftDown(heap, i) and siftUp(heap, i) exactly as shown. Then run extractMin on [1, 3, 6, 5, 9, 8] and confirm you get 1 back and the heap becomes [3, 5, 6, 8, 9], matching this lesson\'s trace.',
        taskHi: '[1, 3, 6, 5, 9, 8] par siftDown(heap, i) aur siftUp(heap, i) bilkul jaisa dikhaaya gaya waise implement karo. Phir [1, 3, 6, 5, 9, 8] par extractMin chalao aur confirm karo ki tumhe 1 wapas milta hai aur heap [3, 5, 6, 8, 9] ban jaata hai, is lesson ke trace se mel khaate hue.',
        hint: 'Trace it on paper first: last element 8 goes to index 0, then follow the smaller-child swaps down until 2i+1 is past the array end.',
        hintHi: 'Pehle kaagaz par trace karo: last element 8 index 0 par jaata hai, phir chhote-child swaps ko neeche follow karo jab tak 2i+1 array end ke aage na ho.',
      },
      {
        task: 'Build a full MinHeap class with insert, extractMin, peek and size. Insert the values 5, 2, 8, 1, 9, 3, 7 one at a time, then call extractMin seven times and confirm the outputs come in sorted order: 1, 2, 3, 5, 7, 8, 9.',
        taskHi: 'insert, extractMin, peek aur size ke saath ek poori MinHeap class banao. Values 5, 2, 8, 1, 9, 3, 7 ek baar mein ek insert karo, phir extractMin saat baar call karo aur confirm karo ki outputs sorted order mein aate hain: 1, 2, 3, 5, 7, 8, 9.',
        hint: 'This "insert everything, then extract everything" pattern IS a sorting algorithm (heapsort) — the next lesson makes that explicit and shows how to build the heap faster.',
        hintHi: 'Ye "sab kuch insert karo, phir sab kuch extract karo" pattern HI ek sorting algorithm hai (heapsort) — agla lesson ise explicit banaata hai aur dikhaata hai heap ko tez kaise banaayein.',
      },
      {
        task: 'Take the broken extractMin (the heap.shift() version), run it three times on [1, 3, 6, 5, 9, 8], and after each call check by hand whether the array still satisfies the min-heap property. Find the first call where it breaks.',
        taskHi: 'Toota extractMin lo (heap.shift() version), ise [1, 3, 6, 5, 9, 8] par teen baar chalao, aur har call ke baad haath se check karo ki kya array abhi bhi min-heap property satisfy karta hai. Pehli call dhoondho jahaan ye tootta hai.',
        hint: 'Use the isMinHeap check from the previous lesson\'s exercises. The break may not show on the very first call — that is exactly why this bug is dangerous.',
        hintHi: 'Pichhle lesson ke exercises ka isMinHeap check istemal karo. Break shayad bilkul pehli call par na dikhe — yahi bilkul wajah hai ki ye bug khatarnaak hai.',
      },
    ],

    keyTakeaways: [
      'extractMin: save heap[0], move the LAST element to the root, pop the last slot, then sift the new root down. Removing the last leaf is the only removal that keeps the tree complete.',
      'siftDown: repeatedly swap the node with the SMALLER of its two children, following that swap down, until neither child is smaller (or there are no children).',
      'insert: append the value as a new last leaf (keeps the tree complete), then sift it up — swap with the parent while the parent is larger.',
      'siftUp only compares against parents; the subtree below an inserted leaf was already valid, so nothing downward needs checking.',
      'Both operations follow exactly one root-to-leaf path with O(1) work per level, and a complete tree is about log2(n) levels tall, so both are O(log n).',
      'Never remove the root by shifting the array left — that silently re-parents almost every node under the 2i+1 rule and is O(n) besides.',
    ],
    keyTakeawaysHi: [
      'extractMin: heap[0] save karo, LAST element ko root par le jao, last slot pop karo, phir naye root ko sift down karo. Last leaf hataana ekmatra removal hai jo tree ko complete rakhta hai.',
      'siftDown: node ko baar-baar iske do children mein se CHHOTE se swap karo, us swap ko neeche follow karte hue, jab tak koi child chhota na ho (ya koi children na hon).',
      'insert: value ko ek naye last leaf ki tarah append karo (tree complete rakhta hai), phir ise sift up karo — parent se swap karo jab tak parent bada ho.',
      'siftUp sirf parents ke against compare karta hai; ek insert kiye gaye leaf ke neeche ka subtree pehle se valid tha, isliye neeche kuch check karne ki zaroorat nahi.',
      'Dono operations bilkul ek root-se-leaf path follow karte hain prati level O(1) kaam ke saath, aur ek complete tree lagbhag log2(n) levels lamba hai, isliye dono O(log n) hain.',
      'Root ko kabhi array left shift karke mat hatao — wo chupchaap 2i+1 rule ke tahat lagbhag har node ko re-parent karta hai aur O(n) bhi hai.',
    ],
  },
];
