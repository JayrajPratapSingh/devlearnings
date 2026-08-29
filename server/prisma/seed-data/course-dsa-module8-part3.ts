/**
 * DSA Complete Course — Module 8: Heaps & Priority Queues, lesson 3.
 *
 * Building a heap from an existing array, and heapsort. Directly builds on this
 * module's lesson 2 (siftDown) and this course's Module 1 (aggregate / sum
 * analysis of cost). Broken example: turning an array into a heap by calling
 * insert() once per element — n calls, each O(log n), so O(n log n) total, which
 * is no cheaper than just sorting the array outright. Fixed with Floyd's
 * build-heap ("heapify"): run siftDown on every non-leaf node, starting from the
 * last non-leaf (index floor(n/2) - 1) and working backwards to the root. This
 * is O(n), not O(n log n) — most nodes sit near the bottom and sift down almost
 * nothing; only the handful near the root sift the full height, and the sum of
 * all those heights works out to a constant times n. heapsort then falls out
 * for free: heapify into a max-heap in O(n), then repeatedly swap the root to
 * the end and siftDown the shrinking heap — an in-place O(n log n) sort with no
 * extra array, unlike the "insert all then extract all" approach.
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

export const DSA_MODULE_8_PART3: CourseLesson[] = [
  {
    slug: 'build-heap-and-heapsort',
    title: 'Heapify: Building a Heap in O(n), and Heapsort',
    titleHi: 'Heapify: O(n) Mein Ek Heap Banaana, Aur Heapsort',
    description: 'Turning an unordered array of a million numbers into a valid heap by inserting them one at a time. It works, but it is n insertions each costing up to log n — O(n log n) total — which is the same cost as just sorting the array, defeating the point of a structure that was supposed to be cheaper than sorting.',
    descriptionHi: 'Ek million numbers ke ek unordered array ko ek valid heap mein badalna unhe ek baar mein ek insert karke. Ye kaam karta hai, par ye n insertions har ek log n tak kharch karti hai — kul O(n log n) — jo array ko sort karne ki hi keemat hai, ek aisi structure ka point haar jaana jo sorting se sasti maani jaati thi.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Organising a stadium crowd into a valid "everyone can see past the people in front" arrangement, two ways.** One way: bring people in one at a time and, for each new arrival, walk them up from the entrance through the rows until they are correctly placed relative to everyone already seated. Every single arrival potentially walks a long way. The other way: let everyone sit down anywhere first, then fix the arrangement from the back rows forward — the very back row is already fine (nobody sits behind them to block), the second-to-last row only needs to be checked against the one row behind it, and only as you get near the front does a person potentially need to move down through many rows. The second way does far less total walking, because the overwhelming majority of people are in the back half of the stadium where the fixing is nearly free, and only the small number of people near the front ever move far. Building a heap works the same way: inserting one at a time makes every element climb; heapifying a pre-filled array fixes it from the bottom up, and since a binary tree has half its nodes as leaves (which never move) and only one root (which can move the full height), the total work collapses from n-log-n down to linear in n.',
      hi: '**Ek stadium bheed ko ek valid "har koi saamne waale logon ke paar dekh sake" arrangement mein organise karna, do tarikon se.** Ek tarika: logon ko ek baar mein ek laao aur, har nayi arrival ke liye, unhe entrance se rows ke through upar chalao jab tak wo pehle se baithe har vyakti ke saapeksh sahi jagah na hon. Har akeli arrival sambhaavit roop se lambi doori chalti hai. Doosra tarika: sabko pehle kahin bhi baithne do, phir arrangement ko back rows se aage theek karo — bilkul peechhe wali row pehle se theek hai (unke peechhe koi nahi baithta block karne), doosri-se-aakhri row ko sirf iske peechhe ki ek row ke against check karna hai, aur sirf jaise aap saamne ke kareeb aate ho ek vyakti ko sambhaavit roop se kayi rows neeche jaana padta hai. Doosra tarika kaafi kam kul chalna karta hai, kyunki bhaari bahumat log stadium ke back half mein hain jahaan theek karna lagbhag muft hai, aur sirf saamne ke kareeb chhoti tadaad mein log kabhi door jaate hain. Ek heap banaana usi tarah kaam karta hai: ek baar mein ek insert karna har element ko chadhaata hai; ek pehle-se-bhare array ko heapify karna ise neeche se upar theek karta hai, aur kyunki ek binary tree ke aadhe nodes leaves hote hain (jo kabhi nahi hilte) aur sirf ek root (jo poori height hil sakta hai), kul kaam n-log-n se ghatkar n mein linear ho jaata hai.',
    },

    simple: `**Start broken.** You have an arbitrary array and want a heap. The obvious way — insert each element into a fresh heap:

\`\`\`js
function buildHeapSlow(arr) {
  const heap = [];
  for (const x of arr) insert(heap, x);  // insert = append + siftUp, O(log n) each
  return heap;
}
// n calls to insert, each up to O(log n)  ->  O(n log n) total
\`\`\`

This is correct, but O(n log n) is exactly the cost of sorting the whole array. If building the heap costs as much as sorting, the heap has bought you nothing over just calling \`arr.sort()\`.

**The fix: heapify in place, from the last non-leaf node backwards**

\`\`\`js
function buildHeap(arr) {
  const n = arr.length;
  // The last non-leaf node is the parent of the last element:
  const firstParent = Math.floor(n / 2) - 1;
  for (let i = firstParent; i >= 0; i--) {
    siftDown(arr, i, n);   // sink arr[i] into place within its subtree
  }
  return arr;              // arr is now a valid min-heap, rearranged in place
}
\`\`\`

\`\`\`ts
function buildHeap(arr: number[]): number[] {
  const n = arr.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(arr, i, n);
  return arr;
}
\`\`\`

Every node from index \`Math.floor(n/2)\` onward is a leaf — \`2i + 1\` is already past the end — and a leaf is a valid one-element heap by itself, so there is nothing to do for any of them. Starting at the last non-leaf and going backwards to the root, each \`siftDown\` can assume both of the current node's subtrees are *already* valid heaps (they were fixed on earlier iterations), so it only needs to sink the one current value. This is O(n), and the reason is worth seeing:

\`\`\`
Nodes at height 0 (leaves):     ~n/2 nodes, each sifts down 0 levels
Nodes at height 1:              ~n/4 nodes, each sifts down <= 1 level
Nodes at height 2:              ~n/8 nodes, each sifts down <= 2 levels
...
Root (height log n):            1 node,     sifts down <= log n levels

Total work = n/2 * 0 + n/4 * 1 + n/8 * 2 + ... = n * (sum of h / 2^h) = n * O(1) = O(n)
\`\`\`

The nodes that could sift down the furthest are the rarest; the nodes that are most common barely move. The infinite sum \`1/2 + 2/4 + 3/8 + 4/16 + ...\` converges to \`2\`, so the whole thing is about \`2n\` — linear.

**Heapsort falls out of this for free**

\`\`\`js
function heapsort(arr) {
  const n = arr.length;
  buildMaxHeap(arr);                     // O(n): largest element now at arr[0]
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]]; // move current max to its final slot
    siftDownMax(arr, 0, end);            // restore the heap over arr[0..end-1]
  }
  return arr;                            // sorted ascending, in place
}
\`\`\`

Build a *max*-heap (largest at the root) in O(n), then repeatedly swap the root to the current end of the array and shrink the heap by one, sifting the new root down over the remaining prefix. Each of the \`n\` rounds costs O(log n), so heapsort is O(n log n) — and unlike "insert all into a heap, then extract all into a new array", it needs no second array at all. It sorts the original array in place.`,

    simpleHi: `**Toote hue se shuru.** Aapke paas ek arbitrary array hai aur ek heap chahiye. Spasht tarika — har element ko ek fresh heap mein insert karo:

\`\`\`js
function buildHeapSlow(arr) {
  const heap = [];
  for (const x of arr) insert(heap, x);  // insert = append + siftUp, har ek O(log n)
  return heap;
}
// insert ki n calls, har ek O(log n) tak  ->  kul O(n log n)
\`\`\`

Ye sahi hai, par O(n log n) bilkul poore array ko sort karne ki keemat hai. Agar heap banaana sorting jitna kharch karta hai, heap ne aapko sirf \`arr.sort()\` call karne ke muqaable kuch nahi diya.

**Fix: jagah par heapify, last non-leaf node se peechhe ki taraf**

\`\`\`js
function buildHeap(arr) {
  const n = arr.length;
  // Last non-leaf node last element ka parent hai:
  const firstParent = Math.floor(n / 2) - 1;
  for (let i = firstParent; i >= 0; i--) {
    siftDown(arr, i, n);   // arr[i] ko iske subtree mein jagah par sink karo
  }
  return arr;              // arr ab ek valid min-heap hai, jagah par rearrange kiya gaya
}
\`\`\`

\`\`\`ts
function buildHeap(arr: number[]): number[] {
  const n = arr.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(arr, i, n);
  return arr;
}
\`\`\`

Index \`Math.floor(n/2)\` se aage har node ek leaf hai — \`2i + 1\` pehle se end ke aage hai — aur ek leaf khud mein ek valid one-element heap hai, isliye unmein se kisi ke liye kuch karne ko nahi. Last non-leaf par shuru karke aur root tak peechhe jaate hue, har \`siftDown\` maan sakta hai ki current node ke dono subtrees *pehle se* valid heaps hain (wo pehle iterations par theek ho gaye the), isliye ise sirf ek current value sink karni hai. Ye O(n) hai, aur wajah dekhne laayak hai:

\`\`\`
Height 0 par nodes (leaves):    ~n/2 nodes, har ek 0 levels sift down
Height 1 par nodes:             ~n/4 nodes, har ek <= 1 level sift down
Height 2 par nodes:             ~n/8 nodes, har ek <= 2 levels sift down
...
Root (height log n):            1 node,     <= log n levels sift down

Kul kaam = n/2 * 0 + n/4 * 1 + n/8 * 2 + ... = n * (sum of h / 2^h) = n * O(1) = O(n)
\`\`\`

Wo nodes jo sabse door sift down kar sakte the wo sabse durlabh hain; wo nodes jo sabse aam hain mushkil se hilte hain. Anant sum \`1/2 + 2/4 + 3/8 + 4/16 + ...\` \`2\` par converge karta hai, isliye poori cheez lagbhag \`2n\` hai — linear.

**Heapsort isse muft mein nikalta hai**

\`\`\`js
function heapsort(arr) {
  const n = arr.length;
  buildMaxHeap(arr);                     // O(n): sabse bada element ab arr[0] par
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]]; // current max ko iske final slot par le jao
    siftDownMax(arr, 0, end);            // arr[0..end-1] par heap restore karo
  }
  return arr;                            // ascending sorted, jagah par
}
\`\`\`

Ek *max*-heap banao (root par sabse bada) O(n) mein, phir baar-baar root ko array ke current end par swap karo aur heap ko ek se chhota karo, naye root ko baaki prefix par sift down karte hue. \`n\` rounds mein se har ek O(log n) kharch karta hai, isliye heapsort O(n log n) hai — aur "sab ek heap mein insert karo, phir sab ek naye array mein extract karo" ke ulat, ise koi doosra array bilkul nahi chahiye. Ye original array ko jagah par sort karta hai.`,

    content: `## Why start at floor(n/2) - 1 and go backwards

\`\`\`
n = 7:   indices 0..6

        0
      /   \\
     1     2
    / \\   / \\
   3   4 5   6      indices 3,4,5,6 are leaves (2*3+1 = 7 is past the end)

floor(7/2) - 1 = 2. So we siftDown index 2, then 1, then 0.
\`\`\`

Nodes from index \`floor(n/2)\` to \`n-1\` have no children, so they are trivially valid heaps of size one — running \`siftDown\` on them would do nothing. The first node that *can* have a child is \`floor(n/2) - 1\`. Going **backwards** from there guarantees an invariant \`siftDown\` depends on: when you process node \`i\`, the subtrees rooted at its children (which have higher indices) have already been processed and are already valid heaps. So \`siftDown\` only has to place \`arr[i]\` correctly; it never has to fix anything deeper.

## The O(n) argument, and why insert-one-at-a-time is genuinely O(n log n)

\`\`\`
build-heap (bottom-up siftDown):  work per node <= its HEIGHT (distance to a leaf)
  - half the nodes are leaves        -> height 0
  - a quarter are one level up       -> height <= 1
  - sum over all nodes of height ~= n     (the series converges)
  -> O(n)

insert n times (top-down siftUp):  work per node <= its DEPTH (distance to root)
  - half the nodes are leaves        -> depth ~= log n   (the DEEP ones)
  - only the root has depth 0
  - sum over all nodes of depth ~= n log n
  -> O(n log n)
\`\`\`

The two approaches look symmetric but are not. build-heap's cost is bounded by node *height*, and most nodes have tiny height. insert's cost is bounded by node *depth*, and most nodes have large depth (they are the leaves). This course's Module 1 lesson on analysing loops introduced the idea that the *distribution* of work across iterations matters, not just the worst single iteration — this is that idea at its sharpest.

## Heapsort in detail

\`\`\`
arr = [5, 2, 8, 1, 9, 3]

1. buildMaxHeap  ->  [9, 5, 8, 1, 2, 3]   (9 is the max, at the root)

2. swap arr[0] and arr[5]:  [3, 5, 8, 1, 2, | 9]   9 is now in its final place
   siftDown index 0 over arr[0..4]:  [8, 5, 3, 1, 2, | 9]

3. swap arr[0] and arr[4]:  [2, 5, 3, 1, | 8, 9]
   siftDown over arr[0..3]:  [5, 2, 3, 1, | 8, 9]

4. swap arr[0] and arr[3]:  [1, 2, 3, | 5, 8, 9]
   siftDown over arr[0..2]:  [3, 2, 1, | 5, 8, 9]

5. swap arr[0] and arr[2]:  [1, 2, | 3, 5, 8, 9]
   siftDown over arr[0..1]:  [2, 1, | 3, 5, 8, 9]

6. swap arr[0] and arr[1]:  [1, | 2, 3, 5, 8, 9]   done -> [1, 2, 3, 5, 8, 9]
\`\`\`

The sorted portion grows from the right; the heap shrinks from the right. It is in place (O(1) extra memory), always O(n log n) regardless of input (no bad-pivot case like quicksort has — this course's Module 10 compares them), but not *stable* and its scattered memory access makes it usually slower in practice than a well-implemented quicksort or mergesort. It is the sort of choice when guaranteed O(n log n) *and* O(1) memory both matter.

## A reusable siftDown that takes an explicit length

\`\`\`ts
// The 'len' parameter is what lets heapsort shrink the heap without
// touching the already-sorted tail beyond index len-1.
function siftDown(a: number[], i: number, len: number, less = (x: number, y: number) => x < y): void {
  while (true) {
    let m = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && less(a[l]!, a[m]!)) m = l;
    if (r < len && less(a[r]!, a[m]!)) m = r;
    if (m === i) break;
    [a[i], a[m]] = [a[m]!, a[i]!];
    i = m;
  }
}
// min-heap: pass the default. max-heap (for heapsort): pass (x, y) => x > y.
\`\`\``,

    contentHi: `## floor(n/2) - 1 par shuru aur peechhe kyun jaayein

\`\`\`
n = 7:   indices 0..6

        0
      /   \\
     1     2
    / \\   / \\
   3   4 5   6      indices 3,4,5,6 leaves hain (2*3+1 = 7 end ke aage hai)

floor(7/2) - 1 = 2. Toh hum index 2 ko siftDown karte hain, phir 1, phir 0.
\`\`\`

Index \`floor(n/2)\` se \`n-1\` tak nodes ke koi children nahi, isliye wo size ek ke trivially valid heaps hain — unpar \`siftDown\` chalaana kuch nahi karega. Pehla node jo ek child rakh *sakta* hai wo \`floor(n/2) - 1\` hai. Wahaan se **peechhe** jaana ek invariant guarantee karta hai jispar \`siftDown\` nirbhar karta hai: jab aap node \`i\` process karte ho, iske children (jinke higher indices hain) par rooted subtrees pehle se process ho chuke hain aur pehle se valid heaps hain. Toh \`siftDown\` ko sirf \`arr[i]\` ko sahi rakhna hai; ise kabhi kuch gehra theek nahi karna.

## O(n) argument, aur insert-ek-ek-karke sach mein O(n log n) kyun hai

\`\`\`
build-heap (bottom-up siftDown):  prati node kaam <= iski HEIGHT (ek leaf tak doori)
  - aadhe nodes leaves hain           -> height 0
  - ek chauthaai ek level upar        -> height <= 1
  - sab nodes par height ka sum ~= n      (series converge karti hai)
  -> O(n)

insert n baar (top-down siftUp):  prati node kaam <= iski DEPTH (root tak doori)
  - aadhe nodes leaves hain           -> depth ~= log n   (GEHRE waale)
  - sirf root ki depth 0 hai
  - sab nodes par depth ka sum ~= n log n
  -> O(n log n)
\`\`\`

Do approaches symmetric dikhte hain par nahi hain. build-heap ki cost node *height* se bandhi hai, aur adhikaansh nodes ki height chhoti hai. insert ki cost node *depth* se bandhi hai, aur adhikaansh nodes ki depth badi hai (wo leaves hain). Is course ka Module 1 ka loops analyse karne wala lesson ye idea introduce karta tha ki iterations par kaam ka *distribution* maayne rakhta hai, sirf worst single iteration nahi — ye wahi idea apne sabse tez roop mein hai.

## Heapsort vistaar mein

\`\`\`
arr = [5, 2, 8, 1, 9, 3]

1. buildMaxHeap  ->  [9, 5, 8, 1, 2, 3]   (9 max hai, root par)

2. arr[0] aur arr[5] swap karo:  [3, 5, 8, 1, 2, | 9]   9 ab iski final jagah par
   index 0 ko arr[0..4] par siftDown:  [8, 5, 3, 1, 2, | 9]

3. arr[0] aur arr[4] swap karo:  [2, 5, 3, 1, | 8, 9]
   arr[0..3] par siftDown:  [5, 2, 3, 1, | 8, 9]

4. arr[0] aur arr[3] swap karo:  [1, 2, 3, | 5, 8, 9]
   arr[0..2] par siftDown:  [3, 2, 1, | 5, 8, 9]

5. arr[0] aur arr[2] swap karo:  [1, 2, | 3, 5, 8, 9]
   arr[0..1] par siftDown:  [2, 1, | 3, 5, 8, 9]

6. arr[0] aur arr[1] swap karo:  [1, | 2, 3, 5, 8, 9]   ho gaya -> [1, 2, 3, 5, 8, 9]
\`\`\`

Sorted hissa right se badhta hai; heap right se ghatta hai. Ye jagah par hai (O(1) extra memory), input se bekhabar hamesha O(n log n) (quicksort jaisa koi bad-pivot case nahi — is course ka Module 10 unhe compare karta hai), par *stable* nahi aur iski bikhri hui memory access ise practice mein aksar ek achhe-implement kiye gaye quicksort ya mergesort se slow banaati hai. Ye tab ka chunaav hai jab guaranteed O(n log n) *aur* O(1) memory dono maayne rakhte hain.

## Ek reusable siftDown jo ek explicit length leta hai

\`\`\`ts
// 'len' parameter wahi hai jo heapsort ko heap shrink karne deta hai bina
// index len-1 ke aage pehle-se-sorted tail ko chhue.
function siftDown(a: number[], i: number, len: number, less = (x: number, y: number) => x < y): void {
  while (true) {
    let m = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < len && less(a[l]!, a[m]!)) m = l;
    if (r < len && less(a[r]!, a[m]!)) m = r;
    if (m === i) break;
    [a[i], a[m]] = [a[m]!, a[i]!];
    i = m;
  }
}
// min-heap: default pass karo. max-heap (heapsort ke liye): (x, y) => x > y pass karo.
\`\`\``,

    examples: [
      {
        title: 'Broken: build a heap with n inserts — O(n log n), no better than sorting',
        titleHi: 'Toota: n inserts se ek heap banao — O(n log n), sorting se behtar nahi',
        code: `const heap = [];
for (const x of arr) insert(heap, x); // n * O(log n)`,
        codeJs: `function buildHeapSlow(arr) {
  const heap = [];
  for (const x of arr) insert(heap, x);
  return heap;
}
console.log(buildHeapSlow([5, 2, 8, 1, 9, 3])); // a valid heap, built in O(n log n)`,
        codeTs: `function buildHeapSlow(arr: number[]): number[] {
  const heap: number[] = [];
  for (const x of arr) insert(heap, x);
  return heap;
}`,
        output: `[1, 2, 3, 5, 9, 8]`,
        explain: 'Each insert is O(log n) and there are n of them. The total, O(n log n), is the same asymptotic cost as sorting the array — so the heap saved nothing on construction.',
        explainHi: 'Har insert O(log n) hai aur wo n hain. Kul, O(n log n), array sort karne ki hi asymptotic cost hai — toh heap ne construction par kuch nahi bachaaya.',
      },
      {
        title: 'Fixed: heapify bottom-up in O(n)',
        titleHi: 'Theek: bottom-up heapify O(n) mein',
        code: `for (let i = Math.floor(n/2) - 1; i >= 0; i--) siftDown(arr, i, n);`,
        codeJs: `function buildHeap(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, i, n);
  return arr;
}
console.log(buildHeap([5, 2, 8, 1, 9, 3])); // [1, 2, 3, 5, 9, 8] — same result, O(n)`,
        codeTs: `function buildHeap(arr: number[]): number[] {
  const n = arr.length;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(arr, i, n);
  return arr;
}`,
        outputJs: `[1, 2, 3, 5, 9, 8]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Leaves (the second half of the array) are already valid heaps. Sifting down every non-leaf from the last one backwards costs O(n) total, because work per node is bounded by its small height, not its large depth.',
        explainHi: 'Leaves (array ka doosra aadha) pehle se valid heaps hain. Har non-leaf ko last se peechhe sift down karna kul O(n) kharch karta hai, kyunki prati node kaam iski chhoti height se bandha hai, iski badi depth se nahi.',
      },
      {
        title: 'Heapsort: in-place, O(n log n), no bad case',
        titleHi: 'Heapsort: jagah par, O(n log n), koi bad case nahi',
        code: `buildMaxHeap(arr);
for (let end = n - 1; end > 0; end--) {
  [arr[0], arr[end]] = [arr[end], arr[0]];
  siftDown(arr, 0, end, (x, y) => x > y);
}`,
        codeJs: `function heapsort(arr) {
  const n = arr.length;
  const gt = (x, y) => x > y;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, i, n, gt);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(arr, 0, end, gt);
  }
  return arr;
}
console.log(heapsort([5, 2, 8, 1, 9, 3])); // [1, 2, 3, 5, 8, 9]`,
        codeTs: `function heapsort(arr: number[]): number[] {
  const n = arr.length;
  const gt = (x: number, y: number) => x > y;
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(arr, i, n, gt);
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end]!, arr[0]!];
    siftDown(arr, 0, end, gt);
  }
  return arr;
}`,
        outputJs: `[1, 2, 3, 5, 8, 9]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Build a max-heap in O(n), then n times: swap the max (root) to the end and shrink the heap by one, sifting the new root down over the remaining prefix. In place, always O(n log n).',
        explainHi: 'Ek max-heap banao O(n) mein, phir n baar: max (root) ko end par swap karo aur heap ko ek se chhota karo, naye root ko baaki prefix par sift down karte hue. Jagah par, hamesha O(n log n).',
      },
    ],

    mistakes: [
      {
        wrong: `// heapify from the FRONT (root first)
for (let i = 0; i < n; i++) siftDown(arr, i, n);`,
        right: `// heapify from the last non-leaf BACKWARDS
for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, i, n);`,
        why: 'siftDown assumes both child subtrees are already valid heaps. Going front-to-back breaks that assumption — the children have not been fixed yet — so the result is not a valid heap.',
        whyHi: 'siftDown maanta hai ki dono child subtrees pehle se valid heaps hain. Front-to-back jaana wo assumption todta hai — children abhi tak theek nahi hue — isliye nateeja ek valid heap nahi hai.',
      },
      {
        wrong: `// starting heapify at index n - 1 (a leaf)
for (let i = n - 1; i >= 0; i--) siftDown(arr, i, n);`,
        right: `// leaves need no work; start at the last node that HAS a child
for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, i, n);`,
        why: 'It is not incorrect, just wasteful: the entire second half of the array is leaves, and calling siftDown on a leaf does nothing. Starting at floor(n/2)-1 skips exactly that wasted half.',
        whyHi: 'Ye galat nahi hai, bas faaltu hai: array ka poora doosra aadha leaves hai, aur ek leaf par siftDown call karna kuch nahi karta. floor(n/2)-1 par shuru karna bilkul us faaltu aadhe ko skip karta hai.',
      },
      {
        wrong: `// heapsort forgetting to shrink the heap region
for (let end = n - 1; end > 0; end--) {
  [arr[0], arr[end]] = [arr[end], arr[0]];
  siftDown(arr, 0, n); // BUG: n, not end — pulls the sorted tail back in
}`,
        right: `siftDown(arr, 0, end); // the heap is only arr[0..end-1] now`,
        why: 'After swapping the max to arr[end], that position is finalised. Passing the full length n lets siftDown compare against and re-disturb the already-sorted suffix.',
        whyHi: 'Max ko arr[end] par swap karne ke baad, wo position finalise ho gayi. Poori length n pass karna siftDown ko pehle-se-sorted suffix ke against compare aur use dobara disturb karne deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Python\'s `heapq.heapify(list)` is exactly this O(n) bottom-up build** — it is the standard way to turn an existing list into a heap, and it is documented as linear time, not n-log-n.',
        hi: '**Python ka `heapq.heapify(list)` bilkul yahi O(n) bottom-up build hai** — ye ek maujooda list ko ek heap mein badalne ka standard tarika hai, aur ise linear time document kiya gaya hai, n-log-n nahi.',
      },
      {
        en: '**Heapsort is what many language runtimes fall back to** as the guaranteed-O(n log n) safety net when a quicksort recursion goes too deep (this hybrid is called introsort, used by C++ `std::sort`).',
        hi: '**Heapsort wahi hai jispar kayi language runtimes wapas girte hain** guaranteed-O(n log n) safety net ki tarah jab ek quicksort recursion bahut gehra chala jaata hai (is hybrid ko introsort kehte hain, C++ `std::sort` dwara istemal).',
      },
      {
        en: '**Priority queues in real systems are almost always constructed once from a batch** (all pending jobs, all graph edges) and then updated incrementally — so the O(n) bulk build genuinely matters, not just as a theoretical nicety.',
        hi: '**Asli systems mein priority queues lagbhag hamesha ek batch se ek baar banaayi jaati hain** (sab pending jobs, sab graph edges) aur phir incrementally update hoti hain — toh O(n) bulk build sach mein maayne rakhta hai, sirf ek theoretical nicety ki tarah nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Building a heap by inserting n elements is O(n log n), but building it bottom-up with siftDown is O(n). Both do about n operations that each look like they could cost log n — where does the log actually disappear?',
        qHi: 'n elements insert karke ek heap banaana O(n log n) hai, par ise bottom-up siftDown se banaana O(n) hai. Dono lagbhag n operations karte hain jo har ek dikhte hain jaise wo log n kharch kar sakte hon — log asal mein kahaan gaayab hota hai?',
        a: 'The key is that the two methods bound their per-element cost by different quantities. When you insert an element and sift it up, its cost is bounded by its depth — the distance from its final position up to the root. When you sift an element down during bottom-up build, its cost is bounded by its height — the distance from its position down to the furthest leaf below it. In a complete binary tree these two quantities are distributed very differently across the nodes. Depth: the bottom level holds about half of all nodes, and every one of those has depth about log n; the level above holds a quarter, at depth log n minus 1; and so on. Summing depth over all nodes gives roughly n times log n, because the many nodes are the deep ones. Height is the mirror image: about half the nodes are leaves with height 0, a quarter have height 1, an eighth have height 2, and only the single root has height log n. Summing height over all nodes gives n times the series 1/2 + 2/4 + 3/8 + 4/16 and onward, and that series converges to a constant (it is 2), so the sum is about 2n — linear. So the log does not disappear from any individual operation; the root really does cost log n to sift down. It disappears from the total because the operations that are expensive are rare and the operations that are cheap are common, and when you add up the actual work rather than assuming every operation hits its worst case, the expensive tail is outweighed by the cheap bulk. This is exactly the aggregate-analysis idea from this course\'s Module 1: the worst case of one operation is not always a safe proxy for the total.',
        aHi: 'Kunji ye hai ki do methods apni prati-element cost ko alag quantities se bound karte hain. Jab aap ek element insert karte ho aur ise sift up karte ho, iski cost iski depth se bandhi hai — iski final position se root tak ki doori. Jab aap bottom-up build ke dauraan ek element ko sift down karte ho, iski cost iski height se bandhi hai — iski position se iske neeche ke sabse door leaf tak ki doori. Ek complete binary tree mein ye do quantities nodes par bahut alag tarah distribute hoti hain. Depth: bottom level sab nodes ka lagbhag aadha rakhta hai, aur unmein se har ek ki depth lagbhag log n hai; upar wala level ek chauthaai rakhta hai, depth log n minus 1 par; aur aise hi. Sab nodes par depth ka sum lagbhag n guna log n deta hai, kyunki bahut se nodes gehre waale hain. Height mirror image hai: lagbhag aadhe nodes height 0 waale leaves hain, ek chauthaai ki height 1, ek aathvaan ki height 2, aur sirf akela root ki height log n hai. Sab nodes par height ka sum n guna series 1/2 + 2/4 + 3/8 + 4/16 aur aage deta hai, aur wo series ek constant par converge karti hai (ye 2 hai), isliye sum lagbhag 2n hai — linear. Toh log kisi individual operation se gaayab nahi hota; root sach mein sift down karne mein log n kharch karta hai. Ye total se gaayab hota hai kyunki jo operations mehenge hain wo durlabh hain aur jo operations saste hain wo aam hain, aur jab aap asli kaam jodte ho har operation ke apne worst case tak pahunchne ke bajaye, mehenga tail saste bulk se kam pad jaata hai. Ye bilkul is course ke Module 1 ka aggregate-analysis idea hai: ek operation ka worst case hamesha total ke liye ek surakshit proxy nahi hota.',
      },
      {
        q: 'Heapsort is in-place and always O(n log n) with no bad-input case, yet quicksort (which has an O(n squared) worst case) is more commonly the default sort. Why?',
        qHi: 'Heapsort jagah par hai aur hamesha O(n log n) hai bina kisi bad-input case ke, phir bhi quicksort (jiska O(n squared) worst case hai) zyaada aam roop se default sort hai. Kyun?',
        a: 'On paper heapsort looks strictly safer, and for adversarial or worst-case-sensitive contexts it genuinely is preferred. But on typical hardware and typical inputs, quicksort is usually faster by a meaningful constant factor, for reasons the Big-O does not capture. Quicksort\'s inner loop is a simple linear scan that partitions a contiguous block — it reads memory sequentially, which modern CPU caches and prefetchers handle extremely well, and it has very few instructions per element. Heapsort\'s inner loop is siftDown, which hops from an index to 2i+1 or 2i+2 repeatedly — those jumps grow geometrically, so consecutive accesses land far apart in memory, defeating the cache; each comparison also pulls in a child that may not be needed. Heapsort also does more element moves on average and is not stable (equal elements can be reordered), which matters when sorting records by a key. And quicksort\'s worst case, while real, is avoidable in practice: choosing the pivot randomly or as the median of three samples makes the O(n squared) case astronomically unlikely on real data, and hybrid sorts like introsort start with quicksort and only switch to heapsort if the recursion depth gets suspicious — getting quicksort\'s speed almost always and heapsort\'s guarantee as a fallback. So heapsort\'s role is usually that safety-net fallback and the go-to when O(1) extra memory is a hard requirement, rather than the everyday default.',
        aHi: 'Kaagaz par heapsort sakhti se surakshit dikhta hai, aur adversarial ya worst-case-sensitive contexts ke liye ye sach mein preferred hai. Par typical hardware aur typical inputs par, quicksort aksar ek maayne rakhne waale constant factor se tez hota hai, un wajahon se jo Big-O capture nahi karta. Quicksort ka inner loop ek saral linear scan hai jo ek contiguous block ko partition karta hai — ye memory ko sequentially padhta hai, jise aadhunik CPU caches aur prefetchers bahut achhi tarah handle karte hain, aur iske prati element bahut kam instructions hain. Heapsort ka inner loop siftDown hai, jo ek index se 2i+1 ya 2i+2 par baar-baar koodta hai — wo jumps geometrically badhte hain, isliye lagaataar accesses memory mein door utarte hain, cache ko haraate hue; har comparison ek child bhi kheenchta hai jo shayad zaroori na ho. Heapsort average mein zyaada element moves bhi karta hai aur stable nahi hai (barabar elements reorder ho sakte hain), jo records ko ek key se sort karte waqt maayne rakhta hai. Aur quicksort ka worst case, jabki asli, practice mein avoidable hai: pivot ko randomly ya teen samples ke median ki tarah chunna O(n squared) case ko asli data par astronomically unlikely banaata hai, aur introsort jaise hybrid sorts quicksort se shuru karte hain aur sirf heapsort par switch karte hain agar recursion depth shakki ho jaaye — quicksort ki speed lagbhag hamesha aur heapsort ki guarantee ek fallback ki tarah paate hue. Toh heapsort ka role aksar wo safety-net fallback hai aur jab O(1) extra memory ek hard requirement ho tab ka go-to, rather than everyday default.',
      },
    ],

    exercises: [
      {
        task: 'Implement buildHeap(arr) as the backwards loop of siftDown calls. Test it on [9, 4, 7, 1, 8, 6, 2, 5, 3] and verify with isMinHeap that the result is a valid heap.',
        taskHi: 'buildHeap(arr) ko siftDown calls ke backwards loop ki tarah implement karo. Ise [9, 4, 7, 1, 8, 6, 2, 5, 3] par test karo aur isMinHeap se verify karo ki nateeja ek valid heap hai.',
        hint: 'n = 9, so the first non-leaf is index floor(9/2) - 1 = 3. siftDown indices 3, 2, 1, 0 in that order.',
        hintHi: 'n = 9, toh pehla non-leaf index floor(9/2) - 1 = 3 hai. siftDown indices 3, 2, 1, 0 us order mein.',
      },
      {
        task: 'Instrument both buildHeapSlow (n inserts) and buildHeap (bottom-up) to count total swaps. Run both on the same random array of size 1,000, then 2,000, then 4,000. Confirm the slow one grows faster than linearly and the fast one roughly doubles.',
        taskHi: 'buildHeapSlow (n inserts) aur buildHeap (bottom-up) dono ko total swaps ginne ke liye instrument karo. Dono ko size 1,000, phir 2,000, phir 4,000 ke usi random array par chalao. Confirm karo ki slow wala linearly se tez badhta hai aur fast wala lagbhag double hota hai.',
        hint: 'Have siftDown and siftUp increment a shared counter on each swap. Plot count against n — the bottom-up line should look straight, the insert line should curve up.',
        hintHi: 'siftDown aur siftUp ko har swap par ek shared counter increment karvao. count ko n ke against plot karo — bottom-up line seedhi dikhni chahiye, insert line upar curve honi chahiye.',
      },
      {
        task: 'Implement heapsort using a max-heap and confirm it sorts [5, 2, 8, 1, 9, 3] to [1, 2, 3, 5, 8, 9], matching this lesson\'s trace step by step.',
        taskHi: 'Ek max-heap istemal karke heapsort implement karo aur confirm karo ki ye [5, 2, 8, 1, 9, 3] ko [1, 2, 3, 5, 8, 9] mein sort karta hai, is lesson ke trace se step by step mel khaate hue.',
        hint: 'Reuse one siftDown that takes a comparator and a length. Pass (x, y) => x > y for the max-heap, and pass end (not n) as the length inside the extraction loop.',
        hintHi: 'Ek siftDown reuse karo jo ek comparator aur ek length leta hai. max-heap ke liye (x, y) => x > y pass karo, aur extraction loop ke andar length ki tarah end (n nahi) pass karo.',
      },
    ],

    keyTakeaways: [
      'Building a heap by inserting elements one at a time is O(n log n) — the same cost as sorting, so it wastes the heap\'s advantage.',
      'Heapify (Floyd\'s build-heap) runs siftDown on every non-leaf node, from index floor(n/2)-1 backwards to 0, and is O(n).',
      'Going backwards is required: siftDown assumes both child subtrees are already valid heaps, which is only true if lower nodes were processed first.',
      'The O(n) result comes from work-per-node being bounded by height (most nodes have height ~0) rather than depth (most nodes have depth ~log n) — a distribution argument, not a per-operation one.',
      'Heapsort: build a max-heap in O(n), then repeatedly swap the root to the shrinking end and siftDown. It is in-place, always O(n log n), with no bad-input case.',
      'Heapsort is usually slower than quicksort in practice (scattered memory access, not stable), so it serves as the guaranteed-O(n log n) fallback and the choice when O(1) extra memory is mandatory.',
    ],
    keyTakeawaysHi: [
      'Ek heap ko ek baar mein ek element insert karke banaana O(n log n) hai — sorting ki hi keemat, isliye ye heap ka faayda barbaad karta hai.',
      'Heapify (Floyd ka build-heap) har non-leaf node par siftDown chalata hai, index floor(n/2)-1 se peechhe 0 tak, aur O(n) hai.',
      'Peechhe jaana zaroori hai: siftDown maanta hai ki dono child subtrees pehle se valid heaps hain, jo tabhi sach hai jab neeche ke nodes pehle process hue.',
      'O(n) nateeja prati-node kaam ke height se bandhe hone se aata hai (adhikaansh nodes ki height ~0) na ki depth se (adhikaansh nodes ki depth ~log n) — ek distribution argument, prati-operation nahi.',
      'Heapsort: ek max-heap banao O(n) mein, phir baar-baar root ko ghatte hue end par swap karo aur siftDown karo. Ye jagah par hai, hamesha O(n log n), bina kisi bad-input case ke.',
      'Heapsort practice mein aksar quicksort se slow hai (bikhri hui memory access, stable nahi), toh ye guaranteed-O(n log n) fallback ki tarah aur jab O(1) extra memory anivaarya ho tab ka chunaav hai.',
    ],
  },
];
