/**
 * DSA Complete Course — Module 7: Trees, lesson 6.
 *
 * The dominant tree-interview pattern: writing a recursion that RETURNS a small
 * bundle of information from each subtree, so the parent can combine the two
 * bundles and answer a question about itself in O(1). Builds on this module's
 * lesson 1 (postorder — "code after the recursive calls runs on the unwind", so
 * a node can use its children's results) and lesson 3 (the BST invariant), plus
 * this course's Module 6 (recursion ordering). Broken example: validating a
 * binary search tree by checking, at each node, only that node.left.value is
 * smaller and node.right.value is larger — a purely LOCAL check that passes on a
 * tree which is not a BST, because a value deep inside the left subtree can
 * still be larger than an ancestor several levels up. Fixed by passing an
 * allowed (min, max) RANGE down the recursion, so each node is validated against
 * every ancestor's constraint, not just its parent's. The lesson then
 * generalises: height, diameter, balanced, path sum, and lowest common ancestor
 * are all the same "return info up, combine at the parent" shape.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_7_PART6: CourseLesson[] = [
  {
    slug: 'tree-recursion-patterns',
    title: 'Tree Recursion Patterns: Return Info Up, Combine at the Parent',
    titleHi: 'Tree Recursion Patterns: Info Upar Bhejo, Parent Par Combine Karo',
    description: 'Validating a binary search tree by checking at each node only that its left child is smaller and its right child is larger. Every individual node passes, but the tree can still be an invalid BST: a value buried deep in the left subtree may be larger than an ancestor several levels above it, and a parent-only check never looks that far.',
    descriptionHi: 'Ek binary search tree validate karna har node par sirf ye check karke ki iska left child chhota hai aur right child bada. Har individual node pass hota hai, par tree phir bhi ek invalid BST ho sakta hai: left subtree mein gehra dabaa ek value iske kai levels upar ek ancestor se bada ho sakta hai, aur ek sirf-parent check kabhi itna door nahi dekhta.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 6,

    analogy: {
      en: '**Auditing a company by asking each manager only about their own direct reports, versus asking every employee for a signed summary that rolls up the chain.** If your only question is "is each person paid less than their direct manager", you can walk the whole org chart and get a clean answer while the company is still, overall, a mess — a junior three levels down might out-earn a director in another branch, and no single manager-to-report comparison ever catches it, because nobody is comparing across those levels. The reliable audit works differently: every employee hands their manager a small summary card — say, the highest and lowest salary anywhere beneath them, plus whether their own branch is already broken. Each manager reads the two cards from below, combines them with their own salary in one step, writes a fresh card, and passes it up. By the time the card reaches the CEO, it summarises the entire company, and any violation anywhere was caught by whichever manager first had both halves of the picture in hand. That is exactly the shape of a good tree recursion: each node returns a compact bundle summarising its whole subtree, and the parent combines the two bundles in constant time.',
      hi: '**Ek company audit karna har manager se sirf unke apne direct reports ke baare mein poochkar, versus har employee se ek signed summary maangkar jo chain upar roll karti hai.** Agar aapka ekmatra sawaal hai "kya har vyakti apne direct manager se kam paid hai", aap poora org chart chal sakte ho aur ek saaf jawaab paa sakte ho jabki company abhi bhi, kul milakar, ek gadbad hai — teen level neeche ek junior doosri branch mein ek director se zyaada kama sakta hai, aur koi akela manager-to-report comparison ise kabhi nahi pakadta, kyunki koi un levels ke aar-paar compare nahi kar raha. Bharosemand audit alag kaam karta hai: har employee apne manager ko ek chhota summary card deta hai — maano, unke neeche kahin bhi sabse zyaada aur sabse kam salary, plus kya unki apni branch pehle se tooti hai. Har manager neeche se do cards padhta hai, unhe apni salary ke saath ek step mein combine karta hai, ek fresh card likhta hai, aur ise upar bhejta hai. Jab card CEO tak pahunchta hai, ye poori company summarise karta hai, aur kahin bhi koi violation us manager se pakda gaya jiske paas pehli baar tasveer ke dono aadhe the. Wo bilkul ek achhi tree recursion ka shape hai: har node ek compact bundle return karta hai jo apne poore subtree ko summarise karta hai, aur parent do bundles ko constant time mein combine karta hai.',
    },

    simple: `**Start broken.** Validate a BST with a parent-only comparison:

\`\`\`js
function isValidBSTBroken(node) {
  if (node === null) return true;
  if (node.left && node.left.value >= node.value) return false;    // only the direct child
  if (node.right && node.right.value <= node.value) return false;  // only the direct child
  return isValidBSTBroken(node.left) && isValidBSTBroken(node.right);
}

//        10
//       /  \\
//      5    15
//          /  \\
//         6    20      <- 6 is in 10's RIGHT subtree but 6 < 10 -> NOT a BST
//
// Every parent-child pair is fine: 5 < 10, 15 > 10, 6 < 15, 20 > 15.
// isValidBSTBroken returns TRUE. The tree is not a BST.
\`\`\`

This module's lesson 3 stated the BST invariant precisely: for **any** node, *every* value in its left subtree is smaller and *every* value in its right subtree is larger. That is a claim about the whole subtree, not about the two children. A check that only compares a node with its immediate children can never see that \`6\` violates a constraint imposed by \`10\`, two levels up.

**The fix: carry the allowed range down the recursion**

\`\`\`js
function isValidBST(node, min = -Infinity, max = Infinity) {
  if (node === null) return true;                       // empty is trivially valid
  if (node.value <= min || node.value >= max) return false;  // violates an ancestor's bound

  return isValidBST(node.left, min, node.value)        // left: upper bound tightens to node
      && isValidBST(node.right, node.value, max);      // right: lower bound tightens to node
}
\`\`\`

\`\`\`ts
interface TreeNode { value: number; left: TreeNode | null; right: TreeNode | null }

function isValidBST(node: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (node === null) return true;
  if (node.value <= min || node.value >= max) return false;
  return isValidBST(node.left, min, node.value)
      && isValidBST(node.right, node.value, max);
}
\`\`\`

Every node now knows the window it is allowed to live in, and that window is the intersection of *every* ancestor's constraint. Going left tightens the upper bound to the current node's value; going right tightens the lower bound. Tracing the broken tree: \`10\` gets \`(-inf, inf)\`, \`15\` gets \`(10, inf)\`, and \`6\` gets \`(10, 15)\` — and \`6 <= 10\`, so it is correctly rejected.

**The general shape: return a bundle, combine at the parent**

\`\`\`js
// Height of a tree: each subtree returns ONE number, the parent combines with max.
function height(node) {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

// Diameter (longest path between any two nodes) — the classic "return one thing,
// track another" problem. Height goes UP; the answer is recorded on the side.
function diameter(root) {
  let best = 0;
  function depth(node) {
    if (node === null) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    best = Math.max(best, l + r);        // path THROUGH this node: left depth + right depth
    return 1 + Math.max(l, r);           // but return only the depth, for the parent
  }
  depth(root);
  return best;
}
\`\`\`

\`diameter\` is the pattern in its purest form. The value a node must **return** (its own depth, so the parent can compute its depth) is *not* the value the problem **asks for** (the longest path, which may pass sideways through this node and never reach the root). So you return one thing and accumulate the other in a variable that outlives the recursion. Recognising when these two differ is most of the skill in tree problems.`,

    simpleHi: `**Toote hue se shuru.** Ek BST ko sirf-parent comparison se validate karo:

\`\`\`js
function isValidBSTBroken(node) {
  if (node === null) return true;
  if (node.left && node.left.value >= node.value) return false;    // sirf seedha child
  if (node.right && node.right.value <= node.value) return false;  // sirf seedha child
  return isValidBSTBroken(node.left) && isValidBSTBroken(node.right);
}

//        10
//       /  \\
//      5    15
//          /  \\
//         6    20      <- 6 10 ke RIGHT subtree mein hai par 6 < 10 -> BST NAHI
//
// Har parent-child pair theek hai: 5 < 10, 15 > 10, 6 < 15, 20 > 15.
// isValidBSTBroken TRUE return karta hai. Tree ek BST nahi hai.
\`\`\`

Is module ke lesson 3 ne BST invariant thik-thik bataya: **kisi bhi** node ke liye, iske left subtree mein *har* value chhoti hai aur iske right subtree mein *har* value badi. Wo poore subtree ke baare mein ek daawa hai, do children ke baare mein nahi. Ek check jo sirf ek node ko iske turant children se compare karta hai kabhi nahi dekh sakta ki \`6\` \`10\` dwara lagaayi ek constraint todta hai, do level upar.

**Fix: allowed range ko recursion mein neeche le jao**

\`\`\`js
function isValidBST(node, min = -Infinity, max = Infinity) {
  if (node === null) return true;                       // khaali trivially valid hai
  if (node.value <= min || node.value >= max) return false;  // ek ancestor ka bound todta hai

  return isValidBST(node.left, min, node.value)        // left: upper bound node tak tight hota hai
      && isValidBST(node.right, node.value, max);      // right: lower bound node tak tight hota hai
}
\`\`\`

\`\`\`ts
interface TreeNode { value: number; left: TreeNode | null; right: TreeNode | null }

function isValidBST(node: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (node === null) return true;
  if (node.value <= min || node.value >= max) return false;
  return isValidBST(node.left, min, node.value)
      && isValidBST(node.right, node.value, max);
}
\`\`\`

Har node ab jaanta hai wo window jismein use rehne ki anumati hai, aur wo window *har* ancestor ki constraint ka intersection hai. Left jaana upper bound ko current node ki value tak tight karta hai; right jaana lower bound ko. Toote tree ko trace karte hue: \`10\` ko \`(-inf, inf)\` milta hai, \`15\` ko \`(10, inf)\`, aur \`6\` ko \`(10, 15)\` — aur \`6 <= 10\`, isliye ye sahi tarah reject hota hai.

**General shape: ek bundle return karo, parent par combine karo**

\`\`\`js
// Ek tree ki height: har subtree EK number return karta hai, parent max se combine karta hai.
function height(node) {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

// Diameter (kisi bhi do nodes ke beech sabse lamba path) — classic "ek cheez return karo,
// doosri track karo" problem. Height UPAR jaati hai; jawaab side mein record hota hai.
function diameter(root) {
  let best = 0;
  function depth(node) {
    if (node === null) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    best = Math.max(best, l + r);        // is node ke THROUGH path: left depth + right depth
    return 1 + Math.max(l, r);           // par sirf depth return karo, parent ke liye
  }
  depth(root);
  return best;
}
\`\`\`

\`diameter\` pattern apne shuddhtam roop mein hai. Wo value jo ek node ko **return** karni chahiye (iski apni depth, taaki parent apni depth compute kar sake) *wo nahi* hai jo problem **maangti** hai (sabse lamba path, jo is node ke through baglee jaa sakta hai aur kabhi root tak nahi pahunchta). Toh aap ek cheez return karte ho aur doosri ko ek aise variable mein jama karte ho jo recursion se zyaada jeeta hai. Ye pehchaanna ki ye dono kab alag hain tree problems mein zyaadaatar skill hai.`,

    content: `## The "bundle" made explicit: is-balanced in one pass

\`\`\`js
// A tree is balanced if, at EVERY node, the two subtree heights differ by <= 1.
// Naive: call height() inside a recursive isBalanced() -> O(n^2), height is recomputed.
function isBalancedNaive(node) {
  if (node === null) return true;
  if (Math.abs(height(node.left) - height(node.right)) > 1) return false;
  return isBalancedNaive(node.left) && isBalancedNaive(node.right);   // height() re-walks everything
}

// One pass: return the height, but use -1 as a sentinel meaning "already unbalanced".
function isBalanced(root) {
  function check(node) {
    if (node === null) return 0;
    const l = check(node.left);
    if (l === -1) return -1;                      // propagate failure up immediately
    const r = check(node.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;           // this node is the violation
    return 1 + Math.max(l, r);                    // otherwise return the real height
  }
  return check(root) !== -1;
}
\`\`\`

The naive version is O(n^2) on a skewed tree because \`height\` walks the whole subtree again at every node — exactly the "repeated scan" waste this course's Module 14 catalogues. Bundling the two facts a parent needs (the height, and whether anything below is already broken) into one return value collapses it to a single O(n) pass. Using a sentinel like \`-1\` works when the valid range excludes it; otherwise return an object such as \`{ height, ok }\`.

## Path sum: carrying a running total DOWN while recursing

\`\`\`js
// Is there a root-to-leaf path whose values sum to exactly 'target'?
function hasPathSum(node, target) {
  if (node === null) return false;
  const remaining = target - node.value;
  if (node.left === null && node.right === null) return remaining === 0;  // at a LEAF
  return hasPathSum(node.left, remaining) || hasPathSum(node.right, remaining);
}
\`\`\`

Two different directions of information flow appear across these problems, and mixing them up is the usual bug:

\`\`\`
DOWN the recursion (passed as an argument):
  - a constraint from the ancestors        (isValidBST's min/max window)
  - a running accumulation so far          (hasPathSum's remaining target,
                                            the path array in "print all paths")

UP the recursion (the return value):
  - a summary of the subtree               (height, size, sum, min/max,
                                            "is this subtree a valid BST")
\`\`\`

The base case for a leaf is worth care in \`hasPathSum\`: the check must be "both children are null", not "node is null". If you test at \`node === null\` you accept a half-path — a node with one child would report success down its missing side.

## Lowest common ancestor: the answer bubbles up

\`\`\`js
// LCA in a general binary tree: the deepest node having p and q in different
// subtrees (or being one of them itself).
function lca(node, p, q) {
  if (node === null) return null;
  if (node === p || node === q) return node;        // found one of the targets

  const left = lca(node.left, p, q);
  const right = lca(node.right, p, q);

  if (left !== null && right !== null) return node; // one target on each side -> THIS is the LCA
  return left !== null ? left : right;              // otherwise pass up whichever was found
}
\`\`\`

Each call returns "a target node found below me, or the LCA if I already am it". A node that receives a non-null result from *both* sides is by definition the deepest node with one target in each subtree, so it returns itself, and every ancestor above simply passes that answer up unchanged (because the other side will be null for them). O(n) time, one pass.

For a **binary search tree** the same problem is easier, because the invariant tells you which way to walk:

\`\`\`js
function lcaBST(node, p, q) {
  while (node !== null) {
    if (p.value < node.value && q.value < node.value) node = node.left;        // both smaller
    else if (p.value > node.value && q.value > node.value) node = node.right;  // both larger
    else return node;                       // they split here (or one IS this node)
  }
  return null;
}
\`\`\`

## The template you can reach for

\`\`\`
function solve(node):
    if node is null: return <identity value>       # 0, true, -1, {h:0, ok:true}, ...

    leftInfo  = solve(node.left)                   # both children FIRST (postorder,
    rightInfo = solve(node.right)                  #   Module 7 lesson 1)

    <use leftInfo, rightInfo and node's own value to:
       - update an outer accumulator, if the answer is not what you return
       - build this node's bundle>

    return <this node's bundle>

Then ask two questions before writing it:
  1. What must I RETURN so my parent can do its job?
  2. Is the problem's answer the same as that, or does it need a separate
     accumulator (diameter, max path sum, count of good nodes)?
\`\`\``,

    contentHi: `## "Bundle" explicit banaya: ek pass mein is-balanced

\`\`\`js
// Ek tree balanced hai agar, HAR node par, do subtree heights <= 1 se alag hain.
// Naive: ek recursive isBalanced() ke andar height() call karo -> O(n^2), height dobara compute.
function isBalancedNaive(node) {
  if (node === null) return true;
  if (Math.abs(height(node.left) - height(node.right)) > 1) return false;
  return isBalancedNaive(node.left) && isBalancedNaive(node.right);   // height() sab dobara chalta hai
}

// Ek pass: height return karo, par -1 ko ek sentinel ki tarah "pehle se unbalanced" ke liye.
function isBalanced(root) {
  function check(node) {
    if (node === null) return 0;
    const l = check(node.left);
    if (l === -1) return -1;                      // failure turant upar propagate karo
    const r = check(node.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;           // ye node violation hai
    return 1 + Math.max(l, r);                    // warna asli height return karo
  }
  return check(root) !== -1;
}
\`\`\`

Naive version ek skewed tree par O(n^2) hai kyunki \`height\` har node par poora subtree phir chalta hai — bilkul wo "repeated scan" waste jise is course ka Module 14 catalogue karta hai. Do tathya jo ek parent ko chahiye (height, aur kya neeche kuch pehle se toota hai) ko ek return value mein bundle karna ise ek akele O(n) pass mein collapse karta hai. \`-1\` jaisa sentinel istemal karna tab kaam karta hai jab valid range ise exclude karti hai; warna \`{ height, ok }\` jaisa ek object return karo.

## Path sum: recurse karte hue ek running total NEECHE le jaana

\`\`\`js
// Kya ek root-se-leaf path hai jiski values bilkul 'target' tak sum karti hain?
function hasPathSum(node, target) {
  if (node === null) return false;
  const remaining = target - node.value;
  if (node.left === null && node.right === null) return remaining === 0;  // ek LEAF par
  return hasPathSum(node.left, remaining) || hasPathSum(node.right, remaining);
}
\`\`\`

In problems ke aar-paar information flow ki do alag directions aati hain, aur unhe mila dena aam bug hai:

\`\`\`
Recursion mein NEECHE (ek argument ki tarah pass kiya):
  - ancestors se ek constraint          (isValidBST ka min/max window)
  - ab tak ek running accumulation      (hasPathSum ka remaining target,
                                         "sab paths print karo" mein path array)

Recursion mein UPAR (return value):
  - subtree ki ek summary               (height, size, sum, min/max,
                                         "kya ye subtree ek valid BST hai")
\`\`\`

\`hasPathSum\` mein ek leaf ke liye base case dhyaan ke laayak hai: check "dono children null hain" hona chahiye, "node null hai" nahi. Agar aap \`node === null\` par test karte ho aap ek aadha-path accept karte ho — ek child waala node apni missing side neeche safalta report karta.

## Lowest common ancestor: jawaab upar bubble karta hai

\`\`\`js
// Ek general binary tree mein LCA: sabse gehra node jiske p aur q alag subtrees
// mein hain (ya jo khud unmein se ek hai).
function lca(node, p, q) {
  if (node === null) return null;
  if (node === p || node === q) return node;        // ek target mila

  const left = lca(node.left, p, q);
  const right = lca(node.right, p, q);

  if (left !== null && right !== null) return node; // har side ek target -> YE LCA hai
  return left !== null ? left : right;              // warna jo mila use upar bhejo
}
\`\`\`

Har call return karta hai "mere neeche mila ek target node, ya LCA agar main pehle se hoon". Ek node jo *dono* sides se ek non-null result paata hai paribhaasha se sabse gehra node hai jiske har subtree mein ek target hai, isliye ye khud ko return karta hai, aur upar har ancestor bas us jawaab ko na-badla upar bhejta hai (kyunki unke liye doosri side null hogi). O(n) time, ek pass.

Ek **binary search tree** ke liye wahi problem aasaan hai, kyunki invariant batata hai kis taraf chalna hai:

\`\`\`js
function lcaBST(node, p, q) {
  while (node !== null) {
    if (p.value < node.value && q.value < node.value) node = node.left;        // dono chhote
    else if (p.value > node.value && q.value > node.value) node = node.right;  // dono bade
    else return node;                       // wo yahaan alag hote hain (ya ek YE node HAI)
  }
  return null;
}
\`\`\`

## Wo template jiski taraf aap pahunch sakte ho

\`\`\`
function solve(node):
    if node null hai: return <identity value>      # 0, true, -1, {h:0, ok:true}, ...

    leftInfo  = solve(node.left)                   # dono children PEHLE (postorder,
    rightInfo = solve(node.right)                  #   Module 7 lesson 1)

    <leftInfo, rightInfo aur node ki apni value istemal karke:
       - ek outer accumulator update karo, agar jawaab wo nahi jo aap return karte ho
       - is node ka bundle banao>

    return <is node ka bundle>

Phir ise likhne se pehle do sawaal poocho:
  1. Mujhe kya RETURN karna chahiye taaki mera parent apna kaam kar sake?
  2. Kya problem ka jawaab wahi hai, ya use ek alag accumulator chahiye
     (diameter, max path sum, good nodes ki count)?
\`\`\``,

    examples: [
      {
        title: 'Broken: BST validated only against direct children',
        titleHi: 'Toota: BST sirf seedhe children ke against validate kiya',
        code: `if (node.left && node.left.value >= node.value) return false;   // local only
if (node.right && node.right.value <= node.value) return false;`,
        codeJs: `function isValidBSTBroken(node) {
  if (node === null) return true;
  if (node.left && node.left.value >= node.value) return false;
  if (node.right && node.right.value <= node.value) return false;
  return isValidBSTBroken(node.left) && isValidBSTBroken(node.right);
}
// tree:  10 -> left 5, right 15;  15 -> left 6, right 20
console.log(isValidBSTBroken(tree)); // true — WRONG, 6 is right of 10 but 6 < 10`,
        codeTs: `function isValidBSTBroken(node: TreeNode | null): boolean {
  if (node === null) return true;
  if (node.left && node.left.value >= node.value) return false;
  if (node.right && node.right.value <= node.value) return false;
  return isValidBSTBroken(node.left) && isValidBSTBroken(node.right);
}`,
        output: `true`,
        explain: 'The BST invariant constrains a node against EVERY ancestor, not just its parent. A parent-only check cannot see that 6, sitting in 10\'s right subtree, violates the constraint imposed two levels above it.',
        explainHi: 'BST invariant ek node ko HAR ancestor ke against constrain karta hai, sirf iske parent ke nahi. Ek sirf-parent check nahi dekh sakta ki 6, jo 10 ke right subtree mein baitha hai, do level upar lagaayi constraint todta hai.',
      },
      {
        title: 'Fixed: pass the allowed (min, max) range down',
        titleHi: 'Theek: allowed (min, max) range neeche pass karo',
        code: `return isValidBST(node.left,  min, node.value)     // going left tightens the MAX
    && isValidBST(node.right, node.value, max);   // going right tightens the MIN`,
        codeJs: `function isValidBST(node, min = -Infinity, max = Infinity) {
  if (node === null) return true;
  if (node.value <= min || node.value >= max) return false;
  return isValidBST(node.left, min, node.value)
      && isValidBST(node.right, node.value, max);
}
// same tree as above
console.log(isValidBST(tree)); // false — 6 gets window (10, 15) and 6 <= 10`,
        codeTs: `function isValidBST(node: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (node === null) return true;
  if (node.value <= min || node.value >= max) return false;
  return isValidBST(node.left, min, node.value)
      && isValidBST(node.right, node.value, max);
}`,
        outputJs: `false`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each node carries the intersection of every ancestor constraint as a (min, max) window. Descending left lowers the ceiling to the current value; descending right raises the floor.',
        explainHi: 'Har node har ancestor constraint ka intersection ek (min, max) window ki tarah le jaata hai. Left utarna ceiling ko current value tak neeche karta hai; right utarna floor ko upar.',
      },
      {
        title: 'Diameter: return the depth, accumulate the answer separately',
        titleHi: 'Diameter: depth return karo, jawaab alag se jama karo',
        code: `best = Math.max(best, l + r);    // the ANSWER (path through this node)
return 1 + Math.max(l, r);       // what the PARENT needs (this node's depth)`,
        codeJs: `function diameter(root) {
  let best = 0;
  function depth(node) {
    if (node === null) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  }
  depth(root);
  return best;
}
// a tree whose longest path does NOT pass through the root still works,
// because every node gets its turn to update 'best'.`,
        codeTs: `function diameter(root: TreeNode | null): number {
  let best = 0;
  const depth = (node: TreeNode | null): number => {
    if (node === null) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  };
  depth(root);
  return best;
}`,
        outputJs: `// best = the longest left-depth + right-depth seen at any node`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The value the parent needs (depth) differs from the value the problem wants (longest path through any node), so one is returned and the other is accumulated in a closure variable. This split is the core tree-problem skill.',
        explainHi: 'Jo value parent ko chahiye (depth) wo us value se alag hai jo problem chahti hai (kisi bhi node ke through sabse lamba path), isliye ek return hoti hai aur doosri ek closure variable mein jama hoti hai. Ye split core tree-problem skill hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// isBalanced calling height() inside the recursion -> O(n^2)
if (Math.abs(height(node.left) - height(node.right)) > 1) return false;
return isBalanced(node.left) && isBalanced(node.right);`,
        right: `// bundle "height" and "already broken" into ONE return value, single O(n) pass
const l = check(node.left);  if (l === -1) return -1;
const r = check(node.right); if (r === -1) return -1;
return Math.abs(l - r) > 1 ? -1 : 1 + Math.max(l, r);`,
        why: 'Calling a helper that itself walks the subtree, from inside a recursion over the same tree, re-walks every node once per ancestor — O(n^2) on a skewed tree. Return everything the parent needs in one bundle instead.',
        whyHi: 'Ek helper call karna jo khud subtree chalta hai, usi tree par ek recursion ke andar se, har node ko prati ancestor ek baar dobara chalta hai — ek skewed tree par O(n^2). Iske bajaye parent ko jo chahiye sab ek bundle mein return karo.',
      },
      {
        wrong: `// hasPathSum testing the target at node === null instead of at a leaf
if (node === null) return target === 0;   // a one-child node succeeds down its missing side`,
        right: `if (node === null) return false;
if (node.left === null && node.right === null) return target - node.value === 0;`,
        why: 'A root-to-leaf path must end at a real leaf. Testing at the null child lets a node with only a left child "succeed" via its absent right child, reporting a path that does not exist.',
        whyHi: 'Ek root-se-leaf path ek asli leaf par khatam hona chahiye. Null child par test karna sirf ek left child waale node ko iske gair-maujood right child se "safal" hone deta hai, ek aisa path report karte hue jo maujood nahi.',
      },
      {
        wrong: `// returning the accumulator from the recursive helper
function depth(node) {
  ...
  return l + r;     // returns the PATH length, so the parent's depth is wrong
}`,
        right: `best = Math.max(best, l + r);   // record the path length on the side
return 1 + Math.max(l, r);      // return the DEPTH, which is what the parent needs`,
        why: 'The parent needs a value it can build on (depth). If the helper returns the answer instead, every level above computes nonsense. Keep "what I return" and "what I record" separate whenever they differ.',
        whyHi: 'Parent ko ek aisi value chahiye jispar wo bana sake (depth). Agar helper iske bajaye jawaab return karta hai, upar har level bakwaas compute karta hai. Jab bhi wo alag hon "main kya return karta hoon" aur "main kya record karta hoon" alag rakho.',
      },
    ],

    realWorld: [
      {
        en: '**File-system tools (du, size calculators, virus scanners)** compute a folder\'s total size by summing children\'s totals and adding the folder\'s own — the exact "return a bundle up" recursion.',
        hi: '**File-system tools (du, size calculators, virus scanners)** ek folder ka kul size children ke totals jodkar aur folder ka apna jodkar compute karte hain — bilkul wahi "ek bundle upar return karo" recursion.',
      },
      {
        en: '**Compilers and linters walk the abstract syntax tree this way** — each node returns a summary (type, whether it can throw, whether a variable is used) that the parent combines to check the enclosing construct.',
        hi: '**Compilers aur linters abstract syntax tree ko is tarah chalte hain** — har node ek summary return karta hai (type, kya ye throw kar sakta hai, kya ek variable istemal hota hai) jise parent enclosing construct check karne ke liye combine karta hai.',
      },
      {
        en: '**Lowest common ancestor powers permission inheritance and org-chart queries** — "what is the nearest folder / department that contains both of these" is answered by the same bubble-up recursion.',
        hi: '**Lowest common ancestor permission inheritance aur org-chart queries power karta hai** — "sabse kareeb folder / department kaunsa hai jismein ye dono hain" usi bubble-up recursion se jawaab milta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does the parent-only BST check fail, and what are the two standard correct approaches?',
        qHi: 'Sirf-parent BST check kyun fail hota hai, aur do standard sahi approaches kya hain?',
        a: 'The binary search tree property is a statement about entire subtrees, not about parent-child pairs. For any node, every single value anywhere in its left subtree must be smaller than it, and every value anywhere in its right subtree must be larger. A check that only compares a node with its two immediate children verifies a much weaker condition, and there are trees where every parent-child pair satisfies it while the whole-subtree property is violated. The standard example is a root of ten with a right child of fifteen, and fifteen having a left child of six. Ten and fifteen are fine, fifteen and six are fine, but six sits inside ten\'s right subtree and is smaller than ten, so the tree is not a valid BST and the local check misses it entirely. There are two correct approaches. The first is to carry an allowed range down the recursion. Each call receives a minimum and a maximum that the current node\'s value must lie strictly between, starting at negative and positive infinity at the root. When you descend into the left child you keep the same minimum but tighten the maximum to the current node\'s value; when you descend right you keep the maximum and raise the minimum to the current value. Because the bounds only ever tighten as you go down, the window at any node is the intersection of every ancestor\'s constraint, so a violation like the six is caught. The second approach uses the fact, established earlier in this module, that an inorder traversal of a valid BST produces a strictly increasing sequence. So you traverse inorder while remembering only the previously visited value, and if the current value is ever less than or equal to it, the tree is invalid. Both are a single O(n) pass; the range-passing version generalises more easily to variants, and the inorder version is often shorter to write.',
        aHi: 'Binary search tree property poore subtrees ke baare mein ek kathan hai, parent-child pairs ke baare mein nahi. Kisi bhi node ke liye, iske left subtree mein kahin bhi har akeli value isse chhoti honi chahiye, aur iske right subtree mein kahin bhi har value badi. Ek check jo sirf ek node ko iske do turant children se compare karta hai ek kaafi kamzor condition verify karta hai, aur aise trees hain jahaan har parent-child pair ise satisfy karta hai jabki poori-subtree property violate hoti hai. Standard udaharan das ka ek root hai pandrah ke ek right child ke saath, aur pandrah ka chhe ka ek left child. Das aur pandrah theek hain, pandrah aur chhe theek hain, par chhe das ke right subtree ke andar baitha hai aur das se chhota hai, isliye tree ek valid BST nahi hai aur local check ise poori tarah miss karta hai. Do sahi approaches hain. Pehla ek allowed range ko recursion mein neeche le jaana hai. Har call ek minimum aur ek maximum paati hai jinke beech current node ki value sakhti se honi chahiye, root par negative aur positive infinity par shuru karte hue. Jab aap left child mein utarte ho aap wahi minimum rakhte ho par maximum ko current node ki value tak tight karte ho; jab aap right utarte ho aap maximum rakhte ho aur minimum ko current value tak badhaate ho. Kyunki bounds neeche jaate hue sirf tight hote hain, kisi bhi node par window har ancestor ki constraint ka intersection hai. Doosra approach us tathya ka istemal karta hai ki ek valid BST ka inorder traversal ek sakhti se badhta sequence banaata hai. Toh aap inorder traverse karte ho sirf pichhli visit ki gayi value yaad rakhte hue, aur agar current value kabhi isse kam ya barabar hai, tree invalid hai.',
      },
      {
        q: 'In tree recursion, how do you decide what the helper should return versus what should be accumulated outside it? Use diameter as the example.',
        qHi: 'Tree recursion mein, aap kaise tay karte ho ki helper ko kya return karna chahiye versus iske bahar kya jama hona chahiye? Diameter ko udaharan ki tarah istemal karo.',
        a: 'The decision comes from asking two separate questions. The first is: what does my parent need from me in order to do its own job? The second is: what is the problem actually asking for? When those two answers coincide, the helper simply returns the answer and there is nothing to accumulate. When they differ, the helper must return the first thing and record the second somewhere that survives the recursion, typically a variable in the enclosing scope. Diameter is the clean illustration. The diameter is the number of edges on the longest path between any two nodes, and that path may lie entirely inside one subtree, never touching the root. Consider what a node can compute: if it knows the depth of its left subtree and the depth of its right subtree, then the longest path that passes through this particular node is exactly the sum of those two depths. So each node can evaluate one candidate for the final answer. But that sum is not what its parent needs. The parent is trying to compute its own depth, and for that it needs each child to report a depth, which is one plus the larger of the child\'s two subtree depths. If the helper returned the path length instead, the parent would add one to a path length and treat it as a depth, and every level above would be wrong. So the helper returns the depth, and inside the same call, before returning, it updates an outer variable with the maximum of its current value and the left-plus-right sum. Because every node in the tree gets its turn to run that update, the outer variable ends up holding the maximum over all nodes, which is the diameter, even when the winning path is nowhere near the root. The same split appears in maximum path sum, count of good nodes, and longest univalue path.',
        aHi: 'Nirnay do alag sawaal poochne se aata hai. Pehla hai: mere parent ko mujhse kya chahiye taaki wo apna kaam kar sake? Doosra hai: problem asal mein kya maang rahi hai? Jab wo do jawaab milte hain, helper bas jawaab return karta hai aur jama karne ko kuch nahi. Jab wo alag hain, helper ko pehli cheez return karni chahiye aur doosri ko kahin record karna chahiye jo recursion se bacha rahe, aksar enclosing scope mein ek variable. Diameter saaf udaharan hai. Diameter kisi bhi do nodes ke beech sabse lambe path par edges ki tadaad hai, aur wo path poori tarah ek subtree ke andar ho sakta hai, kabhi root ko chhue bina. Socho ek node kya compute kar sakta hai: agar ye apne left subtree ki depth aur apne right subtree ki depth jaanta hai, toh sabse lamba path jo is khaas node se guzarta hai bilkul un do depths ka sum hai. Toh har node antim jawaab ke liye ek candidate evaluate kar sakta hai. Par wo sum wo nahi hai jo iske parent ko chahiye. Parent apni khud ki depth compute karne ki koshish kar raha hai, aur uske liye use har child se ek depth report chahiye, jo child ki do subtree depths mein se badi plus ek hai. Agar helper iske bajaye path length return karta, parent ek path length mein ek jodta aur ise ek depth ki tarah treat karta, aur upar har level galat hota. Toh helper depth return karta hai, aur usi call ke andar, return karne se pehle, ye ek outer variable ko apni current value aur left-plus-right sum ke maximum se update karta hai. Kyunki tree mein har node ko us update ko chalaane ki baari milti hai, outer variable sab nodes par maximum rakhkar khatam hota hai, jo diameter hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement isValidBSTBroken and isValidBST. Build the tree 10 -> (5, 15) with 15 -> (6, 20) and confirm the broken one returns true while the fixed one returns false. Then write the inorder-based validator and check all three agree on valid trees.',
        taskHi: 'isValidBSTBroken aur isValidBST implement karo. Tree 10 -> (5, 15) with 15 -> (6, 20) banao aur confirm karo toota wala true return karta hai jabki theek wala false. Phir inorder-based validator likho aur check karo teeno valid trees par sahmat hain.',
        hint: 'The inorder validator keeps a single `prev` variable: traverse left, then compare node.value with prev and update it, then traverse right. Any non-increase means invalid.',
        hintHi: 'Inorder validator ek akela `prev` variable rakhta hai: left traverse karo, phir node.value ko prev se compare karo aur ise update karo, phir right traverse karo. Koi bhi non-increase matlab invalid.',
      },
      {
        task: 'Implement diameter, isBalanced (one-pass with the -1 sentinel), and maxPathSum (the maximum sum of any node-to-node path). For each, write down separately what the helper returns and what it accumulates.',
        taskHi: 'diameter, isBalanced (–1 sentinel ke saath one-pass), aur maxPathSum (kisi bhi node-se-node path ka maximum sum) implement karo. Har ek ke liye alag se likho ki helper kya return karta hai aur kya jama karta hai.',
        hint: 'maxPathSum: the helper returns the best DOWNWARD path sum from this node (node.value + max(0, left, right)), and accumulates node.value + max(0,left) + max(0,right). The max(0, ...) drops negative branches.',
        hintHi: 'maxPathSum: helper is node se best NEECHE ka path sum return karta hai (node.value + max(0, left, right)), aur node.value + max(0,left) + max(0,right) jama karta hai. max(0, ...) negative branches drop karta hai.',
      },
      {
        task: 'Implement lca for a general binary tree and lcaBST for a BST. Test both on the same BST and confirm they agree; then test lca on a non-BST tree where lcaBST would give the wrong answer.',
        taskHi: 'Ek general binary tree ke liye lca aur ek BST ke liye lcaBST implement karo. Dono ko usi BST par test karo aur confirm karo wo sahmat hain; phir lca ko ek non-BST tree par test karo jahaan lcaBST galat jawaab deta.',
        hint: 'lcaBST relies on the ordering to choose a direction, so on a tree that is not a BST it walks the wrong way. lca makes no ordering assumption and works on any binary tree, at the cost of visiting every node.',
        hintHi: 'lcaBST direction chunne ke liye ordering par nirbhar karta hai, isliye ek aise tree par jo BST nahi hai ye galat taraf chalta hai. lca koi ordering assumption nahi karta aur kisi bhi binary tree par kaam karta hai, har node visit karne ki cost par.',
      },
    ],

    keyTakeaways: [
      'The BST property constrains a node against EVERY ancestor, not just its parent — validate by passing an allowed (min, max) window down the recursion, or by checking that an inorder traversal is strictly increasing.',
      'The dominant tree pattern: each node returns a small bundle summarising its whole subtree, and the parent combines the two bundles plus its own value in O(1). This is postorder (Module 7 lesson 1) put to work.',
      'Ask two questions: (1) what must I RETURN so my parent can do its job, and (2) is that the same as the problem\'s answer? If not, return the first and accumulate the second in an outer variable — that is diameter, max path sum, and friends.',
      'Information flows DOWN as arguments (an ancestor constraint, a running total) and UP as return values (height, size, sum, validity). Mixing the two directions is the usual bug.',
      'Never call a subtree-walking helper (like height) from inside a recursion over the same tree — that is O(n^2). Bundle everything the parent needs into one return value for a single O(n) pass.',
      'LCA in a general tree: return a found target upward; the node that receives a non-null result from BOTH sides is the answer. In a BST, walk down instead, using the ordering to pick a direction.',
    ],
    keyTakeawaysHi: [
      'BST property ek node ko HAR ancestor ke against constrain karti hai, sirf iske parent ke nahi — ek allowed (min, max) window recursion mein neeche pass karke validate karo, ya check karke ki ek inorder traversal sakhti se badhta hai.',
      'Prabhaavi tree pattern: har node ek chhota bundle return karta hai jo apne poore subtree ko summarise karta hai, aur parent do bundles plus apni value ko O(1) mein combine karta hai. Ye postorder (Module 7 lesson 1) kaam par lagaya gaya hai.',
      'Do sawaal poocho: (1) mujhe kya RETURN karna chahiye taaki mera parent apna kaam kar sake, aur (2) kya wo problem ke jawaab jaisa hai? Agar nahi, pehla return karo aur doosra ek outer variable mein jama karo — wo diameter, max path sum, aur saathi hain.',
      'Information NEECHE arguments ki tarah bahti hai (ek ancestor constraint, ek running total) aur UPAR return values ki tarah (height, size, sum, validity). Do directions milaana aam bug hai.',
      'Kabhi ek subtree-chalne waala helper (jaise height) usi tree par ek recursion ke andar se call mat karo — wo O(n^2) hai. Parent ko jo chahiye sab ek return value mein bundle karo ek akele O(n) pass ke liye.',
      'Ek general tree mein LCA: ek mila target upar return karo; wo node jo DONO sides se ek non-null result paata hai jawaab hai. Ek BST mein, iske bajaye neeche chalo, direction chunne ke liye ordering istemal karte hue.',
    ],
  },
];
