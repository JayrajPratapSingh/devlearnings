import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Backtracking — expansion batch. Rounds out the category beyond the
 * original three (Subsets, Permutations, N-Queens) with the combination-sum
 * family, grid/maze search, string-partitioning backtracking, and the
 * classic Sudoku solver.
 */
export const dsaExtraBacktracking: SeedProblem[] = [
  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given distinct positive integers and a target, find all unique combinations that sum to the target. Each candidate may be reused an unlimited number of times. Print each combination ascending, one per line, in the order produced by trying candidates in ascending order and only ever moving forward (never revisiting an earlier candidate).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` distinct positive integers\n- Line 3: `target`\n\n**Output**\nOne combination per line, values space-separated.',
    descriptionHi:
      'Distinct positive integers aur ek target diya hai. Aise saare unique combinations dhoondo jinka sum target ho. Har candidate ko unlimited baar reuse kar sakte ho. Har combination ascending order mein, ek line par ek, print karo — candidates ko ascending order mein try karke aur hamesha aage hi badhte hue (kabhi pichhle candidate par wapas na jaate hue).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` distinct positive integers\n- Line 3: `target`\n\n**Output**\nEk line par ek combination, values space se separate.',
    examples: [
      { input: '4\n2 3 6 7\n7', output: '2 2 3\n7' },
      { input: '3\n2 3 5\n8', output: '2 2 2 2\n2 3 3\n3 5' },
    ],
    constraints: ['1 <= n <= 30', '1 <= target <= 40', 'All candidates distinct and positive'],
    hints: [
      'Sort the candidates first so the output comes out in a deterministic, ascending order.',
      'A "start index" that never decreases is what allows reusing the same candidate multiple times while still avoiding duplicate combinations like [2,3] and [3,2].',
      'Prune early: once the running sum exceeds the target, stop trying larger candidates at that position (since they are sorted, everything after is even bigger).',
    ],
    approach:
      'Sort candidates ascending. Backtrack with a start index that does NOT advance past the current candidate on a successful use (allowing reuse), but never goes backward (avoiding permutation duplicates). At each step, try every candidate from the start index onward; stop early once adding it would exceed the target.',
    approachHi:
      'Candidates ko ascending sort karo. Ek start index ke saath backtrack karo jo successful use par current candidate se aage nahi badhta (reuse allow karne ke liye), par kabhi peeche bhi nahi jaata (permutation duplicates avoid karne ke liye). Har step par start index se aage har candidate try karo; jaise hi use jodne se target exceed ho, jaldi ruk jao.',
    timeComplexity: 'Exponential in the worst case, bounded by the number of valid combinations',
    spaceComplexity: 'O(target / min(candidates)) recursion depth',
    solutionExplanation:
      'Reuse and duplicate-avoidance pull in opposite directions, and the "start index" parameter resolves both at once: recursing with the SAME start index (not start+1) is what permits reusing a candidate, while never recursing with an EARLIER start index is what prevents generating [2,3] and [3,2] as two different combinations. Sorting first is what makes the exceed-target pruning valid — once one candidate is too big, every candidate after it (being larger) is too big as well, so the inner loop can break immediately instead of merely skipping.',
    solutionExplanationHi:
      'Reuse aur duplicate-avoidance opposite directions mein khinchte hain, aur "start index" parameter dono ko ek saath solve karta hai: SAME start index (start+1 nahi) ke saath recurse karna candidate reuse karne deta hai, jabki kabhi bhi EARLIER start index se recurse na karna [2,3] aur [3,2] ko do alag combinations banne se rokta hai. Pehle sort karna hi exceed-target pruning ko valid banata hai — ek baar koi candidate bahut bada ho jaaye, to usske baad ka har candidate (bada hone ki wajah se) bhi bahut bada hoga, isliye inner loop sirf skip karne ke bajaye turant break kar sakta hai.',
    starter: starter(
      `const candidates = nums(1).slice().sort((a, b) => a - b);
const target = num(2);
const out = [];

function backtrack(start, remaining, path) {
  // record path when remaining === 0, explore otherwise
}

backtrack(0, target, []);
for (const combo of out) console.log(combo.join(' '));`,
      `candidates = sorted(nums(1))
target = num(2)
out = []

def backtrack(start, remaining, path):
    # record path when remaining == 0, explore otherwise
    pass

backtrack(0, target, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    solution: solution(
      `const candidates = nums(1).slice().sort((a, b) => a - b);
const target = num(2);
const out = [];
(function backtrack(start, remaining, path) {
  if (remaining === 0) { out.push([...path]); return; }
  for (let i = start; i < candidates.length; i++) {
    if (candidates[i] > remaining) break;
    path.push(candidates[i]);
    backtrack(i, remaining - candidates[i], path);
    path.pop();
  }
})(0, target, []);
for (const combo of out) console.log(combo.join(' '));`,
      `candidates = sorted(nums(1))
target = num(2)
out = []

def backtrack(start, remaining, path):
    if remaining == 0:
        out.append(list(path))
        return
    for i in range(start, len(candidates)):
        if candidates[i] > remaining:
            break
        path.append(candidates[i])
        backtrack(i, remaining - candidates[i], path)
        path.pop()

backtrack(0, target, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    testCases: [
      sample('4\n2 3 6 7\n7', '2 2 3\n7'),
      sample('3\n2 3 5\n8', '2 2 2 2\n2 3 3\n3 5'),
      hidden('1\n2\n1', ''),
      hidden('1\n2\n4', '2 2'),
      hidden('2\n1 2\n4', '1 1 1 1\n1 1 2\n2 2'),
      hidden('3\n3 4 5\n3', '3'),
    ],
  },

  {
    slug: 'combination-sum-ii',
    title: 'Combination Sum II',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given positive integers (which may contain duplicates) and a target, find all unique combinations that sum to the target, using each element at most once (by position, not by value). Print each combination ascending, one per line, no duplicate combinations.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` positive integers\n- Line 3: `target`\n\n**Output**\nOne combination per line, values space-separated.',
    descriptionHi:
      'Positive integers (jisme duplicates ho sakte hain) aur ek target diya hai. Aise saare unique combinations dhoondo jinka sum target ho, har element ko zyada se zyada ek baar (position ke hisaab se, value ke hisaab se nahi) use karke. Har combination ascending, ek line par ek, print karo, koi duplicate combination nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` positive integers\n- Line 3: `target`\n\n**Output**\nEk line par ek combination, values space se separate.',
    examples: [
      { input: '7\n10 1 2 7 6 1 5\n8', output: '1 1 6\n1 2 5\n1 7\n2 6' },
      { input: '5\n2 5 2 1 2\n5', output: '1 2 2\n5' },
    ],
    constraints: ['1 <= n <= 100', '1 <= target <= 30'],
    hints: [
      'Sort first, both to produce ascending combinations and to make duplicate values adjacent.',
      'This time the recursive call must advance the start index (i + 1, not i), since each element can only be used once.',
      'To avoid duplicate combinations from duplicate values, skip a candidate if it equals the previous one AND the previous one was not used at this same recursion depth (i.e. skip repeats of a value within the same loop, not across recursion levels).',
    ],
    approach:
      'Sort candidates ascending. Backtrack advancing the start index by one each recursive call (no reuse). Within the loop at each level, skip a candidate if it is equal to the immediately preceding one already considered at this same level — that prevents generating the same combination twice when duplicate values exist.',
    approachHi:
      'Candidates ko ascending sort karo. Har recursive call mein start index ko ek se badhao (reuse nahi). Har level ke loop mein, agar candidate turant pehle wale candidate ke barabar hai jo isi level par pehle consider ho chuka hai, to use skip karo — isse duplicate values hone par same combination do baar nahi banta.',
    timeComplexity: 'Exponential in the worst case, bounded by the number of valid combinations',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'The skip rule is subtle: it is NOT "skip if this value equals the value chosen one level up" (that would wrongly forbid a valid combination like [1,1,6] which needs two 1s in a row) — it is "skip if this value equals the PREVIOUS SIBLING at the same loop, already tried and fully explored". After sorting, all copies of a duplicate value are adjacent, so at any single recursion level, only the FIRST occurrence of a repeated value should start a new branch; every subsequent identical sibling would explore an already-covered set of combinations, just shifted by one array index, which is exactly the duplicate this rule eliminates.',
    solutionExplanationHi:
      'Skip rule subtle hai: ye "skip karo agar ye value ek level upar chuni gayi value ke barabar hai" NAHI hai (ye galat tarah se [1,1,6] jaisa valid combination rokta, jismein lagatar do 1 chahiye) — ye hai "skip karo agar ye value usi loop mein PEHLE WALE SIBLING ke barabar hai jo pehle try ho kar poori tarah explore ho chuka hai". Sort karne ke baad, ek duplicate value ki saari copies adjacent hoti hain, isliye kisi bhi ek recursion level par, sirf repeated value ki PEHLI occurrence hi naya branch shuru kare — har agla identical sibling ek already-covered combinations ka set hi explore karega, bas ek array index se shift, aur yahi duplicate ye rule eliminate karta hai.',
    starter: starter(
      `const candidates = nums(1).slice().sort((a, b) => a - b);
const target = num(2);
const out = [];

function backtrack(start, remaining, path) {
  // record path when remaining === 0, explore otherwise, skipping same-level duplicates
}

backtrack(0, target, []);
for (const combo of out) console.log(combo.join(' '));`,
      `candidates = sorted(nums(1))
target = num(2)
out = []

def backtrack(start, remaining, path):
    # record path when remaining == 0, explore otherwise, skipping same-level duplicates
    pass

backtrack(0, target, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    solution: solution(
      `const candidates = nums(1).slice().sort((a, b) => a - b);
const target = num(2);
const out = [];
(function backtrack(start, remaining, path) {
  if (remaining === 0) { out.push([...path]); return; }
  for (let i = start; i < candidates.length; i++) {
    if (candidates[i] > remaining) break;
    if (i > start && candidates[i] === candidates[i - 1]) continue;
    path.push(candidates[i]);
    backtrack(i + 1, remaining - candidates[i], path);
    path.pop();
  }
})(0, target, []);
for (const combo of out) console.log(combo.join(' '));`,
      `candidates = sorted(nums(1))
target = num(2)
out = []

def backtrack(start, remaining, path):
    if remaining == 0:
        out.append(list(path))
        return
    for i in range(start, len(candidates)):
        if candidates[i] > remaining:
            break
        if i > start and candidates[i] == candidates[i - 1]:
            continue
        path.append(candidates[i])
        backtrack(i + 1, remaining - candidates[i], path)
        path.pop()

backtrack(0, target, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    testCases: [
      sample('7\n10 1 2 7 6 1 5\n8', '1 1 6\n1 2 5\n1 7\n2 6'),
      sample('5\n2 5 2 1 2\n5', '1 2 2\n5'),
      hidden('1\n5\n5', '5'),
      hidden('1\n5\n3', ''),
      hidden('3\n1 1 1\n2', '1 1'),
      hidden('4\n1 1 1 1\n3', '1 1 1'),
    ],
  },

  {
    slug: 'combinations-choose-k',
    title: 'Combinations',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Generate all combinations of `k` numbers chosen from `1` to `n`, in lexicographic order.\n\n**Input**\n- Line 1: `n`\n- Line 2: `k`\n\n**Output**\nOne combination per line, values space-separated.',
    descriptionHi:
      '`1` se `n` tak ke numbers mein se `k` numbers ke saare combinations, lexicographic order mein, banao.\n\n**Input**\n- Line 1: `n`\n- Line 2: `k`\n\n**Output**\nEk line par ek combination, values space se separate.',
    examples: [
      { input: '4\n2', output: '1 2\n1 3\n1 4\n2 3\n2 4\n3 4' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['1 <= n <= 20', '1 <= k <= n'],
    hints: [
      'A start value that only ever increases naturally produces combinations in lexicographic order without needing to sort afterward.',
      'A combination is complete once the path has k elements.',
      'Pruning: if there are not enough remaining numbers (from the current start to n) to fill out the rest of the combination, stop exploring that branch early.',
    ],
    approach:
      'Backtrack with a start value that increases each recursive call. At each step, try every value from `start` to `n`, appending it and recursing with `value + 1` as the new start. A path of length `k` is a complete combination. Prune when `n - start + 1 < k - path.length` (not enough numbers left).',
    approachHi:
      'Ek start value ke saath backtrack karo jo har recursive call mein badhta hai. Har step par, `start` se `n` tak har value try karo, use append karke `value + 1` ko naya start banakar recurse karo. Length `k` ka path ek complete combination hai. Prune karo jab `n - start + 1 < k - path.length` ho (baaki numbers kaafi nahi).',
    timeComplexity: 'O(k * C(n, k))',
    spaceComplexity: 'O(k) recursion depth',
    solutionExplanation:
      'Because the start value strictly increases with each choice, no combination can ever be generated with its elements out of ascending order, and no combination can be generated twice (each combination has exactly one strictly-increasing sequence of choices that produces it) — this is what makes the output lexicographically ordered for free, without a separate sort step. The remaining-count prune is a genuine optimization, not just correctness: without it, the algorithm would still explore branches doomed to fail (not enough numbers left to reach length k), just less efficiently.',
    solutionExplanationHi:
      'Chunki start value har choice ke saath strictly badhta hai, koi combination kabhi apne elements ke ascending order se bahar generate nahi ho sakta, aur koi combination do baar generate nahi ho sakta (har combination ko banane wala exactly ek hi strictly-increasing choices ka sequence hai) — yahi cheez output ko free mein lexicographically ordered bana deti hai, alag se sort step ke bina. Remaining-count prune ek genuine optimization hai, sirf correctness nahi — iske bina bhi algorithm sahi hi chalega, bas un branches ko bhi explore karega jo fail hone hi wale hain (length k tak pahunchne ke liye kaafi numbers nahi bache), thoda kam efficiently.',
    starter: starter(
      `const n = num(0), k = num(1);
const out = [];

function backtrack(start, path) {
  // record path when it has k elements
}

backtrack(1, []);
for (const combo of out) console.log(combo.join(' '));`,
      `n, k = num(0), num(1)
out = []

def backtrack(start, path):
    # record path when it has k elements
    pass

backtrack(1, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    solution: solution(
      `const n = num(0), k = num(1);
const out = [];
(function backtrack(start, path) {
  if (path.length === k) { out.push([...path]); return; }
  for (let v = start; v <= n - (k - path.length) + 1; v++) {
    path.push(v);
    backtrack(v + 1, path);
    path.pop();
  }
})(1, []);
for (const combo of out) console.log(combo.join(' '));`,
      `n, k = num(0), num(1)
out = []

def backtrack(start, path):
    if len(path) == k:
        out.append(list(path))
        return
    for v in range(start, n - (k - len(path)) + 2):
        path.append(v)
        backtrack(v + 1, path)
        path.pop()

backtrack(1, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    testCases: [
      sample('4\n2', '1 2\n1 3\n1 4\n2 3\n2 4\n3 4'),
      sample('1\n1', '1'),
      hidden('3\n3', '1 2 3'),
      hidden('5\n1', '1\n2\n3\n4\n5'),
      hidden('3\n1', '1\n2\n3'),
      hidden('5\n5', '1 2 3 4 5'),
    ],
  },

  {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Generate all combinations of `n` pairs of well-formed (balanced) parentheses, in the order produced by trying to add an opening bracket before a closing one at every step.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nOne combination per line.',
    descriptionHi:
      '`n` pairs ke saare well-formed (balanced) parentheses combinations banao, us order mein jo har step par pehle opening bracket try karke, phir closing, banta hai.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nEk line par ek combination.',
    examples: [
      { input: '3', output: '((()))\n(()())\n(())()\n()(())\n()()()' },
      { input: '1', output: '()' },
    ],
    constraints: ['1 <= n <= 8'],
    hints: [
      'Track how many opening and closing brackets have been used so far.',
      'An opening bracket can be added whenever fewer than n have been used.',
      'A closing bracket can only be added when it would not exceed the number of opens already placed — otherwise the string could never balance.',
    ],
    approach:
      'Backtrack tracking counts of opens and closes used so far. Try adding `(` whenever `opens < n`; try adding `)` whenever `closes < opens` (so it never exceeds the opens, keeping the prefix always validly balanceable). A string of length `2n` is complete.',
    approachHi:
      'Ab tak use hue opens aur closes ka count track karte hue backtrack karo. `(` add karo jab bhi `opens < n` ho; `)` add karo jab bhi `closes < opens` ho (taaki wo opens se kabhi zyada na ho, prefix hamesha validly balanceable rahe). Length `2n` ki string complete hai.',
    timeComplexity: 'O(4^n / sqrt(n)) — the n-th Catalan number, times n for building each string',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'The two guard conditions are exactly what keeps every generated string balanced at every prefix, not just at the end: capping opens at n ensures no more than n pairs total, and requiring closes to stay strictly behind opens ensures a closing bracket never appears without a matching earlier opening one — together these two simple counters are enough to prune away every invalid string before it is ever fully built, so only the exactly-Catalan-number-many valid strings are ever generated.',
    solutionExplanationHi:
      'Ye do guard conditions hi guarantee karti hain ki har generate hui string har prefix par balanced rahe, sirf end mein nahi: opens ko n tak cap karna ensure karta hai ki total n se zyada pairs na hon, aur closes ko opens se strictly peeche rakhna ensure karta hai ki koi closing bracket bina kisi matching pehle wale opening ke kabhi na aaye — saath mein ye do simple counters har invalid string ko poori tarah banne se pehle hi prune kar dete hain, isliye sirf exactly-Catalan-number-jitni valid strings hi generate hoti hain.',
    starter: starter(
      `const n = num(0);
const out = [];

function backtrack(path, opens, closes) {
  // record path when path.length === 2 * n
}

backtrack('', 0, 0);
for (const s of out) console.log(s);`,
      `n = num(0)
out = []

def backtrack(path, opens, closes):
    # record path when len(path) == 2 * n
    pass

backtrack("", 0, 0)
for s in out:
    print(s)`,
    ),
    solution: solution(
      `const n = num(0);
const out = [];
(function backtrack(path, opens, closes) {
  if (path.length === 2 * n) { out.push(path); return; }
  if (opens < n) backtrack(path + '(', opens + 1, closes);
  if (closes < opens) backtrack(path + ')', opens, closes + 1);
})('', 0, 0);
for (const s of out) console.log(s);`,
      `n = num(0)
out = []

def backtrack(path, opens, closes):
    if len(path) == 2 * n:
        out.append(path)
        return
    if opens < n:
        backtrack(path + "(", opens + 1, closes)
    if closes < opens:
        backtrack(path + ")", opens, closes + 1)

backtrack("", 0, 0)
for s in out:
    print(s)`,
    ),
    testCases: [
      sample('3', '((()))\n(()())\n(())()\n()(())\n()()()'),
      sample('1', '()'),
      hidden('2', '(())\n()()'),
      hidden('4', '(((())))\n((()()))\n((())())\n((()))()\n(()(()))\n(()()())\n(()())()\n(())(())\n(())()()\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()'),
    ],
  },

  {
    slug: 'word-search',
    title: 'Word Search',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given a grid of letters, determine whether `word` can be formed by a path of adjacent cells (up/down/left/right), never reusing the same cell twice within one path.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: a row of letters each (no spaces)\n- Last line: `word`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Letters ka ek grid diya hai. Check karo ki `word`, adjacent cells (up/down/left/right) ke ek path se ban sakta hai ya nahi, ek hi path mein kisi cell ko dobara use kiye bina.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: har ek row ke letters (bina spaces)\n- Aakhri line: `word`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '3 4\nABCE\nSFCS\nADEE\nABCCED', output: 'true' },
      { input: '3 4\nABCE\nSFCS\nADEE\nABCB', output: 'false' },
    ],
    constraints: ['1 <= rows, cols <= 6', '1 <= word.length <= 15'],
    hints: [
      'Try starting the search from every cell that matches the word\'s first letter.',
      'Mark a cell as visited before recursing into its neighbors, and un-mark it when backtracking out (so other paths can still use that cell).',
      'A cell can only be reused within a DIFFERENT path attempt — never within the same one.',
    ],
    approach:
      'Try every starting cell. From a cell matching the current letter of the word, temporarily mark it visited, then recurse into all four neighbors looking for the next letter. If the whole word is matched, succeed. Un-mark the cell (backtrack) before trying the next neighbor or returning, so it is free for other path attempts.',
    approachHi:
      'Har starting cell try karo. Jo cell current word letter se match kare, use temporarily visited mark karo, phir agla letter dhoondne ke liye chaaron neighbors mein recurse karo. Agar poora word match ho jaaye, success. Agle neighbor try karne ya return karne se pehle cell ko un-mark karo (backtrack), taaki wo doosre path attempts ke liye free ho.',
    timeComplexity: 'O(rows * cols * 4^L) where L is the word length',
    spaceComplexity: 'O(L) recursion depth',
    solutionExplanation:
      'Marking a cell visited only for the DURATION of the current recursive exploration — and un-marking it the instant that exploration backtracks out — is what correctly enforces "no cell reused within one path" while still allowing the same cell to be part of a completely different, later path attempt from a different starting cell or different branch choice. Forgetting the un-mark step is the classic bug: it would make a cell permanently unusable across ALL attempts, not just the current one, silently rejecting valid words.',
    solutionExplanationHi:
      'Ek cell ko sirf current recursive exploration ke DAURAAN visited mark karna — aur wo exploration backtrack hote hi turant un-mark kar dena — hi sahi tarah "ek path mein koi cell dobara nahi" enforce karta hai, jabki wahi cell kisi doosre, baad ke path attempt mein (kisi doosre starting cell ya branch choice se) shaamil ho sakta hai. Un-mark step bhool jaana classic bug hai: isse cell permanently unusable ho jaata SAARE attempts mein, sirf current mein nahi, aur valid words chupchaap reject ho jaate.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(line(1 + i).split(''));
const word = line(1 + rows);

function exist(grid, word) {
  // your code here
}

console.log(exist(grid, word));`,
      `rows, cols = nums(0)
grid = [list(line(1 + i)) for i in range(rows)]
word = line(1 + rows)

def exist(grid, word):
    # your code here
    pass

print("true" if exist(grid, word) else "false")`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(line(1 + i).split(''));
const word = line(1 + rows);
function dfs(r, c, idx) {
  if (idx === word.length) return true;
  if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== word[idx]) return false;
  const saved = grid[r][c];
  grid[r][c] = '#';
  const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) || dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);
  grid[r][c] = saved;
  return found;
}
let ok = false;
for (let r = 0; r < rows && !ok; r++) for (let c = 0; c < cols && !ok; c++) if (dfs(r, c, 0)) ok = true;
console.log(ok);`,
      `rows, cols = nums(0)
grid = [list(line(1 + i)) for i in range(rows)]
word = line(1 + rows)

def dfs(r, c, idx):
    if idx == len(word):
        return True
    if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != word[idx]:
        return False
    saved = grid[r][c]
    grid[r][c] = "#"
    found = dfs(r + 1, c, idx + 1) or dfs(r - 1, c, idx + 1) or dfs(r, c + 1, idx + 1) or dfs(r, c - 1, idx + 1)
    grid[r][c] = saved
    return found

ok = False
for r in range(rows):
    for c in range(cols):
        if dfs(r, c, 0):
            ok = True
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('3 4\nABCE\nSFCS\nADEE\nABCCED', 'true'),
      sample('3 4\nABCE\nSFCS\nADEE\nABCB', 'false'),
      hidden('1 1\nA\nA', 'true'),
      hidden('1 1\nA\nB', 'false'),
      hidden('2 2\nAB\nCD\nABDC', 'true'),
      hidden('3 4\nABCE\nSFCS\nADEE\nSEE', 'true'),
    ],
  },

  {
    slug: 'palindrome-partitioning',
    title: 'Palindrome Partitioning',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Partition a string into substrings that are all palindromes, in every possible way. Print each partition as space-separated substrings, one per line, in the order produced by trying the shortest valid prefix first.\n\n**Input**\nOne line containing the string.\n\n**Output**\nOne partition per line.',
    descriptionHi:
      'Ek string ko har possible tareeke se aise substrings mein partition karo jo sab palindrome hon. Har partition ko space-separated substrings ki tarah, ek line par ek, print karo — sabse chhota valid prefix pehle try karke.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nEk line par ek partition.',
    examples: [
      { input: 'aab', output: 'a a b\naa b' },
      { input: 'a', output: 'a' },
    ],
    constraints: ['1 <= length <= 12'],
    hints: [
      'At each position, try every possible next cut point, from the shortest prefix to the longest.',
      'Only recurse into a prefix if it is itself a palindrome — otherwise it can never be part of a valid all-palindrome partition.',
      'A complete partition is reached when the cutting position reaches the end of the string.',
    ],
    approach:
      'Backtrack over the starting position. At each position, try every possible end for the next piece (from the shortest, one character, up to the rest of the string); only recurse further if that piece is a palindrome. A partition is complete once the position reaches the end of the string.',
    approachHi:
      'Starting position par backtrack karo. Har position par, agle piece ke liye har possible end try karo (sabse chhota, ek character, se lekar baaki poori string tak); sirf tabhi aage recurse karo jab wo piece palindrome ho. Position string ke end tak pahunchne par partition complete ho jaata hai.',
    timeComplexity: 'O(n * 2^n) worst case',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'The palindrome check acts as a pruning filter applied as early as possible: rather than generating all 2^(n-1) possible ways to cut the string and checking each piece afterward, testing each candidate piece for being a palindrome BEFORE recursing into it means entire subtrees of invalid partitions are never explored at all, since a non-palindrome prefix can never be salvaged by any later cut.',
    solutionExplanationHi:
      'Palindrome check ek pruning filter ki tarah jitni jaldi ho sake apply hota hai: string ko katne ke saare 2^(n-1) possible tareeke banakar baad mein har piece check karne ke bajaye, har candidate piece ko recurse karne se PEHLE palindrome hone ka test karna, invalid partitions ke poore subtrees ko explore hi nahi hone deta, kyunki ek non-palindrome prefix ko koi bhi baad ka cut theek nahi kar sakta.',
    starter: starter(
      `const s = line(0);
const out = [];

function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}

function backtrack(start, path) {
  // record path when start === s.length
}

backtrack(0, []);
for (const p of out) console.log(p.join(' '));`,
      `s = line(0)
out = []


def is_palindrome(sub):
    return sub == sub[::-1]


def backtrack(start, path):
    # record path when start == len(s)
    pass


backtrack(0, [])
for p in out:
    print(" ".join(p))`,
    ),
    solution: solution(
      `const s = line(0);
const out = [];
function isPalindrome(str) {
  let i = 0, j = str.length - 1;
  while (i < j) { if (str[i] !== str[j]) return false; i++; j--; }
  return true;
}
(function backtrack(start, path) {
  if (start === s.length) { out.push([...path]); return; }
  for (let end = start + 1; end <= s.length; end++) {
    const piece = s.slice(start, end);
    if (!isPalindrome(piece)) continue;
    path.push(piece);
    backtrack(end, path);
    path.pop();
  }
})(0, []);
for (const p of out) console.log(p.join(' '));`,
      `s = line(0)
out = []


def is_palindrome(sub):
    return sub == sub[::-1]


def backtrack(start, path):
    if start == len(s):
        out.append(list(path))
        return
    for end in range(start + 1, len(s) + 1):
        piece = s[start:end]
        if not is_palindrome(piece):
            continue
        path.append(piece)
        backtrack(end, path)
        path.pop()


backtrack(0, [])
for p in out:
    print(" ".join(p))`,
    ),
    testCases: [
      sample('aab', 'a a b\naa b'),
      sample('a', 'a'),
      hidden('aa', 'a a\naa'),
      hidden('ab', 'a b'),
      hidden('aba', 'a b a\naba'),
      hidden('abc', 'a b c'),
    ],
  },

  {
    slug: 'letter-combinations-phone-number',
    title: 'Letter Combinations of a Phone Number',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given a string of digits 2-9, return every possible letter combination the digits could represent on a standard phone keypad (2=abc, 3=def, 4=ghi, 5=jkl, 6=mno, 7=pqrs, 8=tuv, 9=wxyz), in the order produced by trying each digit\'s letters in order.\n\n**Input**\nOne line containing the digit string (may be empty).\n\n**Output**\nOne combination per line (nothing printed if the input is empty).',
    descriptionHi:
      'Digits 2-9 wali ek string di hai. Standard phone keypad (2=abc, 3=def, 4=ghi, 5=jkl, 6=mno, 7=pqrs, 8=tuv, 9=wxyz) par wo digits jo bhi letter combinations represent kar sakte hain, sab return karo, har digit ke letters order mein try karke.\n\n**Input**\nEk line jisme digit string hai (khaali bhi ho sakti hai).\n\n**Output**\nEk line par ek combination (khaali agar input khaali hai).',
    examples: [
      { input: '23', output: 'ad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf' },
      { input: '2', output: 'a\nb\nc' },
    ],
    constraints: ['0 <= length <= 4'],
    hints: [
      'An empty input string produces no combinations at all (not even an empty one).',
      'For each digit, try every one of its mapped letters, appending each and recursing on the rest of the digits.',
      'A combination is complete once every digit has contributed a letter.',
    ],
    approach:
      'Backtrack over the digit string, one digit at a time. For the current digit, try every letter it maps to, appending it to the path and recursing on the remaining digits. A complete combination is reached once the path\'s length equals the number of digits.',
    approachHi:
      'Digit string par ek-ek digit karke backtrack karo. Current digit ke liye, uske har mapped letter ko try karo, use path mein jodkar baaki digits par recurse karo. Path ki length digits ki sankhya ke barabar hone par ek complete combination mil jaata hai.',
    timeComplexity: 'O(4^n) where n is the number of digits',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'Each digit independently contributes a choice of 3 or 4 letters, and the combinations are exactly the Cartesian product of all those per-digit choices — backtracking explores that Cartesian product directly, one digit\'s choice at a time, without ever needing to materialize the full list of mappings before combining them.',
    solutionExplanationHi:
      'Har digit independently 3 ya 4 letters ka choice deta hai, aur combinations exactly un sab per-digit choices ka Cartesian product hain — backtracking us Cartesian product ko seedha explore karta hai, ek baar mein ek digit ka choice, bina combine karne se pehle poori mappings ki list banaye.',
    starter: starter(
      `const digits = line(0);
const MAP = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
const out = [];

function backtrack(index, path) {
  // record path when index === digits.length (only if digits is non-empty)
}

if (digits.length > 0) backtrack(0, '');
for (const c of out) console.log(c);`,
      `digits = line(0)
MAP = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
out = []


def backtrack(index, path):
    # record path when index == len(digits) (only if digits is non-empty)
    pass


if len(digits) > 0:
    backtrack(0, "")
for c in out:
    print(c)`,
    ),
    solution: solution(
      `const digits = line(0);
const MAP = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
const out = [];
function backtrack(index, path) {
  if (index === digits.length) { out.push(path); return; }
  for (const c of MAP[digits[index]]) backtrack(index + 1, path + c);
}
if (digits.length > 0) backtrack(0, '');
for (const c of out) console.log(c);`,
      `digits = line(0)
MAP = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}
out = []


def backtrack(index, path):
    if index == len(digits):
        out.append(path)
        return
    for c in MAP[digits[index]]:
        backtrack(index + 1, path + c)


if len(digits) > 0:
    backtrack(0, "")
for c in out:
    print(c)`,
    ),
    testCases: [
      sample('23', 'ad\nae\naf\nbd\nbe\nbf\ncd\nce\ncf'),
      sample('2', 'a\nb\nc'),
      hidden('', ''),
      hidden('7', 'p\nq\nr\ns'),
      hidden('9', 'w\nx\ny\nz'),
      hidden('22', 'aa\nab\nac\nba\nbb\nbc\nca\ncb\ncc'),
    ],
  },

  {
    slug: 'subsets-ii',
    title: 'Subsets II',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given integers that may contain duplicates, generate all unique subsets. Sort each subset ascending; print subsets in the order produced by sorting the input first and only branching forward. Print `(empty)` for the empty subset.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers\n\n**Output**\nOne subset per line.',
    descriptionHi:
      'Integers diye hain jisme duplicates ho sakte hain. Saare unique subsets banao. Har subset ascending sort karo; subsets ko us order mein print karo jo input pehle sort karke aur sirf aage branch karke milta hai. Khaali subset ke liye `(empty)` print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers\n\n**Output**\nEk line par ek subset.',
    examples: [
      { input: '3\n1 2 2', output: '(empty)\n1\n1 2\n1 2 2\n2\n2 2' },
      { input: '1\n0', output: '(empty)\n0' },
    ],
    constraints: ['1 <= n <= 10'],
    hints: [
      'This reuses the exact Subsets template, plus one duplicate-avoidance rule.',
      'Sort the input first, so duplicate values become adjacent.',
      'At any given recursion depth, skip a candidate that equals the immediately preceding one already tried at that SAME depth (same rule as Combination Sum II).',
    ],
    approach:
      'Sort the input ascending. Backtrack exactly like Subsets, recording the current path at every node, but within each level\'s loop, skip an index if its value equals the previous index\'s value AND the previous index was already tried at this same level (i.e. `i > start && arr[i] === arr[i-1]`).',
    approachHi:
      'Input ko ascending sort karo. Bilkul Subsets jaisa backtrack karo, har node par current path record karte hue, par har level ke loop mein, agar kisi index ki value pichle index ki value ke barabar hai AUR pichla index isi level par pehle try ho chuka hai (yaani `i > start && arr[i] === arr[i-1]`), to use skip karo.',
    timeComplexity: 'O(n * 2^n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'Without deduplication, choosing "the first 2" versus "the second 2" at the same recursion level would produce two identically-valued but structurally distinct subsets that look identical once printed — the same-level, previous-index skip rule is what recognizes these as redundant and prunes the second one before it ever gets explored, exactly mirroring the same fix applied in Combination Sum II.',
    solutionExplanationHi:
      'Deduplication ke bina, ek hi recursion level par "pehla 2" vs "doosra 2" choose karna, do value mein identical par structurally alag subsets banata jo print hone ke baad ek jaise dikhte — same-level, previous-index skip rule inhe redundant pehchaan kar doosre ko explore hone se pehle hi prune kar deta hai, bilkul wahi fix jo Combination Sum II mein apply hua tha.',
    starter: starter(
      `const arr = nums(1).slice().sort((a, b) => a - b);
const out = [];

function backtrack(start, path) {
  // record path, then explore, skipping same-level duplicates
}

backtrack(0, []);
for (const s of out) console.log(s.length ? s.join(' ') : '(empty)');`,
      `arr = sorted(nums(1))
out = []


def backtrack(start, path):
    # record path, then explore, skipping same-level duplicates
    pass


backtrack(0, [])
for s in out:
    print(" ".join(map(str, s)) if s else "(empty)")`,
    ),
    solution: solution(
      `const arr = nums(1).slice().sort((a, b) => a - b);
const out = [];
(function backtrack(start, path) {
  out.push([...path]);
  for (let i = start; i < arr.length; i++) {
    if (i > start && arr[i] === arr[i - 1]) continue;
    path.push(arr[i]);
    backtrack(i + 1, path);
    path.pop();
  }
})(0, []);
for (const s of out) console.log(s.length ? s.join(' ') : '(empty)');`,
      `arr = sorted(nums(1))
out = []


def backtrack(start, path):
    out.append(list(path))
    for i in range(start, len(arr)):
        if i > start and arr[i] == arr[i - 1]:
            continue
        path.append(arr[i])
        backtrack(i + 1, path)
        path.pop()


backtrack(0, [])
for s in out:
    print(" ".join(map(str, s)) if s else "(empty)")`,
    ),
    testCases: [
      sample('3\n1 2 2', '(empty)\n1\n1 2\n1 2 2\n2\n2 2'),
      sample('1\n0', '(empty)\n0'),
      hidden('3\n1 1 1', '(empty)\n1\n1 1\n1 1 1'),
      hidden('2\n4 4', '(empty)\n4\n4 4'),
      hidden('3\n1 2 3', '(empty)\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3'),
    ],
  },

  {
    slug: 'permutations-ii',
    title: 'Permutations II',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given integers that may contain duplicates, generate all unique permutations, in the order produced by sorting the input first and trying candidates left to right at each position.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers\n\n**Output**\nOne permutation per line.',
    descriptionHi:
      'Integers diye hain jisme duplicates ho sakte hain. Saare unique permutations banao, us order mein jo input pehle sort karke aur har position par candidates ko left-se-right try karke milta hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers\n\n**Output**\nEk line par ek permutation.',
    examples: [
      { input: '3\n1 1 2', output: '1 1 2\n1 2 1\n2 1 1' },
      { input: '3\n1 2 3', output: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1' },
    ],
    constraints: ['1 <= n <= 8'],
    hints: [
      'This reuses the exact Permutations template, plus a duplicate-avoidance rule.',
      'Sort the input first, so duplicate values become adjacent.',
      'At each position, skip a candidate if it equals the previous (unused) candidate that was already tried and fully explored at this same position.',
    ],
    approach:
      'Sort the input ascending. Backtrack exactly like Permutations with a `used` array, but at each position\'s loop, skip index `i` if `arr[i] === arr[i-1]` and the previous identical value is currently unused (meaning it was already tried, fully explored, and backtracked out of at this exact position — trying its identical twin here would just repeat that same work).',
    approachHi:
      'Input ko ascending sort karo. `used` array ke saath bilkul Permutations jaisa backtrack karo, par har position ke loop mein, index `i` ko skip karo agar `arr[i] === arr[i-1]` hai aur pichli identical value abhi unused hai (matlab wo isi exact position par pehle try ho kar, poori tarah explore hokar backtrack ho chuki hai — uski identical twin ko yahan try karna wahi kaam dobara karega).',
    timeComplexity: 'O(n * n!) worst case, much less with duplicates',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'At a fixed position, if two candidates have the same value, trying the second one produces exactly the same set of downstream permutations as trying the first — so once the first identical candidate\'s entire subtree has been fully explored (which is exactly what "currently unused" signals, since it was marked used, recursed into, then unmarked on backtrack), trying its twin at the same position is pure duplicate work and can be skipped outright.',
    solutionExplanationHi:
      'Ek fixed position par, agar do candidates ki value same hai, to doosre ko try karna exactly wahi downstream permutations banayega jo pehle ko try karne se bante — isliye ek baar jab pehle identical candidate ka poora subtree explore ho chuka ho (jo exactly "abhi unused hai" signal karta hai, kyunki wo used mark hua, recurse hua, phir backtrack par unmark hua), usi position par uski twin try karna sirf duplicate kaam hai aur seedha skip ho sakta hai.',
    starter: starter(
      `const arr = nums(1).slice().sort((a, b) => a - b);
const used = new Array(arr.length).fill(false);
const out = [];

function backtrack(path) {
  // emit when path is complete, skipping duplicate candidates at the same position
}

backtrack([]);
for (const p of out) console.log(p.join(' '));`,
      `arr = sorted(nums(1))
used = [False] * len(arr)
out = []


def backtrack(path):
    # emit when path is complete, skipping duplicate candidates at the same position
    pass


backtrack([])
for p in out:
    print(" ".join(map(str, p)))`,
    ),
    solution: solution(
      `const arr = nums(1).slice().sort((a, b) => a - b);
const used = new Array(arr.length).fill(false);
const out = [];
(function backtrack(path) {
  if (path.length === arr.length) { out.push([...path]); return; }
  for (let i = 0; i < arr.length; i++) {
    if (used[i]) continue;
    if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) continue;
    used[i] = true; path.push(arr[i]);
    backtrack(path);
    path.pop(); used[i] = false;
  }
})([]);
for (const p of out) console.log(p.join(' '));`,
      `arr = sorted(nums(1))
used = [False] * len(arr)
out = []


def backtrack(path):
    if len(path) == len(arr):
        out.append(list(path))
        return
    for i in range(len(arr)):
        if used[i]:
            continue
        if i > 0 and arr[i] == arr[i - 1] and not used[i - 1]:
            continue
        used[i] = True
        path.append(arr[i])
        backtrack(path)
        path.pop()
        used[i] = False


backtrack([])
for p in out:
    print(" ".join(map(str, p)))`,
    ),
    testCases: [
      sample('3\n1 1 2', '1 1 2\n1 2 1\n2 1 1'),
      sample('3\n1 2 3', '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1'),
      hidden('1\n5', '5'),
      hidden('2\n2 2', '2 2'),
      hidden('4\n1 1 1 1', '1 1 1 1'),
      hidden('3\n1 1 1', '1 1 1'),
    ],
  },

  {
    slug: 'sudoku-solver',
    title: 'Sudoku Solver',
    category: 'Backtracking',
    difficulty: 'HARD',
    description:
      'Solve a 9x9 Sudoku puzzle: fill every empty cell (`.`) with a digit 1-9 so that every row, every column, and every 3x3 box contains each digit exactly once. The puzzle has exactly one solution.\n\n**Input**\n9 lines, each 9 characters (digits or `.`).\n\n**Output**\nThe solved grid, 9 lines of 9 characters each.',
    descriptionHi:
      'Ek 9x9 Sudoku puzzle solve karo: har khaali cell (`.`) ko 1-9 ka digit se bharo taaki har row, har column, aur har 3x3 box mein har digit exactly ek baar aaye. Puzzle ka exactly ek solution hai.\n\n**Input**\n9 lines, har ek 9 characters (digits ya `.`).\n\n**Output**\nSolved grid, 9 lines, har ek 9 characters ki.',
    examples: [
      {
        input: '53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79',
        output: '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179',
      },
    ],
    constraints: ['A standard 9x9 Sudoku puzzle with exactly one solution'],
    hints: [
      'Find the next empty cell; try each digit 1-9 in it; recurse; if nothing works, un-place the digit and try the next one.',
      'A digit is valid in a cell only if it does not already appear in that row, that column, or that 3x3 box.',
      'The moment every cell is filled, the puzzle is solved — no need to keep searching for alternate solutions.',
    ],
    approach:
      'Classic constraint backtracking. Scan for the next empty cell. For each digit 1-9, check whether placing it violates the row/column/box constraint; if not, place it, recurse into the rest of the grid, and if that recursive attempt fails, remove the digit and try the next one. Success is reaching the state where no empty cells remain.',
    approachHi:
      'Classic constraint backtracking. Agla khaali cell dhoondo. Har digit 1-9 ke liye, check karo ki use rakhne se row/column/box constraint violate hoti hai ya nahi; agar nahi, to use rakho, baaki grid par recurse karo, aur agar wo recursive attempt fail ho jaaye, digit hata do aur agla try karo. Success tab hai jab koi khaali cell na bache.',
    timeComplexity: 'Exponential in the worst case, but heavily pruned by the constraints in practice',
    spaceComplexity: 'O(1) extra beyond the grid itself (recursion depth bounded by 81 empty cells)',
    solutionExplanation:
      'The three overlapping constraints (row, column, box) prune the search space extremely aggressively compared to trying all 9^(number of blanks) raw fillings — most cells have very few valid digits once their row, column, and box are already partly filled, so the backtracking search converges quickly in practice for well-posed puzzles despite the theoretical worst-case being exponential. Stopping the instant a full valid grid is found (rather than continuing to search) matters because the puzzle is guaranteed to have exactly one solution, so no further search is ever productive.',
    solutionExplanationHi:
      'Teen overlapping constraints (row, column, box) saare 9^(khaali cells ki sankhya) raw fillings try karne ke muqable search space ko bahut aggressively prune karte hain — jaise hi kisi cell ki row, column, aur box aadhi bhar jaati hai, uske liye bahut kam valid digits bachte hain, isliye well-posed puzzles ke liye backtracking search practice mein jaldi converge ho jaata hai, chahe theoretical worst-case exponential ho. Ek poori valid grid milte hi rukna (aage search jaari na rakhna) isliye matter karta hai kyunki puzzle guaranteed exactly ek solution rakhta hai, isliye aage koi bhi search productive nahi hoti.',
    starter: starter(
      `const grid = [];
for (let i = 0; i < 9; i++) grid.push(line(i).split(''));

function solveSudoku(grid) {
  // mutate grid in place to solve it, return true on success
  return false;
}

solveSudoku(grid);
console.log(grid.map((r) => r.join('')).join('\\n'));`,
      `grid = [list(line(i)) for i in range(9)]


def solve_sudoku(grid):
    # mutate grid in place to solve it, return True on success
    return False


solve_sudoku(grid)
print("\\n".join("".join(row) for row in grid))`,
    ),
    solution: solution(
      `const grid = [];
for (let i = 0; i < 9; i++) grid.push(line(i).split(''));
function isValid(r, c, d) {
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === d || grid[i][c] === d) return false;
  }
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
  for (let i = br; i < br + 3; i++) for (let j = bc; j < bc + 3; j++) if (grid[i][j] === d) return false;
  return true;
}
function solve() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== '.') continue;
      for (let d = 1; d <= 9; d++) {
        const ds = String(d);
        if (!isValid(r, c, ds)) continue;
        grid[r][c] = ds;
        if (solve()) return true;
        grid[r][c] = '.';
      }
      return false;
    }
  }
  return true;
}
solve();
console.log(grid.map((r) => r.join('')).join('\\n'));`,
      `grid = [list(line(i)) for i in range(9)]


