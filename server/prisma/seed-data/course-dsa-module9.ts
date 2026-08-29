/**
 * DSA Complete Course — Module 9: Graphs, lesson 1.
 *
 * How to represent a graph in memory: adjacency list versus adjacency matrix.
 * Builds on this course's Module 3 (a hash map / array of lists is the natural
 * container) and Module 7 (a tree is just a graph with no cycles and one path
 * between any two nodes — the node-with-neighbours idea generalises). Broken
 * example: storing a sparse real-world graph (a social network: millions of
 * people, each with a few hundred connections) as a V-by-V adjacency matrix —
 * that is V^2 booleans, almost all false, and for a million nodes it is a
 * trillion cells that will not even allocate. Fixed with an adjacency list: for
 * each node, store only the list of nodes it actually connects to, which is
 * O(V + E) memory total and iterates a node's real neighbours directly. The
 * lesson also shows the case where a matrix IS the right call (small, dense
 * graphs where O(1) "is there an edge between i and j?" matters).
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

export const DSA_MODULE_9: CourseLesson[] = [
  {
    slug: 'graph-representations-list-vs-matrix',
    title: 'Graph Representations: Adjacency List vs Adjacency Matrix',
    titleHi: 'Graph Representations: Adjacency List vs Adjacency Matrix',
    description: 'Modelling a social network — a few million people, each connected to a few hundred others — as a grid with one row and one column per person, a true/false in every cell for "are these two connected". For a million people that grid is a trillion cells, almost every one of them false, and it will not fit in memory at all.',
    descriptionHi: 'Ek social network model karna — kuch million log, har ek kuch sau doosron se juda — ek grid ki tarah jismein prati vyakti ek row aur ek column hai, har cell mein ek true/false "kya ye do jude hain" ke liye. Ek million logon ke liye wo grid ek trillion cells hai, lagbhag har ek false, aur ye memory mein bilkul fit nahi hogi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A phone book versus a giant attendance chart pinned to a wall.** Suppose you want to record, for a whole city, who knows whom. The attendance-chart approach: one enormous grid with every resident\'s name down the side AND across the top, and you put a tick in a cell whenever the person for that row knows the person for that column. For a city of a million people that is a million rows times a million columns — a trillion cells — and since a typical person knows a few hundred others, more than 99.99 percent of those cells are blank. You would spend a fortune on wall space to store mostly nothing. The phone-book approach: one page per resident, and on each person\'s page you simply write the names of the people they actually know. Ravi\'s page lists his 200 friends; Meena\'s lists her 150. The total amount written is proportional to the number of actual friendships, not to the square of the population. Looking up "who does Ravi know?" is instant — you read his page. The only thing the phone book is slower at is answering "do Ravi and Sunil know each other?" without knowing where to look — you have to scan Ravi\'s page for Sunil\'s name — whereas the grid answers that by pointing at one cell. Which representation is right depends entirely on which of those two questions you ask more often, and on how full the grid would actually be.',
      hi: '**Ek phone book versus ek deewaar par pinned ek vishaal attendance chart.** Maano aap ek poore shehar ke liye record karna chahte ho, kaun kisko jaanta hai. Attendance-chart approach: ek bahut bada grid jismein har nivaasi ka naam side mein AUR top ke aar-paar, aur aap ek cell mein ek tick lagaate ho jab bhi us row ka vyakti us column ke vyakti ko jaanta hai. Ek million logon ke shehar ke liye wo ek million rows guna ek million columns hai — ek trillion cells — aur kyunki ek typical vyakti kuch sau doosron ko jaanta hai, un cells ka 99.99 pratishat se zyaada khaali hai. Aap zyaadaatar kuch nahi store karne ke liye deewaar ki jagah par ek bhaari raqam kharch karoge. Phone-book approach: prati nivaasi ek page, aur har vyakti ke page par aap bas un logon ke naam likhte ho jinhe wo asal mein jaante hain. Ravi ke page par uske 200 dost list hain; Meena ke page par uske 150. Kul likhi gayi maatra asal dostiyon ki tadaad ke anupaat mein hai, aabaadi ke varg ke nahi. "Ravi kisko jaanta hai?" dekhna turant hai — aap uska page padhte ho. Ekmatra cheez jismein phone book slow hai wo hai "kya Ravi aur Sunil ek doosre ko jaante hain?" ka jawaab dena bina jaane kahaan dekhna hai — aapko Ravi ke page ko Sunil ke naam ke liye scan karna padta hai — jabki grid us par ek cell dikhaakar jawaab deta hai. Kaunsa representation sahi hai poori tarah is par nirbhar karta hai ki aap un do sawaalon mein se kaunsa zyaada aksar poochte ho, aur grid asal mein kitna bhara hoga.',
    },

    simple: `**Start broken.** You want to store an undirected graph so you can answer "who are node X's neighbours?". The matrix approach: a V-by-V grid, \`matrix[i][j] = true\` when there is an edge between \`i\` and \`j\`:

\`\`\`js
function buildMatrix(numNodes, edges) {
  const m = Array.from({ length: numNodes }, () => new Array(numNodes).fill(false));
  for (const [a, b] of edges) { m[a][b] = true; m[b][a] = true; }
  return m;
}
// memory: numNodes * numNodes booleans, ALWAYS, regardless of how few edges exist
\`\`\`

For a graph of 1,000,000 nodes this array is 1,000,000,000,000 cells. Even at one byte each that is a terabyte, and a real social graph where the average person has ~200 connections means 99.98% of those cells are \`false\`. The representation cost scales with V squared even though the actual information scales with the number of edges.

**The fix: an adjacency list — store only the edges that exist**

\`\`\`js
function buildAdjList(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  return adj;
}

// adj[5] is exactly the list of node 5's neighbours — nothing else stored
\`\`\`

\`\`\`ts
type Graph = number[][];               // adj[node] = list of neighbour nodes

function buildAdjList(numNodes: number, edges: [number, number][]): Graph {
  const adj: Graph = Array.from({ length: numNodes }, () => []);
  for (const [a, b] of edges) {
    adj[a]!.push(b);
    adj[b]!.push(a);
  }
  return adj;
}
\`\`\`

Now the memory is O(V + E): one list per node (V) plus one entry per edge endpoint (2E for an undirected graph). A million nodes with 200 million edges is 400 million entries — a few gigabytes, not a terabyte — and iterating node 5's neighbours is just \`for (const n of adj[5])\`, which visits exactly its real neighbours and nothing else.

**When the matrix is actually the right choice**

\`\`\`
Use an adjacency MATRIX when:
  - the graph is small (V up to a few thousand) OR genuinely dense (E close to V^2)
  - you frequently ask "is there an edge between i and j?" and need it in O(1)
  - you want simple, index-based math (common in dynamic programming over graphs)

Use an adjacency LIST when (this is the default):
  - the graph is sparse (E much less than V^2) — almost all real-world graphs
  - you mostly iterate a node's neighbours rather than test specific pairs
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Aap ek undirected graph store karna chahte ho taaki aap "node X ke neighbours kaun hain?" ka jawaab de sako. Matrix approach: ek V-by-V grid, \`matrix[i][j] = true\` jab \`i\` aur \`j\` ke beech ek edge hai:

\`\`\`js
function buildMatrix(numNodes, edges) {
  const m = Array.from({ length: numNodes }, () => new Array(numNodes).fill(false));
  for (const [a, b] of edges) { m[a][b] = true; m[b][a] = true; }
  return m;
}
// memory: numNodes * numNodes booleans, HAMESHA, chahe kitne bhi kam edges hon
\`\`\`

1,000,000 nodes ke ek graph ke liye ye array 1,000,000,000,000 cells hai. Ek byte prati bhi wo ek terabyte hai, aur ek asli social graph jahaan average vyakti ke ~200 connections hain matlab un cells ka 99.98% \`false\` hai. Representation cost V varg ke saath scale karta hai jabki asli jaankaari edges ki tadaad ke saath scale karti hai.

**Fix: ek adjacency list — sirf wo edges store karo jo maujood hain**

\`\`\`js
function buildAdjList(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  return adj;
}

// adj[5] bilkul node 5 ke neighbours ki list hai — aur kuch store nahi
\`\`\`

\`\`\`ts
type Graph = number[][];               // adj[node] = neighbour nodes ki list

function buildAdjList(numNodes: number, edges: [number, number][]): Graph {
  const adj: Graph = Array.from({ length: numNodes }, () => []);
  for (const [a, b] of edges) {
    adj[a]!.push(b);
    adj[b]!.push(a);
  }
  return adj;
}
\`\`\`

Ab memory O(V + E) hai: prati node ek list (V) plus prati edge endpoint ek entry (ek undirected graph ke liye 2E). 200 million edges ke saath ek million nodes 400 million entries hai — kuch gigabytes, ek terabyte nahi — aur node 5 ke neighbours iterate karna bas \`for (const n of adj[5])\` hai, jo bilkul iske asli neighbours dekhta hai aur kuch nahi.

**Jab matrix asal mein sahi chunaav hai**

\`\`\`
Ek adjacency MATRIX istemal karo jab:
  - graph chhota hai (V kuch hazaar tak) YA sach mein dense (E V^2 ke kareeb)
  - aap aksar poochte ho "kya i aur j ke beech ek edge hai?" aur ise O(1) mein chahiye
  - aap saral, index-based math chahte ho (graphs par dynamic programming mein aam)

Ek adjacency LIST istemal karo jab (ye default hai):
  - graph sparse hai (E V^2 se bahut kam) — lagbhag sab real-world graphs
  - aap zyaadaatar ek node ke neighbours iterate karte ho na ki khaas pairs test
\`\`\``,

    content: `## Directed vs undirected, and weighted edges

\`\`\`js
// UNDIRECTED: an edge {a, b} means you can go both ways -> add both directions
adj[a].push(b); adj[b].push(a);

// DIRECTED: an edge a -> b means only that direction -> add one
adj[a].push(b);

// WEIGHTED: store the weight alongside the neighbour
adj[a].push({ node: b, weight: 7 });   // or adj[a].push([b, 7])
\`\`\`

The choice of representation is independent of these properties — a matrix can hold weights (\`matrix[i][j] = 7\` instead of \`true\`, with \`0\` or \`Infinity\` meaning "no edge"), and an adjacency list can be directed or undirected. This course's Module 7 trees were effectively directed graphs (parent points to child, not back) with the extra guarantees of exactly one root and no cycles; a general graph drops both guarantees, which is exactly why the later lessons in this module need a "visited" set that tree traversals did not.

## The cost table, side by side

\`\`\`
                        Adjacency List        Adjacency Matrix
Space                   O(V + E)              O(V^2)
Add an edge             O(1)                  O(1)
Check edge (u, v)?      O(degree of u)        O(1)
Iterate u's neighbours  O(degree of u)        O(V)   <- must scan a whole row
Iterate ALL edges       O(V + E)              O(V^2)
\`\`\`

The list wins every row except "check a specific edge". And "iterate a node's neighbours" — the single most common operation in BFS, DFS, Dijkstra, and almost every graph algorithm — is O(degree) for a list but O(V) for a matrix, because the matrix must walk an entire row of mostly-\`false\` cells to find the few real neighbours. On a sparse graph that difference is the whole ballgame.

## A slightly richer adjacency structure

\`\`\`ts
// When nodes are not conveniently numbered 0..V-1 (e.g. string ids),
// use a Map instead of an array — this course's Module 3 hashing lesson
// established Map lookups are O(1).
type Graph = Map<string, string[]>;

function addEdge(g: Graph, a: string, b: string): void {
  if (!g.has(a)) g.set(a, []);
  if (!g.has(b)) g.set(b, []);
  g.get(a)!.push(b);
  g.get(b)!.push(a);
}
\`\`\`

## Why "iterate neighbours" being fast matters so much

\`\`\`
BFS / DFS visit every node once and, at each node, look at every neighbour.
Total work = sum over all nodes of (that node's degree) = 2E for undirected.

With an adjacency list:  O(V + E)   <- optimal, you touch each edge a constant number of times
With an adjacency matrix: O(V^2)    <- you scan a full V-length row per node no matter what
\`\`\`

Every traversal-based graph algorithm in the rest of this module — BFS, DFS, topological sort, Dijkstra — has its textbook complexity stated as O(V + E). That figure assumes an adjacency list. Swap in a matrix on a sparse graph and the same algorithms silently become O(V^2), which for a graph of a hundred thousand nodes is the difference between instant and minutes.`,

    contentHi: `## Directed vs undirected, aur weighted edges

\`\`\`js
// UNDIRECTED: ek edge {a, b} matlab aap dono taraf jaa sakte ho -> dono directions add karo
adj[a].push(b); adj[b].push(a);

// DIRECTED: ek edge a -> b matlab sirf wo direction -> ek add karo
adj[a].push(b);

// WEIGHTED: weight ko neighbour ke saath store karo
adj[a].push({ node: b, weight: 7 });   // ya adj[a].push([b, 7])
\`\`\`

Representation ka chunaav in properties se swatantra hai — ek matrix weights rakh sakta hai (\`matrix[i][j] = 7\` \`true\` ke bajaye, \`0\` ya \`Infinity\` matlab "koi edge nahi"), aur ek adjacency list directed ya undirected ho sakti hai. Is course ke Module 7 trees asal mein directed graphs the (parent child ki taraf point karta hai, wapas nahi) bilkul ek root aur koi cycles nahi ki extra guarantees ke saath; ek general graph dono guarantees chhod deta hai, jo bilkul wajah hai ki is module ke baad ke lessons ko ek "visited" set chahiye jo tree traversals ko nahi chahiye tha.

## Cost table, saath-saath

\`\`\`
                        Adjacency List        Adjacency Matrix
Space                   O(V + E)              O(V^2)
Ek edge add karo        O(1)                  O(1)
Edge (u, v) check?      O(u ki degree)        O(1)
u ke neighbours iterate O(u ki degree)        O(V)   <- ek poori row scan karni hai
SAB edges iterate       O(V + E)              O(V^2)
\`\`\`

List "ek khaas edge check karo" ke alaava har row jeetti hai. Aur "ek node ke neighbours iterate karo" — BFS, DFS, Dijkstra, aur lagbhag har graph algorithm mein sabse aam operation — ek list ke liye O(degree) hai par ek matrix ke liye O(V), kyunki matrix ko zyaadaatar-\`false\` cells ki ek poori row chalni padti hai kuch asli neighbours dhoondhne ko. Ek sparse graph par wo farak poora khel hai.

## Ek thoda samriddh adjacency structure

\`\`\`ts
// Jab nodes suvidha se 0..V-1 numbered nahi hain (jaise string ids),
// ek array ke bajaye ek Map istemal karo — is course ke Module 3 hashing
// lesson ne sthaapit kiya Map lookups O(1) hain.
type Graph = Map<string, string[]>;

function addEdge(g: Graph, a: string, b: string): void {
  if (!g.has(a)) g.set(a, []);
  if (!g.has(b)) g.set(b, []);
  g.get(a)!.push(b);
  g.get(b)!.push(a);
}
\`\`\`

## "Neighbours iterate karna" tez hona itna kyun maayne rakhta hai

\`\`\`
BFS / DFS har node ko ek baar dekhte hain aur, har node par, har neighbour ko dekhte hain.
Kul kaam = sab nodes par (us node ki degree) ka sum = undirected ke liye 2E.

Ek adjacency list ke saath:   O(V + E)   <- optimal, aap har edge ko ek constant baar chhoote ho
Ek adjacency matrix ke saath: O(V^2)     <- aap prati node ek poori V-length row scan karte ho
\`\`\`

Is module ke baaki har traversal-based graph algorithm — BFS, DFS, topological sort, Dijkstra — apni textbook complexity O(V + E) batata hai. Wo aankda ek adjacency list maanta hai. Ek sparse graph par ek matrix daalo aur wahi algorithms chupchaap O(V^2) ban jaate hain, jo ek lakh nodes ke ek graph ke liye turant aur minutes ke beech ka farak hai.`,

    examples: [
      {
        title: 'Broken: adjacency matrix for a sparse graph',
        titleHi: 'Toota: ek sparse graph ke liye adjacency matrix',
        code: `const m = Array.from({length: V}, () => new Array(V).fill(false));
for (const [a, b] of edges) { m[a][b] = true; m[b][a] = true; }`,
        codeJs: `function buildMatrix(V, edges) {
  const m = Array.from({ length: V }, () => new Array(V).fill(false));
  for (const [a, b] of edges) { m[a][b] = true; m[b][a] = true; }
  return m;
}
// V = 100000, edges = 300000  ->  m is 10,000,000,000 booleans regardless
const m = buildMatrix(5, [[0,1],[1,2],[3,4]]);
console.log(m[1]); // [false, false, true, false, false] — 1 connects only to 2 (and 0)`,
        codeTs: `function buildMatrix(V: number, edges: [number, number][]): boolean[][] {
  const m = Array.from({ length: V }, () => new Array<boolean>(V).fill(false));
  for (const [a, b] of edges) { m[a]![b] = true; m[b]![a] = true; }
  return m;
}`,
        output: `[false, true, true, false, false]`,
        explain: 'Every cell is allocated whether or not the edge exists. For V nodes that is V-squared memory, and on a sparse graph nearly all of it stores "false".',
        explainHi: 'Har cell allocate hoti hai chahe edge maujood ho ya na ho. V nodes ke liye wo V-varg memory hai, aur ek sparse graph par iska lagbhag saara "false" store karta hai.',
      },
      {
        title: 'Fixed: adjacency list — O(V + E) memory',
        titleHi: 'Theek: adjacency list — O(V + E) memory',
        code: `const adj = Array.from({length: V}, () => []);
for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }`,
        codeJs: `function buildAdjList(V, edges) {
  const adj = Array.from({ length: V }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  return adj;
}
const adj = buildAdjList(5, [[0,1],[1,2],[3,4]]);
console.log(adj);      // [ [1], [0, 2], [1], [4], [3] ]
console.log(adj[1]);   // [0, 2] — node 1's neighbours, iterate directly`,
        codeTs: `type Graph = number[][];
function buildAdjList(V: number, edges: [number, number][]): Graph {
  const adj: Graph = Array.from({ length: V }, () => []);
  for (const [a, b] of edges) { adj[a]!.push(b); adj[b]!.push(a); }
  return adj;
}`,
        outputJs: `[ [1], [0, 2], [1], [4], [3] ]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Only real edges are stored. Memory is one list per node plus one entry per edge endpoint — O(V + E) — and adj[node] is exactly that node\'s neighbour list.',
        explainHi: 'Sirf asli edges store hote hain. Memory prati node ek list plus prati edge endpoint ek entry hai — O(V + E) — aur adj[node] bilkul us node ki neighbour list hai.',
      },
      {
        title: 'When the matrix wins: O(1) edge lookup on a dense graph',
        titleHi: 'Jab matrix jeetta hai: ek dense graph par O(1) edge lookup',
        code: `if (matrix[u][v]) { /* edge exists, O(1) */ }
