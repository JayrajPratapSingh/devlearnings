import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Queue — expansion batch. Rounds out the category beyond the original one
 * (Sliding Window Maximum) with the classic queue-based designs (circular
 * queue, hit counter, moving average), queue-driven simulations (Dota2
 * Senate, ticket buying), and multi-source BFS-via-queue (Rotting Oranges,
 * 01 Matrix, Perfect Squares).
 */
export const dsaExtraQueue: SeedProblem[] = [
  {
    slug: 'design-circular-queue',
    title: 'Design Circular Queue',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Implement a circular queue of fixed capacity `k` supporting `enQueue x`, `deQueue`, `Front`, `Rear`, `isEmpty`, and `isFull`.\n\n**Input**\n- Line 1: `k`\n- Line 2: `q`\n- Next `q` lines: one operation each\n\n**Output**\nFor `enQueue`/`deQueue`, print `true` or `false` (whether it succeeded). For `Front`/`Rear`, print the value or `-1` if empty. For `isEmpty`/`isFull`, print `true` or `false`.',
    descriptionHi:
      'Fixed capacity `k` ki ek circular queue implement karo jo `enQueue x`, `deQueue`, `Front`, `Rear`, `isEmpty`, aur `isFull` support kare.\n\n**Input**\n- Line 1: `k`\n- Line 2: `q`\n- Agli `q` lines: har ek operation\n\n**Output**\n`enQueue`/`deQueue` ke liye `true` ya `false` print karo (kaamyaab hua ya nahi). `Front`/`Rear` ke liye value ya khaali hone par `-1`. `isEmpty`/`isFull` ke liye `true` ya `false`.',
    examples: [
      {
        input: '3\n9\nenQueue 1\nenQueue 2\nenQueue 3\nenQueue 4\nRear\nisFull\ndeQueue\nenQueue 4\nRear',
        output: 'true\ntrue\ntrue\nfalse\n3\ntrue\ntrue\ntrue\n4',
      },
    ],
    constraints: ['1 <= k <= 1000', '1 <= q <= 3000'],
    hints: [
      'A plain array with shift/unshift works but is O(n) per operation — the "circular" part exists to make it O(1).',
      'Keep a fixed-size array, a `head` index, a `count` of elements, and compute the tail position as `(head + count) % k`.',
      'Every operation is then just index arithmetic and a bounds check against `count` — no shifting of existing elements ever needed.',
    ],
    approach:
      'A fixed-size array of length `k`, a `head` index, and a `count` of current elements. `enQueue` writes to `(head + count) % k` and increments `count` (if not full). `deQueue` advances `head` by one (mod `k`) and decrements `count` (if not empty). `Front` and `Rear` read `head` and `(head + count - 1) % k` respectively.',
    approachHi:
      'Length `k` ka fixed-size array, ek `head` index, aur current elements ka ek `count`. `enQueue` `(head + count) % k` par likhta hai aur `count` badhata hai (agar full nahi hai). `deQueue` `head` ko ek se badhata hai (mod `k`) aur `count` ghataata hai (agar khaali nahi hai). `Front` aur `Rear` respectively `head` aur `(head + count - 1) % k` padhte hain.',
    timeComplexity: 'O(1) per operation',
    spaceComplexity: 'O(k)',
    solutionExplanation:
      'The "circular" idea is what makes a fixed-size array behave like an unbounded queue without ever shifting elements: instead of always inserting at index 0 and physically moving everything over on dequeue, the logical start (`head`) simply moves forward and wraps via modulo, so the same k memory slots get reused indefinitely as elements come and go.',
    solutionExplanationHi:
      '"Circular" idea hi ek fixed-size array ko elements shift kiye bina unbounded queue jaisa banata hai: hamesha index 0 par insert karke dequeue par sab kuch physically move karne ke bajaye, logical start (`head`) bas aage badhta hai aur modulo se wrap karta hai — isliye wahi k memory slots elements aane-jaane par baar-baar reuse hote hain.',
    starter: starter(
      `const k = num(0);
const q = num(1);

const buf = new Array(k);
let head = 0, count = 0;
const out = [];
for (let i = 0; i < q; i++) {
  const parts = line(2 + i).split(' ');
  const op = parts[0];
  // your code here: handle "enQueue", "deQueue", "Front", "Rear", "isEmpty", "isFull"
}
console.log(out.join('\\n'));`,
      `k = num(0)
q = num(1)

buf = [None] * k
head = 0
count = 0
out = []
for i in range(q):
    parts = line(2 + i).split()
    op = parts[0]
    # your code here: handle "enQueue", "deQueue", "Front", "Rear", "isEmpty", "isFull"

print("\\n".join(out))`,
    ),
    solution: solution(
      `const k = num(0);
const q = num(1);
const buf = new Array(k);
let head = 0, count = 0;
const out = [];
for (let i = 0; i < q; i++) {
  const parts = line(2 + i).split(' ');
  const op = parts[0];
  if (op === 'enQueue') {
    if (count === k) out.push('false');
    else { buf[(head + count) % k] = Number(parts[1]); count++; out.push('true'); }
  } else if (op === 'deQueue') {
    if (count === 0) out.push('false');
    else { head = (head + 1) % k; count--; out.push('true'); }
  } else if (op === 'Front') {
    out.push(count === 0 ? '-1' : String(buf[head]));
  } else if (op === 'Rear') {
    out.push(count === 0 ? '-1' : String(buf[(head + count - 1) % k]));
  } else if (op === 'isEmpty') {
    out.push(String(count === 0));
  } else if (op === 'isFull') {
    out.push(String(count === k));
  }
}
console.log(out.join('\\n'));`,
      `k = num(0)
q = num(1)
buf = [None] * k
head = 0
count = 0
out = []
for i in range(q):
    parts = line(2 + i).split()
    op = parts[0]
    if op == "enQueue":
        if count == k:
            out.append("false")
        else:
            buf[(head + count) % k] = int(parts[1])
            count += 1
            out.append("true")
    elif op == "deQueue":
        if count == 0:
            out.append("false")
        else:
            head = (head + 1) % k
            count -= 1
            out.append("true")
    elif op == "Front":
        out.append("-1" if count == 0 else str(buf[head]))
    elif op == "Rear":
        out.append("-1" if count == 0 else str(buf[(head + count - 1) % k]))
    elif op == "isEmpty":
        out.append(str(count == 0).lower())
    elif op == "isFull":
        out.append(str(count == k).lower())
print("\\n".join(out))`,
    ),
    testCases: [
      sample(
        '3\n9\nenQueue 1\nenQueue 2\nenQueue 3\nenQueue 4\nRear\nisFull\ndeQueue\nenQueue 4\nRear',
        'true\ntrue\ntrue\nfalse\n3\ntrue\ntrue\ntrue\n4',
      ),
      hidden('1\n3\nenQueue 5\nFront\nisFull', 'true\n5\ntrue'),
      hidden('2\n2\ndeQueue\nisEmpty', 'false\ntrue'),
      hidden('2\n4\nenQueue 1\nenQueue 2\ndeQueue\nFront', 'true\ntrue\ntrue\n2'),
    ],
  },

  {
    slug: 'number-of-recent-calls',
    title: 'Number of Recent Calls',
    category: 'Queue',
    difficulty: 'EASY',
    description:
      'Each `ping t` call happens at a non-decreasing timestamp `t` (milliseconds). For each call, return the number of pings (including this one) that occurred in the inclusive window `[t - 3000, t]`.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: `ping t`\n\n**Output**\nOne count per `ping` call, in order.',
    descriptionHi:
      'Har `ping t` call ek non-decreasing timestamp `t` (milliseconds) par hoti hai. Har call ke liye, inclusive window `[t - 3000, t]` mein hui pings ki sankhya (ye call samet) return karo.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: `ping t`\n\n**Output**\nHar `ping` call ke liye ek count, order mein.',
    examples: [
      { input: '4\nping 1\nping 100\nping 3001\nping 3002', output: '1\n2\n3\n3' },
    ],
    constraints: ['1 <= q <= 10^4', '1 <= t <= 10^9', 'Calls arrive with non-decreasing t'],
    hints: [
      'Timestamps only ever arrive in non-decreasing order — old pings can be discarded permanently once they fall out of the window.',
      'A queue of timestamps naturally supports this: append the new timestamp, then discard from the front anything older than `t - 3000`.',
      'After discarding, the queue\'s size is exactly the answer for this call.',
    ],
    approach:
      'Maintain a queue of past timestamps. On each `ping t`, push `t` onto the back, then pop from the front any timestamp strictly less than `t - 3000`. The queue\'s length after popping is the answer.',
    approachHi:
      'Past timestamps ki ek queue rakho. Har `ping t` par, `t` ko peeche push karo, phir front se aisa koi bhi timestamp pop karo jo `t - 3000` se strictly kam hai. Pop karne ke baad queue ki length hi answer hai.',
    timeComplexity: 'O(1) amortised per call',
    spaceComplexity: 'O(q)',
    solutionExplanation:
      'Because timestamps are non-decreasing, once a timestamp falls outside the trailing 3000ms window, it can never re-enter the window for any future call either — so it is safe to permanently discard it rather than merely ignore it, and doing so from the front of a queue (the oldest entries) keeps the queue containing exactly the pings still relevant, with each timestamp pushed once and popped at most once overall.',
    solutionExplanationHi:
      'Chunki timestamps non-decreasing hain, ek baar koi timestamp trailing 3000ms window se bahar chala jaaye to wo kisi bhi future call ke liye dobara window mein nahi aa sakta — isliye use sirf ignore karne ke bajaye permanently discard karna safe hai, aur ye queue ke front se (sabse purane entries) karna, queue ko exactly wahi pings rakhta hai jo abhi relevant hain, har timestamp overall ek baar push aur zyada se zyada ek baar pop hota hai.',
    starter: starter(
      `const q = num(0);

const window = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const t = Number(line(i).split(' ')[1]);
  // your code here: push t, discard stale entries from the front, record window.length
}
console.log(out.join('\\n'));`,
      `q = num(0)

window = []
out = []
for i in range(1, q + 1):
    t = int(line(i).split()[1])
    # your code here: append t, discard stale entries from the front, record len(window)

print("\\n".join(map(str, out)))`,
    ),
    solution: solution(
      `const q = num(0);
const window = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const t = Number(line(i).split(' ')[1]);
  window.push(t);
  while (window[0] < t - 3000) window.shift();
  out.push(window.length);
}
console.log(out.join('\\n'));`,
      `from collections import deque
q = num(0)
window = deque()
out = []
for i in range(1, q + 1):
    t = int(line(i).split()[1])
    window.append(t)
    while window[0] < t - 3000:
        window.popleft()
    out.append(len(window))
print("\\n".join(map(str, out)))`,
    ),
    testCases: [
      sample('4\nping 1\nping 100\nping 3001\nping 3002', '1\n2\n3\n3'),
      hidden('1\nping 1', '1'),
      hidden('3\nping 1\nping 2\nping 3', '1\n2\n3'),
      hidden('2\nping 1\nping 3002', '1\n1'),
    ],
  },

  {
    slug: 'moving-average-from-data-stream',
    title: 'Moving Average from Data Stream',
    category: 'Queue',
    difficulty: 'EASY',
    description:
      'Given a window `size`, compute the moving average of the last `size` values seen so far after each new value arrives (using fewer values if fewer than `size` have arrived yet). Print each average to 5 decimal places.\n\n**Input**\n- Line 1: `size`\n- Line 2: `q`\n- Next `q` lines: one integer value each\n\n**Output**\nOne moving average per value, formatted to 5 decimal places.',
    descriptionHi:
      'Ek window `size` diya hai. Har naya value aane ke baad, ab tak dekhe gaye aakhri `size` values ka moving average compute karo (agar `size` se kam values aayi hain to jitni hain utni use karo). Har average ko 5 decimal places tak print karo.\n\n**Input**\n- Line 1: `size`\n- Line 2: `q`\n- Agli `q` lines: har ek integer value\n\n**Output**\nHar value ke liye ek moving average, 5 decimal places tak formatted.',
    examples: [
      { input: '3\n4\n1\n10\n3\n5', output: '1.00000\n5.50000\n4.66667\n6.00000' },
    ],
    constraints: ['1 <= size <= 1000', '1 <= q <= 10^4', '-10^5 <= value <= 10^5'],
    hints: [
      'A fixed-size sliding window over the incoming stream — maintain a running sum.',
      'Push the new value and add it to the running sum; if the window now exceeds `size`, pop the oldest value and subtract it.',
      'The average is always the running sum divided by the current window length (which may be less than `size` early on).',
    ],
    approach:
      'Maintain a queue of the most recent values and a running sum. On each new value, push it and add to the sum; if the queue\'s length exceeds `size`, pop the oldest and subtract it from the sum. Print `sum / queue.length`.',
    approachHi:
      'Sabse recent values ki ek queue aur ek running sum rakho. Har naye value par, use push karo aur sum mein jodo; agar queue ki length `size` se zyada ho jaaye, sabse purana pop karo aur sum se ghatao. `sum / queue.length` print karo.',
    timeComplexity: 'O(1) per value',
    spaceComplexity: 'O(size)',
    solutionExplanation:
      'This is the same incremental-sum idea as the fixed-size sliding window in Maximum Sum Subarray of Size K, adapted to a live stream instead of a fixed array: the queue holds exactly the values currently inside the window, and maintaining a running sum avoids re-summing the whole window on every new value, which would make each step cost O(size) instead of O(1).',
    solutionExplanationHi:
      'Ye bilkul Maximum Sum Subarray of Size K wali incremental-sum idea hai, bas fixed array ki jagah ek live stream par — queue mein exactly wahi values hoti hain jo abhi window ke andar hain, aur running sum rakhna har naye value par poori window dobara sum karne se bachaata hai, jo har step ko O(size) bana deta, O(1) nahi.',
    starter: starter(
      `const size = num(0);
const q = num(1);

const window = [];
let sum = 0;
const out = [];
for (let i = 0; i < q; i++) {
  const x = num(2 + i);
  // your code here: maintain window and sum, then out.push((sum / window.length).toFixed(5))
}
console.log(out.join('\\n'));`,
      `size = num(0)
q = num(1)

window = []
total = 0
out = []
for i in range(q):
    x = num(2 + i)
    # your code here: maintain window and total, then out.append(f"{total / len(window):.5f}")

print("\\n".join(out))`,
    ),
    solution: solution(
      `const size = num(0);
const q = num(1);
const window = [];
let sum = 0;
const out = [];
for (let i = 0; i < q; i++) {
  const x = num(2 + i);
  window.push(x);
  sum += x;
  if (window.length > size) sum -= window.shift();
  out.push((sum / window.length).toFixed(5));
}
console.log(out.join('\\n'));`,
      `from collections import deque
size = num(0)
q = num(1)
window = deque()
total = 0
out = []
for i in range(q):
    x = num(2 + i)
    window.append(x)
    total += x
    if len(window) > size:
        total -= window.popleft()
    out.append(f"{total / len(window):.5f}")
print("\\n".join(out))`,
    ),
    testCases: [
      sample('3\n4\n1\n10\n3\n5', '1.00000\n5.50000\n4.66667\n6.00000'),
      hidden('1\n2\n5\n7', '5.00000\n7.00000'),
      hidden('5\n2\n1\n2', '1.00000\n1.50000'),
      hidden('2\n3\n4\n4\n4', '4.00000\n4.00000\n4.00000'),
    ],
  },

  {
    slug: 'implement-stack-using-queues',
    title: 'Implement Stack using Queues',
    category: 'Queue',
    difficulty: 'EASY',
    description:
      'Implement a LIFO stack using only queues. Process a sequence of `push x`, `pop`, `top`, and `empty` operations, printing the result of every `pop`, `top`, and `empty`.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: one operation each\n\n**Output**\nOne line for every `pop`, `top`, or `empty` operation, in order.',
    descriptionHi:
      'Sirf queues use karke ek LIFO stack implement karo. `push x`, `pop`, `top`, aur `empty` operations ki sequence process karo, har `pop`, `top`, aur `empty` ka result print karte hue.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: har ek operation\n\n**Output**\nHar `pop`, `top`, ya `empty` ke liye ek line, order mein.',
    examples: [
      { input: '4\npush 1\npush 2\ntop\npop', output: '2\n2' },
    ],
    constraints: ['1 <= q <= 100', '`pop` and `top` are never called on an empty stack'],
    hints: [
      'A single queue reverses nothing on its own — FIFO order is the opposite of what a stack needs.',
      'After pushing a new element to the back of the queue, rotate the queue so that new element moves to the front.',
      'Rotating means repeatedly moving the front element to the back, exactly (queue.length - 1) times, right after every push.',
    ],
    approach:
      'Use a single queue. On `push x`, enqueue `x`, then rotate the queue by dequeuing and re-enqueuing every other element (`size - 1` times) so the just-pushed element ends up at the front. `pop`, `top`, and `empty` then simply operate on the front of the queue.',
    approachHi:
      'Ek hi queue use karo. `push x` par, `x` ko enqueue karo, phir queue ko rotate karo — baaki har element ko dequeue karke wapas enqueue karo (`size - 1` baar) taaki abhi push hua element front par aa jaaye. `pop`, `top`, aur `empty` phir seedhe queue ke front par operate karte hain.',
    timeComplexity: 'O(n) per push, O(1) for pop/top/empty',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Since a queue only ever exposes its front, the trick is to do the reordering work at push time instead of at pop time: rotating the entire queue right after inserting moves the brand-new element all the way to the front, ahead of everything already there, so the queue\'s front always matches what a real stack\'s top would be — the cost of LIFO order is paid once per push (O(n)) so that every pop and top is a trivial O(1) front read.',
    solutionExplanationHi:
      'Chunki queue sirf apna front expose karta hai, trick ye hai ki reordering ka kaam pop time par nahi, push time par ho: insert karne ke turant baad poori queue rotate karna naye element ko sabse aage, pehle se maujood sab se aage, le aata hai — isliye queue ka front hamesha wahi hota hai jo ek real stack ka top hota. LIFO order ki keemat har push par ek baar chukayi jaati hai (O(n)), taaki har pop aur top ek trivial O(1) front-read ban jaaye.',
    starter: starter(
      `const q = num(0);

const queue = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  // your code here: handle "push" (with rotation), "pop", "top", "empty"
}
console.log(out.join('\\n'));`,
      `q = num(0)

queue = []
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    # your code here: handle "push" (with rotation), "pop", "top", "empty"

print("\\n".join(out))`,
    ),
    solution: solution(
      `const q = num(0);
const queue = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0];
  if (op === 'push') {
    queue.push(Number(parts[1]));
    for (let j = 0; j < queue.length - 1; j++) queue.push(queue.shift());
  } else if (op === 'pop') {
    out.push(String(queue.shift()));
  } else if (op === 'top') {
    out.push(String(queue[0]));
  } else if (op === 'empty') {
    out.push(String(queue.length === 0));
  }
}
console.log(out.join('\\n'));`,
      `from collections import deque
q = num(0)
queue = deque()
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op = parts[0]
    if op == "push":
        queue.append(int(parts[1]))
        for _ in range(len(queue) - 1):
            queue.append(queue.popleft())
    elif op == "pop":
        out.append(str(queue.popleft()))
    elif op == "top":
        out.append(str(queue[0]))
    elif op == "empty":
        out.append(str(len(queue) == 0).lower())
print("\\n".join(out))`,
    ),
    testCases: [
      sample('4\npush 1\npush 2\ntop\npop', '2\n2'),
      hidden('3\npush 1\npush 2\npop', '2'),
      hidden('2\npush 5\nempty', 'false'),
      hidden('1\nempty', 'true'),
      hidden('5\npush 1\npush 2\npush 3\npop\ntop', '3\n2'),
    ],
  },

  {
    slug: 'first-unique-number-in-stream',
    title: 'First Unique Number in a Stream',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Numbers arrive one at a time. After each arrival, report the first number added so far that has not yet repeated, or `-1` if every number so far has a duplicate.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers, arriving in this order\n\n**Output**\nOne answer per arrival, space-separated.',
    descriptionHi:
      'Numbers ek-ek karke aate hain. Har arrival ke baad, ab tak add hua wo pehla number batao jo abhi tak repeat nahi hua, ya `-1` agar ab tak ka har number duplicate ho chuka hai.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers, isi order mein aate hue\n\n**Output**\nHar arrival ke liye ek answer, space se separate.',
    examples: [
      { input: '5\n2 3 5 3 2', output: '2 2 2 2 5' },
    ],
    constraints: ['1 <= n <= 10^5', '-10^9 <= value <= 10^9'],
    hints: [
      'Re-scanning all numbers seen so far after every arrival is O(n) per step, O(n^2) total.',
      'Keep a queue of candidates in arrival order, and a frequency count of every number seen.',
      'When checking the front of the queue, discard it if its count is now more than 1, and keep discarding until the front is genuinely unique (or the queue is empty).',
    ],
    approach:
      'Maintain a frequency map and a queue of numbers in the order they first arrived. On each new number, increment its count and push it onto the queue if this is its first appearance. Before answering, pop from the front of the queue any number whose count has become `> 1`; the new front (if any) is the answer, or `-1` if the queue is empty.',
    approachHi:
      'Ek frequency map aur numbers ki ek queue (jis order mein pehli baar aaye) rakho. Har naye number par, uska count badhao aur agar ye pehli appearance hai to queue mein push karo. Answer dene se pehle, queue ke front se aisa koi bhi number pop karo jiska count `> 1` ho chuka hai; naya front (agar hai) answer hai, ya `-1` agar queue khaali hai.',
    timeComplexity: 'O(1) amortised per arrival',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'A number that has become a duplicate can never become "the first unique" again, so once it is found stale at the front of the queue it can be discarded permanently rather than just skipped — this lazy-cleanup approach means each number is pushed once and popped at most once over the whole stream, giving amortised O(1) per arrival instead of a full O(n) re-scan every time.',
    solutionExplanationHi:
      'Ek number jo duplicate ban chuka hai wo kabhi "first unique" dobara nahi ban sakta, isliye queue ke front par stale milte hi use permanently discard kiya ja sakta hai, sirf skip nahi — is lazy-cleanup approach ka matlab hai ki poori stream mein har number ek baar push aur zyada se zyada ek baar pop hota hai, jisse har arrival par amortised O(1) milta hai, har baar poora O(n) re-scan nahi.',
    starter: starter(
      `const arr = nums(1);

function firstUniqueStream(arr) {
  // return an array of answers, one per arrival
  return [];
}

console.log(firstUniqueStream(arr).join(' '));`,
      `arr = nums(1)

def first_unique_stream(arr):
    # return a list of answers, one per arrival
    return []

print(" ".join(map(str, first_unique_stream(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
const count = new Map();
const queue = [];
const out = [];
for (const x of arr) {
  count.set(x, (count.get(x) ?? 0) + 1);
  if (count.get(x) === 1) queue.push(x);
  while (queue.length && count.get(queue[0]) > 1) queue.shift();
  out.push(queue.length ? queue[0] : -1);
}
console.log(out.join(' '));`,
      `from collections import deque
arr = nums(1)
count = {}
queue = deque()
out = []
for x in arr:
    count[x] = count.get(x, 0) + 1
    if count[x] == 1:
        queue.append(x)
    while queue and count[queue[0]] > 1:
        queue.popleft()
    out.append(queue[0] if queue else -1)
print(" ".join(map(str, out)))`,
    ),
    testCases: [
      sample('5\n2 3 5 3 2', '2 2 2 2 5'),
      hidden('1\n7', '7'),
      hidden('3\n1 1 1', '1 -1 -1'),
      hidden('4\n1 2 1 2', '1 1 2 -1'),
      hidden('4\n4 5 6 5', '4 4 4 4'),
    ],
  },

  {
    slug: 'task-scheduler',
    title: 'Task Scheduler',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Given a string of tasks (each character a task type) and a cooldown `n` (the same task type must be separated by at least `n` intervals, filled with other tasks or idle slots), find the minimum number of intervals needed to finish all tasks.\n\n**Input**\n- Line 1: the tasks string\n- Line 2: `n`\n\n**Output**\nThe minimum number of intervals.',
    descriptionHi:
      'Tasks ki ek string (har character ek task type) aur cooldown `n` diya hai (same task type ke beech kam se kam `n` intervals hone chahiye, doosre tasks ya idle slots se bhare hue). Saare tasks poore karne ke liye minimum intervals chahiye, wo batao.\n\n**Input**\n- Line 1: tasks string\n- Line 2: `n`\n\n**Output**\nMinimum intervals.',
    examples: [
      { input: 'AAABBB\n2', output: '8' },
      { input: 'AAABBB\n0', output: '6' },
    ],
    constraints: ['1 <= length <= 10^4', '0 <= n <= 100'],
    hints: [
      'The most frequent task type dictates the overall structure: it needs (maxFreq - 1) cooldown gaps after its first (maxFreq - 1) occurrences.',
      'Each gap is `n` slots wide; other tasks (including other tasks tied for the max frequency) fill those gaps.',
      'If there are more total tasks than the gap structure can hold, no idle slots are needed at all — the answer is just the total task count.',
    ],
    approach:
      'Count task frequencies. Let `maxFreq` be the highest frequency and `maxCount` the number of task types that reach it. The gap-based lower bound is `(maxFreq - 1) * (n + 1) + maxCount` (the last group of max-frequency tasks needs no trailing gap). The answer is the larger of that bound and the total number of tasks (since enough distinct tasks can fill every gap with no idling at all).',
    approachHi:
      'Task frequencies count karo. `maxFreq` sabse zyada frequency ho, aur `maxCount` un task types ki sankhya jo wahan tak pahunchte hain. Gap-based lower bound hai `(maxFreq - 1) * (n + 1) + maxCount` (max-frequency tasks ke aakhri group ko trailing gap ki zaroorat nahi). Answer us bound aur total tasks ki sankhya mein se bada hai (kyunki kaafi distinct tasks har gap ko bina idle kiye bhar sakte hain).',
    timeComplexity: 'O(n) to count frequencies (24-letter alphabet), O(1) for the formula',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Imagine arranging the most frequent task with mandatory gaps of size n between occurrences — that skeleton has (maxFreq - 1) gaps of width n, plus the maxFreq slots themselves, plus one extra slot per additional task type that ties for the same max frequency (since each of those also needs its own trailing slot in the final group). Other, less-frequent tasks are only ever used to *fill* those gaps, never to lengthen the schedule, so once there are enough total tasks to fill every gap with no idling left over, the answer collapses to simply the total task count — which is exactly why the final answer takes the max of the two quantities.',
    solutionExplanationHi:
      'Sabse frequent task ko occurrences ke beech mandatory size-n gaps ke saath arrange karne ka socho — is skeleton mein (maxFreq - 1) gaps hain width n ke, plus khud maxFreq slots, plus same max frequency tie karne wale har extra task type ke liye ek extra slot (kyunki unhe bhi final group mein apna trailing slot chahiye). Doosre, kam-frequent tasks sirf un gaps ko *bharne* ke liye use hote hain, schedule lamba karne ke liye nahi — isliye jaise hi itne total tasks ho jaayein ki har gap bina idle chhode bhar jaaye, answer seedha total task count ban jaata hai. Yahi wajah hai ki final answer dono quantities ka max leta hai.',
    starter: starter(
      `const tasks = line(0);
const n = num(1);

function leastInterval(tasks, n) {
  // your code here
}

console.log(leastInterval(tasks, n));`,
      `tasks = line(0)
n = num(1)

def least_interval(tasks, n):
    # your code here
    pass

print(least_interval(tasks, n))`,
    ),
    solution: solution(
      `const tasks = line(0);
const n = num(1);
const count = new Map();
for (const c of tasks) count.set(c, (count.get(c) ?? 0) + 1);
const freqs = [...count.values()];
const maxFreq = Math.max(...freqs);
const maxCount = freqs.filter((f) => f === maxFreq).length;
const bound = (maxFreq - 1) * (n + 1) + maxCount;
console.log(Math.max(bound, tasks.length));`,
      `tasks = line(0)
n = num(1)
from collections import Counter
count = Counter(tasks)
freqs = list(count.values())
max_freq = max(freqs)
max_count = sum(1 for f in freqs if f == max_freq)
bound = (max_freq - 1) * (n + 1) + max_count
print(max(bound, len(tasks)))`,
    ),
    testCases: [
      sample('AAABBB\n2', '8'),
      sample('AAABBB\n0', '6'),
      hidden('A\n0', '1'),
      hidden('AAAAA\n2', '13'),
      hidden('AABBCC\n0', '6'),
      hidden('AAABBBCCCDDD\n2', '12'),
    ],
  },

  {
    slug: 'dota2-senate',
    title: 'Dota2 Senate',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Senators are `R` (Radiant) or `D` (Dire), voting in a repeating circle. On their turn, a senator may ban any one remaining senator from voting for the rest of the game (a senator can ban an opponent, never a same-party senator). The game ends when only one party remains; that party wins.\n\n**Input**\nOne line containing the string of `R` and `D` characters, in initial voting order.\n\n**Output**\n`Radiant` or `Dire`.',
    descriptionHi:
      'Senators `R` (Radiant) ya `D` (Dire) hain, ek repeating circle mein vote karte hain. Apni turn par, ek senator kisi bhi baaki senator ko baaki poore game ke liye vote karne se ban kar sakta hai (senator sirf opponent ko ban kar sakta hai, apni hi party wale ko nahi). Game tab khatam hoti hai jab sirf ek hi party bache; wahi jeetti hai.\n\n**Input**\nEk line jisme `R` aur `D` characters ki string hai, initial voting order mein.\n\n**Output**\n`Radiant` ya `Dire`.',
    examples: [
      { input: 'RD', output: 'Radiant' },
      { input: 'RDD', output: 'Dire' },
    ],
    constraints: ['1 <= length <= 10^4', 'Only characters R and D'],
    hints: [
      'Every senator, given the choice, should always ban the opponent who would otherwise vote soonest (right after them in the rotation).',
      'Two queues of indices (one per party) let you always compare "whose next turn comes first" in O(1).',
      'The senator with the earlier index bans the other; the surviving senator rejoins the back of the queue with an index bumped by the total senator count (to correctly represent "next round").',
    ],
    approach:
      'Two queues holding the original indices of R and D senators, in order. Repeatedly compare the fronts: whichever index is smaller acts first, banning the other party\'s front senator (removing it), and the surviving senator is pushed to the back of its own queue with `n` added to its index (placing it correctly after everyone in the current round). The party whose queue empties first loses.',
    approachHi:
      'R aur D senators ke original indices ki do queues, order mein. Baar-baar fronts compare karo: jiska index chhota hai wo pehle act karta hai, doosri party ke front senator ko ban karta hai (hata deta hai), aur bachne wala senator apni hi queue ke peeche push hota hai, `n` uske index mein jodkar (taaki wo current round ke sabse baad sahi jagah aa jaaye). Jis party ki queue pehle khaali ho jaati hai wo haar jaati hai.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Greedily banning the opponent who would otherwise act next is always optimal, since delaying that ban only gives the opponent a free turn to ban one of your own senators first — so comparing the two queues\' front indices directly identifies who acts first. Re-inserting the survivor with `+n` added to its index is what correctly schedules it to act again only after every currently-alive senator from this round has had their turn, simulating the repeating circle without an explicit round counter.',
    solutionExplanationHi:
      'Us opponent ko greedily ban karna jo warna agla act karta, hamesha optimal hai, kyunki ban delay karne se opponent ko pehle apne kisi senator ko ban karne ka free turn mil jaata. Isliye dono queues ke front indices compare karna seedha bata deta hai kaun pehle act karega. Survivor ko `+n` index ke saath wapas insert karna use sahi tarah tab tak schedule karta hai jab tak is round ke sabhi zinda senators apni turn na le lein — bina kisi explicit round counter ke repeating circle simulate ho jaata hai.',
    starter: starter(
      `const senate = line(0);

function predictPartyVictory(senate) {
  // your code here
}

console.log(predictPartyVictory(senate));`,
      `senate = line(0)

def predict_party_victory(senate):
    # your code here
    pass

print(predict_party_victory(senate))`,
    ),
    solution: solution(
      `const senate = line(0);
const n = senate.length;
const radiant = [], dire = [];
for (let i = 0; i < n; i++) (senate[i] === 'R' ? radiant : dire).push(i);
while (radiant.length && dire.length) {
  const r = radiant.shift(), d = dire.shift();
  if (r < d) radiant.push(r + n); else dire.push(d + n);
}
console.log(radiant.length ? 'Radiant' : 'Dire');`,
      `from collections import deque
senate = line(0)
n = len(senate)
radiant, dire = deque(), deque()
for i, c in enumerate(senate):
    (radiant if c == "R" else dire).append(i)
while radiant and dire:
    r = radiant.popleft()
    d = dire.popleft()
    if r < d:
        radiant.append(r + n)
    else:
        dire.append(d + n)
print("Radiant" if radiant else "Dire")`,
    ),
    testCases: [
      sample('RD', 'Radiant'),
      sample('RDD', 'Dire'),
      hidden('R', 'Radiant'),
      hidden('D', 'Dire'),
      hidden('RRDD', 'Radiant'),
      hidden('DDRR', 'Dire'),
    ],
  },

  {
    slug: 'reveal-cards-in-increasing-order',
    title: 'Reveal Cards In Increasing Order',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'You must arrange a deck of cards so that repeatedly doing "reveal the top card, then move the new top card to the bottom" reveals the cards in increasing order. Given the deck, output that required arrangement.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (the deck, in any order)\n\n**Output**\nThe required arrangement, space-separated.',
    descriptionHi:
      'Cards ka ek deck aisa arrange karna hai ki baar-baar "top card reveal karo, phir naye top card ko neeche le jao" karne se cards increasing order mein reveal hon. Deck diya hai, wo required arrangement print karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers (deck, kisi bhi order mein)\n\n**Output**\nRequired arrangement, space se separate.',
    examples: [
      { input: '7\n17 13 11 2 3 5 7', output: '2 13 3 11 5 17 7' },
      { input: '2\n1 1000', output: '1 1000' },
    ],
    constraints: ['1 <= n <= 1000', 'All values distinct'],
    hints: [
      'The values that will be revealed, in order, are simply the deck sorted ascending — that part is easy.',
      'The hard part is finding which original *position* gets each sorted value; simulate the reveal process backward using index positions instead of card values.',
      'Run the reveal/move-to-bottom simulation with a queue of positions `0..n-1`; the order positions get "revealed" is the order sorted values get assigned to them.',
    ],
    approach:
      'Sort the deck ascending — this fixes the order values must be revealed in. Then simulate the actual reveal process using a queue of index positions `0, 1, ..., n-1`: repeatedly pop the front position (it gets the next sorted value, in order) and, if positions remain, move the new front to the back. Finally, place each sorted value at its assigned position.',
    approachHi:
      'Deck ko ascending sort karo — isse values ka reveal order tay ho jaata hai. Phir index positions `0, 1, ..., n-1` ki queue se asli reveal process simulate karo: front position pop karo (usko agli sorted value milegi, order mein) aur, agar positions bache hain, naye front ko peeche le jao. Aakhir mein har sorted value ko uski assigned position par rakh do.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The reveal order only depends on the *rule* (reveal, then rotate), not on the actual card values — so simulating that rule on abstract position indices first determines exactly which original slot gets the 1st, 2nd, 3rd, etc. revealed value, completely decoupled from what those values are. Only after that assignment is known does sorting the actual deck and dropping sorted values into their assigned positions produce the final answer.',
    solutionExplanationHi:
      'Reveal order sirf *rule* (reveal karo, phir rotate karo) par depend karta hai, actual card values par nahi — isliye pehle abstract position indices par wahi rule simulate karna exactly bata deta hai ki kaunsi original slot ko 1st, 2nd, 3rd, etc. revealed value milegi, values kya hain usse bilkul alag. Ye assignment pata chalne ke baad hi, asli deck sort karke sorted values ko unki assigned positions mein daalne se final answer milta hai.',
    starter: starter(
      `const deck = nums(1);

function deckRevealedIncreasing(deck) {
  // return the required arrangement
  return [];
}

console.log(deckRevealedIncreasing(deck).join(' '));`,
      `deck = nums(1)

def deck_revealed_increasing(deck):
    # return the required arrangement
    return []

print(" ".join(map(str, deck_revealed_increasing(deck))))`,
    ),
    solution: solution(
      `const deck = [...nums(1)].sort((a, b) => a - b);
const n = deck.length;
const positions = Array.from({ length: n }, (_, i) => i);
const result = new Array(n);
let i = 0;
while (positions.length) {
  result[positions.shift()] = deck[i++];
  if (positions.length) positions.push(positions.shift());
}
console.log(result.join(' '));`,
      `from collections import deque
deck = sorted(nums(1))
n = len(deck)
positions = deque(range(n))
result = [0] * n
i = 0
while positions:
    result[positions.popleft()] = deck[i]
    i += 1
    if positions:
        positions.append(positions.popleft())
print(" ".join(map(str, result)))`,
    ),
    testCases: [
      sample('7\n17 13 11 2 3 5 7', '2 13 3 11 5 17 7'),
      sample('2\n1 1000', '1 1000'),
      hidden('1\n42', '42'),
      hidden('3\n3 1 2', '1 3 2'),
      hidden('4\n4 3 2 1', '1 3 2 4'),
      hidden('5\n5 4 3 2 1', '1 5 2 4 3'),
    ],
  },

  {
    slug: 'time-needed-to-buy-tickets',
    title: 'Time Needed to Buy Tickets',
    category: 'Queue',
    difficulty: 'EASY',
    description:
      'People stand in a circular line, each wanting to buy `tickets[i]` tickets. Each person buys exactly one ticket per turn, then moves to the back of the line (or leaves if done), and the process continues until the person originally at index `k` has bought all their tickets. Return the total number of tickets bought (time units elapsed) by that point.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated ticket counts\n- Line 3: `k`\n\n**Output**\nThe total time.',
    descriptionHi:
      'Log ek circular line mein khade hain, har ek `tickets[i]` tickets khareedna chahta hai. Har person har turn mein exactly ek ticket khareedta hai, phir line ke peeche chala jaata hai (ya khatam hone par chala jaata hai), aur ye tab tak chalta hai jab tak originally index `k` par khada person apne saare tickets na khareed le. Us point tak total kitne tickets khareede gaye (time units), wo return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated ticket counts\n- Line 3: `k`\n\n**Output**\nTotal time.',
    examples: [
      { input: '3\n2 3 2\n2', output: '6' },
      { input: '4\n5 1 1 1\n0', output: '8' },
    ],
    constraints: ['1 <= n <= 100', '1 <= tickets[i] <= 100', '0 <= k <= n - 1'],
    hints: [
      'Simulating turn by turn with a real queue works directly, but this can also be solved without simulation.',
      'A person ahead of or at position k contributes min(tickets[i], tickets[k]) turns before k finishes.',
      'A person strictly after position k can only ever get one turn before k finishes, contributing min(tickets[i], tickets[k] - 1) turns.',
    ],
    approach:
      'For each person `i`: if `i <= k`, they contribute `min(tickets[i], tickets[k])` ticket-buying turns before person `k` is done (since they act in the same or an earlier position each lap); if `i > k`, they contribute `min(tickets[i], tickets[k] - 1)` (since they only get their turn after `k` has already bought one more ticket that lap). Sum all contributions.',
    approachHi:
      'Har person `i` ke liye: agar `i <= k`, wo `min(tickets[i], tickets[k])` ticket-buying turns contribute karta hai person `k` khatam hone se pehle (kyunki har lap mein wo same ya pehle position mein act karta hai); agar `i > k`, wo `min(tickets[i], tickets[k] - 1)` contribute karta hai (kyunki uski turn `k` ke ek aur ticket khareedne ke baad hi aati hai). Saare contributions jodo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'Rather than literally simulating the circular queue turn by turn, the total time can be computed by asking, per person, "how many turns do they take before k is finished" — someone at or before position k gets a turn every lap up until k also stops (capped at k\'s own count), while someone after position k only gets a turn in laps where k has *not yet* finished that lap (one fewer lap, since k always acts first within a lap relative to them), giving the "tickets[k] - 1" cap instead.',
    solutionExplanationHi:
      'Circular queue ko literally turn-by-turn simulate karne ke bajaye, total time ye poochh kar nikala ja sakta hai: har person "k khatam hone se pehle kitni turns leta hai" — position k par ya usse pehle wala koi bhi har lap mein turn leta hai jab tak k bhi rukta nahi (k ke apne count tak capped), jabki k ke baad wala sirf un laps mein turn leta hai jahan k ne *abhi tak* wo lap khatam nahi ki (ek lap kam, kyunki k unke relative hamesha lap ke andar pehle act karta hai) — isse "tickets[k] - 1" wala cap milta hai.',
    starter: starter(
      `const tickets = nums(1), k = num(2);

function timeRequiredToBuy(tickets, k) {
  // your code here
}

console.log(timeRequiredToBuy(tickets, k));`,
      `tickets, k = nums(1), num(2)

def time_required_to_buy(tickets, k):
    # your code here
    pass

print(time_required_to_buy(tickets, k))`,
    ),
    solution: solution(
      `const tickets = nums(1), k = num(2);
let total = 0;
for (let i = 0; i < tickets.length; i++) {
  total += i <= k ? Math.min(tickets[i], tickets[k]) : Math.min(tickets[i], tickets[k] - 1);
}
console.log(total);`,
      `tickets, k = nums(1), num(2)
total = 0
for i, t in enumerate(tickets):
    total += min(t, tickets[k]) if i <= k else min(t, tickets[k] - 1)
print(total)`,
    ),
    testCases: [
      sample('3\n2 3 2\n2', '6'),
      sample('4\n5 1 1 1\n0', '8'),
      hidden('1\n5\n0', '5'),
      hidden('2\n1 1\n1', '2'),
      hidden('5\n3 3 3 3 3\n4', '15'),
      hidden('3\n1 2 3\n1', '4'),
    ],
  },

  {
    slug: 'rotting-oranges',
    title: 'Rotting Oranges',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'A grid contains `0` (empty), `1` (fresh orange), or `2` (rotten orange). Every minute, a rotten orange rots any orthogonally adjacent fresh orange. Find the minimum minutes until no fresh orange remains, or `-1` if that is impossible.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated values (0, 1, or 2)\n\n**Output**\nThe minimum minutes, or `-1`.',
    descriptionHi:
      'Ek grid mein `0` (khaali), `1` (fresh orange), ya `2` (rotten orange) hai. Har minute, ek rotten orange apne orthogonally adjacent kisi bhi fresh orange ko rot kar deta hai. Minimum minutes dhoondo jab tak koi fresh orange na bache, ya `-1` agar ye impossible hai.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated values (0, 1, ya 2)\n\n**Output**\nMinimum minutes, ya `-1`.',
    examples: [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', output: '4' },
      { input: '3 3\n2 1 1\n0 1 1\n1 0 1', output: '-1' },
    ],
    constraints: ['1 <= rows, cols <= 10', '0 <= grid[i][j] <= 2'],
    hints: [
      'All initially rotten oranges rot their neighbors simultaneously, at the same minute — this is a multi-source problem, not a single-source one.',
      'A BFS starting from ALL rotten oranges at once, processed level by level (minute by minute), naturally models simultaneous spreading.',
      'After the BFS finishes, if any fresh orange remains unvisited, the answer is -1.',
    ],
    approach:
      'Multi-source BFS. Seed a queue with the positions of every initially rotten orange (minute 0). Process the queue level by level (one level = one minute): for each rotten orange, rot any adjacent fresh orange, mark it, decrement a fresh-orange counter, and enqueue it for the next level. The number of levels processed is the answer, unless the fresh-orange counter never reaches 0, in which case it is -1.',
    approachHi:
      'Multi-source BFS. Har initially-rotten orange ki position se queue seed karo (minute 0). Queue ko level-by-level process karo (ek level = ek minute): har rotten orange ke liye, adjacent fresh orange ko rot karo, mark karo, fresh-orange counter ghatao, aur agle level ke liye enqueue karo. Process hue levels ki sankhya answer hai, sivaay tab jab fresh-orange counter kabhi 0 tak na pahunche, tab answer -1 hai.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols)',
    solutionExplanation:
      'Because every currently-rotten orange spreads simultaneously in the same minute, seeding the BFS queue with all of them at once (rather than one at a time) is what correctly models parallel spread rather than sequential spread — processing the queue strictly level by level (draining exactly the oranges rotten so far before moving to the next minute) is what makes "number of levels processed" equal to "minutes elapsed", the same level-by-level discipline used in any multi-source shortest-path BFS.',
    solutionExplanationHi:
      'Chunki abhi ke har rotten orange usi minute mein ek saath spread karta hai, BFS queue ko unn sabki position se ek saath seed karna (ek-ek karke nahi) hi parallel spread ko sahi tarah model karta hai, sequential spread ko nahi — queue ko strictly level-by-level process karna (agle minute par jaane se pehle abhi tak ke rotten oranges ko poora drain karna) hi "kitne levels process hue" ko "kitne minute beete" ke barabar banata hai — yahi level-by-level discipline kisi bhi multi-source shortest-path BFS mein use hoti hai.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function orangesRotting(grid) {
  // your code here
}

console.log(orangesRotting(grid));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def oranges_rotting(grid):
    # your code here
    pass

print(oranges_rotting(grid))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
let queue = [];
let fresh = 0;
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
  if (grid[r][c] === 2) queue.push([r, c]);
  else if (grid[r][c] === 1) fresh++;
}
let minutes = 0;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
while (queue.length && fresh > 0) {
  const next = [];
  for (const [r, c] of queue) {
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        next.push([nr, nc]);
      }
    }
  }
  queue = next;
  minutes++;
}
console.log(fresh === 0 ? minutes : -1);`,
      `from collections import deque
rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
queue = deque()
fresh = 0
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == 2:
            queue.append((r, c))
        elif grid[r][c] == 1:
            fresh += 1
minutes = 0
dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
while queue and fresh > 0:
    for _ in range(len(queue)):
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc))
    minutes += 1
print(minutes if fresh == 0 else -1)`,
    ),
    testCases: [
      sample('3 3\n2 1 1\n1 1 0\n0 1 1', '4'),
      sample('3 3\n2 1 1\n0 1 1\n1 0 1', '-1'),
      hidden('1 2\n0 2', '0'),
      hidden('1 1\n0', '0'),
      hidden('2 2\n2 2\n1 1', '1'),
      hidden('1 3\n1 2 1', '1'),
    ],
  },

  {
    slug: 'design-hit-counter',
    title: 'Design Hit Counter',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Design a hit counter that counts hits in the past 300 seconds (inclusive window `[timestamp - 299, timestamp]`). Process a stream of `hit t` and `getHits t` calls (timestamps monotonically increasing across all calls); print the result of every `getHits`.\n\n**Input**\n- Line 1: `q`\n- Next `q` lines: `hit t` or `getHits t`\n\n**Output**\nOne line per `getHits` call, in order.',
    descriptionHi:
      'Ek hit counter design karo jo pichle 300 seconds (inclusive window `[timestamp - 299, timestamp]`) ke hits count kare. `hit t` aur `getHits t` calls ki ek stream process karo (saari calls mein timestamps monotonically increasing hain); har `getHits` ka result print karo.\n\n**Input**\n- Line 1: `q`\n- Agli `q` lines: `hit t` ya `getHits t`\n\n**Output**\nHar `getHits` call ke liye ek line, order mein.',
    examples: [
      {
        input: '7\nhit 1\nhit 2\nhit 3\ngetHits 4\nhit 300\ngetHits 300\ngetHits 301',
        output: '3\n4\n3',
      },
    ],
    constraints: ['1 <= q <= 300', '1 <= t <= 2*10^9', 'Timestamps are monotonically increasing across all calls'],
    hints: [
      'This is the same "discard stale entries from the front" pattern as Number of Recent Calls, with a 300-second window instead of 3000ms.',
      'Keep a queue of hit timestamps. On getHits, first discard everything older than `t - 299`.',
      'Because timestamps only increase, discarded entries can never become relevant again.',
    ],
    approach:
      'Maintain a queue of hit timestamps. On `hit t`, push `t`. On `getHits t`, first pop from the front any timestamp `< t - 299`, then report the queue\'s remaining length.',
    approachHi:
      'Hit timestamps ki ek queue rakho. `hit t` par, `t` push karo. `getHits t` par, pehle front se aisa koi bhi timestamp pop karo jo `< t - 299` ho, phir queue ki bachi hui length report karo.',
    timeComplexity: 'O(1) amortised per call',
    spaceComplexity: 'O(q)',
    solutionExplanation:
      'This is structurally identical to Number of Recent Calls — monotonically increasing timestamps mean a stale entry can be discarded once and never needs reconsidering — the only difference is the window is measured in a 300-second span computed against whatever timestamp `getHits` is called with, rather than being recomputed on every hit.',
    solutionExplanationHi:
      'Ye structurally Number of Recent Calls jaisa hi hai — monotonically increasing timestamps ka matlab hai ki ek stale entry ek baar discard hone ke baad dobara consider karne ki zaroorat nahi — bas fark itna hai ki window ek 300-second span hai jo `getHits` jis bhi timestamp ke saath call hui usse compute hota hai, har hit par recompute nahi hota.',
    starter: starter(
      `const q = num(0);

