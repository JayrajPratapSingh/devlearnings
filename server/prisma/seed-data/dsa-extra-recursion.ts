import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Recursion — expansion batch. Rounds out the category beyond the original
 * two (Fibonacci Number, Pow(x, n)) with the classic teaching recursions
 * (Tower of Hanoi, Ackermann, Josephus, base conversion) and foundational
 * recursive rewrites of operations usually done iteratively (sum, reverse,
 * sorted-check, palindrome-check), to build the "trust the recursive leap
 * of faith" muscle before Backtracking and Trees lean on it harder.
 */
export const dsaExtraRecursion: SeedProblem[] = [
  {
    slug: 'tower-of-hanoi',
    title: 'Tower of Hanoi',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      'Move `n` disks from peg A to peg C (using peg B as auxiliary), one disk at a time, never placing a larger disk on a smaller one. Print the sequence of moves.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nOne move per line, formatted as `from to` (using letters A, B, C).',
    descriptionHi:
      '`n` disks ko peg A se peg C tak move karo (peg B ko auxiliary ki tarah use karke), ek baar mein ek disk, kabhi bhi ek badi disk ko chhoti par mat rakho. Moves ki sequence print karo.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nHar line par ek move, `from to` format mein (letters A, B, C use karke).',
    examples: [
      { input: '1', output: 'A C' },
      { input: '2', output: 'A B\nA C\nB C' },
    ],
    constraints: ['1 <= n <= 10'],
    hints: [
      'Trust the recursive leap of faith: assume you already know how to move n-1 disks between any two pegs.',
      'To move n disks from A to C: move the top n-1 from A to B (using C as spare), move the last disk A to C, then move the n-1 disks from B to C (using A as spare).',
      'The base case is a single disk — just move it directly.',
    ],
    approach:
      'Recursive: `hanoi(n, from, to, via)`. Base case `n == 1`: print `from to`. Otherwise: `hanoi(n-1, from, via, to)`, then print `from to`, then `hanoi(n-1, via, to, from)`.',
    approachHi:
      'Recursive: `hanoi(n, from, to, via)`. Base case `n == 1`: `from to` print karo. Warna: `hanoi(n-1, from, via, to)`, phir `from to` print karo, phir `hanoi(n-1, via, to, from)`.',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'The recursive leap of faith is the entire trick: without ever thinking about HOW to move n-1 disks, just trust that the recursive call does it correctly (it is proven by induction on the base case), and the 3-step structure follows immediately — get everything except the biggest disk out of the way, move the biggest disk, then bring everything back on top of it. The 2^n - 1 move count comes directly from the recurrence T(n) = 2*T(n-1) + 1.',
    solutionExplanationHi:
      'Recursive leap of faith hi poora trick hai: n-1 disks ko KAISE move karna hai ye socho hi mat, bas trust karo ki recursive call use sahi se kar dega (base case par induction se proven hai), aur 3-step structure turant follow hoti hai — sabse badi disk ko chhod kar baaki sab raaste se hatao, sabse badi disk move karo, phir sab wapas uske upar le aao. 2^n - 1 move count seedha recurrence T(n) = 2*T(n-1) + 1 se aata hai.',
    starter: starter(
      `const n = num(0);
const moves = [];

function hanoi(n, from, to, via) {
  // push "from to" strings into the moves array
}

hanoi(n, 'A', 'C', 'B');
console.log(moves.join('\\n'));`,
      `n = num(0)
moves = []

def hanoi(n, src, dst, via):
    # append "src dst" strings into the moves list
    pass

hanoi(n, "A", "C", "B")
print("\\n".join(moves))`,
    ),
    solution: solution(
      `const n = num(0);
const moves = [];
function hanoi(n, from, to, via) {
  if (n === 1) { moves.push(from + ' ' + to); return; }
  hanoi(n - 1, from, via, to);
  moves.push(from + ' ' + to);
  hanoi(n - 1, via, to, from);
}
hanoi(n, 'A', 'C', 'B');
console.log(moves.join('\\n'));`,
      `n = num(0)
moves = []

def hanoi(n, src, dst, via):
    if n == 1:
        moves.append(f"{src} {dst}")
        return
    hanoi(n - 1, src, via, dst)
    moves.append(f"{src} {dst}")
    hanoi(n - 1, via, dst, src)

hanoi(n, "A", "C", "B")
print("\\n".join(moves))`,
    ),
    testCases: [
      sample('1', 'A C'),
      sample('2', 'A B\nA C\nB C'),
      hidden('3', 'A C\nA B\nC B\nA C\nB A\nB C\nA C'),
      hidden('4', 'A B\nA C\nB C\nA B\nC A\nC B\nA B\nA C\nB C\nB A\nC A\nB C\nA B\nA C\nB C'),
    ],
  },

  {
    slug: 'sum-of-array-recursive',
    title: 'Sum of Array (Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Compute the sum of all elements in an array using recursion (not a loop).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe sum.',
    descriptionHi:
      'Array ke saare elements ka sum recursion use karke nikalo (loop nahi).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSum.',
    examples: [
      { input: '5\n1 2 3 4 5', output: '15' },
      { input: '0\n', output: '0' },
    ],
    constraints: ['0 <= n <= 10^4'],
    hints: [
      'The base case is an empty array — its sum is 0.',
      'The recursive case: the sum of the whole array is its first element plus the sum of everything after it.',
      'Pass a starting index instead of slicing the array on every call, to avoid needless copying.',
    ],
    approach:
      'Recursive helper `sum(arr, i)`: base case `i === arr.length` returns 0; otherwise returns `arr[i] + sum(arr, i + 1)`.',
    approachHi:
      'Recursive helper `sum(arr, i)`: base case `i === arr.length` par 0 return karo; warna `arr[i] + sum(arr, i + 1)` return karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'This is the simplest possible instance of "recurse on a smaller version of the same problem": summing n elements reduces to one addition plus summing n-1 elements, bottoming out at the trivially true base case of summing zero elements. Passing an index instead of slicing the array (`arr.slice(1)`) avoids an O(n) copy at every level, which would otherwise silently turn an O(n) algorithm into O(n^2).',
    solutionExplanationHi:
      'Ye "same problem ke chhote version par recurse karo" ka sabse simple example hai: n elements ka sum, ek addition plus n-1 elements ke sum mein reduce ho jaata hai, aakhir mein zero elements ka sum karne wale trivially true base case tak pahunch kar. Array slice karne (`arr.slice(1)`) ke bajaye index pass karna har level par O(n) copy se bachaata hai, jo warna ek O(n) algorithm ko chupchaap O(n^2) bana deta.',
    starter: starter(
      `const arr = nums(1);

function sumArray(arr, i = 0) {
  // your code here
}

console.log(sumArray(arr));`,
      `arr = nums(1)

def sum_array(arr, i=0):
    # your code here
    pass

print(sum_array(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
function sumArray(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + sumArray(arr, i + 1);
}
console.log(sumArray(arr));`,
      `arr = nums(1)

def sum_array(arr, i=0):
    if i == len(arr):
        return 0
    return arr[i] + sum_array(arr, i + 1)

print(sum_array(arr))`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5', '15'),
      sample('0\n', '0'),
      hidden('1\n7', '7'),
      hidden('3\n-1 -2 -3', '-6'),
      hidden('4\n0 0 0 0', '0'),
      hidden('4\n10 20 30 40', '100'),
    ],
  },

  {
    slug: 'reverse-array-recursive',
    title: 'Reverse Array (Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Reverse an array using recursion (not a loop).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe reversed array, space-separated.',
    descriptionHi:
      'Ek array ko recursion use karke reverse karo (loop nahi).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nReversed array, space se separate.',
    examples: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1' },
      { input: '1\n7', output: '7' },
    ],
    constraints: ['0 <= n <= 10^4'],
    hints: [
      'The base case is an array of length 0 or 1 — already its own reverse.',
      'The reverse of the whole array is the reverse of everything after the first element, followed by the first element.',
      'Alternatively, recurse with two converging indices and swap in place.',
    ],
    approach:
      'Recursive: the reverse of an array equals (the reverse of everything after the first element) followed by the first element. Base case: an array of length `<= 1` is its own reverse.',
    approachHi:
      'Recursive: array ka reverse hai (first element ke baad sab kuch ka reverse) uske baad first element. Base case: length `<= 1` wala array khud apna reverse hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion depth (plus O(n) per level if slicing; O(1) extra if swapping in place with two indices)',
    solutionExplanation:
      'Peeling off the first element and appending it to the end of the recursively-reversed remainder is a direct restatement of what "reverse" means: everything that came after now comes before, in the same reversed relative order, and the original first element now belongs last. An in-place variant using two converging indices (swap ends, recurse inward) achieves the same result with O(1) extra space per call instead of building new arrays.',
    solutionExplanationHi:
      'Pehla element hata kar use recursively-reversed baaki hisse ke end mein jodna, "reverse" ka seedha matlab hai: jo pehle baad mein tha wo ab pehle aa jaata hai, usi reversed relative order mein, aur original first element ab aakhri belong karta hai. Do converging indices wala in-place variant (ends swap karo, andar recurse karo) wahi result deta hai, har call mein O(1) extra space ke saath, naye arrays banaye bina.',
    starter: starter(
      `const arr = nums(1);

function reverseArray(arr) {
  // return a new reversed array
  return arr;
}

console.log(reverseArray(arr).join(' '));`,
      `arr = nums(1)

def reverse_array(arr):
    # return a new reversed list
    return arr

print(" ".join(map(str, reverse_array(arr))))`,
    ),
    solution: solution(
      `function reverseArray(arr) {
  if (arr.length <= 1) return arr;
  return [...reverseArray(arr.slice(1)), arr[0]];
}
const arr = nums(1);
console.log(reverseArray(arr).join(' '));`,
      `def reverse_array(arr):
    if len(arr) <= 1:
        return arr
    return reverse_array(arr[1:]) + [arr[0]]

arr = nums(1)
print(" ".join(map(str, reverse_array(arr))))`,
    ),
    testCases: [
      sample('5\n1 2 3 4 5', '5 4 3 2 1'),
      sample('1\n7', '7'),
      hidden('0\n', ''),
      hidden('2\n1 2', '2 1'),
      hidden('4\n1 1 2 2', '2 2 1 1'),
      hidden('6\n-3 -2 -1 0 1 2', '2 1 0 -1 -2 -3'),
    ],
  },

  {
    slug: 'sum-of-digits-recursive',
    title: 'Sum of Digits (Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Compute the sum of the digits of a non-negative integer, using recursion.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe sum of the digits.',
    descriptionHi:
      'Ek non-negative integer ke digits ka sum, recursion use karke nikalo.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nDigits ka sum.',
    examples: [
      { input: '12345', output: '15' },
      { input: '0', output: '0' },
    ],
    constraints: ['0 <= n <= 10^18'],
    hints: [
      'The base case is a single-digit number — it is its own digit sum.',
      'The last digit of n is `n % 10`, and the remaining digits form `n / 10` (integer division).',
      'The digit sum of n is its last digit plus the digit sum of the rest.',
    ],
    approach:
      'Recursive: base case `n < 10` returns `n`. Otherwise, return `n % 10 + digitSum(Math.floor(n / 10))`.',
    approachHi:
      'Recursive: base case `n < 10` par `n` return karo. Warna, `n % 10 + digitSum(Math.floor(n / 10))` return karo.',
    timeComplexity: 'O(log n) — one call per digit',
    spaceComplexity: 'O(log n) recursion depth',
    solutionExplanation:
      'Integer division and modulo by 10 are exactly the operations that peel a number apart digit by digit from the right: `n % 10` isolates the last digit, and `n / 10` (truncated) is everything else, still a valid smaller instance of the exact same problem — which is what makes the recursion well-founded, since the argument strictly shrinks toward the single-digit base case every call.',
    solutionExplanationHi:
      'Integer division aur 10 se modulo exactly wahi operations hain jo kisi number ko right se digit-by-digit alag karte hain: `n % 10` aakhri digit isolate karta hai, aur `n / 10` (truncated) baaki sab kuch hai, jo abhi bhi usi problem ka ek valid, chhota instance hai — yahi cheez recursion ko well-founded banati hai, kyunki argument har call mein single-digit base case ki taraf strictly chhota hota jaata hai.',
    starter: starter(
      `const n = num(0);

function digitSum(n) {
  // your code here
}

console.log(digitSum(n));`,
      `n = num(0)

def digit_sum(n):
    # your code here
    pass

print(digit_sum(n))`,
    ),
    solution: solution(
      `function digitSum(n) {
  if (n < 10) return n;
  return (n % 10) + digitSum(Math.floor(n / 10));
}
const n = num(0);
console.log(digitSum(n));`,
      `def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

n = num(0)
print(digit_sum(n))`,
    ),
    testCases: [
      sample('12345', '15'),
      sample('0', '0'),
      hidden('9', '9'),
      hidden('100', '1'),
      hidden('999', '27'),
      hidden('1000000000000000000', '1'),
    ],
  },

  {
    slug: 'digital-root',
    title: 'Digital Root',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Repeatedly sum the digits of a non-negative integer until a single digit remains. Use recursion.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe digital root.',
    descriptionHi:
      'Ek non-negative integer ke digits ka sum baar-baar tab tak nikalo jab tak ek hi digit na bache. Recursion use karo.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nDigital root.',
    examples: [
      { input: '38', output: '2', explanation: '3+8=11, then 1+1=2.' },
      { input: '0', output: '0' },
    ],
    constraints: ['0 <= n <= 10^18'],
    hints: [
      'This directly reuses Sum of Digits (Recursive), applied repeatedly.',
      'The base case is already a single digit — no further summing needed.',
      'Compute one digit-sum pass, then recurse on the result.',
    ],
    approach:
      'Recursive: base case `n < 10` returns `n` directly. Otherwise, compute the digit sum of `n` in one pass, then recursively find the digital root of that sum.',
    approachHi:
      'Recursive: base case `n < 10` par seedha `n` return karo. Warna, `n` ka ek pass mein digit sum nikalo, phir us sum ka digital root recursively dhoondo.',
    timeComplexity: 'O(log n) for the first reduction; converges within a handful of further steps',
    spaceComplexity: 'O(log n) recursion depth',
    solutionExplanation:
      'This is recursion on top of recursion: the inner digit-summing step is exactly Sum of Digits (Recursive), and the outer loop-like behavior ("keep summing until one digit remains") is itself expressed recursively rather than with an explicit loop — the digital root recurses on its own output, which shrinks rapidly (any number\'s digit sum is at most 9 times its digit count), guaranteeing the base case is reached quickly.',
    solutionExplanationHi:
      'Ye recursion ke upar recursion hai: andar wala digit-summing step exactly Sum of Digits (Recursive) hai, aur bahar wala loop-jaisa behavior ("ek digit bachne tak sum karte raho") khud recursive tarike se express hota hai, explicit loop se nahi — digital root apne hi output par recurse karta hai, jo tezi se chhota hota jaata hai (kisi bhi number ka digit sum uske digit count ke 9 guna se zyada nahi ho sakta), isliye base case jaldi mil jaata hai.',
    starter: starter(
      `const n = num(0);

function digitalRoot(n) {
  // your code here
}

console.log(digitalRoot(n));`,
      `n = num(0)

def digital_root(n):
    # your code here
    pass

print(digital_root(n))`,
    ),
    solution: solution(
      `function digitSum(n) {
  if (n < 10) return n;
  return (n % 10) + digitSum(Math.floor(n / 10));
}
function digitalRoot(n) {
  if (n < 10) return n;
  return digitalRoot(digitSum(n));
}
const n = num(0);
console.log(digitalRoot(n));`,
      `def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

def digital_root(n):
    if n < 10:
        return n
    return digital_root(digit_sum(n))

n = num(0)
print(digital_root(n))`,
    ),
    testCases: [
      sample('38', '2'),
      sample('0', '0'),
      hidden('9', '9'),
      hidden('12345', '6'),
      hidden('999999999', '9'),
      hidden('493193', '2'),
    ],
  },

  {
    slug: 'gcd-recursive',
    title: 'GCD (Euclidean Algorithm, Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Compute the greatest common divisor of two non-negative integers using the recursive Euclidean algorithm.\n\n**Input**\n- Line 1: `a`\n- Line 2: `b`\n\n**Output**\n`gcd(a, b)`.',
    descriptionHi:
      'Do non-negative integers ka greatest common divisor, recursive Euclidean algorithm use karke nikalo.\n\n**Input**\n- Line 1: `a`\n- Line 2: `b`\n\n**Output**\n`gcd(a, b)`.',
    examples: [
      { input: '48\n18', output: '6' },
      { input: '17\n5', output: '1' },
    ],
    constraints: ['0 <= a, b <= 10^9', 'a and b are not both 0'],
    hints: [
      'The base case is `b == 0` — then the gcd is simply `a`.',
      'The key identity: gcd(a, b) = gcd(b, a % b).',
      'Every recursive step strictly shrinks the second argument, guaranteeing termination.',
    ],
    approach:
      'Recursive Euclidean algorithm: base case `b === 0` returns `a`; otherwise return `gcd(b, a % b)`.',
    approachHi:
      'Recursive Euclidean algorithm: base case `b === 0` par `a` return karo; warna `gcd(b, a % b)` return karo.',
    timeComplexity: 'O(log(min(a, b)))',
    spaceComplexity: 'O(log(min(a, b))) recursion depth',
    solutionExplanation:
      'The identity gcd(a, b) = gcd(b, a % b) holds because any common divisor of a and b must also divide a - k*b for any integer k, including a % b specifically — so the set of common divisors of (a, b) is identical to the set of common divisors of (b, a % b), meaning their greatest common divisors must match too. Because a % b is always strictly smaller than b, the second argument shrinks every call, and this shrinks surprisingly fast (roughly halving every two steps in the worst case), giving logarithmic depth rather than the linear depth naive repeated subtraction would need.',
    solutionExplanationHi:
      'Identity gcd(a, b) = gcd(b, a % b) isliye sahi hai kyunki a aur b ka koi bhi common divisor, kisi bhi integer k ke liye a - k*b ko bhi divide karta hai, specifically a % b ko bhi — isliye (a, b) ke common divisors ka set aur (b, a % b) ke common divisors ka set bilkul same hai, matlab unka greatest common divisor bhi match karega. Chunki a % b hamesha b se strictly chhota hota hai, second argument har call mein chhota hota hai, aur ye surprisingly fast chhota hota hai (worst case mein lagbhag har do steps mein aadha) — isse logarithmic depth milti hai, naive repeated subtraction ki linear depth ke bajaye.',
    starter: starter(
      `const a = num(0), b = num(1);

function gcd(a, b) {
  // your code here
}

console.log(gcd(a, b));`,
      `a, b = num(0), num(1)

def gcd(a, b):
    # your code here
    pass

print(gcd(a, b))`,
    ),
    solution: solution(
      `function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}
const a = num(0), b = num(1);
console.log(gcd(a, b));`,
      `def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

a, b = num(0), num(1)
print(gcd(a, b))`,
    ),
    testCases: [
      sample('48\n18', '6'),
      sample('17\n5', '1'),
      hidden('0\n5', '5'),
      hidden('5\n0', '5'),
      hidden('1000000000\n1', '1'),
      hidden('270\n192', '6'),
    ],
  },

  {
    slug: 'josephus-problem',
    title: 'The Josephus Problem',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      '`n` people (numbered `0` to `n-1`) stand in a circle. Starting from person `0`, count off `k` people repeatedly and eliminate the `k`-th one each time, continuing around the circle, until one person remains. Return that survivor\'s original number.\n\n**Input**\n- Line 1: `n`\n- Line 2: `k`\n\n**Output**\nThe survivor\'s 0-based position.',
    descriptionHi:
      '`n` log (0 se `n-1` tak numbered) ek circle mein khade hain. Person `0` se shuru karke, baar-baar `k` logon ko count karo aur har baar `k`-vaan person ko eliminate karo, circle mein aage badhte hue, jab tak sirf ek person na bache. Us survivor ka original number return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `k`\n\n**Output**\nSurvivor ki 0-based position.',
    examples: [
      { input: '5\n2', output: '2' },
      { input: '7\n3', output: '3' },
    ],
    constraints: ['1 <= n <= 10^5', '1 <= k <= 10^5'],
    hints: [
      'Simulating the circle with a real data structure works but is O(n*k) in the worst case.',
      'There is a famous O(n) recurrence: if J(n-1, k) is the survivor\'s position when starting the count at 0 in a circle of n-1 people, then J(n, k) = (J(n-1, k) + k) % n.',
      'The base case is a circle of 1 person: the survivor is trivially position 0.',
    ],
    approach:
      'Recursive recurrence: base case `n === 1` returns `0`. Otherwise, `josephus(n, k) = (josephus(n - 1, k) + k) % n` — solve the smaller circle of `n-1` people first, then shift the answer to account for the extra person.',
    approachHi:
      'Recursive recurrence: base case `n === 1` par `0` return karo. Warna, `josephus(n, k) = (josephus(n - 1, k) + k) % n` — pehle `n-1` logon wale chhote circle ko solve karo, phir extra person ko account karne ke liye answer shift karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'The recurrence encodes a clever relabeling trick: solve the problem for n-1 people first (as if the very first elimination had already happened and the circle had shrunk), getting a survivor position relative to that smaller circle\'s own numbering (which starts counting fresh from the position right after the first elimination) — then shift that answer by k positions and wrap around modulo n to translate it back into the ORIGINAL numbering of all n people. This is dramatically faster than literally simulating every elimination with a data structure, which costs O(n) per elimination in the worst case (O(n^2) total) rather than O(1) extra work per person here.',
    solutionExplanationHi:
      'Ye recurrence ek clever relabeling trick encode karta hai: pehle n-1 logon ke liye problem solve karo (jaise pehli elimination pehle hi ho chuki ho aur circle chhota ho gaya ho), us chhote circle ki apni numbering ke relative ek survivor position milta hai (jo pehli elimination ke turant baad wali position se fresh counting shuru karti hai) — phir us answer ko k positions se shift karo aur n modulo wrap around karo, taaki wo saare n logon ki ORIGINAL numbering mein wapas translate ho jaaye. Ye har elimination ko literally ek data structure se simulate karne se kaafi tez hai, jo worst case mein per-elimination O(n) (total O(n^2)) leta, yahan har person ke liye sirf O(1) extra kaam hai.',
    starter: starter(
      `const n = num(0), k = num(1);

function josephus(n, k) {
  // your code here
}

console.log(josephus(n, k));`,
      `n, k = num(0), num(1)

def josephus(n, k):
    # your code here
    pass

print(josephus(n, k))`,
    ),
    solution: solution(
      `function josephus(n, k) {
  if (n === 1) return 0;
  return (josephus(n - 1, k) + k) % n;
}
const n = num(0), k = num(1);
console.log(josephus(n, k));`,
      `def josephus(n, k):
    if n == 1:
        return 0
    return (josephus(n - 1, k) + k) % n

n, k = num(0), num(1)
print(josephus(n, k))`,
    ),
    testCases: [
      sample('5\n2', '2'),
      sample('7\n3', '3'),
      hidden('1\n5', '0'),
      hidden('2\n1', '1'),
      hidden('6\n1', '5'),
      hidden('10\n2', '4'),
    ],
  },

  {
    slug: 'ackermann-function',
    title: 'Ackermann Function',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      'Compute the Ackermann function `A(m, n)`, defined recursively as: `A(0, n) = n + 1`; `A(m, 0) = A(m-1, 1)` for `m > 0`; `A(m, n) = A(m-1, A(m, n-1))` for `m > 0, n > 0`. Inputs are kept small since this function grows explosively fast.\n\n**Input**\n- Line 1: `m`\n- Line 2: `n`\n\n**Output**\n`A(m, n)`.',
    descriptionHi:
      'Ackermann function `A(m, n)` compute karo, jo recursively define hoti hai: `A(0, n) = n + 1`; `A(m, 0) = A(m-1, 1)` (`m > 0` ke liye); `A(m, n) = A(m-1, A(m, n-1))` (`m > 0, n > 0` ke liye). Inputs chhote rakhe gaye hain kyunki ye function explosively fast badhta hai.\n\n**Input**\n- Line 1: `m`\n- Line 2: `n`\n\n**Output**\n`A(m, n)`.',
    examples: [
      { input: '2\n3', output: '9' },
      { input: '0\n5', output: '6' },
    ],
    constraints: ['0 <= m <= 3', '0 <= n <= 6'],
    hints: [
      'This function famously cannot be expressed with simple loops — it genuinely needs recursion (specifically, its growth requires a form of nested recursion no fixed number of loops can replicate).',
      'There are three cases, exactly matching the definition: m=0 is the trivial base case, m>0 with n=0 reduces m by recursing on a fixed n=1, and the general case nests a call to A inside another call to A.',
      'Watch the recursion depth: even small inputs like A(3, 6) involve a genuinely large number of nested calls, which is the entire point of the exercise.',
    ],
    approach:
      'Direct translation of the three-case recursive definition. Base case `m === 0` returns `n + 1`. If `n === 0`, return `A(m - 1, 1)`. Otherwise, return `A(m - 1, A(m, n - 1))` — a call to A nested inside another call to A.',
    approachHi:
      'Teen-case recursive definition ka seedha translation. Base case `m === 0` par `n + 1` return karo. Agar `n === 0`, `A(m - 1, 1)` return karo. Warna, `A(m - 1, A(m, n - 1))` return karo — ek A call doosre A call ke andar nested.',
    timeComplexity: 'Not expressible in elementary terms — grows faster than any exponential or tower function',
    spaceComplexity: 'Recursion depth can be extremely large even for small inputs',
    solutionExplanation:
      'The Ackermann function is the textbook example of a total computable function that is NOT primitive recursive — meaning it provably cannot be rewritten using only for-loops with fixed bounds, no matter how cleverly nested, and genuinely requires unbounded recursion (or an equivalent explicit stack) to compute. The innermost case, `A(m-1, A(m, n-1))`, is where the explosive growth comes from: the recursive call\'s RESULT becomes an argument to another recursive call, compounding depth on top of depth in a way ordinary loop-based iteration structures cannot mimic without manually managing a stack.',
    solutionExplanationHi:
      'Ackermann function ek textbook example hai ek aise total computable function ka jo primitive recursive NAHI hai — matlab ye provably sirf fixed-bound wale for-loops se, chahe kitna bhi cleverly nest kiya jaaye, dobara likha nahi ja sakta, aur genuinely unbounded recursion (ya uske barabar ek explicit stack) chahiye. Sabse andar wala case, `A(m-1, A(m, n-1))`, hi explosive growth ka source hai: recursive call ka RESULT khud ek doosre recursive call ka argument ban jaata hai, depth par depth compound karte hue, jo normal loop-based iteration structures bina manually stack manage kiye mimic nahi kar sakte.',
    starter: starter(
      `const m = num(0), n = num(1);

function ackermann(m, n) {
  // your code here
}

console.log(ackermann(m, n));`,
      `m, n = num(0), num(1)

def ackermann(m, n):
    # your code here
    pass

print(ackermann(m, n))`,
    ),
    solution: solution(
      `function ackermann(m, n) {
  if (m === 0) return n + 1;
  if (n === 0) return ackermann(m - 1, 1);
  return ackermann(m - 1, ackermann(m, n - 1));
}
const m = num(0), n = num(1);
console.log(ackermann(m, n));`,
      `import sys
sys.setrecursionlimit(100000)

def ackermann(m, n):
    if m == 0:
        return n + 1
    if n == 0:
        return ackermann(m - 1, 1)
    return ackermann(m - 1, ackermann(m, n - 1))

m, n = num(0), num(1)
print(ackermann(m, n))`,
    ),
    testCases: [
      sample('2\n3', '9'),
      sample('0\n5', '6'),
      hidden('1\n0', '2'),
      hidden('1\n4', '6'),
      hidden('3\n3', '61'),
      hidden('2\n0', '3'),
    ],
  },

  {
    slug: 'kth-symbol-in-grammar',
    title: 'K-th Symbol in Grammar',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      'Row 1 is `"0"`. Each subsequent row is built by replacing every `0` in the previous row with `01`, and every `1` with `10`. Given `n` and `k` (1-indexed), find the `k`-th symbol in row `n`, without building the whole row.\n\n**Input**\n- Line 1: `n`\n- Line 2: `k`\n\n**Output**\nThe symbol (0 or 1).',
    descriptionHi:
      'Row 1 `"0"` hai. Har agli row, pichli row ke har `0` ko `01` se aur har `1` ko `10` se replace karke banti hai. `n` aur `k` (1-indexed) diye hain, row `n` ka `k`-vaan symbol dhoondo, poori row banaye bina.\n\n**Input**\n- Line 1: `n`\n- Line 2: `k`\n\n**Output**\nSymbol (0 ya 1).',
    examples: [
      { input: '1\n1', output: '0' },
      { input: '2\n2', output: '1' },
    ],
    constraints: ['1 <= n <= 30', '1 <= k <= 2^(n-1)'],
    hints: [
      'Row n has 2^(n-1) symbols, and it is exactly two back-to-back copies of a transformation of row n-1.',
      'Every symbol in the second half of row n is a "flip" of the corresponding symbol in the first half.',
      'Recurse: find the answer for the corresponding position in row n-1, then flip it if k landed in the second half.',
    ],
    approach:
      'Recursive: base case `n === 1` returns `0`. Otherwise, let `mid = 2^(n-2)` (half the length of row n). If `k <= mid`, the answer is the same as `kthSymbol(n-1, k)`. If `k > mid`, the answer is the FLIP of `kthSymbol(n-1, k - mid)`, since the second half of any row is the bitwise complement of the first half.',
    approachHi:
      'Recursive: base case `n === 1` par `0` return karo. Warna, `mid = 2^(n-2)` (row n ki aadhi length) lo. Agar `k <= mid`, answer `kthSymbol(n-1, k)` ke barabar hai. Agar `k > mid`, answer `kthSymbol(n-1, k - mid)` ka FLIP hai, kyunki kisi bhi row ka doosra half pehle half ka bitwise complement hota hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'Because the transformation rule (0 -> 01, 1 -> 10) applies independently to each symbol, row n is literally row n-1 with every symbol expanded into a 2-symbol pair — which means row n\'s first half is exactly row n-1 (each symbol expanded into its own first output symbol), and row n\'s second half is row n-1 with every symbol flipped (each symbol expanded into its own second, complementary output symbol). Recursing on that structural self-similarity finds any single symbol in O(n) time and space, without ever constructing a string of length 2^(n-1).',
    solutionExplanationHi:
      'Chunki transformation rule (0 -> 01, 1 -> 10) har symbol par independently apply hota hai, row n literally row n-1 hi hai jismein har symbol 2-symbol pair mein expand hua hai — matlab row n ka pehla half exactly row n-1 hai (har symbol apne pehle output symbol mein expand hua), aur row n ka doosra half row n-1 ka flipped version hai (har symbol apne doosre, complementary output symbol mein expand hua). Is structural self-similarity par recurse karna kisi bhi single symbol ko O(n) time aur space mein dhoond leta hai, 2^(n-1) length ki string banaye bina.',
    starter: starter(
      `const n = num(0), k = num(1);

function kthGrammar(n, k) {
  // your code here
}

console.log(kthGrammar(n, k));`,
      `n, k = num(0), num(1)

def kth_grammar(n, k):
    # your code here
    pass

print(kth_grammar(n, k))`,
    ),
    solution: solution(
      `function kthGrammar(n, k) {
  if (n === 1) return 0;
  const mid = 1 << (n - 2);
  if (k <= mid) return kthGrammar(n - 1, k);
  const parent = kthGrammar(n - 1, k - mid);
  return parent === 0 ? 1 : 0;
}
const n = num(0), k = num(1);
console.log(kthGrammar(n, k));`,
      `def kth_grammar(n, k):
    if n == 1:
        return 0
    mid = 1 << (n - 2)
    if k <= mid:
        return kth_grammar(n - 1, k)
    parent = kth_grammar(n - 1, k - mid)
    return 1 if parent == 0 else 0

n, k = num(0), num(1)
print(kth_grammar(n, k))`,
    ),
    testCases: [
      sample('1\n1', '0'),
      sample('2\n2', '1'),
      hidden('2\n1', '0'),
      hidden('4\n5', '1'),
      hidden('4\n1', '0'),
      hidden('3\n3', '1'),
    ],
  },

  {
    slug: 'flatten-nested-list',
    title: 'Flatten a Nested List',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      'Given a nested list written as bracket notation with single-digit values (e.g. `[1,[2,3],[4,[5,6]]]`), flatten it into a single sequence of values, in order, using recursion to parse and traverse the structure.\n\n**Input**\nOne line containing the bracket-notation nested list.\n\n**Output**\nThe flattened values, space-separated.',
    descriptionHi:
      'Bracket notation mein likhi ek nested list di hai, single-digit values ke saath (jaise `[1,[2,3],[4,[5,6]]]`). Use ek single sequence mein flatten karo, order mein, recursion use karke structure parse aur traverse karte hue.\n\n**Input**\nEk line jisme bracket-notation nested list hai.\n\n**Output**\nFlattened values, space se separate.',
    examples: [
      { input: '[1,[2,3],[4,[5,6]]]', output: '1 2 3 4 5 6' },
      { input: '[1,2,3]', output: '1 2 3' },
    ],
    constraints: ['1 <= length <= 200', 'Values are single digits 0-9'],
    hints: [
      'A `[` opens a new nested list — recursively parse everything until its matching `]`.',
      'A digit is a value to collect directly.',
      'Track a single shared position pointer as you parse, so nested recursive calls naturally pick up where the outer call left off.',
    ],
    approach:
      'Recursive-descent parser with a shared position pointer. On seeing `[`, advance past it and recursively parse the contents (which may include further nested `[...]` groups) until the matching `]`, collecting every digit encountered along the way; commas are simply skipped.',
    approachHi:
      'Ek shared position pointer ke saath recursive-descent parser. `[` dekhte hi, usse aage badho aur contents ko recursively parse karo (jinmein aur nested `[...]` groups ho sakte hain) jab tak matching `]` na mile, raaste mein har digit collect karte hue; commas ko simply skip karo.',
    timeComplexity: 'O(length of the input string)',
    spaceComplexity: 'O(depth of nesting) recursion depth, O(total values) for the output',
    solutionExplanation:
      'Bracket notation is inherently recursive in its own grammar — a "list" is defined as a sequence of either values or other lists — so a parser that mirrors that grammar exactly (recursing into a sublist the moment `[` is seen, returning control to the caller the moment the matching `]` is found) naturally handles arbitrary nesting depth without any special-casing. Sharing one position pointer across all recursive calls (rather than each call working on its own substring) is what lets a nested call\'s progress be visible to its caller once it returns, so the caller resumes scanning exactly where the nested call left off.',
    solutionExplanationHi:
      'Bracket notation apni grammar mein hi inherently recursive hai — ek "list" values ya doosri lists ki ek sequence ki tarah define hoti hai — isliye ek parser jo us grammar ko exactly mirror kare (`[` dikhte hi sublist mein recurse karo, matching `]` milte hi caller ko control wapas do), kisi bhi arbitrary nesting depth ko bina special-casing ke naturally handle kar leta hai. Saare recursive calls mein ek hi position pointer share karna (har call apne alag substring par kaam karne ke bajaye) matlab ek nested call ki progress uske caller ko return hote hi visible ho jaati hai, isliye caller exactly wahin se scanning resume karta hai jahan nested call ne chhoda tha.',
    starter: starter(
      `const s = line(0);
let pos = 0;

function parse() {
  const values = [];
  // your code here: parse characters starting at global "pos" until the matching ']'
  return values;
}

// skip the outer '['
pos = 1;
console.log(parse().join(' '));`,
      `s = line(0)
pos = [1]  # skip the outer '['


def parse():
    values = []
    # your code here: parse characters starting at pos[0] until the matching ']'
    return values


print(" ".join(map(str, parse())))`,
    ),
    solution: solution(
      `const s = line(0);
let pos = 1;
function parse() {
  const values = [];
  while (s[pos] !== ']') {
    if (s[pos] === ',') { pos++; continue; }
    if (s[pos] === '[') { pos++; values.push(...parse()); continue; }
    values.push(Number(s[pos]));
    pos++;
  }
  pos++;
  return values;
}
console.log(parse().join(' '));`,
      `s = line(0)
pos = 1


def parse():
    global pos
    values = []
    while s[pos] != "]":
        if s[pos] == ",":
            pos += 1
            continue
        if s[pos] == "[":
            pos += 1
            values.extend(parse())
            continue
        values.append(int(s[pos]))
        pos += 1
    pos += 1
    return values


print(" ".join(map(str, parse())))`,
    ),
    testCases: [
      sample('[1,[2,3],[4,[5,6]]]', '1 2 3 4 5 6'),
      sample('[1,2,3]', '1 2 3'),
      hidden('[[1,2],[3,4]]', '1 2 3 4'),
      hidden('[1]', '1'),
      hidden('[[[1]]]', '1'),
      hidden('[1,[2,[3,[4,[5]]]]]', '1 2 3 4 5'),
    ],
  },

  {
    slug: 'convert-number-to-base-recursive',
    title: 'Convert Number to Base (Recursive)',
    category: 'Recursion',
    difficulty: 'MEDIUM',
    description:
      'Convert a non-negative decimal integer to its representation in a given base (2 to 16), using recursion. Use digits `0-9` then uppercase `A-F` for bases above 10.\n\n**Input**\n- Line 1: `n`\n- Line 2: `base`\n\n**Output**\n`n` written in the given base.',
    descriptionHi:
      'Ek non-negative decimal integer ko diye gaye base (2 se 16) mein convert karo, recursion use karke. 10 se zyada bases ke liye digits `0-9` phir uppercase `A-F` use karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `base`\n\n**Output**\n`n`, diye gaye base mein.',
    examples: [
      { input: '255\n16', output: 'FF' },
      { input: '10\n2', output: '1010' },
    ],
    constraints: ['0 <= n <= 10^9', '2 <= base <= 16'],
    hints: [
      'The base case is `n < base` — a single digit is its own representation.',
      'Otherwise, the representation of n is the representation of `n / base` (integer division) followed by the single digit `n % base`.',
      'Map digit values 10-15 to the letters A-F.',
    ],
    approach:
      'Recursive: base case `n < base` returns the single-character digit for `n`. Otherwise, return `convert(n / base, base) + digit(n % base)` — recursively convert everything except the last digit, then append the last digit.',
    approachHi:
      'Recursive: base case `n < base` par `n` ka single-character digit return karo. Warna, `convert(n / base, base) + digit(n % base)` return karo — last digit ke alawa sab kuch recursively convert karo, phir last digit append karo.',
    timeComplexity: 'O(log_base(n))',
    spaceComplexity: 'O(log_base(n)) recursion depth',
    solutionExplanation:
      'This mirrors Sum of Digits (Recursive) structurally — `n % base` peels off the last digit in the target base, `n / base` is everything else, still the same problem in miniature — except here the peeled digits must be assembled back into a STRING in the correct left-to-right order, which is why the recursive call\'s result is placed BEFORE (not after) the newly peeled digit: the recursive call handles all the more-significant digits, which belong to the left.',
    solutionExplanationHi:
      'Ye structurally Sum of Digits (Recursive) jaisa hi hai — `n % base` target base mein last digit alag karta hai, `n / base` baaki sab kuch hai, abhi bhi wahi problem chhote roop mein — bas yahan peeled digits ko sahi left-to-right order mein ek STRING mein wapas jodna hota hai, isi wajah se recursive call ka result naye peeled digit se PEHLE (baad mein nahi) rakha jaata hai: recursive call saare zyada-significant digits handle karta hai, jo left mein belong karte hain.',
    starter: starter(
      `const n = num(0), base = num(1);
const DIGITS = '0123456789ABCDEF';

function convertBase(n, base) {
  // your code here
}

console.log(convertBase(n, base));`,
      `n, base = num(0), num(1)
DIGITS = "0123456789ABCDEF"

def convert_base(n, base):
    # your code here
    pass

print(convert_base(n, base))`,
    ),
    solution: solution(
      `const DIGITS = '0123456789ABCDEF';
function convertBase(n, base) {
  if (n < base) return DIGITS[n];
  return convertBase(Math.floor(n / base), base) + DIGITS[n % base];
}
const n = num(0), base = num(1);
console.log(convertBase(n, base));`,
      `DIGITS = "0123456789ABCDEF"

def convert_base(n, base):
    if n < base:
        return DIGITS[n]
    return convert_base(n // base, base) + DIGITS[n % base]

n, base = num(0), num(1)
print(convert_base(n, base))`,
    ),
    testCases: [
      sample('255\n16', 'FF'),
      sample('10\n2', '1010'),
      hidden('0\n5', '0'),
      hidden('9\n10', '9'),
      hidden('100\n16', '64'),
      hidden('7\n2', '111'),
    ],
  },

  {
    slug: 'multiply-two-numbers-recursive',
    title: 'Multiply Two Numbers (Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Compute the product of two non-negative integers using recursion (repeated addition or Russian peasant doubling), not the built-in multiplication operator.\n\n**Input**\n- Line 1: `a`\n- Line 2: `b`\n\n**Output**\n`a * b`.',
    descriptionHi:
      'Do non-negative integers ka product, recursion use karke (repeated addition ya Russian peasant doubling) nikalo, built-in multiplication operator use kiye bina.\n\n**Input**\n- Line 1: `a`\n- Line 2: `b`\n\n**Output**\n`a * b`.',
    examples: [
      { input: '5\n6', output: '30' },
      { input: '0\n100', output: '0' },
    ],
    constraints: ['0 <= a, b <= 10^6'],
    hints: [
      'Plain repeated addition (recurse b times, adding a each time) is O(b) — correct but slow for large b.',
      'Russian peasant multiplication is faster: a * b = 2*(a * (b/2)) when b is even, or a + a*(b-1) when b is odd.',
      'The base case is b = 0, where the product is 0.',
    ],
    approach:
      'Russian peasant recursion. Base case `b === 0` returns `0`. If `b` is even, return `2 * multiply(a, b / 2)`. If `b` is odd, return `a + multiply(a, b - 1)`.',
    approachHi:
      'Russian peasant recursion. Base case `b === 0` par `0` return karo. Agar `b` even hai, `2 * multiply(a, b / 2)` return karo. Agar `b` odd hai, `a + multiply(a, b - 1)` return karo.',
    timeComplexity: 'O(log b)',
    spaceComplexity: 'O(log b) recursion depth',
    solutionExplanation:
      'Plain repeated addition treats multiplication as b separate additions, giving O(b) recursive calls — fine for small b but needlessly slow. Halving b whenever it is even (and folding the halving into a doubled result) is the same "divide and conquer the exponent/multiplier" trick used in fast exponentiation: a*b = (a*2)*(b/2) = a*(b/2)*2, so working with half as many additions but twice the value per addition reaches the same total in about log2(b) steps instead of b steps. The odd case simply peels off one addition to make the remainder even again.',
    solutionExplanationHi:
      'Plain repeated addition multiplication ko b alag additions ki tarah treat karta hai, jisse O(b) recursive calls milte hain — chhote b ke liye theek hai par bina wajah slow. b even hone par use aadha karna (aur us halving ko doubled result mein fold karna) wahi "divide and conquer the exponent/multiplier" trick hai jo fast exponentiation mein use hoti hai: a*b = (a*2)*(b/2) = a*(b/2)*2, isliye aadhi additions ke saath par har addition ki value double karke, wahi total lagbhag log2(b) steps mein milta hai, b steps ke bajaye. Odd case sirf ek addition alag karke remainder ko wapas even bana deta hai.',
    starter: starter(
      `const a = num(0), b = num(1);

function multiply(a, b) {
  // your code here
}

console.log(multiply(a, b));`,
      `a, b = num(0), num(1)

def multiply(a, b):
    # your code here
    pass

print(multiply(a, b))`,
    ),
    solution: solution(
      `function multiply(a, b) {
  if (b === 0) return 0;
  if (b % 2 === 0) return 2 * multiply(a, b / 2);
  return a + multiply(a, b - 1);
}
const a = num(0), b = num(1);
console.log(multiply(a, b));`,
      `def multiply(a, b):
    if b == 0:
        return 0
    if b % 2 == 0:
        return 2 * multiply(a, b // 2)
    return a + multiply(a, b - 1)

a, b = num(0), num(1)
print(multiply(a, b))`,
    ),
    testCases: [
      sample('5\n6', '30'),
      sample('0\n100', '0'),
      hidden('1\n1', '1'),
      hidden('7\n0', '0'),
      hidden('1000\n1000', '1000000'),
      hidden('13\n17', '221'),
    ],
  },

  {
    slug: 'is-array-sorted-recursive',
    title: 'Is Array Sorted (Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Determine whether an array is sorted in non-decreasing order, using recursion (not a loop).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki ek array non-decreasing order mein sorted hai ya nahi, recursion use karke (loop nahi).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '4\n1 2 2 3', output: 'true' },
      { input: '3\n3 1 2', output: 'false' },
    ],
    constraints: ['0 <= n <= 10^4'],
    hints: [
      'The base case is an array of length 0 or 1 — trivially sorted.',
      'The array is sorted exactly when its first two elements are in order AND everything from the second element onward is itself sorted.',
      'Pass a starting index instead of slicing, to avoid needless copying at every level.',
    ],
    approach:
      'Recursive: base case `i === arr.length - 1` (or fewer than 2 elements remain) returns `true`. Otherwise, return `arr[i] <= arr[i+1] && isSorted(arr, i + 1)` — the whole array is sorted only if the current adjacent pair is in order AND the rest of the array (checked recursively) is also sorted.',
    approachHi:
      'Recursive: base case `i === arr.length - 1` (ya 2 se kam elements bache hon) par `true` return karo. Warna, `arr[i] <= arr[i+1] && isSorted(arr, i + 1)` return karo — poora array tabhi sorted hai jab current adjacent pair order mein ho AUR baaki array (recursively checked) bhi sorted ho.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'This is a direct application of structural induction: an array is sorted if and only if its first pair is in order and the sub-array starting from the second element is itself sorted — recursively checking that sub-array reduces the problem by exactly one element each call, and the `&&` short-circuits the moment any single adjacent pair is found out of order, avoiding wasted work on the rest of the array once the answer is already known to be false.',
    solutionExplanationHi:
      'Ye structural induction ka seedha application hai: ek array sorted hai agar aur sirf agar uska pehla pair order mein ho aur doosre element se shuru hone wala sub-array khud sorted ho — us sub-array ko recursively check karna har call mein problem ko exactly ek element se chhota kar deta hai, aur `&&` kisi bhi ek adjacent pair ke out-of-order milte hi short-circuit ho jaata hai, jaise hi answer false pata chal jaaye, baaki array par kaam waste nahi hota.',
    starter: starter(
      `const arr = nums(1);

function isSorted(arr, i = 0) {
  // your code here
}

console.log(isSorted(arr));`,
      `arr = nums(1)

def is_sorted(arr, i=0):
    # your code here
    pass

print("true" if is_sorted(arr) else "false")`,
    ),
    solution: solution(
      `function isSorted(arr, i = 0) {
  if (i >= arr.length - 1) return true;
  return arr[i] <= arr[i + 1] && isSorted(arr, i + 1);
}
const arr = nums(1);
console.log(isSorted(arr));`,
      `def is_sorted(arr, i=0):
    if i >= len(arr) - 1:
        return True
    return arr[i] <= arr[i + 1] and is_sorted(arr, i + 1)

arr = nums(1)
print("true" if is_sorted(arr) else "false")`,
    ),
    testCases: [
      sample('4\n1 2 2 3', 'true'),
      sample('3\n3 1 2', 'false'),
      hidden('0\n', 'true'),
      hidden('1\n5', 'true'),
      hidden('2\n2 1', 'false'),
      hidden('5\n1 1 1 1 1', 'true'),
    ],
  },

  {
    slug: 'is-palindrome-string-recursive',
    title: 'Is Palindrome String (Recursive)',
    category: 'Recursion',
    difficulty: 'EASY',
    description:
      'Determine whether a string reads exactly the same forward and backward (case-sensitive, no cleaning), using recursion.\n\n**Input**\nOne line containing the string.\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Check karo ki string exactly forward aur backward same padhi jaati hai ya nahi (case-sensitive, koi cleaning nahi), recursion use karke.\n\n**Input**\nEk line jisme string hai.\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: 'racecar', output: 'true' },
      { input: 'hello', output: 'false' },
    ],
    constraints: ['0 <= length <= 10^4'],
    hints: [
      'The base case is a string of length 0 or 1 — trivially a palindrome.',
      'A string is a palindrome exactly when its first and last characters match AND everything strictly between them is itself a palindrome.',
      'Pass left and right index bounds instead of slicing the string on every call.',
    ],
    approach:
      'Recursive with two index bounds `left` and `right`. Base case `left >= right` returns `true`. Otherwise, return `s[left] === s[right] && isPalindrome(s, left + 1, right - 1)`.',
    approachHi:
      'Do index bounds `left` aur `right` ke saath recursive. Base case `left >= right` par `true` return karo. Warna, `s[left] === s[right] && isPalindrome(s, left + 1, right - 1)` return karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) recursion depth',
    solutionExplanation:
      'This mirrors the two-pointer palindrome check\'s logic, but expresses the "converge inward" motion as recursive calls instead of a while-loop: a string is a palindrome exactly when its outermost characters match and the strictly-inner substring (a smaller instance of the exact same problem) is also a palindrome, bottoming out once the bounds meet or cross with nothing left to check. Passing index bounds rather than actual substrings avoids the O(n) copy cost of slicing at every one of the O(n) recursive levels.',
    solutionExplanationHi:
      'Ye two-pointer palindrome check wali hi logic hai, bas "andar converge karna" wali motion ko while-loop ke bajaye recursive calls se express karta hai: ek string palindrome hai agar uske sabse bahar wale characters match karein aur strictly-inner substring (bilkul usi problem ka ek chhota instance) bhi palindrome ho, aakhir mein bounds milne ya cross hone par check karne ko kuch nahi bachta. Actual substrings ke bajaye index bounds pass karna, O(n) recursive levels mein se har ek par slicing ke O(n) copy cost se bachaata hai.',
    starter: starter(
      `const s = line(0);

function isPalindrome(s, left = 0, right = s.length - 1) {
  // your code here
}

console.log(isPalindrome(s));`,
      `s = line(0)

def is_palindrome(s, left=0, right=None):
    if right is None:
        right = len(s) - 1
    # your code here
    pass

print("true" if is_palindrome(s) else "false")`,
    ),
    solution: solution(
      `function isPalindrome(s, left = 0, right = s.length - 1) {
  if (left >= right) return true;
  return s[left] === s[right] && isPalindrome(s, left + 1, right - 1);
}
const s = line(0);
console.log(isPalindrome(s));`,
      `def is_palindrome(s, left=0, right=None):
    if right is None:
        right = len(s) - 1
    if left >= right:
        return True
    return s[left] == s[right] and is_palindrome(s, left + 1, right - 1)

s = line(0)
print("true" if is_palindrome(s) else "false")`,
    ),
    testCases: [
      sample('racecar', 'true'),
      sample('hello', 'false'),
      hidden('', 'true'),
      hidden('a', 'true'),
      hidden('aa', 'true'),
      hidden('ab', 'false'),
    ],
  },
];
