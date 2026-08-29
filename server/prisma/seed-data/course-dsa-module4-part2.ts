/**
 * DSA Complete Course — Module 4: Linked Lists, lesson 2.
 *
 * Doubly linked lists and circular lists, both framed as targeted fixes
 * to a specific limitation of the singly linked list from this module's
 * previous lesson. Broken example: removing a node from a singly linked
 * list requires already having a reference to the PREVIOUS node (to
 * rewire its .next), which a singly linked list has no way to find
 * except by traversing from the head every single time — an operation
 * that looks like it should be O(1) once you're already "at" the node
 * to remove, but is secretly O(n) because reaching that previous node
 * requires a full traversal. Fixed with a doubly linked list, where
 * each node also holds a .prev pointer, making backward movement direct
 * rather than requiring a fresh traversal from the head. The lesson
 * closes with circular linked lists as a second, smaller variation
 * solving a different specific problem: representing a genuinely
 * cyclical sequence (like a round-robin turn order) without an
 * artificial, meaningless "start" and "end".
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

export const DSA_MODULE_4_PART2: CourseLesson[] = [
  {
    slug: 'doubly-linked-lists-circular-lists',
    title: 'Doubly Linked Lists and Circular Lists',
    titleHi: 'Doubly Linked Lists Aur Circular Lists',
    description: 'Deleting a specific node from a singly linked list requires rewiring the PREVIOUS node\'s pointer to skip over it — but a singly linked list gives that previous node no way to be found except by starting over from the head and walking the entire list again, turning what feels like it should be an instant operation into a genuine full traversal.',
    descriptionHi: 'Ek singly linked list se ek khaas node hataane ke liye PICHLE node ke pointer ko rewire karna chahiye ise skip karne ke liye — par ek singly linked list us pichle node ko dhoondhne ka koi tarika nahi deti sivaay head se dobara shuru karke aur poori list ko dobara chalte hue, jo turant hone waala operation lagta hai use ek asli poori traversal mein badalte hue.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A single-file line of people each holding a note with only "the person after me is ___" written on it, versus a line where each person holds two notes: "the person after me is ___" and "the person before me is ___".** In the forward-only-note line, if a specific person needs to leave the line, the person immediately behind them must have their own note updated to now point past the departing person — but finding out who is standing immediately behind a specific person requires walking the entire line from the very front, checking each person\'s note one at a time, until the one pointing at the departing person is found. In the two-note line, the departing person\'s own note already says exactly who stands directly behind them, and that behind-person\'s own second note already says exactly who stands directly in front — removing the person is immediate: hand the "who\'s behind me" information directly to the person in front, and the "who\'s in front of me" information directly to the person behind, with no need to walk anywhere at all. A singly linked list, where each node only points forward, is the forward-only-note line: finding a node\'s predecessor, needed to remove that node cleanly, requires a full traversal from the head. A doubly linked list, where each node holds both a next pointer and a prev pointer, is the two-note line: a node\'s predecessor is immediately known without needing to search for it at all.',
      hi: '**Logon ki ek single-file line jismein har ek ek note pakde hue hai jismein sirf "mere baad wala vyakti ___ hai" likha hai, versus ek line jismein har vyakti do notes pakde hue hai: "mere baad wala vyakti ___ hai" aur "mujhse pehle wala vyakti ___ hai".** Sirf-aage-wale-note-waali line mein, agar ek khaas vyakti ko line chhodni hai, unke bilkul peeche khada vyakti ko apna note update karwaana chahiye ab jaane waale vyakti ko paar karke point karne ke liye — par ye pata lagaana ki kaun bilkul kisi khaas vyakti ke peeche khada hai poori line ko bilkul aage se chalna maangta hai, har vyakti ka note ek-ek karke check karte hue, jab tak jo jaane waale vyakti ko point karta hai wo na mile. Do-notes-waali line mein, jaane waale vyakti ka apna note pehle se bilkul batata hai ki unke seedhe peeche kaun khada hai, aur us peeche-waale-vyakti ka apna doosra note pehle se bilkul batata hai ki unke seedhe aage kaun khada hai — vyakti ko hataana turant hai: "mere peeche kaun hai" jaankaari seedhe aage waale vyakti ko do, aur "mere aage kaun hai" jaankaari seedhe peeche waale vyakti ko do, kahin bhi chalne ki zaroorat bilkul na hote hue. Ek singly linked list, jahan har node sirf aage point karta hai, sirf-aage-wale-note-waali line hai: ek node ka predecessor dhoondhna, us node ko saaf tarike se hataane ke liye zaruri, head se ek poori traversal maangta hai. Ek doubly linked list, jahan har node ek \`next\` pointer aur ek \`prev\` pointer dono rakhta hai, do-notes-waali line hai: ek node ka predecessor bina ise bilkul dhoondhne ki zaroorat ke turant jaana jaata hai.',
    },

    simple: `**Start broken.** Removing a node from a singly linked list requires finding its predecessor first:

\`\`\`js
function removeNode(list, target) {
  if (list.head === target) { list.head = target.next; return; }

  let current = list.head; // must start over from the head EVERY time
  while (current.next !== target) {
    current = current.next; // full traversal just to find the predecessor
  }
  current.next = target.next; // now the predecessor can be rewired
}
\`\`\`

Removing \`target\` genuinely requires rewiring the PREVIOUS node\'s \`next\` pointer to skip over it — but a singly linked list\'s nodes only know what comes AFTER them, never what comes before. Finding \`target\`\'s predecessor requires starting at \`head\` and walking forward, checking each node\'s \`next\` pointer, until the one pointing at \`target\` is found — an \`O(n)\` traversal, even if a reference to \`target\` itself was already directly available, which feels like it should make removal instant.

**The fix: a doubly linked list, where every node already knows its predecessor**

\`\`\`js
class DoublyListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null; // the addition that changes everything
  }
}

function removeNode(list, target) {
  if (target.prev !== null) target.prev.next = target.next; // rewire forward pointer
  else list.head = target.next; // target was the head

  if (target.next !== null) target.next.prev = target.prev; // rewire backward pointer
}
\`\`\`

\`\`\`ts
class DoublyListNode<T> {
  value: T;
  next: DoublyListNode<T> | null = null;
  prev: DoublyListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

function removeNode<T>(list: { head: DoublyListNode<T> | null }, target: DoublyListNode<T>): void {
  if (target.prev !== null) target.prev.next = target.next;
  else list.head = target.next;

  if (target.next !== null) target.next.prev = target.prev;
}
\`\`\`

With a \`prev\` pointer on every node, \`target.prev\` directly gives the predecessor — no traversal needed at all. Removing \`target\` becomes two direct pointer rewires: the predecessor\'s \`next\` is updated to skip past \`target\`, and the successor\'s \`prev\` is updated to skip back past \`target\` too, keeping both directions of the list consistent. This is a genuine \`O(1)\` removal once a reference to \`target\` is already held, at the cost of every node now needing to store, and every insertion/removal now needing to correctly maintain, one additional pointer.`,

    simpleHi: `**Toote hue se shuru.** Ek singly linked list se ek node hataane ke liye pehle uska predecessor dhoondhna chahiye:

\`\`\`js
function removeNode(list, target) {
  if (list.head === target) { list.head = target.next; return; }

  let current = list.head; // har baar head se dobara shuru karna chahiye
  while (current.next !== target) {
    current = current.next; // sirf predecessor dhoondhne ke liye poori traversal
  }
  current.next = target.next; // ab predecessor ko rewire kiya jaa sakta hai
}
\`\`\`

\`target\` ko hataana sach mein PICHLE node ke \`next\` pointer ko rewire karna maangta hai ise skip karne ke liye — par ek singly linked list ke nodes sirf ye jaante hain ki unke BAAD kya aata hai, kabhi ye nahi ki unse pehle kya hai. \`target\` ka predecessor dhoondhna \`head\` par shuru karna aur aage chalna maangta hai, har node ka \`next\` pointer check karte hue, jab tak jo \`target\` ko point karta hai wo na mile — ek \`O(n)\` traversal, chahe \`target\` khud ka ek reference pehle se seedhe upalabdh ho, jo lagta hai ki removal ko turant banaana chahiye.

**Fix: ek doubly linked list, jahan har node pehle se apna predecessor jaanta hai**

\`\`\`js
class DoublyListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null; // wo addition jo sab kuch badalta hai
  }
}

function removeNode(list, target) {
  if (target.prev !== null) target.prev.next = target.next; // aage wala pointer rewire karo
  else list.head = target.next; // target head tha

  if (target.next !== null) target.next.prev = target.prev; // peeche wala pointer rewire karo
}
\`\`\`

\`\`\`ts
class DoublyListNode<T> {
  value: T;
  next: DoublyListNode<T> | null = null;
  prev: DoublyListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

function removeNode<T>(list: { head: DoublyListNode<T> | null }, target: DoublyListNode<T>): void {
  if (target.prev !== null) target.prev.next = target.next;
  else list.head = target.next;

  if (target.next !== null) target.next.prev = target.prev;
}
\`\`\`

Har node par ek \`prev\` pointer ke saath, \`target.prev\` seedhe predecessor deta hai — koi traversal bilkul zaruri nahi. \`target\` ko hataana do seedhe pointer rewires ban jaata hai: predecessor ka \`next\` update kiya jaata hai \`target\` ko paar karke skip karne ke liye, aur successor ka \`prev\` update kiya jaata hai \`target\` ko peeche se bhi skip karne ke liye, list ki dono directions ko consistent rakhte hue. Ye ek asli \`O(1)\` removal hai ek baar \`target\` ka reference pehle se pakda hai, is keemat par ki har node ko ab ek atirikt pointer store karna chahiye, aur har insertion/removal ko ab ise sahi tarike se maintain karna chahiye.`,

    content: `## The real cost of the fix: every node and every operation gets more complex

\`\`\`
Singly linked list node:  { value, next }              — 1 pointer
Doubly linked list node:  { value, next, prev }         — 2 pointers

Every insertion and removal in a doubly linked list must correctly
update BOTH directions, or the list becomes inconsistent — a next
pointer and a prev pointer that disagree about the list's own shape.
\`\`\`

A doubly linked list is not a strictly better upgrade with no downside — it is a genuine trade, exchanging real memory (one extra pointer per node) and real implementation complexity (every insertion and removal must correctly maintain two pointers instead of one, in both directions, or the list\'s forward and backward views can silently disagree with each other) for the ability to move backward and find a predecessor without a full traversal. This trade is worth making specifically when backward traversal or predecessor-finding is genuinely needed often — for a workload that only ever needs to move forward, a singly linked list\'s lower memory footprint and simpler invariants make it the better default.

## Circular linked lists: a different problem, a different small variation

\`\`\`js
// a circular singly linked list: the LAST node points back to the FIRST
lastNode.next = firstNode; // instead of null
\`\`\`

A circular linked list solves a genuinely different problem than the doubly linked list this lesson opened with: representing data that is inherently cyclical, with no meaningful "start" or "end" at all — a round-robin turn order among players, a looping playlist, a scheduling ring buffer. In a standard singly (or doubly) linked list, the last node\'s \`next\` is \`null\`, explicitly marking a genuine end. In a circular linked list, the last node\'s \`next\` instead points back to the first node, so traversal can continue indefinitely around the loop — which is exactly correct for data that genuinely has no natural end, but means the usual "\`while (current !== null)\`" traversal loop this course\'s previous lesson introduced would loop forever if used unmodified, since \`current\` never actually becomes \`null\`. Traversing a circular list correctly requires an explicit stopping condition instead — commonly, looping until the traversal pointer returns to the node it started at, rather than until it becomes \`null\`.

## Recognizing which variation a new problem actually needs

\`\`\`
Needs to move forward only, insert/remove mostly at the front or a
  known position          → singly linked list (this module's first lesson)

Needs to move backward, or remove a node given only a reference to
  it (not its predecessor) → doubly linked list (this lesson)

Represents genuinely cyclical data with no natural start or end
  (round-robin, looping structures)  → circular linked list (this lesson)
\`\`\`

Each of these three variations is a targeted answer to a specific limitation, not a strictly-better replacement for the one before it — recognizing which specific capability a new problem actually needs (forward-only traversal, backward movement, or genuine cyclicality) is the same pattern-recognition process this course has applied since Module 1, now applied to choosing among a family of closely related structures rather than among entirely different techniques.`,

    contentHi: `## Fix ki asli keemat: har node aur har operation zyaada complex ban jaata hai

\`\`\`
Singly linked list node:  { value, next }              — 1 pointer
Doubly linked list node:  { value, next, prev }         — 2 pointers

Ek doubly linked list mein har insertion aur removal ko sahi tarike se
DONO directions update karni chahiye, warna list asangat ban jaati hai
— ek next pointer aur ek prev pointer jo list ki apni shape ke baare
mein asahmat hain.
\`\`\`

Ek doubly linked list koi bilkul-behtar upgrade nahi hai kisi downside ke bina — ye ek asli trade hai, asli memory (prati-node ek atirikt pointer) aur asli implementation complexity (har insertion aur removal ko sahi tarike se do pointers maintain karne chahiye ek ke bajaye, dono directions mein, warna list ke aage aur peeche ke views chupchaap ek doosre se asahmat ho sakte hain) exchange karte hue backward move karne aur bina ek poori traversal ke predecessor dhoondhne ki kshamta ke liye. Ye trade lene laayak hai khaas taur par jab backward traversal ya predecessor-dhoondhna sach mein aksar zaruri hai — ek workload ke liye jise kabhi bhi sirf aage move karna hai, ek singly linked list ka kam memory footprint aur saadhe invariants ise behtar default banaate hain.

## Circular linked lists: ek alag samasya, ek alag chhota variation

\`\`\`js
// ek circular singly linked list: AAKHRI node PEHLE ki taraf wapas point karta hai
lastNode.next = firstNode; // null ke bajaye
\`\`\`

Ek circular linked list is lesson ne shuru mein khola us doubly linked list se ek sach mein alag samasya sulajhaati hai: aisi data ko darsaana jo aandarik roop se cyclical hai, bilkul koi maayne-yogya "shuru" ya "ant" na hote hue — players ke beech ek round-robin turn order, ek loop karti playlist, ek scheduling ring buffer. Ek standard singly (ya doubly) linked list mein, aakhri node ka \`next\` \`null\` hai, explicitly ek asli ant darsaate hue. Ek circular linked list mein, aakhri node ka \`next\` iske bajaye pehle node ki taraf wapas point karta hai, isliye traversal loop ke aar-paar hamesha ke liye jaari reh sakti hai — jo bilkul us data ke liye sahi hai jiska sach mein koi natural ant nahi hai, par matlab hai us aam "\`while (current !== null)\`" traversal loop jise is course ke pehle wale lesson ne introduce kiya bina-badle istemal kiya jaaye toh hamesha ke liye loop karega, kyunki \`current\` asal mein kabhi \`null\` nahi banta. Ek circular list ko sahi tarike se traverse karna iske bajaye ek explicit stopping condition maangta hai — aksar, tab tak loop karna jab tak traversal pointer us node par wapas na aa jaaye jahan se ye shuru hua, \`null\` ban jaane tak nahi.

## Ye pehchaanna ki ek nayi problem ko asal mein kaunsa variation chahiye

\`\`\`
Sirf aage move karna chahiye, insert/remove aksar front par ya ek
  jaani-jaati position par          → singly linked list (is module ka pehla lesson)

Backward move karna chahiye, ya sirf ek node ka reference diye jaane
  par ek node hataana (uska predecessor nahi) → doubly linked list (ye lesson)

Sach mein cyclical data darsata hai bina koi natural shuru ya ant ke
  (round-robin, looping structures)  → circular linked list (ye lesson)
\`\`\`

In teeno variations mein se har ek ek khaas limitation ka ek targeted jawaab hai, pehle wale ka ek bilkul-behtar replacement nahi — ye pehchaanna ki ek nayi problem ko asal mein kaunsi khaas kshamta chahiye (sirf-aage traversal, backward movement, ya asli cyclicality) wahi pattern-recognition process hai jise is course ne Module 1 se lagu kiya hai, ab bilkul alag techniques ke bajaye ek doosre se kareebi taur par judi structures ke parivaar mein chunne par lagu kiya gaya.`,

    examples: [
      {
        title: 'Broken: finding a predecessor requires a full traversal every time',
        titleHi: 'Toota: ek predecessor dhoondhna har baar ek poori traversal maangta hai',
        code: `let current = list.head;
while (current.next !== target) current = current.next;
current.next = target.next;`,
        codeJs: `function removeNode(list, target) {
  if (list.head === target) { list.head = target.next; return; }
  let current = list.head;
  while (current.next !== target) {
    current = current.next;
  }
  current.next = target.next;
}
// O(n) even though we already have a direct reference to target`,
        codeTs: `function removeNode<T>(
  list: { head: { value: T; next: any } | null },
  target: { value: T; next: any }
): void {
  if (list.head === target) { list.head = target.next; return; }
  let current = list.head as any;
  while (current.next !== target) {
    current = current.next;
  }
  current.next = target.next;
}
// fully valid TypeScript — the traversal cost is architectural`,
        output: `Correctly removes target, but must walk from the head every
single time, even though target itself was already known directly.`,
        explain: 'A singly linked list\'s nodes have no way to find their own predecessor, forcing a full traversal from the head to locate it.',
        explainHi: 'Ek singly linked list ke nodes ka apna predecessor dhoondhne ka koi tarika nahi hai, ise dhoondhne ke liye head se ek poori traversal majboor karte hue.',
      },
      {
        title: 'Fixed: a doubly linked list, where prev is already known',
        titleHi: 'Theek: ek doubly linked list, jahan \`prev\` pehle se jaana jaata hai',
        code: `if (target.prev !== null) target.prev.next = target.next;
if (target.next !== null) target.next.prev = target.prev;`,
        codeJs: `class DoublyListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

function removeNode(list, target) {
  if (target.prev !== null) target.prev.next = target.next;
  else list.head = target.next;
  if (target.next !== null) target.next.prev = target.prev;
}`,
        codeTs: `class DoublyListNode<T> {
  value: T;
  next: DoublyListNode<T> | null = null;
  prev: DoublyListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

function removeNode<T>(
  list: { head: DoublyListNode<T> | null },
  target: DoublyListNode<T>
): void {
  if (target.prev !== null) target.prev.next = target.next;
  else list.head = target.next;
  if (target.next !== null) target.next.prev = target.prev;
}`,
        outputJs: `Removes target in O(1) once a reference to it is held — no
traversal needed at all, since target.prev is already known.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'target.prev directly provides the predecessor, turning removal into two direct pointer updates instead of a search followed by an update.',
        explainHi: '\`target.prev\` seedhe predecessor pradaan karta hai, removal ko ek search ke baad ek update ke bajaye do seedhe pointer updates mein badalte hue.',
      },
      {
        title: 'Circular list: traversing until back at the start, not until null',
        titleHi: 'Circular list: shuru tak wapas jab tak traverse karna, null tak nahi',
        code: `let current = list.head;
do {
  console.log(current.value);
  current = current.next;
} while (current !== list.head);`,
        codeJs: `function printCircular(list) {
  if (list.head === null) return;
  let current = list.head;
  do {
    console.log(current.value);
    current = current.next;
  } while (current !== list.head); // stop when we've come back around
}
// last node's .next points back to head, forming a loop instead of null`,
        codeTs: `interface CircularNode<T> {
  value: T;
  next: CircularNode<T>;
}

function printCircular<T>(list: { head: CircularNode<T> | null }): void {
  if (list.head === null) return;
  let current: CircularNode<T> = list.head;
  do {
    console.log(current.value);
    current = current.next;
  } while (current !== list.head);
}`,
        outputJs: `Each value prints exactly once, and the loop correctly stops upon
returning to the starting node, rather than looping forever waiting
for a null that will never occur in a circular list.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The stopping condition checks for returning to the starting node instead of checking for null, since a circular list\'s last node deliberately points back to the first rather than to null.',
        explainHi: 'Stopping condition ye check karta hai ki kya shuruaati node par wapas aaya, \`null\` check karne ke bajaye, kyunki ek circular list ka aakhri node jaan-boojhkar pehle ki taraf wapas point karta hai, \`null\` ki taraf nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `let current = list.head;
while (current.next !== target) current = current.next;
// full O(n) traversal just to find target's predecessor`,
        right: `target.prev.next = target.next; // predecessor already known directly
// requires a doubly linked list`,
        why: 'A singly linked list has no way to find a node\'s predecessor except by traversing from the head — a doubly linked list makes this O(1) at the cost of an extra pointer per node.',
        whyHi: 'Ek singly linked list ke paas ek node ka predecessor dhoondhne ka koi tarika nahi hai sivaay head se traverse karne ke — ek doubly linked list ise \`O(1)\` banaati hai prati-node ek atirikt pointer ki keemat par.',
      },
      {
        wrong: `while (current !== null) { current = current.next; } // applied to a circular list`,
        right: `do { current = current.next; } while (current !== list.head);
// stopping condition matched to the circular structure`,
        why: 'A circular list\'s last node points back to the first rather than to null, so a null-checking traversal loop will run forever instead of stopping.',
        whyHi: 'Ek circular list ka aakhri node \`null\` ki taraf nahi balki pehle ki taraf wapas point karta hai, isliye ek \`null\`-check-karti traversal loop rukne ke bajaye hamesha ke liye chalegi.',
      },
      {
        wrong: `class DoublyListNode {
  constructor(value) { this.value = value; this.next = null; }
  // forgot the prev pointer entirely`,
        right: `class DoublyListNode {
  constructor(value) { this.value = value; this.next = null; this.prev = null; }
}`,
        why: 'Omitting the prev pointer entirely defeats the entire purpose of choosing a doubly linked list — the O(1) predecessor access it exists to provide depends on every node actually maintaining it.',
        whyHi: '\`prev\` pointer ko poori tarah chhod dena ek doubly linked list chunne ke poore maksad ko haraata hai — \`O(1)\` predecessor access jise pradaan karne ke liye ye maujood hai har node ke ise asal mein maintain karne par nirbhar karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**JavaScript\'s own Map and Set maintain their insertion order internally using a doubly linked list structure**, specifically to support efficient iteration in insertion order alongside O(1) average lookup.',
        hi: '**JavaScript ka apna \`Map\` aur \`Set\` apna insertion order internally ek doubly linked list structure istemal karke maintain karte hain**, khaas taur par insertion order mein kushal iteration ko \`O(1)\` average lookup ke saath support karne ke liye.',
      },
      {
        en: '**Browser history (back/forward navigation) and undo/redo systems in real applications are commonly implemented with a doubly linked list**, specifically because both backward and forward movement are genuinely needed.',
        hi: '**Browser history (back/forward navigation) aur asli applications mein undo/redo systems aksar ek doubly linked list se lagu ki jaati hain**, khaas taur par kyunki backward aur forward movement dono sach mein zaruri hain.',
      },
      {
        en: '**Round-robin CPU scheduling and circular buffers in real operating systems are genuine, production use cases for circular linked lists**, not a purely academic structure.',
        hi: '**Asli operating systems mein round-robin CPU scheduling aur circular buffers circular linked lists ke liye asli, production use cases hain**, ek shuddh academic structure nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does removing a specific node from a singly linked list cost O(n) even when a direct reference to that node is already available, and how does a doubly linked list change this?',
        qHi: 'Ek singly linked list se ek khaas node hataana \`O(n)\` kyun kharch karta hai chahe us node ka ek seedha reference pehle se upalabdh ho, aur ek doubly linked list ise kaise badalti hai?',
        a: 'Removing a node from a linked list correctly requires updating the pointer of whichever node comes immediately before it, so that this predecessor points past the node being removed rather than at it — otherwise, the list would still contain a path leading to the supposedly-removed node, and the removal would not actually take effect. In a singly linked list, each node only stores a pointer to the node that comes after it; there is no stored pointer, on any node, indicating what comes before it. This means that even when a direct reference to the specific node to be removed is already held, there is no way to directly ask that node "who points at you" — the only way to discover which node\'s next pointer needs to be updated is to start at the list\'s head and walk forward, checking each node\'s next pointer in turn, until the one that happens to point at the target node is found. This search is an O(n) operation in the worst case, entirely independent of how quickly the target node itself was located, since it is answering a fundamentally different question (who points at this node) that a singly linked list\'s own structure provides no shortcut for. A doubly linked list resolves this by having every node store a second pointer, prev, pointing directly at its own predecessor. With this pointer present, removing a node no longer requires any search at all: the node\'s own prev pointer directly identifies its predecessor, whose next pointer can then be updated immediately, and the node\'s own next pointer directly identifies its successor, whose prev pointer can likewise be updated immediately — both updates happen in a small, fixed number of steps, giving genuine O(1) removal once a reference to the node is held, at the cost of every node needing to store, and every insertion or removal needing to correctly maintain, this additional pointer.',
        aHi: 'Ek linked list se ek node ko sahi tarike se hataane ke liye us node ke pointer ko update karna chahiye jo bhi node iske bilkul pehle aata hai, taaki ye predecessor hataaye jaa rahe node ko paar karke point kare use point karne ke bajaye — anyatha, list mein phir bhi ek raasta hoga jo maane-jaate-hataaye-gaye node tak jaata hai, aur hataana asal mein lagu nahi hoga. Ek singly linked list mein, har node sirf us node ka ek pointer store karta hai jo iske baad aata hai; kisi bhi node par koi stored pointer nahi hai jo darsata ho ki isse pehle kya aata hai. Iska matlab hai chahe hataaye jaane wale khaas node ka ek seedha reference pehle se pakda ho, us node se seedhe "kaun tumhe point karta hai" poochne ka koi tarika nahi hai — ye pata lagaane ka akela tarika ki kis node ka \`next\` pointer update hona chahiye list ke head par shuru karna aur aage chalna hai, har node ka \`next\` pointer baari-baari check karte hue, jab tak jo samyog se target node ko point karta hai wo na mile. Ye search sabse bure case mein ek \`O(n)\` operation hai, poori tarah is baat se azaad ki target node khud kitni tezi se dhoondha gaya, kyunki ye ek buniyaadi roop se alag sawaal ka jawaab de raha hai (kaun is node ko point karta hai) jiske liye ek singly linked list ka apna structure koi shortcut pradaan nahi karta. Ek doubly linked list ise sulajhaata hai har node ko ek doosra pointer, \`prev\`, store karvaake, seedhe apne predecessor ki taraf point karte hue. Is pointer ke maujood hote hue, ek node ko hataana ab bilkul koi search nahi maangta: node ka apna \`prev\` pointer seedhe iske predecessor ko pehchaanta hai, jiska \`next\` pointer phir turant update kiya jaa sakta hai, aur node ka apna \`next\` pointer seedhe iske successor ko pehchaanta hai, jiska \`prev\` pointer samaan roop se turant update kiya jaa sakta hai — dono updates ek chhoti, fixed tadaad ke steps mein hote hain, ek baar node ka reference pakde jaane par asli \`O(1)\` removal dete hue, is keemat par ki har node ko ye atirikt pointer store karna chahiye, aur har insertion ya removal ko ise sahi tarike se maintain karna chahiye.',
      },
      {
        q: 'Why does the standard "traverse until null" loop fail on a circular linked list, and what specifically needs to change about the stopping condition?',
        qHi: 'Standard "traverse until null" loop ek circular linked list par kyun fail hota hai, aur stopping condition ke baare mein khaas taur par kya badalna chahiye?',
        a: 'The standard traversal pattern used for both singly and doubly linked lists relies on a specific structural guarantee: that the last node in the list has its next pointer set to null, which serves as the signal that the traversal has reached the genuine end of the structure and should stop. A circular linked list is deliberately constructed to NOT provide this guarantee — by design, its last node\'s next pointer points back to the first node rather than to null, specifically so that the structure can represent data with no natural beginning or end, such as a round-robin turn order or a looping playlist. If the standard "while current is not null" loop is applied to a circular list without modification, the loop\'s stopping condition will simply never become true, since current will keep cycling through the same sequence of nodes indefinitely, without ever encountering a null to trigger the loop\'s exit — this produces an infinite loop, not merely an incorrect result, since the program never reaches the code that would follow the loop at all. Correctly traversing a circular list therefore requires replacing the null-based stopping condition with one based on returning to a known reference point, typically the node the traversal started at: the loop should continue until the current pointer, after advancing at least once, becomes equal to that original starting node again, at which point one full cycle has been completed and traversal can correctly stop. This is commonly implemented using a do-while loop specifically, since the very first check (before advancing at all) would trivially and prematurely be true if the stopping condition were checked before at least one step forward has been taken, given that the traversal begins at the same node it will eventually return to.',
        aHi: 'Singly aur doubly linked lists dono ke liye istemal hone waala standard traversal pattern ek khaas structural guarantee par nirbhar karta hai: ki list mein aakhri node ka \`next\` pointer \`null\` par set hai, jo sanket ki tarah kaam karta hai ki traversal structure ke asli ant tak pahunch gaya hai aur ruk jaana chahiye. Ek circular linked list jaan-boojhkar ye guarantee NA pradaan karne ke liye banaayi gayi hai — design se, iske aakhri node ka \`next\` pointer \`null\` ki taraf nahi balki pehle node ki taraf wapas point karta hai, khaas taur par taaki structure aisi data darsa sake jiska koi natural shuru ya ant nahi hai, jaisa ek round-robin turn order ya ek looping playlist. Agar standard "while current is not null" loop ek circular list par bina badlaav ke lagu kiya jaata hai, loop ki stopping condition simply kabhi sach nahi banegi, kyunki \`current\` usi nodes ki sequence ke through baar-baar cycle karta rahega hamesha ke liye, ek \`null\` ka saamna kiye bina loop ke exit ko trigger karne ke liye — ye ek infinite loop banaata hai, sirf ek galat nateeja nahi, kyunki program us code tak kabhi bilkul nahi pahunchta jo loop ke baad follow karta. Ek circular list ko sahi tarike se traverse karne ke liye isliye \`null\`-based stopping condition ko ek aise se badalna chahiye jo ek jaani-jaati reference point tak wapas aane par aadhaarit ho, aksar us node par jahan se traversal shuru hui: loop ko tab tak jaari rehna chahiye jab tak current pointer, kam se kam ek baar aage badhne ke baad, us asli shuruaati node ke barabar dobara na ban jaaye, us bindu par ek poora cycle poora ho chuka hai aur traversal sahi tarike se ruk sakta hai. Ye aksar khaas taur par ek do-while loop istemal karke lagu kiya jaata hai, kyunki bilkul pehla check (kam se kam ek baar aage badhne se pehle) trivially aur samay-se-pehle sach hota agar stopping condition kam se kam ek kadam aage badhne se pehle check kiya jaata, ye dekhte hue ki traversal usi node par shuru hoti hai jahan ye aakhirkaar wapas aayegi.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken singly linked list removeNode (requiring a full traversal) and the fixed doubly linked list version from this lesson. Time both against a 100,000-node list, removing a node near the end, using console.time/console.timeEnd.',
        taskHi: 'Is lesson ka toota singly linked list \`removeNode\` (poori traversal maangte hue) aur theek doubly linked list version dono banao. Dono ko ant ke kareeb ek node hataate hue 100,000-node list ke khilaaf \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Keep a direct reference to the specific node being removed for both versions, so the timing measures only the removal logic itself, not the cost of first finding the target.',
        hintHi: 'Dono versions ke liye hataaye jaa rahe khaas node ka ek seedha reference rakho, taaki timing sirf removal logic khud naape, pehle target dhoondhne ki keemat nahi.',
      },
      {
        task: 'Build a small circular linked list (3-4 nodes) and implement printCircular from this lesson\'s example. Deliberately try the standard null-checking traversal loop instead and confirm it genuinely hangs (be ready to stop the script).',
        taskHi: 'Ek chhoti circular linked list banaao (3-4 nodes) aur is lesson ke example se \`printCircular\` lagu karo. Jaan-boojhkar iske bajaye standard \`null\`-check-karti traversal loop try karo aur confirm karo ki ye sach mein hang hoti hai (script rokne ke liye taiyaar raho).',
        hint: 'Add a safety counter that breaks out of the loop after, say, 1000 iterations, so you can observe the infinite-loop behavior without actually needing to force-quit anything.',
        hintHi: 'Ek safety counter jodo jo, misal ke taur par, 1000 iterations ke baad loop se bahar nikal jaaye, taaki tum infinite-loop vyavahaar dekh sako kuch bhi force-quit karne ki asli zaroorat ke bina.',
      },
      {
        task: 'For each of the three data structures this course\'s Module 4 has covered so far (array, singly linked list, doubly linked list), write one sentence describing a specific scenario where it would genuinely be the best choice.',
        taskHi: 'Is course ke Module 4 ne ab tak jo teen data structures cover ki hain (array, singly linked list, doubly linked list) unmein se har ek ke liye, ek vaakya likho ek khaas scenario darsaate hue jahan ye sach mein sabse achha chunaav hoga.',
        hint: 'Think specifically about what each structure\'s own trade-off (index access vs. front insertion vs. bidirectional traversal) makes it uniquely suited for.',
        hintHi: 'Khaas taur par is baare mein socho ki har structure ka apna trade-off (index access vs. front insertion vs. bidirectional traversal) ise kis cheez ke liye khaas taur par suitable banaata hai.',
      },
    ],

    keyTakeaways: [
      'Removing a specific node from a singly linked list costs O(n) even with a direct reference to it, since finding its predecessor requires a full traversal from the head.',
      'A doubly linked list adds a prev pointer to every node, making predecessor access O(1) and node removal O(1) once a reference to the node is held.',
      'This fix is a genuine trade-off, not a strictly better upgrade — it costs extra memory per node and requires every insertion/removal to correctly maintain two pointers instead of one.',
      'A circular linked list solves a different problem: representing genuinely cyclical data with no natural start or end, by having the last node point back to the first instead of to null.',
      'The standard "traverse until null" loop hangs forever on a circular list, since it never reaches null — a circular list requires stopping upon returning to the starting node instead.',
      'Singly linked, doubly linked, and circular linked lists are three targeted variations, each solving a specific limitation — recognizing which specific capability a problem needs determines which to reach for.',
    ],
    keyTakeawaysHi: [
      'Ek singly linked list se ek khaas node hataana \`O(n)\` kharch karta hai chahe iska ek seedha reference ho, kyunki iska predecessor dhoondhna head se ek poori traversal maangta hai.',
      'Ek doubly linked list har node mein ek \`prev\` pointer jodta hai, predecessor access ko \`O(1)\` aur node removal ko \`O(1)\` banaate hue ek baar node ka reference pakda jaaye.',
      'Ye fix ek asli trade-off hai, ek bilkul-behtar upgrade nahi — iski keemat prati-node atirikt memory hai aur har insertion/removal ko sahi tarike se do pointers maintain karne ki maang karta hai ek ke bajaye.',
      'Ek circular linked list ek alag samasya sulajhaati hai: sach mein cyclical data darsaana bina koi natural shuru ya ant ke, aakhri node ko pehle ki taraf wapas point karvaake \`null\` ki taraf nahi.',
      'Standard "traverse until null" loop ek circular list par hamesha ke liye hang hoti hai, kyunki ye kabhi \`null\` tak nahi pahunchti — ek circular list ko iske bajaye shuruaati node par wapas aane par rukna chahiye.',
      'Singly linked, doubly linked, aur circular linked lists teen targeted variations hain, har ek ek khaas limitation sulajhaate hue — ye pehchaanna ki ek problem ko kaunsi khaas kshamta chahiye tay karta hai ki kaunsi pakadni hai.',
    ],
  },
];
