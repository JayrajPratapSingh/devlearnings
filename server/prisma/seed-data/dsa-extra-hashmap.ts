import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * HashMap — expansion batch. Rounds out the category beyond the original
 * three (First Unique Character, Top K Frequent Elements, Group Anagrams)
 * with prefix-sum-plus-map counting problems, set-based lookups, and the
 * classic frequency-bucket patterns.
 */
export const dsaExtraHashMap: SeedProblem[] = [
  {
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Count the number of contiguous subarrays whose elements sum to exactly `k`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe count of matching subarrays.',
    descriptionHi:
      'Kitne contiguous subarrays ka sum exactly `k` ke barabar hai, count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nMatching subarrays ka count.',
    examples: [
      { input: '3\n1 1 1\n2', output: '2' },
      { input: '3\n1 2 3\n3', output: '2', explanation: 'Subarrays [1,2] and [3] both sum to 3.' },
    ],
    constraints: ['1 <= n <= 2*10^4', '-1000 <= nums[i] <= 1000', 'Values can be negative, so a sliding window alone does not work'],
    hints: [
      'Checking every subarray is O(n^2) — the negative numbers rule out a simple sliding window.',
      'The sum of any subarray `[i+1, j]` equals `prefixSum[j] - prefixSum[i]`.',
      'For each running prefix sum, count how many earlier prefix sums equal `currentSum - k` — a hash map answers that instantly.',
    ],
    approach:
      'Maintain a running prefix sum and a hash map counting how many times each prefix sum value has occurred so far (seeded with `{0: 1}` for the empty prefix). At each step, add to the answer the count of `currentSum - k` seen so far, then record the current sum in the map.',
    approachHi:
      'Ek running prefix sum aur ek hash map rakho jo batata hai ki har prefix sum value ab tak kitni baar aayi hai (`{0: 1}` se seed karo, empty prefix ke liye). Har step par, answer mein `currentSum - k` ka count jod do jo ab tak dikha hai, phir current sum ko map mein record kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Negative numbers break the "shrink the window when sum is too big" logic that works for all-positive sliding-window problems, so a different reformulation is needed: a subarray sums to k exactly when the difference between two prefix sums is k. Instead of checking all O(n^2) pairs of prefix sums, a hash map turns "how many earlier prefixes equal currentSum - k" into an O(1) lookup, seeded with prefixSum 0 occurring once to correctly count subarrays that start at index 0.',
    solutionExplanationHi:
      'Negative numbers us "sum zyada ho to window shrink karo" wali logic ko tod dete hain jo sab-positive sliding-window problems mein chalti hai, isliye alag reformulation chahiye: koi subarray k ke barabar tabhi sum hota hai jab do prefix sums ka difference k ho. O(n^2) prefix-sum pairs check karne ke bajaye, hash map "abhi tak kitne pehle prefixes currentSum - k ke barabar the" ko O(1) lookup bana deta hai — `{0: 1}` se seed karna zaroori hai taaki index 0 se shuru hone wale subarrays sahi count hon.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function subarraySum(arr, k) {
  // your code here
}

console.log(subarraySum(arr, k));`,
      `arr, k = nums(1), num(2)

def subarray_sum(arr, k):
    # your code here
    pass

print(subarray_sum(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
const count = new Map([[0, 1]]);
let sum = 0, total = 0;
for (const x of arr) {
  sum += x;
  total += count.get(sum - k) ?? 0;
  count.set(sum, (count.get(sum) ?? 0) + 1);
}
console.log(total);`,
      `arr, k = nums(1), num(2)
count = {0: 1}
s = total = 0
for x in arr:
    s += x
    total += count.get(s - k, 0)
    count[s] = count.get(s, 0) + 1
print(total)`,
    ),
    testCases: [
      sample('3\n1 1 1\n2', '2'),
      sample('3\n1 2 3\n3', '2'),
      hidden('1\n1\n0', '0'),
      hidden('4\n1 -1 0 1\n0', '4'),
      hidden('5\n3 4 7 2 -3\n7', '2'),
      hidden('3\n-1 -1 1\n0', '1'),
    ],
  },

  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Given an unsorted array of integers, find the length of the longest run of consecutive integers, in O(n) time.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe length of the longest consecutive run.',
    descriptionHi:
      'Ek unsorted integer array diya hai. Consecutive integers ke sabse lambe run ki length O(n) time mein dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSabse lambe consecutive run ki length.',
    examples: [
      { input: '6\n100 4 200 1 3 2', output: '4', explanation: 'The run 1,2,3,4 has length 4.' },
      { input: '10\n0 3 7 2 5 8 4 6 0 1', output: '9' },
    ],
    constraints: ['0 <= n <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Sorting first works but costs O(n log n) — the problem wants O(n).',
      'Put every value in a hash set for O(1) membership checks.',
      'Only start counting a run from a value `x` where `x - 1` is NOT in the set — that guarantees each run is only ever counted once, from its true start.',
    ],
    approach:
      'Insert every value into a hash set. For each value `x` that is a run-start (meaning `x - 1` is not in the set), walk forward counting `x, x+1, x+2, ...` while each is present, and track the longest such run.',
    approachHi:
      'Har value ko hash set mein daalo. Har us value `x` ke liye jo run-start hai (matlab `x - 1` set mein nahi hai), aage `x, x+1, x+2, ...` count karte jao jab tak wo present hain, aur sabse lamba run track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Without the run-start check, every element of every run would trigger its own forward walk, making the algorithm effectively O(n^2) in the worst case (e.g. one giant run). Checking that `x - 1` is absent before starting a walk guarantees each run is walked exactly once, from its true beginning — the total work across all walks is bounded by n because each element is visited by at most one successful walk.',
    solutionExplanationHi:
      'Run-start check ke bina, har run ke har element apna alag forward walk trigger kar dega, jisse worst case (jaise ek hi bada run) mein algorithm effectively O(n^2) ban jaata. `x - 1` ka absent hona check karke walk shuru karna guarantee karta hai ki har run exactly ek baar, apni sahi shuruaat se walk hota hai — saare walks ka total kaam n se bounded hai kyunki har element sirf ek successful walk mein visit hota hai.',
    starter: starter(
      `const arr = nums(1);

function longestConsecutive(arr) {
  // your code here
}

console.log(longestConsecutive(arr));`,
      `arr = nums(1)

def longest_consecutive(arr):
    # your code here
    pass

print(longest_consecutive(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
const set = new Set(arr);
let best = 0;
for (const x of set) {
  if (set.has(x - 1)) continue;
  let len = 1;
  while (set.has(x + len)) len++;
  best = Math.max(best, len);
}
console.log(best);`,
      `arr = nums(1)
s = set(arr)
best = 0
for x in s:
    if x - 1 in s:
        continue
    length = 1
    while x + length in s:
        length += 1
    best = max(best, length)
print(best)`,
    ),
    testCases: [
      sample('6\n100 4 200 1 3 2', '4'),
      sample('10\n0 3 7 2 5 8 4 6 0 1', '9'),
      hidden('0\n', '0'),
      hidden('1\n5', '1'),
      hidden('4\n1 2 0 1', '3'),
      hidden('5\n9 1 4 7 3', '2'),
    ],
  },

  {
    slug: 'contains-duplicate-ii',
    title: 'Contains Duplicate II',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Determine whether there exist two distinct indices `i` and `j` such that `nums[i] == nums[j]` and `|i - j| <= k`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki kya do distinct indices `i` aur `j` exist karte hain jahan `nums[i] == nums[j]` ho aur `|i - j| <= k` ho.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n1 2 3 1\n3', output: 'true' },
      { input: '6\n1 2 3 1 2 3\n2', output: 'false' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= k <= 10^5'],
    hints: [
      'Checking every pair within distance k is O(n*k) — too slow for large k.',
      'A hash map from value to its most recent index lets you check the distance condition in O(1) per element.',
      'Update the stored index for a value every time it is seen, so you always compare against the *nearest* previous occurrence.',
    ],
    approach:
      'Scan once, keeping a hash map from value to its last-seen index. For each element, if it was seen before and the index distance is `<= k`, return true; otherwise (or after checking) update the map with the current index.',
    approachHi:
      'Ek scan karo, ek hash map rakho jo value ko uske last-seen index se map kare. Har element ke liye, agar wo pehle dikha hai aur index distance `<= k` hai to `true` return karo; warna map ko current index se update kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Only the *most recent* occurrence of a value can possibly satisfy the distance constraint for the current index — any older occurrence is strictly farther away — so storing just the last-seen index per value (overwriting on every sighting) is sufficient, turning an O(n*k) brute force into a single O(n) pass with O(1) lookups.',
    solutionExplanationHi:
      'Kisi value ki sirf *sabse recent* occurrence hi current index ke liye distance constraint satisfy kar sakti hai — koi bhi purani occurrence strictly aur door hai — isliye sirf har value ka last-seen index store karna (har baar dekhte hi overwrite karna) kaafi hai, jo O(n*k) brute force ko ek O(n) pass mein badal deta hai, O(1) lookups ke saath.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function containsNearbyDuplicate(arr, k) {
  // your code here
}

console.log(containsNearbyDuplicate(arr, k));`,
      `arr, k = nums(1), num(2)

def contains_nearby_duplicate(arr, k):
    # your code here
    pass

print("true" if contains_nearby_duplicate(arr, k) else "false")`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
const last = new Map();
let ok = false;
for (let i = 0; i < arr.length; i++) {
  if (last.has(arr[i]) && i - last.get(arr[i]) <= k) { ok = true; break; }
  last.set(arr[i], i);
}
console.log(ok);`,
      `arr, k = nums(1), num(2)
last = {}
ok = False
for i, x in enumerate(arr):
    if x in last and i - last[x] <= k:
        ok = True
        break
    last[x] = i
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('4\n1 2 3 1\n3', 'true'),
      sample('6\n1 2 3 1 2 3\n2', 'false'),
      hidden('2\n1 1\n1', 'true'),
      hidden('1\n1\n0', 'false'),
      hidden('5\n1 0 1 1 0\n1', 'true'),
      hidden('5\n1 2 3 4 5\n5', 'false'),
    ],
  },

  {
    slug: 'ransom-note',
    title: 'Ransom Note',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Determine whether `ransomNote` can be constructed by using letters from `magazine`, where each letter in `magazine` can be used at most once.\n\n**Input**\n- Line 1: `ransomNote`\n- Line 2: `magazine`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki `ransomNote`, `magazine` ke letters use karke ban sakta hai ya nahi — `magazine` ka har letter zyada se zyada ek baar use ho sakta hai.\n\n**Input**\n- Line 1: `ransomNote`\n- Line 2: `magazine`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'a\nb', output: 'false' },
      { input: 'aa\naab', output: 'true' },
    ],
    constraints: ['1 <= length <= 4*10^4', 'Lowercase English letters'],
    hints: [
      'This is a frequency-comparison problem, not an order-matters problem.',
      'Count the letters available in `magazine`.',
      'For each letter needed in `ransomNote`, there must be enough of it left in the count.',
    ],
    approach:
      'Count the letter frequencies of `magazine`. Then for each character in `ransomNote`, decrement the corresponding count; if any count goes negative, `magazine` did not have enough of that letter.',
    approachHi:
      '`magazine` ke letter frequencies count karo. Phir `ransomNote` ke har character ke liye us count ko ghatao; agar koi count negative ho jaaye to `magazine` mein wo letter kaafi nahi tha.',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'Since letters can be rearranged freely, the only thing that matters is whether magazine has *enough of each letter*, never their order or position — reducing the whole problem to a single frequency-count comparison, which a hash map (or a 26-slot array for lowercase-only input) computes in one linear pass over each string.',
    solutionExplanationHi:
      'Chunki letters ko freely rearrange kiya ja sakta hai, sirf ye matter karta hai ki magazine mein *har letter ka kaafi count* hai ya nahi — order ya position kabhi matter nahi karti. Isse poora problem ek single frequency-count comparison ban jaata hai, jise hash map (ya lowercase-only input ke liye 26-slot array) har string par ek linear pass mein nikal leta hai.',
    starter: starter(
      `const note = line(0), mag = line(1);

function canConstruct(note, mag) {
  // your code here
}

console.log(canConstruct(note, mag));`,
      `note, mag = line(0), line(1)

def can_construct(note, mag):
    # your code here
    pass

print("true" if can_construct(note, mag) else "false")`,
    ),
    solution: solution(
      `const note = line(0), mag = line(1);
const count = new Map();
for (const c of mag) count.set(c, (count.get(c) ?? 0) + 1);
let ok = true;
for (const c of note) {
  const left = (count.get(c) ?? 0) - 1;
  if (left < 0) { ok = false; break; }
  count.set(c, left);
}
console.log(ok);`,
      `note, mag = line(0), line(1)
from collections import Counter
count = Counter(mag)
count.subtract(Counter(note))
print("true" if all(v >= 0 for v in count.values()) else "false")`,
    ),
    testCases: [
      sample('a\nb', 'false'),
      sample('aa\naab', 'true'),
      hidden('a\na', 'true'),
      hidden('aa\na', 'false'),
      hidden('fihjjjjei\nhjibfeej', 'false'),
      hidden('abc\ncbad', 'true'),
    ],
  },

  {
    slug: 'intersection-of-two-arrays',
    title: 'Intersection of Two Arrays',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Given two arrays, return their intersection: each shared value appears only once in the result, sorted ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `m`\n- Line 4: `m` space-separated integers\n\n**Output**\nThe intersection values, ascending, space-separated (empty line if none).',
    descriptionHi:
      'Do arrays diye hain. Unka intersection return karo: har shared value result mein sirf ek baar aaye, ascending sorted.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `m`\n- Line 4: `m` space-separated integers\n\n**Output**\nIntersection values, ascending, space se separate (khaali agar koi nahi).',
    examples: [
      { input: '4\n1 2 2 1\n2\n2 2', output: '2' },
      { input: '3\n4 9 5\n5\n9 4 9 8 4', output: '4 9' },
    ],
    constraints: ['1 <= n, m <= 1000', '0 <= nums[i] <= 1000'],
    hints: [
      'Since each shared value only appears once in the output, sets are exactly the right tool.',
      'Put one array into a set, then filter the other array to values present in that set.',
      'Deduplicate the result and sort it for a deterministic answer.',
    ],
    approach:
      'Convert the first array into a hash set. Walk the second array, collecting any value found in the set into a result set (which naturally deduplicates). Sort the result ascending.',
    approachHi:
      'Pehle array ko hash set bana do. Doosre array ko walk karo, jo bhi value set mein milti hai use ek result set mein daalo (jo apne aap deduplicate kar deta hai). Result ko ascending sort kar do.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      'Because the output must have each shared value exactly once regardless of how many times it repeats in either input, a set-based approach is a natural fit: set membership answers "is this value shared?" in O(1), and using a set for the output automatically absorbs any duplicate matches without extra bookkeeping.',
    solutionExplanationHi:
      'Chunki output mein har shared value exactly ek baar hona chahiye, chahe wo kisi bhi input mein kitni baar repeat ho, set-based approach yahan natural fit hai: set membership "kya ye value shared hai?" O(1) mein bata deta hai, aur output ke liye set use karne se koi bhi duplicate match bina extra bookkeeping ke apne aap absorb ho jaata hai.',
    starter: starter(
      `const a = nums(1);
const b = nums(3);

function intersection(a, b) {
  // return the intersection values (unique)
  return [];
}

console.log(intersection(a, b).sort((x, y) => x - y).join(' '));`,
      `a = nums(1)
b = nums(3)

def intersection(a, b):
    # return the intersection values (unique)
    return []

print(" ".join(map(str, sorted(intersection(a, b)))))`,
    ),
    solution: solution(
      `const a = nums(1);
const b = nums(3);
const setA = new Set(a);
const out = new Set(b.filter((x) => setA.has(x)));
console.log([...out].sort((x, y) => x - y).join(' '));`,
      `a = nums(1)
b = nums(3)
set_a = set(a)
out = {x for x in b if x in set_a}
print(" ".join(map(str, sorted(out))))`,
    ),
    testCases: [
      sample('4\n1 2 2 1\n2\n2 2', '2'),
      sample('3\n4 9 5\n5\n9 4 9 8 4', '4 9'),
      hidden('3\n1 2 3\n3\n4 5 6', ''),
      hidden('1\n1\n1\n1', '1'),
      hidden('4\n1 1 1 1\n2\n1 1', '1'),
      hidden('5\n1 2 3 4 5\n5\n5 4 3 2 1', '1 2 3 4 5'),
    ],
  },

  {
    slug: 'intersection-of-two-arrays-ii',
    title: 'Intersection of Two Arrays II',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Given two arrays, return their intersection, where each element in the result appears as many times as it shows up in both arrays (the minimum of the two counts). Output the result sorted ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `m`\n- Line 4: `m` space-separated integers\n\n**Output**\nThe intersection with repeats, ascending, space-separated (empty line if none).',
    descriptionHi:
      'Do arrays diye hain. Unka intersection return karo jahan har element result mein utni hi baar aaye jitni baar wo dono arrays mein (minimum count) aata hai. Result ascending sorted print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `m`\n- Line 4: `m` space-separated integers\n\n**Output**\nIntersection with repeats, ascending, space se separate (khaali agar koi nahi).',
    examples: [
      { input: '4\n1 2 2 1\n2\n2 2', output: '2 2' },
      { input: '3\n4 9 5\n5\n9 4 9 8 4', output: '4 9' },
    ],
    constraints: ['1 <= n, m <= 1000', '0 <= nums[i] <= 1000'],
    hints: [
      'Unlike the "unique values" version, repeats matter here — a set alone loses that information.',
      'Count the frequency of each value in the smaller array.',
      'Walk the other array, and for each value with a remaining positive count, emit it once and decrement the count.',
    ],
    approach:
      'Build a frequency map of one array. Walk the other array; whenever a value has a positive remaining count in the map, include it in the output and decrement its count (preventing over-counting past the smaller frequency).',
    approachHi:
      'Ek array ka frequency map banao. Doosre array ko walk karo; jab bhi kisi value ka map mein positive count bacha ho, use output mein daalo aur uska count ghatao (isse chhoti frequency se zyada count nahi hoga).',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      'A plain set loses multiplicity information, which is exactly what this version needs — so a frequency map is used instead, and decrementing the count on every match (rather than just checking presence) is what correctly caps each value\'s contribution at the smaller of its two counts, one match at a time.',
    solutionExplanationHi:
      'Plain set multiplicity ki information kho deta hai, jo ki is version mein exactly chahiye — isliye set ki jagah frequency map use hota hai, aur har match par count ghataana (sirf presence check karne ke bajaye) hi har value ka contribution uske do counts mein se chhote tak sahi tarah limit karta hai, ek-ek match karke.',
    starter: starter(
      `const a = nums(1);
const b = nums(3);

function intersect(a, b) {
  // return the intersection with repeats
  return [];
}

console.log(intersect(a, b).sort((x, y) => x - y).join(' '));`,
      `a = nums(1)
b = nums(3)

def intersect(a, b):
    # return the intersection with repeats
    return []

print(" ".join(map(str, sorted(intersect(a, b)))))`,
    ),
    solution: solution(
      `const a = nums(1);
const b = nums(3);
const count = new Map();
for (const x of a) count.set(x, (count.get(x) ?? 0) + 1);
const out = [];
for (const x of b) {
  const c = count.get(x) ?? 0;
  if (c > 0) { out.push(x); count.set(x, c - 1); }
}
console.log(out.sort((x, y) => x - y).join(' '));`,
      `a = nums(1)
b = nums(3)
from collections import Counter
count = Counter(a)
out = []
for x in b:
    if count[x] > 0:
        out.append(x)
        count[x] -= 1
print(" ".join(map(str, sorted(out))))`,
    ),
    testCases: [
      sample('4\n1 2 2 1\n2\n2 2', '2 2'),
      sample('3\n4 9 5\n5\n9 4 9 8 4', '4 9'),
      hidden('3\n1 2 3\n3\n4 5 6', ''),
      hidden('4\n1 1 1 1\n2\n1 1', '1 1'),
      hidden('2\n1 2\n2\n1 1', '1'),
      hidden('5\n1 2 3 4 5\n5\n5 4 3 2 1', '1 2 3 4 5'),
    ],
  },

  {
    slug: 'happy-number',
    title: 'Happy Number',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'A number is happy if repeatedly replacing it with the sum of the squares of its digits eventually reaches 1. If it enters a cycle that never reaches 1, it is not happy. Determine whether `n` is happy.\n\n**Input**\nOne line containing `n`.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek number happy hai agar use baar-baar uske digits ke squares ke sum se replace karte-karte aakhir mein 1 mil jaaye. Agar wo ek cycle mein phas jaaye jo kabhi 1 tak nahi pahunchti, to wo happy nahi hai. Check karo ki `n` happy hai ya nahi.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '19', output: 'true', explanation: '19 -> 82 -> 68 -> 100 -> 1.' },
      { input: '2', output: 'false' },
    ],
    constraints: ['1 <= n <= 2^31 - 1'],
    hints: [
      'Repeating the digit-square-sum process forever without hitting 1 must eventually repeat a value — there are only finitely many possible sums.',
      'Track every value seen so far in a hash set.',
      'If the current value is ever seen a second time (and is not 1), a cycle has been detected — the number is not happy.',
    ],
    approach:
      'Repeatedly compute the sum of squares of the digits, recording every intermediate value in a hash set. Stop and return true if the value becomes 1; stop and return false if a value repeats (a cycle was detected).',
    approachHi:
      'Baar-baar digits ke squares ka sum nikalo, har intermediate value ko ek hash set mein record karo. Agar value 1 ban jaaye to `true` return karo; agar koi value dobara aa jaaye (cycle detect hui) to `false` return karo.',
    timeComplexity: 'O(log n) per iteration, bounded number of iterations before a repeat',
    spaceComplexity: 'O(log n) for the visited set',
    solutionExplanation:
      'Since digit-square-sums of any number below a certain bound (roughly 243 for any 3-digit input, and shrinking further from there) form a finite space, the sequence of values must eventually either hit 1 or start repeating — there is no way to wander forever without revisiting a value. A hash set of everything seen so far is exactly what is needed to detect that repeat, which is the only other possible outcome besides reaching 1.',
    solutionExplanationHi:
      'Kisi bhi number ke digit-square-sums ek certain bound (lagbhag kisi bhi 3-digit input ke liye 243, aur usse aage aur chhota) ke andar ek finite space banate hain, isliye values ki sequence ya to 1 tak pahunchegi ya repeat karna shuru kar degi — bina kisi value ko dobara dekhe hamesha ke liye bhatakna possible nahi hai. Ab tak dekhi gayi sab values ka ek hash set hi ye repeat detect karne ke liye kaafi hai — 1 tak pahunchne ke alawa yahi doosra possible outcome hai.',
    starter: starter(
      `const n = num(0);

function isHappy(n) {
  // your code here
}

console.log(isHappy(n));`,
      `n = num(0)

def is_happy(n):
    # your code here
    pass

print("true" if is_happy(n) else "false")`,
    ),
    solution: solution(
      `let n = num(0);
const seen = new Set();
while (n !== 1 && !seen.has(n)) {
  seen.add(n);
  n = String(n).split('').reduce((s, d) => s + Number(d) * Number(d), 0);
}
console.log(n === 1);`,
      `n = num(0)
seen = set()
while n != 1 and n not in seen:
    seen.add(n)
    n = sum(int(d) ** 2 for d in str(n))
print("true" if n == 1 else "false")`,
    ),
    testCases: [
      sample('19', 'true'),
      sample('2', 'false'),
      hidden('1', 'true'),
      hidden('7', 'true'),
      hidden('4', 'false'),
      hidden('100', 'true'),
    ],
  },

  {
    slug: 'four-sum-ii',
    title: '4Sum II',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Given four integer arrays `A`, `B`, `C`, `D`, all of length `n`, count the number of tuples `(i, j, k, l)` such that `A[i] + B[j] + C[k] + D[l] == 0`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `A` (`n` space-separated integers)\n- Line 3: `B`\n- Line 4: `C`\n- Line 5: `D`\n\n**Output**\nThe count of zero-sum tuples.',
    descriptionHi:
      'Char integer arrays `A`, `B`, `C`, `D` diye hain, sabki length `n` hai. Aise tuples `(i, j, k, l)` count karo jahan `A[i] + B[j] + C[k] + D[l] == 0` ho.\n\n**Input**\n- Line 1: `n`\n- Line 2: `A` (`n` space-separated integers)\n- Line 3: `B`\n- Line 4: `C`\n- Line 5: `D`\n\n**Output**\nZero-sum tuples ka count.',
    examples: [
      { input: '2\n1 2\n-2 -1\n-1 2\n0 2', output: '2' },
    ],
    constraints: ['1 <= n <= 200', '-2^28 <= values <= 2^28'],
    hints: [
      'Trying all n^4 combinations is far too slow.',
      'Split the problem in half: precompute every possible A[i]+B[j] sum and how often it occurs.',
      'For each C[k]+D[l], the number of valid tuples it contributes is the count of `-(C[k]+D[l])` among the precomputed A+B sums.',
    ],
      approach:
      'Meet in the middle. Precompute a hash map of every `A[i] + B[j]` sum to how many pairs produce it. Then for every `C[k] + D[l]` pair, add the count of `-(C[k]+D[l])` found in that map to the answer.',
    approachHi:
      'Meet in the middle. Har `A[i] + B[j]` sum ka hash map banao ki wo kitni pairs se aata hai. Phir har `C[k] + D[l]` pair ke liye, map mein `-(C[k]+D[l])` ka count answer mein jod do.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n^2)',
    solutionExplanation:
      'Splitting four arrays into two pairs turns an O(n^4) brute force into two O(n^2) stages: first, enumerate all n^2 sums of A and B and bucket them by value in a hash map; then, for each of the n^2 sums of C and D, the number of tuples it completes to zero is exactly the number of A+B sums equal to its negation — a lookup, not a search.',
    solutionExplanationHi:
      'Char arrays ko do pairs mein todne se O(n^4) brute force, do O(n^2) stages mein badal jaata hai: pehle, A aur B ke saare n^2 sums nikaal kar unhe hash map mein value ke hisaab se bucket karo; phir, C aur D ke har n^2 sum ke liye, jitne tuples wo zero tak complete karta hai wo exactly utna hai jitne A+B sums uske negation ke barabar hain — ye ek lookup hai, search nahi.',
    starter: starter(
      `const A = nums(1), B = nums(2), C = nums(3), D = nums(4);

function fourSumCount(A, B, C, D) {
  // your code here
}

console.log(fourSumCount(A, B, C, D));`,
      `A, B, C, D = nums(1), nums(2), nums(3), nums(4)

def four_sum_count(A, B, C, D):
    # your code here
    pass

print(four_sum_count(A, B, C, D))`,
    ),
    solution: solution(
      `const A = nums(1), B = nums(2), C = nums(3), D = nums(4);
const sumsAB = new Map();
for (const a of A) for (const b of B) sumsAB.set(a + b, (sumsAB.get(a + b) ?? 0) + 1);
let total = 0;
for (const c of C) for (const d of D) total += sumsAB.get(-(c + d)) ?? 0;
console.log(total);`,
      `A, B, C, D = nums(1), nums(2), nums(3), nums(4)
from collections import defaultdict
sums_ab = defaultdict(int)
for a in A:
    for b in B:
        sums_ab[a + b] += 1
total = 0
for c in C:
    for d in D:
        total += sums_ab.get(-(c + d), 0)
print(total)`,
    ),
    testCases: [
      sample('2\n1 2\n-2 -1\n-1 2\n0 2', '2'),
      hidden('1\n0\n0\n0\n0', '1'),
      hidden('2\n0 0\n0 0\n0 0\n0 0', '16'),
      hidden('2\n1 1\n1 1\n1 1\n1 1', '0'),
      hidden('3\n1 2 3\n-1 -2 -3\n0 0 0\n0 0 0', '27'),
    ],
  },

  {
    slug: 'continuous-subarray-sum',
    title: 'Continuous Subarray Sum',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Determine whether the array contains a contiguous subarray of length at least 2 whose sum is a multiple of `k` (0 counts as a multiple of any `k`).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki array mein length 2 ya usse zyada ka koi contiguous subarray hai jiska sum `k` ka multiple ho (0 kisi bhi `k` ka multiple maana jaata hai).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '5\n23 2 4 6 7\n6', output: 'true', explanation: '[2,4] sums to 6, a multiple of 6.' },
      { input: '5\n23 2 6 4 7\n13', output: 'false' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= nums[i] <= 10^9', '0 <= k <= 2^31 - 1'],
    hints: [
      'Two prefix sums with the same remainder mod k mean the subarray between them sums to a multiple of k.',
      'Store the *first* index at which each remainder is seen — reusing an old index maximizes the subarray length, but only the length-2-or-more condition actually needs checking.',
      'Watch the edge case `k == 0`: then "multiple of k" only makes sense for a sum that is exactly 0.',
    ],
    approach:
      'Track running prefix sums modulo `k` (skip the modulo if `k` is 0) in a hash map from remainder to the earliest index it was seen at, seeded with `{0: -1}`. If the current remainder has been seen before at an index at least 2 positions back, a valid subarray exists.',
    approachHi:
      '`k` modulo running prefix sums track karo (agar `k` 0 hai to modulo skip karo) — ek hash map mein remainder se uske sabse pehle dekhe gaye index tak, `{0: -1}` se seed karke. Agar current remainder pehle bhi dekha ja chuka hai aur kam se kam 2 positions pehle, to valid subarray exist karta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, k))',
    solutionExplanation:
      'If two prefix sums share the same remainder mod k, their difference — the subarray between them — is exactly divisible by k, which is the multiple-of-k condition in disguise. Storing only the *first* occurrence of each remainder (never overwriting) maximizes the gap to any later matching remainder, which is what makes the length-at-least-2 check reliable; seeding with remainder 0 at index -1 correctly captures subarrays starting from index 0.',
    solutionExplanationHi:
      'Agar do prefix sums ka mod k remainder same hai, to unka difference — beech ka subarray — exactly k se divisible hota hai, jo asal mein "k ka multiple" wali condition hi hai. Har remainder ki sirf *pehli* occurrence store karna (kabhi overwrite na karna) baad ke kisi bhi matching remainder tak gap ko maximize karta hai, jisse length-kam-se-kam-2 wala check reliable ban jaata hai; remainder 0 ko index -1 par seed karna index 0 se shuru hone wale subarrays ko sahi tarah pakadta hai.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function checkSubarraySum(arr, k) {
  // your code here
}

