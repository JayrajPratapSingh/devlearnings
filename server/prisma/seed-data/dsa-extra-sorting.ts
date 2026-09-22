import { hidden, sample, solution, starter, type SeedProblem } from './shared';

/**
 * Sorting — expansion batch. Rounds out the category beyond the original two
 * (Sort Colors, Merge Intervals) with the classic sort algorithms taught
 * explicitly (merge sort, quicksort, insertion sort, quickselect), the
 * interval-scheduling family, and custom-comparator sorting.
 */
export const dsaExtraSorting: SeedProblem[] = [
  {
    slug: 'merge-sort-implementation',
    title: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Implement merge sort from scratch (no built-in sort) to sort an array ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe sorted array, space-separated.',
    descriptionHi:
      'Built-in sort use kiye bina, shuru se merge sort implement karo taaki array ascending sort ho jaaye.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSorted array, space se separate.',
    examples: [
      { input: '6\n5 2 4 6 1 3', output: '1 2 3 4 5 6' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['0 <= n <= 10^4'],
    hints: [
      'A single element (or empty array) is already sorted — that is the base case.',
      'Split the array in half, recursively sort each half, then merge the two sorted halves.',
      'Merging two already-sorted arrays only needs one linear pass with two pointers.',
    ],
    approach:
      'Classic divide and conquer. Split the array at the midpoint, recursively sort each half, then merge the two sorted halves with a two-pointer linear merge (the same merge routine as Merge Two Sorted Lists).',
    approachHi:
      'Classic divide and conquer. Array ko midpoint par split karo, har half ko recursively sort karo, phir do sorted halves ko two-pointer linear merge se jodo (bilkul Merge Two Sorted Lists wala hi merge routine).',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'The recursion always terminates because each call operates on a strictly smaller array, bottoming out at arrays of size 0 or 1, which are trivially sorted by definition. The work done outside the recursive calls — the merge step — is O(n) at each of the O(log n) levels of the recursion tree, since merging two sorted halves only requires a single linear scan with two pointers, giving the overall O(n log n).',
    solutionExplanationHi:
      'Recursion hamesha terminate hoti hai kyunki har call ek strictly chhote array par kaam karta hai, aakhir size 0 ya 1 ke arrays par pahunch kar, jo definition se hi trivially sorted hain. Recursive calls ke bahar hone wala kaam — merge step — recursion tree ke har O(log n) level par O(n) hai, kyunki do sorted halves ko merge karne ke liye sirf ek linear scan, do pointers ke saath, chahiye — isse overall O(n log n) milta hai.',
    starter: starter(
      `const arr = nums(1);

function mergeSort(arr) {
  // return a new sorted array
  return arr;
}

console.log(mergeSort(arr).join(' '));`,
      `arr = nums(1)

def merge_sort(arr):
    # return a new sorted list
    return arr

print(" ".join(map(str, merge_sort(arr))))`,
    ),
    solution: solution(
      `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  while (i < left.length) out.push(left[i++]);
  while (j < right.length) out.push(right[j++]);
  return out;
}
const arr = nums(1);
console.log(mergeSort(arr).join(' '));`,
      `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out

arr = nums(1)
print(" ".join(map(str, merge_sort(arr))))`,
    ),
    testCases: [
      sample('6\n5 2 4 6 1 3', '1 2 3 4 5 6'),
      sample('1\n1', '1'),
      hidden('0\n', ''),
      hidden('4\n4 3 2 1', '1 2 3 4'),
      hidden('5\n1 1 1 1 1', '1 1 1 1 1'),
      hidden('5\n-3 5 -1 0 2', '-3 -1 0 2 5'),
    ],
  },

  {
    slug: 'quick-sort-implementation',
    title: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Implement quicksort from scratch (no built-in sort) to sort an array ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe sorted array, space-separated.',
    descriptionHi:
      'Built-in sort use kiye bina, shuru se quicksort implement karo taaki array ascending sort ho jaaye.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSorted array, space se separate.',
    examples: [
      { input: '6\n5 2 4 6 1 3', output: '1 2 3 4 5 6' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['0 <= n <= 10^4'],
    hints: [
      'Pick a pivot, then partition the array into elements smaller than it and elements larger than it.',
      'The pivot itself is now in its final sorted position — recursively sort only the two partitions around it.',
      'A worst-case-unlucky pivot choice (like always picking the first element on an already-sorted array) degrades to O(n^2) — a random or middle pivot avoids that on typical inputs.',
    ],
    approach:
      'Pick a pivot (the middle element), partition the remaining elements into those less than, equal to, and greater than the pivot, then recursively quicksort the "less than" and "greater than" groups and concatenate `sort(less) + equal + sort(greater)`.',
    approachHi:
      'Ek pivot chuno (middle element), baaki elements ko pivot se chhote, barabar, aur bade groups mein partition karo, phir "chhote" aur "bade" groups ko recursively quicksort karo aur `sort(less) + equal + sort(greater)` jod do.',
    timeComplexity: 'O(n log n) average, O(n^2) worst case',
    spaceComplexity: 'O(n) for this partition-into-new-arrays version (O(log n) with in-place partitioning)',
    solutionExplanation:
      'Once every element is classified as strictly less than, equal to, or strictly greater than the pivot, the pivot\'s own final position in the sorted output is already fixed — everything smaller belongs entirely before it, everything bigger entirely after — so the two sub-problems can be solved completely independently and simply concatenated, with no merge step needed (unlike merge sort). The average-case O(n log n) assumes the pivot roughly halves the array each time; a pivot that is always the smallest or largest element degrades this to O(n^2), which is why pivot choice matters in practice.',
    solutionExplanationHi:
      'Ek baar har element pivot se strictly chhota, barabar, ya strictly bada classify ho jaaye, to pivot ki apni final position sorted output mein pehle se fix ho jaati hai — chhota sab kuch bilkul pehle aata hai, bada sab kuch bilkul baad mein — isliye dono sub-problems poori tarah independently solve ho sakte hain aur sirf concatenate karne hain, koi merge step nahi chahiye (merge sort ke ulat). Average-case O(n log n) tabhi hota hai jab pivot har baar array ko lagbhag aadha karta hai; ek pivot jo hamesha sabse chhota ya sabse bada element ho, ye O(n^2) tak degrade kar deta hai — isliye practice mein pivot choice matter karta hai.',
    starter: starter(
      `const arr = nums(1);

function quickSort(arr) {
  // return a new sorted array
  return arr;
}

console.log(quickSort(arr).join(' '));`,
      `arr = nums(1)

def quick_sort(arr):
    # return a new sorted list
    return arr

print(" ".join(map(str, quick_sort(arr))))`,
    ),
    solution: solution(
      `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length >> 1];
  const less = arr.filter((x) => x < pivot);
  const equal = arr.filter((x) => x === pivot);
  const greater = arr.filter((x) => x > pivot);
  return [...quickSort(less), ...equal, ...quickSort(greater)];
}
const arr = nums(1);
console.log(quickSort(arr).join(' '));`,
      `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]
    return quick_sort(less) + equal + quick_sort(greater)

arr = nums(1)
print(" ".join(map(str, quick_sort(arr))))`,
    ),
    testCases: [
      sample('6\n5 2 4 6 1 3', '1 2 3 4 5 6'),
      sample('1\n1', '1'),
      hidden('0\n', ''),
      hidden('4\n4 3 2 1', '1 2 3 4'),
      hidden('5\n1 1 1 1 1', '1 1 1 1 1'),
      hidden('6\n3 -1 0 -1 5 2', '-1 -1 0 2 3 5'),
    ],
  },

  {
    slug: 'insertion-sort-array',
    title: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'EASY',
    description:
      'Implement insertion sort from scratch (no built-in sort) to sort an array ascending.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe sorted array, space-separated.',
    descriptionHi:
      'Built-in sort use kiye bina, shuru se insertion sort implement karo taaki array ascending sort ho jaaye.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nSorted array, space se separate.',
    examples: [
      { input: '5\n12 11 13 5 6', output: '5 6 11 12 13' },
      { input: '1\n1', output: '1' },
    ],
    constraints: ['0 <= n <= 5000'],
    hints: [
      'Think of it like sorting a hand of playing cards: keep a growing sorted prefix, and insert each new card into its correct place within it.',
      'For each new element, shift larger elements in the sorted prefix one position right to make room.',
      'Stop shifting as soon as you find an element that is not bigger than the one being inserted.',
    ],
    approach:
      'Walk the array from the second element onward. For each element, save it, then shift every larger element in the already-sorted prefix one position to the right, and finally drop the saved value into the gap that opens up.',
    approachHi:
      'Array ko doosre element se aage walk karo. Har element ke liye, use save karo, phir already-sorted prefix ke har bade element ko ek position right shift karo, aur aakhir mein saved value ko bane hue gap mein daal do.',
    timeComplexity: 'O(n^2) worst case, O(n) best case (already sorted)',
    spaceComplexity: 'O(1) extra (in-place)',
    solutionExplanation:
      'The invariant maintained at every step is that everything to the left of the current position is already fully sorted among itself — so inserting the next element only requires finding its correct spot within that already-ordered prefix, by shifting strictly larger elements out of the way one at a time, rather than needing to reconsider the whole array. This is also why insertion sort is fast on nearly-sorted input: few or no shifts are needed when each new element is already close to its correct position.',
    solutionExplanationHi:
      'Har step par maintain hone wala invariant ye hai ki current position se left ka sab kuch aapas mein pehle se poori tarah sorted hai — isliye agle element ko insert karne ke liye sirf us already-ordered prefix ke andar uski sahi jagah dhoondni hai, strictly bade elements ko ek-ek karke hatate hue, poore array ko dobara consider karne ki zaroorat nahi. Yahi wajah hai ki insertion sort nearly-sorted input par fast hoti hai: jab har naya element pehle se apni sahi position ke nazdeek ho to kam ya koi shifts nahi chahiye.',
    starter: starter(
      `const arr = nums(1);

function insertionSort(arr) {
  // sort in place, return arr
  return arr;
}

console.log(insertionSort(arr).join(' '));`,
      `arr = nums(1)

def insertion_sort(arr):
    # sort in place, return arr
    return arr

print(" ".join(map(str, insertion_sort(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
for (let i = 1; i < arr.length; i++) {
  const key = arr[i];
  let j = i - 1;
  while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
  arr[j + 1] = key;
}
console.log(arr.join(' '));`,
      `arr = nums(1)
for i in range(1, len(arr)):
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
        arr[j + 1] = arr[j]
        j -= 1
    arr[j + 1] = key
print(" ".join(map(str, arr)))`,
    ),
    testCases: [
      sample('5\n12 11 13 5 6', '5 6 11 12 13'),
      sample('1\n1', '1'),
      hidden('0\n', ''),
      hidden('4\n1 2 3 4', '1 2 3 4'),
      hidden('4\n4 3 2 1', '1 2 3 4'),
      hidden('5\n2 2 1 1 3', '1 1 2 2 3'),
    ],
  },

  {
    slug: 'kth-largest-element-in-array',
    title: 'Kth Largest Element in an Array',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Find the `k`-th largest element in an unsorted array (the k-th largest, not the k-th distinct largest), ideally faster than a full sort.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\nThe `k`-th largest value.',
    descriptionHi:
      'Ek unsorted array mein `k`-vaan sabse bada element dhoondo (k-vaan largest, k-vaan distinct largest nahi), ideally poore sort se tez.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n- Line 3: `k`\n\n**Output**\n`k`-vaan sabse bada value.',
    examples: [
      { input: '6\n3 2 1 5 6 4\n2', output: '5' },
      { input: '9\n3 2 3 1 2 4 5 5 6\n4', output: '4' },
    ],
    constraints: ['1 <= k <= n <= 10^5'],
    hints: [
      'Sorting the whole array and indexing works, but costs O(n log n) when you only need one element.',
      'Quickselect reuses quicksort\'s partition step, but only recurses into the ONE side that could contain the answer.',
      'Compare the pivot\'s final sorted position against `n - k` (the 0-indexed position of the k-th largest in ascending order) to decide which side to recurse into.',
    ],
    approach:
      'Quickselect. Partition the array around a pivot exactly like quicksort, but after partitioning, compare the pivot\'s final index to the target index `n - k` (its position in ascending order): if they match, the pivot is the answer; otherwise recurse into only the half that could contain the target index.',
    approachHi:
      'Quickselect. Array ko ek pivot ke around partition karo, bilkul quicksort jaisa, par partition karne ke baad, pivot ke final index ko target index `n - k` (ascending order mein uski position) se compare karo: match ho to pivot hi answer hai; warna sirf us half mein recurse karo jismein target index ho sakta hai.',
    timeComplexity: 'O(n) average, O(n^2) worst case',
    spaceComplexity: 'O(n) for this simple partition-into-new-arrays version',
    solutionExplanation:
      'Quicksort recurses into both partitions because it needs the entire array sorted, but quickselect only needs one specific position to be correct — so after partitioning around a pivot, only the single side that could contain the target rank needs further work, and the other side can simply be discarded unexamined. This halves (on average) the problem size at each step without ever needing to fully sort either side, which is what drops the average complexity from O(n log n) to O(n).',
    solutionExplanationHi:
      'Quicksort dono partitions mein recurse karta hai kyunki use poora array sorted chahiye, par quickselect ko sirf ek specific position sahi chahiye — isliye pivot ke around partition karne ke baad, sirf ek side jismein target rank ho sakta hai use aage kaam chahiye, doosri side ko bina dekhe discard kiya ja sakta hai. Ye har step par (average mein) problem size ko aadha kar deta hai, kisi bhi side ko poora sort kiye bina — yahi cheez average complexity ko O(n log n) se O(n) tak la deti hai.',
    starter: starter(
      `const arr = nums(1), k = num(2);

function findKthLargest(arr, k) {
  // your code here
}

console.log(findKthLargest(arr, k));`,
      `arr, k = nums(1), num(2)

def find_kth_largest(arr, k):
    # your code here
    pass

print(find_kth_largest(arr, k))`,
    ),
    solution: solution(
      `function quickSelect(arr, targetIdx) {
  if (arr.length === 1) return arr[0];
  const pivot = arr[arr.length >> 1];
  const less = arr.filter((x) => x < pivot);
  const equal = arr.filter((x) => x === pivot);
  const greater = arr.filter((x) => x > pivot);
  if (targetIdx < less.length) return quickSelect(less, targetIdx);
  if (targetIdx < less.length + equal.length) return pivot;
  return quickSelect(greater, targetIdx - less.length - equal.length);
}
const arr = nums(1), k = num(2);
console.log(quickSelect(arr, arr.length - k));`,
      `def quick_select(arr, target_idx):
    if len(arr) == 1:
        return arr[0]
    pivot = arr[len(arr) // 2]
    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]
    if target_idx < len(less):
        return quick_select(less, target_idx)
    if target_idx < len(less) + len(equal):
        return pivot
    return quick_select(greater, target_idx - len(less) - len(equal))

arr, k = nums(1), num(2)
print(quick_select(arr, len(arr) - k))`,
    ),
    testCases: [
      sample('6\n3 2 1 5 6 4\n2', '5'),
      sample('9\n3 2 3 1 2 4 5 5 6\n4', '4'),
      hidden('1\n7\n1', '7'),
      hidden('4\n1 1 1 1\n2', '1'),
      hidden('5\n5 4 3 2 1\n1', '5'),
      hidden('5\n5 4 3 2 1\n5', '1'),
    ],
  },

  {
    slug: 'meeting-rooms',
    title: 'Meeting Rooms',
    category: 'Sorting',
    difficulty: 'EASY',
    description:
      'Given a list of meeting time intervals, determine whether a single person could attend all of them (no two meetings may overlap).\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `start end`\n\n**Output**\n`true` or `false`.',
    descriptionHi:
      'Meeting time intervals ki ek list di hai. Batao ki ek hi insaan un sabko attend kar sakta hai ya nahi (koi bhi do meetings overlap nahi honi chahiye).\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `start end`\n\n**Output**\n`true` ya `false`.',
    examples: [
      { input: '3\n0 30\n5 10\n15 20', output: 'false' },
      { input: '2\n7 10\n2 4', output: 'true' },
    ],
    constraints: ['0 <= n <= 10^4', 'start < end'],
    hints: [
      'Comparing every pair of meetings for overlap is O(n^2).',
      'Sorting by start time first means any overlap must involve two adjacent meetings in the sorted order.',
      'After sorting, a single pass checking each meeting\'s start against the previous meeting\'s end suffices.',
    ],
    approach:
      'Sort the intervals by start time. Walk through once, checking whether each meeting\'s start is `< ` the previous meeting\'s end (an overlap). If any overlap is found, return false; otherwise true.',
    approachHi:
      'Intervals ko start time se sort karo. Ek pass mein check karo ki kya har meeting ka start pichli meeting ke end se `<` hai (overlap). Koi bhi overlap milte hi false; warna true.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) extra (beyond the sort)',
    solutionExplanation:
      'Sorting by start time is what confines every possible overlap to adjacent pairs in the sorted order: if meeting C (sorted after B) does not overlap B, and B is the meeting immediately before it, C cannot possibly overlap any meeting before B either, since all of those end no later than B does. This is what collapses an apparent O(n^2) all-pairs check into a single O(n) linear scan after the sort.',
    solutionExplanationHi:
      'Start time se sort karna hi har possible overlap ko sorted order mein adjacent pairs tak limit kar deta hai: agar meeting C (B ke baad sorted) B se overlap nahi karti, aur B usse turant pehle wali meeting hai, to C B se pehle ki kisi bhi meeting se overlap kar hi nahi sakti, kyunki wo saari B se der se khatam nahi hoti. Yahi cheez ek dikhne mein O(n^2) all-pairs check ko sort ke baad ek single O(n) linear scan mein badal deti hai.',
    starter: starter(
      `const n = num(0);
const meetings = [];
for (let i = 1; i <= n; i++) meetings.push(nums(i));

function canAttendMeetings(meetings) {
  // your code here
}

console.log(canAttendMeetings(meetings));`,
      `n = num(0)
meetings = [nums(i) for i in range(1, n + 1)]

def can_attend_meetings(meetings):
    # your code here
    pass

print("true" if can_attend_meetings(meetings) else "false")`,
    ),
    solution: solution(
      `const n = num(0);
const meetings = [];
for (let i = 1; i <= n; i++) meetings.push(nums(i));
meetings.sort((a, b) => a[0] - b[0]);
let ok = true;
for (let i = 1; i < meetings.length; i++) if (meetings[i][0] < meetings[i - 1][1]) { ok = false; break; }
console.log(ok);`,
      `n = num(0)
meetings = sorted(nums(i) for i in range(1, n + 1))
ok = True
for i in range(1, len(meetings)):
    if meetings[i][0] < meetings[i - 1][1]:
        ok = False
        break
print("true" if ok else "false")`,
    ),
    testCases: [
      sample('3\n0 30\n5 10\n15 20', 'false'),
      sample('2\n7 10\n2 4', 'true'),
      hidden('0\n', 'true'),
      hidden('1\n1 5', 'true'),
      hidden('2\n1 5\n5 10', 'true'),
      hidden('2\n1 5\n4 10', 'false'),
    ],
  },

  {
    slug: 'meeting-rooms-ii',
    title: 'Meeting Rooms II',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Given a list of meeting time intervals, find the minimum number of meeting rooms required to hold all of them.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `start end`\n\n**Output**\nThe minimum number of rooms.',
    descriptionHi:
      'Meeting time intervals ki ek list di hai. Un sabko host karne ke liye minimum kitne meeting rooms chahiye, wo batao.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `start end`\n\n**Output**\nMinimum rooms.',
    examples: [
      { input: '3\n0 30\n5 10\n15 20', output: '2' },
      { input: '2\n7 10\n2 4', output: '1' },
    ],
    constraints: ['0 <= n <= 10^4', 'start < end'],
    hints: [
      'The number of rooms needed at any instant equals the number of meetings currently in progress.',
      'Separate all start times and all end times into two sorted lists.',
      'Walk both lists together: every start before the earliest still-unmatched end needs a new room; every end frees one up.',
    ],
    approach:
      'Separate and sort all start times and all end times independently. Walk both sorted lists with two pointers: whenever the next start time is earlier than the next end time, a new room is needed (increment a counter, advance the start pointer); otherwise a room frees up (advance the end pointer). Track the maximum concurrent rooms needed.',
    approachHi:
      'Saare start times aur saare end times ko alag-alag independently sort karo. Dono sorted lists ko do pointers se saath walk karo: jab bhi agla start time agle end time se pehle hai, ek nayi room chahiye (counter badhao, start pointer aage badhao); warna ek room khaali hoti hai (end pointer aage badhao). Maximum concurrent rooms track karo.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Separating starts from ends and sorting each independently throws away which start belongs to which end, but that pairing is irrelevant to the question — only the *count* of concurrently active meetings matters, not their identities. Merging the two sorted streams by time is equivalent to sweeping a clock forward and tracking a running "rooms in use" counter that increments on every start and decrements on every end, and the peak value that counter ever reaches is exactly the answer.',
    solutionExplanationHi:
      'Starts ko ends se alag karke dono ko independently sort karna, ye jaankari phenk deta hai ki kaunsa start kaunse end se belong karta hai, par wo pairing is sawaal ke liye irrelevant hai — sirf concurrently active meetings ka *count* matter karta hai, unki identity nahi. Dono sorted streams ko time ke hisaab se merge karna, ek clock ko aage sweep karne aur ek running "rooms in use" counter track karne ke barabar hai jo har start par badhta hai aur har end par ghatta hai — us counter ka peak value hi exact answer hai.',
    starter: starter(
      `const n = num(0);
const meetings = [];
for (let i = 1; i <= n; i++) meetings.push(nums(i));

function minMeetingRooms(meetings) {
  // your code here
}

console.log(minMeetingRooms(meetings));`,
      `n = num(0)
meetings = [nums(i) for i in range(1, n + 1)]

def min_meeting_rooms(meetings):
    # your code here
    pass

print(min_meeting_rooms(meetings))`,
    ),
    solution: solution(
      `const n = num(0);
const meetings = [];
for (let i = 1; i <= n; i++) meetings.push(nums(i));
const starts = meetings.map((m) => m[0]).sort((a, b) => a - b);
const ends = meetings.map((m) => m[1]).sort((a, b) => a - b);
let i = 0, j = 0, rooms = 0, best = 0;
while (i < starts.length) {
  if (starts[i] < ends[j]) { rooms++; i++; } else { rooms--; j++; }
  best = Math.max(best, rooms);
}
console.log(best);`,
      `n = num(0)
meetings = [nums(i) for i in range(1, n + 1)]
starts = sorted(m[0] for m in meetings)
ends = sorted(m[1] for m in meetings)
i = j = rooms = best = 0
while i < len(starts):
    if starts[i] < ends[j]:
        rooms += 1
        i += 1
    else:
        rooms -= 1
        j += 1
    best = max(best, rooms)
print(best)`,
    ),
    testCases: [
      sample('3\n0 30\n5 10\n15 20', '2'),
      sample('2\n7 10\n2 4', '1'),
      hidden('0\n', '0'),
      hidden('1\n1 5', '1'),
      hidden('3\n1 5\n1 5\n1 5', '3'),
      hidden('4\n1 2\n2 3\n3 4\n4 5', '1'),
    ],
  },

  {
    slug: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Find the minimum number of intervals to remove so that the rest of the intervals do not overlap.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `start end`\n\n**Output**\nThe minimum number of removals.',
    descriptionHi:
      'Minimum kitne intervals hataane padenge taaki baaki intervals overlap na karein, wo batao.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `start end`\n\n**Output**\nMinimum removals.',
    examples: [
      { input: '4\n1 2\n2 3\n3 4\n1 3', output: '1' },
      { input: '3\n1 2\n1 2\n1 2', output: '2' },
    ],
    constraints: ['0 <= n <= 10^5'],
    hints: [
      'This is a classic greedy activity-selection problem in disguise.',
      'Sort by END time, not start time — this is the key difference from Meeting Rooms.',
      'Greedily keep an interval if its start is at or after the end of the last kept interval; otherwise it must be removed.',
    ],
    approach:
      'Sort intervals by their END time. Greedily walk through, keeping track of the end time of the last kept interval. If the current interval starts before that end, it overlaps and must be removed (increment a counter); otherwise keep it and update the last-kept end.',
    approachHi:
      'Intervals ko unke END time se sort karo. Greedily walk karo, last kept interval ka end time track karte hue. Agar current interval us end se pehle start hota hai, to wo overlap karta hai aur hataana padega (counter badhao); warna use rakho aur last-kept end update karo.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) extra (beyond the sort)',
    solutionExplanation:
      'Sorting by end time (not start time) is the crucial greedy insight: an interval that finishes earliest leaves the most room for everything that follows, so always keeping the earliest-finishing option among any overlapping group is provably never worse than any other choice — this is the classic activity-selection greedy proof. Every time a later interval starts before the currently kept one ends, it must be the one discarded, since the kept interval was chosen specifically to end as early as possible.',
    solutionExplanationHi:
      'End time se sort karna (start time se nahi) hi crucial greedy insight hai: jo interval sabse jaldi khatam hoti hai wo baad ki har cheez ke liye sabse zyada jagah chhodti hai, isliye kisi bhi overlapping group mein hamesha sabse jaldi khatam hone wala option rakhna provably kisi bhi doosre choice se kabhi bura nahi hota — yahi classic activity-selection greedy proof hai. Jab bhi koi baad wali interval abhi ke kept interval ke end hone se pehle shuru hoti hai, wahi discard honi chahiye, kyunki kept interval ko specifically sabse jaldi khatam hone ke liye chuna gaya tha.',
    starter: starter(
      `const n = num(0);
const intervals = [];
for (let i = 1; i <= n; i++) intervals.push(nums(i));

function eraseOverlapIntervals(intervals) {
  // your code here
}

console.log(eraseOverlapIntervals(intervals));`,
      `n = num(0)
intervals = [nums(i) for i in range(1, n + 1)]

def erase_overlap_intervals(intervals):
    # your code here
    pass

print(erase_overlap_intervals(intervals))`,
    ),
    solution: solution(
      `const n = num(0);
const intervals = [];
for (let i = 1; i <= n; i++) intervals.push(nums(i));
intervals.sort((a, b) => a[1] - b[1]);
let removed = 0, lastEnd = -Infinity;
for (const [s, e] of intervals) {
  if (s < lastEnd) removed++;
  else lastEnd = e;
}
console.log(removed);`,
      `n = num(0)
intervals = sorted((nums(i) for i in range(1, n + 1)), key=lambda iv: iv[1])
removed = 0
last_end = float("-inf")
for s, e in intervals:
    if s < last_end:
        removed += 1
    else:
        last_end = e
print(removed)`,
    ),
    testCases: [
      sample('4\n1 2\n2 3\n3 4\n1 3', '1'),
      sample('3\n1 2\n1 2\n1 2', '2'),
      hidden('0\n', '0'),
      hidden('1\n1 2', '0'),
      hidden('2\n1 2\n2 3', '0'),
      hidden('3\n1 100\n11 22\n1 11', '1'),
    ],
  },

  {
    slug: 'insert-interval',
    title: 'Insert Interval',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Given a sorted, non-overlapping list of intervals and a new interval, insert it and merge as needed to keep the list sorted and non-overlapping.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `start end` (already sorted, non-overlapping)\n- Last line: `start end` — the new interval\n\n**Output**\nThe resulting intervals, one per line as `start end`.',
    descriptionHi:
      'Sorted, non-overlapping intervals ki ek list aur ek naya interval diya hai. Use insert karo aur zaroorat padne par merge karo taaki list sorted aur non-overlapping rahe.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `start end` (pehle se sorted, non-overlapping)\n- Aakhri line: `start end` — naya interval\n\n**Output**\nResulting intervals, ek line par ek, `start end` format mein.',
    examples: [
      { input: '2\n1 3\n6 9\n2 5', output: '1 5\n6 9' },
      { input: '5\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8', output: '1 2\n3 10\n12 16' },
    ],
    constraints: ['0 <= n <= 10^4', 'The existing intervals are sorted and non-overlapping'],
    hints: [
      'Because the existing list is already sorted, there is no need to re-sort anything.',
      'Three phases: intervals that end entirely before the new one starts, intervals that overlap the new one, and intervals that start entirely after the new one ends.',
      'Merge all of the overlapping phase into a single interval by tracking the min start and max end across them.',
    ],
    approach:
      'Walk the sorted list in three phases. First, copy every interval that ends before the new interval starts unchanged. Second, merge every interval that overlaps the new interval into it (expanding the new interval\'s start to the min and end to the max across all of them). Third, append the (possibly expanded) new interval, then copy the remaining intervals unchanged.',
    approachHi:
      'Sorted list ko teen phases mein walk karo. Pehla, har interval jo naye interval ke start hone se pehle khatam hoti hai use bina badle copy karo. Doosra, har interval jo naye interval se overlap karti hai use usme merge karo (naye interval ka start min aur end max tak expand karte hue). Teesra, (shayad expanded) naye interval ko append karo, phir baaki intervals ko bina badle copy karo.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n) for the output',
    solutionExplanation:
      'Because the input is already sorted, the three categories of intervals — strictly before, overlapping, strictly after — occur in exactly that contiguous order in a single left-to-right pass, so no sorting or backtracking is ever needed. The overlapping group collapses into one merged interval because overlap is transitive here: if interval A overlaps the new interval and B is next in sorted order and also overlaps, then A, B, and the new interval must all end up merged together regardless of whether A and B directly overlap each other.',
    solutionExplanationHi:
      'Chunki input pehle se sorted hai, teen categories — strictly pehle, overlapping, strictly baad — exactly usi contiguous order mein ek single left-to-right pass mein aati hain, isliye kisi sorting ya backtracking ki zaroorat nahi. Overlapping group ek merged interval mein simat jaata hai kyunki yahan overlap transitive hai: agar interval A naye interval se overlap karta hai aur B sorted order mein agla hai aur wo bhi overlap karta hai, to A, B, aur naya interval sab ek saath merge ho jaayenge, chahe A aur B seedhe ek doosre se overlap karte hon ya nahi.',
    starter: starter(
      `const n = num(0);
const intervals = [];
for (let i = 1; i <= n; i++) intervals.push(nums(i));
const newInterval = nums(1 + n);

function insert(intervals, newInterval) {
  // your code here
  return [];
}

for (const [s, e] of insert(intervals, newInterval)) console.log(s + ' ' + e);`,
      `n = num(0)
intervals = [nums(i) for i in range(1, n + 1)]
new_interval = nums(1 + n)

def insert(intervals, new_interval):
    # your code here
    return []

for s, e in insert(intervals, new_interval):
    print(s, e)`,
    ),
    solution: solution(
      `const n = num(0);
const intervals = [];
for (let i = 1; i <= n; i++) intervals.push(nums(i));
let [ns, ne] = nums(1 + n);
const out = [];
let i = 0;
while (i < intervals.length && intervals[i][1] < ns) out.push(intervals[i++]);
while (i < intervals.length && intervals[i][0] <= ne) {
  ns = Math.min(ns, intervals[i][0]);
  ne = Math.max(ne, intervals[i][1]);
  i++;
}
out.push([ns, ne]);
while (i < intervals.length) out.push(intervals[i++]);
for (const [s, e] of out) console.log(s + ' ' + e);`,
      `n = num(0)
intervals = [nums(i) for i in range(1, n + 1)]
ns, ne = nums(1 + n)
out = []
i = 0
while i < len(intervals) and intervals[i][1] < ns:
    out.append(intervals[i])
    i += 1
while i < len(intervals) and intervals[i][0] <= ne:
    ns = min(ns, intervals[i][0])
    ne = max(ne, intervals[i][1])
    i += 1
out.append([ns, ne])
while i < len(intervals):
    out.append(intervals[i])
    i += 1
for s, e in out:
    print(s, e)`,
    ),
    testCases: [
      sample('2\n1 3\n6 9\n2 5', '1 5\n6 9'),
      sample('5\n1 2\n3 5\n6 7\n8 10\n12 16\n4 8', '1 2\n3 10\n12 16'),
      hidden('0\n5 7', '5 7'),
      hidden('1\n1 5\n2 3', '1 5'),
      hidden('1\n1 5\n6 8', '1 5\n6 8'),
      hidden('2\n1 2\n3 4\n0 5', '0 5'),
    ],
  },

  {
    slug: 'largest-number',
    title: 'Largest Number',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Given non-negative integers, arrange them so that their concatenation forms the largest possible number. Return it as a string.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nThe largest number, as a string.',
    descriptionHi:
      'Non-negative integers diye hain. Unhe aise arrange karo ki unka concatenation sabse bada possible number bane. Use string ke roop mein return karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated non-negative integers\n\n**Output**\nSabse bada number, string ke roop mein.',
    examples: [
      { input: '2\n10 2', output: '210' },
      { input: '5\n3 30 34 5 9', output: '9534330' },
    ],
    constraints: ['1 <= n <= 100', '0 <= nums[i] <= 10^9'],
    hints: [
      'Sorting numerically or lexicographically as strings both give the wrong answer (compare "3" vs "30" — lexicographic puts "3" first, but "330" > "303").',
      'The right comparator for two number-strings `a` and `b` is: does `a+b` or `b+a` form the larger combined string?',
      'A special case: if the result starts with "0", every number was 0, so the answer is just "0".',
    ],
    approach:
      'Convert every number to a string, then sort with a custom comparator: for two strings `a` and `b`, place `a` before `b` if `a + b > b + a` as strings. Concatenate the sorted result. If the final string starts with `0` (meaning every input was 0), output `0` instead.',
    approachHi:
      'Har number ko string mein convert karo, phir ek custom comparator se sort karo: do strings `a` aur `b` ke liye, `a` ko `b` se pehle rakho agar `a + b > b + a` strings ke roop mein. Sorted result ko concatenate karo. Agar final string `0` se shuru hoti hai (matlab har input 0 tha), to `0` output karo.',
    timeComplexity: 'O(n log n * L) where L is the average number length, for the string comparisons',
    spaceComplexity: 'O(n)',
    solutionExplanation:
      'Neither numeric order nor plain string (lexicographic) order is transitive-compatible with "produces the largest concatenation" — the custom comparator `a+b vs b+a` is specifically chosen because it IS provably transitive (a well-known but non-obvious fact), which is what makes it safe to plug into a general-purpose sort at all; a comparator that were not transitive could produce inconsistent, order-dependent results depending on the sort algorithm\'s internal comparison sequence.',
    solutionExplanationHi:
      'Na numeric order, na plain string (lexicographic) order "sabse bada concatenation banata hai" ke saath transitive-compatible hai — custom comparator `a+b vs b+a` specifically isliye chuna gaya hai kyunki ye provably transitive HAI (ek jaana-maana par non-obvious fact), yahi cheez ise general-purpose sort mein plug karna safe banati hai; ek non-transitive comparator inconsistent, order-dependent results de sakta tha, sort algorithm ke internal comparison sequence par depend karte hue.',
    starter: starter(
      `const nums_ = nums(1);

function largestNumber(nums_) {
  // your code here
}

console.log(largestNumber(nums_));`,
      `nums_ = nums(1)

def largest_number(nums_):
    # your code here
    pass

print(largest_number(nums_))`,
    ),
    solution: solution(
      `const arr = nums(1).map(String);
arr.sort((a, b) => (a + b < b + a ? 1 : -1));
let result = arr.join('');
if (result[0] === '0') result = '0';
console.log(result);`,
      `arr = list(map(str, nums(1)))
import functools
arr.sort(key=functools.cmp_to_key(lambda a, b: -1 if a + b > b + a else (1 if a + b < b + a else 0)))
result = "".join(arr)
if result[0] == "0":
    result = "0"
print(result)`,
    ),
    testCases: [
      sample('2\n10 2', '210'),
      sample('5\n3 30 34 5 9', '9534330'),
      hidden('2\n0 0', '0'),
      hidden('1\n0', '0'),
      hidden('3\n1 1 1', '111'),
      hidden('4\n432 43243 432 4324', '432443243432432'),
    ],
  },

  {
    slug: 'wiggle-sort',
    title: 'Wiggle Sort',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Rearrange the array in place so that `nums[0] <= nums[1] >= nums[2] <= nums[3] >= ...`. Use this specific one-pass approach: scan left to right, and whenever the required relation between adjacent elements is violated, swap them.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nThe rearranged array, space-separated.',
    descriptionHi:
      'Array ko in place rearrange karo taaki `nums[0] <= nums[1] >= nums[2] <= nums[3] >= ...` ho. Ye specific one-pass approach use karo: left se right scan karo, aur jab bhi adjacent elements ke beech required relation violate ho, unhe swap karo.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated integers\n\n**Output**\nRearranged array, space se separate.',
    examples: [
      { input: '6\n3 5 2 1 6 4', output: '3 5 1 6 2 4' },
      { input: '1\n5', output: '5' },
    ],
    constraints: ['1 <= n <= 5000'],
    hints: [
      'At each even index i, the required relation is nums[i] <= nums[i+1]; at each odd index, it is nums[i] >= nums[i+1].',
      'A single left-to-right pass checking just the immediate next element (not sorting first) is enough.',
      'Whenever the relation for the current position is violated, swapping the two adjacent elements fixes it without needing to look further back.',
    ],
    approach:
      'Single pass. At each index `i` from 0 to n-2: if `i` is even and `arr[i] > arr[i+1]`, swap them; if `i` is odd and `arr[i] < arr[i+1]`, swap them. Otherwise leave them as is.',
    approachHi:
      'Ek pass. Har index `i` (0 se n-2 tak) ke liye: agar `i` even hai aur `arr[i] > arr[i+1]`, swap karo; agar `i` odd hai aur `arr[i] < arr[i+1]`, swap karo. Warna waise hi rehne do.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    solutionExplanation:
      'A local swap at a violated position is enough to fix it without unraveling earlier work because of how the check is structured: fixing the relation between positions i and i+1 never disturbs the already-correct relation between i-1 and i, since the swap only changes the value AT position i (which the earlier check has no further claim on) and BEHIND it, position i-1\'s relation was checked against the OLD value of position i, and after the swap position i now holds a value that is even MORE extreme in the direction that relation needed — so it remains satisfied.',
    solutionExplanationHi:
      'Ek violated position par local swap use fix karne ke liye kaafi hai, pehle ke kaam ko bigade bina — check structure ki wajah se: position i aur i+1 ke beech relation fix karna, i-1 aur i ke beech pehle se sahi relation ko disturb nahi karta, kyunki swap sirf position i ki value badalta hai (jispe pehle ka check ab koi claim nahi rakhta) — aur us relation ko position i ki OLD value se check kiya gaya tha, swap ke baad position i ab us direction mein aur bhi extreme value rakhta hai jo relation ko chahiye thi — isliye wo satisfied rehta hai.',
    starter: starter(
      `const arr = nums(1);

function wiggleSort(arr) {
  // mutate arr in place, return it
  return arr;
}

console.log(wiggleSort(arr).join(' '));`,
      `arr = nums(1)

def wiggle_sort(arr):
    # mutate arr in place, return it
    return arr

print(" ".join(map(str, wiggle_sort(arr))))`,
    ),
    solution: solution(
      `const arr = nums(1);
for (let i = 0; i < arr.length - 1; i++) {
  if (i % 2 === 0) { if (arr[i] > arr[i + 1]) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; }
  else { if (arr[i] < arr[i + 1]) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; }
}
console.log(arr.join(' '));`,
      `arr = nums(1)
for i in range(len(arr) - 1):
    if i % 2 == 0:
        if arr[i] > arr[i + 1]:
            arr[i], arr[i + 1] = arr[i + 1], arr[i]
    else:
        if arr[i] < arr[i + 1]:
            arr[i], arr[i + 1] = arr[i + 1], arr[i]
print(" ".join(map(str, arr)))`,
    ),
    testCases: [
      sample('6\n3 5 2 1 6 4', '3 5 1 6 2 4'),
      sample('1\n5', '5'),
      hidden('2\n1 2', '1 2'),
      hidden('2\n2 1', '1 2'),
      hidden('4\n1 1 1 1', '1 1 1 1'),
      hidden('5\n1 2 3 4 5', '1 3 2 5 4'),
    ],
  },

  {
    slug: 'h-index',
    title: 'H-Index',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Given a researcher\'s citation counts (unsorted), find their h-index: the largest `h` such that at least `h` papers have `>= h` citations each.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated citation counts\n\n**Output**\nThe h-index.',
    descriptionHi:
      'Ek researcher ke citation counts (unsorted) diye hain. Uska h-index dhoondo: sabse bada `h` jahan kam se kam `h` papers ke paas `>= h` citations hon.\n\n**Input**\n- Line 1: `n`\n- Line 2: `n` space-separated citation counts\n\n**Output**\nH-index.',
    examples: [
      { input: '5\n3 0 6 1 5', output: '3' },
      { input: '3\n1 3 1', output: '1' },
    ],
    constraints: ['1 <= n <= 5000'],
    hints: [
      'Sort the citations descending, then walk through: the h-index is the largest count where the i-th paper (1-indexed) still has at least i citations.',
      'Once a paper\'s citation count drops below its 1-indexed position in the sorted-descending order, no larger h is achievable.',
      'This is exactly the same relationship H-Index II exploits, except here you must sort first since the input is unsorted.',
    ],
    approach:
      'Sort citations descending. Walk through with a 1-indexed position `i`; the h-index is the largest `i` for which `citations[i-1] >= i` still holds. Stop and return `i - 1` the first time this fails, or `n` if it holds all the way through.',
    approachHi:
      'Citations ko descending sort karo. 1-indexed position `i` ke saath walk karo; h-index sabse bada `i` hai jiske liye `citations[i-1] >= i` abhi bhi sahi ho. Jaise hi ye fail ho, `i - 1` return karo, ya agar aakhir tak sahi rehta hai to `n`.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n) or O(1) depending on the sort',
    solutionExplanation:
      'This is exactly the same monotonic relationship H-Index II relies on — "at least i papers have i citations" corresponds to the i-th paper (in descending order) itself having at least i citations — but since the input here is not already sorted, the O(log n) binary search from the sorted version is not directly applicable; a full O(n log n) sort is needed first, after which the same linear boundary-finding logic applies.',
    solutionExplanationHi:
      'Ye bilkul wahi monotonic relationship hai jis par H-Index II depend karta hai — "kam se kam i papers ke paas i citations hain" ka matlab hai ki (descending order mein) i-vaan paper khud kam se kam i citations rakhta hai — par chunki yahan input pehle se sorted nahi hai, sorted version wala O(log n) binary search seedha apply nahi ho sakta; pehle ek poora O(n log n) sort chahiye, uske baad wahi linear boundary-finding logic apply hoti hai.',
    starter: starter(
      `const citations = nums(1);

function hIndex(citations) {
  // your code here
}

console.log(hIndex(citations));`,
      `citations = nums(1)

def h_index(citations):
    # your code here
    pass

print(h_index(citations))`,
    ),
    solution: solution(
      `const citations = nums(1).slice().sort((a, b) => b - a);
let h = 0;
for (let i = 0; i < citations.length; i++) {
  if (citations[i] >= i + 1) h = i + 1;
  else break;
}
console.log(h);`,
      `citations = sorted(nums(1), reverse=True)
h = 0
for i, c in enumerate(citations):
    if c >= i + 1:
        h = i + 1
    else:
        break
print(h)`,
    ),
    testCases: [
      sample('5\n3 0 6 1 5', '3'),
      sample('3\n1 3 1', '1'),
      hidden('1\n0', '0'),
      hidden('1\n100', '1'),
      hidden('4\n0 0 0 0', '0'),
      hidden('6\n1 1 2 2 2 5', '2'),
    ],
  },

  {
    slug: 'relative-sort-array',
    title: 'Relative Sort Array',
    category: 'Sorting',
    difficulty: 'EASY',
    description:
      'Sort `arr1` so that elements appear in the same relative order as `arr2` (every value in `arr2` is distinct and appears in `arr1`). Elements of `arr1` not present in `arr2` go at the end, sorted ascending.\n\n**Input**\n- Line 1: `n1`\n- Line 2: `arr1` (`n1` space-separated integers)\n- Line 3: `n2`\n- Line 4: `arr2` (`n2` space-separated integers)\n\n**Output**\nThe sorted `arr1`, space-separated.',
    descriptionHi:
      '`arr1` ko aise sort karo ki elements `arr2` ke relative order mein aayein (`arr2` ki har value distinct hai aur `arr1` mein maujood hai). `arr1` ke wo elements jo `arr2` mein nahi hain, unhe end mein ascending sorted daalo.\n\n**Input**\n- Line 1: `n1`\n- Line 2: `arr1` (`n1` space-separated integers)\n- Line 3: `n2`\n- Line 4: `arr2` (`n2` space-separated integers)\n\n**Output**\nSorted `arr1`, space se separate.',
    examples: [
      { input: '11\n2 3 1 3 2 4 6 7 9 2 19\n6\n2 1 4 3 9 6', output: '2 2 2 1 4 3 3 9 6 7 19' },
    ],
    constraints: ['1 <= n1, n2', 'Every value in arr2 is distinct and appears in arr1'],
    hints: [
      'Count the frequency of every value in arr1 first.',
      'Emit each value from arr2 in order, repeated as many times as it appeared in arr1.',
      'Whatever values are left over (not in arr2) get sorted normally and appended at the end.',
    ],
    approach:
      'Count the frequency of each value in `arr1`. Build the output by, for each value in `arr2` (in order), appending it as many times as its count says, then removing it from the frequency map. Whatever remains in the map (values not in `arr2`) is sorted ascending and appended.',
    approachHi:
      '`arr1` mein har value ki frequency count karo. Output banao: `arr2` ki har value (order mein) ke liye, use uske count jitni baar append karo, phir use frequency map se hata do. Map mein jo bacha (values jo `arr2` mein nahi hain) use ascending sort karke append kar do.',
    timeComplexity: 'O(n1 + n2 log n2) or O(n1 log n1) depending on implementation',
    spaceComplexity: 'O(n1)',
    solutionExplanation:
      'Counting frequencies first decouples "how many of each value exist" from "where they should go", which is what makes both parts of the output easy: the arr2-ordered prefix is built by directly looking up counts (no comparison sorting needed for that part at all), and only the genuinely leftover values — those with no specified relative order — need an actual ascending sort, since a value\'s position among duplicates does not matter, only its count does.',
    solutionExplanationHi:
      'Pehle frequencies count karna "har value kitni baar hai" ko "wo kahan jaani chahiye" se decouple kar deta hai, jo output ke dono hisson ko aasan banata hai: arr2-ordered prefix seedhe counts lookup karke banta hai (us hisse ke liye koi comparison sorting chahiye hi nahi), aur sirf genuinely bachi hui values — jinka koi specified relative order nahi — ko hi asli ascending sort chahiye, kyunki duplicates ke beech kisi value ki position matter nahi karti, sirf uska count karta hai.',
    starter: starter(
      `const arr1 = nums(1);
const arr2 = nums(3);

function relativeSortArray(arr1, arr2) {
  // your code here
  return [];
}

console.log(relativeSortArray(arr1, arr2).join(' '));`,
      `arr1 = nums(1)
arr2 = nums(3)

def relative_sort_array(arr1, arr2):
    # your code here
    return []

print(" ".join(map(str, relative_sort_array(arr1, arr2))))`,
    ),
    solution: solution(
      `const arr1 = nums(1);
const arr2 = nums(3);
const count = new Map();
for (const x of arr1) count.set(x, (count.get(x) ?? 0) + 1);
const out = [];
for (const v of arr2) { for (let i = 0; i < count.get(v); i++) out.push(v); count.delete(v); }
const rest = [...count.entries()].flatMap(([v, c]) => Array(c).fill(v)).sort((a, b) => a - b);
console.log([...out, ...rest].join(' '));`,
      `arr1 = nums(1)
arr2 = nums(3)
from collections import Counter
count = Counter(arr1)
out = []
for v in arr2:
    out.extend([v] * count[v])
    del count[v]
rest = []
for v, c in count.items():
    rest.extend([v] * c)
rest.sort()
print(" ".join(map(str, out + rest)))`,
    ),
    testCases: [
      sample('11\n2 3 1 3 2 4 6 7 9 2 19\n6\n2 1 4 3 9 6', '2 2 2 1 4 3 3 9 6 7 19'),
      hidden('1\n5\n1\n5', '5'),
      hidden('3\n1 1 1\n1\n1', '1 1 1'),
      hidden('4\n5 4 3 2\n2\n2 3', '2 3 4 5'),
      hidden('5\n1 2 3 4 5\n2\n5 1', '5 1 2 3 4'),
    ],
  },

  {
    slug: 'minimum-arrows-to-burst-balloons',
    title: 'Minimum Number of Arrows to Burst Balloons',
    category: 'Sorting',
    difficulty: 'MEDIUM',
    description:
      'Each balloon spans an x-range `[start, end]`. An arrow shot at position `x` bursts every balloon whose range includes `x`. Find the minimum number of arrows needed to burst all balloons.\n\n**Input**\n- Line 1: `n`\n- Next `n` lines: `start end`\n\n**Output**\nThe minimum number of arrows.',
    descriptionHi:
      'Har balloon ek x-range `[start, end]` cover karta hai. Position `x` par chalaya gaya arrow har us balloon ko burst kar deta hai jiski range mein `x` aata hai. Saare balloons burst karne ke liye minimum arrows chahiye, wo batao.\n\n**Input**\n- Line 1: `n`\n- Agli `n` lines: `start end`\n\n**Output**\nMinimum arrows.',
    examples: [
      { input: '4\n10 16\n2 8\n1 6\n7 12', output: '2' },
      { input: '4\n1 2\n3 4\n5 6\n7 8', output: '4' },
    ],
    constraints: ['0 <= n <= 10^5'],
    hints: [
      'This is structurally the same problem as Non-overlapping Intervals, just phrased as "how many groups" instead of "how many removals".',
      'Sort balloons by their end coordinate.',
      'One arrow, shot at the end of the earliest-ending balloon, bursts every balloon that overlaps it — greedily group balloons this way.',
    ],
    approach:
      'Sort balloons by end coordinate. Greedily shoot an arrow at the end of the first (earliest-ending) unburst balloon; this arrow also bursts every subsequent balloon whose start is `<= ` that arrow position. Skip all of those, then repeat with the next unburst balloon.',
    approachHi:
      'Balloons ko end coordinate se sort karo. Greedily pehle (sabse jaldi khatam hone wale) unburst balloon ke end par ek arrow chalao; ye arrow har agle balloon ko bhi burst kar deta hai jiska start us arrow position se `<= ` ho. Un sabko skip karo, phir agle unburst balloon se repeat karo.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1) extra (beyond the sort)',
    solutionExplanation:
      'This reuses Non-overlapping Intervals\' "sort by end, keep the earliest finisher" greedy insight, but the boundary rule is subtly different: here an arrow bursts a balloon whose range *includes* the arrow\'s position, so two balloons that merely touch (like `[1,2]` and `[2,3]`) share a single arrow, whereas Non-overlapping Intervals treats touching intervals as compatible (not overlapping) under its own, stricter comparison — so the two problems are structurally similar but not numerically interchangeable. Shooting at the earliest-ending unburst balloon is still optimal here for the same reason: no balloon can end earlier, so no arrow position bursts a wider set of the remaining balloons.',
    solutionExplanationHi:
      'Ye Non-overlapping Intervals wala hi "end se sort karo, sabse jaldi khatam hone wala rakho" greedy insight reuse karta hai, par boundary rule subtly alag hai: yahan ek arrow us balloon ko burst karta hai jiski range mein arrow ki position *include* hoti hai, isliye do balloons jo sirf touch karte hain (jaise `[1,2]` aur `[2,3]`) ek hi arrow share karte hain, jabki Non-overlapping Intervals touching intervals ko apne stricter comparison ke hisaab se compatible (overlapping nahi) maanta hai — isliye dono problems structurally similar hain par numerically interchangeable nahi. Sabse jaldi khatam hone wale unburst balloon par shoot karna yahan bhi isi wajah se optimal hai: koi bhi balloon usse pehle khatam nahi hota, isliye koi bhi arrow position bache hue balloons ka usse bada set burst nahi kar sakta.',
    starter: starter(
      `const n = num(0);
const balloons = [];
for (let i = 1; i <= n; i++) balloons.push(nums(i));

function findMinArrowShots(balloons) {
  // your code here
}

console.log(findMinArrowShots(balloons));`,
      `n = num(0)
balloons = [nums(i) for i in range(1, n + 1)]

def find_min_arrow_shots(balloons):
    # your code here
    pass

print(find_min_arrow_shots(balloons))`,
    ),
    solution: solution(
      `const n = num(0);
const balloons = [];
for (let i = 1; i <= n; i++) balloons.push(nums(i));
if (balloons.length === 0) { console.log(0); }
else {
  balloons.sort((a, b) => a[1] - b[1]);
  let arrows = 1, arrowPos = balloons[0][1];
  for (const [s, e] of balloons) {
    if (s > arrowPos) { arrows++; arrowPos = e; }
  }
  console.log(arrows);
}`,
      `n = num(0)
balloons = [nums(i) for i in range(1, n + 1)]
if not balloons:
    print(0)
else:
    balloons.sort(key=lambda b: b[1])
    arrows = 1
    arrow_pos = balloons[0][1]
    for s, e in balloons:
        if s > arrow_pos:
            arrows += 1
            arrow_pos = e
    print(arrows)`,
    ),
    testCases: [
      sample('4\n10 16\n2 8\n1 6\n7 12', '2'),
      sample('4\n1 2\n3 4\n5 6\n7 8', '4'),
      hidden('0\n', '0'),
      hidden('1\n1 2', '1'),
      hidden('3\n1 2\n2 3\n3 4', '2'),
      hidden('2\n1 2\n1 2', '1'),
    ],
  },

  {
    slug: 'custom-sort-string',
    title: 'Custom Sort String',
    category: 'Sorting',
    difficulty: 'EASY',
    description:
      '`order` defines a custom priority among some lowercase letters. Rearrange the characters of `s` to respect that priority; characters not mentioned in `order` may appear anywhere after the ordered characters, keeping their original relative order.\n\n**Input**\n- Line 1: `order`\n- Line 2: `s`\n\n**Output**\nThe rearranged `s`.',
    descriptionHi:
      '`order` kuch lowercase letters ke beech ek custom priority define karta hai. `s` ke characters ko us priority ke hisaab se rearrange karo; jo characters `order` mein nahi hain wo ordered characters ke baad kahin bhi aa sakte hain, apna original relative order rakhte hue.\n\n**Input**\n- Line 1: `order`\n- Line 2: `s`\n\n**Output**\nRearranged `s`.',
    examples: [
      { input: 'cba\nabcd', output: 'cbad' },
      { input: 'bcafg\nabcd', output: 'bcad' },
    ],
    constraints: ['1 <= order.length <= 26', '0 <= s.length <= 200', 'order has no duplicate characters'],
    hints: [
      'Count the frequency of every character in s first.',
      'Emit each character from order in sequence, repeated as many times as it appears in s, removing it from the count as you go.',
      'Whatever characters are left over (not in order) can be appended in any consistent way, such as their original relative order.',
    ],
    approach:
      'Count the frequency of each character in `s`. Build the output by walking `order` and, for each character, appending it as many times as it occurs in `s` (then removing it from the count). Finally, append any remaining characters of `s` (those not in `order`) in their original relative order.',
    approachHi:
      '`s` mein har character ki frequency count karo. Output banao: `order` ko walk karo aur, har character ke liye, use utni baar append karo jitni baar `s` mein aata hai (phir use count se hata do). Aakhir mein, `s` ke bache hue characters (jo `order` mein nahi hain) unke original relative order mein append kar do.',
    timeComplexity: 'O(|s| + |order|)',
    spaceComplexity: 'O(|s|)',
    solutionExplanation:
      'Because `order` only constrains characters it explicitly mentions, the problem splits cleanly into two independent parts: characters covered by `order` (whose exact multiplicity is known from a single frequency count of `s`, and whose relative order is fully dictated by walking `order` itself), and everything else (which has no ordering constraint at all, so preserving their original relative order — the simplest valid choice — is always acceptable).',
    solutionExplanationHi:
      'Chunki `order` sirf unhi characters ko constrain karta hai jo wo explicitly mention karta hai, ye problem saaf do independent hisson mein toot jaata hai: `order` se covered characters (jinki exact multiplicity `s` ke ek single frequency count se pata hai, aur jinka relative order poori tarah `order` ko walk karne se tay hota hai), aur baaki sab (jinka koi ordering constraint hi nahi, isliye unka original relative order preserve karna — sabse simple valid choice — hamesha acceptable hai).',
    starter: starter(
      `const order = line(0), s = line(1);

function customSortString(order, s) {
  // your code here
}

console.log(customSortString(order, s));`,
      `order, s = line(0), line(1)

def custom_sort_string(order, s):
    # your code here
    pass

print(custom_sort_string(order, s))`,
    ),
    solution: solution(
      `const order = line(0), s = line(1);
const count = new Map();
for (const c of s) count.set(c, (count.get(c) ?? 0) + 1);
let out = '';
for (const c of order) { out += c.repeat(count.get(c) ?? 0); count.delete(c); }
for (const c of s) if (count.has(c)) out += c;
console.log(out);`,
      `order, s = line(0), line(1)
from collections import Counter
count = Counter(s)
out = []
for c in order:
    out.append(c * count[c])
    count[c] = 0
for c in s:
    if count[c] > 0:
        out.append(c)
        count[c] -= 1
print("".join(out))`,
    ),
    testCases: [
      sample('cba\nabcd', 'cbad'),
      sample('bcafg\nabcd', 'bcad'),
      hidden('abc\n\n', ''),
      hidden('a\nbbaa', 'aabb'),
      hidden('xyz\nabc', 'abc'),
      hidden('zyx\nabc', 'abc'),
    ],
  },
];
