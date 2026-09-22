import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * BST — expansion batch, part 2 of 2. Continues from dsa-extra-bst.ts with
 * structural rewrites (delete, trim, convert-to-greater-tree), the classic
 * hard "fix two swapped nodes" problem, the design-an-iterator problem, and
 * two combinatorial closers (construct from preorder, count unique BSTs).
 */
export const dsaExtraBst2: SeedProblem[] = [
  {
    slug: 'delete-node-in-a-bst',
    title: 'Delete Node in a BST',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Delete the node with the given value from the BST, keeping it a valid BST. If the node has two children, replace its value with its in-order successor\'s value (the smallest value in its right subtree), then delete that successor.\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: the value to delete\n\n**Output**\nThe resulting tree, level order with `null`.',
    descriptionHi:
      'BST se di gayi value wala node delete karo, use valid BST rakhte hue. Agar node ke do children hain, uski value ko uske in-order successor (right subtree ki sabse chhoti value) se replace karo, phir us successor ko delete karo.\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: delete karne wali value\n\n**Output**\nResulting tree, level order mein `null` ke saath.',
    examples: [
      { input: '5 3 6 2 4 null 7\n3', output: '5 4 6 2 null null 7' },
      { input: '5 3 6 2 4 null 7\n0', output: '5 3 6 2 4 null 7' },
    ],
    constraints: ['0 <= nodes <= 10^4', 'The value to delete may or may not be present'],
    hints: [
      'Three cases: the node has no children, exactly one child, or two children.',
      'No children or one child: the node can simply be replaced by whichever child it has (or null).',
      'Two children: the node cannot be removed cleanly, so replace its value with the smallest value in its right subtree (the in-order successor), then recursively delete that successor from the right subtree (which now only needs the easier no/one-child cases).',
    ],
    approach:
      'Recursive: navigate to the target node using BST comparisons. Once found — if it has no left child, return its right child (splicing it in); if no right child, return its left child. If it has both, find the minimum value in its right subtree (walk left as far as possible), overwrite the current node\'s value with it, then recursively delete that value from the right subtree.',
    approachHi:
      'Recursive: BST comparisons use karke target node tak pahuncho. Milne par — agar left child nahi hai, right child return karo (use splice karte hue); right child nahi hai, left child return karo. Dono hain to, right subtree ka minimum value dhoondo (jitna ho sake left chalo), current node ki value use us se overwrite karo, phir us value ko right subtree se recursively delete karo.',
    timeComplexity: 'O(h)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The two-children case is the only genuinely tricky one, because a node in the middle of the tree cannot simply be unlinked without breaking connectivity — the fix is to realize that the in-order SUCCESSOR (smallest value greater than the node) is guaranteed to have at most one child (it is the leftmost node of the right subtree, so it can have no left child), which means deleting IT is always reducible to the easy no/one-child case. Copying its value up and then deleting the now-duplicated successor preserves the BST property throughout, since the successor was already correctly positioned relative to everything else.',
    solutionExplanationHi:
      'Two-children case hi asal mein tricky hai, kyunki tree ke beech ka ek node bina connectivity todein simply unlink nahi ho sakta — fix ye realize karna hai ki in-order SUCCESSOR (node se bade sabse chhote value wala) guaranteed zyada se zyada ek hi child rakhta hai (wo right subtree ka leftmost node hai, isliye uska koi left child nahi ho sakta), matlab USE delete karna hamesha aasan no/one-child case tak reduce ho jaata hai. Uski value upar copy karke phir ab-duplicate ho chuke successor ko delete karna, poori tarah BST property preserve karta hai, kyunki successor pehle se hi baaki sab cheezon ke relative sahi position par tha.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const key = num(1);

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

function deleteNode(root, key) {
  // return the (possibly new) root
  return root;
}

console.log(serialize(deleteNode(build(tokens), key)));`,
      `from collections import deque
tokens = line(0).split()
key = num(1)

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

def delete_node(root, key):
    # return the (possibly new) root
    return root

print(serialize(delete_node(build(tokens), key)))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const key = num(1);
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
function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let successor = root.right;
    while (successor.left) successor = successor.left;
    root.val = successor.val;
    root.right = deleteNode(root.right, successor.val);
  }
  return root;
}
console.log(serialize(deleteNode(build(tokens), key)));`,
      `from collections import deque
