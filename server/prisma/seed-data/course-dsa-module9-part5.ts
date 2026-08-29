/**
 * DSA Complete Course — Module 9: Graphs, lesson 5.
 *
 * Union-Find (Disjoint Set Union): tracking which nodes are in the same
 * connected group, with near-constant-time merge and query. Builds on this
 * module's lesson 3 (connected components via DFS) and this course's Module 1
 * (amortised analysis). Broken example: processing a stream of "connect a and b"
 * / "are a and b connected?" operations by running a fresh BFS or DFS for every
 * query — correct, but O(V + E) per query, so O(Q * (V + E)) overall, which for
 * a graph with millions of edges and millions of queries does not finish.
 * Fixed with union-find: each node points to a "parent", every group is a tree
 * whose root names the group, find(x) walks to the root, union(a, b) links one
 * root under the other. With the two optimisations (union by size/rank and path
 * compression) every operation is effectively O(1) amortised.
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

export const DSA_MODULE_9_PART5: CourseLesson[] = [
  {
    slug: 'union-find-disjoint-set',
    title: 'Union-Find: Near-Constant-Time Connectivity',
    titleHi: 'Union-Find: Lagbhag-Constant-Time Connectivity',
    description: 'Answering a long stream of "connect these two" and "are these two connected?" operations by running a full BFS or DFS for every single connectivity query. Each query is O(V + E); across a million queries on a large graph, that is hours of work for questions that should each take almost no time.',
    descriptionHi: 'Ek lambi stream "in do ko connect karo" aur "kya ye do connected hain?" operations ka jawaab har ek connectivity query ke liye ek poora BFS ya DFS chalakar dena. Har query O(V + E) hai; ek bade graph par ek million queries par, wo ghanton ka kaam hai un sawaalon ke liye jinmein har ek ko lagbhag koi samay nahi lagna chahiye.',
    difficulty: 'MEDIUM',
    duration: 25,
    order: 5,

    analogy: {
      en: '**Merging clubs, where each member only needs to know the name of their club president.** Suppose people keep forming alliances: "our club and your club are now one club". You constantly get asked "are Ravi and Sunil in the same club?". The slow way to answer is to trace every friendship chain outward from Ravi until you either reach Sunil or run out — a full search, every time. The fast way: every member carries a slip of paper naming one other member, and if you keep asking "whose name is on your slip?" you eventually reach one person whose slip names themselves — that person is the club president, and the president\'s identity IS the club\'s identity. To check if two people share a club, follow each of their slips up to a president and see if it is the same person. To merge two clubs, find both presidents and write one president\'s name on the other president\'s slip — now every member of the second club, when traced up, lands on the first president. Two extra tricks keep the chains short: always make the smaller club\'s president report to the larger club\'s president (so chains grow slowly), and every time you trace someone up to their president, rewrite their slip to point straight at the president (so the next lookup is instant). With both tricks, tracing anyone to their president is, on average, basically immediate no matter how many merges have happened.',
      hi: '**Clubs merge karna, jahaan har member ko sirf apne club president ka naam jaanna hota hai.** Maano log alliances banate rehte hain: "hamaara club aur tumhaara club ab ek club hai". Aapse lagaataar poocha jaata hai "kya Ravi aur Sunil ek hi club mein hain?". Jawaab dene ka slow tarika Ravi se har friendship chain ko bahar trace karna hai jab tak aap ya toh Sunil tak pahunch jao ya khatam ho jao — ek poora search, har baar. Fast tarika: har member ek parchi rakhta hai jismein ek doosre member ka naam hai, aur agar aap poochte rehte ho "aapki parchi par kiska naam hai?" aap aakhirkaar ek aise vyakti tak pahunchte ho jiski parchi khud unka naam kehti hai — wo vyakti club president hai, aur president ki pehchaan HI club ki pehchaan hai. Ye check karne ke liye ki do log ek club share karte hain, unki har parchi ko ek president tak follow karo aur dekho ki wo wahi vyakti hai. Do clubs merge karne ke liye, dono presidents dhoondho aur ek president ka naam doosre president ki parchi par likho — ab doosre club ka har member, jab upar trace kiya jaata hai, pehle president par utarta hai. Do extra tricks chains ko chhota rakhte hain: hamesha chhote club ke president ko bade club ke president ko report karvao (taaki chains dheere badhein), aur har baar jab aap kisi ko unke president tak trace karo, unki parchi ko seedhe president ki taraf point karne ke liye dobara likho (taaki agla lookup turant ho). Dono tricks ke saath, kisi ko bhi unke president tak trace karna, average mein, mool roop se turant hai chahe kitne bhi merges hue hon.',
    },

    simple: `**Start broken.** Process "union" and "connected?" operations by searching the graph each time:

\`\`\`js
function processBroken(numNodes, operations) {
  const adj = Array.from({ length: numNodes }, () => []);
  const results = [];
  for (const op of operations) {
    if (op.type === 'union') {
      adj[op.a].push(op.b);
      adj[op.b].push(op.a);
    } else { // 'connected?'
      // fresh BFS from op.a looking for op.b — O(V + E) EVERY query
      const seen = new Set([op.a]);
      const queue = [op.a];
      let found = false;
      while (queue.length) {
        const node = queue.shift();
        if (node === op.b) { found = true; break; }
        for (const n of adj[node]) if (!seen.has(n)) { seen.add(n); queue.push(n); }
      }
      results.push(found);
    }
  }
  return results;
}
\`\`\`

Correct, but each \`connected?\` query walks a potentially huge portion of the graph. With \`Q\` queries on a graph of \`E\` edges the total is O(Q * (V + E)) — for a million of each this simply does not finish in reasonable time.

**The fix: union-find with union by size and path compression**

\`\`\`js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i); // each node its own root
    this.size = new Array(n).fill(1);
  }

  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]]; // path compression (halving)
      x = this.parent[x];
    }
    return x;
  }

  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                   // already in the same set
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra]; // attach smaller under larger
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    return true;                                   // a real merge happened
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}
\`\`\`

\`\`\`ts
class UnionFind {
  private parent: number[];
  private size: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array<number>(n).fill(1);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]!]!;
      x = this.parent[x]!;
    }
    return x;
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra]! < this.size[rb]!) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra]! += this.size[rb]!;
    return true;
  }
  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}
\`\`\`

Each node stores a \`parent\`. A set is a tree; its root (the node that is its own parent) names the set. \`find\` walks to the root; \`union\` finds both roots and hangs one under the other. **Union by size** always hangs the smaller tree under the larger, so trees stay shallow. **Path compression** — the \`this.parent[x] = this.parent[this.parent[x]]\` line — points nodes closer to the root every time you pass through them. Together these make every operation run in O(alpha(n)) amortised, where alpha is the inverse Ackermann function and is at most 4 for any n you could ever store. Effectively O(1).`,

    simpleHi: `**Toote hue se shuru.** "union" aur "connected?" operations ko har baar graph search karke process karo:

\`\`\`js
function processBroken(numNodes, operations) {
  const adj = Array.from({ length: numNodes }, () => []);
  const results = [];
  for (const op of operations) {
    if (op.type === 'union') {
      adj[op.a].push(op.b);
      adj[op.b].push(op.a);
    } else { // 'connected?'
      // op.a se fresh BFS op.b dhoondhne ko — HAR query O(V + E)
      const seen = new Set([op.a]);
      const queue = [op.a];
      let found = false;
      while (queue.length) {
        const node = queue.shift();
        if (node === op.b) { found = true; break; }
        for (const n of adj[node]) if (!seen.has(n)) { seen.add(n); queue.push(n); }
      }
      results.push(found);
    }
  }
  return results;
}
\`\`\`

Sahi, par har \`connected?\` query graph ke ek sambhaavit roop se bade hisse par chalti hai. \`E\` edges ke ek graph par \`Q\` queries ke saath kul O(Q * (V + E)) hai — har ek ke ek million ke liye ye bas uchit samay mein khatam nahi hota.

**Fix: union by size aur path compression ke saath union-find**

\`\`\`js
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i); // har node apna root
    this.size = new Array(n).fill(1);
  }

  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]]; // path compression (halving)
      x = this.parent[x];
    }
    return x;
  }

  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                   // pehle se ek hi set mein
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra]; // chhote ko bade ke neeche lagao
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    return true;                                   // ek asli merge hua
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}
\`\`\`

\`\`\`ts
class UnionFind {
  private parent: number[];
  private size: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array<number>(n).fill(1);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]!]!;
      x = this.parent[x]!;
    }
    return x;
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra]! < this.size[rb]!) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra]! += this.size[rb]!;
    return true;
  }
  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}
\`\`\`

Har node ek \`parent\` store karta hai. Ek set ek tree hai; iska root (wo node jo apna khud ka parent hai) set ko naam deta hai. \`find\` root tak chalta hai; \`union\` dono roots dhoondhta hai aur ek ko doosre ke neeche taangta hai. **Union by size** hamesha chhote tree ko bade ke neeche taangta hai, isliye trees uthle rehte hain. **Path compression** — \`this.parent[x] = this.parent[this.parent[x]]\` line — nodes ko root ke kareeb point karta hai har baar jab aap unmein se guzarte ho. Saath ye har operation ko O(alpha(n)) amortised mein chalaate hain, jahaan alpha inverse Ackermann function hai aur kisi bhi n ke liye jo aap kabhi store kar sakte ho zyaada se zyaada 4 hai. Asal mein O(1).`,

    content: `## Why union by size (or rank) matters

\`\`\`
Without union by size, always attaching a's root under b's root:
  union(0,1), union(0,2), union(0,3), ... union(0, n-1)
  builds a single chain of length n. find(n-1) then walks n steps -> O(n).

With union by size, the smaller tree always goes under the larger:
  a tree of n nodes built this way has height at most log2(n),
  because a node's depth only increases when its whole tree is merged
  into one at least as large, and that can happen at most log2(n) times.
\`\`\`

"Rank" is a common alternative to "size": rank is an upper bound on the tree's height rather than its node count. Both keep trees to O(log n) height on their own; the choice rarely matters in practice.

## Why path compression makes it near-constant

\`\`\`
find(x) has to walk from x up to the root anyway. Path compression does one
extra assignment per step to point x (or x's parent) directly at something
closer to the root. The walk you already paid for now permanently shortens
the path for every node on it.

parent[x] = parent[parent[x]]   // "path halving": each node skips to its grandparent

After enough finds, almost every node points straight at its root, and later
finds are O(1). Amortised over a sequence of m operations on n elements, the
total is O(m * alpha(n)), and alpha(n) <= 4 for n up to 2^65536.
\`\`\`

This course's Module 1 lesson on amortised cost is exactly the tool needed to see this: no single \`find\` is guaranteed O(1), but the expensive ones each make many future finds cheap, so the average across the whole sequence is effectively constant. Quoting union-find as "O(1)" is this amortised bound, not a worst-case one.

## Union-find shines where DFS/BFS is awkward: an incremental, edge-at-a-time graph

\`\`\`js
// "As edges are added one by one, after which edge does the graph become
//  fully connected?"  — union-find answers this in one pass.
function firstFullyConnected(n, edges) {
  const uf = new UnionFind(n);
  let components = n;
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    if (uf.union(a, b)) components--;   // union returns true only on a real merge
    if (components === 1) return i;     // one component left -> fully connected
  }
  return -1;
}
\`\`\`

A DFS-based approach would have to re-run the whole traversal after every added edge. Union-find just processes each edge once and tracks the component count as it goes — the structure is built for exactly this "things only ever get more connected over time" pattern.

## Detecting a cycle in an undirected graph, edge by edge

\`\`\`js
function hasCycleUF(n, edges) {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) {
    if (!uf.union(a, b)) return true;  // a and b already connected -> this edge closes a loop
  }
  return false;
}
\`\`\`

If \`union(a, b)\` reports that \`a\` and \`b\` were already in the same set, then there was already a path between them, and the new edge \`a-b\` completes a cycle. This is the core of Kruskal's minimum-spanning-tree algorithm: sort edges by weight, add each edge whose endpoints are not yet connected (skip the ones that would form a cycle), stop when \`n - 1\` edges are in.

## What union-find cannot do

\`\`\`
- It does not support "un-union" / edge deletion. It only ever merges.
- It does not give you the actual path between two connected nodes, just yes/no.
- For directed reachability it is the wrong tool — it models an undirected
  "same group" relation, which is symmetric; directed reachability is not.
\`\`\``,

    contentHi: `## Union by size (ya rank) kyun maayne rakhta hai

\`\`\`
Union by size ke bina, hamesha a ke root ko b ke root ke neeche lagaate hue:
  union(0,1), union(0,2), union(0,3), ... union(0, n-1)
  length n ki ek akeli chain banata hai. find(n-1) phir n steps chalta hai -> O(n).

Union by size ke saath, chhota tree hamesha bade ke neeche jaata hai:
  is tarah bana n nodes ka ek tree zyaada se zyaada log2(n) height ka hai,
  kyunki ek node ki depth sirf tab badhti hai jab iska poora tree ek kam se kam
  utne bade mein merge hota hai, aur wo zyaada se zyaada log2(n) baar ho sakta hai.
\`\`\`

"Rank" "size" ka ek aam vikalp hai: rank tree ki height par ek upper bound hai na ki iski node count par. Dono trees ko apne aap O(log n) height par rakhte hain; chunaav practice mein shaayad hi maayne rakhta hai.

## Path compression ise lagbhag-constant kyun banata hai

\`\`\`
find(x) ko waise bhi x se root tak chalna hai. Path compression prati step ek
extra assignment karta hai x (ya x ke parent) ko seedhe root ke kareeb kisi
cheez ki taraf point karne ke liye. Jo walk aap pehle se de chuke ho ab wo
hamesha ke liye us par har node ke liye path chhota kar deta hai.

parent[x] = parent[parent[x]]   // "path halving": har node apne grandparent tak skip karta hai

Kaafi finds ke baad, lagbhag har node seedhe apne root ki taraf point karta hai, aur baad
ke finds O(1) hain. n elements par m operations ke ek sequence par amortised, kul
O(m * alpha(n)) hai, aur n up to 2^65536 ke liye alpha(n) <= 4.
\`\`\`

Is course ke Module 1 ka amortised cost lesson bilkul wo tool hai jo ise dekhne ke liye chahiye: koi ek \`find\` O(1) hone ki guarantee nahi, par mehenge waale har ek bahut future finds ko sasta banate hain, isliye poore sequence par average asal mein constant hai. Union-find ko "O(1)" batana ye amortised bound hai, ek worst-case nahi.

## Union-find wahaan chamakta hai jahaan DFS/BFS awkward hai: ek incremental, edge-at-a-time graph

\`\`\`js
// "Jaise edges ek-ek karke add hote hain, kis edge ke baad graph poori tarah
//  connected ho jaata hai?"  — union-find ise ek pass mein jawaab deta hai.
function firstFullyConnected(n, edges) {
  const uf = new UnionFind(n);
  let components = n;
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    if (uf.union(a, b)) components--;   // union sirf ek asli merge par true return karta hai
    if (components === 1) return i;     // ek component bacha -> poori tarah connected
  }
  return -1;
}
\`\`\`

Ek DFS-based approach ko har add kiye gaye edge ke baad poora traversal dobara chalaana padta. Union-find bas har edge ko ek baar process karta hai aur chalte-chalte component count track karta hai — structure bilkul is "cheezein sirf samay ke saath zyaada connected hoti hain" pattern ke liye bani hai.

## Ek undirected graph mein ek cycle detect karna, edge by edge

\`\`\`js
function hasCycleUF(n, edges) {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) {
    if (!uf.union(a, b)) return true;  // a aur b pehle se connected -> ye edge ek loop band karta hai
  }
  return false;
}
\`\`\`

Agar \`union(a, b)\` report karta hai ki \`a\` aur \`b\` pehle se ek hi set mein the, toh unke beech pehle se ek path tha, aur naya edge \`a-b\` ek cycle poora karta hai. Ye Kruskal ke minimum-spanning-tree algorithm ka core hai: edges ko weight se sort karo, har edge add karo jiske endpoints abhi connected nahi hain (unhe skip karo jo ek cycle banaate), ruk jao jab \`n - 1\` edges andar hon.

## Union-find kya nahi kar sakta

\`\`\`
- Ye "un-union" / edge deletion support nahi karta. Ye sirf merge karta hai.
- Ye aapko do connected nodes ke beech asli path nahi deta, bas haan/na.
- Directed reachability ke liye ye galat tool hai — ye ek undirected "same group"
  relation model karta hai, jo symmetric hai; directed reachability nahi hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: a fresh BFS per connectivity query',
        titleHi: 'Toota: prati connectivity query ek fresh BFS',
        code: `// for each 'connected?' query, run a whole BFS from a looking for b
while (queue.length) { ... }  // O(V + E) every single query`,
        codeJs: `function connectedBroken(adj, a, b) {
  const seen = new Set([a]), queue = [a];
  while (queue.length) {
    const node = queue.shift();
    if (node === b) return true;
    for (const n of adj[node]) if (!seen.has(n)) { seen.add(n); queue.push(n); }
  }
  return false;
}
// Q queries -> O(Q * (V + E)) total`,
        codeTs: `function connectedBroken(adj: number[][], a: number, b: number): boolean {
  const seen = new Set<number>([a]);
  const queue: number[] = [a];
  while (queue.length) {
    const node = queue.shift()!;
    if (node === b) return true;
    for (const n of adj[node]!) if (!seen.has(n)) { seen.add(n); queue.push(n); }
  }
  return false;
}`,
        output: `// correct, but O(V + E) per query — unusable at scale`,
        explain: 'Every connectivity question re-explores the graph from scratch. Nothing learned by one query is reused by the next.',
        explainHi: 'Har connectivity sawaal graph ko shuru se dobara explore karta hai. Ek query se seekha kuch agli dwara reuse nahi hota.',
      },
      {
        title: 'Fixed: union-find find with path halving',
        titleHi: 'Theek: path halving ke saath union-find find',
        code: `find(x) {
  while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
  return x;
}`,
        codeJs: `const uf = new UnionFind(6);
uf.union(0, 1);
uf.union(1, 2);
uf.union(3, 4);
console.log(uf.connected(0, 2)); // true
console.log(uf.connected(0, 3)); // false
uf.union(2, 4);
console.log(uf.connected(0, 3)); // true`,
        codeTs: `const uf = new UnionFind(6);
uf.union(0, 1);
uf.union(1, 2);
uf.union(3, 4);
console.log(uf.connected(0, 2)); // true`,
        outputJs: `true
false
true`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'find walks to the root and, on the way, points each node at its grandparent so future walks are shorter. connected is just "same root?".',
        explainHi: 'find root tak chalta hai aur, raaste mein, har node ko iske grandparent ki taraf point karta hai taaki future walks chhote hon. connected bas "same root?" hai.',
      },
      {
        title: 'Undirected cycle detection with union-find',
        titleHi: 'Union-find ke saath undirected cycle detection',
        code: `for (const [a, b] of edges) if (!uf.union(a, b)) return true;`,
        codeJs: `function hasCycleUF(n, edges) {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) if (!uf.union(a, b)) return true;
  return false;
}
console.log(hasCycleUF(3, [[0,1],[1,2]]));        // false — a path
console.log(hasCycleUF(3, [[0,1],[1,2],[2,0]]));  // true  — the last edge closes a triangle`,
        codeTs: `function hasCycleUF(n: number, edges: [number, number][]): boolean {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) if (!uf.union(a, b)) return true;
  return false;
}`,
        outputJs: `false
true`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'If an edge connects two nodes already in the same set, there was already a path between them, so this edge creates a cycle. This is the skip test inside Kruskal\'s MST.',
        explainHi: 'Agar ek edge do aise nodes ko connect karta hai jo pehle se ek hi set mein hain, unke beech pehle se ek path tha, isliye ye edge ek cycle banata hai. Ye Kruskal ke MST ke andar skip test hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// union without finding the roots first
union(a, b) { this.parent[a] = b; }   // only relinks a itself, not a's whole set`,
        right: `union(a, b) {
  const ra = this.find(a), rb = this.find(b);
  if (ra === rb) return;
  this.parent[rb] = ra;   // relink one ROOT under the other
}`,
        why: 'Setting parent[a] = b links only node a. Every other node in a\'s set still points at a\'s old root, so the two sets are not actually merged. You must link the roots.',
        whyHi: 'parent[a] = b set karna sirf node a ko link karta hai. a ke set mein har doosra node abhi bhi a ke purane root ki taraf point karta hai, isliye do sets asal mein merge nahi hue. Aapko roots link karne chahiye.',
      },
      {
        wrong: `// no union by size — always attach a's root under b's root
this.parent[ra] = rb;   // builds long chains, find degrades to O(n)`,
        right: `if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
this.parent[rb] = ra;
this.size[ra] += this.size[rb];`,
        why: 'Attaching without comparing sizes lets a sequence of unions build a linear chain, making find O(n). Always hanging the smaller tree under the larger keeps height O(log n).',
        whyHi: 'Sizes compare kiye bina attach karna unions ke ek sequence ko ek linear chain banane deta hai, find ko O(n) banate hue. Hamesha chhote tree ko bade ke neeche taangna height O(log n) rakhta hai.',
      },
      {
        wrong: `// using union-find to answer directed reachability ("can I get from a to b?")
uf.union(a, b);  // for a directed edge a -> b
uf.connected(a, b);  // now also claims b can reach a — wrong for directed graphs`,
        right: `// union-find models an undirected "same component" relation only.
// For directed reachability use DFS/BFS, or SCC algorithms.`,
        why: 'union-find\'s relation is symmetric: if a is unioned with b, connected(a,b) and connected(b,a) are both true. Directed reachability is not symmetric, so union-find gives wrong answers.',
        whyHi: 'union-find ka relation symmetric hai: agar a, b ke saath union hai, connected(a,b) aur connected(b,a) dono true hain. Directed reachability symmetric nahi hai, isliye union-find galat jawaab deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Kruskal\'s minimum-spanning-tree algorithm** — used in network design, clustering and image segmentation — is "sort edges by weight, add each one whose endpoints union-find says are not yet connected".',
        hi: '**Kruskal ka minimum-spanning-tree algorithm** — network design, clustering aur image segmentation mein istemal — hai "edges ko weight se sort karo, har ek add karo jiske endpoints union-find kehta hai abhi connected nahi hain".',
      },
      {
        en: '**"Friend circles" / "number of provinces" / connected-region counting** in grids and social graphs is a direct union-find application: union adjacent related cells, then count distinct roots.',
        hi: '**"Friend circles" / "number of provinces" / connected-region counting** grids aur social graphs mein ek seedha union-find application hai: adjacent related cells ko union karo, phir distinct roots gino.',
      },
      {
        en: '**Percolation and network-reliability simulations** add connections one at a time and ask "is the system connected top-to-bottom yet?" after each — exactly the incremental pattern union-find is built for.',
        hi: '**Percolation aur network-reliability simulations** ek baar mein ek connection add karte hain aur har ek ke baad poochte hain "kya system ab top-to-bottom connected hai?" — bilkul wo incremental pattern jiske liye union-find bana hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Union-find is quoted as O(1) per operation, but a single find can clearly walk several steps up a tree. What does the O(1) actually mean, and what makes it true?',
        qHi: 'Union-find ko prati operation O(1) bataya jaata hai, par ek akela find spasht roop se ek tree par kai steps upar chal sakta hai. O(1) ka asal mein kya matlab hai, aur ise kya sach banaata hai?',
        a: 'The O(1) is an amortised bound, not a worst-case one. It says that if you perform a sequence of m operations on n elements, the total time for the whole sequence is O(m times alpha(n)), where alpha is the inverse Ackermann function. Alpha grows so slowly that for any n you could physically store in a computer it is at most 4, so the per-operation average is effectively a small constant. Two mechanisms combine to produce this. Union by size or rank keeps every tree\'s height at O(log n) at all times, because a node\'s depth can only increase when its entire tree is merged underneath a tree at least as large, and that at-least-doubling can happen only about log n times before the tree contains every element. That alone bounds a single find at O(log n). Path compression then does much better over a sequence: every find already has to walk from the queried node up to the root, and path compression spends one extra pointer write per step to point nodes directly at something near the root. So the walk you were already paying for permanently flattens the path for every node it touched. Once a node has been on a compressed find path, its next find is O(1). Averaged over the whole sequence, the rare expensive finds are the ones that do the flattening that makes all the later finds cheap, and the accounting works out to nearly constant per operation. It is the same style of reasoning as amortising the cost of a dynamic array\'s occasional doubling across all the cheap appends, which this course\'s Module 1 introduced.',
        aHi: 'O(1) ek amortised bound hai, ek worst-case nahi. Ye kehta hai ki agar aap n elements par m operations ka ek sequence karte ho, poore sequence ka kul samay O(m guna alpha(n)) hai, jahaan alpha inverse Ackermann function hai. Alpha itni dheere badhta hai ki kisi bhi n ke liye jo aap physically ek computer mein store kar sakte ho ye zyaada se zyaada 4 hai, toh prati-operation average asal mein ek chhota constant hai. Do mechanisms milkar ise banate hain. Union by size ya rank har tree ki height ko hamesha O(log n) par rakhta hai, kyunki ek node ki depth sirf tab badh sakti hai jab iska poora tree ek kam se kam utne bade tree ke neeche merge hota hai, aur wo kam-se-kam-doguna hona sirf lagbhag log n baar ho sakta hai isse pehle ki tree har element rakhe. Wo akela ek find ko O(log n) par bound karta hai. Path compression phir ek sequence par kaafi behtar karta hai: har find ko waise bhi queried node se root tak chalna hai, aur path compression prati step ek extra pointer write kharch karta hai nodes ko seedhe root ke paas kisi cheez ki taraf point karne ke liye. Toh jo walk aap pehle se de rahe the wo hamesha ke liye har node ke liye path flatten kar deta hai jise ye chhoota. Ek baar ek node ek compressed find path par raha hai, iska agla find O(1) hai. Poore sequence par average, durlabh mehenge finds wo hain jo wo flattening karte hain jo sab baad ke finds ko sasta banati hai, aur hisaab prati operation lagbhag constant nikalta hai. Ye wahi tark ki shaili hai jaise ek dynamic array ke kabhi-kabhaar doguna hone ki cost ko sab saste appends par amortise karna, jo is course ke Module 1 ne introduce kiya.',
      },
      {
        q: 'When is union-find the right choice over a DFS/BFS-based approach for connectivity, and when is it the wrong one?',
        qHi: 'Connectivity ke liye ek DFS/BFS-based approach ke muqaable union-find kab sahi chunaav hai, aur kab galat?',
        a: 'Union-find is the right choice when connectivity queries are interleaved with edge additions over time, and especially when there are many queries. If you are told "here is a stream of operations: sometimes connect two nodes, sometimes ask whether two nodes are connected", running a DFS for each query means every query re-explores the graph and learns nothing that helps the next one, giving O(queries times (V + E)). Union-find processes each union in near-constant time and answers each query in near-constant time, so the whole stream is near-linear in the number of operations. It is also the natural fit for algorithms that add edges in a deliberate order and need to know, at each step, whether the new edge joins two separate groups or closes a loop — Kruskal\'s MST is the classic case. Union-find is the wrong choice in three situations. First, if the graph is static and you only need connected components once, a single DFS or BFS pass computes them in O(V + E) with no special structure. Second, if edges are ever removed, union-find cannot handle it — it only merges, never splits, so a problem with deletions needs a different technique entirely. Third, if you need the actual path between two connected nodes, or you are working with directed reachability where "a reaches b" does not imply "b reaches a", union-find\'s symmetric same-group model gives you either too little information or outright wrong answers, and you want BFS, DFS, or a strongly-connected-components algorithm instead.',
        aHi: 'Union-find sahi chunaav hai jab connectivity queries samay ke saath edge additions ke saath interleaved hain, aur khaas taur par jab bahut queries hain. Agar aapko bataya jaata hai "yahaan operations ki ek stream hai: kabhi do nodes connect karo, kabhi poocho ki kya do nodes connected hain", har query ke liye ek DFS chalaana matlab har query graph ko dobara explore karti hai aur kuch nahi seekhti jo agli ki madad kare, O(queries guna (V + E)) dete hue. Union-find har union ko lagbhag-constant time mein process karta hai aur har query ka jawaab lagbhag-constant time mein deta hai, isliye poori stream operations ki tadaad mein lagbhag-linear hai. Ye un algorithms ke liye bhi natural fit hai jo edges ko ek jaan-boojhkar order mein add karte hain aur har step par jaanna chahte hain ki naya edge do alag groups ko jodta hai ya ek loop band karta hai — Kruskal ka MST classic case hai. Union-find teen situations mein galat chunaav hai. Pehla, agar graph static hai aur aapko connected components sirf ek baar chahiye, ek akela DFS ya BFS pass unhe O(V + E) mein bina kisi khaas structure ke compute karta hai. Doosra, agar edges kabhi hataaye jaate hain, union-find ise handle nahi kar sakta — ye sirf merge karta hai, kabhi split nahi, isliye deletions waali ek problem ko poori tarah ek alag technique chahiye. Teesra, agar aapko do connected nodes ke beech asli path chahiye, ya aap directed reachability ke saath kaam kar rahe ho jahaan "a, b tak pahunchta hai" ka matlab "b, a tak pahunchta hai" nahi, union-find ka symmetric same-group model aapko ya toh bahut kam jaankaari ya bilkul galat jawaab deta hai, aur aap iske bajaye BFS, DFS, ya ek strongly-connected-components algorithm chahoge.',
      },
    ],

    exercises: [
      {
        task: 'Implement the full UnionFind class (parent, size, find with path halving, union by size, connected). Test: union(0,1), union(2,3), union(1,2); confirm connected(0,3) is true and connected(0,4) is false.',
        taskHi: 'Poori UnionFind class implement karo (parent, size, path halving ke saath find, union by size, connected). Test: union(0,1), union(2,3), union(1,2); confirm karo connected(0,3) true hai aur connected(0,4) false hai.',
        hint: 'After the three unions, print the parent array. Then call find(0) and find(3) and confirm they return the same root.',
        hintHi: 'Teen unions ke baad, parent array print karo. Phir find(0) aur find(3) call karo aur confirm karo wo wahi root return karte hain.',
      },
      {
        task: 'Implement countComponents(n, edges) using union-find: start with n components, decrement once for each union that returns true, return the final count. Test on n=5, edges=[[0,1],[1,2],[3,4]] (expect 2).',
        taskHi: 'union-find istemal karke countComponents(n, edges) implement karo: n components se shuru karo, har union jo true return kare uske liye ek baar decrement karo, antim count return karo. n=5, edges=[[0,1],[1,2],[3,4]] par test karo (2 expect karo).',
        hint: 'union returns false when the two nodes were already connected — those calls must NOT decrement the count.',
        hintHi: 'union false return karta hai jab do nodes pehle se connected the — un calls ko count decrement NAHI karna chahiye.',
      },
      {
        task: 'Implement Kruskal\'s MST: given n nodes and weighted edges [a, b, w], sort edges by w, add each edge whose endpoints are not yet connected, stop at n-1 edges. Return the total weight. Test on a small graph and check against a hand-computed MST.',
        taskHi: 'Kruskal ka MST implement karo: n nodes aur weighted edges [a, b, w] diye gaye, edges ko w se sort karo, har edge add karo jiske endpoints abhi connected nahi hain, n-1 edges par ruk jao. Kul weight return karo. Ek chhote graph par test karo aur ek haath-se-compute kiye MST ke against check karo.',
        hint: 'The union-find call IS the cycle check: if uf.union(a, b) returns false, skip that edge because adding it would form a cycle.',
        hintHi: 'union-find call HI cycle check hai: agar uf.union(a, b) false return karta hai, us edge ko skip karo kyunki ise add karna ek cycle banaayega.',
      },
    ],

    keyTakeaways: [
      'Union-find (disjoint set union) tracks which nodes are in the same group, with near-constant-time union(a, b) and connected(a, b).',
      'Each node points to a parent; each group is a tree whose root names the group. find walks to the root; union links one root under the other.',
      'Union by size/rank: always hang the smaller tree under the larger, keeping tree height O(log n) instead of a possible O(n) chain.',
      'Path compression: while walking to the root in find, point nodes directly at nodes nearer the root, so later finds are O(1).',
      'With both optimisations, m operations on n elements cost O(m * alpha(n)) total — alpha(n) <= 4 for any real n, so effectively O(1) amortised.',
      'Use union-find for interleaved connect/query streams and edge-at-a-time algorithms (Kruskal\'s MST). Do not use it for edge deletion, actual-path queries, or directed reachability.',
    ],
    keyTakeawaysHi: [
      'Union-find (disjoint set union) track karta hai ki kaunse nodes ek hi group mein hain, lagbhag-constant-time union(a, b) aur connected(a, b) ke saath.',
      'Har node ek parent ki taraf point karta hai; har group ek tree hai jiska root group ko naam deta hai. find root tak chalta hai; union ek root ko doosre ke neeche link karta hai.',
      'Union by size/rank: hamesha chhote tree ko bade ke neeche taango, tree height ko ek sambhaavit O(n) chain ke bajaye O(log n) rakhte hue.',
      'Path compression: find mein root tak chalte hue, nodes ko seedhe root ke paas nodes ki taraf point karo, taaki baad ke finds O(1) hon.',
      'Dono optimisations ke saath, n elements par m operations kul O(m * alpha(n)) kharch karte hain — kisi bhi asli n ke liye alpha(n) <= 4, toh asal mein O(1) amortised.',
      'Interleaved connect/query streams aur edge-at-a-time algorithms (Kruskal ka MST) ke liye union-find istemal karo. Ise edge deletion, actual-path queries, ya directed reachability ke liye istemal mat karo.',
    ],
  },
];
