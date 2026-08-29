/**
 * DSA Complete Course — Module 9: Graphs, lesson 6 (final lesson of Module 9).
 *
 * Dijkstra's shortest path on a weighted graph. Builds on this module's lesson 2
 * (BFS shortest path on an UNWEIGHTED graph) and this course's Module 8 (the
 * min-heap / priority queue). Broken example: using plain BFS on a weighted
 * graph and treating the layer count as the distance — BFS finds the path with
 * the FEWEST EDGES, which on a weighted graph is frequently not the path with
 * the LOWEST TOTAL WEIGHT (one heavy edge can cost more than three light ones).
 * A second broken variant: the right idea (always expand the closest unsettled
 * node) but implemented by scanning all nodes for the minimum each step — O(V^2).
 * Fixed with Dijkstra proper: a min-heap keyed by best-known distance, repeatedly
 * pop the closest unsettled node, and "relax" each of its edges (if going through
 * this node reaches a neighbour more cheaply, record the shorter distance and
 * push it). It is essentially BFS with the queue swapped for a priority queue,
 * and it is O((V + E) log V). It requires non-negative edge weights.
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

export const DSA_MODULE_9_PART6: CourseLesson[] = [
  {
    slug: 'dijkstra-shortest-path',
    title: 'Dijkstra: Shortest Paths When Edges Have Weights',
    titleHi: 'Dijkstra: Shortest Paths Jab Edges Ke Weights Hote Hain',
    description: 'Finding the cheapest route on a weighted road network by running plain BFS and counting layers. BFS returns the route with the fewest roads, but a route of three short roads can total far less distance than a single long highway — so the fewest-edges answer is simply not the cheapest one.',
    descriptionHi: 'Ek weighted road network par sabse sasta route dhoondhna plain BFS chalakar aur layers ginkar. BFS sabse kam roads waala route return karta hai, par teen chhoti roads ka ek route ek akele lambe highway se kaafi kam kul doori ho sakta hai — toh sabse-kam-edges jawaab bas sabse sasta nahi hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 6,

    analogy: {
      en: '**Planning a road trip where you want the least total driving time, not the fewest towns passed through.** This module\'s BFS lesson was a subway map where every hop between adjacent stations takes the same one minute — there, "fewest hops" and "fastest" are the same, so counting stations works. A real road network is not like that: the direct road from A to C might be a slow, winding mountain pass, while going A to B to C on two stretches of motorway is fewer minutes even though it is more towns. So counting towns gives the wrong answer. The right method: keep a running best-time estimate for every town, starting at zero for home and infinity for everywhere else. Always drive next to the unvisited town with the smallest current best-time estimate — because with no negative roads, once you actually reach a town by the cheapest route, nothing you discover later can beat it. On arriving at a town, look at each road leaving it: if your time-to-here plus that road\'s driving time is less than the neighbour\'s current estimate, you have found a better way to that neighbour, so lower its estimate. A priority queue keyed by best-time estimate is what lets you always pull out the next-closest town instantly instead of scanning the whole map.',
      hi: '**Ek road trip plan karna jahaan aap sabse kam kul driving time chahte ho, sabse kam towns nahi jinse guzre.** Is module ka BFS lesson ek subway map tha jahaan adjacent stations ke beech har hop ek hi minute leta hai — wahaan, "sabse kam hops" aur "sabse tez" ek hi hain, isliye stations ginna kaam karta hai. Ek asli road network aisa nahi hai: A se C ki seedhi road ek slow, winding mountain pass ho sakti hai, jabki A se B se C do motorway stretches par kam minutes hai chahe ye zyaada towns hai. Toh towns ginna galat jawaab deta hai. Sahi tarika: har town ke liye ek chalta best-time estimate rakho, ghar ke liye zero aur baaki har jagah ke liye infinity se shuru. Hamesha agla us unvisited town tak drive karo jiska sabse chhota current best-time estimate hai — kyunki bina negative roads ke, ek baar aap asal mein sabse saste route se ek town par pahunch jaate ho, aap baad mein jo discover karo wo ise haara nahi sakta. Ek town par pahunchne par, ismein se nikalne waali har road dekho: agar aapka time-to-here plus us road ka driving time neighbour ke current estimate se kam hai, aapne us neighbour tak ek behtar tarika dhoondha, isliye iska estimate kam karo. Best-time estimate se keyed ek priority queue wo hai jo aapko poore map ko scan karne ke bajaye hamesha agle-sabse-kareeb town ko turant nikaalne deta hai.',
    },

    simple: `**Start broken.** Shortest path on a weighted graph, done with plain BFS:

\`\`\`js
// adj[u] = list of { node, weight }
function bfsWeightedBroken(adj, start, target) {
  const queue = [start];
  const dist = new Map([[start, 0]]);
  while (queue.length) {
    const node = queue.shift();
    for (const { node: next, weight } of adj[node]) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);   // counts EDGES, ignores weight
        queue.push(next);
      }
    }
  }
  return dist.get(target);
}

// adj: 0 -> 1 (weight 1), 1 -> 2 (weight 1), 0 -> 2 (weight 5)
// bfsWeightedBroken(adj, 0, 2) returns 1  (the direct edge 0 -> 2, one hop)
// but the real cheapest path is 0 -> 1 -> 2 with total weight 2, not 5.
\`\`\`

BFS visits nodes in fewest-edges order and its distances count edges. On a weighted graph that is the wrong quantity: the one-hop path here has weight 5, and the two-hop path has weight 2. BFS reports the shorter *path* when you asked for the cheaper *route*.

**A second broken attempt: right idea, O(V^2) implementation**

\`\`\`js
function dijkstraSlow(adj, start) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[start] = 0;
  const settled = new Set();
  while (settled.size < adj.length) {
    // scan ALL nodes to find the closest unsettled one — O(V) per step, O(V^2) total
    let u = -1, best = Infinity;
    for (let i = 0; i < adj.length; i++) {
      if (!settled.has(i) && dist[i] < best) { best = dist[i]; u = i; }
    }
    if (u === -1) break;
    settled.add(u);
    for (const { node: v, weight } of adj[u]) {
      if (dist[u] + weight < dist[v]) dist[v] = dist[u] + weight;
    }
  }
  return dist;
}
\`\`\`

This is correct, but finding the closest unsettled node by scanning every node each step is O(V) per step and O(V^2) overall — fine for a few thousand nodes, far too slow for a large sparse graph.

**The fix: Dijkstra with a min-heap**

\`\`\`js
function dijkstra(adj, start) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeap();                 // this course's Module 8, keyed by distance
  pq.insert([0, start]);                    // [distance, node]

  while (pq.size() > 0) {
    const [d, u] = pq.extractMin();
    if (d > dist[u]) continue;              // a stale entry — we already found u cheaper
    for (const { node: v, weight } of adj[u]) {
      const nd = d + weight;
      if (nd < dist[v]) {                   // relax: going through u reaches v more cheaply
        dist[v] = nd;
        pq.insert([nd, v]);
      }
    }
  }
  return dist;
}
\`\`\`

\`\`\`ts
type WGraph = { node: number; weight: number }[][];

function dijkstra(adj: WGraph, start: number): number[] {
  const dist = new Array<number>(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeapOf<[number, number]>((a, b) => a[0] - b[0]);
  pq.insert([0, start]);
  while (pq.size() > 0) {
    const [d, u] = pq.extractMin()!;
    if (d > dist[u]!) continue;
    for (const { node: v, weight } of adj[u]!) {
      const nd = d + weight;
      if (nd < dist[v]!) { dist[v] = nd; pq.insert([nd, v]); }
    }
  }
  return dist;
}
\`\`\`

Structurally this is the BFS from lesson 2 with the plain queue swapped for a min-heap keyed by total distance from the start. Instead of "process nodes in the order they were discovered", it is "process the unsettled node with the smallest known distance next". When a node is popped, its distance is final — because every edge weight is non-negative, no path found later can be shorter. Each edge triggers at most one \`insert\`, so the heap holds O(E) entries and the whole thing is O((V + E) log V). The \`if (d > dist[u]) continue\` line discards stale heap entries left over from earlier, larger estimates.`,

    simpleHi: `**Toote hue se shuru.** Ek weighted graph par shortest path, plain BFS se kiya gaya:

\`\`\`js
// adj[u] = { node, weight } ki list
function bfsWeightedBroken(adj, start, target) {
  const queue = [start];
  const dist = new Map([[start, 0]]);
  while (queue.length) {
    const node = queue.shift();
    for (const { node: next, weight } of adj[node]) {
      if (!dist.has(next)) {
        dist.set(next, dist.get(node) + 1);   // EDGES ginta hai, weight ignore karta hai
        queue.push(next);
      }
    }
  }
  return dist.get(target);
}

// adj: 0 -> 1 (weight 1), 1 -> 2 (weight 1), 0 -> 2 (weight 5)
// bfsWeightedBroken(adj, 0, 2) 1 return karta hai  (seedha edge 0 -> 2, ek hop)
// par asli sabse sasta path 0 -> 1 -> 2 hai kul weight 2 ke saath, 5 nahi.
\`\`\`

BFS nodes ko sabse-kam-edges order mein dekhta hai aur iski distances edges ginti hain. Ek weighted graph par wo galat maatra hai: yahaan one-hop path ka weight 5 hai, aur two-hop path ka weight 2 hai. BFS sabse chhota *path* report karta hai jab aapne sabse sasta *route* poocha.

**Ek doosra toota prayaas: sahi idea, O(V^2) implementation**

\`\`\`js
function dijkstraSlow(adj, start) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[start] = 0;
  const settled = new Set();
  while (settled.size < adj.length) {
    // sabse kareeb unsettled dhoondhne ko SAB nodes scan karo — prati step O(V), kul O(V^2)
    let u = -1, best = Infinity;
    for (let i = 0; i < adj.length; i++) {
      if (!settled.has(i) && dist[i] < best) { best = dist[i]; u = i; }
    }
    if (u === -1) break;
    settled.add(u);
    for (const { node: v, weight } of adj[u]) {
      if (dist[u] + weight < dist[v]) dist[v] = dist[u] + weight;
    }
  }
  return dist;
}
\`\`\`

Ye sahi hai, par har step har node scan karke sabse kareeb unsettled node dhoondhna prati step O(V) aur kul O(V^2) hai — kuch hazaar nodes ke liye theek, ek bade sparse graph ke liye bahut slow.

**Fix: ek min-heap ke saath Dijkstra**

\`\`\`js
function dijkstra(adj, start) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeap();                 // is course ka Module 8, distance se keyed
  pq.insert([0, start]);                    // [distance, node]

  while (pq.size() > 0) {
    const [d, u] = pq.extractMin();
    if (d > dist[u]) continue;              // ek stale entry — hum pehle se u ko sasta dhoondh chuke
    for (const { node: v, weight } of adj[u]) {
      const nd = d + weight;
      if (nd < dist[v]) {                   // relax: u ke through jaana v tak sasta pahunchta hai
        dist[v] = nd;
        pq.insert([nd, v]);
      }
    }
  }
  return dist;
}
\`\`\`

\`\`\`ts
type WGraph = { node: number; weight: number }[][];

function dijkstra(adj: WGraph, start: number): number[] {
  const dist = new Array<number>(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeapOf<[number, number]>((a, b) => a[0] - b[0]);
  pq.insert([0, start]);
  while (pq.size() > 0) {
    const [d, u] = pq.extractMin()!;
    if (d > dist[u]!) continue;
    for (const { node: v, weight } of adj[u]!) {
      const nd = d + weight;
      if (nd < dist[v]!) { dist[v] = nd; pq.insert([nd, v]); }
    }
  }
  return dist;
}
\`\`\`

Structurally ye lesson 2 ka BFS hai jismein plain queue ko start se kul distance se keyed ek min-heap se badla gaya. "Nodes ko unke discover hone ke order mein process karo" ke bajaye, ye "agla sabse chhoti gyaat distance waala unsettled node process karo" hai. Jab ek node pop hota hai, iski distance final hai — kyunki har edge weight non-negative hai, baad mein mila koi path chhota nahi ho sakta. Har edge zyaada se zyaada ek \`insert\` trigger karta hai, isliye heap O(E) entries rakhta hai aur poori cheez O((V + E) log V) hai. \`if (d > dist[u]) continue\` line pehle ke, bade estimates se bachi stale heap entries ko discard karti hai.`,

    content: `## Walking through Dijkstra step by step

\`\`\`
adj:  0 -> {1: 4, 2: 1}
      1 -> {3: 1}
      2 -> {1: 2, 3: 5}
      3 -> {}

dist: [0, inf, inf, inf]        pq: [(0,0)]

pop (0,0). relax 0->1: dist[1] = 4, push (4,1).  relax 0->2: dist[2] = 1, push (1,2).
  dist: [0, 4, 1, inf]          pq: [(1,2), (4,1)]

pop (1,2). relax 2->1: 1 + 2 = 3 < 4, so dist[1] = 3, push (3,1).
           relax 2->3: 1 + 5 = 6, dist[3] = 6, push (6,3).
  dist: [0, 3, 1, 6]            pq: [(3,1), (4,1), (6,3)]

pop (3,1). relax 1->3: 3 + 1 = 4 < 6, so dist[3] = 4, push (4,3).
  dist: [0, 3, 1, 4]            pq: [(4,1), (4,3), (6,3)]

pop (4,1). d = 4 > dist[1] = 3  -> STALE, skip.

pop (4,3). relax 3-> (nothing).
  dist: [0, 3, 1, 4]            pq: [(6,3)]

pop (6,3). d = 6 > dist[3] = 4  -> STALE, skip.  pq empty. Done.

Final: dist = [0, 3, 1, 4].  Note node 1's distance improved 4 -> 3 after
we found the cheaper route through node 2.
\`\`\`

The stale entries \`(4,1)\` and \`(6,3)\` are the cost of not implementing a decrease-key operation on the heap: instead of updating an existing entry, we push a new, smaller one and ignore the old one when it surfaces. This keeps the code simple and the complexity is still O((V + E) log V).

## Why non-negative weights are required

\`\`\`
Dijkstra's core assumption: when a node is popped from the heap with distance d,
that d is its true shortest distance and will never improve.

This holds ONLY if every edge weight is >= 0. With a negative edge, a path that
currently looks long could later drop below d by traversing that negative edge,
so popping a node can no longer "settle" it. Example:
    0 -> 1 (weight 2),  0 -> 2 (weight 5),  2 -> 1 (weight -4)
Dijkstra pops 1 at distance 2 and settles it, but 0 -> 2 -> 1 costs 5 - 4 = 1.
\`\`\`

For graphs with negative edges (but no negative *cycle*), use the Bellman-Ford algorithm: relax every edge V-1 times, O(V * E). It is slower but handles negative weights, and a V-th round that still relaxes something proves a negative cycle exists.

## Recovering the path, not just the distance

\`\`\`js
function dijkstraPath(adj, start, target) {
  const dist = new Array(adj.length).fill(Infinity);
  const prev = new Array(adj.length).fill(-1);
  dist[start] = 0;
  const pq = new MinHeap();
  pq.insert([0, start]);
  while (pq.size() > 0) {
    const [d, u] = pq.extractMin();
    if (d > dist[u]) continue;
    for (const { node: v, weight } of adj[u]) {
      if (d + weight < dist[v]) {
        dist[v] = d + weight;
        prev[v] = u;                       // remember the predecessor on the best path
        pq.insert([dist[v], v]);
      }
    }
  }
  if (dist[target] === Infinity) return null;
  const path = [];
  for (let at = target; at !== -1; at = prev[at]) path.push(at);
  return path.reverse();
}
\`\`\`

Exactly like the BFS parent map from lesson 2: record which node you relaxed each node *from*, then walk \`prev\` backwards from the target.

## Dijkstra is BFS generalised

\`\`\`
BFS (lesson 2)                          Dijkstra (this lesson)
--------------------------------------  --------------------------------------
plain FIFO queue                        min-heap keyed by total distance
every edge counts as 1                  edges carry arbitrary non-negative weights
distance = number of edges              distance = sum of edge weights
mark visited on enqueue, settle once    settle a node when it is popped
O(V + E)                                O((V + E) log V)
\`\`\`

If every weight in a graph is 1, Dijkstra and BFS produce identical distances — BFS is simply the special case where the priority queue degenerates into a plain queue because everything at the front has the same key.`,

    contentHi: `## Dijkstra ke through step by step chalna

\`\`\`
adj:  0 -> {1: 4, 2: 1}
      1 -> {3: 1}
      2 -> {1: 2, 3: 5}
      3 -> {}

dist: [0, inf, inf, inf]        pq: [(0,0)]

pop (0,0). relax 0->1: dist[1] = 4, push (4,1).  relax 0->2: dist[2] = 1, push (1,2).
  dist: [0, 4, 1, inf]          pq: [(1,2), (4,1)]

pop (1,2). relax 2->1: 1 + 2 = 3 < 4, toh dist[1] = 3, push (3,1).
           relax 2->3: 1 + 5 = 6, dist[3] = 6, push (6,3).
  dist: [0, 3, 1, 6]            pq: [(3,1), (4,1), (6,3)]

pop (3,1). relax 1->3: 3 + 1 = 4 < 6, toh dist[3] = 4, push (4,3).
  dist: [0, 3, 1, 4]            pq: [(4,1), (4,3), (6,3)]

pop (4,1). d = 4 > dist[1] = 3  -> STALE, skip.

pop (4,3). relax 3-> (kuch nahi).
  dist: [0, 3, 1, 4]            pq: [(6,3)]

pop (6,3). d = 6 > dist[3] = 4  -> STALE, skip.  pq khaali. Done.

Final: dist = [0, 3, 1, 4].  Dhyaan do node 1 ki distance 4 -> 3 sudhri jab
humne node 2 ke through sasta route dhoondha.
\`\`\`

Stale entries \`(4,1)\` aur \`(6,3)\` heap par ek decrease-key operation na implement karne ki keemat hain: ek maujooda entry update karne ke bajaye, hum ek nayi, chhoti push karte hain aur purani ko ignore karte hain jab ye saamne aati hai. Ye code ko saral rakhta hai aur complexity abhi bhi O((V + E) log V) hai.

## Non-negative weights kyun zaroori hain

\`\`\`
Dijkstra ki core assumption: jab ek node heap se distance d ke saath pop hota hai,
wo d iski asli shortest distance hai aur kabhi sudhregi nahi.

Ye SIRF tab hold karta hai jab har edge weight >= 0 hai. Ek negative edge ke saath, ek path
jo abhi lamba dikhta hai baad mein us negative edge se guzarkar d ke neeche gir sakta hai,
isliye ek node pop karna ise ab "settle" nahi kar sakta. Udaharan:
    0 -> 1 (weight 2),  0 -> 2 (weight 5),  2 -> 1 (weight -4)
Dijkstra 1 ko distance 2 par pop karta hai aur ise settle karta hai, par 0 -> 2 -> 1 5 - 4 = 1 kharch karta hai.
\`\`\`

Negative edges waale graphs ke liye (par koi negative *cycle* nahi), Bellman-Ford algorithm istemal karo: har edge ko V-1 baar relax karo, O(V * E). Ye slower hai par negative weights handle karta hai, aur ek V-vaan round jo abhi bhi kuch relax karta hai saabit karta hai ki ek negative cycle maujood hai.

## Path recover karna, sirf distance nahi

\`\`\`js
function dijkstraPath(adj, start, target) {
  const dist = new Array(adj.length).fill(Infinity);
  const prev = new Array(adj.length).fill(-1);
  dist[start] = 0;
  const pq = new MinHeap();
  pq.insert([0, start]);
  while (pq.size() > 0) {
    const [d, u] = pq.extractMin();
    if (d > dist[u]) continue;
    for (const { node: v, weight } of adj[u]) {
      if (d + weight < dist[v]) {
        dist[v] = d + weight;
        prev[v] = u;                       // best path par predecessor yaad rakho
        pq.insert([dist[v], v]);
      }
    }
  }
  if (dist[target] === Infinity) return null;
  const path = [];
  for (let at = target; at !== -1; at = prev[at]) path.push(at);
  return path.reverse();
}
\`\`\`

Bilkul lesson 2 ke BFS parent map ki tarah: record karo aapne har node ko kis node se relax kiya, phir target se \`prev\` peechhe chalo.

## Dijkstra BFS generalised hai

\`\`\`
BFS (lesson 2)                          Dijkstra (ye lesson)
--------------------------------------  --------------------------------------
plain FIFO queue                        kul distance se keyed min-heap
har edge 1 ginta hai                    edges arbitrary non-negative weights le jaate hain
distance = edges ki tadaad             distance = edge weights ka sum
enqueue par visited mark, ek baar settle  ek node ko pop hone par settle karo
O(V + E)                                O((V + E) log V)
\`\`\`

Agar ek graph mein har weight 1 hai, Dijkstra aur BFS identical distances banate hain — BFS bas wo khaas case hai jahaan priority queue ek plain queue mein degenerate ho jaati hai kyunki saamne har cheez ki wahi key hai.`,

    examples: [
      {
        title: 'Broken: BFS layer count on a weighted graph',
        titleHi: 'Toota: ek weighted graph par BFS layer count',
        code: `dist.set(next, dist.get(node) + 1); // + 1 per edge, ignoring weight`,
        codeJs: `function bfsWeightedBroken(adj, start, target) {
  const queue = [start], dist = new Map([[start, 0]]);
  while (queue.length) {
    const node = queue.shift();
    for (const { node: next } of adj[node]) {
      if (!dist.has(next)) { dist.set(next, dist.get(node) + 1); queue.push(next); }
    }
  }
  return dist.get(target);
}
// adj[0] = [{node:1,weight:1},{node:2,weight:5}], adj[1] = [{node:2,weight:1}]
console.log(bfsWeightedBroken(adj, 0, 2)); // 1  — WRONG, cheapest is 0->1->2 (weight 2)`,
        codeTs: `function bfsWeightedBroken(
  adj: { node: number; weight: number }[][], start: number, target: number,
): number | undefined {
  const queue: number[] = [start];
  const dist = new Map<number, number>([[start, 0]]);
  while (queue.length) {
    const node = queue.shift()!;
    for (const { node: next } of adj[node]!) {
      if (!dist.has(next)) { dist.set(next, dist.get(node)! + 1); queue.push(next); }
    }
  }
  return dist.get(target);
}`,
        output: `1`,
        explain: 'BFS returns the fewest-edges path. Here that is the single edge 0->2 (weight 5), but the two-edge path 0->1->2 has total weight 2. Fewest edges is not cheapest.',
        explainHi: 'BFS sabse-kam-edges path return karta hai. Yahaan wo akela edge 0->2 (weight 5) hai, par two-edge path 0->1->2 ka kul weight 2 hai. Sabse kam edges sabse sasta nahi hai.',
      },
      {
        title: 'Fixed: Dijkstra with a min-heap',
        titleHi: 'Theek: ek min-heap ke saath Dijkstra',
        code: `const [d, u] = pq.extractMin();
if (d > dist[u]) continue;   // stale
for ({node: v, weight} of adj[u])
  if (d + weight < dist[v]) { dist[v] = d + weight; pq.insert([dist[v], v]); }`,
        codeJs: `function dijkstra(adj, start) {
  const dist = new Array(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeap();
  pq.insert([0, start]);
  while (pq.size() > 0) {
    const [d, u] = pq.extractMin();
    if (d > dist[u]) continue;
    for (const { node: v, weight } of adj[u]) {
      if (d + weight < dist[v]) { dist[v] = d + weight; pq.insert([dist[v], v]); }
    }
  }
  return dist;
}
// adj: 0->{1:4,2:1}, 1->{3:1}, 2->{1:2,3:5}, 3->{}
console.log(dijkstra(adj, 0)); // [0, 3, 1, 4]`,
        codeTs: `function dijkstra(adj: { node: number; weight: number }[][], start: number): number[] {
  const dist = new Array<number>(adj.length).fill(Infinity);
  dist[start] = 0;
  const pq = new MinHeapOf<[number, number]>((a, b) => a[0] - b[0]);
  pq.insert([0, start]);
  while (pq.size() > 0) {
    const [d, u] = pq.extractMin()!;
    if (d > dist[u]!) continue;
    for (const { node: v, weight } of adj[u]!) {
      if (d + weight < dist[v]!) { dist[v] = d + weight; pq.insert([dist[v]!, v]); }
    }
  }
  return dist;
}`,
        outputJs: `[0, 3, 1, 4]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Always expand the unsettled node with the smallest known distance. Node 1\'s distance drops from 4 to 3 once the route through node 2 is found; the stale (4,1) entry is skipped later.',
        explainHi: 'Hamesha sabse chhoti gyaat distance waala unsettled node expand karo. Node 1 ki distance 4 se 3 par girti hai jab node 2 ke through route milta hai; stale (4,1) entry baad mein skip hoti hai.',
      },
      {
        title: 'Recovering the path with a prev array',
        titleHi: 'Ek prev array ke saath path recover karna',
        code: `prev[v] = u;   // v's best path currently comes through u
// ...then walk prev backwards from target`,
        codeJs: `// (dijkstraPath from the lesson body)
// adj: 0->{1:4,2:1}, 1->{3:1}, 2->{1:2,3:5}, 3->{}
console.log(dijkstraPath(adj, 0, 3)); // [0, 2, 1, 3]  (total weight 4)`,
        codeTs: `// prev: number[] filled with -1; set prev[v] = u on every successful relax;
// then: for (let at = target; at !== -1; at = prev[at]) path.push(at); path.reverse();`,
        outputJs: `[0, 2, 1, 3]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each time relaxing an edge improves dist[v], record that the improvement came via u. Walking prev backwards from the target reconstructs the cheapest path.',
        explainHi: 'Har baar jab ek edge relax karna dist[v] sudhaarta hai, record karo ki sudhaar u ke zariye aaya. Target se prev peechhe chalna sabse saste path ko reconstruct karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// running Dijkstra on a graph with a negative edge weight
adj[2] = [{ node: 1, weight: -4 }];   // Dijkstra settles node 1 too early`,
        right: `// Dijkstra needs all weights >= 0. For negative edges (no negative cycle)
// use Bellman-Ford: relax every edge V-1 times, O(V * E).`,
        why: 'Dijkstra assumes a popped node\'s distance is final. A negative edge can make a longer-looking path become cheaper later, so a node settled on pop may actually be reachable more cheaply.',
        whyHi: 'Dijkstra maanta hai ki ek pop hue node ki distance final hai. Ek negative edge ek lambe-dikhne waale path ko baad mein sasta bana sakta hai, isliye pop par settle kiya ek node asal mein zyaada saste mein reachable ho sakta hai.',
      },
      {
        wrong: `// forgetting the stale-entry check
const [d, u] = pq.extractMin();
for (const { node: v, weight } of adj[u]) { ... } // re-processes u from an old, larger d`,
        right: `const [d, u] = pq.extractMin();
if (d > dist[u]) continue;   // this heap entry is out of date; skip it`,
        why: 'Because we push a new entry instead of updating an old one, the heap holds several entries per node. Without the check, an old larger-distance entry re-relaxes all of u\'s edges with a wrong d.',
        whyHi: 'Kyunki hum ek purani update karne ke bajaye ek nayi entry push karte hain, heap prati node kai entries rakhta hai. Check ke bina, ek purani badi-distance entry u ke sab edges ko ek galat d ke saath dobara relax karti hai.',
      },
      {
        wrong: `// keying the heap by the edge weight instead of the total distance
pq.insert([weight, v]);   // should be the accumulated distance to v, not one edge`,
        right: `pq.insert([dist[u] + weight, v]);   // total distance from start to v via u`,
        why: 'Dijkstra must always expand the node closest to the START. Keying by a single edge weight makes it expand nodes by local edge cost, which is not a shortest-path order at all.',
        whyHi: 'Dijkstra ko hamesha START ke sabse kareeb node expand karna chahiye. Ek akele edge weight se key karna ise nodes ko local edge cost se expand karvaata hai, jo bilkul ek shortest-path order nahi hai.',
      },
    ],

    realWorld: [
      {
        en: '**Map and navigation apps** run Dijkstra (or A*, which is Dijkstra plus a distance-to-goal heuristic) over a road graph weighted by travel time to compute the fastest route.',
        hi: '**Map aur navigation apps** ek road graph par Dijkstra (ya A*, jo Dijkstra plus ek distance-to-goal heuristic hai) chalate hain travel time se weighted, sabse tez route compute karne ke liye.',
      },
      {
        en: '**Network routing protocols (OSPF and others)** compute shortest paths across the router graph with Dijkstra so packets take the lowest-cost route to their destination.',
        hi: '**Network routing protocols (OSPF aur doosre)** router graph par Dijkstra se shortest paths compute karte hain taaki packets apni destination tak sabse-kam-cost route lein.',
      },
      {
        en: '**Game AI pathfinding** on weighted terrain (mud costs more than road) is Dijkstra or A*; the priority queue is what keeps it fast enough to run every frame.',
        hi: '**Game AI pathfinding** weighted terrain par (mud road se zyaada kharch karti hai) Dijkstra ya A* hai; priority queue wo hai jo ise har frame chalne ke liye kaafi tez rakhti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Dijkstra is often described as "BFS with a priority queue". Explain precisely how it generalises BFS, and why swapping the queue for a heap is the essential change.',
        qHi: 'Dijkstra ko aksar "ek priority queue ke saath BFS" kaha jaata hai. Thik-thik samjhaao ki ye BFS ko kaise generalise karta hai, aur queue ko ek heap se badalna zaroori badlaav kyun hai.',
        a: 'BFS solves the shortest-path problem for the special case where every edge has the same cost, conventionally 1. It works because a plain FIFO queue, fed nodes as they are discovered, happens to hand them back in order of increasing distance from the start: it fully processes all distance-1 nodes before any distance-2 node, and so on. The first time BFS reaches a node, no shorter path to it can exist, because every shorter path would have been fully explored already. Dijkstra keeps that exact strategy: repeatedly take the unsettled node whose current best-known distance is smallest, mark its distance final, and relax its outgoing edges. The only thing that changes is that when edges have different weights, "the node discovered earliest" is no longer "the node closest to the start". A plain queue can only give you insertion order, which on a weighted graph is not distance order. You need a structure that, at every step, hands you the unsettled node with the minimum accumulated distance regardless of when it was inserted — and that is exactly a min-heap keyed by distance. So the queue-to-heap swap is not a performance tweak bolted onto BFS; it is the one structural change that lets the same "always expand the closest unexplored node, and it settles permanently" argument keep working once edges carry weights. Everything else — the visited/settled notion, edge relaxation, the predecessor array for path reconstruction — is BFS\'s machinery carried over almost verbatim. And in the degenerate case where all weights are 1, the heap\'s keys are all equal at the front and it behaves exactly like a FIFO queue, so Dijkstra literally reduces to BFS.',
        aHi: 'BFS shortest-path problem ko us khaas case ke liye solve karta hai jahaan har edge ki wahi cost hai, paramparagat roop se 1. Ye kaam karta hai kyunki ek plain FIFO queue, nodes ko jaise wo discover hote hain feed ki gayi, unhe start se badhti distance ke order mein wapas deti hai: ye sab distance-1 nodes ko kisi bhi distance-2 node se pehle poori tarah process karti hai, aur aise hi. BFS jab pehli baar ek node par pahunchta hai, iska koi chhota path maujood nahi ho sakta, kyunki har chhota path pehle se poori tarah explore ho chuka hota. Dijkstra wo bilkul strategy rakhta hai: baar-baar wo unsettled node lo jiski current best-known distance sabse chhoti hai, iski distance final mark karo, aur iske outgoing edges relax karo. Ekmatra cheez jo badalti hai wo ye hai ki jab edges ke alag weights hote hain, "sabse pehle discover hua node" ab "start ke sabse kareeb node" nahi hai. Ek plain queue aapko sirf insertion order de sakti hai, jo ek weighted graph par distance order nahi hai. Aapko ek aisi structure chahiye jo, har step par, aapko minimum jama distance waala unsettled node de chahe ye kab insert hua tha — aur wo bilkul distance se keyed ek min-heap hai. Toh queue-to-heap swap BFS par bolt kiya gaya ek performance tweak nahi hai; ye wo ek structural badlaav hai jo usi "hamesha sabse kareeb unexplored node expand karo, aur ye hamesha ke liye settle hota hai" tark ko edges ke weights le jaane ke baad kaam karte rehne deta hai. Baaki sab kuch — visited/settled dhaarna, edge relaxation, path reconstruction ke liye predecessor array — BFS ki machinery lagbhag hoo-ba-hoo carry over hai. Aur us degenerate case mein jahaan sab weights 1 hain, heap ki keys saamne sab barabar hain aur ye bilkul ek FIFO queue ki tarah vyavahaar karta hai, isliye Dijkstra literally BFS mein reduce ho jaata hai.',
      },
      {
        q: 'Why does Dijkstra require non-negative edge weights, and what specifically goes wrong if a negative edge is present?',
        qHi: 'Dijkstra ko non-negative edge weights kyun chahiye, aur khaas taur par kya galat hota hai agar ek negative edge maujood hai?',
        a: 'Dijkstra\'s correctness rests on one invariant: at the moment a node is popped from the priority queue, its recorded distance is its true final shortest distance, and it can be settled forever with no further updates. The justification is that the popped node has the smallest tentative distance among all unsettled nodes, and since every remaining path to it must go through some other unsettled node whose tentative distance is at least as large, and every edge adds a non-negative amount, no such path can end up shorter. That last step is where non-negativity is load-bearing. If an edge can have a negative weight, then a path that currently looks long — because it routes through a node with a large tentative distance — might become short after traversing the negative edge, dropping below the distance of a node you already popped and settled. Concretely: with edges 0 to 1 of weight 2, 0 to 2 of weight 5, and 2 to 1 of weight negative 4, Dijkstra pops node 1 at distance 2 and settles it, but the real shortest path 0 to 2 to 1 costs 5 minus 4 equals 1. The settled distance of 2 is simply wrong, and Dijkstra never revisits it. Note the problem is negative edges, not negative cycles specifically — even a single negative edge with no cycle breaks the settle-on-pop guarantee. For graphs with negative edges but no negative cycle, Bellman-Ford works: it relaxes every edge V minus 1 times, which is enough for the shortest path (at most V minus 1 edges) to propagate, at a cost of O(V times E). If a V-th pass still improves something, a negative cycle exists and no shortest path is well-defined.',
        aHi: 'Dijkstra ki correctness ek invariant par tiki hai: jis pal ek node priority queue se pop hota hai, iski recorded distance iski asli final shortest distance hai, aur ise hamesha ke liye settle kiya jaa sakta hai bina aur updates ke. Auchitya ye hai ki pop hua node sab unsettled nodes mein sabse chhoti tentative distance rakhta hai, aur kyunki ispar har baaki path kisi doosre unsettled node se jaana chahiye jiski tentative distance kam se kam utni badi hai, aur har edge ek non-negative maatra jodta hai, aisa koi path chhota nahi nikal sakta. Wo aakhri step wahaan hai jahaan non-negativity load-bearing hai. Agar ek edge ka ek negative weight ho sakta hai, toh ek path jo abhi lamba dikhta hai — kyunki ye ek badi tentative distance waale node se route karta hai — negative edge se guzarne ke baad chhota ho sakta hai, ek aise node ki distance ke neeche girte hue jise aap pehle se pop aur settle kar chuke ho. Thos roop se: edges 0 se 1 weight 2, 0 se 2 weight 5, aur 2 se 1 weight negative 4 ke saath, Dijkstra node 1 ko distance 2 par pop karta hai aur ise settle karta hai, par asli shortest path 0 se 2 se 1 5 minus 4 barabar 1 kharch karta hai. 2 ki settled distance bas galat hai, aur Dijkstra ise kabhi dobara visit nahi karta. Dhyaan do samasya negative edges hai, khaas taur par negative cycles nahi — ek akela negative edge bina cycle ke bhi settle-on-pop guarantee todta hai. Negative edges par koi negative cycle nahi waale graphs ke liye, Bellman-Ford kaam karta hai: ye har edge ko V minus 1 baar relax karta hai, jo shortest path (zyaada se zyaada V minus 1 edges) ke propagate hone ke liye kaafi hai, O(V guna E) ki cost par. Agar ek V-vaan pass abhi bhi kuch sudhaarta hai, ek negative cycle maujood hai aur koi shortest path well-defined nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement dijkstra(adj, start) with a min-heap (reuse the MinHeap from Module 8, keyed by distance). Test on adj: 0->{1:4,2:1}, 1->{3:1}, 2->{1:2,3:5}, 3->{}, from node 0. Confirm dist = [0, 3, 1, 4] and trace the stale-entry skips.',
        taskHi: 'dijkstra(adj, start) ko ek min-heap ke saath implement karo (Module 8 ka MinHeap reuse karo, distance se keyed). adj: 0->{1:4,2:1}, 1->{3:1}, 2->{1:2,3:5}, 3->{} par, node 0 se test karo. Confirm karo dist = [0, 3, 1, 4] aur stale-entry skips trace karo.',
        hint: 'Log every extractMin as (d, u) and print "STALE" whenever d > dist[u]. You should see (4,1) and (6,3) skipped.',
        hintHi: 'Har extractMin ko (d, u) ki tarah log karo aur jab bhi d > dist[u] "STALE" print karo. Aapko (4,1) aur (6,3) skipped dikhne chahiye.',
      },
      {
        task: 'Add a prev array to your Dijkstra and write dijkstraPath(adj, start, target). Test that the cheapest path from 0 to 3 in the graph above is [0, 2, 1, 3] with total weight 4.',
        taskHi: 'Apne Dijkstra mein ek prev array jodo aur dijkstraPath(adj, start, target) likho. Test karo ki upar ke graph mein 0 se 3 tak sabse sasta path [0, 2, 1, 3] hai kul weight 4 ke saath.',
        hint: 'Set prev[v] = u on every relaxation that improves dist[v]. Then for (let at = target; at !== -1; at = prev[at]) path.push(at), and reverse.',
        hintHi: 'Har relaxation par prev[v] = u set karo jo dist[v] sudhaarta hai. Phir for (let at = target; at !== -1; at = prev[at]) path.push(at), aur reverse.',
      },
      {
        task: 'Take a graph with all edge weights equal to 1 and run both your BFS from lesson 2 and your Dijkstra on it. Confirm they return identical distance maps — demonstrating that BFS is the unit-weight special case of Dijkstra.',
        taskHi: 'Ek graph lo jismein sab edge weights 1 ke barabar hain aur ispar apna lesson 2 ka BFS aur apna Dijkstra dono chalao. Confirm karo wo identical distance maps return karte hain — darshaate hue ki BFS Dijkstra ka unit-weight khaas case hai.',
        hint: 'You will need to wrap the unweighted adjacency list as { node, weight: 1 } entries for Dijkstra. The two distance arrays should match element for element.',
        hintHi: 'Aapko unweighted adjacency list ko Dijkstra ke liye { node, weight: 1 } entries ki tarah wrap karna hoga. Do distance arrays element-for-element match hone chahiye.',
      },
    ],

    keyTakeaways: [
      'BFS finds the path with the fewest edges. On a weighted graph that is usually NOT the path with the lowest total weight, so BFS layer counts are the wrong answer.',
      'Dijkstra: keep a best-known distance per node, repeatedly settle the unsettled node with the smallest distance, and relax its edges (dist[v] = min(dist[v], dist[u] + weight)).',
      'Use a min-heap keyed by distance so "pull the closest unsettled node" is O(log V) instead of an O(V) scan. Total: O((V + E) log V).',
      'Instead of a decrease-key operation, push a new (smaller-distance, node) entry and skip stale entries with `if (d > dist[u]) continue`.',
      'Dijkstra requires all edge weights >= 0. A negative edge breaks the "settled on pop" guarantee; use Bellman-Ford (O(V*E)) for negative edges with no negative cycle.',
      'Dijkstra is BFS generalised: swap the FIFO queue for a distance-keyed priority queue. When every weight is 1, Dijkstra and BFS produce identical distances.',
    ],
    keyTakeawaysHi: [
      'BFS sabse kam edges waala path dhoondhta hai. Ek weighted graph par wo aksar sabse kam kul weight waala path NAHI hai, isliye BFS layer counts galat jawaab hain.',
      'Dijkstra: prati node ek best-known distance rakho, baar-baar sabse chhoti distance waale unsettled node ko settle karo, aur iske edges relax karo (dist[v] = min(dist[v], dist[u] + weight)).',
      'Distance se keyed ek min-heap istemal karo taaki "sabse kareeb unsettled node nikaalo" ek O(V) scan ke bajaye O(log V) ho. Kul: O((V + E) log V).',
      'Ek decrease-key operation ke bajaye, ek nayi (chhoti-distance, node) entry push karo aur `if (d > dist[u]) continue` se stale entries skip karo.',
      'Dijkstra ko sab edge weights >= 0 chahiye. Ek negative edge "pop par settled" guarantee todta hai; koi negative cycle na waale negative edges ke liye Bellman-Ford (O(V*E)) istemal karo.',
      'Dijkstra BFS generalised hai: FIFO queue ko ek distance-keyed priority queue se badlo. Jab har weight 1 hai, Dijkstra aur BFS identical distances banate hain.',
    ],
  },
];
