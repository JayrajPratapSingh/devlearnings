import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Graph — expansion batch, part 1 of 2. Rounds out the category beyond the
 * original two (Number of Islands, Course Schedule) with basic
 * reachability/DFS-BFS on explicit graphs, grid flood-fill variants, and the
 * Union-Find toolkit (connected components, cycle detection, valid tree).
 */
export const dsaExtraGraph: SeedProblem[] = [
  {
    slug: 'find-if-path-exists-in-graph',
    title: 'Find if Path Exists in Graph',
    category: 'Graph',
    difficulty: 'EASY',
    description:
      'Given an undirected graph with `n` nodes (0-indexed) and a list of edges, determine whether a path exists between `source` and `destination`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m` (number of edges)\n- Next `m` lines: `u v`\n- Last line: `source destination`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      '`n` nodes (0-indexed) aur edges ki ek list wala undirected graph diya hai. Check karo ki `source` aur `destination` ke beech koi path hai ya nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m` (edges ki sankhya)\n- Agli `m` lines: `u v`\n- Aakhri line: `source destination`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '3\n2\n0 1\n1 2\n0 2', output: 'true' },
      { input: '6\n4\n0 1\n0 2\n3 5\n5 4\n0 5', output: 'false' },
    ],
    constraints: ['1 <= n <= 2*10^5', '0 <= m <= 2*10^5'],
    hints: [
      'This is the most basic graph question: is there any way to get from one node to another, ignoring edge count or weight entirely.',
      'A single BFS or DFS from the source, exploring every reachable node, answers it directly.',
      'The source and destination might be the same node — that trivially has a path (of length 0).',
    ],
    approach:
      'Build an adjacency list. BFS (or DFS) from `source`, marking every reachable node as visited. The answer is whether `destination` was ever marked visited.',
    approachHi:
      'Ek adjacency list banao. `source` se BFS (ya DFS) karo, har reachable node ko visited mark karte hue. Answer ye hai ki `destination` kabhi visited mark hua ya nahi.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      'This is connectivity in its purest form — no shortest path, no weights, just "can I get there at all" — so a single unweighted traversal (BFS or DFS, both equally valid here) that explores every node reachable from the source is both necessary and sufficient; destination is reachable if and only if it appears somewhere in that explored set.',
    solutionExplanationHi:
      'Ye connectivity ka sabse pure form hai — koi shortest path nahi, koi weights nahi, bas "kya main wahan tak pahunch sakta hoon" — isliye ek single unweighted traversal (BFS ya DFS, dono yahan equally valid) jo source se reachable har node explore kare, necessary aur sufficient dono hai; destination reachable hai agar aur sirf agar wo us explored set mein kahin dikhta hai.',
    starter: starter(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));
const [source, destination] = nums(2 + m);

function validPath(n, edges, source, destination) {
  // your code here
}

console.log(validPath(n, edges, source, destination));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]
source, destination = nums(2 + m)

def valid_path(n, edges, source, destination):
    # your code here
    pass

print("true" if valid_path(n, edges, source, destination) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));
const [source, destination] = nums(2 + m);
function validPath(n, edges, source, destination) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const visited = new Array(n).fill(false);
  const queue = [source];
  visited[source] = true;
  while (queue.length) {
    const node = queue.shift();
    if (node === destination) return true;
    for (const next of adj[node]) if (!visited[next]) { visited[next] = true; queue.push(next); }
  }
  return visited[destination];
}
console.log(validPath(n, edges, source, destination));`,
      `from collections import deque
n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]
source, destination = nums(2 + m)

def valid_path(n, edges, source, destination):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = [False] * n
    q = deque([source])
    visited[source] = True
    while q:
        node = q.popleft()
        if node == destination:
            return True
        for nxt in adj[node]:
            if not visited[nxt]:
                visited[nxt] = True
                q.append(nxt)
    return visited[destination]

print("true" if valid_path(n, edges, source, destination) else "false")`,
    ),
    testCases: [
      sample('3\n2\n0 1\n1 2\n0 2', 'true'),
      sample('6\n4\n0 1\n0 2\n3 5\n5 4\n0 5', 'false'),
      hidden('1\n0\n0 0', 'true'),
      hidden('2\n0\n0 1', 'false'),
      hidden('5\n4\n0 1\n1 2\n2 3\n3 4\n0 4', 'true'),
    ],
  },

  {
    slug: 'flood-fill',
    title: 'Flood Fill',
    category: 'Graph',
    difficulty: 'EASY',
    description:
      'Starting from pixel `(sr, sc)`, replace the color of every 4-directionally connected pixel that shares the starting pixel\'s original color with `newColor`.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated color values\n- Last line: `sr sc newColor`\n\n**Output**\nThe filled grid, one row per line.',
    descriptionHi:
      'Pixel `(sr, sc)` se shuru karke, har us 4-directionally connected pixel ka color `newColor` se replace karo jo starting pixel ke original color se match karta hai.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated color values\n- Aakhri line: `sr sc newColor`\n\n**Output**\nFilled grid, ek row per line.',
    examples: [
      { input: '3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2', output: '2 2 2\n2 2 0\n2 0 1' },
      { input: '1 1\n0\n0 0 0', output: '0' },
    ],
    constraints: ['1 <= rows, cols <= 50'],
    hints: [
      'If newColor happens to equal the starting pixel\'s original color, doing nothing is already correct — but naively recoloring and recursing anyway could loop forever if that case is not handled.',
      'This is exactly the Number of Islands flood-fill pattern, but filling with a new color instead of just marking visited.',
      'Only recurse into a neighbor if it currently matches the ORIGINAL starting color (checked before any recoloring began), not the new color.',
    ],
    approach:
      'Record the starting pixel\'s original color. If it already equals `newColor`, no changes are needed at all (return immediately to avoid infinite recursion). Otherwise, DFS/BFS from `(sr, sc)`, recoloring each visited pixel to `newColor` and only continuing into neighbors that still match the original color.',
    approachHi:
      'Starting pixel ka original color record karo. Agar wo pehle se `newColor` ke barabar hai, kuch badalne ki zaroorat nahi (infinite recursion se bachne ke liye turant return karo). Warna, `(sr, sc)` se DFS/BFS karo, har visit hue pixel ko `newColor` se recolor karte hue, aur sirf un neighbors mein aage badhte hue jo abhi bhi original color se match karte hain.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols) worst case',
    solutionExplanation:
      'The same-color guard is not just an optimization, it is a correctness requirement: without it, when newColor equals the original color, every recoloring step would leave the pixel still matching the "look for this color" condition, causing the flood fill to immediately re-visit and infinitely recurse on cells it just processed. Checking against the ORIGINAL color captured before any recoloring (rather than re-checking against newColor after some cells have already changed) is what keeps the connected-region test consistent throughout the whole fill.',
    solutionExplanationHi:
      'Same-color guard sirf ek optimization nahi, ek correctness requirement hai: iske bina, jab newColor original color ke barabar ho, har recoloring step pixel ko abhi bhi "ye color dhoondo" condition se match karta chhod dega, jisse flood fill turant abhi process kiye hue cells ko dobara visit karke infinitely recurse karega. Kisi bhi recoloring se pehle capture kiye gaye ORIGINAL color se compare karna (kuch cells badal jaane ke baad newColor se dobara compare karne ke bajaye) hi poori fill mein connected-region test ko consistent rakhta hai.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const [sr, sc, newColor] = nums(1 + rows);

function floodFill(grid, sr, sc, newColor) {
  // mutate grid in place, return it
  return grid;
}

console.log(floodFill(grid, sr, sc, newColor).map((r) => r.join(' ')).join('\\n'));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
sr, sc, new_color = nums(1 + rows)

def flood_fill(grid, sr, sc, new_color):
    # mutate grid in place, return it
    return grid

result = flood_fill(grid, sr, sc, new_color)
print("\\n".join(" ".join(map(str, row)) for row in result))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const [sr, sc, newColor] = nums(1 + rows);
function floodFill(grid, sr, sc, newColor) {
  const original = grid[sr][sc];
  if (original === newColor) return grid;
  const stack = [[sr, sc]];
  grid[sr][sc] = newColor;
  while (stack.length) {
    const [r, c] = stack.pop();
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === original) {
        grid[nr][nc] = newColor;
        stack.push([nr, nc]);
      }
    }
  }
  return grid;
}
console.log(floodFill(grid, sr, sc, newColor).map((r) => r.join(' ')).join('\\n'));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
sr, sc, new_color = nums(1 + rows)

