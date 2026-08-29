import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Queue → Dynamic Programming. Structural and recursive patterns that dominate
 * second-round and system-heavy interviews.
 *
 * Linked lists and trees are passed as flat text (arrays / level-order with
 * `null`) so the grader stays stdin/stdout and language-agnostic; each starter
 * rebuilds the real structure so the practice still exercises pointer work.
 */
export const dsaAdvanced: SeedProblem[] = [
  /* ------------------------------------- Queue ----------------------------------- */
  {
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    category: 'Queue',
    difficulty: 'HARD',
    description:
      'Return the maximum of every contiguous window of size `k` as the window slides left to right.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe window maximums, space-separated.',
    descriptionHi:
      'Size `k` ki har contiguous window ka maximum return karo, jaise-jaise window left se right slide karti hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nWindow maximums, space se separate.',
    examples: [
      {
        input: '8\n1 3 -1 -3 5 3 6 7\n3',
        output: '3 3 5 5 6 7',
        explanation: 'Windows [1,3,-1] → 3, [3,-1,-3] → 3, [-1,-3,5] → 5, and so on.',
      },
      { input: '1\n1\n1', output: '1' },
    ],
    constraints: ['1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Recomputing the max per window is O(n*k) — too slow.',
      'If a smaller element sits to the left of a bigger one, it can never be a future maximum.',
      'Keep a deque of indices whose values are decreasing.',
    ],
    approach:
      'Monotonic deque of indices. Before pushing `i`, pop every index from the back whose value is <= `nums[i]` (they are permanently dominated), and pop from the front any index that has slid out of the window. The front is always the current maximum.',
    approachHi:
      'Indices ka monotonic deque. `i` push karne se pehle back se un saare indices pop karo jinki value `nums[i]` se choti ya barabar hai (wo hamesha ke liye dominated hain), aur front se un indices ko hatao jo window se bahar nikal gaye. Front hamesha current maximum hota hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'The dominance argument is the whole trick: if `nums[j] <= nums[i]` and `j < i`, then `j` leaves the window first *and* is never larger, so it can be deleted with no loss. That keeps the deque strictly decreasing, so its front is the answer by construction. Each index enters and leaves once, giving amortised O(n) despite the inner while loops.',
    solutionExplanationHi:
      'Poora trick dominance argument hai: agar `nums[j] <= nums[i]` aur `j < i`, to `j` window se pehle bahar jayega *aur* kabhi bada bhi nahi hoga — isliye use bina kisi nuksaan ke hata sakte ho. Isi se deque strictly decreasing rehta hai aur uska front hi answer ban jata hai. Har index ek baar aata hai aur ek baar jata hai, isliye inner while loops ke bawajood amortised O(n).',
    starter: starter(
      `const arr = nums(1), k = num(2);

function maxSlidingWindow(arr, k) {
  // return an array of window maximums
}

console.log(maxSlidingWindow(arr, k).join(' '));`,
      `arr, k = nums(1), num(2)

def max_sliding_window(arr, k):
    # return a list of window maximums
    return []

print(" ".join(map(str, max_sliding_window(arr, k))))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
const dq = [], out = [];
for (let i = 0; i < arr.length; i++) {
  while (dq.length && dq[0] <= i - k) dq.shift();
  while (dq.length && arr[dq[dq.length - 1]] <= arr[i]) dq.pop();
  dq.push(i);
  if (i >= k - 1) out.push(arr[dq[0]]);
}
console.log(out.join(' '));`,
      `from collections import deque
arr, k = nums(1), num(2)
dq, out = deque(), []
for i, x in enumerate(arr):
    while dq and dq[0] <= i - k:
        dq.popleft()
    while dq and arr[dq[-1]] <= x:
        dq.pop()
    dq.append(i)
    if i >= k - 1:
        out.append(arr[dq[0]])
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('8\n1 3 -1 -3 5 3 6 7\n3', '3 3 5 5 6 7'),
      sample('1\n1\n1', '1'),
      hidden('4\n1 2 3 4\n4', '4'),
      hidden('5\n5 4 3 2 1\n2', '5 4 3 2'),
      hidden('6\n7 2 4 6 1 9\n3', '7 6 6 9'),
    ],
  },

  /* ---------------------------------- Linked List -------------------------------- */
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Reverse a singly linked list and print its values.\n\n**Input**\n- Line 1: `n` — the number of nodes\n- Line 2: `n` space-separated values in list order (empty line when `n` is 0)\n\n**Output**\nThe reversed values, space-separated. Print `(empty)` for an empty list.',
    descriptionHi:
      'Singly linked list ko reverse karke uski values print karo.\n\n**Input**\n- Line 1: `n` — nodes ki sankhya\n- Line 2: `n` space-separated values list ke order mein (`n` 0 ho to khaali line)\n\n**Output**\nReversed values, space se separate. Khaali list ke liye `(empty)` print karo.',
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1' },
      { input: '0\n', output: '(empty)' },
    ],
    constraints: ['0 <= n <= 5000', '-5000 <= value <= 5000'],
    hints: [
      'You need three pointers: previous, current and next.',
      'Save `current.next` before you overwrite it, or you lose the rest of the list.',
      'The new head is the last non-null node you visited.',
    ],
    approach:
      'Iterative pointer rewiring. Walk the list keeping `prev`, `curr` and a saved `next`; point `curr.next` at `prev`, then shift all three forward. `prev` ends up as the new head.',
    approachHi:
      'Iterative pointer rewiring. `prev`, `curr` aur ek saved `next` ke saath list par chalo; `curr.next` ko `prev` par point karao, phir teeno ko aage shift karo. Aakhir mein `prev` hi naya head hota hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The one line that matters is saving `next` *before* reassigning `curr.next` — reverse the order and you have severed the list and lost every remaining node. The recursive version is elegant but costs O(n) stack, which is a real difference on a 5000-node list; interviewers usually want the iterative one for exactly that reason.',
    solutionExplanationHi:
      'Sabse important line hai `next` ko `curr.next` badalne se *pehle* save karna — order ulta kiya to list toot jayegi aur baaki saare nodes gum ho jayenge. Recursive version sundar hai par O(n) stack leta hai, jo 5000-node list par asli farq hai; isi wajah se interviewer aksar iterative wala maangta hai.',
    starter: starter(
      `const n = num(0);
const vals = n ? nums(1) : [];

// Build the list so you practise real pointer work.
class Node { constructor(v) { this.val = v; this.next = null; } }
let head = null;
for (let i = vals.length - 1; i >= 0; i--) { const node = new Node(vals[i]); node.next = head; head = node; }

function reverseList(head) {
  // return the new head
}

const out = [];
for (let p = reverseList(head); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `n = num(0)
vals = nums(1) if n else []

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

head = None
for v in reversed(vals):
    node = Node(v)
    node.next = head
    head = node

def reverse_list(head):
    # return the new head
    return head

out = []
p = reverse_list(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const n = num(0);
const vals = n ? nums(1) : [];
const out = vals.slice().reverse();
console.log(out.length ? out.join(' ') : '(empty)');`,
      `n = num(0)
vals = nums(1) if n else []
out = list(reversed(vals))
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5', '5 4 3 2 1'),
      sample('0\n', '(empty)'),
      hidden('1\n7', '7'),
      hidden('2\n1 2', '2 1'),
      hidden('6\n-1 -2 -3 0 4 9', '9 4 0 -3 -2 -1'),
    ],
  },

  {
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Merge two sorted linked lists into one sorted list.\n\n**Input**\n- Line 1: `n` then line 2: `n` sorted values\n- Line 3: `m` then line 4: `m` sorted values\n\n**Output**\nThe merged values, space-separated, or `(empty)`.',
    descriptionHi:
      'Do sorted linked lists ko ek sorted list mein merge karo.\n\n**Input**\n- Line 1: `n`, phir line 2: `n` sorted values\n- Line 3: `m`, phir line 4: `m` sorted values\n\n**Output**\nMerged values, space se separate, ya `(empty)`.',
    examples: [
      { input: '3\n1 2 4\n3\n1 3 4', output: '1 1 2 3 4 4' },
      { input: '0\n\n1\n0', output: '0' },
    ],
    constraints: ['0 <= n, m <= 50', 'Both lists are sorted ascending'],
    hints: [
      'Compare the two heads and take the smaller one each time.',
      'A dummy head node removes the "is this the first element?" special case.',
      'When one list runs out, append the rest of the other in one step.',
    ],
    approach:
      'Two pointers with a dummy head. Repeatedly append the smaller head and advance that list; when one is exhausted, link the remainder of the other.',
    approachHi:
      'Dummy head ke saath do pointers. Baar-baar chhota head jodo aur us list ko aage badhao; ek khatam ho jaye to doosri ka bacha hua hissa seedha link kar do.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The dummy node is the practical trick worth remembering: without it every append needs an `if (result === null)` guard. Because both inputs are already sorted, one linear pass suffices — this is exactly the merge step of merge sort, which is why the same routine underpins merging k lists with a heap.',
    solutionExplanationHi:
      'Dummy node wala trick yaad rakhne layak hai: uske bina har append par `if (result === null)` guard lagana padta. Dono inputs pehle se sorted hain, isliye ek linear pass kaafi hai — ye bilkul merge sort ka merge step hai, aur isi wajah se heap ke saath k lists merge karne mein bhi yahi routine chalti hai.',
    starter: starter(
      `const a = num(0) ? nums(1) : [];
const b = num(2) ? nums(3) : [];

function merge(a, b) {
  // return the merged array
}

const out = merge(a, b);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `a = nums(1) if num(0) else []
b = nums(3) if num(2) else []

def merge(a, b):
    # return the merged list
    return []

out = merge(a, b)
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const a = num(0) ? nums(1) : [];
const b = num(2) ? nums(3) : [];
const out = [];
let i = 0, j = 0;
while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
while (i < a.length) out.push(a[i++]);
while (j < b.length) out.push(b[j++]);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `a = nums(1) if num(0) else []
b = nums(3) if num(2) else []
out, i, j = [], 0, 0
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        out.append(a[i]); i += 1
    else:
        out.append(b[j]); j += 1
out.extend(a[i:]); out.extend(b[j:])
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('3\n1 2 4\n3\n1 3 4', '1 1 2 3 4 4'),
      sample('0\n\n1\n0', '0'),
      hidden('0\n\n0\n', '(empty)'),
      hidden('2\n1 5\n3\n2 3 4', '1 2 3 4 5'),
      hidden('3\n-3 -1 0\n2\n-2 5', '-3 -2 -1 0 5'),
    ],
  },

  {
    slug: 'middle-of-linked-list',
    title: 'Middle of the Linked List',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Return the value of the middle node. If there are two middles, return the second one.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nThe middle value.',
    descriptionHi:
      'Middle node ki value return karo. Agar do middle hain to doosra wala.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nMiddle value.',
    examples: [
      { input: '5\n1 2 3 4 5', output: '3' },
      { input: '6\n1 2 3 4 5 6', output: '4', explanation: 'Two middles (3 and 4) — return the second.' },
    ],
    constraints: ['1 <= n <= 100', '1 <= value <= 100'],
    hints: [
      'You could count the nodes and then walk halfway — two passes.',
      'Can you do it in one pass without knowing the length?',
      'Move one pointer twice as fast as the other.',
    ],
    approach:
      "Fast and slow pointers. Advance `slow` one step and `fast` two steps per iteration; when `fast` falls off the end, `slow` is at the middle.",
    approachHi:
      'Fast aur slow pointers. Har iteration mein `slow` ek step aur `fast` do step chalao; jab `fast` end se bahar nikal jaye, `slow` middle par hoga.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The tortoise-and-hare pattern shines when you cannot cheaply know the length — which is the real situation with a linked list. The loop condition decides which middle you get for even lengths: `while (fast && fast.next)` lands on the second middle, `while (fast.next && fast.next.next)` on the first. The same two-pointer idea detects cycles and finds the nth node from the end.',
    solutionExplanationHi:
      'Tortoise-and-hare pattern tab kaam aata hai jab length aasani se pata na ho — linked list mein asal mein yahi situation hoti hai. Even length par kaunsa middle milega ye loop condition decide karti hai: `while (fast && fast.next)` doosra middle deta hai, `while (fast.next && fast.next.next)` pehla. Yahi two-pointer idea cycle detect karne aur end se nth node dhoondhne mein bhi chalta hai.',
    starter: starter(
      `const vals = nums(1);

function middle(vals) {
  // your code here
}

console.log(middle(vals));`,
      `vals = nums(1)

def middle(vals):
    # your code here
    return 0

print(middle(vals))`,
    ),
    solution: solution(
      `const vals = nums(1);
console.log(vals[Math.floor(vals.length / 2)]);`,
      `vals = nums(1)
print(vals[len(vals) // 2])`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5', '3'),
      sample('6\n1 2 3 4 5 6', '4'),
      hidden('1\n1', '1'),
      hidden('2\n1 2', '2'),
      hidden('7\n10 20 30 40 50 60 70', '40'),
    ],
  },

  /* --------------------------------- Binary Search ------------------------------- */
  {
    slug: 'binary-search',
    title: 'Binary Search',
    category: 'Binary Search',
    difficulty: 'EASY',
    description:
      'Find the index of `target` in a sorted array, or `-1` if it is absent.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: target\n\n**Output**\nThe index, or `-1`.',
    descriptionHi:
      'Sorted array mein `target` ka index nikalo, ya `-1` agar wo nahi hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: target\n\n**Output**\nIndex, ya `-1`.',
    examples: [
      { input: '6\n-1 0 3 5 9 12\n9', output: '4' },
      { input: '6\n-1 0 3 5 9 12\n2', output: '-1' },
    ],
    constraints: ['1 <= n <= 10^4', 'The array is sorted ascending', 'All values are distinct'],
    hints: [
      'Compare with the middle element and discard half the range.',
      'Use `low + (high - low) / 2` to avoid integer overflow in languages with fixed-width ints.',
      'Be careful the loop always shrinks the range, or it will hang.',
    ],
    approach:
      'Classic binary search. Maintain an inclusive `[low, high]` range, compare against the midpoint and discard the impossible half each iteration.',
    approachHi:
      'Classic binary search. Ek inclusive `[low, high]` range rakho, midpoint se compare karo aur har iteration mein impossible aadha hissa hata do.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Almost every buggy binary search comes from one of three places: the loop condition (`<` vs `<=`), whether the bounds move past `mid` or onto it, and integer overflow in `(low + high) / 2`. Fix the invariant first — "the target, if present, is inside [low, high]" — and the rest follows. This template generalises to searching an answer space, not just an array.',
    solutionExplanationHi:
      'Binary search ke lagbhag saare bugs teen jagah se aate hain: loop condition (`<` vs `<=`), bounds `mid` ke aage jaate hain ya `mid` par hi rukte hain, aur `(low + high) / 2` mein integer overflow. Pehle invariant fix karo — "target agar hai to [low, high] ke andar hi hai" — baaki apne aap sahi ho jayega. Yahi template sirf array nahi, answer space search karne mein bhi chalta hai.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function search(arr, target) {
  // your code here
}

console.log(search(arr, target));`,
      `arr, target = nums(1), num(2)

def search(arr, target):
    # your code here
    return -1

print(search(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
let lo = 0, hi = arr.length - 1, ans = -1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) { ans = mid; break; }
  if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
}
console.log(ans);`,
      `arr, target = nums(1), num(2)
lo, hi, ans = 0, len(arr) - 1, -1
while lo <= hi:
    mid = lo + (hi - lo) // 2
    if arr[mid] == target:
        ans = mid
        break
    if arr[mid] < target:
        lo = mid + 1
    else:
        hi = mid - 1
print(ans)`,
    ),
    testCases: [
      sample('6\n-1 0 3 5 9 12\n9', '4'),
      sample('6\n-1 0 3 5 9 12\n2', '-1'),
      hidden('1\n5\n5', '0'),
      hidden('1\n5\n-5', '-1'),
      hidden('5\n1 2 3 4 5\n1', '0'),
      hidden('5\n1 2 3 4 5\n5', '4'),
    ],
  },

  {
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'A sorted array of distinct values has been rotated at an unknown pivot. Find the index of `target` in O(log n), or `-1`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers (rotated sorted)\n- Line 3: target\n\n**Output**\nThe index, or `-1`.',
    descriptionHi:
      'Distinct values wala sorted array kisi anjaan pivot par rotate ho gaya hai. `target` ka index O(log n) mein nikalo, ya `-1`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers (rotated sorted)\n- Line 3: target\n\n**Output**\nIndex, ya `-1`.',
    examples: [
      { input: '7\n4 5 6 7 0 1 2\n0', output: '4' },
      { input: '7\n4 5 6 7 0 1 2\n3', output: '-1' },
    ],
    constraints: ['1 <= n <= 5000', 'All values are distinct', 'O(log n) required'],
    hints: [
      'Even after rotation, at least one half of any split is still sorted.',
      'Work out which half is sorted by comparing `arr[low]` with `arr[mid]`.',
      'If the target lies inside the sorted half\'s range, search there; otherwise search the other half.',
    ],
    approach:
      'Modified binary search. At each step decide which half is sorted, then check whether the target falls within that half\'s bounds — recurse into it if so, otherwise into the other half.',
    approachHi:
      'Modified binary search. Har step par decide karo ki kaunsa aadha hissa sorted hai, phir dekho ki target us hisse ki range mein aata hai ya nahi — aata hai to wahin search karo, warna doosre hisse mein.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The invariant that saves you: a rotation splits the array into two sorted runs, so any midpoint always leaves at least one side fully sorted. Once you identify that side, a plain range check tells you whether the target can live there — and you still discard half the array per step. Use `<=` in `arr[lo] <= arr[mid]` so a two-element range is classified correctly.',
    solutionExplanationHi:
      'Bachane wala invariant: rotation array ko do sorted runs mein todta hai, isliye koi bhi midpoint lo, kam se kam ek side poori tarah sorted rahegi. Us side ko pehchan lo, phir ek simple range check bata deta hai ki target wahan ho sakta hai ya nahi — aur har step par aadha array phir bhi hat jata hai. `arr[lo] <= arr[mid]` mein `<=` use karo taaki do-element wali range sahi classify ho.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function searchRotated(arr, target) {
  // your code here
}

console.log(searchRotated(arr, target));`,
      `arr, target = nums(1), num(2)

def search_rotated(arr, target):
    # your code here
    return -1

print(search_rotated(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
let lo = 0, hi = arr.length - 1, ans = -1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) { ans = mid; break; }
  if (arr[lo] <= arr[mid]) {
    if (arr[lo] <= target && target < arr[mid]) hi = mid - 1; else lo = mid + 1;
  } else {
    if (arr[mid] < target && target <= arr[hi]) lo = mid + 1; else hi = mid - 1;
  }
}
console.log(ans);`,
      `arr, target = nums(1), num(2)
lo, hi, ans = 0, len(arr) - 1, -1
while lo <= hi:
    mid = lo + (hi - lo) // 2
    if arr[mid] == target:
        ans = mid
        break
    if arr[lo] <= arr[mid]:
        if arr[lo] <= target < arr[mid]:
            hi = mid - 1
        else:
            lo = mid + 1
    else:
        if arr[mid] < target <= arr[hi]:
            lo = mid + 1
        else:
            hi = mid - 1
print(ans)`,
    ),
    testCases: [
      sample('7\n4 5 6 7 0 1 2\n0', '4'),
      sample('7\n4 5 6 7 0 1 2\n3', '-1'),
      hidden('1\n1\n0', '-1'),
      hidden('2\n3 1\n1', '1'),
      hidden('5\n1 2 3 4 5\n4', '3'),
      hidden('6\n5 6 1 2 3 4\n6', '1'),
    ],
  },

  /* ------------------------------------ Sorting ---------------------------------- */
  {
    slug: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Sort an array containing only 0, 1 and 2 in a single pass using constant extra space.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` values, each 0, 1 or 2\n\n**Output**\nThe sorted array, space-separated.',
    descriptionHi:
      'Sirf 0, 1 aur 2 wale array ko ek hi pass mein, constant extra space mein sort karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` values, har ek 0, 1 ya 2\n\n**Output**\nSorted array, space se separate.',
    examples: [
      { input: '6\n2 0 2 1 1 0', output: '0 0 1 1 2 2' },
      { input: '3\n2 0 1', output: '0 1 2' },
    ],
    constraints: ['1 <= n <= 300', 'Values are 0, 1 or 2', 'One pass, O(1) space'],
    hints: [
      'Counting each value and rewriting works but needs two passes.',
      'Use three regions: known 0s at the front, known 2s at the back, unknown in the middle.',
      'After swapping from the back, do not advance — the swapped-in value is still unexamined.',
    ],
    approach:
      'Dutch national flag partition. Keep `low`, `mid` and `high`; when `arr[mid]` is 0 swap with `low` and advance both, when it is 2 swap with `high` and shrink `high` *without* advancing `mid`, when it is 1 just advance `mid`.',
    approachHi:
      'Dutch national flag partition. `low`, `mid` aur `high` rakho; `arr[mid]` 0 ho to `low` se swap karke dono aage badhao, 2 ho to `high` se swap karke `high` chhota karo par `mid` ko *aage mat* badhao, aur 1 ho to sirf `mid` aage badhao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The asymmetry is the exam question: after swapping with `low` you know the incoming value is a 0 or 1 already processed, so `mid` can advance — but after swapping with `high` the incoming value has never been examined, so `mid` must stay put. Advance it anyway and you will leave stray 2s behind. The same three-way partition is what makes quicksort fast on arrays with many duplicate keys.',
    solutionExplanationHi:
      'Yahi asymmetry asli sawaal hai: `low` se swap ke baad aane wali value pehle se processed 0 ya 1 hoti hai, isliye `mid` aage badh sakta hai — par `high` se swap ke baad aane wali value kabhi dekhi hi nahi gayi, isliye `mid` wahin rukna chahiye. Waise hi aage badha diya to peeche 2s reh jayenge. Yahi three-way partition quicksort ko un arrays par tez banata hai jinme bahut duplicate keys hoti hain.',
    starter: starter(
      `const arr = nums(1);

function sortColors(arr) {
  // sort in place
}

sortColors(arr);
console.log(arr.join(' '));`,
      `arr = nums(1)

def sort_colors(arr):
    # sort in place
    pass

sort_colors(arr)
print(" ".join(map(str, arr)))`,
    ),
    solution: solution(
      `const arr = nums(1);
let lo = 0, mid = 0, hi = arr.length - 1;
while (mid <= hi) {
  if (arr[mid] === 0) { [arr[lo], arr[mid]] = [arr[mid], arr[lo]]; lo++; mid++; }
  else if (arr[mid] === 2) { [arr[hi], arr[mid]] = [arr[mid], arr[hi]]; hi--; }
  else mid++;
}
console.log(arr.join(' '));`,
      `arr = nums(1)
lo = mid = 0
hi = len(arr) - 1
while mid <= hi:
    if arr[mid] == 0:
        arr[lo], arr[mid] = arr[mid], arr[lo]
        lo += 1; mid += 1
    elif arr[mid] == 2:
        arr[hi], arr[mid] = arr[mid], arr[hi]
        hi -= 1
    else:
        mid += 1
print(" ".join(map(str, arr)))`,
    ),
    testCases: [
      sample('6\n2 0 2 1 1 0', '0 0 1 1 2 2'),
      sample('3\n2 0 1', '0 1 2'),
      hidden('1\n0', '0'),
      hidden('4\n2 2 2 2', '2 2 2 2'),
      hidden('7\n1 0 2 1 0 2 1', '0 0 1 1 1 2 2'),
    ],
  },

  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Merge all overlapping intervals and print the result sorted by start.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `start end`\n\n**Output**\nOne merged interval per line as `start end`.',
    descriptionHi:
      'Saare overlapping intervals ko merge karo aur result start ke hisaab se sorted print karo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `start end`\n\n**Output**\nHar line par ek merged interval, `start end` format mein.',
    examples: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        output: '1 6\n8 10\n15 18',
        explanation: '[1,3] and [2,6] overlap and merge into [1,6].',
      },
      { input: '2\n1 4\n4 5', output: '1 5', explanation: 'Touching intervals count as overlapping.' },
    ],
    constraints: ['1 <= n <= 10^4', 'start <= end'],
    hints: [
      'Sort by start first — then overlaps can only be with the interval immediately before.',
      'Two intervals overlap when the next start is <= the current end.',
      'When merging, the new end is the max of the two ends, not simply the later one.',
    ],
    approach:
      'Sort by start, then sweep once. Keep the last merged interval; if the next one starts at or before its end, extend the end to the max, otherwise push a new interval.',
    approachHi:
      'Pehle start se sort karo, phir ek sweep karo. Aakhri merged interval rakho; agla interval uske end par ya usse pehle shuru hota hai to end ko max tak badha do, warna naya interval push kar do.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Sorting is what makes a single pass legal: once intervals are ordered by start, anything that overlaps the current group must overlap its running end, so you never have to look further ahead. The bug people ship is `end = next.end` instead of `max(end, next.end)` — that silently shrinks a merged interval when one interval fully contains another, e.g. [1,10] followed by [2,3].',
    solutionExplanationHi:
      'Sorting hi ek pass ko valid banati hai: start se order hone ke baad jo bhi current group se overlap karega, wo uske running end se overlap karega — isliye aage dekhne ki zarurat hi nahi. Log aksar `max(end, next.end)` ki jagah `end = next.end` likh dete hain — isse jab ek interval doosre ko poora contain karta hai (jaise [1,10] ke baad [2,3]) to merged interval chupchaap chhota ho jata hai.',
    starter: starter(
      `const n = num(0);
const intervals = [];
for (let i = 1; i <= n; i++) intervals.push(nums(i));

function merge(intervals) {
  // return merged intervals
}

for (const [s, e] of merge(intervals)) console.log(s + ' ' + e);`,
      `n = num(0)
intervals = [nums(i) for i in range(1, n + 1)]

def merge(intervals):
    # return merged intervals
    return []

for s, e in merge(intervals):
    print(s, e)`,
    ),
    solution: solution(
      `const n = num(0);
const intervals = [];
for (let i = 1; i <= n; i++) intervals.push(nums(i));
intervals.sort((a, b) => a[0] - b[0]);
const out = [];
for (const iv of intervals) {
  const last = out[out.length - 1];
  if (last && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
  else out.push([iv[0], iv[1]]);
}
for (const [s, e] of out) console.log(s + ' ' + e);`,
      `n = num(0)
intervals = sorted(nums(i) for i in range(1, n + 1))
out = []
for s, e in intervals:
    if out and s <= out[-1][1]:
        out[-1][1] = max(out[-1][1], e)
    else:
        out.append([s, e])
for s, e in out:
    print(s, e)`,
    ),
    testCases: [
      sample('4\n1 3\n2 6\n8 10\n15 18', '1 6\n8 10\n15 18'),
      sample('2\n1 4\n4 5', '1 5'),
      hidden('1\n5 7', '5 7'),
      hidden('2\n1 10\n2 3', '1 10'),
      hidden('3\n3 4\n1 2\n5 6', '1 2\n3 4\n5 6'),
    ],
  },

  /* ----------------------------------- Recursion --------------------------------- */
  {
    slug: 'fibonacci-number',
    title: 'Fibonacci Number',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Compute `F(n)` where `F(0) = 0`, `F(1) = 1` and `F(n) = F(n-1) + F(n-2)`.\n\n**Input**\nOne line containing `n`.\n\n**Output**\n`F(n)`.',
    descriptionHi:
      '`F(n)` nikalo jahan `F(0) = 0`, `F(1) = 1` aur `F(n) = F(n-1) + F(n-2)`.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\n`F(n)`.',
    examples: [
      { input: '10', output: '55' },
      { input: '0', output: '0' },
    ],
    constraints: ['0 <= n <= 70', 'The answer fits in a 64-bit integer'],
    hints: [
      'Plain recursion recomputes the same subproblems exponentially often.',
      'Memoise, or build the answer bottom-up.',
      'Only the last two values are ever needed.',
    ],
    approach:
      'Bottom-up iteration with two rolling variables — the memoised recursion collapsed to O(1) space.',
    approachHi:
      'Do rolling variables ke saath bottom-up iteration — memoised recursion ko O(1) space mein simeta hua roop.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Naive recursion is O(2^n) because `F(n-2)` is recomputed inside both branches; memoisation drops it to O(n) by making each subproblem run once. Going bottom-up removes the call stack too. Note `n = 70` overflows JavaScript\'s exact-integer range (2^53) around F(79), so this stays safe — but it is the kind of limit worth naming out loud in an interview.',
    solutionExplanationHi:
      'Naive recursion O(2^n) hai kyunki `F(n-2)` dono branches ke andar dobara compute hota hai; memoisation har subproblem ko sirf ek baar chala kar ise O(n) kar deta hai. Bottom-up jaane se call stack bhi hat jata hai. Dhyan do: JavaScript ka exact-integer range (2^53) F(79) ke aas-paas overflow hota hai, isliye `n = 70` safe hai — par interview mein aisi limit khud bol dena achha impression banata hai.',
    starter: starter(
      `const n = num(0);

function fib(n) {
  // your code here
}

console.log(fib(n));`,
      `n = num(0)

def fib(n):
    # your code here
    return 0

print(fib(n))`,
    ),
    solution: solution(
      `const n = num(0);
let a = 0, b = 1;
for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t; }
console.log(a);`,
      `n = num(0)
a, b = 0, 1
for _ in range(n):
    a, b = b, a + b
print(a)`,
    ),
    testCases: [
      sample('10', '55'),
      sample('0', '0'),
      hidden('1', '1'),
      hidden('2', '1'),
      hidden('30', '832040'),
      hidden('50', '12586269025'),
    ],
  },

  {
    slug: 'power-function',
    title: 'Pow(x, n) — Fast Exponentiation',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      'Compute `base^exp` modulo 1000000007 for a non-negative exponent.\n\n**Input**\n- Line 1: `base`\n- Line 2: `exp`\n\n**Output**\n`base^exp mod 1000000007`.',
    descriptionHi:
      'Non-negative exponent ke liye `base^exp` modulo 1000000007 nikalo.\n\n**Input**\n- Line 1: `base`\n- Line 2: `exp`\n\n**Output**\n`base^exp mod 1000000007`.',
    examples: [
      { input: '2\n10', output: '1024' },
      { input: '3\n0', output: '1' },
    ],
    constraints: ['0 <= base <= 10^9', '0 <= exp <= 10^9', 'Answer modulo 1000000007'],
    hints: [
      'Multiplying `exp` times is O(exp) — far too slow for 10^9.',
      'x^n = (x^(n/2))^2 when n is even.',
      'Take the modulus at every multiplication, not just at the end.',
    ],
    approach:
      'Binary (fast) exponentiation. Square the base and halve the exponent each step, multiplying the result in whenever the current bit of the exponent is 1.',
    approachHi:
      'Binary (fast) exponentiation. Har step mein base ko square karo aur exponent ko aadha karo; jab exponent ka current bit 1 ho, result mein multiply kar do.',
    timeComplexity: 'O(log exp)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Halving the exponent turns 10^9 multiplications into about 30 — the difference between a timeout and an instant answer. Two details matter: take the modulus after every multiply so intermediate values stay bounded, and use BigInt in JavaScript because a product of two numbers near 10^9 exceeds the exact-integer range. Python\'s ints are arbitrary precision, so only the modulus matters there.',
    solutionExplanationHi:
      'Exponent aadha karte jaane se 10^9 multiplications lagbhag 30 reh jaate hain — yahi timeout aur instant answer ka farq hai. Do cheezein important hain: har multiply ke baad modulus lo taaki beech ki values badi na hon, aur JavaScript mein BigInt use karo kyunki 10^9 ke aas-paas do numbers ka product exact-integer range se bahar chala jata hai. Python ke ints arbitrary precision ke hain, isliye wahan sirf modulus ka dhyan rakhna hai.',
    starter: starter(
      `const base = num(0), exp = num(1);
const MOD = 1000000007n;

function power(base, exp) {
  // use BigInt to avoid precision loss
}

console.log(power(BigInt(base), BigInt(exp)).toString());`,
      `base, exp = num(0), num(1)
MOD = 1000000007

def power(base, exp):
    # your code here
    return 1

print(power(base, exp))`,
    ),
    solution: solution(
      `const MOD = 1000000007n;
let b = BigInt(num(0)) % MOD, e = BigInt(num(1)), res = 1n;
while (e > 0n) {
  if (e & 1n) res = (res * b) % MOD;
  b = (b * b) % MOD;
  e >>= 1n;
}
console.log(res.toString());`,
      `MOD = 1000000007
b, e, res = num(0) % MOD, num(1), 1
while e > 0:
    if e & 1:
        res = res * b % MOD
    b = b * b % MOD
    e >>= 1
print(res)`,
    ),
    testCases: [
      sample('2\n10', '1024'),
      sample('3\n0', '1'),
      hidden('1\n1000000000', '1'),
      hidden('2\n62', '145586002'),
      hidden('10\n9', '1000000000'),
      hidden('0\n5', '0'),
    ],
  },

  /* --------------------------------- Backtracking -------------------------------- */
  {
    slug: 'subsets',
    title: 'Subsets (Power Set)',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Generate every subset of the given distinct integers. Print subsets in lexicographic order of their index sets, one per line; print `(empty)` for the empty subset.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` distinct integers\n\n**Output**\nOne subset per line, values space-separated.',
    descriptionHi:
      'Diye gaye distinct integers ke saare subsets banao. Subsets ko unke index sets ke lexicographic order mein, har line par ek, print karo; khaali subset ke liye `(empty)` print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` distinct integers\n\n**Output**\nHar line par ek subset, values space se separate.',
    examples: [
      {
        input: '3\n1 2 3',
        output: '(empty)\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3',
        explanation: 'All 2^3 = 8 subsets, generated by include/exclude recursion.',
      },
    ],
    constraints: ['1 <= n <= 12', 'All integers are distinct'],
    hints: [
      'Each element is either in the subset or not — that is a binary choice per element.',
      'Recurse: add the element, recurse, remove it, recurse.',
      'Emit the current path at every node of the recursion tree, not just at the leaves.',
    ],
    approach:
      'Backtracking over start index. At each call, record the current path, then for each remaining index add it, recurse and undo.',
    approachHi:
      'Start index par backtracking. Har call mein current path record karo, phir bache hue har index ko add karke recurse karo aur wapas undo kar do.',
    timeComplexity: 'O(n * 2^n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'The template — choose, recurse, un-choose — is the same one behind permutations, combinations and N-Queens; only the choice set and the pruning change. Recording the path at every node (rather than only at leaves) is what yields all 2^n subsets instead of just the full-length ones. The `n <= 12` bound is not decoration: 2^n output makes anything larger impractical, and saying so is part of a good answer.',
    solutionExplanationHi:
      'Template — choose, recurse, un-choose — wahi hai jo permutations, combinations aur N-Queens ke peeche chalta hai; sirf choice set aur pruning badalte hain. Har node par path record karna (sirf leaves par nahi) hi saare 2^n subsets deta hai, warna sirf poori length wale milte. `n <= 12` ki limit bekaar nahi hai: output hi 2^n hai, isse bada practical nahi — aur interview mein ye khud bata dena answer ka hissa hai.',
    starter: starter(
      `const arr = nums(1);
const out = [];

function backtrack(start, path) {
  // record path, then explore
}

backtrack(0, []);
for (const s of out) console.log(s.length ? s.join(' ') : '(empty)');`,
      `arr = nums(1)
out = []

def backtrack(start, path):
    # record path, then explore
    pass

backtrack(0, [])
for s in out:
    print(" ".join(map(str, s)) if s else "(empty)")`,
    ),
    solution: solution(
      `const arr = nums(1);
const out = [];
(function backtrack(start, path) {
  out.push([...path]);
  for (let i = start; i < arr.length; i++) {
    path.push(arr[i]);
    backtrack(i + 1, path);
    path.pop();
  }
})(0, []);
for (const s of out) console.log(s.length ? s.join(' ') : '(empty)');`,
      `arr = nums(1)
out = []

def backtrack(start, path):
    out.append(list(path))
    for i in range(start, len(arr)):
        path.append(arr[i])
        backtrack(i + 1, path)
        path.pop()

backtrack(0, [])
for s in out:
    print(" ".join(map(str, s)) if s else "(empty)")`,
    ),
    testCases: [
      sample('3\n1 2 3', '(empty)\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3'),
      hidden('1\n0', '(empty)\n0'),
      hidden('2\n1 2', '(empty)\n1\n1 2\n2'),
    ],
  },

  {
    slug: 'permutations',
    title: 'Permutations',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Generate all permutations of the given distinct integers, in the order produced by picking unused elements left to right. One permutation per line.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` distinct integers\n\n**Output**\nOne permutation per line, values space-separated.',
    descriptionHi:
      'Diye gaye distinct integers ke saare permutations banao, us order mein jo unused elements ko left se right chunne se banta hai. Har line par ek permutation.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` distinct integers\n\n**Output**\nHar line par ek permutation, values space se separate.',
    examples: [
      { input: '3\n1 2 3', output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1' },
      { input: '1\n5', output: '5' },
    ],
    constraints: ['1 <= n <= 7', 'All integers are distinct'],
    hints: [
      'At each depth, try every element that has not been used yet.',
      'Track used elements with a boolean array.',
      'A complete permutation is one whose path length equals n.',
    ],
    approach:
      'Backtracking with a `used` array. At each level try every unused element, mark it, recurse, then unmark it.',
    approachHi:
      '`used` array ke saath backtracking. Har level par har unused element try karo, use mark karo, recurse karo, phir unmark kar do.',
    timeComplexity: 'O(n * n!)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Unlike subsets, results are only emitted at the leaves — a partial path is not a permutation. Undoing the `used` flag after the recursive call is what lets sibling branches reuse the element; forget it and you get a fraction of the permutations. Iterating candidates in input order is what makes the output deterministic, which the grader relies on.',
    solutionExplanationHi:
      'Subsets ke ulat, yahan result sirf leaves par nikalta hai — adhoora path permutation nahi hota. Recursive call ke baad `used` flag ko undo karna hi sibling branches ko wo element dobara use karne deta hai; bhool gaye to permutations ka bas ek hissa milega. Candidates ko input order mein chalana hi output ko deterministic banata hai, jis par grader depend karta hai.',
    starter: starter(
      `const arr = nums(1);
const used = new Array(arr.length).fill(false);

function backtrack(path) {
  // emit when path is complete
}

backtrack([]);`,
      `arr = nums(1)
used = [False] * len(arr)

def backtrack(path):
    # emit when path is complete
    pass

backtrack([])`,
    ),
    solution: solution(
      `const arr = nums(1);
const used = new Array(arr.length).fill(false);
(function backtrack(path) {
  if (path.length === arr.length) { console.log(path.join(' ')); return; }
  for (let i = 0; i < arr.length; i++) {
    if (used[i]) continue;
    used[i] = true; path.push(arr[i]);
    backtrack(path);
    path.pop(); used[i] = false;
  }
})([]);`,
      `arr = nums(1)
used = [False] * len(arr)

def backtrack(path):
    if len(path) == len(arr):
        print(" ".join(map(str, path)))
        return
    for i, x in enumerate(arr):
        if used[i]:
            continue
        used[i] = True
        path.append(x)
        backtrack(path)
        path.pop()
        used[i] = False

backtrack([])`,
    ),
    testCases: [
      sample('3\n1 2 3', '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1'),
      sample('1\n5', '5'),
      hidden('2\n0 1', '0 1\n1 0'),
    ],
  },

  {
    slug: 'n-queens-count',
    title: 'N-Queens (Count Solutions)',
    category: 'Backtracking',
    difficulty: 'HARD',
    description:
      'Count the distinct ways to place `n` queens on an `n x n` board so that no two attack each other.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe number of solutions.',
    descriptionHi:
      '`n x n` board par `n` queens rakhne ke alag-alag tareeke gino, taaki koi do ek doosre par attack na karein.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nSolutions ki sankhya.',
    examples: [
      { input: '4', output: '2' },
      { input: '1', output: '1' },
      { input: '8', output: '92' },
    ],
    constraints: ['1 <= n <= 11'],
    hints: [
      'Place exactly one queen per row — that removes row conflicts entirely.',
      'Track occupied columns and both diagonal directions in sets.',
      'For a queen at (r, c): one diagonal is `r - c`, the other is `r + c`.',
    ],
    approach:
      'Row-by-row backtracking with three sets for occupied columns, `r - c` diagonals and `r + c` diagonals. Placing a queen is an O(1) check; a full board is one solution.',
    approachHi:
      'Row-by-row backtracking, teen sets ke saath: occupied columns, `r - c` diagonals aur `r + c` diagonals. Queen rakhna O(1) check hai; poora board bhar gaya to ek solution mila.',
    timeComplexity: 'Roughly O(n!) with heavy pruning',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Two modelling choices do all the work. One queen per row makes rows non-conflicting by construction, cutting the search space from C(n^2, n) to n^n. Encoding diagonals as `r - c` and `r + c` turns "is this diagonal attacked?" into an O(1) set lookup instead of a scan. Pruning at each row — rather than validating complete boards — is what makes n = 11 finish quickly.',
    solutionExplanationHi:
      'Do modelling choices hi poora kaam karte hain. Har row mein ek queen rakhne se rows apne aap conflict-free ho jaati hain, aur search space C(n^2, n) se ghat kar n^n ho jata hai. Diagonals ko `r - c` aur `r + c` se encode karne par "ye diagonal attack mein hai kya?" scan ki jagah O(1) set lookup ban jata hai. Har row par pruning karna — poore board banakar check karne ki jagah — hi n = 11 ko jaldi khatam karata hai.',
    starter: starter(
      `const n = num(0);

function countQueens(n) {
  // your code here
}

console.log(countQueens(n));`,
      `n = num(0)

def count_queens(n):
    # your code here
    return 0

print(count_queens(n))`,
    ),
    solution: solution(
      `const n = num(0);
const cols = new Set(), d1 = new Set(), d2 = new Set();
let count = 0;
(function place(row) {
  if (row === n) { count++; return; }
  for (let c = 0; c < n; c++) {
    if (cols.has(c) || d1.has(row - c) || d2.has(row + c)) continue;
    cols.add(c); d1.add(row - c); d2.add(row + c);
    place(row + 1);
    cols.delete(c); d1.delete(row - c); d2.delete(row + c);
  }
})(0);
console.log(count);`,
      `n = num(0)
cols, d1, d2 = set(), set(), set()
count = 0

def place(row):
    global count
    if row == n:
        count += 1
        return
    for c in range(n):
        if c in cols or (row - c) in d1 or (row + c) in d2:
            continue
        cols.add(c); d1.add(row - c); d2.add(row + c)
        place(row + 1)
        cols.discard(c); d1.discard(row - c); d2.discard(row + c)

place(0)
print(count)`,
    ),
    testCases: [
      sample('4', '2'),
      sample('1', '1'),
      sample('8', '92'),
      hidden('2', '0'),
      hidden('3', '0'),
      hidden('6', '4'),
      hidden('9', '352'),
    ],
  },

  /* ------------------------------------- Trees ----------------------------------- */
  {
    slug: 'maximum-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Return the maximum depth (number of nodes on the longest root-to-leaf path).\n\n**Input**\nOne line: the tree in level order, using `null` for a missing child (e.g. `3 9 20 null null 15 7`). An empty line means an empty tree.\n\n**Output**\nThe maximum depth.',
    descriptionHi:
      'Maximum depth return karo (root se leaf tak sabse lambe path par nodes ki sankhya).\n\n**Input**\nEk line: tree level order mein, missing child ke liye `null` (jaise `3 9 20 null null 15 7`). Khaali line ka matlab khaali tree.\n\n**Output**\nMaximum depth.',
    examples: [
      { input: '3 9 20 null null 15 7', output: '3' },
      { input: '1 null 2', output: '2' },
      { input: '', output: '0' },
    ],
    constraints: ['0 <= nodes <= 10^4', '-100 <= value <= 100'],
    hints: [
      'The depth of a tree is 1 + the depth of its deeper subtree.',
      'An empty subtree has depth 0 — that is your base case.',
      'A BFS level count works just as well.',
    ],
    approach:
      'Recursive DFS: `depth(node) = node ? 1 + max(depth(left), depth(right)) : 0`. Rebuild the tree from the level-order line first.',
    approachHi:
      'Recursive DFS: `depth(node) = node ? 1 + max(depth(left), depth(right)) : 0`. Pehle level-order line se tree wapas banao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) — O(n) for a skewed tree',
    solutionExplanation:
      'This is the cleanest example of tree recursion: the answer for a node depends only on the answers for its children, so the recursion writes itself once the base case is right. The space cost is the call stack, which is O(log n) for a balanced tree but O(n) for a degenerate one — the case an interviewer will probe. BFS trades that for an O(width) queue.',
    solutionExplanationHi:
      'Tree recursion ka sabse saaf example yahi hai: kisi node ka answer sirf uske children ke answers par depend karta hai, isliye base case sahi hote hi recursion khud likh jata hai. Space cost call stack hai — balanced tree ke liye O(log n), par ek taraf jhuke tree ke liye O(n), aur interviewer isi case ko kuredega. BFS iske badle O(width) ka queue leta hai.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);

// Rebuild the tree from level order.
function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < tokens.length) {
    const node = queue.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; queue.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; queue.push(node.right); }
    i++;
  }
  return root;
}

