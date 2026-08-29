/**
 * DSA Complete Course — Module 7: Trees, lesson 4.
 *
 * Balanced trees and rotations, covered conceptually (not a full
 * AVL/red-black implementation). Directly resumes exactly where this
 * module's previous lesson ended: plain BST insert produces a
 * degenerate, linked-list-shaped tree when values arrive in already-
 * sorted order, degrading search from this module's promised
 * O(height) back down to O(n). A rotation is introduced as a local
 * restructuring operation that changes which node is the local root
 * while provably preserving the BST invariant — proven using this
 * module's first lesson's fact that inorder traversal of a BST always
 * yields sorted output: a rotation is shown to leave the inorder
 * sequence completely unchanged, which is the direct evidence that the
 * invariant survives the restructuring. Broken example: repeatedly
 * inserting sorted values with the plain insert from the previous
 * lesson, watching height grow to n. Fixed (conceptually): a single
 * right rotation demonstrated concretely on a 3-node left-heavy
 * chain, restoring balanced height.
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

export const DSA_MODULE_7_PART4: CourseLesson[] = [
  {
    slug: 'balanced-trees-rotations',
    title: 'Balanced Trees & Rotations: Fixing a Leaning Tree',
    titleHi: 'Balanced Trees Aur Rotations: Jhukti Hui Tree Ko Theek Karna',
    description: 'This module\'s previous lesson ended by showing that inserting already-sorted values into a plain BST produces a degenerate, linked-list-shaped tree with height n, degrading search back to O(n). A rotation is the local restructuring operation real balanced-tree implementations (AVL trees, red-black trees) use to fix this — and this lesson proves it preserves the BST invariant using this module\'s own inorder-traversal fact.',
    descriptionHi: 'Is module ka pichhla lesson darsaakar khatam hua ki pehle-se-sorted values ko ek saadhaaran BST mein insert karna ek degenerate, linked-list-shaped tree banaata hai height \`n\` ke saath, search ko wapas \`O(n)\` tak degrade karte hue. Ek rotation wo local restructuring operation hai jise asli balanced-tree implementations (AVL trees, red-black trees) ise theek karne ke liye istemal karte hain — aur ye lesson is module ke apne inorder-traversal tathya ka istemal karke saabit karta hai ki ye BST invariant preserve karta hai.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A bookshelf where every new book is placed on top of the previous one, leaning further and further to one side, versus periodically redistributing the weight so the shelf stays upright.** This module\'s previous lesson\'s plain insert function is the first bookshelf: when books (values) arrive already in sorted order, each new one gets placed as a child of the previous one, on the same side every time, and the stack leans further with every addition until it is, structurally, no longer really a "shelf" at all — it is a single leaning column, exactly this course\'s Module 4 linked list wearing a tree\'s node shape. A rotation is the fix: rather than tearing the whole leaning stack down and rebuilding it from scratch, a rotation performs a small, local adjustment — promoting one specific book to sit where the top of the leaning stack used to be, and letting the books above and below it resettle into place — that measurably reduces the lean, without changing which books are present or their left-to-right sorted order at all. Real balanced-tree implementations (AVL trees, red-black trees) apply this exact local-adjustment idea automatically after every insertion or deletion, keeping the tree\'s height close to \`log(n)\` at all times, so it never degrades into the single leaning column this module\'s previous lesson warned about.',
      hi: '**Ek bookshelf jahaan har nayi kitaab pichhli ke upar rakhi jaati hai, ek taraf zyaada se zyaada jhukte hue, versus periodically weight ko dobara distribute karna taaki shelf khadi rahe.** Is module ke pichhle lesson ka saadhaaran insert function pehli bookshelf hai: jab kitaabein (values) pehle se sorted order mein aati hain, har nayi ek pichhli ki bachche ki tarah rakhi jaati hai, har baar usi side par, aur dher har jodh ke saath zyaada jhukta hai jab tak ye, structurally, ab wakai mein ek "shelf" nahi rehta — ye ek akeli jhukti hui column hai, bilkul is course ka Module 4 linked list ek tree ka node shape pehne hue. Ek rotation fix hai: poore jhukte hue dher ko todkar shuru se dobara banaane ke bajaye, ek rotation ek chhota, local adjustment karta hai — ek khaas kitaab ko promote karke wahaan rakhta hai jahaan jhukte hue dher ka top hota tha, aur upar aur neeche ki kitaabon ko apni jagah dobara settle hone deta hai — jo naapa jaane laayak roop se jhukaav ko kam karta hai, kaun si kitaabein maujood hain ya unki left-se-right sorted order bilkul badle bina. Asli balanced-tree implementations (AVL trees, red-black trees) is bilkul isi local-adjustment idea ko automatically har insertion ya deletion ke baad lagu karte hain, tree ki height hamesha \`log(n)\` ke kareeb rakhte hue, taaki ye kabhi us akeli jhukti hui column mein degrade na ho jiski is module ke pichhle lesson ne chetaavani di.',
    },

    simple: `**Start broken.** This module's previous lesson's plain insert function, applied to already-sorted input:

\`\`\`js
let root = null;
for (const v of [1, 2, 3, 4, 5]) {
  root = insert(root, v); // this module's previous lesson's insert
}
\`\`\`

\`\`\`
Resulting tree — every node has only a right child, height = 5:

1
 \\
  2
   \\
    3
     \\
      4
       \\
        5
\`\`\`

This module's previous lesson already named this exact failure: search on this tree costs \`O(height)\`, and here height equals \`n\` (5), so search has degraded to the same \`O(n)\` cost as scanning an unsorted array — the entire benefit of using a BST at all has been lost, purely because of the ORDER values happened to arrive in.

**The fix, conceptually: a rotation redistributes the lean without changing sorted order**

Consider just the smallest piece of the lean above — a 3-node chain, values \`1 → 2 → 3\`, all leaning right:

\`\`\`js
function rotateLeft(node) {
  const newRoot = node.right;      // "2" becomes the new local root
  node.right = newRoot.left;       // "2"'s old left child (if any) becomes "1"'s new right child
  newRoot.left = node;             // "1" becomes "2"'s left child
  return newRoot;                  // "2" is now the top of this local piece
}
\`\`\`

\`\`\`ts
interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function rotateLeft(node: BSTNode): BSTNode {
  const newRoot = node.right as BSTNode;
  node.right = newRoot.left;
  newRoot.left = node;
  return newRoot;
}
\`\`\`

\`\`\`
Before (leaning right, height 3):        After rotateLeft (balanced, height 2):

1                                                2
 \\                                              / \\
  2                                             1   3
   \\
    3
\`\`\`

Applying this same \`rotateLeft\` operation at the point of lean, repeated as needed, is precisely the mechanism real self-balancing trees use to keep height close to \`log(n)\` instead of letting it grow to \`n\`.`,

    simpleHi: `**Toote hue se shuru.** Is module ke pichhle lesson ka saadhaaran insert function, pehle-se-sorted input par lagu:

\`\`\`js
let root = null;
for (const v of [1, 2, 3, 4, 5]) {
  root = insert(root, v); // is module ke pichhle lesson ka insert
}
\`\`\`

\`\`\`
Result waali tree — har node ka sirf ek right bachcha hai, height = 5:

1
 \\
  2
   \\
    3
     \\
      4
       \\
        5
\`\`\`

Is module ka pichhla lesson pehle hi bilkul ye failure naam de chuka hai: is tree par search \`O(height)\` kharch karta hai, aur yahaan height \`n\` (5) ke barabar hai, isliye search wahi \`O(n)\` kharch tak degrade ho gayi hai jitna ek unsorted array scan karna — BST istemal karne ka poora faayda kho gaya hai, sirf isliye kyunki values jis ORDER mein aayin.

**Fix, conceptually: ek rotation jhukaav ko dobara distribute karta hai sorted order badle bina**

Sirf upar ke jhukaav ka sabse chhota tukda vichaar karo — ek 3-node chain, values \`1 → 2 → 3\`, sab right jhukte hue:

\`\`\`js
function rotateLeft(node) {
  const newRoot = node.right;      // "2" naya local root banta hai
  node.right = newRoot.left;       // "2" ka purana left bachcha (agar koi hai) "1" ka naya right bachcha banta hai
  newRoot.left = node;             // "1" "2" ka left bachcha banta hai
  return newRoot;                  // "2" ab is local tukde ka top hai
}
\`\`\`

\`\`\`ts
interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function rotateLeft(node: BSTNode): BSTNode {
  const newRoot = node.right as BSTNode;
  node.right = newRoot.left;
  newRoot.left = node;
  return newRoot;
}
\`\`\`

\`\`\`
Pehle (right jhukte hue, height 3):        rotateLeft ke baad (balanced, height 2):

1                                                2
 \\                                              / \\
  2                                             1   3
   \\
    3
\`\`\`

Isi \`rotateLeft\` operation ko jhukaav ke point par lagu karna, zaroorat ke hisaab se dohraaya gaya, bilkul wo mechanism hai jise asli self-balancing trees height ko \`log(n)\` ke kareeb rakhne ke liye istemal karte hain \`n\` tak badhne dene ke bajaye.`,

    content: `## Proving the rotation preserves the BST invariant, using this module's own inorder fact

\`\`\`
Before rotation, inorder traversal (left, current, right, recursively):
  1 → 2 → 3

After rotation, inorder traversal of the SAME three nodes:
  1 → 2 → 3   (identical!)
\`\`\`

This module's first lesson established that inorder traversal of a BST always yields sorted output, precisely because it visits left, then current, then right, at every level. Tracing inorder on the rotated structure directly: starting at the new root (\`2\`), inorder first fully explores its left subtree (just \`1\`), then visits \`2\` itself, then fully explores its right subtree (just \`3\`) — producing \`1, 2, 3\`, the exact same sequence produced before the rotation. A rotation, by construction, only ever rearranges which specific pointers connect the same set of nodes to each other — it never adds, removes, or changes any node's value — so the SET of values present is unchanged, and this concrete trace confirms their sorted inorder order is unchanged too. This is the direct evidence, not merely an assertion, that the BST invariant this module's third lesson defined survives the rotation intact: the tree afterward is still a completely valid BST, just a shorter, better-shaped one.

## Left-heavy versus right-heavy: choosing which rotation to apply

\`\`\`
Right-heavy (leaning right, like the 1→2→3 example above):
  apply rotateLeft — promotes the right child, flattening the lean

Left-heavy (the mirror image, leaning left):
  apply rotateRight — promotes the left child, flattening the lean
  (rotateRight is rotateLeft's exact mirror image, swapping every
  left/right reference)
\`\`\`

\`\`\`js
function rotateRight(node) {
  const newRoot = node.left;
  node.left = newRoot.right;
  newRoot.right = node;
  return newRoot;
}
\`\`\`

\`rotateRight\` is a precise mirror of \`rotateLeft\`: every \`.left\` becomes \`.right\` and vice versa. Real self-balancing trees decide which rotation to apply by tracking, at every node, a "balance factor" — informally, how much taller one child's subtree is than the other's — and triggering the appropriate rotation whenever that imbalance crosses a threshold. This course treats the precise balance-factor bookkeeping and the more elaborate multi-step rotations AVL and red-black trees sometimes require (a "left-right" rotation is literally a rotateRight followed by a rotateLeft) as implementation detail beyond this lesson's scope — the concept that matters for interviews and for building correct intuition is exactly what was proven above: a rotation is a local, invariant-preserving restructuring that trades height for a differently shaped, shallower tree.

## Why this matters even though you will rarely hand-implement a full AVL tree

\`\`\`
Plain BST, sorted-order insertion:  height degrades to n  → O(n) search
Self-balancing BST, same input:     height stays ~log(n)  → O(log n) search
\`\`\`

Every real, production-grade ordered map or set data structure (the kind covered in real interviews as "just use a balanced BST" or "this language's built-in ordered map") relies on automatic rotation internally to guarantee the \`O(log n)\` bound this module's third lesson promised, specifically BECAUSE plain, unrotated BST insertion cannot guarantee it, as this lesson's broken example demonstrated concretely. Understanding that a rotation exists, what problem it solves, and why it provably preserves the invariant is the level of understanding genuinely expected in most interviews — implementing the full balance-factor-tracking machinery from scratch is a much rarer, deeper ask.`,

    contentHi: `## Rotation BST invariant preserve karta hai saabit karna, is module ke apne inorder tathya ka istemal karke

\`\`\`
Rotation se pehle, inorder traversal (left, current, right, recursively):
  1 → 2 → 3

Rotation ke baad, WAHI teen nodes ka inorder traversal:
  1 → 2 → 3   (identical!)
\`\`\`

Is module ke pehle lesson ne sthaapit kiya ki ek BST ka inorder traversal hamesha sorted output banaata hai, bilkul isliye kyunki ye har level par left, phir current, phir right dekhta hai. Rotated structure par inorder ko seedhe trace karna: naye root (\`2\`) se shuru karke, inorder pehle iske left subtree (sirf \`1\`) ko poori tarah explore karta hai, phir \`2\` khud ko dekhta hai, phir iske right subtree (sirf \`3\`) ko poori tarah explore karta hai — \`1, 2, 3\` banaate hue, bilkul wahi sequence jo rotation se pehle banaayi gayi thi. Ek rotation, construction ke hisaab se, kabhi bhi sirf ye rearrange karta hai ki kaun se khaas pointers wahi nodes ke set ko ek doosre se jodte hain — ye kabhi kisi node ki value nahi jodta, hataata, ya badalta hai — isliye maujood values ka SET na-badla rehta hai, aur ye thos trace confirm karta hai ki unki sorted inorder order bhi na-badli hai. Ye thos saboot hai, sirf ek daava nahi, ki BST invariant jise is module ke teesre lesson ne define kiya rotation ke baad bhi surakshit rehta hai: baad ki tree abhi bhi ek poori tarah valid BST hai, bas ek chhoti, behtar-shape waali.

## Left-heavy versus right-heavy: kaun sa rotation lagu karna hai chunna

\`\`\`
Right-heavy (right jhukte hue, upar ke 1→2→3 example ki tarah):
  rotateLeft lagu karo — right bachche ko promote karta hai, jhukaav ko flatten karte hue

Left-heavy (mirror image, left jhukte hue):
  rotateRight lagu karo — left bachche ko promote karta hai, jhukaav ko flatten karte hue
  (rotateRight rotateLeft ka bilkul mirror image hai, har left/right
  reference ko swap karte hue)
\`\`\`

\`\`\`js
function rotateRight(node) {
  const newRoot = node.left;
  node.left = newRoot.right;
  newRoot.right = node;
  return newRoot;
}
\`\`\`

\`rotateRight\` \`rotateLeft\` ka ek thik-thik mirror hai: har \`.left\` \`.right\` banta hai aur ulta bhi. Asli self-balancing trees decide karte hain kaun sa rotation lagu karna hai har node par ek "balance factor" track karke — informally, ek bachche ki subtree doosre se kitni lambi hai — aur jab bhi ye asantulan ek threshold paar karta hai sahi rotation trigger karte hue. Ye course thik-thik balance-factor bookkeeping aur zyaada vistrit multi-step rotations jo AVL aur red-black trees kabhi-kabhaar chahte hain (ek "left-right" rotation literally ek \`rotateRight\` hai jiske baad ek \`rotateLeft\`) ko is lesson ke scope se pare implementation detail ki tarah treat karta hai — concept jo interviews aur sahi intuition banaane ke liye matter karta hai bilkul wahi hai jo upar saabit kiya gaya: ek rotation ek local, invariant-preserve karne waala restructuring hai jo height ko ek alag-shape, chhoti tree ke liye trade karta hai.

## Ye kyun matter karta hai chahe tum shaayad hi kabhi ek poori AVL tree haath se implement karoge

\`\`\`
Saadhaaran BST, sorted-order insertion:  height n tak degrade hoti hai  → O(n) search
Self-balancing BST, wahi input:          height ~log(n) rehti hai       → O(log n) search
\`\`\`

Har asli, production-grade ordered map ya set data structure (jo asli interviews mein "bas ek balanced BST istemal karo" ya "is language ka built-in ordered map" ki tarah cover ki jaati hai) internally automatic rotation par nirbhar karta hai \`O(log n)\` bound guarantee karne ke liye jo is module ka teesra lesson promise karta tha, khaas taur par ISLIYE kyunki saadhaaran, na-rotate ki gayi BST insertion ise guarantee nahi kar sakti, jaisa is lesson ka toota example thos roop se darsaata hai. Ye samajhna ki ek rotation maujood hai, ye kaun si problem solve karta hai, aur ye provably invariant kyun preserve karta hai wo samajh ki satah hai jo adhikaansh interviews mein sach mein expect ki jaati hai — poori balance-factor-tracking machinery ko shuru se implement karna ek bahut zyaada durlabh, gehri maang hai.`,

    examples: [
      {
        title: 'Broken: plain BST insert with already-sorted input, height grows to n',
        titleHi: 'Toota: saadhaaran BST insert pehle-se-sorted input ke saath, height n tak badhti hai',
        code: `let root = null;
for (const v of [1, 2, 3, 4, 5]) root = insert(root, v);`,
        codeJs: `function insert(node, value) {
  if (node === null) return { value, left: null, right: null };
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  return node;
}
let root = null;
for (const v of [1, 2, 3, 4, 5]) root = insert(root, v);
// height is now 5 — every node has only a right child`,
        codeTs: `function insert(node: BSTNode | null, value: number): BSTNode {
  if (node === null) return { value, left: null, right: null };
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  return node;
}`,
        output: `A tree with height 5 for only 5 values — search now costs O(n),
identical to scanning this course's Module 2 unsorted array.`,
        explain: 'Plain insert never restructures anything after placing a new leaf, so sorted-order input produces a purely one-sided, degenerate tree.',
        explainHi: 'Saadhaaran insert ek naya leaf rakhne ke baad kuch bhi kabhi restructure nahi karta, isliye sorted-order input ek poori tarah ek-taraf, degenerate tree banaata hai.',
      },
      {
        title: 'Fixed (conceptually): rotateLeft flattens a right-leaning chain',
        titleHi: 'Theek (conceptually): rotateLeft ek right-jhukti hui chain ko flatten karta hai',
        code: `const newRoot = node.right;
node.right = newRoot.left;
newRoot.left = node;
return newRoot;`,
        codeJs: `function rotateLeft(node) {
  const newRoot = node.right;
  node.right = newRoot.left;
  newRoot.left = node;
  return newRoot;
}
// applied to the 1 -> 2 -> 3 right-leaning chain:
const rebalanced = rotateLeft(chainRoot); // rebalanced.value === 2, height 2`,
        codeTs: `function rotateLeft(node: BSTNode): BSTNode {
  const newRoot = node.right as BSTNode;
  node.right = newRoot.left;
  newRoot.left = node;
  return newRoot;
}`,
        outputJs: `The 3-node chain (height 3) becomes a balanced shape (height 2)
with 2 as the new local root, 1 as its left child, 3 as its right.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The rotation only rearranges which pointers connect the same three nodes — no value is added, removed, or changed.',
        explainHi: 'Rotation sirf ye rearrange karta hai ki kaun se pointers wahi teen nodes ko jodte hain — koi value jodi, hataayi, ya badli nahi jaati.',
      },
      {
        title: 'Confirming the invariant survives: inorder traversal before and after',
        titleHi: 'Confirm karna invariant survive karta hai: rotation se pehle aur baad inorder traversal',
        code: `console.log(inorder(chainRoot));   // before
console.log(inorder(rebalanced));  // after`,
        codeJs: `function inorder(node, result = []) {
  if (node === null) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}
console.log(inorder(chainRoot));   // [1, 2, 3]
console.log(inorder(rebalanced));  // [1, 2, 3] — identical`,
        codeTs: `function inorder(node: BSTNode | null, result: number[] = []): number[] {
  if (node === null) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}`,
        outputJs: `Both traversals produce [1, 2, 3] — direct, concrete confirmation
that the rotation changed the tree's SHAPE but not its sorted
content, meaning the BST invariant survived intact.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'This module\'s first lesson established that inorder traversal reveals a BST\'s sorted content directly — an unchanged inorder result is direct evidence the invariant still holds.',
        explainHi: 'Is module ke pehle lesson ne sthaapit kiya ki inorder traversal ek BST ki sorted content ko seedhe darsata hai — ek na-badla inorder nateeja is baat ka thos saboot hai ki invariant abhi bhi hold karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// Believing a rotation could change which values are in the tree
function rotateLeft(node) {
  const newRoot = node.right;
  newRoot.value = node.value + 1; // WRONG — inventing a new value
  ...
}`,
        right: `function rotateLeft(node) {
  const newRoot = node.right; // reuses the EXISTING node, no new value
  node.right = newRoot.left;
  newRoot.left = node;
  return newRoot;
}`,
        why: 'A rotation only ever rearranges pointers between existing nodes — it must never create, delete, or modify a node\'s stored value, or the tree would no longer hold the same data.',
        whyHi: 'Ek rotation sirf maujood nodes ke beech pointers rearrange karta hai — ise kabhi ek node ki stored value banaani, hataani, ya badalni nahi chahiye, warna tree wahi data nahi rakhegi.',
      },
      {
        wrong: `// Applying rotateLeft to a LEFT-heavy tree — wrong rotation for the imbalance
rotateLeft(leftHeavyNode);`,
        right: `// A left-heavy tree needs rotateRight to flatten its lean
rotateRight(leftHeavyNode);`,
        why: 'rotateLeft promotes a node\'s RIGHT child, which fixes right-heavy leaning; applying it to a left-heavy tree does nothing to fix, and can worsen, the actual imbalance.',
        whyHi: 'rotateLeft ek node ke RIGHT bachche ko promote karta hai, jo right-heavy jhukaav theek karta hai; ise ek left-heavy tree par lagu karna asli asantulan theek karne ke liye kuch nahi karta, aur ise bigaad sakta hai.',
      },
      {
        wrong: `function rotateLeft(node) {
  const newRoot = node.right;
  newRoot.left = node; // forgot to reattach newRoot's OLD left child anywhere
  return newRoot;
  // newRoot's original left subtree is now silently lost
}`,
        right: `function rotateLeft(node) {
  const newRoot = node.right;
  node.right = newRoot.left; // REQUIRED — reattach it as node's new right child
  newRoot.left = node;
  return newRoot;
}`,
        why: 'The new root\'s old left child (if any) holds values greater than the original node but less than the new root, so it must be reattached as the original node\'s new right child, not silently dropped.',
        whyHi: 'Naye root ka purana left bachcha (agar koi hai) aisi values rakhta hai jo original node se badi hain par naye root se chhoti — isliye ise original node ke naye right bachche ki tarah dobara jodna zaruri hai, chupchaap chhoda nahi jaana chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Real language runtimes\' ordered map/set implementations (many of which use red-black trees internally) apply rotations automatically on every insert and delete, guaranteeing O(log n) operations regardless of insertion order.**',
        hi: '**Asli language runtimes ke ordered map/set implementations (jinme se kayi internally red-black trees istemal karte hain) rotations automatically har insert aur delete par lagu karte hain, insertion order ki parwaah kiye bina \`O(log n)\` operations guarantee karte hue.**',
      },
      {
        en: '**AVL trees (named after their inventors, Adelson-Velsky and Landis) were the first self-balancing BST, and remain a standard topic in real computer science coursework specifically because their balance-factor rule is simple to reason about.**',
        hi: '**AVL trees (apne inventors, Adelson-Velsky aur Landis, ke naam par) pehla self-balancing BST tha, aur asli computer science coursework mein ek standard topic bana hua hai khaas taur par kyunki inka balance-factor rule samajhne mein saadhaaran hai.**',
      },
      {
        en: '**Real interview questions about balanced trees typically ask for the CONCEPT (what a rotation does, why height matters) rather than a full from-scratch AVL implementation, which is why this lesson deliberately stops at that conceptual level.**',
        hi: '**Balanced trees ke baare mein asli interview questions typically CONCEPT poochhte hain (ek rotation kya karta hai, height kyun matter karti hai) ek poori shuru-se AVL implementation ke bajaye, jo bilkul kyun hai ye lesson jaan-boojhkar us conceptual level par rukta hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why is it possible to prove a rotation preserves the BST invariant just by checking that inorder traversal produces the same sequence before and after, rather than needing to separately verify every node\'s left/right relationship by hand?',
        qHi: 'Ye saabit karna kyun mumkin hai ki ek rotation BST invariant preserve karta hai sirf ye check karke ki inorder traversal pehle aur baad mein wahi sequence banaata hai, alag se har node ke left/right relationship ko haath se verify karne ki zaroorat ke bajaye?',
        a: 'This module\'s first lesson established a precise, provable fact: inorder traversal of a tree produces a fully sorted sequence if and only if the BST invariant (every left-subtree value smaller, every right-subtree value larger, at every single node) holds throughout that tree. This is a genuine if-and-only-if relationship, not merely a one-directional observation — it means sorted inorder output is not just a symptom of a valid BST, it is logically EQUIVALENT to having a valid BST. Given this equivalence, confirming that inorder traversal produces an unchanged, still-sorted sequence after a rotation is not an indirect or partial check — it is a complete, sufficient proof that the invariant still holds at every single node in the tree, because if even one node\'s left/right relationship had been left inconsistent by the rotation, the resulting inorder sequence would necessarily come out unsorted somewhere, revealing the violation directly. This is precisely why this lesson\'s approach — trace inorder before the rotation, trace it again after, and confirm they match — constitutes a complete verification rather than a spot-check, and why it is unnecessary to separately inspect each node\'s pointers by hand: the single global property (sortedness of the traversal) is mathematically tied to the local property (the invariant at every node) that actually needs verifying.',
        aHi: 'Is module ke pehle lesson ne ek thik-thik, saabit ki jaane laayak tathya sthaapit kiya: ek tree ka inorder traversal ek poori tarah sorted sequence banaata hai agar aur sirf agar BST invariant (har left-subtree value chhoti, har right-subtree value badi, bilkul har node par) poori tree mein hold karta hai. Ye ek asli agar-aur-sirf-agar relationship hai, sirf ek-disha ka observation nahi — iska matlab hai sorted inorder output sirf ek valid BST ka lakshan nahi hai, ye logically EQUIVALENT hai ek valid BST hone ke. Ye equivalence dekhte hue, confirm karna ki inorder traversal ek rotation ke baad ek na-badli, abhi bhi sorted sequence banaata hai koi indirect ya partial check nahi hai — ye ek poora, kaafi saboot hai ki invariant abhi bhi tree ke har akele node par hold karta hai, kyunki agar ek bhi node ka left/right relationship rotation dwara asangat chhoda gaya hota, resulting inorder sequence zaroori roop se kahin na-sorted aati, violation ko seedhe darsaate hue. Ye bilkul kyun hai is lesson ka approach — rotation se pehle inorder trace karo, baad mein dobara trace karo, aur confirm karo wo match karte hain — ek poori verification banaata hai spot-check ke bajaye, aur kyun har node ke pointers ko alag se haath se inspect karna zaruri nahi hai: akela global property (traversal ki sortedness) mathematically us local property (har node par invariant) se judi hai jise asal mein verify karne ki zaroorat hai.',
      },
      {
        q: 'Why does a degenerate BST (produced by inserting already-sorted values with plain, unrotated insert) cost O(n) for search, and specifically what makes a rotation the correct fix rather than, for example, simply re-inserting all the values in a different order?',
        qHi: 'Ek degenerate BST (pehle-se-sorted values ko saadhaaran, na-rotate kiye gaye insert ke saath insert karke banaayi gayi) search ke liye \`O(n)\` kyun kharch karta hai, aur khaas taur par ek rotation sahi fix kyun hai, misal ke taur par, sirf sab values ko ek alag order mein dobara insert karne ke bajaye?',
        a: 'This module\'s third lesson established that search cost on a BST is bounded by the tree\'s height, not directly by the number of values it holds, because each step of search descends exactly one level. A degenerate tree produced by sorted-order insertion has every node with only a single child, meaning the tree\'s height equals the number of values it contains (n) rather than the roughly log(n) height a well-balanced tree would have — so search on this specific tree genuinely costs O(n), identical to the linear scan of an unsorted array this course\'s Module 2 covered, completely negating the reason to use a BST in the first place. Re-inserting all the values in a different (say, randomly shuffled) order could, in principle, happen to produce a better-shaped tree by luck, but this is not a reliable fix: it requires already having all the values available at once to reorder them (impossible if values are arriving one at a time from some external source over time), provides no guarantee whatsoever about the resulting shape (an unlucky shuffle could still produce a degenerate tree), and requires discarding and completely rebuilding the entire tree from scratch, an O(n log n) or worse operation, merely to fix a local problem. A rotation, in sharp contrast, is a genuinely local, cheap, O(1) operation applied exactly where an imbalance is detected, requires no knowledge of values beyond the immediate few nodes involved in the rotation, works correctly regardless of how or in what order future values arrive, and — as this lesson proved directly via the inorder-traversal argument — is guaranteed, not merely likely, to preserve the BST invariant while measurably improving the tree\'s shape. This combination of being local, cheap, and provably correct is precisely why every real self-balancing tree implementation uses rotations rather than any form of wholesale reordering or rebuilding.',
        aHi: 'Is module ke teesre lesson ne sthaapit kiya ki ek BST par search kharch tree ki height se bound hai, seedhe iske paas kitni values hain isse nahi, kyunki search ka har step bilkul ek level neeche jaata hai. Sorted-order insertion se banaayi gayi ek degenerate tree ke har node ka sirf ek bachcha hota hai, matlab tree ki height iske paas maujood values ki tadaad (n) ke barabar hai lagbhag \`log(n)\` height ke bajaye jo ek achhi tarah balanced tree ki hoti. Toh is khaas tree par search sach mein \`O(n)\` kharch karta hai, us linear scan ke barabar jo is course ka Module 2 ek unsorted array ke liye cover karta hai, ek BST istemal karne ka pehli jagah ka kaaran poori tarah negate karte hue. Sab values ko ek alag (kaho, randomly shuffle kiye gaye) order mein dobara insert karna, principle mein, kismat se ek behtar-shape waali tree bana sakta hai, par ye ek reliable fix nahi hai: iske liye sab values pehle se ek saath upalabdh hone chahiye unhe reorder karne ke liye (asambhav agar values ek-ek karke kisi bahari source se samay ke saath aa rahi hain), resulting shape ke baare mein koi guarantee bilkul nahi deta (ek badkismat shuffle abhi bhi ek degenerate tree bana sakta hai), aur poori tree ko shuru se hataane aur dobara banaane ki zaroorat rakhta hai, ek \`O(n log n)\` ya usse bhi buri operation, sirf ek local problem theek karne ke liye. Ek rotation, iske teekhe ulta, ek sach mein local, sasta, \`O(1)\` operation hai bilkul wahaan lagu kiya jaata hai jahaan ek asantulan detect kiya jaata hai, rotation mein shaamil chand nodes se pare values ke gyaan ki zaroorat nahi rakhta, sahi tarike se kaam karta hai chahe bhavishya ki values kaise ya kis order mein aayein, aur — jaisa is lesson ne seedhe inorder-traversal argument ke zariye saabit kiya — guaranteed hai, sirf sambhaavit nahi, BST invariant preserve karne ke liye tree ki shape ko naapa jaane laayak roop se sudhaarte hue. Local, sasta, aur provably sahi hone ka ye combination bilkul kyun hai har asli self-balancing tree implementation rotations istemal karta hai kisi bhi tarah ke poore reordering ya rebuilding ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the 5-node degenerate tree from this lesson\'s first example (inserting 1 through 5 in order). Confirm its height is 5 by counting the links from root to the deepest node.',
        taskHi: 'Is lesson ke pehle example ki 5-node degenerate tree banao (1 se 5 tak order mein insert karte hue). Root se sabse gehre node tak links ganke confirm karo iski height 5 hai.',
        hint: 'Every node in this specific tree has exactly one child, so height equals the count of nodes.',
        hintHi: 'Is khaas tree ke har node ka bilkul ek bachcha hai, isliye height nodes ki ganti ke barabar hai.',
      },
      {
        task: 'Implement rotateLeft from this lesson and apply it to the 3-node chain 1 -> 2 -> 3 (all right children). Confirm the resulting tree has 2 as its root, with 1 and 3 as its two children, height 2.',
        taskHi: 'Is lesson ka \`rotateLeft\` implement karo aur ise 3-node chain \`1 -> 2 -> 3\` (sab right bachche) par lagu karo. Confirm karo result waali tree ka root \`2\` hai, \`1\` aur \`3\` iske do bachchon ki tarah, height 2.',
        hint: 'Trace each of the three pointer reassignments inside rotateLeft one at a time on paper before running the code.',
        hintHi: '\`rotateLeft\` ke andar teen pointer reassignments mein se har ek ko code chalaane se pehle kaagaz par ek-ek karke trace karo.',
      },
      {
        task: 'Write both inorder(chainBeforeRotation) and inorder(rotatedTree) and confirm they produce the identical array, directly verifying this lesson\'s proof that the rotation preserved the BST invariant.',
        taskHi: 'Dono \`inorder(chainBeforeRotation)\` aur \`inorder(rotatedTree)\` likho aur confirm karo wo identical array banaate hain, seedhe is lesson ka proof verify karte hue ki rotation ne BST invariant preserve kiya.',
        hint: 'Reuse the inorder function from this module\'s first lesson unchanged — no modification is needed to use it as a verification tool here.',
        hintHi: 'Is module ke pehle lesson ka \`inorder\` function bina badle dobara istemal karo — ise yahaan verification tool ki tarah istemal karne ke liye koi modification zaruri nahi hai.',
      },
    ],

    keyTakeaways: [
      'This module\'s previous lesson\'s plain BST insert produces a degenerate, height-n tree when values arrive already sorted, degrading search from O(height) back to O(n).',
      'A rotation is a local restructuring operation that changes which node is the local root while only rearranging existing pointers — it never adds, removes, or changes any node\'s value.',
      'This module\'s first lesson\'s fact that inorder traversal of a BST yields sorted output is what proves a rotation preserves the invariant: tracing inorder before and after shows an identical sequence.',
      'rotateLeft promotes a node\'s right child to fix right-heavy leaning; rotateRight is its exact mirror image, promoting the left child to fix left-heavy leaning.',
      'Real self-balancing trees (AVL trees, red-black trees) track a balance factor at every node and apply the appropriate rotation automatically after every insert or delete, keeping height close to log(n).',
      'Understanding what a rotation does and why it provably preserves the BST invariant is the depth genuinely expected in most interviews — a full from-scratch AVL implementation is a much rarer, deeper ask.',
    ],
    keyTakeawaysHi: [
      'Is module ke pichhle lesson ka saadhaaran BST insert ek degenerate, height-n tree banaata hai jab values pehle se sorted aati hain, search ko \`O(height)\` se wapas \`O(n)\` tak degrade karte hue.',
      'Ek rotation ek local restructuring operation hai jo badalta hai kaun sa node local root hai sirf maujood pointers ko rearrange karte hue — ye kabhi kisi node ki value nahi jodta, hataata, ya badalta.',
      'Is module ke pehle lesson ka tathya ki ek BST ka inorder traversal sorted output banaata hai wo hai jo saabit karta hai ek rotation invariant preserve karta hai: pehle aur baad mein inorder trace karna ek identical sequence darsaata hai.',
      'rotateLeft ek node ke right bachche ko promote karta hai right-heavy jhukaav theek karne ke liye; rotateRight iska bilkul mirror image hai, left bachche ko promote karta hai left-heavy jhukaav theek karne ke liye.',
      'Asli self-balancing trees (AVL trees, red-black trees) har node par ek balance factor track karte hain aur sahi rotation automatically har insert ya delete ke baad lagu karte hain, height ko \`log(n)\` ke kareeb rakhte hue.',
      'Ye samajhna ki ek rotation kya karta hai aur ye provably BST invariant kyun preserve karta hai wo gehraayi hai jo adhikaansh interviews mein sach mein expect ki jaati hai — ek poori shuru-se AVL implementation ek bahut zyaada durlabh, gehri maang hai.',
    ],
  },
];
