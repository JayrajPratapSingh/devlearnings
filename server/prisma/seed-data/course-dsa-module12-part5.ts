/**
 * DSA Complete Course — Module 12: Greedy Algorithms, lesson 5.
 *
 * Merge Intervals and the sweep line. Lesson 1 taught interval SCHEDULING
 * (pick the most non-overlapping intervals — an exchange-argument greedy).
 * This lesson is the other half of the interval world: given a pile of
 * intervals, MERGE the ones that touch, INSERT a new one, and COUNT the
 * maximum number that overlap at any instant (the "minimum meeting rooms"
 * question). The unifying trick is the same one interval scheduling used:
 * sort first, then make one linear pass. What you sort BY changes with the
 * question.
 *
 * Broken example: comparing every pair of intervals to decide what merges
 * with what — O(n^2), and it still gets the answer wrong on chains like
 * [1,4],[2,5],[5,9] because "overlaps" is not transitive when checked
 * pairwise without ordering.
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

export const DSA_MODULE_12_PART5: CourseLesson[] = [
  {
    slug: 'merge-intervals-and-the-sweep-line',
    title: 'Merge Intervals and the Sweep Line',
    titleHi: 'Merge Intervals Aur Sweep Line',
    description: 'Merging a pile of time ranges by comparing every range against every other range to see which ones touch. On a calendar with a few thousand entries that is millions of comparisons, and it still returns a wrong answer on a chain like 1-4, 2-5, 5-9, because checking "do these two overlap" pairwise, with no ordering, misses that the first and third are connected through the second.',
    descriptionHi: 'Time ranges ke ek dher ko merge karna har range ko har doosre range ke against compare karke ye dekhne ke liye ki kaunse chhoote hain. Kuch hazaar entries waale ek calendar par wo laakhon comparisons hai, aur ye 1-4, 2-5, 5-9 jaise ek chain par abhi bhi galat jawaab deta hai, kyunki "kya ye do overlap karte hain" ko jodi mein, bina kisi kram ke, check karna ye chhoot jaata hai ki pehla aur teesra doosre ke zariye jude hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Marking off the hours you are busy on a paper day-planner, given a stack of appointment slips in no particular order.** The slow way is to hold up each slip against every other slip, asking "do these two times touch?" — and even then you get it wrong, because slip A (9 to 10) and slip C (10:30 to 11:30) do not touch each other, yet slip B (9:45 to 10:45) bridges them into one solid block from 9 to 11:30. Overlap is not something you can judge two slips at a time when the slips are shuffled. The fix is to first put the slips in order of start time, then run your finger down the planner once. You keep a single "current busy block" in mind. Each new slip either starts before your current block ends — so you stretch the block\'s end to cover it — or it starts after a gap, so you write down the finished block and begin a fresh one. One pass, in order, and the chain A-B-C collapses correctly because B is seen before C and has already stretched the block past 10:30. A different question — "how many rooms do I need so no two meetings collide?" — is the same sweep, but instead of tracking one block you count how many slips are open at once: every start adds one to the count, every end removes one, and the highest the count ever reaches is your answer.',
      hi: '**Ek paper day-planner par un ghanton ko mark karna jab aap busy ho, appointment slips ka ek dher bina kisi khaas kram ke diye jaane par.** Dheema tarika har slip ko har doosri slip ke against pakadna hai, ye poochhte hue "kya ye do time chhoote hain?" — aur tab bhi aap galat karte ho, kyunki slip A (9 se 10) aur slip C (10:30 se 11:30) ek doosre ko nahi chhoote, phir bhi slip B (9:45 se 10:45) unhe 9 se 11:30 tak ek thos block mein jod deti hai. Overlap wo cheez nahi hai jise aap ek baar mein do slips judge kar sakte ho jab slips shuffle hon. Fix pehle slips ko start time ke kram mein rakhna hai, phir planner par apni ungli ek baar neeche chalao. Aap dimaag mein ek akela "current busy block" rakhte ho. Har nayi slip ya toh aapke current block ke khatam hone se pehle shuru hoti hai — toh aap block ka end use cover karne ke liye kheenchte ho — ya wo ek gap ke baad shuru hoti hai, toh aap khatam block likh lete ho aur ek naya shuru karte ho. Ek pass, kram mein, aur chain A-B-C sahi tarike se dhah jaati hai kyunki B, C se pehle dekhi jaati hai aur block ko pehle hi 10:30 se aage khench chuki hai. Ek alag sawaal — "mujhe kitne rooms chahiye taaki koi do meetings na takraayein?" — wahi sweep hai, par ek block track karne ke bajaye aap ginte ho ki ek saath kitni slips khuli hain: har start count mein ek jodta hai, har end ek hataata hai, aur count jitna sabse zyaada pahunchta hai wahi aapka jawaab hai.',
    },

    simple: `**Start broken.** Compare every pair of intervals to decide what merges:

\`\`\`js
function mergeBrute(intervals) {
  const merged = intervals.map((iv) => [...iv]);
  for (let i = 0; i < merged.length; i++) {
    for (let j = i + 1; j < merged.length; j++) {
      // do i and j overlap?
      if (merged[i][0] <= merged[j][1] && merged[j][0] <= merged[i][1]) {
        merged[i] = [Math.min(merged[i][0], merged[j][0]),
                     Math.max(merged[i][1], merged[j][1])];
        merged.splice(j, 1);
        j--;                       // recheck this slot
      }
    }
  }
  return merged;
}

console.log(mergeBrute([[1, 4], [2, 5], [5, 9]]));
// depends on input order; O(n^2) with array splicing, and fragile on chains
\`\`\`

It is O(n^2) at best — O(n^3) once you count \`splice\` shifting the array. And the pairwise "do these overlap" test has no notion of order, so whether the chain \`[1,4] - [2,5] - [5,9]\` collapses to one interval depends on the order you happen to visit the pairs.

**The fix: sort by start, then one linear sweep**

\`\`\`js
function merge(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // by START
  const out = [sorted[0].slice()];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);      // overlaps the current block -> extend it
    } else {
      out.push([s, e]);                    // gap -> start a new block
    }
  }
  return out;
}

console.log(merge([[1, 4], [2, 5], [5, 9]]));   // [[1, 9]]
console.log(merge([[1, 3], [8, 10], [2, 6], [15, 18]]));   // [[1, 6], [8, 10], [15, 18]]
\`\`\`

\`\`\`ts
function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0]! - b[0]!);
  const out: number[][] = [sorted[0]!.slice()];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i]!;
    const last = out[out.length - 1]!;
    if (s! <= last[1]!) last[1] = Math.max(last[1]!, e!);
    else out.push([s!, e!]);
  }
  return out;
}
\`\`\`

Sorting by start is what makes the sweep correct. After sorting, any interval that overlaps the current block must overlap it *at the block's right end* — because its start is >= every start already seen. So one comparison, \`s <= last[1]\`, is enough, and the chain collapses automatically because each interval extends \`last[1]\` before the next one is checked. O(n log n) for the sort, O(n) for the sweep.`,

    simpleHi: `**Toote hue se shuru.** Har jodi intervals compare karke tay karo kya merge hota hai:

\`\`\`js
function mergeBrute(intervals) {
  const merged = intervals.map((iv) => [...iv]);
  for (let i = 0; i < merged.length; i++) {
    for (let j = i + 1; j < merged.length; j++) {
      // kya i aur j overlap karte hain?
      if (merged[i][0] <= merged[j][1] && merged[j][0] <= merged[i][1]) {
        merged[i] = [Math.min(merged[i][0], merged[j][0]),
                     Math.max(merged[i][1], merged[j][1])];
        merged.splice(j, 1);
        j--;                       // is slot ko dobara check karo
      }
    }
  }
  return merged;
}

console.log(mergeBrute([[1, 4], [2, 5], [5, 9]]));
// input kram par nirbhar; array splicing ke saath O(n^2), aur chains par kamzor
\`\`\`

Ye best case mein O(n^2) hai — array shift karte \`splice\` ko ginne par O(n^3). Aur jodi waala "kya ye overlap karte hain" test ke paas kram ka koi vichaar nahi, isliye chain \`[1,4] - [2,5] - [5,9]\` ek interval mein dhahti hai ya nahi ye us kram par nirbhar karta hai jismein aap jodiyon ko dekhte ho.

**Fix: start se sort karo, phir ek linear sweep**

\`\`\`js
function merge(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // START se
  const out = [sorted[0].slice()];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);      // current block overlap -> use khencho
    } else {
      out.push([s, e]);                    // gap -> naya block shuru karo
    }
  }
  return out;
}

console.log(merge([[1, 4], [2, 5], [5, 9]]));   // [[1, 9]]
console.log(merge([[1, 3], [8, 10], [2, 6], [15, 18]]));   // [[1, 6], [8, 10], [15, 18]]
\`\`\`

\`\`\`ts
function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0]! - b[0]!);
  const out: number[][] = [sorted[0]!.slice()];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i]!;
    const last = out[out.length - 1]!;
    if (s! <= last[1]!) last[1] = Math.max(last[1]!, e!);
    else out.push([s!, e!]);
  }
  return out;
}
\`\`\`

Start se sort karna wo hai jo sweep ko sahi banaata hai. Sort ke baad, koi bhi interval jo current block ko overlap karta hai use *block ke right end par* overlap karna hi hoga — kyunki iska start pehle dekhe gaye har start se >= hai. Toh ek comparison, \`s <= last[1]\`, kaafi hai, aur chain apne aap dhah jaati hai kyunki har interval agle ke check hone se pehle \`last[1]\` ko khench deta hai. Sort ko O(n log n), sweep ko O(n).`,

    content: `## Three interval questions, one sweep, different sort keys

\`\`\`
MERGE OVERLAPPING            sort by START.  Keep one "current block".
  [[1,3],[2,6],[8,10]]         extend last[1], or push a new block on a gap.
  -> [[1,6],[8,10]]

INSERT ONE INTERVAL          no sort needed if the list is already sorted.
  into a sorted, disjoint     three phases: copy intervals fully before the new
  list                        one, merge everything that overlaps it, copy the rest.

MIN MEETING ROOMS            you do NOT need the interval identities, only the
  (max overlap at any time)    +1 / -1 events. Sort all starts and all ends,
  [[0,30],[5,10],[15,20]]      walk them together; running count's peak = answer.
  -> 2
\`\`\`

The pattern is always "put the boundary events in order, then process them left to right holding a tiny bit of running state." What the state is — a current block, a phase, a counter — is the only thing that changes.

## Insert Interval: the three-phase pass

\`\`\`js
function insert(intervals, newIv) {
  const out = [];
  let i = 0, n = intervals.length;
  const [ns, ne] = newIv;

  // phase 1: everything that ends before newIv starts — untouched
  while (i < n && intervals[i][1] < ns) out.push(intervals[i++]);

  // phase 2: everything that overlaps newIv — absorb into newIv
  let lo = ns, hi = ne;
  while (i < n && intervals[i][0] <= hi) {
    lo = Math.min(lo, intervals[i][0]);
    hi = Math.max(hi, intervals[i][1]);
    i++;
  }
  out.push([lo, hi]);

  // phase 3: everything that starts after newIv ends — untouched
  while (i < n) out.push(intervals[i++]);

  return out;
}
// insert([[1,3],[6,9]], [2,5])  ->  [[1,5],[6,9]]
// insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])  ->  [[1,2],[3,10],[12,16]]
\`\`\`

Because the input is already sorted and disjoint, the overlap test in phase 2 is just \`intervals[i][0] <= hi\` — the same single comparison as merge. Total O(n), no sort.

## Minimum Meeting Rooms: two ways, both are sweeps

\`\`\`js
// WAY 1 — separate the endpoints, walk two sorted arrays
function minRooms(intervals) {
  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);
  const ends   = intervals.map((iv) => iv[1]).sort((a, b) => a - b);
  let rooms = 0, peak = 0, s = 0, e = 0;
  while (s < starts.length) {
    if (starts[s] < ends[e]) { rooms++; s++; peak = Math.max(peak, rooms); }
    else { rooms--; e++; }
  }
  return peak;
}

// WAY 2 — one array of (+1 at start, -1 at end) events
function minRoomsEvents(intervals) {
  const events = [];
  for (const [s, e] of intervals) { events.push([s, 1]); events.push([e, -1]); }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // -1 before +1 at a tie
  let cur = 0, peak = 0;
  for (const [, delta] of events) { cur += delta; peak = Math.max(peak, cur); }
  return peak;
}
\`\`\`

\`\`\`
The tie rule matters. If a meeting ends at 10 and another starts at 10, they do
NOT need two rooms — the room frees up exactly as the next one begins. So at
equal time, process the -1 (end) before the +1 (start). "starts[s] < ends[e]"
in WAY 1 encodes the same rule with a strict "<".
\`\`\`

## The catalogue: recognising an interval problem

\`\`\`
"merge / combine overlapping"            sort by start, sweep, extend-or-push
"insert into a sorted list"              three-phase pass, no sort
"minimum rooms / platforms / machines"   sweep of +1/-1 events, track the peak
"maximum non-overlapping you can keep"   sort by END, greedy (Module 12 lesson 1)
"minimum to REMOVE for no overlap"       = n minus the answer to the line above
"does a new meeting fit?"                binary search the sorted starts
"employee free time / gaps"              merge everything, then read the gaps

Interview tell: the input is a list of [start, end] pairs and the question
mentions overlap, rooms, gaps, or "can they all happen". Sorting is almost
always the first move; the only decision is sort-by-start or sort-by-end.
\`\`\``,

    contentHi: `## Teen interval sawaal, ek sweep, alag sort keys

\`\`\`
MERGE OVERLAPPING            START se sort karo.  Ek "current block" rakho.
  [[1,3],[2,6],[8,10]]         last[1] khencho, ya gap par ek naya block push karo.
  -> [[1,6],[8,10]]

INSERT ONE INTERVAL          agar list pehle se sorted hai toh sort nahi chahiye.
  ek sorted, disjoint list     teen phase: naye se poori tarah pehle waale intervals
  mein                         copy karo, jo overlap karta hai use merge karo, baaki copy karo.

MIN MEETING ROOMS            aapko interval identities nahi chahiye, sirf +1 / -1
  (kisi bhi samay max overlap)  events. Sab starts aur sab ends sort karo, unhe
  [[0,30],[5,10],[15,20]]       saath chalao; running count ka peak = jawaab.
  -> 2
\`\`\`

Pattern hamesha "boundary events ko kram mein rakho, phir unhe left se right process karo thodi si running state rakhte hue" hai. State kya hai — ek current block, ek phase, ek counter — sirf wahi badalta hai.

## Insert Interval: teen-phase pass

\`\`\`js
function insert(intervals, newIv) {
  const out = [];
  let i = 0, n = intervals.length;
  const [ns, ne] = newIv;

  // phase 1: jo sab newIv ke shuru hone se pehle khatam hote hain — achhoote
  while (i < n && intervals[i][1] < ns) out.push(intervals[i++]);

  // phase 2: jo sab newIv ko overlap karte hain — newIv mein sokho
  let lo = ns, hi = ne;
  while (i < n && intervals[i][0] <= hi) {
    lo = Math.min(lo, intervals[i][0]);
    hi = Math.max(hi, intervals[i][1]);
    i++;
  }
  out.push([lo, hi]);

  // phase 3: jo sab newIv ke khatam hone ke baad shuru hote hain — achhoote
  while (i < n) out.push(intervals[i++]);

  return out;
}
// insert([[1,3],[6,9]], [2,5])  ->  [[1,5],[6,9]]
// insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])  ->  [[1,2],[3,10],[12,16]]
\`\`\`

Kyunki input pehle se sorted aur disjoint hai, phase 2 mein overlap test bas \`intervals[i][0] <= hi\` hai — merge jaisa hi ek akela comparison. Kul O(n), koi sort nahi.

## Minimum Meeting Rooms: do tarike, dono sweeps hain

\`\`\`js
// TARIKA 1 — endpoints alag karo, do sorted arrays chalao
function minRooms(intervals) {
  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);
  const ends   = intervals.map((iv) => iv[1]).sort((a, b) => a - b);
  let rooms = 0, peak = 0, s = 0, e = 0;
  while (s < starts.length) {
    if (starts[s] < ends[e]) { rooms++; s++; peak = Math.max(peak, rooms); }
    else { rooms--; e++; }
  }
  return peak;
}

// TARIKA 2 — (start par +1, end par -1) events ka ek array
function minRoomsEvents(intervals) {
  const events = [];
  for (const [s, e] of intervals) { events.push([s, 1]); events.push([e, -1]); }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // tie par -1 pehle +1 se
  let cur = 0, peak = 0;
  for (const [, delta] of events) { cur += delta; peak = Math.max(peak, cur); }
  return peak;
}
\`\`\`

\`\`\`
Tie niyam maayne rakhta hai. Agar ek meeting 10 par khatam hoti hai aur doosri
10 par shuru hoti hai, unhe do rooms NAHI chahiye — room bilkul tab khaali hota
hai jab agli shuru hoti hai. Toh barabar samay par, -1 (end) ko +1 (start) se
pehle process karo. TARIKA 1 mein "starts[s] < ends[e]" wahi niyam ek sakht "<" se deta hai.
\`\`\`

## Catalogue: ek interval problem pehchaanna

\`\`\`
"overlapping merge / combine karo"          start se sort, sweep, extend-ya-push
"ek sorted list mein insert karo"           teen-phase pass, koi sort nahi
"minimum rooms / platforms / machines"      +1/-1 events ka sweep, peak track karo
"maximum non-overlapping jo rakh sako"      END se sort, greedy (Module 12 lesson 1)
"no overlap ke liye minimum HATAO"          = n minus upar waali line ka jawaab
"kya ek nayi meeting fit hoti hai?"         sorted starts ko binary search karo
"employee free time / gaps"                 sab merge karo, phir gaps padho

Interview sanket: input [start, end] jodiyon ki ek list hai aur sawaal overlap,
rooms, gaps, ya "kya wo sab ho sakte hain" ka zikr karta hai. Sorting lagbhag
hamesha pehla kadam hai; ekmatra faisla sort-by-start ya sort-by-end hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: pairwise overlap checks, order-dependent',
        titleHi: 'Toota: jodi waale overlap checks, kram par nirbhar',
        code: `if (a[0] <= b[1] && b[0] <= a[1]) { /* merge a and b */ }
