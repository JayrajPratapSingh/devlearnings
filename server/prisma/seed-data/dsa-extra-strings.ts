import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Strings — expansion batch. Rounds out the Strings category beyond the
 * original three (Reverse String, Valid Anagram, Longest Common Prefix) with
 * palindrome variants, parsing (atoi, Roman numerals), and classic string
 * manipulation (compression, zigzag, multiply-as-strings).
 */
export const dsaExtraStrings: SeedProblem[] = [
  {
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Given a string, determine whether it is a palindrome after converting to lowercase and removing every non-alphanumeric character.\n\n**Input**\nOne line containing the string.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek string di hai. Lowercase karke aur har non-alphanumeric character hata kar, check karo ki ye palindrome hai ya nahi.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'A man, a plan, a canal: Panama', output: 'true' },
      { input: 'race a car', output: 'false' },
    ],
    constraints: ['1 <= length <= 2*10^5', 'Printable ASCII characters'],
    hints: [
      'Building a cleaned copy first is the simplest correct approach.',
      'Two pointers from both ends can skip non-alphanumeric characters on the fly without an extra copy.',
      'Compare characters case-insensitively.',
    ],
    approach:
      'Two pointers starting at both ends. Advance each pointer past any non-alphanumeric character, then compare the lowercase versions; mismatch means not a palindrome, and the pointers meeting means it is.',
    approachHi:
      'Dono ends se do pointers shuru karo. Har pointer ko non-alphanumeric characters se aage badhao, phir lowercase versions compare karo; mismatch ka matlab palindrome nahi, aur pointers milna palindrome hone ka.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Building a fully cleaned string first is easy to reason about but costs an extra O(n) buffer. The two-pointer version gets the same answer in one pass with O(1) space by simply skipping non-alphanumeric characters as it walks inward from both ends — the cleaning and the comparison happen in the same loop instead of two separate steps.',
    solutionExplanationHi:
      'Pehle poori cleaned string banana samajhne mein aasan hai par extra O(n) buffer lagta hai. Two-pointer version wahi jawab ek hi pass mein O(1) space mein deta hai — bas dono ends se andar aate hue non-alphanumeric characters skip karta jaata hai. Cleaning aur comparison ek hi loop mein ho jaate hain, alag steps mein nahi.',
    starter: starter(
      `const s = line(0);

function isPalindrome(s) {
  // your code here
}

console.log(isPalindrome(s));`,
      `s = line(0)

def is_palindrome(s):
    # your code here
    pass

print("true" if is_palindrome(s) else "false")`,
    ),
    solution: solution(
      `const s = line(0);
const isAlnum = (c) => /[a-z0-9]/i.test(c);
let i = 0, j = s.length - 1;
let ok = true;
while (i < j) {
  while (i < j && !isAlnum(s[i])) i++;
  while (i < j && !isAlnum(s[j])) j--;
  if (s[i].toLowerCase() !== s[j].toLowerCase()) { ok = false; break; }
  i++; j--;
}
console.log(ok);`,
      `s = line(0)
i, j = 0, len(s) - 1
ok = True
while i < j:
    while i < j and not s[i].isalnum():
        i += 1
    while i < j and not s[j].isalnum():
        j -= 1
    if s[i].lower() != s[j].lower():
        ok = False
        break
    i += 1
    j -= 1
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('A man, a plan, a canal: Panama', 'true'),
      sample('race a car', 'false'),
      hidden(' ', 'true'),
      hidden('0P', 'false'),
      hidden('Was it a car or a cat I saw?', 'true'),
      hidden('ab_a', 'true'),
    ],
  },

  {
    slug: 'reverse-words-in-a-string',
    title: 'Reverse Words in a String',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Reverse the order of the words in a string. Words are separated by one or more spaces; the output must have exactly one space between words and no leading or trailing spaces.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe words in reversed order, single-spaced.',
    descriptionHi:
      'String mein words ka order reverse karo. Words ek ya zyada spaces se separated hain; output mein words ke beech exactly ek space ho aur leading/trailing spaces na ho.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nWords reversed order mein, single space se separated.',
    examples: [
      { input: 'the sky is blue', output: 'blue is sky the' },
      { input: '  hello world  ', output: 'world hello' },
    ],
    constraints: ['1 <= length <= 10^4', 'At least one non-space character exists'],
    hints: [
      'Splitting on whitespace and filtering out empty pieces handles multiple/leading/trailing spaces at once.',
      'Most languages\' built-in whitespace-split already collapses runs of spaces.',
      'Reverse the resulting word list and join with a single space.',
    ],
    approach:
      'Split the string on runs of whitespace (which discards empty tokens from leading/trailing/multiple spaces), reverse the resulting list of words, and join with single spaces.',
    approachHi:
      'String ko whitespace ke runs par split karo (isse leading/trailing/multiple spaces ke empty tokens apne aap hat jaate hain), words ki list ko reverse karo, aur single space se join kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The messy part of this problem is entirely about whitespace normalization, not reversal — a regex/whitespace split that drops empty strings handles every edge case (leading spaces, trailing spaces, multiple spaces between words) in one step, leaving "reverse a list and join" as the only remaining, trivial part.',
    solutionExplanationHi:
      'Is problem ka messy hissa reversal nahi, whitespace normalization hai — ek regex/whitespace split jo empty strings drop kar de, har edge case (leading spaces, trailing spaces, beech mein multiple spaces) ek hi step mein handle kar deta hai. Baaki bacha "list reverse karke join karo" — wo trivial hai.',
    starter: starter(
      `const s = line(0);

function reverseWords(s) {
  // your code here
}

console.log(reverseWords(s));`,
      `s = line(0)

def reverse_words(s):
    # your code here
    pass

print(reverse_words(s))`,
    ),
    solution: solution(
      `const s = line(0);
console.log(s.trim().split(/\\s+/).reverse().join(' '));`,
      `s = line(0)
print(" ".join(s.split()[::-1]))`,
    ),
    testCases: [
      sample('the sky is blue', 'blue is sky the'),
      sample('  hello world  ', 'world hello'),
      hidden('a good   example', 'example good a'),
      hidden('single', 'single'),
      hidden('  multiple   spaces   here  ', 'here spaces multiple'),
      hidden('one two three four', 'four three two one'),
    ],
  },

  {
    slug: 'string-compression',
    title: 'String Compression',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Compress a string by replacing each run of consecutive identical characters with the character followed by the run length (omit the count when the run length is 1).\n\n**Input**\nOne line containing lowercase letters.\n\n**Output**\nThe compressed string.',
    descriptionHi:
      'String ko compress karo: har consecutive identical characters ke run ko us character aur uske length se replace karo (agar length 1 hai to count mat likho).\n\n**Input**\nEk line jisme lowercase letters hain.\n\n**Output**\nCompressed string.',
    examples: [
      { input: 'aabcccccaaa', output: 'a2bc5a3' },
      { input: 'abbbbbbbbbbbb', output: 'ab12' },
    ],
    constraints: ['1 <= length <= 2*10^4', 'Lowercase English letters only'],
    hints: [
      'Walk the string tracking the start of the current run of identical characters.',
      'When the run ends, append the character, and the run length only if it is greater than 1.',
      'Do not forget to flush the final run after the loop ends.',
    ],
    approach:
      'Single pass tracking a run start index. Whenever the next character differs from the current run\'s character, append the character and its run length (skipping the length if it was 1), then start a new run. Flush the final run after the loop.',
    approachHi:
      'Ek hi pass mein run start index track karo. Jab bhi agla character current run ke character se alag ho, character aur uska run length append karo (length agar 1 hai to skip karo), aur naya run shuru karo. Loop ke baad aakhri run flush karna mat bhoolo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) for the output',
    solutionExplanation:
      'A run of identical characters is fully described by two things — the character and how long the run is — so a single pass that only needs to notice *where a run ends* (the next character differs, or the string ends) is enough to emit both pieces. The only easy-to-miss detail is that the very last run never gets a "next different character" to trigger it, so it must be flushed explicitly after the loop.',
    solutionExplanationHi:
      'Identical characters ka ek run sirf do cheezon se poora describe hota hai — character aur uski length — isliye ek pass jo sirf ye dekhe ki *run kahan khatam hota hai* (agla character alag hai, ya string khatam ho gayi), dono cheezein nikaalne ke liye kaafi hai. Sirf ek cheez miss hoti hai: aakhri run ko trigger karne ke liye koi "agla alag character" nahi milta, isliye use loop ke baad explicitly flush karna padta hai.',
    starter: starter(
      `const s = line(0);

function compress(s) {
  // your code here
}

console.log(compress(s));`,
      `s = line(0)

def compress(s):
    # your code here
    pass

print(compress(s))`,
    ),
    solution: solution(
      `const s = line(0);
let out = '', i = 0;
while (i < s.length) {
  let j = i;
  while (j < s.length && s[j] === s[i]) j++;
  out += s[i] + (j - i > 1 ? String(j - i) : '');
  i = j;
}
console.log(out);`,
      `s = line(0)
out = []
i = 0
while i < len(s):
    j = i
    while j < len(s) and s[j] == s[i]:
        j += 1
    out.append(s[i] + (str(j - i) if j - i > 1 else ""))
    i = j
print("".join(out))`,
    ),
    testCases: [
      sample('aabcccccaaa', 'a2bc5a3'),
      sample('abbbbbbbbbbbb', 'ab12'),
      hidden('a', 'a'),
      hidden('abcd', 'abcd'),
      hidden('aabbcc', 'a2b2c2'),
      hidden('aaaaaaaaaa', 'a10'),
    ],
  },

  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Return the longest palindromic substring of `s`. If more than one has the maximum length, return the one found first when scanning centers left to right.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe longest palindromic substring.',
    descriptionHi:
      '`s` ka sabse lamba palindromic substring return karo. Agar ek se zyada same max length ke hain, to wo return karo jo centers ko left se right scan karne par pehle milta hai.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nSabse lamba palindromic substring.',
    examples: [
      { input: 'babad', output: 'bab' },
      { input: 'cbbd', output: 'bb' },
    ],
    constraints: ['1 <= length <= 1000'],
    hints: [
      'Checking every substring for being a palindrome is O(n^3) — too slow to be the main approach.',
      'A palindrome is symmetric around its center — there are 2n-1 possible centers (one per character, one per gap).',
      'Expand outward from each center while the two sides match; track the widest expansion seen.',
    ],
    approach:
      'Expand around center. For each of the 2n-1 centers (each character, and each gap between adjacent characters), expand outward while both sides match, and keep the widest palindrome found — updating only on a strictly longer one so the first-found tie wins.',
    approachHi:
      'Expand around center. 2n-1 possible centers (har character, aur har adjacent gap) mein se har ek se bahar expand karo jab tak dono side match karte hain, aur sabse lamba palindrome record karo — sirf strictly lamba milne par update karo taaki pehla-mila tie hi jeet jaaye.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1) extra (beyond the output)',
    solutionExplanation:
      'Every palindrome has a center of symmetry — either a single character (odd length) or a gap between two characters (even length) — so checking all O(n) possible centers and expanding each outward in O(n) time covers every possible palindrome in O(n^2) total, far better than checking all O(n^2) substrings for palindrome-ness individually (which itself costs O(n) per check).',
    solutionExplanationHi:
      'Har palindrome ka ek symmetry center hota hai — ya to ek akela character (odd length) ya do characters ke beech ka gap (even length) — isliye saare O(n) possible centers check karke har ek ko O(n) time mein expand karna, O(n^2) total mein har palindrome cover kar leta hai. Ye har O(n^2) substring ko alag se palindrome check karne (jisme khud O(n) lagta) se kaafi behtar hai.',
    starter: starter(
      `const s = line(0);

function longestPalindrome(s) {
  // your code here
}

console.log(longestPalindrome(s));`,
      `s = line(0)

def longest_palindrome(s):
    # your code here
    pass

print(longest_palindrome(s))`,
    ),
    solution: solution(
      `const s = line(0);
let start = 0, maxLen = 1;
function expand(l, r) {
  while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
  return [l + 1, r - l - 1];
}
for (let i = 0; i < s.length; i++) {
  for (const [l, len] of [expand(i, i), expand(i, i + 1)]) {
    if (len > maxLen) { maxLen = len; start = l; }
  }
}
console.log(s.slice(start, start + maxLen));`,
      `s = line(0)
start, max_len = 0, 1

def expand(l, r):
    while l >= 0 and r < len(s) and s[l] == s[r]:
        l -= 1
        r += 1
    return l + 1, r - l - 1

for i in range(len(s)):
    for l, ln in (expand(i, i), expand(i, i + 1)):
        if ln > max_len:
            max_len = ln
            start = l
print(s[start:start + max_len])`,
    ),
    testCases: [
      sample('babad', 'bab'),
      sample('cbbd', 'bb'),
      hidden('a', 'a'),
      hidden('ac', 'a'),
      hidden('racecar', 'racecar'),
      hidden('forgeeksskeegfor', 'geeksskeeg'),
    ],
  },

  {
    slug: 'palindromic-substrings-count',
    title: 'Palindromic Substrings',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Count how many substrings of `s` are palindromes. Substrings starting at different indices are counted separately even if they contain identical characters.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe count of palindromic substrings.',
    descriptionHi:
      '`s` ke kitne substrings palindrome hain, count karo. Alag-alag indices se shuru hone wale substrings alag se ginne hain, chahe unke characters same hi kyun na hon.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nPalindromic substrings ka count.',
    examples: [
      { input: 'abc', output: '3', explanation: '"a", "b", "c" — three single-character palindromes.' },
      { input: 'aaa', output: '6', explanation: '"a","a","a","aa","aa","aaa".' },
    ],
    constraints: ['1 <= length <= 1000'],
    hints: [
      'The same expand-around-center technique used for the longest palindromic substring applies here.',
      'Every successful expansion step represents one more palindromic substring, not just the final widest one.',
      'There are 2n-1 centers to expand from, same as before.',
    ],
    approach:
      'Expand around each of the 2n-1 centers (odd and even). Every time the expansion successfully matches a wider pair, that is one more palindrome to count — so increment the counter on every successful expansion step, not just at the end.',
    approachHi:
      '2n-1 centers (odd aur even) se expand karo. Jab bhi expansion ek wider pair match karta hai, wo ek aur palindrome hai — isliye counter ko har successful expansion step par badhao, sirf end mein nahi.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This reuses the exact center-expansion machinery from the longest-palindromic-substring problem, but the counting insight is that *every* successful expansion step — not just the final, widest one — corresponds to a distinct valid palindrome ending at that point, so summing up every successful step across every center gives the total count directly.',
    solutionExplanationHi:
      'Ye bilkul wahi center-expansion machinery use karta hai jo longest-palindromic-substring mein use hui thi, par yahan insight ye hai ki *har* successful expansion step — sirf aakhri, sabse wide wala nahi — ek distinct valid palindrome ko represent karta hai. Isliye har center ke har successful step ko jod dena hi total count deta hai.',
    starter: starter(
      `const s = line(0);

function countSubstrings(s) {
  // your code here
}

console.log(countSubstrings(s));`,
      `s = line(0)

def count_substrings(s):
    # your code here
    pass

print(count_substrings(s))`,
    ),
    solution: solution(
      `const s = line(0);
let count = 0;
function expand(l, r) {
  while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; }
}
for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
console.log(count);`,
      `s = line(0)
