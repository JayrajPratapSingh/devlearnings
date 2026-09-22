import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * BST — expansion batch, part 1 of 2. Rounds out the category beyond the
 * original one (Validate Binary Search Tree) with the core BST toolkit:
 * insert/search/delete, kth smallest, LCA exploiting ordering, building a
 * balanced BST from sorted data, and simple aggregate queries. Same
 * level-order `null`-marked flat tree encoding as the Trees category.
 */
export const dsaExtraBst: SeedProblem[] = [
  {
    slug: 'insert-into-a-bst',
    title: 'Insert into a Binary Search Tree',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Insert a value into a binary search tree, keeping the BST property. Print the resulting tree.\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: the value to insert\n\n**Output**\nThe resulting tree, level order with `null` for missing children.',
    descriptionHi:
      'Ek binary search tree mein ek value insert karo, BST property maintain karte hue. Resulting tree print karo.\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: insert karne wali value\n\n**Output**\nResulting tree, level order mein `null` ke saath.',
    examples: [
      { input: '4 2 7 1 3\n5', output: '4 2 7 1 3 5' },
      { input: '\n5', output: '5' },
    ],
    constraints: ['0 <= nodes <= 10^4', 'All values distinct, the value to insert is not already present'],
    hints: [
      'A BST\'s ordering property tells you exactly which way to go at every node: smaller goes left, bigger goes right.',
      'Walk down from the root following that rule until you fall off the tree (reach a null child).',
      'The new value always becomes a new leaf — inserting never needs to rearrange any existing nodes.',
    ],
    approach:
      'Walk from the root: if the value is less than the current node, go left; if greater, go right. When a `null` spot is reached, attach a new node with the value there and return the (possibly newly created) root.',
    approachHi:
      'Root se walk karo: agar value current node se chhoti hai, left jao; badi hai to right. Jab `null` spot mile, wahan value wala naya node attach karo aur root return karo (agar naya bana ho to wahi).',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'Because every node in a BST already encodes "everything smaller is to my left, everything bigger is to my right", following that comparison at each step traces the exact unique path the new value must belong on — there is never any ambiguity or backtracking needed. The new value always lands as a fresh leaf because the walk only ever stops at a missing child, never displacing an existing node.',
    solutionExplanationHi:
      'Chunki BST ka har node pehle se hi encode karta hai "jo bhi chhota hai wo mere left mein, jo bada hai wo right mein", har step par wahi comparison follow karna naye value ka exact unique path trace kar deta hai — kabhi koi ambiguity ya backtrack ki zaroorat nahi. Naya value hamesha ek fresh leaf ki tarah lagta hai kyunki walk sirf ek missing child par hi rukta hai, kabhi kisi existing node ko displace nahi karta.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const val = num(1);

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

function serialize(root) {
  if (!root) return '(empty)';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('null'); continue; }
    out.push(String(node.val));
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}

function insertIntoBST(root, val) {
  // return the (possibly new) root
  return root;
}

console.log(serialize(insertIntoBST(build(tokens), val)));`,
      `from collections import deque
tokens = line(0).split()
val = num(1)

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

def serialize(root):
    if not root:
        return "(empty)"
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if not node:
            out.append("null")
            continue
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)

def insert_into_bst(root, val):
    # return the (possibly new) root
    return root

print(serialize(insert_into_bst(build(tokens), val)))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const val = num(1);
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
function serialize(root) {
  if (!root) return '(empty)';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('null'); continue; }
    out.push(String(node.val));
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}
function insertIntoBST(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}
console.log(serialize(insertIntoBST(build(tokens), val)));`,
      `from collections import deque
tokens = line(0).split()
val = num(1)

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

def serialize(root):
    if not root:
        return "(empty)"
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if not node:
            out.append("null")
            continue
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)

def insert_into_bst(root, val):
    if not root:
        return Node(val)
    if val < root.val:
        root.left = insert_into_bst(root.left, val)
    else:
        root.right = insert_into_bst(root.right, val)
    return root

