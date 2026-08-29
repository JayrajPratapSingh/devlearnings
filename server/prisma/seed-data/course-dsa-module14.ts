/**
 * DSA Complete Course — Module 14: Pro-Level Patterns & Interview Strategy,
 * lesson 1.
 *
 * Pattern recognition: mapping the SURFACE FEATURES of a new, unfamiliar problem
 * to the technique it most likely wants, so you spend your thinking time on the
 * hard part instead of on "where do I even start". Builds on every earlier
 * module — this lesson is the index into them. Broken example: reading a problem
 * and immediately committing to the first technique that comes to mind (often
 * "I'll write a nested loop" or "this is probably DP"), then discovering
 * halfway through that it does not fit, and starting over with time gone. Fixed
 * by running a short checklist of feature-to-technique triggers first: sorted
 * array plus pair/triplet -> two pointers; contiguous subarray plus optimise ->
 * sliding window / prefix sums / Kadane; "shortest in an unweighted graph" ->
 * BFS; "count the ways / minimise cost with overlapping choices" -> DP;
 * "most important next" repeatedly -> heap; "monotonic yes/no over a range" ->
 * binary search on the answer; and so on. The pattern is a hypothesis, not a
 * commitment — you still verify it fits before coding.
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

export const DSA_MODULE_14: CourseLesson[] = [
  {
    slug: 'pattern-recognition-features-to-technique',
    title: 'Pattern Recognition: From Problem Features to Technique',
    titleHi: 'Pattern Recognition: Problem Features Se Technique Tak',
    description: 'Reading a new problem and immediately committing to the first idea that comes to mind — usually a brute-force nested loop or a guess that "it is probably DP" — then discovering ten minutes in that the approach does not fit the problem, and having to restart with most of the time gone.',
    descriptionHi: 'Ek nayi problem padhna aur turant pehle idea par commit karna jo dimaag mein aata hai — aksar ek brute-force nested loop ya ek guess ki "ye shayad DP hai" — phir das minute baad pata chalna ki approach problem ko fit nahi karta, aur zyaadaatar samay chale jaane ke saath restart karna padta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A doctor who reaches for a prescription before finishing the examination.** An experienced clinician does not diagnose from the first symptom mentioned. They take a quick, structured history — where does it hurt, how long, what makes it better or worse, any related signs — and each answer narrows the space of likely conditions before any treatment is chosen. The individual questions are cheap and fast; the value is in how quickly they rule things out. Solving an unfamiliar algorithm problem works the same way. Before deciding on an approach, you run through a handful of quick observations about the problem\'s shape: is the input sorted, is it a graph or a grid, is the answer a single number in a range, are we asked for a count or a minimum or a yes/no, how big can the input get. Each observation eliminates whole categories of technique and points toward one or two candidates. Only then do you commit to an approach, and even then you sanity-check it against a tiny example before writing code. The checklist does not solve the problem for you; it stops you from spending your limited time building the wrong thing.',
      hi: '**Ek doctor jo examination khatam karne se pehle ek prescription ki taraf pahunchta hai.** Ek experienced clinician pehle mention kiye symptom se diagnose nahi karta. Wo ek quick, structured history lete hain — dard kahaan hai, kitne der se, kya ise behtar ya kharab banaata hai, koi related signs — aur har jawaab kisi bhi treatment chunne se pehle sambhaavit conditions ki space narrow karta hai. Individual sawaal saste aur tez hain; value is baat mein hai ki wo kitni jaldi cheezein rule out karte hain. Ek anjaan algorithm problem solve karna usi tarah kaam karta hai. Ek approach par decide karne se pehle, aap problem ke shape ke baare mein mutthi bhar quick observations chalate ho: kya input sorted hai, kya ye ek graph ya grid hai, kya jawaab ek range mein ek akela number hai, kya humse ek count ya ek minimum ya ek yes/no poocha jaata hai, input kitna bada ho sakta hai. Har observation poori technique categories eliminate karta hai aur ek ya do candidates ki taraf point karta hai. Sirf tab aap ek approach par commit karte ho, aur tab bhi aap code likhne se pehle ek tiny example ke against ise sanity-check karte ho.',
    },

    simple: `**Start broken.** Commit to the first idea, discover it does not fit:

\`\`\`
Problem: "Given an array of daily temperatures, for each day return how many
days until a warmer temperature (0 if none)."

Instinct: nested loop — for each day, scan forward for a warmer day. O(n^2).
Code it. On n = 10^5 it times out. Restart.

Better first move: notice the FEATURES.
  - "for each element, find the next element that is greater"  -> "next greater
    element" is a textbook MONOTONIC STACK problem (Module 5).
  - one pass, each element pushed and popped once -> O(n).
\`\`\`

**The fix: a feature-to-technique checklist, run before committing**

\`\`\`
INPUT SHAPE
  sorted array, find a pair/triplet with a target sum/property
        -> two pointers (Module 2)
  contiguous subarray/substring, optimise a sum/length/count
        -> sliding window, or prefix sums, or Kadane (Module 2)
  "next greater / next smaller / nearest" for each element
        -> monotonic stack (Module 5)
  need the k largest / smallest / "most important next", repeatedly
        -> heap / priority queue (Module 8)
  intervals, non-overlapping / merge / minimum removals
        -> sort by end time, greedy (Module 12)

STRUCTURE
  tree or grid, visit everything / find something
        -> DFS or BFS (Modules 7, 9)
  shortest path, all edges cost 1
        -> BFS (Module 9)
  shortest path, weighted, non-negative
        -> Dijkstra with a heap (Module 9)
  ordering with prerequisites, or detect a cycle in dependencies
        -> topological sort / DFS colours (Module 9)
  "are these connected", many queries, connections added over time
        -> union-find (Module 9)

ANSWER SHAPE
  "count the ways" / "minimum cost" / "is it possible" with choices that
  reach the same subproblem many ways
        -> dynamic programming (Module 11)
  a single optimal number in a known range, and checking a fixed value is easy,
  and feasibility is monotonic
        -> binary search on the answer (Module 10)
  a locally-best choice that (you can argue) never blocks a better global one
        -> greedy (Module 12)
  which elements of a SMALL set (n <= ~20) have been used / visited
        -> bitmask DP (Module 13)
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Pehle idea par commit karo, pata chale ye fit nahi hota:

\`\`\`
Problem: "Daily temperatures ke ek array diye gaye, har din ke liye return karo
kitne din tak ek warmer temperature hai (koi nahi toh 0)."

Instinct: nested loop — har din ke liye, ek warmer day ke liye aage scan karo. O(n^2).
Code karo. n = 10^5 par ye timeout hota hai. Restart.

Behtar pehla move: FEATURES notice karo.
  - "har element ke liye, agla element dhoondho jo bada hai"  -> "next greater
    element" ek textbook MONOTONIC STACK problem hai (Module 5).
  - ek pass, har element ek baar push aur pop hota hai -> O(n).
\`\`\`

**Fix: ek feature-to-technique checklist, commit karne se pehle chalaya gaya**

\`\`\`
INPUT SHAPE
  sorted array, ek target sum/property waala pair/triplet dhoondho
        -> two pointers (Module 2)
  contiguous subarray/substring, ek sum/length/count optimise karo
        -> sliding window, ya prefix sums, ya Kadane (Module 2)
  har element ke liye "next greater / next smaller / nearest"
        -> monotonic stack (Module 5)
  baar-baar k largest / smallest / "most important next" chahiye
        -> heap / priority queue (Module 8)
  intervals, non-overlapping / merge / minimum removals
        -> end time se sort, greedy (Module 12)

STRUCTURE
  tree ya grid, sab kuch visit karo / kuch dhoondho
        -> DFS ya BFS (Modules 7, 9)
  shortest path, sab edges cost 1
        -> BFS (Module 9)
  shortest path, weighted, non-negative
        -> ek heap ke saath Dijkstra (Module 9)
  prerequisites ke saath ordering, ya dependencies mein ek cycle detect karo
        -> topological sort / DFS colours (Module 9)
  "kya ye connected hain", bahut queries, connections samay ke saath add hote
        -> union-find (Module 9)

ANSWER SHAPE
  "count the ways" / "minimum cost" / "kya ye mumkin hai" choices ke saath jo
  usi subproblem ko kayi tarikon se pahunchti hain
        -> dynamic programming (Module 11)
  ek known range mein ek akela optimal number, aur ek fixed value check karna
  aasaan hai, aur feasibility monotonic hai
        -> binary search on the answer (Module 10)
  ek locally-best choice jo (aap argue kar sakte ho) ek behtar global ko kabhi block nahi karti
        -> greedy (Module 12)
  ek CHHOTE set (n <= ~20) ke kaunse elements used / visited hain
        -> bitmask DP (Module 13)
\`\`\``,

    content: `## The checklist is a hypothesis generator, not an oracle

\`\`\`
Feature-matching gives you a SHORTLIST of candidate techniques. You then:
  1. pick the most likely one
  2. sketch the state / invariant / recurrence on paper
  3. test it against a tiny example BY HAND
  4. only if it survives step 3, start coding

If step 3 fails, you have lost two minutes, not twenty, and the failure usually
tells you which candidate to try next.
\`\`\`

The whole point is to fail fast on paper. A wrong approach discovered while tracing a 4-element example is cheap; the same wrong approach discovered after 60 lines of code is expensive.

## Features that are frequently misread

\`\`\`
"subarray" vs "subsequence"
  subarray = contiguous -> sliding window / prefix sums / Kadane
  subsequence = pick any, keep order -> usually DP (LCS, LIS)

"sorted" — did the problem say it, or are you assuming it?
  if truly sorted -> two pointers / binary search are in play
  if not -> sorting first is O(n log n); check whether that fits the budget

"the array can be rearranged" vs "the order matters"
  can rearrange -> sorting, greedy on sorted order
  order fixed -> prefix sums, sliding window, DP over positions

"minimum / maximum" alone is not "DP"
  a running min/max in one pass is often enough (greedy, Module 12 lesson 4)
  DP is for when the same position is reachable many ways with different futures
\`\`\`

## A worked feature-read on three problems

\`\`\`
"Find the length of the longest substring without repeating characters."
  contiguous (substring), optimise a length, constraint is about a window's
  contents -> SLIDING WINDOW with a last-seen map. O(n).

"You can complete a course only after its prerequisites. Return an order, or
say it is impossible."
  ordering + prerequisites + "impossible" case -> TOPOLOGICAL SORT (Kahn's).
  The "impossible" case is a cycle. O(V + E).

"Given n coins with values, and a target, return the number of distinct
combinations that sum to the target."
  "number of combinations" + "sum to a target" + coins reusable + choices that
  reach the same amount many ways -> DP over amount, coins in the outer loop.
  O(target * numCoins).
\`\`\`

## Two-technique combinations you should recognise

\`\`\`
sort THEN two pointers          -> 3Sum, 4Sum, closest pair
sort THEN greedy                -> interval scheduling, minimum arrows
BFS/DFS THEN DP                  -> longest path in a DAG, counting paths
binary search THEN a greedy check -> "split array largest sum", ship capacity
heap ALONGSIDE a scan           -> merge k sorted lists, sliding-window maximum
prefix sums THEN a hash map     -> subarray sum equals k, count nice subarrays
\`\`\`

Many "hard" problems are a familiar technique applied after a preprocessing step. Recognising the preprocessing (usually a sort, a prefix-sum array, or a graph build) is half the battle.

## What to do when nothing matches

\`\`\`
1. Solve it brute force. State that complexity out loud. A correct slow solution
   is worth partial credit and often reveals the structure to optimise.
2. Look for repeated work in the brute force. Repeated subproblems -> memoise
   (DP). Repeated scans -> a running quantity or a better data structure.
3. Try small cases by hand and look for a pattern in the answers.
4. Consider the reverse: iterate from the end, build the answer backwards, or
   ask "what must be true just before the last step".
\`\`\``,

    contentHi: `## Checklist ek hypothesis generator hai, ek oracle nahi

\`\`\`
Feature-matching aapko candidate techniques ki ek SHORTLIST deta hai. Phir aap:
  1. sabse sambhaavit ek chuno
  2. kaagaz par state / invariant / recurrence sketch karo
  3. ise ek tiny example ke against HAATH SE test karo
  4. sirf agar ye step 3 se bache, coding shuru karo

Agar step 3 fail hota hai, aapne do minute khoye, bees nahi, aur failure aksar
batata hai ki kaunsa candidate agla try karna hai.
\`\`\`

Poora point kaagaz par jaldi fail hona hai. Ek galat approach jo ek 4-element example trace karte waqt discover hui saste hai; wahi galat approach 60 lines of code ke baad discover hui mehengi.

## Features jo aksar galat padhi jaati hain

\`\`\`
"subarray" vs "subsequence"
  subarray = contiguous -> sliding window / prefix sums / Kadane
  subsequence = koi bhi pick karo, order rakho -> aksar DP (LCS, LIS)

"sorted" — kya problem ne kaha, ya aap maan rahe ho?
  agar sach mein sorted -> two pointers / binary search khel mein hain
  agar nahi -> pehle sort karna O(n log n) hai; check karo kya wo budget mein fit hai

"array rearrange ho sakta hai" vs "order maayne rakhta hai"
  rearrange ho sakta hai -> sorting, sorted order par greedy
  order fixed -> prefix sums, sliding window, positions par DP

akela "minimum / maximum" "DP" nahi hai
  ek pass mein ek running min/max aksar kaafi hai (greedy, Module 12 lesson 4)
  DP tab ke liye hai jab wahi position kayi tarikon se alag futures ke saath reachable hai
\`\`\`

## Teen problems par ek worked feature-read

\`\`\`
"Repeating characters ke bina longest substring ki length dhoondho."
  contiguous (substring), ek length optimise karo, constraint ek window ki
  contents ke baare mein hai -> ek last-seen map ke saath SLIDING WINDOW. O(n).

"Aap ek course sirf iske prerequisites ke baad poora kar sakte ho. Ek order
return karo, ya kaho ye asambhav hai."
  ordering + prerequisites + "asambhav" case -> TOPOLOGICAL SORT (Kahn ka).
  "asambhav" case ek cycle hai. O(V + E).

"Values ke saath n coins, aur ek target diye gaye, distinct combinations ki
tadaad return karo jo target tak sum karti hain."
  "combinations ki tadaad" + "ek target tak sum" + coins reusable + choices jo
  usi amount ko kayi tarikon se pahunchti hain -> amount par DP, coins outer loop mein.
  O(target * numCoins).
\`\`\`

## Do-technique combinations jinhe aapko pehchaanna chahiye

\`\`\`
sort PHIR two pointers          -> 3Sum, 4Sum, closest pair
sort PHIR greedy                -> interval scheduling, minimum arrows
BFS/DFS PHIR DP                  -> ek DAG mein longest path, paths ginna
binary search PHIR ek greedy check -> "split array largest sum", ship capacity
heap SAATH ek scan ke           -> merge k sorted lists, sliding-window maximum
prefix sums PHIR ek hash map     -> subarray sum equals k, nice subarrays ginna
\`\`\`

Kayi "hard" problems ek familiar technique hain ek preprocessing step ke baad lagayi gayi. Preprocessing pehchaanna (aksar ek sort, ek prefix-sum array, ya ek graph build) aadhi ladaai hai.

## Jab kuch match nahi karta tab kya karein

\`\`\`
1. Ise brute force solve karo. Us complexity ko zor se batao. Ek sahi slow
   solution partial credit ke laayak hai aur aksar optimise karne ka structure reveal karta hai.
2. Brute force mein repeated kaam dhoondho. Repeated subproblems -> memoise
   (DP). Repeated scans -> ek running quantity ya ek behtar data structure.
3. Small cases haath se try karo aur jawaabon mein ek pattern dhoondho.
4. Ulta socho: end se iterate karo, jawaab peechhe banao, ya poocho "aakhri step
   se theek pehle kya sach hona chahiye".
\`\`\``,

    examples: [
      {
        title: 'Feature read: "next warmer day" -> monotonic stack',
        titleHi: 'Feature read: "next warmer day" -> monotonic stack',
        code: `// "for each element, distance to the next greater element" -> monotonic stack`,
        codeJs: `function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0);
  const stack = [];   // indices, temps decreasing down the stack
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}
console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // [1,1,4,2,1,1,0,0]`,
        codeTs: `function dailyTemperatures(temps: number[]): number[] {
  const res = new Array<number>(temps.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i]! > temps[stack[stack.length - 1]!]!) {
      const j = stack.pop()!;
      res[j] = i - j;
    }
    stack.push(i);
  }
  return res;
}`,
        outputJs: `[1, 1, 4, 2, 1, 1, 0, 0]`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The phrase "for each element, the next element that is greater" is the monotonic-stack trigger. Each index is pushed and popped once -> O(n), versus the O(n^2) nested-loop instinct.',
        explainHi: '"Har element ke liye, agla element jo bada hai" phrase monotonic-stack trigger hai. Har index ek baar push aur pop hota hai -> O(n), O(n^2) nested-loop instinct ke muqaable.',
      },
      {
        title: 'Feature read: "subarray sum equals k" -> prefix sums + hash map',
        titleHi: 'Feature read: "subarray sum equals k" -> prefix sums + hash map',
        code: `// contiguous + a target sum + counting -> prefix sum, count seen[prefix - k]`,
        codeJs: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);   // prefix sum 0 has occurred once (empty prefix)
  let prefix = 0, count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.get(prefix - k) || 0;   // subarrays ending here with sum k
    seen.set(prefix, (seen.get(prefix) || 0) + 1);
  }
  return count;
}
console.log(subarraySum([1, 1, 1], 2));      // 2
console.log(subarraySum([1, 2, 3], 3));      // 2`,
        codeTs: `function subarraySum(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]);
  let prefix = 0, count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}`,
        outputJs: `2
2`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Contiguous + exact target sum + "how many" points at prefix sums; a subarray (i, j] has sum k iff prefix[j] - prefix[i] = k, so count how many earlier prefixes equal prefix - k. O(n).',
        explainHi: 'Contiguous + exact target sum + "kitne" prefix sums ki taraf point karta hai; ek subarray (i, j] ka sum k hai jab prefix[j] - prefix[i] = k, isliye gino kitne earlier prefixes prefix - k ke barabar hain. O(n).',
      },
      {
        title: 'Feature read: "min speed to finish in H hours" -> binary search on the answer',
        titleHi: 'Feature read: "H hours mein khatam karne ki min speed" -> answer par binary search',
        code: `// single number in a range + monotonic feasibility -> binary search the answer`,
        codeJs: `function minEatingSpeed(piles, H) {
  const feasible = k => piles.reduce((h, p) => h + Math.ceil(p / k), 0) <= H;
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (feasible(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
console.log(minEatingSpeed([3, 6, 7, 11], 8)); // 4`,
        codeTs: `function minEatingSpeed(piles: number[], H: number): number {
  const feasible = (k: number): boolean =>
    piles.reduce((h, p) => h + Math.ceil(p / k), 0) <= H;
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (feasible(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
        outputJs: `4`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: '"Smallest speed such that a fixed check passes" + "faster is never worse" (monotonic) is the binary-search-on-the-answer trigger. Bounds are [1, max pile]. O(n log(max)).',
        explainHi: '"Sabse chhoti speed jismein ek fixed check pass ho" + "tez kabhi kharab nahi" (monotonic) answer-par-binary-search trigger hai. Bounds [1, max pile] hain. O(n log(max)).',
      },
    ],

    mistakes: [
      {
        wrong: `// committing to "nested loop" or "it's DP" before reading the features`,
        right: `// spend 60 seconds listing features (input shape, structure, answer shape,
// size) and matching them to candidate techniques BEFORE choosing.`,
        why: 'The first idea is often a brute force or a mismatched guess. A quick feature scan usually points at the intended technique directly, saving a failed implementation.',
        whyHi: 'Pehla idea aksar ek brute force ya ek mismatched guess hai. Ek quick feature scan aksar intended technique par seedhe point karta hai, ek failed implementation bachaate hue.',
      },
      {
        wrong: `// treating "subsequence" like "subarray" (or vice versa)
// sliding window on a subsequence problem -> wrong; DP on a contiguous
// problem -> unnecessarily slow`,
        right: `// subarray = contiguous (window / prefix sums); subsequence = order-preserving
// pick-any (usually DP). Read which one the problem asks for.`,
        why: 'These words look similar but demand completely different techniques. A window slides over contiguous elements; a subsequence can skip, which is what DP handles.',
        whyHi: 'Ye shabd ek jaise dikhte hain par poori tarah alag techniques maangte hain. Ek window contiguous elements par slide karta hai; ek subsequence skip kar sakta hai, jo DP handle karta hai.',
      },
      {
        wrong: `// choosing a technique and skipping the "trace a tiny example" check,
// then finding the recurrence / invariant is wrong after coding it`,
        right: `// once you have a candidate, trace it by hand on a 3-5 element example
// before writing any code. Two minutes here saves twenty later.`,
        why: 'The feature match gives a hypothesis. A hand trace on a small input is the cheapest possible test of whether the state / recurrence / invariant is actually correct.',
        whyHi: 'Feature match ek hypothesis deta hai. Ek small input par ek hand trace state / recurrence / invariant asal mein sahi hai ya nahi ka sabse sasta sambhaavit test hai.',
      },
    ],

    realWorld: [
      {
        en: '**Senior engineers pattern-match constantly** — "this looks like a scheduling problem", "this is basically a graph traversal", "we need a priority queue here" — which is why they scope work faster, not because they memorised more algorithms.',
        hi: '**Senior engineers lagaataar pattern-match karte hain** — "ye ek scheduling problem jaisi lagti hai", "ye mool roop se ek graph traversal hai", "humein yahaan ek priority queue chahiye" — yahi wajah hai ki wo kaam tezi se scope karte hain, isliye nahi ki unhone zyaada algorithms yaad kiye.',
      },
      {
        en: '**Interview feedback almost always mentions "approach"** before it mentions bugs — interviewers are evaluating whether you can map an unfamiliar problem to a known technique, which is the actual job skill.',
        hi: '**Interview feedback lagbhag hamesha bugs mention karne se pehle "approach" mention karta hai** — interviewers evaluate kar rahe hain ki kya aap ek anjaan problem ko ek known technique se map kar sakte ho, jo asli job skill hai.',
      },
      {
        en: '**Query planners, compilers, and schedulers all do feature-to-strategy matching internally** — a query planner reads the shape of a query and picks a join strategy the same way you pick between DP and greedy.',
        hi: '**Query planners, compilers, aur schedulers sab internally feature-to-strategy matching karte hain** — ek query planner ek query ka shape padhta hai aur ek join strategy chunta hai usi tarah jaise aap DP aur greedy ke beech chunte ho.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe your process for the first two minutes after hearing a problem, before you write any code.',
        qHi: 'Ek problem sunne ke baad, koi code likhne se pehle, pehle do minute ke liye apni process describe karo.',
        a: 'I do not start with an approach; I start by characterising the problem along a few axes. First I restate the problem in my own words and confirm the input and output types and any constraints on values with the interviewer, and I ask for the size limits, because the size determines what complexity is acceptable and therefore which techniques are even in play. Then I list the surface features. What is the input shape: an array, and if so is it sorted, a string, a tree, a graph, a grid, a set of intervals. What is the answer shape: a count, a minimum or maximum, a yes or no, an actual structure like a path or a subsequence, a single number. What are we optimising or searching for, and is there any monotonic property, like "if a bigger value works then all bigger values work". Each of these observations rules out categories of technique and suggests one or two candidates. For example, "sorted array, find a pair summing to a target" strongly suggests two pointers; "for each element find the next greater element" suggests a monotonic stack; "count the ways to do something where choices overlap" suggests dynamic programming; "shortest path with all edges equal" suggests breadth-first search. Once I have a shortlist, I pick the most likely candidate and sketch its core, whether that is a loop invariant, a recurrence, or a state definition, and I trace it by hand on a tiny example, three to five elements, to check that it actually produces the right answer. Only if that hand trace succeeds do I begin coding. If it fails, I have spent about two minutes and I usually know which alternative to try next. Throughout this I am thinking out loud so the interviewer can follow and redirect me if I am heading somewhere unproductive.',
        aHi: 'Main ek approach se shuru nahi karta; main problem ko kuch axes ke saath characterise karke shuru karta hoon. Pehle main problem ko apne shabdon mein restate karta hoon aur interviewer ke saath input aur output types aur values par koi constraints confirm karta hoon, aur main size limits poochta hoon, kyunki size determine karta hai ki kaunsi complexity acceptable hai aur isliye kaunsi techniques khel mein hain bhi. Phir main surface features list karta hoon. Input shape kya hai: ek array, aur agar haan kya ye sorted hai, ek string, ek tree, ek graph, ek grid, intervals ka ek set. Answer shape kya hai: ek count, ek minimum ya maximum, ek haan ya na, ek asli structure jaise ek path ya subsequence, ek akela number. Hum kya optimise ya search kar rahe hain, aur kya koi monotonic property hai, jaise "agar ek bada value kaam karta hai toh sab bade values kaam karte hain". In observations mein se har ek technique categories rule out karta hai aur ek ya do candidates suggest karta hai. Ek baar mere paas ek shortlist ho, main sabse sambhaavit candidate chunta hoon aur iska core sketch karta hoon, chahe wo ek loop invariant ho, ek recurrence, ya ek state definition, aur main ise ek tiny example par haath se trace karta hoon, teen se paanch elements, ye check karne ke liye ki ye asal mein sahi jawaab banaata hai. Sirf agar wo hand trace safal hota hai tab main coding shuru karta hoon.',
      },
      {
        q: 'How do you tell whether a problem is dynamic programming or a single-pass greedy?',
        qHi: 'Aap kaise batate ho ki ek problem dynamic programming hai ya ek single-pass greedy?',
        a: 'The distinguishing question is whether the decision you make at each step can be made from a small, fixed summary of what you have seen so far, or whether you genuinely need to remember the best value for each of many distinct sub-states and let later steps choose among them. In a single-pass greedy, you iterate once and carry a constant amount of state, like the furthest index reachable, or a running fuel balance, or the lowest price seen, and the decision at each element is a direct function of that state. There is exactly one way to be in a given situation, so there is nothing to compare. In dynamic programming, the same position or configuration can be reached through many different sequences of earlier choices, and those different histories leave you in states that have different consequences for the future, so you must record the optimal value for each distinct state and combine them. The knapsack is DP because two different sets of earlier item choices can arrive at the same item index with different remaining capacity, and both are worth tracking. Practically, I first try to phrase the problem as "iterate once, keep O of one state". If I can, and I can argue the greedy choice is safe, usually with a short exchange argument that swapping toward the greedy choice never makes an optimal solution worse, then it is greedy. If I find myself wanting to memoise a function of two or more parameters, or taking a max or min over several predecessor states, that is the DP signal. And if I am unsure, I test the greedy rule against a brute force on small random inputs; a broken greedy almost always fails within a few dozen cases.',
        aHi: 'Farak karne wala sawaal ye hai ki har step par jo decision aap karte ho wo ab tak dekhi cheez ke ek chhote, fixed summary se kiya jaa sakta hai, ya kya aapko sach mein kayi distinct sub-states mein se har ek ke liye best value yaad rakhni chahiye aur later steps ko unmein se chunne dena chahiye. Ek single-pass greedy mein, aap ek baar iterate karte ho aur ek constant maatra state le jaate ho, jaise furthest index reachable, ya ek running fuel balance, ya dekhi gayi lowest price, aur har element par decision us state ka ek seedha function hai. Ek di gayi situation mein hone ka bilkul ek tarika hai, isliye compare karne ko kuch nahi. Dynamic programming mein, wahi position ya configuration kayi alag sequences of earlier choices ke through pahunchi jaa sakti hai, aur wo alag histories aapko un states mein chhodti hain jinke future ke liye alag parinaam hain. Knapsack DP hai kyunki earlier item choices ke do alag sets wahi item index par alag remaining capacity ke saath pahunch sakte hain. Vyaavahaarik roop se, main pehle problem ko "ek baar iterate karo, O of one state rakho" ki tarah phrase karne ki koshish karta hoon. Agar main kar sakta hoon, aur main argue kar sakta hoon ki greedy choice safe hai, toh ye greedy hai. Agar main do ya zyaada parameters ke ek function ko memoise karna chahta hoon, wo DP signal hai.',
      },
    ],

    exercises: [
      {
        task: 'For each of these prompts, write down (a) the surface features you notice and (b) the technique they point to, WITHOUT coding: "longest substring with at most k distinct characters"; "number of islands in a grid"; "kth largest element in a stream"; "can you partition the array into two equal-sum halves"; "course schedule with prerequisites".',
        taskHi: 'In prompts mein se har ek ke liye, likho (a) jo surface features aap notice karte ho aur (b) technique jispar wo point karte hain, BINA coding ke: "at most k distinct characters waala longest substring"; "ek grid mein islands ki tadaad"; "ek stream mein kth largest element"; "kya aap array ko do equal-sum halves mein partition kar sakte ho"; "prerequisites ke saath course schedule".',
        hint: 'Expected: sliding window; DFS/BFS flood fill; a size-k min-heap; subset-sum DP; topological sort. Check your reasoning against the checklist in this lesson.',
        hintHi: 'Expected: sliding window; DFS/BFS flood fill; ek size-k min-heap; subset-sum DP; topological sort. Apni reasoning ko is lesson ki checklist ke against check karo.',
      },
      {
        task: 'Take one problem you would call "hard" and identify the preprocessing step plus the core technique (e.g. "sort, then two pointers" or "build the graph, then BFS"). Name the two-technique combination explicitly.',
        taskHi: 'Ek problem lo jise aap "hard" kehte, aur preprocessing step plus core technique pehchaano (jaise "sort, phir two pointers" ya "graph build karo, phir BFS"). Do-technique combination ka explicitly naam do.',
        hint: '3Sum = sort then two pointers. "Number of connected components" = build adjacency list then DFS/union-find. "Longest path in a DAG" = topological sort then DP.',
        hintHi: '3Sum = sort phir two pointers. "Connected components ki tadaad" = adjacency list build phir DFS/union-find. "Ek DAG mein longest path" = topological sort phir DP.',
      },
      {
        task: 'Practice failing fast: pick a problem, choose a candidate technique in under a minute, then trace it by hand on a 4-element example. If it does not produce the right answer, note which feature you misread and pick the next candidate.',
        taskHi: 'Jaldi fail hona practice karo: ek problem chuno, ek minute ke andar ek candidate technique chuno, phir ise ek 4-element example par haath se trace karo. Agar ye sahi jawaab nahi banaata, note karo kaunsa feature aapne galat padha aur agla candidate chuno.',
        hint: 'The goal is to make wrong approaches cheap. A hand trace that reveals a broken recurrence in two minutes is a win, not a failure.',
        hintHi: 'Lakshya galat approaches ko sasta banaana hai. Ek hand trace jo do minute mein ek broken recurrence reveal karta hai ek jeet hai, ek failure nahi.',
      },
    ],

    keyTakeaways: [
      'Before choosing an approach, spend ~60 seconds listing surface features: input shape (sorted array? graph? intervals?), answer shape (count? min? yes/no?), what is optimised, is feasibility monotonic, and the size limit.',
      'Each feature rules out categories and suggests 1-2 candidate techniques. "Next greater element" -> monotonic stack; "count the ways with overlapping choices" -> DP; "monotonic yes/no over a range" -> binary search on the answer.',
      'The feature match is a hypothesis. Sketch the state/invariant/recurrence and trace it by hand on a 3-5 element example BEFORE coding. Failing on paper costs two minutes; failing after 60 lines costs twenty.',
      'Watch commonly-misread features: subarray (contiguous, window) vs subsequence (order-preserving pick-any, DP); "sorted" (did they say it?); "can rearrange" vs "order matters".',
      'Many hard problems are a familiar technique after preprocessing: sort then two pointers; build the graph then BFS; prefix sums then a hash map. Recognising the preprocessing is half the work.',
      'When nothing matches: solve it brute force, state the complexity, then look for repeated work (memoise) or repeated scans (running quantity / better data structure).',
    ],
    keyTakeawaysHi: [
      'Ek approach chunne se pehle, ~60 seconds surface features list karne mein kharch karo: input shape (sorted array? graph? intervals?), answer shape (count? min? yes/no?), kya optimise hota hai, kya feasibility monotonic hai, aur size limit.',
      'Har feature categories rule out karta hai aur 1-2 candidate techniques suggest karta hai. "Next greater element" -> monotonic stack; "overlapping choices ke saath ways ginna" -> DP; "ek range par monotonic yes/no" -> answer par binary search.',
      'Feature match ek hypothesis hai. State/invariant/recurrence sketch karo aur ise ek 3-5 element example par haath se trace karo coding SE PEHLE. Kaagaz par fail hona do minute kharch karta hai; 60 lines ke baad fail hona bees.',
      'Aksar-galat-padhi features par dhyaan do: subarray (contiguous, window) vs subsequence (order-preserving pick-any, DP); "sorted" (kya unhone kaha?); "rearrange ho sakta hai" vs "order maayne rakhta hai".',
      'Kayi hard problems preprocessing ke baad ek familiar technique hain: sort phir two pointers; graph build phir BFS; prefix sums phir ek hash map. Preprocessing pehchaanna aadha kaam hai.',
      'Jab kuch match nahi karta: ise brute force solve karo, complexity batao, phir repeated kaam (memoise) ya repeated scans (running quantity / behtar data structure) dhoondho.',
    ],
  },
];
