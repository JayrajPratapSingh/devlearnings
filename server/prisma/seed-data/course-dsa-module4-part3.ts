/**
 * DSA Complete Course — Module 4: Linked Lists, lesson 3.
 *
 * Fast and slow pointers (Floyd's cycle detection), applied to two
 * related problems: detecting whether a linked list contains a cycle,
 * and finding a list's middle node. Broken example: detecting a cycle
 * by tracking every visited node in a Set — genuinely correct and O(n)
 * time, but paying O(n) EXTRA SPACE that is not actually necessary.
 * Fixed with two pointers moving at different speeds through the same
 * list, using no extra space at all: if a cycle exists, the faster
 * pointer will eventually lap the slower one and they collide; if no
 * cycle exists, the faster pointer simply reaches the end (null) first.
 * The lesson closes by applying the identical two-speed mechanic to a
 * second, differently-phrased problem (finding the middle node), the
 * same pattern-recognition move this course's Module 2 anagram/
 * palindrome lesson made explicit.
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

export const DSA_MODULE_4_PART3: CourseLesson[] = [
  {
    slug: 'fast-slow-pointers-cycle-detection',
    title: 'Fast and Slow Pointers: Cycle Detection',
    titleHi: 'Fast Aur Slow Pointers: Cycle Detection',
    description: 'Detecting whether a linked list loops back on itself by tracking every visited node in a Set works correctly, but pays O(n) extra memory to answer a question that two simple pointers, moving at different speeds through the SAME list, can answer using no extra memory at all.',
    descriptionHi: 'Ye detect karna ki ek linked list khud par wapas loop karti hai ya nahi har dekhe gaye node ko ek \`Set\` mein track karke sahi tarike se kaam karta hai, par ek aise sawaal ka jawaab dene ke liye \`O(n)\` atirikt memory chukaata hai jise do saadhe pointers, usi list ke through alag speeds par move karte hue, bilkul koi atirikt memory istemal kiye bina jawaab de sakte hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Two runners on a track whose actual shape is unknown from the ground — one runner jogging at a normal pace, a second sprinting at exactly double that speed — versus a single observer standing at the start line, writing down the name of every single checkpoint either runner passes to check later for repeats.** If the track is actually a straight line with a genuine finish line, the sprinter simply reaches the end first, and neither runner ever needs to cross paths with the other more than once. If the track secretly loops back on itself into a circuit, something different and predictable happens: because the sprinter is gaining on the jogger at a constant, steady rate, the sprinter will eventually lap the jogger completely and the two will physically collide again somewhere on the loop, a collision that could only happen if the track genuinely loops — it is mathematically impossible for a faster runner to "lap" a slower one on a straight track with a real end. The two-runner method notices this collision directly, using nothing but the runners themselves, with no need to write anything down at all. The checkpoint-recording observer would also correctly detect the loop, by eventually noticing the same checkpoint name appearing twice in the list — but this requires maintaining a growing written record of every single checkpoint visited, memory that the two-runner method never needed. Tracking every visited node in a Set to detect a linked list cycle is the checkpoint-recording observer: correct, but paying real memory for every node visited. Two pointers moving at different speeds through the list itself, watching for them to collide, is the two-runner method: the exact same detection, using no extra memory at all.',
      hi: '**Ek track par do runners jiska asli shape zameen se anjaan hai — ek runner ek normal raftaar se jog kar raha hai, ek doosra bilkul us speed ka dooguna sprint kar raha hai — versus ek akela observer jo start line par khada hai, har akele checkpoint ka naam likhte hue jise koi bhi runner paar karta hai baad mein dohraav check karne ke liye.** Agar track asal mein ek seedhi line hai ek asli finish line ke saath, sprinter bas pehle ant tak pahunchta hai, aur kisi bhi runner ko doosre se ek se zyaada baar raaste paar karne ki zaroorat kabhi nahi hoti. Agar track chupke se khud par wapas loop hoke ek circuit banaata hai, kuch alag aur predictable hota hai: kyunki sprinter jogger par ek constant, steady dar se aage badh raha hai, sprinter aakhirkaar jogger ko poori tarah lap kar dega aur dono kahin loop par physically dobara takraayenge, ek takraav jo sirf tab ho sakta hai agar track sach mein loop karta hai — ek tez runner ke liye ek dheeme ko "lap" karna mathematically namumkin hai ek seedhi track par ek asli ant ke saath. Do-runner tarika is takraav ko seedhe notice karta hai, sirf runners khud istemal karke, kuch bhi likhne ki zaroorat bilkul na hote hue. Checkpoint-record-karne-waala observer bhi sahi tarike se loop detect karega, aakhirkaar wahi checkpoint naam list mein do baar dikhte hue notice karke — par isse har akele visit kiye gaye checkpoint ka ek badhta likha hua record maintain karna chahiye, memory jiski do-runner tarike ko kabhi zaroorat nahi thi. Ek linked list cycle detect karne ke liye har visit kiya gaya node ek \`Set\` mein track karna checkpoint-record-karne-waala observer hai: sahi, par har visit kiye gaye node ke liye asli memory chukaate hue. List ke through alag speeds par do pointers move karna, unhe takraate hue dekhte hue, do-runner tarika hai: bilkul wahi detection, bilkul koi atirikt memory istemal kiye bina.',
    },

    simple: `**Start broken.** Tracking every visited node in a Set, paying O(n) extra space:

\`\`\`js
function hasCycle(head) {
  const visited = new Set(); // stores a reference to every node seen so far
  let current = head;
  while (current !== null) {
    if (visited.has(current)) return true; // seen this node before — a cycle
    visited.add(current);
    current = current.next;
  }
  return false;
}
\`\`\`

This is genuinely correct, and its \`O(n)\` time complexity is exactly right for this problem. The cost worth noticing is space: \`visited\` grows to hold a reference to every single node the traversal passes through, meaning this approach uses \`O(n)\` EXTRA memory, on top of the list itself, purely to answer a yes-or-no question about whether a cycle exists.

**The fix: two pointers at different speeds, using no extra memory at all**

\`\`\`js
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // moves one step
    fast = fast.next.next;  // moves two steps
    if (slow === fast) return true; // they collided — only possible if there's a cycle
  }
  return false; // fast reached the end — no cycle
}
\`\`\`

\`\`\`ts
function hasCycle<T>(head: { value: T; next: any } | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\`

\`slow\` advances one node per iteration; \`fast\` advances two. If the list has no cycle, \`fast\` (being twice as fast) simply reaches the genuine end (\`null\`) before \`slow\` does, and the loop exits normally. If the list DOES have a cycle, both pointers eventually enter the loop, and because \`fast\` gains on \`slow\` by exactly one extra step every iteration, \`fast\` is mathematically guaranteed to eventually catch up to and collide with \`slow\` from behind — a collision that can only happen if the list loops back on itself. No \`Set\`, no extra memory beyond the two pointer variables themselves, regardless of how long the list is.`,

    simpleHi: `**Toote hue se shuru.** Har visit kiye gaye node ko ek \`Set\` mein track karna, \`O(n)\` atirikt space chukaate hue:

\`\`\`js
function hasCycle(head) {
  const visited = new Set(); // ab tak dekhe gaye har node ka ek reference store karta hai
  let current = head;
  while (current !== null) {
    if (visited.has(current)) return true; // ye node pehle dekha — ek cycle
    visited.add(current);
    current = current.next;
  }
  return false;
}
\`\`\`

Ye sach mein sahi hai, aur iski \`O(n)\` time complexity is problem ke liye bilkul sahi hai. Keemat jo notice karne laayak hai wo space hai: \`visited\` badhta hai traversal jis har akele node se guzarta hai uska reference rakhne ke liye, matlab ye approach \`O(n)\` ATIRIKT memory istemal karta hai, khud list ke oopar, sirf is haan-ya-na sawaal ka jawaab dene ke liye ki kya ek cycle maujood hai.

**Fix: alag speeds par do pointers, bilkul koi atirikt memory istemal kiye bina**

\`\`\`js
function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;       // ek kadam move karta hai
    fast = fast.next.next;  // do kadam move karta hai
    if (slow === fast) return true; // wo takraaye — sirf tab mumkin hai agar ek cycle hai
  }
  return false; // fast ant tak pahuncha — koi cycle nahi
}
\`\`\`

\`\`\`ts
function hasCycle<T>(head: { value: T; next: any } | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
\`\`\`

\`slow\` prati-iteration ek node aage badhta hai; \`fast\` do aage badhta hai. Agar list mein koi cycle nahi hai, \`fast\` (dooguna tez hote hue) bas asli ant (\`null\`) tak \`slow\` se pehle pahuncha jaata hai, aur loop normal roop se khatam hota hai. Agar list mein CYCLE HAI, dono pointers aakhirkaar loop mein pravesh karte hain, aur kyunki \`fast\` har iteration mein \`slow\` par bilkul ek atirikt kadam se aage badhta hai, \`fast\` mathematically guaranteed hai ki aakhirkaar \`slow\` ko pakad legaa aur peeche se ise takraaega — ek takraav jo sirf tab ho sakta hai agar list khud par wapas loop karti hai. Koi \`Set\` nahi, do pointer variables khud se aage koi atirikt memory nahi, chahe list kitni bhi lambi ho.`,

    content: `## Why the faster pointer is mathematically guaranteed to catch up

\`\`\`
If there is a cycle, once both pointers are inside the loop:
  the distance between fast and slow SHRINKS by exactly 1 node
  every single iteration (fast gains 2 steps, slow gains 1, net: 1)

A shrinking distance that starts as some finite number, and decreases
by 1 each step, MUST eventually reach 0 — a collision is unavoidable
\`\`\`

Once both pointers have entered a cycle (a loop of some finite length), the gap between them, measured in number of nodes along the loop, decreases by exactly one node every single iteration, since \`fast\` covers two nodes of ground while \`slow\` covers only one. A gap that starts at some specific finite value and shrinks by exactly one each step will, without any possibility of skipping past zero (since it decreases by whole nodes, one at a time), eventually reach exactly zero — the moment \`slow\` and \`fast\` are pointing at the very same node. This is not a probabilistic likelihood; it is a mathematical certainty given the two speeds chosen, which is precisely why this technique correctly detects a cycle rather than merely making it likely.

## The second application: finding the middle node with the same mechanic

\`\`\`js
function findMiddle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow; // when fast reaches the end, slow is exactly at the middle
}
\`\`\`

\`\`\`ts
function findMiddle<T>(head: { value: T; next: any } | null): any {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}
\`\`\`

The exact same two-speed mechanic, with no modification beyond removing the collision check, solves a differently-phrased problem: finding a linked list\'s middle node in a single pass, without first counting the list\'s total length. Since \`fast\` always covers exactly twice the distance \`slow\` does, by the time \`fast\` reaches the end of the list, \`slow\` has covered exactly half that distance — landing precisely at the middle. This is the same pattern-recognition move this course\'s Module 2 anagram/palindrome lesson made explicit: recognizing that a mechanic already learned for one problem (detecting a cycle) applies, with no change to its underlying logic, to a problem that reads completely differently on the surface (finding a middle element), because both problems share the same underlying structural shape — two pointers moving through the same sequence at a fixed 2-to-1 speed ratio.

## Why fast.next must be checked before fast.next.next, every single time

\`\`\`js
while (fast !== null && fast.next !== null) { // BOTH checks are required
  fast = fast.next.next;
}
\`\`\`

Advancing \`fast\` by two nodes requires reading \`fast.next.next\`, which means \`fast.next\` itself must already be a genuine node, not \`null\`, before that read is attempted — reading \`.next\` on something that is \`null\` throws a runtime error, exactly the mistake this course\'s earlier singly-linked-list lesson warned against. This is why the loop condition checks BOTH \`fast !== null\` AND \`fast.next !== null\`: the first check alone would still allow \`fast.next\` to be \`null\` at the moment \`fast.next.next\` is read, causing a crash on a list with an even number of nodes and no cycle, where \`fast\` lands exactly on the last node with \`fast.next\` already \`null\`.`,

    contentHi: `## Tez pointer pakadne ke liye mathematically guaranteed kyun hai

\`\`\`
Agar ek cycle hai, ek baar dono pointers loop ke andar hain:
  fast aur slow ke beech ki doori bilkul 1 node se SIMAT jaati hai
  har akeli iteration mein (fast 2 kadam gain karta hai, slow 1, net: 1)

Ek simatti hui doori jo kisi finite number se shuru hoti hai, aur har
kadam 1 se kam hoti hai, aakhirkaar 0 tak PAHUNCHNI CHAHIYE — ek takraav
bachne-yogya nahi hai
\`\`\`

Ek baar dono pointers ek cycle mein pravesh kar chuke hain (kisi finite lambaayi ka ek loop), unke beech ka gap, loop ke saath nodes ki tadaad mein naapa gaya, bilkul ek node se ghatta hai har akeli iteration mein, kyunki \`fast\` do nodes ki zameen cover karta hai jabki \`slow\` sirf ek. Ek gap jo kisi khaas finite value se shuru hota hai aur har kadam bilkul ek se simatta hai, bina zero ko paar karne ki kisi sambhaavna ke (kyunki ye poore nodes se ghatta hai, ek waqt mein ek), aakhirkaar bilkul zero tak pahunchega — us pal jab \`slow\` aur \`fast\` bilkul usi node ko point kar rahe hain. Ye ek probabilistic sambhaavna nahi hai; ye chune gaye do speeds ko dekhte hue ek mathematical nishchitata hai, jo bilkul isliye hai ki ye technique ek cycle ko sahi tarike se detect karti hai sirf ise sambhaavit banaane ke bajaye.

## Doosra application: usi mechanic se middle node dhoondhna

\`\`\`js
function findMiddle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow; // jab fast ant tak pahunchta hai, slow bilkul middle mein hai
}
\`\`\`

\`\`\`ts
function findMiddle<T>(head: { value: T; next: any } | null): any {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}
\`\`\`

Bilkul wahi two-speed mechanic, collision check hataane se aage koi badlaav ke bina, ek alag-shabdon-mein-likhi problem sulajhaata hai: ek linked list ka middle node ek akeli pass mein dhoondhna, pehle list ki total lambaayi gine bina. Kyunki \`fast\` hamesha bilkul \`slow\` ki dooguni doori cover karta hai, jab tak \`fast\` list ke ant tak pahuncha, \`slow\` ne bilkul aadhi wo doori cover ki hai — bilkul middle mein utarte hue. Ye wahi pattern-recognition move hai jise is course ke Module 2 ke anagram/palindrome lesson ne explicit kiya: ye pehchaanna ki ek mechanic jo ek problem (cycle detect karna) ke liye pehle se seekha gaya lagu hota hai, iski underlying logic mein koi badlaav na hote hue, ek aisi problem par jo satah par poori tarah alag padhi jaati hai (ek middle element dhoondhna), kyunki dono problems wahi underlying structural shape share karti hain — do pointers usi sequence ke through ek fixed 2-se-1 speed ratio par move karte hue.

## \`fast.next\` ko \`fast.next.next\` se pehle check karna kyun chahiye, har akeli baar

\`\`\`js
while (fast !== null && fast.next !== null) { // DONO checks zaruri hain
  fast = fast.next.next;
}
\`\`\`

\`fast\` ko do nodes se aage badhaana \`fast.next.next\` padhna maangta hai, matlab \`fast.next\` khud pehle se ek asli node hona chahiye, \`null\` nahi, us padhaai ki koshish karne se pehle — kisi aise cheez par \`.next\` padhna jo \`null\` hai ek runtime error throw karta hai, bilkul wahi galti jiske khilaaf is course ke pehle wale singly-linked-list lesson ne chetaavni di thi. Yahi wajah hai ki loop condition DONO check karti hai \`fast !== null\` AUR \`fast.next !== null\`: akela pehla check phir bhi \`fast.next\` ko \`null\` hone dega us pal jab \`fast.next.next\` padha jaata hai, ek crash ka kaaran banate hue ek list par jismein even tadaad ke nodes hain aur koi cycle nahi, jahan \`fast\` bilkul aakhri node par utarta hai \`fast.next\` pehle se \`null\` ke saath.`,

    examples: [
      {
        title: 'Broken: a Set tracking every visited node, paying O(n) extra space',
        titleHi: 'Toota: ek Set jo har visit kiya gaya node track karta hai, O(n) atirikt space chukaate hue',
        code: `const visited = new Set();
if (visited.has(current)) return true;
visited.add(current);`,
        codeJs: `function hasCycle(head) {
  const visited = new Set();
  let current = head;
  while (current !== null) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = current.next;
  }
  return false;
}
// O(n) time, but also O(n) extra space`,
        codeTs: `function hasCycle(head: { next: any } | null): boolean {
  const visited = new Set<unknown>();
  let current = head;
  while (current !== null) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = current.next;
  }
  return false;
}
// fully valid TypeScript — the extra space is architectural`,
        output: `Correctly detects a cycle, but the visited Set grows to hold a
reference to every single node the traversal passes through.`,
        explain: 'The Set correctly detects a repeated node, but requires O(n) extra memory to do so, storing a reference to every node visited so far.',
        explainHi: '\`Set\` ek dohraaye gaye node ko sahi tarike se detect karta hai, par aisa karne ke liye \`O(n)\` atirikt memory maangta hai, ab tak visit kiye gaye har node ka ek reference store karte hue.',
      },
      {
        title: 'Fixed: two pointers at different speeds, O(1) extra space',
        titleHi: 'Theek: alag speeds par do pointers, O(1) atirikt space',
        code: `slow = slow.next;
fast = fast.next.next;
if (slow === fast) return true;`,
        codeJs: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        codeTs: `function hasCycle<T>(head: { value: T; next: any } | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        outputJs: `Correctly detects a cycle using only the two pointer variables
themselves — no Set, no extra memory proportional to list length.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'fast gains exactly one extra node on slow every iteration inside a cycle, mathematically guaranteeing a collision without needing to record any visited node.',
        explainHi: '\`fast\` \`slow\` par bilkul ek atirikt node gain karta hai har iteration mein ek cycle ke andar, mathematically ek takraav guarantee karte hue kisi bhi visit kiye gaye node ko record karne ki zaroorat ke bina.',
      },
      {
        title: 'The same mechanic applied to a differently-phrased problem: finding the middle',
        titleHi: 'Wahi mechanic ek alag-shabdon-mein-likhi problem par lagu ki gayi: middle dhoondhna',
        code: `while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
}
return slow; // lands at the middle`,
        codeJs: `function findMiddle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
// same code shape as hasCycle, minus the collision check`,
        codeTs: `function findMiddle<T>(head: { value: T; next: any } | null): any {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}`,
        outputJs: `For a list of 1 -> 2 -> 3 -> 4 -> 5, findMiddle returns the node
holding 3 — slow has covered exactly half the distance fast covered,
found in a single pass without first counting the list's length.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Recognizing that this problem shares the exact same underlying two-speed-pointer structure as cycle detection, despite reading completely differently, is what makes the identical mechanic apply here.',
        explainHi: 'Ye pehchaanna ki ye problem bilkul wahi underlying two-speed-pointer structure share karti hai jo cycle detection ki hai, is baat ke bawajood ki ye poori tarah alag padhi jaati hai, wo hai jo identical mechanic ko yahaan lagu hone deta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const visited = new Set();
// tracking every visited node to detect a cycle`,
        right: `let slow = head, fast = head;
// two pointers at different speeds, no extra memory`,
        why: 'Tracking visited nodes in a Set correctly detects a cycle but uses O(n) extra memory that two pointers moving at different speeds do not need.',
        whyHi: 'Visited nodes ko ek \`Set\` mein track karna sahi tarike se ek cycle detect karta hai par \`O(n)\` atirikt memory istemal karta hai jo alag speeds par move karte do pointers ki zaroorat nahi hoti.',
      },
      {
        wrong: `while (fast !== null) { // missing the fast.next check
  fast = fast.next.next; // crashes if fast.next happens to be null
}`,
        right: `while (fast !== null && fast.next !== null) {
  fast = fast.next.next;
}`,
        why: 'Advancing fast by two nodes requires reading fast.next.next, so fast.next must also be confirmed non-null first, or the read throws a runtime error on lists with an even number of nodes.',
        whyHi: '\`fast\` ko do nodes se aage badhaane ke liye \`fast.next.next\` padhna chahiye, isliye \`fast.next\` ko bhi pehle non-null confirm kiya jaana chahiye, warna padhaai even tadaad ke nodes waali lists par ek runtime error throw karti hai.',
      },
      {
        wrong: `// treating cycle detection and finding the middle as two
// unrelated problems requiring separate techniques`,
        right: `// recognizing both as the identical fast/slow-pointer mechanic,
// differing only in what is checked or returned`,
        why: 'Both problems share the exact same underlying two-speed traversal structure — treating them as unrelated misses a directly transferable technique.',
        whyHi: 'Dono problems bilkul wahi underlying two-speed traversal structure share karti hain — unhe na-jude treat karna ek seedhe transferable technique ko miss karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Floyd\'s cycle detection algorithm (the formal name for this fast/slow-pointer technique) is a genuinely standard, widely taught algorithm**, named after its original discoverer, not an invented teaching device.',
        hi: '**Floyd ka cycle detection algorithm (is fast/slow-pointer technique ka formal naam) ek sach mein standard, widely taught algorithm hai**, iske asli discoverer ke naam par rakha gaya, ek ijaad ki gayi teaching device nahi.',
      },
      {
        en: '**"Linked List Cycle" and "Middle of the Linked List" are among the most commonly cited practice problems specifically chosen to teach the fast/slow-pointer technique.**',
        hi: '**"Linked List Cycle" aur "Middle of the Linked List" un practice problems mein sabse aam taur par cite ki jaane waali hain jo khaas taur par fast/slow-pointer technique sikhaane ke liye chuni gayi hain.**',
      },
      {
        en: '**Real garbage collectors and cycle-detection systems in memory management use structurally similar two-pointer or graph-traversal techniques to detect reference cycles.**',
        hi: '**Asli garbage collectors aur memory management mein cycle-detection systems structurally samaan two-pointer ya graph-traversal techniques istemal karte hain reference cycles detect karne ke liye.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why is a collision between the fast and slow pointers mathematically guaranteed to happen if a cycle exists, rather than merely being likely?',
        qHi: 'Agar ek cycle maujood hai toh fast aur slow pointers ke beech ek takraav mathematically guaranteed hona kyun hai, sirf sambhaavit hone ke bajaye?',
        a: 'Once both the slow and fast pointers have entered the cycle, consider the distance between them measured along the loop, counting how many nodes ahead the fast pointer currently is relative to the slow pointer. On each iteration, the slow pointer advances by exactly one node while the fast pointer advances by exactly two nodes, meaning the fast pointer gains exactly one node of ground on the slow pointer with every single iteration, since it is moving one node faster. This gap, whatever specific value it starts at once both pointers are inside the cycle, is a non-negative integer that decreases by precisely one with every iteration for as long as neither pointer has caught the other, since a fixed-size cycle means the fast pointer cannot simply escape or outrun the loop itself. Because the gap decreases by exactly one whole node each time, rather than by some variable or fractional amount, it cannot skip over zero — it must pass through every integer value between its starting value and zero on its way down, meaning it will, after a finite and predictable number of iterations, reach exactly zero. A gap of exactly zero between the two pointers means they are, at that moment, pointing at the exact same node, which is precisely the collision the algorithm checks for. This reasoning depends only on basic, deterministic arithmetic — the gap shrinking by a fixed amount each step until it reaches zero — rather than on any probabilistic argument about how likely a collision is, which is why the collision is described as mathematically guaranteed rather than merely probable.',
        aHi: 'Ek baar dono \`slow\` aur \`fast\` pointers cycle mein pravesh kar chuke hain, unke beech ki doori par vichaar karo loop ke saath naapi gayi, gante hue ki abhi \`fast\` pointer \`slow\` pointer ke saapeksh kitne nodes aage hai. Har iteration par, \`slow\` pointer bilkul ek node aage badhta hai jabki \`fast\` pointer bilkul do nodes aage badhta hai, matlab \`fast\` pointer \`slow\` pointer par bilkul ek node ki zameen gain karta hai har akeli iteration mein, kyunki ye ek node tez move kar raha hai. Ye gap, jo bhi khaas value se ye shuru hota hai ek baar dono pointers cycle ke andar hain, ek non-negative integer hai jo har iteration ke saath bilkul ek se ghatta hai jab tak koi bhi pointer doosre ko pakadta nahi, kyunki ek fixed-size cycle ka matlab hai fast pointer simply bhaag nahi sakta ya khud loop se aage nikal nahi sakta. Kyunki gap har baar bilkul ek poore node se ghatta hai, kisi variable ya fractional tadaad se nahi, ye zero ko paar nahi kar sakta — ise apni shuruaati value aur zero ke beech har integer value se guzarna chahiye neeche jaate hue, matlab ye, ek finite aur predictable tadaad ki iterations ke baad, bilkul zero tak pahunchega. Do pointers ke beech bilkul zero ka ek gap matlab hai wo, us pal, bilkul usi node ko point kar rahe hain, jo bilkul wo takraav hai jise algorithm check karta hai. Ye tark sirf buniyaadi, deterministic arithmetic par nirbhar karta hai — gap har kadam ek fixed tadaad se simatna jab tak ye zero tak nahi pahunchta — kisi bhi probabilistic tark par nahi ki ek takraav kitna sambhaavit hai, yahi wajah hai ki takraav ko sirf sambhaavit ke bajaye mathematically guaranteed ki tarah describe kiya jaata hai.',
      },
      {
        q: 'Why does the exact same fast/slow-pointer mechanic used for cycle detection also correctly find a linked list\'s middle node, despite the two problems reading completely differently?',
        qHi: 'Cycle detection ke liye istemal ki gayi bilkul wahi fast/slow-pointer mechanic ek linked list ka middle node bhi sahi tarike se kyun dhoondhti hai, is baat ke bawajood ki do problems poori tarah alag padhi jaati hain?',
        a: 'Both problems share an identical underlying structural relationship between the two pointers: the fast pointer always covers exactly twice the distance the slow pointer covers, since it advances two nodes for every one node the slow pointer advances, maintained consistently across every single iteration of the loop. Cycle detection exploits this relationship by checking whether the two pointers ever land on the same node, which, as established, can only happen if the list loops back on itself. Finding the middle node exploits the exact same underlying relationship from a different angle: since the fast pointer always covers exactly double the ground the slow pointer does, at the specific moment the fast pointer reaches the very end of the list, having covered the list\'s entire length, the slow pointer, having covered exactly half that same distance in the same amount of time, must be sitting precisely at the halfway point. Neither problem requires any change to the fundamental mechanic driving the two pointers forward — the loop\'s own structure, advancing slow by one node and fast by two on every iteration, is identical in both cases. What differs between the two problems is only what is being checked for as the loop runs (a collision between the two pointers versus simply running the loop to its natural conclusion) and what is ultimately returned or reported (whether a collision occurred versus where the slow pointer ends up). This is a direct, concrete instance of a broader skill this course has built since its Module 2 lesson on anagrams and palindromes: once a specific mechanic\'s actual underlying structural property is understood, rather than just its surface application to one particular problem, that same property can be recognized and reused to solve a genuinely different problem that happens to share the identical underlying structure, even when the two problems are phrased in ways that share no obvious surface resemblance to each other at all.',
        aHi: 'Dono problems do pointers ke beech ek identical underlying structural rishta share karte hain: fast pointer hamesha bilkul dooguni doori cover karta hai jo slow pointer cover karta hai, kyunki ye har ek node ke liye jo slow pointer aage badhta hai do nodes aage badhta hai, loop ki har akeli iteration mein consistently maintained. Cycle detection is rishte ka istemal ye check karke karta hai ki kya do pointers kabhi usi node par utarte hain, jo, jaisa sthaapit kiya gaya, sirf tab ho sakta hai agar list khud par wapas loop karti hai. Middle node dhoondhna bilkul usi underlying rishte ka istemal ek alag angle se karta hai: kyunki fast pointer hamesha bilkul dooguni zameen cover karta hai jo slow karta hai, us khaas pal par jab fast pointer list ke bilkul ant tak pahunchta hai, list ki poori lambaayi cover karke, slow pointer, usi samay mein bilkul aadhi wahi doori cover karke, bilkul aadhe raaste ke bindu par baitha hona chahiye. Kisi bhi problem ko do pointers ko aage badhaane wali buniyaadi mechanic mein kisi bhi badlaav ki zaroorat nahi hai — loop ki apni structure, \`slow\` ko ek node aur \`fast\` ko do se har iteration mein aage badhaana, dono cases mein identical hai. Do problems ke beech jo farak hai wo sirf ye hai ki loop chalte waqt kya check kiya jaa raha hai (do pointers ke beech ek takraav versus loop ko simply iske natural ant tak chalaana) aur aakhirkaar kya return ya report kiya jaata hai (kya ek takraav hua versus slow pointer kahaan khatam hota hai). Ye ek seedha, thos udaharan hai ek vyaapak kaushal ka jise is course ne apne Module 2 ke anagrams aur palindromes waale lesson se banaaya hai: ek baar ek khaas mechanic ki asli underlying structural property samajh li gayi, sirf ek khaas problem par iski surface application ke bajaye, wahi property pehchaani aur dobara istemal ki jaa sakti hai ek sach mein alag problem sulajhaane ke liye jo samyog se identical underlying structure share karti hai, chahe do problems aise tarike se likhi gayi hon jo ek doosre se koi zaahir surface samaanata bilkul share na karte hon.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken Set-based hasCycle and the fixed fast/slow-pointer version from this lesson. Build a genuinely cyclical list (manually set the last node\'s next back to an earlier node) and confirm both correctly detect it.',
        taskHi: 'Is lesson ka toota \`Set\`-based \`hasCycle\` aur theek fast/slow-pointer version dono banao. Ek sach mein cyclical list banaao (manually aakhri node ka \`next\` ek pehle wale node par wapas set karo) aur confirm karo ki dono ise sahi tarike se detect karte hain.',
        hint: 'Build a simple 5-node list first, confirm both functions return false, then manually set the 5th node\'s next to point back to the 3rd node and confirm both now return true.',
        hintHi: 'Pehle ek saadhi 5-node list banaao, confirm karo dono functions \`false\` return karte hain, phir manually 5th node ka \`next\` 3rd node ki taraf wapas point karne ke liye set karo aur confirm karo ki dono ab \`true\` return karte hain.',
      },
      {
        task: 'Build the findMiddle function from this lesson. Test it against a list with an odd number of nodes and a list with an even number of nodes, and confirm which specific node it returns in each case.',
        taskHi: 'Is lesson ka \`findMiddle\` function banaao. Ise ek odd tadaad ke nodes waali list aur ek even tadaad ke nodes waali list ke khilaaf test karo, aur confirm karo ki ye har case mein khaas taur par kaunsa node return karta hai.',
        hint: 'Trace through both cases by hand first, following the tracing habit from this course\'s earlier lessons, before running the code to check your prediction.',
        hintHi: 'Pehle dono cases ko haath se trace karo, is course ke pehle wale lessons ki tracing aadat follow karte hue, apni prediction check karne ke liye code chalaane se pehle.',
      },
      {
        task: 'Deliberately remove the fast.next !== null check from the loop condition and run hasCycle against a list with an even number of nodes and no cycle. Confirm it crashes, then add the check back and confirm it no longer does.',
        taskHi: 'Jaan-boojhkar loop condition se \`fast.next !== null\` check hataao aur \`hasCycle\` ko ek even tadaad ke nodes waali list ke khilaaf chalaao bina cycle ke. Confirm karo ki ye crash karta hai, phir check ko wapas jodo aur confirm karo ki ab ye nahi karta.',
        hint: 'A list with exactly 4 nodes and no cycle is a good test case, since fast will land exactly on the last node with fast.next already null.',
        hintHi: 'Bilkul 4 nodes waali aur bina cycle ki ek list ek achha test case hai, kyunki \`fast\` bilkul aakhri node par utrega jismein \`fast.next\` pehle se \`null\` hai.',
      },
    ],

    keyTakeaways: [
      'Tracking every visited node in a Set correctly detects a linked list cycle, but uses O(n) extra memory that is not actually necessary.',
      'Two pointers moving at different speeds (slow: one node per step, fast: two nodes per step) detect the identical cycle using O(1) extra memory.',
      'Once both pointers are inside a cycle, the gap between them shrinks by exactly one node every iteration, mathematically guaranteeing a collision, not merely making one likely.',
      'The same fast/slow mechanic, with only the collision check removed, finds a linked list\'s middle node in a single pass, since fast always covers exactly twice the distance slow does.',
      'The loop condition must check both fast !== null and fast.next !== null, since advancing fast by two nodes requires reading fast.next.next, which crashes if fast.next is already null.',
      'Recognizing that cycle detection and finding the middle share an identical underlying two-speed-pointer structure, despite reading completely differently, is a direct application of this course\'s pattern-recognition process.',
    ],
    keyTakeawaysHi: [
      'Har visit kiye gaye node ko ek \`Set\` mein track karna ek linked list cycle ko sahi tarike se detect karta hai, par \`O(n)\` atirikt memory istemal karta hai jo asal mein zaruri nahi hai.',
      'Alag speeds par do pointers (\`slow\`: prati-step ek node, \`fast\`: do nodes) identical cycle ko \`O(1)\` atirikt memory istemal karke detect karte hain.',
      'Ek baar dono pointers ek cycle ke andar hain, unke beech ka gap har iteration bilkul ek node se simatta hai, ek takraav ko mathematically guarantee karte hue, sirf ise sambhaavit banaate hue nahi.',
      'Wahi fast/slow mechanic, sirf collision check hataaya gaya, ek linked list ka middle node ek akeli pass mein dhoondhta hai, kyunki \`fast\` hamesha bilkul \`slow\` ki dooguni doori cover karta hai.',
      'Loop condition ko dono \`fast !== null\` aur \`fast.next !== null\` check karne chahiye, kyunki \`fast\` ko do nodes se aage badhaane ke liye \`fast.next.next\` padhna chahiye, jo crash karta hai agar \`fast.next\` pehle se \`null\` hai.',
      'Ye pehchaanna ki cycle detection aur middle dhoondhna ek identical underlying two-speed-pointer structure share karte hain, is baat ke bawajood ki wo poori tarah alag padhe jaate hain, is course ke pattern-recognition process ka ek seedha application hai.',
    ],
  },
];
