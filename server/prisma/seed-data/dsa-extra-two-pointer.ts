import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Two Pointer — expansion batch. Rounds out the category beyond the original
 * three (Two Sum II, Container With Most Water, Remove Duplicates from
 * Sorted Array) with the k-sum family, the Trapping Rain Water classic, and
 * counting/greedy variants that reuse the same converging-pointer skeleton.
 */
export const dsaExtraTwoPointer: SeedProblem[] = [
  {
    slug: 'three-sum',
    title: '3Sum',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Find all unique triplets in the array that sum to 0. Each triplet\'s values must be printed ascending, and the triplets themselves printed in ascending (lexicographic) order, one per line.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nOne triplet per line, space-separated (nothing printed if none exist).',
    descriptionHi:
      'Array mein aise saare unique triplets dhoondo jinka sum 0 ho. Har triplet ke values ascending print hon, aur triplets khud bhi ascending (lexicographic) order mein, ek line par ek triplet.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nEk line par ek triplet, space se separate (kuch bhi nahi agar koi na ho).',
    examples: [
      { input: '6\n-1 0 1 2 -1 -4', output: '-1 -1 2\n-1 0 1' },
      { input: '3\n0 1 1', output: '' },
    ],
    constraints: ['3 <= n <= 3000', '-10^5 <= nums[i] <= 10^5', 'The output must not contain duplicate triplets'],
    hints: [
      'The brute force is O(n^3) and also needs deduplication work.',
      'Sort the array first — then fixing one element turns the rest into a Two Sum II (sorted, two-pointer) subproblem.',
      'After sorting, skip over duplicate values at every one of the three positions to avoid duplicate triplets.',
    ],
    approach:
      'Sort the array. Fix each index `i` as a potential smallest element of the triplet (skipping duplicate values of `i`), then run the two-pointer Two-Sum-II scan on the remainder for a target of `-nums[i]`, also skipping duplicate values at both the left and right pointers whenever a match is found.',
    approachHi:
      'Array ko sort karo. Har index `i` ko triplet ke potential sabse chhote element ki tarah fix karo (duplicate `i` values skip karte hue), phir baaki hisse par `-nums[i]` target ke liye two-pointer Two-Sum-II scan chalao, match milne par left aur right dono pointers ke duplicate values bhi skip karo.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1) extra (beyond the output)',
    solutionExplanation:
      'Sorting turns duplicate-avoidance into a simple adjacency check (equal values sit next to each other) and simultaneously enables the O(n) two-pointer scan per fixed first element, since the "find a pair summing to X" subproblem is now Two Sum II on a sorted array — together this drops the naive O(n^3) plus hash-based deduplication down to a clean O(n^2) with no extra deduplication structure needed.',
    solutionExplanationHi:
      'Sorting duplicate-avoidance ko ek simple adjacency check bana deta hai (equal values ek doosre ke bagal mein hoti hain), aur saath hi har fixed first element ke liye O(n) two-pointer scan enable karta hai, kyunki "X sum karne wala pair dhoondo" wala subproblem ab sorted array par Two Sum II ban jaata hai — dono milkar naive O(n^3) plus hash-based deduplication ko ek saaf O(n^2) mein badal dete hain, bina kisi extra deduplication structure ke.',
    starter: starter(
      `const arr = nums(1);

function threeSum(arr) {
  // return an array of triplets, each ascending, triplets lexicographically sorted
  return [];
}

for (const t of threeSum(arr)) console.log(t.join(' '));`,
      `arr = nums(1)

def three_sum(arr):
    # return a list of triplets, each ascending, triplets lexicographically sorted
    return []

for t in three_sum(arr):
    print(" ".join(map(str, t)))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b);
const out = [];
for (let i = 0; i < arr.length - 2; i++) {
  if (i > 0 && arr[i] === arr[i - 1]) continue;
  let l = i + 1, r = arr.length - 1;
  while (l < r) {
    const sum = arr[i] + arr[l] + arr[r];
    if (sum === 0) {
      out.push([arr[i], arr[l], arr[r]]);
      l++; r--;
      while (l < r && arr[l] === arr[l - 1]) l++;
      while (l < r && arr[r] === arr[r + 1]) r--;
    } else if (sum < 0) l++;
    else r--;
  }
}
for (const t of out) console.log(t.join(' '));`,
      `arr = sorted(nums(1))
out = []
n = len(arr)
for i in range(n - 2):
    if i > 0 and arr[i] == arr[i - 1]:
        continue
    l, r = i + 1, n - 1
    while l < r:
        s = arr[i] + arr[l] + arr[r]
        if s == 0:
            out.append([arr[i], arr[l], arr[r]])
            l += 1; r -= 1
            while l < r and arr[l] == arr[l - 1]:
                l += 1
            while l < r and arr[r] == arr[r + 1]:
                r -= 1
        elif s < 0:
            l += 1
        else:
            r -= 1
for t in out:
    print(" ".join(map(str, t)))`,
    ),
    testCases: [
      sample('6\n-1 0 1 2 -1 -4', '-1 -1 2\n-1 0 1'),
      sample('3\n0 1 1', ''),
      hidden('3\n0 0 0', '0 0 0'),
      hidden('4\n0 0 0 0', '0 0 0'),
      hidden('3\n1 2 -3', '-3 1 2'),
      hidden('5\n-2 0 0 2 2', '-2 0 2'),
    ],
  },

  {
    slug: 'three-sum-closest',
    title: '3Sum Closest',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Given an array and a target, find the sum of three integers such that the sum is closest to the target, and return that sum.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nThe closest sum.',
    descriptionHi:
      'Ek array aur target diya hai. Teen integers ka aisa sum dhoondo jo target ke sabse nazdeek ho, wahi sum return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nSabse nazdeek sum.',
    examples: [
      { input: '4\n-1 2 1 -4\n1', output: '2' },
      { input: '3\n0 0 0\n1', output: '0' },
    ],
    constraints: ['3 <= n <= 500', '-1000 <= nums[i], target <= 1000'],
    hints: [
      'This reuses the exact sort-then-two-pointer skeleton from 3Sum.',
      'Instead of looking for an exact match, track whichever sum seen so far has the smallest absolute distance to the target.',
      'Move the pointer on the side that would bring the sum closer to the target, same as before.',
    ],
    approach:
      'Sort the array. Fix each index `i`, then two-pointer scan the remainder, tracking the closest sum found so far by absolute distance to the target. Move the left pointer right if the current sum is too small, or the right pointer left if too big.',
    approachHi:
      'Array sort karo. Har index `i` fix karo, phir baaki hisse par two-pointer scan karo, ab tak ka sabse nazdeek sum (absolute distance se target tak) track karte hue. Agar sum chhota hai to left pointer aage badhao, bada hai to right pointer peeche.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Because the array is sorted, moving the left pointer right strictly increases the current triplet sum and moving the right pointer left strictly decreases it — so at every step there is exactly one directionally-correct move toward the target, letting the same O(n) two-pointer sweep per fixed first element find the closest sum without ever needing to check both directions.',
    solutionExplanationHi:
      'Array sorted hone ki wajah se, left pointer ko right move karna current triplet sum ko strictly badhata hai aur right pointer ko left move karna strictly ghataata hai — isliye har step par target ki taraf sirf ek hi sahi direction ka move hota hai. Yahi wajah hai ki har fixed first element ke liye wahi O(n) two-pointer sweep, bina dono directions check kiye, closest sum dhoond leta hai.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function threeSumClosest(arr, target) {
  // your code here
}

console.log(threeSumClosest(arr, target));`,
      `arr, target = nums(1), num(2)

def three_sum_closest(arr, target):
    # your code here
    pass

print(three_sum_closest(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b), target = num(2);
let best = arr[0] + arr[1] + arr[2];
for (let i = 0; i < arr.length - 2; i++) {
  let l = i + 1, r = arr.length - 1;
  while (l < r) {
    const sum = arr[i] + arr[l] + arr[r];
    if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
    if (sum === target) break;
    if (sum < target) l++; else r--;
  }
}
console.log(best);`,
      `arr, target = sorted(nums(1)), num(2)
best = arr[0] + arr[1] + arr[2]
n = len(arr)
for i in range(n - 2):
    l, r = i + 1, n - 1
    while l < r:
        s = arr[i] + arr[l] + arr[r]
        if abs(s - target) < abs(best - target):
            best = s
        if s == target:
            break
        if s < target:
            l += 1
        else:
            r -= 1
print(best)`,
    ),
    testCases: [
      sample('4\n-1 2 1 -4\n1', '2'),
      sample('3\n0 0 0\n1', '0'),
      hidden('3\n1 1 1\n0', '3'),
      hidden('5\n1 1 1 0 -1\n-100', '0'),
      hidden('4\n0 2 1 -3\n1', '0'),
      hidden('6\n-3 -2 -1 0 1 2\n0', '0'),
    ],
  },

  {
    slug: 'four-sum',
    title: '4Sum',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Find all unique quadruplets in the array that sum to `target`. Each quadruplet\'s values must be printed ascending, and the quadruplets themselves in ascending (lexicographic) order, one per line.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nOne quadruplet per line, space-separated (nothing if none exist).',
    descriptionHi:
      'Array mein aise saare unique quadruplets dhoondo jinka sum `target` ho. Har quadruplet ke values ascending print hon, aur quadruplets khud bhi ascending order mein, ek line par ek.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nEk line par ek quadruplet, space se separate (kuch nahi agar koi na ho).',
    examples: [
      { input: '6\n1 0 -1 0 -2 2\n0', output: '-2 -1 1 2\n-2 0 0 2\n-1 0 0 1' },
    ],
    constraints: ['4 <= n <= 200', '-10^9 <= nums[i] <= 10^9', 'The output must not contain duplicate quadruplets'],
    hints: [
      'This is 3Sum with one more fixed outer loop wrapped around it.',
      'Fix two indices, then two-pointer scan the rest for the remaining target — the same reduction 3Sum uses on Two Sum II.',
      'Skip duplicate values at all four positions (both fixed indices and both pointers) to avoid duplicate quadruplets.',
    ],
    approach:
      'Sort the array. Fix the first two indices `i < j` (skipping duplicates at each), then two-pointer scan the remainder for a target of `target - nums[i] - nums[j]`, skipping duplicate values at both the left and right pointers on every match.',
    approachHi:
      'Array sort karo. Pehle do indices `i < j` fix karo (har jagah duplicates skip karte hue), phir baaki hisse par `target - nums[i] - nums[j]` target ke liye two-pointer scan karo, match milne par left aur right dono pointers ke duplicates skip karo.',
    timeComplexity: 'O(n^3)',
    spaceComplexity: 'O(1) extra (beyond the output)',
    solutionExplanation:
      'This is the same reduction 3Sum applies to Two Sum, one level deeper: fixing two elements reduces 4Sum to a Two-Sum-II subproblem on the sorted remainder, so wrapping one more nested loop (with the same duplicate-skipping discipline) around the 3Sum solution generalizes it directly, at the cost of one extra order of complexity.',
    solutionExplanationHi:
      'Ye bilkul wahi reduction hai jo 3Sum, Two Sum par apply karta hai, bas ek level aur gehra: do elements fix karna 4Sum ko sorted remainder par Two-Sum-II subproblem bana deta hai. Isliye ek aur nested loop (wahi duplicate-skipping discipline ke saath) 3Sum solution ke around wrap karna use seedha generalize kar deta hai, bas ek extra complexity order ki keemat par.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function fourSum(arr, target) {
  // return an array of quadruplets, each ascending, lexicographically sorted
  return [];
}

for (const q of fourSum(arr, target)) console.log(q.join(' '));`,
      `arr, target = nums(1), num(2)

def four_sum(arr, target):
    # return a list of quadruplets, each ascending, lexicographically sorted
    return []

for q in four_sum(arr, target):
    print(" ".join(map(str, q)))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b), target = num(2);
const n = arr.length, out = [];
for (let i = 0; i < n - 3; i++) {
  if (i > 0 && arr[i] === arr[i - 1]) continue;
  for (let j = i + 1; j < n - 2; j++) {
    if (j > i + 1 && arr[j] === arr[j - 1]) continue;
    let l = j + 1, r = n - 1;
    while (l < r) {
      const sum = arr[i] + arr[j] + arr[l] + arr[r];
      if (sum === target) {
        out.push([arr[i], arr[j], arr[l], arr[r]]);
        l++; r--;
        while (l < r && arr[l] === arr[l - 1]) l++;
        while (l < r && arr[r] === arr[r + 1]) r--;
      } else if (sum < target) l++;
      else r--;
    }
  }
}
for (const q of out) console.log(q.join(' '));`,
      `arr, target = sorted(nums(1)), num(2)
n = len(arr)
out = []
for i in range(n - 3):
    if i > 0 and arr[i] == arr[i - 1]:
        continue
    for j in range(i + 1, n - 2):
        if j > i + 1 and arr[j] == arr[j - 1]:
            continue
        l, r = j + 1, n - 1
        while l < r:
            s = arr[i] + arr[j] + arr[l] + arr[r]
            if s == target:
                out.append([arr[i], arr[j], arr[l], arr[r]])
                l += 1; r -= 1
                while l < r and arr[l] == arr[l - 1]:
                    l += 1
                while l < r and arr[r] == arr[r + 1]:
                    r -= 1
            elif s < target:
                l += 1
            else:
                r -= 1
for q in out:
    print(" ".join(map(str, q)))`,
    ),
    testCases: [
      sample('6\n1 0 -1 0 -2 2\n0', '-2 -1 1 2\n-2 0 0 2\n-1 0 0 1'),
      hidden('5\n2 2 2 2 2\n8', '2 2 2 2'),
      hidden('4\n1 2 3 4\n100', ''),
      hidden('4\n0 0 0 0\n0', '0 0 0 0'),
      hidden('6\n1 -2 -5 -4 -3 3\n-11', '-5 -4 -3 1'),
    ],
  },

  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    category: 'Two Pointer',
    difficulty: 'HARD',
    description:
      'Given an elevation map where each bar has width 1, compute how much water it can trap after raining.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated bar heights\n\n**Output**\nThe total trapped water.',
    descriptionHi:
      'Ek elevation map diya hai jahan har bar ki width 1 hai. Barish ke baad kitna paani trap ho sakta hai, calculate karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated bar heights\n\n**Output**\nTotal trapped water.',
    examples: [
      { input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6' },
      { input: '6\n4 2 0 3 2 5', output: '9' },
    ],
    constraints: ['1 <= n <= 2*10^5', '0 <= height[i] <= 10^5'],
    hints: [
      'The water trapped at any bar equals min(tallest bar to its left, tallest bar to its right) minus its own height.',
      'Precomputing left-max and right-max arrays solves it in O(n) time and O(n) space.',
      'A two-pointer version needs only O(1) space: whichever side has the smaller current max is the side that is safe to resolve next.',
    ],
    approach:
      'Two pointers from both ends, tracking `leftMax` and `rightMax`. At each step, advance the pointer on the side with the smaller max: the water trapped there is `sideMax - height[pointer]`, because the smaller of the two maxes is guaranteed to be the true limiting wall for that position.',
    approachHi:
      'Dono ends se do pointers, `leftMax` aur `rightMax` track karte hue. Har step par jis side ka max chhota hai, us pointer ko aage badhao: wahan trapped water `sideMax - height[pointer]` hai, kyunki dono max mein se chhota hi us position ki asli limiting wall hai, guaranteed.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Water at any position is bounded by the *shorter* of its two surrounding walls, and the two-pointer version exploits a subtle guarantee: if leftMax <= rightMax, then no matter what lies beyond the right pointer, it cannot possibly be shorter than leftMax has already been proven to be from the left side, so the left position\'s trapped water is safely leftMax - height[left] without needing to know the exact right-side maximum yet.',
    solutionExplanationHi:
      'Kisi bhi position par paani uski do surrounding walls mein se *chhoti* wali se bound hota hai, aur two-pointer version ek subtle guarantee use karta hai: agar leftMax <= rightMax hai, to right pointer se aage kuch bhi ho, wo leftMax se chhota ho hi nahi sakta (jo left side se pehle hi prove ho chuka hai) — isliye left position ka trapped water safely leftMax - height[left] hai, bina right-side ka exact maximum jaane bhi.',
    starter: starter(
      `const h = nums(1);

function trap(h) {
  // your code here
}

console.log(trap(h));`,
      `h = nums(1)

def trap(h):
    # your code here
    pass

print(trap(h))`,
    ),
    solution: solution(
      `const h = nums(1);
let l = 0, r = h.length - 1, leftMax = 0, rightMax = 0, total = 0;
while (l < r) {
  if (h[l] <= h[r]) {
    leftMax = Math.max(leftMax, h[l]);
    total += leftMax - h[l];
    l++;
  } else {
    rightMax = Math.max(rightMax, h[r]);
    total += rightMax - h[r];
    r--;
  }
}
console.log(total);`,
      `h = nums(1)
l, r = 0, len(h) - 1
left_max = right_max = total = 0
while l < r:
    if h[l] <= h[r]:
        left_max = max(left_max, h[l])
        total += left_max - h[l]
        l += 1
    else:
        right_max = max(right_max, h[r])
        total += right_max - h[r]
        r -= 1
print(total)`,
    ),
    testCases: [
      sample('12\n0 1 0 2 1 0 1 3 2 1 2 1', '6'),
      sample('6\n4 2 0 3 2 5', '9'),
      hidden('1\n5', '0'),
      hidden('3\n3 3 3', '0'),
      hidden('5\n5 4 3 2 1', '0'),
      hidden('5\n1 2 3 4 5', '0'),
    ],
  },

  {
    slug: 'squares-of-a-sorted-array',
    title: 'Squares of a Sorted Array',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'Given an array sorted ascending (which may include negative numbers), return an array of the squares of each number, also sorted ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (sorted ascending)\n\n**Output**\nThe squares, sorted ascending, space-separated.',
    descriptionHi:
      'Ascending sorted array diya hai (negative numbers ho sakte hain). Har number ke square ka array return karo, wo bhi ascending sorted.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (ascending sorted)\n\n**Output**\nSquares, ascending sorted, space se separate.',
    examples: [
      { input: '5\n-4 -1 0 3 10', output: '0 1 9 16 100' },
      { input: '5\n-7 -3 2 3 11', output: '4 9 9 49 121' },
    ],
    constraints: ['1 <= n <= 10^4', 'The input array is sorted ascending'],
    hints: [
      'Squaring and then sorting is O(n log n) — the sorted input structure allows O(n).',
      'The largest square always comes from whichever end (leftmost negative or rightmost positive) is farthest from zero.',
      'Fill the result array from the back, comparing the absolute values at two pointers on both ends.',
    ],
    approach:
      'Two pointers at both ends of the input. Compare `|nums[l]|` and `|nums[r]|`; the larger one\'s square is the next-largest value overall, so place it at the back of the result array and move that pointer inward. Repeat until the pointers meet.',
    approachHi:
      'Input ke dono ends par do pointers. `|nums[l]|` aur `|nums[r]|` compare karo; jo bada hai, uska square overall agla sabse bada value hai — use result array ke peeche rakho aur wo pointer andar badhao. Jab tak pointers milein, repeat karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) for the output',
    solutionExplanation:
      'Because the input is sorted, the largest-magnitude value is always at one of the two ends — never in the middle — so repeatedly comparing just the two current end values and placing the bigger square at the back of the result (working inward) produces a fully sorted output in one linear pass, without ever needing a general-purpose sort.',
    solutionExplanationHi:
      'Input sorted hone ki wajah se, sabse badi magnitude wali value hamesha dono ends mein se ek par hoti hai — beech mein kabhi nahi — isliye sirf current do end values ko baar-baar compare karke bade square ko result ke peeche rakhna (andar ki taraf badhte hue) ek hi linear pass mein poora sorted output de deta hai, kisi general-purpose sort ki zaroorat nahi.',
    starter: starter(
      `const arr = nums(1);

function sortedSquares(arr) {
  // your code here
}

console.log(sortedSquares(arr).join(' '));`,
      `arr = nums(1)

def sorted_squares(arr):
    # your code here
    return []

print(" ".join(map(str, sorted_squares(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const n = arr.length;
const out = new Array(n);
let l = 0, r = n - 1;
for (let i = n - 1; i >= 0; i--) {
  if (Math.abs(arr[l]) > Math.abs(arr[r])) { out[i] = arr[l] * arr[l]; l++; }
  else { out[i] = arr[r] * arr[r]; r--; }
}
console.log(out.join(' '));`,
      `arr = nums(1)
n = len(arr)
out = [0] * n
l, r = 0, n - 1
for i in range(n - 1, -1, -1):
    if abs(arr[l]) > abs(arr[r]):
        out[i] = arr[l] * arr[l]
        l += 1
    else:
        out[i] = arr[r] * arr[r]
        r -= 1
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('5\n-4 -1 0 3 10', '0 1 9 16 100'),
      sample('5\n-7 -3 2 3 11', '4 9 9 49 121'),
      hidden('1\n0', '0'),
      hidden('3\n-3 -2 -1', '1 4 9'),
      hidden('3\n1 2 3', '1 4 9'),
      hidden('2\n-5 5', '25 25'),
    ],
  },

  {
    slug: 'partition-labels',
    title: 'Partition Labels',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Partition the string into as many parts as possible so that each letter appears in at most one part, and the parts, read left to right, reconstruct the original string. Print the size of each part.\n\n**Input**\nOne line containing lowercase letters.\n\n**Output**\nThe sizes of the partitions in order, space-separated.',
    descriptionHi:
      'String ko jitne zyada ho sake utne parts mein todo, taaki har letter sirf ek hi part mein aaye, aur parts ko left se right jodne par original string wapas ban jaaye. Har part ka size print karo.\n\n**Input**\nEk line jisme lowercase letters hain.\n\n**Output**\nPartitions ki sizes order mein, space se separate.',
    examples: [
      { input: 'ababcbacadefegdehijhklij', output: '9 7 8' },
      { input: 'eccbbbbdec', output: '10' },
    ],
    constraints: ['1 <= length <= 500', 'Lowercase English letters'],
    hints: [
      'A partition can only end at a position where none of the letters seen so far reappear later.',
      'Precompute, for every letter, the index of its last occurrence in the string.',
      'Walk the string extending the current partition\'s end to the last occurrence of every letter seen so far; close the partition when you reach that end.',
    ],
    approach:
      'First record the last occurrence index of every letter. Then scan left to right, maintaining the current partition\'s end as the maximum of the last-occurrence indices of every letter seen so far. When the scan position reaches that end, the partition closes — record its size and start a new one.',
    approachHi:
      'Pehle har letter ka last occurrence index record karo. Phir left se right scan karo, current partition ka end ab tak dekhe gaye har letter ke last-occurrence indices ka maximum rakh kar. Jab scan position us end tak pahunche, partition band ho jaata hai — uska size record karo aur naya partition shuru karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'A partition boundary is only valid at a point where every letter included so far has already made its last appearance — otherwise that letter would force a later part to overlap. Tracking "the furthest last-occurrence among letters seen so far" as a running end-of-partition marker, and closing the partition exactly when the scan catches up to that marker, finds every valid boundary in a single linear pass.',
    solutionExplanationHi:
      'Partition ki boundary sirf wahin valid hai jahan ab tak shamil har letter apna last appearance de chuka ho — warna wo letter kisi baad ke part ko overlap karne par majboor kar dega. "Ab tak dekhe gaye letters mein sabse door ka last-occurrence" ko ek running end-of-partition marker ki tarah track karna, aur scan us marker tak pahunchte hi partition band karna, ek hi linear pass mein har valid boundary dhoond leta hai.',
    starter: starter(
      `const s = line(0);

function partitionLabels(s) {
  // return an array of partition sizes
  return [];
}

console.log(partitionLabels(s).join(' '));`,
      `s = line(0)

def partition_labels(s):
    # return a list of partition sizes
    return []

print(" ".join(map(str, partition_labels(s))))`,
    ),
    solution: solution(
      `const s = line(0);
const last = new Map();
for (let i = 0; i < s.length; i++) last.set(s[i], i);
const out = [];
let start = 0, end = 0;
for (let i = 0; i < s.length; i++) {
  end = Math.max(end, last.get(s[i]));
  if (i === end) { out.push(end - start + 1); start = i + 1; }
}
console.log(out.join(' '));`,
      `s = line(0)
last = {c: i for i, c in enumerate(s)}
out = []
start = end = 0
for i, c in enumerate(s):
    end = max(end, last[c])
    if i == end:
        out.append(end - start + 1)
        start = i + 1
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('ababcbacadefegdehijhklij', '9 7 8'),
      sample('eccbbbbdec', '10'),
      hidden('a', '1'),
      hidden('ab', '1 1'),
      hidden('aab', '2 1'),
      hidden('abab', '4'),
    ],
  },

  {
    slug: 'boats-to-save-people',
    title: 'Boats to Save People',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Each boat carries at most two people, and the sum of their weights must not exceed `limit`. Find the minimum number of boats needed to carry everyone.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated weights\n- Line 3: `limit`\n\n**Output**\nThe minimum number of boats.',
    descriptionHi:
      'Har boat zyada se zyada do logon ko le ja sakti hai, aur unke weights ka sum `limit` se zyada nahi hona chahiye. Sabko le jaane ke liye minimum boats chahiye, wo batao.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated weights\n- Line 3: `limit`\n\n**Output**\nMinimum boats.',
    examples: [
      { input: '2\n1 2\n3', output: '1' },
      { input: '4\n3 2 2 1\n3', output: '3' },
    ],
    constraints: ['1 <= n <= 5*10^4', '1 <= weight[i] <= limit <= 3*10^4'],
    hints: [
      'Sort the weights first.',
      'Always try to pair the heaviest remaining person with the lightest remaining person.',
      'If the heaviest and lightest cannot share a boat, the heaviest must go alone — but the lightest might still pair with someone else next round.',
    ],
    approach:
      'Sort the weights. Use two pointers at both ends: if the lightest and heaviest remaining people fit together (`weight[l] + weight[r] <= limit`), send them in the same boat and advance both pointers; otherwise send the heaviest alone and only advance the right pointer. Count one boat per iteration.',
    approachHi:
      'Weights sort karo. Dono ends par do pointers use karo: agar sabse halka aur sabse bhaari saath fit ho jaate hain (`weight[l] + weight[r] <= limit`), to unhe ek hi boat mein bhejo aur dono pointers badhao; warna sabse bhaari akele jaayega, sirf right pointer badhao. Har iteration mein ek boat count karo.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) extra (beyond the sort)',
    solutionExplanation:
      'The heaviest remaining person always needs a boat no matter what, so the only real decision is whether anyone can ride along for free — and the best possible partner for the heaviest person is always the *lightest* remaining one, since if even the lightest cannot fit, no one else can either. That greedy pairing, applied from both ends inward, never wastes boat capacity and is provably optimal.',
    solutionExplanationHi:
      'Sabse bhaari bacha hua person ko har haal mein ek boat chahiye, isliye asli decision sirf itna hai ki koi unke saath free mein ja sakta hai ya nahi — aur sabse bhaari ke liye sabse best partner hamesha sabse halka bacha hua hi hota hai, kyunki agar sabse halka bhi fit nahi hota, to koi aur bhi nahi hoga. Ye greedy pairing, dono ends se andar aate hue apply karne par, kabhi boat capacity waste nahi karti aur provably optimal hai.',
    starter: starter(
      `const weights = nums(1), limit = num(2);

function numRescueBoats(weights, limit) {
  // your code here
}

console.log(numRescueBoats(weights, limit));`,
      `weights, limit = nums(1), num(2)

def num_rescue_boats(weights, limit):
    # your code here
    pass

print(num_rescue_boats(weights, limit))`,
    ),
    solution: solution(
      `const weights = nums(1).sort((a, b) => a - b), limit = num(2);
let l = 0, r = weights.length - 1, boats = 0;
while (l <= r) {
  if (weights[l] + weights[r] <= limit) l++;
  r--;
  boats++;
}
console.log(boats);`,
      `weights, limit = sorted(nums(1)), num(2)
l, r, boats = 0, len(weights) - 1, 0
while l <= r:
    if weights[l] + weights[r] <= limit:
        l += 1
    r -= 1
    boats += 1
print(boats)`,
    ),
    testCases: [
      sample('2\n1 2\n3', '1'),
      sample('4\n3 2 2 1\n3', '3'),
      hidden('4\n3 5 3 4\n5', '4'),
      hidden('1\n5\n5', '1'),
      hidden('5\n1 1 1 1 1\n2', '3'),
      hidden('6\n1 2 2 3 3 4\n6', '3'),
    ],
  },

  {
    slug: 'is-subsequence',
    title: 'Is Subsequence',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'Determine whether `s` is a subsequence of `t` (the characters of `s` appear in `t` in the same relative order, not necessarily contiguous).\n\n**Input**\n- Line 1: `s`\n- Line 2: `t`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki `s`, `t` ka subsequence hai ya nahi (`s` ke characters `t` mein usi relative order mein aane chahiye, contiguous hone ki zaroorat nahi).\n\n**Input**\n- Line 1: `s`\n- Line 2: `t`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'abc\nahbgdc', output: 'true' },
      { input: 'axc\nahbgdc', output: 'false' },
    ],
    constraints: ['0 <= s.length <= 100', '0 <= t.length <= 10^4'],
    hints: [
      'An empty `s` is trivially a subsequence of anything.',
      'Walk `t` once, advancing a separate pointer into `s` only when characters match.',
      '`s` is a subsequence exactly when its pointer reaches the end of `s` by the time `t` is exhausted.',
    ],
    approach:
      'Two pointers, one into `s` and one into `t`. Walk `t` from the start; whenever the current characters match, advance the `s` pointer too. `s` is a subsequence of `t` exactly when the `s` pointer reaches the end of `s`.',
    approachHi:
      'Do pointers, ek `s` mein, ek `t` mein. `t` ko shuru se walk karo; jab bhi current characters match karte hain, `s` wale pointer ko bhi aage badhao. `s`, `t` ka subsequence hai agar `s` wala pointer `s` ke end tak pahunch jaata hai.',
    timeComplexity: 'O(len(t))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Because subsequence matching only cares about relative order, a single greedy left-to-right scan of `t` is enough: matching a character as early as possible in `t` never hurts the chance of matching the rest of `s` later, so there is no need to backtrack or try alternative matchings — the greedy pointer either reaches the end of `s` or it does not.',
    solutionExplanationHi:
      'Subsequence matching sirf relative order ki parwah karta hai, isliye `t` ka ek hi greedy left-to-right scan kaafi hai: `t` mein jitni jaldi ho sake koi character match karna, baad mein `s` ke baaki hisse ko match karne ke chance ko kabhi kam nahi karta — isliye backtrack karne ya alternative matchings try karne ki zaroorat nahi. Greedy pointer ya to `s` ke end tak pahunchta hai ya nahi.',
    starter: starter(
      `const s = line(0), t = line(1);

function isSubsequence(s, t) {
  // your code here
}

console.log(isSubsequence(s, t));`,
      `s, t = line(0), line(1)

def is_subsequence(s, t):
    # your code here
    pass

print("true" if is_subsequence(s, t) else "false")`,
    ),
    solution: solution(
      `const s = line(0), t = line(1);
let i = 0;
for (let j = 0; j < t.length && i < s.length; j++) if (t[j] === s[i]) i++;
console.log(i === s.length);`,
      `s, t = line(0), line(1)
i = 0
for c in t:
    if i < len(s) and c == s[i]:
        i += 1
print("true" if i == len(s) else "false")`,
    ),
    testCases: [
      sample('abc\nahbgdc', 'true'),
      sample('axc\nahbgdc', 'false'),
      hidden('\nabc', 'true'),
      hidden('abc\n', 'false'),
      hidden('abc\nabc', 'true'),
      hidden('aec\nabcde', 'false'),
    ],
  },

  {
    slug: 'three-sum-smaller',
    title: '3Sum Smaller',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Count the number of index triplets `(i, j, k)` with `i < j < k` such that `nums[i] + nums[j] + nums[k] < target`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nThe count of such triplets.',
    descriptionHi:
      'Aise index triplets `(i, j, k)` count karo jahan `i < j < k` ho aur `nums[i] + nums[j] + nums[k] < target` ho.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nAise triplets ka count.',
    examples: [
      { input: '4\n-2 0 1 3\n2', output: '2', explanation: '(-2,0,1) and (-2,0,3) both sum below 2.' },
      { input: '3\n0 0 0\n0', output: '0' },
    ],
    constraints: ['3 <= n <= 3500', '-100 <= nums[i] <= 100', '-300 <= target <= 300'],
    hints: [
      'Sorting first lets a two-pointer scan replace the innermost of the three nested loops.',
      'Fix the smallest index, then for the remaining sorted subarray: if `nums[i]+nums[l]+nums[r] < target`, then EVERY value between l and r paired with l also works (since the array is sorted) — that is many triplets counted at once.',
      'When the sum is too big, only the right pointer needs to move.',
    ],
    approach:
      'Sort the array. Fix index `i`, then two-pointer scan `l` and `r` over the rest: if `nums[i]+nums[l]+nums[r] < target`, every index between `l` and `r` also works with `l` fixed (because the array is sorted), contributing `r - l` triplets at once — add that and advance `l`. Otherwise move `r` left.',
    approachHi:
      'Array sort karo. Index `i` fix karo, phir baaki par `l` aur `r` se two-pointer scan karo: agar `nums[i]+nums[l]+nums[r] < target` hai, to `l` aur `r` ke beech ka har index bhi `l` ke saath kaam karega (array sorted hai isliye) — ek saath `r - l` triplets mil jaate hain, use answer mein jodo aur `l` aage badhao. Warna `r` ko peeche le jao.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The key leap beyond ordinary two-pointer search is that when a sum is found to be small enough, sortedness guarantees every index strictly between the two pointers would produce an equally small (or smaller) sum if swapped in for the right pointer — so instead of advancing one pointer and re-checking one pair at a time, the entire batch of `r - l` triplets can be counted in a single step, which is what keeps this at O(n^2) instead of degrading toward O(n^3).',
    solutionExplanationHi:
      'Ordinary two-pointer search se aage ka asli insight ye hai: jab ek sum kaafi chhota mil jaata hai, sortedness guarantee karta hai ki dono pointers ke beech ka har index, right pointer ki jagah use hone par bhi utna hi chhota (ya chhota) sum dega — isliye ek pointer badha kar ek-ek pair check karne ke bajaye, poora `r - l` triplets ka batch ek hi step mein count ho sakta hai. Yahi cheez ise O(n^2) mein rakhti hai, O(n^3) ki taraf jaane se bachati hai.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function threeSumSmaller(arr, target) {
  // your code here
}

