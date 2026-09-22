import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Dynamic Programming — expansion batch, part 2 of 2 (closes out the DSA
 * expansion project). Two-string DP (LCS, LPS, edit-distance variants,
 * interleaving), state-machine DP (stock trading with cooldown / at most 2
 * transactions), 2D grid DP (maximal square, square submatrices), and two
 * classic hard interval/decision DP problems (burst balloons, egg drop).
 */
export const dsaExtraDp2: SeedProblem[] = [
  {
    slug: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given two strings `text1` and `text2`, find the length of their longest common subsequence (not necessarily contiguous, but order-preserving in both strings).\n\n**Input**\n- Line 1: `text1`\n- Line 2: `text2`\n\n**Output**\nThe LCS length.',
    descriptionHi:
      'Do strings `text1` aur `text2` diye hain, unki longest common subsequence ki length dhoondo (contiguous hona zaroori nahi, lekin dono strings mein order preserve hona chahiye).\n\n**Input**\n- Line 1: `text1`\n- Line 2: `text2`\n\n**Output**\nLCS length.',
    examples: [
      { input: 'abcde\nace', output: '3' },
      { input: 'abc\nabc', output: '3' },
      { input: 'abc\ndef', output: '0' },
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000'],
    hints: [
      'dp[i][j] = LCS length of text1[0..i) and text2[0..j).',
      'If the last characters match (text1[i-1] === text2[j-1]), they can both be part of the subsequence: dp[i][j] = 1 + dp[i-1][j-1].',
      "If they don't match, the LCS either skips text1's last character or text2's last character (whichever leads to a longer result): dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    ],
    approach:
      '2D DP: dp[i][j] = LCS length of the first i characters of text1 and first j characters of text2. If text1[i-1] === text2[j-1], dp[i][j] = dp[i-1][j-1] + 1 (extend the match). Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (best of dropping one character from either string). The answer is dp[len1][len2].',
    approachHi:
      '2D DP: dp[i][j] = text1 ke pehle i characters aur text2 ke pehle j characters ki LCS length. Agar text1[i-1] === text2[j-1], dp[i][j] = dp[i-1][j-1] + 1 (match extend karo). Warna dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (kisi ek string se ek character drop karne mein se behtar). Answer dp[len1][len2] hai.',
    timeComplexity: 'O(len1 * len2)',
    spaceComplexity: 'O(len2) with a rolling 1D row',
    solutionExplanation:
      "Every optimal-substructure DP over two sequences reduces to the same three-way choice at each position pair: the two current characters either match (in which case using both extends a shorter LCS by exactly one, and this is always at least as good as skipping either), or they don't (in which case one of the two strings' current character is definitely not part of THIS particular optimal alignment, so the best answer is whichever of 'drop from text1' or 'drop from text2' scores higher) — trying both drop options and taking the max is what guarantees the true optimum is found even though which character to drop isn't knowable in advance.",
    solutionExplanationHi:
      "Do sequences par har optimal-substructure DP har position pair par isi teen-tarah ke choice mein reduce hota hai: dono current characters ya to match karte hain (is case mein dono use karna ek chhote LCS ko exactly ek se extend karta hai, aur ye hamesha kisi ek ko skip karne se kam se kam utna hi achha hota hai), ya nahi karte (is case mein dono strings mein se ek ka current character definitely is particular optimal alignment ka part nahi hai, isliye best answer 'text1 se drop karo' ya 'text2 se drop karo' mein se jo zyada score kare wahi hai) — dono drop options try karna aur max lena guarantee karta hai ki true optimum mil jaaye chahe pehle se pata na ho ki kaunsa character drop karna hai.",
    starter: starter(
      `const text1 = line(0);
const text2 = line(1);

function longestCommonSubsequence(text1, text2) {
  // return the LCS length
  return 0;
}

console.log(longestCommonSubsequence(text1, text2));`,
      `text1 = line(0)
text2 = line(1)

def longest_common_subsequence(text1, text2):
    # return the LCS length
    return 0

print(longest_common_subsequence(text1, text2))`,
    ),
    solution: solution(
      `const text1 = line(0);
const text2 = line(1);
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  let dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    const next = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      next[j] = text1[i - 1] === text2[j - 1] ? dp[j - 1] + 1 : Math.max(dp[j], next[j - 1]);
    }
    dp = next;
  }
  return dp[n];
}
console.log(longestCommonSubsequence(text1, text2));`,
      `text1 = line(0)
text2 = line(1)

def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        nxt = [0] * (n + 1)
        for j in range(1, n + 1):
            nxt[j] = dp[j - 1] + 1 if text1[i - 1] == text2[j - 1] else max(dp[j], nxt[j - 1])
        dp = nxt
    return dp[n]

print(longest_common_subsequence(text1, text2))`,
    ),
    testCases: [
      sample('abcde\nace', '3'),
      sample('abc\nabc', '3'),
      sample('abc\ndef', '0'),
      hidden('a\na', '1'),
      hidden('a\nb', '0'),
      hidden('bsbininm\njmjkbkjkv', '1'),
    ],
  },

  {
    slug: 'longest-palindromic-subsequence',
    title: 'Longest Palindromic Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given a string `s`, find the length of its longest palindromic subsequence (not necessarily contiguous).\n\n**Input**\nLine 1: `s`\n\n**Output**\nThe length of the longest palindromic subsequence.',
    descriptionHi:
      'Ek string `s` di hai, uski longest palindromic subsequence ki length dhoondo (contiguous hona zaroori nahi).\n\n**Input**\nLine 1: `s`\n\n**Output**\nLongest palindromic subsequence ki length.',
    examples: [
      { input: 'bbbab', output: '4' },
      { input: 'cbbd', output: '2' },
    ],
    constraints: ['1 <= s.length <= 1000'],
    hints: [
      'A neat reframing: the longest palindromic subsequence of s is exactly the Longest Common Subsequence of s and its own reverse.',
      'Alternatively, work directly with an interval DP: dp[i][j] = longest palindromic subsequence within s[i..j].',
      'If s[i] === s[j], those two characters can bracket the palindrome found inside: dp[i][j] = dp[i+1][j-1] + 2. Otherwise dp[i][j] = max(dp[i+1][j], dp[i][j-1]).',
    ],
    approach:
      "Interval DP over substrings, processing by increasing length. dp[i][j] = length of the longest palindromic subsequence in s[i..j]. Base case: dp[i][i] = 1 (single character). If s[i] === s[j], dp[i][j] = dp[i+1][j-1] + 2 (bracket a shorter palindrome). Otherwise dp[i][j] = max(dp[i+1][j], dp[i][j-1]). The answer is dp[0][n-1].",
    approachHi:
      "Substrings par interval DP, increasing length ke order mein process karte hue. dp[i][j] = s[i..j] mein longest palindromic subsequence ki length. Base case: dp[i][i] = 1 (single character). Agar s[i] === s[j], dp[i][j] = dp[i+1][j-1] + 2 (ek chhote palindrome ko bracket karo). Warna dp[i][j] = max(dp[i+1][j], dp[i][j-1]). Answer dp[0][n-1] hai.",
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n^2)',
    solutionExplanation:
      "Matching outer characters is provably always beneficial when possible: if s[i] equals s[j], wrapping them around whatever palindromic subsequence exists strictly between them extends it by exactly 2 with no downside, since a palindrome bracketed by two equal characters is still a palindrome — so this case never needs to be compared against alternatives, it dominates them outright. When the outer characters differ, though, they can never both be in the same palindromic subsequence together at these positions, so the best achievable result must come from a strictly smaller subproblem that has already dropped one end or the other, and taking the max of those two candidates is what correctly handles not knowing in advance which end was the 'wrong' one to keep.",
    solutionExplanationHi:
      "Outer characters match karna jab possible ho hamesha provably beneficial hota hai: agar s[i], s[j] ke barabar hai, unke beech strictly jo bhi palindromic subsequence exist karta hai use wrap karna use exactly 2 se extend karta hai bina kisi downside ke, kyunki do equal characters se bracketed palindrome khud bhi palindrome hi rehta hai — isliye ye case kabhi alternatives se compare karne ki zaroorat nahi, ye unhe outright dominate karta hai. Jab outer characters alag hon, tab wo dono in positions par same palindromic subsequence mein kabhi saath nahi ho sakte, isliye best achievable result zaroori taur par ek strictly chhote subproblem se aata hai jo ek ya doosra end pehle hi drop kar chuka hai, aur un do candidates ka max lena sahi tarike se handle karta hai jab pehle se pata na ho ki kaunsa end 'galat' tha rakhna.",
    starter: starter(
      `const s = line(0);

function longestPalindromeSubseq(s) {
  // return the length of the longest palindromic subsequence
  return 0;
}

console.log(longestPalindromeSubseq(s));`,
      `s = line(0)

def longest_palindrome_subseq(s):
    # return the length of the longest palindromic subsequence
    return 0

print(longest_palindrome_subseq(s))`,
    ),
    solution: solution(
      `const s = line(0);
function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) dp[i][j] = dp[i + 1][j - 1] + 2;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}
console.log(longestPalindromeSubseq(s));`,
      `s = line(0)

def longest_palindrome_subseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]

print(longest_palindrome_subseq(s))`,
    ),
    testCases: [
      sample('bbbab', '4'),
      sample('cbbd', '2'),
      hidden('a', '1'),
      hidden('aa', '2'),
      hidden('ab', '1'),
      hidden('racecar', '7'),
    ],
  },

  {
    slug: 'delete-operation-for-two-strings',
    title: 'Delete Operation for Two Strings',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given two strings `word1` and `word2`, find the minimum number of single-character DELETIONS (from either string) needed to make them equal.\n\n**Input**\n- Line 1: `word1`\n- Line 2: `word2`\n\n**Output**\nThe minimum number of deletions.',
    descriptionHi:
      'Do strings `word1` aur `word2` diye hain, unhe equal banane ke liye minimum single-character DELETIONS (kisi bhi string se) ki sankhya dhoondo.\n\n**Input**\n- Line 1: `word1`\n- Line 2: `word2`\n\n**Output**\nMinimum deletions ki sankhya.',
    examples: [
      { input: 'sea\neat', output: '2' },
      { input: 'leetcode\netc', output: '5' },
    ],
    constraints: ['1 <= word1.length, word2.length <= 500'],
    hints: [
      'Deleting characters from both strings until they match is equivalent to keeping only their LONGEST COMMON SUBSEQUENCE — that shared subsequence is exactly what should be preserved, everything else gets deleted.',
      'Compute the LCS length of word1 and word2 first, using the exact same DP as Longest Common Subsequence.',
      'The answer is (word1.length - LCS) + (word2.length - LCS) — each string deletes everything not part of the shared subsequence.',
    ],
    approach:
      "Compute LCS(word1, word2) with the standard 2D LCS DP. The minimum deletions needed is then (word1.length - LCS) + (word2.length - LCS): every character in each string NOT part of the longest common subsequence must be deleted, and nothing more needs to be, since keeping exactly the LCS in both already makes them equal.",
    approachHi:
      "Standard 2D LCS DP se LCS(word1, word2) compute karo. Minimum deletions phir (word1.length - LCS) + (word2.length - LCS) hai: har string mein jo character longest common subsequence ka part nahi hai use delete karna zaroori hai, aur usse zyada kuch delete karne ki zaroorat nahi, kyunki dono mein exactly LCS rakhna hi unhe equal bana deta hai.",
    timeComplexity: 'O(len1 * len2)',
    spaceComplexity: 'O(len2)',
    solutionExplanation:
      "Making two strings equal using only deletions means the final common string must be a SUBSEQUENCE of both originals (deletion preserves relative order) — and to minimize total deletions, that final shared subsequence should be as LONG as possible, since every character not kept must be deleted from its own string. That is precisely the definition of the longest common subsequence, so this problem is not merely similar to LCS, it IS LCS with one extra arithmetic step: once the longest shareable core is known, the deletion count for each string is just its own length minus however much of it was kept.",
    solutionExplanationHi:
      "Sirf deletions se do strings ko equal banane ka matlab hai final common string dono originals ka ek SUBSEQUENCE hona chahiye (deletion relative order preserve karta hai) — aur total deletions minimize karne ke liye, wo final shared subsequence jitna LONG ho sake utna hona chahiye, kyunki jo character nahi rakha gaya use apni string se delete karna hi hoga. Ye exactly longest common subsequence ki definition hai, isliye ye problem sirf LCS jaisa nahi hai, ye LCS HI hai ek extra arithmetic step ke saath: ek baar longest shareable core pata chal jaaye, har string ke liye deletion count bas uski apni length minus jitna kept tha hai.",
    starter: starter(
      `const word1 = line(0);
const word2 = line(1);

function minDistance(word1, word2) {
  // return the minimum deletions
  return 0;
}

console.log(minDistance(word1, word2));`,
      `word1 = line(0)
word2 = line(1)

def min_distance(word1, word2):
    # return the minimum deletions
    return 0

print(min_distance(word1, word2))`,
    ),
    solution: solution(
      `const word1 = line(0);
const word2 = line(1);
function lcsLength(a, b) {
  let dp = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const next = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      next[j] = a[i - 1] === b[j - 1] ? dp[j - 1] + 1 : Math.max(dp[j], next[j - 1]);
    }
    dp = next;
  }
  return dp[b.length];
}
function minDistance(word1, word2) {
  const lcs = lcsLength(word1, word2);
  return (word1.length - lcs) + (word2.length - lcs);
}
console.log(minDistance(word1, word2));`,
      `word1 = line(0)
word2 = line(1)

def lcs_length(a, b):
    dp = [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        nxt = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            nxt[j] = dp[j - 1] + 1 if a[i - 1] == b[j - 1] else max(dp[j], nxt[j - 1])
        dp = nxt
    return dp[len(b)]

def min_distance(word1, word2):
    lcs = lcs_length(word1, word2)
    return (len(word1) - lcs) + (len(word2) - lcs)

print(min_distance(word1, word2))`,
    ),
    testCases: [
      sample('sea\neat', '2'),
      sample('leetcode\netc', '5'),
      hidden('a\na', '0'),
      hidden('a\nb', '2'),
      hidden('abc\nabc', '0'),
    ],
  },

  {
    slug: 'minimum-insertion-steps-to-make-palindrome',
    title: 'Minimum Insertion Steps to Make a String Palindrome',
    category: 'Dynamic Programming',
    difficulty: 'HARD',
    description:
      'Given a string `s`, find the minimum number of characters that must be INSERTED to make it a palindrome.\n\n**Input**\nLine 1: `s`\n\n**Output**\nThe minimum number of insertions.',
    descriptionHi:
      'Ek string `s` di hai, use palindrome banane ke liye minimum kitne characters INSERT karne honge wo dhoondo.\n\n**Input**\nLine 1: `s`\n\n**Output**\nMinimum insertions ki sankhya.',
    examples: [
      { input: 'zzazz', output: '0' },
      { input: 'mbadm', output: '2' },
      { input: 'leetcode', output: '5' },
    ],
    constraints: ['1 <= s.length <= 500'],
    hints: [
      'Every character not already part of a shared "mirror" needs an inserted partner — the ones that already have a mirror are exactly the longest palindromic subsequence.',
      'This reduces directly to Longest Palindromic Subsequence: compute LPS(s) with the same interval DP.',
      'The answer is simply s.length - LPS(s) — every character outside the longest palindromic subsequence needs exactly one inserted mirror-partner.',
    ],
    approach:
      "Compute the longest palindromic subsequence length (LPS) using the standard interval DP (dp[i][j] = dp[i+1][j-1] + 2 if s[i]===s[j], else max(dp[i+1][j], dp[i][j-1])). The answer is s.length - LPS: every character already inside the LPS is already mirrored by some other kept character, so only the remaining (non-LPS) characters each need exactly one inserted partner to become mirrored too.",
    approachHi:
      "Standard interval DP (dp[i][j] = dp[i+1][j-1] + 2 agar s[i]===s[j], warna max(dp[i+1][j], dp[i][j-1])) se longest palindromic subsequence length (LPS) compute karo. Answer s.length - LPS hai: LPS ke andar wala har character already kisi doosre kept character se mirrored hai, isliye sirf bache hue (non-LPS) characters mein se har ek ko mirrored banane ke liye exactly ek insertion chahiye.",
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n^2)',
    solutionExplanation:
      "Every character in the final palindrome is either part of a mirrored pair or a lone center — and the characters from the ORIGINAL string that are already correctly mirrored with each other, in order, without needing any insertions, are by definition exactly a palindromic subsequence of s; the LONGEST such subsequence maximizes how much of s is 'already paired for free', leaving the fewest remaining characters that each require one freshly-inserted mirror partner. This is the same insight as Delete Operation for Two Strings reducing to LCS, but for a single string against itself: the quantity that must be minimized (insertions, here) is s.length minus however much of the string was already optimally self-mirrored.",
    solutionExplanationHi:
      "Final palindrome mein har character ya to ek mirrored pair ka part hai ya ek akela center hai — aur ORIGINAL string ke wo characters jo already ek doosre se correctly mirrored hain, order mein, bina kisi insertion ke, definition se exactly s ka ek palindromic subsequence hai; LONGEST aisa subsequence maximize karta hai ki s ka kitna hissa 'already free mein paired' hai, jitne kam bache hue characters mein se har ek ko ek freshly-inserted mirror partner chahiye. Ye wahi insight hai jo Delete Operation for Two Strings ko LCS mein reduce karta hai, bas ek single string ke khud ke against: jo quantity minimize karni hai (yahan insertions), wo s.length minus jitna string already optimally self-mirrored tha hai.",
    starter: starter(
      `const s = line(0);

function minInsertions(s) {
  // return the minimum insertions
  return 0;
}

console.log(minInsertions(s));`,
      `s = line(0)

def min_insertions(s):
    # return the minimum insertions
    return 0

print(min_insertions(s))`,
    ),
    solution: solution(
      `const s = line(0);
function longestPalinSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      dp[i][j] = s[i] === s[j] ? dp[i + 1][j - 1] + 2 : Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}
function minInsertions(s) {
  return s.length - longestPalinSubseq(s);
}
console.log(minInsertions(s));`,
      `s = line(0)

def longest_palin_subseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            dp[i][j] = dp[i + 1][j - 1] + 2 if s[i] == s[j] else max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]

def min_insertions(s):
    return len(s) - longest_palin_subseq(s)

print(min_insertions(s))`,
    ),
    testCases: [
      sample('zzazz', '0'),
      sample('mbadm', '2'),
      sample('leetcode', '5'),
      hidden('a', '0'),
      hidden('ab', '1'),
      hidden('aa', '0'),
    ],
  },

  {
    slug: 'coin-change-ii',
    title: 'Coin Change II',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given coin denominations and an amount, count the number of distinct COMBINATIONS of coins that sum to the amount (order does not matter, each coin type may be used unlimited times).\n\n**Input**\n- Line 1: `n amount`\n- Line 2: `n` space-separated coin denominations\n\n**Output**\nThe number of combinations.',
    descriptionHi:
      'Coin denominations aur ek amount diya hai, coins ke distinct COMBINATIONS ki sankhya count karo jo amount tak sum hote hain (order matter nahi karta, har coin type unlimited baar use ho sakta hai).\n\n**Input**\n- Line 1: `n amount`\n- Line 2: `n` space-separated coin denominations\n\n**Output**\nCombinations ki sankhya.',
    examples: [
      { input: '3 5\n1 2 5', output: '4' },
      { input: '1 3\n2', output: '0' },
      { input: '1 10\n10', output: '1' },
    ],
    constraints: ['1 <= n <= 300', '0 <= amount <= 5000'],
    hints: [
      'Unlike Target Sum / Combination Sum IV, order does NOT matter here — [1,2] and [2,1] should count as the SAME combination, not two.',
      'The loop order flips versus Combination Sum IV: put COINS in the outer loop and the running amount in the inner loop, so each coin denomination is fully "decided" before moving to the next.',
      'dp[a] = number of combinations using only coin denominations considered so far that sum to a. Process one coin type at a time, updating dp[a] += dp[a - coin] for a from coin up to amount (ascending, since a coin CAN be reused within the same denomination\'s pass).',
    ],
    approach:
      'dp[a] = number of combinations summing to a, dp[0] = 1. Process coins one denomination at a time (OUTER loop). For each coin, update dp[a] += dp[a - coin] for a from coin up to amount, ascending (INNER loop) — ascending allows reusing the same coin multiple times within one denomination\'s pass, while the coins-outer/amount-inner loop order ensures each combination is counted exactly once regardless of the order coins would be picked in.',
    approachHi:
      'dp[a] = a tak sum hone wale combinations ki sankhya, dp[0] = 1. Coins ko ek denomination at a time process karo (OUTER loop). Har coin ke liye, dp[a] += dp[a - coin] update karo, a ko coin se amount tak, ascending order mein (INNER loop) — ascending order ek hi denomination ke pass ke andar same coin ko multiple baar reuse karne deta hai, jabki coins-outer/amount-inner loop order ensure karta hai ki har combination exactly ek baar count ho, coins kis order mein pick hote wo important nahi.',
    timeComplexity: 'O(n * amount)',
    spaceComplexity: 'O(amount)',
    solutionExplanation:
      "Putting COINS in the outer loop (rather than the amount) is what makes this a combination count instead of a permutation count: by the time the algorithm moves on to the next coin denomination, every dp[a] value already reflects every way to build a using ONLY the denominations already considered, in a canonical fixed order (increasing coin index) — so a combination like {1,1,2} is only ever built by 'adding 1s first, then a 2', never also independently as 'adding a 2 first, then 1s', because the loop structure never revisits an earlier coin after moving on. This is the mirror image of Combination Sum IV's amount-outer/coins-inner order, and that single loop-order swap is the entire difference between counting combinations and counting permutations in unbounded-choice DP.",
    solutionExplanationHi:
      "COINS ko outer loop mein rakhna (amount ke bajaye) hi isko permutation count ke bajaye combination count banata hai: jab tak algorithm agli coin denomination par move karta hai, har dp[a] value already sirf ab tak consider hui denominations se a banane ke har tareeke ko reflect karti hai, ek canonical fixed order mein (increasing coin index) — isliye {1,1,2} jaisa combination hamesha 'pehle 1s add karke, phir ek 2' se hi banta hai, kabhi independently 'pehle ek 2 add karke, phir 1s' se bhi nahi, kyunki loop structure agli coin par jaane ke baad kabhi pehli coin ko revisit nahi karta. Ye Combination Sum IV ke amount-outer/coins-inner order ka mirror image hai, aur wahi single loop-order swap unbounded-choice DP mein combinations count karne aur permutations count karne ka poora difference hai.",
    starter: starter(
      `const [n, amount] = nums(0);
const coins = nums(1);

function change(amount, coins) {
  // return the number of combinations
  return 0;
}

console.log(change(amount, coins));`,
      `n, amount = nums(0)
coins = nums(1)

def change(amount, coins):
    # return the number of combinations
    return 0

print(change(amount, coins))`,
    ),
    solution: solution(
      `const [n, amount] = nums(0);
const coins = nums(1);
function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      dp[a] += dp[a - coin];
    }
  }
  return dp[amount];
}
console.log(change(amount, coins));`,
      `n, amount = nums(0)
coins = nums(1)

def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]

print(change(amount, coins))`,
    ),
    testCases: [
      sample('3 5\n1 2 5', '4'),
      sample('1 3\n2', '0'),
      sample('1 10\n10', '1'),
      hidden('2 0\n1 2', '1'),
      hidden('1 1\n1', '1'),
      hidden('2 4\n2 3', '1'),
    ],
  },

  {
    slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given daily stock prices, find the maximum profit from any number of transactions (buy then sell), where after selling you must wait one full day (cooldown) before buying again. You may not hold more than one share at a time.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nThe maximum profit.',
    descriptionHi:
      'Daily stock prices diye hain, kisi bhi sankhya mein transactions (buy phir sell) se maximum profit dhoondo, jahan sell karne ke baad next buy se pehle ek poora din (cooldown) wait karna zaroori hai. Ek time par ek se zyada share hold nahi kar sakte.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nMaximum profit.',
    examples: [
      { input: '5\n1 2 3 0 2', output: '3' },
      { input: '1\n1', output: '0' },
    ],
    constraints: ['1 <= n <= 5000', '0 <= price <= 1000'],
    hints: [
      'Model this as a small state machine with exactly three states per day: HOLDING a share, SOLD today (in cooldown tomorrow), and RESTING (not holding, free to buy).',
      'Each day, each state can only be reached from specific previous-day states: holding today means either already holding yesterday, or resting yesterday and buying today; resting today means either resting yesterday, or having sold (cooldown) the day before.',
      'The final answer is the maximum profit achievable while NOT holding a share on the last day, since ending while still holding is never optimal (you could always sell for more or equal profit).',
    ],
    approach:
      'Three-state DP per day: hold[i] = max profit while holding a share after day i; sold[i] = max profit having just sold on day i (in cooldown the next day); rest[i] = max profit while resting (not holding, not in cooldown) after day i. Transitions: hold[i] = max(hold[i-1], rest[i-1] - price[i]); sold[i] = hold[i-1] + price[i]; rest[i] = max(rest[i-1], sold[i-1]). The answer is max(sold[n-1], rest[n-1]) (never end while still holding).',
    approachHi:
      'Har din ke liye three-state DP: hold[i] = day i ke baad share hold karte hue max profit; sold[i] = day i par abhi sell kiya hua max profit (agle din cooldown mein); rest[i] = day i ke baad resting (na hold, na cooldown) max profit. Transitions: hold[i] = max(hold[i-1], rest[i-1] - price[i]); sold[i] = hold[i-1] + price[i]; rest[i] = max(rest[i-1], sold[i-1]). Answer max(sold[n-1], rest[n-1]) hai (kabhi bhi hold karte hue khatam mat karo).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with rolling variables',
    solutionExplanation:
      "The cooldown rule introduces a genuine extra state that a simple 'holding vs not holding' DP cannot express: being not-holding-but-still-in-cooldown behaves differently from being not-holding-and-free-to-buy, since only the latter permits a purchase today. Splitting 'not holding' into SOLD (just sold, forced rest tomorrow) and REST (free to act) captures exactly this distinction, and each state's transition only pulls from the specific prior-day states that could legally lead into it — hold can come from resting-then-buying (never from having just sold, since cooldown blocks that), which is precisely what enforces the one-day wait without needing to track how many days of cooldown remain.",
    solutionExplanationHi:
      "Cooldown rule ek genuine extra state introduce karta hai jise simple 'holding vs not holding' DP express nahi kar sakta: not-holding-but-still-in-cooldown hona not-holding-and-free-to-buy hone se alag behave karta hai, kyunki sirf doosra aaj purchase allow karta hai. 'Not holding' ko SOLD (abhi sell kiya, kal forced rest) aur REST (act karne ke liye free) mein split karna exactly ye distinction capture karta hai, aur har state ka transition sirf un specific prior-day states se aata hai jo legally usme le ja sakte hain — hold resting-then-buying se aa sakta hai (kabhi just-sold se nahi, kyunki cooldown use block karta hai), jo exactly ek-din ka wait enforce karta hai bina track kiye ki kitne din ka cooldown baaki hai.",
    starter: starter(
      `const n = num(0);
const prices = nums(1);

function maxProfit(prices) {
  // return the maximum profit
  return 0;
}

console.log(maxProfit(prices));`,
      `n = num(0)
prices = nums(1)

def max_profit(prices):
    # return the maximum profit
    return 0

print(max_profit(prices))`,
    ),
    solution: solution(
      `const n = num(0);
const prices = nums(1);
function maxProfit(prices) {
  if (prices.length === 0) return 0;
  let hold = -prices[0], sold = 0, rest = 0;
  for (let i = 1; i < prices.length; i++) {
    const prevHold = hold, prevSold = sold, prevRest = rest;
    hold = Math.max(prevHold, prevRest - prices[i]);
    sold = prevHold + prices[i];
    rest = Math.max(prevRest, prevSold);
  }
  return Math.max(sold, rest);
}
console.log(maxProfit(prices));`,
      `n = num(0)
prices = nums(1)

def max_profit(prices):
    if not prices:
        return 0
    hold, sold, rest = -prices[0], 0, 0
    for i in range(1, len(prices)):
        prev_hold, prev_sold, prev_rest = hold, sold, rest
        hold = max(prev_hold, prev_rest - prices[i])
        sold = prev_hold + prices[i]
        rest = max(prev_rest, prev_sold)
    return max(sold, rest)

print(max_profit(prices))`,
    ),
    testCases: [
      sample('5\n1 2 3 0 2', '3'),
      sample('1\n1', '0'),
      hidden('2\n1 5', '4'),
      hidden('2\n5 1', '0'),
      hidden('4\n1 2 4 2', '3'),
    ],
  },

  {
    slug: 'best-time-to-buy-and-sell-stock-iii',
    title: 'Best Time to Buy and Sell Stock III',
    category: 'Dynamic Programming',
    difficulty: 'HARD',
    description:
      'Given daily stock prices, find the maximum profit achievable with AT MOST 2 transactions (you may not hold more than one share at a time, and must sell before buying again).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nThe maximum profit.',
    descriptionHi:
      'Daily stock prices diye hain, AT MOST 2 transactions se achievable maximum profit dhoondo (ek time par ek se zyada share hold nahi kar sakte, aur dobara buy karne se pehle sell karna zaroori hai).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated prices\n\n**Output**\nMaximum profit.',
    examples: [
      { input: '6\n3 3 5 0 0 3 1 4', output: '6' },
      { input: '5\n1 2 3 4 5', output: '4' },
      { input: '4\n7 6 4 3 1', output: '0' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= price <= 1000'],
    hints: [
      'Track four running values as you scan once, left to right: profit after buy #1, profit after sell #1, profit after buy #2, profit after sell #2.',
      'Each value is updated greedily to be "as good as possible so far" — e.g. buy1 = max(buy1, -price) (the cheapest effective first purchase seen so far).',
      'sell2 depends on buy2, which depends on sell1, which depends on buy1 — computing them in that dependency order within the same scan keeps everything using only that day\'s price, correctly.',
    ],
    approach:
      'Single pass tracking four rolling values, updated in dependency order each day: buy1 = max(buy1, -price) (cheapest first buy so far); sell1 = max(sell1, buy1 + price) (best profit after one round-trip); buy2 = max(buy2, sell1 - price) (best net position after buying a second time, funded by the first round-trip\'s profit); sell2 = max(sell2, buy2 + price) (best profit after two round-trips). The answer is the final sell2 (initialized to 0, so using fewer than 2 transactions is automatically allowed).',
    approachHi:
      'Ek single pass jo char rolling values track karta hai, har din dependency order mein update karte hue: buy1 = max(buy1, -price) (ab tak ka sabse sasta pehla buy); sell1 = max(sell1, buy1 + price) (ek round-trip ke baad best profit); buy2 = max(buy2, sell1 - price) (doosri baar buy karne ke baad best net position, pehle round-trip ke profit se funded); sell2 = max(sell2, buy2 + price) (do round-trips ke baad best profit). Answer final sell2 hai (0 se initialized, isliye 2 se kam transactions use karna automatically allowed hai).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "Rather than a full 2D DP over (day, transactions-used, holding-state) — which would also work but needs an explicit table — this collapses to four scalars because each one only ever needs the PREVIOUS values of the states that can feed into it, computed in a single forward pass: buy1 only needs a running minimum-effective-cost, sell1 only needs the best buy1 so far, and so on up the chain. Initializing sell1 and sell2 to 0 (rather than -infinity) is what makes 'fewer than 2 transactions' automatically valid — a transaction that would only lose money simply never improves sell1 or sell2's running max, so the algorithm naturally settles on using 0, 1, or 2 transactions, whichever is truly best, without any explicit branching on transaction count.",
    solutionExplanationHi:
      "(day, transactions-used, holding-state) par ek full 2D DP ke bajaye — jo bhi kaam karta lekin ek explicit table chahiye — ye char scalars mein collapse hota hai kyunki har ek ko sirf un states ki PREVIOUS values chahiye jo usme feed kar sakte hain, ek single forward pass mein compute hoke: buy1 ko sirf ek running minimum-effective-cost chahiye, sell1 ko sirf ab tak ka best buy1 chahiye, aur aage chain mein waise hi. sell1 aur sell2 ko 0 se initialize karna (-infinity ke bajaye) hi 'do se kam transactions' ko automatically valid banata hai — ek transaction jo sirf paisa loss kare wo sell1 ya sell2 ka running max kabhi improve nahi karega, isliye algorithm naturally 0, 1, ya 2 transactions use karne par settle hota hai, jo bhi truly best ho, bina transaction count par kisi explicit branching ke.",
    starter: starter(
      `const n = num(0);
const prices = nums(1);

function maxProfit(prices) {
  // return the maximum profit with at most 2 transactions
  return 0;
}

console.log(maxProfit(prices));`,
      `n = num(0)
prices = nums(1)

def max_profit(prices):
    # return the maximum profit with at most 2 transactions
    return 0

print(max_profit(prices))`,
    ),
    solution: solution(
      `const n = num(0);
const prices = nums(1);
function maxProfit(prices) {
  let buy1 = -Infinity, sell1 = 0, buy2 = -Infinity, sell2 = 0;
  for (const price of prices) {
    buy1 = Math.max(buy1, -price);
    sell1 = Math.max(sell1, buy1 + price);
    buy2 = Math.max(buy2, sell1 - price);
    sell2 = Math.max(sell2, buy2 + price);
  }
  return sell2;
}
console.log(maxProfit(prices));`,
      `n = num(0)
prices = nums(1)

def max_profit(prices):
    buy1, sell1, buy2, sell2 = float('-inf'), 0, float('-inf'), 0
    for price in prices:
        buy1 = max(buy1, -price)
        sell1 = max(sell1, buy1 + price)
        buy2 = max(buy2, sell1 - price)
        sell2 = max(sell2, buy2 + price)
    return sell2

print(max_profit(prices))`,
    ),
    testCases: [
      sample('6\n3 3 5 0 0 3 1 4', '6'),
      sample('5\n1 2 3 4 5', '4'),
      sample('4\n7 6 4 3 1', '0'),
      hidden('1\n5', '0'),
      hidden('4\n1 2 3 4', '3'),
    ],
  },

  {
    slug: 'maximal-square',
    title: 'Maximal Square',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      "Given an `rows x cols` binary matrix, find the area of the largest square containing only `1`s.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nThe area of the largest all-1s square.",
    descriptionHi:
      "Ek `rows x cols` binary matrix diya hai, sabse bada square dhoondo jismein sirf `1`s hain, aur uska area return karo.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nSabse bade all-1s square ka area.",
    examples: [
      { input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0', output: '4' },
      { input: '2 2\n0 1\n1 0', output: '1' },
      { input: '1 1\n0', output: '0' },
    ],
    constraints: ['1 <= rows, cols <= 300'],
    hints: [
      'dp[r][c] = the side length of the largest all-1s square whose BOTTOM-RIGHT corner is at (r, c) — not the largest square anywhere in the matrix.',
      'If the cell itself is 0, dp[r][c] = 0 immediately (no square can end here).',
      "If the cell is 1, dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) — a square of side s can only end here if all three of the square-corners one step back (above, left, and diagonally up-left) support at least a side of s-1.",
    ],
    approach:
      'dp[r][c] = side length of the largest all-1s square with bottom-right corner exactly at (r, c). If grid[r][c] is 0, dp[r][c] = 0. If grid[r][c] is 1, dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) (treating out-of-bounds as 0, so edge cells with a 1 get dp = 1). Track the maximum dp value seen; the answer is that maximum squared (side length to area).',
    approachHi:
      'dp[r][c] = (r, c) par bottom-right corner wale sabse bade all-1s square ki side length. Agar grid[r][c] 0 hai, dp[r][c] = 0. Agar grid[r][c] 1 hai, dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) (out-of-bounds ko 0 maante hue, isliye edge cells jinme 1 hai unka dp = 1 hota hai). Dekhi gayi maximum dp value track karo; answer wo maximum ka square hai (side length se area).',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(cols) with a rolling 1D row',
    solutionExplanation:
      "A square of side s ending at (r,c) requires the entire s x s block above-and-left of it to be all 1s — which is equivalent to saying that its three neighboring squares (ending one row up, one column left, and diagonally up-left) must each already support at least a side of s-1, since together those three overlapping (s-1) x (s-1) regions exactly cover the (s-1) x (s-1) block that the new square needs minus its own new bottom-right row and column of 1s. Taking the MIN of the three (rather than, say, their sum or max) is essential: the new square is only as strong as its WEAKEST supporting neighbor, since a smaller neighboring square directly implies a 0 exists somewhere that would break a larger square at that position too.",
    solutionExplanationHi:
      "(r,c) par end hone wale side s ke square ko uske upar-aur-left wale poore s x s block mein sab 1s chahiye — jo yah kehne ke barabar hai ki uske teen neighboring squares (ek row upar, ek column left, aur diagonally up-left par end hone wale) har ek ko already at least side s-1 support karna chahiye, kyunki saath mein wo teen overlapping (s-1) x (s-1) regions exactly us (s-1) x (s-1) block ko cover karte hain jo naya square apni khud ki nayi bottom-right row aur column of 1s minus chahta hai. Teenon ka MIN lena (sum ya max ke bajaye) zaroori hai: naya square sirf apne WEAKEST supporting neighbor jitna strong hai, kyunki ek chhota neighboring square directly imply karta hai ki kahin ek 0 hai jo us position par bhi ek bade square ko break kar dega.",
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function maximalSquare(grid) {
  // return the area of the largest all-1s square
  return 0;
}

console.log(maximalSquare(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def maximal_square(grid):
    # return the area of the largest all-1s square
    return 0

print(maximal_square(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
function maximalSquare(grid) {
  const rows = grid.length, cols = grid[0].length;
  let prev = new Array(cols + 1).fill(0);
  let maxSide = 0;
  for (let r = 0; r < rows; r++) {
    const cur = new Array(cols + 1).fill(0);
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        cur[c + 1] = 1 + Math.min(prev[c + 1], cur[c], prev[c]);
        maxSide = Math.max(maxSide, cur[c + 1]);
      }
    }
    prev = cur;
  }
  return maxSide * maxSide;
}
console.log(maximalSquare(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def maximal_square(grid):
    rows, cols = len(grid), len(grid[0])
    prev = [0] * (cols + 1)
    max_side = 0
    for r in range(rows):
        cur = [0] * (cols + 1)
        for c in range(cols):
            if grid[r][c] == 1:
                cur[c + 1] = 1 + min(prev[c + 1], cur[c], prev[c])
                max_side = max(max_side, cur[c + 1])
        prev = cur
    return max_side * max_side

print(maximal_square(grid))`,
    ),
    testCases: [
      sample('4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0', '4'),
      sample('2 2\n0 1\n1 0', '1'),
      sample('1 1\n0', '0'),
      hidden('1 1\n1', '1'),
      hidden('3 3\n1 1 1\n1 1 1\n1 1 1', '9'),
      hidden('2 3\n0 0 0\n0 0 0', '0'),
    ],
  },

  {
    slug: 'interleaving-string',
    title: 'Interleaving String',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given three strings `s1`, `s2`, and `s3`, determine whether `s3` can be formed by interleaving `s1` and `s2` (preserving the relative order of characters within each).\n\n**Input**\n- Line 1: `s1`\n- Line 2: `s2`\n- Line 3: `s3`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Teen strings `s1`, `s2`, aur `s3` diye hain, check karo ki `s3` ko `s1` aur `s2` ko interleave karke banaya ja sakta hai ya nahi (har ek ke andar characters ka relative order preserve karte hue).\n\n**Input**\n- Line 1: `s1`\n- Line 2: `s2`\n- Line 3: `s3`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'aabcc\ndbbca\naadbbcbcac', output: 'true' },
      { input: 'aabcc\ndbbca\naadbbbaccc', output: 'false' },
      { input: '\n\n', output: 'true' },
    ],
    constraints: ['0 <= s1.length, s2.length <= 100', 's3.length === s1.length + s2.length'],
    hints: [
      'If s3.length !== s1.length + s2.length, the answer is immediately false — a necessary length check before any DP.',
      'dp[i][j] = whether s3[0..i+j) can be formed by interleaving s1[0..i) and s2[0..j).',
      'dp[i][j] is true if EITHER (dp[i-1][j] is true AND s1[i-1] matches the current s3 character) OR (dp[i][j-1] is true AND s2[j-1] matches the current s3 character) — the current s3 character must come from whichever string is consumed last.',
    ],
    approach:
      "First check s3.length === s1.length + s2.length (else false immediately). Then 2D DP: dp[i][j] = whether the first i+j characters of s3 can be formed by interleaving the first i characters of s1 and first j characters of s2. dp[0][0] = true. dp[i][j] = (dp[i-1][j] && s1[i-1] === s3[i+j-1]) || (dp[i][j-1] && s2[j-1] === s3[i+j-1]). The answer is dp[len1][len2].",
    approachHi:
      "Pehle check karo s3.length === s1.length + s2.length (nahi to turant false). Phir 2D DP: dp[i][j] = kya s3 ke pehle i+j characters s1 ke pehle i characters aur s2 ke pehle j characters ko interleave karke bane hain. dp[0][0] = true. dp[i][j] = (dp[i-1][j] && s1[i-1] === s3[i+j-1]) || (dp[i][j-1] && s2[j-1] === s3[i+j-1]). Answer dp[len1][len2] hai.",
    timeComplexity: 'O(len1 * len2)',
    spaceComplexity: 'O(len2) with a rolling 1D row',
    solutionExplanation:
      "At any point while building s3 by interleaving, the NEXT character consumed must come from either s1 or s2 — there's no third source — and crucially the position within s3 is always exactly i+j once i characters of s1 and j of s2 have been used, so there's no separate index to track for s3. This lets dp[i][j] check just two candidate origins for the most recently placed character: it's valid to have arrived at state (i,j) via s1 contributing its i-th character (only if state (i-1,j) was already valid AND that character matches) OR via s2 contributing its j-th character (symmetric condition) — an OR of these two, not requiring both, since only ONE of the two strings can have contributed the single most-recent character.",
    solutionExplanationHi:
      "S1 aur s2 ko interleave karke s3 banate waqt kisi bhi point par, NEXT consume hone wala character ya to s1 se ya s2 se aana chahiye — teesra koi source nahi hai — aur crucially s3 ke andar position hamesha exactly i+j hota hai jab i characters s1 ke aur j characters s2 ke use ho chuke hon, isliye s3 ke liye alag se index track karne ki zaroorat nahi. Isse dp[i][j] sirf do candidate origins check karta hai sabse recently placed character ke liye: state (i,j) tak s1 ke apne i-th character contribute karne se pahunchna valid hai (sirf agar state (i-1,j) already valid tha AUR wo character match karta hai) YA s2 ke apne j-th character contribute karne se (symmetric condition) — in dono ka OR, dono ki zaroorat nahi, kyunki sirf EK hi string sabse recent character contribute kar sakti thi.",
    starter: starter(
      `const s1 = line(0);
const s2 = line(1);
const s3 = line(2);

function isInterleave(s1, s2, s3) {
  // return true or false
  return false;
}

console.log(isInterleave(s1, s2, s3));`,
      `s1 = line(0)
s2 = line(1)
s3 = line(2)

def is_interleave(s1, s2, s3):
    # return True or False
    return False

print("true" if is_interleave(s1, s2, s3) else "false")`,
    ),
    solution: solution(
      `const s1 = line(0);
const s2 = line(1);
const s3 = line(2);
function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  let dp = new Array(s2.length + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= s2.length; j++) dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= s1.length; i++) {
    const next = new Array(s2.length + 1).fill(false);
    next[0] = dp[0] && s1[i - 1] === s3[i - 1];
    for (let j = 1; j <= s2.length; j++) {
      next[j] = (dp[j] && s1[i - 1] === s3[i + j - 1]) || (next[j - 1] && s2[j - 1] === s3[i + j - 1]);
    }
    dp = next;
  }
  return dp[s2.length];
}
console.log(isInterleave(s1, s2, s3));`,
      `s1 = line(0)
s2 = line(1)
s3 = line(2)

def is_interleave(s1, s2, s3):
    if len(s1) + len(s2) != len(s3):
        return False
    dp = [False] * (len(s2) + 1)
    dp[0] = True
    for j in range(1, len(s2) + 1):
        dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]
    for i in range(1, len(s1) + 1):
        nxt = [False] * (len(s2) + 1)
        nxt[0] = dp[0] and s1[i - 1] == s3[i - 1]
        for j in range(1, len(s2) + 1):
            nxt[j] = (dp[j] and s1[i - 1] == s3[i + j - 1]) or (nxt[j - 1] and s2[j - 1] == s3[i + j - 1])
        dp = nxt
    return dp[len(s2)]

print("true" if is_interleave(s1, s2, s3) else "false")`,
    ),
    testCases: [
      sample('aabcc\ndbbca\naadbbcbcac', 'true'),
      sample('aabcc\ndbbca\naadbbbaccc', 'false'),
      sample('\n\n', 'true'),
      hidden('a\n\na', 'true'),
      hidden('a\nb\nab', 'true'),
      hidden('a\nb\nba', 'true'),
      hidden('ab\nbc\nbabc', 'true'),
    ],
  },

  {
    slug: 'count-square-submatrices-with-all-ones',
    title: 'Count Square Submatrices with All Ones',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given an `rows x cols` binary matrix, count the total number of square submatrices that contain only `1`s (squares of every size, at every position).\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nThe total count of all-1s square submatrices.',
    descriptionHi:
      'Ek `rows x cols` binary matrix diya hai, un total square submatrices ki sankhya count karo jinmein sirf `1`s hain (har size ke squares, har position par).\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nSaare all-1s square submatrices ki total count.',
    examples: [
      { input: '3 3\n0 1 1\n1 1 1\n0 1 1', output: '9' },
      { input: '3 3\n1 0 1\n1 1 0\n1 1 0', output: '7' },
    ],
    constraints: ['1 <= rows, cols <= 300'],
    hints: [
      'This uses the exact same dp[r][c] definition as Maximal Square: the side length of the largest all-1s square with bottom-right corner at (r, c).',
      'The key insight for counting: a cell with dp[r][c] = k does not just mean "the LARGEST square ending here has side k" — it means there are EXACTLY k distinct all-1s squares ending here (of sides 1, 2, ..., k), since every smaller side is also automatically achievable at that same corner.',
      'So the total count is simply the SUM of dp[r][c] over every cell, not the max — accumulate as you go instead of tracking a running maximum.',
    ],
    approach:
      "Same DP recurrence as Maximal Square: dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) if grid[r][c] is 1, else 0. Instead of tracking the maximum dp value, sum every dp[r][c] into a running total. The answer is that total.",
    approachHi:
      "Maximal Square jaisi hi DP recurrence: dp[r][c] = 1 + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) agar grid[r][c] 1 hai, warna 0. Maximum dp value track karne ke bajaye, har dp[r][c] ko ek running total mein sum karo. Answer wo total hai.",
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(cols) with a rolling 1D row',
    solutionExplanation:
      "dp[r][c] = k (the largest square ending at this corner has side k) carries more information than it first appears: because a valid k x k all-1s square with this bottom-right corner exists, so does every smaller (k-1) x (k-1), (k-2) x (k-2), ..., 1x1 square sharing the SAME bottom-right corner (each is just a sub-square nested inside the largest one, and a sub-region of an all-1s region is trivially also all-1s) — so dp[r][c] simultaneously counts k DISTINCT valid squares, not just confirms the existence of one. Summing dp[r][c] across the whole grid therefore counts every square exactly once, indexed by its own bottom-right corner, with no risk of double-counting since each square has exactly one bottom-right corner.",
    solutionExplanationHi:
      "dp[r][c] = k (is corner par end hone wala sabse bada square side k ka hai) pehli nazar mein dikhne se zyada information carry karta hai: kyunki is bottom-right corner wala ek valid k x k all-1s square exist karta hai, isliye SAME bottom-right corner share karne wala har chhota (k-1) x (k-1), (k-2) x (k-2), ..., 1x1 square bhi exist karta hai (har ek bas sabse bade ke andar nested ek sub-square hai, aur ek all-1s region ka sub-region bhi trivially all-1s hota hai) — isliye dp[r][c] ek saath k DISTINCT valid squares count karta hai, sirf ek ke existence ko confirm nahi karta. Poore grid mein dp[r][c] sum karna isliye har square ko exactly ek baar count karta hai, uske apne bottom-right corner se indexed, double-counting ka koi risk nahi kyunki har square ka exactly ek bottom-right corner hota hai.",
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function countSquares(grid) {
  // return the total count of all-1s square submatrices
  return 0;
}

console.log(countSquares(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def count_squares(grid):
    # return the total count of all-1s square submatrices
    return 0

print(count_squares(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
function countSquares(grid) {
  const rows = grid.length, cols = grid[0].length;
  let prev = new Array(cols + 1).fill(0);
  let total = 0;
  for (let r = 0; r < rows; r++) {
    const cur = new Array(cols + 1).fill(0);
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        cur[c + 1] = 1 + Math.min(prev[c + 1], cur[c], prev[c]);
        total += cur[c + 1];
      }
    }
    prev = cur;
  }
  return total;
}
console.log(countSquares(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def count_squares(grid):
    rows, cols = len(grid), len(grid[0])
    prev = [0] * (cols + 1)
    total = 0
    for r in range(rows):
        cur = [0] * (cols + 1)
        for c in range(cols):
            if grid[r][c] == 1:
                cur[c + 1] = 1 + min(prev[c + 1], cur[c], prev[c])
                total += cur[c + 1]
        prev = cur
    return total

print(count_squares(grid))`,
    ),
    testCases: [
      sample('3 3\n0 1 1\n1 1 1\n0 1 1', '9'),
      sample('3 3\n1 0 1\n1 1 0\n1 1 0', '7'),
      hidden('1 1\n1', '1'),
      hidden('1 1\n0', '0'),
      hidden('2 2\n1 1\n1 1', '5'),
    ],
  },

  {
    slug: 'burst-balloons',
    title: 'Burst Balloons',
    category: 'Dynamic Programming',
    difficulty: 'HARD',
    description:
      'Given `n` balloons with values, bursting balloon `i` earns `left * nums[i] * right` coins, where `left`/`right` are the values of the current (still-unburst) neighbors of `i` (using 1 if a side is out of bounds). Find the maximum coins obtainable by bursting all balloons in some order.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nThe maximum coins.',
    descriptionHi:
      '`n` balloons diye hain values ke saath, balloon `i` burst karne se `left * nums[i] * right` coins milte hain, jahan `left`/`right` `i` ke current (abhi tak burst nahi hue) neighbors ki values hain (agar koi side out of bounds hai to 1 use karo). Kisi bhi order mein saare balloons burst karke maximum coins dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated values\n\n**Output**\nMaximum coins.',
    examples: [
      { input: '4\n3 1 5 8', output: '167' },
      { input: '1\n7', output: '7' },
    ],
    constraints: ['1 <= n <= 300', '0 <= value <= 100'],
    hints: [
      'Thinking about "which balloon to burst FIRST" is hard, because the neighbors keep changing as balloons burst — instead, think about which balloon to burst LAST within a range.',
      'Pad the array with a 1 on each end (virtual boundary balloons). dp[l][r] = max coins from bursting every real balloon strictly between padded indices l and r, assuming l and r themselves are never burst (they act as fixed walls).',
      'For dp[l][r], try every k strictly between l and r as the LAST balloon burst in that range: once everything else in (l, k) and (k, r) is gone, k\'s only remaining neighbors are exactly l and r, so bursting it earns nums[l] * nums[k] * nums[r], plus whatever dp[l][k] and dp[k][r] already captured.',
    ],
    approach:
      "Pad the array with a virtual 1 at each end. dp[l][r] = maximum coins from bursting all balloons strictly between indices l and r (exclusive), treating l and r as permanent boundary walls. Fill by increasing range width. For each (l, r), try every k in (l, r) as the LAST balloon burst within that open range: dp[l][r] = max over k of dp[l][k] + dp[k][r] + nums[l]*nums[k]*nums[r] (since once its neighbors in (l,k) and (k,r) are already gone, k's actual neighbors at burst time are exactly l and r). The answer is dp[0][n+1] on the padded array.",
    approachHi:
      "Array ko har end par ek virtual 1 se pad karo. dp[l][r] = index l aur r (exclusive) ke beech ke saare balloons burst karne se max coins, l aur r ko permanent boundary walls maante hue. Range width badhate hue fill karo. Har (l, r) ke liye, (l, r) ke beech har k ko us open range mein LAST burst balloon ki tarah try karo: dp[l][r] = k par max of dp[l][k] + dp[k][r] + nums[l]*nums[k]*nums[r] (kyunki (l,k) aur (k,r) ke neighbors already gaye hone ke baad, burst time par k ke actual neighbors exactly l aur r hain). Answer padded array par dp[0][n+1] hai.",
    timeComplexity: 'O(n^3)',
    spaceComplexity: 'O(n^2)',
    solutionExplanation:
      "Thinking forward (\"which balloon bursts first\") is intractable because a balloon's coin value depends on its CURRENT neighbors, which constantly change as other balloons burst around it — there's no stable, precomputable quantity to build a forward recurrence on. Thinking backward (\"which balloon bursts LAST within this range\") sidesteps the problem entirely: if k is guaranteed to be the last balloon burst among everything strictly between fixed walls l and r, then by the time k is finally burst, EVERYTHING else in (l,k) and (k,r) is already gone — meaning k's neighbors at that exact moment are unambiguously l and r, giving a fixed, calculable coin value (nums[l]*nums[k]*nums[r]) independent of the order the rest of (l,k) and (k,r) were burst in, which is exactly what those two independent subproblems dp[l][k] and dp[k][r] already optimize separately.",
    solutionExplanationHi:
      "Aage soch kar (\"pehle kaunsa balloon burst hoga\") intractable hai kyunki ek balloon ki coin value uske CURRENT neighbors par depend karti hai, jo doosre balloons burst hone se lagataar badalte rehte hain — koi stable, precomputable quantity nahi hai jispe forward recurrence banaya ja sake. Peeche se soch kar (\"is range mein aakhri mein kaunsa balloon burst hoga\") problem ko poori tarah bypass kar deta hai: agar k guaranteed hai ki fixed walls l aur r ke beech strictly sabse aakhir mein burst hoga, to jab k aakhir mein burst hota hai, (l,k) aur (k,r) mein baaki sab already ja chuke hote hain — matlab us exact moment par k ke neighbors unambiguously l aur r hain, jo ek fixed, calculable coin value deta hai (nums[l]*nums[k]*nums[r]) (l,k) aur (k,r) ke baaki hisse kis order mein burst hue us se independent, jo exactly wo hai jo un do independent subproblems dp[l][k] aur dp[k][r] already alag alag optimize karte hain.",
    starter: starter(
      `const n = num(0);
const arr = nums(1);

function maxCoins(nums) {
  // return the maximum coins
  return 0;
}

console.log(maxCoins(arr));`,
      `n = num(0)
arr = nums(1)

def max_coins(nums):
    # return the maximum coins
    return 0

print(max_coins(arr))`,
    ),
    solution: solution(
      `const n = num(0);
const arr = nums(1);
function maxCoins(nums) {
  const balloons = [1, ...nums, 1];
  const m = balloons.length;
  const dp = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let width = 2; width < m; width++) {
    for (let l = 0; l + width < m; l++) {
      const r = l + width;
      let best = 0;
      for (let k = l + 1; k < r; k++) {
        const coins = dp[l][k] + dp[k][r] + balloons[l] * balloons[k] * balloons[r];
        if (coins > best) best = coins;
      }
      dp[l][r] = best;
    }
  }
  return dp[0][m - 1];
}
console.log(maxCoins(arr));`,
      `n = num(0)
arr = nums(1)

def max_coins(nums):
    balloons = [1] + nums + [1]
    m = len(balloons)
    dp = [[0] * m for _ in range(m)]
    for width in range(2, m):
        for l in range(0, m - width):
            r = l + width
            best = 0
            for k in range(l + 1, r):
                coins = dp[l][k] + dp[k][r] + balloons[l] * balloons[k] * balloons[r]
                if coins > best:
                    best = coins
            dp[l][r] = best
    return dp[0][m - 1]

print(max_coins(arr))`,
    ),
    testCases: [
      sample('4\n3 1 5 8', '167'),
      sample('1\n7', '7'),
      hidden('2\n1 5', '10'),
      hidden('3\n1 1 1', '3'),
      hidden('2\n0 0', '0'),
    ],
  },

  {
    slug: 'egg-drop',
    title: 'Egg Drop Puzzle',
    category: 'Dynamic Programming',
    difficulty: 'HARD',
    description:
      "Given `k` identical eggs and `n` floors, find the minimum number of trials needed, in the WORST case, to determine the exact floor below which eggs never break and at or above which they always break (an egg that survives a fall can be reused; a broken egg cannot).\n\n**Input**\nLine 1: `k n`\n\n**Output**\nThe minimum worst-case number of trials.",
    descriptionHi:
      "`k` identical eggs aur `n` floors diye hain. Minimum number of trials dhoondo, WORST case mein, us exact floor ko determine karne ke liye jiske neeche eggs kabhi nahi tootte aur jispar ya jiske upar hamesha toot jaate hain (jo egg gir kar bhi bach jaaye use reuse kiya ja sakta hai; toota hua egg nahi).\n\n**Input**\nLine 1: `k n`\n\n**Output**\nMinimum worst-case trials ki sankhya.",
    examples: [
      { input: '1 2', output: '2' },
      { input: '2 6', output: '3' },
      { input: '3 14', output: '4' },
    ],
    constraints: ['1 <= k <= 10', '1 <= n <= 1000'],
    hints: [
      'Reframe the problem: instead of "minimum trials for n floors", ask "with k eggs and t trials, what is the MAXIMUM number of floors that can be definitively resolved?" — this direction has a much cleaner recurrence.',
      'Dropping one egg from some floor has exactly two outcomes: it breaks (now solving the sub-problem with k-1 eggs and t-1 remaining trials, covering floors BELOW), or it survives (now solving with the same k eggs and t-1 remaining trials, covering floors ABOVE) — plus the one floor tested itself.',
      'maxFloors(k, t) = 1 + maxFloors(k-1, t-1) + maxFloors(k, t-1). Find the smallest t such that maxFloors(k, t) >= n.',
    ],
    approach:
      "Solve the dual/reframed problem: maxFloors(eggs, trials) = the most floors that can be resolved using at most that many eggs and trials. Recurrence: maxFloors(e, t) = 1 + maxFloors(e-1, t-1) + maxFloors(e, t-1) (the tested floor itself, plus floors resolvable below if it breaks, plus floors resolvable above if it survives), with maxFloors(0, t) = 0 and maxFloors(e, 0) = 0 as base cases. Increase t from 0 upward until maxFloors(k, t) >= n; that t is the answer.",
    approachHi:
      "Dual/reframed problem solve karo: maxFloors(eggs, trials) = at most utne eggs aur trials use karke resolve ho sakne wale sabse zyada floors. Recurrence: maxFloors(e, t) = 1 + maxFloors(e-1, t-1) + maxFloors(e, t-1) (khud tested floor, plus agar toota to neeche resolve hone wale floors, plus agar bacha to upar resolve hone wale floors), maxFloors(0, t) = 0 aur maxFloors(e, 0) = 0 base cases ke saath. t ko 0 se badhate jao jab tak maxFloors(k, t) >= n na ho jaaye; wahi t answer hai.",
    timeComplexity: 'O(k * sqrt(n)) trials needed in the worst case, each maxFloors(k, t) computed in O(k) via the previous trial\'s row',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      "The direct question ('minimum trials for n floors') has an awkward recurrence because the floor being tested at each step depends on how many floors remain, which is exactly the unknown being solved for. Flipping to 'given a trial budget, what's the most floors coverable' sidesteps that circularity completely: a single trial always has exactly two outcomes (break or survive), splitting the remaining problem into two smaller INDEPENDENT subproblems whose floor-coverage capacities simply ADD together (plus the one floor directly tested, which is resolved regardless of outcome) — this additive structure is clean regardless of which floor was chosen, so no search over floor choice is needed at all, only a search over the minimum number of trials t for which the maximum coverable floor count first reaches n.",
    solutionExplanationHi:
      "Direct sawaal ('n floors ke liye minimum trials') ka recurrence awkward hai kyunki har step par tested floor is baat par depend karta hai ki kitne floors bache hain, jo exactly wahi unknown hai jo solve kiya ja raha hai. 'Ek trial budget diya hai, sabse zyada kitne floors cover ho sakte hain' mein flip karna is circularity ko poori tarah bypass kar deta hai: ek single trial ke hamesha exactly do outcomes hote hain (toot jaana ya bach jaana), baaki problem ko do chhote INDEPENDENT subproblems mein split karte hue jinki floor-coverage capacities simply ADD hoti hain (plus wo ek directly tested floor, jo outcome chahe kuch bhi ho resolve ho jaata hai) — ye additive structure clean hai chahe koi bhi floor choose kiya ho, isliye floor choice par koi search chahiye hi nahi, sirf minimum number of trials t par search chahiye jispar maximum coverable floor count pehli baar n tak pahunche.",
    starter: starter(
      `const [k, n] = nums(0);

function eggDrop(k, n) {
  // return the minimum worst-case number of trials
  return 0;
}

console.log(eggDrop(k, n));`,
      `k, n = nums(0)

def egg_drop(k, n):
    # return the minimum worst-case number of trials
    return 0

print(egg_drop(k, n))`,
    ),
    solution: solution(
      `const [k, n] = nums(0);
function eggDrop(k, n) {
  let prevRow = new Array(k + 1).fill(0);
  let trials = 0;
  while (prevRow[k] < n) {
    trials++;
    const curRow = new Array(k + 1).fill(0);
    for (let e = 1; e <= k; e++) {
      curRow[e] = 1 + prevRow[e - 1] + prevRow[e];
    }
    prevRow = curRow;
  }
  return trials;
}
console.log(eggDrop(k, n));`,
      `k, n = nums(0)

def egg_drop(k, n):
    prev_row = [0] * (k + 1)
    trials = 0
    while prev_row[k] < n:
        trials += 1
        cur_row = [0] * (k + 1)
        for e in range(1, k + 1):
            cur_row[e] = 1 + prev_row[e - 1] + prev_row[e]
        prev_row = cur_row
    return trials

print(egg_drop(k, n))`,
    ),
    testCases: [
      sample('1 2', '2'),
      sample('2 6', '3'),
      sample('3 14', '4'),
      hidden('1 1', '1'),
      hidden('5 1', '1'),
      hidden('2 10', '4'),
    ],
  },
];
