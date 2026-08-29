/**
 * DSA Complete Course — Module 8: Heaps & Priority Queues, lesson 4
 * (final lesson of Module 8).
 *
 * Priority-queue problem patterns: "kth largest / top k", merging k sorted
 * sequences, and the streaming median. Directly builds on this module's earlier
 * lessons (a heap gives O(log k) insert/extract and O(1) peek) and on this
 * course's Module 4 (merging sorted linked lists). Broken example: finding the
 * kth largest element of a big array by fully sorting it and indexing — O(n log
 * n) work and O(n) space to answer a question that only concerns k elements.
 * Fixed by carrying a min-heap capped at size k: push every element, and
 * whenever the heap exceeds k, extractMin to throw away the smallest of the
 * current k+1 candidates. After one pass the heap holds exactly the k largest
 * elements and its root IS the kth largest — O(n log k) time, O(k) space. The
 * lesson also shows the k-way merge (a heap of the k current heads) and the
 * two-heaps streaming median.
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

export const DSA_MODULE_8_PART4: CourseLesson[] = [
  {
    slug: 'priority-queue-patterns-top-k',
    title: 'Priority-Queue Patterns: Top K, K-Way Merge, Streaming Median',
    titleHi: 'Priority-Queue Patterns: Top K, K-Way Merge, Streaming Median',
    description: 'Finding the 10th largest value in an array of ten million by sorting the whole array and reading index nine from the end. It works, but it does O(n log n) work and holds a full sorted copy in memory to answer a question that only ever depended on 10 of the values.',
    descriptionHi: 'Ek crore ke array mein 10vaan sabse bada value dhoondhna poore array ko sort karke aur end se nau index padhkar. Ye kaam karta hai, par ye O(n log n) kaam karta hai aur memory mein ek poori sorted copy rakhta hai ek aise sawaal ka jawaab dene ke liye jo kabhi sirf 10 values par nirbhar tha.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 4,

    analogy: {
      en: '**Keeping a "top 10 high scores" board for an arcade machine that has been played a million times.** The wasteful way: write down every single score as it happens, then at the end sort all million and keep the first ten. The efficient way: keep a board with exactly ten slots. Each time a new score comes in, compare it only against the *lowest* score currently on the board — if the new score does not beat even that one, ignore it entirely; if it does, bump the lowest score off and slot the new one in. You never need the scores sorted, and you never hold more than ten. The one operation you need to be fast is "what is the current lowest score on the board, and remove it" — which is exactly what a min-heap of size ten gives you in O(log 10) time. Notice the board is a MIN-heap even though you care about the HIGHEST scores: it is a min-heap *of the ten survivors*, so that the weakest survivor — the one most likely to be knocked out next — is always the cheapest to find.',
      hi: '**Ek arcade machine ke liye "top 10 high scores" board rakhna jo ek million baar khela gaya hai.** Faaltu tarika: har akela score jaise hota hai likho, phir end mein saare million sort karo aur pehle das rakho. Efficient tarika: bilkul das slots waala ek board rakho. Har baar jab ek naya score aata hai, ise sirf board par abhi ke *sabse kam* score ke against compare karo — agar naya score us ek ko bhi nahi haraata, ise poori tarah ignore karo; agar haraata hai, sabse kam score ko hataa do aur naye ko andar slot karo. Aapko kabhi scores sorted nahi chahiye, aur aap kabhi das se zyaada nahi rakhte. Ek operation jo tez chahiye wo hai "board par abhi sabse kam score kya hai, aur use hatao" — jo bilkul wo hai jo size das ka ek min-heap aapko O(log 10) time mein deta hai. Dhyaan do board ek MIN-heap hai chahe aap SABSE ZYAADA scores ki parwaah karte ho: ye *das survivors ka* ek min-heap hai, taaki sabse kamzor survivor — wo jo agla knock out hone ki sabse zyaada sambhaavna rakhta hai — hamesha dhoondhne mein sabse sasta ho.',
    },

    simple: `**Start broken.** Find the kth largest element of \`arr\` (k = 3 here):

\`\`\`js
function kthLargestSlow(arr, k) {
  const sorted = [...arr].sort((a, b) => b - a); // full descending sort, O(n log n)
  return sorted[k - 1];
}
kthLargestSlow([3, 2, 1, 5, 6, 4], 3); // 4
\`\`\`

Correct, but you sorted all \`n\` elements and allocated a full copy, just to read one of them. If \`n\` is ten million and \`k\` is 10, that is a vast amount of wasted work and memory.

**The fix: a min-heap capped at size k**

\`\`\`js
function kthLargest(arr, k) {
  const heap = new MinHeap();
  for (const x of arr) {
    heap.insert(x);
    if (heap.size() > k) heap.extractMin(); // drop the smallest of the current k+1
  }
  return heap.peek(); // the min of the k largest === the kth largest
}
kthLargest([3, 2, 1, 5, 6, 4], 3); // 4
\`\`\`

\`\`\`ts
function kthLargest(arr: number[], k: number): number | undefined {
  const heap = new MinHeap();
  for (const x of arr) {
    heap.insert(x);
    if (heap.size() > k) heap.extractMin();
  }
  return heap.peek();
}
\`\`\`

Walk the array once. The heap never holds more than \`k + 1\` elements before immediately dropping back to \`k\`. After the whole pass, the heap contains exactly the \`k\` largest values seen — and because it is a *min*-heap, its root is the smallest of those \`k\`, which is by definition the \`k\`th largest overall. Time is O(n log k) (n insert/extract pairs, each O(log k) because the heap is capped at k). Space is O(k). For \`k\` much smaller than \`n\`, that is a massive win over sorting.

**Why a min-heap, when the question is about the LARGEST elements**

The heap holds your current "top k". When a new element arrives you must decide: does it belong in the top k, and if so, which current member does it evict? The member to evict is always the *smallest* of the current k — and a min-heap keeps that smallest at its root, reachable in O(1) and removable in O(log k). A max-heap would put the *largest* survivor on top, which is the one you least want to touch. The heap type is chosen for cheap access to the element on the boundary of being cut, not the element you care about most.`,

    simpleHi: `**Toote hue se shuru.** \`arr\` ka kth sabse bada element dhoondho (yahaan k = 3):

\`\`\`js
function kthLargestSlow(arr, k) {
  const sorted = [...arr].sort((a, b) => b - a); // poora descending sort, O(n log n)
  return sorted[k - 1];
}
kthLargestSlow([3, 2, 1, 5, 6, 4], 3); // 4
\`\`\`

Sahi, par aapne saare \`n\` elements sort kiye aur ek poori copy allocate ki, bas unmein se ek padhne ke liye. Agar \`n\` ek crore hai aur \`k\` 10 hai, wo bahut bada barbaad kaam aur memory hai.

**Fix: size k par capped ek min-heap**

\`\`\`js
function kthLargest(arr, k) {
  const heap = new MinHeap();
  for (const x of arr) {
    heap.insert(x);
    if (heap.size() > k) heap.extractMin(); // current k+1 mein se sabse chhota drop karo
  }
  return heap.peek(); // k sabse bade ka min === kth sabse bada
}
kthLargest([3, 2, 1, 5, 6, 4], 3); // 4
\`\`\`

\`\`\`ts
function kthLargest(arr: number[], k: number): number | undefined {
  const heap = new MinHeap();
  for (const x of arr) {
    heap.insert(x);
    if (heap.size() > k) heap.extractMin();
  }
  return heap.peek();
}
\`\`\`

Array ek baar chalo. Heap turant wapas \`k\` par girne se pehle kabhi \`k + 1\` se zyaada elements nahi rakhta. Poore pass ke baad, heap mein bilkul dekhe gaye \`k\` sabse bade values hain — aur kyunki ye ek *min*-heap hai, iska root un \`k\` mein sabse chhota hai, jo paribhaasha se kul \`k\`vaan sabse bada hai. Time O(n log k) hai (n insert/extract jode, har ek O(log k) kyunki heap k par capped hai). Space O(k) hai. \`n\` se bahut chhote \`k\` ke liye, wo sorting par ek bhaari jeet hai.

**Min-heap kyun, jab sawaal SABSE BADE elements ke baare mein hai**

Heap aapka current "top k" rakhta hai. Jab ek naya element aata hai aapko tay karna hai: kya ye top k mein hai, aur agar haan, kaunsa current member ise evict karta hai? Evict karne wala member hamesha current k mein sabse *chhota* hai — aur ek min-heap us sabse chhote ko iske root par rakhta hai, O(1) mein pahunche aur O(log k) mein hataaye jaane laayak. Ek max-heap sabse *bade* survivor ko top par rakhta, jo wo hai jise aap sabse kam chhoona chahte ho. Heap type kate jaane ki boundary par element tak saste access ke liye chuna jaata hai, us element ke liye nahi jiski aap sabse zyaada parwaah karte ho.`,

    content: `## The k-way merge: one heap of the current heads

\`\`\`
Three sorted lists:
  A: 1 -> 4 -> 7
  B: 2 -> 5 -> 8
  C: 3 -> 6 -> 9

Heap holds one "current front" per list: {1(A), 2(B), 3(C)}
  extractMin -> 1, output it, advance A, push 4(A)   heap: {2(B), 3(C), 4(A)}
  extractMin -> 2, output it, advance B, push 5(B)   heap: {3(C), 4(A), 5(B)}
  extractMin -> 3, ...
Merged output: 1, 2, 3, 4, 5, 6, 7, 8, 9
\`\`\`

This course's Module 4 merged *two* sorted linked lists by walking a pointer along each and repeatedly taking the smaller head — O(1) to pick the smaller of two. With \`k\` lists, picking the smallest of \`k\` heads by scanning them all is O(k) per output element, giving O(Nk) for \`N\` total elements. Put the \`k\` heads in a min-heap instead and each pick is O(log k): O(N log k) overall. Each heap entry has to remember which list it came from, so you can advance that specific list after extracting it.

\`\`\`ts
function mergeKSorted(lists: number[][]): number[] {
  const heap = new MinHeapOf<[value: number, list: number, idx: number]>((a, b) => a[0] - b[0]);
  lists.forEach((l, i) => { if (l.length) heap.insert([l[0]!, i, 0]); });

  const out: number[] = [];
  while (heap.size() > 0) {
    const [value, li, idx] = heap.extractMin()!;
    out.push(value);
    if (idx + 1 < lists[li]!.length) heap.insert([lists[li]![idx + 1]!, li, idx + 1]);
  }
  return out;
}
\`\`\`

## The streaming median: two heaps facing each other

\`\`\`
Keep the lower half of the numbers in a MAX-heap (its root = largest of the low half)
Keep the upper half in a MIN-heap                (its root = smallest of the high half)

Invariant: every number in the low heap <= every number in the high heap,
and the two sizes differ by at most 1.

median = root of the bigger heap   (odd count)
       = average of the two roots  (even count)
\`\`\`

Each new number is pushed to one side, then the heaps are rebalanced by moving one root across if sizes drift apart or the invariant is violated. Every insertion is O(log n) and reading the median is O(1) — so a running median over a stream of \`n\` numbers costs O(n log n) total, versus re-sorting the whole window every time.

\`\`\`ts
class MedianStream {
  private low = new MaxHeap();   // lower half
  private high = new MinHeap();  // upper half

  add(x: number): void {
    if (this.low.size() === 0 || x <= this.low.peek()!) this.low.insert(x);
    else this.high.insert(x);
    // rebalance so sizes differ by at most 1, low never smaller than high - 1
    if (this.low.size() > this.high.size() + 1) this.high.insert(this.low.extractMax()!);
    else if (this.high.size() > this.low.size()) this.low.insert(this.high.extractMin()!);
  }

  median(): number {
    if (this.low.size() === this.high.size()) return (this.low.peek()! + this.high.peek()!) / 2;
    return this.low.peek()!;
  }
}
\`\`\`

## When NOT to reach for a heap

\`\`\`
"kth largest, once, and I can rearrange the array" -> Quickselect is O(n) average,
    beating the heap's O(n log k). This course's Module 10 covers it.

"kth largest, but k is close to n"                 -> just sort; O(n log n) and simpler.

"the single largest / smallest, once"              -> a single linear scan, O(n),
    no structure needed.

"top k, but the data keeps changing over time"     -> the heap wins clearly: it
    updates incrementally in O(log k) where re-sorting or re-scanning would not.
\`\`\`

A heap shines when you need repeated priority access as data arrives or changes over time. For a single one-off query on a fixed array, a plain scan or Quickselect is often the better tool — this course's Module 14 is largely about making this kind of "which structure does this problem actually want" judgement quickly.`,

    contentHi: `## k-way merge: current heads ka ek heap

\`\`\`
Teen sorted lists:
  A: 1 -> 4 -> 7
  B: 2 -> 5 -> 8
  C: 3 -> 6 -> 9

Heap prati list ek "current front" rakhta hai: {1(A), 2(B), 3(C)}
  extractMin -> 1, output karo, A aage badhao, 4(A) push karo   heap: {2(B), 3(C), 4(A)}
  extractMin -> 2, output karo, B aage badhao, 5(B) push karo   heap: {3(C), 4(A), 5(B)}
  extractMin -> 3, ...
Merged output: 1, 2, 3, 4, 5, 6, 7, 8, 9
\`\`\`

Is course ke Module 4 ne *do* sorted linked lists ko merge kiya har ek par ek pointer chalakar aur baar-baar chhota head lekar — do mein se chhota chunne ke liye O(1). \`k\` lists ke saath, \`k\` heads mein se sabse chhota unhe sab scan karke chunna prati output element O(k) hai, \`N\` kul elements ke liye O(Nk) deta hai. Iske bajaye \`k\` heads ko ek min-heap mein rakho aur har pick O(log k) hai: kul O(N log k). Har heap entry ko yaad rakhna hota hai wo kaunsi list se aaya, taaki aap use extract karne ke baad us khaas list ko aage badha sako.

\`\`\`ts
function mergeKSorted(lists: number[][]): number[] {
  const heap = new MinHeapOf<[value: number, list: number, idx: number]>((a, b) => a[0] - b[0]);
  lists.forEach((l, i) => { if (l.length) heap.insert([l[0]!, i, 0]); });

  const out: number[] = [];
  while (heap.size() > 0) {
    const [value, li, idx] = heap.extractMin()!;
    out.push(value);
    if (idx + 1 < lists[li]!.length) heap.insert([lists[li]![idx + 1]!, li, idx + 1]);
  }
  return out;
}
\`\`\`

## Streaming median: ek doosre ke saamne do heaps

\`\`\`
Numbers ka lower half ek MAX-heap mein rakho (iska root = low half ka sabse bada)
Upper half ek MIN-heap mein rakho              (iska root = high half ka sabse chhota)

Invariant: low heap mein har number <= high heap mein har number,
aur do sizes zyaada se zyaada 1 se alag.

median = bade heap ka root       (odd count)
       = do roots ka average     (even count)
\`\`\`

Har naya number ek side par push hota hai, phir heaps rebalance hote hain ek root ko paar move karke agar sizes alag ho jaate hain ya invariant violate hota hai. Har insertion O(log n) hai aur median padhna O(1) hai — toh ek stream ke \`n\` numbers par ek running median kul O(n log n) kharch karta hai, har baar poore window ko dobara sort karne ke muqaable.

\`\`\`ts
class MedianStream {
  private low = new MaxHeap();   // lower half
  private high = new MinHeap();  // upper half

  add(x: number): void {
    if (this.low.size() === 0 || x <= this.low.peek()!) this.low.insert(x);
    else this.high.insert(x);
    if (this.low.size() > this.high.size() + 1) this.high.insert(this.low.extractMax()!);
    else if (this.high.size() > this.low.size()) this.low.insert(this.high.extractMin()!);
  }

  median(): number {
    if (this.low.size() === this.high.size()) return (this.low.peek()! + this.high.peek()!) / 2;
    return this.low.peek()!;
  }
}
\`\`\`

## Heap ke liye kab NA pahunchein

\`\`\`
"kth largest, ek baar, aur main array rearrange kar sakta hoon" -> Quickselect O(n) average
    hai, heap ke O(n log k) ko haraate hue. Is course ka Module 10 ise cover karta hai.

"kth largest, par k n ke kareeb hai"                 -> bas sort karo; O(n log n) aur saral.

"akela sabse bada / chhota, ek baar"                 -> ek linear scan, O(n), koi structure nahi.

"top k, par data samay ke saath badalta rehta hai"   -> heap saaf jeetta hai: ye
    incrementally O(log k) mein update hota hai jahaan re-sort ya re-scan nahi karta.
\`\`\`

Ek heap tab chamakta hai jab aapko data aane ya samay ke saath badalne par baar-baar priority access chahiye. Ek akele one-off query ke liye ek fixed array par, ek saadhaaran scan ya Quickselect aksar behtar tool hai — is course ka Module 14 kaafi had tak is tarah ke "ye problem asal mein kaunsi structure chahti hai" nirnay ko jaldi karne ke baare mein hai.`,

    examples: [
      {
        title: 'Broken: kth largest by full sort',
        titleHi: 'Toota: kth largest poore sort se',
        code: `const sorted = [...arr].sort((a, b) => b - a);
return sorted[k - 1];`,
        codeJs: `function kthLargestSlow(arr, k) {
  const sorted = [...arr].sort((a, b) => b - a);
  return sorted[k - 1];
}
console.log(kthLargestSlow([3, 2, 1, 5, 6, 4], 3)); // 4`,
        codeTs: `function kthLargestSlow(arr: number[], k: number): number {
  const sorted = [...arr].sort((a, b) => b - a);
  return sorted[k - 1]!;
}`,
        output: `4`,
        explain: 'O(n log n) time and O(n) extra space to sort all n elements, when the answer only ever depended on the k largest.',
        explainHi: 'Saare n elements sort karne mein O(n log n) time aur O(n) extra space, jabki jawaab kabhi sirf k sabse bade par nirbhar tha.',
      },
      {
        title: 'Fixed: kth largest with a size-k min-heap',
        titleHi: 'Theek: size-k min-heap ke saath kth largest',
        code: `for (const x of arr) {
  heap.insert(x);
  if (heap.size() > k) heap.extractMin();
}
return heap.peek();`,
        codeJs: `function kthLargest(arr, k) {
  const heap = new MinHeap();
  for (const x of arr) {
    heap.insert(x);
    if (heap.size() > k) heap.extractMin();
  }
  return heap.peek();
}
console.log(kthLargest([3, 2, 1, 5, 6, 4], 3)); // 4`,
        codeTs: `function kthLargest(arr: number[], k: number): number | undefined {
  const heap = new MinHeap();
  for (const x of arr) {
    heap.insert(x);
    if (heap.size() > k) heap.extractMin();
  }
  return heap.peek();
}`,
        outputJs: `4`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'One pass; the heap is capped at k, so each insert/extract is O(log k). The final heap holds the k largest, and its root (the smallest of those) is the kth largest. O(n log k) time, O(k) space.',
        explainHi: 'Ek pass; heap k par capped hai, isliye har insert/extract O(log k) hai. Antim heap k sabse bade rakhta hai, aur iska root (unmein sabse chhota) kth sabse bada hai. O(n log k) time, O(k) space.',
      },
      {
        title: 'K-way merge: a heap of the current list heads',
        titleHi: 'K-way merge: current list heads ka ek heap',
        code: `while (heap.size() > 0) {
  const [value, li, idx] = heap.extractMin();
  out.push(value);
  if (idx + 1 < lists[li].length) heap.insert([lists[li][idx + 1], li, idx + 1]);
}`,
        codeJs: `function mergeKSorted(lists) {
  const heap = new MinHeapOf((a, b) => a[0] - b[0]);
  lists.forEach((l, i) => { if (l.length) heap.insert([l[0], i, 0]); });
  const out = [];
  while (heap.size() > 0) {
    const [value, li, idx] = heap.extractMin();
    out.push(value);
    if (idx + 1 < lists[li].length) heap.insert([lists[li][idx + 1], li, idx + 1]);
  }
  return out;
}
console.log(mergeKSorted([[1,4,7],[2,5,8],[3,6,9]])); // [1,2,3,4,5,6,7,8,9]`,
        codeTs: `function mergeKSorted(lists: number[][]): number[] {
  const heap = new MinHeapOf<[number, number, number]>((a, b) => a[0] - b[0]);
  lists.forEach((l, i) => { if (l.length) heap.insert([l[0]!, i, 0]); });
  const out: number[] = [];
  while (heap.size() > 0) {
    const [value, li, idx] = heap.extractMin()!;
    out.push(value);
    if (idx + 1 < lists[li]!.length) heap.insert([lists[li]![idx + 1]!, li, idx + 1]);
  }
  return out;
}`,
        outputJs: `[1, 2, 3, 4, 5, 6, 7, 8, 9]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The heap never holds more than k items (one per list). Each of the N total elements is inserted and extracted once, at O(log k), for O(N log k) — better than O(Nk) from scanning k heads each step.',
        explainHi: 'Heap kabhi k se zyaada items nahi rakhta (prati list ek). N kul elements mein se har ek ek baar insert aur extract hota hai, O(log k) par, O(N log k) ke liye — har step k heads scan karne ke O(Nk) se behtar.',
      },
    ],

    mistakes: [
      {
        wrong: `// using a MAX-heap for "kth largest"
for (const x of arr) maxHeap.insert(x);
for (let i = 0; i < k - 1; i++) maxHeap.extractMax();
return maxHeap.peek();`,
        right: `// a size-k MIN-heap: keep only the k largest, its root is the answer
for (const x of arr) {
  minHeap.insert(x);
  if (minHeap.size() > k) minHeap.extractMin();
}
return minHeap.peek();`,
        why: 'The max-heap version holds all n elements (O(n) space) and is O(n + k log n). The size-k min-heap holds only k (O(k) space) and is O(n log k) — better whenever k is much smaller than n.',
        whyHi: 'Max-heap version saare n elements rakhta hai (O(n) space) aur O(n + k log n) hai. Size-k min-heap sirf k rakhta hai (O(k) space) aur O(n log k) hai — behtar jab bhi k n se bahut chhota ho.',
      },
      {
        wrong: `// k-way merge storing only the value in the heap
heap.insert(lists[i][0]);
// ...later: which list did this come from? no way to know, can't advance it`,
        right: `heap.insert([lists[i][0], i, 0]); // value + which list + position in it`,
        why: 'After extracting the minimum you must advance the specific list it came from and push that list\'s next element. Storing only the value loses the identity needed to do that.',
        whyHi: 'Minimum extract karne ke baad aapko us khaas list ko aage badhaana hai jahaan se ye aaya aur us list ka agla element push karna hai. Sirf value store karna wo pehchaan kho deta hai jo iske liye chahiye.',
      },
      {
        wrong: `// streaming median: forgetting to rebalance after inserting
add(x) {
  if (x <= this.low.peek()) this.low.insert(x);
  else this.high.insert(x);
}
// low can now be many elements bigger than high -> median() reads the wrong root`,
        right: `add(x) {
  ...insert on the correct side...
  if (this.low.size() > this.high.size() + 1) this.high.insert(this.low.extractMax());
  else if (this.high.size() > this.low.size()) this.low.insert(this.high.extractMin());
}`,
        why: 'The median lives at the boundary between the two halves. If the halves drift out of balance, the boundary element is no longer at a root, and median() returns a value that is not the median.',
        whyHi: 'Median do halves ke beech boundary par rehta hai. Agar halves balance se bahar chale jaate hain, boundary element ab ek root par nahi hai, aur median() ek aisi value return karta hai jo median nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Top N trending" / "N most-viewed" features** are size-N heaps updated as events stream in — the site never sorts the full history to show a leaderboard.',
        hi: '**"Top N trending" / "N sabse zyaada-dekhe gaye" features** size-N heaps hain jo events stream hone par update hote hain — site ek leaderboard dikhaane ke liye poori history kabhi sort nahi karti.',
      },
      {
        en: '**Merging sorted shards** — log files, database partitions, sorted map-reduce outputs — is a k-way merge with a heap; it is how external-sort algorithms combine runs that do not fit in memory.',
        hi: '**Sorted shards merge karna** — log files, database partitions, sorted map-reduce outputs — ek heap ke saath ek k-way merge hai; ye external-sort algorithms un runs ko kaise combine karte hain jo memory mein fit nahi hote.',
      },
      {
        en: '**Real-time analytics dashboards** compute running percentiles (median, p95, p99) over a live stream with heap-based structures, because re-sorting the window on every new data point would never keep up.',
        hi: '**Real-time analytics dashboards** ek live stream par running percentiles (median, p95, p99) heap-based structures se compute karte hain, kyunki har naye data point par window ko dobara sort karna kabhi keep up nahi karega.',
      },
    ],

    interviewQA: [
      {
        q: 'For "find the kth largest element", why is a min-heap of size k the right structure, rather than a max-heap?',
        qHi: '"kth sabse bada element dhoondho" ke liye, size k ka ek min-heap sahi structure kyun hai, ek max-heap ke bajaye?',
        a: 'The heap in this pattern is not holding the data you are searching through — it is holding your running answer: the set of the k largest elements seen so far. As you scan the input, every new element forces one decision — is this element good enough to belong in the current top k, and if it is, which existing member of the top k gets pushed out to make room? The member that gets pushed out is always the smallest one currently in the set, because that is the weakest of your k survivors and the first to be beaten. So the operation you perform constantly is "tell me the smallest element in the set, and remove it" — and that is precisely what a min-heap makes cheap: its root is the minimum, O(1) to read and O(log k) to remove. A max-heap would keep the largest of your survivors at the root, which is the one element you never need to touch, and finding the smallest in a max-heap is O(k). The naming feels backwards only if you think the heap should be organised around the elements you care about most; it is actually organised around the element on the chopping block. As a bonus, at the end of the scan the min-heap\'s root is the smallest of the k largest elements overall, which is the kth largest by definition — so you get the answer for free with a single peek, no extra extraction.',
        aHi: 'Is pattern mein heap wo data nahi rakh raha jismein aap search kar rahe ho — ye aapka chalta jawaab rakh raha hai: ab tak dekhe gaye k sabse bade elements ka set. Jaise aap input scan karte ho, har naya element ek nirnay majboor karta hai — kya ye element current top k mein hone ke liye kaafi achha hai, aur agar hai, top k ka kaunsa maujooda member jagah banaane ke liye bahar dhakela jaata hai? Jo member bahar dhakela jaata hai wo hamesha set mein abhi sabse chhota hai, kyunki wo aapke k survivors mein sabse kamzor hai aur pehla jo haara jaata hai. Toh jo operation aap lagaataar karte ho wo hai "mujhe set ka sabse chhota element batao, aur use hatao" — aur wo bilkul wo hai jo ek min-heap sasta banaata hai: iska root minimum hai, O(1) padhne ko aur O(log k) hataane ko. Ek max-heap aapke survivors mein sabse bade ko root par rakhta, jo wo ek element hai jise aapko kabhi chhoona nahi, aur ek max-heap mein sabse chhota dhoondhna O(k) hai. Naming sirf ulta lagta hai agar aap sochte ho ki heap un elements ke aas-paas organize hona chahiye jinki aap sabse zyaada parwaah karte ho; ye asal mein chopping block par element ke aas-paas organize hai. Ek bonus ki tarah, scan ke ant mein min-heap ka root kul k sabse bade elements mein sabse chhota hai, jo paribhaasha se kth sabse bada hai — toh aapko jawaab ek akele peek se muft mein milta hai, koi extra extraction nahi.',
      },
      {
        q: 'The streaming median uses two heaps. Why two, and why does each one face a different direction (a max-heap for the low half, a min-heap for the high half)?',
        qHi: 'Streaming median do heaps istemal karta hai. Do kyun, aur har ek alag disha kyun face karta hai (low half ke liye ek max-heap, high half ke liye ek min-heap)?',
        a: 'The median is the value at the boundary between the smaller half of the numbers and the larger half. To report it in O(1) you need instant access to exactly the elements sitting on that boundary: the largest element of the low half and the smallest element of the high half. A single heap can only give you cheap access to one extreme — its root — so one heap cannot expose both boundary elements at once. Two heaps solve this if each is oriented so its root is the boundary element you need from that side. The low half is stored in a max-heap, so its root is the largest of the low numbers — the left edge of the boundary. The high half is stored in a min-heap, so its root is the smallest of the high numbers — the right edge. With an odd total, one heap holds one extra element and the median is that heap\'s root; with an even total, the median is the average of the two roots. The maintenance work is keeping the two halves both correctly split (every low number really is <= every high number, which the insert-then-compare-with-a-root step ensures) and balanced in size to within one (which the move-a-root-across step ensures). Each add is O(log n) for the heap operations and each median query is O(1), so a stream of n numbers is O(n log n) overall, far better than the O(n log n) *per query* you would pay by re-sorting.',
        aHi: 'Median numbers ke chhote half aur bade half ke beech boundary par value hai. Ise O(1) mein report karne ke liye aapko bilkul un elements tak turant access chahiye jo us boundary par baithe hain: low half ka sabse bada element aur high half ka sabse chhota element. Ek akela heap aapko sirf ek extreme tak sasta access de sakta hai — iska root — toh ek heap dono boundary elements ek saath expose nahi kar sakta. Do heaps ise solve karte hain agar har ek aise oriented ho ki iska root wo boundary element ho jo aapko us side se chahiye. Low half ek max-heap mein store hota hai, toh iska root low numbers mein sabse bada hai — boundary ka left kinaara. High half ek min-heap mein store hota hai, toh iska root high numbers mein sabse chhota hai — right kinaara. Ek odd total ke saath, ek heap ek extra element rakhta hai aur median us heap ka root hai; ek even total ke saath, median do roots ka average hai. Maintenance kaam hai do halves ko dono sahi tarah split rakhna (har low number sach mein har high number se <= hai, jise insert-phir-ek-root-se-compare step sunishchit karta hai) aur size mein ek ke andar balanced (jise ek-root-ko-paar-move step sunishchit karta hai). Har add heap operations ke liye O(log n) hai aur har median query O(1) hai, toh n numbers ki ek stream kul O(n log n) hai, us O(n log n) *prati query* se kaafi behtar jo aap dobara sort karke dete.',
      },
    ],

    exercises: [
      {
        task: 'Implement kthLargest(arr, k) with a size-k min-heap (reuse your MinHeap from the earlier lessons). Test on [3,2,3,1,2,4,5,5,6] with k=4 (expected 4) and with k=1 (expected 6).',
        taskHi: 'kthLargest(arr, k) ko ek size-k min-heap ke saath implement karo (pichhle lessons ka apna MinHeap reuse karo). [3,2,3,1,2,4,5,5,6] par k=4 (expected 4) aur k=1 (expected 6) ke saath test karo.',
        hint: 'Push then, if size > k, extractMin. After the loop the heap has k elements and peek() is the answer. Duplicates are fine — they count as separate elements.',
        hintHi: 'Push karo phir, agar size > k, extractMin. Loop ke baad heap ke paas k elements hain aur peek() jawaab hai. Duplicates theek hain — wo alag elements ginte hain.',
      },
      {
        task: 'Implement mergeKSorted(lists) with a min-heap of [value, listIndex, elementIndex] triples. Test on [[1,4,5],[1,3,4],[2,6]] — expected [1,1,2,3,4,4,5,6].',
        taskHi: 'mergeKSorted(lists) ko [value, listIndex, elementIndex] triples ke ek min-heap ke saath implement karo. [[1,4,5],[1,3,4],[2,6]] par test karo — expected [1,1,2,3,4,4,5,6].',
        hint: 'Seed the heap with the first element of each non-empty list. After each extractMin, if that list has a next element, push it with the incremented elementIndex.',
        hintHi: 'Heap ko har non-empty list ke pehle element se seed karo. Har extractMin ke baad, agar us list ka ek agla element hai, use incremented elementIndex ke saath push karo.',
      },
      {
        task: 'Build the MedianStream class with two heaps. Feed it the sequence 5, 15, 1, 3, 8, 7, 9, 10, 20, 2 one at a time and print the median after each insertion.',
        taskHi: 'Do heaps ke saath MedianStream class banao. Ise sequence 5, 15, 1, 3, 8, 7, 9, 10, 20, 2 ek baar mein ek do aur har insertion ke baad median print karo.',
        hint: 'You need a MaxHeap too — either write one, or reuse MinHeap by inserting negated values and negating on peek/extract. Check your medians against a brute-force sort of the numbers seen so far.',
        hintHi: 'Aapko ek MaxHeap bhi chahiye — ya toh ek likho, ya MinHeap ko negated values insert karke aur peek/extract par negate karke reuse karo. Apne medians ko ab tak dekhe gaye numbers ke ek brute-force sort ke against check karo.',
      },
    ],

    keyTakeaways: [
      'To find the kth largest, keep a min-heap capped at size k: insert every element, and extractMin whenever the size exceeds k. The final root is the kth largest.',
      'This is O(n log k) time and O(k) space, versus O(n log n) time and O(n) space for a full sort — a big win when k is much smaller than n.',
      'The heap is a MIN-heap even though the question is about the largest elements: you need cheap access to the smallest of your current survivors, since that is the one about to be evicted.',
      'K-way merge: a min-heap holding one "current head" per sorted list, each entry tagged with which list it came from. O(N log k) to merge N total elements across k lists.',
      'Streaming median: a max-heap for the lower half and a min-heap for the upper half, kept balanced in size; the median is a root or the average of the two roots, read in O(1).',
      'A heap is the right tool when you need repeated priority access over data that arrives or changes; for a single query on a fixed array, a plain scan or Quickselect (Module 10) is often better.',
    ],
    keyTakeawaysHi: [
      'kth sabse bada dhoondhne ke liye, ek min-heap size k par capped rakho: har element insert karo, aur jab size k se zyaada ho extractMin karo. Antim root kth sabse bada hai.',
      'Ye O(n log k) time aur O(k) space hai, ek poore sort ke O(n log n) time aur O(n) space ke muqaable — ek badi jeet jab k n se bahut chhota ho.',
      'Heap ek MIN-heap hai chahe sawaal sabse bade elements ke baare mein ho: aapko apne current survivors mein sabse chhote tak saste access chahiye, kyunki wo wo hai jo evict hone waala hai.',
      'K-way merge: ek min-heap prati sorted list ek "current head" rakhta hai, har entry tag ki gayi ki wo kaunsi list se aaya. k lists par N kul elements merge karne ke liye O(N log k).',
      'Streaming median: lower half ke liye ek max-heap aur upper half ke liye ek min-heap, size mein balanced rakhe gaye; median ek root ya do roots ka average hai, O(1) mein padha.',
      'Ek heap sahi tool hai jab aapko aane ya badalne waale data par baar-baar priority access chahiye; ek fixed array par ek akele query ke liye, ek saadhaaran scan ya Quickselect (Module 10) aksar behtar hai.',
    ],
  },
];
