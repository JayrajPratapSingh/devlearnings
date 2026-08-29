/**
 * DSA Complete Course — Module 5: Stacks & Queues, lesson 3.
 *
 * The monotonic stack pattern, using "next greater element" as the
 * running example. Broken example: a nested-loop brute force checking,
 * for every element, every element to its right until a larger one is
 * found — genuinely correct, but O(n^2), redoing comparisons that a
 * smarter approach never needs to repeat. Fixed with a stack that is
 * kept deliberately monotonic (its values always in decreasing order
 * from bottom to top): when a new element arrives that is larger than
 * the stack's current top, that top element has just found its answer
 * (the new element IS its next greater element), so it is popped and
 * resolved; this repeats until the stack's top is no longer smaller
 * than the new element, at which point the new element's own index is
 * pushed. Each element is pushed and popped at most once across the
 * entire run, giving O(n) total despite the loop-within-a-loop
 * appearance — the same "bounded total movement" reasoning this
 * course's Module 2 sliding-window lesson already established.
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

export const DSA_MODULE_5_PART3: CourseLesson[] = [
  {
    slug: 'monotonic-stack-pattern',
    title: 'The Monotonic Stack Pattern',
    titleHi: 'Monotonic Stack Pattern',
    description: 'Finding, for every building in a skyline, the next taller building to its right by checking every building against every other building to its right — genuinely correct, but redoing the same comparisons a stack that simply remembers "which buildings are still waiting for a taller neighbor" never needs to repeat.',
    descriptionHi: 'Ek skyline mein har building ke liye, iske daaye taraf agli lambi building dhoondhna har building ko iske daaye taraf har doosri building ke khilaaf check karke — sach mein sahi, par wahi comparisons dobara karte hue jo ek stack jo bas ye yaad rakhta hai "kaunsi buildings abhi bhi ek lambe padosi ka wait kar rahi hain" kabhi dohraane ki zaroorat nahi hoti.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A row of people of different heights standing in line, where each person wants to know the height of the next person taller than them somewhere to their right — found by having each person individually turn and look past everyone to their right, one at a time, until a taller person is spotted — versus a single line of people who have not yet found a taller neighbor, where a new, sufficiently tall arrival simply announces their own height once, and every shorter person still waiting in that line immediately gets their answer and steps out, all at once.** The individual-turning approach genuinely finds the correct answer for every person, but each person\'s own search can require looking past a great many people, and different people\'s searches redundantly look past many of the same people over and over. The single-waiting-line approach works completely differently: people who have not yet found a taller neighbor stand in a specific line, arranged so that this line is always ordered from tallest at the back to shortest at the front, waiting; when a new, sufficiently tall person walks up, every shorter person currently in the front of that waiting line immediately gets their answer — this new arrival is precisely the taller neighbor they were waiting for — and steps out of the line entirely, needing no further searching at all, while the new arrival then joins the back of the line to wait for their own eventual taller neighbor. A nested loop checking every element against every element to its right is the individual-turning approach: correct, but O(n²), redoing overlapping searches. A monotonic stack, kept deliberately in decreasing order, resolving every shorter element the instant a taller one arrives, is the single-waiting-line approach: each person joins and leaves this line at most once, giving a genuine O(n) total.',
      hi: '**Alag-alag heights ke logon ki ek row line mein khadi, jahan har vyakti apne se lambe agle vyakti ki height jaanna chahta hai unke daaye kahin — har vyakti ko individually mudkar aur apne daaye har kisi ke aage dekhkar dhoondha gaya, ek waqt mein ek, jab tak ek lamba vyakti na dikhe — versus logon ki ek akeli line jinhone abhi tak ek lamba padosi nahi dhoondha, jahan ek naya, kaafi lamba aane waala bas ek baar apni height announce karta hai, aur us line mein abhi bhi wait kar rahe har chhote vyakti ko turant apna jawaab milta hai aur wo bahar kadam rakhta hai, sab ek saath.** Individually-turning approach sach mein har vyakti ke liye sahi jawaab dhoondhta hai, par har vyakti ka apna search kayi logon ke aage dekhne ki maang kar sakta hai, aur alag logon ke searches bekaar mein baar-baar usi kayi logon ke aage dekhte hain. Akeli-waiting-line approach poori tarah alag kaam karti hai: log jinhone abhi tak ek lamba padosi nahi dhoondha ek khaas line mein khade hote hain, is tarah arrange kiye gaye ki ye line hamesha peeche se sabse lambe se aage sabse chhote tak ordered hai, wait karte hue; jab ek naya, kaafi lamba vyakti aata hai, us waiting line ke front mein abhi maujood har chhota vyakti turant apna jawaab paata hai — ye naya aane waala bilkul wo lamba padosi hai jiska wo wait kar rahe the — aur poori tarah line se bahar kadam rakhta hai, kisi aur search ki zaroorat bilkul na hote hue, jabki naya aane waala phir apne khud ke aakhirkaar aane waale lambe padosi ka wait karne ke liye line ke peeche jud jaata hai. Ek nested loop jo har element ko iske daaye har element ke khilaaf check karta hai individually-turning approach hai: sahi, par \`O(n²)\`, overlapping searches dobara karte hue. Ek monotonic stack, jaan-boojhkar decreasing order mein rakhi gayi, jo har chhote element ko turant sulajhaati hai jab ek lamba aata hai, akeli-waiting-line approach hai: har vyakti is line mein zyaada se zyaada ek baar judta hai aur chhodta hai, ek asli \`O(n)\` total dete hue.',
    },

    simple: `**Start broken.** A nested loop checking every element against every element to its right:

\`\`\`js
function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  for (let i = 0; i < heights.length; i++) {
    for (let j = i + 1; j < heights.length; j++) {
      if (heights[j] > heights[i]) {
        result[i] = heights[j];
        break;
      }
    }
  }
  return result;
}
\`\`\`

This is genuinely correct — for every position \`i\`, the inner loop scans rightward until a larger value is found. The waste, in exactly the shape this course\'s Module 1 lesson on analyzing loops taught to look for, is the nested loop itself: in the worst case (a strictly decreasing sequence, where no element ever finds a next-greater one), the inner loop runs all the way to the end for every single \`i\`, giving a genuine \`O(n²)\` cost. Different outer iterations\' inner scans also frequently re-examine many of the same elements from scratch.

**The fix: a monotonic stack, resolving every waiting element the instant its answer arrives**

\`\`\`js
function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  const stack = []; // holds INDICES, kept so heights[stack] is always decreasing

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const resolvedIndex = stack.pop(); // this element just found its answer
      result[resolvedIndex] = heights[i];
    }
    stack.push(i); // this element is now waiting for its OWN next-greater element
  }
  return result;
}
\`\`\`

\`\`\`ts
function nextGreaterElement(heights: number[]): number[] {
  const result: number[] = new Array(heights.length).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const resolvedIndex = stack.pop() as number;
      result[resolvedIndex] = heights[i];
    }
    stack.push(i);
  }
  return result;
}
\`\`\`

The stack holds indices of elements still waiting for their own next-greater element, deliberately kept so the HEIGHTS at those indices are always decreasing from bottom to top. When a new element \`heights[i]\` arrives, anything currently on the stack that is SMALLER than \`heights[i]\` has just found its answer — \`heights[i]\` genuinely is that element\'s next-greater element, so it is popped and resolved immediately. This repeats for as long as the stack\'s top remains smaller, keeping the stack\'s decreasing order intact, and \`i\` itself is then pushed, now waiting for its own eventual next-greater element.`,

    simpleHi: `**Toote hue se shuru.** Ek nested loop jo har element ko iske daaye har element ke khilaaf check karta hai:

\`\`\`js
function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  for (let i = 0; i < heights.length; i++) {
    for (let j = i + 1; j < heights.length; j++) {
      if (heights[j] > heights[i]) {
        result[i] = heights[j];
        break;
      }
    }
  }
  return result;
}
\`\`\`

Ye sach mein sahi hai — har position \`i\` ke liye, andar wala loop daaye taraf scan karta hai jab tak ek badi value na mile. Barbaadi, bilkul us shape mein jise is course ke Module 1 ke loops ka vishleshan karne wale lesson ne dhoondhna sikhaaya, nested loop khud hai: sabse bure case mein (ek sakht-decreasing sequence, jahan koi element kabhi agla-bada nahi dhoondhta), andar wala loop har akele \`i\` ke liye bilkul ant tak chalta hai, ek asli \`O(n²)\` keemat dete hue. Alag outer iterations ke andar wale scans bhi aksar usi elements mein se kayi ko shuru se dobara jaanchte hain.

**Fix: ek monotonic stack, har wait kar rahe element ko turant sulajhaate hue jab uska jawaab aata hai**

\`\`\`js
function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  const stack = []; // INDICES rakhta hai, is tarah rakha gaya ki heights[stack] hamesha decreasing hai

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const resolvedIndex = stack.pop(); // is element ko abhi apna jawaab mila
      result[resolvedIndex] = heights[i];
    }
    stack.push(i); // ye element ab apne KHUD ke next-greater element ka wait kar raha hai
  }
  return result;
}
\`\`\`

\`\`\`ts
function nextGreaterElement(heights: number[]): number[] {
  const result: number[] = new Array(heights.length).fill(-1);
  const stack: number[] = [];

  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const resolvedIndex = stack.pop() as number;
      result[resolvedIndex] = heights[i];
    }
    stack.push(i);
  }
  return result;
}
\`\`\`

Stack un elements ki indices rakhta hai jo abhi bhi apne next-greater element ka wait kar rahe hain, jaan-boojhkar is tarah rakha gaya ki un indices par HEIGHTS hamesha neeche se oopar decreasing hain. Jab ek naya element \`heights[i]\` aata hai, stack par abhi jo bhi hai jo \`heights[i]\` se CHHOTA hai use abhi apna jawaab mila hai — \`heights[i]\` sach mein us element ka next-greater element hai, isliye ise turant pop aur resolve kiya jaata hai. Ye tab tak dohraaya jaata hai jab tak stack ka top chhota rehta hai, stack ki decreasing order ko intact rakhte hue, aur \`i\` khud phir push kiya jaata hai, ab apne khud ke aakhirkaar aane waale next-greater element ka wait karte hue.`,

    content: `## Why this achieves O(n) despite the loop-within-a-loop shape

\`\`\`
Every index is pushed onto the stack EXACTLY ONCE (in the outer loop).
Every index can be popped off the stack AT MOST ONCE, ever, across
  the entire run (once popped and resolved, an index never returns).

Total pushes: n.  Total pops: at most n.  Total work: O(n), not O(n²).
\`\`\`

This is exactly the same "bounded total movement" reasoning this course\'s Module 2 lesson on the sliding window technique established for its variable-size window\'s inner \`while\` loop: even though there is a loop nested inside another loop, the inner loop\'s combined work across the ENTIRE run of the outer loop is bounded, not repeated in full on every outer iteration. Here, every single index enters the stack exactly once and can leave it at most once — there is no mechanism by which an index, once resolved and popped, could ever be pushed or popped again. Summing the total number of pushes (exactly \`n\`) and the total number of pops (at most \`n\`) across the ENTIRE function\'s execution, rather than per outer iteration, gives a genuine \`O(n)\` total, despite individual iterations occasionally popping several elements in a row.

## Why the stack must stay monotonic, and what breaks if it does not

\`\`\`
Correct: stack's heights, bottom to top, are always decreasing
         e.g. heights at stack indices: [9, 7, 4, 2]  — valid

If a smaller element were pushed without first resolving everything
above it that is smaller than the NEW element, the decreasing
invariant would be violated, and later comparisons would become
unreliable
\`\`\`

The \`while\` loop\'s specific job is maintaining an invariant — a property the stack is deliberately kept true at all times — that its indices\' corresponding heights are always in decreasing order from bottom to top. This is precisely why every smaller element must be resolved and popped BEFORE the new element is pushed, rather than simply pushing the new element on top regardless: if a taller element (heights[i]) were pushed on top of a shorter one still sitting there unresolved, the stack would no longer be decreasing, and comparisons made on later iterations, which assume this decreasing order to correctly determine what still needs resolving, would produce wrong answers. Maintaining this invariant explicitly, rather than simply hoping it holds, is what makes this pattern\'s correctness genuinely provable rather than coincidental.

## Recognizing when a monotonic stack applies

\`\`\`
Signal: the problem asks, for each element, something about the
        NEXT element satisfying a comparison (greater, smaller, taller,
        shorter) somewhere to its right (or left), across the whole
        sequence, not just its immediate neighbor.
\`\`\`

A monotonic stack\'s signal is specifically this "next element satisfying some comparison, somewhere further along the sequence" shape — "next greater element", "next smaller element", "daily temperatures until a warmer day", "trapping rainwater between buildings" (this course\'s later modules revisit variations of this exact shape). The underlying waste a brute force always exhibits on these problems is the same one this lesson opened with: redundantly re-scanning candidates that a stack, maintained in the right order, would have already resolved and discarded permanently, needing no further comparison ever again.`,

    contentHi: `## Ye loop-ke-andar-loop shape ke bawajood O(n) kaise haasil karta hai

\`\`\`
Har index stack par BILKUL EK BAAR push hota hai (outer loop mein).
Har index stack se ZYAADA SE ZYAADA EK BAAR pop ho sakta hai, kabhi bhi,
  poore run mein (ek baar pop aur resolve hone ke baad, ek index kabhi wapas nahi aata).

Total pushes: n.  Total pops: zyaada se zyaada n.  Total kaam: O(n), O(n²) nahi.
\`\`\`

Ye bilkul wahi "bounded total movement" tark hai jise is course ke Module 2 ke sliding window technique lesson ne apni variable-size window ke andar wale \`while\` loop ke liye sthaapit kiya: chahe ek loop ek doosre ke andar nested hai, andar wale loop ka combined kaam outer loop ke POORE run ke aar-paar bounded hai, har outer iteration par poori tarah dohraaya nahi jaata. Yahaan, har akela index stack mein bilkul ek baar pravesh karta hai aur ise zyaada se zyaada ek baar chhod sakta hai — koi mechanism nahi hai jisse ek index, ek baar resolve aur pop hone ke baad, kabhi dobara push ya pop ho sake. Total pushes ki tadaad (bilkul \`n\`) aur total pops ki tadaad (zyaada se zyaada \`n\`) ko function ke POORE execution ke aar-paar jodna, prati outer iteration nahi, ek asli \`O(n)\` total deta hai, is baat ke bawajood ki alag-alag iterations kabhi-kabhi ek row mein kayi elements pop karte hain.

## Stack ko monotonic kyun rehna chahiye, aur agar aisa na ho toh kya tootta hai

\`\`\`
Sahi: stack ki heights, neeche se oopar, hamesha decreasing hain
         jaisa stack indices par heights: [9, 7, 4, 2]  — valid

Agar ek chhota element push kiya jaata bina pehle uske oopar ki har
cheez ko resolve kiye jo NAYE element se chhoti hai, decreasing
invariant violate ho jaata, aur baad ke comparisons na-bharosemand ban jaate
\`\`\`

\`while\` loop ka khaas kaam ek invariant maintain karna hai — ek property jise stack jaan-boojhkar hamesha sach rakhta hai — ki iski indices ki mel khaati heights hamesha neeche se oopar decreasing order mein hain. Ye bilkul isliye hai ki har chhota element resolve aur pop hona chahiye NAYA element push hone SE PEHLE, is baat se azaad ki naya element sirf top par push kar diya jaaye: agar ek lamba element (\`heights[i]\`) ek chhote ke oopar push kiya jaata jo abhi bhi bina-resolved wahaan baitha hai, stack ab decreasing nahi rahegi, aur baad ki iterations par kiye gaye comparisons, jo sahi tarike se tay karne ke liye is decreasing order ko maante hain ki abhi kya resolve karna hai, galat jawaab banaayenge. Is invariant ko explicitly maintain karna, bas ye ummeed karne ke bajaye ki ye tikta hai, wo hai jo is pattern ki sahihata ko sach mein provable banaata hai samyog se nahi.

## Pehchaanna ki monotonic stack kab lagu hota hai

\`\`\`
Signal: problem poochta hai, har element ke liye, kuch AGLE element ke
        baare mein ek comparison ko poora karte hue (bada, chhota, lamba,
        chhota) kahin iske daaye (ya baaye), poori sequence ke aar-paar,
        sirf iska immediate padosi nahi.
\`\`\`

Ek monotonic stack ka signal khaas taur par ye "agla element kuch comparison poora karta hua, sequence mein kahin aage" shape hai — "next greater element", "next smaller element", "daily temperatures until a warmer day", "trapping rainwater between buildings" (is course ke baad ke modules is bilkul shape ke variations ko dobara dekhte hain). Underlying barbaadi jo ek brute force in problems par hamesha darsata hai wahi hai jise is lesson ne shuru mein khola: bekaar mein candidates ko dobara-scan karna jinhe ek stack, sahi order mein maintained, pehle hi resolve aur hamesha ke liye discard kar chuka hota, kabhi bhi aur comparison ki zaroorat na hote hue.`,

    examples: [
      {
        title: 'Broken: O(n²) nested loop for next greater element',
        titleHi: 'Toota: next greater element ke liye O(n²) nested loop',
        code: `for (let j = i + 1; j < heights.length; j++) {
  if (heights[j] > heights[i]) { result[i] = heights[j]; break; }
}`,
        codeJs: `function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  for (let i = 0; i < heights.length; i++) {
    for (let j = i + 1; j < heights.length; j++) {
      if (heights[j] > heights[i]) {
        result[i] = heights[j];
        break;
      }
    }
  }
  return result;
}
// O(n²) worst case, e.g. a strictly decreasing sequence`,
        codeTs: `function nextGreaterElement(heights: number[]): number[] {
  const result: number[] = new Array(heights.length).fill(-1);
  for (let i = 0; i < heights.length; i++) {
    for (let j = i + 1; j < heights.length; j++) {
      if (heights[j] > heights[i]) {
        result[i] = heights[j];
        break;
      }
    }
  }
  return result;
}
// fully valid TypeScript — the waste is a missed pattern`,
        output: `nextGreaterElement([4, 5, 2, 10]) correctly returns [5, 10, 10, -1],
but the inner loop redundantly re-scans overlapping ranges.`,
        explain: 'Each outer iteration\'s inner scan can redundantly examine many of the same elements a different outer iteration already looked at.',
        explainHi: 'Har outer iteration ka andar wala scan bekaar mein usi kayi elements ko dobara jaanch sakta hai jinhe ek alag outer iteration pehle hi dekh chuki thi.',
      },
      {
        title: 'Fixed: a monotonic stack resolving elements as it goes',
        titleHi: 'Theek: ek monotonic stack jo chalte-chalte elements sulajhaata hai',
        code: `while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
  const resolvedIndex = stack.pop();
  result[resolvedIndex] = heights[i];
}
stack.push(i);`,
        codeJs: `function nextGreaterElement(heights) {
  const result = new Array(heights.length).fill(-1);
  const stack = [];
  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const resolvedIndex = stack.pop();
      result[resolvedIndex] = heights[i];
    }
    stack.push(i);
  }
  return result;
}`,
        codeTs: `function nextGreaterElement(heights: number[]): number[] {
  const result: number[] = new Array(heights.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      const resolvedIndex = stack.pop() as number;
      result[resolvedIndex] = heights[i];
    }
    stack.push(i);
  }
  return result;
}`,
        outputJs: `nextGreaterElement([4, 5, 2, 10]) returns the identical [5, 10, 10, -1],
with every index pushed and popped at most once across the entire run.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each element is resolved and permanently discarded from the stack the instant its answer arrives, with no element ever re-examined once popped.',
        explainHi: 'Har element resolve aur hamesha ke liye stack se discard kiya jaata hai us pal jab iska jawaab aata hai, koi bhi element ek baar pop hone ke baad kabhi dobara jaancha nahi jaata.',
      },
      {
        title: 'Confirming the O(n) bound: counting total pushes and pops',
        titleHi: 'O(n) bound confirm karna: total pushes aur pops ganna',
        code: `let totalPushes = 0, totalPops = 0;
// instrumented version counting operations across the entire run`,
        codeJs: `function nextGreaterElementCounted(heights) {
  const result = new Array(heights.length).fill(-1);
  const stack = [];
  let totalPushes = 0, totalPops = 0;
  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      stack.pop(); totalPops++;
      result[stack.length] = heights[i]; // simplified for illustration
    }
    stack.push(i); totalPushes++;
  }
  console.log({ totalPushes, totalPops, n: heights.length });
  return result;
}`,
        codeTs: `function nextGreaterElementCounted(heights: number[]): number[] {
  const result: number[] = new Array(heights.length).fill(-1);
  const stack: number[] = [];
  let totalPushes = 0, totalPops = 0;
  for (let i = 0; i < heights.length; i++) {
    while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
      stack.pop(); totalPops++;
    }
    stack.push(i); totalPushes++;
  }
  console.log({ totalPushes, totalPops, n: heights.length });
  return result;
}`,
        outputJs: `For any input of length n, totalPushes always equals exactly n,
and totalPops never exceeds n — confirming the O(n) bound directly
rather than taking it on faith.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Instrumenting the code to count its own operations directly confirms the bounded-total-movement reasoning rather than requiring it be taken on faith.',
        explainHi: 'Code ko apne operations ko khud ganne ke liye instrument karna seedhe bounded-total-movement tark ko confirm karta hai ise bharose par lene ki zaroorat ke bajaye.',
      },
    ],

    mistakes: [
      {
        wrong: `for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) { /* check every pair */ }
}
// O(n²), redoing overlapping comparisons`,
        right: `// a monotonic stack, resolving each waiting element the instant
// its answer arrives, giving O(n) total`,
        why: 'A nested loop checking every pair redoes comparisons a monotonic stack never needs to repeat, since each element is resolved and permanently discarded the instant its answer is found.',
        whyHi: 'Ek nested loop jo har jode ko check karta hai un comparisons ko dobara karta hai jinhe ek monotonic stack ko kabhi dohraane ki zaroorat nahi hoti, kyunki har element resolve aur hamesha ke liye discard kiya jaata hai us pal jab iska jawaab milta hai.',
      },
      {
        wrong: `stack.push(i); // pushed unconditionally, without resolving smaller
// elements already waiting on the stack first`,
        right: `while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
  stack.pop(); // resolve smaller elements FIRST
}
stack.push(i);`,
        why: 'Pushing a new element without first resolving smaller elements already waiting breaks the stack\'s decreasing invariant, making later comparisons unreliable.',
        whyHi: 'Ek naya element push karna pehle se wait kar rahe chhote elements ko pehle resolve kiye bina stack ke decreasing invariant ko todta hai, baad ki comparisons ko na-bharosemand banaate hue.',
      },
      {
        wrong: `while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
  stack.pop();
  // forgot to actually record the resolved index's answer in result[]`,
        right: `while (stack.length > 0 && heights[i] > heights[stack[stack.length - 1]]) {
  const resolvedIndex = stack.pop();
  result[resolvedIndex] = heights[i]; // record the answer
}`,
        why: 'Popping a resolved element without recording its answer discards the entire point of resolving it — the popped index\'s answer must be written to the result before moving on.',
        whyHi: 'Ek resolve kiye gaye element ko pop karna iska jawaab record kiye bina ise resolve karne ke poore point ko hataata hai — pop ki gayi index ka jawaab result mein likha jaana chahiye aage badhne se pehle.',
      },
    ],

    realWorld: [
      {
        en: '**"Next Greater Element", "Daily Temperatures", and "Trapping Rain Water" are among the most commonly cited practice problems specifically chosen to teach the monotonic stack pattern.**',
        hi: '**"Next Greater Element", "Daily Temperatures", aur "Trapping Rain Water" un practice problems mein sabse aam taur par cite ki jaane waali hain jo khaas taur par monotonic stack pattern sikhaane ke liye chuni gayi hain.**',
      },
      {
        en: '**Stock price analysis (finding the next day a stock price exceeds today\'s) is a genuinely common real-world application structurally identical to the next-greater-element problem this lesson covers.**',
        hi: '**Stock price analysis (agla din dhoondhna jab stock price aaj se aage nikal jaaye) ek sach mein aam asli-duniya application hai jo structurally is lesson ke next-greater-element problem se identical hai.**',
      },
      {
        en: '**The monotonic stack pattern is explicitly recognized as its own distinct category in most serious algorithm interview-preparation resources**, not a niche or rarely-tested technique.',
        hi: '**Monotonic stack pattern explicitly adhikaansh gambhir algorithm interview-preparation resources mein apni khud ki alag category ki tarah pehchaana jaata hai**, ek niche ya kam-hi-test-ki-jaane-waali technique nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does the monotonic stack approach achieve O(n) total complexity despite containing a while loop nested inside a for loop, a shape that usually indicates O(n²)?',
        qHi: 'Monotonic stack approach ek \`while\` loop ke ek \`for\` loop ke andar nested hone ke bawajood \`O(n)\` total complexity kyun haasil karta hai, ek shape jo aksar \`O(n²)\` darsata hai?',
        a: 'The standard reasoning that a loop nested inside another loop produces O(n²) complexity relies on a specific assumption: that the inner loop\'s full work is repeated in its entirety on every single iteration of the outer loop. In the monotonic stack approach, this assumption does not hold, because of a specific guarantee about how the stack is used: every single index is pushed onto the stack exactly one time, during the single pass of the outer for loop, and critically, once an index is popped off the stack by the inner while loop, it has been fully resolved and is never pushed back onto the stack again at any later point in the algorithm\'s execution. This means the total number of pop operations performed by the inner while loop, summed across the ENTIRE execution of the algorithm rather than per individual outer iteration, cannot exceed the total number of push operations, which is exactly n, one per element. So while it is true that a single specific outer iteration can occasionally trigger the inner while loop to pop several elements in a row, this is not extra, additional work being repeated — it is simply some of the total, fixed budget of at most n pops being spent during that particular iteration rather than spread evenly across all of them. Summing the total work across the entire algorithm\'s run — n pushes plus at most n pops, each individual push or pop being a fast, constant-time operation — gives a genuine total of O(n), not O(n²), because the key structural fact that breaks the usual nested-loop assumption is that each element\'s participation in the inner loop is a one-time event across the whole algorithm, not something repeated on every outer iteration.',
        aHi: 'Standard tark ki ek loop ek doosre loop ke andar nested \`O(n²)\` complexity banaata hai ek khaas dhaarna par nirbhar karta hai: ki inner loop ka poora kaam har akeli outer loop ki iteration par poori tarah dohraaya jaata hai. Monotonic stack approach mein, ye dhaarna nahi tikti, ek khaas guarantee ki wajah se ki stack kaise istemal ki jaati hai: har akela index stack par bilkul ek baar push hota hai, outer \`for\` loop ke akele pass ke dauraan, aur mahatvapoorn baat, ek baar ek index inner \`while\` loop dwara stack se pop kiya jaata hai, ye poori tarah resolve ho chuka hai aur kabhi bhi algorithm ke execution mein baad ke kisi bhi bindu par stack par wapas push nahi hota. Iska matlab hai inner \`while\` loop dwara perform ki gayi total pop operations ki tadaad, algorithm ke POORE execution ke aar-paar jodi gayi prati akeli outer iteration ke bajaye, us total push operations ki tadaad se zyaada nahi ho sakti, jo bilkul \`n\` hai, prati element ek. Toh ye sach hai ki ek akeli khaas outer iteration kabhi-kabhi inner \`while\` loop ko ek row mein kayi elements pop karne ke liye trigger kar sakti hai, ye atirikt, extra kaam nahi hai jo dohraaya jaa raha hai — ye simply kul, fixed budget ka kuch hissa hai zyaada se zyaada \`n\` pops ka us khaas iteration ke dauraan kharch kiya jaa raha hai unke aar-paar samaan roop se failaaye jaane ke bajaye. Poore algorithm ke run ke aar-paar total kaam jodna — \`n\` pushes plus zyaada se zyaada \`n\` pops, har akela push ya pop ek tez, constant-time operation hote hue — ek asli total \`O(n)\` deta hai, \`O(n²)\` nahi, kyunki wo mool structural tathya jo usual nested-loop dhaarna todta hai ye hai ki har element ki inner loop mein bhaagidaari poore algorithm mein ek-baar-ka event hai, har outer iteration par dohraaya jaane waala kuch nahi.',
      },
      {
        q: 'Why is it critical that the stack always resolve and pop smaller elements before pushing a new, larger one, rather than simply pushing every new element regardless of what is already on the stack?',
        qHi: 'Ye critical kyun hai ki stack hamesha ek naya, bada element push karne se pehle chhote elements ko resolve aur pop kare, saadhe roop se har naye element ko push karne ke bajaye stack par jo bhi pehle se hai us se azaad?',
        a: 'The correctness of the entire monotonic stack approach depends on a specific invariant being maintained at every single point during the algorithm\'s execution: that the heights corresponding to the indices currently on the stack are always arranged in decreasing order from the bottom of the stack to the top. This invariant is precisely what makes it valid to conclude, when comparing a new element against the current top of the stack, that if the new element is larger, it is genuinely the correct "next greater element" answer for whatever is on top — this conclusion is only trustworthy because the invariant guarantees that whatever is on top of the stack has not yet found a larger element among anything processed so far, which is exactly what "still being on the stack, unresolved" is defined to mean. If a new, larger element were instead pushed directly on top of a smaller, unresolved element without first popping and resolving that smaller element, the stack would immediately contain a smaller value sitting below a larger one, directly violating the decreasing-order invariant. Once this invariant is broken, the entire mechanism the algorithm depends on for making correct decisions collapses: later comparisons, which assume the invariant still holds in order to correctly determine which elements have found their answer and which have not, would no longer be operating on a stack whose structure actually reflects the real state of which elements are genuinely still waiting. Popping and resolving every smaller element before pushing the new one is therefore not an optional optimization or a stylistic choice — it is the specific mechanism that actively maintains the invariant the algorithm\'s entire correctness depends on, and skipping it would produce a stack that no longer means what the algorithm assumes it means.',
        aHi: 'Poori monotonic stack approach ki sahihata is baat par nirbhar karti hai ki ek khaas invariant algorithm ke execution ke har akele bindu par maintain kiya jaata hai: ki abhi stack par maujood indices se mel khaati heights hamesha stack ke neeche se oopar tak decreasing order mein arrange hain. Ye invariant bilkul wo hai jo ye nateeja nikaalna valid banaata hai, ek naye element ko stack ke current top ke khilaaf compare karte waqt, ki agar naya element bada hai, ye sach mein jo bhi top par hai uske liye sahi "next greater element" jawaab hai — ye nateeja sirf isliye bharosemand hai kyunki invariant guarantee karta hai ki jo bhi stack ke top par hai abhi tak ab tak process ki gayi kisi bhi cheez mein ek bada element nahi mila, jo bilkul wo hai jo "abhi bhi stack par hona, na-resolved" define karne ke liye maana jaata hai. Agar ek naya, bada element iske bajaye seedhe ek chhote, na-resolved element ke oopar push kiya jaata pehle us chhote element ko pop aur resolve kiye bina, stack turant ek chhoti value rakhega jo ek bade ke neeche baithi hai, decreasing-order invariant ko seedhe violate karte hue. Ek baar ye invariant toot jaaye, poora mechanism jispar algorithm sahi faisle lene ke liye nirbhar karta hai dhah jaata hai: baad ki comparisons, jo sahi tarike se tay karne ke liye maanti hain ki invariant abhi bhi tikta hai ki kaunse elements ne apna jawaab paaya hai aur kaunse nahi, ab ek aisi stack par operate nahi kar rahi hongi jiska structure asal mein us asli sthiti ko darsata hai ki kaunse elements sach mein abhi bhi wait kar rahe hain. Naya wala push karne se pehle har chhote element ko pop aur resolve karna isliye ek vaikalpik optimization ya ek stylistic chunaav nahi hai — ye khaas mechanism hai jo saqriya roop se us invariant ko maintain karta hai jispar algorithm ki poori sahihata nirbhar karti hai, aur ise skip karna ek aisi stack banaayega jiska ab wo matlab nahi hai jo algorithm maanta hai iska hai.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (nested loop) and fixed (monotonic stack) nextGreaterElement functions from this lesson. Test both against a strictly decreasing array (e.g. [9, 7, 5, 3, 1]) and confirm they produce identical results.',
        taskHi: 'Is lesson ke toote (nested loop) aur theek (monotonic stack) \`nextGreaterElement\` functions dono banao. Dono ko ek sakht-decreasing array (jaisa \`[9, 7, 5, 3, 1]\`) ke khilaaf test karo aur confirm karo ki wo identical nateeje banaate hain.',
        hint: 'A strictly decreasing array is the worst case for the broken version, since no element ever finds a next-greater one — confirm both versions correctly return -1 for every position.',
        hintHi: 'Ek sakht-decreasing array toote version ke liye sabse bura case hai, kyunki koi element kabhi ek next-greater nahi dhoondhta — confirm karo ki dono versions har position ke liye sahi tarike se \`-1\` return karte hain.',
      },
      {
        task: 'Add the instrumented push/pop counting from this lesson\'s third example to the fixed version. Run it against several different arrays of length 1000 and confirm totalPushes always equals 1000 and totalPops never exceeds 1000.',
        taskHi: 'Is lesson ke teesre example ka instrumented push/pop counting theek version mein jodo. Ise 1000 lambaayi ke kayi alag arrays ke khilaaf chalaao aur confirm karo ki \`totalPushes\` hamesha 1000 ke barabar hai aur \`totalPops\` kabhi 1000 se zyaada nahi hota.',
        hint: 'Try both a strictly decreasing array and a strictly increasing array, since these represent two very different patterns of push/pop behavior.',
        hintHi: 'Ek sakht-decreasing array aur ek sakht-increasing array dono try karo, kyunki ye push/pop vyavahaar ke do bahut alag patterns darsate hain.',
      },
      {
        task: 'Trace through nextGreaterElement([4, 5, 2, 10]) by hand using the monotonic stack version, writing down the stack\'s contents and the result array after every single iteration, before running the code.',
        taskHi: '\`nextGreaterElement([4, 5, 2, 10])\` ko monotonic stack version istemal karke haath se trace karo, har akeli iteration ke baad stack ki contents aur result array likhte hue, code chalaane se pehle.',
        hint: 'This is the same tracing habit this course\'s Module 1 problem-solving-framework lesson established — write down the stack and result as two separate columns, updating them one line at a time.',
        hintHi: 'Ye wahi tracing aadat hai jise is course ke Module 1 problem-solving-framework lesson ne sthaapit kiya — stack aur result ko do alag columns ki tarah likho, unhe ek waqt mein ek line update karte hue.',
      },
    ],

    keyTakeaways: [
      'A nested loop checking every element against every element to its right correctly finds the next-greater element, but costs O(n²) in the worst case, redoing overlapping comparisons.',
      'A monotonic stack keeps its indices\' corresponding values in decreasing order, resolving and popping every smaller element the instant a larger one arrives.',
      'Every index is pushed exactly once and popped at most once across the entire run, giving O(n) total despite the loop-within-a-loop appearance — the same bounded-total-movement reasoning as this course\'s sliding window lesson.',
      'The stack\'s decreasing order is an invariant that must be actively maintained by resolving smaller elements before pushing a new, larger one — pushing without resolving first breaks the invariant and produces wrong answers.',
      'The signal for a monotonic stack is a problem asking, for each element, about the next element elsewhere in the sequence satisfying some comparison, not just its immediate neighbor.',
      'This pattern generalizes directly to "next smaller element" and related problems by simply reversing the comparison direction, without changing the underlying mechanism.',
    ],
    keyTakeawaysHi: [
      'Ek nested loop jo har element ko iske daaye har element ke khilaaf check karta hai sahi tarike se next-greater element dhoondhta hai, par sabse bure case mein \`O(n²)\` kharch karta hai, overlapping comparisons dobara karte hue.',
      'Ek monotonic stack apni indices ki mel khaati values ko decreasing order mein rakhta hai, har chhote element ko turant resolve aur pop karte hue jab ek bada aata hai.',
      'Har index bilkul ek baar push hota hai aur poore run mein zyaada se zyaada ek baar pop hota hai, loop-ke-andar-loop dikhaawat ke bawajood \`O(n)\` total dete hue — is course ke sliding window lesson jaisa hi bounded-total-movement tark.',
      'Stack ki decreasing order ek invariant hai jise chhote elements ko naya, bada wala push karne se pehle resolve karke saqriya roop se maintain kiya jaana chahiye — pehle resolve kiye bina push karna invariant todta hai aur galat jawaab banaata hai.',
      'Ek monotonic stack ke liye signal ek problem hai jo, har element ke liye, sequence mein kahin aur agle element ke baare mein poochta hai kuch comparison poora karte hue, sirf iske immediate padosi ke baare mein nahi.',
      'Ye pattern "next smaller element" aur judi problems tak seedhe generalize hota hai bas comparison ki disha ulti karke, underlying mechanism badle bina.',
    ],
  },
];