def flood_fill(grid, sr, sc, new_color):
    original = grid[sr][sc]
    if original == new_color:
        return grid
    stack = [(sr, sc)]
    grid[sr][sc] = new_color
    while stack:
        r, c = stack.pop()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == original:
                grid[nr][nc] = new_color
                stack.append((nr, nc))
    return grid

result = flood_fill(grid, sr, sc, new_color)
print("\\n".join(" ".join(map(str, row)) for row in result))`,
    ),
    testCases: [
      sample('3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2', '2 2 2\n2 2 0\n2 0 1'),
      sample('1 1\n0\n0 0 0', '0'),
      hidden('2 2\n0 0\n0 0\n0 0 5', '5 5\n5 5'),
      hidden('3 1\n1\n1\n2\n1 0 3', '3\n3\n2'),
    ],
  },

  {
    slug: 'find-the-town-judge',
    title: 'Find the Town Judge',
    category: 'Graph',
    difficulty: 'EASY',
    description:
      'In a town of `n` people (1 to `n`), the judge trusts nobody and is trusted by everybody else. Given trust pairs `a b` meaning "a trusts b", find the judge, or `-1` if none exists.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m` (number of trust pairs)\n- Next `m` lines: `a b`\n\n**Output**\nThe judge, or `-1`.',
    descriptionHi:
      '`n` logon (1 se `n`) ke ek town mein, judge kisi par trust nahi karta aur baaki sab usi par trust karte hain. Trust pairs `a b` diye hain (matlab "a, b par trust karta hai"), judge dhoondo, ya `-1` agar koi nahi hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m` (trust pairs ki sankhya)\n- Agli `m` lines: `a b`\n\n**Output**\nJudge, ya `-1`.',
    examples: [
      { input: '2\n1\n1 2', output: '2' },
      { input: '3\n2\n1 3\n2 3', output: '3' },
    ],
    constraints: ['1 <= n <= 1000', '0 <= m <= 10^4'],
    hints: [
      'The judge is trusted by everyone (n-1 incoming trust edges) and trusts nobody (0 outgoing trust edges) — a "score" of (in-degree minus out-degree) equal to n-1 uniquely identifies this.',
      'Track a single net score per person: +1 whenever they are trusted, -1 whenever they trust someone.',
      'At most one person can have a score of exactly n-1 (since being the judge is a very specific, mutually exclusive condition) — scan for it after processing all pairs.',
    ],
    approach:
      'Maintain a `score` array. For each trust pair `a b`: decrement `score[a]` (a trusts someone, so is disqualified from being the judge if not already) and increment `score[b]` (b is trusted by someone). After processing all pairs, the judge (if any) is the person whose score equals `n - 1`.',
    approachHi:
      'Ek `score` array rakho. Har trust pair `a b` ke liye: `score[a]` ghatao (a kisi par trust karta hai, isliye judge hone se disqualify) aur `score[b]` badhao (b kisi ke through trust kiya gaya). Saare pairs process karne ke baad, judge (agar hai) wo person hai jiska score `n - 1` ke barabar hai.',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Combining "trusted by everyone" and "trusts nobody" into a single net score works because the two conditions pull the score in opposite, cleanly separable directions: every trust relationship the judge receives adds exactly +1, and the judge never loses any points from trusting others (since they trust nobody) — so only a genuine judge can reach the maximum possible score of n-1, while anyone who trusts even one person is immediately knocked below that ceiling by their own outgoing edge, making a single linear scan sufficient rather than needing to separately verify both conditions for every candidate.',
    solutionExplanationHi:
      '"Sabke through trust kiya gaya" aur "kisi par trust nahi karta" ko ek single net score mein combine karna isliye kaam karta hai kyunki ye do conditions score ko opposite, cleanly separable directions mein khinchti hain: judge ko milne wala har trust relationship exactly +1 jodta hai, aur judge kabhi bhi doosron par trust karne se points nahi khota (kyunki wo kisi par trust karta hi nahi) — isliye sirf ek genuine judge hi maximum possible score n-1 tak pahunch sakta hai, jabki koi bhi jo ek bhi person par trust karta hai apne hi outgoing edge se turant us ceiling se neeche gir jaata hai — isliye har candidate ke liye dono conditions alag se verify karne ke bajaye ek single linear scan kaafi hai.',
    starter: starter(
      `const n = num(0);
const m = num(1);
const trusts = [];
for (let i = 0; i < m; i++) trusts.push(nums(2 + i));

function findJudge(n, trusts) {
  // your code here
}

console.log(findJudge(n, trusts));`,
      `n = num(0)
m = num(1)
trusts = [nums(2 + i) for i in range(m)]

def find_judge(n, trusts):
    # your code here
    pass

print(find_judge(n, trusts))`,
    ),
    solution: solution(
      `const n = num(0);
const m = num(1);
const trusts = [];
for (let i = 0; i < m; i++) trusts.push(nums(2 + i));
function findJudge(n, trusts) {
  const score = new Array(n + 1).fill(0);
  for (const [a, b] of trusts) { score[a]--; score[b]++; }
  for (let p = 1; p <= n; p++) if (score[p] === n - 1) return p;
  return -1;
}
console.log(findJudge(n, trusts));`,
      `n = num(0)
m = num(1)
trusts = [nums(2 + i) for i in range(m)]

def find_judge(n, trusts):
    score = [0] * (n + 1)
    for a, b in trusts:
        score[a] -= 1
        score[b] += 1
    for p in range(1, n + 1):
        if score[p] == n - 1:
            return p
    return -1

print(find_judge(n, trusts))`,
    ),
    testCases: [
      sample('2\n1\n1 2', '2'),
      sample('3\n2\n1 3\n2 3', '3'),
      hidden('1\n0\n', '1'),
      hidden('3\n3\n1 2\n2 3\n3 1', '-1'),
      hidden('4\n3\n1 3\n1 4\n2 3', '-1'),
      hidden('3\n2\n1 2\n1 3', '-1'),
    ],
  },

  {
    slug: 'max-area-of-island',
    title: 'Max Area of Island',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Find the area (number of connected land cells) of the largest island in a grid of `1` (land) and `0` (water). Return `0` if there is no island.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` characters of `0`/`1`\n\n**Output**\nThe maximum island area.',
    descriptionHi:
      'Ek `1` (zameen) aur `0` (paani) wale grid mein sabse bade island ka area (connected land cells ki sankhya) dhoondo. Agar koi island nahi hai to `0` return karo.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` characters `0`/`1`\n\n**Output**\nMaximum island area.',
    examples: [
      { input: '3 3\n110\n100\n001', output: '3' },
      { input: '2 2\n00\n00', output: '0' },
    ],
    constraints: ['1 <= rows, cols <= 50'],
    hints: [
      'This directly reuses Number of Islands\' flood-fill structure, with one change: count the cells in each island instead of just counting islands.',
      'Have the flood-fill function return the size of the component it just filled.',
      'Track the maximum size seen across all islands found during the full grid scan.',
    ],
    approach:
      'Same scan-and-flood-fill structure as Number of Islands. On each unvisited land cell, flood-fill the whole connected component (marking cells visited), counting how many cells were part of it. Track the maximum count seen across all islands.',
    approachHi:
      'Number of Islands wala hi scan-and-flood-fill structure. Har unvisited land cell par, poore connected component ko flood-fill karo (cells visited mark karte hue), gin te hue ki kitne cells us mein the. Saare islands mein se maximum count track karo.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols) worst case',
    solutionExplanation:
      'This is Number of Islands with the flood-fill\'s return value repurposed: instead of merely marking a component as visited and moving on, each fill now also counts exactly how many cells belonged to that component, and the outer scan keeps only the largest such count instead of a running tally of how many components exist — the traversal mechanics are otherwise identical.',
    solutionExplanationHi:
      'Ye Number of Islands hi hai, bas flood-fill ke return value ko repurpose kiya gaya hai: ek component ko sirf visited mark karke aage badhne ke bajaye, har fill ab exactly ye bhi count karta hai ki us component mein kitne cells the, aur outer scan sirf sabse bade count ko rakhta hai, na ki kitne components hain uska running tally — baaki traversal mechanics wahi hain.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let r = 1; r <= rows; r++) grid.push(line(r).split(''));

function maxAreaOfIsland(grid) {
  // your code here
}

console.log(maxAreaOfIsland(grid));`,
      `rows, cols = nums(0)
grid = [list(line(r)) for r in range(1, rows + 1)]

def max_area_of_island(grid):
    # your code here
    pass

print(max_area_of_island(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let r = 1; r <= rows; r++) grid.push(line(r).split(''));
function maxAreaOfIsland(grid) {
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '1') continue;
      let area = 0;
      const stack = [[r, c]];
      grid[r][c] = '0';
      while (stack.length) {
        const [y, x] = stack.pop();
        area++;
        for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx] === '1') {
            grid[ny][nx] = '0';
            stack.push([ny, nx]);
          }
        }
      }
      best = Math.max(best, area);
    }
  }
  return best;
}
console.log(maxAreaOfIsland(grid));`,
      `rows, cols = nums(0)