def is_valid(r, c, d):
    for i in range(9):
        if grid[r][i] == d or grid[i][c] == d:
            return False
    br, bc = (r // 3) * 3, (c // 3) * 3
    for i in range(br, br + 3):
        for j in range(bc, bc + 3):
            if grid[i][j] == d:
                return False
    return True


def solve():
    for r in range(9):
        for c in range(9):
            if grid[r][c] != ".":
                continue
            for d in range(1, 10):
                ds = str(d)
                if not is_valid(r, c, ds):
                    continue
                grid[r][c] = ds
                if solve():
                    return True
                grid[r][c] = "."
            return False
    return True


solve()
print("\\n".join("".join(row) for row in grid))`,
    ),
    testCases: [
      sample(
        '53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79',
        '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179',
      ),
      hidden(
        '..9748...\n7........\n.2.1.9...\n..7...24.\n.64.1.59.\n.98...3..\n...8.3.2.\n........6\n...2759..',
        '519748632\n783652419\n426139875\n357986241\n264317598\n198524367\n975863124\n832491756\n641275983',
      ),
    ],
  },

  {
    slug: 'rat-in-a-maze',
    title: 'Rat in a Maze',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'A rat starts at the top-left of an `n x n` maze (`1` = open, `0` = blocked) and must reach the bottom-right, moving only Down, Left, Right, or Up through open cells, never revisiting a cell within one path. Print every path as a string of moves (using D, L, R, U), in the order produced by trying moves in that D-L-R-U order, one path per line.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `n` space-separated 0/1 values\n\n**Output**\nOne path per line (nothing if no path exists).',
    descriptionHi:
      'Ek rat `n x n` maze (`1` = khula, `0` = blocked) ke top-left se shuru hota hai aur use bottom-right tak pahunchna hai, sirf Down, Left, Right, ya Up move karte hue khule cells se, ek path mein kisi cell ko dobara visit kiye bina. Har path ko moves ki ek string ki tarah print karo (D, L, R, U use karke), D-L-R-U order mein moves try karke jo order banta hai usi mein, ek line par ek path.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `n` space-separated 0/1 values\n\n**Output**\nEk line par ek path (kuch nahi agar koi path na ho).',
    examples: [
      { input: '4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1', output: 'DDRDRR\nDRDDRR' },
      { input: '2\n1 0\n0 1', output: '' },
    ],
    constraints: ['1 <= n <= 5', 'The starting and ending cells are always open (if n > 1)'],
    hints: [
      'Mark a cell visited before exploring from it, and un-mark it when backtracking, so other paths can reuse it.',
      'Try the four directions in a fixed order (D, L, R, U) so the output comes out in a predictable, consistent order.',
      'A complete path is reached when the rat is standing on the bottom-right cell.',
    ],
    approach:
      'Backtrack from the top-left, marking cells visited along the way. At each cell, try moving Down, Left, Right, then Up (in that fixed order), only into open, not-yet-visited, in-bounds cells. Append the move letter to the path. Reaching the bottom-right cell completes a path; un-mark the cell and backtrack after exploring all four directions from it.',
    approachHi:
      'Top-left se backtrack karo, raaste mein cells ko visited mark karte hue. Har cell par, Down, Left, Right, phir Up try karo (isi fixed order mein), sirf khule, abhi tak visit na hue, in-bounds cells mein. Move letter ko path mein jodo. Bottom-right cell tak pahunchna ek path complete karta hai; us cell se chaaron directions explore karne ke baad use un-mark karke backtrack karo.',
    timeComplexity: 'Exponential in the worst case, bounded heavily by the maze structure',
    spaceComplexity: 'O(n^2) recursion depth in the worst case',
    solutionExplanation:
      'Visiting-then-unmarking is the same discipline as Word Search: a cell must be off-limits for the DURATION of the current path (to prevent infinite loops walking back and forth) but must become available again once that path\'s exploration backtracks out, since a different path might legitimately need to pass through it. Trying directions in a fixed, consistent order (D-L-R-U) is what makes the SET of discovered paths deterministic in ORDER, which the grader depends on for an exact-match comparison.',
    solutionExplanationHi:
      'Visit-then-unmark karna bilkul Word Search wali hi discipline hai: ek cell current path ke DAURAAN off-limits hona chahiye (aage-peeche infinite loop chalne se rokne ke liye) par us path ka exploration backtrack hote hi wapas available ho jaana chahiye, kyunki koi doosra path legitimately usse guzar sakta hai. Ek fixed, consistent order (D-L-R-U) mein directions try karna hi discovered paths ke SET ko ORDER mein deterministic banata hai, jis par grader ka exact-match comparison depend karta hai.',
    starter: starter(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));
const out = [];

function backtrack(r, c, path) {
  // record path when (r, c) is the bottom-right cell
}

if (grid[0] && grid[0][0] === 1) backtrack(0, 0, '');
for (const p of out) console.log(p);`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]
out = []


