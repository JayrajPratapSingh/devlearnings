/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 4
 * (final lesson of Module 2).
 *
 * String patterns: anagram checking and palindrome checking, as a
 * capstone that applies this module's own two-pointer technique
 * together with a frequency-count idea this course's next module (on
 * hashing) formalizes. Broken example for anagrams: sorting both
 * strings and comparing the sorted results, a genuinely correct O(n log
 * n) approach that does more work than necessary because it throws away
 * the actual, simpler question being asked ("does every character
 * appear the same number of times in both?"). Fixed with a frequency
 * count in O(n). Broken example for palindromes: building a reversed
 * copy of the string and comparing it to the original, correct but
 * using O(n) extra memory the in-place two-pointer approach from this
 * module's first lesson does not need.
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

export const DSA_MODULE_2_PART4: CourseLesson[] = [
  {
    slug: 'string-patterns-anagrams-palindromes',
    title: 'String Patterns: Anagrams and Palindromes',
    titleHi: 'String Patterns: Anagrams Aur Palindromes',
    description: 'Checking whether two strings are anagrams by sorting both and comparing the results genuinely works — but it pays an O(n log n) sorting cost to answer a question that never actually needed any ordering at all: "does every character appear the same number of times in both strings?"',
    descriptionHi: 'Ye check karna ki do strings anagrams hain ya nahi dono ko sort karke aur nateejon ko compare karke sach mein kaam karta hai — par ye ek \`O(n log n)\` sorting keemat chukaata hai ek aise sawaal ka jawaab dene ke liye jise asal mein kabhi kisi ordering ki zaroorat thi hi nahi: "kya har character dono strings mein samaan tadaad mein aata hai?"',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**Checking whether two shopping carts contain the exact same items by first arranging every item in both carts into alphabetical order and then comparing the two now-ordered lists side by side, versus simply tallying up how many of each specific item is in each cart and comparing those two tallies directly.** Arranging every item alphabetically before comparing genuinely works — two carts with identical contents will produce identical alphabetized lists — but the actual QUESTION being asked, "do these two carts contain the same items in the same quantities," never had anything to do with alphabetical order at all; the order the items happen to sit in was never part of the question, yet the alphabetizing approach pays the real cost of establishing an order regardless. Tallying each specific item\'s count directly — three apples, two loaves of bread, one carton of milk — and comparing those tallies between the two carts answers the exact same question without ever needing to impose any order on either cart\'s contents at all. Checking whether two strings are anagrams by sorting both and comparing the sorted results is the alphabetizing approach: correct, but paying an unnecessary ordering cost to answer a question that was only ever about character counts. Counting each character\'s frequency directly and comparing the two counts is the tallying approach: it answers the identical question using only the information the question actually depends on.',
      hi: '**Ye check karna ki do shopping carts mein bilkul wahi items hain pehle dono carts ke har item ko alphabetical order mein arrange karke aur phir un do ab-ordered lists ko saath-saath compare karke, versus simply ye ganna ki har khaas item kitni tadaad mein har cart mein hai aur un do talliyon ko seedhe compare karna.** Compare karne se pehle har item ko alphabetically arrange karna sach mein kaam karta hai — identical contents waale do carts identical alphabetized lists banaayenge — par asli SAWAAL jo poocha jaa raha hai, "kya in do carts mein samaan quantities mein samaan items hain," ka alphabetical order se bilkul koi lena-dena nahi tha; wo order jismein items samyog se baithe hain kabhi sawaal ka hissa nahi tha, phir bhi alphabetizing approach ek order sthaapit karne ki asli keemat chukaata hai chahe kuch bhi ho. Har khaas item ki count ko seedhe tally karna — teen seb, do double roti, ek dabba doodh — aur un talliyon ko do carts ke beech compare karna bilkul wahi sawaal ka jawaab deta hai kisi bhi cart ki contents par kabhi bhi koi order lagaaye bina. Ye check karna ki do strings anagrams hain ya nahi dono ko sort karke aur sorted nateejon ko compare karke alphabetizing approach hai: sahi, par ek bekaar ordering keemat chukaate hue ek aise sawaal ka jawaab dene ke liye jo kabhi sirf character counts ke baare mein tha hi. Har character ki frequency ko seedhe ganna aur do counts ko compare karna tallying approach hai: ye sawaal ke asal mein nirbhar jaankaari sirf istemal karke identical sawaal ka jawaab deta hai.',
    },

    simple: `**Start broken.** Sorting both strings to check whether they are anagrams:

\`\`\`js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const sorted1 = s1.split("").sort().join("");
  const sorted2 = s2.split("").sort().join("");
  return sorted1 === sorted2;
}
\`\`\`

This is genuinely correct — two strings are anagrams of each other precisely when they contain the same characters in the same quantities, and sorting both strings into a canonical order, then comparing them directly, correctly detects this. The cost this approach pays, unnecessarily, is the sorting itself: \`.sort()\` costs \`O(n log n)\` (this course\'s later sorting module explains exactly why), meaning the entire function costs \`O(n log n)\`, even though the actual question being asked — "does each character appear the same number of times in both strings?" — has nothing to do with order at all.

**The fix: count character frequencies directly, in O(n)**

\`\`\`js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const counts = new Map();
  for (const char of s1) {
    counts.set(char, (counts.get(char) ?? 0) + 1); // tally s1's characters
  }
  for (const char of s2) {
    if (!counts.has(char)) return false;
    counts.set(char, counts.get(char) - 1); // "spend" s2's characters against s1's tally
    if (counts.get(char) === 0) counts.delete(char);
  }
  return counts.size === 0; // every character was exactly accounted for
}
\`\`\`

\`\`\`ts
function isAnagram(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;
  const counts = new Map<string, number>();
  for (const char of s1) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  for (const char of s2) {
    if (!counts.has(char)) return false;
    counts.set(char, (counts.get(char) as number) - 1);
    if (counts.get(char) === 0) counts.delete(char);
  }
  return counts.size === 0;
}
\`\`\`

The first loop tallies how many times each character appears in \`s1\`, costing \`O(n)\`. The second loop "spends" that tally against \`s2\`\'s own characters: each time a character from \`s2\` is seen, its count in the map is decremented, and if a character from \`s2\` was never in \`s1\`\'s tally at all, the strings cannot be anagrams. If every single character from \`s2\` was successfully matched against \`s1\`\'s tally, with nothing left over (\`counts.size === 0\`), the two strings are confirmed anagrams — using only \`O(n)\` total work, since neither loop involves sorting or any other operation whose cost depends on order.`,

    simpleHi: `**Toote hue se shuru.** Ye check karne ke liye ki kya do strings anagrams hain dono ko sort karna:

\`\`\`js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const sorted1 = s1.split("").sort().join("");
  const sorted2 = s2.split("").sort().join("");
  return sorted1 === sorted2;
}
\`\`\`

Ye sach mein sahi hai — do strings ek doosre ke anagrams hain bilkul tab jab wo samaan quantities mein samaan characters rakhti hain, aur dono strings ko ek canonical order mein sort karna, phir unhe seedhe compare karna, ise sahi tarike se detect karta hai. Ye approach jo keemat bekaar mein chukaata hai wo sorting khud hai: \`.sort()\` \`O(n log n)\` kharch karta hai (is course ka baad ka sorting module bilkul samjhaata hai kyun), matlab poora function \`O(n log n)\` kharch karta hai, chahe asli sawaal jo poocha jaa raha hai — "kya har character dono strings mein samaan tadaad mein aata hai?" — ka order se bilkul koi lena-dena nahi hai.

**Fix: character frequencies ko seedhe gino, O(n) mein**

\`\`\`js
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const counts = new Map();
  for (const char of s1) {
    counts.set(char, (counts.get(char) ?? 0) + 1); // s1 ke characters tally karo
  }
  for (const char of s2) {
    if (!counts.has(char)) return false;
    counts.set(char, counts.get(char) - 1); // s2 ke characters ko s1 ki tally ke khilaaf "kharch" karo
    if (counts.get(char) === 0) counts.delete(char);
  }
  return counts.size === 0; // har character bilkul hisaab mein liya gaya
}
\`\`\`

\`\`\`ts
function isAnagram(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;
  const counts = new Map<string, number>();
  for (const char of s1) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  for (const char of s2) {
    if (!counts.has(char)) return false;
    counts.set(char, (counts.get(char) as number) - 1);
    if (counts.get(char) === 0) counts.delete(char);
  }
  return counts.size === 0;
}
\`\`\`

Pehla loop tally karta hai ki har character \`s1\` mein kitni baar aata hai, \`O(n)\` kharch karte hue. Doosra loop us tally ko \`s2\` ke apne characters ke khilaaf "kharch" karta hai: har baar jab \`s2\` se ek character dekha jaata hai, map mein iski count decrement hoti hai, aur agar \`s2\` se ek character kabhi \`s1\` ki tally mein bilkul nahi tha, strings anagrams nahi ho sakti. Agar \`s2\` se har akela character safaltapoorvak \`s1\` ki tally ke khilaaf match hua, kuch bhi bacha na hote hue (\`counts.size === 0\`), do strings confirmed anagrams hain — sirf \`O(n)\` total kaam istemal karte hue, kyunki na kisi loop mein sorting shaamil hai aur na koi doosra operation jiski keemat order par nirbhar karti hai.`,

    content: `## Palindrome checking: the same in-place two-pointer technique, applied to strings

\`\`\`js
function isPalindromeBroken(s) {
  const reversed = s.split("").reverse().join(""); // a full second string
  return s === reversed;
}

function isPalindrome(s) { // two pointers — this module's first lesson, applied to a string
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
\`\`\`

Building a fully reversed copy of a string and comparing it to the original is genuinely correct, but it allocates an entirely new string (this course\'s Module 1 lesson on string immutability already established why this has a real memory cost) purely to answer a question that never actually needed the full reversed string to exist — only whether characters at mirrored positions match. The two-pointer version, the exact same \`left\`/\`right\` opposite-ends technique this module\'s first lesson introduced for arrays, applies identically to a string: check the outermost pair, move both pointers inward, and stop as soon as any mismatched pair is found, without ever needing to build a second string at all.

## Recognizing when a hashing-based frequency count beats sorting

\`\`\`
Question is about ORDER (is this the k-th smallest? are these already
  in sequence?)              → sorting is genuinely necessary

Question is only about COUNTS (does each thing appear the same number
  of times? are there any duplicates at all?) → a frequency count
  (via a Map, or, when the input is a small fixed alphabet like
  lowercase English letters, a plain 26-slot array) answers it in
  O(n), without paying sorting's O(n log n) cost at all
\`\`\`

The anagram example in this lesson demonstrates a genuinely common and valuable habit: before reaching for sorting to compare two collections, explicitly checking whether the actual question being asked depends on ORDER at all, or only on COUNTS. This course\'s next module covers hashing in full depth — how a \`Map\` achieves its \`O(1)\` average lookup and update cost internally — but the anagram example previews the specific, common shape of when hashing is the right tool: whenever "how many of each thing are there" is the real question, and the actual arrangement or order of the items was never part of what needed answering.

## Both patterns from this lesson combine techniques from earlier in this module

\`\`\`
Palindrome check:  this module's OWN two-pointer technique (lesson 1),
                    applied to a string instead of an array

Anagram check:      a frequency-count idea previewing this course's
                    NEXT module (hashing), replacing an unnecessary
                    sort with a direct, order-independent tally
\`\`\`

Neither of this lesson\'s two solutions introduces a genuinely new mechanical idea — the palindrome fix reapplies this module\'s own opposite-ends two-pointer technique to a different data type (a string rather than an array), and the anagram fix previews the frequency-counting idea this course\'s very next module builds into its own full lesson. This is deliberate: recognizing that a familiar technique from an earlier lesson applies to a problem that looks superficially different (checking a palindrome does not obviously look like reversing an array) is exactly the pattern-recognition skill this course\'s Module 1 problem-solving-framework lesson set out to build, and this lesson is the first place in the course where two previously-separate ideas are deliberately combined to solve two new, applied problems.`,

    contentHi: `## Palindrome checking: wahi in-place two-pointer technique, strings par lagu ki gayi

\`\`\`js
function isPalindromeBroken(s) {
  const reversed = s.split("").reverse().join(""); // ek poori doosri string
  return s === reversed;
}

function isPalindrome(s) { // two pointers — is module ka pehla lesson, ek string par lagu
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
\`\`\`

Ek string ki poori tarah reverse ki gayi copy banaana aur ise asli se compare karna sach mein sahi hai, par ye ek bilkul-nayi string allocate karta hai (is course ke Module 1 ke string immutability lesson ne pehle hi sthaapit kiya ki iski asli memory keemat kyun hai) sirf ek aise sawaal ka jawaab dene ke liye jise asal mein kabhi poori reversed string ke maujood hone ki zaroorat thi hi nahi — sirf ye ki kya mirrored positions par characters mel khaate hain. Two-pointer version, bilkul wahi \`left\`/\`right\` virudh-sirron waali technique jise is module ke pehle lesson ne arrays ke liye introduce kiya, ek string par samaan roop se lagu hoti hai: sabse baahar wale jode ko check karo, dono pointers ko andar move karo, aur jaise hi koi mismatched joda mile ruk jaao, kabhi bhi ek doosri string banaane ki zaroorat ke bina.

## Pehchaanna ki ek hashing-based frequency count kab sorting se behtar hai

\`\`\`
Sawaal ORDER ke baare mein hai (kya ye k-th sabse chhota hai? kya ye
  pehle se sequence mein hain?)              → sorting sach mein zaruri hai

Sawaal sirf COUNTS ke baare mein hai (kya har cheez samaan tadaad
  mein aati hai? kya koi bhi duplicates hain?) → ek frequency count
  (ek Map ke zariye, ya, jab input ek chhota fixed alphabet ho jaisa
  lowercase English letters, ek saadha 26-slot array) ise \`O(n)\`
  mein jawaab deta hai, sorting ki \`O(n log n)\` keemat bilkul chukaaye
  bina
\`\`\`

Is lesson ka anagram example ek sach mein aam aur maayne-yogya aadat darsata hai: do collections compare karne ke liye sorting pakadne se pehle, explicitly check karo ki asli sawaal jo poocha jaa raha hai ORDER par nirbhar karta hai bilkul, ya sirf COUNTS par. Is course ka agla module hashing ko poori gehraayi mein cover karta hai — ek \`Map\` apni \`O(1)\` average lookup aur update keemat internally kaise haasil karta hai — par anagram example ye preview karta hai ki hashing kab sahi tool hai iski khaas, aam shape: jab bhi "har cheez ki kitni hai" asli sawaal hai, aur items ka asli arrangement ya order kabhi jawaab dene ki zaroorat ka hissa nahi tha.

## Is lesson ke dono patterns is module ke pehle se techniques ko jodte hain

\`\`\`
Palindrome check:  is module ki APNI two-pointer technique (lesson 1),
                    ek array ke bajaye ek string par lagu ki gayi

Anagram check:      ek frequency-count idea jo is course ke AGLE
                    module (hashing) ko preview karta hai, ek bekaar
                    sort ko ek seedhe, order-se-azaad tally se badalte hue
\`\`\`

Is lesson ke do solutions mein se koi bhi ek sach mein nayi mechanical idea introduce nahi karta — palindrome fix is module ki apni virudh-sirron waali two-pointer technique ko ek alag data type (ek array ke bajaye ek string) par dobara lagu karta hai, aur anagram fix us frequency-counting idea ko preview karta hai jise is course ka bilkul agla module apne poore lesson mein banaata hai. Ye jaan-boojhkar hai: ye pehchaanna ki ek pehle lesson se ek jaani-pehchaani technique ek aisi problem par lagu hoti hai jo satah par alag dikhti hai (ek palindrome check karna ek array reverse karne jaisa spashta roop se nahi dikhta) bilkul wo pattern-recognition kaushal hai jise is course ka Module 1 problem-solving-framework lesson banaane ke liye nikla, aur ye lesson course mein pehli jagah hai jahan do pehle-alag ideas ko jaan-boojhkar milaake do naye, lagu kiye gaye problems sulajhaaye jaate hain.`,

    examples: [
      {
        title: 'Broken: sorting both strings to check for an anagram',
        titleHi: 'Toota: ek anagram check karne ke liye dono strings sort karna',
        code: `const sorted1 = s1.split("").sort().join("");
const sorted2 = s2.split("").sort().join("");
return sorted1 === sorted2;`,
        codeJs: `function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const sorted1 = s1.split("").sort().join("");
  const sorted2 = s2.split("").sort().join("");
  return sorted1 === sorted2;
}
// O(n log n) — pays a sorting cost for a question that isn't about order`,
        codeTs: `function isAnagram(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;
  const sorted1 = s1.split("").sort().join("");
  const sorted2 = s2.split("").sort().join("");
  return sorted1 === sorted2;
}
// fully valid TypeScript — the extra cost is a missed pattern, not a type error`,
        output: `isAnagram("listen", "silent") correctly returns true, but at the
cost of sorting both 6-character strings first.`,
        explain: 'Sorting both strings correctly detects an anagram, but pays O(n log n) to answer a question that only ever depended on character counts, not order.',
        explainHi: 'Dono strings sort karna ek anagram ko sahi tarike se detect karta hai, par ek aise sawaal ka jawaab dene ke liye \`O(n log n)\` chukaata hai jo kabhi sirf character counts par nirbhar tha, order par nahi.',
      },
      {
        title: 'Fixed: a frequency count, O(n), no ordering involved',
        titleHi: 'Theek: ek frequency count, O(n), koi ordering shaamil nahi',
        code: `const counts = new Map();
for (const c of s1) counts.set(c, (counts.get(c) ?? 0) + 1);
for (const c of s2) { /* spend against counts */ }
return counts.size === 0;`,
        codeJs: `function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const counts = new Map();
  for (const char of s1) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  for (const char of s2) {
    if (!counts.has(char)) return false;
    counts.set(char, counts.get(char) - 1);
    if (counts.get(char) === 0) counts.delete(char);
  }
  return counts.size === 0;
}`,
        codeTs: `function isAnagram(s1: string, s2: string): boolean {
  if (s1.length !== s2.length) return false;
  const counts = new Map<string, number>();
  for (const char of s1) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }
  for (const char of s2) {
    if (!counts.has(char)) return false;
    counts.set(char, (counts.get(char) as number) - 1);
    if (counts.get(char) === 0) counts.delete(char);
  }
  return counts.size === 0;
}`,
        outputJs: `isAnagram("listen", "silent") returns true using two O(n) passes
and no sorting at all — a genuine O(n) total, faster than O(n log n).`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'Tallying character counts directly answers the exact same question as sorting, using only the information (counts, not order) the question actually depends on.',
        explainHi: 'Character counts ko seedhe tally karna bilkul wahi sawaal ka jawaab deta hai jo sorting deta, sirf us jaankaari (counts, order nahi) ka istemal karke jispar sawaal asal mein nirbhar karta hai.',
      },
      {
        title: 'Palindrome check: in-place two pointers instead of a reversed copy',
        titleHi: 'Palindrome check: ek reversed copy ke bajaye in-place two pointers',
        code: `let left = 0, right = s.length - 1;
while (left < right) {
  if (s[left] !== s[right]) return false;
  left++; right--;
}`,
        codeJs: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
// no second string ever built — the same two-pointer technique
// from this module's arrays lesson, applied to a string`,
        codeTs: `function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
        outputJs: `isPalindrome("racecar") returns true, and isPalindrome("hello")
returns false immediately once the outermost 'h' and 'o' mismatch —
no reversed copy of the string is ever allocated.`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The same opposite-ends two-pointer mechanic from this module\'s first lesson applies directly to a string, avoiding the memory cost of building a full reversed copy.',
        explainHi: 'Is module ke pehle lesson ka wahi virudh-sirron waala two-pointer mechanic ek string par seedhe lagu hota hai, ek poori reversed copy banaane ki memory keemat se bachte hue.',
      },
    ],

    mistakes: [
      {
        wrong: `const sorted1 = s1.split("").sort().join("");
const sorted2 = s2.split("").sort().join("");
return sorted1 === sorted2;
// paying O(n log n) for a question that is only about counts`,
        right: `const counts = new Map();
// tally s1, spend against s2 — O(n), no ordering involved`,
        why: 'Sorting to compare character counts pays an unnecessary O(n log n) ordering cost for a question ("does each character appear the same number of times?") that never depended on order.',
        whyHi: 'Character counts compare karne ke liye sort karna ek bekaar \`O(n log n)\` ordering keemat chukaata hai ek aise sawaal ke liye ("kya har character samaan tadaad mein aata hai?") jo kabhi order par nirbhar tha hi nahi.',
      },
      {
        wrong: `const reversed = s.split("").reverse().join("");
return s === reversed;
// allocates a full second string just to check character-by-character equality`,
        right: `let left = 0, right = s.length - 1;
while (left < right) { if (s[left] !== s[right]) return false; left++; right--; }`,
        why: 'Building a fully reversed copy to check a palindrome uses O(n) extra memory that the in-place, opposite-ends two-pointer technique from this module\'s first lesson does not need.',
        whyHi: 'Ek palindrome check karne ke liye ek poori reversed copy banaana \`O(n)\` atirikt memory istemal karta hai jo is module ke pehle lesson ki in-place, virudh-sirron waali two-pointer technique ki zaroorat nahi hoti.',
      },
      {
        wrong: `// treating "sort things to compare them" as the default approach
// for any problem involving comparing two collections`,
        right: `// checking first whether the question is about ORDER or only
// about COUNTS, before reaching for sorting by default`,
        why: 'Sorting is the right tool specifically when a problem genuinely depends on order — defaulting to it for a counts-only question pays an avoidable O(n log n) cost instead of a genuine O(n).',
        whyHi: 'Sorting sahi tool hai khaas taur par jab ek problem sach mein order par nirbhar karti hai — ek sirf-counts-waale sawaal ke liye ise default banaana ek bachne-laayak \`O(n log n)\` keemat chukaata hai ek asli \`O(n)\` ke bajaye.',
      },
    ],

    realWorld: [
      {
        en: '**"Valid Anagram" and "Valid Palindrome" are among the most commonly cited beginner-to-intermediate interview problems**, specifically because they test whether a candidate reaches for the efficient, targeted technique rather than a correct-but-wasteful default.',
        hi: '**"Valid Anagram" aur "Valid Palindrome" beginner-se-intermediate interview problems mein sabse aam taur par cite ki jaane waali hain**, khaas taur par kyunki wo test karti hain ki kya ek candidate kushal, targeted technique pakadta hai ek sahi-par-bekaar default ke bajaye.',
      },
      {
        en: '**Checking whether an item\'s composition matches another\'s, without caring about internal ordering, is a genuinely common real data-validation task** — comparing two datasets\' contents, verifying inventory counts, and similar checks all reduce to the same frequency-count idea.',
        hi: '**Ye check karna ki ek item ka composition doosre se mel khaata hai, internal ordering ki parwaah kiye bina, ek sach mein aam asli data-validation kaam hai** — do datasets ki contents compare karna, inventory counts verify karna, aur samaan checks sab usi frequency-count idea tak reduce hote hain.',
      },
      {
        en: '**Palindrome-checking via two pointers is a standard, widely taught example specifically because it demonstrates a single technique (from this module\'s array lesson) generalizing cleanly to an entirely different data type.**',
        hi: '**Two pointers ke zariye palindrome-checking ek standard, widely taught example hai khaas taur par kyunki ye ek akeli technique (is module ke array lesson se) ko ek poori tarah alag data type tak saaf tarike se generalize hote hue darsata hai.**',
      },
    ],

    interviewQA: [
      {
        q: 'Why does sorting both strings to check for an anagram work correctly, and why is a frequency count still the better solution despite both approaches being correct?',
        qHi: 'Ek anagram check karne ke liye dono strings sort karna sahi tarike se kyun kaam karta hai, aur ek frequency count phir bhi behtar solution kyun hai is baat ke bawajood ki dono approaches sahi hain?',
        a: 'Two strings are anagrams of each other precisely when they are composed of the exact same characters in the exact same quantities, regardless of what order those characters happen to appear in within each string. Sorting both strings into a single, consistent, canonical order — alphabetical order, specifically — works correctly because any two strings with identical character compositions will, once sorted, produce character sequences that are byte-for-byte identical, since sorting removes the one difference (arrangement) that could otherwise make two strings with the same characters look different, leaving only a difference in actual character composition able to make the sorted results differ. This correctly reduces the anagram question to a simple string-equality check, but it does so at a real cost: sorting an n-character string requires O(n log n) work, using a general-purpose comparison-based sorting algorithm. A frequency-count approach answers the exact same underlying question — do these two strings have the same characters in the same quantities — without ever needing to establish any order over the characters at all, since counting how many times each distinct character appears, and then confirming both strings\' counts match exactly, is a direct, faithful restatement of what "anagram" actually means, with no detour through ordering required. Tallying each string\'s character counts costs O(n) — a single pass through each string\'s characters — making the total cost of the frequency-count approach O(n), genuinely and provably faster than the O(n log n) sorting-based approach for large inputs, despite both approaches producing identical, correct results. The frequency-count approach is preferred specifically because it uses only the information the actual question depends on (counts), whereas sorting introduces and then pays for an intermediate property (order) that the question never actually cared about.',
        aHi: 'Do strings ek doosre ke anagrams hain bilkul tab jab wo bilkul samaan characters se bilkul samaan quantities mein banaayi gayi hain, is baat se azaad ki wo characters har string ke andar samyog se kis order mein dikhte hain. Dono strings ko ek akele, consistent, canonical order mein sort karna — khaas taur par alphabetical order — sahi tarike se kaam karta hai kyunki identical character compositions waali koi bhi do strings, ek baar sort hone par, byte-for-byte identical character sequences banaayengi, kyunki sorting us ek farak ko hataata hai (arrangement) jo anyatha samaan characters waali do strings ko alag dikha sakta hai, sirf asli character composition mein ek farak ko sorted nateejon ko alag banaane ki kshamta chhodte hue. Ye sahi tarike se anagram sawaal ko ek saadhe string-equality check tak reduce karta hai, par ye ek asli keemat par karta hai: ek n-character string sort karne ke liye \`O(n log n)\` kaam chahiye, ek general-purpose comparison-based sorting algorithm istemal karte hue. Ek frequency-count approach bilkul wahi underlying sawaal ka jawaab deta hai — kya in do strings mein samaan characters samaan quantities mein hain — kabhi characters par koi order sthaapit karne ki zaroorat ke bina bilkul, kyunki ye ganna ki har alag character kitni baar aata hai, aur phir confirm karna ki dono strings ki counts bilkul mel khaati hain, is baat ka ek seedha, sachcha dobara-bayaan hai ki "anagram" ka asal mein kya matlab hai, ordering ke zariye koi ghoomna zaruri nahi. Har string ki character counts tally karna \`O(n)\` kharch karta hai — har string ke characters ke through ek akela pass — frequency-count approach ki total keemat \`O(n)\` banaate hue, bade inputs ke liye sach mein aur provably \`O(n log n)\` sorting-based approach se tez, is baat ke bawajood ki dono approaches identical, sahi nateeje banaate hain. Frequency-count approach khaas taur par pasand kiya jaata hai kyunki ye sirf us jaankaari (counts) ka istemal karta hai jispar asli sawaal nirbhar karta hai, jabki sorting ek beech ki property (order) introduce aur phir chukaata hai jiski sawaal ne asal mein kabhi parwaah nahi ki.',
      },
      {
        q: 'Why does the palindrome-checking two-pointer technique work identically whether applied to an array or a string, and what does this suggest about how to recognize when a technique from one lesson applies to a seemingly different problem?',
        qHi: 'Palindrome-checking two-pointer technique chahe ek array par lagu ki jaaye ya ek string par identical roop se kyun kaam karti hai, aur ye is baare mein kya sujhaava deta hai ki ek lesson ki technique ek dikhne mein alag problem par kab lagu hoti hai ye kaise pehchaano?',
        a: 'The opposite-ends two-pointer technique this course\'s earlier array-reversal lesson introduced does not actually depend on anything specific to arrays as a data type — its underlying requirement is simply that the data structure support indexed access to its elements, and that there is a meaningful notion of a "first" and "last" position with everything else arranged in between. A string satisfies both of these requirements just as fully as an array does: an individual character at a specific position within a string can be read directly via indexing (s[i] in JavaScript), and a string has a well-defined first and last character with every other character positioned in between them. Because the technique\'s actual mechanics — start one pointer at the first position and another at the last, compare what each currently points at, and move both inward — never actually reference anything array-specific, such as array-only methods or array-only memory layout assumptions, the exact same code pattern applies to checking whether a string reads identically forwards and backwards, simply by substituting string indexing for array indexing. This generalizes into a genuinely useful, broader recognition habit: when learning a new technique, it is worth explicitly identifying what STRUCTURAL property that technique actually depends on, separate from whichever specific data type it happened to be introduced with. If a new, unfamiliar problem\'s own data has that same structural property, whether or not the problem is phrased using the same words as the one a technique was first taught with, the technique likely still applies. This is precisely the pattern-recognition skill this course\'s foundational problem-solving-framework lesson aimed to build, and this lesson\'s palindrome example is the first place in the course where that skill is exercised directly: recognizing that "reverse an array in place" and "check if a string is a palindrome" are, underneath their different surface wording, applications of the exact same underlying technique.',
        aHi: 'Virudh-sirron waali two-pointer technique jise is course ke pehle wale array-reversal lesson ne introduce kiya asal mein arrays ke ek data type ki tarah kisi khaas cheez par nirbhar nahi karti — iski underlying zaroorat simply ye hai ki data structure apne elements tak indexed access support kare, aur ki ek "pehla" aur "aakhri" position ka ek maayne-yogya concept ho baaki sab kuch beech mein arranged ho. Ek string in dono zarooraton ko utni hi poori tarah poora karti hai jitna ek array karta hai: ek string ke andar ek khaas position par ek akela character seedhe indexing ke zariye padha jaa sakta hai (JavaScript mein \`s[i]\`), aur ek string ka ek achhi tarah define kiya gaya pehla aur aakhri character hai har doosra character unke beech position kiya gaya. Kyunki technique ki asli mechanics — ek pointer ko pehli position par shuru karo aur doosre ko aakhri par, jo har ek abhi point karta hai use compare karo, aur dono ko andar move karo — asal mein kabhi bhi kuch bhi array-khaas reference nahi karti, jaisa array-only methods ya array-only memory layout dhaarna, bilkul wahi code pattern lagu hota hai ye check karne par ki kya ek string aage aur peeche identical roop se padhi jaati hai, simply array indexing ke liye string indexing badalkar. Ye ek sach mein upyogi, vyaapak pehchaan aadat mein generalize hota hai: ek nayi technique seekhte waqt, ye explicitly pehchaanna vazan rakhta hai ki wo technique asal mein kaunsi STRUCTURAL property par nirbhar karti hai, us khaas data type se alag jiske saath ye samyog se introduce ki gayi thi. Agar ek nayi, anjaan problem ke apne data mein wahi structural property hai, chahe problem usi shabdon istemal karke bayaan ki gayi ho ya nahi jinke saath ek technique pehli baar sikhaayi gayi thi, technique shaayad phir bhi lagu hoti hai. Ye bilkul wahi pattern-recognition kaushal hai jise is course ke buniyaadi problem-solving-framework lesson ka maksad tha banaana, aur is lesson ka palindrome example course mein pehli jagah hai jahan wo kaushal seedhe istemal kiya jaata hai: ye pehchaanna ki "ek array ko in place mein reverse karo" aur "check karo ki kya ek string palindrome hai" apne alag surface wording ke neeche, bilkul usi underlying technique ke applications hain.',
      },
    ],

    exercises: [
      {
        task: 'Build the broken (sort-based) and fixed (frequency-count) isAnagram functions from this lesson. Time both against a pair of 100,000-character strings using console.time/console.timeEnd.',
        taskHi: 'Is lesson ke toote (sort-based) aur theek (frequency-count) \`isAnagram\` functions dono banao. Dono ko 100,000-character strings ki ek jodi ke khilaaf \`console.time\`/\`console.timeEnd\` istemal karke time karo.',
        hint: 'Build the two large test strings by shuffling the same set of characters into two different random orders, so they are guaranteed to be anagrams of each other.',
        hintHi: 'Do bade test strings usi characters ke set ko do alag random orders mein shuffle karke banaao, taaki wo guarantee ke saath ek doosre ke anagrams hon.',
      },
      {
        task: 'Build both the broken (reversed-copy) and fixed (two-pointer) isPalindrome functions from this lesson. Trace through isPalindrome("racecar") by hand, writing down left and right\'s values and the characters they point at after every iteration.',
        taskHi: 'Is lesson ke toote (reversed-copy) aur theek (two-pointer) \`isPalindrome\` functions dono banao. \`isPalindrome("racecar")\` ko haath se trace karo, \`left\` aur \`right\` ki values aur wo characters likhte hue jo har iteration ke baad wo point karte hain.',
        hint: 'This is the exact same tracing habit this course\'s Module 1 problem-solving-framework lesson introduced — write down each variable\'s value after every single line, not just the final result.',
        hintHi: 'Ye bilkul wahi tracing aadat hai jise is course ke Module 1 problem-solving-framework lesson ne introduce kiya — har akeli line ke baad har variable ki value likho, sirf aakhri nateeja nahi.',
      },
      {
        task: 'Write a one-sentence explanation of why the palindrome-checking two-pointer technique works on a string even though it was originally introduced for reversing an array, identifying the specific structural property both data types share.',
        taskHi: 'Ek vaakya mein samjhaao ki palindrome-checking two-pointer technique ek string par kyun kaam karti hai chahe ye asal mein ek array reverse karne ke liye introduce ki gayi thi, us khaas structural property ko pehchaante hue jise dono data types share karte hain.',
        hint: 'Focus on what both arrays and strings support (indexed access, a defined first and last position), not on how they otherwise differ.',
        hintHi: 'Is baat par focus karo ki dono arrays aur strings kya support karte hain (indexed access, ek defined pehla aur aakhri position), is baat par nahi ki wo anyatha kaise alag hain.',
      },
    ],

    keyTakeaways: [
      'Sorting two strings to check whether they are anagrams works, but pays an unnecessary O(n log n) ordering cost for a question that only ever depended on character counts, not order.',
      'A frequency count, tallying each character in one string and spending that tally against the other, answers the same anagram question in a genuine O(n).',
      'Building a fully reversed copy of a string to check a palindrome works, but uses O(n) extra memory that an in-place, opposite-ends two-pointer approach does not need.',
      'The exact same opposite-ends two-pointer technique from this module\'s array-reversal lesson applies directly to strings, since both support indexed access and a defined first/last position.',
      'The general habit worth building is checking whether a problem\'s actual question depends on order (favoring sorting) or only on counts (favoring a frequency count via hashing).',
      'Recognizing that a technique from one lesson applies to a superficially different problem comes from identifying the structural property the technique actually depends on, not the specific data type it was first taught with.',
    ],
    keyTakeawaysHi: [
      'Do strings ko anagrams check karne ke liye sort karna kaam karta hai, par ek bekaar \`O(n log n)\` ordering keemat chukaata hai ek aise sawaal ke liye jo kabhi sirf character counts par nirbhar tha, order par nahi.',
      'Ek frequency count, ek string mein har character ko tally karte hue aur us tally ko doosre ke khilaaf kharch karte hue, wahi anagram sawaal ka jawaab ek asli \`O(n)\` mein deta hai.',
      'Ek palindrome check karne ke liye ek string ki poori tarah reversed copy banaana kaam karta hai, par \`O(n)\` atirikt memory istemal karta hai jo ek in-place, virudh-sirron waala two-pointer approach ki zaroorat nahi hoti.',
      'Is module ke array-reversal lesson ki bilkul wahi virudh-sirron waali two-pointer technique strings par seedhe lagu hoti hai, kyunki dono indexed access aur ek defined pehla/aakhri position support karte hain.',
      'General aadat jo banaane laayak hai ye check karna hai ki ek problem ka asli sawaal order par nirbhar karta hai (sorting favor karte hue) ya sirf counts par (hashing ke zariye ek frequency count favor karte hue).',
      'Ye pehchaanna ki ek lesson ki technique ek satah par alag problem par lagu hoti hai us structural property ko pehchaanne se aata hai jispar technique asal mein nirbhar karti hai, us khaas data type se nahi jiske saath ye pehli baar sikhaayi gayi thi.',
    ],
  },
];