tokens = line(0).split()
key = num(1)

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

def delete_node(root, key):
    if not root:
        return None
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = delete_node(root.right, successor.val)
    return root

print(serialize(delete_node(build(tokens), key)))`,
    ),
    testCases: [
      sample('5 3 6 2 4 null 7\n3', '5 4 6 2 null null 7'),
      sample('5 3 6 2 4 null 7\n0', '5 3 6 2 4 null 7'),
      hidden('\n0', '(empty)'),
      hidden('1\n1', '(empty)'),
      hidden('2 1\n1', '2'),
      hidden('2 1\n2', '1'),
    ],
  },

  {
    slug: 'trim-a-binary-search-tree',
    title: 'Trim a Binary Search Tree',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Remove all nodes whose value falls outside `[low, high]`, keeping the result a valid BST (a node outside the range may be replaced by a descendant that IS in range).\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: `low high`\n\n**Output**\nThe trimmed tree, level order with `null`.',
    descriptionHi:
      'Aise saare nodes hatao jinki value `[low, high]` ke bahar hai, result ko valid BST rakhte hue (range se bahar wale node ki jagah uska koi in-range descendant aa sakta hai).\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: `low high`\n\n**Output**\nTrimmed tree, level order mein `null` ke saath.',
    examples: [
      { input: '1 0 2\n1 2', output: '1 null 2' },
      { input: '3 0 4 null 2 null null 1\n1 3', output: '3 2 null 1' },
    ],
    constraints: ['0 <= nodes <= 10^4'],
    hints: [
      'If a node\'s value is below `low`, the node itself (and its entire left subtree, all even smaller) must go — but its right subtree might still contain values in range.',
      'If a node\'s value is above `high`, symmetrically the node and its right subtree must go, but its left subtree might still have valid values.',
      'A node within range keeps its own value but must still recursively trim both of its children.',
    ],
    approach:
      'Recursive: if the current node\'s value is `< low`, the entire node and its left subtree are out of range, so discard them and return the (trimmed) right subtree instead. If `> high`, symmetrically return the (trimmed) left subtree. Otherwise the node stays, but its `left` and `right` are reassigned to the recursively trimmed versions of themselves.',
    approachHi:
      'Recursive: agar current node ki value `< low` hai, poora node aur uska left subtree range se bahar hai, isliye unhe discard karo aur (trimmed) right subtree return karo. `> high` hai to symmetrically (trimmed) left subtree return karo. Warna node rehta hai, par uske `left` aur `right` ko unke recursively trimmed versions se reassign kiya jaata hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'When a node is below `low`, discarding it does not necessarily discard everything useful beneath it — its right subtree could still hold values that ARE in range, so rather than deleting the whole subtree, the trimmed right subtree is spliced directly into the position the out-of-range node used to occupy. This "splice in the trimmed child" pattern is what lets valid descendants survive even when their ancestor gets removed, and it composes naturally with recursion since each level only needs to decide about the current node, trusting the recursive calls to have already handled everything below correctly.',
    solutionExplanationHi:
      'Jab koi node `low` se neeche hota hai, use discard karna zaroori nahi ki uske neeche ki har cheez discard ho jaaye — uska right subtree abhi bhi aisi values rakh sakta hai jo range mein HAIN, isliye poori subtree delete karne ke bajaye, trimmed right subtree ko seedha us position par splice kar diya jaata hai jahan out-of-range node tha. Ye "trimmed child ko splice karo" pattern hi valid descendants ko survive karne deta hai chahe unka ancestor remove ho jaaye, aur ye recursion ke saath naturally compose hota hai kyunki har level ko sirf current node ke baare mein decide karna hai, ye trust karte hue ki recursive calls neeche sab kuch pehle hi sahi tarah handle kar chuke hain.',
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

function trimBST(root, low, high) {
  // return the (possibly new) root
  return root;
}

console.log(serialize(trimBST(build(tokens), low, high)));`,
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

def trim_bst(root, low, high):
    # return the (possibly new) root
    return root

print(serialize(trim_bst(build(tokens), low, high)))`,
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
function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}
console.log(serialize(trimBST(build(tokens), low, high)));`,
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

def trim_bst(root, low, high):
    if not root:
        return None
    if root.val < low:
        return trim_bst(root.right, low, high)
    if root.val > high:
        return trim_bst(root.left, low, high)
    root.left = trim_bst(root.left, low, high)
    root.right = trim_bst(root.right, low, high)
    return root