// with a list this would be: adj[u].includes(v)  -> O(degree of u)`,
        codeJs: `// A dense graph: 500 nodes, ~100k edges (close to 500*500/2)
// "is u adjacent to v?" asked millions of times in an inner loop
function hasEdge(matrix, u, v) { return matrix[u][v]; }        // O(1)
function hasEdgeList(adj, u, v) { return adj[u].includes(v); } // O(degree)`,
        codeTs: `function hasEdge(matrix: boolean[][], u: number, v: number): boolean {
  return matrix[u]![v]!;
}`,
        outputJs: `// matrix: constant time per query
// list: scans up to 'degree' entries per query — slower when the graph is dense
//       and edge tests dominate`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'When the graph is dense (E near V-squared) the matrix is not wasteful, and its O(1) answer to "is there an edge?" beats the list\'s O(degree) scan when that question is the hot path.',
        explainHi: 'Jab graph dense hai (E V-varg ke kareeb) matrix faaltu nahi hai, aur "kya ek edge hai?" ka iska O(1) jawaab list ke O(degree) scan ko haraata hai jab wo sawaal hot path hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// undirected graph, but only adding one direction
for (const [a, b] of edges) adj[a].push(b);
// now adj[b] does not list a — half the graph's edges are invisible one way`,
        right: `for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }`,
        why: 'An undirected edge is traversable both ways, so it must appear in both endpoints\' neighbour lists. Adding one direction turns it into a directed graph by accident.',
        whyHi: 'Ek undirected edge dono taraf traversable hai, isliye ise dono endpoints ki neighbour lists mein aana chahiye. Ek direction add karna ise galti se ek directed graph bana deta hai.',
      },
      {
        wrong: `const adj = new Array(V).fill([]); // every element is the SAME array
adj[0].push(1);                     // this also pushes into adj[1], adj[2], ...`,
        right: `const adj = Array.from({ length: V }, () => []); // a fresh array per node`,
        why: 'fill([]) puts one shared array reference into every slot, so a push to any node mutates all of them. Array.from with a factory function creates a distinct array each time.',
        whyHi: 'fill([]) ek shared array reference har slot mein daalta hai, isliye kisi bhi node par ek push sab ko mutate karta hai. Array.from ek factory function ke saath har baar ek alag array banata hai.',
      },
      {
        wrong: `// choosing a matrix "because it's simpler" for a graph you know is sparse
// V = 200000 -> new Array(200000).fill(...).map(() => new Array(200000)) -> crash`,
        right: `// default to an adjacency list; reach for a matrix only when the graph is
// small/dense OR O(1) edge tests are genuinely the bottleneck`,
        why: 'The matrix\'s V-squared memory is not a constant-factor concern — for a large sparse graph it is the difference between running and failing to allocate at all.',
        whyHi: 'Matrix ki V-varg memory ek constant-factor chinta nahi hai — ek bade sparse graph ke liye ye chalne aur bilkul allocate na kar paane ke beech ka farak hai.',
      },
    ],

    realWorld: [
      {
        en: '**Social networks, road maps, web-link graphs and dependency graphs are all sparse** — each node connects to a tiny fraction of the others — so production systems store them as adjacency lists (or edge lists in a database), never as matrices.',
        hi: '**Social networks, road maps, web-link graphs aur dependency graphs sab sparse hain** — har node doosron ke ek chhote hisse se judta hai — isliye production systems unhe adjacency lists ki tarah store karte hain (ya ek database mein edge lists), kabhi matrices ki tarah nahi.',
      },
      {
        en: '**Adjacency matrices show up in dynamic programming over small graphs** — the Floyd-Warshall all-pairs shortest path algorithm is a triple loop over a V-by-V matrix and is the right tool when V is a few hundred.',
        hi: '**Adjacency matrices chhote graphs par dynamic programming mein dikhte hain** — Floyd-Warshall all-pairs shortest path algorithm ek V-by-V matrix par ek triple loop hai aur sahi tool hai jab V kuch sau hai.',
      },
      {
        en: '**Graph databases (Neo4j and similar) are essentially giant adjacency lists on disk**, optimised so that "follow this node\'s edges" is a local read rather than a scan of everything.',
        hi: '**Graph databases (Neo4j aur similar) asal mein disk par vishaal adjacency lists hain**, aise optimise ki gayi ki "is node ke edges follow karo" ek local read hai na ki sab kuch ka ek scan.',
      },
    ],

    interviewQA: [
      {
        q: 'You are asked to design the storage for a graph. What questions do you ask before choosing between an adjacency list and an adjacency matrix?',
        qHi: 'Aapse ek graph ke liye storage design karne ko kaha jaata hai. Ek adjacency list aur ek adjacency matrix ke beech chunne se pehle aap kaunse sawaal poochte ho?',
        a: 'The two questions that decide it are how dense the graph is and what operations dominate. Density: compare the number of edges E to V squared. If E is close to V squared the graph is dense and the matrix wastes little, so its simplicity and O(1) edge lookup are pure upside. If E is far below V squared — which is true of essentially every graph that models something real, because a person, a city, or a web page connects to a bounded number of others regardless of how large the whole graph gets — then the matrix spends V squared memory to store mostly nothing, and for a large V that memory simply is not available. Operations: if the algorithm mostly asks "is there a specific edge between u and v" as an inner-loop test, the matrix answers in O(1) while the list has to scan u\'s neighbour list in O(degree). But the far more common pattern, in BFS, DFS, Dijkstra, topological sort and most graph work, is "give me all of u\'s neighbours so I can visit them" — and there the list gives you exactly the neighbours in O(degree) while the matrix forces you to scan a full row of length V, most of it empty. There is also the numbering question: if nodes have arbitrary ids rather than a clean 0 to V minus 1 range, a list backed by a hash map handles that naturally while a matrix needs a separate id-to-index mapping. In practice the answer is "adjacency list" for almost everything, and the matrix is reserved for small dense graphs or algorithms specifically built around a matrix, like Floyd-Warshall.',
        aHi: 'Do sawaal jo ise tay karte hain wo hain graph kitna dense hai aur kaunse operations haavi hain. Density: edges ki tadaad E ko V varg se compare karo. Agar E V varg ke kareeb hai graph dense hai aur matrix kam barbaad karta hai, isliye iski saralta aur O(1) edge lookup shuddh faayda hain. Agar E V varg se kaafi neeche hai — jo asal mein har us graph ke liye sach hai jo kuch asli model karta hai, kyunki ek vyakti, ek shehar, ya ek web page ek bandhi hui tadaad mein doosron se judta hai chahe poora graph kitna bhi bada ho jaaye — toh matrix zyaadaatar kuch nahi store karne ke liye V varg memory kharch karta hai, aur ek bade V ke liye wo memory bas available nahi hai. Operations: agar algorithm zyaadaatar "kya u aur v ke beech ek khaas edge hai" ko ek inner-loop test ki tarah poochta hai, matrix O(1) mein jawaab deta hai jabki list ko u ki neighbour list O(degree) mein scan karni padti hai. Par kaafi zyaada aam pattern, BFS, DFS, Dijkstra, topological sort aur adhikaansh graph kaam mein, hai "mujhe u ke sab neighbours do taaki main unhe dekh sakoon" — aur wahaan list aapko bilkul neighbours O(degree) mein deti hai jabki matrix aapko length V ki ek poori row scan karne ke liye majboor karta hai, iska zyaadaatar khaali. Ek numbering sawaal bhi hai: agar nodes ke arbitrary ids hain na ki ek saaf 0 se V minus 1 range, ek hash map se backed list use naturally handle karti hai jabki ek matrix ko ek alag id-to-index mapping chahiye. Practice mein jawaab lagbhag har cheez ke liye "adjacency list" hai, aur matrix chhote dense graphs ya matrix ke aas-paas khaas taur par bane algorithms, jaise Floyd-Warshall, ke liye reserved hai.',
      },
      {
        q: 'Why is the complexity of BFS and DFS on a graph written as O(V + E) rather than O(V) or O(E), and what breaks that bound?',
        qHi: 'Ek graph par BFS aur DFS ki complexity O(V + E) kyun likhi jaati hai na ki O(V) ya O(E), aur us bound ko kya todta hai?',
        a: 'A traversal does two distinct kinds of work. First, it visits each node once — it dequeues or pops it, marks it, records it in the result — and that is O(1) per node, O(V) in total across all nodes. Second, at each node it examines every edge leaving that node to discover the neighbours. Summed over all nodes, the number of edge examinations is the sum of every node\'s degree, which for an undirected graph is exactly 2E (each edge contributes to the degree of both its endpoints) and for a directed graph is E. So the edge-scanning work is O(E). Neither term dominates the other in general: a graph can have many nodes and few edges (a set of isolated nodes, where E is near zero and V dominates) or few nodes and many edges (a small dense graph where E is near V squared and dominates). Because either can be the larger term depending on the graph, the honest bound is their sum, O(V + E). What breaks it is using an adjacency matrix instead of a list. With a matrix, discovering a node\'s neighbours is not O(degree) — you must scan the entire row of length V regardless of how many real neighbours there are. That makes the edge-discovery work O(V) per node and O(V squared) overall, so the whole traversal becomes O(V squared), which on a sparse graph where E is only O(V) is dramatically worse than the O(V + E) an adjacency list would give.',
        aHi: 'Ek traversal do alag tarah ka kaam karta hai. Pehla, ye har node ko ek baar dekhta hai — ise dequeue ya pop karta hai, mark karta hai, result mein record karta hai — aur wo prati node O(1) hai, sab nodes par kul O(V). Doosra, har node par ye us node se nikalne waale har edge ko examine karta hai neighbours discover karne ko. Sab nodes par sum kiya, edge examinations ki tadaad har node ki degree ka sum hai, jo ek undirected graph ke liye bilkul 2E hai (har edge apne dono endpoints ki degree mein yogdaan deta hai) aur ek directed graph ke liye E hai. Toh edge-scanning kaam O(E) hai. General mein koi bhi term doosre par haavi nahi hoti: ek graph mein bahut nodes aur kam edges ho sakte hain (isolated nodes ka ek set, jahaan E lagbhag zero hai aur V haavi hai) ya kam nodes aur bahut edges (ek chhota dense graph jahaan E V varg ke kareeb hai aur haavi hai). Kyunki graph ke hisaab se koi bhi badi term ho sakti hai, imaandaar bound unka sum hai, O(V + E). Ise jo todta hai wo hai ek list ke bajaye ek adjacency matrix istemal karna. Ek matrix ke saath, ek node ke neighbours discover karna O(degree) nahi hai — aapko length V ki poori row scan karni padti hai chahe kitne bhi asli neighbours hon. Wo edge-discovery kaam ko prati node O(V) aur kul O(V varg) banata hai, isliye poora traversal O(V varg) ban jaata hai, jo ek sparse graph par jahaan E sirf O(V) hai ek adjacency list ke O(V + E) se naatkeeya roop se kharaab hai.',
      },
    ],

    exercises: [
      {
        task: 'Write buildAdjList(V, edges) for an undirected graph and buildAdjListDirected(V, edges) for a directed one. Build both from V=6, edges=[[0,1],[0,2],[1,3],[2,3],[3,4],[4,5]] and print each adjacency list.',
        taskHi: 'Ek undirected graph ke liye buildAdjList(V, edges) aur ek directed ke liye buildAdjListDirected(V, edges) likho. Dono ko V=6, edges=[[0,1],[0,2],[1,3],[2,3],[3,4],[4,5]] se banao aur har adjacency list print karo.',
        hint: 'The only difference is whether you push both directions or just one. Compare adj[3] between the two versions.',
        hintHi: 'Ekmatra farak ye hai ki aap dono directions push karte ho ya sirf ek. Do versions ke beech adj[3] compare karo.',
      },
      {
        task: 'Write hasEdge(adj, u, v) for an adjacency list and for an adjacency matrix. On a random graph with V=1000 and 3000 edges, time 100000 random hasEdge queries against each representation.',
        taskHi: 'Ek adjacency list ke liye aur ek adjacency matrix ke liye hasEdge(adj, u, v) likho. V=1000 aur 3000 edges ke ek random graph par, har representation ke against 100000 random hasEdge queries time karo.',
        hint: 'The matrix should be roughly constant per query; the list should scale with average degree (here about 6). Then repeat with a dense graph (V=200, ~15000 edges) and watch the gap change.',
        hintHi: 'Matrix prati query lagbhag constant hona chahiye; list average degree (yahaan lagbhag 6) ke saath scale honi chahiye. Phir ek dense graph (V=200, ~15000 edges) ke saath dohraao aur gap badalte dekho.',
      },
      {
        task: 'Convert an adjacency matrix to an adjacency list and back. Write matrixToList(m) and listToMatrix(adj, V), and verify that listToMatrix(matrixToList(m), V) equals the original m for a small graph.',
        taskHi: 'Ek adjacency matrix ko ek adjacency list mein aur wapas convert karo. matrixToList(m) aur listToMatrix(adj, V) likho, aur verify karo ki ek chhote graph ke liye listToMatrix(matrixToList(m), V) original m ke barabar hai.',
        hint: 'matrixToList: for each row i, push j into adj[i] wherever m[i][j] is true. listToMatrix: start with an all-false grid and set m[i][j] for every j in adj[i].',
        hintHi: 'matrixToList: har row i ke liye, j ko adj[i] mein push karo jahaan bhi m[i][j] true hai. listToMatrix: ek all-false grid se shuru karo aur adj[i] mein har j ke liye m[i][j] set karo.',
      },
    ],

    keyTakeaways: [
      'An adjacency list stores, per node, only the nodes it actually connects to — O(V + E) memory. This is the default representation for almost every real graph, which is sparse.',
      'An adjacency matrix is a V-by-V grid of booleans (or weights) — O(V squared) memory always, regardless of how few edges exist.',
      'Use a matrix only when the graph is small or genuinely dense (E near V squared), or when O(1) "is there an edge (u, v)?" tests are the bottleneck.',
      'Iterating a node\'s neighbours is O(degree) with a list but O(V) with a matrix (scanning a whole row) — and that operation is the core of BFS, DFS, and Dijkstra.',
      'For an undirected edge, add it to BOTH endpoints\' lists; for a directed edge, add one direction. Weighted graphs store the weight alongside each neighbour.',
      'The O(V + E) complexity quoted for graph algorithms assumes an adjacency list — a matrix silently degrades them to O(V squared) on a sparse graph.',
    ],
    keyTakeawaysHi: [
      'Ek adjacency list prati node sirf wo nodes store karti hai jinse ye asal mein judta hai — O(V + E) memory. Ye lagbhag har asli graph ke liye default representation hai, jo sparse hai.',
      'Ek adjacency matrix booleans (ya weights) ka ek V-by-V grid hai — hamesha O(V varg) memory, chahe kitne bhi kam edges hon.',
      'Ek matrix sirf tab istemal karo jab graph chhota ho ya sach mein dense (E V varg ke kareeb), ya jab O(1) "kya ek edge (u, v) hai?" tests bottleneck hon.',
      'Ek node ke neighbours iterate karna ek list ke saath O(degree) hai par ek matrix ke saath O(V) (ek poori row scan karna) — aur wo operation BFS, DFS, aur Dijkstra ka core hai.',
      'Ek undirected edge ke liye, ise DONO endpoints ki lists mein add karo; ek directed edge ke liye, ek direction add karo. Weighted graphs har neighbour ke saath weight store karte hain.',
      'Graph algorithms ke liye batayi gayi O(V + E) complexity ek adjacency list maanti hai — ek matrix unhe ek sparse graph par chupchaap O(V varg) mein degrade kar deta hai.',
    ],
  },
];
