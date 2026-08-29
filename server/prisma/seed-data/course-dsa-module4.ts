/**
 * DSA Complete Course — Module 4: Linked Lists, lesson 1.
 *
 * Singly linked list fundamentals, framed directly against this
 * course's Module 1 lesson on array memory layout: arrays get O(1)
 * index access specifically because their elements sit contiguously in
 * memory, but that same contiguity is exactly what makes inserting at
 * the front O(n) — every existing element must physically shift over
 * to make room. Broken example: an array-backed task queue where tasks
 * are frequently added to the front via unshift(), paying an O(n) shift
 * cost on every single insertion. Fixed with a singly linked list, whose
 * nodes are deliberately NOT contiguous — each node just points to the
 * next one — making front insertion O(1) at the direct cost of losing
 * O(1) index access, since reaching position k now requires walking
 * from the head, one node at a time.
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

export const DSA_MODULE_4: CourseLesson[] = [
  {
    slug: 'singly-linked-lists-fundamentals',
    title: 'Singly Linked Lists: Fundamentals',
    titleHi: 'Singly Linked Lists: Buniyaad',
    description: 'A task queue backed by a plain array adds urgent tasks to the front using unshift() — on a queue with 500,000 pending tasks, every single urgent task added forces all 500,000 existing tasks to physically shift over by one position, just to make room at index 0.',
    descriptionHi: 'Ek task queue jo ek saadhe array se backed hai urgent tasks ko \`unshift()\` istemal karke front mein jodta hai — 500,000 pending tasks waali ek queue par, jodha gaya har akela urgent task sab 500,000 maujood tasks ko physically ek position se shift karne par majboor karta hai, sirf index 0 par jagah banaane ke liye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 1,

    analogy: {
      en: '**A single-file line of people standing shoulder to shoulder, where inserting one new person at the very front means physically asking every single other person in the line to shuffle backward by one step first — versus a treasure hunt where each clue simply tells you the location of the next clue, so inserting a brand-new first clue means writing one new card that points to the old first clue, with nothing else in the entire hunt needing to move at all.** In the shoulder-to-shoulder line, every person\'s physical position is meaningful and fixed relative to everyone else — the fifth person is standing exactly five steps from the front specifically because there are four people physically between them and the front. Inserting someone new at the front genuinely requires everyone else to physically move, since their position IS their identity within the line. In the treasure hunt, no clue has any inherent "position" at all — each clue\'s only job is to point to wherever the next one happens to be, which could be anywhere at all, with no requirement that clue five be physically anywhere near clue four. Inserting a new first clue means writing one new card pointing at the old first clue\'s known location — nothing else in the entire hunt needs to be touched, moved, or even looked at. An array, whose elements sit contiguously in memory (this course\'s Module 1 lesson on arrays established exactly why), is the shoulder-to-shoulder line: inserting at the front requires shifting every other element over. A singly linked list, where each node simply holds a pointer to the next node\'s location rather than sitting in any fixed, contiguous position, is the treasure hunt: inserting at the front costs creating one new node and pointing it at the old first node, with nothing else needing to move.',
      hi: '**Logon ki ek single-file line jo kandhe-se-kandha khadi hai, jahan bilkul aage ek naye vyakti ko insert karna matlab hai physically line ke har akele doosre vyakti se pehle ek kadam peeche shuffle karne ko kehna — versus ek treasure hunt jahan har clue bas tumhe agle clue ki location bataata hai, isliye ek bilkul-naya pehla clue insert karna matlab hai ek naya card likhna jo purane pehle clue ki taraf point kare, poore hunt mein kisi aur cheez ko move hone ki zaroorat na hote hue.** Kandhe-se-kandha line mein, har vyakti ki physical position maayne-yogya hai aur baaki sab ke saapeksh fixed hai — paanchvaan vyakti bilkul paanch kadam aage se khada hai khaas taur par kyunki unke aur aage ke beech chaar log physically hain. Aage ek naya vyakti insert karna sach mein sab ko physically move hone ki maang karta hai, kyunki unki position hi line ke andar unki pehchaan HAI. Treasure hunt mein, koi bhi clue bilkul koi inherent "position" nahi rakhta — har clue ka akela kaam bataana hai ki agla wala kahaan hai, jo kahin bhi ho sakta hai, koi zaroorat na hote hue ki clue paanch physically clue chaar ke kahin bhi kareeb ho. Ek naya pehla clue insert karna matlab hai ek naya card likhna jo purane pehle clue ki jaani-jaati location par point kare — poore hunt mein kuch aur bhi chhue jaane, move hone, ya dekhe jaane ki zaroorat nahi. Ek array, jiske elements memory mein contiguously baithe hain (is course ke Module 1 ke arrays wale lesson ne bilkul yahi sthaapit kiya kyun), kandhe-se-kandha line hai: aage insert karna baaki har element ko shift karne ki maang karta hai. Ek singly linked list, jahan har node bas agle node ki location ka ek pointer rakhta hai kisi fixed, contiguous position mein baithne ke bajaye, treasure hunt hai: aage insert karna ek naya node banaane aur ise purane pehle node ki taraf point karne ki keemat leta hai, kuch aur move hone ki zaroorat na hote hue.',
    },

    simple: `**Start broken.** An array-backed task queue, adding urgent tasks to the front:

\`\`\`js
const tasks = [/* 500,000 pending tasks */];

