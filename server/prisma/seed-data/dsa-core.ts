import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Arrays → Stack. Linear-scan and pointer patterns that show up in almost every
 * first-round interview.
 */
export const dsaCore: SeedProblem[] = [
  /* ------------------------------------ Arrays ----------------------------------- */
  {
    slug: 'two-sum',
    title: 'Two Sum',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Given an array of integers and a target value, return the indices of the two numbers that add up to the target. Exactly one valid answer exists and you may not use the same element twice.\n\n**Input**\n- Line 1: `n` — the number of elements\n- Line 2: `n` space-separated integers\n- Line 3: the target\n\n**Output**\nThe two indices in increasing order, space-separated.',
    descriptionHi:
      'Ek integers ka array aur ek target diya hai. Aise do numbers ke index return karo jinka sum target ke barabar ho. Exactly ek hi valid answer hai, aur same element ko do baar use nahi kar sakte.\n\n**Input**\n- Line 1: `n` — kitne elements hain\n- Line 2: `n` space-separated integers\n- Line 3: target\n\n**Output**\nDono index badhte hue order mein, space se separate karke.',
    examples: [
      {
        input: '4\n2 7 11 15\n9',
        output: '0 1',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so the answer is 0 1.',
      },
      { input: '3\n3 2 4\n6', output: '1 2' },
    ],
    constraints: ['2 <= n <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists'],
    hints: [
      'The brute force is two nested loops — O(n^2). Can you avoid the inner loop?',
      'For each number x, you are looking for target - x. What data structure answers "have I seen this value?" in O(1)?',
      'Store value -> index in a hash map as you scan, and check for the complement before inserting.',
    ],
    approach:
      'Single pass with a hash map. For each element, compute the complement `target - nums[i]` and check whether it is already in the map. If it is, you have the pair; otherwise record `nums[i] -> i` and continue.',
    approachHi:
      'Ek hi pass mein hash map use karo. Har element ke liye `target - nums[i]` nikalo aur dekho ki wo map mein pehle se hai ya nahi. Agar hai to pair mil gaya; nahi to `nums[i] -> i` map mein daal do aur aage badho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The naive solution checks every pair, which is O(n^2). The insight is that the second number is fully determined by the first: once you fix `nums[i]`, you need exactly `target - nums[i]`. A hash map turns "does this value exist and where?" into an O(1) question, so one pass is enough. Checking the map *before* inserting the current element is what prevents using the same index twice.',
    solutionExplanationHi:
      'Naive solution har pair check karta hai — O(n^2). Asli insight ye hai ki doosra number pehle se fix ho jata hai: `nums[i]` choose karte hi aapko exactly `target - nums[i]` chahiye. Hash map is sawaal ko O(1) bana deta hai, isliye ek hi pass kaafi hai. Current element ko insert karne se *pehle* map check karna zaroori hai — warna same index do baar use ho jayega.',
    starter: starter(
      `const n = num(0);
const arr = nums(1);
const target = num(2);

// Return the two indices that sum to target.
function twoSum(arr, target) {
  // your code here
}

console.log(twoSum(arr, target).join(' '));`,
      `n = num(0)
arr = nums(1)
target = num(2)

def two_sum(arr, target):
    # your code here
    pass

print(" ".join(map(str, two_sum(arr, target))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const target = num(2);
const seen = new Map();
for (let i = 0; i < arr.length; i++) {
  const need = target - arr[i];
  if (seen.has(need)) { console.log(seen.get(need) + ' ' + i); break; }
  seen.set(arr[i], i);
}`,
      `arr = nums(1)
target = num(2)
seen = {}
for i, x in enumerate(arr):
    if target - x in seen:
        print(seen[target - x], i)
        break
    seen[x] = i`,
    ),
    testCases: [
      sample('4\n2 7 11 15\n9', '0 1'),
      sample('3\n3 2 4\n6', '1 2'),
      hidden('2\n3 3\n6', '0 1'),
      hidden('5\n-1 -2 -3 -4 -5\n-8', '2 4'),
      hidden('6\n1 5 3 7 9 2\n11', '4 5'),
      hidden('4\n0 4 3 0\n0', '0 3'),
    ],
  },

  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'You are given prices where `prices[i]` is the price of a stock on day `i`. Choose one day to buy and a later day to sell to maximise profit. Return the maximum profit, or 0 if no profit is possible.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nThe maximum profit.',
    descriptionHi:
      'Prices diye hain jahan `prices[i]` din `i` ka stock price hai. Ek din khareedna hai aur uske *baad* kisi din bechna hai, taaki profit maximum ho. Maximum profit return karo, ya 0 agar koi profit possible nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nMaximum profit.',
    examples: [
      {
        input: '6\n7 1 5 3 6 4',
        output: '5',
        explanation: 'Buy on day 2 (price 1) and sell on day 5 (price 6): profit 5.',
      },
      { input: '5\n7 6 4 3 1', output: '0', explanation: 'Prices only fall, so never buy.' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: [
      'You must buy before you sell — the order matters.',
      'While scanning left to right, what is the best price you could have bought at so far?',
      'Track the running minimum and the best profit achievable against it.',
    ],
    approach:
      'One pass, tracking the minimum price seen so far. At each day the best possible sale is `price - minSoFar`; keep the largest such value.',
    approachHi:
      'Ek pass mein ab tak ka minimum price track karo. Har din ka best profit `price - minSoFar` hai; in sab mein se sabse bada rakho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is Kadane\'s idea in disguise. You never need to look backwards, because the only thing that matters about the past is the cheapest day so far — every earlier day is dominated by it. So a single variable replaces the whole prefix, giving O(n) time and O(1) space.',
    solutionExplanationHi:
      'Ye asal mein Kadane wala idea hi hai. Peeche dekhne ki zarurat hi nahi, kyunki past ka sirf ek fact matter karta hai — ab tak ka sabse sasta din. Baaki har purana din usse dominated hai. Isliye ek variable poore prefix ki jagah le leta hai: O(n) time, O(1) space.',
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
let min = Infinity, best = 0;
for (const p of prices) { if (p < min) min = p; else if (p - min > best) best = p - min; }
console.log(best);`,
      `prices = nums(1)
low, best = float("inf"), 0
for p in prices:
    low = min(low, p)
    best = max(best, p - low)
print(best)`,
    ),
    testCases: [
      sample('6\n7 1 5 3 6 4', '5'),
      sample('5\n7 6 4 3 1', '0'),
      hidden('1\n5', '0'),
      hidden('2\n1 100', '99'),
      hidden('7\n3 3 5 0 0 3 1', '3'),
      hidden('5\n2 4 1 7 3', '6'),
    ],
  },

  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray (Kadane)',
    category: 'Arrays',
    difficulty: 'MEDIUM',
    description:
      'Find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one element.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe largest subarray sum.',
    descriptionHi:
      'Aisa contiguous subarray dhoondo jiska sum sabse bada ho, aur wahi sum return karo. Subarray mein kam se kam ek element hona chahiye.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSabse bada subarray sum.',
    examples: [
      {
        input: '9\n-2 1 -3 4 -1 2 1 -5 4',
        output: '6',
        explanation: 'The subarray [4, -1, 2, 1] sums to 6.',
      },
      { input: '5\n-3 -1 -4 -2 -5', output: '-1' },
    ],
    constraints: ['1 <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'At each index, ask: is it better to extend the previous subarray or start fresh here?',
      'If the running sum has gone negative, it can only hurt whatever comes next.',
      'current = max(nums[i], current + nums[i]); best = max(best, current)',
    ],
    approach:
      "Kadane's algorithm. Keep a running `current` best sum ending at index i. Either extend the previous run or restart at `nums[i]`, whichever is larger. Track the global maximum separately.",
    approachHi:
      "Kadane's algorithm. `current` rakho — index i par khatam hone wala best sum. Ya to pichhli run ko aage badhao, ya `nums[i]` se dobara shuru karo — jo bada ho. Global maximum alag se track karo.",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The key realisation: a subarray ending at `i` either includes `i-1`\'s subarray or it does not. If the best sum ending at `i-1` is negative, carrying it forward strictly hurts, so you drop it. That single local decision is enough — no need to compare all O(n^2) subarrays. Initialising `best` to the first element (not 0) is what makes the all-negative case correct.',
    solutionExplanationHi:
      'Main baat: `i` par khatam hone wala subarray ya to `i-1` wale subarray ko include karta hai ya nahi. Agar `i-1` tak ka best sum negative hai, to usko aage le jaane se nuksaan hi hoga — isliye chhod do. Bas yahi ek local decision kaafi hai, saare O(n^2) subarrays compare karne ki zarurat nahi. `best` ko 0 ki jagah pehle element se initialise karna hi all-negative case ko sahi banata hai.',
    starter: starter(
      `const arr = nums(1);

function maxSubArray(arr) {
  // your code here
}

console.log(maxSubArray(arr));`,
      `arr = nums(1)

def max_sub_array(arr):
    # your code here
    pass

print(max_sub_array(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let cur = arr[0], best = arr[0];
for (let i = 1; i < arr.length; i++) { cur = Math.max(arr[i], cur + arr[i]); best = Math.max(best, cur); }
console.log(best);`,
      `arr = nums(1)
cur = best = arr[0]
for x in arr[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)
print(best)`,
    ),
    testCases: [
      sample('9\n-2 1 -3 4 -1 2 1 -5 4', '6'),
      sample('5\n-3 -1 -4 -2 -5', '-1'),
      hidden('1\n1', '1'),
      hidden('5\n5 4 -1 7 8', '23'),
      hidden('4\n-2 -1 -3 -4', '-1'),
      hidden('6\n1 2 3 -10 4 5', '9'),
    ],
  },

  {
    slug: 'move-zeroes',
    title: 'Move Zeroes',
    category: 'Arrays',
    difficulty: 'EASY',
    description:
      'Move all zeroes in the array to the end while keeping the relative order of the non-zero elements. Do it in place.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe rearranged array, space-separated.',
    descriptionHi:
      'Array ke saare zeroes ko end mein bhej do, aur non-zero elements ka relative order same rakho. Ye in place karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nRearranged array, space se separate karke.',
    examples: [
      { input: '5\n0 1 0 3 12', output: '1 3 12 0 0' },
      { input: '1\n0', output: '0' },
    ],
    constraints: ['1 <= n <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    hints: [
      'A "write pointer" tells you where the next non-zero belongs.',
      'First pass: copy every non-zero forward. Second pass: fill the tail with zeroes.',
      'This can also be done in one pass by swapping.',
    ],
    approach:
      'Two pointers. A slow write index marks where the next non-zero goes; a fast read index scans the array. Every non-zero is written at the slow index, then the remainder is filled with zeroes.',
    approachHi:
      'Do pointers. Slow write index batata hai ki agla non-zero kahan jayega; fast read index array scan karta hai. Har non-zero slow index par likh do, phir bacha hua hissa zeroes se bhar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The relative-order requirement is what rules out the obvious "swap with the end" trick. Because the write pointer never overtakes the read pointer, copying forward can never clobber an element you have not read yet — which is exactly why the in-place version is safe.',
    solutionExplanationHi:
      'Relative order maintain karna hai — isi wajah se "end ke saath swap kar do" wala aasan trick kaam nahi karta. Kyunki write pointer kabhi read pointer se aage nahi jaata, aage copy karne se koi aisa element overwrite nahi hota jise abhi padha nahi gaya — isliye in-place version safe hai.',
    starter: starter(
      `const arr = nums(1);

function moveZeroes(arr) {
  // modify arr in place
}

moveZeroes(arr);
console.log(arr.join(' '));`,
      `arr = nums(1)

def move_zeroes(arr):
    # modify arr in place
    pass

move_zeroes(arr)
print(" ".join(map(str, arr)))`,
    ),
    solution: solution(
      `const arr = nums(1);
let w = 0;
for (let i = 0; i < arr.length; i++) if (arr[i] !== 0) arr[w++] = arr[i];
while (w < arr.length) arr[w++] = 0;
console.log(arr.join(' '));`,
      `arr = nums(1)
w = 0
for x in arr:
    if x != 0:
        arr[w] = x
        w += 1
for i in range(w, len(arr)):
    arr[i] = 0
print(" ".join(map(str, arr)))`,
    ),
    testCases: [
      sample('5\n0 1 0 3 12', '1 3 12 0 0'),
      sample('1\n0', '0'),
      hidden('4\n1 2 3 4', '1 2 3 4'),
      hidden('4\n0 0 0 0', '0 0 0 0'),
      hidden('6\n0 0 1 0 2 0', '1 2 0 0 0 0'),
    ],
  },

  /* ------------------------------------ Strings ---------------------------------- */
  {
    slug: 'reverse-string',
    title: 'Reverse String',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Reverse the given string in place using O(1) extra space.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe reversed string.',
    descriptionHi:
      'Di gayi string ko in place reverse karo, O(1) extra space mein.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nReversed string.',
    examples: [
      { input: 'hello', output: 'olleh' },
      { input: 'DevPrep', output: 'perPveD' },
    ],
    constraints: ['1 <= length <= 10^5', 'Printable ASCII characters'],
    hints: [
      'Swap the first and last characters, then move inwards.',
      'Stop when the two pointers meet in the middle.',
    ],
    approach:
      'Two pointers from both ends, swapping and converging. Interviewers usually want to see this rather than a library reverse.',
    approachHi:
      'Dono ends se do pointers, swap karte hue beech mein milao. Interviewer aksar library reverse ki jagah yahi dekhna chahta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Note the language trap: in JavaScript and Python, strings are immutable, so a genuinely in-place reverse needs an array/list of characters first. Interviewers often ask about exactly this — the algorithm is O(1) space, but the language forces an O(n) buffer.',
    solutionExplanationHi:
      'Language ka ek trap yaad rakho: JavaScript aur Python mein strings immutable hoti hain, isliye sach much in-place reverse ke liye pehle characters ka array/list banana padta hai. Interviewer aksar yahi puchhta hai — algorithm O(1) space ka hai, par language O(n) buffer force kar deti hai.',
    starter: starter(
      `const s = line(0);

function reverse(s) {
  // your code here
}

console.log(reverse(s));`,
      `s = line(0)

def reverse(s):
    # your code here
    pass

print(reverse(s))`,
    ),
    solution: solution(
      `const chars = line(0).split('');
let i = 0, j = chars.length - 1;
while (i < j) { const t = chars[i]; chars[i] = chars[j]; chars[j] = t; i++; j--; }
console.log(chars.join(''));`,
      `chars = list(line(0))
i, j = 0, len(chars) - 1
while i < j:
    chars[i], chars[j] = chars[j], chars[i]
    i += 1
    j -= 1
print("".join(chars))`,
    ),
    testCases: [
      sample('hello', 'olleh'),
      sample('DevPrep', 'perPveD'),
      hidden('a', 'a'),
      hidden('abcdef', 'fedcba'),
      hidden('racecar', 'racecar'),
    ],
  },

  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Given two strings, determine whether the second is an anagram of the first (same characters, same counts, any order).\n\n**Input**\n- Line 1: string `s`\n- Line 2: string `t`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Do strings di hain — batao ki doosri pehli ka anagram hai ya nahi (same characters, same counts, order koi bhi).\n\n**Input**\n- Line 1: string `s`\n- Line 2: string `t`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'anagram\nnagaram', output: 'true' },
      { input: 'rat\ncar', output: 'false' },
    ],
    constraints: ['1 <= length <= 5 * 10^4', 'Lowercase English letters'],
    hints: [
      'Sorting both strings works but costs O(n log n).',
      'Anagrams have identical character frequencies — count instead of sort.',
      'Different lengths can never be anagrams; check that first.',
    ],
    approach:
      'Frequency counting. Bail out immediately if the lengths differ, then increment counts for `s` and decrement for `t`. Every count must end at zero.',
    approachHi:
      'Frequency counting. Agar lengths alag hain to turant false. Phir `s` ke liye count badhao aur `t` ke liye ghatao. Aakhir mein har count zero hona chahiye.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'The counting solution beats sorting because it never needs the characters ordered — only their multiset. A single map with `+1` for `s` and `-1` for `t` avoids a second pass and a second map. The follow-up interviewers love: "what changes for Unicode?" — the fixed-26-slot array stops working and you need a real hash map.',
    solutionExplanationHi:
      'Counting solution sorting se better hai kyunki hume characters ka order chahiye hi nahi — sirf unka multiset. Ek hi map mein `s` ke liye `+1` aur `t` ke liye `-1` karne se doosra pass aur doosra map bach jata hai. Interviewer ka favourite follow-up: "Unicode ke liye kya badlega?" — tab fixed 26-slot array kaam nahi karega, asli hash map chahiye.',
    starter: starter(
      `const s = line(0), t = line(1);

function isAnagram(s, t) {
  // your code here
}

console.log(isAnagram(s, t));`,
      `s, t = line(0), line(1)

def is_anagram(s, t):
    # your code here
    pass

print("true" if is_anagram(s, t) else "false")`,
    ),
    solution: solution(
      `const s = line(0), t = line(1);
if (s.length !== t.length) { console.log('false'); }
else {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);
  let ok = true;
  for (const c of t) {
    const left = (count.get(c) ?? 0) - 1;
    if (left < 0) { ok = false; break; }
    count.set(c, left);
  }
  console.log(String(ok));
}`,
      `s, t = line(0), line(1)
from collections import Counter
print("true" if Counter(s) == Counter(t) else "false")`,
    ),
    testCases: [
      sample('anagram\nnagaram', 'true'),
      sample('rat\ncar', 'false'),
      hidden('a\na', 'true'),
      hidden('ab\na', 'false'),
      hidden('listen\nsilent', 'true'),
      hidden('aacc\nccac', 'false'),
    ],
  },

  {
    slug: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Find the longest common prefix shared by all strings in the list. If there is none, print `(empty)`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n\n**Output**\nThe longest common prefix, or `(empty)`.',
    descriptionHi:
      'List ki saari strings ka sabse lamba common prefix nikalo. Agar koi common prefix nahi hai to `(empty)` print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n\n**Output**\nSabse lamba common prefix, ya `(empty)`.',
    examples: [
      { input: '3\nflower flow flight', output: 'fl' },
      { input: '3\ndog racecar car', output: '(empty)' },
    ],
    constraints: ['1 <= n <= 200', '1 <= word length <= 200', 'Lowercase English letters'],
    hints: [
      'The answer can never be longer than the shortest string.',
      'Compare character by character across all words at the same position.',
      'Stop the moment one word disagrees.',
    ],
    approach:
      'Vertical scanning: walk position 0, 1, 2… and compare that character across every word. The first mismatch (or the end of the shortest word) ends the prefix.',
    approachHi:
      'Vertical scanning: position 0, 1, 2… par chalo aur har word ka wahi character compare karo. Pehla mismatch (ya sabse chhoti word ka end) prefix khatam kar deta hai.',
    timeComplexity: 'O(total characters)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Vertical scanning is better than the "reduce pairwise" version in the common case because it exits at the first differing character — often after one or two comparisons. Worst case (all strings identical) both are the same. Watch the boundary: `i` must be checked against every word\'s length before indexing.',
    solutionExplanationHi:
      'Vertical scanning "pairwise reduce" se better hai common case mein, kyunki pehle differing character par hi ruk jata hai — aksar ek-do comparison mein. Worst case (saari strings same) dono barabar hain. Boundary ka dhyan rakho: index karne se pehle `i` ko har word ki length se check karna zaroori hai.',
    starter: starter(
      `const w = words(1);

function longestCommonPrefix(w) {
  // your code here
}

const res = longestCommonPrefix(w);
console.log(res === '' ? '(empty)' : res);`,
      `w = words(1)

def longest_common_prefix(w):
    # your code here
    return ""

res = longest_common_prefix(w)
print(res if res else "(empty)")`,
    ),
    solution: solution(
      `const w = words(1);
let prefix = '';
outer: for (let i = 0; i < w[0].length; i++) {
  const c = w[0][i];
  for (const word of w) if (i >= word.length || word[i] !== c) break outer;
  prefix += c;
}
console.log(prefix === '' ? '(empty)' : prefix);`,
      `w = words(1)
prefix = ""
for i, c in enumerate(w[0]):
    if all(i < len(x) and x[i] == c for x in w):
        prefix += c
    else:
        break
print(prefix if prefix else "(empty)")`,
    ),
    testCases: [
      sample('3\nflower flow flight', 'fl'),
      sample('3\ndog racecar car', '(empty)'),
      hidden('1\nalone', 'alone'),
      hidden('2\nsame same', 'same'),
      hidden('3\nab abc abcd', 'ab'),
      hidden('2\nprefix pre', 'pre'),
    ],
  },

  /* ------------------------------------ HashMap ---------------------------------- */
  {
    slug: 'first-unique-character',
    title: 'First Unique Character',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Return the index of the first non-repeating character in the string, or `-1` if every character repeats.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe index, or `-1`.',
    descriptionHi:
      'String ka pehla aisa character jo repeat nahi hota, uska index return karo. Agar har character repeat hota hai to `-1`.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nIndex, ya `-1`.',
    examples: [
      { input: 'leetcode', output: '0' },
      { input: 'loveleetcode', output: '2' },
      { input: 'aabb', output: '-1' },
    ],
    constraints: ['1 <= length <= 10^5', 'Lowercase English letters'],
    hints: [
      'You cannot know a character is unique until you have seen the whole string.',
      'Two passes: count everything first, then find the first count of 1.',
    ],
    approach:
      'Two passes over the string. The first builds a frequency map; the second returns the index of the first character whose count is 1.',
    approachHi:
      'String par do passes. Pehla pass frequency map banata hai; doosra pass pehle aise character ka index deta hai jiska count 1 hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'The subtlety is why one pass is impossible: uniqueness is a global property, so no prefix of the string is enough to decide it. The second pass must iterate the *string*, not the map — map iteration order is not the answer order in general, even though modern JS/Python preserve insertion order.',
    solutionExplanationHi:
      'Asli baat ye hai ki ek pass mein kyun nahi ho sakta: uniqueness ek global property hai, isliye string ka koi prefix decide karne ke liye kaafi nahi. Doosra pass *string* par chalna chahiye, map par nahi — general mein map ka iteration order answer ka order nahi hota, chahe modern JS/Python insertion order maintain karte hain.',
    starter: starter(
      `const s = line(0);

function firstUniq(s) {
  // your code here
}

console.log(firstUniq(s));`,
      `s = line(0)

def first_uniq(s):
    # your code here
    return -1

print(first_uniq(s))`,
    ),
    solution: solution(
      `const s = line(0);
const count = new Map();
for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);
let ans = -1;
for (let i = 0; i < s.length; i++) if (count.get(s[i]) === 1) { ans = i; break; }
console.log(ans);`,
      `s = line(0)
from collections import Counter
count = Counter(s)
print(next((i for i, c in enumerate(s) if count[c] == 1), -1))`,
    ),
    testCases: [
      sample('leetcode', '0'),
      sample('loveleetcode', '2'),
      sample('aabb', '-1'),
      hidden('z', '0'),
      hidden('aabbccddeef', '10'),
      hidden('abcabc', '-1'),
    ],
  },

  {
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Return the `k` most frequent elements. Sort the answer by frequency descending; break ties by the smaller value first.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe `k` elements, space-separated.',
    descriptionHi:
      '`k` sabse zyada frequent elements return karo. Answer ko frequency ke descending order mein sort karo; tie hone par chhota value pehle.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`k` elements, space se separate karke.',
    examples: [
      { input: '6\n1 1 1 2 2 3\n2', output: '1 2' },
      { input: '1\n1\n1', output: '1' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= k <= number of distinct elements'],
    hints: [
      'Count frequencies first — that part is unavoidable.',
      'Sorting the distinct values costs O(d log d). A heap of size k costs O(d log k).',
      'Bucket sort by frequency gets you to O(n), since no frequency can exceed n.',
    ],
    approach:
      'Count with a hash map, then order the distinct values by (frequency desc, value asc) and take the first `k`. A size-k heap or bucket sort by frequency avoids the full sort.',
    approachHi:
      'Hash map se count karo, phir distinct values ko (frequency desc, value asc) se order karke pehle `k` le lo. Size-k heap ya frequency ke hisaab se bucket sort karke full sort se bacha ja sakta hai.',
    timeComplexity: 'O(n log k) with a heap, O(n) with bucket sort',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The interesting bound is that frequencies live in `[1, n]`, so they can be used as array indices — bucket sort gives strict O(n) and beats every comparison-based approach. The explicit tie-break matters here: without it, two valid answers exist and the grader could not check your output deterministically.',
    solutionExplanationHi:
      'Interesting baat ye hai ki frequencies `[1, n]` ke beech hoti hain, isliye unhe array index ki tarah use kar sakte ho — bucket sort strict O(n) deta hai aur har comparison-based approach se better hai. Yahan explicit tie-break zaroori hai: uske bina do valid answers ban jaate, aur grader deterministically check nahi kar paata.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function topK(arr, k) {
  // your code here
}

console.log(topK(arr, k).join(' '));`,
      `arr, k = nums(1), num(2)

def top_k(arr, k):
    # your code here
    return []

print(" ".join(map(str, top_k(arr, k))))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
const count = new Map();
for (const x of arr) count.set(x, (count.get(x) ?? 0) + 1);
const out = [...count.entries()]
  .sort((a, b) => b[1] - a[1] || a[0] - b[0])
  .slice(0, k)
  .map((e) => e[0]);
console.log(out.join(' '));`,
      `arr, k = nums(1), num(2)
from collections import Counter
count = Counter(arr)
out = sorted(count.items(), key=lambda kv: (-kv[1], kv[0]))[:k]
print(" ".join(str(v) for v, _ in out))`,
    ),
    testCases: [
      sample('6\n1 1 1 2 2 3\n2', '1 2'),
      sample('1\n1\n1', '1'),
      hidden('5\n4 4 5 5 6\n2', '4 5'),
      hidden('7\n3 3 3 1 1 2 2\n3', '3 1 2'),
      hidden('4\n9 8 7 6\n4', '6 7 8 9'),
    ],
  },

  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Group the words that are anagrams of one another. Sort each group alphabetically, then sort the groups by their first word. Print one group per line, words space-separated.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n\n**Output**\nOne group per line.',
    descriptionHi:
      'Un words ko group karo jo ek doosre ke anagram hain. Har group ko alphabetically sort karo, phir groups ko unke pehle word se sort karo. Har line par ek group, words space se separate.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n\n**Output**\nHar line par ek group.',
    examples: [
      {
        input: '6\neat tea tan ate nat bat',
        output: 'ate eat tea\nbat\nnat tan',
        explanation: 'Three groups, each sorted internally and then ordered by first word.',
      },
    ],
    constraints: ['1 <= n <= 10^4', '1 <= word length <= 100', 'Lowercase English letters'],
    hints: [
      'Anagrams need a canonical form — something identical for every member of a group.',
      'Sorting the letters of a word gives exactly that.',
      'A 26-length count string works as a key too, and avoids the log factor.',
    ],
    approach:
      'Map each word to a canonical key (its sorted letters) and bucket words under that key in a hash map. The buckets are the groups.',
    approachHi:
      'Har word ko ek canonical key do (uske sorted letters) aur hash map mein us key ke neeche bucket bana do. Wahi buckets groups hain.',
    timeComplexity: 'O(n * k log k) where k is word length',
    spaceComplexity: 'O(n * k)',
    solutionExplanation:
      'The whole problem reduces to picking a good key. Sorted letters work because sorting is a canonical form: two words are anagrams exactly when their sorted forms are equal. The O(k) alternative is a 26-slot count tuple used as the key, which drops the `log k` — worth mentioning in an interview even if you code the simpler one.',
    solutionExplanationHi:
      'Poora problem ek achhi key choose karne par simat jata hai. Sorted letters kaam karte hain kyunki sorting ek canonical form hai: do words anagram tabhi hain jab unke sorted forms barabar hon. O(k) alternative hai 26-slot count tuple ko key banana, jo `log k` hata deta hai — interview mein mention karne layak, chahe aap simple wala hi likho.',
    starter: starter(
      `const w = words(1);

function groupAnagrams(w) {
  // return an array of groups
}

for (const g of groupAnagrams(w)) console.log(g.join(' '));`,
      `w = words(1)

def group_anagrams(w):
    # return a list of groups
    return []

for g in group_anagrams(w):
    print(" ".join(g))`,
    ),
    solution: solution(
      `const w = words(1);
const map = new Map();
for (const word of w) {
  const key = word.split('').sort().join('');
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(word);
}
const groups = [...map.values()].map((g) => g.sort());
groups.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
for (const g of groups) console.log(g.join(' '));`,
      `w = words(1)
from collections import defaultdict
buckets = defaultdict(list)
for word in w:
    buckets["".join(sorted(word))].append(word)
groups = sorted([sorted(g) for g in buckets.values()], key=lambda g: g[0])
for g in groups:
    print(" ".join(g))`,
    ),
    testCases: [
      sample('6\neat tea tan ate nat bat', 'ate eat tea\nbat\nnat tan'),
      hidden('1\na', 'a'),
      hidden('3\nabc bca cab', 'abc bca cab'),
      hidden('4\nab ba cd dc', 'ab ba\ncd dc'),
      hidden('3\nxyz zyx foo', 'foo\nxyz zyx'),
    ],
  },

  /* ---------------------------------- Two Pointer -------------------------------- */
  {
    slug: 'two-sum-sorted',
    title: 'Two Sum II (Sorted Array)',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'The array is sorted in non-decreasing order. Return the 1-based indices of the two numbers that add up to the target. Exactly one solution exists.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: target\n\n**Output**\nTwo 1-based indices, space-separated.',
    descriptionHi:
      'Array non-decreasing order mein sorted hai. Un do numbers ke 1-based index return karo jinka sum target hai. Exactly ek solution hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: target\n\n**Output**\nDo 1-based index, space se separate.',
    examples: [
      { input: '4\n2 7 11 15\n9', output: '1 2' },
      { input: '3\n2 3 4\n6', output: '1 3' },
    ],
    constraints: ['2 <= n <= 3 * 10^4', 'The array is sorted ascending', 'Exactly one solution'],
    hints: [
      'The array is sorted — the hash map from Two Sum is now overkill.',
      'Start with the widest pair (first and last). Is their sum too big or too small?',
      'Too big: move the right pointer left. Too small: move the left pointer right.',
    ],
    approach:
      'Two pointers at both ends. Compare the pair sum against the target and shrink the window from whichever side moves it in the right direction. O(1) extra space, unlike the hash-map version.',
    approachHi:
      'Dono ends par do pointers. Pair sum ko target se compare karo aur jis taraf se sahi direction milti hai wahan se window chhoti karo. Hash-map version ke ulat, ismein O(1) extra space lagta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Sortedness is what makes each move safe: if `arr[l] + arr[r] > target`, then `arr[l]` paired with anything at or left of `r` is also too big, so `r` can be discarded outright — no pair is ever skipped. That "discard a whole row of the matrix per step" argument is the correctness proof interviewers want to hear.',
    solutionExplanationHi:
      'Sorted hona hi har move ko safe banata hai: agar `arr[l] + arr[r] > target` hai, to `arr[l]` ke saath `r` ya usse left ka koi bhi element bhi bada hi hoga — isliye `r` ko poori tarah discard kar sakte ho, koi pair miss nahi hota. Yahi "har step par matrix ki poori row hata do" wala argument correctness ka proof hai jo interviewer sunna chahta hai.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function twoSumSorted(arr, target) {
  // return 1-based indices
}

