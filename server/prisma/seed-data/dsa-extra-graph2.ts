import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Graph — expansion batch, part 2 of 2. Weighted-graph algorithms (Dijkstra,
 * Bellman-Ford-style relaxation, Kruskal's MST via Union-Find), grid-flow
 * problems (surrounded regions, walls and gates, pacific-atlantic, shortest
 * path in a binary matrix), BFS-over-strings (word ladder), and two problems
 * that need every path rather than reachability (all paths, Eulerian-circuit
 * itinerary reconstruction).
 */
export const dsaExtraGraph2: SeedProblem[] = [
  {
    slug: 'surrounded-regions',
    title: 'Surrounded Regions',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given an `rows x cols` board of `X` and `O`, capture (flip to `X`) every region of `O`s that is NOT connected (4-directionally) to a border `O`.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: a string of `X`/`O` characters\n\n**Output**\nThe board after capturing, one row per line.',
    descriptionHi:
      '`X` aur `O` ka ek `rows x cols` board diya hai. Har us `O` region ko capture karo (flip to `X`) jo kisi border `O` se (4-directionally) connected NAHI hai.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `X`/`O` characters ki ek string\n\n**Output**\nCapture karne ke baad board, ek row per line.',
    examples: [
      { input: '4 4\nXXXX\nXOOX\nXXOX\nXOXX', output: 'XXXX\nXXXX\nXXXX\nXOXX' },
    ],
    constraints: ['1 <= rows, cols <= 200'],
    hints: [
      'A region of Os survives if and only if it can reach the border — so it is easier to find the SURVIVORS first, then flip everything else.',
      'Run a flood fill from every O on the border, marking every O it reaches as "safe".',
      'Any O never marked safe is fully surrounded — flip it to X; any O marked safe stays O.',
    ],
    approach:
      "Flip the problem: instead of detecting surrounded regions directly, flood-fill (DFS/BFS) from every border cell that is O, marking the whole connected region as safe. After that, any O not marked safe is necessarily surrounded (it never reached the border), so flip it to X; safe cells stay O.",
    approachHi:
      "Problem ko flip karo: surrounded regions seedhe detect karne ke bajaye, har border cell jo O hai wahan se flood-fill (DFS/BFS) karo, poore connected region ko safe mark karte hue. Uske baad, jo bhi O safe mark nahi hua wo zaroori taur par surrounded hai (kabhi border tak nahi pahuncha), use X mein flip karo; safe cells O hi rehti hain.",
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols)',
    solutionExplanation:
      'Directly checking "is this O surrounded" for every O independently would mean re-exploring the same regions over and over. Flipping the question to "which Os can reach the border" turns it into a single flood-fill pass seeded from all border Os at once — everything reached is provably safe (there exists a path to the border avoiding X), and by contrapositive everything not reached is provably surrounded, so a final single sweep can classify every cell in one pass.',
    solutionExplanationHi:
      'Har O ke liye independently "kya ye surrounded hai" directly check karne ka matlab hoga same regions baar-baar explore karna. Sawaal ko "kaunse Os border tak pahunch sakte hain" mein flip karna ise ek single flood-fill pass banata hai jo saare border Os se ek saath seed hota hai — jo bhi reach hota hai wo provably safe hai (border tak X avoid karke ek path exist karta hai), aur contrapositive se jo reach nahi hota wo provably surrounded hai, isliye ek final single sweep har cell classify kar sakta hai.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(line(1 + i).split(''));

function solve(grid) {
  // mutate grid in place
}

solve(grid);
console.log(grid.map((row) => row.join('')).join('\\n'));`,
      `rows, cols = nums(0)
grid = [list(line(1 + i)) for i in range(rows)]

def solve(grid):
    # mutate grid in place
    pass

solve(grid)
print("\\n".join("".join(row) for row in grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(line(1 + i).split(''));
function solve(grid) {
  const rows = grid.length, cols = grid[0].length;
  const safe = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function fill(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || safe[r][c] || grid[r][c] !== 'O') return;
    safe[r][c] = true;
    fill(r + 1, c); fill(r - 1, c); fill(r, c + 1); fill(r, c - 1);
  }
  for (let r = 0; r < rows; r++) { fill(r, 0); fill(r, cols - 1); }
  for (let c = 0; c < cols; c++) { fill(0, c); fill(rows - 1, c); }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === 'O' && !safe[r][c]) grid[r][c] = 'X';
}
solve(grid);
console.log(grid.map((row) => row.join('')).join('\\n'));`,
      `import sys
sys.setrecursionlimit(100000)
rows, cols = nums(0)
grid = [list(line(1 + i)) for i in range(rows)]

def solve(grid):
    rows, cols = len(grid), len(grid[0])
    safe = [[False] * cols for _ in range(rows)]

    def fill(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or safe[r][c] or grid[r][c] != 'O':
            return
        safe[r][c] = True
        fill(r + 1, c); fill(r - 1, c); fill(r, c + 1); fill(r, c - 1)

    for r in range(rows):
        fill(r, 0); fill(r, cols - 1)
    for c in range(cols):
        fill(0, c); fill(rows - 1, c)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 'O' and not safe[r][c]:
                grid[r][c] = 'X'

solve(grid)
print("\\n".join("".join(row) for row in grid))`,
    ),
    testCases: [
      sample('4 4\nXXXX\nXOOX\nXXOX\nXOXX', 'XXXX\nXXXX\nXXXX\nXOXX'),
      hidden('1 1\nO', 'O'),
      hidden('3 3\nOOO\nOOO\nOOO', 'OOO\nOOO\nOOO'),
      hidden('3 3\nXXX\nXOX\nXXX', 'XXX\nXXX\nXXX'),
      hidden('2 2\nOO\nOO', 'OO\nOO'),
    ],
  },

  {
    slug: 'walls-and-gates',
    title: 'Walls and Gates',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      "Given a grid where `0` is a gate, `-1` is a wall, and `2147483647` (INF) is an empty room, fill every empty room with the distance to its nearest gate (or leave it INF if unreachable).\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated integers\n\n**Output**\nThe filled grid, one row per line, space-separated.",
    descriptionHi:
      "Ek grid diya hai jahan `0` gate hai, `-1` wall hai, aur `2147483647` (INF) ek empty room hai. Har empty room ko uske nearest gate ki distance se bharo (ya INF hi rehne do agar unreachable hai).\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated integers\n\n**Output**\nFilled grid, ek row per line, space-separated.",
    examples: [
      { input: '4 4\n2147483647 -1 0 2147483647\n2147483647 2147483647 2147483647 -1\n2147483647 -1 2147483647 -1\n0 -1 2147483647 2147483647', output: '3 -1 0 1\n2 2 1 -1\n1 -1 2 -1\n0 -1 3 4' },
    ],
    constraints: ['1 <= rows, cols <= 200'],
    hints: [
      'A single-source shortest-path-from-one-gate BFS is wasteful with multiple gates — instead run a MULTI-source BFS starting from ALL gates at once.',
      'Push every gate into the queue first (distance 0), then BFS outward level by level; the first time a room is reached is necessarily via the shortest path from SOME gate.',
      'Never step through walls, and never re-visit a room whose distance has already been set.',
    ],
    approach:
      'Multi-source BFS: seed the queue with every gate cell (distance 0) simultaneously, then expand outward one layer at a time, skipping walls and already-filled rooms. Because BFS explores in increasing distance order, the first time any room is reached is guaranteed to be its shortest distance to the nearest gate.',
    approachHi:
      'Multi-source BFS: queue ko har gate cell se (distance 0) ek saath seed karo, phir ek layer at a time outward expand karo, walls aur pehle-se-filled rooms skip karte hue. Kyunki BFS increasing distance order mein explore karta hai, kisi bhi room tak pehli baar pahunchna uske nearest gate tak shortest distance guaranteed hota hai.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols)',
    solutionExplanation:
      'Running a separate BFS from each gate and taking a minimum would work but redoes shared work across overlapping frontiers; starting a single BFS from ALL gates at once, all at "distance 0", merges those frontiers for free — BFS layer order guarantees the first time a room is dequeued is via the globally nearest gate, so one pass fills every room optimally with no extra bookkeeping needed to compare distances from different gates.',
    solutionExplanationHi:
      'Har gate se alag BFS chalana aur minimum lena kaam karega lekin overlapping frontiers ka shared kaam dobara karta hai; ek hi BFS ko saare gates se ek saath, sab "distance 0" par, shuru karna un frontiers ko free mein merge kar deta hai — BFS ka layer order guarantee karta hai ki kisi room ka pehli baar dequeue hona globally nearest gate ke through hota hai, isliye ek hi pass har room ko optimally bhar deta hai bina alag gates se distances compare karne ki extra bookkeeping ke.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function wallsAndGates(grid) {
  // mutate grid in place
}

wallsAndGates(grid);
console.log(grid.map((row) => row.join(' ')).join('\\n'));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def walls_and_gates(grid):
    # mutate grid in place
    pass

walls_and_gates(grid)
print("\\n".join(" ".join(map(str, row)) for row in grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
function wallsAndGates(grid) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === 0) queue.push([r, c]);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let qi = 0;
  while (qi < queue.length) {
    const [r, c] = queue[qi++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] !== 2147483647) continue;
      grid[nr][nc] = grid[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
}
wallsAndGates(grid);
console.log(grid.map((row) => row.join(' ')).join('\\n'));`,
      `from collections import deque
rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def walls_and_gates(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque((r, c) for r in range(rows) for c in range(cols) if grid[r][c] == 0)
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    while q:
        r, c = q.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 2147483647:
                grid[nr][nc] = grid[r][c] + 1
                q.append((nr, nc))

walls_and_gates(grid)
print("\\n".join(" ".join(map(str, row)) for row in grid))`,
    ),
    testCases: [
      sample(
        '4 4\n2147483647 -1 0 2147483647\n2147483647 2147483647 2147483647 -1\n2147483647 -1 2147483647 -1\n0 -1 2147483647 2147483647',
        '3 -1 0 1\n2 2 1 -1\n1 -1 2 -1\n0 -1 3 4',
      ),
      hidden('1 1\n0', '0'),
      hidden('1 1\n2147483647', '2147483647'),
      hidden('1 3\n0 -1 2147483647', '0 -1 2147483647'),
      hidden('2 2\n0 2147483647\n2147483647 2147483647', '0 1\n1 2'),
    ],
  },

  {
    slug: 'shortest-path-in-binary-matrix',
    title: 'Shortest Path in Binary Matrix',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given an `n x n` grid of 0s and 1s, find the length of the shortest clear path (8-directionally connected, only through 0 cells) from top-left to bottom-right, counting cells visited. Return -1 if no such path exists.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `n` space-separated 0/1 values\n\n**Output**\nThe path length, or `-1`.',
    descriptionHi:
      '`n x n` grid mein 0s aur 1s diye hain. Top-left se bottom-right tak sabse chhota clear path (8-directionally connected, sirf 0 cells se hokar) dhoondo, visited cells count karte hue. Agar aisa koi path nahi hai to -1 return karo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `n` space-separated 0/1 values\n\n**Output**\nPath length, ya `-1`.',
    examples: [
      { input: '3\n0 1 0\n0 0 0\n0 1 0', output: '3' },
      { input: '2\n0 1\n1 0', output: '2' },
    ],
    constraints: ['1 <= n <= 100'],
    hints: [
      'Unlike most grid problems, movement here is 8-directional (includes diagonals), not just 4-directional.',
      'A plain BFS from (0,0), where every move costs exactly 1 cell, finds the shortest path length in an unweighted graph exactly like any other grid-BFS.',
      'The start and end cells must themselves be 0, and if start === end that is trivially a path of length 1.',
    ],
    approach:
      'BFS from (0,0), exploring all 8 neighbors of each cell (marking visited to avoid revisits), tracking path length as the BFS layer. The first time (n-1, n-1) is dequeued gives the shortest path length; if the queue empties without reaching it, return -1.',
    approachHi:
      '(0,0) se BFS karo, har cell ke saare 8 neighbors explore karte hue (revisits avoid karne ke liye visited mark karte hue), path length ko BFS layer ki tarah track karte hue. Jab (n-1, n-1) pehli baar dequeue ho wahi shortest path length hai; agar queue khaali ho jaaye bina wahan pahunche, -1 return karo.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(n^2)',
    solutionExplanation:
      'Because every move in this grid — including diagonal ones — has identical cost (moving to any of up to 8 neighboring cells counts as exactly one more step), the problem is still unweighted-shortest-path, just over a denser adjacency than the usual 4-directional grid; BFS remains correct and optimal for exactly the same reason it always is on unweighted graphs — it explores in strictly increasing distance order, so the destination\'s first-dequeue distance is its true shortest distance.',
    solutionExplanationHi:
      'Kyunki is grid mein har move — diagonal wale bhi — ka cost same hai (8 tak neighboring cells mein se kisi bhi ek tak jaana exactly ek extra step count hota hai), problem abhi bhi unweighted-shortest-path hi hai, bas usual 4-directional grid se zyada dense adjacency ke saath; BFS wahi reason se correct aur optimal rehta hai jis reason se wo hamesha unweighted graphs par hota hai — wo strictly increasing distance order mein explore karta hai, isliye destination ki first-dequeue distance uski true shortest distance hoti hai.',
    starter: starter(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));

function shortestPathBinaryMatrix(grid) {
  // return the path length, or -1
  return -1;
}

console.log(shortestPathBinaryMatrix(grid));`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]

def shortest_path_binary_matrix(grid):
    # return the path length, or -1
    return -1

print(shortest_path_binary_matrix(grid))`,
    ),
    solution: solution(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  visited[0][0] = true;
  let queue = [[0, 0]];
  let dist = 1;
  while (queue.length) {
    const next = [];
    for (const [r, c] of queue) {
      if (r === n - 1 && c === n - 1) return dist;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n || visited[nr][nc] || grid[nr][nc] !== 0) continue;
        visited[nr][nc] = true;
        next.push([nr, nc]);
      }
    }
    queue = next;
    dist++;
  }
  return -1;
}
console.log(shortestPathBinaryMatrix(grid));`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]

def shortest_path_binary_matrix(grid):
    n = len(grid)
    if grid[0][0] != 0 or grid[n - 1][n - 1] != 0:
        return -1
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    visited = [[False] * n for _ in range(n)]
    visited[0][0] = True
    queue = [(0, 0)]
    dist = 1
    while queue:
        nxt = []
        for r, c in queue:
            if r == n - 1 and c == n - 1:
                return dist
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc] and grid[nr][nc] == 0:
                    visited[nr][nc] = True
                    nxt.append((nr, nc))
        queue = nxt
        dist += 1
    return -1

print(shortest_path_binary_matrix(grid))`,
    ),
    testCases: [
      sample('3\n0 1 0\n0 0 0\n0 1 0', '3'),
      sample('2\n0 1\n1 0', '2'),
      hidden('1\n0', '1'),
      hidden('1\n1', '-1'),
      hidden('3\n0 0 0\n1 1 0\n1 1 0', '4'),
      hidden('2\n1 0\n0 0', '-1'),
    ],
  },

  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    category: 'Graph',
    difficulty: 'HARD',
    description:
      'Given a `beginWord`, an `endWord`, and a word list, find the length of the shortest transformation sequence from `beginWord` to `endWord`, changing exactly one letter at a time, with every intermediate word required to be in the word list. Return 0 if no such sequence exists.\n\n**Input**\n- Line 1: `beginWord endWord`\n- Line 2: `count`\n- Line 3: `count` space-separated words (the word list)\n\n**Output**\nThe sequence length (number of words including begin and end), or `0`.',
    descriptionHi:
      'Ek `beginWord`, ek `endWord`, aur ek word list di hai. `beginWord` se `endWord` tak sabse chhoti transformation sequence ki length dhoondo, har baar exactly ek letter badalte hue, jahan har intermediate word word list mein hona zaroori hai. Agar aisi koi sequence nahi hai to 0 return karo.\n\n**Input**\n- Line 1: `beginWord endWord`\n- Line 2: `count`\n- Line 3: `count` space-separated words (word list)\n\n**Output**\nSequence length (begin aur end included), ya `0`.',
    examples: [
      { input: 'hit cog\n6\nhot dot dog lot log cog', output: '5' },
      { input: 'hit cog\n5\nhot dot dog lot log', output: '0' },
    ],
    constraints: ['1 <= beginWord.length <= 10', 'all words same length'],
    hints: [
      'Treat every word as a node; an edge connects two words that differ by exactly one letter — this is BFS shortest-path on an implicit graph.',
      "Rather than comparing every pair of words to find one-letter-different neighbors, generate a word's neighbors directly by trying every letter at every position, and check set membership in the word list.",
      'endWord itself must be present in the word list, or no valid sequence can end there.',
    ],
    approach:
      "BFS from beginWord. At each word, generate all possible one-letter-substitution variants (26 letters at each position) and check which are in the word set (removing them once visited, since BFS already finds them at minimum distance). The first time endWord is generated, the current BFS depth + 1 is the answer; if the queue exhausts without finding it, return 0.",
    approachHi:
      "beginWord se BFS karo. Har word par, saare possible one-letter-substitution variants generate karo (har position par 26 letters try karke) aur check karo kaunse word set mein hain (visit hone par hata do, kyunki BFS already unhe minimum distance par dhoondh leta hai). Jab pehli baar endWord generate ho, current BFS depth + 1 hi answer hai; agar queue khatam ho jaaye bina use dhoonde, 0 return karo.",
    timeComplexity: 'O(words * wordLength^2 * 26)',
    spaceComplexity: 'O(words * wordLength)',
    solutionExplanation:
      "The transformation graph is never built explicitly — building it upfront by comparing every pair of words is O(words^2 * length), wasteful when most pairs aren't neighbors. Instead, each word's neighbors are generated on the fly (26 letters x each position) and tested for set membership, which is asymptotically cheaper when the word length is small relative to the dictionary size; removing a word from the set once discovered both prevents revisits and keeps neighbor-generation cheap as the search progresses, and because BFS still explores in strictly increasing depth order, the first time endWord is generated is still guaranteed to be via the shortest transformation sequence.",
    solutionExplanationHi:
      "Transformation graph kabhi explicitly nahi banaya jaata — use upfront har pair of words compare karke banana O(words^2 * length) hota, wasteful jab zyadatar pairs neighbors nahi hote. Iske bajaye, har word ke neighbors on the fly generate hote hain (26 letters x har position) aur set membership ke liye test hote hain, jo asymptotically sasta hai jab word length dictionary size ke comparison mein chhota ho; discover hote hi ek word ko set se hata dena dono revisits rokta hai aur search aage badhne par neighbor-generation sasta rakhta hai, aur kyunki BFS abhi bhi strictly increasing depth order mein explore karta hai, endWord ka pehli baar generate hona abhi bhi shortest transformation sequence ke through guaranteed hai.",
    starter: starter(
      `const [beginWord, endWord] = words(0);
const count = num(1);
const wordList = words(2);

function ladderLength(beginWord, endWord, wordList) {
  // return the sequence length, or 0
  return 0;
}

console.log(ladderLength(beginWord, endWord, wordList));`,
      `beginWord, endWord = words(0)
count = num(1)
word_list = words(2)

def ladder_length(begin_word, end_word, word_list):
    # return the sequence length, or 0
    return 0

print(ladder_length(beginWord, endWord, word_list))`,
    ),
    solution: solution(
      `const [beginWord, endWord] = words(0);
const count = num(1);
const wordList = words(2);
function ladderLength(beginWord, endWord, wordList) {
  const dict = new Set(wordList);
  if (!dict.has(endWord)) return 0;
  dict.delete(beginWord);
  let queue = [beginWord];
  let depth = 1;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  while (queue.length) {
    const next = [];
    for (const word of queue) {
      if (word === endWord) return depth;
      const chars = word.split('');
      for (let i = 0; i < chars.length; i++) {
        const original = chars[i];
        for (const ch of alphabet) {
          if (ch === original) continue;
          chars[i] = ch;
          const candidate = chars.join('');
          if (dict.has(candidate)) { dict.delete(candidate); next.push(candidate); }
        }
        chars[i] = original;
      }
    }
    queue = next;
    depth++;
  }
  return 0;
}
console.log(ladderLength(beginWord, endWord, wordList));`,
      `beginWord, endWord = words(0)
count = num(1)
word_list = words(2)

def ladder_length(begin_word, end_word, word_list):
    dict_words = set(word_list)
    if end_word not in dict_words:
        return 0
    dict_words.discard(begin_word)
    queue = [begin_word]
    depth = 1
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    while queue:
        nxt = []
        for word in queue:
            if word == end_word:
                return depth
            chars = list(word)
            for i in range(len(chars)):
                original = chars[i]
                for ch in alphabet:
                    if ch == original:
                        continue
                    chars[i] = ch
                    candidate = "".join(chars)
                    if candidate in dict_words:
                        dict_words.discard(candidate)
                        nxt.append(candidate)
                chars[i] = original
        queue = nxt
        depth += 1
    return 0

print(ladder_length(beginWord, endWord, word_list))`,
    ),
    testCases: [
      sample('hit cog\n6\nhot dot dog lot log cog', '5'),
      sample('hit cog\n5\nhot dot dog lot log', '0'),
      hidden('a c\n2\na c', '2'),
      hidden('a c\n1\nb', '0'),
      hidden('hot dog\n3\nhot dog dot', '3'),
      hidden('same same\n1\nsame', '1'),
    ],
  },

  {
    slug: 'network-delay-time',
    title: 'Network Delay Time',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'A signal is sent from node `k` through a network of `n` nodes (1-indexed) with weighted directed edges `u v w` (w = travel time). Return the time for the signal to reach ALL nodes, or -1 if that is impossible.\n\n**Input**\n- Line 1: `n k`\n- Line 2: `m`\n- Next `m` lines: `u v w`\n\n**Output**\nThe minimum time for all nodes to receive the signal, or `-1`.',
    descriptionHi:
      'Ek signal node `k` se `n` nodes (1-indexed) wale network mein weighted directed edges `u v w` (w = travel time) ke through bheja jaata hai. Signal ko SAARE nodes tak pahunchne ka time return karo, ya -1 agar ye impossible hai.\n\n**Input**\n- Line 1: `n k`\n- Line 2: `m`\n- Agli `m` lines: `u v w`\n\n**Output**\nSaare nodes tak signal pahunchne ka minimum time, ya `-1`.',
    examples: [
      { input: '4 2\n4\n2 1 1\n2 3 1\n3 4 1\n1 4 1', output: '2' },
      { input: '2 1\n1\n1 2 1', output: '1' },
      { input: '2 2\n0\n', output: '-1' },
    ],
    constraints: ['1 <= n <= 100', '1 <= w <= 100'],
    hints: [
      'This is the classic single-source shortest-path problem with weighted edges — plain BFS no longer works since edges have different costs.',
      "Dijkstra's algorithm: always expand the closest not-yet-finalized node next, using a priority queue (or, at this size, a simple linear scan for the minimum).",
      "The answer is the MAXIMUM of all nodes' shortest distances from k (since we need the signal to reach the LAST node) — or -1 if any node is unreachable.",
    ],
    approach:
      "Dijkstra's algorithm from node k: maintain a distance array initialized to infinity (0 for k itself), repeatedly pick the unvisited node with the smallest known distance, relax all its outgoing edges, and mark it visited. After all nodes are settled, the answer is the maximum distance across all nodes (or -1 if any remains infinity).",
    approachHi:
      "Node k se Dijkstra's algorithm: ek distance array rakho jo infinity se initialize ho (khud k ke liye 0), baar-baar sabse chhoti known distance wala unvisited node choose karo, uske saare outgoing edges relax karo, aur use visited mark karo. Saare nodes settle hone ke baad, answer saare nodes ki maximum distance hai (ya -1 agar koi abhi bhi infinity par hai).",
    timeComplexity: 'O(n^2 + m) with a linear-scan Dijkstra (fine at this constraint size), O((n+m) log n) with a heap',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      "Because edge weights differ, BFS's guarantee (exploring in strictly increasing distance order) no longer holds for a plain queue — a node reached via more hops but lower total weight can still be closer. Dijkstra restores that same greedy-correctness guarantee for weighted graphs by always finalizing the globally closest remaining node next (which is provably never going to be improved upon later, since all other edge weights are non-negative), and once every node has its true shortest distance from k, the time for the signal to reach ALL of them is simply bounded by whichever node is farthest — the maximum, not the sum, since transmissions to different nodes happen in parallel along the shortest-path tree.",
    solutionExplanationHi:
      "Kyunki edge weights alag-alag hain, BFS ki guarantee (strictly increasing distance order mein explore karna) ek plain queue ke liye ab valid nahi rehti — zyada hops lekin kam total weight se pahuncha gaya node phir bhi closer ho sakta hai. Dijkstra weighted graphs ke liye wahi greedy-correctness guarantee restore karta hai, hamesha globally sabse close bache hue node ko next finalize karke (jo provably baad mein kabhi improve nahi hoga, kyunki saare edge weights non-negative hain), aur jab har node ki k se true shortest distance mil jaaye, saare nodes tak signal pahunchne ka time bas sabse door wale node se bound hota hai — maximum, sum nahi, kyunki alag-alag nodes tak transmissions shortest-path tree ke along parallel mein hote hain.",
    starter: starter(
      `const [n, k] = nums(0);
const m = num(1);
const times = [];
for (let i = 0; i < m; i++) times.push(nums(2 + i));

function networkDelayTime(times, n, k) {
  // return the delay, or -1
  return -1;
}

console.log(networkDelayTime(times, n, k));`,
      `n, k = nums(0)
m = num(1)
times = [nums(2 + i) for i in range(m)]

def network_delay_time(times, n, k):
    # return the delay, or -1
    return -1

print(network_delay_time(times, n, k))`,
    ),
    solution: solution(
      `const [n, k] = nums(0);
const m = num(1);
const times = [];
for (let i = 0; i < m; i++) times.push(nums(2 + i));
function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const visited = new Array(n + 1).fill(false);
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 1; i <= n; i++) if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = true;
    for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  }
  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxDist = Math.max(maxDist, dist[i]);
  }
  return maxDist;
}
console.log(networkDelayTime(times, n, k));`,
      `n, k = nums(0)
m = num(1)
times = [nums(2 + i) for i in range(m)]

def network_delay_time(times, n, k):
    adj = [[] for _ in range(n + 1)]
    for u, v, w in times:
        adj[u].append((v, w))
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    visited = [False] * (n + 1)
    for _ in range(n):
        u = -1
        for i in range(1, n + 1):
            if not visited[i] and (u == -1 or dist[i] < dist[u]):
                u = i
        if u == -1 or dist[u] == float('inf'):
            break
        visited[u] = True
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    max_dist = 0
    for i in range(1, n + 1):
        if dist[i] == float('inf'):
            return -1
        max_dist = max(max_dist, dist[i])
    return max_dist

print(network_delay_time(times, n, k))`,
    ),
    testCases: [
      sample('4 2\n4\n2 1 1\n2 3 1\n3 4 1\n1 4 1', '2'),
      sample('2 1\n1\n1 2 1', '1'),
      sample('2 2\n0\n', '-1'),
      hidden('1 1\n0\n', '0'),
      hidden('3 1\n2\n1 2 5\n2 3 5', '10'),
      hidden('3 1\n1\n1 2 3', '-1'),
    ],
  },

  {
    slug: 'cheapest-flights-within-k-stops',
    title: 'Cheapest Flights Within K Stops',
    category: 'Graph',
    difficulty: 'HARD',
    description:
      'Given `n` cities (0-indexed), directed weighted flights `u v price`, a `src`, a `dst`, and `k` (max allowed stops, i.e. up to k+1 edges), find the cheapest price from `src` to `dst` using at most `k` stops. Return -1 if impossible.\n\n**Input**\n- Line 1: `n src dst k`\n- Line 2: `m`\n- Next `m` lines: `u v price`\n\n**Output**\nThe cheapest price, or `-1`.',
    descriptionHi:
      '`n` cities (0-indexed), directed weighted flights `u v price`, ek `src`, ek `dst`, aur `k` (max allowed stops, matlab k+1 tak edges) diye hain. `src` se `dst` tak, zyada se zyada `k` stops use karke, sabse sasta price dhoondo. Agar impossible hai to -1 return karo.\n\n**Input**\n- Line 1: `n src dst k`\n- Line 2: `m`\n- Agli `m` lines: `u v price`\n\n**Output**\nSabse sasta price, ya `-1`.',
    examples: [
      { input: '4 0 3 1\n4\n0 1 100\n1 2 100\n2 3 100\n0 3 500', output: '500' },
      { input: '3 0 2 1\n3\n0 1 100\n1 2 100\n0 2 500', output: '200' },
    ],
    constraints: ['1 <= n <= 100', '0 <= k <= n - 1'],
    hints: [
      'Plain Dijkstra does not directly respect a stop LIMIT, since it only tracks cheapest cost, not cost-at-a-given-hop-count.',
      "This is exactly Bellman-Ford's edge-relaxation idea, capped to exactly k+1 rounds — relaxing every edge once per round, where each round represents allowing one more stop.",
      'Relax from a snapshot of the PREVIOUS round\'s distances (not distances already updated this round), so a single round never lets a path use more than one new edge.',
    ],
    approach:
      "Bounded Bellman-Ford: run exactly k+1 rounds of edge relaxation (k+1 because k stops means k+1 edges are allowed). In each round, relax every edge using a snapshot of the distance array from the START of that round (so within one round, no path uses two edges from this round's updates) — this way, after r rounds, dist[city] holds the cheapest cost reachable using at most r edges.",
    approachHi:
      "Bounded Bellman-Ford: exactly k+1 rounds edge relaxation ke chalao (k+1 kyunki k stops ka matlab k+1 edges allowed hain). Har round mein, distance array ke us round ke START ke snapshot se har edge relax karo (taaki ek round ke andar, koi bhi path is round ke updates se do edges use na kare) — is tarah, r rounds ke baad, dist[city] mein at most r edges use karke reachable sabse sasta cost hota hai.",
    timeComplexity: 'O(k * m)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      "Dijkstra's greedy finalize-the-closest-node strategy has no notion of \"how many edges did it take to get here,\" so it cannot enforce a stop cap. Bellman-Ford's round-based relaxation naturally does: after exactly r full rounds of relaxing every edge, the distance array is guaranteed correct for paths of at most r edges, which is exactly the quantity this problem bounds — so simply stopping after k+1 rounds (not running to full convergence) directly encodes the stop limit; taking a snapshot before each round prevents a single round from chaining two relaxations together and silently using an extra hop.",
    solutionExplanationHi:
      "Dijkstra ki greedy finalize-the-closest-node strategy ko ye pata nahi hota ki \"yahan tak pahunchne mein kitne edges lage\", isliye wo stop cap enforce nahi kar sakti. Bellman-Ford ka round-based relaxation naturally ye karta hai: exactly r poore rounds har edge relax karne ke baad, distance array at most r edges wale paths ke liye guaranteed correct hota hai, jo exactly wahi quantity hai jo ye problem bound karta hai — isliye bas k+1 rounds ke baad rukna (full convergence tak chalaye bina) directly stop limit encode karta hai; har round se pehle ek snapshot lena ek single round ko do relaxations chain karke chupke se ek extra hop use karne se rokta hai.",
    starter: starter(
      `const [n, src, dst, k] = nums(0);
const m = num(1);
const flights = [];
for (let i = 0; i < m; i++) flights.push(nums(2 + i));

function findCheapestPrice(n, flights, src, dst, k) {
  // return the cheapest price, or -1
  return -1;
}

console.log(findCheapestPrice(n, flights, src, dst, k));`,
      `n, src, dst, k = nums(0)
m = num(1)
flights = [nums(2 + i) for i in range(m)]

def find_cheapest_price(n, flights, src, dst, k):
    # return the cheapest price, or -1
    return -1

print(find_cheapest_price(n, flights, src, dst, k))`,
    ),
    solution: solution(
      `const [n, src, dst, k] = nums(0);
const m = num(1);
const flights = [];
for (let i = 0; i < m; i++) flights.push(nums(2 + i));
function findCheapestPrice(n, flights, src, dst, k) {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {
    const next = dist.slice();
    for (const [u, v, price] of flights) {
      if (dist[u] !== Infinity && dist[u] + price < next[v]) next[v] = dist[u] + price;
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}
console.log(findCheapestPrice(n, flights, src, dst, k));`,
      `n, src, dst, k = nums(0)
m = num(1)
flights = [nums(2 + i) for i in range(m)]

def find_cheapest_price(n, flights, src, dst, k):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(k + 1):
        nxt = dist[:]
        for u, v, price in flights:
            if dist[u] != float('inf') and dist[u] + price < nxt[v]:
                nxt[v] = dist[u] + price
        dist = nxt
    return -1 if dist[dst] == float('inf') else dist[dst]

print(find_cheapest_price(n, flights, src, dst, k))`,
    ),
    testCases: [
      sample('4 0 3 1\n4\n0 1 100\n1 2 100\n2 3 100\n0 3 500', '500'),
      sample('3 0 2 1\n3\n0 1 100\n1 2 100\n0 2 500', '200'),
      hidden('2 0 1 0\n1\n0 1 5', '5'),
      hidden('2 0 1 0\n0\n', '-1'),
      hidden('3 0 2 0\n2\n0 1 10\n1 2 10', '-1'),
      hidden('5 0 4 4\n5\n0 1 1\n1 2 1\n2 3 1\n3 4 1\n0 4 100', '4'),
    ],
  },

  {
    slug: 'connecting-cities-with-minimum-cost',
    title: 'Connecting Cities With Minimum Cost',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'There are `n` cities (1 to n) and candidate connections `u v cost`. Find the minimum total cost to connect all cities (so every city can reach every other), or -1 if it is impossible.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m`\n- Next `m` lines: `u v cost`\n\n**Output**\nThe minimum total cost, or `-1`.',
    descriptionHi:
      '`n` cities (1 se n) aur candidate connections `u v cost` diye hain. Saare cities ko connect karne ka minimum total cost dhoondo (taaki har city har doosri city tak pahunch sake), ya -1 agar impossible hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m`\n- Agli `m` lines: `u v cost`\n\n**Output**\nMinimum total cost, ya `-1`.',
    examples: [
      { input: '3\n3\n1 2 5\n1 3 6\n2 3 1', output: '6' },
      { input: '4\n2\n1 2 3\n3 4 4', output: '-1' },
    ],
    constraints: ['1 <= n <= 10^4', '1 <= cost <= 10^6'],
    hints: [
      'Connecting all cities as cheaply as possible with no cycles required is exactly the Minimum Spanning Tree problem.',
      "Kruskal's algorithm: sort all candidate connections by cost, then greedily add each one if (and only if) its two endpoints are not already connected — Union-Find answers that check in near-constant time.",
      'If, after considering every edge, fewer than n-1 connections were actually used, the cities cannot all be connected — return -1.',
    ],
    approach:
      "Kruskal's MST algorithm. Sort all edges by cost ascending. Use Union-Find: for each edge in sorted order, if its endpoints are in different components, union them and add the cost to the total (this edge is provably part of some minimum spanning tree). Stop early once n-1 edges have been used. If fewer than n-1 edges were ever added, the graph is disconnected — return -1.",
    approachHi:
      "Kruskal's MST algorithm. Saare edges ko cost ke ascending order mein sort karo. Union-Find use karo: sorted order mein har edge ke liye, agar uske endpoints alag components mein hain, unhe union karo aur cost ko total mein add karo (ye edge provably kisi minimum spanning tree ka part hai). n-1 edges use hote hi jaldi ruk jao. Agar kabhi n-1 se kam edges add hue, graph disconnected hai — -1 return karo.",
    timeComplexity: 'O(m log m)',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      "Kruskal's greedy choice — always considering the globally cheapest remaining edge next — is provably safe for MST construction: if an edge connects two currently-separate components, it MUST be part of some minimum spanning tree (any spanning tree that excludes it could be improved by swapping in this cheaper edge to reconnect those components), so accepting it whenever Union-Find confirms the components differ never overshoots the optimum. Sorting once up front and then making each accept/reject decision in near-constant Union-Find time is what keeps the whole algorithm efficient; needing fewer than n-1 accepted edges by the end is the exact signature of a graph that was never fully connectable in the first place.",
    solutionExplanationHi:
      "Kruskal ka greedy choice — hamesha globally sabse sasta bacha hua edge consider karna — MST construction ke liye provably safe hai: agar koi edge do currently-separate components ko connect karta hai, wo zaroori taur par kisi minimum spanning tree ka part HOGA (jo bhi spanning tree ise exclude karta hai use is cheaper edge se swap karke un components ko reconnect karke improve kiya ja sakta hai), isliye jab bhi Union-Find confirm kare ki components alag hain use accept karna kabhi optimum se aage nahi jaata. Ek baar sort karna aur phir har accept/reject decision ko near-constant Union-Find time mein lena poore algorithm ko efficient rakhta hai; aakhir mein n-1 se kam edges accept hona exactly us graph ka signature hai jo shuru se hi fully connectable nahi tha.",
    starter: starter(
      `const n = num(0);
const m = num(1);
const connections = [];
for (let i = 0; i < m; i++) connections.push(nums(2 + i));

function minimumCost(n, connections) {
  // return the min cost, or -1
  return -1;
}

console.log(minimumCost(n, connections));`,
      `n = num(0)
m = num(1)
connections = [nums(2 + i) for i in range(m)]

def minimum_cost(n, connections):
    # return the min cost, or -1
    return -1

print(minimum_cost(n, connections))`,
    ),
    solution: solution(
      `const n = num(0);
const m = num(1);
const connections = [];
for (let i = 0; i < m; i++) connections.push(nums(2 + i));
function minimumCost(n, connections) {
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  const sorted = connections.slice().sort((a, b) => a[2] - b[2]);
  let total = 0, used = 0;
  for (const [u, v, cost] of sorted) {
    const ru = find(u), rv = find(v);
    if (ru !== rv) { parent[ru] = rv; total += cost; used++; if (used === n - 1) break; }
  }
  return used === n - 1 ? total : -1;
}
console.log(minimumCost(n, connections));`,
      `n = num(0)
m = num(1)
connections = [nums(2 + i) for i in range(m)]

def minimum_cost(n, connections):
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total = 0
    used = 0
    for u, v, cost in sorted(connections, key=lambda e: e[2]):
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            total += cost
            used += 1
            if used == n - 1:
                break
    return total if used == n - 1 else -1

print(minimum_cost(n, connections))`,
    ),
    testCases: [
      sample('3\n3\n1 2 5\n1 3 6\n2 3 1', '6'),
      sample('4\n2\n1 2 3\n3 4 4', '-1'),
      hidden('1\n0\n', '0'),
      hidden('2\n1\n1 2 7', '7'),
      hidden('2\n0\n', '-1'),
      hidden('4\n4\n1 2 1\n2 3 1\n3 4 1\n1 4 5', '3'),
    ],
  },

  {
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given an `rows x cols` height grid, the Pacific touches the top and left edges, the Atlantic touches the bottom and right edges. Water flows from a cell to a 4-directional neighbor only if the neighbor\'s height is <= the current height. Find every cell from which water can reach BOTH oceans.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated heights\n\n**Output**\nEach qualifying cell as `r c`, one per line, sorted by row then column.',
    descriptionHi:
      'Ek `rows x cols` height grid di hai, Pacific top aur left edges ko chhoota hai, Atlantic bottom aur right edges ko. Paani ek cell se 4-directional neighbor mein tabhi flow karta hai jab neighbor ki height <= current height ho. Har wo cell dhoondo jahan se paani DONO oceans tak pahunch sakta hai.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated heights\n\n**Output**\nHar qualifying cell `r c` ki tarah, ek per line, row phir column se sorted.',
    examples: [
      { input: '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4', output: '0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0' },
    ],
    constraints: ['1 <= rows, cols <= 200'],
    hints: [
      'Simulating outward flow from every cell to check if it reaches both oceans is O((rows*cols)^2) — too slow to be the intended approach.',
      "Reverse the direction: flood-fill INWARD from each ocean's border, moving to a neighbor whenever the neighbor's height is >= the current cell (since water flowing downhill forward is equivalent to flowing uphill-or-equal backward).",
      'A cell qualifies exactly when it is reachable in BOTH the Pacific flood-fill (from top+left) and the Atlantic flood-fill (from bottom+right) — intersect the two reachable sets.',
    ],
    approach:
      'Run two multi-source flood fills (DFS/BFS): one starting from all Pacific-adjacent border cells (top row + left column), one from all Atlantic-adjacent border cells (bottom row + right column). In both, move to a neighbor whenever neighbor height >= current height (the reverse of the forward flow condition). A cell that appears in both reachable sets can send water to both oceans.',
    approachHi:
      'Do multi-source flood fills (DFS/BFS) chalao: ek Pacific-adjacent border cells se (top row + left column), ek Atlantic-adjacent border cells se (bottom row + right column). Dono mein, kisi neighbor mein tabhi jao jab neighbor height >= current height ho (forward flow condition ka reverse). Jo cell dono reachable sets mein aata hai wo dono oceans tak paani bhej sakta hai.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols)',
    solutionExplanation:
      "Checking outward reachability from every single cell independently repeats enormous amounts of shared work across overlapping downhill paths, giving a quadratic blowup. Reversing each ocean's flood fill to start FROM its border and flow to any neighbor at least as high inverts the reachability relation exactly (a forward downhill path from cell X to the border is, read backward, an uphill-or-equal path from the border to X), so each ocean now needs only ONE linear flood fill instead of one per cell — and the final answer is simply the set intersection of the two oceans' reachable regions, since a cell only qualifies if water leaving it can reach both.",
    solutionExplanationHi:
      "Har single cell se independently outward reachability check karna overlapping downhill paths ka bahut zyada shared kaam baar-baar karta hai, jo quadratic blowup deta hai. Har ocean ke flood fill ko reverse karna — uske border se shuru karke kisi bhi kam-se-kam utni hi height wale neighbor tak flow karna — reachability relation ko exactly invert karta hai (cell X se border tak ka forward downhill path, backward padha jaaye to, border se X tak ek uphill-or-equal path hai), isliye har ocean ko ab per-cell ek ki jagah sirf EK linear flood fill chahiye — aur final answer bas dono oceans ke reachable regions ka set intersection hai, kyunki koi cell tabhi qualify karta hai jab usse nikla paani dono tak pahunch sake.",
    starter: starter(
      `const [rows, cols] = nums(0);
const heights = [];
for (let i = 0; i < rows; i++) heights.push(nums(1 + i));

function pacificAtlantic(heights) {
  // return an array of [r, c] pairs
  return [];
}

const result = pacificAtlantic(heights);
console.log(result.map(([r, c]) => \`\${r} \${c}\`).join('\\n'));`,
      `rows, cols = nums(0)
heights = [nums(1 + i) for i in range(rows)]

def pacific_atlantic(heights):
    # return a list of [r, c] pairs
    return []

result = pacific_atlantic(heights)
print("\\n".join(f"{r} {c}" for r, c in result))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const heights = [];
for (let i = 0; i < rows; i++) heights.push(nums(1 + i));
function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pacific = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function fill(visited, r, c) {
    visited[r][c] = true;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || visited[nr][nc]) continue;
      if (heights[nr][nc] >= heights[r][c]) fill(visited, nr, nc);
    }
  }
  for (let c = 0; c < cols; c++) { fill(pacific, 0, c); fill(atlantic, rows - 1, c); }
  for (let r = 0; r < rows; r++) { fill(pacific, r, 0); fill(atlantic, r, cols - 1); }
  const result = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (pacific[r][c] && atlantic[r][c]) result.push([r, c]);
  return result;
}
const result = pacificAtlantic(heights);
console.log(result.map(([r, c]) => \`\${r} \${c}\`).join('\\n'));`,
      `import sys
sys.setrecursionlimit(100000)
rows, cols = nums(0)
heights = [nums(1 + i) for i in range(rows)]

def pacific_atlantic(heights):
    rows, cols = len(heights), len(heights[0])
    pacific = [[False] * cols for _ in range(rows)]
    atlantic = [[False] * cols for _ in range(rows)]

    def fill(visited, r, c):
        visited[r][c] = True
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc] and heights[nr][nc] >= heights[r][c]:
                fill(visited, nr, nc)

    for c in range(cols):
        fill(pacific, 0, c)
        fill(atlantic, rows - 1, c)
    for r in range(rows):
        fill(pacific, r, 0)
        fill(atlantic, r, cols - 1)
    result = []
    for r in range(rows):
        for c in range(cols):
            if pacific[r][c] and atlantic[r][c]:
                result.append((r, c))
    return result

result = pacific_atlantic(heights)
print("\\n".join(f"{r} {c}" for r, c in result))`,
    ),
    testCases: [
      sample(
        '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n6 7 1 4 5\n5 1 1 2 4',
        '0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0',
      ),
      hidden('1 1\n5', '0 0'),
      hidden('2 2\n1 1\n1 1', '0 0\n0 1\n1 0\n1 1'),
      hidden('1 3\n3 1 3', '0 0\n0 1\n0 2'),
    ],
  },

  {
    slug: 'evaluate-division',
    title: 'Evaluate Division',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given equations `a b val` meaning a/b = val, and queries `c d`, evaluate c/d for each query using the given equations (chained via any intermediate variables). Output -1.0 if a query cannot be evaluated (an unknown variable, or no connecting path).\n\n**Input**\n- Line 1: `n` (number of equations)\n- Next `n` lines: `a b val`\n- Line `n+2`: `q` (number of queries)\n- Next `q` lines: `c d`\n\n**Output**\nOne result per query, one per line, each formatted with exactly one decimal place, or `-1.0`.',
    descriptionHi:
      'Equations `a b val` (matlab a/b = val) aur queries `c d` di hain. Har query ke liye c/d evaluate karo, di gayi equations use karke (kisi bhi intermediate variables ke through chain karte hue). Agar koi query evaluate nahi ho sakti (unknown variable, ya koi connecting path nahi) to -1.0 output karo.\n\n**Input**\n- Line 1: `n` (equations ki sankhya)\n- Agli `n` lines: `a b val`\n- Line `n+2`: `q` (queries ki sankhya)\n- Agli `q` lines: `c d`\n\n**Output**\nHar query ke liye ek result, ek per line, exactly ek decimal place ke saath, ya `-1.0`.',
    examples: [
      { input: '3\na b 2.0\nb c 3.0\na c 5.0\n3\na c\nb a\na e', output: '6.0\n0.5\n-1.0' },
    ],
    constraints: ['1 <= n, q <= 20'],
    hints: [
      'Model each variable as a node, and each equation a/b = val as a directed weighted edge a -> b with weight val, and its reverse b -> a with weight 1/val.',
      'A query c/d is then just "what is the product of edge weights along any path from c to d" — since a/b * b/c = a/c, weights multiply cleanly along a path.',
      'A single DFS per query, multiplying edge weights as you go, answers it; if traversal never reaches d (or c/d was never even mentioned in any equation), the answer is -1.0.',
    ],
    approach:
      'Build a weighted directed graph: each equation a/b=val adds edge a->b (weight val) and b->a (weight 1/val). For each query c/d: if either variable was never seen, answer -1.0; otherwise DFS/BFS from c, multiplying edge weights along the way, until d is reached (that running product is the answer) or the search exhausts without finding d (answer -1.0).',
    approachHi:
      'Ek weighted directed graph banao: har equation a/b=val edge a->b (weight val) aur b->a (weight 1/val) add karta hai. Har query c/d ke liye: agar koi bhi variable kabhi dekha hi nahi gaya, answer -1.0; warna c se DFS/BFS karo, raaste mein edge weights multiply karte hue, jab tak d na mile (wo running product answer hai) ya search bina d dhoonde khatam ho jaaye (answer -1.0).',
    timeComplexity: 'O(n) to build + O(q * (n + edges)) for queries',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      "The key insight is that division equations compose exactly like multiplied edge weights along a path: a/b * b/c = a/c algebraically, which is precisely what a weighted path's total weight represents if each edge stores its own ratio. That turns \"can this division be evaluated, and to what value\" into pure graph reachability with an accumulated product instead of an accumulated sum — the same DFS/BFS traversal used for unweighted reachability answers it, just multiplying instead of counting steps, and a query variable never appearing in any equation is trivially unreachable (not even a node in the graph) so it short-circuits to -1.0 without a wasted search.",
    solutionExplanationHi:
      "Key insight ye hai ki division equations exactly waise compose hote hain jaise ek path ke along multiplied edge weights: a/b * b/c = a/c algebraically, jo exactly wahi hai jo ek weighted path ka total weight represent karta hai agar har edge apna khud ka ratio store kare. Ye \"kya ye division evaluate ho sakta hai, aur kya value hai\" ko pure graph reachability mein badal deta hai, accumulated sum ke bajaye accumulated product ke saath — wahi DFS/BFS traversal jo unweighted reachability ke liye use hota hai isko answer karta hai, bas steps count karne ke bajaye multiply karte hue, aur ek query variable jo kisi bhi equation mein kabhi nahi dikha wo trivially unreachable hai (graph mein node hi nahi hai) isliye ye bina wasted search ke -1.0 par short-circuit ho jaata hai.",
    starter: starter(
      `const n = num(0);
const equations = [];
const values = [];
for (let i = 0; i < n; i++) {
  const parts = words(1 + i);
  equations.push([parts[0], parts[1]]);
  values.push(Number(parts[2]));
}
const q = num(1 + n);
const queries = [];
for (let i = 0; i < q; i++) queries.push(words(2 + n + i));

function calcEquation(equations, values, queries) {
  // return an array of results (-1.0 if not evaluable)
  return queries.map(() => -1.0);
}

console.log(calcEquation(equations, values, queries).map((v) => v.toFixed(1)).join('\\n'));`,
      `n = num(0)
equations = []
values = []
for i in range(n):
    parts = words(1 + i)
    equations.append([parts[0], parts[1]])
    values.append(float(parts[2]))
q = num(1 + n)
queries = [words(2 + n + i) for i in range(q)]

def calc_equation(equations, values, queries):
    # return a list of results (-1.0 if not evaluable)
    return [-1.0 for _ in queries]

print("\\n".join(f"{v:.1f}" for v in calc_equation(equations, values, queries)))`,
    ),
    solution: solution(
      `const n = num(0);
const equations = [];
const values = [];
for (let i = 0; i < n; i++) {
  const parts = words(1 + i);
  equations.push([parts[0], parts[1]]);
  values.push(Number(parts[2]));
}
const q = num(1 + n);
const queries = [];
for (let i = 0; i < q; i++) queries.push(words(2 + n + i));
function calcEquation(equations, values, queries) {
  const graph = new Map();
  function addEdge(a, b, w) {
    if (!graph.has(a)) graph.set(a, []);
    graph.get(a).push([b, w]);
  }
  for (let i = 0; i < equations.length; i++) {
    const [a, b] = equations[i];
    addEdge(a, b, values[i]);
    addEdge(b, a, 1 / values[i]);
  }
  function dfs(cur, target, visited, product) {
    if (!graph.has(cur)) return -1.0;
    if (cur === target) return product;
    visited.add(cur);
    for (const [next, w] of graph.get(cur)) {
      if (visited.has(next)) continue;
      const result = dfs(next, target, visited, product * w);
      if (result !== -1.0) return result;
    }
    return -1.0;
  }
  return queries.map(([c, d]) => {
    if (!graph.has(c) || !graph.has(d)) return -1.0;
    return dfs(c, d, new Set(), 1.0);
  });
}
console.log(calcEquation(equations, values, queries).map((v) => v.toFixed(1)).join('\\n'));`,
      `n = num(0)
equations = []
values = []
for i in range(n):
    parts = words(1 + i)
    equations.append([parts[0], parts[1]])
    values.append(float(parts[2]))
q = num(1 + n)
queries = [words(2 + n + i) for i in range(q)]

def calc_equation(equations, values, queries):
    graph = {}

    def add_edge(a, b, w):
        graph.setdefault(a, []).append((b, w))

    for (a, b), val in zip(equations, values):
        add_edge(a, b, val)
        add_edge(b, a, 1 / val)

    def dfs(cur, target, visited, product):
        if cur not in graph:
            return -1.0
        if cur == target:
            return product
        visited.add(cur)
        for nxt, w in graph[cur]:
            if nxt in visited:
                continue
            result = dfs(nxt, target, visited, product * w)
            if result != -1.0:
                return result
        return -1.0

    results = []
    for c, d in queries:
        if c not in graph or d not in graph:
            results.append(-1.0)
        else:
            results.append(dfs(c, d, set(), 1.0))
    return results

print("\\n".join(f"{v:.1f}" for v in calc_equation(equations, values, queries)))`,
    ),
    testCases: [
      sample('3\na b 2.0\nb c 3.0\na c 5.0\n3\na c\nb a\na e', '6.0\n0.5\n-1.0'),
      hidden('1\na b 8.0\n2\na b\nb a', '8.0\n0.1'),
      hidden('1\na b 2.0\n1\nx y', '-1.0'),
      hidden('2\na b 2.0\nc d 3.0\n1\na d', '-1.0'),
      hidden('1\na a 1.0\n1\na a', '1.0'),
    ],
  },

  {
    slug: 'all-paths-from-source-to-target',
    title: 'All Paths From Source to Target',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given a directed acyclic graph of `n` nodes (0-indexed), find every path from node 0 to node n-1.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: for node `i`, the count of outgoing neighbors followed by that many neighbor values (may be an empty line if 0 neighbors)\n\n**Output**\nEach path as space-separated nodes, one per line, in the order a DFS following neighbors in given order would discover them.',
    descriptionHi:
      '`n` nodes (0-indexed) wala ek directed acyclic graph diya hai. Node 0 se node n-1 tak har path dhoondo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: node `i` ke liye, outgoing neighbors ki count phir utni hi neighbor values (0 neighbors ho to khaali line ho sakti hai)\n\n**Output**\nHar path space-separated nodes ki tarah, ek per line, us order mein jis order mein diye gaye neighbor order follow karti DFS unhe discover karti.',
    examples: [
      { input: '4\n2\n1 2\n1\n3\n1\n3\n0\n', output: '0 1 3\n0 2 3' },
    ],
    constraints: ['2 <= n <= 15', 'graph is a DAG'],
    hints: [
      'Since the graph is guaranteed acyclic, there is no risk of infinite loops — every DFS path is guaranteed to terminate.',
      'Standard backtracking: extend the current path with each neighbor, recurse, and pop it back off after returning — exactly like generating permutations or combinations.',
      'Whenever the current path\'s last node equals n-1, record a copy of the path (not a reference, since it keeps mutating).',
    ],
    approach:
      'DFS with backtracking from node 0, maintaining a running path array. At each node, if it equals n-1, record a snapshot of the current path; otherwise recurse into each neighbor (appending it to the path first, popping it after the recursive call returns) to explore every path exhaustively.',
    approachHi:
      'Node 0 se backtracking ke saath DFS, ek running path array maintain karte hue. Har node par, agar wo n-1 ke barabar hai, current path ka ek snapshot record karo; warna har neighbor mein recurse karo (pehle use path mein append karke, recursive call return hone ke baad pop karke) taaki har path exhaustively explore ho.',
    timeComplexity: 'O(2^n * n) worst case (number of paths in a DAG can be exponential)',
    spaceComplexity: 'O(n) for the recursion stack, plus output size',
    solutionExplanation:
      "Because the problem asks for EVERY path rather than just one, this cannot be answered with a visited-set-pruned traversal like ordinary reachability — the same node legitimately appears in multiple distinct valid paths, so nothing may be permanently marked visited. Backtracking handles this correctly by using the path itself as the only state: appending a node when entering it and popping it when leaving means each recursive branch sees an accurate snapshot of exactly the path taken to reach it, and because the graph is acyclic, no branch can recurse forever, guaranteeing termination while still exploring every distinct route to n-1.",
    solutionExplanationHi:
      "Kyunki problem EK path ke bajaye HAR path maangta hai, ise ordinary reachability jaisi visited-set-pruned traversal se answer nahi kiya ja sakta — same node legitimately multiple distinct valid paths mein aata hai, isliye kuch bhi permanently visited mark nahi ho sakta. Backtracking ise sahi tarike se handle karta hai, path ko hi ek matra state ki tarah use karke: kisi node mein enter karte waqt use append karna aur leave karte waqt pop karna matlab har recursive branch ko wahan tak pahunchne ke exact path ka accurate snapshot milta hai, aur kyunki graph acyclic hai, koi bhi branch hamesha ke liye recurse nahi kar sakti, jo termination guarantee karta hai jabki n-1 tak ka har distinct route bhi explore hota hai.",
    starter: starter(
      `const n = num(0);
const graph = [];
for (let i = 0; i < n; i++) {
  const cnt = num(1 + 2 * i);
  graph.push(cnt ? nums(1 + 2 * i + 1) : []);
}

function allPathsSourceTarget(graph) {
  // return an array of paths (each an array of node numbers)
  return [];
}

for (const path of allPathsSourceTarget(graph)) console.log(path.join(' '));`,
      `n = num(0)
graph = []
for i in range(n):
    cnt = num(1 + 2 * i)
    graph.append(nums(1 + 2 * i + 1) if cnt else [])

def all_paths_source_target(graph):
    # return a list of paths (each a list of node numbers)
    return []

for path in all_paths_source_target(graph):
    print(" ".join(map(str, path)))`,
    ),
    solution: solution(
      `const n = num(0);
const graph = [];
for (let i = 0; i < n; i++) {
  const cnt = num(1 + 2 * i);
  graph.push(cnt ? nums(1 + 2 * i + 1) : []);
}
function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const results = [];
  const path = [0];
  function backtrack(node) {
    if (node === target) { results.push(path.slice()); return; }
    for (const next of graph[node]) {
      path.push(next);
      backtrack(next);
      path.pop();
    }
  }
  backtrack(0);
  return results;
}
for (const path of allPathsSourceTarget(graph)) console.log(path.join(' '));`,
      `n = num(0)
graph = []
for i in range(n):
    cnt = num(1 + 2 * i)
    graph.append(nums(1 + 2 * i + 1) if cnt else [])

def all_paths_source_target(graph):
    target = len(graph) - 1
    results = []
    path = [0]

    def backtrack(node):
        if node == target:
            results.append(path[:])
            return
        for nxt in graph[node]:
            path.append(nxt)
            backtrack(nxt)
            path.pop()

    backtrack(0)
    return results

for path in all_paths_source_target(graph):
    print(" ".join(map(str, path)))`,
    ),
    testCases: [
      sample('4\n2\n1 2\n1\n3\n1\n3\n0\n', '0 1 3\n0 2 3'),
      hidden('2\n1\n1\n0\n', '0 1'),
      hidden('3\n2\n1 2\n1\n2\n0\n', '0 1 2\n0 2'),
      hidden(
        '5\n1\n4\n1\n4\n1\n4\n1\n4\n0\n',
        '0 4',
      ),
    ],
  },

  {
    slug: 'reconstruct-itinerary',
    title: 'Reconstruct Itinerary',
    category: 'Graph',
    difficulty: 'HARD',
    description:
      'Given `n` airline tickets `from to` (each ticket used exactly once), reconstruct the itinerary starting from `JFK` that uses every ticket exactly once. If multiple valid itineraries exist, return the lexicographically smallest one.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `from to`\n\n**Output**\nThe itinerary, space-separated.',
    descriptionHi:
      '`n` airline tickets `from to` diye hain (har ticket exactly ek baar use hoga). `JFK` se shuru hone wala aisa itinerary banao jo har ticket exactly ek baar use kare. Agar multiple valid itineraries hain, lexicographically sabse chhota wala return karo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `from to`\n\n**Output**\nItinerary, space-separated.',
    examples: [
      { input: '4\nMUC LHR\nJFK MUC\nSFO SJC\nLHR SFO', output: 'JFK MUC LHR SFO SJC' },
      { input: '5\nJFK SFO\nJFK ATL\nSFO ATL\nATL JFK\nATL SFO', output: 'JFK ATL JFK SFO ATL SFO' },
    ],
    constraints: ['1 <= n <= 300', 'a valid itinerary using all tickets always exists'],
    hints: [
      'This is exactly finding an Eulerian path (a walk using every EDGE exactly once) in a directed multigraph — not a Hamiltonian path over nodes.',
      "Naive DFS-with-backtracking works but can be exponential; Hierholzer's algorithm builds an Eulerian circuit/path in linear time by always greedily descending into the lexicographically smallest unused edge and backtracking onto a result stack only when stuck (a dead end).",
      "Sort each airport's destinations first so the greedy always tries the smallest option, and use a min-heap or sorted-and-consumed list per airport to remove used tickets in O(log n).",
    ],
    approach:
      "Hierholzer's algorithm for an Eulerian path. Build an adjacency list where each airport's destinations are sorted lexicographically, stored as a small min-heap (or sorted array consumed via index/removal) for efficient smallest-first extraction. DFS greedily: at each airport, keep popping and following the lexicographically smallest unused ticket until stuck at a dead end, then push the current airport onto a result stack (post-order). Reversing that stack at the end gives the Eulerian path.",
    approachHi:
      "Eulerian path ke liye Hierholzer's algorithm. Ek adjacency list banao jahan har airport ki destinations lexicographically sorted hon, ek chhote min-heap ki tarah store ki hui (ya sorted array jo index/removal se consume hoti hai) taaki smallest-first extraction efficient ho. Greedily DFS karo: har airport par, tab tak pop aur follow karte raho lexicographically sabse chhota unused ticket jab tak ek dead end par stuck na ho jao, phir current airport ko ek result stack par push karo (post-order). Aakhir mein us stack ko reverse karna Eulerian path deta hai.",
    timeComplexity: 'O(n log n) with a heap per airport (n = number of tickets)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      "Naive backtracking (try a destination, recurse, undo if it leads to a dead end before using all tickets) can be forced into exponential re-exploration on graphs with many valid partial routes that later fail. Hierholzer's algorithm sidesteps that entirely by NEVER backtracking over a used edge: it always commits to the smallest available edge and, upon reaching a dead end, simply records that airport as \"done\" on a stack rather than undoing anything — a classical graph-theory result guarantees that in a graph with a valid Eulerian path, every such greedy descent-and-record eventually uses all edges exactly once, and reversing the finish-order stack recovers a genuinely valid itinerary in linear time, with the lexicographic-smallest-first tie-break making it specifically the smallest such itinerary.",
    solutionExplanationHi:
      "Naive backtracking (ek destination try karo, recurse karo, agar saare tickets use hone se pehle dead end par pahunche to undo karo) aise graphs par exponential re-exploration mein force ho sakta hai jahan bahut saare valid partial routes hain jo baad mein fail hote hain. Hierholzer's algorithm isse poori tarah bachta hai kisi used edge par kabhi backtrack na karke: ye hamesha sabse chhote available edge ko commit karta hai aur, dead end par pahunchne par, bas us airport ko stack par \"done\" record kar deta hai kuch bhi undo kiye bina — ek classical graph-theory result guarantee karta hai ki ek aise graph mein jahan valid Eulerian path exist karta hai, har aisa greedy descent-and-record aakhir mein saare edges exactly ek baar use karta hai, aur finish-order stack ko reverse karna linear time mein ek genuinely valid itinerary recover karta hai, aur lexicographic-smallest-first tie-break ise specifically sabse chhota aisa itinerary banata hai.",
    starter: starter(
      `const n = num(0);
const tickets = [];
for (let i = 0; i < n; i++) tickets.push(words(1 + i));

function findItinerary(tickets) {
  // return the itinerary as an array of airport codes
  return [];
}

console.log(findItinerary(tickets).join(' '));`,
      `n = num(0)
tickets = [words(1 + i) for i in range(n)]

def find_itinerary(tickets):
    # return the itinerary as a list of airport codes
    return []

print(" ".join(find_itinerary(tickets)))`,
    ),
    solution: solution(
      `const n = num(0);
const tickets = [];
for (let i = 0; i < n; i++) tickets.push(words(1 + i));
function findItinerary(tickets) {
  const graph = new Map();
  for (const [from, to] of tickets) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from).push(to);
  }
  for (const dests of graph.values()) dests.sort().reverse();
  const result = [];
  function visit(airport) {
    const dests = graph.get(airport);
    while (dests && dests.length) visit(dests.pop());
    result.push(airport);
  }
  visit('JFK');
  return result.reverse();
}
console.log(findItinerary(tickets).join(' '));`,
      `n = num(0)
tickets = [words(1 + i) for i in range(n)]

def find_itinerary(tickets):
    graph = {}
    for frm, to in tickets:
        graph.setdefault(frm, []).append(to)
    for dests in graph.values():
        dests.sort(reverse=True)
    result = []

    def visit(airport):
        dests = graph.get(airport)
        while dests:
            visit(dests.pop())
        result.append(airport)

    visit('JFK')
    result.reverse()
    return result

print(" ".join(find_itinerary(tickets)))`,
    ),
    testCases: [
      sample('4\nMUC LHR\nJFK MUC\nSFO SJC\nLHR SFO', 'JFK MUC LHR SFO SJC'),
      sample('5\nJFK SFO\nJFK ATL\nSFO ATL\nATL JFK\nATL SFO', 'JFK ATL JFK SFO ATL SFO'),
      hidden('1\nJFK A', 'JFK A'),
      hidden('2\nJFK A\nA JFK', 'JFK A JFK'),
      hidden('3\nJFK B\nJFK A\nA JFK', 'JFK A JFK B'),
    ],
  },
];
