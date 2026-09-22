import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Trees — expansion batch, part 2 of 2. Continues from dsa-extra-trees.ts
 * with level-view problems (right side view, zigzag), tree construction from
 * traversals, structural rewiring (flatten, next pointers), LCA, iterative
 * traversal via an explicit stack, and the two HARD closers (maximum path
 * sum, serialize/deserialize). Same level-order `null`-marked flat encoding
 * throughout.
 */
export const dsaExtraTrees2: SeedProblem[] = [
  {
    slug: 'sum-root-to-leaf-numbers',
    title: 'Sum Root to Leaf Numbers',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Each root-to-leaf path represents a number formed by concatenating its digits (each node value is a single digit 0-9). Sum the numbers formed by every root-to-leaf path.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe total sum.',
    descriptionHi:
      'Har root-to-leaf path apne digits ko concatenate karke ek number banata hai (har node value ek single digit 0-9 hai). Har root-to-leaf path se bane numbers ka sum nikalo.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nTotal sum.',
    examples: [
      { input: '1 2 3', output: '25', explanation: 'Paths 1->2 (12) and 1->3 (13): 12+13=25.' },
      { input: '4 9 0 5 1', output: '1026' },
    ],
    constraints: ['1 <= nodes <= 1000', '0 <= value <= 9'],
    hints: [
      'Carry the number built so far down the recursion, the same way you would build a number digit by digit.',
      'At each node, the running number becomes `runningNumber * 10 + node.val`.',
      'Only add the running number to the total once a leaf is reached — a partial path is not yet a complete number.',
    ],
    approach:
      'DFS carrying a `runningNumber`. At each node, update it to `runningNumber * 10 + node.val`. At a leaf, add this updated value to a running total. Otherwise recurse into both children with the updated running number.',
    approachHi:
      'DFS jo ek `runningNumber` carry karta hai. Har node par, use `runningNumber * 10 + node.val` se update karo. Ek leaf par, ye updated value running total mein jodo. Warna dono children mein updated running number ke saath recurse karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'Multiplying by 10 and adding the next digit at every step is exactly how a number is built left to right — the same technique as reading a number character by character — so the running value carried down the tree is always the correctly-formed prefix number for the path taken so far. Adding to the total only at leaves (not at every node) is what ensures only complete root-to-leaf paths are counted, matching the problem\'s own definition of what a valid "number" is.',
    solutionExplanationHi:
      'Har step par 10 se multiply karke agla digit jodna, exactly wahi hai jaise ek number left se right banaya jaata hai — bilkul wahi technique jo ek number ko character-by-character padhne mein use hoti — isliye tree mein neeche carry ho rahi running value hamesha ab tak liye gaye path ka sahi-bana prefix number hoti hai. Total mein sirf leaves par jodna (har node par nahi) ensure karta hai ki sirf complete root-to-leaf paths hi count hon, jo problem ki apni "number" ki definition se match karta hai.',
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

function sumNumbers(node, running = 0) {
  // your code here
}

console.log(sumNumbers(build(tokens)));`,
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

def sum_numbers(node, running=0):
    # your code here
    pass

print(sum_numbers(build(tokens)))`,
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
function sumNumbers(node, running = 0) {
  if (!node) return 0;
  const next = running * 10 + node.val;
  if (!node.left && !node.right) return next;
  return sumNumbers(node.left, next) + sumNumbers(node.right, next);
}
console.log(sumNumbers(build(tokens)));`,
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

def sum_numbers(node, running=0):
    if not node:
        return 0
    nxt = running * 10 + node.val
    if not node.left and not node.right:
        return nxt
    return sum_numbers(node.left, nxt) + sum_numbers(node.right, nxt)

print(sum_numbers(build(tokens)))`,
    ),
    testCases: [
      sample('1 2 3', '25'),
      sample('4 9 0 5 1', '1026'),
      hidden('0', '0'),
      hidden('5', '5'),
      hidden('1 2', '12'),
      hidden('1 null 2', '12'),
    ],
  },

  {
    slug: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Return the values visible when looking at the tree from the right side, ordered from top to bottom.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe visible values, space-separated on one line.',
    descriptionHi:
      'Tree ko right side se dekhne par jo values dikhti hain, wo top se bottom order mein return karo.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nVisible values, ek line par space-separated.',
    examples: [
      { input: '1 2 3 null 5 null 4', output: '1 3 4' },
      { input: '1 null 3', output: '1 3' },
    ],
    constraints: ['0 <= nodes <= 100'],
    hints: [
      'BFS level by level is the most direct approach — the rightmost node of each level is exactly what is visible from the right.',
      'While processing a level\'s nodes left to right, the last one processed is the one to record.',
      'Alternatively, a right-then-left DFS can work too: the first node reached at each new depth is the rightmost one at that depth.',
    ],
    approach:
      'BFS with a queue, level by level (same size-snapshot technique as Level Order Traversal). For each level, record the value of the LAST node processed (the rightmost one at that depth) into the answer.',
    approachHi:
      'Queue ke saath BFS, level by level (Level Order Traversal wali hi size-snapshot technique). Har level ke liye, process hue AAKHRI node (us depth ka sabse right wala) ki value answer mein record karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(width)',
    solutionExplanation:
      'Standing to the right of the tree and looking left, the only node visible at each depth is whichever one is furthest to the right at that depth — since anything to its left is hidden behind it from that viewing angle. Processing each BFS level strictly left to right means the last node dequeued in that level\'s batch is, by construction, the rightmost one, so simply keeping track of "the last one seen this level" directly answers the question without any extra bookkeeping.',
    solutionExplanationHi:
      'Tree ke right taraf khade hokar left dekhne par, har depth par sirf wahi node dikhta hai jo us depth par sabse right mein hai — kyunki uske left ka sab kuch us viewing angle se uske peeche chhup jaata hai. Har BFS level ko strictly left-se-right process karna matlab us level ke batch mein sabse aakhri dequeue hua node, construction se hi, sabse right wala hai — isliye bas "is level mein sabse aakhri dekha gaya" track karna, bina kisi extra bookkeeping ke, seedha jawab deta hai.',
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

function rightSideView(root) {
  // return an array of visible values
  return [];
}

console.log(rightSideView(build(tokens)).join(' '));`,
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

def right_side_view(root):
    # return a list of visible values
    return []

print(" ".join(map(str, right_side_view(build(tokens)))))`,
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
function rightSideView(root) {
  const out = [];
  let queue = root ? [root] : [];
  while (queue.length) {
    out.push(queue[queue.length - 1].val);
    const next = [];
    for (const node of queue) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return out;
}
console.log(rightSideView(build(tokens)).join(' '));`,
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

def right_side_view(root):
    out = []
    queue = deque([root]) if root else deque()
    while queue:
        out.append(queue[-1].val)
        nxt = deque()
        for node in queue:
            if node.left:
                nxt.append(node.left)
            if node.right:
                nxt.append(node.right)
        queue = nxt
    return out

print(" ".join(map(str, right_side_view(build(tokens)))))`,
    ),
    testCases: [
      sample('1 2 3 null 5 null 4', '1 3 4'),
      sample('1 null 3', '1 3'),
      hidden('', ''),
      hidden('1', '1'),
      hidden('1 2 3', '1 3'),
      hidden('1 2 null 3', '1 2 3'),
    ],
  },

  {
    slug: 'binary-tree-zigzag-level-order',
    title: 'Binary Tree Zigzag Level Order Traversal',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Print the tree level by level, alternating direction: the first level left to right, the next right to left, and so on.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nOne level per line, space-separated. `(empty)` for an empty tree.',
    descriptionHi:
      'Tree ko level by level print karo, direction alternate karte hue: pehla level left-to-right, agla right-to-left, aur aise hi.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nHar line par ek level, space-separated. Khaali tree ke liye `(empty)`.',
    examples: [
      { input: '3 9 20 null null 15 7', output: '3\n20 9\n15 7' },
      { input: '1', output: '1' },
    ],
    constraints: ['0 <= nodes <= 2000'],
    hints: [
      'This is Level Order Traversal with one extra step: alternating the print direction per level.',
      'It is simplest to collect each level left-to-right as usual (via BFS), and only reverse the level\'s array before printing on alternate levels.',
      'Track whether the current level index is even or odd to decide whether to reverse.',
    ],
    approach:
      'BFS level by level exactly as in Level Order Traversal, collecting each level\'s values left to right. Track a level index (or a toggling boolean); before printing/recording a level whose index is odd, reverse that level\'s array first.',
    approachHi:
      'Bilkul Level Order Traversal jaisa BFS level by level, har level ki values left-to-right collect karte hue. Ek level index (ya ek toggling boolean) track karo; jis level ka index odd hai, use print/record karne se pehle uske array ko reverse kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(width)',
    solutionExplanation:
      'The underlying traversal never actually changes direction — BFS always discovers nodes left to right within a level, because that is simply the order children were enqueued in. The "zigzag" is purely a presentation transformation applied AFTER collecting each level normally: reversing the already-collected array for alternate levels is far simpler and less error-prone than trying to make the traversal itself walk right-to-left, which would require separately tracking and reversing child-enqueue order.',
    solutionExplanationHi:
      'Underlying traversal asal mein kabhi direction nahi badalta — BFS hamesha ek level ke andar left-to-right hi nodes discover karta hai, kyunki bas isi order mein children enqueue hue the. "Zigzag" poori tarah ek presentation transformation hai jo har level normally collect karne ke BAAD apply hoti hai: alternate levels ke already-collected array ko reverse karna, traversal ko khud right-to-left chalane ki koshish se kaafi simpler aur kam error-prone hai, jismein child-enqueue order ko alag se track aur reverse karna padta.',
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

function zigzagLevelOrder(root) {
  // return an array of levels (each level left-to-right or right-to-left as required)
  return [];
}

const levels = zigzagLevelOrder(build(tokens));
if (!levels.length) console.log('(empty)');
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

def zigzag_level_order(root):
    # return a list of levels (each level left-to-right or right-to-left as required)
    return []

levels = zigzag_level_order(build(tokens))
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
function zigzagLevelOrder(root) {
  const levels = [];
  let queue = root ? [root] : [];
  let leftToRight = true;
  while (queue.length) {
    const vals = queue.map((n) => n.val);
    levels.push(leftToRight ? vals : vals.reverse());
    const next = [];
    for (const node of queue) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
    leftToRight = !leftToRight;
  }
  return levels;
}
const levels = zigzagLevelOrder(build(tokens));
if (!levels.length) console.log('(empty)');
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

def zigzag_level_order(root):
    levels = []
    queue = deque([root]) if root else deque()
    left_to_right = True
    while queue:
        vals = [n.val for n in queue]
        levels.append(vals if left_to_right else vals[::-1])
        nxt = deque()
        for node in queue:
            if node.left:
                nxt.append(node.left)
            if node.right:
                nxt.append(node.right)
        queue = nxt
        left_to_right = not left_to_right
    return levels

levels = zigzag_level_order(build(tokens))
if not levels:
    print("(empty)")
else:
    for lv in levels:
        print(" ".join(map(str, lv)))`,
    ),
    testCases: [
      sample('3 9 20 null null 15 7', '3\n20 9\n15 7'),
      sample('1', '1'),
      hidden('', '(empty)'),
      hidden('1 2 3', '1\n3 2'),
      hidden('1 2 3 4 5 6 7', '1\n3 2\n4 5 6 7'),
    ],
  },

  {
    slug: 'construct-binary-tree-preorder-inorder',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Given a tree\'s preorder and inorder traversals (all values distinct), reconstruct the tree.\n\n**Input**\n- Line 1: preorder traversal, space-separated\n- Line 2: inorder traversal, space-separated\n\n**Output**\nThe reconstructed tree, level order with `null` for missing children. `(empty)` for an empty tree.',
    descriptionHi:
      'Ek tree ke preorder aur inorder traversals diye hain (saare values distinct). Tree reconstruct karo.\n\n**Input**\n- Line 1: preorder traversal, space-separated\n- Line 2: inorder traversal, space-separated\n\n**Output**\nReconstructed tree, level order mein `null` ke saath. Khaali tree ke liye `(empty)`.',
    examples: [
      { input: '3 9 20 15 7\n9 3 15 20 7', output: '3 9 20 null null 15 7' },
      { input: '', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 3000', 'All values distinct'],
    hints: [
      'The first value of a preorder traversal is always the root of that (sub)tree.',
      'Once you know the root, its position in the inorder traversal splits it into the left subtree\'s inorder sequence (everything before it) and the right subtree\'s (everything after).',
      'The preorder traversal splits at the same relative sizes: the next `leftSize` values after the root belong to the left subtree, and the rest to the right.',
    ],
    approach:
      'Recursive: take the first element of the current preorder slice as the root. Find that value\'s index in the current inorder slice — everything before it is the left subtree\'s inorder sequence, everything after is the right subtree\'s. Use those sizes to slice the corresponding parts out of the preorder sequence (skipping the root), and recurse into both.',
    approachHi:
      'Recursive: current preorder slice ke pehle element ko root maano. Us value ka current inorder slice mein index dhoondo — usse pehle sab left subtree ka inorder sequence hai, uske baad sab right subtree ka. In sizes ka use karke preorder sequence ke corresponding parts nikaalo (root skip karke), aur dono mein recurse karo.',
    timeComplexity: 'O(n) with a value-to-index map, O(n^2) naive with linear search',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Preorder always visits root-left-right, so its very first element is unambiguously the root — that alone is not enough to know the subtree boundaries, though, which is exactly what inorder\'s left-root-right structure supplies: locating the root within the inorder sequence tells you exactly how many nodes belong to the left subtree (everything to its left) versus the right (everything to its right), and that count is what lets the preorder sequence be split at the matching position, since preorder must list the entire left subtree before starting the right one.',
    solutionExplanationHi:
      'Preorder hamesha root-left-right visit karta hai, isliye uska pehla element unambiguously root hota hai — bas itna hi subtree boundaries jaanne ke liye kaafi nahi, aur yahi cheez inorder ka left-root-right structure deta hai: inorder sequence mein root ko locate karna exactly bata deta hai ki left subtree mein kitne nodes hain (uske left mein sab) vs right mein (uske right mein sab), aur yahi count preorder sequence ko matching position par split karne deta hai, kyunki preorder ko right subtree shuru karne se pehle poora left subtree list karna hi hota hai.',
    starter: starter(
      `const preorder = line(0).split(/\\s+/).filter(Boolean).map(Number);
const inorder = line(1).split(/\\s+/).filter(Boolean).map(Number);

function buildTree(preorder, inorder) {
  // return the root node ({val, left, right}) or null
  return null;
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

console.log(serialize(buildTree(preorder, inorder)));`,
      `preorder = list(map(int, line(0).split())) if line(0) else []
inorder = list(map(int, line(1).split())) if line(1) else []


def build_tree(preorder, inorder):
    # return the root node (an object with val/left/right) or None
    return None


class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None


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
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)


print(serialize(build_tree(preorder, inorder)))`,
    ),
    solution: solution(
      `const preorder = line(0).split(/\\s+/).filter(Boolean).map(Number);
const inorder = line(1).split(/\\s+/).filter(Boolean).map(Number);
const inIndex = new Map();
inorder.forEach((v, i) => inIndex.set(v, i));
let preIdx = 0;
function build(inLo, inHi) {
  if (inLo > inHi) return null;
  const rootVal = preorder[preIdx++];
  const node = { val: rootVal, left: null, right: null };
  const mid = inIndex.get(rootVal);
  node.left = build(inLo, mid - 1);
  node.right = build(mid + 1, inHi);
  return node;
}
const root = inorder.length ? build(0, inorder.length - 1) : null;
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
inorder = list(map(int, line(1).split())) if line(1) else []


class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None


in_index = {v: i for i, v in enumerate(inorder)}
pre_idx = [0]


def build(in_lo, in_hi):
    if in_lo > in_hi:
        return None
    root_val = preorder[pre_idx[0]]
    pre_idx[0] += 1
    node = Node(root_val)
    mid = in_index[root_val]
    node.left = build(in_lo, mid - 1)
    node.right = build(mid + 1, in_hi)
    return node


root = build(0, len(inorder) - 1) if inorder else None


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
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)