function maxDepth(node) {
  // your code here
}

console.log(maxDepth(build(tokens)));`,
      `tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    from collections import deque
    root = Node(int(tokens[0]))
    q, i = deque([root]), 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); q.append(node.right)
        i += 1
    return root

def max_depth(node):
    # your code here
    return 0

print(max_depth(build(tokens)))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < tokens.length) {
    const node = queue.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; queue.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; queue.push(node.right); }
    i++;
  }
  return root;
}
const depth = (n) => (n ? 1 + Math.max(depth(n.left), depth(n.right)) : 0);
console.log(depth(build(tokens)));`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    q, i = deque([root]), 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); q.append(node.right)
        i += 1
    return root

def depth(n):
    return 1 + max(depth(n.left), depth(n.right)) if n else 0

print(depth(build(tokens)))`,
    ),
    testCases: [
      sample('3 9 20 null null 15 7', '3'),
      sample('1 null 2', '2'),
      sample('', '0'),
      hidden('1', '1'),
      hidden('1 2 3 4 5 6 7', '3'),
      hidden('1 2 null 3 null 4', '4'),
    ],
  },

  {
    slug: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Print the tree level by level, one level per line.\n\n**Input**\nOne line: the tree in level order with `null` for missing children.\n\n**Output**\nOne line per level, values space-separated. Print `(empty)` for an empty tree.',
    descriptionHi:
      'Tree ko level by level print karo, har line par ek level.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nHar line par ek level, values space se separate. Khaali tree ke liye `(empty)`.',
    examples: [
      { input: '3 9 20 null null 15 7', output: '3\n9 20\n15 7' },
      { input: '', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 2000', '-1000 <= value <= 1000'],
    hints: [
      'BFS with a queue visits nodes in exactly this order.',
      'To group by level, record the queue size before draining that level.',
      'Process exactly that many nodes before moving to the next line.',
    ],
    approach:
      'BFS with a queue, processing one level per outer iteration by snapshotting `queue.length` before the inner loop.',
    approachHi:
      'Queue ke saath BFS — har outer iteration mein ek level process karo, aur inner loop se pehle `queue.length` ka snapshot le lo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(width)',
    solutionExplanation:
      'Plain BFS already visits nodes in level order; the only extra idea is the size snapshot, which turns a flat stream into grouped levels without storing depths on the nodes. Taking the size *before* the inner loop is essential — children pushed during the loop belong to the next level, and reading `queue.length` inside it would merge the levels together.',
    solutionExplanationHi:
      'Simple BFS already level order mein hi visit karta hai; ekmatra extra idea size snapshot hai, jo flat stream ko levels mein baant deta hai bina nodes par depth store kiye. Size ko inner loop se *pehle* lena zaroori hai — loop ke dauraan push hue children agle level ke hain, aur andar `queue.length` padhne se levels aapas mein mil jayenge.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);

function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const q = [root];
  let i = 1;
  while (q.length && i < tokens.length) {
    const node = q.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; q.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; q.push(node.right); }
    i++;
  }
  return root;
}

function levelOrder(root) {
  // return an array of levels
}

const levels = levelOrder(build(tokens));
if (!levels || !levels.length) console.log('(empty)');
else for (const lv of levels) console.log(lv.join(' '));`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    q, i = deque([root]), 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); q.append(node.right)
        i += 1
    return root

def level_order(root):
    # return a list of levels
    return []

levels = level_order(build(tokens))
if not levels:
    print("(empty)")
else:
    for lv in levels:
        print(" ".join(map(str, lv)))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const q = [root];
  let i = 1;
  while (q.length && i < tokens.length) {
    const node = q.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; q.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; q.push(node.right); }
    i++;
  }
  return root;
}
const root = build(tokens);
if (!root) console.log('(empty)');
else {
  const q = [root];
  while (q.length) {
    const size = q.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    console.log(level.join(' '));
  }
}`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    q, i = deque([root]), 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); q.append(node.right)
        i += 1
    return root

