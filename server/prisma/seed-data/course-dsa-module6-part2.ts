/**
 * DSA Complete Course — Module 6: Recursion & Backtracking, lesson 2.
 *
 * Backtracking fundamentals, using "generate all subsets" as the
 * running example, and directly applying this module's previous lesson
 * on before/after-the-call ordering. Broken example: generating all
 * subsets of an array using a fixed, hardcoded number of nested loops —
 * this genuinely works, but only for an array of exactly the number of
 * elements the code was hand-written for; it does not generalize to an
 * array of unknown or varying length at all. Fixed with recursive
 * backtracking: for each element, explicitly make a choice (include it
 * or not), recurse into the rest of the decision with that choice in
 * effect, and then explicitly undo the choice once that branch of
 * exploration is exhausted — the "make a choice before the call, undo
 * it after the call" structure this module's first lesson previewed,
 * now applied to build a genuine exploration-of-all-possibilities
 * algorithm rather than just controlling print order.
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

export const DSA_MODULE_6_PART2: CourseLesson[] = [
  {
    slug: 'backtracking-fundamentals-subsets',
    title: 'Backtracking Fundamentals: Generating All Subsets',
    titleHi: 'Backtracking Ki Buniyaad: Sab Subsets Banaana',
    description: 'Generating every possible subset of a 3-item array with three hand-nested loops works perfectly — until the array has 4 items, or 10, or an unknown number decided at runtime, at which point the hardcoded, fixed-depth loop structure simply cannot express the problem at all.',
    descriptionHi: 'Ek 3-item array ke har sambhaavit subset ko teen haath-se-nested loops se banaana poori tarah kaam karta hai — jab tak array mein 4 items na hon, ya 10, ya runtime par tay ki gayi ek anjaan tadaad, us bindu par hardcoded, fixed-depth loop structure problem ko bilkul express nahi kar sakta.',
    difficulty: 'HARD',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A locksmith who has memorized the exact hand motion for opening a lock with precisely 3 tumblers, a completely different, separately memorized hand motion for a lock with 4 tumblers, and would need to memorize an entirely new motion for every different number of tumblers that might exist — versus a locksmith who has learned a single, general TECHNIQUE: try each tumbler in either its up or down position, and for whatever remains, repeat this same technique on however many tumblers are left, undoing a choice and trying the other position whenever a path does not lead anywhere useful.** The memorize-a-motion-per-lock locksmith is completely stuck the moment an unfamiliar lock with an unexpected number of tumblers appears — no motion was ever memorized for that specific case, and nothing about the memorized motions transfers to it. The general-technique locksmith is never stuck this way: the same underlying technique — try one tumbler\'s two positions, then recurse on the rest, undoing and retrying as needed — applies identically whether the lock has 3 tumblers, 4, or 40, since the technique itself never assumed any specific number in the first place. Three hardcoded nested loops, one for each of exactly 3 array elements, is the memorize-a-motion-per-lock locksmith: it works, but only for arrays of exactly that one length. A recursive backtracking approach — for each element, choose to include it or not, recurse into the rest of the decision, then undo the choice — is the general-technique locksmith: the same code correctly handles an array of any length at all, since nothing about it assumes a specific number of elements in advance.',
      hi: '**Ek locksmith jisne bilkul 3 tumblers waale ek lock ko kholne ke liye bilkul haath ki chaal yaad ki hai, 4 tumblers waale ek lock ke liye ek bilkul alag, alag se yaad ki gayi haath ki chaal, aur har alag tadaad ke tumblers ke liye ek bilkul nayi chaal yaad karni padegi jo sambhaavit roop se maujood ho sakte hain — versus ek locksmith jisne ek akeli, general TECHNIQUE seekhi hai: har tumbler ko iski up ya down position mein try karo, aur jo bhi bacha hai uske liye, jitne bhi tumblers bache hain unpar wahi technique dohraao, jab bhi ek raasta kahin upyogi nahi le jaata ek chunaav wapas leke aur doosri position try karte hue.** Prati-lock-ek-chaal-yaad-karne-waala locksmith poori tarah phasa hai jis pal ek anjaan lock ek anpekshit tadaad ke tumblers ke saath dikhta hai — us khaas case ke liye koi chaal kabhi yaad nahi ki gayi, aur yaad ki gayi chaalon ke baare mein kuch bhi ismein transfer nahi hota. General-technique locksmith kabhi is tarike se phasa nahi hai: wahi underlying technique — ek tumbler ki do positions try karo, phir baaki par recurse karo, zaroorat padne par wapas lete hue aur dobara try karte hue — samaan roop se lagu hoti hai chahe lock mein 3 tumblers ho, 4, ya 40, kyunki technique khud ne shuru mein kabhi koi khaas tadaad maani hi nahi. Teen hardcoded nested loops, ek bilkul 3 array elements mein se har ek ke liye, prati-lock-ek-chaal-yaad-karne-waala locksmith hai: ye kaam karta hai, par sirf us ek lambaayi ke arrays ke liye. Ek recursive backtracking approach — har element ke liye, ise shaamil karne ya na karne ka chunaav karo, decision ke baaki hisse mein recurse karo, phir chunaav wapas lo — general-technique locksmith hai: wahi code kisi bhi lambaayi ke array ko sahi tarike se handle karta hai, kyunki iske baare mein kuch bhi pehle se ek khaas tadaad ke elements maanta nahi.',
    },

    simple: `**Start broken.** Hardcoded nested loops, working only for arrays of exactly 3 elements:

\`\`\`js
function allSubsetsOfThree(arr) {
  const subsets = [];
  for (let a = 0; a <= 1; a++) {       // include arr[0]? yes or no
    for (let b = 0; b <= 1; b++) {     // include arr[1]? yes or no
      for (let c = 0; c <= 1; c++) {   // include arr[2]? yes or no
        const subset = [];
        if (a) subset.push(arr[0]);
        if (b) subset.push(arr[1]);
        if (c) subset.push(arr[2]);
        subsets.push(subset);
      }
    }
  }
  return subsets;
}
\`\`\`

This genuinely produces all 8 subsets of a 3-element array — one nested loop per element, each choosing whether that specific element is included. The problem is structural: this code has exactly 3 nested loops because it was hand-written for exactly 3 elements. Given a 4-element array, this function simply cannot produce the correct answer at all — it would need a 4th nested loop, hardcoded again, and a 10-element array would need 10, and an array whose length is not even known until the program runs cannot be handled by this approach in any form.

**The fix: recursive backtracking — choose, recurse, then undo**

\`\`\`js
function allSubsets(arr) {
  const subsets = [];
  const current = [];

  function backtrack(index) {
    if (index === arr.length) {
      subsets.push([...current]); // a complete subset — record a COPY
      return;
    }
    current.push(arr[index]);   // CHOOSE to include arr[index]
    backtrack(index + 1);       // recurse with that choice in effect
    current.pop();              // UNDO the choice — try excluding it instead
    backtrack(index + 1);       // recurse with arr[index] excluded
  }

  backtrack(0);
  return subsets;
}
\`\`\`

\`\`\`ts
function allSubsets<T>(arr: T[]): T[][] {
  const subsets: T[][] = [];
  const current: T[] = [];

  function backtrack(index: number): void {
    if (index === arr.length) {
      subsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }

  backtrack(0);
  return subsets;
}
\`\`\`

This is exactly this module\'s previous lesson\'s ordering rule, applied to build a genuine algorithm: \`current.push(arr[index])\` runs BEFORE the recursive call, making a choice; the recursive call explores everything that follows GIVEN that choice; \`current.pop()\` runs AFTER, undoing the choice, so the very next line can explore the opposite choice (excluding \`arr[index]\`) starting from the exact same state everything else was in before the first choice was made. Nothing here assumes any specific array length — \`arr.length\` is checked directly, and the same recursive structure correctly handles an array of 3, 4, 10, or any other length, with the recursion depth adjusting automatically.`,

    simpleHi: `**Toote hue se shuru.** Hardcoded nested loops, sirf bilkul 3 elements waale arrays ke liye kaam karte hue:

\`\`\`js
function allSubsetsOfThree(arr) {
  const subsets = [];
  for (let a = 0; a <= 1; a++) {       // arr[0] shaamil karo? haan ya nahi
    for (let b = 0; b <= 1; b++) {     // arr[1] shaamil karo? haan ya nahi
      for (let c = 0; c <= 1; c++) {   // arr[2] shaamil karo? haan ya nahi
        const subset = [];
        if (a) subset.push(arr[0]);
        if (b) subset.push(arr[1]);
        if (c) subset.push(arr[2]);
        subsets.push(subset);
      }
    }
  }
  return subsets;
}
\`\`\`

Ye sach mein ek 3-element array ke sab 8 subsets banaata hai — prati-element ek nested loop, har ek ye chunte hue ki us khaas element ko shaamil karna hai ya nahi. Samasya structural hai: is code mein bilkul 3 nested loops hain kyunki ye bilkul 3 elements ke liye haath se likha gaya tha. Ek 4-element array diya gaya, ye function bilkul sahi jawaab banaa hi nahi sakta — ise ek 4th nested loop chahiye hoga, dobara hardcoded, aur ek 10-element array ko 10 chahiye honge, aur ek array jiski lambaayi program chalne tak jaani bhi nahi jaati is approach se kisi bhi roop mein handle nahi ki jaa sakti.

**Fix: recursive backtracking — chuno, recurse karo, phir wapas lo**

\`\`\`js
function allSubsets(arr) {
  const subsets = [];
  const current = [];

  function backtrack(index) {
    if (index === arr.length) {
      subsets.push([...current]); // ek poora subset — ek COPY record karo
      return;
    }
    current.push(arr[index]);   // arr[index] shaamil karne ka CHUNAAV karo
    backtrack(index + 1);       // us chunaav ke saath recurse karo
    current.pop();              // chunaav WAPAS LO — ise exclude karne ki koshish karo
    backtrack(index + 1);       // arr[index] exclude kiya gaya ke saath recurse karo
  }

  backtrack(0);
  return subsets;
}
\`\`\`

\`\`\`ts
function allSubsets<T>(arr: T[]): T[][] {
  const subsets: T[][] = [];
  const current: T[] = [];

  function backtrack(index: number): void {
    if (index === arr.length) {
      subsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }

  backtrack(0);
  return subsets;
}
\`\`\`

Ye bilkul is module ke pehle wale lesson ka ordering rule hai, ek asli algorithm banaane ke liye lagu kiya gaya: \`current.push(arr[index])\` recursive call SE PEHLE chalta hai, ek chunaav karte hue; recursive call us chunaav ko dekhte hue har us cheez ko explore karti hai jo baad mein aati hai; \`current.pop()\` BAAD mein chalta hai, chunaav wapas lete hue, taaki bilkul agli line ulta chunaav explore kar sake (\`arr[index]\` ko exclude karte hue) bilkul usi state se shuru hote hue jismein baaki sab kuch pehle chunaav se pehle tha. Yahaan kuch bhi kisi khaas array lambaayi ko maanta nahi — \`arr.length\` seedhe check ki jaati hai, aur wahi recursive structure 3, 4, 10, ya kisi bhi doosri lambaayi ke array ko sahi tarike se handle karta hai, recursion depth khud-ba-khud adjust hote hue.`,

    content: `## Tracing through allSubsets([1, 2]) to see choose/recurse/undo directly

\`\`\`
backtrack(0), current = []
  push 1 → current = [1]
  backtrack(1), current = [1]
    push 2 → current = [1, 2]
    backtrack(2) → index === length → RECORD [1, 2]
    pop 2 → current = [1]
    backtrack(2) → index === length → RECORD [1]  (2 was excluded)
  pop 1 → current = []
  backtrack(1), current = []
    push 2 → current = [2]
    backtrack(2) → RECORD [2]
    pop 2 → current = []
    backtrack(2) → RECORD []  (both excluded)

Final subsets: [1,2], [1], [2], []
\`\`\`

Tracing through this small example by hand, one line at a time — the exact habit this course\'s Module 1 problem-solving-framework lesson established — makes the choose/recurse/undo mechanic concrete rather than something to take on faith. Every single path through this tree of choices corresponds to one specific combination of "included" or "excluded" decisions for each element, and because both the include-branch and exclude-branch are explored for every element, all \`2ⁿ\` possible subsets are eventually generated, with \`current\` correctly reflecting the actual state of choices made so far at every single point during the exploration.

## Why undoing the choice (current.pop()) is not optional

\`\`\`js
current.push(arr[index]);
backtrack(index + 1); // explores everything with arr[index] INCLUDED
// without current.pop() here, the next line would incorrectly still
// have arr[index] sitting in current when exploring the EXCLUDE branch
current.pop(); // REQUIRED — restores current to its state before this choice
backtrack(index + 1); // explores everything with arr[index] EXCLUDED
\`\`\`

\`current\` is a single, shared array being mutated throughout the entire exploration, not a fresh copy created for each branch. If \`current.pop()\` were omitted, the code exploring the "exclude \`arr[index]\`" branch would incorrectly still find \`arr[index]\` sitting in \`current\` from the previous branch\'s choice, producing subsets that do not actually correspond to the decisions genuinely being explored at that point. This is precisely why \`subsets.push([...current])\`, when a complete subset is recorded, copies \`current\`\'s contents into a brand-new array rather than pushing a reference to \`current\` itself — \`current\` continues being mutated by later backtracking, so a plain reference to it would end up reflecting whatever \`current\` looks like at the very end of the entire process, not what it looked like at the specific moment that particular subset was recorded.

## Recognizing when backtracking applies

\`\`\`
Signal: the problem asks for ALL possible combinations, arrangements,
        or selections satisfying some criteria — not the count of
        them, not just one example, but literally enumerating every one
\`\`\`

Backtracking\'s signal is a problem asking to genuinely enumerate every possibility — every subset, every permutation, every valid arrangement — rather than count them, find the best one by some measure, or simply confirm one exists. This course\'s next lesson builds directly on this one, applying the exact same choose/recurse/undo mechanic to a related but genuinely different problem (generating permutations rather than subsets), and the lesson after that adds a further refinement — pruning invalid choices early, rather than exploring every branch fully before discovering it was invalid — to keep this fundamentally exponential exploration from doing more work than a specific problem actually requires.`,

    contentHi: `## \`allSubsets([1, 2])\` ko trace karke choose/recurse/undo seedhe dekhna

\`\`\`
backtrack(0), current = []
  push 1 → current = [1]
  backtrack(1), current = [1]
    push 2 → current = [1, 2]
    backtrack(2) → index === length → RECORD [1, 2]
    pop 2 → current = [1]
    backtrack(2) → index === length → RECORD [1]  (2 exclude kiya gaya)
  pop 1 → current = []
  backtrack(1), current = []
    push 2 → current = [2]
    backtrack(2) → RECORD [2]
    pop 2 → current = []
    backtrack(2) → RECORD []  (dono exclude kiye gaye)

Aakhri subsets: [1,2], [1], [2], []
\`\`\`

Is chhote example ko haath se trace karna, ek waqt mein ek line — bilkul wahi aadat jise is course ke Module 1 problem-solving-framework lesson ne sthaapit kiya — choose/recurse/undo mechanic ko thos banaata hai bharose par lene ke bajaye. Chunaavon ke is tree ke through har akela raasta har element ke liye "included" ya "excluded" faislon ke ek khaas combination se mel khaata hai, aur kyunki include-branch aur exclude-branch dono har element ke liye explore ki jaati hain, sab \`2ⁿ\` sambhaavit subsets aakhirkaar banaaye jaate hain, \`current\` sahi tarike se abhi tak kiye gaye chunaavon ki asli state darsaate hue exploration ke dauraan har akele bindu par.

## Chunaav wapas lena (\`current.pop()\`) vaikalpik kyun nahi hai

\`\`\`js
current.push(arr[index]);
backtrack(index + 1); // arr[index] SHAAMIL ke saath sab kuch explore karta hai
// yahaan current.pop() ke bina, agli line galti se abhi bhi
// arr[index] ko current mein rakhegi jab EXCLUDE branch explore karti hai
current.pop(); // ZARURI — current ko is chunaav se pehle ki state mein restore karta hai
backtrack(index + 1); // arr[index] EXCLUDED ke saath sab kuch explore karta hai
\`\`\`

\`current\` ek akela, shared array hai jo poori exploration mein mutate kiya jaa raha hai, har branch ke liye banaayi gayi ek taazi copy nahi. Agar \`current.pop()\` chhoda jaata, "\`arr[index]\` exclude karo" branch explore karta code galti se abhi bhi \`current\` mein \`arr[index]\` baithi hui paata pichli branch ke chunaav se, aise subsets banaate hue jo asal mein us bindu par sach mein explore ki jaa rahi faislon se mel nahi khaate. Yahi bilkul wajah hai ki \`subsets.push([...current])\`, jab ek poora subset record kiya jaata hai, \`current\` ki contents ko ek bilkul-naye array mein copy karta hai \`current\` khud ke ek reference ko push karne ke bajaye — \`current\` baad ki backtracking dwara mutate hota rehta hai, isliye iska ek saadha reference aakhirkaar poori process ke bilkul ant mein \`current\` kaisa dikhta hai use darsaayega, us khaas pal par ye kaisa dikhta tha jab wo khaas subset record kiya gaya tha use nahi.

## Pehchaanna ki backtracking kab lagu hoti hai

\`\`\`
Signal: problem SAB sambhaavit combinations, arrangements, ya
        selections maangta hai kuch criteria ko poora karte hue —
        unki count nahi, sirf ek udaharan nahi, balki shaabdik roop se
        har akele ko enumerate karna
\`\`\`

Backtracking ka signal ek problem hai jo sach mein har sambhaavna ko enumerate karne ko poochti hai — har subset, har permutation, har valid arrangement — unhe ganne, kisi maape se sabse achha dhoondhne, ya simply ek maujood hai confirm karne ke bajaye. Is course ka agla lesson seedhe isi par banaata hai, bilkul usi choose/recurse/undo mechanic ko ek judi par sach mein alag problem par lagu karte hue (subsets ke bajaye permutations banaana), aur uske baad ka lesson ek aur refinement jodta hai — invalid chunaavon ko jaldi prune karna, poori tarah har branch explore karne ke bajaye ise invalid maloom hone se pehle — is buniyaadi roop se exponential exploration ko ek khaas problem ko asal mein zaruri kaam se zyaada karne se rokne ke liye.`,

    examples: [
      {
        title: 'Broken: hardcoded nested loops, only for exactly 3 elements',
        titleHi: 'Toota: hardcoded nested loops, sirf bilkul 3 elements ke liye',
        code: `for (let a = 0; a <= 1; a++) {
  for (let b = 0; b <= 1; b++) {
    for (let c = 0; c <= 1; c++) { /* build one subset */ }
  }
}`,
        codeJs: `function allSubsetsOfThree(arr) {
  const subsets = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      for (let c = 0; c <= 1; c++) {
        const subset = [];
        if (a) subset.push(arr[0]);
        if (b) subset.push(arr[1]);
        if (c) subset.push(arr[2]);
        subsets.push(subset);
      }
    }
  }
  return subsets;
}
// only correctly handles arrays of exactly length 3`,
        codeTs: `function allSubsetsOfThree<T>(arr: [T, T, T]): T[][] {
  const subsets: T[][] = [];
  for (let a = 0; a <= 1; a++) {
    for (let b = 0; b <= 1; b++) {
      for (let c = 0; c <= 1; c++) {
        const subset: T[] = [];
        if (a) subset.push(arr[0]);
        if (b) subset.push(arr[1]);
        if (c) subset.push(arr[2]);
        subsets.push(subset);
      }
    }
  }
  return subsets;
}
// TypeScript's own tuple type [T, T, T] confirms this only accepts
// arrays of exactly 3 elements — the limitation is enforced at compile time`,
        output: `allSubsetsOfThree([1, 2, 3]) correctly produces all 8 subsets, but
there is no way to call this function with a 4-element array at all.`,
        explain: 'Each nested loop was hand-written for one specific array position — the code structure itself has no way to express "however many elements there happen to be".',
        explainHi: 'Har nested loop ek khaas array position ke liye haath se likhi gayi thi — code structure mein khud "jitne bhi elements samyog se hain" express karne ka koi tarika nahi hai.',
      },
      {
        title: 'Fixed: recursive backtracking, generalizing to any array length',
        titleHi: 'Theek: recursive backtracking, kisi bhi array lambaayi tak generalize karte hue',
        code: `current.push(arr[index]);
backtrack(index + 1);
current.pop();
backtrack(index + 1);`,
        codeJs: `function allSubsets(arr) {
  const subsets = [];
  const current = [];
  function backtrack(index) {
    if (index === arr.length) {
      subsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }
  backtrack(0);
  return subsets;
}`,
        codeTs: `function allSubsets<T>(arr: T[]): T[][] {
  const subsets: T[][] = [];
  const current: T[] = [];
  function backtrack(index: number): void {
    if (index === arr.length) {
      subsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    backtrack(index + 1);
    current.pop();
    backtrack(index + 1);
  }
  backtrack(0);
  return subsets;
}`,
        outputJs: `allSubsets([1, 2, 3]) produces the identical 8 subsets, and
allSubsets([1, 2, 3, 4]) correctly produces all 16 — the same code
handles both without any modification.`,
        outputTs: `// Identical behaviour, fully typed with a generic T.`,
        explain: 'The recursion depth adjusts automatically to arr.length, so the same code correctly handles arrays of any length rather than one hardcoded size.',
        explainHi: 'Recursion depth khud-ba-khud \`arr.length\` ke anusaar adjust hoti hai, isliye wahi code kisi bhi lambaayi ke arrays ko sahi tarike se handle karta hai ek hardcoded size ke bajaye.',
      },
      {
        title: 'Tracing the choose/recurse/undo cycle for a 2-element array',
        titleHi: 'Ek 2-element array ke liye choose/recurse/undo cycle trace karna',
        code: `// backtrack(0): push 1, recurse, pop 1, recurse
// each recursive call explores one more element the same way`,
        codeJs: `function allSubsetsLogged(arr) {
  const subsets = [];
  const current = [];
  function backtrack(index) {
    if (index === arr.length) {
      console.log("recorded:", [...current]);
      subsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    console.log("chose to include", arr[index], "-> current:", [...current]);
    backtrack(index + 1);
    current.pop();
    console.log("undid choice, excluding", arr[index], "-> current:", [...current]);
    backtrack(index + 1);
  }
  backtrack(0);
  return subsets;
}
allSubsetsLogged([1, 2]);`,
        codeTs: `function allSubsetsLogged<T>(arr: T[]): T[][] {
  const subsets: T[][] = [];
  const current: T[] = [];
  function backtrack(index: number): void {
    if (index === arr.length) {
      console.log("recorded:", [...current]);
      subsets.push([...current]);
      return;
    }
    current.push(arr[index]);
    console.log("chose to include", arr[index], "-> current:", [...current]);
    backtrack(index + 1);
    current.pop();
    console.log("undid choice, excluding", arr[index], "-> current:", [...current]);
    backtrack(index + 1);
  }
  backtrack(0);
  return subsets;
}`,
        outputJs: `The logged output shows exactly the choose/recurse/undo sequence
this lesson's content section traced by hand, confirming it directly
rather than requiring it be taken on faith.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Logging each choice and undo directly confirms the trace this lesson\'s content section walked through by hand.',
        explainHi: 'Har chunaav aur undo ko log karna seedhe us trace ko confirm karta hai jise is lesson ke content section ne haath se kiya.',
      },
    ],

    mistakes: [
      {
        wrong: `for (let a = 0; a <= 1; a++) {
  for (let b = 0; b <= 1; b++) { /* only works for exactly 2 elements */ }
}`,
        right: `function backtrack(index) {
  if (index === arr.length) { /* record */ return; }
  /* choose, recurse, undo, recurse */
}
// generalizes to any array length`,
        why: 'A fixed number of hardcoded nested loops cannot express "however many elements exist" — it only works for the one specific length it was hand-written for.',
        whyHi: 'Hardcoded nested loops ki ek fixed tadaad "jitne bhi elements maujood hain" express nahi kar sakti — ye sirf us ek khaas lambaayi ke liye kaam karta hai jiske liye ye haath se likha gaya tha.',
      },
      {
        wrong: `current.push(arr[index]);
backtrack(index + 1);
backtrack(index + 1); // MISSING current.pop() — the exclude branch
// incorrectly still has arr[index] sitting in current`,
        right: `current.push(arr[index]);
backtrack(index + 1);
current.pop(); // REQUIRED before exploring the exclude branch
backtrack(index + 1);`,
        why: 'Omitting the undo step leaves current in the wrong state for the next branch of exploration, since current is a single shared array being mutated throughout, not a fresh copy per branch.',
        whyHi: 'Undo step chhodna \`current\` ko exploration ki agli branch ke liye galat state mein chhodta hai, kyunki \`current\` ek akela shared array hai jo poori tarah mutate ho raha hai, prati-branch ek taazi copy nahi.',
      },
      {
        wrong: `subsets.push(current); // pushing a REFERENCE to the shared array
// current continues being mutated afterward, corrupting this "recorded" subset`,
        right: `subsets.push([...current]); // pushing a COPY, frozen at this exact moment`,
        why: 'Pushing a reference to the shared current array means later mutations to current retroactively change subsets that were already recorded — a copy is needed to freeze that subset\'s state.',
        whyHi: 'Shared \`current\` array ka ek reference push karna matlab hai \`current\` mein baad ki mutations un subsets ko retroactively badalti hain jo pehle se record ki gayi thi — us subset ki state ko freeze karne ke liye ek copy chahiye.',
      },
    ],

    realWorld: [
      {
        en: '**"Subsets" and "Subsets II" are among the most commonly cited practice problems specifically chosen to teach the backtracking pattern this lesson establishes.**',
        hi: '**"Subsets" aur "Subsets II" un practice problems mein sabse aam taur par cite ki jaane waali hain jo khaas taur par backtracking pattern sikhaane ke liye chuni gayi hain jise ye lesson sthaapit karta hai.**',
      },
      {
        en: '**Configuration and feature-flag systems that need to enumerate every possible combination of settings genuinely use this exact choose/recurse/undo structure**, not merely as an academic exercise.',
        hi: '**Configuration aur feature-flag systems jinhe settings ke har sambhaavit combination ko enumerate karna hai sach mein bilkul is choose/recurse/undo structure ka istemal karte hain**, sirf ek academic exercise ki tarah nahi.',
      },
      {
        en: '**"Would this generalize to n elements, or only the specific example you were given?" is a genuinely common interviewer follow-up**, specifically testing for the exact hardcoded-loop mistake this lesson opened with.',
        hi: '**"Kya ye n elements tak generalize hoga, ya sirf us khaas example tak jo tumhe diya gaya tha?" ek sach mein aam interviewer follow-up hai**, khaas taur par us bilkul hardcoded-loop galti ke liye test karte hue jise is lesson ne shuru mein khola.',
      },
    ],

    interviewQA: [
      {
        q: 'Why can a fixed number of hardcoded nested loops not be adapted to work for an array of arbitrary length, and why does recursion solve this specific limitation?',
        qHi: 'Hardcoded nested loops ki ek fixed tadaad ko manmaani lambaayi ke ek array ke liye kaam karne ke liye adapt kyun nahi kiya jaa sakta, aur recursion is khaas limitation ko kaise sulajhaata hai?',
        a: 'A nested loop structure written with a specific, fixed number of loops has that exact number baked directly into the source code itself at the time the code is written — three nested for loops exist as three literal, separate blocks of code in the file, each hardcoded to handle one specific array position (arr[0], arr[1], arr[2]). This number cannot change based on what happens at runtime, because it is not a value being computed or varied during execution; it is a structural property of the code\'s own text, fixed permanently once the code is written and compiled or interpreted. An array with a different number of elements than the code was written for cannot be handled at all by this structure, since there is no fourth loop present to handle a fourth element, and no mechanism by which the code could add one to itself while running. Recursion solves this specific limitation by replacing a fixed number of separately-written loop blocks with a single block of code that calls itself, once per element, for however many elements actually exist, determined by checking a runtime value (arr.length) rather than being hardcoded into the number of loops present in the source. Each recursive call handles exactly one additional element and then decides, by checking that same runtime length value again, whether to make one more recursive call or to stop — meaning the actual number of "loop iterations" that occur, in the loose sense of one recursive call being analogous to one loop iteration, is determined dynamically by the input\'s own actual length at the moment the function runs, rather than being fixed permanently by how many loop blocks happen to be written in the source code.',
        aHi: 'Ek nested loop structure jo loops ki ek khaas, fixed tadaad ke saath likhi gayi hai us bilkul tadaad ko code likhe jaane ke waqt seedhe source code mein hi baaka hui rakhti hai — teen nested \`for\` loops file mein teen shaabdik, alag blocks ki tarah maujood hain, har ek ek khaas array position (\`arr[0]\`, \`arr[1]\`, \`arr[2]\`) handle karne ke liye hardcoded. Ye tadaad runtime par kya hota hai us par nirbhar badal nahi sakti, kyunki ye execution ke dauraan gani ya badli jaane waali koi value nahi hai; ye code ke apne text ki ek structural property hai, hamesha ke liye fixed ek baar code likha aur compile ya interpret ho jaaye. Ek array jismein code jitne elements ke liye likha gaya us se alag tadaad ke elements hain is structure dwara bilkul handle nahi ki jaa sakti, kyunki ek chauthe element ko handle karne ke liye koi chautha loop maujood nahi hai, aur koi mechanism nahi hai jispar code chalte-chalte khud mein ek jod sake. Recursion is khaas limitation ko sulajhaata hai loop blocks ki ek fixed tadaad ko jo alag-alag likhe gaye the ek akele code block se badalkar jo khud ko bulaata hai, prati-element ek baar, jitne bhi elements asal mein maujood hain, ek runtime value (\`arr.length\`) check karke tay kiya gaya na ki source mein maujood loops ki tadaad mein hardcoded. Har recursive call bilkul ek atirikt element handle karta hai aur phir tay karta hai, wahi runtime length value dobara check karke, ki kya ek aur recursive call karni hai ya rukna hai — matlab jo loop iterations hote hain unki asli tadaad, dheele arth mein ki ek recursive call ek loop iteration ke samaan hai, dynamically input ki apni asli lambaayi dwara tay ki jaati hai jab function chalta hai, hamesha ke liye is baat se fixed hone ke bajaye ki source code mein kitne loop blocks samyog se likhe gaye hain.',
      },
      {
        q: 'Why is it critical to push a copy of the current array (using [...current]) rather than a direct reference when recording a completed subset, and what would go wrong otherwise?',
        qHi: 'Ek poore subset ko record karte waqt current array ki ek copy push karna (\`[...current]\` istemal karke) ek seedhe reference ke bajaye critical kyun hai, aur anyatha kya galat hoga?',
        a: 'Throughout the entire backtracking process, there is only ever one single array, current, that is being repeatedly modified in place as the exploration proceeds — elements are pushed onto it when a choice to include something is made, and popped off it when that choice is later undone, with the same underlying array object being reused and mutated continuously for the entire duration of the algorithm\'s execution, rather than a new array being created for each distinct branch of exploration. If subsets.push(current) were used to record a completed subset, this would not copy current\'s contents at that moment into a new, independent array — it would instead store a reference pointing at that same single, ongoing current array, meaning the entry just added to subsets is not a snapshot of what current looked like at that instant, but rather a pointer to an array that will continue to be modified by every subsequent step of the algorithm. Once the backtracking process moves on to explore further branches, popping and pushing elements onto this same current array as it goes, every previously "recorded" entry in subsets that was actually just a reference to this same array would appear to change right along with it, since they are all, in reality, the exact same underlying array object being viewed through multiple references — by the time the entire algorithm finishes, every single entry in subsets would incorrectly show whatever current\'s very final state happened to be, rather than the genuinely different subset that was supposedly recorded at each distinct point in the exploration. Using [...current] instead creates a brand-new array, with its own independent memory, containing a copy of whatever values current held at that exact moment — this new array is entirely unaffected by any later changes made to the original current array, correctly preserving a frozen, accurate snapshot of that specific subset exactly as it existed when it was recorded.',
        aHi: 'Poori backtracking process mein, kabhi sirf ek akela array hai, \`current\`, jo baar-baar apni jagah modify hota hai jaise exploration aage badhti hai — elements ismein push kiye jaate hain jab kuch shaamil karne ka chunaav kiya jaata hai, aur ismein se pop kiye jaate hain jab wo chunaav baad mein wapas liya jaata hai, wahi underlying array object algorithm ke poore execution ki avadhi ke liye lagaataar reuse aur mutate hote hue, exploration ki har alag branch ke liye ek naya array banaaye jaane ke bajaye. Agar \`subsets.push(current)\` ek poore subset ko record karne ke liye istemal kiya jaata, ye us pal \`current\` ki contents ko ek naye, azaad array mein copy nahi karega — ye iske bajaye ek reference store karega jo usi akele, chalte \`current\` array ki taraf point karta hai, matlab \`subsets\` mein abhi jodi gayi entry us pal \`current\` kaisa dikhta tha uska ek snapshot nahi hai, balki ek pointer hai ek aise array ki taraf jo algorithm ke har baad ke kadam dwara modify hota rahega. Ek baar backtracking process aage badhti hai aur zyaada branches explore karti hai, isi \`current\` array mein elements pop aur push karte hue jaise ye jaati hai, \`subsets\` mein har pehle-"recorded" entry jo asal mein bas isi array ka ek reference thi usi ke saath badalti hui dikhegi, kyunki wo sab, asal mein, bilkul wahi underlying array object hain kayi references ke zariye dekhe jaate hue — jab tak poora algorithm khatam hota hai, \`subsets\` mein har akeli entry galti se dikhaayegi jo bhi \`current\` ki bilkul aakhri state thi, us sach mein alag subset ke bajaye jo maana jaata hai exploration mein har alag bindu par record kiya gaya tha. Iske bajaye \`[...current]\` istemal karna ek bilkul-naya array banaata hai, apni azaad memory ke saath, jo bhi values \`current\` us bilkul pal rakhta tha unki ek copy rakhte hue — ye naya array baad mein asli \`current\` array mein kiye gaye kisi bhi badlaav se poori tarah unaffected hai, us khaas subset ka ek freeze kiya gaya, sahi snapshot sahi tarike se preserve karte hue bilkul jaisa ye maujood tha jab ye record kiya gaya tha.',
      },
    ],

    exercises: [
      {
        task: 'Build both the broken (hardcoded nested loops) and fixed (recursive backtracking) subset-generation functions from this lesson. Confirm the fixed version correctly produces all 16 subsets of a 4-element array, which the broken version cannot handle at all.',
        taskHi: 'Is lesson ke toote (hardcoded nested loops) aur theek (recursive backtracking) subset-banaane-waale functions dono banao. Confirm karo ki theek version 4-element array ke sab 16 subsets sahi tarike se banaata hai, jise toota version bilkul handle nahi kar sakta.',
        hint: 'Try calling the broken function with a 4-element array and observe exactly what goes wrong or what gets silently ignored.',
        hintHi: 'Toote function ko 4-element array ke saath bulaane ki koshish karo aur bilkul dekho ki kya galat hota hai ya kya chupchaap ignore ho jaata hai.',
      },
      {
        task: 'Build the logged version from this lesson\'s third example. Run it against a 3-element array and manually trace through the expected log output before running the code, following this course\'s Module 1 tracing habit.',
        taskHi: 'Is lesson ke teesre example se logged version banao. Ise ek 3-element array ke khilaaf chalaao aur code chalaane se pehle manually ummeed ki gayi log output ko trace karo, is course ke Module 1 tracing aadat ka palan karte hue.',
        hint: 'Write down the full sequence of "chose to include" and "undid choice" log lines you expect before running the code, then compare line by line.',
        hintHi: '"chose to include" aur "undid choice" log lines ki poori sequence likho jiski tumhe ummeed hai code chalaane se pehle, phir line-dar-line compare karo.',
      },
      {
        task: 'Deliberately remove the current.pop() call and run allSubsets([1, 2, 3]). Compare the incorrect output against the correct 8 subsets and identify specifically which subsets are wrong and why.',
        taskHi: 'Jaan-boojhkar \`current.pop()\` call hataao aur \`allSubsets([1, 2, 3])\` chalaao. Galat output ko sahi 8 subsets ke khilaaf compare karo aur pehchaano ki khaas taur par kaunse subsets galat hain aur kyun.',
        hint: 'Log current\'s contents at the exact moment each subset is recorded to see directly which earlier choices were never actually undone.',
        hintHi: 'Bilkul us pal \`current\` ki contents log karo jab har subset record kiya jaata hai seedhe dekhne ke liye ki kaunse pehle ke chunaav asal mein kabhi wapas liye hi nahi gaye.',
      },
    ],

    keyTakeaways: [
      'A fixed number of hardcoded nested loops only works for the one specific array length it was hand-written for, since that number is baked into the code\'s own structure rather than computed at runtime.',
      'Recursive backtracking generalizes to any array length by checking arr.length directly and recursing once per element, rather than hardcoding a separate loop per position.',
      'The choose/recurse/undo structure applies this module\'s previous lesson directly: making a choice runs before the recursive call, and undoing it runs after, so the next branch starts from a clean, correctly restored state.',
      'current is a single, shared, mutated array throughout the entire process — a completed subset must be recorded as a copy ([...current]), not a reference, or later mutations would corrupt it.',
      'Backtracking\'s signal is a problem asking to enumerate every possibility satisfying some criteria, not to count them or find a single best one.',
      'Tracing through a small example by hand — this course\'s Module 1 habit — makes the choose/recurse/undo mechanic concrete and directly confirms it rather than requiring it be taken on faith.',
    ],
    keyTakeawaysHi: [
      'Hardcoded nested loops ki ek fixed tadaad sirf us ek khaas array lambaayi ke liye kaam karti hai jiske liye ye haath se likhi gayi thi, kyunki wo tadaad code ki apni structure mein baaki hui hai runtime par gani jaane ke bajaye.',
      'Recursive backtracking kisi bhi array lambaayi tak generalize hoti hai \`arr.length\` ko seedhe check karke aur prati-element ek baar recurse karke, prati-position ek alag loop hardcode karne ke bajaye.',
      'Choose/recurse/undo structure is module ke pehle wale lesson ko seedhe lagu karta hai: ek chunaav karna recursive call se pehle chalta hai, aur ise wapas lena baad mein chalta hai, taaki agli branch ek saaf, sahi tarike se restore ki gayi state se shuru ho.',
      '\`current\` poori process mein ek akela, shared, mutated array hai — ek poora subset ek copy ki tarah record kiya jaana chahiye (\`[...current]\`), ek reference nahi, warna baad ki mutations ise corrupt kar dengi.',
      'Backtracking ka signal ek problem hai jo kuch criteria ko poora karte hue har sambhaavna ko enumerate karne ko poochti hai, unhe ganne ya ek akela sabse achha dhoondhne ko nahi.',
      'Ek chhote example ko haath se trace karna — is course ki Module 1 aadat — choose/recurse/undo mechanic ko thos banaata hai aur ise seedhe confirm karta hai bharose par lene ki zaroorat ke bajaye.',
    ],
  },
];