print(serialize(insert_into_bst(build(tokens), val)))`,
    ),
    testCases: [
      sample('4 2 7 1 3\n5', '4 2 7 1 3 5'),
      sample('\n5', '5'),
      hidden('1\n0', '1 0'),
      hidden('1\n2', '1 null 2'),
      hidden('4 2 7 1 3 null null\n6', '4 2 7 1 3 6'),
      hidden('2 1 4 null null 3\n5', '2 1 4 null null 3 5'),
    ],
  },

  {
    slug: 'search-in-a-bst',
    title: 'Search in a Binary Search Tree',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Find the node with the given value and return the subtree rooted at it.\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: the value to find\n\n**Output**\nThe subtree rooted at the found node, level order with `null`. `(empty)` if not found.',
    descriptionHi:
      'Di gayi value wala node dhoondo aur uspar rooted subtree return karo.\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: dhoondhni wali value\n\n**Output**\nMile hue node par rooted subtree, level order mein `null` ke saath. Na milne par `(empty)`.',
    examples: [
      { input: '4 2 7 1 3\n2', output: '2 1 3' },
      { input: '4 2 7 1 3\n5', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 5000'],
    hints: [
      'Use the BST ordering to eliminate half the remaining tree at every step, just like binary search on a sorted array.',
      'If the target is less than the current node, the answer (if it exists) can only be in the left subtree.',
      'If the target equals the current node, that node itself (and everything below it) is the answer.',
    ],
    approach:
      'Walk from the root, comparing the target to the current node: if equal, that node is the answer; if smaller, recurse left; if bigger, recurse right. Reaching `null` means the value is not present.',
    approachHi:
      'Root se walk karo, target ko current node se compare karo: barabar hai to wahi answer hai; chhota hai to left mein recurse karo; bada hai to right mein. `null` tak pahunchna matlab value present nahi hai.',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'This is exactly the same halving idea as binary search on a sorted array, just expressed over tree structure instead of array indices: the BST property guarantees that a mismatch tells you unambiguously which single subtree could still contain the target, so the other entire subtree is safely discarded from consideration in one comparison, without ever needing to look at it.',
    solutionExplanationHi:
      'Ye exactly sorted array par binary search wala hi halving idea hai, bas array indices ke bajaye tree structure par express kiya gaya: BST property guarantee karti hai ki ek mismatch unambiguously bata deta hai ki sirf kaunsi ek subtree mein target ho sakta hai, isliye doosri poori subtree ek hi comparison mein safely discard ho jaati hai, use kabhi dekhne ki zaroorat nahi.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const val = num(1);

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

function serialize(root) {
  if (!root) return '(empty)';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('null'); continue; }
    out.push(String(node.val));
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}

function searchBST(root, val) {
  // return the found node, or null
  return null;
}

console.log(serialize(searchBST(build(tokens), val)));`,
      `from collections import deque
tokens = line(0).split()
val = num(1)

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

def serialize(root):
    if not root:
        return "(empty)"
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if not node:
            out.append("null")
            continue
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)

def search_bst(root, val):
    # return the found node, or None
    return None

print(serialize(search_bst(build(tokens), val)))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const val = num(1);
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
function serialize(root) {
  if (!root) return '(empty)';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('null'); continue; }
    out.push(String(node.val));
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}
function searchBST(root, val) {
  if (!root || root.val === val) return root;
  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}
console.log(serialize(searchBST(build(tokens), val)));`,
      `from collections import deque
tokens = line(0).split()
val = num(1)

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

def serialize(root):
    if not root:
        return "(empty)"
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if not node:
            out.append("null")
            continue
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)

def search_bst(root, val):
    if not root or root.val == val:
        return root
    return search_bst(root.left, val) if val < root.val else search_bst(root.right, val)

print(serialize(search_bst(build(tokens), val)))`,
    ),
    testCases: [
      sample('4 2 7 1 3\n2', '2 1 3'),
      sample('4 2 7 1 3\n5', '(empty)'),
      hidden('1\n1', '1'),
      hidden('\n1', '(empty)'),
      hidden('4 2 7 1 3\n4', '4 2 7 1 3'),
      hidden('4 2 7 1 3\n1', '1'),
    ],
  },

  {
    slug: 'kth-smallest-element-in-bst',
    title: 'Kth Smallest Element in a BST',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Find the `k`-th smallest value in the BST (1-indexed).\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: `k`\n\n**Output**\nThe `k`-th smallest value.',
    descriptionHi:
      'BST mein `k`-vaan sabse chhota value dhoondo (1-indexed).\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: `k`\n\n**Output**\n`k`-vaan sabse chhota value.',
    examples: [
      { input: '3 1 4 null 2\n1', output: '1' },
      { input: '5 3 6 2 4 null null 1\n3', output: '3' },
    ],
    constraints: ['1 <= nodes <= 10^4', '1 <= k <= nodes'],
    hints: [
      'An in-order traversal of a BST visits values in strictly increasing order — that alone essentially solves the problem.',
      'You do not need to build the entire sorted sequence: stop the in-order walk the instant you reach the k-th value visited.',
      'An iterative in-order traversal with an explicit stack can stop early cleanly, without needing to search a fully materialized list.',
    ],
    approach:
      'In-order traversal (left, node, right), counting nodes visited. Stop and report the value the moment the count reaches `k` — no need to visit the rest of the tree.',
    approachHi:
      'In-order traversal (left, node, right), visited nodes count karte hue. Count `k` tak pahunchte hi value report karke ruk jao — baaki tree visit karne ki zaroorat nahi.',
    timeComplexity: 'O(h + k)',
    spaceComplexity: 'O(h) for the traversal stack/recursion',
    solutionExplanation:
      'In-order traversal visiting left-node-right is precisely what produces a BST\'s values in sorted order, since every value in a node\'s left subtree is smaller and every value in its right subtree is larger — so the k-th value visited by this traversal IS, by construction, the k-th smallest overall. Stopping the moment the count reaches k (rather than building the full sorted list first) keeps the cost proportional to how far into the tree the answer actually is, not the size of the whole tree.',
    solutionExplanationHi:
      'Left-node-right in-order traversal exactly wahi cheez produce karta hai jo BST ke values ko sorted order mein deta hai, kyunki kisi bhi node ke left subtree ki har value chhoti hai aur right subtree ki har value badi — isliye is traversal se dekha gaya k-vaan value, construction se hi, overall k-vaan sabse chhota hai. Count k tak pahunchte hi rukna (poori sorted list pehle banane ke bajaye) cost ko utna hi rakhta hai jitna tree mein andar answer actually hai, poori tree ke size jitna nahi.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const k = num(1);

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

function kthSmallest(root, k) {
  // your code here
}

console.log(kthSmallest(build(tokens), k));`,
      `from collections import deque
tokens = line(0).split()
k = num(1)

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

def kth_smallest(root, k):
    # your code here
    pass

print(kth_smallest(build(tokens), k))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const k = num(1);
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
function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  let count = 0;
  while (stack.length || node) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    count++;
    if (count === k) return node.val;
    node = node.right;
  }
  return -1;
}
console.log(kthSmallest(build(tokens), k));`,
      `from collections import deque
