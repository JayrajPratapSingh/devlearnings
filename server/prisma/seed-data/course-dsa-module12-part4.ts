/**
 * DSA Complete Course — Module 12: Greedy Algorithms, lesson 4
 * (final lesson of Module 12).
 *
 * The "single forward pass with one running invariant" greedy family: jump game
 * (furthest reachable index), gas station (running fuel balance), partition
 * labels (segment end = max last-occurrence). Builds on this module's lessons
 * 1-3 (the greedy-choice property, exchange arguments) and this course's Module 2
 * (single-pass array techniques). Broken example: "can you reach the last index
 * of an array, where nums[i] is the max jump length from i?" solved by recursion
 * / DP that tries every jump length from every index — correct but O(n^2) or
 * worse, and it obscures a one-line invariant. Fixed by scanning left to right
 * and maintaining a single number, the furthest index reachable so far: if the
 * scan pointer ever passes that number, you are stuck; otherwise you extend it
 * to max(reach, i + nums[i]). O(n), O(1). Gas station and partition labels are
 * the same shape with a different running quantity.
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

export const DSA_MODULE_12_PART4: CourseLesson[] = [
  {
    slug: 'greedy-single-pass-invariant-patterns',
    title: 'Greedy Patterns: One Forward Pass, One Running Invariant',
    titleHi: 'Greedy Patterns: Ek Forward Pass, Ek Running Invariant',
    description: 'Deciding whether you can reach the last index of an array, where nums[i] is the maximum you may jump forward from i, by recursively trying every jump from every position. That branches exponentially, and even memoised it is O(n^2) — when a single scan tracking one number answers it in O(n).',
    descriptionHi: 'Tay karna ki kya aap ek array ke last index tak pahunch sakte ho, jahaan nums[i] wo maximum hai jitna aap i se aage jump kar sakte ho, har position se har jump recursively try karke. Wo exponentially branch karta hai, aur memoised bhi ye O(n^2) hai — jab ek akela scan ek number track karte hue ise O(n) mein jawaab deta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**Walking along a line of stepping stones toward the far bank, where a sign on each stone tells you the maximum number of stones ahead you are allowed to leap.** You do not need to plan the exact sequence of leaps. You only need to track one thing as you walk: the furthest stone you could possibly get to given everything you have seen so far. Start at stone zero; the furthest you can reach is your own sign\'s number. Step to stone one — but only if stone one is within your current furthest reach. Now update: could this new stone\'s sign carry you further than before? If so, extend your furthest reach. Keep walking. The moment your foot would land on a stone that is beyond your furthest reach, you know you are stuck and the far bank is unreachable. If your reach ever meets or passes the last stone, you have made it. One number, updated once per stone, no backtracking, no trying every leap.',
      hi: '**Stepping stones ki ek line ke saath door kinaare ki taraf chalna, jahaan har stone par ek sign aapko batata hai ki aage kitne stones tak aap leap kar sakte ho.** Aapko leaps ka exact sequence plan karne ki zaroorat nahi. Aapko chalte waqt sirf ek cheez track karni hai: sabse door stone jispar aap possibly pahunch sakte ho ab tak dekhi gayi har cheez ke hisaab se. Stone zero par shuru karo; sabse door jitna aap pahunch sakte ho wo aapke apne sign ka number hai. Stone one par step karo — par sirf agar stone one aapke current furthest reach ke andar hai. Ab update karo: kya is naye stone ka sign aapko pehle se aage le jaa sakta hai? Agar haan, apni furthest reach extend karo. Chalte raho. Jis pal aapka paav ek aise stone par utrega jo aapki furthest reach ke aage hai, aap jaante ho aap atak gaye aur door kinaara unreachable hai. Agar aapki reach kabhi last stone se milti ya iske aage jaati hai, aap pahunch gaye. Ek number, prati stone ek baar update kiya, koi backtracking nahi, har leap try nahi.',
    },

    simple: `**Start broken.** Jump game by trying every jump length from every index:

\`\`\`js
function canJumpBrute(nums, i = 0) {
  if (i >= nums.length - 1) return true;          // reached (or passed) the last index
  for (let step = 1; step <= nums[i]; step++) {
    if (canJumpBrute(nums, i + step)) return true;
  }
  return false;
}
\`\`\`

Correct, but from each index it branches into up to \`nums[i]\` recursive calls, and those overlap, so it is exponential. Memoising makes it O(n^2) (each index tries up to n jump lengths). Neither is needed: the answer depends only on a single running quantity.

**The fix: one pass, tracking the furthest reachable index**

\`\`\`js
function canJump(nums) {
  let reach = 0;                                  // furthest index reachable so far
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;                  // this index is beyond anything we can reach
    reach = Math.max(reach, i + nums[i]);         // standing at i, we can now reach i + nums[i]
    if (reach >= nums.length - 1) return true;    // last index is within reach -> done
  }
  return true;
}
\`\`\`

\`\`\`ts
function canJump(nums: number[]): boolean {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]!);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}
\`\`\`

The invariant: after processing index \`i\`, \`reach\` is the furthest index reachable using only indices \`0..i\`. If the scan pointer \`i\` ever exceeds \`reach\`, no earlier index could launch far enough to land on \`i\` or beyond, so you are stuck. Otherwise, every index up to \`reach\` is reachable, and standing on \`i\` extends the frontier to \`i + nums[i]\`. O(n) time, O(1) space.

**Same shape: gas station (running fuel balance)**

\`\`\`js
// gas[i] fuel at station i; cost[i] fuel to drive from i to i+1 (circular).
// Return the unique start index from which you can complete the loop, or -1.
function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const net = gas[i] - cost[i];
    total += net;
    tank += net;
    if (tank < 0) {                               // cannot get past station i from 'start'
      start = i + 1;                               // so try starting fresh after i
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;                  // feasible iff total fuel >= total cost
}
\`\`\`

The running quantity here is \`tank\`. Whenever it dips below zero, the current \`start\` fails to reach here, and — the greedy insight — *no* index between the old start and here can be a valid start either, so you jump \`start\` to \`i + 1\`. One pass.`,

    simpleHi: `**Toote hue se shuru.** Jump game har index se har jump length try karke:

\`\`\`js
function canJumpBrute(nums, i = 0) {
  if (i >= nums.length - 1) return true;          // last index pahunche (ya paar kiye)
  for (let step = 1; step <= nums[i]; step++) {
    if (canJumpBrute(nums, i + step)) return true;
  }
  return false;
}
\`\`\`

Sahi, par har index se ye \`nums[i]\` tak recursive calls mein branch karta hai, aur wo overlap karti hain, isliye ye exponential hai. Memoising ise O(n^2) banaata hai (har index n tak jump lengths try karta hai). Koi bhi zaroori nahi: jawaab sirf ek running quantity par nirbhar karta hai.

**Fix: ek pass, furthest reachable index track karte hue**

\`\`\`js
function canJump(nums) {
  let reach = 0;                                  // ab tak furthest reachable index
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;                  // ye index kisi bhi cheez ke aage hai jispar hum pahunch sakte hain
    reach = Math.max(reach, i + nums[i]);         // i par khade, hum ab i + nums[i] tak pahunch sakte hain
    if (reach >= nums.length - 1) return true;    // last index reach ke andar -> done
  }
  return true;
}
\`\`\`

\`\`\`ts
function canJump(nums: number[]): boolean {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]!);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}
\`\`\`

Invariant: index \`i\` process karne ke baad, \`reach\` sirf indices \`0..i\` istemal karke furthest reachable index hai. Agar scan pointer \`i\` kabhi \`reach\` se zyaada ho jaata hai, koi earlier index \`i\` par ya iske aage utarne ke liye kaafi door launch nahi kar sakta tha, isliye aap atak gaye. Warna, \`reach\` tak har index reachable hai, aur \`i\` par khade hona frontier ko \`i + nums[i]\` tak extend karta hai. O(n) time, O(1) space.

**Wahi shape: gas station (running fuel balance)**

\`\`\`js
// gas[i] station i par fuel; cost[i] i se i+1 tak drive karne ka fuel (circular).
// Wo unique start index return karo jahaan se aap loop poora kar sakte ho, ya -1.
function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const net = gas[i] - cost[i];
    total += net;
    tank += net;
    if (tank < 0) {                               // 'start' se station i ke aage nahi jaa sakte
      start = i + 1;                               // toh i ke baad fresh start try karo
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;                  // feasible jab total fuel >= total cost
}
\`\`\`

Yahaan running quantity \`tank\` hai. Jab bhi ye zero se neeche jaata hai, current \`start\` yahaan pahunchne mein fail hota hai, aur — greedy insight — purane start aur yahaan ke beech *koi* index bhi ek valid start nahi ho sakta, isliye aap \`start\` ko \`i + 1\` par jump karte ho. Ek pass.`,

    content: `## Partition labels: segment end = the max last-occurrence seen

\`\`\`js
// Split s into the most parts so that each letter appears in at most one part.
function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;   // last index of each character

  const sizes = [];
  let segStart = 0, segEnd = 0;
  for (let i = 0; i < s.length; i++) {
    segEnd = Math.max(segEnd, last[s[i]]);              // this segment must reach at least here
    if (i === segEnd) {                                 // every char so far ends by here -> cut
      sizes.push(i - segStart + 1);
      segStart = i + 1;
    }
  }
  return sizes;
}
\`\`\`

The running quantity is \`segEnd\`, the furthest index any character seen in the current segment must extend to. When the scan pointer catches up to \`segEnd\`, the segment is complete — no character in it appears later — so cut. This is structurally identical to jump game: a scan, one running "how far must this reach" number, and a condition that closes the current piece.

## The family, and what the running quantity is in each

\`\`\`
Jump game (reachable?)          reach   = furthest index reachable so far
Jump game II (fewest jumps)     end     = end of the current jump's range;
                                farthest = best next range; jumps++ when i hits end
Gas station                     tank    = running fuel; total = net over the loop
Partition labels                segEnd  = max last-occurrence in the current segment
Best time to buy/sell stock     minSoFar= lowest price seen; profit = max(price - minSoFar)
Container with most water        two pointers; move the shorter wall inward
Trapping rain water (2-pointer)  leftMax / rightMax running maxima
\`\`\`

Every one is: iterate once, keep O(1) running state, make each decision from that state. Recognising the family means you stop reaching for DP on problems a single pass solves.

## Why the gas-station "jump start to i+1" is safe

\`\`\`
Suppose starting at s, the tank goes negative for the first time at station i
(so the partial sums s..i-1 were all >= 0, and adding station i made it < 0).

Claim: no index t in [s, i] can be a valid start.
  For any such t, the drive from t must pass through the same stations up to i.
  The partial sum from t to i-1 is (sum from s to i-1) minus (sum from s to t-1).
  The second term was >= 0 (it was a prefix that never went negative). So the
  sum from t to i-1 is <= the sum from s to i-1, and adding station i still
  makes it negative. t fails too.
Therefore the next candidate is i+1, and we never need to re-examine s..i.
\`\`\`

That argument is why the single pass is correct and not just a heuristic — it is the exchange-style reasoning from lesson 1 applied to prefixes.

## When a "single pass" greedy is NOT enough

\`\`\`
If the decision at position i depends on future values you have not seen, a
forward pass alone fails. Fixes:
  - precompute a suffix array first (partition labels precomputes last-occurrence)
  - do a backward pass, or two passes (trapping rain water can be done as
    prefix-max and suffix-max arrays, then a third combining pass)
  - if each decision needs the best of a sliding set, use a monotonic deque
    or a heap alongside the pass
\`\`\`

The single-pass-one-invariant pattern is powerful but specific: it works when the current decision is a function of a bounded running summary of the past (and, via precomputation, sometimes a fixed fact about the future).`,

    contentHi: `## Partition labels: segment end = dekhi gayi max last-occurrence

\`\`\`js
// s ko sabse zyaada parts mein split karo taaki har letter zyaada se zyaada ek part mein aaye.
function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;   // har character ka last index

  const sizes = [];
  let segStart = 0, segEnd = 0;
  for (let i = 0; i < s.length; i++) {
    segEnd = Math.max(segEnd, last[s[i]]);              // is segment ko kam se kam yahaan tak pahunchna hai
    if (i === segEnd) {                                 // ab tak har char yahaan tak khatam -> cut
      sizes.push(i - segStart + 1);
      segStart = i + 1;
    }
  }
  return sizes;
}
\`\`\`

Running quantity \`segEnd\` hai, sabse door index jispar current segment mein dekha gaya koi character extend karega. Jab scan pointer \`segEnd\` tak pakadta hai, segment poora hai — ismein koi character baad mein nahi aata — isliye cut karo. Ye jump game se structurally identical hai: ek scan, ek running "ise kitna door pahunchna hai" number, aur ek condition jo current piece band karti hai.

## Family, aur har ek mein running quantity kya hai

\`\`\`
Jump game (reachable?)          reach   = ab tak furthest reachable index
Jump game II (fewest jumps)     end     = current jump ki range ka end;
                                farthest = best next range; jumps++ jab i end par
Gas station                     tank    = running fuel; total = loop par net
Partition labels                segEnd  = current segment mein max last-occurrence
Best time to buy/sell stock     minSoFar= dekhi gayi lowest price; profit = max(price - minSoFar)
Container with most water        two pointers; chhoti wall ko andar move karo
Trapping rain water (2-pointer)  leftMax / rightMax running maxima
\`\`\`

Har ek hai: ek baar iterate karo, O(1) running state rakho, har decision us state se karo. Family pehchaanna matlab aap un problems par DP ki taraf pahunchna band karte ho jinhe ek akela pass solve karta hai.

## Gas-station "start ko i+1 par jump karo" safe kyun hai

\`\`\`
Maano s par shuru karke, tank pehli baar station i par negative jaata hai
(toh partial sums s..i-1 sab >= 0 the, aur station i jodne se ye < 0 hua).

Daawa: koi index t in [s, i] ek valid start nahi ho sakta.
  Kisi bhi aise t ke liye, t se drive ko i tak wahi stations se guzarna chahiye.
  t se i-1 tak partial sum (s se i-1 tak sum) minus (s se t-1 tak sum) hai.
  Doosra term >= 0 tha (ye ek prefix tha jo kabhi negative nahi gaya). Toh
  t se i-1 tak sum <= s se i-1 tak sum hai, aur station i jodne se abhi bhi
  ye negative ho jaata hai. t bhi fail hota hai.
Isliye agla candidate i+1 hai, aur humein kabhi s..i dobara examine nahi karna.
\`\`\`

Wo argument wajah hai ki single pass sahi hai aur sirf ek heuristic nahi — ye lesson 1 ka exchange-style tark prefixes par lagaya gaya hai.

## Jab ek "single pass" greedy KAAFI NAHI hai

\`\`\`
Agar position i par decision future values par nirbhar karta hai jo aapne nahi
dekhi, akela forward pass fail hota hai. Fixes:
  - pehle ek suffix array precompute karo (partition labels last-occurrence precompute karta hai)
  - ek backward pass karo, ya do passes (trapping rain water prefix-max aur
    suffix-max arrays ki tarah kiya jaa sakta hai, phir ek teesra combining pass)
  - agar har decision ko ek sliding set ka best chahiye, pass ke saath ek
    monotonic deque ya ek heap istemal karo
\`\`\`

Single-pass-one-invariant pattern shaktishaali par specific hai: ye tab kaam karta hai jab current decision past ke ek bounded running summary ka function hai (aur, precomputation ke zariye, kabhi future ke baare mein ek fixed fact ka).`,

    examples: [
      {
        title: 'Broken: jump game by recursion over every jump length',
        titleHi: 'Toota: jump game har jump length par recursion se',
        code: `for (let step = 1; step <= nums[i]; step++)
  if (canJumpBrute(nums, i + step)) return true;`,
        codeJs: `function canJumpBrute(nums, i = 0) {
  if (i >= nums.length - 1) return true;
  for (let step = 1; step <= nums[i]; step++)
    if (canJumpBrute(nums, i + step)) return true;
  return false;
}
console.log(canJumpBrute([2, 3, 1, 1, 4])); // true  — but exponential`,
        codeTs: `function canJumpBrute(nums: number[], i = 0): boolean {
  if (i >= nums.length - 1) return true;
  for (let step = 1; step <= nums[i]!; step++)
    if (canJumpBrute(nums, i + step)) return true;
  return false;
}`,
        output: `true`,
        explain: 'Each index branches into up to nums[i] calls and the subtrees overlap. Even memoised it is O(n^2), and it hides the fact that only one running number matters.',
        explainHi: 'Har index nums[i] tak calls mein branch karta hai aur subtrees overlap karti hain. Memoised bhi ye O(n^2) hai, aur ye chhupa deta hai ki sirf ek running number maayne rakhta hai.',
      },
      {
        title: 'Fixed: track the furthest reachable index',
        titleHi: 'Theek: furthest reachable index track karo',
        code: `if (i > reach) return false;
reach = Math.max(reach, i + nums[i]);`,
        codeJs: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}
console.log(canJump([2, 3, 1, 1, 4])); // true
console.log(canJump([3, 2, 1, 0, 4])); // false  (index 3 has 0 jump, reach stalls at 3)`,
        codeTs: `function canJump(nums: number[]): boolean {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]!);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}`,
        outputJs: `true
false`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'reach is the furthest index reachable using indices 0..i. If the scan pointer passes reach, nothing earlier could launch far enough, so you are stuck. O(n), O(1).',
        explainHi: 'reach indices 0..i istemal karke furthest reachable index hai. Agar scan pointer reach paar karta hai, kuch bhi earlier kaafi door launch nahi kar sakta tha, isliye aap atak gaye. O(n), O(1).',
      },
      {
        title: 'Gas station: running tank, jump start on a deficit',
        titleHi: 'Gas station: running tank, deficit par start jump karo',
        code: `tank += gas[i] - cost[i];
if (tank < 0) { start = i + 1; tank = 0; }`,
        codeJs: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const net = gas[i] - cost[i];
    total += net;
    tank += net;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total >= 0 ? start : -1;
}
console.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])); // 3`,
        codeTs: `function canCompleteCircuit(gas: number[], cost: number[]): number {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const net = gas[i]! - cost[i]!;
    total += net;
    tank += net;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total >= 0 ? start : -1;
}`,
        outputJs: `3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'If total net fuel is negative the loop is impossible. Otherwise, the first index after the last point where the running tank went negative is the unique valid start — one pass proves it.',
        explainHi: 'Agar total net fuel negative hai loop asambhav hai. Warna, aakhri point ke baad ka pehla index jahaan running tank negative gaya wo unique valid start hai — ek pass ise saabit karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// jump game: checking i >= reach instead of i > reach
if (i >= reach) return false;   // rejects the case where i == reach but nums[i] can still extend`,
        right: `if (i > reach) return false;    // i == reach is fine — you're standing on the frontier`,
        why: 'When i equals reach you are exactly at the furthest reachable index, which is a valid position to be in; from there nums[i] may extend the frontier. Only i strictly greater than reach is unreachable.',
        whyHi: 'Jab i reach ke barabar hai aap bilkul furthest reachable index par ho, jo ek valid position hai; wahaan se nums[i] frontier extend kar sakta hai. Sirf i jo reach se sakhti se zyaada hai unreachable hai.',
      },
      {
        wrong: `// gas station: returning start without checking total >= 0
return start;   // 'start' is only valid if the loop is feasible at all`,
        right: `return total >= 0 ? start : -1;   // feasible iff total fuel covers total cost`,
        why: 'The single pass computes the correct start ASSUMING a valid start exists. It exists iff sum(gas) >= sum(cost). Without that check you return a start for an impossible circuit.',
        whyHi: 'Single pass sahi start compute karta hai YE MAANKAR ki ek valid start maujood hai. Ye maujood hai jab sum(gas) >= sum(cost). Us check ke bina aap ek asambhav circuit ke liye ek start return karte ho.',
      },
      {
        wrong: `// partition labels: not precomputing last-occurrence, deciding cuts on the fly
if (s.indexOf(s[i], i + 1) === -1) cut();   // O(n) inside the loop -> O(n^2)`,
        right: `const last = {};
for (let i = 0; i < s.length; i++) last[s[i]] = i;   // one O(n) pass first
// then the main loop uses last[s[i]] in O(1)`,
        why: 'The cut decision needs a fixed fact about the future (each char\'s last position). Precompute it in one pass so the main pass stays O(n); computing it inside the loop makes the whole thing O(n^2).',
        whyHi: 'Cut decision ko future ke baare mein ek fixed fact chahiye (har char ki last position). Ise ek pass mein precompute karo taaki main pass O(n) rahe; ise loop ke andar compute karna poori cheez ko O(n^2) banaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Streaming stats** — running max, running min, running sum, "best so far" — are single-pass greedy invariants used everywhere in monitoring and analytics dashboards.',
        hi: '**Streaming stats** — running max, running min, running sum, "best so far" — single-pass greedy invariants hain jo monitoring aur analytics dashboards mein har jagah istemal hote hain.',
      },
      {
        en: '**Buffer and playback logic** — "can we keep the video playing given the download rate?" — is a gas-station-style running-balance check over time.',
        hi: '**Buffer aur playback logic** — "kya hum download rate ke hisaab se video chalte rakh sakte hain?" — samay par ek gas-station-style running-balance check hai.',
      },
      {
        en: '**Text layout and log rotation** cut segments when a running measure (line width, file size, time window) crosses a threshold — the partition-labels shape.',
        hi: '**Text layout aur log rotation** segments cut karte hain jab ek running measure (line width, file size, time window) ek threshold paar karta hai — partition-labels shape.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the invariant that makes the O(n) jump game work, and why it is correct rather than just a plausible shortcut.',
        qHi: 'Wo invariant samjhaao jo O(n) jump game ko kaam karvaata hai, aur ye sirf ek plausible shortcut ke bajaye sahi kyun hai.',
        a: 'The variable reach holds the furthest array index that can be arrived at using only jumps that start from indices we have already scanned, that is indices zero through the current i. Two facts keep this invariant true and make the answer fall out. First, if at any point the scan index i is strictly greater than reach, then no index from zero to i minus one can launch a jump that lands on i or beyond, because reach already accounts for the best jump available from every one of those indices. So i is genuinely unreachable, and since every index from i onward can only be reached by first standing on i or an earlier index, the last index is unreachable too, and we can return false immediately. Second, as long as i is less than or equal to reach, index i is itself reachable, because every index up to reach is reachable by the invariant. Standing on a reachable index i, we can now jump up to nums of i further, so we update reach to the maximum of its old value and i plus nums of i. The moment reach is at least the last index, we know the last index is reachable and return true. The correctness is not heuristic: the invariant is a precise claim, we check it holds at the start (reach is zero, i is zero, and zero is trivially reachable), and each loop iteration preserves it. It is the same style as a loop invariant proof, just with a greedy quantity instead of, say, a running sum.',
        aHi: 'Variable reach wo furthest array index rakhta hai jispar sirf un jumps se pahuncha jaa sakta hai jo un indices se shuru hote hain jo hum pehle se scan kar chuke hain, matlab indices zero se current i. Do tathya is invariant ko sach rakhte hain aur jawaab nikaalte hain. Pehla, agar kisi bhi point par scan index i reach se sakhti se zyaada hai, toh zero se i minus one tak koi index ek jump launch nahi kar sakta jo i par ya iske aage utre, kyunki reach pehle se un har indices se available best jump ka hisaab rakhta hai. Toh i sach mein unreachable hai, aur kyunki i se aage har index pehle i ya ek earlier index par khade hokar hi pahuncha jaa sakta hai, last index bhi unreachable hai, aur hum turant false return kar sakte hain. Doosra, jab tak i reach se kam ya barabar hai, index i khud reachable hai, kyunki invariant se reach tak har index reachable hai. Ek reachable index i par khade, hum ab nums of i tak aage jump kar sakte hain, isliye hum reach ko iski purani value aur i plus nums of i ke maximum par update karte hain. Jis pal reach kam se kam last index hai, hum jaante hain last index reachable hai aur true return karte hain. Correctness heuristic nahi hai: invariant ek thik-thik daawa hai, hum check karte hain ye shuru mein hold karta hai, aur har loop iteration ise preserve karti hai.',
      },
      {
        q: 'How do you recognise that a problem is a "single forward pass with one running invariant" rather than a DP problem?',
        qHi: 'Aap kaise pehchaante ho ki ek problem "ek forward pass ek running invariant ke saath" hai na ki ek DP problem?',
        a: 'The tell is that the decision you make at position i depends only on a small, fixed-size summary of what you have seen so far, not on the full history of choices, and there is no need to compare multiple ways of having reached position i. In jump game, all you need at index i is one number, the furthest reachable index; you do not care how you got there or which jumps you took. In gas station, all you need is the running tank balance and the running total; the specific stations visited do not matter. In partition labels, you need the maximum last-occurrence among characters in the current segment, again one number. Contrast this with a DP problem, where the same position can be reached in many ways with different consequences for the future, so you must remember the best value for each distinct sub-state and let later steps choose among them. The knapsack has state (item index, remaining capacity) precisely because two different sets of earlier choices can arrive at the same item index with different remaining capacities, and both are worth tracking. If you find yourself wanting to memoise a function of more than one or two small parameters, or you are taking a max or min over several predecessor states, that is DP. If a single scalar or a couple of scalars, updated once per element with a simple rule, fully determine the next decision, it is a single-pass greedy. A good habit is to first ask "what is the minimum information I need to carry forward to make each decision", and if the answer is O of one, try the pass before reaching for a table.',
        aHi: 'Tell ye hai ki position i par jo decision aap karte ho wo sirf ab tak dekhi cheez ke ek chhote, fixed-size summary par nirbhar karta hai, choices ki poori history par nahi, aur position i par pahunchne ke kayi tarike compare karne ki zaroorat nahi. Jump game mein, aapko index i par sirf ek number chahiye, furthest reachable index; aap parwaah nahi karte aap wahaan kaise pahunche ya kaunse jumps liye. Gas station mein, aapko sirf running tank balance aur running total chahiye; specific stations visited maayne nahi rakhte. Partition labels mein, aapko current segment mein characters ke beech maximum last-occurrence chahiye, phir ek number. Ise ek DP problem se contrast karo, jahaan wahi position kayi tarikon se pahunchi jaa sakti hai future ke liye alag parinaamon ke saath, isliye aapko har distinct sub-state ke liye best value yaad rakhni chahiye. Knapsack ka state (item index, remaining capacity) bilkul isliye hai kyunki earlier choices ke do alag sets wahi item index par alag remaining capacities ke saath pahunch sakte hain. Agar aap ek se do se zyaada chhote parameters ke ek function ko memoise karna chahte ho, ya aap kai predecessor states par max ya min le rahe ho, wo DP hai. Agar ek akela scalar ya kuch scalars, prati element ek baar ek saral rule se update kiye, agla decision poori tarah tay karte hain, ye ek single-pass greedy hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement canJump (O(n) reach) and canJumpBrute (recursion). Test on [2,3,1,1,4] (true), [3,2,1,0,4] (false), [0] (true), [1,0,1] (false). Confirm they always agree for small inputs.',
        taskHi: 'canJump (O(n) reach) aur canJumpBrute (recursion) implement karo. [2,3,1,1,4] (true), [3,2,1,0,4] (false), [0] (true), [1,0,1] (false) par test karo. Confirm karo wo small inputs ke liye hamesha sahmat hain.',
        hint: 'For [3,2,1,0,4]: reach becomes 3 at i=0, stays 3 through i=1,2,3 (nums[3]=0), then at i=4 the check i > reach (4 > 3) fires -> false.',
        hintHi: '[3,2,1,0,4] ke liye: i=0 par reach 3 ban jaata hai, i=1,2,3 tak 3 rehta hai (nums[3]=0), phir i=4 par check i > reach (4 > 3) fire hota hai -> false.',
      },
      {
        task: 'Implement canCompleteCircuit for gas station. Test on gas=[1,2,3,4,5] cost=[3,4,5,1,2] (expect 3) and gas=[2,3,4] cost=[3,4,3] (expect -1). Then implement jump game II (fewest jumps to the end) with the end/farthest invariant.',
        taskHi: 'Gas station ke liye canCompleteCircuit implement karo. gas=[1,2,3,4,5] cost=[3,4,5,1,2] (3 expect karo) aur gas=[2,3,4] cost=[3,4,3] (-1 expect karo) par test karo. Phir jump game II (end tak fewest jumps) end/farthest invariant ke saath implement karo.',
        hint: 'Jump game II: farthest = max reach seen; when i reaches the end of the current jump range, jumps++ and set the new range end to farthest.',
        hintHi: 'Jump game II: farthest = dekhi gayi max reach; jab i current jump range ke end tak pahunchta hai, jumps++ aur naye range end ko farthest set karo.',
      },
      {
        task: 'Implement partitionLabels. Test on "ababcbacadefegdehijhklij" (expect [9, 7, 8]). Verify each returned segment length by confirming no character in it appears outside it.',
        taskHi: 'partitionLabels implement karo. "ababcbacadefegdehijhklij" par test karo ([9, 7, 8] expect karo). Har returned segment length verify karo yeh confirm karke ki ismein koi character iske bahar nahi aata.',
        hint: 'First pass: last[c] = last index of c. Second pass: segEnd = max(segEnd, last[s[i]]); when i === segEnd, close the segment.',
        hintHi: 'Pehla pass: last[c] = c ka last index. Doosra pass: segEnd = max(segEnd, last[s[i]]); jab i === segEnd, segment band karo.',
      },
    ],

    keyTakeaways: [
      'A large family of problems is solved by a single forward pass that maintains ONE running quantity, making each decision from that quantity alone — O(n) time, O(1) space.',
      'Jump game: track `reach`, the furthest index reachable using indices 0..i. If the scan pointer passes `reach`, you are stuck; otherwise extend `reach` to max(reach, i + nums[i]).',
      'Gas station: track the running `tank`; whenever it goes negative, the current start (and every index up to here) fails, so jump start to i+1. Feasible iff total gas >= total cost.',
      'Partition labels: precompute each character\'s last occurrence, then track `segEnd` (max last-occurrence in the current segment); cut when the scan pointer reaches `segEnd`.',
      'These are correct, not heuristic: each has a loop-invariant / exchange-style proof that the running quantity captures everything needed for the next decision.',
      'It is a single-pass greedy (not DP) when the decision at i depends only on a bounded running summary of the past, possibly plus a precomputed fact about the future.',
    ],
    keyTakeawaysHi: [
      'Problems ka ek bada family ek akele forward pass se solve hota hai jo EK running quantity maintain karta hai, har decision sirf us quantity se karta hua — O(n) time, O(1) space.',
      'Jump game: `reach` track karo, indices 0..i istemal karke furthest reachable index. Agar scan pointer `reach` paar karta hai, aap atak gaye; warna `reach` ko max(reach, i + nums[i]) tak extend karo.',
      'Gas station: running `tank` track karo; jab bhi ye negative jaata hai, current start (aur yahaan tak har index) fail hota hai, isliye start ko i+1 par jump karo. Feasible jab total gas >= total cost.',
      'Partition labels: har character ki last occurrence precompute karo, phir `segEnd` track karo (current segment mein max last-occurrence); cut karo jab scan pointer `segEnd` tak pahunche.',
      'Ye sahi hain, heuristic nahi: har ek ka ek loop-invariant / exchange-style proof hai ki running quantity agle decision ke liye zaroori sab kuch capture karti hai.',
      'Ye ek single-pass greedy hai (DP nahi) jab i par decision sirf past ke ek bounded running summary par nirbhar karta hai, shayad plus future ke baare mein ek precomputed fact.',
    ],
  },
];
