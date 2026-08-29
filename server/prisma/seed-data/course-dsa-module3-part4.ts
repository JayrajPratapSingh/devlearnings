/**
 * DSA Complete Course — Module 3: Hashing, lesson 4 (final lesson of
 * Module 3).
 *
 * HashSet versus HashMap, and a consolidated answer to "when does
 * hashing actually beat sorting or searching?" — the capstone lesson
 * for this module, tying together the internals covered in the previous
 * three lessons into a practical decision framework. Broken example:
 * reaching for a Map when the actual problem only ever needs a yes/no
 * membership check, storing meaningless placeholder values purely
 * because a Map was grabbed instead of a Set — a genuine, common
 * "using the right general tool in the wrong specific shape" mistake.
 * Fixed by using a Set directly when only membership matters, reserving
 * Map specifically for when a key must be associated with actual data.
 * The lesson closes by consolidating the signal this course has been
 * building since Module 2: does the actual question depend on order
 * (reach for sorting or two pointers) or only on membership/counts
 * (reach for hashing)?
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

export const DSA_MODULE_3_PART4: CourseLesson[] = [
  {
    slug: 'hashset-vs-hashmap-when-hashing-wins',
    title: 'HashSet vs HashMap, and When Hashing Actually Wins',
    titleHi: 'HashSet vs HashMap, Aur Hashing Asal Mein Kab Jeetta Hai',
    description: 'Checking whether an array contains any duplicate values by reaching for a Map and storing every value with a meaningless placeholder like true — the value stored is never actually used for anything, because the real question was only ever "have I seen this before?", not "what data is associated with this key?"',
    descriptionHi: 'Ye check karna ki ek array mein koi duplicate values hain ya nahi \`Map\` pakadkar aur har value ko \`true\` jaise ek bemaani placeholder ke saath store karke — store ki gayi value asal mein kabhi kisi bhi cheez ke liye istemal nahi hoti, kyunki asli sawaal kabhi sirf "kya maine ye pehle dekha hai?" tha, "is key ke saath kaunsa data associated hai?" nahi.',
    difficulty: 'EASY',
    duration: 20,
    order: 4,

    analogy: {
      en: '**Using a full filing cabinet, with a labeled folder for every visitor containing a detailed dossier, purely to answer the simple question "has this specific person visited before?" — versus using a simple sign-in sheet that just lists names, with nothing else attached to each one.** The filing-cabinet approach technically answers the question correctly — checking whether a folder exists for someone does tell you whether they have visited before — but it carries the full weight of a dossier-keeping system for a question that never actually needed any dossier at all, only a yes-or-no answer. The sign-in-sheet approach answers the exact same question using only what the question actually requires: a name is either on the list or it is not, with nothing else to maintain, update, or reason about. Using a Map, and storing a meaningless placeholder value like true for every key, purely to check "have I seen this key before?" is the filing-cabinet approach: it works, but it carries the conceptual and practical overhead of key-value association for a question that was only ever about membership. Using a Set is the sign-in-sheet approach: it answers the identical membership question using a tool built specifically for that question, with no placeholder value to invent, store, or later wonder about the meaning of.',
      hi: '**Ek poori filing cabinet istemal karna, har visitor ke liye ek labeled folder ke saath jismein ek detailed dossier hai, sirf saadhe sawaal "kya ye khaas vyakti pehle visit kar chuka hai?" ka jawaab dene ke liye — versus ek saadhi sign-in sheet istemal karna jo bas naam list karti hai, har ek ke saath kuch aur na jodi hui.** Filing-cabinet approach technically sawaal ka sahi jawaab deta hai — ye check karna ki kya kisi ke liye ek folder maujood hai ye batata hai ki kya wo pehle visit kar chuka — par ye ek dossier-rakhne-waale system ka poora bhaar uthaata hai ek aise sawaal ke liye jise asal mein kisi bhi dossier ki zaroorat kabhi nahi thi, sirf ek haan-ya-na jawaab. Sign-in-sheet approach bilkul wahi sawaal ka jawaab deta hai sirf wo istemal karke jo sawaal asal mein maangta hai: ek naam ya toh list mein hai ya nahi hai, kuch aur maintain, update, ya iske baare mein tark karne ke liye nahi. Ek \`Map\` istemal karna, aur har key ke liye \`true\` jaisi ek bemaani placeholder value store karna, sirf "kya maine ye key pehle dekhi hai?" check karne ke liye, filing-cabinet approach hai: ye kaam karta hai, par ye key-value association ka conceptual aur vyaavahaarik overhead uthaata hai ek aise sawaal ke liye jo kabhi sirf membership ke baare mein tha. Ek \`Set\` istemal karna sign-in-sheet approach hai: ye identical membership sawaal ka jawaab deta hai bilkul us sawaal ke liye banaaye gaye ek tool ka istemal karke, koi placeholder value ijaad, store, ya baad mein iske matlab ke baare mein sochne ke bina.',
    },

    simple: `**Start broken.** Reaching for a Map to answer a question that is only ever about membership:

\`\`\`js
function hasDuplicates(nums) {
  const seen = new Map(); // stores a KEY-VALUE pair for every number
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.set(num, true); // "true" is never actually used for anything
  }
  return false;
}
\`\`\`

This is genuinely correct, and its \`O(n)\` complexity is exactly right — the mistake here is not about performance at all. The mistake is conceptual: the question being asked, "have I seen this number before," is a pure membership question — the only thing that ever matters is whether a number IS or IS NOT in \`seen\`, and the value \`true\` stored alongside every key is never once read, checked, or used for anything at all. Reaching for a \`Map\`, which is specifically built to associate a key with meaningful data, for a question that has no actual data to associate, is using a tool built for a slightly different job than the one at hand.

**The fix: use a Set directly, since only membership matters**

\`\`\`js
function hasDuplicates(nums) {
  const seen = new Set(); // stores only the numbers themselves — no placeholder values
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
\`\`\`

\`\`\`ts
function hasDuplicates(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
\`\`\`

A \`Set\` is built specifically for exactly this question: does this value exist in the collection or not? There is no key-value pair to construct, no placeholder to invent, and no meaningless \`true\` to store and ignore — \`seen.add(num)\` and \`seen.has(num)\` directly express "remember this value" and "have I seen this value," with nothing extra attached. The performance is identical to the \`Map\`-based version (both are backed by the same underlying hash table this module\'s earlier lessons covered), but the code itself now correctly reflects what the actual problem is asking.`,

    simpleHi: `**Toote hue se shuru.** Ek aise sawaal ka jawaab dene ke liye \`Map\` pakadna jo sirf membership ke baare mein hai:

\`\`\`js
function hasDuplicates(nums) {
  const seen = new Map(); // har number ke liye ek KEY-VALUE pair store karta hai
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.set(num, true); // "true" asal mein kabhi kisi cheez ke liye istemal nahi hota
  }
  return false;
}
\`\`\`

Ye sach mein sahi hai, aur iski \`O(n)\` complexity bilkul sahi hai — yahaan galti performance ke baare mein bilkul nahi hai. Galti conceptual hai: jo sawaal poocha jaa raha hai, "kya maine ye number pehle dekha hai," ek shuddh membership sawaal hai — sirf ek cheez jo kabhi maayne rakhti hai wo ye hai ki kya ek number \`seen\` mein HAI ya NAHI HAI, aur har key ke saath store ki gayi value \`true\` kabhi ek baar bhi padhi, check ki, ya kisi bhi cheez ke liye istemal ki nahi jaati. Ek \`Map\`, jo khaas taur par ek key ko maayne-yogya data se jodne ke liye banaayi gayi hai, ek aise sawaal ke liye pakadna jismein jodne ke liye koi asli data hi nahi hai, us kaam se thoda alag kaam ke liye banaayi gayi ek tool istemal karna hai.

**Fix: seedhe ek Set istemal karo, kyunki sirf membership maayne rakhti hai**

\`\`\`js
function hasDuplicates(nums) {
  const seen = new Set(); // sirf numbers khud store karta hai — koi placeholder values nahi
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
\`\`\`

\`\`\`ts
function hasDuplicates(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
\`\`\`

Ek \`Set\` khaas taur par bilkul is sawaal ke liye banaaya gaya hai: kya ye value collection mein maujood hai ya nahi? Banaane ke liye koi key-value pair nahi hai, ijaad karne ke liye koi placeholder nahi hai, aur store karne aur ignore karne ke liye koi bemaani \`true\` nahi hai — \`seen.add(num)\` aur \`seen.has(num)\` seedhe "is value ko yaad rakho" aur "kya maine ye value dekhi hai" darsate hain, kuch bhi atirikt joda hue bina. Performance \`Map\`-based version se identical hai (dono usi underlying hash table se backed hain jise is module ke pehle wale lessons ne cover kiya), par code khud ab sahi tarike se darsata hai ki asli problem kya poochh rahi hai.`,

    content: `## HashSet vs HashMap: the concrete decision rule

\`\`\`
Question is "have I seen this exact thing before?" (membership only)
  → Set: add(value), has(value), delete(value)

Question is "what data is associated with this specific thing?"
  (a count, an index, a computed value, anything beyond yes/no)
  → Map: set(key, value), get(key), has(key)
\`\`\`

Both \`Set\` and \`Map\` are built on the exact same underlying hash table mechanism this module\'s first three lessons covered in depth — the same hash function, the same collision handling, the same load-factor-triggered resizing. The choice between them is purely about what shape of question is actually being asked, not about performance, since both offer the identical \`O(1)\` average-case guarantee. This course\'s own earlier lessons already used both correctly: the two-sum solution in Module 1 needed a \`Map\`, since it had to associate each number with its own array index (real data beyond yes/no); this lesson\'s duplicate-check needed only a \`Set\`, since the only question was membership.

## Consolidating the signal: when hashing beats sorting or searching outright

\`\`\`
Question depends on ORDER (is this the smallest/largest? are these
  already adjacent/sequential? does this range's sum matter?)
    → sorting, two pointers, or prefix sums (this course's Module 2)

Question depends only on MEMBERSHIP or COUNTS (does this exist? how
  many times does it appear? are two collections composed identically?)
    → hashing, via Set or Map (this module)
\`\`\`

This course\'s Module 2 established that sorting is the right tool when a problem genuinely depends on order, and previewed that hashing is the right tool when a problem depends only on membership or counts — the anagram-checking lesson (comparing character counts instead of sorting) was that preview. This module has now covered exactly why hashing achieves this so cheaply: a hash function computes directly where to look, rather than needing an established order to search through efficiently. The concrete, repeatable question worth asking on any new problem, extending this course\'s own problem-solving-framework lesson, is: does the actual question I am being asked depend on the elements\' order or position relative to each other, or does it only depend on which elements exist, and how many of each? The first calls for this course\'s Module 2 techniques; the second calls for hashing.

## What hashing does not solve: this module's own honest limitation

A hash table\'s \`O(1)\` average lookup is a genuinely powerful guarantee, but it specifically answers "does this key exist, and what is its associated value" — it says nothing at all about ORDER. A \`Map\` or \`Set\` cannot efficiently answer "what is the smallest key currently stored" or "give me all entries between these two values" the way a sorted structure can, since a hash table\'s entire design deliberately discards any relationship between a key\'s value and where it physically sits in the bucket array. Recognizing this limitation explicitly — knowing not just when hashing wins, but when it genuinely cannot help at all — is precisely why this course\'s later modules on trees and sorting exist: for problems that genuinely need ordered access, no amount of hashing sophistication substitutes for a structure that actually maintains order.`,

    contentHi: `## HashSet vs HashMap: thos decision rule

\`\`\`
Sawaal hai "kya maine bilkul ye cheez pehle dekhi hai?" (sirf membership)
  → Set: add(value), has(value), delete(value)

Sawaal hai "is khaas cheez ke saath kaunsa data associated hai?"
  (ek count, ek index, ek gani gayi value, haan-ya-na se aage kuch bhi)
  → Map: set(key, value), get(key), has(key)
\`\`\`

Dono \`Set\` aur \`Map\` bilkul usi underlying hash table mechanism par banaaye gaye hain jise is module ke pehle teen lessons ne gehraayi mein cover kiya — wahi hash function, wahi collision handling, wahi load-factor-triggered resizing. Unke beech chunaav poori tarah is baare mein hai ki asal mein kis shape ka sawaal poocha jaa raha hai, performance ke baare mein nahi, kyunki dono identical \`O(1)\` average-case guarantee pradaan karte hain. Is course ke apne pehle wale lessons ne pehle hi dono ko sahi tarike se istemal kiya: Module 1 mein two-sum solution ko ek \`Map\` chahiye tha, kyunki ise har number ko uske apne array index se jodna tha (haan-ya-na se aage asli data); is lesson ke duplicate-check ko sirf ek \`Set\` chahiye tha, kyunki akela sawaal membership tha.

## Signal ko consolidate karna: hashing kab sorting ya searching se bilkul jeet jaata hai

\`\`\`
Sawaal ORDER par nirbhar karta hai (kya ye sabse chhota/bada hai? kya
  ye pehle se adjacent/sequential hain? kya is range ka sum maayne
  rakhta hai?)
    → sorting, two pointers, ya prefix sums (is course ka Module 2)

Sawaal sirf MEMBERSHIP ya COUNTS par nirbhar karta hai (kya ye maujood
  hai? ye kitni baar aata hai? kya do collections identical roop se
  banaayi gayi hain?)
    → hashing, Set ya Map ke zariye (ye module)
\`\`\`

Is course ke Module 2 ne sthaapit kiya ki sorting sahi tool hai jab ek problem sach mein order par nirbhar karti hai, aur preview kiya ki hashing sahi tool hai jab ek problem sirf membership ya counts par nirbhar karti hai — anagram-checking lesson (sort karne ke bajaye character counts compare karna) wo preview tha. Is module ne ab bilkul cover kiya hai ki hashing ise itna sasta kyun haasil karti hai: ek hash function seedhe ganta hai ki kahaan dekhna hai, kushalta se search karne ke liye ek sthaapit order ki zaroorat ke bajaye. Kisi bhi nayi problem par poochne laayak thos, dohraaye-jaane-yogya sawaal, is course ke apne problem-solving-framework lesson ko badhaate hue, ye hai: kya asli sawaal jo mujhse poocha jaa raha hai elements ke order ya ek doosre ke saapeksh position par nirbhar karta hai, ya kya ye sirf is baat par nirbhar karta hai ki kaunse elements maujood hain, aur har ek kitni baar? Pehla is course ke Module 2 ki techniques maangta hai; doosra hashing maangta hai.

## Hashing kya nahi sulajhaata: is module ki apni honest limitation

Ek hash table ki \`O(1)\` average lookup ek sach mein shaktishaali guarantee hai, par ye khaas taur par "kya ye key maujood hai, aur iski associated value kya hai" ka jawaab deti hai — ye ORDER ke baare mein bilkul kuch nahi kehti. Ek \`Map\` ya \`Set\` kushalta se "abhi store ki gayi sabse chhoti key kya hai" ya "in do values ke beech sab entries do" ka jawaab nahi de sakti jis tarah ek sorted structure de sakta hai, kyunki ek hash table ka poora design jaan-boojhkar ek key ki value aur ye bucket array mein physically kahaan baithi hai iske beech kisi bhi rishte ko hataata hai. Is limitation ko explicitly pehchaanna — sirf ye jaanna nahi ki hashing kab jeetti hai, balki ye bhi ki ye kab asal mein bilkul madad nahi kar sakti — bilkul isliye hai ki is course ke baad ke trees aur sorting ke modules maujood hain: un problems ke liye jinhe sach mein ordered access chahiye, hashing ki koi bhi sophistication ek aisi structure ka replacement nahi hai jo asal mein order banaaye rakhti hai.`,

    examples: [
      {
        title: 'Broken: a Map storing a meaningless placeholder value',
        titleHi: 'Toota: ek Map jo ek bemaani placeholder value store karta hai',
        code: `const seen = new Map();
seen.set(num, true); // "true" is never read or used`,
        codeJs: `function hasDuplicates(nums) {
  const seen = new Map();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.set(num, true);
  }
  return false;
}
// works, but "true" is a meaningless placeholder — the value is
// never once actually read`,
        codeTs: `function hasDuplicates(nums: number[]): boolean {
  const seen = new Map<number, boolean>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.set(num, true);
  }
  return false;
}
// fully valid TypeScript — the mismatch is conceptual, not a type error`,
        output: `hasDuplicates([1, 2, 3, 2]) correctly returns true, but the code
carries a Map's key-value structure for a question that never
needed any value at all.`,
        explain: 'The question being asked is pure membership ("have I seen this before"), but a Map, built for key-value association, is used anyway, with a meaningless value attached to every key.',
        explainHi: 'Poocha jaa raha sawaal shuddh membership hai ("kya maine ye pehle dekha"), par ek \`Map\`, key-value association ke liye banaayi gayi, phir bhi istemal ki jaati hai, har key ke saath ek bemaani value jodi hui.',
      },
      {
        title: 'Fixed: a Set, expressing exactly the membership question being asked',
        titleHi: 'Theek: ek Set, poochi jaa rahi membership sawaal ko bilkul darsaata hue',
        code: `const seen = new Set();
if (seen.has(num)) return true;
seen.add(num);`,
        codeJs: `function hasDuplicates(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
        codeTs: `function hasDuplicates(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
        outputJs: `hasDuplicates([1, 2, 3, 2]) returns true, using the exact same
underlying hash table performance, with no placeholder value to
invent or ignore.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'A Set directly expresses "does this value exist", matching the actual shape of the question, with no key-value pair to construct.',
        explainHi: 'Ek \`Set\` seedhe "kya ye value maujood hai" darsata hai, sawaal ki asli shape se mel khaate hue, banaane ke liye koi key-value pair nahi.',
      },
      {
        title: 'When Map is genuinely the right tool: associating a key with real data',
        titleHi: 'Jab Map sach mein sahi tool hai: ek key ko asli data se jodna',
        code: `const seen = new Map(); // this problem genuinely needs the INDEX, not just membership
if (seen.has(complement)) return [seen.get(complement), i];`,
        codeJs: `function twoSum(nums, target) {
  const seen = new Map(); // key: number, value: its own index — real data
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }
  return [];
}
// a Set could not answer this — the INDEX is genuinely needed, not
// just whether a number was seen`,
        codeTs: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement) as number, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
        outputJs: `twoSum([2, 7, 11, 15], 9) returns [0, 1] — the Map correctly
associates each number with the specific index it needs to return,
data a Set has no way to store.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'This problem genuinely needs to answer "at what index did I see this number", real data beyond a yes/no — exactly the case Map exists for.',
        explainHi: 'Is problem ko sach mein "maine ye number kis index par dekha" ka jawaab dena chahiye, haan-ya-na se aage asli data — bilkul wo case jiske liye \`Map\` maujood hai.',
      },
    ],

    mistakes: [
      {
        wrong: `const seen = new Map();
seen.set(item, true); // placeholder value, never actually read`,
        right: `const seen = new Set();
seen.add(item); // no placeholder needed at all`,
        why: 'Using a Map for a pure membership question requires inventing and ignoring a meaningless placeholder value — a Set expresses the same question directly, with no value to invent.',
        whyHi: 'Ek shuddh membership sawaal ke liye \`Map\` istemal karna ek bemaani placeholder value ijaad karne aur ignore karne ki maang karta hai — ek \`Set\` seedhe wahi sawaal darsata hai, ijaad karne ke liye koi value nahi.',
      },
      {
        wrong: `const seen = new Set();
seen.add(num); // but this problem needs the INDEX too, which a Set cannot store`,
        right: `const seen = new Map();
seen.set(num, index); // Map associates the number with the data actually needed`,
        why: 'Using a Set when a problem genuinely needs associated data (like an index or a count) forces awkward workarounds, since a Set can only answer membership, not "what data goes with this key".',
        whyHi: 'Ek \`Set\` istemal karna jab ek problem ko sach mein associated data chahiye (jaisa ek index ya ek count) ajeeb workarounds majboor karta hai, kyunki ek \`Set\` sirf membership ka jawaab de sakta hai, "is key ke saath kaunsa data jaata hai" ka nahi.',
      },
      {
        wrong: `// reaching for a hash-based structure (Set/Map) for a question
// that genuinely depends on ORDER, like "what is the smallest key?"`,
        right: `// recognizing that order-dependent questions call for sorting,
// two pointers, or an ordered structure — not hashing`,
        why: 'A hash table deliberately discards any relationship between a key\'s value and its physical position, so it cannot efficiently answer order-dependent questions no matter how it is used.',
        whyHi: 'Ek hash table jaan-boojhkar ek key ki value aur uski physical position ke beech kisi bhi rishte ko hataata hai, isliye ye order-dependent sawaalon ka kushalta se jawaab nahi de sakti chahe ise kaise bhi istemal kiya jaaye.',
      },
    ],

    realWorld: [
      {
        en: '**JavaScript\'s own Set and Map, Python\'s set and dict, and Java\'s HashSet and HashMap are all real, standard-library implementations of exactly this membership-versus-association distinction.**',
        hi: '**JavaScript ka apna \`Set\` aur \`Map\`, Python ka \`set\` aur \`dict\`, aur Java ka \`HashSet\` aur \`HashMap\` sab asli, standard-library implementations hain bilkul isi membership-versus-association farak ke.**',
      },
      {
        en: '**"Contains Duplicate", "Two Sum", and "Group Anagrams" are among the most commonly cited practice problems specifically chosen to teach when to reach for a Set versus a Map.**',
        hi: '**"Contains Duplicate", "Two Sum", aur "Group Anagrams" un practice problems mein sabse aam taur par cite ki jaane waali hain jo khaas taur par chuni gayi hain ye sikhaane ke liye ki kab \`Set\` versus \`Map\` pakadna hai.**',
      },
      {
        en: '**Recognizing whether a problem depends on order or only on membership/counts is one of the single most commonly tested pattern-recognition skills in real technical interviews**, directly building on this course\'s Module 2 and Module 3 together.',
        hi: '**Ye pehchaanna ki ek problem order par nirbhar karti hai ya sirf membership/counts par asli technical interviews mein sabse aam taur par test ki jaane waali pattern-recognition kaushal mein se ek hai**, seedhe is course ke Module 2 aur Module 3 ko saath banaate hue.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is choosing between a Set and a Map about the shape of the question being asked, rather than about performance, and what is the concrete signal for telling them apart?',
        qHi: 'Ek \`Set\` aur ek \`Map\` ke beech chunaav poochi jaa rahi sawaal ki shape ke baare mein kyun hai, performance ke baare mein nahi, aur unhe alag batane ke liye thos signal kya hai?',
        a: 'Both Set and Map are built on the exact same underlying hash table mechanism — the same hash function converting a key into a bucket index, the same collision-handling strategy, and the same load-factor-triggered resizing — meaning both offer an identical O(1) average-case lookup, insertion, and membership-check cost. Because their underlying performance characteristics are genuinely identical, the choice between them cannot be justified on performance grounds at all; it is purely a question of what shape of information the specific problem actually requires. A Set is designed to answer exactly one kind of question: does this specific value exist within the collection or not, a pure yes-or-no membership check with nothing else attached to each stored value. A Map is designed for a genuinely different question: given this specific key, what is the actual data value associated with it, supporting the storage and retrieval of real, meaningful data alongside each key, not just its presence or absence. The concrete signal for telling them apart is asking, for any specific problem, whether anything beyond a simple yes-or-no answer is genuinely needed once a match is found. If the only thing that ever matters is whether something has been seen before, with no further data needing to be recalled about it, a Set directly and honestly expresses that requirement. If the problem needs to recall some additional piece of information tied to a specific key once that key is found again — an index, a count, a previously computed value, or anything else beyond mere presence — a Map is the structure that was actually designed to support storing and retrieving that additional data.',
        aHi: 'Dono \`Set\` aur \`Map\` bilkul usi underlying hash table mechanism par banaaye gaye hain — wahi hash function jo ek key ko ek bucket index mein badalta hai, wahi collision-handling strategy, aur wahi load-factor-triggered resizing — matlab dono identical \`O(1)\` average-case lookup, insertion, aur membership-check keemat pradaan karte hain. Kyunki unki underlying performance characteristics sach mein identical hain, unke beech chunaav performance ke aadhaar par bilkul justify nahi kiya jaa sakta; ye poori tarah is baat ka sawaal hai ki khaas problem ko asal mein kis shape ki jaankaari chahiye. Ek \`Set\` bilkul ek tarah ke sawaal ka jawaab dene ke liye design kiya gaya hai: kya ye khaas value collection ke andar maujood hai ya nahi, ek shuddh haan-ya-na membership check har store ki gayi value ke saath kuch aur na joda hue. Ek \`Map\` ek sach mein alag sawaal ke liye design kiya gaya hai: is khaas key ko dekhte hue, iske saath associated asli data value kya hai, har key ke saath asli, maayne-yogya data ke storage aur retrieval ko support karte hue, sirf iski maujoodgi ya na-maujoodgi nahi. Unhe alag batane ke liye thos signal ye poochna hai, kisi bhi khaas problem ke liye, ki kya ek match milne ke baad ek saadhe haan-ya-na jawaab se aage kuch bhi sach mein chahiye. Agar sirf ek cheez jo kabhi maayne rakhti hai ye hai ki kya kuch pehle dekha gaya hai, iske baare mein aur data yaad karne ki zaroorat ke bina, ek \`Set\` seedhe aur imaandaari se us zaroorat ko darsata hai. Agar problem ko ek khaas key ke saath judi kuch atirikt jaankaari yaad rakhne ki zaroorat hai ek baar wo key dobara milti hai — ek index, ek count, ek pehle gani gayi value, ya sirf maujoodgi se aage kuch aur — ek \`Map\` wo structure hai jise asal mein us atirikt data ko store aur retrieve karne ke support ke liye design kiya gaya tha.',
      },
      {
        q: 'Why does a hash table (Set or Map) fail to efficiently answer questions about order, such as "what is the smallest key currently stored", despite offering O(1) average lookup?',
        qHi: 'Ek hash table (\`Set\` ya \`Map\`) order ke baare mein sawaalon ka kushalta se jawaab dene mein kyun fail hoti hai, jaisa "abhi store ki gayi sabse chhoti key kya hai", is baat ke bawajood ki ye \`O(1)\` average lookup pradaan karti hai?',
        a: 'A hash table\'s O(1) average lookup speed comes specifically from a hash function computing a key\'s bucket position directly from the key\'s own value, deliberately with no relationship whatsoever to any other key\'s value or position. This is precisely the design choice that makes lookup fast: a key\'s bucket index depends only on that one key, computed independently of everything else in the table, so finding it never requires consulting or comparing against any other stored key. This same design choice, however, is exactly what makes order-dependent questions impossible to answer efficiently using the structure\'s own organization. Two keys that are numerically or alphabetically adjacent to each other — the values 41 and 42, for instance — are hashed completely independently and have no reason to end up anywhere near each other in the bucket array; one could easily land in the very first bucket while the other lands in the very last one, with no relationship between their physical storage positions and their logical adjacency in value. Because of this, a question like "what is the smallest key currently in the table" cannot be answered by looking at any particular bucket or a small number of buckets — nothing about the table\'s own structure indicates which bucket, among potentially many, happens to hold the smallest value, so answering this would require examining every single entry in the table, an O(n) operation, completely erasing the fast-lookup advantage the hash table otherwise provides. Structures specifically designed to maintain order — a sorted array, or the balanced trees this course\'s later Trees module covers — deliberately preserve a relationship between a key\'s value and its position, which is precisely what allows them to answer order-dependent questions efficiently, at the cost of the O(1) average lookup a hash table\'s specific design achieves by giving up exactly that same relationship.',
        aHi: 'Ek hash table ki \`O(1)\` average lookup speed khaas taur par ek hash function se aati hai jo ek key ki bucket position seedhe key ki apni value se ganta hai, jaan-boojhkar kisi bhi doosri key ki value ya position se koi bhi rishta na rakhte hue. Ye bilkul wo design faisla hai jo lookup ko tez banaata hai: ek key ka bucket index sirf us ek key par nirbhar karta hai, table mein baaki har cheez se azaadi se gana gaya, isliye ise dhoondhne mein kabhi kisi doosri stored key se poochhne ya compare karne ki zaroorat nahi hoti. Yahi design faisla, halaanki, bilkul wo hai jo order-dependent sawaalon ko structure ke apne organization se kushalta se jawaab dena namumkin banaata hai. Do keys jo numerically ya alphabetically ek doosre ke adjacent hain — misal ke taur par values 41 aur 42 — poori tarah azaadi se hash ki jaati hain aur bucket array mein ek doosre ke aas-paas kahin bhi khatam hone ka koi kaaran nahi rakhtin; ek aasaani se bilkul pehle bucket mein utar sakti hai jabki doosri bilkul aakhri mein utarti hai, unki physical storage positions aur unki logical value mein adjacency ke beech koi rishta na hote hue. Isi wajah se, "table mein abhi sabse chhoti key kya hai" jaisa sawaal kisi khaas bucket ya buckets ki ek chhoti tadaad ko dekhkar jawaab nahi diya jaa sakta — table ki apni structure ke baare mein kuch bhi ye nahi darsata ki sambhaavit roop se kayi mein se kaunsa bucket samyog se sabse chhoti value rakhta hai, isliye iska jawaab dene ke liye table ki har akeli entry examine karni padegi, ek \`O(n)\` operation, us fast-lookup faayde ko poori tarah mitaate hue jo hash table anyatha pradaan karta hai. Structures jo khaas taur par order banaaye rakhne ke liye design kiye gaye hain — ek sorted array, ya balanced trees jise is course ka baad ka Trees module cover karta hai — jaan-boojhkar ek key ki value aur uski position ke beech ek rishta preserve karte hain, jo bilkul wo hai jo unhe order-dependent sawaalon ka kushalta se jawaab dene deta hai, us \`O(1)\` average lookup ki keemat par jo ek hash table ka khaas design bilkul wahi rishta chhodkar haasil karta hai.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken Map-based hasDuplicates and the fixed Set-based version from this lesson. Confirm both produce identical results across several test arrays, then explain in one sentence why the Set version is preferable despite identical output.',
        taskHi: 'Is lesson ka toota \`Map\`-based \`hasDuplicates\` aur theek \`Set\`-based version dono banao. Confirm karo ki dono kayi test arrays ke aar-paar identical nateeje banaate hain, phir ek vaakya mein samjhaao ki \`Set\` version behtar kyun hai identical output ke bawajood.',
        hint: 'Focus your explanation on what the Map version\'s stored value is actually used for, if anything.',
        hintHi: 'Apni samjhaaish ko is baat par focus karo ki \`Map\` version ki stored value asal mein kis ke liye istemal hoti hai, agar kuch bhi.',
      },
      {
        task: 'Rebuild the two-sum solution from this lesson using a Set instead of a Map, and confirm it genuinely cannot solve the problem correctly — you cannot return the required index using only a Set.',
        taskHi: 'Is lesson ka two-sum solution ek \`Map\` ke bajaye ek \`Set\` istemal karke dobara banao, aur confirm karo ki ye sach mein problem ko sahi tarike se sulajhaa nahi sakta — tum zaruri index sirf ek \`Set\` istemal karke return nahi kar sakte.',
        hint: 'Try to write get-the-index logic using only Set.has() and see exactly where you get stuck.',
        hintHi: 'Sirf \`Set.has()\` istemal karke index-nikaalne ki logic likhne ki koshish karo aur bilkul dekho ki tum kahaan phase.',
      },
      {
        task: 'Take one problem from this course\'s earlier modules (from Module 1 or Module 2) and explicitly classify it as order-dependent (favoring sorting/two pointers) or membership/count-dependent (favoring hashing), explaining your reasoning in a sentence.',
        taskHi: 'Is course ke pehle wale modules (Module 1 ya Module 2) se ek problem lo aur ise explicitly order-dependent (sorting/two pointers favor karti hui) ya membership/count-dependent (hashing favor karti hui) ki tarah classify karo, apna tark ek vaakya mein samjhaate hue.',
        hint: 'The anagram-checking lesson from Module 2 is a good one to revisit, since it directly previewed this module\'s own consolidated signal.',
        hintHi: 'Module 2 ka anagram-checking lesson dobara dekhne ke liye ek achha hai, kyunki isne seedhe is module ke apne consolidated signal ko preview kiya.',
      },
    ],

    keyTakeaways: [
      'Set and Map are built on the identical underlying hash table mechanism, offering the same O(1) average performance — the choice between them is about the shape of the question, not speed.',
      'Use a Set when the only question is membership ("does this exist?"); use a Map when a key must be associated with real, meaningful data ("what data goes with this key?").',
      'Storing a meaningless placeholder value in a Map to answer a pure membership question is a conceptual mismatch, even though it produces correct results.',
      'The consolidated signal from this course\'s Module 2 and Module 3 together: order-dependent questions call for sorting or two pointers; membership/count-dependent questions call for hashing.',
      'A hash table deliberately discards any relationship between a key\'s value and its physical storage position, which is exactly what makes lookup fast and what makes order-dependent questions impossible to answer efficiently with it.',
      'Recognizing which of these two question shapes a new, unfamiliar problem actually has is a direct, transferable application of this course\'s foundational pattern-recognition process.',
    ],
    keyTakeawaysHi: [
      '\`Set\` aur \`Map\` identical underlying hash table mechanism par banaaye gaye hain, samaan \`O(1)\` average performance pradaan karte hue — unke beech chunaav sawaal ki shape ke baare mein hai, speed ke baare mein nahi.',
      'Ek \`Set\` istemal karo jab akela sawaal membership hai ("kya ye maujood hai?"); ek \`Map\` istemal karo jab ek key ko asli, maayne-yogya data se joda jaana chahiye ("is key ke saath kaunsa data jaata hai?").',
      'Ek \`Map\` mein ek bemaani placeholder value store karna ek shuddh membership sawaal ka jawaab dene ke liye ek conceptual mismatch hai, chahe ye sahi nateeje banaaye.',
      'Is course ke Module 2 aur Module 3 se saath consolidated signal: order-dependent sawaal sorting ya two pointers maangte hain; membership/count-dependent sawaal hashing maangte hain.',
      'Ek hash table jaan-boojhkar ek key ki value aur uski physical storage position ke beech kisi bhi rishte ko hataata hai, jo bilkul wo hai jo lookup ko tez banaata hai aur order-dependent sawaalon ko isse kushalta se jawaab dena namumkin banaata hai.',
      'Ye pehchaanna ki ek nayi, anjaan problem asal mein in do sawaal shapes mein se kaunsi rakhti hai is course ke buniyaadi pattern-recognition process ka ek seedha, transferable application hai.',
    ],
  },
];
