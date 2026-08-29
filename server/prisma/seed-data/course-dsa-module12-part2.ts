/**
 * DSA Complete Course — Module 12: Greedy Algorithms, lesson 2.
 *
 * Greedy versus DP: when the greedy choice is provably optimal and when it is a
 * trap, using coin change and the fractional-versus-0/1 knapsack as the two
 * clean contrasts. Builds on this module's lesson 1 (the exchange argument) and
 * this course's Module 11 lessons 2 and 4 (the DP versions of coin change and
 * knapsack). Broken example: "fewest coins to make an amount" solved greedily by
 * always taking the largest coin that fits — this is correct for the everyday
 * currency systems people expect (1, 5, 10, 25, ...) but silently wrong for an
 * arbitrary denomination set like [1, 3, 4], where greedy makes 6 as 4+1+1
 * (three coins) while 3+3 (two coins) is optimal. Fixed by recognising that
 * greedy coin change is only valid for "canonical" coin systems and otherwise
 * you must use the DP from Module 11. The fractional knapsack is the mirror
 * image: there, greedy (highest value-per-weight first, taking a fraction of the
 * last item) IS provably optimal, whereas the 0/1 knapsack is not.
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

export const DSA_MODULE_12_PART2: CourseLesson[] = [
  {
    slug: 'greedy-vs-dp-coin-change-knapsack',
    title: 'Greedy vs DP: Coin Change and Fractional Knapsack',
    titleHi: 'Greedy vs DP: Coin Change Aur Fractional Knapsack',
    description: 'Making change for an amount with the fewest coins by always grabbing the largest coin that fits. On the coin systems people are used to (1, 5, 10, 25) this is optimal, so it looks like a safe rule — but on a set like {1, 3, 4} it makes 6 as 4 + 1 + 1, three coins, when 3 + 3 uses only two.',
    descriptionHi: 'Ek amount ke liye sabse kam coins mein change karna hamesha sabse bada coin lekar jo fit hota hai. Jin coin systems ke log aadi hain (1, 5, 10, 25) unpar ye optimal hai, isliye ye ek safe rule lagta hai — par {1, 3, 4} jaise ek set par ye 6 ko 4 + 1 + 1, teen coins, banaata hai, jab 3 + 3 sirf do istemal karta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Filling a jar with the fewest scoops, where the scoop sizes you are given change the answer entirely.** If your scoops are 1, 5, and 10 units, then to measure out 18 units you naturally take a 10, then a 5, then three 1s — five scoops, and there is no better way, because each big scoop you take genuinely leaves the smallest possible remainder. But suppose your scoops are 1, 3, and 4 units and you need 6. Greedily you grab the 4, then you are stuck making 2 out of 1s: 4 + 1 + 1, three scoops. Yet 3 + 3 measures exactly 6 in two. The greedy instinct — biggest first — was not wrong in spirit; it was wrong because with these particular sizes, taking the 4 forces you into an inefficient remainder, and no amount of care afterward recovers the scoop you wasted. The only way to be sure of the minimum with an arbitrary set of scoop sizes is to consider, for every smaller target, the best way to reach it, and build up — which is exactly the dynamic-programming approach. Greedy is safe only when the scoop sizes have the special structure that guarantees the biggest-first choice never traps you.',
      hi: '**Ek jar ko sabse kam scoops se bharna, jahaan jo scoop sizes aapko diye jaate hain jawaab poori tarah badal dete hain.** Agar aapke scoops 1, 5, aur 10 units hain, toh 18 units maapne ke liye aap naturally ek 10 lete ho, phir ek 5, phir teen 1s — paanch scoops, aur koi behtar tarika nahi, kyunki har bada scoop jo aap lete ho sach mein sabse chhota sambhaavit remainder chhodta hai. Par maano aapke scoops 1, 3, aur 4 units hain aur aapko 6 chahiye. Greedily aap 4 lete ho, phir aap 1s se 2 banaane mein atak jaate ho: 4 + 1 + 1, teen scoops. Phir bhi 3 + 3 bilkul 6 do mein maapta hai. Greedy instinct — biggest first — spirit mein galat nahi tha; ye galat tha kyunki in khaas sizes ke saath, 4 lena aapko ek inefficient remainder mein majboor karta hai, aur baad mein kitni bhi care wo scoop recover nahi karti jo aapne barbaad kiya. Ek arbitrary set of scoop sizes ke saath minimum ka nishchit hone ka ekmatra tarika hai, har chhote target ke liye, ise pahunchne ka best tarika consider karna, aur build up karna — jo bilkul dynamic-programming approach hai. Greedy sirf tab safe hai jab scoop sizes ka wo khaas structure hai jo guarantee karta hai ki biggest-first choice aapko kabhi trap nahi karti.',
    },

    simple: `**Start broken.** Fewest coins, greedily taking the largest that fits:

\`\`\`js
function coinChangeGreedy(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a);   // largest first
  let count = 0;
  for (const c of sorted) {
    while (amount >= c) { amount -= c; count++; }
  }
  return amount === 0 ? count : -1;
}

coinChangeGreedy([25, 10, 5, 1], 63); // 6  (25+25+10+1+1+1) — correct
coinChangeGreedy([1, 3, 4], 6);       // 3  (4+1+1)          — WRONG, optimum is 2 (3+3)
\`\`\`

Greedy coin change is correct for the coin systems most currencies use — those are "canonical" systems, engineered so that biggest-first is always optimal. For an arbitrary denomination set it silently returns a suboptimal count. There is no quick fix to the greedy; the rule is just wrong for those inputs.

**The fix: use the DP from this course's Module 11 for arbitrary coins**

\`\`\`js
function coinChangeDP(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

coinChangeDP([1, 3, 4], 6);   // 2  (3 + 3)
\`\`\`

\`\`\`ts
function coinChangeDP(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c]! + 1 < dp[a]!) dp[a] = dp[a - c]! + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]!;
}
\`\`\`

The DP considers every coin as the last one used at every amount, so it cannot be trapped by an early greedy commitment. Cost O(amount * numCoins) — more than the greedy's near-instant answer, but correct for any coin set.

**The mirror image: fractional knapsack, where greedy IS optimal**

\`\`\`js
// Each item has weight and value; you may take FRACTIONS of an item.
// Maximise total value within capacity.
function fractionalKnapsack(items, capacity) {
  const byRatio = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let total = 0, left = capacity;
  for (const it of byRatio) {
    if (left === 0) break;
    const take = Math.min(it.weight, left);      // take all of it, or fill the remaining space
    total += (it.value / it.weight) * take;
    left -= take;
  }
  return total;
}
\`\`\`

Here greedy — sort by value-per-weight, take as much of the best as fits, then the next best — IS provably optimal. The reason it works for the *fractional* version but not the 0/1 version (Module 11 lesson 4): if a better item does not fully fit, you top up with a *slice* of it, so there is never wasted capacity forcing a bad remainder. In 0/1 you cannot slice, so taking a locally-best whole item can leave capacity that a better pair would have used.`,

    simpleHi: `**Toote hue se shuru.** Sabse kam coins, greedily sabse bada lekar jo fit hota hai:

\`\`\`js
function coinChangeGreedy(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a);   // sabse bada pehle
  let count = 0;
  for (const c of sorted) {
    while (amount >= c) { amount -= c; count++; }
  }
  return amount === 0 ? count : -1;
}

coinChangeGreedy([25, 10, 5, 1], 63); // 6  (25+25+10+1+1+1) — sahi
coinChangeGreedy([1, 3, 4], 6);       // 3  (4+1+1)          — GALAT, optimum 2 hai (3+3)
\`\`\`

Greedy coin change adhikaansh currencies jo coin systems istemal karti hain unke liye sahi hai — wo "canonical" systems hain, aise engineer kiye ki biggest-first hamesha optimal hai. Ek arbitrary denomination set ke liye ye chupchaap ek suboptimal count return karta hai. Greedy ka koi quick fix nahi; rule bas un inputs ke liye galat hai.

**Fix: arbitrary coins ke liye is course ke Module 11 ka DP istemal karo**

\`\`\`js
function coinChangeDP(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

coinChangeDP([1, 3, 4], 6);   // 2  (3 + 3)
\`\`\`

\`\`\`ts
function coinChangeDP(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c]! + 1 < dp[a]!) dp[a] = dp[a - c]! + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]!;
}
\`\`\`

DP har coin ko har amount par aakhri istemal kiye gaye ki tarah consider karta hai, isliye ise ek early greedy commitment se trap nahi kiya jaa sakta. Cost O(amount * numCoins) — greedy ke near-instant jawaab se zyaada, par kisi bhi coin set ke liye sahi.

**Mirror image: fractional knapsack, jahaan greedy optimal HAI**

\`\`\`js
// Har item ka weight aur value; aap ek item ke FRACTIONS le sakte ho.
// Capacity ke andar kul value maximise karo.
function fractionalKnapsack(items, capacity) {
  const byRatio = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let total = 0, left = capacity;
  for (const it of byRatio) {
    if (left === 0) break;
    const take = Math.min(it.weight, left);      // sab lo, ya baaki space bharo
    total += (it.value / it.weight) * take;
    left -= take;
  }
  return total;
}
\`\`\`

Yahaan greedy — value-per-weight se sort karo, best ka jitna fit hota hai lo, phir agla best — saabit roop se optimal HAI. Ye *fractional* version ke liye kaam karta hai par 0/1 version ke liye nahi (Module 11 lesson 4) iska kaaran: agar ek behtar item poori tarah fit nahi hota, aap iske ek *slice* se top up karte ho, isliye kabhi barbaad capacity nahi hoti jo ek kharab remainder majboor kare. 0/1 mein aap slice nahi kar sakte, isliye ek locally-best whole item lena ek aisi capacity chhod sakta hai jise ek behtar pair istemal karta.`,

    content: `## When is greedy coin change actually correct?

\`\`\`
A coin system is "canonical" if greedy (biggest-first) is optimal for every
amount. Real currency systems (1, 2, 5, 10, 20, 50, ...) are canonical by
design. Some sufficient conditions:
  - {1, c, c^2, c^3, ...} for any c >= 2 (powers of a base) -> canonical
  - the standard {1, 5, 10, 25} -> canonical

Testing whether an arbitrary set is canonical is itself non-trivial (you check
amounts up to a bound related to the two largest coins). In an interview: if the
coins are not an obviously-canonical set, use the DP.
\`\`\`

The practical rule: greedy coin change is a special-case optimisation you can use when you *know* the coin system is canonical. For "given arbitrary coins", the answer is always the DP.

## Fractional knapsack: the exchange argument for why greedy is optimal

\`\`\`
Claim: sorting items by value/weight descending and filling the bag top-down
(taking a fraction of the last item if needed) is optimal.

Exchange: suppose an optimal packing O does not follow this order. Then there
are two items i and j with value/weight(i) > value/weight(j), where O has taken
LESS of i than possible and MORE of j than zero. Move a tiny amount of weight
dw from j to i: the bag's weight is unchanged, but the value changes by
dw * (value/weight(i) - value/weight(j)) > 0. So O was not optimal after all.
Repeating this, the optimum must be the greedy order.
\`\`\`

The slicing is essential to this argument: the "move dw from j to i" step is only always possible when items can be split. Remove that ability (0/1 knapsack) and the argument breaks — you cannot move a fractional amount, so a locally worse trade may be forced.

## Other problems where greedy is exactly right (and why)

\`\`\`
"Assign cookies": give each child the smallest cookie that satisfies their
  greed. Sort both, two pointers. Greedy: never waste a big cookie on a child
  a small one would satisfy.

"Gas station": one pass tracking running tank; if total gas >= total cost, the
  unique valid start is right after the point of minimum running balance.

"Jump game": track the furthest index reachable so far; if you ever stand
  beyond it, you are stuck. Greedy: always extend reach as far as possible.

"Partition labels": for each character, precompute its last occurrence; sweep,
  extending the current segment's end to the max last-occurrence seen, cut when
  the sweep index reaches that end.
\`\`\`

These share a shape: process left to right, maintain one running quantity (furthest reach, running balance, current segment end), and make each decision from that quantity alone. The next lesson covers this family in detail.

## The decision procedure, restated

\`\`\`
1. Write the greedy rule.
2. Spend real effort trying to break it with a 2-4 element counterexample.
3a. Broke it -> the counterexample IS the reason; use DP or search.
3b. Cannot break it -> attempt an exchange argument. If the swap always
    preserves validity and optimality, greedy is correct.
4. If unsure and the constraints allow it, code BOTH greedy and a brute force,
   and fuzz-test them against each other on small random inputs.
\`\`\``,

    contentHi: `## Greedy coin change asal mein kab sahi hai?

\`\`\`
Ek coin system "canonical" hai agar greedy (biggest-first) har amount ke liye
optimal hai. Asli currency systems (1, 2, 5, 10, 20, 50, ...) design se canonical
hain. Kuch sufficient conditions:
  - kisi c >= 2 ke liye {1, c, c^2, c^3, ...} (ek base ki powers) -> canonical
  - standard {1, 5, 10, 25} -> canonical

Ye test karna ki ek arbitrary set canonical hai ya nahi khud non-trivial hai (aap
do sabse bade coins se sambandhit ek bound tak amounts check karte ho). Ek interview
mein: agar coins ek obviously-canonical set nahi hain, DP istemal karo.
\`\`\`

Vyaavahaarik rule: greedy coin change ek special-case optimisation hai jise aap tab istemal kar sakte ho jab aap *jaante ho* ki coin system canonical hai. "Arbitrary coins diye gaye" ke liye, jawaab hamesha DP hai.

## Fractional knapsack: greedy optimal kyun hai iska exchange argument

\`\`\`
Daawa: items ko value/weight descending se sort karna aur bag ko top-down bharna
(zaroorat par aakhri item ka ek fraction lekar) optimal hai.

Exchange: maano ek optimal packing O is order ko follow nahi karta. Toh do items
i aur j hain jinke value/weight(i) > value/weight(j), jahaan O ne i ka sambhav
se KAM liya aur j ka zero se ZYAADA. j se i par ek tiny weight dw move karo:
bag ka weight na-badla, par value dw * (value/weight(i) - value/weight(j)) > 0
se badalti hai. Toh O optimal nahi tha. Ise dohraate hue, optimum greedy order
hona chahiye.
\`\`\`

Slicing is argument ke liye zaroori hai: "j se i par dw move karo" step sirf tab hamesha mumkin hai jab items split ho sakte hain. Wo kshamata hataao (0/1 knapsack) aur argument tootta hai — aap ek fractional amount move nahi kar sakte, isliye ek locally worse trade majboor ho sakti hai.

## Doosri problems jahaan greedy bilkul sahi hai (aur kyun)

\`\`\`
"Assign cookies": har child ko sabse chhota cookie do jo unki greed satisfy kare.
  Dono sort karo, two pointers. Greedy: ek chhota jise satisfy karta us child par
  kabhi ek bada cookie barbaad mat karo.

"Gas station": running tank track karte ek pass; agar total gas >= total cost,
  unique valid start minimum running balance ke point ke theek baad hai.

"Jump game": ab tak reachable furthest index track karo; agar aap kabhi iske aage
  khade ho, aap atak gaye. Greedy: hamesha reach ko jitna ho sake extend karo.

"Partition labels": har character ke liye, iski last occurrence precompute karo;
  sweep karo, current segment ka end dekhi gayi max last-occurrence tak extend
  karo, cut karo jab sweep index us end tak pahunche.
\`\`\`

Ye ek shape share karte hain: left se right process karo, ek running quantity maintain karo (furthest reach, running balance, current segment end), aur har decision sirf us quantity se karo. Agla lesson is family ko vistaar mein cover karta hai.

## Decision procedure, dobara batayi gayi

\`\`\`
1. Greedy rule likho.
2. Ise ek 2-4 element counterexample se todne mein asli effort do.
3a. Tod diya -> counterexample HI kaaran hai; DP ya search istemal karo.
3b. Nahi tod sakte -> ek exchange argument ki koshish karo. Agar swap hamesha
    validity aur optimality preserve karta hai, greedy sahi hai.
4. Agar unsure aur constraints allow karte hain, greedy AUR ek brute force DONO
   code karo, aur unhe small random inputs par ek doosre ke against fuzz-test karo.
\`\`\``,

    examples: [
      {
        title: 'Broken: greedy coin change on a non-canonical set',
        titleHi: 'Toota: ek non-canonical set par greedy coin change',
        code: `const sorted = coins.sort((a, b) => b - a);
for (const c of sorted) while (amount >= c) { amount -= c; count++; }`,
        codeJs: `function coinChangeGreedy(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a);
  let count = 0;
  for (const c of sorted) while (amount >= c) { amount -= c; count++; }
  return amount === 0 ? count : -1;
}
console.log(coinChangeGreedy([1, 3, 4], 6)); // 3  (4+1+1) — WRONG, optimum is 2`,
        codeTs: `function coinChangeGreedy(coins: number[], amount: number): number {
  const sorted = [...coins].sort((a, b) => b - a);
  let count = 0;
  for (const c of sorted) while (amount >= c) { amount -= c; count++; }
  return amount === 0 ? count : -1;
}`,
        output: `3`,
        explain: 'Taking the 4 for amount 6 forces the remaining 2 to be made from 1s. The denomination set {1,3,4} is not canonical, so biggest-first is not optimal.',
        explainHi: 'Amount 6 ke liye 4 lena baaki 2 ko 1s se banane ke liye majboor karta hai. Denomination set {1,3,4} canonical nahi hai, isliye biggest-first optimal nahi hai.',
      },
      {
        title: 'Fixed: the coin-change DP handles any denomination set',
        titleHi: 'Theek: coin-change DP kisi bhi denomination set ko handle karta hai',
        code: `for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);`,
        codeJs: `function coinChangeDP(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}
console.log(coinChangeDP([1, 3, 4], 6)); // 2  (3 + 3)`,
        codeTs: `function coinChangeDP(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins)
      if (c <= a) dp[a] = Math.min(dp[a]!, dp[a - c]! + 1);
  return dp[amount] === Infinity ? -1 : dp[amount]!;
}`,
        outputJs: `2`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The DP tries every coin as the last coin at every amount, so it never gets trapped by an early choice. O(amount * numCoins) versus greedy\'s O(numCoins log numCoins), but always correct.',
        explainHi: 'DP har amount par har coin ko last coin ki tarah try karta hai, isliye ye kabhi ek early choice se trap nahi hota. O(amount * numCoins) versus greedy ka O(numCoins log numCoins), par hamesha sahi.',
      },
      {
        title: 'Fractional knapsack: greedy IS optimal here',
        titleHi: 'Fractional knapsack: yahaan greedy optimal HAI',
        code: `sort by value/weight desc; take min(item.weight, remaining) of each`,
        codeJs: `function fractionalKnapsack(items, capacity) {
  const byRatio = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let total = 0, left = capacity;
  for (const it of byRatio) {
    if (left === 0) break;
    const take = Math.min(it.weight, left);
    total += (it.value / it.weight) * take;
    left -= take;
  }
  return total;
}
console.log(fractionalKnapsack([{weight:10,value:60},{weight:20,value:100},{weight:30,value:120}], 50));
// 240  (all of item 1 and 2, then 2/3 of item 3)`,
        codeTs: `type Item = { weight: number; value: number };
function fractionalKnapsack(items: Item[], capacity: number): number {
  const byRatio = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
  let total = 0, left = capacity;
  for (const it of byRatio) {
    if (left === 0) break;
    const take = Math.min(it.weight, left);
    total += (it.value / it.weight) * take;
    left -= take;
  }
  return total;
}`,
        outputJs: `240`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Because items can be sliced, any capacity left over is filled with a fraction of the best remaining item. The exchange argument (move weight from a lower ratio to a higher one) proves this order is optimal.',
        explainHi: 'Kyunki items slice ho sakte hain, koi bhi bachi capacity best baaki item ke ek fraction se bharti hai. Exchange argument (ek lower ratio se ek higher par weight move karo) saabit karta hai ye order optimal hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// using greedy coin change for "given arbitrary coins, fewest to make amount"`,
        right: `// use the O(amount * numCoins) DP. Greedy coin change is only valid for
// canonical coin systems (which you would have to already know or prove).`,
        why: 'Greedy coin change works for real currencies because those are engineered to be canonical. For an unknown denomination set, biggest-first can be trapped into a worse remainder.',
        whyHi: 'Greedy coin change asli currencies ke liye kaam karta hai kyunki wo canonical hone ke liye engineer ki gayi hain. Ek anjaan denomination set ke liye, biggest-first ek kharab remainder mein trap ho sakta hai.',
      },
      {
        wrong: `// applying value-per-weight greedy to the 0/1 knapsack
items.sort((a, b) => b.value/b.weight - a.value/a.weight);
for (const it of items) if (it.weight <= left) { total += it.value; left -= it.weight; }`,
        right: `// 0/1 knapsack needs DP (Module 11 lesson 4). value-per-weight greedy is
// only optimal for the FRACTIONAL version, where you can slice the last item.`,
        why: 'Without slicing, a locally-best whole item can leave capacity that a different combination would have used more valuably. The exchange argument for fractional knapsack relies on being able to move a fractional weight.',
        whyHi: 'Slicing ke bina, ek locally-best whole item ek aisi capacity chhod sakta hai jise ek alag combination zyaada valuably istemal karta. Fractional knapsack ka exchange argument ek fractional weight move kar paane par nirbhar karta hai.',
      },
      {
        wrong: `// deciding greedy is correct because it passed 2-3 hand-picked examples`,
        right: `// hand-picked examples are where greedy LOOKS right. Actively search for a
// counterexample, or fuzz-test greedy against a brute force on random inputs.`,
        why: 'Broken greedy rules almost always pass the obvious examples — that is why they feel right. Confidence should come from an exchange argument or from automated testing against brute force, not from a few cases.',
        whyHi: 'Toote greedy rules lagbhag hamesha spasht examples pass karte hain — yahi wajah hai ki wo sahi lagte hain. Vishwaas ek exchange argument se ya brute force ke against automated testing se aana chahiye, kuch cases se nahi.',
      },
    ],

    realWorld: [
      {
        en: '**Cash-dispensing ATMs** use greedy denomination selection because the note set is deliberately canonical — the biggest-first choice is guaranteed optimal for the amounts they dispense.',
        hi: '**Cash-dispensing ATMs** greedy denomination selection istemal karte hain kyunki note set jaan-boojhkar canonical hai — biggest-first choice unke dispense kiye amounts ke liye guaranteed optimal hai.',
      },
      {
        en: '**Streaming and bandwidth allocation** where a resource is infinitely divisible use fractional-knapsack greedy: serve the highest value-per-unit demand first, then the next.',
        hi: '**Streaming aur bandwidth allocation** jahaan ek resource anant vibhaajya hai fractional-knapsack greedy istemal karte hain: sabse zyaada value-per-unit demand pehle serve karo, phir agla.',
      },
      {
        en: '**Compiler register allocation and cache-line packing** are 0/1-knapsack-shaped and use DP or heuristics, not value-per-weight greedy, because slots are indivisible.',
        hi: '**Compiler register allocation aur cache-line packing** 0/1-knapsack-shaped hain aur DP ya heuristics istemal karte hain, value-per-weight greedy nahi, kyunki slots avibhaajya hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Greedy coin change works for US and Euro coins but not for {1, 3, 4}. What is special about the currencies, and what would you tell an interviewer who asks you to "make change with the fewest coins"?',
        qHi: 'Greedy coin change US aur Euro coins ke liye kaam karta hai par {1, 3, 4} ke liye nahi. Currencies ke baare mein kya khaas hai, aur aap ek interviewer ko kya batayenge jo aapse "sabse kam coins se change karo" poochta hai?',
        a: 'Real currency denomination sets are what mathematicians call canonical: for a canonical set, the greedy algorithm of repeatedly taking the largest coin that does not exceed the remaining amount produces the minimum number of coins for every amount. Currency designers choose denominations specifically so this holds, because it makes cash handling by humans and machines simple and reliable. Sets like one, five, ten, twenty-five, or sets that are one and successive powers of a base, have this property. An arbitrary set like one, three, four does not: for the amount six, greedy takes a four and is then forced to make two out of two ones, three coins total, whereas two threes make six in two coins. The trap is that committing to the four leaves a remainder that the smaller coins fill inefficiently, and greedy cannot undo that commitment. To an interviewer asking for the fewest coins with a given set of denominations, the correct answer is the dynamic programming solution: dp of an amount is one plus the minimum over all coins of dp of that amount minus the coin, with dp of zero equal to zero. That runs in time proportional to the amount times the number of coins and is always correct. I would mention that greedy is an option only if we know the denomination set is canonical, and that verifying canonicity is itself a small algorithm, so unless the problem guarantees a standard currency, DP is the safe choice.',
        aHi: 'Asli currency denomination sets wo hain jinhe mathematicians canonical kehte hain: ek canonical set ke liye, baar-baar sabse bada coin lena jo baaki amount se zyaada nahi hai greedy algorithm har amount ke liye minimum coins banaata hai. Currency designers denominations khaas taur par isliye chunte hain taaki ye hold kare, kyunki ye insaanon aur machines dwara cash handling ko saral aur bharosemand banaata hai. Ek, paanch, das, pachees jaise sets, ya wo sets jo ek aur ek base ki lagaataar powers hain, ye property rakhte hain. Ek, teen, chaar jaisa ek arbitrary set nahi rakhta: amount chhe ke liye, greedy ek chaar leta hai aur phir do ek se do banaane ke liye majboor hota hai, kul teen coins, jabki do teen chhe ko do coins mein banate hain. Trap ye hai ki chaar par commit karna ek remainder chhodta hai jise chhote coins inefficiently bharte hain, aur greedy us commitment ko undo nahi kar sakta. Ek interviewer jo ek diye gaye denominations ke set ke saath sabse kam coins poochta hai, sahi jawaab dynamic programming solution hai: ek amount ka dp ek plus sab coins par us amount minus coin ke dp ka minimum hai, dp of zero zero ke barabar. Wo amount guna coins ki tadaad ke anupaat mein time mein chalta hai aur hamesha sahi hai. Main zikr karunga ki greedy ek option hai sirf agar hum jaante hain ki denomination set canonical hai, aur canonicity verify karna khud ek chhota algorithm hai, isliye jab tak problem ek standard currency guarantee nahi karti, DP safe choice hai.',
      },
      {
        q: 'Why is greedy provably optimal for the fractional knapsack but not the 0/1 knapsack? Give the argument for one and the counterexample for the other.',
        qHi: 'Fractional knapsack ke liye greedy saabit roop se optimal kyun hai par 0/1 knapsack ke liye nahi? Ek ke liye argument do aur doosre ke liye counterexample.',
        a: 'For the fractional knapsack, greedy sorts items by value per unit weight in decreasing order and fills the bag from the top, taking as much of each item as fits and a fraction of the last one to exactly reach capacity. The exchange argument proves this is optimal. Suppose some optimal packing did not follow the ratio order. Then there must be two items, call them i with a higher value-per-weight and j with a lower one, where the packing took strictly less of i than it could and strictly more than zero of j. Take a tiny sliver of weight, dw, out of j and put it into i. The total weight in the bag is unchanged, but the value goes up by dw times the difference in their ratios, which is positive because i has the higher ratio. So the packing was not actually optimal, a contradiction. Repeating the swap drives any packing toward the greedy ratio order, so greedy is optimal. The step that makes this work is moving a fractional weight, which is only allowed when items divide. In the 0/1 knapsack items are all-or-nothing, and greedy can fail: with capacity fifty and items of weight ten value sixty, weight twenty value one hundred, weight thirty value one hundred twenty, the value-per-weight order is the weight-ten item first, then weight-twenty, then weight-thirty. Greedy takes the ten and the twenty for value one hundred sixty and weight thirty, then the thirty-weight item does not fit. But taking the weight-twenty and weight-thirty items together gives value two hundred twenty at weight fifty, which is better. Greedy was trapped because it could not slice the thirty-weight item to fill the leftover twenty units, and once it committed to the ten-weight item that leftover was wasted.',
        aHi: 'Fractional knapsack ke liye, greedy items ko value per unit weight se ghatte order mein sort karta hai aur bag ko top se bharta hai, har item ka jitna fit hota hai lekar aur aakhri ka ek fraction lekar bilkul capacity tak pahunchne ke liye. Exchange argument saabit karta hai ye optimal hai. Maano koi optimal packing ratio order follow nahi karta. Toh do items hone chahiye, unhe i (higher value-per-weight) aur j (lower) kaho, jahaan packing ne i ka sakhti se kam liya jitna ye le sakti thi aur j ka sakhti se zero se zyaada. Ek tiny sliver of weight, dw, j se nikaalo aur ise i mein daalo. Bag mein kul weight na-badla, par value dw guna unke ratios ke antar se upar jaati hai, jo positive hai kyunki i ka higher ratio hai. Toh packing asal mein optimal nahi thi, ek virodhabhaas. Swap dohraana kisi bhi packing ko greedy ratio order ki taraf le jaata hai, isliye greedy optimal hai. Jo step ise kaam karvaata hai wo ek fractional weight move karna hai, jo sirf tab allowed hai jab items divide karte hain. 0/1 knapsack mein items all-or-nothing hain, aur greedy fail ho sakta hai: capacity pachaas aur items weight das value saath, weight bees value sau, weight tees value ek sau bees ke saath, value-per-weight order weight-das item pehle, phir weight-bees, phir weight-tees hai. Greedy das aur bees leta hai value ek sau saath aur weight tees ke liye, phir tees-weight item fit nahi hota. Par weight-bees aur weight-tees items saath lena value do sau bees deta hai weight pachaas par, jo behtar hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement coinChangeGreedy and coinChangeDP. Test both on [25,10,5,1] amount 63 (both give 6) and on [1,3,4] amount 6 (greedy gives 3, DP gives 2). Then fuzz-test: for random small coin sets and amounts, count how often greedy differs from DP.',
        taskHi: 'coinChangeGreedy aur coinChangeDP implement karo. Dono ko [25,10,5,1] amount 63 (dono 6 dete hain) aur [1,3,4] amount 6 (greedy 3 deta hai, DP 2) par test karo. Phir fuzz-test: random small coin sets aur amounts ke liye, gino greedy DP se kitni baar alag hota hai.',
        hint: 'Generate coin sets like [1, random 2-9, random 2-9] and amounts up to 30. You will find disagreements on a large fraction of non-canonical sets.',
        hintHi: '[1, random 2-9, random 2-9] jaise coin sets aur 30 tak amounts generate karo. Aap non-canonical sets ke ek bade hisse par disagreements paoge.',
      },
      {
        task: 'Implement fractionalKnapsack (greedy) and knapsack01 (DP from Module 11). On items {w:10,v:60},{w:20,v:100},{w:30,v:120} capacity 50, confirm fractional gives 240 and 0/1 gives 220.',
        taskHi: 'fractionalKnapsack (greedy) aur knapsack01 (Module 11 se DP) implement karo. items {w:10,v:60},{w:20,v:100},{w:30,v:120} capacity 50 par, confirm karo fractional 240 deta hai aur 0/1 220 deta hai.',
        hint: 'Fractional: take all of items 1 and 2 (weight 30, value 160), then 20/30 of item 3 (value 80) -> 240. 0/1: items 2 and 3 -> 220.',
        hintHi: 'Fractional: items 1 aur 2 ka sab lo (weight 30, value 160), phir item 3 ka 20/30 (value 80) -> 240. 0/1: items 2 aur 3 -> 220.',
      },
      {
        task: 'Write a canonicity checker: given a coin set, verify (by comparing greedy against DP for every amount up to, say, the sum of the two largest coins) whether greedy is optimal for all of them. Report the smallest failing amount if any.',
        taskHi: 'Ek canonicity checker likho: ek coin set diya gaya, verify karo (har amount ke liye greedy ko DP se compare karke, maano, do sabse bade coins ke sum tak) kya greedy un sab ke liye optimal hai. Agar koi hai toh sabse chhota failing amount report karo.',
        hint: 'For {1,3,4}, the smallest failing amount is 6. For {1,5,10,25}, no amount up to the bound fails.',
        hintHi: '{1,3,4} ke liye, sabse chhota failing amount 6 hai. {1,5,10,25} ke liye, bound tak koi amount fail nahi hota.',
      },
    ],

    keyTakeaways: [
      'Greedy coin change (biggest coin first) is optimal ONLY for "canonical" coin systems — real currencies are designed to be canonical. For arbitrary denominations, use the O(amount * numCoins) DP.',
      'A broken greedy rule almost always passes the obvious examples. Prove correctness with an exchange argument, or fuzz-test against brute force — never trust a few hand-picked cases.',
      'Fractional knapsack: greedy (sort by value-per-weight, take the best, slice the last item) IS provably optimal, by an exchange argument that moves a fractional weight from a low ratio to a high one.',
      '0/1 knapsack: the same greedy fails, because you cannot slice — a locally-best whole item can leave capacity a better combination would have used. Use DP (Module 11 lesson 4).',
      'The distinguishing factor: greedy needs the greedy-choice property. If a local best can foreclose a better global combination, greedy is wrong and DP (which tries all first choices) is needed.',
      'Decision procedure: write the rule, try hard to break it, then either exchange-argue it or fall back to DP; when in doubt, code both and fuzz-test.',
    ],
    keyTakeawaysHi: [
      'Greedy coin change (sabse bada coin pehle) SIRF "canonical" coin systems ke liye optimal hai — asli currencies canonical hone ke liye design ki gayi hain. Arbitrary denominations ke liye, O(amount * numCoins) DP istemal karo.',
      'Ek toota greedy rule lagbhag hamesha spasht examples pass karta hai. Correctness ko ek exchange argument se saabit karo, ya brute force ke against fuzz-test karo — kabhi kuch hand-picked cases par bharosa mat karo.',
      'Fractional knapsack: greedy (value-per-weight se sort karo, best lo, aakhri item slice karo) saabit roop se optimal HAI, ek exchange argument se jo ek low ratio se ek high par ek fractional weight move karta hai.',
      '0/1 knapsack: wahi greedy fail hota hai, kyunki aap slice nahi kar sakte — ek locally-best whole item ek aisi capacity chhod sakta hai jise ek behtar combination istemal karta. DP istemal karo (Module 11 lesson 4).',
      'Farak karne wala factor: greedy ko greedy-choice property chahiye. Agar ek local best ek behtar global combination foreclose kar sakta hai, greedy galat hai aur DP (jo sab pehli choices try karta hai) chahiye.',
      'Decision procedure: rule likho, ise todne ki sakht koshish karo, phir ya toh exchange-argue karo ya DP par wapas jao; sandeh mein, dono code karo aur fuzz-test karo.',
    ],
  },
];
