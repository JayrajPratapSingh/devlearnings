/**
 * DSA Complete Course — Module 5: Stacks & Queues, lesson 4 (final
 * lesson of Module 5).
 *
 * Implementing a queue using two stacks, plus a brief closing note on
 * deques (double-ended queues) as a generalization of everything this
 * module has covered. Broken example: a "queue" built from a single
 * stack that achieves correct FIFO order only by reversing the entire
 * stack's contents on every single dequeue — genuinely correct, but
 * paying a full O(n) cost per dequeue that defeats the point of having
 * a dedicated structure at all. Fixed with two stacks (an "in" stack for
 * enqueuing, an "out" stack for dequeuing): items are only ever
 * transferred from "in" to "out" (reversing their order exactly once)
 * when "out" is empty, giving each individual item exactly one push
 * onto "in", one transfer-pop-and-push, and one final pop — a bounded,
 * fixed amount of total work per item, giving amortized O(1) per
 * operation, using the same amortized reasoning this course's Module 3
 * lesson on hash table resizing already established.
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

export const DSA_MODULE_5_PART4: CourseLesson[] = [
  {
    slug: 'implementing-queue-with-two-stacks',
    title: 'Implementing a Queue with Two Stacks, and Deques',
    titleHi: 'Do Stacks Se Ek Queue Lagu Karna, Aur Deques',
    description: 'Forced to build a queue using only a stack\'s own push/pop operations, a natural first attempt reverses the entire stack\'s contents on every single dequeue to fix the ordering — genuinely correct FIFO behavior, but paying a full O(n) cost on every removal, exactly the shifting problem this module\'s own queue lesson already solved, reintroduced through a different mechanism.',
    descriptionHi: 'Sirf ek stack ke apne push/pop operations istemal karke ek queue banaane par majboor, ek natural pehli koshish poore stack ki contents ko har akeli dequeue par reverse karti hai ordering theek karne ke liye — sach mein sahi FIFO vyavahaar, par har removal par ek poori \`O(n)\` keemat chukaate hue, bilkul wahi shifting samasya jise is module ke apne queue lesson ne pehle hi sulajhaaya, ek alag mechanism ke zariye dobara introduce ki gayi.',
    difficulty: 'HARD',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Two trays for incoming mail at a small office — one tray where every new letter is simply dropped on top as it arrives, and a second, empty tray reserved specifically for processing — versus, every single time a letter needs to be processed, taking the entire "incoming" tray, flipping every letter over one at a time to reverse their order, reading the one that is now on top, and putting the rest back.** The flip-everything-every-time approach genuinely produces letters processed in the correct arrival order, but it means processing even a single letter requires physically handling every other letter currently in the tray, every single time, regardless of how many letters are actually waiting. The two-tray approach works completely differently: new letters simply drop onto the "incoming" tray as they arrive, untouched. Only when the "processing" tray is completely empty does an assistant take the entire "incoming" tray and flip it, letter by letter, into the "processing" tray in one batch — this single flip reverses their order exactly once, which is precisely enough to make the oldest letter end up on top of the "processing" tray, ready to be taken directly, with no further flipping needed until that entire batch is exhausted. A "queue" built from one stack, reversing its entire contents on every single dequeue, is the flip-everything-every-time approach: correct, but paying the full reversal cost repeatedly. Two stacks, one for incoming pushes and one for outgoing pops, transferring between them only when the "out" stack runs empty, is the two-tray approach: each individual item is flipped at most once across its entire lifetime in the queue, no matter how many times the queue is used overall.',
      hi: '**Ek chhote office mein aane waali mail ke liye do trays — ek tray jahan har naya letter aane par bas top par daala jaata hai, aur ek doosri, khaali tray khaas taur par processing ke liye rakhi gayi — versus, har akeli baar jab ek letter process karna hai, poori "incoming" tray lekar, har letter ko ek waqt mein palatna unki order reverse karne ke liye, jo ab top par hai use padhna, aur baaki ko wapas rakhna.** Har-baar-sab-palто approach sach mein letters ko sahi arrival order mein process karti hai, par iska matlab hai ek akele letter ko process karna bhi tray mein abhi maujood har doosre letter ko physically handle karna maangta hai, har akeli baar, is baat se azaad ki asal mein kitne letters wait kar rahe hain. Do-tray approach poori tarah alag kaam karti hai: naye letters bas "incoming" tray par girte hain jaise wo aate hain, bina-chhue. Sirf jab "processing" tray poori tarah khaali hai ek assistant poori "incoming" tray leta hai aur ise palatta hai, letter-dar-letter, "processing" tray mein ek batch mein — ye akela palatna unki order bilkul ek baar reverse karta hai, jo bilkul kaafi hai purane letter ko "processing" tray ke top par khatam karne ke liye, seedhe liye jaane ke liye taiyaar, koi aur palatne ki zaroorat na hote hue jab tak wo poora batch khatam na ho jaaye. Ek stack se banaayi gayi ek "queue", har akeli dequeue par iski poori contents reverse karte hue, har-baar-sab-palto approach hai: sahi, par poori reversal keemat baar-baar chukaate hue. Do stacks, ek aane waale pushes ke liye aur ek jaane waale pops ke liye, unke beech sirf tab transfer karte hue jab "out" stack khaali ho jaaye, do-tray approach hai: har akela item apni poori zindagi mein queue mein zyaada se zyaada ek baar palтa jaata hai, chahe queue overall kitni bhi baar istemal ki jaaye.',
    },

    simple: `**Start broken.** A "queue" built from one stack, reversing everything on every dequeue:

\`\`\`js
class SlowQueueFromOneStack {
  constructor() { this.stack = []; }
  enqueue(value) { this.stack.push(value); }
  dequeue() {
    this.stack.reverse();          // flip the ENTIRE stack — O(n)
    const value = this.stack.pop(); // now the oldest item is on top
    this.stack.reverse();          // flip it back — another O(n)
    return value;
  }
}
\`\`\`

This genuinely produces correct FIFO order — reversing the stack does temporarily put the oldest item on top, where a single \`pop()\` can retrieve it correctly. The cost is that \`.reverse()\` itself is \`O(n)\`, and this implementation calls it TWICE on every single \`dequeue\` — once to expose the oldest item, once to restore the original order for the next operation. This defeats the entire point of using two \`O(1)\` stack operations to build a queue: the resulting queue\'s \`dequeue\` is genuinely \`O(n)\`, no better than the array-based queue this module\'s previous lesson already showed was too slow.

**The fix: two stacks, transferring only when necessary**

\`\`\`js
class QueueFromTwoStacks {
  constructor() {
    this.inStack = [];  // enqueue pushes here
    this.outStack = []; // dequeue pops from here
  }
  enqueue(value) {
    this.inStack.push(value); // O(1), always
  }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()); // transfer, reversing order once
      }
    }
    return this.outStack.pop(); // O(1) whenever outStack already has items
  }
}
\`\`\`

\`\`\`ts
class QueueFromTwoStacks<T> {
  private inStack: T[] = [];
  private outStack: T[] = [];

  enqueue(value: T): void {
    this.inStack.push(value);
  }
  dequeue(): T | undefined {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop() as T);
      }
    }
    return this.outStack.pop();
  }
}
\`\`\`

\`enqueue\` always just pushes onto \`inStack\` — genuinely \`O(1)\`, every time, with no reversal at all. \`dequeue\` checks \`outStack\` first: if it already has items, popping from it is immediately \`O(1)\`, correctly returning the oldest remaining item. Only when \`outStack\` is completely empty does the transfer happen — every item currently in \`inStack\` is popped and pushed onto \`outStack\`, which, because both operations are themselves LIFO, reverses their order exactly once, correctly restoring the original FIFO arrival order. This transfer is genuinely \`O(n)\`, but it happens only occasionally, and each individual item is only ever transferred once across its entire time in the queue.`,

    simpleHi: `**Toote hue se shuru.** Ek stack se banaayi gayi ek "queue", har dequeue par sab kuch reverse karte hue:

\`\`\`js
class SlowQueueFromOneStack {
  constructor() { this.stack = []; }
  enqueue(value) { this.stack.push(value); }
  dequeue() {
    this.stack.reverse();          // POORI stack palто — O(n)
    const value = this.stack.pop(); // ab purana item top par hai
    this.stack.reverse();          // ise wapas palто — ek aur O(n)
    return value;
  }
}
\`\`\`

Ye sach mein sahi FIFO order banaata hai — stack ko reverse karna asthaayi roop se purane item ko top par rakhta hai, jahan ek akela \`pop()\` ise sahi tarike se retrieve kar sakta hai. Keemat ye hai ki \`.reverse()\` khud \`O(n)\` hai, aur ye implementation ise har akeli \`dequeue\` par DO BAAR bulaata hai — ek baar purane item ko expose karne ke liye, ek baar agli operation ke liye asli order restore karne ke liye. Ye do \`O(1)\` stack operations istemal karke ek queue banaane ke poore point ko haraata hai: nateeje wali queue ka \`dequeue\` sach mein \`O(n)\` hai, us array-based queue se behtar nahi jise is module ke pehle wale lesson ne pehle hi bahut dheema dikhaaya.

**Fix: do stacks, sirf zaroorat padne par transfer karte hue**

\`\`\`js
class QueueFromTwoStacks {
  constructor() {
    this.inStack = [];  // enqueue yahaan push karta hai
    this.outStack = []; // dequeue yahaan se pop karta hai
  }
  enqueue(value) {
    this.inStack.push(value); // O(1), hamesha
  }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop()); // transfer, order ek baar reverse karte hue
      }
    }
    return this.outStack.pop(); // O(1) jab bhi outStack ke paas pehle se items hain
  }
}
\`\`\`

\`\`\`ts
class QueueFromTwoStacks<T> {
  private inStack: T[] = [];
  private outStack: T[] = [];

  enqueue(value: T): void {
    this.inStack.push(value);
  }
  dequeue(): T | undefined {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop() as T);
      }
    }
    return this.outStack.pop();
  }
}
\`\`\`

\`enqueue\` hamesha bas \`inStack\` par push karta hai — sach mein \`O(1)\`, har baar, koi reversal bilkul na hote hue. \`dequeue\` pehle \`outStack\` check karta hai: agar iske paas pehle se items hain, isse pop karna turant \`O(1)\` hai, sahi tarike se bachi hui sabse purani item return karte hue. Sirf jab \`outStack\` poori tarah khaali hai transfer hota hai — abhi \`inStack\` mein maujood har item pop aur \`outStack\` par push kiya jaata hai, jo, kyunki dono operations khud LIFO hain, unki order ko bilkul ek baar reverse karta hai, sahi tarike se asli FIFO arrival order restore karte hue. Ye transfer sach mein \`O(n)\` hai, par ye sirf kabhi-kabhi hota hai, aur har akela item apni poori queue mein rehne ki umr mein sirf ek baar transfer hota hai.`,

    content: `## Why this achieves amortized O(1), using the same reasoning as hash table resizing

\`\`\`
Each individual item, across its entire lifetime in the queue, is:
  pushed onto inStack:  once   (during its own enqueue)
  popped from inStack and pushed onto outStack: at most once (during a transfer)
  popped from outStack: once   (during its own dequeue)

Total operations per item: a small, FIXED number (at most 3), regardless
of how many other items are enqueued or dequeued around it
\`\`\`

This is the exact same amortized-cost reasoning this course\'s Module 3 lesson on hash table resizing established: a single specific \`dequeue\` call CAN be genuinely expensive (whenever it happens to trigger a transfer, it costs \`O(n)\` for however many items are currently in \`inStack\`), but summing the total work done across every operation on every item, over the queue\'s entire lifetime, shows that each item is only ever pushed and popped a small, bounded number of times in total. Spreading this bounded total cost evenly across all operations gives a genuine \`O(1)\` AMORTIZED average, even though certain individual calls are visibly more expensive than others.

## Deques: generalizing everything this module has covered

\`\`\`
Stack:  add/remove from ONE end only            (LIFO)
Queue:  add at one end, remove from the other    (FIFO)
Deque:  add/remove from EITHER end, freely        (both, and more)
\`\`\`

A deque (double-ended queue) generalizes both structures this module has covered: it supports adding and removing from BOTH ends, giving it the flexibility to behave as a stack (always using the same end), a queue (always adding at one end and removing from the other), or patterns neither a pure stack nor a pure queue supports on its own, such as adding to the front while also removing from the back. A deque is naturally implemented with a doubly linked list (this course\'s Module 4 lesson introduced tracking both directions via \`next\` and \`prev\` pointers), since genuine \`O(1)\` operations at BOTH ends require exactly the bidirectional traversal a doubly linked list, but not a singly linked list, provides.

## Recognizing when each of this module\'s structures is the right tool

\`\`\`
Need LIFO only                     → Stack
Need FIFO only                     → Queue
Need to add/remove from both ends  → Deque
Need FIFO built from only stack-
  like primitives available        → Two-stack queue (this lesson)
\`\`\`

This module opened with a genuine correctness bug (undo using the wrong end of an array) and closes with a genuine construction technique (building one structure\'s behavior out of a different structure\'s primitives). Both are instances of the same recurring theme this course has built since its very first lesson: correctly identifying which specific access pattern a problem actually needs — LIFO, FIFO, or both-ended access — is what determines which of these closely related structures is the right one to reach for, and, when the "right" structure is not directly available, how to build its correct behavior out of what is.`,

    contentHi: `## Ye amortized O(1) kaise haasil karta hai, hash table resizing jaisa hi tark istemal karte hue

\`\`\`
Har akela item, queue mein apni poori zindagi mein, hai:
  inStack par push kiya gaya:  ek baar   (apne khud ke enqueue ke dauraan)
  inStack se pop aur outStack par push kiya gaya: zyaada se zyaada ek baar (ek transfer ke dauraan)
  outStack se pop kiya gaya: ek baar   (apne khud ke dequeue ke dauraan)

Prati-item total operations: ek chhoti, FIXED tadaad (zyaada se zyaada 3),
is baat se azaad ki iske aas-paas kitne aur items enqueue ya dequeue kiye jaate hain
\`\`\`

Ye bilkul wahi amortized-cost tark hai jise is course ke Module 3 ke hash table resizing lesson ne sthaapit kiya: ek akeli khaas \`dequeue\` call sach mein mehengi HO SAKTI hai (jab bhi ye samyog se ek transfer trigger karti hai, ye \`O(n)\` kharch karti hai jitne bhi items abhi \`inStack\` mein hain unke liye), par har item par har operation mein kiya gaya total kaam jodna, queue ki poori zindagi mein, darsata hai ki har item kabhi bhi sirf ek chhoti, bounded tadaad mein push aur pop hota hai total mein. Is bounded total keemat ko sab operations ke aar-paar samaan roop se failaana ek asli \`O(1)\` AMORTIZED average deta hai, chahe kuch khaas akeli calls doosri se drishya roop se mehengi hon.

## Deques: is module ne jo cover kiya hai use generalize karna

\`\`\`
Stack:  sirf EK ant se jodo/hataao            (LIFO)
Queue:  ek ant par jodo, doosre se hataao    (FIFO)
Deque:  KISI BHI ant se jodo/hataao, azaadi se  (dono, aur zyaada)
\`\`\`

Ek deque (double-ended queue) dono structures ko generalize karta hai jo is module ne cover kiye hain: ye DONO ends se jodne aur hataane ko support karta hai, ise ek stack ki tarah vyavahaar karne ki flexibility deta hue (hamesha samaan ant istemal karte hue), ek queue (hamesha ek ant par jodte hue aur doosre se hataate hue), ya patterns jinhe na koi saadha stack aur na koi saadhi queue apne aap support karta hai, jaisa front mein jodna jabki back se bhi hataana. Ek deque naturally ek doubly linked list se lagu ki jaati hai (is course ke Module 4 lesson ne dono directions ko \`next\` aur \`prev\` pointers ke zariye track karna introduce kiya), kyunki DONO ends par asli \`O(1)\` operations ko bilkul us bidirectional traversal ki zaroorat hai jo ek doubly linked list, ek singly linked list nahi, pradaan karti hai.

## Pehchaanna ki is module ka kaunsa structure sahi tool hai

\`\`\`
Sirf LIFO chahiye                     → Stack
Sirf FIFO chahiye                     → Queue
Dono ends se jodna/hataana chahiye     → Deque
Sirf upalabdh stack-jaise primitives
  se banaayi FIFO chahiye              → Two-stack queue (ye lesson)
\`\`\`

Ye module ek asli sahihata bug (galat array ant istemal karta undo) se shuru hua aur ek asli construction technique (ek structure ka vyavahaar ek alag structure ke primitives se banaana) ke saath khatam hota hai. Dono is course ke usi dohraaye jaane waale theme ke instances hain jise ye course apne bilkul pehle lesson se banaata aaya hai: ye sahi tarike se pehchaanna ki ek problem ko asal mein kaunsa khaas access pattern chahiye — LIFO, FIFO, ya dono-ant access — wo hai jo tay karta hai in kareebi taur par judi structures mein se kaunsi pakadne laayak sahi hai, aur, jab "sahi" structure seedhe upalabdh nahi hai, iske sahi vyavahaar ko us se kaise banaaya jaaye jo maujood hai.`,

    examples: [
      {
        title: 'Broken: a single-stack queue reversing everything on every dequeue',
        titleHi: 'Toota: ek single-stack queue jo har dequeue par sab kuch reverse karta hai',
        code: `dequeue() {
  this.stack.reverse();
  const value = this.stack.pop();
  this.stack.reverse();
  return value;
}`,
        codeJs: `class SlowQueueFromOneStack {
  constructor() { this.stack = []; }
  enqueue(value) { this.stack.push(value); }
  dequeue() {
    this.stack.reverse();
    const value = this.stack.pop();
    this.stack.reverse();
    return value;
  }
}
// correct FIFO order, but O(n) per dequeue`,
        codeTs: `class SlowQueueFromOneStack<T> {
  private stack: T[] = [];
  enqueue(value: T): void { this.stack.push(value); }
  dequeue(): T | undefined {
    this.stack.reverse();
    const value = this.stack.pop();
    this.stack.reverse();
    return value;
  }
}
// fully valid TypeScript — the O(n) cost is architectural`,
        output: `Correctly dequeues items in FIFO order, but each dequeue reverses
the entire stack twice, an O(n) cost every single time.`,
        explain: 'Reversing the entire stack does produce correct ordering, but the double reversal is paid in full on every dequeue, regardless of how many items are queued.',
        explainHi: 'Poori stack ko reverse karna sahi ordering banaata hai, par double reversal har dequeue par poori tarah chukaayi jaati hai, is baat se azaad ki kitne items queue mein hain.',
      },
      {
        title: 'Fixed: two stacks, transferring only when the out stack is empty',
        titleHi: 'Theek: do stacks, sirf jab out stack khaali ho tab transfer karte hue',
        code: `if (this.outStack.length === 0) {
  while (this.inStack.length > 0) this.outStack.push(this.inStack.pop());
}
return this.outStack.pop();`,
        codeJs: `class QueueFromTwoStacks {
  constructor() { this.inStack = []; this.outStack = []; }
  enqueue(value) { this.inStack.push(value); }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack.pop();
  }
}`,
        codeTs: `class QueueFromTwoStacks<T> {
  private inStack: T[] = [];
  private outStack: T[] = [];
  enqueue(value: T): void { this.inStack.push(value); }
  dequeue(): T | undefined {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop() as T);
      }
    }
    return this.outStack.pop();
  }
}`,
        outputJs: `Correctly dequeues in FIFO order, with each item transferred
between the two stacks at most once across its entire time in the
queue — amortized O(1) per operation.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Transferring happens only when outStack is empty, and each item is only ever transferred once, giving a bounded total cost per item rather than a repeated one.',
        explainHi: 'Transfer sirf tab hota hai jab \`outStack\` khaali hai, aur har item sirf kabhi ek baar transfer hota hai, prati-item ek bounded total keemat dete hue ek dohraayi hui ke bajaye.',
      },
      {
        title: 'Confirming amortized cost: counting total pushes/pops per item',
        titleHi: 'Amortized keemat confirm karna: prati-item total pushes/pops ganna',
        code: `// enqueue A, B, C, then dequeue all three
// each item: 1 push to inStack, 1 transfer, 1 pop from outStack — 3 total`,
        codeJs: `const queue = new QueueFromTwoStacks();
queue.enqueue("A"); queue.enqueue("B"); queue.enqueue("C");
console.log(queue.dequeue()); // "A" — triggers one transfer of all 3 items
console.log(queue.dequeue()); // "B" — outStack already has items, O(1)
console.log(queue.dequeue()); // "C" — outStack already has items, O(1)`,
        codeTs: `const queue = new QueueFromTwoStacks<string>();
queue.enqueue("A"); queue.enqueue("B"); queue.enqueue("C");
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());`,
        outputJs: `"A", "B", "C" — correct FIFO order. The first dequeue call is the
expensive one (one transfer of 3 items); the next two are O(1) each,
since outStack already has items ready.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Only the first dequeue in this sequence triggers a transfer; the cost of that transfer is paid once and amortized across the entire batch of dequeues that follow.',
        explainHi: 'Is sequence mein sirf pehli \`dequeue\` ek transfer trigger karti hai; us transfer ki keemat ek baar chukaayi jaati hai aur baad ki poori dequeues ke batch ke aar-paar amortized hoti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `dequeue() {
  this.stack.reverse(); // O(n) on EVERY dequeue
  const value = this.stack.pop();
  this.stack.reverse(); // another O(n) on EVERY dequeue
  return value;
}`,
        right: `dequeue() {
  if (this.outStack.length === 0) { /* transfer, O(n) only occasionally */ }
  return this.outStack.pop(); // O(1) most of the time
}`,
        why: 'Reversing the entire stack on every single dequeue pays the O(n) reversal cost repeatedly, defeating the point of building a queue from O(1) stack primitives at all.',
        whyHi: 'Har akeli dequeue par poori stack reverse karna \`O(n)\` reversal keemat baar-baar chukaata hai, \`O(1)\` stack primitives se ek queue banaane ke poore point ko bilkul haraate hue.',
      },
      {
        wrong: `dequeue() {
  while (this.inStack.length > 0) this.outStack.push(this.inStack.pop());
  // transferring EVERY time, even when outStack already has items
  return this.outStack.pop();
}`,
        right: `dequeue() {
  if (this.outStack.length === 0) { // only transfer when necessary
    while (this.inStack.length > 0) this.outStack.push(this.inStack.pop());
  }
  return this.outStack.pop();
}`,
        why: 'Transferring on every dequeue, rather than only when outStack is empty, can incorrectly reverse the order of items that were already correctly ordered in outStack.',
        whyHi: 'Har dequeue par transfer karna, sirf jab \`outStack\` khaali ho tab ke bajaye, un items ki order ko galti se reverse kar sakta hai jo pehle se \`outStack\` mein sahi tarike se ordered thi.',
      },
      {
        wrong: `// implementing a deque using a singly linked list, expecting O(1)
