/**
 * DSA Complete Course — Module 5: Stacks & Queues, lesson 1.
 *
 * Stack fundamentals: LIFO (last in, first out), and why an "undo"
 * feature is the canonical motivating example. Broken example: an undo
 * history implemented by removing the OLDEST recorded action (the front
 * of an array, via shift()) instead of the most recently recorded one —
 * a genuine correctness bug (undo removes the wrong action entirely),
 * compounded by the O(n) cost of shift() this course's Module 4 lesson
 * on linked lists already established for array front-operations. Fixed
 * with a proper stack: push and pop both operate on the SAME end (the
 * top), giving both the correct LIFO semantics undo actually needs and
 * O(1) cost, whether backed by a plain array's own push()/pop() or by a
 * linked list inserting/removing at its head.
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

export const DSA_MODULE_5: CourseLesson[] = [
  {
    slug: 'stack-fundamentals-lifo',
    title: 'Stack Fundamentals: Last In, First Out',
    titleHi: 'Stack Ki Buniyaad: Last In, First Out',
    description: 'An undo feature records every action a user takes, then "undoes" by removing the OLDEST recorded action instead of the most recent one — a user who types five characters and hits undo does not get the fifth character removed, they get the first one removed, from a document that no longer has any way to reach it.',
    descriptionHi: 'Ek undo feature har action record karta hai jo user karta hai, phir sabse PURANE record ki gayi action ko hataake "undo" karta hai sabse haaliya ke bajaye — ek user jo paanch characters type karta hai aur undo dabaata hai ise paanchwaan character hataaya hua nahi milta, unhe pehla hataaya hua milta hai, ek aise document se jismein ab isse pahunchne ka koi tarika nahi hai.',
    difficulty: 'EASY',
    duration: 18,
    order: 1,

    analogy: {
      en: '**A single stack of plates on a kitchen counter, where you can only ever add a new plate to the TOP, and only ever remove the plate currently sitting on the TOP — versus reaching underneath the entire stack to grab the very BOTTOM plate, the one that has been sitting there the longest.** Every plate placed on top of a stack sits, quite literally, on top of everything below it — reaching in and pulling out the bottom plate while a dozen others sit on top of it is not merely inconvenient, it does not correspond to any action a real stack of plates actually supports. The only two operations a stack of plates genuinely allows are placing a new plate on top, and removing whichever plate is currently on top — always the most recently placed one. An undo feature that removes the OLDEST recorded action, rather than the most recent one, is reaching underneath the stack for the bottom plate: it retrieves an item, but not the one anyone actually wanted, since undo is supposed to reverse the most recent thing done, not the very first. A stack data structure — where push adds to the top and pop removes from the top, and nothing else is ever directly accessible — is the plate stack itself: it deliberately only supports the two operations that genuinely make sense for "most recently added, first removed" behavior, and nothing else.',
      hi: '**Ek kitchen counter par plates ka ek akela stack, jahan tum kabhi bhi sirf ek naya plate TOP par jod sakte ho, aur kabhi bhi sirf wo plate hataa sakte ho jo abhi TOP par baitha hai — versus poore stack ke neeche pahunchna bilkul NEECHE waala plate pakadne ke liye, wo jo sabse lambe samay se wahaan baitha hai.** Ek stack ke top par rakha gaya har plate, bilkul shaabdik roop se, iske neeche har cheez ke oopar baitha hai — andar pahunchna aur neeche wala plate nikaalna jabki ek dozen doosre iske oopar baithe hain sirf asuvidhajanak nahi hai, ye kisi bhi action se mel nahi khaata jise plates ka ek asli stack asal mein support karta hai. Sirf do operations jo plates ka ek stack sach mein anumati deta hai ek naya plate top par rakhna hai, aur jo bhi plate abhi top par hai use hataana hai — hamesha sabse haaliya rakha gaya. Ek undo feature jo sabse PURANI record ki gayi action hataata hai, sabse haaliya ke bajaye, stack ke neeche pahunch raha hai neeche waale plate ke liye: ye ek item retrieve karta hai, par wo nahi jo koi bhi asal mein chahta tha, kyunki undo ko sabse haaliya kiya gaya kaam reverse karna chahiye, bilkul pehla nahi. Ek stack data structure — jahan \`push\` top mein jodta hai aur \`pop\` top se hataata hai, aur kuch aur kabhi seedhe accessible nahi hota — plate stack khud hai: ye jaan-boojhkar sirf un do operations ko support karta hai jo "sabse haaliya joda gaya, pehle hataaya gaya" vyavahaar ke liye sach mein maayne rakhte hain, aur kuch aur nahi.',
    },

    simple: `**Start broken.** An undo feature removing the oldest recorded action instead of the most recent:

\`\`\`js
const history = [];

function recordAction(action) {
  history.push(action); // adds to the END of the array
}

function undo() {
  return history.shift(); // removes from the FRONT — the OLDEST action
}
\`\`\`

Every new action is correctly added to the end of \`history\` via \`push\`, but \`undo\` reaches for \`shift\`, which removes from the FRONT — the very first action ever recorded, not the most recent one. This is a genuine correctness bug, not a style choice: a user typing "cat" then "dog" then pressing undo expects "dog" (the most recent action) to be undone, but this code undoes "cat" instead, the oldest action in the entire history. This course\'s Module 4 lesson on linked lists already established that \`shift\`/\`unshift\` also cost \`O(n)\`, since every remaining element must shift down an index — so this implementation is both semantically wrong AND needlessly expensive.

**The fix: push and pop operate on the SAME end — the top**

\`\`\`js
const history = [];

function recordAction(action) {
  history.push(action); // adds to the top
}

function undo() {
  return history.pop(); // removes from the top — the MOST RECENT action
}
\`\`\`

\`\`\`ts
const history: string[] = [];

function recordAction(action: string): void {
  history.push(action);
}

function undo(): string | undefined {
  return history.pop();
}
\`\`\`

Both \`recordAction\` and \`undo\` now operate on the exact same end of the array — the end \`push\` and \`pop\` both work from. Recording "cat" then "dog" and calling \`undo\` correctly returns "dog", the most recently recorded action, matching what a real undo feature actually needs: reverse the last thing done, not the first. This "add and remove from the same end" behavior is precisely what a stack is, and \`Array.prototype.push()\`/\`.pop()\` in JavaScript already implement it directly, both genuinely \`O(1)\`, since neither requires shifting any other element.`,

    simpleHi: `**Toote hue se shuru.** Ek undo feature sabse haaliya ke bajaye sabse purani record ki gayi action hataate hue:

\`\`\`js
const history = [];

function recordAction(action) {
  history.push(action); // array ke ANT mein jodta hai
}

function undo() {
  return history.shift(); // FRONT se hataata hai — sabse PURANI action
}
\`\`\`

Har naya action sahi tarike se \`history\` ke ant mein \`push\` ke zariye joda jaata hai, par \`undo\` \`shift\` pakadta hai, jo FRONT se hataata hai — bilkul pehli kabhi record ki gayi action, sabse haaliya nahi. Ye ek asli sahihata bug hai, ek style chunaav nahi: ek user jo "cat" phir "dog" type karta hai aur undo dabaata hai ummeed karta hai "dog" (sabse haaliya action) undo ho, par ye code iske bajaye "cat" undo karta hai, poori history mein sabse purani action. Is course ka Module 4 ka linked lists lesson pehle hi sthaapit kar chuka hai ki \`shift\`/\`unshift\` bhi \`O(n)\` kharch karte hain, kyunki har bachi hui element ko index neeche shift hona chahiye — isliye ye implementation dono semantically galat AUR bina-zaroorat mehenga hai.

**Fix: push aur pop SAME ant par operate karte hain — top**

\`\`\`js
const history = [];

function recordAction(action) {
  history.push(action); // top mein jodta hai
}

function undo() {
  return history.pop(); // top se hataata hai — sabse HAALIYA action
}
\`\`\`

\`\`\`ts
const history: string[] = [];

function recordAction(action: string): void {
  history.push(action);
}

function undo(): string | undefined {
  return history.pop();
}
\`\`\`

\`recordAction\` aur \`undo\` dono ab array ke bilkul samaan ant par operate karte hain — wo ant jinse \`push\` aur \`pop\` dono kaam karte hain. "cat" phir "dog" record karna aur \`undo\` bulaana sahi tarike se "dog" return karta hai, sabse haaliya record ki gayi action, us se mel khaate hue jo ek asli undo feature ko asal mein chahiye: aakhri kiya gaya kaam reverse karo, pehla nahi. Ye "usi ant se jodo aur hataao" vyavahaar bilkul wo hai jo ek stack hai, aur JavaScript mein \`Array.prototype.push()\`/\`.pop()\` ise pehle se seedhe lagu karte hain, dono sach mein \`O(1)\`, kyunki kisi ko bhi kisi doosre element ko shift karne ki zaroorat nahi hoti.`,

    content: `## The formal stack interface: only four operations, deliberately

\`\`\`
push(item)  — add an item to the top
pop()       — remove and return the top item
peek()      — look at the top item WITHOUT removing it
isEmpty()   — check whether the stack has anything in it at all
\`\`\`

A stack is deliberately a RESTRICTED interface, not merely an array used a certain way — the entire point is that nothing other than the current top item is ever directly accessible, which is precisely what guarantees LIFO (last in, first out) behavior. \`peek()\` is worth calling out specifically: it is genuinely common to need to know what the top item is without committing to removing it yet (checking whether the most recent action is undoable at all, for instance), and conflating "look" with "remove" is a common, avoidable source of bugs. \`isEmpty()\` matters because calling \`pop()\` or \`peek()\` on a genuinely empty stack needs a defined, checked behavior, rather than silently returning \`undefined\` and having that flow unnoticed into code that assumes a real value was returned.

## A stack can be backed by an array or a linked list — both work, with different trade-offs

\`\`\`js
// Array-backed: JavaScript's own push/pop are the stack operations directly
class ArrayStack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

// Linked-list-backed: push/pop operate on the HEAD (this module's Module 4
// established that front insertion/removal on a linked list is O(1))
class LinkedListStack {
  constructor() { this.head = null; }
  push(value) {
    this.head = { value, next: this.head };
  }
  pop() {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    return value;
  }
  peek() { return this.head === null ? undefined : this.head.value; }
  isEmpty() { return this.head === null; }
}
\`\`\`

Both implementations genuinely provide \`O(1)\` push and pop — the array-backed version because \`Array.prototype.push()\`/\`.pop()\` operate on the array\'s own end without shifting anything (this course\'s Module 4 lesson on linked lists contrasted this directly against \`unshift\`/\`shift\`, which operate on the FRONT and do require shifting), and the linked-list-backed version because adding or removing at the \`head\` never requires touching any other node, exactly as this course\'s Module 4 lesson on singly linked lists established. Choosing between them in practice is rarely about performance, since both are \`O(1)\` — it is usually a matter of which underlying structure is already in use, or whether a maximum size needs to be pre-allocated (favoring an array) versus genuinely unbounded, dynamic growth (favoring a linked list).

## Where stacks show up beyond undo: the call stack itself

\`\`\`
calling factorial(3):
  factorial(3) calls factorial(2)   — pushed onto the call stack
    factorial(2) calls factorial(1) — pushed onto the call stack
      factorial(1) returns 1        — POPPED off the call stack
    factorial(2) returns 2          — POPPED off the call stack
  factorial(3) returns 6            — POPPED off the call stack
\`\`\`

This course\'s Module 1 lesson on analyzing recursion already relied on a stack without naming it explicitly: the "call stack" that tracks pending recursive calls is, quite literally, a stack in the sense this lesson formalizes — each new recursive call is PUSHED onto it, and each call that finishes and returns is POPPED off, always from the top, always in last-in-first-out order. Recognizing that the call stack itself is an instance of this same abstract data type is a direct, concrete example of this course\'s own recurring theme: a small number of genuinely reusable structures show up, sometimes without being named, across problems and mechanisms that look completely unrelated on the surface.`,

    contentHi: `## Formal stack interface: sirf chaar operations, jaan-boojhkar

\`\`\`
push(item)  — top mein ek item jodo
pop()       — top item hataao aur return karo
peek()      — top item ko dekho USE HATAAYE BINA
isEmpty()   — check karo ki stack mein bilkul kuch hai ya nahi
\`\`\`

Ek stack jaan-boojhkar ek RESTRICTED interface hai, sirf ek array jo ek khaas tarike se istemal hota hai nahi — poora point ye hai ki current top item ke alaawa kuch bhi kabhi seedhe accessible nahi hai, jo bilkul wo hai jo LIFO (last in, first out) vyavahaar guarantee karta hai. \`peek()\` khaas taur par bataane laayak hai: ye sach mein aam hai ye jaanne ki zaroorat hona ki top item kya hai use abhi hataane ke liye committed hue bina (ye check karna ki kya sabse haaliya action bilkul undo-yogya hai, misal ke taur par), aur "dekho" ko "hataao" se milaana bugs ka ek aam, bachne-yogya srot hai. \`isEmpty()\` maayne rakhta hai kyunki ek sach mein khaali stack par \`pop()\` ya \`peek()\` bulaane ko ek defined, checked vyavahaar chahiye, chupchaap \`undefined\` return karne aur us flow ko na-notice-kiya-jaana usi code mein jaane dene ke bajaye jo maanta hai ki ek asli value return hui.

## Ek stack ko ek array ya ek linked list se backed kiya jaa sakta hai — dono kaam karte hain, alag trade-offs ke saath

\`\`\`js
// Array-backed: JavaScript ka apna push/pop seedhe stack operations hain
class ArrayStack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

// Linked-list-backed: push/pop HEAD par operate karte hain (is module ke
// Module 4 ne sthaapit kiya ki ek linked list par front insertion/removal O(1) hai)
class LinkedListStack {
  constructor() { this.head = null; }
  push(value) {
    this.head = { value, next: this.head };
  }
  pop() {
    if (this.head === null) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    return value;
  }
  peek() { return this.head === null ? undefined : this.head.value; }
  isEmpty() { return this.head === null; }
}
\`\`\`

Dono implementations sach mein \`O(1)\` push aur pop pradaan karte hain — array-backed version kyunki \`Array.prototype.push()\`/\`.pop()\` array ke apne ant par operate karte hain kuch bhi shift kiye bina (is course ke Module 4 ke linked lists lesson ne ise seedhe \`unshift\`/\`shift\` ke khilaaf contrast kiya, jo FRONT par operate karte hain aur sach mein shifting maangte hain), aur linked-list-backed version kyunki \`head\` par jodna ya hataana kabhi kisi doosre node ko chhune ki zaroorat nahi rakhta, bilkul jaisa is course ke Module 4 ke singly linked lists lesson ne sthaapit kiya. Practice mein unke beech chunaav shaayad hi kabhi performance ke baare mein hai, kyunki dono \`O(1)\` hain — ye aksar is baat ki baat hai ki underlying structure pehle se istemal mein hai, ya kya ek maximum size ko pehle se allocate karne ki zaroorat hai (ek array favor karte hue) versus sach mein unbounded, dynamic growth (ek linked list favor karte hue).

## Stacks kahaan undo se aage dikhte hain: call stack khud

\`\`\`
factorial(3) bulaana:
  factorial(3) factorial(2) bulaata hai   — call stack mein push kiya gaya
    factorial(2) factorial(1) bulaata hai — call stack mein push kiya gaya
      factorial(1) 1 return karta hai      — call stack se POP kiya gaya
    factorial(2) 2 return karta hai        — call stack se POP kiya gaya
  factorial(3) 6 return karta hai          — call stack se POP kiya gaya
\`\`\`

Is course ke Module 1 ke recursion ka vishleshan karne wale lesson ne pehle hi ek stack par nirbhar kiya bina ise explicitly naam diye: "call stack" jo pending recursive calls track karta hai, bilkul shaabdik roop se, ek stack hai us arth mein jise ye lesson formalize karta hai — har naya recursive call ismein PUSH kiya jaata hai, aur har call jo khatam hoti hai aur return hoti hai POP ki jaati hai, hamesha top se, hamesha last-in-first-out order mein. Ye pehchaanna ki call stack khud isi abstract data type ka ek instance hai is course ke apne dohraaye jaane waale theme ka ek seedha, thos udaharan hai: kuch taulanaatmak roop se kam genuinely reusable structures dikhte hain, kabhi-kabhi bina naam diye, un problems aur mechanisms mein jo satah par poori tarah na-jude dikhte hain.`,

    examples: [
      {
        title: 'Broken: undo removing the oldest action via shift()',
        titleHi: 'Toota: undo \`shift()\` ke zariye sabse purani action hataata hai',
        code: `function undo() {
  return history.shift(); // wrong end — removes the OLDEST action
}`,
        codeJs: `const history = [];
function recordAction(action) { history.push(action); }
function undo() { return history.shift(); }

recordAction("type cat");
recordAction("type dog");
console.log(undo()); // "type cat" — the WRONG action was undone`,
        codeTs: `const history: string[] = [];
function recordAction(action: string): void { history.push(action); }
function undo(): string | undefined { return history.shift(); }

recordAction("type cat");
recordAction("type dog");
console.log(undo()); // "type cat" — fully valid TypeScript, wrong behavior`,
        output: `undo() returns "type cat", the oldest action, when the user
actually expected "type dog" (the most recent one) to be undone.`,
        explain: 'shift() removes from the front of the array, the oldest recorded action, rather than the most recently recorded one an undo feature actually needs.',
        explainHi: '\`shift()\` array ke front se hataata hai, sabse purani record ki gayi action, us sabse haaliya record ki gayi ke bajaye jo ek undo feature ko asal mein chahiye.',
      },
      {
        title: 'Fixed: push and pop on the same end, correct LIFO order',
        titleHi: 'Theek: usi ant par push aur pop, sahi LIFO order',
        code: `function undo() {
  return history.pop(); // same end as push — the MOST RECENT action
}`,
        codeJs: `const history = [];
function recordAction(action) { history.push(action); }
function undo() { return history.pop(); }

recordAction("type cat");
recordAction("type dog");
console.log(undo()); // "type dog" — correctly the most recent action`,
        codeTs: `const history: string[] = [];
function recordAction(action: string): void { history.push(action); }
function undo(): string | undefined { return history.pop(); }

recordAction("type cat");
recordAction("type dog");
console.log(undo()); // "type dog"`,
        outputJs: `undo() correctly returns "type dog", the most recently recorded
action, matching real undo semantics.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'push and pop both operate on the same end of the array, giving genuine LIFO behavior and O(1) cost, with no shifting required.',
        explainHi: '\`push\` aur \`pop\` dono array ke samaan ant par operate karte hain, asli LIFO vyavahaar aur \`O(1)\` keemat dete hue, koi shifting zaruri na hote hue.',
      },
      {
        title: 'A minimal Stack class with all four formal operations',
        titleHi: 'Sab chaar formal operations ke saath ek minimal Stack class',
        code: `class Stack {
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`,
        codeJs: `class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

const s = new Stack();
s.push("a"); s.push("b");
console.log(s.peek()); // "b" — looked at, not removed
console.log(s.pop());  // "b" — now actually removed
console.log(s.peek()); // "a"`,
        codeTs: `class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
}`,
        outputJs: `peek() correctly returns "b" without removing it, and the
subsequent pop() then genuinely removes it — the two operations
are deliberately distinct.`,
        outputTs: `// Identical behaviour. Stack<T> gives full type safety for
// whatever type of item is being stored.`,
        explain: 'peek and pop are deliberately separate operations — conflating "look" with "remove" is a common, avoidable bug this formal interface prevents.',
        explainHi: '\`peek\` aur \`pop\` jaan-boojhkar alag operations hain — "dekho" ko "hataao" se milaana ek aam, bachne-yogya bug hai jise ye formal interface rokta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `function undo() { return history.shift(); }
// removing from the front while recordAction pushes to the end`,
        right: `function undo() { return history.pop(); }
// both operations on the same end — the top`,
        why: 'Recording to one end and removing from the other end breaks LIFO ordering entirely, removing the oldest action instead of the most recent one an undo feature actually needs.',
        whyHi: 'Ek ant mein record karna aur doosre ant se hataana LIFO ordering ko poori tarah todta hai, sabse purani action hataate hue us sabse haaliya ke bajaye jo ek undo feature ko asal mein chahiye.',
      },
      {
        wrong: `const top = stack.pop(); // removes it just to look at it
if (top === "urgent") stack.push(top); // pushing it back if it wasn't meant to be removed`,
        right: `if (stack.peek() === "urgent") { /* decide what to do without removing anything */ }`,
        why: 'Using pop() to merely check the top item, then pushing it back if it should not have been removed, is fragile and unnecessary — peek() exists specifically to look without removing.',
        whyHi: 'Sirf top item check karne ke liye \`pop()\` istemal karna, phir ise wapas push karna agar ise hataaya nahi jaana chahiye tha, fragile aur bekaar hai — \`peek()\` khaas taur par bina hataaye dekhne ke liye maujood hai.',
      },
      {
        wrong: `const top = stack.pop(); // called on a stack that might be empty
