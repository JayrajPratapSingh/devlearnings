import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Binary Search — expansion batch. Rounds out the category beyond the
 * original two (Binary Search, Search in Rotated Sorted Array) with the
 * "binary search on the answer" family (Koko, ship capacity, bouquets,
 * split array), 2D-matrix search, and the classic hard median problem.
 */
export const dsaExtraBinarySearch: SeedProblem[] = [
  {
    slug: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Each row of the matrix is sorted ascending, and the first value of each row is greater than the last value of the previous row (so the whole matrix reads as one sorted sequence, row by row). Determine whether `target` exists.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated integers each\n- Last line: `target`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Matrix ki har row ascending sorted hai, aur har row ki pehli value pichli row ki aakhri value se badi hai (isliye poora matrix ek sorted sequence ki tarah row-by-row padha ja sakta hai). Check karo ki `target` exist karta hai ya nahi.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: har ek mein `cols` space-separated integers\n- Aakhri line: `target`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', output: 'true' },
      { input: '3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13', output: 'false' },
    ],
    constraints: ['1 <= rows, cols <= 100', 'Rows are sorted, and rows are ordered relative to each other'],
    hints: [
      'Because the matrix reads as one continuous sorted sequence, a single flat index maps cleanly to a (row, col) pair.',
      'Treat the matrix as a virtual 1D array of length rows*cols and binary search it directly.',
      'A flat index `i` corresponds to row `i / cols` and column `i % cols`.',
    ],
    approach:
      'Binary search over a virtual flat index range `[0, rows*cols - 1]`. For a candidate flat index `mid`, read the actual value at `matrix[mid / cols][mid % cols]` and compare against `target`, narrowing the range exactly like a 1D binary search.',
    approachHi:
      'Virtual flat index range `[0, rows*cols - 1]` par binary search karo. Candidate flat index `mid` ke liye, asli value `matrix[mid / cols][mid % cols]` par padho aur `target` se compare karo, range ko exactly 1D binary search jaisa narrow karte hue.',
    timeComplexity: 'O(log(rows*cols))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The row-relative-ordering guarantee is precisely what collapses the 2D structure into a 1D one: reading the matrix row by row produces a single globally sorted sequence, so a flat-index binary search over that virtual sequence — translating each candidate index back into (row, col) only when actually reading a value — behaves identically to searching a plain sorted array.',
    solutionExplanationHi:
      'Row-relative-ordering ki guarantee hi 2D structure ko 1D mein samet deti hai: matrix ko row-by-row padhna ek single globally sorted sequence banata hai, isliye us virtual sequence par flat-index binary search — har candidate index ko sirf value padhte waqt (row, col) mein translate karte hue — bilkul ek plain sorted array search karne jaisa behave karta hai.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const target = num(1 + rows);

function searchMatrix(grid, target) {
  // your code here
}

console.log(searchMatrix(grid, target));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
target = num(1 + rows)

def search_matrix(grid, target):
    # your code here
    pass

print("true" if search_matrix(grid, target) else "false")`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const target = num(1 + rows);
let lo = 0, hi = rows * cols - 1, found = false;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  const val = grid[Math.floor(mid / cols)][mid % cols];
  if (val === target) { found = true; break; }
  if (val < target) lo = mid + 1; else hi = mid - 1;
}
console.log(found);`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
target = num(1 + rows)
lo, hi, found = 0, rows * cols - 1, False
while lo <= hi:
    mid = (lo + hi) // 2
    val = grid[mid // cols][mid % cols]
    if val == target:
        found = True
        break
    if val < target:
        lo = mid + 1
    else:
        hi = mid - 1
print("true" if found else "false")`,
    ),
    testCases: [
      sample('3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3', 'true'),
      sample('3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13', 'false'),
      hidden('1 1\n5\n5', 'true'),
      hidden('1 1\n5\n6', 'false'),
      hidden('2 2\n1 3\n5 7\n7', 'true'),
      hidden('1 4\n1 2 3 4\n1', 'true'),
    ],
  },

  {
    slug: 'search-a-2d-matrix-ii',
    title: 'Search a 2D Matrix II',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Each row is sorted ascending left to right, and each column is sorted ascending top to bottom (but rows are NOT necessarily ordered relative to each other). Determine whether `target` exists.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated integers each\n- Last line: `target`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Har row left-to-right ascending sorted hai, aur har column top-to-bottom ascending sorted hai (par rows ek doosre ke relative mein sorted nahi hain). Check karo ki `target` exist karta hai ya nahi.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: har ek mein `cols` space-separated integers\n- Aakhri line: `target`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30\n5', output: 'true' },
      { input: '5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30\n20', output: 'false' },
    ],
    constraints: ['1 <= rows, cols <= 300'],
    hints: [
      'A flat-index binary search does not work here, because rows are not globally ordered relative to each other.',
      'Start from a corner where one direction increases and the other decreases — the top-right corner is a natural choice.',
      'From the top-right: if the current value is too big, move left (decreasing); if too small, move down (increasing). Either move eliminates exactly one row or one column.',
    ],
    approach:
      'Start at the top-right corner. If the current value equals `target`, done. If it is greater than `target`, move one column left (everything below in that column is even bigger, so the whole column can be discarded). If it is less than `target`, move one row down (everything to the left in that row is even smaller, so the whole row can be discarded). Stop when the position goes out of bounds.',
    approachHi:
      'Top-right corner se shuru karo. Agar current value `target` ke barabar hai, done. Agar wo `target` se bada hai, ek column left move karo (us column mein neeche sab kuch aur bhi bada hai, isliye poora column discard ho sakta hai). Agar chhota hai, ek row neeche move karo (us row mein left sab kuch aur bhi chhota hai, isliye poori row discard ho sakti hai). Position bounds se bahar jaate hi ruk jao.',
    timeComplexity: 'O(rows + cols)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The top-right corner is special because it is the unique starting point where one neighbor direction (left) strictly decreases and the other (down) strictly increases — every other corner has two directions that agree, giving no way to discard anything on a mismatch. This "staircase" property means every comparison eliminates exactly one full row or column, so at most `rows + cols` steps are ever needed, even though it is not a classic halving binary search.',
    solutionExplanationHi:
      'Top-right corner special isliye hai kyunki ye ek unique starting point hai jahan ek neighbor direction (left) strictly ghatta hai aur doosra (down) strictly badhta hai — har doosre corner mein dono directions agree karte hain, jisse mismatch par kuch bhi discard karne ka tareeka nahi milta. Ye "staircase" property matlab har comparison exactly ek poori row ya column eliminate karta hai, isliye zyada se zyada `rows + cols` steps chahiye hote hain, chahe ye classic halving binary search na ho.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const target = num(1 + rows);

function searchMatrix(grid, target) {
  // your code here
}

console.log(searchMatrix(grid, target));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
target = num(1 + rows)

def search_matrix(grid, target):
    # your code here
    pass

print("true" if search_matrix(grid, target) else "false")`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const target = num(1 + rows);
let r = 0, c = cols - 1, found = false;
while (r < rows && c >= 0) {
  const val = grid[r][c];
  if (val === target) { found = true; break; }
  if (val > target) c--; else r++;
}
console.log(found);`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
target = num(1 + rows)
r, c, found = 0, cols - 1, False
while r < rows and c >= 0:
    val = grid[r][c]
    if val == target:
        found = True
        break
    if val > target:
        c -= 1
    else:
        r += 1
print("true" if found else "false")`,
    ),
    testCases: [
      sample('5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30\n5', 'true'),
      sample('5 5\n1 4 7 11 15\n2 5 8 12 19\n3 6 9 16 22\n10 13 14 17 24\n18 21 23 26 30\n20', 'false'),
      hidden('1 1\n5\n5', 'true'),
      hidden('1 1\n5\n6', 'false'),
      hidden('2 2\n1 4\n2 5\n4', 'true'),
      hidden('3 3\n1 2 3\n4 5 6\n7 8 9\n10', 'false'),
    ],
  },

  {
    slug: 'find-peak-element',
    title: 'Find Peak Element',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'A peak is an element strictly greater than both of its neighbors (treating out-of-bounds as `-infinity`). Find the index of any one peak in O(log n).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (adjacent values are never equal)\n\n**Output**\nThe index of a peak element.',
    descriptionHi:
      'Ek peak wo element hai jo apne dono neighbors se strictly bada ho (out-of-bounds ko `-infinity` maano). Kisi bhi ek peak ka index O(log n) mein dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (adjacent values kabhi barabar nahi hote)\n\n**Output**\nKisi peak element ka index.',
    examples: [
      { input: '4\n1 2 3 1', output: '2' },
      { input: '6\n1 2 1 3 5 6 4', output: '5' },
    ],
    constraints: ['1 <= n <= 1000', 'Adjacent values are never equal'],
    hints: [
      'A single global peak might not exist, but a *local* peak always does — the array\'s boundary conditions guarantee it.',
      'At the midpoint, if the slope is going up (`arr[mid] < arr[mid+1]`), a peak must exist somewhere to the right.',
      'If the slope is going down, a peak must exist at `mid` or somewhere to the left.',
    ],
    approach:
      'Binary search on the slope direction. At each midpoint, compare `arr[mid]` to `arr[mid + 1]`: if `arr[mid] < arr[mid + 1]`, the array is still rising, so a peak lies to the right — search `[mid+1, hi]`. Otherwise, a peak is at `mid` or to the left — search `[lo, mid]`.',
    approachHi:
      'Slope ki direction par binary search. Har midpoint par, `arr[mid]` ko `arr[mid + 1]` se compare karo: agar `arr[mid] < arr[mid + 1]` hai, array abhi bhi badh raha hai, isliye peak right mein hai — `[mid+1, hi]` search karo. Warna, peak `mid` par ya left mein hai — `[lo, mid]` search karo.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Because the boundaries are treated as negative infinity, the sequence must rise before it can fall (or already start falling, which itself makes index 0 a peak) — meaning every ascending run is guaranteed to terminate at a peak somewhere. Following the "uphill" direction at every midpoint is therefore guaranteed to walk toward *some* peak, even if the array has multiple; there is no need to find every peak, just one, which is exactly why halving the search space is safe.',
    solutionExplanationHi:
      'Chunki boundaries ko negative infinity maana jaata hai, sequence ko girne se pehle badhna hi hoga (ya pehle se hi gir raha ho, jo khud index 0 ko peak bana deta hai) — matlab har ascending run guaranteed kisi na kisi peak par khatam hoti hai. Har midpoint par "uphill" direction follow karna guaranteed *kisi* peak ki taraf le jaata hai, chahe array mein multiple peaks hon; har peak dhoondhne ki zaroorat nahi, sirf ek — yahi wajah hai ki search space ko aadha karna safe hai.',
    starter: starter(
      `const arr = nums(1);

function findPeakElement(arr) {
  // your code here
}

console.log(findPeakElement(arr));`,
      `arr = nums(1)

def find_peak_element(arr):
    # your code here
    pass

print(find_peak_element(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let lo = 0, hi = arr.length - 1;
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] < arr[mid + 1]) lo = mid + 1; else hi = mid;
}
console.log(lo);`,
      `arr = nums(1)
lo, hi = 0, len(arr) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if arr[mid] < arr[mid + 1]:
        lo = mid + 1
    else:
        hi = mid
print(lo)`,
    ),
    testCases: [
      sample('4\n1 2 3 1', '2'),
      sample('6\n1 2 1 3 5 6 4', '5'),
      hidden('1\n1', '0'),
      hidden('2\n1 2', '1'),
      hidden('2\n2 1', '0'),
      hidden('5\n5 4 3 2 1', '0'),
    ],
  },

  {
    slug: 'sqrt-x',
    title: 'Sqrt(x)',
    category: 'Binary Search',
    difficulty: 'EASY',
    description:
      'Compute the integer square root of a non-negative integer `x` — that is, `floor(sqrt(x))` — without using a built-in square root function.\n\n**Input**\nOne line containing `x`.\n\n**Output**\n`floor(sqrt(x))`.',
    descriptionHi:
      'Ek non-negative integer `x` ka integer square root nikalo — matlab `floor(sqrt(x))` — bina kisi built-in square root function ke.\n\n**Input**\nEk line jisme `x` hai.\n\n**Output**\n`floor(sqrt(x))`.',
    examples: [
      { input: '4', output: '2' },
      { input: '8', output: '2' },
    ],
    constraints: ['0 <= x <= 2^31 - 1'],
    hints: [
      'The answer lies somewhere in `[0, x]` (in fact `[0, x/2 + 1]` for x > 1), and "does `mid*mid <= x`?" is a monotonic yes/no question over that range.',
      'Binary search for the largest `mid` such that `mid*mid <= x`.',
      'Watch for overflow when squaring large values, in languages with fixed-width integers.',
    ],
    approach:
      'Binary search over candidate answers `[0, x]`. For each `mid`, check whether `mid * mid <= x`; if so, it is a valid candidate (move `lo` up to look for a bigger one), otherwise it is too big (move `hi` down). The largest valid `mid` found is the answer.',
    approachHi:
      'Candidate answers `[0, x]` par binary search karo. Har `mid` ke liye check karo ki `mid * mid <= x` hai ya nahi; agar haan, ye ek valid candidate hai (bada dhoondne ke liye `lo` upar le jao), warna bahut bada hai (`hi` neeche le jao). Sabse bada valid `mid` hi answer hai.',
    timeComplexity: 'O(log x)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      '"Is mid a valid square root candidate" (mid*mid <= x) is monotonic — every value below the true answer also satisfies it, and every value above does not — which is exactly the structural property that makes an unsorted-looking numeric range binary-searchable: the same "binary search on the answer" idea that also solves Koko Eating Bananas and Capacity to Ship Packages, just with an implicit rather than explicit search space.',
    solutionExplanationHi:
      '"Kya mid ek valid square root candidate hai" (mid*mid <= x) monotonic hai — asli answer se neeche ka har value ye satisfy karta hai, aur upar ka koi nahi — yahi structural property hai jo ek unsorted-dikhne wali numeric range ko binary-searchable banati hai: wahi "answer par binary search" wala idea jo Koko Eating Bananas aur Capacity to Ship Packages bhi solve karta hai, bas yahan search space implicit hai, explicit nahi.',
    starter: starter(
      `const x = num(0);

function mySqrt(x) {
  // your code here
}

console.log(mySqrt(x));`,
      `x = num(0)

def my_sqrt(x):
    # your code here
    pass

print(my_sqrt(x))`,
    ),
    solution: solution(
      `const x = num(0);
let lo = 0, hi = x, ans = 0;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (mid * mid <= x) { ans = mid; lo = mid + 1; } else hi = mid - 1;
}
console.log(ans);`,
      `x = num(0)
lo, hi, ans = 0, x, 0
while lo <= hi:
    mid = (lo + hi) // 2
    if mid * mid <= x:
        ans = mid
        lo = mid + 1
    else:
        hi = mid - 1
print(ans)`,
    ),
    testCases: [
      sample('4', '2'),
      sample('8', '2'),
      hidden('0', '0'),
      hidden('1', '1'),
      hidden('2147395599', '46339'),
      hidden('99', '9'),
    ],
  },

  {
    slug: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Koko has `n` piles of bananas and `h` hours before the guards return. Each hour she picks one pile and eats up to `k` bananas from it (if the pile has fewer than `k`, she finishes it and stops for the hour). Find the minimum integer eating speed `k` that lets her finish all piles within `h` hours.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated pile sizes\n- Line 3: `h`\n\n**Output**\nThe minimum eating speed.',
    descriptionHi:
      'Koko ke paas `n` bananas ke piles hain aur guards wapas aane mein `h` ghante bache hain. Har ghante wo ek pile chunti hai aur usmein se zyada se zyada `k` bananas khaati hai (agar pile mein `k` se kam hain, to wo pile khatam karke ghanta rok deti hai). Minimum integer eating speed `k` dhoondo jisse wo saare piles `h` ghanton mein khatam kar sake.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated pile sizes\n- Line 3: `h`\n\n**Output**\nMinimum eating speed.',
    examples: [
      { input: '4\n3 6 7 11\n8', output: '4' },
      { input: '5\n30 11 23 4 20\n5', output: '30' },
    ],
    constraints: ['1 <= n <= 10^4', '1 <= h <= 10^9', '1 <= pile[i] <= 10^9', 'h >= n'],
    hints: [
      'A faster eating speed always finishes in fewer or equal hours — "can speed k finish in time?" is monotonic in k.',
      'Binary search over possible speeds, from 1 to the largest pile size.',
      'For a candidate speed, the hours needed for a pile is `ceil(pile / speed)`; sum this across all piles and compare to h.',
    ],
    approach:
      'Binary search over candidate speeds in `[1, max(piles)]`. For a candidate speed `k`, compute the total hours needed as the sum of `ceil(pile / k)` over every pile. If that total is `<= h`, `k` works (try smaller); otherwise it does not (try bigger). The smallest working `k` is the answer.',
    approachHi:
      'Candidate speeds `[1, max(piles)]` par binary search karo. Candidate speed `k` ke liye, total hours = har pile ke `ceil(pile / k)` ka sum. Agar wo total `<= h` hai, `k` kaam karta hai (chhota try karo); warna nahi (bada try karo). Sabse chhota kaam karne wala `k` hi answer hai.',
    timeComplexity: 'O(n log(max(piles)))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is "binary search on the answer": the actual search space is not the input array but the range of possible speeds, and it is binary-searchable because "is speed k fast enough" is monotonic — any speed at least as fast as a working one also works. Each feasibility check costs O(n) to sum up hours across all piles, and there are O(log(max pile)) candidate speeds to check, giving the combined complexity.',
    solutionExplanationHi:
      'Ye "answer par binary search" hai: asli search space input array nahi, possible speeds ki range hai, aur ye binary-searchable isliye hai kyunki "kya speed k kaafi tez hai" monotonic hai — kaam karne wali speed se kam se kam utni tez koi bhi speed bhi kaam karegi. Har feasibility check saare piles ke hours sum karne mein O(n) leta hai, aur check karne layak O(log(max pile)) candidate speeds hain — isse combined complexity milti hai.',
    starter: starter(
      `const piles = nums(1), h = num(2);

function minEatingSpeed(piles, h) {
  // your code here
}

console.log(minEatingSpeed(piles, h));`,
      `piles, h = nums(1), num(2)

def min_eating_speed(piles, h):
    # your code here
    pass

print(min_eating_speed(piles, h))`,
    ),
    solution: solution(
      `const piles = nums(1), h = num(2);
function hoursNeeded(speed) {
  let total = 0;
  for (const p of piles) total += Math.ceil(p / speed);
  return total;
}
let lo = 1, hi = Math.max(...piles);
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (hoursNeeded(mid) <= h) hi = mid; else lo = mid + 1;
}
console.log(lo);`,
      `import math
piles, h = nums(1), num(2)

def hours_needed(speed):
    return sum(math.ceil(p / speed) for p in piles)

lo, hi = 1, max(piles)
while lo < hi:
    mid = (lo + hi) // 2
    if hours_needed(mid) <= h:
        hi = mid
    else:
        lo = mid + 1
print(lo)`,
    ),
    testCases: [
      sample('4\n3 6 7 11\n8', '4'),
      sample('5\n30 11 23 4 20\n5', '30'),
      hidden('5\n30 11 23 4 20\n6', '23'),
      hidden('1\n1000000000\n2', '500000000'),
      hidden('3\n1 1 1\n3', '1'),
      hidden('2\n312884469 312884469\n2', '312884469'),
    ],
  },

  {
    slug: 'capacity-to-ship-packages',
    title: 'Capacity To Ship Packages Within D Days',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Packages must be shipped in the given order over `days` days. Each day, load as many consecutive packages as fit within the ship\'s weight capacity. Find the minimum capacity that lets all packages ship within `days` days.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated weights\n- Line 3: `days`\n\n**Output**\nThe minimum capacity.',
    descriptionHi:
      'Packages ko diye gaye order mein `days` dinon mein ship karna hai. Har din, jitne consecutive packages ship ki weight capacity mein fit ho jaayein utne load karo. Minimum capacity dhoondo jisse saare packages `days` dinon mein ship ho jaayein.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated weights\n- Line 3: `days`\n\n**Output**\nMinimum capacity.',
    examples: [
      { input: '10\n1 2 3 4 5 6 7 8 9 10\n5', output: '15' },
      { input: '6\n3 2 2 4 1 4\n3', output: '6' },
    ],
    constraints: ['1 <= n <= 5*10^4', '1 <= days <= n', '1 <= weight[i] <= 500'],
    hints: [
      'A bigger capacity always needs the same or fewer days — "can capacity C finish in time?" is monotonic in C.',
      'The search range is [max(weights), sum(weights)]: capacity must fit the single heaviest package, and never needs to exceed shipping everything in one day.',
      'For a candidate capacity, greedily pack each day with as many consecutive packages as fit before starting a new day, and count the days used.',
    ],
    approach:
      'Binary search over candidate capacities in `[max(weights), sum(weights)]`. For a candidate capacity, greedily simulate shipping: keep adding consecutive packages to the current day\'s load until the next one would overflow, then start a new day. If the total days used is `<= days`, the capacity works (try smaller); otherwise it does not (try bigger).',
    approachHi:
      'Candidate capacities `[max(weights), sum(weights)]` par binary search karo. Candidate capacity ke liye, greedily shipping simulate karo: current din ke load mein consecutive packages jodte jao jab tak agla overflow na kare, phir naya din shuru karo. Agar total days `<= days` hain, capacity kaam karti hai (chhoti try karo); warna nahi (badi try karo).',
    timeComplexity: 'O(n log(sum(weights)))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is the same "binary search on the answer" shape as Koko Eating Bananas: the feasibility check (can this capacity ship everything within the day budget) is monotonic in capacity, so the minimum feasible capacity can be found by halving a candidate range instead of testing every possible value. The greedy simulation for a fixed capacity is provably optimal because delaying a package that still fits today never helps — it can only push later packages into needing an extra day.',
    solutionExplanationHi:
      'Ye Koko Eating Bananas jaisa hi "answer par binary search" hai: feasibility check (ye capacity din ke budget mein sab ship kar sakti hai ya nahi) capacity mein monotonic hai, isliye minimum feasible capacity ek candidate range ko aadha karke dhoondi ja sakti hai, har possible value test kiye bina. Fixed capacity ke liye greedy simulation provably optimal hai kyunki aaj fit hone wale package ko delay karna kabhi help nahi karta — ye sirf baad ke packages ko ek extra din ki zaroorat mein daal sakta hai.',
    starter: starter(
      `const weights = nums(1), days = num(2);

function shipWithinDays(weights, days) {
  // your code here
}

console.log(shipWithinDays(weights, days));`,
      `weights, days = nums(1), num(2)

def ship_within_days(weights, days):
    # your code here
    pass

print(ship_within_days(weights, days))`,
    ),
    solution: solution(
      `const weights = nums(1), days = num(2);
function daysNeeded(cap) {
  let d = 1, load = 0;
  for (const w of weights) {
    if (load + w > cap) { d++; load = 0; }
    load += w;
  }
  return d;
}
let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (daysNeeded(mid) <= days) hi = mid; else lo = mid + 1;
}
console.log(lo);`,
      `weights, days = nums(1), num(2)

def days_needed(cap):
    d, load = 1, 0
    for w in weights:
        if load + w > cap:
            d += 1
            load = 0
        load += w
    return d

lo, hi = max(weights), sum(weights)
while lo < hi:
    mid = (lo + hi) // 2
    if days_needed(mid) <= days:
        hi = mid
    else:
        lo = mid + 1
print(lo)`,
    ),
    testCases: [
      sample('10\n1 2 3 4 5 6 7 8 9 10\n5', '15'),
      sample('6\n3 2 2 4 1 4\n3', '6'),
      hidden('5\n1 2 3 1 1\n4', '3'),
      hidden('3\n1 2 3\n1', '6'),
      hidden('3\n1 2 3\n3', '3'),
      hidden('1\n100\n1', '100'),
    ],
  },

  {
    slug: 'find-first-and-last-position',
    title: 'Find First and Last Position of Element in Sorted Array',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Find the first and last index of `target` in a sorted array. Return `-1 -1` if it does not occur.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: target\n\n**Output**\nThe first and last indices, space-separated (or `-1 -1`).',
    descriptionHi:
      'Sorted array mein `target` ka first aur last index dhoondo. Agar wo exist nahi karta to `-1 -1` return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: target\n\n**Output**\nFirst aur last indices, space se separate (ya `-1 -1`).',
    examples: [
      { input: '6\n5 7 7 8 8 10\n8', output: '3 4' },
      { input: '6\n5 7 7 8 8 10\n6', output: '-1 -1' },
    ],
    constraints: ['0 <= n <= 10^5', 'The array is sorted ascending'],
    hints: [
      'A plain binary search finds *a* match, but not necessarily the first or last one.',
      'Two separate binary searches, each biased to keep searching in one direction after finding a match, find the two boundaries.',
      'To find the leftmost match: on a match, keep searching the left half. To find the rightmost: on a match, keep searching the right half.',
    ],
    approach:
      'Run two modified binary searches. For the first occurrence, whenever `arr[mid] === target`, record it and continue searching `[lo, mid-1]` for an even earlier one. For the last occurrence, do the mirror: continue searching `[mid+1, hi]` for a later one.',
    approachHi:
      'Do modified binary searches chalao. First occurrence ke liye, jab bhi `arr[mid] === target`, use record karo aur `[lo, mid-1]` mein aur pehle wala dhoondte raho. Last occurrence ke liye, ulta karo: `[mid+1, hi]` mein aur baad wala dhoondte raho.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'A standard binary search stops the instant it finds *any* matching index, but "first" and "last" require continuing to search past a known match — treating a match as "record it, then keep narrowing toward one specific side" (left for first, right for last) turns one binary search template into two boundary-finding searches, run independently, each still O(log n).',
    solutionExplanationHi:
      'Ek standard binary search *koi bhi* matching index milte hi ruk jaati hai, par "first" aur "last" ke liye ek known match ke aage bhi search jaari rakhni padti hai — match ko "record karo, phir ek specific side ki taraf (first ke liye left, last ke liye right) narrow karte raho" ki tarah treat karna, ek binary search template ko do independent boundary-finding searches mein badal deta hai, dono still O(log n).',
    starter: starter(
      `const arr = nums(1), target = num(2);

function searchRange(arr, target) {
  // return [first, last]
  return [-1, -1];
}

console.log(searchRange(arr, target).join(' '));`,
      `arr, target = nums(1), num(2)

def search_range(arr, target):
    # return [first, last]
    return [-1, -1]

print(" ".join(map(str, search_range(arr, target))))`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
function findBound(leftmost) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) {
      ans = mid;
      if (leftmost) hi = mid - 1; else lo = mid + 1;
    } else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}
