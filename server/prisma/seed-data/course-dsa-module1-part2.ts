/**
 * DSA Complete Course — Module 1: Foundations, lesson 2.
 *
 * A concrete, repeatable problem-solving framework for approaching ANY
 * new DSA problem from a blank page — not a specific technique, but the
 * meta-process this course expects a learner to run before, during, and
 * after attempting every single problem in every later module. Broken
 * example: staring at a new problem and immediately trying to type out
 * a full, optimal solution from scratch, skipping straight from "read
 * the problem" to "write the final code" — which is exactly the point
 * at which most learners freeze, since there is no intermediate
 * scaffolding to think through. Fixed with a five-step framework
 * (Understand, Brute Force, Identify the Pattern, Optimize, Verify)
 * that turns "I have no idea where to start" into a concrete sequence
 * of smaller, answerable questions, using working with two raw numbers
 * (the most basic possible mechanical building block — reading input,
 * swapping two values, and tracing through a loop by hand) as the
 * running example so the framework itself, not any DSA-specific
 * knowledge, is what this lesson actually teaches.
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

export const DSA_MODULE_1_PART2: CourseLesson[] = [
  {
    slug: 'the-problem-solving-framework',
    title: 'The Problem-Solving Framework: From Blank Page to Working Code',
    titleHi: 'Problem-Solving Framework: Khaali Page Se Kaam Karte Code Tak',
    description: 'Given a brand-new problem, a learner reads it twice, understands it perfectly, and then simply freezes — not because the problem is unsolvable, but because "read the problem" and "write the optimal solution" are separated by several genuine thinking steps nobody ever taught them explicitly.',
    descriptionHi: 'Ek bilkul-nayi problem di jaane par, ek learner ise do baar padhta hai, isse poori tarah samajhta hai, aur phir bas jam jaata hai — is wajah se nahi ki problem sulajhaayi nahi jaa sakti, balki isliye kyunki "problem padho" aur "optimal solution likho" ke beech kayi asli sochne ke kadam hain jo kabhi kisi ne unhe explicitly sikhaaye hi nahi.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A cook handed a completely unfamiliar dish\'s name and told to just make it, versus a cook handed the same unfamiliar dish along with a reliable, repeatable process: read what the finished dish is actually supposed to taste like, make a rough, unpolished version using whatever technique comes to mind first, taste it and identify specifically what is wrong with it, refine the technique based on that specific problem, and then taste again to confirm it is actually right.** The first cook, staring at an unfamiliar dish\'s name alone, has no reliable path from "I don\'t know how to make this" to "here is the finished dish" — any attempt is either a lucky guess or a memorized recipe for that exact dish, and an unfamiliar dish with no memorized recipe leaves the cook stuck with nothing to do next. The second cook is never actually stuck, even facing a dish they have genuinely never made before, because "make a rough version, taste it, identify what\'s wrong, fix that specific thing, taste again" is a repeatable PROCESS that works regardless of which specific dish is in front of them — it turns "I have no idea what to do" into a sequence of small, always-answerable questions: what should this taste like, what does my rough attempt actually taste like right now, and what is the specific gap between those two things. Facing a brand-new DSA problem with nothing but "just write the optimal solution" as a goal is the first cook: freezing is the natural, expected response to a goal with no intermediate steps. This lesson\'s five-step framework — Understand, Brute Force, Identify the Pattern, Optimize, Verify — is the second cook\'s process, applied to code: it turns "I don\'t know where to start" into a sequence of specific, smaller, always-answerable questions that work on literally any problem, regardless of which pattern it later turns out to need.',
      hi: '**Ek cook jise ek bilkul anjaan dish ka naam diya gaya aur bas ise banaane ko kaha gaya, versus ek cook jise wahi anjaan dish di gayi ek bharosemand, dohraaye-jaane-yogya process ke saath: padho ki poori hui dish ko asal mein kaisa taste karna chahiye, jo bhi technique pehle dimaag mein aaye use istemal karke ek moti-moti, na-nikhaari version banaao, ise chakho aur khaas taur par pehchaano ki isme kya galat hai, us khaas samasya ke aadhaar par technique ko sudhaaro, aur phir dobara chakho ye confirm karne ke liye ki ye asal mein sahi hai.** Pehla cook, akele anjaan dish ke naam ko dekhte hue, "mujhe nahi pata ye kaise banaate hain" se "yeh raha poori hui dish" tak koi bharosemand raasta nahi rakhta — koi bhi koshish ya toh ek bhaagyashaali guess hai ya us bilkul dish ke liye ek yaad ki gayi recipe, aur ek anjaan dish jismein koi yaad ki gayi recipe nahi hai cook ko kuch bhi agla karne ke liye na hote hue phasa chhod deti hai. Doosra cook asal mein kabhi phasa nahi hai, ek aisi dish ke saamne bhi jo unhone sach mein kabhi nahi banaayi, kyunki "ek moti-moti version banaao, ise chakho, pehchaano kya galat hai, us khaas cheez ko theek karo, dobara chakho" ek dohraaye-jaane-yogya PROCESS hai jo kaam karta hai chahe koi bhi khaas dish unke saamne ho — ye "mujhe kuch nahi pata kya karna hai" ko chhote, hamesha-jawaab-di-jaa-sakne-waale sawaalon ki ek sequence mein badalta hai: isse kaisa taste karna chahiye, mera moti-moti koshish abhi asal mein kaisa taste kar rahi hai, aur un do cheezon ke beech khaas gap kya hai. Ek bilkul-nayi DSA problem ka saamna karna sirf "bas optimal solution likho" maksad ke saath pehla cook hai: jamna ek maksad ke liye swaabhaavik, ummeed ki gayi jawaab hai jismein koi beech ke kadam nahi hain. Is lesson ka paanch-kadam ka framework — Understand, Brute Force, Identify the Pattern, Optimize, Verify — doosre cook ka process hai, code par lagu kiya gaya: ye "mujhe nahi pata kahaan se shuru karoon" ko khaas, chhote, hamesha-jawaab-di-jaa-sakne-waale sawaalon ki ek sequence mein badalta hai jo bilkul kisi bhi problem par kaam karte hain, is baat se azaad ki baad mein kaunsa pattern chahiye pata chalta hai.',
    },

    simple: `**Start broken.** Skipping straight from "read the problem" to "write the final, optimal solution":

\`\`\`
Problem: "Given an array of numbers, find two numbers that add up to a target value."

Learner's process:
1. Read the problem.
2. ...try to immediately write the fastest possible solution.
3. Freeze. Where does an "optimal" approach even come from? What if the
   first idea that comes to mind isn't the fast one? Is there a trick
   I'm supposed to already know?
\`\`\`

This is the single most common reason a learner gets stuck on a problem that is not actually beyond their ability — the jump from "I understand what is being asked" straight to "I have written the fastest correct solution" skips several genuine, necessary thinking steps, and staring at that gap with nothing to fill it in is exactly what produces the feeling of being frozen. There is no rule that the first working solution has to be the fastest one, and there is no rule that a fast solution has to be found before a working one exists at all.

**The fix: a five-step framework that fills in the missing steps explicitly**

\`\`\`
1. UNDERSTAND     — restate the problem in your own words; work through
                     a small example completely by hand
2. BRUTE FORCE     — write the most obvious, even if slow, solution that
                     is genuinely correct — "correct but slow" beats
                     "no solution at all"
3. IDENTIFY THE PATTERN — ask: what is my brute force actually doing
                     repeatedly/wastefully that a known pattern or
                     data structure could avoid?
4. OPTIMIZE        — apply that pattern to remove the wasted work
5. VERIFY          — trace the optimized solution through the same
                     small example from step 1, by hand, line by line
\`\`\`

Applied to the two-sum problem above: **Understand** — given \`[2, 7, 11, 15]\` and target \`9\`, the answer is \`2 + 7\`, so the goal is finding a PAIR whose sum matches. **Brute force** — check every possible pair, one at a time, using two nested loops; this is slow for a huge array, but it is genuinely correct, and correct-but-slow is real, usable progress, not a failure. **Identify the pattern** — the brute force repeatedly asks "have I already seen the OTHER number this specific number needs to pair with?" — and "have I seen X before, and can I look that up instantly?" is exactly the question a hash map (Module 2 of this course) exists to answer cheaply. **Optimize** — instead of the second nested loop, check a hash map for whether \`target - currentNumber\` has already been seen, and if not, record the current number in that map for a future check to find. **Verify** — trace through \`[2, 7, 11, 15]\`, target \`9\`, by hand: see \`2\`, look for \`7\` in an empty map (not there), record \`2\`; see \`7\`, look for \`2\` in the map (found!), return \`[2, 7]\` — matches the expected answer from step 1. Every one of these five steps is a smaller, concrete, always-answerable question — none of them require already knowing the "trick" before starting.`,

    simpleHi: `**Toote hue se shuru.** "Problem padho" se seedhe "aakhri, optimal solution likho" tak kudna:

\`\`\`
Problem: "Numbers ka ek array diya gaya, do numbers dhoondho jo target value tak add karte hain."

Learner ka process:
1. Problem padho.
2. ...turant sabse tez sambhaavit solution likhne ki koshish karo.
3. Jam jaao. Ek "optimal" approach asal mein kahaan se aata hai? Agar
   pehla idea jo dimaag mein aata hai wo tez wala nahi hai toh? Kya
   koi trick hai jo mujhe pehle se jaani chahiye?
\`\`\`

Ye ek learner ke ek aisi problem par phasne ka sabse aam kaaran hai jo asal mein unki kshamta se aage nahi hai — "main samajhta hoon kya poocha jaa raha hai" se seedhe "maine sabse tez sahi solution likh li hai" tak jump kayi asli, zaruri sochne ke kadam chhodta hai, aur us gap ko kuch bhi bhare bina ghoorna bilkul wahi hai jo jame hone ka ehsaas paida karta hai. Koi rule nahi hai ki pehla kaam-karta solution sabse tez wala hona chahiye, aur koi rule nahi hai ki ek tez solution ek kaam-karte solution ke bilkul maujood hone se pehle mil jaana chahiye.

**Fix: ek paanch-kadam ka framework jo gaayab kadam explicitly bharta hai**

\`\`\`
1. UNDERSTAND     — problem ko apne khud ke shabdon mein dobara bataao;
                     ek chhote example ko haath se poori tarah kaam karo
2. BRUTE FORCE     — sabse zaahir, chahe dheema ho, aisa solution likho
                     jo sach mein sahi hai — "sahi par dheema" "koi
                     solution bilkul nahi" se behtar hai
3. IDENTIFY THE PATTERN — poochho: mera brute force asal mein baar-baar/
                     bekaar mein kya kar raha hai jise ek jaani-pehchaani
                     pattern ya data structure avoid kar sakti hai?
4. OPTIMIZE        — us pattern ko lagu karo bekaar kaam hataane ke liye
5. VERIFY          — optimized solution ko step 1 waale usi chhote
                     example se haath se, line-by-line trace karo
\`\`\`

Upar wale two-sum problem par lagu kiya gaya: **Understand** — \`[2, 7, 11, 15]\` aur target \`9\` diye gaye, jawaab \`2 + 7\` hai, isliye maksad ek aisa JODA dhoondhna hai jiska sum match kare. **Brute force** — do nested loops istemal karke har sambhaavit joda ek-ek karke check karo; ye ek vishaal array ke liye dheema hai, par ye sach mein sahi hai, aur sahi-par-dheema asli, istemal-yogya pragati hai, ek failure nahi. **Identify the pattern** — brute force baar-baar poochta hai "kya maine pehle se wo DOOSRA number dekha hai jiske saath is khaas number ko jodna hai?" — aur "kya maine X pehle dekha hai, aur kya main use turant lookup kar sakta hoon?" bilkul wo sawaal hai jise ek hash map (is course ka Module 2) sasta jawaab dene ke liye maujood hai. **Optimize** — doosre nested loop ke bajaye, check karo ek hash map mein ki \`target - currentNumber\` pehle se dekha gaya hai ya nahi, aur agar nahi, toh current number ko us map mein ek bhavishya ke check ke liye record karo. **Verify** — \`[2, 7, 11, 15]\`, target \`9\` ke through haath se trace karo: \`2\` dekho, ek khaali map mein \`7\` dhoondho (wahaan nahi hai), \`2\` record karo; \`7\` dekho, map mein \`2\` dhoondho (mil gaya!), \`[2, 7]\` return karo — step 1 se ummeed ki gayi jawaab se mel khaata hai. In paanch kadam mein se har ek ek chhota, thos, hamesha-jawaab-di-jaa-sakne-waala sawaal hai — inmein se koi bhi shuru karne se pehle "trick" pehle se jaanne ki zaroorat nahi rakhta.`,

    content: `## Why "brute force first" is a genuine, professional habit, not giving up

\`\`\`
A working O(n²) solution submitted on time  >  a nonexistent "optimal"
solution because the optimal approach was never found in time
\`\`\`

A genuinely common misconception is that writing a slow, brute-force solution first is a sign of weakness, or a step to be skipped by anyone who is actually good at this. In reality, writing the brute force first serves two distinct, concrete purposes that have nothing to do with skill level: it produces a genuinely correct reference to check a later, optimized version against (this course\'s own "Verify" step depends on having this), and it very often makes the optimization itself obvious, since the brute force\'s own inefficiency — the specific repeated or wasted work it does — is usually the direct clue for which pattern applies. A professional engineer facing a genuinely unfamiliar problem in a real job follows exactly this same sequence, not a shortcut around it, because a working solution that can be improved later is worth far more than an elegant solution that was never actually finished.

## Working through "understand" with the most basic possible mechanics: swapping two values

\`\`\`js
let a = 5;
let b = 10;
// goal: after this code runs, a should be 10 and b should be 5

let temp = a; // hold onto a's original value before it gets overwritten
a = b;        // a now has b's value
b = temp;     // b now has a's ORIGINAL value, saved in temp
\`\`\`

Before any pattern or data structure can be applied, a huge number of DSA problems reduce to genuinely basic mechanical operations like this one, and being unable to trace through them by hand is a real, common source of getting stuck that has nothing to do with algorithmic knowledge at all. Swapping two variables\' values cannot be done by writing \`a = b; b = a;\` alone, because the moment \`a = b\` runs, \`a\`\'s own original value is gone — overwritten — so \`b = a\` on the next line would only copy \`b\`\'s own value right back into itself, having lost \`a\`\'s original value forever. A temporary variable (\`temp\`) exists specifically to hold onto that original value just long enough for it to still be usable after \`a\` has already been overwritten. The single most useful habit for the "Understand" step of this lesson\'s framework is doing exactly this — tracing through a small example, one line at a time, writing down each variable\'s actual value after each line runs, by hand, on paper or in a comment — rather than trying to hold the entire process in one\'s head at once, since a genuinely new problem\'s later steps become far easier to reason about once a concrete, worked example already exists to check against.

## Identifying the pattern: asking what the brute force is wasting

\`\`\`
Brute force for two-sum: for every number, check every OTHER number
                          — repeatedly asking "have I seen a number
                            that pairs with this one?" from scratch,
                            every single time

The waste: this exact question — "have I seen X before?" — is being
           re-asked from zero every time, throwing away everything
           already learned from earlier iterations
\`\`\`

The "Identify the Pattern" step of this framework is not about recognizing a problem type by its name or having seen an identical problem before — it is about looking directly at the brute force solution\'s own repeated work and asking what specific question it re-answers from scratch, over and over, that could instead be answered instantly by remembering the answer from a previous check. This single question — "what is my brute force wastefully re-doing?" — is the actual, repeatable mechanism by which a genuinely new problem\'s pattern can be found without already knowing it in advance, and it is exactly what this course\'s later modules each teach a specific, reusable answer to (a hash map remembers "have I seen this before"; two pointers remember "what have I already ruled out"; dynamic programming remembers "what smaller version of this problem have I already solved").`,

    contentHi: `## "Brute force pehle" ek asli, professional aadat kyun hai, haar maanna nahi

\`\`\`
Waqt par submit ki gayi ek kaam-karti O(n²) solution  >  ek na-maujood
"optimal" solution kyunki optimal approach waqt par kabhi mila hi nahi
\`\`\`

Ek sach mein aam galat-samajh ye hai ki pehle ek dheema, brute-force solution likhna kamzori ka sanket hai, ya ek kadam jo koi bhi jo asal mein isme achha hai skip kar sakta hai. Asal mein, pehle brute force likhna do alag, thos maksad poore karta hai jinka skill level se koi lena-dena nahi hai: ye ek sach mein sahi reference banaata hai ek baad ke, optimized version ke khilaaf check karne ke liye (is course ka apna "Verify" step ise hone par nirbhar karta hai), aur ye aksar optimization ko khud zaahir banaata hai, kyunki brute force ki apni na-kushalta — khaas taur par dohraaya ya bekaar kiya gaya kaam — aksar sidhaa clue hoti hai ki kaunsa pattern lagu hota hai. Ek professional engineer ek sach mein anjaan problem ka saamna karte hue ek asli job mein bilkul yahi sequence follow karta hai, iske aas-paas ek shortcut nahi, kyunki ek kaam karta solution jise baad mein sudhaara jaa sakta hai ek elegant solution se kaafi zyaada keemat rakhta hai jo asal mein kabhi poora hi nahi hua.

## "Understand" ko sabse buniyaadi sambhaavit mechanics se kaam karna: do values swap karna

\`\`\`js
let a = 5;
let b = 10;
// maksad: ye code chalne ke baad, a 10 hona chahiye aur b 5 hona chahiye

let temp = a; // a ki asli value ko rakho isse pehle ki wo overwrite ho jaaye
a = b;        // a ke paas ab b ki value hai
b = temp;     // b ke paas ab a ki ASLI value hai, temp mein save ki gayi
\`\`\`

Kisi bhi pattern ya data structure ko lagu karne se pehle, DSA problems ki ek vishaal tadaad sach mein buniyaadi mechanical operations tak reduce hoti hain isi jaisi, aur haath se inke through trace na kar paana phasne ka ek asli, aam srot hai jiska algorithmic gyaan se koi lena-dena nahi hai. Do variables ki values swap karna sirf \`a = b; b = a;\` likhne se nahi ki jaa sakti, kyunki jis pal \`a = b\` chalta hai, \`a\` ki apni asli value chali jaati hai — overwrite ho jaati hai — isliye agli line par \`b = a\` sirf \`b\` ki apni value ko wapas usi mein copy karega, \`a\` ki asli value ko hamesha ke liye kho kar. Ek temporary variable (\`temp\`) khaas taur par us asli value ko itni der rakhne ke liye maujood hai ki ye \`a\` ke pehle se overwrite hone ke baad bhi istemal-yogya rahe. Is lesson ke framework ke "Understand" step ke liye sabse upyogi aadat bilkul yahi karna hai — ek chhote example ko, ek waqt mein ek line, trace karna, har line chalne ke baad har variable ki asli value likhna, haath se, kaagaz par ya ek comment mein — poori process ko ek saath dimaag mein rakhne ki koshish karne ke bajaye, kyunki ek sach mein nayi problem ke baad ke kadam kaafi aasaan ban jaate hain ek baar ek thos, kaam-kiya-gaya example maujood ho check karne ke liye.

## Pattern pehchaanna: poochna ki brute force kya barbaad kar raha hai

\`\`\`
Two-sum ke liye brute force: har number ke liye, har DOOSRA number check karo
                          — baar-baar poochte hue "kya maine ek aisa
                            number dekha hai jo isse jodta hai?" shuru
                            se, har akeli baar

Barbaadi: bilkul yahi sawaal — "kya maine X pehle dekha hai?" — shuny
           se baar-baar dobara poocha jaa raha hai, pichli iterations
           se seekhi har cheez ko phenkte hue
\`\`\`

Is framework ka "Identify the Pattern" step ek problem type ko iske naam se pehchaanne ya isse pehle ek identical problem dekh chuke hone ke baare mein nahi hai — ye seedhe brute force solution ke apne dohraaye gaye kaam ko dekhne aur poochne ke baare mein hai ki ye khaas taur par kaunsa sawaal shuru se dobara jawaab de raha hai, baar-baar, jo iske bajaye pichli check se jawaab yaad rakhkar turant jawaab diya jaa sakta hai. Ye akela sawaal — "mera brute force bekaar mein kya dobara kar raha hai?" — asli, dohraaye-jaane-yogya mechanism hai jiske zariye ek sach mein nayi problem ka pattern bina ise pehle se jaane dhoondha jaa sakta hai, aur ye bilkul wo hai jise is course ke baad ke modules har ek ek khaas, reusable jawaab sikhaate hain (ek hash map yaad rakhta hai "kya maine ye pehle dekha hai"; two pointers yaad rakhte hain "maine ab tak kya ruled out kiya hai"; dynamic programming yaad rakhta hai "is problem ka kaunsa chhota version maine pehle hi sulajhaaya hai").`,

    examples: [
      {
        title: 'Broken: jumping straight to "the" optimal solution',
        titleHi: 'Toota: seedhe "asli" optimal solution par kudna',
        code: `// staring at a blank page, trying to write the fastest
// possible two-sum solution before writing anything correct at all`,
        codeJs: `// Learner's actual attempt, stuck at this exact point:
function twoSum(nums, target) {
  // "I know a hash map is supposedly fast, but I don't know
  // how to get there without already knowing the trick..."
}
// nothing gets written, because there is no intermediate step`,
        codeTs: `function twoSum(nums: number[], target: number): number[] {
  // same freeze — jumping straight to the fast solution with
  // no smaller, answerable question to work through first
  throw new Error("not implemented");
}`,
        output: `No working code at all, despite fully understanding what the
problem is asking for — the gap between "understand" and "optimal"
was never broken into smaller steps.`,
        explain: 'Skipping the brute force and pattern-identification steps removes every concrete, answerable question along the way, leaving nothing to actually think through.',
        explainHi: 'Brute force aur pattern-identification steps ko skip karna raaste mein har thos, jawaab-di-jaa-sakne-waala sawaal hataata hai, asal mein sochne ke liye kuch bhi na chhodte hue.',
      },
      {
        title: 'Fixed: brute force first, genuinely correct even though slow',
        titleHi: 'Theek: pehle brute force, sach mein sahi chahe dheema ho',
        code: `for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums[j] === target) return [i, j];
  }
}`,
        codeJs: `function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}
// slow for a huge array, but genuinely, verifiably correct`,
        codeTs: `function twoSumBruteForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`,
        outputJs: `twoSumBruteForce([2, 7, 11, 15], 9) returns [0, 1] — correct,
verifiable against the small example worked through by hand.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'This solution is genuinely finished and correct, providing both a reference to check an optimized version against and a concrete starting point for identifying the wasted work.',
        explainHi: 'Ye solution sach mein poora aur sahi hai, ek optimized version ke khilaaf check karne ke liye ek reference aur bekaar kiye gaye kaam ko pehchaanne ke liye ek thos shuruaati bindu dono pradaan karta hai.',
      },
      {
        title: 'Optimized: applying the pattern the brute force\'s waste pointed to',
        titleHi: 'Optimized: us pattern ko lagu karna jispar brute force ki barbaadi ne ishaara kiya',
        code: `const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
  seen.set(nums[i], i);
}`,
        codeJs: `function twoSumOptimized(nums, target) {
  const seen = new Map(); // "have I seen this number before?"
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
        codeTs: `function twoSumOptimized(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement) as number, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
        outputJs: `twoSumOptimized([2, 7, 11, 15], 9) returns [0, 1], matching the
brute force's verified answer — the same correct result, reached
by remembering past work instead of re-checking every pair.`,
        outputTs: `// Identical behaviour. Map<number, number> gives .get()
// a correctly typed return of number | undefined.`,
        explain: 'The map replaces the brute force\'s repeated "have I seen this?" question with an instant lookup, directly addressing the specific waste identified in the previous step.',
        explainHi: 'Map brute force ke dohraaye gaye "kya maine ye dekha hai?" sawaal ko ek turant lookup se badalta hai, pichle step mein pehchaani gayi khaas barbaadi ko seedhe sambodhit karte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `// trying to write the final, optimized solution immediately,
// with no brute force and no small worked example first`,
        right: `// working through the five-step framework in order: understand,
// brute force, identify the pattern, optimize, verify`,
        why: 'Skipping straight to the optimal solution removes every intermediate, answerable question, which is precisely what causes the feeling of being completely stuck.',
        whyHi: 'Seedhe optimal solution par kudna har beech ka, jawaab-di-jaa-sakne-waala sawaal hataata hai, jo bilkul poori tarah phasne ka ehsaas paida karta hai.',
      },
      {
        wrong: `a = b;
b = a; // b's own value copied back into itself — a's original value is lost`,
        right: `let temp = a;
a = b;
b = temp; // a's original value, saved before being overwritten, is preserved`,
        why: 'Swapping two values without a temporary variable destroys the first variable\'s original value before it can be assigned to the second, a basic mechanical error that has nothing to do with algorithmic knowledge.',
        whyHi: 'Do values ko ek temporary variable ke bina swap karna pehle variable ki asli value ko us se pehle nasht kar deta hai ki wo doosre ko assign ki jaa sake, ek buniyaadi mechanical galti jiska algorithmic gyaan se koi lena-dena nahi hai.',
      },
      {
        wrong: `// treating the brute-force step as an embarrassing shortcut to skip
// if you're "actually good" at this`,
        right: `// treating the brute force as a genuinely necessary reference
// solution and the source of the clue for what to optimize`,
        why: 'The brute force is not a lesser version of the real solution to be ashamed of — it is the concrete reference the "Verify" step depends on, and very often the direct source of the optimization itself.',
        whyHi: 'Brute force asli solution ka koi kam version nahi hai jisse sharminda hona ho — ye wo thos reference hai jispar "Verify" step nirbhar karta hai, aur aksar optimization ka khud seedha srot hai.',
      },
    ],

    realWorld: [
      {
        en: '**"Understand, brute force, optimize, verify" is genuinely the process professional software engineers use when facing an unfamiliar problem in a real job, not a beginner-only training-wheels method.**',
        hi: '**"Understand, brute force, optimize, verify" sach mein wo process hai jise professional software engineers ek asli job mein ek anjaan problem ka saamna karte waqt istemal karte hain, ek sirf-shuruaati-logon-ke-liye training-wheels tarika nahi.**',
      },
      {
        en: '**Real technical interviews explicitly reward talking through a brute force and its trade-offs out loud before jumping to an optimized solution**, since this demonstrates the actual reasoning process, not just a memorized final answer.',
        hi: '**Asli technical interviews explicitly ek brute force aur uske trade-offs ko zor se baat karte hue talk karne ka inaam dete hain ek optimized solution par kudne se pehle**, kyunki ye asli tark process darsata hai, sirf ek yaad kiya gaya aakhri jawaab nahi.',
      },
      {
        en: '**Tracing code by hand, line by line, on paper or in a comment, is a genuinely standard debugging and learning technique used by professional engineers at every experience level**, not a beginner-only crutch to grow out of.',
        hi: '**Code ko haath se, line-by-line, kaagaz par ya ek comment mein trace karna ek sach mein standard debugging aur seekhne ki technique hai jise professional engineers har experience level par istemal karte hain**, ek sirf-shuruaati-logon-ke-liye crutch nahi jise chhodna hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is writing a genuinely correct but slow brute-force solution first considered good practice, rather than a step to skip by jumping straight to the optimal approach?',
        qHi: 'Pehle ek sach mein sahi par dheema brute-force solution likhna achhi practice kyun maana jaata hai, seedhe optimal approach par kudkar skip karne ke liye ek kadam ke bajaye?',
        a: 'A brute-force solution serves two genuinely distinct, practical purposes that have nothing to do with the solver\'s actual skill level, and skipping it removes both. First, it produces a concrete, verifiably correct reference — a solution whose output can be checked, by hand, against small examples, and trusted to be right even though it may be slow. Without this reference, there is no reliable way to confirm that a LATER, optimized version is actually still correct, since an optimized approach\'s own correctness cannot be checked against nothing; it needs something trustworthy to compare its output to. Second, and just as importantly, the brute force\'s own specific inefficiency is very often the direct, concrete clue that reveals which pattern or data structure the optimization actually needs — identifying exactly what redundant or wasteful work the brute force repeats is a genuinely reliable way to discover the right optimization, even for a problem that has never been seen before, since this reasoning does not depend on already recognizing the problem\'s type in advance. Attempting to skip straight to an optimal solution discards both of these genuinely useful artifacts: there is no reference to verify against, and there is no concrete brute-force inefficiency to reason from, leaving nothing but "try to already know the trick," which is precisely the situation that produces the feeling of being completely stuck on a problem that is not actually beyond one\'s ability to solve.',
        aHi: 'Ek brute-force solution do sach mein alag, vyaavahaarik maksad poora karta hai jinka solver ki asli skill level se koi lena-dena nahi hai, aur ise skip karna dono hataata hai. Pehla, ye ek thos, verify-ki-jaa-sakne-yogya sahi reference banaata hai — ek solution jiska output haath se, chhote examples ke khilaaf check kiya jaa sakta hai, aur sahi hone par bharosa kiya jaa sakta hai chahe ye dheema ho. Is reference ke bina, ye confirm karne ka koi bharosemand tarika nahi hai ki ek BAAD ka, optimized version asal mein abhi bhi sahi hai, kyunki ek optimized approach ki apni sahihata kuch nahi ke khilaaf check nahi ki jaa sakti; ise iske output ki tulna karne ke liye kuch bharosemand chahiye. Doosra, aur bilkul utna hi mahatvapoorn, brute force ki apni khaas na-kushalta aksar seedha, thos clue hota hai jo darsata hai ki optimization ko asal mein kaunsi pattern ya data structure chahiye — bilkul ye pehchaanna ki brute force khaas taur par kaunsa faaltu ya bekaar kaam dohraata hai sahi optimization dhoondhne ka ek sach mein bharosemand tarika hai, ek aisi problem ke liye bhi jo pehle kabhi nahi dekhi gayi, kyunki ye tark pehle se problem ke type ko pehchaanne par nirbhar nahi karta. Seedhe ek optimal solution par kudne ki koshish karna in dono sach mein upyogi cheezon ko hataata hai: verify karne ke liye koi reference nahi hai, aur tark karne ke liye koi thos brute-force na-kushalta nahi hai, "pehle se trick jaanne ki koshish karo" ke alaawa kuch bhi na chhodte hue, jo bilkul wo sthiti hai jo ek aisi problem par poori tarah phasne ka ehsaas paida karta hai jo asal mein solver ki kshamta se aage nahi hai.',
      },
      {
        q: 'What does it actually mean to "identify the pattern" a problem needs, and why is this framed around what the brute force wastes rather than around recognizing a problem type by name?',
        qHi: '"Pattern identify karna" jo ek problem ko chahiye iska asal mein kya matlab hai, aur ise brute force kya barbaad karta hai iske aas-paas kyun frame kiya gaya hai, ek problem type ko naam se pehchaanne ke aas-paas nahi?',
        a: 'Identifying a problem\'s pattern by attempting to recognize its type by name relies entirely on having seen a genuinely similar problem before, phrased similarly enough to trigger recognition — this approach provides no path forward at all for a problem that is phrased in a way that does not immediately resemble anything previously encountered, even if it shares the same underlying structure as a familiar one. Framing pattern identification instead around a specific, concrete question — what is my own brute-force solution redundantly or wastefully repeating? — provides a genuinely reliable path forward regardless of whether the problem resembles anything seen before, because this question can always be asked and answered by examining the brute force\'s own actual behavior, which exists and is inspectable regardless of how unfamiliar the problem\'s surface wording happens to be. In the two-sum example this lesson used, the brute force repeatedly asks, from scratch, on every single iteration, "is there some other number in this array that pairs with the one I\'m looking at right now?" — a question it re-derives by scanning from zero every time, throwing away everything it already checked in earlier iterations. Naming this specific waste directly points toward the fix: something that remembers what has already been seen so that question can be answered by an instant lookup rather than a fresh scan, which is precisely what a hash map is for. This same reasoning process — examine the brute force, name its specific repeated or wasted work, then ask what remembers that work so it need not be redone — generalizes to essentially every pattern this course covers, and it works whether or not the problem happens to resemble one seen before, which is exactly why it is the more durable, more broadly applicable way to find a pattern than trying to recognize a problem\'s type from its name or phrasing alone.',
        aHi: 'Ek problem ka pattern iske type ko naam se pehchaanne ki koshish karke pehchaanna poori tarah is baat par nirbhar karta hai ki pehle ek sach mein samaan problem dekhi gayi ho, itni samaan roop se likhi hui ki pehchaan trigger ho — ye approach ek aisi problem ke liye bilkul koi raasta pradaan nahi karta jo aise tarike se likhi gayi hai jo turant kisi bhi pehle saamne aayi cheez se milti-julti nahi lagti, chahe ye ek jaani-pehchaani problem ke saath wahi underlying structure share karti ho. Pattern identification ko iske bajaye ek khaas, thos sawaal ke aas-paas frame karna — mera apna brute-force solution kya faaltu ya bekaar mein dohraa raha hai? — ek sach mein bharosemand raasta pradaan karta hai chahe problem kisi pehle dekhi gayi cheez jaisi lage ya na lage, kyunki ye sawaal hamesha poocha aur jawaab diya jaa sakta hai brute force ke apne asli vyavahaar ko dekhkar, jo maujood hai aur inspect-yogya hai chahe problem ki surface wording kitni bhi anjaan ho. Is lesson ne jo two-sum example istemal kiya, usme brute force baar-baar poochta hai, shuru se, har akeli iteration par, "kya is array mein koi doosra number hai jo abhi maine jise dekh raha hoon us se jodta hai?" — ek sawaal jo ye har baar shuny se scan karke dobara nikaalta hai, pichli iterations mein jo bhi check kiya use phenkte hue. Is khaas barbaadi ko naam dena seedhe fix ki taraf ishaara karta hai: kuch aisa jo yaad rakhta hai ki kya pehle se dekha ja chuka hai taaki wo sawaal ek turant lookup se jawaab diya jaa sake ek taazi scan se nahi, jo bilkul wo hai jiske liye ek hash map hai. Yahi tark process — brute force ko dekho, iske khaas dohraaye ya bekaar kiye gaye kaam ko naam do, phir poochho ki us kaam ko kya yaad rakhta hai taaki ise dobara na karna pade — lagbhag har pattern tak generalize hota hai jise ye course cover karta hai, aur ye kaam karta hai chahe problem kisi pehle dekhi gayi jaisi lage ya na lage, jo bilkul isliye hai ki ye ek pattern dhoondhne ka zyaada tikaau, zyaada vyaapak roop se lagu hone-yogya tarika hai ek problem ke type ko sirf iske naam ya wording se pehchaanne ki koshish karne se.',
      },
    ],

    exercises: [
      {
        task: 'Pick any problem you have never seen before (ask someone else to invent one, or search for one you genuinely do not recognize). Write down your Understand step: restate it in your own words, and work through one small example completely by hand before writing any code.',
        taskHi: 'Koi bhi problem chuno jo tumne kabhi nahi dekhi (kisi aur se ek banaane ko kaho, ya ek dhoondho jise tum sach mein nahi pehchaante). Apna Understand step likho: ise apne khud ke shabdon mein dobara bataao, aur koi bhi code likhne se pehle haath se poori tarah ek chhota example kaam karo.',
        hint: 'If you cannot restate the problem in your own words without looking back at the original wording, that is a genuine sign the Understand step is not actually finished yet.',
        hintHi: 'Agar tum asli wording ko dobara dekhe bina problem ko apne khud ke shabdon mein dobara nahi bata sakte, ye ek asli sanket hai ki Understand step asal mein abhi poora nahi hua.',
      },
      {
        task: 'Trace through the swap-with-a-temp-variable code from this lesson by hand, writing down a, b, and temp\'s actual values after every single line, for starting values a = 3, b = 8.',
        taskHi: 'Is lesson ke swap-with-a-temp-variable code ko haath se trace karo, har akeli line ke baad \`a\`, \`b\`, aur \`temp\` ki asli values likhte hue, shuruaati values \`a = 3\`, \`b = 8\` ke liye.',
        hint: 'Write three columns, one per variable, and fill in a new row after each line of code runs — this is the exact habit this lesson\'s Understand step is asking you to build.',
        hintHi: 'Teen columns likho, prati variable ek, aur code ki har line chalne ke baad ek nayi row bharo — ye bilkul wahi aadat hai jise is lesson ka Understand step tumse banaane ko keh raha hai.',
      },
      {
        task: 'Take the brute-force two-sum solution from this lesson and, without looking at the optimized version, write down in your own words what specific work it repeats or wastes — before checking whether your answer matches this lesson\'s own explanation.',
        taskHi: 'Is lesson ka brute-force two-sum solution lo aur, optimized version ko dekhe bina, apne khud ke shabdon mein likho ki ye khaas taur par kaunsa kaam dohraata ya barbaad karta hai — check karne se pehle ki tumhaara jawaab is lesson ke apne spashteekaran se mel khaata hai ya nahi.',
        hint: 'Focus on the inner loop specifically — what is it checking, and has that same check already been effectively done in an earlier iteration of the outer loop?',
        hintHi: 'Khaas taur par inner loop par focus karo — ye kya check kar raha hai, aur kya wahi check pehle se effectively outer loop ki ek pehle iteration mein ho chuka hai?',
      },
    ],

    keyTakeaways: [
      'The five-step framework — Understand, Brute Force, Identify the Pattern, Optimize, Verify — turns "I have no idea where to start" into a sequence of smaller, always-answerable questions.',
      'Writing a genuinely correct but slow brute-force solution first is professional practice, not a shortcut to be skipped by anyone experienced — it provides both a reference and a clue for optimization.',
      'Swapping two values requires a temporary variable to hold the first value\'s original contents before it gets overwritten — a = b; b = a; alone loses that original value permanently.',
      'Identifying a pattern is best framed as "what does my brute force wastefully repeat?" rather than "what type of problem is this?", since the first question works even on a genuinely unfamiliar problem.',
      'Tracing code by hand, one line at a time, writing down each variable\'s actual value as it changes, is a standard professional technique for understanding unfamiliar code, not a beginner-only crutch.',
      'A working, verifiable brute-force solution is worth more than an unfinished attempt at an "optimal" one — correctness first, speed second, is the order this framework deliberately enforces.',
    ],
    keyTakeawaysHi: [
      'Paanch-kadam ka framework — Understand, Brute Force, Identify the Pattern, Optimize, Verify — "mujhe nahi pata kahaan se shuru karoon" ko chhote, hamesha-jawaab-di-jaa-sakne-waale sawaalon ki ek sequence mein badalta hai.',
      'Pehle ek sach mein sahi par dheema brute-force solution likhna professional practice hai, kisi bhi experienced vyakti dwara skip kiye jaane laayak shortcut nahi — ye optimization ke liye ek reference aur ek clue dono pradaan karta hai.',
      'Do values swap karne ke liye ek temporary variable chahiye pehli value ki asli contents ko us se pehle rakhne ke liye ki wo overwrite ho jaaye — akela \`a = b; b = a;\` us asli value ko hamesha ke liye kho deta hai.',
      'Pattern pehchaanna behtar taur par "mera brute force bekaar mein kya dohraata hai?" ki tarah frame kiya jaata hai "ye kis type ki problem hai?" ke bajaye, kyunki pehla sawaal ek sach mein anjaan problem par bhi kaam karta hai.',
      'Code ko haath se trace karna, ek waqt mein ek line, har variable ki asli value badalte hue likhna, anjaan code samajhne ki ek standard professional technique hai, ek sirf-shuruaati-logon-ke-liye crutch nahi.',
      'Ek kaam karta, verify-ki-jaa-sakne-yogya brute-force solution ek "optimal" ki na-poori koshish se zyaada keemat rakhta hai — sahihata pehle, tez baad mein, wo order hai jise ye framework jaan-boojhkar lagu karta hai.',
    ],
  },
];