const hits = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0], t = Number(parts[1]);
  // your code here: handle "hit" (push t) and "getHits" (discard stale, then report length)
}
console.log(out.join('\\n'));`,
      `q = num(0)

hits = []
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op, t = parts[0], int(parts[1])
    # your code here: handle "hit" (append t) and "getHits" (discard stale, then report len)

print("\\n".join(map(str, out)))`,
    ),
    solution: solution(
      `const q = num(0);
const hits = [];
const out = [];
for (let i = 1; i <= q; i++) {
  const parts = line(i).split(' ');
  const op = parts[0], t = Number(parts[1]);
  if (op === 'hit') hits.push(t);
  else {
    while (hits.length && hits[0] < t - 299) hits.shift();
    out.push(hits.length);
  }
}
console.log(out.join('\\n'));`,
      `from collections import deque
q = num(0)
hits = deque()
out = []
for i in range(1, q + 1):
    parts = line(i).split()
    op, t = parts[0], int(parts[1])
    if op == "hit":
        hits.append(t)
    else:
        while hits and hits[0] < t - 299:
            hits.popleft()
        out.append(len(hits))
print("\\n".join(map(str, out)))`,
    ),
    testCases: [
      sample('7\nhit 1\nhit 2\nhit 3\ngetHits 4\nhit 300\ngetHits 300\ngetHits 301', '3\n4\n3'),
      hidden('2\nhit 1\ngetHits 1', '1'),
      hidden('3\nhit 1\nhit 2\ngetHits 3', '2'),
      hidden('2\nhit 100\ngetHits 500', '0'),
      hidden('4\nhit 1\nhit 1\ngetHits 1\ngetHits 300', '2\n2'),
    ],
  },

  {
    slug: '01-matrix',
    title: '01 Matrix',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Given a binary matrix, for each cell compute the distance (number of orthogonal steps) to the nearest cell containing `0`.\n\n**Input**\n- Line 1: `rows cols`\n- Next `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nThe distance matrix, one row per line.',
    descriptionHi:
      'Ek binary matrix diya hai. Har cell ke liye us tak ki distance (orthogonal steps ki sankhya) nikalo jo sabse nazdeek `0` wali cell tak jaati hai.\n\n**Input**\n- Line 1: `rows cols`\n- Agli `rows` lines: `cols` space-separated 0/1 values\n\n**Output**\nDistance matrix, ek row per line.',
    examples: [
      { input: '3 3\n0 0 0\n0 1 0\n0 0 0', output: '0 0 0\n0 1 0\n0 0 0' },
      { input: '3 3\n0 0 0\n0 1 0\n1 1 1', output: '0 0 0\n0 1 0\n1 2 1' },
    ],
    constraints: ['1 <= rows, cols <= 100', 'At least one 0 exists in the matrix'],
    hints: [
      'Computing distance from every 1-cell outward to the nearest 0 individually would repeat a lot of work.',
      'Working backward — starting BFS from every 0-cell simultaneously, expanding outward — computes every distance in one pass.',
      'This is the same multi-source BFS pattern as Rotting Oranges, just measuring distance instead of counting minutes to the last spread.',
    ],
    approach:
      'Multi-source BFS. Seed a queue with every cell that is already `0` (distance 0). Expand level by level to orthogonal neighbors that have not yet been visited, assigning each a distance one more than the cell it came from.',
    approachHi:
      'Multi-source BFS. Har us cell se queue seed karo jo pehle se `0` hai (distance 0). Level-by-level orthogonal neighbors tak expand karo jo abhi tak visit nahi hue, har ek ko us cell se ek zyada distance do jahan se wo aaya.',
    timeComplexity: 'O(rows * cols)',
    spaceComplexity: 'O(rows * cols)',
    solutionExplanation:
      'Searching outward from every 1-cell individually toward the nearest 0 would redo the same work many times over for cells that share a nearest zero. Flipping the search direction — starting simultaneously from all 0-cells and expanding outward — visits every cell exactly once, and because BFS explores in increasing distance order, the first time any cell is reached is guaranteed to be via the shortest path, exactly the same multi-source reasoning as Rotting Oranges.',
    solutionExplanationHi:
      'Har 1-cell se individually sabse nazdeek 0 ki taraf search karna, ek hi nearest zero share karne wale cells ke liye baar-baar wahi kaam karega. Search ki direction ulti karna — saare 0-cells se ek saath shuru karke bahar expand karna — har cell ko exactly ek baar visit karta hai, aur chunki BFS badhti hui distance ke order mein explore karta hai, kisi bhi cell tak pehli baar pahunchna guaranteed shortest path se hota hai — bilkul Rotting Oranges wala hi multi-source reasoning.',
    starter: starter(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));

