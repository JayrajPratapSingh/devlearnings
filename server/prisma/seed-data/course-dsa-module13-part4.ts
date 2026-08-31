/**
 * DSA Complete Course — Module 13: Bit Manipulation & Math Essentials, lesson 4.
 *
 * Number-theory primitives that show up constantly in interviews and that a
 * self-taught learner almost always misses: Euclid's GCD (and why the modulo
 * version is exponentially faster than counting down), LCM computed without
 * overflowing, the Sieve of Eratosthenes, and the smallest-prime-factor sieve
 * that turns repeated factorisation into O(log n) per query.
 *
 * Broken example: GCD by testing every integer from min(a, b) downwards, and
 * primality by trial-dividing every number up to n. Both are correct and both
 * are unusably slow — the GCD of two 9-digit numbers takes hundreds of
 * millions of iterations instead of a few dozen at most.
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

export const DSA_MODULE_13_PART4: CourseLesson[] = [
  {
    slug: 'number-theory-gcd-sieve-factorisation',
    title: 'Number Theory Essentials: GCD, LCM, Sieve, and Factorisation',
    titleHi: 'Number Theory Ki Buniyaad: GCD, LCM, Sieve, Aur Factorisation',
    description: 'Finding the greatest common divisor by testing every number from the smaller input downwards until one divides both, and finding primes by trial-dividing each candidate. Both are correct. For two nine-digit numbers the first takes hundreds of millions of iterations to produce an answer that a different method reaches in a few dozen at most.',
    descriptionHi: 'Greatest common divisor dhoondhna chhote input se neeche har number test karke jab tak ek dono ko divide na kare, aur primes dhoondhna har candidate ko trial-divide karke. Dono sahi hain. Do nau-ankon waale numbers ke liye pehla ek aisa jawaab banaane mein karodon iterations leta hai jispar ek doosra tarika zyaada se zyaada kuch dozen mein pahunch jaata hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 4,

    analogy: {
      en: '**Two ropes of different lengths, and finding the longest single measuring stick that measures both exactly.** The patient method is to start with a stick as long as the shorter rope and keep shortening it by one unit at a time, testing after every shortening whether it now divides both ropes exactly. It always works, and for ropes of a few metres it is fine. For ropes hundreds of kilometres long you will be shortening for a very long time. The clever method is a single observation about what the answer must satisfy: lay the shorter rope alongside the longer one as many times as it fits, and look at the leftover piece. Any stick that measures both ropes exactly must also measure that leftover exactly, because the leftover is just the long rope minus a whole number of short ropes. So the answer for the original pair is exactly the answer for the pair "shorter rope and leftover" — a strictly smaller problem, and you can keep replacing the pair with a smaller one until the leftover is nothing at all, at which point the rope in your hand is the answer. The reason this is so much faster is that each step does not shave off one unit; it throws away everything that fits, which typically cuts the numbers down by a large fraction at once. Separately, for the question "which of the first million lengths are indivisible", testing each one on its own repeats enormous amounts of work; it is far cheaper to walk the list once, and each time you meet a length you have not crossed out, cross out all its multiples in one sweep.',
      hi: '**Alag lambaayi ki do rassiyaan, aur wo sabse lambi ek naapne waali chhadi dhoondhna jo dono ko theek-theek naapti hai.** Dhairya waala tarika chhoti rassi jitni lambi chhadi se shuru karna hai aur ise ek-ek unit karke chhota karte rehna, har chhota karne ke baad test karte hue ki kya ye ab dono rassiyon ko theek-theek divide karti hai. Ye hamesha kaam karta hai, aur kuch meter ki rassiyon ke liye theek hai. Sau kilometre lambi rassiyon ke liye aap bahut lambe samay tak chhota karte rahoge. Chatur tarika ek akela avlokan hai ki jawaab ko kya poora karna chahiye: chhoti rassi ko lambi ke bagal mein jitni baar fit ho utni baar rakho, aur bache hue tukde ko dekho. Koi bhi chhadi jo dono rassiyon ko theek-theek naapti hai use us bache hue ko bhi theek-theek naapna hoga, kyunki bacha hua bas lambi rassi minus poori tadaad mein chhoti rassiyaan hai. Toh mool jodi ka jawaab bilkul "chhoti rassi aur bacha hua" jodi ka jawaab hai — ek sakhti se chhoti problem, aur aap jodi ko ek chhoti se badalte reh sakte ho jab tak bacha hua kuch bhi na ho, jis bindu par aapke haath mein jo rassi hai wahi jawaab hai. Wajah ki ye itna tez hai ye hai ki har step ek unit nahi kaatta; ye wo sab phenkta hai jo fit hota hai, jo aam taur par numbers ko ek saath ek bade hisse se kaat deta hai. Alag se, "pehli das laakh lambaayiyon mein se kaunsi avibhaajya hain" sawaal ke liye, har ek ko alag test karna bahut saara kaam dohraata hai; list par ek baar chalna aur har baar jab aap ek aisi lambaayi milte ho jise aapne kaata nahi, uske sab multiples ek sweep mein kaat dena kaafi sasta hai.',
    },

    simple: `**Start broken.** GCD by counting down, primes by trial division:

\`\`\`js
function gcdBrute(a, b) {
  for (let d = Math.min(a, b); d >= 1; d--) {     // test every candidate
    if (a % d === 0 && b % d === 0) return d;
  }
  return 1;
}
console.log(gcdBrute(48, 18));       // 6 — correct
console.log(gcdBrute(1000000007, 998244353));
// ...correct eventually, after ~10^9 iterations. This is not usable.

function primesBrute(n) {
  const out = [];
  for (let x = 2; x <= n; x++) {
    let isPrime = true;
    for (let d = 2; d * d <= x; d++) if (x % d === 0) { isPrime = false; break; }
    if (isPrime) out.push(x);
  }
  return out;                                      // O(n * sqrt(n))
}
\`\`\`

**The fix: Euclid — replace (a, b) with (b, a % b) until b is zero**

\`\`\`js
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];        // the whole algorithm
  }
  return a;
}
console.log(gcd(48, 18));                       // 6, in 3 steps
console.log(gcd(1000000007, 998244353));        // 1, in 9 steps (not ~10^9)

// LCM must divide FIRST, or the product overflows for large inputs
function lcm(a, b) {
  return (a / gcd(a, b)) * b;   // NOT (a * b) / gcd(a, b)
}
\`\`\`

**And the sieve: cross out multiples once, instead of testing each number**

\`\`\`js
function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;   // start at p*p, not 2p
  }
  return isPrime.reduce((acc, ok, i) => (ok ? (acc.push(i), acc) : acc), []);
}
console.log(sieve(30));   // [2,3,5,7,11,13,17,19,23,29]
\`\`\`

\`\`\`ts
function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function sieve(n: number): boolean[] {
  const isPrime = new Array<boolean>(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;
  }
  return isPrime;
}
\`\`\`

Euclid works because of one fact: **any number dividing both \`a\` and \`b\` also divides \`a % b\`**, since \`a % b\` is just \`a\` minus a whole number of \`b\`s. So \`gcd(a, b) === gcd(b, a % b)\`, and each step shrinks the pair dramatically rather than by one.`,

    simpleHi: `**Toote hue se shuru.** GCD ulti ginti se, primes trial division se:

\`\`\`js
function gcdBrute(a, b) {
  for (let d = Math.min(a, b); d >= 1; d--) {     // har candidate test karo
    if (a % d === 0 && b % d === 0) return d;
  }
  return 1;
}
console.log(gcdBrute(48, 18));       // 6 — sahi
console.log(gcdBrute(1000000007, 998244353));
// ...aakhirkaar sahi, ~10^9 iterations ke baad. Ye istemal ke laayak nahi.

function primesBrute(n) {
  const out = [];
  for (let x = 2; x <= n; x++) {
    let isPrime = true;
    for (let d = 2; d * d <= x; d++) if (x % d === 0) { isPrime = false; break; }
    if (isPrime) out.push(x);
  }
  return out;                                      // O(n * sqrt(n))
}
\`\`\`

**Fix: Euclid — (a, b) ko (b, a % b) se badlo jab tak b shunya na ho**

\`\`\`js
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];        // poora algorithm
  }
  return a;
}
console.log(gcd(48, 18));                       // 6, 3 steps mein
console.log(gcd(1000000007, 998244353));        // 1, 9 steps mein (~10^9 nahi)

// LCM ko PEHLE divide karna chahiye, warna bade inputs ke liye product overflow hota hai
function lcm(a, b) {
  return (a / gcd(a, b)) * b;   // (a * b) / gcd(a, b) NAHI
}
\`\`\`

**Aur sieve: har number test karne ke bajaye multiples ek baar kaato**

\`\`\`js
function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;   // p*p se shuru, 2p se nahi
  }
  return isPrime.reduce((acc, ok, i) => (ok ? (acc.push(i), acc) : acc), []);
}
console.log(sieve(30));   // [2,3,5,7,11,13,17,19,23,29]
\`\`\`

\`\`\`ts
function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function sieve(n: number): boolean[] {
  const isPrime = new Array<boolean>(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;
  }
  return isPrime;
}
\`\`\`

Euclid ek tathya ki wajah se kaam karta hai: **koi bhi number jo \`a\` aur \`b\` dono ko divide karta hai wo \`a % b\` ko bhi divide karta hai**, kyunki \`a % b\` bas \`a\` minus poori tadaad mein \`b\` hai. Toh \`gcd(a, b) === gcd(b, a % b)\`, aur har step jodi ko ek ke bajaye naatkiya roop se chhota karta hai.`,

    content: `## Why Euclid is O(log(min(a, b)))

\`\`\`
gcd(1071, 462)
  1071 % 462 = 147     -> gcd(462, 147)
   462 % 147 =  21     -> gcd(147, 21)
   147 %  21 =   0     -> gcd(21, 0) = 21        THREE steps

KEY FACT: after two steps, the larger number is at least HALVED.
  If b <= a/2, then a % b < b <= a/2 already.
  If b >  a/2, then a % b = a - b < a/2.
Either way, two steps at most halve a. Halving repeatedly is logarithmic.

Worst case is consecutive Fibonacci numbers (Lame's theorem), which still
gives about 4.8 * (number of decimal digits) steps — under 50 for numbers
that fit in a 64-bit integer.
\`\`\`

Compare with the countdown version, which does \`min(a, b)\` iterations: for nine-digit inputs that is 10^9 versus at most ~45 (usually far fewer — the example above lands in 9). This is the largest speed ratio of any single-line change in the entire course.

## The two LCM traps

\`\`\`
lcm(a, b) = a * b / gcd(a, b)      mathematically correct
                                    computationally dangerous

  a = 1_000_000_000, b = 999_999_998
  a * b = 9.99999998e17   > Number.MAX_SAFE_INTEGER (9.007e15)
  -> the product is already rounded before the division happens

FIX: divide first.  (a / gcd(a,b)) * b
  gcd divides a exactly, so a / gcd is an integer — no precision is lost,
  and the intermediate value is much smaller.

Also: gcd(0, 0) is 0, and lcm with a zero argument is 0. Guard if the
problem allows zeros.
\`\`\`

## The sieve, and the two details that matter

\`\`\`js
for (let p = 2; p * p <= n; p++) {          // (1) stop at sqrt(n)
  if (!isPrime[p]) continue;
  for (let m = p * p; m <= n; m += p) {     // (2) start at p*p, not 2*p
    isPrime[m] = false;
  }
}
\`\`\`

\`\`\`
(1) WHY p*p <= n:  if n = a*b with a <= b, then a <= sqrt(n). Any composite
    already has a factor at or below sqrt(n), so it has already been crossed
    out by the time p exceeds sqrt(n).

(2) WHY start at p*p:  every multiple k*p with k < p has a smaller prime
    factor (a factor of k), so it was crossed out during an earlier pass.
    Starting at 2*p is CORRECT but redundant work.

COST: n/2 + n/3 + n/5 + n/7 + ... = n * (sum of reciprocals of primes <= n)
                                  = O(n log log n)
That log-log factor is effectively a small constant: sieving to 10 million
takes well under a second, while trial-dividing each number does not.
\`\`\`

## Smallest-prime-factor: factorise in O(log n) per query

If a problem factorises many numbers, do not trial-divide each one. Store, for every value, its smallest prime factor while sieving:

\`\`\`js
function spfSieve(n) {
  const spf = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) {                       // i is prime
      for (let m = i; m <= n; m += i) if (spf[m] === 0) spf[m] = i;
    }
  }
  return spf;
}

function factorise(x, spf) {
  const factors = {};
  while (x > 1) {
    const p = spf[x];
    while (x % p === 0) { factors[p] = (factors[p] || 0) + 1; x /= p; }
  }
  return factors;
}
\`\`\`

Each division at least halves \`x\`, so factorisation is O(log n) after an O(n log log n) precomputation. This is the standard answer to "factorise 10^5 queries up to 10^6" — a question that defeats trial division.

## The primitives, and where each is the right answer

\`\`\`
gcd(a, b)                     Euclid                    O(log min(a,b))
lcm(a, b)                     (a/gcd)*b                 O(log min(a,b))
"is x prime?" once            trial divide to sqrt(x)   O(sqrt x)
"all primes up to n"          sieve                     O(n log log n)
factorise ONE number          trial divide to sqrt(x)   O(sqrt x)
factorise MANY numbers        spf sieve, then divide    O(n log log n) + O(log x)
gcd of a whole array          fold: arr.reduce(gcd)     O(n log max)

Interview tells:
  "simplify a fraction", "reduce to lowest terms"    -> gcd
  "two events repeat every a and b, when together"   -> lcm
  "count numbers coprime to n"                       -> factorise, then Euler phi
  "how many pairs share a common factor"             -> sieve + counting
  gcd of the whole array is also the answer to "can I make every element
  equal by adding/subtracting multiples of the differences".
\`\`\``,

    contentHi: `## Euclid O(log(min(a, b))) kyun hai

\`\`\`
gcd(1071, 462)
  1071 % 462 = 147     -> gcd(462, 147)
   462 % 147 =  21     -> gcd(147, 21)
   147 %  21 =   0     -> gcd(21, 0) = 21        TEEN steps

MUKHYA TATHYA: do steps ke baad, bada number kam se kam AADHA ho jaata hai.
  Agar b <= a/2, toh a % b < b <= a/2 pehle se hai.
  Agar b >  a/2, toh a % b = a - b < a/2.
Kisi bhi tarah, do steps zyaada se zyaada a ko aadha karte hain. Baar-baar
aadha karna logarithmic hai.

Worst case lagataar Fibonacci numbers hain (Lame ka theorem), jo abhi bhi
lagbhag 4.8 * (dashamlav ankon ki tadaad) steps deta hai — 64-bit integer mein
fit hone waale numbers ke liye 50 se kam.
\`\`\`

Ulti ginti waale version se tulna karo, jo \`min(a, b)\` iterations karta hai: nau-ankon waale inputs ke liye wo 10^9 versus lagbhag 30 hai. Ye poore course mein kisi bhi ek-line ke badlav ka sabse bada speed ratio hai.

## Do LCM jaal

\`\`\`
lcm(a, b) = a * b / gcd(a, b)      ganit ke hisaab se sahi
                                    computationally khatarnak

  a = 1_000_000_000, b = 999_999_998
  a * b = 9.99999998e17   > Number.MAX_SAFE_INTEGER (9.007e15)
  -> product division hone se pehle hi round ho jaata hai

FIX: pehle divide karo.  (a / gcd(a,b)) * b
  gcd a ko theek-theek divide karta hai, isliye a / gcd ek integer hai — koi
  precision nahi khoti, aur beech ki value kaafi chhoti hai.

Saath hi: gcd(0, 0) 0 hai, aur ek shunya argument waala lcm 0 hai. Guard karo
agar problem shunya allow karti hai.
\`\`\`

## Sieve, aur wo do vivaran jo maayne rakhte hain

\`\`\`js
for (let p = 2; p * p <= n; p++) {          // (1) sqrt(n) par ruko
  if (!isPrime[p]) continue;
  for (let m = p * p; m <= n; m += p) {     // (2) p*p se shuru, 2*p se nahi
    isPrime[m] = false;
  }
}
\`\`\`

\`\`\`
(1) p*p <= n KYUN:  agar n = a*b jahaan a <= b, toh a <= sqrt(n). Kisi bhi
    composite ke paas pehle se sqrt(n) par ya usse neeche ek factor hai, isliye
    jab tak p sqrt(n) se aage jaata hai wo pehle hi kaata jaa chuka hai.

(2) p*p se shuru KYUN:  har multiple k*p jahaan k < p ka ek chhota prime factor
    hai (k ka ek factor), isliye wo ek pichhle pass mein kaata gaya tha.
    2*p se shuru karna SAHI hai par fizool kaam hai.

COST: n/2 + n/3 + n/5 + n/7 + ... = n * (n tak ke primes ke reciprocals ka yog)
                                  = O(n log log n)
Wo log-log factor asal mein ek chhota constant hai: ek crore tak sieve karna
ek second se kaafi kam leta hai, jabki har number ko trial-divide karna nahi.
\`\`\`

## Smallest-prime-factor: prati query O(log n) mein factorise

Agar ek problem kayi numbers factorise karti hai, har ek ko trial-divide mat karo. Sieve karte waqt har value ke liye uska sabse chhota prime factor store karo:

\`\`\`js
function spfSieve(n) {
  const spf = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) {                       // i prime hai
      for (let m = i; m <= n; m += i) if (spf[m] === 0) spf[m] = i;
    }
  }
  return spf;
}

function factorise(x, spf) {
  const factors = {};
  while (x > 1) {
    const p = spf[x];
    while (x % p === 0) { factors[p] = (factors[p] || 0) + 1; x /= p; }
  }
  return factors;
}
\`\`\`

Har division kam se kam \`x\` ko aadha karta hai, isliye ek O(n log log n) precomputation ke baad factorisation O(log n) hai. Ye "10^6 tak ke 10^5 queries factorise karo" ka maanak jawaab hai — ek sawaal jo trial division ko haraa deta hai.

## Primitives, aur har ek kahaan sahi jawaab hai

\`\`\`
gcd(a, b)                      Euclid                    O(log min(a,b))
lcm(a, b)                      (a/gcd)*b                 O(log min(a,b))
"kya x prime hai?" ek baar     sqrt(x) tak trial divide  O(sqrt x)
"n tak sab primes"             sieve                     O(n log log n)
EK number factorise karo       sqrt(x) tak trial divide  O(sqrt x)
KAYI numbers factorise karo    spf sieve, phir divide    O(n log log n) + O(log x)
poore array ka gcd             fold: arr.reduce(gcd)     O(n log max)

Interview sanket:
  "ek fraction saral karo", "sabse kam roop mein laao"     -> gcd
  "do ghatnaayein har a aur b par dohraati hain, saath kab" -> lcm
  "n ke coprime numbers gino"                              -> factorise, phir Euler phi
  "kitni jodiyaan ek saanjha factor rakhti hain"           -> sieve + counting
  poore array ka gcd is sawaal ka bhi jawaab hai ki "kya main antaron ke
  multiples jodkar/ghataakar har element barabar bana sakta hoon".
\`\`\``,

    examples: [
      {
        title: 'Broken: GCD by counting down from min(a, b)',
        titleHi: 'Toota: min(a, b) se ulti ginti waala GCD',
        code: `for (let d = Math.min(a, b); d >= 1; d--)
  if (a % d === 0 && b % d === 0) return d;   // up to min(a, b) iterations`,
        codeJs: `function gcdBrute(a, b) {
  let steps = 0;
  for (let d = Math.min(a, b); d >= 1; d--) {
    steps++;
    if (a % d === 0 && b % d === 0) return { gcd: d, steps };
  }
  return { gcd: 1, steps };
}
console.log(gcdBrute(48, 18));
console.log(gcdBrute(1000000, 999999));   // coprime -> scans all the way down`,
        codeTs: `function gcdBrute(a: number, b: number): number {
  for (let d = Math.min(a, b); d >= 1; d--) if (a % d === 0 && b % d === 0) return d;
  return 1;
}`,
        outputJs: `{ gcd: 6, steps: 13 }
{ gcd: 1, steps: 999999 }`,
        outputTs: `// Same correct answers, same linear cost.`,
        explain: 'Coprime inputs are the worst case: the loop runs all the way to 1. A million steps for six-digit numbers, and a billion for nine-digit ones — correct but unusable.',
        explainHi: 'Coprime inputs worst case hain: loop poore 1 tak chalta hai. Chhah-ankon waale numbers ke liye das laakh steps, aur nau-ankon waalon ke liye ek arab — sahi par istemal ke laayak nahi.',
      },
      {
        title: 'Fixed: Euclid, and LCM that divides before multiplying',
        titleHi: 'Theek: Euclid, aur LCM jo guna se pehle divide karta hai',
        code: `while (b !== 0) [a, b] = [b, a % b];   // gcd(a,b) === gcd(b, a % b)
return (a / gcd(a, b)) * b;            // divide FIRST — the product can overflow`,
        codeJs: `function gcd(a, b) {
  let steps = 0;
  while (b !== 0) { [a, b] = [b, a % b]; steps++; }
  return { gcd: a, steps };
}
console.log(gcd(48, 18));
console.log(gcd(1000000, 999999));
console.log(gcd(1000000007, 998244353));

const g = (a, b) => { while (b !== 0) [a, b] = [b, a % b]; return a; };
const lcmSafe = (a, b) => (a / g(a, b)) * b;
const lcmNaive = (a, b) => (a * b) / g(a, b);
console.log('safe: ', lcmSafe(1000000000, 999999998));
console.log('naive:', lcmNaive(1000000000, 999999998));
console.log('MAX_SAFE_INTEGER:', Number.MAX_SAFE_INTEGER);`,
        codeTs: `function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}
function lcm(a: number, b: number): number { return (a / gcd(a, b)) * b; }`,
        outputJs: `{ gcd: 6, steps: 3 }
{ gcd: 1, steps: 2 }
{ gcd: 1, steps: 9 }
safe:  499999999000000000
naive: 499999999000000000
MAX_SAFE_INTEGER: 9007199254740991`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Nine steps instead of ~10^9 for nine-digit inputs. Both LCM forms agree here, but the naive one built an intermediate of 9.99e17 — well past MAX_SAFE_INTEGER — so it is relying on luck, and in a fixed-width integer language it would have overflowed outright.',
        explainHi: 'Nau-ankon waale inputs ke liye ~10^9 ke bajaye nau steps. Dono LCM roop yahaan sahmat hain, par naive ne 9.99e17 ka ek beech ka value banaya — MAX_SAFE_INTEGER se kaafi aage — isliye wo kismat par nirbhar hai, aur ek fixed-width integer language mein wo seedhe overflow hota.',
      },
      {
        title: 'Sieve, and the SPF sieve for repeated factorisation',
        titleHi: 'Sieve, aur baar-baar factorisation ke liye SPF sieve',
        code: `for (let m = p * p; m <= n; m += p) isPrime[m] = false;   // start at p*p
// spf[x] = smallest prime factor of x  ->  factorise by repeated division`,
        codeJs: `function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;
  }
  const out = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) out.push(i);
  return out;
}
console.log(sieve(30));
console.log('primes below 100000:', sieve(100000).length);

function spfSieve(n) {
  const spf = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) for (let m = i; m <= n; m += i) if (spf[m] === 0) spf[m] = i;
  }
  return spf;
}
function factorise(x, spf) {
  const f = {};
  while (x > 1) { const p = spf[x]; while (x % p === 0) { f[p] = (f[p] || 0) + 1; x /= p; } }
  return f;
}
const spf = spfSieve(1000);
console.log(factorise(360, spf));
console.log(factorise(997, spf));`,
        codeTs: `function sieve(n: number): number[] {
  const isPrime = new Array<boolean>(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;
  }
  const out: number[] = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) out.push(i);
  return out;
}`,
        outputJs: `[
   2,  3,  5,  7, 11,
  13, 17, 19, 23, 29
]
primes below 100000: 9592
{ '2': 3, '3': 2, '5': 1 }
{ '997': 1 }`,
        outputTs: `// Identical results, fully typed.`,
        explain: '360 = 2^3 * 3^2 * 5, and 997 is prime so it factorises to itself. After the O(n log log n) sieve, each factorisation costs O(log x) because every division at least halves x.',
        explainHi: '360 = 2^3 * 3^2 * 5, aur 997 prime hai isliye wo khud mein factorise hota hai. O(n log log n) sieve ke baad, har factorisation O(log x) kharch karta hai kyunki har division kam se kam x ko aadha karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// LCM that multiplies before dividing
function lcm(a, b) { return (a * b) / gcd(a, b); }
// a*b can exceed Number.MAX_SAFE_INTEGER before the division ever happens`,
        right: `function lcm(a, b) { return (a / gcd(a, b)) * b; }
// gcd divides a exactly, so a/gcd is an integer and the intermediate stays small`,
        why: 'The product of two large inputs loses precision (or overflows outright in a fixed-width integer language) before the division can bring it back down. Dividing first is exact because the GCD divides its argument with no remainder by definition.',
        whyHi: 'Do bade inputs ka product precision khoti hai (ya ek fixed-width integer language mein seedhe overflow hota hai) isse pehle ki division ise wapas neeche laaye. Pehle divide karna theek hai kyunki GCD paribhaasha se apne argument ko bina shesh ke divide karta hai.',
      },
      {
        wrong: `// sieve looping p all the way to n
for (let p = 2; p <= n; p++) {
  if (!isPrime[p]) continue;
  for (let m = p * p; m <= n; m += p) isPrime[m] = false;   // p*p overflows past n
}`,
        right: `for (let p = 2; p * p <= n; p++) {   // stop at sqrt(n)
  if (!isPrime[p]) continue;
  for (let m = p * p; m <= n; m += p) isPrime[m] = false;
}`,
        why: 'Every composite number has a prime factor at or below its square root, so once p exceeds sqrt(n) every composite is already crossed out and the outer loop is doing nothing but wasting time. It is not incorrect, but it turns a fast sieve into a needlessly slow one.',
        whyHi: 'Har composite number ke paas apne square root par ya usse neeche ek prime factor hai, isliye jab p sqrt(n) se aage jaata hai har composite pehle se kata hua hai aur outer loop samay barbaad karne ke alawa kuch nahi kar raha. Ye galat nahi hai, par ek tez sieve ko bevajah dheema bana deta hai.',
      },
      {
        wrong: `// assuming gcd(a, 0) is an error, or special-casing it
if (b === 0) throw new Error('bad input');`,
        right: `while (b !== 0) [a, b] = [b, a % b];
return a;                    // gcd(a, 0) === a — the loop handles it naturally`,
        why: 'Every integer divides zero, so the greatest common divisor of a and 0 is a itself, and the loop already returns exactly that by exiting immediately. Special-casing it adds a bug surface for no reason — and gcd(0, 0) = 0 is likewise the mathematically standard convention.',
        whyHi: 'Har integer shunya ko divide karta hai, isliye a aur 0 ka greatest common divisor khud a hai, aur loop turant nikalkar bilkul wahi return karta hai. Ise special-case karna bina wajah ek bug surface jodta hai — aur gcd(0, 0) = 0 bhi waise hi ganit ka maanak niyam hai.',
      },
    ],

    realWorld: [
      {
        en: '**Aspect ratios and UI layout** reduce a pixel size like 1920x1080 to 16:9 by dividing both by their GCD — the same one-line Euclid loop, used millions of times a day in image and video tooling.',
        hi: '**Aspect ratios aur UI layout** 1920x1080 jaise ek pixel size ko 16:9 mein badalte hain dono ko unke GCD se divide karke — wahi ek-line waala Euclid loop, image aur video tooling mein rozana laakhon baar istemal.',
      },
      {
        en: '**Scheduling repeating jobs** — one task every 12 minutes, another every 18 — needs the LCM to know when they collide, which is the standard way cron-style systems predict contention.',
        hi: '**Dohraane waale jobs schedule karna** — ek task har 12 minute, doosra har 18 — collide kab honge ye jaanne ko LCM chahiye, jo cron-jaise systems ke contention bhaanpne ka maanak tarika hai.',
      },
      {
        en: '**Cryptography** rests on the difficulty of factorising large numbers: RSA is secure precisely because no known method factorises a 2048-bit product quickly, while GCD on the same numbers is instant.',
        hi: '**Cryptography** bade numbers factorise karne ki kathinaai par tiki hai: RSA bilkul isliye surakshit hai kyunki koi gyaat tarika ek 2048-bit product ko jaldi factorise nahi karta, jabki un hi numbers par GCD turant hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain why Euclid\'s algorithm is correct and why it runs in logarithmic time.',
        qHi: 'Samjhaao ki Euclid ka algorithm sahi kyun hai aur ye logarithmic samay mein kyun chalta hai.',
        a: 'Correctness comes from one observation. Suppose some number d divides both a and b. Now a modulo b is by definition a minus some whole multiple of b. Since d divides a and d divides b, it divides any whole multiple of b, and therefore it divides the difference, which is a modulo b. So every common divisor of a and b is also a common divisor of b and a modulo b. The argument runs in the other direction too: if d divides b and divides a modulo b, then it divides a modulo b plus that whole multiple of b, which is a. So the two pairs have exactly the same set of common divisors, and in particular the same greatest one. That means replacing the pair a and b with the pair b and a modulo b preserves the answer, and since the second number strictly decreases every time, the process must terminate. It terminates when the second number is zero, and the greatest common divisor of a number and zero is that number itself, because everything divides zero. For the running time, the key is that each step does not decrease the numbers by a small amount but by a large fraction. Consider two consecutive steps and look at the larger value. If b is at most half of a, then a modulo b is smaller than b, which is already at most half of a. If instead b is more than half of a, then a divided by b is exactly one, so a modulo b equals a minus b, which is less than half of a. Either way, after at most two steps the larger number has been at least halved. A quantity that halves repeatedly reaches one in a logarithmic number of steps, so the algorithm is O of log of the smaller input. The precise worst case is consecutive Fibonacci numbers, and Lame\'s theorem gives a bound of roughly five times the number of decimal digits, which for any value fitting in a 64-bit integer is under fifty steps. Compare that with testing every candidate downward, which is linear in the input value — for nine-digit numbers that is the difference between a few dozen operations and a billion.',
        aHi: 'Shuddhata ek avlokan se aati hai. Maano koi number d a aur b dono ko divide karta hai. Ab a modulo b paribhaasha se a minus b ka koi poora multiple hai. Kyunki d a ko divide karta hai aur d b ko divide karta hai, ye b ke kisi bhi poore multiple ko divide karta hai, aur isliye ye antar ko divide karta hai, jo a modulo b hai. Toh a aur b ka har saanjha divisor b aur a modulo b ka bhi ek saanjha divisor hai. Tark doosri disha mein bhi chalta hai: agar d b ko divide karta hai aur a modulo b ko divide karta hai, toh ye a modulo b plus b ke us poore multiple ko divide karta hai, jo a hai. Toh dono jodiyon ke saanjha divisors ka bilkul wahi set hai, aur khaas taur par wahi sabse bada. Iska matlab hai ki jodi a aur b ko jodi b aur a modulo b se badalna jawaab surakshit rakhta hai, aur kyunki doosra number har baar sakhti se ghatta hai, prakriya ko khatam hona hi hai. Ye tab khatam hoti hai jab doosra number shunya hai, aur ek number aur shunya ka greatest common divisor khud wo number hai, kyunki har cheez shunya ko divide karti hai. Running time ke liye, mukhya baat ye hai ki har step numbers ko ek chhoti maatra se nahi balki ek bade hisse se ghataata hai. Do lagataar steps par vichaar karo aur badi value dekho. Agar b a ka zyaada se zyaada aadha hai, toh a modulo b b se chhota hai, jo pehle se a ka zyaada se zyaada aadha hai. Agar iske bajaye b a ke aadhe se zyaada hai, toh a divided by b bilkul ek hai, isliye a modulo b a minus b ke barabar hai, jo a ke aadhe se kam hai. Kisi bhi tarah, zyaada se zyaada do steps ke baad bada number kam se kam aadha ho chuka hai.',
      },
      {
        q: 'You need to factorise 100,000 numbers, each up to 1,000,000. How do you approach it, and why is trial division the wrong answer?',
        qHi: 'Aapko 1,000,000 tak ke 100,000 numbers factorise karne hain. Aap kaise approach karoge, aur trial division galat jawaab kyun hai?',
        a: 'Trial division factorises a single number in about the square root of that number, which for a million is a thousand operations. Multiply that by a hundred thousand queries and you get a hundred million operations, and in practice it is worse because each of those operations is a modulo, which is one of the slower arithmetic instructions. It will likely pass a generous time limit but it is the wrong shape of answer, because it repeats identical work: two queries for the same value, or for two values sharing factors, learn nothing from each other. The right approach is to precompute once and answer each query cheaply. Specifically, build a smallest-prime-factor table using a sieve. Walk from two up to the limit, and whenever you meet a value whose smallest prime factor is still unset, that value is prime, so you sweep through all of its multiples and set their smallest prime factor to it if it has not already been set by a smaller prime. That precomputation costs roughly n log log n, which for a million is a few million operations and takes a small fraction of a second, and it uses one integer array of size a million. Once you have that table, factorising any number becomes a loop: look up its smallest prime factor, divide it out as many times as it divides, record the exponent, and repeat on the quotient until you reach one. There is no searching and no modulo scanning — each iteration is a table lookup and a division. The number of divisions is bounded by the number of prime factors counted with multiplicity, and since the smallest possible prime factor is two, every division at least halves the value, so it is at most log base two of the number, about twenty steps for a million. Total cost is a few million for the sieve plus twenty per query, so two million for all the queries together, which is roughly fifty times less work than trial division and, more importantly, scales gracefully if the query count grows. The trade-off to state explicitly is memory: you are spending an array proportional to the maximum value to save time, which is the right trade when the maximum value is a million but not when it is ten to the eighteenth, where you would go back to trial division or reach for Pollard\'s rho.',
        aHi: 'Trial division ek akele number ko us number ke square root ke lagbhag mein factorise karta hai, jo ek million ke liye ek hazaar operations hai. Use ek laakh queries se guna karo aur aapko das crore operations milte hain, aur vyavhaar mein ye zyaada kharaab hai kyunki un operations mein se har ek ek modulo hai, jo dheeme arithmetic instructions mein se ek hai. Ye shaayad ek udaar time limit paas kar le par ye jawaab ka galat shape hai, kyunki ye samaan kaam dohraata hai: usi value ke liye do queries, ya factors share karti do values, ek doosre se kuch nahi seekhti. Sahi approach ek baar precompute karna aur har query ka sasta jawaab dena hai. Khaas taur par, ek sieve se ek smallest-prime-factor table banao. Do se seema tak chalo, aur jab bhi aap ek aisi value milte ho jiska smallest prime factor abhi unset hai, wo value prime hai, isliye aap iske sab multiples se guzarte ho aur unka smallest prime factor ise set karte ho agar wo pehle se ek chhote prime se set nahi hua. Wo precomputation lagbhag n log log n kharch karta hai, jo ek million ke liye kuch million operations hai aur ek second ka ek chhota hissa leta hai. Ek baar wo table mil gayi, kisi bhi number ko factorise karna ek loop ban jaata hai: iska smallest prime factor dekho, use jitni baar divide karta hai utni baar divide karo, exponent record karo, aur quotient par dohraao jab tak aap ek tak na pahuncho. Har division kam se kam value ko aadha karta hai, isliye ye zyaada se zyaada log base do hai. Batane laayak trade-off memory hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement gcd with Euclid and gcdBrute with the countdown. Instrument both with a step counter and compare on (48, 18), (1000000, 999999) and (1000000007, 998244353). Explain why coprime inputs are the worst case for the brute-force version.',
        taskHi: 'gcd ko Euclid se aur gcdBrute ko ulti ginti se implement karo. Dono ko ek step counter se instrument karo aur (48, 18), (1000000, 999999) aur (1000000007, 998244353) par compare karo. Samjhaao ki coprime inputs brute-force version ke liye worst case kyun hain.',
        hint: 'When the answer is 1 the countdown loop never returns early, so it runs min(a, b) times. Euclid takes 2 steps on the same input, because one modulo throws away almost everything.',
        hintHi: 'Jab jawaab 1 hai ulti ginti waala loop kabhi jaldi return nahi karta, isliye ye min(a, b) baar chalta hai. Euclid usi input par 2 steps leta hai, kyunki ek modulo lagbhag sab kuch phenk deta hai.',
      },
      {
        task: 'Implement sieve(n) and verify sieve(30) gives the 10 primes below 30 and sieve(100000).length is 9592. Then change the inner loop to start at 2*p instead of p*p, count the total number of writes in both versions, and confirm the results are identical.',
        taskHi: 'sieve(n) implement karo aur verify karo ki sieve(30) 30 se neeche ke 10 primes deta hai aur sieve(100000).length 9592 hai. Phir inner loop ko p*p ke bajaye 2*p se shuru karne ko badlo, dono versions mein kul writes gino, aur confirm karo ki nateeje samaan hain.',
        hint: 'Starting at 2*p is correct but re-crosses numbers already handled by smaller primes — every k*p with k < p has a prime factor below p. Expect roughly 30-40% more writes for no benefit.',
        hintHi: '2*p se shuru karna sahi hai par un numbers ko dobara kaatta hai jo chhote primes pehle sambhaal chuke — har k*p jahaan k < p ka ek prime factor p se neeche hai. Bina faayde ke lagbhag 30-40% zyaada writes expect karo.',
      },
      {
        task: 'Build spfSieve(1000000) once, then factorise 100000 random numbers with it and time it. Do the same with trial division up to sqrt(x). Verify both agree on factorise(360) = {2:3, 3:2, 5:1} and compare the total times.',
        taskHi: 'spfSieve(1000000) ek baar banao, phir isse 100000 random numbers factorise karo aur time karo. Wahi sqrt(x) tak trial division se karo. Verify karo ki dono factorise(360) = {2:3, 3:2, 5:1} par sahmat hain aur kul times compare karo.',
        hint: 'The sieve costs a few million operations up front and then about 20 per query; trial division costs about 1000 per query with no setup. The crossover is at roughly a few thousand queries — below that, trial division wins.',
        hintHi: 'Sieve shuru mein kuch million operations kharch karta hai aur phir prati query lagbhag 20; trial division bina setup ke prati query lagbhag 1000 kharch karta hai. Crossover lagbhag kuch hazaar queries par hai — usse neeche, trial division jeetta hai.',
      },
    ],

    keyTakeaways: [
      'gcd(a, b) === gcd(b, a % b), because anything dividing a and b also divides a % b. Loop until b is 0 and return a. O(log min(a,b)) — at most ~45 steps for 64-bit inputs where counting down takes a billion.',
      'gcd(a, 0) is a, and the loop returns that naturally by exiting immediately. No special case needed.',
      'Compute LCM as (a / gcd(a,b)) * b, never (a * b) / gcd(a,b). The product can exceed Number.MAX_SAFE_INTEGER before the division runs; dividing first is exact because gcd divides a with no remainder.',
      'Sieve of Eratosthenes: outer loop stops at p*p <= n (every composite has a factor <= sqrt(n)), inner loop starts at p*p (smaller multiples already have a smaller prime factor). O(n log log n).',
      'To factorise MANY numbers, precompute a smallest-prime-factor table with the sieve, then divide repeatedly: O(log x) per query instead of O(sqrt x). Trial division is only right for one-off queries.',
      'Every division during SPF factorisation at least halves x (the smallest prime is 2), which is why the per-query cost is logarithmic.',
      'Interview tells: "reduce a fraction" = gcd; "when do two cycles align" = lcm; "primes up to n" = sieve; "factorise many queries" = SPF sieve.',
    ],
    keyTakeawaysHi: [
      'gcd(a, b) === gcd(b, a % b), kyunki jo bhi a aur b ko divide karta hai wo a % b ko bhi divide karta hai. b ke 0 hone tak loop karo aur a return karo. O(log min(a,b)) — lagbhag 30 steps jahaan ulti ginti ek arab leti hai.',
      'gcd(a, 0) a hai, aur loop turant nikalkar swabhaavik roop se wahi return karta hai. Koi special case nahi chahiye.',
      'LCM ko (a / gcd(a,b)) * b ki tarah compute karo, kabhi (a * b) / gcd(a,b) ki tarah nahi. Product division chalne se pehle Number.MAX_SAFE_INTEGER paar kar sakta hai; pehle divide karna theek hai kyunki gcd a ko bina shesh ke divide karta hai.',
      'Sieve of Eratosthenes: outer loop p*p <= n par rukta hai (har composite ka ek factor <= sqrt(n) hai), inner loop p*p se shuru hota hai (chhote multiples ke paas pehle se ek chhota prime factor hai). O(n log log n).',
      'KAYI numbers factorise karne ko, sieve se ek smallest-prime-factor table precompute karo, phir baar-baar divide karo: prati query O(sqrt x) ke bajaye O(log x). Trial division sirf ek-baar ki queries ke liye sahi hai.',
      'SPF factorisation ke dauraan har division kam se kam x ko aadha karta hai (sabse chhota prime 2 hai), yahi wajah hai ki prati-query cost logarithmic hai.',
      'Interview sanket: "ek fraction saral karo" = gcd; "do cycles kab milte hain" = lcm; "n tak primes" = sieve; "kayi queries factorise karo" = SPF sieve.',
    ],
  },
];
