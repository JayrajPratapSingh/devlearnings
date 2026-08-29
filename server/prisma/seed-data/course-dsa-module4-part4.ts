/**
 * DSA Complete Course — Module 4: Linked Lists, lesson 4.
 *
 * Reversing a linked list, iteratively and recursively — a direct
 * linked-list analogue of the in-place-versus-new-copy theme this
 * course's Module 1 (array reversal) and Module 2 (palindrome checking)
 * both already established. Broken example: building an entirely new,
 * reversed list by allocating a fresh node for each value, in reverse
 * order — genuinely correct, but paying O(n) extra memory for a
 * rearrangement that does not actually require any new nodes at all.
 * Fixed with the three-pointer iterative technique (prev, current,
 * next) that rewires each node's own .next pointer to point backward
 * while walking through the list exactly once, using no extra memory
 * beyond the three pointer variables themselves. The lesson closes with
 * the equivalent recursive version, showing the same in-place rewiring
 * expressed through the call stack instead of an explicit loop.
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

export const DSA_MODULE_4_PART4: CourseLesson[] = [
  {
    slug: 'reversing-a-linked-list',
    title: 'Reversing a Linked List: Iterative and Recursive',
    titleHi: 'Ek Linked List Ko Reverse Karna: Iterative Aur Recursive',
    description: 'Reversing a linked list by walking through it and building an entirely new list, node by node, in reverse order — genuinely correct, but allocating a full second set of nodes for a rearrangement that, just like this course\'s earlier array-reversal lesson, never actually needed any new memory at all.',
    descriptionHi: 'Ek linked list ko reverse karna ise chalke aur ek bilkul nayi list banaake, node-dar-node, reverse order mein — sach mein sahi, par nodes ka ek poora doosra set allocate karte hue ek aise rearrangement ke liye jise, bilkul is course ke pehle wale array-reversal lesson ki tarah, asal mein kabhi kisi nayi memory ki zaroorat thi hi nahi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Reversing a chain of paper clips linked end to end by unclipping every single one and clipping together an entirely new, second chain in the opposite order — versus simply reaching into the middle of the SAME chain and flipping each clip\'s own connection to point backward instead of forward, one clip at a time, walking down the chain exactly once.** The build-a-new-chain approach genuinely produces a correctly reversed chain, but it requires an entirely separate set of clips to exist temporarily alongside the original while the new chain is being assembled — real, if temporary, extra material. The flip-each-connection approach never needs a second chain at all: the exact same clips that made up the original chain are still the ones present at the end, with nothing added and nothing thrown away — only the DIRECTION each clip points has changed, one at a time, as a hand walks down the chain a single time. Building an entirely new, reversed linked list by allocating a fresh node for every value is the build-a-new-chain approach: correct, but paying for a full second set of nodes. Rewiring each existing node\'s own next pointer to point backward while walking through the list once is the flip-each-connection approach: the exact same nodes end up reversed, with no new nodes ever created.',
      hi: '**Paper clips ki ek chain jo ek doosre se ant-se-ant judi hui hai use reverse karna har akeli clip ko unclip karke aur ulte order mein ek bilkul nayi, doosri chain clip karke — versus bas SAME chain ke beech mein pahunchna aur har clip ke apne connection ko aage ke bajaye peeche point karne ke liye flip karna, ek waqt mein ek clip, chain ke neeche bilkul ek baar chalte hue.** Naya-chain-banaao approach sach mein ek sahi tarike se reverse ki gayi chain banaata hai, par isse clips ka ek poora alag set asthaayi roop se asli ke saath maujood hone ki zaroorat hai jabki nayi chain assemble ki jaa rahi hai — asli, chahe asthaayi, atirikt saamagri. Har-connection-flip-karo approach ko bilkul kabhi doosri chain ki zaroorat nahi hoti: bilkul wahi clips jo asli chain banaate the abhi bhi wo hain jo ant mein maujood hain, kuch bhi jodi na gayi aur kuch bhi phenki na gayi — sirf har clip jo DISHA point karti hai badli hai, ek waqt mein ek, jaise ek haath chain ke neeche ek akeli baar chalta hai. Har value ke liye ek taaza node allocate karke ek bilkul nayi, reverse ki gayi linked list banaana naya-chain-banaao approach hai: sahi, par nodes ka ek poora doosra set chukaate hue. Har maujood node ke apne \`next\` pointer ko peeche point karne ke liye rewire karna list ko ek baar chalte hue har-connection-flip-karo approach hai: bilkul wahi nodes reverse hokar khatam hote hain, koi naye nodes kabhi banaaye bina.',
    },

    simple: `**Start broken.** Building an entirely new, reversed list, node by node:

\`\`\`js
function reverseList(head) {
  let newHead = null;
  let current = head;
  while (current !== null) {
    const newNode = { value: current.value, next: newHead }; // a BRAND-NEW node
    newHead = newNode;
    current = current.next;
  }
  return newHead;
}
\`\`\`

This genuinely produces a correctly reversed list — walking through the original list front to back while always inserting each value at the front of a growing new list does reverse the order. The cost, exactly like this course\'s Module 1 array-reversal lesson, is memory: for every single node in the original list, this approach allocates an entirely new node to hold in the reversed list, meaning the original list and the new one both exist in memory simultaneously, using roughly double the memory the data actually requires.

**The fix: rewire each existing node\'s own next pointer, in place**

\`\`\`js
function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    const next = current.next; // save it BEFORE overwriting current.next
    current.next = prev;       // flip this node's pointer to point backward
    prev = current;            // advance prev
    current = next;            // advance current, using the saved reference
  }
  return prev; // prev ends up at the new head, once current becomes null
}
\`\`\`

\`\`\`ts
function reverseList<T>(head: { value: T; next: any } | null): any {
  let prev: any = null;
  let current = head;
  while (current !== null) {
    const next: any = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
\`\`\`

Three pointers do all the work: \`current\` is the node currently being flipped, \`prev\` is the node that should come AFTER \`current\` once reversed (initially \`null\`, since the original first node becomes the new last node), and \`next\` is a temporary variable saving where \`current\` was originally pointing — saved specifically BEFORE \`current.next\` is overwritten, using exactly the same swap-with-a-temp-variable mechanic this course\'s Module 1 problem-solving-framework lesson introduced, since overwriting \`current.next\` without saving it first would lose the rest of the list permanently. Each iteration flips exactly one node\'s direction and advances all three pointers one step forward, reversing the entire list in a single pass through the SAME nodes, with no new node ever allocated.`,

    simpleHi: `**Toote hue se shuru.** Ek bilkul nayi, reverse ki gayi list banaana, node-dar-node:

\`\`\`js
function reverseList(head) {
  let newHead = null;
  let current = head;
  while (current !== null) {
    const newNode = { value: current.value, next: newHead }; // ek BILKUL-NAYA node
    newHead = newNode;
    current = current.next;
  }
  return newHead;
}
\`\`\`

Ye sach mein ek sahi tarike se reverse ki gayi list banaata hai — asli list ko aage se peeche chalte hue jabki hamesha har value ko ek badhti nayi list ke front mein insert karte hue order ko sach mein reverse karta hai. Keemat, bilkul is course ke Module 1 array-reversal lesson ki tarah, memory hai: asli list ke har akele node ke liye, ye approach reverse ki gayi list mein rakhne ke liye ek bilkul-naya node allocate karta hai, matlab asli list aur nayi dono ek saath memory mein maujood hoti hain, data ko asal mein zaroorat se lagbhag dooguni memory istemal karte hue.

**Fix: har maujood node ke apne next pointer ko in place mein rewire karo**

\`\`\`js
function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    const next = current.next; // current.next overwrite hone se PEHLE ise save karo
    current.next = prev;       // is node ke pointer ko peeche point karne ke liye flip karo
    prev = current;            // prev aage badhaao
    current = next;            // current aage badhaao, saved reference istemal karke
  }
  return prev; // prev naye head par khatam hota hai, ek baar current null ban jaata hai
}
\`\`\`

\`\`\`ts
function reverseList<T>(head: { value: T; next: any } | null): any {
  let prev: any = null;
  let current = head;
  while (current !== null) {
    const next: any = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
\`\`\`

Teen pointers sab kaam karte hain: \`current\` wo node hai jo abhi flip ki jaa rahi hai, \`prev\` wo node hai jo \`current\` ke baad aana chahiye ek baar reverse hone par (shuru mein \`null\`, kyunki asli pehla node naya aakhri node ban jaata hai), aur \`next\` ek temporary variable hai jo save karta hai ki \`current\` asal mein kahaan point kar raha tha — khaas taur par \`current.next\` overwrite hone se PEHLE save kiya gaya, bilkul wahi swap-with-a-temp-variable mechanic istemal karte hue jise is course ke Module 1 ke problem-solving-framework lesson ne introduce kiya, kyunki \`current.next\` ko pehle save kiye bina overwrite karna baaki list ko hamesha ke liye kho dega. Har iteration bilkul ek node ki disha flip karta hai aur sab teen pointers ko ek kadam aage badhaata hai, poori list ko usi nodes ke through ek akeli pass mein reverse karte hue, koi naya node kabhi allocate kiye bina.`,

    content: `## Tracing through a concrete example, one line at a time

\`\`\`
List: 1 -> 2 -> 3 -> null

Start:  prev = null,  current = (1)
Step 1: next = (2)
        (1).next = null   →  now: null <- 1    2 -> 3 -> null
        prev = (1), current = (2)
Step 2: next = (3)
        (2).next = (1)    →  now: null <- 1 <- 2    3 -> null
        prev = (2), current = (3)
Step 3: next = null
        (3).next = (2)    →  now: null <- 1 <- 2 <- 3
        prev = (3), current = null  →  loop ends

Return prev = (3): the list is now 3 -> 2 -> 1 -> null
\`\`\`

This lesson\'s earlier explanation described the mechanic; tracing through an actual small list, one line at a time — exactly the habit this course\'s Module 1 problem-solving-framework lesson established as the core of its own "Understand" and "Verify" steps — is what makes the mechanic\'s correctness genuinely concrete rather than something to take on faith. Each step flips exactly one node\'s arrow, and by the time \`current\` becomes \`null\`, every single node\'s direction has been flipped exactly once, with \`prev\` sitting at what is now the new first node.

## The recursive version: the same rewiring, expressed through the call stack

\`\`\`js
function reverseList(head) {
  if (head === null || head.next === null) return head; // base case: 0 or 1 nodes

  const newHead = reverseList(head.next); // reverse everything AFTER head first
  head.next.next = head; // the node right after head now points back at head
  head.next = null;      // head itself becomes the new last node
  return newHead;
}
\`\`\`

\`\`\`ts
function reverseList<T>(head: { value: T; next: any } | null): any {
  if (head === null || head.next === null) return head;

  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
\`\`\`

The recursive version performs the exact same in-place rewiring as the iterative version — no new nodes are created here either — but expresses "process the rest of the list first, then fix up this node\'s own pointer" through recursive calls rather than an explicit loop. The base case (a list of zero or one nodes is already its own reverse) matches this course\'s Module 1 lesson on recursion\'s own emphasis on identifying a genuine base case first. Each recursive call fully reverses everything after \`head\`, then, on the way back out of the recursion, fixes up exactly one connection: the node that used to come right after \`head\` (\`head.next\`) now needs to point BACK at \`head\`, and \`head\` itself, now the new last node, needs its own \`next\` set to \`null\`.

## The genuine trade-off: iterative versus recursive here

The iterative version uses \`O(1)\` extra space, only ever needing the three pointer variables regardless of list length. The recursive version, despite performing the identical rewiring with no new nodes, uses \`O(n)\` extra space indirectly, through the call stack — this course\'s Module 1 lesson on analyzing recursion established that each recursive call remains on the stack until it returns, so reversing a list of \`n\` nodes recursively builds up \`n\` stack frames before any rewiring actually happens. For a very long list, this can risk a stack overflow in a way the iterative version genuinely cannot. The recursive version is not "wrong" — it produces an identical, correct result — but it is a real, concrete example of a technique that reads elegantly while quietly costing more memory than its iterative counterpart, worth recognizing explicitly rather than assuming recursion is free.`,

    contentHi: `## Ek thos example ko trace karna, ek waqt mein ek line

\`\`\`
List: 1 -> 2 -> 3 -> null

Shuru:  prev = null,  current = (1)
Step 1: next = (2)
        (1).next = null   →  ab: null <- 1    2 -> 3 -> null
        prev = (1), current = (2)
Step 2: next = (3)
        (2).next = (1)    →  ab: null <- 1 <- 2    3 -> null
        prev = (2), current = (3)
Step 3: next = null
        (3).next = (2)    →  ab: null <- 1 <- 2 <- 3
        prev = (3), current = null  →  loop khatam

prev = (3) return karo: list ab 3 -> 2 -> 1 -> null hai
\`\`\`

Is lesson ke pehle wale spashteekaran ne mechanic ko describe kiya; ek asli chhoti list ko trace karna, ek waqt mein ek line — bilkul wahi aadat jise is course ke Module 1 ke problem-solving-framework lesson ne apne "Understand" aur "Verify" steps ke core ki tarah sthaapit kiya — wo hai jo mechanic ki sahihata ko bharose par lene ke bajaye sach mein thos banaata hai. Har step bilkul ek node ka arrow flip karta hai, aur jab tak \`current\` \`null\` ban jaata hai, har akele node ki disha bilkul ek baar flip ho chuki hai, \`prev\` ab us par baithi hai jo ab naya pehla node hai.

## Recursive version: wahi rewiring, call stack ke zariye express ki gayi

\`\`\`js
function reverseList(head) {
  if (head === null || head.next === null) return head; // base case: 0 ya 1 nodes

  const newHead = reverseList(head.next); // pehle head ke BAAD sab kuch reverse karo
  head.next.next = head; // head ke bilkul baad wala node ab wapas head ko point karta hai
  head.next = null;      // head khud naya aakhri node ban jaata hai
  return newHead;
}
\`\`\`

\`\`\`ts
function reverseList<T>(head: { value: T; next: any } | null): any {
  if (head === null || head.next === null) return head;

  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
\`\`\`

Recursive version bilkul wahi in-place rewiring perform karta hai jo iterative version karta hai — yahaan bhi koi naye nodes nahi banaaye jaate — par "pehle baaki list process karo, phir is node ka apna pointer theek karo" ko recursive calls ke zariye express karta hai ek explicit loop ke bajaye. Base case (ek zero ya ek node ki list pehle se apna khud ka reverse hai) is course ke Module 1 ke recursion lesson ke apne zor se mel khaata hai pehle ek asli base case pehchaanne par. Har recursive call \`head\` ke baad sab kuch poori tarah reverse karta hai, phir, recursion se wapas nikalte waqt, bilkul ek connection theek karta hai: wo node jo \`head\` ke bilkul baad aata tha (\`head.next\`) ab \`head\` ko WAPAS point karna chahiye, aur \`head\` khud, ab naya aakhri node, ko apna \`next\` \`null\` par set karna chahiye.

## Asli trade-off: yahaan iterative versus recursive

Iterative version \`O(1)\` atirikt space istemal karta hai, kabhi sirf teen pointer variables ki zaroorat rakhte hue chahe list ki lambaayi kuch bhi ho. Recursive version, identical rewiring perform karne ke bawajood koi naye nodes ke bina, \`O(n)\` atirikt space parokh roop se istemal karta hai, call stack ke through — is course ke Module 1 ke recursion ka vishleshan karne wale lesson ne sthaapit kiya ki har recursive call stack par rehta hai jab tak ye return nahi hota, isliye \`n\` nodes ki ek list ko recursively reverse karna \`n\` stack frames banaata hai isse pehle ki koi bhi rewiring asal mein ho. Ek bahut lambi list ke liye, ye ek stack overflow ka khatra rakh sakta hai us tarike se jo iterative version sach mein nahi rakhta. Recursive version "galat" nahi hai — ye ek identical, sahi nateeja banaata hai — par ye ek asli, thos example hai ek technique ka jo elegantly padhta hai jabki chupchaap apne iterative counterpart se zyaada memory kharch karta hai, explicitly pehchaanne laayak recursion ko muft maanne ke bajaye.`,

    examples: [
      {
        title: 'Broken: building an entirely new list, node by node',
        titleHi: 'Toota: ek bilkul nayi list banaana, node-dar-node',
        code: `const newNode = { value: current.value, next: newHead };
newHead = newNode;`,
        codeJs: `function reverseList(head) {
  let newHead = null;
  let current = head;
  while (current !== null) {
    const newNode = { value: current.value, next: newHead };
    newHead = newNode;
    current = current.next;
  }
  return newHead;
}
// correct, but allocates a brand-new node for every existing one`,
        codeTs: `interface Node<T> { value: T; next: Node<T> | null; }

function reverseList<T>(head: Node<T> | null): Node<T> | null {
  let newHead: Node<T> | null = null;
  let current = head;
  while (current !== null) {
    const newNode: Node<T> = { value: current.value, next: newHead };
    newHead = newNode;
    current = current.next;
  }
  return newHead;
}
// fully valid TypeScript — the extra memory is architectural`,
        output: `Correctly reverses [1, 2, 3] into [3, 2, 1], but the original
list's 3 nodes and the new list's 3 nodes both exist in memory
simultaneously during the function's execution.`,
        explain: 'Building a reversed copy allocates a full second set of nodes, exactly the same trade-off this course\'s Module 1 array-reversal lesson covered.',
        explainHi: 'Ek reverse ki gayi copy banaana nodes ka ek poora doosra set allocate karta hai, bilkul wahi trade-off jise is course ke Module 1 array-reversal lesson ne cover kiya.',
      },
      {
        title: 'Fixed: iterative in-place reversal with three pointers',
        titleHi: 'Theek: teen pointers ke saath iterative in-place reversal',
        code: `const next = current.next;
current.next = prev;
prev = current; current = next;`,
        codeJs: `function reverseList(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
        codeTs: `interface Node<T> { value: T; next: Node<T> | null; }

function reverseList<T>(head: Node<T> | null): Node<T> | null {
  let prev: Node<T> | null = null;
  let current = head;
  while (current !== null) {
    const next: Node<T> | null = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
        outputJs: `Correctly reverses [1, 2, 3] into [3, 2, 1] using the exact same
3 original nodes, with no new node ever allocated.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each node\'s own next pointer is rewired in place, one at a time, using O(1) extra memory regardless of the list\'s length.',
        explainHi: 'Har node ka apna \`next\` pointer in place mein rewire kiya jaata hai, ek waqt mein ek, \`O(1)\` atirikt memory istemal karte hue chahe list ki lambaayi kuch bhi ho.',
      },
      {
        title: 'The recursive version: identical result, different trade-off',
        titleHi: 'Recursive version: identical nateeja, alag trade-off',
        code: `const newHead = reverseList(head.next);
head.next.next = head;
head.next = null;`,
        codeJs: `function reverseList(head) {
  if (head === null || head.next === null) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
        codeTs: `interface Node<T> { value: T; next: Node<T> | null; }

function reverseList<T>(head: Node<T> | null): Node<T> | null {
  if (head === null || head.next === null) return head;
  const newHead = reverseList(head.next);
  head.next!.next = head;
  head.next = null;
  return newHead;
}`,
        outputJs: `Produces the identical [3, 2, 1] result, using no new nodes, but
building n stack frames via recursive calls before any rewiring
happens, unlike the iterative version's O(1) extra space.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The same in-place rewiring happens, but the call stack itself now grows with list length, an O(n) space cost the iterative version does not pay.',
        explainHi: 'Wahi in-place rewiring hoti hai, par call stack khud ab list ki lambaayi ke saath badhta hai, ek \`O(n)\` space keemat jo iterative version nahi chukaata.',
      },
    ],

    mistakes: [
      {
        wrong: `const newNode = { value: current.value, next: newHead };
// building an entirely new node for every existing one`,
        right: `current.next = prev; // rewiring the EXISTING node's own pointer`,
        why: 'Building a new node for every value allocates a full second set of nodes, exactly the same unnecessary memory cost this course\'s array-reversal lesson already covered.',
        whyHi: 'Har value ke liye ek naya node banaana nodes ka ek poora doosra set allocate karta hai, bilkul wahi bekaar memory keemat jise is course ka array-reversal lesson pehle hi cover kar chuka hai.',
      },
      {
        wrong: `current.next = prev; // overwriting current.next BEFORE saving it
current = current.next; // this now reads prev, not the original next node — the rest of the list is lost`,
        right: `const next = current.next; // save it FIRST
current.next = prev;
current = next;`,
        why: 'Overwriting current.next before saving its original value permanently loses the reference to the rest of the list, exactly the swap-without-a-temp-variable mistake this course\'s Module 1 lesson covered.',
        whyHi: '\`current.next\` ko iski asli value save karne se pehle overwrite karna baaki list ke reference ko hamesha ke liye kho deta hai, bilkul wahi swap-without-a-temp-variable galti jise is course ka Module 1 lesson cover karta hai.',
      },
      {
        wrong: `// choosing the recursive version by default, assuming it is
// equivalent to the iterative one in every respect`,
        right: `// recognizing the recursive version uses O(n) extra space via
// the call stack, a real trade-off against a very long list`,
        why: 'The recursive version performs identical in-place rewiring but uses O(n) stack space, risking a stack overflow on very long lists in a way the iterative O(1)-space version does not.',
        whyHi: 'Recursive version identical in-place rewiring perform karta hai par \`O(n)\` stack space istemal karta hai, bahut lambi lists par ek stack overflow ka khatra rakhte hue us tarike se jo iterative \`O(1)\`-space version nahi rakhta.',
      },
    ],

    realWorld: [
      {
        en: '**"Reverse a Linked List" is one of the single most commonly asked foundational technical interview questions across the entire industry**, specifically because it directly tests pointer-manipulation fluency.',
        hi: '**"Ek Linked List Reverse Karo" poore industry mein sabse aam poochhe jaane waale foundational technical interview sawaalon mein se ek hai**, khaas taur par kyunki ye seedhe pointer-manipulation fluency test karta hai.',
      },
      {
        en: '**The iterative three-pointer (prev, current, next) reversal technique is the genuinely standard, widely taught approach**, not a simplified version invented for teaching purposes.',
        hi: '**Iterative teen-pointer (\`prev\`, \`current\`, \`next\`) reversal technique sach mein standard, widely taught approach hai**, teaching maksad ke liye ijaad ki gayi ek simplified version nahi.',
      },
      {
        en: '**Stack overflow errors from deeply recursive linked-list operations on unexpectedly long real-world lists are a genuinely documented, real production issue**, not a hypothetical concern.',
        hi: '**Anexpected roop se lambi asli-duniya lists par gehri recursive linked-list operations se stack overflow errors ek sach mein documented, asli production issue hain**, ek kaalpanik chinta nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must next be saved into a temporary variable before current.next is overwritten during in-place linked list reversal, and what specifically goes wrong if this order is reversed?',
        qHi: 'In-place linked list reversal ke dauraan \`current.next\` overwrite hone se pehle \`next\` ko ek temporary variable mein kyun save kiya jaana chahiye, aur agar ye order ulta kar diya jaaye toh khaas taur par kya galat hota hai?',
        a: 'At the point where current.next is about to be overwritten, it is the only reference the entire program has to the rest of the original list beyond the current node — no other variable, at that moment, points to whatever comes after current. The line current.next = prev is specifically intended to flip current\'s own pointer to point backward, toward the previous node in the traversal, which means this assignment necessarily destroys whatever value current.next held immediately beforehand. If this assignment is performed before that original value has been copied somewhere else, the reference to the rest of the original list is permanently lost the instant the assignment completes, since nothing else in the program retained a copy of it. Saving current.next into a separate variable, conventionally named next, before performing the current.next = prev assignment, preserves that reference specifically so the traversal can continue to it immediately afterward, via current = next. This is precisely the same underlying mistake, and the same underlying fix, as attempting to swap two plain variables\' values using only a = b; b = a without a temporary variable — in both cases, an assignment overwrites the only remaining reference to a value before that value has been safely copied elsewhere, and in both cases the fix is identical: capture the value that is about to be lost into a temporary variable before performing the overwriting assignment, so that value remains available afterward even though the original location no longer holds it.',
        aHi: 'Us bindu par jahan \`current.next\` overwrite hone hi wala hai, ye poore program ka akela reference hai baaki asli list ke current node se aage jo kuch bhi hai use — koi bhi doosra variable, us pal, us cheez ko point nahi karta jo \`current\` ke baad aati hai. Line \`current.next = prev\` khaas taur par \`current\` ke apne pointer ko peeche, traversal mein pichle node ki taraf, point karne ke liye flip karne ke liye hai, matlab ye assignment zaroori roop se \`current.next\` ne turant pehle jo bhi value rakhi thi use nasht karta hai. Agar ye assignment us asli value kahin aur copy kiye jaane se pehle perform kiya jaata hai, baaki asli list ka reference us pal hamesha ke liye kho jaata hai jab assignment poora hota hai, kyunki program mein kuch aur ne iski copy nahi rakhi. \`current.next\` ko ek alag variable mein save karna, jise parampara se \`next\` naam diya jaata hai, \`current.next = prev\` assignment perform karne se pehle, us reference ko khaas taur par isliye preserve karta hai taaki traversal turant baad usme jaari rah sake, \`current = next\` ke zariye. Ye bilkul wahi underlying galti hai, aur wahi underlying fix, jo do saadhe variables ki values ko sirf \`a = b; b = a\` istemal karke ek temporary variable ke bina swap karne ki koshish karna hai — dono cases mein, ek assignment ek value ke akele bache hue reference ko us se pehle overwrite karta hai ki us value ko surakshit roop se kahin aur copy kiya jaaye, aur dono cases mein fix identical hai: overwriting assignment perform karne se pehle jo value kho jaane hi wali hai use ek temporary variable mein capture karo, taaki wo value baad mein upalabdh rahe chahe asli location ab use na rakhta ho.',
      },
      {
        q: 'The recursive linked-list reversal produces an identical result to the iterative version and creates no new nodes either — so why is it still considered to use more memory, and why does this matter?',
        qHi: 'Recursive linked-list reversal iterative version se identical nateeja banaata hai aur koi naye nodes bhi nahi banaata — toh ye phir bhi zyaada memory istemal karta hua kyun maana jaata hai, aur ye maayne kyun rakhta hai?',
        a: 'It is true that neither version allocates any new linked-list nodes — both rewire the exact same original nodes\' own next pointers, and in that specific respect, their memory behavior with regard to the list\'s own nodes is identical. The memory difference lies elsewhere: in how a recursive function call itself is handled by the underlying language runtime. This course\'s earlier lesson on analyzing recursion established that every recursive call remains present on the call stack, occupying its own stack frame, from the moment it is invoked until the moment it actually returns a value back to whichever call invoked it. The recursive reversal function calls itself on head.next before doing any actual pointer rewiring at all, meaning that reversing a list of n nodes requires making n nested recursive calls, one after another, before the first one\'s own rewiring work (the head.next.next = head and head.next = null lines) can even begin to execute — and all n of those calls remain simultaneously present on the call stack throughout this process, each one waiting for its own recursive call to return before it can proceed. This means the recursive version\'s actual memory usage during execution is proportional to n, the list\'s length, specifically due to this stack of pending function calls, even though zero additional linked-list nodes are ever created. This matters concretely because a sufifciently long list — one with many thousands or millions of nodes — can cause the recursive version to exhaust the call stack\'s own size limit and crash with a stack overflow error, a failure mode the iterative version, which uses a fixed, constant amount of memory (just the three pointer variables) regardless of how long the list is, genuinely cannot experience.',
        aHi: 'Ye sach hai ki koi bhi version koi naye linked-list nodes allocate nahi karta — dono bilkul usi asli nodes ke apne \`next\` pointers ko rewire karte hain, aur us khaas pehlu mein, list ke apne nodes ke saapeksh unka memory vyavahaar identical hai. Memory ka farak kahin aur hai: is baat mein ki ek recursive function call khud underlying language runtime dwara kaise handle ki jaati hai. Is course ka pehle wala recursion ka vishleshan karne wala lesson sthaapit karta hai ki har recursive call call stack par maujood rehti hai, apna khud ka stack frame kabza karte hue, us pal se jab ye bulaayi jaati hai jab tak ye asal mein ek value wapas us call ko nahi deti jisne ise bulaaya. Recursive reversal function khud ko \`head.next\` par bulaata hai koi asli pointer rewiring karne se pehle bilkul, matlab \`n\` nodes ki ek list ko reverse karna \`n\` nested recursive calls banaana maangta hai, ek ke baad ek, isse pehle ki pehli ka apna rewiring kaam (\`head.next.next = head\` aur \`head.next = null\` lines) bhi execute hona shuru ho — aur un sab \`n\` calls mein se har ek is poori process ke dauraan ek saath call stack par maujood rehta hai, har ek apni khud ki recursive call ke return hone ka wait karte hue aage badhne se pehle. Iska matlab hai recursive version ka asli memory istemal execution ke dauraan \`n\` ke anupaat mein hai, list ki lambaayi, khaas taur par pending function calls ke is stack ki wajah se, chahe zero atirikt linked-list nodes kabhi banaaye jaayein. Ye thos roop se maayne rakhta hai kyunki ek kaafi lambi list — hazaaron ya millions nodes waali — recursive version ko call stack ki apni size limit khatam karne aur ek stack overflow error ke saath crash karne ka kaaran ban sakti hai, ek failure mode jo iterative version, jo ek fixed, constant tadaad ki memory istemal karta hai (bas teen pointer variables) chahe list kitni bhi lambi ho, sach mein anubhav nahi kar sakta.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (new-list) and fixed (iterative, three-pointer) reverseList functions from this lesson. Trace through reversing a 3-node list [1, 2, 3] by hand, writing down prev, current, and next after every single line, before running the code.',
        taskHi: 'Is lesson ke toote (nayi-list) aur theek (iterative, teen-pointer) \`reverseList\` functions dono banao. \`[1, 2, 3]\` ki 3-node list ko reverse karna haath se trace karo, har akeli line ke baad \`prev\`, \`current\`, aur \`next\` likhte hue, code chalaane se pehle.',
        hint: 'This is the exact tracing habit this course\'s Module 1 problem-solving-framework lesson established — write down each variable\'s value in a table, one row per line executed.',
        hintHi: 'Ye bilkul wahi tracing aadat hai jise is course ke Module 1 problem-solving-framework lesson ne sthaapit kiya — har variable ki value ek table mein likho, prati execute ki gayi line ek row.',
      },
      {
        task: 'Build the recursive reverseList from this lesson. Add a console.log at the very start of the function, printing the current head\'s value, and observe the order these logs print in relative to when the actual pointer rewiring happens.',
        taskHi: 'Is lesson ka recursive \`reverseList\` banaao. Function ke bilkul shuru mein ek \`console.log\` jodo, current \`head\` ki value print karte hue, aur dekho ye logs kis order mein print hote hain us se sambandhit ki asli pointer rewiring kab hoti hai.',
        hint: 'The logs printing before any rewiring happens is the direct, visible evidence of the recursive calls building up on the stack before any actual work is done.',
        hintHi: 'Logs ka kisi bhi rewiring hone se pehle print hona seedha, drishyaman saboot hai recursive calls ka stack par jama hone ka kisi bhi asli kaam hone se pehle.',
      },
      {
        task: 'Build a genuinely long linked list (100,000+ nodes) and reverse it using the recursive version. If it crashes with a stack overflow, confirm the iterative version handles the same list without issue.',
        taskHi: 'Ek sach mein lambi linked list banaao (100,000+ nodes) aur ise recursive version istemal karke reverse karo. Agar ye ek stack overflow ke saath crash hoti hai, confirm karo ki iterative version usi list ko bina kisi samasya ke handle karta hai.',
        hint: 'Build the long list using a loop that repeatedly calls addToFront, following this module\'s first lesson, rather than typing out 100,000 nodes by hand.',
        hintHi: 'Lambi list ek loop istemal karke banaao jo baar-baar \`addToFront\` bulaata hai, is module ke pehle lesson ka palan karte hue, 100,000 nodes haath se type karne ke bajaye.',
      },
    ],

    keyTakeaways: [
      'Building an entirely new, reversed list allocates a full second set of nodes, exactly the same unnecessary-memory mistake this course\'s Module 1 array-reversal lesson covered.',
      'The iterative fix rewires each existing node\'s own next pointer using three pointers (prev, current, next), reversing the list in place with O(1) extra memory.',
      'next must be saved before current.next is overwritten, using the exact same swap-with-a-temp-variable mechanic this course\'s Module 1 problem-solving-framework lesson introduced.',
      'The recursive version performs identical in-place rewiring and creates no new nodes, but builds n stack frames via recursive calls, using O(n) extra space through the call stack.',
      'A sufficiently long list can cause the recursive version to overflow the call stack and crash, a failure mode the iterative O(1)-space version genuinely cannot experience.',
      'Tracing through a small, concrete example by hand, one line at a time, is what makes a pointer-rewiring technique\'s correctness genuinely understood rather than merely memorized.',
    ],
    keyTakeawaysHi: [
      'Ek bilkul nayi, reverse ki gayi list banaana nodes ka ek poora doosra set allocate karta hai, bilkul wahi bekaar-memory galti jise is course ka Module 1 array-reversal lesson cover karta hai.',
      'Iterative fix har maujood node ke apne \`next\` pointer ko teen pointers (\`prev\`, \`current\`, \`next\`) istemal karke rewire karta hai, list ko in place mein \`O(1)\` atirikt memory ke saath reverse karte hue.',
      '\`current.next\` overwrite hone se pehle \`next\` ko save kiya jaana chahiye, bilkul wahi swap-with-a-temp-variable mechanic istemal karte hue jise is course ke Module 1 ke problem-solving-framework lesson ne introduce kiya.',
      'Recursive version identical in-place rewiring perform karta hai aur koi naye nodes nahi banaata, par recursive calls ke zariye \`n\` stack frames banaata hai, call stack ke through \`O(n)\` atirikt space istemal karte hue.',
      'Ek kaafi lambi list recursive version ko call stack overflow karne aur crash karne ka kaaran ban sakti hai, ek failure mode jo iterative \`O(1)\`-space version sach mein anubhav nahi kar sakta.',
      'Ek chhote, thos example ko haath se trace karna, ek waqt mein ek line, wo hai jo ek pointer-rewiring technique ki sahihata ko sach mein samjha hua banaata hai sirf yaad kiya hua nahi.',
    ],
  },
];
