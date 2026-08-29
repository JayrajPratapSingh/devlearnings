/**
 * DSA Complete Course — Module 9: Graphs, lesson 2.
 *
 * BFS on a general graph: shortest path in an UNWEIGHTED graph, and the role of
 * the visited set. Builds on this course's Module 7 BFS lesson (BFS on a tree,
 * which needed no visited set because a tree has no cycles and exactly one path
 * to each node) and Module 8 (a queue). Broken example: running tree-style BFS
 * on a graph — no visited set — which loops forever the moment the graph has a
 * cycle, because a graph node can be reached along many paths and keeps getting
 * re-enqueued. A subtler broken variant: adding a visited set but marking a node
 * visited only when it is DEQUEUED, which still lets the same node sit in the
 * queue several times and inflates the work. Fixed by marking a node visited the
 * moment it is ENQUEUED, so each node enters the queue exactly once, giving the
 * clean O(V + E) BFS whose first arrival at any node is along a shortest (fewest-
 * edges) path.
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

export const DSA_MODULE_9_PART2: CourseLesson[] = [
  {
    slug: 'graph-bfs-shortest-path-visited',
    title: 'BFS on a Graph: Shortest Paths and the Visited Set',
    titleHi: 'Graph Par BFS: Shortest Paths Aur Visited Set',
    description: 'Running the tree BFS from this course\'s Trees module directly on a graph. On a tree it worked because there is exactly one path to every node; on a graph, the first cycle you hit sends the same nodes around the loop forever, and the queue never empties.',
    descriptionHi: 'Is course ke Trees module ka tree BFS seedhe ek graph par chalaana. Ek tree par ye kaam karta tha kyunki har node tak bilkul ek path hai; ek graph par, pehli cycle jo aap hit karte ho wahi nodes ko loop ke aas-paas hamesha ke liye bhejti hai, aur queue kabhi khaali nahi hoti.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Exploring a museum by rooms, where the museum has a loop of galleries that connect back on themselves.** This course\'s Module 7 explored a building shaped like a family tree — no room ever led back to one you had already been in, so you could wander freely and never worry about going in circles. A real museum is not a tree: gallery A opens into B and C, B and C both open into D, and D opens back into A. If you explore room by room without keeping a list of rooms you have already entered, you walk A, B, C, D, then from D back to A, then A to B and C again, forever. The fix is a simple stamp on the door: the instant you decide a room is worth visiting and add it to your "to see next" list, you mark its door. If you later arrive at a marked door from another direction, you do not go in again. Marking the door when you *add it to the list* rather than when you *actually walk in* matters: if you wait until you walk in, the same room can end up on your list three or four times from three or four neighbours, and you waste trips even if you never fully re-explore it. Because you explore strictly in rings — everything one room away, then everything two rooms away — the first time you reach any room is necessarily by one of the shortest routes to it.',
      hi: '**Ek museum ko kamron se explore karna, jahaan museum mein galleries ka ek loop hai jo apne aap se wapas judta hai.** Is course ke Module 7 ne ek family tree jaise aakaar ki building explore ki — koi kamra kabhi wapas ek aise kamre mein nahi le gaya jismein aap pehle se the, isliye aap swatantra roop se ghoom sakte the aur kabhi chakkar mein jaane ki chinta nahi. Ek asli museum ek tree nahi hai: gallery A B aur C mein khulti hai, B aur C dono D mein khulti hain, aur D wapas A mein khulti hai. Agar aap kamra-dar-kamra explore karte ho bina un kamron ki list rakhe jinmein aap pehle se ghus chuke ho, aap A, B, C, D chalte ho, phir D se wapas A, phir A se B aur C phir se, hamesha ke liye. Fix darwaaze par ek saral stamp hai: jis pal aap tay karte ho ki ek kamra dekhne laayak hai aur ise apni "aage dekhne ki" list mein add karte ho, aap iske darwaaze ko mark karte ho. Agar aap baad mein ek marked darwaaze par doosri direction se pahunchte ho, aap phir andar nahi jaate. Darwaaze ko tab mark karna jab aap use *list mein add karte ho* na ki jab aap *asal mein andar chalte ho* maayne rakhta hai: agar aap andar chalne tak wait karte ho, wahi kamra teen ya chaar neighbours se teen ya chaar baar aapki list par aa sakta hai, aur aap trips barbaad karte ho chahe aap ise kabhi poori tarah re-explore na karein. Kyunki aap sakhti se rings mein explore karte ho — ek kamra door sab kuch, phir do kamre door sab kuch — kisi bhi kamre tak aap pehli baar zaroori roop se iske sabse chhote raaston mein se ek se pahunchte ho.',
    },

    simple: `**Start broken.** Tree BFS, run on a graph that has a cycle (0-1, 1-2, 2-0):

\`\`\`js
function bfsBroken(adj, start) {
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) queue.push(next); // no visited check
  }
  return order;
}
// adj = [[1,2],[0,2],[0,1]]   (triangle: every node connects to the other two)
// bfsBroken(adj, 0) never returns — 0 enqueues 1 and 2, 1 enqueues 0 and 2,
// 2 enqueues 0 and 1, and the queue grows without bound forever.
\`\`\`

This course's Module 7 ran essentially this exact code on a tree and it was fine, because in a tree there is exactly one path from the root to any node, so no node is ever discovered twice. A graph has cycles and multiple paths, so a node gets enqueued once per neighbour that points at it, and if there is a cycle the process never terminates.

**A subtler broken version: mark visited on DEQUEUE**

\`\`\`js
function bfsStillWasteful(adj, start) {
  const queue = [start];
  const visited = new Set();
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue; // marked only now, on dequeue
    visited.add(node);
    order.push(node);
    for (const next of adj[node]) queue.push(next);
  }
  return order;
}
// This terminates and is correct, BUT a node with 5 neighbours can be pushed
// into the queue 5 times before any of those copies is dequeued — the queue
// holds up to O(E) entries and does O(E) wasted "already visited, continue".
\`\`\`

**The fix: mark visited the moment you ENQUEUE**

\`\`\`js
function bfs(adj, start) {
  const queue = [start];
  const visited = new Set([start]);   // mark on enqueue
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next);            // mark BEFORE pushing
        queue.push(next);
      }
    }
  }
  return order;
}
\`\`\`

\`\`\`ts
function bfs(adj: number[][], start: number): number[] {
  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}
\`\`\`

Marking a node visited *before* it goes into the queue guarantees it is enqueued exactly once, ever. The queue holds at most V entries, each node and each edge is processed once, and the total is a clean O(V + E). And because BFS drains the queue in the order nodes were added — all distance-1 nodes, then all distance-2 nodes — the first time \`bfs\` reaches any node is along a path with the fewest possible edges.`,

    simpleHi: `**Toote hue se shuru.** Tree BFS, ek graph par chalaaya jismein ek cycle hai (0-1, 1-2, 2-0):

\`\`\`js
function bfsBroken(adj, start) {
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) queue.push(next); // koi visited check nahi
  }
  return order;
}
// adj = [[1,2],[0,2],[0,1]]   (triangle: har node doosre do se judta hai)
// bfsBroken(adj, 0) kabhi return nahi hota — 0, 1 aur 2 enqueue karta hai, 1, 0 aur 2
// enqueue karta hai, 2, 0 aur 1 enqueue karta hai, aur queue bina seema hamesha badhti hai.
\`\`\`

Is course ke Module 7 ne asal mein ye bilkul code ek tree par chalaaya aur ye theek tha, kyunki ek tree mein root se kisi node tak bilkul ek path hai, isliye koi node kabhi do baar discover nahi hota. Ek graph mein cycles aur multiple paths hain, isliye ek node har neighbour jo ispar point karta hai us prati ek baar enqueue hota hai, aur agar ek cycle hai process kabhi khatam nahi hota.

**Ek sookshm toota version: DEQUEUE par visited mark karo**

\`\`\`js
function bfsStillWasteful(adj, start) {
  const queue = [start];
  const visited = new Set();
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue; // sirf ab mark kiya, dequeue par
    visited.add(node);
    order.push(node);
    for (const next of adj[node]) queue.push(next);
  }
  return order;
}
// Ye khatam hota hai aur sahi hai, PAR 5 neighbours waala ek node queue mein
// 5 baar push ho sakta hai isse pehle ki un copies mein se koi dequeue ho — queue
// O(E) entries tak rakhta hai aur O(E) barbaad "pehle se visited, continue" karta hai.
\`\`\`

**Fix: jis pal aap ENQUEUE karte ho us pal visited mark karo**

\`\`\`js
function bfs(adj, start) {
  const queue = [start];
  const visited = new Set([start]);   // enqueue par mark karo
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next);            // push karne SE PEHLE mark karo
        queue.push(next);
      }
    }
  }
  return order;
}
\`\`\`

\`\`\`ts
function bfs(adj: number[][], start: number): number[] {
  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}
\`\`\`

Ek node ko queue mein jaane *se pehle* visited mark karna guarantee karta hai ki ye kabhi bilkul ek baar enqueue hota hai. Queue zyaada se zyaada V entries rakhta hai, har node aur har edge ek baar process hota hai, aur kul ek saaf O(V + E) hai. Aur kyunki BFS queue ko us order mein khaali karta hai jismein nodes add hue — sab distance-1 nodes, phir sab distance-2 nodes — \`bfs\` kisi bhi node tak pehli baar sabse kam sambhaavit edges waale path se pahunchta hai.`,

    content: `## Recovering the actual shortest path, not just its length

\`\`\`js
function shortestPath(adj, start, target) {
  const queue = [start];
  const parent = new Map([[start, null]]);   // node -> the node we reached it from
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === target) break;
    for (const next of adj[node]) {
      if (!parent.has(next)) {
        parent.set(next, node);
        queue.push(next);
      }
    }
  }
  if (!parent.has(target)) return null;      // unreachable
  const path = [];
  for (let at = target; at !== null; at = parent.get(at)) path.push(at);
  return path.reverse();
}
\`\`\`

The \`visited\` set and the \`parent\` map are the same idea used two ways: \`parent.has(next)\` doubles as the visited check, and \`parent.get(next)\` records which node first discovered \`next\`. Since BFS discovers every node along a shortest path, walking \`parent\` backwards from the target reconstructs one shortest path exactly. This course's Module 7 lesson on tree traversal used a similar "remember where you came from" trick for the inorder-successor in a BST — here it is the whole mechanism.

## BFS layer by layer: tracking distance

\`\`\`js
function distances(adj, start) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift();
    for (const next of adj[node]) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);   // one more edge than the node that found it
        queue.push(next);
      }
    }
  }
  return dist;   // dist.get(x) = fewest edges from start to x
}
\`\`\`

Every node's distance is exactly one more than the distance of the node that first enqueued it. This works *only* because every edge counts as 1 — BFS answers "fewest edges", not "lowest total weight". The moment edges have different weights this breaks, and you need Dijkstra (this module's later lesson), which is essentially BFS with a priority queue instead of a plain queue.

## Why marking on enqueue is correct, not just faster

\`\`\`
Claim: if node X is first enqueued at BFS layer d, then d is X's true shortest
distance from the start, so it is safe to lock X in and never reconsider it.

Why: BFS processes the queue in non-decreasing distance order. When X is first
reached, it is reached from some node at layer d-1, so X is at layer d. Any other
path to X goes through some node that is itself at layer >= d-1 (BFS has not seen
anything deeper yet), so no later discovery of X can be shorter. Marking X on
enqueue simply refuses the later, no-better discoveries.
\`\`\`

If instead you mark on dequeue, X can be enqueued by every one of its layer-(d-1) and layer-d neighbours before the first copy is processed. The result is still correct — the extra copies are skipped when dequeued — but the queue can swell to O(E) and you do O(E) pointless "already visited" checks. Mark on enqueue and each node is queued once, full stop.

## Multi-source BFS: start from many nodes at once

\`\`\`js
// "distance from the nearest hospital" over a grid of hospitals:
// seed the queue with ALL sources at distance 0, then run one BFS.
function multiSourceBFS(adj, sources) {
  const dist = new Map();
  const queue = [];
  for (const s of sources) { dist.set(s, 0); queue.push(s); }
  while (queue.length > 0) {
    const node = queue.shift();
    for (const next of adj[node]) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);
        queue.push(next);
      }
    }
  }
  return dist;   // dist.get(x) = fewest edges from x to its CLOSEST source
}
\`\`\`

Seeding the queue with every source at once is a common and powerful trick — one BFS pass computes the distance from each node to whichever source is nearest, with no change to the core loop.`,

    contentHi: `## Asli shortest path recover karna, sirf iski length nahi

\`\`\`js
function shortestPath(adj, start, target) {
  const queue = [start];
  const parent = new Map([[start, null]]);   // node -> wo node jahaan se hum ispar pahunche
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === target) break;
    for (const next of adj[node]) {
      if (!parent.has(next)) {
        parent.set(next, node);
        queue.push(next);
      }
    }
  }
  if (!parent.has(target)) return null;      // unreachable
  const path = [];
  for (let at = target; at !== null; at = parent.get(at)) path.push(at);
  return path.reverse();
}
\`\`\`

\`visited\` set aur \`parent\` map wahi idea do tarikon se istemal kiya gaya: \`parent.has(next)\` visited check ki tarah kaam karta hai, aur \`parent.get(next)\` record karta hai ki kaunse node ne \`next\` ko pehle discover kiya. Kyunki BFS har node ko ek shortest path par discover karta hai, target se \`parent\` peechhe chalna ek shortest path bilkul reconstruct karta hai. Is course ke Module 7 ke tree traversal lesson ne ek BST mein inorder-successor ke liye ek samaan "yaad rakho aap kahaan se aaye" trick istemal ki — yahaan ye poora mechanism hai.

## BFS layer by layer: distance track karna

\`\`\`js
function distances(adj, start) {
  const dist = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift();
    for (const next of adj[node]) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);   // us node se ek edge zyaada jisne ise dhoondha
        queue.push(next);
      }
    }
  }
  return dist;   // dist.get(x) = start se x tak sabse kam edges
}
\`\`\`

Har node ki distance us node ki distance se bilkul ek zyaada hai jisne ise pehle enqueue kiya. Ye *sirf* isliye kaam karta hai kyunki har edge 1 ginta hai — BFS "sabse kam edges" ka jawaab deta hai, "sabse kam kul weight" ka nahi. Jis pal edges ke alag weights hote hain ye tootta hai, aur aapko Dijkstra chahiye (is module ka baad ka lesson), jo asal mein ek plain queue ke bajaye ek priority queue ke saath BFS hai.

## Enqueue par mark karna sahi kyun hai, sirf tez nahi

\`\`\`
Daawa: agar node X pehli baar BFS layer d par enqueue hota hai, toh d X ki asli
shortest distance start se hai, isliye X ko lock karna aur kabhi dobara na sochna surakshit hai.

Kyun: BFS queue ko non-decreasing distance order mein process karta hai. Jab X pehli baar
pahunchta hai, ye layer d-1 par kisi node se pahunchta hai, isliye X layer d par hai. X ka koi
doosra path kisi node se jaata hai jo khud layer >= d-1 par hai (BFS ne abhi tak kuch gehra nahi
dekha), isliye X ki koi baad ki discovery chhoti nahi ho sakti. X ko enqueue par mark karna bas
baad ki, na-behtar discoveries ko refuse karta hai.
\`\`\`

Agar iske bajaye aap dequeue par mark karte ho, X iske har layer-(d-1) aur layer-d neighbour se enqueue ho sakta hai isse pehle ki pehli copy process ho. Nateeja abhi bhi sahi hai — extra copies dequeue hone par skip ho jaati hain — par queue O(E) tak phool sakta hai aur aap O(E) bekaar "pehle se visited" checks karte ho. Enqueue par mark karo aur har node ek baar queue hota hai, poori baat.

## Multi-source BFS: kayi nodes se ek saath shuru karo

\`\`\`js
// "sabse kareeb hospital se distance" hospitals ke ek grid par:
// queue ko SAB sources se distance 0 par seed karo, phir ek BFS chalao.
function multiSourceBFS(adj, sources) {
  const dist = new Map();
  const queue = [];
  for (const s of sources) { dist.set(s, 0); queue.push(s); }
  while (queue.length > 0) {
    const node = queue.shift();
    for (const next of adj[node]) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);
        queue.push(next);
      }
    }
  }
  return dist;   // dist.get(x) = x se iske SABSE KAREEB source tak sabse kam edges
}
\`\`\`

Queue ko har source se ek saath seed karna ek aam aur shaktishaali trick hai — ek BFS pass har node se jo bhi source sabse kareeb hai us tak ki distance compute karta hai, core loop mein koi badlaav ke bina.`,

    examples: [
      {
        title: 'Broken: no visited set — infinite loop on any cycle',
        titleHi: 'Toota: koi visited set nahi — kisi bhi cycle par infinite loop',
        code: `while (queue.length > 0) {
  const node = queue.shift();
  order.push(node);
  for (const next of adj[node]) queue.push(next); // re-enqueues forever
}`,
        codeJs: `function bfsBroken(adj, start) {
  const queue = [start], order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) queue.push(next);
  }
  return order; // never reached for a cyclic graph
}
// adj = [[1,2],[0,2],[0,1]] -> bfsBroken(adj, 0) loops until memory runs out`,
        codeTs: `function bfsBroken(adj: number[][], start: number): number[] {
  const queue: number[] = [start];
  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) queue.push(next);
  }
  return order;
}`,
        output: `// does not terminate — the queue grows without bound`,
        explain: 'A tree has one path to each node so nothing is discovered twice; a graph with a cycle re-enqueues the same nodes endlessly because there is no record of what has already been seen.',
        explainHi: 'Ek tree mein har node tak ek path hai isliye kuch do baar discover nahi hota; ek cycle waala graph wahi nodes ko anant baar re-enqueue karta hai kyunki jo pehle dekha gaya uska koi record nahi.',
      },
      {
        title: 'Fixed: mark visited on enqueue — clean O(V + E)',
        titleHi: 'Theek: enqueue par visited mark karo — saaf O(V + E)',
        code: `for (const next of adj[node]) {
  if (!visited.has(next)) { visited.add(next); queue.push(next); }
}`,
        codeJs: `function bfs(adj, start) {
  const queue = [start];
  const visited = new Set([start]);
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return order;
}
console.log(bfs([[1,2],[0,2],[0,1]], 0)); // [0, 1, 2]`,
        codeTs: `function bfs(adj: number[][], start: number): number[] {
  const queue: number[] = [start];
  const visited = new Set<number>([start]);
  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const next of adj[node]!) {
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  return order;
}`,
        outputJs: `[0, 1, 2]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Marking before pushing guarantees each node enters the queue exactly once. Every node and edge is handled once, so the traversal is O(V + E).',
        explainHi: 'Push karne se pehle mark karna guarantee karta hai ki har node bilkul ek baar queue mein aata hai. Har node aur edge ek baar handle hota hai, isliye traversal O(V + E) hai.',
      },
      {
        title: 'Shortest path via a parent map',
        titleHi: 'Ek parent map se shortest path',
        code: `parent.set(next, node);   // remember who discovered 'next'
// ...then walk parent[] backwards from target to start`,
        codeJs: `function shortestPath(adj, start, target) {
  const queue = [start];
  const parent = new Map([[start, null]]);
  while (queue.length) {
    const node = queue.shift();
    if (node === target) break;
    for (const next of adj[node]) {
      if (!parent.has(next)) { parent.set(next, node); queue.push(next); }
    }
  }
  if (!parent.has(target)) return null;
  const path = [];
  for (let at = target; at !== null; at = parent.get(at)) path.push(at);
  return path.reverse();
}
// adj = [[1,2],[0,3],[0,3],[1,2,4],[3]]
console.log(shortestPath(adj, 0, 4)); // [0, 1, 3, 4]  (one of the shortest)`,
        codeTs: `function shortestPath(adj: number[][], start: number, target: number): number[] | null {
  const queue: number[] = [start];
  const parent = new Map<number, number | null>([[start, null]]);
  while (queue.length) {
    const node = queue.shift()!;
    if (node === target) break;
    for (const next of adj[node]!) {
      if (!parent.has(next)) { parent.set(next, node); queue.push(next); }
    }
  }
  if (!parent.has(target)) return null;
  const path: number[] = [];
  for (let at: number | null = target; at !== null; at = parent.get(at)!) path.push(at);
  return path.reverse();
}`,
        outputJs: `[0, 1, 3, 4]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'BFS discovers every node along a shortest path, so the parent map records a shortest-path predecessor for each node. Walking it backwards from the target yields a full shortest path.',
        explainHi: 'BFS har node ko ek shortest path par discover karta hai, isliye parent map har node ke liye ek shortest-path predecessor record karta hai. Ise target se peechhe chalna ek poora shortest path deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// marking visited on dequeue instead of enqueue
const node = queue.shift();
if (visited.has(node)) continue;
visited.add(node);
for (const next of adj[node]) queue.push(next); // pushes even already-queued nodes`,
        right: `for (const next of adj[node]) {
  if (!visited.has(next)) { visited.add(next); queue.push(next); }
}`,
        why: 'Marking on dequeue is correct but lets a node be queued once per neighbour before its first copy is processed — the queue can reach O(E) and does O(E) redundant checks. Marking on enqueue queues each node once.',
        whyHi: 'Dequeue par mark karna sahi hai par ek node ko iski pehli copy process hone se pehle prati neighbour ek baar queue hone deta hai — queue O(E) tak pahunch sakta hai aur O(E) redundant checks karta hai. Enqueue par mark karna har node ko ek baar queue karta hai.',
      },
      {
        wrong: `// using BFS layer count as distance on a WEIGHTED graph
dist.set(next, dist.get(node) + 1); // wrong when edges have weights 3, 7, 2, ...`,
        right: `// BFS distance is only "fewest edges". For weighted shortest path use
// Dijkstra (this module's later lesson) with a priority queue.`,
        why: 'BFS treats every edge as cost 1. On a weighted graph the fewest-edges path is frequently not the lowest-total-weight path, so the layer count is simply the wrong answer.',
        whyHi: 'BFS har edge ko cost 1 maanta hai. Ek weighted graph par sabse-kam-edges path aksar sabse-kam-kul-weight path nahi hota, isliye layer count bas galat jawaab hai.',
      },
      {
        wrong: `// forgetting to mark the start node
const visited = new Set();          // start is not in here
queue.push(start);
// if start has an edge back to itself or a 2-cycle, it gets re-added`,
        right: `const visited = new Set([start]);   // seed it with the start node
queue.push(start);`,
        why: 'The start node is enqueued before the loop, so it must be in visited before the loop too, or a neighbour that points back at it will enqueue it a second time.',
        whyHi: 'Start node loop se pehle enqueue hota hai, isliye ise loop se pehle visited mein bhi hona chahiye, warna ek neighbour jo ispar wapas point karta hai ise doosri baar enqueue karega.',
      },
    ],

    realWorld: [
      {
        en: '**"Degrees of separation" and "people you may know"** are BFS from your node outward — the shortest-path layer is exactly how many introductions away someone is.',
        hi: '**"Degrees of separation" aur "people you may know"** aapke node se bahar ki taraf BFS hain — shortest-path layer bilkul wo hai ki koi kitni introductions door hai.',
      },
      {
        en: '**Web crawlers do BFS over the link graph** with a visited set of URLs, so each page is fetched once even though many pages link to it.',
        hi: '**Web crawlers link graph par BFS karte hain** URLs ke ek visited set ke saath, taaki har page ek baar fetch ho chahe bahut pages ispar link karein.',
      },
      {
        en: '**Grid games and pathfinding** ("shortest number of moves to the exit") are BFS where each cell is a node and each legal move is an edge — and multi-source BFS answers "distance to the nearest enemy / item / safe tile" in one pass.',
        hi: '**Grid games aur pathfinding** ("exit tak sabse kam moves") BFS hain jahaan har cell ek node hai aur har legal move ek edge — aur multi-source BFS ek pass mein "sabse kareeb enemy / item / safe tile tak distance" ka jawaab deta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'On a tree, BFS needs no visited set. On a graph it does. What exactly is different, and why does the visited set completely fix it?',
        qHi: 'Ek tree par, BFS ko koi visited set nahi chahiye. Ek graph par chahiye. Bilkul kya alag hai, aur visited set ise poori tarah kyun theek karta hai?',
        a: 'A tree has two structural guarantees that a general graph lacks: there is exactly one path between any two nodes, and there are no cycles. Because there is one path to each node, BFS on a tree discovers every node exactly once as a matter of course — when you are expanding a node\'s children, none of those children has been seen before and none will be seen again from elsewhere, because "elsewhere" would be a second path and trees do not have those. A general graph breaks both guarantees. A node can be reached from several other nodes, so when BFS expands each of those nodes it will try to enqueue the shared neighbour again. And if there is a cycle, following edges can lead you back to a node you already processed, so without any memory the traversal has no reason to ever stop. The visited set restores exactly the property the tree gave for free: it records every node that has already been discovered, and the traversal refuses to enqueue any node that is already in it. That single rule caps the total number of enqueues at V, makes the queue drain and empty, and ensures every node and every edge is processed a bounded number of times, which is what brings the complexity back to O(V + E). The visited set is essentially BFS carrying its own proof that it is exploring a tree — specifically the BFS tree of shortest paths — even though the underlying graph is not one.',
        aHi: 'Ek tree mein do structural guarantees hain jo ek general graph mein nahi: kisi bhi do nodes ke beech bilkul ek path hai, aur koi cycles nahi. Kyunki har node tak ek path hai, ek tree par BFS har node ko bilkul ek baar discover karta hai — jab aap ek node ke children expand kar rahe ho, un children mein se koi pehle nahi dekha gaya aur koi kahin aur se dobara nahi dekha jaayega, kyunki "kahin aur" ek doosra path hoga aur trees mein wo nahi hote. Ek general graph dono guarantees todta hai. Ek node kayi doosre nodes se pahunche jaa sakta hai, isliye jab BFS un nodes mein se har ek expand karta hai wo shared neighbour ko dobara enqueue karne ki koshish karega. Aur agar ek cycle hai, edges follow karna aapko ek aise node par wapas le jaa sakta hai jise aap pehle se process kar chuke ho, isliye bina kisi memory ke traversal ke paas kabhi rukne ka koi kaaran nahi. Visited set bilkul wo property restore karta hai jo tree ne muft di: ye har node record karta hai jo pehle se discover ho chuka hai, aur traversal kisi bhi node ko enqueue karne se mana karta hai jo pehle se ismein hai. Wo ek rule kul enqueues ki tadaad ko V par cap karta hai, queue ko drain aur khaali karvaata hai, aur sunishchit karta hai ki har node aur har edge ek bandhi hui tadaad mein process ho, jo complexity ko wapas O(V + E) par laata hai. Visited set asal mein BFS apna khud ka saboot le jaata hai ki ye ek tree explore kar raha hai — khaas taur par shortest paths ka BFS tree — chahe neeche ka graph ek na ho.',
      },
      {
        q: 'Why does BFS give the shortest path in an unweighted graph but not in a weighted one, and what is the smallest change to BFS that fixes the weighted case?',
        qHi: 'BFS ek unweighted graph mein shortest path kyun deta hai par ek weighted mein nahi, aur BFS mein sabse chhota badlaav kya hai jo weighted case theek karta hai?',
        a: 'BFS processes nodes strictly in order of how many edges away they are from the start: it fully finishes every node at distance 1, then every node at distance 2, and so on. This works as a shortest-path algorithm precisely because, when every edge has the same cost of 1, "fewest edges" and "lowest total cost" are the same thing, and the order BFS visits nodes in is already sorted by that cost. The first time BFS reaches a node, it cannot possibly reach it more cheaply later, because everything cheaper has already been processed. On a weighted graph that alignment breaks. A path of three light edges can have a lower total weight than a path of one heavy edge, so the fewest-edges path BFS finds is often not the cheapest path. BFS still visits nodes in fewest-edges order, but fewest-edges order is no longer the same as cheapest-first order. The fix is to change what determines processing order: instead of a plain FIFO queue that yields nodes in insertion order, use a priority queue keyed by the total accumulated weight from the start, so the node processed next is always the unprocessed node with the smallest known total distance. That is Dijkstra\'s algorithm, and structurally it is BFS with the queue swapped for a min-heap. Everything else — the visited/settled set, relaxing each neighbour, recording predecessors for path reconstruction — carries over almost unchanged.',
        aHi: 'BFS nodes ko sakhti se is order mein process karta hai ki wo start se kitne edges door hain: ye distance 1 par har node poori tarah khatam karta hai, phir distance 2 par har node, aur aise hi. Ye ek shortest-path algorithm ki tarah bilkul isliye kaam karta hai kyunki, jab har edge ki ek hi cost 1 hai, "sabse kam edges" aur "sabse kam kul cost" ek hi cheez hain, aur jis order mein BFS nodes dekhta hai wo pehle se us cost se sorted hai. BFS jab pehli baar ek node par pahunchta hai, ye ise baad mein zyaada saste mein nahi pahunch sakta, kyunki har sasti cheez pehle se process ho chuki hai. Ek weighted graph par wo alignment tootta hai. Teen halke edges ka ek path ek bhaari edge ke ek path se kam kul weight rakh sakta hai, isliye jo sabse-kam-edges path BFS dhoondhta hai wo aksar sabse sasta path nahi hota. BFS abhi bhi nodes ko sabse-kam-edges order mein dekhta hai, par sabse-kam-edges order ab sabse-saste-pehle order jaisa nahi hai. Fix ye badalna hai ki processing order kya determine karta hai: ek plain FIFO queue ke bajaye jo nodes ko insertion order mein deti hai, start se kul jama weight se keyed ek priority queue istemal karo, taaki agla process hone waala node hamesha sabse chhoti gyaat kul distance waala unprocessed node ho. Wo Dijkstra ka algorithm hai, aur structurally ye ek min-heap ke liye swap ki gayi queue ke saath BFS hai. Baaki sab kuch — visited/settled set, har neighbour ko relax karna, path reconstruction ke liye predecessors record karna — lagbhag na-badla carry over hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the graph adj = [[1,2],[0,2,3],[0,1,3],[1,2,4],[3]] and run the fixed bfs from node 0. Confirm it returns [0, 1, 2, 3, 4] and terminates (the broken version would not).',
        taskHi: 'Graph adj = [[1,2],[0,2,3],[0,1,3],[1,2,4],[3]] banao aur node 0 se fixed bfs chalao. Confirm karo ki ye [0, 1, 2, 3, 4] return karta hai aur khatam hota hai (toota version nahi hota).',
        hint: 'This graph has multiple cycles (0-1-2, 1-2-3). Without a visited set, node 0 alone would be re-enqueued by both 1 and 2 on the first layer.',
        hintHi: 'Is graph mein kayi cycles hain (0-1-2, 1-2-3). Ek visited set ke bina, akela node 0 pehli layer par 1 aur 2 dono se re-enqueue hota.',
      },
      {
        task: 'Write distances(adj, start) that returns a Map of node -> fewest edges from start. Test on the graph above from node 0; expected {0:0, 1:1, 2:1, 3:2, 4:3}.',
        taskHi: 'distances(adj, start) likho jo node -> start se sabse kam edges ka ek Map return kare. Upar ke graph par node 0 se test karo; expected {0:0, 1:1, 2:1, 3:2, 4:3}.',
        hint: 'Each newly discovered node\'s distance is dist.get(currentNode) + 1. Only set a distance if the node is not already in the map.',
        hintHi: 'Har naye discover kiye gaye node ki distance dist.get(currentNode) + 1 hai. Ek distance sirf tab set karo jab node pehle se map mein nahi hai.',
      },
      {
        task: 'Implement multiSourceBFS(adj, sources). On a 5x5 grid graph with sources at the two opposite corners, compute every cell\'s distance to its nearest corner and print it as a grid.',
        taskHi: 'multiSourceBFS(adj, sources) implement karo. Do opposite corners par sources ke saath ek 5x5 grid graph par, har cell ki iske sabse kareeb corner tak distance compute karo aur ise ek grid ki tarah print karo.',
        hint: 'Build the grid as a graph first: cell (r, c) has id r*5 + c and edges to its up/down/left/right neighbours. Seed the queue with both corner ids at distance 0.',
        hintHi: 'Pehle grid ko ek graph ki tarah banao: cell (r, c) ki id r*5 + c hai aur iske up/down/left/right neighbours tak edges. Queue ko dono corner ids se distance 0 par seed karo.',
      },
    ],

    keyTakeaways: [
      'On a graph, BFS needs a visited set: without it, cycles cause infinite re-enqueueing because a node can be reached along many paths (unlike a tree, which has exactly one).',
      'Mark a node visited the moment you ENQUEUE it, not when you dequeue it — this keeps each node in the queue exactly once and the whole traversal O(V + E).',
      'BFS visits nodes in non-decreasing distance order, so the first time it reaches any node is along a path with the fewest edges — this is the unweighted shortest path.',
      'Record a parent map (node -> who discovered it) during BFS; walking it backwards from the target reconstructs an actual shortest path, not just its length.',
      'BFS distance is "fewest edges" only. On a weighted graph you need Dijkstra, which is BFS with a priority queue keyed by total weight.',
      'Multi-source BFS: seed the queue with all sources at distance 0, then one normal BFS gives each node its distance to the nearest source.',
    ],
    keyTakeawaysHi: [
      'Ek graph par, BFS ko ek visited set chahiye: iske bina, cycles infinite re-enqueueing ka kaaran banti hain kyunki ek node kayi paths par pahunche jaa sakta hai (ek tree ke ulat, jismein bilkul ek hai).',
      'Ek node ko jis pal aap ENQUEUE karte ho us pal visited mark karo, dequeue par nahi — ye har node ko queue mein bilkul ek baar rakhta hai aur poore traversal ko O(V + E).',
      'BFS nodes ko non-decreasing distance order mein dekhta hai, isliye ye kisi bhi node par pehli baar sabse kam edges waale path se pahunchta hai — ye unweighted shortest path hai.',
      'BFS ke dauraan ek parent map (node -> kisne ise discover kiya) record karo; ise target se peechhe chalna ek asli shortest path reconstruct karta hai, sirf iski length nahi.',
      'BFS distance sirf "sabse kam edges" hai. Ek weighted graph par aapko Dijkstra chahiye, jo kul weight se keyed ek priority queue ke saath BFS hai.',
      'Multi-source BFS: queue ko sab sources se distance 0 par seed karo, phir ek normal BFS har node ko iski sabse kareeb source tak distance deta hai.',
    ],
  },
];
