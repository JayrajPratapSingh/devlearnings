/**
 * DSA Complete Course — Module 1: Foundations, lesson 4.
 *
 * Analyzing the complexity of loops and recursion directly from code,
 * rather than memorizing a lookup table of complexities. Broken example:
 * assuming every loop is automatically O(n), and every recursive function
 * is automatically "fine", without actually counting what each one does
 * relative to input size — leading to a genuinely common, hard-to-spot
 * bug where a loop's own body does work proportional to n, silently
 * turning an apparently O(n) loop into O(n^2), or a recursive function
 * whose own recursion tree branches multiple times per call quietly
 * becomes exponential. Fixed by tracing through loops and recursion
 * trees directly: counting how many times a loop body runs and how much
 * each run costs, and drawing out a recursive function's own call tree
 * to count total calls rather than assuming recursion is inherently
 * cheap or inherently expensive.
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

export const DSA_MODULE_1_PART4: CourseLesson[] = [
  {
    slug: 'analyzing-loops-and-recursion-complexity',
    title: 'Analyzing the Complexity of Loops and Recursion',
    titleHi: 'Loops Aur Recursion Ki Complexity Ka Vishleshan',
    description: 'A function with what looks like a single, ordinary "for" loop over an array is confidently labeled O(n) — until a closer look reveals that one line inside that loop itself creates a new array copy, silently making the real cost O(n squared), a mistake invisible to anyone who counts loops instead of counting actual work.',
    descriptionHi: 'Ek function jismein ek akela, saadhaaran "for" loop array par dikhta hai use bharose se O(n) label kiya jaata hai — jab tak ek gehri nazar ye nahi darsati ki us loop ke andar ek line khud ek naya array copy banaati hai, chupchaap asli keemat O(n squared) banaate hue, ek galti jo kisi ke liye adrishya hai jo loops ganta hai kaam ganne ke bajaye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Counting how long a factory shift takes by counting how many STATIONS a product passes through, versus actually timing how long the product spends AT each station.** Counting stations alone assumes every station takes the same, small, fixed amount of time — a product passing through five stations is assumed to take "five station-lengths" of time, and that assumption is fine as long as every station genuinely does a small, fixed amount of work. The assumption breaks the moment one specific station\'s own job is not "do one quick thing to this one product" but is instead "re-inspect every single product that has come through today before letting this one through" — that one station\'s own cost now depends on how many products have already passed through the entire factory, not on any fixed, small amount of time, and simply counting it as "one station" like all the others hides a genuinely large, hidden cost. Analyzing a loop\'s complexity by counting only how many times it iterates, without separately checking how much work each individual iteration\'s own body actually does, makes exactly this mistake: a loop that runs n times, where each iteration\'s own body does a fixed, small amount of work, really is O(n) — but a loop that runs n times, where each iteration\'s own body does something that itself costs O(n) (like copying an array, or scanning through another collection), actually costs O(n) multiplied by O(n), which is O(n²), hidden inside what looked, from a distance, like an ordinary single loop.',
      hi: '**Ye ganna ki ek factory shift kitni der leti hai kitne STATIONS se ek product guzarta hai ye ganke, versus asal mein time karke ki product har station PAR kitna samay bitaata hai.** Sirf stations ganna ye maanta hai ki har station samaan, chhota, fixed samay leta hai — paanch stations se guzarne wala ek product "paanch station-lambaaiyon" ka samay lene ke liye maana jaata hai, aur wo dhaarna theek hai jab tak har station sach mein kaam ka ek chhota, fixed tadaad karta hai. Dhaarna toot jaati hai jis pal ek khaas station ka apna kaam "is ek product ke saath ek tezi se kuch karo" nahi balki iske bajaye "aaj ab tak jo bhi har akela product aaya use dobara inspect karo isse aage jaane dene se pehle" hai — us ek station ki apni keemat ab is baat par nirbhar karti hai ki poori factory se ab tak kitne products guzar chuke hain, kisi fixed, chhote samay par nahi, aur ise sirf "ek station" ki tarah ganna baaki sab jaisa ek sach mein badi, chhupi keemat chhupaata hai. Ek loop ki complexity ka vishleshan sirf ye ganke karna ki ye kitni baar iterate karta hai, alag se check kiye bina ki har akeli iteration ka apna body asal mein kitna kaam karta hai, bilkul yahi galti karta hai: ek loop jo \`n\` baar chalta hai, jahan har iteration ka apna body ek fixed, chhota kaam karta hai, sach mein \`O(n)\` hai — par ek loop jo \`n\` baar chalta hai, jahan har iteration ka apna body kuch aisa karta hai jo khud \`O(n)\` keemat leta hai (jaisa ek array copy karna, ya ek doosre collection ke through scan karna), asal mein \`O(n)\` ko \`O(n)\` se guna kiya gaya leta hai, jo \`O(n²)\` hai, dur se ek saadhaaran akele loop jaisa dikhne waale ke andar chhupi hui.',
    },

    simple: `**Start broken.** A loop confidently labeled O(n) without checking what each iteration actually costs:

\`\`\`js
function removeDuplicates(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) { // looks like one cheap check...
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

At a glance, this is "a single for loop over \`arr\`", and a common, mistaken shortcut is to label any single loop over \`n\` items as automatically O(n). Looking closer at what happens INSIDE that loop reveals the actual cost: \`result.includes(arr[i])\` itself scans through every item currently in \`result\`, one at a time, to check whether \`arr[i]\` is already present — and \`result\` can grow to hold up to \`n\` items by the time the loop finishes. So the outer loop runs \`n\` times, and each of those \`n\` runs can itself do up to \`n\` work (checking \`.includes\` against a \`result\` array that has been growing), for a real total cost of \`n\` multiplied by \`n\`: \`O(n²)\`, not \`O(n)\`. Counting "one loop" without separately checking what each iteration\'s own body costs hides this multiplication entirely.

**The fix: check the cost of the loop body, not just the loop itself**

\`\`\`js
function removeDuplicates(arr) {
  const seen = new Set(); // Set.has() costs O(1), not O(current size)
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

\`\`\`ts
function removeDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

\`Set.has()\` (this course\'s next module explains exactly why) costs roughly the same small amount of work regardless of how many items the \`Set\` already holds — \`O(1)\`, not \`O(current size)\` the way \`Array.includes()\` is. The outer loop still runs \`n\` times, but now each iteration\'s own body costs a constant, fixed amount of work, so the real total cost is \`n\` multiplied by a constant: \`O(n)\`. The lesson this fix teaches generalizes far beyond this one function: the complexity of a loop is never determined by counting the loop alone — it is the loop\'s iteration count MULTIPLIED BY whatever each individual iteration\'s own body costs, and that second number must be checked explicitly, every time, rather than assumed.`,

    simpleHi: `**Toote hue se shuru.** Ek loop jo bharose se O(n) label kiya gaya bina check kiye ki har iteration asal mein kya keemat leta hai:

\`\`\`js
function removeDuplicates(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) { // ek sasta check jaisa dikhta hai...
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

Ek nazar mein, ye "\`arr\` par ek akela for loop" hai, aur ek aam, galat shortcut kisi bhi akele loop ko \`n\` items par automatically \`O(n)\` label karna hai. Us loop ke ANDAR kya hota hai isse gehraayi se dekhna asli keemat darsata hai: \`result.includes(arr[i])\` khud \`result\` mein abhi maujood har item ke through scan karta hai, ek-ek karke, ye check karne ke liye ki \`arr[i]\` pehle se maujood hai ya nahi — aur \`result\` loop khatam hone tak \`n\` items rakhne tak badh sakta hai. Toh outer loop \`n\` baar chalta hai, aur un \`n\` runs mein se har ek khud \`n\` tak kaam kar sakta hai (\`.includes\` check karte hue ek \`result\` array ke khilaaf jo badhta jaa raha hai), \`n\` ko \`n\` se guna kiye gaye ek asli total keemat ke liye: \`O(n²)\`, \`O(n)\` nahi. Har iteration ka apna body kya keemat leta hai alag se check kiye bina "ek loop" ganna is guna ko poori tarah chhupaata hai.

**Fix: loop body ki keemat check karo, sirf loop khud nahi**

\`\`\`js
function removeDuplicates(arr) {
  const seen = new Set(); // Set.has() O(1) leta hai, O(current size) nahi
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

\`\`\`ts
function removeDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}
\`\`\`

\`Set.has()\` (is course ka agla module bilkul samjhaata hai kyun) lagbhag samaan chhota kaam leta hai chahe \`Set\` pehle se kitne items rakhta ho — \`O(1)\`, \`O(current size)\` nahi jaisa \`Array.includes()\` leta hai. Outer loop abhi bhi \`n\` baar chalta hai, par ab har iteration ka apna body ek constant, fixed kaam leta hai, isliye asli total keemat \`n\` ko ek constant se guna kiya gaya hai: \`O(n)\`. Ye fix jo lesson sikhaata hai wo is ek function se kaafi aage generalize hota hai: ek loop ki complexity kabhi akela loop ganke tay nahi hoti — ye loop ki iteration count hai jo GUNA hai jo bhi har akeli iteration ka apna body keemat leta hai, aur wo doosra number explicitly check kiya jaana chahiye, har baar, maana nahi jaana chahiye.`,

    content: `## Sequential steps ADD, nested steps MULTIPLY

\`\`\`js
function example(arr) {
  for (let i = 0; i < arr.length; i++) { /* O(n) work */ }  // step 1
  for (let i = 0; i < arr.length; i++) { /* O(n) work */ }  // step 2
  // step 1 and step 2 run ONE AFTER ANOTHER: O(n) + O(n) = O(2n) = O(n)
}

