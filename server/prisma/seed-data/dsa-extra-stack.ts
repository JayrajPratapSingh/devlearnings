import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Stack — expansion batch. Rounds out the category beyond the original two
 * (Valid Parentheses, Next Greater Element) with the monotonic-stack family
 * (Daily Temperatures, Largest Rectangle, Sum of Subarray Minimums),
 * expression evaluation, and the classic stack-based design problems.
 */
export const dsaExtraStack: SeedProblem[] = [
  {
    slug: 'min-stack',
    title: 'Min Stack',
    category: 'Stack',
    difficulty: 'EASY',
    description:
      'Design a stack that supports `push x`, `pop`, `top`, and `getMin` (return the current minimum), all in O(1) time. Process a sequence of operations and print the result of every `top` and `getMin` call.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: one operation each (`push x`, `pop`, `top`, or `getMin`)\n\n**Output**\nOne line for every `top` or `getMin` operation, in order.',
    descriptionHi:
      'Ek aisa stack design karo jo `push x`, `pop`, `top`, aur `getMin` (current minimum return kare) support kare — sab O(1) time mein. Operations ki sequence process karo aur har `top` aur `getMin` call ka result print karo.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: har ek operation (`push x`, `pop`, `top`, ya `getMin`)\n\n**Output**\nHar `top` ya `getMin` operation ke liye ek line, order mein.',
    examples: [
      {
        input: '7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin',
        output: '-3\n0\n-2',
      },
    ],
    constraints: ['1 <= q <= 3*10^4', '`pop`, `top`, and `getMin` are never called on an empty stack'],
    hints: [
      'A plain stack alone cannot answer getMin in O(1) — recomputing the minimum on demand costs O(n).',
      'Maintain a second, parallel stack that tracks the minimum-so-far at each depth.',
      'Push the new minimum (either the incoming value or the previous minimum, whichever is smaller) onto the min-stack on every push, and pop both stacks together.',
    ],
    approach:
      'Keep two stacks in lockstep: the main stack of values, and a min-stack where each entry is the minimum of everything pushed so far at that depth. On push, also push `min(value, currentMin)` onto the min-stack. On pop, pop both stacks together. `getMin` is just the top of the min-stack.',
    approachHi:
      'Do stacks saath rakho: values ka main stack, aur ek min-stack jahan har entry us depth tak ka minimum hai. Push par, min-stack par bhi `min(value, currentMin)` push karo. Pop par, dono stacks ek saath pop karo. `getMin` bas min-stack ka top hai.',
    timeComplexity: 'O(1) per operation',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The trick is realizing the minimum only ever needs to be tracked *per depth*, not recomputed globally: by pushing the running minimum onto a parallel stack at the exact same time as the real value, popping the main stack automatically "forgets" the right minimum too, since the min-stack\'s new top is exactly what the minimum was before the popped value was pushed.',
    solutionExplanationHi:
      'Trick ye hai ki minimum ko sirf *har depth ke hisaab se* track karna hai, globally recompute nahi karna — real value ke saath hi ek parallel stack par running minimum push karke, main stack pop karte hi sahi minimum bhi apne aap "bhool" jaata hai, kyunki min-stack ka naya top exactly wahi hai jo popped value push hone se pehle minimum tha.',
    starter: starter(
      `const q = num(0);

// Implement push/pop/top/getMin using two arrays as stacks, then process the operations.
const stack = [];
const minStack = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  // your code here: handle "push", "pop", "top", "getMin"
}
console.log(out.join('\\n'));`,
      `q = num(0)

# Implement push/pop/top/getMin using two lists as stacks, then process the operations.
stack = []
min_stack = []
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    # your code here: handle "push", "pop", "top", "getMin"

print("\\n".join(out))`,
    ),
    solution: solution(
      `const q = num(0);
const stack = [];
const minStack = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  if (op === 'push') {
    const x = Number(parts[1]);
    stack.push(x);
    minStack.push(minStack.length === 0 ? x : Math.min(x, minStack[minStack.length - 1]));
  } else if (op === 'pop') {
    stack.pop();
    minStack.pop();
  } else if (op === 'top') {
    out.push(String(stack[stack.length - 1]));
  } else if (op === 'getMin') {
    out.push(String(minStack[minStack.length - 1]));
  }
}
console.log(out.join('\\n'));`,
      `q = num(0)
stack = []
min_stack = []
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    if op == "push":
        x = int(parts[1])
        stack.append(x)
        min_stack.append(x if not min_stack else min(x, min_stack[-1]))
    elif op == "pop":
        stack.pop()
        min_stack.pop()
    elif op == "top":
        out.append(str(stack[-1]))
    elif op == "getMin":
        out.append(str(min_stack[-1]))
print("\\n".join(out))`,
    ),
    testCases: [
      sample('7\npush -2\npush 0\npush -3\ngetMin\npop\ntop\ngetMin', '-3\n0\n-2'),
      hidden('3\npush 1\npush 2\ngetMin', '1'),
      hidden('4\npush 5\ntop\npop\npush 3', '5'),
      hidden('6\npush 3\npush 3\ngetMin\npop\ngetMin\ntop', '3\n3\n3'),
      hidden('5\npush -1\npush -2\npush -3\npop\ngetMin', '-2'),
    ],
  },

  {
    slug: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Evaluate an arithmetic expression given in Reverse Polish (postfix) Notation. Valid operators are `+`, `-`, `*`, `/` (integer division truncating toward zero).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated tokens (integers or operators)\n\n**Output**\nThe evaluated result.',
    descriptionHi:
      'Reverse Polish (postfix) Notation mein diye gaye arithmetic expression ko evaluate karo. Valid operators hain `+`, `-`, `*`, `/` (integer division, zero ki taraf truncate).\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated tokens (integers ya operators)\n\n**Output**\nEvaluated result.',
    examples: [
      { input: '5\n2 1 + 3 *', output: '9' },
      { input: '5\n4 13 5 / +', output: '6' },
    ],
    constraints: ['1 <= n <= 10^4', 'The expression is always valid'],
    hints: [
      'Postfix notation is exactly what a stack is built to evaluate directly.',
      'Push numbers. On an operator, pop the two most recent operands, apply the operator, and push the result back.',
      'Watch the operand order for `-` and `/`: the second-popped value comes first.',
    ],
    approach:
      'Walk the tokens. Push numbers onto a stack. On an operator, pop the top two values (`b` then `a`, in that pop order), compute `a OP b`, and push the result back. The final and only remaining stack value is the answer.',
    approachHi:
      'Tokens ko walk karo. Numbers ko stack par push karo. Operator par, top do values pop karo (`b` phir `a`, isi pop order mein), `a OP b` compute karo, aur result wapas push kar do. Aakhir mein stack mein bacha ek hi value answer hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Postfix notation is defined so that every operator immediately follows its two operands with nothing else in between — a stack captures exactly that "most recently seen, not yet consumed" relationship, so each operator can always find its operands sitting right at the top. Getting the subtraction/division order backwards (using the first-popped value as the left operand) is the classic bug this problem tests for.',
    solutionExplanationHi:
      'Postfix notation is tarah define hoti hai ki har operator apne do operands ke turant baad aata hai, beech mein kuch aur nahi — stack exactly wahi "sabse recently dekha gaya, abhi tak consume nahi hua" relationship capture karta hai, isliye har operator apne operands ko hamesha top par pata hai. Subtraction/division ka order ulta kar dena (pehle-pop hui value ko left operand maan lena) hi is problem ka classic bug hai jo test hota hai.',
    starter: starter(
      `const tokens = words(1);

function evalRPN(tokens) {
  // your code here
}

console.log(evalRPN(tokens));`,
      `tokens = words(1)

def eval_rpn(tokens):
    # your code here
    pass

print(eval_rpn(tokens))`,
    ),
    solution: solution(
      `const tokens = words(1);
const stack = [];
for (const t of tokens) {
  if ('+-*/'.includes(t) && t.length === 1) {
    const b = stack.pop(), a = stack.pop();
    if (t === '+') stack.push(a + b);
    else if (t === '-') stack.push(a - b);
    else if (t === '*') stack.push(a * b);
    else stack.push(Math.trunc(a / b));
  } else stack.push(Number(t));
}
console.log(stack[0]);`,
      `tokens = words(1)
stack = []
for t in tokens:
    if t in ("+", "-", "*", "/"):
        b = stack.pop()
        a = stack.pop()
        if t == "+":
            stack.append(a + b)
        elif t == "-":
            stack.append(a - b)
        elif t == "*":
            stack.append(a * b)
        else:
            stack.append(int(a / b))
    else:
        stack.append(int(t))
print(stack[0])`,
    ),
    testCases: [
      sample('5\n2 1 + 3 *', '9'),
      sample('5\n4 13 5 / +', '6'),
      hidden('1\n5', '5'),
      hidden('11\n10 6 9 3 + -11 * / * 17 + 5 +', '22'),
      hidden('3\n6 -3 /', '-2'),
      hidden('3\n4 2 -', '2'),
    ],
  },

  {
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'For each day, find how many days you would have to wait for a warmer temperature. Print 0 if there is no future warmer day.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated temperatures\n\n**Output**\n`n` values, space-separated.',
    descriptionHi:
      'Har din ke liye batao ki garam temperature ke liye kitne din wait karna hoga. Agar future mein koi garam din nahi hai to 0 print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated temperatures\n\n**Output**\n`n` values, space se separate.',
    examples: [
      { input: '8\n73 74 75 71 69 72 76 73', output: '1 1 4 2 1 1 0 0' },
      { input: '4\n30 40 50 60', output: '1 1 1 0' },
    ],
    constraints: ['1 <= n <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: [
      'This is Next Greater Element, but the answer needed is the *distance* to that element, not its value.',
      'Keep a monotonic decreasing stack of indices waiting for a warmer day.',
      'When a warmer temperature arrives, it resolves every colder day waiting on the stack — the distance is the index difference.',
    ],
    approach:
      'Monotonic decreasing stack of indices whose answer is still unknown. For each new day, pop every index whose temperature is lower and set its answer to the current index minus that index; then push the current index.',
    approachHi:
      'Un indices ka monotonic decreasing stack jinka answer abhi pata nahi. Har naye din ke liye, un saare indices ko pop karo jinka temperature kam hai aur unka answer current index minus wo index set karo; phir current index push kar do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'This is a direct reuse of the Next Greater Element monotonic-stack pattern, with only the payload changed: instead of recording the resolving value, the index gap (current index minus the waiting index) is recorded, since that gap is exactly the number of days waited. Each index is still pushed once and popped at most once, keeping the total work O(n).',
    solutionExplanationHi:
      'Ye Next Greater Element wale monotonic-stack pattern ka seedha reuse hai, bas payload badal gaya hai: resolving value record karne ke bajaye, index ka gap (current index minus waiting index) record hota hai, kyunki wahi gap exactly utne din wait karne jitna hai. Har index ab bhi ek baar push hota hai aur zyada se zyada ek baar pop, isliye total kaam O(n) hi rehta hai.',
    starter: starter(
      `const temps = nums(1);

function dailyTemperatures(temps) {
  // return an array of wait days
  return [];
}

console.log(dailyTemperatures(temps).join(' '));`,
      `temps = nums(1)

def daily_temperatures(temps):
    # return a list of wait days
    return []

print(" ".join(map(str, daily_temperatures(temps))))`,
    ),
    solution: solution(
      `const temps = nums(1);
const res = new Array(temps.length).fill(0);
const stack = [];
for (let i = 0; i < temps.length; i++) {
  while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
    const j = stack.pop();
    res[j] = i - j;
  }
  stack.push(i);
}
console.log(res.join(' '));`,
      `temps = nums(1)
res = [0] * len(temps)
stack = []
for i, t in enumerate(temps):
    while stack and temps[stack[-1]] < t:
        j = stack.pop()
        res[j] = i - j
    stack.append(i)
print(" ".join(map(str, res)))`,
    ),
    testCases: [
      sample('8\n73 74 75 71 69 72 76 73', '1 1 4 2 1 1 0 0'),
      sample('4\n30 40 50 60', '1 1 1 0'),
      hidden('1\n50', '0'),
      hidden('4\n60 50 40 30', '0 0 0 0'),
      hidden('3\n30 60 90', '1 1 0'),
      hidden('5\n50 50 50 50 60', '4 3 2 1 0'),
    ],
  },

  {
    slug: 'largest-rectangle-in-histogram',
    title: 'Largest Rectangle in Histogram',
    category: 'Stack',
    difficulty: 'HARD',
    description:
      'Given bars of width 1 and given heights, find the area of the largest rectangle that fits entirely within the histogram outline.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated heights\n\n**Output**\nThe maximum rectangle area.',
    descriptionHi:
      'Width 1 wale bars aur unki heights di hain. Histogram outline ke andar poori tarah fit hone wale sabse bade rectangle ka area dhoondo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated heights\n\n**Output**\nMaximum rectangle area.',
    examples: [
      { input: '6\n2 1 5 6 2 3', output: '10' },
      { input: '2\n2 4', output: '4' },
    ],
    constraints: ['1 <= n <= 10^5', '0 <= heights[i] <= 10^4'],
    hints: [
      'For every bar, the largest rectangle using that bar\'s height extends left and right until a shorter bar blocks it.',
      'A monotonic increasing stack of indices can find, for each bar, the nearest shorter bar to the left and to the right in O(n) total.',
      'When popping a bar from the stack because a shorter one arrived, the popped bar\'s rectangle width spans from just after the new stack top to the current index.',
    ],
    approach:
      'Monotonic increasing stack of indices. Scan left to right (with a sentinel height of 0 appended to flush the stack at the end); whenever the current height is less than the height at the stack\'s top index, pop it and compute the rectangle using the popped height, with width `currentIndex - newStackTop - 1` (or `currentIndex` if the stack is now empty). Track the maximum area found.',
    approachHi:
      'Indices ka monotonic increasing stack. Left se right scan karo (end mein stack flush karne ke liye ek sentinel height 0 jodo); jab bhi current height, stack ke top index ki height se kam ho, use pop karo aur popped height se rectangle compute karo, width `currentIndex - newStackTop - 1` (ya `currentIndex` agar stack ab khaali hai). Maximum area track karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'For a fixed bar, its maximal rectangle is bounded left and right by the nearest bars that are strictly shorter — anything taller in between could extend that width without lowering the height. A monotonic increasing stack finds exactly those boundaries: when a bar shorter than the stack top arrives, it is precisely the right boundary for the popped bar, and whatever remains on the stack after popping is the left boundary — so every bar\'s full rectangle is computed in amortised O(1), and the sentinel 0 at the end guarantees every remaining bar on the stack gets flushed and computed too.',
    solutionExplanationHi:
      'Ek fixed bar ke liye, uska maximal rectangle left-right mein us sabse nazdeek bar se bound hota hai jo strictly chhota ho — beech mein jo bhi bara hai wo width badha sakta hai bina height ghataye. Monotonic increasing stack exactly wahi boundaries dhoondta hai: jab stack top se chhota bar aata hai, wo popped bar ke liye exact right boundary hai, aur pop karne ke baad stack mein jo bacha hai wo left boundary hai — isliye har bar ka poora rectangle amortised O(1) mein compute hota hai, aur end ka sentinel 0 guarantee karta hai ki stack mein bache saare bars bhi flush aur compute ho jaayein.',
    starter: starter(
      `const heights = nums(1);

function largestRectangleArea(heights) {
  // your code here
}

console.log(largestRectangleArea(heights));`,
      `heights = nums(1)

def largest_rectangle_area(heights):
    # your code here
    pass

print(largest_rectangle_area(heights))`,
    ),
    solution: solution(
      `const heights = [...nums(1), 0];
const stack = [];
let best = 0;
for (let i = 0; i < heights.length; i++) {
  while (stack.length && heights[stack[stack.length - 1]] > heights[i]) {
    const h = heights[stack.pop()];
    const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
    best = Math.max(best, h * width);
  }
  stack.push(i);
}
console.log(best);`,
      `heights = nums(1) + [0]
stack = []
best = 0
for i, hgt in enumerate(heights):
    while stack and heights[stack[-1]] > hgt:
        h = heights[stack.pop()]
        width = i - stack[-1] - 1 if stack else i
        best = max(best, h * width)
    stack.append(i)
print(best)`,
    ),
    testCases: [
      sample('6\n2 1 5 6 2 3', '10'),
      sample('2\n2 4', '4'),
      hidden('1\n5', '5'),
      hidden('4\n1 1 1 1', '4'),
      hidden('3\n0 0 0', '0'),
      hidden('5\n6 2 5 4 5', '12'),
    ],
  },

  {
    slug: 'simplify-path',
    title: 'Simplify Path',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Given an absolute Unix-style path, convert it to its simplified canonical form: resolve `.` (current directory), `..` (parent directory), and collapse multiple slashes, with no trailing slash (unless the result is the root `/`).\n\n**Input**\nOne line containing the path.\n\n**Output**\nThe canonical path.',
    descriptionHi:
      'Ek absolute Unix-style path diya hai, use uske simplified canonical form mein convert karo: `.` (current directory), `..` (parent directory) resolve karo, aur multiple slashes ko collapse karo, koi trailing slash na ho (jab tak result root `/` na ho).\n\n**Input**\nEk line jisme path hai.\n\n**Output**\nCanonical path.',
    examples: [
      { input: '/home/', output: '/home' },
      { input: '/a/./b/../../c/', output: '/c' },
    ],
    constraints: ['1 <= length <= 3000', 'The path is a valid absolute Unix-style path'],
    hints: [
      'Split the path on `/` — empty pieces (from multiple slashes) and `.` pieces can simply be skipped.',
      'A `..` piece means "go up one directory" — pop the last real directory name, if any.',
      'A stack of directory names, pushed and popped as pieces are processed, naturally builds the canonical path.',
    ],
    approach:
      'Split the path on `/`. For each non-empty piece: skip it if it is `.`; if it is `..`, pop the stack (if non-empty); otherwise push it as a real directory name. Join the remaining stack with `/`, prefixed by a leading `/`.',
    approachHi:
      'Path ko `/` par split karo. Har non-empty piece ke liye: agar `.` hai to skip karo; agar `..` hai to stack pop karo (agar khaali nahi hai); warna use real directory name ki tarah push karo. Bache hue stack ko `/` se join karo, aage ek `/` lagakar.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'A path is really a sequence of push (a real directory name) and pop (`..`) operations, with `.` and empty segments (from repeated slashes) being pure no-ops — modeling the resolved directory stack literally as a stack makes every one of these rules a one-line case, and popping an empty stack on a stray `..` at the root is simply ignored rather than erroring, matching real shell behavior.',
    solutionExplanationHi:
      'Ek path asal mein push (ek real directory name) aur pop (`..`) operations ki sequence hai, jahan `.` aur empty segments (repeated slashes se) pure no-ops hain — resolved directory stack ko literally ek stack ki tarah model karna har rule ko ek-line case bana deta hai, aur root par kisi stray `..` se khaali stack pop karna sirf ignore ho jaata hai, error nahi deta — bilkul real shell jaisa behavior.',
    starter: starter(
      `const path = line(0);

function simplifyPath(path) {
  // your code here
}

console.log(simplifyPath(path));`,
      `path = line(0)

def simplify_path(path):
    # your code here
    pass

print(simplify_path(path))`,
    ),
    solution: solution(
      `const path = line(0);
const stack = [];
for (const piece of path.split('/')) {
  if (piece === '' || piece === '.') continue;
  if (piece === '..') { if (stack.length) stack.pop(); }
  else stack.push(piece);
}
console.log('/' + stack.join('/'));`,
      `path = line(0)
stack = []
for piece in path.split("/"):
    if piece == "" or piece == ".":
        continue
    if piece == "..":
        if stack:
            stack.pop()
    else:
        stack.append(piece)
print("/" + "/".join(stack))`,
    ),
    testCases: [
      sample('/home/', '/home'),
      sample('/a/./b/../../c/', '/c'),
      hidden('/../', '/'),
      hidden('/home//foo/', '/home/foo'),
      hidden('/', '/'),
      hidden('/a/../../b/../c//.//', '/c'),
    ],
  },

  {
    slug: 'decode-string',
    title: 'Decode String',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Decode a string encoded with the pattern `k[encoded_string]`, meaning `encoded_string` is repeated `k` times. Encodings may nest.\n\n**Input**\nOne line containing the encoded string.\n\n**Output**\nThe decoded string.',
    descriptionHi:
      '`k[encoded_string]` pattern se encode ki gayi string decode karo, jiska matlab hai `encoded_string` ko `k` baar repeat karna. Encodings nested ho sakti hain.\n\n**Input**\nEk line jisme encoded string hai.\n\n**Output**\nDecoded string.',
    examples: [
      { input: '3[a]2[bc]', output: 'aaabcbc' },
      { input: '3[a2[c]]', output: 'accaccacc' },
    ],
    constraints: ['1 <= length <= 30', 'The encoding is always valid; numbers can be multi-digit'],
    hints: [
      'Nested brackets suggest a stack that saves state before entering and restores it on exit.',
      'On `[`, push the current string-so-far and the current multiplier onto stacks, then reset both to start building the inner content.',
      'On `]`, pop the saved string and multiplier, and append the (repeated) inner content to the restored outer string.',
    ],
    approach:
      'Two stacks (or one stack of pairs): one for the string built so far at each nesting level, one for the pending repeat count. Accumulate digits into a number and letters into the current string. On `[`, push both onto their stacks and reset. On `]`, pop the saved string and count, and append `count` copies of the just-finished inner string to it.',
    approachHi:
      'Do stacks (ya ek stack of pairs): ek har nesting level ka ab tak bana string, ek pending repeat count. Digits ko ek number mein aur letters ko current string mein jodo. `[` par, dono ko unke stacks par push karo aur reset karo. `]` par, saved string aur count pop karo, aur just-finished inner string ki `count` copies use jod do.',
    timeComplexity: 'O(output length)',
    spaceComplexity: 'O(output length)',
    solutionExplanation:
      'Nesting means the decoder needs to remember "what was I building, and how many times will it repeat" every time it dives one level deeper into brackets — which is exactly what pushing onto a stack before entering, and popping to restore on exit, is for. This lets the algorithm build the innermost content first (correctly, since it is fully self-contained inside its own brackets), then unwind outward, multiplying and appending at each level, without ever needing recursion explicitly.',
    solutionExplanationHi:
      'Nesting ka matlab hai ki jab bhi decoder ek level aur andar brackets mein jaata hai, use yaad rakhna padta hai "main kya bana raha tha, aur wo kitni baar repeat hoga" — yahi kaam andar jaane se pehle stack par push karna, aur bahar aane par pop karke restore karna karta hai. Isse algorithm sabse andar wala content pehle (sahi tarah, kyunki wo apne hi brackets ke andar self-contained hai) bana leta hai, phir bahar unwind karte hue, har level par multiply aur append karta hai, bina explicitly recursion use kiye.',
    starter: starter(
      `const s = line(0);

function decodeString(s) {
  // your code here
}

console.log(decodeString(s));`,
      `s = line(0)

def decode_string(s):
    # your code here
    pass

print(decode_string(s))`,
    ),
    solution: solution(
      `const s = line(0);
const countStack = [], strStack = [];
let curStr = '', curNum = 0;
for (const c of s) {
  if (c >= '0' && c <= '9') curNum = curNum * 10 + Number(c);
  else if (c === '[') { countStack.push(curNum); strStack.push(curStr); curNum = 0; curStr = ''; }
  else if (c === ']') { const cnt = countStack.pop(); curStr = strStack.pop() + curStr.repeat(cnt); }
  else curStr += c;
}
console.log(curStr);`,
      `s = line(0)
count_stack, str_stack = [], []
cur_str, cur_num = "", 0
for c in s:
    if c.isdigit():
        cur_num = cur_num * 10 + int(c)
    elif c == "[":
        count_stack.append(cur_num)
        str_stack.append(cur_str)
        cur_num = 0
        cur_str = ""
    elif c == "]":
        cnt = count_stack.pop()
        cur_str = str_stack.pop() + cur_str * cnt
    else:
        cur_str += c
print(cur_str)`,
    ),
    testCases: [
      sample('3[a]2[bc]', 'aaabcbc'),
      sample('3[a2[c]]', 'accaccacc'),
      hidden('2[abc]3[cd]ef', 'abcabccdcdcdef'),
      hidden('abc', 'abc'),
      hidden('10[a]', 'aaaaaaaaaa'),
      hidden('2[a2[b]c]', 'abbcabbc'),
    ],
  },

  {
    slug: 'remove-all-adjacent-duplicates-in-string',
    title: 'Remove All Adjacent Duplicates In String',
    category: 'Stack',
    difficulty: 'EASY',
    description:
      'Repeatedly remove pairs of adjacent, identical letters until no such pair remains. Return the final string.\n\n**Input**\nOne line containing lowercase letters.\n\n**Output**\nThe final string after all removals (may be empty).',
    descriptionHi:
      'Adjacent, identical letters ke pairs ko baar-baar hatao jab tak koi aisa pair na bache. Final string return karo.\n\n**Input**\nEk line jisme lowercase letters hain.\n\n**Output**\nSaari removals ke baad final string (khaali bhi ho sakti hai).',
    examples: [
      { input: 'abbaca', output: 'ca' },
      { input: 'azxxzy', output: 'ay' },
    ],
    constraints: ['1 <= length <= 10^5', 'Lowercase English letters'],
    hints: [
      'Removing a pair can expose a brand-new adjacent pair that did not exist before (like "abba" -> "aa" -> "").',
      'A stack naturally handles this: push each character, but if it matches the current top, pop instead.',
      'One left-to-right pass with a stack handles every cascading removal, no repeated scanning needed.',
    ],
    approach:
      'Walk the string with a stack. For each character, if it equals the character on top of the stack, pop the stack (the pair cancels); otherwise push the character. The stack\'s final contents, read bottom to top, is the answer.',
    approachHi:
      'String ko ek stack ke saath walk karo. Har character ke liye, agar wo stack ke top wale character ke barabar hai, to stack pop karo (pair cancel ho gaya); warna character push karo. Stack ki final contents, bottom se top tak, hi answer hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Removing "abba" cannot be done correctly by scanning once and deleting matched pairs in place, because removing the inner "bb" immediately creates a brand-new adjacent pair "aa" that a single forward scan would already have passed by. A stack sidesteps this entirely: whatever is on top of the stack is always the character immediately before the current position in the *already-reduced* string, so cancellation cascades naturally without ever needing to re-scan.',
    solutionExplanationHi:
      '"abba" ko ek baar scan karke matched pairs in-place delete karke sahi tarah handle nahi kiya ja sakta, kyunki andar wale "bb" ko hatate hi ek bilkul naya adjacent pair "aa" ban jaata hai jise ek single forward scan pehle hi paar kar chuka hoga. Stack isse poori tarah avoid kar deta hai: stack ke top par jo bhi hai wo hamesha *already-reduced* string mein current position se turant pehle wala character hota hai, isliye cancellation naturally cascade hota hai, dobara scan karne ki zaroorat nahi.',
    starter: starter(
      `const s = line(0);

function removeDuplicates(s) {
  // your code here
}

console.log(removeDuplicates(s));`,
      `s = line(0)

def remove_duplicates(s):
    # your code here
    pass

print(remove_duplicates(s))`,
    ),
    solution: solution(
      `const s = line(0);
const stack = [];
for (const c of s) {
  if (stack.length && stack[stack.length - 1] === c) stack.pop();
  else stack.push(c);
}
console.log(stack.join(''));`,
      `s = line(0)
stack = []
for c in s:
    if stack and stack[-1] == c:
        stack.pop()
    else:
        stack.append(c)
print("".join(stack))`,
    ),
    testCases: [
      sample('abbaca', 'ca'),
      sample('azxxzy', 'ay'),
      hidden('aaaaaa', ''),
      hidden('abc', 'abc'),
      hidden('aabbcc', ''),
      hidden('abccba', ''),
    ],
  },

  {
    slug: 'remove-k-digits',
    title: 'Remove K Digits',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Given a non-negative integer as a string, remove exactly `k` digits so that the remaining digits (kept in order) form the smallest possible number. Remove any leading zeros in the result; print `0` if everything is removed.\n\n**Input**\n- Line 1: `num`\n- Line 2: `k`\n\n**Output**\nThe smallest resulting number, as a string.',
    descriptionHi:
      'Ek non-negative integer string ke roop mein diya hai. Exactly `k` digits hatao taaki bache hue digits (order mein) sabse chhota number banayein. Result mein leading zeros hata do; agar sab hat jaaye to `0` print karo.\n\n**Input**\n- Line 1: `num`\n- Line 2: `k`\n\n**Output**\nSabse chhota resulting number, string ke roop mein.',
    examples: [
      { input: '1432219\n3', output: '1219' },
      { input: '10200\n1', output: '200' },
    ],
    constraints: ['1 <= num.length <= 10^5', '0 <= k <= num.length'],
    hints: [
      'For the smallest number, earlier digits matter more — a smaller digit early is worth more than a smaller digit later.',
      'If the current digit is smaller than the digit just placed, removing that placed digit (if removals remain) always helps.',
      'A monotonic increasing stack of digits, removing from the top whenever the incoming digit is smaller, builds the answer greedily.',
    ],
    approach:
      'Monotonic increasing stack of digits. For each incoming digit, while the stack is non-empty, its top digit is bigger than the incoming one, and removals remain (`k > 0`), pop the stack and decrement `k`. Push the digit. After the scan, remove any still-remaining `k` digits from the end, then strip leading zeros (keeping at least one digit).',
    approachHi:
      'Digits ka monotonic increasing stack. Har aane wale digit ke liye, jab tak stack khaali nahi hai, uska top digit aane wale se bada hai, aur removals bache hain (`k > 0`), stack pop karo aur `k` ghatao. Digit push karo. Scan ke baad, agar `k` abhi bhi bacha hai to end se hata do, phir leading zeros hata do (kam se kam ek digit rakho).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'To minimize the resulting number, a digit that is followed by a smaller digit should be removed, because a smaller digit earlier in the number outweighs any digit sequence that comes after it — this is exactly the same "discard anything dominated by what just arrived" logic as Next Greater Element, applied to digits instead of array values, with `k` acting as a removal budget that caps how many pops are allowed.',
    solutionExplanationHi:
      'Resulting number ko minimize karne ke liye, ek aisa digit jiske baad chhota digit aata hai use hataana chahiye, kyunki number mein pehle wala chhota digit uske baad ki poori sequence se zyada matter karta hai — ye bilkul Next Greater Element wali "jo bhi abhi aaye usse dominate hone wala sab hata do" logic hai, bas array values ke bajaye digits par, aur `k` ek removal budget ki tarah kaam karta hai jo pops ki sankhya limit karta hai.',
    starter: starter(
      `const numStr = line(0);
let k = num(1);

function removeKdigits(numStr, k) {
  // your code here
}

console.log(removeKdigits(numStr, k));`,
      `num_str = line(0)
k = num(1)

def remove_k_digits(num_str, k):
    # your code here
    pass

print(remove_k_digits(num_str, k))`,
    ),
    solution: solution(
      `const numStr = line(0);
let k = num(1);
const stack = [];
for (const d of numStr) {
  while (k > 0 && stack.length && stack[stack.length - 1] > d) { stack.pop(); k--; }
  stack.push(d);
}
while (k > 0) { stack.pop(); k--; }
let result = stack.join('').replace(/^0+/, '');
console.log(result === '' ? '0' : result);`,
      `num_str = line(0)
k = num(1)
stack = []
for d in num_str:
    while k > 0 and stack and stack[-1] > d:
        stack.pop()
        k -= 1
    stack.append(d)
while k > 0:
    stack.pop()
    k -= 1
result = "".join(stack).lstrip("0")
print(result if result else "0")`,
    ),
    testCases: [
      sample('1432219\n3', '1219'),
      sample('10200\n1', '200'),
      hidden('10\n2', '0'),
      hidden('9\n1', '0'),
      hidden('112\n1', '11'),
      hidden('1234567890\n9', '0'),
    ],
  },

  {
    slug: 'asteroid-collision',
    title: 'Asteroid Collision',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Each asteroid moves at the same speed; positive means moving right, negative means moving left. When two asteroids meet, the smaller (by absolute size) explodes; if equal, both explode. Two asteroids moving the same direction never meet. Return the state after all collisions.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-zero integers\n\n**Output**\nThe surviving asteroids, in order, space-separated (empty line if none survive).',
    descriptionHi:
      'Har asteroid same speed se chalta hai; positive matlab right, negative matlab left. Jab do asteroids milte hain, chhota (absolute size mein) explode hota hai; barabar hone par dono explode. Same direction mein chalne wale do asteroids kabhi nahi milte. Saari collisions ke baad ki state return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-zero integers\n\n**Output**\nBache hue asteroids, order mein, space se separate (khaali agar koi na bache).',
    examples: [
      { input: '3\n5 10 -5', output: '5 10' },
      { input: '2\n8 -8', output: '' },
    ],
    constraints: ['1 <= n <= 10^4', '-1000 <= asteroid[i] <= 1000, never 0'],
    hints: [
      'A collision can only happen between a right-moving asteroid followed later by a left-moving one — any other adjacent pairing never meets.',
      'A stack of survivors-so-far works well: a new left-moving asteroid only threatens the top of the stack if that top is right-moving.',
      'A collision may cascade — a surviving new asteroid might then also destroy the next thing down the stack.',
    ],
    approach:
      'Process asteroids left to right with a stack of survivors. A new left-moving asteroid (`< 0`) only collides with a right-moving asteroid at the top of the stack (`> 0`): repeatedly resolve that collision (destroy the smaller, or both if equal) while the top keeps losing, then push whatever is left, if anything. Any other case (stack empty, top already negative, or the current asteroid is positive) means no immediate collision, so just push.',
    approachHi:
      'Asteroids ko left se right process karo, survivors ka ek stack rakhte hue. Ek naya left-moving asteroid (`< 0`) sirf tab collide karta hai jab stack ke top par right-moving asteroid (`> 0`) ho: jab tak top haarta rehta hai, us collision ko baar-baar resolve karo (chhota destroy karo, ya barabar hone par dono), phir jo bacha ho use push karo. Baaki har case (stack khaali, top pehle se negative, ya current asteroid positive) mein turant koi collision nahi, isliye seedha push karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Because asteroids move at constant speed in only two directions, a collision is only geometrically possible when a right-mover is immediately followed (at some point) by a left-mover approaching it from behind — any right-mover after a left-mover, or two movers going the same way, can never meet. A stack captures "the most recent right-mover still alive that a future left-mover might crash into," and the collision-resolution loop naturally cascades: destroying one asteroid can expose the next one down as the new target for the same incoming asteroid.',
    solutionExplanationHi:
      'Chunki asteroids constant speed se sirf do directions mein chalte hain, collision geometrically sirf tabhi possible hai jab ek right-mover ke peeche se koi left-mover aa raha ho — kisi left-mover ke baad koi right-mover, ya same direction mein chalne wale do movers, kabhi nahi mil sakte. Stack "abhi zinda sabse recent right-mover jisse koi future left-mover takra sakta hai" capture karta hai, aur collision-resolution loop naturally cascade karta hai: ek asteroid destroy hone se neeche wala agla asteroid usi incoming asteroid ka naya target ban sakta hai.',
    starter: starter(
      `const asteroids = nums(1);

function asteroidCollision(asteroids) {
  // return the surviving asteroids
  return [];
}

console.log(asteroidCollision(asteroids).join(' '));`,
      `asteroids = nums(1)

def asteroid_collision(asteroids):
    # return the surviving asteroids
    return []

print(" ".join(map(str, asteroid_collision(asteroids))))`,
    ),
    solution: solution(
      `const asteroids = nums(1);
const stack = [];
for (const a of asteroids) {
  let cur = a, alive = true;
  while (alive && cur < 0 && stack.length && stack[stack.length - 1] > 0) {
    const top = stack[stack.length - 1];
    if (top < -cur) { stack.pop(); }
    else if (top === -cur) { stack.pop(); alive = false; }
    else { alive = false; }
  }
  if (alive) stack.push(cur);
}
console.log(stack.join(' '));`,
      `asteroids = nums(1)
stack = []
for a in asteroids:
    cur = a
    alive = True
    while alive and cur < 0 and stack and stack[-1] > 0:
        top = stack[-1]
        if top < -cur:
            stack.pop()
        elif top == -cur:
            stack.pop()
            alive = False
        else:
            alive = False
    if alive:
        stack.append(cur)
print(" ".join(map(str, stack)))`,
    ),
    testCases: [
      sample('3\n5 10 -5', '5 10'),
      sample('2\n8 -8', ''),
      hidden('3\n10 2 -5', '10'),
      hidden('4\n-2 -1 1 2', '-2 -1 1 2'),
      hidden('1\n5', '5'),
      hidden('4\n1 -2 -2 -2', '-2 -2 -2'),
    ],
  },

  {
    slug: 'basic-calculator-ii',
    title: 'Basic Calculator II',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Evaluate a string expression containing non-negative integers, spaces, and the operators `+ - * /` (no parentheses). Integer division truncates toward zero.\n\n**Input**\nOne line containing the expression.\n\n**Output**\nThe evaluated result.',
    descriptionHi:
      'Non-negative integers, spaces, aur operators `+ - * /` (koi parentheses nahi) wali ek expression string evaluate karo. Integer division zero ki taraf truncate hota hai.\n\n**Input**\nEk line jisme expression hai.\n\n**Output**\nEvaluated result.',
    examples: [
      { input: '3+2*2', output: '7' },
      { input: ' 3/2 ', output: '1' },
    ],
    constraints: ['1 <= length <= 3*10^5', 'The expression is always valid'],
    hints: [
      'Without parentheses, only operator precedence (`*` and `/` before `+` and `-`) needs handling.',
      'Push each number onto a stack signed by the operator that precedes it, except that `*` and `/` are applied immediately against the previous stack value rather than pushed.',
      'The final answer is the sum of everything left on the stack.',
    ],
    approach:
      'Scan the expression accumulating multi-digit numbers. Track the operator that precedes each number. On `+`, push the number; on `-`, push its negation; on `*` or `/`, pop the previous value, apply the operator with the new number, and push the result back. At the end, sum the entire stack.',
    approachHi:
      'Expression scan karo, multi-digit numbers accumulate karte hue. Har number se pehle wala operator track karo. `+` par number push karo; `-` par uska negation push karo; `*` ya `/` par pichli value pop karo, naye number ke saath operator apply karo, aur result wapas push kar do. Aakhir mein poore stack ka sum lo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Because `*` and `/` bind tighter than `+` and `-`, they can be resolved the instant they are seen — combining with whatever number was most recently pushed — while `+` and `-` are deferred by simply pushing a signed value onto a stack. Deferring addition/subtraction until the very end (as a single sum over the stack) is what correctly lets precedence override left-to-right evaluation order without needing an explicit expression tree.',
    solutionExplanationHi:
      'Chunki `*` aur `/`, `+` aur `-` se zyada tightly bind karte hain, unhe dekhte hi turant resolve kiya ja sakta hai — sabse recently pushed number ke saath combine karke — jabki `+` aur `-` ko sirf ek signed value stack par push karke defer kar diya jaata hai. Addition/subtraction ko aakhir tak (stack ka ek single sum) defer karna hi precedence ko left-to-right evaluation order ke upar sahi tarah kaam karne deta hai, bina kisi explicit expression tree ke.',
    starter: starter(
      `const expr = line(0);

function calculate(expr) {
  // your code here
}

console.log(calculate(expr));`,
      `expr = line(0)

def calculate(expr):
    # your code here
    pass

print(calculate(expr))`,
    ),
    solution: solution(
      `const expr = line(0);
const stack = [];
let cur = 0, op = '+';
const s = expr + '+';
for (const c of s) {
  if (c === ' ') continue;
  if (c >= '0' && c <= '9') { cur = cur * 10 + Number(c); continue; }
  if (op === '+') stack.push(cur);
  else if (op === '-') stack.push(-cur);
  else if (op === '*') stack.push(stack.pop() * cur);
  else stack.push(Math.trunc(stack.pop() / cur));
  op = c;
  cur = 0;
}
console.log(stack.reduce((a, b) => a + b, 0));`,
      `expr = line(0)
stack = []
num = 0
op = "+"
s = expr + "+"
for c in s:
    if c == " ":
        continue
    if c.isdigit():
        num = num * 10 + int(c)
        continue
    if op == "+":
        stack.append(num)
    elif op == "-":
        stack.append(-num)
    elif op == "*":
        stack.append(stack.pop() * num)
    else:
        stack.append(int(stack.pop() / num))
    op = c
    num = 0
print(sum(stack))`,
    ),
    testCases: [
      sample('3+2*2', '7'),
      sample(' 3/2 ', '1'),
      hidden(' 3+5 / 2 ', '5'),
      hidden('1-1+1', '1'),
      hidden('14-3/2', '13'),
      hidden('100000000/1/2/3/4/5/6/7/8/9/10', '27'),
    ],
  },

  {
    slug: 'online-stock-span',
    title: 'Online Stock Span',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Process a stream of daily stock prices via `next price` calls. The span for a day is the number of consecutive days up to and including today where the price was less than or equal to today\'s price. Print the span for every `next` call.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: `next price`\n\n**Output**\nOne span per `next` call, in order.',
    descriptionHi:
      '`next price` calls ke through daily stock prices ki ek stream process karo. Kisi din ka span un consecutive dinon ki sankhya hai (aaj samet) jahan price aaj ke price se kam ya barabar tha. Har `next` call ke liye span print karo.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: `next price`\n\n**Output**\nHar `next` call ke liye ek span, order mein.',
    examples: [
      {
        input: '7\nnext 100\nnext 80\nnext 60\nnext 70\nnext 60\nnext 75\nnext 85',
        output: '1\n1\n1\n2\n1\n4\n6',
      },
    ],
    constraints: ['1 <= q <= 10^4', '1 <= price <= 10^5'],
    hints: [
      'Recomputing the span by scanning backward every day is O(n) per call, O(n^2) total.',
      'Keep a monotonic decreasing stack of (price, span) pairs.',
      'Before pushing today\'s price, pop every stored price that is <= today\'s, absorbing their spans into today\'s running total.',
    ],
    approach:
      'Maintain a stack of `(price, span)` pairs, decreasing by price from bottom to top. For each new price, start its span at 1, then pop and absorb every stack entry whose price is `<=` the new price (adding its span into the running total), before pushing the new `(price, span)` pair.',
    approachHi:
      '`(price, span)` pairs ka ek stack rakho, bottom se top tak price ke hisaab se decreasing. Har naye price ke liye, uska span 1 se shuru karo, phir un saare stack entries ko pop aur absorb karo jinka price naye price se `<=` hai (unka span running total mein jodte hue), phir naya `(price, span)` pair push karo.',
    timeComplexity: 'O(1) amortised per call',
    spaceComplexity: 'O(q)',
    solutionExplanation:
      'Storing the span alongside each price in the stack means a day that gets absorbed into a later, bigger span never needs to be individually re-examined again — its entire run of consecutive smaller-or-equal days is inherited in one pop, exactly like the amortised argument behind Next Greater Element. Each day is pushed once and popped at most once across the whole stream, so the total work stays linear in the number of calls despite any single call\'s inner loop looking expensive.',
    solutionExplanationHi:
      'Har price ke saath span ko stack mein store karna matlab jo din baad mein ek bade span mein absorb ho jaata hai use dobara individually check karne ki zaroorat nahi — uska poora consecutive smaller-or-equal days ka run ek hi pop mein inherit ho jaata hai, bilkul Next Greater Element wale amortised argument jaisa. Poori stream mein har din ek baar push hota hai aur zyada se zyada ek baar pop, isliye kisi ek call ka inner loop mehenga dikhne ke bawajood total kaam calls ki sankhya mein linear rehta hai.',
    starter: starter(
      `const q = num(0);

// Process each "next price" call and collect the span for each.
const stack = []; // pairs of [price, span]
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const price = Number(parts[1]);
  // your code here: compute the span for this price and push out.push(span)
}
console.log(out.join('\\n'));`,
      `q = num(0)

# Process each "next price" call and collect the span for each.
stack = []  # pairs of (price, span)
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    price = int(parts[1])
    # your code here: compute the span for this price and out.append(span)

print("\\n".join(map(str, out)))`,
    ),
    solution: solution(
      `const q = num(0);
const stack = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const price = Number(parts[1]);
  let span = 1;
  while (stack.length && stack[stack.length - 1][0] <= price) span += stack.pop()[1];
  stack.push([price, span]);
  out.push(span);
}
console.log(out.join('\\n'));`,
      `q = num(0)
stack = []
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    price = int(parts[1])
    span = 1
    while stack and stack[-1][0] <= price:
        span += stack.pop()[1]
    stack.append((price, span))
    out.append(span)
print("\\n".join(map(str, out)))`,
    ),
    testCases: [
      sample('7\nnext 100\nnext 80\nnext 60\nnext 70\nnext 60\nnext 75\nnext 85', '1\n1\n1\n2\n1\n4\n6'),
      hidden('1\nnext 50', '1'),
      hidden('3\nnext 10\nnext 20\nnext 30', '1\n2\n3'),
      hidden('3\nnext 30\nnext 20\nnext 10', '1\n1\n1'),
      hidden('4\nnext 5\nnext 5\nnext 5\nnext 5', '1\n2\n3\n4'),
    ],
  },

  {
    slug: 'next-greater-element-ii',
    title: 'Next Greater Element II',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'The array is circular (the element after the last wraps to the first). For each element, find the first element to its right (allowing wraparound) that is strictly greater. Print `-1` where none exists even after wrapping once.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`n` values, space-separated.',
    descriptionHi:
      'Array circular hai (aakhri element ke baad pehla element aata hai). Har element ke liye uske right mein pehla aisa element dhoondo (wraparound allow karke) jo strictly bada ho. Agar ek baar wrap karne ke baad bhi koi nahi milta to `-1` print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\n`n` values, space se separate.',
    examples: [
      { input: '3\n1 2 1', output: '2 -1 2' },
      { input: '5\n1 2 3 4 3', output: '2 3 4 -1 4' },
    ],
    constraints: ['1 <= n <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Simulating the wraparound explicitly (doubling the array) turns this back into ordinary Next Greater Element.',
      'A monotonic decreasing stack of indices, scanned over `2n` virtual positions using `i % n` to index the real array, finds every wraparound match.',
      'Only push indices during the first pass over `n` (the second lap is only for resolving, not for adding new unresolved indices), or equivalently, cap the total work by scanning `2n` times but indexing modulo n throughout.',
    ],
    approach:
      'Same monotonic decreasing stack as Next Greater Element, but scanned over `2n` virtual steps (using `i % n` to read the actual array value), which simulates one full wraparound. Any index still unresolved after both passes gets `-1`.',
    approachHi:
      'Next Greater Element wala hi monotonic decreasing stack, bas `2n` virtual steps mein scan karo (`i % n` se asli array value padhte hue), jo ek poora wraparound simulate karta hai. Dono passes ke baad bhi jo index unresolved reh jaaye use `-1` milta hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Wraparound is equivalent to conceptually duplicating the array and running plain Next Greater Element over the doubled sequence, then discarding the second half\'s own answers (only the first half\'s indices need real answers, but they may be resolved during the second, virtual lap) — implementing this via `i % n` indexing instead of an actually doubled array keeps the space at O(n) while still exploring exactly the positions a real wraparound would.',
    solutionExplanationHi:
      'Wraparound conceptually array ko duplicate karke, doubled sequence par plain Next Greater Element chalane ke barabar hai, phir doosre half ke apne answers discard kar diye jaate hain (sirf pehle half ke indices ko real answers chahiye, par wo doosre, virtual lap ke dauraan resolve ho sakte hain) — ise `i % n` indexing se implement karna, ek actually doubled array ke bajaye, space O(n) hi rakhta hai jabki wahi positions explore karta hai jo ek real wraparound karega.',
    starter: starter(
      `const arr = nums(1);
const n = arr.length;

function nextGreaterElements(arr) {
  // your code here
  return [];
}

console.log(nextGreaterElements(arr).join(' '));`,
      `arr = nums(1)
n = len(arr)

def next_greater_elements(arr):
    # your code here
    return []

print(" ".join(map(str, next_greater_elements(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const n = arr.length;
const res = new Array(n).fill(-1);
const stack = [];
for (let i = 0; i < 2 * n; i++) {
  const idx = i % n;
  while (stack.length && arr[stack[stack.length - 1]] < arr[idx]) res[stack.pop()] = arr[idx];
  if (i < n) stack.push(idx);
}
console.log(res.join(' '));`,
      `arr = nums(1)
n = len(arr)
res = [-1] * n
stack = []
for i in range(2 * n):
    idx = i % n
    while stack and arr[stack[-1]] < arr[idx]:
        res[stack.pop()] = arr[idx]
    if i < n:
        stack.append(idx)
print(" ".join(map(str, res)))`,
    ),
    testCases: [
      sample('3\n1 2 1', '2 -1 2'),
      sample('5\n1 2 3 4 3', '2 3 4 -1 4'),
      hidden('1\n5', '-1'),
      hidden('4\n5 4 3 2', '-1 5 5 5'),
      hidden('3\n3 3 3', '-1 -1 -1'),
      hidden('4\n1 2 1 2', '2 -1 2 -1'),
    ],
  },

  {
    slug: 'implement-queue-using-stacks',
    title: 'Implement Queue using Stacks',
    category: 'Stack',
    difficulty: 'EASY',
    description:
      'Implement a FIFO queue using only two stacks. Process a sequence of `push x`, `pop`, `peek`, and `empty` operations, printing the result of every `pop`, `peek`, and `empty`.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: one operation each\n\n**Output**\nOne line for every `pop`, `peek`, or `empty` operation, in order.',
    descriptionHi:
      'Sirf do stacks use karke ek FIFO queue implement karo. `push x`, `pop`, `peek`, aur `empty` operations ki sequence process karo, har `pop`, `peek`, aur `empty` ka result print karte hue.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: har ek operation\n\n**Output**\nHar `pop`, `peek`, ya `empty` ke liye ek line, order mein.',
    examples: [
      { input: '5\npush 1\npush 2\npeek\npop\nempty', output: '1\n1\nfalse' },
    ],
    constraints: ['1 <= q <= 100', '`pop` and `peek` are never called on an empty queue'],
    hints: [
      'A single stack reverses order — exactly the opposite of what a queue needs.',
      'Reversing twice restores the original order — that is what a second stack is for.',
      'Only transfer elements from the "in" stack to the "out" stack when the "out" stack is empty; otherwise the relative order gets scrambled.',
    ],
    approach:
      'Keep an `inStack` for pushes and an `outStack` for pops/peeks. On `push`, always push to `inStack`. On `pop` or `peek`, if `outStack` is empty, pour all of `inStack` into it (reversing it back into FIFO order), then operate on `outStack`\'s top.',
    approachHi:
      'Pushes ke liye ek `inStack` aur pops/peeks ke liye ek `outStack` rakho. `push` par hamesha `inStack` mein push karo. `pop` ya `peek` par, agar `outStack` khaali hai to poora `inStack` usmein daal do (FIFO order mein wapas reverse karte hue), phir `outStack` ke top par operate karo.',
    timeComplexity: 'O(1) amortised per operation',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'A single stack reverses insertion order (LIFO); reversing that reversed order a second time restores the original FIFO order — which is exactly what transferring every element from `inStack` to `outStack` accomplishes. Doing that transfer only when `outStack` is empty (rather than on every operation) is what keeps the amortised cost O(1): each element is moved from one stack to the other at most once in its lifetime, no matter how many operations are interleaved.',
    solutionExplanationHi:
      'Ek akela stack insertion order ko reverse kar deta hai (LIFO); us reversed order ko doosri baar reverse karna original FIFO order wapas la deta hai — yahi kaam `inStack` se `outStack` mein har element transfer karna karta hai. Ye transfer sirf tab karna jab `outStack` khaali ho (har operation par nahi), amortised cost ko O(1) rakhta hai: har element apni poori lifetime mein ek stack se doosre mein zyada se zyada ek baar move hota hai, chahe kitne bhi operations interleave hon.',
    starter: starter(
      `const q = num(0);

const inStack = [];
const outStack = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  // your code here: handle "push", "pop", "peek", "empty"
}
console.log(out.join('\\n'));`,
      `q = num(0)

in_stack = []
out_stack = []
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    # your code here: handle "push", "pop", "peek", "empty"

print("\\n".join(out))`,
    ),
    solution: solution(
      `const q = num(0);
const inStack = [];
const outStack = [];
const out = [];
function transfer() { if (outStack.length === 0) while (inStack.length) outStack.push(inStack.pop()); }
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  if (op === 'push') inStack.push(Number(parts[1]));
  else if (op === 'pop') { transfer(); out.push(String(outStack.pop())); }
  else if (op === 'peek') { transfer(); out.push(String(outStack[outStack.length - 1])); }
  else if (op === 'empty') out.push(String(inStack.length === 0 && outStack.length === 0));
}
console.log(out.join('\\n'));`,
      `q = num(0)
in_stack = []
out_stack = []
out = []

def transfer():
    if not out_stack:
        while in_stack:
            out_stack.append(in_stack.pop())

for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    if op == "push":
        in_stack.append(int(parts[1]))
    elif op == "pop":
        transfer()
        out.append(str(out_stack.pop()))
    elif op == "peek":
        transfer()
        out.append(str(out_stack[-1]))
    elif op == "empty":
        out.append(str(len(in_stack) == 0 and len(out_stack) == 0).lower())
print("\\n".join(out))`,
    ),
    testCases: [
      sample('5\npush 1\npush 2\npeek\npop\nempty', '1\n1\nfalse'),
      hidden('4\npush 1\npop\npush 2\npeek', '1\n2'),
      hidden('3\npush 5\npush 6\npop', '5'),
      hidden('2\npush 1\nempty', 'false'),
      hidden('1\nempty', 'true'),
    ],
  },

  {
    slug: 'score-of-parentheses',
    title: 'Score of Parentheses',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'A balanced parentheses string has a score: `()` scores 1; `AB` (concatenation) scores `score(A) + score(B)`; `(A)` scores `2 * score(A)`. Compute the score.\n\n**Input**\nOne line containing a balanced parentheses string.\n\n**Output**\nThe score.',
    descriptionHi:
      'Ek balanced parentheses string ka score hota hai: `()` ka score 1; `AB` (concatenation) ka score `score(A) + score(B)`; `(A)` ka score `2 * score(A)`. Score compute karo.\n\n**Input**\nEk line jisme balanced parentheses string hai.\n\n**Output**\nScore.',
    examples: [
      { input: '(())', output: '2' },
      { input: '(()(()))', output: '6' },
    ],
    constraints: ['2 <= length <= 50', 'The string is a balanced parentheses string'],
    hints: [
      'Track a running score at each nesting depth using a stack.',
      'On `(`, push a new 0 to start accumulating the score of that nested level.',
      'On `)`, pop the just-finished inner score, double it if it was non-zero (an inner "()" pair scores 1, not 2*0), and add it into the level below.',
    ],
    approach:
      'Stack of partial scores, one per nesting depth, starting with a single 0. On `(`, push a new 0. On `)`, pop the top score `v`; if it was 0, this was a base `()` pair, so add 1 to the new top; otherwise add `2 * v` to the new top (the doubling rule for a non-trivial nested group).',
    approachHi:
      'Partial scores ka stack, har nesting depth ke liye ek, ek 0 se shuru. `(` par ek naya 0 push karo. `)` par top score `v` pop karo; agar wo 0 tha, ye ek base `()` pair tha, isliye naye top mein 1 jodo; warna naye top mein `2 * v` jodo (non-trivial nested group ka doubling rule).',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The stack represents "the score accumulated so far at each nesting depth" — pushing a fresh 0 on `(` isolates the inner group\'s own score from its surroundings, and popping on `)` is the moment that inner score gets finalized: distinguishing "was this level a bare pair" (score 0 before closing, meaning +1) from "did this level contain something" (non-zero, meaning double it) is exactly what the two score rules require, and adding the result into the level below correctly propagates it outward one level at a time.',
    solutionExplanationHi:
      'Stack "har nesting depth par abhi tak accumulate hua score" represent karta hai — `(` par ek fresh 0 push karna andar wale group ke apne score ko uske aas-paas se isolate kar deta hai, aur `)` par pop karna wo moment hai jab wo inner score finalize hota hai: "kya ye level ek bare pair tha" (closing se pehle score 0, matlab +1) ko "kya is level mein kuch tha" (non-zero, matlab double karo) se alag karna hi dono score rules ka matlab hai, aur result ko neeche wale level mein jodna use ek-ek level bahar propagate karta hai.',
    starter: starter(
      `const s = line(0);

function scoreOfParentheses(s) {
  // your code here
}

console.log(scoreOfParentheses(s));`,
      `s = line(0)

def score_of_parentheses(s):
    # your code here
    pass

print(score_of_parentheses(s))`,
    ),
    solution: solution(
      `const s = line(0);
const stack = [0];
for (const c of s) {
  if (c === '(') stack.push(0);
  else {
    const v = stack.pop();
    const add = v === 0 ? 1 : 2 * v;
    stack[stack.length - 1] += add;
  }
}
console.log(stack[0]);`,
      `s = line(0)
stack = [0]
for c in s:
    if c == "(":
        stack.append(0)
    else:
        v = stack.pop()
        add = 1 if v == 0 else 2 * v
        stack[-1] += add
print(stack[0])`,
    ),
    testCases: [
      sample('(())', '2'),
      sample('(()(()))', '6'),
      hidden('()', '1'),
      hidden('()()', '2'),
      hidden('(()())', '4'),
      hidden('((()))', '4'),
    ],
  },

  {
    slug: 'car-fleet',
    title: 'Car Fleet',
    category: 'Stack',
    difficulty: 'MEDIUM',
    description:
      'Cars travel toward a target position on a one-lane road, each at its own constant speed and never overtaking. A car fleet forms when a faster car catches up to a slower one ahead; they then travel together at the slower speed. Count the number of distinct fleets that reach the target.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated starting positions\n- Line 3: `n` space-separated speeds\n- Line 4: `target`\n\n**Output**\nThe number of car fleets.',
    descriptionHi:
      'Cars ek one-lane road par target position ki taraf chalti hain, har ek apni constant speed se, kabhi overtake nahi karti. Jab ek tez car dheeri car ko pakad leti hai, ek fleet ban jaati hai; phir wo dono dheeri speed se saath chalti hain. Target tak pahunchne wale distinct fleets ka count karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated starting positions\n- Line 3: `n` space-separated speeds\n- Line 4: `target`\n\n**Output**\nCar fleets ki sankhya.',
    examples: [
      { input: '5\n10 8 0 5 3\n2 4 1 1 3\n12', output: '3' },
    ],
    constraints: ['1 <= n <= 10^4', '0 <= position[i] < target <= 10^6', '0 < speed[i] <= 10^6', 'All positions are distinct'],
    hints: [
      'Cars closer to the target finish sooner (given a fixed speed) — process cars ordered by starting position, closest to the target first.',
      'Compute each car\'s time to reach the target as if it never catches up to anyone.',
      'A car merges into the fleet ahead of it if its own arrival time would be less than or equal to that fleet\'s time — otherwise it forms a new fleet.',
    ],
    approach:
      'Sort cars by starting position descending (closest to target first). Compute each car\'s standalone time to reach the target, `(target - position) / speed`. Walk through in that order with a stack of fleet arrival times: if the current car\'s time is `<=` the time on top of the stack, it merges into that fleet (discard it); otherwise it starts a new fleet (push its time). The final stack size is the number of fleets.',
    approachHi:
      'Cars ko starting position ke hisaab se descending sort karo (target ke sabse nazdeek pehle). Har car ka standalone time nikaalo `(target - position) / speed`. Usi order mein fleet arrival times ka ek stack rakh kar walk karo: agar current car ka time stack ke top ke time se `<=` hai, to wo us fleet mein merge ho jaati hai (discard karo); warna nayi fleet shuru hoti hai (uska time push karo). Final stack size hi fleets ki sankhya hai.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Processing cars from closest-to-target outward means each car is compared only against the fleet immediately ahead of it (never behind, since cars cannot overtake), and a car with a *smaller or equal* standalone time than the car ahead is guaranteed to catch up and merge, since it would otherwise arrive first, which is impossible without overtaking — so a car that merges is simply discarded (it will just tag along), while a car that would arrive strictly later starts a brand-new fleet, tracked by pushing its time onto the stack.',
    solutionExplanationHi:
      'Cars ko target ke sabse nazdeek se shuru karke process karna matlab har car sirf apne turant aage wali fleet se compare hoti hai (peeche wali se kabhi nahi, kyunki cars overtake nahi kar sakti), aur jis car ka standalone time aage wali car se *chhota ya barabar* hai, wo guaranteed pakad kar merge ho jaati hai, warna wo pehle pahunch jaati jo bina overtake kiye impossible hai — isliye merge hone wali car ko simply discard kar diya jaata hai (wo bas saath ho legi), jabki strictly baad mein pahunchne wali car ek bilkul nayi fleet shuru karti hai, jise stack par uska time push karke track kiya jaata hai.',
    starter: starter(
      `const positions = nums(1), speeds = nums(2), target = num(3);

function carFleet(target, positions, speeds) {
  // your code here
}

console.log(carFleet(target, positions, speeds));`,
      `positions, speeds, target = nums(1), nums(2), num(3)

def car_fleet(target, positions, speeds):
    # your code here
    pass

print(car_fleet(target, positions, speeds))`,
    ),
    solution: solution(
      `const positions = nums(1), speeds = nums(2), target = num(3);
const cars = positions.map((p, i) => [p, speeds[i]]).sort((a, b) => b[0] - a[0]);
const stack = [];
for (const [p, s] of cars) {
  const time = (target - p) / s;
  if (stack.length === 0 || time > stack[stack.length - 1]) stack.push(time);
}
console.log(stack.length);`,
      `positions, speeds, target = nums(1), nums(2), num(3)
cars = sorted(zip(positions, speeds), key=lambda c: -c[0])
stack = []
for p, s in cars:
    time = (target - p) / s
    if not stack or time > stack[-1]:
        stack.append(time)
print(len(stack))`,
    ),
    testCases: [
      sample('5\n10 8 0 5 3\n2 4 1 1 3\n12', '3'),
      hidden('1\n0\n1\n10', '1'),
      hidden('2\n0 4\n2 1\n10', '1'),
      hidden('3\n1 4 7\n1 1 1\n10', '3'),
      hidden('2\n3 0\n1 2\n10', '1'),
    ],
  },

  {
    slug: 'sum-of-subarray-minimums',
    title: 'Sum of Subarray Minimums',
    category: 'Stack',
    difficulty: 'HARD',
    description:
      'Sum the minimum value of every contiguous subarray. Since the answer can be huge, print it modulo `10^9 + 7`.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe sum, modulo `10^9 + 7`.',
    descriptionHi:
      'Har contiguous subarray ke minimum value ka sum nikalo. Answer bahut bada ho sakta hai, isliye `10^9 + 7` modulo print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSum, `10^9 + 7` modulo.',
    examples: [
      { input: '4\n3 1 2 4', output: '17' },
      { input: '5\n11 81 94 43 3', output: '444' },
    ],
    constraints: ['1 <= n <= 3*10^4', '0 <= nums[i] <= 3*10^4'],
    hints: [
      'Checking every one of the O(n^2) subarrays directly and taking each minimum is too slow.',
      'Instead, ask: for each element, in how many subarrays is IT the minimum? Then sum `value * count` over all elements.',
      'An element at index i is the minimum of a subarray exactly when that subarray stays within the range bounded by the nearest strictly-smaller element on each side — a monotonic stack finds those boundaries in O(n).',
    ],
    approach:
      'For each index `i`, find `left[i]` (distance to the nearest strictly smaller element to the left, or the distance to the start if none) and `right[i]` (distance to the nearest smaller-or-equal element to the right, or to the end if none) using two monotonic increasing stack passes. Element `i` is the minimum of exactly `left[i] * right[i]` subarrays, so the answer is the sum of `nums[i] * left[i] * right[i]` over all `i`, modulo `10^9 + 7`.',
    approachHi:
      'Har index `i` ke liye, do monotonic increasing stack passes se `left[i]` (left mein sabse nazdeek strictly-smaller element tak ki distance, ya na hone par start tak) aur `right[i]` (right mein sabse nazdeek smaller-or-equal element tak ki distance, ya na hone par end tak) nikaalo. Index `i` exactly `left[i] * right[i]` subarrays ka minimum hota hai, isliye answer sabhi `i` par `nums[i] * left[i] * right[i]` ka sum hai, `10^9 + 7` modulo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Instead of summing minimums directly (which requires knowing, for every subarray, which element is smallest — an O(n^2) proposition), the sum is reorganized by contribution: each element contributes its value once for every subarray where it happens to be the minimum, and that count is exactly the number of ways to extend left and right before hitting a smaller element. Using strictly-smaller on one side and smaller-or-equal on the other (rather than the same comparison on both) is what correctly avoids double-counting subarrays when duplicate values are present, since each duplicate then unambiguously "owns" a specific side of any tie.',
    solutionExplanationHi:
      'Minimums ko seedha sum karne ke bajaye (jiske liye har subarray mein sabse chhota element pata hona chahiye — ek O(n^2) proposition), sum ko contribution ke hisaab se reorganize kiya jaata hai: har element apni value utni baar contribute karta hai jitne subarrays mein wo minimum hota hai, aur wo count exactly utne tareeke hain jitne left aur right extend kiye ja sakte hain kisi chhote element se takraane se pehle. Ek side par strictly-smaller aur doosri par smaller-or-equal use karna (dono par same comparison nahi) hi duplicate values hone par double-counting sahi tarah avoid karta hai, kyunki har duplicate tab kisi bhi tie ke ek specific side ko unambiguously "own" karta hai.',
    starter: starter(
      `const arr = nums(1);
const MOD = 1000000007n;

function sumSubarrayMins(arr) {
  // your code here
}

console.log(sumSubarrayMins(arr));`,
      `arr = nums(1)
MOD = 1000000007

def sum_subarray_mins(arr):
    # your code here
    pass

print(sum_subarray_mins(arr))`,
    ),
    solution: solution(
      `const arr = nums(1);
const MOD = 1000000007n;
const n = arr.length;
const left = new Array(n), right = new Array(n);
let stack = [];
for (let i = 0; i < n; i++) {
  while (stack.length && arr[stack[stack.length - 1]] >= arr[i]) stack.pop();
  left[i] = stack.length ? i - stack[stack.length - 1] : i + 1;
  stack.push(i);
}
stack = [];
for (let i = n - 1; i >= 0; i--) {
  while (stack.length && arr[stack[stack.length - 1]] > arr[i]) stack.pop();
  right[i] = stack.length ? stack[stack.length - 1] - i : n - i;
  stack.push(i);
}
let total = 0n;
for (let i = 0; i < n; i++) total = (total + BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i])) % MOD;
console.log(total.toString());`,
      `arr = nums(1)
MOD = 1000000007
n = len(arr)
left = [0] * n
right = [0] * n
stack = []
for i in range(n):
    while stack and arr[stack[-1]] >= arr[i]:
        stack.pop()
    left[i] = i - stack[-1] if stack else i + 1
    stack.append(i)
stack = []
for i in range(n - 1, -1, -1):
    while stack and arr[stack[-1]] > arr[i]:
        stack.pop()
    right[i] = stack[-1] - i if stack else n - i
    stack.append(i)
total = 0
for i in range(n):
    total = (total + arr[i] * left[i] * right[i]) % MOD
print(total)`,
    ),
    testCases: [
      sample('4\n3 1 2 4', '17'),
      sample('5\n11 81 94 43 3', '444'),
      hidden('1\n5', '5'),
      hidden('2\n2 2', '6'),
      hidden('3\n1 2 3', '10'),
      hidden('3\n3 2 1', '10'),
    ],
  },
];