tokens = line(0).split()
k = num(1)

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

def kth_smallest(root, k):
    stack = []
    node = root
    count = 0
    while stack or node:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        count += 1
        if count == k:
            return node.val
        node = node.right
    return -1

print(kth_smallest(build(tokens), k))`,
    ),
    testCases: [
      sample('3 1 4 null 2\n1', '1'),
      sample('5 3 6 2 4 null null 1\n3', '3'),
      hidden('1\n1', '1'),
      hidden('5 3 6 2 4 null null 1\n6', '6'),
      hidden('5 3 6 2 4 null null 1\n1', '1'),
      hidden('2 1\n2', '2'),
    ],
  },

  {
    slug: 'lowest-common-ancestor-bst',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Given a BST and two distinct values `p` and `q` both present in it, find the value of their lowest common ancestor, using the BST ordering property (no need for a general tree search).\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: `p`\n- Line 3: `q`\n\n**Output**\nThe value of the lowest common ancestor.',
    descriptionHi:
      'Ek BST aur do distinct values `p` aur `q` diye hain (dono usmein hain). BST ki ordering property use karke unka lowest common ancestor dhoondo (general tree search ki zaroorat nahi).\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: `p`\n- Line 3: `q`\n\n**Output**\nLowest common ancestor ki value.',
    examples: [
      { input: '6 2 8 0 4 7 9 null null 3 5\n2\n8', output: '6' },
      { input: '6 2 8 0 4 7 9 null null 3 5\n2\n4', output: '2' },
    ],
    constraints: ['2 <= nodes <= 10^5', 'p and q distinct and both present'],
    hints: [
      'Unlike the general-tree LCA, the BST\'s ordering tells you which direction to search without exploring both children.',
      'If both p and q are smaller than the current node, the LCA must be in the left subtree.',
      'If both are larger, it must be in the right subtree. Otherwise (one on each side, or one equals the current node), the current node IS the LCA.',
    ],
    approach:
      'Walk from the root. If both `p` and `q` are less than the current value, move left. If both are greater, move right. Otherwise (the values straddle the current node, or the current node equals one of them), the current node is the LCA — stop and return it.',
    approachHi:
      'Root se walk karo. Agar `p` aur `q` dono current value se chhote hain, left jao. Dono bade hain to right jao. Warna (values current node ke dono taraf hain, ya current node unme se ek ke barabar hai), current node hi LCA hai — ruk kar use return karo.',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(1) iteratively, O(h) if written recursively',
    solutionExplanation:
      'The general binary tree LCA algorithm works here too, but the BST ordering lets you skip searching both children entirely: at any node, if p and q are on the same side (both smaller or both larger), the other entire subtree can be safely ignored, since neither p nor q lives there. The search only ever needs to "split" once — the first node where p and q are not both on the same side is necessarily the point where their paths from the root diverge, which is exactly the LCA.',
    solutionExplanationHi:
      'General binary tree wala LCA algorithm yahan bhi kaam karega, par BST ordering dono children search karne se poori tarah bacha leta hai: kisi bhi node par, agar p aur q dono same side par hain (dono chhote ya dono bade), to doosri poori subtree safely ignore ho sakti hai, kyunki na p na q wahan hai. Search ko sirf ek baar "split" hona hai — jo pehla node hai jahan p aur q same side par nahi hain, wahi zaroori taur par wo point hai jahan root se unke paths diverge karte hain — yahi exactly LCA hai.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const p = num(1), q = num(2);

function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const qu = [root];
  let i = 1;
  while (qu.length && i < tokens.length) {
    const node = qu.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; qu.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; qu.push(node.right); }
    i++;
  }
  return root;
}

function lowestCommonAncestor(root, p, q) {
  // return the LCA node
  return null;
}

console.log(lowestCommonAncestor(build(tokens), p, q).val);`,
      `from collections import deque
tokens = line(0).split()
p, q = num(1), num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    qu, i = deque([root]), 1
    while qu and i < len(tokens):
        node = qu.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); qu.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); qu.append(node.right)
        i += 1
    return root

def lowest_common_ancestor(root, p, q):
    # return the LCA node
    return None

print(lowest_common_ancestor(build(tokens), p, q).val)`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const p = num(1), q = num(2);
function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null };
  const qu = [root];
  let i = 1;
  while (qu.length && i < tokens.length) {
    const node = qu.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null }; qu.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null }; qu.push(node.right); }
    i++;
  }
  return root;
}
function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p < node.val && q < node.val) node = node.left;
    else if (p > node.val && q > node.val) node = node.right;
    else return node;
  }
  return null;
}
console.log(lowestCommonAncestor(build(tokens), p, q).val);`,
      `from collections import deque
