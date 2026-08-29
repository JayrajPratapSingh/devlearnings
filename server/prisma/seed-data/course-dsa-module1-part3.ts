/**
 * DSA Complete Course — Module 1: Foundations, lesson 3.
 *
 * Big-O notation: a precise, standard vocabulary for the "how does this
 * scale?" question this module's first lesson raised informally.
 * Broken example: comparing two solutions purely by timing them once on
 * one specific input size, a method that produces a genuinely misleading
 * verdict depending on which size happens to be chosen, and gives no way
 * to predict behavior at a size that was never actually tested. Fixed
 * with Big-O as a description of GROWTH RATE — how the amount of work
 * scales as input size increases — independent of any specific machine,
 * language, or input size, using a deliberately simple, visual approach
 * (counting operations directly, then comparing growth curves) so the
 * notation is understood as measuring something real and countable, not
 * memorized as abstract symbols.
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

export const DSA_MODULE_1_PART3: CourseLesson[] = [
  {
    slug: 'big-o-notation',
    title: 'Big-O Notation: Measuring How Work Grows',
    titleHi: 'Big-O Notation: Kaam Kaise Badhta Hai Ise Naapna',
    description: 'Two solutions are each timed once on a 100-item test file: Solution A takes 2ms, Solution B takes 5ms. Solution A is declared the winner and shipped — until the real input reaches 100,000 items, where Solution A now takes 40 seconds and Solution B takes 8 milliseconds.',
    descriptionHi: 'Do solutions ko ek 100-item test file par ek-ek baar time kiya jaata hai: Solution A 2ms leta hai, Solution B 5ms leta hai. Solution A ko winner ghoshit kiya jaata hai aur ship kiya jaata hai — jab tak asli input 100,000 items tak nahi pahuncha, jahan Solution A ab 40 seconds leta hai aur Solution B 8 milliseconds leta hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Two moving companies quoted for a job by asking each to move a single small box across a room, then judging which company is "faster" purely from that one result — versus asking each company how its own total time changes as the number of boxes grows from one to a hundred to ten thousand.** Judging purely from the single-box test, the company that happens to have a slightly quicker worker for one box looks like the clear winner, and nothing about that one data point reveals anything about what happens at real, actual moving-job scale. The company whose method is "carry one box at a time, walking back for each one" and the company whose method is "load a truck once, then unload the whole truck at the destination" might genuinely tie, or even have the first company win, on a test of exactly one box, since setting up the truck has its own fixed cost that a single box does not benefit from — but as the number of boxes grows into the hundreds or thousands, the one-at-a-time company\'s total time keeps growing in direct proportion to the number of boxes, while the truck company\'s time barely grows at all beyond that one fixed setup cost. Timing two algorithms once, on one specific input size, and declaring a winner is the single-box test: it produces a real number, but that number reveals nothing reliable about which approach will actually perform better once the input size is genuinely large, which is precisely the situation real production data eventually creates. Big-O notation is the second question — not "how long did this one specific run take", but "as the number of boxes keeps growing, does this company\'s total time grow at the same rate, a slower rate, or barely at all" — a description of a GROWTH RATE, not a single measurement.',
      hi: '**Do moving companies ek job ke liye quote ki jaati hain har ek se ek chhota box kamre ke aar-paar move karwaake poochkar, phir sirf us ek nateeje se faisla karke ki kaunsi company "tez" hai — versus har company se poochna ki uska apna total time boxes ki tadaad ek se sau se das hazaar tak badhne par kaise badalta hai.** Sirf akele-box test se faisla karte hue, jis company ke paas ek box ke liye thoda tez worker hai wo saaf winner lagti hai, aur us ek data point ke baare mein kuch bhi ye nahi darsata ki asli, waastavik moving-job scale par kya hota hai. Wo company jiska tarika hai "ek waqt mein ek box le jaao, har ek ke liye wapas chalte hue" aur wo company jiska tarika hai "truck ko ek baar load karo, phir destination par poora truck unload karo" bilkul barabari kar sakti hain, ya pehli company bhi jeet sakti hai, bilkul ek box ke test par, kyunki truck set up karne ki apni fixed keemat hai jiska ek akela box koi faayda nahi utha paata — par jaise boxes ki tadaad sainkdon ya hazaaron mein badhti hai, ek-waqt-mein-ek-box company ka total time boxes ki tadaad ke seedhe anupaat mein badhta rehta hai, jabki truck company ka time us ek fixed setup keemat se aage lagbhag bilkul nahi badhta. Do algorithms ko ek baar time karna, ek khaas input size par, aur ek winner ghoshit karna akela-box test hai: ye ek asli number banaata hai, par wo number kuch bhi bharosemand nahi darsata ki kaunsa approach asal mein behtar perform karega ek baar input size sach mein bada ho jaaye, jo bilkul wo sthiti hai jise asli production data aakhirkaar banaata hai. Big-O notation doosra sawaal hai — "is ek khaas run mein kitna time laga" nahi, balki "jaise boxes ki tadaad badhti rehti hai, kya is company ka total time usi dar se, ek dheemi dar se, ya lagbhag bilkul nahi badhta" — ek GROWTH RATE ka varnan, ek akela measurement nahi.',
    },

    simple: `**Start broken.** Judging two solutions by timing each once, on one input size:

\`\`\`js
function findMaxA(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

function findMaxB(arr) {
  return [...arr].sort((a, b) => b - a)[0];
}

// Test with 100 items:
// findMaxA: 0.03ms   findMaxB: 0.08ms
// "findMaxA is faster, ship it"
\`\`\`

Timed once, on one specific array of 100 numbers, \`findMaxA\` genuinely does run faster than \`findMaxB\` — this is a real, correct measurement, not a mistake. The mistake is what gets concluded FROM it: "findMaxA is faster" is being treated as a general, permanent fact about the two functions, when it is actually only a fact about these two specific functions running on this one specific input size, on this one specific machine, at this one specific moment. Nothing about a single timing measurement reveals whether that same relationship holds at a different input size — and for these two functions specifically, it does not: \`findMaxA\` scans the array once, doing roughly the same amount of work per item regardless of how many items there are, while \`findMaxB\` sorts the entire array first, and sorting fundamentally requires more total work as the array grows, at a faster rate than a single scan does. At 100 items the sorting overhead is too small to matter; at 10 million items, that same overhead becomes the dominant cost, and the "faster" function from the original test becomes dramatically slower.

**The fix: count operations directly, as a function of input size n, not a single timed run**

\`\`\`js
// findMaxA: one loop, checking each of the n items exactly once
// → roughly n operations, regardless of what n actually is
// → written as O(n) — "linear": work grows in direct proportion to n

// findMaxB: sorting n items, then taking the first one
// → sorting itself requires roughly n * log(n) operations, provably more
//   total work than a single pass through n items, for any large n
// → written as O(n log n) — grows FASTER than O(n) as n increases
\`\`\`

Counting the actual number of operations each function performs, expressed in terms of the input size \`n\` rather than any specific number, reveals the real, permanent relationship between the two approaches that a single timing measurement at \`n = 100\` could never show: \`O(n)\` is a slower-growing curve than \`O(n log n)\`, meaning that for large enough \`n\`, \`findMaxA\` will always eventually win, regardless of which specific machine or language runs the code, since Big-O describes the shape of how work grows, not how fast any one specific computer happens to execute a single operation. This is precisely why comparing algorithms by counting their operations as a function of \`n\`, rather than by timing one run at one size, is the professional standard — it produces a conclusion that is actually true at every scale, not just the one scale that happened to be tested.`,

    simpleHi: `**Toote hue se shuru.** Do solutions ko har ek ko ek baar, ek input size par time karke faisla karna:

\`\`\`js
function findMaxA(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

function findMaxB(arr) {
  return [...arr].sort((a, b) => b - a)[0];
}

// 100 items ke saath test:
// findMaxA: 0.03ms   findMaxB: 0.08ms
// "findMaxA tez hai, ise ship karo"
\`\`\`

Ek baar time kiya gaya, 100 numbers ke ek khaas array par, \`findMaxA\` sach mein \`findMaxB\` se tez chalta hai — ye ek asli, sahi measurement hai, koi galti nahi. Galti ye hai ki ISSE kya nikaala jaata hai: "findMaxA tez hai" ko do functions ke baare mein ek general, permanent tathya ki tarah treat kiya jaa raha hai, jab ye asal mein sirf in do khaas functions ke baare mein ek tathya hai jo is ek khaas input size par, is ek khaas machine par, is ek khaas pal par chal rahe hain. Ek akele timing measurement ke baare mein kuch bhi ye nahi darsata ki kya wahi rishta ek alag input size par bhi tikta hai — aur in do functions ke liye khaas taur par, ye nahi tikta: \`findMaxA\` array ko ek baar scan karta hai, prati-item lagbhag samaan tadaad ka kaam karte hue chahe kitne bhi items ho, jabki \`findMaxB\` poore array ko pehle sort karta hai, aur sorting buniyaadi roop se array badhne par zyaada total kaam maangti hai, ek akele scan se zyaada tez dar par. 100 items par sorting overhead itni chhoti hai ki maayne nahi rakhti; 10 million items par, wahi overhead dominant keemat ban jaati hai, aur asli test ka "tez" function dramatically dheema ban jaata hai.

**Fix: operations ko seedhe gino, input size n ke function ki tarah, ek akela time kiya gaya run nahi**

\`\`\`js
// findMaxA: ek loop, n items mein se har ek ko bilkul ek baar check karte hue
// → lagbhag n operations, chahe n asal mein kuch bhi ho
// → likha jaata hai O(n) — "linear": kaam n ke seedhe anupaat mein badhta hai

// findMaxB: n items sort karna, phir pehla lena
// → sorting khud lagbhag n * log(n) operations maangta hai, provably zyaada
//   total kaam n items ke ek akele pass se, kisi bhi bade n ke liye
// → likha jaata hai O(n log n) — n badhne par O(n) se TEZ badhta hai
\`\`\`

Har function jitne asli operations perform karta hai unhe ganna, input size \`n\` ke roop mein express kiya gaya kisi khaas number ke bajaye, in do approaches ke beech wo asli, permanent rishta darsata hai jise \`n = 100\` par ek akela timing measurement kabhi nahi dikha sakta tha: \`O(n)\` \`O(n log n)\` se ek dheemi-badhti-hui curve hai, matlab kaafi bade \`n\` ke liye, \`findMaxA\` hamesha aakhirkaar jeetega, chahe koi bhi khaas machine ya bhaasha code chalaaye, kyunki Big-O kaam kaise badhta hai iski shape darsata hai, ye nahi ki koi khaas computer samyog se ek akela operation kitni tezi se execute karta hai. Yahi bilkul wajah hai ki algorithms ko ek run ko ek size par time karne ke bajaye unke operations ko \`n\` ke function ki tarah ganke compare karna professional standard hai — ye ek aisa nateeja banaata hai jo har scale par asal mein sahi hai, sirf us ek scale par nahi jo samyog se test kiya gaya.`,

    content: `## The Big-O vocabulary, from cheapest to most expensive growth

\`\`\`
O(1)        — constant       — cost does not depend on input size at all
O(log n)    — logarithmic    — cost grows very slowly as n grows (e.g. binary search)
O(n)        — linear         — cost grows in direct proportion to n
O(n log n)  — linearithmic   — slightly worse than linear (most efficient sorts)
O(n²)       — quadratic      — cost grows as the SQUARE of n (nested loops over n)
O(2ⁿ)       — exponential    — cost doubles with every additional input item
\`\`\`

Each of these describes how the number of operations grows as \`n\` grows, not any specific number of operations at any specific \`n\`. \`O(1)\` means an operation, like looking up a value at a known array index, costs the same whether the array holds 10 items or 10 million — this course\'s previous module already demonstrated exactly this with a \`Map\` lookup. \`O(n)\` means the cost scales in direct, one-to-one proportion with the input — doubling \`n\` roughly doubles the work, which is exactly what this course\'s first lesson\'s linear scan through an array of students did. \`O(n²)\`, which appears whenever one loop is nested inside another loop that both run roughly \`n\` times (a common shape for brute-force solutions, including this module\'s own two-sum brute force), means doubling \`n\` roughly QUADRUPLES the work, since the total operation count is proportional to \`n\` multiplied by \`n\`.

## Why constants and lower-order terms are deliberately dropped

\`\`\`
An algorithm that does exactly 3n + 7 operations is written as O(n), not O(3n + 7)
An algorithm that does n² + 100n operations is written as O(n²), not O(n² + 100n)
\`\`\`

Big-O is deliberately concerned with how work grows for LARGE \`n\`, since that is precisely the regime where an algorithm\'s choice actually matters — at small \`n\`, as this lesson\'s broken example demonstrated, almost any reasonable approach feels instant, so the difference that actually determines real-world behavior only shows up once \`n\` grows large. As \`n\` grows sufficiently large, a constant multiplier (the \`3\` in \`3n\`) or a smaller additive term (the \`+7\`, or the \`+100n\` next to an \`n²\` term) becomes negligible compared to the DOMINANT term\'s own growth — an \`n²\` term eventually dwarfs even a fairly large \`100n\` term as \`n\` keeps growing, which is why Big-O keeps only the fastest-growing term and drops everything else. This is not imprecision; it is a deliberate choice to describe the property that actually determines behavior at scale, since two algorithms that differ only by a constant factor (one is always exactly twice as fast as the other, at every input size) both eventually become impractical, or both eventually stay practical, together, as \`n\` grows — while two algorithms with genuinely different Big-O classes (\`O(n)\` versus \`O(n²)\`) inevitably diverge, with the faster-growing one eventually losing no matter how large its constant-factor head start was.

## Worst case, average case, and why this course defaults to worst case

\`\`\`
Linear search for a specific value in an unsorted array of n items:
  best case:    the value is the very first item checked   — O(1)
  worst case:   the value is the very last item, or absent — O(n)
  average case:  somewhere in between, roughly n/2 checks   — still O(n)
\`\`\`

An algorithm\'s cost can genuinely differ depending on which specific input it receives, not just how large that input is — searching for a value that happens to be the very first item checked is far cheaper than searching for one that is not present at all. This course, like most professional discussion of algorithms, defaults to describing the WORST case specifically because it is the only one of the three that provides an actual, reliable guarantee — a worst-case bound of \`O(n)\` promises that this algorithm will NEVER take more than roughly \`n\` operations, regardless of which specific input arrives, which is exactly the kind of guarantee a real system, especially one an adversarial or simply unlucky user might interact with, actually needs. Average-case analysis is a genuinely useful additional tool in certain specific situations (this course\'s later sorting module discusses quicksort\'s own average-versus-worst-case gap explicitly), but it depends on assumptions about what a "typical" input looks like that may not hold for every real system, whereas a worst-case bound holds unconditionally.`,

    contentHi: `## Big-O vocabulary, sabse sasta se sabse mehenga growth tak

\`\`\`
O(1)        — constant       — keemat input size par bilkul nirbhar nahi karti
O(log n)    — logarithmic    — n badhne par keemat bahut dheere badhti hai (jaisa binary search)
O(n)        — linear         — keemat n ke seedhe anupaat mein badhti hai
O(n log n)  — linearithmic   — linear se thoda kharaab (sabse kushal sorts)
O(n²)       — quadratic      — keemat n ke SQUARE ki tarah badhti hai (n par nested loops)
O(2ⁿ)       — exponential    — har atirikt input item ke saath keemat double hoti hai
\`\`\`

In mein se har ek darsata hai ki \`n\` badhne par operations ki tadaad kaise badhti hai, kisi khaas \`n\` par operations ki koi khaas tadaad nahi. \`O(1)\` ka matlab hai ek operation, jaisa ek jaani-jaati array index par ek value dhoondhna, samaan keemat leta hai chahe array 10 items rakhta ho ya 10 million — is course ka pehle wala module bilkul isi ko ek \`Map\` lookup se darsa chuka hai. \`O(n)\` ka matlab hai keemat input ke saath seedhe, ek-ke-ek anupaat mein scale karti hai — \`n\` ko double karna kaam ko lagbhag double karta hai, jo bilkul wo hai jo is course ke pehle lesson ke students ke array ke through linear scan ne kiya. \`O(n²)\`, jo tab dikhta hai jab ek loop ek doosre loop ke andar nested hota hai jo dono lagbhag \`n\` baar chalte hain (brute-force solutions ke liye ek aam shape, is module ke apne two-sum brute force sameet), matlab \`n\` ko double karna kaam ko lagbhag QUADRUPLE karta hai, kyunki total operation count \`n\` ko \`n\` se guna karne ke anupaat mein hai.

## Constants aur lower-order terms jaan-boojhkar kyun chhode jaate hain

\`\`\`
Ek algorithm jo bilkul 3n + 7 operations karta hai O(n) likha jaata hai, O(3n + 7) nahi
Ek algorithm jo n² + 100n operations karta hai O(n²) likha jaata hai, O(n² + 100n) nahi
\`\`\`

Big-O jaan-boojhkar is baat se chintit hai ki BADE \`n\` ke liye kaam kaise badhta hai, kyunki bilkul wahi regime hai jahan ek algorithm ka chunaav asal mein maayne rakhta hai — chhote \`n\` par, jaisa is lesson ke toote example ne darsaaya, lagbhag koi bhi vaajbi approach turant mehsoos hota hai, isliye jo farak asal mein asli-duniya vyavahaar tay karta hai wo sirf tab dikhta hai jab \`n\` bada ho jaata hai. Jaise \`n\` kaafi bada ho jaata hai, ek constant multiplier (\`3n\` mein \`3\`) ya ek chhota additive term (\`+7\`, ya \`n²\` term ke saath \`+100n\`) DOMINANT term ki apni growth ke saapeksh bemaani ban jaata hai — ek \`n²\` term aakhirkaar ek kaafi bade \`100n\` term ko bhi baona kar deta hai jaise \`n\` badhta rehta hai, yahi wajah hai ki Big-O sirf sabse-tez-badhta-hua term rakhta hai aur baaki sab hataata hai. Ye na-sateekta nahi hai; ye ek jaan-boojhkar liya gaya faisla hai us property ko darsaane ke liye jo scale par vyavahaar asal mein tay karti hai, kyunki do algorithms jo sirf ek constant factor se alag hain (ek hamesha bilkul dooguna tez hai doosre se, har input size par) dono aakhirkaar asambhaavya ho jaate hain, ya dono aakhirkaar sambhaavya reh jaate hain, saath, jaise \`n\` badhta hai — jabki do algorithms sach mein alag Big-O classes ke saath (\`O(n)\` versus \`O(n²)\`) hamesha alag hote hain, tez-badhta-hua wala aakhirkaar haarte hue chahe uski constant-factor shuruaati baadhat kitni bhi badi thi.

## Worst case, average case, aur ye course worst case ko default kyun banaata hai

\`\`\`
n items ke ek unsorted array mein ek khaas value ke liye linear search:
  best case:    value bilkul pehla check kiya gaya item hai   — O(1)
  worst case:   value bilkul aakhri item hai, ya maujood nahi — O(n)
  average case:  beech mein kahin, lagbhag n/2 checks         — abhi bhi O(n)
\`\`\`

Ek algorithm ki keemat sach mein alag ho sakti hai is baat par nirbhar karte hue ki isse kaunsa khaas input milta hai, sirf ye nahi ki wo input kitna bada hai — ek aisi value dhoondhna jo samyog se bilkul pehla check kiya gaya item hai ek aisi value dhoondhne se kaafi sasta hai jo bilkul maujood nahi hai. Ye course, algorithms ki adhikaansh professional discussion ki tarah, WORST case ko describe karne ko default banaata hai khaas taur par kyunki ye teeno mein se akela hai jo ek asli, bharosemand guarantee pradaan karta hai — \`O(n)\` ka ek worst-case bound waada karta hai ki ye algorithm KABHI lagbhag \`n\` se zyaada operations nahi lega, chahe koi bhi khaas input aaye, jo bilkul us tarah ki guarantee hai jiski ek asli system, khaas taur par ek jise ek adversarial ya bas durbhaagyapoorn user interact kar sakta hai, asal mein zaroorat hai. Average-case vishleshan kuch khaas sthitiyon mein ek sach mein upyogi atirikt tool hai (is course ka baad ka sorting module quicksort ke apne average-versus-worst-case gap ko explicitly discuss karta hai), par ye us baare mein dhaarnaon par nirbhar karta hai ki ek "typical" input kaisa dikhta hai jo har asli system ke liye sach na ho, jabki ek worst-case bound bina-shart tikta hai.`,

    examples: [
      {
        title: 'Broken: comparing two functions by timing one run at one size',
        titleHi: 'Toota: ek size par ek run ko time karke do functions compare karna',
        code: `console.time("A"); findMaxA(hundredItems); console.timeEnd("A");
console.time("B"); findMaxB(hundredItems); console.timeEnd("B");
// "A is faster" — true at 100 items, not necessarily true at 10 million`,
        codeJs: `function findMaxA(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

function findMaxB(arr) {
  return [...arr].sort((a, b) => b - a)[0];
}

const hundred = Array.from({ length: 100 }, () => Math.random());
console.time("A"); findMaxA(hundred); console.timeEnd("A");
console.time("B"); findMaxB(hundred); console.timeEnd("B");`,
        codeTs: `function findMaxA(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

function findMaxB(arr: number[]): number {
  return [...arr].sort((a, b) => b - a)[0];
}

const hundred: number[] = Array.from({ length: 100 }, () => Math.random());
console.time("A"); findMaxA(hundred); console.timeEnd("A");
console.time("B"); findMaxB(hundred); console.timeEnd("B");`,
        output: `At 100 items, both finish in well under a millisecond, with A
appearing marginally faster — a result that says nothing reliable
about behavior at 10,000,000 items.`,
        explain: 'A single timing measurement at one input size cannot reveal a growth-rate difference that only becomes visible at a much larger size.',
        explainHi: 'Ek input size par ek akela timing measurement ek growth-rate farak nahi darsa sakta jo sirf ek kaafi bade size par drishyaman hota hai.',
      },
      {
        title: 'Fixed: counting operations as a function of n reveals the real difference',
        titleHi: 'Theek: n ke function ki tarah operations ganna asli farak darsata hai',
        code: `// findMaxA: one pass, n comparisons → O(n)
// findMaxB: sorting first, roughly n * log(n) operations → O(n log n)
// O(n) grows slower than O(n log n) for large n — A wins at scale`,
        codeJs: `// findMaxA does exactly one comparison per remaining item:
// n - 1 comparisons total for an array of length n → O(n)

// findMaxB sorts the whole array first. A correct general-purpose
// sort does roughly n * log(n) comparisons, then takes the first
// element → O(n log n), which grows faster than O(n) as n grows`,
        codeTs: `// Same analysis — Big-O describes the algorithm's own structure,
// not anything TypeScript's type system tracks or enforces.
// findMaxA: O(n)
// findMaxB: O(n log n)`,
        outputJs: `At n = 100, the gap between O(n) and O(n log n) is small enough
to be invisible. At n = 10,000,000, O(n log n) does roughly
7x more work than O(n) — a difference no longer invisible at all.`,
        outputTs: `// Identical analysis. TypeScript's types describe data shapes,
// not runtime cost — Big-O is a separate, complementary discipline.`,
        explain: 'Counting operations as a function of input size predicts behavior at every scale, including sizes that were never actually tested.',
        explainHi: 'Input size ke function ki tarah operations ganna har scale par vyavahaar predict karta hai, un sizes sameet jo asal mein kabhi test nahi kiye gaye.',
      },
      {
        title: 'The same growth-rate reasoning applied to a nested-loop brute force',
        titleHi: 'Wahi growth-rate tark ek nested-loop brute force par lagu kiya gaya',
        code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    // roughly n * n = n² total iterations
  }
}`,
        codeJs: `function countPairs(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      count++; // this line runs roughly n * n times total
    }
  }
  return count;
}
// countPairs([1,2,3,4]).length === 4 → this returns 16, not 8 or 4`,
        codeTs: `function countPairs(arr: number[]): number {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      count++;
    }
  }
  return count;
}`,
        outputJs: `countPairs([1, 2, 3, 4]) returns 16 (4 * 4), confirming the inner
loop genuinely runs n times for EACH of the n outer iterations —
n * n = n² total, growing far faster than a single loop's O(n).`,
        outputTs: `// Identical behaviour. This nested-loop shape is exactly what
// this module's own two-sum brute force does — O(n²).`,
        explain: 'A loop nested inside another loop that both run n times performs n multiplied by n total iterations, which is precisely why this shape is classified as O(n²).',
        explainHi: 'Ek loop jo ek doosre loop ke andar nested hai jo dono \`n\` baar chalte hain \`n\` ko \`n\` se guna kiye gaye total iterations perform karta hai, jo bilkul isliye hai ki ye shape \`O(n²)\` classified hoti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `console.time("solution"); solve(smallTestInput); console.timeEnd("solution");
// declaring a winner based on one timed run at one input size`,
        right: `// counting operations as a function of n, e.g. "one loop over n
// items" (O(n)) versus "a loop nested inside another loop over n
// items" (O(n²)), independent of any specific machine or input size`,
        why: 'A single timing measurement at one input size cannot reveal how the two approaches\' costs diverge at a much larger size, which is exactly where the real difference tends to show up.',
        whyHi: 'Ek input size par ek akela timing measurement ye nahi darsa sakta ki do approaches ki keemat ek kaafi bade size par kaise alag hoti hai, jo bilkul wahaan hai jahan asli farak dikhne ki jhukaav rakhta hai.',
      },
      {
        wrong: `// treating O(3n) and O(n) as meaningfully different complexities`,
        right: `// both are written simply as O(n) — the constant factor is dropped`,
        why: 'Big-O deliberately drops constant multipliers because it describes growth RATE for large n, and a constant factor does not change whether cost grows linearly, quadratically, or otherwise.',
        whyHi: 'Big-O jaan-boojhkar constant multipliers hataata hai kyunki ye bade \`n\` ke liye growth RATE darsata hai, aur ek constant factor ye nahi badalta ki keemat linearly, quadratically, ya kisi aur tarah badhti hai.',
      },
      {
        wrong: `// analyzing only the best case, or only the case that happened
// to be tested, and calling that the algorithm's complexity`,
        right: `// analyzing the worst case by default — the input that makes
// the algorithm do the most possible work — since it is the one
// case that provides an unconditional guarantee`,
        why: 'An algorithm\'s cost can genuinely differ across inputs of the same size; only a worst-case analysis guarantees the algorithm will never do more work than the stated bound, regardless of which specific input it receives.',
        whyHi: 'Ek algorithm ki keemat sach mein alag ho sakti hai samaan size ke inputs ke aar-paar; sirf ek worst-case vishleshan guarantee karta hai ki algorithm kabhi bataayi gayi bound se zyaada kaam nahi karega, chahe isse koi bhi khaas input mile.',
      },
    ],

    realWorld: [
      {
        en: '**Big-O notation is the standard, universally used vocabulary across the entire software industry for describing an algorithm\'s scalability**, appearing in technical documentation, code reviews, and interviews at essentially every company.',
        hi: '**Big-O notation poore software industry mein ek algorithm ki scalability describe karne ke liye standard, universal roop se istemal ki jaane waali vocabulary hai**, technical documentation, code reviews, aur interviews mein lagbhag har company mein dikhti hai.',
      },
      {
        en: '**"What is the time complexity of your solution?" is asked in nearly every technical interview involving a coding problem**, specifically because it tests the exact scaling-awareness this lesson builds, not just whether the code produces a correct output.',
        hi: '**"Tumhaari solution ki time complexity kya hai?" lagbhag har technical interview mein poocha jaata hai jismein ek coding problem shaamil hai**, khaas taur par kyunki ye bilkul us scaling-awareness ko test karta hai jise ye lesson banaata hai, sirf ye nahi ki code ek sahi output banaata hai.',
      },
      {
        en: '**Real production incidents caused by an O(n²) approach that "worked fine" until real data volume revealed its true growth rate are a genuinely common category of documented engineering post-mortems.**',
        hi: '**Ek O(n²) approach ki wajah se asli production incidents jo "theek kaam kiya" jab tak asli data volume ne uski asli growth rate saamne nahi laayi documented engineering post-mortems ki ek sach mein aam category hain.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does Big-O notation drop constant factors and lower-order terms, and why does this simplification actually make it MORE useful rather than less precise in a way that matters?',
        qHi: 'Big-O notation constant factors aur lower-order terms kyun hataata hai, aur ye simplification ise KAM sateek banaane ke bajaye asal mein zyaada upyogi kyun banaata hai jo maayne rakhta hai?',
        a: 'Big-O notation exists specifically to answer one particular question — as the input size grows arbitrarily large, does an algorithm\'s cost grow at a rate that will eventually become impractical, or does it grow slowly enough to remain practical indefinitely? Constant factors and lower-order additive terms do not change the answer to that specific question at all. An algorithm that performs exactly 3n operations and one that performs exactly n operations both belong to the same fundamental growth category — doubling the input doubles the work for both of them, and both remain proportionally, predictably scalable as n grows without bound, differing only by a fixed multiplier that never changes regardless of how large n becomes. By contrast, an algorithm performing n² operations and one performing n operations belong to genuinely different categories, because doubling the input doubles the work for the linear one but quadruples it for the quadratic one — and critically, this qualitative difference in behavior only becomes dramatic once n is large; at small n, an n² algorithm with a small constant factor can easily outperform an n algorithm with a large one, which is exactly the kind of small-scale illusion this lesson\'s broken example demonstrated. By deliberately keeping only the fastest-growing term and ignoring both constant multipliers and smaller additive terms, Big-O produces a classification that groups algorithms according to whether they will EVENTUALLY diverge as n grows large, which is precisely the property that determines whether an approach remains viable as real data grows toward production scale — this is a more useful piece of information for that specific purpose than a precise but scale-specific measurement, not a less precise one, because the constants and lower-order terms it discards genuinely stop mattering at the scale where the classification is meant to be applied.',
        aHi: 'Big-O notation khaas taur par ek khaas sawaal ka jawaab dene ke liye maujood hai — jaise input size manmaana bada hota hai, kya ek algorithm ki keemat ek aisi dar se badhti hai jo aakhirkaar asambhaavya ho jaayegi, ya kya ye itni dheere badhti hai ki hamesha ke liye sambhaavya rahe? Constant factors aur lower-order additive terms us khaas sawaal ke jawaab ko bilkul nahi badalte. Ek algorithm jo bilkul 3n operations perform karta hai aur ek jo bilkul n operations perform karta hai dono usi buniyaadi growth category mein aate hain — input ko double karna dono ke liye kaam ko double karta hai, aur dono anupaatik, predictably scalable rehte hain jaise n bina baundhri ke badhta hai, sirf ek fixed multiplier se alag hote hue jo kabhi nahi badalta chahe n kitna bada ho jaaye. Iske ulta, ek algorithm jo n² operations perform karta hai aur ek jo n operations perform karta hai sach mein alag categories mein aate hain, kyunki input ko double karna linear wale ke liye kaam double karta hai par quadratic wale ke liye char guna karta hai — aur mahatvapoorn baat, ye vyavahaar mein qualitative farak sirf tab naatakiya banta hai jab n bada hota hai; chhote n par, ek chhote constant factor waala n² algorithm aasaani se ek bade waale n algorithm se behtar perform kar sakta hai, jo bilkul us tarah ka chhota-scale bhram hai jo is lesson ke toote example ne darsaaya. Jaan-boojhkar sirf sabse-tez-badhta-hua term rakhke aur constant multipliers aur chhote additive terms dono ko ignore karke, Big-O ek classification banaata hai jo algorithms ko is aadhaar par group karta hai ki kya wo AAKHIRKAAR alag honge jaise n bada hota hai, jo bilkul wo property hai jo tay karta hai ki ek approach asli data ke production scale ki taraf badhne par vyavahaarik rehta hai ya nahi — ye us khaas maksad ke liye ek zyaada upyogi jaankaari ka tukda hai ek sateek par scale-khaas measurement se, kam sateek nahi, kyunki constants aur lower-order terms jo ye hataata hai sach mein maayne rakhna band kar dete hain us scale par jahan classification lagu hone ke liye maani gayi hai.',
      },
      {
        q: 'Why does this course default to describing an algorithm\'s worst-case complexity rather than its best case or average case, given that the actual running time on a real input can vary?',
        qHi: 'Ye course ek algorithm ki worst-case complexity describe karne ko default kyun banaata hai iske best case ya average case ke bajaye, ye dekhte hue ki ek asli input par asli running time badal sakti hai?',
        a: 'An algorithm\'s actual cost can genuinely depend on which specific input it receives, not merely on that input\'s size — a linear search happens to finish almost instantly if the value being searched for is the very first element checked, and happens to take much longer if that value is the very last element checked, or is not present in the array at all, despite both scenarios operating on an array of the exact same size. Describing only the best case would be actively misleading, since it describes a scenario that is not guaranteed to occur for any given real input, and a system designed around a best-case assumption offers no protection at all against the specific inputs that happen to trigger worse behavior — inputs that a real system, especially one exposed to real, unpredictable, or even deliberately adversarial users, will eventually encounter. Average-case analysis is a genuinely more informative middle ground, but it depends on making an assumption about what a "typical" input looks like, and that assumption may not hold for a specific real system\'s actual usage pattern, meaning an average-case guarantee can still be violated in practice if real inputs do not resemble whatever distribution the average was calculated over. Worst-case analysis avoids both of these problems by describing the single input, among all possible inputs of a given size, that causes the algorithm to do the MOST work — and because this is by definition the most expensive input at that size, a worst-case bound provides an unconditional guarantee: the algorithm will never exceed this cost at this input size, regardless of which specific input actually arrives, without needing to assume anything about how likely any particular input is to occur. This unconditional nature is precisely why worst-case analysis is the default in professional practice and in this course: it is the only one of the three that remains true no matter what a real system actually receives.',
        aHi: 'Ek algorithm ki asli keemat sach mein is baat par nirbhar kar sakti hai ki isse kaunsa khaas input milta hai, sirf us input ke size par nahi — ek linear search lagbhag turant khatam ho jaata hai agar dhoondhi jaa rahi value bilkul pehla check kiya gaya element hai, aur kaafi zyaada samay leta hai agar wo value bilkul aakhri check kiya gaya element hai, ya array mein bilkul maujood nahi hai, is baat ke bawajood ki dono scenarios bilkul samaan size ke array par operate karte hain. Sirf best case describe karna saqriya roop se gumraah karne waala hoga, kyunki ye ek aisa scenario darsata hai jo kisi bhi diye gaye asli input ke liye guarantee-kiya-jaana nahi hai, aur ek best-case dhaarna ke aas-paas design kiya gaya system un khaas inputs ke khilaaf bilkul koi suraksha nahi pradaan karta jo samyog se kharaab vyavahaar trigger karte hain — inputs jinse ek asli system, khaas taur par ek jo asli, na-predictable, ya jaan-boojhkar adversarial users ke saamne aata hai, aakhirkaar saamna karega. Average-case vishleshan ek sach mein zyaada jaankaari-bhara madhya maarg hai, par ye is dhaarna par nirbhar karta hai ki ek "typical" input kaisa dikhta hai, aur wo dhaarna ek khaas asli system ke asli istemal pattern ke liye sach na ho sakti hai, matlab ek average-case guarantee practice mein phir bhi violate ho sakti hai agar asli inputs us distribution jaise na hon jispar average gana gaya tha. Worst-case vishleshan in dono samasyaon se bachta hai us akele input ko describe karke, ek diye gaye size ke sab sambhaavit inputs mein se, jo algorithm ko SABSE ZYAADA kaam karne ka kaaran banta hai — aur kyunki ye paribhaasha se us size par sabse mehenga input hai, ek worst-case bound ek bina-shart guarantee pradaan karta hai: algorithm is size par kabhi is keemat se zyaada nahi jaayega, chahe isse koi bhi khaas input mile, is baat ki dhaarna kiye bina ki koi khaas input hone ki kitni sambhaavna hai. Ye bina-shart svabhaav bilkul isliye hai ki worst-case vishleshan professional practice mein aur is course mein default hai: ye teeno mein se akela hai jo sach rehta hai chahe ek asli system ko asal mein kya mile.',
      },
    ],

    exercises: [
      {
        task: 'Time findMaxA and findMaxB from this lesson at 100 items, then at 1,000,000 items, using console.time/console.timeEnd. Confirm the relationship between them changes as the size grows, matching this lesson\'s explanation.',
        taskHi: 'Is lesson ke \`findMaxA\` aur \`findMaxB\` ko 100 items par, phir 1,000,000 items par time karo, \`console.time\`/\`console.timeEnd\` istemal karte hue. Confirm karo ki unke beech rishta size badhne ke saath badalta hai, is lesson ke spashteekaran se mel khaate hue.',
        hint: 'Generate the large array using Array.from({ length: 1000000 }, () => Math.random()) rather than typing out a million numbers by hand.',
        hintHi: '\`Array.from({ length: 1000000 }, () => Math.random())\` istemal karke bada array banaao, das lakh numbers haath se type karne ke bajaye.',
      },
      {
        task: 'Write down the Big-O complexity of a function you have written before (in this course or elsewhere) by counting its actual loops and operations as a function of n, without timing it at all.',
        taskHi: 'Ek function ki Big-O complexity likho jo tumne pehle likhi hai (is course mein ya kahin aur) iske asli loops aur operations ko \`n\` ke function ki tarah ganke, ise bilkul bina time kiye.',
        hint: 'Count nested loops first — a loop inside a loop that both depend on the same input size n is a strong signal of O(n²).',
        hintHi: 'Pehle nested loops gino — ek loop ek doosre loop ke andar jo dono usi input size \`n\` par nirbhar karte hain \`O(n²)\` ka ek majboot sanket hai.',
      },
      {
        task: 'For the linear search example from this lesson\'s content section, write out the best case, worst case, and average case in your own words, and explain in one sentence why this course would report only the worst case as "the" complexity.',
        taskHi: 'Is lesson ke content section ke linear search example ke liye, best case, worst case, aur average case ko apne khud ke shabdon mein likho, aur ek vaakya mein samjhaao ki ye course sirf worst case ko "asli" complexity ki tarah kyun report karega.',
        hint: 'Think about what guarantee each of the three cases actually provides to someone relying on this function in a real system.',
        hintHi: 'Socho ki teeno mein se har ek asal mein kya guarantee pradaan karta hai kisi ke liye jo is function par ek asli system mein bharosa karta hai.',
      },
    ],

    keyTakeaways: [
      'Big-O describes how the amount of work grows as input size n grows — a description of growth rate, not a single timing measurement at one specific size.',
      'A single timed run at one input size can produce a misleading verdict, since almost any approach feels fast at a small size, and the real difference between two algorithms often only appears at large n.',
      'Big-O deliberately drops constant factors and lower-order terms because they do not change whether an algorithm\'s cost grows linearly, quadratically, or otherwise as n becomes large.',
      'A nested loop where both loops run roughly n times performs n multiplied by n operations total, which is why that shape is classified as O(n²).',
      'This course defaults to worst-case analysis because it is the only one of best case, worst case, and average case that provides an unconditional guarantee, regardless of which specific input actually arrives.',
      'Comparing two algorithms\' Big-O complexity, not their timed performance on one test input, is the professional standard for predicting which will actually perform better at real production scale.',
    ],
    keyTakeawaysHi: [
      'Big-O darsata hai ki input size \`n\` badhne par kaam ki tadaad kaise badhti hai — ek growth rate ka varnan, ek khaas size par ek akela timing measurement nahi.',
      'Ek input size par ek akela timed run ek gumraah karne waala faisla de sakta hai, kyunki lagbhag koi bhi approach ek chhote size par tez mehsoos hota hai, aur do algorithms ke beech asli farak aksar sirf bade \`n\` par dikhta hai.',
      'Big-O jaan-boojhkar constant factors aur lower-order terms hataata hai kyunki wo ye nahi badalte ki ek algorithm ki keemat \`n\` bade hone par linearly, quadratically, ya kisi aur tarah badhti hai.',
      'Ek nested loop jahan dono loops lagbhag \`n\` baar chalte hain kul milaake \`n\` ko \`n\` se guna kiye gaye operations perform karta hai, yahi wajah hai ki ye shape \`O(n²)\` classified hoti hai.',
      'Ye course worst-case vishleshan ko default banaata hai kyunki ye best case, worst case, aur average case mein se akela hai jo ek bina-shart guarantee pradaan karta hai, chahe isse asal mein koi bhi khaas input mile.',
      'Do algorithms ki Big-O complexity compare karna, unki ek test input par timed performance nahi, professional standard hai ye predict karne ke liye ki asli production scale par kaunsa asal mein behtar perform karega.',
    ],
  },
];
