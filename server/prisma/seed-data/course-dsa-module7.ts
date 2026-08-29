/**
 * DSA Complete Course — Module 7: Trees, lesson 1.
 *
 * Binary trees and the three depth-first traversal orders. Directly
 * builds on two already-established facts from this course: Module 4's
 * linked-list lessons established a node as { value, next }, one-way
 * chain of exactly one link per node; this lesson introduces a binary
 * tree node as { value, left, right } — the SAME node-with-pointers
 * idea, but with two links instead of one, which is precisely what
 * allows branching instead of a single chain. Separately, Module 6's
 * recursion-ordering lesson already established that code placed
 * BEFORE a recursive call runs top-down (on the way down the call
 * stack) while code placed AFTER a recursive call runs bottom-up (on
 * the way back up) — this lesson applies that exact rule concretely:
 * preorder places the visit BEFORE both recursive calls, inorder
 * places it BETWEEN them, postorder places it AFTER both. Broken
 * example: using preorder traversal while expecting sorted output from
 * a binary search tree, not realizing the print statement's POSITION
 * relative to the two recursive calls is what determines the order,
 * exactly as Module 6 taught. Fixed by moving the visit to between the
 * two recursive calls (inorder), producing genuinely sorted output for
 * a BST-shaped tree.
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

export const DSA_MODULE_7: CourseLesson[] = [
  {
    slug: 'binary-trees-traversals',
    title: 'Binary Trees & Traversals: Preorder, Inorder, Postorder',
    titleHi: 'Binary Trees Aur Traversals: Preorder, Inorder, Postorder',
    description: 'This course\'s Module 4 built a linked-list node as { value, next } — a one-way chain with exactly one link per node. A binary tree node is { value, left, right } — the same node-with-pointers idea, but with two links, which is precisely what allows branching instead of a single chain.',
    descriptionHi: 'Is course ke Module 4 ne ek linked-list node ko { value, next } ki tarah banaaya — ek one-way chain jisme prati-node bilkul ek link hai. Ek binary tree node { value, left, right } hai — wahi node-with-pointers idea, par do links ke saath, jo bilkul wo hai jo ek akeli chain ke bajaye branching allow karta hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A family tree versus a single-file conga line.** This course\'s Module 4 linked list is a conga line — every person holds the shoulders of exactly the one person in front, forming a single, unbranching chain from front to back. A family tree is different: a specific person can have TWO children, and each of those children can themselves have two children of their own, and so on — the structure branches outward instead of continuing in a single line. A binary tree node is built exactly like this: instead of a linked-list node\'s single "next" pointer, it has a "left" pointer and a "right" pointer, each optionally leading to an entirely separate sub-tree of its own. Visiting every person in a conga line is trivial — start at the front and walk backward one link at a time, exactly as Module 4 already covered. Visiting every person in a family tree is genuinely more interesting: at any given person, there is a choice about WHEN to note that person down relative to visiting their two children — before visiting either child, after visiting the first child but before the second, or only after visiting both children. Each of these three choices produces a genuinely different, useful order — and this lesson\'s entire job is showing exactly how and why.',
      hi: '**Ek family tree versus ek single-file conga line.** Is course ka Module 4 wala linked list ek conga line hai — har vyakti bilkul us ek vyakti ke kandhe pakadta hai jo saamne hai, aage se peeche tak ek akeli, na-branching chain banaate hue. Ek family tree alag hai: ek khaas vyakti ke DO bachche ho sakte hain, aur un bachchon mein se har ek ke apne khud ke do bachche ho sakte hain, aur aise hi aage — structure ek akeli line mein aage badhne ke bajaye baahar branch hota hai. Ek binary tree node bilkul aise banaaya jaata hai: linked-list node ke akele "next" pointer ke bajaye, iska ek "left" pointer aur ek "right" pointer hai, har ek vaikalpik roop se apne khud ke ek poori tarah alag sub-tree ki taraf le jaate hue. Conga line mein har vyakti ko dekhna trivial hai — saamne se shuru karo aur ek baar mein ek link peeche chalo, bilkul jaisa Module 4 pehle hi cover kar chuka hai. Family tree mein har vyakti ko dekhna sach mein zyaada dilchasp hai: kisi bhi diye gaye vyakti par, ek chunaav hai ki us vyakti ko kab note karna hai unke do bachchon ko dekhne ke saapeksh — kisi bhi bachche ko dekhne se pehle, pehle bachche ko dekhne ke baad par doosre se pehle, ya sirf dono bachchon ko dekhne ke baad. In teen chunaavon mein se har ek ek sach mein alag, upyogi order banata hai — aur is lesson ka poora kaam bilkul kaise aur kyun darsaana hai.',
    },

    simple: `**The node shape, contrasted directly with Module 4's linked list:**

\`\`\`js
// This course's Module 4 linked-list node:
{ value: 5, next: someOtherNode }

// A binary tree node — same idea, TWO links instead of one:
{ value: 5, left: someNode, right: someOtherNode }
\`\`\`

Either \`left\` or \`right\` (or both) can be \`null\`, meaning "no child on that side" — exactly like a linked list's \`next\` being \`null\` meant "end of the chain," as Module 4 established.

**Start broken.** Suppose this specific tree, where every value in a node's left subtree is smaller than the node, and every value in its right subtree is larger (this shape is called a binary search tree, covered fully in this module's next lesson):

\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14
\`\`\`

A specific goal: print every value in fully sorted order. A broken first attempt, visiting the current node BEFORE recursing into its children:

\`\`\`js
function traverse(node, result = []) {
  if (node === null) return result; // base case, exactly as Module 6 taught
  result.push(node.value);   // visit happens BEFORE both recursive calls
  traverse(node.left, result);
  traverse(node.right, result);
  return result;
}
console.log(traverse(root)); // [8, 3, 1, 6, 10, 14] — NOT sorted
\`\`\`

This is genuinely not a bug in the sense of crashing or missing values — every value does appear exactly once. The actual problem is the ORDER, and this course's Module 6 lesson on recursion already established precisely why: code placed BEFORE a recursive call runs on the way DOWN the call stack, before either child has been explored at all. Visiting the current node first, before its children, is called **preorder** traversal — and it was never going to produce sorted output, because it records the root (\`8\`) before ever looking at the smaller values in its left subtree.

**The fix: move the visit to BETWEEN the two recursive calls**

\`\`\`js
function traverse(node, result = []) {
  if (node === null) return result;
  traverse(node.left, result);
  result.push(node.value);   // visit happens BETWEEN the two recursive calls
  traverse(node.right, result);
  return result;
}
console.log(traverse(root)); // [1, 3, 6, 8, 10, 14] — genuinely sorted
\`\`\`

\`\`\`ts
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function traverse(node: TreeNode | null, result: number[] = []): number[] {
  if (node === null) return result;
  traverse(node.left, result);
  result.push(node.value);
  traverse(node.right, result);
  return result;
}
\`\`\`

This ordering is called **inorder** traversal, and for this specific tree shape (a binary search tree), it always produces sorted output — because it fully explores everything smaller (the left subtree) before recording the current node, and only then explores everything larger (the right subtree). Nothing about the recursive calls themselves changed between the broken and fixed version — only the POSITION of \`result.push(node.value)\` relative to the two recursive calls changed, exactly the lever Module 6 already taught matters.`,

    simpleHi: `**Node ka shape, seedhe Module 4 ke linked list se contrast kiya gaya:**

\`\`\`js
// Is course ka Module 4 linked-list node:
{ value: 5, next: someOtherNode }

// Ek binary tree node — wahi idea, ek ke bajaye DO links:
{ value: 5, left: someNode, right: someOtherNode }
\`\`\`

\`left\` ya \`right\` (ya dono) \`null\` ho sakte hain, matlab "us taraf koi bachcha nahi" — bilkul jaisa ek linked list ka \`next\` \`null\` hona matlab tha "chain ka ant," jaisa Module 4 ne sthaapit kiya.

**Toote hue se shuru.** Maano ye khaas tree, jahaan ek node ke left subtree mein har value node se chhoti hai, aur iske right subtree mein har value badi hai (ye shape binary search tree kehlaata hai, is module ke agle lesson mein poori tarah cover kiya gaya):

\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14
\`\`\`

Ek khaas lakshya: har value ko poori tarah sorted order mein print karo. Ek toota pehla prayaas, current node ko iske bachchon mein recurse karne se PEHLE dekhte hue:

\`\`\`js
function traverse(node, result = []) {
  if (node === null) return result; // base case, bilkul jaisa Module 6 ne sikhaaya
  result.push(node.value);   // dekhna dono recursive calls se PEHLE hota hai
  traverse(node.left, result);
  traverse(node.right, result);
  return result;
}
console.log(traverse(root)); // [8, 3, 1, 6, 10, 14] — sorted NAHI hai
\`\`\`

Ye sach mein crash hone ya values missing hone ke sense mein bug nahi hai — har value bilkul ek baar dikhti hai. Asli problem ORDER hai, aur is course ke Module 6 lesson ne recursion par pehle hi bilkul darsaaya kyun: ek recursive call se PEHLE rakha gaya code call stack mein NEECHE ki taraf chalte hue chalta hai, kisi bhi bachche ko explore kiye jaane se pehle. Current node ko pehle dekhna, iske bachchon se pehle, **preorder** traversal kehlaata hai — aur ye kabhi sorted output banaane wala nahi tha, kyunki ye root (\`8\`) ko record karta hai iske left subtree ki chhoti values ko kabhi dekhne se pehle.

**Fix: dekhne ko do recursive calls ke BEECH move karo**

\`\`\`js
function traverse(node, result = []) {
  if (node === null) return result;
  traverse(node.left, result);
  result.push(node.value);   // dekhna do recursive calls ke BEECH hota hai
  traverse(node.right, result);
  return result;
}
console.log(traverse(root)); // [1, 3, 6, 8, 10, 14] — sach mein sorted
\`\`\`

\`\`\`ts
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function traverse(node: TreeNode | null, result: number[] = []): number[] {
  if (node === null) return result;
  traverse(node.left, result);
  result.push(node.value);
  traverse(node.right, result);
  return result;
}
\`\`\`

Ye ordering **inorder** traversal kehlaati hai, aur is khaas tree shape (ek binary search tree) ke liye, ye hamesha sorted output banaati hai — kyunki ye current node ko record karne se pehle har chhoti cheez (left subtree) ko poori tarah explore karti hai, aur sirf tab har badi cheez (right subtree) ko explore karti hai. Toote aur theek version ke beech recursive calls ke baare mein khud kuch nahi badla — sirf \`result.push(node.value)\` ki POSITION do recursive calls ke saapeksh badli, bilkul wo lever jo Module 6 pehle hi sikha chuka hai matter karta hai.`,

    content: `## The third order: postorder, and why it exists

\`\`\`js
function postorder(node, result = []) {
  if (node === null) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.value);   // visit happens AFTER both recursive calls
  return result;
}
console.log(postorder(root)); // [1, 6, 3, 14, 10, 8]
\`\`\`

Postorder places the visit AFTER both recursive calls — exactly the "runs on the way back up" position this course's Module 6 lesson demonstrated with call-stack unwinding. The concrete usefulness of visiting AFTER both children rather than before or between them: a node's own children are always fully processed before the node itself is. This matters directly for any computation where a node genuinely depends on results already computed for its children — computing each node's subtree size, computing tree height, or safely deleting an entire tree node-by-node (deleting a node's children before the node itself, rather than deleting a parent while its children still hold references to it).

\`\`\`js
function subtreeSize(node) {
  if (node === null) return 0;
  const leftSize = subtreeSize(node.left);   // fully computed first
  const rightSize = subtreeSize(node.right); // fully computed first
  return leftSize + rightSize + 1;           // combining happens AFTER — postorder in spirit
}
\`\`\`

This \`subtreeSize\` function does not literally push to a \`result\` array, but its shape is genuinely postorder: both recursive calls are made, and only AFTER both have fully returned does the function do anything with their results (adding them together). Preorder or inorder placement would not work here at all — the sizes of the left and right subtrees must be known BEFORE they can be added together, which is only possible once both recursive calls have already returned.

## Summarizing all three orders side by side, for the same tree

\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14

Preorder  (visit BEFORE both calls):   8, 3, 1, 6, 10, 14
Inorder   (visit BETWEEN the calls):   1, 3, 6, 8, 10, 14   ← sorted, for a BST
Postorder (visit AFTER both calls):    1, 6, 3, 14, 10, 8
\`\`\`

All three traversals visit the exact same six nodes, using the exact same two recursive calls in the exact same order (\`left\` then \`right\`) — the ONLY thing that ever changes between them is the position of one line, the "visit" step, relative to those two calls. This is a direct, concrete continuation of this course's Module 6 lesson on recursion ordering: that lesson taught the general rule using a simple two-line example; this lesson applies the identical rule to a genuinely useful, widely-tested data structure operation.

## Why the null check must come first, not the pointer access

\`\`\`js
function traverse(node, result = []) {
  console.log(node.value);        // BROKEN if node is null — crashes immediately
  if (node === null) return result;
  ...
}
\`\`\`

Every one of the three traversal functions above checks \`if (node === null) return result;\` as its very first line, before touching \`node.value\`, \`node.left\`, or \`node.right\` in any way. This is the same base-case discipline this course's Module 6 lesson insisted on for every recursive function: a recursive call on a tree eventually reaches a node whose \`left\` or \`right\` (or both) is \`null\` — meaning "no child here" — and attempting to read \`.value\` off of \`null\` throws immediately, rather than producing a wrong-but-harmless answer. The null check is not incidental cleanup; it is the base case that stops the recursion, exactly as Module 6 required for every recursive function to terminate correctly.`,

    contentHi: `## Teesra order: postorder, aur ye kyun maujood hai

\`\`\`js
function postorder(node, result = []) {
  if (node === null) return result;
  postorder(node.left, result);
  postorder(node.right, result);
  result.push(node.value);   // dekhna dono recursive calls ke BAAD hota hai
  return result;
}
console.log(postorder(root)); // [1, 6, 3, 14, 10, 8]
\`\`\`

Postorder dekhne ko dono recursive calls ke BAAD rakhta hai — bilkul wo "wapas upar jaate waqt chalta hai" position jo is course ke Module 6 lesson ne call-stack unwinding ke saath darsaaya. Dono bachchon ko dekhne ke baad ka thos upyogitaa, pehle ya beech mein ke bajaye: ek node ke khud ke bachche hamesha node khud se pehle poori tarah process kiye jaate hain. Ye seedhe kisi bhi computation ke liye matter karta hai jahaan ek node sach mein iske bachchon ke liye pehle se gani gayi nateejon par nirbhar karta hai — har node ki subtree size ganna, tree height ganna, ya poori tree ko node-by-node surakshit roop se delete karna (ek node ke bachchon ko node khud se pehle delete karna, ek parent ko delete karne ke bajaye jabki iske bachche abhi bhi ise reference karte hain).

\`\`\`js
function subtreeSize(node) {
  if (node === null) return 0;
  const leftSize = subtreeSize(node.left);   // pehle poori tarah gani gayi
  const rightSize = subtreeSize(node.right); // pehle poori tarah gani gayi
  return leftSize + rightSize + 1;           // jodna BAAD mein hota hai — spirit mein postorder
}
\`\`\`

Ye \`subtreeSize\` function literally \`result\` array mein push nahi karta, par iska shape sach mein postorder hai: dono recursive calls ki jaati hain, aur sirf jab dono poori tarah return ho chuke hain tab function unke nateejon ke saath kuch karta hai (unhe jodna). Preorder ya inorder placement yahaan bilkul kaam nahi karti — left aur right subtrees ki sizes jodne se PEHLE pata honi chahiye, jo sirf tab mumkin hai jab dono recursive calls pehle se return ho chuki hain.

## Teeno orders ko ek saath sankshep mein, usi tree ke liye

\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14

Preorder  (dono calls se PEHLE dekhna):  8, 3, 1, 6, 10, 14
Inorder   (calls ke BEECH dekhna):       1, 3, 6, 8, 10, 14   ← sorted, ek BST ke liye
Postorder (dono calls ke BAAD dekhna):   1, 6, 3, 14, 10, 8
\`\`\`

Teeno traversals bilkul wahi chhe nodes dekhte hain, bilkul wahi do recursive calls bilkul usi order mein istemal karte hue (\`left\` phir \`right\`) — sirf CHEEZ jo kabhi inke beech badalti hai ek line ki position hai, "dekhna" step, un do calls ke saapeksh. Ye is course ke Module 6 lesson ke recursion ordering par ek seedha, thos jaari rakhna hai: us lesson ne general rule ko ek saadhaaran do-line example istemal karke sikhaaya; ye lesson usi rule ko ek sach mein upyogi, vyaapak roop se test ki jaane waali data structure operation par lagu karta hai.

## Null check pointer access se pehle kyun aana chahiye

\`\`\`js
function traverse(node, result = []) {
  console.log(node.value);        // TOOTA agar node null hai — turant crash hota hai
  if (node === null) return result;
  ...
}
\`\`\`

Upar ke teeno traversal functions mein se har ek \`if (node === null) return result;\` ko apni bilkul pehli line ki tarah check karta hai, \`node.value\`, \`node.left\`, ya \`node.right\` ko kisi bhi tarah chhoone se pehle. Ye wahi base-case discipline hai jise is course ka Module 6 lesson har recursive function ke liye zor deta tha: ek tree par ek recursive call aakhirkaar ek aise node tak pahunchti hai jiska \`left\` ya \`right\` (ya dono) \`null\` hai — matlab "yahaan koi bachcha nahi" — aur \`null\` par se \`.value\` padhne ki koshish turant throw karti hai, ek galat-lekin-harmless jawaab banaane ke bajaye. Null check koi aakasmik safaai nahi hai; ye base case hai jo recursion ko rokta hai, bilkul jaisa Module 6 ne har recursive function ke sahi tarike se khatam hone ke liye zaruri kiya.`,

    examples: [
      {
        title: 'Broken: preorder traversal used while expecting sorted output',
        titleHi: 'Toota: preorder traversal jabki sorted output ki ummeed ki gayi',
        code: `result.push(node.value);
traverse(node.left, result);
traverse(node.right, result);`,
        codeJs: `function preorder(node, result = []) {
  if (node === null) return result;
  result.push(node.value);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}
console.log(preorder(root)); // [8, 3, 1, 6, 10, 14] — not sorted`,
        codeTs: `interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
function preorder(node: TreeNode | null, result: number[] = []): number[] {
  if (node === null) return result;
  result.push(node.value);
  preorder(node.left, result);
  preorder(node.right, result);
  return result;
}`,
        output: `[8, 3, 1, 6, 10, 14] — every value appears once, but the order is
not sorted, because the root is recorded before its smaller
left-subtree values.`,
        explain: 'Visiting the node before either recursive call records it before its left subtree (which holds all smaller values) has been explored at all.',
        explainHi: 'Kisi bhi recursive call se pehle node ko dekhna ise iske left subtree (jo sab chhoti values rakhta hai) explore kiye jaane se pehle hi record karta hai.',
      },
      {
        title: 'Fixed: inorder traversal, visiting between the two recursive calls',
        titleHi: 'Theek: inorder traversal, do recursive calls ke beech dekhte hue',
        code: `traverse(node.left, result);
result.push(node.value);
traverse(node.right, result);`,
        codeJs: `function inorder(node, result = []) {
  if (node === null) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}
console.log(inorder(root)); // [1, 3, 6, 8, 10, 14] — sorted`,
        codeTs: `function inorder(node: TreeNode | null, result: number[] = []): number[] {
  if (node === null) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}`,
        outputJs: `[1, 3, 6, 8, 10, 14] — genuinely sorted, because the entire
smaller left subtree is fully recorded before the current node,
and the entire larger right subtree only after.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'For a binary search tree specifically, inorder traversal always produces sorted output, because every left-subtree value is smaller and every right-subtree value is larger than the current node.',
        explainHi: 'Ek binary search tree ke liye khaas taur par, inorder traversal hamesha sorted output banaata hai, kyunki har left-subtree value chhoti hai aur har right-subtree value current node se badi hai.',
      },
      {
        title: 'Postorder used for a genuine dependency: computing subtree size',
        titleHi: 'Postorder ek asli dependency ke liye istemal: subtree size ganna',
        code: `const leftSize = subtreeSize(node.left);
const rightSize = subtreeSize(node.right);
return leftSize + rightSize + 1;`,
        codeJs: `function subtreeSize(node) {
  if (node === null) return 0;
  const leftSize = subtreeSize(node.left);
  const rightSize = subtreeSize(node.right);
  return leftSize + rightSize + 1;
}
console.log(subtreeSize(root)); // 6`,
        codeTs: `function subtreeSize(node: TreeNode | null): number {
  if (node === null) return 0;
  const leftSize = subtreeSize(node.left);
  const rightSize = subtreeSize(node.right);
  return leftSize + rightSize + 1;
}`,
        outputJs: `6 — the two children's sizes must both be known before they can
be added together, which is only possible after both recursive
calls have returned.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A node genuinely cannot know its own subtree size until both of its children\'s sizes are known — the combining step must happen after both recursive calls, which is the postorder position.',
        explainHi: 'Ek node sach mein apni subtree size nahi jaan sakta jab tak dono bachchon ki sizes nahi jaani jaatin — jodne ka step dono recursive calls ke baad hona chahiye, jo postorder position hai.',
      },
    ],

    mistakes: [
      {
        wrong: `result.push(node.value); // preorder
// ...but the goal was sorted output`,
        right: `traverse(node.left, result);
result.push(node.value); // inorder — sorted, for a BST
traverse(node.right, result);`,
        why: 'The visit\'s position relative to the two recursive calls is the only thing that determines traversal order — preorder never produces sorted output for a BST, regardless of anything else in the function.',
        whyHi: 'Do recursive calls ke saapeksh dekhne ki position hi sirf cheez hai jo traversal order determine karti hai — preorder kabhi ek BST ke liye sorted output nahi banaata, function mein kuch aur bhale hi ho.',
      },
      {
        wrong: `function traverse(node, result = []) {
  console.log(node.value); // crashes when node is null
  if (node === null) return result;
  ...
}`,
        right: `function traverse(node, result = []) {
  if (node === null) return result; // base case FIRST
  console.log(node.value);
  ...
}`,
        why: 'The null check must be the very first line — reading .value off a null node throws immediately, and every recursive tree traversal eventually reaches a null child.',
        whyHi: 'Null check bilkul pehli line honi chahiye — ek null node se .value padhna turant throw karta hai, aur har recursive tree traversal aakhirkaar ek null bachche tak pahunchti hai.',
      },
      {
        wrong: `function subtreeSize(node) {
  if (node === null) return 0;
  return subtreeSize(node.left) + node.value + subtreeSize(node.right);
  // treats node.value as a size — conflates two different things
}`,
        right: `function subtreeSize(node) {
  if (node === null) return 0;
  return subtreeSize(node.left) + subtreeSize(node.right) + 1;
  // the "+1" counts the current node itself, not its stored value
}`,
        why: 'Computing a structural property like size means counting nodes, not summing stored values — the "+1" represents "this node counts as one node," which is unrelated to whatever value it happens to hold.',
        whyHi: 'Size jaisi ek structural property ganna matlab hai nodes ganna, stored values ka jod nahi — "+1" darsata hai "ye node ek node ki tarah ginta hai," jo iske paas jo bhi value hai usse asambandhit hai.',
      },
    ],

    realWorld: [
      {
        en: '**Inorder traversal of a binary search tree producing sorted output is one of the single most commonly tested facts about trees in real technical interviews.**',
        hi: '**Binary search tree ka inorder traversal sorted output banana asli technical interviews mein trees ke baare mein sabse aam test kiye jaane waale tathyon mein se ek hai.**',
      },
      {
        en: '**Postorder traversal is the standard, correct way real systems safely tear down tree-shaped structures (like a DOM tree or a file directory tree) — children are always removed before their parent.**',
        hi: '**Postorder traversal asli systems dwara tree-shaped structures (jaise ek DOM tree ya ek file directory tree) ko surakshit roop se giraane ka standard, sahi tarika hai — bachche hamesha unke parent se pehle hataaye jaate hain.**',
      },
      {
        en: '**Real compilers use preorder-like traversal to print or serialize an abstract syntax tree in a form that can later be parsed back in the same top-down order it was written.**',
        hi: '**Asli compilers ek abstract syntax tree ko print ya serialize karne ke liye preorder-jaisa traversal istemal karte hain ek aise form mein jise baad mein usi top-down order mein wapas parse kiya jaa sake jisme ye likha gaya tha.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does inorder traversal specifically produce sorted output for a binary search tree, while preorder and postorder do not, even though all three visit the exact same nodes?',
        qHi: 'Inorder traversal khaas taur par ek binary search tree ke liye sorted output kyun banaata hai, jabki preorder aur postorder nahi, chahe teeno bilkul wahi nodes dekhte hon?',
        a: 'A binary search tree is defined by a specific invariant, covered in this module\'s next lesson: for any given node, every value in its left subtree is smaller than that node\'s value, and every value in its right subtree is larger. Inorder traversal visits nodes in exactly the order left-subtree, then current-node, then right-subtree, applied recursively at every level of the tree. Because of the BST invariant, this means inorder traversal always fully records every smaller value (recursively exploring the entire left subtree, which is itself organized the same way) before recording the current node, and only records every larger value (the entire right subtree) after. Applied consistently at every single node in the tree, this guarantees the final recorded sequence is fully sorted from smallest to largest. Preorder records the current node BEFORE exploring either subtree, meaning it records values in an order determined by the tree\'s shape rather than by magnitude — a node is recorded as soon as it is reached, regardless of how many smaller values still remain unvisited in its own left subtree. Postorder is similarly shape-determined, recording a node only after BOTH of its subtrees are fully explored, meaning larger values in the right subtree can be recorded before the current, potentially smaller, node itself. Only the specific left-then-current-then-right ordering of inorder traversal happens to align with the BST invariant\'s smaller-current-larger structure at every level simultaneously — this is a property of the traversal order matching the specific invariant of this specific data structure, not a general property of tree traversal itself; inorder traversal on a tree that does NOT maintain the BST invariant produces no such sorted guarantee at all.',
        aHi: 'Ek binary search tree ek khaas invariant se define hoti hai, is module ke agle lesson mein cover kiya gaya: kisi bhi diye gaye node ke liye, iske left subtree mein har value us node ki value se chhoti hai, aur iske right subtree mein har value badi hai. Inorder traversal nodes ko bilkul left-subtree, phir current-node, phir right-subtree ke order mein dekhta hai, tree ke har level par recursively lagu kiya gaya. BST invariant ki wajah se, iska matlab hai inorder traversal hamesha har chhoti value ko poori tarah record karta hai (poore left subtree ko recursively explore karte hue, jo khud usi tarah organize hai) current node ko record karne se pehle, aur sirf har badi value (poora right subtree) ko baad mein record karta hai. Tree ke har akele node par consistently lagu kiya gaya, ye guarantee karta hai ki final record ki gayi sequence chhote se bade tak poori tarah sorted hai. Preorder current node ko kisi bhi subtree ko explore karne se PEHLE record karta hai, matlab ye values ko ek aise order mein record karta hai jo magnitude ke bajaye tree ke shape se determine hota hai — ek node record ki jaati hai jaise hi ye pahunchi jaati hai, chahe iske apne left subtree mein kitni bhi chhoti values abhi bhi na-dekhi bachi hon. Postorder samaan roop se shape-determined hai, ek node ko sirf tab record karte hue jab DONO iske subtrees poori tarah explore ho chuke hain, matlab right subtree mein badi values current, sambhaavit roop se chhoti, node khud se pehle record ki jaa sakti hain. Sirf inorder traversal ka khaas left-phir-current-phir-right ordering samyog se BST invariant ki chhoti-current-badi structure ke saath har level par ek saath align hota hai — ye traversal order ki ek property hai jo is khaas data structure ki khaas invariant se mel khaati hai, tree traversal khud ki ek general property nahi; ek aisi tree par inorder traversal jo BST invariant maintain NAHI karti koi aisi sorted guarantee bilkul nahi banaati.',
      },
      {
        q: 'Why must the null check be the very first line of every recursive tree function, and what specifically happens if it is placed after code that touches the node?',
        qHi: 'Null check har recursive tree function ki bilkul pehli line kyun honi chahiye, aur khaas taur par kya hota hai agar ise us code ke baad rakha jaaye jo node ko chhuta hai?',
        a: 'A recursive tree traversal works by calling itself on a node\'s left and right children, and this repeats at every level of the tree until it reaches a node that has no child on a given side — represented, in every example in this lesson, by that child being null. This null value is not an edge case that happens rarely; it is the GUARANTEED, unavoidable terminal state that every single recursive branch of a tree traversal eventually reaches, since every finite tree has leaves, and a leaf\'s children are null. The null check\'s job is to detect this terminal state and return immediately, without attempting to read any property off of the null value or make any further recursive calls on it — this is precisely the base case this course\'s Module 6 lesson insisted every recursive function must have, framed here in the concrete context of trees. If any code that reads a property off the node (such as node.value, node.left, or node.right) is placed BEFORE the null check, that code will genuinely execute on the actual null value every single time the recursion reaches a missing child — which happens for essentially every leaf node in the tree, not as some rare or theoretical possibility. Attempting to read a property off of null throws a runtime error immediately (a TypeError in JavaScript, reading a property of null), which crashes the entire traversal the very first time it reaches any leaf\'s missing child, meaning in practice the function fails on nearly every real tree with more than a single node, rather than continuing to work correctly for larger, more elaborate inputs and only failing in some rare, hard-to-reach scenario.',
        aHi: 'Ek recursive tree traversal khud ko ek node ke left aur right bachchon par bulaakar kaam karta hai, aur ye tree ke har level par dohraata hai jab tak ye ek aise node tak nahi pahunchta jiska ek diye gaye taraf koi bachcha nahi hai — is lesson ke har example mein, wo bachcha null hone se darsaaya gaya. Ye null value ek edge case nahi hai jo kabhi-kabhaar hoti hai; ye wo GUARANTEED, avoidable terminal state hai jise ek tree traversal ki har akeli recursive branch aakhirkaar pahunchti hai, kyunki har finite tree ke leaves hote hain, aur ek leaf ke bachche null hote hain. Null check ka kaam is terminal state ko pehchaanna aur turant return karna hai, null value se koi property padhne ki koshish kiye bina ya ispar koi aur recursive calls kiye bina — ye bilkul wo base case hai jise is course ke Module 6 lesson ne zor diya har recursive function ke paas hona chahiye, yahaan trees ke thos context mein framed. Agar koi bhi code jo node se ek property padhta hai (jaise \`node.value\`, \`node.left\`, ya \`node.right\`) null check se PEHLE rakha jaata hai, wo code sach mein asli null value par execute hoga har akeli baar jab recursion ek gayab bachche tak pahunchti hai — jo lagbhag tree ke har leaf node ke liye hota hai, kisi durlabh ya theoretical sambhaavna ki tarah nahi. Null se ek property padhne ki koshish turant ek runtime error throw karti hai (JavaScript mein ek \`TypeError\`, null ki ek property padhte hue), jo poori traversal ko bilkul pehli baar crash karta hai jab ye kisi bhi leaf ka gayab bachcha tak pahunchti hai, matlab practice mein function lagbhag har asli tree par ek se zyaada node ke saath fail hota hai, badi, zyaada vistrit inputs ke liye sahi tarike se kaam karte rehne aur sirf kisi durlabh, mushkil-se-pahunchne-waali scenario mein fail hone ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the example tree from this lesson (root 8, left subtree 3/1/6, right subtree 10/14). Implement all three traversals (preorder, inorder, postorder) and confirm your output for each matches this lesson\'s traced results exactly.',
        taskHi: 'Is lesson ka example tree banao (root 8, left subtree 3/1/6, right subtree 10/14). Teeno traversals (preorder, inorder, postorder) implement karo aur confirm karo ki har ek ke liye tumhaara output is lesson ke trace kiye gaye nateejon se bilkul mel khaata hai.',
        hint: 'Write one traversal function and change only the position of the "visit" line relative to the two recursive calls to get each of the three orders.',
        hintHi: 'Ek traversal function likho aur sirf "dekhna" line ki position badlo do recursive calls ke saapeksh teeno orders paane ke liye.',
      },
      {
        task: 'Write a treeHeight function using postorder-style logic (compute both children\'s heights first, then combine) that returns the height of a tree (a single node has height 1; an empty tree has height 0).',
        taskHi: 'Ek \`treeHeight\` function likho postorder-style logic istemal karke (pehle dono bachchon ki heights ganna, phir combine karna) jo ek tree ki height return karta hai (ek akela node ki height 1 hai; ek khaali tree ki height 0 hai).',
        hint: 'The height of a node is 1 plus the LARGER of its two children\'s heights, not the sum — this differs from subtreeSize\'s "+1" combining step.',
        hintHi: 'Ek node ki height iske do bachchon ki heights mein se BADI wali plus 1 hai, jod nahi — ye \`subtreeSize\` ke "+1" combining step se alag hai.',
      },
      {
        task: 'Deliberately move the null check to AFTER a line that reads node.value in one of your traversal functions, run it on the example tree, and observe the exact error produced. Then move the check back to confirm the fix.',
        taskHi: 'Jaan-boojhkar null check ko us line ke BAAD move karo jo tumhaare traversal functions mein se ek mein \`node.value\` padhti hai, ise example tree par chalao, aur banaayi gayi bilkul theek error observe karo. Phir fix confirm karne ke liye check ko wapas move karo.',
        hint: 'The error should occur on the very first leaf node the traversal reaches, not on some later, harder-to-predict input.',
        hintHi: 'Error traversal ke pahunchne waale bilkul pehle leaf node par hona chahiye, kisi baad ke, predict karne mein mushkil input par nahi.',
      },
    ],

    keyTakeaways: [
      'A binary tree node is { value, left, right } — the same node-with-pointers idea as this course\'s Module 4 linked list, but with two links instead of one, which is what allows branching.',
      'The three traversal orders (preorder, inorder, postorder) differ only in the POSITION of the "visit" step relative to the two recursive calls — the recursive calls themselves are identical across all three.',
      'This is a direct, concrete application of this course\'s Module 6 lesson on recursion ordering: code before a recursive call runs on the way down; code after runs on the way back up.',
      'Inorder traversal produces sorted output specifically for a binary search tree, because it fully explores everything smaller before recording the current node, and everything larger only after.',
      'Postorder traversal is required whenever a node\'s own computation genuinely depends on results already computed for both of its children, such as computing subtree size or height.',
      'The null check must be the very first line of any recursive tree function — every recursive traversal eventually reaches a missing child, and reading a property off null throws immediately.',
    ],
    keyTakeawaysHi: [
      'Ek binary tree node { value, left, right } hai — wahi node-with-pointers idea jo is course ke Module 4 linked list mein hai, par ek ke bajaye do links ke saath, jo branching allow karta hai.',
      'Teen traversal orders (preorder, inorder, postorder) sirf "dekhna" step ki POSITION mein alag hote hain do recursive calls ke saapeksh — recursive calls khud teeno mein identical hain.',
      'Ye is course ke Module 6 lesson ka recursion ordering par ek seedha, thos application hai: ek recursive call se pehle ka code neeche jaate waqt chalta hai; baad ka code wapas upar jaate waqt chalta hai.',
      'Inorder traversal khaas taur par ek binary search tree ke liye sorted output banaata hai, kyunki ye current node ko record karne se pehle har chhoti cheez ko poori tarah explore karta hai, aur har badi cheez sirf baad mein.',
      'Postorder traversal zaruri hai jab bhi ek node ka apna computation sach mein iske dono bachchon ke liye pehle se gani gayi nateejon par nirbhar karta hai, jaise subtree size ya height ganna.',
      'Null check kisi bhi recursive tree function ki bilkul pehli line honi chahiye — har recursive traversal aakhirkaar ek gayab bachche tak pahunchti hai, aur null se ek property padhna turant throw karta hai.',
    ],
  },
];
