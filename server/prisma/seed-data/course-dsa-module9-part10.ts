/**
 * DSA Complete Course — Module 9: Graphs, lesson 10.
 *
 * The pro end of graph traversal: what a single DFS discovers about the
 * global structure of a graph via discovery times and "low-link" values.
 *   - Strongly Connected Components (Kosaraju's two-pass DFS): partition a
 *     DIRECTED graph into maximal groups where every node can reach every
 *     other. Condensing each SCC to a point turns any digraph into a DAG.
 *   - Bridges and articulation points (Tarjan's low-link, one DFS): the
 *     edges and vertices whose removal disconnects an UNDIRECTED graph —
 *     "critical connections in a network".
 *
 * Broken example: deciding two nodes are in the same SCC because there is a
 * path from one to the other. Reachability one way is not an SCC — you need
 * a path BOTH ways. A plain BFS/DFS reachability check reports huge fake
 * components on a directed acyclic graph, where every real SCC is a single
 * node.
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

export const DSA_MODULE_9_PART10: CourseLesson[] = [
  {
    slug: 'strongly-connected-components-and-bridges',
    title: 'Strongly Connected Components and Bridges',
    titleHi: 'Strongly Connected Components Aur Bridges',
    description: 'Grouping the nodes of a directed graph into "mutually reachable" clusters by checking, for each pair, whether a path exists from one to the other. On a directed acyclic graph — a pipeline of stages, a dependency chain — that check says nearly everything is in one giant cluster, because reachability flows one way. A real strongly connected component needs a path in BOTH directions, which on a DAG means every component is a single node.',
    descriptionHi: 'Ek directed graph ke nodes ko "aapsi pahunch yogya" clusters mein group karna har jodi ke liye ye check karke ki kya ek se doosre tak ek path maujood hai. Ek directed acyclic graph par — stages ki ek pipeline, ek dependency chain — wo check kehta hai ki lagbhag sab kuch ek vishaal cluster mein hai, kyunki reachability ek disha mein behti hai. Ek asli strongly connected component ko DONO dishaon mein ek path chahiye, jo ek DAG par matlab har component ek akela node hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 10,

    analogy: {
      en: '**Grouping a city\'s neighbourhoods by whether you can drive a round trip between them, given that many streets are one-way.** If you can drive from A to B but every route back forces you the long way through a dozen other places, A and B are still in the same "you can loop between them" group only if some route back exists at all. The neighbourhoods split into clusters where, within a cluster, you can get from anywhere to anywhere and back; between clusters, traffic only ever flows one direction. Once you have those clusters, the whole city map simplifies: treat each cluster as a single super-neighbourhood, and the one-way roads between clusters form a map with no loops — a clean hierarchy you can reason about. A separate but related question, this time on a city with only two-way streets: which single bridges, if closed for repair, would cut some neighbourhood off entirely? A bridge is a road that is the only link between two halves of the city — there is no alternative route around it. You find these by walking the city once, noting the order you first reach each place, and checking whether any place on the far side of a road can reach back to somewhere you visited before that road — if not, the road is a bridge.',
      hi: '**Ek shehar ke neighbourhoods ko is par group karna ki kya aap unke beech ek round trip drive kar sakte ho, ye dekhte hue ki kayi streets one-way hain.** Agar aap A se B tak drive kar sakte ho par har wapsi route aapko ek dozen doosri jagahon se lamba raasta majboor karta hai, A aur B abhi bhi usi "aap unke beech loop kar sakte ho" group mein hain sirf agar koi wapsi route bilkul maujood hai. Neighbourhoods clusters mein baantte hain jahaan, ek cluster ke andar, aap kahin se kahin bhi aur wapas jaa sakte ho; clusters ke beech, traffic sirf ek disha behta hai. Ek baar aapke paas wo clusters hain, poora shehar ka naksha saral ho jaata hai: har cluster ko ek akele super-neighbourhood ki tarah maano, aur clusters ke beech one-way roads bina loops ka ek naksha banaate hain — ek saaf hierarchy jispar aap tark kar sakte ho. Ek alag par sambandhit sawaal, is baar sirf two-way streets waale ek shehar par: kaunse akele bridges, agar repair ke liye band, kisi neighbourhood ko poori tarah kaat denge? Ek bridge ek road hai jo shehar ke do aadhon ke beech ekmatra link hai — iske aas-paas koi vaikalpik route nahi. Aap inhe shehar mein ek baar chalkar dhoondhte ho, us kram ko note karke jismein aap pehli baar har jagah pahunchte ho.',
    },

    simple: `**Start broken.** "Same SCC" judged by one-way reachability:

\`\`\`js
function sameComponentBroken(n, adj) {
  // group u and v together if u can reach v (BFS from u)
  const reach = (start) => {
    const seen = new Set([start]), q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); }
    }
    return seen;
  };
  const comp = new Array(n).fill(-1);
  let id = 0;
  for (let u = 0; u < n; u++) {
    if (comp[u] !== -1) continue;
    for (const v of reach(u)) if (comp[v] === -1) comp[v] = id;
    id++;
  }
  return comp;
}

// DAG: 0 -> 1 -> 2 -> 3
console.log(sameComponentBroken(4, [[1], [2], [3], []]));
// [0, 0, 0, 0]  -> claims all one component. WRONG: each node is its own SCC.
\`\`\`

Reachability from \`u\` includes everything downstream of \`u\`, but an SCC requires \`u\` and \`v\` to reach *each other*. On a DAG nobody can loop back, so every SCC is a single node — yet the one-way check lumps the whole chain together.

**The fix: Kosaraju — two DFS passes, the second on the reversed graph**

\`\`\`js
function kosaraju(n, adj) {
  const radj = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]) radj[v].push(u);   // reverse every edge

  // PASS 1: DFS on the original graph, push nodes onto 'order' as they FINISH
  const seen = new Array(n).fill(false);
  const order = [];
  const dfs1 = (u) => {
    seen[u] = true;
    for (const v of adj[u]) if (!seen[v]) dfs1(v);
    order.push(u);                       // finish time: last to finish, first out
  };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);

  // PASS 2: DFS on the REVERSED graph, in reverse finish order; each tree is one SCC
  const comp = new Array(n).fill(-1);
  const dfs2 = (u, id) => {
    comp[u] = id;
    for (const v of radj[u]) if (comp[v] === -1) dfs2(v, id);
  };
  let id = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    if (comp[order[i]] === -1) dfs2(order[i], id++);
  }
  return { comp, count: id };
}

// 0<->1, 1->2, 2->3, 3->2   (SCCs: {0,1}, {2,3})
console.log(kosaraju(4, [[1], [0, 2], [3], [2]]));
// { comp: [0, 0, 1, 1], count: 2 }
\`\`\`

\`\`\`ts
function kosaraju(n: number, adj: number[][]): { comp: number[]; count: number } {
  const radj: number[][] = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) radj[v]!.push(u);
  const seen = new Array<boolean>(n).fill(false);
  const order: number[] = [];
  const dfs1 = (u: number): void => {
    seen[u] = true;
    for (const v of adj[u]!) if (!seen[v]) dfs1(v);
    order.push(u);
  };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);
  const comp = new Array<number>(n).fill(-1);
  const dfs2 = (u: number, id: number): void => {
    comp[u] = id;
    for (const v of radj[u]!) if (comp[v] === -1) dfs2(v, id);
  };
  let id = 0;
  for (let i = order.length - 1; i >= 0; i--) if (comp[order[i]!] === -1) dfs2(order[i]!, id++);
  return { comp, count: id };
}
\`\`\`

The trick: after pass 1, the node that finished last sits at the top of some SCC in the "condensation" DAG. Running DFS from it on the *reversed* graph can only reach nodes in its own SCC — because any edge that left the SCC in the original graph now points *into* it, blocking the way out. Each pass-2 tree is exactly one SCC. O(V + E).`,

    simpleHi: `**Toote hue se shuru.** "Same SCC" ek-disha reachability se judged:

\`\`\`js
function sameComponentBroken(n, adj) {
  // u aur v ko saath group karo agar u, v tak pahunch sakta hai (u se BFS)
  const reach = (start) => {
    const seen = new Set([start]), q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); }
    }
    return seen;
  };
  const comp = new Array(n).fill(-1);
  let id = 0;
  for (let u = 0; u < n; u++) {
    if (comp[u] !== -1) continue;
    for (const v of reach(u)) if (comp[v] === -1) comp[v] = id;
    id++;
  }
  return comp;
}

// DAG: 0 -> 1 -> 2 -> 3
console.log(sameComponentBroken(4, [[1], [2], [3], []]));
// [0, 0, 0, 0]  -> daawa karta hai sab ek component. GALAT: har node apna SCC hai.
\`\`\`

\`u\` se reachability mein \`u\` ke downstream sab kuch hai, par ek SCC ko chahiye ki \`u\` aur \`v\` *ek doosre* tak pahunchein. Ek DAG par koi wapas loop nahi kar sakta, isliye har SCC ek akela node hai — phir bhi ek-disha check poori chain ko saath jod deta hai.

**Fix: Kosaraju — do DFS passes, doosra reversed graph par**

\`\`\`js
function kosaraju(n, adj) {
  const radj = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]) radj[v].push(u);   // har edge ulto

  // PASS 1: original graph par DFS, nodes ko 'order' par push karo jab wo KHATAM hon
  const seen = new Array(n).fill(false);
  const order = [];
  const dfs1 = (u) => {
    seen[u] = true;
    for (const v of adj[u]) if (!seen[v]) dfs1(v);
    order.push(u);                       // finish time: aakhri khatam, pehla baahar
  };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);

  // PASS 2: REVERSED graph par DFS, ulte finish order mein; har tree ek SCC hai
  const comp = new Array(n).fill(-1);
  const dfs2 = (u, id) => {
    comp[u] = id;
    for (const v of radj[u]) if (comp[v] === -1) dfs2(v, id);
  };
  let id = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    if (comp[order[i]] === -1) dfs2(order[i], id++);
  }
  return { comp, count: id };
}

// 0<->1, 1->2, 2->3, 3->2   (SCCs: {0,1}, {2,3})
console.log(kosaraju(4, [[1], [0, 2], [3], [2]]));
// { comp: [0, 0, 1, 1], count: 2 }
\`\`\`

\`\`\`ts
function kosaraju(n: number, adj: number[][]): { comp: number[]; count: number } {
  const radj: number[][] = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) radj[v]!.push(u);
  const seen = new Array<boolean>(n).fill(false);
  const order: number[] = [];
  const dfs1 = (u: number): void => {
    seen[u] = true;
    for (const v of adj[u]!) if (!seen[v]) dfs1(v);
    order.push(u);
  };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);
  const comp = new Array<number>(n).fill(-1);
  const dfs2 = (u: number, id: number): void => {
    comp[u] = id;
    for (const v of radj[u]!) if (comp[v] === -1) dfs2(v, id);
  };
  let id = 0;
  for (let i = order.length - 1; i >= 0; i--) if (comp[order[i]!] === -1) dfs2(order[i]!, id++);
  return { comp, count: id };
}
\`\`\`

Trick: pass 1 ke baad, jo node aakhri khatam hua wo "condensation" DAG mein kisi SCC ke top par baithta hai. Usse *reversed* graph par DFS chalana sirf iske apne SCC ke nodes tak pahunch sakta hai — kyunki koi bhi edge jo original graph mein SCC chhod gaya ab ismein *andar* point karta hai, baahar ka raasta rok kar. Har pass-2 tree bilkul ek SCC hai. O(V + E).`,

    content: `## Bridges and articulation points — one DFS, discovery time vs low-link

\`\`\`
As DFS visits nodes, give each a DISCOVERY TIME disc[u] (a counter).
Compute LOW[u] = the smallest discovery time reachable from u's subtree by
  going down tree edges and taking AT MOST ONE back edge.

For a tree edge (u -> v):
  BRIDGE          if  low[v] > disc[u]     (v's subtree cannot get back to u
                                            or above without using this edge)
  ARTICULATION    if  low[v] >= disc[u]    (removing u would strand v's subtree)
                  ... plus: the DFS root is an articulation point iff it has
                  >= 2 DFS children.
\`\`\`

\`\`\`js
function findBridges(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }

  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  const bridges = [];
  let timer = 0;

  const dfs = (u, parent) => {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;                 // don't bounce back on the edge we came in
      if (disc[v] === -1) {                        // tree edge
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else {                                     // back edge
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };

  for (let u = 0; u < n; u++) if (disc[u] === -1) dfs(u, -1);
  return bridges;
}

// 0-1, 1-2, 2-0, 1-3, 3-4    bridges: [1,3] and [3,4]
console.log(findBridges(5, [[0,1],[1,2],[2,0],[1,3],[3,4]]));   // [[3, 4], [1, 3]]  (order not significant)
\`\`\`

\`\`\`
WHY low[v] > disc[u] MEANS BRIDGE:
  low[v] is the earliest node v's whole subtree can climb back to.
  If that is still LATER than u (deeper in the DFS), then nothing under v
  has a back edge reaching u or an ancestor of u. The only connection
  between {v's subtree} and the rest of the graph is the edge (u, v).
  Cut it -> the subtree falls off.  That is the definition of a bridge.

The "parent" skip must handle PARALLEL edges: if there are two edges between
u and v, only skip ONE of them (track the edge, not just the node).
\`\`\`

## The condensation DAG — why SCCs matter beyond the count

\`\`\`
Contract every SCC to a single super-node. The edges between SCCs form a
DAG (no cycles — a cycle of SCCs would merge into one bigger SCC).

That means: any question about a general directed graph that is easy on a DAG
  becomes easy after condensing.  Examples:
  - "is there a path from every node to every other" -> the condensation has 1 node
  - "longest path in a directed graph" (NP-hard in general) -> becomes a DAG
     longest-path (linear) on the condensation
  - 2-SAT: build the implication graph, run SCC; a variable and its negation
     in the SAME SCC means UNSATISFIABLE
\`\`\`

## Choosing the tool

\`\`\`
DIRECTED graph, "mutually reachable groups"        Kosaraju (2 DFS) or Tarjan (1 DFS)
"can everyone reach everyone" (strong connectivity) SCC count == 1
"longest path / 2-SAT / cycle structure" on a digraph  condense to the DAG first
UNDIRECTED, "single edge whose loss disconnects"   bridges (low-link, 1 DFS)
UNDIRECTED, "single vertex whose loss disconnects" articulation points (low-link)
"critical connections in a network" (LeetCode 1192) exactly find-bridges
"redundant connection" (find the cycle edge)       union-find (Module 9 lesson 5)

Interview tell: DIRECTED + "cycles / mutual reachability / consistency" -> SCC.
UNDIRECTED + "what single failure breaks connectivity" -> bridges / articulation.
Both are a DFS annotated with discovery times; that annotation is the whole idea.
\`\`\``,

    contentHi: `## Bridges aur articulation points — ek DFS, discovery time vs low-link

\`\`\`
Jaise DFS nodes visit karta hai, har ko ek DISCOVERY TIME disc[u] do (ek counter).
LOW[u] = sabse chhota discovery time compute karo jo u ke subtree se pahuncha
  jaa sakta hai tree edges se neeche jaakar aur ZYAADA SE ZYAADA EK back edge lekar.

Ek tree edge (u -> v) ke liye:
  BRIDGE          agar  low[v] > disc[u]     (v ka subtree is edge ke bina u ya
                                              upar wapas nahi jaa sakta)
  ARTICULATION    agar  low[v] >= disc[u]    (u hataana v ke subtree ko atkaa dega)
                  ... plus: DFS root ek articulation point hai iff iske
                  >= 2 DFS children hon.
\`\`\`

\`\`\`js
function findBridges(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }

  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  const bridges = [];
  let timer = 0;

  const dfs = (u, parent) => {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;                 // jis edge se aaye us par wapas mat kudo
      if (disc[v] === -1) {                        // tree edge
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else {                                     // back edge
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };

  for (let u = 0; u < n; u++) if (disc[u] === -1) dfs(u, -1);
  return bridges;
}

// 0-1, 1-2, 2-0, 1-3, 3-4    bridges: [1,3] aur [3,4]
console.log(findBridges(5, [[0,1],[1,2],[2,0],[1,3],[3,4]]));   // [[3, 4], [1, 3]]  (order not significant)
\`\`\`

\`\`\`
low[v] > disc[u] KA MATLAB BRIDGE KYUN:
  low[v] sabse pehla node hai jispar v ka poora subtree wapas chadh sakta hai.
  Agar wo abhi bhi u se BAAD hai (DFS mein gehra), toh v ke neeche kuch bhi
  u ya u ke ancestor tak pahunchne waala ek back edge nahi rakhta. {v ka subtree}
  aur baaki graph ke beech ekmatra connection edge (u, v) hai.
  Ise kaato -> subtree gir jaata hai.  Wahi ek bridge ki paribhaasha hai.

"parent" skip ko PARALLEL edges sambhaalne chahiye: agar u aur v ke beech do
edges hain, sirf EK ko skip karo (edge track karo, sirf node nahi).
\`\`\`

## Condensation DAG — SCCs count se aage kyun maayne rakhte hain

\`\`\`
Har SCC ko ek akele super-node mein contract karo. SCCs ke beech edges ek
DAG banaate hain (koi cycles nahi — SCCs ka ek cycle ek bade SCC mein merge hoga).

Iska matlab: ek general directed graph ke baare mein koi bhi sawaal jo ek DAG par
  aasaan hai condense karne ke baad aasaan ho jaata hai.  Udaharan:
  - "kya har node se har doosre tak ek path hai" -> condensation ka 1 node hai
  - "ek directed graph mein longest path" (general mein NP-hard) -> condensation par
     ek DAG longest-path (linear) ban jaata hai
  - 2-SAT: implication graph banao, SCC chalao; ek variable aur iska negation
     USI SCC mein matlab UNSATISFIABLE
\`\`\`

## Tool chunna

\`\`\`
DIRECTED graph, "aapsi pahunch yogya groups"        Kosaraju (2 DFS) ya Tarjan (1 DFS)
"kya har koi har kisi tak pahunch sakta hai"        SCC count == 1
digraph par "longest path / 2-SAT / cycle structure"  pehle DAG mein condense karo
UNDIRECTED, "ek edge jiska nuksaan disconnect karta hai"  bridges (low-link, 1 DFS)
UNDIRECTED, "ek vertex jiska nuksaan disconnect karta hai" articulation points (low-link)
"critical connections in a network" (LeetCode 1192) bilkul find-bridges
"redundant connection" (cycle edge dhoondho)       union-find (Module 9 lesson 5)

Interview sanket: DIRECTED + "cycles / mutual reachability / consistency" -> SCC.
UNDIRECTED + "kaunsa ek failure connectivity todta hai" -> bridges / articulation.
Dono discovery times se annotate ek DFS hain; wo annotation hi poora idea hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: one-way reachability is not an SCC',
        titleHi: 'Toota: ek-disha reachability ek SCC nahi hai',
        code: `for (const v of reach(u)) comp[v] = id;   // "u reaches v" != "u and v in same SCC"`,
        codeJs: `function sameComponentBroken(n, adj) {
  const reach = (start) => {
    const seen = new Set([start]), q = [start];
    while (q.length) { const u = q.shift(); for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); } }
    return seen;
  };
  const comp = new Array(n).fill(-1);
  let id = 0;
  for (let u = 0; u < n; u++) {
    if (comp[u] !== -1) continue;
    for (const v of reach(u)) if (comp[v] === -1) comp[v] = id;
    id++;
  }
  return comp;
}
console.log(sameComponentBroken(4, [[1], [2], [3], []]));       // [0,0,0,0] — DAG, want [0,1,2,3]
console.log(sameComponentBroken(3, [[1], [2], [0]]));           // [0,0,0] — a real cycle, correct by luck`,
        codeTs: `function sameComponentBroken(n: number, adj: number[][]): number[] {
  const reach = (start: number): Set<number> => {
    const seen = new Set<number>([start]); const q = [start];
    while (q.length) { const u = q.shift()!; for (const v of adj[u]!) if (!seen.has(v)) { seen.add(v); q.push(v); } }
    return seen;
  };
  const comp = new Array<number>(n).fill(-1);
  let id = 0;
  for (let u = 0; u < n; u++) {
    if (comp[u] !== -1) continue;
    for (const v of reach(u)) if (comp[v] === -1) comp[v] = id;
    id++;
  }
  return comp;
}`,
        outputJs: `[ 0, 0, 0, 0 ]
[ 0, 0, 0 ]`,
        outputTs: `// The DAG case is wrong: on 0->1->2->3 every SCC is a single node.`,
        explain: 'Reachability from node 0 on the chain 0->1->2->3 is {0,1,2,3}, so the broken code declares one component. But an SCC needs mutual reachability — node 3 cannot get back to 0. On a DAG the answer is always "every node is its own SCC".',
        explainHi: 'Chain 0->1->2->3 par node 0 se reachability {0,1,2,3} hai, isliye toota code ek component ghoshit karta hai. Par ek SCC ko aapsi reachability chahiye — node 3 wapas 0 tak nahi jaa sakta. Ek DAG par jawaab hamesha "har node apna SCC hai".',
      },
      {
        title: 'Fixed: Kosaraju two-pass DFS',
        titleHi: 'Theek: Kosaraju two-pass DFS',
        code: `dfs1 pushes on finish; then dfs2 on the REVERSED graph in reverse finish order`,
        codeJs: `function kosaraju(n, adj) {
  const radj = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]) radj[v].push(u);
  const seen = new Array(n).fill(false);
  const order = [];
  const dfs1 = (u) => { seen[u] = true; for (const v of adj[u]) if (!seen[v]) dfs1(v); order.push(u); };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);
  const comp = new Array(n).fill(-1);
  const dfs2 = (u, id) => { comp[u] = id; for (const v of radj[u]) if (comp[v] === -1) dfs2(v, id); };
  let id = 0;
  for (let i = order.length - 1; i >= 0; i--) if (comp[order[i]] === -1) dfs2(order[i], id++);
  return { comp, count: id };
}
console.log(kosaraju(4, [[1], [2], [3], []]));              // DAG -> count 4
console.log(kosaraju(4, [[1], [0, 2], [3], [2]]));          // {0,1}, {2,3} -> count 2
console.log(kosaraju(5, [[1], [2], [0, 3], [4], [3]]));     // {0,1,2}, {3,4} -> count 2`,
        codeTs: `function kosaraju(n: number, adj: number[][]): { comp: number[]; count: number } {
  const radj: number[][] = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) radj[v]!.push(u);
  const seen = new Array<boolean>(n).fill(false);
  const order: number[] = [];
  const dfs1 = (u: number): void => { seen[u] = true; for (const v of adj[u]!) if (!seen[v]) dfs1(v); order.push(u); };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs1(u);
  const comp = new Array<number>(n).fill(-1);
  const dfs2 = (u: number, id: number): void => { comp[u] = id; for (const v of radj[u]!) if (comp[v] === -1) dfs2(v, id); };
  let id = 0;
  for (let i = order.length - 1; i >= 0; i--) if (comp[order[i]!] === -1) dfs2(order[i]!, id++);
  return { comp, count: id };
}`,
        outputJs: `{ comp: [ 0, 1, 2, 3 ], count: 4 }
{ comp: [ 0, 0, 1, 1 ], count: 2 }
{ comp: [ 0, 0, 0, 1, 1 ], count: 2 }`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Pass 1 records nodes by finish time. Pass 2 processes them in reverse finish order on the reversed graph. The first node processed is a "sink" of the condensation DAG, so on the reversed graph its DFS reaches exactly its own SCC — every incoming edge from another SCC is now outgoing and blocked.',
        explainHi: 'Pass 1 nodes ko finish time se record karta hai. Pass 2 unhe reversed graph par ulte finish order mein process karta hai. Pehla process kiya node condensation DAG ka ek "sink" hai, isliye reversed graph par iska DFS bilkul iske apne SCC tak pahunchta hai.',
      },
      {
        title: 'Bridges via low-link (critical connections)',
        titleHi: 'Low-link se bridges (critical connections)',
        code: `if (low[v] > disc[u]) bridges.push([u, v]);   // v's subtree cannot reach u or above`,
        codeJs: `function findBridges(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const disc = new Array(n).fill(-1), low = new Array(n).fill(-1);
  const bridges = [];
  let timer = 0;
  const dfs = (u, parent) => {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };
  for (let u = 0; u < n; u++) if (disc[u] === -1) dfs(u, -1);
  return bridges;
}
console.log(findBridges(5, [[0,1],[1,2],[2,0],[1,3],[3,4]]));   // [[3,4],[1,3]] (DFS finish order; any order is fine)
console.log(findBridges(4, [[0,1],[1,2],[2,3]]));               // [[2,3],[1,2],[0,1]] — a path: all bridges
console.log(findBridges(3, [[0,1],[1,2],[2,0]]));               // [] — a cycle: no bridges`,
        codeTs: `function findBridges(n: number, edges: number[][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a!]!.push(b!); adj[b!]!.push(a!); }
  const disc = new Array<number>(n).fill(-1), low = new Array<number>(n).fill(-1);
  const bridges: number[][] = [];
  let timer = 0;
  const dfs = (u: number, parent: number): void => {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]!) {
      if (v === parent) continue;
      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u]!, low[v]!);
        if (low[v]! > disc[u]!) bridges.push([u, v]);
      } else low[u] = Math.min(low[u]!, disc[v]!);
    }
  };
  for (let u = 0; u < n; u++) if (disc[u] === -1) dfs(u, -1);
  return bridges;
}`,
        outputJs: `[ [ 3, 4 ], [ 1, 3 ] ]
[ [ 2, 3 ], [ 1, 2 ], [ 0, 1 ] ]
[]`,
        outputTs: `// Bridges come out in DFS finish order (deepest first); order is not significant.`,
        explain: 'The triangle 0-1-2 has back edges, so every node\'s low value climbs back to 0 — no bridge inside it. Edge 1-3 and 3-4 have no alternative route around them (low[3] and low[4] stay above disc[1] and disc[3]), so they are bridges. A pure path has a bridge at every edge; a pure cycle has none.',
        explainHi: 'Triangle 0-1-2 ke back edges hain, isliye har node ka low value wapas 0 tak chadhta hai — iske andar koi bridge nahi. Edge 1-3 aur 3-4 ke aas-paas koi vaikalpik route nahi (low[3] aur low[4] disc[1] aur disc[3] se upar rehte hain), isliye wo bridges hain. Ek shuddh path ke har edge par ek bridge hai; ek shuddh cycle ke koi nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `// SCC by a single DFS on the original graph, calling each DFS tree an SCC
const dfs = (u, id) => { comp[u] = id; for (const v of adj[u]) if (comp[v] === -1) dfs(v, id); };
for (let u = 0; u < n; u++) if (comp[u] === -1) dfs(u, id++);
// merges an entire reachable region into one "component"`,
        right: `// need the two-pass structure: finish-order DFS, then DFS on the REVERSED graph
// (Kosaraju), or Tarjan's single DFS with an explicit stack and low-link values`,
        why: 'A single forward DFS groups everything reachable from a start node, which is a much coarser partition than SCCs — it would call all of 0->1->2->3 one component. You need reachability in both directions, which Kosaraju gets by also traversing the reversed graph, and Tarjan gets by tracking which nodes are still on the DFS stack.',
        whyHi: 'Ek akela forward DFS ek start node se reachable sab kuch group karta hai, jo SCCs se ek bahut mota vibhaajan hai — ye 0->1->2->3 ko ek component kahega. Aapko dono dishaon mein reachability chahiye, jo Kosaraju reversed graph bhi traverse karke paata hai, aur Tarjan ye track karke paata hai ki kaunse nodes abhi bhi DFS stack par hain.',
      },
      {
        wrong: `// bridge DFS: updating low[u] from disc[v] on a TREE edge
if (disc[v] === -1) { dfs(v, u); low[u] = Math.min(low[u], disc[v]); }   // should be low[v]`,
        right: `if (disc[v] === -1) { dfs(v, u); low[u] = Math.min(low[u], low[v]); }   // tree edge: use low[v]
else low[u] = Math.min(low[u], disc[v]);                                 // back edge: use disc[v]`,
        why: 'On a tree edge you have just fully explored v\'s subtree, so low[v] already summarises the earliest node that subtree can reach — that is what should propagate up. On a back edge you have not explored v (it is an ancestor), so you use its discovery time disc[v] directly. Swapping them makes low values too large and misses bridges.',
        whyHi: 'Ek tree edge par aapne abhi v ke subtree ko poori tarah explore kiya, isliye low[v] pehle se sabse pehle node ka saaraansh deta hai jo wo subtree pahunch sakta hai — wahi upar propagate hona chahiye. Ek back edge par aapne v ko explore nahi kiya (wo ek ancestor hai), isliye aap iska discovery time disc[v] seedhe istemal karte ho. Unhe swap karna low values bahut badi banaata hai aur bridges chhod deta hai.',
      },
      {
        wrong: `// skipping the parent by node id, breaking on parallel edges
if (v === parent) continue;
// with two edges between u and its parent, BOTH get skipped -> a real cycle
// through the parallel pair is missed, and the single edge looks like a bridge`,
        right: `// skip the specific edge you arrived on, not every edge to the parent node:
if (v === parent && !usedParentEdgeAlready) { usedParentEdgeAlready = true; continue; }
// or pass the edge index and skip that exact index`,
        why: 'Two parallel edges between u and its parent form a tiny cycle, so neither is a bridge. Skipping by parent node id discards both, so the algorithm thinks u connects to its parent only through the DFS tree edge and wrongly flags it as a bridge. Track the edge, not just the neighbouring node.',
        whyHi: 'u aur iske parent ke beech do parallel edges ek chhota cycle banaate hain, isliye koi bridge nahi hai. Parent node id se skip karna dono ko phenk deta hai, isliye algorithm sochta hai u apne parent se sirf DFS tree edge ke zariye judta hai aur galat tarike se ise ek bridge flag karta hai. Edge track karo, sirf padosi node nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Network reliability engineering** runs bridge-finding on the topology graph to identify links that have no redundancy — a single fibre cut on a bridge partitions the network, so those get priority for a backup path.',
        hi: '**Network reliability engineering** topology graph par bridge-finding chalaata hai un links ko pehchaanne ke liye jinmein koi redundancy nahi — ek bridge par ek akela fibre cut network ko baant deta hai, isliye unhe ek backup path ke liye priority milti hai.',
      },
      {
        en: '**Compilers and static analysis** compute SCCs of the call graph or the control-flow graph to find mutual recursion, and of the type-constraint graph to detect cyclic dependencies that must be resolved together.',
        hi: '**Compilers aur static analysis** call graph ya control-flow graph ke SCCs compute karte hain mutual recursion dhoondhne ko, aur type-constraint graph ke cyclic dependencies pakadne ko jo saath resolve honi chahiye.',
      },
      {
        en: '**2-SAT solvers** — used in scheduling, layout, and constraint problems — build an implication graph and check SCCs: if a variable and its negation land in the same SCC, the constraints are contradictory.',
        hi: '**2-SAT solvers** — scheduling, layout, aur constraint problems mein istemal — ek implication graph banaate hain aur SCCs check karte hain: agar ek variable aur iska negation usi SCC mein land karte hain, constraints virodhi hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain Kosaraju\'s algorithm. Why does the second pass on the reversed graph give exactly the SCCs?',
        qHi: 'Kosaraju ka algorithm samjhaao. Reversed graph par doosra pass bilkul SCCs kyun deta hai?',
        a: 'Kosaraju runs two depth-first traversals. The first is on the original graph, and its only job is to produce an ordering of the nodes by the time each one finishes — that is, when the DFS has fully explored everything below it and is about to return. You push each node onto a list at that moment, so the list ends with the node that finished last. The second traversal is on the graph with every edge reversed, and you process the nodes in the reverse of that finish order — last-finished first. Each tree that this second traversal grows is one strongly connected component. The reason it works comes from thinking about the condensation, which is the graph you get by contracting each SCC to a single point; that condensation is always a DAG. The node that finished last in the first pass belongs to an SCC that is a source in the condensation — nothing in the condensation points into it. Equivalently, in the reversed graph, that SCC is a sink: every edge that used to leave it now enters it, and no edge leaves it to another SCC. So when you start the second DFS from that node on the reversed graph, you can only reach nodes within its own SCC, because there is no reversed edge carrying you out to a different component. You mark all of them as component zero. Then you move to the next unmarked node in reverse finish order, which is the source of the next SCC in the remaining condensation, and the same argument applies — its reversed-graph DFS is trapped inside its SCC, except for edges into components you have already fully marked, which the visited check skips. Each pass is linear in nodes plus edges, and building the reversed adjacency list is also linear, so the whole thing is O of V plus E. Tarjan\'s algorithm gets the same result in a single DFS by maintaining an explicit stack of nodes and a low-link value per node, popping a whole SCC off the stack whenever a node\'s low-link equals its own discovery time; it is one pass instead of two but the bookkeeping is fiddlier.',
        aHi: 'Kosaraju do depth-first traversals chalaata hai. Pehla original graph par hai, aur iska ekmatra kaam nodes ki ek ordering banaana hai us samay se jab har ek khatam hota hai — matlab, jab DFS ne iske neeche sab kuch poori tarah explore kar liya aur return karne waala hai. Aap us pal har node ko ek list par push karte ho, isliye list us node se khatam hoti hai jo aakhri khatam hua. Doosra traversal har edge reversed waale graph par hai, aur aap nodes ko us finish order ke ulte mein process karte ho — aakhri-khatam pehle. Har tree jo ye doosra traversal ugaata hai ek strongly connected component hai. Ye kyun kaam karta hai iska kaaran condensation ke baare mein sochne se aata hai, jo wo graph hai jo aap har SCC ko ek akele bindu mein contract karke paate ho; wo condensation hamesha ek DAG hai. Pehle pass mein jo node aakhri khatam hua wo ek aise SCC ka hissa hai jo condensation mein ek source hai. Reversed graph mein, wo SCC ek sink hai: har edge jo pehle ise chhodta tha ab ismein ghusta hai. Toh jab aap us node se reversed graph par doosra DFS shuru karte ho, aap sirf iske apne SCC ke nodes tak pahunch sakte ho.',
      },
      {
        q: 'What is a bridge, how does the low-link DFS find one, and what breaks with parallel edges?',
        qHi: 'Ek bridge kya hai, low-link DFS ise kaise dhoondhta hai, aur parallel edges ke saath kya tootta hai?',
        a: 'A bridge in an undirected graph is an edge whose removal increases the number of connected components — cut it and the graph falls into two pieces that had no other link. The algorithm is a single DFS that assigns each node two numbers. The first is its discovery time, a counter incremented each time DFS first reaches a node. The second, the low-link, is the smallest discovery time reachable from that node\'s subtree using tree edges downward plus at most one back edge. You compute the low-link as you return from the recursion: when you come back from a child v along a tree edge, you take the minimum of your current low-link and the child\'s low-link, because whatever the child\'s subtree could reach, yours can too. When you see a neighbour that is already discovered and is not the node you came from — a back edge — you take the minimum of your low-link and that neighbour\'s discovery time, because you can hop directly to it. Now the test: for a tree edge from u down to v, if the low-link of v is strictly greater than the discovery time of u, then nothing in v\'s subtree can reach u or any ancestor of u without going through this exact edge. That edge is the only thing holding v\'s subtree onto the rest of the graph, so it is a bridge. The subtlety with parallel edges is the check that skips the parent. The naive version skips every edge that leads back to the parent node. But if there are two edges between u and its parent, that pair forms a two-edge cycle, so neither edge is a bridge — yet skipping both makes the DFS believe u reaches its parent only through the tree edge, and it wrongly reports that edge as a bridge. The fix is to skip the specific edge you arrived on, by tracking the edge identity rather than just the parent node id, so the second parallel edge is still seen as a back edge and correctly lowers the low-link.',
        aHi: 'Ek undirected graph mein ek bridge ek edge hai jiska hatna connected components ki tadaad badhaata hai — ise kaato aur graph do tukdon mein girta hai jinmein koi doosra link nahi tha. Algorithm ek akela DFS hai jo har node ko do numbers deta hai. Pehla iska discovery time hai, ek counter jo har baar badhta hai jab DFS pehli baar ek node par pahunchta hai. Doosra, low-link, sabse chhota discovery time hai jo us node ke subtree se pahuncha jaa sakta hai tree edges neeche plus zyaada se zyaada ek back edge istemal karke. Aap low-link ko recursion se return karte waqt compute karte ho: jab aap ek child v se ek tree edge ke saath wapas aate ho, aap apne current low-link aur child ke low-link ka minimum lete ho. Jab aap ek neighbour dekhte ho jo pehle se discovered hai aur wo node nahi jisse aap aaye — ek back edge — aap apne low-link aur us neighbour ke discovery time ka minimum lete ho. Ab test: u se neeche v tak ek tree edge ke liye, agar v ka low-link u ke discovery time se sakhti se bada hai, toh v ke subtree mein kuch bhi is exact edge se guzre bina u ya u ke kisi ancestor tak nahi pahunch sakta. Parallel edges ke saath sookshmata wo check hai jo parent ko skip karta hai. Fix wo specific edge skip karna hai jispar aap aaye.',
      },
    ],

    exercises: [
      {
        task: 'Implement kosaraju. Verify: the DAG [[1],[2],[3],[]] gives count 4, the graph [[1],[0,2],[3],[2]] gives count 2 with comp [0,0,1,1], and [[1],[2],[0,3],[4],[3]] gives count 2. Then replace pass 2 with a plain forward DFS on the ORIGINAL graph and show the DAG collapses to count 1.',
        taskHi: 'kosaraju implement karo. Verify karo: DAG [[1],[2],[3],[]] count 4 deta hai, graph [[1],[0,2],[3],[2]] count 2 deta hai comp [0,0,1,1] ke saath, aur [[1],[2],[0,3],[4],[3]] count 2 deta hai. Phir pass 2 ko ORIGINAL graph par ek plain forward DFS se badlo aur dikhao ki DAG count 1 mein dhah jaata hai.',
        hint: 'On the DAG, a forward DFS from node 0 reaches 1, 2, 3, so it marks all four as one component — count 1. The reversed-graph pass in reverse finish order is what confines each DFS tree to a single SCC.',
        hintHi: 'DAG par, node 0 se ek forward DFS 1, 2, 3 tak pahunchta hai, isliye ye chaaron ko ek component mark karta hai — count 1. Ulte finish order mein reversed-graph pass wo hai jo har DFS tree ko ek akele SCC mein seemit karta hai.',
      },
      {
        task: 'Implement findBridges. Verify (order-insensitively): the graph 0-1,1-2,2-0,1-3,3-4 gives the bridge set {1-3, 3-4}; a 4-node path gives all 3 edges as bridges; a 3-node cycle gives none. Then change "low[u] = min(low[u], low[v])" to "min(low[u], disc[v])" on the tree edge and show bridges get over-reported.',
        taskHi: 'findBridges implement karo. Verify karo (order-insensitively): graph 0-1,1-2,2-0,1-3,3-4 bridge set {1-3, 3-4} deta hai; ek 4-node path saare 3 edges bridges ke roop mein deta hai; ek 3-node cycle koi nahi. Phir tree edge par "low[u] = min(low[u], low[v])" ko "min(low[u], disc[v])" mein badlo aur dikhao ki bridges zyaada report hote hain.',
        hint: 'On the triangle 0-1-2, using disc[v] instead of low[v] on the tree edge 1->2 means node 1 never learns that node 2 can reach 0 via the back edge, so low[2] stays high and 1-2 is wrongly flagged.',
        hintHi: 'Triangle 0-1-2 par, tree edge 1->2 par low[v] ke bajaye disc[v] istemal karna matlab node 1 kabhi nahi seekhta ki node 2 back edge se 0 tak pahunch sakta hai, isliye low[2] ooncha rehta hai aur 1-2 galat flag hota hai.',
      },
      {
        task: 'Use kosaraju to check strong connectivity: write isStronglyConnected(n, adj) that returns true iff the SCC count is 1. Verify [[1],[2],[0]] -> true, [[1],[2],[]] -> false, and a single node with no edges -> true.',
        taskHi: 'kosaraju istemal karke strong connectivity check karo: isStronglyConnected(n, adj) likho jo true lautaata hai iff SCC count 1 hai. Verify karo [[1],[2],[0]] -> true, [[1],[2],[]] -> false, aur bina edges ke ek akela node -> true.',
        hint: 'A graph is strongly connected exactly when every node can reach every other, which is exactly when the entire graph is one SCC. So the whole function is: return kosaraju(n, adj).count === 1.',
        hintHi: 'Ek graph bilkul tab strongly connected hai jab har node har doosre tak pahunch sakta hai, jo bilkul tab hai jab poora graph ek SCC hai. Toh poora function hai: return kosaraju(n, adj).count === 1.',
      },
    ],

    keyTakeaways: [
      'An SCC of a DIRECTED graph is a maximal set of nodes where every node can reach every other. One-way reachability is NOT an SCC — a DAG has every node as its own SCC.',
      'Kosaraju: DFS pass 1 on the original graph pushing nodes by finish time; DFS pass 2 on the REVERSED graph in reverse finish order — each tree is one SCC. O(V + E).',
      'It works because the last-finished node heads a source SCC of the condensation, which is a sink in the reversed graph, so its reversed DFS cannot escape its own SCC.',
      'Condensing every SCC to a point turns any digraph into a DAG — this makes "longest path", 2-SAT, and cycle-structure questions tractable.',
      'A bridge (undirected) is an edge whose removal disconnects the graph. Find them with one DFS: disc[u] = discovery time, low[u] = earliest reachable via subtree + one back edge.',
      'Tree edge (u,v) is a bridge iff low[v] > disc[u]; u is an articulation point iff some child has low[v] >= disc[u] (root: iff it has >= 2 DFS children).',
      'On a tree edge update low[u] from low[v]; on a back edge update from disc[v]. Swapping these misses bridges.',
      'Skip the parent by EDGE identity, not node id — parallel edges to the parent form a cycle and must not both be skipped, or a real edge is misreported as a bridge.',
    ],
    keyTakeawaysHi: [
      'Ek DIRECTED graph ka ek SCC nodes ka ek maximal set hai jahaan har node har doosre tak pahunch sakta hai. Ek-disha reachability ek SCC NAHI hai — ek DAG mein har node apna SCC hai.',
      'Kosaraju: original graph par DFS pass 1 nodes ko finish time se push karte hue; REVERSED graph par DFS pass 2 ulte finish order mein — har tree ek SCC hai. O(V + E).',
      'Ye kaam karta hai kyunki aakhri-khatam node condensation ke ek source SCC ka mukhiya hai, jo reversed graph mein ek sink hai, isliye iska reversed DFS apne SCC se bhaag nahi sakta.',
      'Har SCC ko ek bindu mein condense karna kisi bhi digraph ko ek DAG banaata hai — ye "longest path", 2-SAT, aur cycle-structure sawaalon ko sulajhaane yogya banaata hai.',
      'Ek bridge (undirected) ek edge hai jiska hatna graph disconnect karta hai. Unhe ek DFS se dhoondho: disc[u] = discovery time, low[u] = subtree + ek back edge se sabse pehla pahunch yogya.',
      'Tree edge (u,v) ek bridge hai iff low[v] > disc[u]; u ek articulation point hai iff kisi child ka low[v] >= disc[u] (root: iff iske >= 2 DFS children hon).',
      'Ek tree edge par low[u] ko low[v] se update karo; ek back edge par disc[v] se update karo. Inhe swap karna bridges chhod deta hai.',
      'Parent ko EDGE identity se skip karo, node id se nahi — parent tak parallel edges ek cycle banaate hain aur dono skip nahi hone chahiye, warna ek asli edge galat tarike se ek bridge report hota hai.',
    ],
  },
];
