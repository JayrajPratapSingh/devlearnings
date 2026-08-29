/**
 * DSA Complete Course — Module 8: Heaps & Priority Queues, lesson 1.
 *
 * What a binary heap actually is: a COMPLETE binary tree obeying the heap
 * property (every parent <= both children, for a min-heap), stored not with
 * pointers but as a plain flat array with index arithmetic — children of index
 * i live at 2i+1 and 2i+2, the parent of i at (i-1)/2 floored. Directly builds
 * on two already-established facts: this course's Module 7 lesson 1 introduced a
 * binary tree node as { value, left, right } with explicit pointers, and its
 * BFS lesson showed a tree can be walked level by level — a heap is that same
 * level-by-level layout, made implicit in an array so no node objects or
 * pointers exist at all. Separately, this course's Module 1 established that an
 * operation costing O(log n) on n items is dramatically cheaper than O(n).
 * Broken example: needing "always hand me the smallest item next" over a stream,
 * and doing it by either keeping a sorted array (every insert shifts elements,
 * O(n)) or scanning an unsorted array for the min every time (O(n) per
 * extract) — either way O(n) per operation, O(n^2) over the whole stream.
 * Fixed by a binary min-heap: the smallest item sits at index 0 (O(1) to peek),
 * and insert / remove-min are each O(log n) because a complete tree of n nodes
 * is only about log2(n) levels tall.
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

export const DSA_MODULE_8: CourseLesson[] = [
  {
    slug: 'heaps-array-backed-priority-tree',
    title: 'Heaps: The Array That Behaves Like a Priority Tree',
    titleHi: 'Heaps: Wo Array Jo Ek Priority Tree Ki Tarah Vyavahaar Karta Hai',
    description: 'Processing a stream of jobs where you must always take the one with the smallest priority number next. Keeping a sorted array makes every insert an O(n) shift; keeping an unsorted array makes every "take the smallest" an O(n) scan. Both are O(n) per step, O(n squared) over the whole stream — even though you never actually need the data fully sorted.',
    descriptionHi: 'Jobs ki ek stream process karna jahaan aapko hamesha sabse chhote priority number waali agli leni hai. Ek sorted array rakhna har insert ko ek O(n) shift banaata hai; ek unsorted array rakhna har "sabse chhoti lo" ko ek O(n) scan banaata hai. Dono per step O(n) hain, poori stream par O(n squared) — jabki aapko data kabhi asal mein poori tarah sorted chahiye hi nahi.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A hospital emergency room versus a bakery ticket line.** This course\'s Module 5 covered the bakery line — a queue, strict first-in-first-out: whoever took a ticket first is served first, no matter how urgent anyone\'s need is. An emergency room does not work that way, and could not: patients are seen in order of how critical they are, and a patient who arrives bleeding badly jumps ahead of someone who has been waiting an hour with a mild fever. The ER still needs to answer one question instantly and constantly — "who is the single most critical patient right now?" — and it needs new arrivals to slot into the right place quickly, without re-triaging the entire waiting room each time. Writing every patient onto one big list and re-sorting the whole list on each arrival works but is wasteful; so does scanning every name on the list each time a doctor frees up. A heap is the triage system that does neither: it keeps just enough order that the most critical patient is always immediately identifiable, and that adding a patient or removing the top one only disturbs one path through the system, not all of it — and it does this, remarkably, using nothing but a flat array and some arithmetic on positions.',
      hi: '**Ek hospital emergency room versus ek bakery ticket line.** Is course ka Module 5 bakery line cover karta tha — ek queue, sakht first-in-first-out: jisne pehle ticket liya use pehle serve kiya jaata hai, chahe kisi ki zaroorat kitni bhi urgent ho. Ek emergency room aise kaam nahi karta, aur kar bhi nahi sakta: patients ko is order mein dekha jaata hai ki wo kitne critical hain, aur ek patient jo buri tarah khoon behta hua aata hai us vyakti se aage kood jaata hai jo ek ghante se halke bukhaar ke saath wait kar raha hai. ER ko phir bhi ek sawaal turant aur lagaataar jawaab dena hota hai — "abhi sabse critical patient kaun hai?" — aur use nayi arrivals ko sahi jagah jaldi fit karna hota hai, har baar poore waiting room ko dobara triage kiye bina. Har patient ko ek badi list par likhna aur har arrival par poori list dobara sort karna kaam karta hai par faaltu hai; har baar jab ek doctor free hota hai list ke har naam ko scan karna bhi. Ek heap wo triage system hai jo koi bhi nahi karta: ye bas itna order rakhta hai ki sabse critical patient hamesha turant pehchaana jaa sake, aur ek patient jodna ya top waale ko hataana system ke sirf ek raaste ko disturb kare, poore ko nahi — aur ye ye kaam, hairaani ki baat hai, sirf ek flat array aur positions par kuch arithmetic se karta hai.',
    },

    simple: `**Start broken.** You get jobs one at a time and must always process the one with the smallest priority number next. Two obvious attempts, both O(n) per step:

\`\`\`js
// Attempt 1: keep the array sorted, so the smallest is always jobs[0]
function addJob(jobs, p) {
  let i = jobs.length;
  jobs.push(p);
  while (i > 0 && jobs[i - 1] > jobs[i]) { // shift it left into place
    [jobs[i - 1], jobs[i]] = [jobs[i], jobs[i - 1]];
    i--;
  }
}
// addJob is O(n): inserting into a sorted array shifts everything after it.

// Attempt 2: unsorted array, find the smallest only when asked
function takeSmallest(jobs) {
  let min = 0;
  for (let i = 1; i < jobs.length; i++) if (jobs[i] < jobs[min]) min = i;
  return jobs.splice(min, 1)[0];
}
// takeSmallest is O(n): it scans every element every single time.
\`\`\`

Whichever operation you make cheap, the other stays O(n). Over a stream of \`n\` jobs that is O(n squared) total work — and you are paying the full price of *sorting* when all you ever ask for is *the current minimum*, one at a time.

**The fix: a binary min-heap — a complete binary tree kept in a flat array**

\`\`\`js
// The array IS the tree. For the element at index i:
//   left child  = 2*i + 1
//   right child = 2*i + 2
//   parent      = Math.floor((i - 1) / 2)
//
// Heap property (min-heap): every parent <= both of its children.
// Therefore the smallest element in the whole heap is always at index 0.

const heap = [1, 3, 6, 5, 9, 8];
//            0  1  2  3  4  5
//
//            1            <- index 0, the minimum, O(1) to read
//          /   \\
//        3       6        <- indices 1, 2
//       / \\     /
//      5   9   8          <- indices 3, 4, 5
\`\`\`

\`\`\`ts
class MinHeap {
  private a: number[] = [];
  peek(): number | undefined { return this.a[0]; } // O(1)
  size(): number { return this.a.length; }
  // insert() and extractMin() are covered in the next lesson — both O(log n)
}
\`\`\`

Reading the minimum is now O(1) — it is just \`heap[0]\`. Inserting a new job and removing the current minimum are each O(log n), not O(n), because a complete binary tree holding \`n\` nodes is only about log2(n) levels tall, and both operations only ever walk one root-to-leaf path. The heap never fully sorts the data — nodes \`3\` and \`6\` are siblings and the heap does not care which is larger — it maintains *exactly* the parent-below-children rule and nothing more, which is the least ordering work needed to keep answering "what is the minimum?" cheaply.`,

    simpleHi: `**Toote hue se shuru.** Aapko ek baar mein ek job milti hai aur hamesha sabse chhote priority number waali agli process karni hai. Do spasht prayaas, dono per step O(n):

\`\`\`js
// Prayaas 1: array ko sorted rakho, taaki sabse chhoti hamesha jobs[0] ho
function addJob(jobs, p) {
  let i = jobs.length;
  jobs.push(p);
  while (i > 0 && jobs[i - 1] > jobs[i]) { // ise left mein shift karke jagah par lao
    [jobs[i - 1], jobs[i]] = [jobs[i], jobs[i - 1]];
    i--;
  }
}
// addJob O(n) hai: ek sorted array mein insert karna iske baad sab kuch shift karta hai.

// Prayaas 2: unsorted array, sabse chhoti sirf tab dhoondho jab poocha jaaye
function takeSmallest(jobs) {
  let min = 0;
  for (let i = 1; i < jobs.length; i++) if (jobs[i] < jobs[min]) min = i;
  return jobs.splice(min, 1)[0];
}
// takeSmallest O(n) hai: ye har baar har element scan karta hai.
\`\`\`

Aap jo bhi operation sasta banaate ho, doosra O(n) reh jaata hai. \`n\` jobs ki ek stream par ye kul O(n squared) kaam hai — aur aap *sorting* ki poori keemat de rahe ho jabki aap kabhi sirf *current minimum* maangte ho, ek baar mein ek.

**Fix: ek binary min-heap — ek complete binary tree ek flat array mein rakha gaya**

\`\`\`js
// Array HI tree hai. Index i par element ke liye:
//   left child  = 2*i + 1
//   right child = 2*i + 2
//   parent      = Math.floor((i - 1) / 2)
//
// Heap property (min-heap): har parent <= iske dono children.
// Isliye poore heap ka sabse chhota element hamesha index 0 par hota hai.

const heap = [1, 3, 6, 5, 9, 8];
//            0  1  2  3  4  5
//
//            1            <- index 0, minimum, O(1) mein padho
//          /   \\
//        3       6        <- indices 1, 2
//       / \\     /
//      5   9   8          <- indices 3, 4, 5
\`\`\`

\`\`\`ts
class MinHeap {
  private a: number[] = [];
  peek(): number | undefined { return this.a[0]; } // O(1)
  size(): number { return this.a.length; }
  // insert() aur extractMin() agle lesson mein — dono O(log n)
}
\`\`\`

Minimum padhna ab O(1) hai — ye bas \`heap[0]\` hai. Ek nayi job insert karna aur current minimum hataana har ek O(log n) hain, O(n) nahi, kyunki \`n\` nodes rakhne waala ek complete binary tree sirf lagbhag log2(n) levels lamba hai, aur dono operations sirf ek root-se-leaf path chalte hain. Heap data ko kabhi poori tarah sort nahi karta — nodes \`3\` aur \`6\` siblings hain aur heap ko parwaah nahi ki kaun bada hai — ye *bilkul* parent-neeche-children rule maintain karta hai aur kuch nahi, jo "minimum kya hai?" ka sasta jawaab dete rehne ke liye zaroori sabse kam ordering kaam hai.`,

    content: `## Why the array has no gaps: the "complete binary tree" shape

\`\`\`
A complete binary tree: every level is completely full except possibly the
last, and the last level fills strictly left to right.

        1              level 0  (index 0)
      /   \\
    3       6          level 1  (indices 1..2)
   / \\     /
  5   9   8            level 2  (indices 3..5)  <- last level, filling left to right

Laid out level by level, left to right:  [1, 3, 6, 5, 9, 8]
                                index:     0  1  2  3  4  5
\`\`\`

This course's Module 7 lesson on BFS walked a tree one level at a time, left to right — a heap stores the tree in exactly that order. Because a complete tree never has a hole in the middle (a missing node can only ever be at the very end of the last level), the level-by-level layout packs into a contiguous array with no unused slots. That is what makes the index arithmetic work: if there were gaps, \`2*i + 1\` would not reliably land on a node's real child.

## The index arithmetic replaces Module 7's pointers entirely

\`\`\`js
function leftChild(i)  { return 2 * i + 1; }
function rightChild(i) { return 2 * i + 2; }
function parent(i)     { return Math.floor((i - 1) / 2); } // or (i - 1) >> 1
\`\`\`

This course's Module 7 built every tree from node objects holding \`left\` and \`right\` pointers. A heap needs none of that. The parent/child relationships are computed from an index on demand, so the entire structure is one \`number[]\` — no allocation per node, far better cache behaviour, and nothing to keep in sync. The price is that a heap can only be a *complete* tree; you cannot make an arbitrary shape this way, which is exactly why heaps are used for priority queues (where the shape does not matter) and not, say, for a binary search tree (where it does).

## Min-heap versus max-heap is one comparison flipped

\`\`\`js
// min-heap: parent <= children   -> smallest at the root, extractMin is cheap
// max-heap: parent >= children   -> largest  at the root, extractMax is cheap
\`\`\`

Everything in this module is written for a min-heap, but a max-heap is the identical structure with every \`<\` swapped for \`>\`. A common trick when your language only gives you one kind: to get max-heap behaviour from a min-heap, insert \`-value\` instead of \`value\` and negate again on the way out. This course's Module 8 later lesson on "kth largest" uses a min-heap deliberately, not a max-heap — the choice is not arbitrary and that lesson explains why.

## What the heap property does NOT give you

\`\`\`
        1
      /   \\
    3       6
   / \\
  5   9

Is 3 < 6? The heap does not know or care. Siblings are unordered.
Is 5 (at index 3) < 6 (at index 2)? Also unrelated — 5 and 6 are on
different branches, and the heap property only constrains parent-to-child.
\`\`\`

A heap is **not a sorted array** and reading it left to right does not give you sorted output — \`[1, 3, 6, 5, 9, 8]\` is a perfectly valid heap and is not sorted. The only guarantee is the root is the global minimum. This is the whole efficiency argument: fully sorting \`n\` items costs O(n log n), but if you only ever need them one-at-a-time-smallest-first, a heap gives you each one for O(log n) and skips all the work of ordering elements you have not asked for yet. This course's Module 10 on sorting revisits this exact trade-off from the other direction with heapsort.`,

    contentHi: `## Array mein gaps kyun nahi: "complete binary tree" shape

\`\`\`
Ek complete binary tree: last ke alaava har level poori tarah bhara hota hai,
aur last level sakhti se left se right bharta hai.

        1              level 0  (index 0)
      /   \\
    3       6          level 1  (indices 1..2)
   / \\     /
  5   9   8            level 2  (indices 3..5)  <- last level, left se right bharta

Level by level, left se right rakha gaya:  [1, 3, 6, 5, 9, 8]
                                  index:     0  1  2  3  4  5
\`\`\`

Is course ka Module 7 ka BFS lesson ek tree ko ek baar mein ek level, left se right chalta tha — ek heap tree ko bilkul us order mein store karta hai. Kyunki ek complete tree ke beech mein kabhi hole nahi hota (ek missing node sirf last level ke bilkul ant mein ho sakta hai), level-by-level layout ek contiguous array mein bina istemal-na-hue slots ke pack ho jaata hai. Yahi hai jo index arithmetic ko kaam karvaata hai: agar gaps hote, \`2*i + 1\` bharose se ek node ke asli child par nahi utarta.

## Index arithmetic Module 7 ke pointers ko poori tarah replace karta hai

\`\`\`js
function leftChild(i)  { return 2 * i + 1; }
function rightChild(i) { return 2 * i + 2; }
function parent(i)     { return Math.floor((i - 1) / 2); } // ya (i - 1) >> 1
\`\`\`

Is course ke Module 7 ne har tree ko \`left\` aur \`right\` pointers rakhne waale node objects se banaaya. Ek heap ko iski koi zaroorat nahi. Parent/child relationships ek index se on demand compute hote hain, isliye poori structure ek \`number[]\` hai — prati node koi allocation nahi, kaafi behtar cache behaviour, aur sync mein rakhne ke liye kuch nahi. Keemat ye hai ki ek heap sirf ek *complete* tree ho sakta hai; aap is tarike se ek arbitrary shape nahi bana sakte, jo bilkul wajah hai ki heaps priority queues ke liye istemal hote hain (jahaan shape maayne nahi rakhta) aur, maano, ek binary search tree ke liye nahi (jahaan rakhta hai).

## Min-heap versus max-heap ek comparison palti hui hai

\`\`\`js
// min-heap: parent <= children   -> root par sabse chhota, extractMin sasta
// max-heap: parent >= children   -> root par sabse bada,  extractMax sasta
\`\`\`

Is module mein sab kuch ek min-heap ke liye likha gaya hai, par ek max-heap wahi structure hai jismein har \`<\` \`>\` se badla gaya hai. Ek aam trick jab aapki language sirf ek kism deti hai: ek min-heap se max-heap behaviour paane ke liye, \`value\` ke bajaye \`-value\` insert karo aur baahar aate waqt dobara negate karo. Is course ka Module 8 ka baad ka "kth largest" lesson jaan-boojhkar ek min-heap istemal karta hai, ek max-heap nahi — chunaav arbitrary nahi hai aur wo lesson samjhaata hai kyun.

## Heap property jo aapko NAHI deti

\`\`\`
        1
      /   \\
    3       6
   / \\
  5   9

Kya 3 < 6? Heap ko nahi pata aur parwaah nahi. Siblings unordered hain.
Kya 5 (index 3 par) < 6 (index 2 par)? Ye bhi asambandhit — 5 aur 6 alag
branches par hain, aur heap property sirf parent-se-child ko constrain karti hai.
\`\`\`

Ek heap ek **sorted array nahi hai** aur ise left se right padhna aapko sorted output nahi deta — \`[1, 3, 6, 5, 9, 8]\` ek poori tarah valid heap hai aur sorted nahi hai. Ekmatra guarantee ye hai ki root global minimum hai. Yahi poora efficiency argument hai: \`n\` items ko poori tarah sort karna O(n log n) kharch karta hai, par agar aap unhe hamesha sirf ek-ek-karke-sabse-chhota-pehle chahte ho, ek heap aapko har ek O(log n) mein deta hai aur un elements ko order karne ka saara kaam chhod deta hai jo aapne abhi tak maange nahi. Is course ka Module 10 sorting par is bilkul trade-off ko doosri disha se heapsort ke saath dobara dekhta hai.`,

    examples: [
      {
        title: 'Broken: sorted array keeps peek O(1) but makes every insert O(n)',
        titleHi: 'Toota: sorted array peek ko O(1) rakhta hai par har insert O(n) banaata hai',
        code: `jobs.push(p);
while (i > 0 && jobs[i-1] > jobs[i]) { swap(i-1, i); i--; } // shift into place`,
        codeJs: `function addJob(jobs, p) {
  let i = jobs.length;
  jobs.push(p);
  while (i > 0 && jobs[i - 1] > jobs[i]) {
    [jobs[i - 1], jobs[i]] = [jobs[i], jobs[i - 1]];
    i--;
  }
}
const jobs = [];
[5, 1, 8, 3].forEach(p => addJob(jobs, p));
console.log(jobs); // [1, 3, 5, 8] — sorted, but each insert shifted elements`,
        codeTs: `function addJob(jobs: number[], p: number): void {
  let i = jobs.length;
  jobs.push(p);
  while (i > 0 && jobs[i - 1]! > jobs[i]!) {
    [jobs[i - 1], jobs[i]] = [jobs[i]!, jobs[i - 1]!];
    i--;
  }
}`,
        output: `[1, 3, 5, 8]`,
        explain: 'Keeping the array fully sorted means the minimum is jobs[0] for free, but inserting a new value in order has to move every larger value one slot right — O(n) per insert, O(n squared) to build.',
        explainHi: 'Array ko poori tarah sorted rakhna matlab minimum muft mein jobs[0] hai, par ek nayi value ko order mein insert karna har badi value ko ek slot right hilaana padta hai — per insert O(n), banane mein O(n squared).',
      },
      {
        title: 'Broken: unsorted array makes insert O(1) but every "take smallest" O(n)',
        titleHi: 'Toota: unsorted array insert ko O(1) banaata hai par har "sabse chhoti lo" O(n)',
        code: `let min = 0;
for (let i = 1; i < jobs.length; i++) if (jobs[i] < jobs[min]) min = i;
return jobs.splice(min, 1)[0];`,
        codeJs: `function takeSmallest(jobs) {
  let min = 0;
  for (let i = 1; i < jobs.length; i++) if (jobs[i] < jobs[min]) min = i;
  return jobs.splice(min, 1)[0];
}
const jobs = [5, 1, 8, 3];
console.log(takeSmallest(jobs)); // 1
console.log(takeSmallest(jobs)); // 3 — but each call re-scanned the whole array`,
        codeTs: `function takeSmallest(jobs: number[]): number {
  let min = 0;
  for (let i = 1; i < jobs.length; i++) if (jobs[i]! < jobs[min]!) min = i;
  return jobs.splice(min, 1)[0]!;
}`,
        outputJs: `1
3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Now insert is a cheap push, but finding the minimum has to look at every element, and splice then shifts the tail — O(n) every time a job is taken.',
        explainHi: 'Ab insert ek sasta push hai, par minimum dhoondhna har element ko dekhna padta hai, aur splice phir tail ko shift karta hai — har baar jab ek job li jaati hai O(n).',
      },
      {
        title: 'Fixed: array-backed min-heap — peek is O(1), the tree is implicit',
        titleHi: 'Theek: array-backed min-heap — peek O(1) hai, tree implicit hai',
        code: `const heap = [1, 3, 6, 5, 9, 8];
// leftChild(i) = 2i+1, rightChild(i) = 2i+2, parent(i) = (i-1)>>1
// heap[0] is always the minimum`,
        codeJs: `const heap = [1, 3, 6, 5, 9, 8];
const parent = i => (i - 1) >> 1;
const left = i => 2 * i + 1;
const right = i => 2 * i + 2;

console.log(heap[0]);          // 1  — the minimum, O(1)
console.log(heap[left(0)]);    // 3  — left child of the root
console.log(heap[right(0)]);   // 6  — right child of the root
console.log(heap[parent(4)]);  // 3  — parent of index 4 (value 9)`,
        codeTs: `const heap: number[] = [1, 3, 6, 5, 9, 8];
const parent = (i: number) => (i - 1) >> 1;
const left = (i: number) => 2 * i + 1;
const right = (i: number) => 2 * i + 2;`,
        outputJs: `1
3
6
3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The array is the entire data structure. Parent and child positions are computed from the index, so there are no node objects and no pointers, and the minimum is simply heap[0].',
        explainHi: 'Array poori data structure hai. Parent aur child positions index se compute hote hain, isliye koi node objects aur koi pointers nahi, aur minimum bas heap[0] hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// treating a heap array as if it were sorted
const heap = [1, 3, 6, 5, 9, 8];
const secondSmallest = heap[1]; // WRONG — heap[1] is 3 here by luck, not by rule`,
        right: `// the heap only guarantees heap[0]; the 2nd smallest is
// min(heap[1], heap[2]) — one of the root's two children`,
        why: 'The heap property constrains parent-to-child only, never sibling-to-sibling or across branches, so heap[1] is not reliably the second smallest — only heap[0] is guaranteed to be the global minimum.',
        whyHi: 'Heap property sirf parent-se-child ko constrain karti hai, kabhi sibling-se-sibling ya branches ke aar-paar nahi, isliye heap[1] bharose se doosra sabse chhota nahi — sirf heap[0] global minimum hone ki guarantee hai.',
      },
      {
        wrong: `function parent(i) { return i / 2; } // wrong for a 0-indexed array`,
        right: `function parent(i) { return Math.floor((i - 1) / 2); } // 0-indexed
// (some textbooks use a 1-indexed array, where parent(i) = i >> 1 — pick one and be consistent)`,
        why: 'The 2i+1 / 2i+2 / (i-1)/2 formulas assume the root is at index 0. Mixing them with the 1-indexed textbook formulas (2i / 2i+1 / i/2) silently points at the wrong nodes.',
        whyHi: '2i+1 / 2i+2 / (i-1)/2 formule maante hain ki root index 0 par hai. Unhe 1-indexed textbook formulon (2i / 2i+1 / i/2) ke saath milaana chupchaap galat nodes par point karta hai.',
      },
      {
        wrong: `// expecting iteration order to be sorted
for (const x of heap) console.log(x); // prints 1, 3, 6, 5, 9, 8 — NOT sorted`,
        right: `// to get sorted output, repeatedly extractMin until the heap is empty
while (heap.size() > 0) console.log(heap.extractMin()); // 1, 3, 5, 6, 8, 9`,
        why: 'A heap is only partially ordered. Sorted output requires actually removing the minimum n times (which is heapsort, O(n log n)); reading the backing array in order gives you the tree layout, not a sorted sequence.',
        whyHi: 'Ek heap sirf partially ordered hai. Sorted output ke liye asal mein minimum ko n baar hataana padta hai (jo heapsort hai, O(n log n)); backing array ko order mein padhna aapko tree layout deta hai, ek sorted sequence nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Almost every language ships a heap-backed priority queue** — C++ `std::priority_queue`, Java `PriorityQueue`, Python `heapq` — because "give me the most important item next" is such a common need across schedulers, simulations and graph algorithms.',
        hi: '**Lagbhag har language ek heap-backed priority queue bhejti hai** — C++ `std::priority_queue`, Java `PriorityQueue`, Python `heapq` — kyunki "mujhe agla sabse mahatvapoorn item do" schedulers, simulations aur graph algorithms mein itni aam zaroorat hai.',
      },
      {
        en: '**Operating-system task schedulers use priority queues** to decide which runnable process gets the CPU next, so a high-priority task does not wait behind a queue of background work.',
        hi: '**Operating-system task schedulers priority queues istemal karte hain** ye tay karne ke liye ki kaunsa runnable process agla CPU paata hai, taaki ek high-priority task background kaam ki queue ke peeche wait na kare.',
      },
      {
        en: '**Dijkstra\'s shortest-path algorithm** (this course\'s Module 9) repeatedly needs "the unvisited node with the smallest known distance" — a min-heap is what makes it efficient on large graphs.',
        hi: '**Dijkstra ka shortest-path algorithm** (is course ka Module 9) baar-baar "sabse chhoti gyaat doori waala unvisited node" maangta hai — ek min-heap wahi hai jo ise bade graphs par efficient banaata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a binary heap be stored in a flat array with no pointers, when the binary trees from the Trees module needed explicit left and right references on every node?',
        qHi: 'Ek binary heap ko bina pointers ke ek flat array mein kyun store kiya jaa sakta hai, jabki Trees module ke binary trees ko har node par explicit left aur right references chahiye the?',
        a: 'The trees in this course\'s Module 7 could be any shape at all — a binary search tree built from sorted input degenerates into a single leaning chain, a balanced tree is bushy, and there is no way to predict from a node\'s position in memory where its children are, so each node must physically carry pointers to them. A binary heap is deliberately restricted to one specific shape: a complete binary tree, meaning every level is entirely full except possibly the last, and the last level is filled strictly from the left with no gaps. That restriction is powerful. If you write the nodes out level by level, left to right, into an array, then a node at array index i has its left child at exactly index 2i+1 and its right child at exactly 2i+2 every single time, with no exceptions, precisely because the "complete" rule guarantees there is never a missing node earlier in the sequence to throw the counting off. The parent of index i is at floor of (i-1)/2 by the same logic run backwards. So the parent-child structure is not stored anywhere — it is recomputed with a tiny bit of arithmetic whenever it is needed. The benefits are concrete: no memory allocation per node, the whole heap is one contiguous block that a CPU cache handles well, and there is no risk of a pointer getting out of sync with the structure. The cost is equally concrete: you give up the ability to represent an arbitrary tree shape, which is exactly why this technique is used for heaps, where the shape genuinely does not matter, and not for binary search trees, where the shape carries the search information and cannot be forced to stay complete.',
        aHi: 'Is course ke Module 7 ke trees kisi bhi shape ke ho sakte the — sorted input se bani ek binary search tree ek akeli jhukti hui chain mein degenerate ho jaati hai, ek balanced tree ghana hota hai, aur ek node ki memory mein position se ye predict karne ka koi tarika nahi ki iske children kahaan hain, isliye har node ko unke pointers physically le jaane padte hain. Ek binary heap jaan-boojhkar ek khaas shape tak seemit hai: ek complete binary tree, matlab last ke alaava har level poori tarah bhara hai, aur last level sakhti se left se bina gaps ke bhara hai. Wo pratibandh shaktishaali hai. Agar aap nodes ko level by level, left se right, ek array mein likho, toh array index i par ek node ka left child bilkul index 2i+1 par aur right child bilkul 2i+2 par hota hai har baar, bina apvaad, bilkul isliye kyunki "complete" rule guarantee karta hai ki sequence mein pehle kabhi ek missing node nahi hai jo counting ko bigaad de. Index i ka parent usi logic ko ulta chalaate hue floor of (i-1)/2 par hai. Toh parent-child structure kahin store nahi hoti — ye jab bhi zaroori ho thodi si arithmetic se dobara compute hoti hai. Faayde thos hain: prati node koi memory allocation nahi, poora heap ek contiguous block hai jise ek CPU cache achhi tarah handle karta hai, aur ek pointer ke structure se out of sync hone ka koi risk nahi. Keemat bhi utni hi thos hai: aap ek arbitrary tree shape represent karne ki kshamata chhod dete ho, jo bilkul wajah hai ki ye technique heaps ke liye istemal hoti hai, jahaan shape sach mein maayne nahi rakhta, aur binary search trees ke liye nahi, jahaan shape search jaankaari le jaata hai aur use complete rehne ke liye majboor nahi kiya jaa sakta.',
      },
      {
        q: 'A heap gives O(1) access to the minimum and O(log n) insert. A sorted array also gives O(1) access to the minimum. Why is a heap the better choice for a priority queue?',
        qHi: 'Ek heap minimum tak O(1) access aur O(log n) insert deta hai. Ek sorted array bhi minimum tak O(1) access deta hai. Ek priority queue ke liye heap behtar chunaav kyun hai?',
        a: 'The comparison hinges on the cost of inserting, which a priority queue does constantly as new items arrive. In a sorted array, keeping it sorted after inserting a new value means finding the value\'s correct position (fast, via binary search) and then physically shifting every element after that position one slot over to open a gap — that shift is O(n) in the worst and average case, because on average a new value belongs somewhere in the middle. Removing the minimum from a sorted array is also O(n) if the smallest is at the front and you shift the rest down, or you can keep the smallest at the back for O(1) removal but then insertion still shifts. A heap sidesteps all of this. Inserting places the new value at the end of the array (O(1) amortised, just an append) and then "sifts it up" by repeatedly swapping it with its parent while it is smaller than that parent — and since the tree is only about log2(n) levels tall, that is at most log n swaps. Removing the minimum moves the last element to the root and "sifts it down" similarly, again at most log n swaps. So every operation a priority queue actually performs is O(log n) or better, versus the sorted array\'s O(n) insert. Over a stream of n operations that is the difference between roughly n log n total work and roughly n squared total work, which for n in the millions is the difference between a fraction of a second and minutes. The sorted array only wins if you also need to frequently ask for the k-th smallest for arbitrary k, or iterate everything in order, which a priority queue is not designed for.',
        aHi: 'Tulna insert karne ki keemat par tiki hai, jo ek priority queue lagaataar karti hai jaise naye items aate hain. Ek sorted array mein, ek nayi value insert karne ke baad ise sorted rakhna matlab value ki sahi position dhoondhna (tez, binary search se) aur phir us position ke baad har element ko physically ek slot hilaana ek gap kholne ke liye — wo shift worst aur average case mein O(n) hai, kyunki average mein ek nayi value kahin beech mein hoti hai. Ek sorted array se minimum hataana bhi O(n) hai agar sabse chhota saamne hai aur aap baaki ko neeche shift karte ho, ya aap sabse chhote ko peeche rakh sakte ho O(1) removal ke liye par phir insertion abhi bhi shift karta hai. Ek heap ye sab bypass karta hai. Insert karna nayi value ko array ke ant mein rakhta hai (O(1) amortised, bas ek append) aur phir ise "sift up" karta hai baar-baar iske parent se swap karke jab tak ye us parent se chhoti hai — aur kyunki tree sirf lagbhag log2(n) levels lamba hai, wo zyaada se zyaada log n swaps hai. Minimum hataana last element ko root par le jaata hai aur ise isi tarah "sift down" karta hai, phir zyaada se zyaada log n swaps. Toh har operation jo ek priority queue asal mein karti hai O(log n) ya behtar hai, sorted array ke O(n) insert ke muqaable. n operations ki ek stream par ye lagbhag n log n kul kaam aur lagbhag n squared kul kaam ke beech ka farak hai, jo n ke millions mein hone par ek second ke hisse aur minutes ke beech ka farak hai. Sorted array sirf tab jeetta hai agar aapko arbitrary k ke liye k-th sabse chhota baar-baar maangna hai, ya sab kuch order mein iterate karna hai, jiske liye ek priority queue design nahi ki gayi.',
      },
    ],

    exercises: [
      {
        task: 'Given the array [2, 7, 4, 10, 9, 6, 20, 15, 12], draw it as a binary tree using the 2i+1 / 2i+2 index rules. Then check by hand whether it satisfies the min-heap property at every node.',
        taskHi: 'Array [2, 7, 4, 10, 9, 6, 20, 15, 12] diya gaya hai, ise 2i+1 / 2i+2 index rules istemal karke ek binary tree ki tarah draw karo. Phir haath se check karo ki kya ye har node par min-heap property satisfy karta hai.',
        hint: 'Index 0 is the root (2). Its children are indices 1 and 2 (7 and 4). Index 1\'s children are indices 3 and 4. Check parent <= child at each step.',
        hintHi: 'Index 0 root hai (2). Iske children indices 1 aur 2 hain (7 aur 4). Index 1 ke children indices 3 aur 4 hain. Har step par parent <= child check karo.',
      },
      {
        task: 'Write the three helper functions parent(i), leftChild(i), rightChild(i) for a 0-indexed heap. Then write isMinHeap(arr) that returns true only if arr satisfies the min-heap property at every node.',
        taskHi: 'Ek 0-indexed heap ke liye teen helper functions parent(i), leftChild(i), rightChild(i) likho. Phir isMinHeap(arr) likho jo true tabhi return kare jab arr har node par min-heap property satisfy kare.',
        hint: 'You only need to check each node against its children. Loop i from 0 to floor(n/2) - 1 (the nodes that have at least one child) and compare arr[i] with arr[leftChild(i)] and, if it exists, arr[rightChild(i)].',
        hintHi: 'Aapko sirf har node ko iske children ke against check karna hai. i ko 0 se floor(n/2) - 1 tak loop karo (wo nodes jinke kam se kam ek child hai) aur arr[i] ko arr[leftChild(i)] se aur, agar ye maujood hai, arr[rightChild(i)] se compare karo.',
      },
      {
        task: 'Take the two broken approaches from this lesson (sorted-array insert, unsorted-array scan) and empirically time each one processing a shuffled stream of 50,000 numbers smallest-first. Confirm both are dramatically slower than they would need to be.',
        taskHi: 'Is lesson ke do toote approaches lo (sorted-array insert, unsorted-array scan) aur empirically har ek ko 50,000 numbers ki ek shuffled stream ko smallest-first process karte hue time karo. Confirm karo ki dono utne slow hain jitna zaroorat nahi.',
        hint: 'Use performance.now() around the full run. You are looking for the roughly-quadratic blow-up: doubling the input size should roughly quadruple the time.',
        hintHi: 'Poore run ke aas-paas performance.now() istemal karo. Aap lagbhag-quadratic blow-up dhoondh rahe ho: input size double karne se time lagbhag chaar guna hona chahiye.',
      },
    ],

    keyTakeaways: [
      'A binary heap is a complete binary tree (every level full except possibly the last, which fills left to right) that obeys the heap property: every parent is <= both children (min-heap) or >= both children (max-heap).',
      'Because the tree is always complete, it stores in a flat array with no pointers: for index i, the children are at 2i+1 and 2i+2 and the parent is at floor((i-1)/2).',
      'The minimum (or maximum) is always at index 0, so peeking at it is O(1); insert and remove-root are each O(log n) because the tree is only about log2(n) levels tall.',
      'A heap is only partially ordered — siblings and cross-branch nodes have no guaranteed relationship. Reading the array left to right is NOT sorted output.',
      'A heap beats a sorted array for a priority queue because insertion is O(log n) (append then sift up) instead of O(n) (shift elements to keep sorted).',
      'Use a heap when you repeatedly need "the most important item next" one at a time; use full sorting only when you genuinely need every item in order.',
    ],
    keyTakeawaysHi: [
      'Ek binary heap ek complete binary tree hai (last ke alaava har level bhara, jo left se right bharta hai) jo heap property maanta hai: har parent <= dono children (min-heap) ya >= dono children (max-heap).',
      'Kyunki tree hamesha complete hai, ye ek flat array mein bina pointers ke store hota hai: index i ke liye, children 2i+1 aur 2i+2 par hain aur parent floor((i-1)/2) par hai.',
      'Minimum (ya maximum) hamesha index 0 par hota hai, isliye ise peek karna O(1) hai; insert aur remove-root har ek O(log n) hain kyunki tree sirf lagbhag log2(n) levels lamba hai.',
      'Ek heap sirf partially ordered hai — siblings aur cross-branch nodes ka koi guaranteed relationship nahi. Array ko left se right padhna sorted output NAHI hai.',
      'Ek heap ek priority queue ke liye ek sorted array se behtar hai kyunki insertion O(log n) hai (append phir sift up) na ki O(n) (sorted rakhne ke liye elements shift karna).',
      'Ek heap tab istemal karo jab aapko baar-baar "agla sabse mahatvapoorn item" ek baar mein ek chahiye; poori sorting sirf tab istemal karo jab aapko sach mein har item order mein chahiye.',
    ],
  },
];
