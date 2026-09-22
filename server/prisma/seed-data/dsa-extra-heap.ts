import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Heap — expansion batch, part 1 of 2. Rounds out the category beyond the
 * original one (Kth Largest Element in an Array) with the core priority-queue
 * toolkit: greedy-with-a-heap (stones, sticks, reorganize string), the
 * k-nearest/k-frequent family, a streaming design problem, and k-way merge.
 * JS has no built-in heap, so each solution here builds a small binary heap
 * inline (array-backed, sift-up/sift-down) — Python uses the standard
 * library `heapq`.
 */
export const dsaExtraHeap: SeedProblem[] = [
  {
    slug: 'last-stone-weight',
    title: 'Last Stone Weight',
    category: 'Heap',
    difficulty: 'EASY',
    description:
      'Repeatedly take the two heaviest stones and smash them together: if their weights are equal, both are destroyed; otherwise the lighter is destroyed and the heavier becomes the difference of the two. Continue until at most one stone remains. Return its weight, or `0` if none remain.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated stone weights\n\n**Output**\nThe final weight, or `0`.',
    descriptionHi:
      'Baar-baar do sabse bhaari stones uthao aur unhe smash karo: agar unke weights barabar hain, dono destroy ho jaate hain; warna halka destroy ho jaata hai aur bhaari, dono ka difference ban jaata hai. Ye tab tak chalao jab tak zyada se zyada ek stone na bache. Uska weight return karo, ya `0` agar koi na bache.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated stone weights\n\n**Output**\nFinal weight, ya `0`.',
    examples: [
      { input: '6\n2 7 4 1 8 1', output: '1' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['0 <= n <= 30', '1 <= weight <= 1000'],
    hints: [
      'You always need the two CURRENT heaviest stones, and the set of stones keeps changing — a max-heap is built exactly for repeatedly getting "the current biggest" efficiently.',
      'JS has no built-in heap, so implement a small array-backed binary heap (or negate values and use a min-heap trick as a shortcut).',
      'After smashing, if a positive difference remains, push it back into the heap — it is a new stone that could be involved in future smashes.',
    ],
    approach:
      'Build a max-heap of the stone weights. Repeatedly pop the two largest; if they differ, push the difference back in. Stop when at most one stone remains, and report its weight (or 0 if the heap is empty).',
    approachHi:
      'Stone weights ka ek max-heap banao. Baar-baar do sabse bade pop karo; agar wo alag hain, difference wapas push kar do. Jab zyada se zyada ek stone bache, ruk jao, aur uska weight report karo (ya khaali hone par 0).',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The set of "current heaviest stones" changes after every smash (a new, smaller stone might appear, or two stones vanish entirely), which is exactly the scenario a heap is built for: repeatedly extracting an extreme value while efficiently accommodating new insertions, in O(log n) per operation rather than re-scanning or re-sorting the whole collection every single time a stone is added or removed.',
    solutionExplanationHi:
      '"Abhi ke sabse bhaari stones" ka set har smash ke baad badalta hai (ek naya, chhota stone aa sakta hai, ya do stones bilkul gayab ho sakte hain) — yahi exactly wo scenario hai jiske liye heap bana hai: baar-baar ek extreme value nikalna, naye insertions ko efficiently accommodate karte hue, O(log n) per operation mein, na ki har baar stone add/remove hone par poori collection dobara scan ya sort karna.',
    starter: starter(
      `const stones = nums(1);

// A small array-backed max-heap.
class MaxHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] >= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let largest = i;
        if (l < this.a.length && this.a[l] > this.a[largest]) largest = l;
        if (r < this.a.length && this.a[r] > this.a[largest]) largest = r;
        if (largest === i) break;
        [this.a[largest], this.a[i]] = [this.a[i], this.a[largest]];
        i = largest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

function lastStoneWeight(stones) {
  // your code here
}

console.log(lastStoneWeight(stones));`,
      `import heapq
stones = nums(1)

def last_stone_weight(stones):
    # your code here
    pass

print(last_stone_weight(stones))`,
    ),
    solution: solution(
      `const stones = nums(1);
class MaxHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] >= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let largest = i;
        if (l < this.a.length && this.a[l] > this.a[largest]) largest = l;
        if (r < this.a.length && this.a[r] > this.a[largest]) largest = r;
        if (largest === i) break;
        [this.a[largest], this.a[i]] = [this.a[i], this.a[largest]];
        i = largest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}
function lastStoneWeight(stones) {
  const heap = new MaxHeap();
  for (const s of stones) heap.push(s);
  while (heap.size > 1) {
    const a = heap.pop(), b = heap.pop();
    if (a !== b) heap.push(a - b);
  }
  return heap.size ? heap.pop() : 0;
}
console.log(lastStoneWeight(stones));`,
      `import heapq
stones = nums(1)

def last_stone_weight(stones):
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        a = -heapq.heappop(heap)
        b = -heapq.heappop(heap)
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0

print(last_stone_weight(stones))`,
    ),
    testCases: [
      sample('6\n2 7 4 1 8 1', '1'),
      sample('1\n1', '1'),
      hidden('0\n', '0'),
      hidden('2\n5 5', '0'),
      hidden('3\n1 1 1', '1'),
      hidden('4\n10 4 2 10', '2'),
    ],
  },

  {
    slug: 'k-closest-points-to-origin',
    title: 'K Closest Points to Origin',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Find the `k` points closest to the origin `(0, 0)` by Euclidean distance. Print them sorted by increasing distance (ties broken by smaller x, then smaller y).\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `x y`\n- Line after that: `k`\n\n**Output**\nThe `k` closest points, one per line as `x y`, in the order described above.',
    descriptionHi:
      '`(0, 0)` origin ke sabse nazdeek `k` points Euclidean distance ke hisaab se dhoondo. Unhe badhti hui distance ke hisaab se print karo (tie hone par chhota x, phir chhota y).\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `x y`\n- Uske baad: `k`\n\n**Output**\n`k` sabse nazdeek points, ek line par ek `x y` format mein, upar bataye order mein.',
    examples: [
      { input: '2\n1 3\n-2 2\n1', output: '-2 2' },
      { input: '3\n3 3\n5 -1\n-2 4\n2', output: '3 3\n-2 4' },
    ],
    constraints: ['1 <= k <= n <= 10^4'],
    hints: [
      'Comparing actual Euclidean distances requires a square root — comparing SQUARED distances gives the same ordering without it, and avoids floating-point issues entirely.',
      'A max-heap of size k (keyed by squared distance) is a good fit: keep the k closest points seen so far, and whenever a new point is closer than the current farthest of those k, evict the farthest and insert the new one.',
      'The final required output order (by distance, then x, then y) may differ from the heap\'s internal order — sort the final k points separately before printing.',
    ],
    approach:
      'Maintain a max-heap of size `k`, keyed by squared distance from the origin. For each point, if the heap has fewer than `k` points, insert it; otherwise, if it is closer than the heap\'s current farthest (the max), evict the farthest and insert the new point. Once all points are processed, sort the `k` remaining points by (distance, x, y) for deterministic output.',
    approachHi:
      'Origin se squared distance ke hisaab se keyed, size `k` ka ek max-heap rakho. Har point ke liye, agar heap mein `k` se kam points hain, use insert karo; warna, agar wo heap ke current farthest (max) se nazdeek hai, farthest ko evict karke naya point insert karo. Saare points process hone ke baad, deterministic output ke liye bache hue `k` points ko (distance, x, y) se sort karo.',
    timeComplexity: 'O(n log k)',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'A max-heap of size k is the natural fit here because it is only ever the CURRENT farthest among the k kept-so-far points that needs to be compared against and possibly evicted — a min-heap would put the wrong end (the closest point) at the root, making eviction decisions awkward. Comparing squared distances instead of true distances avoids both a costly sqrt call per comparison and any floating-point precision concerns, since squaring preserves the relative ordering of non-negative distances exactly.',
    solutionExplanationHi:
      'Size k ka max-heap yahan natural fit hai kyunki sirf CURRENT farthest (ab tak ke k kept points mein se) ko hi compare karke shayad evict karna hai — min-heap galat end (sabse nazdeek point) ko root par rakhta, jisse eviction decisions awkward ho jaate. Actual distances ke bajaye squared distances compare karna, har comparison ke liye mehenga sqrt call aur koi bhi floating-point precision ki chinta, dono avoid karta hai, kyunki squaring non-negative distances ki relative ordering ko exactly preserve karta hai.',
    starter: starter(
      `const n = num(0);
const points = [];
for (let i = 0; i < n; i++) points.push(nums(1 + i));
const k = num(1 + n);

function kClosest(points, k) {
  // return the k closest points, each [x, y]
  return [];
}

const result = kClosest(points, k).sort((a, b) => (a[0]*a[0]+a[1]*a[1]) - (b[0]*b[0]+b[1]*b[1]) || a[0]-b[0] || a[1]-b[1]);
for (const [x, y] of result) console.log(x + ' ' + y);`,
      `n = num(0)
points = [nums(1 + i) for i in range(n)]
k = num(1 + n)

def k_closest(points, k):
    # return the k closest points, each [x, y]
    return []

result = sorted(k_closest(points, k), key=lambda p: (p[0]**2 + p[1]**2, p[0], p[1]))
for x, y in result:
    print(x, y)`,
    ),
    solution: solution(
      `const n = num(0);
const points = [];
for (let i = 0; i < n; i++) points.push(nums(1 + i));
const k = num(1 + n);
function dist2(p) { return p[0] * p[0] + p[1] * p[1]; }
class MaxHeap {
  constructor() { this.a = []; }
  push(p) {
    this.a.push(p);
    let i = this.a.length - 1;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (dist2(this.a[par]) >= dist2(this.a[i])) break;
      [this.a[par], this.a[i]] = [this.a[i], this.a[par]];
      i = par;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let largest = i;
        if (l < this.a.length && dist2(this.a[l]) > dist2(this.a[largest])) largest = l;
        if (r < this.a.length && dist2(this.a[r]) > dist2(this.a[largest])) largest = r;
        if (largest === i) break;
        [this.a[largest], this.a[i]] = [this.a[i], this.a[largest]];
        i = largest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
  get top() { return this.a[0]; }
}
const heap = new MaxHeap();
for (const p of points) {
  if (heap.size < k) heap.push(p);
  else if (dist2(p) < dist2(heap.top)) { heap.pop(); heap.push(p); }
}
const result = heap.a.slice().sort((a, b) => dist2(a) - dist2(b) || a[0] - b[0] || a[1] - b[1]);
for (const [x, y] of result) console.log(x + ' ' + y);`,
      `import heapq
n = num(0)
points = [nums(1 + i) for i in range(n)]
k = num(1 + n)

def dist2(p):
    return p[0] ** 2 + p[1] ** 2

heap = []
for p in points:
    if len(heap) < k:
        heapq.heappush(heap, (-dist2(p), p[0], p[1]))
    elif dist2(p) < -heap[0][0]:
        heapq.heapreplace(heap, (-dist2(p), p[0], p[1]))

result = sorted([[x, y] for _, x, y in heap], key=lambda p: (dist2(p), p[0], p[1]))
for x, y in result:
    print(x, y)`,
    ),
    testCases: [
      sample('2\n1 3\n-2 2\n1', '-2 2'),
      sample('3\n3 3\n5 -1\n-2 4\n2', '3 3\n-2 4'),
      hidden('1\n0 0\n1', '0 0'),
      hidden('3\n1 0\n2 0\n3 0\n2', '1 0\n2 0'),
      hidden('4\n1 1\n1 1\n1 1\n1 1\n2', '1 1\n1 1'),
    ],
  },

  {
    slug: 'top-k-frequent-words',
    title: 'Top K Frequent Words',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Return the `k` most frequent words. Order by frequency descending; break ties alphabetically (ascending).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n- Line 3: `k`\n\n**Output**\nThe `k` words, one per line, in the order described above.',
    descriptionHi:
      '`k` sabse frequent words return karo. Frequency descending se order karo; tie hone par alphabetically (ascending).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n- Line 3: `k`\n\n**Output**\n`k` words, ek line par ek, upar bataye order mein.',
    examples: [
      { input: '6\ni love leetcode i love coding\n2', output: 'i\nlove' },
      { input: '10\nthe day is sunny the the the sunny is is\n4', output: 'the\nis\nsunny\nday' },
    ],
    constraints: ['1 <= k <= n <= 500', 'Lowercase English words'],
    hints: [
      'Count word frequencies first, as with any top-k-frequent problem.',
      'The custom tie-break (higher frequency first, alphabetical for ties) needs a custom comparator — a plain numeric-only comparison is not enough.',
      'Sorting all distinct words with that comparator and taking the first k is simplest; a heap-based approach uses the same comparator to maintain only the best k candidates at a time.',
    ],
    approach:
      'Count word frequencies with a hash map. Sort the distinct words by a comparator: higher frequency first, and for equal frequency, alphabetically ascending. Take the first `k`.',
    approachHi:
      'Hash map se word frequencies count karo. Distinct words ko ek comparator se sort karo: zyada frequency pehle, aur barabar frequency par, alphabetically ascending. Pehle `k` lo.',
    timeComplexity: 'O(d log d) where d is the number of distinct words (O(d log k) with a size-limited heap)',
    spaceComplexity: 'O(d)',
    solutionExplanation:
      'This is structurally the same problem as Top K Frequent Elements (in the HashMap category), except the tie-break rule is richer: numeric values have no natural secondary ordering, but words do (alphabetical), so the comparator must be a compound key — primary on frequency descending, secondary on the word itself ascending — rather than a single numeric comparison. Whether implemented via a full sort or a size-limited heap, the correctness hinges entirely on getting that compound comparator right, since a comparator that only looks at frequency would leave tie order unspecified (and thus non-deterministic for a grader).',
    solutionExplanationHi:
      'Ye structurally Top K Frequent Elements (HashMap category) jaisa hi problem hai, bas tie-break rule zyada rich hai: numeric values ka koi natural secondary ordering nahi hota, par words ka hota hai (alphabetical) — isliye comparator ek compound key hona chahiye — primary frequency descending par, secondary khud word ascending par — sirf ek numeric comparison nahi. Chahe poore sort se implement karo ya size-limited heap se, correctness poori tarah us compound comparator ko sahi karne par depend karti hai, kyunki sirf frequency dekhne wala comparator tie order ko unspecified chhod dega (aur isliye grader ke liye non-deterministic).',
    starter: starter(
      `const words_ = words(1);
const k = num(2);

function topKFrequent(words_, k) {
  // return the top k words in the required order
  return [];
}

for (const w of topKFrequent(words_, k)) console.log(w);`,
      `words_ = words(1)
k = num(2)

def top_k_frequent(words_, k):
    # return the top k words in the required order
    return []

for w in top_k_frequent(words_, k):
    print(w)`,
    ),
    solution: solution(
      `const words_ = words(1);
const k = num(2);
const count = new Map();
for (const w of words_) count.set(w, (count.get(w) ?? 0) + 1);
const sorted = [...count.keys()].sort((a, b) => count.get(b) - count.get(a) || (a < b ? -1 : 1));
for (const w of sorted.slice(0, k)) console.log(w);`,
      `words_ = words(1)
k = num(2)
from collections import Counter
count = Counter(words_)
ordered = sorted(count.keys(), key=lambda w: (-count[w], w))
for w in ordered[:k]:
    print(w)`,
    ),
    testCases: [
      sample('6\ni love leetcode i love coding\n2', 'i\nlove'),
      sample('10\nthe day is sunny the the the sunny is is\n4', 'the\nis\nsunny\nday'),
      hidden('1\na\n1', 'a'),
      hidden('3\na b c\n3', 'a\nb\nc'),
      hidden('4\nb a b a\n1', 'a'),
    ],
  },

  {
    slug: 'kth-largest-element-in-a-stream',
    title: 'Kth Largest Element in a Stream',
    category: 'Heap',
    difficulty: 'EASY',
    description:
      'Design a structure initialized with `k` and an initial array, that supports adding new values one at a time, each time reporting the current `k`-th largest value across everything added so far (including the initial array).\n\n**Input**\n- Line 1: `k`\n- Line 2: `n` (size of the initial array)\n- Line 3: `n` initial values (may be empty if `n` is 0)\n- Line 4: `q` (number of values to add)\n- Line 5: `q` values to add, in order\n\n**Output**\n`q` lines: the current `k`-th largest value after each addition.',
    descriptionHi:
      'Ek structure design karo jo `k` aur ek initial array se initialize ho, ek-ek karke naye values add karne ko support kare, har baar ab tak add hue sab (initial array samet) mein se current `k`-vaan sabse bada value report karte hue.\n\n**Input**\n- Line 1: `k`\n- Line 2: `n` (initial array ka size)\n- Line 3: `n` initial values (khaali ho sakti hai agar `n` 0 hai)\n- Line 4: `q` (add karne wale values ki sankhya)\n- Line 5: `q` values, order mein\n\n**Output**\n`q` lines: har addition ke baad current `k`-vaan sabse bada value.',
    examples: [
      { input: '3\n4\n4 5 8 2\n5\n3 5 10 9 4', output: '4\n5\n5\n8\n8' },
    ],
    constraints: ['1 <= k <= 10^4', 'There will always be at least k elements available when queried'],
    hints: [
      'Recomputing the kth largest from scratch after every addition (e.g. by sorting) is correct but wasteful.',
      'A min-heap of size exactly k, holding only the k CURRENT largest values seen so far, keeps the answer always at the root.',
      'On each addition: push the new value, then if the heap now exceeds size k, pop the smallest — the root is always the answer.',
    ],
    approach:
      'Maintain a min-heap capped at size `k`, seeded with the `k` largest values from the initial array (or fewer, plus filler as values arrive, if the initial array has fewer than `k` elements). On each `add`, push the new value; if the heap size exceeds `k`, pop the minimum. The root of the heap is always the current `k`-th largest.',
    approachHi:
      'Size `k` par capped ek min-heap rakho, initial array ki `k` sabse badi values se seed kiya hua (ya kam, plus jaise values aayein filler, agar initial array mein `k` se kam elements hain). Har `add` par, naya value push karo; agar heap size `k` se zyada ho jaaye, minimum pop karo. Heap ka root hamesha current `k`-vaan sabse bada hai.',
    timeComplexity: 'O(log k) per addition',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'This reuses the exact same min-heap-of-size-k trick as Kth Largest Element in an Array, but adapted to a streaming setting: instead of a one-time O(n log k) build, the heap is maintained incrementally, so each new value only costs O(log k) to fold in rather than paying to rebuild the whole structure — the heap never needs to "forget" old values individually, since once k larger values have pushed a value out of the heap, that value could never again be the k-th largest anyway.',
    solutionExplanationHi:
      'Ye bilkul wahi min-heap-of-size-k trick hai jo Kth Largest Element in an Array mein tha, bas streaming setting ke liye adapt kiya gaya: ek baar ke O(n log k) build ke bajaye, heap incrementally maintain hota hai, isliye har naya value fold karne mein sirf O(log k) lagta hai, poori structure dobara banane ki keemat nahi chukaani padti — heap ko purani values ko individually "bhoolne" ki zaroorat nahi, kyunki ek baar jab k badi values kisi value ko heap se bahar push kar chuki hon, wo value kabhi bhi phir se k-vaan largest ho hi nahi sakti.',
    starter: starter(
      `const k = num(0);
const n = num(1);
const initial = n ? nums(2) : [];
const q = num(3);
const toAdd = q ? nums(4) : [];

// A small array-backed min-heap.
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
  get top() { return this.a[0]; }
}

// your code here: build the heap, process each add, print the kth largest each time
`,
      `import heapq
k = num(0)
n = num(1)
initial = nums(2) if n else []
q = num(3)
to_add = nums(4) if q else []

# your code here: build the heap, process each add, print the kth largest each time
`,
    ),
    solution: solution(
      `const k = num(0);
const n = num(1);
const initial = n ? nums(2) : [];
const q = num(3);
const toAdd = q ? nums(4) : [];
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
  get top() { return this.a[0]; }
}
const heap = new MinHeap();
function add(v) {
  heap.push(v);
  if (heap.size > k) heap.pop();
  return heap.top;
}
for (const v of initial) add(v);
const out = [];
for (const v of toAdd) out.push(add(v));
console.log(out.join('\\n'));`,
      `import heapq
k = num(0)
n = num(1)
initial = nums(2) if n else []
q = num(3)
to_add = nums(4) if q else []
heap = []

def add(v):
    heapq.heappush(heap, v)
    if len(heap) > k:
        heapq.heappop(heap)
    return heap[0]

for v in initial:
    add(v)
out = []
for v in to_add:
    out.append(add(v))
print("\\n".join(map(str, out)))`,
    ),
    testCases: [
      sample('3\n4\n4 5 8 2\n5\n3 5 10 9 4', '4\n5\n5\n8\n8'),
      hidden('1\n0\n\n2\n5 3', '5\n5'),
      hidden('2\n2\n1 1\n2\n1 1', '1\n1'),
    ],
  },

  {
    slug: 'reorganize-string',
    title: 'Reorganize String',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Rearrange the characters of a string so that no two adjacent characters are the same. Print `(impossible)` if no such rearrangement exists.\n\n**Input**\nOne line containing lowercase letters.\n\n**Output**\nA valid rearrangement, or `(impossible)`.',
    descriptionHi:
      'String ke characters ko aise rearrange karo ki koi bhi do adjacent characters same na hon. Agar aisa koi rearrangement possible nahi hai to `(impossible)` print karo.\n\n**Input**\nEk line jisme lowercase letters hain.\n\n**Output**\nEk valid rearrangement, ya `(impossible)`.',
    examples: [
      { input: 'aab', output: 'aba' },
      { input: 'aaab', output: '(impossible)' },
    ],
    constraints: ['1 <= length <= 500'],
    hints: [
      'If the most frequent character appears more than `ceil(length / 2)` times, no valid arrangement can ever exist — check this first.',
      'Greedily place the currently most frequent remaining character at each position, which naturally spreads out common characters.',
      'A max-heap keyed by remaining frequency gives you the current most frequent character in O(log alphabet) time at every step.',
    ],
    approach:
      'First check feasibility: if any character\'s count exceeds `ceil(n/2)`, output `(impossible)`. Otherwise, use a max-heap keyed by frequency. Repeatedly pop the most frequent remaining character, place it next, decrement its count; to avoid placing the same character twice in a row, hold the just-placed character out of the heap for one step before pushing it back (if it still has remaining count) after placing a different character.',
    approachHi:
      'Pehle feasibility check karo: agar kisi character ka count `ceil(n/2)` se zyada hai, `(impossible)` output karo. Warna, frequency se keyed ek max-heap use karo. Baar-baar sabse frequent bacha hua character pop karo, use agla place karo, uska count ghatao; ek hi character ko lagatar do baar place hone se rokne ke liye, abhi-place hue character ko ek step ke liye heap se bahar rakho, phir kisi doosre character ko place karne ke baad (agar uska count bacha ho) wapas push karo.',
    timeComplexity: 'O(n log 26)',
    spaceComplexity: 'O(26)',
    solutionExplanation:
      'The feasibility bound comes from a pigeonhole argument: with n total positions, the most any single character can occupy without two of its occurrences being adjacent is `ceil(n/2)` (alternating it into every other slot) — any more and two copies are forced to collide. The greedy "always place the currently most frequent character" strategy works because it maximizes the chance to spread out whichever character is scarcest in remaining slots relative to its count, and holding the just-used character out of the heap for exactly one placement is the minimal delay needed to guarantee it never repeats immediately.',
    solutionExplanationHi:
      'Feasibility bound ek pigeonhole argument se aata hai: n total positions ke saath, koi bhi single character bina do occurrences adjacent hue zyada se zyada `ceil(n/2)` positions occupy kar sakta hai (har alternate slot mein daal kar) — isse zyada hua to do copies takrane ko majboor ho jaayengi. Greedy "hamesha abhi ka sabse frequent character place karo" strategy isliye kaam karti hai kyunki ye us character ko phailane ka chance maximize karti hai jo apne count ke relative bache hue slots mein sabse kam hai, aur abhi-use-hue character ko exactly ek placement ke liye heap se bahar rakhna hi minimal delay hai jo guarantee karta hai ki wo turant repeat na ho.',
    starter: starter(
      `const s = line(0);

// A small array-backed max-heap of [char, count] pairs: higher count first,
// ties broken alphabetically (smaller char first) so JS and Python agree.
function higherPriority(a, b) { return a[1] > b[1] || (a[1] === b[1] && a[0] < b[0]); }
class MaxHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!higherPriority(this.a[i], this.a[p])) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let largest = i;
        if (l < this.a.length && higherPriority(this.a[l], this.a[largest])) largest = l;
        if (r < this.a.length && higherPriority(this.a[r], this.a[largest])) largest = r;
        if (largest === i) break;
        [this.a[largest], this.a[i]] = [this.a[i], this.a[largest]];
        i = largest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

function reorganizeString(s) {
  // return the rearranged string, or "" if impossible
  return '';
}

const res = reorganizeString(s);
console.log(res === '' ? '(impossible)' : res);`,
      `import heapq
s = line(0)

def reorganize_string(s):
    # return the rearranged string, or "" if impossible
    return ""

res = reorganize_string(s)
print(res if res else "(impossible)")`,
    ),
    solution: solution(
      `const s = line(0);
function higherPriority(a, b) { return a[1] > b[1] || (a[1] === b[1] && a[0] < b[0]); }
class MaxHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!higherPriority(this.a[i], this.a[p])) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let largest = i;
        if (l < this.a.length && higherPriority(this.a[l], this.a[largest])) largest = l;
        if (r < this.a.length && higherPriority(this.a[r], this.a[largest])) largest = r;
        if (largest === i) break;
        [this.a[largest], this.a[i]] = [this.a[i], this.a[largest]];
        i = largest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}
function reorganizeString(s) {
  const n = s.length;
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);
  for (const c of count.values()) if (c > Math.ceil(n / 2)) return '';
  const heap = new MaxHeap();
  for (const [c, cnt] of count) heap.push([c, cnt]);
  let result = '';
  let prev = null;
  while (heap.size) {
    const [c, cnt] = heap.pop();
    result += c;
    if (prev) { heap.push(prev); prev = null; }
    if (cnt - 1 > 0) prev = [c, cnt - 1];
  }
  return result;
}
const res = reorganizeString(s);
console.log(res === '' ? '(impossible)' : res);`,
      `import heapq
s = line(0)

def reorganize_string(s):
    n = len(s)
    from collections import Counter
    import math
    count = Counter(s)
    if any(c > math.ceil(n / 2) for c in count.values()):
        return ""
    heap = [(-c, ch) for ch, c in count.items()]
    heapq.heapify(heap)
    result = []
    prev = None
    while heap:
        neg_c, ch = heapq.heappop(heap)
        result.append(ch)
        if prev:
            heapq.heappush(heap, prev)
            prev = None
        if -neg_c - 1 > 0:
            prev = (neg_c + 1, ch)
    return "".join(result)

res = reorganize_string(s)
print(res if res else "(impossible)")`,
    ),
    testCases: [
      sample('aab', 'aba'),
      sample('aaab', '(impossible)'),
      hidden('a', 'a'),
      hidden('aa', '(impossible)'),
      hidden('vvvlo', 'vlvov'),
      hidden('aabb', 'abab'),
    ],
  },

  {
    slug: 'ugly-number-ii',
    title: 'Ugly Number II',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'An ugly number is a positive integer whose only prime factors are 2, 3, and 5. Find the `n`-th ugly number (1 counts as the first).\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe `n`-th ugly number.',
    descriptionHi:
      'Ek ugly number ek positive integer hai jiske prime factors sirf 2, 3, aur 5 hon. `n`-vaan ugly number dhoondo (1 pehla ugly number maana jaata hai).\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\n`n`-vaan ugly number.',
    examples: [
      { input: '10', output: '12' },
      { input: '1', output: '1' },
    ],
    constraints: ['1 <= n <= 1690'],
    hints: [
      'Starting from 1, every ugly number can be generated by multiplying some smaller ugly number by 2, 3, or 5.',
      'A min-heap seeded with 1 can generate ugly numbers in increasing order: pop the smallest, and push its three multiples (by 2, 3, 5) back in.',
      'Multiple different multiplications can produce the same value (e.g. 2*3 = 3*2 = 6) — a "seen" set prevents the same ugly number from being counted, and popped, more than once.',
    ],
    approach:
      'Min-heap seeded with `1`, plus a "seen" set to avoid duplicates. Repeatedly pop the smallest value — that is the next ugly number in order — and push its three unseen multiples (`value*2`, `value*3`, `value*5`) into the heap. Do this `n` times; the `n`-th popped value is the answer.',
    approachHi:
      'Min-heap `1` se seed kiya hua, plus duplicates avoid karne ke liye ek "seen" set. Baar-baar sabse chhota value pop karo — wahi order mein agla ugly number hai — aur uske teen unseen multiples (`value*2`, `value*3`, `value*5`) heap mein push karo. Ye `n` baar karo; `n`-vaan pop hua value answer hai.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Every ugly number greater than 1 is, by definition, 2, 3, or 5 times some SMALLER ugly number — so starting from the smallest ugly number (1) and systematically generating "multiply by 2/3/5" candidates explores the entire space of ugly numbers, in a strictly increasing order, without ever needing to test arbitrary integers for the ugly-number property directly. The heap enforces that increasing order automatically (always expanding the smallest unexpanded candidate next), and the seen-set exists because the same value can be reached via different multiplication paths (2×3 and 3×2 both give 6), which would otherwise be counted twice.',
    solutionExplanationHi:
      '1 se bada har ugly number, definition se, kisi CHHOTE ugly number ka 2, 3, ya 5 guna hota hai — isliye sabse chhote ugly number (1) se shuru karke systematically "2/3/5 se multiply karo" candidates generate karna, ugly numbers ki poori space ko strictly increasing order mein explore karta hai, bina kisi arbitrary integer ko directly ugly-number property ke liye test kiye. Heap us increasing order ko automatically enforce karta hai (hamesha agla sabse chhota unexpanded candidate expand karte hue), aur seen-set isliye hai kyunki wahi value alag-alag multiplication paths se pahunchi ja sakti hai (2×3 aur 3×2 dono 6 dete hain), jo warna do baar count ho jaati.',
    starter: starter(
      `const n = num(0);

// A small array-backed min-heap.
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

function nthUglyNumber(n) {
  // your code here
}

console.log(nthUglyNumber(n));`,
      `import heapq
n = num(0)

def nth_ugly_number(n):
    # your code here
    pass

print(nth_ugly_number(n))`,
    ),
    solution: solution(
      `const n = num(0);
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}
function nthUglyNumber(n) {
  const heap = new MinHeap();
  const seen = new Set([1]);
  heap.push(1);
  let val = 1;
  for (let i = 0; i < n; i++) {
    val = heap.pop();
    for (const f of [2, 3, 5]) {
      const next = val * f;
      if (!seen.has(next)) { seen.add(next); heap.push(next); }
    }
  }
  return val;
}
console.log(nthUglyNumber(n));`,
      `import heapq
n = num(0)

def nth_ugly_number(n):
    heap = [1]
    seen = {1}
    val = 1
    for _ in range(n):
        val = heapq.heappop(heap)
        for f in (2, 3, 5):
            nxt = val * f
            if nxt not in seen:
                seen.add(nxt)
                heapq.heappush(heap, nxt)
    return val

print(nth_ugly_number(n))`,
    ),
    testCases: [
      sample('10', '12'),
      sample('1', '1'),
      hidden('2', '2'),
      hidden('7', '8'),
      hidden('15', '24'),
      hidden('150', '5832'),
    ],
  },

  {
    slug: 'minimum-cost-to-connect-sticks',
    title: 'Minimum Cost to Connect Sticks',
    category: 'Heap',
    difficulty: 'EASY',
    description:
      'Combine sticks two at a time (cost of combining = sum of their lengths) until only one stick remains. Find the minimum total cost.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated stick lengths\n\n**Output**\nThe minimum total cost.',
    descriptionHi:
      'Sticks ko do-do karke combine karo (combine karne ka cost = unki lengths ka sum) jab tak sirf ek stick na bache. Minimum total cost dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated stick lengths\n\n**Output**\nMinimum total cost.',
    examples: [
      { input: '3\n2 4 3', output: '14' },
      { input: '4\n1 8 3 5', output: '30' },
    ],
    constraints: ['1 <= n <= 10^4', '1 <= length <= 10^4'],
    hints: [
      'Every combination cost is added to the running total, and the newly created stick can itself be combined again later — so a small early combination cost gets "paid again" every time that combined stick participates in a future combination.',
      'To minimize total cost, always combine the two currently SHORTEST sticks — this is exactly the same greedy structure as Huffman coding.',
      'A min-heap keeps the two currently shortest sticks accessible in O(log n) at every step.',
    ],
    approach:
      'Min-heap of stick lengths. Repeatedly pop the two smallest, add their sum to a running total cost, and push the sum back in as a new stick. Continue until only one stick remains in the heap.',
    approachHi:
      'Stick lengths ka min-heap. Baar-baar do sabse chhoti sticks pop karo, unka sum running total cost mein jodo, aur sum ko ek nayi stick ki tarah wapas push kar do. Jab tak heap mein sirf ek stick na bache, chalao.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Because a newly combined stick can itself be combined again, its length gets added into the running total every time it participates in a later combination — meaning the earliest-created combined lengths get "counted" more times over the whole process. Combining the two shortest sticks at each step keeps the costs that will be repeated most often (the earliest ones) as small as possible, which is exactly the greedy insight behind Huffman coding\'s optimal prefix codes — a provably optimal strategy for minimizing a sum of repeatedly-reused sub-costs.',
    solutionExplanationHi:
      'Chunki ek newly combined stick khud bhi dobara combine ho sakti hai, uski length har baar jab wo kisi baad ki combination mein hissa leti hai to running total mein add hoti hai — matlab sabse pehle bani combined lengths poore process mein zyada baar "count" hoti hain. Har step par do sabse chhoti sticks ko combine karna un costs ko jo sabse zyada baar repeat hongi (sabse pehle wali) sabse chhota rakhta hai, jo exactly Huffman coding ke optimal prefix codes ke peeche wala greedy insight hai — repeatedly-reused sub-costs ka sum minimize karne ki ek provably optimal strategy.',
    starter: starter(
      `const sticks = nums(1);

// A small array-backed min-heap.
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

function connectSticks(sticks) {
  // your code here
}

console.log(connectSticks(sticks));`,
      `import heapq
sticks = nums(1)

def connect_sticks(sticks):
    # your code here
    pass

print(connect_sticks(sticks))`,
    ),
    solution: solution(
      `const sticks = nums(1);
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}
function connectSticks(sticks) {
  const heap = new MinHeap();
  for (const s of sticks) heap.push(s);
  let total = 0;
  while (heap.size > 1) {
    const a = heap.pop(), b = heap.pop();
    total += a + b;
    heap.push(a + b);
  }
  return total;
}
console.log(connectSticks(sticks));`,
      `import heapq
sticks = nums(1)

def connect_sticks(sticks):
    heap = list(sticks)
    heapq.heapify(heap)
    total = 0
    while len(heap) > 1:
        a = heapq.heappop(heap)
        b = heapq.heappop(heap)
        total += a + b
        heapq.heappush(heap, a + b)
    return total

print(connect_sticks(sticks))`,
    ),
    testCases: [
      sample('3\n2 4 3', '14'),
      sample('4\n1 8 3 5', '30'),
      hidden('1\n5', '0'),
      hidden('2\n1 2', '3'),
      hidden('5\n1 1 1 1 1', '12'),
      hidden('4\n10 10 10 10', '80'),
    ],
  },

  {
    slug: 'merge-k-sorted-arrays',
    title: 'Merge k Sorted Arrays',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Merge `k` sorted arrays into one sorted sequence, using a heap to always extract the current smallest candidate.\n\n**Input**\n- Line 1: `k`\n- For each of the `k` arrays: a line with its length, then a line with that many sorted values (empty line if length is 0)\n\n**Output**\nThe merged sorted values, space-separated (empty line if none).',
    descriptionHi:
      '`k` sorted arrays ko ek sorted sequence mein merge karo, heap use karke hamesha current sabse chhota candidate nikalte hue.\n\n**Input**\n- Line 1: `k`\n- Har ek `k` arrays ke liye: uski length wali ek line, phir utni hi sorted values wali ek line (length 0 ho to khaali line)\n\n**Output**\nMerged sorted values, space se separate (khaali agar koi nahi).',
    examples: [
      { input: '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', output: '1 1 2 3 4 4 5 6' },
      { input: '0', output: '' },
    ],
    constraints: ['0 <= k <= 10^4', 'Total elements across all arrays <= 10^4'],
    hints: [
      'Merging arrays two at a time in sequence works but is wasteful — sequential pairwise merges can cost O(k * total_n) in the worst case.',
      'A min-heap holding one candidate per still-active array answers "which array currently has the smallest next value" in O(log k) instead of O(k).',
      'When a value is popped from the heap, push that same array\'s next value (if any) back in, to keep exactly one candidate per still-active array in the heap at all times.',
    ],
    approach:
      'Min-heap seeded with the first element of every non-empty array (paired with which array and index it came from). Repeatedly pop the smallest, append it to the output, and if the array it came from has a next element, push that one in. Continue until the heap is empty.',
    approachHi:
      'Min-heap, har non-empty array ke pehle element se seed kiya hua (ye track karte hue ki wo kaunse array aur index se aaya). Baar-baar sabse chhota pop karo, use output mein append karo, aur agar uske array mein agla element hai, use push karo. Jab tak heap khaali na ho, chalao.',
    timeComplexity: 'O(N log k) where N is the total number of elements',
    spaceComplexity: 'O(k) for the heap',
    solutionExplanation:
      'This is the exact array counterpart of Merge k Sorted Lists (in the Linked List category): the heap never holds more than k candidates at once — one "current front" per still-active array — so it always knows the global minimum among all arrays in O(log k), and popping-then-pushing-the-successor is what keeps that invariant true after every single element is emitted, across the whole merge.',
    solutionExplanationHi:
      'Ye Merge k Sorted Lists (Linked List category) ka hi exact array-wala counterpart hai: heap kabhi ek saath k se zyada candidates nahi rakhta — har still-active array ka ek "current front" — isliye use hamesha O(log k) mein saare arrays ke beech ka global minimum pata hota hai, aur pop-karke-successor-push-karna hi ye invariant har ek element emit hone ke baad, poori merge mein, sahi rakhta hai.',
    starter: starter(
      `const k = num(0);
const arrays = [];
let lineIdx = 1;
for (let i = 0; i < k; i++) {
  const len = num(lineIdx);
  const vals = len ? nums(lineIdx + 1) : [];
  lineIdx += 2;
  arrays.push(vals);
}

function mergeKArrays(arrays) {
  // return the merged sorted array
  return [];
}

console.log(mergeKArrays(arrays).join(' '));`,
      `k = num(0)
arrays = []
line_idx = 1
for i in range(k):
    length = num(line_idx)
    vals = nums(line_idx + 1) if length else []
    line_idx += 2
    arrays.append(vals)

def merge_k_arrays(arrays):
    # return the merged sorted list
    return []

print(" ".join(map(str, merge_k_arrays(arrays))))`,
    ),
    solution: solution(
      `const k = num(0);
const arrays = [];
let lineIdx = 1;
for (let i = 0; i < k; i++) {
  const len = num(lineIdx);
  const vals = len ? nums(lineIdx + 1) : [];
  lineIdx += 2;
  arrays.push(vals);
}
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p][0] <= this.a[i][0]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l][0] < this.a[smallest][0]) smallest = l;
        if (r < this.a.length && this.a[r][0] < this.a[smallest][0]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}
function mergeKArrays(arrays) {
  const heap = new MinHeap();
  arrays.forEach((arr, ai) => { if (arr.length) heap.push([arr[0], ai, 0]); });
  const out = [];
  while (heap.size) {
    const [val, ai, idx] = heap.pop();
    out.push(val);
    if (idx + 1 < arrays[ai].length) heap.push([arrays[ai][idx + 1], ai, idx + 1]);
  }
  return out;
}
console.log(mergeKArrays(arrays).join(' '));`,
      `import heapq
k = num(0)
arrays = []
line_idx = 1
for i in range(k):
    length = num(line_idx)
    vals = nums(line_idx + 1) if length else []
    line_idx += 2
    arrays.append(vals)

def merge_k_arrays(arrays):
    heap = []
    for ai, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], ai, 0))
    out = []
    while heap:
        val, ai, idx = heapq.heappop(heap)
        out.append(val)
        if idx + 1 < len(arrays[ai]):
            heapq.heappush(heap, (arrays[ai][idx + 1], ai, idx + 1))
    return out

print(" ".join(map(str, merge_k_arrays(arrays))))`,
    ),
    testCases: [
      sample('3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', '1 1 2 3 4 4 5 6'),
      sample('0', ''),
      hidden('1\n0\n', ''),
      hidden('2\n1\n1\n1\n0', '0 1'),
      hidden('3\n0\n\n0\n\n2\n1 2', '1 2'),
      hidden('2\n2\n1 1\n2\n1 1', '1 1 1 1'),
    ],
  },
];