def backtrack(r, c, path):
    # record path when (r, c) is the bottom-right cell
    pass


if grid and grid[0][0] == 1:
    backtrack(0, 0, "")
for p in out:
    print(p)`,
    ),
    solution: solution(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));
const out = [];
const visited = Array.from({ length: n }, () => new Array(n).fill(false));
const dirs = [[1, 0, 'D'], [0, -1, 'L'], [0, 1, 'R'], [-1, 0, 'U']];
function backtrack(r, c, path) {
  if (r === n - 1 && c === n - 1) { out.push(path); return; }
  visited[r][c] = true;
  for (const [dr, dc, ch] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 1 && !visited[nr][nc]) {
      backtrack(nr, nc, path + ch);
    }
  }
  visited[r][c] = false;
}
if (n > 0 && grid[0][0] === 1) backtrack(0, 0, '');
for (const p of out) console.log(p);`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]
out = []
visited = [[False] * n for _ in range(n)]
dirs = [(1, 0, "D"), (0, -1, "L"), (0, 1, "R"), (-1, 0, "U")]


def backtrack(r, c, path):
    if r == n - 1 and c == n - 1:
        out.append(path)
        return
    visited[r][c] = True
    for dr, dc, ch in dirs:
        nr, nc = r + dr, c + dc
        if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 1 and not visited[nr][nc]:
            backtrack(nr, nc, path + ch)
    visited[r][c] = False