count = 0

def expand(l, r):
    global count
    while l >= 0 and r < len(s) and s[l] == s[r]:
        count += 1
        l -= 1
        r += 1

for i in range(len(s)):
    expand(i, i)
    expand(i, i + 1)
print(count)`,
    ),
    testCases: [
      sample('abc', '3'),
      sample('aaa', '6'),
      hidden('a', '1'),
      hidden('aa', '3'),
      hidden('abba', '6'),
      hidden('racecar', '10'),
    ],
  },

  {
    slug: 'isomorphic-strings',
    title: 'Isomorphic Strings',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Two strings of equal length are isomorphic if the characters of the first can be replaced (via a consistent one-to-one mapping) to get the second.\n\n**Input**\n- Line 1: string `s`\n- Line 2: string `t`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Equal length ki do strings isomorphic hain agar pehli ke characters ko ek consistent, one-to-one mapping se replace karke doosri banayi ja sake.\n\n**Input**\n- Line 1: string `s`\n- Line 2: string `t`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'egg\nadd', output: 'true' },
      { input: 'foo\nbar', output: 'false' },
    ],
    constraints: ['1 <= length <= 5*10^4', '`s` and `t` have equal length'],
    hints: [
      'The mapping must be one-to-one in both directions — two characters in `s` can never map to the same character in `t`.',
      'Maintain two maps, s->t and t->s, and check both stay consistent.',
      '"badc" vs "baba" fails because both b and a would need to map to the same target.',
    ],
    approach:
      'Two hash maps, one for `s -> t` and one for `t -> s`. Walk both strings together: if a mapping already exists for either character, it must match the current pairing; otherwise record the new mapping. Any contradiction means false.',
    approachHi:
      'Do hash maps: ek `s -> t` ke liye, ek `t -> s` ke liye. Dono strings ko saath walk karo: agar kisi character ka mapping pehle se hai to wo current pairing se match hona chahiye; nahi to naya mapping record karo. Koi bhi contradiction milte hi false.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'A one-directional map alone is not enough: mapping s->t could stay consistent while two different characters of s both collapse onto the same character of t, which breaks the "one-to-one" requirement in the other direction. Checking both `s->t` and `t->s` simultaneously is what catches that — a classic trap this problem is specifically designed to test.',
    solutionExplanationHi:
      'Sirf ek-direction ka map kaafi nahi: s->t consistent reh sakta hai jabki s ke do alag characters t ke ek hi character par collapse ho jaayein — jo "one-to-one" requirement ko doosri direction mein tod deta hai. `s->t` aur `t->s` dono ek saath check karna hi ye pakadta hai — ye ek classic trap hai jise ye problem specifically test karti hai.',
    starter: starter(
      `const s = line(0), t = line(1);

