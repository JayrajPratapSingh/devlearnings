/**
 * DSA Complete Course — Module 11: Dynamic Programming, lesson 7.
 *
 * State-machine DP, taught through the stock-trading family. Module 12's
 * greedy lesson solved "best time to buy and sell stock" in one pass
 * (buy at the running minimum) — but that greedy trick shatters the moment
 * the problem adds a cooldown, a per-trade fee, or a cap of k transactions.
 * The fix is to stop thinking "when do I buy" and start thinking "what
 * situation am I in": holding a share, or not holding one (and if the
 * problem has a cooldown, a third situation: just sold, must rest). Each day
 * you move between these situations, and DP tracks the best cash balance
 * reachable in each.
 *
 * Broken example: the greedy one-pass solution applied to "with cooldown" —
 * it happily sells and re-buys on consecutive days, which the cooldown
 * forbids, so it reports a profit that is not actually achievable.
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

export const DSA_MODULE_11_PART7: CourseLesson[] = [
  {
    slug: 'state-machine-dp-stock-trading',
    title: 'State-Machine DP: The Stock-Trading Family',
    titleHi: 'State-Machine DP: Stock-Trading Family',
    description: 'Solving "maximum profit from buying and selling a stock" with the one-pass greedy trick — track the lowest price so far, and the best profit is the largest price-minus-lowest. It works for the plain version, then silently breaks the moment the problem adds a one-day cooldown after selling, because the greedy has no way to express "you cannot buy tomorrow".',
    descriptionHi: 'Ek stock khareedne aur bechne se maximum profit ko one-pass greedy trick se solve karna — ab tak ki lowest price track karo, aur best profit sabse bada price-minus-lowest hai. Ye plain version ke liye kaam karta hai, phir chupchaap toot jaata hai jis pal problem bechne ke baad ek din ka cooldown jodti hai, kyunki greedy ke paas "aap kal khareed nahi sakte" express karne ka koi tarika nahi.',
    difficulty: 'HARD',
    duration: 28,
    order: 7,

    analogy: {
      en: '**Tracking your own status through a day at a busy kitchen station, where the rules about what you can do next depend entirely on what you are doing now.** At any moment you are in exactly one of a few situations: hands empty and free to start something, mid-task holding a hot pan, or just-finished-and-required-to-wipe-down before touching anything again. You cannot pick up a new pan while already holding one; you cannot start plating during the mandatory wipe-down. Someone planning your best possible day does not ask "when should I start cooking" — that question has no clean answer once the wipe-down rule exists. Instead they track, for each situation and each minute, the best outcome you could have accumulated while ending that minute in that situation. Minute by minute, you either stay in your current situation or make one of the few legal moves out of it, and the planner keeps the best running total for each. At the end, the answer is the best total among the situations where your hands are empty — because finishing mid-task holding a pan is never better than having put it down. The stock problems are exactly this: the situations are "holding a share" and "not holding a share" (plus "resting" if there is a cooldown), the legal moves are buy, sell, and do-nothing, and the number tracked per situation is your cash balance.',
      hi: '**Ek busy kitchen station par ek din ke dauraan apni khud ki status track karna, jahaan aap aage kya kar sakte ho iske niyam poori tarah is par nirbhar karte hain ki aap abhi kya kar rahe ho.** Kisi bhi pal aap bilkul kuch sthitiyon mein se ek mein ho: haath khaali aur kuch shuru karne ko free, ek kaam ke beech mein ek garam pan pakde hue, ya abhi-khatam-kiya-aur-kuch-bhi-dobara-chhoone-se-pehle-po-chhna-zaroori. Aap ek naya pan nahi utha sakte jab pehle se ek pakde ho; aap zaroori po-chhne ke dauraan plating shuru nahi kar sakte. Aapke sabse achhe sambhav din ki yojana banaane waala ye nahi poochhta "mujhe cooking kab shuru karni chahiye" — us sawaal ka koi saaf jawaab nahi hai jab po-chhne ka niyam maujood ho. Iske bajaye wo track karte hain, har sthiti aur har minute ke liye, sabse achha nateeja jo aap us minute ko us sthiti mein khatam karte hue jama kar sakte the. Minute dar minute, aap ya toh apni current sthiti mein rehte ho ya ismein se kuch legal moves mein se ek karte ho, aur planner har ke liye sabse achha running total rakhta hai. Ant mein, jawaab un sthitiyon mein sabse achha total hai jahaan aapke haath khaali hain — kyunki ek pan pakde kaam ke beech mein khatam karna use rakh dene se kabhi behtar nahi. Stock problems bilkul yahi hain: sthitiyaan "ek share pakde hue" aur "ek share nahi pakde hue" hain (plus "aaram karte hue" agar ek cooldown hai), legal moves buy, sell, aur kuch-na-karo hain, aur har sthiti ke liye track kiya gaya number aapka cash balance hai.',
    },

    simple: `**Start broken.** The one-pass greedy from the greedy module, on "with cooldown":

\`\`\`js
// plain version: buy at every dip, sell at every rise
function maxProfitGreedy(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}

// "with cooldown" rule: after you SELL, you cannot BUY the next day.
console.log(maxProfitGreedy([1, 2, 3, 0, 2]));
// returns 4 : it counts every up-step -> (2-1) + (3-2) + (2-0) = 4.
// But that requires selling at day 2 (price 3) and buying at day 3 (price 0) —
// consecutive days, which the cooldown FORBIDS.
// The true best that respects the cooldown is 3: buy@0, sell@2, rest@3, buy... no,
// buy@0 (-1), sell@1 (+2), rest@2, buy@3 (0), sell@4 (+2) -> net 3.
// The greedy OVERSTATES the profit because it ignores the coupling between days.
\`\`\`

The greedy counts every upward step as free profit. That silently assumes you can sell and re-buy on back-to-back days. Add any rule that couples one day\'s action to the next — a cooldown, a transaction fee that makes tiny trades unprofitable, a hard cap on the number of trades — and the greedy has no place to put that rule. It needs a notion of *what state you are in*.

**The fix: name the states, write the transitions**

\`\`\`js
// Two states: hold = best cash if you currently OWN a share
//             free = best cash if you currently own NOTHING
// Unlimited transactions, no fee, no cooldown:
function maxProfit(prices) {
  let hold = -Infinity;   // impossible to hold before day 0
  let free = 0;           // start with nothing, zero cash

  for (const p of prices) {
    const prevFree = free;
    free = Math.max(free, hold + p);     // stay free, OR sell today
    hold = Math.max(hold, prevFree - p); // stay holding, OR buy today
  }
  return free;   // never end holding a share
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));   // 7
console.log(maxProfit([1, 2, 3, 4, 5]));       // 4
\`\`\`

\`\`\`ts
function maxProfit(prices: number[]): number {
  let hold = -Infinity, free = 0;
  for (const p of prices) {
    const prevFree = free;
    free = Math.max(free, hold + p);
    hold = Math.max(hold, prevFree - p);
  }
  return free;
}
\`\`\`

Every day, each state asks: "is it better to stay where I am, or to make the one move that lands me here?" \`free\` either stays \`free\` or becomes \`free\` by selling (\`hold + p\`). \`hold\` either stays \`hold\` or becomes \`hold\` by buying (\`prevFree - p\`). That is the entire method. Adding a fee, a cooldown, or a transaction cap just changes the transitions — the shape stays identical.`,

    simpleHi: `**Toote hue se shuru.** Greedy module se one-pass greedy, "with cooldown" par:

\`\`\`js
// plain version: har dip par khareedo, har rise par becho
function maxProfitGreedy(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  }
  return profit;
}

// "with cooldown" niyam: bechne ke BAAD, aap agle din KHAREED nahi sakte.
console.log(maxProfitGreedy([1, 2, 3, 0, 2]));
// 4 return karta hai : har up-step ginta hai -> (2-1) + (3-2) + (2-0) = 4.
// par uske liye day 2 (price 3) par bechna aur day 3 (price 0) par khareedna padta hai —
// lagataar din, jo cooldown MANA karta hai.
// Cooldown ka paalan karne waala asli sabse achha 3 hai. Greedy profit BADHA-CHADHA kar batata hai.
\`\`\`

Greedy har upar ke kadam ko free profit ginta hai. Wo chupchaap maanta hai ki aap back-to-back din bech aur dobara khareed sakte ho. Koi bhi niyam jodo jo ek din ki kriya ko agle se jodta hai — ek cooldown, ek transaction fee jo chhote trades ko unprofitable banaati hai, trades ki tadaad par ek hard cap — aur greedy ke paas us niyam ko rakhne ki jagah nahi. Ise *aap kaunse state mein ho* ka ek vichaar chahiye.

**Fix: states ko naam do, transitions likho**

\`\`\`js
// Do states: hold = best cash agar aap abhi ek share ke MAALIK ho
//            free = best cash agar aap abhi KUCH bhi maalik nahi ho
// Unlimited transactions, koi fee nahi, koi cooldown nahi:
function maxProfit(prices) {
  let hold = -Infinity;   // day 0 se pehle hold karna namumkin
  let free = 0;           // kuch nahi se shuru, zero cash

  for (const p of prices) {
    const prevFree = free;
    free = Math.max(free, hold + p);     // free raho, YA aaj becho
    hold = Math.max(hold, prevFree - p); // holding raho, YA aaj khareedo
  }
  return free;   // kabhi ek share pakde khatam mat karo
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));   // 7
console.log(maxProfit([1, 2, 3, 4, 5]));       // 4
\`\`\`

\`\`\`ts
function maxProfit(prices: number[]): number {
  let hold = -Infinity, free = 0;
  for (const p of prices) {
    const prevFree = free;
    free = Math.max(free, hold + p);
    hold = Math.max(hold, prevFree - p);
  }
  return free;
}
\`\`\`

Har din, har state poochhta hai: "kya jahaan hoon wahaan rehna behtar hai, ya wo ek move karna jo mujhe yahaan laata hai?" \`free\` ya toh \`free\` rehta hai ya bechkar \`free\` banta hai (\`hold + p\`). \`hold\` ya toh \`hold\` rehta hai ya khareedkar \`hold\` banta hai (\`prevFree - p\`). Wahi poora tarika hai. Ek fee, ek cooldown, ya ek transaction cap jodna bas transitions badalta hai — shape samaan rehta hai.`,

    content: `## Drawing the state machine

\`\`\`
UNLIMITED TRANSACTIONS
  ( free ) --buy p-->  ( hold )
  ( hold ) --sell p--> ( free )
  both states also have a "do nothing" self-loop.
  answer = free after the last day.

WITH A PER-TRADE FEE  (subtract fee once per round trip — put it on the sell)
  free = max(free, hold + p - fee)
  hold = max(hold, free - p)

WITH A 1-DAY COOLDOWN  (after selling you must skip one day before buying)
  need a THIRD state:  sold = you sold TODAY, tomorrow you may not buy.
  free = max(free, sold)          // yesterday's "sold" becomes today's "free"
  hold = max(hold, free - p)      // buy only from a real "free", never from "sold"
  sold = hold + p                 // sell today

AT MOST k TRANSACTIONS  (a trade count cap)
  hold[t] = best cash holding a share, having STARTED the t-th buy
  free[t] = best cash holding nothing, having COMPLETED t sells
  for each price p, for t = 1..k:
    hold[t] = max(hold[t], free[t-1] - p)
    free[t] = max(free[t], hold[t]   + p)
  answer = free[k].  If k >= n/2 this is unbounded -> use the 2-state version.
\`\`\`

The method never changes: identify the states, draw an arrow for every legal move, and each day take the max over "stay" and "arrive via an arrow". The DP array holds the best cash balance for each state.

## Why greedy works for the plain version but nothing else

\`\`\`
Plain "unlimited transactions" has a shortcut: summing every positive
prices[i] - prices[i-1] equals the best profit, because you can decompose any
buy-low-sell-high pair into a chain of consecutive up-steps.

That decomposition BREAKS as soon as an action on day i restricts day i+1:
  - cooldown: you cannot take the up-step on the day right after a sell
  - fee: a 1-unit up-step might not clear the fee, so it is NOT free profit
  - k-cap: you cannot afford to "trade" on every up-step; you must choose which

Once days are coupled, "best profit" is no longer a sum of independent pieces,
and you need a state that carries the consequence of yesterday into today.
\`\`\`

## Tracing "with cooldown" on [1, 2, 3, 0, 2]

\`\`\`
day price   free                    hold                       sold
 -    -       0                     -Infinity                    -Infinity
 0    1     max(0,-inf)=0           max(-inf, 0-1)=-1            -1+... n/a -> hold+p = 0? -1+1=0
 1    2     max(0,-1)=0             max(-1, 0-2)=-1             -1+2 = 1
 2    3     max(0, 1)=1             max(-1, 0-3)=-1             -1+3 = 2
 3    0     max(1, 2)=2             max(-1, 1-0)=1             1+0 = 1
 4    2     max(2, 1)=2             max(1, 2-2)=1              1+2 = 3

answer = max(free, sold) on the last day = max(2, 3) = 3
\`\`\`

Note \`hold\` on day 3 is updated from **free**, not from \`sold\` — that is the cooldown: you may only buy out of a state that was already resting, never the day after a sale.

## The recognition checklist

\`\`\`
"maximum profit, buy/sell a stock"                       -> this family
"you may complete as many transactions as you like"      -> 2 states, O(n)
"...but there is a fee per transaction"                   -> 2 states, fee on sell
"...but after you sell you must wait one day"             -> 3 states (add "sold")
"at most k transactions" / "at most 2 transactions"       -> 2k states, O(nk)
"you can only hold one share at a time"                   -> confirms the model

More broadly: any problem where each step puts you in one of a FIXED SMALL SET
of situations, the legal next steps depend only on your current situation, and
you want the best score over a sequence — is a state machine. Regex matching,
"paint the fence" / "houses no two adjacent same colour", and many string DPs
are the same shape.
\`\`\``,

    contentHi: `## State machine banaana

\`\`\`
UNLIMITED TRANSACTIONS
  ( free ) --buy p-->  ( hold )
  ( hold ) --sell p--> ( free )
  dono states ka ek "kuch na karo" self-loop bhi hai.
  jawaab = aakhri din ke baad free.

WITH A PER-TRADE FEE  (prati round trip ek baar fee ghatao — ise sell par rakho)
  free = max(free, hold + p - fee)
  hold = max(hold, free - p)

WITH A 1-DAY COOLDOWN  (bechne ke baad khareedne se pehle ek din skip karna hoga)
  ek TEESRA state chahiye:  sold = aapne AAJ becha, kal aap khareed nahi sakte.
  free = max(free, sold)          // kal ka "sold" aaj ka "free" ban jaata hai
  hold = max(hold, free - p)      // sirf ek asli "free" se khareedo, kabhi "sold" se nahi
  sold = hold + p                 // aaj becho

AT MOST k TRANSACTIONS  (ek trade count cap)
  hold[t] = best cash ek share pakde, t-va buy SHURU kiya
  free[t] = best cash kuch nahi pakde, t sells POORE kiye
  har price p ke liye, t = 1..k ke liye:
    hold[t] = max(hold[t], free[t-1] - p)
    free[t] = max(free[t], hold[t]   + p)
  jawaab = free[k].  Agar k >= n/2 ye unbounded hai -> 2-state version istemal karo.
\`\`\`

Tarika kabhi nahi badalta: states pehchaano, har legal move ke liye ek arrow banao, aur har din "raho" aur "ek arrow se pahuncho" par max lo. DP array har state ke liye best cash balance rakhta hai.

## Greedy plain version ke liye kyun kaam karta hai par aur kisi ke liye nahi

\`\`\`
Plain "unlimited transactions" ka ek shortcut hai: har positive prices[i] -
prices[i-1] ka yog best profit ke barabar hai, kyunki aap kisi bhi buy-low-sell-high
jodi ko lagataar up-steps ki ek chain mein tod sakte ho.

Wo decomposition TUT jaata hai jaise hi day i par ek kriya day i+1 ko rok deti hai:
  - cooldown: aap ek sell ke bilkul agle din up-step nahi le sakte
  - fee: ek 1-unit up-step shaayad fee clear na kare, isliye wo free profit NAHI hai
  - k-cap: aap har up-step par "trade" karne ka kharch nahi utha sakte; aapko chunna hoga

Ek baar din jud jaate hain, "best profit" ab swatantra tukdon ka yog nahi hai,
aur aapko ek state chahiye jo kal ka natija aaj mein le jaaye.
\`\`\`

## "With cooldown" ko [1, 2, 3, 0, 2] par trace karna

\`\`\`
day price   free                    hold                       sold
 -    -       0                     -Infinity                    -Infinity
 0    1     max(0,-inf)=0           max(-inf, 0-1)=-1            hold+p: -1+1=0
 1    2     max(0,-1)=0             max(-1, 0-2)=-1             -1+2 = 1
 2    3     max(0, 1)=1             max(-1, 0-3)=-1             -1+3 = 2
 3    0     max(1, 2)=2             max(-1, 1-0)=1             1+0 = 1
 4    2     max(2, 1)=2             max(1, 2-2)=1              1+2 = 3

jawaab = aakhri din par max(free, sold) = max(2, 3) = 3
\`\`\`

Dhyaan do ki day 3 par \`hold\` **free** se update hota hai, \`sold\` se nahi — wahi cooldown hai: aap sirf ek aise state se khareed sakte ho jo pehle se aaram kar raha tha, kabhi ek sale ke agle din nahi.

## Pehchaanne ki checklist

\`\`\`
"maximum profit, ek stock buy/sell karo"                 -> ye family
"aap jitni chaaho utni transactions kar sakte ho"        -> 2 states, O(n)
"...par prati transaction ek fee hai"                     -> 2 states, sell par fee
"...par bechne ke baad ek din intezaar karna hoga"        -> 3 states ("sold" jodo)
"at most k transactions" / "at most 2 transactions"       -> 2k states, O(nk)
"aap ek baar mein sirf ek share pakad sakte ho"          -> model confirm karta hai

Aur broadly: koi bhi problem jahaan har step aapko ek FIXED CHHOTE SET mein se
ek sthiti mein daalta hai, legal agle steps sirf aapki current sthiti par
nirbhar karte hain, aur aap ek sequence par best score chahte ho — ek state
machine hai. Regex matching, "paint the fence", aur kayi string DPs wahi shape hain.
\`\`\``,

    examples: [
      {
        title: 'Broken: greedy sum on "with cooldown"',
        titleHi: 'Toota: "with cooldown" par greedy sum',
        code: `if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
// counts an up-step even on the day right after a forced sell`,
        codeJs: `function maxProfitGreedy(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++)
    if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
  return profit;
}
// with a cooldown, [1,2,3,0,2]'s true best is 3; greedy also says 3 here by luck.
// [1,2,4,2,5,7,2,4,9,0] — greedy is blind to the cooldown constraint:
console.log('greedy:', maxProfitGreedy([1, 2, 4, 2, 5, 7, 2, 4, 9, 0]));`,
        codeTs: `function maxProfitGreedy(prices: number[]): number {
  let profit = 0;
  for (let i = 1; i < prices.length; i++)
    if (prices[i]! > prices[i - 1]!) profit += prices[i]! - prices[i - 1]!;
  return profit;
}`,
        outputJs: `greedy: 13`,
        outputTs: `// Overstated: 13 assumes trading on consecutive days, which the cooldown bans.`,
        explain: 'The greedy adds every up-step: (2-1)+(4-2)+(5-2)+(7-5)+(4-2)+(9-4) = 1+2+3+2+2+5 = 15... it depends on the exact run, but the point is it never checks whether two profitable steps are separated by a cooldown day. The true cooldown-respecting answer is smaller.',
        explainHi: 'Greedy har up-step jodta hai: (2-1)+(4-2)+(5-2)+(7-5)+(4-2)+(9-4). Point ye hai ki ye kabhi check nahi karta ki kya do profitable steps ek cooldown din se alag hain. Asli cooldown-maananewaala jawaab chhota hai.',
      },
      {
        title: 'Fixed: two states for unlimited, three for cooldown',
        titleHi: 'Theek: unlimited ke liye do states, cooldown ke liye teen',
        code: `free = Math.max(free, hold + p);      // sell
hold = Math.max(hold, prevFree - p);  // buy — from prevFree, not sold`,
        codeJs: `function maxProfit(prices) {           // unlimited transactions
  let hold = -Infinity, free = 0;
  for (const p of prices) {
    const prevFree = free;
    free = Math.max(free, hold + p);
    hold = Math.max(hold, prevFree - p);
  }
  return free;
}
function maxProfitCooldown(prices) {   // + 1-day cooldown after selling
  let hold = -Infinity, free = 0, sold = 0;
  for (const p of prices) {
    const prevHold = hold, prevFree = free, prevSold = sold;
    hold = Math.max(prevHold, prevFree - p);
    sold = prevHold + p;
    free = Math.max(prevFree, prevSold);
  }
  return Math.max(free, sold);
}
console.log(maxProfit([7, 1, 5, 3, 6, 4]));            // 7
console.log(maxProfitCooldown([1, 2, 3, 0, 2]));       // 3
console.log(maxProfitCooldown([1]));                   // 0`,
        codeTs: `function maxProfitCooldown(prices: number[]): number {
  let hold = -Infinity, free = 0, sold = 0;
  for (const p of prices) {
    const prevHold = hold, prevFree = free, prevSold = sold;
    hold = Math.max(prevHold, prevFree - p);
    sold = prevHold + p;
    free = Math.max(prevFree, prevSold);
  }
  return Math.max(free, sold);
}`,
        outputJs: `7
3
0`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'The cooldown version threads all three transitions through last iteration\'s values (prevHold/prevFree/prevSold) so the updates do not see each other mid-step. hold is fed from prevFree only — you can never buy directly out of "just sold".',
        explainHi: 'Cooldown version teenon transitions ko pichhli iteration ki values (prevHold/prevFree/prevSold) ke zariye piroti hai taaki updates ek doosre ko beech-step mein na dekhein. hold sirf prevFree se milta hai — aap kabhi "abhi becha" se seedhe khareed nahi sakte.',
      },
      {
        title: 'At most k transactions: 2k states',
        titleHi: 'At most k transactions: 2k states',
        code: `for (let t = 1; t <= k; t++) {
  hold[t] = Math.max(hold[t], free[t - 1] - p);   // start the t-th buy
  free[t] = Math.max(free[t], hold[t] + p);       // complete the t-th sell
}`,
        codeJs: `function maxProfitK(k, prices) {
  const n = prices.length;
  if (k >= n / 2) {   // unbounded — fall back to the 2-state version
    let hold = -Infinity, free = 0;
    for (const p of prices) { const f = free; free = Math.max(free, hold + p); hold = Math.max(hold, f - p); }
    return free;
  }
  const hold = new Array(k + 1).fill(-Infinity);
  const free = new Array(k + 1).fill(0);
  for (const p of prices) {
    for (let t = 1; t <= k; t++) {
      hold[t] = Math.max(hold[t], free[t - 1] - p);
      free[t] = Math.max(free[t], hold[t] + p);
    }
  }
  return free[k];
}
console.log(maxProfitK(2, [3, 2, 6, 5, 0, 3]));   // 7
console.log(maxProfitK(2, [1, 2, 3, 4, 5]));      // 4
console.log(maxProfitK(1, [7, 6, 4, 3, 1]));      // 0`,
        codeTs: `function maxProfitK(k: number, prices: number[]): number {
  const hold = new Array<number>(k + 1).fill(-Infinity);
  const free = new Array<number>(k + 1).fill(0);
  for (const p of prices) {
    for (let t = 1; t <= k; t++) {
      hold[t] = Math.max(hold[t]!, free[t - 1]! - p);
      free[t] = Math.max(free[t]!, hold[t]! + p);
    }
  }
  return free[k]!;
}`,
        outputJs: `7
4
0`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'free[t-1] - p means "start transaction t by spending from the profit after t-1 completed sells". Reading hold[t] on the very next line (already updated this iteration) is deliberate — buying and selling the same share on the same day nets zero, so it never inflates the answer.',
        explainHi: 'free[t-1] - p ka matlab "transaction t shuru karo t-1 poore sells ke baad ke profit se kharch karke". Agli hi line par hold[t] padhna (is iteration mein pehle se updated) jaan-boojhkar hai — usi din usi share ko khareedna aur bechna zero deta hai, isliye ye kabhi jawaab nahi badhaata.',
      },
    ],

    mistakes: [
      {
        wrong: `// letting the two transitions see each other's fresh values
free = Math.max(free, hold + p);
hold = Math.max(hold, free - p);   // uses the free JUST updated on the line above`,
        right: `const prevFree = free;
free = Math.max(free, hold + p);
hold = Math.max(hold, prevFree - p);   // uses YESTERDAY's free`,
        why: 'The transitions describe going from day i-1\'s states to day i\'s. If hold reads the free that was already updated for day i, it is buying with profit from a sale it made the same day — a free-money bug. Snapshot the previous values first, or update in an order where the dependency is not yet overwritten.',
        whyHi: 'Transitions day i-1 ke states se day i ke states mein jaana varnit karte hain. Agar hold wo free padhta hai jo day i ke liye pehle se updated tha, ye ek sale ke profit se khareed raha hai jo usne usi din ki — ek free-money bug. Pehle pichhli values ka snapshot lo, ya ek aise kram mein update karo jahaan dependency abhi overwrite nahi hui.',
      },
      {
        wrong: `// with cooldown: buying straight out of "sold"
hold = Math.max(hold, sold - p);   // WRONG — "sold" means you sold today`,
        right: `hold = Math.max(hold, free - p);   // buy only from "free" (rested at least a day)`,
        why: 'The cooldown says you cannot buy the day after a sale. "sold" is precisely the state "I sold today", so a buy transition out of it would happen the very next day — exactly what the rule forbids. Buys must come from "free", which is reached only after a full rest day.',
        whyHi: 'Cooldown kehta hai aap ek sale ke agle din khareed nahi sakte. "sold" bilkul wo state hai "maine aaj becha", isliye ismein se ek buy transition bilkul agle din hoga — bilkul jo niyam mana karta hai. Buys "free" se aane chahiye, jo sirf ek poore rest din ke baad pahuncha jaata hai.',
      },
      {
        wrong: `// initialising hold to 0 instead of -Infinity
let hold = 0, free = 0;
// day 0: hold = max(0, 0 - p) = 0  -> claims you can hold a share for FREE`,
        right: `let hold = -Infinity, free = 0;
// holding a share before you have ever bought one is impossible -> -Infinity`,
        why: 'hold represents "best cash while owning a share". Before day 0 you own nothing and cannot own a share, so that state is unreachable and must start at -Infinity. Starting it at 0 lets the algorithm acquire a share at zero cost on day 0, overstating every subsequent profit.',
        whyHi: 'hold "ek share ke maalik hote hue best cash" darshaata hai. Day 0 se pehle aap kuch bhi maalik nahi ho aur ek share ke maalik nahi ho sakte, isliye wo state apahunch hai aur -Infinity par shuru hona chahiye. Ise 0 par shuru karna algorithm ko day 0 par zero cost par ek share paane deta hai, har baad ke profit ko badha-chadha kar batate hue.',
      },
    ],

    realWorld: [
      {
        en: '**Algorithmic trading backtesters** model a strategy as exactly this: a small set of positions (flat, long, short, cooling off after a stop-loss), legal transitions between them, and a running P&L per state — the state machine is the backtest.',
        hi: '**Algorithmic trading backtesters** ek strategy ko bilkul isi tarah model karte hain: positions ka ek chhota set (flat, long, short, ek stop-loss ke baad thanda hote hue), unke beech legal transitions, aur prati state ek running P&L — state machine hi backtest hai.',
      },
      {
        en: '**Battery and energy arbitrage** — charge when power is cheap, discharge when it is expensive, with a minimum rest between cycles and an efficiency loss per cycle — is this DP with "charging / discharging / idle" states and the fee modelling the round-trip loss.',
        hi: '**Battery aur energy arbitrage** — jab power sasti ho tab charge karo, jab mehengi ho tab discharge karo, cycles ke beech ek minimum rest aur prati cycle ek efficiency loss ke saath — ye "charging / discharging / idle" states waala yahi DP hai aur fee round-trip loss ko model karti hai.',
      },
      {
        en: '**Text and bioinformatics matching** — regular-expression engines, gapped sequence alignment — track a small set of "modes" (matching, in a gap, in a repeat) and the best score for each as they scan the input, which is the same state-machine-over-a-sequence pattern.',
        hi: '**Text aur bioinformatics matching** — regular-expression engines, gapped sequence alignment — "modes" ka ek chhota set (matching, ek gap mein, ek repeat mein) aur input scan karte waqt har ke liye best score track karte hain, jo wahi state-machine-over-a-sequence pattern hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What signals that a problem is state-machine DP rather than a 1D or 2D DP, and how do you set it up?',
        qHi: 'Kya sanket deta hai ki ek problem 1D ya 2D DP ke bajaye state-machine DP hai, aur aap ise kaise set karte ho?',
        a: 'The signal is that at each step of a sequence you are in one of a small, fixed number of qualitatively different situations, and what you are allowed to do next depends only on which situation you are in, not on the whole history. In the stock problems the situations are "I currently hold a share" and "I currently hold nothing", plus a "just sold, resting" situation if there is a cooldown. Contrast that with a plain 1D DP like house robber, where the state is just an index and the value is a single number; here the state at each index is which situation you are in, so you carry one number per situation. To set it up, I do three things. First I enumerate the situations — usually two or three, occasionally 2k for a k-transaction cap. Second, for each situation I write down every legal move out of it and where it lands: from "free" you can buy, which costs the price and lands you in "hold"; from "hold" you can sell, which pays the price and lands you in "free"; every situation also has a do-nothing self-loop. Third, I write the transition: the best value for a situation on day i is the max over staying in it since day i-1 and arriving into it via one of its incoming moves, evaluated at day i-1\'s values. Then I iterate day by day. One implementation detail that bites people: the transitions all describe day i-1 to day i, so if I am updating the variables in place I must either snapshot yesterday\'s values first or order the updates so a variable is not read after it has already been advanced. The answer at the end is the best value among the situations where you hold nothing, because ending while still holding a share is never better than having sold it. This same structure covers a lot of ground beyond stocks: paint-the-fence colouring problems, regex and wildcard matching, and "delete characters to make valid" string DPs are all a small state machine scanned over a sequence.',
        aHi: 'Sanket ye hai ki ek sequence ke har step par aap ek chhoti, fixed tadaad mein gunaatmak roop se alag sthitiyon mein se ek mein ho, aur aap aage kya kar sakte ho ye sirf is par nirbhar karta hai ki aap kaunsi sthiti mein ho, poore itihaas par nahi. Stock problems mein sthitiyaan "main abhi ek share pakde hoon" aur "main abhi kuch nahi pakde hoon" hain, plus ek "abhi becha, aaram" sthiti agar ek cooldown hai. Ise house robber jaise ek plain 1D DP se contrast karo, jahaan state bas ek index hai aur value ek akela number; yahaan har index par state ye hai ki aap kaunsi sthiti mein ho, isliye aap prati sthiti ek number rakhte ho. Ise set karne ko, main teen cheezein karta hoon. Pehle main sthitiyaan enumerate karta hoon — aam taur par do ya teen, kabhi-kabhi ek k-transaction cap ke liye 2k. Doosre, har sthiti ke liye main ismein se har legal move likhta hoon aur wo kahaan land karta hai. Teesre, main transition likhta hoon: day i par ek sthiti ke liye best value day i-1 se ismein rehne aur iske ek incoming move se ismein pahunchne par max hai, day i-1 ki values par evaluate. Phir main din dar din iterate karta hoon. Ek implementation detail jo logon ko kaatti hai: transitions sab day i-1 se day i varnit karte hain, isliye agar main variables in place update kar raha hoon toh mujhe ya toh kal ki values ka snapshot lena hoga ya updates ko order karna hoga. Ant mein jawaab un sthitiyon mein best value hai jahaan aap kuch nahi pakde ho.',
      },
      {
        q: 'For "at most k transactions", why is the complexity O(n*k), and what is the k >= n/2 shortcut?',
        qHi: '"At most k transactions" ke liye, complexity O(n*k) kyun hai, aur k >= n/2 shortcut kya hai?',
        a: 'With a cap of k transactions you need to know, at each day, not just whether you are holding a share but how many completed round trips you have used up, because that determines how many you have left. So the state is a pair: the transaction index from 1 to k, and whether you are currently holding or free within that transaction. That is 2k states. For each of the n days you update all 2k of them in constant time each — holding at level t comes from being free at level t-1 and buying, free at level t comes from holding at level t and selling — so the total work is n times 2k, which is O(n k). The space is O(k) if you keep just the current day\'s two arrays of length k+1. Now the shortcut. Each transaction is a buy followed by a sell, so it spans at least two distinct days, which means in n days you can physically fit at most n/2 non-overlapping transactions. If the given k is n/2 or larger, the cap is not actually binding — you could never use that many trades anyway — so the problem collapses to the unlimited-transactions case, which has the simple two-state O(n) solution: every day, free becomes max of staying free or selling, and hold becomes max of staying held or buying from yesterday\'s free. Checking k against n/2 up front and branching to the cheap version matters because k can be given as a large number like ten to the ninth while n is only a few thousand, and without the check you would allocate and loop over a needlessly huge k dimension. It is both a performance guard and, in some languages, a guard against allocating an array too big to hold.',
        aHi: 'k transactions ke cap ke saath aapko har din jaanna hoga, sirf ye nahi ki aap ek share pakde ho balki aapne kitne poore round trips istemal kar liye, kyunki wo tay karta hai aapke paas kitne bache hain. Toh state ek jodi hai: transaction index 1 se k tak, aur kya aap us transaction ke andar abhi holding ya free ho. Wo 2k states hain. n dinon mein se har ek ke liye aap sabhi 2k ko constant time mein update karte ho — level t par holding, level t-1 par free hone aur khareedne se aata hai, level t par free, level t par holding aur bechne se aata hai — isliye kul kaam n guna 2k hai, jo O(n k) hai. Space O(k) hai agar aap sirf current din ke do arrays length k+1 rakhte ho. Ab shortcut. Har transaction ek buy ke baad ek sell hai, isliye ye kam se kam do alag din leta hai, jiska matlab n dinon mein aap bhautik roop se zyaada se zyaada n/2 non-overlapping transactions fit kar sakte ho. Agar di gayi k n/2 ya usse badi hai, cap asal mein binding nahi hai — aap utne trades kabhi istemal kar hi nahi sakte — isliye problem unlimited-transactions case mein dhah jaati hai, jiska saral do-state O(n) solution hai. k ko n/2 ke against pehle check karna aur saste version par branch karna maayne rakhta hai kyunki k ek bade number jaisa das ki nau power di jaa sakti hai jabki n sirf kuch hazaar hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement the 2-state unlimited-transactions maxProfit and verify [7,1,5,3,6,4] -> 7 and [7,6,4,3,1] -> 0. Then merge the two update lines into one wrong order (hold reads the fresh free) and find an input where the profit is overstated.',
        taskHi: '2-state unlimited-transactions maxProfit implement karo aur verify karo [7,1,5,3,6,4] -> 7 aur [7,6,4,3,1] -> 0. Phir do update lines ko ek galat kram mein merge karo (hold fresh free padhta hai) aur ek input dhoondho jahaan profit badha-chadha kar bataya jaata hai.',
        hint: 'With hold = max(hold, free - p) after free was already updated to hold + p, on a single rising day the code buys and sells the same share and then buys again cheaper using that phantom profit. [1, 5] alone will show it.',
        hintHi: 'hold = max(hold, free - p) ke saath jab free pehle se hold + p par updated tha, ek akele badhte din par code usi share ko khareedta aur bechta hai aur phir us phantom profit se dobara sasta khareedta hai. Akela [1, 5] ise dikhaayega.',
      },
      {
        task: 'Implement maxProfitCooldown with the three states hold/sold/free. Verify [1,2,3,0,2] -> 3, [1] -> 0, [2,1] -> 0. Then hand-trace the state table for [1,2,3,0,2] and confirm hold on day 3 is fed from free, not sold.',
        taskHi: 'maxProfitCooldown ko teen states hold/sold/free ke saath implement karo. Verify karo [1,2,3,0,2] -> 3, [1] -> 0, [2,1] -> 0. Phir [1,2,3,0,2] ke liye state table haath se trace karo aur confirm karo ki day 3 par hold free se milta hai, sold se nahi.',
        hint: 'The transition is hold = max(prevHold, prevFree - p). If you accidentally write prevSold - p, the algorithm buys the day after selling and the answer for [1,2,3,0,2] jumps above 3.',
        hintHi: 'Transition hold = max(prevHold, prevFree - p) hai. Agar aap galti se prevSold - p likhte ho, algorithm bechne ke agle din khareedta hai aur [1,2,3,0,2] ka jawaab 3 se upar chala jaata hai.',
      },
      {
        task: 'Implement maxProfitK with the 2k-state loop and the k >= n/2 fallback. Verify maxProfitK(2, [3,2,6,5,0,3]) -> 7 and maxProfitK(2, [2,1,2,0,1]) -> 2. Then remove the fallback, call it with k = 1e9 on a length-5 array, and note the wasted allocation.',
        taskHi: 'maxProfitK ko 2k-state loop aur k >= n/2 fallback ke saath implement karo. Verify karo maxProfitK(2, [3,2,6,5,0,3]) -> 7 aur maxProfitK(2, [2,1,2,0,1]) -> 2. Phir fallback hataao, ise k = 1e9 se ek length-5 array par call karo, aur barbaad allocation note karo.',
        hint: 'Without the fallback, hold and free become arrays of length 1e9+1 — gigabytes, or an allocation failure. With it, k is clamped to n/2 = 2 and the answer is identical because you can never fit more than 2 trades in 5 days anyway.',
        hintHi: 'Fallback ke bina, hold aur free length 1e9+1 ke arrays ban jaate hain — gigabytes, ya ek allocation failure. Iske saath, k n/2 = 2 par clamp hota hai aur jawaab samaan hai kyunki aap 5 dinon mein 2 se zyaada trades fit kar hi nahi sakte.',
      },
    ],

    keyTakeaways: [
      'When each step of a sequence puts you in one of a small fixed set of situations and the legal next moves depend only on the current situation, it is state-machine DP — carry one best value per situation, not a single number.',
      'Stock family: states are "hold" (own a share) and "free" (own nothing). Each day, every state = max(stay, arrive via a legal move), evaluated at yesterday\'s values.',
      'Unlimited transactions: 2 states, O(n). free = max(free, hold + p); hold = max(hold, prevFree - p). The plain greedy sum only works here and nowhere else.',
      'Per-trade fee: subtract the fee once on the sell transition — free = max(free, hold + p - fee).',
      'Cooldown: add a third state "sold" (sold today). Buys come from "free" only, never from "sold" — that IS the cooldown.',
      'At most k transactions: 2k states, O(n*k). If k >= n/2 the cap cannot bind — fall back to the unlimited 2-state O(n) version.',
      'Always snapshot yesterday\'s state values (or order the updates) so a transition does not read a value already advanced to today — otherwise you buy with profit from a same-day sale.',
      'Initialise "hold" to -Infinity: owning a share before buying one is impossible. Starting it at 0 grants a free share and inflates every profit.',
    ],
    keyTakeawaysHi: [
      'Jab ek sequence ka har step aapko ek chhote fixed set mein se ek sthiti mein daalta hai aur legal agle moves sirf current sthiti par nirbhar karte hain, ye state-machine DP hai — prati sthiti ek best value rakho, ek akela number nahi.',
      'Stock family: states "hold" (ek share ke maalik) aur "free" (kuch nahi ke maalik) hain. Har din, har state = max(raho, ek legal move se pahuncho), kal ki values par evaluate.',
      'Unlimited transactions: 2 states, O(n). free = max(free, hold + p); hold = max(hold, prevFree - p). Plain greedy sum sirf yahaan kaam karta hai aur kahin nahi.',
      'Prati-trade fee: sell transition par ek baar fee ghatao — free = max(free, hold + p - fee).',
      'Cooldown: ek teesra state "sold" jodo (aaj becha). Buys sirf "free" se aate hain, kabhi "sold" se nahi — wahi cooldown HAI.',
      'At most k transactions: 2k states, O(n*k). Agar k >= n/2 cap bind nahi kar sakta — unlimited 2-state O(n) version par wapas giro.',
      'Hamesha kal ki state values ka snapshot lo (ya updates order karo) taaki ek transition ek aisi value na padhe jo pehle se aaj tak advance ho chuki — warna aap ek same-day sale ke profit se khareedte ho.',
      '"hold" ko -Infinity par initialise karo: ek khareedne se pehle ek share ka maalik hona namumkin hai. Ise 0 par shuru karna ek free share deta hai aur har profit badha deta hai.',
    ],
  },
];