if n > 0 and grid[0][0] == 1:
    backtrack(0, 0, "")
for p in out:
    print(p)`,
    ),
    testCases: [
      sample('4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1', 'DDRDRR\nDRDDRR'),
      sample('2\n1 0\n0 1', ''),
      hidden('1\n1', ''),
      hidden('2\n1 1\n0 1', 'RD'),
      hidden('2\n1 0\n1 1', 'DR'),
      hidden('3\n1 1 1\n0 0 1\n1 1 1', 'RRDD'),
    ],
  },

  {
    slug: 'restore-ip-addresses',
    title: 'Restore IP Addresses',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Given a string of digits, return all possible valid IP addresses that can be formed by inserting three dots. Each of the 4 parts must be between 0 and 255, and no part may have a leading zero unless it is exactly "0".\n\n**Input**\nOne line containing the digit string.\n\n**Output**\nOne valid IP address per line, in the order produced by trying part lengths 1, 2, then 3 at each step.',
    descriptionHi:
      'Digits ki ek string di hai. Teen dots insert karke ban sakne wale saare valid IP addresses return karo. Har 4 parts mein se har ek 0 se 255 ke beech hona chahiye, aur koi bhi part leading zero nahi rakh sakta jab tak wo exactly "0" na ho.\n\n**Input**\nEk line jisme digit string hai.\n\n**Output**\nEk line par ek valid IP address, har step par part lengths 1, 2, phir 3 try karke jo order banta hai usi mein.',
    examples: [
      { input: '25525511135', output: '255.255.11.135\n255.255.111.35' },
      { input: '0000', output: '0.0.0.0' },
    ],
    constraints: ['4 <= length <= 12'],
    hints: [
      'Each of the 4 parts can be 1, 2, or 3 digits long — try all three lengths at each step.',
      'A part is valid only if: it is not empty, has no leading zero unless it is exactly "0", and its numeric value is at most 255.',
      'A complete IP address is reached when exactly 4 parts have been formed AND every digit of the input has been used.',
    ],
    approach:
      'Backtrack choosing the length (1, 2, or 3 digits) of each of the 4 parts in turn. At each step, check the candidate part is valid (no invalid leading zero, numeric value `<= 255`) before recursing on the remaining digits with one fewer part left to place. Success requires using every digit exactly once across exactly 4 valid parts.',
    approachHi:
      '4 parts mein se har ek ki length (1, 2, ya 3 digits) baari-baari choose karte hue backtrack karo. Har step par, baaki digits par recurse karne se pehle check karo ki candidate part valid hai (invalid leading zero nahi, numeric value `<= 255`), aur ek part kam bacha rakh kar. Success ke liye exactly 4 valid parts mein har digit exactly ek baar use hona chahiye.',
    timeComplexity: 'O(1) — bounded by at most 3^4 = 81 candidate splits',
    spaceComplexity: 'O(1) — bounded recursion depth of 4',
    solutionExplanation:
      'The search space here is tiny and fixed regardless of input length — only 3 choices (part length) at each of exactly 4 levels — so the real work is entirely in the validity check per candidate part: rejecting leading zeros (except the literal value 0) and values over 255 is what filters the handful of structurally possible splits down to genuinely valid IP addresses, and requiring every digit to be consumed exactly (checked at the base case) rules out leaving leftover unused digits.',
    solutionExplanationHi:
      'Yahan search space chhota aur fixed hai, input length se independent — exactly 4 levels mein se har ek par sirf 3 choices (part length) — isliye asli kaam poori tarah har candidate part ke validity check mein hai: leading zeros ko reject karna (sivaay literal value 0 ke) aur 255 se zyada values ko, structurally possible splits ki mutthi bhar sankhya ko genuinely valid IP addresses tak filter kar deta hai, aur exactly har digit consume hona (base case par check) bache hue unused digits ko rule out karta hai.',
    starter: starter(
      `const s = line(0);