root = build(tokens)
if not root:
    print("(empty)")
else:
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        print(" ".join(map(str, level)))`,
    ),
    testCases: [
      sample('3 9 20 null null 15 7', '3\n9 20\n15 7'),
      sample('', '(empty)'),
      hidden('1', '1'),
      hidden('1 2 3 4 5 6 7', '1\n2 3\n4 5 6 7'),
      hidden('1 null 2 null 3', '1\n2\n3'),
    ],
  },

  /* -------------------------------------- BST ------------------------------------ */
  {
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Decide whether the tree is a valid BST: every node in the left subtree is strictly smaller, every node in the right subtree strictly larger, recursively.\n\n**Input**\nOne line: the tree in level order with `null` for missing children.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Batao ki tree valid BST hai ya nahi: left subtree ka har node strictly chhota, right subtree ka har node strictly bada — recursively.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '2 1 3', output: 'true' },
      {
        input: '5 1 4 null null 3 6',
        output: 'false',
        explanation: '3 sits in the right subtree of 5 but is smaller than 5.',
      },
    ],
    constraints: ['1 <= nodes <= 10^4', '-2^31 <= value <= 2^31 - 1'],
    hints: [
      'Comparing each node only with its direct children is not enough.',
      'Every node must fit inside a range imposed by all its ancestors.',
      'Pass `(min, max)` down the recursion and tighten it at each step.',
    ],
    approach:
      'DFS carrying an open interval `(min, max)`. Going left tightens the upper bound to the current value; going right tightens the lower bound. A node outside its interval invalidates the tree.',
    approachHi:
      'DFS mein ek open interval `(min, max)` saath le kar chalo. Left jaane par upper bound current value tak tight ho jata hai; right jaane par lower bound. Koi node apne interval ke bahar hua to tree invalid hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    solutionExplanation:
      'The classic wrong answer checks `left.val < node.val < right.val` locally — it passes `[5, 1, 4, null, null, 3, 6]`, where 3 is correctly placed relative to 4 but violates 5\'s constraint. Bounds must be inherited from every ancestor, not just the parent. The other correct framing is an in-order traversal: a tree is a BST exactly when its in-order sequence is strictly increasing.',
    solutionExplanationHi:
      'Classic galat answer sirf local check karta hai — `left.val < node.val < right.val` — aur `[5, 1, 4, null, null, 3, 6]` ko pass kar deta hai, jahan 3 apne parent 4 ke hisaab se sahi hai par 5 ki condition tod raha hai. Bounds har ancestor se inherit hone chahiye, sirf parent se nahi. Doosra sahi tareeka in-order traversal hai: tree BST tabhi hai jab uska in-order sequence strictly increasing ho.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);

function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const q = [root];
  let i = 1;
  while (q.length && i < tokens.length) {
    const node = q.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; q.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; q.push(node.right); }
    i++;
  }
  return root;
}

function isValidBST(node, min, max) {
  // your code here
}

console.log(isValidBST(build(tokens), -Infinity, Infinity));`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    q, i = deque([root]), 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); q.append(node.right)
        i += 1
    return root

