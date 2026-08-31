/**
 * DSA Complete Course — Module 3: Hashing, lesson 5.
 *
 * The prefix-sum-plus-hashmap pattern: counting or finding subarrays whose sum
 * hits a target. This is the hashing lesson that unlocks a whole interview
 * family — "subarray sum equals k", "subarray sums divisible by k",
 * "contiguous array of equal 0s and 1s", "longest subarray with sum k". It is
 * also the honest answer to "why did my sliding window give the wrong result":
 * sliding window assumes the running sum is monotonic as the window grows,
 * which is true only for non-negative values. The moment negatives appear, you
 * switch to prefix sums stored in a hash map.
 *
 * Broken example: applying the two-pointer sliding window to "count subarrays
 * summing to k" on an array that contains negative numbers. It silently misses
 * valid windows because shrinking from the left can never recover a sum that a
 * later negative element will bring back down.
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

export const DSA_MODULE_3_PART5: CourseLesson[] = [
  {
    slug: 'prefix-sums-with-a-hashmap-subarray-targets',
    title: 'Prefix Sums Meet Hashing: Counting Subarrays That Hit a Target',
    titleHi: 'Prefix Sums Aur Hashing: Target Par Pahunchne Waale Subarrays Ginna',
    description: 'Counting how many contiguous stretches of an array add up to a target value by growing and shrinking a two-pointer window. It works flawlessly while every number is positive, then quietly returns a wrong count the moment a negative number appears, because shrinking the window from the left can never undo a drop the sum is about to take from a negative element further right.',
    descriptionHi: 'Ek array ke kitne lagataar hisse ek target value tak jodte hain ye ek two-pointer window badhaakar aur ghataakar ginna. Ye tab tak bekhata kaam karta hai jab tak har number positive hai, phir chupchaap ek galat count lautaata hai jis pal ek negative number aata hai, kyunki window ko left se ghataana ek girawat ko kabhi undo nahi kar sakta jo sum aage daayen ek negative element se lene waala hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**Reading a hiking trail\'s elevation log and being asked how many stretches of the walk had a net elevation change of exactly zero.** If the trail only ever climbed, you could use a simple moving window: extend the far end while the climb is too small, pull in the near end while it is too big. But real trails go down as well as up. Now a stretch that currently reads +40 might, if you extend it just a little further to include an upcoming descent, drop right back to 0 — so you can never rule a stretch out just because it looks too high right now. The technique that works regardless: keep a running total of the elevation from the trailhead to your current position, and every time you reach a new position, write that running total into a notebook alongside how many times you have seen it before. When your running total is R and you want a stretch summing to zero, you simply ask the notebook how many earlier positions also had running total R — each one marks the start of a stretch that nets to zero ending here. For a non-zero target T, you ask for running total R minus T instead. One pass, one notebook, and descents cause no trouble at all.',
      hi: '**Ek hiking trail ke elevation log ko padhna aur poochha jaana ki walk ke kitne hisson mein net elevation change bilkul zero tha.** Agar trail sirf hamesha chadhta, aap ek saral moving window istemal kar sakte the: door ke sire ko badhao jab chadhaai bahut kam hai, paas ke sire ko kheencho jab wo bahut zyaada hai. Par asli trails neeche bhi jaate hain aur upar bhi. Ab ek hissa jo abhi +40 padhta hai, agar aap ise thoda aur aage badhaao ek aane waali utraai shaamil karne ke liye, wapas 0 par gir sakta hai — isliye aap ek hisse ko sirf isliye khaarij nahi kar sakte ki wo abhi bahut ooncha dikhta hai. Wo technique jo chahe kuch bhi ho kaam karti hai: trailhead se apni current position tak elevation ka ek running total rakho, aur har baar jab aap ek nayi position par pahuncho, us running total ko ek notebook mein likho iske saath ki aapne ise pehle kitni baar dekha. Jab aapka running total R hai aur aap zero tak jodne waala ek hissa chahte ho, aap bas notebook se poochhte ho kitni pehli positions ka bhi running total R tha — har ek yahaan khatam hone waale ek zero-net hisse ki shuruaat mark karta hai. Ek non-zero target T ke liye, aap iske bajaye running total R minus T maangte ho. Ek pass, ek notebook, aur utraaiyon se koi pareshani nahi.',
    },

    simple: `**Start broken.** The sliding window for "count subarrays summing to k", on an array with negatives:

\`\`\`js
function countSubarraysWindow(nums, k) {
  let count = 0, sum = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k && left <= right) {   // shrink from the left
      sum -= nums[left++];
    }
    if (sum === k) count++;
  }
  return count;
}

console.log(countSubarraysWindow([1, 2, 3], 3));       // 2  -> [1,2] and [3]   OK for positives
console.log(countSubarraysWindow([1, -1, 0], 0));      // returns 1, should be 3
// missed: [1,-1], [0], and [1,-1,0]
\`\`\`

Sliding window relies on one property: as the window grows, the sum grows too, so if the sum is over target you can shrink to bring it back. A negative element breaks that — the sum can go *up* when you shrink and *down* when you grow, so there is no direction to move the pointers.

**The fix: prefix sums in a hash map**

\`\`\`js
function countSubarraysSumK(nums, k) {
  const count = new Map();
  count.set(0, 1);            // one "empty prefix" with sum 0, so a prefix that
                              // itself equals k is counted
  let running = 0, answer = 0;
  for (const x of nums) {
    running += x;                                  // prefix sum up to here
    answer += count.get(running - k) || 0;         // how many earlier prefixes = running - k
    count.set(running, (count.get(running) || 0) + 1);
  }
  return answer;
}

console.log(countSubarraysSumK([1, 2, 3], 3));     // 2
console.log(countSubarraysSumK([1, -1, 0], 0));    // 3
console.log(countSubarraysSumK([1, 1, 1], 2));     // 2
\`\`\`

\`\`\`ts
function countSubarraysSumK(nums: number[], k: number): number {
  const count = new Map<number, number>();
  count.set(0, 1);
  let running = 0, answer = 0;
  for (const x of nums) {
    running += x;
    answer += count.get(running - k) ?? 0;
    count.set(running, (count.get(running) ?? 0) + 1);
  }
  return answer;
}
\`\`\`

The sum of \`nums[i..j]\` equals \`prefix[j] - prefix[i-1]\`. If that must equal \`k\`, then \`prefix[i-1] = prefix[j] - k\`. So at each position \`j\` (with prefix sum \`running\`), the number of valid subarrays ending at \`j\` is exactly how many earlier prefix sums equalled \`running - k\`. The hash map counts those in O(1). The \`count.set(0, 1)\` seed represents the empty prefix, so a subarray starting at index 0 gets counted.`,

    simpleHi: `**Toote hue se shuru.** "k tak jodne waale subarrays gino" ke liye sliding window, negatives waale array par:

\`\`\`js
function countSubarraysWindow(nums, k) {
  let count = 0, sum = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k && left <= right) {   // left se ghatao
      sum -= nums[left++];
    }
    if (sum === k) count++;
  }
  return count;
}

console.log(countSubarraysWindow([1, 2, 3], 3));       // 2  -> [1,2] aur [3]   positives ke liye OK
console.log(countSubarraysWindow([1, -1, 0], 0));      // 1 lautaata hai, 3 hona chahiye
// chhoot gaye: [1,-1], [0], aur [1,-1,0]
\`\`\`

Sliding window ek property par nirbhar karta hai: jaise window badhta hai, sum bhi badhta hai, isliye agar sum target se zyaada hai aap ghataakar ise wapas laa sakte ho. Ek negative element ise todta hai — sum ghataane par *upar* jaa sakta hai aur badhaane par *neeche*, isliye pointers ko move karne ki koi disha nahi.

**Fix: ek hash map mein prefix sums**

\`\`\`js
function countSubarraysSumK(nums, k) {
  const count = new Map();
  count.set(0, 1);            // sum 0 waala ek "empty prefix", taaki ek prefix jo
                              // khud k ke barabar hai gina jaaye
  let running = 0, answer = 0;
  for (const x of nums) {
    running += x;                                  // yahaan tak prefix sum
    answer += count.get(running - k) || 0;         // kitne pehle prefixes = running - k
    count.set(running, (count.get(running) || 0) + 1);
  }
  return answer;
}

console.log(countSubarraysSumK([1, 2, 3], 3));     // 2
console.log(countSubarraysSumK([1, -1, 0], 0));    // 3
console.log(countSubarraysSumK([1, 1, 1], 2));     // 2
\`\`\`

\`\`\`ts
function countSubarraysSumK(nums: number[], k: number): number {
  const count = new Map<number, number>();
  count.set(0, 1);
  let running = 0, answer = 0;
  for (const x of nums) {
    running += x;
    answer += count.get(running - k) ?? 0;
    count.set(running, (count.get(running) ?? 0) + 1);
  }
  return answer;
}
\`\`\`

\`nums[i..j]\` ka sum \`prefix[j] - prefix[i-1]\` ke barabar hai. Agar wo \`k\` ke barabar hona chahiye, toh \`prefix[i-1] = prefix[j] - k\`. Toh har position \`j\` par (prefix sum \`running\` ke saath), \`j\` par khatam hone waale valid subarrays ki tadaad bilkul ye hai ki kitne pehle prefix sums \`running - k\` ke barabar the. Hash map unhe O(1) mein ginta hai. \`count.set(0, 1)\` seed empty prefix darshaata hai, taaki index 0 se shuru hone waala ek subarray gina jaaye.`,

    content: `## The core identity, and the seed that trips everyone

\`\`\`
sum(nums[i..j])  =  prefix[j] - prefix[i-1]        where prefix[-1] = 0

want that == k   =>   prefix[i-1] = prefix[j] - k

So: at each j, look up how many earlier prefix values equal (prefix[j] - k).

THE SEED: count.set(0, 1) before the loop.
  It says "there is one prefix, the empty one, with sum 0".
  Without it, a subarray that starts at index 0 and sums to k is missed,
  because its prefix[i-1] is prefix[-1] = 0, and 0 was never recorded.
\`\`\`

The ordering inside the loop matters too: **look up first, then insert**. If you insert \`running\` before the lookup, then when \`k == 0\` you count the current prefix against itself — a zero-length subarray. Look up, then insert.

## The family: same skeleton, different key

\`\`\`js
// 1. LONGEST subarray with sum k  (store the FIRST index a prefix sum appears)
function longestSubarraySumK(nums, k) {
  const firstSeen = new Map([[0, -1]]);   // prefix 0 "ends" at index -1
  let running = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i];
    if (firstSeen.has(running - k)) best = Math.max(best, i - firstSeen.get(running - k));
    if (!firstSeen.has(running)) firstSeen.set(running, i);   // keep the EARLIEST
  }
  return best;
}

// 2. subarray sums DIVISIBLE by k  (key on running % k, normalised to be non-negative)
function subarraysDivByK(nums, k) {
  const count = new Map([[0, 1]]);
  let running = 0, answer = 0;
  for (const x of nums) {
    running = ((running + x) % k + k) % k;              // JS % can be negative — normalise
    answer += count.get(running) || 0;
    count.set(running, (count.get(running) || 0) + 1);
  }
  return answer;
}

// 3. CONTIGUOUS ARRAY: longest stretch with equal 0s and 1s
//    trick: map 0 -> -1, then it is "longest subarray with sum 0"
function findMaxLength(nums) {
  const firstSeen = new Map([[0, -1]]);
  let running = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i] === 0 ? -1 : 1;
    if (firstSeen.has(running)) best = Math.max(best, i - firstSeen.get(running));
    else firstSeen.set(running, i);
  }
  return best;
}
\`\`\`

\`\`\`
COUNTING a target       -> Map<prefixSum, howManyTimesSeen>,  look up (running - k)
LONGEST for a target    -> Map<prefixSum, firstIndexSeen>,    keep earliest, measure i - stored
DIVISIBILITY by k       -> key on (running % k), normalised non-negative
"equal count of A and B"-> map one to +1, the other to -1, then it is "sum == 0"
\`\`\`

## Why not just prefix-sum array + nested loop?

\`\`\`
A prefix-sum array alone gives you O(1) range-sum, but finding ALL pairs
(i, j) with prefix[j] - prefix[i] == k still needs a double loop -> O(n^2).

The hash map removes the inner loop: instead of scanning all earlier i,
you ask the map "how many earlier prefixes had the exact value I need"
in O(1).  Total O(n) time, O(n) space.
\`\`\`

This is the general shape of "turn an O(n^2) pair-search into O(n) with a hash map" — the same move as two-sum. Here the "pair" is two prefix sums whose difference is k.

## The recognition checklist

\`\`\`
"count / find subarrays whose sum is exactly k"          prefix sum + Map<sum, count>
"...and the array has NEGATIVE numbers"                   this, NOT sliding window
"longest / shortest subarray with sum k"                  Map<sum, firstIndex>, keep earliest
"subarray sum divisible by k"                             key on running % k (normalised)
"subarray with equal #0s and #1s / #a and #b"             remap to +1/-1, target sum 0
"count subarrays with at most K distinct" (positives)     THAT one is sliding window

Interview tell: the question is about a CONTIGUOUS subarray and a sum condition.
If all values are positive and the condition is a bound (<=, at most), sliding
window. If values can be negative, or the condition is exact equality, or you
need a count of all of them, it is prefix sum + hash map.
\`\`\``,

    contentHi: `## Mool identity, aur wo seed jispar sab girte hain

\`\`\`
sum(nums[i..j])  =  prefix[j] - prefix[i-1]        jahaan prefix[-1] = 0

wo == k chahiye   =>   prefix[i-1] = prefix[j] - k

Toh: har j par, dekho kitni pehli prefix values (prefix[j] - k) ke barabar hain.

SEED: loop se pehle count.set(0, 1).
  Ye kehta hai "ek prefix hai, empty waala, sum 0 ke saath".
  Iske bina, ek subarray jo index 0 se shuru hota hai aur k tak jodta hai chhoot jaata hai,
  kyunki iska prefix[i-1] prefix[-1] = 0 hai, aur 0 kabhi record nahi hua.
\`\`\`

Loop ke andar kram bhi maayne rakhta hai: **pehle lookup, phir insert**. Agar aap lookup se pehle \`running\` insert karte ho, toh jab \`k == 0\` aap current prefix ko khud ke against ginte ho — ek zero-length subarray. Lookup, phir insert.

## Family: wahi skeleton, alag key

\`\`\`js
// 1. sum k waala SABSE LAMBA subarray  (ek prefix sum jahaan pehli baar aata hai wo index store karo)
function longestSubarraySumK(nums, k) {
  const firstSeen = new Map([[0, -1]]);   // prefix 0 index -1 par "khatam" hota hai
  let running = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i];
    if (firstSeen.has(running - k)) best = Math.max(best, i - firstSeen.get(running - k));
    if (!firstSeen.has(running)) firstSeen.set(running, i);   // SABSE PEHLA rakho
  }
  return best;
}

// 2. k se VIBHAAJYA subarray sums  (running % k par key, non-negative banaaya gaya)
function subarraysDivByK(nums, k) {
  const count = new Map([[0, 1]]);
  let running = 0, answer = 0;
  for (const x of nums) {
    running = ((running + x) % k + k) % k;              // JS % negative ho sakta hai — normalise
    answer += count.get(running) || 0;
    count.set(running, (count.get(running) || 0) + 1);
  }
  return answer;
}

// 3. CONTIGUOUS ARRAY: barabar 0s aur 1s waala sabse lamba hissa
//    trick: 0 -> -1 map karo, phir ye "sum 0 waala sabse lamba subarray" hai
function findMaxLength(nums) {
  const firstSeen = new Map([[0, -1]]);
  let running = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i] === 0 ? -1 : 1;
    if (firstSeen.has(running)) best = Math.max(best, i - firstSeen.get(running));
    else firstSeen.set(running, i);
  }
  return best;
}
\`\`\`

\`\`\`
ek target GINNA           -> Map<prefixSum, kitniBaarDekha>,  (running - k) dekho
ek target ke liye SABSE LAMBA -> Map<prefixSum, pehlaIndexDekha>,  sabse pehla rakho, i - stored maapo
k se VIBHAAJYATA           -> (running % k) par key, non-negative normalise
"A aur B ki barabar ginti" -> ek ko +1, doosre ko -1 map karo, phir ye "sum == 0" hai
\`\`\`

## Sirf prefix-sum array + nested loop kyun nahi?

\`\`\`
Akela ek prefix-sum array aapko O(1) range-sum deta hai, par sab jodiyaan
(i, j) dhoondhna jahaan prefix[j] - prefix[i] == k abhi bhi ek double loop chahiye -> O(n^2).

Hash map inner loop hataata hai: sab pehle i scan karne ke bajaye,
aap map se poochhte ho "kitne pehle prefixes ki wo exact value thi jo mujhe chahiye"
O(1) mein.  Kul O(n) time, O(n) space.
\`\`\`

Ye "ek O(n^2) pair-search ko ek hash map ke saath O(n) mein badlo" ka general shape hai — two-sum jaisa hi move. Yahaan "pair" do prefix sums hain jinka antar k hai.

## Pehchaanne ki checklist

\`\`\`
"un subarrays ko gino / dhoondho jinka sum bilkul k hai"     prefix sum + Map<sum, count>
"...aur array mein NEGATIVE numbers hain"                     ye, sliding window NAHI
"sum k waala sabse lamba / chhota subarray"                   Map<sum, firstIndex>, sabse pehla rakho
"k se vibhaajya subarray sum"                                 running % k par key (normalised)
"barabar #0s aur #1s / #a aur #b waala subarray"              +1/-1 par remap karo, target sum 0
"at most K distinct waale subarrays gino" (positives)         WO sliding window hai

Interview sanket: sawaal ek CONTIGUOUS subarray aur ek sum condition ke baare mein hai.
Agar sab values positive hain aur condition ek bound hai (<=, at most), sliding
window. Agar values negative ho sakti hain, ya condition exact equality hai, ya
aapko un sabki count chahiye, ye prefix sum + hash map hai.
\`\`\``,

    examples: [
      {
        title: 'Broken: sliding window on an array with negatives',
        titleHi: 'Toota: negatives waale array par sliding window',
        code: `while (sum > k) sum -= nums[left++];   // assumes shrinking always lowers the sum toward k`,
        codeJs: `function countSubarraysWindow(nums, k) {
  let count = 0, sum = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k && left <= right) sum -= nums[left++];
    if (sum === k) count++;
  }
  return count;
}
console.log(countSubarraysWindow([1, 2, 3], 3));    // 2  (positives -> fine)
console.log(countSubarraysWindow([1, -1, 0], 0));   // 1  (should be 3)
console.log(countSubarraysWindow([3, -1, -1, 1], 1)); // 0  (should be 2: [3,-1,-1] and [1])`,
        codeTs: `function countSubarraysWindow(nums: number[], k: number): number {
  let count = 0, sum = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right]!;
    while (sum > k && left <= right) sum -= nums[left++]!;
    if (sum === k) count++;
  }
  return count;
}`,
        outputJs: `2
1
0`,
        outputTs: `// The negative cases are undercounted — sliding window has no valid move
// when the running sum is not monotonic in the window size.`,
        explain: 'On [1,-1,0] with k=0 the true answer is 3: [1,-1], [0], [1,-1,0]. The window never shrinks (sum never exceeds 0) and only checks sum === k at each right endpoint, so it finds just one. Sliding window needs the sum to rise as the window grows — negatives break that.',
        explainHi: '[1,-1,0] par k=0 ke saath asli jawaab 3 hai: [1,-1], [0], [1,-1,0]. Window kabhi nahi ghatta (sum kabhi 0 se zyaada nahi) aur sirf har right endpoint par sum === k check karta hai, isliye ye sirf ek dhoondhta hai. Sliding window ko chahiye ki sum window badhne par bade — negatives ise todte hain.',
      },
      {
        title: 'Fixed: prefix sum counts in a Map',
        titleHi: 'Theek: ek Map mein prefix sum counts',
        code: `answer += count.get(running - k) || 0;   // earlier prefixes that make a k-subarray
count.set(running, (count.get(running) || 0) + 1);`,
        codeJs: `function countSubarraysSumK(nums, k) {
  const count = new Map();
  count.set(0, 1);
  let running = 0, answer = 0;
  for (const x of nums) {
    running += x;
    answer += count.get(running - k) || 0;
    count.set(running, (count.get(running) || 0) + 1);
  }
  return answer;
}
console.log(countSubarraysSumK([1, 2, 3], 3));       // 2
console.log(countSubarraysSumK([1, -1, 0], 0));      // 3
console.log(countSubarraysSumK([3, -1, -1, 1], 1));  // 2   ([3,-1,-1] and [1])
console.log(countSubarraysSumK([1, -1, 1, -1], 0));  // 4
console.log(countSubarraysSumK([1, 1, 1], 2));       // 2`,
        codeTs: `function countSubarraysSumK(nums: number[], k: number): number {
  const count = new Map<number, number>();
  count.set(0, 1);
  let running = 0, answer = 0;
  for (const x of nums) {
    running += x;
    answer += count.get(running - k) ?? 0;
    count.set(running, (count.get(running) ?? 0) + 1);
  }
  return answer;
}`,
        outputJs: `2
3
2
4
2`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'At each position the running prefix sum is looked up as (running - k) in the Map, which returns how many earlier prefixes would close a k-summing subarray ending here. The count.set(0, 1) seed handles subarrays that start at index 0. Negatives are irrelevant — no monotonicity assumed.',
        explainHi: 'Har position par running prefix sum ko Map mein (running - k) ki tarah dekha jaata hai, jo lautaata hai kitne pehle prefixes yahaan khatam hone waale ek k-summing subarray ko band karenge. count.set(0, 1) seed index 0 se shuru hone waale subarrays sambhaalta hai. Negatives asangat hain — koi monotonicity nahi maani gayi.',
      },
      {
        title: 'The family: longest-sum-k, divisible-by-k, contiguous 0s/1s',
        titleHi: 'Family: longest-sum-k, k-se-vibhaajya, contiguous 0s/1s',
        code: `// longest: Map<sum, FIRST index>; divisible: key on running % k; 0s/1s: remap 0 -> -1`,
        codeJs: `function longestSubarraySumK(nums, k) {
  const first = new Map([[0, -1]]);
  let running = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i];
    if (first.has(running - k)) best = Math.max(best, i - first.get(running - k));
    if (!first.has(running)) first.set(running, i);
  }
  return best;
}
function subarraysDivByK(nums, k) {
  const count = new Map([[0, 1]]);
  let running = 0, answer = 0;
  for (const x of nums) {
    running = ((running + x) % k + k) % k;
    answer += count.get(running) || 0;
    count.set(running, (count.get(running) || 0) + 1);
  }
  return answer;
}
function findMaxLength(nums) {
  const first = new Map([[0, -1]]);
  let running = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    running += nums[i] === 0 ? -1 : 1;
    if (first.has(running)) best = Math.max(best, i - first.get(running));
    else first.set(running, i);
  }
  return best;
}
console.log(longestSubarraySumK([1, -1, 5, -2, 3], 3));  // 4  -> [1,-1,5,-2]
console.log(subarraysDivByK([4, 5, 0, -2, -3, 1], 5));   // 7
console.log(findMaxLength([0, 1, 0, 1, 1, 0]));          // 6`,
        codeTs: `function subarraysDivByK(nums: number[], k: number): number {
  const count = new Map<number, number>([[0, 1]]);
  let running = 0, answer = 0;
  for (const x of nums) {
    running = ((running + x) % k + k) % k;
    answer += count.get(running) ?? 0;
    count.set(running, (count.get(running) ?? 0) + 1);
  }
  return answer;
}`,
        outputJs: `4
7
6`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Same prefix-sum skeleton, three keys. "Longest" stores the earliest index a prefix appears (so i minus it is maximal). "Divisible" keys on running % k, normalised to be non-negative because JS % keeps the dividend\'s sign. "Contiguous" remaps 0 to -1 so equal counts become a sum of zero.',
        explainHi: 'Wahi prefix-sum skeleton, teen keys. "Longest" wo sabse pehla index store karta hai jahaan ek prefix aata hai (taaki i minus wo maximal ho). "Divisible" running % k par key karta hai, non-negative normalise kyunki JS % dividend ka sign rakhta hai. "Contiguous" 0 ko -1 par remap karta hai taaki barabar counts sum zero ban jaayein.',
      },
    ],

    mistakes: [
      {
        wrong: `// forgetting the count.set(0, 1) seed
const count = new Map();          // no seed
let running = 0, answer = 0;
for (const x of nums) { running += x; answer += count.get(running - k) || 0; ... }
// misses every subarray that starts at index 0`,
        right: `const count = new Map();
count.set(0, 1);                  // the empty prefix has sum 0, seen once`,
        why: 'A subarray from index 0 to j has sum prefix[j] - prefix[-1], and prefix[-1] is defined as 0. Without recording that 0 exists once, the lookup for running - k == 0 finds nothing, and every prefix-length subarray that hits k is silently dropped.',
        whyHi: 'Index 0 se j tak ke ek subarray ka sum prefix[j] - prefix[-1] hai, aur prefix[-1] 0 paribhaashit hai. Us 0 ke ek baar maujood hone ko record kiye bina, running - k == 0 ke liye lookup kuch nahi dhoondhta, aur k par pahunchne waala har prefix-length subarray chupchaap gir jaata hai.',
      },
      {
        wrong: `// inserting into the map BEFORE looking up
count.set(running, (count.get(running) || 0) + 1);
answer += count.get(running - k) || 0;   // when k === 0, counts the current prefix against itself`,
        right: `answer += count.get(running - k) || 0;   // look up first
count.set(running, (count.get(running) || 0) + 1);`,
        why: 'A subarray must have a start strictly before its end. Looking up before inserting guarantees you only match prefixes from strictly earlier positions. Insert-then-lookup lets the current prefix match itself when k is 0, counting a zero-length subarray.',
        whyHi: 'Ek subarray ka start iske end se sakhti se pehle hona chahiye. Insert se pehle lookup karna guarantee deta hai ki aap sirf sakhti se pehli positions ke prefixes match karo. Insert-phir-lookup current prefix ko khud match karne deta hai jab k 0 hai, ek zero-length subarray ginte hue.',
      },
      {
        wrong: `// "divisible by k" without normalising a negative modulo
running = (running + x) % k;
answer += count.get(running) || 0;
// on [-2] with k=5, running is -2, but the matching prefix was stored as 3`,
        right: `running = ((running + x) % k + k) % k;   // force into 0 .. k-1`,
        why: 'JavaScript\'s % returns a result with the sign of the dividend, so (-2) % 5 is -2, not 3. Two prefixes that are congruent mod k can then be stored under different keys (-2 and 3), and the count misses the pair. Adding k and taking % again normalises every remainder into 0..k-1.',
        whyHi: 'JavaScript ka % dividend ke sign waala nateeja lautaata hai, isliye (-2) % 5 -2 hai, 3 nahi. Do prefixes jo mod k congruent hain phir alag keys (-2 aur 3) ke tahat store ho sakte hain, aur count us jodi ko chhod deta hai. k jodkar aur phir % lena har remainder ko 0..k-1 mein normalise karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**Financial and metrics analysis** — "over how many trailing windows did net cash flow equal zero", "find the longest period where gains balanced losses" — is exactly prefix-sum-plus-hashmap over a signed series.',
        hi: '**Financial aur metrics analysis** — "kitne trailing windows par net cash flow zero tha", "sabse lamba period dhoondho jahaan gains ne losses balance kiye" — bilkul ek signed series par prefix-sum-plus-hashmap hai.',
      },
      {
        en: '**Log and event stream processing** counts intervals where a running counter (errors minus recoveries, arrivals minus departures) returns to a target, without re-summing any window — one pass, one map.',
        hi: '**Log aur event stream processing** un intervals ko ginta hai jahaan ek running counter (errors minus recoveries, arrivals minus departures) ek target par wapas aata hai, bina kisi window ko dobara sum kiye — ek pass, ek map.',
      },
      {
        en: '**Bioinformatics** finds GC-balanced regions of a DNA strand by mapping G/C to +1 and A/T to -1 and looking for the longest zero-sum stretch — the contiguous-array trick applied to four-letter data.',
        hi: '**Bioinformatics** ek DNA strand ke GC-balanced regions dhoondhta hai G/C ko +1 aur A/T ko -1 map karke aur sabse lambe zero-sum hisse ko dhoondhkar — chaar-akshar data par lagaaya gaya contiguous-array trick.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does sliding window fail for "subarray sum equals k" when the array has negatives, and what replaces it?',
        qHi: '"Subarray sum equals k" ke liye sliding window kyun fail hota hai jab array mein negatives hain, aur iski jagah kya leta hai?',
        a: 'Sliding window works by keeping two pointers and a running sum of the elements between them, and it depends on one property: as you extend the right pointer, the sum can only grow, and as you pull in the left pointer, the sum can only shrink. That monotonic behaviour is what lets you make a decision — if the sum is too big, shrink from the left; if too small, grow on the right — and be sure you are heading toward the target. It holds exactly when every element is non-negative. Introduce a negative number and it breaks: extending the window can now decrease the sum, and shrinking it can increase the sum. There is no longer a direction that reliably moves you toward k, so the two-pointer decision logic has nothing to base itself on, and windows that would have summed to k get skipped. The replacement is prefix sums stored in a hash map. Define the prefix sum at position j as the total of all elements from the start up to and including j, with an implicit prefix sum of zero before the array begins. The sum of the subarray from i to j is then the prefix sum at j minus the prefix sum at i minus one. If you want that to equal k, you need the prefix sum at i minus one to equal the prefix sum at j minus k. So the algorithm makes a single left-to-right pass, maintaining the running prefix sum and a hash map from each prefix-sum value to how many times it has occurred. At each position, before recording the current prefix sum, you look up how many earlier prefixes had the value current-minus-k, and add that to the answer, because each one marks the start of a valid subarray ending here. Then you record the current prefix sum. The map is seeded with the value zero mapped to a count of one, representing the empty prefix, so that subarrays starting at index zero are counted. Negatives cause no problem at all, because nothing in this method assumes the sum moves in any particular direction. It is O of n time and O of n space.',
        aHi: 'Sliding window do pointers aur unke beech elements ka ek running sum rakhkar kaam karta hai, aur ye ek property par nirbhar karta hai: jaise aap right pointer badhaate ho, sum sirf bad sakta hai, aur jaise aap left pointer kheenchte ho, sum sirf ghat sakta hai. Wo monotonic vyavhaar wo hai jo aapko ek faisla lene deta hai — agar sum bahut bada hai, left se ghatao; agar bahut chhota, right par badhao — aur nishchit ho ki aap target ki taraf jaa rahe ho. Ye bilkul tab tikta hai jab har element non-negative ho. Ek negative number laao aur ye tootta hai: window badhaana ab sum ghata sakta hai, aur ise ghataana sum badha sakta hai. Ab koi disha nahi jo bharosemand tarike se aapko k ki taraf le jaaye. Iski jagah hash map mein store kiye prefix sums lete hain. Position j par prefix sum ko shuruaat se j tak aur j sameet sab elements ke total ki tarah paribhaashit karo, array shuru hone se pehle ek implicit prefix sum zero ke saath. i se j tak subarray ka sum phir j par prefix sum minus i minus ek par prefix sum hai. Agar aap chahte ho wo k ke barabar ho, aapko i minus ek par prefix sum ko j par prefix sum minus k ke barabar chahiye. Toh algorithm ek akela left-to-right pass karta hai, running prefix sum aur har prefix-sum value se wo kitni baar aayi uska ek hash map rakhte hue. Map ko zero ki value ek ke count par map karke seed kiya jaata hai, empty prefix darshaate hue.',
      },
      {
        q: 'For "longest subarray with sum k" you store the first index a prefix appears; for "count subarrays with sum k" you store a count. Why the difference?',
        qHi: '"Sum k waale sabse lambe subarray" ke liye aap wo pehla index store karte ho jahaan ek prefix aata hai; "sum k waale subarrays ginne" ke liye aap ek count store karte ho. Antar kyun?',
        a: 'The two problems ask for different things about the set of valid subarrays, so the hash map has to remember different information. For counting, you want the total number of subarrays whose sum is k. Every pair of a current position and an earlier prefix equal to current-minus-k is one such subarray, and they are all distinct, so what you need from the map is a tally: for each prefix-sum value, how many positions have had it. When you reach a new position you add the tally for current-minus-k to your answer, then bump the tally for the current prefix sum. Duplicates matter here — if three earlier positions all had the same prefix sum, that is three subarrays, not one. For the longest subarray, you do not care how many valid subarrays there are, only about the maximum length of one. A subarray from just after position p to position j has length j minus p. To make that as large as possible for a fixed j, you want p as small as possible, meaning the earliest position that had the required prefix sum. So the map should store, for each prefix-sum value, the first index at which it occurred, and you must not overwrite it on later occurrences — a later occurrence would only give a shorter subarray. That is why the longest variant checks "if the map does not already have this prefix sum, insert it" rather than unconditionally setting it. The counting variant, by contrast, always increments. There is a parallel subtlety in the seed: counting seeds zero mapped to one because it is a tally, while longest seeds zero mapped to minus one because it is an index — the empty prefix conceptually ends one position before the array starts.',
        aHi: 'Do problems valid subarrays ke set ke baare mein alag cheezein poochhti hain, isliye hash map ko alag jaankari yaad rakhni hoti hai. Counting ke liye, aap un subarrays ki kul tadaad chahte ho jinka sum k hai. Ek current position aur ek pehle prefix jo current-minus-k ke barabar hai ki har jodi ek aisa subarray hai, aur wo sab alag hain, isliye aapko map se ek tally chahiye: har prefix-sum value ke liye, kitni positions ne wo rakha. Duplicates yahaan maayne rakhte hain — agar teen pehli positions ne wahi prefix sum rakha, wo teen subarrays hain, ek nahi. Sabse lambe subarray ke liye, aapko parwaah nahi kitne valid subarrays hain, sirf ek ki maximum lambaai ke baare mein. Position p ke bilkul baad se position j tak ke ek subarray ki lambaai j minus p hai. Ise ek fixed j ke liye jitna bada ho sake banane ke liye, aap p jitna chhota ho sake chahte ho, matlab sabse pehli position jisne zaroori prefix sum rakha. Toh map ko har prefix-sum value ke liye wo pehla index store karna chahiye jispar wo aayi, aur aapko baad ke dauron par ise overwrite nahi karna — ek baad ka dauran sirf ek chhota subarray dega. Seed mein ek samaanaantar sookshmata hai: counting zero ko ek par map karke seed karta hai kyunki wo ek tally hai, jabki longest zero ko minus ek par seed karta hai kyunki wo ek index hai.',
      },
    ],

    exercises: [
      {
        task: 'Implement countSubarraysSumK. Verify [1,2,3] k=3 -> 2, [1,-1,0] k=0 -> 3, [1,1,1] k=2 -> 2, [3,4,7,2,-3,1,4,2] k=7 -> 4. Then remove the count.set(0,1) seed and show that [3,4] with k=7 returns 0 instead of 1.',
        taskHi: 'countSubarraysSumK implement karo. Verify karo [1,2,3] k=3 -> 2, [1,-1,0] k=0 -> 3, [1,1,1] k=2 -> 2, [3,4,7,2,-3,1,4,2] k=7 -> 4. Phir count.set(0,1) seed hataao aur dikhao ki [3,4] k=7 ke saath 1 ke bajaye 0 lautaata hai.',
        hint: 'On [3,4] with k=7, after both elements running is 7 and running - k is 0. The subarray [3,4] starts at index 0, so its matching prefix is the empty one (sum 0). Without the seed, the map has no 0, so the count stays at 0.',
        hintHi: '[3,4] par k=7 ke saath, dono elements ke baad running 7 hai aur running - k 0 hai. Subarray [3,4] index 0 se shuru hota hai, isliye iska matching prefix empty waala hai (sum 0). Seed ke bina, map mein koi 0 nahi, isliye count 0 par rehta hai.',
      },
      {
        task: 'Implement longestSubarraySumK (Map of first index). Verify [1,-1,5,-2,3] k=3 -> 4 and [-2,-1,2,1] k=1 -> 2. Then change "if (!first.has(running)) first.set(running, i)" to always set, and show [1,0,-1,0,1] k=0 gives a shorter answer.',
        taskHi: 'longestSubarraySumK (pehle index ka Map) implement karo. Verify karo [1,-1,5,-2,3] k=3 -> 4 aur [-2,-1,2,1] k=1 -> 2. Phir "if (!first.has(running)) first.set(running, i)" ko hamesha set karne mein badlo, aur dikhao ki [1,0,-1,0,1] k=0 ek chhota jawaab deta hai.',
        hint: 'Overwriting the stored index with a later one means i - first.get(...) measures from a nearer start, so you get a shorter subarray. Always keeping the earliest index is what makes the length maximal.',
        hintHi: 'Store kiye index ko ek baad waale se overwrite karna matlab i - first.get(...) ek nazdeek start se maapta hai, isliye aapko ek chhota subarray milta hai. Hamesha sabse pehla index rakhna wo hai jo lambaai ko maximal banaata hai.',
      },
      {
        task: 'Implement subarraysDivByK with the normalised modulo. Verify [4,5,0,-2,-3,1] k=5 -> 7 and [5,10,15,20] k=5 -> 10. Then drop the "+ k) % k" normalisation and show the negative-element case undercounts.',
        taskHi: 'subarraysDivByK ko normalised modulo ke saath implement karo. Verify karo [4,5,0,-2,-3,1] k=5 -> 7 aur [5,10,15,20] k=5 -> 10. Phir "+ k) % k" normalisation hataao aur dikhao ki negative-element case kam ginta hai.',
        hint: 'With [4,5,0,-2,-3,1] and k=5, some running totals go negative. Un-normalised, a prefix at remainder -2 and one at remainder 3 are the same class mod 5 but land in different map keys, so their pair is never counted.',
        hintHi: '[4,5,0,-2,-3,1] aur k=5 ke saath, kuch running totals negative jaate hain. Un-normalised, remainder -2 par ek prefix aur remainder 3 par ek mod 5 wahi class hain par alag map keys mein land karte hain, isliye unki jodi kabhi nahi gini jaati.',
      },
    ],

    keyTakeaways: [
      'sum(nums[i..j]) = prefix[j] - prefix[i-1]. For the sum to equal k, prefix[i-1] must equal prefix[j] - k. Look that up in a hash map of prefix sums.',
      'Sliding window ONLY works when values are non-negative (the sum is monotonic in the window size). Negatives, or an exact-equality condition, or "count all of them" -> prefix sum + hash map.',
      'Counting subarrays: Map<prefixSum, timesSeen>, seeded with {0: 1} (the empty prefix). At each position, answer += map.get(running - k), THEN insert running.',
      'Look up BEFORE inserting the current prefix, or when k == 0 you count a zero-length subarray.',
      'Longest subarray with sum k: Map<prefixSum, firstIndex>, seeded {0: -1}. Keep the EARLIEST index (do not overwrite); length is i - map.get(running - k).',
      'Divisible by k: key on ((running % k) + k) % k — JavaScript\'s % keeps the dividend\'s sign, so normalise remainders into 0..k-1.',
      '"Equal count of two things" (0s and 1s, a\'s and b\'s): map one to +1 and the other to -1, then it is "longest / count subarray with sum 0".',
    ],
    keyTakeawaysHi: [
      'sum(nums[i..j]) = prefix[j] - prefix[i-1]. Sum ko k ke barabar hone ke liye, prefix[i-1] ko prefix[j] - k ke barabar hona chahiye. Use prefix sums ke ek hash map mein dekho.',
      'Sliding window SIRF tab kaam karta hai jab values non-negative hon (sum window size mein monotonic hai). Negatives, ya ek exact-equality condition, ya "un sabko gino" -> prefix sum + hash map.',
      'Subarrays ginna: Map<prefixSum, timesSeen>, {0: 1} se seeded (empty prefix). Har position par, answer += map.get(running - k), PHIR running insert karo.',
      'Current prefix insert karne se PEHLE lookup karo, warna jab k == 0 aap ek zero-length subarray ginte ho.',
      'Sum k waala sabse lamba subarray: Map<prefixSum, firstIndex>, {0: -1} se seeded. SABSE PEHLA index rakho (overwrite mat karo); lambaai i - map.get(running - k) hai.',
      'k se vibhaajya: ((running % k) + k) % k par key — JavaScript ka % dividend ka sign rakhta hai, isliye remainders ko 0..k-1 mein normalise karo.',
      '"Do cheezon ki barabar ginti" (0s aur 1s, a\'s aur b\'s): ek ko +1 aur doosre ko -1 map karo, phir ye "sum 0 waala sabse lamba / count subarray" hai.',
    ],
  },
];