console.log(findBound(true) + ' ' + findBound(false));`,
      `arr, target = nums(1), num(2)

def find_bound(leftmost):
    lo, hi, ans = 0, len(arr) - 1, -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            ans = mid
            if leftmost:
                hi = mid - 1
            else:
                lo = mid + 1
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return ans

print(find_bound(True), find_bound(False))`,
    ),
    testCases: [
      sample('6\n5 7 7 8 8 10\n8', '3 4'),
      sample('6\n5 7 7 8 8 10\n6', '-1 -1'),
      hidden('0\n\n0', '-1 -1'),
      hidden('1\n1\n1', '0 0'),
      hidden('5\n2 2 2 2 2\n2', '0 4'),
      hidden('3\n1 2 3\n3', '2 2'),
    ],
  },

  {
    slug: 'search-in-rotated-sorted-array-ii',
    title: 'Search in Rotated Sorted Array II',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'A sorted array (which may contain duplicates) has been rotated at an unknown pivot. Determine whether `target` exists.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers (rotated sorted, duplicates allowed)\n- Line 3: target\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Ek sorted array (jisme duplicates ho sakte hain) kisi anjaan pivot par rotate ho gaya hai. Check karo ki `target` exist karta hai ya nahi.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` integers (rotated sorted, duplicates allowed)\n- Line 3: target\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '7\n2 5 6 0 0 1 2\n0', output: 'true' },
      { input: '7\n2 5 6 0 0 1 2\n3', output: 'false' },
    ],
    constraints: ['1 <= n <= 5000', 'Duplicates are allowed'],
    hints: [
      'Duplicates break the trick used in the distinct-values version: `arr[lo] === arr[mid] === arr[hi]` gives no information about which half is sorted.',
      'When that ambiguous tie occurs, the safe fallback is to shrink the range by one from both ends and try again.',
      'Otherwise, the same "which half is sorted, does target fall in its range" logic from the distinct-values version applies.',
    ],
    approach:
      'Modified binary search, same as the distinct-values version, with one added case: if `arr[lo] === arr[mid]` and `arr[mid] === arr[hi]`, it is impossible to tell which half is sorted, so simply shrink the search by incrementing `lo` and decrementing `hi` and try again. Otherwise, proceed exactly as in Search in Rotated Sorted Array.',
    approachHi:
      'Distinct-values version jaisi hi modified binary search, ek extra case ke saath: agar `arr[lo] === arr[mid]` aur `arr[mid] === arr[hi]`, to pata nahi chal sakta kaunsa half sorted hai, isliye bas `lo` badhao aur `hi` ghatao aur dobara try karo. Warna, Search in Rotated Sorted Array jaisa hi aage badho.',
    timeComplexity: 'O(n) worst case (e.g. all duplicates), O(log n) typical',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Duplicates create exactly one blind spot: when the two endpoints and the midpoint are all equal, there is genuinely no way to tell from those three values alone which side is the rotation point on, so the algorithm cannot safely discard either half — the only correct move is to shrink the ambiguous edges by one and re-examine, which is why the worst case (e.g. an array of all-identical values) degrades to O(n) instead of staying O(log n).',
    solutionExplanationHi:
      'Duplicates exactly ek blind spot banate hain: jab dono endpoints aur midpoint sab barabar hon, to sirf un teen values se pata karna genuinely possible nahi ki rotation point kaunsi side par hai, isliye algorithm safely koi bhi half discard nahi kar sakta — sahi move sirf ambiguous edges ko ek-ek karke shrink karna aur dobara check karna hai, isi wajah se worst case (jaise sab-identical values wala array) O(n) tak degrade ho jaata hai, O(log n) nahi rehta.',
    starter: starter(
      `const arr = nums(1), target = num(2);

function search(arr, target) {
  // your code here
}

console.log(search(arr, target));`,
      `arr, target = nums(1), num(2)

def search(arr, target):
    # your code here
    pass

print("true" if search(arr, target) else "false")`,
    ),
    solution: solution(
      `const arr = nums(1), target = num(2);
let lo = 0, hi = arr.length - 1, found = false;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) { found = true; break; }
  if (arr[lo] === arr[mid] && arr[mid] === arr[hi]) { lo++; hi--; continue; }
  if (arr[lo] <= arr[mid]) {
    if (arr[lo] <= target && target < arr[mid]) hi = mid - 1; else lo = mid + 1;
  } else {
    if (arr[mid] < target && target <= arr[hi]) lo = mid + 1; else hi = mid - 1;
  }
}
console.log(found);`,
      `arr, target = nums(1), num(2)
lo, hi, found = 0, len(arr) - 1, False
while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target:
        found = True
        break
    if arr[lo] == arr[mid] and arr[mid] == arr[hi]:
        lo += 1
        hi -= 1
        continue
    if arr[lo] <= arr[mid]:
        if arr[lo] <= target < arr[mid]:
            hi = mid - 1
        else:
            lo = mid + 1
    else:
        if arr[mid] < target <= arr[hi]:
            lo = mid + 1
        else:
            hi = mid - 1
print("true" if found else "false")`,
    ),
    testCases: [
      sample('7\n2 5 6 0 0 1 2\n0', 'true'),
      sample('7\n2 5 6 0 0 1 2\n3', 'false'),
      hidden('1\n1\n1', 'true'),
      hidden('3\n1 1 1\n1', 'true'),
      hidden('5\n1 1 1 1 1\n2', 'false'),
      hidden('6\n2 2 2 3 2 2\n3', 'true'),
    ],
  },

  {
    slug: 'kth-smallest-in-sorted-matrix',
    title: 'Kth Smallest Element in a Sorted Matrix',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Given an `n x n` matrix where each row and column is sorted ascending, find the `k`-th smallest element overall.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `n` space-separated integers each\n- Last line: `k`\n\n**Output**\nThe `k`-th smallest value.',
    descriptionHi:
      'Ek `n x n` matrix diya hai jahan har row aur column ascending sorted hai. Overall `k`-vaan sabse chhota element dhoondo.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: har ek mein `n` space-separated integers\n- Aakhri line: `k`\n\n**Output**\n`k`-vaan sabse chhota value.',
    examples: [
      { input: '3\n1 5 9\n10 11 13\n12 13 15\n8', output: '13' },
      { input: '1\n-5\n1', output: '-5' },
    ],
    constraints: ['1 <= n <= 300', '1 <= k <= n*n'],
    hints: [
      'Merging all rows with a heap works, but there is a binary-search approach that avoids extra memory.',
      'Binary search over the *value range* `[matrix[0][0], matrix[n-1][n-1]]`, not over indices.',
      'For a candidate value, count how many matrix entries are `<= it` using the same staircase technique as Search a 2D Matrix II — that count tells you whether the candidate is at least the k-th smallest.',
    ],
    approach:
      'Binary search over the value range `[matrix[0][0], matrix[n-1][n-1]]`. For a candidate value `mid`, count how many entries are `<= mid` using a staircase walk from the bottom-left corner (O(n) per count). If that count is `>= k`, `mid` could be the answer or too big (search left half); otherwise search the right half.',
    approachHi:
      'Value range `[matrix[0][0], matrix[n-1][n-1]]` par binary search karo. Candidate value `mid` ke liye, bottom-left corner se staircase walk (O(n) per count) se count karo kitne entries `<= mid` hain. Agar wo count `>= k` hai, `mid` answer ho sakta hai ya bahut bada hai (left half search karo); warna right half search karo.',
    timeComplexity: 'O(n log(max - min))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'The binary search here operates on VALUES, not positions — "how many entries are at most v" is a monotonically non-decreasing function of v, which is what makes it searchable even though v itself is not an index into anything. Counting that quantity efficiently reuses the exact staircase-walk trick from Search a 2D Matrix II (start at a corner where one direction increases and the other decreases), giving an O(n) count per candidate rather than an O(n^2) full scan.',
    solutionExplanationHi:
      'Yahan binary search VALUES par hoti hai, positions par nahi — "kitne entries at most v hain" v ka ek monotonically non-decreasing function hai, yahi cheez ise searchable banati hai chahe v khud kisi cheez ka index na ho. Us quantity ko efficiently count karna Search a 2D Matrix II wala hi staircase-walk trick reuse karta hai (ek aise corner se shuru karo jahan ek direction badhti hai aur doosri ghatti hai), jisse har candidate ke liye O(n) count milta hai, O(n^2) full scan nahi.',
    starter: starter(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));