def is_valid(node, lo, hi):
    # your code here
    return True

print("true" if is_valid(build(tokens), float("-inf"), float("inf")) else "false")`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const q = [root];
  let i = 1;
  while (q.length && i < tokens.length) {
    const node = q.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; q.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; q.push(node.right); }
    i++;
  }
  return root;
}
const valid = (n, lo, hi) =>
  !n || (n.val > lo && n.val < hi && valid(n.left, lo, n.val) && valid(n.right, n.val, hi));
console.log(String(valid(build(tokens), -Infinity, Infinity)));`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    q, i = deque([root]), 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); q.append(node.right)
        i += 1
    return root

def valid(n, lo, hi):
    if not n:
        return True
    return lo < n.val < hi and valid(n.left, lo, n.val) and valid(n.right, n.val, hi)

print("true" if valid(build(tokens), float("-inf"), float("inf")) else "false")`,
    ),
    testCases: [
      sample('2 1 3', 'true'),
      sample('5 1 4 null null 3 6', 'false'),
      hidden('1', 'true'),
      hidden('2 2 2', 'false'),
      hidden('5 3 8 1 4 7 9', 'true'),
      hidden('10 5 15 null null 6 20', 'false'),
    ],
  },

  /* -------------------------------------- Heap ----------------------------------- */
  {
    slug: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    category: 'Heap',
    difficulty: 'MEDIUM',
    description:
      'Return the `k`th largest element (by value, not by distinct value).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe kth largest value.',
    descriptionHi:
      '`k`va sabse bada element return karo (value ke hisaab se, distinct value ke hisaab se nahi).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`k`va sabse bada value.',
    examples: [
      { input: '6\n3 2 1 5 6 4\n2', output: '5' },
      { input: '9\n3 2 3 1 2 4 5 5 6\n4', output: '4' },
    ],
    constraints: ['1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Sorting gives O(n log n) — correct, but you can do better.',
      'A min-heap of size k keeps only the k largest values seen so far.',
      'Quickselect gives O(n) on average.',
    ],
    approach:
      'Min-heap of size `k`: push each value, and pop the smallest whenever the heap exceeds `k`. The root is the answer. Quickselect is the O(n)-average alternative.',
    approachHi:
      'Size `k` ka min-heap: har value push karo, aur heap `k` se bada hote hi sabse chhota pop kar do. Root hi answer hai. Quickselect O(n) average wala alternative hai.',
    timeComplexity: 'O(n log k) with a heap, O(n) average with quickselect',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'A *min*-heap for the *largest* element trips people up: the smallest of the k largest values sits at the root, so it is exactly the kth largest and also the cheapest one to evict. This matters when `n` is huge or streaming — you only ever hold `k` items in memory, unlike sorting which needs all `n`. Quickselect is faster on average but has an O(n^2) worst case, which is the trade-off to state out loud.',
    solutionExplanationHi:
      '*Sabse bade* element ke liye *min*-heap use karna aksar confuse karta hai: k sabse badi values mein se sabse chhoti root par hoti hai, isliye wahi kth largest hai aur usi ko hatana sabse sasta hai. Ye tab matter karta hai jab `n` bahut bada ho ya stream aa rahi ho — memory mein sirf `k` items rehte hain, jabki sorting ko poore `n` chahiye. Quickselect average mein tez hai par uska worst case O(n^2) hai — yahi trade-off bolna chahiye.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function kthLargest(arr, k) {
  // your code here
}

console.log(kthLargest(arr, k));`,
      `arr, k = nums(1), num(2)

def kth_largest(arr, k):
    # your code here
    return 0

print(kth_largest(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
console.log(arr.slice().sort((a, b) => b - a)[k - 1]);`,
      `import heapq
arr, k = nums(1), num(2)
print(heapq.nlargest(k, arr)[-1])`,
    ),
    testCases: [
      sample('6\n3 2 1 5 6 4\n2', '5'),
      sample('9\n3 2 3 1 2 4 5 5 6\n4', '4'),
      hidden('1\n1\n1', '1'),
      hidden('5\n7 7 7 7 7\n3', '7'),
      hidden('4\n-1 -2 -3 -4\n1', '-1'),
      hidden('5\n5 4 3 2 1\n5', '1'),
    ],
  },

  /* ------------------------------------- Graph ----------------------------------- */
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Count the islands in a grid of `1` (land) and `0` (water). An island is land connected horizontally or vertically.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` characters of `0`/`1`\n\n**Output**\nThe number of islands.',
    descriptionHi:
      '`1` (zameen) aur `0` (paani) wale grid mein islands gino. Island wo zameen hai jo horizontally ya vertically judi ho.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` characters `0`/`1`\n\n**Output**\nIslands ki sankhya.',
    examples: [
      { input: '4 5\n11110\n11010\n11000\n00000', output: '1' },
      { input: '4 5\n11000\n11000\n00100\n00011', output: '3' },
    ],
    constraints: ['1 <= rows, cols <= 300', 'Cells are 0 or 1'],
    hints: [
      'Every unvisited land cell starts a new island.',
      'Flood-fill from it to mark the whole island as visited.',
      'DFS or BFS both work — DFS is shorter, BFS avoids deep recursion.',
    ],
    approach:
      'Scan the grid; on each unvisited `1`, increment the counter and flood-fill (DFS/BFS) the whole connected component, marking cells visited so they are never counted twice.',
    approachHi:
      'Grid scan karo; har unvisited `1` par counter badhao aur poore connected component ko flood-fill (DFS/BFS) karke visited mark kar do, taaki wo dobara na gine jayen.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols) worst case',
    solutionExplanation:
      'This is connected components on an implicit graph — the grid is the adjacency structure, so no edge list is ever built. Each cell is visited once because the flood fill marks as it goes, which is what keeps it linear rather than quadratic. On a 300x300 all-land grid, recursive DFS can blow the call stack; an explicit stack or BFS queue is the safe version, and mentioning that is usually worth a point.',
    solutionExplanationHi:
      'Ye implicit graph par connected components hai — grid khud hi adjacency structure hai, isliye koi edge list banane ki zarurat nahi. Har cell ek hi baar visit hota hai kyunki flood fill chalte-chalte mark karta jata hai — isi se ye linear rehta hai, quadratic nahi. 300x300 poori zameen wale grid par recursive DFS call stack tod sakta hai; explicit stack ya BFS queue safe version hai, aur ye bata dena aksar ek point dila deta hai.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let r = 1; r <= rows; r++) grid.push(line(r).split(''));