grid = [list(line(r)) for r in range(1, rows + 1)]

def max_area_of_island(grid):
    best = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != "1":
                continue
            area = 0
            stack = [(r, c)]
            grid[r][c] = "0"
            while stack:
                y, x = stack.pop()
                area += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < rows and 0 <= nx < cols and grid[ny][nx] == "1":
                        grid[ny][nx] = "0"
                        stack.append((ny, nx))
            best = max(best, area)
    return best

print(max_area_of_island(grid))`,
    ),
    testCases: [
      sample('3 3\n110\n100\n001', '3'),
      sample('2 2\n00\n00', '0'),
      hidden('1 1\n1', '1'),
      hidden('1 4\n1111', '4'),
      hidden('3 3\n111\n111\n111', '9'),
      hidden('3 3\n101\n010\n101', '1'),
    ],
  },

  {
    slug: 'keys-and-rooms',
    title: 'Keys and Rooms',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'There are `n` rooms (0 to n-1). Room 0 starts unlocked; each room contains a list of keys to other rooms. Starting in room 0, determine whether every room can eventually be visited.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: for room `i`, the count of keys followed by that many key values (may be an empty line if 0 keys)\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      '`n` rooms hain (0 se n-1). Room 0 shuru mein unlocked hai; har room mein doosre rooms ki keys ki ek list hai. Room 0 se shuru karke, check karo ki kya aakhir mein har room visit kiya ja sakta hai.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: room `i` ke liye, keys ki count phir utni hi key values (0 keys ho to khaali line ho sakti hai)\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n1\n1\n2\n2 3\n1\n1\n0\n', output: 'true' },
      { input: '4\n1\n1\n1\n2\n0\n\n0\n', output: 'false' },
    ],
    constraints: ['1 <= n <= 1000'],
    hints: [
      'This is reachability, phrased as a story: rooms are nodes, keys found in a room are directed edges to the rooms they unlock.',
      'Starting from room 0, a graph traversal (BFS or DFS) that only ever visits rooms for which a key has been found answers exactly which rooms are reachable.',
      'The answer is simply whether the number of visited rooms equals n.',
    ],
    approach:
      'Treat each room as a node and each key found in a room as a directed edge to the room it opens. DFS or BFS from room 0, visiting rooms via the keys collected along the way. The answer is whether all `n` rooms end up visited.',
    approachHi:
      'Har room ko ek node ki tarah aur har room mein mili key ko us room ki taraf ek directed edge ki tarah treat karo jo wo kholti hai. Room 0 se DFS ya BFS karo, raaste mein collect hui keys se rooms visit karte hue. Answer ye hai ki kya saare `n` rooms visit ho gaye.',
    timeComplexity: 'O(n + total keys)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Stripped of its keys-and-rooms framing, this is exactly Find if Path Exists in Graph generalized to "can I reach EVERY node" instead of "can I reach one specific node" — a single traversal from the start, following edges (keys) as they are discovered, visits every node reachable at all, and the room count that ends up visited is compared against n to answer the all-rooms-reachable question directly.',
    solutionExplanationHi:
      'Keys-and-rooms wali framing hata do, to ye bilkul Find if Path Exists in Graph hai, bas "kya main EK specific node tak pahunch sakta hoon" ke bajaye "kya main HAR node tak pahunch sakta hoon" ke liye generalize kiya gaya — start se ek single traversal, discover hoti keys (edges) follow karte hue, jo bhi node reachable hai use visit kar leta hai, aur aakhir mein visited rooms ka count n se compare karke seedha all-rooms-reachable sawaal ka jawab mil jaata hai.',
    starter: starter(
      `const n = num(0);