print(serialize(trim_bst(build(tokens), low, high)))`,
    ),
    testCases: [
      sample('1 0 2\n1 2', '1 null 2'),
      sample('3 0 4 null 2 null null 1\n1 3', '3 2 null 1'),
      hidden('\n0 1', '(empty)'),
      hidden('1\n0 1', '1'),
      hidden('1\n2 3', '(empty)'),
      hidden('3 1 4 0 2\n1 3', '3 1 null null 2'),
    ],
  },

  {
    slug: 'convert-bst-to-greater-tree',
    title: 'Convert BST to Greater Tree',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Convert the BST so each node\'s value becomes the sum of its original value plus every value strictly greater than it in the tree.\n\n**Input**\nOne line: the BST, level order, `null` for missing children.\n\n**Output**\nThe converted tree, level order with `null`.',
    descriptionHi:
      'BST ko convert karo taaki har node ki value uski original value plus tree mein usse strictly bade har value ka sum ban jaaye.\n\n**Input**\nEk line: BST, level order, missing children ke liye `null`.\n\n**Output**\nConverted tree, level order mein `null` ke saath.',
    examples: [
      { input: '4 1 6 0 2 5 7', output: '22 25 13 25 24 18 7' },
      { input: '0 null 1', output: '1 null 1' },
    ],
    constraints: ['0 <= nodes <= 10^4', 'All values distinct'],
    hints: [
      'A reverse in-order traversal (right, node, left) visits nodes from largest value to smallest — exactly the order needed to accumulate "everything greater so far".',
      'Maintain a running sum of everything visited so far during that reverse traversal.',
      'At each node, first add its own value to the running sum, then assign that updated running sum as the node\'s new value.',
    ],
    approach:
      'Reverse in-order traversal (right subtree, then node, then left subtree), maintaining a running total. At each node: add the node\'s original value to the running total, then set the node\'s value to the (now updated) running total.',
    approachHi:
      'Reverse in-order traversal (right subtree, phir node, phir left subtree), ek running total maintain karte hue. Har node par: node ki original value ko running total mein jodo, phir node ki value ko (ab-updated) running total se set kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'Visiting nodes from largest to smallest (the mirror image of the usual smallest-to-largest in-order traversal) means that by the time any given node is reached, the running total already contains the sum of every value strictly greater than it — which is exactly the extra amount the problem wants added to that node\'s own value. Updating the running total to INCLUDE the current node\'s value before assigning it, not after, is essential: it is what makes the running total correctly reflect "greater than" (excluding the node itself) for every node still to come, while the current node correctly receives its own value plus everything already summed before it.',
    solutionExplanationHi:
      'Nodes ko sabse bade se sabse chhote tak visit karna (normal smallest-to-largest in-order traversal ka mirror image) matlab jis bhi node tak pahuncha jaaye, running total mein pehle se uske sabse zyada saari values ka sum hota hai — yahi exact extra amount hai jo problem us node ki apni value mein jodna chahti hai. Running total ko current node ki value INCLUDE karne ke liye update karna, assign karne se pehle na ki baad mein, zaroori hai: yahi cheez running total ko aage aane wale har node ke liye "greater than" (khud node ko exclude karte hue) sahi reflect karati hai, jabki current node ko apni value plus usse pehle jo bhi sum ho chuka tha, sahi milta hai.',
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

function convertBST(root) {
  // mutate node values in place, return root
  return root;
}

console.log(serialize(convertBST(build(tokens))));`,
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

def convert_bst(root):
    # mutate node values in place, return root
    return root

print(serialize(convert_bst(build(tokens))))`,
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
function convertBST(root) {
  let total = 0;
  function dfs(node) {
    if (!node) return;
    dfs(node.right);
    total += node.val;
    node.val = total;
    dfs(node.left);
  }
  dfs(root);
  return root;
}
console.log(serialize(convertBST(build(tokens))));`,
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

def convert_bst(root):
    total = [0]

    def dfs(node):
        if not node:
            return
        dfs(node.right)
        total[0] += node.val
        node.val = total[0]
        dfs(node.left)

    dfs(root)
    return root

