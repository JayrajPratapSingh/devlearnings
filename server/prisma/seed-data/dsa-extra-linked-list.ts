import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Linked List — expansion batch. Rounds out the category beyond the original
 * three (Reverse Linked List, Merge Two Sorted Lists, Middle of the Linked
 * List) with cycle detection, the full k-th-from-end/dedupe/partition
 * toolkit, and the classic design/merge-k-lists problems. Real `Node`
 * objects are rebuilt from the flat input array in every starter/solution so
 * the practice still exercises genuine pointer rewiring, not array tricks.
 */
export const dsaExtraLinkedList: SeedProblem[] = [
  {
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Given a linked list and a position `pos` where the tail connects back to (or `-1` for no cycle), determine whether the list has a cycle.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `pos` (0-based index the tail links to, or `-1`)\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek linked list aur ek position `pos` diya hai jahan tail wapas connect hoti hai (ya `-1` agar koi cycle nahi hai). Batao ki list mein cycle hai ya nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `pos` (0-based index jahan tail link hoti hai, ya `-1`)\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n3 2 0 -4\n1', output: 'true' },
      { input: '1\n1\n-1', output: 'false' },
    ],
    constraints: ['0 <= n <= 10^4', '-1 <= pos < n'],
    hints: [
      'A hash set of visited nodes detects a cycle in O(n) space.',
      'Two pointers moving at different speeds (Floyd\'s algorithm) detect it in O(1) space.',
      'If a faster pointer ever equals a slower pointer, they are both stuck going around the same cycle.',
    ],
    approach:
      'Floyd\'s cycle detection: a `slow` pointer moves one step at a time, a `fast` pointer moves two. If they ever meet, there is a cycle. If `fast` (or `fast.next`) reaches `null`, there is no cycle.',
    approachHi:
      "Floyd's cycle detection: `slow` pointer ek step, `fast` pointer do steps chalta hai. Agar kabhi dono mil jaayein, to cycle hai. Agar `fast` (ya `fast.next`) `null` tak pahunch jaaye, to cycle nahi hai.",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'If there is no cycle, the faster pointer simply reaches the end first, same as any race with different speeds on a straight line. If there IS a cycle, both pointers are eventually trapped going around it forever, and because fast gains exactly one node on slow every step, the gap between them shrinks by 1 each lap — so it can never overshoot and skip past slow, guaranteeing they meet within at most one full lap of the cycle.',
    solutionExplanationHi:
      'Agar cycle nahi hai, to seedhi line par alag speeds ki race jaisa hi, tez pointer bas pehle end tak pahunch jaata hai. Agar cycle HAI, to dono pointers hamesha ke liye usme trapped ho jaate hain, aur chunki fast har step mein slow se exactly ek node aage badhta hai, unke beech ka gap har lap mein 1 se ghatata hai — isliye wo kabhi slow ko overshoot karke miss nahi kar sakta, guarantee karta hai ki wo cycle ke ek poore lap ke andar hi mil jaayenge.',
    starter: starter(
      `const n = num(0);
const vals = n ? nums(1) : [];
const pos = num(2);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
const head = nodes.length ? nodes[0] : null;

function hasCycle(head) {
  // your code here
}

console.log(hasCycle(head));`,
      `n = num(0)
vals = nums(1) if n else []
pos = num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
if pos >= 0 and nodes:
    nodes[-1].next = nodes[pos]
head = nodes[0] if nodes else None

def has_cycle(head):
    # your code here
    pass

print("true" if has_cycle(head) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const vals = n ? nums(1) : [];
const pos = num(2);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
let head = nodes.length ? nodes[0] : null;
let slow = head, fast = head, cycle = false;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) { cycle = true; break; }
}
console.log(cycle);`,
      `n = num(0)
vals = nums(1) if n else []
pos = num(2)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
if pos >= 0 and nodes:
    nodes[-1].next = nodes[pos]
head = nodes[0] if nodes else None
slow = fast = head
cycle = False
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast:
        cycle = True
        break
print("true" if cycle else "false")`,
    ),
    testCases: [
      sample('4\n3 2 0 -4\n1', 'true'),
      sample('1\n1\n-1', 'false'),
      hidden('2\n1 2\n0', 'true'),
      hidden('0\n\n-1', 'false'),
      hidden('3\n1 2 3\n-1', 'false'),
      hidden('5\n1 2 3 4 5\n4', 'true'),
    ],
  },

  {
    slug: 'linked-list-cycle-ii',
    title: 'Linked List Cycle II',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Given a linked list and a position `pos` the tail connects back to (or `-1` for no cycle), return the value of the node where the cycle begins, or `-1` if there is no cycle.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `pos`\n\n**Output**\nThe value at the cycle\'s start, or `-1`.',
    descriptionHi:
      'Ek linked list aur position `pos` diya hai jahan tail wapas connect hoti hai (ya `-1`). Us node ki value return karo jahan se cycle shuru hoti hai, ya `-1` agar cycle nahi hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `pos`\n\n**Output**\nCycle ke start ki value, ya `-1`.',
    examples: [
      { input: '4\n3 2 0 -4\n1', output: '2' },
      { input: '1\n1\n-1', output: '-1' },
    ],
    constraints: ['0 <= n <= 10^4', '-1 <= pos < n'],
    hints: [
      'First detect the cycle with the standard slow/fast meeting point.',
      'There is a classic follow-up trick: after slow and fast meet, resetting one pointer to the head and advancing both one step at a time makes them meet exactly at the cycle\'s start.',
      'This works because of a specific distance relationship provable with the cycle length and the distance from the head to the cycle start.',
    ],
    approach:
      'Detect the meeting point with Floyd\'s algorithm as in Linked List Cycle. If found, reset one pointer to `head` and advance both pointers one step at a time (instead of two) — they will meet again exactly at the node where the cycle begins.',
    approachHi:
      'Linked List Cycle wale Floyd algorithm se meeting point dhoondo. Milne par, ek pointer ko `head` par reset karo aur dono pointers ko ek-ek step (do nahi) aage badhao — wo dobara exactly wahin milenge jahan se cycle shuru hoti hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Let the distance from head to the cycle start be `a`, and the meeting point be `b` steps into the cycle from its start. By the time slow and fast meet, slow has traveled `a + b`, and it can be shown fast has traveled exactly one extra full cycle length more than slow, which algebraically forces `a` to equal the remaining distance from the meeting point back around to the cycle start. That is exactly why resetting one pointer to head and walking both one step at a time makes them collide precisely at the cycle\'s entrance.',
    solutionExplanationHi:
      'Head se cycle start tak ki distance `a` maano, aur meeting point cycle ke start se `b` steps andar ho. Jab tak slow aur fast milte hain, slow ne `a + b` chala hota hai, aur ye dikhaya ja sakta hai ki fast ne slow se exactly ek poori extra cycle length zyada chala hai — jo algebraically `a` ko meeting point se cycle start tak baaki bachi distance ke barabar bana deta hai. Yahi wajah hai ki ek pointer ko head par reset karke dono ko ek-ek step chalane se wo exactly cycle ke entrance par takrate hain.',
    starter: starter(
      `const n = num(0);
const vals = n ? nums(1) : [];
const pos = num(2);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
const head = nodes.length ? nodes[0] : null;

function detectCycle(head) {
  // return the Node where the cycle begins, or null
  return null;
}

const result = detectCycle(head);
console.log(result ? result.val : -1);`,
      `n = num(0)
vals = nums(1) if n else []
pos = num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
if pos >= 0 and nodes:
    nodes[-1].next = nodes[pos]
head = nodes[0] if nodes else None

def detect_cycle(head):
    # return the Node where the cycle begins, or None
    return None

result = detect_cycle(head)
print(result.val if result else -1)`,
    ),
    solution: solution(
      `const n = num(0);
const vals = n ? nums(1) : [];
const pos = num(2);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
let head = nodes.length ? nodes[0] : null;
let slow = head, fast = head, met = null;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) { met = slow; break; }
}
let result = null;
if (met) {
  let p1 = head, p2 = met;
  while (p1 !== p2) { p1 = p1.next; p2 = p2.next; }
  result = p1;
}
console.log(result ? result.val : -1);`,
      `n = num(0)
vals = nums(1) if n else []
pos = num(2)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
if pos >= 0 and nodes:
    nodes[-1].next = nodes[pos]
head = nodes[0] if nodes else None
slow = fast = head
met = None
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast:
        met = slow
        break
result = None
if met:
    p1, p2 = head, met
    while p1 is not p2:
        p1 = p1.next
        p2 = p2.next
    result = p1
print(result.val if result else -1)`,
    ),
    testCases: [
      sample('4\n3 2 0 -4\n1', '2'),
      sample('1\n1\n-1', '-1'),
      hidden('2\n1 2\n0', '1'),
      hidden('0\n\n-1', '-1'),
      hidden('5\n1 2 3 4 5\n0', '1'),
      hidden('5\n1 2 3 4 5\n4', '5'),
    ],
  },

  {
    slug: 'remove-nth-node-from-end',
    title: 'Remove Nth Node From End of List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Remove the `k`-th node from the end of the list (1 = the last node), and print the remaining list.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `k`\n\n**Output**\nThe remaining values, space-separated, or `(empty)`.',
    descriptionHi:
      'List ke end se `k`-vaan node hatao (1 = aakhri node), aur bachi hui list print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `k`\n\n**Output**\nBachi hui values, space se separate, ya `(empty)`.',
    examples: [
      { input: '5\n1 2 3 4 5\n2', output: '1 2 3 5' },
      { input: '1\n1\n1', output: '(empty)' },
    ],
    constraints: ['1 <= n <= 30', '1 <= k <= n'],
    hints: [
      'Knowing the length first makes this trivial, but can you do it in one pass?',
      'A two-pointer gap trick: advance one pointer k steps ahead first, then move both together.',
      'A dummy head node handles the special case of removing the actual head cleanly.',
    ],
    approach:
      'Two pointers with a dummy node before the head. Advance a `fast` pointer `k` steps ahead of a `slow` pointer (both starting at the dummy), then move both forward together until `fast` reaches the last node; `slow.next` is then exactly the node to remove, so unlink it.',
    approachHi:
      'Head se pehle ek dummy node ke saath do pointers. `fast` pointer ko `slow` pointer se `k` steps aage badhao (dono dummy se shuru), phir dono ko saath aage badhao jab tak `fast` aakhri node tak na pahunche; ab `slow.next` hi hataya jaane wala node hai, use unlink kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Maintaining a fixed gap of exactly k nodes between two pointers means that when the front pointer reaches the end, the back pointer is automatically k nodes from the end — this is the single-pass equivalent of "count the length first, then walk to position n-k", collapsing two passes into one. The dummy node exists purely so that removing the real head (when k equals the list length) needs no special-case branch.',
    solutionExplanationHi:
      'Do pointers ke beech exactly k nodes ka fixed gap maintain karna matlab jab front pointer end tak pahunchta hai, back pointer automatically end se k nodes door hota hai — ye "pehle length count karo, phir position n-k tak chalo" ka single-pass equivalent hai, do passes ko ek mein samet deta hai. Dummy node sirf isliye hai taaki real head hatana (jab k list ki length ke barabar ho) ke liye alag se special-case branch na chahiye.',
    starter: starter(
      `const n = num(0);
const vals = nums(1);
const k = num(2);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function removeNthFromEnd(head, k) {
  // return the new head
  return head;
}

const out = [];
for (let p = removeNthFromEnd(head, k); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `n = num(0)
vals = nums(1)
k = num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def remove_nth_from_end(head, k):
    # return the new head
    return head

out = []
p = remove_nth_from_end(head, k)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
const k = num(2);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
const dummy = new Node(0);
dummy.next = head;
let fast = dummy, slow = dummy;
for (let i = 0; i < k; i++) fast = fast.next;
while (fast.next) { fast = fast.next; slow = slow.next; }
slow.next = slow.next.next;
const out = [];
for (let p = dummy.next; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
k = num(2)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
dummy = Node(0)
dummy.next = head
fast = slow = dummy
for _ in range(k):
    fast = fast.next
while fast.next:
    fast = fast.next
    slow = slow.next
slow.next = slow.next.next
out = []
p = dummy.next
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5\n2', '1 2 3 5'),
      sample('1\n1\n1', '(empty)'),
      hidden('2\n1 2\n1', '1'),
      hidden('2\n1 2\n2', '2'),
      hidden('5\n1 2 3 4 5\n5', '2 3 4 5'),
      hidden('3\n1 2 3\n3', '2 3'),
    ],
  },

  {
    slug: 'palindrome-linked-list',
    title: 'Palindrome Linked List',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Determine whether a linked list reads the same forward and backward.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki ek linked list forward aur backward same padhi jaati hai ya nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n1 2 2 1', output: 'true' },
      { input: '2\n1 2', output: 'false' },
    ],
    constraints: ['1 <= n <= 5*10^4'],
    hints: [
      'Copying values into an array reduces this to a trivial two-pointer array check, at O(n) space.',
      'To do it in O(1) extra space: find the middle, reverse the second half in place, then compare halves.',
      'Restoring the list back to its original shape afterward is good practice, though not always required.',
    ],
    approach:
      'Find the middle with fast/slow pointers, reverse the second half in place, then walk both halves from their respective starts comparing values. The list is a palindrome exactly when every pair matches.',
    approachHi:
      'Fast/slow pointers se middle dhoondo, doosre half ko in place reverse karo, phir dono halves ko apne-apne start se walk karke values compare karo. List palindrome hai agar har pair match kare.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with the in-place reversal (O(n) with the array-copy approach)',
    solutionExplanation:
      'A singly linked list cannot be walked backward directly, which is what makes this harder than the equivalent array problem — reversing the second half physically creates a backward-readable segment, turning the comparison back into an ordinary two-pointer walk over two forward-only halves that happen to represent the two ends of the original list.',
    solutionExplanationHi:
      'Ek singly linked list seedhe backward walk nahi ki ja sakti, yahi cheez ise equivalent array problem se mushkil banati hai — doosre half ko physically reverse karna ek backward-padhne-layak segment bana deta hai, jisse comparison wapas ek normal two-pointer walk ban jaata hai, do forward-only halves par jo original list ke dono ends represent karte hain.',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function isPalindrome(head) {
  // your code here
}

console.log(isPalindrome(head));`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def is_palindrome(head):
    # your code here
    pass

print("true" if is_palindrome(head) else "false")`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
let slow = head, fast = head;
while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
let prev = null, curr = slow;
while (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }
let p1 = head, p2 = prev, ok = true;
while (p2) { if (p1.val !== p2.val) { ok = false; break; } p1 = p1.next; p2 = p2.next; }
console.log(ok);`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
prev, curr = None, slow
while curr:
    nxt = curr.next
    curr.next = prev
    prev = curr
    curr = nxt
p1, p2, ok = head, prev, True
while p2:
    if p1.val != p2.val:
        ok = False
        break
    p1 = p1.next
    p2 = p2.next
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('4\n1 2 2 1', 'true'),
      sample('2\n1 2', 'false'),
      hidden('1\n5', 'true'),
      hidden('5\n1 2 3 2 1', 'true'),
      hidden('3\n1 2 3', 'false'),
      hidden('6\n1 2 3 3 2 1', 'true'),
    ],
  },

  {
    slug: 'intersection-of-two-linked-lists',
    title: 'Intersection of Two Linked Lists',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Two singly linked lists may share a common tail. Given both lists and how many trailing values they share, return the value at the intersection, or `-1` if they do not intersect.\n\n**Input**\n- Line 1: `nA`\n- Line 2: `nA` values (list A)\n- Line 3: `nB`\n- Line 4: `nB` values (list B)\n- Line 5: `c` — the number of shared trailing values (0 if none; the last `c` values of A and B are guaranteed identical)\n\n**Output**\nThe value at the intersection, or `-1`.',
    descriptionHi:
      'Do singly linked lists ka ek common tail ho sakta hai. Dono lists aur unke shared trailing values ki sankhya di hai — intersection ki value return karo, ya `-1` agar wo intersect nahi karti.\n\n**Input**\n- Line 1: `nA`\n- Line 2: `nA` values (list A)\n- Line 3: `nB`\n- Line 4: `nB` values (list B)\n- Line 5: `c` — shared trailing values ki sankhya (0 agar koi nahi; A aur B ke aakhri `c` values guaranteed identical hain)\n\n**Output**\nIntersection ki value, ya `-1`.',
    examples: [
      { input: '5\n4 1 8 4 5\n6\n5 6 1 8 4 5\n3', output: '8' },
      { input: '3\n2 6 4\n2\n1 5\n0', output: '-1' },
    ],
    constraints: ['0 <= nA, nB <= 100', '0 <= c <= min(nA, nB)'],
    hints: [
      'A hash set of all of list A\'s nodes, then scanning list B for the first hit, works in O(n) space.',
      'A neat O(1)-space trick: walk both lists, and when a pointer reaches the end, redirect it to the head of the OTHER list.',
      'Both pointers then travel the same total distance (lenA + lenB) and arrive at the intersection at exactly the same step, or both reach null together if there is none.',
    ],
    approach:
      'Two pointers, one starting at each list\'s head. Advance both one step at a time; when a pointer reaches the end of its list, redirect it to the head of the *other* list. They meet at the intersection node (or both become `null` simultaneously if there is none), because both pointers traverse the exact same total length by the second pass.',
    approachHi:
      'Do pointers, ek har list ke head par. Dono ko ek-ek step aage badhao; jab koi pointer apni list ke end tak pahunche, use *doosri* list ke head par redirect kar do. Wo intersection node par milte hain (ya dono ek saath `null` ho jaate hain agar intersection nahi hai), kyunki doosre pass tak dono pointers exactly wahi total length travel karte hain.',
    timeComplexity: 'O(nA + nB)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Switching each pointer to the other list\'s head upon reaching its own end is what equalizes the total distance each pointer travels before potentially meeting: pointer A travels `lenA + lenB` and pointer B travels `lenB + lenA` — the same total — so by the time both have covered that distance, they are guaranteed to be at the same position, which is the intersection point if one exists (since the tails are identical from there on), or both at null if the lists never actually share a node.',
    solutionExplanationHi:
      'Har pointer ko apne end tak pahunchte hi doosri list ke head par switch karna, milne se pehle har pointer ki total travelled distance ko barabar kar deta hai: pointer A `lenA + lenB` chalta hai aur pointer B `lenB + lenA` — same total — isliye jab tak dono ne wo distance cover kar li hoti hai, wo guaranteed same position par honge, jo intersection point hai agar wo exist karta hai (kyunki wahan se tail identical hai), ya dono null par agar lists kabhi kisi node ko share hi nahi karti thi.',
    starter: starter(
      `const nA = num(0);
const a = nA ? nums(1) : [];
const nB = num(2);
const b = nB ? nums(3) : [];
const c = num(4);

class Node { constructor(v) { this.val = v; this.next = null; } }
const tailShared = [];
for (let i = 0; i < c; i++) tailShared.push(new Node(a[a.length - c + i]));
for (let i = 0; i < tailShared.length - 1; i++) tailShared[i].next = tailShared[i + 1];

function buildList(vals, count, shared) {
  const own = vals.slice(0, vals.length - count).map((v) => new Node(v));
  for (let i = 0; i < own.length - 1; i++) own[i].next = own[i + 1];
  if (own.length && shared.length) own[own.length - 1].next = shared[0];
  if (own.length) return own[0];
  return shared.length ? shared[0] : null;
}
const headA = buildList(a, c, tailShared);
const headB = buildList(b, c, tailShared);

function getIntersectionNode(headA, headB) {
  // return the intersecting Node, or null
  return null;
}

const result = getIntersectionNode(headA, headB);
console.log(result ? result.val : -1);`,
      `nA = num(0)
a = nums(1) if nA else []
nB = num(2)
b = nums(3) if nB else []
c = num(4)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

tail_shared = [Node(a[len(a) - c + i]) for i in range(c)]
for i in range(len(tail_shared) - 1):
    tail_shared[i].next = tail_shared[i + 1]

def build_list(vals, count, shared):
    own = [Node(v) for v in vals[:len(vals) - count]]
    for i in range(len(own) - 1):
        own[i].next = own[i + 1]
    if own and shared:
        own[-1].next = shared[0]
    if own:
        return own[0]
    return shared[0] if shared else None

head_a = build_list(a, c, tail_shared)
head_b = build_list(b, c, tail_shared)

def get_intersection_node(head_a, head_b):
    # return the intersecting Node, or None
    return None

result = get_intersection_node(head_a, head_b)
print(result.val if result else -1)`,
    ),
    solution: solution(
      `const nA = num(0);
const a = nA ? nums(1) : [];
const nB = num(2);
const b = nB ? nums(3) : [];
const c = num(4);
class Node { constructor(v) { this.val = v; this.next = null; } }
const tailShared = [];
for (let i = 0; i < c; i++) tailShared.push(new Node(a[a.length - c + i]));
for (let i = 0; i < tailShared.length - 1; i++) tailShared[i].next = tailShared[i + 1];
function buildList(vals, count, shared) {
  const own = vals.slice(0, vals.length - count).map((v) => new Node(v));
  for (let i = 0; i < own.length - 1; i++) own[i].next = own[i + 1];
  if (own.length && shared.length) own[own.length - 1].next = shared[0];
  if (own.length) return own[0];
  return shared.length ? shared[0] : null;
}
const headA = buildList(a, c, tailShared);
const headB = buildList(b, c, tailShared);
let p1 = headA, p2 = headB;
while (p1 !== p2) { p1 = p1 ? p1.next : headB; p2 = p2 ? p2.next : headA; }
console.log(p1 ? p1.val : -1);`,
      `nA = num(0)
a = nums(1) if nA else []
nB = num(2)
b = nums(3) if nB else []
c = num(4)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
tail_shared = [Node(a[len(a) - c + i]) for i in range(c)]
for i in range(len(tail_shared) - 1):
    tail_shared[i].next = tail_shared[i + 1]
def build_list(vals, count, shared):
    own = [Node(v) for v in vals[:len(vals) - count]]
    for i in range(len(own) - 1):
        own[i].next = own[i + 1]
    if own and shared:
        own[-1].next = shared[0]
    if own:
        return own[0]
    return shared[0] if shared else None
head_a = build_list(a, c, tail_shared)
head_b = build_list(b, c, tail_shared)
p1, p2 = head_a, head_b
while p1 is not p2:
    p1 = p1.next if p1 else head_b
    p2 = p2.next if p2 else head_a
print(p1.val if p1 else -1)`,
    ),
    testCases: [
      sample('5\n4 1 8 4 5\n6\n5 6 1 8 4 5\n3', '8'),
      sample('3\n2 6 4\n2\n1 5\n0', '-1'),
      hidden('1\n1\n1\n1\n1', '1'),
      hidden('2\n1 9\n1\n9\n1', '9'),
      hidden('0\n\n0\n\n0', '-1'),
      hidden('4\n1 2 3 4\n2\n3 4\n2', '3'),
    ],
  },

  {
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Two non-negative integers are represented as linked lists with digits stored in reverse order (least significant digit first). Add them and return the sum, also as digits in reverse order.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` digits (list 1, reverse order)\n- Line 3: `m`\n- Line 4: `m` digits (list 2, reverse order)\n\n**Output**\nThe sum\'s digits, in reverse order, space-separated.',
    descriptionHi:
      'Do non-negative integers ko linked lists ki tarah represent kiya gaya hai, digits reverse order mein (least significant digit pehle). Unhe add karo aur sum bhi reverse-order digits ki tarah return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` digits (list 1, reverse order)\n- Line 3: `m`\n- Line 4: `m` digits (list 2, reverse order)\n\n**Output**\nSum ke digits, reverse order mein, space se separate.',
    examples: [
      { input: '3\n2 4 3\n3\n5 6 4', output: '7 0 8', explanation: '342 + 465 = 807.' },
      { input: '1\n0\n1\n0', output: '0' },
    ],
    constraints: ['1 <= n, m <= 100', '0 <= digit <= 9', 'No number has a leading zero unless it is exactly 0'],
    hints: [
      'Reverse order is actually a gift here — it means the least significant digits are already first, exactly where grade-school addition starts.',
      'Walk both lists simultaneously, adding corresponding digits plus a running carry.',
      'A list that runs out before the other is treated as contributing 0s; a final leftover carry needs its own extra node.',
    ],
    approach:
      'Walk both lists simultaneously from the head (least significant digit), maintaining a carry. At each step, sum the two current digits (treating a missing one as 0) plus the carry, emit `sum % 10` as the next result digit, and carry `floor(sum / 10)`. If a carry remains after both lists are exhausted, append one final digit.',
    approachHi:
      'Dono lists ko saath-saath head se (least significant digit) walk karo, ek carry maintain karte hue. Har step par dono current digits (missing wale ko 0 maano) aur carry ka sum lo, `sum % 10` ko agla result digit ki tarah emit karo, aur `floor(sum / 10)` carry karo. Agar dono lists khatam hone ke baad bhi carry bacha hai, to ek aakhri digit append karo.',
    timeComplexity: 'O(max(n, m))',
    spaceComplexity: 'O(max(n, m))',
    solutionExplanation:
      'Storing digits least-significant-first means the lists are already in exactly the order grade-school addition processes them — no reversal is needed first, unlike if they had been stored most-significant-first. The algorithm is otherwise identical to Add Binary\'s digit-by-digit, carry-propagating walk, just base 10 instead of base 2, with the same trailing-carry edge case producing one extra digit.',
    solutionExplanationHi:
      'Digits ko least-significant-first store karna matlab lists pehle se hi exactly wahi order mein hain jismein grade-school addition unhe process karta hai — pehle reverse karne ki zaroorat nahi, jaisa most-significant-first store hone par hota. Algorithm baaki Add Binary wale digit-by-digit, carry-propagating walk jaisa hi hai, bas base 10 hai base 2 ki jagah, aur wahi trailing-carry edge case ek extra digit banata hai.',
    starter: starter(
      `const a = nums(1);
const b = nums(3);

class Node { constructor(v) { this.val = v; this.next = null; } }
function buildList(vals) {
  const nodes = vals.map((v) => new Node(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  return nodes.length ? nodes[0] : null;
}
const l1 = buildList(a), l2 = buildList(b);

function addTwoNumbers(l1, l2) {
  // return the head of the resulting list
  return null;
}

const out = [];
for (let p = addTwoNumbers(l1, l2); p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `a = nums(1)
b = nums(3)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

def build_list(vals):
    nodes = [Node(v) for v in vals]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    return nodes[0] if nodes else None

l1 = build_list(a)
l2 = build_list(b)

def add_two_numbers(l1, l2):
    # return the head of the resulting list
    return None

out = []
p = add_two_numbers(l1, l2)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    solution: solution(
      `const a = nums(1);
const b = nums(3);
class Node { constructor(v) { this.val = v; this.next = null; } }
function buildList(vals) {
  const nodes = vals.map((v) => new Node(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  return nodes.length ? nodes[0] : null;
}
let l1 = buildList(a), l2 = buildList(b);
const dummy = new Node(0);
let curr = dummy, carry = 0;
while (l1 || l2 || carry) {
  const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
  curr.next = new Node(sum % 10);
  curr = curr.next;
  carry = Math.floor(sum / 10);
  if (l1) l1 = l1.next;
  if (l2) l2 = l2.next;
}
const out = [];
for (let p = dummy.next; p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `a = nums(1)
b = nums(3)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
def build_list(vals):
    nodes = [Node(v) for v in vals]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    return nodes[0] if nodes else None
l1 = build_list(a)
l2 = build_list(b)
dummy = Node(0)
curr = dummy
carry = 0
while l1 or l2 or carry:
    total = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
    curr.next = Node(total % 10)
    curr = curr.next
    carry = total // 10
    if l1:
        l1 = l1.next
    if l2:
        l2 = l2.next
out = []
p = dummy.next
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('3\n2 4 3\n3\n5 6 4', '7 0 8'),
      sample('1\n0\n1\n0', '0'),
      hidden('7\n9 9 9 9 9 9 9\n4\n9 9 9 9', '8 9 9 9 0 0 0 1'),
      hidden('1\n5\n1\n5', '0 1'),
      hidden('2\n1 8\n1\n0', '1 8'),
      hidden('3\n9 9 9\n1\n1', '0 0 0 1'),
    ],
  },

  {
    slug: 'odd-even-linked-list',
    title: 'Odd Even Linked List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Group all nodes at odd 1-based positions together, followed by all nodes at even positions, preserving relative order within each group.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nThe regrouped values, space-separated.',
    descriptionHi:
      'Saare odd 1-based position wale nodes ko saath group karo, uske baad saare even position wale, har group ke andar relative order preserve karte hue.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nRegrouped values, space se separate.',
    examples: [
      { input: '5\n1 2 3 4 5', output: '1 3 5 2 4' },
      { input: '7\n2 1 3 5 6 4 7', output: '2 3 6 7 1 5 4' },
    ],
    constraints: ['0 <= n <= 10^4'],
    hints: [
      'This regroups by position parity, not by value parity — do not check `val % 2`.',
      'Maintain two separate chains as you walk the list once: one for odd positions, one for even.',
      'After the single pass, link the end of the odd chain to the start of the even chain.',
    ],
    approach:
      'Walk the list once with two pointers, `odd` and `even`, starting at the 1st and 2nd nodes. Alternately advance each, linking `odd.next = odd.next.next` and `even.next = even.next.next` to weave two separate chains. Finally, link the tail of the odd chain to the head of the even chain.',
    approachHi:
      'List ko ek baar walk karo, `odd` aur `even` naam ke do pointers ke saath, jo 1st aur 2nd node se shuru hote hain. Baari-baari se dono ko aage badhao, `odd.next = odd.next.next` aur `even.next = even.next.next` se do alag chains bunte hue. Aakhir mein, odd chain ke tail ko even chain ke head se jod do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Rather than building new nodes or lists, the existing nodes are simply re-linked in place into two interleaved chains that are woven out of a single forward pass — every other node is skipped over by each pointer, which is exactly what separates "positions 1,3,5,..." from "positions 2,4,6,...". Saving the even chain\'s head before the rewiring starts is essential, since the pointer used to build that chain moves away from it.',
    solutionExplanationHi:
      'Naye nodes ya lists banane ke bajaye, existing nodes ko in place hi do interleaved chains mein re-link kiya jaata hai, ek hi forward pass mein bunte hue — har pointer ek-ek node skip karta hai, yahi cheez "positions 1,3,5,..." ko "positions 2,4,6,..." se alag karti hai. Even chain ka head rewiring shuru hone se pehle save karna zaroori hai, kyunki jo pointer wo chain banata hai wo usse door move ho jaata hai.',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function oddEvenList(head) {
  // return the new head
  return head;
}

const out = [];
for (let p = oddEvenList(head); p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def odd_even_list(head):
    # return the new head
    return head

out = []
p = odd_even_list(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
if (head && head.next) {
  let odd = head, even = head.next, evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
}
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
if head and head.next:
    odd, even = head, head.next
    even_head = even
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = even_head
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5', '1 3 5 2 4'),
      sample('7\n2 1 3 5 6 4 7', '2 3 6 7 1 5 4'),
      hidden('1\n1', '1'),
      hidden('2\n1 2', '1 2'),
      hidden('0\n', ''),
      hidden('4\n1 2 3 4', '1 3 2 4'),
    ],
  },

  {
    slug: 'swap-nodes-in-pairs',
    title: 'Swap Nodes in Pairs',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Swap every two adjacent nodes in the list.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nThe resulting values, space-separated, or `(empty)`.',
    descriptionHi:
      'List mein har do adjacent nodes ko swap karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nResulting values, space se separate, ya `(empty)`.',
    examples: [
      { input: '4\n1 2 3 4', output: '2 1 4 3' },
      { input: '3\n1 2 3', output: '2 1 3' },
    ],
    constraints: ['0 <= n <= 100'],
    hints: [
      'Swapping values instead of nodes is a valid shortcut, but the pointer-rewiring version is what interviewers usually want to see.',
      'A dummy node before the head simplifies swapping the very first pair.',
      'For each pair, three pointer updates are needed: the node before the pair, and the two nodes being swapped.',
    ],
    approach:
      'Use a dummy node pointing at the head, and a `prev` pointer starting at the dummy. For each pair `(first, second)` after `prev`, rewire so `second` comes before `first`: `prev.next = second`, `first.next = second.next`, `second.next = first`, then advance `prev` to `first` for the next pair.',
    approachHi:
      'Head ki taraf point karta ek dummy node use karo, aur `prev` pointer dummy se shuru karo. `prev` ke baad har pair `(first, second)` ke liye, rewire karo taaki `second`, `first` se pehle aaye: `prev.next = second`, `first.next = second.next`, `second.next = first`, phir agle pair ke liye `prev` ko `first` par le jao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Three pointers change per pair, and the order they are updated in matters: `first.next` must be reassigned to `second.next` before `second.next` itself is overwritten to point at `first`, or the rest of the list beyond the pair would be lost. The dummy node exists purely so the first pair (which touches the actual head) needs no special-case branch different from every other pair.',
    solutionExplanationHi:
      'Har pair mein teen pointers badalte hain, aur unhe update karne ka order matter karta hai: `first.next` ko `second.next` mein reassign karna zaroori hai isse pehle ki `second.next` khud `first` ki taraf point karne ke liye overwrite ho, warna pair ke aage ki poori list gum ho jaayegi. Dummy node sirf isliye hai taaki pehla pair (jo real head ko touch karta hai) baaki har pair se alag koi special-case branch na maange.',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function swapPairs(head) {
  // return the new head
  return head;
}

const out = [];
for (let p = swapPairs(head); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def swap_pairs(head):
    # return the new head
    return head

out = []
p = swap_pairs(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
const dummy = new Node(0);
dummy.next = head;
let prev = dummy;
while (prev.next && prev.next.next) {
  const first = prev.next, second = first.next;
  first.next = second.next;
  second.next = first;
  prev.next = second;
  prev = first;
}
const out = [];
for (let p = dummy.next; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
dummy = Node(0)
dummy.next = head
prev = dummy
while prev.next and prev.next.next:
    first = prev.next
    second = first.next
    first.next = second.next
    second.next = first
    prev.next = second
    prev = first
out = []
p = dummy.next
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('4\n1 2 3 4', '2 1 4 3'),
      sample('3\n1 2 3', '2 1 3'),
      hidden('0\n', '(empty)'),
      hidden('1\n1', '1'),
      hidden('2\n1 2', '2 1'),
      hidden('6\n1 2 3 4 5 6', '2 1 4 3 6 5'),
    ],
  },

  {
    slug: 'rotate-list',
    title: 'Rotate List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Rotate the list to the right by `k` places.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `k`\n\n**Output**\nThe rotated values, space-separated, or `(empty)`.',
    descriptionHi:
      'List ko right side `k` places se rotate karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `k`\n\n**Output**\nRotated values, space se separate, ya `(empty)`.',
    examples: [
      { input: '5\n1 2 3 4 5\n2', output: '4 5 1 2 3' },
      { input: '3\n0 1 2\n4', output: '2 0 1' },
    ],
    constraints: ['0 <= n <= 500', '0 <= k <= 2*10^9'],
    hints: [
      '`k` can be far larger than the list length — the effective rotation is `k % n`.',
      'Connecting the tail back to the head turns the list into a circle, making rotation just a matter of picking a new break point.',
      'The new tail is at position `n - k % n - 1` from the old head; break the circle right after it.',
    ],
    approach:
      'Find the length `n` and connect the tail to the head, forming a circle. Compute the effective rotation `k % n`, walk `n - k % n` steps from the head to find the new tail, then break the circle there: the new head is the node right after the new tail.',
    approachHi:
      'Length `n` nikaalo aur tail ko head se jodkar ek circle bana do. Effective rotation `k % n` compute karo, head se `n - k % n` steps chal kar naya tail dhoondo, phir wahin circle todo: naya head, naye tail ke turant baad wala node hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Temporarily closing the list into a circle sidesteps the awkwardness of rotation on an open list — once it is circular, "rotate right by k" is purely about choosing where to cut it open again, and that cut point is a simple arithmetic offset (`n - k % n` steps from the original head) rather than requiring any actual node movement.',
    solutionExplanationHi:
      'List ko temporarily circle mein band karna, open list par rotation ki awkwardness ko avoid kar deta hai — ek baar circular ban jaaye, "right se k rotate karo" sirf itna hai ki wapas kahan se todna hai chuno, aur wo cut point ek simple arithmetic offset hai (`n - k % n` steps original head se), kisi actual node movement ki zaroorat nahi.',
    starter: starter(
      `const vals = nums(1);
let k = num(2);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function rotateRight(head, k) {
  // return the new head
  return head;
}

const out = [];
for (let p = rotateRight(head, k); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
k = num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def rotate_right(head, k):
    # return the new head
    return head

out = []
p = rotate_right(head, k)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
let k = num(2);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
let head = nodes.length ? nodes[0] : null;
if (head && head.next) {
  let n = 1, tail = head;
  while (tail.next) { tail = tail.next; n++; }
  k %= n;
  if (k !== 0) {
    tail.next = head;
    let stepsToNewTail = n - k;
    let newTail = head;
    for (let i = 1; i < stepsToNewTail; i++) newTail = newTail.next;
    head = newTail.next;
    newTail.next = null;
  }
}
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
k = num(2)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
if head and head.next:
    n, tail = 1, head
    while tail.next:
        tail = tail.next
        n += 1
    k %= n
    if k != 0:
        tail.next = head
        steps_to_new_tail = n - k
        new_tail = head
        for _ in range(1, steps_to_new_tail):
            new_tail = new_tail.next
        head = new_tail.next
        new_tail.next = None
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5\n2', '4 5 1 2 3'),
      sample('3\n0 1 2\n4', '2 0 1'),
      hidden('0\n\n5', '(empty)'),
      hidden('1\n1\n99', '1'),
      hidden('3\n1 2 3\n0', '1 2 3'),
      hidden('4\n1 2 3 4\n4', '1 2 3 4'),
    ],
  },

  {
    slug: 'partition-list',
    title: 'Partition List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Rearrange the list so all nodes with values less than `x` come before all nodes with values `>= x`, preserving the relative order within each group.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `x`\n\n**Output**\nThe rearranged values, space-separated, or `(empty)`.',
    descriptionHi:
      'List ko rearrange karo taaki `x` se chhoti values wale saare nodes, `x` se `>=` values wale saare nodes se pehle aayein, har group ke andar relative order preserve karte hue.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `x`\n\n**Output**\nRearranged values, space se separate, ya `(empty)`.',
    examples: [
      { input: '6\n1 4 3 2 5 2\n3', output: '1 2 2 4 3 5' },
      { input: '2\n2 1\n2', output: '1 2' },
    ],
    constraints: ['0 <= n <= 200'],
    hints: [
      'This needs a stable partition — relative order within each group must be preserved, ruling out naive swaps.',
      'Build two separate chains while walking once: one for "less than x", one for "greater or equal".',
      'Join the two chains at the end, with the less-than chain first.',
    ],
    approach:
      'Walk the list once, appending each node to one of two separate chains (using dummy heads) depending on whether its value is `< x` or `>= x`. At the end, link the tail of the less-than chain to the head of the greater-or-equal chain, and terminate the combined list.',
    approachHi:
      'List ko ek baar walk karo, har node ko do alag chains (dummy heads use karke) mein se ek mein append karo, depending on ki uski value `< x` hai ya `>= x`. Aakhir mein, less-than chain ke tail ko greater-or-equal chain ke head se jodo, aur combined list ko terminate karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) (reuses existing nodes)',
    solutionExplanation:
      'Building two chains in one pass, rather than trying to swap nodes in place, is what naturally preserves relative order within each group: every node is simply appended to whichever chain it belongs to, in the exact order it was encountered, so neither chain can ever become internally out of order — only the final tail of the "greater-or-equal" chain needs its `next` explicitly nulled, since it may still point at whatever followed it originally.',
    solutionExplanationHi:
      'In-place nodes swap karne ke bajaye ek pass mein do chains banana, naturally har group ke andar relative order preserve karta hai: har node bas us chain mein append hota hai jiski wo belong karta hai, exactly usi order mein jisme wo mila — isliye koi bhi chain andar se out-of-order nahi ho sakti. Sirf "greater-or-equal" chain ke aakhri tail ka `next` explicitly null karna padta hai, kyunki wo abhi bhi kisi purani cheez ki taraf point kar sakta hai.',
    starter: starter(
      `const vals = nums(1);
const x = num(2);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function partition(head, x) {
  // return the new head
  return head;
}

const out = [];
for (let p = partition(head, x); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
x = num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def partition(head, x):
    # return the new head
    return head

out = []
p = partition(head, x)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
const x = num(2);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
const lessDummy = new Node(0), geDummy = new Node(0);
let less = lessDummy, ge = geDummy;
for (let p = head; p; p = p.next) {
  if (p.val < x) { less.next = p; less = less.next; }
  else { ge.next = p; ge = ge.next; }
}
ge.next = null;
less.next = geDummy.next;
const out = [];
for (let p = lessDummy.next; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
x = num(2)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
less_dummy, ge_dummy = Node(0), Node(0)
less, ge = less_dummy, ge_dummy
p = head
while p:
    if p.val < x:
        less.next = p
        less = less.next
    else:
        ge.next = p
        ge = ge.next
    p = p.next
ge.next = None
less.next = ge_dummy.next
out = []
p = less_dummy.next
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('6\n1 4 3 2 5 2\n3', '1 2 2 4 3 5'),
      sample('2\n2 1\n2', '1 2'),
      hidden('0\n\n1', '(empty)'),
      hidden('3\n1 1 1\n2', '1 1 1'),
      hidden('4\n3 3 3 3\n3', '3 3 3 3'),
      hidden('5\n5 1 4 2 3\n3', '1 2 5 4 3'),
    ],
  },

  {
    slug: 'remove-duplicates-from-sorted-list',
    title: 'Remove Duplicates from Sorted List',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'Given a sorted linked list, delete duplicate values so each value appears only once.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted values\n\n**Output**\nThe deduplicated values, space-separated, or `(empty)`.',
    descriptionHi:
      'Ek sorted linked list di hai. Duplicate values delete karo taaki har value sirf ek hi baar aaye.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted values\n\n**Output**\nDeduplicated values, space se separate, ya `(empty)`.',
    examples: [
      { input: '3\n1 1 2', output: '1 2' },
      { input: '5\n1 1 2 3 3', output: '1 2 3' },
    ],
    constraints: ['0 <= n <= 300', 'The list is sorted ascending'],
    hints: [
      'Because the list is sorted, every duplicate of a value is directly adjacent to it.',
      'Walk the list once: if the current node\'s value equals the next node\'s value, skip the next node.',
      'Only advance the current pointer when the value actually changes.',
    ],
    approach:
      'Walk the list with one pointer. While the next node has the same value as the current node, bypass it (`curr.next = curr.next.next`). Only move `curr` forward once its value differs from what follows.',
    approachHi:
      'Ek pointer se list walk karo. Jab tak agla node current node ke barabar value rakhta hai, use bypass karo (`curr.next = curr.next.next`). `curr` ko sirf tab aage badhao jab uski value aage wali se alag ho jaaye.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Sortedness is what makes this a single-pointer, single-pass problem: because every occurrence of a value is guaranteed contiguous, checking only the immediate next neighbor (rather than searching the whole list, or needing a hash set) is enough to catch every duplicate — the same "adjacent equal values" property a plain array algorithm would need sortedness for too.',
    solutionExplanationHi:
      'Sorted hona hi ise ek-pointer, ek-pass problem banata hai: chunki har value ki har occurrence guaranteed contiguous hai, sirf immediate next neighbor check karna (poori list search karne ya hash set ki zaroorat ke bina) har duplicate pakadne ke liye kaafi hai — wahi "adjacent equal values" property jo ek plain array algorithm ko bhi sortedness ke liye chahiye hoti.',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function deleteDuplicates(head) {
  // return the head
  return head;
}

const out = [];
for (let p = deleteDuplicates(head); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def delete_duplicates(head):
    # return the head
    return head

out = []
p = delete_duplicates(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
let curr = head;
while (curr && curr.next) {
  if (curr.val === curr.next.val) curr.next = curr.next.next;
  else curr = curr.next;
}
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
curr = head
while curr and curr.next:
    if curr.val == curr.next.val:
        curr.next = curr.next.next
    else:
        curr = curr.next
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('3\n1 1 2', '1 2'),
      sample('5\n1 1 2 3 3', '1 2 3'),
      hidden('0\n', '(empty)'),
      hidden('1\n5', '5'),
      hidden('4\n1 1 1 1', '1'),
      hidden('6\n1 2 2 3 3 3', '1 2 3'),
    ],
  },

  {
    slug: 'remove-duplicates-from-sorted-list-ii',
    title: 'Remove Duplicates from Sorted List II',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Given a sorted linked list, delete every node that has a duplicate value, leaving only values that were unique to begin with.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted values\n\n**Output**\nThe remaining values, space-separated, or `(empty)`.',
    descriptionHi:
      'Ek sorted linked list di hai. Har us node ko delete karo jiska value duplicate hai, sirf wahi values bacha kar jo shuru se hi unique thi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted values\n\n**Output**\nBachi hui values, space se separate, ya `(empty)`.',
    examples: [
      { input: '5\n1 2 3 3 4', output: '1 2 4' },
      { input: '5\n1 1 1 2 3', output: '2 3' },
    ],
    constraints: ['0 <= n <= 300', 'The list is sorted ascending'],
    hints: [
      'Unlike the "keep one copy" version, an entire run of duplicates must be removed, including its first occurrence.',
      'A dummy node before the head is essential here, since the actual head itself might get fully removed.',
      'Detect a run by checking if the current node\'s value equals the next node\'s value; if so, skip the whole run before linking `prev.next` past it.',
    ],
    approach:
      'Use a dummy node and a `prev` pointer. For each node, check if it starts a run of duplicates (its value equals the next node\'s value). If so, advance a scanning pointer past the entire run and set `prev.next` to skip all of it; otherwise, `prev` advances normally to include this unique node.',
    approachHi:
      'Ek dummy node aur `prev` pointer use karo. Har node ke liye, check karo ki kya wo duplicates ka run shuru karta hai (uski value agle node ke barabar hai). Agar haan, to ek scanning pointer ko poore run se aage badhao aur `prev.next` ko set karo taaki wo sab skip ho jaaye; warna, `prev` normally aage badhta hai is unique node ko include karte hue.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The dummy node is not just a convenience here, it is necessary: the real head can itself be part of a duplicate run and get entirely removed (e.g. "1 1 1 2 3"), so there must be a stable anchor before it. Detecting a run\'s full extent requires scanning past every node with the same value before deciding whether to keep it, since a single node with the same value as the next is a mid-run node, not the whole story.',
    solutionExplanationHi:
      'Dummy node yahan sirf convenience nahi, zaroori hai: real head khud duplicate run ka hissa ho sakta hai aur poori tarah remove ho sakta hai (jaise "1 1 1 2 3"), isliye uske pehle ek stable anchor hona chahiye. Ek run ki poori extent detect karne ke liye, decide karne se pehle same value wale har node ko scan karna padta hai, kyunki agle jaisa hi value wala ek node sirf mid-run node hai, poori kahani nahi.',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function deleteDuplicates(head) {
  // return the new head
  return head;
}

const out = [];
for (let p = deleteDuplicates(head); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def delete_duplicates(head):
    # return the new head
    return head

out = []
p = delete_duplicates(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
const dummy = new Node(0);
dummy.next = head;
let prev = dummy, curr = head;
while (curr) {
  if (curr.next && curr.val === curr.next.val) {
    const val = curr.val;
    while (curr && curr.val === val) curr = curr.next;
    prev.next = curr;
  } else {
    prev = curr;
    curr = curr.next;
  }
}
const out = [];
for (let p = dummy.next; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
dummy = Node(0)
dummy.next = head
prev, curr = dummy, head
while curr:
    if curr.next and curr.val == curr.next.val:
        val = curr.val
        while curr and curr.val == val:
            curr = curr.next
        prev.next = curr
    else:
        prev = curr
        curr = curr.next
out = []
p = dummy.next
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('5\n1 2 3 3 4', '1 2 4'),
      sample('5\n1 1 1 2 3', '2 3'),
      hidden('0\n', '(empty)'),
      hidden('1\n1', '1'),
      hidden('4\n1 1 1 1', '(empty)'),
      hidden('6\n1 1 2 3 3 4', '2 4'),
    ],
  },

  {
    slug: 'reorder-list',
    title: 'Reorder List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Reorder the list from `L0, L1, ..., Ln` into `L0, Ln, L1, Ln-1, L2, Ln-2, ...`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nThe reordered values, space-separated.',
    descriptionHi:
      'List ko `L0, L1, ..., Ln` se `L0, Ln, L1, Ln-1, L2, Ln-2, ...` mein reorder karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nReordered values, space se separate.',
    examples: [
      { input: '4\n1 2 3 4', output: '1 4 2 3' },
      { input: '5\n1 2 3 4 5', output: '1 5 2 4 3' },
    ],
    constraints: ['0 <= n <= 5*10^4'],
    hints: [
      'This pattern alternates between the front half and the reversed back half.',
      'Split the list at the middle, reverse the second half, then merge the two halves by alternating nodes.',
      'Reusing the exact "find middle" and "reverse a list" techniques from earlier linked-list problems solves most of this.',
    ],
    approach:
      'Find the middle with fast/slow pointers, split the list in two, reverse the second half in place, then merge the two halves by alternately taking one node from the first half and one from the reversed second half.',
    approachHi:
      'Fast/slow pointers se middle dhoondo, list ko do mein split karo, doosre half ko in place reverse karo, phir dono halves ko alternately ek-ek node lekar merge karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The target order — front, back, next-front, next-back-from-the-end, ... — is exactly what interleaving a forward-order first half with a reverse-order second half produces, so this problem decomposes cleanly into three already-solved subproblems: find the middle (Middle of the Linked List), reverse a sublist (Reverse Linked List), and merge two lists node by node (a simpler cousin of Merge Two Sorted Lists, alternating unconditionally instead of comparing values).',
    solutionExplanationHi:
      'Target order — front, back, next-front, next-back-from-the-end, ... — exactly wahi hai jo forward-order pehle half ko reverse-order doosre half ke saath interleave karne se milta hai, isliye ye problem teen pehle-se-solved subproblems mein saaf tarah toot jaata hai: middle dhoondo (Middle of the Linked List), sublist reverse karo (Reverse Linked List), aur do lists ko node-by-node merge karo (Merge Two Sorted Lists ka ek simpler cousin, values compare karne ke bajaye unconditionally alternate karte hue).',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function reorderList(head) {
  // mutate the list in place
}

reorderList(head);
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def reorder_list(head):
    # mutate the list in place
    pass

reorder_list(head)
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
if (head && head.next) {
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let second = slow.next;
  slow.next = null;
  let prev = null;
  while (second) { const nxt = second.next; second.next = prev; prev = second; second = nxt; }
  let p1 = head, p2 = prev;
  while (p2) {
    const n1 = p1.next, n2 = p2.next;
    p1.next = p2;
    if (n1) p2.next = n1;
    p1 = n1;
    p2 = n2;
  }
}
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None
if head and head.next:
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    second = slow.next
    slow.next = None
    prev = None
    while second:
        nxt = second.next
        second.next = prev
        prev = second
        second = nxt
    p1, p2 = head, prev
    while p2:
        n1, n2 = p1.next, p2.next
        p1.next = p2
        if n1:
            p2.next = n1
        p1, p2 = n1, n2
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('4\n1 2 3 4', '1 4 2 3'),
      sample('5\n1 2 3 4 5', '1 5 2 4 3'),
      hidden('1\n1', '1'),
      hidden('2\n1 2', '1 2'),
      hidden('3\n1 2 3', '1 3 2'),
      hidden('6\n1 2 3 4 5 6', '1 6 2 5 3 4'),
    ],
  },

  {
    slug: 'design-linked-list',
    title: 'Design Linked List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Implement a singly linked list supporting `get index`, `addAtHead val`, `addAtTail val`, `addAtIndex index val`, and `deleteAtIndex index`.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: one operation each\n\n**Output**\nOne line for every `get` operation (the value, or `-1` if the index is invalid), in order.',
    descriptionHi:
      'Ek singly linked list implement karo jo `get index`, `addAtHead val`, `addAtTail val`, `addAtIndex index val`, aur `deleteAtIndex index` support kare.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: har ek operation\n\n**Output**\nHar `get` operation ke liye ek line (value, ya `-1` agar index invalid hai), order mein.',
    examples: [
      {
        input: '6\naddAtHead 1\naddAtTail 3\naddAtIndex 1 2\nget 1\ndeleteAtIndex 0\nget 0',
        output: '2\n2',
      },
    ],
    constraints: ['1 <= q <= 2000', '0 <= val <= 1000'],
    hints: [
      'Keep a dummy head node so inserting at index 0 (or into an empty list) needs no special case.',
      'Track the current size to validate indices cheaply for `get`, `addAtIndex`, and `deleteAtIndex`.',
      '`addAtIndex(size, val)` should behave exactly like `addAtTail`; walking to the node just before the target index is what every insert/delete operation has in common.',
    ],
    approach:
      'Maintain a dummy head and a running `size`. To act at a given index, walk `index` steps from the dummy to reach the node just before the target position, then read, insert after, or unlink the next node accordingly. Validate every index against the current `size` before acting.',
    approachHi:
      'Ek dummy head aur ek running `size` rakho. Kisi index par action lene ke liye, dummy se `index` steps chal kar target position se turant pehle wale node tak pahuncho, phir uske hisaab se padho, uske baad insert karo, ya agle node ko unlink karo. Action lene se pehle har index ko current `size` se validate karo.',
    timeComplexity: 'O(index) per operation',
    spaceComplexity: 'O(q)',
    solutionExplanation:
      'A dummy node before the real head means "the node just before index i" is well-defined even for i = 0 (it is the dummy itself), which is what lets every operation — get, insert, delete, at any index including the very front — share one uniform "walk to the predecessor, then act" routine instead of separate special-cased code paths for the head.',
    solutionExplanationHi:
      'Real head se pehle ek dummy node hona matlab "index i se pehle wala node" i = 0 ke liye bhi well-defined hai (wo khud dummy hai) — yahi cheez har operation ko — get, insert, delete, kisi bhi index par, sabse aage bhi — ek hi uniform "predecessor tak chalo, phir act karo" routine share karne deti hai, head ke liye alag special-cased code paths ki jagah.',
    starter: starter(
      `const q = num(0);

class Node { constructor(v) { this.val = v; this.next = null; } }
const dummy = new Node(-1);
let size = 0;
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  // your code here: handle "get", "addAtHead", "addAtTail", "addAtIndex", "deleteAtIndex"
}
console.log(out.join('\\n'));`,
      `q = num(0)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

dummy = Node(-1)
size = 0
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    # your code here: handle "get", "addAtHead", "addAtTail", "addAtIndex", "deleteAtIndex"

print("\\n".join(map(str, out)))`,
    ),
    solution: solution(
      `const q = num(0);
class Node { constructor(v) { this.val = v; this.next = null; } }
const dummy = new Node(-1);
let size = 0;
const out = [];
function nodeBefore(index) {
  let p = dummy;
  for (let i = 0; i < index; i++) p = p.next;
  return p;
}
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  if (op === 'get') {
    const idx = Number(parts[1]);
    if (idx < 0 || idx >= size) out.push(-1);
    else out.push(nodeBefore(idx).next.val);
  } else if (op === 'addAtHead') {
    const node = new Node(Number(parts[1]));
    node.next = dummy.next;
    dummy.next = node;
    size++;
  } else if (op === 'addAtTail') {
    const node = new Node(Number(parts[1]));
    const before = nodeBefore(size);
    node.next = before.next;
    before.next = node;
    size++;
  } else if (op === 'addAtIndex') {
    const idx = Number(parts[1]), val = Number(parts[2]);
    if (idx >= 0 && idx <= size) {
      const node = new Node(val);
      const before = nodeBefore(idx);
      node.next = before.next;
      before.next = node;
      size++;
    }
  } else if (op === 'deleteAtIndex') {
    const idx = Number(parts[1]);
    if (idx >= 0 && idx < size) {
      const before = nodeBefore(idx);
      before.next = before.next.next;
      size--;
    }
  }
}
console.log(out.join('\\n'));`,
      `q = num(0)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
dummy = Node(-1)
size = 0
out = []

def node_before(index):
    p = dummy
    for _ in range(index):
        p = p.next
    return p

for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    if op == "get":
        idx = int(parts[1])
        if idx < 0 or idx >= size:
            out.append(-1)
        else:
            out.append(node_before(idx).next.val)
    elif op == "addAtHead":
        node = Node(int(parts[1]))
        node.next = dummy.next
        dummy.next = node
        size += 1
    elif op == "addAtTail":
        node = Node(int(parts[1]))
        before = node_before(size)
        node.next = before.next
        before.next = node
        size += 1
    elif op == "addAtIndex":
        idx, val = int(parts[1]), int(parts[2])
        if 0 <= idx <= size:
            node = Node(val)
            before = node_before(idx)
            node.next = before.next
            before.next = node
            size += 1
    elif op == "deleteAtIndex":
        idx = int(parts[1])
        if 0 <= idx < size:
            before = node_before(idx)
            before.next = before.next.next
            size -= 1
print("\\n".join(map(str, out)))`,
    ),
    testCases: [
      sample('6\naddAtHead 1\naddAtTail 3\naddAtIndex 1 2\nget 1\ndeleteAtIndex 0\nget 0', '2\n2'),
      hidden('2\naddAtHead 7\nget 0', '7'),
      hidden('2\nget 0\naddAtHead 1', '-1'),
      hidden('4\naddAtTail 1\naddAtTail 2\naddAtTail 3\nget 2', '3'),
      hidden('3\naddAtHead 1\ndeleteAtIndex 0\nget 0', '-1'),
    ],
  },

  {
    slug: 'copy-list-with-random-pointer',
    title: 'Copy List with Random Pointer',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Each node has a `next` pointer and a `random` pointer (pointing to any node in the list, or none). Given such a list, produce a deep copy and report, for each node in the copy, its value and the value its `random` pointer targets.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `n` space-separated `random` targets (0-based index, or `-1` for none)\n\n**Output**\n`n` lines: `value randomValue` (or `value null`), for the copied list in order.',
    descriptionHi:
      'Har node ka ek `next` pointer aur ek `random` pointer hai (list ke kisi bhi node ki taraf, ya kisi ki taraf nahi). Aisi list ka ek deep copy banao aur copy ke har node ke liye uski value aur uske `random` pointer ki target value report karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `n` space-separated `random` targets (0-based index, ya `-1` kisi ke liye nahi)\n\n**Output**\n`n` lines: `value randomValue` (ya `value null`), copied list ke order mein.',
    examples: [
      {
        input: '5\n7 13 11 10 1\n-1 0 4 2 0',
        output: '7 null\n13 7\n11 1\n10 11\n1 7',
      },
    ],
    constraints: ['0 <= n <= 1000'],
    hints: [
      'A naive copy that sets the clone\'s random pointer to the ORIGINAL node it targets is wrong — it must point to the corresponding CLONE.',
      'A hash map from original node to its clone lets you look up "what is the clone of this original node" in O(1), for both next and random links.',
      'Two passes: first create all clones (storing the map), then a second pass wires up each clone\'s next and random using the map.',
    ],
    approach:
      'First pass: create a clone node for every original node, storing a map from original node to its clone. Second pass: for each original node, set its clone\'s `next` to `map.get(original.next)` and its clone\'s `random` to `map.get(original.random)` (both `null`-safe).',
    approachHi:
      'Pehla pass: har original node ke liye ek clone node banao, original se clone tak ka map store karte hue. Doosra pass: har original node ke liye, uske clone ka `next`, `map.get(original.next)` par set karo aur clone ka `random`, `map.get(original.random)` par (dono null-safe).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The whole difficulty is that a `random` pointer can point *forward* to a node not yet created during a single left-to-right pass — so cloning cannot be done correctly in one pass alone. Splitting it into "create every clone first" (so every original node has a known clone by the time any pointer needs to reference it) and then "wire up pointers using the map" is what makes both `next` and `random` resolvable regardless of which direction they point.',
    solutionExplanationHi:
      'Poori mushkil ye hai ki `random` pointer *aage* kisi aise node ki taraf point kar sakta hai jo ek single left-to-right pass mein abhi tak bana hi nahi — isliye cloning sirf ek pass mein sahi tarah nahi ho sakti. Ise "pehle har clone bana lo" (taaki kisi bhi pointer ko reference karne tak har original node ka clone pata ho) aur phir "map use karke pointers wire karo" mein todna hi `next` aur `random` dono ko resolve karne layak banata hai, chahe wo kisi bhi direction mein point karte hon.',
    starter: starter(
      `const n = num(0);
const vals = n ? nums(1) : [];
const rnd = n ? nums(2) : [];

class Node { constructor(v) { this.val = v; this.next = null; this.random = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
for (let i = 0; i < nodes.length; i++) if (rnd[i] !== -1) nodes[i].random = nodes[rnd[i]];
const head = nodes.length ? nodes[0] : null;

function copyRandomList(head) {
  // return the head of the deep copy
  return null;
}

const out = [];
for (let p = copyRandomList(head); p; p = p.next) out.push(p.val + ' ' + (p.random ? p.random.val : 'null'));
console.log(out.join('\\n'));`,
      `n = num(0)
vals = nums(1) if n else []
rnd = nums(2) if n else []

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
        self.random = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
for i in range(len(nodes)):
    if rnd[i] != -1:
        nodes[i].random = nodes[rnd[i]]
head = nodes[0] if nodes else None

def copy_random_list(head):
    # return the head of the deep copy
    return None

out = []
p = copy_random_list(head)
while p:
    out.append(f"{p.val} {p.random.val if p.random else 'null'}")
    p = p.next
print("\\n".join(out))`,
    ),
    solution: solution(
      `const n = num(0);
const vals = n ? nums(1) : [];
const rnd = n ? nums(2) : [];
class Node { constructor(v) { this.val = v; this.next = null; this.random = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
for (let i = 0; i < nodes.length; i++) if (rnd[i] !== -1) nodes[i].random = nodes[rnd[i]];
const head = nodes.length ? nodes[0] : null;
const map = new Map();
for (let p = head; p; p = p.next) map.set(p, new Node(p.val));
for (let p = head; p; p = p.next) {
  map.get(p).next = p.next ? map.get(p.next) : null;
  map.get(p).random = p.random ? map.get(p.random) : null;
}
const newHead = head ? map.get(head) : null;
const out = [];
for (let p = newHead; p; p = p.next) out.push(p.val + ' ' + (p.random ? p.random.val : 'null'));
console.log(out.join('\\n'));`,
      `n = num(0)
vals = nums(1) if n else []
rnd = nums(2) if n else []
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
        self.random = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
for i in range(len(nodes)):
    if rnd[i] != -1:
        nodes[i].random = nodes[rnd[i]]
head = nodes[0] if nodes else None
mapping = {}
p = head
while p:
    mapping[p] = Node(p.val)
    p = p.next
p = head
while p:
    mapping[p].next = mapping[p.next] if p.next else None
    mapping[p].random = mapping[p.random] if p.random else None
    p = p.next
new_head = mapping[head] if head else None
out = []
p = new_head
while p:
    out.append(f"{p.val} {p.random.val if p.random else 'null'}")
    p = p.next
print("\\n".join(out))`,
    ),
    testCases: [
      sample('5\n7 13 11 10 1\n-1 0 4 2 0', '7 null\n13 7\n11 1\n10 11\n1 7'),
      hidden('0\n\n', ''),
      hidden('1\n1\n-1', '1 null'),
      hidden('2\n1 2\n1 0', '1 2\n2 1'),
      hidden('3\n1 2 3\n-1 -1 -1', '1 null\n2 null\n3 null'),
    ],
  },

  {
    slug: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    category: 'Linked List',
    difficulty: 'HARD',
    description:
      'Merge `k` sorted linked lists into one sorted list.\n\n**Input**\n- Line 1: `k`\n- For each of the `k` lists: a line with its length, then a line with that many sorted values (empty line if length is 0)\n\n**Output**\nThe merged sorted values, space-separated, or `(empty)`.',
    descriptionHi:
      '`k` sorted linked lists ko ek sorted list mein merge karo.\n\n**Input**\n- Line 1: `k`\n- Har ek `k` lists ke liye: uski length wali ek line, phir utni hi sorted values wali ek line (length 0 ho to khaali line)\n\n**Output**\nMerged sorted values, space se separate, ya `(empty)`.',
    examples: [
      { input: '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', output: '1 1 2 3 4 4 5 6' },
      { input: '0', output: '(empty)' },
    ],
    constraints: ['0 <= k <= 10^4', 'Total nodes across all lists <= 10^4'],
    hints: [
      'Merging lists two at a time, sequentially, costs O(k * total_n) in the worst case.',
      'A min-heap holding the current front node of every list answers "which list has the smallest next value" in O(log k) instead of O(k).',
      'Repeatedly pop the minimum, append it to the result, and push its successor from the same list (if any) back into the heap.',
    ],
    approach:
      'Min-heap (priority queue) keyed by node value, seeded with the head of every non-empty list. Repeatedly pop the smallest node, append its value to the output, and if it has a `next`, push that onto the heap. Continue until the heap is empty.',
    approachHi:
      'Node value se keyed ek min-heap (priority queue), har non-empty list ke head se seed ki hui. Baar-baar sabse chhota node pop karo, uski value output mein daalo, aur agar uska `next` hai to use heap mein push kar do. Jab tak heap khaali na ho, chalao.',
    timeComplexity: 'O(N log k) where N is the total number of nodes',
    spaceComplexity: 'O(k) for the heap',
    solutionExplanation:
      'Merging two lists at a time in sequence means the first list\'s nodes potentially get re-compared against every subsequent list, one merge at a time — a heap instead directly maintains "the current smallest candidate across all k lists simultaneously" at all times, so each of the N total nodes is popped and pushed exactly once, at O(log k) each, rather than being touched roughly k times across k sequential merges.',
    solutionExplanationHi:
      'Do lists ko sequence mein baar-baar merge karne se, pehli list ke nodes har agli list ke against dobara compare ho sakte hain, ek-ek merge karke — heap iske bajaye hamesha "abhi saari k lists mein sabse chhota candidate" seedha maintain karta hai, isliye total N nodes mein se har ek exactly ek baar pop aur ek baar push hota hai, har baar O(log k) mein, na ki k sequential merges mein lagbhag k baar touch hote hue.',
    starter: starter(
      `const k = num(0);
class Node { constructor(v) { this.val = v; this.next = null; } }
const heads = [];
let lineIdx = 1;
for (let i = 0; i < k; i++) {
  const len = num(lineIdx);
  const vals = len ? nums(lineIdx + 1) : [];
  lineIdx += 2;
  const nodes = vals.map((v) => new Node(v));
  for (let j = 0; j < nodes.length - 1; j++) nodes[j].next = nodes[j + 1];
  heads.push(nodes.length ? nodes[0] : null);
}

function mergeKLists(lists) {
  // return the head of the merged list
  return null;
}

const out = [];
for (let p = mergeKLists(heads); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `k = num(0)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

heads = []
line_idx = 1
for i in range(k):
    length = num(line_idx)
    vals = nums(line_idx + 1) if length else []
    line_idx += 2
    nodes = [Node(v) for v in vals]
    for j in range(len(nodes) - 1):
        nodes[j].next = nodes[j + 1]
    heads.append(nodes[0] if nodes else None)

def merge_k_lists(lists):
    # return the head of the merged list
    return None

out = []
p = merge_k_lists(heads)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const k = num(0);
class Node { constructor(v) { this.val = v; this.next = null; } }
const heads = [];
let lineIdx = 1;
for (let i = 0; i < k; i++) {
  const len = num(lineIdx);
  const vals = len ? nums(lineIdx + 1) : [];
  lineIdx += 2;
  const nodes = vals.map((v) => new Node(v));
  for (let j = 0; j < nodes.length - 1; j++) nodes[j].next = nodes[j + 1];
  heads.push(nodes.length ? nodes[0] : null);
}
// Simple array-backed min-heap keyed by node.val.
class MinHeap {
  constructor() { this.a = []; }
  push(node) {
    this.a.push(node);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p].val <= this.a[i].val) break;
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
        if (l < this.a.length && this.a[l].val < this.a[smallest].val) smallest = l;
        if (r < this.a.length && this.a[r].val < this.a[smallest].val) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
  get size() { return this.a.length; }
}
const heap = new MinHeap();
for (const h of heads) if (h) heap.push(h);
const dummy = new Node(0);
let curr = dummy;
while (heap.size) {
  const node = heap.pop();
  curr.next = node;
  curr = curr.next;
  if (node.next) heap.push(node.next);
}
const out = [];
for (let p = dummy.next; p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `import heapq
k = num(0)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

heads = []
line_idx = 1
for i in range(k):
    length = num(line_idx)
    vals = nums(line_idx + 1) if length else []
    line_idx += 2
    nodes = [Node(v) for v in vals]
    for j in range(len(nodes) - 1):
        nodes[j].next = nodes[j + 1]
    heads.append(nodes[0] if nodes else None)

heap = []
counter = 0
for h in heads:
    if h:
        heapq.heappush(heap, (h.val, counter, h))
        counter += 1
dummy = Node(0)
curr = dummy
while heap:
    _, _, node = heapq.heappop(heap)
    curr.next = node
    curr = curr.next
    if node.next:
        heapq.heappush(heap, (node.next.val, counter, node.next))
        counter += 1
out = []
p = dummy.next
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', '1 1 2 3 4 4 5 6'),
      sample('0', '(empty)'),
      hidden('1\n0\n', '(empty)'),
      hidden('2\n1\n1\n1\n0', '0 1'),
      hidden('3\n0\n\n0\n\n2\n1 2', '1 2'),
      hidden('2\n2\n1 1\n2\n1 1', '1 1 1 1'),
    ],
  },

  {
    slug: 'sort-list',
    title: 'Sort List',
    category: 'Linked List',
    difficulty: 'MEDIUM',
    description:
      'Sort a linked list in ascending order using merge sort (O(n log n) time).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nThe sorted values, space-separated, or `(empty)`.',
    descriptionHi:
      'Merge sort use karke ek linked list ko ascending order mein sort karo (O(n log n) time).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nSorted values, space se separate, ya `(empty)`.',
    examples: [
      { input: '4\n4 2 1 3', output: '1 2 3 4' },
      { input: '5\n-1 5 3 4 0', output: '-1 0 3 4 5' },
    ],
    constraints: ['0 <= n <= 5*10^4'],
    hints: [
      'Quicksort-style approaches are awkward on a linked list since random access to a pivot is not O(1).',
      'Merge sort fits linked lists naturally: split at the middle, recursively sort each half, then merge two sorted lists.',
      'The middle-finding and merging steps are exactly the same techniques used in Middle of the Linked List and Merge Two Sorted Lists.',
    ],
    approach:
      'Recursive merge sort. Find the middle with fast/slow pointers and split the list into two halves, recursively sort each half, then merge the two sorted halves (identical to Merge Two Sorted Lists). The base case is a list of 0 or 1 nodes, which is already sorted.',
    approachHi:
      'Recursive merge sort. Fast/slow pointers se middle dhoondo aur list ko do halves mein split karo, har half ko recursively sort karo, phir dono sorted halves ko merge karo (bilkul Merge Two Sorted Lists jaisa). Base case ek 0 ya 1 node ki list hai, jo pehle se sorted hai.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n) recursion stack',
    solutionExplanation:
      'Linked lists lack O(1) random access, which is exactly the assumption quicksort-style partitioning around a pivot relies on — merge sort, by contrast, only ever needs sequential access (splitting at the middle via a two-pointer walk, merging two lists front-to-back), which is precisely what a linked list supports well. This is why merge sort, not quicksort, is the standard answer for sorting a linked list in the optimal O(n log n).',
    solutionExplanationHi:
      'Linked lists mein O(1) random access nahi hoti, jo exactly wahi assumption hai jis par quicksort-style pivot-based partitioning depend karti hai — merge sort iske ulat sirf sequential access maangta hai (middle se split karna two-pointer walk se, do lists ko front-to-back merge karna), jo linked list bahut acche se support karti hai. Yahi wajah hai ki linked list ko optimal O(n log n) mein sort karne ke liye standard answer merge sort hai, quicksort nahi.',
    starter: starter(
      `const vals = nums(1);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;

function sortList(head) {
  // return the sorted head
  return head;
}

const out = [];
for (let p = sortList(head); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def sort_list(head):
    # return the sorted head
    return head

out = []
p = sort_list(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    solution: solution(
      `const vals = nums(1);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes.length ? nodes[0] : null;
function merge(a, b) {
  const dummy = new Node(0);
  let curr = dummy;
  while (a && b) { if (a.val <= b.val) { curr.next = a; a = a.next; } else { curr.next = b; b = b.next; } curr = curr.next; }
  curr.next = a || b;
  return dummy.next;
}
function sortList(h) {
  if (!h || !h.next) return h;
  let slow = h, fast = h.next;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  const mid = slow.next;
  slow.next = null;
  return merge(sortList(h), sortList(mid));
}
const out = [];
for (let p = sortList(head); p; p = p.next) out.push(p.val);
console.log(out.length ? out.join(' ') : '(empty)');`,
      `vals = nums(1)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0] if nodes else None

def merge(a, b):
    dummy = Node(0)
    curr = dummy
    while a and b:
        if a.val <= b.val:
            curr.next = a
            a = a.next
        else:
            curr.next = b
            b = b.next
        curr = curr.next
    curr.next = a or b
    return dummy.next

def sort_list(h):
    if not h or not h.next:
        return h
    slow, fast = h, h.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    return merge(sort_list(h), sort_list(mid))

out = []
p = sort_list(head)
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)) if out else "(empty)")`,
    ),
    testCases: [
      sample('4\n4 2 1 3', '1 2 3 4'),
      sample('5\n-1 5 3 4 0', '-1 0 3 4 5'),
      hidden('0\n', '(empty)'),
      hidden('1\n5', '5'),
      hidden('2\n2 1', '1 2'),
      hidden('6\n6 5 4 3 2 1', '1 2 3 4 5 6'),
    ],
  },

  {
    slug: 'delete-node-in-a-linked-list',
    title: 'Delete Node in a Linked List',
    category: 'Linked List',
    difficulty: 'EASY',
    description:
      'You are given direct access only to a node to be deleted (not the head of the list), and it is guaranteed not to be the last node. Delete it from the list.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `idx` — the 0-based index of the node to delete (never the last index)\n\n**Output**\nThe remaining values, space-separated.',
    descriptionHi:
      'Aapko sirf ek node tak seedha access diya gaya hai jise delete karna hai (list ke head tak nahi), aur guarantee hai ki wo aakhri node nahi hai. Use list se delete karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n- Line 3: `idx` — delete karne wale node ka 0-based index (kabhi aakhri index nahi)\n\n**Output**\nBachi hui values, space se separate.',
    examples: [
      { input: '4\n4 5 1 9\n1', output: '4 1 9' },
      { input: '4\n4 5 1 9\n2', output: '4 5 9' },
    ],
    constraints: ['2 <= n <= 1000', '0 <= idx < n - 1'],
    hints: [
      'Without a reference to the head or the previous node, you cannot literally unlink this node the usual way.',
      'You CAN overwrite this node\'s own value and next pointer, though.',
      'Copy the next node\'s value into this node, then point this node past the next node — effectively deleting "the next node" instead, which has the identical visible effect.',
    ],
    approach:
      'Since only the target node itself is reachable (not its predecessor), copy the value of `node.next` into `node`, then set `node.next = node.next.next`. This does not remove the target node object, but it removes its *value* from the sequence by overwriting it with the next value and unlinking what was actually the next node.',
    approachHi:
      'Chunki sirf target node hi reachable hai (uska predecessor nahi), `node.next` ki value ko `node` mein copy karo, phir `node.next = node.next.next` set karo. Ye target node object ko hata nahi deta, par uski *value* ko sequence se hata deta hai — agli value se overwrite karke aur asal mein agle node ko unlink karke.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The trick reframes "delete this node" as "make this node disappear by becoming indistinguishable from its neighbor, then delete that neighbor instead" — copying the next node\'s value in means this node now looks, value-wise, exactly like the node that comes after it, and then physically removing the (now-redundant) next node is something that CAN be done with only a `next` pointer, no predecessor required. This trick only works because the node is guaranteed not to be the last one — the last node has no `next` to borrow from.',
    solutionExplanationHi:
      'Ye trick "is node ko delete karo" ko "is node ko apne neighbor jaisa indistinguishable bana do, phir us neighbor ko delete kar do" mein reframe karta hai — agle node ki value copy karne se ye node value ke hisaab se bilkul waisa ban jaata hai jaisa uske baad wala node tha, aur phir (ab-redundant) agle node ko physically hataana sirf `next` pointer se ho sakta hai, predecessor ki zaroorat nahi. Ye trick sirf isliye kaam karta hai kyunki guarantee hai ki ye node aakhri nahi hai — aakhri node ke paas udhaar lene ke liye koi `next` nahi hota.',
    starter: starter(
      `const vals = nums(1);
const idx = num(2);

class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes[0];
const target = nodes[idx];

function deleteNode(node) {
  // mutate node in place; you do NOT have access to head here
}

deleteNode(target);
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `vals = nums(1)
idx = num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.next = None

nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0]
target = nodes[idx]

def delete_node(node):
    # mutate node in place; you do NOT have access to head here
    pass

delete_node(target)
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    solution: solution(
      `const vals = nums(1);
const idx = num(2);
class Node { constructor(v) { this.val = v; this.next = null; } }
const nodes = vals.map((v) => new Node(v));
for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
const head = nodes[0];
const target = nodes[idx];
target.val = target.next.val;
target.next = target.next.next;
const out = [];
for (let p = head; p; p = p.next) out.push(p.val);
console.log(out.join(' '));`,
      `vals = nums(1)
idx = num(2)
class Node:
    def __init__(self, v):
        self.val = v
        self.next = None
nodes = [Node(v) for v in vals]
for i in range(len(nodes) - 1):
    nodes[i].next = nodes[i + 1]
head = nodes[0]
target = nodes[idx]
target.val = target.next.val
target.next = target.next.next
out = []
p = head
while p:
    out.append(p.val)
    p = p.next
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('4\n4 5 1 9\n1', '4 1 9'),
      sample('4\n4 5 1 9\n2', '4 5 9'),
      hidden('2\n1 2\n0', '2'),
      hidden('3\n1 2 3\n0', '2 3'),
      hidden('5\n10 20 30 40 50\n3', '10 20 30 50'),
      hidden('3\n1 2 3\n1', '1 3'),
    ],
  },
];
