/**
 * DSA Complete Course — Module 4: Linked Lists, lesson 5 (final lesson
 * of Module 4).
 *
 * Merging two already-sorted linked lists — the capstone lesson for
 * this module, directly combining this course's Module 2 two-pointer
 * technique (exploiting sortedness) with this module's own node-
 * splicing mechanics. Broken example: converting both linked lists to
 * arrays, concatenating them, sorting the combined array from scratch,
 * and rebuilding a linked list from the result — genuinely correct, but
 * throwing away the fact that both inputs are ALREADY sorted (the exact
 * waste this course's Module 2 two-pointer lesson addressed for arrays)
 * and paying real conversion overhead in both directions. Fixed with a
 * direct two-pointer merge across the two linked lists themselves,
 * splicing whichever current node is smaller onto a growing result list
 * one at a time, using a "dummy head" node to avoid special-casing the
 * very first splice.
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

export const DSA_MODULE_4_PART5: CourseLesson[] = [
  {
    slug: 'merging-sorted-linked-lists',
    title: 'Merging Two Sorted Linked Lists',
    titleHi: 'Do Sorted Linked Lists Ko Merge Karna',
    description: 'Merging two already-sorted linked lists by converting both to arrays, concatenating them, sorting the combined array from scratch, and converting the result back into a linked list — genuinely correct, but paying a full O(n log n) sort to re-derive an order that both original lists already had.',
    descriptionHi: 'Do pehle-se-sorted linked lists ko dono ko arrays mein badalke, unhe concatenate karke, combined array ko shuru se sort karke, aur nateeje ko wapas ek linked list mein badalke merge karna — sach mein sahi, par ek poora \`O(n log n)\` sort chukaate hue ek aisi order ko dobara nikaalne ke liye jo dono asli lists ke paas pehle se thi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**Combining two already-alphabetized stacks of index cards by throwing every single card from both stacks into one giant pile and re-alphabetizing the entire pile completely from scratch, versus standing the two already-sorted stacks side by side and simply always taking whichever stack\'s TOP card comes first alphabetically, one card at a time, building a single new stack as you go.** Re-alphabetizing the giant combined pile genuinely produces a correctly sorted result, but it throws away the one thing already known for free about both original stacks — that each one, individually, was already in order — and pays the full cost of sorting as if starting from complete disorder. Standing the two stacks side by side and always taking whichever top card comes first requires comparing only the two currently-exposed top cards at each step, never needing to look at, or reconsider, any card buried deeper in either stack, since each stack\'s own existing order guarantees its own next card is always the next-smallest one that stack has to offer. Converting two sorted linked lists into arrays, combining them, and sorting the combined array from scratch is the re-alphabetize-the-giant-pile approach: correct, but ignoring the sortedness both lists already had. Directly comparing the two lists\' current nodes and always splicing the smaller one onto a growing result, one node at a time, is the side-by-side-stacks approach: the exact same correct result, without ever re-deriving an order that already existed.',
      hi: '**Do pehle-se-alphabetized index cards ke stacks ko jodna dono stacks se har akela card ek vishaal dher mein daalke aur poore dher ko poori tarah shuru se dobara alphabetize karke, versus do pehle-se-sorted stacks ko ek doosre ke bagal mein khada karna aur bas hamesha jo bhi stack ka TOP card pehle alphabetically aata hai use lena, ek waqt mein ek card, chalte-chalte ek nayi akeli stack banaate hue.** Vishaal combined dher ko dobara-alphabetize karna sach mein ek sahi tarike se sorted nateeja banaata hai, par ye us ek cheez ko phenkta hai jo dono asli stacks ke baare mein muft mein pehle se maloom hai — ki har ek, alag-alag, pehle se order mein tha — aur sorting ki poori keemat chukaata hai jaise poori tarah disorder se shuru kar raha ho. Do stacks ko bagal-bagal khada karna aur hamesha jo bhi top card pehle aata hai use lena har kadam par sirf do abhi-dikhaayi-de-rahe top cards ko compare karna maangta hai, kabhi kisi stack mein gehre dabe kisi bhi card ko dekhne, ya dobara vichaar karne, ki zaroorat na hote hue, kyunki har stack ka apna maujood order guarantee karta hai ki iska apna agla card hamesha agla-sabse-chhota hai jo stack pradaan kar sakta hai. Do sorted linked lists ko arrays mein badalna, unhe combine karna, aur combined array ko shuru se sort karna vishaal-dher-ko-dobara-alphabetize-karo approach hai: sahi, par us sortedness ko ignore karte hue jo dono lists ke paas pehle se thi. Do lists ke current nodes ko seedhe compare karna aur hamesha chhote wale ko ek badhte nateeje par splice karna, ek waqt mein ek node, bagal-bagal-stacks approach hai: bilkul wahi sahi nateeja, ek aisi order dobara-nikaale bina jo pehle se maujood thi.',
    },

    simple: `**Start broken.** Converting to arrays, sorting from scratch, then converting back:

\`\`\`js
function mergeSortedLists(list1, list2) {
  const values = [];
  let current = list1;
  while (current !== null) { values.push(current.value); current = current.next; }
  current = list2;
  while (current !== null) { values.push(current.value); current = current.next; }

  values.sort((a, b) => a - b); // re-sorting data that was ALREADY sorted, twice over

  let dummyHead = { value: null, next: null };
  let tail = dummyHead;
  for (const value of values) {
    tail.next = { value, next: null };
    tail = tail.next;
  }
  return dummyHead.next;
}
\`\`\`

This genuinely produces a correctly merged, sorted list — but \`values.sort()\` costs \`O((n + m) log(n + m))\` (this course\'s later sorting module covers exactly why), despite \`list1\` and \`list2\` each already being individually sorted before this function was ever called. Sorting from scratch discards that sortedness entirely, re-deriving an order that both inputs already had, on top of paying real overhead converting linked lists to arrays and back.

**The fix: a direct two-pointer merge, exploiting the sortedness both lists already have**

\`\`\`js
function mergeSortedLists(list1, list2) {
  const dummyHead = { value: null, next: null }; // avoids special-casing the first splice
  let tail = dummyHead;
  let a = list1;
  let b = list2;

  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b; // splice on whichever list still has nodes left
  return dummyHead.next;
}
\`\`\`

\`\`\`ts
interface ListNode<T> { value: T; next: ListNode<T> | null; }

function mergeSortedLists<T>(list1: ListNode<T> | null, list2: ListNode<T> | null): ListNode<T> | null {
  const dummyHead: ListNode<T> = { value: null as any, next: null };
  let tail = dummyHead;
  let a = list1;
  let b = list2;

  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummyHead.next;
}
\`\`\`

This is this course\'s Module 2 two-pointer technique — \`a\` and \`b\`, each already sorted, comparing their current values and advancing whichever is smaller — applied directly to linked-list nodes instead of array indices. Because each list is individually sorted, comparing only the two CURRENT nodes is always enough to know which one is genuinely the smallest remaining value across both lists combined — nothing deeper in either list could possibly be smaller, since each list\'s own order guarantees that. No new nodes are created at all — existing nodes are simply spliced onto the result list\'s \`tail\`, one at a time, in \`O(n + m)\` total, without ever needing to sort anything.`,

    simpleHi: `**Toote hue se shuru.** Arrays mein badalna, shuru se sort karna, phir wapas badalna:

\`\`\`js
function mergeSortedLists(list1, list2) {
  const values = [];
  let current = list1;
  while (current !== null) { values.push(current.value); current = current.next; }
  current = list2;
  while (current !== null) { values.push(current.value); current = current.next; }

  values.sort((a, b) => a - b); // ek aise data ko dobara-sort karna jo PEHLE SE sorted tha, do baar

  let dummyHead = { value: null, next: null };
  let tail = dummyHead;
  for (const value of values) {
    tail.next = { value, next: null };
    tail = tail.next;
  }
  return dummyHead.next;
}
\`\`\`

Ye sach mein ek sahi tarike se merge ki gayi, sorted list banaata hai — par \`values.sort()\` \`O((n + m) log(n + m))\` kharch karta hai (is course ka baad ka sorting module bilkul batata hai kyun), is baat ke bawajood ki \`list1\` aur \`list2\` har ek pehle se alag-alag sorted thi isse pehle ki ye function kabhi bulaaya jaaye. Shuru se sort karna us sortedness ko poori tarah hataata hai, ek aisi order dobara nikaalte hue jo dono inputs ke paas pehle se thi, arrays mein badalne aur wapas badalne ke asli overhead ke oopar.

**Fix: ek seedha two-pointer merge, us sortedness ka istemal karte hue jo dono lists ke paas pehle se hai**

\`\`\`js
function mergeSortedLists(list1, list2) {
  const dummyHead = { value: null, next: null }; // pehle splice ko khaas-case karne se bachaata hai
  let tail = dummyHead;
  let a = list1;
  let b = list2;

  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b; // jo bhi list mein abhi bhi nodes bache hain use splice karo
  return dummyHead.next;
}
\`\`\`

\`\`\`ts
interface ListNode<T> { value: T; next: ListNode<T> | null; }

function mergeSortedLists<T>(list1: ListNode<T> | null, list2: ListNode<T> | null): ListNode<T> | null {
  const dummyHead: ListNode<T> = { value: null as any, next: null };
  let tail = dummyHead;
  let a = list1;
  let b = list2;

  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummyHead.next;
}
\`\`\`

Ye is course ka Module 2 two-pointer technique hai — \`a\` aur \`b\`, har ek pehle se sorted, apni current values compare karte hue aur jo bhi chhota hai use aage badhaate hue — array indices ke bajaye seedhe linked-list nodes par lagu ki gayi. Kyunki har list alag-alag sorted hai, sirf do CURRENT nodes ko compare karna hamesha kaafi hai ye jaanne ke liye ki dono lists mein saath se sach mein sabse chhoti bachi hui value kaunsi hai — kisi bhi list mein gehraayi mein kuch bhi sambhaavit roop se chhota nahi ho sakta, kyunki har list ka apna order ye guarantee karta hai. Koi naye nodes bilkul nahi banaaye jaate — maujood nodes bas nateeja list ki \`tail\` par splice kiye jaate hain, ek waqt mein ek, \`O(n + m)\` total mein, kuch bhi sort karne ki zaroorat kabhi na hote hue.`,

    content: `## Why a dummy head node avoids special-casing the very first splice

\`\`\`js
// WITHOUT a dummy head, the first splice needs its own special logic:
let mergedHead = null;
if (a.value <= b.value) { mergedHead = a; a = a.next; } else { mergedHead = b; b = b.next; }
let tail = mergedHead;
// ...then the loop for every SUBSEQUENT splice looks different from this first one

// WITH a dummy head, every splice, including the first, uses identical code:
const dummyHead = { value: null, next: null };
let tail = dummyHead; // tail.next = ... works uniformly from the very first splice onward
\`\`\`

Without a dummy head node, the very first splice is genuinely different from every subsequent one: there is no existing \`tail\` yet to attach to, so the first node has to be assigned directly to a \`mergedHead\` variable through its own separate logic, and only after that can a \`tail\` pointer be established for every following splice to use. A dummy head — a placeholder node whose own value is never used, existing purely so that \`tail\` always has something valid to point from, even before the real first node has been chosen — eliminates this special case entirely: the very first splice becomes \`dummyHead.next = ...\`, using the exact same code path as every splice that follows, since \`tail\` already exists before the loop begins. The actual result list starts at \`dummyHead.next\` (skipping the placeholder itself), which is why the final return statement is \`return dummyHead.next\`, not \`return dummyHead\`.

## Handling the leftover: one list finishing before the other

\`\`\`js
tail.next = a !== null ? a : b;
\`\`\`

The main loop only continues while BOTH \`a\` and \`b\` are non-null — the moment either list is fully consumed, the loop stops, but the other list may still have remaining nodes that have not yet been spliced in. Because whichever list still has nodes remaining is, by itself, already fully sorted (nothing about merging changes the internal order of whichever list was not yet exhausted), the remainder can simply be attached wholesale to \`tail.next\` in one step — there is no need to continue comparing node by node, since every remaining node in that one list is already correctly ordered relative to everything already spliced into the result, and relative to every other remaining node in that same list.

## Connecting this lesson to this course\'s later Sorting module

\`\`\`
This lesson's merge: combining TWO ALREADY-SORTED lists into one — O(n + m)

Merge sort (this course's later Module 10): recursively splitting an
  UNSORTED list in half, sorting each half, then using EXACTLY this
  lesson's merge step to combine the two sorted halves back together
\`\`\`

The merge technique this lesson covers is not only useful on its own — it is the exact same "combine two sorted halves" step that this course\'s later Module 10 lesson on merge sort is built around, applied there to a list that starts out entirely unsorted, split recursively into smaller and smaller pieces until each piece is trivially sorted on its own, then merged back together two pieces at a time using precisely this lesson\'s two-pointer splicing technique. Recognizing this lesson\'s merge as a specific building block for a full sorting algorithm, rather than a standalone trick only useful for two already-sorted inputs, previews exactly what this course\'s Module 10 builds on top of it.`,

    contentHi: `## Ek dummy head node bilkul pehle splice ko khaas-case karne se kyun bachaata hai

\`\`\`js
// Dummy head KE BINA, pehle splice ko apna khaas logic chahiye:
let mergedHead = null;
if (a.value <= b.value) { mergedHead = a; a = a.next; } else { mergedHead = b; b = b.next; }
let tail = mergedHead;
// ...phir har BAAD ke splice ke liye loop is pehle se alag dikhta hai

// Dummy head KE SAATH, har splice, pehla sameet, identical code istemal karta hai:
const dummyHead = { value: null, next: null };
let tail = dummyHead; // tail.next = ... bilkul pehle splice se aage samaan roop se kaam karta hai
\`\`\`

Ek dummy head node ke bina, bilkul pehla splice sach mein har baad ke se alag hai: abhi tak koi maujood \`tail\` nahi hai attach karne ke liye, isliye pehla node ko apne khud ke alag logic ke zariye seedhe ek \`mergedHead\` variable mein assign kiya jaana chahiye, aur sirf uske baad ek \`tail\` pointer sthaapit kiya jaa sakta hai har baad ke splice ke istemal ke liye. Ek dummy head — ek placeholder node jiski apni value kabhi istemal nahi hoti, sirf isliye maujood hai taaki \`tail\` ke paas hamesha point karne ke liye kuch valid ho, asli pehla node chunne se pehle bhi — is khaas case ko poori tarah khatam karta hai: bilkul pehla splice \`dummyHead.next = ...\` ban jaata hai, bilkul wahi code path istemal karte hue jo har baad ka splice istemal karta hai, kyunki \`tail\` loop shuru hone se pehle hi maujood hai. Asli nateeja list \`dummyHead.next\` se shuru hoti hai (placeholder khud ko skip karte hue), jo bilkul isliye hai ki aakhri return statement \`return dummyHead.next\` hai, \`return dummyHead\` nahi.

## Bacha hua handle karna: ek list doosre se pehle khatam hona

\`\`\`js
tail.next = a !== null ? a : b;
\`\`\`

Mukhya loop sirf tab jaari rehta hai jab DONO \`a\` aur \`b\` non-null hain — jis pal koi bhi list poori tarah consume ho jaati hai, loop rukta hai, par doosri list mein abhi bhi baaki nodes ho sakti hain jo abhi tak splice nahi ki gayi. Kyunki jo bhi list mein abhi bhi nodes bache hain, khud se, pehle se poori tarah sorted hai (merging ke baare mein kuch bhi us list ke internal order ko nahi badalta jo abhi tak khatam nahi hui), bacha hua bas \`tail.next\` mein ek kadam mein poori tarah joda jaa sakta hai — node-dar-node compare karna jaari rakhne ki zaroorat nahi hai, kyunki us ek list mein har bachi hui node pehle se nateeje mein pehle se joda gaya har cheez ke saapeksh sahi tarike se ordered hai, aur usi list mein har doosri bachi hui node ke saapeksh bhi.

## Is lesson ko is course ke baad ke Sorting module se jodna

\`\`\`
Is lesson ka merge: DO PEHLE-SE-SORTED lists ko ek mein combine karna — O(n + m)

Merge sort (is course ka baad ka Module 10): ek UNSORTED list ko recursively
  aadhe mein todna, har aadhe ko sort karna, phir do sorted halves ko wapas
  saath combine karne ke liye BILKUL is lesson ke merge step ka istemal karna
\`\`\`

Ye lesson jo merge technique cover karta hai sirf khud mein upyogi nahi hai — ye bilkul wahi "do sorted halves combine karo" step hai jispar is course ka baad ka Module 10 ka merge sort lesson banaaya gaya hai, wahaan ek list par lagu kiya gaya jo poori tarah unsorted shuru hoti hai, chhote se chhote tukdon mein recursively toda jaata hai jab tak har tukda apne aap trivially sorted na ho, phir bilkul is lesson ki two-pointer splicing technique istemal karke ek waqt mein do tukde wapas saath merge kiye jaate hain. Is lesson ke merge ko ek poori sorting algorithm ke liye ek khaas building block ki tarah pehchaanna, sirf do pehle-se-sorted inputs ke liye upyogi ek standalone trick ke bajaye, bilkul preview karta hai ki is course ka Module 10 iske oopar kya banaata hai.`,

    examples: [
      {
        title: 'Broken: array conversion and a full re-sort',
        titleHi: 'Toota: array conversion aur ek poora dobara-sort',
        code: `const values = [...list1Values, ...list2Values];
values.sort((a, b) => a - b); // re-sorting already-sorted data`,
        codeJs: `function mergeSortedLists(list1, list2) {
  const values = [];
  let current = list1;
  while (current !== null) { values.push(current.value); current = current.next; }
  current = list2;
  while (current !== null) { values.push(current.value); current = current.next; }
  values.sort((a, b) => a - b);

  let dummyHead = { value: null, next: null };
  let tail = dummyHead;
  for (const value of values) {
    tail.next = { value, next: null };
    tail = tail.next;
  }
  return dummyHead.next;
}`,
        codeTs: `interface ListNode<T> { value: T; next: ListNode<T> | null; }

function mergeSortedLists(list1: ListNode<number> | null, list2: ListNode<number> | null): ListNode<number> | null {
  const values: number[] = [];
  let current = list1;
  while (current !== null) { values.push(current.value); current = current.next; }
  current = list2;
  while (current !== null) { values.push(current.value); current = current.next; }
  values.sort((a, b) => a - b);

  const dummyHead: ListNode<number> = { value: 0, next: null };
  let tail = dummyHead;
  for (const value of values) {
    tail.next = { value, next: null };
    tail = tail.next;
  }
  return dummyHead.next;
}
// fully valid TypeScript — the wasted sort is architectural`,
        output: `Correctly merges [1, 3, 5] and [2, 4, 6] into [1, 2, 3, 4, 5, 6],
but pays a full O((n+m) log(n+m)) sort on data that was already
sorted in both original lists.`,
        explain: 'Sorting the combined array from scratch discards the fact that both original lists were already individually sorted before this function was called.',
        explainHi: 'Combined array ko shuru se sort karna is tathya ko hataata hai ki dono asli lists is function ke bulaaye jaane se pehle pehle se alag-alag sorted thi.',
      },
      {
        title: 'Fixed: a direct two-pointer merge using a dummy head',
        titleHi: 'Theek: ek dummy head istemal karke ek seedha two-pointer merge',
        code: `if (a.value <= b.value) { tail.next = a; a = a.next; }
else { tail.next = b; b = b.next; }
tail = tail.next;`,
        codeJs: `function mergeSortedLists(list1, list2) {
  const dummyHead = { value: null, next: null };
  let tail = dummyHead;
  let a = list1;
  let b = list2;
  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummyHead.next;
}`,
        codeTs: `interface ListNode<T> { value: T; next: ListNode<T> | null; }

function mergeSortedLists<T>(list1: ListNode<T> | null, list2: ListNode<T> | null): ListNode<T> | null {
  const dummyHead: ListNode<T> = { value: null as any, next: null };
  let tail = dummyHead;
  let a = list1;
  let b = list2;
  while (a !== null && b !== null) {
    if (a.value <= b.value) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummyHead.next;
}`,
        outputJs: `Correctly merges [1, 3, 5] and [2, 4, 6] into [1, 2, 3, 4, 5, 6]
in O(n + m), splicing existing nodes with no sort and no new nodes.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Comparing only the two current nodes at each step is always sufficient, since each list\'s own existing order guarantees its current node is its own smallest remaining value.',
        explainHi: 'Har kadam par sirf do current nodes compare karna hamesha kaafi hai, kyunki har list ka apna maujood order guarantee karta hai ki iska current node iski apni sabse chhoti bachi hui value hai.',
      },
      {
        title: 'Handling the leftover after one list is exhausted',
        titleHi: 'Ek list khatam hone ke baad bacha hua handle karna',
        code: `// loop stops once either a or b becomes null
tail.next = a !== null ? a : b; // attach whichever list still has nodes`,
        codeJs: `// list1 = [1, 3], list2 = [2, 4, 5, 6]
// after merging 1, 2, 3: a becomes null (list1 exhausted), b is at 4
// tail.next = b directly attaches the remaining 4 -> 5 -> 6 in one step`,
        codeTs: `// Same logic, fully typed — tail.next = a !== null ? a : b
// attaches whichever list still has remaining nodes.`,
        outputJs: `The final merged list correctly ends ...3, 4, 5, 6 — the
remaining nodes from list2 are attached in bulk, since they are
already correctly ordered relative to everything already merged.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Once one list is exhausted, the other list\'s remaining nodes are already sorted relative to each other and to the merged result so far, so they can be attached in one step without further comparison.',
        explainHi: 'Ek baar ek list khatam ho jaaye, doosri list ki bachi hui nodes pehle se ek doosre ke saapeksh aur ab tak merge ki gayi nateeje ke saapeksh sorted hain, isliye unhe bina aur comparison ke ek kadam mein joda jaa sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const values = [...list1Values, ...list2Values];
values.sort((a, b) => a - b);
// re-sorting data that was already individually sorted`,
        right: `// comparing the two lists' current nodes directly and splicing
// the smaller one onto the result, one at a time`,
        why: 'Sorting the combined data from scratch discards the sortedness both original lists already had, paying an unnecessary O((n+m) log(n+m)) cost instead of O(n + m).',
        whyHi: 'Combined data ko shuru se sort karna us sortedness ko hataata hai jo dono asli lists ke paas pehle se thi, ek bekaar \`O((n+m) log(n+m))\` keemat chukaate hue \`O(n + m)\` ke bajaye.',
      },
      {
        wrong: `let mergedHead = null;
if (a.value <= b.value) { mergedHead = a; a = a.next; } else { mergedHead = b; b = b.next; }
let tail = mergedHead;
// separate special-case logic just for the first splice`,
        right: `const dummyHead = { value: null, next: null };
let tail = dummyHead;
// every splice, including the first, uses identical code`,
        why: 'Without a dummy head node, the first splice needs its own separate logic distinct from every subsequent one — a dummy head unifies all splices into one consistent code path.',
        whyHi: 'Ek dummy head node ke bina, pehle splice ko apna alag logic chahiye har baad ke se alag — ek dummy head sab splices ko ek consistent code path mein ekjut karta hai.',
      },
      {
        wrong: `while (a !== null && b !== null) { /* compare and splice */ }