tokens = line(0).split()
p, q = num(1), num(2)

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None

def build(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    qu, i = deque([root]), 1
    while qu and i < len(tokens):
        node = qu.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = Node(int(tokens[i])); qu.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i])); qu.append(node.right)
        i += 1
    return root

def lowest_common_ancestor(root, p, q):
    node = root
    while node:
        if p < node.val and q < node.val:
            node = node.left
        elif p > node.val and q > node.val:
            node = node.right
        else:
            return node
    return None

print(lowest_common_ancestor(build(tokens), p, q).val)`,
    ),
    testCases: [
      sample('6 2 8 0 4 7 9 null null 3 5\n2\n8', '6'),
      sample('6 2 8 0 4 7 9 null null 3 5\n2\n4', '2'),
      hidden('2 1\n1\n2', '2'),
      hidden('5 3 8 1 4\n1\n4', '3'),
      hidden('5 3 8 1 4\n3\n8', '5'),
    ],
  },

  {
    slug: 'convert-sorted-array-to-bst',
    title: 'Convert Sorted Array to Binary Search Tree',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Given an array sorted ascending, build a height-balanced BST from it. When there are two possible middle elements, use the LEFT (lower-index) one as the root of that subtree.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\nThe BST, level order with `null` for missing children.',
    descriptionHi:
      'Ek ascending sorted array diya hai. Usse ek height-balanced BST banao. Jab do possible middle elements hon, subtree ke root ke liye LEFT (chhote-index) wala use karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\nBST, level order mein `null` ke saath.',
    examples: [
      { input: '3\n1 2 3', output: '2 1 3' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['0 <= n <= 10^4', 'The array is sorted ascending with distinct values'],
    hints: [
      'The middle element of a sorted range is a natural choice for the subtree\'s root: it guarantees roughly equal amounts of data on each side.',
      'Recursively build the left subtree from the left half of the range, and the right subtree from the right half.',
      'For an even-length range with two possible middles, consistently picking the same one (the lower index, per this problem) is what makes the output deterministic.',
    ],
    approach:
      'Recursive: for a given range `[lo, hi]` of the sorted array, pick the middle index `mid = lo + floor((hi - lo) / 2)` as the current subtree\'s root, then recursively build the left subtree from `[lo, mid-1]` and the right subtree from `[mid+1, hi]`.',
    approachHi:
      'Recursive: sorted array ki range `[lo, hi]` ke liye, middle index `mid = lo + floor((hi - lo) / 2)` ko current subtree ka root banao, phir `[lo, mid-1]` se left subtree aur `[mid+1, hi]` se right subtree recursively banao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(log n) recursion depth for a balanced result',
    solutionExplanation:
      'Choosing the middle element as root at every level is what keeps the tree height-balanced: each recursive call splits its range into two halves of nearly equal size, so the resulting tree\'s height grows logarithmically with the array size rather than linearly (which is what would happen if, say, the first element were always chosen as root, degenerating into a plain sorted chain). The floor-division convention for the middle of an even-length range is what makes the specific tree shape deterministic and reproducible.',
    solutionExplanationHi:
      'Har level par middle element ko root chunna hi tree ko height-balanced rakhta hai: har recursive call apni range ko lagbhag barabar size ke do halves mein todta hai, isliye resulting tree ki height array size ke saath logarithmically badhti hai, linearly nahi (jo tab hota jab, maano, hamesha first element root chuna jaata, aur ek plain sorted chain bann jaati). Even-length range ke middle ke liye floor-division convention hi specific tree shape ko deterministic aur reproducible banata hai.',
    starter: starter(
      `const arr = nums(1);