// operations at both ends`,
        right: `// implementing a deque using a doubly linked list, since O(1)
// operations at the "back" end genuinely require a prev pointer`,
        why: 'A singly linked list only supports O(1) operations at its head — a deque needing O(1) at both ends genuinely requires the bidirectional traversal a doubly linked list provides.',
        whyHi: 'Ek singly linked list sirf apne head par \`O(1)\` operations support karti hai — ek deque jise dono ends par \`O(1)\` chahiye sach mein us bidirectional traversal ki maang karta hai jo ek doubly linked list pradaan karti hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Implement Queue using Stacks" is one of the single most commonly asked foundational technical interview questions**, specifically because it tests whether a candidate can build one structure\'s correct behavior from a different structure\'s primitives.',
        hi: '**"Implement Queue using Stacks" sabse aam poochhe jaane waale foundational technical interview sawaalon mein se ek hai**, khaas taur par kyunki ye test karta hai ki kya ek candidate ek structure ka sahi vyavahaar ek alag structure ke primitives se bana sakta hai.',
      },
      {
        en: '**JavaScript\'s own Array is frequently used to back a deque directly (push/pop at the end, unshift/shift at the front)**, though this course\'s Module 4 lesson already established the O(n) cost of unshift/shift specifically.',
        hi: '**JavaScript ka apna \`Array\` aksar seedhe ek deque ko backing dene ke liye istemal hota hai (\`push\`/\`pop\` ant par, \`unshift\`/\`shift\` front par)**, chahe is course ke Module 4 lesson ne pehle hi khaas taur par \`unshift\`/\`shift\` ki \`O(n)\` keemat sthaapit ki.',
      },
      {
        en: '**Amortized analysis, applied here to the two-stack queue, is the exact same concept this course\'s Module 3 lesson on hash table resizing already covered** — a genuinely transferable analytical tool, not a one-off trick specific to hash tables.',
        hi: '**Amortized vishleshan, yahaan two-stack queue par lagu kiya gaya, bilkul wahi concept hai jise is course ke Module 3 ke hash table resizing lesson ne pehle hi cover kiya** — ek sach mein transferable analytical tool, hash tables ke liye khaas ek ek-baar-ka trick nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is the two-stack queue\'s dequeue operation described as amortized O(1) rather than simply O(1), and why is this the same underlying reasoning used elsewhere in this course?',
        qHi: 'Two-stack queue ka \`dequeue\` operation amortized \`O(1)\` kyun describe kiya jaata hai simply \`O(1)\` ke bajaye, aur ye is course mein kahin aur istemal ki gayi underlying tark kaise wahi hai?',
        a: 'A single, specific call to dequeue can genuinely be expensive: whenever it happens to be called at a moment when outStack is completely empty, it must first perform the full transfer of every item currently in inStack, an operation whose cost is directly proportional to however many items are being transferred at that moment. This means it would be inaccurate to describe every individual dequeue call as costing a small constant amount of time, since some specific calls genuinely cost more depending on how many items need to be transferred. What justifies describing the operation as O(1) on AMORTIZED average is examining the total work done across every operation performed on a given item throughout its entire time in the queue, rather than focusing on any single operation in isolation: each item is pushed onto inStack exactly once during its own enqueue call, is popped off inStack and pushed onto outStack at most once, during whichever single transfer eventually moves it (if any transfer happens to it at all), and is popped off outStack exactly once during its own eventual dequeue call. Summed together, this gives a small, fixed, bounded total amount of work performed per item — at most three individual push or pop operations — regardless of how many other items are enqueued or dequeued around it, or how many times the queue is used overall. This is precisely the same analytical technique this course\'s Module 3 lesson on hash table resizing already established: an occasional, individually expensive operation (there, a full resize; here, a full transfer) is paid for by spreading its cost across a sequence of surrounding operations, each of which individually contributed a small, bounded piece toward eventually paying for that expensive moment, producing a genuine constant AVERAGE cost per operation even though no single operation in isolation can be guaranteed to cost that little.',
        aHi: 'Ek akeli, khaas call \`dequeue\` ko sach mein mehengi ho sakti hai: jab bhi ye us pal bulaayi jaati hai jab \`outStack\` poori tarah khaali hai, ise pehle \`inStack\` mein abhi maujood har item ka poora transfer perform karna chahiye, ek operation jiski keemat seedhe is baat ke anupaat mein hai ki us pal kitne items transfer kiye jaa rahe hain. Iska matlab hai har akeli \`dequeue\` call ko ek chhota constant samay kharch karte hue describe karna sateek nahi hoga, kyunki kuch khaas calls sach mein zyaada kharch karti hain is baat par nirbhar karte hue ki kitne items transfer hone chahiye. Kya operation ko AMORTIZED average mein \`O(1)\` describe karna justify karta hai wo hai ek diye gaye item par uski queue mein poori zindagi mein perform ki gayi har operation ke aar-paar kiya gaya total kaam examine karna, kisi akele operation par alag-thalag mein focus karne ke bajaye: har item apne khud ke \`enqueue\` call ke dauraan bilkul ek baar \`inStack\` par push hota hai, \`inStack\` se pop aur \`outStack\` par push hota hai zyaada se zyaada ek baar, jo bhi akeli transfer aakhirkaar ise move karti hai (agar koi transfer ise bilkul hoti hai), aur apne khud ke aakhirkaar \`dequeue\` call ke dauraan bilkul ek baar \`outStack\` se pop hota hai. Saath jodne par, ye prati-item perform kiye gaye kaam ki ek chhoti, fixed, bounded total tadaad deta hai — zyaada se zyaada teen akele push ya pop operations — is baat se azaad ki iske aas-paas kitne aur items enqueue ya dequeue kiye jaate hain, ya queue overall kitni baar istemal ki jaati hai. Ye bilkul wahi analytical technique hai jise is course ke Module 3 ke hash table resizing lesson ne pehle hi sthaapit kiya: ek kabhi-kabhi, vyaktigat roop se mehengi operation (wahaan, ek poora resize; yahaan, ek poora transfer) surrounding operations ki ek sequence ke aar-paar iski keemat failaakar chukaayi jaati hai, jinmein se har ek ne vyaktigat roop se ek chhota, bounded tukda yogdaan diya aakhirkaar us mehengi pal ke liye chukaane ke liye, ek asli constant AVERAGE keemat prati-operation banaate hue chahe koi bhi akela operation alag-thalag mein utna kam kharch karne ki guarantee na de sake.',
      },
      {
        q: 'Why is transferring items from inStack to outStack only when outStack is empty specifically what preserves correct FIFO order, and what would go wrong if the transfer happened on every dequeue call instead?',
        qHi: '\`inStack\` se \`outStack\` mein items transfer karna sirf tab jab \`outStack\` khaali hai khaas taur par sahi FIFO order preserve karna kyun hai, aur agar transfer har dequeue call par hota toh kya galat hota?',
        a: 'The transfer step, moving every item from inStack to outStack by repeatedly popping from one and pushing onto the other, reverses the order of whatever items are being moved exactly once, since both stacks individually operate in last-in-first-out order. This single reversal is precisely what corrects for the fact that items were originally pushed onto inStack in arrival order, meaning the LAST item enqueued sits on TOP of inStack — reversing this during the transfer correctly places the FIRST item ever enqueued on top of outStack instead, exactly where it needs to be for outStack\'s own pop operation to correctly return it next, preserving genuine first-in-first-out behavior. Restricting the transfer to only occur when outStack is completely empty is what keeps this reversal correct and prevents it from happening more often than necessary: if outStack still contains items from a previous transfer, those items are already sitting in the correct order relative to each other and relative to when they were originally enqueued, and triggering another transfer on top of them would incorrectly interleave a second batch of newly-reversed items with the first batch, disrupting the correct overall ordering between items that were enqueued at different times. Transferring on every single dequeue call, rather than only when outStack is empty, would specifically cause this kind of incorrect interleaving whenever a new item had been enqueued into inStack while outStack still held older, not-yet-dequeued items — the newly transferred item could end up positioned incorrectly relative to items that arrived earlier but happened to still be waiting in outStack, breaking the very ordering guarantee the entire two-stack construction exists to provide.',
        aHi: 'Transfer step, har item ko \`inStack\` se \`outStack\` mein le jaana ek se baar-baar pop aur doosre par push karke, jo bhi items move ki jaa rahi hain unki order ko bilkul ek baar reverse karta hai, kyunki dono stacks vyaktigat roop se last-in-first-out order mein operate karte hain. Ye akela reversal bilkul wo hai jo is tathya ko theek karta hai ki items asal mein arrival order mein \`inStack\` par push ki gayi thi, matlab AAKHRI enqueue ki gayi item \`inStack\` ke TOP par baithti hai — transfer ke dauraan ise reverse karna sahi tarike se BILKUL PEHLI kabhi enqueue ki gayi item ko iske bajaye \`outStack\` ke top par rakhta hai, bilkul jahan iske \`outStack\` ke apne \`pop\` operation ke liye chahiye agla sahi tarike se ise return karne ke liye, asli first-in-first-out vyavahaar preserve karte hue. Transfer ko sirf tab hone tak seemit karna jab \`outStack\` poori tarah khaali hai wo hai jo is reversal ko sahi rakhta hai aur ise zaroorat se zyaada baar hone se rokta hai: agar \`outStack\` mein abhi bhi ek pichli transfer se items hain, wo items pehle se ek doosre ke saapeksh aur asal mein kab enqueue ki gayi thi uske saapeksh sahi order mein baithi hain, aur unke oopar ek aur transfer trigger karna galti se naye-reverse-kiye-gaye items ke ek doosre batch ko pehle batch ke saath incorrectly interleave karega, alag samay par enqueue ki gayi items ke beech sahi overall ordering ko disrupt karte hue. Har akeli \`dequeue\` call par transfer karna, sirf jab \`outStack\` khaali ho tab ke bajaye, khaas taur par is tarah ki galat interleaving ka kaaran banega jab bhi ek naya item \`inStack\` mein enqueue kiya gaya ho jabki \`outStack\` mein abhi bhi purane, abhi-tak-na-dequeue-kiye items ho — naya transfer kiya gaya item un items ke saapeksh galat tarike se position ho sakta hai jo pehle aayi thi par samyog se abhi bhi \`outStack\` mein wait kar rahi thi, us ordering guarantee ko todte hue jise poora two-stack construction pradaan karne ke liye maujood hai.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (double-reverse) and fixed (two-stack) queue implementations from this lesson. Enqueue 5 items into each and confirm dequeuing all 5 produces identical FIFO order from both.',
        taskHi: 'Is lesson ka toota (double-reverse) aur theek (two-stack) queue implementations dono banao. Har ek mein 5 items enqueue karo aur confirm karo ki sab 5 ko dequeue karna dono se identical FIFO order banaata hai.',
        hint: 'Enqueue values that are easy to check order against, like the numbers 1 through 5, so any ordering mistake is immediately visible.',
        hintHi: 'Aise values enqueue karo jinki order ke khilaaf check karna aasaan hai, jaisa 1 se 5 tak numbers, taaki koi bhi ordering galti turant drishyaman ho.',
      },
      {
        task: 'Add logging to the fixed two-stack queue that prints whenever a transfer actually occurs. Enqueue 3 items, dequeue 1, enqueue 2 more, then dequeue the rest — observe exactly when transfers happen versus when outStack already has items ready.',
        taskHi: 'Theek two-stack queue mein logging jodo jo print karti hai jab bhi ek transfer asal mein hoti hai. 3 items enqueue karo, 1 dequeue karo, 2 aur enqueue karo, phir baaki dequeue karo — bilkul dekho ki transfers kab hote hain us se jab \`outStack\` ke paas pehle se items taiyaar hote hain.',
        hint: 'Pay close attention to what happens on the dequeue call immediately after the additional 2 items are enqueued while outStack may or may not already be empty.',
        hintHi: 'Us \`dequeue\` call par dhyaan do jo atirikt 2 items enqueue hone ke turant baad hoti hai jabki \`outStack\` shaayad pehle se khaali ho ya na ho.',
      },
      {
        task: 'Think of one real feature (from an app you use or have built) that would benefit from a deque\'s ability to add or remove from both ends. Write a sentence explaining specifically why a plain stack or queue alone would not be sufficient.',
        taskHi: 'Ek asli feature ke baare mein socho (ek app se jo tum istemal karte ho ya banaayi hai) jise ek deque ki dono ends se jodne ya hataane ki kshamta se faayda hoga. Ek vaakya likho ye samjhaate hue ki khaas taur par ek saadha stack ya queue akela kaafi kyun nahi hoga.',
        hint: 'Browser history with both back and forward navigation, or a text editor\'s undo/redo alongside cursor movement, are good starting points to consider.',
        hintHi: 'Back aur forward navigation dono ke saath browser history, ya cursor movement ke saath ek text editor ka undo/redo, vichaar karne ke liye achhe shuruaati bindu hain.',
      },
    ],

    keyTakeaways: [
      'A "queue" built from a single stack by reversing its entire contents on every dequeue is genuinely correct, but pays a full O(n) cost on every single operation.',
      'Two stacks (an "in" stack for enqueuing, an "out" stack for dequeuing) transfer items only when the "out" stack is completely empty, reversing their order exactly once per transfer.',
      'Each individual item is pushed and popped a small, fixed number of times across its entire lifetime in the queue, giving amortized O(1) per operation despite occasional expensive transfers.',
      'This amortized reasoning is the identical analytical technique this course\'s Module 3 lesson on hash table resizing already established, applied to a different structure.',
      'Transferring only when outStack is empty, rather than on every dequeue, is what prevents incorrectly interleaving a new batch of transferred items with an older batch still correctly ordered.',
      'A deque generalizes both a stack and a queue by supporting O(1) addition and removal at both ends, naturally implemented with a doubly linked list rather than a singly linked list.',
    ],
    keyTakeawaysHi: [
      'Ek "queue" jo ek akele stack se banaayi gayi hai iski poori contents ko har dequeue par reverse karke sach mein sahi hai, par har akeli operation par ek poori \`O(n)\` keemat chukaati hai.',
      'Do stacks (enqueuing ke liye ek "in" stack, dequeuing ke liye ek "out" stack) items ko sirf tab transfer karte hain jab "out" stack poori tarah khaali ho, prati-transfer unki order ko bilkul ek baar reverse karte hue.',
      'Har akela item queue mein apni poori zindagi mein ek chhoti, fixed tadaad mein push aur pop hota hai, kabhi-kabhi mehengi transfers ke bawajood prati-operation amortized \`O(1)\` dete hue.',
      'Ye amortized tark bilkul identical analytical technique hai jise is course ke Module 3 ke hash table resizing lesson ne pehle hi sthaapit kiya, ek alag structure par lagu kiya gaya.',
      'Sirf tab transfer karna jab \`outStack\` khaali ho, har dequeue par nahi, wo hai jo transferred items ke ek naye batch ko ek purane batch ke saath galti se interleave karne se rokta hai jo abhi bhi sahi tarike se ordered hai.',
      'Ek deque dono ek stack aur ek queue ko generalize karta hai dono ends par \`O(1)\` addition aur removal support karke, naturally ek doubly linked list se lagu ki gayi ek singly linked list ke bajaye.',
    ],
  },
];