return dummyHead.next;
// forgetting to attach whichever list still has nodes left`,
        right: `while (a !== null && b !== null) { /* compare and splice */ }
tail.next = a !== null ? a : b; // attach the remainder
return dummyHead.next;`,
        why: 'The main loop stops as soon as either list is exhausted, silently dropping the remaining nodes of the other list if they are never explicitly attached afterward.',
        whyHi: 'Mukhya loop jis pal koi bhi list khatam hoti hai rukta hai, doosri list ki bachi hui nodes ko chupchaap girate hue agar unhe baad mein kabhi explicitly attach nahi kiya jaata.',
      },
    ],

    realWorld: [
      {
        en: '**"Merge Two Sorted Lists" is one of the single most commonly asked foundational technical interview questions**, specifically because it combines two-pointer reasoning with linked-list pointer manipulation in one problem.',
        hi: '**"Merge Two Sorted Lists" sabse aam poochhe jaane waale foundational technical interview sawaalon mein se ek hai**, khaas taur par kyunki ye two-pointer tark ko linked-list pointer manipulation ke saath ek problem mein jodta hai.',
      },
      {
        en: '**The dummy head node technique is a genuinely standard, widely used pattern across real linked-list code**, specifically to avoid special-casing the first insertion into an initially empty result.',
        hi: '**Dummy head node technique asli linked-list code mein ek sach mein standard, widely used pattern hai**, khaas taur par shuru mein khaali ek nateeje mein pehli insertion ko khaas-case karne se bachne ke liye.',
      },
      {
        en: '**This lesson\'s merge step is the literal core operation inside real merge sort implementations**, used in production sorting libraries across many languages, not a simplified teaching-only version.',
        hi: '**Is lesson ka merge step asli merge sort implementations ke andar shaabdik core operation hai**, kayi bhaashaon mein production sorting libraries mein istemal hota hai, ek simplified teaching-only version nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is it always sufficient to compare only the two lists\' current nodes when merging, rather than needing to look further ahead in either list?',
        qHi: 'Merge karte waqt sirf do lists ke current nodes compare karna hamesha kaafi kyun hai, kisi bhi list mein aur aage dekhne ki zaroorat ke bina?',
        a: 'Each of the two input lists is individually sorted before the merge begins, meaning that within either list on its own, every node\'s value is guaranteed to be less than or equal to every node that comes after it in that same list. This guarantee is precisely what makes each list\'s own current, not-yet-merged node the smallest value that list still has left to offer — nothing further ahead in that same list could possibly be smaller, since the list\'s own sorted order rules that out entirely. Given this, when deciding which single node, across BOTH lists combined, is genuinely the smallest remaining value overall, it is enough to compare only the two lists\' current nodes directly against each other: whichever of these two values is smaller is guaranteed to be the smallest value remaining anywhere across both lists, since the other list\'s own current node is, by the same reasoning, at least as small as everything else still remaining in that other list. There is no need to look further ahead into either list, because doing so could only reveal a value that is guaranteed to be at least as large as the one already being considered from that same list, never smaller. This is precisely the reasoning this course\'s Module 2 two-pointer lesson established for sorted arrays, applied here without modification to sorted linked lists: sortedness itself is the exact structural property that lets a single, cheap, local comparison stand in for what would otherwise require examining many more candidates.',
        aHi: 'Merge shuru hone se pehle do input lists mein se har ek alag-alag sorted hai, matlab kisi bhi ek list ke andar khud se, har node ki value us usi list mein iske baad aane waale har node se kam ya barabar hone ki guarantee hai. Ye guarantee bilkul wo hai jo har list ke apne current, abhi-tak-na-merge-kiye-gaye node ko us list ke paas dene ke liye bachi sabse chhoti value banaata hai — usi list mein aur aage kuch bhi sambhaavit roop se chhota nahi ho sakta, kyunki list ka apna sorted order ise poori tarah rule out karta hai. Ise dekhte hue, ye tay karte waqt ki DONO lists ke saath ke aar-paar, akela kaunsa node sach mein overall sabse chhoti bachi hui value hai, sirf do lists ke current nodes ko seedhe ek doosre se compare karna kaafi hai: in do values mein se jo bhi chhoti hai use dono lists mein kahin bhi bachi sabse chhoti value hone ki guarantee hai, kyunki doosri list ka apna current node, usi tark se, us doosri list mein bachi har doosri cheez se kam se kam utna chhota hai. Kisi bhi list mein aur aage dekhne ki zaroorat nahi hai, kyunki aisa karna sirf ek aisi value darsa sakta hai jise usi list se abhi vichaar ki jaa rahi value se kam se kam utna bada hone ki guarantee hai, kabhi chhota nahi. Ye bilkul wahi tark hai jise is course ke Module 2 two-pointer lesson ne sorted arrays ke liye sthaapit kiya, yahaan bina badlaav ke sorted linked lists par lagu kiya gaya: sortedness khud wo asli structural property hai jo ek akele, saste, local comparison ko us cheez ki jagah lene deti hai jise anyatha kayi zyaada candidates examine karne ki zaroorat hoti.',
      },
      {
        q: 'What specific problem does using a dummy head node solve when building the merged result list, and what would go wrong without it?',
        qHi: 'Merge ki gayi nateeja list banaate waqt ek dummy head node istemal karna khaas taur par kaunsi samasya sulajhaata hai, aur iske bina kya galat hoga?',
        a: 'Building a new list by repeatedly attaching nodes to a growing tail requires having an established tail reference to attach the next node to — but before the very first node has been chosen and attached, no such tail reference yet exists, since the result list is still completely empty at that point. Without a dummy head node, this creates a genuine special case: the very first node added to the result cannot be attached via the same tail.next = ... pattern used for every subsequent node, because there is no tail yet for that first attachment to use, so it must instead be assigned directly to whatever variable will eventually represent the list\'s head, through separate logic distinct from the rest of the merging process. This separate logic is not merely inconvenient to write; it introduces a genuine, easy-to-get-wrong asymmetry into what would otherwise be a single, uniform loop, since one specific case (the very first insertion) is handled by different code than every other case. A dummy head node resolves this by providing an initial placeholder node whose own value is never actually used or returned, existing purely so that a tail reference already exists, pointing at this placeholder, before the merging loop even begins. This means the very first real node added to the result can be attached using the exact same tail.next = ... code as every subsequent node, since tail already legitimately points somewhere valid from the very start, eliminating the special case entirely and reducing the entire merging process to one single, uniform loop with no separate first-case logic required. The actual result list, once merging is complete, is accessed by returning dummyHead.next rather than dummyHead itself, since the placeholder node was never meant to be part of the actual returned list, only a temporary anchor point that made the loop itself simpler.',
        aHi: 'Ek badhti \`tail\` mein baar-baar nodes jodkar ek nayi list banaana ek sthaapit \`tail\` reference hona maangta hai agle node ko jodne ke liye — par bilkul pehle node ke chune aur jode jaane se pehle, koi aisa \`tail\` reference abhi maujood nahi hai, kyunki nateeja list us bindu par abhi bhi poori tarah khaali hai. Ek dummy head node ke bina, ye ek asli khaas case banaata hai: nateeje mein joda gaya bilkul pehla node usi \`tail.next = ...\` pattern se attach nahi kiya jaa sakta jo har baad ke node ke liye istemal hota hai, kyunki us pehle attachment ke istemal ke liye abhi tak koi \`tail\` nahi hai, isliye ise iske bajaye seedhe us variable ko assign kiya jaana chahiye jo aakhirkaar list ka head darsaayega, baaki merging process se alag alag logic ke zariye. Ye alag logic sirf likhne mein asuvidhajanak nahi hai; ye ek asli, aasaani-se-galat-ho-sakne-waali asymmetry introduce karta hai jo anyatha ek akela, samaan loop hota, kyunki ek khaas case (bilkul pehli insertion) baaki har case se alag code dwara handle kiya jaata hai. Ek dummy head node ise ek shuruaati placeholder node dekar sulajhaata hai jiski apni value asal mein kabhi istemal ya return nahi ki jaati, sirf isliye maujood hai taaki ek \`tail\` reference pehle se maujood ho, is placeholder ki taraf point karte hue, merging loop shuru hone se pehle bhi. Iska matlab hai nateeje mein joda gaya bilkul pehla asli node bilkul usi \`tail.next = ...\` code istemal karke attach kiya jaa sakta hai jo har baad ka node istemal karta hai, kyunki \`tail\` pehle se hi bilkul shuru se kahin valid point karta hai, khaas case ko poori tarah khatam karte hue aur poori merging process ko ek akele, samaan loop mein kam karte hue koi alag pehla-case logic zaruri hue bina. Asli nateeja list, ek baar merging poori ho jaaye, \`dummyHead.next\` return karke access ki jaati hai \`dummyHead\` khud ke bajaye, kyunki placeholder node kabhi asli return ki gayi list ka hissa hone ke liye nahi tha, sirf ek asthaayi anchor point jisne loop khud ko saadha banaaya.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (array-conversion) and fixed (two-pointer) mergeSortedLists functions from this lesson. Test both against two sorted lists of 50,000 items each and time them using console.time/console.timeEnd.',
        taskHi: 'Is lesson ke toote (array-conversion) aur theek (two-pointer) \`mergeSortedLists\` functions dono banao. Dono ko 50,000 items ki do sorted lists ke khilaaf test karo aur unhe \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Build both sorted lists using a loop that adds increasing values, so you can be certain each one is genuinely sorted going into the merge.',
        hintHi: 'Dono sorted lists ek loop istemal karke banaao jo badhti values jodta hai, taaki tum nishchit ho sako ki har ek merge mein jaane se pehle sach mein sorted hai.',
      },
      {
        task: 'Trace through merging list1 = [1, 3, 5] and list2 = [2, 4, 6] by hand using the fixed two-pointer version, writing down a, b, and tail after every single iteration, before running the code.',
        taskHi: '\`list1 = [1, 3, 5]\` aur \`list2 = [2, 4, 6]\` ko theek two-pointer version istemal karke haath se trace karo, har akeli iteration ke baad \`a\`, \`b\`, aur \`tail\` likhte hue, code chalaane se pehle.',
        hint: 'Pay particular attention to what happens at the exact moment one of the two lists runs out, and confirm your hand trace matches this lesson\'s explanation of the leftover-attaching step.',
        hintHi: 'Us bilkul pal par khaas dhyaan do jab do lists mein se ek khatam ho jaati hai, aur confirm karo ki tumhaara haath-se-trace is lesson ke bacha-hua-attach-karne-waale step ke spashteekaran se mel khaata hai.',
      },
      {
        task: 'Deliberately remove the dummy head node and rewrite the function using a separate special case for the first splice instead. Confirm it still produces correct results, then explain in a sentence why the dummy head version is preferable.',
        taskHi: 'Jaan-boojhkar dummy head node hataao aur pehle splice ke liye ek alag khaas case istemal karke function ko dobara likho iske bajaye. Confirm karo ki ye phir bhi sahi nateeje banaata hai, phir ek vaakya mein samjhaao ki dummy head version behtar kyun hai.',
        hint: 'Focus your explanation on code simplicity and the risk of the special case being handled inconsistently, rather than on performance, since both versions have identical time complexity.',
        hintHi: 'Apni samjhaaish ko code simplicity aur khaas case ke asangat roop se handle hone ke khatre par focus karo, performance par nahi, kyunki dono versions ki identical time complexity hai.',
      },
    ],

    keyTakeaways: [
      'Converting both lists to arrays and sorting the combined array from scratch works, but discards the fact that both original lists were already individually sorted, paying an unnecessary O((n+m) log(n+m)) cost.',
      'A direct two-pointer merge compares only the two lists\' current nodes at each step, since each list\'s own sorted order guarantees its current node is its smallest remaining value.',
      'A dummy head node — a placeholder whose value is never used — lets the very first splice use the exact same code as every subsequent one, avoiding a separate special case.',
      'Once either list is exhausted, the other list\'s remaining nodes are already correctly ordered and can be attached in bulk in one step, without further comparison.',
      'This lesson\'s merge step is a direct application of this course\'s Module 2 two-pointer technique to linked-list nodes, and is the literal core operation this course\'s later merge sort lesson builds on.',
      'The merge itself runs in O(n + m), a genuine improvement over re-sorting the combined data from scratch, which costs O((n+m) log(n+m)).',
    ],
    keyTakeawaysHi: [
      'Dono lists ko arrays mein badalna aur combined array ko shuru se sort karna kaam karta hai, par is tathya ko hataata hai ki dono asli lists pehle se alag-alag sorted thi, ek bekaar \`O((n+m) log(n+m))\` keemat chukaate hue.',
      'Ek seedha two-pointer merge har kadam par sirf do lists ke current nodes compare karta hai, kyunki har list ka apna sorted order guarantee karta hai ki iska current node iski sabse chhoti bachi hui value hai.',
      'Ek dummy head node — ek placeholder jiski value kabhi istemal nahi hoti — bilkul pehle splice ko bilkul wahi code istemal karne deta hai jo har baad ka istemal karta hai, ek alag khaas case se bachte hue.',
      'Ek baar koi bhi list khatam ho jaaye, doosri list ki bachi hui nodes pehle se sahi tarike se ordered hain aur ek kadam mein poori tarah attach ki jaa sakti hain, bina aur comparison ke.',
      'Is lesson ka merge step is course ke Module 2 two-pointer technique ka ek seedha application hai linked-list nodes par, aur is course ke baad ke merge sort lesson ka shaabdik core operation hai jispar ye banaaya gaya hai.',
      'Merge khud \`O(n + m)\` mein chalta hai, combined data ko shuru se dobara-sort karne se ek asli sudhaar, jo \`O((n+m) log(n+m))\` kharch karta hai.',
    ],
  },
];