function addUrgentTask(task) {
  tasks.unshift(task); // insert at index 0
}
\`\`\`

\`unshift\` inserting at index \`0\` genuinely works, but this course\'s Module 1 lesson on arrays already established why: a regular array stores its elements CONTIGUOUSLY in memory, with each element\'s address computed directly from its index. Inserting a new element at index \`0\` means every existing element\'s index must shift by one to make room — the item at index 0 moves to index 1, the item at index 1 moves to index 2, and so on, for all 500,000 existing tasks. This is a genuine \`O(n)\` operation, hidden behind a single, innocent-looking method call, and it happens on every single urgent task added.

**The fix: a singly linked list, whose nodes are not contiguous at all**

\`\`\`js
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null; // a pointer to the NEXT node, nothing about position
  }
}

class LinkedList {
  constructor() {
    this.head = null; // the list only needs to remember where it STARTS
  }
  addUrgentTask(value) {
    const newNode = new ListNode(value);
    newNode.next = this.head; // point the new node at the OLD first node
    this.head = newNode;      // the list now starts here instead
  }
}
\`\`\`

\`\`\`ts
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  addUrgentTask(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
  }
}
\`\`\`

Each \`ListNode\` holds its own value plus a \`next\` pointer to wherever the following node happens to live in memory — nodes are deliberately NOT stored contiguously, so there is no fixed "position" for any node to be shifted out of. Adding a new task to the front means creating one new node, pointing its \`next\` at whatever the current \`head\` is, and updating \`head\` to point at this new node instead — a fixed, small number of steps, \`O(1)\`, regardless of how many tasks the list already holds. Nothing about any of the other 500,000 existing nodes needs to move, or even be touched, at all.`,

    simpleHi: `**Toote hue se shuru.** Ek array-backed task queue, urgent tasks ko front mein jodte hue:

\`\`\`js
const tasks = [/* 500,000 pending tasks */];

function addUrgentTask(task) {
  tasks.unshift(task); // index 0 par insert karo
}
\`\`\`

\`unshift\` index \`0\` par insert karna sach mein kaam karta hai, par is course ka Module 1 ka arrays waala lesson pehle hi sthaapit kar chuka hai kyun: ek regular array apne elements ko memory mein CONTIGUOUSLY store karta hai, har element ka address seedhe uske index se gana gaya. Index \`0\` par ek naya element insert karna matlab hai har maujood element ka index ek se shift hona chahiye jagah banaane ke liye — index 0 par item index 1 par move hota hai, index 1 par item index 2 par move hota hai, waghaira, sab 500,000 maujood tasks ke liye. Ye ek asli \`O(n)\` operation hai, ek akele, maasoom-dikhne-waale method call ke peeche chhupa hua, aur ye har akele jode gaye urgent task par hota hai.

**Fix: ek singly linked list, jiske nodes bilkul contiguous nahi hain**

\`\`\`js
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null; // AGLE node ka ek pointer, position ke baare mein kuch nahi
  }
}

class LinkedList {
  constructor() {
    this.head = null; // list ko sirf ye yaad rakhna hai ki ye kahaan SHURU hota hai
  }
  addUrgentTask(value) {
    const newNode = new ListNode(value);
    newNode.next = this.head; // naye node ko PURANE pehle node ki taraf point karo
    this.head = newNode;      // list ab iske bajaye yahaan se shuru hoti hai
  }
}
\`\`\`

\`\`\`ts
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  addUrgentTask(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
  }
}
\`\`\`

Har \`ListNode\` apni value plus ek \`next\` pointer rakhta hai jahan bhi agla node memory mein samyog se rehta hai — nodes jaan-boojhkar contiguously store NAHI kiye jaate, isliye kisi bhi node ke liye koi fixed "position" nahi hai jismein se ise shift kiya jaaye. Front mein ek naya task jodna matlab hai ek naya node banaana, iske \`next\` ko point karna jo bhi current \`head\` hai, aur \`head\` ko update karna is naye node ki taraf point karne ke liye iske bajaye — steps ki ek fixed, chhoti tadaad, \`O(1)\`, chahe list pehle se kitne bhi tasks rakhti ho. Baaki 500,000 maujood nodes mein se kisi ke baare mein bhi kuch bhi move hone ki, ya bilkul chhue jaane ki bhi, zaroorat nahi hai.`,

    content: `## The trade-off this lesson's fix does not mention for free: losing O(1) index access

\`\`\`js
function get(list, index) {
  let current = list.head;
  for (let i = 0; i < index; i++) {
    current = current.next; // must walk, one node at a time — no shortcut
  }
  return current ? current.value : undefined;
}
\`\`\`

The exact same property that makes front-insertion \`O(1)\` — nodes not sitting in fixed, contiguous positions — is what makes reaching "the element at index \`k\`" cost \`O(k)\` rather than the \`O(1)\` an array provides. Since a node\'s location in memory has no fixed relationship to its logical position in the list, there is no arithmetic shortcut (the way \`arr[i]\`\'s address is computed directly, per this course\'s Module 1 lesson) — the only way to reach the fifth node is to actually walk through the first, second, third, and fourth nodes\' \`next\` pointers to get there. This is a genuine, unavoidable trade-off, not an oversight: a singly linked list trades away fast index access specifically to gain fast front-insertion, and no implementation trick recovers both simultaneously from the same underlying structure.

## Traversal: the one operation every linked list task starts with

\`\`\`js
function printAll(list) {
  let current = list.head;
  while (current !== null) {
    console.log(current.value);
    current = current.next; // move forward one node at a time
  }
}
\`\`\`

\`\`\`ts
function printAll<T>(list: LinkedList<T>): void {
  let current: ListNode<T> | null = list.head;
  while (current !== null) {
    console.log(current.value);
    current = current.next;
  }
}
\`\`\`

Nearly every linked-list operation this course\'s later lessons cover — searching, reversing, detecting a cycle, merging two lists — is built from this same basic traversal shape: start a pointer at \`head\`, do something with the current node, then move the pointer to \`current.next\`, repeating until \`current\` becomes \`null\` (the signal that the list has ended). This is worth internalizing as the single foundational skill of this entire module, the same way this course\'s Module 1 established tracing through code by hand as its own foundational skill — every more advanced linked-list technique in this module is a variation on this exact traversal pattern, not a fundamentally different one.

## Why null matters: the end-of-list sentinel

A linked list has no equivalent to an array\'s own \`.length\` property telling it directly how many elements it holds — the only way to know a list has ended is that the last node\'s \`next\` pointer is \`null\` rather than pointing at another node. This makes correctly checking for \`null\` before accessing \`.next\` or \`.value\` a genuinely critical habit — attempting to read \`.next\` on something that is already \`null\` (having walked one step too far past the actual end of the list) throws a runtime error in both JavaScript and TypeScript, a specific, common mistake this course\'s later lessons on reversing and merging linked lists will return to repeatedly.`,

    contentHi: `## Trade-off jise is lesson ka fix muft mein nahi bataata: O(1) index access khona

\`\`\`js
function get(list, index) {
  let current = list.head;
  for (let i = 0; i < index; i++) {
    current = current.next; // chalna hi hoga, ek waqt mein ek node — koi shortcut nahi
  }
  return current ? current.value : undefined;
}
\`\`\`

Bilkul wahi property jo front-insertion ko \`O(1)\` banaati hai — nodes fixed, contiguous positions mein na baithna — wo hai jo "index \`k\` par element" tak pahunchna \`O(k)\` kharch karaata hai us \`O(1)\` ke bajaye jo ek array pradaan karta hai. Kyunki memory mein ek node ki location ka list mein uski logical position se koi fixed rishta nahi hai, koi arithmetic shortcut nahi hai (jaise \`arr[i]\` ka address seedhe gana jaata hai, is course ke Module 1 ke lesson ke anusaar) — paanchwe node tak pahunchne ka akela tarika hai asal mein pehle, doosre, teesre, aur chauthe nodes ke \`next\` pointers ke through wahaan tak chalna. Ye ek asli, bachne-yogya-na trade-off hai, ek chook nahi: ek singly linked list tez index access ko chhod deti hai khaas taur par tez front-insertion paane ke liye, aur koi implementation trick usi underlying structure se dono ek saath wapas nahi laata.

## Traversal: wo ek operation jisse har linked list kaam shuru hota hai

\`\`\`js
function printAll(list) {
  let current = list.head;
  while (current !== null) {
    console.log(current.value);
    current = current.next; // ek waqt mein ek node aage badho
  }
}
\`\`\`

\`\`\`ts
function printAll<T>(list: LinkedList<T>): void {
  let current: ListNode<T> | null = list.head;
  while (current !== null) {
    console.log(current.value);
    current = current.next;
  }
}
\`\`\`

Lagbhag har linked-list operation jo is course ke baad ke lessons cover karte hain — search karna, reverse karna, ek cycle detect karna, do lists merge karna — bilkul isi buniyaadi traversal shape se banaayi jaati hai: \`head\` par ek pointer shuru karo, current node ke saath kuch karo, phir pointer ko \`current.next\` tak move karo, dohraate hue jab tak \`current\` \`null\` na ban jaaye (sanket ki list khatam ho gayi). Ye is poore module ka akela buniyaadi kaushal ki tarah internalize karne laayak hai, usi tarike se jaise is course ke Module 1 ne code ko haath se trace karna apna buniyaadi kaushal sthaapit kiya — is module mein har zyaada advanced linked-list technique bilkul isi traversal pattern ka ek variation hai, ek buniyaadi roop se alag nahi.

## Null kyun maayne rakhta hai: end-of-list sentinel

Ek linked list ke paas ek array ki apni \`.length\` property ka koi samaan nahi hai jo ise seedhe bataaye ki ye kitne elements rakhta hai — ek list khatam ho chuki hai ye jaanne ka akela tarika ye hai ki aakhri node ka \`next\` pointer ek doosre node ki taraf point karne ke bajaye \`null\` hai. Ye \`.next\` ya \`.value\` access karne se pehle sahi tarike se \`null\` check karna ek sach mein critical aadat banaata hai — kisi aise cheez par \`.next\` padhne ki koshish karna jo pehle se \`null\` hai (list ke asli ant se ek kadam zyaada chal chuka hai) JavaScript aur TypeScript dono mein ek runtime error throw karta hai, ek khaas, aam galti jispar is course ke baad ke linked lists reverse aur merge karne waale lessons baar-baar wapas aayenge.`,

    examples: [
      {
        title: 'Broken: array unshift() shifting every existing element',
        titleHi: 'Toota: array \`unshift()\` har maujood element ko shift karta hue',
        code: `tasks.unshift(newTask); // every existing task shifts by one index`,
        codeJs: `const tasks = ["a", "b", "c"];
tasks.unshift("urgent");
console.log(tasks); // ["urgent", "a", "b", "c"]
// every one of "a", "b", "c" had its index shifted up by one`,
        codeTs: `const tasks: string[] = ["a", "b", "c"];
tasks.unshift("urgent");
console.log(tasks); // ["urgent", "a", "b", "c"]
// fully valid TypeScript — the shift cost is architectural`,
        output: `Correct output, but with 500,000 existing tasks instead of 3, this
same call would shift all 500,000 of them, one index each.`,
        explain: 'Contiguous memory layout, the same property that gives arrays O(1) index access, requires every existing element to shift when inserting at the front.',
        explainHi: 'Contiguous memory layout, wahi property jo arrays ko \`O(1)\` index access deti hai, front mein insert karte waqt har maujood element ko shift hone ki maang karti hai.',
      },
      {
        title: 'Fixed: linked list front insertion, touching only one new node',
        titleHi: 'Theek: linked list front insertion, sirf ek naya node chhuте hue',
        code: `newNode.next = this.head;
this.head = newNode;`,
        codeJs: `class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedList {
  constructor() { this.head = null; }
  addToFront(value) {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
  }
}
const list = new LinkedList();
list.addToFront("c");
list.addToFront("b");
list.addToFront("a");
list.addToFront("urgent"); // O(1), regardless of how many nodes exist`,
        codeTs: `class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  constructor(value: T) { this.value = value; }
}
class LinkedList<T> {
  head: ListNode<T> | null = null;
  addToFront(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
  }
}`,
        outputJs: `The list now reads "urgent" -> "a" -> "b" -> "c", built by
adding to the front four times, each insertion touching only the
one new node and this.head, regardless of the list's total size.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Only the new node and the head pointer are touched — every other existing node remains completely untouched, regardless of how many there are.',
        explainHi: 'Sirf naya node aur \`head\` pointer chhuye jaate hain — baaki har maujood node poori tarah bina-chhue rehta hai, chahe wo kitne bhi hon.',
      },
      {
        title: 'The trade-off made visible: index access now requires traversal',
        titleHi: 'Trade-off drishyaman banaaya gaya: index access ab traversal maangta hai',
        code: `function get(list, index) {
  let current = list.head;
  for (let i = 0; i < index; i++) current = current.next;
  return current.value;
}`,
        codeJs: `function get(list, index) {
  let current = list.head;
  for (let i = 0; i < index; i++) {
    if (current === null) return undefined;
    current = current.next;
  }
  return current ? current.value : undefined;
}
// reaching index k costs O(k) — no shortcut the way arr[k] has`,
        codeTs: `function get<T>(list: LinkedList<T>, index: number): T | undefined {
  let current: ListNode<T> | null = list.head;
  for (let i = 0; i < index; i++) {
    if (current === null) return undefined;
    current = current.next;
  }
  return current ? current.value : undefined;
}`,
        outputJs: `Getting the element at index 3 requires walking through indices
0, 1, and 2 first — there is no arithmetic shortcut, unlike arr[3].`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Reaching any specific index requires walking node by node from the head, since a node\'s memory location has no fixed relationship to its logical position in the list.',
        explainHi: 'Kisi bhi khaas index tak pahunchna \`head\` se node-dar-node chalna maangta hai, kyunki ek node ki memory location ka list mein uski logical position se koi fixed rishta nahi hai.',
      },
    ],

    mistakes: [
      {
        wrong: `tasks.unshift(newTask);
// used repeatedly in a hot path against a large, growing array`,
        right: `linkedList.addToFront(newTask);
// O(1) regardless of how large the list already is`,
        why: 'Array unshift() must shift every existing element to make room at index 0, an O(n) cost that grows with the array\'s size — a linked list\'s front insertion does not.',
        whyHi: 'Array \`unshift()\` ko index 0 par jagah banaane ke liye har maujood element shift karna chahiye, ek \`O(n)\` keemat jo array ke size ke saath badhti hai — ek linked list ki front insertion aisa nahi karti.',
      },
      {
        wrong: `function get(list, index) {
  return list[index]; // treating a linked list like an array
}`,
        right: `function get(list, index) {
  let current = list.head;
  for (let i = 0; i < index; i++) current = current.next;
  return current ? current.value : undefined;
}`,
        why: 'A linked list has no direct index-based access — reaching any specific position genuinely requires traversing from the head, one node at a time.',
        whyHi: 'Ek linked list ke paas koi seedha index-based access nahi hai — kisi bhi khaas position tak pahunchna sach mein head se traverse karna maangta hai, ek waqt mein ek node.',
      },
      {
        wrong: `while (current.next !== null) { current = current.next; }
console.log(current.next.value); // reading .value on a node one step past the end`,
        right: `while (current !== null) {
  console.log(current.value);
  current = current.next;
}`,
        why: 'Accessing .next or .value on a node that is already null throws a runtime error — checking for null before dereferencing is a genuinely critical habit for every linked-list operation.',
        whyHi: 'Ek aise node par \`.next\` ya \`.value\` access karna jo pehle se \`null\` hai ek runtime error throw karta hai — dereference karne se pehle \`null\` check karna har linked-list operation ke liye ek sach mein critical aadat hai.',
      },
    ],

    realWorld: [
      {
        en: '**Real task queues, undo/redo history stacks, and browser back/forward navigation are commonly implemented with linked-list-like structures specifically because insertion at one end needs to stay cheap regardless of size.**',
        hi: '**Asli task queues, undo/redo history stacks, aur browser back/forward navigation aksar linked-list-jaisi structures se lagu ki jaati hain khaas taur par kyunki ek sire par insertion ko sasta rehna chahiye chahe size kuch bhi ho.**',
      },
      {
        en: '**"Implement a linked list from scratch" and "reverse a linked list" are among the most commonly asked foundational technical interview questions**, specifically testing traversal and pointer-manipulation fluency.',
        hi: '**"Shuru se ek linked list lagu karo" aur "ek linked list reverse karo" sabse aam poochhe jaane waale foundational technical interview sawaalon mein se hain**, khaas taur par traversal aur pointer-manipulation fluency test karte hue.',
      },
      {
        en: '**The array-versus-linked-list trade-off (fast index access versus fast front insertion) is a genuinely standard, widely taught contrast in every serious data structures curriculum**, not a simplified framing invented for this course.',
        hi: '**Array-versus-linked-list trade-off (tez index access versus tez front insertion) har genuinely gambhir data structures curriculum mein ek sach mein standard, widely taught contrast hai**, is course ke liye ijaad ki gayi ek simplified framing nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does a linked list achieve O(1) insertion at the front while an array requires O(n), and why can\'t a single data structure achieve O(1) for both front insertion and index access simultaneously?',
        qHi: 'Ek linked list front mein \`O(1)\` insertion kaise haasil karti hai jabki ek array ko \`O(n)\` chahiye, aur ek akeli data structure front insertion aur index access dono ke liye ek saath \`O(1)\` kyun haasil nahi kar sakti?',
        a: 'An array\'s O(1) index access exists because its elements are stored contiguously in memory, meaning any specific element\'s address can be computed directly through simple arithmetic based on its index, requiring no traversal at all. This exact same contiguity, however, is precisely what forces an O(n) cost when inserting at the front: since every element\'s address is tied directly to its index, and every existing element must keep occupying the specific memory location its own index implies, making room for a new element at index 0 requires physically moving every other element to a new location one index higher, an operation whose cost scales with the total number of existing elements. A linked list makes the opposite trade specifically by giving up contiguity: each node lives wherever it happens to be allocated in memory, with no fixed relationship between a node\'s memory location and its logical position in the list, connected only by explicit next pointers stored within each node. Because there is no contiguity to preserve, inserting a new node at the front requires touching only two things — the new node itself, which needs its own next pointer set to point at the previous first node, and the list\'s own head reference, which needs to be updated to point at this new node — with every other existing node remaining completely untouched, regardless of how many there are, giving a genuine O(1) cost. The reason no single structure can achieve O(1) for both operations simultaneously is that they depend on mutually exclusive properties: O(1) index access specifically requires the arithmetic shortcut that only comes from fixed, contiguous memory positions, while O(1) front insertion specifically requires the freedom to add a new element without needing to preserve any other element\'s existing fixed position — a structure cannot simultaneously guarantee that every element\'s position is fixed and computable, and that a new element can be added without disturbing anyone else\'s position.',
        aHi: 'Ek array ki \`O(1)\` index access isliye maujood hai kyunki iske elements memory mein contiguously store hote hain, matlab kisi bhi khaas element ka address seedhe saadhe arithmetic ke zariye uske index ke aadhaar par gana jaa sakta hai, koi traversal bilkul zaruri na hote hue. Bilkul yahi contiguity, halaanki, bilkul wo hai jo front mein insert karte waqt ek \`O(n)\` keemat majboor karti hai: kyunki har element ka address seedhe iske index se juda hai, aur har maujood element ko us khaas memory location par kabza karte rehna chahiye jo uska apna index darsata hai, index 0 par ek naye element ke liye jagah banaana har doosre element ko physically ek index oopar ek nayi location mein move karna maangta hai, ek operation jiski keemat maujood elements ki total tadaad ke saath scale karti hai. Ek linked list ulta trade banaati hai khaas taur par contiguity chhodkar: har node jahan bhi samyog se memory mein allocate hota hai wahaan rehta hai, ek node ki memory location aur list mein uski logical position ke beech koi fixed rishta na hote hue, sirf har node ke andar store kiye gaye explicit \`next\` pointers dwara joda gaya. Kyunki preserve karne ke liye koi contiguity nahi hai, front mein ek naya node insert karna sirf do cheezon ko chhune ki maang karta hai — naya node khud, jise apna \`next\` pointer purane pehle node ki taraf point karne ke liye set karna hai, aur list ka apna \`head\` reference, jise is naye node ki taraf point karne ke liye update karna hai — baaki har maujood node poori tarah bina-chhue rehte hue, chahe wo kitne bhi hon, ek asli \`O(1)\` keemat dete hue. Wajah ki koi akeli structure dono operations ke liye ek saath \`O(1)\` haasil nahi kar sakti ye hai ki wo ek doosre ko exclude karti properties par nirbhar karte hain: \`O(1)\` index access khaas taur par us arithmetic shortcut ki maang karti hai jo sirf fixed, contiguous memory positions se aata hai, jabki \`O(1)\` front insertion khaas taur par is azaadi ki maang karta hai ki koi doosre element ki maujood fixed position ko preserve kiye bina ek naya element joda jaa sake — ek structure ek saath ye guarantee nahi kar sakti ki har element ki position fixed aur computable hai, aur ki ek naya element bina kisi doosre ki position chheda jode jaa sakta hai.',
      },
      {
        q: 'Why is checking for null before accessing a node\'s .next or .value considered a genuinely critical habit in linked list code, rather than a minor stylistic preference?',
        qHi: 'Ek node ke \`.next\` ya \`.value\` ko access karne se pehle \`null\` check karna linked list code mein ek sach mein critical aadat kyun maani jaati hai, ek chhoti stylistic preference nahi?',
        a: 'A linked list has no built-in property, comparable to an array\'s own .length, that directly reports how many nodes it contains — the only signal that a traversal has reached the actual end of the list is that the current node\'s next pointer is null rather than referencing another node. This makes null specifically function as the list\'s own end-of-structure sentinel, and correctly checking for it before proceeding is not a matter of code style, but a requirement for the code to behave correctly at all. Attempting to read a property, such as .value or .next, on something that is already null is not a logical mistake that produces a subtly wrong answer — it is an operation that both JavaScript and TypeScript treat as invalid at runtime, immediately throwing an error and halting execution, since null represents the deliberate absence of any object to read a property from in the first place. This means a traversal loop that forgets to check for null before advancing one more step past the actual last node does not merely produce an incorrect result to be caught by a correctness test later; it crashes the program outright, at the exact moment the oversight occurs. Because nearly every linked-list operation this course\'s later lessons cover — searching, reversing, merging, detecting cycles — is built around some variation of the same traversal-until-null pattern, correctly and consistently checking for null before dereferencing a node is not an optional refinement to add later, but a foundational requirement that must be present from the very first line of traversal code written, precisely because the cost of skipping it is an immediate crash rather than a silent, harder-to-notice bug.',
        aHi: 'Ek linked list ke paas koi built-in property nahi hai, ek array ki apni \`.length\` ke taulanaatmak, jo seedhe report kare ki ye kitne nodes rakhta hai — akela sanket ki ek traversal list ke asli ant tak pahunch chuki hai ye hai ki current node ka \`next\` pointer ek doosre node ko reference karne ke bajaye \`null\` hai. Ye \`null\` ko khaas taur par list ke apne end-of-structure sentinel ki tarah kaam karaata hai, aur aage badhne se pehle sahi tarike se ise check karna code style ki baat nahi hai, balki code ke bilkul sahi tarike se vyavahaar karne ke liye ek zaroorat hai. Ek property, jaisa \`.value\` ya \`.next\`, ko kisi aise cheez par padhne ki koshish karna jo pehle se \`null\` hai ek logical galti nahi hai jo ek soochm galat jawaab banaati hai — ye ek operation hai jise JavaScript aur TypeScript dono runtime par invalid treat karte hain, turant ek error throw karte hue aur execution rokte hue, kyunki \`null\` ek jaan-boojhkar object ki gairhajiri darsata hai jismein se ek property padhi jaaye. Iska matlab hai ek traversal loop jo asli aakhri node se ek aur kadam aage badhne se pehle \`null\` check karna bhool jaata hai sirf ek galat nateeja nahi banaata jise baad mein ek sahihata test pakde; ye program ko poori tarah crash karta hai, bilkul us pal jab chook hoti hai. Kyunki lagbhag har linked-list operation jise is course ke baad ke lessons cover karte hain — search karna, reverse karna, merge karna, cycles detect karna — usi traversal-until-null pattern ke kisi variation ke aas-paas banaayi gayi hai, ek node ko dereference karne se pehle sahi aur consistently \`null\` check karna baad mein jodne ke liye ek vaikalpik sudhaar nahi hai, balki ek buniyaadi zaroorat hai jo traversal code ki bilkul pehli line se maujood honi chahiye, bilkul isliye kyunki ise skip karne ki keemat ek turant crash hai, ek chupa hua, pakadne mein mushkil bug nahi.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken array-based addUrgentTask (using unshift) and the fixed linked-list-based version from this lesson. Time both against 100,000 existing items using console.time/console.timeEnd.',
        taskHi: 'Is lesson ka toota array-based \`addUrgentTask\` (\`unshift\` istemal karte hue) aur theek linked-list-based version dono banao. Dono ko 100,000 maujood items ke khilaaf \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Build the initial 100,000-item array or list once, outside the timed section, so the timing only measures the single front-insertion operation itself.',
        hintHi: 'Shuruaati 100,000-item array ya list ek baar banao, timed section ke bahar, taaki timing sirf akeli front-insertion operation khud naapa.',
      },
      {
        task: 'Build the ListNode and LinkedList classes from this lesson, add several values to the front, and implement a printAll function using the traversal pattern from this lesson\'s content section.',
        taskHi: 'Is lesson ke \`ListNode\` aur \`LinkedList\` classes banao, front mein kayi values jodo, aur is lesson ke content section ke traversal pattern ka istemal karke ek \`printAll\` function lagu karo.',
        hint: 'Confirm the order values print in matches what you\'d expect given each addToFront call places its value before everything already in the list.',
        hintHi: 'Confirm karo ki values kis order mein print hoti hain us se mel khaata hai jo tum expect karoge ye dekhte hue ki har \`addToFront\` call apni value list mein pehle se maujood har cheez se pehle rakhta hai.',
      },
      {
        task: 'Deliberately write a traversal loop that forgets to check for null before accessing .value, and run it against a real list to see the actual runtime error it produces. Then fix it using the correct null check.',
        taskHi: 'Jaan-boojhkar ek traversal loop likho jo \`.value\` access karne se pehle \`null\` check karna bhool jaata hai, aur ise ek asli list ke khilaaf chalaao asli runtime error dekhne ke liye jo ye banaata hai. Phir sahi \`null\` check istemal karke ise theek karo.',
        hint: 'Deliberately loop one iteration too far past the list\'s actual last node to trigger the error reliably.',
        hintHi: 'Jaan-boojhkar list ke asli aakhri node se ek iteration zyaada loop karo error ko bharose se trigger karne ke liye.',
      },
    ],

    keyTakeaways: [
      'An array\'s O(1) index access comes from elements sitting contiguously in memory, and that same contiguity is exactly what forces an O(n) shift cost when inserting at the front.',
      'A singly linked list\'s nodes are deliberately not stored contiguously — each node only holds a pointer to the next one — making front insertion O(1) at the cost of losing O(1) index access.',
      'Reaching a specific index in a linked list requires traversing from the head one node at a time, costing O(k) for index k, since there is no arithmetic shortcut the way there is for an array.',
      'Nearly every linked-list operation is built from the same basic traversal shape: start at head, process the current node, move to current.next, repeat until null.',
      'null is a linked list\'s own end-of-structure sentinel, since it has no equivalent to an array\'s .length — checking for null before dereferencing a node is a critical habit, not a stylistic preference.',
      'The array-versus-linked-list trade-off (fast index access versus fast front insertion) is a genuine, unavoidable trade-off — no implementation trick recovers both simultaneously from the same structure.',
    ],
    keyTakeawaysHi: [
      'Ek array ki \`O(1)\` index access elements ke memory mein contiguously baithne se aati hai, aur wahi contiguity bilkul wahi hai jo front mein insert karte waqt ek \`O(n)\` shift keemat majboor karti hai.',
      'Ek singly linked list ke nodes jaan-boojhkar contiguously store nahi kiye jaate — har node sirf agle ek ka ek pointer rakhta hai — front insertion ko \`O(1)\` banaate hue \`O(1)\` index access khone ki keemat par.',
      'Ek linked list mein ek khaas index tak pahunchna head se ek waqt mein ek node traverse karna maangta hai, index \`k\` ke liye \`O(k)\` kharch karte hue, kyunki koi arithmetic shortcut nahi hai jaisa ek array ke liye hai.',
      'Lagbhag har linked-list operation usi buniyaadi traversal shape se banaayi jaati hai: \`head\` par shuru karo, current node process karo, \`current.next\` tak move karo, \`null\` tak dohraao.',
      '\`null\` ek linked list ka apna end-of-structure sentinel hai, kyunki iske paas ek array ki \`.length\` ka koi samaan nahi hai — ek node ko dereference karne se pehle \`null\` check karna ek critical aadat hai, stylistic preference nahi.',
      'Array-versus-linked-list trade-off (tez index access versus tez front insertion) ek asli, bachne-yogya-na trade-off hai — koi implementation trick usi structure se dono ek saath wapas nahi laata.',
    ],
  },
];