const rooms = [];
for (let i = 0; i < n; i++) {
  const cnt = num(1 + 2 * i);
  rooms.push(cnt ? nums(1 + 2 * i + 1) : []);
}

function canVisitAll(rooms) {
  // your code here
}

console.log(canVisitAll(rooms));`,
      `n = num(0)
rooms = []
for i in range(n):
    cnt = num(1 + 2 * i)
    rooms.append(nums(1 + 2 * i + 1) if cnt else [])

def can_visit_all(rooms):
    # your code here
    pass

print("true" if can_visit_all(rooms) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const rooms = [];
for (let i = 0; i < n; i++) {
  const cnt = num(1 + 2 * i);
  rooms.push(cnt ? nums(1 + 2 * i + 1) : []);
}
function canVisitAll(rooms) {
  const visited = new Array(rooms.length).fill(false);
  const stack = [0];
  visited[0] = true;
  let count = 1;
  while (stack.length) {
    const room = stack.pop();
    for (const key of rooms[room]) {
      if (!visited[key]) { visited[key] = true; count++; stack.push(key); }
    }
  }
  return count === rooms.length;
}
console.log(canVisitAll(rooms));`,
      `n = num(0)
rooms = []
for i in range(n):
    cnt = num(1 + 2 * i)
    rooms.append(nums(1 + 2 * i + 1) if cnt else [])

def can_visit_all(rooms):
    visited = [False] * len(rooms)
    stack = [0]
    visited[0] = True
    count = 1
    while stack:
        room = stack.pop()
        for key in rooms[room]:
            if not visited[key]:
                visited[key] = True
                count += 1
                stack.append(key)
    return count == len(rooms)

print("true" if can_visit_all(rooms) else "false")`,
    ),
    testCases: [
      sample('4\n1\n1\n2\n2 3\n1\n1\n0\n', 'true'),
      sample('4\n1\n1\n1\n2\n0\n\n0\n', 'false'),
      hidden('1\n0\n', 'true'),
      hidden('2\n0\n\n0\n', 'false'),
      hidden('2\n1\n1\n0\n', 'true'),
      hidden('3\n1\n2\n0\n\n1\n0', 'false'),
    ],
  },

  {
    slug: 'minimum-height-trees',
    title: 'Minimum Height Trees',
    category: 'Graph',
    difficulty: 'HARD',
    description:
      'Given a tree with `n` nodes (0-indexed), find all nodes that, if chosen as the root, minimize the tree\'s height. Print those node(s) sorted ascending (there are at most 2).\n\n**Input**\n- Line 1: `n`\n- Line 2: `m` (number of edges, `n-1` if connected)\n- Next `m` lines: `u v`\n\n**Output**\nThe minimum-height-tree roots, sorted ascending, space-separated.',
    descriptionHi:
      '`n` nodes (0-indexed) wala ek tree diya hai. Wo saare nodes dhoondo jinhe root chunne par tree ki height minimize ho jaaye. Un node(s) ko ascending sorted, space se separate print karo (zyada se zyada 2 hote hain).\n\n**Input**\n- Line 1: `n`\n- Line 2: `m` (edges ki sankhya, connected ho to `n-1`)\n- Agli `m` lines: `u v`\n\n**Output**\nMinimum-height-tree roots, ascending sorted, space se separate.',
    examples: [
      { input: '4\n3\n1 0\n1 2\n1 3', output: '1' },
      { input: '6\n5\n3 0\n3 1\n3 2\n3 4\n5 4', output: '3 4' },
    ],
    constraints: ['1 <= n <= 2*10^4'],
    hints: [
      'Trying every node as a potential root and computing the resulting height (an O(n) BFS each time) works but costs O(n^2) overall.',
      'The optimal root(s) always lie at the "center" of the tree — think of the tree as a piece of string held up by its two ends: the middle sags to the lowest point.',
      'Repeatedly peel away all current leaves (nodes with only one remaining connection) layer by layer, like trimming a string from both ends — whatever is left at the end (1 or 2 nodes) is the center.',
    ],
    approach:
      'Repeatedly trim leaves. Compute each node\'s degree; queue every node with degree 1 (a leaf) as the first layer to remove. Repeatedly remove all current leaves, decrementing the degree of their neighbors and queuing any neighbor that newly becomes degree 1 (a leaf in the next layer), continuing until 2 or fewer nodes remain. Special-case `n <= 2`: all remaining nodes are already centers.',
    approachHi:
      'Baar-baar leaves trim karo. Har node ka degree compute karo; degree 1 wale (leaf) har node ko pehli layer ki tarah queue mein daalo. Baar-baar current saari leaves hatao, unke neighbors ka degree ghatao aur jo neighbor naya degree-1 (agli layer ka leaf) bane use queue mein daalo, jab tak 2 ya usse kam nodes na bachein. `n <= 2` ka special case: bache hue saare nodes pehle se centers hain.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The "hold the tree up like a string and let it sag" intuition has a precise algorithmic counterpart: peeling away the current outermost layer of leaves is equivalent to trimming one unit off each end of that string simultaneously, and repeating this layer by layer is guaranteed to converge on exactly the tree\'s topological center(s) — either a single node (if the tree\'s longest path has odd length) or two adjacent nodes (if even), since those are precisely the positions that remain equidistant from all removed layers on both sides. This runs in O(n) total because each node is added to the removal queue exactly once, unlike the O(n^2) brute force of separately BFS-ing from every candidate root.',
    solutionExplanationHi:
      '"Tree ko ek string ki tarah pakad kar latakao aur use jhukne do" wali intuition ka ek precise algorithmic counterpart hai: leaves ki abhi ki sabse bahar wali layer ko hatana, us string ke dono ends se ek saath ek-ek unit trim karne ke barabar hai, aur isse layer-by-layer repeat karna guaranteed tree ke exact topological center(s) par converge karta hai — ya to ek single node (agar tree ka longest path odd length ka hai) ya do adjacent nodes (agar even), kyunki yahi exactly wo positions hain jo dono taraf se hatai gayi saari layers se equidistant reh jaati hain. Ye total O(n) mein chalta hai kyunki har node removal queue mein exactly ek baar add hota hai, har candidate root se alag-alag BFS karne wale O(n^2) brute force ke ulat.',
    starter: starter(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));

function findMinHeightTrees(n, edges) {
  // return an array of root node(s)
  return [];
}

console.log(findMinHeightTrees(n, edges).sort((a, b) => a - b).join(' '));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]

def find_min_height_trees(n, edges):
    # return a list of root node(s)
    return []

print(" ".join(map(str, sorted(find_min_height_trees(n, edges)))))`,
    ),
    solution: solution(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));
