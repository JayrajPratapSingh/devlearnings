import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Heap — expansion batch, part 2 of 2. Continues from dsa-extra-heap.ts with
 * the streaming median design problem, greedy-with-heap optimization
 * problems (IPO, furthest building, hiring workers, team performance,
 * single-threaded CPU scheduling), and the HARD k-way smallest-range closer.
 */
export const dsaExtraHeap2: SeedProblem[] = [
  {
    slug: 'find-median-from-data-stream',
    title: 'Find Median from Data Stream',
    category: 'Heap',
    difficulty: 'HARD',
    description:
      'Design a structure that supports adding numbers one at a time from a stream, and finding the median of all numbers added so far at any point.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: `addNum x` or `findMedian`\n\n**Output**\nOne line per `findMedian` call, the median formatted to 5 decimal places.',
    descriptionHi:
      'Ek structure design karo jo ek stream se ek-ek karke numbers add karna support kare, aur kisi bhi point par ab tak add hue saare numbers ka median dhoond sake.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: `addNum x` ya `findMedian`\n\n**Output**\nHar `findMedian` call ke liye ek line, median 5 decimal places tak formatted.',
    examples: [
      { input: '5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian', output: '1.50000\n2.00000' },
    ],
    constraints: ['1 <= q <= 5*10^4'],
    hints: [
      'Keeping a fully sorted list and re-sorting on every addition works but costs O(n log n) per addition.',
      'Split the numbers into two halves: a max-heap holding the smaller half, and a min-heap holding the larger half.',
      'Keep the two halves balanced in size (differing by at most 1); the median is then either the max-heap\'s top, the min-heap\'s top, or the average of both, depending on which half (if either) has one extra element.',
    ],
    approach:
      'Maintain a max-heap for the lower half of numbers and a min-heap for the upper half, kept balanced in size (differing by at most one element). On `addNum`, insert into one heap and then rebalance by moving the top element across if the size difference exceeds one. On `findMedian`, if the heaps are equal size, average their two tops; otherwise report the top of whichever heap has one more element.',
    approachHi:
      'Numbers ke lower half ke liye ek max-heap aur upper half ke liye ek min-heap rakho, size mein balanced (zyada se zyada ek element ka farq). `addNum` par, ek heap mein insert karo phir rebalance karo — agar size difference ek se zyada ho jaaye, top element doosri taraf move karo. `findMedian` par, agar heaps barabar size ke hain, unke dono tops ka average lo; warna jis heap mein ek zyada element hai uska top report karo.',
    timeComplexity: 'O(log n) per addNum, O(1) per findMedian',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Splitting the data into "everything below the median" (a max-heap, so its largest element — the boundary closest to the median — is instantly accessible) and "everything above the median" (a min-heap, same reasoning) means the two numbers that matter most for computing a median — the largest of the lower half and the smallest of the upper half — are always sitting at the roots of their respective heaps, needing no search. Keeping the two heaps balanced in size is what guarantees the split point IS the median: if sizes differ by more than one, the median would actually be somewhere inside one of the heaps rather than at its boundary.',
    solutionExplanationHi:
      'Data ko "median se neeche sab kuch" (ek max-heap, taaki uska sabse bada element — median ke sabse nazdeek boundary — turant accessible ho) aur "median se upar sab kuch" (ek min-heap, wahi reasoning) mein split karna matlab median compute karne ke liye sabse important do numbers — lower half ka sabse bada aur upper half ka sabse chhota — hamesha apne-apne heaps ke roots par hote hain, koi search nahi chahiye. Dono heaps ko size mein balanced rakhna hi guarantee karta hai ki split point hi MEDIAN hai: agar sizes ek se zyada differ karein, to median asal mein kisi heap ke andar kahin hota, uski boundary par nahi.',
    starter: starter(
      `const q = num(0);

// Two heaps: maxHeap for the lower half, minHeap for the upper half.
class MaxHeap {
  constructor() { this.a = []; }
  push(v) { this.a.push(v); this.a.sort((x, y) => y - x); }
  pop() { return this.a.shift(); }
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}
class MinHeap {
  constructor() { this.a = []; }
  push(v) { this.a.push(v); this.a.sort((x, y) => x - y); }
  pop() { return this.a.shift(); }
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}
const lower = new MaxHeap();
const upper = new MinHeap();

function addNum(x) {
  // your code here: insert into one heap, then rebalance
}

function findMedian() {
  // your code here: return the current median as a number
  return 0;
}

const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  if (parts[0] === 'addNum') addNum(Number(parts[1]));
  else out.push(findMedian().toFixed(5));
}
console.log(out.join('\\n'));`,
      `q = num(0)


# Two heaps: max-heap (negated) for the lower half, min-heap for the upper half.
class MaxHeap:
    def __init__(self):
        self.a = []

    def push(self, v):
        self.a.append(v)
        self.a.sort(reverse=True)

    def pop(self):
        return self.a.pop(0)

    @property
    def top(self):
        return self.a[0]

    def __len__(self):
        return len(self.a)


class MinHeap:
    def __init__(self):
        self.a = []

    def push(self, v):
        self.a.append(v)
        self.a.sort()

    def pop(self):
        return self.a.pop(0)

    @property
    def top(self):
        return self.a[0]

    def __len__(self):
        return len(self.a)


lower = MaxHeap()
upper = MinHeap()


def add_num(x):
    # your code here: insert into one heap, then rebalance
    pass


def find_median():
    # your code here: return the current median as a float
    return 0.0


out = []
for i in range(1, q + 1):
    parts = line(i).split()
    if parts[0] == "addNum":
        add_num(int(parts[1]))
    else:
        out.append(f"{find_median():.5f}")
print("\\n".join(out))`,
    ),
    solution: solution(
      `const q = num(0);
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
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}
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
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}
const lower = new MaxHeap();
const upper = new MinHeap();
function addNum(x) {
  if (lower.size === 0 || x <= lower.top) lower.push(x); else upper.push(x);
  if (lower.size > upper.size + 1) upper.push(lower.pop());
  else if (upper.size > lower.size + 1) lower.push(upper.pop());
}
function findMedian() {
  if (lower.size === upper.size) return (lower.top + upper.top) / 2;
  return lower.size > upper.size ? lower.top : upper.top;
}
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  if (parts[0] === 'addNum') addNum(Number(parts[1]));
  else out.push(findMedian().toFixed(5));
}
console.log(out.join('\\n'));`,
      `import heapq
q = num(0)
lower = []  # max-heap, values negated
upper = []  # min-heap


def add_num(x):
    if not lower or x <= -lower[0]:
        heapq.heappush(lower, -x)
    else:
        heapq.heappush(upper, x)
    if len(lower) > len(upper) + 1:
        heapq.heappush(upper, -heapq.heappop(lower))
    elif len(upper) > len(lower) + 1:
        heapq.heappush(lower, -heapq.heappop(upper))


def find_median():
    if len(lower) == len(upper):
        return (-lower[0] + upper[0]) / 2
    return -lower[0] if len(lower) > len(upper) else upper[0]


out = []
for i in range(1, q + 1):
    parts = line(i).split()
    if parts[0] == "addNum":
        add_num(int(parts[1]))
    else:
        out.append(f"{find_median():.5f}")
print("\\n".join(out))`,
    ),
    testCases: [
      sample('5\naddNum 1\naddNum 2\nfindMedian\naddNum 3\nfindMedian', '1.50000\n2.00000'),
      hidden('2\naddNum 5\nfindMedian', '5.00000'),
      hidden('4\naddNum 1\naddNum 2\naddNum 3\nfindMedian', '2.00000'),
      hidden('6\naddNum 6\naddNum 10\naddNum 2\naddNum 6\naddNum 5\nfindMedian', '6.00000'),
    ],
  },

  {
    slug: 'ipo-maximize-capital',
    title: 'IPO - Maximize Capital',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'You start with capital `w` and may complete at most `k` projects (in any order), each requiring at least its listed capital to start and yielding its listed profit (added to your capital) upon completion. Maximize your final capital.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` profits\n- Line 3: `n` capital requirements\n- Line 4: `k w`\n\n**Output**\nThe maximum final capital.',
    descriptionHi:
      'Aap `w` capital se shuru karte ho aur zyada se zyada `k` projects (kisi bhi order mein) complete kar sakte ho, har ek shuru karne ke liye kam se kam uska listed capital chahiye aur complete hone par uska listed profit (capital mein add) milta hai. Final capital maximize karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` profits\n- Line 3: `n` capital requirements\n- Line 4: `k w`\n\n**Output**\nMaximum final capital.',
    examples: [
      { input: '3\n1 2 3\n0 1 1\n2 0', output: '4' },
      { input: '3\n3 6 10\n0 3 5\n3 0', output: '19' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= k <= n', '0 <= w'],
    hints: [
      'At any moment, you should always pick the most profitable project among those you can CURRENTLY afford — anything else leaves profit on the table for no benefit.',
      'Maintain a min-heap of capital requirements to quickly find all newly-affordable projects as your capital grows, and a max-heap of profits (among currently-affordable projects) to always pick the best one next.',
      'Each round: move every project from the "not yet affordable" min-heap that is now affordable into the "affordable" max-heap, then take the top of the max-heap.',
    ],
    approach:
      'Sort projects by required capital, or use a min-heap keyed by capital. Maintain a max-heap of profits for currently-affordable projects. Repeat `k` times: pop every project from the capital-min-heap whose requirement is `<= current capital`, pushing its profit into the profit-max-heap; then pop the max-heap\'s top profit (if any) and add it to capital. Stop early if no project is affordable.',
    approachHi:
      'Projects ko required capital se sort karo, ya capital se keyed min-heap use karo. Currently-affordable projects ke profits ka ek max-heap rakho. `k` baar repeat karo: capital-min-heap se har us project ko pop karo jiska requirement `<= current capital` hai, uska profit profit-max-heap mein push karte hue; phir max-heap ka top profit (agar hai) pop karo aur capital mein jodo. Agar koi project affordable na ho, jaldi ruk jao.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'This is a greedy strategy provably optimal by an exchange argument: among all currently-affordable projects, choosing anything other than the maximum-profit one can only ever be matched or improved upon by choosing the maximum first (doing so never makes any FUTURE project less affordable, since capital only grows) — so there is never a reason to defer the best available option. The two heaps split cleanly by role: the capital-min-heap answers "what just became affordable" as capital grows, and the profit-max-heap answers "of everything affordable right now, what is the best choice" — together letting each of the k rounds run in O(log n).',
    solutionExplanationHi:
      'Ye ek greedy strategy hai jo exchange argument se provably optimal hai: abhi ke saare affordable projects mein se, maximum-profit wale ke alawa kuch bhi choose karna, pehle maximum choose karne se kabhi behtar nahi ho sakta (aisa karna kabhi bhi kisi FUTURE project ko kam affordable nahi banata, kyunki capital sirf badhti hai) — isliye best available option ko defer karne ki kabhi zaroorat nahi. Dono heaps role ke hisaab se saaf split hote hain: capital-min-heap batata hai "capital badhne par abhi kya affordable bana", aur profit-max-heap batata hai "abhi jo bhi affordable hai unmein se best choice kya hai" — saath milkar har k rounds ko O(log n) mein chalate hue.',
    starter: starter(
      `const n = num(0);
const profits = nums(1);
const capitalReq = nums(2);
const [k, w] = nums(3);

function findMaximizedCapital(k, w, profits, capitalReq) {
  // your code here
}

console.log(findMaximizedCapital(k, w, profits, capitalReq));`,
      `n = num(0)
profits = nums(1)
capital_req = nums(2)
k, w = nums(3)

def find_maximized_capital(k, w, profits, capital_req):
    # your code here
    pass

print(find_maximized_capital(k, w, profits, capital_req))`,
    ),
    solution: solution(
      `const n = num(0);
const profits = nums(1);
const capitalReq = nums(2);
const [k, w] = nums(3);
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
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}
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
function findMaximizedCapital(k, w, profits, capitalReq) {
  const byCapital = new MinHeap();
  for (let i = 0; i < profits.length; i++) byCapital.push([capitalReq[i], profits[i]]);
  const affordable = new MaxHeap();
  let capital = w;
  for (let round = 0; round < k; round++) {
    while (byCapital.size && byCapital.top[0] <= capital) affordable.push(byCapital.pop()[1]);
    if (!affordable.size) break;
    capital += affordable.pop();
  }
  return capital;
}
console.log(findMaximizedCapital(k, w, profits, capitalReq));`,
      `import heapq
n = num(0)
profits = nums(1)
capital_req = nums(2)
k, w = nums(3)

def find_maximized_capital(k, w, profits, capital_req):
    by_capital = sorted(zip(capital_req, profits))
    idx = 0
    affordable = []
    capital = w
    for _ in range(k):
        while idx < len(by_capital) and by_capital[idx][0] <= capital:
            heapq.heappush(affordable, -by_capital[idx][1])
            idx += 1
        if not affordable:
            break
        capital += -heapq.heappop(affordable)
    return capital

print(find_maximized_capital(k, w, profits, capital_req))`,
    ),
    testCases: [
      sample('3\n1 2 3\n0 1 1\n2 0', '4'),
      sample('3\n3 6 10\n0 3 5\n3 0', '19'),
      hidden('1\n5\n0\n1 0', '5'),
      hidden('1\n5\n10\n1 0', '0'),
      hidden('2\n1 2\n0 0\n0 5', '5'),
      hidden('4\n2 3 5 4\n0 1 2 3\n4 0', '14'),
    ],
  },

  {
    slug: 'furthest-building-you-can-reach',
    title: 'Furthest Building You Can Reach',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Moving from building `i` to `i+1`: if the next building is taller, you must either use a ladder (covers any height difference) or spend `bricks` equal to the height difference. Given a limited number of ladders and bricks, find the furthest building index reachable starting from building 0.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` building heights\n- Line 3: `bricks ladders`\n\n**Output**\nThe furthest reachable building index.',
    descriptionHi:
      'Building `i` se `i+1` par jaate hue: agar agli building lambi hai, ya to ek ladder use karni hogi (koi bhi height difference cover karti hai) ya height difference ke barabar `bricks` kharch karne honge. Limited ladders aur bricks diye hain, building 0 se shuru karke sabse door reachable building index dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` building heights\n- Line 3: `bricks ladders`\n\n**Output**\nSabse door reachable building index.',
    examples: [
      { input: '7\n4 2 7 6 9 14 12\n5 1', output: '4' },
      { input: '9\n4 12 2 7 3 18 20 3 19\n10 2', output: '7' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= bricks', '0 <= ladders <= n'],
    hints: [
      'Ladders are strictly more valuable than bricks for a large height jump (ladders cover any gap at zero ongoing cost, unlike bricks), so save ladders for the biggest jumps encountered.',
      'A greedy idea: use a ladder for every climb you encounter, but as soon as you have used more than your ladder count, "downgrade" your worst (smallest-height) past ladder-use into a brick-payment instead, freeing that ladder for a future, potentially bigger, climb.',
      'A min-heap of the climbs currently "paid for" by a ladder lets you always find and downgrade the smallest such climb in O(log ladders) when you run out.',
    ],
    approach:
      'Walk the buildings. For each upward climb, tentatively use a ladder (push its height difference onto a min-heap of "ladder-covered climbs"). If the heap now exceeds the number of available ladders, pop the smallest climb from it and pay for that one with bricks instead (since it is cheaper to have used a ladder on a bigger climb). If bricks run out at any point, stop — the previous building index is the furthest reachable.',
    approachHi:
      'Buildings ko walk karo. Har upward climb ke liye, tentatively ek ladder use karo ("ladder-covered climbs" ke min-heap mein height difference push karo). Agar heap ab available ladders ki sankhya se zyada ho jaaye, usse sabse chhota climb pop karo aur uske liye bricks se pay karo (kyunki ladder ko bade climb par use karna sasta hai). Agar kabhi bricks khatam ho jaayein, ruk jao — pichli building index hi sabse door reachable hai.',
    timeComplexity: 'O(n log ladders)',
    spaceComplexity: 'O(ladders)',
    solutionExplanation:
      'The key exchange argument: if you have used a ladder on some small climb and bricks on some larger climb, swapping which resource covers which is always at least as good (spending bricks on the smaller climb costs fewer bricks than it would have on the larger one) — so an optimal strategy always ends up using ladders on the LARGEST climbs encountered. Tentatively granting every climb a ladder and then demoting the smallest one whenever ladders run out is a clean way to arrive at exactly that optimal allocation without needing to know the full sequence of climbs in advance.',
    solutionExplanationHi:
      'Key exchange argument: agar aapne kisi chhote climb par ladder aur kisi bade climb par bricks use kiye hain, to swap karna hamesha kam se kam utna hi achha hai (chhote climb par bricks kharch karna, bade wale par karne se kam bricks lega) — isliye ek optimal strategy hamesha sabse BADE climbs par ladders use karke khatam hoti hai. Har climb ko tentatively ladder dena, phir jab ladders khatam ho jaayein to sabse chhota wala demote karna, exactly us optimal allocation tak pahunchne ka ek saaf tareeka hai, bina climbs ki poori sequence pehle se jaane.',
    starter: starter(
      `const heights = nums(1);
const [bricks, ladders] = nums(2);

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

function furthestBuilding(heights, bricks, ladders) {
  // your code here
}

console.log(furthestBuilding(heights, bricks, ladders));`,
      `import heapq
heights = nums(1)
bricks, ladders = nums(2)

def furthest_building(heights, bricks, ladders):
    # your code here
    pass

print(furthest_building(heights, bricks, ladders))`,
    ),
    solution: solution(
      `const heights = nums(1);
const [bricks, ladders] = nums(2);
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
function furthestBuilding(heights, bricks, ladders) {
  const heap = new MinHeap();
  let bricksLeft = bricks;
  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue;
    heap.push(diff);
    if (heap.size > ladders) {
      bricksLeft -= heap.pop();
      if (bricksLeft < 0) return i;
    }
  }
  return heights.length - 1;
}
console.log(furthestBuilding(heights, bricks, ladders));`,
      `import heapq
heights = nums(1)
bricks, ladders = nums(2)

def furthest_building(heights, bricks, ladders):
    heap = []
    bricks_left = bricks
    for i in range(len(heights) - 1):
        diff = heights[i + 1] - heights[i]
        if diff <= 0:
            continue
        heapq.heappush(heap, diff)
        if len(heap) > ladders:
            bricks_left -= heapq.heappop(heap)
            if bricks_left < 0:
                return i
    return len(heights) - 1

print(furthest_building(heights, bricks, ladders))`,
    ),
    testCases: [
      sample('7\n4 2 7 6 9 14 12\n5 1', '4'),
      sample('9\n4 12 2 7 3 18 20 3 19\n10 2', '7'),
      hidden('3\n14 3 19\n17 0', '2'),
      hidden('1\n5\n0 0', '0'),
      hidden('3\n1 5 1\n0 1', '2'),
      hidden('4\n1 2 3 4\n0 0', '0'),
    ],
  },

  {
    slug: 'total-cost-to-hire-k-workers',
    title: 'Total Cost to Hire K Workers',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Hire exactly `k` workers, one at a time. Each time, choose the cheapest worker from either the first `candidates` remaining workers or the last `candidates` remaining workers (ties go to the smaller index); remove that worker from the pool. Return the total cost.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` costs\n- Line 3: `k candidates`\n\n**Output**\nThe total cost.',
    descriptionHi:
      'Exactly `k` workers hire karo, ek-ek karke. Har baar, pehle bache hue `candidates` workers ya aakhri bache hue `candidates` workers mein se sabse sasta chuno (tie hone par chhota index); use pool se hata do. Total cost return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` costs\n- Line 3: `k candidates`\n\n**Output**\nTotal cost.',
    examples: [
      { input: '9\n17 12 10 2 7 2 11 20 8\n3 4', output: '11' },
      { input: '4\n1 2 4 1\n3 3', output: '4' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= k <= n', '1 <= candidates'],
    hints: [
      'Maintaining two "windows" (from the front and from the back of the remaining pool) that shrink as workers are hired is naturally suited to two heaps.',
      'A min-heap for the front window and a min-heap for the back window, each capped at size `candidates`, let you always find the cheapest available candidate on either side in O(log candidates).',
      'After hiring from one side, refill that side\'s heap with the next not-yet-considered worker from that end (if any remain and the two windows have not yet met in the middle).',
    ],
    approach:
      'Two min-heaps, one seeded with the first `candidates` workers\' costs (with their original indices), one with the last `candidates` (stopping if the two windows would overlap). Repeat `k` times: compare the two heaps\' tops, hire the cheaper (ties favor the front heap, i.e. the smaller index), add its cost to the total, and if any workers remain unconsidered between the two windows, pull the next one from the corresponding end into that heap.',
    approachHi:
      'Do min-heaps, ek pehle `candidates` workers ke costs se seed (unke original indices ke saath), ek aakhri `candidates` se (agar dono windows overlap karti hon to ruk jao). `k` baar repeat karo: dono heaps ke tops compare karo, sasta hire karo (tie hone par front heap ko priority, yaani chhota index), uska cost total mein jodo, aur agar dono windows ke beech koi worker abhi bhi unconsidered hai, us corresponding end se agla us heap mein daalo.',
    timeComplexity: 'O(n log candidates)',
    spaceComplexity: 'O(candidates)',
    solutionExplanation:
      'Because the "available pool" is always exactly the two shrinking prefix/suffix windows (never anything in between until the windows meet), maintaining just `candidates` items per side in a heap — rather than a heap over the entire remaining pool — is sufficient: as soon as a worker is hired from one side, the window on that side simply advances by one, and the newly exposed worker (if the windows have not yet met) is the only new candidate that needs inserting, keeping each heap\'s size bounded regardless of how large `n` is.',
    solutionExplanationHi:
      'Chunki "available pool" hamesha exactly do shrinking prefix/suffix windows hi hai (beech mein kuch bhi tab tak nahi jab tak windows na milein), har side par heap mein sirf `candidates` items rakhna — poore bache hue pool par heap rakhne ke bajaye — kaafi hai: jaise hi ek side se koi worker hire hota hai, us side ki window bas ek aage badh jaati hai, aur newly exposed worker (agar windows abhi nahi mili) hi sirf ek naya candidate hai jise insert karna hai — isse har heap ka size bounded rehta hai, chahe `n` kitna bhi bada ho.',
    starter: starter(
      `const costs = nums(1);
const [k, candidates] = nums(2);

// A small array-backed min-heap of [cost, index] pairs.
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
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}

function totalCost(costs, k, candidates) {
  // your code here
}

console.log(totalCost(costs, k, candidates));`,
      `import heapq
costs = nums(1)
k, candidates = nums(2)

def total_cost(costs, k, candidates):
    # your code here
    pass

print(total_cost(costs, k, candidates))`,
    ),
    solution: solution(
      `const costs = nums(1);
const [k, candidates] = nums(2);
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
  get top() { return this.a[0]; }
  get size() { return this.a.length; }
}
function totalCost(costs, k, candidates) {
  const n = costs.length;
  let left = 0, right = n - 1;
  const front = new MinHeap(), back = new MinHeap();
  while (front.size < candidates && left <= right) { front.push([costs[left], left]); left++; }
  while (back.size < candidates && left <= right) { back.push([costs[right], right]); right--; }
  let total = 0;
  for (let i = 0; i < k; i++) {
    let hireFront;
    if (back.size === 0 || (front.size > 0 && front.top[0] <= back.top[0])) hireFront = true;
    else hireFront = false;
    if (hireFront) {
      total += front.pop()[0];
      if (left <= right) { front.push([costs[left], left]); left++; }
    } else {
      total += back.pop()[0];
      if (left <= right) { back.push([costs[right], right]); right--; }
    }
  }
  return total;
}
console.log(totalCost(costs, k, candidates));`,
      `import heapq
costs = nums(1)
k, candidates = nums(2)

def total_cost(costs, k, candidates):
    n = len(costs)
    left, right = 0, n - 1
    front, back = [], []
    while len(front) < candidates and left <= right:
        heapq.heappush(front, (costs[left], left))
        left += 1
    while len(back) < candidates and left <= right:
        heapq.heappush(back, (costs[right], right))
        right -= 1
    total = 0
    for _ in range(k):
        if not back or (front and front[0][0] <= back[0][0]):
            c, _ = heapq.heappop(front)
            total += c
            if left <= right:
                heapq.heappush(front, (costs[left], left))
                left += 1
        else:
            c, _ = heapq.heappop(back)
            total += c
            if left <= right:
                heapq.heappush(back, (costs[right], right))
                right -= 1
    return total

print(total_cost(costs, k, candidates))`,
    ),
    testCases: [
      sample('9\n17 12 10 2 7 2 11 20 8\n3 4', '11'),
      sample('4\n1 2 4 1\n3 3', '4'),
      hidden('1\n5\n1 1', '5'),
      hidden('2\n3 5\n2 1', '8'),
      hidden('5\n1 1 1 1 1\n5 2', '5'),
      hidden('6\n5 4 3 2 1 6\n3 2', '6'),
    ],
  },

  {
    slug: 'maximum-performance-of-a-team',
    title: 'Maximum Performance of a Team',
    category: 'Heap',
    difficulty: 'HARD',
    description:
      'Choose at most `k` engineers to form a team. A team\'s performance is the sum of the chosen engineers\' speeds, multiplied by the MINIMUM efficiency among them. Find the maximum possible performance, modulo `1000000007`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` speeds\n- Line 3: `n` efficiencies\n- Line 4: `k`\n\n**Output**\nThe maximum performance, modulo `1000000007`.',
    descriptionHi:
      'Team banane ke liye zyada se zyada `k` engineers chuno. Team ka performance chune gaye engineers ki speeds ka sum hai, unme se MINIMUM efficiency se multiply kiya hua. Maximum possible performance dhoondo, `1000000007` modulo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` speeds\n- Line 3: `n` efficiencies\n- Line 4: `k`\n\n**Output**\nMaximum performance, `1000000007` modulo.',
    examples: [
      { input: '6\n2 10 3 1 5 8\n5 4 3 9 7 2\n2', output: '60' },
      { input: '6\n2 10 3 1 5 8\n5 4 3 9 7 2\n3', output: '68' },
    ],
    constraints: ['1 <= k <= n <= 10^5', '1 <= speed[i], efficiency[i] <= 10^8'],
    hints: [
      'Sort engineers by efficiency descending, and process them in that order — this fixes a useful invariant: whichever engineer is being processed always has the SMALLEST efficiency among everyone considered so far.',
      'When processing engineer i (in efficiency-descending order), the best possible team ending its "minimum efficiency" at exactly i\'s efficiency uses i, plus the highest-speed engineers among everyone processed so far (including i).',
      'Maintain a min-heap of speeds capped at size k-1 among previously processed engineers (plus the current one), so you always know the sum of the top-(up to k) speeds available so far.',
    ],
    approach:
      'Sort engineers by efficiency descending. Process them one at a time, maintaining a running sum of speeds and a min-heap of speeds capped at size `k` (evicting the smallest speed when the heap would exceed `k`, subtracting it from the running sum). For each engineer processed, after adding their speed to the heap/sum, compute `runningSpeedSum * currentEngineer.efficiency` as a candidate performance (since this engineer has the smallest efficiency among all processed so far, it is a valid lower bound for the whole current team) and track the maximum.',
    approachHi:
      'Engineers ko efficiency descending se sort karo. Unhe ek-ek karke process karo, speeds ka running sum aur size `k` par capped speeds ka ek min-heap maintain karte hue (heap `k` se zyada hone par sabse chhoti speed evict karo, running sum se ghatao). Har process hue engineer ke liye, unki speed heap/sum mein jodne ke baad, `runningSpeedSum * currentEngineer.efficiency` ko ek candidate performance ki tarah compute karo (kyunki is engineer ki efficiency ab tak process hue sabme sabse chhoti hai, ye current team ke liye ek valid lower bound hai) aur maximum track karo.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'Sorting by efficiency descending and processing in that order establishes a powerful invariant: whichever engineer is being processed right now has the smallest efficiency of anyone considered so far, which means "performance if I use this engineer\'s efficiency as the team minimum, plus my k best speeds seen so far (including this one)" is a fully valid, computable candidate at every single step — there is no need to guess which engineer will end up being the minimum, because processing order itself guarantees each engineer gets exactly one turn being that minimum. Capping the speed-heap at size k and always evicting the smallest speed when it overflows is what ensures the running sum reflects the best possible team of size at most k available at that point.',
    solutionExplanationHi:
      'Efficiency descending se sort karke usi order mein process karna ek powerful invariant establish karta hai: abhi jo engineer process ho raha hai, uski efficiency ab tak consider kiye gaye sabme sabse chhoti hai, matlab "agar iski efficiency ko team ka minimum maan loon, plus ab tak dekhi gayi meri k best speeds (isi samet)" har single step par ek poori tarah valid, computable candidate hai — guess karne ki zaroorat nahi ki kaunsa engineer minimum banega, kyunki processing order khud guarantee karta hai ki har engineer ko exactly ek baar wo minimum banne ka mauka milta hai. Speed-heap ko size k par cap karna aur overflow hone par hamesha sabse chhoti speed evict karna hi ensure karta hai ki running sum us point tak available size-at-most-k ki best team ko reflect kare.',
    starter: starter(
      `const n = num(0);
const speed = nums(1);
const efficiency = nums(2);
const k = num(3);
const MOD = 1000000007n;

function maxPerformance(n, speed, efficiency, k) {
  // your code here — return the answer as a Number or BigInt, printed mod 1000000007
}

console.log(maxPerformance(n, speed, efficiency, k).toString());`,
      `n = num(0)
speed = nums(1)
efficiency = nums(2)
k = num(3)
MOD = 1000000007

def max_performance(n, speed, efficiency, k):
    # your code here
    pass

print(max_performance(n, speed, efficiency, k))`,
    ),
    solution: solution(
      `const n = num(0);
const speed = nums(1);
const efficiency = nums(2);
const k = num(3);
const MOD = 1000000007n;
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
function maxPerformance(n, speed, efficiency, k) {
  const engineers = speed.map((s, i) => [efficiency[i], s]).sort((a, b) => b[0] - a[0]);
  const heap = new MinHeap();
  let speedSum = 0n;
  let best = 0n;
  for (const [eff, spd] of engineers) {
    heap.push(spd);
    speedSum += BigInt(spd);
    if (heap.size > k) speedSum -= BigInt(heap.pop());
    const perf = (speedSum * BigInt(eff)) % MOD;
    if (perf > best) best = perf;
  }
  return best;
}
console.log(maxPerformance(n, speed, efficiency, k).toString());`,
      `n = num(0)
speed = nums(1)
efficiency = nums(2)
k = num(3)
MOD = 1000000007
import heapq

def max_performance(n, speed, efficiency, k):
    engineers = sorted(zip(efficiency, speed), reverse=True)
    heap = []
    speed_sum = 0
    best = 0
    for eff, spd in engineers:
        heapq.heappush(heap, spd)
        speed_sum += spd
        if len(heap) > k:
            speed_sum -= heapq.heappop(heap)
        best = max(best, (speed_sum * eff) % MOD)
    return best

print(max_performance(n, speed, efficiency, k))`,
    ),
    testCases: [
      sample('6\n2 10 3 1 5 8\n5 4 3 9 7 2\n2', '60'),
      sample('6\n2 10 3 1 5 8\n5 4 3 9 7 2\n3', '68'),
      hidden('6\n2 10 3 1 5 8\n5 4 3 9 7 2\n4', '72'),
      hidden('1\n5\n7\n1', '35'),
      hidden('2\n1 2\n2 1\n2', '3'),
      hidden('3\n1 1 1\n1 1 1\n1', '1'),
    ],
  },

  {
    slug: 'single-threaded-cpu',
    title: 'Single-Threaded CPU',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'A single-threaded CPU processes tasks: it always picks, among tasks that have already arrived and are not yet done, the one with the shortest processing time (ties broken by smallest original index). If no task has arrived yet, it idles until the next one does. Print the order (original indices) in which tasks are processed.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `enqueueTime processingTime`\n\n**Output**\nThe processing order, space-separated original indices.',
    descriptionHi:
      'Ek single-threaded CPU tasks process karta hai: jo tasks pehle se aa chuke hain aur abhi khatam nahi hue, unme se hamesha sabse kam processing time wala choose karta hai (tie hone par chhota original index). Agar koi task abhi tak aaya hi nahi, agle task tak idle rehta hai. Tasks process hone ka order (original indices) print karo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `enqueueTime processingTime`\n\n**Output**\nProcessing order, space-separated original indices.',
    examples: [
      { input: '4\n1 2\n2 4\n3 2\n4 1', output: '0 2 3 1' },
      { input: '5\n7 10\n7 12\n7 5\n7 4\n7 2', output: '4 3 2 0 1' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= enqueueTime, processingTime <= 10^9'],
    hints: [
      'Sort tasks by arrival (enqueue) time first — the CPU can only ever consider tasks that have already arrived.',
      'Maintain a "current time" pointer and a min-heap (keyed by processing time, then original index) of tasks that have arrived but are not yet done.',
      'If the heap is empty but tasks remain, the CPU must idle: jump current time forward to the next task\'s arrival rather than looking further ahead.',
    ],
    approach:
      'Sort tasks by enqueue time (keeping original indices). Maintain a pointer into this sorted order, a running `currentTime`, and a min-heap of available (arrived, not-yet-done) tasks keyed by `(processingTime, originalIndex)`. Repeatedly: push every task whose enqueue time is `<= currentTime` into the heap; if the heap is empty, jump `currentTime` forward to the next unprocessed task\'s enqueue time instead. Otherwise pop the heap\'s top, record it, and advance `currentTime` by its processing time.',
    approachHi:
      'Tasks ko enqueue time se sort karo (original indices rakhte hue). Is sorted order mein ek pointer, ek running `currentTime`, aur available (aa chuke, abhi na khatam) tasks ka `(processingTime, originalIndex)` se keyed min-heap rakho. Baar-baar: jis bhi task ka enqueue time `<= currentTime` hai use heap mein push karo; agar heap khaali hai, `currentTime` ko agle unprocessed task ke enqueue time tak aage badhao. Warna heap ka top pop karo, use record karo, aur `currentTime` ko uske processing time se aage badhao.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The CPU\'s rule — "shortest available task first, tie-broken by index" — is exactly a min-heap keyed by (processingTime, index), so the algorithm reduces to correctly maintaining WHICH tasks are currently "available" as time progresses: sorting by enqueue time up front means the pointer only ever needs to move forward, feeding newly-arrived tasks into the heap as currentTime catches up to their enqueue time. The idle-jump case (heap empty but tasks remain) is essential — without it, the simulation would incorrectly assume time keeps flowing continuously even during a gap where genuinely no task is available yet.',
    solutionExplanationHi:
      'CPU ka rule — "sabse chhota available task pehle, tie index se break" — exactly ek min-heap hai jo (processingTime, index) se keyed hai, isliye algorithm sahi tarah track karne mein simat jaata hai ki time badhne ke saath ABHI KAUNSE tasks "available" hain: pehle enqueue time se sort karna matlab pointer ko sirf aage hi move karna hai, currentTime unke enqueue time tak pahunchte hi naye-aaye tasks ko heap mein daalte hue. Idle-jump case (heap khaali par tasks bache) zaroori hai — iske bina, simulation galat tarah maan lega ki time continuously badh raha hai, chahe genuinely koi task available na ho us gap mein.',
    starter: starter(
      `const n = num(0);
const tasks = [];
for (let i = 0; i < n; i++) tasks.push([...nums(1 + i), i]);

// A small array-backed min-heap of [processingTime, originalIndex] pairs.
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p][0] < this.a[i][0] || (this.a[p][0] === this.a[i][0] && this.a[p][1] <= this.a[i][1])) break;
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
        const before = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
        if (l < this.a.length && before(this.a[l], this.a[smallest])) smallest = l;
        if (r < this.a.length && before(this.a[r], this.a[smallest])) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}

function getOrder(tasks) {
  // return an array of original indices in processing order
  return [];
}

console.log(getOrder(tasks).join(' '));`,
      `import heapq
n = num(0)
tasks = [nums(1 + i) + [i] for i in range(n)]

def get_order(tasks):
    # return a list of original indices in processing order
    return []

print(" ".join(map(str, get_order(tasks))))`,
    ),
    solution: solution(
      `const n = num(0);
const tasks = [];
for (let i = 0; i < n; i++) tasks.push([...nums(1 + i), i]);
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p][0] < this.a[i][0] || (this.a[p][0] === this.a[i][0] && this.a[p][1] <= this.a[i][1])) break;
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
        const before = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
        if (l < this.a.length && before(this.a[l], this.a[smallest])) smallest = l;
        if (r < this.a.length && before(this.a[r], this.a[smallest])) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}
function getOrder(tasks) {
  const byArrival = tasks.slice().sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap();
  const out = [];
  let time = 0, ptr = 0;
  while (out.length < tasks.length) {
    while (ptr < byArrival.length && byArrival[ptr][0] <= time) {
      heap.push([byArrival[ptr][1], byArrival[ptr][2]]);
      ptr++;
    }
    if (heap.size === 0) { time = byArrival[ptr][0]; continue; }
    const [proc, idx] = heap.pop();
    time += proc;
    out.push(idx);
  }
  return out;
}
console.log(getOrder(tasks).join(' '));`,
      `import heapq
n = num(0)
tasks = [nums(1 + i) + [i] for i in range(n)]

def get_order(tasks):
    by_arrival = sorted(tasks, key=lambda t: t[0])
    heap = []
    out = []
    time = 0
    ptr = 0
    while len(out) < len(tasks):
        while ptr < len(by_arrival) and by_arrival[ptr][0] <= time:
            heapq.heappush(heap, (by_arrival[ptr][1], by_arrival[ptr][2]))
            ptr += 1
        if not heap:
            time = by_arrival[ptr][0]
            continue
        proc, idx = heapq.heappop(heap)
        time += proc
        out.append(idx)
    return out

print(" ".join(map(str, get_order(tasks))))`,
    ),
    testCases: [
      sample('4\n1 2\n2 4\n3 2\n4 1', '0 2 3 1'),
      sample('5\n7 10\n7 12\n7 5\n7 4\n7 2', '4 3 2 0 1'),
      hidden('1\n1 1', '0'),
      hidden('2\n1 5\n10 1', '0 1'),
      hidden('3\n1 1\n1 1\n1 1', '0 1 2'),
      hidden('3\n5 5\n1 3\n2 1', '1 2 0'),
    ],
  },

  {
    slug: 'smallest-range-covering-elements-from-k-lists',
    title: 'Smallest Range Covering Elements from K Lists',
    category: 'Heap',
    difficulty: 'HARD',
    description:
      'Given `k` sorted lists, find the smallest range `[a, b]` that includes at least one number from each of the `k` lists.\n\n**Input**\n- Line 1: `k`\n- For each of the `k` lists: a line with its length, then a line with that many sorted values\n\n**Output**\nThe smallest range, as `a b`.',
    descriptionHi:
      '`k` sorted lists diye hain. Sabse chhota range `[a, b]` dhoondo jismein har ek `k` list se kam se kam ek number ho.\n\n**Input**\n- Line 1: `k`\n- Har ek `k` lists ke liye: uski length wali ek line, phir utni hi sorted values wali ek line\n\n**Output**\nSabse chhota range, `a b` format mein.',
    examples: [
      { input: '3\n5\n4 10 15 24 26\n4\n0 9 12 20\n5\n5 18 22 30 45', output: '20 24' },
      { input: '1\n1\n1', output: '1 1' },
    ],
    constraints: ['1 <= k <= 3500', 'Total elements across all lists <= 5*10^4', 'Each list is sorted ascending'],
    hints: [
      'A valid range must include at least one pointer from every list — start by taking the first element of each list as an initial candidate set.',
      'A min-heap tracking one "current pointer" per list lets you always find the MINIMUM of the current candidates in O(log k), which is one endpoint of a candidate range; the other endpoint is the MAXIMUM of the current candidates (tracked separately, since it changes less often).',
      'Repeatedly advance whichever list contributed the current minimum to its next element — the range can only get smaller (or the same list runs out, ending the search) by replacing the smallest current contributor with something bigger.',
    ],
    approach:
      'Min-heap seeded with the first element of every list (paired with which list it is from). Track the current maximum among the heap\'s elements separately. Repeatedly: the range `[heap-min, currentMax]` is a candidate — update the best range found if it is smaller (or equally small but starts earlier). Pop the minimum, and if its list has a next element, push that in (updating the running max if it is larger); if that list is exhausted, no better range can ever be found, so stop.',
    approachHi:
      'Min-heap, har list ke pehle element se seed (ye track karte hue wo kis list se hai). Heap ke elements mein se current maximum ko alag se track karo. Baar-baar: range `[heap-min, currentMax]` ek candidate hai — agar wo chhota hai (ya barabar chhota par jaldi shuru hota hai) to best range update karo. Minimum pop karo, aur agar uski list mein agla element hai, use push karo (agar bada hai to running max update karo); agar wo list khatam ho gayi hai, koi behtar range kabhi nahi mil sakta, isliye ruk jao.',
    timeComplexity: 'O(N log k) where N is the total number of elements',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'At every moment, the heap holds exactly one "current representative" per list, and the smallest possible valid range using those k representatives is exactly `[min of representatives, max of representatives]` — any smaller range would have to exclude at least one list\'s current representative without a replacement, which is not allowed. Always advancing whichever list holds the current MINIMUM (never any other list) is the key greedy move: since every other representative is already `>=` the minimum, only replacing the minimum with a larger value from the same list can possibly shrink the range further; replacing anything else could never help, since it would either leave the same minimum in place or, worse, still need the minimum-holding list to advance eventually anyway.',
    solutionExplanationHi:
      'Har moment par, heap mein har list ka exactly ek "current representative" hota hai, aur un k representatives se banne wala sabse chhota possible valid range exactly `[representatives ka min, representatives ka max]` hai — isse chhota koi range kisi ek list ke current representative ko bina replacement ke exclude kar dega, jo allowed nahi hai. Hamesha us list ko aage badhaana jiske paas current MINIMUM hai (kabhi koi aur list nahi) hi key greedy move hai: chunki baaki har representative pehle se `>=` minimum hai, sirf minimum ko usi list ke ek bade value se replace karna hi range ko aur chhota kar sakta hai; kuch aur replace karna kabhi help nahi karega, kyunki ya to wahi minimum jagah par rahega, ya (aur bhi bura) minimum-holding list ko phir bhi kabhi na kabhi aage badhana hi padega.',
    starter: starter(
      `const k = num(0);
const lists = [];
let lineIdx = 1;
for (let i = 0; i < k; i++) {
  const len = num(lineIdx);
  const vals = nums(lineIdx + 1);
  lineIdx += 2;
  lists.push(vals);
}

function smallestRange(lists) {
  // return [a, b]
  return [0, 0];
}

const [a, b] = smallestRange(lists);
console.log(a + ' ' + b);`,
      `k = num(0)
lists = []
line_idx = 1
for i in range(k):
    length = num(line_idx)
    vals = nums(line_idx + 1)
    line_idx += 2
    lists.append(vals)

def smallest_range(lists):
    # return [a, b]
    return [0, 0]

a, b = smallest_range(lists)
print(a, b)`,
    ),
    solution: solution(
      `const k = num(0);
const lists = [];
let lineIdx = 1;
for (let i = 0; i < k; i++) {
  const len = num(lineIdx);
  const vals = nums(lineIdx + 1);
  lineIdx += 2;
  lists.push(vals);
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
function smallestRange(lists) {
  const heap = new MinHeap();
  let curMax = -Infinity;
  for (let i = 0; i < lists.length; i++) {
    heap.push([lists[i][0], i, 0]);
    curMax = Math.max(curMax, lists[i][0]);
  }
  let best = [-1e18, 1e18];
  while (true) {
    const [val, li, idx] = heap.pop();
    if (curMax - val < best[1] - best[0]) best = [val, curMax];
    if (idx + 1 === lists[li].length) break;
    const nextVal = lists[li][idx + 1];
    curMax = Math.max(curMax, nextVal);
    heap.push([nextVal, li, idx + 1]);
  }
  return best;
}
const [a, b] = smallestRange(lists);
console.log(a + ' ' + b);`,
      `import heapq
k = num(0)
lists = []
line_idx = 1
for i in range(k):
    length = num(line_idx)
    vals = nums(line_idx + 1)
    line_idx += 2
    lists.append(vals)

def smallest_range(lists):
    heap = []
    cur_max = float("-inf")
    for i, lst in enumerate(lists):
        heapq.heappush(heap, (lst[0], i, 0))
        cur_max = max(cur_max, lst[0])
    best = [float("-inf"), float("inf")]
    while True:
        val, li, idx = heapq.heappop(heap)
        if cur_max - val < best[1] - best[0]:
            best = [val, cur_max]
        if idx + 1 == len(lists[li]):
            break
        next_val = lists[li][idx + 1]
        cur_max = max(cur_max, next_val)
        heapq.heappush(heap, (next_val, li, idx + 1))
    return best

a, b = smallest_range(lists)
print(a, b)`,
    ),
    testCases: [
      sample('3\n5\n4 10 15 24 26\n4\n0 9 12 20\n5\n5 18 22 30 45', '20 24'),
      sample('1\n1\n1', '1 1'),
      hidden('2\n1\n1\n1\n1', '1 1'),
      hidden('2\n3\n1 2 3\n3\n1 2 3', '1 1'),
      hidden('2\n2\n1 100\n2\n50 51', '1 50'),
    ],
  },
];
