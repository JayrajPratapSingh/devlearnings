/**
 * DSA Complete Course — Module 7: Trees, lesson 2.
 *
 * BFS (breadth-first search / level-order) versus DFS (depth-first
 * search). Directly builds on this course's Module 5 lessons on
 * stacks and queues: BFS is implemented with a Queue (FIFO — the
 * first node discovered is the first one explored), while DFS is
 * implemented either with explicit recursion (which Module 6 already
 * established uses the call stack, an implicit Stack) or with an
 * explicit Stack (LIFO — the most recently discovered node is
 * explored next, diving deep before backtracking). Broken example:
 * using DFS to find the node closest to the root matching some
 * condition, which can return a WRONG (farther) match because DFS
 * dives fully down one branch before ever checking a shallower branch.
 * Fixed by switching to BFS, which explores level-by-level and
 * therefore guarantees the very first match found is genuinely the
 * closest one.
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

export const DSA_MODULE_7_PART2: CourseLesson[] = [
  {
    slug: 'bfs-vs-dfs-tree-traversal',
    title: 'BFS vs DFS: Level-by-Level Versus Dive-Deep-First',
    titleHi: 'BFS vs DFS: Level-by-Level Versus Pehle-Gehraayi-Mein-Doobna',
    description: 'This course\'s Module 5 lessons established a Queue as FIFO (the first item added is the first removed) and a Stack as LIFO (the most recently added item is removed first). BFS explores a tree using a Queue; DFS explores it using a Stack (either explicit, or implicit via recursion, as this course\'s Module 6 lesson established).',
    descriptionHi: 'Is course ke Module 5 lessons ne ek Queue ko FIFO ki tarah sthaapit kiya (pehli item jo jodi gayi pehli hataayi jaati hai) aur ek Stack ko LIFO ki tarah (sabse haal mein jodi gayi item pehle hataayi jaati hai). BFS ek tree ko Queue istemal karke explore karta hai; DFS ise Stack istemal karke explore karta hai (ya toh explicit, ya recursion ke zariye implicit, jaisa is course ke Module 6 lesson ne sthaapit kiya).',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Searching a multi-floor building for a specific office, two different ways.** The first way: walk the ENTIRE first floor, checking every office on it, before ever taking the stairs up to the second floor — only once the whole first floor is confirmed checked does anyone move up to start on the second floor, and so on upward, floor by complete floor. This is exactly BFS: explore everything at the current depth (the current "floor" of the tree) fully before moving on to the next depth. The second way: pick a direction on the first floor, walk into the very first office, and if it has an inner door leading further in, immediately go through it, and through the next inner door after that, diving as deep as possible along one single path before ever backing up to try a different direction. This is exactly DFS: follow one branch all the way down to its deepest point before backtracking to explore a different branch. Both approaches genuinely visit every office eventually, and Module 5\'s Queue and Stack are precisely what make each strategy work: BFS uses a Queue to remember "which floor to check next, in the order floors were discovered" (FIFO — the first floor discovered is the first one explored), while DFS uses a Stack (or recursion, which Module 6 showed is a Stack in disguise) to remember "which office to backtrack to" (LIFO — the most recently entered, still-unexplored door is the next one tried).',
      hi: '**Ek multi-floor building mein ek khaas office dhoondhna, do alag tarikon se.** Pehla tarika: POORI pehli floor par chalo, ispar har office check karte hue, doosri floor tak jaane ke liye seedhiyaan chadhne se pehle — sirf jab poori pehli floor check ki gayi confirm ho jaati hai tab koi doosri floor par shuru karne ke liye upar jaata hai, aur aise hi upar, floor by poori floor. Ye bilkul BFS hai: current depth (tree ki current "floor") par sab kuch poori tarah explore karo agli depth par jaane se pehle. Doosra tarika: pehli floor par ek disha chuno, bilkul pehle office mein chalo, aur agar iska ek andaruni darwaaza hai jo aage le jaata hai, turant ispar se guzro, aur uske baad agle andaruni darwaaze se, ek akeli path ke saath jitna gehra ho sake doobte hue kisi alag disha ki koshish karne ke liye wapas aane se pehle. Ye bilkul DFS hai: ek branch ko iske sabse gehre point tak poori tarah follow karo kisi alag branch ko explore karne ke liye backtrack karne se pehle. Dono approaches sach mein aakhirkaar har office dekhte hain, aur Module 5 ka Queue aur Stack bilkul wahi hai jo har strategy ko kaam karata hai: BFS ek Queue istemal karta hai "aage kaun si floor check karni hai, floors discover hone ke order mein" yaad rakhne ke liye (FIFO — pehli floor jo discover hui pehli explore ki jaati hai), jabki DFS ek Stack (ya recursion, jise Module 6 ne darsaaya ek chhupa hua Stack hai) istemal karta hai "kaun se office par backtrack karna hai" yaad rakhne ke liye (LIFO — sabse haal mein pravesh kiya gaya, abhi bhi na-explore kiya gaya darwaaza agla try kiya jaata hai).',
    },

    simple: `**The same tree, explored two different ways:**

\`\`\`
        1
       / \\
      2   7
     / \\
    3   4
   /
  5
\`\`\`

**Start broken.** A specific goal: find the shallowest node (closest to the root) whose value is greater than 4. Using DFS (recursive, depth-first — dive into \`left\` fully before trying \`right\`):

\`\`\`js
function dfsFind(node, predicate) {
  if (node === null) return null;
  if (predicate(node.value)) return node; // check current node
  return dfsFind(node.left, predicate) || dfsFind(node.right, predicate);
}
console.log(dfsFind(root, v => v > 4)?.value); // 5 — but is this really the CLOSEST match?
\`\`\`

This finds \`5\`, at depth 3, because DFS dives all the way down the \`left\` branch first (\`1 → 2 → 3 → 5\`) and returns the moment it hits a match. But node \`7\` — sitting right there at depth 1, a direct child of the root and a much shallower match — was never checked at all, because DFS was still busy diving to the bottom of the left branch when it found \`5\` and returned. For a goal that specifically wants the SHALLOWEST matching node, DFS's dive-deep-first strategy genuinely cannot guarantee that: the first match it happens to reach is wherever its dive order takes it, not wherever the shallowest match actually is.

**The fix: BFS, using a Queue exactly as this course's Module 5 lesson defined it**

\`\`\`js
function bfsFind(root, predicate) {
  const queue = [root];         // Module 5's Queue: FIFO
  while (queue.length > 0) {
    const node = queue.shift(); // dequeue — remove from the FRONT
    if (node === null) continue;
    if (predicate(node.value)) return node; // first match found IS the shallowest
    queue.push(node.left);      // enqueue — add to the BACK
    queue.push(node.right);
  }
  return null;
}
console.log(bfsFind(root, v => v > 4)?.value); // 7 — genuinely the shallowest match
\`\`\`

\`\`\`ts
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function bfsFind(root: TreeNode | null, predicate: (v: number) => boolean): TreeNode | null {
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift() ?? null;
    if (node === null) continue;
    if (predicate(node.value)) return node;
    queue.push(node.left);
    queue.push(node.right);
  }
  return null;
}
\`\`\`

BFS returns \`7\`, at depth 1 — the genuinely shallowest node whose value matches. This is exactly the point: BFS visits nodes strictly in order of increasing depth — \`1\` first (depth 0), then \`2\` and \`7\` (depth 1), then \`3\` and \`4\` (depth 2), then \`5\` (depth 3) — checking the predicate against each one in that exact depth order. So the very first match it finds is GUARANTEED to be at the shallowest depth where any match exists, because every shallower depth was already checked in full and found to contain no match. DFS's dive-first exploration order can make no such promise.`,

    simpleHi: `**Wahi tree, do alag tarikon se explore kiya gaya:**

\`\`\`
        1
       / \\
      2   7
     / \\
    3   4
   /
  5
\`\`\`

**Toote hue se shuru.** Ek khaas lakshya: sabse chhichhla node dhoondho (root ke sabse kareeb) jiski value 4 se badi hai. DFS istemal karke (recursive, depth-first — \`left\` mein poori tarah doobna \`right\` try karne se pehle):

\`\`\`js
function dfsFind(node, predicate) {
  if (node === null) return null;
  if (predicate(node.value)) return node; // current node check karo
  return dfsFind(node.left, predicate) || dfsFind(node.right, predicate);
}
console.log(dfsFind(root, v => v > 4)?.value); // 5 — par kya ye sach mein SABSE KAREEB match hai?
\`\`\`

Ye \`5\` dhoondhta hai, depth 3 par, kyunki DFS pehle poori tarah \`left\` branch mein neeche doobta hai (\`1 → 2 → 3 → 5\`) aur jis pal ek match milta hai us pal return kar deta hai. Par node \`7\` — wahaan depth 1 par baitha, root ka ek seedha bachcha aur ek kaafi zyaada chhichhla match — bilkul check nahi kiya gaya, kyunki DFS abhi bhi left branch ke tale tak doobne mein vyast tha jab use \`5\` mila aur wo return ho gaya. Ek lakshya ke liye jo khaas taur par SABSE CHHICHHLA matching node chahta hai, DFS ki pehle-gehraayi-mein-doobne ki strategy sach mein guarantee nahi kar sakti: pehla match jise ye samyog se pahunchta hai wahaan hota hai jahaan iska dive order ise le jaata hai, wahaan nahi jahaan sabse chhichhla match asal mein hai.

**Fix: BFS, ek Queue istemal karke bilkul jaisa is course ke Module 5 lesson ne define kiya**

\`\`\`js
function bfsFind(root, predicate) {
  const queue = [root];         // Module 5 ka Queue: FIFO
  while (queue.length > 0) {
    const node = queue.shift(); // dequeue — SAAMNE se hataao
    if (node === null) continue;
    if (predicate(node.value)) return node; // pehla match jo mila WOHI sabse chhichhla hai
    queue.push(node.left);      // enqueue — PEECHE jodo
    queue.push(node.right);
  }
  return null;
}
console.log(bfsFind(root, v => v > 4)?.value); // 7 — sach mein sabse chhichhla match
\`\`\`

\`\`\`ts
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function bfsFind(root: TreeNode | null, predicate: (v: number) => boolean): TreeNode | null {
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift() ?? null;
    if (node === null) continue;
    if (predicate(node.value)) return node;
    queue.push(node.left);
    queue.push(node.right);
  }
  return null;
}
\`\`\`

BFS \`7\` return karta hai, depth 1 par — sach mein sabse chhichhla node jiski value match karti hai. Ye bilkul point hai: BFS nodes ko strictly badhti hui depth ke order mein dekhta hai — \`1\` pehle (depth 0), phir \`2\` aur \`7\` (depth 1), phir \`3\` aur \`4\` (depth 2), phir \`5\` (depth 3) — har ek ke khilaaf predicate check karte hue bilkul us depth order mein. Isliye pehla match jo ye dhoondhta hai GUARANTEED hai sabse chhichhli depth par jahaan koi bhi match maujood hai, kyunki har chhichhli depth pehle se poori tarah check ki jaa chuki thi aur usme koi match nahi mila. DFS ka pehle-doobne ka exploration order aisa koi vaada nahi kar sakta.`,

    content: `## Implementing DFS with an explicit Stack, not just recursion

\`\`\`js
function dfsIterative(root) {
  const stack = [root];       // Module 5's Stack: LIFO
  const visited = [];
  while (stack.length > 0) {
    const node = stack.pop(); // remove from the SAME end items are added to
    if (node === null) continue;
    visited.push(node.value);
    stack.push(node.left);    // pushed, but not explored until popped
    stack.push(node.right);
  }
  return visited;
}
\`\`\`

This course's Module 6 lesson already established that recursion IS an implicit stack — every recursive call pushes a new frame onto the actual call stack, and returning pops it back off. The \`dfsIterative\` function above makes that implicit stack explicit: instead of relying on JavaScript's own call stack via recursive calls, it maintains its own array and calls \`.pop()\` (removing from the end, LIFO) directly, exactly as this course's Module 5 lesson defined a Stack. Both the recursive DFS shown earlier and this explicit-stack version explore nodes in the same fundamental order — diving deep along one path before backtracking — because both are, in substance, driven by a LIFO structure; one uses it implicitly (the call stack), the other explicitly (a plain array).

## Why BFS's queue and DFS's stack produce genuinely different orders from the identical starting point

\`\`\`
BFS (Queue, FIFO): after visiting 1, its children 2 and 7 are enqueued.
  2 is dequeued NEXT (it was enqueued first) — 2's children (3, 4) are
  enqueued AFTER 7 is already waiting in the queue. So the order is:
  1, 2, 7, 3, 4, 5 — strictly by depth.

DFS (Stack, LIFO): after visiting 1, its children 2 and 7 are pushed.
  7 or 2 (whichever was pushed last) is popped NEXT, and that node's
  OWN children are pushed and explored before returning to the
  sibling pushed earlier. The order dives deep along one branch first.
\`\`\`

The queue's FIFO discipline means a node discovered earlier (like \`7\`, discovered when processing \`1\`) is always explored before a node discovered later (like \`3\`, discovered when processing \`2\`, which itself was only reached after \`7\` was already waiting) — this is precisely what forces BFS into strict depth-by-depth order. The stack's LIFO discipline means a node discovered most recently is explored next, which is exactly what allows DFS to keep diving deeper along whichever branch it most recently entered, rather than fanning out level by level.

## When to reach for BFS versus DFS

\`\`\`
BFS: shortest path in an unweighted tree/graph, "closest matching node",
     level-order processing (this module's next lesson on binary search
     trees will use ordering properties DFS naturally respects instead)

DFS: exploring every path fully (this module's tries and this course's
     later graph module both lean on DFS), backtracking-style search
     (this course's Module 6 backtracking lesson), when memory for the
     frontier matters (DFS's stack holds at most the tree's height;
     BFS's queue can hold an entire tree level, which can be far larger)
\`\`\`

Neither approach is universally "better" — they solve genuinely different problems well. BFS's guarantee of finding the shallowest match first makes it the correct default whenever "closest" or "fewest steps" is part of the actual goal. DFS's ability to fully commit to one path before trying another makes it the natural fit whenever a problem needs to explore an entire branch to completion — exactly the shape this course's Module 6 backtracking lesson already relied on.`,

    contentHi: `## DFS ko explicit Stack ke saath implement karna, sirf recursion nahi

\`\`\`js
function dfsIterative(root) {
  const stack = [root];       // Module 5 ka Stack: LIFO
  const visited = [];
  while (stack.length > 0) {
    const node = stack.pop(); // usi end se hataao jahaan items jodi jaati hain
    if (node === null) continue;
    visited.push(node.value);
    stack.push(node.left);    // push kiya gaya, par pop hone tak explore nahi kiya
    stack.push(node.right);
  }
  return visited;
}
\`\`\`

Is course ke Module 6 lesson ne pehle hi sthaapit kiya ki recursion ek implicit stack HAI — har recursive call asli call stack par ek nayi frame push karta hai, aur return hona ise wapas pop karta hai. Upar ka \`dfsIterative\` function us implicit stack ko explicit banaata hai: JavaScript ke apne call stack par recursive calls ke zariye nirbhar hone ke bajaye, ye apna khud ka array maintain karta hai aur \`.pop()\` seedhe bulaata hai (ant se hataate hue, LIFO), bilkul jaisa is course ke Module 5 lesson ne ek Stack define kiya. Pehle darsaaya recursive DFS aur ye explicit-stack version dono nodes ko usi bunyaadi order mein explore karte hain — ek path ke saath gehraayi mein doobte hue backtrack karne se pehle — kyunki dono, saar mein, ek LIFO structure se chalaaye jaate hain; ek ise implicitly istemal karta hai (call stack), doosra explicitly (ek saadhaaran array).

## BFS ka queue aur DFS ka stack bilkul usi shuruaati point se sach mein alag orders kyun banaate hain

\`\`\`
BFS (Queue, FIFO): 1 dekhne ke baad, iske bachche 2 aur 7 enqueue kiye
  jaate hain. 2 AGLA dequeue kiya jaata hai (ye pehle enqueue kiya gaya
  tha) — 2 ke bachche (3, 4) enqueue kiye jaate hain BAAD mein jab 7
  pehle se queue mein wait kar raha hai. Toh order hai:
  1, 2, 7, 3, 4, 5 — strictly depth ke hisaab se.

DFS (Stack, LIFO): 1 dekhne ke baad, iske bachche 2 aur 7 push kiye
  jaate hain. 7 ya 2 (jo bhi aakhri push kiya gaya) AGLA pop kiya jaata
  hai, aur us node ke KHUD ke bachche push aur explore kiye jaate hain
  pehle push kiye gaye sibling par wapas jaane se pehle. Order pehle ek
  branch mein gehraayi mein doobta hai.
\`\`\`

Queue ka FIFO discipline matlab hai ek pehle discover ki gayi node (jaisa \`7\`, \`1\` process karte waqt discover ki gayi) hamesha ek baad mein discover ki gayi node (jaisa \`3\`, \`2\` process karte waqt discover ki gayi, jo khud sirf tab pahunchi jab \`7\` pehle se wait kar raha tha) se pehle explore ki jaati hai — ye bilkul wo hai jo BFS ko strict depth-by-depth order mein majboor karta hai. Stack ka LIFO discipline matlab hai sabse haal mein discover ki gayi node agli explore ki jaati hai, jo bilkul wo hai jo DFS ko jis bhi branch mein ye sabse haal mein pravesh kiya usme gehraayi mein doobte rehne allow karta hai, level by level phailne ke bajaye.

## BFS versus DFS ke liye kab pahunchna hai

\`\`\`
BFS: ek unweighted tree/graph mein shortest path, "sabse kareeb
     matching node", level-order processing (is module ka agla lesson
     binary search trees par ordering properties istemal karega jinhe
     DFS naturally respect karta hai iske bajaye)

DFS: har path ko poori tarah explore karna (is module ke tries aur is
     course ke baad ke graph module dono DFS par nirbhar karte hain),
     backtracking-style search (is course ka Module 6 backtracking
     lesson), jab frontier ke liye memory matter karti hai (DFS ka
     stack zyaada se zyaada tree ki height rakhta hai; BFS ka queue
     poora tree level rakh sakta hai, jo kaafi bada ho sakta hai)
\`\`\`

Koi bhi approach universal roop se "behtar" nahi hai — wo sach mein alag problems ko achhi tarah solve karte hain. BFS ki sabse chhichhla match pehle dhoondhne ki guarantee ise sahi default banaati hai jab bhi "kareeb" ya "kam se kam steps" asli lakshya ka hissa hai. DFS ki ek path ko poori tarah commit karne ki kshamata doosre try karne se pehle ise natural fit banaati hai jab bhi ek problem ko ek poori branch ko poora hone tak explore karna hai — bilkul wo shape jise is course ka Module 6 backtracking lesson pehle hi nirbhar karta tha.`,

    examples: [
      {
        title: 'Broken: DFS used to find the "closest" matching node',
        titleHi: 'Toota: DFS "sabse kareeb" matching node dhoondhne ke liye istemal',
        code: `return dfsFind(node.left, predicate) || dfsFind(node.right, predicate);`,
        codeJs: `function dfsFind(node, predicate) {
  if (node === null) return null;
  if (predicate(node.value)) return node;
  return dfsFind(node.left, predicate) || dfsFind(node.right, predicate);
}
console.log(dfsFind(root, v => v > 4)?.value); // 5 (depth 3) — not the shallowest match`,
        codeTs: `interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
function dfsFind(node: TreeNode | null, predicate: (v: number) => boolean): TreeNode | null {
  if (node === null) return null;
  if (predicate(node.value)) return node;
  return dfsFind(node.left, predicate) || dfsFind(node.right, predicate);
}`,
        output: `5 — DFS dove all the way down the left branch (1 → 2 → 3 → 5) and
returned at the first match, depth 3, without ever checking node 7,
a matching node sitting at depth 1 on the right side of the root.`,
        explain: 'DFS commits fully to the left branch before trying the right branch at all, so it cannot guarantee the first match it finds is the shallowest one.',
        explainHi: 'DFS poori tarah left branch ko commit karta hai right branch try karne se pehle, isliye ye guarantee nahi kar sakta ki pehla match jo ye dhoondhta hai sabse chhichhla hai — yahaan ye 5 (depth 3) lautata hai jabki 7 (depth 1) ek zyaada chhichhla match hai.',
      },
      {
        title: 'Fixed: BFS, using a Queue to guarantee shallowest-first',
        titleHi: 'Theek: BFS, ek Queue istemal karke sabse-chhichhla-pehle guarantee karte hue',
        code: `const node = queue.shift(); // dequeue — FIFO
if (predicate(node.value)) return node;
queue.push(node.left);
queue.push(node.right);`,
        codeJs: `function bfsFind(root, predicate) {
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === null) continue;
    if (predicate(node.value)) return node;
    queue.push(node.left);
    queue.push(node.right);
  }
  return null;
}
console.log(bfsFind(root, v => v > 4)?.value); // 7 (depth 1) — genuinely shallowest`,
        codeTs: `function bfsFind(root: TreeNode | null, predicate: (v: number) => boolean): TreeNode | null {
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
    const node = queue.shift() ?? null;
    if (node === null) continue;
    if (predicate(node.value)) return node;
    queue.push(node.left);
    queue.push(node.right);
  }
  return null;
}`,
        outputJs: `7 — BFS checks nodes strictly in depth order (1, then 2 and 7,
then 3 and 4, then 5), so the first match found is guaranteed shallowest.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The Queue\'s FIFO order ensures every node at the current depth is checked before any node at the next depth, guaranteeing the shallowest match is found first.',
        explainHi: 'Queue ka FIFO order sunishchit karta hai ki current depth par har node check ki jaati hai agli depth par kisi bhi node se pehle, sabse chhichhla match pehle dhoondha jaana guarantee karte hue.',
      },
      {
        title: 'DFS made explicit with a Stack, instead of relying on recursion',
        titleHi: 'DFS ko ek Stack ke saath explicit banaaya gaya, recursion par nirbhar hone ke bajaye',
        code: `const node = stack.pop(); // LIFO — same end as push
stack.push(node.left);
stack.push(node.right);`,
        codeJs: `function dfsIterative(root) {
  const stack = [root];
  const visited = [];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === null) continue;
    visited.push(node.value);
    stack.push(node.left);
    stack.push(node.right);
  }
  return visited;
}`,
        codeTs: `function dfsIterative(root: TreeNode | null): number[] {
  const stack: (TreeNode | null)[] = [root];
  const visited: number[] = [];
  while (stack.length > 0) {
    const node = stack.pop() ?? null;
    if (node === null) continue;
    visited.push(node.value);
    stack.push(node.left);
    stack.push(node.right);
  }
  return visited;
}`,
        outputJs: `Explores in a dive-deep-first order, identical in spirit to
recursive DFS — because both are driven by a LIFO structure,
one implicit (the call stack) and one explicit (this array).`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Replacing recursive calls with an explicit array and .pop() makes the LIFO structure driving DFS visible, rather than hidden inside JavaScript\'s own call stack.',
        explainHi: 'Recursive calls ko ek explicit array aur \`.pop()\` se badalna DFS ko chalaane waali LIFO structure ko drishyaman banaata hai, JavaScript ke apne call stack ke andar chhupe hone ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `// Using recursive DFS to find the "nearest" or "shallowest" match
return dfsFind(node.left, predicate) || dfsFind(node.right, predicate);`,
        right: `// Using BFS with a Queue whenever "shallowest" or "shortest" matters
queue.push(node.left);
queue.push(node.right);`,
        why: 'DFS commits fully to one branch before trying another, so it cannot guarantee the first match found is the shallowest — only BFS\'s strict depth-by-depth order can guarantee that.',
        whyHi: 'DFS ek branch ko poori tarah commit karta hai doosri try karne se pehle, isliye ye guarantee nahi kar sakta ki pehla match jo mila sabse chhichhla hai — sirf BFS ka strict depth-by-depth order ye guarantee kar sakta hai.',
      },
      {
        wrong: `const node = queue.pop(); // WRONG end for a queue — this is LIFO, not FIFO`,
        right: `const node = queue.shift(); // correct — removes from the FRONT, genuinely FIFO`,
        why: 'Using .pop() on an array meant to act as a Queue removes from the wrong end, silently turning it into a Stack and breaking BFS\'s depth-by-depth guarantee entirely.',
        whyHi: 'Ek array par \`.pop()\` istemal karna jo Queue ki tarah act karne ke liye tha galat end se hataata hai, chupchaap ise ek Stack mein badalta hai aur BFS ke depth-by-depth guarantee ko poori tarah todta hai.',
      },
      {
        wrong: `function dfsIterative(root) {
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.shift(); // WRONG end for a stack — this is FIFO, not LIFO
    ...
  }
}`,
        right: `const node = stack.pop(); // correct — removes from the SAME end as push, genuinely LIFO`,
        why: 'Using .shift() on an array meant to act as a Stack removes from the wrong end, silently turning the explicit-stack DFS into BFS instead.',
        whyHi: 'Ek array par \`.shift()\` istemal karna jo Stack ki tarah act karne ke liye tha galat end se hataata hai, chupchaap explicit-stack DFS ko BFS mein badalta hai iske bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**BFS is the standard, correct algorithm for finding the shortest path in an unweighted graph or tree — real routing and social-network "degrees of separation" features rely on it directly.**',
        hi: '**BFS ek unweighted graph ya tree mein shortest path dhoondhne ke liye standard, sahi algorithm hai — asli routing aur social-network "degrees of separation" features seedhe ispar nirbhar karte hain.**',
      },
      {
        en: '**Real file-system search tools (like "find" utilities) typically use DFS by default, since it requires far less memory to track — DFS\'s stack holds at most the depth of the directory tree, while BFS\'s queue can hold an entire level at once.**',
        hi: '**Asli file-system search tools (jaise "find" utilities) typically default roop se DFS istemal karte hain, kyunki track karne ke liye kaafi kam memory chahiye — DFS ka stack zyaada se zyaada directory tree ki depth rakhta hai, jabki BFS ka queue ek poora level ek saath rakh sakta hai.**',
      },
      {
        en: '**Real browser developer tools and DOM-traversal libraries offer both BFS-style and DFS-style tree walking, because different tasks (finding the nearest matching ancestor versus fully processing a subtree) genuinely need different orders.**',
        hi: '**Asli browser developer tools aur DOM-traversal libraries dono BFS-style aur DFS-style tree walking offer karte hain, kyunki alag tasks (sabse kareeb matching ancestor dhoondhna versus ek subtree ko poori tarah process karna) sach mein alag orders chahte hain.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does BFS guarantee finding the shallowest matching node first, while DFS cannot make that same guarantee, even though both algorithms are guaranteed to eventually visit every node in the tree?',
        qHi: 'BFS sabse chhichhla matching node pehle dhoondhna kyun guarantee karta hai, jabki DFS wahi guarantee nahi kar sakta, chahe dono algorithms guarantee karte hain ki wo aakhirkaar tree ke har node ko dekhenge?',
        a: 'BFS maintains a Queue and processes nodes in strict FIFO order: whichever node was discovered (enqueued) earliest is always the next one explored (dequeued), regardless of anything discovered afterward. Because a tree\'s root is discovered first, its direct children are discovered next (while processing the root), its grandchildren after that (while processing the children), and so on, this FIFO discipline forces BFS to fully finish processing every node at the current depth before processing any node at the next depth — there is no way for a node at depth 3 to be dequeued before every single node at depth 2 has already been dequeued, since every depth-3 node is only ever enqueued while processing some depth-2 node, meaning it necessarily enters the queue strictly after every depth-2 node already has. This guarantees that the very first node satisfying some condition that BFS encounters is genuinely at the shallowest depth where any satisfying node exists, because every shallower depth has already been fully and exhaustively checked with no match found by the time BFS reaches that depth. DFS, by contrast, maintains a Stack (explicit or via recursion) and processes nodes in LIFO order: whichever node was discovered most recently is explored next. This means DFS can, and routinely does, fully explore an entire deep branch — reaching nodes at depth 5 or 6 — before ever getting around to checking a sibling branch\'s node at depth 2, simply because that depth-2 sibling was discovered earlier but sits lower in the stack, buried under everything discovered afterward while diving deeper into the first branch. A match found deep in the first branch is therefore no guarantee whatsoever that a shallower match does not exist, still waiting, further down in the stack.',
        aHi: 'BFS ek Queue maintain karta hai aur nodes ko strict FIFO order mein process karta hai: jo bhi node pehle discover ki gayi (enqueue ki gayi) hamesha agli explore ki jaati hai (dequeue), baad mein discover ki gayi kisi bhi cheez ki parwaah kiye bina. Kyunki ek tree ka root pehle discover kiya jaata hai, iske seedhe bachche agle discover kiye jaate hain (root process karte waqt), iske pote-poti uske baad (bachchon ko process karte waqt), aur aise hi aage, ye FIFO discipline BFS ko current depth ke har node ko process karna poori tarah khatam karne ke liye majboor karta hai agli depth par kisi bhi node ko process karne se pehle — depth 2 ke har akele node ke pehle se dequeue ho chuke hone se pehle depth 3 ke ek node ke dequeue hone ka koi tarika nahi hai, kyunki har depth-3 node sirf tab enqueue kiya jaata hai jab kisi depth-2 node ko process kiya jaa raha hai, matlab ye zaroori roop se queue mein strictly har depth-2 node ke pehle se hone ke baad pravesh karta hai. Ye guarantee karta hai ki bilkul pehla node jo kisi condition ko satisfy karta hai jo BFS ko milta hai sach mein sabse chhichhli depth par hai jahaan koi bhi satisfying node maujood hai, kyunki har chhichhli depth pehle se poori tarah aur vistrit roop se check ki jaa chuki hai koi match na milne ke saath jab tak BFS us depth tak pahunchta hai. DFS, iske ulta, ek Stack maintain karta hai (explicit ya recursion ke zariye) aur nodes ko LIFO order mein process karta hai: jo bhi node sabse haal mein discover ki gayi agli explore ki jaati hai. Iska matlab hai DFS poori tarah ek poori gehri branch explore kar sakta hai, aur routine roop se karta hai — depth 5 ya 6 par nodes tak pahunchte hue — kisi sibling branch ke node ko depth 2 par kabhi check karne ke aas-paas aane se pehle, sirf isliye kyunki wo depth-2 sibling pehle discover ki gayi thi par stack mein neeche baithi hai, baad mein discover ki gayi har cheez ke neeche dabi hui jabki pehli branch mein gehraayi mein doobte hue. Pehli branch mein gehraayi mein mila ek match isliye koi guarantee bilkul nahi hai ki ek chhichhla match maujood nahi hai, abhi bhi wait kar raha, stack mein aur neeche.',
      },
      {
        q: 'Both recursive DFS and iterative BFS use some kind of "collection" to track which nodes still need exploring (the call stack for recursive DFS, an explicit array for iterative BFS). Why does simply swapping .pop() for .shift() (or vice versa) on that same array change the algorithm from DFS to BFS or back?',
        qHi: 'Recursive DFS aur iterative BFS dono kisi tarah ka "collection" istemal karte hain track karne ke liye ki kaun se nodes abhi bhi explore karne ki zaroorat hai (recursive DFS ke liye call stack, iterative BFS ke liye ek explicit array). Sirf usi array par \`.pop()\` ko \`.shift()\` (ya ulta) se badalna algorithm ko DFS se BFS ya wapas kyun badal deta hai?',
        a: 'Both iterative DFS and BFS, when written using an explicit array, share an almost identical structure: maintain a collection of "discovered but not yet processed" nodes, repeatedly remove one node from that collection, process it, and add its children to the collection. The ONLY difference between the two algorithms, in this shared structure, is which END of the array items are removed from relative to which end they were added to. Array.push() always adds to the end of the array. Array.pop() also removes from the end of the array — meaning the item removed is always the one most recently added, which is precisely LIFO (last-in, first-out) behavior, and LIFO removal order is what causes an algorithm to dive as deep as possible along whichever branch was most recently discovered before ever returning to an earlier, shallower branch — this is DFS. Array.shift(), in contrast, removes from the FRONT of the array — meaning the item removed is always the one that has been sitting in the array the longest, which is precisely FIFO (first-in, first-out) behavior, and FIFO removal order is what forces an algorithm to fully finish everything discovered earlier (which, in a tree, corresponds to everything at a shallower depth) before ever getting to anything discovered later (anything deeper) — this is BFS. Because the rest of the algorithm (add children of the current node to the collection, repeat until the collection is empty) is completely identical between the two, changing only which end items are removed from is genuinely sufficient, on its own, to flip the entire algorithm\'s exploration order from depth-first to breadth-first or back — nothing else about the code needs to change at all.',
        aHi: 'Iterative DFS aur BFS dono, jab ek explicit array istemal karke likhe jaate hain, lagbhag identical structure share karte hain: "discover ki gayi lekin abhi process nahi ki gayi" nodes ka ek collection maintain karo, baar-baar us collection se ek node hataao, ise process karo, aur iske bachchon ko collection mein jodo. Do algorithms ke beech is shared structure mein SIRF antar ye hai ki items kis END se hataaye jaate hain us end ke saapeksh jahaan wo jodi gayi thin. \`Array.push()\` hamesha array ke ant mein jodta hai. \`Array.pop()\` bhi array ke ant se hataata hai — matlab hataayi gayi item hamesha wo hai jo sabse haal mein jodi gayi, jo bilkul LIFO (last-in, first-out) vyavahaar hai, aur LIFO hataane ka order wo hai jo ek algorithm ko jitna ho sake gehraayi mein doobne ka kaaran banta hai jis bhi branch mein sabse haal mein discover kiya gaya kisi pehle, chhichhli branch par wapas jaane se pehle — ye DFS hai. \`Array.shift()\`, iske ulta, array ke SAAMNE se hataata hai — matlab hataayi gayi item hamesha wo hai jo array mein sabse lambe samay se baithi hai, jo bilkul FIFO (first-in, first-out) vyavahaar hai, aur FIFO hataane ka order wo hai jo ek algorithm ko pehle discover ki gayi har cheez (jo, ek tree mein, har cheez chhichhli depth par ke barabar hai) poori tarah khatam karne ke liye majboor karta hai baad mein discover ki gayi kisi bhi cheez (kuch bhi gehra) tak pahunchne se pehle — ye BFS hai. Kyunki algorithm ka baaki hissa (current node ke bachchon ko collection mein jodo, dohraao jab tak collection khaali nahi hai) dono ke beech poori tarah identical hai, sirf ye badalna ki kis end se items hataayi jaati hain sach mein kaafi hai, apne aap mein, poore algorithm ke exploration order ko depth-first se breadth-first ya wapas palatne ke liye — code ke baare mein aur kuch bhi bilkul badalne ki zaroorat nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the example tree from this lesson (1 at root; 2 and 7 as its children; 3 and 4 under 2; 5 under 3). Run both dfsFind and bfsFind on it with a predicate of v > 4, and confirm you get 5 (depth 3) from DFS and 7 (depth 1) from BFS, matching this lesson\'s trace.',
        taskHi: 'Is lesson ka example tree banao (1 root par; 2 aur 7 iske bachche; 3 aur 4 2 ke neeche; 5 3 ke neeche). Ispar dono \`dfsFind\` aur \`bfsFind\` chalaao ek predicate \`v > 4\` ke saath, aur confirm karo tumhe DFS se 5 (depth 3) aur BFS se 7 (depth 1) milta hai, is lesson ke trace se mel khaate hue.',
        hint: 'Trace the queue\'s and the (implicit) stack\'s contents by hand at each step to see exactly why the two orders diverge.',
        hintHi: 'Queue aur (implicit) stack ki contents ko haath se har step par trace karo ye dekhne ke liye ki do orders bilkul kyun alag hote hain.',
      },
      {
        task: 'Write a function that returns all nodes at a specific depth (e.g., depth 2) using BFS, tracking depth by enqueueing [node, depth] pairs instead of bare nodes.',
        taskHi: 'Ek function likho jo BFS istemal karke ek khaas depth (jaise depth 2) par sab nodes return karta hai, depth track karte hue \`[node, depth]\` pairs enqueue karke sirf nodes ke bajaye.',
        hint: 'When enqueueing a node\'s children, enqueue them with depth + 1, not the same depth as their parent.',
        hintHi: 'Ek node ke bachchon ko enqueue karte waqt, unhe \`depth + 1\` ke saath enqueue karo, unke parent ki wahi depth ke saath nahi.',
      },
      {
        task: 'Deliberately swap .shift() for .pop() inside bfsFind (turning it into an accidental depth-first search), add a line logging each node\'s value as it is removed from the collection, and run it on the example tree. Confirm the log is no longer in depth order (you will see a deeper node visited before a shallower sibling), and build one tree where this swapped version returns a strictly deeper match than the real BFS does.',
        taskHi: 'Jaan-boojhkar \`bfsFind\` ke andar \`.shift()\` ko \`.pop()\` se badlo (ise ek accidental depth-first search mein badalte hue), ek line jodo jo har node ki value log kare jab wo collection se hataayi jaati hai, aur ise example tree par chalaao. Confirm karo ki log ab depth order mein nahi hai (tum ek gehre node ko ek chhichhle sibling se pehle dekhoge), aur ek aisa tree banao jahaan ye swapped version asli BFS se ek strictly gehra match return kare.',
        hint: 'This exercise is designed to make the "which end you remove from is what defines the algorithm" point concrete, not theoretical — the returned value may coincide on a small tree, but the visit order gives the change away immediately.',
        hintHi: 'Ye exercise "tum kis end se hataate ho wahi algorithm define karta hai" point ko thos banaane ke liye design ki gayi hai, theoretical nahi — chhote tree par return value milti-julti ho sakti hai, par visit order badlaav ko turant zaahir kar deta hai.',
      },
    ],

    keyTakeaways: [
      'BFS explores a tree using a Queue (FIFO, as this course\'s Module 5 lesson defined it) and visits nodes strictly in order of increasing depth — every node at the current depth is finished before any node at the next depth.',
      'DFS explores a tree using a Stack (either explicit, or implicit via recursion, as this course\'s Module 6 lesson established) and dives as deep as possible along one branch before backtracking.',
      'BFS guarantees the first matching node found is the shallowest one that matches; DFS cannot make this guarantee, since it may fully explore a deep branch before ever checking a shallower one.',
      'Swapping which end of the same underlying array items are removed from (.shift() versus .pop()) is, on its own, sufficient to flip an algorithm between BFS and DFS — the rest of the code is identical.',
      'BFS is the right default whenever "shortest," "closest," or "fewest steps" is part of the actual goal; DFS is the right default whenever a problem needs to explore one path fully before trying another.',
      'DFS typically uses far less memory than BFS on a wide tree, since its stack holds at most the tree\'s height, while BFS\'s queue can hold an entire tree level at once.',
    ],
    keyTakeawaysHi: [
      'BFS ek tree ko ek Queue (FIFO, jaisa is course ke Module 5 lesson ne define kiya) istemal karke explore karta hai aur nodes ko strictly badhti hui depth ke order mein dekhta hai — current depth ka har node agli depth ke kisi bhi node se pehle khatam kiya jaata hai.',
      'DFS ek tree ko ek Stack (ya toh explicit, ya recursion ke zariye implicit, jaisa is course ke Module 6 lesson ne sthaapit kiya) istemal karke explore karta hai aur ek branch mein jitna ho sake gehraayi mein doobta hai backtrack karne se pehle.',
      'BFS guarantee karta hai ki pehla matching node jo milta hai sabse chhichhla hai jo match karta hai; DFS ye guarantee nahi kar sakta, kyunki ye ek gehri branch ko poori tarah explore kar sakta hai kisi chhichhli ko check karne se pehle.',
      'Usi underlying array ke kis end se items hataaye jaate hain badalna (\`.shift()\` versus \`.pop()\`) apne aap mein, ek algorithm ko BFS aur DFS ke beech palatne ke liye kaafi hai — baaki code identical hai.',
      'BFS sahi default hai jab bhi "sabse chhota," "sabse kareeb," ya "kam se kam steps" asli lakshya ka hissa hai; DFS sahi default hai jab bhi ek problem ko ek path poori tarah explore karna hai doosra try karne se pehle.',
      'DFS typically ek chaudi tree par BFS se kaafi kam memory istemal karta hai, kyunki iska stack zyaada se zyaada tree ki height rakhta hai, jabki BFS ka queue ek poora tree level ek saath rakh sakta hai.',
    ],
  },
];
