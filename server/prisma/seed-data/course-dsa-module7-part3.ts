/**
 * DSA Complete Course — Module 7: Trees, lesson 3.
 *
 * Binary Search Trees: the ordering invariant (left < node < right)
 * and how it makes search, insert, and delete all O(height) instead
 * of the O(n) this course's Module 2 established for scanning an
 * unsorted array, or the O(1) average this course's Module 3
 * established for a hash map. Directly reuses this module's lesson 1
 * inorder-traversal fact (inorder on a BST yields sorted output) to
 * explain search: at every node, the invariant tells you which single
 * subtree could possibly contain the target, so the other subtree is
 * skipped entirely. Broken example: searching a BST by checking BOTH
 * children at every node (treating it like a generic binary tree, as
 * lesson 1 of this module did), missing the entire point of the BST
 * invariant. Fixed by using the invariant to eliminate one subtree
 * entirely at every step, matching binary search's halving behavior.
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

export const DSA_MODULE_7_PART3: CourseLesson[] = [
  {
    slug: 'binary-search-trees',
    title: 'Binary Search Trees: Ordered Data With Fast Search',
    titleHi: 'Binary Search Trees: Fast Search Ke Saath Ordered Data',
    description: 'This module\'s previous lesson showed inorder traversal producing sorted output specifically for a binary search tree — this lesson explains WHY that works: every node enforces left-subtree-smaller, right-subtree-larger, and that same invariant is what makes search, insert, and delete all skip half the remaining tree at every step.',
    descriptionHi: 'Is module ke pichhle lesson ne darsaaya ki inorder traversal khaas taur par ek binary search tree ke liye sorted output banaata hai — ye lesson samjhaata hai ki ye KYUN kaam karta hai: har node left-subtree-chhoti, right-subtree-badi lagu karta hai, aur wahi invariant hai jo search, insert, aur delete ko har step par baaki bachi tree ka aadha hissa skip karne deta hai.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 3,

    analogy: {
      en: '**A library where every shelf enforces its own strict sorting rule, versus a pile of books thrown on the floor.** This course\'s Module 2 lesson on scanning an unsorted array is the pile of books: to find one specific title, there is genuinely no shortcut but to check book after book, potentially the entire pile, since nothing about the pile\'s arrangement carries any information about where a given title might be. A binary search tree is the strictly organized library shelf: standing in front of any single shelf, a librarian who knows this specific title comes alphabetically after everything currently visible on the LEFT of where they are standing can immediately ignore that entire left side and only search to the right — and this same rule applies again, recursively, at every single shelf-section the librarian steps into next. This is not a vague intuition; it is the exact same halving idea this course\'s Module 2 lesson introduced for binary search on a sorted array, except now the "sorted array" is not a flat line but a branching tree shape, and the single comparison at each node (smaller, go left; larger, go right) is what plays the role binary search\'s midpoint comparison played on the array.',
      hi: '**Ek library jahaan har shelf apna khud ka sakht sorting rule lagu karti hai, versus zameen par phenki gayi kitaabon ka dher.** Is course ke Module 2 lesson ka ek unsorted array ko scan karna kitaabon ka dher hai: ek khaas title dhoondhne ke liye, sach mein kitaab ke baad kitaab check karne ke alaava koi shortcut nahi hai, sambhaavit roop se poora dher, kyunki dher ki arrangement ke baare mein kuch bhi is baare mein koi jaankaari nahi rakhta ki ek diya gaya title kahaan ho sakta hai. Ek binary search tree wo sakhti se organize ki gayi library shelf hai: kisi bhi akeli shelf ke saamne khada, ek librarian jo jaanta hai ye khaas title alphabetically har us cheez ke baad aata hai jo abhi jahaan wo khada hai uske LEFT mein drishyaman hai turant us poori left side ko ignore kar sakta hai aur sirf right taraf search kar sakta hai — aur ye wahi rule dobara lagu hota hai, recursively, har akele shelf-section par jisme librarian agla kadam rakhta hai. Ye koi dhundhla intuition nahi hai; ye bilkul wahi halving idea hai jo is course ke Module 2 lesson ne ek sorted array par binary search ke liye introduce kiya, sirf ab "sorted array" ek flat line nahi hai balki ek branching tree shape hai, aur har node par ek akeli comparison (chhoti, left jaao; badi, right jaao) wo role play karti hai jo binary search ka midpoint comparison array par play karta tha.',
    },

    simple: `**The invariant, stated precisely, at every single node:**

\`\`\`
For any node N:
  every value in N.left's entire subtree  is SMALLER than N.value
  every value in N.right's entire subtree is LARGER  than N.value
\`\`\`

This module's previous lesson used exactly this tree and showed inorder traversal producing sorted output — this lesson explains the mechanism that makes that true, and reuses it for search:

\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14
\`\`\`

**Start broken.** Searching for \`6\` by treating the tree as a plain binary tree (checking BOTH children at every node, as this module's first lesson did for generic trees):

\`\`\`js
function findBroken(node, target) {
  if (node === null) return false;
  if (node.value === target) return true;
  return findBroken(node.left, target) || findBroken(node.right, target); // checks BOTH sides
}
\`\`\`

This genuinely finds \`6\` eventually, and it is not wrong in the sense of returning an incorrect answer — but it is wasteful: it explores both the \`left\` and \`right\` subtree of every node it visits, exactly the way this module's first lesson correctly handled a GENERIC binary tree, where nothing about a node's value indicates which side a target might be on. But this tree is not generic — it is a binary search tree, and the invariant above means one specific side can be eliminated entirely at every single node, without ever searching it.

**The fix: use the invariant to pick exactly one side**

\`\`\`js
function findBST(node, target) {
  if (node === null) return false;
  if (node.value === target) return true;
  if (target < node.value) return findBST(node.left, target);  // ONLY left — right is guaranteed too large
  return findBST(node.right, target);                          // ONLY right — left is guaranteed too small
}
console.log(findBST(root, 6)); // true — reached via 8 -> 3 -> 6, never touching 10 or 14 at all
\`\`\`

\`\`\`ts
interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function findBST(node: BSTNode | null, target: number): boolean {
  if (node === null) return false;
  if (node.value === target) return true;
  if (target < node.value) return findBST(node.left, target);
  return findBST(node.right, target);
}
\`\`\`

Searching for \`6\` starting at the root (\`8\`): since \`6 < 8\`, the ENTIRE right subtree (\`10\` and \`14\`) is skipped without ever being visited, because the invariant guarantees everything on the right is larger than \`8\`, and therefore also larger than \`6\`. Moving to \`3\`: since \`6 > 3\`, the entire left side of \`3\` (just \`1\`) is skipped, since it is guaranteed smaller than \`3\`, and therefore smaller than \`6\`. Moving to \`6\`: found. Exactly one comparison per level of the tree, and exactly one subtree discarded entirely at each of those comparisons — this is the same halving behavior this course's Module 2 lesson on binary search established, now happening via tree structure instead of index arithmetic on a flat array.`,

    simpleHi: `**Invariant, thik-thik roop se batayi gayi, har akele node par:**

\`\`\`
Kisi bhi node N ke liye:
  N.left ke poore subtree mein har value N.value se CHHOTI hai
  N.right ke poore subtree mein har value N.value se BADI hai
\`\`\`

Is module ka pichhla lesson bilkul isi tree ka istemal karta tha aur inorder traversal ko sorted output banaate hue darsaata tha — ye lesson us mechanism ko samjhaata hai jo isse sach banaata hai, aur ise search ke liye dobara istemal karta hai:

\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14
\`\`\`

**Toote hue se shuru.** \`6\` dhoondhna tree ko ek saadhaaran binary tree ki tarah treat karke (har node par DONO bachche check karte hue, jaisa is module ka pehla lesson generic trees ke liye karta tha):

\`\`\`js
function findBroken(node, target) {
  if (node === null) return false;
  if (node.value === target) return true;
  return findBroken(node.left, target) || findBroken(node.right, target); // DONO sides check karta hai
}
\`\`\`

Ye sach mein aakhirkaar \`6\` dhoondhta hai, aur ye galat jawaab return karne ke sense mein galat nahi hai — par ye faaltu hai: ye har node ke jo ye dekhta hai \`left\` aur \`right\` subtree dono explore karta hai, bilkul jaisa is module ka pehla lesson ek GENERIC binary tree ke liye sahi tarike se handle karta tha, jahaan ek node ki value ke baare mein kuch bhi ye nahi darsata ki target kis side par ho sakta hai. Par ye tree generic nahi hai — ye ek binary search tree hai, aur upar ka invariant matlab hai ek khaas side ko poori tarah eliminate kiya jaa sakta hai har akele node par, ise kabhi search kiye bina.

**Fix: invariant istemal karke bilkul ek side chuno**

\`\`\`js
function findBST(node, target) {
  if (node === null) return false;
  if (node.value === target) return true;
  if (target < node.value) return findBST(node.left, target);  // SIRF left — right guaranteed bahut badi hai
  return findBST(node.right, target);                          // SIRF right — left guaranteed bahut chhoti hai
}
console.log(findBST(root, 6)); // true — 8 -> 3 -> 6 se pahunche, 10 ya 14 ko kabhi chhue bina
\`\`\`

\`\`\`ts
interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function findBST(node: BSTNode | null, target: number): boolean {
  if (node === null) return false;
  if (node.value === target) return true;
  if (target < node.value) return findBST(node.left, target);
  return findBST(node.right, target);
}
\`\`\`

Root (\`8\`) se shuru karke \`6\` dhoondhna: kyunki \`6 < 8\`, POORA right subtree (\`10\` aur \`14\`) skip kiya jaata hai kabhi visit kiye bina, kyunki invariant guarantee karta hai ki right par sab kuch \`8\` se bada hai, aur isliye \`6\` se bhi bada. \`3\` par jaate hue: kyunki \`6 > 3\`, \`3\` ki poori left side (sirf \`1\`) skip ki jaati hai, kyunki ye guaranteed chhoti hai \`3\` se, aur isliye \`6\` se chhoti. \`6\` par jaate hue: mil gaya. Tree ke har level par bilkul ek comparison, aur un comparisons mein se har ek par bilkul ek subtree poori tarah discard kiya gaya — ye wahi halving vyavahaar hai jo is course ke Module 2 lesson ne binary search par sthaapit kiya, ab tree structure ke zariye ho raha hai flat array par index arithmetic ke bajaye.`,

    content: `## Insert: walking down using the same invariant, then attaching a new leaf

\`\`\`js
function insert(node, value) {
  if (node === null) return { value, left: null, right: null }; // new leaf here
  if (value < node.value) {
    node.left = insert(node.left, value);
  } else if (value > node.value) {
    node.right = insert(node.right, value);
  }
  return node; // unchanged node, or the new leaf's parent, returned back up
}
\`\`\`

Insert reuses the exact same left-if-smaller, right-if-larger walk that \`findBST\` used, but instead of stopping at a match, it keeps walking until it reaches a \`null\` — the base case, exactly as this course's Module 6 lesson required — and replaces that \`null\` with a brand-new leaf node holding the inserted value. Crucially, this walk-then-attach approach automatically preserves the BST invariant: since the new leaf is only ever placed following the same smaller-goes-left, larger-goes-right rule all the way down, every node it passed on the way down still correctly has it in the correct subtree relative to that node's own value.

## Delete: three genuinely different cases, and why the hardest one reuses this module's inorder-traversal idea

\`\`\`
Case 1 — target is a leaf (no children):
  simply remove it; nothing else needs to change.

Case 2 — target has exactly one child:
  replace the target with that one child directly.

Case 3 — target has two children:
  cannot simply remove it without breaking the invariant for
  BOTH its subtrees at once. Instead, find the target's INORDER
  SUCCESSOR (the smallest value in its right subtree — reached by
  going right once, then left as far as possible), copy that
  successor's value into the target node, then delete the
  successor from the right subtree (which is now guaranteed to
  be Case 1 or Case 2, since the smallest node in a subtree can
  have, at most, a right child).
\`\`\`

Case 3 is the genuinely tricky one, and it directly reuses this module's earlier lesson: the inorder successor of a node (the next value in sorted order) is always the smallest value in that node's right subtree, precisely because inorder traversal — established in this module's first lesson to visit left, then current, then right — visits the entire right subtree only after the current node, and the leftmost node of that right subtree is the very first one inorder traversal would reach there, meaning it holds the smallest value in that subtree. Copying that value up and then removing the now-duplicated original safely fills the gap left by the deleted node without ever violating the smaller-left, larger-right invariant anywhere in the tree.

## Why all three operations cost O(height), and why "height" is not always O(log n)

\`\`\`
Balanced BST (each subtree roughly equal size):  height ≈ log₂(n)
  → search/insert/delete are genuinely fast, O(log n)

Degenerate BST (values inserted in already-sorted order,
  e.g., 1, 2, 3, 4, 5 inserted in that exact order):
  height = n — the tree is really just this course's Module 4
  linked list wearing a BST's node shape
  → search/insert/delete degrade to O(n), no better than the
  unsorted array this lesson's analogy started from
\`\`\`

Every operation in this lesson walks down exactly one path from the root to some node, taking one step per level — so each operation genuinely costs time proportional to the tree's HEIGHT, not directly to the number of elements it holds. For a balanced tree, height stays close to \`log₂(n)\`, delivering the fast search this lesson promised. But nothing about the plain insert function above rebalances anything — inserting values that already arrive in sorted order produces a tree that is a BST in name only, with every node having just one child, collapsing height down to \`n\` and search back down to the same linear cost this course's Module 2 lesson identified for scanning an unsorted array. This exact problem — and its fix — is what this module's next lesson on balanced trees and rotations addresses directly.`,

    contentHi: `## Insert: wahi invariant istemal karke neeche chalte hue, phir ek naya leaf jodna

\`\`\`js
function insert(node, value) {
  if (node === null) return { value, left: null, right: null }; // naya leaf yahaan
  if (value < node.value) {
    node.left = insert(node.left, value);
  } else if (value > node.value) {
    node.right = insert(node.right, value);
  }
  return node; // na-badla node, ya naye leaf ka parent, wapas upar return hua
}
\`\`\`

Insert bilkul wahi chhoti-toh-left, badi-toh-right waali chaal dobara istemal karta hai jo \`findBST\` istemal karta tha, par ek match par rukne ke bajaye, ye chalte rehta hai jab tak ek \`null\` tak nahi pahunchta — base case, bilkul jaisa is course ke Module 6 lesson ne zaruri kiya — aur us \`null\` ko ek bilkul naye leaf node se badalta hai jo insert ki gayi value rakhta hai. Mahatvapoorn baat, ye chalo-phir-jodo approach automatically BST invariant preserve karta hai: kyunki naya leaf sirf usi chhoti-jaao-left, badi-jaao-right rule ko poore raaste follow karke rakha jaata hai, har node jise ye neeche jaate hue paar karta hai abhi bhi sahi tarike se ise sahi subtree mein rakhta hai us node ki apni value ke saapeksh.

## Delete: teen sach mein alag cases, aur sabse mushkil wala is module ke inorder-traversal idea ko kyun dobara istemal karta hai

\`\`\`
Case 1 — target ek leaf hai (koi bachche nahi):
  bas ise hataao; kuch aur badalne ki zaroorat nahi hai.

Case 2 — target ka bilkul ek bachcha hai:
  target ko seedhe us ek bachche se badlo.

Case 3 — target ke do bachche hain:
  ise bas hataana dono iske subtrees ke liye ek saath invariant
  todega. Iske bajaye, target ka INORDER SUCCESSOR dhoondho (iske
  right subtree mein sabse chhoti value — ek baar right jaakar,
  phir jitna ho sake left jaakar pahunchi jaati hai), us successor
  ki value target node mein copy karo, phir successor ko right
  subtree se delete karo (jo ab guaranteed hai Case 1 ya Case 2
  ho, kyunki ek subtree ke sabse chhote node ke zyaada se zyaada
  ek right bachcha ho sakta hai).
\`\`\`

Case 3 sach mein tricky hai, aur ye seedhe is module ke pehle lesson ko dobara istemal karta hai: ek node ka inorder successor (sorted order mein agli value) hamesha us node ke right subtree ki sabse chhoti value hai, bilkul isliye kyunki inorder traversal — is module ke pehle lesson mein sthaapit ki gayi left, phir current, phir right dekhne ke liye — poore right subtree ko sirf current node ke baad dekhti hai, aur us right subtree ka sabse baaya node bilkul pehla hai jise inorder traversal wahaan pahunchegi, matlab ye us subtree mein sabse chhoti value rakhta hai. Us value ko upar copy karna aur phir ab-dohraaye-gaye original ko hataana surakshit roop se delete kiye gaye node dwara chhodi gayi gap ko bharta hai kabhi bhi tree mein kahin bhi chhoti-left, badi-right invariant ko todte hue bina.

## Sab teen operations O(height) kyun kharch karte hain, aur "height" hamesha O(log n) kyun nahi hoti

\`\`\`
Balanced BST (har subtree lagbhag barabar size): height ≈ log₂(n)
  → search/insert/delete sach mein tez hain, O(log n)

Degenerate BST (values pehle-se-sorted order mein insert ki gayin,
  jaise 1, 2, 3, 4, 5 bilkul usi order mein insert kiye gaye):
  height = n — tree asal mein bas is course ka Module 4 linked
  list hai ek BST ka node shape pehne hue
  → search/insert/delete O(n) tak degrade hote hain, us unsorted
  array se behtar nahi jahaan se is lesson ki analogy shuru hui thi
\`\`\`

Is lesson mein har operation root se kisi node tak bilkul ek path par neeche chalta hai, prati level ek kadam lete hue — isliye har operation sach mein tree ki HEIGHT ke anupaat mein samay kharch karta hai, seedhe iske paas kitne elements hain uske anupaat mein nahi. Ek balanced tree ke liye, height \`log₂(n)\` ke kareeb rehti hai, is lesson dwara promise ki gayi tez search pradaan karte hue. Par upar ke saadhaaran insert function ke baare mein kuch bhi kuch bhi rebalance nahi karta — values jo pehle se sorted order mein aati hain insert karna ek aisi tree banaata hai jo naam se hi BST hai, har node ke paas sirf ek bachcha hone ke saath, height ko \`n\` tak girate hue aur search ko wahi linear kharch tak wapas girate hue jise is course ke Module 2 lesson ne ek unsorted array scan karne ke liye pehchaana. Ye bilkul problem — aur iska fix — wo hai jise is module ka agla lesson balanced trees aur rotations par seedhe address karta hai.`,

    examples: [
      {
        title: 'Broken: searching a BST like a generic binary tree (checking both sides)',
        titleHi: 'Toota: ek BST ko ek generic binary tree ki tarah search karna (dono sides check karte hue)',
        code: `return findBroken(node.left, target) || findBroken(node.right, target);`,
        codeJs: `function findBroken(node, target) {
  if (node === null) return false;
  if (node.value === target) return true;
  return findBroken(node.left, target) || findBroken(node.right, target);
}
console.log(findBroken(root, 6)); // true, but wastefully checked both sides`,
        codeTs: `interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}
function findBroken(node: BSTNode | null, target: number): boolean {
  if (node === null) return false;
  if (node.value === target) return true;
  return findBroken(node.left, target) || findBroken(node.right, target);
}`,
        output: `true — correct, but it explores both children of every node
visited, never using the BST invariant to skip an entire subtree.`,
        explain: 'Checking both sides at every node ignores the BST invariant entirely, wasting the exact information that could eliminate half the remaining tree at each step.',
        explainHi: 'Har node par dono sides check karna BST invariant ko poori tarah ignore karta hai, us khaas jaankaari ko barbaad karte hue jo har step par baaki bachi tree ka aadha hissa eliminate kar sakti thi.',
      },
      {
        title: 'Fixed: using the invariant to eliminate one entire subtree per step',
        titleHi: 'Theek: invariant istemal karke prati-step ek poora subtree eliminate karna',
        code: `if (target < node.value) return findBST(node.left, target);
return findBST(node.right, target);`,
        codeJs: `function findBST(node, target) {
  if (node === null) return false;
  if (node.value === target) return true;
  if (target < node.value) return findBST(node.left, target);
  return findBST(node.right, target);
}
console.log(findBST(root, 6)); // true — via 8 -> 3 -> 6 only`,
        codeTs: `function findBST(node: BSTNode | null, target: number): boolean {
  if (node === null) return false;
  if (node.value === target) return true;
  if (target < node.value) return findBST(node.left, target);
  return findBST(node.right, target);
}`,
        outputJs: `true — reached via exactly one comparison per level (8, then
3, then 6), with the entire opposite subtree skipped each time.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The invariant guarantees the target cannot exist in the discarded subtree, so skipping it entirely is always safe, never a guess.',
        explainHi: 'Invariant guarantee karta hai ki target discard ki gayi subtree mein maujood nahi ho sakta, isliye ise poori tarah skip karna hamesha surakshit hai, kabhi guess nahi.',
      },
      {
        title: 'Deleting a two-child node using its inorder successor',
        titleHi: 'Do-bachche waale node ko iske inorder successor istemal karke delete karna',
        code: `let successor = node.right;
while (successor.left !== null) successor = successor.left;
node.value = successor.value;`,
        codeJs: `function deleteNode(node, target) {
  if (node === null) return null;
  if (target < node.value) { node.left = deleteNode(node.left, target); return node; }
  if (target > node.value) { node.right = deleteNode(node.right, target); return node; }
  // target === node.value found:
  if (node.left === null) return node.right;
  if (node.right === null) return node.left;
  let successor = node.right;
  while (successor.left !== null) successor = successor.left;
  node.value = successor.value;
  node.right = deleteNode(node.right, successor.value);
  return node;
}`,
        codeTs: `function deleteNode(node: BSTNode | null, target: number): BSTNode | null {
  if (node === null) return null;
  if (target < node.value) { node.left = deleteNode(node.left, target); return node; }
  if (target > node.value) { node.right = deleteNode(node.right, target); return node; }
  if (node.left === null) return node.right;
  if (node.right === null) return node.left;
  let successor = node.right;
  while (successor.left !== null) successor = successor.left;
  node.value = successor.value;
  node.right = deleteNode(node.right, successor.value);
  return node;
}`,
        outputJs: `Deleting a two-child node copies its inorder successor's value
up, then removes the now-duplicated successor from the right
subtree, preserving the invariant everywhere.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The inorder successor (smallest value in the right subtree) is always safe to move up, because everything else in the right subtree is guaranteed larger than it, and everything in the left subtree is guaranteed smaller than the original node.',
        explainHi: 'Inorder successor (right subtree ki sabse chhoti value) ko upar move karna hamesha surakshit hai, kyunki right subtree mein baaki sab kuch guaranteed isse bada hai, aur left subtree mein sab kuch guaranteed original node se chhota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `return findBST(node.left, target) || findBST(node.right, target); // checking both — wasted work`,
        right: `if (target < node.value) return findBST(node.left, target);
return findBST(node.right, target); // exactly one side, using the invariant`,
        why: 'Checking both children on a BST throws away the invariant entirely, turning an O(height) search into the same O(n) exploration a generic binary tree requires.',
        whyHi: 'Ek BST par dono bachche check karna invariant ko poori tarah phenk deta hai, ek \`O(height)\` search ko usi \`O(n)\` exploration mein badalte hue jo ek generic binary tree ko chahiye.',
      },
      {
        wrong: `// Deleting a two-child node by just removing it
node.left = null;
node.right = null; // both subtrees lost, invariant destroyed`,
        right: `// Copy the inorder successor's value up, then delete the successor
node.value = successor.value;
node.right = deleteNode(node.right, successor.value);`,
        why: 'A two-child node cannot simply be removed — doing so orphans both of its subtrees; the invariant must be preserved by replacing its value with a genuinely adjacent one (the inorder successor) before removing that duplicate.',
        whyHi: 'Ek do-bachche waale node ko bas hataaya nahi jaa sakta — aisa karna iske dono subtrees ko anaath kar deta hai; invariant ko iski value ko ek sach mein adjacent value (inorder successor) se badalkar preserve kiya jaana chahiye us duplicate ko hataane se pehle.',
      },
      {
        wrong: `let successor = node.right;
// forgot to walk left — this is node.right itself, not the SMALLEST in that subtree`,
        right: `let successor = node.right;
while (successor.left !== null) successor = successor.left; // walk all the way left`,
        why: 'The inorder successor is the smallest value in the right subtree, which requires walking left as far as possible — stopping at node.right itself only works if that node happens to have no left child.',
        whyHi: 'Inorder successor right subtree ki sabse chhoti value hai, jise jitna ho sake left chalne ki zaroorat hai — \`node.right\` par khud rukna sirf tab kaam karta hai jab us node ka koi left bachcha na ho.',
      },
    ],

    realWorld: [
      {
        en: '**Real database index structures (though typically B-trees rather than plain binary search trees) apply this exact same invariant — smaller-left, larger-right — generalized to more than two children per node, for the same reason: fast, ordered lookup.**',
        hi: '**Asli database index structures (chahe typically plain binary search trees ke bajaye B-trees) bilkul isi invariant ko lagu karte hain — chhoti-left, badi-right — prati-node do se zyaada bachchon tak generalize kiya gaya, usi kaaran ke liye: tez, ordered lookup.**',
      },
      {
        en: '**This lesson\'s inorder-successor deletion technique is one of the single most commonly asked BST implementation questions in real technical interviews, specifically testing whether a candidate understands why the two-child case cannot simply remove the node.**',
        hi: '**Is lesson ki inorder-successor deletion technique asli technical interviews mein sabse aam poochhe jaane waale BST implementation questions mein se ek hai, khaas taur par ye test karte hue ki kya ek candidate samajhta hai do-bachche waala case node ko simply hata kyun nahi sakta.**',
      },
      {
        en: '**Real language runtimes\' ordered map/set data structures (such as balanced-tree-backed maps in several standard libraries) are built directly on top of this BST invariant, with automatic rebalancing layered on top — the subject of this module\'s next lesson.**',
        hi: '**Asli language runtimes ke ordered map/set data structures (jaise kayi standard libraries mein balanced-tree-backed maps) is BST invariant ke seedhe upar banaaye jaate hain, automatic rebalancing ke saath upar layered — is module ke agle lesson ka vishay.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does the BST invariant (left smaller, right larger) make search O(height) instead of O(n), and precisely how does this relate to the binary search algorithm this course\'s Module 2 lesson covered for sorted arrays?',
        qHi: 'BST invariant (left chhoti, right badi) search ko \`O(n)\` ke bajaye \`O(height)\` kyun banaata hai, aur ye is course ke Module 2 lesson ne sorted arrays ke liye cover kiye binary search algorithm se thik-thik kaise sambandhit hai?',
        a: 'At any given node during a BST search, the invariant guarantees, with certainty, that the target — if it exists at all in this subtree — is located entirely within exactly one of the two child subtrees: the left subtree if the target is smaller than the current node\'s value, or the right subtree if it is larger (and nowhere if it exactly equals the current node\'s value, since it has been found). This means every single comparison made during the search eliminates one entire subtree from consideration, with absolute certainty, not merely a probabilistic likelihood. Because each comparison discards one whole subtree and continues only into the other, the number of comparisons needed is bounded by how many times the tree can be walked downward before running out of nodes — which is exactly the tree\'s height, not the total number of nodes it contains. This is structurally identical to how this course\'s Module 2 lesson\'s binary search operates on a sorted array: at each step, comparing the target against the middle element of the current range tells you with certainty which entire half of the range can be discarded, and the number of comparisons needed is bounded by how many times the range can be halved, which is log₂(n) for an array of n elements. A perfectly balanced BST has height log₂(n) for the same underlying reason a sorted array of n elements can be halved log₂(n) times — both structures are, at their core, applying the identical "eliminate half the remaining possibilities with one comparison" strategy, merely expressed through different physical layouts: contiguous index arithmetic for the array, and left/right pointer traversal for the tree.',
        aHi: 'Ek BST search ke dauraan kisi bhi diye gaye node par, invariant guarantee karta hai, poori nishchintata ke saath, ki target — agar ye is subtree mein bilkul maujood hai — poori tarah do bachche subtrees mein se bilkul ek mein sthith hai: left subtree agar target current node ki value se chhota hai, ya right subtree agar ye bada hai (aur kahin nahi agar ye bilkul current node ki value ke barabar hai, kyunki ye mil gaya hai). Iska matlab hai search ke dauraan banaayi gayi har akeli comparison ek poora subtree consideration se eliminate karti hai, poori nishchintata ke saath, sirf ek probabilistic sambhaavna nahi. Kyunki har comparison ek poora subtree discard karti hai aur sirf doosre mein jaari rakhti hai, zaruri comparisons ki tadaad is baat se bound hai ki tree ko nodes khatam hone se pehle kitni baar neeche chalaaya jaa sakta hai — jo bilkul tree ki height hai, iske paas kitne total nodes hain uski nahi. Ye structurally identical hai ki is course ka Module 2 lesson ka binary search ek sorted array par kaise operate karta hai: har step par, target ko current range ke beech ke element se compare karna aapko nishchintata ke saath batata hai ki range ka poora aadha hissa discard kiya jaa sakta hai, aur zaruri comparisons ki tadaad is baat se bound hai ki range ko kitni baar aadha kiya jaa sakta hai, jo \`n\` elements ki ek array ke liye \`log₂(n)\` hai. Ek poori tarah balanced BST ki height \`log₂(n)\` hoti hai usi underlying kaaran se jise \`n\` elements ki ek sorted array \`log₂(n)\` baar aadhi ki jaa sakti hai — dono structures, apne core mein, identical "ek comparison se baaki bachi aadhi sambhaavnaon ko eliminate karo" strategy lagu kar rahe hain, sirf alag physical layouts ke zariye express kiya gaya: array ke liye contiguous index arithmetic, aur tree ke liye left/right pointer traversal.',
      },
      {
        q: 'Why does deleting a BST node with two children require finding its inorder successor rather than simply removing the node and reattaching its subtrees some other way, and why is the successor always guaranteed to be safe to move into the deleted node\'s position?',
        qHi: 'Do bachchon waale ek BST node ko delete karna iske inorder successor ko dhoondhne ki zaroorat kyun rakhta hai bas node ko hataane aur iske subtrees ko kisi aur tarike se dobara jodne ke bajaye, aur successor hamesha delete kiye gaye node ki position mein move hone ke liye surakshit hone ke liye kyun guaranteed hai?',
        a: 'A node with two children sits at the root of two entire subtrees, and simply removing it leaves both of those subtrees disconnected from the rest of the tree with no indication of how to reattach them while preserving the BST invariant — a leaf or single-child node has an obvious, unambiguous replacement (nothing, or its one child), but a two-child node genuinely does not, since neither of its two subtrees alone can correctly take over the role of holding "everything smaller AND everything larger" that the deleted node\'s position requires. The inorder successor — the smallest value in the node\'s right subtree, found by walking right once and then left as far as possible — solves this precisely because of two guarantees the BST invariant provides simultaneously. First, since the successor comes from the right subtree, it is guaranteed to be larger than every value in the original node\'s left subtree, so moving it into the deleted node\'s position keeps the left subtree correctly entirely smaller than it. Second, since the successor is specifically the SMALLEST value within the right subtree, it is guaranteed to be smaller than or equal to every other value remaining in that right subtree once the successor itself is removed, so the invariant also holds correctly with respect to the remaining right subtree. Both of the invariant\'s two conditions are therefore satisfied simultaneously by this one specific value, which is precisely why it, and not some arbitrary other node, is the only value guaranteed safe to promote into the deleted node\'s position. As a final, practical detail, the successor node itself is guaranteed to have at most one child (specifically, at most a right child, since it was reached by walking left as far as possible, meaning it has no left child of its own) — so actually removing the successor from its original position, after copying its value up, is always a simple Case 1 or Case 2 deletion, never another difficult two-child case.',
        aHi: 'Do bachchon waala node do poore subtrees ke root par baithta hai, aur ise bas hataana un dono subtrees ko poori tree ke baaki hisse se disconnected chhod deta hai bina koi ishaara ke ki BST invariant preserve karte hue unhe wapas kaise jodna hai — ek leaf ya single-child node ke paas ek spasht, be-abhaas replacement hai (kuch nahi, ya iska ek bachcha), par ek do-bachche waale node ke paas sach mein nahi hai, kyunki iske do subtrees mein se koi bhi akela sahi tarike se "sab kuch chhota AUR sab kuch bada" rakhne ki bhoomika nahi le sakta jo deleted node ki position ko chahiye. Inorder successor — node ke right subtree mein sabse chhoti value, ek baar right jaakar phir jitna ho sake left jaakar mili — isse thik-thik isliye solve karta hai kyunki BST invariant do guarantees ek saath pradaan karta hai. Pehla, kyunki successor right subtree se aata hai, ye guaranteed hai ki ye original node ke left subtree mein har value se bada hai, isliye ise deleted node ki position mein move karna left subtree ko sahi tarike se poori tarah isse chhota rakhta hai. Doosra, kyunki successor khaas taur par right subtree mein sabse CHHOTI value hai, ye guaranteed hai ki ye us right subtree mein bache har doosri value se chhota ya barabar hai ek baar successor khud hataaya jaane ke baad, isliye invariant baaki bache right subtree ke saapeksh bhi sahi tarike se hold karta hai. Invariant ki dono conditions isliye is ek khaas value dwara ek saath satisfy ki jaati hain, jo bilkul kyun hai ye, aur koi anya arbitrary node nahi, sirf value hai jo deleted node ki position mein promote hone ke liye surakshit guaranteed hai. Ek aakhri, vyavaharik detail ki tarah, successor node khud guaranteed hai zyaada se zyaada ek bachcha rakhta hai (khaas taur par, zyaada se zyaada ek right bachcha, kyunki ye jitna ho sake left jaakar pahunchi gayi thi, matlab iska apna koi left bachcha nahi hai) — isliye asal mein successor ko iski original position se hataana, iski value upar copy karne ke baad, hamesha ek saadhaaran Case 1 ya Case 2 deletion hai, kabhi doosra mushkil do-bachche waala case nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the example BST from this lesson (root 8, left subtree 3/1/6, right subtree 10/14). Implement findBST and trace, by hand, exactly which nodes are visited searching for 14 and for 1.',
        taskHi: 'Is lesson ka example BST banao (root 8, left subtree 3/1/6, right subtree 10/14). \`findBST\` implement karo aur haath se trace karo, bilkul kaun se nodes visit kiye jaate hain \`14\` aur \`1\` dhoondhte waqt.',
        hint: 'For each search, count how many comparisons are made and confirm it never exceeds the tree\'s height.',
        hintHi: 'Har search ke liye, gano kitni comparisons ki jaati hain aur confirm karo ye kabhi tree ki height se zyaada nahi hoti.',
      },
      {
        task: 'Implement the insert function from this lesson and insert values 5, 2, 9, 1, 3 in that exact order into an initially empty tree. Draw the resulting tree by hand and verify the invariant holds at every node.',
        taskHi: 'Is lesson ka \`insert\` function implement karo aur values 5, 2, 9, 1, 3 ko bilkul usi order mein ek shuru mein khaali tree mein insert karo. Result waali tree haath se banao aur verify karo invariant har node par hold karta hai.',
        hint: 'Each insert walks down using the same smaller-left, larger-right rule findBST uses, stopping only when it reaches a null.',
        hintHi: 'Har insert wahi chhoti-left, badi-right rule istemal karke neeche chalta hai jo \`findBST\` istemal karta hai, sirf tab rukte hue jab ye ek null tak pahunchta hai.',
      },
      {
        task: 'Implement deleteNode from this lesson\'s third example. On the tree from exercise 2, delete the root (5, which has two children) and verify the correct inorder successor was promoted and the invariant still holds everywhere.',
        taskHi: 'Is lesson ke teesre example ka \`deleteNode\` implement karo. Exercise 2 ki tree par, root (5, jiske do bachche hain) delete karo aur verify karo sahi inorder successor promote kiya gaya aur invariant abhi bhi har jagah hold karta hai.',
        hint: 'The inorder successor of the root is the smallest value in the root\'s right subtree — walk right once, then left as far as possible.',
        hintHi: 'Root ka inorder successor root ke right subtree ki sabse chhoti value hai — ek baar right chalo, phir jitna ho sake left.',
      },
    ],

    keyTakeaways: [
      'A binary search tree enforces one invariant at every node: everything in the left subtree is smaller, everything in the right subtree is larger.',
      'This invariant lets search eliminate one entire subtree at every step with certainty, making search/insert/delete O(height) instead of the O(n) an unsorted structure requires.',
      'This is the same halving idea as this course\'s Module 2 binary search on a sorted array, expressed through tree structure (left/right pointers) instead of index arithmetic.',
      'Insert walks down using the same smaller-left, larger-right rule as search, stopping at a null (this course\'s Module 6 base case) and attaching a new leaf there.',
      'Deleting a two-child node requires finding its inorder successor (the smallest value in its right subtree) and promoting that value, because no other replacement can simultaneously satisfy the invariant for both of the node\'s subtrees.',
      'A BST\'s height is only O(log n) when the tree is reasonably balanced — inserting already-sorted values produces a degenerate, linked-list-shaped tree with O(n) operations, the problem this module\'s next lesson addresses.',
    ],
    keyTakeawaysHi: [
      'Ek binary search tree har node par ek invariant lagu karta hai: left subtree mein sab kuch chhota hai, right subtree mein sab kuch bada hai.',
      'Ye invariant search ko har step par poori nishchintata ke saath ek poora subtree eliminate karne deta hai, search/insert/delete ko \`O(height)\` banaate hue us \`O(n)\` ke bajaye jo ek unsorted structure chahta hai.',
      'Ye wahi halving idea hai jo is course ka Module 2 binary search ek sorted array par karta hai, tree structure (left/right pointers) ke zariye express kiya gaya index arithmetic ke bajaye.',
      'Insert wahi chhoti-left, badi-right rule istemal karke neeche chalta hai jo search istemal karta hai, ek null par rukte hue (is course ka Module 6 base case) aur wahaan ek naya leaf jodte hue.',
      'Do-bachche waale node ko delete karna iske inorder successor (iske right subtree ki sabse chhoti value) ko dhoondhne aur us value ko promote karne ki zaroorat rakhta hai, kyunki koi doosra replacement ek saath node ke dono subtrees ke liye invariant satisfy nahi kar sakta.',
      'Ek BST ki height sirf \`O(log n)\` hai jab tree vaajbi roop se balanced hai — pehle-se-sorted values insert karna ek degenerate, linked-list-shaped tree banaata hai \`O(n)\` operations ke saath, wo problem jise is module ka agla lesson address karta hai.',
    ],
  },
];