function findMinHeightTrees(n, edges) {
  if (n <= 2) return Array.from({ length: n }, (_, i) => i);
  const adj = Array.from({ length: n }, () => new Set());
  for (const [u, v] of edges) { adj[u].add(v); adj[v].add(u); }
  let leaves = [];
  for (let i = 0; i < n; i++) if (adj[i].size === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const nextLeaves = [];
    for (const leaf of leaves) {
      for (const neighbor of adj[leaf]) {
        adj[neighbor].delete(leaf);
        if (adj[neighbor].size === 1) nextLeaves.push(neighbor);
      }
    }
    leaves = nextLeaves;
  }
  return leaves;
}
console.log(findMinHeightTrees(n, edges).sort((a, b) => a - b).join(' '));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]

def find_min_height_trees(n, edges):
    if n <= 2:
        return list(range(n))
    adj = [set() for _ in range(n)]
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    leaves = [i for i in range(n) if len(adj[i]) == 1]
    remaining = n
    while remaining > 2:
        remaining -= len(leaves)
        next_leaves = []
        for leaf in leaves:
            for neighbor in adj[leaf]:
                adj[neighbor].discard(leaf)
                if len(adj[neighbor]) == 1:
                    next_leaves.append(neighbor)
        leaves = next_leaves
    return leaves

print(" ".join(map(str, sorted(find_min_height_trees(n, edges)))))`,
    ),
    testCases: [
      sample('4\n3\n1 0\n1 2\n1 3', '1'),
      sample('6\n5\n3 0\n3 1\n3 2\n3 4\n5 4', '3 4'),
      hidden('1\n0\n', '0'),
      hidden('2\n1\n0 1', '0 1'),
      hidden('3\n2\n0 1\n1 2', '1'),
      hidden('7\n6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6', '3'),
    ],
  },

  {
    slug: 'course-schedule-ii',
    title: 'Course Schedule II',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given `n` courses and prerequisite pairs `a b` meaning "b must be taken before a", return a valid order to take all courses, or nothing if impossible. Process nodes in increasing order when multiple are available at once.\n\n**Input**\n- Line 1: `n m`\n- Next `m` lines: `a b`\n\n**Output**\nA valid course order, space-separated, or an empty line if impossible.',
    descriptionHi:
      '`n` courses aur prerequisite pairs `a b` diye hain (matlab "b pehle karna, phir a"). Saare courses lene ka ek valid order return karo, ya agar impossible hai to kuch nahi. Jab ek saath multiple available hon, unhe increasing order mein process karo.\n\n**Input**\n- Line 1: `n m`\n- Agli `m` lines: `a b`\n\n**Output**\nEk valid course order, space-separated, ya khaali line agar impossible ho.',
    examples: [
      { input: '2 1\n1 0', output: '0 1' },
      { input: '4 4\n1 0\n2 0\n3 1\n3 2', output: '0 1 2 3' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= m <= 5000'],
    hints: [
      'This is the exact same Kahn\'s-algorithm cycle detection as Course Schedule, except the discovered order itself is the answer, not just whether a cycle exists.',
      'Processing candidates (nodes with in-degree 0) in numeric order at each step, rather than an arbitrary order, is what makes the output deterministic.',
      'If fewer than n nodes are ever processed, a cycle exists and no valid order is possible — output nothing.',
    ],
    approach:
      "Kahn's algorithm. Initialize with every node of in-degree 0 (processed in increasing numeric order), repeatedly removing a node, appending it to the result, and decrementing its neighbors' in-degrees — queuing any neighbor that newly reaches in-degree 0. If all `n` nodes are eventually processed, output the resulting order; otherwise a cycle exists, so output nothing.",
    approachHi:
      "Kahn's algorithm. In-degree 0 wale har node se initialize karo (increasing numeric order mein process karte hue), baar-baar ek node hatao, use result mein append karo, aur uske neighbors ki in-degree ghatao — jo neighbor naya in-degree-0 bane use queue mein daalo. Agar saare `n` nodes aakhir mein process ho jaayein, resulting order output karo; warna cycle hai, isliye kuch output mat karo.",
    timeComplexity: 'O(n log n + m) with a sorted/priority initial queue for determinism, O(n + m) otherwise',
    spaceComplexity: 'O(n + m)',
    solutionExplanation:
      'This reuses Course Schedule\'s exact cycle-detection machinery unchanged, but repurposes its side effect: the order in which Kahn\'s algorithm happens to remove nodes IS already a valid topological order (every prerequisite is necessarily removed, and thus appended to the result, before anything that depends on it) — so the only new work is actually recording that order instead of just counting how many nodes got processed. Breaking ties by smallest node number whenever multiple in-degree-0 nodes are available at once is what makes that valid order also a deterministic, reproducible one for a grader.',
    solutionExplanationHi:
      'Ye Course Schedule wali hi cycle-detection machinery bina badlaav ke reuse karta hai, bas uske side effect ko repurpose karta hai: jis order mein Kahn\'s algorithm nodes hataata hai wahi already ek valid topological order hai (har prerequisite, use depend karne wali kisi bhi cheez se pehle, zaroori taur par hataya jaata hai aur isliye result mein append hota hai) — isliye sirf naya kaam actually us order ko record karna hai, sirf ye count karne ke bajaye ki kitne nodes process hue. Jab bhi ek saath multiple in-degree-0 nodes available hon, sabse chhote node number se tie-break karna hi us valid order ko ek deterministic, reproducible order bhi banata hai grader ke liye.',
    starter: starter(
      `const [n, m] = nums(0);
const edges = [];
for (let i = 1; i <= m; i++) edges.push(nums(i));

function findOrder(n, edges) {
  // return a valid order, or [] if impossible
  return [];
}

console.log(findOrder(n, edges).join(' '));`,
      `n, m = nums(0)
edges = [nums(i) for i in range(1, m + 1)]

def find_order(n, edges):
    # return a valid order, or [] if impossible
    return []

print(" ".join(map(str, find_order(n, edges))))`,
    ),
    solution: solution(
      `const [n, m] = nums(0);
