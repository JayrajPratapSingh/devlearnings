/**
 * DSA Complete Course — Module 12: Greedy Algorithms, lesson 1.
 *
 * What a greedy algorithm is, and how to know when a locally-optimal choice is
 * globally optimal — via the "exchange argument", using interval / activity
 * selection as the running example. Builds on this course's Module 10 (sorting)
 * and Module 11 (this problem CAN be solved with DP, but greedy is O(n log n)
 * and much simpler when it applies). Broken example: choosing the maximum number
 * of non-overlapping meetings by repeatedly taking the meeting that starts
 * earliest (or the shortest meeting) among those that still fit — both of these
 * are locally reasonable and both produce fewer meetings than the optimum on
 * simple inputs. Fixed by sorting the meetings by END time and repeatedly taking
 * the next meeting whose start is at or after the last chosen meeting's end.
 * The lesson proves this greedy is optimal with an exchange argument: any
 * optimal solution can be transformed, one swap at a time, into the greedy
 * solution without reducing the count.
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

export const DSA_MODULE_12: CourseLesson[] = [
  {
    slug: 'greedy-exchange-argument-interval-scheduling',
    title: 'Greedy: The Exchange Argument (Interval Scheduling)',
    titleHi: 'Greedy: Exchange Argument (Interval Scheduling)',
    description: 'Fitting the most non-overlapping meetings into a room by always taking the meeting that starts earliest among those that still fit. It sounds sensible, but a single long early meeting can block two shorter later ones, so this rule produces fewer meetings than possible. Taking the shortest meeting first fails too, for a similar reason.',
    descriptionHi: 'Ek room mein sabse zyaada non-overlapping meetings fit karna hamesha wo meeting lekar jo abhi bhi fit hone waalon mein sabse pehle shuru hoti hai. Ye samajhdaar lagta hai, par ek akeli lambi early meeting do chhoti later meetings ko block kar sakti hai, isliye ye rule mumkin se kam meetings banaata hai. Sabse chhoti meeting pehle lena bhi fail hota hai, ek samaan kaaran se.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Booking as many back-to-back appointments as possible into one working day, when clients have offered you fixed time windows.** Each client can only come at their stated window — say, 9 to 11, or 10 to 10:30. You want to serve the largest number of clients, and you can only see one at a time. The instinct to "take whoever is available earliest" backfires: if you accept the 9-to-11 client, you have burned the whole morning on one person and turned away the 9-to-9:30 and the 9:30-to-10:30 clients you could have served instead. The instinct to "take the shortest appointment first" backfires too — a quick 12-to-12:15 slot in the middle of the day can sit between two longer appointments you would rather have kept. The rule that actually works: among the appointments you can still take, always accept the one that FINISHES earliest. Finishing early leaves the maximum amount of the day open for everything after it, and it can be proven that you never regret this choice — whatever the best possible schedule is, you can always swap its first appointment for the earliest-finishing one without serving fewer clients.',
      hi: '**Ek working day mein jitni ho sake utni back-to-back appointments book karna, jab clients ne aapko fixed time windows offer ki hain.** Har client sirf apni batayi window par aa sakta hai — maano, 9 se 11, ya 10 se 10:30. Aap sabse zyaada clients serve karna chahte ho, aur aap ek baar mein ek dekh sakte ho. "Jo sabse pehle available hai use lo" ka instinct ulta padta hai: agar aap 9-se-11 client accept karte ho, aapne poora morning ek vyakti par jalaa diya aur 9-se-9:30 aur 9:30-se-10:30 clients ko turn away kar diya jinhe aap iske bajaye serve kar sakte the. "Sabse chhoti appointment pehle lo" ka instinct bhi ulta padta hai — din ke beech mein ek quick 12-se-12:15 slot do lambi appointments ke beech baith sakta hai jinhe aap rakhna pasand karte. Jo rule sach mein kaam karta hai: jo appointments aap abhi bhi le sakte ho unmein, hamesha wo accept karo jo sabse pehle KHATAM hoti hai. Jaldi khatam hona iske baad har cheez ke liye din ki maximum maatra khuli chhodta hai, aur ye saabit kiya jaa sakta hai ki aap is choice par kabhi pachhtaate nahi — jo bhi best sambhaavit schedule hai, aap hamesha iski pehli appointment ko earliest-finishing waali se swap kar sakte ho bina kam clients serve kiye.',
    },

    simple: `**Start broken.** Maximum non-overlapping intervals, by earliest start time:

\`\`\`js
function maxMeetingsBroken(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // by START time
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}

// intervals = [[1, 10], [2, 3], [4, 5]]
// sorted by start: [[1,10], [2,3], [4,5]]
// take [1,10] (count 1, lastEnd 10). [2,3] starts before 10 -> skip. [4,5] -> skip.
// result: 1.  The optimum is 2:  [2,3] and [4,5].
\`\`\`

Earliest start is a bad rule because one interval that starts early but ends late consumes the whole timeline. Sorting by shortest duration also fails: a short interval can straddle the boundary between two longer non-overlapping ones and knock both out.

**The fix: sort by END time, take greedily**

\`\`\`js
function maxMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);   // by END time
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {          // this meeting starts after the last one we kept
      count++;
      lastEnd = end;
    }
  }
  return count;
}
\`\`\`

\`\`\`ts
function maxMeetings(intervals: [number, number][]): number {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}
\`\`\`

Sort the intervals by their end time. Scan through them; whenever an interval starts at or after the end of the last one you accepted, accept it and update \`lastEnd\`. That is it: O(n log n) for the sort, O(n) for the scan.

**Why "earliest finishing" is provably optimal: the exchange argument**

\`\`\`
Claim: the greedy schedule G (always take the earliest-finishing compatible
interval) is as large as any optimal schedule O.

Proof sketch (exchange):
  Sort both G and O by finish time. Let g1 be G's first interval and o1 be O's
  first. By construction g1 finishes no later than o1 (greedy picked the
  earliest-finishing one available). So replacing o1 with g1 in O:
    - still valid: g1 finishes no later than o1, so it does not overlap O's
      second interval any more than o1 did.
    - same size: we swapped one interval for one interval.
  Now O and G agree on the first interval. Repeat the argument on the rest.
  After at most |O| swaps, O has been turned into G with no loss of size, so
  |G| >= |O|. Since O is optimal, |G| = |O|.
\`\`\`

The exchange argument is the standard way to prove a greedy algorithm optimal: show that any optimal solution can be edited, one greedy choice at a time, into the greedy solution without ever getting worse.`,

    simpleHi: `**Toote hue se shuru.** Maximum non-overlapping intervals, earliest start time se:

\`\`\`js
function maxMeetingsBroken(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // START time se
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}

// intervals = [[1, 10], [2, 3], [4, 5]]
// start se sorted: [[1,10], [2,3], [4,5]]
// [1,10] lo (count 1, lastEnd 10). [2,3] 10 se pehle shuru -> skip. [4,5] -> skip.
// result: 1.  Optimum 2 hai:  [2,3] aur [4,5].
\`\`\`

Earliest start ek kharab rule hai kyunki ek interval jo jaldi shuru hota hai par der se khatam hota hai poora timeline khapat karta hai. Sabse chhoti duration se sort karna bhi fail hota hai: ek chhota interval do lambe non-overlapping ones ke beech boundary par straddle kar sakta hai aur dono ko knock out kar sakta hai.

**Fix: END time se sort karo, greedily lo**

\`\`\`js
function maxMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);   // END time se
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {          // ye meeting aakhri wali jo humne rakhi uske baad shuru hoti hai
      count++;
      lastEnd = end;
    }
  }
  return count;
}
\`\`\`

\`\`\`ts
function maxMeetings(intervals: [number, number][]): number {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}
\`\`\`

Intervals ko unke end time se sort karo. Unke through scan karo; jab bhi ek interval aapke accept kiye aakhri ke end par ya baad shuru hota hai, ise accept karo aur \`lastEnd\` update karo. Bas itna: sort ke liye O(n log n), scan ke liye O(n).

**"Earliest finishing" saabit roop se optimal kyun hai: exchange argument**

\`\`\`
Daawa: greedy schedule G (hamesha earliest-finishing compatible interval lo)
kisi bhi optimal schedule O jitna bada hai.

Proof sketch (exchange):
  G aur O dono ko finish time se sort karo. G ka pehla interval g1 ho aur O ka
  pehla o1. Nirmaan se g1, o1 se der se khatam nahi hota (greedy ne available
  earliest-finishing wala chuna). Toh O mein o1 ko g1 se replace karna:
    - abhi bhi valid: g1, o1 se der se khatam nahi hota, isliye ye O ke doosre
      interval se o1 se zyaada overlap nahi karta.
    - wahi size: humne ek interval ke liye ek interval swap kiya.
  Ab O aur G pehle interval par sahmat hain. Baaki par argument dohraao.
  Zyaada se zyaada |O| swaps ke baad, O size mein koi nuksaan ke bina G mein
  badal gaya hai, isliye |G| >= |O|. Kyunki O optimal hai, |G| = |O|.
\`\`\`

Exchange argument ek greedy algorithm ko optimal saabit karne ka standard tarika hai: dikhao ki kisi bhi optimal solution ko, ek greedy choice ek baar, greedy solution mein edit kiya jaa sakta hai bina kabhi kharab hue.`,

    content: `## What makes an algorithm "greedy"

\`\`\`
A greedy algorithm builds the answer in steps, and at each step it commits
irrevocably to whatever looks best RIGHT NOW, using a simple local rule, without
reconsidering past choices and without looking ahead.

Contrast with:
  - DP: considers all choices at each step and remembers the best (Module 11)
  - backtracking: tries a choice, and undoes it if it leads to a dead end (Module 6)
Greedy makes ONE choice per step and never takes it back.
\`\`\`

Because greedy never revisits a decision, it is usually fast — a sort plus a linear pass. The entire difficulty is knowing whether the local rule is safe. For most problems it is not. Interval scheduling is one of the clean cases where it is, and the exchange argument is the proof.

## Two properties a problem needs for greedy to be correct

\`\`\`
1. GREEDY CHOICE PROPERTY
   There is always an optimal solution that includes the greedy first choice.
   (Interval scheduling: some optimal schedule starts with the earliest-
   finishing interval — the exchange argument shows this.)

2. OPTIMAL SUBSTRUCTURE
   After making the greedy choice, what remains is a smaller instance of the
   same problem, and combining the greedy choice with an optimal solution to
   that remainder gives an optimal solution overall.
   (After taking the earliest-finishing interval, the problem is "select the
   most intervals from those that start after it ends" — same problem.)
\`\`\`

DP also needs optimal substructure. The difference is the greedy choice property: greedy claims you can pick the first piece *without evidence*, whereas DP tries all first pieces and keeps the best. When the greedy choice property genuinely holds, greedy is both correct and much faster.

## A gallery of interval-scheduling variants

\`\`\`js
// Minimum number of intervals to REMOVE so the rest do not overlap
//   = total - (max non-overlapping) -> same greedy, subtract.
function eraseOverlapIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let kept = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) if (s >= lastEnd) { kept++; lastEnd = e; }
  return intervals.length - kept;
}

// Minimum arrows to burst all balloons (intervals): one arrow per group of
// mutually overlapping intervals -> greedy on end time again.
function findMinArrows(points) {
  if (points.length === 0) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1, lastArrow = sorted[0][1];
  for (const [s, e] of sorted) {
    if (s > lastArrow) { arrows++; lastArrow = e; }   // strictly after -> need a new arrow
  }
  return arrows;
}
\`\`\`

All three are the same greedy on end time; only the accounting differs.

## When a greedy heuristic is "good enough" but not optimal

\`\`\`
Some hard problems have a greedy that is provably WITHIN A FACTOR of optimal
even though it is not exactly optimal:
  - set cover: greedy "take the set covering the most uncovered elements" is
    within a ln(n) factor of the minimum, and no polynomial algorithm does
    better (unless P = NP).
  - vertex cover: greedy "repeatedly pick both endpoints of any uncovered edge"
    is within a factor of 2.

These are approximation algorithms. If a problem is NP-hard and you need a fast
answer, a greedy with a proven approximation ratio is often the practical choice.
\`\`\`

The skill in interviews is telling apart "greedy is exactly optimal here, and here is the exchange argument" from "greedy is a reasonable heuristic but I would need DP or search for the exact answer".`,

    contentHi: `## Ek algorithm ko "greedy" kya banaata hai

\`\`\`
Ek greedy algorithm jawaab ko steps mein banaata hai, aur har step par ye
ABHI jo bhi best dikhta hai uspar irrevocably commit karta hai, ek saral local
rule istemal karke, past choices dobara soche bina aur aage dekhe bina.

Contrast:
  - DP: har step par sab choices consider karta hai aur best yaad rakhta hai (Module 11)
  - backtracking: ek choice try karta hai, aur ise undo karta hai agar ye dead end tak le jaaye (Module 6)
Greedy prati step EK choice karta hai aur ise kabhi wapas nahi leta.
\`\`\`

Kyunki greedy kabhi ek decision revisit nahi karta, ye aksar tez hai — ek sort plus ek linear pass. Poori mushkil ye jaanna hai ki local rule safe hai ya nahi. Adhikaansh problems ke liye ye nahi hai. Interval scheduling un saaf cases mein se ek hai jahaan hai, aur exchange argument proof hai.

## Do properties jo ek problem ko greedy ke sahi hone ke liye chahiye

\`\`\`
1. GREEDY CHOICE PROPERTY
   Hamesha ek optimal solution hai jo greedy pehli choice include karta hai.
   (Interval scheduling: koi optimal schedule earliest-finishing interval se
   shuru hota hai — exchange argument ise dikhaata hai.)

2. OPTIMAL SUBSTRUCTURE
   Greedy choice karne ke baad, jo bacha wo usi problem ka ek chhota instance
   hai, aur greedy choice ko us remainder ke ek optimal solution ke saath
   combine karna kul mein ek optimal solution deta hai.
   (Earliest-finishing interval lene ke baad, problem hai "un mein se sabse
   zyaada intervals select karo jo iske khatam hone ke baad shuru hote hain".)
\`\`\`

DP ko bhi optimal substructure chahiye. Farak greedy choice property hai: greedy daawa karta hai ki aap pehla piece *bina saboot* chun sakte ho, jabki DP sab pehle pieces try karta hai aur best rakhta hai. Jab greedy choice property sach mein hold karti hai, greedy sahi aur kaafi tez dono hai.

## Interval-scheduling variants ki ek gallery

\`\`\`js
// Minimum intervals HATAO taaki baaki overlap na karein
//   = total - (max non-overlapping) -> wahi greedy, subtract.
function eraseOverlapIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let kept = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) if (s >= lastEnd) { kept++; lastEnd = e; }
  return intervals.length - kept;
}

// Sab balloons (intervals) burst karne ke minimum arrows: prati group of
// mutually overlapping intervals ek arrow -> phir end time par greedy.
function findMinArrows(points) {
  if (points.length === 0) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1, lastArrow = sorted[0][1];
  for (const [s, e] of sorted) {
    if (s > lastArrow) { arrows++; lastArrow = e; }   // sakhti se baad -> naya arrow chahiye
  }
  return arrows;
}
\`\`\`

Teeno end time par wahi greedy hain; sirf accounting alag hai.

## Jab ek greedy heuristic "kaafi achhi" hai par optimal nahi

\`\`\`
Kuch mushkil problems ka ek greedy hai jo saabit roop se optimal ke EK FACTOR
KE ANDAR hai chahe ye bilkul optimal nahi:
  - set cover: greedy "sabse zyaada uncovered elements cover karne waala set lo"
    minimum ke ek ln(n) factor ke andar hai, aur koi polynomial algorithm behtar
    nahi karta (jab tak P = NP nahi).
  - vertex cover: greedy "baar-baar kisi uncovered edge ke dono endpoints pick
    karo" ek factor of 2 ke andar hai.

Ye approximation algorithms hain. Agar ek problem NP-hard hai aur aapko ek tez
jawaab chahiye, ek proven approximation ratio waala greedy aksar vyaavahaarik chunaav hai.
\`\`\`

Interviews mein skill "greedy yahaan bilkul optimal hai, aur yahaan exchange argument hai" ko "greedy ek reasonable heuristic hai par exact jawaab ke liye mujhe DP ya search chahiye" se alag batana hai.`,

    examples: [
      {
        title: 'Broken: sort by start time, one long interval blocks many',
        titleHi: 'Toota: start time se sort, ek lamba interval bahut block karta hai',
        code: `const sorted = intervals.sort((a, b) => a[0] - b[0]); // by START`,
        codeJs: `function maxMeetingsBroken(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) if (s >= lastEnd) { count++; lastEnd = e; }
  return count;
}
console.log(maxMeetingsBroken([[1, 10], [2, 3], [4, 5]])); // 1  — optimum is 2`,
        codeTs: `function maxMeetingsBroken(intervals: [number, number][]): number {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) if (s >= lastEnd) { count++; lastEnd = e; }
  return count;
}`,
        output: `1`,
        explain: 'Sorting by start time takes [1,10] first, which occupies the whole timeline and blocks [2,3] and [4,5]. Earliest start is not a safe greedy rule for this problem.',
        explainHi: 'Start time se sort karna [1,10] pehle leta hai, jo poora timeline occupy karta hai aur [2,3] aur [4,5] ko block karta hai. Earliest start is problem ke liye ek safe greedy rule nahi hai.',
      },
      {
        title: 'Fixed: sort by end time',
        titleHi: 'Theek: end time se sort karo',
        code: `const sorted = intervals.sort((a, b) => a[1] - b[1]); // by END
if (start >= lastEnd) { count++; lastEnd = end; }`,
        codeJs: `function maxMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) if (s >= lastEnd) { count++; lastEnd = e; }
  return count;
}
console.log(maxMeetings([[1, 10], [2, 3], [4, 5]])); // 2  ([2,3] and [4,5])
console.log(maxMeetings([[1,2],[2,3],[3,4],[1,3]])); // 3`,
        codeTs: `function maxMeetings(intervals: [number, number][]): number {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, lastEnd = -Infinity;
  for (const [s, e] of sorted) if (s >= lastEnd) { count++; lastEnd = e; }
  return count;
}`,
        outputJs: `2
3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The interval that finishes earliest leaves the most room for everything after it. The exchange argument proves any optimal schedule can be rewritten to start with this interval without losing count.',
        explainHi: 'Jo interval sabse pehle khatam hota hai wo iske baad har cheez ke liye sabse zyaada jagah chhodta hai. Exchange argument saabit karta hai ki koi bhi optimal schedule count khoye bina is interval se shuru hone ke liye dobara likha jaa sakta hai.',
      },
      {
        title: 'Minimum arrows to burst all intervals: same greedy',
        titleHi: 'Sab intervals burst karne ke minimum arrows: wahi greedy',
        code: `if (s > lastArrow) { arrows++; lastArrow = e; }`,
        codeJs: `function findMinArrows(points) {
  if (!points.length) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1, lastArrow = sorted[0][1];
  for (const [s, e] of sorted) if (s > lastArrow) { arrows++; lastArrow = e; }
  return arrows;
}
console.log(findMinArrows([[10,16],[2,8],[1,6],[7,12]])); // 2`,
        codeTs: `function findMinArrows(points: [number, number][]): number {
  if (!points.length) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1, lastArrow = sorted[0]![1];
  for (const [s, e] of sorted) if (s > lastArrow) { arrows++; lastArrow = e; }
  return arrows;
}`,
        outputJs: `2`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'An arrow shot at the end of the earliest-finishing interval bursts every interval overlapping that point. Sort by end, shoot at the first end, and only add an arrow when an interval starts strictly after the last shot.',
        explainHi: 'Earliest-finishing interval ke end par shot kiya ek arrow us point ko overlap karne waala har interval burst karta hai. End se sort karo, pehle end par shoot karo, aur ek arrow sirf tab add karo jab ek interval last shot ke sakhti se baad shuru hota hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// sorting by interval length ("do the quick ones first")
intervals.sort((a, b) => (a[1] - a[0]) - (b[1] - b[0]));`,
        right: `intervals.sort((a, b) => a[1] - b[1]);   // by end time`,
        why: 'A short interval can sit right on the boundary between two longer non-overlapping intervals and eliminate both. Shortest-first has an easy counterexample; earliest-end-first is provably optimal.',
        whyHi: 'Ek chhota interval do lambe non-overlapping intervals ke beech boundary par baith sakta hai aur dono ko eliminate kar sakta hai. Shortest-first ka ek aasaan counterexample hai; earliest-end-first saabit roop se optimal hai.',
      },
      {
        wrong: `// using > instead of >= for the compatibility check (or vice versa)
if (start > lastEnd) { ... }   // rejects meetings that start exactly when the last ends`,
        right: `if (start >= lastEnd) { ... }  // a meeting starting at the previous end does NOT overlap`,
        why: 'Whether [1,3] and [3,5] count as overlapping depends on the problem statement. If touching endpoints are allowed (common for meetings), use >=; if not, use >. Pick deliberately, not by accident.',
        whyHi: 'Kya [1,3] aur [3,5] overlapping ginte hain ye problem statement par nirbhar karta hai. Agar touching endpoints allowed hain (meetings ke liye aam), >= istemal karo; agar nahi, > istemal karo. Jaan-boojhkar chuno, galti se nahi.',
      },
      {
        wrong: `// assuming greedy works for the WEIGHTED version (each interval has a value,
// maximise total value of non-overlapping intervals) — it does not`,
        right: `// weighted interval scheduling needs DP: sort by end, dp[i] = max(dp[i-1],
// value[i] + dp[p(i)]) where p(i) is the last interval ending before i starts.`,
        why: 'When intervals carry values, the earliest-finishing one may be nearly worthless, and skipping it for a later high-value interval can be better. The greedy choice property fails; you need DP.',
        whyHi: 'Jab intervals values le jaate hain, earliest-finishing wala lagbhag bekaar ho sakta hai, aur ise ek later high-value interval ke liye skip karna behtar ho sakta hai. Greedy choice property fail hoti hai; aapko DP chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**Meeting-room and CPU-job scheduling** use earliest-deadline / earliest-finish greedy to maximise throughput on a single resource.',
        hi: '**Meeting-room aur CPU-job scheduling** ek single resource par throughput maximise karne ke liye earliest-deadline / earliest-finish greedy istemal karte hain.',
      },
      {
        en: '**Broadcast and ad-slot packing** — fitting the most spots into a fixed airtime window — is interval scheduling, and the earliest-end rule is what maximises the count of spots aired.',
        hi: '**Broadcast aur ad-slot packing** — ek fixed airtime window mein sabse zyaada spots fit karna — interval scheduling hai, aur earliest-end rule wahi hai jo aired spots ki count maximise karta hai.',
      },
      {
        en: '**Course / exam timetabling** uses interval-graph colouring (a close relative) to assign the minimum number of rooms so no two overlapping sessions share one.',
        hi: '**Course / exam timetabling** interval-graph colouring (ek kareebi relative) istemal karta hai minimum rooms assign karne ke liye taaki koi do overlapping sessions ek share na karein.',
      },
    ],

    interviewQA: [
      {
        q: 'State the exchange argument for interval scheduling in full, and explain what each step establishes.',
        qHi: 'Interval scheduling ke liye exchange argument poora batao, aur samjhaao ki har step kya sthaapit karta hai.',
        a: 'We want to show the greedy schedule, which repeatedly picks the compatible interval that finishes earliest, selects as many intervals as any optimal schedule. Take any optimal schedule and list its intervals in order of finish time as o1, o2, and so on. List the greedy schedule the same way as g1, g2, and so on. Compare the first intervals. The greedy algorithm, at its first step, chose from among all intervals the one that finishes earliest, so g1 finishes no later than o1, because o1 was one of the candidates greedy could have picked and greedy picked something finishing no later. Now form a new schedule from the optimal one by deleting o1 and inserting g1 in its place. This new schedule is still valid: the only interval that o1 could have conflicted with in the optimal schedule is o2, and since g1 finishes no later than o1, g1 also does not overlap o2. The new schedule has exactly the same number of intervals, because we removed one and added one. So it is another optimal schedule, and it agrees with the greedy schedule on the first interval. Now recurse: the remaining problem is to schedule intervals that start after g1 finishes, both schedules face the identical remaining instance, and by the same argument we can make the second intervals agree, then the third, and so on. Each swap preserves validity and size. After at most as many swaps as the optimal schedule has intervals, the optimal schedule has been transformed entirely into the greedy schedule without ever losing an interval. Therefore the greedy schedule has at least as many intervals as the optimal one, and since the optimal one is by definition the largest, they are equal.',
        aHi: 'Hum dikhaana chahte hain ki greedy schedule, jo baar-baar compatible interval pick karta hai jo sabse pehle khatam hota hai, kisi bhi optimal schedule jitne intervals select karta hai. Koi optimal schedule lo aur iske intervals ko finish time ke order mein o1, o2, waghaira list karo. Greedy schedule ko usi tarah g1, g2, waghaira list karo. Pehle intervals compare karo. Greedy algorithm ne, apne pehle step par, sab intervals mein se wo chuna jo sabse pehle khatam hota hai, isliye g1, o1 se der se khatam nahi hota, kyunki o1 un candidates mein se ek tha jo greedy pick kar sakta tha aur greedy ne kuch chuna jo der se khatam nahi hota. Ab optimal schedule se ek naya schedule banao o1 delete karke aur g1 iski jagah insert karke. Ye naya schedule abhi bhi valid hai: ekmatra interval jisse o1 optimal schedule mein conflict kar sakta tha wo o2 hai, aur kyunki g1, o1 se der se khatam nahi hota, g1 bhi o2 se overlap nahi karta. Naye schedule mein bilkul utne hi intervals hain, kyunki humne ek hataya aur ek jodaa. Toh ye ek aur optimal schedule hai, aur ye greedy schedule se pehle interval par sahmat hai. Ab recurse karo: baaki problem un intervals ko schedule karna hai jo g1 ke khatam hone ke baad shuru hote hain, dono schedules identical baaki instance ka saamna karte hain, aur usi argument se hum doosre intervals ko sahmat kar sakte hain, phir teesre, waghaira. Har swap validity aur size preserve karta hai. Optimal schedule mein jitne intervals hain utne swaps ke baad zyaada se zyaada, optimal schedule poori tarah greedy schedule mein badal gaya hai bina kabhi ek interval khoye. Isliye greedy schedule mein kam se kam optimal jitne intervals hain, aur kyunki optimal paribhaasha se sabse bada hai, wo barabar hain.',
      },
      {
        q: 'How do you decide, for a new problem, whether greedy will be correct or whether you need DP?',
        qHi: 'Ek nayi problem ke liye, aap kaise tay karte ho ki greedy sahi hoga ya aapko DP chahiye?',
        a: 'Start by writing down the greedy rule you are tempted to use, then actively try to break it with a small counterexample. This is the single most valuable step, because most greedy rules that feel right are wrong, and a two or three element counterexample surfaces quickly if one exists. If you cannot break it after genuine effort, try to prove it with an exchange argument: assume an optimal solution that differs from the greedy one at the first choice, and show you can swap in the greedy choice without making the solution worse or invalid. If that swap always works, greedy is correct. If the swap sometimes fails, that failure case is usually itself the counterexample, and you have your answer that greedy is wrong. When greedy fails, the reason is almost always that a locally best choice can foreclose a better global combination, which is exactly the situation dynamic programming handles by trying every first choice and keeping the best. Structural hints also help. Greedy tends to work for problems about ordering or selecting from a set where there is a clear "process items in this sorted order and make an independent decision on each" structure, and where each decision does not depend on the specific past decisions, only on a simple summary like "the end time of the last thing I kept". When the decision at each step depends on a richer history, or when the same subproblem is reachable through many different sequences of choices, that overlap points to DP. The fractional knapsack is greedy because you can always top up with a slice; the 0/1 knapsack is DP because you cannot, and a locally optimal item can block a better pair.',
        aHi: 'Jo greedy rule aap istemal karne ke liye lalchaaye ho use likhkar shuru karo, phir ek chhote counterexample se ise sakriya roop se todne ki koshish karo. Ye sabse mulyavaan step hai, kyunki adhikaansh greedy rules jo sahi lagte hain galat hain, aur ek do ya teen element counterexample jaldi saamne aa jaata hai agar ek maujood hai. Agar aap sachchi koshish ke baad ise nahi tod sakte, ise ek exchange argument se saabit karne ki koshish karo: ek optimal solution maano jo greedy se pehli choice par alag hai, aur dikhao ki aap greedy choice swap kar sakte ho bina solution ko kharab ya invalid banaaye. Agar wo swap hamesha kaam karta hai, greedy sahi hai. Agar swap kabhi fail hota hai, wo failure case aksar khud counterexample hai, aur aapke paas apna jawaab hai ki greedy galat hai. Jab greedy fail hota hai, kaaran lagbhag hamesha ye hai ki ek locally best choice ek behtar global combination ko foreclose kar sakti hai, jo bilkul wo situation hai jise dynamic programming har pehli choice try karke aur best rakhkar handle karta hai. Structural hints bhi madad karte hain. Greedy un problems ke liye kaam karta hai jo ordering ya ek set se select karne ke baare mein hain jahaan ek spasht "items ko is sorted order mein process karo aur har ek par ek swatantra decision karo" structure hai, aur jahaan har decision specific past decisions par nirbhar nahi karta, sirf ek saral summary jaise "aakhri cheez jo maine rakhi uska end time" par. Jab har step par decision ek samriddh history par nirbhar karta hai, ya jab wahi subproblem kayi alag choices ke sequences ke through reachable hai, wo overlap DP ki taraf point karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement maxMeetings (sort by end). Test on [[1,10],[2,3],[4,5]] (expect 2), [[1,2],[2,3],[3,4],[1,3]] (expect 3), and an empty list. Then implement the broken sort-by-start version and find an input where they disagree.',
        taskHi: 'maxMeetings (end se sort) implement karo. [[1,10],[2,3],[4,5]] (2 expect karo), [[1,2],[2,3],[3,4],[1,3]] (3 expect karo), aur ek empty list par test karo. Phir toota sort-by-start version implement karo aur ek input dhoondho jahaan wo asahmat hain.',
        hint: '[[1,10],[2,3],[4,5]] is the minimal disagreement: end-time greedy gets 2, start-time greedy gets 1.',
        hintHi: '[[1,10],[2,3],[4,5]] minimal asahmati hai: end-time greedy 2 paata hai, start-time greedy 1.',
      },
      {
        task: 'Implement eraseOverlapIntervals (minimum removals) and findMinArrows. Confirm eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]) is 1 and findMinArrows([[10,16],[2,8],[1,6],[7,12]]) is 2.',
        taskHi: 'eraseOverlapIntervals (minimum removals) aur findMinArrows implement karo. Confirm karo eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]) 1 hai aur findMinArrows([[10,16],[2,8],[1,6],[7,12]]) 2 hai.',
        hint: 'eraseOverlapIntervals = total - maxNonOverlapping. findMinArrows uses > (strictly after) not >= because an arrow at a shared endpoint still bursts both.',
        hintHi: 'eraseOverlapIntervals = total - maxNonOverlapping. findMinArrows > (sakhti se baad) istemal karta hai not >= kyunki ek shared endpoint par ek arrow abhi bhi dono burst karta hai.',
      },
      {
        task: 'Write a checker: given your greedy result and a brute-force result (try all 2^n subsets, keep the largest non-overlapping one) for random small inputs, confirm they always match. Then break the check by using shortest-duration sorting.',
        taskHi: 'Ek checker likho: random small inputs ke liye apna greedy result aur ek brute-force result (sab 2^n subsets try karo, sabse bada non-overlapping rakho) diye gaye, confirm karo wo hamesha match karte hain. Phir shortest-duration sorting istemal karke check ko todo.',
        hint: 'Generate 8-12 random intervals with small coordinates. The brute force is feasible up to about 20 intervals. Shortest-duration sorting will fail on some inputs; capture one.',
        hintHi: 'Chhote coordinates ke saath 8-12 random intervals generate karo. Brute force lagbhag 20 intervals tak feasible hai. Shortest-duration sorting kuch inputs par fail hogi; ek capture karo.',
      },
    ],

    keyTakeaways: [
      'A greedy algorithm builds the answer step by step, committing to the locally-best choice each time with a simple rule, and never reconsidering — so it is fast (usually a sort plus a linear pass).',
      'Interval scheduling (max non-overlapping intervals): sort by END time, then take each interval that starts at or after the last accepted interval\'s end. O(n log n).',
      'Sorting by start time or by duration both fail — one long early interval, or one short middle interval, blocks better selections.',
      'Prove greedy optimality with an exchange argument: show any optimal solution can be edited, one greedy choice at a time, into the greedy solution without ever getting worse.',
      'Greedy needs the greedy-choice property (some optimal solution includes the greedy first pick) plus optimal substructure. DP needs only the latter, and tries all first picks.',
      'The weighted version (maximise total value of non-overlapping intervals) is NOT greedy — it needs DP. Always try to break your greedy rule with a small counterexample first.',
    ],
    keyTakeawaysHi: [
      'Ek greedy algorithm jawaab ko step by step banaata hai, har baar ek saral rule se locally-best choice par commit karta hai, aur kabhi dobara nahi sochta — isliye ye tez hai (aksar ek sort plus ek linear pass).',
      'Interval scheduling (max non-overlapping intervals): END time se sort karo, phir har interval lo jo last accepted interval ke end par ya baad shuru hota hai. O(n log n).',
      'Start time se ya duration se sort karna dono fail hote hain — ek lamba early interval, ya ek chhota middle interval, behtar selections block karta hai.',
      'Greedy optimality ko ek exchange argument se saabit karo: dikhao ki kisi bhi optimal solution ko, ek greedy choice ek baar, greedy solution mein edit kiya jaa sakta hai bina kabhi kharab hue.',
      'Greedy ko greedy-choice property (koi optimal solution greedy pehli pick include karta hai) plus optimal substructure chahiye. DP ko sirf baad wala chahiye, aur sab pehli picks try karta hai.',
      'Weighted version (non-overlapping intervals ki kul value maximise karo) greedy NAHI hai — ise DP chahiye. Hamesha pehle apne greedy rule ko ek chhote counterexample se todne ki koshish karo.',
    ],
  },
];
