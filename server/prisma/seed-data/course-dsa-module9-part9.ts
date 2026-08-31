/**
 * DSA Complete Course — Module 9: Graphs, lesson 9.
 *
 * Bipartite graphs and 2-coloring. Lessons 2 and 3 taught BFS and DFS as
 * traversal skeletons; this lesson hangs one extra piece of state on that
 * skeleton — a colour per node — to answer "can the nodes be split into two
 * groups so that every edge crosses between the groups?" The equivalent
 * questions are "is the graph 2-colorable" and "does the graph have no
 * odd-length cycle".
 *
 * Broken example: assuming any graph can be 2-colored, or checking only that
 * a node differs from ONE neighbour instead of propagating the constraint
 * through the whole component. Also: forgetting that the graph may be
 * disconnected, so a single BFS from node 0 misses other components.
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

export const DSA_MODULE_9_PART9: CourseLesson[] = [
  {
    slug: 'bipartite-graphs-two-coloring',
    title: 'Bipartite Graphs: Two-Coloring with BFS or DFS',
    titleHi: 'Bipartite Graphs: BFS Ya DFS Se Two-Coloring',
    description: 'Deciding whether a group of people can be split into two teams so that every known rivalry is between the teams, by checking each person against just one of their rivals. That local check passes on a triangle of three mutual rivals — each person differs from the one you happened to compare against — yet no valid two-team split exists, because the constraint has to travel all the way around the cycle and it collides with itself.',
    descriptionHi: 'Ye tay karna ki kya logon ke ek group ko do teams mein baanta jaa sakta hai taaki har gyaat rivalry teams ke beech ho, har vyakti ko unke sirf ek rival ke against check karke. Wo local check teen aapsi rivals ke ek triangle par paas ho jaata hai — har vyakti us se alag hai jiske against aapne samyog se compare kiya — phir bhi koi valid do-team split maujood nahi, kyunki constraint ko poore cycle ke charon or safar karna hota hai aur wo khud se takraata hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 9,

    analogy: {
      en: '**Seating a set of guests at two long tables so that no two people who dislike each other share a table.** You start with any guest, sit them at table A, and then the rule forces everyone else: anyone who dislikes a table-A person must go to table B, anyone who dislikes a table-B person must go back to table A, and you keep pushing this constraint outward through the whole web of dislikes. Two things can happen. Either the constraint spreads cleanly to everyone connected to your starting guest and you get a valid split — then you move to any guest you have not placed yet (a separate friend group, disconnected from the first) and repeat. Or, somewhere along the chain, the rule tells you to seat someone at table A when you have already been forced to seat them at table B. That contradiction is not a mistake in your process — it means no valid seating exists at all, and it happens exactly when the dislikes form a loop of odd length, because going around an odd loop and alternating tables lands you back where you started but on the wrong table. The whole algorithm is: pick a start, alternate outward, and declare failure the instant one person is assigned both tables.',
      hi: '**Mehmaano ke ek set ko do lambi mezon par bithaana taaki koi do log jo ek doosre ko napasand karte hain ek mez share na karein.** Aap kisi bhi mehmaan se shuru karte ho, unhe mez A par bithaate ho, aur phir niyam baaki sabko majboor karta hai: koi bhi jo ek mez-A vyakti ko napasand karta hai use mez B par jaana hoga, koi bhi jo ek mez-B vyakti ko napasand karta hai use wapas mez A par jaana hoga, aur aap is constraint ko napasand ke poore jaal ke charon or baahar dhakelte raho. Do cheezein ho sakti hain. Ya toh constraint aapke shuruaati mehmaan se jude sab tak saaf failta hai aur aapko ek valid split milta hai — phir aap kisi bhi mehmaan par jaate ho jise aapne abhi tak nahi rakha (ek alag friend group, pehle se disconnected) aur dohraate ho. Ya, chain ke kahin, niyam aapko kisi ko mez A par bithaane ko kehta hai jab aap pehle se use mez B par bithaane ko majboor ho chuke ho. Wo virodhabhaas aapki prakriya mein ek galti nahi hai — iska matlab koi valid seating maujood hi nahi, aur wo bilkul tab hota hai jab napasand ek vishham lambaayi ka loop banate hain, kyunki ek vishham loop ke charon or jaana aur mez badalna aapko wahin wapas laata hai jahaan aap shuru hue par galat mez par. Poora algorithm hai: ek start chuno, baahar ki taraf alternate karo, aur us pal failure ghoshit karo jab ek vyakti ko dono mez assign ho jaayein.',
    },

    simple: `**Start broken.** Check each node against one neighbour; assume it always works:

\`\`\`js
function isBipartiteBroken(adj) {
  const color = new Array(adj.length).fill(0);   // 0 = uncoloured
  for (let u = 0; u < adj.length; u++) {
    if (color[u] === 0) color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 0) color[v] = -color[u];   // colour v opposite to u
      // BUG: no check that v might ALREADY be coloured the same as u
      // BUG: only looks one edge out; the constraint never propagates
    }
  }
  return true;   // always says yes
}

// triangle 0-1, 1-2, 2-0:
// u=0 -> color[0]=1; v=1 -> color[1]=-1; v=2 -> color[2]=-1
// u=1 -> v=0 already 1 (ok), v=2 already -1 ... but 1 and 2 are BOTH -1 and adjacent!
// the function never notices -> returns true. A triangle is NOT bipartite.
\`\`\`

The local "make my neighbour a different colour" step is right, but two things are missing: it never *checks* an already-coloured neighbour for a conflict, and it does not carry the colouring outward through the whole component. A triangle needs three alternating colours, which is impossible with two — the contradiction only shows up when you close the loop.

**The fix: BFS/DFS that colours as it goes and fails on a conflict**

\`\`\`js
function isBipartite(adj) {
  const n = adj.length;
  const color = new Array(n).fill(0);            // 0 = unvisited, 1 / -1 = the two colours

  for (let start = 0; start < n; start++) {      // every component, not just node 0
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue = [start];
    while (queue.length) {
      const u = queue.shift();
      for (const v of adj[u]) {
        if (color[v] === 0) {
          color[v] = -color[u];                  // colour opposite, enqueue
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;                          // same colour on an edge -> odd cycle
        }
      }
    }
  }
  return true;
}

console.log(isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]]));   // true  (a 4-cycle)
console.log(isBipartite([[1, 2], [0, 2], [0, 1]]));           // false (a triangle)
\`\`\`

\`\`\`ts
function isBipartite(adj: number[][]): boolean {
  const n = adj.length;
  const color = new Array<number>(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue: number[] = [start];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of adj[u]!) {
        if (color[v] === 0) { color[v] = -color[u]!; queue.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
\`\`\`

The colouring IS the BFS from lessons 2-3, with one extra rule at each edge: if the neighbour is uncoloured, give it the opposite colour and continue; if it already has a colour, it must be the opposite of the current node, or the graph is not bipartite. The outer loop over \`start\` handles disconnected graphs — every unvisited node begins a fresh component.`,

    simpleHi: `**Toote hue se shuru.** Har node ko ek neighbour ke against check karo; maano ye hamesha kaam karta hai:

\`\`\`js
function isBipartiteBroken(adj) {
  const color = new Array(adj.length).fill(0);   // 0 = uncoloured
  for (let u = 0; u < adj.length; u++) {
    if (color[u] === 0) color[u] = 1;
    for (const v of adj[u]) {
      if (color[v] === 0) color[v] = -color[u];   // v ko u ke ulta colour do
      // BUG: koi check nahi ki v pehle se u jaisa hi coloured ho sakta hai
      // BUG: sirf ek edge baahar dekhta hai; constraint kabhi propagate nahi hota
    }
  }
  return true;   // hamesha haan kehta hai
}

// triangle 0-1, 1-2, 2-0:
// u=0 -> color[0]=1; v=1 -> color[1]=-1; v=2 -> color[2]=-1
// u=1 -> v=0 pehle se 1 (ok), v=2 pehle se -1 ... par 1 aur 2 DONO -1 aur adjacent hain!
// function kabhi notice nahi karta -> true lautaata hai. Ek triangle bipartite NAHI hai.
\`\`\`

Local "mere neighbour ko ek alag colour banao" step sahi hai, par do cheezein laapata hain: ye ek pehle-se-coloured neighbour ko ek conflict ke liye kabhi *check* nahi karta, aur ye colouring ko poore component ke charon or baahar nahi le jaata. Ek triangle ko teen alternating colours chahiye, jo do ke saath namumkin hai — virodhabhaas sirf tab dikhta hai jab aap loop band karte ho.

**Fix: BFS/DFS jo chalte-chalte colour karta hai aur ek conflict par fail hota hai**

\`\`\`js
function isBipartite(adj) {
  const n = adj.length;
  const color = new Array(n).fill(0);            // 0 = unvisited, 1 / -1 = do colours

  for (let start = 0; start < n; start++) {      // har component, sirf node 0 nahi
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue = [start];
    while (queue.length) {
      const u = queue.shift();
      for (const v of adj[u]) {
        if (color[v] === 0) {
          color[v] = -color[u];                  // ulta colour do, enqueue karo
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;                          // ek edge par same colour -> odd cycle
        }
      }
    }
  }
  return true;
}

console.log(isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]]));   // true  (ek 4-cycle)
console.log(isBipartite([[1, 2], [0, 2], [0, 1]]));           // false (ek triangle)
\`\`\`

\`\`\`ts
function isBipartite(adj: number[][]): boolean {
  const n = adj.length;
  const color = new Array<number>(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue: number[] = [start];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of adj[u]!) {
        if (color[v] === 0) { color[v] = -color[u]!; queue.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
\`\`\`

Colouring HI lessons 2-3 se BFS hai, har edge par ek atirikt niyam ke saath: agar neighbour uncoloured hai, use ulta colour do aur jaari rakho; agar iske paas pehle se ek colour hai, use current node ka ulta hona chahiye, warna graph bipartite nahi hai. \`start\` par outer loop disconnected graphs sambhaalta hai — har unvisited node ek naya component shuru karta hai.`,

    content: `## Three names for the same property

\`\`\`
BIPARTITE           the nodes split into two sets, every edge goes BETWEEN sets
2-COLORABLE         you can paint nodes with 2 colours, no edge same-coloured
NO ODD CYCLE        the graph contains no cycle of odd length

These are exactly equivalent. If you can 2-colour it, follow any cycle: the
colour flips on every edge, so returning to the start means an EVEN number of
flips -> even cycle. Contrapositive: an odd cycle can never be 2-coloured.
\`\`\`

The algorithm proves the property constructively: it either produces a valid 2-colouring (and the two colour classes are your two sets) or it hits an edge whose endpoints already share a colour, which is a witness of an odd cycle.

## DFS version — identical logic, recursion instead of a queue

\`\`\`js
function isBipartiteDFS(adj) {
  const color = new Array(adj.length).fill(0);

  function paint(u, c) {
    color[u] = c;
    for (const v of adj[u]) {
      if (color[v] === 0) {
        if (!paint(v, -c)) return false;
      } else if (color[v] === c) {
        return false;                    // v already has u's colour
      }
    }
    return true;
  }

  for (let u = 0; u < adj.length; u++)
    if (color[u] === 0 && !paint(u, 1)) return false;
  return true;
}
\`\`\`

Both are O(V + E): every node is coloured once and every edge is inspected a constant number of times. Space is O(V) for the colour array plus the queue or recursion stack.

## Returning the two sets, not just a boolean

\`\`\`js
function bipartition(adj) {
  const color = new Array(adj.length).fill(0);
  for (let start = 0; start < adj.length; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) {
        if (color[v] === 0) { color[v] = -color[u]; q.push(v); }
        else if (color[v] === color[u]) return null;   // not bipartite
      }
    }
  }
  const A = [], B = [];
  color.forEach((c, i) => (c === 1 ? A : B).push(i));
  return [A, B];
}
\`\`\`

## Where bipartite-ness is the hidden question

\`\`\`
"split into two teams / groups with no internal conflict"      is it bipartite
"can this schedule be 2-shifted"                               is the conflict graph bipartite
"is this relationship graph consistent" (likes/dislikes)       2-colour, fail on contradiction
"maximum matching in a bipartite graph"                        first CONFIRM bipartite, then
                                                                Hopcroft-Karp / Hungarian
"possible bipartition given a list of dislike pairs"            build adj from pairs, isBipartite

Interview tell: the problem asks to divide items into exactly TWO groups such
that some "conflict" relation is always across the divide. Odd cycle = no.
Note: this does NOT extend to 3 colours — 3-colorability is NP-hard. The
2-colour case is easy precisely because the second colour is forced.
\`\`\``,

    contentHi: `## Ek hi property ke teen naam

\`\`\`
BIPARTITE           nodes do sets mein baantte hain, har edge sets ke BEECH jaata hai
2-COLORABLE         aap nodes ko 2 colours se paint kar sakte ho, koi edge same-coloured nahi
NO ODD CYCLE        graph mein vishham lambaayi ka koi cycle nahi

Ye bilkul samaan hain. Agar aap ise 2-colour kar sakte ho, kisi bhi cycle ko follow
karo: colour har edge par palatta hai, isliye start par wapas aana matlab flips ki
ek SAM tadaad -> sam cycle. Contrapositive: ek vishham cycle kabhi 2-coloured nahi ho sakta.
\`\`\`

Algorithm property ko rachnaatmak roop se saabit karta hai: ye ya toh ek valid 2-colouring banaata hai (aur do colour classes aapke do sets hain) ya ek aise edge par pahunchta hai jiske endpoints pehle se ek colour share karte hain, jo ek vishham cycle ka gawaah hai.

## DFS version — samaan logic, queue ke bajaye recursion

\`\`\`js
function isBipartiteDFS(adj) {
  const color = new Array(adj.length).fill(0);

  function paint(u, c) {
    color[u] = c;
    for (const v of adj[u]) {
      if (color[v] === 0) {
        if (!paint(v, -c)) return false;
      } else if (color[v] === c) {
        return false;                    // v ke paas pehle se u ka colour hai
      }
    }
    return true;
  }

  for (let u = 0; u < adj.length; u++)
    if (color[u] === 0 && !paint(u, 1)) return false;
  return true;
}
\`\`\`

Dono O(V + E) hain: har node ek baar coloured hota hai aur har edge ek constant tadaad mein inspect hota hai. Space colour array plus queue ya recursion stack ke liye O(V) hai.

## Sirf ek boolean nahi, do sets lautaana

\`\`\`js
function bipartition(adj) {
  const color = new Array(adj.length).fill(0);
  for (let start = 0; start < adj.length; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) {
        if (color[v] === 0) { color[v] = -color[u]; q.push(v); }
        else if (color[v] === color[u]) return null;   // bipartite nahi
      }
    }
  }
  const A = [], B = [];
  color.forEach((c, i) => (c === 1 ? A : B).push(i));
  return [A, B];
}
\`\`\`

## Kahaan bipartite-ness chhupa sawaal hai

\`\`\`
"do teams / groups mein baanto bina internal conflict"        kya ye bipartite hai
"kya ye schedule 2-shift ho sakta hai"                        kya conflict graph bipartite hai
"kya ye relationship graph consistent hai" (likes/dislikes)   2-colour, virodhabhaas par fail
"ek bipartite graph mein maximum matching"                    pehle bipartite CONFIRM karo, phir
                                                                Hopcroft-Karp / Hungarian
"dislike pairs ki list diye bipartition sambhav"             pairs se adj banao, isBipartite

Interview sanket: problem items ko bilkul DO groups mein baantne ko kehta hai
taaki koi "conflict" relation hamesha divide ke aar-paar ho. Odd cycle = nahi.
Note: ye 3 colours tak NAHI badhta — 3-colorability NP-hard hai. 2-colour case
bilkul isliye aasaan hai kyunki doosra colour majboor hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: no conflict check, no propagation',
        titleHi: 'Toota: koi conflict check nahi, koi propagation nahi',
        code: `if (color[v] === 0) color[v] = -color[u];
// never checks color[v] === color[u]; never recurses/enqueues`,
        codeJs: `function isBipartiteBroken(adj) {
  const color = new Array(adj.length).fill(0);
  for (let u = 0; u < adj.length; u++) {
    if (color[u] === 0) color[u] = 1;
    for (const v of adj[u]) if (color[v] === 0) color[v] = -color[u];
  }
  return true;
}
console.log(isBipartiteBroken([[1, 2], [0, 2], [0, 1]]));   // true — WRONG, triangle
console.log(isBipartiteBroken([[1], [0, 2], [1]]));          // true — happens to be right`,
        codeTs: `function isBipartiteBroken(adj: number[][]): boolean {
  const color = new Array<number>(adj.length).fill(0);
  for (let u = 0; u < adj.length; u++) {
    if (color[u] === 0) color[u] = 1;
    for (const v of adj[u]!) if (color[v] === 0) color[v] = -color[u]!;
  }
  return true;
}`,
        outputJs: `true
true`,
        outputTs: `// The triangle case is wrong — it must be false.`,
        explain: 'On the triangle, node 0 gets colour 1, then 1 and 2 both get colour -1. When processing node 1, its neighbour 2 is already coloured -1 — the same as node 1 — but the code has no branch that checks for that, so it never returns false. It also returns true unconditionally regardless.',
        explainHi: 'Triangle par, node 0 ko colour 1 milta hai, phir 1 aur 2 dono ko colour -1 milta hai. Node 1 process karte waqt, iska neighbour 2 pehle se -1 coloured hai — node 1 jaisa hi — par code mein koi branch nahi jo uske liye check kare, isliye ye kabhi false nahi lautaata.',
      },
      {
        title: 'Fixed: BFS colouring with a conflict check',
        titleHi: 'Theek: conflict check ke saath BFS colouring',
        code: `if (color[v] === 0) { color[v] = -color[u]; queue.push(v); }
else if (color[v] === color[u]) return false;`,
        codeJs: `function isBipartite(adj) {
  const n = adj.length;
  const color = new Array(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue = [start];
    while (queue.length) {
      const u = queue.shift();
      for (const v of adj[u]) {
        if (color[v] === 0) { color[v] = -color[u]; queue.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
console.log(isBipartite([[1, 3], [0, 2], [1, 3], [0, 2]]));   // true (4-cycle)
console.log(isBipartite([[1, 2], [0, 2], [0, 1]]));           // false (triangle)
console.log(isBipartite([[1], [0], [3], [2]]));               // true (two disjoint edges)`,
        codeTs: `function isBipartite(adj: number[][]): boolean {
  const n = adj.length;
  const color = new Array<number>(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue: number[] = [start];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of adj[u]!) {
        if (color[v] === 0) { color[v] = -color[u]!; queue.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}`,
        outputJs: `true
false
true`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'The 4-cycle alternates colours cleanly and returns true. The triangle forces node 2 to be both -1 (from node 0) and, when node 1 checks it, the same colour as node 1 — conflict, false. The two-disjoint-edges case shows the outer start loop finding the second component.',
        explainHi: '4-cycle colours saaf alternate karta hai aur true lautaata hai. Triangle node 2 ko dono -1 (node 0 se) aur, jab node 1 ise check karta hai, node 1 jaisa hi colour hone ko majboor karta hai — conflict, false. Two-disjoint-edges case outer start loop ko doosra component dhoondhte dikhaata hai.',
      },
      {
        title: 'Returning the two groups (possible bipartition)',
        titleHi: 'Do groups lautaana (possible bipartition)',
        code: `color.forEach((c, i) => (c === 1 ? A : B).push(i));   // split by colour`,
        codeJs: `function bipartition(n, dislikes) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of dislikes) { adj[a - 1].push(b - 1); adj[b - 1].push(a - 1); }
  const color = new Array(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const q = [start];
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) {
        if (color[v] === 0) { color[v] = -color[u]; q.push(v); }
        else if (color[v] === color[u]) return null;
      }
    }
  }
  const A = [], B = [];
  color.forEach((c, i) => (c === 1 ? A : B).push(i + 1));
  return [A, B];
}
console.log(bipartition(4, [[1, 2], [1, 3], [2, 4]]));   // [[1, 4], [2, 3]]
console.log(bipartition(3, [[1, 2], [1, 3], [2, 3]]));   // null (triangle)`,
        codeTs: `function bipartition(n: number, dislikes: number[][]): number[][] | null {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of dislikes) { adj[a! - 1]!.push(b! - 1); adj[b! - 1]!.push(a! - 1); }
  const color = new Array<number>(n).fill(0);
  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const q: number[] = [start];
    while (q.length) {
      const u = q.shift()!;
      for (const v of adj[u]!) {
        if (color[v] === 0) { color[v] = -color[u]!; q.push(v); }
        else if (color[v] === color[u]) return null;
      }
    }
  }
  const A: number[] = [], B: number[] = [];
  color.forEach((c, i) => (c === 1 ? A : B).push(i + 1));
  return [A, B];
}`,
        outputJs: `[ [ 1, 4 ], [ 2, 3 ] ]
null`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'The dislike pairs become undirected edges; a successful 2-colouring puts colour-1 nodes in group A and colour-(-1) nodes in group B. The triangle 1-2, 1-3, 2-3 is an odd cycle, so no split exists and the function returns null.',
        explainHi: 'Dislike pairs undirected edges ban jaate hain; ek safal 2-colouring colour-1 nodes ko group A mein aur colour-(-1) nodes ko group B mein daalti hai. Triangle 1-2, 1-3, 2-3 ek vishham cycle hai, isliye koi split maujood nahi aur function null lautaata hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// starting BFS only from node 0
color[0] = 1;
const q = [0];
// ...bfs...
return true;   // never visits nodes in other components`,
        right: `for (let start = 0; start < n; start++) {
  if (color[start] !== 0) continue;   // begin a fresh BFS for every component
  // ...
}`,
        why: 'A graph may be disconnected. A BFS from node 0 only reaches node 0\'s component; a non-bipartite triangle sitting in a separate component would go completely unchecked, and the function would wrongly report the whole graph as bipartite.',
        whyHi: 'Ek graph disconnected ho sakta hai. Node 0 se ek BFS sirf node 0 ke component tak pahunchta hai; ek alag component mein baithe ek non-bipartite triangle bilkul unchecked chala jaata, aur function galat tarike se poore graph ko bipartite batata.',
      },
      {
        wrong: `// checking the wrong condition on an already-coloured neighbour
else if (color[v] !== color[u]) return false;   // fails on a VALID edge`,
        right: `else if (color[v] === color[u]) return false;   // fails only when the edge is BAD`,
        why: 'A correctly coloured neighbour has the OPPOSITE colour to the current node, so color[v] !== color[u] is the normal, healthy case. The failure condition is the two endpoints sharing a colour. Inverting the test rejects every proper bipartite graph.',
        whyHi: 'Ek sahi tarike se coloured neighbour ka current node se ULTA colour hota hai, isliye color[v] !== color[u] saamaanya, swasth case hai. Failure condition do endpoints ek colour share karna hai. Test ulta karna har sahi bipartite graph ko reject karta hai.',
      },
      {
        wrong: `// treating "0" (uncoloured) as a real colour
color = new Array(n).fill(0);
color[start] = 0;   // and then using 0 vs 1 as the two colours
// now an uncoloured node and a colour-0 node are indistinguishable`,
        right: `color = new Array(n).fill(0);   // 0 means UNCOLOURED
color[start] = 1;               // real colours are 1 and -1 (or 1 and 2)`,
        why: 'The visited check relies on 0 meaning "not yet coloured". If 0 is also one of the two real colours, the algorithm cannot tell a fresh node from a coloured one, so it re-processes nodes and its conflict logic breaks. Use two non-zero values for the colours.',
        whyHi: 'Visited check 0 ke "abhi tak coloured nahi" matlab par nirbhar karta hai. Agar 0 do asli colours mein se ek bhi hai, algorithm ek naye node ko ek coloured se alag nahi kar sakta, isliye ye nodes dobara process karta hai aur iska conflict logic tootta hai. Colours ke liye do non-zero values istemal karo.',
      },
    ],

    realWorld: [
      {
        en: '**Scheduling and resource assignment** — split shifts into two rosters, jobs onto two machines, exams into two time slots — is a bipartite check on the "cannot coexist" conflict graph; an odd conflict cycle means two slots are provably not enough.',
        hi: '**Scheduling aur resource assignment** — shifts ko do rosters mein baanto, jobs ko do machines par, exams ko do time slots mein — "saath nahi ho sakte" conflict graph par ek bipartite check hai; ek vishham conflict cycle matlab do slots provably kaafi nahi.',
      },
      {
        en: '**Bipartite matching problems** — assigning applicants to jobs, students to projects, riders to drivers — must first verify the graph is bipartite (it usually is by construction: two distinct node types) before running a matching algorithm.',
        hi: '**Bipartite matching problems** — applicants ko jobs, students ko projects, riders ko drivers assign karna — ek matching algorithm chalane se pehle pehle verify karna hoga ki graph bipartite hai (ye aam taur par nirmaan se hota hai: do alag node types).',
      },
      {
        en: '**Consistency checking** in preference or relationship data — "A and B are enemies", "B and C are enemies", "A and C are enemies" — surfaces contradictions as odd cycles, exactly the failure the 2-colouring detects.',
        hi: '**Preference ya relationship data mein consistency checking** — "A aur B dushman hain", "B aur C dushman hain", "A aur C dushman hain" — virodhabhaas ko vishham cycles ki tarah saamne laati hai, bilkul wo failure jo 2-colouring pakadti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you check if a graph is bipartite, and why is "no odd cycle" the same property?',
        qHi: 'Aap kaise check karte ho ki ek graph bipartite hai, aur "koi odd cycle nahi" wahi property kyun hai?',
        a: 'To check bipartiteness I run a BFS or DFS and try to two-colour the graph as I go. I keep a colour array where zero means unvisited and one and minus one are the two colours. I loop over all nodes so that disconnected components are each handled; whenever I find an uncoloured node I start a traversal from it, colouring it one. As the traversal expands, for each edge from the current node u to a neighbour v, if v is uncoloured I paint it the opposite colour to u and continue exploring from it; if v is already coloured, it must be the opposite colour to u, and if instead it has the same colour as u I have found an edge with both endpoints the same colour, which means the graph is not bipartite and I return false immediately. If the whole traversal finishes with no such conflict, the graph is bipartite, and the two colour classes are the two sets. The cost is linear in the number of nodes plus edges, because each node is coloured once and each edge examined a constant number of times. As for why bipartite is exactly the same as having no odd cycle: suppose the graph is two-colourable. Take any cycle and walk around it. Every edge you cross flips the colour, so by the time you return to the starting node you have flipped colour some number of times equal to the cycle length, and since you are back to the same node you must be back to the same colour, which forces the number of flips to be even, so the cycle length is even. That shows a two-colourable graph has no odd cycle. The other direction: if the graph has no odd cycle, the two-colouring process never hits a contradiction, because a contradiction — an edge whose endpoints got the same colour — would mean there are two paths of the same parity between those endpoints, and closing them into a cycle would produce an odd total length. So no odd cycle guarantees the colouring succeeds. One caveat: this is special to two colours. Deciding whether a graph is three-colourable is NP-hard. The two-colour case is easy precisely because once you pick a colour for one node, every other node\'s colour in its component is forced, leaving nothing to search.',
        aHi: 'Bipartiteness check karne ke liye main ek BFS ya DFS chalata hoon aur chalte-chalte graph ko two-colour karne ki koshish karta hoon. Main ek colour array rakhta hoon jahaan zero matlab unvisited aur ek aur minus ek do colours hain. Main sab nodes par loop karta hoon taaki disconnected components har ek sambhale jaayein; jab bhi mujhe ek uncoloured node milta hai main ismein se ek traversal shuru karta hoon, ise ek colour karke. Jaise traversal failta hai, current node u se ek neighbour v tak har edge ke liye, agar v uncoloured hai main ise u ke ulta colour paint karta hoon aur ismein se explore jaari rakhta hoon; agar v pehle se coloured hai, use u ke ulta colour hona chahiye, aur agar iske bajaye iske paas u jaisa hi colour hai maine ek edge dhoondha jiske dono endpoints ek colour hain, jiska matlab graph bipartite nahi hai aur main turant false lautaata hoon. Cost nodes plus edges ki tadaad mein linear hai. Ab bipartite bilkul odd cycle na hone jaisa kyun hai: maano graph two-colourable hai. Koi bhi cycle lo aur uske charon or chalo. Har edge jo aap cross karte ho colour palatta hai, isliye jab tak aap shuruaati node par wapas aate ho aapne colour cycle length ke barabar tadaad mein palta hai, aur kyunki aap usi node par wapas ho aapko usi colour par wapas hona chahiye, jo flips ki tadaad ko sam hone ko majboor karta hai. Ek caveat: ye do colours ke liye khaas hai. Ye tay karna ki ek graph three-colourable hai NP-hard hai.',
      },
      {
        q: 'BFS or DFS for 2-coloring — does it matter? And what does the algorithm hand you beyond a yes/no?',
        qHi: '2-coloring ke liye BFS ya DFS — kya farak padta hai? Aur algorithm aapko yes/no ke alawa kya deta hai?',
        a: 'For deciding bipartiteness it genuinely does not matter which traversal you use. Both visit every node once and inspect every edge a constant number of times, both are linear in nodes plus edges, and both detect the same conflict — an edge whose two endpoints have been assigned the same colour. The only practical differences are the usual ones: DFS is a few lines shorter because the recursion carries the "current colour" naturally, but on a very deep graph it can overflow the call stack, so an explicit BFS queue or an explicit DFS stack is safer for large inputs. BFS also has a mild conceptual bonus here: because it explores in layers, the colour of a node ends up being just the parity of its distance from the start node, which makes it easy to explain and easy to reason about when an odd cycle appears — the conflict edge connects two nodes at the same BFS layer. Beyond the boolean, the algorithm gives you two concrete things. First, the colour array itself is a valid bipartition: collect the colour-one nodes into one set and the colour-minus-one nodes into the other, and every edge crosses between them. That is the actual answer to problems phrased as "divide these into two groups". Second, when it fails, the edge that triggered the failure, together with the BFS or DFS tree paths back to the two endpoints\' common ancestor, is an explicit odd cycle — a certificate that the answer is genuinely no, not just that the algorithm gave up. That certificate is worth producing when the problem asks you to explain the impossibility, or when you want to show a specific conflicting triple in preference-consistency checking.',
        aHi: 'Bipartiteness tay karne ke liye sach mein farak nahi padta aap kaunsa traversal istemal karte ho. Dono har node ek baar visit karte hain aur har edge ek constant tadaad mein inspect karte hain, dono nodes plus edges mein linear hain, aur dono wahi conflict pakadte hain — ek edge jiske do endpoints ko ek colour assign hua. Ekmatra vyaavahaarik antar saamaanya hain: DFS kuch lines chhota hai kyunki recursion "current colour" swabhaavik roop se le jaati hai, par ek bahut gehre graph par ye call stack overflow kar sakta hai, isliye ek explicit BFS queue ya ek explicit DFS stack bade inputs ke liye surakshit hai. BFS ka yahaan ek halka conceptual bonus bhi hai: kyunki ye layers mein explore karta hai, ek node ka colour bas start node se iski doori ki parity ban jaata hai. Boolean ke alawa, algorithm aapko do thos cheezein deta hai. Pehle, colour array khud ek valid bipartition hai: colour-ek nodes ko ek set mein aur colour-minus-ek nodes ko doosre mein ikattha karo. Doosre, jab ye fail hota hai, wo edge jo failure trigger karta hai, do endpoints ke common ancestor tak BFS ya DFS tree paths ke saath, ek explicit odd cycle hai — ek certificate ki jawaab sach mein nahi hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement isBipartite with BFS. Verify: the 4-cycle [[1,3],[0,2],[1,3],[0,2]] -> true, the triangle [[1,2],[0,2],[0,1]] -> false, and a graph with a bipartite component AND a triangle in a separate component -> false. Confirm the outer start loop is what catches the second component.',
        taskHi: 'isBipartite ko BFS se implement karo. Verify karo: 4-cycle [[1,3],[0,2],[1,3],[0,2]] -> true, triangle [[1,2],[0,2],[0,1]] -> false, aur ek graph ek bipartite component AUR ek alag component mein ek triangle ke saath -> false. Confirm karo ki outer start loop wo hai jo doosra component pakadta hai.',
        hint: 'Build adj for 6 nodes: 0-1 (an edge) plus 2-3, 3-4, 4-2 (a triangle). BFS from 0 colours the edge fine; without the start loop it returns true. With the loop, start=2 begins a new BFS and hits the triangle conflict.',
        hintHi: '6 nodes ke liye adj banao: 0-1 (ek edge) plus 2-3, 3-4, 4-2 (ek triangle). 0 se BFS edge theek colour karta hai; start loop ke bina ye true lautaata hai. Loop ke saath, start=2 ek naya BFS shuru karta hai aur triangle conflict par pahunchta hai.',
      },
      {
        task: 'Implement the DFS version isBipartiteDFS and confirm it agrees with your BFS version on 10 random graphs (generate random edge sets, compare the two booleans). Then note which one risks a stack overflow on a 100,000-node path graph.',
        taskHi: 'DFS version isBipartiteDFS implement karo aur confirm karo ki ye 10 random graphs par tumhaare BFS version se sahmat hai (random edge sets generate karo, do booleans compare karo). Phir note karo ki kaunsa ek 100,000-node path graph par stack overflow ka risk uthata hai.',
        hint: 'A path 0-1-2-...-99999 is bipartite, but the recursive DFS descends 100,000 frames deep and blows the stack in most runtimes. The BFS queue version handles it in constant stack space.',
        hintHi: 'Ek path 0-1-2-...-99999 bipartite hai, par recursive DFS 100,000 frames gehra utarta hai aur adhikaansh runtimes mein stack uda deta hai. BFS queue version ise constant stack space mein sambhaalta hai.',
      },
      {
        task: 'Implement bipartition(n, dislikes) that returns the two groups (1-indexed) or null. Verify bipartition(4, [[1,2],[1,3],[2,4]]) -> [[1,4],[2,3]] and bipartition(3, [[1,2],[1,3],[2,3]]) -> null. Then invert the conflict check to "!==" and watch every valid input return null.',
        taskHi: 'bipartition(n, dislikes) implement karo jo do groups (1-indexed) ya null lautaata hai. Verify karo bipartition(4, [[1,2],[1,3],[2,4]]) -> [[1,4],[2,3]] aur bipartition(3, [[1,2],[1,3],[2,3]]) -> null. Phir conflict check ko "!==" mein ulto aur har valid input ko null lautate dekho.',
        hint: 'With "color[v] !== color[u]" as the failure test, the very first properly-coloured neighbour (opposite colour, the healthy case) triggers a false return. Every bipartite graph then reports null.',
        hintHi: '"color[v] !== color[u]" ko failure test ki tarah rakhne par, sabse pehla sahi-coloured neighbour (ulta colour, swasth case) ek false return trigger karta hai. Har bipartite graph phir null batata hai.',
      },
    ],

    keyTakeaways: [
      'Bipartite = 2-colorable = no odd-length cycle. All three are exactly the same property.',
      'Algorithm: BFS or DFS, colouring each node the opposite of its parent. At every edge, if the neighbour is uncoloured, colour and enqueue it; if it is already coloured the SAME as the current node, return false.',
      'Loop the traversal over ALL start nodes — the graph may be disconnected, and a single BFS from node 0 misses non-bipartite components elsewhere.',
      'Use 0 for "uncoloured" and two non-zero values (1 / -1) for the colours, so the visited check and the colour are not confused.',
      'The failure condition is color[v] === color[u] (same colour on an edge), not "!==". Inverting it rejects every valid bipartite graph.',
      'O(V + E) time, O(V) space. BFS and DFS are equivalent here; DFS is shorter but risks stack overflow on deep graphs.',
      'The colour array IS the bipartition — split nodes by colour to get the two groups. On failure, the conflict edge plus tree paths is an explicit odd cycle certificate.',
      'This does NOT generalise: 3-colorability is NP-hard. 2-coloring is easy only because the second colour is forced once the first node is coloured.',
    ],
    keyTakeawaysHi: [
      'Bipartite = 2-colorable = koi vishham-lambaayi cycle nahi. Teenon bilkul wahi property hain.',
      'Algorithm: BFS ya DFS, har node ko iske parent ke ulta colour karte hue. Har edge par, agar neighbour uncoloured hai, use colour karo aur enqueue karo; agar wo pehle se current node ke SAMAAN coloured hai, false lautaao.',
      'Traversal ko SAB start nodes par loop karo — graph disconnected ho sakta hai, aur node 0 se ek akela BFS kahin aur non-bipartite components chhoot jaata hai.',
      '"uncoloured" ke liye 0 aur colours ke liye do non-zero values (1 / -1) istemal karo, taaki visited check aur colour confuse na hon.',
      'Failure condition color[v] === color[u] hai (ek edge par same colour), "!==" nahi. Ise ulta karna har valid bipartite graph ko reject karta hai.',
      'O(V + E) time, O(V) space. BFS aur DFS yahaan samaan hain; DFS chhota hai par gehre graphs par stack overflow ka risk.',
      'Colour array HI bipartition hai — nodes ko colour se baanto do groups paane ko. Failure par, conflict edge plus tree paths ek explicit odd cycle certificate hai.',
      'Ye general nahi hota: 3-colorability NP-hard hai. 2-coloring sirf isliye aasaan hai kyunki pehla node coloured hone ke baad doosra colour majboor hai.',
    ],
  },
];