print(serialize(convert_bst(build(tokens))))`,
    ),
    testCases: [
      sample('4 1 6 0 2 5 7', '22 25 13 25 24 18 7'),
      sample('0 null 1', '1 null 1'),
      hidden('', '(empty)'),
      hidden('1', '1'),
      hidden('2 1 3', '5 6 3'),
      hidden('1 0 2', '3 3 2'),
    ],
  },

  {
    slug: 'construct-bst-from-preorder',
    title: 'Construct BST from Preorder Traversal',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Given the preorder traversal of a BST (all values distinct), reconstruct it.\n\n**Input**\nOne line: the preorder traversal, space-separated.\n\n**Output**\nThe reconstructed BST, level order with `null`. `(empty)` for an empty input.',
    descriptionHi:
      'Ek BST ka preorder traversal diya hai (saare values distinct). Use reconstruct karo.\n\n**Input**\nEk line: preorder traversal, space-separated.\n\n**Output**\nReconstructed BST, level order mein `null` ke saath. Khaali input ke liye `(empty)`.',
    examples: [
      { input: '8 5 1 7 10 12', output: '8 5 10 1 7 null 12' },
      { input: '', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 10^4', 'All values distinct'],
    hints: [
      'Unlike the general "construct from preorder and inorder" problem, a BST\'s ordering means the inorder traversal is not actually needed — it can be derived implicitly.',
      'The first value is always the root. Every following value less than it belongs in the left subtree; the first value greater than it marks where the right subtree begins.',
      'A cleaner recursive framing: build each subtree within a bound (min, max) inherited from ancestors, consuming preorder values greedily as long as they fit the current bound — the same idea Validate Binary Search Tree uses, run in reverse to build instead of check.',
    ],
    approach:
      'Recursive, consuming a shared position pointer into the preorder array, with each call bounded by `(min, max)` inherited from its ancestors (mirroring Validate Binary Search Tree). At each call: if the next preorder value does not fit the current bound, this subtree is finished (return null without consuming). Otherwise consume it as this subtree\'s root, then recursively build its left subtree bounded by `(min, rootVal)` and its right subtree bounded by `(rootVal, max)`.',
    approachHi:
      'Recursive, preorder array mein ek shared position pointer consume karte hue, har call `(min, max)` se bounded jo ancestors se inherit hota hai (Validate Binary Search Tree ko mirror karte hue). Har call mein: agar agla preorder value current bound mein fit nahi hota, ye subtree khatam hai (bina consume kiye null return karo). Warna use is subtree ke root ki tarah consume karo, phir uska left subtree `(min, rootVal)` se bounded aur right subtree `(rootVal, max)` se bounded, recursively banao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'This reuses the exact bound-checking idea from Validate Binary Search Tree, but runs it in the opposite direction: instead of checking whether existing values respect inherited bounds, it uses those same inherited bounds to decide how many of the upcoming preorder values belong to the current subtree before greedily consuming them. Because a BST\'s structure is fully determined by value order alone (unlike a general binary tree), no second traversal (like inorder) is needed at all — the bounds alone are enough information to reconstruct the exact tree shape from preorder in a single pass.',
    solutionExplanationHi:
      'Ye Validate Binary Search Tree wala hi bound-checking idea reuse karta hai, bas ulti direction mein: existing values inherited bounds respect karti hain ya nahi check karne ke bajaye, ye wahi inherited bounds use karta hai ye decide karne ke liye ki aane wale preorder values mein se kitne current subtree mein belong karte hain, unhe greedily consume karne se pehle. Chunki BST ka structure sirf value order se poori tarah determined hota hai (general binary tree ke ulat), koi doosra traversal (jaise inorder) bilkul zaroori nahi — sirf bounds hi ek single pass mein preorder se exact tree shape reconstruct karne ke liye kaafi information hain.',
    starter: starter(
      `const preorder = line(0).split(/\\s+/).filter(Boolean).map(Number);

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

function bstFromPreorder(preorder) {
  // return the root node ({val, left, right}) or null
  return null;
}

console.log(serialize(bstFromPreorder(preorder)));`,
      `preorder = list(map(int, line(0).split())) if line(0) else []


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


def bst_from_preorder(preorder):
    # return the root node (a dict with val/left/right) or None
    return None


print(serialize(bst_from_preorder(preorder)))`,
    ),
    solution: solution(
      `const preorder = line(0).split(/\\s+/).filter(Boolean).map(Number);
