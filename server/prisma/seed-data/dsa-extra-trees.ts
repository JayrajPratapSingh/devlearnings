import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Trees — expansion batch, part 1 of 2. Rounds out the category beyond the
 * original two (Maximum Depth, Level Order Traversal) with the core DFS/BFS
 * toolkit: inversion, symmetry, path-sum variants, diameter, balance, right
 * side view, and zigzag order. Trees are rebuilt from the same level-order
 * `null`-marked flat encoding used by the existing two Tree problems, and
 * outputs that must prove structural correctness (not just a single number)
 * are themselves printed level-order with `null` markers.
 */
export const dsaExtraTrees: SeedProblem[] = [
  {
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Invert a binary tree: swap every node\'s left and right children, recursively.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe inverted tree, in level order with `null` for missing children. `(empty)` for an empty tree.',
    descriptionHi:
      'Ek binary tree invert karo: har node ke left aur right children ko recursively swap karo.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nInverted tree, level order mein `null` ke saath. Khaali tree ke liye `(empty)`.',
    examples: [
      { input: '4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1' },
      { input: '', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 5000'],
    hints: [
      'The base case is an empty (null) node — there is nothing to invert.',
      'Inverting a tree means: invert the left subtree, invert the right subtree, then swap them.',
      'It does not matter whether you swap before or after recursing, as long as both subtrees end up fully inverted and swapped.',
    ],
    approach:
      'Recursive: base case `node === null` returns `null`. Otherwise, recursively invert both children, then swap `node.left` and `node.right`, and return `node`.',
    approachHi:
      'Recursive: base case `node === null` par `null` return karo. Warna, dono children ko recursively invert karo, phir `node.left` aur `node.right` ko swap karo, aur `node` return karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'Inversion is a purely local operation applied uniformly at every node — swap the two child pointers — composed recursively across the whole tree. Because each node is visited exactly once and the swap is O(1), the total cost is O(n); the recursion needs no return-value bookkeeping beyond "the (now-inverted) subtree root", since the swap itself is what does the real work at each level.',
    solutionExplanationHi:
      'Inversion ek purely local operation hai jo har node par uniformly apply hoti hai — do child pointers swap karna — poori tree mein recursively compose hote hue. Chunki har node exactly ek baar visit hota hai aur swap O(1) hai, total cost O(n) hai; recursion ko "(ab-inverted) subtree root" ke alawa koi extra return-value bookkeeping nahi chahiye, kyunki swap khud hi har level par asli kaam karta hai.',
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

function invertTree(root) {
  // return the (mutated) root
  return root;
}

console.log(serialize(invertTree(build(tokens))));`,
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

def invert_tree(root):
    # return the (mutated) root
    return root

print(serialize(invert_tree(build(tokens))))`,
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
function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}
console.log(serialize(invertTree(build(tokens))));`,
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

def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

print(serialize(invert_tree(build(tokens))))`,
    ),
    testCases: [
      sample('4 2 7 1 3 6 9', '4 7 2 9 6 3 1'),
      sample('', '(empty)'),
      hidden('1', '1'),
      hidden('2 1', '2 null 1'),
      hidden('1 2', '1 null 2'),
      hidden('1 2 3 4 null null 5', '1 3 2 5 null null 4'),
    ],
  },

  {
    slug: 'symmetric-tree',
    title: 'Symmetric Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Determine whether a binary tree is a mirror of itself around its center.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki ek binary tree apne center ke around khud ka mirror hai ya nahi.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '1 2 2 3 4 4 3', output: 'true' },
      { input: '1 2 2 null 3 null 3', output: 'false' },
    ],
    constraints: ['0 <= nodes <= 1000'],
    hints: [
      'A tree is symmetric exactly when its left subtree is the mirror image of its right subtree.',
      'Write a helper that checks whether two subtrees are mirrors of each other, not whether a single tree is symmetric.',
      'Two subtrees are mirrors when their values match AND the left of one mirrors the right of the other (and vice versa) — a crossed comparison, not a parallel one.',
    ],
    approach:
      'Recursive mirror check `isMirror(a, b)`: both null is true, exactly one null is false, otherwise `a.val === b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left)`. The tree is symmetric exactly when `isMirror(root.left, root.right)`.',
    approachHi:
      'Recursive mirror check `isMirror(a, b)`: dono null ho to true, sirf ek null ho to false, warna `a.val === b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left)`. Tree symmetric hai jab `isMirror(root.left, root.right)` ho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The crossed comparison — a\'s left against b\'s right, and a\'s right against b\'s left — is the entire insight: a plain parallel comparison (a.left vs b.left) would check whether the two subtrees are IDENTICAL, not whether they are MIRROR IMAGES of each other, which is a structurally different (and for this problem, wrong) question.',
    solutionExplanationHi:
      'Crossed comparison — a ka left b ke right se, aur a ka right b ke left se — hi poora insight hai: ek plain parallel comparison (a.left vs b.left) ye check karta ki dono subtrees IDENTICAL hain ya nahi, ye nahi ki wo ek doosre ki MIRROR IMAGE hain — ye structurally alag (aur is problem ke liye galat) sawaal hai.',
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

function isSymmetric(root) {
  // your code here
}

console.log(isSymmetric(build(tokens)));`,
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

def is_symmetric(root):
    # your code here
    pass

print("true" if is_symmetric(build(tokens)) else "false")`,
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
function isMirror(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.val === b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left);
}
const root = build(tokens);
console.log(root ? isMirror(root.left, root.right) : true);`,
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

def is_mirror(a, b):
    if not a and not b:
        return True
    if not a or not b:
        return False
    return a.val == b.val and is_mirror(a.left, b.right) and is_mirror(a.right, b.left)

root = build(tokens)
print("true" if (is_mirror(root.left, root.right) if root else True) else "false")`,
    ),
    testCases: [
      sample('1 2 2 3 4 4 3', 'true'),
      sample('1 2 2 null 3 null 3', 'false'),
      hidden('', 'true'),
      hidden('1', 'true'),
      hidden('1 2 2', 'true'),
      hidden('1 2 3', 'false'),
    ],
  },

  {
    slug: 'same-tree',
    title: 'Same Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Determine whether two binary trees are structurally identical with the same node values.\n\n**Input**\n- Line 1: tree A, level order, `null` for missing children\n- Line 2: tree B, same format\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki do binary trees structurally identical hain, same node values ke saath.\n\n**Input**\n- Line 1: tree A, level order, missing children ke liye `null`\n- Line 2: tree B, same format\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '1 2 3\n1 2 3', output: 'true' },
      { input: '1 2\n1 null 2', output: 'false' },
    ],
    constraints: ['0 <= nodes <= 1000'],
    hints: [
      'Two null trees are the same (trivially). One null and one non-null are never the same.',
      'Two non-null trees are the same exactly when their values match AND both pairs of corresponding subtrees are the same.',
      'This is a direct parallel (not crossed) comparison, unlike Symmetric Tree.',
    ],
    approach:
      'Recursive: both null returns true; exactly one null returns false; otherwise return `a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right)`.',
    approachHi:
      'Recursive: dono null ho to true; sirf ek null ho to false; warna `a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right)` return karo.',
    timeComplexity: 'O(min(size of A, size of B))',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'This is the structural twin of Symmetric Tree but with a parallel comparison instead of a crossed one: left-with-left and right-with-right, since the question here is "are these two trees identical", not "is one tree the mirror of the other". Recursion short-circuits the moment any mismatch (differing values, or one side null and the other not) is found at any depth.',
    solutionExplanationHi:
      'Ye Symmetric Tree ka structural twin hai, bas parallel comparison ke saath crossed ke bajaye: left-with-left aur right-with-right, kyunki yahan sawaal "kya ye do trees identical hain" hai, "kya ek tree doosre ka mirror hai" nahi. Kisi bhi depth par koi bhi mismatch (alag values, ya ek side null aur doosri nahi) milte hi recursion short-circuit ho jaata hai.',
    starter: starter(
      `const tokensA = line(0).split(/\\s+/).filter(Boolean);
const tokensB = line(1).split(/\\s+/).filter(Boolean);

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

function isSameTree(a, b) {
  // your code here
}

console.log(isSameTree(build(tokensA), build(tokensB)));`,
      `from collections import deque
tokens_a = line(0).split()
tokens_b = line(1).split()

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

def is_same_tree(a, b):
    # your code here
    pass

print("true" if is_same_tree(build(tokens_a), build(tokens_b)) else "false")`,
    ),
    solution: solution(
      `const tokensA = line(0).split(/\\s+/).filter(Boolean);
const tokensB = line(1).split(/\\s+/).filter(Boolean);
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
function isSameTree(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.val === b.val && isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}
console.log(isSameTree(build(tokensA), build(tokensB)));`,
      `from collections import deque
tokens_a = line(0).split()
tokens_b = line(1).split()

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

def is_same_tree(a, b):
    if not a and not b:
        return True
    if not a or not b:
        return False
    return a.val == b.val and is_same_tree(a.left, b.left) and is_same_tree(a.right, b.right)

print("true" if is_same_tree(build(tokens_a), build(tokens_b)) else "false")`,
    ),
    testCases: [
      sample('1 2 3\n1 2 3', 'true'),
      sample('1 2\n1 null 2', 'false'),
      hidden('\n', 'true'),
      hidden('1\n1', 'true'),
      hidden('1\n2', 'false'),
      hidden('1 2 3\n1 2 4', 'false'),
    ],
  },

  {
    slug: 'path-sum',
    title: 'Path Sum',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Determine whether the tree has a root-to-leaf path whose values sum exactly to `target`.\n\n**Input**\n- Line 1: the tree, level order, `null` for missing children\n- Line 2: `target`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki tree mein koi root-to-leaf path hai jiska values ka sum exactly `target` ke barabar ho.\n\n**Input**\n- Line 1: tree, level order, missing children ke liye `null`\n- Line 2: `target`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '5 4 8 11 null 13 4 7 2 null null null 1\n22', output: 'true' },
      { input: '1 2 3\n5', output: 'false' },
    ],
    constraints: ['0 <= nodes <= 5000', 'An empty tree has no valid path'],
    hints: [
      'An empty tree has no root-to-leaf path at all, so the answer is always false for it.',
      'A leaf is a node with no children — check whether its value alone equals the remaining target.',
      'For a non-leaf node, recurse into whichever children exist, subtracting the current node\'s value from the target each time.',
    ],
    approach:
      'Recursive DFS carrying a remaining target. Base case: `null` node returns false. At a leaf (no children), return whether `node.val === remaining`. Otherwise, recurse into both children with `remaining - node.val`, returning true if either succeeds.',
    approachHi:
      'Ek remaining target le kar recursive DFS. Base case: `null` node par false. Ek leaf (koi children nahi) par, return karo ki `node.val === remaining` hai ya nahi. Warna, dono children mein `remaining - node.val` ke saath recurse karo, agar koi bhi succeed ho to true.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The leaf check is essential and easy to get wrong: a node with only one child is NOT a valid path endpoint (root-to-leaf specifically requires reaching a node with no children at all), so checking `node.val === remaining` at any node with even one child would incorrectly accept paths that do not actually reach a leaf — the sum happening to hit zero partway down a single-child chain does not count.',
    solutionExplanationHi:
      'Leaf check zaroori hai aur galat karna aasan hai: sirf ek child wala node valid path endpoint NAHI hai (root-to-leaf specifically ek aise node tak pahunchna maangta hai jiske koi children hi na hon), isliye kisi bhi ek-child wale node par `node.val === remaining` check karna galat tarah se un paths ko accept kar lega jo actually kisi leaf tak pahunchte hi nahi — ek single-child chain mein beech mein hi sum zero ho jaana count nahi hota.',
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

