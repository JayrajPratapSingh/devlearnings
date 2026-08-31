/**
 * DSA Complete Course — Module 9: Graphs, lesson 8.
 *
 * Negative edge weights, which break the one assumption Dijkstra (lesson 6)
 * is built on: that popping the smallest tentative distance means that
 * distance is final. Bellman-Ford replaces "settle one node at a time" with
 * "relax every edge V-1 times", which needs no such assumption and, as a free
 * bonus, DETECTS negative cycles on the Vth pass. Floyd-Warshall closes the
 * module by answering all-pairs shortest paths in three nested loops.
 *
 * Broken example: running Dijkstra on a graph with one negative edge. It does
 * not crash, does not warn, and returns a plausible-looking wrong distance —
 * because the node was marked visited before the cheaper route through the
 * negative edge was discovered.
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

export const DSA_MODULE_9_PART8: CourseLesson[] = [
  {
    slug: 'negative-weights-bellman-ford-floyd-warshall',
    title: 'Negative Weights: Bellman-Ford and Floyd-Warshall',
    titleHi: 'Negative Weights: Bellman-Ford Aur Floyd-Warshall',
    description: 'Running Dijkstra on a graph that has even one negative edge. It does not crash and it does not warn — it marks a node as finalised the moment that node has the smallest tentative distance, and a negative edge discovered later can no longer improve it, so the function returns a confidently wrong answer.',
    descriptionHi: 'Ek aise graph par Dijkstra chalana jismein ek bhi negative edge hai. Ye crash nahi karta aur chetavni nahi deta — ye ek node ko us pal antim maan leta hai jab us node ki tentative doori sabse chhoti hai, aur baad mein mila ek negative edge use aur behtar nahi kar sakta, isliye function ek atmavishwaas se galat jawaab deta hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 8,

    analogy: {
      en: '**Planning a journey where some legs of the trip pay you instead of costing you — a delivery you pick up along the way that covers more than the fuel to that town.** The cautious planner\'s method is to work outward from home, and each time they identify the town they can reach for the least money so far, they write that price down in permanent ink and never revisit it. That method is airtight as long as every leg costs something, because once a town is the cheapest unfinished one on the board, no route through anywhere else could possibly get there for less — every other route has to pass through something that already costs more. But the instant one leg pays instead of charging, that reasoning collapses. A town can be written down in permanent ink at, say, five hundred rupees, and only afterwards does the planner discover a longer route that passes through a paying delivery and arrives for three hundred. The ink is dry; the price is wrong; nothing complained. The reliable method under these conditions is completely different and almost embarrassingly simple: do not try to finalise anything. Instead, go through every single leg of every possible route, over and over, each time asking only "does taking this leg give a better price for its destination than what I have written so far?" and updating if so. Repeat that sweep as many times as there are towns, minus one. That is guaranteed to be enough, because the longest sensible route visits each town at most once. And there is a bonus: if one more sweep still improves something, that can only mean there is a loop you can drive around forever getting paid each time, and no cheapest price exists at all.',
      hi: '**Ek aisi yaatra ki yojana jahaan safar ke kuch hisse aapko kharch karne ke bajaye paisa dete hain — raaste mein uthaayi ek delivery jo us shehar tak ke fuel se zyaada deti hai.** Saavdhaan yojanakaar ka tarika ghar se baahar ki taraf kaam karna hai, aur har baar jab wo us shehar ko pehchaante hain jahaan ab tak sabse kam paise mein pahuncha jaa sakta hai, wo us keemat ko pakki syaahi mein likh dete hain aur use kabhi dobara nahi dekhte. Wo tarika tab tak sakht hai jab tak har hissa kuch kharch karta hai, kyunki ek baar ek shehar board par sabse sasta adhoora hai, kisi aur jagah se hokar koi raasta wahaan kam mein pahunch hi nahi sakta — har doosre raaste ko kisi aise se guzarna hai jo pehle se zyaada kharch karta hai. Par jis pal ek hissa lene ke bajaye dene lagta hai, wo tark dhah jaata hai. Ek shehar pakki syaahi mein, maano, paanch sau rupaye par likha jaa sakta hai, aur uske baad hi yojanakaar ko ek lamba raasta milta hai jo ek paisa dene waali delivery se guzarta hai aur teen sau mein pahunchta hai. Syaahi sookh chuki hai; keemat galat hai; kisi ne shikaayat nahi ki. In haalaton mein bharosemand tarika bilkul alag aur lagbhag sharminda karne waala saral hai: kuch bhi antim karne ki koshish mat karo. Iske bajaye, har sambhav raaste ke har akele hisse se guzro, baar-baar, har baar sirf ye poochhte hue "kya ye hissa lena iski manzil ke liye us se behtar keemat deta hai jo maine ab tak likhi hai?" aur agar haan toh update karo. Us sweep ko utni baar dohraao jitne shehar hain, minus ek. Wo kaafi hone ki guarantee hai, kyunki sabse lamba samajhdaar raasta har shehar ko zyaada se zyaada ek baar jaata hai. Aur ek bonus hai: agar ek aur sweep abhi bhi kuch behtar karti hai, wo sirf iska matlab ho sakta hai ki ek aisa loop hai jismein aap hamesha chakkar kaat kar har baar paisa paa sakte ho, aur koi sabse sasti keemat maujood hi nahi.',
    },

    simple: `**Start broken.** Dijkstra on a graph containing one negative edge:

\`\`\`js
function dijkstra(n, adj, src) {                // adj[u] = [[v, w], ...]
  const dist = new Array(n).fill(Infinity);
  const done = new Array(n).fill(false);
  dist[src] = 0;
  const heap = [[0, src]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (done[u]) continue;
    done[u] = true;                             // <-- FINAL. Never revisited.
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
    }
  }
  return dist;
}

// 0 -> 1 costs 4;  0 -> 2 costs 5;  2 -> 1 costs -4;  1 -> 3 costs 1
const adj = [[[1, 4], [2, 5]], [[3, 1]], [[1, -4]], []];
console.log(dijkstra(4, adj, 0));
// [0, 1, 5, 5]
//           ^ WRONG. The real path 0 -> 2 -> 1 -> 3 costs 5 - 4 + 1 = 2.
\`\`\`

Trace what actually happened, because the mechanism is subtler than it first looks. Node 1 is popped with distance 4 and marked \`done\`, and while it is being expanded it writes \`dist[3] = 4 + 1 = 5\`. Only afterwards is node 2 expanded, and the edge \`2 -> 1\` improves \`dist[1]\` from 4 down to 1. That improvement *is* written into the array — so \`dist[1]\` ends up correct, by accident. But node 1 is already \`done\`, so it is never expanded again and **its outgoing edge to node 3 is never re-relaxed**. \`dist[3]\` keeps the stale 5.

This is worth stating carefully, because a smaller example hides the bug entirely: if the finalised node has no outgoing edges, the late improvement to its own distance still lands and every number looks right. The damage only becomes visible one hop downstream. Dijkstra's correctness rests on the claim *"the smallest tentative distance popped is final"*, and that claim holds only when every edge is non-negative — a later edge can then never reduce a distance. One negative edge voids it, and nothing in the code notices.

**The fix: Bellman-Ford — relax every edge, V-1 times, and finalise nothing**

\`\`\`js
function bellmanFord(n, edges, src) {            // edges: [u, v, w]
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  for (let pass = 0; pass < n - 1; pass++) {     // V-1 sweeps
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;                   // relax
        changed = true;
      }
    }
    if (!changed) break;                          // early exit: nothing improved
  }

  // one EXTRA sweep: if anything still improves, a negative cycle exists
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;
  }

  return dist;
}

const edges = [[0, 1, 4], [0, 2, 5], [2, 1, -4], [1, 3, 1]];
console.log(bellmanFord(4, edges, 0));
// [0, 1, 5, 2]   <-- correct: dist[3] now sees the improved dist[1]
\`\`\`

\`\`\`ts
function bellmanFord(n: number, edges: [number, number, number][], src: number): number[] | null {
  const dist = new Array<number>(n).fill(Infinity);
  dist[src] = 0;
  for (let pass = 0; pass < n - 1; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u]! !== Infinity && dist[u]! + w < dist[v]!) { dist[v] = dist[u]! + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) {
    if (dist[u]! !== Infinity && dist[u]! + w < dist[v]!) return null;   // negative cycle
  }
  return dist;
}
\`\`\`

There is no heap, no visited array, and no notion of a node being "done". That is the point: by never committing, Bellman-Ford has no assumption for a negative edge to violate. The price is O(V * E) instead of O(E log V).`,

    simpleHi: `**Toote hue se shuru.** Ek negative edge waale graph par Dijkstra:

\`\`\`js
function dijkstra(n, adj, src) {                // adj[u] = [[v, w], ...]
  const dist = new Array(n).fill(Infinity);
  const done = new Array(n).fill(false);
  dist[src] = 0;
  const heap = [[0, src]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (done[u]) continue;
    done[u] = true;                             // <-- ANTIM. Kabhi dobara nahi dekha.
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
    }
  }
  return dist;
}

// 0 -> 1 kharch 4;  0 -> 2 kharch 5;  2 -> 1 kharch -4;  1 -> 3 kharch 1
const adj = [[[1, 4], [2, 5]], [[3, 1]], [[1, -4]], []];
console.log(dijkstra(4, adj, 0));
// [0, 1, 5, 5]
//           ^ GALAT. Asli path 0 -> 2 -> 1 -> 3 ka kharch 5 - 4 + 1 = 2 hai.
\`\`\`

Trace karo ki asal mein kya hua, kyunki tantra pehli nazar se zyaada sookshm hai. Node 1 doori 4 ke saath pop hota hai aur \`done\` mark hota hai, aur expand hote waqt ye \`dist[3] = 4 + 1 = 5\` likhta hai. Uske baad hi node 2 expand hota hai, aur edge \`2 -> 1\` \`dist[1]\` ko 4 se ghataakar 1 karta hai. Wo sudhaar array mein likha *jaata* hai — isliye \`dist[1]\` samyog se sahi nikalta hai. Par node 1 pehle se \`done\` hai, isliye ye dobara kabhi expand nahi hota aur **node 3 tak iska outgoing edge kabhi dobara relax nahi hota**. \`dist[3]\` purana 5 rakhe rehta hai.

Ise dhyaan se batana laayak hai, kyunki ek chhota udaharan bug ko poori tarah chhupa deta hai: agar antim node ke koi outgoing edges nahi hain, iski apni doori ka der se hua sudhaar phir bhi lag jaata hai aur har number sahi dikhta hai. Nuksaan sirf ek hop aage jaakar dikhta hai. Dijkstra ki shuddhata is daawe par tiki hai ki *"pop hui sabse chhoti tentative doori antim hai"*, aur wo daawa sirf tab tikta hai jab har edge non-negative ho — tab baad ka ek edge kabhi ek doori ghata nahi sakta. Ek negative edge ise rad kar deta hai, aur code mein kuch bhi notice nahi karta.

**Fix: Bellman-Ford — har edge ko relax karo, V-1 baar, aur kuch bhi antim mat karo**

\`\`\`js
function bellmanFord(n, edges, src) {            // edges: [u, v, w]
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  for (let pass = 0; pass < n - 1; pass++) {     // V-1 sweeps
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;                   // relax
        changed = true;
      }
    }
    if (!changed) break;                          // jaldi nikaas: kuch behtar nahi hua
  }

  // ek ATIRIKT sweep: agar kuch abhi bhi behtar hota hai, ek negative cycle hai
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;
  }

  return dist;
}

const edges = [[0, 1, 4], [0, 2, 5], [2, 1, -4], [1, 3, 1]];
console.log(bellmanFord(4, edges, 0));
// [0, 1, 5, 2]   <-- sahi: dist[3] ab behtar dist[1] dekhta hai
\`\`\`

\`\`\`ts
function bellmanFord(n: number, edges: [number, number, number][], src: number): number[] | null {
  const dist = new Array<number>(n).fill(Infinity);
  dist[src] = 0;
  for (let pass = 0; pass < n - 1; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u]! !== Infinity && dist[u]! + w < dist[v]!) { dist[v] = dist[u]! + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) {
    if (dist[u]! !== Infinity && dist[u]! + w < dist[v]!) return null;   // negative cycle
  }
  return dist;
}
\`\`\`

Koi heap nahi, koi visited array nahi, aur ek node ke "done" hone ka koi vichaar nahi. Wahi baat hai: kabhi pratibaddh na hokar, Bellman-Ford ke paas ek negative edge ke ullanghan karne ko koi maanyata hai hi nahi. Keemat O(E log V) ke bajaye O(V * E) hai.`,

    content: `## Why exactly V-1 passes, and what the Vth pass proves

\`\`\`
CLAIM: after pass k, dist[] is correct for every node whose shortest path
       uses at most k edges.

  pass 1: every node one edge from the source is correct
  pass 2: every node reachable in two edges is correct
  ...
  A shortest path never repeats a vertex (repeating one means a cycle, and a
  cycle of non-negative weight can be cut out; a cycle of negative weight
  means no shortest path exists). So a shortest path has at most V-1 edges.

  => V-1 passes are always enough, and never wasted effort beyond that.

THE Vth PASS
  If a Vth pass still improves some dist[v], then some shortest path would
  need V or more edges, which is impossible unless a negative cycle exists.
  So: "one more relaxation succeeded" IS the negative-cycle detector.
\`\`\`

That free negative-cycle detection is the reason Bellman-Ford survives despite being slower than Dijkstra. Dijkstra cannot detect a negative cycle at all — it will just return wrong numbers.

## What "a negative cycle" means for the question itself

\`\`\`
0 --(1)--> 1 --(-3)--> 2 --(1)--> 0        cycle weight = 1 - 3 + 1 = -1

Go around once:  -1.  Twice: -2.  A thousand times: -1000.
There is NO shortest path. The infimum is negative infinity.
\`\`\`

Returning \`null\` is therefore not defensive coding — it is the honest answer. Any function that returns numbers here is lying. Note the asymmetry: a negative *edge* is fine and has a well-defined answer; a negative *cycle* means the question has no answer.

## Floyd-Warshall: all pairs, in three loops

When the question is "shortest distance between **every** pair", running Bellman-Ford V times costs O(V^2 * E). Floyd-Warshall does it in O(V^3), which wins on dense graphs and is far simpler to write:

\`\`\`js
function floydWarshall(n, edges) {
  const d = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);

  for (let k = 0; k < n; k++)            // k MUST be the OUTERMOST loop
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

  for (let i = 0; i < n; i++) if (d[i][i] < 0) return null;   // negative cycle
  return d;
}
\`\`\`

The loop order is not a style choice. \`k\` is the DP dimension — after iteration \`k\`, \`d[i][j]\` is the shortest path from \`i\` to \`j\` using only intermediate vertices drawn from \`{0..k}\`. Putting \`k\` inside would mean asking about a set of allowed intermediates that has not been fully built yet, and the answers come out wrong. This is a Module 11 DP with the table dimension hoisted to the outside.

## Choosing the shortest-path algorithm

\`\`\`
all weights equal (or unweighted)     BFS                O(V + E)
non-negative weights, one source      Dijkstra           O(E log V)
any weights, one source               Bellman-Ford       O(V * E)   + cycle detection
any weights, ALL pairs                Floyd-Warshall     O(V^3)
DAG (no cycles at all), any weights   topological order  O(V + E)   <- lesson 4
                                      then relax in that order

Interview tell: the moment the problem says "costs can be negative", "refunds",
"discounts", "currency exchange" or "arbitrage", Dijkstra is off the table.
Currency arbitrage in particular is exactly negative-cycle detection after
taking -log of each exchange rate.
\`\`\`

## The optimisation you should mention, then not write

\`\`\`
SPFA (Shortest Path Faster Algorithm) = Bellman-Ford with a queue, relaxing
only from nodes whose distance actually changed. Often much faster in
practice, but its worst case is still O(V * E), and adversarial graphs hit it.
Mention it as a known refinement; write plain Bellman-Ford in an interview,
because the V-1-passes structure is what the interviewer is checking you know.
\`\`\``,

    contentHi: `## Bilkul V-1 passes kyun, aur Vaan pass kya saabit karta hai

\`\`\`
DAAWA: pass k ke baad, dist[] har us node ke liye sahi hai jiska shortest path
       zyaada se zyaada k edges istemal karta hai.

  pass 1: source se ek edge door har node sahi hai
  pass 2: do edges mein pahunchne yogya har node sahi hai
  ...
  Ek shortest path kabhi ek vertex nahi dohraata (ek dohraana matlab ek cycle,
  aur non-negative weight ki ek cycle kaati jaa sakti hai; negative weight ki
  ek cycle matlab koi shortest path maujood hi nahi). Toh ek shortest path mein
  zyaada se zyaada V-1 edges hain.

  => V-1 passes hamesha kaafi hain, aur usse aage koi barbaad koshish nahi.

VAAN PASS
  Agar ek Vaan pass abhi bhi kisi dist[v] ko behtar karta hai, toh kisi shortest
  path ko V ya zyaada edges chahiye honge, jo namumkin hai jab tak ek negative
  cycle na ho. Toh: "ek aur relaxation safal hua" HI negative-cycle detector hai.
\`\`\`

Wo muft negative-cycle detection wajah hai ki Bellman-Ford Dijkstra se dheema hone ke baawajood bacha hua hai. Dijkstra ek negative cycle bilkul pakad hi nahi sakta — wo bas galat numbers return karega.

## Khud sawaal ke liye "ek negative cycle" ka kya matlab hai

\`\`\`
0 --(1)--> 1 --(-3)--> 2 --(1)--> 0        cycle weight = 1 - 3 + 1 = -1

Ek baar chakkar lagao:  -1.  Do baar: -2.  Ek hazaar baar: -1000.
KOI shortest path nahi hai. Infimum negative infinity hai.
\`\`\`

Isliye \`null\` return karna raksha-atmak coding nahi hai — ye imaandaar jawaab hai. Koi bhi function jo yahaan numbers return karta hai wo jhooth bol raha hai. Asamaanta note karo: ek negative *edge* theek hai aur iska ek achhi tarah paribhaashit jawaab hai; ek negative *cycle* matlab sawaal ka koi jawaab hi nahi.

## Floyd-Warshall: sab jodiyaan, teen loops mein

Jab sawaal "**har** jodi ke beech shortest doori" hai, Bellman-Ford ko V baar chalana O(V^2 * E) kharch karta hai. Floyd-Warshall ise O(V^3) mein karta hai, jo ghane graphs par jeetta hai aur likhne mein kaafi saral hai:

\`\`\`js
function floydWarshall(n, edges) {
  const d = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);

  for (let k = 0; k < n; k++)            // k ko SABSE BAAHAR ka loop HONA CHAHIYE
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

  for (let i = 0; i < n; i++) if (d[i][i] < 0) return null;   // negative cycle
  return d;
}
\`\`\`

Loop kram ek style ka chunaav nahi hai. \`k\` DP dimension hai — iteration \`k\` ke baad, \`d[i][j]\` \`i\` se \`j\` tak ka shortest path hai sirf \`{0..k}\` se liye gaye intermediate vertices istemal karte hue. \`k\` ko andar rakhna matlab allowed intermediates ke ek aise set ke baare mein poochhna jo abhi poori tarah bana hi nahi, aur jawaab galat nikalte hain. Ye ek Module 11 waala DP hai jiska table dimension baahar uthaaya gaya hai.

## Shortest-path algorithm chunna

\`\`\`
sab weights barabar (ya unweighted)    BFS                O(V + E)
non-negative weights, ek source        Dijkstra           O(E log V)
koi bhi weights, ek source             Bellman-Ford       O(V * E)  + cycle detection
koi bhi weights, SAB jodiyaan          Floyd-Warshall     O(V^3)
DAG (koi cycles hi nahi), koi weights  topological kram   O(V + E)  <- lesson 4
                                       phir us kram mein relax

Interview sanket: jis pal problem kehti hai "costs negative ho sakti hain",
"refunds", "discounts", "currency exchange" ya "arbitrage", Dijkstra baahar hai.
Currency arbitrage khaas taur par har exchange rate ka -log lene ke baad
bilkul negative-cycle detection hai.
\`\`\`

## Wo optimisation jiska zikr karna chahiye, phir likhna nahi

\`\`\`
SPFA (Shortest Path Faster Algorithm) = ek queue ke saath Bellman-Ford, sirf un
nodes se relax karte hue jinki doori asal mein badli. Vyavhaar mein aksar bahut
tez, par iska worst case abhi bhi O(V * E) hai, aur adversarial graphs use maarte hain.
Iska ek jaane-maane sudhaar ki tarah zikr karo; ek interview mein saada Bellman-Ford
likho, kyunki V-1-passes ka structure wahi hai jo interviewer jaanch raha hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: Dijkstra silently wrong on a negative edge',
        titleHi: 'Toota: ek negative edge par Dijkstra chupchaap galat',
        code: `done[u] = true;   // "this distance is final" — only valid if all weights >= 0`,
        codeJs: `function dijkstra(n, adj, src) {
  const dist = new Array(n).fill(Infinity), done = new Array(n).fill(false);
  dist[src] = 0;
  const heap = [[0, src]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (done[u]) continue;
    done[u] = true;
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
  }
  return dist;
}
// 0->1 = 4, 0->2 = 5, 2->1 = -4, 1->3 = 1.  True dist[3] is 5 - 4 + 1 = 2.
console.log(dijkstra(4, [[[1, 4], [2, 5]], [[3, 1]], [[1, -4]], []], 0));`,
        codeTs: `function dijkstra(n: number, adj: [number, number][][], src: number): number[] {
  const dist = new Array<number>(n).fill(Infinity), done = new Array<boolean>(n).fill(false);
  dist[src] = 0;
  const heap: [number, number][] = [[0, src]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift()!;
    if (done[u]) continue;
    done[u] = true;
    for (const [v, w] of adj[u]!) if (d + w < dist[v]!) { dist[v] = d + w; heap.push([dist[v]!, v]); }
  }
  return dist;
}`,
        outputJs: `[ 0, 1, 5, 5 ]`,
        outputTs: `// Same wrong output — types cannot catch a violated precondition.`,
        explain: 'dist[3] is reported as 5, but the real shortest path 0 -> 2 -> 1 -> 3 costs 2. Node 1 was popped and marked done at distance 4, and it wrote dist[3] = 5 before edge 2 -> 1 later cut dist[1] to 1. That improvement lands in the array (so dist[1] looks right) but node 1 is never re-expanded, so its edge to node 3 is never re-relaxed.',
        explainHi: 'dist[3] 5 bataaya gaya, par asli shortest path 0 -> 2 -> 1 -> 3 ki cost 2 hai. Node 1 doori 4 par pop hua aur done mark hua, aur usne dist[3] = 5 likha isse pehle ki edge 2 -> 1 baad mein dist[1] ko 1 kar deta. Wo sudhaar array mein lag jaata hai (isliye dist[1] sahi dikhta hai) par node 1 dobara expand nahi hota, isliye node 3 tak iska edge dobara relax nahi hota.',
      },
      {
        title: 'Fixed: Bellman-Ford relaxes every edge V-1 times',
        titleHi: 'Theek: Bellman-Ford har edge ko V-1 baar relax karta hai',
        code: `for (let pass = 0; pass < n - 1; pass++)
  for (const [u, v, w] of edges)
    if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;   // nothing is ever "final"`,
        codeJs: `function bellmanFord(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let pass = 0; pass < n - 1; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;
  return dist;
}
console.log(bellmanFord(4, [[0, 1, 4], [0, 2, 5], [2, 1, -4], [1, 3, 1]], 0));
// negative cycle: 0 -> 1 -> 2 -> 0 sums to -1
console.log(bellmanFord(3, [[0, 1, 1], [1, 2, -3], [2, 0, 1]], 0));`,
        codeTs: `function bellmanFord(n: number, edges: [number, number, number][], src: number): number[] | null {
  const dist = new Array<number>(n).fill(Infinity);
  dist[src] = 0;
  for (let pass = 0; pass < n - 1; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u]! !== Infinity && dist[u]! + w < dist[v]!) { dist[v] = dist[u]! + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) if (dist[u]! !== Infinity && dist[u]! + w < dist[v]!) return null;
  return dist;
}`,
        outputJs: `[ 0, 1, 5, 2 ]
null`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'dist[3] is now 2 — because Bellman-Ford never finalises node 1, a later pass re-relaxes its edge to node 3 once dist[1] drops to 1. The second call returns null: a Vth relaxation still improved something, which can only happen when a negative cycle exists, and then no shortest path is defined at all.',
        explainHi: 'dist[3] ab 2 hai — kyunki Bellman-Ford node 1 ko kabhi antim nahi karta, ek baad ka pass node 3 tak iske edge ko dobara relax karta hai jab dist[1] ghatkar 1 ho jaata hai. Doosra call null return karta hai: ek Vaan relaxation ne abhi bhi kuch behtar kiya, jo sirf tab ho sakta hai jab ek negative cycle ho, aur tab koi shortest path paribhaashit hi nahi.',
      },
      {
        title: 'Floyd-Warshall: all pairs, with k as the outermost loop',
        titleHi: 'Floyd-Warshall: sab jodiyaan, k sabse baahar ke loop ki tarah',
        code: `for (let k = 0; k < n; k++)      // k is the DP dimension — it MUST be outermost
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];`,
        codeJs: `function floydWarshall(n, edges) {
  const d = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  for (let i = 0; i < n; i++) if (d[i][i] < 0) return null;
  return d;
}
console.log(floydWarshall(4, [[0,1,5],[0,3,10],[1,2,3],[2,3,1]]));
console.log(floydWarshall(3, [[0,1,1],[1,2,-3],[2,0,1]]));   // negative cycle`,
        codeTs: `function floydWarshall(n: number, edges: [number, number, number][]): number[][] | null {
  const d = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [u, v, w] of edges) d[u]![v] = Math.min(d[u]![v]!, w);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i]![k]! + d[k]![j]! < d[i]![j]!) d[i]![j] = d[i]![k]! + d[k]![j]!;
  for (let i = 0; i < n; i++) if (d[i]![i]! < 0) return null;
  return d;
}`,
        outputJs: `[
  [ 0, 5, 8, 9 ],
  [ Infinity, 0, 3, 4 ],
  [ Infinity, Infinity, 0, 1 ],
  [ Infinity, Infinity, Infinity, 0 ]
]
null`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'd[0][3] is 9 (via 0-1-2-3) rather than the direct edge of 10, and unreachable pairs stay Infinity. A negative diagonal entry means a vertex can reach itself at negative cost, which is the all-pairs form of negative-cycle detection.',
        explainHi: 'd[0][3] 9 hai (0-1-2-3 se) 10 ke seedhe edge ke bajaye, aur apahunch jodiyaan Infinity rehti hain. Ek negative diagonal entry matlab ek vertex khud tak negative cost par pahunch sakta hai, jo negative-cycle detection ka all-pairs roop hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// relaxing from a node that has not been reached yet
for (const [u, v, w] of edges) {
  if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  // dist[u] is Infinity; Infinity + (-5) is still Infinity in JS, but
  // with a large sentinel like 1e9 you get 1e9 - 5 < 1e9 -> FALSE distance
}`,
        right: `for (const [u, v, w] of edges) {
  if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
}`,
        why: 'Relaxing out of an unreached node propagates a meaningless distance. JavaScript\'s Infinity happens to absorb the arithmetic, but the moment you switch to an integer sentinel — which most languages and most competitive templates do — a negative edge makes the sentinel shrink and unreachable nodes acquire fake finite distances.',
        whyHi: 'Ek na-pahunche node se relax karna ek arthheen doori failaata hai. JavaScript ka Infinity samyog se ganit ko sokh leta hai, par jis pal aap ek integer sentinel par jaate ho — jo adhikaansh languages aur templates karte hain — ek negative edge sentinel ko ghataata hai aur apahunch nodes ko nakli finite doori mil jaati hai.',
      },
      {
        wrong: `// putting k anywhere but the outermost loop in Floyd-Warshall
for (let i = 0; i < n; i++)
  for (let j = 0; j < n; j++)
    for (let k = 0; k < n; k++)              // WRONG ORDER
      if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];`,
        right: `for (let k = 0; k < n; k++)                  // k FIRST — it is the DP dimension
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];`,
        why: 'After the kth outer iteration, d[i][j] means "shortest i-to-j path using only intermediates from {0..k}". That invariant requires all pairs to be updated for a given k before moving to k+1. Nesting k innermost asks about intermediate sets that have not been built yet and produces answers that are too large.',
        whyHi: 'Kaven baahari iteration ke baad, d[i][j] ka matlab hai "sirf {0..k} se intermediates istemal karte hue sabse chhota i-se-j path". Us invariant ko ek di gayi k ke liye sab jodiyon ka update chahiye k+1 par jaane se pehle. k ko sabse andar rakhna un intermediate sets ke baare mein poochhta hai jo abhi bane hi nahi aur bahut bade jawaab banaata hai.',
      },
      {
        wrong: `// reporting distances when a negative cycle exists
return dist;   // the numbers are meaningless — no shortest path is defined`,
        right: `for (const [u, v, w] of edges) {
  if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;   // Vth pass
}
return dist;`,
        why: 'With a negative cycle you can loop forever and drive the cost to negative infinity, so no shortest path exists and any finite number returned is a fabrication. The Vth relaxation pass costs one extra O(E) sweep and is the only thing standing between a correct answer and a confident lie.',
        whyHi: 'Ek negative cycle ke saath aap hamesha loop karke cost ko negative infinity tak le jaa sakte ho, isliye koi shortest path maujood nahi aur koi bhi finite number ek gadhant hai. Vaan relaxation pass ek atirikt O(E) sweep kharch karta hai aur ek sahi jawaab aur ek atmavishwaasi jhooth ke beech khadi ekmatra cheez hai.',
      },
    ],

    realWorld: [
      {
        en: '**Currency arbitrage detection** takes the negative logarithm of each exchange rate and looks for a negative cycle — a loop of trades returning more than you started with. This is Bellman-Ford used for its cycle detector rather than its distances.',
        hi: '**Currency arbitrage detection** har exchange rate ka negative logarithm leta hai aur ek negative cycle dhoondhta hai — trades ka ek loop jo aapse shuru se zyaada lautaata hai. Ye Bellman-Ford ka iske doori ke bajaye iske cycle detector ke liye istemal hai.',
      },
      {
        en: '**Internet routing (RIP and distance-vector protocols)** is distributed Bellman-Ford: each router repeatedly relaxes its neighbours\' advertised distances, with no global view and no node ever declaring its distance final.',
        hi: '**Internet routing (RIP aur distance-vector protocols)** vitarit Bellman-Ford hai: har router baar-baar apne padosiyon ki ghoshit dooriyaan relax karta hai, bina kisi global drishya ke aur bina kisi node ke apni doori antim ghoshit kiye.',
      },
      {
        en: '**Game and logistics maps with bonuses** — a route segment that grants fuel, a shortcut that refunds tolls — are negative-weight graphs, and reaching for Dijkstra there produces plausible but wrong routes with no error to alert anyone.',
        hi: '**Bonuses waale game aur logistics maps** — ek route segment jo fuel deta hai, ek shortcut jo tolls waapas karta hai — negative-weight graphs hain, aur wahaan Dijkstra ki taraf pahunchna sambhaavya par galat routes banaata hai bina kisi error ke jo kisi ko aagaah kare.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does Dijkstra fail on negative edges? Be specific about which step breaks.',
        qHi: 'Dijkstra negative edges par kyun fail hota hai? Thik-thik batao kaunsa step tootta hai.',
        a: 'Dijkstra rests on one specific claim, and the claim is what breaks. The claim is that when you pop the node with the smallest tentative distance off the priority queue, that distance is final and can never be improved. The justification is a short argument: any alternative route to that node has to leave the set of already-finalised nodes at some point, and the first node it reaches outside that set already has a tentative distance at least as large as the one we just popped. Then, because every remaining edge adds a non-negative amount, the rest of that alternative route can only make the total larger or leave it equal. So no alternative can beat what we popped. Every single step of that argument depends on edges being non-negative — specifically the step where extending a path cannot decrease its cost. Introduce one negative edge and that step is false: a longer route can now arrive cheaper. The concrete failure is that the node gets marked finalised, and Dijkstra by construction never reopens a finalised node, so when the cheaper route is discovered later the algorithm has no mechanism to apply it. What makes this dangerous in practice is that nothing goes wrong visibly. There is no crash, no infinite loop, no assertion. The function returns an array of plausible-looking distances, some of which are simply too large. If you remove the finalised check so nodes can be reopened, you get an algorithm that is correct on negative edges but can degrade to exponential time, and it still loops forever on a negative cycle. The right answer is to switch algorithms: Bellman-Ford does not finalise anything at all, so there is no assumption for a negative edge to violate, and its extra pass detects the negative cycle case that has no answer.',
        aHi: 'Dijkstra ek khaas daawe par tika hai, aur wahi daawa tootta hai. Daawa ye hai ki jab aap priority queue se sabse chhoti tentative doori waala node pop karte ho, wo doori antim hai aur kabhi behtar nahi ho sakti. Auchitya ek chhota tark hai: us node tak koi bhi vaikalpik raasta kisi bindu par pehle se antim nodes ke set ko chhodta hai, aur us set ke baahar wo jo pehla node pahunchta hai uski tentative doori pehle se kam se kam utni badi hai jitni humne abhi pop ki. Phir, kyunki har baaki edge ek non-negative maatra jodta hai, us vaikalpik raaste ka baaki hissa kul ko sirf bada kar sakta hai ya barabar chhod sakta hai. Toh koi vikalp us se nahi jeet sakta jo humne pop kiya. Us tark ka har akela step edges ke non-negative hone par nirbhar hai — khaas taur par wo step jahaan ek path badhaana iski cost ghata nahi sakta. Ek negative edge laao aur wo step jhootha hai: ab ek lamba raasta sasta pahunch sakta hai. Thos vifalta ye hai ki node antim mark ho jaata hai, aur Dijkstra nirmaan se ek antim node ko kabhi dobara nahi kholta, isliye jab sasta raasta baad mein milta hai algorithm ke paas use lagaane ka koi tantra nahi hai. Jo ise vyavhaar mein khatarnak banaata hai wo ye hai ki kuch bhi drishya roop se galat nahi hota. Koi crash nahi, koi infinite loop nahi, koi assertion nahi. Function sambhaavya dikhne waali dooriyon ka ek array return karta hai, jinmein se kuch bas bahut badi hain. Sahi jawaab algorithms badalna hai.',
      },
      {
        q: 'Why exactly V-1 iterations in Bellman-Ford, and how does that give you negative-cycle detection for free?',
        qHi: 'Bellman-Ford mein bilkul V-1 iterations kyun, aur wo aapko negative-cycle detection muft mein kaise deta hai?',
        a: 'The bound comes from a fact about what a shortest path can look like. A shortest path can never visit the same vertex twice, because if it did, the portion between the two visits forms a cycle, and you could delete that cycle. If the cycle has non-negative weight, deleting it gives a path that is no longer and no more expensive, so the original was not uniquely shortest. If the cycle has negative weight, then no shortest path exists at all, since you could go round it repeatedly and drive the cost down without limit. So in any graph where the question is well-posed, a shortest path visits at most V vertices and therefore uses at most V minus one edges. Now pair that with what one pass of Bellman-Ford accomplishes. A pass relaxes every edge once, and you can prove by induction that after k passes, the distance is correct for every vertex whose shortest path uses at most k edges. The base case is the source at zero edges. For the step, if a vertex has a shortest path of k plus one edges, the vertex just before it on that path has a shortest path of k edges, which by hypothesis is already correct after pass k, so relaxing the final edge during pass k plus one fixes the vertex. Since no shortest path exceeds V minus one edges, V minus one passes settle everything, and any further passes would change nothing. That last observation is exactly what gives the cycle detection. Run one more pass, the Vth. If any edge still relaxes successfully, some distance is claiming to improve using V or more edges, which we just argued is impossible in a well-posed graph. The only way it happens is a negative cycle, so a successful relaxation on the Vth pass is a proof that one exists, and the honest return value is not a distance array but an indication that no shortest path is defined. In practice I also add an early exit: if a full pass makes no changes, the answer has converged and you can stop before V minus one.',
        aHi: 'Bound ek tathya se aata hai ki ek shortest path kaisa dikh sakta hai. Ek shortest path kabhi usi vertex par do baar nahi jaa sakta, kyunki agar jaata, do dauron ke beech ka hissa ek cycle banaata hai, aur aap us cycle ko delete kar sakte the. Agar cycle ka weight non-negative hai, use delete karna ek aisa path deta hai jo na lamba hai na zyaada mehenga, isliye mool anokha shortest nahi tha. Agar cycle ka weight negative hai, toh koi shortest path maujood hi nahi, kyunki aap uske baar-baar chakkar lagaakar cost ko bina seema ke neeche laa sakte the. Toh kisi bhi graph mein jahaan sawaal theek se rakha gaya hai, ek shortest path zyaada se zyaada V vertices par jaata hai aur isliye zyaada se zyaada V minus ek edges istemal karta hai. Ab ise jodo ki Bellman-Ford ka ek pass kya haasil karta hai. Ek pass har edge ko ek baar relax karta hai, aur aap induction se saabit kar sakte ho ki k passes ke baad, doori har us vertex ke liye sahi hai jiska shortest path zyaada se zyaada k edges istemal karta hai. Base case shunya edges par source hai. Step ke liye, agar ek vertex ka shortest path k plus ek edges ka hai, us path par usse theek pehle waale vertex ka shortest path k edges ka hai, jo maanyata se pass k ke baad pehle se sahi hai, isliye pass k plus ek ke dauraan antim edge relax karna vertex theek karta hai. Kyunki koi shortest path V minus ek edges se zyaada nahi hai, V minus ek passes sab kuch tay kar dete hain. Wahi antim avlokan cycle detection deta hai. Ek aur pass chalao, Vaan. Agar koi edge abhi bhi safaltapoorvak relax hota hai, koi doori V ya zyaada edges se behtar hone ka daawa kar rahi hai, jo namumkin hai. Aisa hone ka ekmatra tarika ek negative cycle hai.',
      },
    ],

    exercises: [
      {
        task: 'Run your Dijkstra from lesson 6 on n=4 with adj = [[[1,4],[2,5]], [[3,1]], [[1,-4]], []] from source 0, and confirm it returns [0, 1, 5, 5]. Then hand-trace why dist[3] should be 2 and identify the exact line that froze node 1.',
        taskHi: 'Lesson 6 waale apne Dijkstra ko n=4 par adj = [[[1,4],[2,5]], [[3,1]], [[1,-4]], []] ke saath source 0 se chalao, aur confirm karo ki ye [0, 1, 5, 5] return karta hai. Phir haath se trace karo ki dist[3] 2 kyun hona chahiye aur wo thik-thik line pehchaano jisne node 1 jam kiya.',
        hint: 'Node 1 is popped at distance 4 before node 2 (distance 5), writes dist[3] = 5, and is marked done. Edge 2 -> 1 later cuts dist[1] to 1 — that lands in the array — but the done[u] = true line means node 1 is never re-expanded, so dist[3] keeps its stale 5. A 3-node version with node 1 having no outgoing edges hides the bug entirely.',
        hintHi: 'Node 1 doori 4 par node 2 (doori 5) se pehle pop hota hai, dist[3] = 5 likhta hai, aur done mark hota hai. Edge 2 -> 1 baad mein dist[1] ko 1 kar deta hai — wo array mein lag jaata hai — par done[u] = true line ka matlab hai node 1 dobara expand nahi hota, isliye dist[3] purana 5 rakhta hai. Ek 3-node version jismein node 1 ke koi outgoing edges nahi, bug poori tarah chhupa deta hai.',
      },
      {
        task: 'Implement bellmanFord with the V-1 passes plus the Vth detection pass. Verify it returns [0,1,5,2] on edges [[0,1,4],[0,2,5],[2,1,-4],[1,3,1]] and null on [[0,1,1],[1,2,-3],[2,0,1]]. Then remove the "dist[u] !== Infinity" guard, replace Infinity with 1e9, and observe unreachable nodes picking up fake finite distances.',
        taskHi: 'bellmanFord ko V-1 passes plus Vaan detection pass ke saath implement karo. Verify karo ki ye edges [[0,1,4],[0,2,5],[2,1,-4],[1,3,1]] par [0,1,5,2] aur [[0,1,1],[1,2,-3],[2,0,1]] par null return karta hai. Phir "dist[u] !== Infinity" guard hataao, Infinity ko 1e9 se badlo, aur dekho ki apahunch nodes nakli finite dooriyaan utha lete hain.',
        hint: 'With a 1e9 sentinel and a -4 edge, an unreached u gives 1e9 - 4 < 1e9, so v is "improved" to 999999996 despite being unreachable. This is why competitive templates always guard the relaxation.',
        hintHi: 'Ek 1e9 sentinel aur ek -4 edge ke saath, ek na-pahuncha u 1e9 - 4 < 1e9 deta hai, isliye v apahunch hone ke baawajood 999999996 par "behtar" ho jaata hai. Yahi wajah hai ki competitive templates hamesha relaxation guard karte hain.',
      },
      {
        task: 'Implement floydWarshall and verify d[0][3] is 9 (not the direct edge 10) on edges [[0,1,5],[0,3,10],[1,2,3],[2,3,1]]. Then move the k loop to the innermost position and find an input where the answers become too large. Explain why using the "intermediates from {0..k}" invariant.',
        taskHi: 'floydWarshall implement karo aur verify karo ki edges [[0,1,5],[0,3,10],[1,2,3],[2,3,1]] par d[0][3] 9 hai (seedha edge 10 nahi). Phir k loop ko sabse andar ki position par le jaao aur ek aisa input dhoondho jahaan jawaab bahut bade ho jaate hain. "{0..k} se intermediates" invariant istemal karke samjhaao kyun.',
        hint: 'The chain 0-1-2-3 needs both node 1 and node 2 as intermediates. With k innermost, d[0][2] may not yet be finalised when d[0][3] is computed through it, so the improvement is missed on that pass and never revisited.',
        hintHi: 'Chain 0-1-2-3 ko node 1 aur node 2 dono intermediates ki tarah chahiye. k sabse andar hone par, d[0][2] shaayad abhi antim na ho jab d[0][3] uske zariye compute hota hai, isliye us pass par sudhaar chhoot jaata hai aur dobara kabhi nahi dekha jaata.',
      },
    ],

    keyTakeaways: [
      'Dijkstra assumes "the smallest tentative distance popped is final". That is only valid when every weight is >= 0. One negative edge silently voids it — no crash, no warning, just wrong distances.',
      'Bellman-Ford finalises nothing: it relaxes every edge, V-1 times. With no commitment there is no assumption for a negative edge to violate. O(V * E).',
      'V-1 passes suffice because a shortest path never repeats a vertex, so it uses at most V-1 edges, and after pass k every path of <= k edges is correct.',
      'A Vth pass that still improves something PROVES a negative cycle exists — and then no shortest path is defined, so returning null is the honest answer, not defensive coding.',
      'Always guard the relaxation with "dist[u] !== Infinity". With an integer sentinel like 1e9, a negative edge makes unreachable nodes acquire fake finite distances.',
      'Floyd-Warshall gives all-pairs in O(V^3). k MUST be the outermost loop — it is the DP dimension, meaning "shortest path using only intermediates from {0..k}". A negative d[i][i] flags a negative cycle.',
      'Pick by the weights: BFS if unweighted, Dijkstra if non-negative, Bellman-Ford if any negative, Floyd-Warshall for all pairs, topological-order relaxation if the graph is a DAG.',
    ],
    keyTakeawaysHi: [
      'Dijkstra maanta hai ki "pop hui sabse chhoti tentative doori antim hai". Wo sirf tab vaidh hai jab har weight >= 0 ho. Ek negative edge ise chupchaap rad kar deta hai — koi crash nahi, koi chetavni nahi, bas galat dooriyaan.',
      'Bellman-Ford kuch bhi antim nahi karta: ye har edge ko V-1 baar relax karta hai. Bina pratibaddhata ke ek negative edge ke ullanghan karne ko koi maanyata hai hi nahi. O(V * E).',
      'V-1 passes kaafi hain kyunki ek shortest path kabhi ek vertex nahi dohraata, isliye ye zyaada se zyaada V-1 edges istemal karta hai, aur pass k ke baad <= k edges ka har path sahi hai.',
      'Ek Vaan pass jo abhi bhi kuch behtar karta hai SAABIT karta hai ki ek negative cycle hai — aur tab koi shortest path paribhaashit nahi, isliye null return karna imaandaar jawaab hai, raksha-atmak coding nahi.',
      'Relaxation ko hamesha "dist[u] !== Infinity" se guard karo. 1e9 jaise ek integer sentinel ke saath, ek negative edge apahunch nodes ko nakli finite dooriyaan de deta hai.',
      'Floyd-Warshall sab jodiyaan O(V^3) mein deta hai. k ko SABSE BAAHAR ka loop HONA CHAHIYE — ye DP dimension hai, matlab "sirf {0..k} se intermediates istemal karne waala shortest path". Ek negative d[i][i] ek negative cycle batata hai.',
      'Weights se chuno: unweighted par BFS, non-negative par Dijkstra, koi bhi negative par Bellman-Ford, sab jodiyon ke liye Floyd-Warshall, graph DAG hone par topological-kram relaxation.',
    ],
  },
];
