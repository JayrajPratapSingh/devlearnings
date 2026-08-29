/**
 * DSA Complete Course — Module 6: Recursion & Backtracking, lesson 1.
 *
 * Recursion fundamentals beyond what this course's Module 1 already
 * covered (call trees and complexity): specifically, WHEN code inside a
 * recursive function actually runs relative to the recursive call
 * itself, and why this determines output order. Broken example: trying
 * to print numbers in descending order by placing the print statement
 * AFTER the recursive call, producing ascending order instead — a
 * genuine, common confusion about the fact that code after a recursive
 * call runs during the unwind (as calls pop off the call stack this
 * course's Module 5 formalized), not during the initial descent. Fixed
 * by placing the print BEFORE the recursive call, so it runs during
 * the descent, in the intended order. The lesson explicitly connects
 * "code before the call runs top-down, code after runs bottom-up" to
 * the call stack's own LIFO behavior already established.
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

export const DSA_MODULE_6: CourseLesson[] = [
  {
    slug: 'recursion-fundamentals-call-stack-order',
    title: 'Recursion Fundamentals: Why Order Depends on the Call Stack',
    titleHi: 'Recursion Ki Buniyaad: Order Call Stack Par Kyun Nirbhar Karta Hai',
    description: 'Trying to print the numbers 5 down to 1 by writing a recursive function that calls itself first and prints second — the function is genuinely called in the right order, but the numbers appear on screen in exactly the opposite order intended: 1, 2, 3, 4, 5.',
    descriptionHi: 'Numbers 5 se 1 tak print karne ki koshish ek recursive function likhkar jo pehle khud ko bulaata hai aur doosra print karta hai — function sach mein sahi order mein bulaaya jaata hai, par numbers screen par bilkul ulte order mein dikhte hain jo iraada tha: 1, 2, 3, 4, 5.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A group of five people climbing down a ladder one at a time to fetch something from the bottom, where each person shouts their own name either the INSTANT they start climbing down, or only once they have climbed back UP and are standing at the top again — versus assuming shouting happens at the same moment regardless of which of these two choices was made.** If each person shouts their name the instant they begin climbing down, the shouts happen in the order people started descending — first the person who started first, and so on — since shouting happens immediately, before any climbing back up occurs at all. If each person instead waits and shouts only after they have gone all the way down, done what they needed to do, and climbed all the way back up to stand at the top again, the shouts happen in the OPPOSITE order: the last person to start climbing down is the first to finish their round trip and shout, while the very first person to start climbing down, having gone the deepest, takes the longest to return and is the last to shout. This course\'s Module 5 lesson on stacks already established that the call stack itself behaves in exactly this last-in-first-out way — the most recently started (deepest) call is always the first to finish and return. Placing a recursive function\'s own action BEFORE its recursive call is the shout-on-the-way-down approach: actions happen in the order calls are made. Placing the action AFTER the recursive call is the shout-on-the-way-back-up approach: actions happen in the exact reverse order, as each call finishes and is popped off the stack.',
      hi: '**Paanch logon ka ek group ek seedhi se ek-ek karke neeche utarta hai kuch neeche se laane ke liye, jahan har vyakti apna naam ya toh neeche utarna shuru karte hi TURANT chillaata hai, ya sirf jab wo wapas OOPAR chad chuka hai aur phir se top par khada hai — versus ye maan lena ki chillaana usi pal hota hai chahe in do chunaavon mein se koi bhi kiya gaya ho.** Agar har vyakti neeche utarna shuru karte hi apna naam chillaata hai, chillaana us order mein hota hai jismein log neeche utarna shuru karte hain — pehle wo vyakti jisne pehle shuru kiya, waghaira — kyunki chillaana turant hota hai, wapas oopar chadhne se pehle bhi. Agar har vyakti iske bajaye wait karta hai aur sirf tab chillaata hai jab wo poori tarah neeche jaa chuka hai, jo zaroori tha wo kar chuka hai, aur poori tarah wapas oopar chad chuka hai phir se top par khade hone ke liye, chillaana ULTE order mein hota hai: neeche utarna shuru karne wala aakhri vyakti apni round trip poori karne aur chillaane wala pehla hai, jabki neeche utarna shuru karne wala bilkul pehla vyakti, sabse gehre jaake, wapas aane mein sabse zyaada samay leta hai aur chillaane wala aakhri hai. Is course ka Module 5 ka stacks wala lesson pehle hi sthaapit kar chuka hai ki call stack khud bilkul isi last-in-first-out tarike se vyavahaar karta hai — sabse haaliya shuru hui (sabse gehri) call hamesha pehle khatam hoti hai aur return hoti hai. Ek recursive function ke apne action ko iski recursive call SE PEHLE rakhna neeche-jaate-waqt-chillaao approach hai: actions us order mein hote hain jismein calls ki jaati hain. Action ko recursive call KE BAAD rakhna wapas-oopar-aate-waqt-chillaao approach hai: actions bilkul ulte order mein hote hain, jaise har call khatam hoti hai aur stack se pop hoti hai.',
    },

    simple: `**Start broken.** Trying to print descending order, printing AFTER the recursive call:

\`\`\`js
function printDown(n) {
  if (n === 0) return; // base case
  printDown(n - 1);    // recurse FIRST
  console.log(n);      // print SECOND
}

printDown(5);
\`\`\`

The intent is to print \`5, 4, 3, 2, 1\`. What actually prints is \`1, 2, 3, 4, 5\` — the exact opposite order. The recursive call happens first in the code, but because the \`console.log(n)\` line comes AFTER it, that line does not run until \`printDown(n - 1)\` has fully finished — which means it does not run until the recursion has gone all the way down to the base case AND started unwinding back up. This course\'s Module 5 lesson on stacks established that the call stack is last-in-first-out: \`printDown(1)\` is the last call made (deepest) but the FIRST to finish and return, so its \`console.log(1)\` runs first, followed by \`printDown(2)\`\'s, and so on — producing ascending order, not the descending order the code visually appears to request.

**The fix: print BEFORE the recursive call, so it runs during the descent**

\`\`\`js
function printDown(n) {
  if (n === 0) return;
  console.log(n);      // print FIRST, during the descent
  printDown(n - 1);    // recurse SECOND
}

printDown(5);
\`\`\`

\`\`\`ts
function printDown(n: number): void {
  if (n === 0) return;
  console.log(n);
  printDown(n - 1);
}
\`\`\`

Moving \`console.log(n)\` before the recursive call means it runs the instant \`printDown\` is entered, before anything about the recursive call has happened yet — \`printDown(5)\` prints \`5\` immediately, then calls \`printDown(4)\`, which immediately prints \`4\`, and so on, all the way down. This produces \`5, 4, 3, 2, 1\`, matching the calls\' own top-down order, since nothing here depends on the stack unwinding at all — every print happens during the descent, before any function has returned.`,

    simpleHi: `**Toote hue se shuru.** Descending order print karne ki koshish, recursive call KE BAAD print karte hue:

\`\`\`js
function printDown(n) {
  if (n === 0) return; // base case
  printDown(n - 1);    // pehle recurse karo
  console.log(n);      // doosra print karo
}

printDown(5);
\`\`\`

Iraada \`5, 4, 3, 2, 1\` print karna hai. Asal mein jo print hota hai wo \`1, 2, 3, 4, 5\` hai — bilkul ulta order. Recursive call code mein pehle hoti hai, par kyunki \`console.log(n)\` line iske BAAD aati hai, wo line tab tak nahi chalti jab tak \`printDown(n - 1)\` poori tarah khatam nahi ho jaata — matlab ye tab tak nahi chalti jab tak recursion bilkul base case tak neeche nahi jaati AUR wapas oopar unwind karna shuru nahi karti. Is course ka Module 5 ka stacks wala lesson sthaapit karta hai ki call stack last-in-first-out hai: \`printDown(1)\` aakhri call hai jo ki gayi (sabse gehri) par pehli hai jo khatam hoti hai aur return hoti hai, isliye iska \`console.log(1)\` pehle chalta hai, uske baad \`printDown(2)\` ka, waghaira — ascending order banaate hue, us descending order ke nahi jo code visually maangta hua dikhta hai.

**Fix: recursive call SE PEHLE print karo, taaki ye descent ke dauraan chale**

\`\`\`js
function printDown(n) {
  if (n === 0) return;
  console.log(n);      // pehle print karo, descent ke dauraan
  printDown(n - 1);    // doosra recurse karo
}

printDown(5);
\`\`\`

\`\`\`ts
function printDown(n: number): void {
  if (n === 0) return;
  console.log(n);
  printDown(n - 1);
}
\`\`\`

\`console.log(n)\` ko recursive call se pehle move karna matlab hai ye us pal chalta hai jab \`printDown\` mein pravesh kiya jaata hai, recursive call ke baare mein kuch bhi abhi hone se pehle — \`printDown(5)\` turant \`5\` print karta hai, phir \`printDown(4)\` ko bulaata hai, jo turant \`4\` print karta hai, waghaira, bilkul neeche tak. Ye \`5, 4, 3, 2, 1\` banaata hai, calls ke apne top-down order se mel khaate hue, kyunki yahaan kuch bhi stack unwinding par bilkul nirbhar nahi karta — har print descent ke dauraan hota hai, kisi bhi function ke return hone se pehle.`,

    content: `## The general rule: before the call runs top-down, after the call runs bottom-up

\`\`\`
function f(n) {
  if (base case) return;
  // CODE HERE runs top-down: f(5)'s code, then f(4)'s, then f(3)'s...
  f(n - 1);
  // CODE HERE runs bottom-up: f(1)'s code, then f(2)'s, then f(3)'s...
}
\`\`\`

Any code placed BEFORE the recursive call executes in the same order the calls themselves are made — \`f(5)\`\'s own pre-call code runs, then \`f(5)\` calls \`f(4)\`, whose pre-call code runs, and so on, moving forward through the recursion exactly as the calls happen. Any code placed AFTER the recursive call does not run until that specific call has fully returned — which means it executes in the OPPOSITE order, since the deepest call (closest to the base case) is the first one to finish and return, following the same last-in-first-out behavior this course\'s Module 5 lesson on stacks established for the call stack itself. This single rule explains both this lesson\'s broken example (printing after the call reverses the order) and its fix (printing before the call preserves it), and it generalizes to any recursive function, not just ones that print numbers.

## Base cases: what happens if one is missing or wrong

\`\`\`js
function printDown(n) {
  // MISSING base case — recursion never stops
  console.log(n);
  printDown(n - 1); // n keeps decreasing: 5, 4, 3, 2, 1, 0, -1, -2, ... forever
}
\`\`\`

This course\'s Module 1 lesson on analyzing recursion already established that each recursive call adds a new frame to the call stack, and that frame remains until the call returns. Without a base case — a condition that stops the recursion from calling itself again — a recursive function never returns at all, meaning stack frames keep accumulating without ever being removed. This eventually exhausts the call stack\'s own finite capacity and crashes with a stack overflow error, the exact same failure mode this course\'s Module 4 lesson on reversing a linked list warned about for a sufficiently long list processed recursively. A base case is not an optional safety check to add later; it is the specific condition that guarantees the unwinding phase this lesson\'s ordering rule depends on will actually begin.

## Multiple recursive calls: the same ordering rule, applied twice

\`\`\`js
function printBothOrders(n) {
  if (n === 0) return;
  console.log("down:", n);      // runs top-down
  printBothOrders(n - 1);
  console.log("up:", n);        // runs bottom-up
}
printBothOrders(3);
// down: 3, down: 2, down: 1, up: 1, up: 2, up: 3
\`\`\`

\`\`\`ts
function printBothOrders(n: number): void {
  if (n === 0) return;
  console.log("down:", n);
  printBothOrders(n - 1);
  console.log("up:", n);
}
\`\`\`

A single recursive function can genuinely use both orderings at once, simply by placing code both before AND after the recursive call — the "down" prints happen during the descent, in call order, and the "up" prints happen during the unwind, in reverse order, with the base case marking the turnaround point between the two. Recognizing this dual structure is directly useful for this course\'s next lesson on backtracking, where "before the call" commonly represents making a choice, and "after the call" commonly represents undoing that same choice once every possibility building on it has been explored.`,

    contentHi: `## General rule: call se pehle top-down chalta hai, call ke baad bottom-up chalta hai

\`\`\`
function f(n) {
  if (base case) return;
  // YE CODE top-down chalta hai: pehle f(5) ka code, phir f(4) ka, phir f(3) ka...
  f(n - 1);
  // YE CODE bottom-up chalta hai: pehle f(1) ka code, phir f(2) ka, phir f(3) ka...
}
\`\`\`

Recursive call SE PEHLE rakha gaya koi bhi code usi order mein execute hota hai jis order mein calls khud ki jaati hain — \`f(5)\` ka apna pre-call code chalta hai, phir \`f(5)\` \`f(4)\` ko bulaata hai, jiska pre-call code chalta hai, waghaira, recursion ke through aage badhte hue bilkul jaise calls hoti hain. Recursive call KE BAAD rakha gaya koi bhi code tab tak nahi chalta jab tak us khaas call poori tarah return nahi ho jaati — matlab ye ULTE order mein execute hota hai, kyunki sabse gehri call (base case ke sabse kareeb) pehli hai jo khatam hoti hai aur return hoti hai, us hi last-in-first-out vyavahaar ka palan karte hue jise is course ke Module 5 ke stacks lesson ne call stack khud ke liye sthaapit kiya. Ye akela rule dono is lesson ke toote example ko samjhaata hai (call ke baad print karna order ulta karta hai) aur iske fix ko (call se pehle print karna ise preserve karta hai), aur ye kisi bhi recursive function tak generalize hota hai, sirf numbers print karne waale tak nahi.

## Base cases: agar ek gaayab ya galat hai toh kya hota hai

\`\`\`js
function printDown(n) {
  // GAAYAB base case — recursion kabhi rukti nahi
  console.log(n);
  printDown(n - 1); // n ghatta rehta hai: 5, 4, 3, 2, 1, 0, -1, -2, ... hamesha ke liye
}
\`\`\`

Is course ka Module 1 ka recursion ka vishleshan karne wala lesson pehle hi sthaapit kar chuka hai ki har recursive call call stack mein ek naya frame jodta hai, aur wo frame tab tak rehta hai jab tak call return nahi hoti. Ek base case ke bina — ek condition jo recursion ko khud ko dobara bulaane se rokta hai — ek recursive function kabhi bilkul return nahi hoti, matlab stack frames kabhi hataaye bina jama hote rehte hain. Ye aakhirkaar call stack ki apni finite capacity khatam karta hai aur ek stack overflow error ke saath crash hota hai, bilkul wahi failure mode jise is course ka Module 4 ka linked list reverse karne wala lesson ek kaafi lambi list ke liye chetaavni deta hai jo recursively process ki jaati hai. Ek base case ek vaikalpik suraksha check nahi hai jise baad mein jodna hai; ye wo khaas condition hai jo guarantee karti hai ki unwinding phase jispar is lesson ka ordering rule nirbhar karta hai asal mein shuru hoga.

## Kayi recursive calls: wahi ordering rule, do baar lagu kiya gaya

\`\`\`js
function printBothOrders(n) {
  if (n === 0) return;
  console.log("down:", n);      // top-down chalta hai
  printBothOrders(n - 1);
  console.log("up:", n);        // bottom-up chalta hai
}
printBothOrders(3);
// down: 3, down: 2, down: 1, up: 1, up: 2, up: 3
\`\`\`

\`\`\`ts
function printBothOrders(n: number): void {
  if (n === 0) return;
  console.log("down:", n);
  printBothOrders(n - 1);
  console.log("up:", n);
}
\`\`\`

Ek akela recursive function sach mein ek saath dono orderings istemal kar sakta hai, bas recursive call se PEHLE AUR baad dono code rakhkar — "down" prints descent ke dauraan hote hain, call order mein, aur "up" prints unwind ke dauraan hote hain, ulte order mein, base case dono ke beech mod point darsaate hue. Is dual structure ko pehchaanna is course ke agle backtracking lesson ke liye seedhe upyogi hai, jahan "call se pehle" aksar ek chunaav karna darsata hai, aur "call ke baad" aksar us wahi chunaav ko wapas lena darsata hai ek baar ispar banaayi gayi har sambhaavna explore ho chuki ho.`,

    examples: [
      {
        title: 'Broken: printing after the call reverses the intended order',
        titleHi: 'Toota: call ke baad print karna iraada kiya gaya order ulta karta hai',
        code: `function printDown(n) {
  if (n === 0) return;
  printDown(n - 1);
  console.log(n); // AFTER — runs during unwind
}`,
        codeJs: `function printDown(n) {
  if (n === 0) return;
  printDown(n - 1);
  console.log(n);
}
printDown(5);
// prints: 1, 2, 3, 4, 5 — ascending, not the intended descending`,
        codeTs: `function printDown(n: number): void {
  if (n === 0) return;
  printDown(n - 1);
  console.log(n);
}
printDown(5);
// fully valid TypeScript — the reversed order is architectural`,
        output: `1
2
3
4
5`,
        explain: 'console.log runs only after printDown(n - 1) fully returns, so the deepest call (n=1) logs first, following the call stack\'s own last-in-first-out order.',
        explainHi: '\`console.log\` sirf tab chalta hai jab \`printDown(n - 1)\` poori tarah return ho jaata hai, isliye sabse gehri call (\`n=1\`) pehle log karti hai, call stack ke apne last-in-first-out order ka palan karte hue.',
      },
      {
        title: 'Fixed: printing before the call preserves the intended order',
        titleHi: 'Theek: call se pehle print karna iraada kiya gaya order preserve karta hai',
        code: `function printDown(n) {
  if (n === 0) return;
  console.log(n); // BEFORE — runs during descent
  printDown(n - 1);
}`,
        codeJs: `function printDown(n) {
  if (n === 0) return;
  console.log(n);
  printDown(n - 1);
}
printDown(5);
// prints: 5, 4, 3, 2, 1 — matching the intended descending order`,
        codeTs: `function printDown(n: number): void {
  if (n === 0) return;
  console.log(n);
  printDown(n - 1);
}
printDown(5);`,
        outputJs: `5
4
3
2
1`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'console.log runs the instant each call begins, before any recursive call or unwinding happens, so the order matches the order calls are made.',
        explainHi: '\`console.log\` us pal chalta hai jab har call shuru hoti hai, kisi bhi recursive call ya unwinding hone se pehle, isliye order us order se mel khaata hai jismein calls ki jaati hain.',
      },
      {
        title: 'Using both orderings in one function',
        titleHi: 'Ek function mein dono orderings istemal karna',
        code: `console.log("down:", n); // top-down
printBothOrders(n - 1);
console.log("up:", n);   // bottom-up`,
        codeJs: `function printBothOrders(n) {
  if (n === 0) return;
  console.log("down:", n);
  printBothOrders(n - 1);
  console.log("up:", n);
}
printBothOrders(3);`,
        codeTs: `function printBothOrders(n: number): void {
  if (n === 0) return;
  console.log("down:", n);
  printBothOrders(n - 1);
  console.log("up:", n);
}
printBothOrders(3);`,
        outputJs: `down: 3
down: 2
down: 1
up: 1
up: 2
up: 3`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The "down" logs follow call order (top-down); the "up" logs follow return order (bottom-up), meeting at the base case in the middle.',
        explainHi: '"down" logs call order follow karte hain (top-down); "up" logs return order follow karte hain (bottom-up), beech mein base case par milte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `function printDown(n) {
  if (n === 0) return;
  printDown(n - 1); // recursing before printing
  console.log(n);
}
// intended descending order, produces ascending instead`,
        right: `function printDown(n) {
  if (n === 0) return;
  console.log(n); // printing before recursing
  printDown(n - 1);
}`,
        why: 'Code placed after the recursive call runs during the unwind, in reverse order — placing it before the call instead runs it during the descent, in call order.',
        whyHi: 'Recursive call ke baad rakha gaya code unwind ke dauraan chalta hai, ulte order mein — ise call se pehle rakhna iske bajaye ise descent ke dauraan chalaata hai, call order mein.',
      },
      {
        wrong: `function printDown(n) {
  console.log(n);
  printDown(n - 1); // no base case — never stops
}`,
        right: `function printDown(n) {
  if (n === 0) return; // base case
  console.log(n);
  printDown(n - 1);
}`,
        why: 'Without a base case, recursive calls never stop being made, accumulating call-stack frames indefinitely until the stack overflows and the program crashes.',
        whyHi: 'Ek base case ke bina, recursive calls kabhi hona band nahi karti, call-stack frames ko hamesha ke liye jama karte hue jab tak stack overflow na ho jaaye aur program crash na ho jaaye.',
      },
      {
        wrong: `// assuming code before and after a recursive call always run in
        // the same order regardless of where they are placed`,
        right: `// explicitly tracing through a small example, following this
        // course's Module 1 tracing habit, to confirm which order
        // specific code actually runs in`,
        why: 'Assuming ordering without tracing is a common source of subtle recursion bugs — explicitly tracing a small example directly confirms which lines run before versus after the unwind.',
        whyHi: 'Bina trace kiye ordering maan lena sookshm recursion bugs ka ek aam srot hai — ek chhote example ko explicitly trace karna seedhe confirm karta hai ki kaunsi lines unwind se pehle versus baad chalti hain.',
      },
    ],

    realWorld: [
      {
        en: '**Pre-order versus post-order processing is a genuinely standard distinction across recursive algorithms, appearing explicitly in this course\'s later Trees module\'s traversal orders.**',
        hi: '**Pre-order versus post-order processing recursive algorithms ke aar-paar ek sach mein standard farak hai, is course ke baad ke Trees module ke traversal orders mein explicitly dikhta hai.**',
      },
      {
        en: '**"Trace through this recursive function and predict its output" is a genuinely common technical interview question**, specifically testing whether a candidate understands call-stack ordering rather than just being able to write recursive code.',
        hi: '**"Is recursive function ko trace karo aur iska output predict karo" ek sach mein aam technical interview sawaal hai**, khaas taur par ye test karte hue ki kya ek candidate call-stack ordering samajhta hai sirf recursive code likh sakna nahi.',
      },
      {
        en: '**Stack overflow errors from a missing or incorrect base case are one of the single most common real bugs in recursive code**, appearing across every programming language that supports recursion.',
        hi: '**Ek gaayab ya galat base case se stack overflow errors recursive code mein sabse aam asli bugs mein se ek hain**, har us programming language mein dikhte hain jo recursion support karti hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does code placed after a recursive call execute in the opposite order from code placed before it, and how does this connect to the call stack\'s own behavior?',
        qHi: 'Ek recursive call ke baad rakha gaya code iske pehle rakhe gaye code se ulte order mein kyun execute hota hai, aur ye call stack ke apne vyavahaar se kaise judta hai?',
        a: 'Code placed before a recursive call is, by definition, executed as the very first thing that happens when a given call to the function begins running — before that call has done anything else, including making its own recursive call, this code has already run. Since each successive recursive call is made in a specific sequence (the call for n, then the call for n-1, then n-2, and so on), and each one\'s own before-the-call code runs immediately upon that specific call beginning, these before-the-call executions naturally happen in the same order the calls themselves are made — descending from n down toward the base case. Code placed after the recursive call is fundamentally different: it cannot execute until the recursive call it follows has entirely finished and returned a result, which means it is inherently tied to the RETURN of that specific call rather than to the call being initially made. Because the call stack behaves in a strictly last-in-first-out manner, as this course\'s Module 5 lesson on stacks established, the deepest call made (the one closest to, or at, the base case) is unavoidably the first one to finish and return, since every call sitting above it on the stack is, by construction, still waiting for it to complete before they themselves can finish. This means the after-the-call code belonging to the deepest call executes first, followed by the after-the-call code belonging to the next-deepest call as it, too, finishes and returns, and so on back up toward the original, outermost call — an order that is the exact reverse of the order in which the calls were originally made. The rule "before runs top-down, after runs bottom-up" is therefore not a separate, memorized fact about recursion specifically, but a direct consequence of how the call stack itself, a genuine last-in-first-out structure, necessarily unwinds.',
        aHi: 'Ek recursive call se pehle rakha gaya code, paribhaasha se, bilkul pehli cheez ki tarah execute hota hai jo hoti hai jab function ki ek di gayi call chalna shuru karti hai — us call ke kuch aur karne se pehle, apni khud ki recursive call karne sameet, ye code pehle hi chal chuka hota hai. Kyunki har lagaataar recursive call ek khaas sequence mein ki jaati hai (\`n\` ke liye call, phir \`n-1\` ke liye call, phir \`n-2\`, waghaira), aur har ek ka apna call-se-pehle-wala code us khaas call ke shuru hote hi chalta hai, ye call-se-pehle-wale executions naturally usi order mein hote hain jismein calls khud ki jaati hain — \`n\` se base case ki taraf ghatte hue. Recursive call ke baad rakha gaya code buniyaadi roop se alag hai: ye tab tak execute nahi ho sakta jab tak jis recursive call ka ye palan karta hai wo poori tarah khatam nahi ho jaati aur ek nateeja return nahi karti, matlab ye aandarik roop se us khaas call ke RETURN se juda hai us call ke shuru mein hone se nahi. Kyunki call stack sakht last-in-first-out tarike se vyavahaar karta hai, jaisa is course ke Module 5 ke stacks lesson ne sthaapit kiya, sabse gehri ki gayi call (wo jo base case ke sabse kareeb hai, ya usme hai) bachne-yogya-na roop se pehli hai jo khatam hoti hai aur return hoti hai, kyunki iske oopar stack par baithi har call, nirmaan se, abhi bhi iske poora hone ka wait kar rahi hai isse pehle ki wo khud khatam ho sakein. Iska matlab hai sabse gehri call ka call-ke-baad-wala code pehle execute hota hai, uske baad agli-sabse-gehri call ka call-ke-baad-wala code jaise ye bhi khatam hoti hai aur return hoti hai, waghaira wapas oopar asli, sabse bahari call ki taraf — ek order jo bilkul us order ka ulta hai jismein calls asal mein ki gayi thi. "Pehle top-down chalta hai, baad bottom-up chalta hai" rule isliye recursion ke baare mein ek alag, yaad kiya gaya tathya nahi hai khaas taur par, balki is baat ka ek seedha parinaam hai ki call stack khud, ek asli last-in-first-out structure, zaroori roop se kaise unwind hota hai.',
      },
      {
        q: 'Why does a missing base case cause a stack overflow specifically, rather than some other kind of error, and why is it treated as a critical requirement rather than a nice-to-have safety check?',
        qHi: 'Ek gaayab base case khaas taur par ek stack overflow ka kaaran kyun banta hai, kisi doosri tarah ki error ka nahi, aur ise ek critical zaroorat ki tarah kyun treat kiya jaata hai ek achha-hona-chahiye safety check ke bajaye?',
        a: 'A base case\'s specific job is to provide a condition under which a recursive function stops calling itself and simply returns, rather than making yet another recursive call. Without this condition present and correctly reachable, every single call to the function unconditionally makes another recursive call before it can return, meaning no call in the entire chain ever actually finishes — each one remains permanently waiting for the call it made to complete, which itself is waiting for the next one, and so on indefinitely. This course\'s Module 1 lesson on analyzing recursion complexity, and this course\'s Module 5 lesson on stacks, both established that every function call, including every recursive call, occupies its own frame on the call stack for as long as it remains active and has not yet returned. Since no call in this scenario ever returns, no frame is ever removed from the stack, meaning frames accumulate continuously as new recursive calls are made, one after another, without any corresponding removal ever occurring to offset them. The call stack, like any real structure in a real computing environment, has a finite maximum capacity, and continuously adding frames without ever removing any inevitably exhausts that capacity — at which point the runtime environment detects that no further frames can be added and raises a stack overflow error specifically, rather than some other kind of failure, because the actual resource that has been exhausted is the call stack\'s own limited space, not memory in some more general sense or any other system resource. This is precisely why a base case is treated as an absolute requirement rather than an optional refinement: without one, a recursive function\'s failure mode is not merely producing a wrong answer, which might be caught by a correctness test, but crashing the entire program outright the moment it is invoked with real, non-trivial input.',
        aHi: 'Ek base case ka khaas kaam ek condition pradaan karna hai jiske neeche ek recursive function khud ko bulaana band karta hai aur simply return karta hai, ek aur recursive call karne ke bajaye. Is condition ke maujood aur sahi tarike se pahunchne-yogya hone ke bina, function ki har akeli call bina-shart ek aur recursive call karti hai isse pehle ki ye return kar sake, matlab poori chain mein koi bhi call asal mein kabhi khatam nahi hoti — har ek hamesha ke liye us call ke poora hone ka wait karti reh jaati hai jo isne ki, jo khud agli ke poora hone ka wait kar rahi hai, waghaira hamesha ke liye. Is course ka Module 1 ka recursion complexity ka vishleshan karne wala lesson, aur is course ka Module 5 ka stacks wala lesson, dono sthaapit karte hain ki har function call, har recursive call sameet, call stack par apna khud ka frame kabza karta hai jab tak ye active rehta hai aur abhi tak return nahi hua. Kyunki is scenario mein koi bhi call kabhi return nahi hoti, koi bhi frame kabhi stack se hataaya nahi jaata, matlab frames lagaataar jama hote hain jaise nayi recursive calls ki jaati hain, ek ke baad ek, unhe offset karne ke liye koi mel khaati removal kabhi hue bina. Call stack, kisi bhi asli computing environment mein kisi bhi asli structure ki tarah, ek finite maximum capacity rakhta hai, aur kisi ko bhi hataaye bina lagaataar frames jodna anivaarya roop se us capacity ko khatam karta hai — us bindu par runtime environment detect karta hai ki koi aur frames joda nahi jaa sakta aur khaas taur par ek stack overflow error uthaata hai, kisi aur tarah ki failure ke bajaye, kyunki jo asli resource khatam hui hai wo call stack ki apni seemit jagah hai, kisi zyaada general arth mein memory ya koi doosra system resource nahi. Yahi bilkul wajah hai ki ek base case ko ek bilkul zaroorat ki tarah treat kiya jaata hai ek vaikalpik sudhaar ke bajaye: ek ke bina, ek recursive function ka failure mode sirf ek galat jawaab banaana nahi hai, jise ek sahihata test pakad sakta hai, balki poore program ko bilkul crash karna hai jis pal ise asli, non-trivial input ke saath bulaaya jaata hai.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (print-after-call) and fixed (print-before-call) printDown functions from this lesson. Trace through printDown(3) by hand for both versions, writing down the exact print order before running the code.',
        taskHi: 'Is lesson ka toota (call-ke-baad-print) aur theek (call-se-pehle-print) \`printDown\` functions dono banao. Dono versions ke liye \`printDown(3)\` ko haath se trace karo, bilkul print order likhte hue code chalaane se pehle.',
        hint: 'This is the same tracing habit this course\'s Module 1 problem-solving-framework lesson established — write down which line runs at each step, in order, before checking against the actual output.',
        hintHi: 'Ye wahi tracing aadat hai jise is course ke Module 1 problem-solving-framework lesson ne sthaapit kiya — likho ki har kadam par kaunsi line chalti hai, order mein, asli output ke khilaaf check karne se pehle.',
      },
      {
        task: 'Build printBothOrders from this lesson\'s third example. Predict its full output for n = 4 by hand before running the code, then confirm your prediction.',
        taskHi: 'Is lesson ke teesre example se \`printBothOrders\` banao. Code chalaane se pehle \`n = 4\` ke liye iska poora output haath se predict karo, phir apni prediction confirm karo.',
        hint: 'Write out the "down" logs first, in order, then the "up" logs in reverse order, then combine them in the sequence they would actually be printed.',
        hintHi: '"down" logs pehle likho, order mein, phir "up" logs ulte order mein, phir unhe us sequence mein combine karo jismein wo asal mein print honge.',
      },
      {
        task: 'Deliberately remove the base case from printDown and run it (with a safeguard like a maximum call count logged, or run it in an environment you can safely interrupt). Observe the actual stack overflow error message your environment produces.',
        taskHi: '\`printDown\` se jaan-boojhkar base case hataao aur ise chalaao (ek safeguard ke saath jaisa ek maximum call count log kiya gaya, ya ise ek aise environment mein chalaao jise tum surakshit roop se interrupt kar sako). Apne environment dwara banaayi gayi asli stack overflow error message dekho.',
        hint: 'Node.js and browser JavaScript consoles both report a specific "Maximum call stack size exceeded" style error — read it carefully to connect it to this lesson\'s explanation.',
        hintHi: 'Node.js aur browser JavaScript consoles dono ek khaas "Maximum call stack size exceeded" style error report karte hain — ise dhyaan se padho ise is lesson ke spashteekaran se jodne ke liye.',
      },
    ],

    keyTakeaways: [
      'Code placed before a recursive call runs in the same order the calls are made (top-down); code placed after the call runs in the exact reverse order, during the unwind (bottom-up).',
      'This ordering rule is a direct consequence of the call stack\'s own last-in-first-out behavior, already established in this course\'s Module 5 lesson on stacks — the deepest call is always the first to finish and return.',
      'A missing or unreachable base case means no call in the recursion ever returns, causing call-stack frames to accumulate indefinitely until the stack\'s finite capacity is exhausted and the program crashes.',
      'A single recursive function can use both orderings simultaneously by placing code both before and after the recursive call, with the base case marking the turnaround point.',
      'Tracing through a small, concrete example by hand — the same habit this course\'s Module 1 established — is the reliable way to confirm which order specific code actually executes in, rather than assuming.',
      'This lesson\'s before/after distinction previews this course\'s next lesson on backtracking, where code before the call commonly makes a choice and code after the call commonly undoes it.',
    ],
    keyTakeawaysHi: [
      'Ek recursive call se pehle rakha gaya code usi order mein chalta hai jismein calls ki jaati hain (top-down); call ke baad rakha gaya code bilkul ulte order mein chalta hai, unwind ke dauraan (bottom-up).',
      'Ye ordering rule call stack ke apne last-in-first-out vyavahaar ka ek seedha parinaam hai, jo is course ke Module 5 ke stacks lesson mein pehle hi sthaapit ki gayi — sabse gehri call hamesha pehle khatam hoti hai aur return hoti hai.',
      'Ek gaayab ya na-pahunche-yogya base case ka matlab hai recursion mein koi bhi call kabhi return nahi hoti, call-stack frames ko hamesha ke liye jama karte hue jab tak stack ki finite capacity khatam na ho jaaye aur program crash na ho jaaye.',
      'Ek akela recursive function dono orderings ek saath istemal kar sakta hai recursive call se pehle aur baad dono code rakhkar, base case mod point darsaate hue.',
      'Ek chhote, thos example ko haath se trace karna — wahi aadat jise is course ke Module 1 ne sthaapit kiya — bharosemand tarika hai ye confirm karne ka ki khaas code asal mein kis order mein execute hota hai, maan lene ke bajaye.',
      'Is lesson ka before/after farak is course ke agle backtracking lesson ko preview karta hai, jahan call se pehle ka code aksar ek chunaav karta hai aur call ke baad ka code aksar ise wapas leta hai.',
    ],
  },
];