function serialize(root) {
  if (!root) return '(empty)';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('null'); continue; }
    out.push(String(node.val));
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}

function sortedArrayToBST(arr) {
  // return the root node ({val, left, right}) or null
  return null;
}

console.log(serialize(sortedArrayToBST(arr)));`,
      `arr = nums(1)


def serialize(root):
    if not root:
        return "(empty)"
    from collections import deque
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if not node:
            out.append("null")
            continue
        out.append(str(node["val"]))
        q.append(node["left"])
        q.append(node["right"])
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)


def sorted_array_to_bst(arr):
    # return the root node (a dict with val/left/right) or None
    return None


print(serialize(sorted_array_to_bst(arr)))`,
    ),
    solution: solution(
      `const arr = nums(1);
function build(lo, hi) {
  if (lo > hi) return null;
  const mid = lo + Math.floor((hi - lo) / 2);
  return { val: arr[mid], left: build(lo, mid - 1), right: build(mid + 1, hi) };
}
const root = arr.length ? build(0, arr.length - 1) : null;
function serialize(root) {
  if (!root) return '(empty)';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('null'); continue; }
    out.push(String(node.val));
    q.push(node.left);
    q.push(node.right);
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}
console.log(serialize(root));`,
      `arr = nums(1)


def build(lo, hi):
    if lo > hi:
        return None
    mid = lo + (hi - lo) // 2
    return {"val": arr[mid], "left": build(lo, mid - 1), "right": build(mid + 1, hi)}