const edges = [];
for (let i = 1; i <= m; i++) edges.push(nums(i));
function findOrder(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of edges) { adj[b].push(a); indeg[a]++; }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    queue.sort((a, b) => a - b);
    const node = queue.shift();
    order.push(node);
    for (const next of adj[node].slice().sort((a, b) => a - b)) if (--indeg[next] === 0) queue.push(next);
  }
  return order.length === n ? order : [];
}
console.log(findOrder(n, edges).join(' '));`,
      `n, m = nums(0)
edges = [nums(i) for i in range(1, m + 1)]

def find_order(n, edges):
    adj = [[] for _ in range(n)]
    indeg = [0] * n
    for a, b in edges:
        adj[b].append(a)
        indeg[a] += 1
    queue = [i for i in range(n) if indeg[i] == 0]
    order = []
    while queue:
        queue.sort()
        node = queue.pop(0)
        order.append(node)
        for nxt in sorted(adj[node]):
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                queue.append(nxt)
    return order if len(order) == n else []

print(" ".join(map(str, find_order(n, edges))))`,
    ),
    testCases: [
      sample('2 1\n1 0', '0 1'),
      sample('4 4\n1 0\n2 0\n3 1\n3 2', '0 1 2 3'),
      hidden('1 0\n', '0'),
      hidden('2 2\n1 0\n0 1', ''),
      hidden('3 0\n', '0 1 2'),
      hidden('3 2\n1 0\n2 0', '0 1 2'),
    ],
  },

  {
    slug: 'number-of-connected-components',
    title: 'Number of Connected Components in an Undirected Graph',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Count the number of connected components in an undirected graph with `n` nodes (0-indexed) and the given edges, using Union-Find.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m`\n- Next `m` lines: `u v`\n\n**Output**\nThe number of connected components.',
    descriptionHi:
      'Union-Find use karke, `n` nodes (0-indexed) aur diye gaye edges wale undirected graph mein connected components ki sankhya count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `m`\n- Agli `m` lines: `u v`\n\n**Output**\nConnected components ki sankhya.',
    examples: [
      { input: '5\n3\n0 1\n1 2\n3 4', output: '2' },
      { input: '5\n2\n0 1\n2 3', output: '3' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= m <= 2000'],
    hints: [
      'A BFS/DFS scan counting how many times a fresh unvisited node is found also solves this — but this is the standard problem used to introduce the Union-Find (Disjoint Set Union) data structure.',
      'Start with n separate components (every node its own parent), and union the two endpoints of every edge.',
      'Each successful union (merging two previously-different components) reduces the total component count by exactly one.',
    ],
    approach:
      'Union-Find with path compression and union by size/rank. Initialize `n` singleton components. For each edge, find the roots of both endpoints; if they differ, union them and decrement a running component counter (starting at `n`).',
    approachHi:
      'Path compression aur union by size/rank ke saath Union-Find. `n` singleton components se initialize karo. Har edge ke liye, dono endpoints ke roots dhoondo; agar alag hain, unhe union karo aur ek running component counter (jo `n` se shuru hota hai) ghatao.',
    timeComplexity: 'O((n + m) * α(n)) — near O(n + m) with path compression',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Union-Find models exactly the right abstraction for "count how many groups of mutually-connected nodes there are": starting from n separate groups (the maximum possible), every edge either connects two already-merged nodes (no change to the count) or genuinely merges two previously-separate groups into one (decrementing the count by exactly one) — so the final component count is just n minus the number of "genuinely new" unions performed, tracked incrementally rather than needing a separate full traversal at the end to count components.',
    solutionExplanationHi:
      'Union-Find "aapas mein connected nodes ke kitne groups hain" ke liye exactly sahi abstraction model karta hai: n alag groups se shuru karke (maximum possible), har edge ya to do pehle-se-merged nodes ko connect karta hai (count mein koi badlaav nahi) ya genuinely do pehle-alag groups ko ek mein merge karta hai (count exactly ek se ghatata hai) — isliye final component count bas n minus "genuinely nayi" unions ki sankhya hai, jo incrementally track hoti hai, end mein components count karne ke liye alag se full traversal ki zaroorat nahi.',
    starter: starter(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));

function countComponents(n, edges) {
  // your code here
}

console.log(countComponents(n, edges));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]

def count_components(n, edges):
    # your code here
    pass