function example2(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) { /* O(1) work */ } // nested INSIDE
  }
  // the inner loop runs n times for EACH of the outer loop's n runs:
  // O(n) * O(n) = O(n²)
}
\`\`\`

Two loops that run one after the other, each independently costing \`O(n)\`, add together: \`O(n) + O(n)\`, which simplifies to \`O(n)\` once the constant factor of \`2\` is dropped (this course\'s previous lesson already covered why). Two loops where one is nested INSIDE the other multiply: the inner loop\'s own cost is paid in full for every single iteration of the outer loop, not once total, giving \`O(n) * O(n) = O(n²)\`. This single distinction — sequential costs add, nested costs multiply — is the actual mechanical rule underlying every "count the loops" heuristic, and it is precisely why a loop containing a call to something like \`.includes()\`, \`.indexOf()\`, or another full scan is nested cost in disguise, even though it does not visually look like a second \`for\` loop.

## Recursion: complexity comes from the shape of the call tree, not the code\'s length

\`\`\`
factorial(4) calls factorial(3) calls factorial(2) calls factorial(1) calls factorial(0)
— a single CHAIN of calls, one after another: 5 total calls → O(n)

fib(4) calls fib(3) AND fib(2)
  fib(3) calls fib(2) AND fib(1)
  fib(2) calls fib(1) AND fib(0)
— each call BRANCHES into two more calls: the tree DOUBLES in size at
  each level → O(2ⁿ) total calls
\`\`\`

A recursive function\'s complexity is not determined by how many lines of code it has, or even by how many times it calls itself directly in its own source — it is determined by the actual SHAPE of the full tree of calls that occur when it runs, which is only visible by tracing through, or explicitly drawing, that call tree. A recursive function like computing a factorial, where each call makes exactly one further recursive call, produces a call tree that is a single, straight chain — the total number of calls grows in direct, linear proportion to the input, \`O(n)\`. A recursive function like a naive, unoptimized Fibonacci calculation, where each call makes TWO further recursive calls (one for each smaller sub-problem), produces a call tree that branches at every single level — the total number of calls in that tree grows exponentially, \`O(2ⁿ)\`, despite the function\'s own source code being barely longer than the linear-chain factorial example. This course\'s recursion module covers exactly how to recognize and fix this specific exponential blowup (via memoization, bridging directly into dynamic programming), but recognizing that it exists at all requires tracing the actual call tree rather than judging complexity from how the function reads on the page.

## A practical checklist for analyzing any loop or recursive function

\`\`\`
For a loop:
  1. How many times does the loop itself iterate, as a function of n?
  2. What does EACH iteration's own body actually cost — is there a
     hidden scan, copy, or another loop inside it?
  3. Multiply (1) and (2) together.

For recursion:
  1. How many recursive calls does EACH call make (one, two, more)?
  2. How much does the input shrink by, per call (by one, by half)?
  3. Draw or trace the resulting call tree's actual shape — a chain,
     or a branching tree — to see the true total call count.
\`\`\`

This checklist is the concrete, repeatable version of "identify the pattern" from this module\'s earlier problem-solving-framework lesson, applied specifically to reading someone else\'s (or one\'s own) existing code and determining its actual complexity, rather than assuming a visual shape (one loop, one recursive call) automatically implies a specific, safe complexity class.`,

    contentHi: `## Sequential steps JOD hote hain, nested steps GUNA hote hain

\`\`\`js
function example(arr) {
  for (let i = 0; i < arr.length; i++) { /* O(n) kaam */ }  // step 1
  for (let i = 0; i < arr.length; i++) { /* O(n) kaam */ }  // step 2
  // step 1 aur step 2 EK KE BAAD EK chalte hain: O(n) + O(n) = O(2n) = O(n)
}

function example2(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) { /* O(1) kaam */ } // ANDAR nested
  }
  // inner loop outer loop ke n runs mein se HAR EK ke liye n baar chalta hai:
  // O(n) * O(n) = O(n²)
}
\`\`\`

Do loops jo ek ke baad ek chalte hain, har ek azaadi se \`O(n)\` keemat leta hai, saath jodte hain: \`O(n) + O(n)\`, jo \`O(n)\` mein simplify ho jaata hai ek baar \`2\` ka constant factor hataaya jaaye (is course ka pehle wala lesson pehle hi darsa chuka hai kyun). Do loops jahan ek doosre ke ANDAR nested hai guna hote hain: inner loop ki apni keemat outer loop ki har akeli iteration ke liye poori chukaayi jaati hai, ek baar total nahi, \`O(n) * O(n) = O(n²)\` dete hue. Ye akela farak — sequential keemat jodti hai, nested keemat guna hoti hai — asli mechanical rule hai jo har "loops gino" heuristic ke peeche hai, aur ye bilkul isliye hai ki ek loop jismein \`.includes()\`, \`.indexOf()\`, ya doosri poori scan ki call maujood hai chhupi hui nested keemat hai, chahe ye visually ek doosre \`for\` loop jaisa na dikhe.

## Recursion: complexity call tree ki shape se aati hai, code ki lambaayi se nahi

\`\`\`
factorial(4) factorial(3) ko bulaata hai factorial(2) ko bulaata hai factorial(1) ko bulaata hai factorial(0) ko bulaata hai
— calls ki ek akeli CHAIN, ek ke baad ek: 5 total calls → O(n)

fib(4) fib(3) AUR fib(2) ko bulaata hai
  fib(3) fib(2) AUR fib(1) ko bulaata hai
  fib(2) fib(1) AUR fib(0) ko bulaata hai
— har call do aur calls mein BRANCH hota hai: tree har level par
  DOUBLE hota hai → O(2ⁿ) total calls
\`\`\`

Ek recursive function ki complexity iske code ki kitni lines hain ise dekhkar tay nahi hoti, ya iske apne source mein ye khud ko kitni baar bulaata hai ise dekhkar bhi nahi — ye us calls ke poore tree ki asli SHAPE se tay hoti hai jo tab hoti hain jab ye chalta hai, jo sirf trace karke, ya explicitly banaake, dikhti hai. Ek recursive function jaisa ek factorial ganna, jahan har call bilkul ek aur recursive call karta hai, ek call tree banaata hai jo ek akeli, seedhi chain hai — total calls ki tadaad input ke seedhe, linear anupaat mein badhti hai, \`O(n)\`. Ek recursive function jaisa ek naive, na-optimized Fibonacci ganna, jahan har call DO aur recursive calls karta hai (har chhote sub-problem ke liye ek), ek call tree banaata hai jo har akele level par branch hota hai — us tree mein total calls ki tadaad exponentially badhti hai, \`O(2ⁿ)\`, is baat ke bawajood ki function ka apna source code linear-chain factorial example se mushkil se lamba hai. Is course ka recursion module bilkul batata hai is khaas exponential blowup ko kaise pehchaanna aur theek karna hai (memoization ke zariye, seedhe dynamic programming mein jodte hue), par ye pehchaanna ki ye bilkul maujood hai asli call tree ko trace karna maangta hai, function page par kaisa padhta hai us se complexity judge karne ke bajaye.

## Kisi bhi loop ya recursive function ka vishleshan karne ke liye ek vyaavahaarik checklist

\`\`\`
Ek loop ke liye:
  1. Loop khud kitni baar iterate karta hai, n ke function ki tarah?
  2. HAR iteration ka apna body asal mein kya keemat leta hai — kya
     iske andar koi chhupi hui scan, copy, ya doosra loop hai?
  3. (1) aur (2) ko saath guna karo.

Recursion ke liye:
  1. HAR call kitni recursive calls karta hai (ek, do, zyaada)?
  2. Input prati call kitna simatta hai (ek se, aadhe se)?
  3. Nateeje wale call tree ki asli shape banaao ya trace karo — ek
     chain, ya ek branching tree — asli total call count dekhne ke liye.
\`\`\`

Ye checklist is module ke pehle wale problem-solving-framework lesson ke "identify the pattern" ka thos, dohraaye-jaane-yogya version hai, khaas taur par kisi aur ke (ya khud ke) maujood code ko padhne aur uski asli complexity tay karne ke liye lagu kiya gaya, ek visual shape (ek loop, ek recursive call) automatically ek khaas, surakshit complexity class darsata hai ye maanne ke bajaye.`,

    examples: [
      {
        title: 'Broken: a hidden scan inside a loop, mistaken for O(n)',
        titleHi: 'Toota: ek loop ke andar ek chhupi hui scan, O(n) samjhi gayi',
        code: `for (let i = 0; i < arr.length; i++) {
  if (!result.includes(arr[i])) result.push(arr[i]);
  // .includes() itself scans result — a hidden loop
}`,
        codeJs: `function removeDuplicates(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}
// "one loop" visually, but .includes() is its own O(n) scan`,
        codeTs: `function removeDuplicates(arr: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}
// fully valid TypeScript — the hidden cost is not a type error`,
        output: `Genuinely O(n²): the outer loop runs n times, and each iteration's
own .includes() call can itself scan up to n items.`,
        explain: 'The loop\'s own iteration count is O(n), but each iteration\'s body costs up to O(n) as well, and O(n) multiplied by O(n) is O(n²), not O(n).',
        explainHi: 'Loop ki apni iteration count \`O(n)\` hai, par har iteration ka body bhi \`O(n)\` tak keemat le sakta hai, aur \`O(n)\` guna \`O(n)\` \`O(n²)\` hai, \`O(n)\` nahi.',
      },
      {
        title: 'Fixed: replacing the hidden O(n) scan with an O(1) lookup',
        titleHi: 'Theek: chhupi hui O(n) scan ko ek O(1) lookup se badalna',
        code: `const seen = new Set();
for (let i = 0; i < arr.length; i++) {
  if (!seen.has(arr[i])) { seen.add(arr[i]); result.push(arr[i]); }
}`,
        codeJs: `function removeDuplicates(arr) {
  const seen = new Set();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}`,
        codeTs: `function removeDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}`,
        outputJs: `Genuinely O(n): the outer loop runs n times, and each iteration's
Set.has()/add() calls cost a constant amount of work regardless of
how many items the Set already holds.`,
        outputTs: `// Identical behaviour. Set<number> gives .has() and .add()
// correctly typed signatures.`,
        explain: 'Replacing the O(n) .includes() scan with an O(1) Set lookup removes the hidden nested cost, leaving a genuine O(n) loop with a genuinely constant-cost body.',
        explainHi: '\`O(n)\` \`.includes()\` scan ko ek \`O(1)\` \`Set\` lookup se badalna chhupi hui nested keemat hataata hai, ek asli \`O(n)\` loop ek sach mein constant-cost body ke saath chhodte hue.',
      },
      {
        title: 'Tracing a recursive call tree by hand: chain vs branching',
        titleHi: 'Ek recursive call tree ko haath se trace karna: chain vs branching',
        code: `function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); } // chain: O(n)
function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }      // branches: O(2^n)`,
        codeJs: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // ONE recursive call per invocation
}

function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // TWO recursive calls per invocation
}`,
        codeTs: `function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
        outputJs: `factorial(5) makes exactly 5 total calls — a straight chain, O(n).
fib(5) makes 15 total calls despite n only being 5, because each
call branches into two more — the tree's size roughly doubles per
level, O(2^n).`,
        outputTs: `// Identical behaviour and identical call counts — Big-O describes
// the algorithm's structure, unaffected by adding type annotations.`,
        explain: 'Counting recursive calls made per invocation, then tracing the resulting tree\'s shape, reveals a complexity difference that reading the two functions\' similar-looking source code alone would not.',
        explainHi: 'Prati-invocation ki gayi recursive calls ganna, phir nateeje wale tree ki shape ko trace karna, ek complexity farak darsata hai jise do functions ke milte-julte-dikhne-waale source code ko akela padhna nahi darsaata.',
      },
    ],

    mistakes: [
      {
        wrong: `// labeling any single "for" loop as automatically O(n)
// without checking what its own body actually costs`,
        right: `// checking whether the loop body itself performs a hidden scan,
// copy, or another loop before concluding the complexity`,
        why: 'A loop\'s complexity is its iteration count multiplied by each iteration\'s own cost — a loop body containing a method like .includes() or .indexOf() hides a second, nested O(n) scan.',
        whyHi: 'Ek loop ki complexity uski iteration count guna har iteration ki apni keemat hai — ek loop body jismein \`.includes()\` ya \`.indexOf()\` jaisa method hai ek doosri, nested \`O(n)\` scan chhupaata hai.',
      },
      {
        wrong: `// judging a recursive function's complexity by how many lines
// of code it has, or how "simple" it looks`,
        right: `// tracing or drawing the actual call tree: how many calls does
// each invocation make, and how does the tree's total size grow?`,
        why: 'Two recursive functions with nearly identical, equally short source code can have wildly different complexities (O(n) versus O(2ⁿ)) purely based on how many further calls each one makes.',
        whyHi: 'Do recursive functions lagbhag identical, barabar chhote source code ke saath bahut alag complexities rakh sakte hain (\`O(n)\` versus \`O(2ⁿ)\`) sirf is aadhaar par ki har ek kitni aur calls karta hai.',
      },
      {
        wrong: `for (let i = 0; i < n; i++) { /* O(n) */ }
for (let j = 0; j < n; j++) { /* O(n) */ }
// treated as O(n²) because "there are two loops"`,
        right: `// correctly recognized as O(n) + O(n) = O(n), since the two loops
// run one AFTER the other, not one nested inside the other`,
        why: 'Sequential loops (one after another) ADD their costs together; only loops nested inside one another MULTIPLY — mistaking sequential for nested overstates the true complexity.',
        whyHi: 'Sequential loops (ek ke baad ek) apni keemat JODTE hain; sirf ek doosre ke andar nested loops GUNA hote hain — sequential ko nested samajhna asli complexity ko badha-chadha kar bataata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Reading someone else\'s existing code and correctly identifying a hidden O(n²) or worse buried inside an apparently simple loop is a genuinely common, real code-review and performance-debugging task.**',
        hi: '**Kisi aur ke maujood code ko padhna aur ek apparently saadhe loop ke andar dabi hui \`O(n²)\` ya usse kharaab ko sahi tarike se pehchaanna ek sach mein aam, asli code-review aur performance-debugging kaam hai.**',
      },
      {
        en: '**"What is the time complexity of this loop?" followed by intentionally hiding a nested operation inside it is a genuinely common technical-interview trap** specifically designed to test whether a candidate checks loop bodies or just counts loops.',
        hi: '**"Is loop ki time complexity kya hai?" jiske baad jaan-boojhkar ek nested operation ise andar chhupaana ek sach mein aam technical-interview trap hai** khaas taur par ye test karne ke liye design kiya gaya ki kya ek candidate loop bodies check karta hai ya bas loops ganta hai.',
      },
      {
        en: '**The exponential blowup in a naive recursive Fibonacci implementation is one of the most commonly used teaching examples across real computer science education**, precisely because it demonstrates that recursion is not automatically cheap.',
        hi: '**Ek naive recursive Fibonacci implementation mein exponential blowup asli computer science education mein sabse aam istemal hone waale teaching examples mein se ek hai**, bilkul isliye kyunki ye darsata hai ki recursion automatically sasta nahi hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is it a mistake to assume any single loop over n items is automatically O(n), and what specifically should be checked before concluding that?',
        qHi: 'Ye maan lena ki n items par koi bhi akela loop automatically O(n) hai galti kyun hai, aur ye nateeja nikaalne se pehle khaas taur par kya check kiya jaana chahiye?',
        a: 'A loop\'s true total cost is determined by multiplying two separate numbers together: how many times the loop itself iterates, and how much work each individual iteration\'s own body actually performs. A loop that iterates n times, where each iteration does a small, fixed amount of work — a single comparison, a single arithmetic operation, a single array index access — genuinely does cost O(n) total, since n multiplied by a constant is still O(n). The mistake of assuming any single loop is automatically O(n) arises specifically when this second factor, the cost of the loop body itself, is not actually checked, and is instead silently assumed to also be a small, fixed constant without verifying it. A loop body that calls a method like Array.prototype.includes or Array.prototype.indexOf, or that performs any other scan, search, or copy over a collection whose size is also tied to n, is itself an operation costing O(n), not O(1) — and when an O(n) operation happens inside a loop that itself runs O(n) times, the true total cost is O(n) multiplied by O(n), which is O(n²), a fundamentally different and far more expensive complexity class than a genuine O(n) loop, despite both looking, on the surface, like "just one for loop." The concrete check that avoids this mistake is examining every single operation performed inside a loop\'s body and asking, for each one, whether its own cost depends on the size of some collection that itself grows alongside n — if it does, that operation contributes its own complexity to the total, multiplied by the outer loop\'s iteration count, rather than being safely ignored as a constant.',
        aHi: 'Ek loop ki asli total keemat do alag numbers ko saath guna karke tay hoti hai: loop khud kitni baar iterate karta hai, aur har akeli iteration ka apna body asal mein kitna kaam perform karta hai. Ek loop jo \`n\` baar iterate karta hai, jahan har iteration ek chhota, fixed kaam karta hai — ek akela comparison, ek akela arithmetic operation, ek akela array index access — sach mein total \`O(n)\` keemat leta hai, kyunki \`n\` ko ek constant se guna karna abhi bhi \`O(n)\` hai. Kisi bhi akele loop ko automatically \`O(n)\` maanne ki galti khaas taur par tab hoti hai jab ye doosra factor, loop body ki apni keemat, asal mein check nahi kiya jaata, aur iske bajaye chupchaap ek chhota, fixed constant bhi maan liya jaata hai use verify kiye bina. Ek loop body jo \`Array.prototype.includes\` ya \`Array.prototype.indexOf\` jaisa ek method bulaata hai, ya jo kisi collection par koi doosri scan, search, ya copy perform karta hai jiska size bhi \`n\` se juda hai, khud ek \`O(n)\` keemat waala operation hai, \`O(1)\` nahi — aur jab ek \`O(n)\` operation ek loop ke andar hota hai jo khud \`O(n)\` baar chalta hai, asli total keemat \`O(n)\` guna \`O(n)\` hai, jo \`O(n²)\` hai, ek buniyaadi roop se alag aur kaafi zyaada mehenga complexity class ek asli \`O(n)\` loop se, is baat ke bawajood ki dono satah par "bas ek for loop" jaise dikhte hain. Thos check jo is galti se bachaata hai wo ek loop ke body ke andar perform kiya gaya har akela operation examine karna hai aur har ek ke liye poochna hai ki kya iski apni keemat kisi aise collection ke size par nirbhar karti hai jo khud \`n\` ke saath badhta hai — agar aisa hai, wo operation apni khud ki complexity total mein jodta hai, outer loop ki iteration count se guna kiya gaya, ek constant ki tarah surakshit roop se ignore hone ke bajaye.',
      },
      {
        q: 'Why can two recursive functions with almost identical source code have wildly different complexities, and what is the correct method for determining a recursive function\'s actual complexity?',
        qHi: 'Do recursive functions lagbhag identical source code ke saath bahut alag complexities kyun rakh sakte hain, aur ek recursive function ki asli complexity tay karne ka sahi tarika kya hai?',
        a: 'A recursive function\'s complexity is not a property of how the function is written or how many lines its source code occupies — it is a property of the actual shape of the full tree of calls that occur when the function runs, which depends specifically on how many further recursive calls each individual invocation makes. A recursive function where each call makes exactly one further recursive call, such as a straightforward factorial calculation, produces a call tree that is simply a single, straight chain — one call leads to the next, which leads to the next, and so on, meaning the total number of calls made overall grows in direct, linear proportion to the input, an O(n) complexity. A recursive function where each call instead makes TWO further recursive calls, such as a naive, unoptimized calculation of a Fibonacci number, produces a call tree that branches at every single level — each call spawns two more, each of which spawns two more again, causing the total number of calls in the tree to roughly double with each additional level of depth, which is an O(2ⁿ) complexity, a fundamentally different and dramatically more expensive growth pattern. These two functions can have source code that is nearly identical in length, structure, and apparent simplicity — differing essentially only in whether the recursive case makes one call or two — yet their actual complexities differ by an enormous margin specifically because of this difference in how the call tree branches, a difference that is invisible from a superficial reading of the code and only becomes visible by explicitly tracing through, or deliberately drawing out, what the actual sequence and branching of calls looks like when the function is run. The correct, reliable method for determining a recursive function\'s complexity is therefore never to judge it from the code\'s appearance alone, but to explicitly identify how many recursive calls each invocation makes and how the input shrinks with each call, then use that information to determine the actual shape, and therefore the actual total size, of the resulting call tree.',
        aHi: 'Ek recursive function ki complexity ye property nahi hai ki function kaise likha gaya hai ya iska source code kitni lines rakhta hai — ye us poore call tree ki asli shape ki property hai jo tab hoti hai jab function chalta hai, jo khaas taur par is baat par nirbhar karta hai ki har akela invocation kitni aur recursive calls karta hai. Ek recursive function jahan har call bilkul ek aur recursive call karta hai, jaisa ek seedha factorial calculation, ek call tree banaata hai jo bas ek akeli, seedhi chain hai — ek call agli tak le jaata hai, jo agli tak le jaata hai, waghaira, matlab overall ki gayi calls ki total tadaad input ke seedhe, linear anupaat mein badhti hai, ek \`O(n)\` complexity. Ek recursive function jahan har call iske bajaye DO aur recursive calls karta hai, jaisa ek Fibonacci number ka ek naive, na-optimized calculation, ek call tree banaata hai jo har akele level par branch hota hai — har call do aur ko janm deta hai, jinmein se har ek dobara do aur ko janm deta hai, depth ke har atirikt level ke saath tree mein total calls ki tadaad ko lagbhag double karte hue, jo ek \`O(2ⁿ)\` complexity hai, ek buniyaadi roop se alag aur naatakiya roop se zyaada mehenga growth pattern. In do functions ka source code lambaayi, structure, aur apparent saadgi mein lagbhag identical ho sakta hai — buniyaadi roop se sirf ismein alag ki kya recursive case ek call karta hai ya do — phir bhi unki asli complexities ek vishaal antar se alag hoti hain khaas taur par is farak ki wajah se ki call tree kaise branch karta hai, ek farak jo code ki upari padhaai se adrishya hai aur sirf tab drishyaman hota hai jab explicitly trace kiya jaaye, ya jaan-boojhkar banaaya jaaye, ki calls ka asli sequence aur branching kaisa dikhta hai jab function chalta hai. Ek recursive function ki complexity tay karne ka sahi, bharosemand tarika isliye kabhi ise code ki dikhaawat se hi judge karna nahi hai, balki explicitly pehchaanna hai ki har invocation kitni recursive calls karta hai aur input har call ke saath kaise simatta hai, phir us jaankaari ka istemal karke asli shape, aur isliye nateeje wale call tree ka asli size, tay karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Take the broken removeDuplicates function from this lesson and, using a browser or Node console, log result.length at the end of each outer-loop iteration for an array with duplicates. Confirm .includes() genuinely scans a growing result array each time.',
        taskHi: 'Is lesson ke toote \`removeDuplicates\` function ko lo aur, ek browser ya Node console istemal karte hue, har outer-loop iteration ke ant mein \`result.length\` log karo ek duplicates waale array ke liye. Confirm karo ki \`.includes()\` sach mein har baar ek badhta hua \`result\` array scan karta hai.',
        hint: 'Add a console.log inside the loop right before the .includes() check, printing both i and result.length, to see the array .includes() must scan grow over time.',
        hintHi: '\`.includes()\` check se bilkul pehle loop ke andar ek \`console.log\` jodo, \`i\` aur \`result.length\` dono print karte hue, ye dekhne ke liye ki \`.includes()\` ko jo array scan karna hai wo waqt ke saath badhta hai.',
      },
      {
        task: 'Write two functions that each contain two for loops over the same array: one where the loops run one after another (sequential), and one where the second loop is nested inside the first. Determine each function\'s Big-O by hand before running either.',
        taskHi: 'Do functions likho jinmein se har ek mein usi array par do for loops hain: ek jahan loops ek ke baad ek chalte hain (sequential), aur ek jahan doosra loop pehle ke andar nested hai. Dono mein se koi bhi chalaane se pehle haath se har function ka Big-O tay karo.',
        hint: 'Add a counter variable that increments once per innermost loop body execution, then log its final value to confirm your hand-calculated Big-O against the actual operation count.',
        hintHi: 'Ek counter variable jodo jo prati innermost loop body execution ek baar increment hota hai, phir apne haath-se-ganay-gaye Big-O ko asli operation count ke khilaaf confirm karne ke liye iski aakhri value log karo.',
      },
      {
        task: 'Draw out, on paper, the full call tree for fib(4) from this lesson\'s example, labeling every single call made. Count the total number of calls and compare it to what O(2ⁿ) would predict for n = 4.',
        taskHi: 'Kaagaz par, is lesson ke example se \`fib(4)\` ke liye poora call tree banaao, har akeli ki gayi call ko label karte hue. Total calls ki tadaad gino aur ise us se compare karo jo \`O(2ⁿ)\` \`n = 4\` ke liye predict karega.',
        hint: 'Start with fib(4) at the top, draw two branches down to fib(3) and fib(2), and keep branching each node until you reach fib(0) or fib(1), which do not branch further.',
        hintHi: 'Top par \`fib(4)\` se shuru karo, \`fib(3)\` aur \`fib(2)\` tak neeche do branches banaao, aur har node ko branch karte raho jab tak tum \`fib(0)\` ya \`fib(1)\` tak na pahuncho, jo aage branch nahi hote.',
      },
    ],

    keyTakeaways: [
      'A loop\'s true complexity is its iteration count multiplied by each iteration\'s own cost — never assume a loop body costs a constant amount of work without checking for a hidden scan, copy, or method like .includes().',
      'Sequential loops (one after another) add their costs together; loops nested inside one another multiply theirs — mistaking one for the other significantly misstates the true complexity.',
      'A recursive function\'s complexity is determined by the shape of its actual call tree, not by how short or simple its source code looks — count how many further calls each invocation makes.',
      'A recursive function making one further call per invocation produces a chain-shaped call tree (O(n)); one making two further calls per invocation produces a branching tree that grows exponentially (O(2ⁿ)).',
      'The practical checklist for analyzing any loop is: count its iterations as a function of n, separately check what each iteration\'s own body costs, then multiply the two together.',
      'The practical checklist for analyzing any recursive function is: count calls made per invocation, note how the input shrinks per call, then trace or draw the resulting call tree\'s actual shape.',
    ],
    keyTakeawaysHi: [
      'Ek loop ki asli complexity uski iteration count guna har iteration ki apni keemat hai — kabhi ye na maano ki ek loop body ek constant kaam leta hai bina ek chhupi hui scan, copy, ya \`.includes()\` jaise method ke liye check kiye.',
      'Sequential loops (ek ke baad ek) apni keemat saath jodte hain; ek doosre ke andar nested loops apni guna karte hain — ek ko doosre se galat samajhna asli complexity ko maayne-yogya roop se galat batata hai.',
      'Ek recursive function ki complexity iske asli call tree ki shape se tay hoti hai, iska source code kitna chhota ya saadha dikhta hai us se nahi — gino ki har invocation kitni aur calls karta hai.',
      'Ek recursive function jo prati invocation ek aur call karta hai ek chain-shaped call tree banaata hai (\`O(n)\`); ek jo prati invocation do aur calls karta hai ek branching tree banaata hai jo exponentially badhta hai (\`O(2ⁿ)\`).',
      'Kisi bhi loop ka vishleshan karne ke liye vyaavahaarik checklist hai: iski iterations ko \`n\` ke function ki tarah gino, alag se check karo ki har iteration ka apna body kya keemat leta hai, phir dono ko saath guna karo.',
      'Kisi bhi recursive function ka vishleshan karne ke liye vyaavahaarik checklist hai: prati invocation ki gayi calls gino, note karo ki input prati call kaise simatta hai, phir nateeje wale call tree ki asli shape trace ya banaao.',
    ],
  },
];