let idx = 0;
function build(min, max) {
  if (idx === preorder.length || preorder[idx] < min || preorder[idx] > max) return null;
  const val = preorder[idx++];
  return { val, left: build(min, val), right: build(val, max) };
}
const root = build(-Infinity, Infinity);
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
      `preorder = list(map(int, line(0).split())) if line(0) else []
idx = [0]


def build(lo, hi):
    if idx[0] == len(preorder) or preorder[idx[0]] < lo or preorder[idx[0]] > hi:
        return None
    val = preorder[idx[0]]
    idx[0] += 1
    return {"val": val, "left": build(lo, val), "right": build(val, hi)}


root = build(float("-inf"), float("inf"))


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
      sample('8 5 1 7 10 12', '8 5 10 1 7 null 12'),
      sample('', '(empty)'),
      hidden('1', '1'),
      hidden('2 1', '2 1'),
      hidden('1 2', '1 null 2'),
      hidden('5 3 2 4 7 6 8', '5 3 7 2 4 6 8'),
    ],
  },

  {
    slug: 'unique-binary-search-trees',
    title: 'Unique Binary Search Trees',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Count how many structurally unique BSTs can be built storing exactly the values `1` through `n`.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe count of unique BSTs.',
    descriptionHi:
      'Kitne structurally unique BSTs ban sakte hain jo exactly `1` se `n` tak values store karein, count karo.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nUnique BSTs ka count.',
    examples: [
      { input: '3', output: '5' },
      { input: '1', output: '1' },
    ],
    constraints: ['1 <= n <= 19'],
    hints: [
      'If value `i` is chosen as the root, everything smaller (i-1 values) must form the left subtree and everything larger (n-i values) must form the right subtree — independently.',
      'The number of BSTs with root `i` is (number of ways to arrange the left subtree) times (number of ways to arrange the right subtree).',
      'The count of unique BSTs storing k values depends only on k, not on which specific k values they are (any k consecutive integers are structurally interchangeable) — this lets you build a table indexed purely by size.',
    ],
    approach:
      'Dynamic programming. Let `dp[k]` be the number of unique BSTs storing any `k` distinct values, with `dp[0] = dp[1] = 1`. For `k` from 2 to `n`, sum over every possible root position `i` from 1 to `k`: `dp[k] += dp[i-1] * dp[k-i]` (left subtree has `i-1` values, right subtree has `k-i`).',
    approachHi:
      'Dynamic programming. `dp[k]` ko kisi bhi `k` distinct values store karne wale unique BSTs ki sankhya maano, `dp[0] = dp[1] = 1` ke saath. `k` ko 2 se `n` tak, har possible root position `i` (1 se `k` tak) par sum karo: `dp[k] += dp[i-1] * dp[k-i]` (left subtree mein `i-1` values, right subtree mein `k-i`).',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Choosing value i as the root forces a specific split: the i-1 smaller values must all form the left subtree (in some arrangement) and the n-i larger values must all form the right subtree (in some arrangement), and crucially these two arrangements are chosen completely independently of each other, so the count of trees for this particular root choice is the PRODUCT of the two subtree counts, not their sum. Summing that product over every possible root position covers every possible tree exactly once, and the key simplification that makes this a clean 1D table (rather than needing to track which specific values are in play) is that the number of BST shapes for a contiguous range of k values depends only on k, never on which k values they actually are — a fact worth stating explicitly since it is what collapses an apparently exponential combinatorial search into an O(n^2) DP.',
    solutionExplanationHi:
      'Value i ko root chunna ek specific split force karta hai: i-1 chhoti values ko (kisi arrangement mein) poora left subtree banana hai aur n-i badi values ko (kisi arrangement mein) poora right subtree — aur crucially ye dono arrangements ek doosre se poori tarah independently choose hoti hain, isliye is particular root choice ke trees ka count dono subtree counts ka PRODUCT hai, unka sum nahi. Us product ko har possible root position par sum karna har possible tree ko exactly ek baar cover karta hai, aur wo key simplification jo ise ek saaf 1D table banati hai (specific values track karne ki zaroorat ke bina) ye hai ki k consecutive values ke liye BST shapes ka count sirf k par depend karta hai, kabhi ye values kya hain us par nahi — ye fact explicitly bolne layak hai kyunki yahi ek apparently exponential combinatorial search ko O(n^2) DP mein samet deta hai.',
    starter: starter(
      `const n = num(0);

