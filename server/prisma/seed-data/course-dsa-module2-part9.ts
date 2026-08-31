/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 9.
 *
 * The cyclic sort pattern: when an array of length n is supposed to contain
 * the numbers 1..n (or 0..n-1), you can put every value at "its own index"
 * with a single left-to-right pass of swaps, in O(n) time and O(1) extra
 * space. Once the array is in that canonical position, missing numbers,
 * duplicates, the first missing positive, and "find all numbers disappeared"
 * all fall out by a second linear scan.
 *
 * Broken example: reaching for a hash set (O(n) extra space) or a full sort
 * (O(n log n)) when the values are a permutation of 1..n — both work but both
 * throw away the structure that makes O(n)/O(1) possible. Also the classic
 * bug: a `while` swap loop written as an `if`, which leaves values stranded.
 *
 * NOTE for future editors: escape every inline-code backtick inside these
 * template literals, INCLUDING inside plain markdown paragraphs (the
 * `content`/`contentHi`/`simple`/`simpleHi` fields). Single-quoted string
 * fields (explain, why, q, a, task, keyTakeaways, etc.) do NOT need backticks
 * escaped — only escape apostrophes there as a SINGLE backslash (\'), never
 * doubled (\\'), which breaks the string. Run `npx tsc --noEmit -p .` after
 * writing this file, before wiring it into seed.ts. Also scan for stray
 * Devanagari/Cyrillic look-alikes and RUN every code sample in node.
 */

import type { CourseLesson } from './course-js-module1';

export const DSA_MODULE_2_PART9: CourseLesson[] = [
  {
    slug: 'cyclic-sort-finding-missing-and-duplicates',
    title: 'Cyclic Sort: Finding Missing Numbers and Duplicates in O(1) Space',
    titleHi: 'Cyclic Sort: O(1) Space Mein Missing Numbers Aur Duplicates Dhoondhna',
    description: 'Finding the one missing number in an array that should hold 1 to n by building a hash set of everything present and scanning 1 to n for the gap. It works, but it spends O(n) extra memory to rediscover a fact the array already encodes: when the values are exactly 1 to n, each value has a natural home at index value-minus-one, and putting them there needs no extra memory at all.',
    descriptionHi: 'Ek array mein ek laapata number dhoondhna jo 1 se n rakhna chahiye, maujood har cheez ka ek hash set banaakar aur gap ke liye 1 se n scan karke. Ye kaam karta hai, par ye O(n) atirikt memory kharch karta hai ek tathya dobara khojne ke liye jo array pehle se encode karti hai: jab values bilkul 1 se n hain, har value ka index value-minus-ek par ek swabhaavik ghar hai, aur unhe wahaan rakhne ko koi atirikt memory chahiye hi nahi.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 9,

    analogy: {
      en: '**Re-shelving a set of numbered library books that got shuffled on a cart, where you know book number k belongs in slot k.** The wasteful method is to keep a separate checklist: walk the cart, tick every book number you see, then read down the checklist for the one that never got ticked. That checklist is a whole second object the size of the shelf. The efficient method uses the shelf itself as the record. Start at slot one. Look at the book sitting there. If it is book one, good, move to slot two. If it is book seven, carry it to slot seven and bring back whatever was in slot seven; now look at the new book in slot one and repeat, until slot one finally holds book one. Then step to slot two and do the same. Each book gets carried to its home at most once, so the whole cart is sorted in one left-to-right sweep with no checklist. Afterwards, any slot whose book number does not match the slot number tells you something instantly — an empty-feeling slot means that book is missing, and a slot holding a book that belongs elsewhere means you have a duplicate.',
      hi: '**Numbered library books ke ek set ko dobara shelve karna jo ek cart par shuffle ho gaye, jahaan aap jaante ho ki book number k slot k mein hai.** Barbaad karne waala tarika ek alag checklist rakhna hai: cart par chalo, har book number tick karo jo aap dekhte ho, phir us ek ke liye checklist padho jo kabhi tick nahi hua. Wo checklist shelf ke size ki ek poori doosri cheez hai. Efficient tarika shelf ko hi record ki tarah istemal karta hai. Slot ek par shuru karo. Wahaan baithi book dekho. Agar wo book ek hai, achha, slot do par jaao. Agar wo book saat hai, use slot saat par le jaao aur wapas laao jo bhi slot saat mein tha; ab slot ek mein nayi book dekho aur dohraao, jab tak slot ek mein aakhirkaar book ek na ho. Phir slot do par jaao aur wahi karo. Har book apne ghar zyaada se zyaada ek baar le jaayi jaati hai, isliye poora cart ek left-to-right sweep mein sort hota hai bina checklist. Uske baad, koi bhi slot jiski book number slot number se match nahi karti aapko turant kuch batati hai — ek khaali-mehsoos hone waala slot matlab wo book missing hai, aur ek slot jo ek book rakhta hai jo kahin aur hai matlab aapke paas ek duplicate hai.',
    },

    simple: `**Start broken.** Hash set for the missing number; and the classic \`if\`-instead-of-\`while\` swap bug:

\`\`\`js
// works, but O(n) extra space for something the array already tells you
function missingNumberSet(nums) {
  const seen = new Set(nums);
  for (let i = 0; i <= nums.length; i++) if (!seen.has(i)) return i;
}

// the tempting O(1)-space attempt, written with 'if' — BROKEN
function cyclicSortBroken(nums) {
  for (let i = 0; i < nums.length; i++) {
    const target = nums[i] - 1;
    if (nums[i] !== nums[target]) {          // BUG: only swaps ONCE per index
      [nums[i], nums[target]] = [nums[target], nums[i]];
    }
  }
  return nums;
}

console.log(cyclicSortBroken([2, 3, 4, 1]));
// i=0: nums[0]=2, swap with index 1 -> [3, 2, 4, 1]. MOVE ON to i=1.
// But nums[0] is now 3, which belongs at index 2 and is never re-checked.
// i=1: already home. i=2: swap 4 with index 3 -> [3, 2, 1, 4]. i=3: home.
// Result: [3, 2, 1, 4], not sorted — the 3 and 1 are stranded.
\`\`\`

The hash set is correct but wasteful: when the values are a permutation of \`1..n\`, the array *is* its own lookup table. The \`if\` version fails because after one swap, index \`i\` often holds another out-of-place value that also needs moving — you must keep swapping at \`i\` until the value there is correct.

**The fix: cyclic sort — a \`while\` swap loop, one pass**

\`\`\`js
function cyclicSort(nums) {
  let i = 0;
  while (i < nums.length) {
    const target = nums[i] - 1;               // value v wants to live at index v-1
    if (nums[i] !== nums[target]) {            // not already in place (and not a dup)
      [nums[i], nums[target]] = [nums[target], nums[i]];
      // DO NOT advance i — the value we just swapped in also needs checking
    } else {
      i++;                                     // this slot is settled; move on
    }
  }
  return nums;
}

console.log(cyclicSort([3, 1, 5, 4, 2]));      // [1, 2, 3, 4, 5]
console.log(cyclicSort([2, 3, 1]));            // [1, 2, 3]
\`\`\`

\`\`\`ts
function cyclicSort(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const target = nums[i]! - 1;
    if (nums[i] !== nums[target]) {
      [nums[i], nums[target]] = [nums[target]!, nums[i]!];
    } else {
      i++;
    }
  }
  return nums;
}
\`\`\`

Each swap sends a value to its correct index, so at most \`n\` swaps happen across the whole run — the \`while\` never spins forever. Compare \`nums[i]\` with \`nums[target]\` (not with \`target\`) so that duplicates, which would swap forever, are detected and skipped. O(n) time, O(1) extra space.`,

    simpleHi: `**Toote hue se shuru.** Missing number ke liye hash set; aur classic \`if\`-ke-bajaye-\`while\` swap bug:

\`\`\`js
// kaam karta hai, par O(n) atirikt space kisi cheez ke liye jo array pehle se batati hai
function missingNumberSet(nums) {
  const seen = new Set(nums);
  for (let i = 0; i <= nums.length; i++) if (!seen.has(i)) return i;
}

// lubhaawana O(1)-space prayaas, 'if' ke saath likha — TOOTA
function cyclicSortBroken(nums) {
  for (let i = 0; i < nums.length; i++) {
    const target = nums[i] - 1;
    if (nums[i] !== nums[target]) {          // BUG: prati index sirf EK BAAR swap karta hai
      [nums[i], nums[target]] = [nums[target], nums[i]];
    }
  }
  return nums;
}

console.log(cyclicSortBroken([2, 3, 4, 1]));
// i=0: nums[0]=2, index 1 se swap -> [3, 2, 4, 1]. i=1 par AAGE BADHO.
// Par nums[0] ab 3 hai, jo index 2 par hai aur kabhi dobara check nahi hota.
// i=1: pehle se ghar par. i=2: 4 ko index 3 se swap -> [3, 2, 1, 4]. i=3: ghar par.
// Result: [3, 2, 1, 4], sorted nahi — 3 aur 1 atke hue hain.
\`\`\`

Hash set sahi hai par barbaad: jab values \`1..n\` ka ek permutation hain, array *hi* apni lookup table hai. \`if\` version fail hota hai kyunki ek swap ke baad, index \`i\` aksar ek aur out-of-place value rakhta hai jise bhi move karna hai — aapko \`i\` par swap karte rehna hoga jab tak wahaan ki value sahi na ho.

**Fix: cyclic sort — ek \`while\` swap loop, ek pass**

\`\`\`js
function cyclicSort(nums) {
  let i = 0;
  while (i < nums.length) {
    const target = nums[i] - 1;               // value v index v-1 par rehna chahti hai
    if (nums[i] !== nums[target]) {            // pehle se jagah par nahi (aur ek dup nahi)
      [nums[i], nums[target]] = [nums[target], nums[i]];
      // i AAGE MAT BADHAO — jo value humne abhi swap ki use bhi check karna hai
    } else {
      i++;                                     // ye slot tay ho gaya; aage badho
    }
  }
  return nums;
}

console.log(cyclicSort([3, 1, 5, 4, 2]));      // [1, 2, 3, 4, 5]
console.log(cyclicSort([2, 3, 1]));            // [1, 2, 3]
\`\`\`

\`\`\`ts
function cyclicSort(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const target = nums[i]! - 1;
    if (nums[i] !== nums[target]) {
      [nums[i], nums[target]] = [nums[target]!, nums[i]!];
    } else {
      i++;
    }
  }
  return nums;
}
\`\`\`

Har swap ek value ko iske sahi index par bhejta hai, isliye poore run mein zyaada se zyaada \`n\` swaps hote hain — \`while\` kabhi hamesha nahi ghoomta. \`nums[i]\` ko \`nums[target]\` se compare karo (\`target\` se nahi) taaki duplicates, jo hamesha swap karte, pakde aur skip ho jaayein. O(n) time, O(1) atirikt space.`,

    content: `## Why the swap loop is O(n), not O(n^2)

\`\`\`
Every swap places at least one value at its final correct index.
There are only n indices to fill, so there are at most n swaps in TOTAL,
across all iterations of the while loop.

When no swap happens, i advances. i advances at most n times.
So the loop body runs at most 2n times -> O(n).
\`\`\`

This is the same amortised argument as the two-pointer and monotonic-stack lessons: a step that looks like it could repeat is bounded because each repeat makes irreversible progress (a value reaching its home).

## After the sort: five problems, one scan each

\`\`\`js
// 1. MISSING NUMBER (array holds 0..n with one gap) — first index where nums[i] != i
function missingNumber(nums) {
  cyclicSort0(nums);                     // 0-indexed variant: target = nums[i]
  for (let i = 0; i < nums.length; i++) if (nums[i] !== i) return i;
  return nums.length;
}

// 2. FIND ALL NUMBERS DISAPPEARED (1..n, some missing, some duplicated)
function findDisappeared(nums) {
  cyclicSort(nums);
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] !== i + 1) out.push(i + 1);
  return out;
}

// 3. FIND THE DUPLICATE(S) — index i where nums[i] != i+1 holds the duplicate
function findDuplicates(nums) {
  cyclicSort(nums);
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] !== i + 1) out.push(nums[i]);
  return out;
}

// 4. FIRST MISSING POSITIVE (unbounded ints; ignore anything outside 1..n)
function firstMissingPositive(nums) {
  let i = 0;
  while (i < nums.length) {
    const t = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[t]) {
      [nums[i], nums[t]] = [nums[t], nums[i]];
    } else i++;
  }
  for (let k = 0; k < nums.length; k++) if (nums[k] !== k + 1) return k + 1;
  return nums.length + 1;
}

// 5. SET MISMATCH — the one number that is duplicated AND the one that is missing
function findErrorNums(nums) {
  cyclicSort(nums);
  for (let i = 0; i < nums.length; i++)
    if (nums[i] !== i + 1) return [nums[i], i + 1];   // [duplicated, missing]
  return [];
}
\`\`\`

\`\`\`
The 0-indexed helper for "missing number" (values 0..n):
  function cyclicSort0(nums) {
    let i = 0;
    while (i < nums.length) {
      const t = nums[i];                              // value v -> index v
      if (nums[i] < nums.length && nums[i] !== nums[t]) [nums[i], nums[t]] = [nums[t], nums[i]];
      else i++;
    }
  }
\`\`\`

## The guard conditions, and why each is there

\`\`\`
nums[i] !== nums[target]     -> stops infinite swapping when there is a DUPLICATE
                               (two equal values both want the same slot)
nums[i] > 0                  -> "first missing positive": ignore zero and negatives
nums[i] <= n                 -> "first missing positive": ignore values too big to
                               have a home in this array
\`\`\`

Comparing \`nums[i]\` against \`nums[target]\` rather than against \`target + 1\` is the subtle key. If two slots both contain the value 3, then after one lands at index 2, the other still reads \`nums[i] === 3\` but \`nums[target] === nums[2] === 3\` too — equal, so the loop stops instead of swapping 3 with itself forever.

## The recognition checklist

\`\`\`
"array of length n contains numbers in the range 1..n (or 0..n-1)"   cyclic sort
"...find the missing one / the duplicate / all missing / all dups"    sort, then one scan
"first missing positive integer"                                      cyclic sort with the
                                                                      >0 and <=n guards
"do it in O(n) time and O(1) extra space"                             this is the ask for it
"you may not modify the array"                                        cannot use cyclic sort —
                                                                      use Floyd cycle detection
                                                                      (Module 4) on nums-as-links

Interview tell: the value range is tied to the array length. That coupling is
what lets "value -> index" be a total function with no collisions (unless there
is a duplicate, which is often exactly what you are asked to find).
\`\`\``,

    contentHi: `## Swap loop O(n) kyun hai, O(n^2) nahi

\`\`\`
Har swap kam se kam ek value ko iske antim sahi index par rakhta hai.
Bharne ko sirf n indices hain, isliye KUL mein zyaada se zyaada n swaps hain,
while loop ke sab iterations par.

Jab koi swap nahi hota, i aage badhta hai. i zyaada se zyaada n baar aage badhta hai.
Toh loop body zyaada se zyaada 2n baar chalta hai -> O(n).
\`\`\`

Ye two-pointer aur monotonic-stack lessons jaisa hi amortised argument hai: ek step jo dikhta hai ki dohra sakta hai wo bound hai kyunki har dohraav irreversible pragati karta hai (ek value apne ghar pahunchti hai).

## Sort ke baad: paanch problems, har ek ek scan

\`\`\`js
// 1. MISSING NUMBER (array 0..n rakhta hai ek gap ke saath) — pehla index jahaan nums[i] != i
function missingNumber(nums) {
  cyclicSort0(nums);                     // 0-indexed variant: target = nums[i]
  for (let i = 0; i < nums.length; i++) if (nums[i] !== i) return i;
  return nums.length;
}

// 2. FIND ALL NUMBERS DISAPPEARED (1..n, kuch missing, kuch duplicated)
function findDisappeared(nums) {
  cyclicSort(nums);
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] !== i + 1) out.push(i + 1);
  return out;
}

// 3. FIND THE DUPLICATE(S) — index i jahaan nums[i] != i+1 duplicate rakhta hai
function findDuplicates(nums) {
  cyclicSort(nums);
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] !== i + 1) out.push(nums[i]);
  return out;
}

// 4. FIRST MISSING POSITIVE (unbounded ints; 1..n ke baahar kuch bhi anadekha karo)
function firstMissingPositive(nums) {
  let i = 0;
  while (i < nums.length) {
    const t = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[t]) {
      [nums[i], nums[t]] = [nums[t], nums[i]];
    } else i++;
  }
  for (let k = 0; k < nums.length; k++) if (nums[k] !== k + 1) return k + 1;
  return nums.length + 1;
}

// 5. SET MISMATCH — wo ek number jo duplicated hai AUR wo jo missing hai
function findErrorNums(nums) {
  cyclicSort(nums);
  for (let i = 0; i < nums.length; i++)
    if (nums[i] !== i + 1) return [nums[i], i + 1];   // [duplicated, missing]
  return [];
}
\`\`\`

\`\`\`
"missing number" ke liye 0-indexed helper (values 0..n):
  function cyclicSort0(nums) {
    let i = 0;
    while (i < nums.length) {
      const t = nums[i];                              // value v -> index v
      if (nums[i] < nums.length && nums[i] !== nums[t]) [nums[i], nums[t]] = [nums[t], nums[i]];
      else i++;
    }
  }
\`\`\`

## Guard conditions, aur har ek kyun hai

\`\`\`
nums[i] !== nums[target]     -> jab ek DUPLICATE ho tab infinite swapping rokta hai
                               (do barabar values dono usi slot ko chahti hain)
nums[i] > 0                  -> "first missing positive": zero aur negatives anadekha karo
nums[i] <= n                 -> "first missing positive": is array mein ghar rakhne ke liye
                               bahut badi values anadekha karo
\`\`\`

\`nums[i]\` ko \`nums[target]\` ke against compare karna \`target + 1\` ke bajaye sookshm key hai. Agar do slots dono value 3 rakhte hain, toh ek ke index 2 par pahunchne ke baad, doosra abhi bhi \`nums[i] === 3\` padhta hai par \`nums[target] === nums[2] === 3\` bhi — barabar, isliye loop hamesha 3 ko khud se swap karne ke bajaye ruk jaata hai.

## Pehchaanne ki checklist

\`\`\`
"n lambaayi ka array 1..n (ya 0..n-1) range mein numbers rakhta hai"   cyclic sort
"...missing one / duplicate / all missing / all dups dhoondho"          sort, phir ek scan
"first missing positive integer"                                        >0 aur <=n guards ke
                                                                        saath cyclic sort
"O(n) time aur O(1) extra space mein karo"                              yahi iski maang hai
"aap array modify nahi kar sakte"                                       cyclic sort istemal nahi
                                                                        kar sakte — nums-as-links
                                                                        par Floyd cycle detection
                                                                        (Module 4)

Interview sanket: value range array length se judi hai. Wo coupling wo hai jo
"value -> index" ko bina collisions ke ek total function banaata hai (jab tak
ek duplicate na ho, jo aksar bilkul wahi hai jo aapse dhoondhne ko kaha jaata).
\`\`\``,

    examples: [
      {
        title: 'Broken: if-swap leaves values stranded',
        titleHi: 'Toota: if-swap values ko atkaa deta hai',
        code: `if (nums[i] !== nums[target]) { swap(i, target); }   // then i++ unconditionally`,
        codeJs: `function cyclicSortBroken(nums) {
  for (let i = 0; i < nums.length; i++) {
    const target = nums[i] - 1;
    if (nums[i] !== nums[target]) [nums[i], nums[target]] = [nums[target], nums[i]];
  }
  return nums;
}
console.log(cyclicSortBroken([2, 3, 4, 1]));    // [3, 2, 1, 4] — not sorted
console.log(cyclicSortBroken([2, 4, 1, 5, 3])); // [1, 2, 4, 3, 5] — stranded values`,
        codeTs: `function cyclicSortBroken(nums: number[]): number[] {
  for (let i = 0; i < nums.length; i++) {
    const target = nums[i]! - 1;
    if (nums[i] !== nums[target]) [nums[i], nums[target]] = [nums[target]!, nums[i]!];
  }
  return nums;
}`,
        outputJs: `[ 3, 2, 1, 4 ]
[ 1, 2, 4, 3, 5 ]`,
        outputTs: `// Both wrong — the for loop advances i even when the value it swapped in
// still needs to move.`,
        explain: 'On [2,3,4,1], i=0 swaps 2 to index 1, leaving 3 at index 0. The for loop then moves to i=1, so the 3 sitting at index 0 (which belongs at index 2) is never re-checked. A per-index single swap cannot settle a chain of misplaced values.',
        explainHi: '[2,3,4,1] par, i=0, 2 ko index 1 par swap karta hai, 3 ko index 0 par chhodte hue. For loop phir i=1 par jaata hai, isliye index 0 par baitha 3 (jo index 2 par hai) kabhi dobara check nahi hota. Ek prati-index akela swap misplaced values ki ek chain nahi tay kar sakta.',
      },
      {
        title: 'Fixed: while-swap, one pass, O(1) space',
        titleHi: 'Theek: while-swap, ek pass, O(1) space',
        code: `while (i < n) {
  const t = nums[i] - 1;
  if (nums[i] !== nums[t]) swap(i, t);   // stay at i
  else i++;
}`,
        codeJs: `function cyclicSort(nums) {
  let i = 0, swaps = 0;
  while (i < nums.length) {
    const t = nums[i] - 1;
    if (nums[i] !== nums[t]) { [nums[i], nums[t]] = [nums[t], nums[i]]; swaps++; }
    else i++;
  }
  return { nums, swaps };
}
console.log(cyclicSort([3, 1, 5, 4, 2]));
console.log(cyclicSort([2, 3, 1, 5, 4]));
console.log(cyclicSort([1, 2, 3, 4, 5]));   // already sorted -> 0 swaps`,
        codeTs: `function cyclicSort(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const t = nums[i]! - 1;
    if (nums[i] !== nums[t]) [nums[i], nums[t]] = [nums[t]!, nums[i]!];
    else i++;
  }
  return nums;
}`,
        outputJs: `{ nums: [ 1, 2, 3, 4, 5 ], swaps: 3 }
{ nums: [ 1, 2, 3, 4, 5 ], swaps: 4 }
{ nums: [ 1, 2, 3, 4, 5 ], swaps: 0 }`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'The while loop stays at index i, swapping repeatedly, until the value there belongs there. Total swaps never exceed n because each one lands a value permanently. An already-sorted array does zero swaps and n advances.',
        explainHi: 'While loop index i par rehta hai, baar-baar swap karte hue, jab tak wahaan ki value wahaan na ho. Kul swaps kabhi n se zyaada nahi hote kyunki har ek ek value ko sthaayi roop se landing deta hai. Ek pehle-se-sorted array zero swaps aur n advances karta hai.',
      },
      {
        title: 'First missing positive: guards for out-of-range values',
        titleHi: 'First missing positive: out-of-range values ke liye guards',
        code: `if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[nums[i] - 1]) swap(...)`,
        codeJs: `function firstMissingPositive(nums) {
  const n = nums.length;
  let i = 0;
  while (i < n) {
    const t = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[t]) {
      [nums[i], nums[t]] = [nums[t], nums[i]];
    } else i++;
  }
  for (let k = 0; k < n; k++) if (nums[k] !== k + 1) return k + 1;
  return n + 1;
}
console.log(firstMissingPositive([3, 4, -1, 1]));   // 2
console.log(firstMissingPositive([1, 2, 0]));       // 3
console.log(firstMissingPositive([7, 8, 9, 11, 12]));// 1
console.log(firstMissingPositive([1]));             // 2`,
        codeTs: `function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  let i = 0;
  while (i < n) {
    const t = nums[i]! - 1;
    if (nums[i]! > 0 && nums[i]! <= n && nums[i] !== nums[t]) {
      [nums[i], nums[t]] = [nums[t]!, nums[i]!];
    } else i++;
  }
  for (let k = 0; k < n; k++) if (nums[k] !== k + 1) return k + 1;
  return n + 1;
}`,
        outputJs: `2
3
1
2`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Values <= 0 or > n have no home in a length-n array, so the guards skip them (i just advances). Everything in 1..n gets cyclic-sorted into place; the first index where nums[k] != k+1 is the smallest absent positive, or n+1 if 1..n are all present.',
        explainHi: 'Values <= 0 ya > n ka ek length-n array mein koi ghar nahi, isliye guards unhe skip karte hain (i bas aage badhta hai). 1..n mein sab kuch cyclic-sort hokar jagah par aata hai; pehla index jahaan nums[k] != k+1 sabse chhota anupasthit positive hai, ya n+1 agar 1..n sab maujood hain.',
      },
    ],

    mistakes: [
      {
        wrong: `// the swap loop as an 'if' inside a 'for' — advances i too early
for (let i = 0; i < n; i++) {
  const t = nums[i] - 1;
  if (nums[i] !== nums[t]) swap(i, t);
}`,
        right: `let i = 0;
while (i < n) {
  const t = nums[i] - 1;
  if (nums[i] !== nums[t]) swap(i, t);   // stay at i and swap again
  else i++;                              // only advance when i is settled
}`,
        why: 'After a swap, index i holds a new value that is also probably out of place. An if-in-a-for advances past it, stranding that value. The while loop keeps working at i until the value there is nums[i] === i + 1, then moves on. Total swaps are still bounded by n.',
        whyHi: 'Ek swap ke baad, index i ek nayi value rakhta hai jo shaayad out of place bhi hai. Ek if-in-a-for iske aage badh jaata hai, us value ko atkaate hue. While loop i par kaam karta rehta hai jab tak wahaan ki value nums[i] === i + 1 na ho, phir aage badhta hai. Kul swaps abhi bhi n se bound hain.',
      },
      {
        wrong: `// comparing nums[i] to the target index instead of to nums[target]
if (nums[i] !== target + 1) swap(i, target);
// with a duplicate, this swaps 3 with 3 forever -> infinite loop`,
        right: `if (nums[i] !== nums[target]) swap(i, target);
// when both slots hold 3, nums[i] === nums[target], so the loop stops`,
        why: 'The termination guard has to detect "the slot I want already holds my value" — which is a duplicate. Checking nums[i] against nums[target] catches that: if they are equal, swapping is pointless and the loop advances. Checking against target + 1 keeps trying to place a value whose home is occupied by its own twin, spinning forever.',
        whyHi: 'Termination guard ko "jo slot main chahta hoon wo pehle se meri value rakhta hai" pakadna hota hai — jo ek duplicate hai. nums[i] ko nums[target] ke against check karna use pakadta hai: agar wo barabar hain, swap karna bekaar hai aur loop aage badhta hai. target + 1 ke against check karna ek aisi value rakhne ki koshish karta rehta hai jiska ghar iske apne twin se occupied hai.',
      },
      {
        wrong: `// using cyclic sort when the array must not be modified
cyclicSort(nums);   // problem says "read-only" or "do not modify the input"`,
        right: `// read-only + find the duplicate -> treat nums as a linked list (i -> nums[i])
// and use Floyd's tortoise-and-hare cycle detection (Module 4 lesson 3)`,
        why: 'Cyclic sort works by permuting the array in place, so it is off the table if the input is immutable. The "find the duplicate without modifying the array and in O(1) space" problem is solved instead by viewing each value as a pointer to the next index and finding the cycle entrance with fast/slow pointers.',
        whyHi: 'Cyclic sort array ko in place permute karke kaam karta hai, isliye ye baahar hai agar input immutable hai. "Array modify kiye bina aur O(1) space mein duplicate dhoondho" problem iske bajaye har value ko agle index ke ek pointer ki tarah dekhkar aur fast/slow pointers se cycle entrance dhoondhkar solve hoti hai.',
      },
    ],

    realWorld: [
      {
        en: '**Validating ID sequences** — checking that a batch of records numbered 1..n arrived complete, or spotting which IDs are missing or duplicated in a shipment manifest — is exactly the cyclic-sort scan, and the O(1) space matters when n is huge.',
        hi: '**ID sequences validate karna** — ye check karna ki 1..n numbered records ka ek batch poora aaya, ya ek shipment manifest mein kaunse IDs missing ya duplicated hain spot karna — bilkul cyclic-sort scan hai, aur O(1) space maayne rakhta hai jab n vishaal ho.',
      },
      {
        en: '**In-place array rearrangement** in embedded or memory-constrained systems — where allocating a second array of size n is not an option — uses the value-goes-to-its-index swap loop as a general permutation-applying primitive.',
        hi: '**Embedded ya memory-constrained systems mein in-place array rearrangement** — jahaan size n ka ek doosra array allocate karna ek vikalp nahi — value-goes-to-its-index swap loop ko ek general permutation-lagane waale primitive ki tarah istemal karta hai.',
      },
      {
        en: '**Detecting gaps in auto-increment keys** — a database task where a table should hold rows 1..n and you need the first free slot to reuse — is "first missing positive" over the key column.',
        hi: '**Auto-increment keys mein gaps pakadna** — ek database task jahaan ek table ko rows 1..n rakhni chahiye aur aapko reuse karne ke liye pehla free slot chahiye — key column par "first missing positive" hai.',
      },
    ],

    interviewQA: [
      {
        q: 'When do you use cyclic sort, and why does it beat a hash set for "find the missing number in 1..n"?',
        qHi: 'Aap cyclic sort kab istemal karte ho, aur "1..n mein missing number dhoondho" ke liye ye ek hash set ko kyun haraata hai?',
        a: 'The trigger is a specific structural coincidence: you have an array of length n, and its values are known to be drawn from the range 1 to n, or 0 to n minus 1 — a permutation, possibly with one missing and one duplicated. When that holds, every value has a unique natural home: the value v belongs at index v minus one. You can move every value to its home with a single left-to-right pass. At each index, look at the value there; if it is already home, advance; otherwise swap it to where it belongs and, crucially, stay at the current index and repeat, because the value you just swapped in also needs placing. The reason this is linear rather than quadratic is that each swap permanently seats one value at its final position, and there are only n positions, so there are at most n swaps in total no matter how the loop iterates. After the pass, the array is sorted, and a second linear scan reads off the answer: the first index where the value does not equal index plus one is exactly where the missing number should be, and the value sitting there wrongly is the duplicate. Against a hash set, the comparison is purely about space. The hash set approach is also linear time — insert everything, then scan 1 to n for the absent key — but it allocates a second data structure of size n. Cyclic sort uses no extra memory beyond a couple of loop variables, because it treats the input array itself as the lookup table. Interviewers who add the constraint "O(1) extra space" or "do it in place" are specifically steering you away from the hash set and toward this pattern. The one situation where cyclic sort is disqualified is when the array is read-only; then, for the find-the-duplicate variant, you switch to treating the values as linked-list pointers and use Floyd\'s cycle detection.',
        aHi: 'Trigger ek khaas sanrachnaatmak samyog hai: aapke paas n lambaayi ka ek array hai, aur iski values 1 se n, ya 0 se n minus ek range se li gayi jaani jaati hain — ek permutation, shaayad ek missing aur ek duplicated ke saath. Jab wo tikta hai, har value ka ek anokha swabhaavik ghar hai: value v index v minus ek par hai. Aap har value ko iske ghar ek akele left-to-right pass se le jaa sakte ho. Har index par, wahaan ki value dekho; agar wo pehle se ghar par hai, aage badho; warna use wahaan swap karo jahaan wo hai aur, mahatvapurna, current index par raho aur dohraao, kyunki jo value aapne abhi swap ki use bhi place karna hai. Ye linear kyun hai quadratic nahi iska kaaran ye hai ki har swap sthaayi roop se ek value ko iski antim position par bithaata hai, aur sirf n positions hain, isliye kul mein zyaada se zyaada n swaps hain chahe loop kaise bhi iterate kare. Pass ke baad, array sorted hai, aur ek doosra linear scan jawaab padh leta hai. Ek hash set ke against, tulna poori tarah space ke baare mein hai. Hash set approach bhi linear time hai — sab kuch insert karo, phir absent key ke liye 1 se n scan karo — par ye size n ka ek doosra data structure allocate karta hai. Cyclic sort kuch loop variables se aage koi atirikt memory istemal nahi karta.',
      },
      {
        q: 'Walk through the guard "nums[i] !== nums[target]". Why not "nums[i] !== target + 1"?',
        qHi: '"nums[i] !== nums[target]" guard ke through chalo. "nums[i] !== target + 1" kyun nahi?',
        a: 'Both expressions are trying to answer the same question — "does the value at index i still need to move" — but they behave differently when the array contains a duplicate, which is exactly the case many of these problems are about. Consider the target-plus-one form first. It says: swap unless the value here already equals index-here plus one, meaning unless it is already home. That sounds right, and for a true permutation with no duplicates it is fine. But suppose the value 3 appears twice. The first 3 gets cyclic-sorted to index 2, where it belongs. Now the loop reaches the second 3 at some index i. Its target is index 2. The value at i is 3, and 3 is not equal to i plus one for any i other than 2, so the target-plus-one test says "not home, swap". It swaps the second 3 into index 2 — but index 2 already holds a 3, so the swap just exchanges 3 with 3, the array does not change, and the loop condition is still true, so it swaps again, forever. That is an infinite loop. The nums-of-target form fixes this by asking a subtly different question: "is the slot I want to swap into already holding my value". It compares the value at i against the value at target. When both are 3, those are equal, so the guard is false, no swap happens, and the loop advances past this index. The second 3 is left stranded at index i, which is precisely what you want — the final scan will see nums[i] is not i plus one and report i plus one as missing and 3 as the duplicate. So the nums-of-target comparison is not just a stylistic choice; it is the termination guarantee in the presence of duplicates, and duplicates are usually the whole point of the problem.',
        aHi: 'Dono expressions wahi sawaal ka jawaab dene ki koshish kar rahe hain — "kya index i par value ko abhi bhi move karna hai" — par wo alag vyavhaar karte hain jab array mein ek duplicate ho, jo bilkul wo case hai jiske baare mein in problems mein se kayi hain. Pehle target-plus-one form par vichaar karo. Ye kehta hai: swap karo jab tak yahaan ki value pehle se yahaan-ke-index plus ek ke barabar na ho, matlab jab tak wo pehle se ghar par na ho. Wo sahi lagta hai, aur bina duplicates ke ek asli permutation ke liye theek hai. Par maano value 3 do baar aati hai. Pehla 3 cyclic-sort hokar index 2 par aata hai, jahaan wo hai. Ab loop kisi index i par doosre 3 tak pahunchta hai. Iska target index 2 hai. i par value 3 hai, aur 3 kisi bhi i ke liye i plus ek ke barabar nahi hai sivaay 2 ke, isliye target-plus-one test kehta hai "ghar par nahi, swap karo". Ye doosre 3 ko index 2 mein swap karta hai — par index 2 pehle se ek 3 rakhta hai, isliye swap bas 3 ko 3 se badalta hai, array nahi badalta, aur loop condition abhi bhi true hai, isliye ye phir swap karta hai, hamesha. Nums-of-target form ise ek sookshm roop se alag sawaal poochhkar theek karta hai: "jo slot main swap karna chahta hoon wo pehle se meri value rakhta hai". Jab dono 3 hain, wo barabar hain, isliye guard false hai, koi swap nahi hota.',
      },
    ],

    exercises: [
      {
        task: 'Implement cyclicSort with the while loop and a swap counter. Verify [3,1,5,4,2] sorts with 3 swaps, [5,4,3,2,1] sorts, and [1,2,3,4,5] does 0 swaps. Then rewrite it as an if inside a for and show [2,3,4,1] comes out as [3,2,1,4].',
        taskHi: 'cyclicSort ko while loop aur ek swap counter ke saath implement karo. Verify karo [3,1,5,4,2] 3 swaps ke saath sort hota hai, [5,4,3,2,1] sort hota hai, aur [1,2,3,4,5] 0 swaps karta hai. Phir ise ek for ke andar ek if ki tarah dobara likho aur dikhao ki [2,3,4,1] [3,2,1,4] ke roop mein nikalta hai.',
        hint: 'Count swaps and confirm it never exceeds n-1 for a permutation. The if-in-for version advances past index 0 after its first swap, so the value it displaced there never reaches its home.',
        hintHi: 'Swaps gino aur confirm karo ki ek permutation ke liye ye kabhi n-1 se zyaada nahi hota. If-in-for version apne pehle swap ke baad index 0 ke aage badhta hai, isliye jo value usne wahaan displace ki wo kabhi apne ghar nahi pahunchti.',
      },
      {
        task: 'Implement findDisappeared(nums) for values in 1..n (some missing, some duplicated). Verify findDisappeared([4,3,2,7,8,2,3,1]) -> [5,6] and findDisappeared([1,1]) -> [2]. Confirm it uses no extra array beyond the output.',
        taskHi: 'findDisappeared(nums) ko 1..n mein values ke liye implement karo (kuch missing, kuch duplicated). Verify karo findDisappeared([4,3,2,7,8,2,3,1]) -> [5,6] aur findDisappeared([1,1]) -> [2]. Confirm karo ki ye output ke alawa koi extra array istemal nahi karta.',
        hint: 'After cyclic sort, [4,3,2,7,8,2,3,1] becomes [1,2,3,4,3,2,7,8] (duplicates block slots 5 and 6). The scan reports every index where nums[i] != i+1 as the missing value i+1.',
        hintHi: 'Cyclic sort ke baad, [4,3,2,7,8,2,3,1] [1,2,3,4,3,2,7,8] ban jaata hai (duplicates slots 5 aur 6 block karte hain). Scan har index jahaan nums[i] != i+1 ko missing value i+1 ki tarah report karta hai.',
      },
      {
        task: 'Implement firstMissingPositive with the >0 and <=n guards. Verify [3,4,-1,1] -> 2, [1,2,0] -> 3, [7,8,9,11,12] -> 1, [] -> 1. Then remove the "<= n" guard and find an input where the swap index goes out of bounds.',
        taskHi: 'firstMissingPositive ko >0 aur <=n guards ke saath implement karo. Verify karo [3,4,-1,1] -> 2, [1,2,0] -> 3, [7,8,9,11,12] -> 1, [] -> 1. Phir "<= n" guard hataao aur ek input dhoondho jahaan swap index out of bounds jaata hai.',
        hint: 'On [7,8,9,11,12] with n=5, the value 7 has target index 6, which does not exist. The <= n guard skips it; without the guard, nums[6] is undefined and the swap corrupts the array or throws.',
        hintHi: '[7,8,9,11,12] par n=5 ke saath, value 7 ka target index 6 hai, jo maujood nahi. <= n guard ise skip karta hai; guard ke bina, nums[6] undefined hai aur swap array ko corrupt karta hai ya throw karta hai.',
      },
    ],

    keyTakeaways: [
      'Cyclic sort applies when a length-n array holds values from 1..n (or 0..n-1). Each value v has a home at index v-1, and one left-to-right swap pass puts them all there in O(n) time, O(1) extra space.',
      'Write the swap as a WHILE loop that stays at index i until nums[i] is correct, then advances. An "if" inside a "for" advances too early and strands values.',
      'The termination guard is nums[i] !== nums[target], NOT nums[i] !== target + 1. The nums-vs-nums form detects duplicates (both slots hold the same value) and stops instead of swapping forever.',
      'It is O(n): every swap seats a value at its final index permanently, so total swaps <= n regardless of loop structure — the same amortised argument as two pointers.',
      'After the sort, one linear scan solves the family: first index where nums[i] != i+1 gives the missing number; the value there is the duplicate; collect all such indices for "all missing / all duplicates".',
      '"First missing positive" adds two guards — nums[i] > 0 and nums[i] <= n — to skip values with no home in the array, then scans for the first nums[k] != k+1.',
      'If the array is read-only, cyclic sort is out. For "find the duplicate" without modifying the input, treat values as linked-list pointers and use Floyd cycle detection (Module 4).',
    ],
    keyTakeawaysHi: [
      'Cyclic sort tab lagta hai jab ek length-n array 1..n (ya 0..n-1) se values rakhta hai. Har value v ka index v-1 par ek ghar hai, aur ek left-to-right swap pass unhe sabko wahaan O(n) time, O(1) extra space mein rakhta hai.',
      'Swap ko ek WHILE loop ki tarah likho jo index i par rehta hai jab tak nums[i] sahi na ho, phir aage badhta hai. Ek "for" ke andar ek "if" bahut jaldi aage badhta hai aur values ko atkaa deta hai.',
      'Termination guard nums[i] !== nums[target] hai, nums[i] !== target + 1 NAHI. Nums-vs-nums form duplicates pakadta hai (dono slots ek hi value rakhte hain) aur hamesha swap karne ke bajaye rukta hai.',
      'Ye O(n) hai: har swap ek value ko iske antim index par sthaayi roop se bithaata hai, isliye kul swaps <= n loop structure chahe kuch bhi ho — two pointers jaisa hi amortised argument.',
      'Sort ke baad, ek linear scan family solve karta hai: pehla index jahaan nums[i] != i+1 missing number deta hai; wahaan ki value duplicate hai; "all missing / all duplicates" ke liye sab aise indices ikattha karo.',
      '"First missing positive" do guards jodta hai — nums[i] > 0 aur nums[i] <= n — array mein bina ghar waali values skip karne ko, phir pehle nums[k] != k+1 ke liye scan karta hai.',
      'Agar array read-only hai, cyclic sort baahar hai. Input modify kiye bina "duplicate dhoondho" ke liye, values ko linked-list pointers ki tarah dekho aur Floyd cycle detection istemal karo (Module 4).',
    ],
  },
];