console.log(threeSumSmaller(arr, target));`,
      `arr, target = nums(1), num(2)

def three_sum_smaller(arr, target):
    # your code here
    pass

print(three_sum_smaller(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b), target = num(2);
let total = 0;
for (let i = 0; i < arr.length - 2; i++) {
  let l = i + 1, r = arr.length - 1;
  while (l < r) {
    if (arr[i] + arr[l] + arr[r] < target) { total += r - l; l++; }
    else r--;
  }
}
console.log(total);`,
      `arr, target = sorted(nums(1)), num(2)
total = 0
n = len(arr)
for i in range(n - 2):
    l, r = i + 1, n - 1
    while l < r:
        if arr[i] + arr[l] + arr[r] < target:
            total += r - l
            l += 1
        else:
            r -= 1
print(total)`,
    ),
    testCases: [
      sample('4\n-2 0 1 3\n2', '2'),
      sample('3\n0 0 0\n0', '0'),
      hidden('3\n1 1 1\n0', '0'),
      hidden('5\n-1 0 1 2 -1\n0', '2'),
      hidden('4\n1 2 3 4\n100', '4'),
      hidden('4\n-5 -4 -3 -2\n-10', '2'),
    ],
  },

  {
    slug: 'valid-triangle-number',
    title: 'Valid Triangle Number',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Given an array of non-negative integers, count how many triplets can form the sides of a triangle with positive area (sum of any two sides must exceed the third).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nThe count of valid triangle triplets.',
    descriptionHi:
      'Non-negative integers ka array diya hai. Kitne triplets ek positive-area triangle ki sides ban sakte hain (kisi bhi do sides ka sum teesri se zyada hona chahiye), count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nValid triangle triplets ka count.',
    examples: [
      { input: '4\n2 2 3 4', output: '3' },
      { input: '4\n0 1 0 1', output: '0' },
    ],
    constraints: ['1 <= n <= 1000', '0 <= nums[i] <= 1000'],
    hints: [
      'Sort the array — once sorted, only `a + b > c` needs checking for `a <= b <= c` (the other two triangle-inequality conditions are then automatic).',
      'Fix the largest side `c` at the rightmost pointer, then two-pointer scan the rest for pairs `a, b` with `a + b > c`.',
      'If `nums[l] + nums[r] > nums[k]` (k fixed as the largest), every index between `l` and `r` also works with `r` fixed, similar to 3Sum Smaller.',
    ],
    approach:
      'Sort the array. Fix the largest element at index `k` (scanning from the end), then two-pointer scan `l` and `r` within `[0, k-1]`: if `nums[l] + nums[r] > nums[k]`, every index between `l` and `r` also forms a valid triangle with `r` and `k`, contributing `r - l` triplets at once, then move `r` left; otherwise move `l` right.',
    approachHi:
      'Array sort karo. Sabse bade element ko index `k` par fix karo (end se scan karte hue), phir `[0, k-1]` mein `l` aur `r` se two-pointer scan karo: agar `nums[l] + nums[r] > nums[k]` hai, to `l` aur `r` ke beech ka har index bhi `r` aur `k` ke saath valid triangle banata hai — `r - l` triplets ek saath mil jaate hain, phir `r` ko peeche le jao; warna `l` ko aage badhao.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'For sorted sides a <= b <= c, only a + b > c needs checking, because a + c > b and b + c > a are automatically true once a, b, c are all non-negative and c is the largest — this collapses the triangle inequality from three conditions to one. Fixing the largest side and two-pointer scanning the rest then mirrors 3Sum Smaller\'s batch-counting trick exactly: once a pair (l, r) satisfies the inequality, every index between l and r does too when paired with r, so a whole range of triplets is counted in one step.',
    solutionExplanationHi:
      'Sorted sides a <= b <= c ke liye, sirf a + b > c check karna kaafi hai, kyunki a + c > b aur b + c > a apne aap sahi hote hain jab a, b, c sab non-negative hon aur c sabse bada ho — isse triangle inequality teen conditions se ek mein simat jaati hai. Sabse bade side ko fix karke baaki par two-pointer scan karna, bilkul 3Sum Smaller wala batch-counting trick hai: jab ek pair (l, r) inequality satisfy karta hai, to l aur r ke beech ka har index bhi r ke saath kaam karega — ek poori range ek hi step mein count ho jaati hai.',
    starter: starter(
      `const arr = nums(1);

function triangleNumber(arr) {
  // your code here
}

console.log(triangleNumber(arr));`,
      `arr = nums(1)

def triangle_number(arr):
    # your code here
    pass

print(triangle_number(arr))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b);
let total = 0;
for (let k = arr.length - 1; k >= 2; k--) {
  let l = 0, r = k - 1;
  while (l < r) {
    if (arr[l] + arr[r] > arr[k]) { total += r - l; r--; }
    else l++;
  }
}
console.log(total);`,
      `arr = sorted(nums(1))
