/**
 * DSA Complete Course — Module 6: Recursion & Backtracking, lesson 5.
 *
 * The three backtracking SHAPES that every interview variant reduces to:
 * permutations (order matters, every element used exactly once, tracked by a
 * `used` array), combinations (order does not matter, enforced by a start
 * index that only ever moves forward), and constraint placement (N-Queens,
 * where the state being tracked is not "what have I picked" but "which
 * columns and diagonals are already attacked"). Builds directly on lesson 2
 * (choose / recurse / undo on subsets) and lesson 3 (pruning) — this lesson
 * assumes both and adds the part those lessons deliberately left out: how the
 * LOOP inside the recursive call differs between the shapes, and how
 * duplicates in the input are handled with a sort plus a skip condition.
 *
 * Broken example: generating permutations by reusing the subsets template —
 * a start index — which silently produces combinations instead, and then the
 * "obvious" fix of dropping the start index, which produces duplicates
 * because the same element gets picked twice on one path.
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

export const DSA_MODULE_6_PART5: CourseLesson[] = [
  {
    slug: 'backtracking-templates-permutations-combinations-nqueens',
    title: 'Backtracking Templates: Permutations, Combinations, and N-Queens',
    titleHi: 'Backtracking Templates: Permutations, Combinations, Aur N-Queens',
    description: 'Reaching for the subsets template from lesson 2 whenever a problem says "generate all..." — and getting silently wrong answers, because a start index that only moves forward can never produce [2, 1] after [1, 2], so a function asked for permutations quietly returns combinations instead.',
    descriptionHi: 'Lesson 2 ke subsets template ki taraf pahunchna jab bhi ek problem kehti hai "sab banao..." — aur chupchaap galat jawaab paana, kyunki ek start index jo sirf aage badhta hai kabhi [1, 2] ke baad [2, 1] nahi bana sakta, isliye permutations ke liye poochha gaya ek function chupchaap combinations return karta hai.',
    difficulty: 'HARD',
    duration: 26,
    order: 5,

    analogy: {
      en: '**Three different ways a group of people can be asked to line up, and how the person organising them keeps track.** First situation: everyone must be in the photo, and the order they stand in matters, so "Asha then Bilal" is a different photo from "Bilal then Asha". The organiser needs one thing — a list of who is already standing in the line — and at each position they consider everyone not yet in it. Second situation: pick any three of them for a committee; being on the committee is all that counts, so Asha-Bilal-Chandni and Bilal-Asha-Chandni are the same committee and must not be counted twice. The organiser here keeps a different thing — a pointer that only ever moves forward down the original list of names, so a name can only be considered after the ones before it, which makes every committee come out in one fixed order and appear exactly once. Third situation: seat people at a long table where certain pairs must not be able to see each other. Now what the organiser tracks is not who has been seated but which sightlines are already blocked — and the moment a seat would create a forbidden sightline, that seat is skipped without even considering the rest of that arrangement. Same underlying activity in all three: place someone, continue, then take them back out again. What changes is only the bookkeeping — a used-list, a forward-only pointer, or a set of blocked sightlines — and picking the wrong one gives an answer to a different question than the one asked.',
      hi: '**Teen alag tarike jinse logon ke ek group ko line mein lagne ko kaha jaa sakta hai, aur unhe organise karne waala kaise track rakhta hai.** Pehli sthiti: sabko photo mein hona chahiye, aur wo jis kram mein khade hote hain wo maayne rakhta hai, isliye "Asha phir Bilal" "Bilal phir Asha" se ek alag photo hai. Organiser ko ek cheez chahiye — ek list ki kaun pehle se line mein khada hai — aur har position par wo har us insaan par vichaar karte hain jo abhi tak ismein nahi hai. Doosri sthiti: unmein se koi teen ek committee ke liye chuno; committee par hona hi sab kuch hai, isliye Asha-Bilal-Chandni aur Bilal-Asha-Chandni wahi committee hain aur do baar nahi ginne chahiye. Organiser yahaan ek alag cheez rakhta hai — ek pointer jo naamon ki asli list mein sirf aage badhta hai, isliye ek naam par sirf usse pehle waalon ke baad vichaar ho sakta hai, jo har committee ko ek fixed kram mein nikaalta hai aur bilkul ek baar dikhaata hai. Teesri sthiti: logon ko ek lambi mez par bithaao jahaan kuch jodiyaan ek doosre ko dekh na sakein. Ab organiser jo track karta hai wo ye nahi ki kaun baith chuka hai balki ye ki kaunsi sightlines pehle se block hain — aur jis pal ek seat ek manaa sightline banaati, wo seat chhod di jaati hai us vyavastha ka baaki hissa vichaar kiye bina bhi. Teenon mein wahi underlying gatividhi: kisi ko rakho, jaari rakho, phir use wapas nikaal lo. Jo badalta hai wo sirf bookkeeping hai — ek used-list, ek sirf-aage-jaane-waala pointer, ya blocked sightlines ka ek set — aur galat chunna poochhe gaye sawaal se alag sawaal ka jawaab deta hai.',
    },

    simple: `**Start broken.** Reusing the subsets template (a start index) to generate permutations:

\`\`\`js
function permutationsBroken(nums) {
  const result = [];
  const current = [];

  function backtrack(start) {              // start index — copied from the subsets lesson
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < nums.length; i++) {   // only ever looks FORWARD
      current.push(nums[i]);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(0);
  return result;
}

console.log(permutationsBroken([1, 2, 3]));
// [[1, 2, 3]]   <-- ONE result. Expected 6.
\`\`\`

The start index is the thing that makes combinations correct, and it is exactly the thing that makes permutations wrong: once index 1 is used, index 0 is unreachable forever, so \`[2, 1]\` can never be built. The "obvious" fix — delete the start index and always loop from 0 — swings to the opposite bug:

\`\`\`js
for (let i = 0; i < nums.length; i++) {  // no start index
  current.push(nums[i]);
  backtrack();
  current.pop();
}
// [1,1,1], [1,1,2], [1,1,3], ...  27 results, because nothing stops
// the SAME element being picked again on the same path.
\`\`\`

**The fix: each shape needs its own bookkeeping**

\`\`\`js
// SHAPE 1 — PERMUTATIONS: order matters, every element used exactly once.
// Bookkeeping: a "used" array. Loop from 0 every time, skip what is in use.
function permutations(nums) {
  const result = [], current = [], used = new Array(nums.length).fill(false);

  function backtrack() {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;               // <-- the guard that replaces the start index
      used[i] = true;  current.push(nums[i]);
      backtrack();
      current.pop();   used[i] = false;    // undo BOTH pieces of state
    }
  }

  backtrack();
  return result;
}

// SHAPE 2 — COMBINATIONS: order does not matter, choose k of n.
// Bookkeeping: a start index, so each element is only ever seen after the
// ones before it -> every combination is produced in exactly one order.
function combinations(n, k) {
  const result = [], current = [];

  function backtrack(start) {
    if (current.length === k) { result.push([...current]); return; }
    for (let i = start; i <= n; i++) {
      current.push(i);
      backtrack(i + 1);                    // i + 1: never look back
      current.pop();
    }
  }

  backtrack(1);
  return result;
}

// SHAPE 3 — CONSTRAINT PLACEMENT (N-Queens): place one queen per row.
// Bookkeeping: not "what did I pick" but "what is already attacked".
function solveNQueens(n) {
  const result = [], queenCol = [];
  const cols = new Set(), diag = new Set(), anti = new Set();

  function backtrack(row) {
    if (row === n) { result.push(render(queenCol, n)); return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(row - c) || anti.has(row + c)) continue;  // pruned
      cols.add(c); diag.add(row - c); anti.add(row + c); queenCol.push(c);
      backtrack(row + 1);
      queenCol.pop(); anti.delete(row + c); diag.delete(row - c); cols.delete(c);
    }
  }

  backtrack(0);
  return result;
}

function render(queenCol, n) {
  return queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1));
}
\`\`\`

\`\`\`ts
function permutations<T>(nums: T[]): T[][] {
  const result: T[][] = [], current: T[] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  function backtrack(): void {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(nums[i]!);
      backtrack();
      current.pop(); used[i] = false;
    }
  }
  backtrack();
  return result;
}

function combinations(n: number, k: number): number[][] {
  const result: number[][] = [], current: number[] = [];
  function backtrack(start: number): void {
    if (current.length === k) { result.push([...current]); return; }
    for (let i = start; i <= n; i++) {
      current.push(i);
      backtrack(i + 1);
      current.pop();
    }
  }
  backtrack(1);
  return result;
}
\`\`\`

Every one of the three still has lesson 2's choose / recurse / undo skeleton. The only difference is what sits in the loop header and what has to be undone.`,

    simpleHi: `**Toote hue se shuru.** Permutations banaane ke liye subsets template (ek start index) reuse karna:

\`\`\`js
function permutationsBroken(nums) {
  const result = [];
  const current = [];

  function backtrack(start) {              // start index — subsets lesson se copy kiya
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < nums.length; i++) {   // sirf AAGE dekhta hai
      current.push(nums[i]);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(0);
  return result;
}

console.log(permutationsBroken([1, 2, 3]));
// [[1, 2, 3]]   <-- EK result. 6 expected the.
\`\`\`

Start index wo cheez hai jo combinations ko sahi banaati hai, aur bilkul wahi cheez hai jo permutations ko galat banaati hai: ek baar index 1 istemal ho gaya, index 0 hamesha ke liye apahunch hai, isliye \`[2, 1]\` kabhi ban nahi sakta. "Spasht" fix — start index delete karo aur hamesha 0 se loop karo — ulte bug par jhoolta hai:

\`\`\`js
for (let i = 0; i < nums.length; i++) {  // koi start index nahi
  current.push(nums[i]);
  backtrack();
  current.pop();
}
// [1,1,1], [1,1,2], [1,1,3], ...  27 results, kyunki kuch bhi USI element ko
// usi path par dobara chune jaane se nahi rokta.
\`\`\`

**Fix: har shape ko apni bookkeeping chahiye**

\`\`\`js
// SHAPE 1 — PERMUTATIONS: kram maayne rakhta hai, har element bilkul ek baar istemal.
// Bookkeeping: ek "used" array. Har baar 0 se loop karo, jo istemal mein hai use skip karo.
function permutations(nums) {
  const result = [], current = [], used = new Array(nums.length).fill(false);

  function backtrack() {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;               // <-- wo guard jo start index ki jagah leta hai
      used[i] = true;  current.push(nums[i]);
      backtrack();
      current.pop();   used[i] = false;    // state ke DONO tukde undo karo
    }
  }

  backtrack();
  return result;
}

// SHAPE 2 — COMBINATIONS: kram maayne nahi rakhta, n mein se k chuno.
// Bookkeeping: ek start index, taaki har element sirf usse pehle waalon ke baad
// dekha jaaye -> har combination bilkul ek kram mein banta hai.
function combinations(n, k) {
  const result = [], current = [];

  function backtrack(start) {
    if (current.length === k) { result.push([...current]); return; }
    for (let i = start; i <= n; i++) {
      current.push(i);
      backtrack(i + 1);                    // i + 1: kabhi peechhe mat dekho
      current.pop();
    }
  }

  backtrack(1);
  return result;
}

// SHAPE 3 — CONSTRAINT PLACEMENT (N-Queens): prati row ek queen rakho.
// Bookkeeping: "maine kya chuna" nahi balki "kya pehle se attacked hai".
function solveNQueens(n) {
  const result = [], queenCol = [];
  const cols = new Set(), diag = new Set(), anti = new Set();

  function backtrack(row) {
    if (row === n) { result.push(render(queenCol, n)); return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(row - c) || anti.has(row + c)) continue;  // pruned
      cols.add(c); diag.add(row - c); anti.add(row + c); queenCol.push(c);
      backtrack(row + 1);
      queenCol.pop(); anti.delete(row + c); diag.delete(row - c); cols.delete(c);
    }
  }

  backtrack(0);
  return result;
}

function render(queenCol, n) {
  return queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1));
}
\`\`\`

\`\`\`ts
function permutations<T>(nums: T[]): T[][] {
  const result: T[][] = [], current: T[] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  function backtrack(): void {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(nums[i]!);
      backtrack();
      current.pop(); used[i] = false;
    }
  }
  backtrack();
  return result;
}

function combinations(n: number, k: number): number[][] {
  const result: number[][] = [], current: number[] = [];
  function backtrack(start: number): void {
    if (current.length === k) { result.push([...current]); return; }
    for (let i = start; i <= n; i++) {
      current.push(i);
      backtrack(i + 1);
      current.pop();
    }
  }
  backtrack(1);
  return result;
}
\`\`\`

Teenon mein se har ek mein abhi bhi lesson 2 ka choose / recurse / undo skeleton hai. Ekmatra antar wo hai jo loop header mein baitha hai aur jo undo karna padta hai.`,

    content: `## The one table that tells you which template to write

\`\`\`
Question the problem is really asking        Loop header            Extra state
-------------------------------------------  ---------------------  ----------------------
"all orderings" / "arrangements"             for i = 0..n-1         used[] array
  (order matters, all elements used)           if (used[i]) continue

"choose k of n" / "all subsets"              for i = start..n-1     none — start does it
  (order does NOT matter)                      recurse(i + 1)

"choose k, repeats allowed"                  for i = start..n-1     none
  (e.g. combination sum)                       recurse(i)   <-- i, not i + 1

"place things under constraints"             for each candidate     sets/arrays of what
  (N-Queens, sudoku, word search)              if (attacked) continue   is already blocked
\`\`\`

Read the problem statement for two words: does **order** matter, and can an element be **reused**. Those two answers pick the row. Almost every "generate all ..." interview question is one of these four with different dressing.

## Duplicates in the input: sort, then skip siblings

\`\`\`js
// permutationsUnique([1, 1, 2]) must give 3 results, not 6.
function permutationsUnique(nums) {
  nums = [...nums].sort((a, b) => a - b);          // equal values become ADJACENT
  const result = [], current = [], used = new Array(nums.length).fill(false);

  function backtrack() {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      // skip a duplicate whose identical twin has NOT been used at this level:
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      used[i] = true; current.push(nums[i]);
      backtrack();
      current.pop(); used[i] = false;
    }
  }

  backtrack();
  return result;
}
// [[1,1,2], [1,2,1], [2,1,1]]
\`\`\`

The skip condition is the part everyone gets wrong, so read it slowly. Among a run of equal values, we allow only ONE fixed order of consumption: the earlier copy must be used before the later copy. \`!used[i - 1]\` means the earlier twin is *not* currently in the path, so picking \`nums[i]\` now would be starting with the later copy — a branch that produces an arrangement identical to one we will build (or have built) via the earlier copy. Skipping it removes the duplicate without removing any distinct answer. For **combinations** with duplicates the same idea takes a simpler form, because the start index already fixes the order:

\`\`\`js
if (i > start && nums[i] === nums[i - 1]) continue;   // i > start, not i > 0
\`\`\`

Here \`i > start\` means "not the first candidate at this level", and the first candidate is the only one allowed to introduce that value at this depth.

## N-Queens: why three sets, and why row - col and row + col

\`\`\`
Board indices for a 4x4, showing row - col (the "\\" diagonal id):

        c=0  c=1  c=2  c=3
  r=0    0   -1   -2   -3
  r=1    1    0   -1   -2        Every square on the same "\\" diagonal
  r=2    2    1    0   -1        has the SAME value of row - col.
  r=3    3    2    1    0

And row + col (the "/" anti-diagonal id):

        c=0  c=1  c=2  c=3
  r=0    0    1    2    3
  r=1    1    2    3    4        Every square on the same "/" diagonal
  r=2    2    3    4    5        has the SAME value of row + col.
  r=3    3    4    5    6
\`\`\`

Because we place exactly one queen per row, rows can never conflict — that constraint is built into the recursion shape and needs no bookkeeping at all. The remaining three attack lines each get one set, and membership testing is O(1), so checking whether a square is safe costs O(1) instead of scanning the board. This is lesson 3's pruning taken to its natural end: the check happens *before* descending, so an entire subtree of impossible boards is never created.

Undoing must reverse **every** piece of state that was added — all three sets plus the column list. Forgetting one is the single most common N-Queens bug, and it does not crash; it just silently returns too few solutions.

## Cost, and what "efficient backtracking" actually means

\`\`\`
permutations of n items    n!  results     -> O(n! * n) to also copy each one out
subsets of n items         2^n results     -> O(2^n * n)
combinations C(n, k)       C(n,k) results  -> O(C(n,k) * k)
N-Queens                   worst case still exponential, but pruning cuts the
                           explored tree from n^n down to roughly n! and far below

You cannot beat the output size — if a problem demands n! answers, printing them
is already n!. "Efficient" backtracking means: never explore a branch that cannot
produce output. Pruning changes the CONSTANT and the shape of the tree, not the
big-O of the answer set.
\`\`\`

This is why Module 14's constraint-budgeting lesson lists n <= 8 or so for permutation problems and n <= 20 for subset problems: the input bound in the problem statement tells you the intended shape before you have written a line.`,

    contentHi: `## Wo ek table jo batata hai kaunsa template likhna hai

\`\`\`
Problem asal mein jo poochh rahi hai                Loop header            Extra state
-------------------------------------------------  ---------------------  ----------------------
"sab orderings" / "arrangements"                    for i = 0..n-1         used[] array
  (kram maayne rakhta hai, sab elements istemal)      if (used[i]) continue

"n mein se k chuno" / "sab subsets"                 for i = start..n-1     koi nahi — start karta hai
  (kram maayne NAHI rakhta)                           recurse(i + 1)

"k chuno, repeats allowed"                          for i = start..n-1     koi nahi
  (jaise combination sum)                             recurse(i)   <-- i, i + 1 nahi

"constraints ke tahat cheezein rakho"               har candidate ke liye  sets/arrays ki kya
  (N-Queens, sudoku, word search)                     if (attacked) continue   pehle se block hai
\`\`\`

Problem statement mein do shabd padho: kya **kram** maayne rakhta hai, aur kya ek element **dobara istemal** ho sakta hai. Wo do jawaab row chunte hain. Lagbhag har "sab banao ..." interview sawaal in chaar mein se ek hai alag kapdon mein.

## Input mein duplicates: sort karo, phir siblings skip karo

\`\`\`js
// permutationsUnique([1, 1, 2]) ko 3 results dene chahiye, 6 nahi.
function permutationsUnique(nums) {
  nums = [...nums].sort((a, b) => a - b);          // barabar values ADJACENT ban jaati hain
  const result = [], current = [], used = new Array(nums.length).fill(false);

  function backtrack() {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      // ek duplicate skip karo jiska samaan twin is level par istemal NAHI hua:
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
      used[i] = true; current.push(nums[i]);
      backtrack();
      current.pop(); used[i] = false;
    }
  }

  backtrack();
  return result;
}
// [[1,1,2], [1,2,1], [2,1,1]]
\`\`\`

Skip condition wo hissa hai jo sab galat karte hain, isliye ise dheere padho. Barabar values ke ek run mein, hum sirf EK fixed kram ki khapat allow karte hain: pehli copy baad waali copy se pehle istemal honi chahiye. \`!used[i - 1]\` matlab pehla twin abhi path mein *nahi* hai, isliye \`nums[i]\` ab chunna baad waali copy se shuru karna hoga — ek branch jo ek aisi arrangement banaata hai jo us se samaan hai jo hum pehli copy ke zariye banaayenge (ya bana chuke hain). Ise skip karna duplicate hataata hai bina koi alag jawaab hataaye. Duplicates ke saath **combinations** ke liye wahi idea ek saral roop leta hai, kyunki start index pehle se kram tay karta hai:

\`\`\`js
if (i > start && nums[i] === nums[i - 1]) continue;   // i > start, i > 0 nahi
\`\`\`

Yahaan \`i > start\` matlab "is level par pehla candidate nahi", aur pehla candidate hi ekmatra hai jise is depth par wo value laane ki ijaazat hai.

## N-Queens: teen sets kyun, aur row - col aur row + col kyun

\`\`\`
Ek 4x4 ke board indices, row - col dikhaate hue ("\\" diagonal id):

        c=0  c=1  c=2  c=3
  r=0    0   -1   -2   -3
  r=1    1    0   -1   -2        Usi "\\" diagonal par har square ki
  r=2    2    1    0   -1        row - col ki value SAMAAN hai.
  r=3    3    2    1    0

Aur row + col ("/" anti-diagonal id):

        c=0  c=1  c=2  c=3
  r=0    0    1    2    3
  r=1    1    2    3    4        Usi "/" diagonal par har square ki
  r=2    2    3    4    5        row + col ki value SAMAAN hai.
  r=3    3    4    5    6
\`\`\`

Kyunki hum prati row bilkul ek queen rakhte hain, rows kabhi conflict nahi kar sakti — wo constraint recursion shape mein bana hua hai aur ise koi bookkeeping nahi chahiye. Baaki teen attack lines mein se har ek ko ek set milta hai, aur membership test O(1) hai, isliye ye check karna ki ek square safe hai board scan karne ke bajaye O(1) kharch karta hai. Ye lesson 3 ki pruning apne swabhaavik ant tak le jaayi gayi hai: check descend karne se *pehle* hota hai, isliye namumkin boards ka ek poora subtree kabhi banta hi nahi.

Undo karna **har** us state ke tukde ko ulta karna chahiye jo joda gaya tha — teenon sets plus column list. Ek bhoolna sabse aam N-Queens bug hai, aur ye crash nahi karta; ye bas chupchaap bahut kam solutions return karta hai.

## Cost, aur "efficient backtracking" ka asal matlab kya hai

\`\`\`
n items ke permutations   n!  results     -> har ek copy karne ko bhi O(n! * n)
n items ke subsets        2^n results     -> O(2^n * n)
combinations C(n, k)      C(n,k) results  -> O(C(n,k) * k)
N-Queens                  worst case abhi bhi exponential, par pruning explored
                          tree ko n^n se lagbhag n! aur usse bahut neeche kaatti hai

Aap output size ko haraa nahi sakte — agar ek problem n! jawaab maangti hai, unhe
print karna pehle hi n! hai. "Efficient" backtracking ka matlab hai: ek aisi branch
kabhi explore mat karo jo output bana hi nahi sakti. Pruning CONSTANT aur tree ka
shape badalti hai, answer set ka big-O nahi.
\`\`\`

Yahi wajah hai ki Module 14 ka constraint-budgeting lesson permutation problems ke liye n <= 8 jaisa aur subset problems ke liye n <= 20 list karta hai: problem statement mein input bound aapko intended shape batata hai isse pehle ki aapne ek line likhi ho.`,

    examples: [
      {
        title: 'Broken: the subsets template cannot produce permutations',
        titleHi: 'Toota: subsets template permutations nahi bana sakta',
        code: `for (let i = start; i < nums.length; i++) { ... backtrack(i + 1); }
// once index 1 is used, index 0 is unreachable -> [2, 1] can never be built`,
        codeJs: `function permutationsBroken(nums) {
  const result = [], current = [];
  function backtrack(start) {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1);
      current.pop();
    }
  }
  backtrack(0);
  return result;
}
console.log(permutationsBroken([1, 2, 3]));   // [[1, 2, 3]] — 1 result, expected 6

// The "obvious" fix overshoots into the opposite bug:
function permutationsAlsoBroken(nums) {
  const result = [], current = [];
  function backtrack() {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {   // no start, no used[]
      current.push(nums[i]); backtrack(); current.pop();
    }
  }
  backtrack();
  return result;
}
console.log(permutationsAlsoBroken([1, 2, 3]).length);   // 27 — includes [1,1,1]`,
        codeTs: `function permutationsBroken(nums: number[]): number[][] {
  const result: number[][] = [], current: number[] = [];
  function backtrack(start: number): void {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]!); backtrack(i + 1); current.pop();
    }
  }
  backtrack(0);
  return result;
}`,
        outputJs: `[ [ 1, 2, 3 ] ]
27`,
        outputTs: `// Same wrong results — the type system cannot catch a logic error.`,
        explain: 'A forward-only start index is what makes combinations correct and permutations impossible. Removing it without adding a used[] array swaps one bug for another: elements get reused on the same path.',
        explainHi: 'Ek sirf-aage-jaane-waala start index wo hai jo combinations ko sahi aur permutations ko namumkin banaata hai. Ise ek used[] array jode bina hataana ek bug ko doosre se badalta hai: elements usi path par dobara istemal hote hain.',
      },
      {
        title: 'Fixed: used[] for permutations, start index for combinations',
        titleHi: 'Theek: permutations ke liye used[], combinations ke liye start index',
        code: `if (used[i]) continue;                  // permutations
for (let i = start; i <= n; i++) ...    // combinations`,
        codeJs: `function permutations(nums) {
  const result = [], current = [], used = new Array(nums.length).fill(false);
  function backtrack() {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(nums[i]);
      backtrack();
      current.pop(); used[i] = false;
    }
  }
  backtrack();
  return result;
}
console.log(permutations([1, 2, 3]));

function combinations(n, k) {
  const result = [], current = [];
  function backtrack(start) {
    if (current.length === k) { result.push([...current]); return; }
    for (let i = start; i <= n; i++) { current.push(i); backtrack(i + 1); current.pop(); }
  }
  backtrack(1);
  return result;
}
console.log(combinations(4, 2));`,
        codeTs: `function permutations<T>(nums: T[]): T[][] {
  const result: T[][] = [], current: T[] = [];
  const used = new Array<boolean>(nums.length).fill(false);
  function backtrack(): void {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; current.push(nums[i]!);
      backtrack();
      current.pop(); used[i] = false;
    }
  }
  backtrack();
  return result;
}`,
        outputJs: `[ [ 1, 2, 3 ], [ 1, 3, 2 ], [ 2, 1, 3 ],
  [ 2, 3, 1 ], [ 3, 1, 2 ], [ 3, 2, 1 ] ]
[ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ], [ 3, 4 ] ]`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Six permutations and six combinations of 4 choose 2 — the counts confirm each shape. The undo step must reverse used[i] as well as the push, or later branches inherit a stale "in use" flag.',
        explainHi: 'Chhah permutations aur 4 choose 2 ke chhah combinations — counts har shape confirm karte hain. Undo step ko push ke saath used[i] bhi ulta karna chahiye, warna baad ki branches ek purana "in use" flag viraasat mein leti hain.',
      },
      {
        title: 'N-Queens: three sets, and undoing all of them',
        titleHi: 'N-Queens: teen sets, aur unhe sabko undo karna',
        code: `if (cols.has(c) || diag.has(row - c) || anti.has(row + c)) continue;
// ... and the undo must delete from ALL THREE sets, not just cols`,
        codeJs: `function solveNQueens(n) {
  const result = [], queenCol = [];
  const cols = new Set(), diag = new Set(), anti = new Set();
  function backtrack(row) {
    if (row === n) {
      result.push(queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(row - c) || anti.has(row + c)) continue;
      cols.add(c); diag.add(row - c); anti.add(row + c); queenCol.push(c);
      backtrack(row + 1);
      queenCol.pop(); anti.delete(row + c); diag.delete(row - c); cols.delete(c);
    }
  }
  backtrack(0);
  return result;
}
console.log(solveNQueens(4).length);   // 2
console.log(solveNQueens(4)[0]);
console.log(solveNQueens(8).length);   // 92`,
        codeTs: `function solveNQueens(n: number): string[][] {
  const result: string[][] = [], queenCol: number[] = [];
  const cols = new Set<number>(), diag = new Set<number>(), anti = new Set<number>();
  function backtrack(row: number): void {
    if (row === n) {
      result.push(queenCol.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(row - c) || anti.has(row + c)) continue;
      cols.add(c); diag.add(row - c); anti.add(row + c); queenCol.push(c);
      backtrack(row + 1);
      queenCol.pop(); anti.delete(row + c); diag.delete(row - c); cols.delete(c);
    }
  }
  backtrack(0);
  return result;
}`,
        outputJs: `2
[ '.Q..', '...Q', 'Q...', '..Q.' ]
92`,
        outputTs: `// Identical results, fully typed.`,
        explain: 'Rows need no set because exactly one queen is placed per row by construction. All squares on a "\\" diagonal share row - col, and all on a "/" diagonal share row + col, so an O(1) set lookup replaces scanning the board.',
        explainHi: 'Rows ko koi set nahi chahiye kyunki nirmaan se prati row bilkul ek queen rakhi jaati hai. Ek "\\" diagonal ke sab squares row - col share karte hain, aur ek "/" ke sab row + col, isliye ek O(1) set lookup board scan karne ki jagah leta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `// undoing only half the state in a permutation
used[i] = true; current.push(nums[i]);
backtrack();
current.pop();                  // used[i] is left TRUE forever`,
        right: `used[i] = true; current.push(nums[i]);
backtrack();
current.pop(); used[i] = false;  // undo EVERYTHING that was added`,
        why: 'Whatever the choose step adds, the undo step must remove — all of it. A stale used[i] makes that element permanently invisible to every later branch, so the function returns far fewer results and never errors, which is the hardest kind of bug to spot.',
        whyHi: 'Choose step jo bhi jodta hai, undo step ko wo sab hataana chahiye. Ek purana used[i] us element ko har baad ki branch ke liye sthaayi roop se anadekha bana deta hai, isliye function bahut kam results return karta hai aur kabhi error nahi deta, jo sabse mushkil tarah ka bug hai.',
      },
      {
        wrong: `// deduping permutations without sorting first
if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
// on [1, 2, 1] the two 1s are NOT adjacent -> duplicates still get through`,
        right: `nums = [...nums].sort((a, b) => a - b);   // equal values must be ADJACENT first
// then the skip condition works`,
        why: 'The skip condition compares nums[i] with its immediate neighbour, so it only sees a duplicate when equal values sit next to each other. Sorting is what makes that true; without it the condition is silently a no-op on scattered duplicates.',
        whyHi: 'Skip condition nums[i] ko iske turant padosi se compare karta hai, isliye ye ek duplicate sirf tab dekhta hai jab barabar values ek doosre ke bagal mein baithi hon. Sorting wo hai jo ise sach banaati hai; iske bina condition bikhre duplicates par chupchaap ek no-op hai.',
      },
      {
        wrong: `// recursing with i + 1 when repeats are allowed (combination sum)
current.push(candidates[i]);
backtrack(i + 1, remaining - candidates[i]);   // forbids reusing the SAME number`,
        right: `current.push(candidates[i]);
backtrack(i, remaining - candidates[i]);       // i, so the same number can repeat`,
        why: 'Passing i keeps the current element available for the next level, which is exactly what "each number may be used unlimited times" asks for; passing i + 1 moves past it. The start index still prevents going backwards, so combinations are still produced only once each.',
        whyHi: 'i pass karna current element ko agle level ke liye upalabdh rakhta hai, jo bilkul wo hai jo "har number aseemit baar istemal ho sakta hai" maangta hai; i + 1 pass karna isse aage nikal jaata hai. Start index abhi bhi peechhe jaane se rokta hai, isliye combinations abhi bhi har ek sirf ek baar bante hain.',
      },
    ],

    realWorld: [
      {
        en: '**Scheduling and timetabling** — assigning classes to rooms and slots so no teacher, room, or group collides — is N-Queens with more constraint sets: place one item at a time, keep sets of what is already taken, and abandon a branch the moment a conflict appears.',
        hi: '**Scheduling aur timetabling** — classes ko rooms aur slots mein assign karna taaki koi teacher, room, ya group takraaye nahi — zyaada constraint sets ke saath N-Queens hai: ek baar mein ek item rakho, jo pehle se liya gaya hai uske sets rakho, aur jis pal ek conflict dikhe branch chhod do.',
      },
      {
        en: '**Test-case generation** for a feature with several independent toggles enumerates combinations (order irrelevant) rather than permutations, which is why picking the wrong template turns a 2^n test matrix into an n! one that never finishes.',
        hi: '**Test-case generation** kayi swatantra toggles waale ek feature ke liye combinations enumerate karta hai (kram asangat) permutations nahi, yahi wajah hai ki galat template chunna ek 2^n test matrix ko ek n! matrix mein badal deta hai jo kabhi khatam nahi hota.',
      },
      {
        en: '**Sudoku solvers, crossword fillers, and package dependency resolvers** are all the constraint-placement shape: try a value, record what it rules out, recurse, and undo the recording on the way back up.',
        hi: '**Sudoku solvers, crossword fillers, aur package dependency resolvers** sab constraint-placement shape hain: ek value try karo, wo kya khaarij karti hai record karo, recurse karo, aur wapas upar aate waqt recording undo karo.',
      },
    ],

    interviewQA: [
      {
        q: 'How do you decide, from a problem statement, whether to write the permutation template or the combination template?',
        qHi: 'Aap ek problem statement se kaise tay karte ho ki permutation template likhna hai ya combination template?',
        a: 'Two questions settle it, and I ask them before writing anything. The first is whether order matters — that is, whether the answer set treats one-two and two-one as two different answers or as the same answer. If they are different, it is a permutation problem; if they are the same, it is a combination or subset problem. The second question is whether an element can be reused within a single answer. Those two answers pick the template exactly. If order matters and every element is used once, I loop from zero every time and carry a boolean used array, skipping any index already in the path — the used array is what stops an element being picked twice, and it is also what allows the loop to look backwards at indices smaller than the current one, which is what makes two-one reachable after one-two. If order does not matter, I carry a start index and loop from it, recursing with start plus one. The start index means an element is only ever considered after the elements before it, so each combination is generated in exactly one canonical order and appears exactly once — no deduplication step is needed at all. If order does not matter but elements may repeat, it is the same start-index template except the recursive call passes the current index rather than the current index plus one, which keeps the same element available at the next level. The failure mode I watch out for is reaching for the subsets template out of habit when the problem wanted permutations. That does not throw an error and it does not obviously look wrong — it just returns a much smaller answer set, because a forward-only index makes it structurally impossible to produce any ordering other than the sorted one. So the sanity check I always run is a count: three distinct elements should give six permutations, or eight subsets, or three combinations of size two. If the count is wrong, the template is wrong, and no amount of debugging the inside of the loop will fix it.',
        aHi: 'Do sawaal ise tay karte hain, aur main kuch bhi likhne se pehle unhe poochhta hoon. Pehla ye ki kya kram maayne rakhta hai — matlab, kya answer set ek-do aur do-ek ko do alag jawaab maanta hai ya wahi jawaab. Agar wo alag hain, ye ek permutation problem hai; agar wo samaan hain, ye ek combination ya subset problem hai. Doosra sawaal ye hai ki kya ek element ek akele jawaab ke andar dobara istemal ho sakta hai. Wo do jawaab template bilkul chunte hain. Agar kram maayne rakhta hai aur har element ek baar istemal hota hai, main har baar zero se loop karta hoon aur ek boolean used array rakhta hoon, path mein pehle se maujood koi bhi index skip karte hue — used array wo hai jo ek element ko do baar chune jaane se rokta hai, aur wahi loop ko current se chhote indices par peechhe dekhne deta hai, jo ek-do ke baad do-ek ko pahunch yogya banaata hai. Agar kram maayne nahi rakhta, main ek start index rakhta hoon aur usse loop karta hoon, start plus ek ke saath recurse karte hue. Start index ka matlab hai ek element par sirf usse pehle waale elements ke baad vichaar hota hai, isliye har combination bilkul ek canonical kram mein banta hai aur bilkul ek baar dikhta hai — koi deduplication step chahiye hi nahi. Agar kram maayne nahi rakhta par elements repeat ho sakte hain, wahi start-index template hai sivaay iske ki recursive call current index plus ek ke bajaye current index pass karta hai, jo usi element ko agle level par upalabdh rakhta hai. Jo failure mode main dekhta hoon wo aadat se subsets template ki taraf pahunchna hai jab problem permutations chaahti thi. Wo error nahi phenkta aur spasht roop se galat nahi dikhta — ye bas ek bahut chhota answer set return karta hai. Isliye jo sanity check main hamesha chalata hoon wo ek count hai: teen alag elements ko chhah permutations, ya aath subsets, ya size do ke teen combinations dene chahiye.',
      },
      {
        q: 'Walk me through the N-Queens constraint tracking. Why three sets, and why is row - col a valid diagonal identifier?',
        qHi: 'Mujhe N-Queens constraint tracking samjhaao. Teen sets kyun, aur row - col ek valid diagonal identifier kyun hai?',
        a: 'The recursion places exactly one queen per row and moves down the board one row at a time, so the row constraint is satisfied by the shape of the recursion itself and needs no bookkeeping — two queens can never share a row because we never place two in one call level. That leaves three ways queens attack each other: the same column, the same descending diagonal, and the same ascending diagonal. Each gets one set of the identifiers currently occupied. Columns are trivial — the identifier is just the column number. For the descending diagonal, the one going from upper-left to lower-right, notice that as you move one square down you also move one square right, so the row increases by one and the column increases by one, which means their difference stays constant. Every square on that diagonal therefore shares the same value of row minus column, and that difference is a perfect identifier for the diagonal. The ascending diagonal is the mirror image: moving down-left increases the row by one while decreasing the column by one, so the sum row plus column stays constant, and that sum identifies the anti-diagonal. Both identifiers are integers in a small range, so a set membership test is constant time, and checking whether a square is safe costs three constant-time lookups instead of scanning previously placed queens. Then the crucial discipline is the undo. Placing a queen adds to three sets and pushes onto the column list, so backtracking must delete from all three sets and pop the list. If even one deletion is missed, the algorithm does not crash and does not report anything unusual — it simply believes a square is still attacked when it is not, prunes valid branches, and returns too few solutions. That is why I always verify with known counts: four queens has exactly two solutions and eight queens has exactly ninety-two. A wrong count is almost always a missing undo.',
        aHi: 'Recursion prati row bilkul ek queen rakhti hai aur board mein ek baar mein ek row neeche jaati hai, isliye row constraint khud recursion ke shape se poora hota hai aur ise koi bookkeeping nahi chahiye — do queens kabhi ek row share nahi kar sakti kyunki hum ek call level mein kabhi do nahi rakhte. Isse teen tarike bachte hain jinse queens ek doosre par hamla karti hain: wahi column, wahi descending diagonal, aur wahi ascending diagonal. Har ek ko abhi occupied identifiers ka ek set milta hai. Columns saral hain — identifier bas column number hai. Descending diagonal ke liye, jo upar-baayen se neeche-daayen jaata hai, dhyaan do ki jab aap ek square neeche jaate ho aap ek square daayen bhi jaate ho, isliye row ek se badhta hai aur column ek se badhta hai, jiska matlab unka antar sthir rehta hai. Us diagonal par har square isliye row minus column ki wahi value share karta hai, aur wo antar diagonal ke liye ek perfect identifier hai. Ascending diagonal iska darpan hai: neeche-baayen jaana row ko ek se badhata hai jabki column ko ek se ghataata hai, isliye yog row plus column sthir rehta hai, aur wo yog anti-diagonal ko pehchaanta hai. Dono identifiers ek chhoti range mein integers hain, isliye ek set membership test sthir samay hai. Phir mahatvapurna anushaasan undo hai. Ek queen rakhna teen sets mein jodta hai aur column list par push karta hai, isliye backtracking ko teenon sets se delete karna aur list pop karni chahiye. Agar ek bhi deletion chhoot jaata hai, algorithm crash nahi karta — ye bas maanta hai ki ek square abhi bhi attacked hai jab wo nahi hai, valid branches prune karta hai, aur bahut kam solutions return karta hai. Isliye main hamesha maloom counts se verify karta hoon: chaar queens ke bilkul do solutions hain aur aath queens ke bilkul biyaanve.',
      },
    ],

    exercises: [
      {
        task: 'Implement permutations([1,2,3]) with a used[] array and confirm it returns 6 results. Then deliberately delete the "used[i] = false" line in the undo and count the results again. Explain the number you get.',
        taskHi: 'permutations([1,2,3]) ko ek used[] array se implement karo aur confirm karo ki ye 6 results return karta hai. Phir jaan-boojhkar undo mein "used[i] = false" line delete karo aur results phir se gino. Jo number milta hai use samjhaao.',
        hint: 'Without the reset, every index is marked used permanently after its first branch, so the very first path consumes all three elements and no other path can ever complete — you get 1 result.',
        hintHi: 'Reset ke bina, har index apni pehli branch ke baad sthaayi roop se used mark ho jaata hai, isliye sabse pehla path teenon elements khaa jaata hai aur koi doosra path kabhi poora nahi ho sakta — aapko 1 result milta hai.',
      },
      {
        task: 'Implement permutationsUnique for input [1, 1, 2] (expect exactly 3 results) and combinationsUnique for [1, 1, 2, 2] choosing 2 (expect [1,1], [1,2], [2,2]). Note that the skip condition differs: i > 0 with !used[i-1] for permutations, i > start for combinations.',
        taskHi: 'permutationsUnique ko input [1, 1, 2] ke liye implement karo (bilkul 3 results expect karo) aur combinationsUnique ko [1, 1, 2, 2] se 2 chunte hue (expect [1,1], [1,2], [2,2]). Dhyaan do ki skip condition alag hai: permutations ke liye i > 0 with !used[i-1], combinations ke liye i > start.',
        hint: 'Both require sorting first so equal values are adjacent. For combinations the start index already fixes an order, so only the first candidate at each level may introduce a given value — hence i > start rather than i > 0.',
        hintHi: 'Dono ko pehle sorting chahiye taaki barabar values adjacent hon. Combinations ke liye start index pehle se ek kram tay karta hai, isliye har level par sirf pehla candidate ek di gayi value laa sakta hai — isliye i > 0 ke bajaye i > start.',
      },
      {
        task: 'Implement solveNQueens and verify n = 4 gives 2 solutions and n = 8 gives 92. Then add a counter for how many times backtrack() is called, and compare it against the brute-force count of n^n board arrangements for n = 6.',
        taskHi: 'solveNQueens implement karo aur verify karo ki n = 4 se 2 solutions aur n = 8 se 92 milte hain. Phir ek counter jodo ki backtrack() kitni baar call hota hai, aur ise n = 6 ke liye n^n board arrangements ki brute-force count se compare karo.',
        hint: 'For n = 6, brute force is 6^6 = 46,656 arrangements, while the pruned search explores only a few hundred nodes. That ratio is exactly what lesson 3 called pruning — the check happens before descending, so impossible subtrees are never built.',
        hintHi: 'n = 6 ke liye, brute force 6^6 = 46,656 arrangements hai, jabki pruned search sirf kuch sau nodes explore karta hai. Wo ratio bilkul wo hai jise lesson 3 ne pruning kaha — check descend karne se pehle hota hai, isliye namumkin subtrees kabhi bante hi nahi.',
      },
    ],

    keyTakeaways: [
      'Every "generate all ..." problem is one of four shapes. Read the statement for two things: does ORDER matter, and can an element be REUSED. Those two answers pick the template.',
      'Permutations: loop from 0 every time and carry a used[] array. The used[] guard is what replaces the start index and is what makes [2, 1] reachable after [1, 2].',
      'Combinations/subsets: carry a start index and recurse with i + 1. The forward-only index generates each combination in exactly one order, so no deduplication is needed.',
      'Repeats allowed (combination sum): same start-index template, but recurse with i instead of i + 1 so the current element stays available.',
      'Duplicates in the input: sort first so equal values are adjacent, then skip siblings — "i > 0 && nums[i] === nums[i-1] && !used[i-1]" for permutations, "i > start && nums[i] === nums[i-1]" for combinations.',
      'N-Queens tracks what is ATTACKED, not what was picked: one set for columns, one for row - col, one for row + col. Rows need no set because one queen per row is built into the recursion.',
      'The undo step must reverse EVERY piece of state the choose step added. A missed undo does not crash — it silently returns too few results, which is why you verify against known counts (4-queens = 2, 8-queens = 92).',
    ],
    keyTakeawaysHi: [
      'Har "sab banao ..." problem chaar shapes mein se ek hai. Statement mein do cheezein padho: kya KRAM maayne rakhta hai, aur kya ek element DOBARA ISTEMAL ho sakta hai. Wo do jawaab template chunte hain.',
      'Permutations: har baar 0 se loop karo aur ek used[] array rakho. used[] guard wo hai jo start index ki jagah leta hai aur jo [1, 2] ke baad [2, 1] ko pahunch yogya banaata hai.',
      'Combinations/subsets: ek start index rakho aur i + 1 se recurse karo. Sirf-aage-jaane-waala index har combination ko bilkul ek kram mein banaata hai, isliye koi deduplication nahi chahiye.',
      'Repeats allowed (combination sum): wahi start-index template, par i + 1 ke bajaye i se recurse karo taaki current element upalabdh rahe.',
      'Input mein duplicates: pehle sort karo taaki barabar values adjacent hon, phir siblings skip karo — permutations ke liye "i > 0 && nums[i] === nums[i-1] && !used[i-1]", combinations ke liye "i > start && nums[i] === nums[i-1]".',
      'N-Queens track karta hai ki kya ATTACKED hai, ye nahi ki kya chuna gaya: columns ke liye ek set, row - col ke liye ek, row + col ke liye ek. Rows ko koi set nahi chahiye kyunki prati row ek queen recursion mein bana hua hai.',
      'Undo step ko HAR us state ke tukde ko ulta karna chahiye jo choose step ne joda. Ek chhoota undo crash nahi karta — ye chupchaap bahut kam results return karta hai, isliye aap maloom counts se verify karte ho (4-queens = 2, 8-queens = 92).',
    ],
  },
];
