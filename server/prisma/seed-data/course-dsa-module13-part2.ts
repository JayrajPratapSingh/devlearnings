/**
 * DSA Complete Course — Module 13: Bit Manipulation, lesson 2.
 *
 * The standard bit tricks every interview draws on: test / set / clear / toggle
 * bit k; count set bits; isolate and clear the lowest set bit; test power of
 * two; and the XOR-based "find the missing / unique element" family. Builds on
 * this module's lesson 1 (operators, two's complement, XOR identities). Broken
 * example: counting the set bits of a 32-bit integer by looping all 32 positions
 * and testing each — always 32 iterations regardless of how few bits are set.
 * Fixed with Brian Kernighan's trick: n & (n - 1) clears the lowest set bit, so
 * looping "n = n & (n - 1); count++" runs exactly once per set bit. The lesson
 * also covers n & -n (isolate the lowest set bit), (n & (n - 1)) === 0 (power of
 * two), and using XOR to find a single missing number in O(1) space.
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

export const DSA_MODULE_13_PART2: CourseLesson[] = [
  {
    slug: 'bits-standard-tricks',
    title: 'Standard Bit Tricks: Set Bits, Lowest Bit, Power of Two',
    titleHi: 'Standard Bit Tricks: Set Bits, Lowest Bit, Power Of Two',
    description: 'Counting how many 1-bits are in a 32-bit integer by looping through all 32 positions and checking each with a shift and mask. It always does exactly 32 iterations, even for a number with a single set bit — when a different loop runs exactly as many times as there are set bits.',
    descriptionHi: 'Ek 32-bit integer mein kitne 1-bits hain ginna sab 32 positions ke through loop karke aur har ek ko ek shift aur mask se check karke. Ye hamesha bilkul 32 iterations karta hai, ek single set bit waale number ke liye bhi — jab ek alag loop bilkul utni baar chalta hai jitne set bits hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Counting the lit windows in a tall building at night.** The obvious method is to walk past every window on every floor and tally the lit ones — you check all of them even if only two are on. A faster method works if you have a way to switch off the lowest lit window from wherever you stand: turn off the lowest lit window, add one to your count, and repeat until the building is dark. Now you do exactly as much work as there are lit windows, which for a mostly-dark building is far less. The bitwise expression `n & (n - 1)` is precisely the "switch off the lowest lit window" move: subtracting 1 from a number flips its lowest 1-bit to 0 and turns every 0-bit below it into a 1, and ANDing that back with the original keeps only the bits they still share — which is the original number with its lowest 1-bit removed. Loop that until the number is zero and you have counted the set bits in as many steps as there were.',
      hi: '**Raat mein ek unchi building mein lit windows ginna.** Spasht method har floor par har window ke paas se chalna aur lit waalon ko tally karna hai — aap unhe sab check karte ho chahe sirf do on hon. Ek tez method kaam karta hai agar aapke paas jahaan bhi aap khade ho wahaan se sabse neeche wali lit window switch off karne ka tarika hai: sabse neeche wali lit window off karo, apni count mein ek jodo, aur dohraao jab tak building dark na ho jaaye. Ab aap bilkul utna kaam karte ho jitni lit windows hain, jo ek zyaadaatar-dark building ke liye kaafi kam hai. Bitwise expression `n & (n - 1)` bilkul "sabse neeche wali lit window off karo" move hai: ek number se 1 subtract karna iske sabse neeche ke 1-bit ko 0 flip karta hai aur iske neeche har 0-bit ko ek 1 mein badalta hai, aur use original ke saath wapas AND karna sirf wo bits rakhta hai jo wo abhi bhi share karte hain — jo original number hai iske sabse neeche ke 1-bit ke saath hataya gaya. Ise loop karo jab tak number zero na ho aur aapne set bits ko utne steps mein gina jitne the.',
    },

    simple: `**Start broken.** Count set bits by checking all 32 positions:

\`\`\`js
function countBitsSlow(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n >> i) & 1) count++;
  }
  return count;
}
countBitsSlow(0b1000);   // 1  — but 32 iterations to find one bit
\`\`\`

Always 32 iterations. Fine for a one-off, wasteful in a hot loop or when most numbers are sparse.

**The fix: Brian Kernighan — clear the lowest set bit each step**

\`\`\`js
function countBits(n) {
  n = n >>> 0;                 // view as unsigned so negatives don't loop forever
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);           // remove the lowest set bit
    count++;
  }
  return count;
}
countBits(0b1011);   // 3   — exactly 3 iterations
\`\`\`

\`\`\`ts
function countBits(n: number): number {
  n = n >>> 0;
  let count = 0;
  while (n !== 0) { n &= n - 1; count++; }
  return count;
}
\`\`\`

\`n - 1\` turns the lowest \`1\` bit into \`0\` and all the \`0\`s below it into \`1\`s. \`n & (n - 1)\` therefore keeps every bit except that lowest \`1\`. Each loop iteration removes exactly one set bit, so the loop runs (number of set bits) times, not 32.

**The single-bit operations, for a bit at position k**

\`\`\`js
const testBit  = (n, k) => (n >> k) & 1;        // 1 if bit k is set, else 0
const setBit   = (n, k) => n | (1 << k);        // force bit k to 1
const clearBit = (n, k) => n & ~(1 << k);       // force bit k to 0
const toggleBit= (n, k) => n ^ (1 << k);        // flip bit k
\`\`\`

**Lowest set bit, power of two, and the XOR "missing number"**

\`\`\`js
const lowestSetBit = (n) => n & -n;             // isolate the lowest 1 bit (e.g. 12 -> 4)
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;  // exactly one bit set

// numbers 0..n with exactly one missing; find it in O(1) extra space
function missingNumber(nums) {
  let x = nums.length;                          // start with n (the value not in 0..n-1 range coverage)
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
  return x;
}
missingNumber([3, 0, 1]);   // 2
\`\`\`

\`missingNumber\` XORs together all the indices \`0..n\` and all the array values. Every number that is both an index and a value cancels; the one index with no matching value survives. Same idea as lesson 1's "unique element", applied to a missing rather than a duplicated one.`,

    simpleHi: `**Toote hue se shuru.** Sab 32 positions check karke set bits gino:

\`\`\`js
function countBitsSlow(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n >> i) & 1) count++;
  }
  return count;
}
countBitsSlow(0b1000);   // 1  — par ek bit dhoondhne ko 32 iterations
\`\`\`

Hamesha 32 iterations. Ek one-off ke liye theek, ek hot loop mein ya jab adhikaansh numbers sparse hain faaltu.

**Fix: Brian Kernighan — har step lowest set bit clear karo**

\`\`\`js
function countBits(n) {
  n = n >>> 0;                 // unsigned dekho taaki negatives hamesha loop na karein
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);           // lowest set bit hatao
    count++;
  }
  return count;
}
countBits(0b1011);   // 3   — bilkul 3 iterations
\`\`\`

\`\`\`ts
function countBits(n: number): number {
  n = n >>> 0;
  let count = 0;
  while (n !== 0) { n &= n - 1; count++; }
  return count;
}
\`\`\`

\`n - 1\` sabse neeche ke \`1\` bit ko \`0\` mein aur iske neeche sab \`0\`s ko \`1\`s mein badalta hai. \`n & (n - 1)\` isliye us sabse neeche ke \`1\` ke alaava har bit rakhta hai. Har loop iteration bilkul ek set bit hataati hai, isliye loop (set bits ki tadaad) baar chalta hai, 32 nahi.

**Single-bit operations, position k par ek bit ke liye**

\`\`\`js
const testBit  = (n, k) => (n >> k) & 1;        // 1 agar bit k set hai, warna 0
const setBit   = (n, k) => n | (1 << k);        // bit k ko 1 force karo
const clearBit = (n, k) => n & ~(1 << k);       // bit k ko 0 force karo
const toggleBit= (n, k) => n ^ (1 << k);        // bit k flip karo
\`\`\`

**Lowest set bit, power of two, aur XOR "missing number"**

\`\`\`js
const lowestSetBit = (n) => n & -n;             // sabse neeche ke 1 bit ko isolate karo (jaise 12 -> 4)
const isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0;  // bilkul ek bit set

// numbers 0..n bilkul ek missing ke saath; ise O(1) extra space mein dhoondho
function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
  return x;
}
missingNumber([3, 0, 1]);   // 2
\`\`\`

\`missingNumber\` sab indices \`0..n\` aur sab array values ko saath XOR karta hai. Har number jo ek index aur ek value dono hai cancel hota hai; wo ek index jiski koi matching value nahi bachta hai. Lesson 1 ke "unique element" jaisa hi idea, ek missing par lagaya gaya na ki ek duplicated par.`,

    content: `## Why n & -n isolates the lowest set bit

\`\`\`
Two's complement: -n = ~n + 1. Flipping n inverts every bit; adding 1 then
carries up through the trailing 1s (which were the trailing 0s of n) until it
hits the first 0 (which was n's lowest 1). The result: -n matches n in exactly
the lowest set bit and is the complement of n everywhere else.

   n     = ...0101 1000
  ~n     = ...1010 0111
  ~n + 1 = ...1010 1000   (= -n)
  n & -n = ...0000 1000   -> just the lowest set bit
\`\`\`

This is the core operation of a Fenwick tree / binary indexed tree, where \`i & -i\` gives the size of the range a node covers.

## Iterating over the set bits (and over all subsets of a mask)

\`\`\`js
// visit each set bit's position
let m = mask;
while (m) {
  const bit = m & -m;             // lowest set bit as a value
  const pos = Math.log2(bit);     // its position (or use a de Bruijn table)
  // ... use pos ...
  m &= m - 1;                     // clear it
}

// visit every subset of 'mask' (including 0 and mask itself)
for (let sub = mask; ; sub = (sub - 1) & mask) {
  // ... use sub ...
  if (sub === 0) break;
}
\`\`\`

The submask enumeration \`(sub - 1) & mask\` is the trick that makes some bitmask DPs (next lesson) run in O(3^n) over all (mask, submask) pairs rather than O(4^n).

## Counting set bits for 0..n efficiently: another small DP

\`\`\`js
// dp[i] = popcount(i). Each i has one more set bit than i with its lowest bit removed.
function countBitsRange(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) dp[i] = dp[i & (i - 1)] + 1;
  return dp;   // dp[i] is the number of set bits in i, for all i in 0..n
}
\`\`\`

This is a one-line DP (Module 11) built directly on the Kernighan identity: \`popcount(i) = popcount(i with lowest bit cleared) + 1\`.

## The catalogue, with what each is for

\`\`\`
n & 1                     parity (bit 0)
n >> k, n << k            divide / multiply by 2^k (signed / for small n)
n & ((1 << k) - 1)        n mod 2^k  (low k bits)
n | (1 << k)              set bit k
n & ~(1 << k)             clear bit k
n ^ (1 << k)              toggle bit k
n & (n - 1)               n with lowest set bit removed  (loop -> popcount)
n & -n                    isolate the lowest set bit
(n & (n - 1)) === 0       power of two (for n > 0)
n & (n + 1) === 0         all low bits set (n is 2^k - 1)
x ^ y                     bits where x and y differ
XOR-fold a list           the XOR of the odd-count values
\`\`\`

## When bit tricks are worth it

\`\`\`
YES:  the problem is explicitly about bits / subsets / masks (bitmask DP,
      bitset, bloom filter, permission flags, packed structs).
YES:  a proven hot path where popcount or a power-of-two test is the bottleneck.
NO:   as a substitute for clear arithmetic in ordinary code — "n * 2" reads
      better than "n << 1" and the compiler/engine optimises it anyway.
\`\`\`

Modern engines already turn \`n / 2\` into a shift when they can prove \`n\` is a non-negative integer, so the micro-optimisation is rarely the point. The real value of bit tricks is expressing set operations (union, intersection, membership, subset iteration) in O(1) per word.`,

    contentHi: `## n & -n lowest set bit kyun isolate karta hai

\`\`\`
Two's complement: -n = ~n + 1. n ko flip karna har bit invert karta hai; phir 1
jodna trailing 1s (jo n ke trailing 0s the) ke through carry karta hai jab tak
ye pehle 0 (jo n ka lowest 1 tha) ko hit na kare. Result: -n n se bilkul lowest
set bit mein match karta hai aur baaki har jagah n ka complement hai.

   n     = ...0101 1000
  ~n     = ...1010 0111
  ~n + 1 = ...1010 1000   (= -n)
  n & -n = ...0000 1000   -> sirf lowest set bit
\`\`\`

Ye ek Fenwick tree / binary indexed tree ka core operation hai, jahaan \`i & -i\` ek node jo range cover karta hai uska size deta hai.

## Set bits par iterate karna (aur ek mask ke sab subsets par)

\`\`\`js
// har set bit ki position visit karo
let m = mask;
while (m) {
  const bit = m & -m;             // lowest set bit ek value ki tarah
  const pos = Math.log2(bit);     // iski position (ya ek de Bruijn table istemal karo)
  // ... pos istemal karo ...
  m &= m - 1;                     // ise clear karo
}

// 'mask' ka har subset visit karo (0 aur mask khud sameet)
for (let sub = mask; ; sub = (sub - 1) & mask) {
  // ... sub istemal karo ...
  if (sub === 0) break;
}
\`\`\`

Submask enumeration \`(sub - 1) & mask\` wo trick hai jo kuch bitmask DPs (agla lesson) ko sab (mask, submask) pairs par O(4^n) ke bajaye O(3^n) mein chalati hai.

## 0..n ke liye set bits efficiently ginna: ek aur chhota DP

\`\`\`js
// dp[i] = popcount(i). Har i ke, i se ek zyaada set bit hai iske lowest bit ke hataye jaane ke saath.
function countBitsRange(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) dp[i] = dp[i & (i - 1)] + 1;
  return dp;
}
\`\`\`

Ye ek one-line DP (Module 11) hai jo seedhe Kernighan identity par bana hai: \`popcount(i) = popcount(i lowest bit cleared ke saath) + 1\`.

## Catalogue, har ek kiske liye hai iske saath

\`\`\`
n & 1                     parity (bit 0)
n >> k, n << k            2^k se divide / multiply (signed / chhote n ke liye)
n & ((1 << k) - 1)        n mod 2^k  (low k bits)
n | (1 << k)              bit k set karo
n & ~(1 << k)             bit k clear karo
n ^ (1 << k)              bit k toggle karo
n & (n - 1)               n lowest set bit hataye ke saath  (loop -> popcount)
n & -n                    lowest set bit isolate karo
(n & (n - 1)) === 0       power of two (n > 0 ke liye)
n & (n + 1) === 0         sab low bits set (n 2^k - 1 hai)
x ^ y                     bits jahaan x aur y alag hain
ek list ko XOR-fold       odd-count values ka XOR
\`\`\`

## Bit tricks kab laayak hain

\`\`\`
HAAN:  problem explicitly bits / subsets / masks ke baare mein hai (bitmask DP,
       bitset, bloom filter, permission flags, packed structs).
HAAN:  ek proven hot path jahaan popcount ya ek power-of-two test bottleneck hai.
NAHI:  ordinary code mein saaf arithmetic ke ek substitute ki tarah — "n * 2"
       "n << 1" se behtar padhta hai aur compiler/engine ise waise bhi optimise karta hai.
\`\`\`

Aadhunik engines pehle se \`n / 2\` ko ek shift mein badal dete hain jab wo saabit kar sakte hain ki \`n\` ek non-negative integer hai, isliye micro-optimisation shaayad hi point hota hai. Bit tricks ka asli value set operations (union, intersection, membership, subset iteration) ko prati word O(1) mein express karna hai.`,

    examples: [
      {
        title: 'Broken: popcount by scanning all 32 bit positions',
        titleHi: 'Toota: sab 32 bit positions scan karke popcount',
        code: `for (let i = 0; i < 32; i++) if ((n >> i) & 1) count++;`,
        codeJs: `function countBitsSlow(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) if ((n >> i) & 1) count++;
  return count;
}
console.log(countBitsSlow(8));  // 1  — 32 iterations for a single bit`,
        codeTs: `function countBitsSlow(n: number): number {
  let count = 0;
  for (let i = 0; i < 32; i++) if ((n >> i) & 1) count++;
  return count;
}`,
        output: `1`,
        explain: 'Fixed 32 iterations no matter how sparse n is. Correct, but does the same work for 1 set bit as for 32.',
        explainHi: 'Fixed 32 iterations chahe n kitna bhi sparse ho. Sahi, par 1 set bit ke liye wahi kaam karta hai jo 32 ke liye.',
      },
      {
        title: 'Fixed: n & (n - 1) clears the lowest set bit',
        titleHi: 'Theek: n & (n - 1) lowest set bit clear karta hai',
        code: `while (n !== 0) { n &= n - 1; count++; }`,
        codeJs: `function countBits(n) {
  n = n >>> 0;
  let count = 0;
  while (n !== 0) { n &= n - 1; count++; }
  return count;
}
console.log(countBits(0b1011)); // 3
console.log(countBits(0));      // 0
console.log(countBits(-1));     // 32  (-1 >>> 0 is all ones)`,
        codeTs: `function countBits(n: number): number {
  n = n >>> 0;
  let count = 0;
  while (n !== 0) { n &= n - 1; count++; }
  return count;
}`,
        outputJs: `3
0
32`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'n - 1 flips the lowest 1 to 0 and the trailing 0s to 1s; ANDing keeps only the shared higher bits, i.e. n without its lowest set bit. One iteration per set bit.',
        explainHi: 'n - 1 lowest 1 ko 0 aur trailing 0s ko 1s flip karta hai; AND karna sirf shared higher bits rakhta hai, matlab n iske lowest set bit ke bina. Prati set bit ek iteration.',
      },
      {
        title: 'Power of two: exactly one bit set',
        titleHi: 'Power of two: bilkul ek bit set',
        code: `n > 0 && (n & (n - 1)) === 0`,
        codeJs: `const isPowerOfTwo = n => n > 0 && (n & (n - 1)) === 0;
console.log(isPowerOfTwo(1));   // true  (2^0)
console.log(isPowerOfTwo(16));  // true
console.log(isPowerOfTwo(24));  // false (11000 has two set bits)
console.log(isPowerOfTwo(0));   // false`,
        codeTs: `const isPowerOfTwo = (n: number): boolean => n > 0 && (n & (n - 1)) === 0;`,
        outputJs: `true
true
false
false`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A power of two has exactly one set bit. n & (n - 1) removes the lowest set bit, so it is 0 iff there was exactly one bit to remove. The n > 0 guard excludes zero and negatives.',
        explainHi: 'Ek power of two ka bilkul ek set bit hota hai. n & (n - 1) lowest set bit hataata hai, isliye ye 0 hai jab hataane ke liye bilkul ek bit tha. n > 0 guard zero aur negatives ko exclude karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// clearing a bit with n ^ (1 << k) when the bit might already be 0
n = n ^ (1 << k);   // toggles: if bit k was 0, this SETS it`,
        right: `n = n & ~(1 << k);   // always clears bit k, whether it was 0 or 1`,
        why: 'XOR toggles. To force a bit to 0 regardless of its current value, AND with the inverse mask. Use XOR only when you actually want to flip.',
        whyHi: 'XOR toggle karta hai. Ek bit ko iski current value se bekhabar 0 force karne ke liye, inverse mask ke saath AND karo. XOR sirf tab istemal karo jab aap sach mein flip karna chahte ho.',
      },
      {
        wrong: `// counting set bits of a NEGATIVE number without >>> 0 first
while (n !== 0) { n &= n - 1; count++; }   // for n < 0, n stays non-zero far too long / wrong`,
        right: `n = n >>> 0;   // convert to the unsigned 32-bit view first
while (n !== 0) { n &= n - 1; count++; }`,
        why: 'A negative n has its sign bit set and, in JS, is not naturally treated as a bounded 32-bit unsigned value in the while condition. Converting with >>> 0 gives the well-defined 32-bit pattern.',
        whyHi: 'Ek negative n ka sign bit set hai aur, JS mein, while condition mein ek bounded 32-bit unsigned value ki tarah naturally treat nahi hota. >>> 0 se convert karna well-defined 32-bit pattern deta hai.',
      },
      {
        wrong: `// isPowerOfTwo without the n > 0 guard
const isPowerOfTwo = n => (n & (n - 1)) === 0;   // returns true for n = 0`,
        right: `const isPowerOfTwo = n => n > 0 && (n & (n - 1)) === 0;`,
        why: '0 & (0 - 1) = 0 & -1 = 0, so the expression alone reports 0 as a power of two. Also negatives can slip through. The n > 0 guard is required.',
        whyHi: '0 & (0 - 1) = 0 & -1 = 0, isliye akela expression 0 ko ek power of two report karta hai. Negatives bhi slip ho sakte hain. n > 0 guard zaroori hai.',
      },
    ],

    realWorld: [
      {
        en: '**`popcount` is a single CPU instruction** on modern processors and is used in database bitmap indexes, error-correcting codes (Hamming distance = popcount of XOR), and similarity search.',
        hi: '**`popcount` aadhunik processors par ek akela CPU instruction hai** aur database bitmap indexes, error-correcting codes (Hamming distance = XOR ka popcount), aur similarity search mein istemal hota hai.',
      },
      {
        en: '**Fenwick trees (binary indexed trees)** use `i & -i` as their core step to jump between the ranges each index is responsible for, giving O(log n) prefix-sum updates and queries.',
        hi: '**Fenwick trees (binary indexed trees)** `i & -i` ko apne core step ki tarah istemal karte hain har index jo ranges ke liye zimmedaar hai unke beech jump karne ke liye, O(log n) prefix-sum updates aur queries dete hue.',
      },
      {
        en: '**XOR checksums and RAID parity** recover a lost block by XORing all the surviving blocks — the same "the odd one out survives" property.',
        hi: '**XOR checksums aur RAID parity** ek lost block recover karte hain sab bache blocks ko XOR karke — wahi "odd one out bachta hai" property.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain why n & (n - 1) removes exactly the lowest set bit, and how that gives an efficient population count.',
        qHi: 'Samjhaao ki n & (n - 1) bilkul lowest set bit kyun hataata hai, aur wo ek efficient population count kaise deta hai.',
        a: 'Look at the binary form of n and find its lowest 1 bit. Below that bit, every position in n is a 0. When you subtract 1 from n, the subtraction has to borrow: it turns that lowest 1 into a 0, and it turns all the 0s that were below it into 1s, because borrowing propagates down through them. Every bit above the lowest 1 is untouched by the subtraction. Now AND n with n minus 1. Above the lowest 1 bit, both numbers are identical, so those bits survive. At the lowest 1 bit position, n has a 1 but n minus 1 has a 0, so the AND gives 0 there. Below that position, n has all 0s while n minus 1 has all 1s, so the AND gives 0 there too. The net effect is that n and n minus 1 agree exactly on the bits strictly above the lowest set bit and disagree on everything from the lowest set bit downward, so their AND is n with its lowest set bit cleared and nothing else changed. For a population count you exploit this directly: start a counter at 0, and repeatedly replace n with n AND n minus 1 while incrementing the counter, stopping when n becomes 0. Each iteration removes exactly one set bit, so the number of iterations equals the number of set bits. A number with three set bits takes three iterations regardless of where those bits are among the 32 positions, which is a real improvement over scanning all 32 positions when numbers are sparse.',
        aHi: 'n ka binary form dekho aur iska lowest 1 bit dhoondho. Us bit ke neeche, n mein har position ek 0 hai. Jab aap n se 1 subtract karte ho, subtraction ko borrow karna padta hai: ye us lowest 1 ko ek 0 mein badalta hai, aur ye sab 0s jo iske neeche the unhe 1s mein badalta hai, kyunki borrowing unke through neeche propagate hoti hai. Lowest 1 ke upar har bit subtraction se achhoota hai. Ab n ko n minus 1 ke saath AND karo. Lowest 1 bit ke upar, dono numbers identical hain, isliye wo bits bachte hain. Lowest 1 bit position par, n mein ek 1 hai par n minus 1 mein ek 0, isliye AND wahaan 0 deta hai. Us position ke neeche, n mein sab 0s hain jabki n minus 1 mein sab 1s, isliye AND wahaan bhi 0 deta hai. Net effect ye hai ki n aur n minus 1 lowest set bit ke sakhti se upar ke bits par bilkul sahmat hain aur lowest set bit se neeche har cheez par asahmat hain, isliye unka AND n hai iske lowest set bit ke cleared ke saath aur kuch nahi badla. Ek population count ke liye aap ise seedhe exploit karte ho: ek counter 0 par shuru karo, aur baar-baar n ko n AND n minus 1 se replace karo counter increment karte hue, ruko jab n 0 ho jaaye. Har iteration bilkul ek set bit hataati hai, isliye iterations ki tadaad set bits ki tadaad ke barabar hai.',
      },
      {
        q: 'You are given an array containing every number from 0 to n except one. Find the missing number in O(1) extra space. Give two approaches and their trade-offs.',
        qHi: 'Aapko ek array diya jaata hai jismein 0 se n tak har number hai ek ke alaava. O(1) extra space mein missing number dhoondho. Do approaches aur unke trade-offs do.',
        a: 'The first approach is the arithmetic sum. The numbers 0 through n add up to n times n plus 1 divided by 2, a formula you can compute directly. Sum the array as well, and the difference between the expected sum and the actual sum is exactly the missing number, because every present number contributes to both totals and the missing one contributes only to the expected total. This is a single pass, O(1) extra space, and very simple. Its only weakness is overflow: for large n, n times n plus 1 over 2 can exceed the safe integer range, and you would need a wider integer type or careful ordering of operations. The second approach is XOR. XOR the numbers 0 through n together, then XOR in every array element. Consider any number k that is present in the array: it appears once among the values 0 through n that you XORed, and once as an array element, so it is XORed an even number of times and cancels to zero. The missing number appears only in the 0-through-n sequence, once, so it survives, and the final XOR result is the missing number. This is also a single pass and O(1) space. Its advantage over the sum approach is that XOR never overflows, since the result always fits in the same number of bits as the inputs, so it is safe for any n. Its slight disadvantage is that it is a touch less obvious to someone reading the code, and it only works when exactly one number is missing; with two missing you get their XOR and need an extra bit-splitting step. In an interview I would present the XOR version as the primary answer for its overflow safety, and mention the sum version as the more immediately readable alternative.',
        aHi: 'Pehla approach arithmetic sum hai. Numbers 0 se n tak n guna n plus 1 divided by 2 tak jodte hain, ek formula jo aap seedhe compute kar sakte ho. Array ko bhi sum karo, aur expected sum aur actual sum ke beech ka antar bilkul missing number hai, kyunki har present number dono totals mein yogdaan deta hai aur missing wala sirf expected total mein yogdaan deta hai. Ye ek single pass, O(1) extra space, aur bahut saral hai. Iski ekmatra kamzori overflow hai: bade n ke liye, n guna n plus 1 over 2 safe integer range se zyaada ho sakta hai. Doosra approach XOR hai. Numbers 0 se n tak saath XOR karo, phir har array element XOR karo. Array mein maujood kisi bhi number k par vichaar karo: ye 0 se n ki values mein ek baar aata hai jo aapne XOR ki, aur ek baar ek array element ki tarah, isliye ye ek even number of times XORed hai aur zero mein cancel hota hai. Missing number sirf 0-se-n sequence mein aata hai, ek baar, isliye ye bachta hai, aur final XOR result missing number hai. Ye bhi ek single pass aur O(1) space hai. Sum approach par iska advantage ye hai ki XOR kabhi overflow nahi hota, kyunki result hamesha inputs jitne hi bits mein fit hota hai, isliye ye kisi bhi n ke liye safe hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement countBits (Kernighan) and testBit / setBit / clearBit / toggleBit. Verify countBits(0b101101) is 4, and that setBit then clearBit on the same position returns the original number.',
        taskHi: 'countBits (Kernighan) aur testBit / setBit / clearBit / toggleBit implement karo. Verify karo countBits(0b101101) 4 hai, aur ki usi position par setBit phir clearBit original number return karta hai.',
        hint: 'countBits: `n = n >>> 0; let c = 0; while (n) { n &= n - 1; c++; }`. Test on 0, -1 (expect 32), and a random 32-bit value against countBitsSlow.',
        hintHi: 'countBits: `n = n >>> 0; let c = 0; while (n) { n &= n - 1; c++; }`. 0, -1 (32 expect karo), aur ek random 32-bit value par countBitsSlow ke against test karo.',
      },
      {
        task: 'Implement isPowerOfTwo, lowestSetBit (n & -n), and missingNumber (XOR fold). Test missingNumber on [3,0,1] (expect 2), [0] (expect 1), [9,6,4,2,3,5,7,0,1] (expect 8).',
        taskHi: 'isPowerOfTwo, lowestSetBit (n & -n), aur missingNumber (XOR fold) implement karo. missingNumber ko [3,0,1] (2 expect karo), [0] (1 expect karo), [9,6,4,2,3,5,7,0,1] (8 expect karo) par test karo.',
        hint: 'missingNumber: start x at nums.length, then for each i: x ^= i ^ nums[i]. Every value that is both an index and present cancels; the missing index survives.',
        hintHi: 'missingNumber: x ko nums.length par shuru karo, phir har i ke liye: x ^= i ^ nums[i]. Har value jo ek index aur present dono hai cancel hoti hai; missing index bachta hai.',
      },
      {
        task: 'Implement countBitsRange(n) returning an array where result[i] = popcount(i) for all i in 0..n, using the one-line DP result[i] = result[i & (i - 1)] + 1. Verify against Kernighan for each i up to 1000.',
        taskHi: 'countBitsRange(n) implement karo jo ek array return kare jahaan result[i] = popcount(i) sab i in 0..n ke liye, one-line DP result[i] = result[i & (i - 1)] + 1 istemal karke. Har i ke liye 1000 tak Kernighan ke against verify karo.',
        hint: 'i & (i - 1) is i with its lowest set bit removed, and that value is strictly less than i, so result[i & (i-1)] is already computed. Its popcount is one less than i\'s.',
        hintHi: 'i & (i - 1) i hai iske lowest set bit ke hataye ke saath, aur wo value i se sakhti se kam hai, isliye result[i & (i-1)] pehle se compute hai. Iska popcount i ke se ek kam hai.',
      },
    ],

    keyTakeaways: [
      'n & (n - 1) removes the lowest set bit. Looping "n &= n - 1; count++" until n is 0 counts set bits in exactly (number of set bits) iterations (Brian Kernighan).',
      'n & -n isolates the lowest set bit (via two\'s complement). This is the core step of a Fenwick tree.',
      'Single-bit ops: test (n >> k) & 1, set n | (1 << k), clear n & ~(1 << k), toggle n ^ (1 << k). Use AND-with-inverse to clear, XOR only to flip.',
      '(n & (n - 1)) === 0 with n > 0 tests for a power of two (exactly one set bit). The n > 0 guard is mandatory — 0 passes the expression.',
      'XOR-fold indices 0..n with array values to find a single missing number in O(1) space; XOR never overflows, unlike the sum-difference approach.',
      'Convert to the unsigned 32-bit view with n >>> 0 before bit-looping a value that could be negative.',
    ],
    keyTakeawaysHi: [
      'n & (n - 1) lowest set bit hataata hai. "n &= n - 1; count++" ko n 0 hone tak loop karna set bits ko bilkul (set bits ki tadaad) iterations mein ginta hai (Brian Kernighan).',
      'n & -n lowest set bit isolate karta hai (two\'s complement se). Ye ek Fenwick tree ka core step hai.',
      'Single-bit ops: test (n >> k) & 1, set n | (1 << k), clear n & ~(1 << k), toggle n ^ (1 << k). Clear karne ke liye AND-with-inverse istemal karo, flip karne ke liye sirf XOR.',
      '(n & (n - 1)) === 0 n > 0 ke saath ek power of two test karta hai (bilkul ek set bit). n > 0 guard anivaarya hai — 0 expression pass karta hai.',
      'Ek single missing number O(1) space mein dhoondhne ke liye indices 0..n ko array values ke saath XOR-fold karo; XOR kabhi overflow nahi hota, sum-difference approach ke ulat.',
      'Ek aisi value ko bit-loop karne se pehle jo negative ho sakti hai n >>> 0 se unsigned 32-bit view mein convert karo.',
    ],
  },
];