console.log(top.toUpperCase()); // crashes if the stack was empty and top is undefined`,
        right: `if (!stack.isEmpty()) {
  const top = stack.pop();
  console.log(top.toUpperCase());
}`,
        why: 'Calling pop() or peek() without first checking isEmpty() risks silently receiving undefined and later using it as if it were a real value, causing a crash somewhere downstream.',
        whyHi: 'Pehle \`isEmpty()\` check kiye bina \`pop()\` ya \`peek()\` bulaana chupchaap \`undefined\` milne aur baad mein ise ek asli value ki tarah istemal karne ka khatra rakhta hai, kahin aage ek crash ka kaaran banate hue.',
      },
    ],

    realWorld: [
      {
        en: '**Undo/redo systems, browser back-button history, and function call stacks in every programming language runtime are all real, production examples of the stack abstraction this lesson formalizes.**',
        hi: '**Undo/redo systems, browser back-button history, aur har programming language runtime mein function call stacks sab asli, production examples hain us stack abstraction ke jise ye lesson formalize karta hai.**',
      },
      {
        en: '**"Valid Parentheses" and "Evaluate Reverse Polish Notation" are among the most commonly cited practice problems specifically chosen to teach stack fundamentals.**',
        hi: '**"Valid Parentheses" aur "Evaluate Reverse Polish Notation" un practice problems mein sabse aam taur par cite ki jaane waali hain jo khaas taur par stack fundamentals sikhaane ke liye chuni gayi hain.**',
      },
      {
        en: '**JavaScript\'s own Array.prototype.push()/.pop() are documented, standard-library operations specifically designed to support O(1) stack behavior**, not a repurposed workaround.',
        hi: '**JavaScript ka apna \`Array.prototype.push()\`/\`.pop()\` documented, standard-library operations hain khaas taur par \`O(1)\` stack vyavahaar support karne ke liye design kiye gaye**, ek dobara-istemal-kiya-gaya workaround nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must a stack\'s push and pop operations both act on the same end of the underlying structure, and what specifically goes wrong if they act on opposite ends?',
        qHi: 'Ek stack ke \`push\` aur \`pop\` operations dono underlying structure ke samaan ant par kyun kaam karne chahiye, aur khaas taur par kya galat hota hai agar wo virudh ends par kaam karte hain?',
        a: 'A stack\'s defining property, last-in-first-out ordering, depends entirely on both its add and remove operations interacting with the same physical end of the underlying data. When a new item is added at one end, that end genuinely becomes the location of the most recently added item — nothing has been added anywhere else since. If the removal operation also acts on that same end, it necessarily removes the very item that was just added, guaranteeing that the most recent addition is always the first one removed, which is precisely what last-in-first-out means. If the removal operation instead acts on the OPPOSITE end from where additions occur, it removes whatever item has been sitting at that other end the longest, since that end has not been touched by any of the more recent additions at all — this produces first-in-first-out (FIFO) behavior instead, the ordering a queue provides, not a stack. Using shift() (which removes from the front) alongside push() (which adds to the end) mixes a stack\'s intended add operation with a queue\'s intended remove operation, producing neither a proper stack nor a proper queue, but a structure whose actual removal order corresponds to nothing meaningful in relation to the problem being solved — in the undo example this lesson opened with, it corresponds to removing the very first action ever taken, which is essentially never what "undo" is supposed to mean.',
        aHi: 'Ek stack ki paribhaashit property, last-in-first-out ordering, poori tarah is baat par nirbhar karti hai ki uske add aur remove operations dono underlying data ke samaan physical ant se interact karte hain. Jab ek naya item ek ant par joda jaata hai, wo ant sach mein sabse haaliya jode gaye item ki location ban jaata hai — tab se kahin aur kuch nahi joda gaya. Agar removal operation bhi usi ant par kaam karta hai, ye zaroori roop se bilkul us item ko hataata hai jo abhi joda gaya, guarantee karte hue ki sabse haaliya addition hamesha pehla hataaya gaya hai, jo bilkul last-in-first-out ka matlab hai. Agar removal operation iske bajaye VIRUDH ant par kaam karta hai jahan additions hoti hain, ye jo bhi item us doosre ant par sabse lambe samay se baitha hai use hataata hai, kyunki wo ant kisi bhi zyaada haaliya additions se bilkul nahi chhua gaya — ye iske bajaye first-in-first-out (FIFO) vyavahaar banaata hai, wo ordering jo ek queue pradaan karta hai, ek stack nahi. \`shift()\` (jo front se hataata hai) ko \`push()\` (jo ant mein jodta hai) ke saath istemal karna ek stack ke maane gaye add operation ko ek queue ke maane gaye remove operation se milaata hai, na ek sahi stack banaata hai na ek sahi queue, balki ek structure jiska asli removal order sulajhaayi jaa rahi problem ke saapeksh kuch bhi maayne-yogya se mel nahi khaata — is lesson ke shuru waale undo example mein, ye bilkul pehli kabhi ki gayi action ko hataane se mel khaata hai, jo lagbhag kabhi bhi wo nahi hai jiska "undo" hona chahiye.',
      },
      {
        q: 'Why does this course treat the function call stack as a genuine instance of the same stack data structure, rather than as a separate, unrelated language runtime detail?',
        qHi: 'Ye course function call stack ko usi stack data structure ka ek asli instance ki tarah kyun treat karta hai, ek alag, na-judi language runtime detail ki tarah nahi?',
        a: 'A stack is defined by its abstract behavior — items are added and removed from the same single end, in strict last-in-first-out order — rather than by any specific concrete use case like an undo feature or a stack of plates. The mechanism a language runtime uses to track function calls satisfies this exact same abstract behavior precisely: when a function calls another function, information about that call (commonly called a stack frame, holding things like the function\'s local variables and where execution should resume once it returns) is added specifically at the "top" of the call stack, and when a function finishes executing and returns, it is specifically the topmost frame, corresponding to the most recently called and not-yet-completed function, that is removed. This course\'s own earlier lesson on analyzing recursive complexity relied on exactly this behavior without naming it explicitly: a chain of recursive calls builds up frames on the call stack in the order the calls are made, and those frames are removed in the exact reverse order, with the most recently added (most deeply nested) call always being the first to finish and be removed. Because this mechanism genuinely exhibits the identical last-in-first-out behavior that defines a stack as an abstract data type, describing it as an actual instance of a stack is not a loose metaphor or a simplified analogy — it is a factually accurate description of how the mechanism actually operates, which is precisely why recognizing the connection is useful: understanding how a stack behaves in the simple, concrete undo example this lesson opened with transfers directly to understanding how and why recursive function calls consume memory in the exact pattern this course\'s earlier lesson on recursion complexity described.',
        aHi: 'Ek stack apne abstract vyavahaar se define hota hai — items usi akele ant se jode aur hataaye jaate hain, sakht last-in-first-out order mein — kisi bhi khaas thos use case se nahi jaisa ek undo feature ya plates ka ek stack. Ek language runtime jis mechanism ka istemal function calls track karne ke liye karta hai bilkul isi abstract vyavahaar ko poora karta hai: jab ek function doosre function ko bulaata hai, us call ke baare mein jaankaari (aksar ek stack frame kaha jaata hai, cheezein jaisa function ke local variables aur execution kahaan resume hona chahiye ek baar ye return kare rakhte hue) khaas taur par call stack ke "top" par jodi jaati hai, aur jab ek function chalna khatam karta hai aur return karta hai, ye khaas taur par sabse oopar wala frame hai, sabse haaliya bulaaye gaye aur abhi-tak-poore-na-hue function se mel khaata, jo hataaya jaata hai. Is course ka apna pehle wala recursive complexity ka vishleshan karne wala lesson bilkul isi vyavahaar par nirbhar kiya bina ise explicitly naam diye: recursive calls ki ek chain call stack par frames banaati hai jis order mein calls ki jaati hain, aur wo frames bilkul ulte order mein hataayi jaati hain, sabse haaliya jode gaye (sabse gehre nested) call ke hamesha pehle khatam hone aur hataaye jaane ke saath. Kyunki ye mechanism sach mein identical last-in-first-out vyavahaar darsata hai jo ek stack ko ek abstract data type ki tarah define karta hai, ise ek stack ke asli instance ki tarah describe karna ek dheela metaphor ya ek simplified analogy nahi hai — ye is baat ka ek tathyaatmak roop se sahi varnan hai ki mechanism asal mein kaise operate karta hai, jo bilkul isliye hai ki connection pehchaanna upyogi hai: ye samajhna ki ek stack is lesson ke shuru waale saadhe, thos undo example mein kaise vyavahaar karta hai seedhe is samajhne mein transfer hota hai ki recursive function calls kaise aur kyun bilkul us pattern mein memory kharch karti hain jise is course ka pehle wala recursion complexity ka lesson darsata hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken shift()-based undo and the fixed pop()-based version from this lesson. Record three actions in each and confirm the fixed version correctly undoes them in reverse order, while the broken version does not.',
        taskHi: 'Is lesson ka toota \`shift()\`-based undo aur theek \`pop()\`-based version dono banao. Har ek mein teen actions record karo aur confirm karo ki theek version unhe sahi tarike se ulte order mein undo karta hai, jabki toota version nahi karta.',
        hint: 'Record three genuinely distinct, easily recognizable actions (like "action A", "action B", "action C") so you can immediately tell which one each version actually undoes.',
        hintHi: 'Teen sach mein alag, aasaani se pehchaanne-yogya actions record karo (jaisa "action A", "action B", "action C") taaki tum turant bata sako har version asal mein kaunsi undo karta hai.',
      },
      {
        task: 'Build the Stack class from this lesson with all four operations. Call peek() twice in a row and confirm the item is not removed, then call pop() once and confirm it is.',
        taskHi: 'Is lesson ka \`Stack\` class banaao sab chaar operations ke saath. \`peek()\` ko ek row mein do baar bulaao aur confirm karo ki item hataaya nahi jaata, phir \`pop()\` ko ek baar bulaao aur confirm karo ki ye hataaya jaata hai.',
        hint: 'Log the stack\'s current contents (or its length) after each call to directly observe whether anything was actually removed.',
        hintHi: 'Har call ke baad stack ki current contents (ya iski length) log karo seedhe dekhne ke liye ki kya kuch asal mein hataaya gaya.',
      },
      {
        task: 'Build both the array-backed and linked-list-backed Stack implementations from this lesson\'s content section. Confirm both produce identical push/pop/peek results for the same sequence of operations.',
        taskHi: 'Is lesson ke content section se array-backed aur linked-list-backed \`Stack\` implementations dono banao. Confirm karo ki dono usi sequence ke operations ke liye identical push/pop/peek nateeje banaate hain.',
        hint: 'Run the exact same sequence of push and pop calls against both implementations and compare their outputs at each step.',
        hintHi: 'Bilkul wahi push aur pop calls ki sequence dono implementations ke khilaaf chalaao aur har step par unke outputs compare karo.',
      },
    ],

    keyTakeaways: [
      'A stack is a deliberately restricted interface with four operations — push, pop, peek, isEmpty — where nothing other than the current top item is ever directly accessible.',
      'push and pop must both operate on the same end of the underlying structure to produce genuine last-in-first-out (LIFO) behavior — using opposite ends produces neither a correct stack nor a correct queue.',
      'peek and pop are deliberately separate operations — using pop to merely check the top item, then pushing it back, is fragile compared to peek, which looks without removing.',
      'A stack can be backed by a plain array (using push/pop, which operate on the array\'s end without shifting) or a linked list (using head insertion/removal), both genuinely O(1).',
      'A programming language\'s own function call stack is a genuine instance of this same stack data structure, not a separate or unrelated runtime detail — recursive calls are pushed and popped in strict LIFO order.',
      'isEmpty() must be checked before pop() or peek() on a stack that might have nothing in it, to avoid silently receiving undefined and using it as if it were a real value.',
    ],
    keyTakeawaysHi: [
      'Ek stack jaan-boojhkar ek restricted interface hai chaar operations ke saath — \`push\`, \`pop\`, \`peek\`, \`isEmpty\` — jahan current top item ke alaawa kuch bhi kabhi seedhe accessible nahi hota.',
      '\`push\` aur \`pop\` dono ko underlying structure ke samaan ant par operate karna chahiye asli last-in-first-out (LIFO) vyavahaar banaane ke liye — virudh ends istemal karna na ek sahi stack banaata hai na ek sahi queue.',
      '\`peek\` aur \`pop\` jaan-boojhkar alag operations hain — sirf top item check karne ke liye \`pop\` istemal karna, phir ise wapas push karna, \`peek\` ke saapeksh fragile hai, jo bina hataaye dekhta hai.',
      'Ek stack ko ek saadhe array se backed kiya jaa sakta hai (\`push\`/\`pop\` istemal karte hue, jo array ke ant par bina shift kiye operate karte hain) ya ek linked list (head insertion/removal istemal karte hue), dono sach mein \`O(1)\`.',
      'Ek programming language ka apna function call stack isi stack data structure ka ek asli instance hai, ek alag ya na-judi runtime detail nahi — recursive calls sakht LIFO order mein push aur pop kiye jaate hain.',
      '\`isEmpty()\` ko \`pop()\` ya \`peek()\` se pehle check kiya jaana chahiye ek stack par jismein kuch bhi na ho, chupchaap \`undefined\` milne aur ise ek asli value ki tarah istemal karne se bachne ke liye.',
    ],
  },
];