function updateMatrix(grid) {
  // return the distance matrix
  return grid;
}

console.log(updateMatrix(grid).map(r => r.join(' ')).join('\\n'));`,
      `rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]

def update_matrix(grid):
    # return the distance matrix
    return grid

result = update_matrix(grid)
print("\\n".join(" ".join(map(str, row)) for row in result))`,
    ),
    solution: solution(
      `const [rows, cols] = nums(0);
const grid = [];
for (let i = 0; i < rows; i++) grid.push(nums(1 + i));
const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
let queue = [];
for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (grid[r][c] === 0) { dist[r][c] = 0; queue.push([r, c]); }
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
while (queue.length) {
  const next = [];
  for (const [r, c] of queue) {
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        next.push([nr, nc]);
      }
    }
  }
  queue = next;
}
console.log(dist.map((r) => r.join(' ')).join('\\n'));`,
      `from collections import deque
rows, cols = nums(0)
grid = [nums(1 + i) for i in range(rows)]
dist = [[-1] * cols for _ in range(rows)]
queue = deque()
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == 0:
            dist[r][c] = 0
            queue.append((r, c))
dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
while queue:
    r, c = queue.popleft()
    for dr, dc in dirs:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] == -1:
            dist[nr][nc] = dist[r][c] + 1
            queue.append((nr, nc))