root = build(0, len(arr) - 1) if arr else None


def serialize(root):
    if not root:
        return "(empty)"
    from collections import deque
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if not node:
            out.append("null")
            continue
        out.append(str(node["val"]))
        q.append(node["left"])
        q.append(node["right"])
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)


print(serialize(root))`,
    ),
    testCases: [
      sample('3\n1 2 3', '2 1 3'),
      sample('1\n1', '1'),
      hidden('0\n', '(empty)'),
      hidden('2\n1 2', '1 null 2'),
      hidden('4\n1 2 3 4', '2 1 3 null null null 4'),
      hidden('5\n1 2 3 4 5', '3 1 4 null 2 null 5'),
    ],
  },

  {
    slug: 'two-sum-iv-input-is-a-bst',
    title: 'Two Sum IV - Input is a BST',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Determine whether two distinct nodes in the BST sum to `target`.\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: `target`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki BST ke do distinct nodes ka sum `target` ke barabar hai ya nahi.\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: `target`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '5 3 6 2 4 null 7\n9', output: 'true' },
      { input: '5 3 6 2 4 null 7\n28', output: 'false' },
    ],
    constraints: ['1 <= nodes <= 10^4'],
    hints: [
      'This is exactly Two Sum, just over the values in a tree instead of a plain array.',
      'The BST property is not actually needed for correctness here — a hash set of visited values works regardless of tree shape.',
      'Walk the tree (any traversal order), and for each value check whether `target - value` has already been seen; if not, record the current value and continue.',
    ],
    approach:
      'Walk the tree in any order while maintaining a hash set of values seen so far. For each node, check whether `target - node.val` is already in the set; if so, a pair exists. Otherwise add `node.val` to the set and continue.',
    approachHi:
      'Tree ko kisi bhi order mein walk karo, ab tak dekhi gayi values ka ek hash set maintain karte hue. Har node ke liye, check karo ki `target - node.val` set mein hai ya nahi; agar hai, pair mil gaya. Warna `node.val` ko set mein daalo aur aage badho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'This is a nice reminder that not every BST problem should be solved by exploiting the ordering property — the underlying task, "find two values summing to a target", is identical to plain-array Two Sum regardless of what data structure holds the values, so the same hash-set trick applies directly, visiting the tree in any convenient order (the BST shape offers no particular advantage here, unlike Kth Smallest or LCA).',
    solutionExplanationHi:
      'Ye ek achha reminder hai ki har BST problem ko ordering property exploit karke solve nahi karna chahiye — underlying task, "target tak sum karne wali do values dhoondo", bilkul waisa hi hai jaisa plain-array Two Sum, chahe values kisi bhi data structure mein hon, isliye wahi hash-set trick seedha lagu hota hai, tree ko kisi bhi convenient order mein visit karke (BST shape yahan koi particular advantage nahi deta, Kth Smallest ya LCA ke ulat).',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const target = num(1);

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

function findTarget(root, target) {
  // your code here
}

console.log(findTarget(build(tokens), target));`,
      `from collections import deque
tokens = line(0).split()
target = num(1)

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

def find_target(root, target):
    # your code here
    pass

print("true" if find_target(build(tokens), target) else "false")`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const target = num(1);
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
function findTarget(root, target) {
  const seen = new Set();
  function dfs(node) {
    if (!node) return false;
    if (seen.has(target - node.val)) return true;
    seen.add(node.val);
    return dfs(node.left) || dfs(node.right);
  }
  return dfs(root);
}
console.log(findTarget(build(tokens), target));`,
      `from collections import deque
tokens = line(0).split()
target = num(1)

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

def find_target(root, target):
    seen = set()

    def dfs(node):
        if not node:
            return False
        if target - node.val in seen:
            return True
        seen.add(node.val)
        return dfs(node.left) or dfs(node.right)

    return dfs(root)