const out = [];

function backtrack(start, parts) {
  // record when parts has 4 pieces AND start === s.length
}

backtrack(0, []);
for (const ip of out) console.log(ip.join('.'));`,
      `s = line(0)
out = []


def backtrack(start, parts):
    # record when parts has 4 pieces and start == len(s)
    pass


backtrack(0, [])
for ip in out:
    print(".".join(ip))`,
    ),
    solution: solution(
      `const s = line(0);
const out = [];
function isValidPart(p) {
  if (p.length === 0 || p.length > 3) return false;
  if (p.length > 1 && p[0] === '0') return false;
  return Number(p) <= 255;
}
(function backtrack(start, parts) {
  if (parts.length === 4) { if (start === s.length) out.push([...parts]); return; }
  for (let len = 1; len <= 3 && start + len <= s.length; len++) {
    const piece = s.slice(start, start + len);
    if (!isValidPart(piece)) continue;
    parts.push(piece);
    backtrack(start + len, parts);
    parts.pop();
  }
})(0, []);
for (const ip of out) console.log(ip.join('.'));`,
      `s = line(0)
out = []


def is_valid_part(p):
    if len(p) == 0 or len(p) > 3:
        return False
    if len(p) > 1 and p[0] == "0":
        return False
    return int(p) <= 255