function hasPathSum(node, remaining) {
  // your code here
}

console.log(hasPathSum(build(tokens), target));`,
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

def has_path_sum(node, remaining):
    # your code here
    pass

print("true" if has_path_sum(build(tokens), target) else "false")`,
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
function hasPathSum(node, remaining) {
  if (!node) return false;
  if (!node.left && !node.right) return node.val === remaining;
  return hasPathSum(node.left, remaining - node.val) || hasPathSum(node.right, remaining - node.val);
}
console.log(hasPathSum(build(tokens), target));`,
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

def has_path_sum(node, remaining):
    if not node:
        return False
    if not node.left and not node.right:
        return node.val == remaining
    return has_path_sum(node.left, remaining - node.val) or has_path_sum(node.right, remaining - node.val)

print("true" if has_path_sum(build(tokens), target) else "false")`,
    ),
    testCases: [
      sample('5 4 8 11 null 13 4 7 2 null null null 1\n22', 'true'),
      sample('1 2 3\n5', 'false'),
      hidden('\n0', 'false'),
      hidden('1\n1', 'true'),
      hidden('1\n2', 'false'),
      hidden('1 2\n3', 'true'),
    ],
  },

  {
    slug: 'path-sum-ii',
    title: 'Path Sum II',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Find all root-to-leaf paths whose values sum exactly to `target`. Print each path\'s values space-separated, one path per line, in the order produced by exploring left before right.\n\n**Input**\n- Line 1: the tree, level order, `null` for missing children\n- Line 2: `target`\n\n**Output**\nOne path per line.',
    descriptionHi:
      'Aise saare root-to-leaf paths dhoondo jinka values ka sum exactly `target` ho. Har path ke values space-separated, ek line par ek path, left ko right se pehle explore karke jo order banta hai usi mein print karo.\n\n**Input**\n- Line 1: tree, level order, missing children ke liye `null`\n- Line 2: `target`\n\n**Output**\nEk line par ek path.',
    examples: [
      { input: '5 4 8 11 null 13 4 7 2 null null 5 1\n22', output: '5 4 11 2\n5 8 4 5' },
      { input: '1 2 3\n5', output: '' },
    ],
    constraints: ['0 <= nodes <= 5000'],
    hints: [
      'This reuses the Path Sum idea, but must build and record the actual path rather than just returning true/false.',
      'A backtracking pattern fits naturally: push the current node onto the path before recursing, pop it after — the same discipline as the Backtracking category.',
      'Only record the path when a leaf is reached AND the running sum exactly matches the target.',
    ],
    approach:
      'DFS with backtracking, carrying the current path and remaining target. Push the current node\'s value onto the path before recursing into children with `remaining - node.val`; at a leaf, record the path if `remaining === node.val`. Pop the value off the path after exploring both children (backtrack), so sibling branches build their own correct path.',
    approachHi:
      'Backtracking ke saath DFS, current path aur remaining target carry karte hue. Children mein `remaining - node.val` ke saath recurse karne se pehle current node ki value ko path mein push karo; ek leaf par, agar `remaining === node.val` hai to path record karo. Dono children explore karne ke baad value ko path se pop karo (backtrack), taaki sibling branches apna sahi path banayein.',
    timeComplexity: 'O(n^2) worst case (copying paths), O(n) tree traversal',
    spaceComplexity: 'O(h) recursion depth plus O(h) for the current path',
    solutionExplanation:
      'This is Path Sum plus the exact backtracking discipline used throughout the Backtracking category: the same shared `path` array is mutated in place (pushed before recursing, popped after), which is far cheaper than rebuilding a new array at every level, and correctness depends entirely on the pop happening unconditionally after both children are explored — regardless of whether a valid path was found down either branch — so that sibling and ancestor branches never see stale values left over from a completed path.',
    solutionExplanationHi:
      'Ye Path Sum plus wahi backtracking discipline hai jo poori Backtracking category mein use hoti hai: wahi shared `path` array in place mutate hota hai (recurse se pehle push, baad mein pop), jo har level par naya array banane se kaafi sasta hai, aur correctness poori tarah is baat par depend karti hai ki pop dono children explore hone ke baad unconditionally ho — chahe kisi bhi branch mein valid path mila ho ya nahi — taaki sibling aur ancestor branches ko kabhi ek complete ho chuke path ki stale values na dikhe.',
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

const out = [];
function backtrack(node, remaining, path) {
  // record path (a copy) when at a leaf with remaining === node.val
}

backtrack(build(tokens), target, []);
for (const p of out) console.log(p.join(' '));`,
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

out = []

def backtrack(node, remaining, path):
    # record path (a copy) when at a leaf with remaining == node.val
    pass

backtrack(build(tokens), target, [])
for p in out:
    print(" ".join(map(str, p)))`,
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
const out = [];
function backtrack(node, remaining, path) {
  if (!node) return;
  path.push(node.val);
  if (!node.left && !node.right && remaining === node.val) out.push([...path]);
  else {
    backtrack(node.left, remaining - node.val, path);
    backtrack(node.right, remaining - node.val, path);
  }
  path.pop();
}
backtrack(build(tokens), target, []);
for (const p of out) console.log(p.join(' '));`,
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

out = []

def backtrack(node, remaining, path):
    if not node:
        return
    path.append(node.val)
    if not node.left and not node.right and remaining == node.val:
        out.append(list(path))
    else:
        backtrack(node.left, remaining - node.val, path)
        backtrack(node.right, remaining - node.val, path)
    path.pop()

backtrack(build(tokens), target, [])
for p in out:
    print(" ".join(map(str, p)))`,
    ),
    testCases: [
      sample('5 4 8 11 null 13 4 7 2 null null 5 1\n22', '5 4 11 2\n5 8 4 5'),
      sample('1 2 3\n5', ''),
      hidden('1\n1', '1'),
      hidden('1\n2', ''),
      hidden('\n0', ''),
      hidden('1 2\n3', '1 2'),
    ],
  },

  {
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Find the diameter of the tree: the number of edges on the longest path between any two nodes (the path may or may not pass through the root).\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe diameter.',
    descriptionHi:
      'Tree ka diameter dhoondo: kisi bhi do nodes ke beech ke sabse lambe path ke edges ki sankhya (path root se guzre ya na guzre).\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nDiameter.',
    examples: [
      { input: '1 2 3 4 5', output: '3' },
      { input: '1', output: '0' },
    ],
    constraints: ['0 <= nodes <= 10^4'],
    hints: [
      'The longest path through any given node equals the height of its left subtree plus the height of its right subtree.',
      'The overall diameter is the maximum of that quantity over every single node in the tree, not just the root.',
      'Compute this in one pass by having the height-computing recursion also update a running maximum diameter as a side effect.',
    ],
    approach:
      'Single DFS that computes height while tracking a running maximum diameter. At each node, compute `leftHeight` and `rightHeight` recursively, update the running max with `leftHeight + rightHeight` (the longest path bending through this node), then return `1 + max(leftHeight, rightHeight)` as this node\'s own height to its caller.',
    approachHi:
      'Ek hi DFS jo height compute karte hue ek running maximum diameter bhi track karta hai. Har node par, `leftHeight` aur `rightHeight` recursively compute karo, running max ko `leftHeight + rightHeight` se update karo (is node se guzarne wala sabse lamba path), phir apne caller ko is node ki apni height ki tarah `1 + max(leftHeight, rightHeight)` return karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The diameter is not necessarily the sum of the two deepest branches AT the root — it could bend through any node in the tree, and the naive approach of separately recomputing height for every node (to check `left height + right height` at each) costs O(n^2) in the worst case. Folding the diameter check into the SAME single recursive pass that already computes heights bottom-up means every node\'s height is computed once and its diameter contribution checked at that same moment, dropping the total cost to O(n).',
    solutionExplanationHi:
      'Diameter zaroori nahi ki root PAR ki do sabse gehri branches ka sum ho — wo tree ke kisi bhi node se guzar sakta hai, aur har node ke liye alag se height recompute karne ka naive approach (har node par `left height + right height` check karne ke liye) worst case mein O(n^2) lagta hai. Diameter check ko usi SINGLE recursive pass mein fold karna jo pehle se bottom-up heights compute kar raha hai, matlab har node ki height ek hi baar compute hoti hai aur usi moment uska diameter contribution check ho jaata hai — total cost O(n) tak ghat jaati hai.',
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

function diameterOfBinaryTree(root) {
  // your code here
}

console.log(diameterOfBinaryTree(build(tokens)));`,
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

def diameter_of_binary_tree(root):
    # your code here
    pass

print(diameter_of_binary_tree(build(tokens)))`,
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
let best = 0;
function height(node) {
  if (!node) return 0;
  const l = height(node.left), r = height(node.right);
  best = Math.max(best, l + r);
  return 1 + Math.max(l, r);
}
height(build(tokens));
console.log(best);`,
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

best = 0

def height(node):
    global best
    if not node:
        return 0
    l, r = height(node.left), height(node.right)
    best = max(best, l + r)
    return 1 + max(l, r)

height(build(tokens))
print(best)`,
    ),
    testCases: [
      sample('1 2 3 4 5', '3'),
      sample('1', '0'),
      hidden('', '0'),
      hidden('1 2', '1'),
      hidden('1 2 3 4 null null null 5', '4'),
      hidden('1 2 null 3 null 4', '3'),
    ],
  },

  {
    slug: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Determine whether the tree is height-balanced: for every node, the heights of its left and right subtrees differ by at most 1.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki tree height-balanced hai: har node ke liye, uske left aur right subtrees ki heights ka farq zyada se zyada 1 ho.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '3 9 20 null null 15 7', output: 'true' },
      { input: '1 2 2 3 3 null null 4 4', output: 'false' },
    ],
    constraints: ['0 <= nodes <= 5000'],
    hints: [
      'A naive approach recomputes height at every node separately, costing O(n^2) on a skewed tree.',
      'Combine the balance check into the same recursion that computes height, so each subtree\'s height is only ever computed once.',
      'Use a sentinel value like -1 to signal "this subtree is already known to be unbalanced", so an imbalance found deep in the tree can short-circuit the rest of the check.',
    ],
    approach:
      'Single DFS returning height, with a sentinel of `-1` meaning "unbalanced already found". At each node, recursively get left and right heights; if either is `-1` or they differ by more than 1, propagate `-1` upward immediately. Otherwise return `1 + max(left, right)` as normal.',
    approachHi:
      'Ek hi DFS jo height return karta hai, `-1` sentinel ke saath jiska matlab hai "unbalanced pehle hi mil chuka". Har node par, recursively left aur right heights lo; agar koi bhi `-1` hai ya unka farq 1 se zyada hai, turant `-1` upar propagate karo. Warna normal tarah `1 + max(left, right)` return karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'Checking balance at every node by independently recomputing height for each one (a natural first instinct) redoes the same subtree height calculations over and over, costing O(n^2) on a skewed tree. Reusing the height-computation recursion to ALSO carry balance information (via the -1 sentinel) means each subtree\'s height is computed exactly once, and an imbalance found anywhere deep in the tree propagates all the way up immediately, short-circuiting further work rather than continuing to compute heights that no longer matter.',
    solutionExplanationHi:
      'Har node par independently height recompute karke balance check karna (pehla natural instinct) same subtree height calculations baar-baar dohrata hai, jhuke hue tree par O(n^2) lagta hai. Height-computation recursion ko balance information bhi (via -1 sentinel) carry karne ke liye reuse karna matlab har subtree ki height exactly ek baar compute hoti hai, aur tree mein kahin bhi gehri jagah mila imbalance turant poora upar propagate ho jaata hai, aage ka kaam short-circuit karte hue, aise heights compute karte rehne ke bajaye jo ab matter hi nahi karti.',
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

