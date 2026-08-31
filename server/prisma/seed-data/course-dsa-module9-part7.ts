/**
 * DSA Complete Course — Module 9: Graphs, lesson 7.
 *
 * Minimum spanning trees: Kruskal (sort every edge, add it unless it closes a
 * cycle — the cycle test IS the union-find from lesson 5) and Prim (grow one
 * connected blob outward, always taking the cheapest edge leaving it — the
 * frontier IS the min-heap from Module 8, and the loop shape is Dijkstra from
 * lesson 6 with one line changed).
 *
 * This lesson deliberately reuses two structures the learner already has, so
 * the new content is the IDEA (the cut property — why greedy is provably
 * optimal here, unlike in Module 12's cautionary cases) rather than new
 * machinery. It also makes the Prim/Dijkstra comparison explicit, because
 * confusing the two is the single most common MST mistake.
 *
 * Broken example: sorting the edges and taking the n-1 cheapest, with no
 * cycle check — which produces a cheap set of edges that is not a spanning
 * tree at all (some vertices unreached, some regions over-connected).
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

export const DSA_MODULE_9_PART7: CourseLesson[] = [
  {
    slug: 'minimum-spanning-trees-kruskal-prim',
    title: 'Minimum Spanning Trees: Kruskal and Prim',
    titleHi: 'Minimum Spanning Trees: Kruskal Aur Prim',
    description: 'Connecting every node as cheaply as possible by sorting the edges and taking the n-1 cheapest ones. The total cost looks minimal and the edge count is exactly right, but the result is not a spanning tree at all — some cheap edges connect nodes that were already connected, wasting a slot and leaving another part of the graph stranded.',
    descriptionHi: 'Har node ko jitna sasta ho sake jodna edges sort karke aur n-1 sabse saste lekar. Kul cost kam se kam dikhti hai aur edge count bilkul sahi hai, par nateeja ek spanning tree hai hi nahi — kuch saste edges un nodes ko jodte hain jo pehle se jude the, ek slot barbaad karte hue aur graph ka ek doosra hissa alag chhodte hue.',
    difficulty: 'HARD',
    duration: 28,
    order: 7,

    analogy: {
      en: '**Laying water pipes between villages so every village has water, spending as little as possible on pipe.** Someone hands you the price of every possible pipe and you sort the list cheapest first. The naive plan is to buy pipes down that list until you have bought one fewer pipe than there are villages, since that is how many connections it takes. But two of the cheapest quotes turn out to run between two villages that a pipe already links — laying that second pipe changes nothing about who has water, it just makes a loop, and it consumes a slot from your budget. Meanwhile a village on the far side is left dry, because the pipe that would have reached it was slightly more expensive and never got bought. The fix is a single extra question asked before every purchase: **do these two villages already have water flowing between them, by any route at all?** If yes, skip this pipe no matter how cheap it is; if no, buy it. That one question is the whole difference between a cheap pile of pipes and a genuinely minimal network. There is a second, equally valid way to do the same job: instead of shopping globally by price, start at one village and repeatedly lay the single cheapest pipe that reaches somewhere not yet watered — never look at pipes between two villages that both already have water. Both approaches land on the same total cost, and which one is cheaper to run depends on whether the region has a few long-distance connections or a dense web of short ones.',
      hi: '**Gaanvon ke beech paani ke pipe daalna taaki har gaanv ko paani mile, pipe par jitna kam ho sake kharch karte hue.** Koi aapko har sambhav pipe ki keemat deta hai aur aap list sabse saste pehle sort karte ho. Naive yojana us list se pipes khareedna hai jab tak aapne gaanvon se ek kam pipe na khareed liya ho, kyunki utne hi connections lagte hain. Par sabse saste do quotes do aise gaanvon ke beech nikalte hain jinhe ek pipe pehle se jodta hai — wo doosra pipe daalna kisko paani hai iske baare mein kuch nahi badalta, ye bas ek loop banaata hai, aur aapke budget se ek slot khaa jaata hai. Isi beech door ki taraf ka ek gaanv sookha rehta hai, kyunki jo pipe use pahunchta wo thoda mehenga tha aur kabhi khareeda hi nahi gaya. Fix har khareed se pehle poochha gaya ek akela atirikt sawaal hai: **kya in do gaanvon ke beech pehle se paani beh raha hai, kisi bhi raaste se?** Agar haan, ye pipe chhod do chahe wo kitna bhi sasta ho; agar nahi, khareed lo. Wo ek sawaal pipes ke ek saste dher aur ek sach mein minimal network ke beech poora antar hai. Wahi kaam karne ka ek doosra, utna hi vaidh tarika hai: keemat se globally shopping karne ke bajaye, ek gaanv se shuru karo aur baar-baar wo ek sabse sasta pipe daalo jo kahin abhi tak bina paani ke pahunchta hai — un pipes ko kabhi mat dekho jo do aise gaanvon ke beech hain jinke paas pehle se paani hai. Dono approaches usi kul cost par pahunchte hain, aur kaunsa chalaana sasta hai ye is par nirbhar karta hai ki region mein kuch lambi-doori ke connections hain ya chhote connections ka ghana jaal.',
    },

    simple: `**Start broken.** Sort the edges and take the n-1 cheapest, with no cycle check:

\`\`\`js
function mstBroken(n, edges) {           // edges: [u, v, weight]
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const chosen = [];
  for (const e of sorted) {
    if (chosen.length === n - 1) break;
    chosen.push(e);                      // <-- no check: does this close a cycle?
  }
  return { chosen, cost: chosen.reduce((s, e) => s + e[2], 0) };
}

// 4 nodes: a triangle of cheap edges among 0,1,2, and node 3 hanging off
const edges = [[0, 1, 1], [1, 2, 2], [0, 2, 3], [2, 3, 10]];
console.log(mstBroken(4, edges));
// picks [0-1 (1), 1-2 (2), 0-2 (3)] = cost 6, three edges as required...
// ...but node 3 is NEVER CONNECTED. That is not a spanning tree.
\`\`\`

The edge count is right and the cost is low, which is exactly why the bug is easy to miss. Edge \`0-2\` was pure waste: 0 and 2 were already linked through node 1. Spending that slot on a redundant edge is what stranded node 3.

**The fix (Kruskal): before adding an edge, ask whether its endpoints are already connected**

\`\`\`js
function kruskal(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x) {                                    // union-find, lesson 5
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;                        // ALREADY CONNECTED -> cycle
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[rb] < rank[ra]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  }

  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const chosen = [];
  let cost = 0;
  for (const [u, v, w] of sorted) {
    if (union(u, v)) { chosen.push([u, v, w]); cost += w; }   // the one added question
    if (chosen.length === n - 1) break;
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;   // null = graph disconnected
}

console.log(kruskal(4, edges));
// { chosen: [[0,1,1], [1,2,2], [2,3,10]], cost: 13 }  <-- every node reached
\`\`\`

**The same answer from the other direction (Prim): grow one blob, always leaving by the cheapest edge**

\`\`\`js
function prim(n, adj) {                  // adj[u] = [[v, w], ...]
  const inTree = new Array(n).fill(false);
  const heap = [[0, 0, -1]];             // [weight, node, cameFrom]
  const chosen = [];
  let cost = 0;

  while (heap.length && chosen.length < n - 1) {
    heap.sort((a, b) => a[0] - b[0]);    // stand-in for a real min-heap
    const [w, u, from] = heap.shift();
    if (inTree[u]) continue;             // lazy deletion: stale frontier entry
    inTree[u] = true;
    if (from !== -1) { chosen.push([from, u, w]); cost += w; }
    for (const [v, wt] of adj[u]) if (!inTree[v]) heap.push([wt, v, u]);
  }

  return chosen.length === n - 1 ? { chosen, cost } : null;
}
\`\`\`

\`\`\`ts
type Edge = [number, number, number];

function kruskal(n: number, edges: Edge[]): { chosen: Edge[]; cost: number } | null {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]!]!; x = parent[x]!; }
    return x;
  };
  const union = (a: number, b: number): boolean => {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    parent[rb] = ra;
    return true;
  };
  const chosen: Edge[] = [];
  let cost = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    if (union(u, v)) { chosen.push([u, v, w]); cost += w; }
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;
}
\`\`\`

Kruskal is global: consider all edges by price, and use union-find to reject the ones that would close a loop. Prim is local: hold one growing region, and use a heap to always take the cheapest edge leaving it. Both are greedy, both are provably optimal, and they usually pick different edge sets that happen to have the same total cost.`,

    simpleHi: `**Toote hue se shuru.** Edges sort karo aur n-1 sabse saste lo, bina cycle check ke:

\`\`\`js
function mstBroken(n, edges) {           // edges: [u, v, weight]
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const chosen = [];
  for (const e of sorted) {
    if (chosen.length === n - 1) break;
    chosen.push(e);                      // <-- koi check nahi: kya ye ek cycle banaata hai?
  }
  return { chosen, cost: chosen.reduce((s, e) => s + e[2], 0) };
}

// 4 nodes: 0,1,2 ke beech saste edges ka ek triangle, aur node 3 latka hua
const edges = [[0, 1, 1], [1, 2, 2], [0, 2, 3], [2, 3, 10]];
console.log(mstBroken(4, edges));
// chunta hai [0-1 (1), 1-2 (2), 0-2 (3)] = cost 6, zaroori teen edges...
// ...par node 3 KABHI JUDTA NAHI. Wo ek spanning tree nahi hai.
\`\`\`

Edge count sahi hai aur cost kam hai, jo bilkul wajah hai ki bug chhootna aasaan hai. Edge \`0-2\` shuddh barbaadi tha: 0 aur 2 node 1 ke zariye pehle se jude the. Wo slot ek fizool edge par kharch karna hi wo hai jisne node 3 ko alag chhoda.

**Fix (Kruskal): ek edge jodne se pehle poochho ki kya iske endpoints pehle se jude hain**

\`\`\`js
function kruskal(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x) {                                    // union-find, lesson 5
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;                        // PEHLE SE JUDE -> cycle
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[rb] < rank[ra]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  }

  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const chosen = [];
  let cost = 0;
  for (const [u, v, w] of sorted) {
    if (union(u, v)) { chosen.push([u, v, w]); cost += w; }   // ek joda gaya sawaal
    if (chosen.length === n - 1) break;
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;   // null = graph disconnected
}

console.log(kruskal(4, edges));
// { chosen: [[0,1,1], [1,2,2], [2,3,10]], cost: 13 }  <-- har node tak pahuncha
\`\`\`

**Doosri disha se wahi jawaab (Prim): ek blob badhao, hamesha sabse saste edge se nikalte hue**

\`\`\`js
function prim(n, adj) {                  // adj[u] = [[v, w], ...]
  const inTree = new Array(n).fill(false);
  const heap = [[0, 0, -1]];             // [weight, node, kahaanSe]
  const chosen = [];
  let cost = 0;

  while (heap.length && chosen.length < n - 1) {
    heap.sort((a, b) => a[0] - b[0]);    // ek asli min-heap ki jagah
    const [w, u, from] = heap.shift();
    if (inTree[u]) continue;             // lazy deletion: purani frontier entry
    inTree[u] = true;
    if (from !== -1) { chosen.push([from, u, w]); cost += w; }
    for (const [v, wt] of adj[u]) if (!inTree[v]) heap.push([wt, v, u]);
  }

  return chosen.length === n - 1 ? { chosen, cost } : null;
}
\`\`\`

\`\`\`ts
type Edge = [number, number, number];

function kruskal(n: number, edges: Edge[]): { chosen: Edge[]; cost: number } | null {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]!]!; x = parent[x]!; }
    return x;
  };
  const union = (a: number, b: number): boolean => {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    parent[rb] = ra;
    return true;
  };
  const chosen: Edge[] = [];
  let cost = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    if (union(u, v)) { chosen.push([u, v, w]); cost += w; }
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;
}
\`\`\`

Kruskal global hai: sab edges keemat se dekho, aur union-find se unhe rad karo jo ek loop banaate. Prim local hai: ek badhta hua region rakho, aur ek heap se hamesha usse nikalne waala sabse sasta edge lo. Dono greedy hain, dono provably optimal hain, aur wo aksar alag edge sets chunte hain jinki kul cost samaan hoti hai.`,

    content: `## Why greedy is provably correct here: the cut property

Module 12 spent a whole lesson on greedy algorithms that look right and are wrong. MST is the opposite case — greedy is *provably* optimal, and the proof is short enough to state in an interview.

\`\`\`
THE CUT PROPERTY
  Split the vertices into any two non-empty groups, A and B. Look at all edges
  with one endpoint in A and the other in B — call these the "crossing" edges.
  The CHEAPEST crossing edge is in some minimum spanning tree.

WHY (exchange argument — the same tool as Module 12's lesson 1):
  Suppose an MST T does not contain the cheapest crossing edge e.
  T connects everything, so it must cross from A to B somewhere — via some
  other crossing edge f, where weight(f) >= weight(e).
  Add e to T. That creates exactly one cycle, and that cycle must cross the
  A/B boundary an even number of times, so it contains f as well.
  Remove f. Still spanning, still a tree, and the cost changed by
  weight(e) - weight(f) <= 0. So this tree is at least as good, and it
  contains e.                                                             QED
\`\`\`

Both algorithms are just this property applied repeatedly, with different choices of the cut:

\`\`\`
Kruskal  cut = (the component containing u) vs (everything else).
         An edge is rejected exactly when both endpoints are on the same side,
         i.e. it is not a crossing edge at all. union() returning false IS
         the "not a crossing edge" test.

Prim     cut = (the blob built so far) vs (everything not yet in it).
         The heap's minimum IS the cheapest crossing edge, by construction.
\`\`\`

## Prim vs Dijkstra: one line apart, completely different answers

This is the most common MST confusion in interviews, so hold the two side by side:

\`\`\`
DIJKSTRA (lesson 6)                    PRIM (this lesson)
  push [dist[u] + w, v]                  push [w, v]
       ^^^^^^^^^^^^^                          ^^
       distance from the SOURCE               weight of THIS EDGE alone

Dijkstra answers: "how far is each node from the start?"
Prim answers:     "what is the cheapest set of edges connecting everything?"

Same heap, same visited array, same lazy-deletion "if (visited[u]) continue".
The priority is the only difference — and it changes the question entirely.
\`\`\`

A Dijkstra tree and an MST are usually *different trees*. Dijkstra may happily use an expensive edge if it shortens the path from the source; Prim never cares about paths at all.

## Which one to write, and what each costs

\`\`\`
Kruskal   O(E log E) to sort + O(E * a(V)) for union-find  ->  O(E log E)
          Better when the graph is SPARSE, when the edge list is already the
          input format, or when the edges arrive pre-sorted.
          Also naturally handles a DISCONNECTED graph: you get a minimum
          spanning FOREST, and chosen.length < n - 1 tells you it happened.

Prim      O(E log V) with a binary heap (O(E + V log V) with a Fibonacci heap)
          Better when the graph is DENSE (E close to V^2), and when you already
          have an adjacency list. Requires a connected graph to reach every node.

Rule of thumb: given an EDGE LIST, write Kruskal. Given an ADJACENCY LIST and a
dense graph, write Prim. Given a Dijkstra implementation you already trust,
Prim is a two-character edit away.
\`\`\`

## Facts that turn into interview follow-ups

\`\`\`
- An MST on n nodes always has exactly n - 1 edges. If your result has fewer,
  the graph was disconnected; more, and you have a bug.
- If all edge weights are DISTINCT, the MST is unique. With ties, several
  different edge sets can share the same minimum cost.
- Maximum spanning tree: sort descending (Kruskal) or use a max-heap (Prim).
  Nothing else changes.
- "Minimum cost to connect all points" with coordinates = build the complete
  graph of pairwise distances, then run Prim (dense -> Prim wins).
- MST does NOT minimise the path between any specific pair of nodes. That is
  Dijkstra's job, and conflating the two is the classic trap.
\`\`\``,

    contentHi: `## Greedy yahaan provably sahi kyun hai: cut property

Module 12 ne ek poora lesson un greedy algorithms par kharch kiya jo sahi dikhte hain aur galat hain. MST ulta case hai — greedy *provably* optimal hai, aur proof itna chhota hai ki ek interview mein bataaya jaa sakta hai.

\`\`\`
CUT PROPERTY
  Vertices ko kisi bhi do gair-khaali groups mein baanto, A aur B. Wo sab edges
  dekho jinka ek endpoint A mein aur doosra B mein hai — inhe "crossing" edges kaho.
  SABSE SASTA crossing edge kisi minimum spanning tree mein hai.

KYUN (exchange argument — Module 12 ke lesson 1 jaisa hi auzaar):
  Maano ek MST T mein sabse sasta crossing edge e nahi hai.
  T sab kuch jodta hai, isliye ise A se B kahin cross karna hi hoga — kisi
  doosre crossing edge f ke zariye, jahaan weight(f) >= weight(e).
  T mein e jodo. Wo bilkul ek cycle banaata hai, aur us cycle ko A/B seema
  ko sam tadaad mein cross karna hoga, isliye ismein f bhi hai.
  f hataao. Abhi bhi spanning, abhi bhi ek tree, aur cost
  weight(e) - weight(f) <= 0 se badli. Toh ye tree kam se kam utna hi achha
  hai, aur ismein e hai.                                                  QED
\`\`\`

Dono algorithms bas ye property baar-baar lagaayi gayi hain, cut ke alag chunaavon ke saath:

\`\`\`
Kruskal  cut = (u waala component) vs (baaki sab kuch).
         Ek edge bilkul tab rad hota hai jab dono endpoints usi taraf hain,
         matlab wo ek crossing edge hai hi nahi. union() ka false return karna
         HI "crossing edge nahi hai" test hai.

Prim     cut = (ab tak bana blob) vs (jo abhi tak ismein nahi).
         Heap ka minimum HI sabse sasta crossing edge hai, nirmaan se.
\`\`\`

## Prim vs Dijkstra: ek line ka antar, poori tarah alag jawaab

Ye interviews mein sabse aam MST bhram hai, isliye dono ko saath-saath rakho:

\`\`\`
DIJKSTRA (lesson 6)                    PRIM (ye lesson)
  push [dist[u] + w, v]                  push [w, v]
       ^^^^^^^^^^^^^                          ^^
       SOURCE se doori                        SIRF IS EDGE ka weight

Dijkstra jawaab deta hai: "har node shuruaat se kitni door hai?"
Prim jawaab deta hai:     "sab kuch jodne waala sabse sasta edge set kya hai?"

Wahi heap, wahi visited array, wahi lazy-deletion "if (visited[u]) continue".
Priority ekmatra antar hai — aur wo sawaal poori tarah badal deta hai.
\`\`\`

Ek Dijkstra tree aur ek MST aksar *alag trees* hote hain. Dijkstra khushi se ek mehenga edge istemal kar sakta hai agar wo source se path chhota karta hai; Prim ko paths ki parwaah hai hi nahi.

## Kaunsa likhna hai, aur har ek kya kharch karta hai

\`\`\`
Kruskal   sort karne ko O(E log E) + union-find ke liye O(E * a(V))  ->  O(E log E)
          Behtar jab graph SPARSE ho, jab edge list pehle se input format ho,
          ya jab edges pehle se sorted aayein.
          Ek DISCONNECTED graph bhi swabhaavik roop se sambhaalta hai: aapko ek
          minimum spanning FOREST milta hai, aur chosen.length < n - 1 batata hai.

Prim      ek binary heap se O(E log V) (Fibonacci heap se O(E + V log V))
          Behtar jab graph GHANA ho (E, V^2 ke kareeb), aur jab aapke paas pehle
          se ek adjacency list ho. Har node tak pahunchne ko connected graph chahiye.

Angootha niyam: ek EDGE LIST milne par Kruskal likho. Ek ADJACENCY LIST aur ghana
graph milne par Prim likho. Ek Dijkstra implementation jispar aap pehle se bharosa
karte ho, Prim usse do-character ke edit ki doori par hai.
\`\`\`

## Wo tathya jo interview follow-ups ban jaate hain

\`\`\`
- n nodes par ek MST mein hamesha bilkul n - 1 edges hote hain. Agar aapke nateeje
  mein kam hain, graph disconnected tha; zyaada hain, toh ek bug hai.
- Agar sab edge weights ALAG hain, MST anokha hai. Ties ke saath, kayi alag
  edge sets wahi minimum cost share kar sakte hain.
- Maximum spanning tree: ghatte kram mein sort karo (Kruskal) ya ek max-heap
  istemal karo (Prim). Aur kuch nahi badalta.
- Coordinates ke saath "sab points jodne ki minimum cost" = pairwise distances
  ka poora graph banao, phir Prim chalao (ghana -> Prim jeetta hai).
- MST kisi khaas jodi ke nodes ke beech path ko MINIMISE NAHI karta. Wo
  Dijkstra ka kaam hai, aur dono ko milaana classic jaal hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: n-1 cheapest edges, no cycle check',
        titleHi: 'Toota: n-1 sabse saste edges, koi cycle check nahi',
        code: `chosen.push(e);   // no test for "are u and v already connected?"`,
        codeJs: `function mstBroken(n, edges) {
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const chosen = [];
  for (const e of sorted) { if (chosen.length === n - 1) break; chosen.push(e); }
  const reached = new Set();
  chosen.forEach(([u, v]) => { reached.add(u); reached.add(v); });
  return { chosen, cost: chosen.reduce((s, e) => s + e[2], 0), nodesReached: reached.size };
}
const edges = [[0, 1, 1], [1, 2, 2], [0, 2, 3], [2, 3, 10]];
console.log(mstBroken(4, edges));`,
        codeTs: `function mstBroken(n: number, edges: [number, number, number][]) {
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const chosen: [number, number, number][] = [];
  for (const e of sorted) { if (chosen.length === n - 1) break; chosen.push(e); }
  return { chosen, cost: chosen.reduce((s, e) => s + e[2], 0) };
}`,
        outputJs: `{
  chosen: [ [ 0, 1, 1 ], [ 1, 2, 2 ], [ 0, 2, 3 ] ],
  cost: 6,
  nodesReached: 3
}`,
        outputTs: `// Same wrong structure: 3 edges, but only 3 of 4 nodes reached.`,
        explain: 'Exactly n-1 edges and the lowest possible cost, yet node 3 is unreachable. Edge 0-2 was redundant because 0 and 2 were already linked through 1, and spending that slot is what stranded node 3.',
        explainHi: 'Bilkul n-1 edges aur sabse kam sambhav cost, phir bhi node 3 apahunch hai. Edge 0-2 fizool tha kyunki 0 aur 2 pehle se 1 ke zariye jude the, aur wo slot kharch karna hi wo hai jisne node 3 ko alag chhoda.',
      },
      {
        title: 'Fixed: Kruskal, where union() returning false is the cycle test',
        titleHi: 'Theek: Kruskal, jahaan union() ka false return karna cycle test hai',
        code: `if (union(u, v)) { chosen.push([u, v, w]); cost += w; }
// union() returns false when find(u) === find(v) — i.e. adding this closes a cycle`,
        codeJs: `function kruskal(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  const union = (a, b) => {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[rb] < rank[ra]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
    return true;
  };
  const chosen = [];
  let cost = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    if (union(u, v)) { chosen.push([u, v, w]); cost += w; }
    if (chosen.length === n - 1) break;
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;
}
console.log(kruskal(4, [[0,1,1],[1,2,2],[0,2,3],[2,3,10]]));
console.log(kruskal(3, [[0,1,1]]));   // disconnected -> null`,
        codeTs: `type Edge = [number, number, number];
function kruskal(n: number, edges: Edge[]): { chosen: Edge[]; cost: number } | null {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]!]!; x = parent[x]!; }
    return x;
  };
  const chosen: Edge[] = [];
  let cost = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    const ra = find(u), rb = find(v);
    if (ra !== rb) { parent[rb] = ra; chosen.push([u, v, w]); cost += w; }
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;
}`,
        outputJs: `{ chosen: [ [ 0, 1, 1 ], [ 1, 2, 2 ], [ 2, 3, 10 ] ], cost: 13 }
null`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Cost rose from 6 to 13, and that is correct — 6 was never a valid answer. The final check chosen.length === n - 1 is what detects a disconnected graph and returns null instead of a broken tree.',
        explainHi: 'Cost 6 se 13 par badhi, aur wo sahi hai — 6 kabhi ek vaidh jawaab tha hi nahi. Antim check chosen.length === n - 1 wo hai jo ek disconnected graph pakadta hai aur ek toote tree ke bajaye null return karta hai.',
      },
      {
        title: 'Prim, and the one line that separates it from Dijkstra',
        titleHi: 'Prim, aur wo ek line jo ise Dijkstra se alag karti hai',
        code: `heap.push([wt, v, u]);        // PRIM: the edge weight alone
// heap.push([dist[u] + wt, v]); // DIJKSTRA: accumulated distance from the source`,
        codeJs: `function prim(n, adj) {
  const inTree = new Array(n).fill(false);
  const heap = [[0, 0, -1]];
  const chosen = [];
  let cost = 0;
  while (heap.length && chosen.length < n - 1) {
    heap.sort((a, b) => a[0] - b[0]);
    const [w, u, from] = heap.shift();
    if (inTree[u]) continue;
    inTree[u] = true;
    if (from !== -1) { chosen.push([from, u, w]); cost += w; }
    for (const [v, wt] of adj[u]) if (!inTree[v]) heap.push([wt, v, u]);
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;
}
const adj = [[[1,1],[2,3]], [[0,1],[2,2]], [[0,3],[1,2],[3,10]], [[2,10]]];
console.log(prim(4, adj));   // same total cost as Kruskal

// Prim and Dijkstra disagree on which tree to build:
const adj2 = [[[1,4],[2,1]], [[0,4],[2,2]], [[0,1],[1,2]]];
console.log('prim cost:', prim(3, adj2).cost);   // 3  (edges 0-2 w1, 2-1 w2)`,
        codeTs: `function prim(n: number, adj: [number, number][][]) {
  const inTree = new Array<boolean>(n).fill(false);
  const heap: [number, number, number][] = [[0, 0, -1]];
  const chosen: [number, number, number][] = [];
  let cost = 0;
  while (heap.length && chosen.length < n - 1) {
    heap.sort((a, b) => a[0] - b[0]);
    const [w, u, from] = heap.shift()!;
    if (inTree[u]) continue;
    inTree[u] = true;
    if (from !== -1) { chosen.push([from, u, w]); cost += w; }
    for (const [v, wt] of adj[u]!) if (!inTree[v]) heap.push([wt, v, u]);
  }
  return chosen.length === n - 1 ? { chosen, cost } : null;
}`,
        outputJs: `{ chosen: [ [ 0, 1, 1 ], [ 1, 2, 2 ], [ 2, 3, 10 ] ], cost: 13 }
prim cost: 3`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Prim reaches the same total cost as Kruskal by a completely different route — growing one region rather than sorting globally. The heap entry carries the raw edge weight; adding the accumulated distance instead would turn this into Dijkstra and answer a different question.',
        explainHi: 'Prim Kruskal jaisi hi kul cost par ek bilkul alag raaste se pahunchta hai — globally sort karne ke bajaye ek region badhaakar. Heap entry kachcha edge weight rakhti hai; iske bajaye jama doori jodna ise Dijkstra bana dega aur ek alag sawaal ka jawaab dega.',
      },
    ],

    mistakes: [
      {
        wrong: `// stopping at n-1 edges without ever checking connectivity
for (const e of sorted) { if (chosen.length === n - 1) break; chosen.push(e); }
return chosen;   // might be a cheap set of edges that leaves nodes stranded`,
        right: `for (const [u, v, w] of sorted) if (union(u, v)) { chosen.push([u, v, w]); cost += w; }
return chosen.length === n - 1 ? { chosen, cost } : null;   // verify, then report`,
        why: 'Having n-1 edges is necessary but not sufficient for a spanning tree — n-1 edges plus one cycle means one component is disconnected. The union-find check rejects cycle-forming edges, and the final length test is what catches a disconnected input.',
        whyHi: 'n-1 edges hona ek spanning tree ke liye zaruri hai par kaafi nahi — n-1 edges plus ek cycle matlab ek component alag hai. Union-find check cycle banaane waale edges rad karta hai, aur antim length test wo hai jo ek disconnected input pakadta hai.',
      },
      {
        wrong: `// writing Dijkstra and calling it Prim
heap.push([dist[u] + wt, v]);   // accumulated distance from the source`,
        right: `heap.push([wt, v, u]);          // the weight of THIS edge only`,
        why: 'Dijkstra minimises distance from a single source; Prim minimises the total weight of the connecting tree. They share the heap, the visited array and the lazy-deletion guard, but pushing the accumulated distance answers the wrong question and generally produces a more expensive tree.',
        whyHi: 'Dijkstra ek akele source se doori minimise karta hai; Prim jodne waale tree ka kul weight minimise karta hai. Wo heap, visited array aur lazy-deletion guard share karte hain, par jama doori push karna galat sawaal ka jawaab deta hai aur aam taur par ek zyaada mehenga tree banaata hai.',
      },
      {
        wrong: `// forgetting the stale-entry guard in Prim
const [w, u, from] = heap.shift();
inTree[u] = true;              // u may ALREADY be in the tree from a cheaper entry
chosen.push([from, u, w]);     // adds a duplicate/cycle edge`,
        right: `const [w, u, from] = heap.shift();
if (inTree[u]) continue;       // lazy deletion — same guard as Dijkstra
inTree[u] = true;`,
        why: 'A node can be pushed onto the heap once per incident edge, so several entries for the same node coexist. Only the first one popped is the cheapest; the rest are stale and must be skipped, or the tree gains extra edges and the cost is overcounted.',
        whyHi: 'Ek node prati incident edge ek baar heap par push ho sakta hai, isliye usi node ki kayi entries saath rehti hain. Sirf pehli pop hui sabse sasti hai; baaki purani hain aur skip honi chahiye, warna tree ko atirikt edges milte hain aur cost zyaada gini jaati hai.',
      },
    ],

    realWorld: [
      {
        en: '**Network and utility planning** — laying fibre, power lines, or water mains to connect every site at minimum total cost — is the original motivating problem, and Kruskal is still what planning tools run underneath.',
        hi: '**Network aur utility planning** — har site ko kam se kam kul cost par jodne ke liye fibre, power lines, ya water mains daalna — mool prerak problem hai, aur planning tools abhi bhi andar Kruskal chalate hain.',
      },
      {
        en: '**Clustering** uses MSTs directly: build the MST over pairwise distances, then delete the k-1 most expensive edges and the tree falls apart into exactly k clusters — this is single-linkage clustering.',
        hi: '**Clustering** MSTs seedhe istemal karta hai: pairwise distances par MST banao, phir k-1 sabse mehenge edges delete karo aur tree bilkul k clusters mein toot jaata hai — ye single-linkage clustering hai.',
      },
      {
        en: '**Image segmentation and maze generation** both build a spanning tree over a grid graph — segmentation to group similar pixels, maze generation to carve a perfect maze, which is by definition a spanning tree of the cell grid.',
        hi: '**Image segmentation aur maze generation** dono ek grid graph par ek spanning tree banaate hain — segmentation samaan pixels group karne ko, maze generation ek perfect maze kaatne ko, jo paribhaasha se cell grid ka ek spanning tree hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Prove that the greedy choice in Kruskal is safe. Why does taking the cheapest edge never lock you out of the optimum?',
        qHi: 'Saabit karo ki Kruskal mein greedy chunaav surakshit hai. Sabse sasta edge lena aapko optimum se kabhi bahar kyun nahi karta?',
        a: 'The justification is the cut property, and it is proved by an exchange argument — the same technique used to justify interval scheduling in the greedy module. State the property first: take any way of splitting the vertices into two non-empty groups, call them A and B, and look at the edges that have one endpoint in each group. Among those crossing edges, the cheapest one belongs to some minimum spanning tree. To prove it, suppose you have a minimum spanning tree that does not contain that cheapest crossing edge, call it e. The tree connects every vertex, so it must get from group A to group B somehow, which means it uses at least one other crossing edge, call it f. Since e was the cheapest crossing edge, the weight of f is greater than or equal to the weight of e. Now add e to the tree. A tree plus one extra edge creates exactly one cycle, and that cycle has to leave group A and come back, so it crosses the boundary an even number of times and therefore contains f as well as e. Delete f. What remains still touches every vertex, still has exactly n minus one edges, and has no cycle, so it is a spanning tree, and its cost changed by the weight of e minus the weight of f, which is at most zero. So this new tree is no more expensive than the one we started with, meaning it is also minimum, and it contains e. That proves e is safe to take. Kruskal is this property applied over and over: when it considers an edge and the two endpoints are in different components, the cut separating one component from everything else is a valid cut, and because edges are processed in sorted order this is the cheapest edge crossing it, so it is safe. When the endpoints are already in the same component the edge crosses no cut at all and is simply rejected. Prim is the same property with the cut fixed as the grown blob versus everything else, and the heap guarantees the minimum crossing edge is the one popped.',
        aHi: 'Auchitya cut property hai, aur ye ek exchange argument se saabit hoti hai — wahi technique jo greedy module mein interval scheduling ko sahi thehraane ko istemal hui. Pehle property batao: vertices ko do gair-khaali groups mein baantne ka koi bhi tarika lo, unhe A aur B kaho, aur wo edges dekho jinka har group mein ek endpoint hai. Un crossing edges mein se, sabse sasta kisi minimum spanning tree ka hissa hai. Ise saabit karne ko, maano aapke paas ek minimum spanning tree hai jismein wo sabse sasta crossing edge nahi hai, use e kaho. Tree har vertex ko jodta hai, isliye ise group A se group B tak kisi tarah jaana hi hoga, jiska matlab ye kam se kam ek doosra crossing edge istemal karta hai, use f kaho. Kyunki e sabse sasta crossing edge tha, f ka weight e ke weight se bada ya barabar hai. Ab tree mein e jodo. Ek tree plus ek atirikt edge bilkul ek cycle banaata hai, aur us cycle ko group A chhodkar wapas aana hi hai, isliye ye seema ko sam tadaad mein cross karta hai aur isliye ismein e ke saath f bhi hai. f hataao. Jo bacha wo abhi bhi har vertex ko chhoota hai, abhi bhi bilkul n minus ek edges rakhta hai, aur ismein koi cycle nahi hai, isliye ye ek spanning tree hai, aur iski cost e ke weight minus f ke weight se badli, jo zyaada se zyaada shunya hai. Toh ye naya tree us se zyaada mehenga nahi jisse humne shuru kiya, matlab ye bhi minimum hai, aur ismein e hai. Wo saabit karta hai ki e lena surakshit hai.',
      },
      {
        q: 'What is the difference between a minimum spanning tree and a shortest-path tree, and when would each be the wrong answer?',
        qHi: 'Ek minimum spanning tree aur ek shortest-path tree mein kya antar hai, aur har ek kab galat jawaab hoga?',
        a: 'They optimise two genuinely different quantities, and the trees they produce are usually not the same. A minimum spanning tree minimises the sum of the weights of the edges used, subject only to the requirement that every vertex ends up connected. It has no notion of a starting point, and it makes no promise whatsoever about the distance between any particular pair of vertices — the path between two nodes inside an MST can be far longer than the shortest path between them in the original graph. A shortest-path tree, which is what Dijkstra builds, is defined relative to a specific source vertex, and it guarantees that the path from that source to every other vertex is as short as possible. It makes no promise about total weight, and it will happily include an expensive edge if that edge shortens someone\'s path from the source. So the wrong-answer cases fall out directly. If the question is about laying cable or pipe to connect every site as cheaply as possible, and nobody cares how long any individual route is, then an MST is right and a Dijkstra tree is wrong because it will spend more total cable. If the question is about routing packets or delivering from a warehouse, where latency from one origin to each destination is what matters, then Dijkstra is right and the MST is wrong, potentially catastrophically — the MST might route a node through half the network to save on total edge weight. The other structural difference worth naming is that the algorithms are near-identical in code: both use a min-heap, a visited set, and a lazy-deletion guard, and the only substantive difference is what gets pushed as the priority. Prim pushes the weight of the single edge being considered; Dijkstra pushes the accumulated distance from the source plus that edge. That one expression is the entire difference between the two answers, which is exactly why they get confused so often.',
        aHi: 'Wo do sach mein alag maatraayein optimise karte hain, aur jo trees wo banate hain wo aksar samaan nahi hote. Ek minimum spanning tree istemal kiye gaye edges ke weights ka yog minimise karta hai, sirf is zaroorat ke tahat ki har vertex ant mein juda ho. Iske paas ek shuruaati bindu ka koi vichaar nahi hai, aur ye kisi bhi khaas jodi ke vertices ke beech doori ke baare mein koi vaada nahi karta — ek MST ke andar do nodes ke beech path mool graph mein unke beech ke shortest path se kaafi lamba ho sakta hai. Ek shortest-path tree, jo Dijkstra banaata hai, ek khaas source vertex ke saapeksh paribhaashit hai, aur ye guarantee karta hai ki us source se har doosre vertex tak ka path jitna chhota ho sake utna hai. Ye kul weight ke baare mein koi vaada nahi karta, aur ye khushi se ek mehenga edge shaamil karega agar wo edge kisi ka source se path chhota karta hai. Toh galat-jawaab waale case seedhe nikalte hain. Agar sawaal har site ko jitna sasta ho sake jodne ke liye cable ya pipe daalne ke baare mein hai, aur kisi ko parwaah nahi ki koi vyaktigat route kitna lamba hai, toh MST sahi hai aur ek Dijkstra tree galat hai kyunki wo zyaada kul cable kharch karega. Agar sawaal packets route karne ya ek warehouse se delivery ke baare mein hai, jahaan ek origin se har destination tak latency maayne rakhti hai, toh Dijkstra sahi hai aur MST galat hai. Doosra sanrachnaatmak antar naam lene laayak ye hai ki algorithms code mein lagbhag samaan hain: dono ek min-heap, ek visited set, aur ek lazy-deletion guard istemal karte hain, aur ekmatra saargarbhit antar ye hai ki priority ki tarah kya push hota hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement kruskal with union-find and run it on n=4 with edges [[0,1,1],[1,2,2],[0,2,3],[2,3,10]] (expect cost 13, edges 0-1, 1-2, 2-3). Then run it on n=3 with only [[0,1,1]] and confirm it returns null rather than a two-node "tree".',
        taskHi: 'kruskal ko union-find se implement karo aur ise n=4 par edges [[0,1,1],[1,2,2],[0,2,3],[2,3,10]] ke saath chalao (expect cost 13, edges 0-1, 1-2, 2-3). Phir ise n=3 par sirf [[0,1,1]] ke saath chalao aur confirm karo ki ye ek do-node "tree" ke bajaye null return karta hai.',
        hint: 'The disconnected case is caught by the final chosen.length === n - 1 test, not by anything inside the loop. Without that test the function silently returns a spanning forest and calls it a tree.',
        hintHi: 'Disconnected case antim chosen.length === n - 1 test se pakda jaata hai, loop ke andar kisi cheez se nahi. Us test ke bina function chupchaap ek spanning forest return karta hai aur use tree kehta hai.',
      },
      {
        task: 'Implement prim on an adjacency list and confirm it produces the SAME total cost as your kruskal on the same graph, then print both edge lists and note whether they picked identical edges. Build a graph with tied weights where they differ.',
        taskHi: 'prim ko ek adjacency list par implement karo aur confirm karo ki ye usi graph par tumhaare kruskal jaisi hi KUL cost banaata hai, phir dono edge lists print karo aur note karo ki kya unhone samaan edges chune. Ek aisa graph banao jismein tied weights hon jahaan wo alag hon.',
        hint: 'With all-distinct weights the MST is unique, so both must pick exactly the same edges. Introduce two edges of equal weight and the two algorithms can legitimately choose differently while both remain optimal.',
        hintHi: 'Sab-alag weights ke saath MST anokha hai, isliye dono ko bilkul wahi edges chunne chahiye. Barabar weight ke do edges laao aur dono algorithms vaidh roop se alag chun sakte hain jabki dono optimal rehte hain.',
      },
      {
        task: 'Take your prim and change the heap push from [wt, v, u] to [distSoFar + wt, v, u], turning it into Dijkstra. On the graph adj = [[[1,4],[2,1]], [[0,4],[2,2]], [[0,1],[1,2]]] compare the two edge sets and the two totals, and explain in one sentence which question each answers.',
        taskHi: 'Apne prim ko lo aur heap push ko [wt, v, u] se [distSoFar + wt, v, u] mein badlo, ise Dijkstra bana kar. Graph adj = [[[1,4],[2,1]], [[0,4],[2,2]], [[0,1],[1,2]]] par dono edge sets aur dono totals compare karo, aur ek vaakya mein samjhaao ki har ek kaunse sawaal ka jawaab deta hai.',
        hint: 'Prim gives total 3 using edges 0-2 (w1) and 2-1 (w2). Dijkstra from node 0 gives dist[1] = 3 via 0-2-1, which happens to agree here — build a graph with a heavy direct edge that shortens a path to make them disagree.',
        hintHi: 'Prim edges 0-2 (w1) aur 2-1 (w2) se kul 3 deta hai. Node 0 se Dijkstra dist[1] = 3 deta hai 0-2-1 se, jo yahaan samyog se sahmat hai — unhe asahmat karne ke liye ek aisa graph banao jismein ek bhaari seedha edge ek path chhota karta ho.',
      },
    ],

    keyTakeaways: [
      'An MST connects all n nodes with exactly n-1 edges at minimum total weight. Having n-1 cheap edges is NOT enough — without a cycle check you get a cheap edge set that strands part of the graph.',
      'Kruskal: sort all edges by weight, add each one only if union(u, v) succeeds. union() returning false IS the cycle test, and it is the union-find from lesson 5 doing all the work. O(E log E).',
      'Prim: grow one region from any start node, always taking the cheapest edge leaving it, using a min-heap. O(E log V), better on dense graphs and when you already have an adjacency list.',
      'Greedy is provably optimal here by the CUT PROPERTY: for any split of the vertices, the cheapest edge crossing the split belongs to some MST — proved by an exchange argument.',
      'Prim and Dijkstra are the same code except for the heap priority: Prim pushes the edge weight, Dijkstra pushes dist[u] + weight. They answer different questions and usually build different trees.',
      'Always verify chosen.length === n - 1 at the end. Fewer edges means the graph was disconnected (you built a spanning FOREST); more means a bug.',
      'Distinct weights => unique MST. Maximum spanning tree => sort descending or use a max-heap; nothing else changes.',
    ],
    keyTakeawaysHi: [
      'Ek MST sab n nodes ko bilkul n-1 edges se kam se kam kul weight par jodta hai. n-1 saste edges hona KAAFI NAHI hai — cycle check ke bina aapko ek sasta edge set milta hai jo graph ka ek hissa alag chhod deta hai.',
      'Kruskal: sab edges weight se sort karo, har ek ko sirf tab jodo jab union(u, v) safal ho. union() ka false return karna HI cycle test hai, aur wo lesson 5 waala union-find saara kaam kar raha hai. O(E log E).',
      'Prim: kisi bhi start node se ek region badhao, hamesha usse nikalne waala sabse sasta edge lete hue, ek min-heap se. O(E log V), ghane graphs par aur jab aapke paas pehle se adjacency list ho tab behtar.',
      'Greedy yahaan CUT PROPERTY se provably optimal hai: vertices ke kisi bhi vibhaajan ke liye, us vibhaajan ko cross karne waala sabse sasta edge kisi MST ka hissa hai — ek exchange argument se saabit.',
      'Prim aur Dijkstra heap priority ko chhodkar wahi code hain: Prim edge weight push karta hai, Dijkstra dist[u] + weight push karta hai. Wo alag sawaalon ka jawaab dete hain aur aksar alag trees banate hain.',
      'Ant mein hamesha chosen.length === n - 1 verify karo. Kam edges matlab graph disconnected tha (aapne ek spanning FOREST banaya); zyaada matlab ek bug.',
      'Alag weights => anokha MST. Maximum spanning tree => ghatte kram mein sort karo ya max-heap istemal karo; aur kuch nahi badalta.',
    ],
  },
];
