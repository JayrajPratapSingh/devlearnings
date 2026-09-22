import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Sliding Window — expansion batch. Rounds out the category beyond the
 * original two (Longest Substring Without Repeating Characters, Maximum Sum
 * Subarray of Size K) with the full variable-window toolkit: shrink-on-valid,
 * shrink-on-invalid, and the "at most" counting trick.
 */
export const dsaExtraSlidingWindow: SeedProblem[] = [
  {
    slug: 'minimum-size-subarray-sum',
    title: 'Minimum Size Subarray Sum',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Find the length of the shortest contiguous subarray whose sum is greater than or equal to `target`. Return 0 if no such subarray exists.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated positive integers\n- Line 3: `target`\n\n**Output**\nThe minimum length, or 0.',
    descriptionHi:
      'Us sabse chhote contiguous subarray ki length dhoondo jiska sum `target` se bada ya barabar ho. Agar aisa koi subarray na ho to 0 return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated positive integers\n- Line 3: `target`\n\n**Output**\nMinimum length, ya 0.',
    examples: [
      { input: '6\n2 3 1 2 4 3\n7', output: '2', explanation: '[4, 3] sums to 7.' },
      { input: '3\n1 4 4\n4', output: '1' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= nums[i] <= 10^4', '1 <= target <= 10^9'],
    hints: [
      'All values are positive — growing the window only ever increases the sum, and shrinking only ever decreases it.',
      'Grow the right edge until the window sum is at least the target.',
      'Once valid, shrink the left edge as much as possible while it stays valid, updating the best length each time.',
    ],
    approach:
      'Variable-size sliding window. Extend the right edge, adding to a running sum. Whenever the sum is `>= target`, shrink the left edge as far as possible while the sum stays `>= target`, updating the minimum window length at each valid shrink.',
    approachHi:
      'Variable-size sliding window. Right edge ko badhao, running sum mein jodte jao. Jab bhi sum `>= target` ho jaaye, left edge ko jitna ho sake shrink karo jab tak sum `>= target` rehta hai, har valid shrink par minimum window length update karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Because every value is strictly positive, the window sum is monotonic in both directions: growing the window (moving right) never decreases it, and shrinking it (moving left) never increases it. That monotonicity is exactly what makes a sliding window valid here — the left pointer never needs to backtrack, so the total movement of both pointers combined is bounded by O(n).',
    solutionExplanationHi:
      'Har value strictly positive hone ki wajah se, window sum dono directions mein monotonic hota hai: window badhana (right move) use kabhi kam nahi karta, aur shrink karna (left move) use kabhi badhata nahi. Yahi monotonicity hai jo yahan sliding window ko valid banati hai — left pointer ko kabhi backtrack karne ki zaroorat nahi, isliye dono pointers ka total movement O(n) tak bounded hai.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function minSubArrayLen(arr, target) {
  // your code here
}

console.log(minSubArrayLen(arr, target));`,
      `arr, target = nums(1), num(2)

def min_sub_array_len(arr, target):
    # your code here
    pass

print(min_sub_array_len(arr, target))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
let left = 0, sum = 0, best = Infinity;
for (let right = 0; right < arr.length; right++) {
  sum += arr[right];
  while (sum >= target) {
    best = Math.min(best, right - left + 1);
    sum -= arr[left];
    left++;
  }
}
console.log(best === Infinity ? 0 : best);`,
      `arr, target = nums(1), num(2)
left = total = 0
best = float("inf")
for right, x in enumerate(arr):
    total += x
    while total >= target:
        best = min(best, right - left + 1)
        total -= arr[left]
        left += 1
print(0 if best == float("inf") else best)`,
    ),
    testCases: [
      sample('6\n2 3 1 2 4 3\n7', '2'),
      sample('3\n1 4 4\n4', '1'),
      hidden('8\n1 1 1 1 1 1 1 1\n11', '0'),
      hidden('1\n5\n5', '1'),
      hidden('1\n5\n6', '0'),
      hidden('5\n1 2 3 4 5\n15', '5'),
    ],
  },

  {
    slug: 'longest-substring-with-k-distinct',
    title: 'Longest Substring with At Most K Distinct Characters',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Find the length of the longest substring that contains at most `k` distinct characters.\n\n**Input**\n- Line 1: the string\n- Line 2: `k`\n\n**Output**\nThe length of the longest such substring.',
    descriptionHi:
      'Sabse lambe us substring ki length dhoondo jisme zyada se zyada `k` distinct characters hon.\n\n**Input**\n- Line 1: string\n- Line 2: `k`\n\n**Output**\nUs sabse lambe substring ki length.',
    examples: [
      { input: 'eceba\n2', output: '3', explanation: '"ece" has 2 distinct characters.' },
      { input: 'aa\n1', output: '2' },
    ],
    constraints: ['1 <= length <= 5*10^4', '0 <= k <= 50'],
    hints: [
      'Maintain a frequency map of characters currently in the window.',
      'Grow the right edge freely; when the number of distinct characters in the map exceeds k, shrink from the left.',
      'Remove a character from the map entirely once its count drops to 0, so the distinct-character count stays accurate.',
    ],
    approach:
      'Variable-size sliding window with a frequency map. Extend the right edge, adding to the map. Whenever the map has more than `k` distinct keys, shrink the left edge, decrementing (and removing when zero) until the distinct count is back to `k`. Track the widest valid window.',
    approachHi:
      'Frequency map ke saath variable-size sliding window. Right edge badhao, map mein jodte jao. Jab bhi map mein `k` se zyada distinct keys ho jaayein, left edge shrink karo, count ghatao (aur zero hone par hata do) jab tak distinct count `k` tak wapas na aa jaaye. Sabse wide valid window track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'The window is always allowed to grow, and only needs to shrink reactively once it becomes invalid (too many distinct characters) — this shrink-on-violation pattern is the standard variable-window template, and it stays O(n) because each character is added to the map exactly once and removed at most once across the whole scan.',
    solutionExplanationHi:
      'Window ko hamesha badhne diya jaata hai, aur sirf tabhi shrink hota hai jab wo invalid ho jaaye (bahut zyada distinct characters) — ye shrink-on-violation pattern standard variable-window template hai, aur ye O(n) rehta hai kyunki poore scan mein har character map mein exactly ek baar add hota hai aur zyada se zyada ek baar remove hota hai.',
    starter: starter(
      `const s = line(0), k = num(1);

function lengthOfLongestKDistinct(s, k) {
  // your code here
}

console.log(lengthOfLongestKDistinct(s, k));`,
      `s, k = line(0), num(1)

def length_of_longest_k_distinct(s, k):
    # your code here
    pass

print(length_of_longest_k_distinct(s, k))`,
    ),
    solution: solution(
      `const s = line(0), k = num(1);
const count = new Map();
let left = 0, best = 0;
for (let right = 0; right < s.length; right++) {
  count.set(s[right], (count.get(s[right]) ?? 0) + 1);
  while (count.size > k) {
    const c = s[left];
    count.set(c, count.get(c) - 1);
    if (count.get(c) === 0) count.delete(c);
    left++;
  }
  best = Math.max(best, right - left + 1);
}
console.log(k === 0 ? 0 : best);`,
      `s, k = line(0), num(1)
count = {}
left = best = 0
for right, c in enumerate(s):
    count[c] = count.get(c, 0) + 1
    while len(count) > k:
        lc = s[left]
        count[lc] -= 1
        if count[lc] == 0:
            del count[lc]
        left += 1
    best = max(best, right - left + 1)
print(0 if k == 0 else best)`,
    ),
    testCases: [
      sample('eceba\n2', '3'),
      sample('aa\n1', '2'),
      hidden('a\n0', '0'),
      hidden('abc\n3', '3'),
      hidden('abc\n1', '1'),
      hidden('aabbcc\n2', '4'),
    ],
  },

  {
    slug: 'permutation-in-string',
    title: 'Permutation in String',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Determine whether `s2` contains a contiguous substring that is a permutation of `s1`.\n\n**Input**\n- Line 1: `s1`\n- Line 2: `s2`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki `s2` mein koi contiguous substring hai jo `s1` ka permutation ho.\n\n**Input**\n- Line 1: `s1`\n- Line 2: `s2`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'ab\neidbaooo', output: 'true', explanation: '"ba" (a permutation of "ab") appears in s2.' },
      { input: 'ab\neidboaoo', output: 'false' },
    ],
    constraints: ['1 <= s1.length, s2.length <= 10^4', 'Lowercase English letters'],
    hints: [
      'A permutation of s1 has exactly the same character frequency as s1 — order does not matter.',
      'A fixed-size window of length `s1.length` sliding across s2 can be compared against s1\'s frequency count.',
      'Rather than recomparing the whole frequency map every slide, track how many character counts currently match — update it incrementally as the window slides.',
    ],
    approach:
      'Fixed-size sliding window of length `s1.length`. Maintain a frequency count for the window and compare it against s1\'s frequency count as the window slides one character at a time (adding the entering character, removing the leaving one), reporting true the moment the counts match exactly.',
    approachHi:
      '`s1.length` size ki fixed-size sliding window. Window ka frequency count rakho aur `s1` ke frequency count se compare karo jab window ek-ek character slide hoti hai (aane wala character jodo, jaane wala hatao); jaise hi counts exactly match karte hain, `true` report karo.',
    timeComplexity: 'O(n) for a fixed alphabet',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'A permutation check reduces entirely to a frequency-count equality check, since order is irrelevant — so this becomes exactly the fixed-size window from Maximum Sum Subarray of Size K, but comparing 26-slot frequency arrays instead of a running sum. Comparing full arrays on every slide would cost O(26) per step; tracking a single "how many positions currently match" counter instead makes each slide O(1).',
    solutionExplanationHi:
      'Permutation check poori tarah frequency-count equality check mein simat jaata hai, kyunki order irrelevant hai — isliye ye bilkul Maximum Sum Subarray of Size K wali fixed-size window ban jaata hai, bas running sum ke bajaye 26-slot frequency arrays compare hote hain. Har slide par poore arrays compare karna O(26) per step lagega; iske bajaye ek "abhi kitni positions match karti hain" counter track karna har slide ko O(1) bana deta hai.',
    starter: starter(
      `const s1 = line(0), s2 = line(1);

function checkInclusion(s1, s2) {
  // your code here
}

console.log(checkInclusion(s1, s2));`,
      `s1, s2 = line(0), line(1)

def check_inclusion(s1, s2):
    # your code here
    pass

print("true" if check_inclusion(s1, s2) else "false")`,
    ),
    solution: solution(
      `const s1 = line(0), s2 = line(1);
if (s1.length > s2.length) { console.log(false); }
else {
  const need = new Array(26).fill(0), window = new Array(26).fill(0);
  const A = 'a'.charCodeAt(0);
  for (const c of s1) need[c.charCodeAt(0) - A]++;
  let ok = false;
  for (let i = 0; i < s2.length; i++) {
    window[s2.charCodeAt(i) - A]++;
    if (i >= s1.length) window[s2.charCodeAt(i - s1.length) - A]--;
    if (i >= s1.length - 1 && need.every((v, idx) => v === window[idx])) { ok = true; break; }
  }
  console.log(ok);
}`,
      `s1, s2 = line(0), line(1)
if len(s1) > len(s2):
    print("false")
else:
    from collections import Counter
    need = Counter(s1)
    window = Counter()
    ok = False
    k = len(s1)
    for i, c in enumerate(s2):
        window[c] += 1
        if i >= k:
            left_c = s2[i - k]
            window[left_c] -= 1
            if window[left_c] == 0:
                del window[left_c]
        if i >= k - 1 and window == need:
            ok = True
            break
    print("true" if ok else "false")`,
    ),
    testCases: [
      sample('ab\neidbaooo', 'true'),
      sample('ab\neidboaoo', 'false'),
      hidden('a\na', 'true'),
      hidden('abc\nabc', 'true'),
      hidden('adc\ndcda', 'true'),
      hidden('hello\nooolleoooleh', 'false'),
    ],
  },

  {
    slug: 'find-all-anagrams-in-a-string',
    title: 'Find All Anagrams in a String',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Find all starting indices of substrings of `s` that are anagrams of `p`.\n\n**Input**\n- Line 1: `s`\n- Line 2: `p`\n\n**Output**\nThe 0-based starting indices, ascending, space-separated (empty line if none).',
    descriptionHi:
      '`s` ke un saare substrings ke starting indices dhoondo jo `p` ke anagram hain.\n\n**Input**\n- Line 1: `s`\n- Line 2: `p`\n\n**Output**\n0-based starting indices, ascending, space se separate (khaali agar koi nahi).',
    examples: [
      { input: 'cbaebabacd\nabc', output: '0 6' },
      { input: 'abab\nab', output: '0 1 2' },
    ],
    constraints: ['1 <= p.length <= s.length <= 3*10^4', 'Lowercase English letters'],
    hints: [
      'This is exactly Permutation in String, but instead of stopping at the first match, every match must be recorded.',
      'Slide a fixed-size window of length p.length across s, comparing frequency counts.',
      'Record the start index every time the window\'s frequency count matches p\'s.',
    ],
    approach:
      'Same fixed-size sliding window and frequency-count comparison as Permutation in String, except every position where the window\'s count matches `p`\'s count is recorded (not just the first).',
    approachHi:
      'Permutation in String jaisi hi fixed-size sliding window aur frequency-count comparison, bas har us position ko record karo jahan window ka count `p` ke count se match kare (sirf pehla nahi).',
    timeComplexity: 'O(n) for a fixed alphabet',
    spaceComplexity: 'O(n) for the output',
    solutionExplanation:
      'This reuses the Permutation in String machinery unchanged, except the early-exit on the first match is replaced with "record and keep going" — since anagram windows can overlap and repeat throughout the string, every one needs to be found, not just the first.',
    solutionExplanationHi:
      'Ye Permutation in String wali machinery bina badlaav ke reuse karta hai, bas pehle match par early-exit ki jagah "record karo aur aage badho" hota hai — kyunki anagram windows poori string mein overlap ho sakti hain aur repeat ho sakti hain, isliye har ek ko dhoondna hai, sirf pehla nahi.',
    starter: starter(
      `const s = line(0), p = line(1);

function findAnagrams(s, p) {
  // return an array of starting indices
  return [];
}

console.log(findAnagrams(s, p).join(' '));`,
      `s, p = line(0), line(1)

def find_anagrams(s, p):
    # return a list of starting indices
    return []

print(" ".join(map(str, find_anagrams(s, p))))`,
    ),
    solution: solution(
      `const s = line(0), p = line(1);
const out = [];
if (p.length <= s.length) {
  const need = new Array(26).fill(0), window = new Array(26).fill(0);
  const A = 'a'.charCodeAt(0);
  for (const c of p) need[c.charCodeAt(0) - A]++;
  for (let i = 0; i < s.length; i++) {
    window[s.charCodeAt(i) - A]++;
    if (i >= p.length) window[s.charCodeAt(i - p.length) - A]--;
    if (i >= p.length - 1 && need.every((v, idx) => v === window[idx])) out.push(i - p.length + 1);
  }
}
console.log(out.join(' '));`,
      `s, p = line(0), line(1)
out = []
if len(p) <= len(s):
    from collections import Counter
    need = Counter(p)
    window = Counter()
    k = len(p)
    for i, c in enumerate(s):
        window[c] += 1
        if i >= k:
            left_c = s[i - k]
            window[left_c] -= 1
            if window[left_c] == 0:
                del window[left_c]
        if i >= k - 1 and window == need:
            out.append(i - k + 1)
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('cbaebabacd\nabc', '0 6'),
      sample('abab\nab', '0 1 2'),
      hidden('a\na', '0'),
      hidden('abc\nd', ''),
      hidden('aaaaaaaaaa\naaa', '0 1 2 3 4 5 6 7'),
      hidden('baa\naa', '1'),
    ],
  },

  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    category: 'Sliding Window',
    difficulty: 'HARD',
    description:
      'Find the shortest substring of `s` that contains every character of `t` (including duplicates, at least as many times as they occur in `t`). Return `(empty)` if no such substring exists.\n\n**Input**\n- Line 1: `s`\n- Line 2: `t`\n\n**Output**\nThe minimum window substring, or `(empty)`.',
    descriptionHi:
      '`s` ka sabse chhota substring dhoondo jisme `t` ka har character ho (duplicates samet, kam se kam utni baar jitni baar `t` mein aata hai). Agar aisa koi substring na ho to `(empty)` return karo.\n\n**Input**\n- Line 1: `s`\n- Line 2: `t`\n\n**Output**\nMinimum window substring, ya `(empty)`.',
    examples: [
      { input: 'ADOBECODEBANC\nABC', output: 'BANC' },
      { input: 'a\naa', output: '(empty)' },
    ],
    constraints: ['1 <= s.length, t.length <= 10^5'],
    hints: [
      'Track how many characters of t are still needed, not just whether each is present.',
      'Grow the right edge until every needed character (with its full required count) is inside the window.',
      'Once valid, shrink the left edge as far as possible while it stays valid, recording the shortest valid window seen.',
    ],
    approach:
      'Variable-size sliding window with a "need" frequency map for `t` and a counter of how many distinct characters currently have their full required count satisfied. Grow the right edge until all requirements are satisfied, then shrink the left edge as far as possible while they remain satisfied, tracking the shortest such window.',
    approachHi:
      'Variable-size sliding window, `t` ke liye ek "need" frequency map aur ek counter jo batata hai ki abhi kitne distinct characters ki poori requirement satisfy ho chuki hai. Right edge ko tab tak badhao jab tak saari requirements satisfy na ho jaayein, phir left edge ko jitna ho sake shrink karo jab tak wo satisfied rehti hain, sabse chhoti aisi window track karte hue.',
    timeComplexity: 'O(|s| + |t|)',
    spaceComplexity: 'O(|t|)',
    solutionExplanation:
      'The subtlety beyond simpler window problems is that "contains every character of t" is a multiset condition, not a set condition — b appearing once is not enough if t needs it twice. Tracking a single "how many distinct characters are currently fully satisfied" counter (incremented only when a character\'s window count reaches exactly its required count, decremented only when it drops below) turns an O(26) or O(|t|) validity check into an O(1) one, which is what keeps the whole algorithm linear despite the nested-looking grow/shrink loops.',
    solutionExplanationHi:
      'Simpler window problems se aage ka subtlety ye hai ki "t ka har character contain karna" ek multiset condition hai, set condition nahi — agar t ko "b" do baar chahiye to ek baar aana kaafi nahi. Ek single "abhi kitne distinct characters poori tarah satisfied hain" counter track karna (sirf tab increment jab kisi character ka window count uski required count tak exactly pahunche, sirf tab decrement jab wo usse neeche gire) O(26) ya O(|t|) validity check ko O(1) bana deta hai — yahi cheez nested dikhne wale grow/shrink loops ke bawajood poore algorithm ko linear rakhti hai.',
    starter: starter(
      `const s = line(0), t = line(1);

function minWindow(s, t) {
  // return the minimum window substring, or "" if none
  return '';
}

const res = minWindow(s, t);
console.log(res === '' ? '(empty)' : res);`,
      `s, t = line(0), line(1)

def min_window(s, t):
    # return the minimum window substring, or "" if none
    return ""

res = min_window(s, t)
print(res if res else "(empty)")`,
    ),
    solution: solution(
      `const s = line(0), t = line(1);
const need = new Map();
for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
let required = need.size, formed = 0;
const window = new Map();
let left = 0, bestLen = Infinity, bestStart = 0;
for (let right = 0; right < s.length; right++) {
  const c = s[right];
  window.set(c, (window.get(c) ?? 0) + 1);
  if (need.has(c) && window.get(c) === need.get(c)) formed++;
  while (formed === required) {
    if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestStart = left; }
    const lc = s[left];
    window.set(lc, window.get(lc) - 1);
    if (need.has(lc) && window.get(lc) < need.get(lc)) formed--;
    left++;
  }
}
console.log(bestLen === Infinity ? '(empty)' : s.slice(bestStart, bestStart + bestLen));`,
      `s, t = line(0), line(1)
from collections import Counter
need = Counter(t)
required = len(need)
formed = 0
window = Counter()
left = 0
best_len = float("inf")
best_start = 0
for right, c in enumerate(s):
    window[c] += 1
    if c in need and window[c] == need[c]:
        formed += 1
    while formed == required:
        if right - left + 1 < best_len:
            best_len = right - left + 1
            best_start = left
        lc = s[left]
        window[lc] -= 1
        if lc in need and window[lc] < need[lc]:
            formed -= 1
        left += 1
print(s[best_start:best_start + best_len] if best_len != float("inf") else "(empty)")`,
    ),
    testCases: [
      sample('ADOBECODEBANC\nABC', 'BANC'),
      sample('a\naa', '(empty)'),
      hidden('a\na', 'a'),
      hidden('ab\nb', 'b'),
      hidden('aa\naa', 'aa'),
      hidden('bba\nab', 'ba'),
    ],
  },

  {
    slug: 'fruit-into-baskets',
    title: 'Fruit Into Baskets',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'You have two baskets, and each can hold only one type of fruit (unlimited quantity of that type). Given a row of fruit trees (each an integer type), find the maximum number of trees you can pick from a single contiguous run.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated fruit types\n\n**Output**\nThe maximum number of trees.',
    descriptionHi:
      'Aapke paas do baskets hain, aur har ek mein sirf ek type ka fruit rakh sakte ho (us type ki unlimited quantity). Fruit trees ki ek row di hai (har ek integer type). Kisi ek contiguous run se maximum kitne trees pick kar sakte ho, wo batao.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated fruit types\n\n**Output**\nMaximum trees.',
    examples: [
      { input: '3\n1 2 1', output: '3' },
      { input: '4\n0 1 2 2', output: '3' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= fruit type <= 10^9'],
    hints: [
      'This is exactly "Longest Substring with At Most K Distinct Characters" with k = 2.',
      'Maintain a frequency map of fruit types currently in the window.',
      'Shrink from the left whenever the window has more than 2 distinct fruit types.',
    ],
    approach:
      'Variable-size sliding window with a frequency map, identical to the at-most-k-distinct pattern with `k = 2`. Grow the right edge; whenever more than 2 distinct types are in the window, shrink from the left until only 2 remain. Track the widest valid window.',
    approachHi:
      'Frequency map ke saath variable-size sliding window, bilkul at-most-k-distinct pattern jaisa, bas `k = 2`. Right edge badhao; jab bhi window mein 2 se zyada distinct types ho jaayein, left se shrink karo jab tak sirf 2 na bach jaayein. Sabse wide valid window track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) — at most 3 distinct types are ever tracked at once',
    solutionExplanation:
      'Stripped of its fruit-picking story, this is a direct restatement of the at-most-k-distinct-characters template with the constant 2 substituted for k — recognizing that translation is the entire difficulty of the problem, since the sliding-window mechanics themselves do not change at all.',
    solutionExplanationHi:
      'Fruit-picking wali kahani hata do, to ye seedha at-most-k-distinct-characters template ka hi restatement hai, bas k ki jagah constant 2 daal diya gaya hai — yahi translation pehchaanna hi is problem ki poori difficulty hai, kyunki sliding-window mechanics khud bilkul nahi badalti.',
    starter: starter(
      `const fruits = nums(1);

function totalFruit(fruits) {
  // your code here
}

console.log(totalFruit(fruits));`,
      `fruits = nums(1)

def total_fruit(fruits):
    # your code here
    pass

print(total_fruit(fruits))`,
    ),
    solution: solution(
      `const fruits = nums(1);
const count = new Map();
let left = 0, best = 0;
for (let right = 0; right < fruits.length; right++) {
  count.set(fruits[right], (count.get(fruits[right]) ?? 0) + 1);
  while (count.size > 2) {
    const t = fruits[left];
    count.set(t, count.get(t) - 1);
    if (count.get(t) === 0) count.delete(t);
    left++;
  }
  best = Math.max(best, right - left + 1);
}
console.log(best);`,
      `fruits = nums(1)
count = {}
left = best = 0
for right, t in enumerate(fruits):
    count[t] = count.get(t, 0) + 1
    while len(count) > 2:
        lt = fruits[left]
        count[lt] -= 1
        if count[lt] == 0:
            del count[lt]
        left += 1
    best = max(best, right - left + 1)
print(best)`,
    ),
    testCases: [
      sample('3\n1 2 1', '3'),
      sample('4\n0 1 2 2', '3'),
      hidden('5\n1 2 3 2 2', '4'),
      hidden('1\n5', '1'),
      hidden('4\n1 1 1 1', '4'),
      hidden('6\n3 3 3 1 2 1', '4'),
    ],
  },

  {
    slug: 'longest-repeating-character-replacement',
    title: 'Longest Repeating Character Replacement',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'You may change at most `k` characters of the string to any other character. Find the length of the longest substring achievable where all characters are the same after such replacements.\n\n**Input**\n- Line 1: the string\n- Line 2: `k`\n\n**Output**\nThe length of the longest achievable substring.',
    descriptionHi:
      'String ke zyada se zyada `k` characters kisi bhi doosre character mein badal sakte ho. Aise replacements ke baad sabse lambe us substring ki length dhoondo jisme saare characters same ho jaayein.\n\n**Input**\n- Line 1: string\n- Line 2: `k`\n\n**Output**\nSabse lambe achievable substring ki length.',
    examples: [
      { input: 'ABAB\n2', output: '4' },
      { input: 'AABABBA\n1', output: '4' },
    ],
    constraints: ['1 <= length <= 10^5', '0 <= k <= length'],
    hints: [
      'A window of length L is achievable if (L - count of its most frequent character) <= k — that many replacements fix the rest.',
      'Track the count of the most frequent character seen in the current window as it slides.',
      'A window never needs to shrink below its previous best size — it can just shift, since the goal is only the maximum length, not every valid window.',
    ],
    approach:
      'Sliding window tracking a frequency map and the maximum single-character frequency seen so far, `maxFreq`. A window of length `right - left + 1` is valid exactly when `(right - left + 1) - maxFreq <= k`. When invalid, shrink from the left by one and continue — the window never shrinks below its best-so-far size, so it effectively just slides once it reaches maximum size.',
    approachHi:
      'Ek sliding window jo frequency map aur ab tak dekha gaya maximum single-character frequency `maxFreq` track karti hai. Length `right - left + 1` ki window valid hai jab `(right - left + 1) - maxFreq <= k` ho. Invalid hone par left se ek shrink karo aur aage badho — window kabhi apne best-so-far size se chhoti nahi hoti, isliye max size tak pahunchne ke baad wo bas slide karti hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'The key realization is that `maxFreq` never needs to be decremented even when the window shrinks: since the goal is only the maximum achievable length, once a window of a certain size has been seen as valid, the algorithm only needs to check whether an even *bigger* window can also be valid — so an occasionally stale (too-high) maxFreq only ever makes the validity check stricter, never incorrect, letting the window slide instead of properly shrink and keeping the whole scan O(n).',
    solutionExplanationHi:
      'Asli insight ye hai ki window shrink hone par bhi `maxFreq` ko kabhi decrement karne ki zaroorat nahi: chunki goal sirf maximum achievable length hai, ek baar jab ek certain size ki window valid dekhi ja chuki hai, algorithm ko sirf ye check karna hai ki koi *aur bhi badi* window valid ho sakti hai ya nahi — isliye kabhi-kabhi stale (bahut zyada) maxFreq validity check ko sirf strict banata hai, kabhi galat nahi, jisse window shrink hone ke bajaye bas slide karti hai aur poora scan O(n) rehta hai.',
    starter: starter(
      `const s = line(0), k = num(1);

function characterReplacement(s, k) {
  // your code here
}

console.log(characterReplacement(s, k));`,
      `s, k = line(0), num(1)

def character_replacement(s, k):
    # your code here
    pass

print(character_replacement(s, k))`,
    ),
    solution: solution(
      `const s = line(0), k = num(1);
const count = new Map();
let left = 0, maxFreq = 0, best = 0;
for (let right = 0; right < s.length; right++) {
  count.set(s[right], (count.get(s[right]) ?? 0) + 1);
  maxFreq = Math.max(maxFreq, count.get(s[right]));
  if (right - left + 1 - maxFreq > k) {
    count.set(s[left], count.get(s[left]) - 1);
    left++;
  }
  best = Math.max(best, right - left + 1);
}
console.log(best);`,
      `s, k = line(0), num(1)
count = {}
left = max_freq = best = 0
for right, c in enumerate(s):
    count[c] = count.get(c, 0) + 1
    max_freq = max(max_freq, count[c])
    if right - left + 1 - max_freq > k:
        count[s[left]] -= 1
        left += 1
    best = max(best, right - left + 1)
print(best)`,
    ),
    testCases: [
      sample('ABAB\n2', '4'),
      sample('AABABBA\n1', '4'),
      hidden('AAAA\n0', '4'),
      hidden('ABCDE\n1', '2'),
      hidden('A\n0', '1'),
      hidden('ABBB\n2', '4'),
    ],
  },

  {
    slug: 'max-consecutive-ones-iii',
    title: 'Max Consecutive Ones III',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Given a binary array, you may flip at most `k` zeros to ones. Find the length of the longest contiguous run of ones achievable.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated 0s and 1s\n- Line 3: `k`\n\n**Output**\nThe maximum achievable length.',
    descriptionHi:
      'Ek binary array diya hai. Zyada se zyada `k` zeros ko one mein flip kar sakte ho. Ones ka sabse lamba achievable contiguous run dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated 0s aur 1s\n- Line 3: `k`\n\n**Output**\nMaximum achievable length.',
    examples: [
      { input: '11\n1 1 1 0 0 0 1 1 1 1 0\n2', output: '6' },
      { input: '19\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3', output: '10' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= k <= n'],
    hints: [
      'This is the same shape as Longest Repeating Character Replacement, but with only two "characters": 0 and 1.',
      'A window is valid whenever the number of zeros inside it is at most k.',
      'Grow the right edge freely; shrink from the left only when the zero count exceeds k.',
    ],
    approach:
      'Sliding window counting zeros inside it. Grow the right edge, incrementing the zero count when a 0 enters. Whenever the zero count exceeds `k`, shrink from the left (decrementing the zero count when a 0 leaves). Track the widest valid window.',
    approachHi:
      'Andar ke zeros count karti hui sliding window. Right edge badhao, jab 0 andar aaye to zero count badhao. Jab bhi zero count `k` se zyada ho jaaye, left se shrink karo (0 nikalte waqt count ghatao). Sabse wide valid window track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'With only two possible values, "at most k replacements to make everything the same character" specializes to "at most k zeros allowed in the window" — a much simpler validity check than the general frequency-map version, but the exact same grow-then-shrink-on-violation sliding window shape underneath.',
    solutionExplanationHi:
      'Sirf do possible values hone se, "sab kuch same character banane ke liye zyada se zyada k replacements" simplify hokar "window mein zyada se zyada k zeros allowed" ban jaata hai — general frequency-map version se kaafi simple validity check, par neeche wahi grow-then-shrink-on-violation sliding window shape hai.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function longestOnes(arr, k) {
  // your code here
}

console.log(longestOnes(arr, k));`,
      `arr, k = nums(1), num(2)

def longest_ones(arr, k):
    # your code here
    pass

print(longest_ones(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
let left = 0, zeros = 0, best = 0;
for (let right = 0; right < arr.length; right++) {
  if (arr[right] === 0) zeros++;
  while (zeros > k) {
    if (arr[left] === 0) zeros--;
    left++;
  }
  best = Math.max(best, right - left + 1);
}
console.log(best);`,
      `arr, k = nums(1), num(2)
left = zeros = best = 0
for right, x in enumerate(arr):
    if x == 0:
        zeros += 1
    while zeros > k:
        if arr[left] == 0:
            zeros -= 1
        left += 1
    best = max(best, right - left + 1)
print(best)`,
    ),
    testCases: [
      sample('11\n1 1 1 0 0 0 1 1 1 1 0\n2', '6'),
      sample('19\n0 0 1 1 0 0 1 1 1 0 1 1 0 0 0 1 1 1 1\n3', '10'),
      hidden('4\n0 0 0 0\n0', '0'),
      hidden('4\n0 0 0 0\n4', '4'),
      hidden('3\n1 1 1\n0', '3'),
      hidden('5\n1 0 1 0 1\n1', '3'),
    ],
  },

  {
    slug: 'subarray-product-less-than-k',
    title: 'Subarray Product Less Than K',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Given an array of positive integers, count the number of contiguous subarrays whose product is strictly less than `k`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated positive integers\n- Line 3: `k`\n\n**Output**\nThe count of subarrays.',
    descriptionHi:
      'Positive integers ka ek array diya hai. Kitne contiguous subarrays ka product `k` se strictly kam hai, count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated positive integers\n- Line 3: `k`\n\n**Output**\nSubarrays ka count.',
    examples: [
      { input: '4\n10 5 2 6\n100', output: '8' },
      { input: '3\n1 2 3\n0', output: '0' },
    ],
    constraints: ['1 <= n <= 3*10^4', '1 <= nums[i] <= 1000', '0 <= k <= 10^6'],
    hints: [
      'If k <= 1, no product of positive integers can ever be strictly less than k — the answer is 0 immediately.',
      'Because all values are positive, growing the window only ever increases the product — shrink the left edge whenever the product is >= k.',
      'Every time the window is valid, it contributes exactly (window length) new subarrays — all those ending at the current right edge.',
    ],
    approach:
      'Sliding window tracking a running product. Grow the right edge, multiplying in. Whenever the product is `>= k`, shrink the left edge, dividing it back out. Every time the window is valid, add `right - left + 1` to the answer — that many new subarrays end at the current right edge.',
    approachHi:
      'Running product track karti hui sliding window. Right edge badhao, multiply karo. Jab bhi product `>= k` ho jaaye, left edge shrink karo, divide karke bahar nikalo. Jab bhi window valid ho, answer mein `right - left + 1` jodo — utne naye subarrays current right edge par khatam hote hain.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Because every value is a positive integer, the product only grows as the window widens, giving the same monotonicity that makes Minimum Size Subarray Sum work. The counting trick — adding the current window length every time it is valid — works because for a valid window `[left, right]`, every subarray `[i, right]` for `left <= i <= right` is also valid (a subset of a product below k is itself below k, since all factors are >= 1), so all of them can be counted at once instead of one at a time.',
    solutionExplanationHi:
      'Har value positive integer hone ki wajah se, product window chaudi hone par hi badhta hai — wahi monotonicity jo Minimum Size Subarray Sum ko chalati hai. Counting trick — har baar window valid hone par current window length jodna — isliye kaam karta hai kyunki ek valid window `[left, right]` ke liye, `left <= i <= right` wala har subarray `[i, right]` bhi valid hai (k se kam product ka subset khud bhi k se kam hi hoga, kyunki saare factors >= 1 hain) — isliye sabko ek saath count kiya ja sakta hai, ek-ek karke nahi.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function numSubarrayProductLessThanK(arr, k) {
  // your code here
}

console.log(numSubarrayProductLessThanK(arr, k));`,
      `arr, k = nums(1), num(2)

def num_subarray_product_less_than_k(arr, k):
    # your code here
    pass

print(num_subarray_product_less_than_k(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
if (k <= 1) { console.log(0); }
else {
  let left = 0, product = 1, total = 0;
  for (let right = 0; right < arr.length; right++) {
    product *= arr[right];
    while (product >= k) { product /= arr[left]; left++; }
    total += right - left + 1;
  }
  console.log(total);
}`,
      `arr, k = nums(1), num(2)
if k <= 1:
    print(0)
else:
    left = total = 0
    product = 1
    for right, x in enumerate(arr):
        product *= x
        while product >= k:
            product //= arr[left]
            left += 1
        total += right - left + 1
    print(total)`,
    ),
    testCases: [
      sample('4\n10 5 2 6\n100', '8'),
      sample('3\n1 2 3\n0', '0'),
      hidden('1\n5\n1', '0'),
      hidden('3\n1 1 1\n2', '6'),
      hidden('1\n1\n2', '1'),
      hidden('5\n2 2 2 2 2\n1000', '15'),
    ],
  },

  {
    slug: 'longest-subarray-after-deleting-one-element',
    title: 'Longest Subarray of 1s After Deleting One Element',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Given a binary array, you must delete exactly one element. Find the length of the longest contiguous run of 1s remaining afterward.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated 0s and 1s\n\n**Output**\nThe maximum length.',
    descriptionHi:
      'Ek binary array diya hai. Exactly ek element delete karna zaroori hai. Uske baad ones ka sabse lamba contiguous run dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated 0s aur 1s\n\n**Output**\nMaximum length.',
    examples: [
      { input: '4\n1 1 0 1', output: '3' },
      { input: '3\n1 1 1', output: '2', explanation: 'One element must be deleted even though all are 1s.' },
    ],
    constraints: ['1 <= n <= 10^5', 'Values are 0 or 1', 'At least one element'],
    hints: [
      'Deleting exactly one element is the same as picking a window that contains at most one zero (the deleted one), and reporting the count of 1s inside it.',
      'This is Max Consecutive Ones III with k = 1 in disguise.',
      'The answer is the window length minus 1 (since one element in the window is always the "deleted" slot, whether it is a real zero or, in the all-ones case, a placeholder).',
    ],
    approach:
      'Sliding window allowing at most one zero, exactly like Max Consecutive Ones III with `k = 1`. Track the number of 1s in the widest such window; that count is the answer, since the one allowed zero (or, in an all-ones window, one arbitrary element) represents the mandatory deletion.',
    approachHi:
      'Zyada se zyada ek zero allow karti hui sliding window, bilkul Max Consecutive Ones III jaisi `k = 1` ke saath. Us sabse wide window mein 1s ka count track karo; wahi answer hai, kyunki wo ek allowed zero (ya, sab-1 wali window mein, koi ek arbitrary element) mandatory deletion ko represent karta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Deleting one element and keeping the rest contiguous is equivalent to choosing a window that contains at most one non-1 value and then mentally discarding that one value — so this is exactly Max Consecutive Ones III with k=1, except the reported answer is the count of 1s in the window (window length minus the zero, if any) rather than the raw window length, which also correctly handles the all-1s edge case where a real element still has to be sacrificed.',
    solutionExplanationHi:
      'Ek element delete karke baaki ko contiguous rakhna, ek aisi window choose karne ke barabar hai jismein zyada se zyada ek non-1 value ho, aur phir us ek value ko mentally discard karna — isliye ye bilkul Max Consecutive Ones III hai k=1 ke saath, bas reported answer window mein 1s ka count hai (window length minus zero, agar ho) na ki raw window length — ye all-1s edge case ko bhi sahi handle karta hai jahan ek real element bhi sacrifice karna padta hai.',
    starter: starter(
      `const arr = nums(1);

function longestSubarray(arr) {
  // your code here
}

console.log(longestSubarray(arr));`,
      `arr = nums(1)

def longest_subarray(arr):
    # your code here
    pass

print(longest_subarray(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let left = 0, zeros = 0, best = 0;
for (let right = 0; right < arr.length; right++) {
  if (arr[right] === 0) zeros++;
  while (zeros > 1) {
    if (arr[left] === 0) zeros--;
    left++;
  }
  best = Math.max(best, right - left + 1 - 1);
}
console.log(best);`,
      `arr = nums(1)
left = zeros = best = 0
for right, x in enumerate(arr):
    if x == 0:
        zeros += 1
    while zeros > 1:
        if arr[left] == 0:
            zeros -= 1
        left += 1
    best = max(best, right - left + 1 - 1)
print(best)`,
    ),
    testCases: [
      sample('4\n1 1 0 1', '3'),
      sample('3\n1 1 1', '2'),
      hidden('1\n0', '0'),
      hidden('1\n1', '0'),
      hidden('9\n0 1 1 1 0 1 1 0 1', '5'),
      hidden('4\n0 0 0 0', '0'),
    ],
  },

  {
    slug: 'number-of-substrings-with-all-three-characters',
    title: 'Number of Substrings Containing All Three Characters',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Given a string made only of the letters `a`, `b`, and `c`, count the number of substrings that contain at least one occurrence of each of the three letters.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe count of such substrings.',
    descriptionHi:
      'Ek string di hai jo sirf `a`, `b`, aur `c` letters se bani hai. Kitne substrings mein teeno letters kam se kam ek baar hain, count karo.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nAise substrings ka count.',
    examples: [
      { input: 'abcabc', output: '10' },
      { input: 'aaacb', output: '3' },
    ],
    constraints: ['3 <= length <= 5*10^4', 'Only characters a, b, c'],
    hints: [
      'For each right edge, find the smallest left edge such that [left, right] contains all three letters.',
      'Every smaller window starting further left (down to index 0) that still contains that same right edge also automatically contains all three letters.',
      'That means for each right edge, the count of valid substrings ending there is exactly `left` (the smallest valid left index itself).',
    ],
    approach:
      'Sliding window tracking counts of a, b, c. For each right edge, shrink the left edge as far as possible while the window still contains all three letters. Once at the minimal valid left, every starting index from 0 up to (but not including) that left also produces a valid substring ending at the current right edge — add `left` to the running total.',
    approachHi:
      'a, b, c ka count track karti hui sliding window. Har right edge ke liye, left edge ko jitna ho sake shrink karo jab tak window mein teeno letters rehte hain. Minimal valid left tak pahunchne ke baad, 0 se us left tak (exclusive) ka har starting index bhi current right edge par khatam hone wala valid substring banata hai — `left` ko running total mein jodo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Once the smallest left edge that keeps [left, right] valid is found, every window [i, right] for i < left is a *superset* of [left, right] on the left side, so it trivially still contains all three letters too — meaning all `left` such starting positions (indices 0 through left-1) instantly count as valid without individually re-checking each one, which is what turns an apparent O(n^2) counting problem into O(n).',
    solutionExplanationHi:
      'Ek baar wo sabse chhota left edge mil jaaye jo [left, right] ko valid rakhta hai, to har window [i, right] jahan i < left hai, [left, right] ka left-side superset hai, isliye wo bhi automatically teeno letters contain karega — matlab un `left` starting positions (index 0 se left-1 tak) sabko bina individually re-check kiye valid maan sakte hain. Yahi cheez ek dikhne-mein O(n^2) counting problem ko O(n) bana deti hai.',
    starter: starter(
      `const s = line(0);

function numberOfSubstrings(s) {
  // your code here
}

console.log(numberOfSubstrings(s));`,
      `s = line(0)

def number_of_substrings(s):
    # your code here
    pass

print(number_of_substrings(s))`,
    ),
    solution: solution(
      `const s = line(0);
const count = { a: 0, b: 0, c: 0 };
let left = 0, total = 0;
for (let right = 0; right < s.length; right++) {
  count[s[right]]++;
  while (count.a > 0 && count.b > 0 && count.c > 0) { count[s[left]]--; left++; }
  total += left;
}
console.log(total);`,
      `s = line(0)
count = {"a": 0, "b": 0, "c": 0}
left = total = 0
for right, ch in enumerate(s):
    count[ch] += 1
    while count["a"] > 0 and count["b"] > 0 and count["c"] > 0:
        count[s[left]] -= 1
        left += 1
    total += left
print(total)`,
    ),
    testCases: [
      sample('abcabc', '10'),
      sample('aaacb', '3'),
      hidden('abc', '1'),
      hidden('aaa', '0'),
      hidden('cba', '1'),
      hidden('abcabcabc', '28'),
    ],
  },

  {
    slug: 'maximum-vowels-in-substring',
    title: 'Maximum Number of Vowels in a Substring',
    category: 'Sliding Window',
    difficulty: 'EASY',
    description:
      'Find the maximum number of vowels (`a, e, i, o, u`) in any substring of length exactly `k`.\n\n**Input**\n- Line 1: the string\n- Line 2: `k`\n\n**Output**\nThe maximum vowel count.',
    descriptionHi:
      'Length exactly `k` ke kisi bhi substring mein maximum kitne vowels (`a, e, i, o, u`) ho sakte hain, wo batao.\n\n**Input**\n- Line 1: string\n- Line 2: `k`\n\n**Output**\nMaximum vowel count.',
    examples: [
      { input: 'abciiidef\n3', output: '3' },
      { input: 'aeiou\n2', output: '2' },
    ],
    constraints: ['1 <= k <= length <= 10^5', 'Lowercase English letters'],
    hints: [
      'This is a fixed-size window, exactly like Maximum Sum Subarray of Size K.',
      'Treat each character as contributing 1 if it is a vowel, 0 otherwise, and slide the window over those contributions.',
      'Add the entering character\'s contribution and subtract the leaving one as the window slides.',
    ],
    approach:
      'Fixed-size sliding window of length `k`. Count vowels in the first window, then slide: add 1 if the entering character is a vowel, subtract 1 if the leaving character was a vowel. Track the maximum count seen.',
    approachHi:
      'Length `k` ki fixed-size sliding window. Pehli window ke vowels count karo, phir slide karo: agar aane wala character vowel hai to 1 jodo, agar jaane wala vowel tha to 1 ghatao. Maximum count track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Mapping "is this character a vowel" to a 0/1 value converts vowel-counting into exactly the same problem as Maximum Sum Subarray of Size K — a fixed-size window sliding over a sequence of numbers, incrementally maintaining the sum, with the same add-one-subtract-one update per slide.',
    solutionExplanationHi:
      '"Kya ye character vowel hai" ko 0/1 value mein map karna, vowel-counting ko bilkul Maximum Sum Subarray of Size K jaisa problem bana deta hai — numbers ki sequence par slide karti fixed-size window, incrementally sum maintain karte hue, har slide par wahi add-one-subtract-one update.',
    starter: starter(
      `const s = line(0), k = num(1);

function maxVowels(s, k) {
  // your code here
}

console.log(maxVowels(s, k));`,
      `s, k = line(0), num(1)

def max_vowels(s, k):
    # your code here
    pass

print(max_vowels(s, k))`,
    ),
    solution: solution(
      `const s = line(0), k = num(1);
const isVowel = (c) => 'aeiou'.includes(c);
let count = 0;
for (let i = 0; i < k; i++) if (isVowel(s[i])) count++;
let best = count;
for (let i = k; i < s.length; i++) {
  if (isVowel(s[i])) count++;
  if (isVowel(s[i - k])) count--;
  best = Math.max(best, count);
}
console.log(best);`,
      `s, k = line(0), num(1)
vowels = set("aeiou")
count = sum(1 for c in s[:k] if c in vowels)
best = count
for i in range(k, len(s)):
    if s[i] in vowels:
        count += 1
    if s[i - k] in vowels:
        count -= 1
    best = max(best, count)
print(best)`,
    ),
    testCases: [
      sample('abciiidef\n3', '3'),
      sample('aeiou\n2', '2'),
      hidden('leetcode\n3', '2'),
      hidden('rhythms\n4', '0'),
      hidden('tryhard\n4', '1'),
      hidden('a\n1', '1'),
    ],
  },

  {
    slug: 'max-average-subarray',
    title: 'Maximum Average Subarray I',
    category: 'Sliding Window',
    difficulty: 'EASY',
    description:
      'Find the maximum average value of any contiguous subarray of length exactly `k`. Print the answer with exactly 5 digits after the decimal point.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe maximum average, formatted to 5 decimal places.',
    descriptionHi:
      'Length exactly `k` ke kisi bhi contiguous subarray ka maximum average value dhoondo. Answer ko decimal point ke baad exactly 5 digits ke saath print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nMaximum average, 5 decimal places tak formatted.',
    examples: [
      { input: '6\n1 12 -5 -6 50 3\n4', output: '12.75000' },
      { input: '1\n5\n1', output: '5.00000' },
    ],
    constraints: ['1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'The window with the maximum average is the same window with the maximum sum, since k is fixed.',
      'Reuse the fixed-size sliding-window sum technique from Maximum Sum Subarray of Size K.',
      'Divide the best sum by k only once, at the very end.',
    ],
    approach:
      'Fixed-size sliding window tracking the running sum (identical to Maximum Sum Subarray of Size K). Once the maximum sum over all windows of length `k` is found, divide it by `k` once at the end to get the maximum average.',
    approachHi:
      'Running sum track karti fixed-size sliding window (bilkul Maximum Sum Subarray of Size K jaisi). Length `k` ki saari windows mein se maximum sum milne ke baad, use `k` se ek hi baar, aakhir mein divide karke maximum average nikal lo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Since every window being compared has exactly the same fixed length k, dividing by k is a constant scaling factor applied equally to every candidate — so whichever window has the maximum *sum* also has the maximum *average*, and the division only needs to happen once, at the very end, on the winning sum rather than repeatedly inside the loop.',
    solutionExplanationHi:
      'Chunki compare ki ja rahi har window ki length exactly k hai, k se divide karna har candidate par equally lagne wala ek constant scaling factor hai — isliye jis window ka *sum* maximum hai, uska *average* bhi maximum hoga. Division sirf ek baar, aakhir mein, jeetne wale sum par karna kaafi hai — loop ke andar baar-baar nahi.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function findMaxAverage(arr, k) {
  // return the maximum average as a number
  return 0;
}

console.log(findMaxAverage(arr, k).toFixed(5));`,
      `arr, k = nums(1), num(2)

def find_max_average(arr, k):
    # return the maximum average as a float
    return 0.0

print(f"{find_max_average(arr, k):.5f}")`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
let sum = 0;
for (let i = 0; i < k; i++) sum += arr[i];
let best = sum;
for (let i = k; i < arr.length; i++) { sum += arr[i] - arr[i - k]; best = Math.max(best, sum); }
console.log((best / k).toFixed(5));`,
      `arr, k = nums(1), num(2)
s = sum(arr[:k])
best = s
for i in range(k, len(arr)):
    s += arr[i] - arr[i - k]
    best = max(best, s)
print(f"{best / k:.5f}")`,
    ),
    testCases: [
      sample('6\n1 12 -5 -6 50 3\n4', '12.75000'),
      sample('1\n5\n1', '5.00000'),
      hidden('5\n0 0 0 0 0\n3', '0.00000'),
      hidden('4\n-1 -2 -3 -4\n2', '-1.50000'),
      hidden('3\n1 2 3\n3', '2.00000'),
      hidden('2\n4 -4\n1', '4.00000'),
    ],
  },

  {
    slug: 'binary-subarrays-with-sum',
    title: 'Binary Subarrays With Sum',
    category: 'Sliding Window',
    difficulty: 'MEDIUM',
    description:
      'Given a binary array, count the number of contiguous subarrays whose sum equals exactly `goal`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated 0s and 1s\n- Line 3: `goal`\n\n**Output**\nThe count of subarrays.',
    descriptionHi:
      'Ek binary array diya hai. Kitne contiguous subarrays ka sum exactly `goal` ke barabar hai, count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated 0s aur 1s\n- Line 3: `goal`\n\n**Output**\nSubarrays ka count.',
    examples: [
      { input: '5\n1 0 1 0 1\n2', output: '4' },
      { input: '5\n0 0 0 0 0\n0', output: '15' },
    ],
    constraints: ['1 <= n <= 3*10^4', 'Values are 0 or 1', '0 <= goal <= n'],
    hints: [
      'A sliding window naturally counts "sum <= some bound", but exact-sum counting is trickier because shrinking is ambiguous.',
      'A classic trick: exactly(goal) = atMost(goal) - atMost(goal - 1).',
      'atMost(bound) can be computed with a simple sliding window (shrink while sum > bound, add window length each step) — same technique as Subarray Product Less Than K.',
    ],
    approach:
      'Use the "exactly = atMost(goal) - atMost(goal - 1)" trick. Implement `atMost(bound)` as a sliding window that shrinks whenever the window sum exceeds `bound`, adding `right - left + 1` to the count at every step (same batch-counting idea as Subarray Product Less Than K). Guard `atMost` against a negative bound by returning 0 immediately.',
    approachHi:
      '"exactly = atMost(goal) - atMost(goal - 1)" trick use karo. `atMost(bound)` ko ek sliding window ki tarah implement karo jo window sum `bound` se zyada hone par shrink hoti hai, har step par `right - left + 1` count mein jodte hue (Subarray Product Less Than K wala hi batch-counting idea). Negative bound ke liye `atMost` turant 0 return kare.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Counting subarrays with sum *exactly* equal to a value is awkward for a sliding window directly, because both growing and shrinking can cross the target sum in either direction. Reframing it via two easier "at most" counts sidesteps that entirely: every subarray counted in atMost(goal) but not in atMost(goal-1) has a sum of exactly goal, and "at most" is a monotonic condition that sliding windows handle cleanly (as seen in Subarray Product Less Than K), so both helper counts can reuse that same simple technique.',
    solutionExplanationHi:
      '*Exactly* ek value ke barabar sum wale subarrays count karna sliding window ke liye seedhe mushkil hai, kyunki grow aur shrink dono hi target sum ko kisi bhi direction mein cross kar sakte hain. Do aasan "at most" counts ke through reframe karna ye poori tarah avoid kar deta hai: atMost(goal) mein count hone wala har subarray jo atMost(goal-1) mein nahi hai, uska sum exactly goal hai, aur "at most" ek monotonic condition hai jise sliding windows saaf tarah handle karte hain (Subarray Product Less Than K mein dekha gaya) — isliye dono helper counts wahi simple technique reuse kar sakte hain.',
    starter: starter(
      `const arr = nums(1), goal = num(2);

function numSubarraysWithSum(arr, goal) {
  // your code here
}

console.log(numSubarraysWithSum(arr, goal));`,
      `arr, goal = nums(1), num(2)

def num_subarrays_with_sum(arr, goal):
    # your code here
    pass

print(num_subarrays_with_sum(arr, goal))`,
    ),
    solution: solution(
      `const arr = nums(1), goal = num(2);
function atMost(bound) {
  if (bound < 0) return 0;
  let left = 0, sum = 0, total = 0;
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum > bound) { sum -= arr[left]; left++; }
    total += right - left + 1;
  }
  return total;
}
console.log(atMost(goal) - atMost(goal - 1));`,
      `arr, goal = nums(1), num(2)

def at_most(bound):
    if bound < 0:
        return 0
    left = total = s = 0
    for right, x in enumerate(arr):
        s += x
        while s > bound:
            s -= arr[left]
            left += 1
        total += right - left + 1
    return total

print(at_most(goal) - at_most(goal - 1))`,
    ),
    testCases: [
      sample('5\n1 0 1 0 1\n2', '4'),
      sample('5\n0 0 0 0 0\n0', '15'),
      hidden('1\n1\n1', '1'),
      hidden('1\n0\n1', '0'),
      hidden('3\n1 1 1\n0', '0'),
      hidden('4\n0 1 1 0\n1', '4'),
    ],
  },
];