function isBalanced(root) {
  // your code here
}

console.log(isBalanced(build(tokens)));`,
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

def is_balanced(root):
    # your code here
    pass

print("true" if is_balanced(build(tokens)) else "false")`,
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
function height(node) {
  if (!node) return 0;
  const l = height(node.left);
  if (l === -1) return -1;
  const r = height(node.right);
  if (r === -1) return -1;
  if (Math.abs(l - r) > 1) return -1;
  return 1 + Math.max(l, r);
}
console.log(height(build(tokens)) !== -1);`,
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

def height(node):
    if not node:
        return 0
    l = height(node.left)
    if l == -1:
        return -1
    r = height(node.right)
    if r == -1:
        return -1
    if abs(l - r) > 1:
        return -1
    return 1 + max(l, r)

print("true" if height(build(tokens)) != -1 else "false")`,
    ),
    testCases: [
      sample('3 9 20 null null 15 7', 'true'),
      sample('1 2 2 3 3 null null 4 4', 'false'),
      hidden('', 'true'),
      hidden('1', 'true'),
      hidden('1 2 null 3', 'false'),
      hidden('1 2 3', 'true'),
    ],
  },

  {
    slug: 'minimum-depth-binary-tree',
    title: 'Minimum Depth of Binary Tree',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Find the minimum depth: the number of nodes along the shortest path from the root to any leaf.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe minimum depth.',
    descriptionHi:
      'Minimum depth dhoondo: root se kisi bhi leaf tak ke sabse chhote path par nodes ki sankhya.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nMinimum depth.',
    examples: [
      { input: '3 9 20 null null 15 7', output: '2' },
      { input: '2 null 3 null 4 null 5 null 6', output: '5' },
    ],
    constraints: ['0 <= nodes <= 10^5'],
    hints: [
      'This looks like Maximum Depth with min instead of max, but that substitution alone is a classic trap.',
      'A node with only ONE child is not a leaf — its "empty" side has depth 0, and taking the min with that 0 would wrongly report a too-small depth.',
      'The minimum depth of a node with only one child equals 1 plus the depth of that existing child, not 1 plus min(0, childDepth).',
    ],
    approach:
      'Recursive: base case `null` returns 0. At a leaf (no children), return 1. If only one child exists, return `1 + minDepth(the existing child)` — the missing side must be ignored entirely, not treated as depth 0. If both children exist, return `1 + min(minDepth(left), minDepth(right))`.',
    approachHi:
      'Recursive: base case `null` par 0 return karo. Ek leaf (koi children nahi) par, 1 return karo. Agar sirf ek hi child hai, to `1 + minDepth(jo child hai)` return karo — missing side ko bilkul ignore karna hai, depth 0 ki tarah treat nahi karna. Agar dono children hain, to `1 + min(minDepth(left), minDepth(right))` return karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The classic bug is naively mirroring Maximum Depth\'s `1 + max(depth(left), depth(right))` into `1 + min(depth(left), depth(right))` without adjustment — for a node with only a right child, `depth(left)` on the missing side is 0, and taking the min with that 0 would report a minimum depth of 1 at that node, as if it were itself a leaf, when in fact no leaf exists down that missing left side at all. The fix is checking for the single-child case explicitly and only recursing into the side that actually exists.',
    solutionExplanationHi:
      'Classic bug Maximum Depth ke `1 + max(depth(left), depth(right))` ko bina adjustment ke `1 + min(depth(left), depth(right))` mein naively mirror kar dena hai — sirf right child wale node ke liye, missing left side par `depth(left)` 0 hai, aur us 0 ke saath min lena us node par minimum depth 1 report kar dega, jaise wo khud ek leaf ho, jabki asal mein us missing left side par koi leaf hai hi nahi. Fix ye hai ki single-child case explicitly check karo aur sirf us side mein recurse karo jo actually exist karta hai.',
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

function minDepth(node) {
  // your code here
}

console.log(minDepth(build(tokens)));`,
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

def min_depth(node):
    # your code here
    pass

print(min_depth(build(tokens)))`,
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
function minDepth(node) {
  if (!node) return 0;
  if (!node.left) return 1 + minDepth(node.right);
  if (!node.right) return 1 + minDepth(node.left);
  return 1 + Math.min(minDepth(node.left), minDepth(node.right));
}
console.log(minDepth(build(tokens)));`,
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

def min_depth(node):
    if not node:
        return 0
    if not node.left:
        return 1 + min_depth(node.right)
    if not node.right:
        return 1 + min_depth(node.left)
    return 1 + min(min_depth(node.left), min_depth(node.right))

print(min_depth(build(tokens)))`,
    ),
    testCases: [
      sample('3 9 20 null null 15 7', '2'),
      sample('2 null 3 null 4 null 5 null 6', '5'),
      hidden('', '0'),
      hidden('1', '1'),
      hidden('1 2', '2'),
      hidden('1 null 2 null 3', '3'),
    ],
  },
];