print("true" if find_target(build(tokens), target) else "false")`,
    ),
    testCases: [
      sample('5 3 6 2 4 null 7\n9', 'true'),
      sample('5 3 6 2 4 null 7\n28', 'false'),
      hidden('1\n2', 'false'),
      hidden('2 1\n3', 'true'),
      hidden('5 3 6 2 4 null 7\n10', 'true'),
      hidden('5 3 6 2 4 null 7\n5', 'true'),
    ],
  },

  {
    slug: 'range-sum-of-bst',
    title: 'Range Sum of BST',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Sum the values of all nodes whose value lies within `[low, high]` inclusive.\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: `low high`\n\n**Output**\nThe sum.',
    descriptionHi:
      'Un saare nodes ki values ka sum nikalo jinki value `[low, high]` (inclusive) ke andar ho.\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: `low high`\n\n**Output**\nSum.',
    examples: [
      { input: '10 5 15 3 7 null 18\n7 15', output: '32' },
      { input: '10 5 15 3 7 13 18 1 null null null null null null null\n6 10', output: '17' },
    ],
    constraints: ['1 <= nodes <= 2*10^4', 'low <= high'],
    hints: [
      'Visiting every node and checking the range works, but the BST property allows pruning.',
      'If the current node\'s value is less than `low`, its entire left subtree is also less than `low` — skip it entirely.',
      'If the current node\'s value is greater than `high`, its entire right subtree can be skipped for the same reason.',
    ],
    approach:
      'DFS with pruning based on BST ordering. For each node: if its value is `< low`, only recurse right (the whole left subtree is out of range). If `> high`, only recurse left. Otherwise, add its value to the sum and recurse into both children.',
    approachHi:
      'BST ordering ke hisaab se pruning wala DFS. Har node ke liye: agar uski value `< low` hai, sirf right mein recurse karo (poora left subtree range se bahar hai). `> high` hai to sirf left mein recurse karo. Warna, uski value sum mein jodo aur dono children mein recurse karo.',
    timeComplexity: 'O(n) worst case, much less with effective pruning',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The BST ordering guarantees that if a node\'s value is already below `low`, every value in its left subtree is even smaller (also below `low`) — so that entire branch can be skipped without individually checking any of its nodes, and symmetrically for values above `high` on the right side. A plain unconditional traversal would still get the correct sum, but visiting every node regardless of range wastes the exact structural guarantee a BST provides.',
    solutionExplanationHi:
      'BST ordering guarantee karti hai ki agar ek node ki value pehle se `low` se kam hai, to uske left subtree ki har value usse bhi chhoti hai (wo bhi `low` se kam) — isliye us poori branch ko bina uske kisi bhi node ko individually check kiye skip kiya ja sakta hai, aur symmetrically `high` se upar wali values ke liye right side par. Ek plain unconditional traversal bhi sahi sum dega, par range ki parwah kiye bina har node visit karna, BST diye jaane wale exact structural guarantee ko waste karta hai.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const [low, high] = nums(1);

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

function rangeSumBST(root, low, high) {
  // your code here
}

console.log(rangeSumBST(build(tokens), low, high));`,
      `from collections import deque
tokens = line(0).split()
low, high = nums(1)

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

def range_sum_bst(root, low, high):
    # your code here
    pass

print(range_sum_bst(build(tokens), low, high))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const [low, high] = nums(1);
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
function rangeSumBST(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return rangeSumBST(root.right, low, high);
  if (root.val > high) return rangeSumBST(root.left, low, high);
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}
console.log(rangeSumBST(build(tokens), low, high));`,
      `from collections import deque
tokens = line(0).split()
low, high = nums(1)

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

def range_sum_bst(root, low, high):
    if not root:
        return 0
    if root.val < low:
        return range_sum_bst(root.right, low, high)
    if root.val > high:
        return range_sum_bst(root.left, low, high)
    return root.val + range_sum_bst(root.left, low, high) + range_sum_bst(root.right, low, high)

print(range_sum_bst(build(tokens), low, high))`,
    ),
    testCases: [
      sample('10 5 15 3 7 null 18\n7 15', '32'),
      sample('10 5 15 3 7 13 18 1 null null null null null null null\n6 10', '17'),
      hidden('1\n1 1', '1'),
      hidden('1\n2 3', '0'),
      hidden('10 5 15 3 7 null 18\n0 100', '58'),
      hidden('10 5 15 3 7 null 18\n5 5', '5'),
    ],
  },

  {
    slug: 'minimum-absolute-difference-bst',
    title: 'Minimum Absolute Difference in BST',
    category: 'BST',
    difficulty: 'EASY',
    description:
      'Find the minimum absolute difference between the values of any two distinct nodes in the BST.\n\n**Input**\nOne line: the BST, level order, `null` for missing children.\n\n**Output**\nThe minimum absolute difference.',
    descriptionHi:
      'BST mein kisi bhi do distinct nodes ki values ke beech ka minimum absolute difference dhoondo.\n\n**Input**\nEk line: BST, level order, missing children ke liye `null`.\n\n**Output**\nMinimum absolute difference.',
    examples: [
      { input: '4 2 6 1 3', output: '1' },
      { input: '1 null 3 2', output: '1' },
    ],
    constraints: ['2 <= nodes <= 10^4'],
    hints: [
      'Checking every pair of nodes is O(n^2) — the BST\'s sorted structure allows much better.',
      'An in-order traversal of a BST visits values in strictly increasing order — the overall minimum difference between ANY two values must occur between some pair of ADJACENT values in that sorted order.',
      'Track the previously visited value during the in-order walk, and update a running minimum using the difference to the current value at each step.',
    ],
    approach:
      'In-order traversal, tracking the previously visited value. At each node, if a previous value exists, update the running minimum difference with `node.val - previousVal` (guaranteed non-negative since in-order visits values in increasing order). Update the previous value to the current one and continue.',
    approachHi:
      'In-order traversal, pichli dekhi gayi value track karte hue. Har node par, agar pichli value hai, running minimum difference ko `node.val - previousVal` se update karo (guaranteed non-negative, kyunki in-order values increasing order mein visit karta hai). Pichli value ko current se update karo aur aage badho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'In any sorted sequence, the smallest gap between two elements can never be between two non-adjacent elements — any such gap would necessarily contain at least one element strictly between them, giving an even smaller adjacent gap somewhere along the way. Because in-order traversal produces exactly that sorted sequence for a BST, checking only consecutive pairs during a single pass (rather than every O(n^2) pair) is guaranteed not to miss the true minimum.',
    solutionExplanationHi:
      'Kisi bhi sorted sequence mein, do elements ke beech ka sabse chhota gap kabhi bhi do non-adjacent elements ke beech nahi ho sakta — aisa koi bhi gap zaroori taur par kam se kam ek element unke beech strictly rakhta, jo raaste mein kahin ek aur bhi chhota adjacent gap dega. Chunki in-order traversal ek BST ke liye exactly wahi sorted sequence produce karta hai, ek hi pass mein sirf consecutive pairs check karna (har O(n^2) pair nahi) guaranteed hai ki asli minimum miss na ho.',
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

function getMinimumDifference(root) {
  // your code here
}

console.log(getMinimumDifference(build(tokens)));`,
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

def get_minimum_difference(root):
    # your code here
    pass

print(get_minimum_difference(build(tokens)))`,
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
function getMinimumDifference(root) {
  let prev = null, best = Infinity;
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    if (prev !== null) best = Math.min(best, node.val - prev);
    prev = node.val;
    dfs(node.right);
  }
  dfs(root);
  return best;
}
console.log(getMinimumDifference(build(tokens)));`,
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

def get_minimum_difference(root):
    prev = [None]
    best = [float("inf")]

    def dfs(node):
        if not node:
            return
        dfs(node.left)
        if prev[0] is not None:
            best[0] = min(best[0], node.val - prev[0])
        prev[0] = node.val
        dfs(node.right)

    dfs(root)
    return best[0]

print(get_minimum_difference(build(tokens)))`,
    ),
    testCases: [
      sample('4 2 6 1 3', '1'),
      sample('1 null 3 2', '1'),
      hidden('1 null 2', '1'),
      hidden('10 5 20', '5'),
      hidden('5 3 8 2 4 7 9', '1'),
      hidden('30 20 40 10 25 35 50', '5'),
    ],
  },
];