// with no sorted order, a chain a-b-c may or may not collapse`,
        codeJs: `function mergeBrute(intervals) {
  const m = intervals.map((iv) => [...iv]);
  for (let i = 0; i < m.length; i++)
    for (let j = i + 1; j < m.length; j++)
      if (m[i][0] <= m[j][1] && m[j][0] <= m[i][1]) {
        m[i] = [Math.min(m[i][0], m[j][0]), Math.max(m[i][1], m[j][1])];
        m.splice(j, 1); j--;
      }
  return m;
}
console.log(mergeBrute([[1, 4], [2, 5], [5, 9]]));
console.log(mergeBrute([[5, 9], [1, 4], [2, 5]]));   // same set, different order`,
        codeTs: `function mergeBrute(intervals: number[][]): number[][] {
  const m = intervals.map((iv) => [...iv]);
  for (let i = 0; i < m.length; i++)
    for (let j = i + 1; j < m.length; j++)
      if (m[i][0]! <= m[j][1]! && m[j][0]! <= m[i][1]!) {
        m[i] = [Math.min(m[i][0]!, m[j][0]!), Math.max(m[i][1]!, m[j][1]!)];
        m.splice(j, 1); j--;
      }
  return m;
}`,
        outputJs: `[ [ 1, 9 ] ]
[ [ 1, 9 ] ]`,
        outputTs: `// Correct here, but O(n^2)+splice, and brittle: a re-check loop is doing the
// work that a single sorted pass does cleanly.`,
        explain: 'This particular input happens to converge, but the algorithm relies on the j-- re-check loop to patch up chains, is O(n^2) before the splice cost, and gives no guarantee on inputs where three intervals only connect transitively through a fourth seen later.',
        explainHi: 'Ye khaas input samyog se converge hota hai, par algorithm chains theek karne ke liye j-- re-check loop par nirbhar hai, splice cost se pehle O(n^2) hai, aur un inputs par koi guarantee nahi deta jahaan teen intervals sirf baad mein dekhe gaye chauthe ke zariye transitively judte hain.',
      },
      {
        title: 'Fixed: sort by start, one sweep',
        titleHi: 'Theek: start se sort, ek sweep',
        code: `sorted.sort((a, b) => a[0] - b[0]);
if (s <= last[1]) last[1] = Math.max(last[1], e);   // extend
else out.push([s, e]);                              // new block`,
        codeJs: `function merge(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    const last = out[out.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}
console.log(merge([[1, 4], [2, 5], [5, 9]]));
console.log(merge([[1, 3], [8, 10], [2, 6], [15, 18]]));
console.log(merge([[1, 4], [4, 5]]));   // touching endpoints count as overlap`,
        codeTs: `function merge(intervals: number[][]): number[][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0]! - b[0]!);
  const out: number[][] = [sorted[0]!.slice()];
  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i]!;
    const last = out[out.length - 1]!;
    if (s! <= last[1]!) last[1] = Math.max(last[1]!, e!);
    else out.push([s!, e!]);
  }
  return out;
}`,
        outputJs: `[ [ 1, 9 ] ]
[ [ 1, 6 ], [ 8, 10 ], [ 15, 18 ] ]
[ [ 1, 5 ] ]`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'After sorting by start, the only interval that can extend the current block is the next one, and it can only touch the block at its right end. So "s <= last[1]" is the whole overlap test, and chains collapse because each interval updates last[1] before the next check.',
        explainHi: 'Start se sort karne ke baad, ekmatra interval jo current block ko khench sakta hai wo agla hai, aur wo block ko sirf iske right end par chhoo sakta hai. Toh "s <= last[1]" poora overlap test hai, aur chains dhah jaati hain kyunki har interval agle check se pehle last[1] update karta hai.',
      },
      {
        title: 'Minimum meeting rooms: the +1 / -1 event sweep',
        titleHi: 'Minimum meeting rooms: +1 / -1 event sweep',
        code: `events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // -1 before +1 at a tie
cur += delta; peak = Math.max(peak, cur);`,
        codeJs: `function minRoomsEvents(intervals) {
  const events = [];
  for (const [s, e] of intervals) { events.push([s, 1]); events.push([e, -1]); }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0, peak = 0;
  for (const [, delta] of events) { cur += delta; peak = Math.max(peak, cur); }
  return peak;
}
console.log(minRoomsEvents([[0, 30], [5, 10], [15, 20]]));   // 2
console.log(minRoomsEvents([[7, 10], [2, 4]]));              // 1
console.log(minRoomsEvents([[1, 5], [5, 9], [9, 12]]));      // 1 (back-to-back)`,
        codeTs: `function minRoomsEvents(intervals: number[][]): number {
  const events: number[][] = [];
  for (const [s, e] of intervals) { events.push([s!, 1]); events.push([e!, -1]); }
  events.sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!);
  let cur = 0, peak = 0;
  for (const [, delta] of events) { cur += delta!; peak = Math.max(peak, cur); }
  return peak;
}`,
        outputJs: `2
1
1`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Each meeting becomes a +1 at its start and a -1 at its end. Sorted by time (ends before starts on a tie so a room can be reused instantly), the running count is how many meetings are live, and its peak is the fewest rooms that could ever have covered them.',
        explainHi: 'Har meeting apne start par ek +1 aur apne end par ek -1 ban jaati hai. Samay se sorted (tie par ends starts se pehle taaki ek room turant reuse ho), running count ye hai ki kitni meetings live hain, aur iska peak wo sabse kam rooms hai jo unhe kabhi cover kar sakte the.',
      },
    ],

    mistakes: [
      {
        wrong: `// merging without sorting first
const out = [intervals[0].slice()];
for (let i = 1; i < intervals.length; i++) { /* compare to out's last */ }
// [[1,4],[8,10],[2,6]] -> [2,6] is checked against [8,10], never against [1,4]`,
        right: `const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
// now every interval that could merge with the current block comes next`,
        why: 'The sweep only ever compares against the last block in the output. That is correct only if intervals arrive in start order — otherwise an interval that belongs with an earlier block is compared against a later one and wrongly pushed as separate.',
        whyHi: 'Sweep sirf output ke aakhri block ke against compare karta hai. Wo sirf tab sahi hai jab intervals start kram mein aayein — warna ek interval jo ek pehle block ke saath hai use ek baad ke block se compare kiya jaata hai aur galat tarike se alag push hota hai.',
      },
      {
        wrong: `// treating touching intervals as a gap
if (s < last[1]) last[1] = Math.max(last[1], e);   // strict <
else out.push([s, e]);
// [[1,4],[4,5]] -> [[1,4],[4,5]] instead of [[1,5]]`,
        right: `if (s <= last[1]) last[1] = Math.max(last[1], e);   // <= : [4,5] touches [1,4]`,
        why: 'Whether [1,4] and [4,5] merge depends on the problem\'s definition of overlap. Most interval-merge problems treat a shared endpoint as overlapping (closed intervals), so use <=. Read the problem: if intervals are half-open [s, e), then < is right. Pick one and be consistent.',
        whyHi: 'Kya [1,4] aur [4,5] merge hote hain ye problem ki overlap ki paribhaasha par nirbhar karta hai. Adhikaansh interval-merge problems ek saanjhe endpoint ko overlapping maante hain (closed intervals), isliye <= istemal karo. Problem padho: agar intervals half-open [s, e) hain, toh < sahi hai. Ek chuno aur consistent raho.',
      },
      {
        wrong: `// meeting rooms: putting +1 before -1 at equal times
events.sort((a, b) => a[0] - b[0] || b[1] - a[1]);   // +1 first on a tie
// [[1,5],[5,9]] -> reports 2 rooms when 1 is enough`,
        right: `events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // -1 (end) first on a tie`,
        why: 'A meeting ending at time t frees its room exactly at t, so a meeting starting at t can reuse it. Processing the +1 before the -1 double-counts that instant and inflates the room count by one whenever meetings are back-to-back.',
        whyHi: 'Samay t par khatam hone waali ek meeting apna room bilkul t par khaali karti hai, isliye t par shuru hone waali ek meeting use reuse kar sakti hai. -1 se pehle +1 process karna us pal ko dugna ginta hai aur jab bhi meetings back-to-back hon room count ek se badha deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Calendar apps** merge your busy blocks across multiple calendars to show free/busy, and compute "smallest number of rooms" for a set of bookings — both are this exact sweep.',
        hi: '**Calendar apps** aapke busy blocks ko kayi calendars mein merge karte hain free/busy dikhaane ke liye, aur bookings ke ek set ke liye "sabse kam rooms" compute karte hain — dono ye bilkul yahi sweep hain.',
      },
      {
        en: '**Genomics** merges overlapping read alignments or feature regions on a chromosome; a whole-genome dataset has millions of intervals, so the O(n log n) sort-and-sweep is the only feasible approach.',
        hi: '**Genomics** ek chromosome par overlapping read alignments ya feature regions merge karta hai; ek whole-genome dataset mein laakhon intervals hote hain, isliye O(n log n) sort-and-sweep hi ekmatra sambhav tarika hai.',
      },
      {
        en: '**Cloud cost and capacity planning** sweeps VM lease intervals to find the peak concurrent instance count — the exact "minimum meeting rooms" computation, deciding how much capacity to reserve.',
        hi: '**Cloud cost aur capacity planning** VM lease intervals ko sweep karta hai peak concurrent instance count dhoondhne ke liye — bilkul "minimum meeting rooms" ganana, ye tay karte hue kitni capacity reserve karni hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does merging intervals require sorting, and why is sorting by start (not end) the right choice?',
        qHi: 'Intervals merge karne ke liye sorting kyun zaroori hai, aur start se sort karna (end se nahi) sahi chunaav kyun hai?',
        a: 'The merge sweep works by keeping a single "current block" and, for each new interval, either extending that block or closing it and starting a fresh one. That logic is only sound if you can guarantee that once you close a block, nothing you see later belongs in it. Sorting by start time gives exactly that guarantee: after sorting, every interval you have not yet processed has a start time greater than or equal to every start you have seen. So if the next interval\'s start is beyond the current block\'s end, there is a real gap, and no later interval — which starts even further right — can bridge it. You can safely close the block. Without sorting, you might close a block at, say, position 4, and then encounter an interval starting at 2 that should have been merged in, and the sweep has no mechanism to go back. As for start versus end: the merge sweep compares each new interval\'s start against the current block\'s end, and it needs the intervals delivered in the order their left edges appear on the number line, because that is the order in which they can attach to or fall past the growing block. Sorting by end would group intervals by where they finish, which tells you nothing about whether an interval that finishes early might still start early enough to overlap something. Sorting by end is the right key for a different interval problem — selecting the maximum number of non-overlapping intervals, the classic activity-selection greedy — because there the decision is "which interval frees me up soonest for the next pick". Different question, different key. The rule of thumb: sort by start when you are combining or covering intervals, sort by end when you are choosing among them.',
        aHi: 'Merge sweep ek akela "current block" rakhkar kaam karta hai aur, har naye interval ke liye, ya toh us block ko khench deta hai ya use band karke ek naya shuru karta hai. Wo logic tabhi sahi hai jab aap guarantee kar sako ki ek baar aap ek block band karte ho, jo aap baad mein dekhoge wo usmein nahi hai. Start time se sort karna bilkul wahi guarantee deta hai: sort ke baad, har interval jise aapne abhi process nahi kiya uska start time har dekhe gaye start se bada ya barabar hai. Toh agar agle interval ka start current block ke end se aage hai, ek asli gap hai, aur koi baad ka interval — jo aur bhi daayen shuru hota hai — use jod nahi sakta. Aap block surakshit roop se band kar sakte ho. Bina sort ke, aap ek block position 4 par band kar sakte ho, aur phir 2 par shuru hone waala ek interval mile jise merge hona chahiye tha, aur sweep ke paas wapas jaane ka koi tantra nahi. Start versus end ke baare mein: merge sweep har naye interval ke start ko current block ke end ke against compare karta hai, aur ise intervals us kram mein chahiye jismein unke left edges number line par dikhte hain. End se sort karna intervals ko group karega ki wo kahaan khatam hote hain, jo aapko kuch nahi batata ki kya ek interval jo jaldi khatam hota hai wo abhi bhi itni jaldi shuru ho sakta hai ki kuch overlap kare. End se sort ek alag interval problem ke liye sahi key hai — maximum non-overlapping intervals chunna, classic activity-selection greedy. Angootha niyam: intervals combine ya cover karte waqt start se sort karo, unmein se chunte waqt end se sort karo.',
      },
      {
        q: 'Solve "minimum meeting rooms" and explain why the answer equals the maximum number of intervals overlapping at any single instant.',
        qHi: '"Minimum meeting rooms" solve karo aur samjhaao ki jawaab kisi ek pal par overlap karne waale intervals ki maximum tadaad ke barabar kyun hai.',
        a: 'The claim is that the minimum number of rooms you need equals the largest number of meetings that are simultaneously in progress at any moment. Both directions of that equality are easy to see. First, you clearly need at least that many rooms: if there is an instant when k meetings are all happening, those k meetings are pairwise in conflict at that instant, so they must all be in different rooms, so k rooms are necessary. Second, that many rooms are also sufficient: process the meetings in start-time order and always assign an incoming meeting to any room that is currently free; you only ever fail to find a free room if every room is occupied, which means k meetings including the new one are live at that moment, which means the peak overlap is at least k plus one — so if the peak is k, k rooms never run out. That reduces the problem to computing the peak overlap, and the clean way to do that is a sweep. Turn each meeting into two events: a plus one at its start time and a minus one at its end time. Sort all events by time, and at equal times put the minus one before the plus one, because a room vacated at exactly time t is available for a meeting starting at t. Then walk the sorted events maintaining a running sum; the sum at any point is the number of meetings currently in progress, and the maximum value the sum reaches is the peak overlap, which is the answer. Sorting the events dominates the cost at O of n log n, and the walk is O of n. An equivalent formulation sorts the start times and end times into two separate arrays and advances two pointers, incrementing a counter when the next event is a start and decrementing when it is an end; that avoids building the combined event array but is the same sweep.',
        aHi: 'Daawa ye hai ki aapko chahiye minimum rooms ki tadaad kisi bhi pal ek saath chal rahi meetings ki sabse badi tadaad ke barabar hai. Us barabari ki dono dishaayein aasaan hain. Pehle, aapko spasht roop se kam se kam utne rooms chahiye: agar ek pal hai jab k meetings sab ho rahi hain, wo k meetings us pal jodi mein conflict mein hain, isliye unhe sab alag rooms mein hona chahiye, isliye k rooms zaroori hain. Doosre, utne rooms kaafi bhi hain: meetings ko start-time kram mein process karo aur hamesha ek aati meeting ko kisi bhi room ko assign karo jo abhi khaali hai; aap ek free room dhoondhne mein sirf tab fail hote ho jab har room bhara hai, jiska matlab naye sameet k meetings us pal live hain, jiska matlab peak overlap kam se kam k plus ek hai — toh agar peak k hai, k rooms kabhi khatam nahi hote. Wo problem ko peak overlap compute karne tak ghata deta hai, aur uske liye saaf tarika ek sweep hai. Har meeting ko do events banao: iske start time par ek plus ek aur iske end time par ek minus ek. Sab events ko samay se sort karo, aur barabar samay par minus ek ko plus ek se pehle rakho, kyunki bilkul samay t par khaali hua room t par shuru hone waali meeting ke liye upalabdh hai. Phir sorted events ko chalao ek running sum rakhte hue; kisi bhi bindu par sum abhi chal rahi meetings ki tadaad hai, aur sum jo maximum value pahunchta hai wo peak overlap hai, jo jawaab hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement merge(intervals) and verify: [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]], [[1,4],[4,5]] -> [[1,5]], and [[1,4],[2,3]] -> [[1,4]] (fully contained). Then run it on the same set in three shuffled orders and confirm the output is identical.',
        taskHi: 'merge(intervals) implement karo aur verify karo: [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]], [[1,4],[4,5]] -> [[1,5]], aur [[1,4],[2,3]] -> [[1,4]] (poori tarah andar). Phir ise usi set par teen shuffled kramon mein chalao aur confirm karo ki output samaan hai.',
        hint: 'The fully-contained case [[1,4],[2,3]] works because Math.max(last[1], e) keeps the larger end — [2,3] does not shrink the block. Sorting makes all three shuffles converge to the same answer.',
        hintHi: 'Poori-tarah-andar case [[1,4],[2,3]] kaam karta hai kyunki Math.max(last[1], e) bade end ko rakhta hai — [2,3] block ko chhota nahi karta. Sorting teenon shuffles ko usi jawaab par le aata hai.',
      },
      {
        task: 'Implement insert(intervals, newInterval) with the three-phase pass. Verify insert([[1,3],[6,9]], [2,5]) -> [[1,5],[6,9]] and insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) -> [[1,2],[3,10],[12,16]]. Confirm it never calls sort.',
        taskHi: 'insert(intervals, newInterval) ko teen-phase pass ke saath implement karo. Verify karo insert([[1,3],[6,9]], [2,5]) -> [[1,5],[6,9]] aur insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) -> [[1,2],[3,10],[12,16]]. Confirm karo ki ye kabhi sort call nahi karta.',
        hint: 'Phase 2\'s condition is intervals[i][0] <= hi, where hi grows as you absorb intervals. The second test case absorbs [3,5], [6,7], and [8,10] into [4,8], ending as [3,10].',
        hintHi: 'Phase 2 ki condition intervals[i][0] <= hi hai, jahaan hi badhta hai jab aap intervals sokhte ho. Doosra test case [3,5], [6,7], aur [8,10] ko [4,8] mein sokhta hai, [3,10] ke roop mein khatam hote hue.',
      },
      {
        task: 'Implement minRooms two ways — the two-sorted-arrays version and the +1/-1 events version — and confirm both give 2 for [[0,30],[5,10],[15,20]] and 1 for [[1,5],[5,9],[9,12]]. Then flip the tie-break to process +1 before -1 and observe the back-to-back case wrongly reporting 2.',
        taskHi: 'minRooms ko do tarikon se implement karo — do-sorted-arrays version aur +1/-1 events version — aur confirm karo ki dono [[0,30],[5,10],[15,20]] ke liye 2 aur [[1,5],[5,9],[9,12]] ke liye 1 dete hain. Phir tie-break ko palto taaki +1 -1 se pehle process ho aur back-to-back case ko galat tarike se 2 batate hue dekho.',
        hint: 'Back-to-back meetings [1,5] and [5,9] share the instant t=5. With -1 first, the count drops to 0 then rises to 1 — peak 1. With +1 first, it rises to 2 before dropping — peak 2, wrong.',
        hintHi: 'Back-to-back meetings [1,5] aur [5,9] pal t=5 share karti hain. -1 pehle ke saath, count 0 tak girta hai phir 1 tak uthta hai — peak 1. +1 pehle ke saath, ye girne se pehle 2 tak uthta hai — peak 2, galat.',
      },
    ],

    keyTakeaways: [
      'Merge overlapping intervals: sort by START, then one sweep keeping a "current block" — extend last[1] when the next start is <= it, else push a new block. O(n log n).',
      'Sorting is what makes the single comparison "s <= last[1]" a complete overlap test: after sorting, an overlapping interval can only touch the block at its right end, and chains collapse because each interval extends last[1] before the next check.',
      'Use <= (not <) if a shared endpoint counts as overlap (closed intervals [s, e]); use < for half-open [s, e). Decide from the problem and stay consistent.',
      'Insert Interval into a sorted disjoint list is a three-phase O(n) pass with no sort: copy intervals ending before the new one, absorb every interval overlapping it, copy the rest.',
      'Minimum meeting rooms = the maximum number of intervals overlapping at any instant. Compute it with a +1-at-start / -1-at-end event sweep, tracking the running count\'s peak.',
      'In the room sweep, process -1 (end) before +1 (start) at equal times — a room frees exactly when a meeting ends, so a back-to-back meeting reuses it.',
      'Interval problems: sort by START to combine/cover, sort by END to choose among them (max non-overlapping = activity selection, Module 12 lesson 1).',
    ],
    keyTakeawaysHi: [
      'Overlapping intervals merge karo: START se sort karo, phir ek sweep "current block" rakhte hue — jab agla start iske <= ho toh last[1] khencho, warna ek naya block push karo. O(n log n).',
      'Sorting wo hai jo ek akele comparison "s <= last[1]" ko ek poora overlap test banaati hai: sort ke baad, ek overlapping interval block ko sirf iske right end par chhoo sakta hai, aur chains dhah jaati hain kyunki har interval agle check se pehle last[1] khenchta hai.',
      '<= istemal karo (< nahi) agar ek saanjha endpoint overlap ginta hai (closed intervals [s, e]); half-open [s, e) ke liye < istemal karo. Problem se tay karo aur consistent raho.',
      'Ek sorted disjoint list mein Insert Interval ek teen-phase O(n) pass hai bina sort ke: naye se pehle khatam hone waale intervals copy karo, ise overlap karne waala har interval sokho, baaki copy karo.',
      'Minimum meeting rooms = kisi bhi pal overlap karne waale intervals ki maximum tadaad. Ise ek +1-start-par / -1-end-par event sweep se compute karo, running count ka peak track karte hue.',
      'Room sweep mein, barabar samay par -1 (end) ko +1 (start) se pehle process karo — ek room bilkul tab khaali hota hai jab ek meeting khatam hoti hai, isliye ek back-to-back meeting use reuse karti hai.',
      'Interval problems: combine/cover karne ko START se sort karo, unmein se chunne ko END se sort karo (max non-overlapping = activity selection, Module 12 lesson 1).',
    ],
  },
];