function isIsomorphic(s, t) {
  // your code here
}

console.log(isIsomorphic(s, t));`,
      `s, t = line(0), line(1)

def is_isomorphic(s, t):
    # your code here
    pass

print("true" if is_isomorphic(s, t) else "false")`,
    ),
    solution: solution(
      `const s = line(0), t = line(1);
const st = new Map(), ts = new Map();
let ok = true;
for (let i = 0; i < s.length; i++) {
  const a = s[i], b = t[i];
  if (st.has(a) && st.get(a) !== b) { ok = false; break; }
  if (ts.has(b) && ts.get(b) !== a) { ok = false; break; }
  st.set(a, b); ts.set(b, a);
}
console.log(ok);`,
      `s, t = line(0), line(1)
st, ts = {}, {}
ok = True
for a, b in zip(s, t):
    if st.get(a, b) != b or ts.get(b, a) != a:
        ok = False
        break
    st[a] = b
    ts[b] = a
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('egg\nadd', 'true'),
      sample('foo\nbar', 'false'),
      hidden('paper\ntitle', 'true'),
      hidden('badc\nbaba', 'false'),
      hidden('a\na', 'true'),
      hidden('ab\naa', 'false'),
    ],
  },

  {
    slug: 'word-pattern',
    title: 'Word Pattern',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Given a pattern of letters and a space-separated string of words, determine whether there is a one-to-one correspondence between letters of the pattern and words.\n\n**Input**\n- Line 1: `pattern`\n- Line 2: space-separated words\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek pattern (letters) aur space-separated words wali string di hai. Check karo ki pattern ke letters aur words ke beech ek-to-one correspondence hai ya nahi.\n\n**Input**\n- Line 1: `pattern`\n- Line 2: space-separated words\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'abba\ndog cat cat dog', output: 'true' },
      { input: 'abba\ndog cat cat fish', output: 'false' },
    ],
    constraints: ['1 <= pattern length <= 300', 'Words made of lowercase English letters'],
    hints: [
      'First check the word count matches the pattern length — a quick early exit.',
      'This is the same bijection idea as Isomorphic Strings, just mapping characters to whole words.',
      'Maintain both letter->word and word->letter maps to enforce the mapping is one-to-one.',
    ],
    approach:
      'If the word count does not equal the pattern length, it is false immediately. Otherwise, maintain two maps (letter -> word and word -> letter) while scanning both in lockstep, exactly like the isomorphic-strings bijection check.',
    approachHi:
      'Agar words ka count pattern ki length se match nahi karta to turant false. Warna, do maps rakho (letter -> word aur word -> letter) aur dono ko saath scan karo — bilkul isomorphic-strings wala bijection check.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'This is structurally identical to Isomorphic Strings — the only difference is that the "characters" on one side are whole words instead of single letters. Reusing the same two-map bijection check (one map per direction) after confirming the lengths match handles it with no new logic.',
    solutionExplanationHi:
      'Ye structurally Isomorphic Strings jaisa hi hai — bas ek side ke "characters" poore words hain, single letters nahi. Lengths match karne ki confirmation ke baad wahi do-map bijection check (har direction ke liye ek map) reuse karne se, bina kisi naye logic ke, kaam ho jaata hai.',
    starter: starter(
      `const pattern = line(0);
const w = words(1);

function wordPattern(pattern, w) {
  // your code here
}

console.log(wordPattern(pattern, w));`,
      `pattern = line(0)
w = words(1)

def word_pattern(pattern, w):
    # your code here
    pass

print("true" if word_pattern(pattern, w) else "false")`,
    ),
    solution: solution(
      `const pattern = line(0);
const w = words(1);
let ok = pattern.length === w.length;
if (ok) {
  const cw = new Map(), wc = new Map();
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i], word = w[i];
    if (cw.has(c) && cw.get(c) !== word) { ok = false; break; }
    if (wc.has(word) && wc.get(word) !== c) { ok = false; break; }
    cw.set(c, word); wc.set(word, c);
  }
}
console.log(ok);`,
      `pattern = line(0)
w = words(1)
ok = len(pattern) == len(w)
if ok:
    cw, wc = {}, {}
    for c, word in zip(pattern, w):
        if cw.get(c, word) != word or wc.get(word, c) != c:
            ok = False
            break
        cw[c] = word
        wc[word] = c
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('abba\ndog cat cat dog', 'true'),
      sample('abba\ndog cat cat fish', 'false'),
      hidden('aaaa\ndog cat cat dog', 'false'),
      hidden('abba\ndog dog dog dog', 'false'),
      hidden('a\ndog', 'true'),
      hidden('ab\ndog dog', 'false'),
    ],
  },

  {
    slug: 'roman-to-integer',
    title: 'Roman to Integer',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Convert a Roman numeral to an integer. Recall the subtractive cases: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.\n\n**Input**\nOne line containing the Roman numeral.\n\n**Output**\nThe integer value.',
    descriptionHi:
      'Ek Roman numeral ko integer mein convert karo. Subtractive cases yaad rakho: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.\n\n**Input**\nEk line jisme Roman numeral hai.\n\n**Output**\nInteger value.',
    examples: [
      { input: 'III', output: '3' },
      { input: 'MCMXCIV', output: '1994' },
    ],
    constraints: ['1 <= length <= 15', 'Valid Roman numeral in the range 1 to 3999'],
    hints: [
      'Map each symbol to its value: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.',
      'Normally you add symbol values left to right.',
      'A symbol smaller than the one immediately after it (like I before V) means it should be subtracted instead.',
    ],
    approach:
      'Scan left to right, adding each symbol\'s value, except when a symbol is smaller than the one right after it — in that case subtract it instead of adding it (this is what "IV" and similar subtractive pairs mean).',
    approachHi:
      'Left se right scan karo, har symbol ki value add karte jao — sivaay tab jab koi symbol apne turant baad wale symbol se chhota ho, tab use add karne ke bajaye subtract karo (yahi "IV" jaise subtractive pairs ka matlab hai).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Roman numerals are almost purely additive; the only wrinkle is the six subtractive pairs, and all six share one detectable pattern: a smaller-value symbol immediately followed by a larger one. Checking that local comparison at each position — rather than hardcoding the six pairs as strings — lets a single left-to-right pass handle every case uniformly.',
    solutionExplanationHi:
      'Roman numerals lagbhag purely additive hote hain; sirf chhah subtractive pairs alag hain, aur un sabme ek hi pattern hai: ek chhota-value symbol turant ek bade symbol se pehle aata hai. Har position par ye local comparison check karna — chhah pairs ko strings ki tarah hardcode karne ke bajaye — ek hi left-to-right pass mein sab cases uniformly handle kar deta hai.',
    starter: starter(
      `const s = line(0);

function romanToInt(s) {
  // your code here
}

console.log(romanToInt(s));`,
      `s = line(0)

def roman_to_int(s):
    # your code here
    pass

print(roman_to_int(s))`,
    ),
    solution: solution(
      `const s = line(0);
const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
let total = 0;
for (let i = 0; i < s.length; i++) {
  const cur = val[s[i]], next = val[s[i + 1]] ?? 0;
  total += cur < next ? -cur : cur;
}
console.log(total);`,
      `s = line(0)
val = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
total = 0
for i, ch in enumerate(s):
    cur = val[ch]
    nxt = val[s[i + 1]] if i + 1 < len(s) else 0
    total += -cur if cur < nxt else cur
print(total)`,
    ),
    testCases: [
      sample('III', '3'),
      sample('MCMXCIV', '1994'),
      hidden('LVIII', '58'),
      hidden('IV', '4'),
      hidden('IX', '9'),
      hidden('MMXXIV', '2024'),
    ],
  },

  {
    slug: 'integer-to-roman',
    title: 'Integer to Roman',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Convert an integer in the range 1 to 3999 into a Roman numeral.\n\n**Input**\nOne line containing the integer.\n\n**Output**\nThe Roman numeral.',
    descriptionHi:
      '1 se 3999 ke beech ka ek integer diya hai, use Roman numeral mein convert karo.\n\n**Input**\nEk line jisme integer hai.\n\n**Output**\nRoman numeral.',
    examples: [
      { input: '3', output: 'III' },
      { input: '1994', output: 'MCMXCIV' },
    ],
    constraints: ['1 <= num <= 3999'],
    hints: [
      'List every value/symbol pair from largest to smallest, including the six subtractive combos (900 -> CM, 400 -> CD, and so on).',
      'Greedily subtract the largest value that still fits, appending its symbol each time.',
      'Including the subtractive pairs directly in the value table avoids special-casing them.',
    ],
    approach:
      'Greedy with a table of (value, symbol) pairs from 1000 down to 1, including the six subtractive forms (900/CM, 400/CD, 90/XC, 40/XL, 9/IX, 4/IV). Repeatedly append the symbol and subtract the value for as long as it fits, then move to the next smaller pair.',
    approachHi:
      'Greedy, (value, symbol) pairs ki table 1000 se 1 tak, chhah subtractive forms (900/CM, 400/CD, 90/XC, 40/XL, 9/IX, 4/IV) samet. Jab tak value fit hoti hai, symbol append karke value subtract karte jao, phir agle chhote pair par jao.',
    timeComplexity: 'O(1) — bounded by a fixed table of 13 entries',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'By pre-computing the subtractive pairs (like 900 -> "CM") as ordinary entries in the value table, the greedy "take the biggest symbol that still fits" rule handles them automatically — no special-case code is needed to detect "this digit is 9" versus "this digit is 4", because the table already encodes exactly which numeral to use at each threshold.',
    solutionExplanationHi:
      'Subtractive pairs (jaise 900 -> "CM") ko value table mein normal entries ki tarah pehle se rakh dene se, greedy "jo sabse bada symbol fit ho use lo" rule khud hi unhe handle kar leta hai — "ye digit 9 hai" ya "4 hai" detect karne ke liye alag se code ki zaroorat nahi, kyunki table mein pehle se hi likha hai ki har threshold par kaunsa numeral use karna hai.',
    starter: starter(
      `const n = num(0);

function intToRoman(n) {
  // your code here
}

console.log(intToRoman(n));`,
      `n = num(0)

def int_to_roman(n):
    # your code here
    pass

print(int_to_roman(n))`,
    ),
    solution: solution(
      `let n = num(0);
const table = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
let out = '';
for (const [v, sym] of table) { while (n >= v) { out += sym; n -= v; } }
console.log(out);`,
      `n = num(0)
table = [(1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),(100,"C"),(90,"XC"),(50,"L"),(40,"XL"),(10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")]
out = []
for v, sym in table:
    while n >= v:
        out.append(sym)
        n -= v
print("".join(out))`,
    ),
    testCases: [
      sample('3', 'III'),
      sample('1994', 'MCMXCIV'),
      hidden('58', 'LVIII'),
      hidden('4', 'IV'),
      hidden('9', 'IX'),
      hidden('3999', 'MMMCMXCIX'),
    ],
  },

  {
    slug: 'zigzag-conversion',
    title: 'Zigzag Conversion',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Write the string in a zigzag pattern across `numRows` rows (down, then diagonally up, repeating), then read the rows back left to right, top to bottom.\n\n**Input**\n- Line 1: the string\n- Line 2: `numRows`\n\n**Output**\nThe zigzag-read string.',
    descriptionHi:
      'String ko `numRows` rows mein zigzag pattern mein likho (neeche, phir diagonally upar, repeat), phir rows ko left-to-right, top-to-bottom padho.\n\n**Input**\n- Line 1: string\n- Line 2: `numRows`\n\n**Output**\nZigzag-read string.',
    examples: [
      { input: 'PAYPALISHIRING\n3', output: 'PAHNAPLSIIGYIR' },
      { input: 'PAYPALISHIRING\n4', output: 'PINALSIGYAHRPI' },
    ],
    constraints: ['1 <= length <= 1000', '1 <= numRows <= 1000'],
    hints: [
      'With numRows = 1, the zigzag has no effect — the answer is the input unchanged.',
      'Simulate the zigzag directly: maintain a current row and a direction (down or up), moving one row per character.',
      'Bounce the direction at row 0 and at row numRows-1.',
    ],
    approach:
      'Simulate: keep `numRows` string buffers, a current row index, and a direction. For each character, append it to the current row\'s buffer, then move the row index by the direction, flipping direction whenever it hits row 0 or row numRows-1. Concatenate all buffers at the end.',
    approachHi:
      'Simulate karo: `numRows` string buffers, ek current row index, aur ek direction rakho. Har character ko current row ke buffer mein daalo, phir row index ko direction ke hisaab se move karo, aur row 0 ya row numRows-1 par pahunchte hi direction flip kar do. Aakhir mein saare buffers concatenate kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Rather than computing a closed-form index formula for where each character lands, directly simulating the pen tracing the zigzag — one row-buffer per line, one step down or up per character, bouncing off the top and bottom rows — is simpler to get right and just as fast, and naturally handles the numRows=1 edge case (the direction never needs to bounce, so it just appends everything to the single row).',
    solutionExplanationHi:
      'Har character kahan padega uske liye closed-form index formula banane ke bajaye, seedha pen ki zigzag tracing simulate karna — har line ke liye ek row-buffer, har character par ek step neeche ya upar, top-bottom rows par bounce — sahi karna aasan hai aur utna hi fast bhi. Ye numRows=1 edge case ko bhi naturally handle kar leta hai (direction kabhi bounce nahi karta, bas sab kuch ek hi row mein chala jaata hai).',
    starter: starter(
      `const s = line(0), numRows = num(1);

function convert(s, numRows) {
  // your code here
}

console.log(convert(s, numRows));`,
      `s, num_rows = line(0), num(1)

def convert(s, num_rows):
    # your code here
    pass

print(convert(s, num_rows))`,
    ),
    solution: solution(
      `const s = line(0), numRows = num(1);
if (numRows === 1) { console.log(s); }
else {
  const rows = Array.from({ length: numRows }, () => '');
  let row = 0, dir = 1;
  for (const c of s) {
    rows[row] += c;
    if (row === 0) dir = 1; else if (row === numRows - 1) dir = -1;
    row += dir;
  }
  console.log(rows.join(''));
}`,
      `s, num_rows = line(0), num(1)
if num_rows == 1:
    print(s)
else:
    rows = [""] * num_rows
    row, direction = 0, 1
    for c in s:
        rows[row] += c
        if row == 0:
            direction = 1
        elif row == num_rows - 1:
            direction = -1
        row += direction
    print("".join(rows))`,
    ),
    testCases: [
      sample('PAYPALISHIRING\n3', 'PAHNAPLSIIGYIR'),
      sample('PAYPALISHIRING\n4', 'PINALSIGYAHRPI'),
      hidden('A\n1', 'A'),
      hidden('AB\n1', 'AB'),
      hidden('ABC\n2', 'ACB'),
      hidden('ABCDE\n4', 'ABCED'),
    ],
  },

  {
    slug: 'count-and-say',
    title: 'Count and Say',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'The count-and-say sequence starts with "1"; each subsequent term describes the previous term by run-length: `countAndSay(1) = "1"`, `countAndSay(2) = "11"` (one 1), `countAndSay(3) = "21"` (two 1s), `countAndSay(4) = "1211"` (one 2, one 1). Given `n`, return the `n`-th term.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe `n`-th term.',
    descriptionHi:
      'Count-and-say sequence "1" se shuru hoti hai; har agla term pichle term ko run-length se describe karta hai: `countAndSay(1) = "1"`, `countAndSay(2) = "11"` (ek 1), `countAndSay(3) = "21"` (do 1), `countAndSay(4) = "1211"` (ek 2, ek 1). `n` diya hai, `n`-vaan term return karo.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\n`n`-vaan term.',
    examples: [
      { input: '4', output: '1211' },
      { input: '1', output: '1' },
    ],
    constraints: ['1 <= n <= 30'],
    hints: [
      'Each term is built entirely from the previous one — there is no shortcut formula.',
      'To build the next term, run-length encode the current one: for each run of identical digits, emit the count then the digit.',
      'Iterate this run-length encoding `n - 1` times starting from "1".',
    ],
    approach:
      'Start with "1" and apply run-length encoding `n - 1` times: for each run of identical consecutive digits in the current term, append the run\'s length followed by the digit itself to build the next term.',
    approachHi:
      '"1" se shuru karo aur run-length encoding `n - 1` baar apply karo: current term mein har consecutive identical digits ke run ke liye, uski length aur khud digit ko agle term mein append karo.',
    timeComplexity: 'O(n * L) where L is the length of the longest term generated',
    spaceComplexity: 'O(L)',
    solutionExplanation:
      'The sequence is defined recursively with no closed form — each term is literally "read the previous term out loud, run by run" — so the only correct approach is to actually build every intermediate term, applying the same run-length-encoding step n-1 times starting from "1".',
    solutionExplanationHi:
      'Ye sequence recursively defined hai, koi closed form nahi hai — har term literally "pichle term ko zor se padho, run-by-run" hi hai — isliye sahi approach yahi hai ki har intermediate term actually banao, "1" se shuru karke wahi run-length-encoding step n-1 baar apply karte hue.',
    starter: starter(
      `const n = num(0);

function countAndSay(n) {
  // your code here
}

console.log(countAndSay(n));`,
      `n = num(0)

def count_and_say(n):
    # your code here
    pass

print(count_and_say(n))`,
    ),
    solution: solution(
      `let s = '1';
const n = num(0);
for (let k = 1; k < n; k++) {
  let out = '', i = 0;
  while (i < s.length) {
    let j = i;
    while (j < s.length && s[j] === s[i]) j++;
    out += (j - i) + s[i];
    i = j;
  }
  s = out;
}
console.log(s);`,
      `s = "1"
n = num(0)
for _ in range(n - 1):
    out = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]:
            j += 1
        out.append(str(j - i) + s[i])
        i = j
    s = "".join(out)
print(s)`,
    ),
    testCases: [
      sample('4', '1211'),
      sample('1', '1'),
      hidden('2', '11'),
      hidden('3', '21'),
      hidden('5', '111221'),
      hidden('6', '312211'),
    ],
  },

  {
    slug: 'multiply-strings',
    title: 'Multiply Strings',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Given two non-negative integers represented as strings, return their product, also as a string (no leading zeros unless the result is "0"), without converting the entire inputs to native integers.\n\n**Input**\n- Line 1: `num1`\n- Line 2: `num2`\n\n**Output**\nThe product as a string.',
    descriptionHi:
      'Do non-negative integers strings ke roop mein diye hain. Unka product bhi string ke roop mein return karo (leading zeros na ho, jab tak result "0" na ho) — poore inputs ko native integer mein convert kiye bina.\n\n**Input**\n- Line 1: `num1`\n- Line 2: `num2`\n\n**Output**\nProduct, string ke roop mein.',
    examples: [
      { input: '2\n3', output: '6' },
      { input: '123\n456', output: '56088' },
    ],
    constraints: ['1 <= length of num1, num2 <= 200', 'Digits only, no leading zeros unless the number is "0" itself'],
    hints: [
      'This is grade-school long multiplication, done digit by digit.',
      'Multiplying digit `i` of num1 (from the right) with digit `j` of num2 contributes to result position `i + j` (and its carry to `i + j - 1`).',
      'A result array of size `len(num1) + len(num2)` is always big enough to hold every partial product and carry.',
    ],
    approach:
      'Simulate long multiplication in a result array of size `m + n`. For every pair of digits `num1[i] * num2[j]` (indexed from the right), add the product into `result[i + j + 1]`, propagate any overflow into `result[i + j]`, then strip leading zeros from the final digit array.',
    approachHi:
      'Long multiplication ko `m + n` size ke result array mein simulate karo. Har digit pair `num1[i] * num2[j]` (right se indexed) ke liye, product ko `result[i + j + 1]` mein add karo, overflow ko `result[i + j]` mein le jao, aur aakhir mein leading zeros hata do.',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m + n)',
    solutionExplanation:
      'This is exactly the multiplication algorithm taught on paper, just made precise: multiplying digit at position i (from the right, 0-indexed) of one number by digit at position j of the other always lands in result position i+j (with any carry bumping into i+j-1), because that is precisely where those place values combine. A fixed-size result array sized m+n is provably always large enough, since the product of two numbers with m and n digits never exceeds m+n digits.',
    solutionExplanationHi:
      'Ye bilkul wahi multiplication algorithm hai jo paper par sikhaya jaata hai, bas precise bana diya gaya hai: ek number ke position i (right se, 0-indexed) wale digit ko doosre ke position j wale digit se multiply karne par result hamesha position i+j mein jaata hai (aur carry i+j-1 mein), kyunki wahi in place-values ka sahi milan-bindu hai. m+n size ka fixed result array provably hamesha kaafi hota hai, kyunki m aur n digits wale do numbers ka product kabhi m+n digits se zyada nahi ho sakta.',
    starter: starter(
      `const a = line(0), b = line(1);

function multiply(a, b) {
  // your code here
}

console.log(multiply(a, b));`,
      `a, b = line(0), line(1)

def multiply(a, b):
    # your code here
    pass

print(multiply(a, b))`,
    ),
    solution: solution(
      `const a = line(0), b = line(1);
if (a === '0' || b === '0') { console.log('0'); }
else {
  const m = a.length, n = b.length;
  const res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (a.charCodeAt(i) - 48) * (b.charCodeAt(j) - 48);
      const p1 = i + j, p2 = i + j + 1;
      const sum = mul + res[p2];
      res[p2] = sum % 10;
      res[p1] += Math.floor(sum / 10);
    }
  }
  let out = res.join('').replace(/^0+/, '');
  console.log(out === '' ? '0' : out);
}`,
      `a, b = line(0), line(1)