function countIslands(grid) {
  // your code here
}

console.log(countIslands(grid));`,
      `rows, cols = nums(0)
grid = [list(line(r)) for r in range(1, rows + 1)]

def count_islands(grid):
    # your code here
    return 0

print(count_islands(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let r = 1; r <= rows; r++) grid.push(line(r).split(''));
let count = 0;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] !== '1') continue;
    count++;
    const stack = [[r, c]];
    grid[r][c] = '0';
    while (stack.length) {
      const [y, x] = stack.pop();
      for (const [dy, dx] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const ny = y + dy, nx = x + dx;
        if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx] === '1') {
          grid[ny][nx] = '0';
          stack.push([ny, nx]);
        }
      }
    }
  }
}
console.log(count);`,
      `rows, cols = nums(0)
grid = [list(line(r)) for r in range(1, rows + 1)]
count = 0
for r in range(rows):
    for c in range(cols):
        if grid[r][c] != "1":
            continue
        count += 1
        stack = [(r, c)]
        grid[r][c] = "0"
        while stack:
            y, x = stack.pop()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1":
                    grid[ny][nx] = "0"
                    stack.append((ny, nx))
print(count)`,
    ),
    testCases: [
      sample('4 5\n11110\n11010\n11000\n00000', '1'),
      sample('4 5\n11000\n11000\n00100\n00011', '3'),
      hidden('1 1\n0', '0'),
      hidden('1 1\n1', '1'),
      hidden('3 3\n101\n010\n101', '5'),
      hidden('2 2\n11\n11', '1'),
    ],
  },

  {
    slug: 'course-schedule',
    title: 'Course Schedule (Cycle Detection)',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given `n` courses and prerequisite pairs `a b` meaning "b must be taken before a", decide whether all courses can be finished.\n\n**Input**\n- Line 1: `n m` — courses and prerequisite count\n- Next `m` lines: `a b`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      '`n` courses aur prerequisite pairs `a b` diye hain, jinka matlab hai "b pehle karna padega, phir a". Batao ki saare courses complete ho sakte hain ya nahi.\n\n**Input**\n- Line 1: `n m` — courses aur prerequisites ki sankhya\n- Agli `m` lines: `a b`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '2 1\n1 0', output: 'true' },
      { input: '2 2\n1 0\n0 1', output: 'false', explanation: 'The two courses depend on each other.' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= m <= 5000', 'Courses are numbered 0..n-1'],
    hints: [
      'Model courses as nodes and prerequisites as directed edges.',
      'All courses are finishable exactly when the graph has no cycle.',
      "Kahn's algorithm: repeatedly remove nodes with in-degree 0.",
    ],
    approach:
      "Topological sort via Kahn's algorithm. Queue every node with in-degree 0, remove it, decrement its neighbours' in-degrees. If fewer than `n` nodes are processed, a cycle exists.",
    approachHi:
      "Kahn's algorithm se topological sort. In-degree 0 wale saare nodes queue mein daalo, unhe hatao, aur unke neighbours ki in-degree ghatao. Agar `n` se kam nodes process hue, to cycle maujood hai.",
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      'The reframing is the whole problem: "can I finish everything?" is exactly "is this dependency graph acyclic?". Kahn\'s algorithm answers it and produces a valid order for free, which is why the same code solves the follow-up asking for the schedule itself. The counter is what detects the cycle — nodes inside one never reach in-degree 0, so the queue empties early.',
    solutionExplanationHi:
      'Poora problem sirf reframe karne ka hai: "kya sab complete ho sakta hai?" ka matlab bilkul "kya ye dependency graph acyclic hai?" hai. Kahn\'s algorithm iska jawab deta hai aur saath mein ek valid order bhi mufat de deta hai — isiliye wahi code follow-up (actual schedule maango) bhi solve kar deta hai. Cycle counter se pakda jata hai — cycle ke andar wale nodes ki in-degree kabhi 0 nahi hoti, isliye queue jaldi khaali ho jati hai.',
    starter: starter(
      `const [n, m] = nums(0);