console.log(twoSumSorted(arr, target).join(' '));`,
      `arr, target = nums(1), num(2)

def two_sum_sorted(arr, target):
    # return 1-based indices
    return []

print(" ".join(map(str, two_sum_sorted(arr, target))))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
let l = 0, r = arr.length - 1;
while (l < r) {
  const s = arr[l] + arr[r];
  if (s === target) { console.log((l + 1) + ' ' + (r + 1)); break; }
  if (s < target) l++; else r--;
}`,
      `arr, target = nums(1), num(2)
l, r = 0, len(arr) - 1
while l < r:
    s = arr[l] + arr[r]
    if s == target:
        print(l + 1, r + 1)
        break
    if s < target:
        l += 1
    else:
        r -= 1`,
    ),
    testCases: [
      sample('4\n2 7 11 15\n9', '1 2'),
      sample('3\n2 3 4\n6', '1 3'),
      hidden('2\n-1 0\n-1', '1 2'),
      hidden('6\n1 2 3 4 5 6\n11', '5 6'),
      hidden('5\n-5 -3 0 2 8\n-5', '1 3'),
    ],
  },

  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Each element is the height of a vertical line at that index. Pick two lines that, together with the x-axis, hold the most water. Return that maximum area.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated heights\n\n**Output**\nThe maximum area.',
    descriptionHi:
      'Har element us index par ek vertical line ki height hai. Aisi do lines chuno jo x-axis ke saath sabse zyada paani rok sakein. Wahi maximum area return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated heights\n\n**Output**\nMaximum area.',
    examples: [
      {
        input: '9\n1 8 6 2 5 4 8 3 7',
        output: '49',
        explanation: 'Lines at index 1 and 8: width 7, height min(8,7)=7, area 49.',
      },
      { input: '2\n1 1', output: '1' },
    ],
    constraints: ['2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    hints: [
      'Area = width * min(left height, right height).',
      'Start as wide as possible. Any move inward loses width, so it must gain height.',
      'Moving the taller line can never help — move the shorter one.',
    ],
    approach:
      'Two pointers from the ends. Compute the area, then move the pointer at the *shorter* line inward, since that is the only move that can possibly increase the limiting height.',
    approachHi:
      'Dono ends se do pointers. Area nikalo, phir *chhoti* line wale pointer ko andar badhao — yahi ek move hai jo limiting height badha sakta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The greedy move is justified by an exchange argument: the area is capped by the shorter line, so keeping the shorter line and shrinking the width can never beat the current area. Every pair involving that shorter line is therefore dominated and can be discarded in one step — which is why O(n) suffices instead of checking all O(n^2) pairs.',
    solutionExplanationHi:
      'Greedy move ka justification exchange argument hai: area chhoti line se cap hota hai, isliye chhoti line ko rakh kar width kam karna current area se better ho hi nahi sakta. Us chhoti line wale saare pairs dominated hain aur ek step mein discard ho jaate hain — isiliye O(n) kaafi hai, saare O(n^2) pairs check karne ki zarurat nahi.',
    starter: starter(
      `const h = nums(1);