def backtrack(start, parts):
    if len(parts) == 4:
        if start == len(s):
            out.append(list(parts))
        return
    for length in range(1, 4):
        if start + length > len(s):
            break
        piece = s[start:start + length]
        if not is_valid_part(piece):
            continue
        parts.append(piece)
        backtrack(start + length, parts)
        parts.pop()


backtrack(0, [])
for ip in out:
    print(".".join(ip))`,
    ),
    testCases: [
      sample('25525511135', '255.255.11.135\n255.255.111.35'),
      sample('0000', '0.0.0.0'),
      hidden('101023', '1.0.10.23\n1.0.102.3\n10.1.0.23\n10.10.2.3\n101.0.2.3'),
      hidden('1111', '1.1.1.1'),
      hidden('010010', '0.10.0.10\n0.100.1.0'),
      hidden('999999999999', ''),
    ],
  },

  {
    slug: 'beautiful-arrangement',
    title: 'Beautiful Arrangement',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Count how many permutations of `1, 2, ..., n` are "beautiful": at every 1-indexed position `i`, either `perm[i]` is divisible by `i`, or `i` is divisible by `perm[i]`.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe count of beautiful arrangements.',
    descriptionHi:
      '`1, 2, ..., n` ke kitne permutations "beautiful" hain, count karo: har 1-indexed position `i` par, ya to `perm[i]`, `i` se divisible ho, ya `i`, `perm[i]` se divisible ho.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nBeautiful arrangements ka count.',
    examples: [
      { input: '2', output: '2' },
      { input: '1', output: '1' },
    ],
    constraints: ['1 <= n <= 15'],
    hints: [
      'Build the permutation position by position, from position 1 to n, checking the divisibility condition as each number is placed.',
      'Only try placing numbers that have not been used yet.',
      'Checking the constraint immediately (rather than after building a full permutation) prunes invalid branches early instead of wastefully completing them.',
    ],
    approach:
      'Backtrack building the permutation from position 1 to n. At each position, try every unused number, but only recurse into it if it satisfies the divisibility condition with the current position (either divides it or is divisible by it). Count a completed arrangement (position reaches n+1) as one valid arrangement.',
    approachHi:
      'Position 1 se n tak permutation banate hue backtrack karo. Har position par, har unused number try karo, par sirf tabhi aage recurse karo jab wo current position ke saath divisibility condition satisfy kare (ya to use divide kare ya uska divisible ho). Ek complete arrangement (position n+1 tak pahunche) ko ek valid arrangement ki tarah count karo.',
    timeComplexity: 'Exponential in the worst case, heavily pruned by the divisibility constraint',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'Checking the divisibility condition the moment a number is tentatively placed — rather than only at the very end after a complete permutation is built — is a form of early pruning: an invalid placement at position 3 (say) dooms every possible completion of positions 4 through n, so rejecting it immediately avoids exploring the (n-3)! completions that would all have turned out invalid anyway, which is what keeps this tractable for n up to 15 despite n! growing enormous.',
    solutionExplanationHi:
      'Kisi number ko tentatively place karte hi divisibility condition check karna — sirf poora permutation banne ke baad end mein nahi — ek early pruning hai: position 3 (maan lo) par ek invalid placement, positions 4 se n tak ki har possible completion ko bhi invalid bana deti hai, isliye use turant reject karna un (n-3)! completions ko explore karne se bachaata hai jo vaise bhi invalid nikaltin — yahi cheez n=15 tak ise tractable rakhti hai, n! itna bada hone ke bawajood.',
    starter: starter(
      `const n = num(0);