print(count_components(n, edges))`,
    ),
    solution: solution(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));
function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  let count = n;
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) continue;
    if (rank[ru] < rank[rv]) parent[ru] = rv;
    else if (rank[ru] > rank[rv]) parent[rv] = ru;
    else { parent[rv] = ru; rank[ru]++; }
    count--;
  }
  return count;
}
console.log(countComponents(n, edges));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]

def count_components(n, edges):
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    count = n
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            continue
        if rank[ru] < rank[rv]:
            parent[ru] = rv
        elif rank[ru] > rank[rv]:
            parent[rv] = ru
        else:
            parent[rv] = ru
            rank[ru] += 1
        count -= 1
    return count

print(count_components(n, edges))`,
    ),
    testCases: [
      sample('5\n3\n0 1\n1 2\n3 4', '2'),
      sample('5\n2\n0 1\n2 3', '3'),
      hidden('1\n0\n', '1'),
      hidden('4\n0\n', '4'),
      hidden('4\n3\n0 1\n1 2\n2 3', '1'),
      hidden('6\n3\n0 1\n2 3\n4 5', '3'),
    ],
  },

  {
    slug: 'redundant-connection',
    title: 'Redundant Connection',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'A tree with `n` nodes had one extra edge added, creating exactly one cycle. Given the `n` edges in the order they were added, find the last edge (by input order) that could be removed to make it a tree again.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `u v`\n\n**Output**\nThe redundant edge, as `u v`.',
    descriptionHi:
      '`n` nodes wale ek tree mein ek extra edge add ho gaya, jisse exactly ek cycle ban gayi. `n` edges unke add hone ke order mein diye hain, wo aakhri edge (input order ke hisaab se) dhoondo jise hataane se wapas tree ban jaaye.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `u v`\n\n**Output**\nRedundant edge, `u v` format mein.',
    examples: [
      { input: '3\n1 2\n1 3\n2 3', output: '2 3' },
      { input: '4\n1 2\n2 3\n3 4\n1 4', output: '1 4' },
    ],
    constraints: ['3 <= n <= 1000', 'The edges form a tree plus exactly one extra edge'],
    hints: [
      'A valid tree with n nodes always has exactly n-1 edges — any additional edge is guaranteed to create exactly one cycle.',
      'Process edges in the given order, using Union-Find: if both endpoints of an edge are already in the same component, adding this edge would close a cycle.',
      'Because it must be the LAST such edge (in input order), simply return the first edge encountered whose endpoints are already connected — since exactly one extra edge exists, that is the only one that will ever trigger this condition.',
    ],
    approach:
      'Union-Find, processing edges in input order. For each edge `(u, v)`, find the roots of `u` and `v`. If they are already the same (already connected before this edge), this edge is the redundant one — return it immediately. Otherwise, union the two components and continue.',
    approachHi:
      'Union-Find, edges ko input order mein process karte hue. Har edge `(u, v)` ke liye, `u` aur `v` ke roots dhoondo. Agar wo pehle se same hain (is edge se pehle hi connected), ye edge redundant hai — turant use return karo. Warna, dono components ko union karo aur aage badho.',
    timeComplexity: 'O(n * α(n)) — near O(n) with path compression',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Because the input is guaranteed to contain exactly one cycle-forming edge, the first edge (in processing order) whose two endpoints are found to already belong to the same Union-Find component is necessarily that unique redundant edge — every genuinely tree-building edge merges two previously-separate components (by definition, since a real tree edge cannot close a cycle), so the very first "already connected" detection can only be triggered by the one edge that does not belong. There is no need to check all edges for this property; the search can stop at the first hit.',
    solutionExplanationHi:
      'Chunki input mein guaranteed exactly ek hi cycle-forming edge hai, processing order mein wo pehla edge jiske do endpoints already same Union-Find component mein paaye jaate hain, zaroori taur par wahi unique redundant edge hai — har genuinely tree-building edge do pehle-alag components ko merge karta hai (definition se, kyunki ek real tree edge cycle close nahi kar sakta), isliye pehli "already connected" detection sirf us ek edge se hi trigger ho sakti hai jo belong nahi karta. Is property ke liye saare edges check karne ki zaroorat nahi; search pehle hit par hi ruk sakti hai.',
    starter: starter(
      `const n = num(0);
const edges = [];
for (let i = 0; i < n; i++) edges.push(nums(1 + i));

function findRedundantConnection(edges) {
  // return [u, v]
  return [0, 0];
}

console.log(findRedundantConnection(edges).join(' '));`,
      `n = num(0)
edges = [nums(1 + i) for i in range(n)]

def find_redundant_connection(edges):
    # return [u, v]
    return [0, 0]

print(" ".join(map(str, find_redundant_connection(edges))))`,
    ),
    solution: solution(
      `const n = num(0);
const edges = [];
for (let i = 0; i < n; i++) edges.push(nums(1 + i));
function findRedundantConnection(edges) {
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) return [u, v];
    parent[ru] = rv;
  }
  return [0, 0];
}
console.log(findRedundantConnection(edges).join(' '));`,
      `n = num(0)
edges = [nums(1 + i) for i in range(n)]

def find_redundant_connection(edges):
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return [u, v]
        parent[ru] = rv
    return [0, 0]

print(" ".join(map(str, find_redundant_connection(edges))))`,
    ),
    testCases: [
      sample('3\n1 2\n1 3\n2 3', '2 3'),
      sample('4\n1 2\n2 3\n3 4\n1 4', '1 4'),
      hidden('5\n1 2\n2 3\n3 4\n4 5\n2 5', '2 5'),
      hidden('3\n1 2\n2 3\n1 3', '1 3'),
    ],
  },

  {
    slug: 'graph-valid-tree',
    title: 'Graph Valid Tree',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Given `n` nodes (0-indexed) and a list of undirected edges, determine whether they form a valid tree (connected, with no cycles).\n\n**Input**\n- Line 1: `n`\n- Line 2: `m`\n- Next `m` lines: `u v`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      '`n` nodes (0-indexed) aur undirected edges ki ek list di hai. Check karo ki wo ek valid tree banate hain (connected, koi cycle nahi).\n\n**Input**\n- Line 1: `n`\n- Line 2: `m`\n- Agli `m` lines: `u v`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '5\n4\n0 1\n0 2\n0 3\n1 4', output: 'true' },
      { input: '5\n4\n0 1\n1 2\n2 3\n1 3', output: 'false' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= m <= 5000'],
    hints: [
      'A valid tree needs exactly two things: no cycles, and full connectivity — check the easy structural count first.',
      'A quick necessary (but not sufficient) check: a tree with n nodes has exactly n-1 edges. If the edge count does not match, it cannot be a tree — fail fast.',
      'Given exactly n-1 edges, use Union-Find: if any edge connects two nodes already in the same component, there is a cycle (reject); if all edges union successfully, the n-1 unions are guaranteed to leave exactly one component (fully connected).',
    ],
    approach:
      'First check `m === n - 1` (a necessary edge count for any tree) — if not, immediately return false. Otherwise, Union-Find over all edges: if any edge\'s endpoints are already in the same component, a cycle exists, so return false. If every edge unions two distinct components (guaranteed to happen `n-1` times without ever hitting a cycle if the structure is valid), the result is a fully connected, cycle-free tree — return true.',
    approachHi:
      'Pehle `m === n - 1` check karo (kisi bhi tree ke liye zaroori edge count) — nahi hai to turant false. Warna, saare edges par Union-Find: agar kisi edge ke endpoints pehle se same component mein hain, cycle hai, isliye false. Agar har edge do distinct components ko union karta hai (agar structure valid hai to guaranteed `n-1` baar bina kisi cycle ke hoga), result ek poori tarah connected, cycle-free tree hai — true return karo.',
    timeComplexity: 'O(n * α(n)) — near O(n) with path compression',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The n-1 edge count check is a cheap necessary condition that filters out an entire class of invalid inputs (too many edges definitely means a cycle somewhere; too few definitely means disconnection) before doing any real work — but it is not sufficient on its own, since n-1 edges could still be arranged with a cycle in one part and a disconnected piece elsewhere. Running Union-Find over exactly n-1 edges is what confirms the stronger claim: if none of those n-1 edges ever connects two already-same-component nodes, every single union must have merged two genuinely different components, and starting from n singleton components with exactly n-1 successful merges mathematically forces the result down to exactly one component — connected, by construction, with no cycle, since a cycle would have meant one merge failed (an edge connecting an already-same component) somewhere along the way.',
    solutionExplanationHi:
      'n-1 edge count check ek sasta necessary condition hai jo kisi bhi real kaam se pehle ek poori class ke invalid inputs ko filter kar deta hai (bahut zyada edges ka matlab hai definitely kahin cycle hai; bahut kam ka matlab hai definitely disconnection) — par ye akela sufficient nahi hai, kyunki n-1 edges phir bhi ek jagah cycle aur kahin disconnected piece ke saath arrange ho sakte hain. Exactly n-1 edges par Union-Find chalaana hi strong claim confirm karta hai: agar un n-1 edges mein se koi bhi kabhi do already-same-component nodes ko connect nahi karta, to har single union ne genuinely do alag components merge kiye hon ge, aur n singleton components se shuru karke exactly n-1 successful merges ke saath, mathematically result exactly ek component tak pahunchta hai — connected, construction se, bina kisi cycle ke, kyunki cycle ka matlab hota ki beech mein kahin ek merge fail hota (ek edge jo already-same component ko connect karta).',
    starter: starter(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));

function validTree(n, edges) {
  // your code here
}

console.log(validTree(n, edges));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]

