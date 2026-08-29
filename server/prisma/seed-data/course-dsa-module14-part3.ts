/**
 * DSA Complete Course — Module 14: Pro-Level Patterns & Interview Strategy,
 * lesson 3.
 *
 * The problem-solving conversation: the structured sequence that turns a hard
 * problem into a solved one under time pressure and observation — clarify,
 * examples, brute force + complexity, optimise, code, test, analyse — and how to
 * communicate through each phase. Builds on this module's lessons 1 and 2
 * (pattern recognition, complexity budgeting). Broken example: hearing a problem
 * and immediately writing code, which skips clarification (so you solve the
 * wrong problem), skips examples (so your mental model is fuzzy), skips the
 * brute force (so you have no fallback and no springboard), and skips talking
 * (so the interviewer cannot help you). Fixed by following the seven phases out
 * loud, spending real time in the first four before typing, and treating the
 * interviewer as a collaborator who can unblock you — the transcript of your
 * thinking is a large part of what is being evaluated.
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

export const DSA_MODULE_14_PART3: CourseLesson[] = [
  {
    slug: 'the-problem-solving-conversation',
    title: 'The Problem-Solving Conversation: Seven Phases, Out Loud',
    titleHi: 'Problem-Solving Conversation: Saat Phases, Zor Se',
    description: 'Hearing a problem and starting to type immediately. You skip asking what the inputs really are, you skip working an example, you skip stating a brute force, and you skip narrating your thinking — so you often solve a slightly different problem than the one asked, and the interviewer, who wanted to help, has nothing to grab onto.',
    descriptionHi: 'Ek problem sunna aur turant type karna shuru karna. Aap ye poochna skip karte ho ki inputs asal mein kya hain, aap ek example work karna skip karte ho, aap ek brute force batana skip karte ho, aur aap apni thinking narrate karna skip karte ho — isliye aap aksar poochi gayi problem se thodi alag problem solve karte ho, aur interviewer, jo madad karna chahta tha, ke paas pakadne ko kuch nahi.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A surgeon who talks through every step of an operation, even though they could do it silently.** The narration is not for show. It lets the team anticipate the next instrument, catch a mistake before it happens, and step in with the right help at the right moment. A silent surgeon who is suddenly stuck gives the team nothing to work with. A technical interview is the same: the interviewer is not a passive examiner watching you type, they are a collaborator who has seen this problem before and wants you to succeed, but they can only help if they can follow your reasoning. When you say out loud "I think this is a graph problem because we have connections and we want the shortest chain", the interviewer can confirm or gently redirect. When you say "I am considering a hash map here to make the lookup O(1)", they know your plan and can nudge if there is a subtlety. And when you get stuck, a stuck-out-loud candidate gets a hint; a stuck-in-silence candidate gets a slow head shake. The seven-phase sequence is just a reliable script for making sure the narration covers everything that matters.',
      hi: '**Ek surgeon jo ek operation ke har step ke through baat karta hai, chahe wo ise chupchaap kar sakte hon.** Narration show ke liye nahi hai. Ye team ko agla instrument anticipate karne, ek galti hone se pehle pakadne, aur sahi pal par sahi madad ke saath step in karne deta hai. Ek silent surgeon jo achaanak atak jaata hai team ko kaam karne ko kuch nahi deta. Ek technical interview waisa hi hai: interviewer ek passive examiner nahi hai jo aapko type karte dekh raha hai, wo ek collaborator hai jisne ye problem pehle dekhi hai aur chahta hai ki aap safal ho, par wo sirf tab madad kar sakte hain agar wo aapki reasoning follow kar sakein. Jab aap zor se kehte ho "mujhe lagta hai ye ek graph problem hai kyunki humare paas connections hain aur hum sabse chhoti chain chahte hain", interviewer confirm ya halke se redirect kar sakta hai. Jab aap kehte ho "main yahaan ek hash map consider kar raha hoon lookup ko O(1) banaane ke liye", wo aapka plan jaante hain aur nudge kar sakte hain agar koi subtlety hai. Aur jab aap atak jaate ho, ek stuck-out-loud candidate ko ek hint milti hai; ek stuck-in-silence candidate ko ek slow head shake. Saat-phase sequence bas ye sunishchit karne ke liye ek bharosemand script hai ki narration har maayne rakhne wali cheez cover karta hai.',
    },

    simple: `**Start broken.** Hear the problem, start typing:

\`\`\`
Interviewer: "Given a list of meeting time intervals, determine if a person
could attend all meetings."

You (immediately): *starts writing a nested loop comparing every pair*

Missed:
  - Are the intervals sorted? (No, but you could sort them -> O(n log n))
  - Do touching intervals [1,3] and [3,5] count as a conflict? (Ask!)
  - What is the expected output — boolean, or the conflicting pair?
  - You never said "the brute force is O(n^2) comparing all pairs; I can do
    better by sorting by start time and checking neighbours."
  - The interviewer, who wanted to nudge you toward the sort, had no opening.
\`\`\`

**The fix: seven phases, spoken**

\`\`\`
1. CLARIFY (1-2 min)
   Restate the problem in your own words. Confirm input/output types. Ask about
   edge cases: empty input, duplicates, negatives, ties, ordering, the meaning
   of boundary conditions. Ask for the size constraints.

2. EXAMPLES (1-2 min)
   Work through the given example by hand. Make up one more, including a tricky
   or edge case. Confirm your understanding of the output on each.

3. BRUTE FORCE + COMPLEXITY (2-3 min)
   State the obvious correct solution, even if slow. Give its time and space
   complexity. This is your fallback AND your springboard: the optimisation
   usually comes from spotting waste in the brute force.

4. OPTIMISE (3-5 min)
   Match features to techniques (lesson 1). Check the target complexity against
   the constraints (lesson 2). Sketch the key idea — the invariant, the
   recurrence, the data structure — and trace it on your example BY HAND.
   Get the interviewer to agree the approach is sound before coding.

5. CODE (10-15 min)
   Write it cleanly. Narrate as you go: "now I handle the empty case", "this
   loop maintains the invariant that ...". Use clear names. Keep helper logic
   in small functions.

6. TEST (2-4 min)
   Trace your code on the examples from phase 2, line by line, out loud. Check
   the edge cases you identified in phase 1. Fix bugs you find.

7. ANALYSE (1 min)
   State the final time and space complexity and justify it (states x
   transition, or passes x work per pass). Mention any trade-off or a further
   optimisation you did not have time for.
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Problem suno, type karna shuru karo:

\`\`\`
Interviewer: "Meeting time intervals ki ek list diye gaye, determine karo ki
ek vyakti sab meetings attend kar sakta hai ya nahi."

Aap (turant): *har pair compare karta ek nested loop likhna shuru*

Miss kiya:
  - Kya intervals sorted hain? (Nahi, par aap unhe sort kar sakte ho -> O(n log n))
  - Kya touching intervals [1,3] aur [3,5] ek conflict ginte hain? (Poocho!)
  - Expected output kya hai — boolean, ya conflicting pair?
  - Aapne kabhi nahi kaha "brute force O(n^2) hai sab pairs compare karke; main
    start time se sort karke aur neighbours check karke behtar kar sakta hoon."
  - Interviewer, jo aapko sort ki taraf nudge karna chahta tha, ke paas koi opening nahi.
\`\`\`

**Fix: saat phases, bole gaye**

\`\`\`
1. CLARIFY (1-2 min)
   Problem ko apne shabdon mein restate karo. Input/output types confirm karo.
   Edge cases ke baare mein poocho: empty input, duplicates, negatives, ties,
   ordering, boundary conditions ka matlab. Size constraints poocho.

2. EXAMPLES (1-2 min)
   Diye gaye example ko haath se work karo. Ek aur banao, ek tricky ya edge
   case sameet. Har par output ki apni samajh confirm karo.

3. BRUTE FORCE + COMPLEXITY (2-3 min)
   Spasht sahi solution batao, chahe slow ho. Iski time aur space complexity do.
   Ye aapka fallback AUR aapka springboard hai: optimisation aksar brute force
   mein waste spot karne se aata hai.

4. OPTIMISE (3-5 min)
   Features ko techniques se match karo (lesson 1). Target complexity ko
   constraints ke against check karo (lesson 2). Key idea sketch karo — invariant,
   recurrence, data structure — aur ise apne example par HAATH SE trace karo.
   Coding se pehle interviewer se approach sahi hone par sahmat karvao.

5. CODE (10-15 min)
   Ise saaf likho. Jaate hue narrate karo: "ab main empty case handle karta hoon",
   "ye loop invariant maintain karta hai ki ...". Saaf names istemal karo. Helper
   logic ko chhote functions mein rakho.

6. TEST (2-4 min)
   Apne code ko phase 2 ke examples par trace karo, line by line, zor se. Phase 1
   mein pehchaane edge cases check karo. Jo bugs milein theek karo.

7. ANALYSE (1 min)
   Antim time aur space complexity batao aur ise justify karo (states x
   transition, ya passes x prati pass kaam). Koi trade-off ya ek aur optimisation
   jo aapke paas samay nahi tha mention karo.
\`\`\``,

    content: `## What to say when you are stuck

\`\`\`
Silence is the worst option. Instead, narrate the stuck-ness:
  - "I am trying to find a way to avoid recomputing X. Let me think about
    whether there is a data structure that gives me X in O(1)."
  - "My greedy idea fails on this example: [trace it]. So greedy is out; that
    suggests DP, because the failure was a local choice blocking a global one."
  - "I have an O(n^2) solution. The constraint says n is 10^5, so I need
    O(n log n). The n^2 comes from the inner loop scanning for [thing] — can I
    maintain [thing] incrementally instead?"

Each of these gives the interviewer a precise place to offer a hint, and each
shows structured thinking even without the answer.
\`\`\`

## Communicating during the CODE phase

\`\`\`
- Announce structure before writing it: "I'll have a helper that does the
  partition, and the main function drives the recursion."
- Narrate invariants at the top of loops: "after this iteration, dp[i] holds
  the best answer for the prefix ending at i."
- Say what you are deferring: "I'll assume the input is non-empty for now and
  add the guard at the end."
- When you notice your own bug, say so and fix it — that is a positive signal,
  not a negative one.
\`\`\`

## Time allocation for a 45-minute interview

\`\`\`
0-2    clarify
2-4    examples
4-7    brute force + complexity
7-12   optimise (approach agreed with interviewer)
12-30  code
30-38  test and fix
38-42  analyse + discuss extensions
42-45  buffer / interviewer's questions
\`\`\`

If you are 20 minutes in and still have no viable approach, code the brute force
cleanly — a correct slow solution with good communication beats a broken fast
one, and it often earns a hint that unlocks the optimisation.

## Handling multiple problems or follow-ups

\`\`\`
Interviewers often have a follow-up ("now the array can be updated between
queries", "now do it in O(1) space", "now the graph has negative edges"). The
follow-up usually invalidates one assumption. Identify which:
  - "updates between queries"     -> you need an incremental structure (segment
                                     tree, Fenwick) instead of a one-time prefix sum
  - "O(1) extra space"            -> can you overwrite the input, or use two
                                     pointers instead of a hash set
  - "negative edges"              -> Dijkstra breaks; Bellman-Ford or DP
Name the invalidated assumption out loud before re-solving.
\`\`\`

## The meta-signal: they are hiring a colleague

\`\`\`
The interviewer is imagining working with you on a real problem. They are
watching for: do you ask good questions, do you check your assumptions, do you
reason out loud, do you take a hint gracefully, do you test your own work, are
you calm when stuck. A slightly-imperfect solution delivered this way beats a
perfect solution delivered in tense silence.
\`\`\``,

    contentHi: `## Jab aap atak jaate ho tab kya kehna hai

\`\`\`
Silence sabse kharab option hai. Iske bajaye, stuck-ness narrate karo:
  - "Main X ko recompute karne se bachne ka tarika dhoondh raha hoon. Mujhe
    sochne do ki kya koi data structure hai jo mujhe X O(1) mein deta hai."
  - "Meri greedy idea is example par fail hoti hai: [trace it]. Toh greedy out
    hai; ye DP suggest karta hai, kyunki failure ek local choice ek global ko
    block kar rahi thi."
  - "Mere paas ek O(n^2) solution hai. Constraint kehta hai n 10^5 hai, isliye
    mujhe O(n log n) chahiye. n^2 inner loop se aata hai jo [thing] ke liye scan
    karta hai — kya main [thing] incrementally maintain kar sakta hoon?"

Inmein se har ek interviewer ko ek hint offer karne ki ek thik-thik jagah deta
hai, aur har ek jawaab ke bina bhi structured thinking dikhaata hai.
\`\`\`

## CODE phase ke dauraan communicate karna

\`\`\`
- Structure ise likhne se pehle announce karo: "mera ek helper hoga jo partition
  karta hai, aur main function recursion drive karta hai."
- Loops ke top par invariants narrate karo: "is iteration ke baad, dp[i] i par
  khatam hone waale prefix ka best answer rakhta hai."
- Batao ki aap kya defer kar rahe ho: "main abhi input non-empty maanunga aur
  guard ant mein add karunga."
- Jab aap apna khud ka bug notice karo, kaho aur theek karo — wo ek positive
  signal hai, ek negative nahi.
\`\`\`

## Ek 45-minute interview ke liye time allocation

\`\`\`
0-2    clarify
2-4    examples
4-7    brute force + complexity
7-12   optimise (interviewer ke saath approach agreed)
12-30  code
30-38  test aur fix
38-42  analyse + extensions discuss karo
42-45  buffer / interviewer ke sawaal
\`\`\`

Agar aap 20 minute mein ho aur abhi bhi koi viable approach nahi hai, brute force
saaf code karo — achhe communication ke saath ek sahi slow solution ek broken
fast se behtar hai, aur ye aksar ek hint kamaata hai jo optimisation unlock karta hai.

## Multiple problems ya follow-ups handle karna

\`\`\`
Interviewers ke aksar ek follow-up hota hai ("ab array queries ke beech update ho
sakta hai", "ab ise O(1) space mein karo", "ab graph mein negative edges hain").
Follow-up aksar ek assumption invalidate karta hai. Pehchaano kaunsa:
  - "queries ke beech updates"    -> aapko ek incremental structure chahiye (segment
                                     tree, Fenwick) ek one-time prefix sum ke bajaye
  - "O(1) extra space"           -> kya aap input overwrite kar sakte ho, ya ek hash
                                     set ke bajaye two pointers istemal kar sakte ho
  - "negative edges"             -> Dijkstra tootta hai; Bellman-Ford ya DP
Re-solve karne se pehle invalidated assumption ka zor se naam do.
\`\`\`

## Meta-signal: wo ek colleague hire kar rahe hain

\`\`\`
Interviewer aapke saath ek asli problem par kaam karne ki kalpna kar raha hai. Wo
dekh rahe hain: kya aap achhe sawaal poochte ho, kya aap apni assumptions check
karte ho, kya aap zor se reason karte ho, kya aap ek hint gracefully lete ho, kya
aap apna khud ka kaam test karte ho, kya aap atakne par shaant ho. Is tarah
diya gaya ek thoda-imperfect solution ek tense silence mein diye gaye perfect
solution se behtar hai.
\`\`\``,

    examples: [
      {
        title: 'Phase 1-3: clarify, example, brute force — for "attend all meetings"',
        titleHi: 'Phase 1-3: clarify, example, brute force — "sab meetings attend karo" ke liye',
        code: `// CLARIFY: intervals unsorted; [1,3] and [3,5] do NOT conflict (touch is ok);
//          output is boolean; n up to 10^5.
// EXAMPLE: [[0,30],[5,10],[15,20]] -> false (0-30 overlaps both others)
//          [[7,10],[2,4]] -> true
// BRUTE FORCE: compare every pair -> O(n^2). n=10^5 -> 10^10 -> too slow.`,
        codeJs: `// Only AFTER stating the above do you optimise:
function canAttendAll(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);        // sort by start: O(n log n)
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;  // overlap with previous
  }
  return true;
}
console.log(canAttendAll([[0,30],[5,10],[15,20]])); // false
console.log(canAttendAll([[7,10],[2,4]]));          // true`,
        codeTs: `function canAttendAll(intervals: [number, number][]): boolean {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i]![0] < intervals[i - 1]![1]) return false;
  }
  return true;
}`,
        outputJs: `false
true`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The clarifying questions (are touches conflicts? what output?) and the brute-force statement (O(n^2), too slow for n=10^5) are what lead naturally to "sort by start, check neighbours" — O(n log n).',
        explainHi: 'Clarifying sawaal (kya touches conflicts hain? kaunsa output?) aur brute-force statement (O(n^2), n=10^5 ke liye bahut slow) wahi hain jo naturally "start se sort, neighbours check" tak le jaate hain — O(n log n).',
      },
      {
        title: 'Phase 4-5: narrate the invariant while coding',
        titleHi: 'Phase 4-5: coding ke dauraan invariant narrate karo',
        code: `// "After processing index i, 'balance' is the running sum of nums[0..i].
//  I check balance against the target each step."`,
        codeJs: `function subarraySumEqualsK(nums, k) {
  // seen[prefixSum] = how many times that prefix sum has occurred
  const seen = new Map([[0, 1]]);
  let balance = 0, count = 0;
  for (const x of nums) {
    balance += x;                         // invariant: balance = sum of everything so far
    count += seen.get(balance - k) || 0;  // subarrays ending here summing to k
    seen.set(balance, (seen.get(balance) || 0) + 1);
  }
  return count;
}
console.log(subarraySumEqualsK([1, 2, 1, 2, 1], 3)); // 4`,
        codeTs: `function subarraySumEqualsK(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]);
  let balance = 0, count = 0;
  for (const x of nums) {
    balance += x;
    count += seen.get(balance - k) ?? 0;
    seen.set(balance, (seen.get(balance) ?? 0) + 1);
  }
  return count;
}`,
        outputJs: `4`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Stating the loop invariant ("balance is the running prefix sum") out loud before and during coding lets the interviewer verify the logic in real time and catch an off-by-one before it becomes a bug.',
        explainHi: 'Loop invariant ("balance running prefix sum hai") ko coding se pehle aur ke dauraan zor se batana interviewer ko real time mein logic verify karne aur ek bug banne se pehle ek off-by-one pakadne deta hai.',
      },
      {
        title: 'Phase 6: trace the code on the example, out loud',
        titleHi: 'Phase 6: code ko example par trace karo, zor se',
        code: `// nums = [1,2,1,2,1], k = 3. Trace:
// x=1: balance 1, look for -2 (0), seen{0:1,1:1}
// x=2: balance 3, look for 0 (1) -> count 1, seen{...,3:1}
// x=1: balance 4, look for 1 (1) -> count 2
// x=2: balance 6, look for 3 (1) -> count 3
// x=1: balance 7, look for 4 (1) -> count 4`,
        codeJs: `// Confirming the trace matches the expected answer (4) before declaring done.
// Also check edge cases identified in phase 1: empty array -> 0; k = 0 with
// a [0] element -> 1 (the single zero); all negatives -> still works.`,
        codeTs: `// The by-hand trace on a concrete example is the cheapest real test.`,
        output: `4`,
        explain: 'Tracing line by line on the phase-2 example, narrating each step, is how you find bugs before the interviewer does — and demonstrates that you test your own work.',
        explainHi: 'Phase-2 example par line by line trace karna, har step narrate karte hue, wo tarika hai jisse aap interviewer se pehle bugs paate ho — aur dikhaate ho ki aap apna khud ka kaam test karte ho.',
      },
    ],

    mistakes: [
      {
        wrong: `// starting to code before agreeing an approach with the interviewer`,
        right: `// finish phases 1-4 first: clarify, example, brute force + complexity,
// then sketch the optimised approach and get a nod before typing.`,
        why: 'Coding a wrong approach wastes the bulk of the interview. The first four phases are cheap and catch misunderstandings, and the interviewer will often correct your approach in phase 4 if you let them.',
        whyHi: 'Ek galat approach code karna interview ka bulk barbaad karta hai. Pehle chaar phases saste hain aur misunderstandings pakadte hain, aur interviewer aksar phase 4 mein aapka approach correct karega agar aap unhe do.',
      },
      {
        wrong: `// going silent when stuck`,
        right: `// narrate the stuck-ness: what you are trying to avoid, which idea failed
// and why, what complexity you need versus have. This invites a targeted hint.`,
        why: 'The interviewer wants to help but can only do so if they can follow your reasoning. Silence gives them nothing; a precise description of where you are stuck gives them a place to nudge.',
        whyHi: 'Interviewer madad karna chahta hai par sirf tab kar sakta hai agar wo aapki reasoning follow kar sakein. Silence unhe kuch nahi deta; aap kahaan atke ho iska ek thik-thik vivaran unhe nudge karne ki ek jagah deta hai.',
      },
      {
        wrong: `// declaring "done" without tracing the code on the examples`,
        right: `// trace your code line by line on the phase-2 examples and the edge cases
// from phase 1 before saying it is complete.`,
        why: 'Untested code usually has an off-by-one or an unhandled edge case. Finding it yourself in phase 6 is a strong positive signal; having the interviewer find it is a weak one.',
        whyHi: 'Untested code mein aksar ek off-by-one ya ek unhandled edge case hota hai. Ise phase 6 mein khud paana ek strong positive signal hai; interviewer se paana ek weak.',
      },
    ],

    realWorld: [
      {
        en: '**Design docs and RFCs follow the same arc** — problem statement, constraints, considered alternatives (the "brute force"), chosen approach with justification, risks. The interview compresses this into 40 minutes.',
        hi: '**Design docs aur RFCs wahi arc follow karte hain** — problem statement, constraints, considered alternatives ("brute force"), justification ke saath chosen approach, risks. Interview ise 40 minute mein compress karta hai.',
      },
      {
        en: '**Pair programming and incident response are narrated by good engineers** for exactly the interview reason: it lets a colleague catch a wrong assumption or offer the missing piece before time is lost.',
        hi: '**Pair programming aur incident response achhe engineers dwara narrate kiye jaate hain** bilkul interview kaaran se: ye ek colleague ko ek galat assumption pakadne ya samay khone se pehle missing piece offer karne deta hai.',
      },
      {
        en: '**Taking a hint gracefully is a real workplace skill** — senior engineers who cannot accept a better idea from a teammate are a known team hazard; interviewers screen for the opposite.',
        hi: '**Ek hint gracefully lena ek asli workplace skill hai** — senior engineers jo ek teammate se ek behtar idea accept nahi kar sakte ek known team hazard hain; interviewers ulta screen karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why spend five to ten minutes clarifying and working examples before writing any code? Is that not wasted time?',
        qHi: 'Koi code likhne se pehle clarify karne aur examples work karne mein paanch se das minute kyun kharch karein? Kya wo barbaad samay nahi hai?',
        a: 'It is the opposite of wasted time; it is the highest-leverage part of the interview. Three things happen in those minutes. First, clarifying catches the case where you are about to solve a different problem than the one being asked. The wording of these problems is often deliberately slightly ambiguous, and questions about edge cases, input ranges, whether ties or duplicates or negatives are possible, and what exactly the output should be, resolve that ambiguity before it costs you a full implementation. Second, working an example by hand builds an accurate mental model. It is very common to think you understand a problem, start coding, and only realise mid-implementation that your understanding of the output was subtly wrong; a concrete traced example exposes that immediately. Third, and most importantly, stating the brute force and its complexity gives you both a fallback and a springboard. The fallback matters because if you run out of time on the optimal solution, a correct brute force with clear communication is still worth substantial credit. The springboard matters because the optimal solution almost always comes from looking at the brute force and asking where it does redundant work: repeated subproblems point to dynamic programming, repeated scans point to a running quantity or a better data structure, comparing all pairs points to sorting or hashing. Skipping straight to code forfeits all three of these, and the time you think you saved is usually lost several times over when you discover the approach is wrong.',
        aHi: 'Ye barbaad samay ka ulta hai; ye interview ka sabse highest-leverage hissa hai. Un minutes mein teen cheezein hoti hain. Pehli, clarifying us case ko pakadta hai jahaan aap poochi jaa rahi problem se ek alag problem solve karne waale ho. In problems ki wording aksar jaan-boojhkar thodi ambiguous hoti hai, aur edge cases, input ranges, kya ties ya duplicates ya negatives sambhav hain, aur output exactly kya hona chahiye ke baare mein sawaal, us ambiguity ko ek poore implementation ki keemat dene se pehle resolve karte hain. Doosri, ek example haath se work karna ek accurate mental model banaata hai. Ye bahut aam hai ki aap sochte ho aap ek problem samajhte ho, coding shuru karte ho, aur sirf mid-implementation realise karte ho ki output ki aapki samajh sookshm roop se galat thi; ek concrete traced example ise turant expose karta hai. Teesri, aur sabse mahatvapoorn, brute force aur iski complexity batana aapko ek fallback aur ek springboard dono deta hai. Fallback maayne rakhta hai kyunki agar aap optimal solution par samay khatam kar dete ho, achhe communication ke saath ek sahi brute force abhi bhi substantial credit ke laayak hai. Springboard maayne rakhta hai kyunki optimal solution lagbhag hamesha brute force ko dekhne aur poochne se aata hai ki ye kahaan redundant kaam karta hai.',
      },
      {
        q: 'You have coded a solution and it works on the examples. What do you do in the last few minutes?',
        qHi: 'Aapne ek solution code kiya aur ye examples par kaam karta hai. Aap aakhri kuch minutes mein kya karte ho?',
        a: 'First I state the time and space complexity explicitly and justify it, not just assert it. For a dynamic program I say the number of distinct states times the work per transition, for example this is order n times m states each done in constant time, so order n times m overall, and the space is order n times m for the table or order m if I roll it to one row. For a pass-based solution I say the number of passes times the work per element. Second I do one more targeted review of the edge cases I identified during clarification, the empty input, a single element, all elements equal, the maximum size, and any boundary condition I asked about, tracing the code quickly on each rather than assuming. Third, if there is time and the solution has an obvious weakness, I name it and describe the improvement even if I do not implement it. For instance, my solution uses order n extra space; there is an in-place version using two pointers that would bring it to constant space, and here is the idea. Or, this handles the static array; if the array could be updated between queries I would switch the prefix sum for a Fenwick tree. This shows I understand the solution deeply and can see its boundaries. Finally I invite the interviewer to probe: I ask if they want me to handle a particular follow-up or optimise a specific part. Ending with a clear complexity statement, a clean edge-case pass, and an articulate view of the trade-offs is what turns a working solution into a strong signal.',
        aHi: 'Pehle main time aur space complexity ko explicitly batata hoon aur ise justify karta hoon, sirf assert nahi. Ek dynamic program ke liye main distinct states ki tadaad guna prati transition kaam kehta hoon, jaise ye order n guna m states hai har ek constant time mein kiya gaya, isliye kul order n guna m, aur space table ke liye order n guna m ya agar main ise ek row mein roll karta hoon toh order m hai. Ek pass-based solution ke liye main passes ki tadaad guna prati element kaam kehta hoon. Doosra main un edge cases ka ek aur targeted review karta hoon jo maine clarification ke dauraan pehchaane, empty input, ek single element, sab elements barabar, maximum size, aur koi boundary condition jiske baare mein maine poocha, har par code ko jaldi trace karte hue maan lene ke bajaye. Teesra, agar samay hai aur solution ki ek spasht kamzori hai, main iska naam deta hoon aur sudhaar describe karta hoon chahe main ise implement na karoon. Aakhir mein main interviewer ko probe karne ko invite karta hoon: main poochta hoon kya wo chahte hain ki main ek khaas follow-up handle karoon ya ek specific part optimise karoon.',
      },
    ],

    exercises: [
      {
        task: 'Take any problem and write out what you would SAY in phases 1-3 (clarify, examples, brute force + complexity) — the actual sentences, as if speaking to an interviewer. Keep it to under 90 seconds of talking.',
        taskHi: 'Koi bhi problem lo aur likho jo aap phases 1-3 (clarify, examples, brute force + complexity) mein KAHOGE — actual vaakya, jaise ek interviewer se baat kar rahe ho. Ise 90 seconds se kam baat rakho.',
        hint: 'Phase 1: "So we are given ... and we need to return ... Am I right that ...? What is the range of n?" Phase 2: "For the example ... the answer is ... because ..." Phase 3: "The brute force is ... which is O(...); with n up to ... that is too slow / fine."',
        hintHi: 'Phase 1: "Toh humein ... diya gaya aur humein ... return karna hai. Kya main sahi hoon ki ...? n ki range kya hai?" Phase 2: "Example ... ke liye answer ... hai kyunki ..." Phase 3: "Brute force ... hai jo O(...) hai; n up to ... ke saath wo bahut slow / theek hai."',
      },
      {
        task: 'Practice the "stuck narration". Pick a problem, deliberately stall on the optimisation, and write three sentences you could say that would each invite a useful hint without giving up.',
        taskHi: '"Stuck narration" practice karo. Ek problem chuno, jaan-boojhkar optimisation par stall karo, aur teen vaakya likho jo aap keh sakte ho jo har ek ek useful hint invite karega bina give up kiye.',
        hint: 'Good stuck sentences name (a) the specific waste you want to remove, (b) an idea you rejected and why, (c) the complexity gap between what you have and what you need.',
        hintHi: 'Achhe stuck vaakya (a) wo specific waste jo aap hataana chahte ho, (b) ek idea jo aapne reject kiya aur kyun, (c) jo aapke paas hai aur jo aapko chahiye ke beech complexity gap name karte hain.',
      },
      {
        task: 'Do a full timed run: 45 minutes, one medium problem, all seven phases, out loud (record yourself). Afterward, note which phase you rushed and which you skipped.',
        taskHi: 'Ek poora timed run karo: 45 minute, ek medium problem, saat phases, zor se (khud ko record karo). Baad mein, note karo kaunsa phase aapne rush kiya aur kaunsa skip kiya.',
        hint: 'The most commonly skipped phases are examples (phase 2) and analyse (phase 7); the most commonly rushed is optimise (phase 4). Watch for those.',
        hintHi: 'Sabse aksar skip kiye phases examples (phase 2) aur analyse (phase 7) hain; sabse aksar rush kiya optimise (phase 4) hai. Un par dhyaan do.',
      },
    ],

    keyTakeaways: [
      'Follow seven phases out loud: clarify, examples, brute force + complexity, optimise (approach agreed with interviewer), code, test, analyse.',
      'Spend real time in phases 1-4 before typing. Clarifying catches "solving the wrong problem"; examples build an accurate model; the brute force is both your fallback and the springboard to the optimisation.',
      'When stuck, narrate the stuck-ness precisely: the waste you want to remove, the idea you rejected and why, the complexity gap. This invites a targeted hint; silence invites nothing.',
      'During coding, announce structure before writing it and narrate loop invariants. When you spot your own bug, say so and fix it — a positive signal.',
      'Always trace your code line by line on the examples and edge cases before declaring done. Finding your own bug beats the interviewer finding it.',
      'The interviewer is evaluating whether you would be a good colleague: good questions, checked assumptions, reasoning out loud, graceful hint-taking, self-testing, calm under pressure.',
    ],
    keyTakeawaysHi: [
      'Saat phases zor se follow karo: clarify, examples, brute force + complexity, optimise (interviewer ke saath approach agreed), code, test, analyse.',
      'Type karne se pehle phases 1-4 mein asli samay kharch karo. Clarifying "galat problem solve karna" pakadta hai; examples ek accurate model banaate hain; brute force aapka fallback aur optimisation ka springboard dono hai.',
      'Jab atak jao, stuck-ness ko thik-thik narrate karo: wo waste jo aap hataana chahte ho, wo idea jo aapne reject kiya aur kyun, complexity gap. Ye ek targeted hint invite karta hai; silence kuch nahi.',
      'Coding ke dauraan, structure ise likhne se pehle announce karo aur loop invariants narrate karo. Jab aap apna khud ka bug spot karo, kaho aur theek karo — ek positive signal.',
      'Done ghoshit karne se pehle hamesha apne code ko examples aur edge cases par line by line trace karo. Apna khud ka bug paana interviewer se paane se behtar hai.',
      'Interviewer evaluate kar raha hai ki kya aap ek achhe colleague hoge: achhe sawaal, checked assumptions, zor se reasoning, graceful hint-taking, self-testing, pressure mein shaant.',
    ],
  },
];
