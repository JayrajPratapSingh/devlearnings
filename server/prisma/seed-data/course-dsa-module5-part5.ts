/**
 * DSA Complete Course — Module 5: Stacks & Queues, lesson 5.
 *
 * The monotonic DEQUE, and the sliding-window-maximum problem it exists for.
 * This is the direct sequel to lesson 3 (the monotonic stack) and lesson 4
 * (deques): the monotonic stack answered "next greater element" for a whole
 * array, but it cannot answer "maximum within a window that is also losing
 * elements from the front", because a stack has no way to evict from the
 * bottom. A deque does, and adding that one capability turns the same
 * discard-the-dominated invariant into an O(n) sliding-window maximum.
 *
 * Broken example: recomputing Math.max over each window from scratch, which
 * is O(n * k); and the tempting "just use a max-heap" fix, which is O(n log n)
 * and silently returns stale maxima unless entries carry their index and are
 * lazily evicted.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan for stray Devanagari/Cyrillic
 * look-alikes (U+0900-U+097F, U+0400-U+04FF) before seeding, and actually RUN
 * every code sample in node to confirm the claimed outputs.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_5_PART5: CourseLesson[] = [
  {
    slug: 'monotonic-deque-sliding-window-maximum',
    title: 'The Monotonic Deque: Sliding Window Maximum in O(n)',
    titleHi: 'Monotonic Deque: O(n) Mein Sliding Window Maximum',
    description: 'Finding the maximum of every window of size k by calling Math.max on each window separately. Every window re-scans k elements that the previous window had already scanned, so a 1,000,000-element array with a window of 1,000 does a billion comparisons for an answer that needs only about a million.',
    descriptionHi: 'Size k ki har window ka maximum har window par alag se Math.max call karke dhoondhna. Har window un k elements ko dobara scan karti hai jinhe pichhli window pehle hi scan kar chuki thi, isliye 1,000 ki window waala ek 1,000,000-element array ek arab comparisons karta hai ek aise jawaab ke liye jise sirf lagbhag ek million chahiye.',
    difficulty: 'HARD',
    duration: 26,
    order: 5,

    analogy: {
      en: '**A single job opening, a waiting room, and the moment a stronger candidate walks in.** Candidates arrive one at a time and wait. There is exactly one position, and offers are always made to the strongest person currently in the room. Now suppose someone walks in who is stronger than three of the people already waiting. Those three are not merely behind in the queue — they are permanently out of the running, and here is the precise reason: the newcomer is both stronger AND newer, so for as long as any of those three would still be eligible, the newcomer is eligible too and beats them. There is no future moment at which one of them becomes the answer. So the receptionist does not keep them politely waiting — they are dismissed the instant the stronger newcomer arrives, and the room shrinks. The only people worth keeping are those in strictly descending order of strength: the strongest at the front, then people who are weaker but will outlast them and might inherit the position later. Separately, candidates have expiry times, and each one eventually becomes too old to be considered — that only ever happens to the person at the FRONT, because they arrived earliest. So the room is managed at both ends: the strongest-and-oldest leave from the front when they expire, and the weak leave from the back the moment someone better arrives. That two-ended discipline is exactly why a stack is not enough here — a stack can only remove from the end you add to — and exactly what a double-ended queue provides.',
      hi: '**Ek akeli job opening, ek waiting room, aur wo pal jab ek mazboot candidate andar aata hai.** Candidates ek-ek karke aate hain aur intezaar karte hain. Bilkul ek position hai, aur offers hamesha kamre mein maujood sabse mazboot vyakti ko diye jaate hain. Ab maano koi andar aata hai jo pehle se intezaar kar rahe teen logon se mazboot hai. Wo teen sirf queue mein peechhe nahi hain — wo sthaayi roop se daud se baahar hain, aur yahaan thik-thik kaaran hai: naya aane waala mazboot AUR naya dono hai, isliye jab tak un teenon mein se koi bhi paatra rahega, naya aane waala bhi paatra hai aur unhe haraata hai. Aisa koi bhavishya ka pal nahi hai jab unmein se koi jawaab bane. Isliye receptionist unhe vinamrata se intezaar karaata nahi rakhta — jis pal mazboot naya aane waala aata hai unhe vidaa kar diya jaata hai, aur kamra sikudta hai. Sirf wahi log rakhne laayak hain jo mazbooti ke sakht ghatte kram mein hain: sabse mazboot aage, phir wo log jo kamzor hain par unse zyaada tikenge aur baad mein position viraasat mein le sakte hain. Alag se, candidates ke expiry times hain, aur har ek aakhirkaar vichaar ke liye bahut purana ho jaata hai — wo hamesha sirf SAMNE waale vyakti ke saath hota hai, kyunki wo sabse pehle aaye the. Toh kamra dono siron par sambhaala jaata hai: sabse mazboot-aur-purane expire hone par aage se jaate hain, aur kamzor peechhe se jaate hain jis pal koi behtar aata hai. Wahi do-siron waala anushaasan bilkul wajah hai ki yahaan ek stack kaafi nahi hai — ek stack sirf usi sire se hata sakta hai jismein aap jodte ho — aur bilkul wo hai jo ek double-ended queue deta hai.',
    },

    simple: `**Start broken.** Recompute the maximum of each window from scratch:

\`\`\`js
function maxSlidingWindowBrute(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let best = -Infinity;
    for (let j = i; j < i + k; j++) {        // re-scan all k elements, every window
      if (nums[j] > best) best = nums[j];
    }
    out.push(best);
  }
  return out;
}

console.log(maxSlidingWindowBrute([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]   <-- correct, but O(n * k)
\`\`\`

The answers are right; the cost is not. Window \`[i, i+k-1]\` and window \`[i+1, i+k]\` share \`k - 1\` elements, and this code re-examines every one of them. For \`n = 1,000,000\` and \`k = 1,000\` that is about 10^9 comparisons.

The tempting fix is a max-heap, and it is a trap:

\`\`\`js
// heap holds VALUES only -> after the window moves past an element,
// the heap still reports it as the max. Stale, wrong answers.
// Fixing that needs [value, index] pairs and lazy eviction,
// which works but costs O(n log n) and a lot of ceremony.
\`\`\`

**The fix: a deque holding INDICES, kept in decreasing order of value**

\`\`\`js
function maxSlidingWindow(nums, k) {
  const out = [];
  const dq = [];                              // holds INDICES, values strictly decreasing

  for (let i = 0; i < nums.length; i++) {
    // 1. FRONT: drop the index that has just slid out of the window
    if (dq.length && dq[0] <= i - k) dq.shift();

    // 2. BACK: drop every index whose value can never be a maximum again,
    //    because nums[i] is both LARGER and NEWER than it
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();

    // 3. this index is now a candidate
    dq.push(i);

    // 4. once a full window exists, its max is at the front by construction
    if (i >= k - 1) out.push(nums[dq[0]]);
  }

  return out;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]   <-- same answers, O(n)
\`\`\`

\`\`\`ts
function maxSlidingWindow(nums: number[], k: number): number[] {
  const out: number[] = [];
  const dq: number[] = [];                    // indices, values strictly decreasing

  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0]! <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]!]! <= nums[i]!) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]!]!);
  }

  return out;
}
\`\`\`

Two rules, one at each end, and they are doing completely different jobs. The **front** rule is about *time* — an index too old for the current window is evicted. The **back** rule is about *dominance* — a smaller element that arrived earlier than a bigger one is useless forever, so it is discarded on arrival of the bigger one. Together they leave the deque holding exactly the elements that could still become a maximum, in decreasing order, so the answer is always \`nums[dq[0]]\`.`,

    simpleHi: `**Toote hue se shuru.** Har window ka maximum shuru se dobara compute karo:

\`\`\`js
function maxSlidingWindowBrute(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let best = -Infinity;
    for (let j = i; j < i + k; j++) {        // har window par saare k elements dobara scan
      if (nums[j] > best) best = nums[j];
    }
    out.push(best);
  }
  return out;
}

console.log(maxSlidingWindowBrute([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]   <-- sahi, par O(n * k)
\`\`\`

Jawaab sahi hain; cost nahi. Window \`[i, i+k-1]\` aur window \`[i+1, i+k]\` \`k - 1\` elements share karti hain, aur ye code unmein se har ek ko dobara jaanchta hai. \`n = 1,000,000\` aur \`k = 1,000\` ke liye wo lagbhag 10^9 comparisons hai.

Lubhaawana fix ek max-heap hai, aur ye ek jaal hai:

\`\`\`js
// heap sirf VALUES rakhta hai -> jab window ek element se aage nikal jaati hai,
// heap abhi bhi use max batata hai. Purane, galat jawaab.
// Use theek karne ko [value, index] jodiyaan aur lazy eviction chahiye,
// jo kaam karta hai par O(n log n) aur bahut taam-jhaam kharch karta hai.
\`\`\`

**Fix: ek deque jo INDICES rakhta hai, value ke ghatte kram mein**

\`\`\`js
function maxSlidingWindow(nums, k) {
  const out = [];
  const dq = [];                              // INDICES rakhta hai, values sakht ghatti hui

  for (let i = 0; i < nums.length; i++) {
    // 1. AAGE: wo index girao jo abhi window se baahar nikla hai
    if (dq.length && dq[0] <= i - k) dq.shift();

    // 2. PEECHHE: har wo index girao jiski value dobara kabhi maximum nahi ban sakti,
    //    kyunki nums[i] usse BADA aur NAYA dono hai
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();

    // 3. ye index ab ek candidate hai
    dq.push(i);

    // 4. ek baar poori window maujood hai, iska max nirmaan se aage hai
    if (i >= k - 1) out.push(nums[dq[0]]);
  }

  return out;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));
// [3, 3, 5, 5, 6, 7]   <-- wahi jawaab, O(n)
\`\`\`

\`\`\`ts
function maxSlidingWindow(nums: number[], k: number): number[] {
  const out: number[] = [];
  const dq: number[] = [];                    // indices, values sakht ghatti hui

  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0]! <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]!]! <= nums[i]!) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]!]!);
  }

  return out;
}
\`\`\`

Do niyam, har sire par ek, aur wo bilkul alag kaam kar rahe hain. **Aage** waala niyam *samay* ke baare mein hai — current window ke liye bahut purana index nikaala jaata hai. **Peechhe** waala niyam *dominance* ke baare mein hai — ek chhota element jo ek bade se pehle aaya hamesha ke liye bekaar hai, isliye bade ke aane par ise phenka jaata hai. Milkar wo deque mein bilkul wahi elements chhodte hain jo abhi bhi maximum ban sakte hain, ghatte kram mein, isliye jawaab hamesha \`nums[dq[0]]\` hai.`,

    content: `## The trace: watch the deque, not the array

\`\`\`
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k = 3
(deque shown as indices, with their values in parentheses)

i=0  v=1   back: empty            deque: [0(1)]
i=1  v=3   back: 1 <= 3, pop 0    deque: [1(3)]
i=2  v=-1  back: 3 > -1, keep     deque: [1(3), 2(-1)]   -> window [1,3,-1] max = 3  OK
i=3  v=-3  front: 1 > 3-3=0, keep
           back: -1 > -3, keep    deque: [1(3), 2(-1), 3(-3)] -> max = 3  OK
i=4  v=5   front: 1 <= 4-3=1, SHIFT (index 1 has left the window)
           back: -3 <= 5 pop; -1 <= 5 pop   deque: [4(5)]  -> max = 5  OK
i=5  v=3   back: 5 > 3, keep      deque: [4(5), 5(3)]    -> max = 5  OK
i=6  v=6   back: 3 <= 6 pop; 5 <= 6 pop     deque: [6(6)] -> max = 6  OK
i=7  v=7   back: 6 <= 7, pop      deque: [7(7)]          -> max = 7  OK

result: [3, 3, 5, 5, 6, 7]
\`\`\`

Notice at \`i=4\`: index 1 is removed from the FRONT because it aged out, and indices 2 and 3 are removed from the BACK because 5 dominates them. Both ends fire in the same iteration, for entirely unrelated reasons. That is the whole data structure.

## Why it is O(n), even though there is a while loop inside a for loop

\`\`\`
This is the SAME amortised argument as the monotonic stack in lesson 3:

  every index is pushed onto the deque EXACTLY ONCE  (the dq.push(i) line)
  every index is removed from the deque AT MOST ONCE (by either shift or pop)

So across the entire run, the total number of pops plus shifts is at most n,
no matter how the inner while loop is distributed. One iteration might pop
five elements; another pops none. Total work: <= 2n operations.

  => O(n) time, O(k) space (the deque never holds more than k indices)
\`\`\`

A common misreading is "for inside while, therefore O(n * k)". Counting *total* pushes and pops instead of worst-case-per-iteration is the correct way to analyse this shape, and it is the same reasoning used for the monotonic stack, for KMP's pattern pointer, and for heapify.

## Why indices, not values

\`\`\`
Store VALUES:  deque = [3, -1]   ... which of these has expired? Unknown.
Store INDICES: deque = [1, 2]    ... index 1 expires when i - k >= 1. Decidable.
\`\`\`

The front rule needs to know *when* an element entered, and only an index carries that. Storing values makes the eviction condition unwritable, which is exactly the bug that sinks the naive max-heap version too: a heap ordered by value has no idea which entries are stale.

## The four variants you will actually be asked

\`\`\`
sliding window MAXIMUM   while (nums[back] <= nums[i]) pop    deque DECREASING
sliding window MINIMUM   while (nums[back] >= nums[i]) pop    deque INCREASING
                         (flip the comparison — nothing else changes)

"shortest subarray with sum >= K" (with negatives)
                         monotonic deque over PREFIX SUMS, increasing

"jump game / DP with a window constraint"
                         deque holding dp indices — max over the last k dp values
                         turns an O(n*k) DP into O(n)
\`\`\`

That last one is the pro-level use, and it is why this lesson sits after the DP module in importance: any DP recurrence of the form \`dp[i] = value[i] + max(dp[i-k..i-1])\` is a sliding-window maximum in disguise, and the deque removes a whole factor of k from the DP.

## Choosing the right structure for "max over a range"

\`\`\`
window slides, one direction, fixed size   -> monotonic deque      O(n)
arbitrary range, array never changes       -> sparse table         O(1) per query
arbitrary range, array changes             -> segment tree         O(log n) per query
k largest overall (not per window)         -> heap                 O(n log k)
next greater element, whole array          -> monotonic STACK      O(n)
\`\`\`

Reach for the deque only when the window moves monotonically. The moment queries jump around arbitrarily, the deque's core assumption — that anything leaving the front is gone forever — stops holding, and you need the segment tree from Module 2.`,

    contentHi: `## Trace: array nahi, deque dekho

\`\`\`
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k = 3
(deque indices ki tarah dikhaaya gaya hai, unki values brackets mein)

i=0  v=1   peechhe: khaali          deque: [0(1)]
i=1  v=3   peechhe: 1 <= 3, pop 0   deque: [1(3)]
i=2  v=-1  peechhe: 3 > -1, rakho   deque: [1(3), 2(-1)]   -> window [1,3,-1] max = 3  OK
i=3  v=-3  aage: 1 > 3-3=0, rakho
           peechhe: -1 > -3, rakho  deque: [1(3), 2(-1), 3(-3)] -> max = 3  OK
i=4  v=5   aage: 1 <= 4-3=1, SHIFT (index 1 window se nikal gaya)
           peechhe: -3 <= 5 pop; -1 <= 5 pop  deque: [4(5)]  -> max = 5  OK
i=5  v=3   peechhe: 5 > 3, rakho    deque: [4(5), 5(3)]    -> max = 5  OK
i=6  v=6   peechhe: 3 <= 6 pop; 5 <= 6 pop    deque: [6(6)] -> max = 6  OK
i=7  v=7   peechhe: 6 <= 7, pop     deque: [7(7)]          -> max = 7  OK

result: [3, 3, 5, 5, 6, 7]
\`\`\`

\`i=4\` par dhyaan do: index 1 AAGE se hataaya jaata hai kyunki wo purana ho gaya, aur indices 2 aur 3 PEECHHE se hataaye jaate hain kyunki 5 unpar haavi hai. Dono sire usi iteration mein chalte hain, poori tarah asambandhit kaarano se. Wahi poora data structure hai.

## Ye O(n) kyun hai, jabki ek for loop ke andar ek while loop hai

\`\`\`
Ye lesson 3 ke monotonic stack jaisa hi amortised argument hai:

  har index deque par BILKUL EK BAAR push hota hai   (dq.push(i) line)
  har index deque se ZYAADA SE ZYAADA EK BAAR hatta hai (shift ya pop se)

Toh poore run par, kul pops plus shifts zyaada se zyaada n hain, chahe inner
while loop kaise bhi baanta ho. Ek iteration paanch elements pop kar sakti hai;
doosri koi nahi. Kul kaam: <= 2n operations.

  => O(n) time, O(k) space (deque kabhi k se zyaada indices nahi rakhta)
\`\`\`

Ek aam galat padhaai "while ke andar for, isliye O(n * k)" hai. Prati-iteration worst-case ke bajaye *kul* pushes aur pops ginna is shape ka vishleshan karne ka sahi tarika hai, aur wahi tark monotonic stack, KMP ke pattern pointer, aur heapify ke liye istemal hota hai.

## Indices kyun, values kyun nahi

\`\`\`
VALUES rakho:  deque = [3, -1]   ... inmein se kaunsa expire ho gaya? Anjaan.
INDICES rakho: deque = [1, 2]    ... index 1 expire hota hai jab i - k >= 1. Tay ho sakta hai.
\`\`\`

Aage waale niyam ko jaanna hai ki ek element *kab* aaya, aur sirf ek index wo rakhta hai. Values rakhna eviction condition ko likha-na-jaa-sakne-waala banaata hai, jo bilkul wo bug hai jo naive max-heap version ko bhi duboota hai: value se ordered ek heap ko koi andaaza nahi ki kaunsi entries purani hain.

## Wo chaar variants jo aapse asal mein poochhe jaayenge

\`\`\`
sliding window MAXIMUM   while (nums[back] <= nums[i]) pop    deque GHATTA HUA
sliding window MINIMUM   while (nums[back] >= nums[i]) pop    deque BADHTA HUA
                         (comparison palto — aur kuch nahi badalta)

"sum >= K waala sabse chhota subarray" (negatives ke saath)
                         PREFIX SUMS par monotonic deque, badhta hua

"jump game / ek window constraint waala DP"
                         dp indices rakhne waala deque — aakhri k dp values par max
                         ek O(n*k) DP ko O(n) mein badalta hai
\`\`\`

Wo aakhri pro-level istemal hai, aur yahi wajah hai ki ye lesson mahatva mein DP module ke baad baithta hai: \`dp[i] = value[i] + max(dp[i-k..i-1])\` roop ki koi bhi DP recurrence bhes mein ek sliding-window maximum hai, aur deque DP se k ka poora ek factor hataa deta hai.

## "Ek range par max" ke liye sahi structure chunna

\`\`\`
window slide karti hai, ek disha, fixed size   -> monotonic deque   O(n)
mann-maani range, array kabhi nahi badalta     -> sparse table      prati query O(1)
mann-maani range, array badalta hai            -> segment tree      prati query O(log n)
kul milaakar k sabse bade (prati window nahi)  -> heap              O(n log k)
next greater element, poora array              -> monotonic STACK   O(n)
\`\`\`

Deque ki taraf sirf tab pahuncho jab window monotonically move karti hai. Jis pal queries mann-maane tarike se koodti hain, deque ki mool maanyata — ki aage se jo bhi nikalta hai wo hamesha ke liye gaya — tikna band ho jaati hai, aur aapko Module 2 waala segment tree chahiye.`,

    examples: [
      {
        title: 'Broken: re-scanning every window, O(n * k)',
        titleHi: 'Toota: har window dobara scan karna, O(n * k)',
        code: `for (let j = i; j < i + k; j++) if (nums[j] > best) best = nums[j];
// windows [i..i+k-1] and [i+1..i+k] share k-1 elements — all re-examined`,
        codeJs: `function maxSlidingWindowBrute(nums, k) {
  const out = [];
  let comparisons = 0;
  for (let i = 0; i + k <= nums.length; i++) {
    let best = -Infinity;
    for (let j = i; j < i + k; j++) { comparisons++; if (nums[j] > best) best = nums[j]; }
    out.push(best);
  }
  return { out, comparisons };
}
console.log(maxSlidingWindowBrute([1, 3, -1, -3, 5, 3, 6, 7], 3));

const big = Array.from({ length: 20000 }, (_, i) => (i * 7919) % 20000);
console.log('brute comparisons:', maxSlidingWindowBrute(big, 500).comparisons);`,
        codeTs: `function maxSlidingWindowBrute(nums: number[], k: number): number[] {
  const out: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let best = -Infinity;
    for (let j = i; j < i + k; j++) if (nums[j]! > best) best = nums[j]!;
    out.push(best);
  }
  return out;
}`,
        outputJs: `{ out: [ 3, 3, 5, 5, 6, 7 ], comparisons: 18 }
brute comparisons: 9750500`,
        outputTs: `// Same correct answers, same quadratic cost.`,
        explain: 'The answers are correct — the cost is the defect. Nearly ten million comparisons for a 20,000-element array, because each window redoes the work of the one before it.',
        explainHi: 'Jawaab sahi hain — cost kharaabi hai. Ek 20,000-element array ke liye lagbhag ek crore comparisons, kyunki har window apne se pehle waali ka kaam dobara karti hai.',
      },
      {
        title: 'Fixed: monotonic deque of indices, O(n)',
        titleHi: 'Theek: indices ka monotonic deque, O(n)',
        code: `if (dq.length && dq[0] <= i - k) dq.shift();                       // FRONT: expired
while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();  // BACK: dominated
dq.push(i);`,
        codeJs: `function maxSlidingWindow(nums, k) {
  const out = [], dq = [];
  let ops = 0;
  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0] <= i - k) { dq.shift(); ops++; }
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) { dq.pop(); ops++; }
    dq.push(i); ops++;
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return { out, ops };
}
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));

const big = Array.from({ length: 20000 }, (_, i) => (i * 7919) % 20000);
console.log('deque ops:', maxSlidingWindow(big, 500).ops);`,
        codeTs: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const out: number[] = [], dq: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0]! <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]!]! <= nums[i]!) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]!]!);
  }
  return out;
}`,
        outputJs: `{ out: [ 3, 3, 5, 5, 6, 7 ], ops: 15 }
deque ops: 39988`,
        outputTs: `// Identical answers, fully typed.`,
        explain: 'Same answers, ~40,000 operations instead of ~9,750,000 — a 240x reduction. Each index is pushed once and removed at most once, which is the amortised bound in action.',
        explainHi: 'Wahi jawaab, ~9,750,000 ke bajaye ~40,000 operations — 240 guna kami. Har index ek baar push hota hai aur zyaada se zyaada ek baar hatta hai, jo amortised bound kaam karte hue hai.',
      },
      {
        title: 'The same deque, one comparison flipped, gives the minimum',
        titleHi: 'Wahi deque, ek comparison palta, minimum deta hai',
        code: `while (dq.length && nums[dq[dq.length - 1]] >= nums[i]) dq.pop();
//                                              ^^ >= instead of <=`,
        codeJs: `function minSlidingWindow(nums, k) {
  const out = [], dq = [];
  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] >= nums[i]) dq.pop();   // flipped
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}
console.log(minSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));

// Pro use: dp[i] = nums[i] + max(dp[i-k .. i-1]) in O(n) instead of O(n*k)
function maxResult(nums, k) {
  const dp = new Array(nums.length).fill(0), dq = [0];
  dp[0] = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (dq[0] < i - k) dq.shift();
    dp[i] = nums[i] + dp[dq[0]];
    while (dq.length && dp[dq[dq.length - 1]] <= dp[i]) dq.pop();
    dq.push(i);
  }
  return dp[nums.length - 1];
}
console.log(maxResult([1, -1, -2, 4, -7, 3], 2));`,
        codeTs: `function minSlidingWindow(nums: number[], k: number): number[] {
  const out: number[] = [], dq: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (dq.length && dq[0]! <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]!]! >= nums[i]!) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[0]!]!);
  }
  return out;
}`,
        outputJs: `[ -1, -3, -3, -3, 3, 3 ]
7`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'One flipped comparison turns a decreasing deque into an increasing one and the maximum into the minimum. The DP variant is the pro-level payoff: any recurrence taking a max over the previous k states collapses from O(n*k) to O(n).',
        explainHi: 'Ek palta comparison ek ghatte deque ko badhte mein aur maximum ko minimum mein badal deta hai. DP variant pro-level faayda hai: pichhle k states par max lene waali koi bhi recurrence O(n*k) se O(n) par gir jaati hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// storing VALUES in the deque instead of indices
while (dq.length && dq[dq.length - 1] <= nums[i]) dq.pop();
dq.push(nums[i]);
// ...now there is no way to write the "has this expired?" check at all`,
        right: `while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
dq.push(i);                       // store the INDEX; read the value through nums[]`,
        why: 'The front-eviction rule is a statement about time — "this entered more than k steps ago" — and only an index carries that information. With values alone the check is unwritable, so stale maxima leak out of the window.',
        whyHi: 'Aage-nikaalne waala niyam samay ke baare mein ek kathan hai — "ye k steps se zyaada pehle aaya tha" — aur sirf ek index wo jaankari rakhta hai. Akeli values ke saath check likha hi nahi jaa sakta, isliye purane maxima window se baahar leak hote hain.',
      },
      {
        wrong: `// evicting the front AFTER reading the answer
if (i >= k - 1) out.push(nums[dq[0]]);
if (dq.length && dq[0] <= i - k) dq.shift();   // too late — already reported it`,
        right: `if (dq.length && dq[0] <= i - k) dq.shift();   // expire FIRST
while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
dq.push(i);
if (i >= k - 1) out.push(nums[dq[0]]);        // then read`,
        why: 'The three deque operations have a mandatory order: expire the front, discard dominated elements at the back, push the new index, and only then read the answer. Reading before expiring reports a maximum that has already left the window.',
        whyHi: 'Teenon deque operations ka ek anivaarya kram hai: aage waale ko expire karo, peechhe haavi elements phenko, naya index push karo, aur tabhi jawaab padho. Expire karne se pehle padhna ek aisa maximum batata hai jo pehle hi window se nikal chuka hai.',
      },
      {
        wrong: `// using < instead of <= at the back
while (dq.length && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
// equal values pile up: [5, 5, 5, 5] all stay in the deque`,
        right: `while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
// equal-and-older is also dominated: the newer copy outlives it and ties it`,
        why: 'An older element equal to the newcomer can never be strictly better and always expires sooner, so keeping it is pure waste. With < the answers stay correct but the deque grows on runs of equal values, which is the difference between O(k) and O(n) space on an array of identical numbers.',
        whyHi: 'Naye aane waale ke barabar ek purana element kabhi sakhti se behtar nahi ho sakta aur hamesha pehle expire hota hai, isliye use rakhna shuddh barbaadi hai. < ke saath jawaab sahi rehte hain par barabar values ke runs par deque badhta hai, jo samaan numbers ke ek array par O(k) aur O(n) space ka antar hai.',
      },
    ],

    realWorld: [
      {
        en: '**Real-time monitoring and alerting** — "peak CPU over the last 5 minutes", recomputed every second — is exactly sliding-window maximum, and the deque is what keeps the cost independent of the window length.',
        hi: '**Real-time monitoring aur alerting** — "pichhle 5 minute mein peak CPU", har second dobara compute kiya gaya — bilkul sliding-window maximum hai, aur deque wo hai jo cost ko window ki lambaayi se swatantra rakhta hai.',
      },
      {
        en: '**Financial charting** draws rolling high/low bands over price series with millions of ticks; a brute-force recompute per bar is quadratic, while the deque makes the whole series a single linear pass.',
        hi: '**Financial charting** laakhon ticks waali price series par rolling high/low bands banaata hai; prati bar ek brute-force recompute quadratic hai, jabki deque poori series ko ek akela linear pass banaata hai.',
      },
      {
        en: '**Audio and image processing** use the same structure for min/max filters (erosion and dilation over a moving kernel), where the window is fixed and slides in one direction — precisely the deque\'s assumption.',
        hi: '**Audio aur image processing** min/max filters (ek chalte kernel par erosion aur dilation) ke liye wahi structure istemal karte hain, jahaan window fixed hai aur ek disha mein slide karti hai — bilkul deque ki maanyata.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a monotonic stack not solve sliding window maximum, and what exactly does the deque add?',
        qHi: 'Ek monotonic stack sliding window maximum kyun nahi solve kar sakta, aur deque thik-thik kya jodta hai?',
        a: 'A monotonic stack maintains the same core invariant — throw away any element that a newer, larger element dominates — and that invariant alone is enough for next-greater-element, because there the only thing that ever removes an element is being dominated. Sliding window maximum has a second, completely independent reason for removal: an element can age out of the window. It has not been beaten by anything; it is simply too old to count. And critically, the element that ages out is always the oldest one still being tracked, which sits at the opposite end from where new elements arrive. A stack only exposes one end. You push and pop at the same end, so there is no operation that can remove the oldest item, and no amount of cleverness with a stack fixes that, because the structure physically does not offer the access. A deque exposes both ends, and that is the entire addition. The back end behaves exactly like the monotonic stack — push a new index, and before pushing, pop every index whose value is less than or equal to the new one, because those can never be the answer again now that something both larger and longer-lived exists. The front end handles expiry — before reading the answer, if the front index is more than k minus one positions behind the current index, remove it. Those two rules never interfere with each other because they are enforced at opposite ends and for opposite reasons. And the payoff is that the front of the deque is, by construction, always the maximum of the current window, so reading the answer is a single array access. The cost analysis is the same amortised argument as the stack: each index enters the deque exactly once and leaves at most once, so despite the inner while loop the total number of operations across the whole array is bounded by roughly two n, giving linear time and O of k space.',
        aHi: 'Ek monotonic stack wahi mool invariant rakhta hai — koi bhi element phenko jispar ek naya, bada element haavi hai — aur akela wo invariant next-greater-element ke liye kaafi hai, kyunki wahaan ek element ko hataane waali ekmatra cheez haavi hona hai. Sliding window maximum ke paas hataane ka ek doosra, poori tarah swatantra kaaran hai: ek element window se purana ho sakta hai. Use kisi ne haraaya nahi; wo bas ginne ke liye bahut purana hai. Aur mahatvapurna baat, jo element purana hota hai wo hamesha abhi bhi track kiya jaa raha sabse purana hai, jo us sire ke ulte baithta hai jahaan naye elements aate hain. Ek stack sirf ek sira dikhaata hai. Aap usi sire par push aur pop karte ho, isliye koi operation nahi hai jo sabse purani cheez hataa sake, aur stack ke saath kitni bhi chaturaai use theek nahi karti, kyunki structure bhautik roop se wo pahunch deta hi nahi. Ek deque dono sire dikhaata hai, aur wahi poora jodav hai. Peechhla sira bilkul monotonic stack jaisa vyavhaar karta hai — ek naya index push karo, aur push karne se pehle, har wo index pop karo jiski value naye se kam ya barabar hai. Aage waala sira expiry sambhaalta hai — jawaab padhne se pehle, agar aage waala index current index se k minus ek positions se zyaada peechhe hai, use hataao. Wo do niyam kabhi ek doosre mein dakhal nahi dete kyunki wo ulte siron par aur ulte kaarano se laagu hote hain. Aur faayda ye hai ki deque ka aage wala hissa, nirmaan se, hamesha current window ka maximum hai.',
      },
      {
        q: 'Analyse the time complexity. There is a while loop nested inside a for loop — justify why this is not O(n * k).',
        qHi: 'Time complexity ka vishleshan karo. Ek for loop ke andar ek while loop nested hai — sahi thehraao ki ye O(n * k) kyun nahi hai.',
        a: 'The nesting is misleading, and analysing it by multiplying the loop bounds gives the wrong answer. The correct technique is amortised analysis: instead of asking how much work a single iteration can do in the worst case, count the total work across the entire run by tracking what happens to each element over its whole lifetime. Here every index is pushed onto the deque exactly once, on the push line, which executes once per iteration of the outer loop and therefore n times in total. Every index can be removed from the deque at most once, either by the shift at the front when it expires or by a pop at the back when it is dominated. Once removed it is never re-added, because the loop only ever pushes the current index and the current index only comes up once. So the total number of removals across the whole run is bounded above by the total number of insertions, which is n. Adding those together, the deque performs at most two n operations for an array of length n, regardless of how unevenly the work is distributed. A single iteration might pop k elements at once, and that looks expensive in isolation, but it can only do so because k earlier iterations each did one cheap push and were charged for it. The expensive iteration is spending credit that was already paid. So the running time is O of n, and the space is O of k, because the deque holds only indices that are still inside the current window and there are at most k of those. This is the identical argument used for the monotonic stack, for the two pointers in KMP, and for building a heap with Floyd\'s method, and recognising the shape is what lets you avoid the quadratic misreading.',
        aHi: 'Nesting bhramit karne waali hai, aur loop bounds guna karke iska vishleshan galat jawaab deta hai. Sahi technique amortised analysis hai: ye poochhne ke bajaye ki ek akeli iteration worst case mein kitna kaam kar sakti hai, poore run par kul kaam gino har element ke saath uske poore jeevan par kya hota hai use track karke. Yahaan har index deque par bilkul ek baar push hota hai, push line par, jo outer loop ki prati iteration ek baar chalti hai aur isliye kul n baar. Har index deque se zyaada se zyaada ek baar hataaya jaa sakta hai, ya toh expire hone par aage waale shift se ya haavi hone par peechhe waale pop se. Ek baar hataaye jaane ke baad ye kabhi dobara nahi joda jaata, kyunki loop sirf current index push karta hai aur current index sirf ek baar aata hai. Toh poore run par kul hataane ki tadaad kul daalne ki tadaad se upar bandhi hai, jo n hai. Unhe jodkar, deque n lambaayi ke ek array ke liye zyaada se zyaada do n operations karta hai, chahe kaam kitne bhi asamaan roop se banta ho. Ek akeli iteration ek saath k elements pop kar sakti hai, aur wo alag se mehenga dikhta hai, par wo aisa sirf isliye kar sakti hai kyunki k pichhli iterations ne har ek ek sasta push kiya aur uske liye charge hui. Mehengi iteration wo credit kharch kar rahi hai jo pehle hi chukaaya gaya tha. Toh running time O of n hai, aur space O of k hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement maxSlidingWindow with the deque and verify it on [1,3,-1,-3,5,3,6,7] with k = 3 (expect [3,3,5,5,6,7]) and on [9,8,7,6] with k = 2 (expect [9,8,7]). Print the deque contents at every step and confirm the values are always strictly decreasing.',
        taskHi: 'maxSlidingWindow ko deque se implement karo aur ise [1,3,-1,-3,5,3,6,7] par k = 3 ke saath verify karo (expect [3,3,5,5,6,7]) aur [9,8,7,6] par k = 2 ke saath (expect [9,8,7]). Har step par deque ka content print karo aur confirm karo ki values hamesha sakhti se ghat rahi hain.',
        hint: 'On a strictly decreasing input like [9,8,7,6] the back-pop never fires — every element is smaller than the one before, so nothing is dominated and the deque fills to size k. That is the worst case for space, and it is still only k.',
        hintHi: '[9,8,7,6] jaise sakhti se ghatte input par peechhe waala pop kabhi nahi chalta — har element apne se pehle waale se chhota hai, isliye kuch bhi haavi nahi hota aur deque size k tak bharta hai. Wo space ke liye worst case hai, aur wo abhi bhi sirf k hai.',
      },
      {
        task: 'Take the working solution and move the front-eviction line to AFTER the out.push line. Find an input where the output becomes wrong and explain which window reports a stale maximum.',
        taskHi: 'Kaam karte solution ko lo aur aage-nikaalne waali line ko out.push line ke BAAD le jaao. Ek aisa input dhoondho jahaan output galat ho jaata hai aur samjhaao ki kaunsi window ek purana maximum batati hai.',
        hint: 'Try [5,1,1,1] with k = 3. The 5 at index 0 leaves the window when i reaches 3, but if you read before evicting, the second window still reports 5 instead of 1.',
        hintHi: '[5,1,1,1] ko k = 3 ke saath try karo. Index 0 par 5 window se nikalta hai jab i 3 tak pahunchta hai, par agar aap nikaalne se pehle padhte ho, doosri window abhi bhi 1 ke bajaye 5 batati hai.',
      },
      {
        task: 'Solve "Jump Game VI" with the deque: dp[i] = nums[i] + max(dp[i-k..i-1]), returning dp[n-1]. Verify maxResult([1,-1,-2,4,-7,3], 2) returns 7. Then write the O(n*k) version with an inner loop and confirm both agree on random inputs.',
        taskHi: '"Jump Game VI" ko deque se solve karo: dp[i] = nums[i] + max(dp[i-k..i-1]), dp[n-1] return karte hue. Verify karo ki maxResult([1,-1,-2,4,-7,3], 2) 7 return karta hai. Phir ek inner loop ke saath O(n*k) version likho aur confirm karo ki dono random inputs par sahmat hain.',
        hint: 'The deque here holds dp indices ordered by decreasing dp value, not by nums value. That substitution — sliding-window max over the DP table rather than the input array — is the whole trick, and it removes a factor of k from the DP.',
        hintHi: 'Yahaan deque nums value ke bajaye ghatti dp value se ordered dp indices rakhta hai. Wo badlav — input array ke bajaye DP table par sliding-window max — poora trick hai, aur ye DP se k ka ek factor hataata hai.',
      },
    ],

    keyTakeaways: [
      'Recomputing the max of each window is O(n * k) because consecutive windows share k-1 elements and the naive version re-scans all of them.',
      'A monotonic stack is not enough: elements leave for TWO reasons — being dominated (back) and aging out (front) — and a stack exposes only one end. A deque exposes both.',
      'Store INDICES, not values. The front-eviction rule "dq[0] <= i - k" is a statement about time, and only an index carries that information.',
      'The order is mandatory: expire the front, pop dominated elements at the back, push i, THEN read nums[dq[0]]. Reading before expiring reports a max that has left the window.',
      'Use <= (not <) at the back — an older element equal to the newcomer is also dominated, since the newer copy ties it and outlives it.',
      'It is O(n) by the same amortised argument as the monotonic stack: each index is pushed exactly once and removed at most once, so total operations <= 2n despite the nested while loop. Space is O(k).',
      'Flip one comparison for sliding-window minimum. The pro-level use is DP: any recurrence dp[i] = value[i] + max(dp[i-k..i-1]) drops from O(n*k) to O(n).',
    ],
    keyTakeawaysHi: [
      'Har window ka max dobara compute karna O(n * k) hai kyunki lagataar windows k-1 elements share karti hain aur naive version un sabko dobara scan karta hai.',
      'Ek monotonic stack kaafi nahi hai: elements DO kaarano se jaate hain — haavi hona (peechhe) aur purana hona (aage) — aur ek stack sirf ek sira dikhaata hai. Ek deque dono dikhaata hai.',
      'INDICES rakho, values nahi. Aage-nikaalne waala niyam "dq[0] <= i - k" samay ke baare mein ek kathan hai, aur sirf ek index wo jaankari rakhta hai.',
      'Kram anivaarya hai: aage waale ko expire karo, peechhe haavi elements pop karo, i push karo, PHIR nums[dq[0]] padho. Expire karne se pehle padhna ek aisa max batata hai jo window se nikal chuka hai.',
      'Peechhe <= istemal karo (< nahi) — naye aane waale ke barabar ek purana element bhi haavi hai, kyunki nayi copy usse barabari karti hai aur zyaada tikti hai.',
      'Ye monotonic stack jaise hi amortised argument se O(n) hai: har index bilkul ek baar push hota hai aur zyaada se zyaada ek baar hatta hai, isliye nested while loop ke baawajood kul operations <= 2n. Space O(k) hai.',
      'Sliding-window minimum ke liye ek comparison palto. Pro-level istemal DP hai: koi bhi recurrence dp[i] = value[i] + max(dp[i-k..i-1]) O(n*k) se O(n) par girti hai.',
    ],
  },
];