const used = new Array(n + 1).fill(false);
let count = 0;

function backtrack(pos) {
  // increment count when pos === n + 1
}

backtrack(1);
console.log(count);`,
      `n = num(0)
used = [False] * (n + 1)
count = 0


def backtrack(pos):
    global count
    # increment count when pos == n + 1
    pass


backtrack(1)
print(count)`,
    ),
    solution: solution(
      `const n = num(0);
const used = new Array(n + 1).fill(false);
let count = 0;
function backtrack(pos) {
  if (pos === n + 1) { count++; return; }
  for (let v = 1; v <= n; v++) {
    if (used[v]) continue;
    if (v % pos !== 0 && pos % v !== 0) continue;
    used[v] = true;
    backtrack(pos + 1);
    used[v] = false;
  }
}
backtrack(1);
console.log(count);`,
      `n = num(0)
used = [False] * (n + 1)
count = 0


def backtrack(pos):
    global count
    if pos == n + 1:
        count += 1
        return
    for v in range(1, n + 1):
        if used[v]:
            continue
        if v % pos != 0 and pos % v != 0:
            continue
        used[v] = True
        backtrack(pos + 1)
        used[v] = False


backtrack(1)
print(count)`,
    ),
    testCases: [
      sample('2', '2'),
      sample('1', '1'),
      hidden('3', '3'),
      hidden('4', '8'),
      hidden('5', '10'),
      hidden('6', '36'),
    ],
  },

  {
    slug: 'combination-sum-iii',
    title: 'Combination Sum III',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Find all combinations of exactly `k` distinct numbers from `1` to `9` (each used at most once overall) that sum to `n`. Print each combination ascending, one per line.\n\n**Input**\n- Line 1: `k`\n- Line 2: `n`\n\n**Output**\nOne combination per line.',
    descriptionHi:
      '`1` se `9` tak ke exactly `k` distinct numbers (har ek zyada se zyada ek baar) ke saare combinations dhoondo jinka sum `n` ho. Har combination ascending, ek line par ek, print karo.\n\n**Input**\n- Line 1: `k`\n- Line 2: `n`\n\n**Output**\nEk line par ek combination.',
    examples: [
      { input: '3\n7', output: '1 2 4' },
      { input: '3\n9', output: '1 2 6\n1 3 5\n2 3 4' },
    ],
    constraints: ['1 <= k <= 9', '1 <= n <= 60'],
    hints: [
      'This combines Combination Sum\'s "no reuse" variant with a fixed target COUNT of elements, not just a target sum.',
      'Try numbers 1 through 9 in increasing order, using a start index that always advances (no reuse, no duplicate combinations).',
      'Prune aggressively: stop if the running sum already exceeds n, or if there are not enough remaining numbers (9 - current + 1) to reach k elements.',
    ],
    approach:
      'Backtrack over numbers 1 to 9 with a strictly advancing start index (each number used at most once). A combination is complete when it has exactly `k` numbers AND they sum to `n`. Prune whenever the running sum exceeds `n` or the count already reached `k` without matching the sum.',
    approachHi:
      'Numbers 1 se 9 par ek strictly advancing start index ke saath backtrack karo (har number zyada se zyada ek baar). Combination complete hai jab usmein exactly `k` numbers hon AUR unka sum `n` ho. Jab bhi running sum `n` se zyada ho jaaye ya count `k` tak pahunch jaaye bina sum match kiye, prune karo.',
    timeComplexity: 'O(C(9, k)) — bounded by the small fixed universe of 9 numbers',
    spaceComplexity: 'O(k) recursion depth',
    solutionExplanation:
      'This is Combination Sum II\'s "no reuse, strictly advancing index" discipline (needed here too, since each of 1-9 can be used at most once) combined with an EXTRA constraint Combination Sum never had: the combination must have exactly k elements, not any number of elements summing to the target. Checking both the count and the sum together at the base case (rather than either alone) is what correctly requires both conditions simultaneously.',
    solutionExplanationHi:
      'Ye Combination Sum II wali hi "no reuse, strictly advancing index" discipline hai (yahan bhi zaroori hai, kyunki 1-9 mein se har number zyada se zyada ek baar use ho sakta hai), par ek EXTRA constraint ke saath jo Combination Sum mein kabhi nahi tha: combination mein exactly k elements hone chahiye, target ke barabar sum karne wale kitne bhi elements nahi. Base case par count aur sum dono ko saath check karna (akela nahi) hi dono conditions ko simultaneously sahi tarah require karta hai.',
    starter: starter(
      `const k = num(0), n = num(1);