print("\\n".join(" ".join(map(str, row)) for row in dist))`,
    ),
    testCases: [
      sample('3 3\n0 0 0\n0 1 0\n0 0 0', '0 0 0\n0 1 0\n0 0 0'),
      sample('3 3\n0 0 0\n0 1 0\n1 1 1', '0 0 0\n0 1 0\n1 2 1'),
      hidden('1 1\n0', '0'),
      hidden('1 3\n0 1 1', '0 1 2'),
      hidden('2 2\n0 0\n0 0', '0 0\n0 0'),
      hidden('2 2\n1 0\n0 1', '1 0\n0 1'),
    ],
  },

  {
    slug: 'perfect-squares-bfs',
    title: 'Perfect Squares',
    category: 'Queue',
    difficulty: 'MEDIUM',
    description:
      'Find the minimum number of perfect square numbers (`1, 4, 9, 16, ...`) that sum to `n`.\n\n**Input**\nOne line containing `n`.\n\n**Output**\nThe minimum count.',
    descriptionHi:
      'Aise minimum perfect square numbers (`1, 4, 9, 16, ...`) dhoondo jinka sum `n` ke barabar ho.\n\n**Input**\nEk line jisme `n` hai.\n\n**Output**\nMinimum count.',
    examples: [
      { input: '12', output: '3', explanation: '12 = 4 + 4 + 4.' },
      { input: '13', output: '2', explanation: '13 = 4 + 9.' },
    ],
    constraints: ['1 <= n <= 10^4'],
    hints: [
      'Think of every integer from 0 to n as a node, with an edge from `x` to `x - square` for every perfect square `<= x`.',
      'The question "minimum number of squares summing to n" is then exactly "shortest path from n to 0" in that graph.',
      'BFS explores shortest paths level by level — the level at which 0 is first reached is the answer.',
    ],
    approach:
      'BFS from `n`, where each move subtracts one perfect square (`1, 4, 9, ...` that is `<= current value`) from the current remaining value. The first time the remaining value reaches exactly 0, the current BFS depth is the answer.',
    approachHi:
      '`n` se BFS karo, jahan har move current remaining value se ek perfect square (`1, 4, 9, ...` jo current value se `<=` ho) subtract karta hai. Jaise hi remaining value exactly 0 tak pahunchti hai, current BFS depth hi answer hai.',
    timeComplexity: 'O(n * sqrt(n))',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Reframing "sum of squares" as a graph reachability question — each remaining value is a node, and subtracting any valid perfect square is an edge to a smaller node — turns "fewest squares" into "shortest path to 0", which is exactly what BFS is built to find, since it explores all nodes reachable in 1 step, then all reachable in 2 steps, and so on, guaranteeing the first arrival at 0 uses the minimum number of edges (squares).',
    solutionExplanationHi:
      '"Squares ka sum" ko ek graph reachability sawaal ki tarah reframe karna — har remaining value ek node hai, aur koi bhi valid perfect square subtract karna ek chhote node tak ka edge hai — "kam se kam squares" ko "0 tak shortest path" bana deta hai, jo bilkul wahi hai jo BFS dhoondne ke liye bana hai: wo pehle 1-step mein reachable saare nodes explore karta hai, phir 2-step wale, aisa hi aage, isliye 0 tak pehli baar pahunchna guaranteed minimum edges (squares) use karta hai.',
    starter: starter(
      `const n = num(0);