const edges = [];
for (let i = 1; i <= m; i++) edges.push(nums(i));

function canFinish(n, edges) {
  // your code here
}

console.log(canFinish(n, edges));`,
      `n, m = nums(0)
edges = [nums(i) for i in range(1, m + 1)]

def can_finish(n, edges):
    # your code here
    return True

print("true" if can_finish(n, edges) else "false")`,
    ),
    solution: solution(
      `const [n, m] = nums(0);
const adj = Array.from({ length: n }, () => []);
const indeg = new Array(n).fill(0);
for (let i = 1; i <= m; i++) {
  const [a, b] = nums(i);
  adj[b].push(a);
  indeg[a]++;
}
const queue = [];
for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
let seen = 0;
while (queue.length) {
  const node = queue.shift();
  seen++;
  for (const next of adj[node]) if (--indeg[next] === 0) queue.push(next);
}
console.log(String(seen === n));`,
      `from collections import deque
n, m = nums(0)
adj = [[] for _ in range(n)]
indeg = [0] * n
for i in range(1, m + 1):
    a, b = nums(i)
    adj[b].append(a)
    indeg[a] += 1
q = deque(i for i in range(n) if indeg[i] == 0)
seen = 0
while q:
    node = q.popleft()
    seen += 1
    for nxt in adj[node]:
        indeg[nxt] -= 1
        if indeg[nxt] == 0:
            q.append(nxt)
