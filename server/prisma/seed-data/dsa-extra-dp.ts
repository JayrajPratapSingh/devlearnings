import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Dynamic Programming — expansion batch, part 1 of 2. Foundational 1D DP
 * (climbing stairs variants, house robber ii, decode ways, jump game),
 * knapsack-family counting/decision DP (word break, combination sum iv,
 * partition equal subset sum, target sum), and grid DP (unique paths,
 * minimum path sum, triangle). Builds on the original 5 (climbing-stairs,
 * house-robber, coin-change, longest-increasing-subsequence, edit-distance).
 */
export const dsaExtraDp: SeedProblem[] = [
  {
    slug: 'min-cost-climbing-stairs',
    title: 'Min Cost Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'EASY',
    description:
      'Given a `cost` array where `cost[i]` is the cost of stepping on stair `i`, and you can climb 1 or 2 steps at a time starting from step 0 or step 1, find the minimum cost to reach the top (one step past the last stair).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated costs\n\n**Output**\nThe minimum cost.',
    descriptionHi:
      'Ek `cost` array diya hai jahan `cost[i]` stair `i` par step karne ka cost hai, aur aap step 0 ya step 1 se shuru karke ek baar mein 1 ya 2 steps chadh sakte ho, top tak (aakhri stair se ek step aage) pahunchne ka minimum cost dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated costs\n\n**Output**\nMinimum cost.',
    examples: [
      { input: '3\n10 15 20', output: '15' },
      { input: '6\n1 100 1 1 1 100', output: '3' },
    ],
    constraints: ['2 <= n <= 1000', '0 <= cost[i] <= 999'],
    hints: [
      'Define dp[i] as the minimum cost to REACH stair i (having paid cost[i] to stand there). The top is one step past the last stair, reachable from either of the last two stairs.',
      'dp[i] = cost[i] + min(dp[i-1], dp[i-2]), with dp[0] = cost[0] and dp[1] = cost[1] as the base cases.',
      'The answer is min(dp[n-1], dp[n-2]) — the cost to reach the top from whichever of the last two stairs is cheaper.',
    ],
    approach:
      'Bottom-up 1D DP. dp[i] holds the minimum cost to have paid and be standing on stair i. Transition: dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Since the top is reachable directly from stair n-1 or stair n-2 (a final free step, no further cost), the answer is min(dp[n-1], dp[n-2]).',
    approachHi:
      'Bottom-up 1D DP. dp[i] mein minimum cost hota hai stair i par pahunchne ka (wahan pay karke khada hona). Transition: dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Kyunki top stair n-1 ya stair n-2 se directly reachable hai (ek final free step, koi aur cost nahi), answer min(dp[n-1], dp[n-2]) hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with two rolling variables',
    solutionExplanation:
      'The recursive structure is: the cheapest way to be standing on stair i is to have paid cost[i] plus whichever of the two stairs that can reach it (i-1 or i-2) was itself cheaper to reach — this is a textbook optimal-substructure argument, since a cheaper prefix path can never be beaten by a more expensive one for the same suffix. Because each dp[i] only ever depends on the two immediately preceding values, the whole array collapses to two rolling variables, turning what looks like an O(n)-space table into O(1) space with no loss of correctness.',
    solutionExplanationHi:
      'Recursive structure ye hai: stair i par khade hone ka sabse sasta tarika hai cost[i] pay karna plus in do stairs mein se (i-1 ya i-2) jo bhi wahan tak pahunchne mein khud sasta tha — ye ek textbook optimal-substructure argument hai, kyunki same suffix ke liye ek sasta prefix path kabhi ek mehnge se haara nahi ja sakta. Kyunki har dp[i] sirf pichle do values par depend karta hai, poora array do rolling variables mein collapse ho jaata hai, jo O(n)-space table jaisa dikhta hai use bina correctness khoye O(1) space mein badal deta hai.',
    starter: starter(
      `const n = num(0);
const cost = nums(1);

function minCostClimbingStairs(cost) {
  // return the minimum cost
  return 0;
}

console.log(minCostClimbingStairs(cost));`,
      `n = num(0)
cost = nums(1)

def min_cost_climbing_stairs(cost):
    # return the minimum cost
    return 0

print(min_cost_climbing_stairs(cost))`,
    ),
    solution: solution(
      `const n = num(0);
const cost = nums(1);
function minCostClimbingStairs(cost) {
  let prev2 = 0, prev1 = 0;
  for (let i = 2; i <= cost.length; i++) {
    const cur = Math.min(prev1 + cost[i - 1], prev2 + cost[i - 2]);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
console.log(minCostClimbingStairs(cost));`,
      `n = num(0)
cost = nums(1)

def min_cost_climbing_stairs(cost):
    prev2, prev1 = 0, 0
    for i in range(2, len(cost) + 1):
        cur = min(prev1 + cost[i - 1], prev2 + cost[i - 2])
        prev2, prev1 = prev1, cur
    return prev1

print(min_cost_climbing_stairs(cost))`,
    ),
    testCases: [
      sample('3\n10 15 20', '15'),
      sample('6\n1 100 1 1 1 100', '3'),
      hidden('2\n0 0', '0'),
      hidden('2\n5 5', '5'),
      hidden('4\n1 2 3 4', '4'),
    ],
  },

  {
    slug: 'house-robber-ii',
    title: 'House Robber II',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Houses are arranged in a CIRCLE (the first and last houses are adjacent). Given each house\'s money, find the maximum you can rob without robbing two adjacent houses.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated amounts\n\n**Output**\nThe maximum amount.',
    descriptionHi:
      'Houses ek CIRCLE mein arranged hain (pehla aur aakhri house adjacent hain). Har house ka paisa diya hai, maximum paisa dhoondo jo rob kiya ja sakta hai bina do adjacent houses rob kiye.',
    examples: [
      { input: '4\n1 2 3 1', output: '4' },
      { input: '3\n1 2 3', output: '3' },
      { input: '1\n5', output: '5' },
    ],
    constraints: ['1 <= n <= 100', '0 <= amount <= 1000'],
    hints: [
      'The circular constraint means house 0 and house n-1 cannot both be robbed — so split into two cases and take the better one.',
      'Case A: consider only houses 0..n-2 (exclude the last). Case B: consider only houses 1..n-1 (exclude the first). Both are now the standard LINEAR House Robber problem.',
      'Solve each case with the standard linear house-robber DP, and the answer is the max of the two (handling n=1 as a special case).',
    ],
    approach:
      'Reduce the circular problem to two linear ones: rob houses [0, n-2] (never touching the last house) or rob houses [1, n-1] (never touching the first house) — these two ranges together cover every valid non-circular-violating selection. Run the standard linear house-robber DP (dp[i] = max(dp[i-1], dp[i-2] + amount[i])) on each range and take the maximum of the two results.',
    approachHi:
      'Circular problem ko do linear problems mein reduce karo: houses [0, n-2] rob karo (last house ko kabhi mat chhuo) ya houses [1, n-1] rob karo (first house ko kabhi mat chhuo) — ye do ranges milke har valid non-circular-violating selection cover karte hain. Har range par standard linear house-robber DP (dp[i] = max(dp[i-1], dp[i-2] + amount[i])) chalao aur dono results ka maximum lo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with rolling variables',
    solutionExplanation:
      'The only thing the circular arrangement adds over the linear version is one extra forbidden pair: (house 0, house n-1). Any valid selection therefore either excludes house 0 entirely or excludes house n-1 entirely (it can never include both) — which means the true optimum is exactly the better of "best selection ignoring house n-1" and "best selection ignoring house 0", each of which is now a completely ordinary linear house-robber instance with no wraparound to worry about, so the well-known linear DP applies unchanged to each half.',
    solutionExplanationHi:
      'Circular arrangement linear version ke upar sirf ek extra forbidden pair add karta hai: (house 0, house n-1). Isliye koi bhi valid selection ya to house 0 ko poori tarah exclude karta hai ya house n-1 ko poori tarah exclude karta hai (dono kabhi saath include nahi ho sakte) — matlab true optimum exactly "house n-1 ignore karke best selection" aur "house 0 ignore karke best selection" mein se behtar wala hai, jinme se har ek ab ek bilkul ordinary linear house-robber instance hai bina kisi wraparound ki chinta ke, isliye well-known linear DP har half par bina badlaav ke apply hota hai.',
    starter: starter(
      `const n = num(0);
const nums_ = nums(1);

function rob(houses) {
  // return the max amount, handling the circular wraparound
  return 0;
}

console.log(rob(nums_));`,
      `n = num(0)
nums_ = nums(1)

def rob(houses):
    # return the max amount, handling the circular wraparound
    return 0

print(rob(nums_))`,
    ),
    solution: solution(
      `const n = num(0);
const nums_ = nums(1);
function robLinear(houses) {
  let prev2 = 0, prev1 = 0;
  for (const amount of houses) {
    const cur = Math.max(prev1, prev2 + amount);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
function rob(houses) {
  if (houses.length === 1) return houses[0];
  return Math.max(robLinear(houses.slice(0, -1)), robLinear(houses.slice(1)));
}
console.log(rob(nums_));`,
      `n = num(0)
nums_ = nums(1)

def rob_linear(houses):
    prev2, prev1 = 0, 0
    for amount in houses:
        cur = max(prev1, prev2 + amount)
        prev2, prev1 = prev1, cur
    return prev1

def rob(houses):
    if len(houses) == 1:
        return houses[0]
    return max(rob_linear(houses[:-1]), rob_linear(houses[1:]))

print(rob(nums_))`,
    ),
    testCases: [
      sample('4\n1 2 3 1', '4'),
      sample('3\n1 2 3', '3'),
      sample('1\n5', '5'),
      hidden('2\n5 10', '10'),
      hidden('5\n2 3 2 3 2', '6'),
      hidden('6\n5 5 5 5 5 5', '15'),
    ],
  },

  {
    slug: 'decode-ways',
    title: 'Decode Ways',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'A digit string maps to letters via `"1"->A ... "26"->Z`. Given a digit string `s`, count the number of ways it can be decoded (a leading zero in any 1- or 2-digit group makes that group invalid).\n\n**Input**\nLine 1: `s`\n\n**Output**\nThe number of ways to decode `s`.',
    descriptionHi:
      'Ek digit string letters mein map hoti hai `"1"->A ... "26"->Z` ke through. Ek digit string `s` di hai, count karo ki use kitne tareekon se decode kiya ja sakta hai (kisi bhi 1- ya 2-digit group mein leading zero use invalid bana deta hai).\n\n**Input**\nLine 1: `s`\n\n**Output**\n`s` ko decode karne ke tareekon ki sankhya.',
    examples: [
      { input: '12', output: '2' },
      { input: '226', output: '3' },
      { input: '06', output: '0' },
    ],
    constraints: ['1 <= s.length <= 100', 's contains only digits'],
    hints: [
      'dp[i] = number of ways to decode the prefix of length i. A "0" digit can NEVER be decoded alone, only as the second digit of "10" or "20".',
      'From dp[i], you can extend with one more digit (dp[i] contributes to dp[i+1] if s[i] != \'0\'), or with two more digits (dp[i] contributes to dp[i+2] if the 2-digit group s[i..i+1] is between "10" and "26").',
      'dp[0] = 1 (empty prefix, one way: decode nothing) is the base case that makes the recurrence work cleanly.',
    ],
    approach:
      'dp[i] = number of ways to decode the first i characters. dp[0] = 1 (base case). For each i from 1 to n: if s[i-1] != \'0\', add dp[i-1] (treat it as a lone digit); if the two-character group s[i-2..i-1] is between "10" and "26", add dp[i-2] (treat it as a pair). The answer is dp[n].',
    approachHi:
      'dp[i] = pehle i characters decode karne ke tareeke. dp[0] = 1 (base case). i=1 se n tak, har i ke liye: agar s[i-1] != \'0\' hai, dp[i-1] add karo (isse ek akela digit maano); agar two-character group s[i-2..i-1] "10" aur "26" ke beech hai, dp[i-2] add karo (isse ek pair maano). Answer dp[n] hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1) with rolling variables',
    solutionExplanation:
      "Every valid decoding of a prefix is built by extending a valid decoding of a SHORTER prefix with either one more digit or two more digits — there is no third option, since each decoded letter consumes exactly 1 or 2 source digits. That means the total count of ways to decode the first i characters is exactly the sum of the ways to decode the first i-1 (if the single trailing digit is itself valid, i.e. non-zero) and the ways to decode the first i-2 (if the trailing PAIR forms a valid 10-26 code) — a clean additive recurrence, and dp[0]=1 anchors it by representing the one trivial way to decode nothing.",
    solutionExplanationHi:
      "Ek prefix ki har valid decoding ek CHHOTE prefix ki valid decoding ko ek ya do digits se extend karke banti hai — teesra option nahi hai, kyunki har decoded letter exactly 1 ya 2 source digits consume karta hai. Matlab pehle i characters decode karne ke tareekon ka total count exactly pehle i-1 (agar trailing single digit khud valid hai, matlab non-zero) aur pehle i-2 (agar trailing PAIR ek valid 10-26 code banata hai) decode karne ke tareekon ka sum hai — ek clean additive recurrence, aur dp[0]=1 ise anchor karta hai, kuch bhi decode na karne ke ek trivial tareeke ko represent karte hue.",
    starter: starter(
      `const s = line(0);

function numDecodings(s) {
  // return the number of decodings
  return 0;
}

console.log(numDecodings(s));`,
      `s = line(0)

def num_decodings(s):
    # return the number of decodings
    return 0

print(num_decodings(s))`,
    ),
    solution: solution(
      `const s = line(0);
function numDecodings(s) {
  if (s.length === 0 || s[0] === '0') return 0;
  let prev2 = 1, prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== '0') cur += prev1;
    const twoDigit = Number(s.slice(i - 1, i + 1));
    if (twoDigit >= 10 && twoDigit <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}
console.log(numDecodings(s));`,
      `s = line(0)

def num_decodings(s):
    if len(s) == 0 or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != '0':
            cur += prev1
        two_digit = int(s[i - 1:i + 1])
        if 10 <= two_digit <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1

print(num_decodings(s))`,
    ),
    testCases: [
      sample('12', '2'),
      sample('226', '3'),
      sample('06', '0'),
      hidden('1', '1'),
      hidden('10', '1'),
      hidden('100', '0'),
      hidden('27', '1'),
    ],
  },

  {
    slug: 'jump-game',
    title: 'Jump Game',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given an array `nums` where `nums[i]` is the maximum jump length from index `i`, determine whether it is possible to reach the last index starting from index 0.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek array `nums` diya hai jahan `nums[i]` index `i` se maximum jump length hai. Check karo ki index 0 se shuru karke last index tak pahunchna possible hai ya nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '5\n2 3 1 1 4', output: 'true' },
      { input: '5\n3 2 1 0 4', output: 'false' },
    ],
    constraints: ['1 <= n <= 10^4', '0 <= nums[i] <= 10^5'],
    hints: [
      'Track the farthest index reachable so far, scanning left to right — this greedy view is equivalent to (and simpler than) a full DP table of "is index i reachable".',
      'At each index i, if i is beyond the farthest reachable point so far, it is unreachable and neither is anything after it — stop immediately.',
      'Otherwise, update farthest = max(farthest, i + nums[i]) and continue; the answer is whether farthest ever reaches or passes the last index.',
    ],
    approach:
      'Greedy single pass (equivalent to a reachability DP collapsed to its running maximum): track the farthest index reachable so far. At each index i (only if i <= farthest, i.e. i is itself reachable), update farthest = max(farthest, i + nums[i]). If farthest ever reaches n-1, return true. If an index is ever encountered beyond the current farthest, return false immediately — nothing past that point can ever be reached.',
    approachHi:
      'Greedy single pass (ek reachability DP jo apne running maximum mein collapse ho gaya hai): ab tak sabse door reachable index track karo. Har index i par (sirf agar i <= farthest hai, matlab i khud reachable hai), farthest = max(farthest, i + nums[i]) update karo. Agar farthest kabhi n-1 tak pahunch jaaye, true return karo. Agar koi index current farthest se aage mil jaaye, turant false return karo — us point ke aage kuch bhi kabhi reachable nahi ho sakta.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "A full DP would compute, for every index, whether it's reachable from any earlier reachable index with enough jump range — but that reachability set is always a contiguous prefix [0, farthest] that only ever grows as the scan moves right (once index k is reachable, so is every index before it that was already scanned), so instead of storing a boolean per index, tracking just the single running maximum 'farthest' captures the entire DP table's information. The moment the scan pointer itself exceeds farthest, the prefix has stopped growing and can never resume (nothing beyond index i can be scanned to extend it, since i itself is unreachable), which is exactly the early-exit false condition.",
    solutionExplanationHi:
      "Ek full DP har index ke liye compute karta ki wo kisi earlier reachable index se kaafi jump range ke saath reachable hai ya nahi — lekin ye reachability set hamesha ek contiguous prefix [0, farthest] hota hai jo scan right jaane par hi grow hota hai (ek baar index k reachable ho jaaye, to uske pehle scan hua har index bhi reachable hai), isliye per-index boolean store karne ke bajaye, sirf single running maximum 'farthest' track karna poore DP table ki information capture kar leta hai. Jis moment scan pointer khud farthest se aage nikal jaaye, prefix grow hona band ho gaya hai aur kabhi resume nahi hoga (index i ke aage kuch bhi scan karke use extend nahi kiya ja sakta, kyunki i khud unreachable hai), jo exactly early-exit false condition hai.",
    starter: starter(
      `const n = num(0);
const nums_ = nums(1);

function canJump(nums) {
  // return true or false
  return false;
}

console.log(canJump(nums_));`,
      `n = num(0)
nums_ = nums(1)

def can_jump(nums):
    # return True or False
    return False

print("true" if can_jump(nums_) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const nums_ = nums(1);
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}
console.log(canJump(nums_));`,
      `n = num(0)
nums_ = nums(1)

def can_jump(nums):
    farthest = 0
    for i, val in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + val)
    return True

print("true" if can_jump(nums_) else "false")`,
    ),
    testCases: [
      sample('5\n2 3 1 1 4', 'true'),
      sample('5\n3 2 1 0 4', 'false'),
      hidden('1\n0', 'true'),
      hidden('2\n0 1', 'false'),
      hidden('3\n1 1 1', 'true'),
      hidden('4\n2 0 0 0', 'false'),
    ],
  },

  {
    slug: 'jump-game-ii',
    title: 'Jump Game II',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given an array `nums` where `nums[i]` is the maximum jump length from index `i`, and the last index is always reachable, find the MINIMUM number of jumps to reach the last index from index 0.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe minimum number of jumps.',
    descriptionHi:
      'Ek array `nums` diya hai jahan `nums[i]` index `i` se maximum jump length hai, aur last index hamesha reachable hai. Index 0 se last index tak pahunchne ke liye MINIMUM jumps ki sankhya dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nMinimum jumps ki sankhya.',
    examples: [
      { input: '5\n2 3 1 1 4', output: '2' },
      { input: '4\n1 1 1 1', output: '3' },
    ],
    constraints: ['1 <= n <= 10^4', '0 <= nums[i] <= 1000'],
    hints: [
      'This is a BFS-layer idea in disguise: within "one jump" you can reach a whole RANGE of indices, and the question is how many such ranges (layers) it takes to cover index n-1.',
      'Greedily track the current jump\'s reachable boundary (`curEnd`) and the farthest reachable with one more jump (`farthest`) while scanning left to right.',
      'Whenever the scan reaches `curEnd`, a new jump is forced (increment the count) and `curEnd` advances to `farthest`.',
    ],
    approach:
      "Greedy BFS-layer simulation: maintain `curEnd` (the farthest index reachable with the jumps used so far) and `farthest` (the farthest index reachable with one more jump, updated at every index). Scan left to right, updating `farthest = max(farthest, i + nums[i])`; whenever i reaches `curEnd` (the current layer is exhausted) and i is not yet the last index, increment the jump count and set `curEnd = farthest` (committing to the best available next jump).",
    approachHi:
      "Greedy BFS-layer simulation: `curEnd` (ab tak use hue jumps se sabse door reachable index) aur `farthest` (ek aur jump se sabse door reachable index, har index par update hota hai) maintain karo. Left se right scan karo, `farthest = max(farthest, i + nums[i])` update karte hue; jab bhi i `curEnd` tak pahunche (current layer khatam) aur i abhi last index nahi hai, jump count badhao aur `curEnd = farthest` set karo (best available next jump commit karte hue).",
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      "Framing this as BFS makes the greedy correct: think of index 0 as depth 0, every index reachable in exactly one jump as depth 1, and so on — this is precisely a BFS level structure over an implicit graph, and BFS is well-known to find the minimum number of edges (jumps) to any target. Rather than literally running BFS with a queue, the level boundary can be tracked with two integers because each level is always a contiguous range: `curEnd` is the current level's boundary, and `farthest` (continuously updated while still inside the current level) becomes the next level's boundary the instant the scan crosses `curEnd` — so one linear pass simulates the entire layer-by-layer BFS without ever materializing a queue.",
    solutionExplanationHi:
      "Ise BFS ki tarah frame karna greedy ko correct banata hai: index 0 ko depth 0 maano, exactly ek jump mein reachable har index depth 1, aur aage waise hi — ye exactly ek implicit graph ka BFS level structure hai, aur BFS kisi bhi target tak minimum edges (jumps) dhoondhne ke liye well-known hai. Literally queue ke saath BFS chalane ke bajaye, level boundary ko do integers se track kiya ja sakta hai kyunki har level hamesha ek contiguous range hota hai: `curEnd` current level ki boundary hai, aur `farthest` (jab tak current level ke andar hain tab tak continuously update hota hai) us moment agle level ki boundary ban jaata hai jab scan `curEnd` cross karta hai — isliye ek linear pass poore layer-by-layer BFS ko bina kisi queue banaye simulate kar deta hai.",
    starter: starter(
      `const n = num(0);
const nums_ = nums(1);

function jump(nums) {
  // return the minimum number of jumps
  return 0;
}

console.log(jump(nums_));`,
      `n = num(0)
nums_ = nums(1)

def jump(nums):
    # return the minimum number of jumps
    return 0

print(jump(nums_))`,
    ),
    solution: solution(
      `const n = num(0);
const nums_ = nums(1);
function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {
      jumps++;
      curEnd = farthest;
    }
  }
  return jumps;
}
console.log(jump(nums_));`,
      `n = num(0)
nums_ = nums(1)

def jump(nums):
    jumps = 0
    cur_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    return jumps

print(jump(nums_))`,
    ),
    testCases: [
      sample('5\n2 3 1 1 4', '2'),
      sample('4\n1 1 1 1', '3'),
      hidden('1\n0', '0'),
      hidden('2\n1 0', '1'),
      hidden('3\n2 1 1', '1'),
      hidden('6\n1 2 1 1 1 1', '4'),
    ],
  },

  {
    slug: 'word-break',
    title: 'Word Break',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given a string `s` and a dictionary of words, determine whether `s` can be segmented into a space-separated sequence of one or more dictionary words (words may be reused any number of times).\n\n**Input**\n- Line 1: `s`\n- Line 2: `count`\n- Line 3: `count` space-separated dictionary words\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek string `s` aur ek dictionary of words di hai. Check karo ki `s` ko ek ya zyada dictionary words ki space-separated sequence mein segment kiya ja sakta hai ya nahi (words kitni bhi baar reuse ho sakte hain).\n\n**Input**\n- Line 1: `s`\n- Line 2: `count`\n- Line 3: `count` space-separated dictionary words\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'leetcode\n2\nleet code', output: 'true' },
      { input: 'applepenapple\n2\napple pen', output: 'true' },
      { input: 'catsandog\n5\ncats dog sand and cat', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 300', '1 <= dictionary size <= 1000'],
    hints: [
      'dp[i] = whether the prefix s[0..i) can be fully segmented using dictionary words.',
      'dp[0] = true (the empty prefix is trivially segmentable). For each i, dp[i] is true if there is SOME earlier split point j < i where dp[j] is true AND s[j..i) is itself a dictionary word.',
      'Using a Set for the dictionary makes each s[j..i) membership check O(1) (amortized), keeping the whole DP at O(n^2) instead of O(n^2 * dictionary size).',
    ],
    approach:
      'dp[i] = true if s[0..i) can be segmented into dictionary words. dp[0] = true. For each i from 1 to n, check every split point j from 0 to i-1: if dp[j] is true and s.slice(j, i) is in the dictionary set, set dp[i] = true and stop checking further j for this i. The answer is dp[n].',
    approachHi:
      'dp[i] = true agar s[0..i) ko dictionary words mein segment kiya ja sakta hai. dp[0] = true. i=1 se n tak, har i ke liye, har split point j (0 se i-1 tak) check karo: agar dp[j] true hai aur s.slice(j, i) dictionary set mein hai, dp[i] = true set karo aur is i ke liye aage checking rok do. Answer dp[n] hai.',
    timeComplexity: 'O(n^2) with O(1) amortized dictionary lookups via a Set',
    spaceComplexity: 'O(n + dictionary size)',
    solutionExplanation:
      "Trying every possible split recursively without memoization re-solves the same sub-problem \"can s[j..) be segmented\" exponentially many times, since many different earlier split choices lead to the same remaining suffix. Recording dp[i] = \"can the prefix of length i be fully segmented\" collapses all of those redundant recursive calls into a single boolean per prefix length, computed once and reused for every later i that tries j as a split point — turning exponential re-exploration into a clean O(n) prefixes x O(n) split-points-per-prefix grid, with dictionary membership itself made O(1) via a Set instead of scanning the whole word list each time.",
    solutionExplanationHi:
      "Har possible split ko recursively bina memoization ke try karna \"kya s[j..) segment ho sakta hai\" wale sub-problem ko exponentially baar-baar solve karta hai, kyunki bahut saare alag earlier split choices same remaining suffix tak le jaate hain. dp[i] = \"kya length i ka prefix poori tarah segment ho sakta hai\" record karna un saare redundant recursive calls ko ek single boolean per prefix length mein collapse kar deta hai, jo ek baar compute hokar har baad wale i ke liye reuse hota hai jo j ko split point ki tarah try karta hai — exponential re-exploration ko ek clean O(n) prefixes x O(n) split-points-per-prefix grid mein badal deta hai, aur dictionary membership khud Set ke through O(1) ban jaata hai har baar poori word list scan karne ke bajaye.",
    starter: starter(
      `const s = line(0);
const count = num(1);
const dict = words(2);

function wordBreak(s, wordDict) {
  // return true or false
  return false;
}

console.log(wordBreak(s, dict));`,
      `s = line(0)
count = num(1)
dict = words(2)

def word_break(s, word_dict):
    # return True or False
    return False

print("true" if word_break(s, dict) else "false")`,
    ),
    solution: solution(
      `const s = line(0);
const count = num(1);
const dict = words(2);
function wordBreak(s, wordDict) {
  const dictSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dictSet.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}
console.log(wordBreak(s, dict));`,
      `s = line(0)
count = num(1)
dict = words(2)

def word_break(s, word_dict):
    dict_set = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in dict_set:
                dp[i] = True
                break
    return dp[len(s)]

print("true" if word_break(s, dict) else "false")`,
    ),
    testCases: [
      sample('leetcode\n2\nleet code', 'true'),
      sample('applepenapple\n2\napple pen', 'true'),
      sample('catsandog\n5\ncats dog sand and cat', 'false'),
      hidden('a\n1\na', 'true'),
      hidden('a\n1\nb', 'false'),
      hidden('aaaaaaa\n2\naaaa aaa', 'true'),
    ],
  },

  {
    slug: 'combination-sum-iv',
    title: 'Combination Sum IV',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given a set of distinct positive numbers and a target, count the number of ORDERED sequences (order matters — [1,2] and [2,1] count separately) that sum to the target, using any number in the set any number of times.\n\n**Input**\n- Line 1: `n target`\n- Line 2: `n` space-separated distinct positive numbers\n\n**Output**\nThe count.',
    descriptionHi:
      'Distinct positive numbers ka ek set aur ek target diya hai. ORDERED sequences ki sankhya count karo (order matter karta hai — [1,2] aur [2,1] alag count hote hain) jo target tak sum hoti hain, set ke kisi bhi number ko kitni bhi baar use karke.\n\n**Input**\n- Line 1: `n target`\n- Line 2: `n` space-separated distinct positive numbers\n\n**Output**\nCount.',
    examples: [
      { input: '3 4\n1 2 3', output: '7' },
      { input: '1 3\n2', output: '0' },
    ],
    constraints: ['1 <= n <= 200', '1 <= target <= 1000'],
    hints: [
      'Because ORDER matters, this is fundamentally different from a 0/1 or unbounded knapsack COUNT — [1,3] and [3,1] are different sequences, not the same combination.',
      'dp[t] = number of ordered sequences summing to exactly t. dp[0] = 1 (the empty sequence, base case).',
      'For each t from 1 to target, dp[t] = sum of dp[t - num] over every num in the set that is <= t — the LAST number placed can be any of the allowed numbers, and the loop order (target outer, numbers inner) is exactly what makes order matter.',
    ],
    approach:
      'dp[t] = number of ordered sequences of the given numbers that sum to exactly t. dp[0] = 1. For t from 1 to target, dp[t] = sum over every num in the set (with num <= t) of dp[t - num] — the sequence\'s LAST element can be any valid number, and whatever precedes it is counted by dp[t - num]. The answer is dp[target].',
    approachHi:
      'dp[t] = di gayi numbers ki ordered sequences ki sankhya jo exactly t tak sum hoti hain. dp[0] = 1. t=1 se target tak, dp[t] = set ke har num (jahan num <= t) ke liye dp[t - num] ka sum — sequence ka LAST element koi bhi valid number ho sakta hai, aur usse pehle jo bhi hai wo dp[t - num] se count hota hai. Answer dp[target] hai.',
    timeComplexity: 'O(target * n)',
    spaceComplexity: 'O(target)',
    solutionExplanation:
      "Looping with the TARGET as the outer dimension and the candidate numbers as the inner dimension is exactly what distinguishes a permutation count from a combination count in this style of DP: at each target value t, every number is reconsidered as a possible LAST element of the sequence, which means the same multiset of numbers placed in a different order gets counted as a genuinely different sequence (since dp[t] sums over \"which number ends here\", not over \"which numbers are used\") — this is the opposite loop order from the classic unbounded-knapsack combination count, and that loop-order distinction is the entire reason permutations vs. combinations diverge in DP despite looking superficially similar.",
    solutionExplanationHi:
      "TARGET ko outer dimension aur candidate numbers ko inner dimension rakhkar loop karna exactly wahi cheez hai jo is style ke DP mein permutation count ko combination count se alag karti hai: har target value t par, har number ko sequence ke possible LAST element ki tarah dobara consider kiya jaata hai, matlab same numbers ka multiset alag order mein rakha jaaye to genuinely alag sequence count hota hai (kyunki dp[t] \"yahan kaunsa number end hota hai\" par sum karta hai, \"kaunse numbers use hue\" par nahi) — ye classic unbounded-knapsack combination count se opposite loop order hai, aur wahi loop-order distinction permutations aur combinations ko DP mein alag karti hai, superficially similar dikhne ke baavjood.",
    starter: starter(
      `const [n, target] = nums(0);
const arr = nums(1);

function combinationSum4(nums, target) {
  // return the count
  return 0;
}

console.log(combinationSum4(arr, target));`,
      `n, target = nums(0)
arr = nums(1)

def combination_sum4(nums, target):
    # return the count
    return 0

print(combination_sum4(arr, target))`,
    ),
    solution: solution(
      `const [n, target] = nums(0);
const arr = nums(1);
function combinationSum4(nums, target) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let t = 1; t <= target; t++) {
    for (const num of nums) {
      if (num <= t) dp[t] += dp[t - num];
    }
  }
  return dp[target];
}
console.log(combinationSum4(arr, target));`,
      `n, target = nums(0)
arr = nums(1)

def combination_sum4(nums, target):
    dp = [0] * (target + 1)
    dp[0] = 1
    for t in range(1, target + 1):
        for num in nums:
            if num <= t:
                dp[t] += dp[t - num]
    return dp[target]

print(combination_sum4(arr, target))`,
    ),
    testCases: [
      sample('3 4\n1 2 3', '7'),
      sample('1 3\n2', '0'),
      hidden('1 5\n1', '1'),
      hidden('2 0\n1 2', '1'),
      hidden('2 3\n1 2', '3'),
    ],
  },

  {
    slug: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given an array of positive integers, determine whether it can be partitioned into two subsets with EQUAL sum.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated positive integers\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Positive integers ka ek array diya hai. Check karo ki use do subsets mein partition kiya ja sakta hai jinka sum EQUAL ho.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated positive integers\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n1 5 11 5', output: 'true' },
      { input: '4\n1 2 3 5', output: 'false' },
    ],
    constraints: ['1 <= n <= 200', '1 <= nums[i] <= 100'],
    hints: [
      'If the total sum is odd, an equal partition is immediately impossible — no need to search further.',
      'Otherwise, the question reduces to: does SOME subset sum to exactly totalSum / 2? (If one subset hits that target, the rest of the array automatically forms the other half.)',
      'This is the classic 0/1 knapsack "subset sum" DP: dp[s] = whether sum s is achievable using some subset of the numbers seen so far, iterating numbers in the OUTER loop and sums DESCENDING in the inner loop to prevent reusing a number twice.',
    ],
    approach:
      "If the total sum is odd, return false immediately. Otherwise the target is totalSum / 2: run a 0/1 knapsack subset-sum DP, dp[s] = true if some subset achieves sum s, initialized dp[0] = true. For each number, iterate s from target DOWN to that number, setting dp[s] ||= dp[s - number] (descending order ensures each number is used at most once). The answer is dp[target].",
    approachHi:
      "Agar total sum odd hai, turant false return karo. Warna target totalSum / 2 hai: ek 0/1 knapsack subset-sum DP chalao, dp[s] = true agar kisi subset se sum s achieve hota hai, dp[0] = true se initialize karke. Har number ke liye, s ko target se us number tak DESCENDING order mein iterate karo, dp[s] ||= dp[s - number] set karte hue (descending order ensure karta hai ki har number ek baar hi use ho). Answer dp[target] hai.",
    timeComplexity: 'O(n * totalSum)',
    spaceComplexity: 'O(totalSum)',
    solutionExplanation:
      "Partitioning into two EQUAL-sum subsets is exactly equivalent to finding one subset summing to half the total (its complement automatically sums to the other half), reducing a partition question to the classic 0/1 subset-sum decision problem. The DESCENDING inner loop over sums is what enforces the '0/1' (use-at-most-once) constraint: updating dp[s] using dp[s - number] only works correctly for 'this number hasn't been counted into s yet' when s - number hasn't itself already been updated in this same pass, which descending order guarantees (ascending order would let a number's own contribution feed back into a larger sum within the same iteration, silently allowing unlimited reuse — this is the same recurring reuse-vs-no-reuse loop-direction distinction seen in every unbounded-vs-0/1 knapsack DP).",
    solutionExplanationHi:
      "Do EQUAL-sum subsets mein partition karna exactly ek subset dhoondhne ke barabar hai jo total ke aadhe tak sum ho (uska complement automatically doosre aadhe tak sum hota hai), ek partition sawaal ko classic 0/1 subset-sum decision problem mein reduce karte hue. Sums par DESCENDING inner loop hi '0/1' (at-most-once use) constraint enforce karta hai: dp[s] ko dp[s - number] se update karna sirf tabhi sahi kaam karta hai 'ye number abhi tak s mein count nahi hua' jab s - number khud abhi is hi pass mein update nahi hua ho, jo descending order guarantee karta hai (ascending order mein ek number ka apna contribution same iteration ke andar ek badi sum mein wapas feed ho jaata, chupke se unlimited reuse allow karte hue — ye wahi reuse-vs-no-reuse loop-direction distinction hai jo har unbounded-vs-0/1 knapsack DP mein dikhta hai).",
    starter: starter(
      `const n = num(0);
const arr = nums(1);

function canPartition(nums) {
  // return true or false
  return false;
}

console.log(canPartition(arr));`,
      `n = num(0)
arr = nums(1)

def can_partition(nums):
    # return True or False
    return False

print("true" if can_partition(arr) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const arr = nums(1);
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      dp[s] = dp[s] || dp[s - num];
    }
  }
  return dp[target];
}
console.log(canPartition(arr));`,
      `n = num(0)
arr = nums(1)

def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    return dp[target]

print("true" if can_partition(arr) else "false")`,
    ),
    testCases: [
      sample('4\n1 5 11 5', 'true'),
      sample('4\n1 2 3 5', 'false'),
      hidden('1\n1', 'false'),
      hidden('2\n1 1', 'true'),
      hidden('3\n1 2 5', 'false'),
      hidden('6\n2 2 2 2 2 2', 'true'),
    ],
  },

  {
    slug: 'target-sum',
    title: 'Target Sum',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given an array of non-negative integers and a target, count the number of ways to assign a `+` or `-` sign to each number so the resulting expression evaluates to the target.\n\n**Input**\n- Line 1: `n target`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nThe count.',
    descriptionHi:
      'Non-negative integers ka ek array aur ek target diya hai. Count karo ki har number ko `+` ya `-` sign assign karne ke kitne tareeke hain taaki resulting expression target tak evaluate ho.\n\n**Input**\n- Line 1: `n target`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nCount.',
    examples: [
      { input: '5 3\n1 1 1 1 1', output: '5' },
      { input: '1 1\n1', output: '1' },
    ],
    constraints: ['1 <= n <= 20', '0 <= nums[i] <= 1000'],
    hints: [
      'Split the numbers into a POSITIVE subset P and a NEGATIVE subset N. Then sum(P) - sum(N) = target, and sum(P) + sum(N) = totalSum — solving these two equations gives sum(P) = (totalSum + target) / 2.',
      'If (totalSum + target) is odd or negative, there is no valid split — answer 0.',
      'Otherwise the question becomes "how many subsets sum to exactly (totalSum + target) / 2" — the exact same 0/1 knapsack subset-sum COUNTING DP as Partition Equal Subset Sum, just counting ways instead of a yes/no.',
    ],
    approach:
      "Algebraically reduce sign-assignment to subset selection: if P is the set of numbers assigned '+' and N is assigned '-', then sum(P) - sum(N) = target and sum(P) + sum(N) = totalSum, so sum(P) = (totalSum + target) / 2. If that value isn't a non-negative integer, return 0. Otherwise run a 0/1 knapsack COUNTING DP: dp[s] = number of subsets summing to s, dp[0] = 1, and for each number iterate s from that target down to the number, dp[s] += dp[s - number]. The answer is dp[computed target].",
    approachHi:
      "Sign-assignment ko algebraically subset selection mein reduce karo: agar P wo numbers hain jinhe '+' mila aur N wo jinhe '-', to sum(P) - sum(N) = target aur sum(P) + sum(N) = totalSum, isliye sum(P) = (totalSum + target) / 2. Agar ye value non-negative integer nahi hai, 0 return karo. Warna ek 0/1 knapsack COUNTING DP chalao: dp[s] = sum s tak wale subsets ki sankhya, dp[0] = 1, aur har number ke liye s ko us target se number tak descending order mein iterate karo, dp[s] += dp[s - number]. Answer dp[computed target] hai.",
    timeComplexity: 'O(n * totalSum)',
    spaceComplexity: 'O(totalSum)',
    solutionExplanation:
      "The sign-assignment framing looks combinatorial and unrelated to subset sums, but the algebra (P - N = target, P + N = totalSum) reveals it is EXACTLY subset-sum counting in disguise: choosing which numbers get '+' is choosing a subset P, and that subset is forced to sum to a specific derived target, (totalSum + target)/2. Once that reduction is made, the counting recurrence is identical in structure to Partition Equal Subset Sum's decision recurrence, just accumulating a count (dp[s] += dp[s-num]) instead of an OR of booleans — the same descending-iteration 0/1 discipline applies for the same reason (each number contributes to at most one subset membership).",
    solutionExplanationHi:
      "Sign-assignment framing combinatorial aur subset sums se unrelated lagti hai, lekin algebra (P - N = target, P + N = totalSum) reveal karta hai ki ye EXACTLY subset-sum counting hai, bas disguise mein: kaunse numbers ko '+' milega ye choose karna ek subset P choose karna hai, aur wo subset ek specific derived target, (totalSum + target)/2, tak sum karne ke liye forced hai. Ye reduction hone ke baad, counting recurrence structure mein Partition Equal Subset Sum ke decision recurrence jaisa hi hai, bas ek count accumulate karta hai (dp[s] += dp[s-num]) booleans ke OR ke bajaye — wahi descending-iteration 0/1 discipline usi reason se apply hoti hai (har number at most ek subset membership mein contribute karta hai).",
    starter: starter(
      `const [n, target] = nums(0);
const arr = nums(1);

function findTargetSumWays(nums, target) {
  // return the count
  return 0;
}

console.log(findTargetSumWays(arr, target));`,
      `n, target = nums(0)
arr = nums(1)

def find_target_sum_ways(nums, target):
    # return the count
    return 0

print(find_target_sum_ways(arr, target))`,
    ),
    solution: solution(
      `const [n, target] = nums(0);
const arr = nums(1);
function findTargetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  const sumP2 = total + target;
  if (sumP2 < 0 || sumP2 % 2 !== 0) return 0;
  const goal = sumP2 / 2;
  const dp = new Array(goal + 1).fill(0);
  dp[0] = 1;
  for (const num of nums) {
    for (let s = goal; s >= num; s--) {
      dp[s] += dp[s - num];
    }
  }
  return dp[goal];
}
console.log(findTargetSumWays(arr, target));`,
      `n, target = nums(0)
arr = nums(1)

def find_target_sum_ways(nums, target):
    total = sum(nums)
    sum_p2 = total + target
    if sum_p2 < 0 or sum_p2 % 2 != 0:
        return 0
    goal = sum_p2 // 2
    dp = [0] * (goal + 1)
    dp[0] = 1
    for num in nums:
        for s in range(goal, num - 1, -1):
            dp[s] += dp[s - num]
    return dp[goal]

print(find_target_sum_ways(arr, target))`,
    ),
    testCases: [
      sample('5 3\n1 1 1 1 1', '5'),
      sample('1 1\n1', '1'),
      hidden('1 0\n0', '2'),
      hidden('2 4\n1 2', '0'),
      hidden('3 1\n1 1 1', '3'),
    ],
  },

  {
    slug: 'unique-paths',
    title: 'Unique Paths',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'A robot starts at the top-left of an `m x n` grid and can only move down or right. Count the number of distinct paths to the bottom-right corner.\n\n**Input**\nLine 1: `m n`\n\n**Output**\nThe number of distinct paths.',
    descriptionHi:
      'Ek robot `m x n` grid ke top-left se shuru hota hai aur sirf down ya right move kar sakta hai. Bottom-right corner tak distinct paths ki sankhya count karo.\n\n**Input**\nLine 1: `m n`\n\n**Output**\nDistinct paths ki sankhya.',
    examples: [
      { input: '3 7', output: '28' },
      { input: '3 2', output: '3' },
    ],
    constraints: ['1 <= m, n <= 100'],
    hints: [
      'The number of ways to reach any cell is the sum of the ways to reach the cell directly above it and the cell directly to its left (since those are the only two cells a move could have come from).',
      'The entire first row and entire first column have exactly 1 way to reach (only one direction of movement is possible along an edge).',
      'This grid DP can be computed with just a single rolling 1D row array instead of a full 2D table.',
    ],
    approach:
      'Grid DP: dp[r][c] = number of paths to cell (r, c) = dp[r-1][c] + dp[r][c-1] (paths from above plus paths from the left), with the entire first row and first column initialized to 1 (only one way to reach any edge cell — straight along the edge). The answer is dp[m-1][n-1].',
    approachHi:
      'Grid DP: dp[r][c] = cell (r, c) tak paths ki sankhya = dp[r-1][c] + dp[r][c-1] (upar se paths plus left se paths), poori first row aur poore first column ko 1 se initialize karke (kisi bhi edge cell tak pahunchne ka sirf ek tareeka hai — edge ke saath seedha). Answer dp[m-1][n-1] hai.',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(n) with a rolling 1D row',
    solutionExplanation:
      "Because the robot can only move down or right, any path arriving at cell (r,c) must have taken its very last step from either directly above or directly to the left — there is no third possibility — so the count of paths to (r,c) is exactly the sum of paths to those two predecessor cells, a direct combinatorial recurrence (this also matches the closed-form C(m+n-2, m-1), but the DP needs no combinatorics reasoning to derive). Because row r only ever depends on row r-1, the 2D table collapses to a single rolling row updated in place left to right, since dp[c] (before overwrite) still holds 'from above' while dp[c-1] (already overwritten this row) holds 'from the left'.",
    solutionExplanationHi:
      "Kyunki robot sirf down ya right move kar sakta hai, cell (r,c) tak pahunchne wale kisi bhi path ka aakhri step ya to seedha upar se ya seedha left se hona chahiye — teesra koi option nahi — isliye (r,c) tak paths ka count exactly un do predecessor cells tak paths ka sum hai, ek direct combinatorial recurrence (ye closed-form C(m+n-2, m-1) se bhi match karta hai, lekin DP ko koi combinatorics reasoning derive karne ki zaroorat nahi). Kyunki row r sirf row r-1 par depend karta hai, 2D table ek single rolling row mein collapse ho jaata hai jo left se right in-place update hoti hai, kyunki dp[c] (overwrite hone se pehle) 'upar se' hold karta hai jabki dp[c-1] (is row mein already overwritten) 'left se' hold karta hai.",
    starter: starter(
      `const [m, n] = nums(0);

function uniquePaths(m, n) {
  // return the number of distinct paths
  return 0;
}

console.log(uniquePaths(m, n));`,
      `m, n = nums(0)

def unique_paths(m, n):
    # return the number of distinct paths
    return 0

print(unique_paths(m, n))`,
    ),
    solution: solution(
      `const [m, n] = nums(0);
function uniquePaths(m, n) {
  const dp = new Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[c] += dp[c - 1];
    }
  }
  return dp[n - 1];
}
console.log(uniquePaths(m, n));`,
      `m, n = nums(0)

def unique_paths(m, n):
    dp = [1] * n
    for r in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]
    return dp[n - 1]

print(unique_paths(m, n))`,
    ),
    testCases: [
      sample('3 7', '28'),
      sample('3 2', '3'),
      hidden('1 1', '1'),
      hidden('1 5', '1'),
      hidden('5 1', '1'),
      hidden('3 3', '6'),
    ],
  },

  {
    slug: 'unique-paths-ii',
    title: 'Unique Paths II',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Same as Unique Paths, but the grid may contain obstacles (`1` = obstacle, `0` = free). A path can never pass through an obstacle cell. Count the distinct paths from top-left to bottom-right.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nThe number of distinct paths.',
    descriptionHi:
      'Unique Paths jaisa hi hai, lekin grid mein obstacles ho sakte hain (`1` = obstacle, `0` = free). Koi path kabhi obstacle cell se hokar nahi guzar sakta. Top-left se bottom-right tak distinct paths count karo.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nDistinct paths ki sankhya.',
    examples: [
      { input: '3 3\n0 0 0\n0 1 0\n0 0 0', output: '2' },
      { input: '2 2\n0 1\n0 0', output: '1' },
      { input: '1 1\n1', output: '0' },
    ],
    constraints: ['1 <= rows, cols <= 100'],
    hints: [
      'The recurrence is the same as plain Unique Paths, with one extra rule: an obstacle cell has exactly 0 ways to reach it, regardless of what is above or to its left.',
      "If the starting cell itself is an obstacle, the answer is immediately 0 — no path can even begin.",
      'Careful with the first row/column base cases: unlike plain Unique Paths, they are no longer automatically all 1s — an obstacle anywhere in the first row/column blocks every cell after it in that row/column too.',
    ],
    approach:
      'Grid DP identical to Unique Paths, except: if grid[r][c] is an obstacle, dp[r][c] = 0 unconditionally (overriding the normal sum). Otherwise dp[r][c] = dp[r-1][c] + dp[r][c-1] (treating out-of-bounds predecessors as 0). The starting cell dp[0][0] = 1 unless it is itself an obstacle, in which case it is 0 and stays 0 throughout.',
    approachHi:
      'Unique Paths jaisa hi grid DP, bas: agar grid[r][c] obstacle hai, dp[r][c] = 0 unconditionally (normal sum ko override karte hue). Warna dp[r][c] = dp[r-1][c] + dp[r][c-1] (out-of-bounds predecessors ko 0 maante hue). Starting cell dp[0][0] = 1 hai jab tak wo khud obstacle na ho, us case mein wo 0 hai aur pure DP mein 0 hi rehta hai.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(cols) with a rolling 1D row',
    solutionExplanation:
      "An obstacle doesn't change the SHAPE of the recurrence, it just forces one specific override: since no valid path can ever occupy an obstacle cell, the number of paths reaching it is trivially and unconditionally 0, regardless of how reachable its neighbors are — this single override, applied uniformly across every cell (including the first row/column, which in the obstacle-free version got a hardcoded 1), automatically produces the correct 'blocked' propagation: once an obstacle appears in the first row, every cell after it in that row inherits 0 from the sum, without needing a special case for edges versus interior cells.",
    solutionExplanationHi:
      "Ek obstacle recurrence ki SHAPE nahi badalta, wo bas ek specific override force karta hai: kyunki koi valid path kabhi obstacle cell occupy nahi kar sakta, wahan tak paths ki sankhya trivially aur unconditionally 0 hai, uske neighbors kitne bhi reachable ho — ye single override, har cell par uniformly apply hoke (first row/column bhi shaamil, jinhe obstacle-free version mein hardcoded 1 milta tha), automatically sahi 'blocked' propagation produce karta hai: ek baar first row mein obstacle aa jaaye, us row mein uske baad har cell sum se 0 inherit karta hai, edges versus interior cells ke liye koi special case ki zaroorat nahi.",
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function uniquePathsWithObstacles(grid) {
  // return the number of distinct paths
  return 0;
}

console.log(uniquePathsWithObstacles(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def unique_paths_with_obstacles(grid):
    # return the number of distinct paths
    return 0

print(unique_paths_with_obstacles(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
function uniquePathsWithObstacles(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = new Array(cols).fill(0);
  dp[0] = grid[0][0] === 1 ? 0 : 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) { dp[c] = 0; continue; }
      if (c > 0) dp[c] += dp[c - 1];
    }
  }
  return dp[cols - 1];
}
console.log(uniquePathsWithObstacles(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def unique_paths_with_obstacles(grid):
    rows, cols = len(grid), len(grid[0])
    dp = [0] * cols
    dp[0] = 0 if grid[0][0] == 1 else 1
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                dp[c] = 0
                continue
            if c > 0:
                dp[c] += dp[c - 1]
    return dp[cols - 1]

print(unique_paths_with_obstacles(grid))`,
    ),
    testCases: [
      sample('3 3\n0 0 0\n0 1 0\n0 0 0', '2'),
      sample('2 2\n0 1\n0 0', '1'),
      sample('1 1\n1', '0'),
      hidden('1 1\n0', '1'),
      hidden('1 3\n0 1 0', '0'),
      hidden('3 1\n0\n0\n0', '1'),
    ],
  },

  {
    slug: 'minimum-path-sum',
    title: 'Minimum Path Sum',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given an `rows x cols` grid of non-negative numbers, find a path from top-left to bottom-right (moving only down or right) that minimizes the sum of numbers along it.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated non-negative numbers\n\n**Output**\nThe minimum path sum.',
    descriptionHi:
      'Non-negative numbers ka ek `rows x cols` grid diya hai. Top-left se bottom-right tak ek path dhoondo (sirf down ya right move karte hue) jo raaste ke numbers ka sum minimize kare.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated non-negative numbers\n\n**Output**\nMinimum path sum.',
    examples: [
      { input: '3 3\n1 3 1\n1 5 1\n4 2 1', output: '7' },
      { input: '1 3\n1 2 3', output: '6' },
    ],
    constraints: ['1 <= rows, cols <= 200'],
    hints: [
      'The cheapest way to reach a cell is its own value plus whichever of the two possible predecessor cells (above, or to the left) was itself cheaper to reach.',
      'The first row and first column each have only one possible path in (straight along the edge), so their DP values are simply a running prefix sum.',
      'This is structurally identical to Unique Paths, but with min(+) replacing sum(+) — count of ways becomes cost of the cheapest way.',
    ],
    approach:
      'Grid DP: dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]), taking only the valid (in-bounds) option at edges. The first row and first column are running prefix sums of grid values (only one direction of entry is possible there). The answer is dp[rows-1][cols-1].',
    approachHi:
      'Grid DP: dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]), edges par sirf valid (in-bounds) option lete hue. First row aur first column grid values ka running prefix sum hote hain (wahan entry ka sirf ek direction possible hai). Answer dp[rows-1][cols-1] hai.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(cols) with a rolling 1D row',
    solutionExplanation:
      "This shares the exact same predecessor structure as Unique Paths (only from-above or from-left is possible at any interior cell), but the aggregation operator changes from sum (count every way) to min (keep only the cheapest way) — because minimizing a path's total cost only ever needs to know the single cheapest way to reach each predecessor, not all of them, throwing away every other path to that predecessor loses no information relevant to the final answer, which is exactly what justifies collapsing an exponential number of paths into one DP value per cell.",
    solutionExplanationHi:
      "Ye Unique Paths jaisi hi predecessor structure share karta hai (kisi bhi interior cell par sirf upar se ya left se aana possible hai), lekin aggregation operator sum (har way count karo) se min (sirf sabse sasta way rakho) mein badal jaata hai — kyunki ek path ka total cost minimize karne ke liye sirf har predecessor tak pahunchne ka single sabse sasta way jaanna zaroori hai, sab nahi, us predecessor tak har doosra path discard karne se final answer ke liye koi relevant information nahi khoti, jo exactly justify karta hai exponential number of paths ko ek DP value per cell mein collapse karna.",
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function minPathSum(grid) {
  // return the minimum path sum
  return 0;
}

console.log(minPathSum(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def min_path_sum(grid):
    # return the minimum path sum
    return 0

print(min_path_sum(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
function minPathSum(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = new Array(cols).fill(Infinity);
  dp[0] = 0;
  for (let r = 0; r < rows; r++) {
    const next = new Array(cols).fill(Infinity);
    for (let c = 0; c < cols; c++) {
      const fromLeft = c > 0 ? next[c - 1] : Infinity;
      const fromAbove = dp[c];
      next[c] = grid[r][c] + Math.min(fromLeft, fromAbove);
    }
    for (let c = 0; c < cols; c++) dp[c] = next[c];
  }
  return dp[cols - 1];
}
console.log(minPathSum(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def min_path_sum(grid):
    rows, cols = len(grid), len(grid[0])
    dp = [float('inf')] * cols
    dp[0] = 0
    for r in range(rows):
        nxt = [float('inf')] * cols
        for c in range(cols):
            from_left = nxt[c - 1] if c > 0 else float('inf')
            from_above = dp[c]
            nxt[c] = grid[r][c] + min(from_left, from_above)
        dp = nxt
    return dp[cols - 1]

print(min_path_sum(grid))`,
    ),
    testCases: [
      sample('3 3\n1 3 1\n1 5 1\n4 2 1', '7'),
      sample('1 3\n1 2 3', '6'),
      hidden('1 1\n5', '5'),
      hidden('2 2\n1 2\n1 1', '3'),
      hidden('3 1\n1\n1\n1', '3'),
    ],
  },

  {
    slug: 'triangle-minimum-path-sum',
    title: 'Triangle Minimum Path Sum',
    category: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    description:
      'Given a triangle array (row i has i+1 elements), find the minimum path sum from the top to the bottom, where each step moves to an adjacent number on the row below (index i or i+1).\n\n**Input**\n- Line 1: `rows`\n- Next `rows` lines: row `i` has `i+1` space-separated numbers\n\n**Output**\nThe minimum path sum.',
    descriptionHi:
      'Ek triangle array diya hai (row i mein i+1 elements hain), top se bottom tak minimum path sum dhoondo, jahan har step neeche wali row mein ek adjacent number (index i ya i+1) par move karta hai.\n\n**Input**\n- Line 1: `rows`\n- Agli `rows` lines: row `i` mein `i+1` space-separated numbers\n\n**Output**\nMinimum path sum.',
    examples: [
      { input: '4\n2\n3 4\n6 5 7\n4 1 8 3', output: '11' },
      { input: '1\n-10', output: '-10' },
    ],
    constraints: ['1 <= rows <= 200'],
    hints: [
      'Work from the BOTTOM row upward — at the bottom row, the minimum path sum ending there is trivially the value itself.',
      'For a cell at (row, i), the minimum path sum from there to the bottom is its own value plus the minimum of the two cells reachable from it in the row below: (row+1, i) and (row+1, i+1).',
      'After processing upward through every row, the answer ends up as the single value at the top (row 0).',
    ],
    approach:
      'Bottom-up DP, starting from a copy of the last row. For each row from the second-to-last up to the first, update dp[i] = triangle[row][i] + min(dp[i], dp[i+1]) (dp[i] currently holds the best sum from (row+1, i), dp[i+1] the best from (row+1, i+1), which are exactly the two reachable cells below). After processing row 0, dp[0] holds the answer.',
    approachHi:
      'Bottom-up DP, last row ki ek copy se shuru karke. Second-to-last se pehli row tak, har row ke liye dp[i] = triangle[row][i] + min(dp[i], dp[i+1]) update karo (dp[i] abhi (row+1, i) se best sum hold karta hai, dp[i+1] (row+1, i+1) se best, jo exactly niche wale do reachable cells hain). Row 0 process hone ke baad, dp[0] mein answer hota hai.',
    timeComplexity: 'O(rows^2)',
    spaceComplexity: 'O(rows) with a rolling 1D array',
    solutionExplanation:
      "Working top-down would require, at each cell, knowing the minimum sum to reach it FROM the top, which is fine on its own but leaves the final answer scattered across the whole bottom row needing one more min-reduction pass. Working bottom-up instead directly computes, at each cell, the minimum sum FROM that cell TO the bottom — so every cell's DP value is immediately final and self-contained, and by the time the sweep reaches row 0 there is only a single cell left, which already holds the complete answer with no extra reduction step needed; this bottom-up direction is simply more convenient here, not fundamentally different in complexity from the top-down formulation.",
    solutionExplanationHi:
      "Top-down kaam karne ke liye har cell par ye jaanna zaroori hota ki top se wahan tak pahunchne ka minimum sum kya hai, jo apne aap mein theek hai lekin final answer poori bottom row mein bikhra reh jaata hai jise ek aur min-reduction pass chahiye. Bottom-up kaam karna iske bajaye directly har cell par ye compute karta hai ki us cell se bottom tak ka minimum sum kya hai — isliye har cell ki DP value turant final aur self-contained hoti hai, aur jab sweep row 0 tak pahunchta hai to sirf ek hi cell bacha hota hai, jismein complete answer already hota hai bina kisi extra reduction step ke; ye bottom-up direction bas yahan zyada convenient hai, complexity mein top-down formulation se fundamentally alag nahi hai.",
    starter: starter(
      `const rows = num(0);
const triangle = [];
for (let i = 0; i < rows; i++) triangle.push(nums(1 + i));

function minimumTotal(triangle) {
  // return the minimum path sum
  return 0;
}

console.log(minimumTotal(triangle));`,
      `rows = num(0)
triangle = [nums(1 + i) for i in range(rows)]

def minimum_total(triangle):
    # return the minimum path sum
    return 0

print(minimum_total(triangle))`,
    ),
    solution: solution(
      `const rows = num(0);
const triangle = [];
for (let i = 0; i < rows; i++) triangle.push(nums(1 + i));
function minimumTotal(triangle) {
  let dp = triangle[triangle.length - 1].slice();
  for (let row = triangle.length - 2; row >= 0; row--) {
    const next = new Array(row + 1);
    for (let i = 0; i <= row; i++) {
      next[i] = triangle[row][i] + Math.min(dp[i], dp[i + 1]);
    }
    dp = next;
  }
  return dp[0];
}
console.log(minimumTotal(triangle));`,
      `rows = num(0)
triangle = [nums(1 + i) for i in range(rows)]

def minimum_total(triangle):
    dp = triangle[-1][:]
    for row in range(len(triangle) - 2, -1, -1):
        nxt = [0] * (row + 1)
        for i in range(row + 1):
            nxt[i] = triangle[row][i] + min(dp[i], dp[i + 1])
        dp = nxt
    return dp[0]

print(minimum_total(triangle))`,
    ),
    testCases: [
      sample('4\n2\n3 4\n6 5 7\n4 1 8 3', '11'),
      sample('1\n-10', '-10'),
      hidden('2\n1\n2 3', '3'),
      hidden('3\n1\n1 1\n1 1 1', '3'),
      hidden('2\n-1\n-2 -3', '-4'),
    ],
  },
];
