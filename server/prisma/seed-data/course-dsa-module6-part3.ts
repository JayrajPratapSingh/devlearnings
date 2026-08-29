/**
 * DSA Complete Course — Module 6: Recursion & Backtracking, lesson 3.
 *
 * Constraint backtracking: pruning invalid branches early rather than
 * fully exploring them and discarding the result at the end. Broken
 * example: finding all subsets that sum to exactly a target value by
 * generating every single subset first (using this module's previous
 * lesson's technique unmodified), then filtering the complete list
 * afterward — genuinely correct, but exploring every one of the 2^n
 * branches to full completion, including enormous numbers of branches
 * whose running sum already exceeded the target long before the branch
 * finished. Fixed by checking the constraint DURING the exploration,
 * inside the backtracking function itself, abandoning (pruning) a
 * branch the instant it becomes provably impossible to satisfy, rather
 * than continuing to build it out to a result that will only be
 * discarded afterward — the same "generate-then-filter versus check-as-
 * you-go" distinction this course's earlier lessons drew for other
 * problems, applied here to backtracking specifically.
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

export const DSA_MODULE_6_PART3: CourseLesson[] = [
  {
    slug: 'constraint-backtracking-pruning',
    title: 'Constraint Backtracking: Pruning Invalid Paths Early',
    titleHi: 'Constraint Backtracking: Invalid Raaste Jaldi Prune Karna',
    description: 'Finding all subsets of a large array that sum to exactly a target value by first generating every one of the 2 to the power n possible subsets in full, then filtering the finished list afterward — genuinely correct, but fully building out enormous numbers of subsets whose running sum already made success impossible long before they were finished.',
    descriptionHi: 'Ek bade array ke sab subsets dhoondhna jo bilkul ek target value tak sum karte hain pehle 2 ki power n sambhaavit subsets mein se har ek ko poori tarah banaakar, phir baad mein poori list ko filter karke — sach mein sahi, par bahut zyaada subsets ko poori tarah banaate hue jinka chalta sum safalta ko asambhaavya bana chuka tha unke poore hone se kaafi pehle.',
    difficulty: 'HARD',
    duration: 24,
    order: 3,

    analogy: {
      en: '**Filling out and completely submitting every single one of a thousand different job application forms, only checking afterward whether each one meets the position\'s minimum requirements — versus checking the requirements against what has been filled in so far the INSTANT a specific answer disqualifies the entire application, and stopping right there without wasting any more time filling out the rest.** Submitting every application fully before checking anything genuinely finds every application that meets the requirements — nothing about this approach produces an incorrect result — but it means fully completing, in detail, a huge number of applications that were already provably disqualified after the very first or second question, wasting enormous effort on forms that were never going anywhere. Checking as each answer is filled in means that the moment a specific answer makes the application impossible to qualify (a required minimum years of experience that has already been exceeded on the wrong side, for instance), the rest of that specific form is never touched at all — the disqualification is noticed immediately, and effort moves directly to the next candidate application instead. Generating every subset in full and filtering the complete list afterward is the fill-out-everything-then-check approach: correct, but wasting enormous effort completing branches that were already doomed. Checking the constraint during the exploration itself, abandoning a branch the instant it becomes impossible, is the check-as-you-go approach: the exact same correct answers, without ever finishing work that was already known to be pointless.',
      hi: '**Ek hazaar alag job application forms mein se har akele ko bharna aur poori tarah submit karna, sirf baad mein check karna ki kya har ek position ki minimum zarooratein poori karta hai — versus abhi tak bhare gaye ke khilaaf zarooratein check karna bilkul us pal jab ek khaas jawaab poori application ko disqualify karta hai, aur bilkul wahaan ruk jaana bina baaki bharne mein aur samay barbaad kiye.** Kuch bhi check karne se pehle har application ko poori tarah submit karna sach mein har application dhoondhta hai jo zarooratein poori karti hai — is approach ke baare mein kuch bhi ek galat nateeja nahi banaata — par iska matlab hai vistaar se poori tarah bahut zyaada tadaad mein applications poora karna jo pehle hi bilkul pehle ya doosre sawaal ke baad provably disqualified thi, un forms par vishaal koshish barbaad karte hue jo kabhi kahin nahi jaane waali thi. Har jawaab bharte waqt check karna matlab hai us pal jab ek khaas jawaab application ko qualify hone se namumkin banaata hai (ek zaruri minimum saalon ka anubhav jo pehle hi galat taraf se paar ho chuka hai, misal ke taur par), us khaas form ka baaki hissa bilkul kabhi chhua nahi jaata — disqualification turant notice ki jaati hai, aur koshish seedhe agli candidate application ki taraf jaati hai iske bajaye. Har subset ko poori tarah banaana aur baad mein poori list ko filter karna sab-kuch-bharo-phir-check-karo approach hai: sahi, par un branches ko poora karne mein vishaal koshish barbaad karte hue jo pehle hi barbaad thi. Exploration ke dauraan khud constraint check karna, ek branch ko us pal chhodte hue jab ye namumkin ban jaata hai, check-as-you-go approach hai: bilkul wahi sahi jawaab, kabhi bhi wo kaam poora kiye bina jo pehle se maloom tha ki bekaar hai.',
    },

    simple: `**Start broken.** Generate every subset first, filter for the target sum afterward:

\`\`\`js
function subsetsWithSum(arr, target) {
  const allSubsets = [];
  const current = [];

  function backtrack(index) {
    if (index === arr.length) {
      allSubsets.push([...current]); // record EVERY subset, valid or not
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }

  backtrack(0);
  return allSubsets.filter((subset) => subset.reduce((a, b) => a + b, 0) === target);
}
\`\`\`

This is exactly this module\'s previous lesson\'s subset-generation code, with a \`.filter()\` added afterward. It is genuinely correct — every subset summing to \`target\` is eventually found. The waste is that ALL \`2ⁿ\` subsets are fully generated first, including enormous numbers whose running sum already exceeds \`target\` partway through being built — for an array of all positive numbers, once a partial subset\'s sum already exceeds the target, adding more positive numbers can only make it larger still, so that entire branch, and everything built on top of it, is provably doomed long before \`backtrack\` even reaches \`index === arr.length\` to record it.

**The fix: check the constraint during exploration, abandoning doomed branches immediately**

\`\`\`js
function subsetsWithSum(arr, target) {
  const results = [];
  const current = [];

  function backtrack(index, currentSum) {
    if (currentSum > target) return; // PRUNE — this branch cannot possibly succeed
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }

  backtrack(0, 0);
  return results;
}
\`\`\`

\`\`\`ts
function subsetsWithSum(arr: number[], target: number): number[][] {
  const results: number[][] = [];
  const current: number[] = [];

  function backtrack(index: number, currentSum: number): void {
    if (currentSum > target) return;
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }

  backtrack(0, 0);
  return results;
}
\`\`\`

The single new line, \`if (currentSum > target) return;\`, checks the constraint the INSTANT it becomes violated, rather than waiting until a complete subset has been built. As soon as a branch\'s running sum exceeds \`target\` (assuming, as is common for this problem, that \`arr\` contains only non-negative numbers, so the sum can never decrease by adding more), that entire branch, and every branch that would have been explored on top of it, is abandoned immediately — \`backtrack\` returns right away, without ever recursing further into what was already a doomed path.`,

    simpleHi: `**Toote hue se shuru.** Pehle har subset banaao, baad mein target sum ke liye filter karo:

\`\`\`js
function subsetsWithSum(arr, target) {
  const allSubsets = [];
  const current = [];

  function backtrack(index) {
    if (index === arr.length) {
      allSubsets.push([...current]); // HAR subset record karo, valid ho ya na ho
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }

  backtrack(0);
  return allSubsets.filter((subset) => subset.reduce((a, b) => a + b, 0) === target);
}
\`\`\`

Ye bilkul is module ke pehle wale lesson ka subset-banaane-waala code hai, baad mein ek \`.filter()\` joda gaya. Ye sach mein sahi hai — har subset jo \`target\` tak sum karta hai aakhirkaar mil jaata hai. Barbaadi ye hai ki SAB \`2ⁿ\` subsets pehle poori tarah banaaye jaate hain, bahut zyaada tadaad sameet jinka chalta sum pehle hi \`target\` se aage nikal chuka hai banaaye jaane ke beech mein — sab positive numbers waale ek array ke liye, ek baar ek aadhe subset ka sum pehle se target se aage nikal jaaye, aur zyaada positive numbers jodna ise sirf aur bada bana sakta hai, isliye wo poori branch, aur uske oopar banaayi gayi har cheez, \`backtrack\` ke \`index === arr.length\` tak pahunchne se kaafi pehle provably barbaad hai ise record karne ke liye.

**Fix: exploration ke dauraan constraint check karo, barbaad branches ko turant chhodte hue**

\`\`\`js
function subsetsWithSum(arr, target) {
  const results = [];
  const current = [];

  function backtrack(index, currentSum) {
    if (currentSum > target) return; // PRUNE — ye branch bilkul safal nahi ho sakti
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }

  backtrack(0, 0);
  return results;
}
\`\`\`

\`\`\`ts
function subsetsWithSum(arr: number[], target: number): number[][] {
  const results: number[][] = [];
  const current: number[] = [];

  function backtrack(index: number, currentSum: number): void {
    if (currentSum > target) return;
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }

  backtrack(0, 0);
  return results;
}
\`\`\`

Akeli nayi line, \`if (currentSum > target) return;\`, constraint ko us PAL check karti hai jab ye violate hoti hai, ek poora subset banaaye jaane tak wait karne ke bajaye. Jaise hi ek branch ka chalta sum \`target\` se aage nikalta hai (ye maante hue, jaisa is problem ke liye aam hai, ki \`arr\` mein sirf non-negative numbers hain, isliye sum zyaada jodne se kabhi kam nahi ho sakta), wo poori branch, aur har branch jo iske oopar explore ki jaati, turant chhod di jaati hai — \`backtrack\` turant return karta hai, kabhi aur us raaste mein recurse kiye bina jo pehle se barbaad tha.`,

    content: `## Why "generate all, then filter" and "prune during exploration" produce identical results

\`\`\`
Both approaches examine the same underlying decision tree of choices.
"Generate all, then filter" walks every branch to full completion,
  then discards the ones that fail the constraint.
"Prune during exploration" checks the constraint at each step, and
  simply never walks further into a branch already known to fail.

Same final answer. Different amount of work done to get there.
\`\`\`

Both approaches are exploring the exact same underlying tree of choices — this module\'s previous lesson\'s choose/recurse/undo structure, unchanged. The only difference is WHEN the constraint gets checked: after a branch is fully built, or during its construction. Since a branch that violates the constraint partway through can only continue to violate it further (for this specific problem, adding more non-negative numbers to a sum that already exceeds the target cannot bring it back down), checking early and stopping there discards nothing that checking late would have kept — it simply avoids doing the additional, ultimately wasted work of continuing to build out a branch whose fate was already sealed.

## Recognizing when a constraint is safe to prune on

\`\`\`
Safe to prune early: the constraint, once violated, can ONLY get
  worse as the branch continues (e.g. sum can only grow with more
  non-negative numbers added, never shrink back below the target)

NOT safe to prune the same way: a constraint that could still be
  satisfied later even though it looks violated right now (e.g. if
  arr could contain negative numbers, a sum that is currently too
  high could still come back down)
\`\`\`

Pruning correctly depends on genuinely understanding why a partial violation guarantees the branch cannot recover — this is a real, problem-specific judgment call, not something safe to apply reflexively to any constraint. This lesson\'s example works specifically because \`arr\` is assumed to contain only non-negative numbers, meaning a running sum can never decrease as more elements are added, so once it exceeds \`target\`, it is genuinely, provably doomed. If \`arr\` could contain negative numbers, a sum that currently exceeds \`target\` might still come back down later in that same branch, and pruning it early would incorrectly discard a subset that could have gone on to succeed — the specific pruning condition used here would need to be reconsidered entirely for that different version of the problem.

## Connecting this to N-Queens-style constraint satisfaction

\`\`\`
Placing queens one row at a time on a chessboard: before placing a
queen in a specific column, check whether it would conflict with any
queen already placed in an earlier row (same column, or same diagonal)

If it conflicts: prune immediately — do not even recurse into placing
  the remaining queens on top of an already-invalid placement
\`\`\`

This same early-checking principle is exactly what makes classic constraint-satisfaction backtracking problems like placing \`n\` queens on a chessboard so that none attack each other tractable at all: rather than placing all \`n\` queens fully and only then checking whether any pair conflicts, a well-written solution checks whether a new queen\'s placement conflicts with any queen already placed BEFORE recursing further, abandoning that specific placement immediately if so. Without this pruning, an \`n\`-queens solver would need to generate and check every possible arrangement of \`n\` queens on the board, an astronomically large number for even a modestly sized board — with pruning, entire enormous branches of hopelessly conflicting placements are eliminated the instant the very first conflict is detected, often after only one or two queens have been placed, making genuinely large boards solvable in practice.`,

    contentHi: `## "Sab banaao, phir filter karo" aur "exploration ke dauraan prune karo" identical nateeje kyun banaate hain

\`\`\`
Dono approaches chunaavon ke usi underlying decision tree ko examine karte hain.
"Sab banaao, phir filter karo" har branch ko poori tarah poora hone tak chalta hai,
  phir un ko discard karta hai jo constraint fail karti hain.
"Exploration ke dauraan prune karo" har kadam par constraint check karta hai, aur
  bas kabhi ek branch mein aur aage nahi chalta jo pehle se fail hone ke liye jaani jaati hai.

Wahi aakhri jawaab. Wahaan pahunchne ke liye kiya gaya kaam alag.
\`\`\`

Dono approaches bilkul usi underlying tree ko explore kar rahi hain chunaavon ka — is module ke pehle wale lesson ka choose/recurse/undo structure, na-badla. Akela farak ye hai ki constraint KAB check ki jaati hai: ek branch ke poori tarah banaaye jaane ke baad, ya iske construction ke dauraan. Kyunki ek branch jo beech mein constraint violate karti hai sirf ise aur violate karte reh sakti hai (is khaas problem ke liye, ek sum mein aur non-negative numbers jodna jo pehle hi target se aage nikal chuka hai use wapas neeche nahi laa sakta), jaldi check karna aur wahaan rukna kuch bhi discard nahi karta jo der se check karna rakhta — ye bas us atirikt, aakhirkaar barbaad kiye gaye kaam ko karne se bachta hai ek branch banaate rehne ka jiska anjaam pehle hi tay tha.

## Ye pehchaanna ki ek constraint kab prune karne laayak surakshit hai

\`\`\`
Jaldi prune karne laayak surakshit: constraint, ek baar violate hone
  par, branch jaari rehne par SIRF aur kharaab ho sakta hai (jaisa
  sum sirf badh sakta hai zyaada non-negative numbers jodne se, kabhi
  target se neeche wapas nahi simat sakta)

Isi tarah prune karne laayak SURAKSHIT NAHI: ek constraint jo baad
  mein phir bhi poori ki jaa sakti hai chahe abhi violated dikhe
  (jaisa agar arr negative numbers rakh sakta hai, ek sum jo abhi
  bahut zyaada hai phir bhi baad mein neeche wapas aa sakta hai)
\`\`\`

Sahi tarike se prune karna sach mein ye samajhne par nirbhar karta hai ki ek aadhi violation branch ko recover na hone ki guarantee kyun deti hai — ye ek asli, problem-khaas faisla hai, kisi bhi constraint par reflexively lagu karne laayak surakshit kuch nahi hai. Is lesson ka example khaas taur par isliye kaam karta hai kyunki \`arr\` sirf non-negative numbers rakhta hai ye maana jaata hai, matlab ek chalta sum zyaada elements jodne par kabhi kam nahi ho sakta, isliye ek baar ye \`target\` se aage nikalta hai, ye sach mein, provably barbaad hai. Agar \`arr\` negative numbers rakh sakta, ek sum jo abhi \`target\` se aage hai phir bhi usi branch mein baad mein wapas neeche aa sakta hai, aur ise jaldi prune karna galti se ek aisa subset discard karega jo aakhirkaar safal ho sakta tha — istemal ki gayi khaas pruning condition ko us problem ke us alag version ke liye poori tarah dobara vichaar karna chahiye.

## Ise N-Queens-style constraint satisfaction se jodna

\`\`\`
Ek chessboard par ek waqt mein ek row queens rakhna: ek khaas column
mein ek queen rakhne se pehle, check karo ki kya ye kisi bhi queen se
takraayega jo pehle ek pehli row mein rakhi gayi hai (samaan column,
ya samaan diagonal)

Agar ye takraata hai: turant prune karo — recurse bhi mat karo baaki
  queens ko ek pehle-se-invalid placement ke oopar rakhne mein
\`\`\`

Yahi jaldi-check-karne ka siddhaant bilkul wo hai jo classic constraint-satisfaction backtracking problems jaisa \`n\` queens ko ek chessboard par is tarah rakhna ki koi bhi ek doosre par attack na kare ko bilkul tractable banaata hai: sab \`n\` queens ko poori tarah rakhne ke bajaye aur sirf tab check karne ke bajaye ki kya koi joda takraata hai, ek achhi-tarah-likhi gayi solution check karti hai ki kya ek naye queen ki placement kisi bhi pehle-se-rakhi-gayi queen se takraati hai RECURSE karne se PEHLE, agar aisa hai toh us khaas placement ko turant chhodte hue. Is pruning ke bina, ek \`n\`-queens solver ko board par \`n\` queens ki har sambhaavit arrangement banaani aur check karni hogi, ek chhote board ke liye bhi ek astronomically badi tadaad — pruning ke saath, hopelessly takraati placements ki poori vishaal branches turant khatam ki jaati hain jab bilkul pehla takraav detect hota hai, aksar sirf ek ya do queens rakhe jaane ke baad, sach mein bade boards ko practice mein sulajhaane-yogya banaate hue.`,

    examples: [
      {
        title: 'Broken: generate every subset, filter for the target sum afterward',
        titleHi: 'Toota: har subset banaao, baad mein target sum ke liye filter karo',
        code: `backtrack(0); // generates all 2^n subsets, unconditionally
return allSubsets.filter((s) => sum(s) === target);`,
        codeJs: `function subsetsWithSum(arr, target) {
  const allSubsets = [];
  const current = [];
  function backtrack(index) {
    if (index === arr.length) {
      allSubsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }
  backtrack(0);
  return allSubsets.filter((s) => s.reduce((a, b) => a + b, 0) === target);
}
// generates all 2^n subsets before checking any of them`,
        codeTs: `function subsetsWithSum(arr: number[], target: number): number[][] {
  const allSubsets: number[][] = [];
  const current: number[] = [];
  function backtrack(index: number): void {
    if (index === arr.length) {
      allSubsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }
  backtrack(0);
  return allSubsets.filter((s) => s.reduce((a, b) => a + b, 0) === target);
}
// fully valid TypeScript — the waste is architectural, not a type error`,
        output: `subsetsWithSum([2, 3, 5, 7], 10) correctly returns [[3,7],[5,...]]
style results, but fully builds all 16 subsets first, including many
whose sum already exceeded 10 partway through being constructed.`,
        explain: 'Every one of the 2^n subsets is fully built before its sum is even checked, wasting effort on branches whose sum already made success impossible.',
        explainHi: 'Sab \`2ⁿ\` subsets mein se har ek poori tarah banaayi jaati hai iska sum check hone se pehle bhi, un branches par koshish barbaad karte hue jinka sum pehle hi safalta ko asambhaavya bana chuka tha.',
      },
      {
        title: 'Fixed: pruning the instant the running sum exceeds the target',
        titleHi: 'Theek: jaise hi chalta sum target se aage nikalta hai prune karna',
        code: `if (currentSum > target) return; // PRUNE immediately
// only continues exploring branches that can still possibly succeed`,
        codeJs: `function subsetsWithSum(arr, target) {
  const results = [];
  const current = [];
  function backtrack(index, currentSum) {
    if (currentSum > target) return;
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }
  backtrack(0, 0);
  return results;
}`,
        codeTs: `function subsetsWithSum(arr: number[], target: number): number[][] {
  const results: number[][] = [];
  const current: number[] = [];
  function backtrack(index: number, currentSum: number): void {
    if (currentSum > target) return;
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }
  backtrack(0, 0);
  return results;
}`,
        outputJs: `subsetsWithSum([2, 3, 5, 7], 10) produces the identical correct
results, but abandons doomed branches the instant their sum exceeds
10, never fully constructing them.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The moment a branch\'s running sum exceeds the target, that branch and everything that would be built on top of it is abandoned immediately, saving all the work that branch would otherwise have wasted.',
        explainHi: 'Us pal jab ek branch ka chalta sum target se aage nikalta hai, wo branch aur uske oopar banaayi jaane waali har cheez turant chhod di jaati hai, wo sab kaam bachaate hue jo wo branch anyatha barbaad karti.',
      },
      {
        title: 'Confirming pruning saves work: counting total backtrack calls',
        titleHi: 'Confirm karna ki pruning kaam bachaata hai: total backtrack calls ganna',
        code: `let callCount = 0;
function backtrack(index, currentSum) {
  callCount++;
  if (currentSum > target) return; // compare callCount with and without this line
  ...
}`,
        codeJs: `function subsetsWithSumCounted(arr, target) {
  const results = [];
  const current = [];
  let callCount = 0;
  function backtrack(index, currentSum) {
    callCount++;
    if (currentSum > target) return;
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }
  backtrack(0, 0);
  console.log("total calls:", callCount);
  return results;
}`,
        codeTs: `function subsetsWithSumCounted(arr: number[], target: number): number[][] {
  const results: number[][] = [];
  const current: number[] = [];
  let callCount = 0;
  function backtrack(index: number, currentSum: number): void {
    callCount++;
    if (currentSum > target) return;
    if (index === arr.length) {
      if (currentSum === target) results.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1, currentSum + arr[index]);
    current.pop();
    backtrack(index + 1, currentSum);
  }
  backtrack(0, 0);
  console.log("total calls:", callCount);
  return results;
}`,
        outputJs: `Removing the pruning check and re-running against the same input
shows a genuinely larger callCount — direct, measured confirmation
that pruning skips real work rather than merely looking more elegant.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Comparing callCount with and without the pruning line directly confirms, rather than assuming, that pruning genuinely reduces the amount of exploration performed.',
        explainHi: 'Pruning line ke saath aur bina \`callCount\` compare karna seedhe confirm karta hai, maanne ke bajaye, ki pruning sach mein perform ki gayi exploration ki tadaad kam karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `backtrack(0); // generates ALL subsets unconditionally
return allSubsets.filter((s) => sum(s) === target); // checks afterward`,
        right: `function backtrack(index, currentSum) {
  if (currentSum > target) return; // checks DURING exploration
  ...
}`,
        why: 'Generating every subset before filtering wastes effort fully constructing branches whose constraint was already provably violated partway through.',
        whyHi: 'Filter karne se pehle har subset banaana un branches ko poori tarah banaane mein koshish barbaad karta hai jinki constraint pehle hi beech mein provably violate ho chuki thi.',
      },
      {
        wrong: `if (currentSum > target) return; // pruning applied even though
// arr might contain negative numbers, where this reasoning breaks`,
        right: `// confirming arr contains only non-negative numbers FIRST,
// since that is what guarantees a branch cannot recover once
// its sum exceeds the target`,
        why: 'This specific pruning condition depends on the sum being unable to decrease — applying it to an array that could contain negative numbers would incorrectly discard subsets that could still succeed.',
        whyHi: 'Ye khaas pruning condition is baat par nirbhar karti hai ki sum kam na ho sake — ise ek aise array par lagu karna jo negative numbers rakh sakta hai galti se un subsets ko discard karega jo phir bhi safal ho sakte the.',
      },
      {
        wrong: `// placing all n queens fully, then checking afterward whether
// any pair conflicts`,
        right: `// checking whether a new queen's placement conflicts with any
// already-placed queen BEFORE recursing further`,
        why: 'Checking for conflicts only after fully placing all queens explores an astronomically large number of doomed arrangements that could have been abandoned after the very first conflicting placement.',
        whyHi: 'Sab queens poori tarah rakhne ke baad hi conflicts check karna ek astronomically badi tadaad ki barbaad arrangements explore karta hai jo bilkul pehli takraati placement ke baad chhodi jaa sakti thi.',
      },
    ],

    realWorld: [
      {
        en: '**"Combination Sum" and its variants are among the most commonly cited practice problems specifically chosen to teach pruning during backtracking.**',
        hi: '**"Combination Sum" aur iske variants un practice problems mein sabse aam taur par cite ki jaane waali hain jo khaas taur par backtracking ke dauraan pruning sikhaane ke liye chuni gayi hain.**',
      },
      {
        en: '**The N-Queens problem is one of the single most classic examples used to teach constraint-satisfaction backtracking**, specifically because pruning is what makes it tractable at all for realistically sized boards.',
        hi: '**N-Queens problem un ek sabse classic examples mein se ek hai jo constraint-satisfaction backtracking sikhaane ke liye istemal kiye jaate hain**, khaas taur par kyunki pruning hi hai jo ise waastavik roop se badi size ke boards ke liye bilkul tractable banaata hai.',
      },
      {
        en: '**Real constraint solvers used in scheduling, resource allocation, and puzzle-solving software rely directly on this same early-pruning principle** to remain practical at real-world scale.',
        hi: '**Scheduling, resource allocation, aur puzzle-solving software mein istemal hone waale asli constraint solvers seedhe isi jaldi-pruning-karne ke siddhaant par nirbhar karte hain** asli-duniya scale par vyaavahaarik rehne ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why does checking a constraint during backtracking, rather than generating a complete result and checking it afterward, never discard a correct answer while still saving genuine work?',
        qHi: 'Backtracking ke dauraan ek constraint check karna, ek poora nateeja banaake baad mein check karne ke bajaye, kabhi ek sahi jawaab discard kyun nahi karta phir bhi asli kaam bachaate hue?',
        a: 'The correctness of early pruning depends entirely on a specific property being true of the constraint being checked: that once it has been violated at some partial point in the exploration, it is genuinely impossible for continuing to explore further down that same branch to ever satisfy it. For the sum-based example this lesson covers, this property holds because every number being added is non-negative — once a partial sum has exceeded the target, adding any further non-negative number can only keep that sum at or above its current value, never bring it back down, meaning there is no possible continuation of that specific branch that could ever result in a sum exactly equal to the target again. Given that this property holds, checking the constraint early and abandoning the branch the instant it is violated discards precisely the same set of branches that would eventually have been discarded anyway, just later, after being fully and pointlessly constructed to completion first — the set of branches that actually succeed is completely unaffected by when, exactly, the doomed branches are recognized as doomed. What changes is only how much work is spent recognizing this: checking early stops the moment failure becomes provable, while checking late continues doing further, ultimately wasted work exploring deeper into a branch whose fate was already sealed, only to arrive at the same conclusion afterward. This is why early pruning is correct, not merely faster: it identifies the exact same successes and failures a complete generate-then-filter approach would, simply without wasting effort completing branches whose failure was already certain.',
        aHi: 'Jaldi pruning ki sahihata poori tarah is baat par nirbhar karti hai ki check ki jaa rahi constraint ki ek khaas property sach hai: ki ek baar ye exploration mein kisi aadhe bindu par violate ho chuki hai, usi branch mein aur aage explore karna asal mein isse kabhi poora karna namumkin hai. Is lesson ke sum-based example ke liye, ye property tikti hai kyunki jodi jaa rahi har number non-negative hai — ek baar ek aadha sum target se aage nikal chuka hai, koi bhi zyaada non-negative number jodna us sum ko sirf iski current value par ya usse oopar rakh sakta hai, kabhi ise wapas neeche nahi laa sakta, matlab us khaas branch ka koi sambhaavit continuation nahi hai jo kabhi target ke bilkul barabar sum mein nateeje mein aa sake. Ye property tikte hue, constraint ko jaldi check karna aur branch ko us pal chhodna jab ye violate hoti hai bilkul wahi branches ka set discard karta hai jo aakhirkaar anyway discard hoti, bas baad mein, pehle poori tarah aur bekaar mein poori tarah banaaye jaane ke baad — branches ka set jo asal mein safal hote hain is baat se poori tarah anaffected hai ki barbaad branches ko barbaad ki tarah bilkul kab pehchaana jaata hai. Jo badalta hai wo sirf ye hai ki ise pehchaanne mein kitna kaam kharch hota hai: jaldi check karna us pal rukta hai jab failure provable ban jaati hai, jabki der se check karna aage kaam karta rehta hai us branch mein aur gehraayi mein jaate hue jiska anjaam pehle hi tay tha, sirf baad mein usi nateeje tak pahunchne ke liye. Yahi wajah hai ki jaldi pruning sahi hai, sirf tez nahi: ye bilkul wahi safaltaayein aur failures pehchaanta hai jo ek poora generate-then-filter approach karega, sirf un branches ko poora karne mein koshish barbaad kiye bina jinki failure pehle se nishchit thi.',
      },
      {
        q: 'Why does the specific pruning condition used in this lesson (currentSum > target) genuinely require the array to contain only non-negative numbers, and what would go wrong if that assumption did not hold?',
        qHi: 'Is lesson mein istemal ki gayi khaas pruning condition (\`currentSum > target\`) sach mein array ko sirf non-negative numbers rakhne ki maang kyun karti hai, aur agar wo dhaarna na tikti toh kya galat hoga?',
        a: 'The specific reasoning that justifies abandoning a branch the moment its running sum exceeds the target relies on a guarantee that the sum can only stay the same or grow larger as more elements are added to it, never shrink back down. This guarantee holds precisely when every number that could still be added to the sum is non-negative, since adding zero leaves the sum unchanged and adding any positive number strictly increases it — under these conditions, once the sum has exceeded the target, no further addition of a non-negative number could ever bring it back down to exactly match the target again, making that branch\'s eventual failure a mathematical certainty rather than merely likely. If the array were permitted to contain negative numbers, this guarantee would no longer hold: a running sum that currently exceeds the target could genuinely decrease later in that same branch if a sufficiently large negative number appears further along, potentially bringing the sum back down to exactly the target value at some later point in that branch\'s continued exploration. Applying the exact same pruning condition, currentSum > target, to an array that might contain negative numbers would therefore incorrectly abandon branches that could still have gone on to produce a valid, correct answer, silently causing the function to miss genuine solutions rather than merely being slower — this would be a correctness bug, not a performance one. Solving the equivalent problem for an array that may contain negative numbers would require a genuinely different pruning strategy, one that accounts for the possibility of the sum both increasing and decreasing as the remaining elements are considered, rather than reusing this lesson\'s specific condition unchanged.',
        aHi: 'Wo khaas tark jo ek branch ko chhodne ko justify karta hai us pal jab uska chalta sum target se aage nikalta hai ek guarantee par nirbhar karta hai ki sum sirf samaan reh sakta hai ya bada ho sakta hai jaise zyaada elements ismein jode jaate hain, kabhi wapas neeche nahi simat sakta. Ye guarantee bilkul tab tikti hai jab har number jo abhi bhi sum mein jodi jaa sakti hai non-negative hai, kyunki zero jodna sum ko na-badla chhodta hai aur koi bhi positive number jodna ise sakht roop se badhaata hai — in conditions ke neeche, ek baar sum target se aage nikal chuka hai, non-negative number ka koi bhi aur addition ise kabhi bilkul target se dobara match karne ke liye wapas neeche nahi laa sakta, us branch ki aakhirkaar failure ko ek mathematical nishchitata banaate hue sirf sambhaavit ke bajaye. Agar array ko negative numbers rakhne ki anumati hoti, ye guarantee ab nahi tikegi: ek chalta sum jo abhi target se aage hai sach mein baad mein usi branch mein kam ho sakta hai agar ek kaafi bada negative number aage kahin dikhta hai, sambhaavit roop se sum ko us branch ke jaari exploration mein kisi baad ke bindu par bilkul target value tak wapas neeche laate hue. Bilkul wahi pruning condition, \`currentSum > target\`, ek aise array par lagu karna jo negative numbers rakh sakta hai isliye galti se un branches ko chhodega jo phir bhi ek valid, sahi jawaab banaane ke liye aage jaa sakti thi, chupchaap function ko asli solutions miss karne ka kaaran banaate hue sirf dheema hone ke bajaye — ye ek sahihata bug hoga, ek performance nahi. Ek aise array ke liye samaan problem sulajhaana jo negative numbers rakh sakta hai ek sach mein alag pruning strategy maangega, ek jo sum ke badhne aur ghatne dono ki sambhaavna ka hisaab rakhti hai jaise baaki elements par vichaar kiya jaata hai, is lesson ki khaas condition ko bina badle dobara istemal karne ke bajaye.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (generate-then-filter) and fixed (prune-during) subsetsWithSum functions from this lesson. Add the call-counting instrumentation from the third example to both, and confirm the fixed version makes measurably fewer calls.',
        taskHi: 'Is lesson ka toota (generate-then-filter) aur theek (prune-during) \`subsetsWithSum\` functions dono banao. Teesre example ka call-counting instrumentation dono mein jodo, aur confirm karo ki theek version naapa-jaane-laayak kam calls karta hai.',
        hint: 'Try this with an array of moderately large numbers where many partial sums quickly exceed a small target, to make the difference more dramatic.',
        hintHi: 'Ise moderately bade numbers ke ek array ke saath try karo jahan kayi aadhe sums jaldi ek chhote target se aage nikal jaate hain, farak ko zyaada naatakiya banaane ke liye.',
      },
      {
        task: 'Deliberately run the fixed function against an array that contains a negative number and confirm, by comparing against the brute-force filtered version, whether the pruning condition still produces correct results.',
        taskHi: 'Jaan-boojhkar theek function ko ek aise array ke khilaaf chalaao jismein ek negative number hai aur confirm karo, brute-force filtered version ke khilaaf compare karke, ki kya pruning condition abhi bhi sahi nateeje banaata hai.',
        hint: 'Construct a specific example where a negative number later in the array would bring an already-exceeded running sum back down to exactly the target.',
        hintHi: 'Ek khaas example banaao jahan array mein baad mein ek negative number ek pehle-se-aage-nikal-chuke chalte sum ko bilkul target tak wapas laata hai.',
      },
      {
        task: 'Write a one-paragraph explanation, in your own words, of how the N-Queens pruning principle from this lesson\'s content section connects to the sum-pruning example this lesson opened with, identifying the specific analogous role each plays.',
        taskHi: 'Ek paragraph mein, apne khud ke shabdon mein, samjhaao ki is lesson ke content section ka N-Queens pruning siddhaant is lesson ne shuru mein khole gaye sum-pruning example se kaise judta hai, har ek jo khaas samaan bhoomika nibhaata hai use pehchaante hue.',
        hint: 'Focus on what "checking before recursing further" means concretely in each of the two problems, even though the specific constraint being checked is completely different.',
        hintHi: 'Is baat par focus karo ki "aur recurse karne se pehle check karna" dono problems mein se har ek mein thos roop se kya matlab rakhta hai, chahe check ki jaa rahi khaas constraint poori tarah alag ho.',
      },
    ],

    keyTakeaways: [
      'Generating a complete result and filtering it afterward is genuinely correct, but wastes effort fully constructing branches whose constraint was already provably violated partway through.',
      'Checking a constraint during exploration and abandoning (pruning) a branch the instant it becomes impossible produces identical correct results while skipping that wasted work.',
      'Pruning correctness depends on the constraint being unable to recover once violated — for a sum with only non-negative numbers, an exceeded sum can never come back down, making the branch provably doomed.',
      'The same pruning condition applied to a problem where the assumption does not hold (e.g. negative numbers allowed) would incorrectly discard valid solutions — pruning conditions are problem-specific, not universal.',
      'N-Queens-style constraint satisfaction relies on this exact same principle: checking whether a new placement conflicts with existing choices before recursing further, rather than placing everything and checking afterward.',
      'Generate-then-filter and prune-during-exploration examine the identical underlying decision tree from this module\'s previous lesson — they differ only in when the constraint is checked, not in what answers are found.',
    ],
    keyTakeawaysHi: [
      'Ek poora nateeja banaana aur baad mein ise filter karna sach mein sahi hai, par un branches ko poori tarah banaane mein koshish barbaad karta hai jinki constraint pehle hi beech mein provably violate ho chuki thi.',
      'Exploration ke dauraan ek constraint check karna aur ek branch ko us pal chhodna (prune karna) jab ye namumkin ban jaati hai identical sahi nateeje banaata hai us barbaad kaam ko skip karte hue.',
      'Pruning ki sahihata is baat par nirbhar karti hai ki constraint ek baar violate hone par recover na kar sake — sirf non-negative numbers waale ek sum ke liye, ek aage-nikal-chuka sum kabhi wapas neeche nahi aa sakta, branch ko provably barbaad banaate hue.',
      'Wahi pruning condition ek aisi problem par lagu ki gayi jahan dhaarna nahi tikti (jaisa negative numbers ki anumati) galti se valid solutions discard karegi — pruning conditions problem-khaas hain, universal nahi.',
      'N-Queens-style constraint satisfaction bilkul isi siddhaant par nirbhar karta hai: check karna ki kya ek naya placement maujood chunaavon se takraata hai aur aage recurse karne se pehle, sab kuch rakhne aur baad mein check karne ke bajaye.',
      'Generate-then-filter aur prune-during-exploration is module ke pehle wale lesson ke identical underlying decision tree ko examine karte hain — wo sirf isme alag hain ki constraint kab check ki jaati hai, kaunse jawaab milte hain usme nahi.',
    ],
  },
];
