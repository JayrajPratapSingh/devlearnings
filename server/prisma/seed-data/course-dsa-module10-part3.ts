/**
 * DSA Complete Course — Module 10: Sorting & Searching, lesson 3.
 *
 * Binary search on a sorted array, and the boundary bugs that make it one of the
 * most-failed "easy" problems. Builds on this course's Module 2 (a sorted array
 * as the precondition) and Module 7 (a BST is binary search over a tree). Broken
 * example: a binary search whose loop condition and bound updates do not agree
 * with each other — using `lo < hi` but writing `hi = mid` in a way that never
 * makes progress, so on some inputs `lo` and `hi` get stuck one apart and the
 * loop spins forever; and computing `mid = (lo + hi) / 2` which overflows for
 * large indices in fixed-width integer languages. Fixed with one canonical
 * template: half-open interval, `lo < hi`, `mid = lo + (hi - lo) / 2`, and
 * bound updates (`lo = mid + 1` / `hi = mid`) that provably shrink the interval
 * every iteration so the loop always terminates.
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

export const DSA_MODULE_10_PART3: CourseLesson[] = [
  {
    slug: 'binary-search-canonical-template',
    title: 'Binary Search: The Template That Actually Terminates',
    titleHi: 'Binary Search: Wo Template Jo Sach Mein Terminate Hota Hai',
    description: 'A binary search that looks right but hangs on certain inputs. The loop uses one boundary convention while the index updates use another, so the search interval stops shrinking, `lo` and `hi` freeze one apart, and the loop runs forever. Separately, `mid = (lo + hi) / 2` silently overflows once the array is large enough.',
    descriptionHi: 'Ek binary search jo sahi dikhti hai par kuch inputs par hang ho jaati hai. Loop ek boundary convention istemal karta hai jabki index updates doosra, isliye search interval shrink hona band ho jaata hai, `lo` aur `hi` ek-doosre se ek door freeze ho jaate hain, aur loop hamesha chalta hai. Alag se, `mid = (lo + hi) / 2` chupchaap overflow ho jaata hai ek baar array kaafi bada ho.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Finding a word in a physical dictionary by always opening to the middle of the pages you have not ruled out.** You open near the middle; the word you want is alphabetically after the page you opened to, so you know it is somewhere in the right-hand block of pages, and you mentally discard the left-hand block including the page you just checked. Repeat with the remaining block. This works and is fast as long as each step genuinely removes pages from consideration. The bug people make is the equivalent of, after checking a page and deciding "it is in the right-hand block", keeping that just-checked page in the right-hand block for next time. Now the block never actually gets smaller past a certain point — you keep re-opening the same page, concluding the same thing, and never finishing. The fix is a strict rule about which pages survive each step: when you rule out a direction, the page you tested goes with the discarded side, never the kept side, so the stack of candidate pages is provably one thinner every single time and you always reach a single page.',
      hi: '**Ek physical dictionary mein ek shabd dhoondhna hamesha un pages ke beech kholkar jinhe aapne rule out nahi kiya.** Aap beech ke paas kholte ho; jo shabd aap chahte ho wo us page se alphabetically baad hai jispar aap khole, isliye aap jaante ho ye right-hand block of pages mein kahin hai, aur aap mentally left-hand block discard karte ho jismein wo page bhi hai jise aapne abhi check kiya. Baaki block ke saath dohraao. Ye kaam karta hai aur tez hai jab tak har step sach mein pages ko vichaar se hataata hai. Bug jo log karte hain wo iske barabar hai, ek page check karne aur "ye right-hand block mein hai" tay karne ke baad, us abhi-check kiye page ko agli baar ke liye right-hand block mein rakhna. Ab block ek bindu ke baad kabhi asal mein chhota nahi hota — aap wahi page dobara kholte rehte ho, wahi nishkarsh nikaalte ho, aur kabhi khatam nahi karte. Fix ek sakht rule hai ki har step kaunse pages bachte hain: jab aap ek direction rule out karte ho, jo page aapne test kiya wo discarded side ke saath jaata hai, kabhi kept side ke saath nahi, isliye candidate pages ka stack har baar ek patla hota hai aur aap hamesha ek akele page tak pahunchte ho.',
    },

    simple: `**Start broken.** A binary search where the loop condition and the updates disagree:

\`\`\`js
function searchBroken(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {                        // closed interval convention: hi is a valid index
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid;         // BUG: should be mid + 1
    else hi = mid - 1;
  }
  return a[lo] === target ? lo : -1;
}
\`\`\`

When \`lo\` and \`hi\` are adjacent (\`hi = lo + 1\`), \`mid = Math.floor((lo + hi) / 2) = lo\`. If \`a[lo] < target\`, the update \`lo = mid\` sets \`lo = lo\` — no change. \`hi\` does not move either. The interval \`[lo, hi]\` is frozen at width 1 and the loop spins forever. Also, \`(lo + hi)\` can exceed the maximum safe integer in fixed-width languages (Java, C++) once indices get into the billions — a real, shipped bug in widely-used libraries.

**The fix: one canonical half-open template**

\`\`\`js
// Returns the index of target, or -1. Half-open interval [lo, hi):
// hi is ONE PAST the last candidate, so the answer is always in [lo, hi).
function binarySearch(a, target) {
  let lo = 0, hi = a.length;               // hi = length, not length - 1
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);     // no overflow: hi - lo fits, then halve
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;     // target is strictly right of mid
    else hi = mid;                         // target is at or left of mid; drop mid..hi-1
  }
  return -1;
}
\`\`\`

\`\`\`ts
function binarySearch(a: number[], target: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    const v = a[mid]!;
    if (v === target) return mid;
    if (v < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}
\`\`\`

Three rules make this always terminate and always be correct:

1. **Half-open interval \`[lo, hi)\`** — \`hi\` starts at \`a.length\`, one past the end. The candidate set is exactly the indices \`lo\` up to but not including \`hi\`.
2. **\`mid = lo + ((hi - lo) >> 1)\`** — never adds two large numbers, so no overflow. \`mid\` is always in \`[lo, hi)\` and, when \`hi - lo >= 2\`, strictly less than \`hi - 1\`, so both branches make progress.
3. **Updates that always shrink the interval**: \`lo = mid + 1\` moves \`lo\` strictly right; \`hi = mid\` moves \`hi\` strictly left (since \`mid < hi\`). Every iteration removes at least one index, so the loop runs at most \`log2(n)\` times and cannot hang.`,

    simpleHi: `**Toote hue se shuru.** Ek binary search jahaan loop condition aur updates asahmat hain:

\`\`\`js
function searchBroken(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {                        // closed interval convention: hi ek valid index hai
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid;         // BUG: mid + 1 hona chahiye
    else hi = mid - 1;
  }
  return a[lo] === target ? lo : -1;
}
\`\`\`

Jab \`lo\` aur \`hi\` adjacent hain (\`hi = lo + 1\`), \`mid = Math.floor((lo + hi) / 2) = lo\`. Agar \`a[lo] < target\`, update \`lo = mid\` \`lo = lo\` set karta hai — koi badlaav nahi. \`hi\` bhi nahi hilta. Interval \`[lo, hi]\` width 1 par frozen hai aur loop hamesha chalta hai. Saath hi, \`(lo + hi)\` fixed-width languages (Java, C++) mein maximum safe integer se zyaada ho sakta hai ek baar indices billions mein aa jaayein — ek asli, shipped bug widely-used libraries mein.

**Fix: ek canonical half-open template**

\`\`\`js
// target ka index return karta hai, ya -1. Half-open interval [lo, hi):
// hi aakhri candidate se EK AAGE hai, isliye jawaab hamesha [lo, hi) mein hai.
function binarySearch(a, target) {
  let lo = 0, hi = a.length;               // hi = length, length - 1 nahi
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);     // koi overflow nahi: hi - lo fit hota hai, phir halve
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;     // target mid ke sakhti se right hai
    else hi = mid;                         // target mid par ya left hai; mid..hi-1 drop karo
  }
  return -1;
}
\`\`\`

\`\`\`ts
function binarySearch(a: number[], target: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    const v = a[mid]!;
    if (v === target) return mid;
    if (v < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}
\`\`\`

Teen rules ise hamesha terminate aur hamesha sahi banaate hain:

1. **Half-open interval \`[lo, hi)\`** — \`hi\` \`a.length\` par shuru hota hai, end se ek aage. Candidate set bilkul indices \`lo\` se \`hi\` tak par ise include nahi karte.
2. **\`mid = lo + ((hi - lo) >> 1)\`** — kabhi do bade numbers add nahi karta, isliye koi overflow nahi. \`mid\` hamesha \`[lo, hi)\` mein hai aur, jab \`hi - lo >= 2\`, sakhti se \`hi - 1\` se kam, isliye dono branches progress karti hain.
3. **Updates jo hamesha interval shrink karte hain**: \`lo = mid + 1\` \`lo\` ko sakhti se right move karta hai; \`hi = mid\` \`hi\` ko sakhti se left move karta hai (kyunki \`mid < hi\`). Har iteration kam se kam ek index hataati hai, isliye loop zyaada se zyaada \`log2(n)\` baar chalta hai aur hang nahi ho sakta.`,

    content: `## lower_bound and upper_bound: the versions you actually want

\`\`\`js
// lower_bound: index of the FIRST element >= target
// (= where target would be inserted to keep the array sorted, leftmost)
function lowerBound(a, target) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] < target) lo = mid + 1;   // mid is too small — target is strictly right
    else hi = mid;                       // a[mid] >= target — mid might be the answer, keep it in range
  }
  return lo;
}

// upper_bound: index of the FIRST element > target
function upperBound(a, target) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] <= target) lo = mid + 1;  // <= now: skip past equal elements too
    else hi = mid;
  }
  return lo;
}
\`\`\`

These two are more useful than plain "find target" because they compose:

\`\`\`js
const count = upperBound(a, x) - lowerBound(a, x);   // how many times x appears
const exists = lowerBound(a, x) < a.length && a[lowerBound(a, x)] === x;
const firstGreater = upperBound(a, x);               // insertion point after all copies of x
\`\`\`

Notice neither has an \`=== target\` early return. They just keep halving until \`lo === hi\`, and \`lo\` is the boundary. Removing the early return actually makes the code simpler and the termination argument cleaner — there is exactly one exit.

## Why the closed-interval version is a bug magnet

\`\`\`
Closed interval [lo, hi] where hi is a valid index:
  - loop must be  while (lo <= hi)   (so a 1-element range is still checked)
  - updates must be  lo = mid + 1  AND  hi = mid - 1   (both step past mid)
  - the "not found" exit is when lo > hi

Get ANY of these three slightly wrong and you get an infinite loop or an
off-by-one. The half-open version has fewer moving parts: while (lo < hi),
lo = mid + 1, hi = mid, done.
\`\`\`

Both conventions can be made correct; the half-open one is recommended because its three rules reinforce each other and there is one obvious loop invariant ("the answer, if any, is in \`[lo, hi)\`") that stays true from start to finish.

## Binary search is a special case of BST search

\`\`\`
Module 7's BST search:  at each node, go left if target < node.value, else right.
Binary search:          at each step, discard the left half if a[mid] < target,
                        else discard the right half.

Both halve the search space per comparison. The BST stores the "which half"
decisions as tree structure; binary search recomputes them with index arithmetic
on a flat sorted array. Same O(log n), same core idea.
\`\`\`

## The precondition: the array must be sorted (by the key you compare)

\`\`\`js
// binary search on an UNSORTED array returns garbage, silently — it does not error.
binarySearch([3, 1, 4, 1, 5, 9], 4);   // may return -1 even though 4 is present

// binary search on an array sorted by a DIFFERENT key is equally broken:
// records sorted by name, then binarySearch by age -> wrong
\`\`\`

Binary search's correctness rests entirely on the invariant "everything left of \`mid\` is \`<= a[mid]\` and everything right is \`>= a[mid]\`". If the array is not sorted by the comparison key, that invariant is false and every "discard half" step can throw away the element you are looking for.`,

    contentHi: `## lower_bound aur upper_bound: wo versions jo aap asal mein chahte ho

\`\`\`js
// lower_bound: PEHLE element ka index jo >= target hai
// (= jahaan target insert hoga array ko sorted rakhne ke liye, leftmost)
function lowerBound(a, target) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] < target) lo = mid + 1;   // mid bahut chhota hai — target sakhti se right hai
    else hi = mid;                       // a[mid] >= target — mid jawaab ho sakta hai, ise range mein rakho
  }
  return lo;
}

// upper_bound: PEHLE element ka index jo > target hai
function upperBound(a, target) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] <= target) lo = mid + 1;  // ab <=: barabar elements ke aage bhi skip karo
    else hi = mid;
  }
  return lo;
}
\`\`\`

Ye do plain "find target" se zyaada upyogi hain kyunki ye compose hote hain:

\`\`\`js
const count = upperBound(a, x) - lowerBound(a, x);   // x kitni baar aata hai
const exists = lowerBound(a, x) < a.length && a[lowerBound(a, x)] === x;
const firstGreater = upperBound(a, x);               // x ki sab copies ke baad insertion point
\`\`\`

Dhyaan do kisi ke paas \`=== target\` early return nahi hai. Wo bas halve karte rehte hain jab tak \`lo === hi\`, aur \`lo\` boundary hai. Early return hataana asal mein code ko saral aur termination argument ko saaf banaata hai — bilkul ek exit hai.

## Closed-interval version ek bug magnet kyun hai

\`\`\`
Closed interval [lo, hi] jahaan hi ek valid index hai:
  - loop  while (lo <= hi)  hona chahiye  (taaki ek 1-element range abhi bhi check ho)
  - updates  lo = mid + 1  AUR  hi = mid - 1  hone chahiye  (dono mid ke aage step)
  - "not found" exit tab hai jab lo > hi

In teenon mein se KOI thoda galat karo aur aapko ek infinite loop ya ek
off-by-one milta hai. Half-open version ke kam moving parts hain: while (lo < hi),
lo = mid + 1, hi = mid, done.
\`\`\`

Dono conventions sahi banaayi jaa sakti hain; half-open waali recommend ki jaati hai kyunki iske teen rules ek doosre ko reinforce karte hain aur ek spasht loop invariant hai ("jawaab, agar koi hai, \`[lo, hi)\` mein hai") jo shuru se ant tak sach rehta hai.

## Binary search BST search ka ek khaas case hai

\`\`\`
Module 7 ka BST search:  har node par, left jao agar target < node.value, warna right.
Binary search:           har step par, left half discard karo agar a[mid] < target,
                         warna right half discard karo.

Dono prati comparison search space halve karte hain. BST "kaunsa half" decisions ko
tree structure ki tarah store karta hai; binary search unhe ek flat sorted array par
index arithmetic se recompute karta hai. Wahi O(log n), wahi core idea.
\`\`\`

## Precondition: array sorted hona chahiye (us key se jise aap compare karte ho)

\`\`\`js
// ek UNSORTED array par binary search kachra return karta hai, chupchaap — ye error nahi deta.
binarySearch([3, 1, 4, 1, 5, 9], 4);   // -1 return kar sakta hai chahe 4 maujood hai

// ek DOOSRI key se sorted array par binary search bilkul toota hai:
// records name se sorted, phir age se binarySearch -> galat
\`\`\`

Binary search ki correctness poori tarah invariant "mid ke left mein sab kuch <= a[mid] hai aur right mein sab kuch >= a[mid] hai" par tiki hai. Agar array comparison key se sorted nahi hai, wo invariant false hai aur har "discard half" step us element ko phenk sakta hai jise aap dhoondh rahe ho.`,

    examples: [
      {
        title: 'Broken: lo = mid (not mid + 1) causes an infinite loop',
        titleHi: 'Toota: lo = mid (mid + 1 nahi) ek infinite loop ka kaaran banta hai',
        code: `while (lo < hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (a[mid] < target) lo = mid;   // when hi = lo + 1, mid = lo, lo = lo -> no progress
  else hi = mid - 1;
}`,
        codeJs: `function searchBroken(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid;
    else hi = mid - 1;
  }
  return a[lo] === target ? lo : -1;
}
// searchBroken([1, 3, 5, 7], 7) -> hangs: lo and hi get stuck at 2 and 3`,
        codeTs: `function searchBroken(a: number[], target: number): number {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === target) return mid;
    if (a[mid]! < target) lo = mid;
    else hi = mid - 1;
  }
  return a[lo] === target ? lo : -1;
}`,
        output: `// does not terminate for target = 7`,
        explain: 'With lo and hi adjacent, mid equals lo. The update lo = mid leaves lo unchanged and hi unchanged, so the interval never shrinks and the loop spins forever.',
        explainHi: 'lo aur hi adjacent hone par, mid lo ke barabar hai. Update lo = mid lo ko na-badla aur hi ko na-badla chhodta hai, isliye interval kabhi shrink nahi hota aur loop hamesha chalta hai.',
      },
      {
        title: 'Fixed: half-open template, always terminates',
        titleHi: 'Theek: half-open template, hamesha terminate hota hai',
        code: `let lo = 0, hi = a.length;
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (a[mid] < target) lo = mid + 1;
  else hi = mid;
}`,
        codeJs: `function binarySearch(a, target) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}
console.log(binarySearch([1, 3, 5, 7, 9], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9], 4)); // -1`,
        codeTs: `function binarySearch(a: number[], target: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    const v = a[mid]!;
    if (v === target) return mid;
    if (v < target) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}`,
        outputJs: `3
-1`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'lo = mid + 1 strictly increases lo; hi = mid strictly decreases hi (mid < hi always). Each iteration removes at least one index, so the loop runs at most log2(n) times.',
        explainHi: 'lo = mid + 1 lo ko sakhti se badhaata hai; hi = mid hi ko sakhti se ghataata hai (mid < hi hamesha). Har iteration kam se kam ek index hataati hai, isliye loop zyaada se zyaada log2(n) baar chalta hai.',
      },
      {
        title: 'lower_bound / upper_bound: counting duplicates',
        titleHi: 'lower_bound / upper_bound: duplicates ginna',
        code: `const count = upperBound(a, x) - lowerBound(a, x);`,
        codeJs: `function lowerBound(a, t) {
  let lo = 0, hi = a.length;
  while (lo < hi) { const m = lo + ((hi - lo) >> 1); if (a[m] < t) lo = m + 1; else hi = m; }
  return lo;
}
function upperBound(a, t) {
  let lo = 0, hi = a.length;
  while (lo < hi) { const m = lo + ((hi - lo) >> 1); if (a[m] <= t) lo = m + 1; else hi = m; }
  return lo;
}
const a = [1, 2, 2, 2, 3, 5];
console.log(lowerBound(a, 2), upperBound(a, 2)); // 1 4
console.log(upperBound(a, 2) - lowerBound(a, 2)); // 3  (three 2's)`,
        codeTs: `function lowerBound(a: number[], t: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) { const m = lo + ((hi - lo) >> 1); if (a[m]! < t) lo = m + 1; else hi = m; }
  return lo;
}`,
        outputJs: `1 4
3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'lower_bound finds the first index where x could go (leftmost); upper_bound finds the first index strictly after all x. Their difference is the count of x, with no early return needed.',
        explainHi: 'lower_bound pehla index dhoondhta hai jahaan x jaa sakta hai (leftmost); upper_bound pehla index dhoondhta hai jo sab x ke sakhti se baad hai. Unka antar x ki count hai, bina kisi early return ke.',
      },
    ],

    mistakes: [
      {
        wrong: `const mid = Math.floor((lo + hi) / 2);   // (lo + hi) overflows for large indices`,
        right: `const mid = lo + ((hi - lo) >> 1);        // hi - lo is safe, then halved and added back`,
        why: 'In fixed-width integer languages, lo + hi can exceed the maximum int when both are large (near 2 billion). Computing hi - lo first keeps every intermediate value in range.',
        whyHi: 'Fixed-width integer languages mein, lo + hi maximum int se zyaada ho sakta hai jab dono bade hain (2 billion ke paas). Pehle hi - lo compute karna har intermediate value ko range mein rakhta hai.',
      },
      {
        wrong: `// mismatched convention: half-open loop but closed-interval init
let lo = 0, hi = a.length - 1;   // hi is a valid index (closed)
while (lo < hi) { ... hi = mid; }   // but loop and update assume half-open
// the last element (index a.length - 1) can never be returned`,
        right: `let lo = 0, hi = a.length;   // half-open: hi is one past the end
while (lo < hi) { ... hi = mid; }`,
        why: 'Half-open code needs hi = a.length. Initialising hi to a.length - 1 with half-open logic makes the final element unreachable, a silent off-by-one that only shows on inputs whose answer is the last element.',
        whyHi: 'Half-open code ko hi = a.length chahiye. hi ko a.length - 1 par initialise karna half-open logic ke saath final element ko unreachable banaata hai, ek silent off-by-one jo sirf un inputs par dikhta hai jinka jawaab last element hai.',
      },
      {
        wrong: `// running binary search on an array that is not sorted by the compared key
const byName = records.sort((a, b) => a.name.localeCompare(b.name));
binarySearchByAge(byName, 30);   // the array is sorted by name, not age`,
        right: `// binary search requires the array to be sorted by exactly the key you compare.
const byAge = records.slice().sort((a, b) => a.age - b.age);
binarySearchByAge(byAge, 30);`,
        why: 'Binary search discards half the array based on a comparison. If the array is not sorted by that comparison key, the half it discards may contain the target, and it returns "not found" for a present element.',
        whyHi: 'Binary search ek comparison ke aadhaar par array ka aadha discard karta hai. Agar array us comparison key se sorted nahi hai, jo aadha ye discard karta hai usmein target ho sakta hai, aur ye ek maujood element ke liye "not found" return karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**The famous "nearly all binary searches are broken" result** came from a Google engineer finding the `(lo + hi) / 2` overflow in the JDK\'s own `Arrays.binarySearch` — it had shipped for nine years.',
        hi: '**Mashhoor "lagbhag sab binary searches tooti hain" nateeja** ek Google engineer se aaya jisne JDK ke apne `Arrays.binarySearch` mein `(lo + hi) / 2` overflow dhoondha — ye nau saal se shipped tha.',
      },
      {
        en: '**lower_bound / upper_bound power range queries** — "how many events between time A and time B" on a sorted timestamp array is `upperBound(B) - lowerBound(A)`, an O(log n) answer instead of an O(n) scan.',
        hi: '**lower_bound / upper_bound range queries power karte hain** — ek sorted timestamp array par "time A aur time B ke beech kitne events" `upperBound(B) - lowerBound(A)` hai, ek O(n) scan ke bajaye ek O(log n) jawaab.',
      },
      {
        en: '**Database B-tree indexes are binary search generalised to disk pages** — each node holds many keys and the engine binary-searches within a node, then follows one child pointer, keeping disk reads to O(log n).',
        hi: '**Database B-tree indexes binary search disk pages tak generalised hain** — har node bahut keys rakhta hai aur engine ek node ke andar binary-search karta hai, phir ek child pointer follow karta hai, disk reads ko O(log n) par rakhte hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through why the half-open binary search template is guaranteed to terminate, referencing the specific role of each of its three rules.',
        qHi: 'Samjhaao ki half-open binary search template terminate hone ki guarantee kyun hai, iske teen rules mein se har ek ki khaas bhoomika ka zikr karte hue.',
        a: 'The template maintains a search interval described as half-open, written lo to hi with hi excluded, meaning the candidate indices are lo, lo plus one, up to hi minus one, and the answer if it exists is always inside this interval. Rule one, initialising hi to the array length rather than length minus one, is what makes that invariant true at the start: every index from zero to length minus one is a candidate, which is exactly zero to length in half-open notation. Rule two computes mid as lo plus half of hi minus lo. Two things follow. Because hi is strictly greater than lo whenever the loop body runs, hi minus lo is at least one, and half of it rounded down is at least zero, so mid is at least lo. And half of hi minus lo rounded down is strictly less than hi minus lo whenever hi minus lo is at least one, so mid is strictly less than hi. Therefore mid is always a valid index in the current interval, and specifically mid is never equal to hi. Rule three is the two updates. If we go left, we set hi to mid; since mid is strictly less than the old hi, the interval\'s upper end moves strictly down by at least one. If we go right, we set lo to mid plus one; since mid is at least the old lo, the interval\'s lower end moves strictly up by at least one. Either way the width hi minus lo decreases by at least one on every iteration. The width starts at the array length and cannot go below zero, so the loop body executes at most length times, and in fact at most log base two of length times because the width roughly halves. When the width reaches zero, lo equals hi, the loop condition lo less than hi is false, and the loop exits. There is no input on which the interval fails to shrink, which is precisely the bug the broken version had.',
        aHi: 'Template ek search interval maintain karta hai jise half-open kaha jaata hai, lo se hi likha gaya hi ke saath excluded, matlab candidate indices lo, lo plus ek, hi minus ek tak hain, aur jawaab agar maujood hai hamesha is interval ke andar hai. Rule ek, hi ko array length par initialise karna na ki length minus ek, wahi hai jo us invariant ko shuru mein sach banaata hai: zero se length minus ek tak har index ek candidate hai, jo half-open notation mein bilkul zero se length hai. Rule do mid ko lo plus hi minus lo ke aadhe ki tarah compute karta hai. Do cheezein follow hoti hain. Kyunki hi jab bhi loop body chalti hai lo se sakhti se zyaada hai, hi minus lo kam se kam ek hai, aur iska aadha neeche round kiya kam se kam zero hai, isliye mid kam se kam lo hai. Aur hi minus lo ka aadha neeche round kiya jab bhi hi minus lo kam se kam ek hai hi minus lo se sakhti se kam hai, isliye mid hi se sakhti se kam hai. Isliye mid hamesha current interval mein ek valid index hai, aur khaas taur par mid kabhi hi ke barabar nahi hai. Rule teen do updates hain. Agar hum left jaate hain, hum hi ko mid set karte hain; kyunki mid purane hi se sakhti se kam hai, interval ka upper end sakhti se kam se kam ek se neeche hilta hai. Agar hum right jaate hain, hum lo ko mid plus ek set karte hain; kyunki mid kam se kam purana lo hai, interval ka lower end sakhti se kam se kam ek se upar hilta hai. Kisi bhi tarah width hi minus lo har iteration par kam se kam ek se ghatti hai. Width array length par shuru hoti hai aur zero se neeche nahi jaa sakti, isliye loop body zyaada se zyaada length baar execute hoti hai, aur asal mein zyaada se zyaada length ka log base do baar kyunki width lagbhag halve hoti hai. Jab width zero par pahunchti hai, lo hi ke barabar hai, loop condition lo less than hi false hai, aur loop exit hota hai. Koi input nahi hai jispar interval shrink hone mein fail hota hai, jo bilkul wo bug hai jo toote version ke paas tha.',
      },
      {
        q: 'Why prefer lower_bound / upper_bound over a plain "return the index of target or -1" binary search?',
        qHi: 'Ek plain "target ka index ya -1 return karo" binary search ke muqaable lower_bound / upper_bound kyun prefer karein?',
        a: 'Plain binary search answers a single narrow question: is this exact value present, and if so where. lower_bound and upper_bound answer a more general question that the plain version is a special case of: given a sorted array, where is the boundary between elements that are below a threshold and elements that are not. lower_bound returns the first index whose element is greater than or equal to the target, which is equivalently the position where the target would be inserted to keep the array sorted, choosing the leftmost such position. upper_bound returns the first index whose element is strictly greater than the target. From these two you can derive everything the plain search gives you and much more, by composition rather than by writing new search code. Whether the target exists is just: lower_bound is within bounds and the element there equals the target. How many times the target appears is upper_bound minus lower_bound. The insertion point for a new copy is either bound. The count of elements in a value range from A to B inclusive is upper_bound of B minus lower_bound of A. The smallest element greater than the target is at upper_bound. Each of these would otherwise be a slightly different, separately-debugged binary search with its own boundary conditions. There is also a correctness benefit: lower_bound and upper_bound have no early return on an exact match, so they have exactly one loop exit and one invariant to reason about, which makes them markedly easier to get right than a plain search with its extra mid-loop return path. Most competitive programmers and library authors write only these two and build everything else on top.',
        aHi: 'Plain binary search ek akela sankeern sawaal ka jawaab deta hai: kya ye exact value maujood hai, aur agar haan kahaan. lower_bound aur upper_bound ek zyaada general sawaal ka jawaab dete hain jiska plain version ek khaas case hai: ek sorted array diya gaya, ek threshold se neeche elements aur na-neeche elements ke beech boundary kahaan hai. lower_bound pehla index return karta hai jiska element target se greater ya equal hai, jo barabar roop se wo position hai jahaan target insert hoga array ko sorted rakhne ke liye, leftmost aisi position chunte hue. upper_bound pehla index return karta hai jiska element target se sakhti se greater hai. In dono se aap sab kuch derive kar sakte ho jo plain search deta hai aur kaafi zyaada, composition se na ki naya search code likhkar. Kya target maujood hai bas: lower_bound bounds ke andar hai aur wahaan element target ke barabar hai. Target kitni baar aata hai wo upper_bound minus lower_bound hai. Ek nayi copy ke liye insertion point koi bhi bound hai. A se B tak ek value range mein elements ki count (inclusive) B ka upper_bound minus A ka lower_bound hai. Target se sabse chhota greater element upper_bound par hai. In mein se har ek warna ek thoda alag, alag-debug ki gayi binary search hoti apni boundary conditions ke saath. Ek correctness benefit bhi hai: lower_bound aur upper_bound ke ek exact match par koi early return nahi hai, isliye unke bilkul ek loop exit aur ek invariant hai reason karne ke liye, jo unhe ek plain search se apni extra mid-loop return path ke saath markedly aasaan banaata hai sahi paana. Adhikaansh competitive programmers aur library authors sirf ye do likhte hain aur baaki sab kuch iske upar banaate hain.',
      },
    ],

    exercises: [
      {
        task: 'Implement the half-open binary search. Test it on every input where the answer is index 0, index a.length - 1, a missing value smaller than everything, a missing value larger than everything, and a missing value in the middle. Confirm it never hangs.',
        taskHi: 'Half-open binary search implement karo. Ise har us input par test karo jahaan jawaab index 0 hai, index a.length - 1 hai, har cheez se chhota ek missing value, har cheez se bada ek missing value, aur beech mein ek missing value. Confirm karo ye kabhi hang nahi hota.',
        hint: 'Add a loop-iteration counter and assert it never exceeds ceil(log2(n)) + 1. The broken version fails this instantly on some inputs.',
        hintHi: 'Ek loop-iteration counter jodo aur assert karo ki ye kabhi ceil(log2(n)) + 1 se zyaada nahi hota. Toota version kuch inputs par ise turant fail karta hai.',
      },
      {
        task: 'Implement lowerBound and upperBound. On the array [1,2,2,2,2,3,4,4,5], compute for each value 0..6: does it exist, how many times, and where a new copy would be inserted.',
        taskHi: 'lowerBound aur upperBound implement karo. Array [1,2,2,2,2,3,4,4,5] par, har value 0..6 ke liye compute karo: kya ye maujood hai, kitni baar, aur ek nayi copy kahaan insert hogi.',
        hint: 'exists = lb < n && a[lb] === x. count = ub - lb. insertion point = lb (or ub — both keep the array sorted).',
        hintHi: 'exists = lb < n && a[lb] === x. count = ub - lb. insertion point = lb (ya ub — dono array ko sorted rakhte hain).',
      },
      {
        task: 'Write a "rotated sorted array" search: given [4,5,6,7,0,1,2] (a sorted array rotated at an unknown point) and a target, find its index in O(log n). Adapt the template: at each mid, decide which half is sorted, then whether the target lies in it.',
        taskHi: 'Ek "rotated sorted array" search likho: [4,5,6,7,0,1,2] (ek anjaan bindu par rotated ek sorted array) aur ek target diya gaya, iska index O(log n) mein dhoondho. Template adapt karo: har mid par, tay karo kaunsa half sorted hai, phir kya target ismein hai.',
        hint: 'One of a[lo..mid] and a[mid..hi-1] is always fully sorted. Check which by comparing a[lo] and a[mid], then use a normal range check to decide which half to keep.',
        hintHi: 'a[lo..mid] aur a[mid..hi-1] mein se ek hamesha poori tarah sorted hai. a[lo] aur a[mid] compare karke check karo kaunsa, phir ek normal range check istemal karo tay karne ko kaunsa half rakhna hai.',
      },
    ],

    keyTakeaways: [
      'Binary search halves a sorted array\'s search space per comparison — O(log n) — but small mistakes in the boundary logic cause infinite loops or off-by-ones.',
      'Use the half-open template: lo = 0, hi = a.length; while (lo < hi); mid = lo + ((hi - lo) >> 1); lo = mid + 1 or hi = mid.',
      'mid = lo + ((hi - lo) >> 1), never (lo + hi) / 2 — the latter overflows for large indices in fixed-width integer languages (a real historical bug).',
      'The three rules reinforce each other: half-open interval, safe mid, and updates that strictly shrink [lo, hi) every iteration so the loop must terminate.',
      'Prefer lower_bound (first element >= target) and upper_bound (first element > target). They compose: existence, count (ub - lb), insertion point, range counts.',
      'Binary search silently returns wrong answers on an array not sorted by the comparison key — the sorted precondition is not optional.',
    ],
    keyTakeawaysHi: [
      'Binary search ek sorted array ka search space prati comparison halve karta hai — O(log n) — par boundary logic mein chhoti galtiyaan infinite loops ya off-by-ones ka kaaran banti hain.',
      'Half-open template istemal karo: lo = 0, hi = a.length; while (lo < hi); mid = lo + ((hi - lo) >> 1); lo = mid + 1 ya hi = mid.',
      'mid = lo + ((hi - lo) >> 1), kabhi (lo + hi) / 2 nahi — baad waala fixed-width integer languages mein bade indices ke liye overflow hota hai (ek asli historical bug).',
      'Teen rules ek doosre ko reinforce karte hain: half-open interval, safe mid, aur updates jo har iteration [lo, hi) ko sakhti se shrink karte hain taaki loop terminate ho hi.',
      'lower_bound (pehla element >= target) aur upper_bound (pehla element > target) prefer karo. Ye compose hote hain: existence, count (ub - lb), insertion point, range counts.',
      'Binary search ek aise array par jo comparison key se sorted nahi hai chupchaap galat jawaab return karta hai — sorted precondition vaikalpik nahi hai.',
    ],
  },
];
