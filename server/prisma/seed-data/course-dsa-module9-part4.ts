/**
 * DSA Complete Course — Module 9: Graphs, lesson 4.
 *
 * Topological sort: ordering the nodes of a directed acyclic graph (DAG) so that
 * every edge points from earlier to later — the "do the prerequisites first"
 * ordering. Builds on this module's lesson 3 (cycle detection: a topological
 * order exists if and only if the graph is acyclic) and Module 8 (a queue).
 * Broken example: producing the order by repeatedly scanning ALL nodes for one
 * with no unmet dependencies, emitting it, and rescanning — correct but O(V^2)
 * or worse, and it silently returns a partial/empty result on a cyclic graph
 * with no signal that anything went wrong. Fixed with Kahn's algorithm: compute
 * every node's in-degree once, seed a queue with the in-degree-0 nodes, and each
 * time you pop a node, decrement its neighbours' in-degrees and enqueue any that
 * hit 0. It is O(V + E), and if fewer than V nodes come out, the graph had a
 * cycle — the algorithm detects it as a side effect.
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

export const DSA_MODULE_9_PART4: CourseLesson[] = [
  {
    slug: 'topological-sort-kahn',
    title: 'Topological Sort: Ordering Tasks with Dependencies',
    titleHi: 'Topological Sort: Dependencies Waale Tasks Ko Order Karna',
    description: 'Scheduling build steps where some steps depend on others, by repeatedly scanning the entire list for a step whose dependencies are all done, running it, and scanning again from the top. It produces a valid order, but rescanning every step every round is O(V squared), and on a set of steps that depend on each other in a loop it just silently stops early with no error.',
    descriptionHi: 'Build steps schedule karna jahaan kuch steps doosron par nirbhar karte hain, baar-baar poori list ko ek aise step ke liye scan karke jiski dependencies sab done hain, use chalakar, aur phir top se dobara scan karke. Ye ek valid order banaata hai, par har round har step ko dobara scan karna O(V varg) hai, aur ek loop mein ek doosre par nirbhar steps ke ek set par ye bas chupchaap jaldi ruk jaata hai bina kisi error ke.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Getting dressed, where some items must go on before others.** Socks before shoes, shirt before jacket, underwear before trousers. There is no single "correct" order — you could do shirt, socks, trousers, jacket, shoes, or socks, shirt, trousers, shoes, jacket — but every valid order respects the rules: nothing goes on before the things it depends on. The wasteful way to find an order: look at your whole pile of clothes, pick anything whose prerequisites are already worn, put it on, then start over and look at the whole pile again. The efficient way: first, for each item, count how many not-yet-worn things it is waiting on. Everything with a count of zero can go on right now — put those in a "ready" basket. Each time you put an item on, go to the things that were waiting on it and drop each of their counts by one; any that hit zero go into the ready basket. You never rescan the whole pile; you only ever touch an item when one of its blockers is cleared. And if you ever empty the ready basket while clothes remain, those remaining clothes form a loop of mutual dependencies — you have discovered an impossible outfit.',
      hi: '**Kapde pehanna, jahaan kuch cheezein doosron se pehle pehanni padti hain.** Shoes se pehle socks, jacket se pehle shirt, trousers se pehle underwear. Koi ek "sahi" order nahi hai — aap shirt, socks, trousers, jacket, shoes kar sakte ho, ya socks, shirt, trousers, shoes, jacket — par har valid order rules ka samman karta hai: kuch bhi un cheezon se pehle nahi pehna jaata jinpar wo nirbhar karta hai. Ek order dhoondhne ka faaltu tarika: apne kapdon ke poore dher ko dekho, kuch bhi chuno jiske prerequisites pehle se pehne hain, ise pehno, phir shuru se aur poore dher ko dobara dekho. Efficient tarika: pehle, har cheez ke liye, gino ki ye kitni abhi-tak-na-pehni cheezon ka wait kar rahi hai. Zero count waali har cheez abhi pehni jaa sakti hai — unhe ek "ready" basket mein rakho. Har baar jab aap ek cheez pehante ho, un cheezon par jao jo iska wait kar rahi thin aur har ek ka count ek se ghatao; koi bhi jo zero par pahunche ready basket mein jaati hai. Aap kabhi poore dher ko dobara scan nahi karte; aap sirf tab ek cheez ko chhoote ho jab iska ek blocker clear hota hai. Aur agar aap kabhi ready basket khaali karte ho jabki kapde bache hain, wo bache kapde aapsi dependencies ka ek loop banate hain — aapne ek asambhav outfit discover ki hai.',
    },

    simple: `**Start broken.** Order the nodes of a DAG so every edge points forwards. The naive approach — repeatedly find a node with no remaining incoming edges:

\`\`\`js
function topoSortSlow(adj, numNodes) {
  const remaining = new Set(Array.from({ length: numNodes }, (_, i) => i));
  const order = [];
  while (remaining.size > 0) {
    // scan EVERY remaining node looking for one with no unmet dependency
    let picked = null;
    for (const node of remaining) {
      const hasUnmetDep = [...remaining].some(other => adj[other].includes(node));
      if (!hasUnmetDep) { picked = node; break; }
    }
    if (picked === null) break;   // cycle! but we just... stop, with a partial order
    order.push(picked);
    remaining.delete(picked);
  }
  return order;   // caller has no idea whether this is complete
}
\`\`\`

Two problems. First, every round rescans all remaining nodes and, for each, scans all remaining nodes again to check for an incoming edge — that is O(V^2) at best and O(V^3) with the naive edge check. Second, if the graph has a cycle, the loop hits \`picked === null\` and just \`break\`s, returning a shorter list with no error — the caller cannot tell a valid full order from a truncated one.

**The fix: Kahn's algorithm — in-degree counting with a queue**

\`\`\`js
function topoSort(adj, numNodes) {
  const indegree = new Array(numNodes).fill(0);
  for (let u = 0; u < numNodes; u++) {
    for (const v of adj[u]) indegree[v]++;      // count incoming edges, once
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) if (indegree[i] === 0) queue.push(i);

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      indegree[next]--;                         // this dependency is now satisfied
      if (indegree[next] === 0) queue.push(next); // all deps met -> ready
    }
  }

  if (order.length !== numNodes) return null;   // a cycle blocked some nodes forever
  return order;
}
\`\`\`

\`\`\`ts
function topoSort(adj: number[][], numNodes: number): number[] | null {
  const indegree = new Array<number>(numNodes).fill(0);
  for (let u = 0; u < numNodes; u++) for (const v of adj[u]!) indegree[v]!++;

  const queue: number[] = [];
  for (let i = 0; i < numNodes; i++) if (indegree[i] === 0) queue.push(i);

  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) {
      indegree[next]!--;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return order.length === numNodes ? order : null;
}
\`\`\`

Compute each node's in-degree (number of dependencies) once, in O(V + E). Nodes with in-degree 0 have nothing to wait for, so they start in the queue. Each time you pop a node, you "complete" it and reduce the in-degree of everything that depended on it; anything that drops to 0 is now unblocked and joins the queue. Every node is enqueued once and every edge is relaxed once — O(V + E). And if the final \`order\` is shorter than \`numNodes\`, the leftover nodes are exactly those trapped in or behind a cycle, so returning \`null\` reports that cleanly.`,

    simpleHi: `**Toote hue se shuru.** Ek DAG ke nodes ko order karo taaki har edge aage point kare. Naive approach — baar-baar ek aisa node dhoondho jiske koi baaki incoming edges nahi:

\`\`\`js
function topoSortSlow(adj, numNodes) {
  const remaining = new Set(Array.from({ length: numNodes }, (_, i) => i));
  const order = [];
  while (remaining.size > 0) {
    // HAR remaining node scan karo ek aisa dhoondhne ko jiski koi unmet dependency nahi
    let picked = null;
    for (const node of remaining) {
      const hasUnmetDep = [...remaining].some(other => adj[other].includes(node));
      if (!hasUnmetDep) { picked = node; break; }
    }
    if (picked === null) break;   // cycle! par hum bas... ruk jaate hain, ek partial order ke saath
    order.push(picked);
    remaining.delete(picked);
  }
  return order;   // caller ko koi idea nahi ki ye poora hai ya nahi
}
\`\`\`

Do samasyaayein. Pehli, har round sab remaining nodes ko dobara scan karta hai aur, har ek ke liye, sab remaining nodes ko phir se scan karta hai ek incoming edge check karne ko — wo behtareen mein O(V^2) hai aur naive edge check ke saath O(V^3). Doosri, agar graph mein ek cycle hai, loop \`picked === null\` hit karta hai aur bas \`break\` karta hai, ek chhoti list return karte hue bina kisi error ke — caller ek valid poore order ko ek truncated se alag nahi bata sakta.

**Fix: Kahn ka algorithm — ek queue ke saath in-degree counting**

\`\`\`js
function topoSort(adj, numNodes) {
  const indegree = new Array(numNodes).fill(0);
  for (let u = 0; u < numNodes; u++) {
    for (const v of adj[u]) indegree[v]++;      // incoming edges gino, ek baar
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) if (indegree[i] === 0) queue.push(i);

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      indegree[next]--;                         // ye dependency ab satisfied hai
      if (indegree[next] === 0) queue.push(next); // sab deps met -> ready
    }
  }

  if (order.length !== numNodes) return null;   // ek cycle ne kuch nodes ko hamesha ke liye block kiya
  return order;
}
\`\`\`

\`\`\`ts
function topoSort(adj: number[][], numNodes: number): number[] | null {
  const indegree = new Array<number>(numNodes).fill(0);
  for (let u = 0; u < numNodes; u++) for (const v of adj[u]!) indegree[v]!++;

  const queue: number[] = [];
  for (let i = 0; i < numNodes; i++) if (indegree[i] === 0) queue.push(i);

  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) {
      indegree[next]!--;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return order.length === numNodes ? order : null;
}
\`\`\`

Har node ki in-degree (dependencies ki tadaad) ek baar compute karo, O(V + E) mein. In-degree 0 waale nodes ke paas wait karne ko kuch nahi, isliye wo queue mein shuru karte hain. Har baar jab aap ek node pop karte ho, aap ise "complete" karte ho aur har us cheez ki in-degree kam karte ho jo ispar nirbhar thi; kuch bhi jo 0 par girta hai ab unblocked hai aur queue mein judta hai. Har node ek baar enqueue hota hai aur har edge ek baar relax hota hai — O(V + E). Aur agar antim \`order\` \`numNodes\` se chhota hai, bache nodes bilkul wo hain jo ek cycle mein ya iske peechhe fanse hain, isliye \`null\` return karna use saaf report karta hai.`,

    content: `## Walking through Kahn's algorithm

\`\`\`
Tasks:  0 -> 2,  1 -> 2,  2 -> 3,  1 -> 3        (adj = [[2],[2,3],[3],[]])

in-degree:  0:0   1:0   2:2   3:2

queue starts with all in-degree-0 nodes:  [0, 1]

pop 0  -> order [0].   decrement 2 -> in-degree 1.   nothing hits 0.   queue [1]
pop 1  -> order [0,1]. decrement 2 -> 0 (enqueue), decrement 3 -> 1.   queue [2]
pop 2  -> order [0,1,2]. decrement 3 -> 0 (enqueue).                   queue [3]
pop 3  -> order [0,1,2,3].                                             queue []

order.length === 4 === numNodes  -> valid full order: [0, 1, 2, 3]
\`\`\`

The queue always contains exactly the nodes that are "ready" — every dependency satisfied — and it hands them out oldest-first. Any order the queue could have produced (if 1 had been popped before 0, the result would be [1, 0, 2, 3]) is an equally valid topological order; a DAG usually has many.

## The DFS-based alternative: reverse post-order

\`\`\`js
function topoSortDFS(adj, numNodes) {
  const color = new Array(numNodes).fill(0);   // 0 white, 1 gray, 2 black
  const order = [];
  let cyclic = false;

  function dfs(node) {
    color[node] = 1;
    for (const next of adj[node]) {
      if (color[next] === 1) { cyclic = true; return; }   // back edge (lesson 3)
      if (color[next] === 0) dfs(next);
    }
    color[node] = 2;
    order.push(node);        // add on the way OUT — post-order
  }

  for (let s = 0; s < numNodes; s++) if (color[s] === 0) dfs(s);
  if (cyclic) return null;
  return order.reverse();    // post-order reversed == topological order
}
\`\`\`

This course's Module 6 lesson on recursion ordering is the whole idea: a node is added to \`order\` only *after* all of its descendants have been added (post-order, "code after the recursive call runs on the unwind"). So in the raw \`order\` every node comes after everything it can reach — which is the exact reverse of a topological order, hence the final \`reverse()\`. It reuses the WHITE/GRAY/BLACK cycle check from lesson 3 unchanged.

## Why a topological order exists exactly when the graph is acyclic

\`\`\`
If the graph has a cycle a -> b -> c -> a, then in any ordering:
  a must come before b (edge a -> b)
  b must come before c (edge b -> c)
  c must come before a (edge c -> a)
  => a before a. Impossible. No topological order can exist.

If the graph is acyclic, one always exists: some node has in-degree 0 (or you
could follow incoming edges backwards forever and, with finitely many nodes,
hit a cycle). Emit it, remove it, repeat — the rest is still a DAG.
\`\`\`

This is why Kahn's algorithm doubles as a cycle detector: it emits in-degree-0 nodes until none remain, and if nodes are still unemitted, every one of them has an unsatisfied dependency that traces back into a cycle.

## Lexicographically smallest order: swap the queue for a heap

\`\`\`js
// When ties should be broken by smallest node id, use a min-heap
// (this course's Module 8) instead of a FIFO queue:
const pq = new MinHeap();
for (let i = 0; i < numNodes; i++) if (indegree[i] === 0) pq.insert(i);
while (pq.size() > 0) {
  const node = pq.extractMin();
  order.push(node);
  for (const next of adj[node]) { if (--indegree[next] === 0) pq.insert(next); }
}
// Same O((V + E) log V), but now among all ready nodes the smallest id goes first.
\`\`\``,

    contentHi: `## Kahn ke algorithm ke through chalna

\`\`\`
Tasks:  0 -> 2,  1 -> 2,  2 -> 3,  1 -> 3        (adj = [[2],[2,3],[3],[]])

in-degree:  0:0   1:0   2:2   3:2

queue sab in-degree-0 nodes se shuru:  [0, 1]

pop 0  -> order [0].   2 ko decrement -> in-degree 1.   kuch 0 par nahi.   queue [1]
pop 1  -> order [0,1]. 2 ko decrement -> 0 (enqueue), 3 ko decrement -> 1.  queue [2]
pop 2  -> order [0,1,2]. 3 ko decrement -> 0 (enqueue).                     queue [3]
pop 3  -> order [0,1,2,3].                                                  queue []

order.length === 4 === numNodes  -> valid poora order: [0, 1, 2, 3]
\`\`\`

Queue mein hamesha bilkul wo nodes hote hain jo "ready" hain — har dependency satisfied — aur ye unhe oldest-first deta hai. Koi bhi order jo queue bana sakti thi (agar 1, 0 se pehle pop hota, nateeja [1, 0, 2, 3] hota) ek utna hi valid topological order hai; ek DAG mein aksar bahut hote hain.

## DFS-based vikalp: reverse post-order

\`\`\`js
function topoSortDFS(adj, numNodes) {
  const color = new Array(numNodes).fill(0);   // 0 white, 1 gray, 2 black
  const order = [];
  let cyclic = false;

  function dfs(node) {
    color[node] = 1;
    for (const next of adj[node]) {
      if (color[next] === 1) { cyclic = true; return; }   // back edge (lesson 3)
      if (color[next] === 0) dfs(next);
    }
    color[node] = 2;
    order.push(node);        // nikalte hue add karo — post-order
  }

  for (let s = 0; s < numNodes; s++) if (color[s] === 0) dfs(s);
  if (cyclic) return null;
  return order.reverse();    // post-order reversed == topological order
}
\`\`\`

Is course ke Module 6 ke recursion ordering lesson ka poora idea yahi hai: ek node \`order\` mein sirf *tab* add hota hai jab iske sab descendants add ho chuke hon (post-order, "recursive call ke baad ka code unwind par chalta hai"). Toh raw \`order\` mein har node har us cheez ke baad aata hai jispar ye pahunch sakta hai — jo ek topological order ka bilkul ulta hai, isliye antim \`reverse()\`. Ye lesson 3 ka WHITE/GRAY/BLACK cycle check na-badla reuse karta hai.

## Ek topological order bilkul tab maujood hai jab graph acyclic hai

\`\`\`
Agar graph mein ek cycle a -> b -> c -> a hai, toh kisi bhi ordering mein:
  a ko b se pehle aana chahiye (edge a -> b)
  b ko c se pehle aana chahiye (edge b -> c)
  c ko a se pehle aana chahiye (edge c -> a)
  => a, a se pehle. Asambhav. Koi topological order maujood nahi ho sakta.

Agar graph acyclic hai, ek hamesha maujood hai: kisi node ki in-degree 0 hai (ya aap
incoming edges peechhe hamesha follow kar sakte the aur, seemit nodes ke saath, ek
cycle hit karte). Ise emit karo, hatao, dohraao — baaki abhi bhi ek DAG hai.
\`\`\`

Yahi wajah hai ki Kahn ka algorithm ek cycle detector ki tarah bhi kaam karta hai: ye in-degree-0 nodes emit karta hai jab tak koi na bache, aur agar nodes abhi bhi un-emitted hain, unmein se har ek ki ek unsatisfied dependency hai jo ek cycle mein wapas jaati hai.

## Lexicographically sabse chhota order: queue ko ek heap se badlo

\`\`\`js
// Jab ties sabse chhote node id se break honi chahiye, ek min-heap istemal karo
// (is course ka Module 8) ek FIFO queue ke bajaye:
const pq = new MinHeap();
for (let i = 0; i < numNodes; i++) if (indegree[i] === 0) pq.insert(i);
while (pq.size() > 0) {
  const node = pq.extractMin();
  order.push(node);
  for (const next of adj[node]) { if (--indegree[next] === 0) pq.insert(next); }
}
// Wahi O((V + E) log V), par ab sab ready nodes mein sabse chhoti id pehle jaati hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: rescan-for-a-source — O(V squared) and silent on cycles',
        titleHi: 'Toota: source ke liye dobara-scan — O(V varg) aur cycles par chup',
        code: `while (remaining.size > 0) {
  let picked = [...remaining].find(n => !anyRemainingPointsAt(n));
  if (picked == null) break;   // cycle -> just stop, no error
  order.push(picked); remaining.delete(picked);
}`,
        codeJs: `function topoSortSlow(adj, n) {
  const remaining = new Set([...Array(n).keys()]);
  const order = [];
  while (remaining.size) {
    let picked = null;
    for (const node of remaining) {
      if (![...remaining].some(o => adj[o].includes(node))) { picked = node; break; }
    }
    if (picked === null) break;
    order.push(picked); remaining.delete(picked);
  }
  return order;
}
console.log(topoSortSlow([[1],[2],[0]], 3)); // [] — a 3-cycle, returned silently`,
        codeTs: `function topoSortSlow(adj: number[][], n: number): number[] {
  const remaining = new Set<number>([...Array(n).keys()]);
  const order: number[] = [];
  while (remaining.size) {
    let picked: number | null = null;
    for (const node of remaining) {
      if (![...remaining].some(o => adj[o]!.includes(node))) { picked = node; break; }
    }
    if (picked === null) break;
    order.push(picked); remaining.delete(picked);
  }
  return order;
}`,
        output: `[]`,
        explain: 'Each round rescans all remaining nodes and, per node, rescans again for an incoming edge — O(V squared) or worse. On a cycle it returns a short list with no way for the caller to know it is incomplete.',
        explainHi: 'Har round sab remaining nodes ko dobara scan karta hai aur, prati node, ek incoming edge ke liye phir se scan karta hai — O(V varg) ya kharab. Ek cycle par ye ek chhoti list return karta hai bina caller ke jaanne ke tarike ke ki ye adhoora hai.',
      },
      {
        title: 'Fixed: Kahn\'s algorithm — O(V + E), detects cycles',
        titleHi: 'Theek: Kahn ka algorithm — O(V + E), cycles detect karta hai',
        code: `for (const v of adj[u]) indegree[v]++;
// queue the in-degree-0 nodes; pop one, decrement neighbours, enqueue new zeros`,
        codeJs: `function topoSort(adj, n) {
  const indeg = new Array(n).fill(0);
  for (let u = 0; u < n; u++) for (const v of adj[u]) indeg[v]++;
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) if (--indeg[next] === 0) queue.push(next);
  }
  return order.length === n ? order : null;
}
console.log(topoSort([[2],[2,3],[3],[]], 4)); // [0, 1, 2, 3]
console.log(topoSort([[1],[2],[0]], 3));      // null — cycle detected`,
        codeTs: `function topoSort(adj: number[][], n: number): number[] | null {
  const indeg = new Array<number>(n).fill(0);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) indeg[v]!++;
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) if (--indeg[next]! === 0) queue.push(next);
  }
  return order.length === n ? order : null;
}`,
        outputJs: `[0, 1, 2, 3]
null`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'In-degrees are counted once. Each node is enqueued exactly when its last dependency is removed, so each node and edge is touched once — O(V + E). A short result means a cycle.',
        explainHi: 'In-degrees ek baar gine jaate hain. Har node bilkul tab enqueue hota hai jab iski aakhri dependency hataayi jaati hai, isliye har node aur edge ek baar chhua jaata hai — O(V + E). Ek chhota nateeja matlab ek cycle.',
      },
      {
        title: 'DFS-based topological sort: reversed post-order',
        titleHi: 'DFS-based topological sort: ulta post-order',
        code: `function dfs(node) {
  color[node] = GRAY;
  for (next of adj[node]) if (color[next] === WHITE) dfs(next);
  color[node] = BLACK;
  order.push(node);   // post-order: after all descendants
}
return order.reverse();`,
        codeJs: `function topoSortDFS(adj, n) {
  const color = new Array(n).fill(0);
  const order = [];
  let cyclic = false;
  function dfs(node) {
    color[node] = 1;
    for (const next of adj[node]) {
      if (color[next] === 1) { cyclic = true; return; }
      if (color[next] === 0) dfs(next);
    }
    color[node] = 2;
    order.push(node);
  }
  for (let s = 0; s < n; s++) if (color[s] === 0) dfs(s);
  return cyclic ? null : order.reverse();
}
console.log(topoSortDFS([[2],[2,3],[3],[]], 4)); // e.g. [1, 0, 2, 3]`,
        codeTs: `function topoSortDFS(adj: number[][], n: number): number[] | null {
  const color = new Array<number>(n).fill(0);
  const order: number[] = [];
  let cyclic = false;
  const dfs = (node: number): void => {
    color[node] = 1;
    for (const next of adj[node]!) {
      if (color[next] === 1) { cyclic = true; return; }
      if (color[next] === 0) dfs(next);
    }
    color[node] = 2;
    order.push(node);
  };
  for (let s = 0; s < n; s++) if (color[s] === 0) dfs(s);
  return cyclic ? null : order.reverse();
}`,
        outputJs: `[1, 0, 2, 3]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A node is pushed only after every node it can reach is already pushed (post-order). That raw order is the reverse of a topological order, so reversing it gives a valid one.',
        explainHi: 'Ek node sirf tab push hota hai jab har node jispar ye pahunch sakta hai pehle se push ho chuka hai (post-order). Wo raw order ek topological order ka ulta hai, isliye ise reverse karna ek valid deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// not checking order.length at the end
while (queue.length) { ... }
return order;   // silently returns a partial order when the graph has a cycle`,
        right: `return order.length === numNodes ? order : null;`,
        why: 'A cycle means some nodes never reach in-degree 0 and are never enqueued. The only signal is that fewer than numNodes nodes were emitted — you must check for it explicitly.',
        whyHi: 'Ek cycle matlab kuch nodes kabhi in-degree 0 par nahi pahunchte aur kabhi enqueue nahi hote. Ekmatra signal ye hai ki numNodes se kam nodes emit hue — aapko iske liye explicitly check karna chahiye.',
      },
      {
        wrong: `// computing in-degree by counting each node's OWN adjacency list length
indegree[u] = adj[u].length;   // that is OUT-degree, not in-degree`,
        right: `for (let u = 0; u < numNodes; u++)
  for (const v of adj[u]) indegree[v]++;   // count edges pointing INTO each v`,
        why: 'adj[u].length is how many edges leave u (out-degree). In-degree is how many edges arrive at a node, which you get by scanning every edge and incrementing the destination.',
        whyHi: 'adj[u].length wo hai kitne edges u se nikalte hain (out-degree). In-degree wo hai kitne edges ek node par aate hain, jo aap har edge scan karke aur destination increment karke paate ho.',
      },
      {
        wrong: `// DFS topo sort: adding the node BEFORE recursing (pre-order)
function dfs(node) {
  order.push(node);
  for (const next of adj[node]) if (!visited.has(next)) dfs(next);
}
return order;   // pre-order is NOT a topological order`,
        right: `function dfs(node) {
  for (const next of adj[node]) if (!visited.has(next)) dfs(next);
  order.push(node);   // POST-order
}
return order.reverse();`,
        why: 'Pre-order adds a node before its dependents are known to be placed correctly. Only post-order guarantees every node is added after everything it points to, so reversing post-order gives the valid order.',
        whyHi: 'Pre-order ek node ko iske dependents ke sahi jagah rakhe jaane se pehle add karta hai. Sirf post-order guarantee karta hai ki har node har us cheez ke baad add hota hai jispar ye point karta hai, isliye post-order reverse karna valid order deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Build systems (Make, Bazel, npm scripts, CI pipelines) topologically sort the task graph** to decide what to run and in what order, and report a "cyclic dependency" error when the sort comes up short.',
        hi: '**Build systems (Make, Bazel, npm scripts, CI pipelines) task graph ko topologically sort karte hain** ye tay karne ke liye kya chalaana hai aur kis order mein, aur ek "cyclic dependency" error report karte hain jab sort chhoti aati hai.',
      },
      {
        en: '**Course-prerequisite planners and project schedulers** produce a valid order of classes or milestones with topological sort, and flag impossible curricula (A needs B, B needs A) the same way.',
        hi: '**Course-prerequisite planners aur project schedulers** topological sort se classes ya milestones ka ek valid order banate hain, aur asambhav curricula (A ko B chahiye, B ko A) ko usi tarah flag karte hain.',
      },
      {
        en: '**Spreadsheet and reactive-UI recalculation** orders cells or derived values topologically so each is computed only after everything it reads has been updated.',
        hi: '**Spreadsheet aur reactive-UI recalculation** cells ya derived values ko topologically order karta hai taaki har ek sirf tab compute ho jab har cheez jo ye padhta hai update ho chuki ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain why Kahn\'s algorithm produces a valid topological order, and why a shortfall in the output length is exactly equivalent to the graph containing a cycle.',
        qHi: 'Samjhaao ki Kahn ka algorithm ek valid topological order kyun banaata hai, aur output length mein ek kami bilkul graph mein ek cycle hone ke barabar kyun hai.',
        a: 'The algorithm only ever emits a node when its in-degree has dropped to zero, and a node\'s in-degree is the count of edges still pointing into it from nodes that have not been emitted yet. So at the moment any node is emitted, every node with an edge into it has already been emitted. That is exactly the definition of a valid topological order: for every edge u to v, u appears before v. The order is built one node at a time and this property holds for each node as it is added, so the finished list is a valid order. Now the cycle equivalence. If the graph is acyclic, then at every stage there is at least one node all of whose predecessors are already emitted, because if there were not, you could start at any un-emitted node and repeatedly walk backwards along an incoming edge to another un-emitted node, and since there are finitely many nodes that walk would eventually revisit one, forming a cycle, contradiction. So an acyclic graph never gets stuck and emits all V nodes. Conversely, if the graph has a cycle, consider the nodes on that cycle: each one has an incoming edge from another node on the cycle, and that predecessor can never be emitted before this node, and this node can never be emitted before its own predecessor, all the way around the loop. None of them can ever reach in-degree zero. So they, and anything reachable only through them, are never emitted, and the output length is strictly less than V. The two directions together make "output length equals V" and "graph is acyclic" the same statement.',
        aHi: 'Algorithm ek node sirf tab emit karta hai jab iski in-degree zero par gir gayi hai, aur ek node ki in-degree un edges ki count hai jo abhi bhi ispar un nodes se point karte hain jo abhi tak emit nahi hue. Toh jis pal koi node emit hota hai, har node jiska ispar ek edge hai pehle se emit ho chuka hai. Wo bilkul ek valid topological order ki paribhaasha hai: har edge u se v ke liye, u, v se pehle aata hai. Order ek baar mein ek node banaya jaata hai aur ye property har node ke liye hold karti hai jaise ye add hota hai, isliye poori list ek valid order hai. Ab cycle equivalence. Agar graph acyclic hai, toh har stage par kam se kam ek node hai jiske sab predecessors pehle se emit hain, kyunki agar na hote, aap kisi bhi un-emitted node se shuru kar sakte the aur baar-baar ek incoming edge par ek doosre un-emitted node par peechhe chal sakte the, aur kyunki seemit nodes hain wo walk aakhirkaar ek ko dobara visit karta, ek cycle banate hue, virodhabhaas. Toh ek acyclic graph kabhi atakta nahi aur sab V nodes emit karta hai. Iske ulat, agar graph mein ek cycle hai, us cycle ke nodes par vichaar karo: har ek ka cycle par ek doosre node se ek incoming edge hai, aur wo predecessor is node se pehle kabhi emit nahi ho sakta, aur ye node apne khud ke predecessor se pehle kabhi emit nahi ho sakta, loop ke poore aas-paas. Unmein se koi kabhi in-degree zero par nahi pahunch sakta. Toh wo, aur kuch bhi jo sirf unke through reachable hai, kabhi emit nahi hote, aur output length V se sakhti se kam hai. Dono directions saath "output length V ke barabar" aur "graph acyclic hai" ko ek hi kathan banaate hain.',
      },
      {
        q: 'The DFS-based topological sort adds each node to the result during the "unwind" (post-order) and then reverses. Why post-order specifically, and why does it need reversing?',
        qHi: 'DFS-based topological sort har node ko result mein "unwind" (post-order) ke dauraan add karta hai aur phir reverse karta hai. Post-order khaas taur par kyun, aur ise reverse karne ki zaroorat kyun hai?',
        a: 'When a DFS call for a node finishes and is about to return, one specific thing is guaranteed: every node reachable from it has already been fully visited and its own DFS call has already finished. This course\'s Module 6 lesson on recursion ordering is the key: code placed after the recursive calls runs on the way back up, once everything deeper is done. So if you append the node to a list at exactly that moment, you are appending it only after every node it can reach has already been appended. That means in the list you build, each node sits after all of its descendants. A topological order needs the opposite: each node must sit before its descendants, because the edges point from a node to things that must come later. So the post-order list is precisely a reversed topological order, and reversing it once at the end produces the real thing. You could equivalently prepend to the list instead of appending, or push onto a stack and pop it all at the end, but a plain append-then-reverse is the clearest. The reason you cannot just use pre-order (adding the node before recursing) is that at that moment you know nothing about where its descendants will end up, so there is no ordering guarantee to exploit.',
        aHi: 'Jab ek node ke liye ek DFS call khatam hoti hai aur return karne waali hai, ek khaas cheez guaranteed hai: ismein se reachable har node pehle se poori tarah visit ho chuka hai aur iski khud ki DFS call pehle se khatam ho chuki hai. Is course ke Module 6 ke recursion ordering lesson kunji hai: recursive calls ke baad rakha gaya code wapas upar jaate waqt chalta hai, ek baar har gehri cheez done ho jaaye. Toh agar aap node ko us bilkul pal ek list mein append karte ho, aap ise sirf tab append kar rahe ho jab har node jispar ye pahunch sakta hai pehle se append ho chuka hai. Iska matlab jo list aap banate ho, usmein har node apne sab descendants ke baad baithta hai. Ek topological order ko ulta chahiye: har node apne descendants se pehle baithna chahiye, kyunki edges ek node se un cheezon ki taraf point karte hain jo baad mein aani chahiye. Toh post-order list bilkul ek ulta topological order hai, aur ise ant mein ek baar reverse karna asli cheez banaata hai. Aap barabar roop se append ke bajaye list mein prepend kar sakte the, ya ek stack par push karke ant mein sab pop kar sakte the, par ek saadhaaran append-phir-reverse sabse saaf hai. Aap sirf pre-order (recurse karne se pehle node add karna) kyun nahi istemal kar sakte iska kaaran ye hai ki us pal aap iske descendants ke kahaan pahunchne ke baare mein kuch nahi jaante, isliye exploit karne ke liye koi ordering guarantee nahi.',
      },
    ],

    exercises: [
      {
        task: 'Implement Kahn\'s topoSort. Test on adj = [[1,2],[3],[3],[4],[]] (a diamond plus a tail, expect a length-5 order) and on [[1],[2],[0],[]] (a 3-cycle plus an isolated node, expect null).',
        taskHi: 'Kahn ka topoSort implement karo. adj = [[1,2],[3],[3],[4],[]] (ek diamond plus ek tail, ek length-5 order expect karo) aur [[1],[2],[0],[]] (ek 3-cycle plus ek isolated node, null expect karo) par test karo.',
        hint: 'Print the queue contents each iteration. For the cyclic case, note which nodes never make it into the queue — those are the ones stuck behind the cycle.',
        hintHi: 'Har iteration queue contents print karo. Cyclic case ke liye, note karo kaunse nodes kabhi queue mein nahi aate — wo cycle ke peechhe atke hain.',
      },
      {
        task: 'Implement the DFS-based topoSortDFS with WHITE/GRAY/BLACK. Verify that for a given DAG, both your Kahn output and your reversed-post-order output are each valid topological orders (every edge points forward), even if they differ.',
        taskHi: 'WHITE/GRAY/BLACK ke saath DFS-based topoSortDFS implement karo. Verify karo ki ek diye gaye DAG ke liye, aapka Kahn output aur aapka reversed-post-order output dono har ek valid topological orders hain (har edge aage point karta hai), chahe wo alag hon.',
        hint: 'Write a checker isTopoOrder(adj, order): build a position map, then confirm position[u] < position[v] for every edge u -> v.',
        hintHi: 'Ek checker isTopoOrder(adj, order) likho: ek position map banao, phir har edge u -> v ke liye position[u] < position[v] confirm karo.',
      },
      {
        task: 'Modify Kahn\'s algorithm to use a min-heap instead of a FIFO queue, so that among all currently-ready nodes the smallest id is emitted first. Confirm it produces the lexicographically smallest valid order.',
        taskHi: 'Kahn ke algorithm ko ek FIFO queue ke bajaye ek min-heap istemal karne ke liye modify karo, taaki sab abhi-ready nodes mein sabse chhoti id pehle emit ho. Confirm karo ki ye lexicographically sabse chhota valid order banaata hai.',
        hint: 'Reuse the MinHeap from Module 8. The only change is queue.shift() becomes heap.extractMin() and queue.push() becomes heap.insert().',
        hintHi: 'Module 8 ka MinHeap reuse karo. Ekmatra badlaav ye hai ki queue.shift() heap.extractMin() ban jaata hai aur queue.push() heap.insert() ban jaata hai.',
      },
    ],

    keyTakeaways: [
      'A topological order lists a DAG\'s nodes so every edge points from earlier to later — the "prerequisites first" ordering. It exists if and only if the graph has no cycle.',
      'Kahn\'s algorithm: count every node\'s in-degree once, queue the in-degree-0 nodes, and each time you pop a node, decrement its neighbours\' in-degrees and enqueue any that hit 0. O(V + E).',
      'If Kahn\'s output has fewer than V nodes, the graph has a cycle — the unemitted nodes are exactly those trapped in or behind it. Always check the length.',
      'The DFS alternative: run DFS, append each node in POST-order (after its descendants), then reverse the list. Reuses the WHITE/GRAY/BLACK cycle check.',
      'In-degree is edges pointing INTO a node (scan all edges, increment the destination) — not adj[node].length, which is out-degree.',
      'Swap the FIFO queue for a min-heap to get the lexicographically smallest topological order when ties matter.',
    ],
    keyTakeawaysHi: [
      'Ek topological order ek DAG ke nodes ko aise list karta hai ki har edge pehle se baad ki taraf point kare — "prerequisites pehle" ordering. Ye bilkul tab maujood hai jab graph mein koi cycle nahi.',
      'Kahn ka algorithm: har node ki in-degree ek baar gino, in-degree-0 nodes ko queue karo, aur har baar jab aap ek node pop karo, iske neighbours ki in-degrees decrement karo aur 0 par pahunchne waalon ko enqueue karo. O(V + E).',
      'Agar Kahn ke output mein V se kam nodes hain, graph mein ek cycle hai — un-emitted nodes bilkul wo hain jo ismein ya iske peechhe fanse hain. Hamesha length check karo.',
      'DFS vikalp: DFS chalao, har node ko POST-order mein append karo (iske descendants ke baad), phir list reverse karo. WHITE/GRAY/BLACK cycle check reuse karta hai.',
      'In-degree wo edges hain jo ek node par AATE hain (sab edges scan karo, destination increment karo) — adj[node].length nahi, jo out-degree hai.',
      'Ties maayne rakhne par lexicographically sabse chhota topological order paane ke liye FIFO queue ko ek min-heap se badlo.',
    ],
  },
];
