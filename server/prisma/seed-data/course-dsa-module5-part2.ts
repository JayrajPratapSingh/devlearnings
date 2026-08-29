/**
 * DSA Complete Course — Module 5: Stacks & Queues, lesson 2.
 *
 * Queue fundamentals: FIFO (first in, first out), and why a plain array
 * is a genuinely poor backing structure for one despite superficially
 * seeming to work. Broken example: a printer job queue backed by a
 * plain array, using push() to enqueue and shift() to dequeue — this
 * IS correct FIFO ordering, unlike this module's previous lesson's
 * mistake, but shift() costs O(n) every single dequeue, since it must
 * shift every remaining element down an index, exactly the array-versus-
 * linked-list trade-off this course's Module 4 first lesson established.
 * Fixed with a linked-list-backed queue tracking both a head (for
 * dequeue) and a tail (for enqueue) pointer, giving O(1) for both
 * operations. The lesson closes with the circular queue as a specific,
 * array-based alternative that also achieves O(1) by reusing freed
 * array slots instead of shifting, at the cost of a fixed maximum size.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts — it is the only fully
 * reliable check for both mistakes. Also scan with a Python regex for stray
 * Devanagari characters before seeding.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_5_PART2: CourseLesson[] = [
  {
    slug: 'queue-fundamentals-circular-queues',
    title: 'Queue Fundamentals and Circular Queues',
    titleHi: 'Queue Ki Buniyaad Aur Circular Queues',
    description: 'A print queue correctly prints jobs in the order they were submitted — using push() to enqueue and shift() to dequeue genuinely produces correct FIFO order — but on a busy print server handling hundreds of thousands of jobs a day, shift() quietly pays an O(n) cost on every single job printed.',
    descriptionHi: 'Ek print queue jobs ko sahi order mein print karti hai jismein wo submit ki gayi thi — enqueue ke liye \`push()\` aur dequeue ke liye \`shift()\` istemal karna sach mein sahi FIFO order banaata hai — par ek vyast print server par jo ek din mein sainkdon hazaaron jobs handle karta hai, \`shift()\` chupchaap har akeli print ki gayi job par ek \`O(n)\` keemat chukaata hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 2,

    analogy: {
      en: '**A single-file line of customers at a counter, where the person being served is always the one who has been waiting longest, and new arrivals join at the back — versus that exact same line, except every time one customer is served and steps out, every single remaining customer must physically shuffle forward by one position to close the gap.** Both versions genuinely serve customers in the correct order — first arrived, first served, a real and correct queue. The version requiring everyone to shuffle forward after each departure works, but it means the cost of serving one customer scales with how many customers remain in the entire line, not with anything about that one customer specifically. A line where customers simply wait in place, and the counter itself keeps track of who is currently at the front without requiring anyone behind them to physically move at all, achieves the exact same correct serving order without that cost. A queue backed by a plain array, using push() to add and shift() to remove, is the shuffle-forward line: correct FIFO order, but shift() forces every remaining element to move down an index on every single removal. A queue that tracks its own front and back positions directly, without requiring existing elements to move, achieves identical FIFO ordering without ever needing that costly shuffle.',
      hi: '**Ek counter par customers ki ek single-file line, jahan serve ki jaa rahi vyakti hamesha wo hoti hai jo sabse lambe samay se wait kar rahi hai, aur naye aane waale peeche jodte hain — versus bilkul wahi line, siwaay har baar jab ek customer serve hota hai aur bahar kadam rakhta hai, har akela bachaa hua customer ko gap band karne ke liye physically ek position aage shuffle karna chahiye.** Dono versions sach mein customers ko sahi order mein serve karte hain, pehle aaye, pehle serve kiye, ek asli aur sahi queue. Wo version jo har prasthaan ke baad sab ko aage shuffle karne ki maang karta hai kaam karta hai, par iska matlab hai ek customer ko serve karne ki keemat poori line mein kitne customers bache hain us se scale karti hai, us khaas customer ke baare mein kisi cheez se nahi. Ek line jahan customers bas apni jagah wait karte hain, aur counter khud track rakhta hai ki abhi kaun front mein hai bina unke peeche kisi ko physically bilkul move karne ki maang kiye, bilkul wahi sahi serving order haasil karti hai us keemat ke bina. Ek queue jo ek saadhe array se backed hai, \`push()\` jodne ke liye aur \`shift()\` hataane ke liye istemal karte hue, shuffle-forward line hai: sahi FIFO order, par \`shift()\` har bachi hui element ko har akeli removal par ek index neeche move hone ke liye majboor karta hai. Ek queue jo apni front aur back positions ko seedhe track karti hai, maujood elements ko move hone ki maang kiye bina, identical FIFO ordering haasil karti hai us mehengi shuffle ki kabhi zaroorat ke bina.',
    },

    simple: `**Start correctly-ordered but slow.** A plain array with push() and shift():

\`\`\`js
const printQueue = [];

function enqueue(job) { printQueue.push(job); }   // add to the back
function dequeue() { return printQueue.shift(); } // remove from the front
\`\`\`

This genuinely produces correct FIFO (first in, first out) order — unlike this module\'s previous lesson\'s undo mistake, \`enqueue\` and \`dequeue\` here correctly use opposite ends, which is exactly what a queue actually needs (unlike a stack, which needs the SAME end). The problem is not correctness; it is cost. This course\'s Module 4 lesson on linked lists already established why: \`shift()\` must move every remaining element down by one index to fill the gap left at the front, an \`O(n)\` operation. On a queue processing hundreds of thousands of jobs, every single \`dequeue\` call pays this shifting cost, even though the actual job being removed is always right at the front.

**The fix: a linked-list-backed queue, tracking both a head and a tail**

\`\`\`js
class Queue {
  constructor() {
    this.head = null; // front — where dequeue removes from
    this.tail = null; // back — where enqueue adds to
  }
  enqueue(value) {
    const newNode = { value, next: null };
    if (this.tail === null) { this.head = newNode; this.tail = newNode; return; }
    this.tail.next = newNode; // attach at the back
    this.tail = newNode;      // the new node is now the back
  }
  dequeue() {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next; // move the front forward
    if (this.head === null) this.tail = null; // queue is now empty
    return value;
  }
}
\`\`\`

\`\`\`ts
interface QueueNode<T> { value: T; next: QueueNode<T> | null; }

class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;

  enqueue(value: T): void {
    const newNode: QueueNode<T> = { value, next: null };
    if (this.tail === null) { this.head = newNode; this.tail = newNode; return; }
    this.tail.next = newNode;
    this.tail = newNode;
  }
  dequeue(): T | undefined {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return value;
  }
}
\`\`\`

Tracking a \`tail\` pointer alongside \`head\` (this course\'s Module 4 lesson on doubly linked lists introduced the general idea of tracking more than one reference point into the same structure) means \`enqueue\` never needs to walk the list to find the back — it already knows exactly where to attach the new node. \`dequeue\` simply moves \`head\` forward by one node, exactly like this course\'s earlier linked-list-backed stack removed from its own head — no shifting, no walking, genuine \`O(1)\` for both operations regardless of how many jobs are queued.`,

    simpleHi: `**Sahi-order-mein-shuru par dheema.** Ek saadha array \`push()\` aur \`shift()\` ke saath:

\`\`\`js
const printQueue = [];

function enqueue(job) { printQueue.push(job); }   // back mein jodo
function dequeue() { return printQueue.shift(); } // front se hataao
\`\`\`

Ye sach mein sahi FIFO (first in, first out) order banaata hai — is module ke pehle wale lesson ke undo galti ke ulta, \`enqueue\` aur \`dequeue\` yahaan sahi tarike se virudh ends istemal karte hain, jo bilkul wo hai jo ek queue ko asal mein chahiye (ek stack ke ulta, jise SAME end chahiye). Samasya sahihata nahi hai; ye keemat hai. Is course ka Module 4 ka linked lists lesson pehle hi sthaapit kar chuka hai kyun: \`shift()\` ko har bachi hui element ko ek index neeche move karna chahiye front par chhode gaye gap ko bharne ke liye, ek \`O(n)\` operation. Ek queue par jo sainkdon hazaaron jobs process karti hai, har akeli \`dequeue\` call ye shifting keemat chukaati hai, chahe hataayi jaa rahi asli job hamesha bilkul front mein ho.

**Fix: ek linked-list-backed queue, dono ek head aur ek tail track karte hue**

\`\`\`js
class Queue {
  constructor() {
    this.head = null; // front — jahan se dequeue hataata hai
    this.tail = null; // back — jahan enqueue jodta hai
  }
  enqueue(value) {
    const newNode = { value, next: null };
    if (this.tail === null) { this.head = newNode; this.tail = newNode; return; }
    this.tail.next = newNode; // back mein attach karo
    this.tail = newNode;      // naya node ab back hai
  }
  dequeue() {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next; // front ko aage move karo
    if (this.head === null) this.tail = null; // queue ab khaali hai
    return value;
  }
}
\`\`\`

\`\`\`ts
interface QueueNode<T> { value: T; next: QueueNode<T> | null; }

class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;

  enqueue(value: T): void {
    const newNode: QueueNode<T> = { value, next: null };
    if (this.tail === null) { this.head = newNode; this.tail = newNode; return; }
    this.tail.next = newNode;
    this.tail = newNode;
  }
  dequeue(): T | undefined {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return value;
  }
}
\`\`\`

\`head\` ke saath \`tail\` pointer track karna (is course ke Module 4 ke doubly linked lists lesson ne usi structure mein ek se zyaada reference point track karne ka general idea introduce kiya) matlab hai \`enqueue\` ko kabhi back dhoondhne ke liye list chalne ki zaroorat nahi hai — ise pehle se bilkul pata hai naya node kahaan attach karna hai. \`dequeue\` bas \`head\` ko ek node aage move karta hai, bilkul jaise is course ka pehle wala linked-list-backed stack apne head se hataata tha — koi shifting nahi, koi chalna nahi, dono operations ke liye asli \`O(1)\` chahe kitni bhi jobs queue mein ho.`,

    content: `## Circular queues: an array-based O(1) alternative for a bounded queue

\`\`\`js
class CircularQueue {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;
    this.size = 0;
  }
  enqueue(value) {
    if (this.size === this.capacity) throw new Error("Queue is full");
    const backIndex = (this.front + this.size) % this.capacity; // wrap around
    this.items[backIndex] = value;
    this.size++;
  }
  dequeue() {
    if (this.size === 0) return undefined;
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity; // wrap around
    this.size--;
    return value;
  }
}
\`\`\`

\`\`\`ts
class CircularQueue<T> {
  private items: (T | undefined)[];
  private capacity: number;
  private front: number = 0;
  private size: number = 0;

  constructor(capacity: number) {
    this.items = new Array(capacity);
    this.capacity = capacity;
  }
  enqueue(value: T): void {
    if (this.size === this.capacity) throw new Error("Queue is full");
    const backIndex = (this.front + this.size) % this.capacity;
    this.items[backIndex] = value;
    this.size++;
  }
  dequeue(): T | undefined {
    if (this.size === 0) return undefined;
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return value;
  }
}
\`\`\`

A circular queue solves the same shifting problem this lesson opened with, but stays array-backed rather than switching to a linked list — instead of shifting elements after a dequeue, it simply lets \`front\` advance forward through the array\'s existing slots, WRAPPING back to index \`0\` once it runs off the end (via \`% this.capacity\`, the modulo operator), reusing slots that earlier dequeues have already freed rather than ever needing to shift anything. This achieves genuine \`O(1)\` enqueue and dequeue using only a fixed-size array, at the cost of a maximum capacity decided up front — attempting to enqueue past that capacity requires an explicit decision (this example throws; a real system might instead resize, mirroring this course\'s Module 3 lesson on hash table resizing).

## Choosing between a linked-list queue and a circular queue

\`\`\`
Linked-list queue:  genuinely unbounded size, extra memory per node for
                    the next pointer, no capacity planning needed

Circular queue:     fixed maximum capacity decided up front, no
                    per-node pointer overhead, all data contiguous in
                    one array (often better for CPU cache behavior)
\`\`\`

Neither is strictly better — this is the same category of trade-off this course\'s Module 4 lesson on doubly linked lists established between array-based and linked-list-based structures generally. A circular queue is a natural fit when a queue\'s maximum realistic size is known or boundable in advance (a fixed-size buffer for streaming audio samples, a bounded task queue with backpressure), while a linked-list-backed queue is the natural fit when the number of items genuinely cannot be predicted or bounded ahead of time.

## Where a queue is the correct choice instead of a stack

\`\`\`
Stack (LIFO): undo history, the call stack, matching nested brackets
Queue (FIFO): print jobs, task scheduling, breadth-first search
              (this course's later Module 7 relies directly on a queue)
\`\`\`

Recognizing whether a problem genuinely needs LIFO or FIFO ordering is the concrete signal for choosing between this module\'s two structures — "undo the most recent thing" is inherently LIFO; "process requests in the order they arrived" is inherently FIFO. This course\'s later Trees and Graphs modules rely directly on a queue\'s FIFO ordering for breadth-first traversal, making the queue mechanics this lesson establishes a direct prerequisite for that later material, not merely a standalone structure.`,

    contentHi: `## Circular queues: ek bounded queue ke liye ek array-based O(1) alternative

\`\`\`js
class CircularQueue {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;
    this.size = 0;
  }
  enqueue(value) {
    if (this.size === this.capacity) throw new Error("Queue is full");
    const backIndex = (this.front + this.size) % this.capacity; // wrap around
    this.items[backIndex] = value;
    this.size++;
  }
  dequeue() {
    if (this.size === 0) return undefined;
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity; // wrap around
    this.size--;
    return value;
  }
}
\`\`\`

\`\`\`ts
class CircularQueue<T> {
  private items: (T | undefined)[];
  private capacity: number;
  private front: number = 0;
  private size: number = 0;

  constructor(capacity: number) {
    this.items = new Array(capacity);
    this.capacity = capacity;
  }
  enqueue(value: T): void {
    if (this.size === this.capacity) throw new Error("Queue is full");
    const backIndex = (this.front + this.size) % this.capacity;
    this.items[backIndex] = value;
    this.size++;
  }
  dequeue(): T | undefined {
    if (this.size === 0) return undefined;
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return value;
  }
}
\`\`\`

Ek circular queue wahi shifting samasya sulajhaata hai jise is lesson ne shuru mein khola, par array-backed rehta hai ek linked list par switch karne ke bajaye — ek dequeue ke baad elements ko shift karne ke bajaye, ye bas \`front\` ko array ke maujood slots ke through aage badhne deta hai, ant se aage nikalne par index \`0\` par WRAP karte hue (\`% this.capacity\` ke zariye, modulo operator), un slots ko dobara istemal karte hue jinhe pehle wale dequeues pehle hi azaad kar chuke hain kuch bhi shift karne ki zaroorat ke bajaye. Ye asli \`O(1)\` enqueue aur dequeue haasil karta hai sirf ek fixed-size array istemal karke, ek pehle se tay ki gayi maximum capacity ki keemat par — us capacity se aage enqueue karne ki koshish ek explicit faisla maangta hai (ye example throw karta hai; ek asli system iske bajaye resize kar sakta hai, is course ke Module 3 ke hash table resizing lesson ko darsaate hue).

## Ek linked-list queue aur ek circular queue ke beech chunna

\`\`\`
Linked-list queue:  sach mein unbounded size, prati-node atirikt memory
                    next pointer ke liye, koi capacity planning zaruri nahi

Circular queue:     pehle se tay ki gayi fixed maximum capacity, koi
                    prati-node pointer overhead nahi, sab data ek array
                    mein contiguous (aksar CPU cache vyavahaar ke liye behtar)
\`\`\`

Koi bhi taulanaatmak roop se behtar nahi hai — ye wahi category ka trade-off hai jise is course ke Module 4 ke doubly linked lists lesson ne array-based aur linked-list-based structures ke beech general roop se sthaapit kiya. Ek circular queue ek natural fit hai jab ek queue ka maximum waastavik size pehle se jaana ya bound kiya jaa sakta hai (streaming audio samples ke liye ek fixed-size buffer, backpressure ke saath ek bounded task queue), jabki ek linked-list-backed queue natural fit hai jab items ki tadaad sach mein predict ya pehle se bound nahi ki jaa sakti.

## Kahaan ek queue stack ke bajaye sahi chunaav hai

\`\`\`
Stack (LIFO): undo history, call stack, nested brackets match karna
Queue (FIFO): print jobs, task scheduling, breadth-first search
              (is course ka baad ka Module 7 seedhe ek queue par nirbhar karta hai)
\`\`\`

Ye pehchaanna ki ek problem ko sach mein LIFO ya FIFO ordering chahiye is module ke do structures ke beech chunne ke liye thos signal hai — "sabse haaliya cheez undo karo" aandarik roop se LIFO hai; "requests ko us order mein process karo jismein wo aayi" aandarik roop se FIFO hai. Is course ke baad ke Trees aur Graphs modules seedhe breadth-first traversal ke liye ek queue ki FIFO ordering par nirbhar karte hain, is lesson ki sthaapit ki gayi queue mechanics ko us baad ki saamagri ke liye ek seedha prerequisite banaate hue, sirf ek standalone structure nahi.`,

    examples: [
      {
        title: 'Correct order, slow: array push/shift paying O(n) per dequeue',
        titleHi: 'Sahi order, dheema: array push/shift prati-dequeue O(n) chukaate hue',
        code: `printQueue.push(job); // enqueue
printQueue.shift();   // dequeue — O(n), shifts every remaining element`,
        codeJs: `const printQueue = [];
function enqueue(job) { printQueue.push(job); }
function dequeue() { return printQueue.shift(); }

enqueue("job1"); enqueue("job2"); enqueue("job3");
console.log(dequeue()); // "job1" — correct FIFO order, but O(n) cost`,
        codeTs: `const printQueue: string[] = [];
function enqueue(job: string): void { printQueue.push(job); }
function dequeue(): string | undefined { return printQueue.shift(); }
// fully valid TypeScript — the cost is architectural, not a type error`,
        output: `dequeue() correctly returns "job1" first, but shift() shifts
every remaining job down an index every single time it is called.`,
        explain: 'The FIFO order is genuinely correct here, unlike this module\'s previous lesson\'s mistake, but shift()\'s O(n) shifting cost is paid on every dequeue.',
        explainHi: 'Yahaan FIFO order sach mein sahi hai, is module ke pehle wale lesson ki galti ke ulta, par \`shift()\` ki \`O(n)\` shifting keemat har dequeue par chukaayi jaati hai.',
      },
      {
        title: 'Fixed: linked-list queue tracking head and tail, O(1) both ways',
        titleHi: 'Theek: linked-list queue jo head aur tail track karti hai, dono taraf O(1)',
        code: `this.tail.next = newNode; this.tail = newNode; // enqueue
this.head = this.head.next; // dequeue`,
        codeJs: `class Queue {
  constructor() { this.head = null; this.tail = null; }
  enqueue(value) {
    const newNode = { value, next: null };
    if (this.tail === null) { this.head = newNode; this.tail = newNode; return; }
    this.tail.next = newNode;
    this.tail = newNode;
  }
  dequeue() {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return value;
  }
}`,
        codeTs: `interface QueueNode<T> { value: T; next: QueueNode<T> | null; }

class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  enqueue(value: T): void {
    const newNode: QueueNode<T> = { value, next: null };
    if (this.tail === null) { this.head = newNode; this.tail = newNode; return; }
    this.tail.next = newNode;
    this.tail = newNode;
  }
  dequeue(): T | undefined {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head === null) this.tail = null;
    return value;
  }
}`,
        outputJs: `Enqueuing and dequeuing genuinely cost O(1) each, regardless of
how many jobs are already queued, since neither operation ever
shifts any existing node.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Tracking tail directly lets enqueue attach in O(1) without searching for the back, and dequeue simply advances head, exactly like this module\'s stack removed from its own head.',
        explainHi: '\`tail\` ko seedhe track karna \`enqueue\` ko back dhoondhne ke bina \`O(1)\` mein attach karne deta hai, aur \`dequeue\` bas \`head\` ko aage badhaata hai, bilkul jaise is module ka stack apne head se hataata tha.',
      },
      {
        title: 'A circular queue: array-based O(1) via wraparound instead of shifting',
        titleHi: 'Ek circular queue: shifting ke bajaye wraparound ke zariye array-based O(1)',
        code: `const backIndex = (this.front + this.size) % this.capacity;
this.items[backIndex] = value; // enqueue, wrapping around
this.front = (this.front + 1) % this.capacity; // dequeue, wrapping around`,
        codeJs: `class CircularQueue {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;
    this.size = 0;
  }
  enqueue(value) {
    if (this.size === this.capacity) throw new Error("Queue is full");
    this.items[(this.front + this.size) % this.capacity] = value;
    this.size++;
  }
  dequeue() {
    if (this.size === 0) return undefined;
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return value;
  }
}`,
        codeTs: `class CircularQueue<T> {
  private items: (T | undefined)[];
  private capacity: number;
  private front: number = 0;
  private size: number = 0;
  constructor(capacity: number) {
    this.items = new Array(capacity);
    this.capacity = capacity;
  }
  enqueue(value: T): void {
    if (this.size === this.capacity) throw new Error("Queue is full");
    this.items[(this.front + this.size) % this.capacity] = value;
    this.size++;
  }
  dequeue(): T | undefined {
    if (this.size === 0) return undefined;
    const value = this.items[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return value;
  }
}`,
        outputJs: `enqueue/dequeue both cost O(1), reusing array slots via the
modulo-based wraparound instead of ever shifting an element.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'front advances through the array\'s existing slots and wraps back to index 0 via the modulo operator, reusing freed slots instead of shifting any remaining element.',
        explainHi: '\`front\` array ke maujood slots ke through aage badhta hai aur modulo operator ke zariye index 0 par wapas wrap hota hai, kisi bachi hui element ko shift karne ke bajaye azaad kiye gaye slots ko dobara istemal karte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `printQueue.push(job); // enqueue
printQueue.shift();   // dequeue — O(n) shifting cost on every call`,
        right: `queue.enqueue(job); // O(1), tail pointer tracked directly
queue.dequeue();     // O(1), head pointer advances directly`,
        why: 'shift() must move every remaining element down an index, an O(n) cost paid on every single dequeue, unlike a linked-list-backed queue tracking head and tail directly.',
        whyHi: '\`shift()\` ko har bachi hui element ko ek index neeche move karna chahiye, ek \`O(n)\` keemat jo har akeli dequeue par chukaayi jaati hai, ek linked-list-backed queue ke ulta jo \`head\` aur \`tail\` ko seedhe track karti hai.',
      },
      {
        wrong: `class Queue {
  constructor() { this.head = null; } // no tail tracked
  enqueue(value) {
    // must walk from head to find the back — O(n) every time`,
        right: `class Queue {
  constructor() { this.head = null; this.tail = null; } // tail tracked directly
  enqueue(value) {
    this.tail.next = newNode; this.tail = newNode; // O(1)
  }
}`,
        why: 'Without tracking a tail pointer directly, a linked-list queue must walk the entire list on every enqueue just to find where to attach the new node, defeating the point of using a linked list at all.',
        whyHi: 'Ek \`tail\` pointer ko seedhe track kiye bina, ek linked-list queue ko har enqueue par poori list chalni chahiye sirf ye dhoondhne ke liye ki naya node kahaan attach karna hai, linked list istemal karne ke poore point ko haraate hue.',
      },
      {
        wrong: `// choosing a circular queue for a workload whose maximum size
// genuinely cannot be predicted or bounded in advance`,
        right: `// choosing a linked-list-backed queue instead, since it does
// not require a fixed capacity decided up front`,
        why: 'A circular queue requires a fixed maximum capacity chosen in advance — using one for a genuinely unbounded workload either wastes memory (an oversized capacity) or fails when the real load exceeds it.',
        whyHi: 'Ek circular queue ko pehle se chuni gayi ek fixed maximum capacity chahiye — ise ek sach mein unbounded workload ke liye istemal karna ya toh memory barbaad karta hai (ek zyaada-badi capacity) ya fail hota hai jab asli load isse aage badh jaata hai.',
      },
    ],

    realWorld: [
      {
        en: '**Print job queues, task scheduling systems, and message queues in real production systems (like RabbitMQ or Kafka) all genuinely rely on FIFO queue semantics.**',
        hi: '**Print job queues, task scheduling systems, aur asli production systems mein message queues (jaisa RabbitMQ ya Kafka) sab sach mein FIFO queue semantics par nirbhar karti hain.**',
      },
      {
        en: '**Circular buffers are a genuinely standard, widely used pattern in real audio/video streaming systems and embedded systems**, specifically because a bounded, fixed-capacity buffer with O(1) operations fits those constraints well.',
        hi: '**Circular buffers asli audio/video streaming systems aur embedded systems mein ek sach mein standard, widely used pattern hain**, khaas taur par kyunki ek bounded, fixed-capacity buffer \`O(1)\` operations ke saath un limitations mein achhi tarah fit baithta hai.',
      },
      {
        en: '**Breadth-first search, covered in this course\'s later Trees and Graphs modules, genuinely requires a proper queue to produce correct level-by-level ordering** — this is not an optional implementation detail.',
        hi: '**Breadth-first search, is course ke baad ke Trees aur Graphs modules mein cover ki gayi, sach mein ek sahi queue maangti hai sahi level-dar-level ordering banaane ke liye** — ye ek vaikalpik implementation detail nahi hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does using push() and shift() on a plain array produce correct FIFO ordering while still being a poor implementation choice, and how does tracking a tail pointer directly solve this?',
        qHi: 'Ek saadhe array par \`push()\` aur \`shift()\` istemal karna sahi FIFO ordering kyun banaata hai phir bhi ek kharaab implementation chunaav hote hue, aur ek \`tail\` pointer ko seedhe track karna ise kaise sulajhaata hai?',
        a: 'Using push() to add new items to the end of an array and shift() to remove items from the front genuinely produces correct first-in-first-out ordering, since the item that has been in the array the longest — the one at the front — is always the one removed, and new items always join at the opposite end. This ordering correctness is not in question. The problem is purely about cost: shift() cannot simply remove the front element in isolation, because a plain array requires every element to occupy a specific index directly corresponding to its position, and removing the front element leaves a gap that must be closed by moving every single remaining element down by one index. This shifting operation costs time proportional to how many elements remain in the array, an O(n) cost, paid in full on every single dequeue operation, regardless of how many total items have ever passed through the queue. A queue backed by a linked list, tracking both a head pointer (for removal) and a tail pointer (for addition) directly, avoids this shifting entirely: dequeuing simply advances the head pointer to whatever node comes next, discarding the old head, which requires touching only that one node\'s reference, not shifting anything. Enqueuing, critically, requires knowing where the current back of the queue is without needing to search for it — this is precisely what tracking a tail pointer directly provides: since the tail pointer is updated every time a new node is added, it is always already pointing at the correct location to attach the next new node, meaning enqueue never needs to walk through the list to rediscover where the back currently is. Both operations become genuine O(1), entirely avoiding the shifting cost that using push() and shift() on a plain array pays on every removal.',
        aHi: '\`push()\` istemal karna array ke ant mein naye items jodne ke liye aur \`shift()\` front se items hataane ke liye sach mein sahi first-in-first-out ordering banaata hai, kyunki wo item jo array mein sabse lambe samay se hai — front waala — hamesha wo hai jo hataaya jaata hai, aur naye items hamesha virudh ant par jodte hain. Ye ordering sahihata sawaal mein nahi hai. Samasya poori tarah keemat ke baare mein hai: \`shift()\` alag-thalag mein bas front element hataa nahi sakta, kyunki ek saadha array har element ko ek khaas index par kabza karne ki maang karta hai jo seedhe iski position se mel khaata hai, aur front element hataana ek gap chhodta hai jise har akele bachi hui element ko ek index neeche move karke band karna chahiye. Ye shifting operation us samay ke anupaat mein kharch karta hai jitni elements array mein bachi hain, ek \`O(n)\` keemat, poori tarah chukaayi jaati hai har akele dequeue operation par, is baat se azaad ki queue se ab tak total kitni items guzri hain. Ek linked list se backed ek queue, dono ek \`head\` pointer (hataane ke liye) aur ek \`tail\` pointer (jodne ke liye) seedhe track karte hue, is shifting ko poori tarah avoid karti hai: dequeue karna bas \`head\` pointer ko jo bhi node agla aata hai us taraf aage badhaata hai, purane head ko discard karte hue, jise sirf us ek node ke reference ko chhune ki zaroorat hai, kuch bhi shift karne ki nahi. Enqueue karna, mahatvapoorn baat, ye jaanna maangta hai ki queue ka current back kahaan hai use dhoondhne ki zaroorat ke bina — ye bilkul wo hai jo ek \`tail\` pointer ko seedhe track karna pradaan karta hai: kyunki \`tail\` pointer har baar jab ek naya node joda jaata hai update hota hai, ye hamesha pehle se sahi location par point kar raha hota hai agla naya node attach karne ke liye, matlab \`enqueue\` ko kabhi list ke through chalne ki zaroorat nahi hoti ye dobara-dhoondhne ke liye ki abhi back kahaan hai. Dono operations asli \`O(1)\` ban jaate hain, poori tarah shifting keemat avoid karte hue jo saadhe array par \`push()\` aur \`shift()\` istemal karna har removal par chukaata hai.',
      },
      {
        q: 'How does a circular queue achieve O(1) enqueue and dequeue while staying array-backed, without ever shifting elements the way a naive array-based queue does?',
        qHi: 'Ek circular queue array-backed rehte hue \`O(1)\` enqueue aur dequeue kaise haasil karti hai, kabhi bhi elements ko shift kiye bina us tarike se jo ek naive array-based queue karti hai?',
        a: 'A circular queue avoids shifting by never actually moving existing elements to close a gap left by a dequeued item — instead, it simply lets the position considered the "front" of the queue advance forward through the array\'s own existing slots, leaving the dequeued slot\'s old value in place but conceptually treating it as no longer part of the queue. The genuinely clever part is what happens once this advancing front position reaches the end of the underlying array: rather than treating this as a problem requiring the queue to stop or resize, the circular queue uses the modulo operator to wrap the front position back around to index zero, treating the array as if its last position were conceptually connected back to its first position, forming a logical circle overlaid on top of the physically linear array. This means a slot that was freed by an earlier dequeue, positioned earlier in the array, can be reused by a later enqueue once the front and back positions have wrapped around far enough to reach it again, without ever needing to physically relocate any other element to make that reuse possible. Both enqueue and dequeue, under this scheme, only ever need to update a small, fixed number of tracked values — the front position, the current size, and the value being written or read at one specific computed index — none of which requires touching any element other than the one specific slot being written to or read from, giving genuine O(1) cost for both operations. The trade-off this approach makes is that the array\'s own physical size must be fixed and decided in advance, since the wraparound logic depends on that size being a known, unchanging constant used in the modulo calculation — unlike a linked-list-backed queue, which can keep growing without any predetermined limit.',
        aHi: 'Ek circular queue shifting avoid karta hai maujood elements ko kabhi asal mein move na karke ek dequeue kiye gaye item se chhode gaye gap ko band karne ke liye — iske bajaye, ye bas us position ko jise queue ka "front" maana jaata hai array ke apne maujood slots ke through aage badhne deta hai, dequeue ki gayi slot ki purani value ko apni jagah chhodte hue par conceptually ise queue ka hissa nahi mante hue. Sach mein hoshiyar hissa ye hai ki kya hota hai ek baar ye aage badhta front position underlying array ke ant tak pahunchta hai: ise ek samasya ki tarah treat karne ke bajaye jise queue ko rukne ya resize karne ki zaroorat hai, circular queue front position ko index zero par wapas wrap karne ke liye modulo operator istemal karta hai, array ko aise treat karte hue jaise iski aakhri position conceptually iski pehli position se wapas judi hui ho, physically linear array ke oopar ek logical circle banaate hue. Iska matlab hai ek slot jo pehle ek dequeue se azaad hui thi, array mein pehle position ki gayi, ek baad ke enqueue dwara dobara istemal ki jaa sakti hai ek baar front aur back positions itni door wrap ho chuki hain ki isse dobara pahunche, kisi bhi doosri element ko physically relocate karne ki zaroorat kabhi bina us dobara-istemal ko mumkin banaane ke liye. Enqueue aur dequeue dono, is scheme ke neeche, kabhi bhi sirf ek chhoti, fixed tadaad ki tracked values update karne ki zaroorat rakhte hain — front position, current size, aur ek khaas gani gayi index par likhi ya padhi jaa rahi value — inmein se koi bhi kisi doosri element ko chhune ki zaroorat nahi rakhta us ek khaas slot ke alaawa jismein likha ya jise padha jaa raha hai, dono operations ke liye asli \`O(1)\` keemat dete hue. Ye approach jo trade banaata hai wo ye hai ki array ka apna physical size fixed aur pehle se tay kiya jaana chahiye, kyunki wraparound logic us size par nirbhar karta hai jo modulo calculation mein istemal ek jaani-jaati, na-badalti constant hai — ek linked-list-backed queue ke ulta, jo kisi bhi pehle-se-tay-ki-gayi seema ke bina badhta reh sakta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the array-based (push/shift) queue and the linked-list-based (head/tail) queue from this lesson. Time both against 100,000 enqueue/dequeue operations using console.time/console.timeEnd.',
        taskHi: 'Is lesson ka array-based (\`push\`/\`shift\`) queue aur linked-list-based (\`head\`/\`tail\`) queue dono banao. Dono ko 100,000 enqueue/dequeue operations ke khilaaf \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Enqueue all 100,000 items first, then dequeue all of them, so the timing clearly isolates the cost of each operation.',
        hintHi: 'Pehle sab 100,000 items enqueue karo, phir un sab ko dequeue karo, taaki timing saaf taur par har operation ki keemat ko alag kare.',
      },
      {
        task: 'Build the CircularQueue from this lesson with a capacity of 5. Enqueue and dequeue enough times that the front position wraps around past index 0 at least once, and log this.front after each operation to observe the wraparound directly.',
        taskHi: 'Is lesson ka \`CircularQueue\` banaao 5 ki ek capacity ke saath. Itni baar enqueue aur dequeue karo ki front position kam se kam ek baar index 0 se aage wrap ho jaaye, aur har operation ke baad \`this.front\` log karo seedhe wraparound dekhne ke liye.',
        hint: 'With a capacity of 5, enqueue 3 items, dequeue 2, then enqueue 3 more — the third of these new enqueues should wrap around.',
        hintHi: '5 ki capacity ke saath, 3 items enqueue karo, 2 dequeue karo, phir 3 aur enqueue karo — in naye enqueues mein se teesra wrap around hona chahiye.',
      },
      {
        task: 'For each of the four structures this course has covered across Module 4 and Module 5 so far (linked list, doubly linked list, stack, queue), write one sentence describing what specific access pattern makes each one the right choice.',
        taskHi: 'Is course ne ab tak Module 4 aur Module 5 mein jo char structures cover ki hain unmein se har ek ke liye (linked list, doubly linked list, stack, queue), ek vaakya likho ye describe karte hue ki kaunsa khaas access pattern har ek ko sahi chunaav banaata hai.',
        hint: 'Focus specifically on which end(s) of the structure each one adds to and removes from, since that is the defining characteristic distinguishing all four.',
        hintHi: 'Khaas taur par is baat par focus karo ki structure ke kaunse ant(on) mein har ek jodta aur hataata hai, kyunki yahi wo paribhaashit visheshta hai jo sab char ko alag karti hai.',
      },
    ],

    keyTakeaways: [
      'A plain array using push() and shift() produces genuinely correct FIFO order, but shift()\'s O(n) shifting cost is paid on every single dequeue.',
      'A linked-list-backed queue tracking both head and tail pointers achieves O(1) enqueue and dequeue, since neither operation ever needs to shift or search for an existing node.',
      'A circular queue achieves O(1) enqueue and dequeue while staying array-backed, by letting front and back positions wrap around via the modulo operator instead of shifting elements.',
      'A circular queue requires a fixed maximum capacity decided up front, while a linked-list-backed queue can grow without a predetermined limit, at the cost of extra per-node memory.',
      'Recognizing whether a problem needs LIFO (a stack) or FIFO (a queue) ordering is the concrete signal for choosing between this module\'s two structures.',
      'This course\'s later breadth-first search algorithms (in the Trees and Graphs modules) rely directly on a proper queue\'s FIFO ordering, making queue fundamentals a direct prerequisite for that later material.',
    ],
    keyTakeawaysHi: [
      'Ek saadha array jo \`push()\` aur \`shift()\` istemal karta hai sach mein sahi FIFO order banaata hai, par \`shift()\` ki \`O(n)\` shifting keemat har akeli dequeue par chukaayi jaati hai.',
      'Ek linked-list-backed queue jo dono \`head\` aur \`tail\` pointers track karti hai \`O(1)\` enqueue aur dequeue haasil karti hai, kyunki kisi bhi operation ko kabhi shift ya ek maujood node dhoondhne ki zaroorat nahi hoti.',
      'Ek circular queue array-backed rehte hue \`O(1)\` enqueue aur dequeue haasil karti hai, front aur back positions ko modulo operator ke zariye wrap around karne dekar elements shift karne ke bajaye.',
      'Ek circular queue ko pehle se tay ki gayi ek fixed maximum capacity chahiye, jabki ek linked-list-backed queue kisi pehle-se-tay-ki-gayi seema ke bina badh sakti hai, prati-node atirikt memory ki keemat par.',
      'Ye pehchaanna ki ek problem ko LIFO (ek stack) ya FIFO (ek queue) ordering chahiye is module ke do structures ke beech chunne ke liye thos signal hai.',
      'Is course ke baad ke breadth-first search algorithms (Trees aur Graphs modules mein) seedhe ek sahi queue ki FIFO ordering par nirbhar karte hain, queue fundamentals ko us baad ki saamagri ke liye ek seedha prerequisite banaate hue.',
    ],
  },
];