print(serialize(root))`,
    ),
    testCases: [
      sample('3 9 20 15 7\n9 3 15 20 7', '3 9 20 null null 15 7'),
      sample('\n', '(empty)'),
      hidden('1\n1', '1'),
      hidden('1 2\n2 1', '1 2'),
      hidden('1 2\n1 2', '1 null 2'),
      hidden('5 3 1 4 8 7 9\n1 3 4 5 7 8 9', '5 3 8 1 4 7 9'),
    ],
  },

  {
    slug: 'construct-binary-tree-inorder-postorder',
    title: 'Construct Binary Tree from Inorder and Postorder Traversal',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Given a tree\'s inorder and postorder traversals (all values distinct), reconstruct the tree.\n\n**Input**\n- Line 1: inorder traversal, space-separated\n- Line 2: postorder traversal, space-separated\n\n**Output**\nThe reconstructed tree, level order with `null` for missing children. `(empty)` for an empty tree.',
    descriptionHi:
      'Ek tree ke inorder aur postorder traversals diye hain (saare values distinct). Tree reconstruct karo.\n\n**Input**\n- Line 1: inorder traversal, space-separated\n- Line 2: postorder traversal, space-separated\n\n**Output**\nReconstructed tree, level order mein `null` ke saath. Khaali tree ke liye `(empty)`.',
    examples: [
      { input: '9 3 15 20 7\n9 15 7 20 3', output: '3 9 20 null null 15 7' },
      { input: '', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 3000', 'All values distinct'],
    hints: [
      'This mirrors Construct from Preorder/Inorder, but the LAST value of a postorder traversal is the root instead of the first.',
      'Once the root is known, its position in the inorder sequence still splits left and right subtrees the same way.',
      'Because postorder visits left-right-root, consuming it from the END backward (root first, then right subtree, then left subtree) makes the recursion symmetric to the preorder version.',
    ],
    approach:
      'Recursive, symmetric to the preorder version: take the LAST element of the current postorder slice as the root, find its position in the inorder slice to determine subtree sizes, then build the RIGHT subtree first (consuming from the end of postorder backward), followed by the LEFT subtree.',
    approachHi:
      'Recursive, preorder version ka symmetric: current postorder slice ke AAKHRI element ko root maano, subtree sizes tay karne ke liye inorder slice mein uska position dhoondo, phir pehle RIGHT subtree banao (postorder ko end se peeche consume karte hue), uske baad LEFT subtree.',
    timeComplexity: 'O(n) with a value-to-index map',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Postorder visits left-right-root, so its LAST element (rather than first, as in preorder) is the root — everything else follows by symmetry: since postorder finishes the right subtree immediately before the root, consuming values from the end of the postorder sequence backward naturally yields the right subtree first, then the left, which is the mirror image of how the preorder-based construction consumes forward through root-left-right.',
    solutionExplanationHi:
      'Postorder left-right-root visit karta hai, isliye uska AAKHRI element (preorder ki tarah pehla nahi) root hota hai — baaki sab symmetry se follow hota hai: chunki postorder root se turant pehle right subtree khatam karta hai, postorder sequence ke end se peeche values consume karna naturally pehle right subtree deta hai, phir left — jo preorder-based construction ke root-left-right forward consume karne ka mirror image hai.',
    starter: starter(
      `const inorder = line(0).split(/\\s+/).filter(Boolean).map(Number);