if a == "0" or b == "0":
    print("0")
else:
    m, n = len(a), len(b)
    res = [0] * (m + n)
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = (ord(a[i]) - 48) * (ord(b[j]) - 48)
            p1, p2 = i + j, i + j + 1
            total = mul + res[p2]
            res[p2] = total % 10
            res[p1] += total // 10
    out = "".join(map(str, res)).lstrip("0")
    print(out if out else "0")`,
    ),
    testCases: [
      sample('2\n3', '6'),
      sample('123\n456', '56088'),
      hidden('0\n52', '0'),
      hidden('99\n99', '9801'),
      hidden('1\n1', '1'),
      hidden('999\n999', '998001'),
    ],
  },

  {
    slug: 'add-binary',
    title: 'Add Binary',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Given two binary strings, return their sum, also as a binary string.\n\n**Input**\n- Line 1: `a`\n- Line 2: `b`\n\n**Output**\nThe sum, as a binary string.',
    descriptionHi:
      'Do binary strings di hain. Unka sum bhi ek binary string ke roop mein return karo.\n\n**Input**\n- Line 1: `a`\n- Line 2: `b`\n\n**Output**\nSum, binary string ke roop mein.',
    examples: [
      { input: '11\n1', output: '100' },
      { input: '1010\n1011', output: '10101' },
    ],
    constraints: ['1 <= length <= 10^4', 'Each string contains only "0" and "1"'],
    hints: [
      'This is the same grade-school addition algorithm as decimal, but base 2.',
      'Walk both strings from the right, adding corresponding bits plus a running carry.',
      'A final leftover carry after the longer string is exhausted needs one more leading digit.',
    ],
    approach:
      'Walk both strings from the last character backward, maintaining a carry. At each position, sum the two bits (treating a missing bit as 0) plus the carry, emit `sum % 2`, and carry `floor(sum / 2)` into the next position. Any carry left after both strings are exhausted becomes a new leading digit.',
    approachHi:
      'Dono strings ko last character se peeche ki taraf walk karo, ek carry maintain karte hue. Har position par dono bits (missing bit ko 0 maano) aur carry ka sum lo, `sum % 2` emit karo, aur `floor(sum / 2)` agli position mein carry karo. Dono strings khatam hone ke baad bhi agar carry bacha hai to wo naya leading digit ban jaata hai.',
    timeComplexity: 'O(max(m, n))',
    spaceComplexity: 'O(max(m, n))',
    solutionExplanation:
      'Binary addition follows the exact same digit-by-digit, right-to-left, carry-propagating procedure as decimal addition — the only difference is that a sum of 2 (not 10) triggers a carry. Padding the shorter string conceptually with leading zeros (by just treating an out-of-range index as bit 0) means both strings can be walked in lockstep without a special case for unequal lengths.',
    solutionExplanationHi:
      'Binary addition bhi decimal addition jaisa hi digit-by-digit, right-to-left, carry-propagating process hai — bas fark itna hai ki sum 2 (10 nahi) hone par carry trigger hota hai. Chhoti string ko conceptually leading zeros se pad karna (out-of-range index ko bit 0 maan kar) matlab dono strings ko bina kisi special case ke saath-saath walk kiya ja sakta hai.',
    starter: starter(
      `const a = line(0), b = line(1);

