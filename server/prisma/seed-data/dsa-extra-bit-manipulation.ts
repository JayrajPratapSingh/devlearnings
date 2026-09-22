import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Bit Manipulation — new category, gap-fill batch. A gap-audit of the DSA
 * bank found only incidental XOR usage (single-number, missing-number, both
 * filed under Arrays) with no dedicated bit-trick coverage. Covers popcount,
 * bit reversal, power-of-two checks, XOR-based counting tricks, arithmetic
 * via bitwise ops, range-AND, and the classic hard greedy-trie XOR problem
 * (solved here via a simpler prefix/hash-set technique, no trie needed).
 */
export const dsaExtraBitManipulation: SeedProblem[] = [
  {
    slug: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    category: 'Bit Manipulation',
    difficulty: 'EASY',
    description:
      'Given a non-negative integer, count the number of `1` bits in its 32-bit binary representation (the "Hamming weight").\n\n**Input**\nLine 1: `n`\n\n**Output**\nThe count of set bits.',
    descriptionHi:
      'Ek non-negative integer diya hai, uske 32-bit binary representation mein `1` bits ki sankhya count karo ("Hamming weight").\n\n**Input**\nLine 1: `n`\n\n**Output**\nSet bits ka count.',
    examples: [
      { input: '11', output: '3' },
      { input: '128', output: '1' },
      { input: '4294967293', output: '31' },
    ],
    constraints: ['0 <= n <= 2^32 - 1'],
    hints: [
      'The simplest approach: repeatedly check the lowest bit (n & 1), count it if set, then shift right — 32 iterations for a 32-bit number.',
      'A faster trick: `n & (n - 1)` clears exactly the lowest set bit — repeating this until n becomes 0 counts the set bits in exactly as many iterations as there are set bits, not 32.',
      'Careful in JS: bitwise operators work on 32-bit SIGNED integers, so `n & (n-1)` behaves correctly for popcount, but avoid naive `>>` sign-extension bugs elsewhere — use `>>>` (unsigned right shift) if shifting a value that could be treated as negative.',
    ],
    approach:
      "Use Brian Kernighan's trick: repeatedly replace n with `n & (n - 1)`, which clears the lowest set bit each time, counting how many iterations it takes for n to reach 0 — that count is exactly the number of set bits.",
    approachHi:
      "Brian Kernighan's trick use karo: baar-baar n ko `n & (n - 1)` se replace karo, jo har baar sabse neeche wala set bit clear kar deta hai, count karte hue ki n ko 0 tak pahunchne mein kitni iterations lagti hain — wahi count exactly set bits ki sankhya hai.",
    timeComplexity: 'O(number of set bits), at most 32',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "`n & (n - 1)` is a genuinely clever bit identity: subtracting 1 from n flips every trailing zero bit to 1 and flips the lowest set bit to 0 (standard binary subtraction borrow behavior), so ANDing the result back with the original n keeps every bit unchanged EXCEPT that lowest set bit, which becomes 0 — the net effect is 'clear the lowest set bit, touch nothing else.' Repeating this operation therefore removes exactly one set bit per iteration, so the number of iterations needed to reach 0 is provably exactly the popcount, without ever needing to examine the 20+ guaranteed-zero high bits a naive 32-iteration scan would waste time on for small numbers.",
    solutionExplanationHi:
      "`n & (n - 1)` ek genuinely clever bit identity hai: n se 1 subtract karna har trailing zero bit ko 1 mein flip kar deta hai aur sabse neeche wale set bit ko 0 mein flip kar deta hai (standard binary subtraction borrow behavior), isliye result ko original n ke saath AND karna har bit ko unchanged rakhta hai SIRF us sabse neeche wale set bit ko chhodkar, jo 0 ban jaata hai — net effect hai 'sabse neeche wala set bit clear karo, aur kuch mat chhuo.' Is operation ko repeat karna isliye per iteration exactly ek set bit remove karta hai, isliye 0 tak pahunchne mein lagi iterations ki sankhya provably exactly popcount hai, un 20+ guaranteed-zero high bits ko examine kiye bina jinhe ek naive 32-iteration scan chhote numbers ke liye waste karta.",
    starter: starter(
      `const n = num(0);

function hammingWeight(n) {
  // return the number of set bits
  return 0;
}

console.log(hammingWeight(n));`,
      `n = num(0)

def hamming_weight(n):
    # return the number of set bits
    return 0

print(hamming_weight(n))`,
    ),
    solution: solution(
      `const n = num(0);
function hammingWeight(n) {
  let count = 0;
  let x = n >>> 0;
  while (x !== 0) {
    x = x & (x - 1);
    count++;
  }
  return count;
}
console.log(hammingWeight(n));`,
      `n = num(0)

def hamming_weight(n):
    count = 0
    x = n
    while x != 0:
        x = x & (x - 1)
        count += 1
    return count

print(hamming_weight(n))`,
    ),
    testCases: [
      sample('11', '3'),
      sample('128', '1'),
      sample('4294967293', '31'),
      hidden('0', '0'),
      hidden('1', '1'),
      hidden('4294967295', '32'),
    ],
  },

  {
    slug: 'counting-bits',
    title: 'Counting Bits',
    category: 'Bit Manipulation',
    difficulty: 'EASY',
    description:
      'Given an integer `n`, return an array `ans` of length `n+1` where `ans[i]` is the number of `1` bits in the binary representation of `i`, for every `i` from 0 to `n`.\n\n**Input**\nLine 1: `n`\n\n**Output**\n`ans`, space-separated.',
    descriptionHi:
      'Ek integer `n` diya hai, length `n+1` ka array `ans` return karo jahan `ans[i]` binary representation of `i` mein `1` bits ki sankhya hai, 0 se `n` tak har `i` ke liye.\n\n**Input**\nLine 1: `n`\n\n**Output**\n`ans`, space-separated.',
    examples: [
      { input: '2', output: '0 1 1' },
      { input: '5', output: '0 1 1 2 1 2' },
    ],
    constraints: ['0 <= n <= 10^5'],
    hints: [
      'Calling the "count set bits" routine independently for every i from 0 to n works, but recomputes shared structure — a DP relation between i and a SMALLER previously-computed value is faster.',
      'Every integer i can be written as `(i >> 1)` with possibly one more bit tacked on at the end — so its popcount is the popcount of `i >> 1` plus whether i\'s own lowest bit is set.',
      'dp[i] = dp[i >> 1] + (i & 1). Both `i >> 1` and the answer for it are already known by the time i is processed, since i >> 1 is always strictly smaller than i (for i > 0).',
    ],
    approach:
      "Build the answer array bottom-up with dp[0] = 0, and for each i from 1 to n: dp[i] = dp[i >> 1] + (i & 1). Right-shifting i by 1 drops its lowest bit, and (i & 1) recovers exactly the bit that was dropped, so their sum reconstructs i's full popcount from a strictly smaller, already-computed subproblem.",
    approachHi:
      "Answer array ko bottom-up banao dp[0] = 0 se, aur i=1 se n tak har i ke liye: dp[i] = dp[i >> 1] + (i & 1). i ko 1 se right-shift karna uska sabse neeche wala bit drop kar deta hai, aur (i & 1) exactly wahi drop hua bit recover kar deta hai, isliye unka sum i ka poora popcount ek strictly chhote, already-computed subproblem se reconstruct kar deta hai.",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) for the output array',
    solutionExplanation:
      "Every non-negative integer's bit pattern is exactly its right-shift-by-1 value's bit pattern with one more bit appended at the low end — this is just what right shift and the low-bit-extraction mask literally mean, not a special property of some numbers. That means popcount is genuinely additive across this specific decomposition: dp[i>>1] already correctly counts every bit i shares with its shifted-down self, and (i & 1) accounts for exactly the one remaining bit that decomposition dropped, with no double-counting or gap possible since those two pieces partition i's bits completely. This turns an O(n log n) (or O(32n)) brute-force scan into a clean O(n) single pass, reusing each smaller answer exactly once.",
    solutionExplanationHi:
      "Har non-negative integer ka bit pattern exactly uske right-shift-by-1 value ke bit pattern jaisa hai bas low end par ek aur bit appended — ye bas wahi hai jo right shift aur low-bit-extraction mask literally matlab rakhte hain, kisi khaas numbers ki special property nahi. Matlab popcount is specific decomposition ke across genuinely additive hai: dp[i>>1] already har wo bit sahi se count karta hai jo i apne shifted-down self ke saath share karta hai, aur (i & 1) exactly us ek bache hue bit ko account karta hai jo decomposition ne drop kiya — koi double-counting ya gap possible nahi kyunki ye do pieces i ke bits ko poori tarah partition karte hain. Ye ek O(n log n) (ya O(32n)) brute-force scan ko ek clean O(n) single pass mein badal deta hai, har chhote answer ko exactly ek baar reuse karte hue.",
    starter: starter(
      `const n = num(0);

function countBits(n) {
  // return the array of popcounts for 0..n
  return [];
}

console.log(countBits(n).join(' '));`,
      `n = num(0)

def count_bits(n):
    # return the list of popcounts for 0..n
    return []

print(" ".join(map(str, count_bits(n))))`,
    ),
    solution: solution(
      `const n = num(0);
function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
  return dp;
}
console.log(countBits(n).join(' '));`,
      `n = num(0)

def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp

print(" ".join(map(str, count_bits(n))))`,
    ),
    testCases: [
      sample('2', '0 1 1'),
      sample('5', '0 1 1 2 1 2'),
      hidden('0', '0'),
      hidden('1', '0 1'),
      hidden('8', '0 1 1 2 1 2 2 3 1'),
    ],
  },

  {
    slug: 'reverse-bits',
    title: 'Reverse Bits',
    category: 'Bit Manipulation',
    difficulty: 'EASY',
    description:
      'Given a 32-bit unsigned integer, return the integer obtained by reversing the order of its 32 bits.\n\n**Input**\nLine 1: `n`\n\n**Output**\nThe bit-reversed value (as an unsigned 32-bit integer).',
    descriptionHi:
      'Ek 32-bit unsigned integer diya hai, uske 32 bits ka order reverse karke jo integer milta hai wo return karo.\n\n**Input**\nLine 1: `n`\n\n**Output**\nBit-reversed value (unsigned 32-bit integer ki tarah).',
    examples: [
      { input: '43261596', output: '964176192' },
      { input: '4294967293', output: '3221225471' },
    ],
    constraints: ['0 <= n <= 2^32 - 1'],
    hints: [
      'Build the result bit by bit: for each of the 32 positions, extract the lowest bit of the (shrinking) input, and place it at the CORRESPONDING mirrored position in the (growing) result.',
      'One clean way: loop 32 times, each time shifting the result LEFT by 1 and OR-ing in the input\'s current lowest bit, then shifting the input RIGHT by 1 — after 32 iterations, the bits have been laid down in exactly reversed order.',
      "Watch for JS's signed 32-bit bitwise semantics: use `>>> 0` (unsigned right shift by 0) on the final result to get a proper non-negative integer for output, since a raw `<<`/`|` result can appear negative once the sign bit is set.",
    ],
    approach:
      'Loop exactly 32 times. In each iteration: shift the accumulating `result` left by 1 (making room for a new bit at the bottom), OR in the current lowest bit of `n` (n & 1), then shift `n` right by 1 to expose the next bit for the following iteration. After 32 iterations, `result` holds all 32 original bits in reversed order; convert to an unsigned value with `>>> 0` before printing.',
    approachHi:
      'Exactly 32 baar loop karo. Har iteration mein: accumulating `result` ko left se 1 shift karo (bottom mein ek nayi bit ke liye jagah banate hue), `n` ka current sabse neeche wala bit OR karo (n & 1), phir agli iteration ke liye agli bit expose karne ke liye `n` ko right se 1 shift karo. 32 iterations ke baad, `result` mein saare 32 original bits reversed order mein hote hain; print karne se pehle `>>> 0` se unsigned value mein convert karo.',
    timeComplexity: 'O(32) = O(1)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "Building the result bit-by-bit using 'shift result left, then OR in the next source bit' is a direct simulation of reversal: the FIRST bit extracted from n (its original lowest bit) ends up shifted furthest to the left by the time all 32 iterations finish (since every subsequent left-shift pushes it one position further up), while the LAST bit extracted (n's original highest bit, exposed only after 31 right-shifts of n) lands at the very bottom untouched by any further shift — exactly the mirrored placement a bit-reversal requires, achieved without ever needing to compute explicit bit positions or indices.",
    solutionExplanationHi:
      "'result ko left shift karo, phir agla source bit OR karo' use karke result ko bit-by-bit banana reversal ka ek direct simulation hai: n se extract hua PEHLA bit (uska original sabse neeche wala bit) saare 32 iterations khatam hone tak sabse zyada left mein shift ho jaata hai (kyunki har baad ka left-shift use ek position aur upar push karta hai), jabki extract hua AAKHRI bit (n ka original sabse upar wala bit, sirf n ke 31 right-shifts ke baad expose hota hai) bilkul neeche land karta hai bina kisi aur shift se touch hue — exactly wahi mirrored placement jo ek bit-reversal ko chahiye, bina kabhi explicit bit positions ya indices compute kiye.",
    starter: starter(
      `const n = num(0);

function reverseBits(n) {
  // return the bit-reversed 32-bit unsigned value
  return 0;
}

console.log(reverseBits(n));`,
      `n = num(0)

def reverse_bits(n):
    # return the bit-reversed 32-bit unsigned value
    return 0

print(reverse_bits(n))`,
    ),
    solution: solution(
      `const n = num(0);
function reverseBits(n) {
  let x = n >>> 0;
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (x & 1);
    x = x >>> 1;
  }
  return result >>> 0;
}
console.log(reverseBits(n));`,
      `n = num(0)

def reverse_bits(n):
    x = n
    result = 0
    for _ in range(32):
        result = (result << 1) | (x & 1)
        x = x >> 1
    return result

print(reverse_bits(n))`,
    ),
    testCases: [
      sample('43261596', '964176192'),
      sample('4294967293', '3221225471'),
      hidden('0', '0'),
      hidden('1', '2147483648'),
      hidden('2147483648', '1'),
    ],
  },

  {
    slug: 'power-of-two',
    title: 'Power of Two',
    category: 'Bit Manipulation',
    difficulty: 'EASY',
    description:
      'Given an integer `n`, determine whether it is a power of two (1, 2, 4, 8, ...).\n\n**Input**\nLine 1: `n`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek integer `n` diya hai, check karo ki wo power of two hai ya nahi (1, 2, 4, 8, ...).\n\n**Input**\nLine 1: `n`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '1', output: 'true' },
      { input: '16', output: 'true' },
      { input: '3', output: 'false' },
    ],
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    hints: [
      'A power of two, in binary, has EXACTLY ONE set bit (1, 10, 100, 1000, ...) — so this reduces to "does n have exactly one set bit", plus a check that n is positive (0 and negative numbers are never powers of two).',
      'Reuse the `n & (n - 1)` trick from Number of 1 Bits: it clears the lowest set bit. If n had exactly one set bit to begin with, `n & (n - 1)` becomes exactly 0.',
      'Edge case: n = 0 must be excluded explicitly, since `0 & (0 - 1)` is also 0 despite 0 not being a power of two (it has zero set bits, not one).',
    ],
    approach:
      'n is a power of two if and only if n > 0 AND `(n & (n - 1)) === 0`. The positivity check excludes 0 and negative numbers; the bit trick checks that exactly one bit is set (a power of two in binary is a single 1 followed by zeros, and clearing its one set bit necessarily produces 0).',
    approachHi:
      'n power of two hai agar aur sirf agar n > 0 AUR `(n & (n - 1)) === 0`. Positivity check 0 aur negative numbers ko exclude karta hai; bit trick check karta hai ki exactly ek bit set hai (binary mein power of two ek single 1 hai jiske baad zeros hain, aur uske ek set bit ko clear karna zaroori taur par 0 produce karta hai).',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "A power of two is, by definition, a number whose binary representation has exactly one set bit — no other integer shape produces that property. The `n & (n-1) == 0` check is a direct, constant-time test for 'exactly one set bit': the same bit-clearing identity used in Number of 1 Bits clears the SINGLE set bit when there's only one, leaving nothing else to survive the AND, so the result is 0 precisely in that one-set-bit case and provably nonzero whenever two or more bits are set (since at least one other bit remains after clearing just the lowest one) — turning what could be an O(32) popcount check into an O(1) single bitwise comparison.",
    solutionExplanationHi:
      "Power of two, definition se, ek aisa number hai jiski binary representation mein exactly ek set bit hai — koi aur integer shape ye property produce nahi karti. `n & (n-1) == 0` check 'exactly ek set bit' ke liye ek direct, constant-time test hai: Number of 1 Bits mein use hui wahi bit-clearing identity SINGLE set bit ko clear kar deti hai jab sirf ek hi ho, AND survive karne ke liye kuch aur nahi bachta, isliye result exactly us one-set-bit case mein 0 hota hai aur provably nonzero hota hai jab bhi do ya zyada bits set hon (kyunki sirf sabse neeche wala clear karne ke baad kam se kam ek aur bit bacha rehta hai) — jo ek O(32) popcount check ho sakta tha use O(1) single bitwise comparison mein badal deta hai.",
    starter: starter(
      `const n = num(0);

function isPowerOfTwo(n) {
  // return true or false
  return false;
}

console.log(isPowerOfTwo(n));`,
      `n = num(0)

def is_power_of_two(n):
    # return True or False
    return False

print("true" if is_power_of_two(n) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
console.log(isPowerOfTwo(n));`,
      `n = num(0)

def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

print("true" if is_power_of_two(n) else "false")`,
    ),
    testCases: [
      sample('1', 'true'),
      sample('16', 'true'),
      sample('3', 'false'),
      hidden('0', 'false'),
      hidden('-16', 'false'),
      hidden('1073741824', 'true'),
    ],
  },

  {
    slug: 'bitwise-and-of-numbers-range',
    title: 'Bitwise AND of Numbers Range',
    category: 'Bit Manipulation',
    difficulty: 'MEDIUM',
    description:
      'Given two integers `left` and `right` (left <= right), return the bitwise AND of every number in the inclusive range `[left, right]`.\n\n**Input**\nLine 1: `left right`\n\n**Output**\nThe bitwise AND of the whole range.',
    descriptionHi:
      'Do integers `left` aur `right` (left <= right) diye hain, inclusive range `[left, right]` ke har number ka bitwise AND return karo.\n\n**Input**\nLine 1: `left right`\n\n**Output**\nPoore range ka bitwise AND.',
    examples: [
      { input: '5 7', output: '4' },
      { input: '0 0', output: '0' },
      { input: '1 2147483647', output: '0' },
    ],
    constraints: ['0 <= left <= right <= 2^31 - 1'],
    hints: [
      'ANDing a large consecutive range together zeros out almost everything — any bit position that DIFFERS anywhere across the range must become 0 in the result, since AND requires every number to agree.',
      "A bit position can only survive (stay 1 in every number in the range) if left and right share that bit position identically — which really means left and right share the same COMMON PREFIX of high bits, and the range never crosses a boundary that would flip a bit in between.",
      'Repeatedly right-shift both left and right by 1 together, counting the shifts, until they become equal — at that point they share their entire remaining common prefix. Then left-shift that common prefix back by the same count to restore the correct bit positions, with all lower bits correctly zeroed.',
    ],
    approach:
      "Right-shift `left` and `right` together, one bit at a time, counting the number of shifts, until they become equal — that common value is the shared binary prefix of every number in the original range (any bit below where they first differed is guaranteed to take both 0 and 1 somewhere in the range, so AND zeros it out). Left-shift that common prefix back by the recorded shift count to restore it to the correct bit positions (refilling the lower bits with 0, which is exactly the correct AND result for those positions).",
    approachHi:
      "`left` aur `right` ko saath mein, ek baar mein ek bit, right-shift karo, shifts ki sankhya count karte hue, jab tak wo equal na ho jaayein — wo common value original range ke har number ka shared binary prefix hai (jahan wo pehli baar differ hue us se neeche koi bhi bit guaranteed hai ki range mein kahin 0 aur kahin 1 dono hoga, isliye AND use zero kar deta hai). Us common prefix ko recorded shift count se wapas left-shift karo taaki sahi bit positions restore ho jaayein (lower bits ko 0 se refill karte hue, jo un positions ke liye exactly sahi AND result hai).",
    timeComplexity: 'O(log(right))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "Any bit position where left and right's binary representations first diverge marks a point where SOME number strictly between them must have a 0 there and some other number must have a 1 there (since incrementing through the range necessarily flips that bit back and forth below the point of divergence) — and ANDing together a set that contains both a 0 and a 1 at some position always zeros that position, regardless of every other number's value there. This means only the bits ABOVE the first point of divergence (the shared prefix) can possibly survive the AND across the whole range; repeatedly shifting both numbers right until they match is a direct, efficient way to discover exactly where that divergence point is (in O(log(right)) shifts, since each shift discards one bit level, rather than iterating every number in a potentially huge range).",
    solutionExplanationHi:
      "Wo bit position jahan left aur right ki binary representations pehli baar diverge karti hain ek aisa point mark karti hai jahan unke beech koi number wahan zaroori taur par 0 rakhta hai aur koi doosra number 1 rakhta hai (kyunki range mein increment karna divergence point se neeche us bit ko zaroori taur par flip karta rehta hai) — aur ek aise set ko AND karna jismein kisi position par 0 aur 1 dono hon hamesha us position ko zero kar deta hai, wahan har doosre number ki value chahe kuch bhi ho. Matlab sirf divergence ke pehle point ke UPAR wale bits (shared prefix) hi poore range ke AND mein bach sakte hain; dono numbers ko baar-baar right shift karke tab tak jab tak wo match na karein, exactly ye pata lagane ka ek direct, efficient tarika hai ki wo divergence point kahan hai (O(log(right)) shifts mein, kyunki har shift ek bit level discard karta hai, ek potentially huge range mein har number ko iterate karne ke bajaye).",
    starter: starter(
      `const [left, right] = nums(0);

function rangeBitwiseAnd(left, right) {
  // return the AND of the whole [left, right] range
  return 0;
}

console.log(rangeBitwiseAnd(left, right));`,
      `left, right = nums(0)

def range_bitwise_and(left, right):
    # return the AND of the whole [left, right] range
    return 0

print(range_bitwise_and(left, right))`,
    ),
    solution: solution(
      `const [left, right] = nums(0);
function rangeBitwiseAnd(left, right) {
  let shift = 0;
  while (left < right) {
    left >>= 1;
    right >>= 1;
    shift++;
  }
  return left << shift;
}
console.log(rangeBitwiseAnd(left, right));`,
      `left, right = nums(0)

def range_bitwise_and(left, right):
    shift = 0
    while left < right:
        left >>= 1
        right >>= 1
        shift += 1
    return left << shift

print(range_bitwise_and(left, right))`,
    ),
    testCases: [
      sample('5 7', '4'),
      sample('0 0', '0'),
      sample('1 2147483647', '0'),
      hidden('5 5', '5'),
      hidden('8 8', '8'),
      hidden('4 7', '4'),
    ],
  },

  {
    slug: 'single-number-ii',
    title: 'Single Number II',
    category: 'Bit Manipulation',
    difficulty: 'MEDIUM',
    description:
      'Given an array where every number appears exactly three times except one number which appears exactly once, find that single number.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe number that appears once.',
    descriptionHi:
      'Ek array diya hai jahan har number exactly teen baar appear hota hai sivaye ek number ke jo exactly ek baar appear hota hai, wo single number dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nWo number jo ek baar appear hota hai.',
    examples: [
      { input: '5\n2 2 3 2 2', output: '3' },
      { input: '4\n0 1 0 1', output: '1' },
    ],
    constraints: ['1 <= n <= 3*10^4 + 1', 'array length is exactly 3k+1 for some k'],
    hints: [
      'Plain XOR (which solves "every number appears twice except one") does NOT work here, since XORing a value with itself three times leaves the value itself, not 0.',
      'Count how many numbers have a 1 bit at each of the 32 bit positions independently, across the whole array.',
      'For a bit position where the single number has a 1, the total count of 1s at that position across the array is (a multiple of 3) + 1 — so the count mod 3 at each position directly reconstructs the single number bit by bit.',
    ],
    approach:
      'For each of the 32 bit positions independently, sum up how many numbers in the array have a 1 at that position. Since every number except the single one is tripled, that sum is a multiple of 3 plus (1 if the single number has a 1 at that position, else 0). Taking each position\'s count modulo 3 recovers exactly the single number\'s bit at that position; combine all 32 recovered bits to reconstruct the full answer.',
    approachHi:
      '32 bit positions mein se har ek ke liye independently, count karo ki array mein kitne numbers us position par 1 rakhte hain. Kyunki single number ke alawa har number triple hota hai, wo sum (3 ka multiple) + (1 agar single number us position par 1 rakhta hai, warna 0) hota hai. Har position ka count mod 3 lena exactly single number ka us position ka bit recover kar deta hai; saare 32 recovered bits combine karke poora answer reconstruct karo.',
    timeComplexity: 'O(32 * n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "The core insight is that bit counting is perfectly linear and position-independent: whether a number contributes a 1 or 0 at bit position k is completely unaffected by what any other bit position holds, so tallying position k across the whole array in isolation is always valid, regardless of how many distinct numbers exist. Since triples always contribute a multiple of 3 to any single position's tally (three identical numbers means that position is either 0+0+0 or 1+1+1, both multiples of 3), the ONLY thing that can push a position's total to a non-multiple-of-3 is the lone single number's own bit at that position — so reducing every position's count modulo 3 isolates exactly that one number's contribution, one bit at a time, with the triples contributing nothing to interfere.",
    solutionExplanationHi:
      "Core insight ye hai ki bit counting perfectly linear aur position-independent hai: ek number bit position k par 1 ya 0 contribute karta hai ye kisi bhi doosre bit position ki value se bilkul unaffected hai, isliye poore array mein position k ko isolation mein tally karna hamesha valid hai, kitne bhi distinct numbers exist karein. Kyunki triples hamesha kisi bhi single position ki tally mein 3 ka multiple contribute karte hain (teen identical numbers ka matlab hai wo position ya to 0+0+0 hai ya 1+1+1, dono 3 ke multiples), sirf wahi cheez jo ek position ka total non-multiple-of-3 bana sakti hai wo hai akele single number ka apna bit us position par — isliye har position ka count modulo 3 lena exactly us ek number ki contribution isolate karta hai, ek bit at a time, triples kuch bhi interfere nahi karte.",
    starter: starter(
      `const n = num(0);
const arr = nums(1);

function singleNumber(nums) {
  // return the number that appears exactly once
  return 0;
}

console.log(singleNumber(arr));`,
      `n = num(0)
arr = nums(1)

def single_number(nums):
    # return the number that appears exactly once
    return 0

print(single_number(arr))`,
    ),
    solution: solution(
      `const n = num(0);
const arr = nums(1);
function singleNumber(nums) {
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let count = 0;
    for (const x of nums) {
      count += (x >>> bit) & 1;
    }
    if (count % 3 !== 0) result |= (1 << bit);
  }
  return result;
}
console.log(singleNumber(arr));`,
      `n = num(0)
arr = nums(1)

def single_number(nums):
    result = 0
    for bit in range(32):
        count = sum((x >> bit) & 1 for x in nums)
        if count % 3 != 0:
            result |= (1 << bit)
    if result >= 2 ** 31:
        result -= 2 ** 32
    return result

print(single_number(arr))`,
    ),
    testCases: [
      sample('5\n2 2 3 2 2', '3'),
      sample('4\n0 1 0 1', '1'),
      hidden('1\n99', '99'),
      hidden('7\n5 5 5 7 9 9 9', '7'),
      hidden('4\n0 0 0 5', '5'),
    ],
  },

  {
    slug: 'sum-of-two-integers',
    title: 'Sum of Two Integers',
    category: 'Bit Manipulation',
    difficulty: 'MEDIUM',
    description:
      'Given two integers `a` and `b`, compute their sum WITHOUT using the `+` or `-` operators.\n\n**Input**\nLine 1: `a b`\n\n**Output**\n`a + b`.',
    descriptionHi:
      'Do integers `a` aur `b` diye hain, `+` ya `-` operators use kiye bina unka sum compute karo.\n\n**Input**\nLine 1: `a b`\n\n**Output**\n`a + b`.',
    examples: [
      { input: '1 2', output: '3' },
      { input: '2 3', output: '5' },
      { input: '-5 7', output: '2' },
    ],
    constraints: ['-1000 <= a, b <= 1000'],
    hints: [
      'This is exactly how hardware adders work: XOR gives the sum of two bits ignoring any carry, and AND gives exactly the positions where a carry is generated.',
      'A carry generated at bit position k must be added in at position k+1 — so shift the AND result left by 1 to represent "carry ready to be added in".',
      'Repeat: keep replacing (a, b) with (a XOR b, carry << 1) until the carry becomes 0 — at that point a XOR b alone is the final sum, with no more carries left to propagate.',
    ],
    approach:
      'Loop while `b` (representing the current carry-to-add) is nonzero: compute carry = (a & b) << 1 (every bit position where both a and b currently have a 1 generates a carry into the next position), then update a = a XOR b (the sum ignoring carry) and b = carry. When b finally reaches 0, a holds the complete sum.',
    approachHi:
      'Jab tak `b` (current carry-to-add represent karta hai) nonzero hai loop karo: carry = (a & b) << 1 compute karo (har bit position jahan a aur b dono ka current 1 hai agli position mein ek carry generate karta hai), phir a = a XOR b update karo (carry ignore karke sum) aur b = carry. Jab b aakhir 0 tak pahunche, a mein complete sum hota hai.',
    timeComplexity: 'O(32) = O(1)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "This directly mirrors how binary addition actually works at the hardware level, without relying on the language's own `+` operator: at any single bit position, adding two bits produces a result bit (which is exactly XOR — 0+0=0, 1+0=1, 0+1=1, 1+1=0-with-carry) and possibly a carry into the NEXT position (which is exactly AND — a carry is generated only when BOTH bits are 1). Repeating 'XOR gives this round's partial sum, shifted AND gives next round's carry-to-add' converges because each iteration either produces no more carry (loop ends) or pushes the carry strictly one bit position higher, and a 32-bit number can only accumulate carries a bounded number of times before running out of bit positions to carry into.",
    solutionExplanationHi:
      "Ye directly mirror karta hai ki binary addition hardware level par actually kaise kaam karta hai, language ke apne `+` operator par relied hue bina: kisi bhi single bit position par, do bits add karna ek result bit produce karta hai (jo exactly XOR hai — 0+0=0, 1+0=1, 0+1=1, 1+1=0-with-carry) aur possibly agli position mein ek carry (jo exactly AND hai — carry sirf tabhi generate hota hai jab DONO bits 1 hon). 'XOR is round ka partial sum deta hai, shifted AND agle round ka carry-to-add deta hai' repeat karna converge karta hai kyunki har iteration ya to aur carry produce nahi karta (loop khatam) ya carry ko strictly ek bit position aur upar push karta hai, aur ek 32-bit number carry ko sirf bounded number of times accumulate kar sakta hai carry karne ke liye bit positions khatam hone se pehle.",
    starter: starter(
      `const [a, b] = nums(0);

function getSum(a, b) {
  // return a + b without using + or -
  return 0;
}

console.log(getSum(a, b));`,
      `a, b = nums(0)

def get_sum(a, b):
    # return a + b without using + or -
    return 0

print(get_sum(a, b))`,
    ),
    solution: solution(
      `const [a, b] = nums(0);
function getSum(a, b) {
  let x = a, y = b;
  while (y !== 0) {
    const carry = (x & y) << 1;
    x = x ^ y;
    y = carry;
  }
  return x;
}
console.log(getSum(a, b));`,
      `a, b = nums(0)

def get_sum(a, b):
    mask = 0xFFFFFFFF
    x, y = a & mask, b & mask
    while y != 0:
        carry = (x & y) << 1
        x = (x ^ y) & mask
        y = carry & mask
    if x >= 2 ** 31:
        x = ~(x ^ mask)
    return x

print(get_sum(a, b))`,
    ),
    testCases: [
      sample('1 2', '3'),
      sample('2 3', '5'),
      sample('-5 7', '2'),
      hidden('0 0', '0'),
      hidden('-1 -1', '-2'),
      hidden('100 -100', '0'),
    ],
  },

  {
    slug: 'maximum-xor-of-two-numbers',
    title: 'Maximum XOR of Two Numbers in an Array',
    category: 'Bit Manipulation',
    difficulty: 'HARD',
    description:
      'Given an array of integers, find the maximum possible XOR of any two numbers in the array.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nThe maximum XOR of any pair.',
    descriptionHi:
      'Integers ka ek array diya hai, array ke kisi bhi do numbers ka maximum possible XOR dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nKisi bhi pair ka maximum XOR.',
    examples: [
      { input: '6\n3 10 5 25 2 8', output: '28' },
      { input: '2\n0 0', output: '0' },
    ],
    constraints: ['2 <= n <= 2*10^5', '0 <= nums[i] <= 2^31 - 1'],
    hints: [
      "Build the answer greedily from the HIGHEST bit down: at each step, assume the answer's bits so far (`candidate`) can be extended with a 1 at the current bit position, and check if two numbers in the array actually achieve that candidate prefix when XORed.",
      'Checking "do two numbers achieve this XOR prefix" is fast using a hash set of every number\'s prefix (truncated to the bits decided so far): for each number\'s prefix p, check whether `candidate XOR p` is also in the set — if so, some pair achieves this candidate.',
      "This avoids needing an actual trie: the working prefix set is recomputed each bit level (small, bounded work), rather than maintaining a persistent tree structure, while still achieving the same greedy highest-bit-first guarantee.",
    ],
    approach:
      "Process bit positions from the highest (30, since inputs fit in 31 bits) down to 0. Maintain `answer`, the best XOR found using bits decided so far. At each bit position, form `candidate = answer | (1 << bit)` (tentatively assume this bit can also be set) and compute the set of all numbers' prefixes truncated to the bits processed so far (including this one). For each prefix p in that set, check if `candidate XOR p` is also in the set — if some pair achieves it, `answer = candidate` (lock in this bit); otherwise leave `answer` unchanged (this bit cannot be achieved) and move to the next bit. The final `answer` is the maximum achievable XOR.",
    approachHi:
      "Bit positions ko highest (30, kyunki inputs 31 bits mein fit hote hain) se 0 tak process karo. `answer` maintain karo, jo ab tak decide hui bits se best XOR hai. Har bit position par, `candidate = answer | (1 << bit)` banao (tentatively maano ki ye bit bhi set ho sakta hai) aur saare numbers ke prefixes ka set compute karo jo ab tak process hui bits (isko bhi shaamil karke) tak truncate hue hain. Us set ke har prefix p ke liye, check karo ki `candidate XOR p` bhi set mein hai ya nahi — agar koi pair use achieve karta hai, `answer = candidate` (is bit ko lock kar do); warna `answer` unchanged chhod do (ye bit achieve nahi ho sakta) aur agli bit par jao. Final `answer` maximum achievable XOR hai.",
    timeComplexity: 'O(32 * n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      "Maximizing XOR is fundamentally a greedy highest-bit-first problem: a 1 at a higher bit position always outweighs any combination of lower bits (exactly like standard binary place value), so the correct strategy is to lock in the highest bit possible first, then the next highest GIVEN that choice, and so on — never revisiting a higher decision once made. The hash-set trick tests, at each bit level, whether the tentative extended candidate is actually achievable by SOME pair without needing to identify which specific pair — if number x's truncated prefix is in the set, and `candidate XOR x` is ALSO some other truncated prefix y in the set, then y XOR x reproduces exactly `candidate` restricted to the bits considered so far, proving the candidate is achievable; if no such y exists, no pair can hit this candidate at this bit level, so it must be abandoned before moving to the next bit.",
    solutionExplanationHi:
      "XOR maximize karna fundamentally ek greedy highest-bit-first problem hai: ek higher bit position par 1 hamesha lower bits ke kisi bhi combination se zyada bhaari hota hai (bilkul standard binary place value jaisa), isliye correct strategy hai pehle sabse highest possible bit lock karna, phir us choice ko given rakhte hue agla highest, aur aage waise hi — ek baar ki gayi higher decision ko kabhi revisit mat karo. Hash-set trick har bit level par test karta hai ki kya tentative extended candidate genuinely kisi PAIR se achievable hai, ye identify kiye bina ki kaunsa specific pair — agar number x ka truncated prefix set mein hai, aur `candidate XOR x` BHI set mein koi doosra truncated prefix y hai, to y XOR x exactly `candidate` ko ab tak consider hui bits tak restrict karke reproduce karta hai, jo candidate ko achievable prove karta hai; agar aisa koi y exist nahi karta, koi pair is bit level par candidate hit nahi kar sakta, isliye agli bit par jaane se pehle use abandon karna zaroori hai.",
    starter: starter(
      `const n = num(0);
const arr = nums(1);

function findMaximumXOR(nums) {
  // return the maximum XOR of any pair
  return 0;
}

console.log(findMaximumXOR(arr));`,
      `n = num(0)
arr = nums(1)

def find_maximum_xor(nums):
    # return the maximum XOR of any pair
    return 0

print(find_maximum_xor(arr))`,
    ),
    solution: solution(
      `const n = num(0);
const arr = nums(1);
function findMaximumXOR(nums) {
  let answer = 0;
  let mask = 0;
  for (let bit = 30; bit >= 0; bit--) {
    mask |= (1 << bit);
    const prefixes = new Set();
    for (const x of nums) prefixes.add(x & mask);
    const candidate = answer | (1 << bit);
    let found = false;
    for (const p of prefixes) {
      if (prefixes.has(candidate ^ p)) { found = true; break; }
    }
    if (found) answer = candidate;
  }
  return answer;
}
console.log(findMaximumXOR(arr));`,
      `n = num(0)
arr = nums(1)

def find_maximum_xor(nums):
    answer = 0
    mask = 0
    for bit in range(30, -1, -1):
        mask |= (1 << bit)
        prefixes = {x & mask for x in nums}
        candidate = answer | (1 << bit)
        if any((candidate ^ p) in prefixes for p in prefixes):
            answer = candidate
    return answer

print(find_maximum_xor(arr))`,
    ),
    testCases: [
      sample('6\n3 10 5 25 2 8', '28'),
      sample('2\n0 0', '0'),
      hidden('2\n1 2', '3'),
      hidden('3\n0 1 2', '3'),
      hidden('4\n8 10 2 3', '11'),
    ],
  },
];
