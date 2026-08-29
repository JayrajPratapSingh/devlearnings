/**
 * DSA Complete Course — Module 13: Bit Manipulation, lesson 1.
 *
 * Binary representation, the bitwise operators (AND, OR, XOR, NOT, left/right
 * shift), and two's complement for negatives. Builds on this course's Module 1
 * (Big-O and constant factors) and Module 3 (hashing sometimes uses bit tricks
 * for speed). Broken example: repeatedly testing "is n even?" with `n % 2` and
 * halving with `n / 2` (or `Math.floor(n / 2)`) inside a very hot loop, and
 * conflating JavaScript's `>>` (sign-propagating) with `>>>` (zero-fill), which
 * quietly produces wrong values for negative inputs. Fixed by using `n & 1` for
 * the parity test, `n >> 1` for a signed halving, `n >>> 1` when you truly want
 * an unsigned shift, and by being explicit that JS bitwise operators work on
 * 32-bit signed integers. The lesson also establishes the XOR identities
 * (a ^ a === 0, a ^ 0 === a, XOR is commutative and associative) that the next
 * lesson's tricks depend on.
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

export const DSA_MODULE_13: CourseLesson[] = [
  {
    slug: 'bits-binary-representation-and-operators',
    title: 'Bits: Binary Representation and the Bitwise Operators',
    titleHi: 'Bits: Binary Representation Aur Bitwise Operators',
    description: 'Testing parity with n % 2 and halving with Math.floor(n / 2) in a loop that runs millions of times, and using JavaScript\'s >> operator on a negative number expecting it to behave like an unsigned shift. The % and / work but carry needless overhead, and >> sign-extends, so >> on a negative produces a very different value than a beginner expects.',
    descriptionHi: 'n % 2 se parity test karna aur Math.floor(n / 2) se halving karna ek loop mein jo millions of times chalta hai, aur JavaScript ke >> operator ko ek negative number par istemal karna ye ummeed karke ki ye ek unsigned shift ki tarah vyavahaar karega. % aur / kaam karte hain par anaavashyak overhead le jaate hain, aur >> sign-extend karta hai, isliye ek negative par >> ek beginner ki ummeed se kaafi alag value banaata hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A row of light switches, where each switch is either off (0) or on (1), and the pattern of switches spells out a number in base two.** The rightmost switch is worth 1, the next 2, then 4, 8, 16, and so on, doubling each step left. To read the number, add up the values of the switches that are on. The bitwise operators are ways of combining two such rows switch-by-switch: AND turns a switch on in the result only if it is on in BOTH rows; OR turns it on if it is on in EITHER; XOR turns it on if it is on in exactly ONE (the same as "the switches differ"); NOT flips every switch. Shifting left is sliding the whole pattern of switches one position toward the higher values, which doubles the number; shifting right slides it toward the lower values, which halves it and drops whatever fell off the right edge. Checking whether a number is odd is just looking at the rightmost switch. These operations are the cheapest thing a processor does — a single instruction each — which is why, in the innermost loop of something performance-critical, people reach for switch-flipping instead of arithmetic.',
      hi: '**Light switches ki ek row, jahaan har switch ya toh off (0) hai ya on (1), aur switches ka pattern base two mein ek number spell karta hai.** Sabse right ka switch 1 ke laayak hai, agla 2, phir 4, 8, 16, aur aise hi, har step left doguna hota hua. Number padhne ke liye, jo switches on hain unki values jodo. Bitwise operators do aisi rows ko switch-by-switch combine karne ke tarike hain: AND ek switch ko result mein sirf tab on karta hai agar ye DONO rows mein on hai; OR ise on karta hai agar ye KISI EK mein on hai; XOR ise on karta hai agar ye bilkul EK mein on hai ("switches alag hain" jaisa hi); NOT har switch flip karta hai. Left shift karna poore pattern ko higher values ki taraf ek position slide karna hai, jo number doguna karta hai; right shift ise lower values ki taraf slide karta hai, jo ise halve karta hai aur jo bhi right edge se gira use drop karta hai. Ye check karna ki ek number odd hai bas sabse right ka switch dekhna hai. Ye operations sabse sasti cheez hain jo ek processor karta hai — har ek ek akela instruction — yahi wajah hai ki, performance-critical kisi cheez ke innermost loop mein, log arithmetic ke bajaye switch-flipping ki taraf pahunchte hain.',
    },

    simple: `**Start broken.** Parity and halving via arithmetic, and a misused shift:

\`\`\`js
// hot loop: runs 10 million times
for (let n = big; n > 0; n = Math.floor(n / 2)) {
  if (n % 2 === 1) count++;
}

// and a negative-number surprise:
console.log(-8 >> 1);    // -4   (sign-propagating: fills the top bit with 1s)
console.log(-8 >>> 1);   // 2147483644   (zero-fill: treats -8 as its 32-bit pattern)
\`\`\`

\`n % 2\` and \`Math.floor(n / 2)\` are correct but do a full modulo / division; in a tight loop the bitwise equivalents are noticeably faster. And \`>>\` versus \`>>>\` is a real trap: \`>>\` keeps the sign, \`>>>\` does not, so on negatives they diverge completely.

**The fix: bitwise parity and shift**

\`\`\`js
// n & 1 is the value of the rightmost bit: 1 if odd, 0 if even.
if (n & 1) count++;

// n >> 1 is n divided by 2, rounding toward negative infinity (signed).
n = n >> 1;

// n >>> 1 is an UNSIGNED right shift — use it only when you want the raw
// 32-bit pattern shifted with zeros coming in from the left.
\`\`\`

\`\`\`ts
const isOdd = (n: number): boolean => (n & 1) === 1;
const half = (n: number): number => n >> 1;          // signed
const halfUnsigned = (n: number): number => n >>> 1; // zero-fill
\`\`\`

**The operators, on 4-bit examples**

\`\`\`
   a = 1100 (12)      b = 1010 (10)

a & b   =  1000  (8)   -> bit set only where BOTH are 1   (intersection)
a | b   =  1110  (14)  -> bit set where EITHER is 1        (union)
a ^ b   =  0110  (6)   -> bit set where they DIFFER        (symmetric difference)
~a      = ...0011      -> every bit flipped (in JS this is -(a+1) = -13)
a << 1  =  11000 (24)  -> shift left one place: multiply by 2
a >> 1  =  0110  (6)   -> shift right one place: signed divide by 2
1 << k                 -> a single 1 bit at position k (the value 2^k)
\`\`\`

**The XOR identities the next lesson relies on**

\`\`\`
x ^ x = 0            (a value XORed with itself cancels out)
x ^ 0 = x           (XOR with zero is the identity)
x ^ y = y ^ x       (commutative)
(x ^ y) ^ z = x ^ (y ^ z)   (associative)
\`\`\`

Together these mean: XOR a whole list of numbers, and every value that appears an even number of times cancels itself to 0, leaving the XOR of the values that appear an odd number of times. That single fact powers the "find the unique element" trick and several others.`,

    simpleHi: `**Toote hue se shuru.** Arithmetic se parity aur halving, aur ek misused shift:

\`\`\`js
// hot loop: 10 million baar chalta hai
for (let n = big; n > 0; n = Math.floor(n / 2)) {
  if (n % 2 === 1) count++;
}

// aur ek negative-number surprise:
console.log(-8 >> 1);    // -4   (sign-propagating: top bit ko 1s se bharta hai)
console.log(-8 >>> 1);   // 2147483644   (zero-fill: -8 ko iske 32-bit pattern ki tarah treat karta hai)
\`\`\`

\`n % 2\` aur \`Math.floor(n / 2)\` sahi hain par ek poora modulo / division karte hain; ek tight loop mein bitwise equivalents dhyaan-dene-yogya tez hain. Aur \`>>\` versus \`>>>\` ek asli trap hai: \`>>\` sign rakhta hai, \`>>>\` nahi, isliye negatives par wo poori tarah alag ho jaate hain.

**Fix: bitwise parity aur shift**

\`\`\`js
// n & 1 sabse right ke bit ki value hai: 1 agar odd, 0 agar even.
if (n & 1) count++;

// n >> 1 n divided by 2 hai, negative infinity ki taraf round karte hue (signed).
n = n >> 1;

// n >>> 1 ek UNSIGNED right shift hai — ise sirf tab istemal karo jab aap raw
// 32-bit pattern chahte ho left se zeros aate hue shifted.
\`\`\`

\`\`\`ts
const isOdd = (n: number): boolean => (n & 1) === 1;
const half = (n: number): number => n >> 1;          // signed
const halfUnsigned = (n: number): number => n >>> 1; // zero-fill
\`\`\`

**Operators, 4-bit examples par**

\`\`\`
   a = 1100 (12)      b = 1010 (10)

a & b   =  1000  (8)   -> bit set sirf jahaan DONO 1 hain   (intersection)
a | b   =  1110  (14)  -> bit set jahaan KOI EK 1 hai        (union)
a ^ b   =  0110  (6)   -> bit set jahaan wo ALAG hain        (symmetric difference)
~a      = ...0011      -> har bit flipped (JS mein ye -(a+1) = -13 hai)
a << 1  =  11000 (24)  -> ek jagah left shift: 2 se multiply
a >> 1  =  0110  (6)   -> ek jagah right shift: signed 2 se divide
1 << k                 -> position k par ek akela 1 bit (value 2^k)
\`\`\`

**Wo XOR identities jinpar agla lesson nirbhar karta hai**

\`\`\`
x ^ x = 0            (ek value khud se XORed cancel ho jaati hai)
x ^ 0 = x           (zero ke saath XOR identity hai)
x ^ y = y ^ x       (commutative)
(x ^ y) ^ z = x ^ (y ^ z)   (associative)
\`\`\`

Saath ye matlab: numbers ki ek poori list XOR karo, aur har value jo ek even number of times aati hai khud ko 0 mein cancel karti hai, un values ka XOR chhodte hue jo ek odd number of times aati hain. Wo ek fact "unique element dhoondho" trick aur kayi doosre ko power karta hai.`,

    content: `## Two's complement: how negatives are stored

\`\`\`
In a fixed number of bits (JS bitwise ops use 32), a negative number -x is
stored as the bit pattern of (2^32 - x). Equivalently: flip all the bits of x
and add 1.

  8   =  00000000 00000000 00000000 00001000
 -8   =  11111111 11111111 11111111 11111000   (~8 is ...11110111, +1 -> ...11111000)

Consequences:
  - the top (leftmost) bit is the sign bit: 1 means negative.
  - ~x === -(x + 1)     (bit-flip relates to negation this way)
  - -x === ~x + 1
  - x & -x isolates the lowest set bit of x (used constantly — next lesson).
\`\`\`

Two's complement is why one adder circuit handles both addition and subtraction, and why \`>>\` (which copies the sign bit inward) divides negatives correctly toward negative infinity while \`>>>\` (which shifts in zeros) does not.

## JavaScript specifics you must know

\`\`\`js
// 1. Bitwise operators coerce to 32-bit SIGNED integers, then back to double.
(2 ** 31) | 0;        // -2147483648  (overflowed the signed 32-bit range)
5.9 | 0;              // 5            (truncates toward zero — a fast Math.trunc)

// 2. >>> is the only operator that yields an UNSIGNED (0 .. 2^32-1) result.
-1 >>> 0;             // 4294967295   (the standard "view these bits as unsigned")

// 3. Shifts mask the shift amount to 5 bits (mod 32).
1 << 32;             // 1   (32 mod 32 = 0, so no shift)  -- a common bug

// 4. For integers beyond 32 bits, use BigInt: (1n << 40n), 7n & 3n, etc.
\`\`\`

The 32-bit truncation is the single biggest gotcha: any bit manipulation on values that can exceed ~2 billion must either stay within 32 bits deliberately or move to \`BigInt\`.

## Printing and reading bits

\`\`\`js
(13).toString(2);              // "1101"
(13).toString(2).padStart(8, '0');   // "00001101"
parseInt("1101", 2);           // 13
(-8 >>> 0).toString(2);        // the full 32-bit pattern as a string
\`\`\`

## Common micro-operations, written both ways

\`\`\`
even?            n % 2 === 0          <->   (n & 1) === 0
halve (floor)    Math.floor(n / 2)    <->   n >> 1        (for n >= 0)
double           n * 2               <->   n << 1
multiply by 2^k  n * (2 ** k)        <->   n << k         (k < 31, n small)
divide by 2^k    Math.floor(n / 2**k) <->  n >> k         (for n >= 0)
mod 2^k          n % (2 ** k)        <->   n & ((1 << k) - 1)   (for n >= 0)
\`\`\`

These equivalences only hold for non-negative \`n\` within 32 bits. They matter in hot paths and in problems specifically about bit layout (hashing, bloom filters, bitsets), not as a general style — clarity usually wins elsewhere.`,

    contentHi: `## Two's complement: negatives kaise store hote hain

\`\`\`
Ek fixed tadaad bits mein (JS bitwise ops 32 istemal karte hain), ek negative
number -x (2^32 - x) ke bit pattern ki tarah store hota hai. Barabar roop se:
x ke sab bits flip karo aur 1 jodo.

  8   =  00000000 00000000 00000000 00001000
 -8   =  11111111 11111111 11111111 11111000   (~8 ...11110111 hai, +1 -> ...11111000)

Parinaam:
  - top (leftmost) bit sign bit hai: 1 matlab negative.
  - ~x === -(x + 1)     (bit-flip is tarah negation se judta hai)
  - -x === ~x + 1
  - x & -x x ke lowest set bit ko isolate karta hai (lagaataar istemal — agla lesson).
\`\`\`

Two's complement wajah hai ki ek adder circuit addition aur subtraction dono handle karta hai, aur kyun \`>>\` (jo sign bit ko andar copy karta hai) negatives ko negative infinity ki taraf sahi divide karta hai jabki \`>>>\` (jo zeros shift karta hai) nahi.

## JavaScript specifics jo aapko jaanni chahiye

\`\`\`js
// 1. Bitwise operators 32-bit SIGNED integers mein coerce karte hain, phir wapas double.
(2 ** 31) | 0;        // -2147483648  (signed 32-bit range overflow kiya)
5.9 | 0;              // 5            (zero ki taraf truncate — ek fast Math.trunc)

// 2. >>> ekmatra operator hai jo ek UNSIGNED (0 .. 2^32-1) result deta hai.
-1 >>> 0;             // 4294967295   (standard "in bits ko unsigned dekho")

// 3. Shifts shift amount ko 5 bits (mod 32) mask karte hain.
1 << 32;             // 1   (32 mod 32 = 0, isliye koi shift nahi)  -- ek aam bug

// 4. 32 bits se aage integers ke liye, BigInt istemal karo: (1n << 40n), 7n & 3n, waghaira.
\`\`\`

32-bit truncation sabse bada gotcha hai: ~2 billion se zyaada ho sakne waali values par koi bhi bit manipulation ya toh jaan-boojhkar 32 bits ke andar rahni chahiye ya \`BigInt\` par jaani chahiye.

## Bits print aur read karna

\`\`\`js
(13).toString(2);              // "1101"
(13).toString(2).padStart(8, '0');   // "00001101"
parseInt("1101", 2);           // 13
(-8 >>> 0).toString(2);        // poora 32-bit pattern ek string ki tarah
\`\`\`

## Common micro-operations, dono tarah likhi gayi

\`\`\`
even?            n % 2 === 0          <->   (n & 1) === 0
halve (floor)    Math.floor(n / 2)    <->   n >> 1        (n >= 0 ke liye)
double           n * 2               <->   n << 1
multiply by 2^k  n * (2 ** k)        <->   n << k         (k < 31, n small)
divide by 2^k    Math.floor(n / 2**k) <->  n >> k         (n >= 0 ke liye)
mod 2^k          n % (2 ** k)        <->   n & ((1 << k) - 1)   (n >= 0 ke liye)
\`\`\`

Ye equivalences sirf non-negative \`n\` ke liye 32 bits ke andar hold karti hain. Wo hot paths mein aur bit layout ke baare mein khaas problems mein (hashing, bloom filters, bitsets) maayne rakhti hain, ek general style ki tarah nahi — clarity aksar kahin aur jeetti hai.`,

    examples: [
      {
        title: 'Parity: n & 1 versus n % 2',
        titleHi: 'Parity: n & 1 versus n % 2',
        code: `if (n & 1) { /* odd */ }    // reads the rightmost bit directly`,
        codeJs: `console.log(7 & 1, 8 & 1);       // 1 0
console.log(-7 & 1, -8 & 1);     // 1 0  (works for negatives: rightmost bit)
// n % 2 gives -1 for negative odds in JS, which trips up sign-based checks:
console.log(-7 % 2);            // -1  (not 1)
console.log(-7 & 1);            // 1   (unambiguous)`,
        codeTs: `const isOdd = (n: number): boolean => (n & 1) === 1;`,
        output: `1 0
1 0
-1
1`,
        explain: 'n & 1 isolates the value of bit 0, which is 1 exactly when n is odd, for both positive and negative n. n % 2 returns -1 for negative odd numbers in JavaScript, which breaks naive parity checks.',
        explainHi: 'n & 1 bit 0 ki value isolate karta hai, jo bilkul tab 1 hai jab n odd hai, positive aur negative n dono ke liye. n % 2 JavaScript mein negative odd numbers ke liye -1 return karta hai, jo naive parity checks todta hai.',
      },
      {
        title: 'Broken: confusing >> and >>> on a negative',
        titleHi: 'Toota: ek negative par >> aur >>> confuse karna',
        code: `-8 >> 1    // -4   (sign kept)
-8 >>> 1   // 2147483644   (sign lost, treated as unsigned 32-bit)`,
        codeJs: `// expecting an unsigned halving but using >>:
function halveUnsigned(n) { return n >> 1; }      // WRONG for negatives
console.log(halveUnsigned(-8));  // -4, if you actually wanted 2147483644

function halveUnsignedFixed(n) { return n >>> 1; }
console.log(halveUnsignedFixed(-8)); // 2147483644`,
        codeTs: `const signedHalf = (n: number): number => n >> 1;
const unsignedHalf = (n: number): number => n >>> 1;`,
        output: `-4
2147483644`,
        explain: '>> copies the sign bit inward, so it divides toward negative infinity (correct signed arithmetic). >>> fills with zeros, treating the operand as an unsigned 32-bit pattern. They only agree for non-negative operands.',
        explainHi: '>> sign bit ko andar copy karta hai, isliye ye negative infinity ki taraf divide karta hai (sahi signed arithmetic). >>> zeros se bharta hai, operand ko ek unsigned 32-bit pattern ki tarah treat karte hue. Wo sirf non-negative operands ke liye sahmat hain.',
      },
      {
        title: 'XOR cancels pairs',
        titleHi: 'XOR pairs cancel karta hai',
        code: `[4, 1, 2, 1, 2].reduce((acc, x) => acc ^ x, 0);   // 4`,
        codeJs: `function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0);
}
console.log(singleNumber([4, 1, 2, 1, 2])); // 4
console.log(singleNumber([2, 2, 7]));       // 7`,
        codeTs: `function singleNumber(nums: number[]): number {
  return nums.reduce((acc, x) => acc ^ x, 0);
}`,
        outputJs: `4
7`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'XOR is commutative and associative, and x ^ x = 0. So XORing the whole array, every value that appears twice cancels to 0, leaving only the value that appears once.',
        explainHi: 'XOR commutative aur associative hai, aur x ^ x = 0. Toh poore array ko XOR karke, har value jo do baar aati hai 0 mein cancel hoti hai, sirf wo value chhodte hue jo ek baar aati hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// bit manipulation on a value larger than 2^31 - 1 with 32-bit operators
const mask = 1 << 40;   // 1 << (40 mod 32) = 1 << 8 = 256, NOT 2^40`,
        right: `const mask = 1n << 40n;   // BigInt for shifts of 32 or more`,
        why: 'JS bitwise operators work on 32-bit integers, and shift counts are taken mod 32. Any bit work involving positions >= 32 or values >= 2^31 must use BigInt or it silently produces wrong numbers.',
        whyHi: 'JS bitwise operators 32-bit integers par kaam karte hain, aur shift counts mod 32 liye jaate hain. Positions >= 32 ya values >= 2^31 waala koi bhi bit work BigInt istemal karna chahiye warna ye chupchaap galat numbers banaata hai.',
      },
      {
        wrong: `// operator precedence: & binds looser than ===
if (n & 1 === 0) { ... }   // parsed as n & (1 === 0) -> n & 0 -> always 0`,
        right: `if ((n & 1) === 0) { ... }   // parenthesise the bitwise op`,
        why: 'In JavaScript (and C, Java), comparison operators bind tighter than bitwise & | ^. Without parentheses, n & 1 === 0 becomes n & (1 === 0) = n & 0, which is always falsy.',
        whyHi: 'JavaScript (aur C, Java) mein, comparison operators bitwise & | ^ se tighter bind karte hain. Parentheses ke bina, n & 1 === 0 n & (1 === 0) = n & 0 ban jaata hai, jo hamesha falsy hai.',
      },
      {
        wrong: `// using n >> 1 to halve a negative and expecting truncation toward zero
(-7) >> 1;   // -4, not -3  (rounds toward negative infinity)`,
        right: `Math.trunc(-7 / 2);   // -3, if you need round-toward-zero for negatives`,
        why: '>> divides toward negative infinity, so -7 >> 1 is -4. If your algorithm assumes -7 / 2 truncates to -3, the shift gives a different answer for negative operands.',
        whyHi: '>> negative infinity ki taraf divide karta hai, isliye -7 >> 1 -4 hai. Agar aapka algorithm maanta hai ki -7 / 2 -3 par truncate hota hai, shift negative operands ke liye ek alag jawaab deta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Permission and feature flags** are stored as bit fields — one bit per capability — so checking "does this user have permission X" is a single `flags & X` AND, and granting is `flags | X`.',
        hi: '**Permission aur feature flags** bit fields ki tarah store hote hain — prati capability ek bit — isliye "kya is user ke paas permission X hai" check karna ek akela `flags & X` AND hai, aur grant karna `flags | X` hai.',
      },
      {
        en: '**Hash tables and bloom filters** use `hash & (capacity - 1)` (valid when capacity is a power of two) as a fast replacement for `hash % capacity`.',
        hi: '**Hash tables aur bloom filters** `hash & (capacity - 1)` (valid jab capacity two ki power hai) ko `hash % capacity` ke ek fast replacement ki tarah istemal karte hain.',
      },
      {
        en: '**Colour packing** (RGBA into one 32-bit integer), network protocol headers, and file formats all pack multiple small fields into one word using shifts and masks.',
        hi: '**Colour packing** (RGBA ek 32-bit integer mein), network protocol headers, aur file formats sab shifts aur masks istemal karke ek word mein kayi chhote fields pack karte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain two\'s complement and why the arithmetic right shift (>>) divides a negative number correctly while the logical right shift (>>>) does not.',
        qHi: 'Two\'s complement samjhaao aur kyun arithmetic right shift (>>) ek negative number ko sahi divide karta hai jabki logical right shift (>>>) nahi.',
        a: 'In a machine with a fixed word size, say 32 bits, there is no separate sign flag; the negative numbers are encoded into the same bit patterns as the positives using two\'s complement. The rule is that negative x is represented by the bit pattern you get from computing 2 to the 32 minus x, or equivalently by flipping every bit of x and adding 1. A key property of this encoding is that ordinary binary addition, ignoring any carry out of the top bit, produces the correct result for signed operands too, which is why hardware needs only one adder. Another property is that the top bit ends up being 1 for every negative number and 0 for every non-negative number, so it acts as a sign indicator. Now consider halving by shifting right. Dividing a two\'s complement number by two, rounding toward negative infinity, corresponds to shifting all the bits one position to the right and filling the vacated top position with a copy of the old sign bit. For a positive number the sign bit is 0, so you fill with 0 and get the expected result. For a negative number the sign bit is 1, so you must fill with 1 to keep the number negative and correctly scaled; that is exactly what the arithmetic shift >> does. The logical shift >>> always fills the vacated top bit with 0 regardless of sign. On a positive number that is the same as >>. On a negative number it turns the sign bit to 0, which reinterprets the value as a large positive number in the unsigned range, so instead of, say, negative eight becoming negative four, it becomes something like two billion. That is why you use >> for signed division by powers of two and reserve >>> for the specific case where you genuinely want to treat the bits as an unsigned 32-bit quantity.',
        aHi: 'Ek fixed word size waali machine mein, maano 32 bits, koi alag sign flag nahi hota; negative numbers ko positives ke same bit patterns mein encode kiya jaata hai two\'s complement istemal karke. Rule ye hai ki negative x ko wo bit pattern represent karta hai jo aapko 2 ki 32 minus x compute karne se milta hai, ya barabar roop se x ke har bit ko flip karke aur 1 jodkar. Is encoding ki ek key property ye hai ki saadhaaran binary addition, top bit se koi carry out ignore karte hue, signed operands ke liye bhi sahi result banaati hai, yahi wajah hai ki hardware ko sirf ek adder chahiye. Ek aur property ye hai ki top bit har negative number ke liye 1 aur har non-negative number ke liye 0 hota hai, isliye ye ek sign indicator ki tarah kaam karta hai. Ab right shift karke halving par vichaar karo. Ek two\'s complement number ko two se divide karna, negative infinity ki taraf round karte hue, sab bits ko ek position right shift karne aur khaali huyi top position ko purane sign bit ki ek copy se bharne ke barabar hai. Ek positive number ke liye sign bit 0 hai, isliye aap 0 se bharte ho aur expected result paate ho. Ek negative number ke liye sign bit 1 hai, isliye aapko 1 se bharna chahiye number ko negative aur sahi scaled rakhne ke liye; wo bilkul wo hai jo arithmetic shift >> karta hai. Logical shift >>> hamesha khaali huyi top bit ko 0 se bharta hai chahe sign kuch bhi ho. Ek negative number par ye sign bit ko 0 karta hai, jo value ko unsigned range mein ek bade positive number ki tarah reinterpret karta hai.',
      },
      {
        q: 'Why does XORing all elements of an array find the element that appears an odd number of times, and what are the constraints for this to work?',
        qHi: 'Ek array ke sab elements ko XOR karna kyun wo element dhoondhta hai jo ek odd number of times aata hai, aur ise kaam karne ke liye constraints kya hain?',
        a: 'XOR has three properties that combine to give the result. It is commutative, meaning a XOR b equals b XOR a, so the order in which you fold the elements together does not matter. It is associative, meaning you can group the XORs any way you like. And any value XORed with itself is zero, while any value XORed with zero is unchanged. Now take the whole array and XOR everything together, starting from zero. Because order and grouping do not matter, you are free to imagine rearranging the sequence so that all copies of each distinct value are adjacent. A value that appears an even number of times contributes an even-length run of that value, and XORing a value with itself an even number of times pairs them all off into zeros, so that whole run vanishes from the running result. A value that appears an odd number of times contributes an odd-length run; all but one of its occurrences pair off to zero, and the leftover single occurrence survives. So the final XOR is the XOR of exactly the values that appear an odd number of times. In the classic version of the problem, every value appears exactly twice except one that appears once, so the answer is just that one value. The constraints for this to be useful: it identifies the odd-count values only, so it works cleanly when exactly one value has an odd count. If two values have odd counts you get their XOR, not the values themselves, and you need a second step, splitting the array by a set bit of that XOR, to separate them. It also assumes the elements are integers, or at least map to integers, since XOR is a bitwise operation.',
        aHi: 'XOR ke teen properties hain jo milkar result deti hain. Ye commutative hai, matlab a XOR b b XOR a ke barabar hai, isliye jis order mein aap elements ko fold karte ho wo maayne nahi rakhta. Ye associative hai, matlab aap XORs ko kisi bhi tarah group kar sakte ho. Aur koi bhi value khud se XORed zero hai, jabki koi bhi value zero ke saath XORed na-badla hai. Ab poora array lo aur sab kuch zero se shuru karke XOR karo. Kyunki order aur grouping maayne nahi rakhte, aap sequence ko rearrange karne ki kalpna karne ke liye free ho taaki har distinct value ki sab copies adjacent hon. Ek value jo ek even number of times aati hai us value ka ek even-length run yogdaan deti hai, aur ek value ko khud se ek even number of times XOR karna unhe sab zeros mein pair kar deta hai, isliye wo poora run running result se gaayab ho jaata hai. Ek value jo ek odd number of times aati hai ek odd-length run yogdaan deti hai; iski ek ke alaava sab occurrences zero mein pair ho jaati hain, aur bachi ek single occurrence bachti hai. Toh final XOR bilkul un values ka XOR hai jo ek odd number of times aati hain. Constraints: ye sirf odd-count values pehchaanta hai, isliye ye saaf kaam karta hai jab bilkul ek value ka odd count hai. Agar do values ke odd counts hain aapko unka XOR milta hai, values khud nahi.',
      },
    ],

    exercises: [
      {
        task: 'Write isOdd, half (signed), doubleIt, and getBit(n, k) (the value of bit k) using only bitwise operators. Test on positive, negative, and zero. Confirm isOdd(-7) is true and half(-7) is -4.',
        taskHi: 'sirf bitwise operators istemal karke isOdd, half (signed), doubleIt, aur getBit(n, k) (bit k ki value) likho. Positive, negative, aur zero par test karo. Confirm karo isOdd(-7) true hai aur half(-7) -4 hai.',
        hint: 'getBit(n, k) = (n >> k) & 1. Test getBit(13, 0..3) -> 1, 0, 1, 1 (13 = 1101).',
        hintHi: 'getBit(n, k) = (n >> k) & 1. getBit(13, 0..3) test karo -> 1, 0, 1, 1 (13 = 1101).',
      },
      {
        task: 'Write toBinary(n) that returns the 32-bit binary string of n (handling negatives via two\'s complement). Verify toBinary(-8) ends in "...11111000" and toBinary(13) is "...00001101".',
        taskHi: 'toBinary(n) likho jo n ki 32-bit binary string return kare (negatives ko two\'s complement se handle karte hue). Verify karo toBinary(-8) "...11111000" mein khatam hota hai aur toBinary(13) "...00001101" hai.',
        hint: '(n >>> 0).toString(2).padStart(32, "0"). The >>> 0 converts the signed value to its unsigned 32-bit view.',
        hintHi: '(n >>> 0).toString(2).padStart(32, "0"). >>> 0 signed value ko iske unsigned 32-bit view mein convert karta hai.',
      },
      {
        task: 'Implement singleNumber (XOR fold) and a variant twoSingleNumbers where exactly two elements appear once and the rest twice. For the variant: XOR all to get a ^ b, isolate any set bit, partition the array by that bit, XOR each half separately.',
        taskHi: 'singleNumber (XOR fold) aur ek variant twoSingleNumbers implement karo jahaan bilkul do elements ek baar aate hain aur baaki do baar. Variant ke liye: sab XOR karke a ^ b paao, koi set bit isolate karo, us bit se array partition karo, har half ko alag se XOR karo.',
        hint: 'A set bit of a ^ b is a position where a and b differ, so it cleanly splits the array into two groups, one containing a, the other b. Use `xor & -xor` to isolate the lowest set bit.',
        hintHi: 'a ^ b ka ek set bit ek position hai jahaan a aur b alag hain, isliye ye array ko do groups mein saaf split karta hai, ek mein a, doosre mein b. Lowest set bit isolate karne ke liye `xor & -xor` istemal karo.',
      },
    ],

    keyTakeaways: [
      'A number is a row of bits; bit k has value 2^k. AND = intersection, OR = union, XOR = "bits that differ", NOT = flip all, << = double, >> = signed halve.',
      'n & 1 tests parity (works for negatives, unlike n % 2 which gives -1 for negative odds). n >> 1 is a signed halving; n >>> 1 is an unsigned (zero-fill) shift.',
      'Negatives use two\'s complement: -x is the pattern of 2^32 - x, i.e. ~x + 1. ~x === -(x + 1). The top bit is the sign.',
      'JavaScript bitwise operators work on 32-bit SIGNED integers and mask shift counts mod 32. For positions >= 32 or values >= 2^31, use BigInt.',
      'Comparison binds tighter than & | ^: always write (n & 1) === 0, never n & 1 === 0.',
      'XOR identities: x^x=0, x^0=x, commutative, associative. XORing a list cancels every even-count value, leaving the XOR of the odd-count ones.',
    ],
    keyTakeawaysHi: [
      'Ek number bits ki ek row hai; bit k ki value 2^k hai. AND = intersection, OR = union, XOR = "bits jo alag hain", NOT = sab flip, << = double, >> = signed halve.',
      'n & 1 parity test karta hai (negatives ke liye kaam karta hai, n % 2 ke ulat jo negative odds ke liye -1 deta hai). n >> 1 ek signed halving hai; n >>> 1 ek unsigned (zero-fill) shift hai.',
      'Negatives two\'s complement istemal karte hain: -x 2^32 - x ka pattern hai, matlab ~x + 1. ~x === -(x + 1). Top bit sign hai.',
      'JavaScript bitwise operators 32-bit SIGNED integers par kaam karte hain aur shift counts mod 32 mask karte hain. Positions >= 32 ya values >= 2^31 ke liye, BigInt istemal karo.',
      'Comparison & | ^ se tighter bind karta hai: hamesha (n & 1) === 0 likho, kabhi n & 1 === 0 nahi.',
      'XOR identities: x^x=0, x^0=x, commutative, associative. Ek list ko XOR karna har even-count value cancel karta hai, odd-count waalon ka XOR chhodta hai.',
    ],
  },
];
