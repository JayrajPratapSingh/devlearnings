/**
 * DSA Complete Course — Module 9: Graphs, lesson 3.
 *
 * DFS on a general graph, and detecting cycles. Builds on this course's Module 6
 * (recursion and the call stack) and this module's lesson 2 (the visited set).
 * Broken example: trying to detect a cycle in a DIRECTED graph with only a
 * plain visited set — "have I seen this node before?" — which reports a cycle
 * whenever a node is reachable by two different forward paths (a diamond shape),
 * even though a diamond has no cycle at all. Fixed by tracking, in addition to
 * "fully finished" nodes, the set of nodes currently ON the recursion stack (the
 * path from the DFS root down to where we are now): an edge that points back to
 * a node still on that stack is a genuine cycle (a "back edge"); an edge to a
 * node that is merely finished is not. For an UNDIRECTED graph the fix is
 * different — ignore the single edge back to the parent you just came from, and
 * any OTHER visited neighbour means a cycle.
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

export const DSA_MODULE_9_PART3: CourseLesson[] = [
  {
    slug: 'graph-dfs-cycle-detection',
    title: 'DFS on a Graph: Cycle Detection and the Recursion Stack',
    titleHi: 'Graph Par DFS: Cycle Detection Aur Recursion Stack',
    description: 'Detecting a cycle in a directed graph by asking only "have I visited this node before?". In a diamond — A points to B and C, and B and C both point to D — node D gets visited twice along two different forward paths, and the plain check wrongly shouts "cycle" even though you can never get back to where you started.',
    descriptionHi: 'Ek directed graph mein ek cycle detect karna sirf ye poochkar "kya maine ye node pehle visit kiya?". Ek diamond mein — A, B aur C ki taraf point karta hai, aur B aur C dono D ki taraf point karte hain — node D do alag forward paths par do baar visit hota hai, aur plain check galat "cycle" chillaata hai chahe aap kabhi wapas wahaan nahi pahunch sakte jahaan aap shuru hue.',
    difficulty: 'HARD',
    duration: 26,
    order: 3,

    analogy: {
      en: '**Tracing your family history back through parents, and asking whether anyone is their own ancestor.** You start with yourself and walk up: your mother, her father, his mother, and so on. As long as you only ever move to a parent, you are walking a single chain upward — that chain is the "stack" of people between you and whoever you are looking at right now. A real cycle would mean you eventually reach someone who is already on that upward chain: you are somehow your own great-grandfather, which is impossible for real ancestry but is exactly what a cycle in a graph looks like. Now here is the trap. Two of your ancestors can share a common ancestor further back — your mother\'s line and your father\'s line might both lead to the same great-great-grandmother. When you reach her the second time, along the second line, that is NOT a cycle: she is not on your *current* upward chain, she is just someone you already finished tracing on a different branch. The way to tell the difference is to keep two separate marks: one for "this person is on the chain I am currently climbing" and one for "this person is someone I have fully finished with". Reaching a person of the first kind is a cycle. Reaching a person of the second kind is just a shared ancestor, and you can stop and move on.',
      hi: '**Apna parivaar itihaas parents ke through peechhe trace karna, aur poochna ki kya koi apna khud ka poorvaj hai.** Aap khud se shuru karte ho aur upar chalte ho: aapki maa, unke pita, unki maa, aur aise hi. Jab tak aap sirf ek parent par jaate ho, aap ek akeli chain upar chal rahe ho — wo chain aapke aur jise aap abhi dekh rahe ho unke beech logon ka "stack" hai. Ek asli cycle matlab hoga ki aap aakhirkaar kisi aise vyakti tak pahunchte ho jo pehle se us upar wali chain par hai: aap kisi tarah apne khud ke par-dada ho, jo asli poorvaj ke liye asambhav hai par bilkul wahi hai jo ek graph mein cycle jaisa dikhta hai. Ab yahaan jaal hai. Aapke do poorvajon ka ek saanjha poorvaj aur peechhe ho sakta hai — aapki maa ki line aur aapke pita ki line dono usi par-par-dadi tak le jaa sakti hain. Jab aap un tak doosri baar pahunchte ho, doosri line par, wo ek cycle NAHI hai: wo aapki *current* upar wali chain par nahi hai, wo bas koi hai jise aap pehle se ek alag branch par trace kar chuke ho. Farak batane ka tarika do alag marks rakhna hai: ek "ye vyakti us chain par hai jo main abhi chad raha hoon" ke liye aur ek "ye vyakti koi hai jise maine poori tarah khatam kar diya" ke liye. Pehli kism ke ek vyakti tak pahunchna ek cycle hai. Doosri kism ke ek vyakti tak pahunchna bas ek saanjha poorvaj hai, aur aap ruk kar aage badh sakte ho.',
    },

    simple: `**Start broken.** Detect a cycle in a directed graph using only a visited set:

\`\`\`js
function hasCycleBroken(adj, numNodes) {
  const visited = new Set();
  function dfs(node) {
    if (visited.has(node)) return true;   // "seen before" -> claim a cycle
    visited.add(node);
    for (const next of adj[node]) if (dfs(next)) return true;
    return false;
  }
  for (let s = 0; s < numNodes; s++) if (!visited.has(s) && dfs(s)) return true;
  return false;
}

// The DIAMOND:  0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3   (adj = [[1,2],[3],[3],[]])
// This has NO cycle — every edge points "forward", you can never return to 0.
// But hasCycleBroken reports true: DFS goes 0 -> 1 -> 3, marks 3 visited,
// backtracks, goes 0 -> 2 -> 3, sees 3 is visited, and wrongly declares a cycle.
\`\`\`

The plain visited set cannot distinguish "I reached this node again by a second forward path" (fine) from "I reached this node by looping back around" (a real cycle). Both look like "already visited".

**The fix: also track the nodes currently on the recursion stack**

\`\`\`js
function hasCycle(adj, numNodes) {
  const WHITE = 0, GRAY = 1, BLACK = 2;   // unseen / on the current path / fully done
  const color = new Array(numNodes).fill(WHITE);

  function dfs(node) {
    color[node] = GRAY;                    // entering: put it on the current path
    for (const next of adj[node]) {
      if (color[next] === GRAY) return true;         // back edge -> real cycle
      if (color[next] === WHITE && dfs(next)) return true;
      // color[next] === BLACK -> already fully explored, not a cycle, skip
    }
    color[node] = BLACK;                   // leaving: done with this node and its subtree
    return false;
  }

  for (let s = 0; s < numNodes; s++) {
    if (color[s] === WHITE && dfs(s)) return true;
  }
  return false;
}
\`\`\`

\`\`\`ts
function hasCycle(adj: number[][], numNodes: number): boolean {
  const color = new Array<number>(numNodes).fill(0); // 0 white, 1 gray, 2 black
  const dfs = (node: number): boolean => {
    color[node] = 1;
    for (const next of adj[node]!) {
      if (color[next] === 1) return true;
      if (color[next] === 0 && dfs(next)) return true;
    }
    color[node] = 2;
    return false;
  };
  for (let s = 0; s < numNodes; s++) if (color[s] === 0 && dfs(s)) return true;
  return false;
}
\`\`\`

A node is **GRAY** exactly while the DFS call for it is still on the call stack — that is, while it lies on the current root-to-here path. This course's Module 6 lesson established that a recursive call sits on the stack until it returns; \`color[node] = GRAY\` at entry and \`= BLACK\` right before returning mirror that lifetime exactly. An edge to a GRAY node points back up the current path — that is a cycle. An edge to a BLACK node points into a region already fully explored and finished — no cycle. The diamond now correctly returns \`false\`: when DFS reaches \`3\` the second time, \`3\` is BLACK, not GRAY.`,

    simpleHi: `**Toote hue se shuru.** Sirf ek visited set istemal karke ek directed graph mein ek cycle detect karo:

\`\`\`js
function hasCycleBroken(adj, numNodes) {
  const visited = new Set();
  function dfs(node) {
    if (visited.has(node)) return true;   // "pehle dekha" -> ek cycle daawa karo
    visited.add(node);
    for (const next of adj[node]) if (dfs(next)) return true;
    return false;
  }
  for (let s = 0; s < numNodes; s++) if (!visited.has(s) && dfs(s)) return true;
  return false;
}

// DIAMOND:  0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3   (adj = [[1,2],[3],[3],[]])
// Ismein KOI cycle nahi — har edge "aage" point karta hai, aap kabhi 0 par wapas nahi aa sakte.
// Par hasCycleBroken true report karta hai: DFS 0 -> 1 -> 3 jaata hai, 3 ko visited mark karta hai,
// backtrack karta hai, 0 -> 2 -> 3 jaata hai, dekhta hai 3 visited hai, aur galat ek cycle ghoshit karta hai.
\`\`\`

Plain visited set "main is node par ek doosre forward path se dobara pahuncha" (theek) ko "main is node par loop hokar wapas pahuncha" (ek asli cycle) se alag nahi kar sakta. Dono "pehle se visited" jaise dikhte hain.

**Fix: abhi recursion stack par jo nodes hain unhe bhi track karo**

\`\`\`js
function hasCycle(adj, numNodes) {
  const WHITE = 0, GRAY = 1, BLACK = 2;   // andekha / current path par / poori tarah done
  const color = new Array(numNodes).fill(WHITE);

  function dfs(node) {
    color[node] = GRAY;                    // pravesh: ise current path par rakho
    for (const next of adj[node]) {
      if (color[next] === GRAY) return true;         // back edge -> asli cycle
      if (color[next] === WHITE && dfs(next)) return true;
      // color[next] === BLACK -> pehle se poori tarah explore, cycle nahi, skip
    }
    color[node] = BLACK;                   // nikalte hue: is node aur iske subtree se done
    return false;
  }

  for (let s = 0; s < numNodes; s++) {
    if (color[s] === WHITE && dfs(s)) return true;
  }
  return false;
}
\`\`\`

\`\`\`ts
function hasCycle(adj: number[][], numNodes: number): boolean {
  const color = new Array<number>(numNodes).fill(0); // 0 white, 1 gray, 2 black
  const dfs = (node: number): boolean => {
    color[node] = 1;
    for (const next of adj[node]!) {
      if (color[next] === 1) return true;
      if (color[next] === 0 && dfs(next)) return true;
    }
    color[node] = 2;
    return false;
  };
  for (let s = 0; s < numNodes; s++) if (color[s] === 0 && dfs(s)) return true;
  return false;
}
\`\`\`

Ek node **GRAY** bilkul tab tak hai jab tak iske liye DFS call abhi bhi call stack par hai — matlab, jab tak ye current root-se-yahaan path par hai. Is course ke Module 6 lesson ne sthaapit kiya ki ek recursive call stack par tab tak baithti hai jab tak ye return nahi hoti; pravesh par \`color[node] = GRAY\` aur return karne se theek pehle \`= BLACK\` us lifetime ko bilkul mirror karte hain. Ek GRAY node tak ek edge current path ke upar wapas point karta hai — wo ek cycle hai. Ek BLACK node tak ek edge ek aise region mein point karta hai jo pehle se poori tarah explore aur khatam ho chuka hai — koi cycle nahi. Diamond ab sahi \`false\` return karta hai: jab DFS \`3\` par doosri baar pahunchta hai, \`3\` BLACK hai, GRAY nahi.`,

    content: `## The three colors, and what each edge type means

\`\`\`
WHITE : not yet discovered
GRAY  : discovered, DFS call still on the stack (on the current path)
BLACK : discovered, DFS call has returned (this node and everything below it is done)

Edge from the current node to a...
  WHITE node -> a "tree edge"; recurse into it
  GRAY  node -> a "back edge"; it points to an ancestor on the current path -> CYCLE
  BLACK node -> a "forward" or "cross" edge; harmless, the target is fully explored
\`\`\`

The only edge that indicates a cycle in a directed graph is a back edge — an edge to a node whose DFS call has not yet returned. That is the precise meaning of "you can follow edges from here and end up back where you are standing". The diamond's second edge into \`3\` is a cross edge (\`3\` is BLACK by then), which is why it is not a cycle.

## Undirected graphs need a different rule: ignore the parent

\`\`\`js
function hasCycleUndirected(adj, numNodes) {
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const next of adj[node]) {
      if (next === parent) continue;          // the edge we just came in on — not a cycle
      if (visited.has(next)) return true;     // any OTHER visited neighbour -> cycle
      if (dfs(next, node)) return true;
    }
    return false;
  }
  for (let s = 0; s < numNodes; s++) if (!visited.has(s) && dfs(s, -1)) return true;
  return false;
}
\`\`\`

In an undirected graph, every edge exists in both directions, so from node \`B\` you will always see an edge straight back to the \`A\` you came from — that is not a cycle, it is the same edge. The fix is to pass the parent down and skip exactly that one edge. Any *other* already-visited neighbour genuinely closes a loop. Note this does not need the GRAY/BLACK distinction: in an undirected DFS, every visited non-parent neighbour is necessarily an ancestor on the current path, so a plain visited set plus the parent check is enough.

## DFS iteratively, with an explicit stack

\`\`\`js
function dfsIterative(adj, start) {
  const stack = [start];
  const visited = new Set();
  const order = [];
  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    // push neighbours in reverse so they pop in the original order
    for (let i = adj[node].length - 1; i >= 0; i--) stack.push(adj[node][i]);
  }
  return order;
}
\`\`\`

This course's Module 6 established that recursion IS a stack. The iterative version makes that stack explicit — useful when the graph is deep enough to overflow the call stack (a chain of 100,000 nodes will), which is a real risk on large graphs that this course's Module 6 lesson on recursion depth warned about. The iterative version above marks visited on pop, so it can hold duplicates like the wasteful BFS from lesson 2; marking on push avoids that.

## DFS discovers connected components for free

\`\`\`js
function countComponents(adj, numNodes) {
  const visited = new Set();
  let components = 0;
  function dfs(node) {
    visited.add(node);
    for (const next of adj[node]) if (!visited.has(next)) dfs(next);
  }
  for (let s = 0; s < numNodes; s++) {
    if (!visited.has(s)) { components++; dfs(s); }   // each new DFS root = a new component
  }
  return components;
}
\`\`\`

Every time the outer loop starts a fresh DFS from an unvisited node, that node was unreachable from everything explored so far — so it begins a new connected component. This is the same "loop over all start nodes" guard the cycle detector uses, repurposed to count islands.`,

    contentHi: `## Teen colors, aur har edge type ka kya matlab hai

\`\`\`
WHITE : abhi tak discover nahi
GRAY  : discovered, DFS call abhi bhi stack par (current path par)
BLACK : discovered, DFS call return ho chuki (ye node aur iske neeche sab kuch done)

Current node se ek... tak edge
  WHITE node -> ek "tree edge"; ismein recurse karo
  GRAY  node -> ek "back edge"; current path par ek ancestor ki taraf point karta hai -> CYCLE
  BLACK node -> ek "forward" ya "cross" edge; harmless, target poori tarah explored
\`\`\`

Ekmatra edge jo ek directed graph mein cycle darsata hai wo ek back edge hai — ek edge ek aise node tak jiski DFS call abhi return nahi hui. Wo bilkul "aap yahaan se edges follow kar sakte ho aur wapas wahaan pahunch sakte ho jahaan aap khade ho" ka matlab hai. Diamond ka \`3\` mein doosra edge ek cross edge hai (\`3\` tab tak BLACK hai), yahi wajah hai ki ye cycle nahi hai.

## Undirected graphs ko ek alag rule chahiye: parent ko ignore karo

\`\`\`js
function hasCycleUndirected(adj, numNodes) {
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const next of adj[node]) {
      if (next === parent) continue;          // wo edge jispar hum abhi aaye — cycle nahi
      if (visited.has(next)) return true;     // koi DOOSRA visited neighbour -> cycle
      if (dfs(next, node)) return true;
    }
    return false;
  }
  for (let s = 0; s < numNodes; s++) if (!visited.has(s) && dfs(s, -1)) return true;
  return false;
}
\`\`\`

Ek undirected graph mein, har edge dono directions mein maujood hai, isliye node \`B\` se aap hamesha seedhe wapas us \`A\` tak ek edge dekhoge jahaan se aap aaye — wo ek cycle nahi hai, wo wahi edge hai. Fix parent ko neeche pass karna aur bilkul us ek edge ko skip karna hai. Koi bhi *doosra* pehle-se-visited neighbour sach mein ek loop band karta hai. Dhyaan do ise GRAY/BLACK farak nahi chahiye: ek undirected DFS mein, har visited non-parent neighbour zaroori roop se current path par ek ancestor hai, isliye ek plain visited set plus parent check kaafi hai.

## DFS iteratively, ek explicit stack ke saath

\`\`\`js
function dfsIterative(adj, start) {
  const stack = [start];
  const visited = new Set();
  const order = [];
  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    // neighbours ko reverse mein push karo taaki wo original order mein pop hon
    for (let i = adj[node].length - 1; i >= 0; i--) stack.push(adj[node][i]);
  }
  return order;
}
\`\`\`

Is course ke Module 6 ne sthaapit kiya ki recursion ek stack HAI. Iterative version us stack ko explicit banaata hai — upyogi jab graph itna gehra ho ki call stack overflow ho jaaye (100,000 nodes ki ek chain karegi), jo bade graphs par ek asli risk hai jiski is course ke Module 6 ke recursion depth lesson ne chetaavni di. Upar ka iterative version pop par visited mark karta hai, isliye ye lesson 2 ke wasteful BFS ki tarah duplicates rakh sakta hai; push par mark karna use avoid karta hai.

## DFS connected components ko muft mein discover karta hai

\`\`\`js
function countComponents(adj, numNodes) {
  const visited = new Set();
  let components = 0;
  function dfs(node) {
    visited.add(node);
    for (const next of adj[node]) if (!visited.has(next)) dfs(next);
  }
  for (let s = 0; s < numNodes; s++) {
    if (!visited.has(s)) { components++; dfs(s); }   // har naya DFS root = ek naya component
  }
  return components;
}
\`\`\`

Har baar jab outer loop ek unvisited node se ek fresh DFS shuru karta hai, wo node ab tak explore ki gayi har cheez se unreachable tha — isliye ye ek naya connected component shuru karta hai. Ye wahi "sab start nodes par loop" guard hai jo cycle detector istemal karta hai, islands ginne ke liye repurpose kiya gaya.`,

    examples: [
      {
        title: 'Broken: plain visited set flags a diamond as a cycle',
        titleHi: 'Toota: plain visited set ek diamond ko cycle flag karta hai',
        code: `if (visited.has(node)) return true; // can't tell "second path" from "loop back"`,
        codeJs: `function hasCycleBroken(adj, n) {
  const visited = new Set();
  function dfs(node) {
    if (visited.has(node)) return true;
    visited.add(node);
    for (const next of adj[node]) if (dfs(next)) return true;
    return false;
  }
  for (let s = 0; s < n; s++) if (!visited.has(s) && dfs(s)) return true;
  return false;
}
console.log(hasCycleBroken([[1,2],[3],[3],[]], 4)); // true — WRONG, the diamond is acyclic`,
        codeTs: `function hasCycleBroken(adj: number[][], n: number): boolean {
  const visited = new Set<number>();
  const dfs = (node: number): boolean => {
    if (visited.has(node)) return true;
    visited.add(node);
    for (const next of adj[node]!) if (dfs(next)) return true;
    return false;
  };
  for (let s = 0; s < n; s++) if (!visited.has(s) && dfs(s)) return true;
  return false;
}`,
        output: `true`,
        explain: 'DFS visits 3 via 0->1->3, then again via 0->2->3. The second visit is a separate forward path, not a loop, but a plain visited set reports both the same way.',
        explainHi: 'DFS 3 ko 0->1->3 se dekhta hai, phir dobara 0->2->3 se. Doosra visit ek alag forward path hai, ek loop nahi, par ek plain visited set dono ko ek hi tarah report karta hai.',
      },
      {
        title: 'Fixed: WHITE/GRAY/BLACK — a cycle is a back edge to a GRAY node',
        titleHi: 'Theek: WHITE/GRAY/BLACK — ek cycle ek GRAY node tak ek back edge hai',
        code: `color[node] = GRAY;
for (next of adj[node]) {
  if (color[next] === GRAY) return true;  // back edge = cycle
  if (color[next] === WHITE && dfs(next)) return true;
}
color[node] = BLACK;`,
        codeJs: `function hasCycle(adj, n) {
  const color = new Array(n).fill(0); // 0 W, 1 G, 2 B
  function dfs(node) {
    color[node] = 1;
    for (const next of adj[node]) {
      if (color[next] === 1) return true;
      if (color[next] === 0 && dfs(next)) return true;
    }
    color[node] = 2;
    return false;
  }
  for (let s = 0; s < n; s++) if (color[s] === 0 && dfs(s)) return true;
  return false;
}
console.log(hasCycle([[1,2],[3],[3],[]], 4)); // false — diamond, correct
console.log(hasCycle([[1],[2],[0]], 3));      // true  — 0->1->2->0, a real cycle`,
        codeTs: `function hasCycle(adj: number[][], n: number): boolean {
  const color = new Array<number>(n).fill(0);
  const dfs = (node: number): boolean => {
    color[node] = 1;
    for (const next of adj[node]!) {
      if (color[next] === 1) return true;
      if (color[next] === 0 && dfs(next)) return true;
    }
    color[node] = 2;
    return false;
  };
  for (let s = 0; s < n; s++) if (color[s] === 0 && dfs(s)) return true;
  return false;
}`,
        outputJs: `false
true`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'GRAY marks nodes whose DFS call is still on the stack — the current path. An edge to a GRAY node loops back on that path (a cycle). An edge to a BLACK node targets a finished region (not a cycle).',
        explainHi: 'GRAY un nodes ko mark karta hai jinki DFS call abhi stack par hai — current path. Ek GRAY node tak ek edge us path par wapas loop karta hai (ek cycle). Ek BLACK node tak ek edge ek khatam region ko target karta hai (cycle nahi).',
      },
      {
        title: 'Undirected cycle detection: skip the parent edge',
        titleHi: 'Undirected cycle detection: parent edge skip karo',
        code: `if (next === parent) continue;        // the edge we came in on
if (visited.has(next)) return true;   // any other visited neighbour = cycle`,
        codeJs: `function hasCycleUndirected(adj, n) {
  const visited = new Set();
  function dfs(node, parent) {
    visited.add(node);
    for (const next of adj[node]) {
      if (next === parent) continue;
      if (visited.has(next)) return true;
      if (dfs(next, node)) return true;
    }
    return false;
  }
  for (let s = 0; s < n; s++) if (!visited.has(s) && dfs(s, -1)) return true;
  return false;
}
// path 0-1-2 (no cycle):
console.log(hasCycleUndirected([[1],[0,2],[1]], 3));       // false
// triangle 0-1-2-0:
console.log(hasCycleUndirected([[1,2],[0,2],[0,1]], 3));   // true`,
        codeTs: `function hasCycleUndirected(adj: number[][], n: number): boolean {
  const visited = new Set<number>();
  const dfs = (node: number, parent: number): boolean => {
    visited.add(node);
    for (const next of adj[node]!) {
      if (next === parent) continue;
      if (visited.has(next)) return true;
      if (dfs(next, node)) return true;
    }
    return false;
  };
  for (let s = 0; s < n; s++) if (!visited.has(s) && dfs(s, -1)) return true;
  return false;
}`,
        outputJs: `false
true`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Because every undirected edge is bidirectional, the edge straight back to the parent is not a cycle. Skip exactly that one; any other visited neighbour genuinely closes a loop.',
        explainHi: 'Kyunki har undirected edge do-tarfa hai, seedhe wapas parent tak ka edge ek cycle nahi hai. Bilkul us ek ko skip karo; koi bhi doosra visited neighbour sach mein ek loop band karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// directed cycle detection with only a visited set (no GRAY state)
if (visited.has(next)) return true;`,
        right: `if (color[next] === GRAY) return true;   // only a node still on the stack
if (color[next] === WHITE && dfs(next)) return true;`,
        why: 'A visited node might be on the current path (cycle) or a fully finished node reached by a second forward path (not a cycle). Only the GRAY state means "still on the current path".',
        whyHi: 'Ek visited node current path par ho sakta hai (cycle) ya ek doosre forward path se pahuncha ek poori tarah khatam node (cycle nahi). Sirf GRAY state ka matlab "abhi current path par" hai.',
      },
      {
        wrong: `// forgetting to set BLACK when leaving a node
color[node] = GRAY;
for (const next of adj[node]) { ... }
// missing: color[node] = BLACK;  -> node stays GRAY forever`,
        right: `color[node] = GRAY;
for (const next of adj[node]) { ... }
color[node] = BLACK;   // this node's whole subtree is done`,
        why: 'If a node is never set BLACK, a later unrelated path that reaches it sees GRAY and reports a false cycle. GRAY must be cleared to BLACK the instant the DFS call for that node finishes.',
        whyHi: 'Agar ek node kabhi BLACK nahi hota, ek baad ka asambandhit path jo ispar pahunchta hai GRAY dekhta hai aur ek jhoothi cycle report karta hai. GRAY ko BLACK karna chahiye jis pal us node ki DFS call khatam hoti hai.',
      },
      {
        wrong: `// undirected: treating ANY visited neighbour as a cycle, including the parent
for (const next of adj[node]) {
  if (visited.has(next)) return true; // fires on the edge back to parent
}`,
        right: `for (const next of adj[node]) {
  if (next === parent) continue;
  if (visited.has(next)) return true;
}`,
        why: 'Every undirected edge appears in both endpoints\' lists, so node B always sees an edge back to its parent A. That single edge is not a cycle and must be skipped explicitly.',
        whyHi: 'Har undirected edge dono endpoints ki lists mein aata hai, isliye node B hamesha apne parent A tak ek edge dekhta hai. Wo ek edge ek cycle nahi hai aur use explicitly skip karna chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Build tools and package managers detect dependency cycles this way** — if module A imports B which imports A, the graph has a back edge, and the tool reports a circular-dependency error instead of looping forever.',
        hi: '**Build tools aur package managers dependency cycles is tarah detect karte hain** — agar module A, B import karta hai jo A import karta hai, graph mein ek back edge hai, aur tool hamesha loop karne ke bajaye ek circular-dependency error report karta hai.',
      },
      {
        en: '**Spreadsheet engines run cycle detection before recalculating** — if cell A1 = B1 + 1 and B1 = A1 + 1, that is a back edge, and the app shows a circular-reference warning rather than recomputing endlessly.',
        hi: '**Spreadsheet engines dobara calculate karne se pehle cycle detection chalaate hain** — agar cell A1 = B1 + 1 aur B1 = A1 + 1, wo ek back edge hai, aur app anant dobara compute karne ke bajaye ek circular-reference warning dikhaata hai.',
      },
      {
        en: '**Deadlock detection in databases and operating systems** builds a "who is waiting for whom" graph and looks for a cycle — a cycle means a set of processes each blocked on the next, forever.',
        hi: '**Databases aur operating systems mein deadlock detection** ek "kaun kiske liye wait kar raha hai" graph banaata hai aur ek cycle dhoondhta hai — ek cycle matlab processes ka ek set har ek agle par blocked, hamesha ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'For directed-graph cycle detection, why is a plain visited set not enough, and what specifically does the GRAY (on-the-stack) state add?',
        qHi: 'Directed-graph cycle detection ke liye, ek plain visited set kaafi kyun nahi, aur GRAY (stack-par) state khaas taur par kya jodta hai?',
        a: 'A cycle in a directed graph means: starting from some node, you can follow directed edges and arrive back at that same node. During a DFS, "arriving back at a node you are still in the middle of processing" is exactly an edge to a node whose DFS call has not returned yet. A plain visited set records every node the DFS has ever touched, but it lumps together two very different situations. The first is a node that is an ancestor of the current node in the DFS tree — its call is still open, sitting below the current call on the stack, and there is a path of edges from it down to the current node. An edge from the current node back to it closes that path into a loop: a genuine cycle. The second is a node that the DFS fully finished exploring earlier, on some other branch, and then returned from. Its call is closed. An edge to it just means two different parts of the graph both point into the same already-explored region — a diamond, a re-convergence, but not a loop, because you cannot get from that finished node back to the current node. The GRAY state marks exactly the first kind: a node is GRAY from the moment its DFS call begins until the moment that call returns, which is precisely the interval during which it is an open ancestor on the current path. BLACK marks the second kind. So the rule becomes exact: an edge to a GRAY node is a cycle, an edge to a BLACK node is not, and the plain visited set failed only because it could not draw that line.',
        aHi: 'Ek directed graph mein ek cycle matlab: kisi node se shuru karke, aap directed edges follow kar sakte ho aur usi node par wapas pahunch sakte ho. Ek DFS ke dauraan, "ek aise node par wapas pahunchna jise process karne ke beech mein aap abhi bhi ho" bilkul ek aise node tak edge hai jiski DFS call abhi return nahi hui. Ek plain visited set har node record karta hai jise DFS ne kabhi chhua, par ye do bahut alag situations ko ek saath rakhta hai. Pehli ek node hai jo DFS tree mein current node ka ancestor hai — iski call abhi bhi khuli hai, stack par current call ke neeche baithi, aur ismein se neeche current node tak edges ka ek path hai. Current node se ispar wapas ek edge us path ko ek loop mein band karta hai: ek asli cycle. Doosri ek node hai jise DFS ne pehle poori tarah explore kiya, kisi doosri branch par, aur phir usse return hua. Iski call band hai. Ispar ek edge bas matlab graph ke do alag hisse dono usi pehle-se-explored region mein point karte hain — ek diamond, ek re-convergence, par ek loop nahi, kyunki aap us khatam node se wapas current node tak nahi pahunch sakte. GRAY state bilkul pehli kism ko mark karta hai: ek node GRAY hai jis pal iski DFS call shuru hoti hai us pal se jis pal wo call return hoti hai, jo bilkul wo interval hai jiske dauraan ye current path par ek khula ancestor hai. BLACK doosri kism ko mark karta hai. Toh rule thik-thik ban jaata hai: ek GRAY node tak ek edge ek cycle hai, ek BLACK node tak ek edge nahi, aur plain visited set sirf isliye fail hua kyunki ye wo line nahi kheench saka.',
      },
      {
        q: 'Undirected cycle detection uses a plain visited set plus a "skip the parent" check, with no GRAY state. Why is that sufficient there but not for directed graphs?',
        qHi: 'Undirected cycle detection ek plain visited set plus ek "parent skip karo" check istemal karta hai, koi GRAY state nahi. Wo wahaan kaafi kyun hai par directed graphs ke liye nahi?',
        a: 'The GRAY state exists to distinguish an edge to an ancestor still on the current path from an edge to a node that was finished on a different branch. In a directed graph both are possible: you can reach a fully finished node through a fresh forward path, because directed edges do not let you come back. In an undirected DFS that second situation cannot arise. Consider any neighbour of the current node that has already been visited. Since the graph is undirected, there is an edge between them in both directions. If that neighbour were a node finished on some other branch, then when the DFS was exploring that neighbour it would have seen the edge to the current node and, since the current node was not yet visited at that time, it would have recursed into the current node right then — meaning the current node would have been explored as part of that neighbour\'s subtree, not reached independently later. The only way the current node is being reached now, independently, is if that visited neighbour is actually an ancestor: still on the path from the DFS root to here. So in an undirected graph every visited neighbour other than the immediate parent is necessarily a back edge to an ancestor, which is necessarily a cycle. The parent itself is the one exception, because the edge back to the parent is just the same undirected edge you walked in on, not a second connection. That is why skipping the parent and treating any other visited neighbour as a cycle is exactly right, and no GRAY bookkeeping is needed.',
        aHi: 'GRAY state ek aise ancestor tak edge ko jo abhi current path par hai ek aise node tak edge se alag karne ke liye maujood hai jo ek alag branch par khatam hua. Ek directed graph mein dono sambhav hain: aap ek poori tarah khatam node par ek fresh forward path se pahunch sakte ho, kyunki directed edges aapko wapas nahi aane dete. Ek undirected DFS mein wo doosri situation ho hi nahi sakti. Current node ke kisi bhi neighbour par vichaar karo jo pehle se visited hai. Kyunki graph undirected hai, unke beech dono directions mein ek edge hai. Agar wo neighbour kisi doosri branch par khatam ek node hota, toh jab DFS us neighbour ko explore kar raha tha ye current node tak edge dekhta aur, kyunki current node us samay abhi visited nahi tha, ye tabhi current node mein recurse hota — matlab current node us neighbour ke subtree ke hisse ki tarah explore hota, baad mein swatantra roop se pahuncha nahi jaata. Current node ab, swatantra roop se, pahuncha jaa raha hai iska ekmatra tarika ye hai ki wo visited neighbour asal mein ek ancestor hai: abhi bhi DFS root se yahaan tak ke path par. Toh ek undirected graph mein immediate parent ke alaava har visited neighbour zaroori roop se ek ancestor tak ek back edge hai, jo zaroori roop se ek cycle hai. Parent khud ek apvaad hai, kyunki parent tak wapas ka edge bas wahi undirected edge hai jispar aap andar aaye, ek doosra connection nahi. Yahi wajah hai ki parent ko skip karna aur kisi bhi doosre visited neighbour ko ek cycle maanna bilkul sahi hai, aur koi GRAY bookkeeping nahi chahiye.',
      },
    ],

    exercises: [
      {
        task: 'Implement hasCycle (directed, WHITE/GRAY/BLACK). Test on the diamond [[1,2],[3],[3],[]] (expect false), a triangle [[1],[2],[0]] (expect true), and a DAG with a long path plus a shortcut [[1,2],[3],[3],[4],[]] (expect false).',
        taskHi: 'hasCycle implement karo (directed, WHITE/GRAY/BLACK). Diamond [[1,2],[3],[3],[]] (expect false), ek triangle [[1],[2],[0]] (expect true), aur ek long path plus ek shortcut waale DAG [[1,2],[3],[3],[4],[]] (expect false) par test karo.',
        hint: 'Print the color array whenever you return true, so you can see exactly which GRAY node the back edge pointed at.',
        hintHi: 'Jab bhi aap true return karo color array print karo, taaki aap bilkul dekh sako ki back edge kaunse GRAY node ki taraf point kar raha tha.',
      },
      {
        task: 'Implement hasCycleUndirected with the parent check. Test on a path 0-1-2-3, a triangle 0-1-2-0, and a "figure eight" (two triangles sharing one node).',
        taskHi: 'parent check ke saath hasCycleUndirected implement karo. Ek path 0-1-2-3, ek triangle 0-1-2-0, aur ek "figure eight" (ek node share karte hue do triangles) par test karo.',
        hint: 'Build each graph as a proper undirected adjacency list (every edge in both directions). Pass -1 as the parent for each DFS root.',
        hintHi: 'Har graph ko ek proper undirected adjacency list ki tarah banao (har edge dono directions mein). Har DFS root ke liye parent ki tarah -1 pass karo.',
      },
      {
        task: 'Implement countComponents(adj, numNodes). Test on a graph with 7 nodes and edges [[0,1],[1,2],[4,5]] (undirected) — expected 3 components: {0,1,2}, {3}, {4,5,6}.',
        taskHi: 'countComponents(adj, numNodes) implement karo. 7 nodes aur edges [[0,1],[1,2],[4,5]] (undirected) waale ek graph par test karo — expected 3 components: {0,1,2}, {3}, {4,5,6}.',
        hint: 'The outer loop over all nodes is the key: every time it finds an unvisited node, that is a new component, and one DFS from there marks the whole component visited.',
        hintHi: 'Sab nodes par outer loop kunji hai: har baar jab ye ek unvisited node dhoondhta hai, wo ek naya component hai, aur wahaan se ek DFS poore component ko visited mark karta hai.',
      },
    ],

    keyTakeaways: [
      'DFS on a graph needs a visited set (like BFS) — but directed cycle detection needs more than "visited": it needs to know which nodes are still on the current recursion path.',
      'Use three states: WHITE (unseen), GRAY (DFS call on the stack — on the current path), BLACK (DFS call returned — fully explored). Set GRAY on entry, BLACK right before returning.',
      'A directed cycle is a "back edge": an edge from the current node to a GRAY node. An edge to a BLACK node is a second forward path (a diamond), not a cycle.',
      'For undirected graphs, GRAY/BLACK is unnecessary: pass the parent down, skip the single edge back to it, and any other visited neighbour is a cycle.',
      'DFS is recursion, which is a stack (Module 6) — an explicit-stack iterative version avoids call-stack overflow on very deep graphs.',
      'Looping DFS over every start node, counting each fresh DFS root, counts connected components in O(V + E).',
    ],
    keyTakeawaysHi: [
      'Ek graph par DFS ko ek visited set chahiye (BFS ki tarah) — par directed cycle detection ko "visited" se zyaada chahiye: use ye jaanna chahiye ki kaunse nodes abhi current recursion path par hain.',
      'Teen states istemal karo: WHITE (andekha), GRAY (DFS call stack par — current path par), BLACK (DFS call return ho gayi — poori tarah explored). Pravesh par GRAY, return karne se theek pehle BLACK set karo.',
      'Ek directed cycle ek "back edge" hai: current node se ek GRAY node tak ek edge. Ek BLACK node tak ek edge ek doosra forward path hai (ek diamond), ek cycle nahi.',
      'Undirected graphs ke liye, GRAY/BLACK zaroori nahi: parent ko neeche pass karo, ispar wapas ka ek edge skip karo, aur koi bhi doosra visited neighbour ek cycle hai.',
      'DFS recursion hai, jo ek stack hai (Module 6) — ek explicit-stack iterative version bahut gehre graphs par call-stack overflow avoid karta hai.',
      'Har start node par DFS loop karna, har fresh DFS root ginte hue, O(V + E) mein connected components ginta hai.',
    ],
  },
];