total = 0
for k in range(len(arr) - 1, 1, -1):
    l, r = 0, k - 1
    while l < r:
        if arr[l] + arr[r] > arr[k]:
            total += r - l
            r -= 1
        else:
            l += 1
print(total)`,
    ),
    testCases: [
      sample('4\n2 2 3 4', '3'),
      sample('4\n0 1 0 1', '0'),
      hidden('3\n1 1 1', '1'),
      hidden('3\n1 1 2', '0'),
      hidden('5\n4 2 3 4 5', '9'),
      hidden('2\n1 2', '0'),
    ],
  },

  {
    slug: 'two-sum-less-than-k',
    title: 'Two Sum Less Than K',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'Find the maximum sum of a pair of elements whose sum is strictly less than `k`. Return `-1` if no such pair exists.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe maximum valid pair sum, or `-1`.',
    descriptionHi:
      'Aise pair ka maximum sum dhoondo jiska sum `k` se strictly kam ho. Agar koi aisa pair nahi hai to `-1` return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nMaximum valid pair sum, ya `-1`.',
    examples: [
      { input: '8\n34 23 1 24 75 33 54 8\n60', output: '58' },
      { input: '3\n10 20 30\n15', output: '-1' },
    ],
    constraints: ['1 <= n <= 100', '1 <= nums[i] <= 1000', '1 <= k <= 2000'],
    hints: [
      'Sort the array first, then a two-pointer scan from both ends finds the best pair without checking all O(n^2) pairs.',
      'If the current pair sum is < k, it is a candidate answer — but a bigger sum might still exist by moving the left pointer up.',
      'If the current pair sum is >= k, the right side is too large and must shrink.',
    ],
    approach:
      'Sort the array. Two pointers from both ends: whenever `arr[l] + arr[r] < k`, record it as a candidate best answer and move `l` right (looking for an even bigger valid sum); whenever the sum is `>= k`, move `r` left instead.',
    approachHi:
      'Array sort karo. Dono ends se do pointers: jab bhi `arr[l] + arr[r] < k` ho, use candidate best answer ki tarah record karo aur `l` ko right move karo (aur bada valid sum dhoondne ke liye); jab sum `>= k` ho, `r` ko left move karo.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) extra (beyond the sort)',
    solutionExplanation:
      'On a sorted array, if the current pair is already under k, pairing the same left value with anything smaller than the current right value could never beat the current sum — so the only way to possibly find a bigger valid sum is to grow the left value, which is why the pointer moves right in that branch instead of left. This mirrors the two-pointer skeleton of Two Sum II, just optimizing for "largest sum under a bound" rather than "sum equals target".',
    solutionExplanationHi:
      'Sorted array par, agar current pair pehle se hi k se kam hai, to usi left value ko current right value se chhoti kisi value ke saath pair karna kabhi bhi current sum se better nahi ho sakta — isliye bada valid sum dhoondne ka ek hi tareeka hai: left value ko badhaana, isliye us branch mein pointer right move hota hai, left nahi. Ye bilkul Two Sum II wala hi two-pointer skeleton hai, bas "target ke barabar sum" ke bajaye "bound se kam sabse bada sum" ke liye optimize kiya gaya hai.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function twoSumLessThanK(arr, k) {
  // your code here
}

console.log(twoSumLessThanK(arr, k));`,
      `arr, k = nums(1), num(2)

def two_sum_less_than_k(arr, k):
    # your code here
    pass

print(two_sum_less_than_k(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b), k = num(2);
let l = 0, r = arr.length - 1, best = -1;
while (l < r) {
  const sum = arr[l] + arr[r];
  if (sum < k) { best = Math.max(best, sum); l++; }
  else r--;
}
console.log(best);`,
      `arr, k = sorted(nums(1)), num(2)
l, r, best = 0, len(arr) - 1, -1
while l < r:
    s = arr[l] + arr[r]
    if s < k:
        best = max(best, s)
        l += 1
    else:
        r -= 1
print(best)`,
    ),
    testCases: [
      sample('8\n34 23 1 24 75 33 54 8\n60', '58'),
      sample('3\n10 20 30\n15', '-1'),
      hidden('2\n1 1\n3', '2'),
      hidden('4\n1 2 3 4\n4', '3'),
      hidden('1\n5\n10', '-1'),
      hidden('5\n5 5 5 5 5\n10', '-1'),
    ],
  },

  {
    slug: 'remove-duplicates-sorted-array-ii',
    title: 'Remove Duplicates from Sorted Array II',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'The array is sorted. Remove elements in place so each value appears at most twice, preserving relative order. Print the new length followed by the kept elements.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\n- Line 1: the new length `k`\n- Line 2: the `k` kept elements, space-separated',
    descriptionHi:
      'Array sorted hai. In place elements hatao taaki har value zyada se zyada do baar aaye, relative order preserve karte hue. Naya length aur bache hue elements print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\n- Line 1: naya length `k`\n- Line 2: bache hue `k` elements, space se separate',
    examples: [
      { input: '6\n1 1 1 2 2 3', output: '5\n1 1 2 2 3' },
      { input: '9\n0 0 1 1 1 1 2 3 3', output: '7\n0 0 1 1 2 3 3' },
    ],
    constraints: ['1 <= n <= 3*10^4', 'The array is sorted ascending'],
    hints: [
      'A write pointer trailing a read pointer, as in the "at most once" version, but the keep-rule now allows up to two copies.',
      'Because the array is sorted, all copies of a value are adjacent — so comparing against the element two slots back in the WRITE array tells you whether keeping the current one would make three in a row.',
      'Keep `arr[read]` whenever `write < 2` or `arr[read] != arr[write - 2]`.',
    ],
    approach:
      'Two pointers: a write index and a read index. Keep `arr[read]` (copy it to `arr[write]` and advance write) whenever `write < 2` (fewer than two elements kept so far) or `arr[read] != arr[write - 2]` (keeping it would not create a third consecutive duplicate).',
    approachHi:
      'Do pointers: write index aur read index. `arr[read]` ko rakho (copy karo `arr[write]` mein, aur write badhao) jab bhi `write < 2` ho (ab tak do se kam elements rakhe hain) ya `arr[read] != arr[write - 2]` ho (isse rakhna teesra consecutive duplicate nahi banayega).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) extra',
    solutionExplanation:
      'Because the array is sorted, every run of equal values is contiguous, so the decision "would keeping this element create three in a row?" only ever needs to look at the element written two positions back in the OUTPUT (not the input) — if it differs from the current value, at most one copy of that value has been kept so far, so a second is always safe; if the array is genuinely sorted, three-in-a-row is the only violation possible, so this single check is both necessary and sufficient.',
    solutionExplanationHi:
      'Array sorted hone ki wajah se, equal values ka har run contiguous hota hai, isliye "isse rakhna kya teen consecutive bana dega?" wala decision sirf OUTPUT mein do position peeche wale element ko dekhne se ho jaata hai (input mein nahi) — agar wo current value se alag hai, to ab tak us value ki zyada se zyada ek copy rakhi gayi hai, isliye doosri hamesha safe hai; array genuinely sorted hone se, teen-consecutive hi ek possible violation hai, isliye ye ek check hi necessary aur sufficient hai.',
    starter: starter(
      `const arr = nums(1);

function removeDuplicates(arr) {
  // return the new length; arr's first k elements should be the kept ones
  return 0;
}

const k = removeDuplicates(arr);
console.log(k);
console.log(arr.slice(0, k).join(' '));`,
      `arr = nums(1)

def remove_duplicates(arr):
    # return the new length; arr's first k elements should be the kept ones
    return 0

k = remove_duplicates(arr)
print(k)
print(" ".join(map(str, arr[:k])))`,
    ),
    solution: solution(
      `const arr = nums(1);
let write = 0;
for (let read = 0; read < arr.length; read++) {
  if (write < 2 || arr[read] !== arr[write - 2]) arr[write++] = arr[read];
}
console.log(write);
console.log(arr.slice(0, write).join(' '));`,
      `arr = nums(1)
write = 0
for x in arr:
    if write < 2 or x != arr[write - 2]:
        arr[write] = x
        write += 1
print(write)
print(" ".join(map(str, arr[:write])))`,
    ),
    testCases: [
      sample('6\n1 1 1 2 2 3', '5\n1 1 2 2 3'),
      sample('9\n0 0 1 1 1 1 2 3 3', '7\n0 0 1 1 2 3 3'),
      hidden('1\n1', '1\n1'),
      hidden('3\n1 1 1', '2\n1 1'),
      hidden('4\n1 2 3 4', '4\n1 2 3 4'),
      hidden('5\n5 5 5 5 5', '2\n5 5'),
    ],
  },

  {
    slug: 'sort-array-by-parity',
    title: 'Sort Array By Parity',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'Rearrange the array in place so all even elements come before all odd elements. Use the two-pointer partition below: scan a left pointer forward and a right pointer backward, swapping an out-of-place odd (found from the left) with an out-of-place even (found from the right).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe rearranged array, space-separated.',
    descriptionHi:
      'Array ko in place rearrange karo taaki saare even elements saare odd elements se pehle aayein. Neeche wala two-pointer partition use karo: left pointer aage aur right pointer peeche scan karo, left se mile out-of-place odd ko right se mile out-of-place even se swap karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nRearranged array, space se separate.',
    examples: [
      { input: '4\n3 1 2 4', output: '4 2 1 3' },
      { input: '1\n0', output: '0' },
    ],
    constraints: ['1 <= n <= 5000', '0 <= nums[i] <= 5000'],
    hints: [
      'This is exactly the Dutch-flag-style partition used for Move Zeroes / Sort Colors, with a different predicate (parity instead of zero/non-zero).',
      'A left pointer looking for an odd number and a right pointer looking for an even number, swapped when both are found, partitions the array in one pass.',
      'Stop when the two pointers meet.',
    ],
    approach:
      'Two pointers from both ends. Advance the left pointer while it points at an even number, and the right pointer while it points at an odd number. When both stop (left on odd, right on even), swap them and continue; stop when the pointers meet.',
    approachHi:
      'Dono ends se do pointers. Left pointer ko tab tak aage badhao jab tak wo even number par ho, aur right pointer ko tab tak peeche jab tak wo odd number par ho. Jab dono ruk jaayein (left odd par, right even par), unhe swap karo aur aage badho; pointers milne par ruk jao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is the same in-place partitioning skeleton used across Move Zeroes and Sort Colors — a left pointer and a right pointer each hunt for an element that is on the "wrong side" of the partition, and a single swap fixes both violations at once, so every element is touched a bounded number of times and the whole array is partitioned in one linear pass with no extra memory.',
    solutionExplanationHi:
      'Ye bilkul wahi in-place partitioning skeleton hai jo Move Zeroes aur Sort Colors mein use hota hai — ek left pointer aur ek right pointer, dono apne "galat side" wale element ko dhoondte hain, aur ek hi swap dono violations ko theek kar deta hai. Isliye har element bounded baar touch hota hai aur poora array ek hi linear pass mein, bina extra memory ke, partition ho jaata hai.',
    starter: starter(
      `const arr = nums(1);

function sortArrayByParity(arr) {
  // return the rearranged array
  return arr;
}

console.log(sortArrayByParity(arr).join(' '));`,
      `arr = nums(1)

def sort_array_by_parity(arr):
    # return the rearranged list
    return arr

print(" ".join(map(str, sort_array_by_parity(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
let l = 0, r = arr.length - 1;
while (l < r) {
  if (arr[l] % 2 === 0) { l++; continue; }
  if (arr[r] % 2 === 1) { r--; continue; }
  [arr[l], arr[r]] = [arr[r], arr[l]];
  l++; r--;
}
console.log(arr.join(' '));`,
      `arr = nums(1)
l, r = 0, len(arr) - 1
while l < r:
    if arr[l] % 2 == 0:
        l += 1
    elif arr[r] % 2 == 1:
        r -= 1
    else:
        arr[l], arr[r] = arr[r], arr[l]
        l += 1
        r -= 1
print(" ".join(map(str, arr)))`,
    ),
    testCases: [
      sample('4\n3 1 2 4', '4 2 1 3'),
      sample('1\n0', '0'),
      hidden('4\n2 4 6 8', '2 4 6 8'),
      hidden('4\n1 3 5 7', '1 3 5 7'),
      hidden('2\n1 2', '2 1'),
      hidden('6\n1 2 3 4 5 6', '6 2 4 3 5 1'),
    ],
  },

  {
    slug: 'max-number-of-k-sum-pairs',
    title: 'Max Number of K-Sum Pairs',
    category: 'Two Pointer',
    difficulty: 'MEDIUM',
    description:
      'Each operation removes two numbers from the array whose sum equals `k`. Find the maximum number of such operations you can perform (each element may be used at most once).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe maximum number of pairs.',
    descriptionHi:
      'Har operation array se aise do numbers hataata hai jinka sum `k` ke barabar ho. Aise maximum kitne operations kar sakte ho (har element zyada se zyada ek baar use ho sakta hai), wo batao.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nMaximum pairs ki sankhya.',
    examples: [
      { input: '4\n1 2 3 4\n5', output: '2' },
      { input: '5\n3 1 3 4 3\n6', output: '1' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= nums[i] <= 10^9', '1 <= k <= 10^9'],
    hints: [
      'Sort the array first so a two-pointer scan replaces a hash-map count.',
      'From both ends: if the pair sum equals k, that is one operation — consume both and move inward.',
      'If the sum is too small, move the left pointer right; if too big, move the right pointer left.',
    ],
    approach:
      'Sort the array. Two pointers at both ends: if `arr[l] + arr[r] == k`, count a pair and move both pointers inward; if the sum is less than `k`, move `l` right; if greater, move `r` left.',
    approachHi:
      'Array sort karo. Dono ends par do pointers: agar `arr[l] + arr[r] == k` hai, ek pair count karo aur dono pointers andar badhao; sum kam hai to `l` right, zyada hai to `r` left.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) extra (beyond the sort)',
    solutionExplanation:
      'Once sorted, this becomes exactly Two Sum II\'s search logic, except every successful match is consumed (both pointers move inward) rather than immediately returned — so instead of stopping at the first pair, the same monotonic sweep keeps finding pairs until the pointers cross, greedily using each element at most once, which is optimal because a sorted array never leaves a better pairing behind by matching greedily from the outside in.',
    solutionExplanationHi:
      'Sort hone ke baad, ye bilkul Two Sum II wali hi search logic ban jaati hai, bas har successful match consume ho jaata hai (dono pointers andar badhte hain) na ki turant return ho jaata hai — isliye pehle pair par rukne ke bajaye, wahi monotonic sweep pointers cross hone tak pairs dhoondta rehta hai, har element ko zyada se zyada ek baar greedily use karte hue. Ye optimal hai kyunki sorted array mein bahar se andar greedily match karne se koi behtar pairing kabhi chhoot nahi sakti.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function maxOperations(arr, k) {
  // your code here
}

console.log(maxOperations(arr, k));`,
      `arr, k = nums(1), num(2)

def max_operations(arr, k):
    # your code here
    pass

print(max_operations(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1).sort((a, b) => a - b), k = num(2);
let l = 0, r = arr.length - 1, count = 0;
while (l < r) {
  const sum = arr[l] + arr[r];
  if (sum === k) { count++; l++; r--; }
  else if (sum < k) l++;
  else r--;
}
console.log(count);`,
      `arr, k = sorted(nums(1)), num(2)
l, r, count = 0, len(arr) - 1, 0
while l < r:
    s = arr[l] + arr[r]
    if s == k:
        count += 1
        l += 1
        r -= 1
    elif s < k:
        l += 1
    else:
        r -= 1
print(count)`,
    ),
    testCases: [
      sample('4\n1 2 3 4\n5', '2'),
      sample('5\n3 1 3 4 3\n6', '1'),
      hidden('2\n1 5\n6', '1'),
      hidden('4\n1 1 1 1\n2', '2'),
      hidden('1\n5\n10', '0'),
      hidden('6\n2 2 2 2 2 2\n4', '3'),
    ],
  },

  {
    slug: 'shortest-word-distance',
    title: 'Shortest Word Distance',
    category: 'Two Pointer',
    difficulty: 'EASY',
    description:
      'Given a list of words and two distinct words `word1` and `word2` guaranteed to both appear, return the shortest distance between any occurrence of `word1` and any occurrence of `word2`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n- Line 3: `word1`\n- Line 4: `word2`\n\n**Output**\nThe shortest distance.',
    descriptionHi:
      'Words ki ek list aur do distinct words `word1` aur `word2` diye hain (dono list mein guaranteed hain). `word1` aur `word2` ki kisi bhi occurrence ke beech ka shortest distance return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated words\n- Line 3: `word1`\n- Line 4: `word2`\n\n**Output**\nShortest distance.',
    examples: [
      { input: '5\npractice makes perfect coding makes\ncoding\npractice', output: '3' },
      { input: '5\npractice makes perfect coding makes\nmakes\ncoding', output: '1' },
    ],
    constraints: ['2 <= n <= 3*10^4', 'word1 != word2', 'Both words appear at least once'],
    hints: [
      'Checking every pair of occurrences of word1 and word2 is wasteful.',
      'Walk the list once, remembering the most recent index of each of the two target words.',
      'Every time either word is seen, and the other has already been seen at least once, update the best distance using their two most recent indices.',
    ],
    approach:
      'Single pass, tracking the most recent index seen for `word1` and for `word2` separately. Whenever either word is encountered and the other has a recorded index, update the running minimum distance using the two most recent indices.',
    approachHi:
      'Ek pass mein, `word1` aur `word2` ka alag-alag sabse recent index track karo. Jab bhi koi ek word milta hai aur doosre ka koi index record hai, dono sabse recent indices se running minimum distance update karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Because only the closest pair of occurrences matters and distance only depends on position, tracking just the *most recent* index of each target word (rather than every index ever seen) is sufficient — any older occurrence of either word is farther away than the current one, so it can never improve the answer, letting a single linear pass replace comparing every pair.',
    solutionExplanationHi:
      'Chunki sirf sabse nazdeek occurrences ka pair matter karta hai aur distance sirf position par depend karta hai, sirf har target word ka *sabse recent* index track karna kaafi hai (har dekha gaya index nahi) — kisi bhi word ki purani occurrence current wale se door hi hogi, isliye wo kabhi answer improve nahi kar sakti. Isse ek linear pass, har pair compare karne ki jagah le leta hai.',
    starter: starter(
      `const w = words(1);
const word1 = line(2), word2 = line(3);

function shortestDistance(w, word1, word2) {
  // your code here
}

console.log(shortestDistance(w, word1, word2));`,
      `w = words(1)
word1, word2 = line(2), line(3)

def shortest_distance(w, word1, word2):
    # your code here
    pass

print(shortest_distance(w, word1, word2))`,
    ),
    solution: solution(
      `const w = words(1);
const word1 = line(2), word2 = line(3);
let i1 = -1, i2 = -1, best = Infinity;
for (let i = 0; i < w.length; i++) {
  if (w[i] === word1) i1 = i;
  else if (w[i] === word2) i2 = i;
  if (i1 !== -1 && i2 !== -1) best = Math.min(best, Math.abs(i1 - i2));
}
console.log(best);`,
      `w = words(1)
word1, word2 = line(2), line(3)
i1 = i2 = -1
best = float("inf")
for i, word in enumerate(w):
    if word == word1:
        i1 = i
    elif word == word2:
        i2 = i
    if i1 != -1 and i2 != -1:
        best = min(best, abs(i1 - i2))
print(best)`,
    ),
    testCases: [
      sample('5\npractice makes perfect coding makes\ncoding\npractice', '3'),
      sample('5\npractice makes perfect coding makes\nmakes\ncoding', '1'),
      hidden('2\na b\na\nb', '1'),
      hidden('4\na b a b\na\nb', '1'),
      hidden('6\na x x x x b\na\nb', '5'),
      hidden('3\nb a b\na\nb', '1'),
    ],
  },
];
