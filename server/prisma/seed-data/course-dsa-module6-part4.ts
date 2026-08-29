/**
 * DSA Complete Course — Module 6: Recursion & Backtracking, lesson 4
 * (final lesson of Module 6).
 *
 * Memoization: caching a recursive function's own results so identical
 * subproblems are never recomputed — the bridge from recursion into this
 * course's later Dynamic Programming module. Directly builds on two
 * already-established facts: this course's Module 1 lesson on analyzing
 * recursion complexity showed that naive recursive Fibonacci costs
 * O(2^n) specifically because its call tree branches into two calls per
 * invocation, and this course's Module 3 lessons on hashing established
 * that a Map answers "have I already computed this?" in O(1). Broken
 * example: the exact naive Fibonacci function from Module 1, now
 * revisited with the specific fix in mind — recomputing the same
 * smaller subproblems (like fib(2)) enormous numbers of times across
 * the branching call tree. Fixed by wrapping the recursive call in a
 * check against a Map cache: compute a result once, store it, and
 * return the cached value directly on every subsequent request for the
 * same input, collapsing the exponential call tree into genuinely O(n)
 * distinct subproblems ever actually computed.
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

export const DSA_MODULE_6_PART4: CourseLesson[] = [
  {
    slug: 'memoization-bridging-to-dp',
    title: 'Memoization: Caching Recursive Results',
    titleHi: 'Memoization: Recursive Nateejon Ko Cache Karna',
    description: 'This course\'s Module 1 lesson on recursion complexity showed that naive recursive Fibonacci costs O(2^n) because its call tree branches into two calls per invocation — fib(2) alone gets recomputed from scratch thousands of times inside the call tree for fib(30), despite the answer never changing.',
    descriptionHi: 'Is course ke Module 1 ke recursion complexity lesson ne darsaaya ki naive recursive Fibonacci \`O(2^n)\` kharch karta hai kyunki iska call tree prati-invocation do calls mein branch hota hai — akela \`fib(2)\` hazaaron baar shuru se dobara gana jaata hai \`fib(30)\` ke call tree ke andar, chahe jawaab kabhi na badle.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A single researcher re-deriving the exact same well-known scientific fact from first principles every single time it happens to come up in a chain of reasoning, versus that same researcher writing the fact down the first time it is derived, and simply looking it up in their own notes every time it comes up again afterward.** Re-deriving the same fact from scratch every time it is needed genuinely produces the correct fact each time — nothing about the derivation itself is wrong — but it means redoing identical work, over and over, for a piece of information that never actually changes, purely because nothing about the process keeps track of what has already been figured out. Writing the fact down once and looking it up afterward produces the exact same correct fact every single time it is needed, but the very first derivation is the only time the actual work of deriving it is ever done — every subsequent need for that same fact is satisfied almost instantly, by consulting what was already recorded, rather than repeating work whose outcome was already known. This course\'s Module 1 lesson on recursion complexity already showed that naive recursive Fibonacci is the re-derive-every-time researcher: fib(2), for instance, gets computed from scratch an enormous number of times across the branching call tree of a single call to fib(30), despite the answer to fib(2) never changing no matter how many times it is asked. Memoization is the write-it-down-once researcher: the first time fib(2) is actually computed, its result is recorded in a cache, and every subsequent request for fib(2) is answered directly from that cache, never repeating the computation again.',
      hi: '**Ek akela researcher bilkul wahi achhi-tarah-jaani-jaati scientific fact ko pehle siddhaanton se dobara nikaalta hai har akeli baar jab ye samyog se tark ki ek chain mein aata hai, versus wahi researcher fact ko likh leta hai jab ye pehli baar nikaali jaati hai, aur baad mein har baar jab ye dobara aati hai bas apne notes mein ise dekh leta hai.** Har baar jab isse chahiye shuru se wahi fact dobara nikaalna sach mein har baar sahi fact banaata hai — derivation khud ke baare mein kuch bhi galat nahi hai — par iska matlab hai identical kaam dobara karna, baar-baar, ek aisi jaankaari ke liye jo asal mein kabhi nahi badalti, sirf isliye kyunki process ke baare mein kuch bhi track nahi rakhta ki pehle se kya pata lagaaya ja chuka hai. Fact ko ek baar likhna aur baad mein ise dekhna bilkul wahi sahi fact banaata hai har akeli baar jab ye chahiye, par bilkul pehli derivation hi akela waqt hai jab ise nikaalne ka asli kaam kabhi kiya jaata hai — usi fact ki har baad ki zaroorat lagbhag turant poori hoti hai, jo pehle se record kiya gaya use consult karke, us kaam ko dohraane ke bajaye jiska nateeja pehle se jaana-jaata tha. Is course ka Module 1 ka recursion complexity lesson pehle hi darsa chuka hai ki naive recursive Fibonacci har-baar-dobara-nikaalne-waala researcher hai: \`fib(2)\`, misal ke taur par, shuru se ek vishaal tadaad mein gani jaati hai bilkul ek akeli \`fib(30)\` call ke branching call tree ke aar-paar, chahe \`fib(2)\` ka jawaab kitni bhi baar poocha jaaye kabhi na badle. Memoization ek-baar-likh-lo-waala researcher hai: bilkul pehli baar jab \`fib(2)\` asal mein gani jaati hai, iska nateeja ek cache mein record kiya jaata hai, aur \`fib(2)\` ki har baad ki request us cache se seedhe jawaab di jaati hai, computation ko kabhi dobara na dohraate hue.',
    },

    simple: `**Start broken.** The naive recursive Fibonacci from this course's Module 1, recomputing identical subproblems repeatedly:

\`\`\`js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // TWO recursive calls per invocation
}
\`\`\`

This course\'s Module 1 lesson on analyzing recursion already established exactly why this costs \`O(2ⁿ)\`: each call branches into two further calls, producing a call tree whose total size doubles at each level of depth. The specific waste, worth naming directly: \`fib(28)\` gets computed as part of both the \`fib(29)\` branch AND, separately, deep inside the \`fib(30)\` branch\'s own recursive exploration — the exact same input, \`28\`, triggers the exact same computation, producing the exact same answer, entirely independently, an enormous number of times throughout the tree. Nothing about this function remembers that \`fib(28)\` (or \`fib(2)\`, or any other specific value) was ever computed before.

**The fix: cache each result the first time it is computed, using a Map**

\`\`\`js
function fib(n, cache = new Map()) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n); // already computed — return instantly

  const result = fib(n - 1, cache) + fib(n - 2, cache);
  cache.set(n, result); // record it for every future request
  return result;
}
\`\`\`

\`\`\`ts
function fib(n: number, cache: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n) as number;

  const result = fib(n - 1, cache) + fib(n - 2, cache);
  cache.set(n, result);
  return result;
}
\`\`\`

This course\'s Module 3 lessons on hashing already established that a \`Map\` answers "have I already stored this key?" in \`O(1)\` — \`cache.has(n)\` checks this directly before doing any recursive work at all. The very first time \`fib\` is called with a specific \`n\`, no cached value exists yet, so the function computes it the normal way and stores the result in \`cache\` before returning. Every SUBSEQUENT call with that same \`n\`, anywhere else in the (much smaller) remaining call tree, finds the cached value immediately and returns it without making any further recursive calls at all — collapsing what would have been exponentially many repeated computations into exactly one computation per distinct value of \`n\` ever actually needed.`,

    simpleHi: `**Toote hue se shuru.** Is course ke Module 1 se naive recursive Fibonacci, identical subproblems ko baar-baar dobara gante hue:

\`\`\`js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2); // prati-invocation DO recursive calls
}
\`\`\`

Is course ka Module 1 ka recursion ka vishleshan karne wala lesson pehle hi bilkul sthaapit kar chuka hai ki ye \`O(2ⁿ)\` kyun kharch karta hai: har call do aur calls mein branch hota hai, ek call tree banaate hue jiski total size depth ke har level par double hoti hai. Khaas barbaadi, seedhe naam dene laayak: \`fib(28)\` \`fib(29)\` branch ke hisse ki tarah aur, alag se, \`fib(30)\` branch ki apni recursive exploration mein gehraayi mein dono ki tarah gani jaati hai — bilkul wahi input, \`28\`, bilkul wahi computation trigger karta hai, bilkul wahi jawaab banaate hue, poori tarah azaadi se, poore tree mein ek vishaal tadaad mein. Is function ke baare mein kuch bhi ye yaad nahi rakhta ki \`fib(28)\` (ya \`fib(2)\`, ya koi doosri khaas value) kabhi pehle gani gayi thi.

**Fix: har nateeje ko pehli baar jab ye gana jaata hai cache karo, ek Map istemal karke**

\`\`\`js
function fib(n, cache = new Map()) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n); // pehle se gana gaya — turant return karo

  const result = fib(n - 1, cache) + fib(n - 2, cache);
  cache.set(n, result); // isse har bhavishya ki request ke liye record karo
  return result;
}
\`\`\`

\`\`\`ts
function fib(n: number, cache: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n) as number;

  const result = fib(n - 1, cache) + fib(n - 2, cache);
  cache.set(n, result);
  return result;
}
\`\`\`

Is course ke Module 3 ke hashing lessons pehle hi sthaapit kar chuke hain ki ek \`Map\` "kya maine ye key pehle se store ki hai?" ka jawaab \`O(1)\` mein deta hai — \`cache.has(n)\` ise seedhe check karta hai koi bhi recursive kaam karne se pehle. Bilkul pehli baar jab \`fib\` ek khaas \`n\` ke saath bulaaya jaata hai, koi cached value abhi maujood nahi hai, isliye function ise saadhaaran tarike se ganta hai aur nateeje ko \`cache\` mein return karne se pehle store karta hai. Us usi \`n\` ke saath har BAAD ki call, (bahut chhote) bache hue call tree mein kahin bhi, cached value ko turant paati hai aur bilkul kisi bhi aur recursive calls kiye bina ise return karti hai — jo exponentially kayi dohraayi hui computations hoti wo bilkul ek computation prati alag \`n\` ki value mein simatte hue jo asal mein kabhi zaruri thi.`,

    content: `## Confirming the improvement: comparing call counts directly

\`\`\`
Naive fib(30):     call count grows exponentially — well over a
                    million total calls made

Memoized fib(30):  each distinct value of n from 0 to 30 is computed
                    exactly once — at most 31 genuine computations,
                    plus a small, constant number of cache checks
                    for every call that would have been a repeat
\`\`\`

This is directly measurable, not merely theoretical: adding a counter that increments on every call to the naive version, and a separate counter that increments only when the memoized version actually computes something new (as opposed to returning a cached value), shows the naive version\'s count growing explosively with \`n\`, while the memoized version\'s genuine-computation count grows only linearly, exactly matching \`n\` itself. The memoized function still LOOKS recursive, and it still technically makes function calls for values it has already cached — but the vast majority of those calls now do a single, cheap \`O(1)\` cache lookup and return immediately, rather than triggering further branching recursion underneath them.

## Why the cache must be shared, not recreated per call

\`\`\`js
function fibBroken(n) {
  const cache = new Map(); // a BRAND-NEW, empty cache every single call
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n); // always empty — never actually hits
  const result = fibBroken(n - 1) + fibBroken(n - 2); // recursive calls don't share this cache either
  cache.set(n, result);
  return result;
}
\`\`\`

A genuinely common mistake is creating the cache INSIDE the function body without passing it through to recursive calls, or creating a fresh one on every call — this defeats memoization entirely, since each call ends up with its own private, empty cache that no other call can ever see or benefit from. The fixed version\'s \`cache\` parameter, with a default value of \`new Map()\` supplied only for the very first, outermost call, is passed explicitly to every recursive call specifically so all of them share the exact same cache object — this is what allows a value computed deep in one branch of the recursion to be found and reused by a completely different branch later, rather than each branch maintaining its own, isolated, useless cache.

## Memoization as this course\'s bridge into Dynamic Programming

\`\`\`
Overlapping subproblems: the same smaller subproblem (like fib(28))
  is needed by multiple different larger subproblems

Optimal substructure: a problem's answer can be built directly from
  the answers to its smaller subproblems (fib(n) = fib(n-1) + fib(n-2))

Both properties present → memoization applies, and the problem is a
  genuine dynamic programming problem
\`\`\`

The two properties that made memoization work for Fibonacci — the same smaller subproblem being needed repeatedly (overlapping subproblems), and a problem\'s answer being directly computable from its smaller subproblems\' answers (optimal substructure) — are precisely the two defining properties this course\'s later Dynamic Programming module opens with. Memoization, the technique this lesson introduced as a fix for one specific recursive function, is one of the two standard ways of actually implementing a dynamic programming solution (the other, tabulation, building the same cache bottom-up instead of top-down recursively, is covered in that later module). Recognizing that recursion plus a results cache is already, in substance, a dynamic programming technique is the direct, concrete bridge between this module and that one.`,

    contentHi: `## Sudhaar confirm karna: call counts ko seedhe compare karna

\`\`\`
Naive fib(30):     call count exponentially badhta hai — ek million
                    se kaafi zyaada total calls ki jaati hain

Memoized fib(30):  0 se 30 tak n ki har alag value bilkul ek baar
                    gani jaati hai — zyaada se zyaada 31 asli
                    computations, plus har us call ke liye ek chhota,
                    constant tadaad ke cache checks jo dohraav hoti

\`\`\`

Ye seedhe naapa jaane laayak hai, sirf theoretical nahi: ek counter jodna jo naive version par har call par increment hota hai, aur ek alag counter jo sirf tab increment hota hai jab memoized version asal mein kuch naya ganta hai (ek cached value return karne ke ulta), naive version ki count \`n\` ke saath vasfotaka roop se badhte hue darsata hai, jabki memoized version ki asli-computation count sirf linearly badhti hai, bilkul \`n\` khud se mel khaate hue. Memoized function abhi bhi recursive DIKHTA hai, aur ye abhi bhi technically un values ke liye function calls karta hai jinhe ye pehle se cache kar chuka hai — par un calls ka adhikaansh hissa ab ek akela, sasta \`O(1)\` cache lookup karta hai aur turant return hota hai, unke neeche aur branching recursion trigger karne ke bajaye.

## Cache shared hona chahiye, prati-call dobara na banaayi jaani chahiye, kyun

\`\`\`js
function fibBroken(n) {
  const cache = new Map(); // har akeli call ek BILKUL-NAYA, khaali cache
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n); // hamesha khaali — kabhi asal mein hit nahi hota
  const result = fibBroken(n - 1) + fibBroken(n - 2); // recursive calls bhi ye cache share nahi karti
  cache.set(n, result);
  return result;
}
\`\`\`

Ek sach mein aam galti cache ko function body ke ANDAR banaana hai use recursive calls tak paas kiye bina, ya har call par ek taaza banaana — ye memoization ko poori tarah haraata hai, kyunki har call apna khud ka private, khaali cache paakar khatam hota hai jise koi doosri call kabhi dekh ya faayda utha nahi sakti. Theek version ka \`cache\` parameter, ek default value \`new Map()\` ke saath sirf bilkul pehli, sabse bahari call ke liye di gayi, khaas taur par har recursive call mein explicitly paas ki jaati hai taaki wo sab bilkul usi cache object ko share karein — ye wo hai jo ek value ko jo recursion ki ek branch mein gehraayi mein gani gayi thi baad mein ek poori tarah alag branch dwara mile aur dobara istemal ho sake, har branch apna khud ka, alag-thalag, bekaar cache maintain karne ke bajaye.

## Memoization is course ke Dynamic Programming mein pul ki tarah

\`\`\`
Overlapping subproblems: wahi chhota subproblem (jaisa fib(28)) kayi
  alag bade subproblems dwara zaruri hai

Optimal substructure: ek problem ka jawaab seedhe iske chhote
  subproblems ke jawaabon se banaaya jaa sakta hai (fib(n) = fib(n-1) + fib(n-2))

Dono properties maujood → memoization lagu hota hai, aur problem ek
  asli dynamic programming problem hai
\`\`\`

Do properties jo memoization ko Fibonacci ke liye kaam karati hain — wahi chhota subproblem baar-baar zaruri hona (overlapping subproblems), aur ek problem ka jawaab seedhe iske chhote subproblems ke jawaabon se computable hona (optimal substructure) — bilkul wo do defining properties hain jinke saath is course ka baad ka Dynamic Programming module shuru hota hai. Memoization, wo technique jise is lesson ne ek khaas recursive function ke fix ki tarah introduce kiya, dynamic programming solution ko asal mein lagu karne ke do standard tarikon mein se ek hai (doosra, tabulation, wahi cache ko bottom-up banaata hai top-down recursively ke bajaye, us baad ke module mein cover kiya gaya hai). Ye pehchaanna ki recursion plus ek results cache pehle se, saar mein, ek dynamic programming technique hai is module aur us doosre ke beech seedha, thos pul hai.`,

    examples: [
      {
        title: 'Broken: naive recursive Fibonacci, recomputing identical subproblems',
        titleHi: 'Toota: naive recursive Fibonacci, identical subproblems dobara gante hue',
        code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
        codeJs: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
console.log(fib(30)); // takes a genuinely noticeable amount of time
// O(2^n) — this course's Module 1 already established why`,
        codeTs: `function fib(n: number): number {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// fully valid TypeScript — the exponential cost is architectural`,
        output: `fib(30) eventually returns 832040, but takes a genuinely
noticeable amount of time due to the enormous number of repeated,
identical subproblem computations.`,
        explain: 'The same smaller values (like fib(28), fib(20), fib(2)) are recomputed from scratch an enormous number of times across the branching call tree, exactly as this course\'s Module 1 lesson demonstrated.',
        explainHi: 'Wahi chhoti values (jaisa \`fib(28)\`, \`fib(20)\`, \`fib(2)\`) shuru se ek vishaal tadaad mein dobara gani jaati hain poore branching call tree mein, bilkul jaisa is course ke Module 1 lesson ne darsaaya.',
      },
      {
        title: 'Fixed: memoization, caching each result the first time it is computed',
        titleHi: 'Theek: memoization, har nateeje ko pehli baar jab ye gana jaata hai cache karte hue',
        code: `if (cache.has(n)) return cache.get(n);
const result = fib(n - 1, cache) + fib(n - 2, cache);
cache.set(n, result);`,
        codeJs: `function fib(n, cache = new Map()) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n);
  const result = fib(n - 1, cache) + fib(n - 2, cache);
  cache.set(n, result);
  return result;
}
console.log(fib(30)); // returns almost instantly`,
        codeTs: `function fib(n: number, cache: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n) as number;
  const result = fib(n - 1, cache) + fib(n - 2, cache);
  cache.set(n, result);
  return result;
}`,
        outputJs: `fib(30) returns the identical 832040, almost instantly — each
distinct value from 0 to 30 is genuinely computed exactly once.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The cache, shared across every recursive call via the parameter, ensures each distinct value of n is genuinely computed only once, regardless of how many times it is requested across the tree.',
        explainHi: 'Cache, parameter ke zariye har recursive call ke aar-paar shared, sunishchit karta hai ki \`n\` ki har alag value sach mein sirf ek baar gani jaati hai, chahe ye poore tree mein kitni bhi baar maangi jaaye.',
      },
      {
        title: 'Confirming the improvement by counting genuine computations',
        titleHi: 'Asli computations ganke sudhaar confirm karna',
        code: `let computeCount = 0;
// increments only inside the "not yet cached" branch`,
        codeJs: `function fibCounted(n, cache = new Map()) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n);
  computeCount++;
  const result = fibCounted(n - 1, cache) + fibCounted(n - 2, cache);
  cache.set(n, result);
  return result;
}
let computeCount = 0;
fibCounted(30);
console.log(computeCount); // roughly 30, not millions`,
        codeTs: `let computeCount = 0;
function fibCounted(n: number, cache: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n) as number;
  computeCount++;
  const result = fibCounted(n - 1, cache) + fibCounted(n - 2, cache);
  cache.set(n, result);
  return result;
}`,
        outputJs: `computeCount ends up close to 30, confirming directly that each
distinct value of n was genuinely computed only once, rather than
taking this improvement on faith.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Counting only genuine, non-cached computations directly confirms the O(n) improvement over the naive version\'s exponential call count.',
        explainHi: 'Sirf asli, na-cached computations ganna seedhe naive version ki exponential call count ke saapeksh \`O(n)\` sudhaar confirm karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function fib(n) {
  return fib(n - 1) + fib(n - 2); // no cache at all
}`,
        right: `function fib(n, cache = new Map()) {
  if (cache.has(n)) return cache.get(n);
  // ... compute and cache.set(n, result)
}`,
        why: 'Without a cache, identical subproblems are recomputed from scratch every single time they are needed, producing the exact O(2^n) blowup this course\'s Module 1 lesson demonstrated.',
        whyHi: 'Ek cache ke bina, identical subproblems shuru se dobara gani jaati hain har akeli baar jab unhe chahiye, bilkul wo \`O(2^n)\` blowup banaate hue jise is course ke Module 1 lesson ne darsaaya.',
      },
      {
        wrong: `function fib(n) {
  const cache = new Map(); // a NEW, empty cache created every single call
  ...
}`,
        right: `function fib(n, cache = new Map()) {
  // cache is passed through to every recursive call, staying shared
  ...
}`,
        why: 'Creating a fresh cache inside the function body means each call gets its own private, empty cache — no call can ever see or benefit from another call\'s cached results.',
        whyHi: 'Function body ke andar ek taaza cache banaana matlab hai har call ko apna khud ka private, khaali cache milta hai — koi bhi call kabhi kisi doosri call ke cached nateejon ko dekh ya faayda utha nahi sakti.',
      },
      {
        wrong: `if (cache.has(n)) return cache.get(n);
const result = fib(n - 1, cache) + fib(n - 2, cache);
// forgot cache.set(n, result) — the computed value is never actually cached`,
        right: `const result = fib(n - 1, cache) + fib(n - 2, cache);
cache.set(n, result); // REQUIRED — actually store the result before returning
return result;`,
        why: 'Checking the cache is only half of memoization — a computed result must also be explicitly stored, or future requests for the same value will keep recomputing it anyway.',
        whyHi: 'Cache check karna memoization ka sirf aadha hissa hai — ek gani gayi nateeja bhi explicitly store ki jaani chahiye, warna usi value ke liye bhavishya ki requests anyway ise dobara ganti rahengi.',
      },
    ],

    realWorld: [
      {
        en: '**Memoization is one of the single most commonly asked follow-up techniques in real technical interviews after a naive recursive solution is produced**, specifically testing whether a candidate recognizes overlapping subproblems.',
        hi: '**Memoization asli technical interviews mein ek naive recursive solution banaane ke baad sabse aam poochhe jaane waali follow-up techniques mein se ek hai**, khaas taur par ye test karte hue ki kya ek candidate overlapping subproblems pehchaanta hai.',
      },
      {
        en: '**Real web frameworks and libraries (React\'s useMemo, for instance) apply this exact same underlying principle — caching a computation\'s result to avoid redoing identical work — to a completely different domain.**',
        hi: '**Asli web frameworks aur libraries (React ka \`useMemo\`, misal ke taur par) bilkul isi underlying siddhaant ko lagu karte hain — ek computation ke nateeje ko cache karna identical kaam dobara karne se bachne ke liye — ek poori tarah alag domain mein.**',
      },
      {
        en: '**Memoization and tabulation are the two genuinely standard, universally taught implementation strategies for dynamic programming**, covered in essentially every serious algorithms curriculum.',
        hi: '**Memoization aur tabulation dynamic programming ke liye do sach mein standard, universal roop se sikhaayi jaane waali implementation strategies hain**, lagbhag har gambhir algorithms curriculum mein cover ki jaati hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does memoization reduce naive recursive Fibonacci from O(2^n) to O(n), and specifically what condition must be true about a problem for memoization to provide this kind of improvement?',
        qHi: 'Memoization naive recursive Fibonacci ko \`O(2^n)\` se \`O(n)\` tak kyun kam karta hai, aur khaas taur par ek problem ke baare mein kya condition sach honi chahiye memoization ke is tarah ka sudhaar pradaan karne ke liye?',
        a: 'Naive recursive Fibonacci\'s O(2^n) cost arises because its call tree genuinely contains an exponential number of individual calls, but critically, the vast majority of those calls are asking for the answer to one of only n genuinely distinct values (0 through n), with each specific value being requested an enormous number of times across different branches of the tree. Memoization exploits this specific fact directly: by checking, at the start of every call, whether the requested value has already been computed and stored in a shared cache, and returning that stored value immediately if so, it ensures that only the very FIRST request for each distinct value ever actually triggers the underlying computation (and its own further recursive calls); every subsequent request for that same value, no matter where in the tree it occurs, is satisfied by a single, cheap O(1) cache lookup instead. Since there are only n distinct values ever genuinely needed, and each one is now computed at most once, the total number of genuine computations performed drops from the exponential count of the naive version down to a number directly proportional to n, with cache lookups adding only a small, constant amount of additional work per call. For memoization to provide this kind of improvement on a different problem, that problem must exhibit the same underlying property Fibonacci does: overlapping subproblems, meaning the recursive structure of the problem causes the same specific smaller subproblem to genuinely be needed and requested multiple times across different branches of the recursion. If a problem\'s recursive calls never actually request the same specific input more than once — if every subproblem, once computed, is never needed again anywhere else in the recursion — a cache would simply sit unused, since there would never be a repeat request for it to satisfy, and memoization would add the overhead of maintaining the cache without providing any actual benefit in return.',
        aHi: 'Naive recursive Fibonacci ki \`O(2^n)\` keemat isliye uthti hai kyunki iska call tree sach mein exponential tadaad ki akeli calls rakhta hai, par mahatvapoorn baat, un calls ka adhikaansh hissa sirf \`n\` sach mein alag values (0 se \`n\` tak) mein se ek ke jawaab ke liye poochh raha hai, har khaas value tree ki alag branches mein ek vishaal tadaad mein maangi jaa rahi hai. Memoization is khaas tathya ka seedhe istemal karta hai: har call ki shuruaat mein check karke ki kya maangi gayi value pehle se gani aur ek shared cache mein store ki gayi hai, aur agar aisa hai toh us stored value ko turant return karke, ye sunishchit karta hai ki sirf har alag value ke liye bilkul PEHLI request asal mein underlying computation (aur iski apni aur recursive calls) trigger karti hai; usi value ke liye har baad ki request, tree mein kahin bhi ye ho, ek akele, saste \`O(1)\` cache lookup se poori ki jaati hai iske bajaye. Kyunki sirf \`n\` alag values kabhi sach mein zaruri hain, aur har ek ab zyaada se zyaada ek baar gani jaati hai, asal mein perform ki gayi asli computations ki total tadaad naive version ki exponential count se \`n\` ke seedhe anupaat mein ek tadaad tak girati hai, cache lookups prati-call sirf ek chhoti, constant atirikt kaam jodte hue. Memoization ke ek alag problem par is tarah ka sudhaar pradaan karne ke liye, us problem ko wahi underlying property darsaani chahiye jo Fibonacci darsata hai: overlapping subproblems, matlab problem ki recursive structure ka kaaran banta hai ki wahi khaas chhota subproblem sach mein recursion ki alag branches mein kayi baar zaruri aur maanga jaata hai. Agar ek problem ki recursive calls kabhi asal mein wahi khaas input ek se zyaada baar nahi maangti — agar har subproblem, ek baar gana jaana, kabhi kahin aur recursion mein dobara zaruri nahi hai — ek cache bas bina-istemal baithi rahegi, kyunki ise poora karne ke liye kabhi ek dohraayi hui request nahi hogi, aur memoization cache maintain karne ka overhead jodegi badle mein koi asli faayda pradaan kiye bina.',
      },
      {
        q: 'Why must the cache be shared across all recursive calls rather than created fresh inside each call, and what specifically breaks if a new cache is created every time?',
        qHi: 'Cache ko sab recursive calls ke aar-paar share kyun kiya jaana chahiye har call ke andar taaza banaaye jaane ke bajaye, aur agar har baar ek naya cache banaaya jaaye toh khaas taur par kya tootta hai?',
        a: 'Memoization\'s entire benefit comes from a value computed by one specific call being available for a completely different call, potentially in an entirely separate branch of the recursion tree, to look up and reuse later without recomputing it. This is only possible if all of these calls are reading from, and writing to, the exact same underlying cache object — a value stored by one call must be visible to another call for the memoization to have any effect at all. If a fresh, empty cache is instead created inside the function body itself, every single invocation of the function, including every one of its own recursive calls, creates its own entirely separate, private cache that no other invocation has any way of ever seeing or accessing. Under this broken setup, a specific call might indeed check "have I already computed this value in MY OWN cache" and correctly find nothing there, since it is only checking its own, freshly created, and therefore always-empty cache — it would never discover that a sibling call, or a call from an entirely different branch of the recursion, already computed that exact same value moments earlier in ITS OWN separate cache. This means the check-the-cache-first logic still executes without producing any error, but it can never actually succeed in finding a previously computed value, since no cache instance in this broken version is ever shared between more than one single call; every single request for every value, even ones requested repeatedly throughout the tree, ends up triggering a full recomputation exactly as if no caching logic were present in the code at all, silently defeating the entire purpose of adding memoization in the first place.',
        aHi: 'Memoization ka poora faayda is baat se aata hai ki ek khaas call dwara gani gayi ek value ek poori tarah alag call ke liye upalabdh hai, sambhaavit roop se recursion tree ki ek poori tarah alag branch mein, baad mein dekhne aur dobara istemal karne ke liye ise dobara gane bina. Ye sirf tab mumkin hai jab in sab calls mein se har ek bilkul usi underlying cache object se padh aur likh rahi hai — ek call dwara store ki gayi value ek doosri call ko drishyaman honi chahiye taaki memoization ka koi bhi asar ho. Agar ek taaza, khaali cache iske bajaye function body ke andar khud banaayi jaati hai, function ka har akela invocation, iski apni har recursive call sameet, apna khud ka poori tarah alag, private cache banaata hai jise koi doosra invocation kabhi dekhne ya access karne ka koi tarika nahi rakhta. Is toote setup ke neeche, ek khaas call sach mein check kar sakti hai "kya maine ye value APNE KHUD KE cache mein pehle se gani hai" aur sahi tarike se wahaan kuch nahi paati, kyunki ye sirf apna khud ka, taaza banaaya gaya, aur isliye hamesha-khaali cache check kar rahi hai — ise kabhi pata nahi chalega ki ek sibling call, ya recursion ki ek poori tarah alag branch se ek call, pehle hi bilkul wahi value gan chuki thi kuch pal pehle APNE KHUD KE alag cache mein. Iska matlab hai check-the-cache-first logic bina koi error banaaye phir bhi execute hoti hai, par ye asal mein kabhi pehle gani gayi value dhoondhne mein safal nahi ho sakti, kyunki is toote version mein koi bhi cache instance kabhi ek se zyaada akeli call ke beech share nahi hota; har value ke liye har akeli request, poore tree mein baar-baar maangi gayi bhi, ek poori dobara-computation trigger karne mein khatam hoti hai bilkul jaise code mein koi caching logic maujood hi na ho, chupchaap shuru mein hi memoization jodne ke poore point ko haraate hue.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (no cache) and fixed (memoized) fib functions from this lesson. Time both against fib(35) using console.time/console.timeEnd, and confirm the memoized version is dramatically faster.',
        taskHi: 'Is lesson ka toota (koi cache nahi) aur theek (memoized) \`fib\` functions dono banao. Dono ko \`fib(35)\` ke khilaaf \`console.time\`/\`console.timeEnd\` istemal karke time karo, aur confirm karo ki memoized version naatakiya roop se tez hai.',
        hint: 'Consider setting a reasonable timeout or being ready to interrupt the naive version if you push n high enough, since its runtime grows extremely quickly.',
        hintHi: 'Ek vaajbi timeout set karne ya toote version ko interrupt karne ke liye taiyaar rehne par vichaar karo agar tum \`n\` ko kaafi bada karte ho, kyunki iska runtime bahut tezi se badhta hai.',
      },
      {
        task: 'Add the compute-counting instrumentation from this lesson\'s third example to the memoized version, and separately add a similar counter to the naive version. Compare the two counts for fib(20) directly.',
        taskHi: 'Is lesson ke teesre example ka compute-counting instrumentation memoized version mein jodo, aur alag se naive version mein ek samaan counter jodo. \`fib(20)\` ke liye dono counts ko seedhe compare karo.',
        hint: 'The naive version\'s count should roughly match the total number of nodes in its call tree, while the memoized version\'s count should be close to n itself.',
        hintHi: 'Naive version ki count lagbhag iske call tree mein nodes ki total tadaad se mel khaani chahiye, jabki memoized version ki count \`n\` khud ke kareeb honi chahiye.',
      },
      {
        task: 'Deliberately introduce the broken-cache mistake (creating a new Map inside the function body instead of passing it through) into the memoized version. Confirm, using the compute-counting instrumentation, that this "fix" provides no actual improvement over the naive version.',
        taskHi: 'Memoized version mein jaan-boojhkar broken-cache galti introduce karo (function body ke andar ek naya \`Map\` banaana ise paas karne ke bajaye). Compute-counting instrumentation istemal karke confirm karo ki ye "fix" naive version se koi asli sudhaar pradaan nahi karta.',
        hint: 'Compare the compute count of this broken version directly against both the correctly memoized version and the fully naive version to see exactly where it actually lands.',
        hintHi: 'Is toote version ki compute count ko seedhe dono sahi tarike se memoized version aur poori tarah naive version ke khilaaf compare karo ye dekhne ke liye ki ye asal mein kahaan utarti hai.',
      },
    ],

    keyTakeaways: [
      'Memoization caches a recursive function\'s results the first time each distinct input is computed, so every subsequent request for the same input is answered by an O(1) cache lookup instead of recomputation.',
      'This transforms naive recursive Fibonacci from O(2^n), established in this course\'s Module 1 lesson, down to O(n), since only n genuinely distinct values are ever actually computed.',
      'The cache must be a single, shared object passed through to every recursive call — creating a fresh cache inside the function body gives each call its own private, useless cache and provides no actual benefit.',
      'Checking the cache is only half of memoization — a newly computed result must also be explicitly stored, or future requests for the same value will keep recomputing it regardless.',
      'Memoization applies specifically when a problem has overlapping subproblems (the same smaller subproblem is genuinely needed multiple times) — without this property, a cache would sit unused.',
      'Memoization, together with the closely related property of optimal substructure, is one of the two standard techniques for implementing dynamic programming, directly bridging this module into this course\'s later DP module.',
    ],
    keyTakeawaysHi: [
      'Memoization ek recursive function ke nateejon ko cache karta hai jab har alag input pehli baar gana jaata hai, isliye usi input ke liye har baad ki request ek \`O(1)\` cache lookup se jawaab di jaati hai dobara-computation ke bajaye.',
      'Ye naive recursive Fibonacci ko \`O(2^n)\` se, jo is course ke Module 1 lesson mein sthaapit kiya gaya, \`O(n)\` tak badalta hai, kyunki sirf \`n\` sach mein alag values kabhi asal mein gani jaati hain.',
      'Cache ek akela, shared object hona chahiye jo har recursive call mein paas kiya jaata hai — function body ke andar ek taaza cache banaana har call ko apna private, bekaar cache deta hai aur koi asli faayda pradaan nahi karta.',
      'Cache check karna memoization ka sirf aadha hissa hai — ek naya gana gaya nateeja bhi explicitly store kiya jaana chahiye, warna usi value ke liye bhavishya ki requests bhale bhi ise dobara ganti rahengi.',
      'Memoization khaas taur par tab lagu hota hai jab ek problem mein overlapping subproblems hain (wahi chhota subproblem sach mein kayi baar zaruri hai) — is property ke bina, ek cache bina-istemal baithi rahegi.',
      'Memoization, kareeb se judi optimal substructure ki property ke saath, dynamic programming lagu karne ke do standard techniques mein se ek hai, is module ko is course ke baad ke DP module se seedhe jodte hue.',
    ],
  },
];