print("true" if seen == n else "false")`,
    ),
    testCases: [
      sample('2 1\n1 0', 'true'),
      sample('2 2\n1 0\n0 1', 'false'),
      hidden('1 0\n', 'true'),
      hidden('4 4\n1 0\n2 1\n3 2\n0 3', 'false'),
      hidden('4 3\n1 0\n2 0\n3 1', 'true'),
    ],
  },

  /* ------------------------------ Dynamic Programming ---------------------------- */
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'EASY',
    description:
      'You climb 1 or 2 steps at a time. In how many distinct ways can you reach step `n`?\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe number of distinct ways.',
    descriptionHi:
      'Ek baar mein 1 ya 2 step chadh sakte ho. Step `n` tak pahunchne ke kitne alag tareeke hain?\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nAlag-alag tareekon ki sankhya.',
    examples: [
      { input: '2', output: '2', explanation: '1+1 or 2.' },
      { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1.' },
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      'To reach step n you arrived from n-1 or n-2.',
      'So ways(n) = ways(n-1) + ways(n-2) — look familiar?',
      'Only the previous two values are ever needed.',
    ],
    approach:
      'Bottom-up DP with two rolling variables. `ways(n) = ways(n-1) + ways(n-2)` with `ways(1) = 1`, `ways(2) = 2`.',
    approachHi:
      'Do rolling variables ke saath bottom-up DP. `ways(n) = ways(n-1) + ways(n-2)`, jahan `ways(1) = 1` aur `ways(2) = 2`.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is the gateway DP problem because the recurrence falls out of the last decision: your final move was either a 1-step or a 2-step, and those two cases are disjoint and cover everything — so you add them. It is Fibonacci with shifted base cases. Rolling two variables instead of an array is the standard O(1)-space refinement worth showing.',
    solutionExplanationHi:
      'Ye DP ka entry-level problem isliye hai kyunki recurrence aakhri decision se hi nikal aata hai: aapka last move ya 1-step tha ya 2-step, aur ye dono cases alag hain aur milkar sab kuch cover karte hain — isliye jod do. Ye Fibonacci hi hai, bas base cases shift ho gaye. Array ki jagah do variables rolling karna standard O(1)-space refinement hai, jo dikhane layak hai.',
    starter: starter(
      `const n = num(0);

function climbStairs(n) {
  // your code here
}

console.log(climbStairs(n));`,
      `n = num(0)

def climb_stairs(n):
    # your code here
    return 0

print(climb_stairs(n))`,
    ),
    solution: solution(
      `const n = num(0);
let a = 1, b = 1;
for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t; }
console.log(b);`,
      `n = num(0)
a, b = 1, 1
for _ in range(2, n + 1):
    a, b = b, a + b
print(b)`,
    ),
    testCases: [
      sample('2', '2'),
      sample('3', '3'),
      hidden('1', '1'),
      hidden('10', '89'),
      hidden('45', '1836311903'),
    ],
  },

  {
    slug: 'house-robber',
    title: 'House Robber',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Each house holds some money, but robbing two adjacent houses triggers the alarm. Return the maximum you can take.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nThe maximum total.',
    descriptionHi:
      'Har ghar mein kuch paisa hai, par do adjacent ghar loot-ne par alarm baj jata hai. Maximum kitna le sakte ho, wo return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nMaximum total.',
    examples: [
      { input: '4\n1 2 3 1', output: '4', explanation: 'Rob houses 0 and 2: 1 + 3 = 4.' },
      { input: '5\n2 7 9 3 1', output: '12', explanation: 'Rob 2 + 9 + 1 = 12.' },
    ],
    constraints: ['1 <= n <= 100', '0 <= nums[i] <= 400'],
    hints: [
      'At each house you either rob it (and skip the previous) or skip it.',
      'best(i) = max(best(i-1), best(i-2) + nums[i])',
      'Two variables are enough to carry the state forward.',
    ],
    approach:
      'Linear DP over the last two states. `rob = max(skip + nums[i], rob)` where `skip` is the best total excluding the previous house.',
    approachHi:
      'Aakhri do states par linear DP. `rob = max(skip + nums[i], rob)`, jahan `skip` pichhle ghar ko chhod kar ka best total hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The greedy instinct — take every other house, or always take the biggest — fails on `[2, 7, 9, 3, 1]`. DP works because the constraint is purely local: only adjacency matters, so the best answer up to house `i` depends on just two earlier totals. That is the "adjacent-exclusion" pattern, and the circular-street and delete-and-earn variants are the same recurrence in disguise.',
    solutionExplanationHi:
      'Greedy soch — ek chhod kar ek lo, ya hamesha sabse bada lo — `[2, 7, 9, 3, 1]` par fail ho jati hai. DP isliye chalta hai kyunki constraint poori tarah local hai: sirf adjacency matter karti hai, isliye ghar `i` tak ka best answer sirf do purane totals par depend karta hai. Yahi "adjacent-exclusion" pattern hai, aur circular-street wala aur delete-and-earn wala variant wahi recurrence hai naye roop mein.',
    starter: starter(
      `const arr = nums(1);

function rob(arr) {
  // your code here
}

console.log(rob(arr));`,
      `arr = nums(1)

def rob(arr):
    # your code here
    return 0