function addBinary(a, b) {
  // your code here
}

console.log(addBinary(a, b));`,
      `a, b = line(0), line(1)

def add_binary(a, b):
    # your code here
    pass

print(add_binary(a, b))`,
    ),
    solution: solution(
      `const a = line(0), b = line(1);
let i = a.length - 1, j = b.length - 1, carry = 0, out = '';
while (i >= 0 || j >= 0 || carry) {
  const sum = (i >= 0 ? a.charCodeAt(i--) - 48 : 0) + (j >= 0 ? b.charCodeAt(j--) - 48 : 0) + carry;
  out = (sum % 2) + out;
  carry = Math.floor(sum / 2);
}
console.log(out);`,
      `a, b = line(0), line(1)
i, j, carry, out = len(a) - 1, len(b) - 1, 0, []
while i >= 0 or j >= 0 or carry:
    total = carry
    if i >= 0:
        total += int(a[i]); i -= 1
    if j >= 0:
        total += int(b[j]); j -= 1
    out.append(str(total % 2))
    carry = total // 2
print("".join(reversed(out)))`,
    ),
    testCases: [
      sample('11\n1', '100'),
      sample('1010\n1011', '10101'),
      hidden('0\n0', '0'),
      hidden('1\n1', '10'),
      hidden('1111\n1111', '11110'),
      hidden('100\n110010', '110110'),
    ],
  },

  {
    slug: 'longest-palindrome-from-letters',
    title: 'Longest Palindrome From Letters',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Given a string of letters, you may rearrange and drop characters. Return the length of the longest palindrome that can be built from a subset of its characters. Comparisons are case-sensitive.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe length of the longest buildable palindrome.',
    descriptionHi:
      'Ek string di hai. Characters ko rearrange aur kuch drop bhi kar sakte ho. Uske kisi subset se bane sabse lambe palindrome ki length return karo. Case-sensitive comparison hai.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nSabse lambe buildable palindrome ki length.',
    examples: [
      { input: 'abccccdd', output: '7', explanation: 'e.g. "dccaccd" — 7 characters.' },
      { input: 'a', output: '1' },
    ],
    constraints: ['1 <= length <= 2000'],
    hints: [
      'A palindrome needs every character to appear an even number of times, except possibly one character in the very center.',
      'Count the frequency of each character.',
      'Every character contributes its largest even part; at most one leftover odd character can be placed in the center.',
    ],
    approach:
      'Count character frequencies. For each character, add its frequency rounded down to the nearest even number. If any character had an odd frequency, one extra slot is available for a single center character.',
    approachHi:
      'Character frequencies count karo. Har character ke liye, uski frequency ko sabse nazdeek even number tak round-down karke add karo. Agar kisi character ki frequency odd thi, to ek extra slot center character ke liye available hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) for a fixed alphabet',
    solutionExplanation:
      'A palindrome mirrors around its center, so every character used away from the center must come in a matching pair — meaning only the even part of each character\'s count can be used symmetrically. The one exception is the single center slot, which can absorb exactly one leftover character with an odd count, regardless of how many different characters have odd counts.',
    solutionExplanationHi:
      'Palindrome apne center ke around mirror hota hai, isliye center se door use hone wala har character ek matching pair mein aana chahiye — matlab har character ke count ka sirf even hissa hi symmetrically use ho sakta hai. Ek exception hai: center ka ek slot, jo kisi bhi ek odd-count wale character ko le sakta hai, chahe kitne bhi alag characters ka count odd kyun na ho.',
    starter: starter(
      `const s = line(0);