function numTrees(n) {
  // your code here
}

console.log(numTrees(n));`,
      `n = num(0)

def num_trees(n):
    # your code here
    pass

print(num_trees(n))`,
    ),
    solution: solution(
      `const n = num(0);
const dp = new Array(n + 1).fill(0);
dp[0] = 1;
if (n >= 1) dp[1] = 1;
for (let k = 2; k <= n; k++) {
  for (let i = 1; i <= k; i++) dp[k] += dp[i - 1] * dp[k - i];
}
console.log(dp[n]);`,
      `n = num(0)
dp = [0] * (n + 1)
dp[0] = 1
if n >= 1:
    dp[1] = 1
for k in range(2, n + 1):
    for i in range(1, k + 1):
        dp[k] += dp[i - 1] * dp[k - i]
print(dp[n])`,
    ),
    testCases: [
      sample('3', '5'),
      sample('1', '1'),
      hidden('2', '2'),
      hidden('4', '14'),
      hidden('5', '42'),
      hidden('0', '1'),
    ],
  },

  {
    slug: 'bst-iterator',
    title: 'Binary Search Tree Iterator',
    category: 'BST',
    difficulty: 'MEDIUM',
    description:
      'Implement an iterator over a BST that returns the values in ascending (in-order) sequence, supporting `next` (return the next smallest value) and `hasNext`, both averaging O(1) time.\n\n**Input**\n- Line 1: the BST, level order, `null` for missing children\n- Line 2: `q`\n- Next `q` lines: `next` or `hasNext`\n\n**Output**\nOne line per operation: the value for `next`, or `true`/`false` for `hasNext`.',
    descriptionHi:
      'BST par ek aisa iterator implement karo jo values ko ascending (in-order) sequence mein return kare, `next` (agli sabse chhoti value return kare) aur `hasNext` support karte hue, dono average O(1) time mein.\n\n**Input**\n- Line 1: BST, level order, missing children ke liye `null`\n- Line 2: `q`\n- Agli `q` lines: `next` ya `hasNext`\n\n**Output**\nHar operation ke liye ek line: `next` ke liye value, ya `hasNext` ke liye `true`/`false`.',
    examples: [
      {
        input: '7 3 15 null null 9 20\n6\nnext\nnext\nhasNext\nnext\nhasNext\nnext',
        output: '3\n7\ntrue\n9\ntrue\n15',
      },
    ],
    constraints: ['1 <= nodes <= 10^5', '1 <= q <= 10^4'],
    hints: [
      'A full in-order traversal computed up front, stored in an array with a position pointer, technically works but uses O(n) space and does not "stream" the traversal lazily.',
      'For genuine average O(1) time per call without pre-computing the whole sequence, maintain an explicit stack primed with the leftmost path from the root.',
      'On `next`: pop the stack (that is the next smallest value); if the popped node has a right child, push that child and then its entire leftmost path, so the stack is ready for the next call.',
    ],
    approach:
      'Maintain an explicit stack, initialized by pushing every node along the leftmost path from the root. `hasNext` is simply whether the stack is non-empty. `next` pops the top of the stack (the current smallest unvisited value) to return; if that popped node has a right child, push it and then push its entire leftmost path, priming the stack for subsequent calls.',
    approachHi:
      'Ek explicit stack maintain karo, root se leftmost path ke har node ko push karke initialize kiya hua. `hasNext` simply ye hai ki stack non-empty hai ya nahi. `next`, stack ke top ko pop karta hai (current sabse chhoti unvisited value) return karne ke liye; agar us popped node ka right child hai, use push karo aur phir uska poora leftmost path push karo, agli calls ke liye stack ko taiyar karte hue.',
    timeComplexity: 'O(1) amortised per call, O(h) space',
    spaceComplexity: 'O(h) for the stack, rather than O(n) for a fully precomputed sequence',
    solutionExplanation:
      'This is an incremental version of the standard iterative in-order traversal: instead of running the whole "push every left child, then pop-and-push-right" loop to completion up front, it pauses after producing just the next value and resumes exactly where it left off on the following call. Each node is still pushed exactly once and popped exactly once over the lifetime of the iterator, so the total work across ALL calls is O(n) — the same as a full traversal — but spread out per-call, giving amortised O(1) per operation instead of paying the full O(n) traversal cost before returning even the first value.',
    solutionExplanationHi:
      'Ye standard iterative in-order traversal ka ek incremental version hai: poora "har left child push karo, phir pop-and-push-right" loop ek saath complete karne ke bajaye, ye sirf agli value produce karne ke baad rukta hai aur agli call par exactly wahin se resume karta hai jahan chhoda tha. Iterator ki poori lifetime mein har node ab bhi exactly ek baar push aur ek baar pop hota hai, isliye SAARI calls mein total kaam O(n) hai — poori traversal jitna hi — par per-call spread hua, jisse har operation amortised O(1) milta hai, pehli value return karne se pehle hi poora O(n) traversal cost chukaane ke bajaye.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const q = num(1);

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

// Implement an in-order iterator with an explicit stack.
const stack = [];
function pushLeft(node) { while (node) { stack.push(node); node = node.left; } }
pushLeft(build(tokens));

const out = [];
for (let i = 2; i < 2 + q; i++) {
  const op = line(i);
  if (op === 'next') {
    // your code here: pop, prime the stack for the next call, record the value
  } else {
    out.push(String(stack.length > 0));
  }
}
console.log(out.join('\\n'));`,
      `tokens = line(0).split()
q = num(1)


class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None


def build(tokens):
    from collections import deque
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


# Implement an in-order iterator with an explicit stack.
stack = []


def push_left(node):
    while node:
        stack.append(node)
        node = node.left


push_left(build(tokens))

out = []
for i in range(2, 2 + q):
    op = line(i)
    if op == "next":
        # your code here: pop, prime the stack for the next call, record the value
        pass
    else:
        out.append(str(len(stack) > 0).lower())
print("\\n".join(out))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
const q = num(1);
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
const stack = [];
function pushLeft(node) { while (node) { stack.push(node); node = node.left; } }
pushLeft(build(tokens));
const out = [];
for (let i = 2; i < 2 + q; i++) {
  const op = line(i);
  if (op === 'next') {
    const node = stack.pop();
    if (node.right) pushLeft(node.right);
    out.push(String(node.val));
  } else {
    out.push(String(stack.length > 0));
  }
}
console.log(out.join('\\n'));`,
      `from collections import deque
tokens = line(0).split()
q = num(1)


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


stack = []


def push_left(node):
    while node:
        stack.append(node)
        node = node.left


push_left(build(tokens))

out = []
for i in range(2, 2 + q):
    op = line(i)
    if op == "next":
        node = stack.pop()
        if node.right:
            push_left(node.right)
        out.append(str(node.val))
    else:
        out.append(str(len(stack) > 0).lower())
print("\\n".join(out))`,
    ),
    testCases: [
      sample('7 3 15 null null 9 20\n6\nnext\nnext\nhasNext\nnext\nhasNext\nnext', '3\n7\ntrue\n9\ntrue\n15'),
      hidden('1\n2\nnext\nhasNext', '1\nfalse'),
      hidden('2 1\n3\nhasNext\nnext\nnext', 'true\n1\n2'),
    ],
  },

  {
    slug: 'recover-binary-search-tree',
    title: 'Recover Binary Search Tree',
    category: 'BST',
    difficulty: 'HARD',
    description:
      'Exactly two nodes of a BST have had their values accidentally swapped, making it an invalid BST. Recover the tree by fixing those two values back, WITHOUT changing the tree\'s structure.\n\n**Input**\nOne line: the corrupted tree, level order, `null` for missing children.\n\n**Output**\nThe fixed tree, level order with `null`.',
    descriptionHi:
      'Ek BST ke exactly do nodes ki values galti se swap ho gayi hain, jisse wo invalid BST ban gaya hai. Tree ki structure badle bina, un do values ko wapas fix karke tree recover karo.\n\n**Input**\nEk line: corrupted tree, level order, missing children ke liye `null`.\n\n**Output**\nFixed tree, level order mein `null` ke saath.',
    examples: [
      { input: '1 3 null null 2', output: '3 1 null null 2' },
      { input: '3 1 4 null null 2', output: '2 1 4 null null 3' },
    ],
    constraints: ['2 <= nodes <= 1000', 'Exactly two nodes have been swapped'],
    hints: [
      'An in-order traversal of a correct BST is strictly increasing — swapping two node VALUES (not positions) creates exactly one or two places where that increasing order is violated.',
      'Walk the in-order sequence tracking the previous value. Whenever `prev.val > current.val`, that is a violation — the first violation\'s FIRST element and the last violation\'s SECOND element are the two swapped nodes (this correctly handles both adjacent and non-adjacent swaps in a single unified rule).',
      'Once the two misplaced nodes are identified, simply swap their `.val` fields back — the tree\'s pointer structure never needs to change.',
    ],
    approach:
      'In-order traversal tracking the previous node visited. Whenever a violation is found (`prev.val > node.val`), record it: if this is the FIRST violation found, remember `prev` as the first misplaced node; always update the SECOND misplaced node to the current node (so after the whole traversal, it holds the later violation\'s second element, correctly handling both adjacent and non-adjacent swaps). After the traversal, swap the `.val` of the two identified nodes.',
    approachHi:
      'In-order traversal, pichla visit kiya gaya node track karte hue. Jab bhi violation mile (`prev.val > node.val`), use record karo: agar ye PEHLI violation hai, `prev` ko pehle misplaced node ki tarah yaad rakho; DOOSRE misplaced node ko hamesha current node se update karo (taaki poori traversal ke baad, wo baad wali violation ka doosra element rakhe, adjacent aur non-adjacent dono swaps sahi handle karte hue). Traversal ke baad, do identified nodes ka `.val` swap kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth, O(1) extra beyond that',
    solutionExplanation:
      'Swapping two values in a sorted sequence creates either one violation (if the swapped values were adjacent in sorted order) or two separate violations (if they were far apart) — the unifying trick is that the FIRST element of the FIRST violation and the SECOND element of the LAST violation are always exactly the two swapped values, in both cases. This is provable by considering that everything strictly between the two swapped positions in the sorted sequence remains correctly ordered relative to its immediate neighbors, so violations can only appear at the two boundaries where a swapped value meets its new (wrong) neighbor. Because the fix only reassigns `.val` fields and never touches `.left`/`.right` pointers, the tree\'s shape is provably unchanged.',
    solutionExplanationHi:
      'Ek sorted sequence mein do values swap karna ya to ek violation banata hai (agar swapped values sorted order mein adjacent thi) ya do alag violations (agar wo door thi) — unifying trick ye hai ki PEHLI violation ka PEHLA element aur AAKHRI violation ka DOOSRA element hamesha exactly wahi do swapped values hote hain, dono cases mein. Ye is baat se provable hai ki sorted sequence mein do swapped positions ke bilkul beech mein jo bhi hai wo apne immediate neighbors ke relative sahi order mein hi rehta hai, isliye violations sirf un do boundaries par aa sakte hain jahan ek swapped value apne naye (galat) neighbor se milti hai. Chunki fix sirf `.val` fields reassign karta hai aur kabhi `.left`/`.right` pointers touch nahi karta, tree ka shape provably unchanged rehta hai.',
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

function recoverTree(root) {
  // mutate node .val fields in place to fix the tree, return root
  return root;
}

console.log(serialize(recoverTree(build(tokens))));`,
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

def recover_tree(root):
    # mutate node .val fields in place to fix the tree, return root
    return root

print(serialize(recover_tree(build(tokens))))`,
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
function recoverTree(root) {
  let prev = null, first = null, second = null;
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    dfs(node.right);
  }
  dfs(root);
  if (first && second) { const t = first.val; first.val = second.val; second.val = t; }
  return root;
}
console.log(serialize(recoverTree(build(tokens))));`,
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

def recover_tree(root):
    state = {"prev": None, "first": None, "second": None}

    def dfs(node):
        if not node:
            return
        dfs(node.left)
        if state["prev"] and state["prev"].val > node.val:
            if not state["first"]:
                state["first"] = state["prev"]
            state["second"] = node
        state["prev"] = node
        dfs(node.right)

    dfs(root)
    if state["first"] and state["second"]:
        state["first"].val, state["second"].val = state["second"].val, state["first"].val
    return root

print(serialize(recover_tree(build(tokens))))`,
    ),
    testCases: [
      sample('1 3 null null 2', '3 1 null null 2'),
      sample('3 1 4 null null 2', '2 1 4 null null 3'),
      hidden('2 1', '2 1'),
      hidden('1 2', '2 1'),
      hidden('5 2 8 1 9 7 10', '9 2 8 1 5 7 10'),
    ],
  },
];