const postorder = line(1).split(/\\s+/).filter(Boolean).map(Number);

function buildTree(inorder, postorder) {
  // return the root node ({val, left, right}) or null
  return null;
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

console.log(serialize(buildTree(inorder, postorder)));`,
      `inorder = list(map(int, line(0).split())) if line(0) else []
postorder = list(map(int, line(1).split())) if line(1) else []


def build_tree(inorder, postorder):
    # return the root node (an object with val/left/right) or None
    return None


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
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)


print(serialize(build_tree(inorder, postorder)))`,
    ),
    solution: solution(
      `const inorder = line(0).split(/\\s+/).filter(Boolean).map(Number);
const postorder = line(1).split(/\\s+/).filter(Boolean).map(Number);
const inIndex = new Map();
inorder.forEach((v, i) => inIndex.set(v, i));
let postIdx = postorder.length - 1;
function build(inLo, inHi) {
  if (inLo > inHi) return null;
  const rootVal = postorder[postIdx--];
  const node = { val: rootVal, left: null, right: null };
  const mid = inIndex.get(rootVal);
  node.right = build(mid + 1, inHi);
  node.left = build(inLo, mid - 1);
  return node;
}
const root = inorder.length ? build(0, inorder.length - 1) : null;
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
      `inorder = list(map(int, line(0).split())) if line(0) else []
postorder = list(map(int, line(1).split())) if line(1) else []


class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None


in_index = {v: i for i, v in enumerate(inorder)}
post_idx = [len(postorder) - 1]


def build(in_lo, in_hi):
    if in_lo > in_hi:
        return None
    root_val = postorder[post_idx[0]]
    post_idx[0] -= 1
    node = Node(root_val)
    mid = in_index[root_val]
    node.right = build(mid + 1, in_hi)
    node.left = build(in_lo, mid - 1)
    return node


root = build(0, len(inorder) - 1) if inorder else None


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
        out.append(str(node.val))
        q.append(node.left)
        q.append(node.right)
    while out and out[-1] == "null":
        out.pop()
    return " ".join(out)


print(serialize(root))`,
    ),
    testCases: [
      sample('9 3 15 20 7\n9 15 7 20 3', '3 9 20 null null 15 7'),
      sample('\n', '(empty)'),
      hidden('1\n1', '1'),
      hidden('2 1\n2 1', '1 2'),
      hidden('1 2\n1 2', '2 1'),
      hidden('1 3 4 5 7 8 9\n1 4 3 7 9 8 5', '5 3 8 1 4 7 9'),
    ],
  },

  {
    slug: 'flatten-binary-tree-to-linked-list',
    title: 'Flatten Binary Tree to Linked List',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Flatten the tree into a "linked list" that follows the same order as preorder traversal, using each node\'s `right` pointer as the "next" link and setting `left` to null everywhere.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe flattened values, space-separated, following the chain of `right` pointers from the root.',
    descriptionHi:
      'Tree ko ek "linked list" mein flatten karo jo preorder traversal jaisa hi order follow kare, har node ke `right` pointer ko "next" link ki tarah use karke aur `left` ko har jagah null set karke.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nFlattened values, space-separated, root se `right` pointers ki chain follow karte hue.',
    examples: [
      { input: '1 2 5 3 4 null 6', output: '1 2 3 4 5 6' },
      { input: '', output: '' },
    ],
    constraints: ['0 <= nodes <= 2000'],
    hints: [
      'The target order is exactly preorder (root, then left subtree, then right subtree) — the challenge is achieving it with in-place pointer rewiring, not a fresh traversal into a new structure.',
      'A clean recursive approach: recursively flatten the left and right subtrees first, then splice the (now-flattened) left chain in between the root and the (now-flattened) right chain.',
      'After splicing the left chain in, the original right subtree must be reattached at the very end of that spliced-in left chain.',
    ],
    approach:
      'Recursive: flatten the left subtree and the right subtree first (post-order-like recursion on subtree structure, though the target shape is preorder). Then: save the original right child, set `node.right` to the (now flattened) left chain and `node.left` to null, walk to the end of that newly attached chain, and attach the saved original right subtree there.',
    approachHi:
      'Recursive: pehle left subtree aur right subtree ko flatten karo (subtree structure par post-order-jaisi recursion, chahe target shape preorder ho). Phir: original right child save karo, `node.right` ko (ab flattened) left chain par set karo aur `node.left` ko null, us newly attached chain ke end tak chalo, aur wahan saved original right subtree attach karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The tricky part is that once `node.right` is overwritten to point at the flattened left chain, the ORIGINAL right subtree would be lost unless it is saved first — this is a classic "save before you overwrite" pointer-rewiring pitfall, the same class of bug flagged in Reverse Linked List. Flattening children before splicing at the parent (bottom-up) guarantees the left and right chains being spliced together are already fully flattened by the time they are used, so no partial structure ever leaks into the final list.',
    solutionExplanationHi:
      'Tricky hissa ye hai ki jaise hi `node.right` ko overwrite karke flattened left chain par point karaya jaata hai, ORIGINAL right subtree kho jaayega jab tak use pehle save na kiya jaaye — ye ek classic "overwrite karne se pehle save karo" pointer-rewiring pitfall hai, bilkul wahi bug class jo Reverse Linked List mein flag hui thi. Parent par splice karne se pehle children ko flatten karna (bottom-up) guarantee karta hai ki splice ki jaane wali left aur right chains use hone tak already poori tarah flattened hon, isliye final list mein koi partial structure leak nahi hoti.',
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

function flatten(node) {
  // mutate in place
}

const root = build(tokens);
flatten(root);
const out = [];
for (let p = root; p; p = p.right) out.push(p.val);
console.log(out.join(' '));`,
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

def flatten(node):
    # mutate in place
    pass

root = build(tokens)
flatten(root)
out = []
p = root
while p:
    out.append(p.val)
    p = p.right
print(" ".join(map(str, out)))`,
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
function flatten(node) {
  if (!node) return;
  flatten(node.left);
  flatten(node.right);
  const originalRight = node.right;
  node.right = node.left;
  node.left = null;
  let curr = node;
  while (curr.right) curr = curr.right;
  curr.right = originalRight;
}
const root = build(tokens);
flatten(root);
const out = [];
for (let p = root; p; p = p.right) out.push(p.val);
console.log(out.join(' '));`,
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

def flatten(node):
    if not node:
        return
    flatten(node.left)
    flatten(node.right)
    original_right = node.right
    node.right = node.left
    node.left = None
    curr = node
    while curr.right:
        curr = curr.right
    curr.right = original_right

root = build(tokens)
flatten(root)
out = []
p = root
while p:
    out.append(p.val)
    p = p.right
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('1 2 5 3 4 null 6', '1 2 3 4 5 6'),
      sample('', ''),
      hidden('1', '1'),
      hidden('1 2', '1 2'),
      hidden('1 null 2', '1 2'),
      hidden('1 2 3', '1 2 3'),
    ],
  },

  {
    slug: 'populating-next-right-pointers',
    title: 'Populating Next Right Pointers in Each Node',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Given a PERFECT binary tree (every level completely filled), set each node\'s `next` pointer to the node immediately to its right at the same level, or `null` if it is the rightmost node of its level.\n\n**Input**\nOne line: the tree in level order (a perfect tree, so no `null` tokens appear).\n\n**Output**\nFor each node in level order, print `val -> nextValOrNULL`, one per line.',
    descriptionHi:
      'Ek PERFECT binary tree diya hai (har level poori tarah bhara hua). Har node ka `next` pointer, usi level mein uske turant right wale node par set karo, ya `null` agar wo apne level ka sabse right node hai.\n\n**Input**\nEk line: tree level order mein (perfect tree hai, isliye koi `null` tokens nahi aate).\n\n**Output**\nHar node ke liye level order mein, `val -> nextValOrNULL` print karo, ek line par ek.',
    examples: [
      { input: '1 2 3 4 5 6 7', output: '1 -> NULL\n2 -> 3\n3 -> NULL\n4 -> 5\n5 -> 6\n6 -> 7\n7 -> NULL' },
      { input: '1', output: '1 -> NULL' },
    ],
    constraints: ['0 <= nodes <= 4095', 'The tree is perfect (every level fully filled)'],
    hints: [
      'A plain BFS with a queue solves this directly: within each level, link each node to the next one in the queue at that same level.',
      'For O(1) extra space (beyond the queue-free ideal), a perfect tree allows a cleverer approach: once level `d`\'s next pointers are set, you can traverse level `d` via those very next pointers to link up level `d+1` without a queue at all.',
      'A node\'s next-level child\'s next pointer is: its own right child\'s next is the next node\'s left child (if a next node exists on this level).',
    ],
    approach:
      'BFS level by level (same size-snapshot technique as Level Order Traversal). Within each level, link consecutive nodes\' `next` pointers to each other, and set the last node\'s `next` to null.',
    approachHi:
      'BFS level by level (Level Order Traversal wali hi size-snapshot technique). Har level ke andar, consecutive nodes ke `next` pointers ek doosre se link karo, aur aakhri node ka `next` null set karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(width) for the BFS queue (O(1) extra possible using the perfect-tree next-pointer trick)',
    solutionExplanation:
      'A plain BFS already visits each level\'s nodes in left-to-right order, which is exactly the order the next pointers need to connect — so linking each node to the one immediately following it in that same BFS batch, then closing the level with a null, is a direct, low-risk implementation. The O(1)-space variant (traversing level d via its own already-set next pointers, to link up level d+1 without ever queuing anything) only works because the tree is perfect — for a non-perfect tree, that trick breaks because a node might have no left or right child to descend into at a expected position.',
    solutionExplanationHi:
      'Ek plain BFS pehle se hi har level ke nodes ko left-to-right order mein visit karta hai, jo exactly wahi order hai jismein next pointers ko connect hona hai — isliye har node ko usi BFS batch mein turant baad wale se link karna, phir level ko null se close karna, ek direct, low-risk implementation hai. O(1)-space variant (level d ko uske apne already-set next pointers se traverse karke, level d+1 ko bina kuch queue kiye link karna) sirf isliye kaam karta hai kyunki tree perfect hai — non-perfect tree ke liye, ye trick tootta hai kyunki kisi node ke expected position par left ya right child hi na ho.',
    starter: starter(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);

function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null, next: null };
  const q = [root];
  let i = 1;
  while (q.length && i < tokens.length) {
    const node = q.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null, next: null }; q.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null, next: null }; q.push(node.right); }
    i++;
  }
  return root;
}

function connect(root) {
  // mutate .next pointers in place, return root
  return root;
}

const root = connect(build(tokens));
const out = [];
let levelStart = root;
while (levelStart) {
  let p = levelStart;
  while (p) { out.push(p.val + ' -> ' + (p.next ? p.next.val : 'NULL')); p = p.next; }
  levelStart = levelStart.left;
}
console.log(out.join('\\n'));`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None
        self.next = None

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

def connect(root):
    # mutate .next pointers in place, return root
    return root

root = connect(build(tokens))
out = []
level_start = root
while level_start:
    p = level_start
    while p:
        out.append(f"{p.val} -> {p.next.val if p.next else 'NULL'}")
        p = p.next
    level_start = level_start.left
print("\\n".join(out))`,
    ),
    solution: solution(
      `const tokens = line(0).split(/\\s+/).filter(Boolean);
function build(tokens) {
  if (!tokens.length || tokens[0] === 'null') return null;
  const root = { val: Number(tokens[0]), left: null, right: null, next: null };
  const q = [root];
  let i = 1;
  while (q.length && i < tokens.length) {
    const node = q.shift();
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.left = { val: Number(tokens[i]), left: null, right: null, next: null }; q.push(node.left); }
    i++;
    if (tokens[i] !== undefined && tokens[i] !== 'null') { node.right = { val: Number(tokens[i]), left: null, right: null, next: null }; q.push(node.right); }
    i++;
  }
  return root;
}
function connect(root) {
  let queue = root ? [root] : [];
  while (queue.length) {
    for (let i = 0; i < queue.length; i++) queue[i].next = queue[i + 1] || null;
    const next = [];
    for (const node of queue) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return root;
}
const root = connect(build(tokens));
const out = [];
let levelStart = root;
while (levelStart) {
  let p = levelStart;
  while (p) { out.push(p.val + ' -> ' + (p.next ? p.next.val : 'NULL')); p = p.next; }
  levelStart = levelStart.left;
}
console.log(out.join('\\n'));`,
      `from collections import deque
tokens = line(0).split()

class Node:
    def __init__(self, v):
        self.val = v
        self.left = None
        self.right = None
        self.next = None

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

def connect(root):
    queue = deque([root]) if root else deque()
    while queue:
        nodes = list(queue)
        for i, node in enumerate(nodes):
            node.next = nodes[i + 1] if i + 1 < len(nodes) else None
        nxt = deque()
        for node in nodes:
            if node.left:
                nxt.append(node.left)
            if node.right:
                nxt.append(node.right)
        queue = nxt
    return root

root = connect(build(tokens))
out = []
level_start = root
while level_start:
    p = level_start
    while p:
        out.append(f"{p.val} -> {p.next.val if p.next else 'NULL'}")
        p = p.next
    level_start = level_start.left
print("\\n".join(out))`,
    ),
    testCases: [
      sample('1 2 3 4 5 6 7', '1 -> NULL\n2 -> 3\n3 -> NULL\n4 -> 5\n5 -> 6\n6 -> 7\n7 -> NULL'),
      sample('1', '1 -> NULL'),
      hidden('', ''),
      hidden('1 2 3', '1 -> NULL\n2 -> 3\n3 -> NULL'),
    ],
  },

  {
    slug: 'lowest-common-ancestor-binary-tree',
    title: 'Lowest Common Ancestor of a Binary Tree',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Given a general binary tree (not necessarily a BST) and two distinct values `p` and `q` both guaranteed to exist in it, find the value of their lowest common ancestor.\n\n**Input**\n- Line 1: the tree, level order, `null` for missing children\n- Line 2: `p`\n- Line 3: `q`\n\n**Output**\nThe value of the lowest common ancestor.',
    descriptionHi:
      'Ek general binary tree (zaroori nahi ki BST ho) aur do distinct values `p` aur `q` diye hain (dono guaranteed tree mein hain). Unke lowest common ancestor ki value dhoondo.\n\n**Input**\n- Line 1: tree, level order, missing children ke liye `null`\n- Line 2: `p`\n- Line 3: `q`\n\n**Output**\nLowest common ancestor ki value.',
    examples: [
      { input: '3 5 1 6 2 0 8 null null 7 4\n5\n1', output: '3' },
      { input: '3 5 1 6 2 0 8 null null 7 4\n5\n4', output: '5' },
    ],
    constraints: ['2 <= nodes <= 5000', 'p and q are distinct and both present', 'No BST ordering assumed'],
    hints: [
      'Unlike a BST, there is no ordering to exploit here — a general search is needed.',
      'At any node, recursively search both children for p and q.',
      'If p or q is found in BOTH the left and right subtrees of some node (or the node itself is one of p/q and the other is found in either subtree), that node is the LCA — it is the point where the search paths to p and q diverge.',
    ],
    approach:
      'Recursive: base case is `null` (not found) or the node itself matching `p` or `q` (found — return this node up immediately, without searching further down). Otherwise, recursively search both children. If both return a non-null result, this node is the LCA. If only one side returns non-null, propagate that result upward (the LCA is somewhere in that subtree, or is that returned node itself).',
    approachHi:
      'Recursive: base case hai `null` (nahi mila) ya khud node `p` ya `q` se match karta hai (mil gaya — is node ko turant upar return karo, aage neeche search kiye bina). Warna, dono children mein recursively search karo. Agar dono non-null result dete hain, ye node LCA hai. Agar sirf ek side non-null deta hai, us result ko upar propagate karo (LCA us subtree mein kahin hai, ya wo returned node khud hi hai).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The elegance here is that the recursion never explicitly checks "is this the LCA" against some global condition — instead, each call simply reports "did I find p or q (or both) somewhere in my subtree, and if so, what is the highest point of convergence I have seen?" A node becomes recognizable as the LCA precisely at the moment both of its children independently report finding one of the two targets each, because that is exactly the definition of "lowest common ancestor": the deepest node from which both targets are still reachable via different children.',
    solutionExplanationHi:
      'Yahan elegance ye hai ki recursion kabhi explicitly kisi global condition se "kya ye LCA hai" check nahi karta — iske bajaye, har call simply report karta hai "kya mujhe apne subtree mein kahin p ya q (ya dono) mile, aur agar haan to convergence ka sabse upar wala point kya hai jo maine dekha?" Ek node LCA ki tarah recognizable ban jaata hai exactly usi moment jab uske dono children independently ek-ek target milne ka report karte hain, kyunki yahi "lowest common ancestor" ki definition hai: sabse gehra node jahan se dono targets abhi bhi alag-alag children ke through reachable hain.',
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

function lowestCommonAncestor(node, p, q) {
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

def lowest_common_ancestor(node, p, q):
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
function lowestCommonAncestor(node, p, q) {
  if (!node || node.val === p || node.val === q) return node;
  const left = lowestCommonAncestor(node.left, p, q);
  const right = lowestCommonAncestor(node.right, p, q);
  if (left && right) return node;
  return left || right;
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

def lowest_common_ancestor(node, p, q):
    if not node or node.val == p or node.val == q:
        return node
    left = lowest_common_ancestor(node.left, p, q)
    right = lowest_common_ancestor(node.right, p, q)
    if left and right:
        return node
    return left or right

print(lowest_common_ancestor(build(tokens), p, q).val)`,
    ),
    testCases: [
      sample('3 5 1 6 2 0 8 null null 7 4\n5\n1', '3'),
      sample('3 5 1 6 2 0 8 null null 7 4\n5\n4', '5'),
      hidden('1 2\n1\n2', '1'),
      hidden('1 2 3\n2\n3', '1'),
      hidden('1 2 3 4 5\n4\n5', '2'),
    ],
  },

  {
    slug: 'count-complete-tree-nodes',
    title: 'Count Complete Tree Nodes',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Given a complete binary tree (every level fully filled except possibly the last, which fills left to right), count its nodes faster than a plain O(n) traversal.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe number of nodes.',
    descriptionHi:
      'Ek complete binary tree diya hai (har level poori tarah bhara hai, sivaay shayad aakhri ke, jo left se right bharta hai). Uske nodes ko plain O(n) traversal se tez count karo.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nNodes ki sankhya.',
    examples: [
      { input: '1 2 3 4 5 6', output: '6' },
      { input: '', output: '0' },
    ],
    constraints: ['0 <= nodes <= 5*10^4', 'The tree is complete (as defined above)'],
    hints: [
      'A plain O(n) traversal always works, but the "complete tree" guarantee allows something faster.',
      'Measure the height by always going left, and separately measure the height by always going right, from a given node.',
      'If those two heights are equal, the subtree rooted there is a PERFECT tree, and its node count is known instantly by the formula 2^height - 1 — no further recursion needed for that subtree.',
    ],
    approach:
      'Recursive: for the current node, compute `leftHeight` (always following left children) and `rightHeight` (always following right children). If they are equal, the subtree is perfect, so return `2^leftHeight - 1` immediately (a closed-form count, no further recursion). Otherwise, recurse normally into both children and return `1 + countLeft + countRight`.',
    approachHi:
      'Recursive: current node ke liye, `leftHeight` (hamesha left children follow karke) aur `rightHeight` (hamesha right children follow karke) compute karo. Agar barabar hain, subtree perfect hai, isliye turant `2^leftHeight - 1` return karo (closed-form count, aage recursion ki zaroorat nahi). Warna, dono children mein normally recurse karo aur `1 + countLeft + countRight` return karo.',
    timeComplexity: 'O(log^2 n)',
    spaceComplexity: 'O(log n) recursion depth',
    solutionExplanation:
      'In a complete tree, the moment left-height equals right-height at some node, that subtree is GUARANTEED to be perfect (every level fully filled) — a fact specific to completeness that would not hold for an arbitrary binary tree — so its size is knowable in O(1) via the standard 2^h - 1 perfect-tree formula, without visiting a single one of its nodes individually. Each recursive call does O(log n) work to measure the two heights, and because at least one side is always perfect at every level of the recursion, the depth of genuinely recursive (non-shortcut) calls is bounded by O(log n), giving O(log n) * O(log n) = O(log^2 n) total, a large improvement over the naive O(n).',
    solutionExplanationHi:
      'Ek complete tree mein, jaise hi kisi node par left-height right-height ke barabar ho jaati hai, wo subtree GUARANTEED perfect hai (har level poora bhara hua) — ye fact specifically completeness ki wajah se hai, kisi arbitrary binary tree ke liye ye sahi nahi hota — isliye uska size standard 2^h - 1 perfect-tree formula se O(1) mein pata chal jaata hai, uske ek bhi node ko individually visit kiye bina. Har recursive call do heights measure karne mein O(log n) kaam karta hai, aur chunki recursion ke har level par kam se kam ek side hamesha perfect hoti hai, genuinely recursive (non-shortcut) calls ki depth O(log n) tak bounded rehti hai — isse O(log n) * O(log n) = O(log^2 n) total milta hai, naive O(n) se kaafi behtar.',
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

function countNodes(root) {
  // your code here
}

console.log(countNodes(build(tokens)));`,
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

def count_nodes(root):
    # your code here
    pass

print(count_nodes(build(tokens)))`,
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
function leftHeight(node) { let h = 0; while (node) { h++; node = node.left; } return h; }
function rightHeight(node) { let h = 0; while (node) { h++; node = node.right; } return h; }
function countNodes(root) {
  if (!root) return 0;
  const lh = leftHeight(root), rh = rightHeight(root);
  if (lh === rh) return (1 << lh) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}
console.log(countNodes(build(tokens)));`,
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

def left_height(node):
    h = 0
    while node:
        h += 1
        node = node.left
    return h

def right_height(node):
    h = 0
    while node:
        h += 1
        node = node.right
    return h

def count_nodes(root):
    if not root:
        return 0
    lh, rh = left_height(root), right_height(root)
    if lh == rh:
        return (1 << lh) - 1
    return 1 + count_nodes(root.left) + count_nodes(root.right)

print(count_nodes(build(tokens)))`,
    ),
    testCases: [
      sample('1 2 3 4 5 6', '6'),
      sample('', '0'),
      hidden('1', '1'),
      hidden('1 2', '2'),
      hidden('1 2 3 4 5 6 7', '7'),
      hidden('1 2 3 4', '4'),
    ],
  },

  {
    slug: 'binary-tree-preorder-traversal-iterative',
    title: 'Binary Tree Preorder Traversal (Iterative)',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Return the preorder traversal (root, then left, then right) of the tree, computed using an explicit stack rather than recursion.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe preorder values, space-separated.',
    descriptionHi:
      'Tree ka preorder traversal (root, phir left, phir right) return karo, recursion ke bajaye ek explicit stack use karke compute kiya hua.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nPreorder values, space-separated.',
    examples: [
      { input: '1 null 2 3', output: '1 2 3' },
      { input: '', output: '' },
    ],
    constraints: ['0 <= nodes <= 100'],
    hints: [
      'A stack naturally mimics the call stack that recursion would otherwise use implicitly.',
      'Push the root. Repeatedly pop a node, record its value, then push its children — but push RIGHT before LEFT, so that LEFT is popped and processed first.',
      'The visit order (root, then left subtree, then right subtree) falls out directly if children are pushed in the right order.',
    ],
    approach:
      'Use an explicit stack, starting with the root. Repeatedly pop a node, record its value, then push its right child (if any) followed by its left child (if any) — pushing right before left ensures left is popped next, preserving the root-left-right preorder sequence.',
    approachHi:
      'Root se shuru karke ek explicit stack use karo. Baar-baar ek node pop karo, uski value record karo, phir uska right child (agar hai) push karo, uske baad left child (agar hai) — right ko left se pehle push karna ensure karta hai ki left agla pop ho, root-left-right preorder sequence preserve karte hue.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) for the stack',
    solutionExplanation:
      'A stack is LIFO, so whatever is pushed LAST comes out FIRST — to get left processed before right (as preorder requires), right must be pushed first (so it sits deeper in the stack) and left pushed second (so it sits on top and pops next). This push-order trick is the entire difference between an iterative preorder and getting the order backwards; the explicit stack here plays exactly the role the implicit call stack plays in the recursive version.',
    solutionExplanationHi:
      'Stack LIFO hai, isliye jo AAKHRI mein push hua wo PEHLE bahar aata hai — right se pehle left process karwane ke liye (jaisa preorder maangta hai), right ko pehle push karna hoga (taaki wo stack mein gehra baithe) aur left ko doosra (taaki wo top par ho aur agla pop ho). Ye push-order trick hi iterative preorder aur order ulta hone ke beech ka poora farq hai; yahan explicit stack exactly wahi role play karta hai jo recursive version mein implicit call stack karta hai.',
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

function preorderIterative(root) {
  // return an array of values, using an explicit stack (no recursion)
  return [];
}

console.log(preorderIterative(build(tokens)).join(' '));`,
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

def preorder_iterative(root):
    # return a list of values, using an explicit stack (no recursion)
    return []

print(" ".join(map(str, preorder_iterative(build(tokens)))))`,
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
function preorderIterative(root) {
  const out = [];
  if (!root) return out;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return out;
}
console.log(preorderIterative(build(tokens)).join(' '));`,
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

def preorder_iterative(root):
    out = []
    if not root:
        return out
    stack = [root]
    while stack:
        node = stack.pop()
        out.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return out

print(" ".join(map(str, preorder_iterative(build(tokens)))))`,
    ),
    testCases: [
      sample('1 null 2 3', '1 2 3'),
      sample('', ''),
      hidden('1', '1'),
      hidden('1 2 3', '1 2 3'),
      hidden('1 2 3 4 5 6 7', '1 2 4 5 3 6 7'),
    ],
  },

  {
    slug: 'binary-tree-postorder-traversal-iterative',
    title: 'Binary Tree Postorder Traversal (Iterative)',
    category: 'Trees',
    difficulty: 'MEDIUM',
    description:
      'Return the postorder traversal (left, then right, then root) of the tree, computed using an explicit stack rather than recursion.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe postorder values, space-separated.',
    descriptionHi:
      'Tree ka postorder traversal (left, phir right, phir root) return karo, recursion ke bajaye ek explicit stack use karke compute kiya hua.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nPostorder values, space-separated.',
    examples: [
      { input: '1 null 2 3', output: '3 2 1' },
      { input: '', output: '' },
    ],
    constraints: ['0 <= nodes <= 100'],
    hints: [
      'Postorder (left-right-root) is trickier to do iteratively than preorder, because "root" comes LAST, after both children are fully processed.',
      'A clean trick: compute a "root-right-left" order iteratively (which is just preorder with the push order of children swapped), then reverse the whole result at the end.',
      'Reversing "root-right-left" gives exactly "left-right-root" — postorder.',
    ],
    approach:
      'Use the same iterative-preorder stack technique, but push LEFT before RIGHT (the opposite of preorder), producing a "root-right-left" order. Reverse the entire collected sequence at the end to get "left-right-root" — postorder.',
    approachHi:
      'Wahi iterative-preorder stack technique use karo, bas LEFT ko RIGHT se pehle push karo (preorder ka ulta), jisse "root-right-left" order banta hai. Aakhir mein poori collected sequence ko reverse karo taaki "left-right-root" — postorder — mil jaaye.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) for the stack, O(n) for the output being reversed',
    solutionExplanation:
      'Trying to adapt the preorder stack trick directly to postorder is awkward because postorder needs to visit a node AFTER both its children, which does not map cleanly onto a single pop-then-push stack step. The elegant workaround sidesteps that entirely: computing "root-right-left" is structurally identical to preorder\'s "root-left-right" with the two child pushes simply swapped, and reversing that entire sequence algebraically transforms it into "left-right-root" — exactly postorder — trading a harder problem for an easier one plus a cheap reversal.',
    solutionExplanationHi:
      'Preorder wale stack trick ko seedhe postorder ke liye adapt karna awkward hai kyunki postorder ko ek node ko uske DONO children ke BAAD visit karna hai, jo ek single pop-then-push stack step mein saaf tarah fit nahi hota. Elegant workaround ise poori tarah avoid kar deta hai: "root-right-left" compute karna structurally preorder ke "root-left-right" jaisa hi hai, bas dono child pushes swap ho gaye, aur us poori sequence ko reverse karna algebraically use "left-right-root" mein badal deta hai — exactly postorder — ek mushkil problem ko ek aasan problem plus ek sasta reversal se badalte hue.',
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

function postorderIterative(root) {
  // return an array of values, using an explicit stack (no recursion)
  return [];
}

console.log(postorderIterative(build(tokens)).join(' '));`,
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

def postorder_iterative(root):
    # return a list of values, using an explicit stack (no recursion)
    return []

print(" ".join(map(str, postorder_iterative(build(tokens)))))`,
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
function postorderIterative(root) {
  const out = [];
  if (!root) return out;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return out.reverse();
}
console.log(postorderIterative(build(tokens)).join(' '));`,
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

def postorder_iterative(root):
    out = []
    if not root:
        return out
    stack = [root]
    while stack:
        node = stack.pop()
        out.append(node.val)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return out[::-1]

print(" ".join(map(str, postorder_iterative(build(tokens)))))`,
    ),
    testCases: [
      sample('1 null 2 3', '3 2 1'),
      sample('', ''),
      hidden('1', '1'),
      hidden('1 2 3', '2 3 1'),
      hidden('1 2 3 4 5 6 7', '4 5 2 6 7 3 1'),
    ],
  },

  {
    slug: 'merge-two-binary-trees',
    title: 'Merge Two Binary Trees',
    category: 'Trees',
    difficulty: 'EASY',
    description:
      'Merge two binary trees by summing overlapping node values; where only one tree has a node, that node is used as-is.\n\n**Input**\n- Line 1: tree A, level order, `null` for missing children\n- Line 2: tree B, same format\n\n**Output**\nThe merged tree, level order with `null` for missing children.',
    descriptionHi:
      'Do binary trees ko merge karo, overlapping node values ka sum karke; jahan sirf ek tree mein node hai, wahi node use hoga.\n\n**Input**\n- Line 1: tree A, level order, missing children ke liye `null`\n- Line 2: tree B, same format\n\n**Output**\nMerged tree, level order mein `null` ke saath.',
    examples: [
      { input: '1 3 2 5\n2 1 3 null 4 null 7', output: '3 4 5 5 4 null 7' },
      { input: '1\n', output: '1' },
    ],
    constraints: ['0 <= nodes in either tree <= 2000'],
    hints: [
      'If either node is null, the merge result at that position is simply the other tree\'s node (possibly also null).',
      'If both nodes exist, create a new node whose value is the sum, and recursively merge the corresponding children.',
      'This is structurally similar to Same Tree, but combining values instead of comparing them.',
    ],
    approach:
      'Recursive: if either node is `null`, return the other one directly (whichever exists, or null if both are missing). Otherwise, create a new node with `a.val + b.val`, and recursively merge `a.left` with `b.left`, and `a.right` with `b.right`.',
    approachHi:
      'Recursive: agar koi bhi node `null` hai, doosra seedha return kar do (jo bhi exist karta hai, ya null agar dono missing hain). Warna, `a.val + b.val` wala ek naya node banao, aur `a.left` ko `b.left` ke saath, `a.right` ko `b.right` ke saath recursively merge karo.',
    timeComplexity: 'O(min(size of A, size of B))',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'Returning "the other node directly" the moment either side is null is what makes non-overlapping parts of the two trees pass through unchanged rather than being lost — the recursion only actually does merging work (summing values, creating a new node) at positions where BOTH trees have something, and simply copies over whichever single tree extends further at any position where only one does.',
    solutionExplanationHi:
      'Jaise hi koi ek side null ho, "doosra node seedha" return karna hi non-overlapping parts ko bina change kiye pass hone deta hai, kho jaane ke bajaye — recursion actually merging ka kaam (values sum karna, naya node banana) sirf un positions par karta hai jahan DONO trees mein kuch hai, aur jahan sirf ek tree aage badhta hai wahan use bas copy kar deta hai.',
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

function mergeTrees(a, b) {
  // your code here
  return null;
}

console.log(serialize(mergeTrees(build(tokensA), build(tokensB))));`,
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

def merge_trees(a, b):
    # your code here
    return None

print(serialize(merge_trees(build(tokens_a), build(tokens_b))))`,
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
function mergeTrees(a, b) {
  if (!a) return b;
  if (!b) return a;
  return { val: a.val + b.val, left: mergeTrees(a.left, b.left), right: mergeTrees(a.right, b.right) };
}
console.log(serialize(mergeTrees(build(tokensA), build(tokensB))));`,
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

def merge_trees(a, b):
    if not a:
        return b
    if not b:
        return a
    node = Node(a.val + b.val)
    node.left = merge_trees(a.left, b.left)
    node.right = merge_trees(a.right, b.right)
    return node

print(serialize(merge_trees(build(tokens_a), build(tokens_b))))`,
    ),
    testCases: [
      sample('1 3 2 5\n2 1 3 null 4 null 7', '3 4 5 5 4 null 7'),
      sample('1\n', '1'),
      hidden('\n', '(empty)'),
      hidden('1\n2', '3'),
      hidden('1 2\n1', '2 2'),
      hidden('1 2\n1 null 3', '2 2 3'),
    ],
  },

  {
    slug: 'binary-tree-maximum-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    category: 'Trees',
    difficulty: 'HARD',
    description:
      'A path is any sequence of nodes connected by edges, where each node appears at most once; it need not pass through the root. Find the maximum possible sum of node values along any path.\n\n**Input**\nOne line: the tree in level order, `null` for missing children. Values may be negative.\n\n**Output**\nThe maximum path sum.',
    descriptionHi:
      'Ek path nodes ki koi bhi sequence hai jo edges se connected ho, har node zyada se zyada ek baar aaye; use root se guzarna zaroori nahi. Kisi bhi path ke node values ka maximum possible sum dhoondo.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`. Values negative bhi ho sakti hain.\n\n**Output**\nMaximum path sum.',
    examples: [
      { input: '1 2 3', output: '6' },
      { input: '-10 9 20 null null 15 7', output: '42' },
    ],
    constraints: ['1 <= nodes <= 3*10^4', '-1000 <= value <= 1000'],
    hints: [
      'A path can "bend" at exactly one node (going up one child, through that node, down the other child), but cannot bend at more than one node.',
      'For each node, define its "contribution to a path passing through its parent" as: its own value plus the better of its left or right subtree\'s contribution (or 0 if that would be negative — a negative contribution should just be excluded).',
      'Separately, at each node, check the *bending* path through it (left contribution + node value + right contribution) against a global running maximum — the bending path can only be the top of some path, it cannot be extended further upward through the parent.',
    ],
    approach:
      'Recursive helper that returns "the best downward path sum starting at this node and extending into at most one child" — computed as `node.val + max(0, leftGain, rightGain)`, clamping negative contributions to 0 (excluding that side entirely). Separately, at each node, update a global maximum using the "bending" path `node.val + max(0, leftGain) + max(0, rightGain)`, which considers using both children at once, since that bent shape is a valid complete path even though it cannot be returned upward as a single-direction contribution.',
    approachHi:
      'Ek recursive helper jo return karta hai "is node se shuru hokar zyada se zyada ek child tak jaane wala best downward path sum" — `node.val + max(0, leftGain, rightGain)` se compute hota hai, negative contributions ko 0 par clamp karte hue (us side ko poori tarah exclude karte hue). Alag se, har node par, "bending" path `node.val + max(0, leftGain) + max(0, rightGain)` use karke ek global maximum update karo, jo dono children ko ek saath use karta hai, kyunki wo bent shape ek valid complete path hai chahe use single-direction contribution ki tarah upar return na kiya ja sake.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) recursion depth',
    solutionExplanation:
      'The crucial distinction is between two different things a node can offer: a "contribution" it can hand up to its PARENT (which must commit to at most one direction, since a path passing through the parent can only continue in one direction from this node) versus the best complete path that BENDS at this exact node (which may use both children, since that path terminates here and goes no further up). Conflating these two — accidentally returning the bent-path value as the contribution — would let a parent illegally use both of a child\'s branches as if they were a single extendable direction, which is exactly the classic bug this problem is designed to catch. Clamping negative contributions to 0 is what correctly models "a negative-sum detour is never worth taking" — better to end the path early than extend it through a net-negative subtree.',
    solutionExplanationHi:
      'Crucial fark ye hai ki ek node do alag cheezein offer kar sakta hai: ek "contribution" jo wo apne PARENT ko de sakta hai (jo zyada se zyada ek direction tak commit hona chahiye, kyunki parent se guzarne wala path is node se sirf ek direction mein aage badh sakta hai) vs wo best complete path jo exactly is node par BEND karta hai (jo dono children use kar sakta hai, kyunki wo path yahin khatam ho jaata hai, aage nahi jaata). Inhe mix kar dena — galti se bent-path value ko contribution ki tarah return kar dena — parent ko illegally kisi child ki dono branches ek single extendable direction ki tarah use karne dega, jo exactly wo classic bug hai jise ye problem pakadne ke liye design hui hai. Negative contributions ko 0 par clamp karna sahi tarah "ek negative-sum detour lena kabhi worth nahi" model karta hai — path ko jaldi khatam karna behtar hai, net-negative subtree se aage badhaane se.',
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

function maxPathSum(root) {
  // your code here
}

console.log(maxPathSum(build(tokens)));`,
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

def max_path_sum(root):
    # your code here
    pass

print(max_path_sum(build(tokens)))`,
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
let best = -Infinity;
function gain(node) {
  if (!node) return 0;
  const leftGain = Math.max(gain(node.left), 0);
  const rightGain = Math.max(gain(node.right), 0);
  best = Math.max(best, node.val + leftGain + rightGain);
  return node.val + Math.max(leftGain, rightGain);
}
gain(build(tokens));
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

best = float("-inf")

def gain(node):
    global best
    if not node:
        return 0
    left_gain = max(gain(node.left), 0)
    right_gain = max(gain(node.right), 0)
    best = max(best, node.val + left_gain + right_gain)
    return node.val + max(left_gain, right_gain)

gain(build(tokens))
print(best)`,
    ),
    testCases: [
      sample('1 2 3', '6'),
      sample('-10 9 20 null null 15 7', '42'),
      hidden('-3', '-3'),
      hidden('2 -1', '2'),
      hidden('-1 -2 -3', '-1'),
      hidden('5 4 8 11 null 13 4 7 2 null null null 1', '48'),
    ],
  },

  {
    slug: 'serialize-deserialize-binary-tree',
    title: 'Serialize and Deserialize Binary Tree',
    category: 'Trees',
    difficulty: 'HARD',
    description:
      'Design an algorithm to serialize a tree to a string and deserialize that string back to the same tree structure. To verify round-trip correctness, this problem serializes the given tree, deserializes the result, then prints the deserialized tree in level order.\n\n**Input**\nOne line: the tree in level order, `null` for missing children.\n\n**Output**\nThe round-tripped tree, level order with `null` for missing children. `(empty)` for an empty tree.',
    descriptionHi:
      'Ek algorithm design karo jo tree ko string mein serialize kare aur us string ko wapas usi tree structure mein deserialize kare. Round-trip correctness verify karne ke liye, ye problem diye gaye tree ko serialize karta hai, result ko deserialize karta hai, phir deserialized tree ko level order mein print karta hai.\n\n**Input**\nEk line: tree level order mein, missing children ke liye `null`.\n\n**Output**\nRound-tripped tree, level order mein `null` ke saath. Khaali tree ke liye `(empty)`.',
    examples: [
      { input: '1 2 3 null null 4 5', output: '1 2 3 null null 4 5' },
      { input: '', output: '(empty)' },
    ],
    constraints: ['0 <= nodes <= 10^4'],
    hints: [
      'A preorder traversal that explicitly writes out a marker (like "null") for every missing child, rather than skipping them, carries enough information to reconstruct the exact tree shape.',
      'To deserialize, walk the tokens in the same preorder sequence: the next token is either a value (build a node, then recursively deserialize its left and right children from what follows) or the null marker (return null immediately, consuming just that one token).',
      'The two operations are exact inverses of each other, applied in the same traversal order — that symmetry is what guarantees a faithful round trip.',
    ],
    approach:
      'Serialize with a preorder DFS that emits every node\'s value, and emits the literal token `null` for every missing child (rather than omitting it) — this fully determines the tree shape, unlike the level-order encoding which can drop trailing nulls. Deserialize by walking the resulting token stream with a shared position pointer: consume one token; if it is `null`, return `null`; otherwise build a node from it, then recursively consume tokens for its left and right children before returning it.',
    approachHi:
      'Preorder DFS se serialize karo jo har node ki value emit kare, aur har missing child ke liye literal token `null` emit kare (omit karne ke bajaye) — ye poori tarah tree shape determine karta hai, level-order encoding ke ulat jo trailing nulls drop kar sakti hai. Resulting token stream ko ek shared position pointer se walk karke deserialize karo: ek token consume karo; agar `null` hai, `null` return karo; warna usse ek node banao, phir uske left aur right children ke liye tokens recursively consume karo, phir return karo.',
    timeComplexity: 'O(n) for both serialize and deserialize',
    spaceComplexity: 'O(n) for the serialized string, O(h) recursion depth',
    solutionExplanation:
      'The reason a preorder-with-explicit-nulls encoding (rather than the level-order-with-trailing-nulls-trimmed encoding used elsewhere in this course) is chosen here is specifically that it is unambiguous and self-delimiting: because every node — real or missing — leaves exactly one token in the stream, and preorder always visits root before children, the deserializer never needs to look ahead or guess where one subtree ends and another begins; it simply consumes tokens in the same order they were written, trusting that the shared position pointer advancing correctly mirrors the shared traversal order used during serialization.',
    solutionExplanationHi:
      'Yahan preorder-with-explicit-nulls encoding (is course mein kahin aur use hone wali level-order-with-trimmed-trailing-nulls encoding ke bajaye) chunne ki wajah specifically ye hai ki wo unambiguous aur self-delimiting hai: chunki har node — real ho ya missing — stream mein exactly ek token chhodta hai, aur preorder hamesha children se pehle root visit karta hai, deserializer ko kabhi aage dekhna ya guess karna nahi padta ki ek subtree kahan khatam hoti hai aur doosri kahan shuru — wo bas tokens ko usi order mein consume karta hai jisme wo likhe gaye the, trust karte hue ki shared position pointer ka sahi aage badhna, serialization ke dauraan use hue shared traversal order ko hi mirror karta hai.',
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
  // return a string encoding the tree
  return '';
}

function deserialize(data) {
  // return the root node reconstructed from the string
  return null;
}

function levelOrderPrint(root) {
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

const original = build(tokens);
const roundTripped = deserialize(serialize(original));
console.log(levelOrderPrint(roundTripped));`,
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
    # return a string encoding the tree
    return ""

def deserialize(data):
    # return the root node reconstructed from the string
    return None

def level_order_print(root):
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

original = build(tokens)
round_tripped = deserialize(serialize(original))
print(level_order_print(round_tripped))`,
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
  const out = [];
  function dfs(node) {
    if (!node) { out.push('null'); return; }
    out.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return out.join(',');
}
function deserialize(data) {
  const parts = data.split(',');
  let idx = 0;
  function dfs() {
    const token = parts[idx++];
    if (token === 'null') return null;
    const node = { val: Number(token), left: null, right: null };
    node.left = dfs();
    node.right = dfs();
    return node;
  }
  return dfs();
}
function levelOrderPrint(root) {
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
const original = build(tokens);
const roundTripped = deserialize(serialize(original));
console.log(levelOrderPrint(roundTripped));`,
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
    out = []

    def dfs(node):
        if not node:
            out.append("null")
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)

    dfs(root)
    return ",".join(out)

def deserialize(data):
    parts = data.split(",")
    idx = [0]

    def dfs():
        token = parts[idx[0]]
        idx[0] += 1
        if token == "null":
            return None
        node = Node(int(token))
        node.left = dfs()
        node.right = dfs()
        return node

    return dfs()

def level_order_print(root):
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

original = build(tokens)
round_tripped = deserialize(serialize(original))
print(level_order_print(round_tripped))`,
    ),
    testCases: [
      sample('1 2 3 null null 4 5', '1 2 3 null null 4 5'),
      sample('', '(empty)'),
      hidden('1', '1'),
      hidden('1 2', '1 2'),
      hidden('1 null 2', '1 null 2'),
      hidden('1 2 3 4 5 6 7', '1 2 3 4 5 6 7'),
    ],
  },
];
