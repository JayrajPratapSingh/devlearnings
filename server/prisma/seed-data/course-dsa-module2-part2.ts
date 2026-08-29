/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 2.
 *
 * The sliding window technique: fixed-size and variable-size windows,
 * both solving the same underlying waste — recomputing a sum or
 * property over a contiguous range from scratch on every shift, when
 * almost all of that range's content did not actually change. Broken
 * example: finding the maximum sum of any k consecutive elements by
 * re-summing all k elements at every single starting position, an
 * O(n*k) approach that redoes nearly all of the previous sum's work at
 * each step. Fixed by sliding a fixed-size window: subtract the element
 * leaving the window and add the element entering it, turning a full
 * re-sum into a single subtraction and addition per shift.
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

export const DSA_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'sliding-window-technique',
    title: 'The Sliding Window Technique',
    titleHi: 'Sliding Window Technique',
    description: 'Finding the maximum sum of any 100 consecutive items in a 1-million-item array by re-adding all 100 items at every single starting position — recomputing 99% of the same sum it already calculated one position ago, over and over, a million times.',
    descriptionHi: 'Ek 1-million-item array mein kisi bhi 100 lagaataar items ka maximum sum dhoondhna har akeli shuruaati position par sab 100 items ko dobara jodkar — 99% wahi sum dobara ganna jo ise ek position pehle pehle se gan chuka tha, baar-baar, das lakh baar.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A shopkeeper recounting the total value of ALL 100 items currently sitting in a display case every single time one old item is removed from one end and one new item is added at the other, versus a shopkeeper who keeps a running total and simply subtracts the value of the item just removed and adds the value of the item just placed in.** The recounting shopkeeper, asked for the display case\'s total value after every single swap, walks over and adds up all 100 items from scratch each time — 99 of which are the exact same items, in the exact same positions, that were already counted in the total calculated one swap ago. The running-total shopkeeper never needs to recount anything already accounted for: removing an item just subtracts that one item\'s known value from the existing total, and adding a new item just adds that one new value — the running total genuinely stays accurate through any number of swaps, using only two small operations per swap instead of a full 100-item recount. Recomputing the sum of every window of k consecutive elements by re-adding all k elements at each new starting position is the recounting shopkeeper: correct, but redoing 99% of the same addition work that a single position\'s shift ago already did. Sliding the window — subtracting the element that just left and adding the element that just entered — is the running-total shopkeeper: each shift costs two small operations, regardless of how large k is, because nearly the entire window\'s content did not actually change between one position and the next.',
      hi: '**Ek dukaandaar jo har akeli baar jab ek purana item ek sire se hataaya jaata hai aur ek naya item doosre sire par jodha jaata hai display case mein abhi maujood SAB 100 items ki total value dobara ganta hai, versus ek dukaandaar jo ek chalta total rakhta hai aur bas abhi hataaye gaye item ki value ghataata hai aur abhi rakhe gaye item ki value jodta hai.** Dobara-ganne wala dukaandaar, har akele swap ke baad display case ki total value poochhne par, jaakar har baar shuru se sab 100 items ko jodta hai — jinmein se 99 bilkul wahi items hain, bilkul usi positions mein, jo pehle se us total mein ganay gaye the jo ek swap pehle gana gaya tha. Chalta-total dukaandaar ko kabhi pehle se hisaab li gayi kisi bhi cheez ko dobara ganne ki zaroorat nahi hai: ek item hataana bas us ek item ki jaani-jaati value ko maujood total se ghataata hai, aur ek naya item jodna bas us ek nayi value ko jodta hai — chalta total sach mein kisi bhi tadaad ke swaps ke through sahi rehta hai, prati swap sirf do chhote operations istemal karte hue ek poore 100-item recount ke bajaye. \`k\` lagaataar elements ki har window ka sum dobara ganna har nayi shuruaati position par sab \`k\` elements ko dobara jodkar dobara-ganne wala dukaandaar hai: sahi, par 99% wahi addition kaam dobara karte hue jo ek position pehle ka shift pehle hi kar chuka tha. Window ko slide karna — abhi bahar gaye element ko ghataana aur abhi andar aaye element ko jodna — chalta-total dukaandaar hai: har shift do chhote operations kharch karta hai, chahe \`k\` kitna bhi bada ho, kyunki lagbhag poori window ki content ek position se doosri ke beech asal mein badli hi nahi.',
    },

    simple: `**Start broken.** Re-summing all k elements at every starting position:

\`\`\`js
function maxSubarraySum(nums, k) {
  let maxSum = -Infinity;
  for (let start = 0; start <= nums.length - k; start++) {
    let windowSum = 0;
    for (let i = start; i < start + k; i++) {
      windowSum += nums[i]; // re-adds ALL k elements, every single time
    }
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

This is a nested loop with exactly the shape this course\'s Module 1 lesson on analyzing loops taught to check for: the outer loop runs roughly \`n\` times, and each iteration\'s own body — re-summing all \`k\` elements — costs \`O(k)\`, for a true total cost of \`O(n * k)\`. The waste, visible only by comparing consecutive windows directly: moving the window one position forward means \`k - 1\` of the \`k\` elements are IDENTICAL to the previous window\'s elements — only one element left the window (from the start) and one new element entered it (at the end). Re-summing all \`k\` elements from scratch recalculates \`k - 1\` sums that were already correctly computed one step ago.

**The fix: slide the window — subtract what left, add what entered**

\`\`\`js
function maxSubarraySum(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i]; // the FIRST window, computed once
  let maxSum = windowSum;

  for (let end = k; end < nums.length; end++) {
    windowSum += nums[end] - nums[end - k]; // add what entered, subtract what left
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

\`\`\`ts
function maxSubarraySum(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  for (let end = k; end < nums.length; end++) {
    windowSum += nums[end] - nums[end - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

The very first window\'s sum is computed the ordinary way, once, costing \`O(k)\` a single time. Every subsequent window reuses that running \`windowSum\` directly: \`nums[end]\` is the one new element entering the window at its right edge, and \`nums[end - k]\` is the one element leaving the window at its left edge — adding the first and subtracting the second updates \`windowSum\` to reflect the new window using exactly two operations, regardless of how large \`k\` is. The total cost drops to \`O(k) + O(n)\`, which simplifies to \`O(n)\` — a direct result of never recomputing the \`k - 1\` elements that did not actually change between consecutive windows.`,

    simpleHi: `**Toote hue se shuru.** Har shuruaati position par sab \`k\` elements ko dobara jodna:

\`\`\`js
function maxSubarraySum(nums, k) {
  let maxSum = -Infinity;
  for (let start = 0; start <= nums.length - k; start++) {
    let windowSum = 0;
    for (let i = start; i < start + k; i++) {
      windowSum += nums[i]; // SAB k elements ko dobara jodta hai, har akeli baar
    }
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

Ye ek nested loop hai bilkul us shape ke saath jise is course ke Module 1 ke loops ka vishleshan karne wale lesson ne check karna sikhaaya: outer loop lagbhag \`n\` baar chalta hai, aur har iteration ka apna body — sab \`k\` elements ko dobara sum karna — \`O(k)\` kharch karta hai, ek asli total keemat \`O(n * k)\` ke liye. Barbaadi, sirf lagaataar windows ko seedhe compare karke drishyaman: window ko ek position aage move karna matlab hai \`k\` elements mein se \`k - 1\` pichli window ke elements se IDENTICAL hain — sirf ek element window se bahar gaya (shuru se) aur ek naya element andar aaya (ant mein). Sab \`k\` elements ko shuru se dobara jodna \`k - 1\` sums ko dobara ganta hai jo pehle se ek kadam pehle sahi tarike se gani ja chuki thi.

**Fix: window slide karo — jo bahar gaya use ghataao, jo andar aaya use jodo**

\`\`\`js
function maxSubarraySum(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i]; // PEHLI window, ek baar gani gayi
  let maxSum = windowSum;

  for (let end = k; end < nums.length; end++) {
    windowSum += nums[end] - nums[end - k]; // jo andar aaya jodo, jo bahar gaya ghataao
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

\`\`\`ts
function maxSubarraySum(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  for (let end = k; end < nums.length; end++) {
    windowSum += nums[end] - nums[end - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
\`\`\`

Bilkul pehli window ka sum saadhaaran tarike se gana jaata hai, ek baar, \`O(k)\` ek akeli baar kharch karte hue. Har baad ki window us chalte \`windowSum\` ko seedhe dobara istemal karti hai: \`nums[end]\` wo ek naya element hai jo window mein iske daaye kinaare par andar aa raha hai, aur \`nums[end - k]\` wo ek element hai jo window ke baaye kinaare se bahar jaa raha hai — pehle ko jodna aur doosre ko ghataana \`windowSum\` ko naya window darsaane ke liye update karta hai bilkul do operations istemal karke, chahe \`k\` kitna bhi bada ho. Total keemat \`O(k) + O(n)\` tak gir jaati hai, jo \`O(n)\` mein simplify hoti hai — ek seedha nateeja is baat ka ki \`k - 1\` elements ko kabhi dobara na gano jo lagaataar windows ke beech asal mein badle nahi.`,

    content: `## Fixed-size versus variable-size windows

\`\`\`
Fixed-size:    window's length k is given upfront and never changes
               (e.g. "max sum of any k consecutive elements")

Variable-size: window grows and shrinks based on a condition, searching
               for the SMALLEST or LARGEST window satisfying some rule
               (e.g. "smallest window whose sum is at least a target")
\`\`\`

This lesson\'s example uses a FIXED-size window, where \`k\` is known in advance and the window\'s length never changes — only its position slides. A large, equally common family of sliding-window problems instead uses a VARIABLE-size window, where the window\'s own length grows or shrinks based on whether some condition currently holds. The mechanics differ, but the underlying principle — avoid recomputing a property over a range from scratch when most of that range did not change — is exactly the same one this lesson\'s fixed-size example demonstrated.

## A variable-size window: smallest subarray with a sum at least a target

\`\`\`js
function smallestSubarraySum(nums, target) {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right]; // grow the window by including nums[right]

    while (windowSum >= target) { // shrink while the condition still holds
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}
\`\`\`

\`\`\`ts
function smallestSubarraySum(nums: number[], target: number): number {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];

    while (windowSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}
\`\`\`

\`right\` expands the window one step at a time, adding each new element to \`windowSum\`. Whenever the window\'s sum already meets or exceeds the target, the inner \`while\` loop shrinks the window from the LEFT as much as possible while the condition still holds, recording the smallest window length found along the way, then continues expanding from \`right\` again. Although this has a loop nested inside another loop, \`left\` never resets backward — across the ENTIRE run of the function, \`left\` advances at most \`n\` times total, and \`right\` also advances at most \`n\` times total, giving a genuine \`O(n)\` total cost despite the nested-loop appearance, rather than the \`O(n²)\` this course\'s Module 1 lesson on analyzing loops warned a naive nested loop would cost — recognizing that \`left\` and \`right\` together make a bounded total number of moves, not that each combination of their positions is independently checked, is the key insight that keeps this genuinely linear.

## Recognizing when sliding window applies

\`\`\`
Signal: the problem asks about a CONTIGUOUS range (a "subarray" or
        "substring", not any arbitrary subset), and something about
        that range (its sum, its count of distinct characters, etc.)
        needs to be tracked as the range's boundaries move.
\`\`\`

Sliding window\'s signal is specifically CONTIGUOUS ranges — a subarray or substring, where elements must be adjacent and in their original order, as opposed to a subset or subsequence, where elements can be picked from anywhere. Whenever a problem asks for something about "the best contiguous range of length k" (fixed-size) or "the best contiguous range satisfying some condition, whatever its length" (variable-size), the brute force\'s waste is almost always the same shape this lesson opened with: recomputing a property over a mostly-unchanged range from scratch, rather than updating a running value as the range\'s boundary shifts by one element at a time.`,

    contentHi: `## Fixed-size versus variable-size windows

\`\`\`
Fixed-size:    window ki length k pehle se di gayi hai aur kabhi nahi
               badalti (jaisa "kisi bhi k lagaataar elements ka max sum")

Variable-size: window ek condition ke aadhaar par badhti aur simatti
               hai, kuch rule ko poora karti SABSE CHHOTI ya SABSE BADI
               window dhoondte hue (jaisa "sabse chhoti window jiska
               sum kam se kam ek target hai")
\`\`\`

Is lesson ka example ek FIXED-size window istemal karta hai, jahan \`k\` pehle se jaani jaati hai aur window ki length kabhi nahi badalti — sirf iski position slide hoti hai. Ek bada, barabar aam sliding-window problems ka parivaar iske bajaye ek VARIABLE-size window istemal karta hai, jahan window ki apni length badhti ya simatti hai is aadhaar par ki kya koi condition abhi tikta hai. Mechanics alag hain, par underlying siddhaant — ek range par ek property ko shuru se dobara ganne se bacho jab us range ka adhikaansh badla nahi — bilkul wahi hai jo is lesson ke fixed-size example ne darsaaya.

## Ek variable-size window: kam se kam ek target ke sum waala sabse chhota subarray

\`\`\`js
function smallestSubarraySum(nums, target) {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right]; // window ko badhaao nums[right] shaamil karte hue

    while (windowSum >= target) { // simato jab tak condition abhi bhi tikti hai
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}
\`\`\`

\`\`\`ts
function smallestSubarraySum(nums: number[], target: number): number {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];

    while (windowSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}
\`\`\`

\`right\` window ko ek waqt mein ek kadam expand karta hai, har naye element ko \`windowSum\` mein jodte hue. Jab bhi window ka sum pehle se target ko poora karta hai ya isse aage nikal jaata hai, andar wala \`while\` loop window ko BAAYEN se jitna ho sake simataata hai jab tak condition abhi bhi tikti hai, raaste mein mili sabse chhoti window length record karte hue, phir \`right\` se dobara expand karna jaari rakhta hai. Chahe ismein ek loop ek doosre ke andar nested hai, \`left\` kabhi peeche reset nahi hota — function ke POORE run ke aar-paar, \`left\` zyaada se zyaada total \`n\` baar aage badhta hai, aur \`right\` bhi zyaada se zyaada total \`n\` baar aage badhta hai, nested-loop dikhaawat ke bawajood ek asli \`O(n)\` total keemat dete hue, us \`O(n²)\` ke bajaye jise is course ke Module 1 ke loops ka vishleshan karne wale lesson ne chetaavni di ki ek naive nested loop kharch karega — ye pehchaanna ki \`left\` aur \`right\` saath ek bounded total tadaad ki chaal karte hain, ye nahi ki unki positions ka har combination azaadi se check kiya jaata hai, wo mool antardrishti hai jo ise sach mein linear rakhti hai.

## Pehchaanna ki sliding window kab lagu hota hai

\`\`\`
Signal: problem ek CONTIGUOUS range ("subarray" ya "substring", koi
        manmaana subset nahi) ke baare mein poochta hai, aur us range
        ke baare mein kuch (iska sum, iske distinct characters ki
        ginti, waghaira) track kiya jaana chahiye jaise range ki
        boundaries move karti hain.
\`\`\`

Sliding window ka signal khaas taur par CONTIGUOUS ranges hai — ek subarray ya substring, jahan elements adjacent aur apne asli order mein hone chahiye, ek subset ya subsequence ke ulta, jahan elements kahin se bhi chune jaa sakte hain. Jab bhi ek problem "\`k\` lambaayi ka sabse achha contiguous range" (fixed-size) ya "kuch condition poora karta sabse achha contiguous range, iski lambaayi kuch bhi ho" (variable-size) ke baare mein poochti hai, brute force ki barbaadi lagbhag hamesha wahi shape hai jo is lesson ne shuru mein kholi: ek adhikaansh-na-badle-hue range par ek property ko shuru se dobara ganna, ek chalti value ko update karne ke bajaye jaise range ki boundary ek waqt mein ek element se shift hoti hai.`,

    examples: [
      {
        title: 'Broken: re-summing all k elements at every position',
        titleHi: 'Toota: har position par sab k elements ko dobara jodna',
        code: `for (let start = 0; start <= nums.length - k; start++) {
  let windowSum = 0;
  for (let i = start; i < start + k; i++) windowSum += nums[i];
}`,
        codeJs: `function maxSubarraySum(nums, k) {
  let maxSum = -Infinity;
  for (let start = 0; start <= nums.length - k; start++) {
    let windowSum = 0;
    for (let i = start; i < start + k; i++) {
      windowSum += nums[i];
    }
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
// O(n * k) — recomputes k-1 shared elements at every single position`,
        codeTs: `function maxSubarraySum(nums: number[], k: number): number {
  let maxSum = -Infinity;
  for (let start = 0; start <= nums.length - k; start++) {
    let windowSum = 0;
    for (let i = start; i < start + k; i++) {
      windowSum += nums[i];
    }
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
// fully valid TypeScript — the waste is a missed pattern, not a type error`,
        output: `maxSubarraySum([2, 1, 5, 1, 3, 2], 3) correctly returns 9, but
recomputes nearly the entire sum from scratch at every position.`,
        explain: 'The inner loop redoes k-1 additions that were already correctly computed for the previous window, one position ago.',
        explainHi: 'Inner loop \`k - 1\` additions dobara karta hai jo pehle se pichli window ke liye sahi tarike se gani ja chuki thi, ek position pehle.',
      },
      {
        title: 'Fixed: sliding the window, one subtraction and one addition per shift',
        titleHi: 'Theek: window slide karna, prati shift ek subtraction aur ek addition',
        code: `let windowSum = /* sum of first k elements */;
for (let end = k; end < nums.length; end++) {
  windowSum += nums[end] - nums[end - k];
}`,
        codeJs: `function maxSubarraySum(nums, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  for (let end = k; end < nums.length; end++) {
    windowSum += nums[end] - nums[end - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
        codeTs: `function maxSubarraySum(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  for (let end = k; end < nums.length; end++) {
    windowSum += nums[end] - nums[end - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
        outputJs: `maxSubarraySum([2, 1, 5, 1, 3, 2], 3) returns 9, matching the
brute force's answer, using two operations per shift regardless of
how large k is.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Each shift updates the running sum using only the one element leaving and the one element entering, never recomputing the k-1 unchanged elements.',
        explainHi: 'Har shift chalte sum ko update karta hai sirf us ek element ka istemal karke jo bahar jaata hai aur us ek element ka jo andar aata hai, un \`k - 1\` na-badle elements ko kabhi dobara ganne bina.',
      },
      {
        title: 'Variable-size window: smallest contiguous sum at least a target',
        titleHi: 'Variable-size window: kam se kam ek target ka sabse chhota contiguous sum',
        code: `while (windowSum >= target) {
  minLength = Math.min(minLength, right - left + 1);
  windowSum -= nums[left]; left++;
}`,
        codeJs: `function smallestSubarraySum(nums, target) {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    while (windowSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}`,
        codeTs: `function smallestSubarraySum(nums: number[], target: number): number {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    while (windowSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}`,
        outputJs: `smallestSubarraySum([2, 3, 1, 2, 4, 3], 7) returns 2 (the subarray
[4, 3]), with left and right together making at most n moves total
across the entire run, despite the nested-loop appearance.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'left only ever moves forward, never resetting, so across the whole function it advances at most n times total, keeping the true complexity O(n) despite the nested loop shape.',
        explainHi: '\`left\` kabhi sirf aage move karta hai, kabhi reset nahi hota, isliye poore function mein ye zyaada se zyaada total \`n\` baar aage badhta hai, nested loop shape ke bawajood asli complexity \`O(n)\` rakhte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `for (let start = 0; start <= nums.length - k; start++) {
  let windowSum = 0;
  for (let i = start; i < start + k; i++) windowSum += nums[i];
}
// re-summing all k elements from scratch at every position`,
        right: `let windowSum = /* first k elements, summed once */;
for (let end = k; end < nums.length; end++) {
  windowSum += nums[end] - nums[end - k];
}`,
        why: 'Recomputing a fixed-size window\'s sum from scratch at every position redoes k-1 additions that were already correctly computed for the previous window.',
        whyHi: 'Ek fixed-size window ka sum har position par shuru se dobara ganna \`k - 1\` additions dobara karta hai jo pehle se pichli window ke liye sahi tarike se gani ja chuki thi.',
      },
      {
        wrong: `for (let right = 0; right < nums.length; right++) {
  for (let left = 0; left <= right; left++) { /* recheck every possible left */ }
}
// resetting left backward on every outer iteration`,
        right: `// left only ever moves forward, never resetting, across the
// entire run of the outer loop`,
        why: 'A variable-size window\'s O(n) complexity depends on left never moving backward — resetting it on every outer iteration turns the same code into a genuine O(n²) brute force.',
        whyHi: 'Ek variable-size window ki \`O(n)\` complexity is baat par nirbhar karti hai ki \`left\` kabhi peeche na move ho — ise har outer iteration par reset karna wahi code ko ek asli \`O(n²)\` brute force mein badalta hai.',
      },
      {
        wrong: `// applying sliding window to a problem about picking ANY subset
// of elements, not a contiguous range`,
        right: `// confirming the problem is genuinely about a CONTIGUOUS
// subarray/substring before reaching for sliding window`,
        why: 'Sliding window\'s entire mechanism depends on the range being contiguous, so its boundary can shift by one element at a time — it does not apply to problems about arbitrary, non-contiguous subsets.',
        whyHi: 'Sliding window ka poora mechanism is baat par nirbhar karta hai ki range contiguous hai, taaki iski boundary ek waqt mein ek element se shift ho sake — ye manmaane, non-contiguous subsets ke baare mein problems par lagu nahi hota.',
      },
    ],

    realWorld: [
      {
        en: '**Sliding window is one of the most heavily tested patterns in real technical interviews**, appearing in problems ranging from "Maximum Sum Subarray of Size K" to "Longest Substring Without Repeating Characters".',
        hi: '**Sliding window asli technical interviews mein sabse zyaada bhaari test kiye jaane waale patterns mein se ek hai**, "Maximum Sum Subarray of Size K" se "Longest Substring Without Repeating Characters" tak ki problems mein dikhta hai.',
      },
      {
        en: '**Real-time monitoring systems (network traffic analysis, rolling averages in financial data) use fixed-size sliding windows in production specifically to avoid recomputing statistics from scratch on every new data point.**',
        hi: '**Real-time monitoring systems (network traffic analysis, financial data mein rolling averages) production mein fixed-size sliding windows istemal karte hain khaas taur par har naye data point par statistics ko shuru se dobara ganne se bachne ke liye.**',
      },
      {
        en: '**The variable-size sliding window pattern is directly responsible for solving an entire family of "longest/shortest substring satisfying condition X" problems that are otherwise genuinely difficult to approach efficiently.**',
        hi: '**Variable-size sliding window pattern seedhe "longest/shortest substring satisfying condition X" problems ke ek poore parivaar ko sulajhaane ke liye zimmedaar hai jo anyatha kushalta se approach karna sach mein mushkil hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does sliding a fixed-size window reduce the complexity from O(n*k) to O(n), and what specifically makes this different from just optimizing the constant factor of the same brute-force approach?',
        qHi: 'Ek fixed-size window ko slide karna complexity ko \`O(n*k)\` se \`O(n)\` tak kyun kam karta hai, aur ye khaas taur par usi brute-force approach ke constant factor ko optimize karne se kaise alag hai?',
        a: 'The brute-force approach recomputes each window\'s sum entirely from scratch, meaning that for each of the roughly n starting positions, it performs k addition operations, giving a total cost proportional to n multiplied by k. Sliding the window instead observes a specific structural fact about how consecutive windows relate to each other: when the window shifts by exactly one position, k - 1 of its k elements are identical to the previous window\'s elements, and only two elements actually change — one element leaves the window at the position that is no longer included, and one new element enters at the position that is newly included. Rather than recomputing the sum of all k elements, the sliding approach maintains a single running total and updates it by performing exactly one subtraction (removing the value of the element that left) and one addition (including the value of the element that entered) at each shift. This changes the cost of each shift from O(k) operations down to a small, fixed number of operations — 2, regardless of what k actually is — meaning the total cost across all roughly n shifts becomes proportional to n multiplied by a constant, which is O(n), not merely a smaller constant multiple of the original O(n*k). This is a fundamentally different complexity class, not an optimized version of the same one: as k grows larger while n stays fixed, the brute-force approach\'s cost grows right alongside it, while the sliding-window approach\'s cost per shift stays exactly the same regardless of k\'s size, since it was never proportional to k in the first place.',
        aHi: 'Brute-force approach har window ka sum poori tarah shuru se dobara ganta hai, matlab lagbhag \`n\` shuruaati positions mein se har ek ke liye, ye \`k\` addition operations perform karta hai, ek total keemat dete hue jo \`n\` ko \`k\` se guna kiye gaye ke anupaat mein hai. Window ko slide karna iske bajaye ek khaas structural tathya dekhta hai ki lagaataar windows ek doosre se kaise judi hain: jab window bilkul ek position se shift hoti hai, iske \`k\` elements mein se \`k - 1\` pichli window ke elements se identical hain, aur sirf do elements asal mein badalte hain — ek element us position par window se bahar nikalta hai jo ab shaamil nahi hai, aur ek naya element us position par andar aata hai jo nayi tarah shaamil hai. Sab \`k\` elements ka sum dobara ganne ke bajaye, sliding approach ek akela chalta total banaaye rakhta hai aur ise bilkul ek subtraction (bahar gaye element ki value hataana) aur ek addition (andar aaye element ki value shaamil karna) perform karke update karta hai har shift par. Ye har shift ki keemat ko \`O(k)\` operations se ek chhoti, fixed tadaad ke operations tak badalta hai — 2, chahe \`k\` asal mein kuch bhi ho — matlab lagbhag sab \`n\` shifts ke aar-paar total keemat \`n\` ko ek constant se guna kiye gaye ke anupaat mein ban jaati hai, jo \`O(n)\` hai, sirf asli \`O(n*k)\` ka ek chhota constant multiple nahi. Ye buniyaadi roop se ek alag complexity class hai, usi ka ek optimized version nahi: jaise \`k\` bada hota jaata hai \`n\` fixed rehte hue, brute-force approach ki keemat iske saath saath badhti hai, jabki sliding-window approach ki prati-shift keemat bilkul samaan rehti hai chahe \`k\` ka size kuch bhi ho, kyunki ye shuru se hi \`k\` ke anupaat mein thi hi nahi.',
      },
      {
        q: 'For the variable-size sliding window pattern, why does a solution containing a loop nested inside another loop still achieve O(n) overall, rather than the O(n²) a nested loop typically produces?',
        qHi: 'Variable-size sliding window pattern ke liye, ek solution jismein ek loop ek doosre ke andar nested hai phir bhi overall \`O(n)\` kyun haasil karta hai, us \`O(n²)\` ke bajaye jo ek nested loop aksar banaata hai?',
        a: 'This course\'s earlier lesson on analyzing loop complexity established the general rule that a loop nested inside another loop typically multiplies their costs, since the inner loop\'s full iteration count is normally paid in full for every single iteration of the outer loop. The variable-size sliding window pattern appears to have exactly this nested shape — an outer loop advancing a right pointer, with an inner while loop advancing a left pointer — but the standard multiplication rule does not apply here because of one specific, crucial property: the left pointer used by the inner loop is never reset backward at the start of a new outer iteration. In a genuine O(n²) nested loop, the inner loop restarts from the same position (typically zero, or the outer loop\'s current index) every single time the outer loop advances, which is precisely what causes its iteration count to be paid in full, over and over. In the sliding window pattern, however, the left pointer retains whatever value it was left at from the previous outer iteration and continues advancing from there, meaning that across the ENTIRE execution of the function, from the very first outer iteration to the very last, the left pointer only ever moves forward and never moves backward. Since left starts at zero and can advance at most n total times before reaching the end of the array, regardless of how many times the outer loop\'s right pointer advances, the total number of times the inner while loop\'s body executes across the whole function is bounded by n, not by n multiplied by n. Adding this bounded total inner-loop work to the outer loop\'s own n iterations gives a combined total of O(n) + O(n), which simplifies to O(n) — the nested visual shape is present, but the usual multiplicative cost is avoided specifically because the inner pointer\'s movement is bounded across the whole run rather than being repeated in full on every outer iteration.',
        aHi: 'Is course ka pehle wala loop complexity ka vishleshan karne wala lesson ye general rule sthaapit karta hai ki ek loop ek doosre ke andar nested unki keemat ko aksar guna karta hai, kyunki inner loop ki poori iteration count aksar poori tarah har akeli outer loop ki iteration ke liye chukaayi jaati hai. Variable-size sliding window pattern bilkul isi nested shape ki tarah dikhta hai — ek outer loop jo ek right pointer ko aage badhaata hai, ek andar wale while loop ke saath jo ek left pointer ko aage badhaata hai — par standard multiplication rule yahaan lagu nahi hota ek khaas, mahatvapoorn property ki wajah se: inner loop dwara istemal kiya gaya left pointer kabhi bhi ek nayi outer iteration ki shuruaat mein peeche reset nahi kiya jaata. Ek asli \`O(n²)\` nested loop mein, inner loop usi position se (aksar zero, ya outer loop ka current index) har akeli baar dobara shuru hota hai jab outer loop aage badhta hai, jo bilkul isliye hai ki iski iteration count poori tarah, baar-baar, chukaayi jaati hai. Sliding window pattern mein, halaanki, left pointer wahi value rakhta hai jispar ye pichli outer iteration se chhoda gaya tha aur wahaan se aage badhna jaari rakhta hai, matlab function ke POORE execution ke aar-paar, bilkul pehli outer iteration se bilkul aakhri tak, left pointer kabhi bhi sirf aage move karta hai aur kabhi peeche nahi. Kyunki \`left\` zero se shuru hota hai aur zyaada se zyaada total \`n\` baar aage badh sakta hai array ke ant tak pahunchne se pehle, is baat se azaad ki outer loop ka right pointer kitni baar aage badhta hai, poore function mein andar wale while loop ke body ke execute hone ki total tadaad \`n\` se bounded hai, \`n\` ko \`n\` se guna kiye gaye se nahi. Is bounded total inner-loop kaam ko outer loop ki apni \`n\` iterations mein jodna \`O(n) + O(n)\` ka ek combined total deta hai, jo \`O(n)\` mein simplify hota hai — nested visual shape maujood hai, par usual multiplicative keemat khaas taur par isliye avoid ki jaati hai kyunki inner pointer ki chaal poore run mein bounded hai har outer iteration par poori tarah dohraaye jaane ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken (re-sum from scratch) and fixed (slide the window) maxSubarraySum functions from this lesson. Time both with a 1-million-item array and k = 1000, using console.time/console.timeEnd.',
        taskHi: 'Is lesson ke toote (shuru se dobara sum) aur theek (window slide karna) \`maxSubarraySum\` functions dono banao. Dono ko ek 1-million-item array aur \`k = 1000\` ke saath time karo, \`console.time\`/\`console.timeEnd\` istemal karte hue.',
        hint: 'The timing difference should be dramatic here since k is large — this is exactly the scenario where O(n*k) versus O(n) matters most visibly.',
        hintHi: 'Timing farak yahaan naatakiya hona chahiye kyunki \`k\` bada hai — ye bilkul wo scenario hai jahan \`O(n*k)\` versus \`O(n)\` sabse zyaada drishya roop se maayne rakhta hai.',
      },
      {
        task: 'Trace through the smallestSubarraySum variable-size window example from this lesson by hand for nums = [2, 3, 1, 2, 4, 3], target = 7, writing down left, right, and windowSum after every single change.',
        taskHi: 'Is lesson ke \`smallestSubarraySum\` variable-size window example ko haath se trace karo \`nums = [2, 3, 1, 2, 4, 3]\`, \`target = 7\` ke liye, har akele badlaav ke baad \`left\`, \`right\`, aur \`windowSum\` likhte hue.',
        hint: 'Add a console.log inside both the outer for loop and the inner while loop to confirm your hand trace against what the code actually does.',
        hintHi: 'Dono outer for loop aur inner while loop ke andar ek \`console.log\` jodo apne haath-se-trace ko us se confirm karne ke liye jo code asal mein karta hai.',
      },
      {
        task: 'Add a console.log counting how many total times left advances across the entire run of smallestSubarraySum for a large test array, and confirm it never exceeds n, following this lesson\'s complexity explanation.',
        taskHi: 'Ek \`console.log\` jodo ye ganne ke liye ki \`smallestSubarraySum\` ke poore run mein \`left\` kitni total baar aage badhta hai ek bade test array ke liye, aur confirm karo ki ye kabhi \`n\` se zyaada nahi hota, is lesson ke complexity spashteekaran ka palan karte hue.',
        hint: 'Increment a counter variable every time left++ runs, then compare its final value to nums.length after the function finishes.',
        hintHi: 'Ek counter variable increment karo har baar jab \`left++\` chalta hai, phir function khatam hone ke baad iski aakhri value ko \`nums.length\` se compare karo.',
      },
    ],

    keyTakeaways: [
      'A fixed-size sliding window avoids recomputing a range\'s sum from scratch by subtracting the one element leaving and adding the one element entering at each shift, turning O(n*k) into O(n).',
      'A variable-size sliding window grows and shrinks based on a condition, searching for the smallest or largest contiguous range that satisfies it, using a left and right pointer that both only ever move forward.',
      'Sliding window\'s signal is a problem about a CONTIGUOUS range (a subarray or substring) — it does not apply to problems about arbitrary, non-contiguous subsets.',
      'A variable-size window\'s loop-nested-inside-a-loop shape still achieves O(n) overall because the inner pointer\'s total movement is bounded by n across the entire run, never resetting backward.',
      'Both window shapes solve the same underlying waste: recomputing a property over a range from scratch when only a small part of that range actually changed since the last computation.',
      'Recognizing sliding window follows this course\'s general pattern-recognition process: identify what the brute force wastefully repeats, then find the structural property (contiguity) that lets a running value be updated instead.',
    ],
    keyTakeawaysHi: [
      'Ek fixed-size sliding window ek range ka sum shuru se dobara ganne se bachta hai us ek element ko ghataake jo bahar jaata hai aur us ek element ko jodke jo har shift par andar aata hai, \`O(n*k)\` ko \`O(n)\` mein badalte hue.',
      'Ek variable-size sliding window ek condition ke aadhaar par badhti aur simatti hai, sabse chhoti ya sabse badi contiguous range dhoondte hue jo ise poora karti hai, ek left aur right pointer istemal karte hue jo dono sirf aage move karte hain.',
      'Sliding window ka signal ek CONTIGUOUS range (ek subarray ya substring) ke baare mein ek problem hai — ye manmaane, non-contiguous subsets ke baare mein problems par lagu nahi hota.',
      'Ek variable-size window ki loop-nested-inside-a-loop shape phir bhi overall \`O(n)\` haasil karti hai kyunki inner pointer ki total chaal poore run mein \`n\` se bounded hai, kabhi peeche reset nahi hote hue.',
      'Dono window shapes usi underlying barbaadi ko sulajhaate hain: ek range par ek property ko shuru se dobara ganna jab us range ka sirf ek chhota hissa asal mein pichli calculation ke baad badla hai.',
      'Sliding window pehchaanna is course ke general pattern-recognition process ka palan karta hai: pehchaano ki brute force bekaar mein kya dohraata hai, phir wo structural property (contiguity) dhoondho jo ek chalti value ko update hone deti hai.',
    ],
  },
];