function longestPalindrome(s) {
  // your code here
}

console.log(longestPalindrome(s));`,
      `s = line(0)

def longest_palindrome(s):
    # your code here
    pass

print(longest_palindrome(s))`,
    ),
    solution: solution(
      `const s = line(0);
const count = new Map();
for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);
let total = 0, hasOdd = false;
for (const v of count.values()) { total += v - (v % 2); if (v % 2 === 1) hasOdd = true; }
console.log(total + (hasOdd ? 1 : 0));`,
      `s = line(0)
from collections import Counter
count = Counter(s)
total = sum(v - (v % 2) for v in count.values())
has_odd = any(v % 2 == 1 for v in count.values())
print(total + (1 if has_odd else 0))`,
    ),
    testCases: [
      sample('abccccdd', '7'),
      sample('a', '1'),
      hidden('bb', '2'),
      hidden('abc', '1'),
      hidden('aabbcc', '6'),
      hidden('Aa', '1'),
    ],
  },

  {
    slug: 'repeated-substring-pattern',
    title: 'Repeated Substring Pattern',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Determine whether the string can be formed by concatenating a substring of itself two or more times.\n\n**Input**\nOne line containing the string.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki string, apne hi kisi substring ko do ya zyada baar repeat karke ban sakti hai ya nahi.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'abab', output: 'true', explanation: '"ab" repeated twice.' },
      { input: 'aba', output: 'false' },
    ],
    constraints: ['1 <= length <= 10^4', 'Lowercase English letters'],
    hints: [
      'Any valid repeating unit\'s length must evenly divide the total length.',
      'A slick trick: concatenate the string with itself, strip the first and last characters, and check if the original string appears inside.',
      'That trick works because a genuine repetition survives the strip; a non-repeating string cannot reappear early enough.',
    ],
    approach:
      'Concatenate `s + s`, remove its first and last characters, and check whether `s` occurs anywhere inside the result — a classic O(n) trick (using a linear substring search) instead of trying every possible divisor length.',
    approachHi:
      '`s + s` banao, uska pehla aur aakhri character hata do, aur check karo ki `s` uske andar kahin milta hai ya nahi — ek classic O(n) trick (linear substring search se), har possible divisor length try karne ke bajaye.',
    timeComplexity: 'O(n) with a linear-time substring search',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'If `s` truly is `k` copies of some block `p` back to back, then `s+s` is `2k` copies of `p`, and removing just one character off each end still leaves at least one full, aligned copy of `s` sitting strictly inside the middle — because the removed characters can only ever eat into the first and last (partial, boundary) copies, never a fully interior one. Conversely, if `s` is not built from repetition, no shifted copy of it can coincidentally reappear inside `s+s` after trimming, so the check is exact in both directions.',
    solutionExplanationHi:
      'Agar `s` sach mein kisi block `p` ki `k` copies hai, to `s+s`, `p` ki `2k` copies hai, aur sirf ek-ek character dono ends se hatane par bhi beech mein `s` ki kam se kam ek poori, aligned copy bach jaati hai — kyunki hataye gaye characters sirf pehli aur aakhri (partial, boundary) copies ko hi kha sakte hain, kisi poori interior copy ko nahi. Ulta, agar `s` repetition se nahi bani, to uski koi shifted copy `s+s` (trim karne ke baad) ke andar coincidentally nahi aa sakti — isliye ye check dono directions mein exact hai.',
    starter: starter(
      `const s = line(0);