def valid_tree(n, edges):
    # your code here
    pass

print("true" if valid_tree(n, edges) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const m = num(1);
const edges = [];
for (let i = 0; i < m; i++) edges.push(nums(2 + i));
function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) return false;
    parent[ru] = rv;
  }
  return true;
}
console.log(validTree(n, edges));`,
      `n = num(0)
m = num(1)
edges = [nums(2 + i) for i in range(m)]

def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False
        parent[ru] = rv
    return True

print("true" if valid_tree(n, edges) else "false")`,
    ),
    testCases: [
      sample('5\n4\n0 1\n0 2\n0 3\n1 4', 'true'),
      sample('5\n4\n0 1\n1 2\n2 3\n1 3', 'false'),
      hidden('1\n0\n', 'true'),
      hidden('2\n0\n', 'false'),
      hidden('4\n3\n0 1\n2 3\n1 2', 'true'),
      hidden('4\n4\n0 1\n1 2\n2 3\n3 0', 'false'),
    ],
  },

  {
    slug: 'is-graph-bipartite',
    title: 'Is Graph Bipartite?',
    category: 'Graph',
    difficulty: 'MEDIUM',
    description:
      'Determine whether an undirected graph\'s nodes (0-indexed) can be split into two groups such that every edge connects nodes from different groups.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: for node `i`, the count of neighbors followed by that many neighbor values (may be an empty line if 0 neighbors)\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki ek undirected graph ke nodes (0-indexed) ko do groups mein aise baanta ja sakta hai ki har edge alag groups ke nodes ko connect kare.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: node `i` ke liye, neighbors ki count phir utni hi neighbor values (0 neighbors ho to khaali line ho sakti hai)\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '3\n2\n1 2\n2\n0 2\n2\n0 1', output: 'false' },
      { input: '4\n3\n1 2 3\n1\n0\n1\n0\n1\n0', output: 'true' },
    ],
    constraints: ['1 <= n <= 100'],
    hints: [
      'A graph is bipartite exactly when it can be properly 2-colored: every edge connects nodes of DIFFERENT colors.',
      'Assign a starting node color 0, then BFS/DFS, giving every neighbor the opposite color of the current node.',
      'If a neighbor is ever found to already have the SAME color as the current node, the graph cannot be properly 2-colored — it is not bipartite.',
    ],
    approach:
      'Attempt a 2-coloring via BFS/DFS on each not-yet-colored component. Color the starting node 0; for each edge to an uncolored neighbor, assign it the opposite color and continue; if an edge connects two already-colored nodes of the SAME color, the graph is not bipartite. Check every component, since the graph may be disconnected.',
    approachHi:
      'Har abhi-tak-uncolored component par BFS/DFS se 2-coloring try karo. Starting node ko color 0 do; uncolored neighbor tak ke har edge ke liye, use opposite color do aur aage badho; agar koi edge do already-colored SAME color wale nodes ko connect karta hai, graph bipartite nahi hai. Har component check karo, kyunki graph disconnected ho sakta hai.',
    timeComplexity: 'O(n + total edges)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Bipartiteness is definitionally equivalent to proper 2-colorability with no edge monochromatic — so attempting to actually construct such a coloring greedily (alternate colors along every edge as they are discovered) either succeeds, proving bipartiteness by construction, or fails at some specific edge where both endpoints are forced into the same color, which is itself a direct proof of an odd-length cycle (the real underlying reason a graph fails to be bipartite) without needing to search for that cycle explicitly. Checking every connected component separately is necessary because a disconnected graph\'s components have no coloring relationship to each other — each is colored independently.',
    solutionExplanationHi:
      'Bipartiteness definition se hi proper 2-colorability ke barabar hai jahan koi edge monochromatic na ho — isliye actually greedily aisi coloring banane ki koshish karna (har discover hue edge par alternate colors) ya to succeed hota hai, construction se bipartiteness prove karte hue, ya kisi specific edge par fail hota hai jahan dono endpoints same color mein force ho jaate hain, jo khud ek odd-length cycle ka direct proof hai (asal underlying reason jispe graph bipartite nahi hota), bina us cycle ko explicitly search kiye. Har connected component ko alag check karna zaroori hai kyunki disconnected graph ke components ka aapas mein koi coloring relationship nahi hota — har ek independently color hota hai.',
    starter: starter(
      `const n = num(0);
const adj = [];
for (let i = 0; i < n; i++) {
  const cnt = num(1 + 2 * i);
  adj.push(cnt ? nums(1 + 2 * i + 1) : []);
}

function isBipartite(adj) {
  // your code here
}

console.log(isBipartite(adj));`,
      `n = num(0)
adj = []
for i in range(n):
    cnt = num(1 + 2 * i)
    adj.append(nums(1 + 2 * i + 1) if cnt else [])

def is_bipartite(adj):
    # your code here
    pass

print("true" if is_bipartite(adj) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const adj = [];
for (let i = 0; i < n; i++) {
  const cnt = num(1 + 2 * i);
  adj.push(cnt ? nums(1 + 2 * i + 1) : []);
}
function isBipartite(adj) {
  const color = new Array(adj.length).fill(0);
  for (let start = 0; start < adj.length; start++) {
    if (color[start] !== 0) continue;
    color[start] = 1;
    const queue = [start];
    while (queue.length) {
      const node = queue.shift();
      for (const next of adj[node]) {
        if (color[next] === 0) { color[next] = -color[node]; queue.push(next); }
        else if (color[next] === color[node]) return false;
      }
    }
  }
  return true;
}
console.log(isBipartite(adj));`,
      `from collections import deque
n = num(0)
adj = []
for i in range(n):
    cnt = num(1 + 2 * i)
    adj.append(nums(1 + 2 * i + 1) if cnt else [])

def is_bipartite(adj):
    color = [0] * len(adj)
    for start in range(len(adj)):
        if color[start] != 0:
            continue
        color[start] = 1
        q = deque([start])
        while q:
            node = q.popleft()
            for nxt in adj[node]:
                if color[nxt] == 0:
                    color[nxt] = -color[node]
                    q.append(nxt)
                elif color[nxt] == color[node]:
                    return False
    return True

print("true" if is_bipartite(adj) else "false")`,
    ),
    testCases: [
      sample('3\n2\n1 2\n2\n0 2\n2\n0 1', 'false'),
      sample('4\n3\n1 2 3\n1\n0\n1\n0\n1\n0', 'true'),
      hidden('1\n0\n', 'true'),
      hidden('2\n1\n1\n1\n0', 'true'),
      hidden('5\n2\n1 4\n2\n0 2\n2\n1 3\n2\n2 4\n2\n3 0', 'false'),
      hidden('6\n1\n1\n2\n0 2\n1\n1\n1\n4\n1\n3\n0\n', 'true'),
    ],
  },
];