function maxArea(h) {
  // your code here
}

console.log(maxArea(h));`,
      `h = nums(1)

def max_area(h):
    # your code here
    return 0

print(max_area(h))`,
    ),
    solution: solution(
      `const h = nums(1);
let l = 0, r = h.length - 1, best = 0;
while (l < r) {
  best = Math.max(best, (r - l) * Math.min(h[l], h[r]));
  if (h[l] < h[r]) l++; else r--;
}
console.log(best);`,
      `h = nums(1)
l, r, best = 0, len(h) - 1, 0
while l < r:
    best = max(best, (r - l) * min(h[l], h[r]))
    if h[l] < h[r]:
        l += 1
    else:
        r -= 1
print(best)`,
    ),
    testCases: [
      sample('9\n1 8 6 2 5 4 8 3 7', '49'),
      sample('2\n1 1', '1'),
      hidden('4\n1 2 4 3', '4'),
      hidden('5\n1 2 1 2 1', '4'),
      hidden('3\n0 0 0', '0'),
    ],
  },

  {
    slug: 'remove-duplicates-sorted-array',
    title: 'Remove Duplicates from Sorted Array',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'The array is sorted. Remove duplicates in place so each value appears once, and print the number of unique elements followed by those elements.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\n- Line 1: the count of unique elements\n- Line 2: those elements, space-separated',
    descriptionHi:
      'Array sorted hai. In place duplicates hata do taaki har value ek hi baar aaye, phir unique elements ka count aur wo elements print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\n- Line 1: unique elements ka count\n- Line 2: wo elements, space se separate',
    examples: [
      { input: '3\n1 1 2', output: '2\n1 2' },
      { input: '10\n0 0 1 1 1 2 2 3 3 4', output: '5\n0 1 2 3 4' },
    ],
    constraints: ['1 <= n <= 3 * 10^4', 'The array is sorted ascending'],
    hints: [
      'Because the array is sorted, duplicates are always adjacent.',
      'Keep a write index for the next unique slot.',
      'Only write when the current value differs from the last written one.',
    ],
    approach:
      'Slow/fast pointers. The fast pointer scans; whenever it finds a value different from the last kept one, the slow pointer advances and stores it.',
    approachHi:
      'Slow/fast pointers. Fast pointer scan karta hai; jab bhi aisi value milti hai jo aakhri rakhi hui value se alag ho, slow pointer aage badh kar use store kar leta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Sortedness collapses "have I seen this value anywhere?" into "is it the same as the previous one?", which is what makes O(1) space possible — on an unsorted array you would need a hash set. The write pointer trails the read pointer, so the in-place overwrite is always safe.',
    solutionExplanationHi:
      'Sorted hone ki wajah se "kya ye value kahin dekhi thi?" simat kar "kya ye pichhli wali jaisi hai?" ban jata hai — isi se O(1) space possible hota hai. Unsorted array par hash set chahiye hota. Write pointer read pointer se peeche rehta hai, isliye in-place overwrite hamesha safe hai.',
    starter: starter(
      `const arr = nums(1);