function repeatedSubstringPattern(s) {
  // your code here
}

console.log(repeatedSubstringPattern(s));`,
      `s = line(0)

def repeated_substring_pattern(s):
    # your code here
    pass

print("true" if repeated_substring_pattern(s) else "false")`,
    ),
    solution: solution(
      `const s = line(0);
const doubled = (s + s).slice(1, -1);
console.log(doubled.includes(s));`,
      `s = line(0)
doubled = (s + s)[1:-1]
print("true" if s in doubled else "false")`,
    ),
    testCases: [
      sample('abab', 'true'),
      sample('aba', 'false'),
      hidden('abcabcabcabc', 'true'),
      hidden('a', 'false'),
      hidden('aa', 'true'),
      hidden('abac', 'false'),
    ],
  },

  {
    slug: 'string-to-integer-atoi',
    title: 'String to Integer (atoi)',
    category: 'Strings',
    difficulty: 'MEDIUM',
    description:
      'Implement `atoi`: skip leading whitespace, read an optional `+`/`-` sign, then read digits until a non-digit appears. Clamp the result to the 32-bit signed integer range `[-2147483648, 2147483647]`. Return 0 if no valid conversion could be performed.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe parsed, clamped integer.',
    descriptionHi:
      '`atoi` implement karo: leading whitespace skip karo, optional `+`/`-` sign padho, phir digits tab tak padho jab tak non-digit na aaye. Result ko 32-bit signed integer range `[-2147483648, 2147483647]` mein clamp karo. Agar valid conversion na ho to 0 return karo.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nParsed, clamped integer.',
    examples: [
      { input: '42', output: '42' },
      { input: '   -42', output: '-42' },
    ],
    constraints: ['0 <= length <= 200'],
    hints: [
      'Process the string in this exact order: whitespace, then sign, then digits.',
      'Stop reading digits the moment a non-digit character appears — do not look further.',
      'Clamp to the 32-bit signed range only at the very end, after the full digit run is read.',
    ],
    approach:
      'Walk the string once: skip leading spaces, read an optional single sign character, then greedily consume digits into a number. If no digits were found, the result is 0. Finally clamp the parsed value into `[-2^31, 2^31 - 1]`.',
    approachHi:
      'String ko ek baar walk karo: leading spaces skip karo, ek optional sign character padho, phir digits ko greedily ek number mein consume karo. Agar koi digit nahi mila to result 0 hai. Aakhir mein parsed value ko `[-2^31, 2^31 - 1]` mein clamp kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The specification is really a strict state machine — whitespace, then an optional sign, then digits, then stop at the first non-digit — and implementing exactly that order (rather than reaching for a regex or the language\'s own permissive number parser) is what avoids accepting malformed input like "4193 with words" partially-correctly or over-correctly. Clamping happens only once, at the end, so intermediate overflow during accumulation must be watched or use a wide-enough numeric type.',
    solutionExplanationHi:
      'Ye specification asal mein ek strict state machine hai — whitespace, phir optional sign, phir digits, phir pehle non-digit par ruk jao — aur exactly isi order ko implement karna (regex ya language ke apne permissive number parser ke bajaye) hi "4193 with words" jaise malformed input ko sahi tarah handle karta hai. Clamping sirf ek baar, end mein hoti hai, isliye accumulation ke dauraan intermediate overflow ka dhyan rakhna ya kaafi bada numeric type use karna zaroori hai.',
    starter: starter(
      `const s = line(0);

function myAtoi(s) {
  // your code here
}

console.log(myAtoi(s));`,
      `s = line(0)

def my_atoi(s):
    # your code here
    pass

print(my_atoi(s))`,
    ),
    solution: solution(
      `const s = line(0);
let i = 0;
while (i < s.length && s[i] === ' ') i++;
let sign = 1;
if (s[i] === '+' || s[i] === '-') { if (s[i] === '-') sign = -1; i++; }
let numStr = '';
while (i < s.length && s[i] >= '0' && s[i] <= '9') { numStr += s[i]; i++; }
let val = sign * (numStr === '' ? 0 : parseInt(numStr, 10));
const INT_MAX = 2147483647, INT_MIN = -2147483648;
if (val > INT_MAX) val = INT_MAX;
if (val < INT_MIN) val = INT_MIN;
console.log(val);`,
      `s = line(0)
i, n = 0, len(s)
while i < n and s[i] == ' ':
    i += 1