function numSquares(n) {
  // your code here
}

console.log(numSquares(n));`,
      `n = num(0)

def num_squares(n):
    # your code here
    pass

print(num_squares(n))`,
    ),
    solution: solution(
      `const n = num(0);
const squares = [];
for (let i = 1; i * i <= n; i++) squares.push(i * i);
const visited = new Set([n]);
let queue = [n], depth = 0;
while (queue.length) {
  const next = [];
  for (const v of queue) {
    if (v === 0) { console.log(depth); process.exit(0); }
    for (const s of squares) {
      if (s > v) break;
      const rem = v - s;
      if (!visited.has(rem)) { visited.add(rem); next.push(rem); }
    }
  }
  queue = next;
  depth++;
}`,
      `n = num(0)
squares = []
i = 1
while i * i <= n:
    squares.append(i * i)
    i += 1
visited = {n}
queue = [n]
depth = 0
while queue:
    nxt = []
    for v in queue:
        if v == 0:
            print(depth)
            exit()
        for s in squares:
            if s > v:
                break
            rem = v - s
            if rem not in visited:
                visited.add(rem)
                nxt.append(rem)
    queue = nxt
    depth += 1`,
    ),
    testCases: [
      sample('12', '3'),
      sample('13', '2'),
      hidden('1', '1'),
      hidden('4', '1'),
      hidden('7', '4'),
      hidden('100', '1'),
    ],
  },
];