function removeDuplicates(arr) {
  // return the new length
}

const k = removeDuplicates(arr);
console.log(k);
console.log(arr.slice(0, k).join(' '));`,
      `arr = nums(1)

def remove_duplicates(arr):
    # return the new length
    return 0

k = remove_duplicates(arr)
print(k)
print(" ".join(map(str, arr[:k])))`,
    ),
    solution: solution(
      `const arr = nums(1);
let w = 0;
for (let i = 0; i < arr.length; i++) if (i === 0 || arr[i] !== arr[i - 1]) arr[w++] = arr[i];
console.log(w);
console.log(arr.slice(0, w).join(' '));`,
      `arr = nums(1)
w = 0
for i, x in enumerate(arr):
    if i == 0 or x != arr[i - 1]:
        arr[w] = x
        w += 1
print(w)
print(" ".join(map(str, arr[:w])))`,
    ),
    testCases: [
      sample('3\n1 1 2', '2\n1 2'),
      sample('10\n0 0 1 1 1 2 2 3 3 4', '5\n0 1 2 3 4'),
      hidden('1\n7', '1\n7'),
      hidden('4\n2 2 2 2', '1\n2'),
      hidden('5\n1 2 3 4 5', '5\n1 2 3 4 5'),
    ],
  },

  /* --------------------------------- Sliding Window ------------------------------ */
  {
    slug: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Find the length of the longest substring that contains no repeated characters.\n\n**Input**\nOne line containing the string (may be empty).\n\n**Output**\nThe length of the longest such substring.',
    descriptionHi:
      'Sabse lambe us substring ki length nikalo jisme koi character repeat na ho.\n\n**Input**\nEk line jisme string hai (khaali bhi ho sakti hai).\n\n**Output**\nUs sabse lambe substring ki length.',
    examples: [
      { input: 'abcabcbb', output: '3', explanation: '"abc" has length 3.' },
      { input: 'bbbbb', output: '1' },
      { input: 'pwwkew', output: '3', explanation: '"wke" — note "pwke" is a subsequence, not a substring.' },
    ],
    constraints: ['0 <= length <= 5 * 10^4', 'Letters, digits, symbols and spaces'],
    hints: [
      'Maintain a window that is always duplicate-free.',
      'When you hit a repeat, the window must start after the previous occurrence.',
      'Store each character\'s last index so the left edge can jump instead of crawl.',
    ],
    approach:
      'Sliding window with a last-seen map. Extend the right edge one character at a time; on a repeat, jump the left edge to `lastIndex + 1`. Track the best width seen.',
    approachHi:
      'Sliding window ke saath last-seen map. Right edge ek-ek character aage badhao; repeat milne par left edge ko seedha `lastIndex + 1` par le jao. Sabse badi width track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, alphabet))',
    solutionExplanation:
      'The trap is moving the left edge backwards. `Math.max(left, lastIndex + 1)` is essential — without it a character seen long before the current window would drag the window\'s start backwards and let duplicates back in. Each pointer only ever moves forward, so despite the nested feel the total work is O(n).',
    solutionExplanationHi:
      'Trap ye hai ki left edge peeche chala jaye. `Math.max(left, lastIndex + 1)` zaroori hai — iske bina current window se bahut pehle dekha gaya character window ki shuruaat ko peeche kheench lega aur duplicates wapas aa jayenge. Dono pointers sirf aage badhte hain, isliye nested lagne ke bawajood total kaam O(n) hi hai.',
    starter: starter(
      `const s = line(0);

