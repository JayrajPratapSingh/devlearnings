import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Arrays — expansion batch. Rounds out the Arrays category beyond the original
 * four (Two Sum, Best Time to Buy/Sell I, Maximum Subarray, Move Zeroes) with
 * the rest of the classic array toolkit: prefix/suffix products, in-place
 * matrix transforms, and the circular-Kadane variant.
 */
export const dsaExtraArrays: SeedProblem[] = [
  {
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Given an array `nums`, return an array `answer` where `answer[i]` is the product of every element except `nums[i]`, without using division and in O(n) time.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe answer array, space-separated.',
    descriptionHi:
      'Ek array `nums` diya hai. Aisa array `answer` return karo jahan `answer[i]` `nums[i]` ko chhod kar baaki sab ka product ho — division use kiye bina, O(n) time mein.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nAnswer array, space se separate.',
    examples: [
      { input: '4\n1 2 3 4', output: '24 12 8 6' },
      { input: '5\n-1 1 0 -3 3', output: '0 0 9 0 0' },
    ],
    constraints: ['2 <= n <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix/suffix fits in a 32-bit integer'],
    hints: [
      'Division is banned, but a zero in the array would break it anyway.',
      'answer[i] = (product of everything to the left of i) * (product of everything to the right of i).',
      'Build the left-products in one pass, then fold in the right-products in a second pass using a single running variable.',
    ],
    approach:
      'Two passes, O(1) extra space beyond the output. First pass left to right fills `answer[i]` with the product of all elements before `i`. Second pass right to left multiplies in the product of all elements after `i`, carried in one running variable.',
    approachHi:
      'Do passes, output ke alawa O(1) extra space. Pehla pass left-to-right: `answer[i]` mein `i` se pehle ke sab elements ka product bhar do. Doosra pass right-to-left: ek running variable mein `i` ke baad ka product rakho aur usse multiply kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra (output array not counted)',
    solutionExplanation:
      'Division would compute total/nums[i], but that fails the moment any element is 0 and the problem explicitly disallows it. Splitting the product into "everything left of i" and "everything right of i" sidesteps division entirely, and both halves can be accumulated in a single left-to-right and right-to-left sweep, so no extra array beyond the output is needed for the right-products.',
    solutionExplanationHi:
      'Division se total/nums[i] nikal sakte the, par ek bhi 0 hone par ye fail ho jata aur problem division allow bhi nahi karti. Product ko "i se pehle" aur "i ke baad" mein todne se division ki zaroorat hi khatam ho jaati hai, aur dono hisse ek left-to-right aur ek right-to-left pass mein ban jaate hain — right-products ke liye alag array ki zaroorat nahi.',
    starter: starter(
      `const arr = nums(1);

function productExceptSelf(arr) {
  // your code here
}

console.log(productExceptSelf(arr).join(' '));`,
      `arr = nums(1)

def product_except_self(arr):
    # your code here
    pass

print(" ".join(map(str, product_except_self(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const n = arr.length;
const ans = new Array(n).fill(1);
for (let i = 1; i < n; i++) ans[i] = ans[i - 1] * arr[i - 1];
let right = 1;
for (let i = n - 1; i >= 0; i--) { ans[i] *= right; right *= arr[i]; }
console.log(ans.join(' '));`,
      `arr = nums(1)
n = len(arr)
ans = [1] * n
for i in range(1, n):
    ans[i] = ans[i - 1] * arr[i - 1]
right = 1
for i in range(n - 1, -1, -1):
    ans[i] *= right
    right *= arr[i]
print(" ".join(map(str, ans)))`,
    ),
    testCases: [
      sample('4\n1 2 3 4', '24 12 8 6'),
      sample('5\n-1 1 0 -3 3', '0 0 9 0 0'),
      hidden('2\n3 5', '5 3'),
      hidden('3\n0 0 5', '0 0 0'),
      hidden('4\n2 2 2 2', '8 8 8 8'),
      hidden('3\n-1 -2 -3', '6 3 2'),
    ],
  },

  {
    slug: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Given an integer array, find the contiguous subarray that has the largest product and return that product.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe maximum product.',
    descriptionHi:
      'Ek integer array diya hai. Aisa contiguous subarray dhoondo jiska product sabse zyada ho, aur wo product return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nMaximum product.',
    examples: [
      { input: '4\n2 3 -2 4', output: '6', explanation: '[2,3] has product 6, the best available.' },
      { input: '3\n-2 0 -1', output: '0' },
    ],
    constraints: ['1 <= n <= 2*10^4', '-10 <= nums[i] <= 10'],
    hints: [
      'Kadane\'s sum trick does not work directly — a negative times a negative flips small into large.',
      'Track both a running maximum AND a running minimum product ending at i.',
      'A negative number swaps the roles of the running max and min — the min can become the next max.',
    ],
    approach:
      'Track `curMax` and `curMin`, the best and worst product ending at the current index. At each step, if `nums[i]` is negative, swap `curMax`/`curMin` first (a negative number turns the smallest product into the largest), then update both against `nums[i]` alone and the running answer.',
    approachHi:
      '`curMax` aur `curMin` track karo — current index tak ka best aur worst product. Har step par agar `nums[i]` negative hai to pehle `curMax`/`curMin` swap kar do (negative number sabse chhote product ko sabse bada bana deta hai), phir dono ko `nums[i]` akela aur purane product se compare karke update karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Sums only ever grow with a positive addend, but products can flip sign entirely on one negative factor — so the best product ending here might come from the *worst* (most negative) product ending at the previous index. Carrying both a running max and running min captures that flip: a min can become tomorrow\'s max the instant a negative number appears.',
    solutionExplanationHi:
      'Sum mein sirf positive add karne se hi barhta hai, par product ek hi negative factor se poora sign flip kar deta hai — isliye yahan tak ka best product pichle index ke *worst* (sabse negative) product se aa sakta hai. Running max aur running min dono rakhne se ye flip pakad mein aata hai: negative number aate hi min hi kal ka max ban jata hai.',
    starter: starter(
      `const arr = nums(1);

function maxProduct(arr) {
  // your code here
}

console.log(maxProduct(arr));`,
      `arr = nums(1)

def max_product(arr):
    # your code here
    pass

print(max_product(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let curMax = arr[0], curMin = arr[0], best = arr[0];
for (let i = 1; i < arr.length; i++) {
  const x = arr[i];
  if (x < 0) { [curMax, curMin] = [curMin, curMax]; }
  curMax = Math.max(x, curMax * x);
  curMin = Math.min(x, curMin * x);
  best = Math.max(best, curMax);
}
console.log(best);`,
      `arr = nums(1)
cur_max = cur_min = best = arr[0]
for x in arr[1:]:
    if x < 0:
        cur_max, cur_min = cur_min, cur_max
    cur_max = max(x, cur_max * x)
    cur_min = min(x, cur_min * x)
    best = max(best, cur_max)
print(best)`,
    ),
    testCases: [
      sample('4\n2 3 -2 4', '6'),
      sample('3\n-2 0 -1', '0'),
      hidden('1\n-5', '-5'),
      hidden('4\n-2 3 -4 5', '120'),
      hidden('5\n2 -5 -2 -4 3', '24'),
      hidden('2\n0 2', '2'),
    ],
  },

  {
    slug: 'find-all-duplicates',
    title: 'Find All Duplicates in an Array',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Given an array of `n` integers where every value is in `[1, n]` and each appears either once or twice, return all values that appear twice, in ascending order.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe duplicated values in ascending order, space-separated (empty line if none).',
    descriptionHi:
      'Ek array mein `n` integers hain, har value `[1, n]` range mein hai aur har ek ek ya do baar aata hai. Wo saare values ascending order mein return karo jo do baar aate hain.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nDuplicate values ascending order mein, space se separate (agar koi nahi to khaali line).',
    examples: [
      { input: '8\n4 3 2 7 8 2 3 1', output: '2 3' },
      { input: '3\n1 1 2', output: '1' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= nums[i] <= n', 'Each value appears once or twice', 'O(n) time, O(1) extra space (beyond the output)'],
    hints: [
      'A hash set solves it in O(n) space — can you do O(1) extra space?',
      'Because every value is in [1, n], value `v` can index cell `v - 1`.',
      'Visit index `|nums[i]| - 1` and negate it. If it is already negative, `nums[i]` is a duplicate.',
    ],
    approach:
      'In-place index marking. For each `nums[i]`, look at `nums[|nums[i]| - 1]`: if it is positive, negate it (marks "value |nums[i]| seen once"); if it is already negative, `|nums[i]|` is a duplicate — record it. Restoring the array afterward is unnecessary here since only the output matters.',
    approachHi:
      'In-place index marking. Har `nums[i]` ke liye `nums[|nums[i]| - 1]` dekho: agar positive hai to negate kar do (matlab "value |nums[i]| ek baar dekh liya"); agar pehle se negative hai to `|nums[i]|` duplicate hai — record kar lo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    solutionExplanation:
      'Because every value lies in [1, n], the array itself has exactly one cell per possible value — the sign of `nums[v-1]` can be repurposed as a "have I seen v" bit with zero extra memory. The first visit flips it negative; a second visit finds it already negative, which is exactly the duplicate signal, discovered in a single left-to-right pass.',
    solutionExplanationHi:
      'Har value [1, n] mein hai, isliye array mein har possible value ke liye exactly ek cell hai — `nums[v-1]` ka sign hi "v dekh liya" ka bit ban sakta hai, bina extra memory ke. Pehli visit negative bana deti hai; doosri visit pehle se negative paati hai — yahi duplicate ka signal hai, ek hi left-to-right pass mein.',
    starter: starter(
      `const arr = nums(1);

function findDuplicates(arr) {
  // return an array of values that appear twice, ascending
}

console.log(findDuplicates(arr).join(' '));`,
      `arr = nums(1)

def find_duplicates(arr):
    # return a list of values that appear twice, ascending
    return []

print(" ".join(map(str, find_duplicates(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const dups = [];
for (let i = 0; i < arr.length; i++) {
  const idx = Math.abs(arr[i]) - 1;
  if (arr[idx] < 0) dups.push(idx + 1);
  else arr[idx] = -arr[idx];
}
dups.sort((a, b) => a - b);
console.log(dups.join(' '));`,
      `arr = nums(1)
dups = []
for x in arr:
    idx = abs(x) - 1
    if arr[idx] < 0:
        dups.append(idx + 1)
    else:
        arr[idx] = -arr[idx]
print(" ".join(map(str, sorted(dups))))`,
    ),
    testCases: [
      sample('8\n4 3 2 7 8 2 3 1', '2 3'),
      sample('3\n1 1 2', '1'),
      hidden('1\n1', ''),
      hidden('4\n1 1 2 2', '1 2'),
      hidden('5\n1 2 3 4 5', ''),
      hidden('6\n3 1 3 4 5 5', '3 5'),
    ],
  },

  {
    slug: 'missing-number',
    title: 'Missing Number',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Given an array of `n` distinct numbers taken from the range `[0, n]`, find the one number in the range that is missing.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe missing number.',
    descriptionHi:
      '`n` distinct numbers ka array diya hai, jo range `[0, n]` se liye gaye hain. Us range ka wo ek number dhoondo jo missing hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nMissing number.',
    examples: [
      { input: '3\n3 0 1', output: '2' },
      { input: '2\n0 1', output: '2' },
    ],
    constraints: ['1 <= n <= 10^4', '0 <= nums[i] <= n', 'All values distinct'],
    hints: [
      'The full range [0, n] has a known sum via the arithmetic series formula.',
      'The missing number is exactly that expected sum minus the actual sum of the array.',
      'XOR-ing every index and every value together also works and avoids overflow worries.',
    ],
    approach:
      'Compute the expected sum of `0..n` via `n*(n+1)/2`, subtract the actual sum of the array; the difference is the missing number.',
    approachHi:
      '`0..n` ka expected sum `n*(n+1)/2` se nikalo, usmein se array ka actual sum ghata do; jo bacha wahi missing number hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Every integer from 0 to n should appear exactly once; summing them via the closed-form formula gives the total the array *would* have if nothing were missing. Whatever the real array sums to falls short by precisely the missing value, so one subtraction after one O(n) sum finds it.',
    solutionExplanationHi:
      '0 se n tak har integer exactly ek baar hona chahiye; closed-form formula se unka sum nikalne se pata chalta hai ki agar kuch missing na hota to total kya hota. Real array ka sum usse exactly missing value jitna kam hoga — ek O(n) sum ke baad ek subtraction se jawab mil jata hai.',
    starter: starter(
      `const arr = nums(1);

function missingNumber(arr) {
  // your code here
}

console.log(missingNumber(arr));`,
      `arr = nums(1)

def missing_number(arr):
    # your code here
    pass

print(missing_number(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
const n = arr.length;
const expected = (n * (n + 1)) / 2;
const actual = arr.reduce((a, b) => a + b, 0);
console.log(expected - actual);`,
      `arr = nums(1)
n = len(arr)
expected = n * (n + 1) // 2
print(expected - sum(arr))`,
    ),
    testCases: [
      sample('3\n3 0 1', '2'),
      sample('2\n0 1', '2'),
      hidden('1\n0', '1'),
      hidden('1\n1', '0'),
      hidden('5\n9 6 4 2 3 5 7 0 1', '8'),
      hidden('4\n0 1 2 3', '4'),
    ],
  },

  {
    slug: 'rotate-array',
    title: 'Rotate Array',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Rotate an array to the right by `k` steps.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe rotated array, space-separated.',
    descriptionHi:
      'Ek array ko right side `k` steps se rotate karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nRotated array, space se separate.',
    examples: [
      { input: '7\n1 2 3 4 5 6 7\n3', output: '5 6 7 1 2 3 4' },
      { input: '4\n-1 -100 3 99\n2', output: '3 99 -1 -100' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= k <= 10^5', '`k` can exceed `n`'],
    hints: [
      '`k` can be larger than `n` — the effective rotation is `k % n`.',
      'The last `k` elements move to the front; everything else shifts right by `k`.',
      'Slicing the array into two pieces and swapping their order does it in one line.',
    ],
    approach:
      'Reduce `k` to `k % n` first. The rotated array is the last `k` elements followed by the first `n - k` elements — a single slice-and-concatenate.',
    approachHi:
      'Pehle `k` ko `k % n` bana lo. Rotated array = last `k` elements + pehle `n - k` elements — ek hi slice-and-concatenate se ban jata hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) for the output (O(1) extra with the reverse-thrice in-place trick, mentioned for interviews)',
    solutionExplanation:
      'Rotating right by k means the tail of length k becomes the new head. Taking `k % n` first handles k values larger than the array (rotating by n is a no-op), and then it is literally just "swap the two pieces" — no element-by-element shifting needed. The classic in-place variant reverses the whole array, then reverses each of the two pieces, which achieves the same result with O(1) extra space.',
    solutionExplanationHi:
      'Right se k rotate karne ka matlab hai ki last k elements naya head ban jaate hain. Pehle `k % n` lene se k > n wale cases handle ho jaate hain (n se rotate karna no-op hai), aur baaki sirf "dono tukdo ko swap karo" hai — element-by-element shift ki zaroorat nahi. Classic in-place trick poore array ko reverse karke, phir dono tukdo ko alag-alag reverse karta hai — same result, O(1) extra space.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function rotate(arr, k) {
  // return the rotated array
}

console.log(rotate(arr, k).join(' '));`,
      `arr, k = nums(1), num(2)

def rotate(arr, k):
    # return the rotated list
    return []

print(" ".join(map(str, rotate(arr, k))))`,
    ),
    solution: solution(
      `const arr = nums(1);
let k = num(2);
const n = arr.length;
k %= n;
console.log([...arr.slice(n - k), ...arr.slice(0, n - k)].join(' '));`,
      `arr = nums(1)
k = num(2) % len(arr)
n = len(arr)
print(" ".join(map(str, arr[n - k:] + arr[:n - k])))`,
    ),
    testCases: [
      sample('7\n1 2 3 4 5 6 7\n3', '5 6 7 1 2 3 4'),
      sample('4\n-1 -100 3 99\n2', '3 99 -1 -100'),
      hidden('1\n1\n5', '1'),
      hidden('3\n1 2 3\n0', '1 2 3'),
      hidden('5\n1 2 3 4 5\n7', '4 5 1 2 3'),
      hidden('2\n1 2\n1', '2 1'),
    ],
  },

  {
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Return `true` if any value appears at least twice in the array, and `false` if every element is distinct.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Agar array mein koi value kam se kam do baar aati hai to `true` return karo, warna `false` (sab elements distinct hon).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n1 2 3 1', output: 'true' },
      { input: '4\n1 2 3 4', output: 'false' },
    ],
    constraints: ['1 <= n <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Sorting first makes duplicates adjacent, at O(n log n).',
      'A hash set answers "have I seen this before?" in O(1), giving O(n) overall.',
      'You can stop the instant a repeat is found.',
    ],
    approach:
      'Scan once while inserting into a hash set; if an element is already in the set, return true immediately. Reaching the end with no repeat means false.',
    approachHi:
      'Ek scan karo aur elements ko hash set mein daalte jao; agar koi element pehle se set mein hai to turant `true` return karo. Agar bina repeat ke end tak pahunch gaye to `false`.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'A hash set turns membership testing into O(1), so the array only needs to be walked once: insert as you go, and the moment an element is already present you have your answer, without waiting to scan the rest.',
    solutionExplanationHi:
      'Hash set membership test ko O(1) bana deta hai, isliye array ko sirf ek baar walk karna kaafi hai: aage badhte hue insert karo, aur jaise hi koi element pehle se present milta hai jawab mil jata hai — baaki scan karne ki zaroorat nahi.',
    starter: starter(
      `const arr = nums(1);

function containsDuplicate(arr) {
  // your code here
}

console.log(containsDuplicate(arr));`,
      `arr = nums(1)

def contains_duplicate(arr):
    # your code here
    pass

print(str(contains_duplicate(arr)).lower())`,
    ),
    solution: solution(
      `const arr = nums(1);
const seen = new Set();
let dup = false;
for (const x of arr) { if (seen.has(x)) { dup = true; break; } seen.add(x); }
console.log(dup);`,
      `arr = nums(1)
seen = set()
dup = False
for x in arr:
    if x in seen:
        dup = True
        break
    seen.add(x)
print(str(dup).lower())`,
    ),
    testCases: [
      sample('4\n1 2 3 1', 'true'),
      sample('4\n1 2 3 4', 'false'),
      hidden('1\n5', 'false'),
      hidden('5\n1 1 1 1 1', 'true'),
      hidden('3\n-1 -1 2', 'true'),
      hidden('6\n1 2 3 4 5 6', 'false'),
    ],
  },

  {
    slug: 'single-number',
    title: 'Single Number',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Every element in the array appears exactly twice except for one. Find that single element in O(n) time and O(1) space.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe element that appears once.',
    descriptionHi:
      'Array mein har element exactly do baar aata hai, sirf ek element ko chhod kar. Wo akela element O(n) time aur O(1) space mein dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nWo element jo ek hi baar aata hai.',
    examples: [
      { input: '3\n2 2 1', output: '1' },
      { input: '5\n4 1 2 1 2', output: '4' },
    ],
    constraints: ['1 <= n <= 3*10^4', 'Exactly one element appears once, every other appears exactly twice'],
    hints: [
      'A hash map of counts works but needs O(n) space — can you avoid it?',
      'XOR of a number with itself is 0, and XOR with 0 is a no-op.',
      'XOR-ing the entire array together cancels every pair, leaving only the unique value.',
    ],
    approach:
      'XOR all elements together. Every value that appears twice cancels itself out (`x ^ x = 0`), and XOR-ing with 0 changes nothing, so only the single unpaired value survives.',
    approachHi:
      'Saare elements ko XOR kar do. Jo bhi value do baar aati hai wo khud ko cancel kar deti hai (`x ^ x = 0`), aur 0 se XOR karne se kuch nahi badalta — isliye sirf wahi ek unpaired value bachti hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'XOR is commutative and associative, so the order of the array does not matter — every pair of identical values meets somewhere in the running XOR and annihilates (`x ^ x = 0`). Whatever survives to the end can only be the one value with no partner, found without any extra memory.',
    solutionExplanationHi:
      'XOR commutative aur associative hota hai, isliye array ka order matter nahi karta — har identical pair kabhi na kabhi running XOR mein mil kar cancel ho jata hai (`x ^ x = 0`). End tak jo bachta hai wo sirf wahi value ho sakti hai jiska koi partner nahi — bina kisi extra memory ke.',
    starter: starter(
      `const arr = nums(1);

function singleNumber(arr) {
  // your code here
}

console.log(singleNumber(arr));`,
      `arr = nums(1)

def single_number(arr):
    # your code here
    pass

print(single_number(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
console.log(arr.reduce((a, b) => a ^ b, 0));`,
      `arr = nums(1)
res = 0
for x in arr:
    res ^= x
print(res)`,
    ),
    testCases: [
      sample('3\n2 2 1', '1'),
      sample('5\n4 1 2 1 2', '4'),
      hidden('1\n7', '7'),
      hidden('3\n0 0 9', '9'),
      hidden('7\n1 1 2 2 3 3 8', '8'),
      hidden('5\n-3 -3 5 5 -7', '-7'),
    ],
  },

  {
    slug: 'majority-element',
    title: 'Majority Element',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Given an array of size `n`, return the majority element — the value that appears more than `⌊n/2⌋` times. It is guaranteed to exist.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe majority element.',
    descriptionHi:
      'Size `n` ka array diya hai. Majority element return karo — wo value jo `⌊n/2⌋` se zyada baar aati hai. Guarantee hai ki wo exist karta hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nMajority element.',
    examples: [
      { input: '3\n3 2 3', output: '3' },
      { input: '7\n2 2 1 1 1 2 2', output: '2' },
    ],
    constraints: ['1 <= n <= 5*10^4', 'A majority element is guaranteed to exist'],
    hints: [
      'Sorting and taking the middle element always lands on the majority value — why?',
      'Boyer-Moore voting does it in one pass with O(1) space: keep a candidate and a count.',
      'Every non-candidate vote cancels one candidate vote; the true majority can never run out.',
    ],
    approach:
      'Boyer-Moore majority vote. Keep a `candidate` and a `count`. For each element: if `count` is 0, adopt it as the new candidate; increment `count` when the element matches the candidate, otherwise decrement it.',
    approachHi:
      'Boyer-Moore majority vote. Ek `candidate` aur `count` rakho. Har element ke liye: agar `count` 0 hai to usse naya candidate bana do; agar element candidate se match karta hai to `count` badhao, warna ghatao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Think of matching votes as +1 and non-matching votes as -1. Because the true majority element outnumbers everything else combined, its net vote total can never be fully cancelled out — so whatever candidate survives every cancellation to the end must be it. The algorithm literally simulates that cancellation with one counter.',
    solutionExplanationHi:
      'Matching vote ko +1 aur non-matching ko -1 socho. Chunki true majority element baaki sab se milkar bhi zyada hai, uska net vote total kabhi poora cancel nahi ho sakta — isliye jo candidate end tak har cancellation jhel kar bacha rehta hai wahi answer hai. Algorithm isi cancellation ko ek counter se simulate karta hai.',
    starter: starter(
      `const arr = nums(1);

function majorityElement(arr) {
  // your code here
}

console.log(majorityElement(arr));`,
      `arr = nums(1)

def majority_element(arr):
    # your code here
    pass

print(majority_element(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let candidate = null, count = 0;
for (const x of arr) {
  if (count === 0) candidate = x;
  count += x === candidate ? 1 : -1;
}
console.log(candidate);`,
      `arr = nums(1)
candidate, count = None, 0
for x in arr:
    if count == 0:
        candidate = x
    count += 1 if x == candidate else -1
print(candidate)`,
    ),
    testCases: [
      sample('3\n3 2 3', '3'),
      sample('7\n2 2 1 1 1 2 2', '2'),
      hidden('1\n9', '9'),
      hidden('5\n1 1 1 2 2', '1'),
      hidden('9\n5 5 5 5 1 2 3 4 5', '5'),
      hidden('3\n-1 -1 2', '-1'),
    ],
  },

  {
    slug: 'best-time-to-buy-and-sell-stock-ii',
    title: 'Best Time to Buy and Sell Stock II',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'You may buy and sell a stock any number of times (but must sell before you buy again). Return the maximum total profit.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nThe maximum total profit.',
    descriptionHi:
      'Aap stock ko jitni baar chaho khareed-bech sakte ho (par phir se khareedne se pehle bechna hoga). Maximum total profit return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nMaximum total profit.',
    examples: [
      { input: '6\n7 1 5 3 6 4', output: '7', explanation: 'Buy at 1 sell at 5 (profit 4), buy at 3 sell at 6 (profit 3): total 7.' },
      { input: '5\n1 2 3 4 5', output: '4' },
    ],
    constraints: ['1 <= n <= 3*10^4', '0 <= prices[i] <= 10^4'],
    hints: [
      'Unlike the single-transaction version, you can capture every upward move.',
      'Any rising run can be decomposed into consecutive one-day-apart gains that sum to the same total.',
      'Add up every `prices[i] - prices[i-1]` that is positive.',
    ],
    approach:
      'Greedy: sum up every positive day-to-day difference. Since transactions are unlimited, capturing every small upward step is equivalent to capturing every full rising run.',
    approachHi:
      'Greedy: har positive day-to-day difference ko add kar do. Chunki transactions unlimited hain, har chhota upward step lena poore rising run lene ke barabar hi hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'A multi-day rising run like 1→3→6 splits cleanly into (3-1)+(6-3) = 6-1, the same total as one big buy-low-sell-high. So instead of hunting for peaks and valleys, simply buying-and-selling on every single day where the price rises reconstructs the exact same total profit with much simpler bookkeeping.',
    solutionExplanationHi:
      'Ek multi-day rising run jaise 1→3→6, saaf (3-1)+(6-3) = 6-1 mein toot jaata hai — same total jo ek bade buy-low-sell-high se milta. Isliye peaks-valleys dhoondne ke bajaye, har us din khareed-bech lo jahan price barhta hai — same total profit milta hai, bahut simpler logic se.',
    starter: starter(
      `const prices = nums(1);

function maxProfit(prices) {
  // your code here
}

console.log(maxProfit(prices));`,
      `prices = nums(1)

def max_profit(prices):
    # your code here
    pass

print(max_profit(prices))`,
    ),
    solution: solution(
      `const prices = nums(1);
let profit = 0;
for (let i = 1; i < prices.length; i++) if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
console.log(profit);`,
      `prices = nums(1)
profit = 0
for i in range(1, len(prices)):
    if prices[i] > prices[i - 1]:
        profit += prices[i] - prices[i - 1]
print(profit)`,
    ),
    testCases: [
      sample('6\n7 1 5 3 6 4', '7'),
      sample('5\n1 2 3 4 5', '4'),
      hidden('5\n7 6 4 3 1', '0'),
      hidden('1\n5', '0'),
      hidden('4\n1 5 1 5', '8'),
      hidden('2\n1 2', '1'),
    ],
  },

  {
    slug: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Merge two sorted arrays of length `m` and `n` into a single sorted array of length `m+n`.\n\n**Input**\n- Line 1: `m`\n- Line 2: `m` space-separated integers (nums1, may be empty)\n- Line 3: `n`\n- Line 4: `n` space-separated integers (nums2, may be empty)\n\n**Output**\nThe merged sorted array, space-separated.',
    descriptionHi:
      'Length `m` aur `n` ke do sorted arrays ko ek single sorted array (length `m+n`) mein merge karo.\n\n**Input**\n- Line 1: `m`\n- Line 2: `m` space-separated integers (nums1, khaali ho sakti hai)\n- Line 3: `n`\n- Line 4: `n` space-separated integers (nums2, khaali ho sakti hai)\n\n**Output**\nMerged sorted array, space se separate.',
    examples: [
      { input: '3\n1 2 3\n3\n2 5 6', output: '1 2 2 3 5 6' },
      { input: '0\n\n1\n1', output: '1' },
    ],
    constraints: ['0 <= m, n <= 200', 'Both input arrays are already sorted ascending'],
    hints: [
      'Merging from the front requires shifting elements — wasteful.',
      'Merging from the back avoids overwriting values you still need.',
      'Use two pointers starting at the last real elements of each array and fill the result from the end.',
    ],
    approach:
      'Two pointers starting at the end of each array, filling the merged result back to front so no element is overwritten before it is read. Whichever pointer currently points at the larger value gets placed next.',
    approachHi:
      'Dono arrays ke end se do pointers shuru karo, merged result ko peeche se aage bharo taaki koi element padhne se pehle overwrite na ho. Jis pointer ki value badi hai, wo pehle place hoti hai.',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(m + n) for the output',
    solutionExplanation:
      'Filling from the front would require shifting already-placed elements every time a nums2 value needs to slot in early — quadratic in the worst case. Filling from the back instead means every slot is written exactly once, in its final position, because the largest remaining value across both arrays is always known immediately by comparing the two current tail pointers.',
    solutionExplanationHi:
      'Aage se bharne mein har baar jab nums2 ki value beech mein daalni ho to already-placed elements shift karne padte — worst case mein quadratic. Peeche se bharne se har slot exactly ek baar likha jata hai, seedha final position par — kyunki dono arrays ke current tail pointers compare karke turant pata chal jata hai ki abhi sabse badi value kaunsi hai.',
    starter: starter(
      `const m = num(0);
const a = nums(1);
const n = num(2);
const b = nums(3);

function merge(a, b) {
  // return the merged sorted array
}

console.log(merge(a, b).join(' '));`,
      `m = num(0)
a = nums(1)
n = num(2)
b = nums(3)

def merge(a, b):
    # return the merged sorted list
    return []

print(" ".join(map(str, merge(a, b))))`,
    ),
    solution: solution(
      `const a = nums(1);
const b = nums(3);
let i = a.length - 1, j = b.length - 1;
const out = new Array(a.length + b.length);
let k = out.length - 1;
while (i >= 0 && j >= 0) out[k--] = a[i] > b[j] ? a[i--] : b[j--];
while (i >= 0) out[k--] = a[i--];
while (j >= 0) out[k--] = b[j--];
console.log(out.join(' '));`,
      `a = nums(1)
b = nums(3)
i, j = len(a) - 1, len(b) - 1
out = [0] * (len(a) + len(b))
k = len(out) - 1
while i >= 0 and j >= 0:
    if a[i] > b[j]:
        out[k] = a[i]; i -= 1
    else:
        out[k] = b[j]; j -= 1
    k -= 1
while i >= 0:
    out[k] = a[i]; i -= 1; k -= 1
while j >= 0:
    out[k] = b[j]; j -= 1; k -= 1
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('3\n1 2 3\n3\n2 5 6', '1 2 2 3 5 6'),
      sample('0\n\n1\n1', '1'),
      hidden('1\n1\n0\n', '1'),
      hidden('3\n0 0 0\n0\n', '0 0 0'),
      hidden('2\n4 5\n2\n1 6', '1 4 5 6'),
      hidden('3\n-3 -1 0\n2\n-2 2', '-3 -2 -1 0 2'),
    ],
  },

  {
    slug: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Given an `m x n` matrix, if an element is 0, set its entire row and column to 0.\n\n**Input**\n- Line 1: `m n`\n- Next `m` lines: `n` space-separated integers each\n\n**Output**\nThe modified matrix, one row per line.',
    descriptionHi:
      'Ek `m x n` matrix diya hai. Agar koi element 0 hai to uski poori row aur column 0 kar do.\n\n**Input**\n- Line 1: `m n`\n- Agli `m` lines: har ek mein `n` space-separated integers\n\n**Output**\nModified matrix, ek row per line.',
    examples: [
      { input: '3 3\n1 1 1\n1 0 1\n1 1 1', output: '1 0 1\n0 0 0\n1 0 1' },
      { input: '3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5', output: '0 0 0 0\n0 4 5 0\n0 3 1 0' },
    ],
    constraints: ['1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
    hints: [
      'Zeroing cells as you find them corrupts the matrix before you finish scanning it.',
      'Record which rows and columns must become zero first, then apply.',
      'The first row and first column of the matrix itself can double as that record, with O(1) extra space.',
    ],
    approach:
      'First scan the matrix and record which rows and columns contain a zero (a simple approach uses two boolean sets). Then, in a second pass, zero out every cell whose row or column was flagged.',
    approachHi:
      'Pehle matrix scan karo aur record karo kaunsi rows aur columns mein zero hai (simple approach: do boolean sets). Phir doosre pass mein har us cell ko zero kar do jiski row ya column flag hui thi.',
    timeComplexity: 'O(m*n)',
    spaceComplexity: 'O(m + n) for the row/column flag sets',
    solutionExplanation:
      'Zeroing in place while still scanning would create new zeros that were never in the original matrix, cascading incorrectly to rows/columns that should stay untouched. Separating "detect" from "apply" into two passes avoids that: the first pass only reads and records, and the second pass is the only place anything is mutated, using the recorded rows/columns as ground truth.',
    solutionExplanationHi:
      'Scan karte hue hi zero karne se aise naye zeros ban jaate jo original matrix mein the hi nahi, aur galat tarah se un rows/columns tak phail jaate jinhe touch nahi karna tha. "Detect" aur "apply" ko do alag passes mein todne se ye bachta hai: pehla pass sirf padhta aur record karta hai, doosra pass hi kuch badalta hai — record ki gayi rows/columns ko ground truth maan kar.',
    starter: starter(
      `const [m, n] = nums(0);
const grid = [];
for (let i = 0; i < m; i++) grid.push(nums(1 + i));

function setZeroes(grid) {
  // mutate grid in place (or return a new one)
  return grid;
}

console.log(setZeroes(grid).map(r => r.join(' ')).join('\\n'));`,
      `m, n = nums(0)
grid = [nums(1 + i) for i in range(m)]

def set_zeroes(grid):
    # mutate grid in place (or return a new one)
    return grid

result = set_zeroes(grid)
print("\\n".join(" ".join(map(str, row)) for row in result))`,
    ),
    solution: solution(
      `const [m, n] = nums(0);
const grid = [];
for (let i = 0; i < m; i++) grid.push(nums(1 + i));
const rowZero = new Set(), colZero = new Set();
for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (grid[i][j] === 0) { rowZero.add(i); colZero.add(j); }
for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (rowZero.has(i) || colZero.has(j)) grid[i][j] = 0;
console.log(grid.map(r => r.join(' ')).join('\\n'));`,
      `m, n = nums(0)
grid = [nums(1 + i) for i in range(m)]
row_zero, col_zero = set(), set()
for i in range(m):
    for j in range(n):
        if grid[i][j] == 0:
            row_zero.add(i); col_zero.add(j)
for i in range(m):
    for j in range(n):
        if i in row_zero or j in col_zero:
            grid[i][j] = 0
print("\\n".join(" ".join(map(str, row)) for row in grid))`,
    ),
    testCases: [
      sample('3 3\n1 1 1\n1 0 1\n1 1 1', '1 0 1\n0 0 0\n1 0 1'),
      sample('3 4\n0 1 2 0\n3 4 5 2\n1 3 1 5', '0 0 0 0\n0 4 5 0\n0 3 1 0'),
      hidden('1 1\n0', '0'),
      hidden('1 1\n5', '5'),
      hidden('2 2\n1 1\n1 1', '1 1\n1 1'),
      hidden('2 2\n0 1\n1 1', '0 0\n0 1'),
    ],
  },

  {
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Given an `m x n` matrix, return all its elements in spiral order (clockwise, starting top-left).\n\n**Input**\n- Line 1: `m n`\n- Next `m` lines: `n` space-separated integers each\n\n**Output**\nThe elements in spiral order, space-separated.',
    descriptionHi:
      'Ek `m x n` matrix diya hai. Uske saare elements spiral order mein (clockwise, top-left se shuru) return karo.\n\n**Input**\n- Line 1: `m n`\n- Agli `m` lines: har ek mein `n` space-separated integers\n\n**Output**\nElements spiral order mein, space se separate.',
    examples: [
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', output: '1 2 3 6 9 8 7 4 5' },
      { input: '3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12', output: '1 2 3 4 8 12 11 10 9 5 6 7' },
    ],
    constraints: ['1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    hints: [
      'Track four shrinking boundaries: top, bottom, left, right.',
      'Walk each of the four sides in order (right along the top, down the right side, left along the bottom, up the left side), then shrink the boundary that was just consumed.',
      'Re-check the boundaries have not crossed before each of the last two sides — non-square matrices can finish mid-layer.',
    ],
    approach:
      'Maintain four boundaries `top`, `bottom`, `left`, `right`. Repeatedly walk right across the top row, down the right column, left across the bottom row, and up the left column, shrinking each boundary as it is consumed — checking after each half-layer that the boundaries have not crossed.',
    approachHi:
      'Chaar boundaries rakho: `top`, `bottom`, `left`, `right`. Baar-baar top row right mein, right column neeche, bottom row left mein, aur left column upar walk karo — har boundary consume hote hi shrink karo, aur har half-layer ke baad check karo ki boundaries cross to nahi hui.',
    timeComplexity: 'O(m*n)',
    spaceComplexity: 'O(1) extra (beyond the output)',
    solutionExplanation:
      'A spiral is just four sides walked in rotation, with the walked boundary shrinking after each side — the tricky part is only that non-square matrices can exhaust rows before columns (or vice versa), so the boundary-crossed check before the last two sides of each loop prevents re-visiting or double-counting cells in a thin remaining strip.',
    solutionExplanationHi:
      'Spiral asal mein rotation mein chaar sides walk karna hai, har side ke baad boundary shrink karte hue — tricky sirf itna hai ki non-square matrices mein rows columns se pehle khatam ho sakti hain (ya ulta), isliye loop ke aakhri do sides se pehle boundary-crossed check karna zaroori hai taaki thin bachi hui strip mein cells dobara na ginein.',
    starter: starter(
      `const [m, n] = nums(0);
const grid = [];
for (let i = 0; i < m; i++) grid.push(nums(1 + i));

function spiralOrder(grid) {
  // return the elements in spiral order
  return [];
}

console.log(spiralOrder(grid).join(' '));`,
      `m, n = nums(0)
grid = [nums(1 + i) for i in range(m)]

def spiral_order(grid):
    # return the elements in spiral order
    return []

print(" ".join(map(str, spiral_order(grid))))`,
    ),
    solution: solution(
      `const [m, n] = nums(0);
const grid = [];
for (let i = 0; i < m; i++) grid.push(nums(1 + i));
let top = 0, bottom = m - 1, left = 0, right = n - 1;
const out = [];
while (top <= bottom && left <= right) {
  for (let j = left; j <= right; j++) out.push(grid[top][j]);
  top++;
  for (let i = top; i <= bottom; i++) out.push(grid[i][right]);
  right--;
  if (top <= bottom) { for (let j = right; j >= left; j--) out.push(grid[bottom][j]); bottom--; }
  if (left <= right) { for (let i = bottom; i >= top; i--) out.push(grid[i][left]); left++; }
}
console.log(out.join(' '));`,
      `m, n = nums(0)
grid = [nums(1 + i) for i in range(m)]
top, bottom, left, right = 0, m - 1, 0, n - 1
out = []
while top <= bottom and left <= right:
    for j in range(left, right + 1):
        out.append(grid[top][j])
    top += 1
    for i in range(top, bottom + 1):
        out.append(grid[i][right])
    right -= 1
    if top <= bottom:
        for j in range(right, left - 1, -1):
            out.append(grid[bottom][j])
        bottom -= 1
    if left <= right:
        for i in range(bottom, top - 1, -1):
            out.append(grid[i][left])
        left += 1
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('3 3\n1 2 3\n4 5 6\n7 8 9', '1 2 3 6 9 8 7 4 5'),
      sample('3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12', '1 2 3 4 8 12 11 10 9 5 6 7'),
      hidden('1 1\n7', '7'),
      hidden('1 4\n1 2 3 4', '1 2 3 4'),
      hidden('4 1\n1\n2\n3\n4', '1 2 3 4'),
      hidden('2 2\n1 2\n3 4', '1 2 4 3'),
    ],
  },

  {
    slug: 'rotate-image',
    title: 'Rotate Image',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Given an `n x n` matrix, rotate it 90 degrees clockwise.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `n` space-separated integers each\n\n**Output**\nThe rotated matrix, one row per line.',
    descriptionHi:
      'Ek `n x n` matrix diya hai. Use 90 degrees clockwise rotate karo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: har ek mein `n` space-separated integers\n\n**Output**\nRotated matrix, ek row per line.',
    examples: [
      { input: '3\n1 2 3\n4 5 6\n7 8 9', output: '7 4 1\n8 5 2\n9 6 3' },
      { input: '2\n1 2\n3 4', output: '3 1\n4 2' },
    ],
    constraints: ['1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
    hints: [
      'A 90-degree clockwise rotation equals transposing the matrix, then reversing each row.',
      'Transpose means swapping `matrix[i][j]` with `matrix[j][i]` for `i < j`.',
      'Reversing every row afterward finishes the rotation in place, with no extra matrix.',
    ],
    approach:
      'Transpose the matrix in place (swap across the main diagonal), then reverse each row. The composition of those two simple operations is exactly a 90-degree clockwise rotation.',
    approachHi:
      'Matrix ko in place transpose karo (main diagonal ke across swap karo), phir har row ko reverse kar do. In do simple operations ka combination hi 90-degree clockwise rotation hai.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1) extra',
    solutionExplanation:
      'Rotating 90° clockwise sends `matrix[i][j]` to `matrix[j][n-1-i]`. Transposing alone sends it to `matrix[j][i]`; reversing each row afterward then moves column `i` to column `n-1-i`, exactly landing on the rotated target — so two well-known, easy-to-verify operations compose into the rotation without ever allocating a second matrix.',
    solutionExplanationHi:
      '90° clockwise rotation `matrix[i][j]` ko `matrix[j][n-1-i]` par bhejta hai. Sirf transpose karne se wo `matrix[j][i]` par jaata hai; baad mein har row reverse karne se column `i`, column `n-1-i` par chala jaata hai — exactly rotated target par. Do jaani-pehchaani, easy-to-verify operations milkar rotation ban jaati hain, bina doosri matrix banaye.',
    starter: starter(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));

function rotate(grid) {
  // mutate grid in place (or return a new one)
  return grid;
}

console.log(rotate(grid).map(r => r.join(' ')).join('\\n'));`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]

def rotate(grid):
    # mutate grid in place (or return a new one)
    return grid

result = rotate(grid)
print("\\n".join(" ".join(map(str, row)) for row in result))`,
    ),
    solution: solution(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));
for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { [grid[i][j], grid[j][i]] = [grid[j][i], grid[i][j]]; }
for (let i = 0; i < n; i++) grid[i].reverse();
console.log(grid.map(r => r.join(' ')).join('\\n'));`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]
for i in range(n):
    for j in range(i + 1, n):
        grid[i][j], grid[j][i] = grid[j][i], grid[i][j]
for row in grid:
    row.reverse()
print("\\n".join(" ".join(map(str, row)) for row in grid))`,
    ),
    testCases: [
      sample('3\n1 2 3\n4 5 6\n7 8 9', '7 4 1\n8 5 2\n9 6 3'),
      sample('2\n1 2\n3 4', '3 1\n4 2'),
      hidden('1\n5', '5'),
      hidden('4\n5 1 9 11\n2 4 8 10\n13 3 6 7\n15 14 12 16', '15 13 2 5\n14 3 4 1\n12 6 8 9\n16 7 10 11'),
      hidden('2\n1 1\n1 1', '1 1\n1 1'),
      hidden('3\n1 0 0\n0 1 0\n0 0 1', '0 0 1\n0 1 0\n1 0 0'),
    ],
  },

  {
    slug: 'pascals-triangle',
    title: "Pascal's Triangle",
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      "Given `numRows`, generate the first `numRows` rows of Pascal's Triangle.\n\n**Input**\n- Line 1: `numRows`\n\n**Output**\n`numRows` lines; row `i` (0-indexed) has `i+1` space-separated integers.",
    descriptionHi:
      "`numRows` diya hai. Pascal's Triangle ki pehli `numRows` rows generate karo.\n\n**Input**\n- Line 1: `numRows`\n\n**Output**\n`numRows` lines; row `i` (0-indexed) mein `i+1` space-separated integers hain.",
    examples: [
      { input: '5', output: '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1' },
      { input: '1', output: '1' },
    ],
    constraints: ['1 <= numRows <= 30'],
    hints: [
      'Every row starts and ends with 1.',
      'Every interior value is the sum of the two values above it in the previous row.',
      'Build each row from the previous one; the first row is just [1].',
    ],
    approach:
      "Build rows iteratively. Start with `[1]`. To build the next row from the previous one, each interior entry is `prev[j-1] + prev[j]`, with 1s bookending both ends.",
    approachHi:
      "Rows iteratively banao. `[1]` se shuru karo. Pichli row se agli row banane ke liye, har interior entry `prev[j-1] + prev[j]` hai, aur dono ends par 1 rehta hai.",
    timeComplexity: 'O(numRows^2)',
    spaceComplexity: 'O(numRows^2) for the output',
    solutionExplanation:
      "Pascal's Triangle is defined recursively — each entry is the sum of the two entries diagonally above it — so building it top-down using only the immediately previous row is a direct translation of that definition, with the row boundaries handled by simply always starting and ending the new row with 1.",
    solutionExplanationHi:
      "Pascal's Triangle recursively defined hai — har entry apne upar ke do diagonal entries ka sum hai — isliye sirf pichli row use karke top-down banana us definition ka seedha translation hai; row ke boundaries har naye row ko 1 se shuru aur khatam karke handle ho jaate hain.",
    starter: starter(
      `const numRows = num(0);

function generate(numRows) {
  // return an array of arrays
  return [];
}

console.log(generate(numRows).map(r => r.join(' ')).join('\\n'));`,
      `num_rows = num(0)

def generate(num_rows):
    # return a list of lists
    return []

print("\\n".join(" ".join(map(str, row)) for row in generate(num_rows)))`,
    ),
    solution: solution(
      `const numRows = num(0);
const tri = [[1]];
for (let i = 1; i < numRows; i++) {
  const prev = tri[i - 1];
  const row = [1];
  for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
  row.push(1);
  tri.push(row);
}
console.log(tri.map(r => r.join(' ')).join('\\n'));`,
      `num_rows = num(0)
tri = [[1]]
for i in range(1, num_rows):
    prev = tri[-1]
    row = [1] + [prev[j - 1] + prev[j] for j in range(1, i)] + [1]
    tri.append(row)
print("\\n".join(" ".join(map(str, row)) for row in tri))`,
    ),
    testCases: [
      sample('5', '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1'),
      sample('1', '1'),
      hidden('2', '1\n1 1'),
      hidden('3', '1\n1 1\n1 2 1'),
      hidden('6', '1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1'),
      hidden('4', '1\n1 1\n1 2 1\n1 3 3 1'),
    ],
  },

  {
    slug: 'find-minimum-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'An ascending array with no duplicates was rotated at some unknown pivot. Find the minimum element in O(log n) time.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe minimum element.',
    descriptionHi:
      'Ek ascending, duplicate-free array ko kisi unknown pivot par rotate kiya gaya hai. Minimum element O(log n) time mein dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nMinimum element.',
    examples: [
      { input: '5\n3 4 5 1 2', output: '1' },
      { input: '7\n4 5 6 7 0 1 2', output: '0' },
    ],
    constraints: ['1 <= n <= 5000', 'All values distinct', 'The array is a rotation of an originally ascending array'],
    hints: [
      'A linear scan finds it in O(n), but the sorted structure allows O(log n).',
      'Compare the middle element to the rightmost element to decide which half is unrotated.',
      'If `nums[mid] > nums[right]`, the minimum is strictly to the right of mid; otherwise it is at or to the left of mid.',
    ],
    approach:
      'Binary search comparing `nums[mid]` to `nums[right]`. If `nums[mid] > nums[right]`, the rotation point (and minimum) lies in the right half, so move `left = mid + 1`. Otherwise the minimum is at `mid` or further left, so move `right = mid`.',
    approachHi:
      '`nums[mid]` ko `nums[right]` se compare karke binary search karo. Agar `nums[mid] > nums[right]` hai to rotation point (aur minimum) right half mein hai, isliye `left = mid + 1` karo. Warna minimum `mid` par ya usse left mein hai, isliye `right = mid` karo.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'A rotated sorted array is really two sorted runs glued together, and comparing the midpoint to the rightmost element tells you which run you are straddling: if the midpoint is bigger than the right end, the "seam" (and thus the minimum) must be further right; otherwise the seam is at or before the midpoint. Each comparison halves the search space, just like ordinary binary search, but on structure rather than an exact target.',
    solutionExplanationHi:
      'Rotated sorted array asal mein do sorted runs jode hue hote hain, aur midpoint ko rightmost element se compare karne se pata chal jata hai ki aap kaunse run mein khade ho: agar midpoint right end se bada hai to "seam" (aur minimum) aage right mein hoga; warna seam mid par ya usse pehle hai. Har comparison search space ko aadha kar deta hai, bilkul normal binary search jaisa — bas exact target ki jagah structure par.',
    starter: starter(
      `const arr = nums(1);

function findMin(arr) {
  // your code here
}

console.log(findMin(arr));`,
      `arr = nums(1)

def find_min(arr):
    # your code here
    pass

print(find_min(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let left = 0, right = arr.length - 1;
while (left < right) {
  const mid = (left + right) >> 1;
  if (arr[mid] > arr[right]) left = mid + 1;
  else right = mid;
}
console.log(arr[left]);`,
      `arr = nums(1)
left, right = 0, len(arr) - 1
while left < right:
    mid = (left + right) // 2
    if arr[mid] > arr[right]:
        left = mid + 1
    else:
        right = mid
print(arr[left])`,
    ),
    testCases: [
      sample('5\n3 4 5 1 2', '1'),
      sample('7\n4 5 6 7 0 1 2', '0'),
      hidden('4\n11 13 15 17', '11'),
      hidden('1\n1', '1'),
      hidden('2\n2 1', '1'),
      hidden('6\n5 6 7 1 2 3', '1'),
    ],
  },

  {
    slug: 'search-insert-position',
    title: 'Search Insert Position',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Given a sorted array of distinct integers and a target, return the index if the target is found. If not, return the index where it would be inserted to keep the array sorted.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nThe index.',
    descriptionHi:
      'Sorted, distinct integers ka array aur ek target diya hai. Agar target milta hai to uska index return karo. Nahi milta to wo index return karo jahan use insert karne se array sorted rahega.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nIndex.',
    examples: [
      { input: '4\n1 3 5 6\n5', output: '2' },
      { input: '4\n1 3 5 6\n2', output: '1' },
    ],
    constraints: ['1 <= n <= 10^4', 'Array sorted ascending, all values distinct', 'O(log n) required'],
    hints: [
      'This is standard binary search — but it needs to return an insertion point on failure too.',
      'Track `left` as the smallest index whose value could be >= target.',
      'When the loop ends, `left` is exactly that insertion point whether or not the target was found.',
    ],
    approach:
      'Binary search for the leftmost index whose value is `>= target`. That index is the answer whether the target exists (found there) or not (that is exactly where it belongs).',
    approachHi:
      'Us sabse chhote index ke liye binary search karo jiski value `>= target` ho. Chahe target mile ya na mile, wahi index answer hai — mile to wahi jagah, na mile to wahi uski sahi jagah hai.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "Framing the search as \"find the leftmost position where target could go\" unifies both outcomes the problem asks for: if that position holds the target, it was found there; if it holds something bigger (or is past the end), that is precisely where target must be inserted to preserve order. No separate not-found branch is needed — it falls out of the same binary search.",
    solutionExplanationHi:
      "Search ko \"target jahan ja sakta hai wo sabse left position dhoondo\" ki tarah socho — dono outcomes yahin se nikal aate hain: agar us position par target hai to wahi mil gaya; agar wahan koi bada number hai (ya end aa gaya), to wahi target ki sahi insertion jagah hai. Alag se not-found handle karne ki zaroorat nahi — same binary search se nikal aata hai.",
    starter: starter(
      `const arr = nums(1), target = num(2);

function searchInsert(arr, target) {
  // your code here
}

console.log(searchInsert(arr, target));`,
      `arr, target = nums(1), num(2)

def search_insert(arr, target):
    # your code here
    pass

print(search_insert(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
let left = 0, right = arr.length;
while (left < right) {
  const mid = (left + right) >> 1;
  if (arr[mid] < target) left = mid + 1;
  else right = mid;
}
console.log(left);`,
      `arr, target = nums(1), num(2)
left, right = 0, len(arr)
while left < right:
    mid = (left + right) // 2
    if arr[mid] < target:
        left = mid + 1
    else:
        right = mid
print(left)`,
    ),
    testCases: [
      sample('4\n1 3 5 6\n5', '2'),
      sample('4\n1 3 5 6\n2', '1'),
      hidden('4\n1 3 5 6\n7', '4'),
      hidden('4\n1 3 5 6\n0', '0'),
      hidden('1\n1\n1', '0'),
      hidden('5\n1 2 4 5 6\n3', '2'),
    ],
  },

  {
    slug: 'summary-ranges',
    title: 'Summary Ranges',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Given a sorted array of unique integers, return the smallest set of ranges that cover all the numbers exactly. Format each range longer than one number as `a->b`; a single number is written by itself.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (may be empty if `n` is 0)\n\n**Output**\nThe ranges, space-separated, in order (empty line if `n` is 0).',
    descriptionHi:
      'Sorted, unique integers ka array diya hai. Sabse chhota set of ranges return karo jo saare numbers ko exactly cover kare. Ek se zyada number wali range ko `a->b` format mein likho; akela number khud hi likha jaata hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (agar `n` 0 hai to khaali ho sakti hai)\n\n**Output**\nRanges, space se separate, order mein (agar `n` 0 hai to khaali line).',
    examples: [
      { input: '6\n0 1 2 4 5 7', output: '0->2 4->5 7' },
      { input: '7\n0 2 3 4 6 8 9', output: '0 2->4 6 8->9' },
    ],
    constraints: ['0 <= n <= 20', 'The array is sorted ascending with unique values'],
    hints: [
      'A run of consecutive integers (each exactly one more than the last) becomes a single range.',
      'Track the start of the current run; extend it while the next value is exactly `prev + 1`.',
      'When the run breaks, close it out — as a single number if the run had length 1, or `start->end` otherwise.',
    ],
    approach:
      'Walk the array tracking the start of the current consecutive run. Whenever the next element is not exactly one more than the current, close the run (single value or `start->end`) and begin a new one.',
    approachHi:
      'Array ko walk karo aur current consecutive run ka start track karo. Jab bhi agla element current se exactly ek zyada na ho, run ko band karo (single value ya `start->end`) aur naya run shuru karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra (beyond the output)',
    solutionExplanation:
      'Because the array is sorted with unique values, "consecutive integers" is the same as "adjacent array elements differing by exactly 1" — so a single left-to-right pass that watches for that gap is enough to detect every run boundary, and each run collapses to either a lone number or an `a->b` pair depending on whether it had one element or more.',
    solutionExplanationHi:
      'Array sorted aur unique hone ki wajah se, "consecutive integers" matlab hi "adjacent array elements jinka difference exactly 1 ho" — isliye ek hi left-to-right pass, jo is gap ko dekhta hai, har run boundary pakad leta hai, aur har run ya to akela number ban jaata hai ya `a->b` pair, depending on ki usmein kitne elements the.',
    starter: starter(
      `const arr = nums(1);

function summaryRanges(arr) {
  // return an array of strings
  return [];
}

console.log(summaryRanges(arr).join(' '));`,
      `arr = nums(1)

def summary_ranges(arr):
    # return a list of strings
    return []

print(" ".join(summary_ranges(arr)))`,
    ),
    solution: solution(
      `const arr = nums(1);
const out = [];
let i = 0;
while (i < arr.length) {
  let j = i;
  while (j + 1 < arr.length && arr[j + 1] === arr[j] + 1) j++;
  out.push(i === j ? String(arr[i]) : arr[i] + '->' + arr[j]);
  i = j + 1;
}
console.log(out.join(' '));`,
      `arr = nums(1)
out = []
i = 0
while i < len(arr):
    j = i
    while j + 1 < len(arr) and arr[j + 1] == arr[j] + 1:
        j += 1
    out.append(str(arr[i]) if i == j else f"{arr[i]}->{arr[j]}")
    i = j + 1
print(" ".join(out))`,
    ),
    testCases: [
      sample('6\n0 1 2 4 5 7', '0->2 4->5 7'),
      sample('7\n0 2 3 4 6 8 9', '0 2->4 6 8->9'),
      hidden('0\n', ''),
      hidden('1\n5', '5'),
      hidden('4\n1 2 3 4', '1->4'),
      hidden('3\n1 3 5', '1 3 5'),
    ],
  },

  {
    slug: 'plus-one',
    title: 'Plus One',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'A non-negative integer is represented as an array of its digits, most significant digit first. Add one to the number and return the resulting digit array.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated digits\n\n**Output**\nThe resulting digits, space-separated.',
    descriptionHi:
      'Ek non-negative integer ko uske digits ke array se represent kiya gaya hai, most significant digit pehle. Number mein ek jodo aur resulting digit array return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated digits\n\n**Output**\nResulting digits, space se separate.',
    examples: [
      { input: '3\n1 2 3', output: '1 2 4' },
      { input: '3\n9 9 9', output: '1 0 0 0' },
    ],
    constraints: ['1 <= n <= 100', '0 <= digits[i] <= 9', 'No leading zero unless the number itself is 0'],
    hints: [
      'Adding one only changes the last digit, unless that digit was 9.',
      'A trailing run of 9s all become 0, and the carry propagates left.',
      'If the carry survives past the first digit, prepend a new leading 1.',
    ],
    approach:
      'Walk the digits from the end. Add the carry (starting at 1) to each digit; if it becomes 10, set it to 0 and carry 1 into the next digit left; otherwise the addition is done and you can stop early. If a carry remains after the first digit, prepend a 1.',
    approachHi:
      'Digits ko end se walk karo. Har digit mein carry (shuru mein 1) add karo; agar 10 ban jaaye to use 0 karke agle (left) digit mein 1 carry karo; warna addition ho gaya, aur turant ruk sakte ho. Agar first digit ke baad bhi carry bacha hai to shuru mein ek 1 jod do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra (O(n) in the rare all-9s case that grows the array)',
    solutionExplanation:
      "This is exactly how you'd add 1 by hand on paper: the carry only ever propagates through a contiguous trailing run of 9s, since the moment a digit is less than 9 the +1 stops there with no further carry — so the loop can break early in the common case, and the only special case is an array of all 9s, which needs one new leading digit.",
    solutionExplanationHi:
      "Ye bilkul waisa hi hai jaise paper par haath se 1 jodte hain: carry sirf trailing 9s ke ek contiguous run mein hi aage badhta hai, kyunki jaise hi koi digit 9 se kam milta hai, +1 wahin ruk jaata hai, aage carry nahi jaata — isliye common case mein loop jaldi break ho sakta hai. Special case sirf tab hai jab saare digits 9 hon, tab ek naya leading digit chahiye hota hai.",
    starter: starter(
      `const digits = nums(1);

function plusOne(digits) {
  // return the resulting digits array
  return [];
}

console.log(plusOne(digits).join(' '));`,
      `digits = nums(1)

def plus_one(digits):
    # return the resulting digits list
    return []

print(" ".join(map(str, plus_one(digits))))`,
    ),
    solution: solution(
      `const digits = nums(1);
for (let i = digits.length - 1; i >= 0; i--) {
  if (digits[i] < 9) { digits[i]++; console.log(digits.join(' ')); process.exit(0); }
  digits[i] = 0;
}
console.log([1, ...digits].join(' '));`,
      `digits = nums(1)
for i in range(len(digits) - 1, -1, -1):
    if digits[i] < 9:
        digits[i] += 1
        print(" ".join(map(str, digits)))
        exit()
    digits[i] = 0
print(" ".join(map(str, [1] + digits)))`,
    ),
    testCases: [
      sample('3\n1 2 3', '1 2 4'),
      sample('3\n9 9 9', '1 0 0 0'),
      hidden('1\n0', '1'),
      hidden('1\n9', '1 0'),
      hidden('4\n4 3 2 1', '4 3 2 2'),
      hidden('2\n2 9', '3 0'),
    ],
  },

  {
    slug: 'remove-element',
    title: 'Remove Element',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Remove every occurrence of `val` from the array in place, preserving the relative order of the remaining elements. Output the new length followed by the remaining elements.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `val`\n\n**Output**\n- Line 1: the new length `k`\n- Line 2: the `k` remaining elements, space-separated (empty if `k` is 0)',
    descriptionHi:
      'Array se `val` ke saare occurrences in place hata do, baaki elements ka relative order preserve karte hue. Naya length aur baaki elements print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `val`\n\n**Output**\n- Line 1: naya length `k`\n- Line 2: baaki `k` elements, space se separate (khaali agar `k` 0 hai)',
    examples: [
      { input: '4\n3 2 2 3\n3', output: '2\n2 2' },
      { input: '8\n0 1 2 2 3 0 4 2\n2', output: '5\n0 1 3 0 4' },
    ],
    constraints: ['0 <= n <= 100', '0 <= nums[i], val <= 100'],
    hints: [
      'You need to skip every element equal to `val` while keeping the rest in order.',
      'A write pointer trails a read pointer: only advance the write pointer when the read pointer lands on a value to keep.',
      'This is the same "shrink, don\'t rebuild" pattern used to remove duplicates from a sorted array.',
    ],
    approach:
      'Two pointers: a write index starts at 0, and a read index scans every element. Whenever `nums[read] !== val`, copy it to `nums[write]` and advance `write`. The final value of `write` is the new length.',
    approachHi:
      'Do pointers: write index 0 se shuru hota hai, aur read index har element scan karta hai. Jab bhi `nums[read] !== val`, use `nums[write]` par copy karo aur `write` badhao. Aakhri `write` value hi naya length hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    solutionExplanation:
      'The write pointer only ever moves forward when something worth keeping is found, so it can never overtake the read pointer — every value it overwrites has already been read. That guarantee is what makes a single left-to-right pass with two pointers safe for in-place removal, without needing a second array.',
    solutionExplanationHi:
      'Write pointer sirf tabhi aage badhta hai jab koi rakhne layak value milti hai, isliye wo kabhi read pointer se aage nahi ja sakta — jo bhi value wo overwrite karta hai wo pehle hi padhi ja chuki hoti hai. Yahi guarantee ek single left-to-right pass, do pointers ke saath, in-place removal ke liye safe banata hai — doosre array ki zaroorat nahi.',
    starter: starter(
      `const arr = nums(1), val = num(2);

function removeElement(arr, val) {
  // return the new length; arr's first k elements should be the kept ones
  return 0;
}

const k = removeElement(arr, val);
console.log(k);
console.log(arr.slice(0, k).join(' '));`,
      `arr, val = nums(1), num(2)

def remove_element(arr, val):
    # return the new length; arr's first k elements should be the kept ones
    return 0

k = remove_element(arr, val)
print(k)
print(" ".join(map(str, arr[:k])))`,
    ),
    solution: solution(
      `const arr = nums(1), val = num(2);
let write = 0;
for (let read = 0; read < arr.length; read++) if (arr[read] !== val) arr[write++] = arr[read];
console.log(write);
console.log(arr.slice(0, write).join(' '));`,
      `arr, val = nums(1), num(2)
write = 0
for x in arr:
    if x != val:
        arr[write] = x
        write += 1
print(write)
print(" ".join(map(str, arr[:write])))`,
    ),
    testCases: [
      sample('4\n3 2 2 3\n3', '2\n2 2'),
      sample('8\n0 1 2 2 3 0 4 2\n2', '5\n0 1 3 0 4'),
      hidden('0\n\n5', '0\n'),
      hidden('3\n1 1 1\n1', '0\n'),
      hidden('3\n1 2 3\n5', '3\n1 2 3'),
      hidden('1\n7\n7', '0\n'),
    ],
  },

  {
    slug: 'maximum-subarray-sum-circular',
    title: 'Maximum Subarray Sum Circular',
    category: 'Arrays',
    difficulty: 'HARD',
    description:
      'Given a circular integer array (the end connects back to the start), find the maximum possible sum of a non-empty subarray, where the subarray may wrap around the end.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe maximum circular subarray sum.',
    descriptionHi:
      'Ek circular integer array diya hai (end wapas start se juda hai). Kisi non-empty subarray ka maximum possible sum dhoondo, jahan subarray end ke around wrap bhi kar sakta hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nMaximum circular subarray sum.',
    examples: [
      { input: '4\n1 -2 3 -2', output: '3' },
      { input: '3\n5 -3 5', output: '10', explanation: 'Wrap-around subarray [5, 5] (indices 2 and 0) sums to 10.' },
    ],
    constraints: ['1 <= n <= 3*10^4', '-3*10^4 <= nums[i] <= 3*10^4'],
    hints: [
      'A non-wrapping answer is just ordinary Kadane\'s algorithm.',
      'A wrapping subarray equals the total sum minus a *contiguous, non-wrapping* middle piece — so it equals total minus the minimum subarray sum.',
      'The all-negative case is a trap: total - min would wrongly give 0 (an empty subarray), so handle it separately by falling back to the plain Kadane\'s maximum.',
    ],
    approach:
      'Compute two things with Kadane-style scans: the ordinary maximum subarray sum, and the minimum subarray sum. The best wrap-around sum is `total - minSubarray`. The answer is the larger of the two — unless every element is negative, in which case the wrap-around formula would incorrectly suggest an empty subarray, so fall back to the plain maximum in that case.',
    approachHi:
      'Kadane-style do scans karo: normal maximum subarray sum, aur minimum subarray sum. Best wrap-around sum `total - minSubarray` hai. Dono mein se bada answer hai — sivaay tab jab saare elements negative hon, tab wrap-around formula galat tarah se empty subarray suggest kar dega, isliye us case mein sirf plain maximum use karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Any subarray either stays within the array (the classic Kadane case) or wraps around the end, and a wrapping subarray is exactly the complement of some *non-wrapping, non-empty* middle segment — so maximizing the wrap-around sum is the same as minimizing that excluded middle, i.e. `total - minSubarray`. The one trap is when the whole array is negative: excluding everything (an empty middle, sum 0) would look optimal by that formula, but an empty subarray is not a valid answer, so the all-negative case must fall back to ordinary Kadane\'s maximum instead.',
    solutionExplanationHi:
      'Koi bhi subarray ya to array ke andar hi rehta hai (classic Kadane case) ya end ke around wrap karta hai, aur ek wrapping subarray asal mein kisi *non-wrapping, non-empty* middle segment ka complement hota hai — isliye wrap-around sum maximize karna, us excluded middle ko minimize karne ke barabar hai, yaani `total - minSubarray`. Ek trap hai: agar poora array negative hai, to sab kuch exclude karna (empty middle, sum 0) is formula ke hisaab se best lagega, par empty subarray valid answer nahi hai — isliye all-negative case mein plain Kadane ka maximum hi lena chahiye.',
    starter: starter(
      `const arr = nums(1);

function maxSubarraySumCircular(arr) {
  // your code here
}

console.log(maxSubarraySumCircular(arr));`,
      `arr = nums(1)

def max_subarray_sum_circular(arr):
    # your code here
    pass

print(max_subarray_sum_circular(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let total = 0, curMax = 0, best = -Infinity, curMin = 0, worst = Infinity;
for (const x of arr) {
  total += x;
  curMax = Math.max(x, curMax + x); best = Math.max(best, curMax);
  curMin = Math.min(x, curMin + x); worst = Math.min(worst, curMin);
}
console.log(best < 0 ? best : Math.max(best, total - worst));`,
      `arr = nums(1)
total = cur_max = cur_min = 0
best, worst = float("-inf"), float("inf")
for x in arr:
    total += x
    cur_max = max(x, cur_max + x); best = max(best, cur_max)
    cur_min = min(x, cur_min + x); worst = min(worst, cur_min)
print(best if best < 0 else max(best, total - worst))`,
    ),
    testCases: [
      sample('4\n1 -2 3 -2', '3'),
      sample('3\n5 -3 5', '10'),
      hidden('3\n-3 -2 -3', '-2'),
      hidden('1\n-5', '-5'),
      hidden('1\n5', '5'),
      hidden('4\n3 -2 2 -3', '3'),
    ],
  },
];