sign = 1
if i < n and s[i] in "+-":
    if s[i] == "-":
        sign = -1
    i += 1
digits = ""
while i < n and s[i].isdigit():
    digits += s[i]
    i += 1
val = sign * (int(digits) if digits else 0)
INT_MAX, INT_MIN = 2147483647, -2147483648
val = max(INT_MIN, min(INT_MAX, val))
print(val)`,
    ),
    testCases: [
      sample('42', '42'),
      sample('   -42', '-42'),
      hidden('4193 with words', '4193'),
      hidden('words and 987', '0'),
      hidden('-91283472332', '-2147483648'),
      hidden('   +007', '7'),
    ],
  },

  {
    slug: 'reverse-vowels-of-a-string',
    title: 'Reverse Vowels of a String',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Reverse only the vowels of a string, leaving all other characters in their original positions. Treat `a, e, i, o, u` and their uppercase forms as vowels.\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe string with vowels reversed.',
    descriptionHi:
      'String ke sirf vowels ko reverse karo, baaki characters apni original position par rehne do. `a, e, i, o, u` aur unke uppercase forms ko vowels maano.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nString, vowels reversed ke saath.',
    examples: [
      { input: 'hello', output: 'holle' },
      { input: 'leetcode', output: 'leotcede' },
    ],
    constraints: ['1 <= length <= 3*10^5'],
    hints: [
      'Non-vowel characters never move — only the vowels swap positions with each other.',
      'Two pointers from both ends, each skipping past consonants.',
      'When both pointers land on vowels, swap them and move both inward.',
    ],
    approach:
      'Two pointers from both ends of a mutable character array. Advance each pointer until it lands on a vowel, then swap the two vowels found and move both pointers inward; continue until they cross.',
    approachHi:
      'Ek mutable character array ke dono ends se do pointers. Har pointer ko vowel milne tak aage badhao, phir dono milse vowels ko swap karo aur dono pointers ko andar badhao; jab tak cross na ho jayein.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) (strings are immutable in JS/Python, so a character array is needed)',
    solutionExplanation:
      'Because consonants never move, the problem reduces to exactly Valid Palindrome\'s two-pointer skeleton but with a swap instead of a comparison: walk in from both ends, skip anything that is not a vowel, and when both pointers do land on vowels, exchange them and keep going — the consonants are simply stepped over and never touched.',
    solutionExplanationHi:
      'Consonants kabhi move nahi karte, isliye ye problem bilkul Valid Palindrome wale two-pointer skeleton jaisa ban jaata hai, bas comparison ki jagah swap hota hai: dono ends se andar chalo, jo vowel nahi hai use skip karo, aur jab dono pointers vowels par aa jaayein to unhe swap karo aur aage badho — consonants ko sirf step-over kiya jaata hai, kabhi touch nahi kiya jaata.',
    starter: starter(
      `const s = line(0);

function reverseVowels(s) {
  // your code here
}

console.log(reverseVowels(s));`,
      `s = line(0)

def reverse_vowels(s):
    # your code here
    pass

print(reverse_vowels(s))`,
    ),
    solution: solution(
      `const s = line(0);
const isVowel = (c) => 'aeiouAEIOU'.includes(c);
const chars = s.split('');
let i = 0, j = chars.length - 1;
while (i < j) {
  if (!isVowel(chars[i])) { i++; continue; }
  if (!isVowel(chars[j])) { j--; continue; }
  [chars[i], chars[j]] = [chars[j], chars[i]];
  i++; j--;
}
console.log(chars.join(''));`,
      `s = line(0)
vowels = set("aeiouAEIOU")
chars = list(s)
i, j = 0, len(chars) - 1
while i < j:
    if chars[i] not in vowels:
        i += 1
    elif chars[j] not in vowels:
        j -= 1
    else:
        chars[i], chars[j] = chars[j], chars[i]
        i += 1
        j -= 1
print("".join(chars))`,
    ),
    testCases: [
      sample('hello', 'holle'),
      sample('leetcode', 'leotcede'),
      hidden('aA', 'Aa'),
      hidden('bcd', 'bcd'),
      hidden('DesignGurus', 'DusugnGires'),
      hidden('a', 'a'),
    ],
  },

  {
    slug: 'backspace-string-compare',
    title: 'Backspace String Compare',
    category: 'Strings',
    difficulty: 'EASY',
    description:
      'Given two strings containing lowercase letters and `#` (a backspace that deletes the previous character, if any), determine whether they are equal after applying all the backspaces.\n\n**Input**\n- Line 1: `s`\n- Line 2: `t`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Do strings di hain jinmein lowercase letters aur `#` (backspace, jo pichle character ko delete karta hai, agar hai to) hain. Saare backspaces apply karne ke baad check karo ki dono equal hain ya nahi.\n\n**Input**\n- Line 1: `s`\n- Line 2: `t`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'ab#c\nad#c', output: 'true', explanation: 'Both become "ac".' },
      { input: 'ab##\nc#d#', output: 'true', explanation: 'Both become "".' },
    ],
    constraints: ['1 <= length <= 200', 'Lowercase English letters and `#` only'],
    hints: [
      'A stack naturally models backspace: push normal characters, pop on `#` (if the stack is non-empty).',
      'Build the final string for each input using a stack, then compare.',
      'Watch for a `#` with nothing left to delete — it should just be a no-op, not an error.',
    ],
    approach:
      'For each string, process it with a stack: push each lowercase letter, and on `#` pop the stack if it is non-empty (a `#` on an empty stack does nothing). Compare the two resulting stacks/strings for equality.',
    approachHi:
      'Har string ke liye ek stack se process karo: har lowercase letter push karo, aur `#` par stack ko pop karo agar wo khaali nahi hai (khaali stack par `#` kuch nahi karta). Dono resulting stacks/strings ko equal check karo.',
    timeComplexity: 'O(m + n)',
    spaceComplexity: 'O(m + n)',
    solutionExplanation:
      'A backspace always deletes the most recently typed character still standing — which is exactly the LIFO behavior a stack provides for free. Simulating each string independently with its own stack (rather than trying to reason about deletions in the original string directly) turns a fiddly text-editing problem into a straightforward push/pop simulation, and the final comparison is just stack-equals-stack.',
    solutionExplanationHi:
      'Backspace hamesha sabse recently type kiya hua, abhi tak bacha hua character delete karta hai — ye exactly wahi LIFO behavior hai jo stack free mein deta hai. Har string ko apne alag stack se independently simulate karna (original string mein deletions ke baare mein seedha reason karne ke bajaye), ek fiddly text-editing problem ko seedhe push/pop simulation mein badal deta hai, aur final comparison bas stack-equals-stack hai.',
    starter: starter(
      `const s = line(0), t = line(1);

function backspaceCompare(s, t) {
  // your code here
}

console.log(backspaceCompare(s, t));`,
      `s, t = line(0), line(1)

def backspace_compare(s, t):
    # your code here
    pass

print("true" if backspace_compare(s, t) else "false")`,
    ),
    solution: solution(
      `function build(str) {
  const stack = [];
  for (const c of str) { if (c === '#') { if (stack.length) stack.pop(); } else stack.push(c); }
  return stack.join('');
}
const s = line(0), t = line(1);
console.log(build(s) === build(t));`,
      `def build(s):
    stack = []
    for c in s:
        if c == "#":
            if stack:
                stack.pop()
        else:
            stack.append(c)
    return "".join(stack)

s, t = line(0), line(1)
print("true" if build(s) == build(t) else "false")`,
    ),
    testCases: [
      sample('ab#c\nad#c', 'true'),
      sample('ab##\nc#d#', 'true'),
      hidden('a#c\nb', 'false'),
      hidden('a##c\n#a#c', 'true'),
      hidden('a#c\nc#a', 'false'),
      hidden('###a\n#a#c', 'false'),
    ],
  },
];