print(rob(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let skip = 0, take = 0;
for (const x of arr) { const next = Math.max(take, skip + x); skip = take; take = next; }
console.log(take);`,
      `arr = nums(1)
skip = take = 0
for x in arr:
    skip, take = take, max(take, skip + x)
print(take)`,
    ),
    testCases: [
      sample('4\n1 2 3 1', '4'),
      sample('5\n2 7 9 3 1', '12'),
      hidden('1\n5', '5'),
      hidden('2\n2 1', '2'),
      hidden('6\n2 1 1 2 1 5', '9'),
      hidden('3\n0 0 0', '0'),
    ],
  },

  {
    slug: 'coin-change',
    title: 'Coin Change',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Return the fewest coins needed to make `amount`, or `-1` if it cannot be made. You have unlimited coins of each denomination.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` coin denominations\n- Line 3: `amount`\n\n**Output**\nThe minimum coin count, or `-1`.',
    descriptionHi:
      '`amount` banane ke liye kam se kam kitne coins chahiye, wo return karo — ya `-1` agar banaya hi nahi ja sakta. Har denomination ke coins unlimited hain.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` coin denominations\n- Line 3: `amount`\n\n**Output**\nMinimum coin count, ya `-1`.',
    examples: [
      { input: '3\n1 2 5\n11', output: '3', explanation: '5 + 5 + 1.' },
      { input: '1\n2\n3', output: '-1' },
      { input: '1\n1\n0', output: '0' },
    ],
    constraints: ['1 <= n <= 12', '1 <= coin <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      'Greedy (always take the biggest coin) fails — try coins [1, 3, 4] and amount 6.',
      'Define dp[a] = fewest coins to make amount a.',
      'dp[a] = 1 + min(dp[a - coin]) over all coins that fit.',
    ],
    approach:
      'Bottom-up unbounded knapsack. Build `dp[0..amount]` initialised to infinity except `dp[0] = 0`, and relax every amount with every coin.',
    approachHi:
      'Bottom-up unbounded knapsack. `dp[0..amount]` ko infinity se initialise karo (sirf `dp[0] = 0`), phir har amount ko har coin ke saath relax karo.',
    timeComplexity: 'O(amount * n)',
    spaceComplexity: 'O(amount)',
    solutionExplanation:
      'Greedy is the trap: with coins [1, 3, 4] and amount 6, taking 4 first forces 4+1+1 (three coins) when 3+3 (two) is optimal. Because a locally best choice can be globally wrong, every amount must be computed from every reachable smaller amount. Coins are reusable, so the loop runs forwards over amounts — reverse it and you get the 0/1 knapsack instead, where each coin is used at most once.',
    solutionExplanationHi:
      'Greedy hi asli trap hai: coins [1, 3, 4] aur amount 6 par pehle 4 lene se 4+1+1 (teen coins) lena padta hai, jabki 3+3 (do) optimal hai. Kyunki locally best choice globally galat ho sakti hai, har amount ko har reachable chhote amount se compute karna padta hai. Coins dobara use ho sakte hain, isliye loop amounts par aage chalta hai — ulta kar do to 0/1 knapsack ban jata hai, jahan har coin zyada se zyada ek baar use hota hai.',
    starter: starter(
      `const coins = nums(1), amount = num(2);

function coinChange(coins, amount) {
  // your code here
}

console.log(coinChange(coins, amount));`,
      `coins, amount = nums(1), num(2)

def coin_change(coins, amount):
    # your code here
    return -1

print(coin_change(coins, amount))`,
    ),
    solution: solution(
      `const coins = nums(1), amount = num(2);
const dp = new Array(amount + 1).fill(Infinity);
dp[0] = 0;
for (let a = 1; a <= amount; a++)
  for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
console.log(dp[amount] === Infinity ? -1 : dp[amount]);`,
      `coins, amount = nums(1), num(2)
INF = float("inf")
dp = [0] + [INF] * amount
for a in range(1, amount + 1):
    for c in coins:
        if c <= a and dp[a - c] + 1 < dp[a]:
            dp[a] = dp[a - c] + 1
print(-1 if dp[amount] == INF else dp[amount])`,
    ),
    testCases: [
      sample('3\n1 2 5\n11', '3'),
      sample('1\n2\n3', '-1'),
      sample('1\n1\n0', '0'),
      hidden('3\n1 3 4\n6', '2'),
      hidden('2\n2 5\n11', '4'),
      hidden('4\n1 5 10 25\n63', '6'),
    ],
  },

  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Return the length of the longest strictly increasing subsequence (elements need not be contiguous).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe LIS length.',
    descriptionHi:
      'Sabse lambe strictly increasing subsequence ki length return karo (elements contiguous hone zaroori nahi).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nLIS ki length.',
    examples: [
      {
        input: '8\n10 9 2 5 3 7 101 18',
        output: '4',
        explanation: '[2, 3, 7, 101] has length 4.',
      },
      { input: '4\n7 7 7 7', output: '1' },
    ],
    constraints: ['1 <= n <= 2500', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'dp[i] = the LIS length ending exactly at index i.',
      'dp[i] = 1 + max(dp[j]) over all j < i with nums[j] < nums[i].',
      'There is an O(n log n) solution using patience sorting and binary search.',
    ],
    approach:
      'O(n^2) DP where `dp[i]` is the best length ending at `i`. The O(n log n) version keeps a "tails" array and binary-searches the insertion point for each value.',
    approachHi:
      'O(n^2) DP jisme `dp[i]` matlab `i` par khatam hone wali best length. O(n log n) version ek "tails" array rakhta hai aur har value ke liye binary search se insertion point dhoondta hai.',
    timeComplexity: 'O(n^2), or O(n log n) with patience sorting',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Anchoring `dp[i]` at "ends exactly at i" is what makes the recurrence well-defined — "the LIS in the first i elements" cannot be extended, because you would not know what the last element was. The answer is then the max over all `dp[i]`, not `dp[n-1]`. The O(n log n) trick is subtle: the `tails` array holds the smallest possible tail for each length and is not itself a valid subsequence — only its length is meaningful.',
    solutionExplanationHi:
      '`dp[i]` ko "exactly i par khatam" par anchor karna hi recurrence ko well-defined banata hai — "pehle i elements ka LIS" ko aage nahi badha sakte, kyunki aakhri element kya tha ye pata hi nahi hoga. Isliye answer saare `dp[i]` ka max hai, `dp[n-1]` nahi. O(n log n) wala trick sookshm hai: `tails` array har length ke liye sabse chhota possible tail rakhta hai aur khud ek valid subsequence nahi hota — sirf uski length matlab rakhti hai.',
    starter: starter(
      `const arr = nums(1);

function lis(arr) {
  // your code here
}

console.log(lis(arr));`,
      `arr = nums(1)

def lis(arr):
    # your code here
    return 0

print(lis(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
const tails = [];
for (const x of arr) {
  let lo = 0, hi = tails.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (tails[mid] < x) lo = mid + 1; else hi = mid; }
  tails[lo] = x;
}
console.log(tails.length);`,
      `import bisect
arr = nums(1)
tails = []
for x in arr:
    i = bisect.bisect_left(tails, x)
    if i == len(tails):
        tails.append(x)
    else:
        tails[i] = x
print(len(tails))`,
    ),
    testCases: [
      sample('8\n10 9 2 5 3 7 101 18', '4'),
      sample('4\n7 7 7 7', '1'),
      hidden('1\n1', '1'),
      hidden('6\n1 2 3 4 5 6', '6'),
      hidden('6\n6 5 4 3 2 1', '1'),
      hidden('8\n0 1 0 3 2 3 -1 4', '5'),
    ],
  },

  {
    slug: 'edit-distance',
    title: 'Edit Distance (Levenshtein)',
    category: 'Dynamic Programming',
    difficulty: 'HARD',
    description:
      'Return the minimum number of single-character insertions, deletions or replacements needed to turn `word1` into `word2`.\n\n**Input**\n- Line 1: `word1`\n- Line 2: `word2`\n\n**Output**\nThe minimum number of operations.',
    descriptionHi:
      '`word1` ko `word2` banane ke liye kam se kam kitne single-character insert, delete ya replace chahiye, wo return karo.\n\n**Input**\n- Line 1: `word1`\n- Line 2: `word2`\n\n**Output**\nMinimum operations.',
    examples: [
      {
        input: 'horse\nros',
        output: '3',
        explanation: 'horse → rorse (replace h) → rose (delete r) → ros (delete e).',
      },
      { input: 'intention\nexecution', output: '5' },
    ],
    constraints: ['0 <= length <= 500', 'Lowercase English letters'],
    hints: [
      'Compare the last characters. If they match, the cost is whatever the prefixes cost.',
      'If they differ, try all three operations and take the cheapest.',
      'dp[i][j] = edit distance between the first i and first j characters.',
    ],
    approach:
      '2-D DP over prefix lengths. When the characters match, `dp[i][j] = dp[i-1][j-1]`; otherwise it is `1 + min(replace, delete, insert)`. Base rows/columns are the lengths themselves.',
    approachHi:
      'Prefix lengths par 2-D DP. Characters match karein to `dp[i][j] = dp[i-1][j-1]`; warna `1 + min(replace, delete, insert)`. Base row/column khud lengths hoti hain.',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n), reducible to O(min(m, n))',
    solutionExplanation:
      'Each of the three neighbours in the table is one operation: `dp[i-1][j-1]` is a replace, `dp[i-1][j]` a delete, `dp[i][j-1]` an insert. Getting that mapping right is most of the problem. The base cases say turning a prefix into an empty string costs one deletion per character. Since each row only depends on the previous one, the table collapses to two rows — the standard follow-up.',
    solutionExplanationHi:
      'Table ke teen padosi teen operations hain: `dp[i-1][j-1]` replace, `dp[i-1][j]` delete, `dp[i][j-1]` insert. Yahi mapping sahi bithana hi asli kaam hai. Base cases kehte hain ki kisi prefix ko khaali string banane mein har character ke liye ek deletion lagti hai. Har row sirf pichhli row par depend karti hai, isliye table do rows mein simat jata hai — yahi standard follow-up hai.',
    starter: starter(
      `const a = line(0), b = line(1);

function editDistance(a, b) {
  // your code here
}

console.log(editDistance(a, b));`,
      `a, b = line(0), line(1)

def edit_distance(a, b):
    # your code here
    return 0

print(edit_distance(a, b))`,
    ),
    solution: solution(
      `const a = line(0), b = line(1);
let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
for (let i = 1; i <= a.length; i++) {
  const cur = [i];
  for (let j = 1; j <= b.length; j++) {
    cur[j] = a[i - 1] === b[j - 1]
      ? prev[j - 1]
      : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
  }
  prev = cur;
}
console.log(prev[b.length]);`,
      `a, b = line(0), line(1)
prev = list(range(len(b) + 1))
for i in range(1, len(a) + 1):
    cur = [i] + [0] * len(b)
    for j in range(1, len(b) + 1):
        if a[i - 1] == b[j - 1]:
            cur[j] = prev[j - 1]
        else:
            cur[j] = 1 + min(prev[j - 1], prev[j], cur[j - 1])
    prev = cur
print(prev[len(b)])`,
    ),
    testCases: [
      sample('horse\nros', '3'),
      sample('intention\nexecution', '5'),
      hidden('\n', '0'),
      hidden('abc\nabc', '0'),
      hidden('abc\n', '3'),
      hidden('\nabc', '3'),
      hidden('sunday\nsaturday', '3'),
    ],
  },
];
