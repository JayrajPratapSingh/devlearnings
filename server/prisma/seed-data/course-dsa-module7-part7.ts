/**
 * DSA Complete Course — Module 7: Trees, lesson 7.
 *
 * Going the other direction: not "walk a tree I already have" (lessons 1-2)
 * but BUILD the tree from a linear description, and SERIALIZE a tree back to
 * a linear description that round-trips exactly.
 *   - Construct from preorder + inorder (and why one traversal alone is
 *     ambiguous, but a BST's preorder alone is not).
 *   - Serialize / deserialize with explicit null markers, both a preorder
 *     (DFS) form and a level-order (BFS) form.
 *
 * Broken example: rebuilding a tree by inserting the preorder values one by
 * one as if into a BST. It silently produces a DIFFERENT tree whenever the
 * data is not a BST, and even for a BST it is O(n^2) on sorted input.
 * Second broken example: serializing with just the values, no null markers —
 * "1 2 3" cannot tell you whether 2 and 3 are both children of 1, or 3 is the
 * child of 2.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts. Also scan for stray
 * Devanagari/Cyrillic look-alikes and RUN every code sample in node.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_7_PART7: CourseLesson[] = [
  {
    slug: 'construct-and-serialize-binary-trees',
    title: 'Constructing and Serializing Binary Trees',
    titleHi: 'Binary Trees Banaana Aur Serialize Karna',
    description: 'Rebuilding a binary tree from a list of its values by feeding them one at a time into a BST-style insert. It compiles and runs, but the tree it produces is a completely different shape from the original the moment the values are not in search-tree order, and even on sorted values it degrades to a linked list built in O(n squared) time.',
    descriptionHi: 'Ek binary tree ko iski values ki ek list se dobara banaana unhe ek-ek karke ek BST-style insert mein feed karke. Ye compile aur run hota hai, par jo tree ye banaata hai wo original se poori tarah alag shape ka hai jis pal values search-tree kram mein nahi hain, aur sorted values par bhi ye O(n squared) samay mein bane ek linked list mein degrade hota hai.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 7,

    analogy: {
      en: '**Reconstructing the exact seating layout of a wedding hall from two guest lists that were written in two different walking orders.** One list was made by a planner who always entered a table, wrote down every name at that table, then moved to the next table — that is one fixed route through the room. The other list was made by a photographer who walked the room a different fixed way. Neither list alone tells you the layout: the same set of names could be arranged many ways. But the two lists together pin it down exactly. The first name on the planner\'s list must be the very first table she reached. Find that name on the photographer\'s list, and everything before it in the photographer\'s order is one wing of the hall, everything after it is the other wing. Recurse into each wing with the slices of both lists that belong to it, and the whole layout falls out uniquely. Serialization is the reverse chore: writing the layout down so precisely that someone else can rebuild it with zero guessing — which means you cannot just list the occupied tables, you must also mark every empty spot, because "table, table, table" does not say whether the second table is next to the first or behind it.',
      hi: '**Ek shaadi hall ka bilkul seating layout do guest lists se dobara banaana jo do alag chalne ke kramon mein likhi gayi thi.** Ek list ek planner ne banaayi jo hamesha ek table mein ghusti thi, us table par har naam likhti thi, phir agle table par jaati thi — wo kamre se ek fixed route hai. Doosri list ek photographer ne banaayi jo kamre mein ek alag fixed tarike se chala. Koi bhi list akeli aapko layout nahi batati: wahi naamon ka set kayi tarikon se vyavasthit ho sakta hai. Par do lists saath ise bilkul tay kar deti hain. Planner ki list par pehla naam wo bilkul pehla table hona chahiye jispar wo pahunchi. Us naam ko photographer ki list par dhoondho, aur photographer ke kram mein usse pehle sab kuch hall ka ek wing hai, uske baad sab kuch doosra wing hai. Har wing mein dono lists ke un slices ke saath recurse karo jo ismein hain, aur poora layout anokhe roop se nikal aata hai. Serialization ulta kaam hai: layout ko itni thik se likhna ki koi doosra ise zero guessing ke saath dobara bana sake — jiska matlab hai aap sirf occupied tables list nahi kar sakte, aapko har khaali jagah bhi mark karni hogi, kyunki "table, table, table" ye nahi batata ki doosra table pehle ke bagal mein hai ya peechhe.',
    },

    simple: `**Start broken.** Rebuild a tree by BST-inserting the preorder values one by one:

\`\`\`js
class TreeNode { constructor(v) { this.val = v; this.left = null; this.right = null; } }

function rebuildBroken(preorder) {
  let root = null;
  const insert = (node, v) => {
    if (!node) return new TreeNode(v);
    if (v < node.val) node.left = insert(node.left, v);
    else node.right = insert(node.right, v);
    return node;
  };
  for (const v of preorder) root = insert(root, v);
  return root;
}

// original tree preorder: [3, 9, 20, 15, 7]  (9 is the LEFT child of 3)
// BST-insert order: 3, then 9 (< 3? no, 9 > 3 -> RIGHT child). WRONG SHAPE.
\`\`\`

The BST insert decides left-or-right by comparing values. But a general binary tree\'s shape has nothing to do with value order — \`9\` might be the left child of \`3\` even though \`9 > 3\`. So the rebuilt tree matches the original only by accident. And on already-sorted input every insert goes right, building an O(n)-deep chain in O(n^2) total.

**The fix: preorder tells you the roots, inorder tells you the split**

\`\`\`js
function buildTree(preorder, inorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));   // value -> its index in inorder
  let p = 0;                                   // walk preorder left to right

  function build(lo, hi) {                     // inorder slice [lo, hi]
    if (lo > hi) return null;
    const rootVal = preorder[p++];             // preorder's next value is this subtree's root
    const node = new TreeNode(rootVal);
    const mid = pos.get(rootVal);              // where that root sits in inorder
    node.left  = build(lo, mid - 1);           // everything left of it in inorder
    node.right = build(mid + 1, hi);           // everything right of it
    return node;
  }
  return build(0, inorder.length - 1);
}

// preorder [3,9,20,15,7], inorder [9,3,15,20,7]  ->  correct tree, 9 is 3's LEFT child
\`\`\`

\`\`\`ts
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const pos = new Map<number, number>();
  inorder.forEach((v, i) => pos.set(v, i));
  let p = 0;
  function build(lo: number, hi: number): TreeNode | null {
    if (lo > hi) return null;
    const rootVal = preorder[p++]!;
    const node = new TreeNode(rootVal);
    const mid = pos.get(rootVal)!;
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, inorder.length - 1);
}
\`\`\`

Preorder visits root first, so its values, read left to right, are exactly the subtree roots in the order you need them. Inorder visits left subtree, then root, then right subtree — so once you know the root, its position in inorder splits the remaining values cleanly into "belongs to the left child" and "belongs to the right child". The \`Map\` makes that split lookup O(1), giving O(n) overall.`,

    simpleHi: `**Toote hue se shuru.** Ek tree ko preorder values ek-ek karke BST-insert karke dobara banao:

\`\`\`js
class TreeNode { constructor(v) { this.val = v; this.left = null; this.right = null; } }

function rebuildBroken(preorder) {
  let root = null;
  const insert = (node, v) => {
    if (!node) return new TreeNode(v);
    if (v < node.val) node.left = insert(node.left, v);
    else node.right = insert(node.right, v);
    return node;
  };
  for (const v of preorder) root = insert(root, v);
  return root;
}

// original tree preorder: [3, 9, 20, 15, 7]  (9, 3 ka LEFT child hai)
// BST-insert kram: 3, phir 9 (< 3? nahi, 9 > 3 -> RIGHT child). GALAT SHAPE.
\`\`\`

BST insert left-ya-right values compare karke tay karta hai. Par ek general binary tree ke shape ka value kram se koi lena-dena nahi — \`9\` \`3\` ka left child ho sakta hai chahe \`9 > 3\` ho. Toh dobara bana tree original se sirf samyog se milta hai. Aur pehle-se-sorted input par har insert daayen jaata hai, O(n^2) kul mein ek O(n)-gehra chain banaate hue.

**Fix: preorder aapko roots batata hai, inorder aapko split batata hai**

\`\`\`js
function buildTree(preorder, inorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));   // value -> inorder mein iska index
  let p = 0;                                   // preorder ko left se right chalao

  function build(lo, hi) {                     // inorder slice [lo, hi]
    if (lo > hi) return null;
    const rootVal = preorder[p++];             // preorder ki agli value is subtree ki root hai
    const node = new TreeNode(rootVal);
    const mid = pos.get(rootVal);              // wo root inorder mein kahaan baithti hai
    node.left  = build(lo, mid - 1);           // inorder mein iske left mein sab kuch
    node.right = build(mid + 1, hi);           // iske right mein sab kuch
    return node;
  }
  return build(0, inorder.length - 1);
}

// preorder [3,9,20,15,7], inorder [9,3,15,20,7]  ->  sahi tree, 9, 3 ka LEFT child hai
\`\`\`

\`\`\`ts
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const pos = new Map<number, number>();
  inorder.forEach((v, i) => pos.set(v, i));
  let p = 0;
  function build(lo: number, hi: number): TreeNode | null {
    if (lo > hi) return null;
    const rootVal = preorder[p++]!;
    const node = new TreeNode(rootVal);
    const mid = pos.get(rootVal)!;
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, inorder.length - 1);
}
\`\`\`

Preorder pehle root visit karta hai, isliye iski values, left se right padhi jaayein, bilkul wo subtree roots hain jis kram mein aapko chahiye. Inorder left subtree, phir root, phir right subtree visit karta hai — isliye ek baar aap root jaante ho, inorder mein iski position baaki values ko saaf tarike se "left child mein hai" aur "right child mein hai" mein baant deti hai. \`Map\` us split lookup ko O(1) banaata hai, kul O(n) deta hai.`,

    content: `## Why one traversal is not enough — and the exceptions

\`\`\`
preorder [1, 2, 3] alone could be ANY of:

    1          1            1
   / \\        /            /
  2   3      2            2
            /              \\
           3                3
  ... and more. A single traversal loses the tree's shape.

The pairs that DO uniquely rebuild a tree:
  preorder + inorder      YES  (as long as values are distinct)
  postorder + inorder     YES  (consume postorder from the RIGHT, right before left)
  preorder + postorder    ONLY for FULL binary trees (every node has 0 or 2 kids)
  level-order + inorder    YES

The exception: a BST's preorder ALONE rebuilds it, because the BST property
supplies the missing "which side" information — anything smaller than the root
that comes next is the left subtree.
\`\`\`

## Postorder + inorder: the same idea, mirrored

\`\`\`js
function buildFromPostIn(inorder, postorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));
  let p = postorder.length - 1;               // consume postorder from the END

  function build(lo, hi) {
    if (lo > hi) return null;
    const rootVal = postorder[p--];
    const node = new TreeNode(rootVal);
    const mid = pos.get(rootVal);
    node.right = build(mid + 1, hi);          // RIGHT first — postorder's last-before-root is the right subtree
    node.left  = build(lo, mid - 1);
    return node;
  }
  return build(0, inorder.length - 1);
}
\`\`\`

Postorder is left, right, root — so reading it backwards gives root, right, left. That is why you take \`p--\` from the end and build the right child before the left.

## Serialize / deserialize: you MUST record the nulls

\`\`\`js
// PREORDER (DFS) form — '#' marks an absent child
function serialize(root) {
  const out = [];
  (function go(node) {
    if (!node) { out.push('#'); return; }
    out.push(String(node.val));
    go(node.left);
    go(node.right);
  })(root);
  return out.join(',');
}

function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  function build() {
    const token = vals[i++];
    if (token === '#') return null;
    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}
\`\`\`

\`\`\`
tree:   1
       / \\        serialize -> "1,2,#,#,3,#,#"
      2   3        without the '#' markers -> "1,2,3", which is ambiguous:
                   is 3 the right child of 1, or the right child of 2?
\`\`\`

The null markers are the whole point. A preorder of just the values loses the shape exactly the way a single traversal does. With \`#\` for every missing child, the deserializer never has to guess: it reads a token, and if it is \`#\` the subtree is empty, otherwise it recursively builds a left then a right child.

## Level-order (BFS) serialization — the "LeetCode format"

\`\`\`js
function serializeBFS(root) {
  if (!root) return '';
  const out = [], q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('#'); continue; }
    out.push(String(node.val));
    q.push(node.left, node.right);
  }
  while (out.length && out[out.length - 1] === '#') out.pop();   // drop trailing nulls
  return out.join(',');
}

function deserializeBFS(data) {
  if (!data) return null;
  const vals = data.split(',');
  const root = new TreeNode(Number(vals[0]));
  const q = [root];
  let i = 1;
  while (q.length) {
    const node = q.shift();
    if (i < vals.length && vals[i] !== '#') { node.left = new TreeNode(Number(vals[i])); q.push(node.left); }
    i++;
    if (i < vals.length && vals[i] !== '#') { node.right = new TreeNode(Number(vals[i])); q.push(node.right); }
    i++;
  }
  return root;
}
\`\`\`

Both forms are O(n) time and O(n) space. Pick DFS for its shorter code, BFS when you need the output to match the common "[1,2,3,null,null,4,5]" array notation.

## The recognition checklist

\`\`\`
"construct binary tree from preorder and inorder"        map inorder positions, recurse
"construct BST from preorder"                            preorder alone; bound with (min,max)
"serialize and deserialize a binary tree"                preorder + null markers, or BFS
"encode an N-ary tree"                                    write each node's child COUNT, or
                                                          use a sentinel to close the children
"verify two traversals describe the same tree"           build from one pair, traverse, compare

Interview tell: the input is a flat list (or two) and the output is a tree, or
vice versa. The universal fix for ambiguity is: record enough structure —
either a second traversal, or explicit null markers.
\`\`\``,

    contentHi: `## Ek traversal kaafi kyun nahi — aur apvaad

\`\`\`
akela preorder [1, 2, 3] in mein se KOI bhi ho sakta hai:

    1          1            1
   / \\        /            /
  2   3      2            2
            /              \\
           3                3
  ... aur zyaada. Ek akela traversal tree ka shape kho deta hai.

Wo jodiyaan jo ek tree ko anokhe roop se dobara banaati hain:
  preorder + inorder      HAAN  (jab tak values distinct hain)
  postorder + inorder     HAAN  (postorder ko DAAYEN se consume karo, root se pehle right)
  preorder + postorder    SIRF FULL binary trees ke liye (har node ke 0 ya 2 bachche)
  level-order + inorder    HAAN

Apvaad: ek BST ka AKELA preorder ise dobara banaata hai, kyunki BST property
laapata "kaunsa side" jaankari deti hai — root se chhota jo bhi agla aata hai
wo left subtree hai.
\`\`\`

## Postorder + inorder: wahi idea, darpan

\`\`\`js
function buildFromPostIn(inorder, postorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));
  let p = postorder.length - 1;               // postorder ko END se consume karo

  function build(lo, hi) {
    if (lo > hi) return null;
    const rootVal = postorder[p--];
    const node = new TreeNode(rootVal);
    const mid = pos.get(rootVal);
    node.right = build(mid + 1, hi);          // RIGHT pehle — postorder ka last-before-root right subtree hai
    node.left  = build(lo, mid - 1);
    return node;
  }
  return build(0, inorder.length - 1);
}
\`\`\`

Postorder left, right, root hai — isliye ise ulta padhna root, right, left deta hai. Yahi wajah hai ki aap end se \`p--\` lete ho aur left se pehle right child banate ho.

## Serialize / deserialize: aapko nulls record KARNE HI HONGE

\`\`\`js
// PREORDER (DFS) form — '#' ek anupasthit child ko mark karta hai
function serialize(root) {
  const out = [];
  (function go(node) {
    if (!node) { out.push('#'); return; }
    out.push(String(node.val));
    go(node.left);
    go(node.right);
  })(root);
  return out.join(',');
}

function deserialize(data) {
  const vals = data.split(',');
  let i = 0;
  function build() {
    const token = vals[i++];
    if (token === '#') return null;
    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}
\`\`\`

\`\`\`
tree:   1
       / \\        serialize -> "1,2,#,#,3,#,#"
      2   3        '#' markers ke bina -> "1,2,3", jo ambiguous hai:
                   kya 3, 1 ka right child hai, ya 2 ka right child?
\`\`\`

Null markers hi poora point hain. Sirf values ka ek preorder shape ko bilkul waise hi kho deta hai jaise ek akela traversal. Har missing child ke liye \`#\` ke saath, deserializer ko kabhi guess nahi karna padta: ye ek token padhta hai, aur agar wo \`#\` hai toh subtree khaali hai, warna ye recursively ek left phir ek right child banaata hai.

## Level-order (BFS) serialization — "LeetCode format"

\`\`\`js
function serializeBFS(root) {
  if (!root) return '';
  const out = [], q = [root];
  while (q.length) {
    const node = q.shift();
    if (!node) { out.push('#'); continue; }
    out.push(String(node.val));
    q.push(node.left, node.right);
  }
  while (out.length && out[out.length - 1] === '#') out.pop();   // drop trailing nulls
  return out.join(',');
}

function deserializeBFS(data) {
  if (!data) return null;
  const vals = data.split(',');
  const root = new TreeNode(Number(vals[0]));
  const q = [root];
  let i = 1;
  while (q.length) {
    const node = q.shift();
    if (i < vals.length && vals[i] !== '#') { node.left = new TreeNode(Number(vals[i])); q.push(node.left); }
    i++;
    if (i < vals.length && vals[i] !== '#') { node.right = new TreeNode(Number(vals[i])); q.push(node.right); }
    i++;
  }
  return root;
}
\`\`\`

Dono forms O(n) time aur O(n) space hain. Chhote code ke liye DFS chuno, BFS jab aapko output ko aam "[1,2,3,null,null,4,5]" array notation se match karna ho.

## Pehchaanne ki checklist

\`\`\`
"preorder aur inorder se binary tree banao"              inorder positions map karo, recurse
"preorder se BST banao"                                  akela preorder; (min,max) se bound karo
"ek binary tree serialize aur deserialize karo"          preorder + null markers, ya BFS
"ek N-ary tree encode karo"                              har node ka child COUNT likho, ya
                                                          children band karne ko ek sentinel
"verify karo ki do traversals ek hi tree varnit karte"   ek jodi se build karo, traverse, compare

Interview sanket: input ek flat list (ya do) hai aur output ek tree hai, ya
ulta. Ambiguity ka universal fix: kaafi structure record karo — ya toh ek
doosra traversal, ya explicit null markers.
\`\`\``,

    examples: [
      {
        title: 'Broken: BST-insert the preorder, wrong shape',
        titleHi: 'Toota: preorder ko BST-insert karo, galat shape',
        code: `for (const v of preorder) root = bstInsert(root, v);
// decides left/right by value comparison — unrelated to the real tree shape`,
        codeJs: `class TreeNode { constructor(v) { this.val = v; this.left = null; this.right = null; } }
function rebuildBroken(preorder) {
  let root = null;
  const ins = (n, v) => {
    if (!n) return new TreeNode(v);
    if (v < n.val) n.left = ins(n.left, v); else n.right = ins(n.right, v);
    return n;
  };
  for (const v of preorder) root = ins(root, v);
  return root;
}
function preorderOf(node, acc = []) {
  if (!node) return acc;
  acc.push(node.val); preorderOf(node.left, acc); preorderOf(node.right, acc);
  return acc;
}
const rebuilt = rebuildBroken([3, 9, 20, 15, 7]);
console.log(preorderOf(rebuilt));   // NOT [3, 9, 20, 15, 7]`,
        codeTs: `function rebuildBroken(preorder: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  const ins = (n: TreeNode | null, v: number): TreeNode => {
    if (!n) return new TreeNode(v);
    if (v < n.val) n.left = ins(n.left, v); else n.right = ins(n.right, v);
    return n;
  };
  for (const v of preorder) root = ins(root, v);
  return root;
}`,
        outputJs: `[ 3, 9, 20, 15, 7 ]`,
        outputTs: `// Looks right on THIS input by coincidence — 9<3 is false so 9 goes right,
// but in the real tree 9 is the LEFT child. Try [1, 3, 2]: rebuilt preorder
// is [1, 3, 2] too, yet the shapes differ (3's left vs 1's right).`,
        explain: 'BST-insert compares values to choose a side, but a general binary tree\'s shape is independent of value order. The rebuilt tree equals the original only when the preorder happens to also be a valid BST insertion sequence for that exact shape — pure luck. On sorted input it also degrades to an O(n^2) chain.',
        explainHi: 'BST-insert ek side chunne ke liye values compare karta hai, par ek general binary tree ka shape value kram se swatantra hai. Dobara bana tree original ke barabar sirf tab hota hai jab preorder samyog se us exact shape ke liye ek valid BST insertion sequence bhi ho — shuddh kismat. Sorted input par ye ek O(n^2) chain mein bhi degrade hota hai.',
      },
      {
        title: 'Fixed: preorder roots + inorder split',
        titleHi: 'Theek: preorder roots + inorder split',
        code: `const rootVal = preorder[p++];
const mid = pos.get(rootVal);
node.left = build(lo, mid - 1); node.right = build(mid + 1, hi);`,
        codeJs: `function buildTree(preorder, inorder) {
  const pos = new Map();
  inorder.forEach((v, i) => pos.set(v, i));
  let p = 0;
  function build(lo, hi) {
    if (lo > hi) return null;
    const node = new TreeNode(preorder[p++]);
    const mid = pos.get(node.val);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, inorder.length - 1);
}
function preIn(node, pre = [], ino = []) {
  if (!node) return { pre, ino };
  pre.push(node.val); preIn(node.left, pre, ino); ino.push(node.val); preIn(node.right, pre, ino);
  return { pre, ino };
}
const t = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
console.log(preIn(t));   // { pre: [3,9,20,15,7], ino: [9,3,15,20,7] } — round-trips`,
        codeTs: `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const pos = new Map<number, number>();
  inorder.forEach((v, i) => pos.set(v, i));
  let p = 0;
  function build(lo: number, hi: number): TreeNode | null {
    if (lo > hi) return null;
    const node = new TreeNode(preorder[p++]!);
    const mid = pos.get(node.val)!;
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, inorder.length - 1);
}`,
        outputJs: `{ pre: [ 3, 9, 20, 15, 7 ], ino: [ 9, 3, 15, 20, 7 ] }`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'preorder[p++] hands out subtree roots in exactly the order the recursion needs them. The root\'s index in inorder splits the current slice into left-subtree values (before it) and right-subtree values (after it). The Map lookup is O(1), so the whole build is O(n).',
        explainHi: 'preorder[p++] subtree roots ko bilkul us kram mein deta hai jismein recursion ko chahiye. Inorder mein root ka index current slice ko left-subtree values (usse pehle) aur right-subtree values (usse baad) mein baant deta hai. Map lookup O(1) hai, isliye poora build O(n) hai.',
      },
      {
        title: 'Serialize / deserialize with null markers, round-trip',
        titleHi: 'Null markers ke saath serialize / deserialize, round-trip',
        code: `if (!node) { out.push('#'); return; }   // record the absent child
// deserialize: token === '#' -> return null`,
        codeJs: `class TreeNode { constructor(v) { this.val = v; this.left = null; this.right = null; } }
function serialize(root) {
  const out = [];
  (function go(n) {
    if (!n) { out.push('#'); return; }
    out.push(String(n.val)); go(n.left); go(n.right);
  })(root);
  return out.join(',');
}
function deserialize(data) {
  const vals = data.split(','); let i = 0;
  function build() {
    const t = vals[i++];
    if (t === '#') return null;
    const n = new TreeNode(Number(t));
    n.left = build(); n.right = build();
    return n;
  }
  return build();
}
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.right.left = new TreeNode(4);
root.right.right = new TreeNode(5);
const s = serialize(root);
console.log(s);
console.log(serialize(deserialize(s)) === s);   // true — exact round-trip`,
        codeTs: `function serialize(root: TreeNode | null): string {
  const out: string[] = [];
  (function go(n: TreeNode | null) {
    if (!n) { out.push('#'); return; }
    out.push(String(n.val)); go(n.left); go(n.right);
  })(root);
  return out.join(',');
}`,
        outputJs: `1,2,#,#,3,4,#,#,5,#,#
true`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Every node contributes its value; every missing child contributes a "#". The deserializer consumes tokens in the same preorder, so it always knows whether the next token is a real node or an absent one. serialize(deserialize(s)) === s confirms the encoding is lossless.',
        explainHi: 'Har node apni value deta hai; har missing child ek "#" deta hai. Deserializer usi preorder mein tokens consume karta hai, isliye ye hamesha jaanta hai ki agla token ek asli node hai ya ek anupasthit. serialize(deserialize(s)) === s confirm karta hai ki encoding lossless hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// building from preorder + inorder but scanning inorder linearly each call
const mid = inorder.indexOf(rootVal, lo);   // O(n) inside an O(n) recursion -> O(n^2)`,
        right: `const pos = new Map();
inorder.forEach((v, i) => pos.set(v, i));
const mid = pos.get(rootVal);               // O(1) lookup -> O(n) overall`,
        why: 'The recursion already visits n nodes; doing an O(n) indexOf at each one makes it O(n^2), which times out on a 10^4-node tree. Precomputing value -> index in a Map once turns each split into a constant-time lookup.',
        whyHi: 'Recursion pehle se n nodes visit karta hai; har ek par ek O(n) indexOf karna ise O(n^2) banaata hai, jo ek 10^4-node tree par time out karta hai. Ek Map mein value -> index ek baar precompute karna har split ko ek constant-time lookup banaata hai.',
      },
      {
        wrong: `// serializing a tree with just the values, no null markers
function serialize(root) { return preorderValues(root).join(','); }
// "1,2,3" — cannot tell a left-only child from a right-only child`,
        right: `function serialize(root) {
  // include '#' for every absent child so the structure is recoverable
  if (!root) return '#';
  return root.val + ',' + serialize(root.left) + ',' + serialize(root.right);
}`,
        why: 'A traversal of only the present values is exactly as ambiguous as a single traversal: many different tree shapes produce the same value sequence. Recording a marker for every null child pins the shape down, because the deserializer then knows precisely where each subtree ends.',
        whyHi: 'Sirf maujood values ka ek traversal bilkul ek akele traversal jitna ambiguous hai: kayi alag tree shapes wahi value sequence banaate hain. Har null child ke liye ek marker record karna shape ko tay kar deta hai, kyunki deserializer tab thik jaanta hai ki har subtree kahaan khatam hota hai.',
      },
      {
        wrong: `// postorder + inorder but building left child before right
node.left  = build(lo, mid - 1);
node.right = build(mid + 1, hi);
// with p-- consuming postorder from the end, this assigns the RIGHT subtree's
// nodes to node.left`,
        right: `node.right = build(mid + 1, hi);   // right FIRST when consuming postorder backwards
node.left  = build(lo, mid - 1);`,
        why: 'Postorder is left, then right, then root. Consuming it from the back yields root, then right, then left. So after taking the root you must build the right subtree next, because that is what the next postorder values (read backwards) describe.',
        whyHi: 'Postorder left, phir right, phir root hai. Ise peechhe se consume karna root, phir right, phir left deta hai. Toh root lene ke baad aapko agla right subtree banana hoga, kyunki agli postorder values (peechhe se padhi) wahi varnit karti hain.',
      },
    ],

    realWorld: [
      {
        en: '**Compilers and interpreters** parse source code into an abstract syntax tree, then serialize that tree to bytecode or an on-disk cache and deserialize it later — the exact build-from-linear and serialize-to-linear round trip.',
        hi: '**Compilers aur interpreters** source code ko ek abstract syntax tree mein parse karte hain, phir us tree ko bytecode ya ek on-disk cache mein serialize karte hain aur baad mein deserialize karte hain — bilkul build-from-linear aur serialize-to-linear round trip.',
      },
      {
        en: '**Distributed systems and caches** serialize tree-shaped state (a DOM subtree, a config tree, a Merkle tree) to send it over the network; the null markers are what let the receiver rebuild the exact structure.',
        hi: '**Distributed systems aur caches** tree-shaped state (ek DOM subtree, ek config tree, ek Merkle tree) ko network par bhejne ke liye serialize karte hain; null markers wo hain jo receiver ko exact structure dobara banane dete hain.',
      },
      {
        en: '**Databases** persist B-tree and index pages as flat byte sequences and reconstruct the in-memory tree on load; getting the serialization format unambiguous is a correctness requirement, not an optimisation.',
        hi: '**Databases** B-tree aur index pages ko flat byte sequences ki tarah persist karte hain aur load par in-memory tree dobara banate hain; serialization format ko unambiguous karna ek shuddhata zaroorat hai, ek optimisation nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why do preorder and inorder together uniquely determine a binary tree, when neither does alone?',
        qHi: 'Preorder aur inorder saath ek binary tree ko anokhe roop se kyun tay karte hain, jab koi bhi akela nahi karta?',
        a: 'A single traversal gives you the values in some order but throws away the branching structure — many differently shaped trees flatten to the same preorder, and likewise for inorder. What each of the two traversals contributes is a different piece of the missing information, and together they are complete. Preorder visits the root before either subtree, so the first value in any preorder segment is the root of the subtree that segment describes, and reading preorder left to right hands you the subtree roots in exactly the order a top-down recursion needs them. That tells you the "what" at each step but not the "how big" — you know the root but not where its left subtree ends and its right begins. Inorder supplies precisely that. Inorder visits the entire left subtree, then the root, then the entire right subtree, so once you know the root\'s value, its position in the inorder sequence is a dividing line: every value to the left of that position belongs to the left subtree, every value to the right belongs to the right subtree, and the counts on each side tell you how many preorder values to consume for each. So the algorithm is: take the next preorder value as the current root, find it in inorder, recurse on the left inorder slice and then the right inorder slice, letting the preorder pointer advance as it goes. The one requirement is that values are distinct, because the method locates the root in inorder by value; with duplicates you cannot tell which occurrence is the current root. The complexity is linear if you precompute a hash map from value to inorder index, so each lookup is constant rather than a linear scan. As a footnote, preorder plus postorder is not enough for a general tree — it fails to distinguish a node with only a left child from a node with only a right child — but it does work if every node has either zero or two children.',
        aHi: 'Ek akela traversal aapko values kisi kram mein deta hai par branching structure phenk deta hai — kayi alag shape ke trees usi preorder mein flatten hote hain, aur inorder ke liye bhi waise hi. Do traversals mein se har ek jo deta hai wo laapata jaankari ka ek alag tukda hai, aur saath wo poore hain. Preorder root ko kisi bhi subtree se pehle visit karta hai, isliye kisi bhi preorder segment mein pehli value us subtree ki root hai jo wo segment varnit karta hai, aur preorder ko left se right padhna aapko subtree roots bilkul us kram mein deta hai jo ek top-down recursion ko chahiye. Wo aapko har step par "kya" batata hai par "kitna bada" nahi — aap root jaante ho par ye nahi ki iska left subtree kahaan khatam hota hai aur right kahaan shuru. Inorder bilkul wahi deta hai. Inorder poora left subtree, phir root, phir poora right subtree visit karta hai, isliye ek baar aap root ki value jaante ho, inorder sequence mein iski position ek vibhaajak rekha hai: us position ke left ki har value left subtree ki hai, right ki har value right subtree ki hai. Toh algorithm hai: agli preorder value ko current root lo, ise inorder mein dhoondho, left inorder slice par phir right inorder slice par recurse karo. Ek zaroorat ye hai ki values distinct hon.',
      },
      {
        q: 'Design serialize and deserialize for a binary tree. What makes an encoding lossless, and what are the two common formats?',
        qHi: 'Ek binary tree ke liye serialize aur deserialize design karo. Ek encoding ko lossless kya banaata hai, aur do aam formats kya hain?',
        a: 'An encoding is lossless if deserialize of serialize returns a tree identical in both values and shape to the original, for every possible tree. The trap is to serialize only the node values in some traversal order — that is exactly as ambiguous as a single traversal, because the shape is lost, and multiple trees produce the same string. The fix is to record structure explicitly, and the simplest way is a marker for every absent child. The first common format is a preorder DFS: write the root\'s value, then recursively serialize the left child, then the right child, and whenever a child is null write a sentinel like a hash symbol instead. Deserialize mirrors this: read tokens in order, and for each token, if it is the sentinel return null, otherwise create a node, then recursively build its left child and its right child from the following tokens. Because both directions walk the same preorder and both emit or consume a token for every node including the nulls, the deserializer never has to guess where a subtree ends. The second common format is level-order BFS, which is the notation most competitive judges use, the one that looks like an array with nulls in it. Serialize by running a queue: dequeue a node, append its value, enqueue both children even if null; when you dequeue a null, append the sentinel and enqueue nothing. Deserialize by reading the first token as the root, then walking a queue: for each dequeued node, the next two tokens are its left and right children, create real nodes for non-sentinel tokens and enqueue them. Both formats are linear time and linear space. DFS has shorter code and recurses; BFS matches the standard array notation and is iterative. A refinement worth mentioning: you can often drop trailing nulls in the BFS form, and for a BST you do not need null markers at all because the ordering property lets you rebuild from the bounds.',
        aHi: 'Ek encoding lossless hai agar serialize ka deserialize har sambhav tree ke liye ek aisa tree lautaata hai jo values aur shape dono mein original ke samaan hai. Jaal ye hai ki sirf node values ko kisi traversal kram mein serialize karna — wo bilkul ek akele traversal jitna ambiguous hai, kyunki shape kho jaata hai. Fix structure ko explicitly record karna hai, aur sabse saral tarika har anupasthit child ke liye ek marker hai. Pehla aam format ek preorder DFS hai: root ki value likho, phir recursively left child serialize karo, phir right child, aur jab bhi ek child null ho ek sentinel jaise ek hash symbol likho. Deserialize ise darpan karta hai: tokens kram mein padho, aur har token ke liye, agar wo sentinel hai null lautaao, warna ek node banao, phir recursively iske left child aur iske right child ko agle tokens se banao. Doosra aam format level-order BFS hai, jo notation adhikaansh competitive judges istemal karte hain, jo nulls ke saath ek array jaisa dikhta hai. Ek queue chalakar serialize karo: ek node dequeue karo, iski value append karo, dono children enqueue karo chahe null hon. Dono formats linear time aur linear space hain.',
      },
    ],

    exercises: [
      {
        task: 'Implement buildTree(preorder, inorder) with the Map optimisation. Verify buildTree([3,9,20,15,7], [9,3,15,20,7]) round-trips (its own preorder and inorder equal the inputs). Then replace pos.get(v) with inorder.indexOf(v) and measure the slowdown on a 5000-node left-leaning tree.',
        taskHi: 'buildTree(preorder, inorder) ko Map optimisation ke saath implement karo. Verify karo ki buildTree([3,9,20,15,7], [9,3,15,20,7]) round-trips karta hai (iska apna preorder aur inorder inputs ke barabar). Phir pos.get(v) ko inorder.indexOf(v) se badlo aur ek 5000-node left-leaning tree par slowdown maapo.',
        hint: 'A left-leaning tree of n nodes has inorder = the values reversed-ish, and indexOf scans on average n/2 per call over n calls -> ~12.5 million ops for n=5000 versus 5000 with the Map.',
        hintHi: 'n nodes ke ek left-leaning tree ka inorder = values thodi-ulti, aur indexOf n calls par prati call average n/2 scan karta hai -> n=5000 ke liye ~12.5 million ops versus Map ke saath 5000.',
      },
      {
        task: 'Implement serialize and deserialize (preorder + "#" markers). Build the tree 1 -> (2, 3), 3 -> (4, 5), serialize it, and verify serialize(deserialize(s)) === s. Then remove the "#" push for null children and show that "1,2,3,4,5" deserializes to a wrong shape (or throws).',
        taskHi: 'serialize aur deserialize (preorder + "#" markers) implement karo. Tree 1 -> (2, 3), 3 -> (4, 5) banao, ise serialize karo, aur verify karo ki serialize(deserialize(s)) === s. Phir null children ke liye "#" push hataao aur dikhao ki "1,2,3,4,5" ek galat shape mein deserialize hota hai (ya throw karta hai).',
        hint: 'Without null markers the deserializer greedily makes 2 the left child of 1, then 3 the left child of 2, etc. — a right-leaning... no, left-leaning chain, not the original. The markers are what bound each subtree.',
        hintHi: 'Null markers ke bina deserializer laalchi tarike se 2 ko 1 ka left child banaata hai, phir 3 ko 2 ka left child, etc. — ek left-leaning chain, original nahi. Markers wo hain jo har subtree ko bound karte hain.',
      },
      {
        task: 'Implement serializeBFS and deserializeBFS (level-order with "#", trailing nulls trimmed). Verify it round-trips the tree 1 -> (2, 3), 2 -> (null, 4). Compare its output string to the DFS serialize of the same tree and note how the BFS form matches the "[1,2,3,null,4]" style notation.',
        taskHi: 'serializeBFS aur deserializeBFS (level-order with "#", trailing nulls trim kiye) implement karo. Verify karo ki ye tree 1 -> (2, 3), 2 -> (null, 4) ko round-trips karta hai. Iske output string ko usi tree ke DFS serialize se compare karo aur note karo ki BFS form "[1,2,3,null,4]" style notation se kaise match karta hai.',
        hint: 'BFS output is "1,2,3,#,4" — read level by level (the trailing "#,#" for node 4\'s empty children are trimmed). DFS output for the same tree is "1,2,#,4,#,#,3,#,#" — read root-left-right. Both round-trip; they just serialize in different orders.',
        hintHi: 'BFS output "1,2,3,#,4" hai — level dar level padho (node 4 ke khaali children ke trailing "#,#" trim ho jaate hain). Usi tree ke liye DFS output "1,2,#,4,#,#,3,#,#" hai — root-left-right padho. Dono round-trip karte hain; wo bas alag kramon mein serialize karte hain.',
      },
    ],

    keyTakeaways: [
      'One traversal cannot rebuild a tree — many shapes flatten to the same sequence. You need a second traversal, or explicit null markers.',
      'preorder + inorder: preorder read left-to-right gives the subtree roots in order; the root\'s index in inorder splits the remaining values into left-subtree and right-subtree.',
      'Precompute a Map from value to inorder index — O(1) split lookup makes the build O(n). Using indexOf inside the recursion is O(n^2).',
      'postorder + inorder is the mirror: consume postorder from the END and build the RIGHT child before the left.',
      'preorder + postorder only works for full binary trees (every node has 0 or 2 children); it cannot distinguish a lone left child from a lone right child.',
      'Serialize losslessly by recording a marker ("#") for every absent child. Values alone are as ambiguous as a single traversal.',
      'Two serialization formats: preorder DFS (shorter, recursive) and level-order BFS (matches the "[1,2,null,3]" array notation, iterative). Both are O(n) time and space.',
      'A BST\'s preorder alone rebuilds it — the ordering property supplies the missing "which side" information via (min, max) bounds.',
    ],
    keyTakeawaysHi: [
      'Ek traversal ek tree dobara nahi bana sakta — kayi shapes usi sequence mein flatten hote hain. Aapko ek doosra traversal chahiye, ya explicit null markers.',
      'preorder + inorder: preorder left-se-right padha subtree roots kram mein deta hai; inorder mein root ka index baaki values ko left-subtree aur right-subtree mein baant deta hai.',
      'Value se inorder index tak ek Map precompute karo — O(1) split lookup build ko O(n) banaata hai. Recursion ke andar indexOf istemal karna O(n^2) hai.',
      'postorder + inorder darpan hai: postorder ko END se consume karo aur left se pehle RIGHT child banao.',
      'preorder + postorder sirf full binary trees ke liye kaam karta hai (har node ke 0 ya 2 children); ye ek akele left child ko ek akele right child se alag nahi kar sakta.',
      'Har anupasthit child ke liye ek marker ("#") record karke losslessly serialize karo. Akeli values ek akele traversal jitni ambiguous hain.',
      'Do serialization formats: preorder DFS (chhota, recursive) aur level-order BFS ("[1,2,null,3]" array notation se match, iterative). Dono O(n) time aur space hain.',
      'Ek BST ka akela preorder ise dobara banaata hai — ordering property (min, max) bounds ke zariye laapata "kaunsa side" jaankari deti hai.',
    ],
  },
];