const k = num(1 + n);

function kthSmallest(grid, k) {
  // your code here
}

console.log(kthSmallest(grid, k));`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]
k = num(1 + n)

def kth_smallest(grid, k):
    # your code here
    pass

print(kth_smallest(grid, k))`,
    ),
    solution: solution(
      `const n = num(0);
const grid = [];
for (let i = 0; i < n; i++) grid.push(nums(1 + i));
const k = num(1 + n);
function countLessEqual(v) {
  let count = 0, r = n - 1, c = 0;
  while (r >= 0 && c < n) {
    if (grid[r][c] <= v) { count += r + 1; c++; } else r--;
  }
  return count;
}
let lo = grid[0][0], hi = grid[n - 1][n - 1];
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (countLessEqual(mid) >= k) hi = mid; else lo = mid + 1;
}
console.log(lo);`,
      `n = num(0)
grid = [nums(1 + i) for i in range(n)]
k = num(1 + n)

def count_less_equal(v):
    count, r, c = 0, n - 1, 0
    while r >= 0 and c < n:
        if grid[r][c] <= v:
            count += r + 1
            c += 1
        else:
            r -= 1
    return count

lo, hi = grid[0][0], grid[n - 1][n - 1]
while lo < hi:
    mid = (lo + hi) // 2
    if count_less_equal(mid) >= k:
        hi = mid
    else:
        lo = mid + 1
print(lo)`,
    ),
    testCases: [
      sample('3\n1 5 9\n10 11 13\n12 13 15\n8', '13'),
      sample('1\n-5\n1', '-5'),
      hidden('2\n1 2\n1 3\n2', '1'),
      hidden('2\n1 2\n1 3\n4', '3'),
      hidden('3\n1 2 3\n4 5 6\n7 8 9\n5', '5'),
      hidden('2\n-5 -4\n-3 -2\n1', '-5'),
    ],
  },

  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    category: 'Binary Search',
    difficulty: 'HARD',
    description:
      'Given two sorted arrays, find the median of the combined data, in O(log(min(n, m))) time. Print the result to 5 decimal places.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers (array 1, may be empty)\n- Line 3: `m`\n- Line 4: `m` sorted integers (array 2, may be empty)\n\n**Output**\nThe median, formatted to 5 decimal places.',
    descriptionHi:
      'Do sorted arrays diye hain. Unke combined data ka median O(log(min(n, m))) time mein dhoondo. Result ko 5 decimal places tak print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers (array 1, khaali ho sakti hai)\n- Line 3: `m`\n- Line 4: `m` sorted integers (array 2, khaali ho sakti hai)\n\n**Output**\nMedian, 5 decimal places tak formatted.',
    examples: [
      { input: '2\n1 3\n1\n2', output: '2.00000' },
      { input: '2\n1 2\n2\n3 4', output: '2.50000' },
    ],
    constraints: ['0 <= n, m', '1 <= n + m'],
    hints: [
      'Merging both arrays fully and taking the middle works, but costs O(n+m) — the required complexity is logarithmic.',
      'Binary search on the smaller array for a "partition point" that splits the combined data exactly in half.',
      'A partition is correct when every element on the left side of both arrays\' cuts is <= every element on the right side of both cuts.',
    ],
    approach:
      'Binary search on a partition index into the smaller array. For a candidate partition of the smaller array, compute the matching partition of the larger array so the two partitions together split the combined data in half. Check whether the boundary elements are correctly ordered (left-side maxes <= right-side mins on both sides); if not, adjust the partition left or right, otherwise the median is directly computable from the four boundary elements.',
    approachHi:
      'Chhote array mein ek partition index par binary search karo. Chhote array ke candidate partition ke liye, bade array ka matching partition compute karo taaki dono partitions milkar combined data ko aadhe mein baant den. Check karo ki boundary elements sahi order mein hain ya nahi (dono side ke left-max <= right-min); nahi to partition ko left ya right adjust karo, warna median seedha chaar boundary elements se nikal jaata hai.',
    timeComplexity: 'O(log(min(n, m)))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'A median only needs the combined data split into a correctly-ordered left half and right half — it does not need the halves fully sorted internally. Binary searching for where to cut the smaller array (with the larger array\'s cut determined arithmetically to keep both halves equal in size) is fast because the "is this cut correct" check is monotonic: if the smaller array\'s cut is too far left, the larger array\'s forced cut ends up too far right, producing a detectable ordering violation that tells you which direction to adjust.',
    solutionExplanationHi:
      'Median ke liye sirf combined data ko sahi-order left half aur right half mein split karna hota hai — halves ko andar se poori tarah sorted karne ki zaroorat nahi. Chhote array ko kahan katna hai ye binary search se dhoondna fast hai (bade array ka cut arithmetically decide hota hai taaki dono halves size mein barabar rahein) kyunki "kya ye cut sahi hai" check monotonic hai: agar chhote array ka cut bahut left mein hai, to bade array ka forced cut bahut right mein chala jaata hai, jo ek detectable ordering violation deta hai aur bata deta hai kis taraf adjust karna hai.',
    starter: starter(
      `const n = num(0);
const a = n ? nums(1) : [];
const m = num(2);
const b = m ? nums(3) : [];

function findMedianSortedArrays(a, b) {
  // return the median as a number
  return 0;
}

console.log(findMedianSortedArrays(a, b).toFixed(5));`,
      `n = num(0)
a = nums(1) if n else []
m = num(2)
b = nums(3) if m else []

def find_median_sorted_arrays(a, b):
    # return the median as a float
    return 0.0

print(f"{find_median_sorted_arrays(a, b):.5f}")`,
    ),
    solution: solution(
      `const n = num(0);
let a = n ? nums(1) : [];
const m = num(2);
let b = m ? nums(3) : [];
if (a.length > b.length) [a, b] = [b, a];
const na = a.length, nb = b.length;
const half = Math.floor((na + nb + 1) / 2);
let lo = 0, hi = na, median = 0;
while (lo <= hi) {
  const i = lo + ((hi - lo) >> 1);
  const j = half - i;
  const aLeft = i > 0 ? a[i - 1] : -Infinity;
  const aRight = i < na ? a[i] : Infinity;
  const bLeft = j > 0 ? b[j - 1] : -Infinity;
  const bRight = j < nb ? b[j] : Infinity;
  if (aLeft <= bRight && bLeft <= aRight) {
    if ((na + nb) % 2 === 1) median = Math.max(aLeft, bLeft);
    else median = (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    break;
  } else if (aLeft > bRight) hi = i - 1;
  else lo = i + 1;
}
console.log(median.toFixed(5));`,
      `n = num(0)
a = nums(1) if n else []
m = num(2)
b = nums(3) if m else []
if len(a) > len(b):
    a, b = b, a
na, nb = len(a), len(b)
half = (na + nb + 1) // 2
lo, hi = 0, na
median = 0.0
while lo <= hi:
    i = (lo + hi) // 2
    j = half - i
    a_left = a[i - 1] if i > 0 else float("-inf")
    a_right = a[i] if i < na else float("inf")
    b_left = b[j - 1] if j > 0 else float("-inf")
    b_right = b[j] if j < nb else float("inf")
    if a_left <= b_right and b_left <= a_right:
        if (na + nb) % 2 == 1:
            median = max(a_left, b_left)
        else:
            median = (max(a_left, b_left) + min(a_right, b_right)) / 2
        break
    elif a_left > b_right:
        hi = i - 1
    else:
        lo = i + 1
print(f"{median:.5f}")`,
    ),
    testCases: [
      sample('2\n1 3\n1\n2', '2.00000'),
      sample('2\n1 2\n2\n3 4', '2.50000'),
      hidden('0\n\n1\n1', '1.00000'),
      hidden('1\n2\n0\n', '2.00000'),
      hidden('3\n1 2 3\n3\n4 5 6', '3.50000'),
      hidden('1\n1\n1\n1', '1.00000'),
    ],
  },

  {
    slug: 'single-element-in-sorted-array',
    title: 'Single Element in a Sorted Array',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'In a sorted array, every element appears exactly twice except for one, which appears once. Find that element in O(log n).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\nThe element that appears once.',
    descriptionHi:
      'Ek sorted array mein har element exactly do baar aata hai, sirf ek ko chhod kar, jo ek hi baar aata hai. Use O(log n) mein dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n\n**Output**\nWo element jo ek hi baar aata hai.',
    examples: [
      { input: '9\n1 1 2 3 3 4 4 8 8', output: '2' },
      { input: '7\n3 3 7 7 10 11 11', output: '10' },
    ],
    constraints: ['1 <= n <= 10^5', 'n is odd', 'The array is sorted ascending'],
    hints: [
      'A linear XOR scan solves it in O(n) — the sorted structure allows O(log n) instead.',
      'Before the single element, every pair starts at an even index; after it, every pair starts at an odd index — the pairing pattern shifts by one.',
      'Binary search for the first index where this shift happens by checking, at each even midpoint, whether it still matches its expected partner.',
    ],
    approach:
      'Binary search restricted to even indices. At an even midpoint `mid`, if `arr[mid] === arr[mid + 1]`, the pairing pattern is still intact up through `mid`, so the single element is to the right — search `[mid+2, hi]`. Otherwise, the shift has already happened at or before `mid`, so search `[lo, mid]`.',
    approachHi:
      'Binary search sirf even indices tak restricted. Ek even midpoint `mid` par, agar `arr[mid] === arr[mid + 1]` hai, to pairing pattern `mid` tak abhi bhi intact hai, isliye single element right mein hai — `[mid+2, hi]` search karo. Warna, shift `mid` par ya usse pehle ho chuka hai, isliye `[lo, mid]` search karo.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Before the single element, pairs align with (even, odd) index pairs; the single element\'s presence shifts every pair after it to (odd, even) instead — a discrete, monotonic shift-point that binary search can locate directly, rather than needing to compare every element like the O(n) XOR approach. Restricting the search to even midpoints is what keeps each comparison meaningful, since checking an odd index against its predecessor rather than successor would test the wrong pairing.',
    solutionExplanationHi:
      'Single element se pehle, pairs (even, odd) index pairs mein align hote hain; single element ki presence uske baad ke har pair ko (odd, even) mein shift kar deti hai — ek discrete, monotonic shift-point jise binary search seedha locate kar sakta hai, O(n) XOR approach ki tarah har element compare kiye bina. Search ko even midpoints tak restrict karna hi har comparison ko meaningful rakhta hai, kyunki odd index ko uske successor ke bajaye predecessor se compare karna galat pairing test karega.',
    starter: starter(
      `const arr = nums(1);

function singleNonDuplicate(arr) {
  // your code here
}

console.log(singleNonDuplicate(arr));`,
      `arr = nums(1)

def single_non_duplicate(arr):
    # your code here
    pass

print(single_non_duplicate(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let lo = 0, hi = arr.length - 1;
while (lo < hi) {
  let mid = lo + ((hi - lo) >> 1);
  if (mid % 2 === 1) mid--;
  if (arr[mid] === arr[mid + 1]) lo = mid + 2; else hi = mid;
}
console.log(arr[lo]);`,
      `arr = nums(1)
lo, hi = 0, len(arr) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if mid % 2 == 1:
        mid -= 1
    if arr[mid] == arr[mid + 1]:
        lo = mid + 2
    else:
        hi = mid
print(arr[lo])`,
    ),
    testCases: [
      sample('9\n1 1 2 3 3 4 4 8 8', '2'),
      sample('7\n3 3 7 7 10 11 11', '10'),
      hidden('1\n7', '7'),
      hidden('3\n1 1 2', '2'),
      hidden('3\n2 3 3', '2'),
      hidden('5\n1 1 2 2 3', '3'),
    ],
  },

  {
    slug: 'find-k-closest-elements',
    title: 'Find K Closest Elements',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Given a sorted array, find the `k` values closest to `x`. Ties (equal distance) are broken in favor of the smaller value. Return the result sorted ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: `k`\n- Line 4: `x`\n\n**Output**\nThe `k` closest values, ascending, space-separated.',
    descriptionHi:
      'Ek sorted array diya hai. `x` ke sabse nazdeek `k` values dhoondo. Tie (equal distance) hone par chhoti value ko priority do. Result ko ascending sorted return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted integers\n- Line 3: `k`\n- Line 4: `x`\n\n**Output**\n`k` sabse nazdeek values, ascending, space se separate.',
    examples: [
      { input: '5\n1 2 3 4 5\n4\n3', output: '1 2 3 4' },
      { input: '5\n1 2 3 4 5\n4\n-1', output: '1 2 3 4' },
    ],
    constraints: ['1 <= k <= n <= 10^4', 'The array is sorted ascending'],
    hints: [
      'The k closest elements always form a contiguous window in a sorted array — binary search for that window\'s starting position.',
      'Binary search over the window\'s left edge, in the range [0, n - k].',
      'To decide whether to shift the window right, compare how far `x` is from the window\'s current leftmost value versus the value just past its right edge.',
    ],
    approach:
      'Binary search for the left edge of a size-`k` window in `[0, n - k]`. At each midpoint `lo`, compare `x - arr[lo]` (distance to the value just outside the window on the left) against `arr[lo + k] - x` (distance to the value just outside on the right): if the left side is farther, the window should shift right (`lo` increases); otherwise it should not shift further right.',
    approachHi:
      'Size-`k` window ke left edge ke liye `[0, n - k]` mein binary search karo. Har midpoint `lo` par, `x - arr[lo]` (window ke bahar left wali value ki distance) ko `arr[lo + k] - x` (bahar right wali value ki distance) se compare karo: agar left side zyada door hai, window ko right shift karna chahiye (`lo` badhao); warna aage right shift nahi karna chahiye.',
    timeComplexity: 'O(log(n - k) + k)',
    spaceComplexity: 'O(k) for the output',
    solutionExplanation:
      'Because the array is sorted, the k closest elements to any fixed x must be contiguous — there can never be a "gap" element inside the window that is farther from x than something excluded outside it. That contiguity is what makes searching for just the window\'s left boundary sufficient (rather than considering all C(n,k) possible subsets), and the comparison at each candidate boundary is monotonic in exactly the way binary search requires.',
    solutionExplanationHi:
      'Array sorted hone ki wajah se, kisi bhi fixed x ke sabse nazdeek k elements contiguous hi honge — window ke andar kabhi koi aisa "gap" element nahi ho sakta jo bahar excluded kisi cheez se x se zyada door ho. Yahi contiguity sirf window ke left boundary ko search karna kaafi banati hai (saare C(n,k) possible subsets consider karne ke bajaye), aur har candidate boundary par comparison exactly usi tarah monotonic hai jaisa binary search ko chahiye.',
    starter: starter(
      `const arr = nums(1), k = num(2), x = num(3);

function findClosestElements(arr, k, x) {
  // return the k closest values, ascending
  return [];
}

console.log(findClosestElements(arr, k, x).join(' '));`,
      `arr, k, x = nums(1), num(2), num(3)

def find_closest_elements(arr, k, x):
    # return the k closest values, ascending
    return []

print(" ".join(map(str, find_closest_elements(arr, k, x))))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2), x = num(3);
let lo = 0, hi = arr.length - k;
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1; else hi = mid;
}
console.log(arr.slice(lo, lo + k).join(' '));`,
      `arr, k, x = nums(1), num(2), num(3)
lo, hi = 0, len(arr) - k
while lo < hi:
    mid = (lo + hi) // 2
    if x - arr[mid] > arr[mid + k] - x:
        lo = mid + 1
    else:
        hi = mid
print(" ".join(map(str, arr[lo:lo + k])))`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5\n4\n3', '1 2 3 4'),
      sample('5\n1 2 3 4 5\n4\n-1', '1 2 3 4'),
      hidden('5\n1 2 3 4 5\n1\n3', '3'),
      hidden('6\n1 1 1 10 10 10\n1\n9', '10'),
      hidden('4\n1 2 3 4\n2\n3', '2 3'),
      hidden('5\n1 3 5 7 9\n3\n5', '3 5 7'),
    ],
  },

  {
    slug: 'minimum-days-to-make-bouquets',
    title: 'Minimum Number of Days to Make m Bouquets',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Flower `i` blooms on day `bloomDay[i]`. Making one bouquet requires `k` ADJACENT already-bloomed flowers. Find the minimum number of days needed to make `m` bouquets, or `-1` if impossible.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated bloom days\n- Line 3: `m`\n- Line 4: `k`\n\n**Output**\nThe minimum days, or `-1`.',
    descriptionHi:
      'Flower `i`, din `bloomDay[i]` par khilta hai. Ek bouquet banane ke liye `k` ADJACENT pehle-se-khile flowers chahiye. `m` bouquets banane ke liye minimum days dhoondo, ya `-1` agar impossible hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated bloom days\n- Line 3: `m`\n- Line 4: `k`\n\n**Output**\nMinimum days, ya `-1`.',
    examples: [
      { input: '5\n1 10 3 10 2\n3\n1', output: '3' },
      { input: '5\n1 10 3 10 2\n3\n2', output: '-1' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= m', '1 <= k <= n'],
    hints: [
      'If m*k exceeds the total number of flowers, it is immediately impossible.',
      '"Can we make m bouquets by day d" is monotonic in d — more days can only help.',
      'For a candidate day, scan the flowers and count how many bouquets can be formed from runs of adjacent already-bloomed flowers (each full run of length L contributes floor(L/k) bouquets).',
    ],
    approach:
      'If `m*k > n`, return -1 immediately. Otherwise, binary search over candidate days in `[min(bloomDay), max(bloomDay)]`. For a candidate day, scan the array and count bouquets: track the length of the current run of flowers with `bloomDay <= day`, and every time that run reaches a fresh multiple of `k`, count one more bouquet from it. If the total bouquets `>= m`, the day works.',
    approachHi:
      'Agar `m*k > n` hai, turant `-1` return karo. Warna, `[min(bloomDay), max(bloomDay)]` mein candidate days par binary search karo. Candidate day ke liye, array scan karo aur bouquets count karo: `bloomDay <= day` wale flowers ke current run ki length track karo, aur jab bhi wo run `k` ka ek naya multiple ban jaaye, ek aur bouquet count karo. Agar total bouquets `>= m`, ye din kaam karta hai.',
    timeComplexity: 'O(n log(max(bloomDay)))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is another instance of binary search on the answer: feasibility ("can m bouquets be made by day d") is monotonic in d, since waiting longer only ever adds more bloomed flowers, never removes any. The counting subroutine reduces to run-length tracking — bouquets require adjacency, so only maximal contiguous runs of bloomed flowers matter, and a run of length L contributes floor(L/k) bouquets since each bouquet consumes exactly k flowers from within one run.',
    solutionExplanationHi:
      'Ye "answer par binary search" ka ek aur example hai: feasibility ("kya m bouquets din d tak ban sakte hain") d mein monotonic hai, kyunki zyada wait karne se sirf aur flowers khilte hain, kabhi kam nahi hote. Counting subroutine run-length tracking mein simplify ho jaata hai — bouquets ke liye adjacency chahiye, isliye sirf khile hue flowers ke maximal contiguous runs matter karte hain, aur length L ka run floor(L/k) bouquets deta hai kyunki har bouquet ek hi run ke andar se exactly k flowers consume karta hai.',
    starter: starter(
      `const bloomDay = nums(1), m = num(2), k = num(3);

function minDays(bloomDay, m, k) {
  // your code here
}

console.log(minDays(bloomDay, m, k));`,
      `bloom_day, m, k = nums(1), num(2), num(3)

def min_days(bloom_day, m, k):
    # your code here
    pass

print(min_days(bloom_day, m, k))`,
    ),
    solution: solution(
      `const bloomDay = nums(1), m = num(2), k = num(3);
if (m * k > bloomDay.length) { console.log(-1); }
else {
  function canFinish(day) {
    let bouquets = 0, run = 0;
    for (const b of bloomDay) {
      if (b <= day) { run++; if (run % k === 0) bouquets++; }
      else run = 0;
    }
    return bouquets >= m;
  }
  let lo = Math.min(...bloomDay), hi = Math.max(...bloomDay);
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (canFinish(mid)) hi = mid; else lo = mid + 1;
  }
  console.log(lo);
}`,
      `bloom_day, m, k = nums(1), num(2), num(3)
if m * k > len(bloom_day):
    print(-1)
else:
    def can_finish(day):
        bouquets = run = 0
        for b in bloom_day:
            if b <= day:
                run += 1
                if run % k == 0:
                    bouquets += 1
            else:
                run = 0
        return bouquets >= m

    lo, hi = min(bloom_day), max(bloom_day)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_finish(mid):
            hi = mid
        else:
            lo = mid + 1
    print(lo)`,
    ),
    testCases: [
      sample('5\n1 10 3 10 2\n3\n1', '3'),
      sample('5\n1 10 3 10 2\n3\n2', '-1'),
      hidden('7\n7 7 7 7 12 7 7\n2\n3', '12'),
      hidden('4\n1 10 2 9\n4\n1', '10'),
      hidden('1\n1\n1\n1', '1'),
      hidden('6\n1 2 3 4 5 6\n2\n3', '6'),
    ],
  },

  {
    slug: 'split-array-largest-sum',
    title: 'Split Array Largest Sum',
    category: 'Binary Search',
    difficulty: 'HARD',
    description:
      'Split the array into `k` non-empty contiguous subarrays so as to minimize the largest sum among the subarrays. Return that minimized largest sum.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n- Line 3: `k`\n\n**Output**\nThe minimized largest subarray sum.',
    descriptionHi:
      'Array ko `k` non-empty contiguous subarrays mein todo, taaki subarrays mein sabse bade sum ko minimize kiya ja sake. Wahi minimized largest sum return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n- Line 3: `k`\n\n**Output**\nMinimized largest subarray sum.',
    examples: [
      { input: '5\n7 2 5 10 8\n2', output: '18' },
      { input: '5\n1 2 3 4 5\n2', output: '9' },
    ],
    constraints: ['1 <= n <= 1000', '1 <= k <= n', '0 <= nums[i] <= 10^6'],
    hints: [
      'This is structurally identical to Capacity To Ship Packages Within D Days, with "days" renamed to "number of pieces".',
      'The search range is [max(nums), sum(nums)]: a piece must be able to hold the single largest element, and never needs to exceed putting everything in one piece.',
      'For a candidate maximum-sum-per-piece, greedily count how many pieces are needed and compare to k.',
    ],
    approach:
      'Binary search over candidate "largest sum" values in `[max(nums), sum(nums)]`. For a candidate value, greedily count how many contiguous pieces are needed so that no piece exceeds it (adding elements to the current piece until the next one would overflow, then starting a new piece). If the pieces needed is `<= k`, the candidate works (try smaller); otherwise it does not (try bigger).',
    approachHi:
      'Candidate "largest sum" values `[max(nums), sum(nums)]` par binary search karo. Candidate value ke liye, greedily count karo kitne contiguous pieces chahiye taaki koi bhi piece use exceed na kare (current piece mein elements jodte jao jab tak agla overflow na kare, phir naya piece shuru karo). Agar zaroori pieces `<= k` hain, candidate kaam karta hai (chhota try karo); warna nahi (bada try karo).',
    timeComplexity: 'O(n log(sum(nums)))',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This problem and Capacity To Ship Packages Within D Days are the exact same abstract problem wearing different names: "minimize the maximum load per group, given a fixed number of groups" — both are solved by binary searching over the candidate maximum-load value and greedily checking feasibility, because "can this max-load value be achieved with k or fewer groups" is monotonic in the candidate value.',
    solutionExplanationHi:
      'Ye problem aur Capacity To Ship Packages Within D Days, alag naamon ke saath bilkul wahi abstract problem hain: "fixed number of groups diye jaane par, per-group maximum load minimize karo" — dono ko candidate maximum-load value par binary search karke aur feasibility greedily check karke solve kiya jaata hai, kyunki "kya ye max-load value k ya usse kam groups mein achieve ho sakta hai" candidate value mein monotonic hai.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function splitArray(arr, k) {
  // your code here
}

console.log(splitArray(arr, k));`,
      `arr, k = nums(1), num(2)

def split_array(arr, k):
    # your code here
    pass

print(split_array(arr, k))`,
    ),
    solution: solution(
      `const arr = nums(1), k = num(2);
function piecesNeeded(maxSum) {
  let pieces = 1, sum = 0;
  for (const x of arr) {
    if (sum + x > maxSum) { pieces++; sum = 0; }
    sum += x;
  }
  return pieces;
}
let lo = Math.max(...arr), hi = arr.reduce((a, b) => a + b, 0);
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (piecesNeeded(mid) <= k) hi = mid; else lo = mid + 1;
}
console.log(lo);`,
      `arr, k = nums(1), num(2)

def pieces_needed(max_sum):
    pieces, total = 1, 0
    for x in arr:
        if total + x > max_sum:
            pieces += 1
            total = 0
        total += x
    return pieces

lo, hi = max(arr), sum(arr)
while lo < hi:
    mid = (lo + hi) // 2
    if pieces_needed(mid) <= k:
        hi = mid
    else:
        lo = mid + 1
print(lo)`,
    ),
    testCases: [
      sample('5\n7 2 5 10 8\n2', '18'),
      sample('5\n1 2 3 4 5\n2', '9'),
      hidden('3\n1 4 4\n3', '4'),
      hidden('1\n5\n1', '5'),
      hidden('4\n1 1 1 1\n4', '1'),
      hidden('5\n2 3 1 1 4\n3', '5'),
    ],
  },

  {
    slug: 'h-index-ii',
    title: 'H-Index II',
    category: 'Binary Search',
    difficulty: 'MEDIUM',
    description:
      'Given a researcher\'s citation counts sorted ascending, find their h-index: the largest `h` such that at least `h` papers have `>= h` citations each.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted citation counts\n\n**Output**\nThe h-index.',
    descriptionHi:
      'Ek researcher ke citation counts ascending sorted diye hain. Uska h-index dhoondo: sabse bada `h` jahan kam se kam `h` papers ke paas `>= h` citations hon.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` sorted citation counts\n\n**Output**\nH-index.',
    examples: [
      { input: '5\n0 1 3 5 6', output: '3' },
      { input: '3\n1 2 100', output: '2' },
    ],
    constraints: ['1 <= n <= 10^5', 'Citations are sorted ascending'],
    hints: [
      'Because the array is sorted, the number of papers with at least `citations[i]` citations is exactly `n - i` (everything from index i to the end).',
      'The h-index condition becomes: find the smallest index i where `citations[i] >= n - i`.',
      'Binary search for that boundary directly, rather than trying every possible h value.',
    ],
    approach:
      'Binary search for the smallest index `i` such that `citations[i] >= n - i` (meaning at least `n - i` papers, namely all from `i` onward, have at least that many citations). The h-index is then `n - i`. If `citations[mid] >= n - mid`, that index (or an earlier one) could work, so search left; otherwise search right.',
    approachHi:
      'Sabse chhote index `i` ke liye binary search karo jahan `citations[i] >= n - i` ho (matlab kam se kam `n - i` papers, yaani `i` se aage ke saare, kam se kam utne citations rakhte hain). H-index phir `n - i` hai. Agar `citations[mid] >= n - mid`, wo index (ya usse pehle wala) kaam kar sakta hai, isliye left search karo; warna right.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Sortedness turns "how many papers have at least X citations" into a simple positional count (everything from some index to the end), which converts the h-index definition into a search for a single boundary index rather than an O(n) scan trying every candidate h — the boundary condition `citations[i] >= n - i` is monotonic (once true for some i, it stays true for every larger i, since citations only grow while n-i shrinks), which is exactly what makes it binary-searchable.',
    solutionExplanationHi:
      'Sorted hona "kitne papers ke paas kam se kam X citations hain" ko ek simple positional count bana deta hai (kisi index se aakhir tak sab kuch), jo h-index ki definition ko har candidate h try karne wale O(n) scan ke bajaye ek single boundary index ki search mein badal deta hai — boundary condition `citations[i] >= n - i` monotonic hai (ek baar kisi i ke liye true hone par, har bade i ke liye true rehta hai, kyunki citations badhte hain jabki n-i ghatta hai) — yahi cheez ise binary-searchable banati hai.',
    starter: starter(
      `const citations = nums(1);

function hIndex(citations) {
  // your code here
}

console.log(hIndex(citations));`,
      `citations = nums(1)

def h_index(citations):
    # your code here
    pass

print(h_index(citations))`,
    ),
    solution: solution(
      `const citations = nums(1);
const n = citations.length;
let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (citations[mid] >= n - mid) hi = mid - 1; else lo = mid + 1;
}
console.log(n - lo);`,
      `citations = nums(1)
n = len(citations)
lo, hi = 0, n - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if citations[mid] >= n - mid:
        hi = mid - 1
    else:
        lo = mid + 1
print(n - lo)`,
    ),
    testCases: [
      sample('5\n0 1 3 5 6', '3'),
      sample('3\n1 2 100', '2'),
      hidden('1\n0', '0'),
      hidden('1\n100', '1'),
      hidden('4\n0 0 0 0', '0'),
      hidden('6\n1 1 2 2 2 5', '2'),
    ],
  },

  {
    slug: 'peak-index-in-mountain-array',
    title: 'Peak Index in a Mountain Array',
    category: 'Binary Search',
    difficulty: 'EASY',
    description:
      'A "mountain array" strictly increases to a single peak, then strictly decreases. Find the index of that peak.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers forming a mountain array\n\n**Output**\nThe peak index.',
    descriptionHi:
      'Ek "mountain array" strictly increase hokar ek single peak tak jaata hai, phir strictly decrease karta hai. Us peak ka index dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers, ek mountain array banate hue\n\n**Output**\nPeak index.',
    examples: [
      { input: '3\n0 1 0', output: '1' },
      { input: '4\n0 2 1 0', output: '1' },
    ],
    constraints: ['3 <= n <= 10^4', 'The array strictly increases then strictly decreases (a true mountain)'],
    hints: [
      'Unlike the general Find Peak Element problem, here the array is guaranteed to have exactly one peak with a clean rise-then-fall shape.',
      'The same slope-direction binary search applies: compare `arr[mid]` to `arr[mid + 1]`.',
      'If still rising, the peak is to the right; if falling, the peak is at mid or to the left.',
    ],
    approach:
      'Binary search on the slope, exactly as in Find Peak Element: if `arr[mid] < arr[mid + 1]`, the array is still climbing, so search `[mid+1, hi]`; otherwise search `[lo, mid]`. Because the array is a guaranteed single mountain, this converges exactly on the one true peak.',
    approachHi:
      'Slope par binary search, bilkul Find Peak Element jaisa: agar `arr[mid] < arr[mid + 1]` hai, array abhi bhi chadh raha hai, isliye `[mid+1, hi]` search karo; warna `[lo, mid]` search karo. Chunki array guaranteed ek hi mountain hai, ye exactly usi ek asli peak par converge hota hai.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'This is a strictly easier special case of Find Peak Element: because there is guaranteed to be exactly one peak with a clean single rise followed by a single fall (no local bumps or plateaus), the same slope-direction binary search converges on THE peak with certainty, rather than merely *a* peak among possibly several.',
    solutionExplanationHi:
      'Ye Find Peak Element ka ek strictly aasan special case hai: chunki guarantee hai ki exactly ek peak hai — ek saaf rise ke baad ek saaf fall (koi local bumps ya plateaus nahi) — wahi slope-direction binary search certainty ke saath USI peak par converge hota hai, na ki sirf *kisi* peak par jab multiple ho sakte hon.',
    starter: starter(
      `const arr = nums(1);

function peakIndexInMountainArray(arr) {
  // your code here
}

console.log(peakIndexInMountainArray(arr));`,
      `arr = nums(1)

def peak_index_in_mountain_array(arr):
    # your code here
    pass

print(peak_index_in_mountain_array(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
let lo = 0, hi = arr.length - 1;
while (lo < hi) {
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] < arr[mid + 1]) lo = mid + 1; else hi = mid;
}
console.log(lo);`,
      `arr = nums(1)
lo, hi = 0, len(arr) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if arr[mid] < arr[mid + 1]:
        lo = mid + 1
    else:
        hi = mid
print(lo)`,
    ),
    testCases: [
      sample('3\n0 1 0', '1'),
      sample('4\n0 2 1 0', '1'),
      hidden('5\n0 1 2 1 0', '2'),
      hidden('3\n0 10 5', '1'),
      hidden('5\n1 2 3 4 0', '3'),
      hidden('5\n0 1 2 3 4', '4'),
    ],
  },
];