function lengthOfLongest(s) {
  // your code here
}

console.log(lengthOfLongest(s));`,
      `s = line(0)

def length_of_longest(s):
    # your code here
    return 0

print(length_of_longest(s))`,
    ),
    solution: solution(
      `const s = line(0);
const last = new Map();
let left = 0, best = 0;
for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (last.has(c)) left = Math.max(left, last.get(c) + 1);
  last.set(c, i);
  best = Math.max(best, i - left + 1);
}
console.log(best);`,
      `s = line(0)
last = {}
left = best = 0
for i, c in enumerate(s):
    if c in last:
        left = max(left, last[c] + 1)
    last[c] = i
    best = max(best, i - left + 1)
print(best)`,
    ),
    testCases: [
      sample('abcabcbb', '3'),
      sample('bbbbb', '1'),
      sample('pwwkew', '3'),
      hidden('', '0'),
      hidden('abcdef', '6'),
      hidden('abba', '2'),
      hidden('tmmzuxt', '5'),
    ],
  },

  {
    slug: 'max-sum-subarray-size-k',
    title: 'Maximum Sum Subarray of Size K',
    category: 'Sliding Window',
    difficulty: 'EASY',
    description:
      'Find the maximum sum of any contiguous subarray of exactly length `k`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe maximum window sum.',
    descriptionHi:
      'Exactly `k` length ke kisi bhi contiguous subarray ka maximum sum nikalo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nMaximum window sum.',
    examples: [
      { input: '6\n2 1 5 1 3 2\n3', output: '9', explanation: '[5, 1, 3] sums to 9.' },
      { input: '5\n2 3 4 1 5\n2', output: '7' },
    ],
    constraints: ['1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Recomputing each window from scratch is O(n*k).',
      'Consecutive windows differ by exactly two elements.',
      'Add the entering element, subtract the leaving one.',
    ],
    approach:
      'Fixed-size sliding window. Sum the first `k` elements, then slide: add `arr[i]`, subtract `arr[i - k]`, and keep the running maximum.',
    approachHi:
      'Fixed-size sliding window. Pehle `k` elements ka sum lo, phir slide karo: `arr[i]` jodo, `arr[i - k]` ghatao, aur running maximum rakho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is the cleanest example of why sliding windows exist: adjacent windows share `k - 1` elements, so recomputing the shared part is pure waste. The incremental update makes each step O(1) regardless of `k`. Note this fixed-size variant is much simpler than the variable-size ones — there is no shrink condition to reason about.',
    solutionExplanationHi:
      'Sliding window kyun hota hai, uska sabse saaf example yahi hai: paas-paas ki windows mein `k - 1` elements common hote hain, isliye unhe dobara jodna sirf waste hai. Incremental update se har step O(1) ho jata hai, chahe `k` kitna bhi ho. Ye fixed-size variant variable-size walon se kaafi simple hai — yahan shrink condition sochne ki zarurat hi nahi.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function maxWindow(arr, k) {
  // your code here
}

console.log(maxWindow(arr, k));`,
      `arr, k = nums(1), num(2)

def max_window(arr, k):
    # your code here
    return 0

print(max_window(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
let sum = 0;
for (let i = 0; i < k; i++) sum += arr[i];
let best = sum;
for (let i = k; i < arr.length; i++) { sum += arr[i] - arr[i - k]; best = Math.max(best, sum); }
console.log(best);`,
      `arr, k = nums(1), num(2)
s = sum(arr[:k])
best = s
for i in range(k, len(arr)):
    s += arr[i] - arr[i - k]
    best = max(best, s)
print(best)`,
    ),
    testCases: [
      sample('6\n2 1 5 1 3 2\n3', '9'),
      sample('5\n2 3 4 1 5\n2', '7'),
      hidden('1\n5\n1', '5'),
      hidden('4\n-1 -2 -3 -4\n2', '-3'),
      hidden('5\n1 1 1 1 1\n5', '5'),
    ],
  },

  /* ------------------------------------- Stack ----------------------------------- */
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    category: 'Stack',
    difficulty: 'EASY',
    description:
      'Given a string of `()`, `[]` and `{}`, decide whether the brackets are balanced and correctly nested.\n\n**Input**\nOne line containing the bracket string.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      '`()`, `[]` aur `{}` wali ek string di hai — batao ki brackets balanced aur sahi tarah nested hain ya nahi.\n\n**Input**\nEk line jisme bracket string hai.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '()[]{}', output: 'true' },
      { input: '(]', output: 'false' },
      { input: '([)]', output: 'false', explanation: 'Correct counts, wrong nesting order.' },
    ],
    constraints: ['0 <= length <= 10^4', 'Only bracket characters'],
    hints: [
      'Counting brackets is not enough — `([)]` has correct counts but is invalid.',
      'The most recently opened bracket must close first. What structure is that?',
      'Do not forget to check that the stack is empty at the end.',
    ],
    approach:
      'Push every opening bracket onto a stack. On a closing bracket, pop and check that it matches. The string is valid only if nothing mismatches and the stack ends empty.',
    approachHi:
      'Har opening bracket ko stack par push karo. Closing bracket par pop karke check karo ki match hota hai ya nahi. String tabhi valid hai jab kuch mismatch na ho aur end mein stack khaali ho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Nesting is inherently last-in-first-out, which is exactly what a stack models — that pairing is the whole insight. Two failure modes are easy to miss: popping an empty stack (a closer with no opener) and a non-empty stack at the end (unclosed openers). Both must be handled or `(((` passes.',
    solutionExplanationHi:
      'Nesting apne aap mein last-in-first-out hai, aur stack bilkul yahi model karta hai — bas yahi poora insight hai. Do failure cases aksar chhoot jaate hain: khaali stack par pop karna (bina opener ke closer) aur end mein stack ka khaali na hona (band na hue openers). Dono handle karne padenge, warna `(((` pass ho jayega.',
    starter: starter(
      `const s = line(0);

function isValid(s) {
  // your code here
}

console.log(isValid(s));`,
      `s = line(0)

def is_valid(s):
    # your code here
    return False

print("true" if is_valid(s) else "false")`,
    ),
    solution: solution(
      `const s = line(0);
const pairs = { ')': '(', ']': '[', '}': '{' };
const stack = [];
let ok = true;
for (const c of s) {
  if (c === '(' || c === '[' || c === '{') stack.push(c);
  else if (stack.pop() !== pairs[c]) { ok = false; break; }
}
console.log(String(ok && stack.length === 0));`,
      `s = line(0)
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
ok = True
for c in s:
    if c in "([{":
        stack.append(c)
    elif not stack or stack.pop() != pairs.get(c):
        ok = False
        break
print("true" if ok and not stack else "false")`,
    ),
    testCases: [
      sample('()[]{}', 'true'),
      sample('(]', 'false'),
      sample('([)]', 'false'),
      hidden('', 'true'),
      hidden('{[]}', 'true'),
      hidden('(((', 'false'),
      hidden(')))', 'false'),
    ],
  },

  {
    slug: 'next-greater-element',
    title: 'Next Greater Element',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'For each element, find the first element to its right that is strictly greater. Print `-1` where none exists.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`n` values, space-separated.',
    descriptionHi:
      'Har element ke liye uske right mein pehla aisa element dhoondo jo strictly bada ho. Agar koi nahi hai to `-1` print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`n` values, space se separate.',
    examples: [
      { input: '4\n4 5 2 25', output: '5 25 25 -1' },
      { input: '4\n13 7 6 12', output: '-1 12 12 -1' },
    ],
    constraints: ['1 <= n <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'The brute force scans right from every index — O(n^2).',
      'Keep a stack of indices still waiting for their answer.',
      'When a bigger element arrives, it resolves every smaller one waiting on the stack.',
    ],
    approach:
      'Monotonic decreasing stack of indices. For each new element, pop every index whose value is smaller — the new element is their answer — then push the current index.',
    approachHi:
      'Indices ka monotonic decreasing stack. Har naye element ke liye un saare indices ko pop karo jinki value chhoti hai — naya element hi unka answer hai — phir current index push kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Each index is pushed once and popped at most once, so the total work is O(n) even though the inner loop looks quadratic — a classic amortised-analysis answer in interviews. The stack stays decreasing because anything smaller than the incoming value has already been resolved and removed. This monotonic-stack pattern also solves daily temperatures, stock spans and largest rectangle in a histogram.',
    solutionExplanationHi:
      'Har index ek baar push hota hai aur zyada se zyada ek baar pop — isliye inner loop quadratic dikhne ke bawajood total kaam O(n) hai. Interview mein ye classic amortised analysis wala jawab hai. Stack decreasing isliye rehta hai kyunki incoming value se chhota sab kuch pehle hi resolve hokar hat chuka hota hai. Yahi monotonic-stack pattern daily temperatures, stock span aur histogram ke largest rectangle mein bhi chalta hai.',
    starter: starter(
      `const arr = nums(1);

function nextGreater(arr) {
  // return an array of answers
}

console.log(nextGreater(arr).join(' '));`,
      `arr = nums(1)

def next_greater(arr):
    # return a list of answers
    return []

print(" ".join(map(str, next_greater(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const res = new Array(arr.length).fill(-1);
const stack = [];
for (let i = 0; i < arr.length; i++) {
  while (stack.length && arr[stack[stack.length - 1]] < arr[i]) res[stack.pop()] = arr[i];
  stack.push(i);
}
console.log(res.join(' '));`,
      `arr = nums(1)
res = [-1] * len(arr)
stack = []
for i, x in enumerate(arr):
    while stack and arr[stack[-1]] < x:
        res[stack.pop()] = x
    stack.append(i)
print(" ".join(map(str, res)))`,
    ),
    testCases: [
      sample('4\n4 5 2 25', '5 25 25 -1'),
      sample('4\n13 7 6 12', '-1 12 12 -1'),
      hidden('1\n5', '-1'),
      hidden('4\n4 3 2 1', '-1 -1 -1 -1'),
      hidden('4\n1 2 3 4', '2 3 4 -1'),
      hidden('5\n2 2 2 3 1', '3 3 3 -1 -1'),
    ],
  },
];