console.log(checkSubarraySum(arr, k));`,
      `arr, k = nums(1), num(2)

def check_subarray_sum(arr, k):
    # your code here
    pass

print("true" if check_subarray_sum(arr, k) else "false")`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
const firstIndex = new Map([[0, -1]]);
let sum = 0, ok = false;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
  const rem = k === 0 ? sum : sum % k;
  if (firstIndex.has(rem)) { if (i - firstIndex.get(rem) >= 2) { ok = true; break; } }
  else firstIndex.set(rem, i);
}
console.log(ok);`,
      `arr, k = nums(1), num(2)
first_index = {0: -1}
s = 0
ok = False
for i, x in enumerate(arr):
    s += x
    rem = s if k == 0 else s % k
    if rem in first_index:
        if i - first_index[rem] >= 2:
            ok = True
            break
    else:
        first_index[rem] = i
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('5\n23 2 4 6 7\n6', 'true'),
      sample('5\n23 2 6 4 7\n13', 'false'),
      hidden('2\n0 0\n1', 'true'),
      hidden('2\n1 1\n0', 'false'),
      hidden('2\n0 0\n0', 'true'),
      hidden('1\n5\n5', 'false'),
    ],
  },

  {
    slug: 'subarray-sums-divisible-by-k',
    title: 'Subarray Sums Divisible by K',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Count the number of contiguous subarrays whose sum is divisible by `k`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe count of subarrays.',
    descriptionHi:
      'Kitne contiguous subarrays ka sum `k` se divisible hai, count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nSubarrays ka count.',
    examples: [
      { input: '6\n4 5 0 -2 -3 1\n5', output: '7' },
    ],
    constraints: ['1 <= n <= 3*10^4', '-10^4 <= nums[i] <= 10^4', '2 <= k <= 10^4'],
    hints: [
      'This is the same prefix-sum family as Subarray Sum Equals K, but grouping by remainder instead of exact value.',
      'Two prefix sums with the same remainder mod k mean the subarray between them is divisible by k.',
      'Negative remainders in some languages need normalizing into [0, k-1] before using them as map keys.',
    ],
    approach:
      'Track a running prefix sum modulo `k`, normalized into `[0, k-1]`, and a hash map counting how many times each remainder has occurred (seeded with `{0: 1}`). For every remainder, add its current count to the answer before incrementing it.',
    approachHi:
      'Running prefix sum ko `k` se modulo karke `[0, k-1]` mein normalize karo, aur ek hash map rakho jo har remainder ka count rakhe (`{0: 1}` se seed karo). Har remainder ke liye, uska current count answer mein jod do, phir count badhao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'This is exactly Subarray Sum Equals K\'s logic, but "equal prefix sums" is replaced by "equal prefix sums modulo k" — two prefixes with the same remainder differ by a multiple of k. Counting by remainder rather than exact value is what turns the exact-sum question into the divisibility question, with the same seeded-map, running-total pattern otherwise unchanged; only a language-specific care is needed to keep the modulo result non-negative for use as a map key.',
    solutionExplanationHi:
      'Ye bilkul Subarray Sum Equals K wali hi logic hai, bas "equal prefix sums" ki jagah "equal prefix sums modulo k" hai — same remainder wale do prefixes ka difference k ka multiple hota hai. Exact value ke bajaye remainder se count karna hi exact-sum wale sawaal ko divisibility wale sawaal mein badal deta hai — baaki seeded-map, running-total pattern wahi rehta hai; bas modulo ka result map key ke liye non-negative rakhne ka dhyan rakhna padta hai.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function subarraysDivByK(arr, k) {
  // your code here
}

console.log(subarraysDivByK(arr, k));`,
      `arr, k = nums(1), num(2)

def subarrays_div_by_k(arr, k):
    # your code here
    pass

print(subarrays_div_by_k(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
const count = new Map([[0, 1]]);
let sum = 0, total = 0;
for (const x of arr) {
  sum += x;
  const rem = ((sum % k) + k) % k;
  total += count.get(rem) ?? 0;
  count.set(rem, (count.get(rem) ?? 0) + 1);
}
console.log(total);`,
      `arr, k = nums(1), num(2)
count = {0: 1}
s = total = 0
for x in arr:
    s += x
    rem = s % k
    total += count.get(rem, 0)
    count[rem] = count.get(rem, 0) + 1
print(total)`,
    ),
    testCases: [
      sample('6\n4 5 0 -2 -3 1\n5', '7'),
      hidden('1\n5\n9', '0'),
      hidden('3\n5 0 0\n5', '6'),
      hidden('4\n-1 2 9\n2', '2'),
      hidden('5\n1 2 3 4 5\n3', '7'),
    ],
  },

  {
    slug: 'jewels-and-stones',
    title: 'Jewels and Stones',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Given a string of jewel types and a string of stones you have, count how many of your stones are jewels. Letters are case-sensitive.\n\n**Input**\n- Line 1: `jewels`\n- Line 2: `stones`\n\n**Output**\nThe count of stones that are jewels.',
    descriptionHi:
      'Jewel types wali ek string aur stones wali ek string di hai. Batao kitne stones jewels hain. Letters case-sensitive hain.\n\n**Input**\n- Line 1: `jewels`\n- Line 2: `stones`\n\n**Output**\nKitne stones jewels hain, uska count.',
    examples: [
      { input: 'aA\naAAbbbb', output: '3' },
      { input: 'z\nZZ', output: '0' },
    ],
    constraints: ['1 <= jewels length <= 50', '1 <= stones length <= 5*10^4', 'All characters are letters'],
    hints: [
      'The jewel-type characters are all distinct — a set gives O(1) membership testing.',
      'Put every jewel character into a set, then count how many stone characters are in that set.',
    ],
    approach:
      'Put the characters of `jewels` into a hash set. Walk `stones` and count how many characters are present in that set.',
    approachHi:
      '`jewels` ke characters ko ek hash set mein daalo. `stones` ko walk karo aur count karo kitne characters us set mein hain.',
    timeComplexity: 'O(j + s)',
    spaceComplexity: 'O(j)',
    solutionExplanation:
      'With jewel types held in a set, checking whether any given stone is a jewel becomes an O(1) membership test instead of an O(j) linear scan through the jewel string for every single stone — turning what could be an O(j*s) nested check into a straightforward O(j+s) pass.',
    solutionExplanationHi:
      'Jewel types ko set mein rakhne se, kisi bhi stone ka jewel hona check karna O(1) membership test ban jaata hai, na ki har stone ke liye jewel string mein O(j) linear scan — jo O(j*s) nested check ban sakta tha, use ek seedhe O(j+s) pass mein badal deta hai.',
    starter: starter(
      `const jewels = line(0), stones = line(1);

function numJewelsInStones(jewels, stones) {
  // your code here
}

console.log(numJewelsInStones(jewels, stones));`,
      `jewels, stones = line(0), line(1)

def num_jewels_in_stones(jewels, stones):
    # your code here
    pass

print(num_jewels_in_stones(jewels, stones))`,
    ),
    solution: solution(
      `const jewels = line(0), stones = line(1);
const set = new Set(jewels);
let count = 0;
for (const c of stones) if (set.has(c)) count++;
console.log(count);`,
      `jewels, stones = line(0), line(1)
jset = set(jewels)
print(sum(1 for c in stones if c in jset))`,
    ),
    testCases: [
      sample('aA\naAAbbbb', '3'),
      sample('z\nZZ', '0'),
      hidden('abc\nabcabc', '6'),
      hidden('a\naaaa', '4'),
      hidden('xyz\nabc', '0'),
      hidden('AB\nAABBB', '5'),
    ],
  },

  {
    slug: 'sort-characters-by-frequency',
    title: 'Sort Characters By Frequency',
    category: 'HashMap',
    difficulty: 'MEDIUM',
    description:
      'Sort the characters of a string by decreasing frequency. Characters with equal frequency are ordered alphabetically among themselves.\n\n**Input**\nOne line containing lowercase letters.\n\n**Output**\nThe rearranged string.',
    descriptionHi:
      'String ke characters ko decreasing frequency ke hisaab se sort karo. Equal frequency wale characters aapas mein alphabetically order hon.\n\n**Input**\nEk line jisme lowercase letters hain.\n\n**Output**\nRearranged string.',
    examples: [
      { input: 'tree', output: 'eert' },
      { input: 'cccaaa', output: 'aaaccc' },
    ],
    constraints: ['1 <= length <= 5*10^4', 'Lowercase English letters'],
    hints: [
      'Count the frequency of each character first.',
      'Sort the distinct characters by (frequency descending, character ascending) for a deterministic tie-break.',
      'Repeat each character according to its count to build the final string.',
    ],
    approach:
      'Count character frequencies with a hash map. Sort the distinct characters by frequency descending, breaking ties alphabetically, then build the output by repeating each character its counted number of times.',
    approachHi:
      'Hash map se character frequencies count karo. Distinct characters ko frequency descending se sort karo, tie hone par alphabetically. Phir har character ko uske count jitni baar repeat karke output banao.',
    timeComplexity: 'O(n + d log d) where d is the number of distinct characters',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Once frequencies are counted, the problem is really just a sort over a small set of (character, count) pairs — at most 26 for lowercase letters — rather than over the whole string, which is why the sorting cost is O(d log d) on distinct characters, not O(n log n) on the full input. The explicit alphabetical tie-break is what makes ties between equally frequent characters reproducible for a grader.',
    solutionExplanationHi:
      'Frequencies count hone ke baad, ye problem asal mein sirf ek chhote se (character, count) pairs ke set — lowercase ke liye zyada se zyada 26 — par sort hai, poori string par nahi, isliye sorting cost O(d log d) hai (distinct characters par), O(n log n) nahi (poore input par). Explicit alphabetical tie-break hi equally frequent characters ke beech tie ko grader ke liye reproducible banata hai.',
    starter: starter(
      `const s = line(0);

function frequencySort(s) {
  // your code here
}

console.log(frequencySort(s));`,
      `s = line(0)

def frequency_sort(s):
    # your code here
    pass

print(frequency_sort(s))`,
    ),
    solution: solution(
      `const s = line(0);
const count = new Map();
for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);
const chars = [...count.keys()].sort((a, b) => count.get(b) - count.get(a) || (a < b ? -1 : 1));
console.log(chars.map((c) => c.repeat(count.get(c))).join(''));`,
      `s = line(0)
from collections import Counter
count = Counter(s)
chars = sorted(count.keys(), key=lambda c: (-count[c], c))
print("".join(c * count[c] for c in chars))`,
    ),
    testCases: [
      sample('tree', 'eert'),
      sample('cccaaa', 'aaaccc'),
      hidden('a', 'a'),
      hidden('aabbcc', 'aabbcc'),
      hidden('bbbaaaccd', 'aaabbbccd'),
      hidden('xyz', 'xyz'),
    ],
  },

  {
    slug: 'number-of-good-pairs',
    title: 'Number of Good Pairs',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'A pair `(i, j)` is good if `nums[i] == nums[j]` and `i < j`. Count the number of good pairs.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe count of good pairs.',
    descriptionHi:
      'Ek pair `(i, j)` good hai agar `nums[i] == nums[j]` ho aur `i < j` ho. Good pairs ka count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nGood pairs ka count.',
    examples: [
      { input: '6\n1 2 3 1 1 3', output: '4' },
      { input: '4\n1 1 1 1', output: '6' },
    ],
    constraints: ['1 <= n <= 100', '1 <= nums[i] <= 100'],
    hints: [
      'A group of `c` identical values contributes `c*(c-1)/2` good pairs among themselves.',
      'Count the frequency of each value; the sum of the combination formula over all values is the answer.',
      'Alternatively, scan left to right: when you see a value that has appeared `c` times before, it forms `c` new good pairs.',
    ],
    approach:
      'Count the frequency of each value. For each distinct value with count `c`, it contributes `c*(c-1)/2` good pairs (every unordered pair among its occurrences); sum this over all values.',
    approachHi:
      'Har value ki frequency count karo. Jis value ka count `c` hai, wo `c*(c-1)/2` good pairs contribute karti hai (uski occurrences ke beech har unordered pair); sabko sum kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Every good pair is fully determined by choosing 2 (unordered) occurrences of the same value, so for a value appearing c times, the number of good pairs it contributes is exactly "c choose 2" = c*(c-1)/2 — a direct application of counting combinations, applied independently per distinct value and then summed, since pairs of different values can never be good.',
    solutionExplanationHi:
      'Har good pair, ek hi value ki 2 (unordered) occurrences choose karne se hi poora tay hota hai, isliye ek value jo c baar aati hai, wo exactly "c choose 2" = c*(c-1)/2 good pairs contribute karti hai — combinations counting ka seedha application, har distinct value ke liye alag se aur phir sabko jod kar, kyunki alag values ke pairs kabhi good nahi ho sakte.',
    starter: starter(
      `const arr = nums(1);

function numIdenticalPairs(arr) {
  // your code here
}

console.log(numIdenticalPairs(arr));`,
      `arr = nums(1)

def num_identical_pairs(arr):
    # your code here
    pass

print(num_identical_pairs(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
const count = new Map();
for (const x of arr) count.set(x, (count.get(x) ?? 0) + 1);
let total = 0;
for (const c of count.values()) total += (c * (c - 1)) / 2;
console.log(total);`,
      `arr = nums(1)
from collections import Counter
count = Counter(arr)
print(sum(c * (c - 1) // 2 for c in count.values()))`,
    ),
    testCases: [
      sample('6\n1 2 3 1 1 3', '4'),
      sample('4\n1 1 1 1', '6'),
      hidden('1\n1', '0'),
      hidden('2\n1 2', '0'),
      hidden('5\n1 1 1 2 2', '4'),
      hidden('3\n1 2 3', '0'),
    ],
  },

  {
    slug: 'unique-number-of-occurrences',
    title: 'Unique Number of Occurrences',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Determine whether the number of occurrences of every distinct value in the array is unique (no two distinct values share the same frequency).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki array mein har distinct value ki occurrences ka number unique hai (koi do distinct values same frequency share na karein).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '6\n1 2 2 1 1 3', output: 'true' },
      { input: '2\n1 2', output: 'false' },
    ],
    constraints: ['1 <= n <= 1000', '-1000 <= nums[i] <= 1000'],
    hints: [
      'First count the frequency of each distinct value.',
      'Then check whether any two of those frequency counts are equal.',
      'A set of the frequency values, compared by size to the number of distinct values, answers that directly.',
    ],
    approach:
      'Count the frequency of each distinct value with a hash map. Put all the resulting frequency counts into a set; if the set\'s size is smaller than the number of distinct values, two values shared a frequency.',
    approachHi:
      'Har distinct value ki frequency ek hash map se count karo. Saare resulting frequency counts ko ek set mein daalo; agar set ka size distinct values ki sankhya se chhota hai, to do values ne ek frequency share ki.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Checking "are all frequencies distinct" is itself a duplicate-detection problem one level removed from the original array — the same set-based trick used for Contains Duplicate applies directly to the list of frequency counts: if putting them all into a set shrinks the count, some two values had matching frequencies.',
    solutionExplanationHi:
      '"Kya saari frequencies distinct hain" khud ek duplicate-detection problem hai, bas original array se ek level door — Contains Duplicate wala hi set-based trick frequency counts ki list par seedha apply hota hai: agar unhe sabko set mein daalne se count chhota ho jaata hai, to kisi do values ki frequency match kar rahi thi.',
    starter: starter(
      `const arr = nums(1);

function uniqueOccurrences(arr) {
  // your code here
}

console.log(uniqueOccurrences(arr));`,
      `arr = nums(1)

def unique_occurrences(arr):
    # your code here
    pass

print("true" if unique_occurrences(arr) else "false")`,
    ),
    solution: solution(
      `const arr = nums(1);
const count = new Map();
for (const x of arr) count.set(x, (count.get(x) ?? 0) + 1);
const freqs = [...count.values()];
console.log(new Set(freqs).size === freqs.length);`,
      `arr = nums(1)
from collections import Counter
count = Counter(arr)
freqs = list(count.values())
print("true" if len(set(freqs)) == len(freqs) else "false")`,
    ),
    testCases: [
      sample('6\n1 2 2 1 1 3', 'true'),
      sample('2\n1 2', 'false'),
      hidden('1\n5', 'true'),
      hidden('10\n-3 0 1 -3 1 1 1 -3 10 0', 'true'),
      hidden('4\n1 1 2 2', 'false'),
      hidden('3\n1 1 1', 'true'),
    ],
  },

  {
    slug: 'count-pairs-with-given-sum',
    title: 'Count Pairs With Given Sum',
    category: 'HashMap',
    difficulty: 'EASY',
    description:
      'Given an array (which may contain duplicates) and a target, count the number of index pairs `(i, j)` with `i < j` such that `nums[i] + nums[j] == target`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nThe count of such pairs.',
    descriptionHi:
      'Ek array (jisme duplicates ho sakte hain) aur ek target diya hai. Aise index pairs `(i, j)` count karo jahan `i < j` ho aur `nums[i] + nums[j] == target` ho.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `target`\n\n**Output**\nAise pairs ka count.',
    examples: [
      { input: '4\n1 5 7 -1\n6', output: '2' },
      { input: '4\n1 1 1 1\n2', output: '6' },
    ],
    constraints: ['1 <= n <= 10^5', '-10^9 <= nums[i], target <= 10^9'],
    hints: [
      'This asks for the total count of pairs, not just whether one exists — a plain hash-set lookup used for Two Sum is not quite enough on its own.',
      'Scan left to right, maintaining a frequency map of values seen so far.',
      'When processing `nums[i]`, add the count of `target - nums[i]` already seen to the answer, then record `nums[i]` in the map.',
    ],
    approach:
      'Scan once, maintaining a frequency map of values seen so far. For each element, add to the answer the count of `target - nums[i]` already recorded (that counts every earlier index that pairs with this one), then increment the count for `nums[i]`.',
    approachHi:
      'Ek scan karo, ek frequency map rakho jo ab tak dekhi gayi values ka count rakhe. Har element ke liye, answer mein `target - nums[i]` ka ab tak record kiya gaya count jod do (ye har pehle index ko count karta hai jo isse pair banata hai), phir `nums[i]` ka count badhao.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Processing left to right and only ever counting complements *already seen* is what guarantees every pair is counted exactly once with i < j — a later index never gets to pair with a future one, since the map at the time index i is processed contains only indices strictly before it. This generalizes the classic Two Sum trick from "find one pair" to "count every pair", including repeated values, since the frequency map naturally accounts for multiplicities.',
    solutionExplanationHi:
      'Left se right process karna aur sirf *pehle se dekhe gaye* complements ko count karna hi guarantee karta hai ki har pair exactly ek baar, i < j ke saath count ho — kyunki index i process hote waqt map mein sirf usse strictly pehle wale indices hote hain, koi future index nahi. Ye classic Two Sum trick ko "ek pair dhoondo" se "har pair count karo" tak generalize karta hai, repeated values samet, kyunki frequency map multiplicities apne aap handle kar leta hai.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function countPairs(arr, target) {
  // your code here
}

console.log(countPairs(arr, target));`,
      `arr, target = nums(1), num(2)

def count_pairs(arr, target):
    # your code here
    pass

print(count_pairs(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
const count = new Map();
let total = 0;
for (const x of arr) {
  total += count.get(target - x) ?? 0;
  count.set(x, (count.get(x) ?? 0) + 1);
}
console.log(total);`,
      `arr, target = nums(1), num(2)
count = {}
total = 0
for x in arr:
    total += count.get(target - x, 0)
    count[x] = count.get(x, 0) + 1
print(total)`,
    ),
    testCases: [
      sample('4\n1 5 7 -1\n6', '2'),
      sample('4\n1 1 1 1\n2', '6'),
      hidden('1\n5\n10', '0'),
      hidden('3\n0 0 0\n0', '3'),
      hidden('5\n1 2 3 4 5\n9', '1'),
      hidden('2\n3 3\n6', '1'),
    ],
  },
];
