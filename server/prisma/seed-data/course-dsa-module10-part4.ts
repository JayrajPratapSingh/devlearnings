/**
 * DSA Complete Course — Module 10: Sorting & Searching, lesson 4.
 *
 * "Binary search on the answer": using binary search when there is no array to
 * search, but there IS a monotonic yes/no property over a numeric range. Builds
 * on this module's lesson 3 (the binary-search template) and previews this
 * course's Module 12 (greedy feasibility checks). Broken example: a problem like
 * "what is the smallest ship capacity that lets us deliver all packages within D
 * days?" solved by trying capacities one at a time from small to large until one
 * works — a linear scan over a range that can be millions wide, each check
 * itself O(n). Fixed by noticing the property "capacity C is enough" is
 * monotonic: if C works, every capacity above C works too, and if C fails, every
 * capacity below C fails. That monotonic boundary is exactly what binary search
 * finds — binary search the capacity, using an O(n) feasibility check as the
 * comparison, for O(n log(range)) instead of O(n * range).
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

export const DSA_MODULE_10_PART4: CourseLesson[] = [
  {
    slug: 'binary-search-on-the-answer',
    title: 'Binary Search on the Answer: Searching a Range, Not an Array',
    titleHi: 'Binary Search Answer Par: Ek Range Search Karna, Ek Array Nahi',
    description: 'A problem like "find the smallest truck capacity that delivers every package within 5 days". The obvious approach tries capacity 1, then 2, then 3, and so on until one works — but the capacity might be in the millions, and each try runs a full O(n) simulation, so the total is O(n times the range).',
    descriptionHi: 'Ek problem jaisi "sabse chhoti truck capacity dhoondho jo har package 5 din mein deliver kare". Spasht approach capacity 1, phir 2, phir 3, aur aise hi try karta hai jab tak ek kaam kare — par capacity millions mein ho sakti hai, aur har try ek poora O(n) simulation chalata hai, isliye kul O(n guna range) hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 4,

    analogy: {
      en: '**Finding the coldest thermostat setting that still keeps a room comfortable, by feel.** You do not have a list of "comfortable temperatures" to look through — you have a dial and a way to check "is the room comfortable at this setting? yes or no". The slow method: start at the lowest setting, wait, check, nudge it up one degree, wait, check, and keep going until the room finally feels comfortable. If the comfortable range starts twenty degrees up, that is twenty full waits. The fast method relies on one fact: comfort here is monotonic. If a setting is warm enough to be comfortable, every warmer setting is also comfortable; if a setting is too cold, every colder setting is also too cold. So there is a single crossover point on the dial — cold-and-uncomfortable below it, warm-and-comfortable above it — and you can bracket it. Set the dial halfway, check: if comfortable, the crossover is at or below here, so throw away the top half of the dial\'s range; if not, the crossover is above here, throw away the bottom half. Each check halves the range of settings still in play, so a dial with a thousand positions is pinned down in about ten checks instead of hundreds. The "array" you are binary-searching is the set of dial positions, and the "comparison" is the yes/no comfort test.',
      hi: '**Sabse thandi thermostat setting dhoondhna jo abhi bhi ek kamre ko comfortable rakhti hai, feel se.** Aapke paas "comfortable temperatures" ki ek list nahi hai jise dekho — aapke paas ek dial hai aur ek tarika check karne ka "kya is setting par kamra comfortable hai? haan ya na". Slow method: sabse kam setting par shuru karo, wait karo, check karo, ise ek degree upar nudge karo, wait karo, check karo, aur chalte raho jab tak kamra aakhirkaar comfortable na lage. Agar comfortable range bees degree upar shuru hoti hai, wo bees poore waits hain. Fast method ek tathya par nirbhar hai: yahaan comfort monotonic hai. Agar ek setting comfortable hone ke liye kaafi garm hai, har garm setting bhi comfortable hai; agar ek setting bahut thandi hai, har thandi setting bhi bahut thandi hai. Toh dial par ek akela crossover point hai — iske neeche thanda-aur-uncomfortable, iske upar garm-aur-comfortable — aur aap ise bracket kar sakte ho. Dial ko aadhe par set karo, check karo: agar comfortable, crossover yahaan ya neeche hai, isliye dial ke range ka top half phenk do; agar nahi, crossover yahaan se upar hai, bottom half phenk do. Har check settings ke range ko halve karta hai jo abhi khel mein hain, isliye ek hazaar positions waala dial saundon ke bajaye lagbhag das checks mein pin down hota hai. Jo "array" aap binary-search kar rahe ho wo dial positions ka set hai, aur "comparison" yes/no comfort test hai.',
    },

    simple: `**Start broken.** Smallest ship capacity to deliver all \`weights\` within \`days\`, tried linearly:

\`\`\`js
function shipWithinDaysBroken(weights, days) {
  const lo = Math.max(...weights);         // must at least carry the heaviest item
  const hi = weights.reduce((s, w) => s + w, 0); // one day carries everything

  for (let cap = lo; cap <= hi; cap++) {   // try EVERY capacity from lo to hi
    if (daysNeeded(weights, cap) <= days) return cap;
  }
  return hi;
}

function daysNeeded(weights, cap) {         // O(n) simulation
  let d = 1, load = 0;
  for (const w of weights) {
    if (load + w > cap) { d++; load = 0; }
    load += w;
  }
  return d;
}
\`\`\`

The capacity range \`[lo, hi]\` can be huge — if the weights sum to a few million, that is millions of iterations, each running the O(n) \`daysNeeded\` check. Total: O(n * range). But you never needed to try every capacity.

**The fix: binary search the capacity, because feasibility is monotonic**

\`\`\`js
function shipWithinDays(weights, days) {
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);

  // Invariant: capacity 'lo' might be feasible; capacity 'hi' definitely is.
  // We're looking for the smallest feasible capacity.
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (daysNeeded(weights, mid) <= days) hi = mid;   // mid works -> answer is mid or smaller
    else lo = mid + 1;                                // mid too small -> answer is bigger
  }
  return lo;   // lo === hi === smallest feasible capacity
}
\`\`\`

\`\`\`ts
function shipWithinDays(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);
  const feasible = (cap: number): boolean => {
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d <= days;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
\`\`\`

The key observation: **"capacity \`C\` is enough" is a monotonic predicate**. If a ship of capacity \`C\` can do it in \`days\` days, a bigger ship certainly can (it never needs more trips). If capacity \`C\` cannot, no smaller ship can either. So the sequence of predicate values across increasing \`C\` looks like \`false, false, ..., false, true, true, ..., true\` — a single crossover. That is exactly the shape \`lowerBound\` from lesson 3 finds. Binary-searching the capacity does O(log(range)) feasibility checks instead of O(range), and each check is O(n): total O(n log(range)).`,

    simpleHi: `**Toote hue se shuru.** Sabse chhoti ship capacity \`weights\` ko \`days\` mein deliver karne ke liye, linearly try ki gayi:

\`\`\`js
function shipWithinDaysBroken(weights, days) {
  const lo = Math.max(...weights);         // kam se kam sabse bhaari item carry karna chahiye
  const hi = weights.reduce((s, w) => s + w, 0); // ek din sab kuch carry karta hai

  for (let cap = lo; cap <= hi; cap++) {   // lo se hi tak HAR capacity try karo
    if (daysNeeded(weights, cap) <= days) return cap;
  }
  return hi;
}

function daysNeeded(weights, cap) {         // O(n) simulation
  let d = 1, load = 0;
  for (const w of weights) {
    if (load + w > cap) { d++; load = 0; }
    load += w;
  }
  return d;
}
\`\`\`

Capacity range \`[lo, hi]\` bahut bada ho sakta hai — agar weights ka sum kuch million hai, wo millions of iterations hain, har ek O(n) \`daysNeeded\` check chalati hui. Kul: O(n * range). Par aapko kabhi har capacity try karne ki zaroorat nahi thi.

**Fix: capacity ko binary search karo, kyunki feasibility monotonic hai**

\`\`\`js
function shipWithinDays(weights, days) {
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);

  // Invariant: capacity 'lo' feasible ho sakti hai; capacity 'hi' zaroor hai.
  // Hum sabse chhoti feasible capacity dhoondh rahe hain.
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (daysNeeded(weights, mid) <= days) hi = mid;   // mid kaam karta hai -> jawaab mid ya chhota
    else lo = mid + 1;                                // mid bahut chhota -> jawaab bada
  }
  return lo;   // lo === hi === sabse chhoti feasible capacity
}
\`\`\`

\`\`\`ts
function shipWithinDays(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);
  const feasible = (cap: number): boolean => {
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) { d++; load = 0; }
      load += w;
    }
    return d <= days;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
\`\`\`

Kunji observation: **"capacity \`C\` kaafi hai" ek monotonic predicate hai**. Agar capacity \`C\` ki ek ship ise \`days\` din mein kar sakti hai, ek badi ship zaroor kar sakti hai (use kabhi zyaada trips ki zaroorat nahi). Agar capacity \`C\` nahi kar sakti, koi chhoti ship bhi nahi kar sakti. Toh badhti \`C\` par predicate values ka sequence \`false, false, ..., false, true, true, ..., true\` jaisa dikhta hai — ek akela crossover. Wo bilkul wo shape hai jo lesson 3 ka \`lowerBound\` dhoondhta hai. Capacity ko binary-search karna O(range) ke bajaye O(log(range)) feasibility checks karta hai, aur har check O(n) hai: kul O(n log(range)).`,

    content: `## The recipe: recognise it, then apply the template

\`\`\`
1. Is the answer a single number in a known range [lo, hi]?
2. Is there a boolean check feasible(x) that is MONOTONIC — once true it stays
   true as x increases (or once true it stays true as x decreases)?
3. If yes: binary-search x, using feasible(x) as the comparison.

   Smallest x with feasible(x) == true:        Largest x with feasible(x) == true:
     while (lo < hi) {                            while (lo < hi) {
       mid = lo + (hi - lo) / 2                     mid = lo + (hi - lo + 1) / 2   // round UP
       if (feasible(mid)) hi = mid                  if (feasible(mid)) lo = mid
       else lo = mid + 1                            else hi = mid - 1
     }                                            }
     return lo                                    return lo
\`\`\`

The "largest x" variant rounds \`mid\` up (\`hi - lo + 1\`) to avoid an infinite loop when \`hi - lo == 1\` and \`feasible(mid)\` is true — without the \`+ 1\`, \`mid == lo\`, \`lo = mid\` does nothing, and it hangs. This is the same "updates must make progress" rule from lesson 3, applied to the other direction.

## More problems that are secretly this pattern

\`\`\`
"Minimum eating speed to finish all banana piles in H hours"
    -> binary search the speed; feasible(speed) = hours needed <= H (monotonic)

"Split array into k subarrays minimising the largest subarray sum"
    -> binary search the largest-sum limit; feasible(limit) = can split into <= k parts

"Smallest divisor so that the sum of ceil(a[i] / divisor) <= threshold"
    -> binary search the divisor; larger divisor -> smaller sum -> monotonic

"Kth smallest element in a sorted matrix / in a multiplication table"
    -> binary search the VALUE; feasible(v) = count of elements <= v is >= k
\`\`\`

None of these have an array of candidate answers to look through. The candidates form a numeric range, and the thing that makes binary search legal is a monotonic feasibility test — not sorted data.

## Why monotonicity is the exact requirement

\`\`\`
Binary search works by discarding half the remaining candidates after one check.
That is only sound if the check's result at 'mid' tells you something certain
about an entire half.

If feasible() is monotonic (F F F T T T), then:
  feasible(mid) == true  => every x >= mid is also feasible => the answer (the
                            smallest feasible x) is at mid or to the LEFT.
  feasible(mid) == false => every x <= mid is infeasible => the answer is to the RIGHT.

If feasible() is NOT monotonic (e.g. F T F T F), knowing feasible(mid) tells you
nothing about the neighbours, so you cannot safely discard a half. Binary search
is simply invalid on a non-monotonic predicate.
\`\`\`

Part of solving these problems is *proving* the monotonicity — usually a one-sentence argument ("a bigger capacity never needs more trips"). If you cannot make that argument, binary search on the answer is the wrong tool.

## Floating-point answers: iterate a fixed number of times instead

\`\`\`js
// "minimum radius so that k circles of that radius cover all points" — the answer
// is a real number. Use a fixed iteration count instead of lo < hi:
function search(feasible, lo, hi) {
  for (let iter = 0; iter < 100; iter++) {   // 100 halvings -> precision ~ (hi-lo) / 2^100
    const mid = (lo + hi) / 2;
    if (feasible(mid)) hi = mid;
    else lo = mid;
  }
  return lo;
}
\`\`\`

With a continuous range there is no "adjacent integers" to converge to, so you run a fixed number of halvings (60 to 100 is plenty for double precision) rather than looping until \`lo === hi\`.`,

    contentHi: `## Recipe: ise pehchaano, phir template apply karo

\`\`\`
1. Kya jawaab ek known range [lo, hi] mein ek akela number hai?
2. Kya ek boolean check feasible(x) hai jo MONOTONIC hai — ek baar true wo x badhne
   par true rehta hai (ya ek baar true wo x ghatne par true rehta hai)?
3. Agar haan: x ko binary-search karo, feasible(x) ko comparison ki tarah istemal karke.

   Sabse chhota x jismein feasible(x) == true:     Sabse bada x jismein feasible(x) == true:
     while (lo < hi) {                                while (lo < hi) {
       mid = lo + (hi - lo) / 2                         mid = lo + (hi - lo + 1) / 2   // UP round
       if (feasible(mid)) hi = mid                      if (feasible(mid)) lo = mid
       else lo = mid + 1                                else hi = mid - 1
     }                                                }
     return lo                                        return lo
\`\`\`

"Sabse bada x" variant \`mid\` ko upar round karta hai (\`hi - lo + 1\`) ek infinite loop avoid karne ke liye jab \`hi - lo == 1\` aur \`feasible(mid)\` true hai — \`+ 1\` ke bina, \`mid == lo\`, \`lo = mid\` kuch nahi karta, aur ye hang hota hai. Ye wahi "updates ko progress karna chahiye" rule hai lesson 3 se, doosri direction par lagaya gaya.

## Aur problems jo chhupe hue ye pattern hain

\`\`\`
"Sab banana piles ko H hours mein khatam karne ki minimum eating speed"
    -> speed ko binary search karo; feasible(speed) = zaroori hours <= H (monotonic)

"Array ko k subarrays mein split karo sabse bade subarray sum ko minimise karte hue"
    -> largest-sum limit ko binary search karo; feasible(limit) = <= k parts mein split ho sakta hai

"Sabse chhota divisor taaki ceil(a[i] / divisor) ka sum <= threshold"
    -> divisor ko binary search karo; bada divisor -> chhota sum -> monotonic

"Ek sorted matrix mein / ek multiplication table mein kth sabse chhota element"
    -> VALUE ko binary search karo; feasible(v) = <= v elements ki count >= k hai
\`\`\`

In mein se kisi ke paas candidate answers ka ek array nahi hai jise dekho. Candidates ek numeric range banate hain, aur jo binary search ko legal banaata hai wo ek monotonic feasibility test hai — sorted data nahi.

## Monotonicity thik-thik requirement kyun hai

\`\`\`
Binary search ek check ke baad baaki candidates ka aadha discard karke kaam karta hai.
Wo tabhi sound hai jab check ka 'mid' par nateeja aapko ek poore half ke baare mein
kuch certain batata hai.

Agar feasible() monotonic hai (F F F T T T), toh:
  feasible(mid) == true  => har x >= mid bhi feasible hai => jawaab (sabse chhota
                            feasible x) mid par ya LEFT mein hai.
  feasible(mid) == false => har x <= mid infeasible hai => jawaab RIGHT mein hai.

Agar feasible() monotonic NAHI hai (jaise F T F T F), feasible(mid) jaanna aapko
neighbours ke baare mein kuch nahi batata, isliye aap ek half surakshit discard nahi
kar sakte. Binary search ek non-monotonic predicate par bas invalid hai.
\`\`\`

In problems ko solve karne ka hissa monotonicity ko *saabit* karna hai — aksar ek-vaakya argument ("ek badi capacity ko kabhi zyaada trips ki zaroorat nahi"). Agar aap wo argument nahi bana sakte, answer par binary search galat tool hai.

## Floating-point answers: iske bajaye ek fixed tadaad baar iterate karo

\`\`\`js
// "minimum radius taaki us radius ke k circles sab points cover karein" — jawaab
// ek real number hai. lo < hi ke bajaye ek fixed iteration count istemal karo:
function search(feasible, lo, hi) {
  for (let iter = 0; iter < 100; iter++) {   // 100 halvings -> precision ~ (hi-lo) / 2^100
    const mid = (lo + hi) / 2;
    if (feasible(mid)) hi = mid;
    else lo = mid;
  }
  return lo;
}
\`\`\`

Ek continuous range ke saath "adjacent integers" nahi hain jinpar converge ho, isliye aap ek fixed tadaad halvings chalate ho (double precision ke liye 60 se 100 kaafi hai) na ki \`lo === hi\` tak loop karte ho.`,

    examples: [
      {
        title: 'Broken: try every capacity from lo to hi',
        titleHi: 'Toota: lo se hi tak har capacity try karo',
        code: `for (let cap = lo; cap <= hi; cap++)
  if (daysNeeded(weights, cap) <= days) return cap;`,
        codeJs: `function shipWithinDaysBroken(weights, days) {
  const lo = Math.max(...weights);
  const hi = weights.reduce((s, w) => s + w, 0);
  for (let cap = lo; cap <= hi; cap++) {
    if (daysNeeded(weights, cap) <= days) return cap;
  }
  return hi;
}
// weights summing to 5,000,000 -> up to ~5M iterations, each O(n)`,
        codeTs: `function shipWithinDaysBroken(weights: number[], days: number): number {
  const lo = Math.max(...weights);
  const hi = weights.reduce((s, w) => s + w, 0);
  for (let cap = lo; cap <= hi; cap++) {
    if (daysNeeded(weights, cap) <= days) return cap;
  }
  return hi;
}`,
        output: `// correct, but O(n * range) — range can be millions wide`,
        explain: 'The candidate capacities form a huge numeric range. Scanning it linearly, running an O(n) check per candidate, is O(n * range) — unnecessary because feasibility only flips once.',
        explainHi: 'Candidate capacities ek bade numeric range banati hain. Ise linearly scan karna, prati candidate ek O(n) check chalate hue, O(n * range) hai — anaavashyak kyunki feasibility sirf ek baar flip hoti hai.',
      },
      {
        title: 'Fixed: binary search the capacity',
        titleHi: 'Theek: capacity ko binary search karo',
        code: `while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (feasible(mid)) hi = mid;   // feasible -> answer is mid or smaller
  else lo = mid + 1;
}
return lo;`,
        codeJs: `function shipWithinDays(weights, days) {
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);
  const feasible = cap => {
    let d = 1, load = 0;
    for (const w of weights) { if (load + w > cap) { d++; load = 0; } load += w; }
    return d <= days;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (feasible(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}
console.log(shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5)); // 15`,
        codeTs: `function shipWithinDays(weights: number[], days: number): number {
  let lo = Math.max(...weights);
  let hi = weights.reduce((s, w) => s + w, 0);
  const feasible = (cap: number): boolean => {
    let d = 1, load = 0;
    for (const w of weights) { if (load + w > cap) { d++; load = 0; } load += w; }
    return d <= days;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (feasible(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
        outputJs: `15`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'feasible(cap) is monotonic: bigger capacity never needs more days. So the answer is the single crossover from false to true, which lowerBound-style binary search finds in O(log(range)) checks.',
        explainHi: 'feasible(cap) monotonic hai: badi capacity ko kabhi zyaada din nahi chahiye. Toh jawaab false se true ka akela crossover hai, jise lowerBound-style binary search O(log(range)) checks mein dhoondhta hai.',
      },
      {
        title: 'Kth smallest in a multiplication table: binary search the VALUE',
        titleHi: 'Ek multiplication table mein kth sabse chhota: VALUE ko binary search karo',
        code: `// feasible(v) = "there are at least k entries <= v" -> monotonic in v`,
        codeJs: `function findKthNumber(m, n, k) {
  let lo = 1, hi = m * n;
  const countLE = v => {
    let c = 0;
    for (let row = 1; row <= m; row++) c += Math.min(Math.floor(v / row), n);
    return c;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (countLE(mid) >= k) hi = mid; else lo = mid + 1;
  }
  return lo;
}
console.log(findKthNumber(3, 3, 5)); // 3  (the table is 1 2 3 / 2 4 6 / 3 6 9)`,
        codeTs: `function findKthNumber(m: number, n: number, k: number): number {
  let lo = 1, hi = m * n;
  const countLE = (v: number): number => {
    let c = 0;
    for (let row = 1; row <= m; row++) c += Math.min(Math.floor(v / row), n);
    return c;
  };
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (countLE(mid) >= k) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
        outputJs: `3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'There is no array to search — the entries are computed. But "count of entries <= v" only ever rises as v rises, so binary-searching v for the smallest value whose count reaches k gives the kth smallest.',
        explainHi: 'Search karne ke liye koi array nahi — entries compute hoti hain. Par "entries <= v ki count" sirf badhti hai jaise v badhta hai, isliye v ko binary-search karna sabse chhoti value ke liye jiski count k tak pahunche kth sabse chhota deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// binary search on the answer without checking that feasible() is monotonic
// e.g. feasible(x) = "x is a peak" -> F T F, not monotonic -> binary search is invalid`,
        right: `// first prove feasible() is monotonic (F...F T...T or T...T F...F).
// If it is not, binary search on the answer does not apply.`,
        why: 'Binary search discards a half based on the result at mid. That is only valid if the result at mid determines the result across an entire half, which is exactly what monotonicity guarantees.',
        whyHi: 'Binary search mid par nateeje ke aadhaar par ek half discard karta hai. Wo tabhi valid hai jab mid par nateeja ek poore half ke nateeje ko determine karta hai, jo bilkul wo hai jo monotonicity guarantee karti hai.',
      },
      {
        wrong: `// "largest x with feasible(x)" using mid = lo + (hi - lo) / 2 (round down)
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (feasible(mid)) lo = mid;   // when hi = lo + 1, mid = lo, lo = lo -> infinite loop
  else hi = mid - 1;
}`,
        right: `const mid = lo + ((hi - lo + 1) >> 1);   // round UP for the "largest x" variant
if (feasible(mid)) lo = mid; else hi = mid - 1;`,
        why: 'When searching for the largest feasible x and the update is lo = mid, mid must round up or the interval [lo, lo+1] never shrinks. This is the mirror image of lesson 3\'s "updates must make progress".',
        whyHi: 'Sabse bade feasible x ke liye search karte waqt aur update lo = mid hai, mid ko upar round karna chahiye warna interval [lo, lo+1] kabhi shrink nahi hota. Ye lesson 3 ke "updates ko progress karna chahiye" ka mirror image hai.',
      },
      {
        wrong: `// setting lo/hi bounds that exclude the real answer
let lo = 1, hi = Math.max(...weights);   // hi too low — the answer can exceed the max weight`,
        right: `let lo = Math.max(...weights);              // a day must fit the heaviest single item
let hi = weights.reduce((s, w) => s + w, 0); // one day could carry everything`,
        why: 'Binary search only finds an answer inside [lo, hi]. If the true answer lies outside your initial bounds, the search converges to a wrong value at a boundary. Pick bounds that are provably loose enough.',
        whyHi: 'Binary search sirf [lo, hi] ke andar ek jawaab dhoondhta hai. Agar asli jawaab aapke initial bounds ke bahar hai, search ek boundary par ek galat value par converge hota hai. Aise bounds chuno jo saabit roop se dhile hon.',
      },
    ],

    realWorld: [
      {
        en: '**Capacity and rate-limit tuning** — "smallest number of servers / largest batch size / minimum bandwidth that meets the SLA" — is binary search on the answer with a load-simulation feasibility check.',
        hi: '**Capacity aur rate-limit tuning** — "sabse kam servers ki tadaad / sabse bada batch size / minimum bandwidth jo SLA meet kare" — ek load-simulation feasibility check ke saath answer par binary search hai.',
      },
      {
        en: '**Aggressive-cows / minimum-maximum-distance placement problems** in logistics and networking (place k facilities to minimise the worst service distance) binary-search the distance and greedily test placement.',
        hi: '**Aggressive-cows / minimum-maximum-distance placement problems** logistics aur networking mein (k facilities rakho worst service distance minimise karne ke liye) distance ko binary-search karte hain aur placement ko greedily test karte hain.',
      },
      {
        en: '**Percentile and quantile queries on huge datasets** binary-search the value and count how many records fall below it, when the data is too large to sort but cheap to scan-and-count.',
        hi: '**Bade datasets par percentile aur quantile queries** value ko binary-search karti hain aur gino kitne records iske neeche aate hain, jab data sort karne ke liye bahut bada hai par scan-and-count karne ke liye sasta.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you recognise that a problem is "binary search on the answer", and what must you prove before applying it?',
        qHi: 'Aap kaise pehchaante ho ki ek problem "answer par binary search" hai, aur ise apply karne se pehle aapko kya saabit karna chahiye?',
        a: 'The tell is a problem that asks for a single optimal number — the smallest, the largest, the minimum maximum, the maximum minimum — where that number lives in a range you can bound, and where checking "does value x work" is much easier than directly computing the optimum. Phrases like "minimum capacity such that", "smallest speed that lets you finish in time", "largest value you can guarantee", "minimise the largest piece" all fit. When you see that shape, the candidate answers are a contiguous numeric range rather than a list, and the search is over that range. Before you apply binary search you must prove one thing: the feasibility check is monotonic. Concretely, if feasible(x) is true, then feasible of every value on one side of x is also true; and if feasible(x) is false, feasible of every value on the other side is also false. For a minimisation problem this usually reads "if a bigger budget works, a still-bigger budget also works, because slack never hurts". For the multiplication-table example it reads "the count of entries at most v can only increase as v increases". The proof is normally one or two sentences, but it is not optional: if the predicate is not monotonic, the result at the midpoint tells you nothing reliable about a whole half of the range, and discarding that half — which is the entire mechanism of binary search — is unjustified. If you cannot construct the monotonicity argument, the problem needs a different technique, often dynamic programming or a greedy proof.',
        aHi: 'Tell ek problem hai jo ek akele optimal number maangti hai — sabse chhota, sabse bada, minimum maximum, maximum minimum — jahaan wo number ek aise range mein rehta hai jise aap bound kar sakte ho, aur jahaan "kya value x kaam karti hai" check karna optimum ko seedhe compute karne se kaafi aasaan hai. "Minimum capacity such that", "sabse chhoti speed jo aapko samay mein khatam karne de", "sabse badi value jo aap guarantee kar sakte ho", "sabse bade piece ko minimise karo" jaise phrases sab fit hote hain. Jab aap wo shape dekhte ho, candidate answers ek list ke bajaye ek contiguous numeric range hain, aur search us range par hai. Binary search apply karne se pehle aapko ek cheez saabit karni chahiye: feasibility check monotonic hai. Thos roop se, agar feasible(x) true hai, toh x ke ek side par har value ka feasible bhi true hai; aur agar feasible(x) false hai, doosri side par har value ka feasible bhi false hai. Ek minimisation problem ke liye ye aksar "agar ek bada budget kaam karta hai, ek aur-bada budget bhi kaam karta hai, kyunki slack kabhi nuksaan nahi karta" padhta hai. Multiplication-table example ke liye ye "at most v entries ki count sirf badh sakti hai jaise v badhta hai" padhta hai. Proof normally ek ya do vaakya hai, par ye vaikalpik nahi hai: agar predicate monotonic nahi hai, midpoint par nateeja aapko range ke ek poore half ke baare mein kuch bharosemand nahi batata, aur us half ko discard karna — jo binary search ka poora mechanism hai — anuchit hai. Agar aap monotonicity argument nahi bana sakte, problem ko ek alag technique chahiye, aksar dynamic programming ya ek greedy proof.',
      },
      {
        q: 'Compare "binary search on a sorted array" with "binary search on the answer" — what is the same and what is different?',
        qHi: '"Ek sorted array par binary search" ko "answer par binary search" se compare karo — kya same hai aur kya alag hai?',
        a: 'The core mechanism is identical: maintain an interval of candidates, look at the middle one, use a single test to decide which half of the interval cannot contain the answer, discard it, and repeat until one candidate remains. Both run in a logarithmic number of iterations of that test. What differs is what the candidates are and what the test is. In array binary search, the candidates are the indices of a physically sorted array, and the test is a direct comparison between the target and the element at the middle index. The array being sorted is what guarantees the test at the midpoint tells you which half to drop. In binary search on the answer, there is no array. The candidates are the integers or reals in a numeric range that you bound yourself based on the problem, and the middle candidate is just a number, not a stored value. The test is a problem-specific feasibility function, often an O(n) simulation or a counting pass, and it is the monotonicity of that function — not any sorted storage — that guarantees the midpoint result tells you which half to drop. So the sorted array is really a special case: its elements happen to be a monotonic sequence, and "is a[mid] less than target" is a monotonic predicate over the index. The generalisation is to realise that any monotonic yes/no property over any bounded range is binary-searchable, whether or not there is an array behind it, and the cost is the number of iterations times the cost of one feasibility check rather than times a constant.',
        aHi: 'Core mechanism identical hai: candidates ka ek interval maintain karo, beech waale ko dekho, ek akele test se tay karo interval ka kaunsa half jawaab nahi rakh sakta, ise discard karo, aur dohraao jab tak ek candidate na bache. Dono us test ke logarithmic tadaad iterations mein chalte hain. Jo alag hai wo ye hai ki candidates kya hain aur test kya hai. Array binary search mein, candidates ek physically sorted array ke indices hain, aur test target aur middle index par element ke beech ek seedha comparison hai. Array ka sorted hona wahi hai jo guarantee karta hai ki midpoint par test aapko batata hai kaunsa half drop karna hai. Answer par binary search mein, koi array nahi hai. Candidates ek numeric range mein integers ya reals hain jise aap problem ke aadhaar par khud bound karte ho, aur middle candidate bas ek number hai, ek stored value nahi. Test ek problem-specific feasibility function hai, aksar ek O(n) simulation ya ek counting pass, aur wo us function ki monotonicity hai — koi sorted storage nahi — jo guarantee karti hai ki midpoint nateeja aapko batata hai kaunsa half drop karna hai. Toh sorted array asal mein ek khaas case hai: iske elements samyog se ek monotonic sequence hain, aur "kya a[mid] target se kam hai" index par ek monotonic predicate hai. Generalisation ye realise karna hai ki kisi bhi bounded range par koi bhi monotonic yes/no property binary-searchable hai, chahe iske peechhe ek array ho ya na ho, aur cost iterations ki tadaad guna ek feasibility check ki cost hai na ki ek constant guna.',
      },
    ],

    exercises: [
      {
        task: 'Implement shipWithinDays with binary search. Test on weights [1..10] with days = 1 (expect 55), days = 5 (expect 15), and days = 10 (expect 10). Confirm feasible() runs O(log(sum)) times, not O(sum) times.',
        taskHi: 'Binary search ke saath shipWithinDays implement karo. weights [1..10] par days = 1 (55 expect karo), days = 5 (15 expect karo), aur days = 10 (10 expect karo) ke saath test karo. Confirm karo feasible() O(log(sum)) baar chalta hai, O(sum) baar nahi.',
        hint: 'Add a counter inside feasible(). For a sum of 55 the linear version calls it up to ~45 times; the binary version calls it ~6 times.',
        hintHi: 'feasible() ke andar ek counter jodo. 55 ke sum ke liye linear version ise ~45 baar call karta hai; binary version ~6 baar.',
      },
      {
        task: 'Solve "minimum eating speed": given piles [3,6,7,11] and H = 8 hours, find the smallest integer speed k such that sum of ceil(pile / k) <= H. Expected 4.',
        taskHi: '"minimum eating speed" solve karo: piles [3,6,7,11] aur H = 8 hours diye gaye, sabse chhoti integer speed k dhoondho jismein ceil(pile / k) ka sum <= H. Expected 4.',
        hint: 'Bounds: lo = 1, hi = max(piles). feasible(k) = sum of Math.ceil(pile / k) over all piles <= H. It is monotonic because a faster speed never needs more hours.',
        hintHi: 'Bounds: lo = 1, hi = max(piles). feasible(k) = sab piles par Math.ceil(pile / k) ka sum <= H. Ye monotonic hai kyunki ek tez speed ko kabhi zyaada hours nahi chahiye.',
      },
      {
        task: 'Solve "split array largest sum": given [7,2,5,10,8] and k = 2, split the array into 2 contiguous subarrays minimising the larger subarray sum. Expected 18 ([7,2,5] and [10,8]).',
        taskHi: '"split array largest sum" solve karo: [7,2,5,10,8] aur k = 2 diye gaye, array ko 2 contiguous subarrays mein split karo bade subarray sum ko minimise karte hue. Expected 18 ([7,2,5] aur [10,8]).',
        hint: 'Binary search the answer (the largest allowed sum) in [max(a), sum(a)]. feasible(limit) = greedily count how many subarrays you need if no subarray may exceed limit; feasible if that count <= k.',
        hintHi: 'Jawaab (sabse bada allowed sum) ko [max(a), sum(a)] mein binary search karo. feasible(limit) = greedily gino kitne subarrays chahiye agar koi subarray limit se zyaada na ho; feasible agar wo count <= k.',
      },
    ],

    keyTakeaways: [
      'Binary search does not need an array — it needs a bounded numeric range of candidate answers and a MONOTONIC feasibility test over that range.',
      'Recognise the pattern from phrasing: "smallest/largest x such that ...", "minimise the maximum", "maximise the minimum" — where checking a fixed x is easy but finding the optimum directly is not.',
      'Binary-search x using feasible(x) as the comparison: O(log(range)) checks instead of O(range), total O(check-cost * log(range)).',
      'You must prove feasibility is monotonic (F...F T...T). If the midpoint result does not determine a whole half, binary search is invalid.',
      'For "largest feasible x" with the update lo = mid, round mid UP (hi - lo + 1) or the loop hangs when the interval is width 1 — the same progress rule as plain binary search.',
      'For a real-valued answer, run a fixed number of halvings (60-100) instead of looping until lo === hi.',
    ],
    keyTakeawaysHi: [
      'Binary search ko ek array nahi chahiye — use candidate answers ki ek bounded numeric range aur us range par ek MONOTONIC feasibility test chahiye.',
      'Pattern ko phrasing se pehchaano: "sabse chhota/bada x such that ...", "maximum ko minimise karo", "minimum ko maximise karo" — jahaan ek fixed x check karna aasaan hai par optimum seedhe dhoondhna nahi.',
      'x ko binary-search karo feasible(x) ko comparison ki tarah istemal karke: O(range) ke bajaye O(log(range)) checks, kul O(check-cost * log(range)).',
      'Aapko saabit karna chahiye ki feasibility monotonic hai (F...F T...T). Agar midpoint nateeja ek poore half ko determine nahi karta, binary search invalid hai.',
      '"Sabse bada feasible x" ke liye update lo = mid ke saath, mid ko UP round karo (hi - lo + 1) warna interval width 1 hone par loop hang hota hai — plain binary search jaisa hi progress rule.',
      'Ek real-valued jawaab ke liye, lo === hi tak loop karne ke bajaye ek fixed tadaad halvings (60-100) chalao.',
    ],
  },
];