const out = [];

function backtrack(start, remaining, path) {
  // record path when path.length === k && remaining === 0
}

backtrack(1, n, []);
for (const combo of out) console.log(combo.join(' '));`,
      `k, n = num(0), num(1)
out = []


def backtrack(start, remaining, path):
    # record path when len(path) == k and remaining == 0
    pass


backtrack(1, n, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    solution: solution(
      `const k = num(0), n = num(1);
const out = [];
(function backtrack(start, remaining, path) {
  if (path.length === k) { if (remaining === 0) out.push([...path]); return; }
  for (let v = start; v <= 9; v++) {
    if (v > remaining) break;
    path.push(v);
    backtrack(v + 1, remaining - v, path);
    path.pop();
  }
})(1, n, []);
for (const combo of out) console.log(combo.join(' '));`,
      `k, n = num(0), num(1)
out = []


def backtrack(start, remaining, path):
    if len(path) == k:
        if remaining == 0:
            out.append(list(path))
        return
    for v in range(start, 10):
        if v > remaining:
            break
        path.append(v)
        backtrack(v + 1, remaining - v, path)
        path.pop()


backtrack(1, n, [])
for combo in out:
    print(" ".join(map(str, combo)))`,
    ),
    testCases: [
      sample('3\n7', '1 2 4'),
      sample('3\n9', '1 2 6\n1 3 5\n2 3 4'),
      hidden('1\n5', '5'),
      hidden('9\n45', '1 2 3 4 5 6 7 8 9'),
      hidden('2\n5', '1 4\n2 3'),
      hidden('4\n1', ''),
    ],
  },

  {
    slug: 'split-into-max-unique-substrings',
    title: 'Split a String Into the Max Number of Unique Substrings',
    category: 'Backtracking',
    difficulty: 'MEDIUM',
    description:
      'Split a string into the maximum possible number of substrings such that all the substrings are unique (no two pieces are identical).\n\n**Input**\nOne line containing the string.\n\n**Output**\nThe maximum number of unique substrings achievable.',
    descriptionHi:
      'Ek string ko maximum possible substrings mein todo taaki saare substrings unique hon (koi bhi do pieces identical na hon).\n\n**Input**\nEk line jisme string hai.\n\n**Output**\nMaximum achievable unique substrings ki sankhya.',
    examples: [
      { input: 'ababccc', output: '5', explanation: 'e.g. "a", "b", "ab", "c", "cc".' },
      { input: 'aba', output: '2', explanation: '"a", "ba".' },
    ],
    constraints: ['1 <= length <= 16'],
    hints: [
      'At each position, try every possible length for the next piece, from shortest to longest.',
      'A piece can only be used if it has not already appeared earlier in the current split — track the pieces used so far in a set.',
      'Try adding the piece to the set, recurse, then remove it (backtrack) to try a different length or let a sibling branch reuse that piece elsewhere.',
    ],
    approach:
      'Backtrack over the starting position with a set of substrings already used in the current split. At each position, try every possible next piece length; if that piece is not already in the used set, add it, recurse on the rest of the string, then remove it again (backtrack) before trying the next length. Track the maximum count of pieces across all successful full splits (where the position reaches the end of the string).',
    approachHi:
      'Starting position par backtrack karo, current split mein use hue substrings ka ek set rakhte hue. Har position par, agle piece ki har possible length try karo; agar wo piece used set mein nahi hai, use add karo, baaki string par recurse karo, phir agli length try karne se pehle use wapas hata do (backtrack). Saare successful full splits (jahan position string ke end tak pahunche) mein se pieces ka maximum count track karo.',
    timeComplexity: 'O(2^n * n) worst case',
    spaceComplexity: 'O(n) for the recursion depth and the used-pieces set',
    solutionExplanation:
      'The used-pieces set is what enforces the uniqueness constraint locally at each decision point, and adding-then-removing it around the recursive call (the same backtracking discipline as Word Search\'s visited-cell marking) is what lets a rejected piece choice at one branch become available again for a sibling branch that splits the string differently — without that removal, a substring used in one failed attempt would incorrectly stay "used" for every other attempt too.',
    solutionExplanationHi:
      'Used-pieces set hi har decision point par locally uniqueness constraint enforce karta hai, aur recursive call ke around use add-karke-phir-hataana (bilkul Word Search ki visited-cell marking wali hi backtracking discipline) hi ek rejected piece choice ko ek branch mein, doosre sibling branch ke liye (jo string ko alag tarah split karta hai) dobara available banata hai — us removal ke bina, ek failed attempt mein use hua substring galat tarah se har doosre attempt ke liye bhi "used" reh jaata.',
    starter: starter(
      `const s = line(0);
const used = new Set();
let best = 0;

function backtrack(start, count) {
  // update best when start === s.length; try every next-piece length otherwise
}

backtrack(0, 0);
console.log(best);`,
      `s = line(0)
used = set()
best = 0


def backtrack(start, count):
    global best
    # update best when start == len(s); try every next-piece length otherwise
    pass


backtrack(0, 0)
print(best)`,
    ),
    solution: solution(
      `const s = line(0);
const used = new Set();
let best = 0;
function backtrack(start, count) {
  if (start === s.length) { best = Math.max(best, count); return; }
  for (let end = start + 1; end <= s.length; end++) {
    const piece = s.slice(start, end);
    if (used.has(piece)) continue;
    used.add(piece);
    backtrack(end, count + 1);
    used.delete(piece);
  }
}
backtrack(0, 0);
console.log(best);`,
      `s = line(0)
used = set()
best = 0


def backtrack(start, count):
    global best
    if start == len(s):
        best = max(best, count)
        return
    for end in range(start + 1, len(s) + 1):
        piece = s[start:end]
        if piece in used:
            continue
        used.add(piece)
        backtrack(end, count + 1)
        used.discard(piece)


backtrack(0, 0)
print(best)`,
    ),
    testCases: [
      sample('ababccc', '5'),
      sample('aba', '2'),
      hidden('aa', '1'),
      hidden('abc', '3'),
      hidden('wwwzfvedwfvhsww', '11'),
      hidden('a', '1'),
    ],
  },
];
