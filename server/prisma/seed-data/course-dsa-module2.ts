/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 1.
 *
 * The two-pointer technique in its two most common shapes: opposite
 * ends closing inward (for a sorted array's pair-sum problem) and same
 * direction at different speeds (for removing duplicates from a sorted
 * array in place). Broken example: a brute-force nested loop checking
 * every pair in a SORTED array for a target sum — genuinely correct,
 * but throwing away the one piece of information (sortedness) that
 * makes an O(n) solution possible. Fixed with two pointers starting at
 * opposite ends: since the array is sorted, a sum that is too large or
 * too small tells you definitively which pointer to move, eliminating
 * an entire half of the remaining possibilities with each comparison,
 * rather than checking pairs one by one.
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

export const DSA_MODULE_2: CourseLesson[] = [
  {
    slug: 'two-pointers-technique',
    title: 'The Two-Pointer Technique',
    titleHi: 'Two-Pointer Technique',
    description: 'Given a SORTED array and a target sum, a brute-force solution checks every possible pair, one at a time, using two nested loops — completely ignoring the one fact about this array (that it is sorted) that would let it eliminate half the remaining possibilities with a single comparison.',
    descriptionHi: 'Ek SORTED array aur ek target sum diye gaye, ek brute-force solution har sambhaavit joda check karta hai, ek-ek karke, do nested loops istemal karte hue — is array ke baare mein us ek tathya (ki ye sorted hai) ko poori tarah ignore karte hue jo ise ek akele comparison se baaki adhi sambhaavnaaon ko khatam karne deta.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**Two security guards, standing at opposite ends of a single straight hallway of numbered rooms sorted in increasing order, walking toward each other and comparing notes as they go — versus one guard walking the ENTIRE hallway once for every single room, checking it against every other room individually.** The two guards, starting at opposite ends, can use the fact that the rooms are sorted to make an immediate, confident decision at every single step: if the two rooms they are currently standing at add up to more than the target they are looking for, the guard at the HIGH end knows, with certainty, that their current room is too large to be part of any valid answer with anything at the LOW guard\'s current position or anything lower, so they step inward; if the sum is too small, the LOW guard knows their current room is too small to matter anymore, so they step inward instead. This single decision, made once per step, eliminates an entire remaining half of the search space each time, and the two guards are guaranteed to meet in the middle after walking through the hallway only once, together. The one guard checking every room against every other room has no such shortcut available — without exploiting the sorted order, every single pair must be individually checked, since nothing yet rules any of them out. A brute-force nested loop over a sorted array is the one exhausted guard, checking every pair one by one; two pointers starting at opposite ends and closing inward is the two coordinated guards, using the array\'s own sorted order to eliminate half the remaining possibilities with a single comparison at every step.',
      hi: '**Do security guards, ek akeli seedhi hallway ke virudh sirron par khade, numbered rooms ke saath jo badhte order mein sorted hain, ek doosre ki taraf chalte hue aur chalte-chalte notes compare karte hue — versus ek guard poori HALLWAY ko ek baar chalta hai har akele room ke liye, ise har doosre room se alag-alag check karte hue.** Do guards, virudh sirron se shuru hote hue, is tathya ka istemal kar sakte hain ki rooms sorted hain har akele kadam par ek turant, bharosemand faisla lene ke liye: agar wo do rooms jahan ve abhi khade hain target se zyaada add karte hain jise wo dhoondh rahe hain, HIGH end wala guard nishchit roop se jaanta hai ki unka current room LOW guard ki current position ya kisi bhi neeche ki cheez ke saath kisi bhi valid jawaab ka hissa hone ke liye bahut bada hai, isliye wo andar kadam rakhte hain; agar sum bahut chhota hai, LOW guard jaanta hai unka current room ab maayne rakhne ke liye bahut chhota hai, isliye wo iske bajaye andar kadam rakhte hain. Ye akela faisla, prati kadam ek baar liya gaya, har baar search space ka ek poora bacha hua aadha khatam karta hai, aur do guards guarantee ke saath beech mein milte hain hallway se sirf ek baar guzarne ke baad, saath. Wo ek guard jo har room ko har doosre room se check karta hai iske paas aisa koi shortcut maujood nahi hai — sorted order ka istemal kiye bina, har akele jode ko alag-alag check kiya jaana chahiye, kyunki abhi tak kuch bhi unmein se kisi ko bhi ruled out nahi karta. Ek sorted array par ek brute-force nested loop wo ek thaka guard hai, har jode ko ek-ek karke check karte hue; virudh sirron se shuru hote hue aur andar band hote hue do pointers wo do coordinated guards hain, array ke apne sorted order ka istemal karte hue har kadam par ek akele comparison se aadhi bachi hui sambhaavnaaein khatam karne ke liye.',
    },

    simple: `**Start broken.** A nested loop checking every pair, ignoring that the array is sorted:

\`\`\`js
function twoSumSorted(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
// nums = [2, 7, 11, 15], target = 9 → correctly returns [0, 1]
// but this same O(n²) approach works whether nums is sorted or not
\`\`\`

This is genuinely correct, and it is exactly the brute force this course\'s Module 1 introduced. The specific waste this lesson addresses is that the function was never told, and never uses, one crucial fact about its own input: \`nums\` is SORTED. Sortedness is real, usable information — in a sorted array, once two elements\' sum is known to be too large, every element further to the right is even larger still, so none of them could possibly help; the brute force checks them anyway, one at a time, because it has no mechanism for using what "sorted" actually implies.

**The fix: two pointers, using sortedness to eliminate half the possibilities at each step**

\`\`\`js
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;  // too small — the smallest number can't be the problem
    else right--;               // too large — the largest number can't be the problem
  }
  return [];
}
\`\`\`

\`\`\`ts
function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
\`\`\`

\`left\` starts at the smallest element, \`right\` at the largest. If their sum is too small, \`nums[left]\` genuinely cannot be part of ANY valid pair with anything at or before \`right\` (every other candidate for the right side is smaller still, making the sum even smaller) — so \`left\` moves inward, discarding it for good. If the sum is too large, the exact same logic applies to \`right\` in reverse, so it moves inward instead. Each single comparison discards one entire candidate, and the two pointers meet after at most \`n\` steps total: \`O(n)\`, not \`O(n²)\` — a direct result of actually using the fact that the array is sorted, rather than ignoring it.`,

    simpleHi: `**Toote hue se shuru.** Ek nested loop jo har jode ko check karta hai, ye ignore karte hue ki array sorted hai:

\`\`\`js
function twoSumSorted(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}
// nums = [2, 7, 11, 15], target = 9 → sahi tarike se [0, 1] return karta hai
// par ye wahi O(n²) approach kaam karta hai chahe nums sorted ho ya nahi
\`\`\`

Ye sach mein sahi hai, aur ye bilkul wahi brute force hai jise is course ke Module 1 ne introduce kiya. Khaas barbaadi jise ye lesson sambodhit karta hai wo ye hai ki function ko kabhi bataaya hi nahi gaya, aur kabhi istemal nahi karta, apne khud ke input ke baare mein ek mahatvapoorn tathya: \`nums\` SORTED hai. Sortedness asli, istemal-yogya jaankaari hai — ek sorted array mein, ek baar do elements ka sum bahut bada jaana jaata hai, daayen taraf aage har element aur bhi bada hai, isliye unmein se koi bhi madad nahi kar sakta; brute force unhe phir bhi check karta hai, ek-ek karke, kyunki iske paas "sorted" ka asal mein kya matlab hai ise istemal karne ka koi mechanism nahi hai.

**Fix: do pointers, sortedness ka istemal karke har kadam par aadhi sambhaavnaaein khatam karna**

\`\`\`js
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;  // bahut chhota — sabse chhota number samasya nahi ho sakta
    else right--;               // bahut bada — sabse bada number samasya nahi ho sakta
  }
  return [];
}
\`\`\`

\`\`\`ts
function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
\`\`\`

\`left\` sabse chhote element se shuru hota hai, \`right\` sabse bade se. Agar unka sum bahut chhota hai, \`nums[left]\` sach mein \`right\` par ya usse pehle kisi bhi cheez ke saath KISI BHI valid joda ka hissa nahi ho sakta (right side ke liye har doosra candidate aur bhi chhota hai, sum ko aur bhi chhota banaate hue) — isliye \`left\` andar move karta hai, ise hamesha ke liye discard karte hue. Agar sum bahut bada hai, bilkul wahi logic \`right\` par ulta lagu hota hai, isliye ye iske bajaye andar move karta hai. Har akela comparison ek poora candidate discard karta hai, aur do pointers zyaada se zyaada \`n\` kadam total ke baad milte hain: \`O(n)\`, \`O(n²)\` nahi — ek seedha nateeja is baat ka ki array sorted hai use asal mein istemal karna, ise ignore karne ke bajaye.`,

    content: `## The second shape: same direction, different speeds

\`\`\`js
function removeDuplicates(nums) { // nums is SORTED; return the new length
  if (nums.length === 0) return 0;
  let slow = 0; // the last position known to be part of the unique result
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
\`\`\`

Opposite-ends two pointers is one shape of this pattern; a second, equally common shape uses two pointers moving in the SAME direction, at different speeds, through a single pass. \`slow\` tracks the last position confirmed to be part of the final, duplicate-free result; \`fast\` scans ahead, looking for the next genuinely new value. Whenever \`fast\` finds a value different from what \`slow\` is currently pointing at, that value belongs in the result — \`slow\` advances one step, and the new value is written into that position, in place, using no second array at all (this course\'s earlier lesson on in-place array techniques covered exactly this style of modification). Since \`fast\` scans through the array exactly once, and \`slow\` only ever moves forward, never backward, this is a genuine \`O(n)\` solution using two pointers moving through the same array at different rates, rather than starting from opposite ends.

## Recognizing when two pointers applies: the pattern-recognition signal

\`\`\`
Signal 1: the input is SORTED (or can cheaply be sorted first), and the
          problem involves finding a pair, or comparing two positions,
          based on their combined value.

Signal 2: the problem asks for something to be done "in place", using
          a single pass, tracking a "last good position" while scanning
          ahead for the next relevant item.
\`\`\`

This course\'s Module 1 problem-solving-framework lesson taught asking "what is my brute force wastefully re-doing?" as the way to identify a pattern. For two pointers specifically, the brute force\'s waste is almost always the same shape: checking pairs or positions that a SORTED order (or a single directional scan) already rules out, one at a time, when a smarter starting position and movement rule could rule out many candidates per step instead of one. Recognizing either of the two signals above — sortedness combined with pair-finding, or an in-place single-pass rewrite — is the concrete, repeatable way to recognize that two pointers is worth reaching for, on a problem this course has never explicitly covered.

## Why two pointers requires sorted (or otherwise structured) input

\`\`\`js
// nums = [15, 2, 11, 7] — the SAME numbers as the earlier example, unsorted
// left = 0 (15), right = 3 (7): sum = 22, too big, move right → right = 2 (11)
// left = 0 (15), right = 2 (11): sum = 26, still too big, move right → right = 1 (2)
// left = 0 (15), right = 1 (2): sum = 17, too big, move right → right = 0
// loop ends: left is no longer < right, and the actual answer [2, 7] was NEVER found
\`\`\`

Two pointers\' correctness genuinely depends on the input being sorted (or on some other structural guarantee that lets a pointer be safely eliminated) — the exact same movement rule applied to an UNSORTED array can, and does, silently skip over the correct answer, since "this sum is too large, so the left pointer can\'t be the problem" is only a valid conclusion when every element to the right of \`right\` is guaranteed to be even larger, a guarantee that unsorted data does not provide. This is why identifying two pointers as the right pattern always comes paired with confirming, explicitly, that the input is sorted, or sorting it first (which this course\'s later sorting module covers, typically costing \`O(n log n)\`, still cheaper than an \`O(n²)\` brute force overall) — the technique is not a universal replacement for a nested loop, it is a specific trade that sorted structure makes possible.`,

    contentHi: `## Doosri shape: same direction, alag speeds

\`\`\`js
function removeDuplicates(nums) { // nums SORTED hai; naya length return karo
  if (nums.length === 0) return 0;
  let slow = 0; // aakhri position jo unique result ka hissa hone ke liye jaani jaati hai
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
\`\`\`

Virudh-sirron waale two pointers is pattern ki ek shape hai; ek doosri, barabar aam shape do pointers istemal karti hai jo SAME direction mein, alag speeds par, ek akele pass ke through move karte hain. \`slow\` aakhri position track karta hai jo confirm ki gayi hai ki aakhri, duplicate-free result ka hissa hai; \`fast\` aage scan karta hai, agli sach mein nayi value dhoondte hue. Jab bhi \`fast\` ek value dhoondta hai jo \`slow\` abhi kya point kar raha hai us se alag hai, wo value result mein belong karti hai — \`slow\` ek kadam aage badhta hai, aur nayi value us position mein likhi jaati hai, in place mein, bilkul koi doosra array istemal kiye bina (is course ke pehle wale in-place array techniques lesson ne bilkul is style ki modification cover ki). Kyunki \`fast\` array ke through bilkul ek baar scan karta hai, aur \`slow\` kabhi bhi sirf aage badhta hai, kabhi peeche nahi, ye ek asli \`O(n)\` solution hai jo do pointers istemal karta hai usi array ke through alag dar par move karte hue, virudh sirron se shuru karne ke bajaye.

## Pehchaanna ki two pointers kab lagu hota hai: pattern-recognition signal

\`\`\`
Signal 1: input SORTED hai (ya pehle sasta roop se sort kiya jaa sakta
          hai), aur problem ek jode dhoondhne, ya do positions ko unki
          combined value ke aadhaar par compare karne, ke baare mein hai.

Signal 2: problem kuch "in place" mein karne ko poochta hai, ek akele
          pass istemal karke, ek "aakhri achhi position" track karte
          hue jabki agla mutaalliq item ke liye aage scan karta hai.
\`\`\`

Is course ka Module 1 problem-solving-framework lesson ek pattern pehchaanne ke tarike ki tarah "mera brute force bekaar mein kya dobara kar raha hai?" poochna sikhaata hai. Two pointers ke liye khaas taur par, brute force ki barbaadi lagbhag hamesha wahi shape hai: jode ya positions check karna jinhe ek SORTED order (ya ek akela directional scan) pehle se ruled out kar deta hai, ek-ek karke, jab ek zyaada samajhdaar shuruaati position aur movement rule prati kadam ek ke bajaye kayi candidates ko ruled out kar sakta hai. Upar do signals mein se kisi ek ko pehchaanna — sortedness jode-dhoondhne ke saath mila hua, ya ek in-place single-pass rewrite — thos, dohraaye-jaane-yogya tarika hai ye pehchaanne ka ki two pointers pakadne laayak hai, ek problem par jise ye course ne kabhi explicitly cover nahi kiya.

## Two pointers ko sorted (ya anya taur par structured) input kyun chahiye

\`\`\`js
// nums = [15, 2, 11, 7] — WAHI numbers pehle wale example jaise, unsorted
// left = 0 (15), right = 3 (7): sum = 22, bahut bada, right move karo → right = 2 (11)
// left = 0 (15), right = 2 (11): sum = 26, abhi bhi bahut bada, right move karo → right = 1 (2)
// left = 0 (15), right = 1 (2): sum = 17, bahut bada, right move karo → right = 0
// loop khatam hota hai: left ab < right nahi hai, aur asli jawaab [2, 7] KABHI nahi mila
\`\`\`

Two pointers ki sahihata sach mein is baat par nirbhar karti hai ki input sorted hai (ya kisi doosre structural guarantee par jo ek pointer ko surakshit roop se eliminate hone deta hai) — bilkul wahi movement rule ek UNSORTED array par lagu ki gayi chupchaap sahi jawaab ko skip kar sakti hai, aur karti hai, kyunki "ye sum bahut bada hai, isliye left pointer samasya nahi ho sakta" sirf ek valid nateeja hai jab \`right\` ke daayen har element ke aur bhi bada hone ki guarantee hai, ek guarantee jo unsorted data pradaan nahi karta. Yahi wajah hai ki two pointers ko sahi pattern ki tarah pehchaanna hamesha explicitly confirm karne ke saath juda hota hai ki input sorted hai, ya ise pehle sort karna (jise is course ka baad ka sorting module cover karta hai, aksar \`O(n log n)\` kharch karte hue, phir bhi overall ek \`O(n²)\` brute force se sasta) — technique ek nested loop ka universal replacement nahi hai, ye ek khaas trade hai jise sorted structure mumkin banaata hai.`,

    examples: [
      {
        title: 'Broken: nested-loop pair sum, ignoring that the array is sorted',
        titleHi: 'Toota: nested-loop pair sum, ye ignore karte hue ki array sorted hai',
        code: `for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums[j] === target) return [i, j];
  }
}`,
        codeJs: `function twoSumSorted(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}
// O(n²) — never uses the fact that nums is sorted`,
        codeTs: `function twoSumSorted(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}
// fully valid TypeScript — the waste is a missed pattern, not a type error`,
        output: `twoSumSorted([2, 7, 11, 15], 9) correctly returns [0, 1], but
checks up to n*(n-1)/2 pairs to get there, regardless of sortedness.`,
        explain: 'This solution is genuinely correct but never checks or exploits whether nums is sorted, checking every pair even though sortedness would let most of them be ruled out instantly.',
        explainHi: 'Ye solution sach mein sahi hai par kabhi check ya istemal nahi karta ki \`nums\` sorted hai ya nahi, har jode ko check karte hue chahe sortedness unmein se adhikaansh ko turant ruled out kar sakti thi.',
      },
      {
        title: 'Fixed: opposite-ends two pointers, using sortedness directly',
        titleHi: 'Theek: virudh-sirron waale two pointers, sortedness ka seedhe istemal',
        code: `let left = 0, right = nums.length - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum < target) left++; else right--;
}`,
        codeJs: `function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
        codeTs: `function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
        outputJs: `twoSumSorted([2, 7, 11, 15], 9) returns [0, 1] in at most n steps
total, since each comparison eliminates one pointer's current
position entirely rather than checking one pair at a time.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each comparison uses the array\'s sorted order to definitively rule out one entire position, giving O(n) total instead of O(n²).',
        explainHi: 'Har comparison array ke sorted order ka istemal karta hai ek poori position ko nishchit roop se ruled out karne ke liye, \`O(n)\` total dete hue \`O(n²)\` ke bajaye.',
      },
      {
        title: 'Same-direction two pointers: removing duplicates from a sorted array in place',
        titleHi: 'Same-direction two pointers: ek sorted array se in place mein duplicates hataana',
        code: `let slow = 0;
for (let fast = 1; fast < nums.length; fast++) {
  if (nums[fast] !== nums[slow]) { slow++; nums[slow] = nums[fast]; }
}`,
        codeJs: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
// nums = [1, 1, 2, 2, 3] → returns 3, nums becomes [1, 2, 3, 2, 3]
// (only the first 3 positions matter, per the function's own contract)`,
        codeTs: `function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
        outputJs: `removeDuplicates([1, 1, 2, 2, 3]) returns 3, and the array's first
3 positions now hold [1, 2, 3] — the unique values, in order, with
no second array ever allocated.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'slow and fast both move only forward, through a single pass, with slow tracking where the next unique value should be written — a genuine O(n), in-place solution.',
        explainHi: '\`slow\` aur \`fast\` dono sirf aage move karte hain, ek akele pass ke through, \`slow\` track karte hue ki agli unique value kahaan likhi jaani chahiye — ek asli \`O(n)\`, in-place solution.',
      },
    ],

    mistakes: [
      {
        wrong: `for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) { /* check pair */ }
}
// checking every pair even though nums is sorted`,
        right: `let left = 0, right = nums.length - 1;
while (left < right) { /* use sum vs target to move one pointer */ }`,
        why: 'Checking every pair with a nested loop discards the sorted order\'s own information, which is exactly what allows a smarter approach to eliminate half the remaining candidates per step.',
        whyHi: 'Ek nested loop se har jode ko check karna sorted order ki apni jaankaari hataata hai, jo bilkul wo hai jo ek zyaada samajhdaar approach ko prati kadam aadhi bachi hui candidates khatam karne deta hai.',
      },
      {
        wrong: `let left = 0, right = nums.length - 1;
// applying the same two-pointer logic to an UNSORTED array`,
        right: `nums.sort((a, b) => a - b); // sort first, or confirm the input is already sorted
let left = 0, right = nums.length - 1;`,
        why: 'Two pointers\' correctness genuinely depends on sorted order — the same movement rule applied to unsorted data can silently skip over the correct answer entirely.',
        whyHi: 'Two pointers ki sahihata sach mein sorted order par nirbhar karti hai — wahi movement rule unsorted data par lagu ki gayi chupchaap sahi jawaab ko poori tarah skip kar sakti hai.',
      },
      {
        wrong: `// treating "two pointers" and "nested loop" as interchangeable
// names for the same technique`,
        right: `// recognizing two pointers as a genuinely different technique:
// O(n) via eliminating candidates, not O(n²) via checking pairs`,
        why: 'A nested loop and two pointers produce different Big-O complexities for the same problem — conflating them hides the actual performance benefit two pointers exists to provide.',
        whyHi: 'Ek nested loop aur two pointers usi problem ke liye alag Big-O complexities banaate hain — inhe milaana asli performance faayda chhupaata hai jise pradaan karne ke liye two pointers maujood hai.',
      },
    ],

    realWorld: [
      {
        en: '**Two pointers is one of the single most frequently tested patterns in real technical interviews**, specifically because it demonstrates whether a candidate can exploit a problem\'s structural properties (like sortedness) rather than defaulting to brute force.',
        hi: '**Two pointers asli technical interviews mein sabse zyaada aam taur par test kiye jaane waale patterns mein se ek hai**, khaas taur par kyunki ye darsata hai ki kya ek candidate ek problem ki structural properties (jaisa sortedness) ka istemal kar sakta hai brute force ko default banaane ke bajaye.',
      },
      {
        en: '**"Container With Most Water", "Valid Palindrome", and "3Sum" are among the most commonly cited real interview problems that rely directly on this exact two-pointer pattern.**',
        hi: '**"Container With Most Water", "Valid Palindrome", aur "3Sum" un asli interview problems mein sabse aam taur par cite ki jaane waali hain jo bilkul isi two-pointer pattern par seedhe nirbhar karti hain.**',
      },
      {
        en: '**Removing duplicates from sorted data in place (this lesson\'s same-direction example) is a genuinely common real data-cleaning operation**, applicable directly to database result sets and log processing.',
        hi: '**Sorted data se in place mein duplicates hataana (is lesson ka same-direction example) ek sach mein aam asli data-cleaning operation hai**, database result sets aur log processing par seedhe lagu hone-yogya.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does the opposite-ends two-pointer technique require the input to be sorted, and what specifically goes wrong if it is applied to unsorted data?',
        qHi: 'Virudh-sirron waali two-pointer technique ko input sorted hona kyun chahiye, aur agar ise unsorted data par lagu kiya jaaye toh khaas taur par kya galat hota hai?',
        a: 'The two-pointer technique\'s core decision rule — if the current sum is too large, move the right pointer inward; if too small, move the left pointer inward — is only a logically valid conclusion because of a specific guarantee sorted order provides: every element to the right of the current right pointer is guaranteed to be at least as large, and every element to the left of the current left pointer is guaranteed to be at least as small. This guarantee is precisely what justifies discarding an entire pointer\'s current position as "ruled out" based on a single comparison — if the current sum is already too large, and every remaining candidate for the right position is even larger still, then the current left position genuinely cannot form a valid pair with ANY of those remaining right candidates, so moving the right pointer inward, rather than the left one, is the only choice that could possibly still find an answer. When this same movement rule is applied to unsorted data, this guarantee no longer holds: an element to the right of the current right pointer is not necessarily larger, and could easily be exactly the value needed to pair correctly with the current left position. Moving the right pointer inward in that scenario would discard the actual correct answer without ever having checked it, since the algorithm\'s own logic assumes an ordering property the data does not actually have. This is why applying two pointers to unsorted data does not merely produce a slower or less elegant result — it can silently produce a WRONG result, skipping over the correct pair entirely while the algorithm confidently reports that no valid pair exists, which is a genuinely more dangerous failure mode than simply being slow.',
        aHi: 'Two-pointer technique ka core decision rule — agar current sum bahut bada hai, right pointer ko andar move karo; agar bahut chhota hai, left pointer ko andar move karo — sirf isliye ek logically valid nateeja hai kyunki sorted order ek khaas guarantee pradaan karta hai: current right pointer ke daayen har element guarantee ke saath kam se kam utna bada hai, aur current left pointer ke baayen har element guarantee ke saath kam se kam utna chhota hai. Ye guarantee bilkul wo hai jo ek poori pointer ki current position ko "ruled out" ki tarah discard karna ek akele comparison ke aadhaar par justify karta hai — agar current sum pehle se bahut bada hai, aur right position ke liye har bachi hui candidate aur bhi badi hai, toh current left position sach mein un bachi hui right candidates mein se KISI KE saath bhi ek valid joda nahi bana sakta, isliye right pointer ko andar move karna, left ke bajaye, sirf wo chunaav hai jo shaayad abhi bhi ek jawaab dhoondh sakta hai. Jab yahi movement rule unsorted data par lagu ki jaati hai, ye guarantee ab nahi tikta: current right pointer ke daayen ek element zaruri roop se bada nahi hai, aur aasaani se bilkul wahi value ho sakta hai jo current left position ke saath sahi tarike se joda banaane ke liye zaruri hai. Us scenario mein right pointer ko andar move karna asli sahi jawaab ko discard karega kabhi use check kiye bina, kyunki algorithm ka apna logic ek ordering property maanta hai jo data ke paas asal mein nahi hai. Yahi wajah hai ki two pointers ko unsorted data par lagu karna sirf ek dheema ya kam-elegant nateeja nahi banaata — ye chupchaap ek GALAT nateeja bana sakta hai, sahi joda ko poori tarah skip karte hue jabki algorithm bharose se report karta hai ki koi valid joda maujood nahi hai, jo simply dheema hone se ek sach mein zyaada khatarnaak failure mode hai.',
      },
      {
        q: 'What is the difference between the two shapes of the two-pointer technique this lesson covered (opposite ends versus same direction), and how do you recognize which one a new problem calls for?',
        qHi: 'Is lesson ne jo do-pointer technique ki do shapes cover ki (virudh sirre versus same direction), unke beech farak kya hai, aur ek nayi problem ko unmein se kaunsi chahiye ye tum kaise pehchaante ho?',
        a: 'The opposite-ends shape starts one pointer at the very beginning of a structure and a second pointer at the very end, moving both toward each other until they meet, and it is well-suited to problems that fundamentally involve comparing or combining two elements from different, shrinking regions of a sorted structure — a pair whose combined sum matches a target, or checking whether a string reads identically forwards and backwards. The signal for this shape is a problem asking about a relationship between a "low" candidate and a "high" candidate simultaneously, where sorted order lets a single comparison rule out an entire end. The same-direction shape instead starts both pointers near the beginning and moves them independently forward through a single pass, typically at different effective speeds — one pointer, often called "slow", tracks a confirmed, finalized position in an in-place result being built, while a second, "fast" pointer scans ahead looking for the next value that actually belongs in that result, updating "slow" and writing to its position only when a genuinely new, relevant value is found. The signal for this shape is a problem asking for an in-place transformation of an existing structure, processed via a single left-to-right scan, where some positions are being kept and others skipped or discarded, rather than a problem about a relationship between two specific, independently-chosen candidates. In both shapes, the recognition process is the same one this course\'s foundational problem-solving-framework lesson established: identify what a brute-force approach would wastefully repeat, and ask whether a single comparison, given the input\'s own structure, could eliminate more than one candidate at once — opposite-ends pointers eliminate an entire end per comparison; same-direction pointers avoid re-scanning positions already confirmed to be finished.',
        aHi: 'Virudh-sirron waali shape ek pointer ko ek structure ke bilkul shuru mein aur doosre pointer ko bilkul ant mein shuru karti hai, dono ko ek doosre ki taraf move karte hue jab tak wo mile na jaayein, aur ye un problems ke liye achhi tarah suit karti hai jo buniyaadi roop se ek sorted structure ke alag, simatte hue regions se do elements ko compare ya combine karna shaamil karti hain — ek joda jiska combined sum ek target se mel khaata hai, ya check karna ki ek string aage aur peeche identical roop se padhi jaati hai. Is shape ke liye signal ek problem hai jo ek "low" candidate aur ek "high" candidate ke beech ek saath ek rishte ke baare mein poochta hai, jahan sorted order ek akele comparison ko ek poora ant ruled out karne deta hai. Same-direction shape iske bajaye dono pointers ko shuru ke kareeb shuru karti hai aur unhe azaadi se aage ek akele pass ke through move karti hai, aksar alag effective speeds par — ek pointer, aksar "slow" kaha jaata hai, ek confirmed, finalized position track karta hai ek in-place result mein jo banaayi jaa rahi hai, jabki ek doosra, "fast" pointer aage scan karta hai agli value dhoondte hue jo asal mein us result mein belong karti hai, "slow" ko update karte hue aur iski position par sirf tab likhte hue jab ek sach mein nayi, mutaalliq value milti hai. Is shape ke liye signal ek problem hai jo ek maujood structure ka in-place transformation poochta hai, ek akeli left-to-right scan ke zariye process kiya gaya, jahan kuch positions rakhi jaa rahi hain aur doosri skip ya discard ki jaa rahi hain, do khaas, azaadi-se-chune-gaye candidates ke beech ek rishte ke baare mein ek problem ke bajaye. Dono shapes mein, pehchaanne ka process wahi hai jise is course ke buniyaadi problem-solving-framework lesson ne sthaapit kiya: pehchaano ki ek brute-force approach kya bekaar mein dohraayegi, aur poochho ki kya ek akela comparison, input ki apni structure ko dekhte hue, ek se zyaada candidate ek saath khatam kar sakta hai — virudh-sirron waale pointers prati comparison ek poora ant khatam karte hain; same-direction pointers un positions ko dobara-scan karne se bachte hain jo pehle se poori maani jaa chuki hain.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken nested-loop twoSumSorted and the fixed opposite-ends version from this lesson. Test both with a sorted array of 50,000 items and time them using console.time/console.timeEnd.',
        taskHi: 'Is lesson ka toota nested-loop \`twoSumSorted\` aur theek virudh-sirron waala version banaao. Dono ko 50,000 items ke ek sorted array ke saath test karo aur unhe \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Generate a sorted test array using Array.from({ length: 50000 }, (_, i) => i * 2), and pick a target that requires checking pairs relatively far apart to see the timing difference clearly.',
        hintHi: '\`Array.from({ length: 50000 }, (_, i) => i * 2)\` istemal karke ek sorted test array banaao, aur ek target chuno jo taulanaatmak roop se door ke jode check karne ki maang karta hai timing farak ko saaf dekhne ke liye.',
      },
      {
        task: 'Deliberately run the fixed two-pointer twoSumSorted against an UNSORTED array where a valid pair genuinely exists. Confirm it returns an empty result, incorrectly missing the pair that is actually there.',
        taskHi: 'Jaan-boojhkar theek two-pointer \`twoSumSorted\` ko ek UNSORTED array ke khilaaf chalaao jahan ek valid joda sach mein maujood hai. Confirm karo ki ye ek khaali nateeja return karta hai, galti se us joda ko miss karte hue jo asal mein wahaan hai.',
        hint: 'Use the exact unsorted example from this lesson\'s content section ([15, 2, 11, 7], target 9) and trace through what the pointers actually do.',
        hintHi: 'Is lesson ke content section ka bilkul wahi unsorted example istemal karo (\`[15, 2, 11, 7]\`, target \`9\`) aur trace karo ki pointers asal mein kya karte hain.',
      },
      {
        task: 'Build the removeDuplicates same-direction example from this lesson. Trace through nums = [1, 1, 1, 2, 3, 3] by hand, writing down slow and fast\'s values after every single iteration, before running the code.',
        taskHi: 'Is lesson ka \`removeDuplicates\` same-direction example banaao. \`nums = [1, 1, 1, 2, 3, 3]\` ko haath se trace karo, har akeli iteration ke baad \`slow\` aur \`fast\` ki values likhte hue, code chalaane se pehle.',
        hint: 'Write two columns, one for slow and one for fast, and update them one line at a time — the same tracing habit this course\'s Module 1 problem-solving-framework lesson introduced.',
        hintHi: 'Do columns likho, ek \`slow\` ke liye aur ek \`fast\` ke liye, aur unhe ek waqt mein ek line update karo — wahi tracing aadat jise is course ke Module 1 problem-solving-framework lesson ne introduce kiya.',
      },
    ],

    keyTakeaways: [
      'Two pointers has two common shapes: opposite ends closing inward (for pair-finding in sorted data) and same direction at different speeds (for in-place, single-pass transformations).',
      'The opposite-ends shape uses sorted order to eliminate an entire pointer\'s position with each comparison, giving O(n) instead of the O(n²) a nested loop over pairs would cost.',
      'Two pointers\' correctness genuinely depends on sorted order (or an equivalent structural guarantee) — applying the same movement rule to unsorted data can silently skip the correct answer.',
      'The same-direction shape (slow/fast) tracks a confirmed result position with one pointer while scanning ahead for the next relevant value with the other, avoiding a second array entirely.',
      'The signal for opposite-ends two pointers is a relationship between a low and a high candidate in sorted data; the signal for same-direction is an in-place, single-pass transformation.',
      'Recognizing two pointers as applicable follows the same process as identifying any pattern: naming what a brute force wastefully repeats, then finding what structural property lets a single step eliminate more than one candidate.',
    ],
    keyTakeawaysHi: [
      'Two pointers ki do aam shapes hain: virudh sirre andar band hote hue (sorted data mein joda-dhoondhne ke liye) aur same direction alag speeds par (in-place, single-pass transformations ke liye).',
      'Virudh-sirron waali shape sorted order ka istemal karti hai har comparison ke saath ek poori pointer position khatam karne ke liye, \`O(n)\` deti hue us \`O(n²)\` ke bajaye jo jodon par ek nested loop kharch karta.',
      'Two pointers ki sahihata sach mein sorted order (ya ek samaan structural guarantee) par nirbhar karti hai — wahi movement rule unsorted data par lagu karna chupchaap sahi jawaab skip kar sakta hai.',
      'Same-direction shape (\`slow\`/\`fast\`) ek confirmed result position track karti hai ek pointer ke saath jabki agli mutaalliq value ke liye doosre ke saath aage scan karti hai, poori tarah ek doosre array se bachte hue.',
      'Virudh-sirron waale two pointers ke liye signal sorted data mein ek low aur ek high candidate ke beech ek rishta hai; same-direction ke liye signal ek in-place, single-pass transformation hai.',
      'Two pointers ko lagu hone-yogya pehchaanna kisi bhi pattern ko pehchaanne jaisa hi process follow karta hai: naam do ki ek brute force bekaar mein kya dohraata hai, phir dhoondho ki kaunsi structural property ek akele kadam ko ek se zyaada candidate khatam karne deti hai.',
    ],
  },
];
