/**
 * DSA Complete Course — Module 2: Arrays & Strings Patterns, lesson 7.
 *
 * Substring search in linear time: KMP (Knuth-Morris-Pratt) and Rabin-Karp.
 * Builds on this module's lesson 4 (string patterns, frequency counting) and
 * this course's Module 3 (hashing — Rabin-Karp is a hash over a sliding window,
 * so it is this module's sliding-window lesson and Module 3's hashing lesson
 * combined). Broken example: the obvious substring search that, at every
 * starting position in the text, compares the pattern character by character
 * from scratch — on a text like "aaaaaaaaab" with pattern "aaaab" it re-compares
 * almost the whole pattern at every one of the n positions, giving O(n * m).
 * Fixed with KMP: precompute, for each prefix of the pattern, the length of the
 * longest proper prefix that is also a suffix, so that after a mismatch the
 * pattern can slide forward WITHOUT the text pointer ever moving backwards —
 * O(n + m). Rabin-Karp is shown as the alternative: hash the pattern once, roll
 * a hash across the text in O(1) per step, and only do a real comparison when
 * the hashes match.
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

export const DSA_MODULE_2_PART7: CourseLesson[] = [
  {
    slug: 'string-matching-kmp-rabin-karp',
    title: 'String Matching: KMP and Rabin-Karp',
    titleHi: 'String Matching: KMP Aur Rabin-Karp',
    description: 'Searching for a pattern inside a text by trying every starting position and, at each one, comparing the pattern character by character from the beginning. On a text of a million "a"s with the pattern "aaaab", almost the entire pattern matches at every position before failing on the last character, so the work is the text length times the pattern length.',
    descriptionHi: 'Ek text ke andar ek pattern dhoondhna har starting position try karke aur, har ek par, pattern ko shuruaat se character by character compare karke. Ek million "a" ke text par pattern "aaaab" ke saath, lagbhag poora pattern har position par match karta hai aakhri character par fail hone se pehle, isliye kaam text length guna pattern length hai.',
    difficulty: 'HARD',
    duration: 28,
    order: 7,

    analogy: {
      en: '**Looking for a specific phrase in a long book, and what you do the moment a word does not match.** The beginner method: put your finger on word one of the page, check the phrase word by word, and the instant one word is wrong, move your finger forward exactly one word and start the phrase again from its first word. That throws away everything you just learned. Suppose the phrase is "the cat sat on the cat mat" and you have already matched "the cat sat on the cat" before failing. You now know, without looking, that the last two words you read were "the cat" — which happens to be exactly how the phrase begins. So instead of sliding forward one word and re-reading, you can slide forward to line the phrase\'s opening "the cat" up with the "the cat" you have already confirmed, and resume from the third word of the phrase. Your finger on the page never moves backwards. What makes this possible is knowing, in advance and for every prefix of the phrase, how much of its beginning also appears at its end. That table is computed once from the phrase alone, before you open the book, and it is exactly what turns a quadratic search into a linear one.',
      hi: '**Ek lambi kitaab mein ek khaas phrase dhoondhna, aur jis pal ek shabd match nahi karta aap kya karte ho.** Beginner method: page ke shabd ek par ungli rakho, phrase ko shabd dar shabd check karo, aur jis pal ek shabd galat hai, apni ungli bilkul ek shabd aage badhao aur phrase ko iske pehle shabd se phir shuru karo. Wo sab kuch phenk deta hai jo aapne abhi seekha. Maano phrase "the cat sat on the cat mat" hai aur aap fail hone se pehle "the cat sat on the cat" pehle se match kar chuke ho. Aap ab jaante ho, bina dekhe, ki aapne jo aakhri do shabd padhe wo "the cat" the — jo samyog se bilkul waise hi hai jaise phrase shuru hota hai. Toh ek shabd aage slide karke dobara padhne ke bajaye, aap aage slide kar sakte ho phrase ke shuruaati "the cat" ko us "the cat" ke saath line up karne ke liye jise aap pehle se confirm kar chuke ho, aur phrase ke teesre shabd se resume kar sakte ho. Page par aapki ungli kabhi peechhe nahi jaati. Jo ise mumkin banaata hai wo pehle se jaanna hai, aur phrase ke har prefix ke liye, ki iski shuruaat ka kitna hissa iske ant mein bhi aata hai. Wo table sirf phrase se ek baar compute hoti hai, kitaab kholne se pehle, aur wo bilkul wo hai jo ek quadratic search ko ek linear mein badalta hai.',
    },

    simple: `**Start broken.** Naive substring search — restart the pattern at every position:

\`\`\`js
function indexOfNaive(text, pattern) {
  const n = text.length, m = pattern.length;
  for (let i = 0; i + m <= n; i++) {          // every starting position
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) j++;   // compare from scratch
    if (j === m) return i;                    // full match
    // mismatch: THROW AWAY the j characters we just verified, and slide by 1
  }
  return -1;
}

// text    = "aaaaaaaaab"   (n = 10)
// pattern = "aaaab"        (m = 5)
// At i = 0 we match a,a,a,a then fail on 'b' vs 'a' -> 5 comparisons, slide by 1.
// At i = 1 the same thing. And at i = 2, 3, 4, 5...  ~n * m comparisons total.
\`\`\`

The waste is precise: at position \`i\` we verified that \`text[i..i+j-1]\` equals \`pattern[0..j-1]\`, then discarded that knowledge entirely and re-read those same text characters from position \`i+1\`. The text pointer moves *backwards*. On adversarial input (many repeated characters) this is O(n * m) — for a million-character text and a thousand-character pattern, 10^9 comparisons.

**The fix: KMP — precompute how far the pattern can slide after a mismatch**

\`\`\`js
// lps[i] = length of the longest PROPER prefix of pattern[0..i]
//          that is also a SUFFIX of pattern[0..i]
function buildLPS(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;                                 // length of the current matching prefix
  let i = 1;                                   // lps[0] is always 0
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;                        // extend the prefix-suffix match
    } else if (len > 0) {
      len = lps[len - 1];                      // fall back to the next-best prefix
    } else {
      lps[i++] = 0;                            // no prefix-suffix at all here
    }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  if (pattern.length === 0) return 0;
  const lps = buildLPS(pattern);
  let i = 0, j = 0;                            // i indexes text, j indexes pattern
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === pattern.length) return i - j;  // full match
    } else if (j > 0) {
      j = lps[j - 1];                          // slide the PATTERN, do not move i
    } else {
      i++;                                     // no partial match to keep
    }
  }
  return -1;
}
\`\`\`

\`\`\`ts
function buildLPS(pattern: string): number[] {
  const m = pattern.length;
  const lps = new Array<number>(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1]!;
    else lps[i++] = 0;
  }
  return lps;
}

function kmpSearch(text: string, pattern: string): number {
  if (pattern.length === 0) return 0;
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === pattern.length) return i - j;
    } else if (j > 0) j = lps[j - 1]!;
    else i++;
  }
  return -1;
}
\`\`\`

The whole idea is the line \`j = lps[j - 1]\`. On a mismatch after \`j\` matched characters, we already know those \`j\` text characters equal \`pattern[0..j-1]\`. The longest prefix of the pattern that is also a suffix of that matched part has length \`lps[j-1]\`, so the pattern can be slid forward until that prefix lines up, and matching resumes at pattern index \`lps[j-1]\` — **with \`i\` never decreasing**. Since \`i\` only ever moves forward and \`j\` only decreases when \`i\` stands still, the total work is O(n + m).`,

    simpleHi: `**Toote hue se shuru.** Naive substring search — har position par pattern phir se shuru karo:

\`\`\`js
function indexOfNaive(text, pattern) {
  const n = text.length, m = pattern.length;
  for (let i = 0; i + m <= n; i++) {          // har starting position
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) j++;   // shuru se compare karo
    if (j === m) return i;                    // poora match
    // mismatch: jo j characters humne abhi verify kiye unhe PHENKO, aur 1 se slide karo
  }
  return -1;
}

// text    = "aaaaaaaaab"   (n = 10)
// pattern = "aaaab"        (m = 5)
// i = 0 par hum a,a,a,a match karte hain phir 'b' vs 'a' par fail -> 5 comparisons, 1 se slide.
// i = 1 par wahi cheez. Aur i = 2, 3, 4, 5 par...  kul ~n * m comparisons.
\`\`\`

Barbaadi thik-thik hai: position \`i\` par humne verify kiya ki \`text[i..i+j-1]\` \`pattern[0..j-1]\` ke barabar hai, phir wo gyaan poori tarah phenk diya aur wahi text characters position \`i+1\` se dobara padhe. Text pointer *peechhe* jaata hai. Adversarial input par (bahut repeated characters) ye O(n * m) hai — ek million-character text aur ek hazaar-character pattern ke liye, 10^9 comparisons.

**Fix: KMP — pehle se compute karo ki ek mismatch ke baad pattern kitna slide kar sakta hai**

\`\`\`js
// lps[i] = pattern[0..i] ke sabse lambe PROPER prefix ki length
//          jo pattern[0..i] ka ek SUFFIX bhi hai
function buildLPS(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;                                 // current matching prefix ki length
  let i = 1;                                   // lps[0] hamesha 0 hai
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;                        // prefix-suffix match extend karo
    } else if (len > 0) {
      len = lps[len - 1];                      // agle-best prefix par wapas giro
    } else {
      lps[i++] = 0;                            // yahaan koi prefix-suffix nahi
    }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  if (pattern.length === 0) return 0;
  const lps = buildLPS(pattern);
  let i = 0, j = 0;                            // i text index karta hai, j pattern
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === pattern.length) return i - j;  // poora match
    } else if (j > 0) {
      j = lps[j - 1];                          // PATTERN slide karo, i mat hilao
    } else {
      i++;                                     // rakhne ko koi partial match nahi
    }
  }
  return -1;
}
\`\`\`

\`\`\`ts
function buildLPS(pattern: string): number[] {
  const m = pattern.length;
  const lps = new Array<number>(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1]!;
    else lps[i++] = 0;
  }
  return lps;
}

function kmpSearch(text: string, pattern: string): number {
  if (pattern.length === 0) return 0;
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === pattern.length) return i - j;
    } else if (j > 0) j = lps[j - 1]!;
    else i++;
  }
  return -1;
}
\`\`\`

Poora idea line \`j = lps[j - 1]\` hai. \`j\` matched characters ke baad ek mismatch par, hum pehle se jaante hain ki wo \`j\` text characters \`pattern[0..j-1]\` ke barabar hain. Pattern ka sabse lamba prefix jo us matched hisse ka suffix bhi hai uski length \`lps[j-1]\` hai, isliye pattern ko aage slide kiya jaa sakta hai jab tak wo prefix line up na ho, aur matching pattern index \`lps[j-1]\` par resume hoti hai — **\`i\` kabhi ghate bina**. Kyunki \`i\` sirf aage badhta hai aur \`j\` sirf tab ghatta hai jab \`i\` khada rehta hai, kul kaam O(n + m) hai.`,

    content: `## Reading the LPS table, and why it is the whole algorithm

\`\`\`
pattern:  a  b  a  b  c  a  b  a  b
index:    0  1  2  3  4  5  6  7  8
lps:      0  0  1  2  0  1  2  3  4

lps[3] = 2  because pattern[0..3] = "abab", whose longest proper prefix that is
            also a suffix is "ab" (length 2).
lps[4] = 0  because "ababc" ends in 'c' and no prefix of the pattern ends in 'c'.
lps[8] = 4  because "ababcabab" begins with "abab" and also ends with "abab".

Now a mismatch during the search, after matching j = 8 characters:
  we know the last 8 text characters are "ababcabab".
  lps[7] = 3 -> the last 3 of those ("bab"... no) — careful: we use lps[j-1] = lps[7] = 3,
  meaning "aba" is both a prefix and a suffix of the first 8 characters "ababcaba",
  so we can resume comparing at pattern index 3 without re-reading any text.
\`\`\`

The table says, for every possible amount of progress into the pattern, how much of that progress survives a mismatch. Sliding by one character (the naive approach) is the special case where none survives. The table is built from the pattern alone, so it costs O(m) once and is reused for the whole text.

Building it uses the same trick on itself: when \`pattern[i]\` fails to extend the current prefix of length \`len\`, we fall back to \`lps[len - 1]\`, the next-shorter prefix that might still extend. That inner fallback is why \`buildLPS\` is O(m) rather than O(m^2).

## Why KMP is O(n + m): the amortised argument

\`\`\`
Look at the two pointers:
  i (into the text)     NEVER decreases. Every loop iteration either increments i,
                        or leaves i alone while decreasing j.
  j (into the pattern)  increases by at most 1 per iteration (only when i also
                        increments), and each fallback strictly decreases it.

So j is incremented at most n times over the whole run (once per i increment),
and therefore it can be decreased at most n times in total, because it can never
go below 0. Total iterations <= 2n. Plus O(m) to build the table.
                                             => O(n + m)
\`\`\`

This is the same amortised accounting this course's Module 5 used for the monotonic stack ("each element is pushed once and popped once") and Module 8 for heapify: a pointer that only moves one way bounds the total work, even though a single step can look expensive.

## Rabin-Karp: hash the window instead of comparing it

\`\`\`js
function rabinKarp(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m > n) return -1;
  const BASE = 256, MOD = 1000000007;

  // highestPower = BASE^(m-1) % MOD, used to remove the outgoing character
  let highestPower = 1;
  for (let k = 0; k < m - 1; k++) highestPower = (highestPower * BASE) % MOD;

  let patternHash = 0, windowHash = 0;
  for (let k = 0; k < m; k++) {                       // hash the pattern and the first window
    patternHash = (patternHash * BASE + pattern.charCodeAt(k)) % MOD;
    windowHash  = (windowHash  * BASE + text.charCodeAt(k))    % MOD;
  }

  for (let i = 0; i + m <= n; i++) {
    if (windowHash === patternHash) {                 // hashes agree...
      if (text.startsWith(pattern, i)) return i;      // ...VERIFY, hashes can collide
    }
    if (i + m < n) {                                  // roll the window forward by one
      windowHash = (windowHash - text.charCodeAt(i) * highestPower % MOD + MOD) % MOD;
      windowHash = (windowHash * BASE + text.charCodeAt(i + m)) % MOD;
    }
  }
  return -1;
}
\`\`\`

The rolling hash is this module's sliding-window lesson applied to a hash value: removing the outgoing character and adding the incoming one is O(1), exactly as recomputing a window sum was. Expected running time is O(n + m); the worst case is O(n * m) if an adversary engineers hash collisions, which is why the \`startsWith\` verification is **not optional** — without it the function reports false matches. This course's Module 3 made the same point about hash collisions being inevitable rather than exceptional.

## Choosing between them, and when to use neither

\`\`\`
naive indexOf     O(n*m) worst, O(n) typical    zero setup, fine for short patterns
KMP               O(n+m) guaranteed             O(m) table; no hashing, no false positives
Rabin-Karp        O(n+m) expected               trivial to extend to MULTIPLE patterns
                                                 (hash them all into a set)
built-in indexOf  engine-optimised              use this unless the problem forbids it

Reach for KMP when: the worst case matters (adversarial or highly repetitive
  text), or the interview explicitly asks for linear-time matching.
Reach for Rabin-Karp when: you are searching for many patterns at once, or the
  problem is really "find repeated substrings" (hash every window of length k).
Reach for a trie (Module 7 lesson 5) when: many patterns share prefixes.
\`\`\`

In production, \`String.prototype.indexOf\` is already heavily optimised and usually beats a hand-written KMP. These algorithms earn their place when the input is adversarial, when you need the LPS table for its own sake (it also solves "shortest palindrome" and "repeated substring pattern"), or when the interviewer asks you to prove linear time.`,

    contentHi: `## LPS table padhna, aur ye poora algorithm kyun hai

\`\`\`
pattern:  a  b  a  b  c  a  b  a  b
index:    0  1  2  3  4  5  6  7  8
lps:      0  0  1  2  0  1  2  3  4

lps[3] = 2  kyunki pattern[0..3] = "abab", jiska sabse lamba proper prefix jo
            ek suffix bhi hai "ab" hai (length 2).
lps[4] = 0  kyunki "ababc" 'c' par khatam hota hai aur pattern ka koi prefix 'c' par nahi.
lps[8] = 4  kyunki "ababcabab" "abab" se shuru hota hai aur "abab" par khatam bhi.

Ab search ke dauraan ek mismatch, j = 8 characters match karne ke baad:
  hum jaante hain aakhri 8 text characters "ababcabab" hain.
  hum lps[j-1] = lps[7] = 3 istemal karte hain, matlab "aba" pehle 8 characters
  "ababcaba" ka prefix aur suffix dono hai, isliye hum pattern index 3 par
  compare karna resume kar sakte hain bina koi text dobara padhe.
\`\`\`

Table batata hai, pattern mein har sambhaavit progress ki maatra ke liye, us progress ka kitna hissa ek mismatch se bachta hai. Ek character se slide karna (naive approach) wo khaas case hai jahaan kuch nahi bachta. Table sirf pattern se banti hai, isliye ye ek baar O(m) kharch karti hai aur poore text ke liye reuse hoti hai.

Ise banaana khud par wahi trick istemal karta hai: jab \`pattern[i]\` length \`len\` ke current prefix ko extend karne mein fail hota hai, hum \`lps[len - 1]\` par wapas girte hain, agla-chhota prefix jo abhi bhi extend kar sakta hai. Wo inner fallback wajah hai ki \`buildLPS\` O(m^2) ke bajaye O(m) hai.

## KMP O(n + m) kyun hai: amortised argument

\`\`\`
Do pointers dekho:
  i (text mein)      KABHI nahi ghatta. Har loop iteration ya toh i increment karti hai,
                     ya i ko akela chhodkar j ghataati hai.
  j (pattern mein)   prati iteration zyaada se zyaada 1 badhta hai (sirf jab i bhi
                     increment hota hai), aur har fallback ise sakhti se ghataata hai.

Toh poore run par j zyaada se zyaada n baar increment hota hai (prati i increment ek baar),
aur isliye ise kul zyaada se zyaada n baar ghataaya jaa sakta hai, kyunki ye kabhi 0 se
neeche nahi jaa sakta. Kul iterations <= 2n. Plus table banaane ko O(m).
                                             => O(n + m)
\`\`\`

Ye wahi amortised hisaab hai jo is course ke Module 5 ne monotonic stack ke liye istemal kiya ("har element ek baar push aur ek baar pop hota hai") aur Module 8 ne heapify ke liye: ek pointer jo sirf ek taraf move karta hai kul kaam bound karta hai, chahe ek akela step mehenga dikhe.

## Rabin-Karp: window ko compare karne ke bajaye hash karo

\`\`\`js
function rabinKarp(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m > n) return -1;
  const BASE = 256, MOD = 1000000007;

  // highestPower = BASE^(m-1) % MOD, outgoing character hataane ke liye istemal
  let highestPower = 1;
  for (let k = 0; k < m - 1; k++) highestPower = (highestPower * BASE) % MOD;

  let patternHash = 0, windowHash = 0;
  for (let k = 0; k < m; k++) {                       // pattern aur pehla window hash karo
    patternHash = (patternHash * BASE + pattern.charCodeAt(k)) % MOD;
    windowHash  = (windowHash  * BASE + text.charCodeAt(k))    % MOD;
  }

  for (let i = 0; i + m <= n; i++) {
    if (windowHash === patternHash) {                 // hashes sahmat hain...
      if (text.startsWith(pattern, i)) return i;      // ...VERIFY karo, hashes collide ho sakte hain
    }
    if (i + m < n) {                                  // window ko ek se aage roll karo
      windowHash = (windowHash - text.charCodeAt(i) * highestPower % MOD + MOD) % MOD;
      windowHash = (windowHash * BASE + text.charCodeAt(i + m)) % MOD;
    }
  }
  return -1;
}
\`\`\`

Rolling hash is module ka sliding-window lesson ek hash value par lagaya gaya hai: outgoing character hataana aur incoming jodna O(1) hai, bilkul jaise ek window sum dobara compute karna tha. Expected running time O(n + m) hai; worst case O(n * m) hai agar ek adversary hash collisions engineer karta hai, yahi wajah hai ki \`startsWith\` verification **vaikalpik NAHI hai** — iske bina function jhoothe matches report karta hai. Is course ke Module 3 ne wahi baat kahi ki hash collisions apvaad ke bajaye anivaarya hain.

## Unke beech chunna, aur kab koi bhi istemal na karein

\`\`\`
naive indexOf     O(n*m) worst, O(n) typical    zero setup, chhote patterns ke liye theek
KMP               O(n+m) guaranteed             O(m) table; koi hashing nahi, koi false positives nahi
Rabin-Karp        O(n+m) expected               KAYI patterns tak extend karna trivial
                                                 (unhe sab ek set mein hash karo)
built-in indexOf  engine-optimised              ise istemal karo jab tak problem mana na kare

KMP ki taraf pahuncho jab: worst case maayne rakhta hai (adversarial ya bahut
  repetitive text), ya interview explicitly linear-time matching maangta hai.
Rabin-Karp ki taraf pahuncho jab: aap ek saath kayi patterns dhoondh rahe ho, ya
  problem asal mein "repeated substrings dhoondho" hai (length k ka har window hash karo).
Ek trie (Module 7 lesson 5) ki taraf pahuncho jab: kayi patterns prefixes share karte hain.
\`\`\`

Production mein, \`String.prototype.indexOf\` pehle se bhaari optimise hai aur aksar ek haath-se-likhe KMP ko haraata hai. Ye algorithms apni jagah tab kamaate hain jab input adversarial hai, jab aapko LPS table khud ke liye chahiye (ye "shortest palindrome" aur "repeated substring pattern" bhi solve karta hai), ya jab interviewer aapse linear time saabit karne ko kehta hai.`,

    examples: [
      {
        title: 'Broken: naive search re-reads the text at every position',
        titleHi: 'Toota: naive search har position par text dobara padhta hai',
        code: `while (j < m && text[i + j] === pattern[j]) j++;
// mismatch -> discard the j verified characters, slide i by 1, start over`,
        codeJs: `function indexOfNaive(text, pattern) {
  const n = text.length, m = pattern.length;
  let comparisons = 0;
  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && (comparisons++, text[i + j] === pattern[j])) j++;
    if (j === m) return { index: i, comparisons };
  }
  return { index: -1, comparisons };
}
console.log(indexOfNaive('aaaaaaaaab', 'aaaab'));
// { index: 5, comparisons: 30 } — for a 10-char text and 5-char pattern`,
        codeTs: `function indexOfNaive(text: string, pattern: string): number {
  const n = text.length, m = pattern.length;
  for (let i = 0; i + m <= n; i++) {
    let j = 0;
    while (j < m && text[i + j] === pattern[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`,
        output: `{ index: 5, comparisons: 30 }`,
        explain: 'At each starting position the first four "a"s match before failing, and all four are re-compared at the next position. The verified prefix is discarded every time, so the text pointer effectively moves backwards.',
        explainHi: 'Har starting position par pehle chaar "a" match karte hain fail hone se pehle, aur chaaron agli position par dobara compare hote hain. Verified prefix har baar phenka jaata hai, isliye text pointer asal mein peechhe jaata hai.',
      },
      {
        title: 'Fixed: KMP slides the pattern using the LPS table',
        titleHi: 'Theek: KMP LPS table se pattern slide karta hai',
        code: `else if (j > 0) j = lps[j - 1];   // slide the PATTERN; i never moves back
else i++;`,
        codeJs: `function buildLPS(p) {
  const lps = new Array(p.length).fill(0);
  let len = 0, i = 1;
  while (i < p.length) {
    if (p[i] === p[len]) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  return lps;
}
console.log(buildLPS('ababcabab'));   // [0,0,1,2,0,1,2,3,4]

function kmpSearch(text, pattern) {
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++; if (j === pattern.length) return i - j; }
    else if (j > 0) j = lps[j - 1];
    else i++;
  }
  return -1;
}
console.log(kmpSearch('aaaaaaaaab', 'aaaab'));   // 5, in ~n + m steps
console.log(kmpSearch('ababcababcabab', 'ababcabab'));   // 0`,
        codeTs: `function kmpSearch(text: string, pattern: string): number {
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++; if (j === pattern.length) return i - j; }
    else if (j > 0) j = lps[j - 1]!;
    else i++;
  }
  return -1;
}`,
        outputJs: `[0, 0, 1, 2, 0, 1, 2, 3, 4]
5
0`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'lps[j-1] is how much of the already-matched prefix survives a mismatch, so matching resumes at that pattern index without re-reading any text. i is monotonically increasing, which is what gives O(n + m).',
        explainHi: 'lps[j-1] wo hai ki pehle-se-matched prefix ka kitna hissa ek mismatch se bachta hai, isliye matching us pattern index par resume hoti hai bina koi text dobara padhe. i monotonically badhta hai, jo O(n + m) deta hai.',
      },
      {
        title: 'Rabin-Karp: roll the hash, then verify',
        titleHi: 'Rabin-Karp: hash roll karo, phir verify karo',
        code: `windowHash = (windowHash - text.charCodeAt(i) * highestPower % MOD + MOD) % MOD;
windowHash = (windowHash * BASE + text.charCodeAt(i + m)) % MOD;   // O(1) roll
if (windowHash === patternHash && text.startsWith(pattern, i)) return i;`,
        codeJs: `function rabinKarp(text, pattern) {
  const n = text.length, m = pattern.length;
  if (m > n) return -1;
  const BASE = 256, MOD = 1000000007;
  let hp = 1;
  for (let k = 0; k < m - 1; k++) hp = (hp * BASE) % MOD;
  let ph = 0, wh = 0;
  for (let k = 0; k < m; k++) {
    ph = (ph * BASE + pattern.charCodeAt(k)) % MOD;
    wh = (wh * BASE + text.charCodeAt(k)) % MOD;
  }
  for (let i = 0; i + m <= n; i++) {
    if (wh === ph && text.startsWith(pattern, i)) return i;   // VERIFY on hash hit
    if (i + m < n) {
      wh = (wh - text.charCodeAt(i) * hp % MOD + MOD) % MOD;
      wh = (wh * BASE + text.charCodeAt(i + m)) % MOD;
    }
  }
  return -1;
}
console.log(rabinKarp('hello world', 'world'));   // 6
console.log(rabinKarp('abcdef', 'xyz'));          // -1`,
        codeTs: `function rabinKarp(text: string, pattern: string): number {
  const n = text.length, m = pattern.length;
  if (m > n) return -1;
  const BASE = 256, MOD = 1000000007;
  let hp = 1;
  for (let k = 0; k < m - 1; k++) hp = (hp * BASE) % MOD;
  let ph = 0, wh = 0;
  for (let k = 0; k < m; k++) {
    ph = (ph * BASE + pattern.charCodeAt(k)) % MOD;
    wh = (wh * BASE + text.charCodeAt(k)) % MOD;
  }
  for (let i = 0; i + m <= n; i++) {
    if (wh === ph && text.startsWith(pattern, i)) return i;
    if (i + m < n) {
      wh = (wh - text.charCodeAt(i) * hp % MOD + MOD) % MOD;
      wh = (wh * BASE + text.charCodeAt(i + m)) % MOD;
    }
  }
  return -1;
}`,
        outputJs: `6
-1`,
        outputTs: `// Identical behaviour, fully typed.`,
        explain: 'The window hash is updated in O(1) by removing the outgoing character\'s contribution and shifting in the incoming one — the sliding-window idea applied to a hash. Equal hashes still require a real comparison, because collisions are possible.',
        explainHi: 'Window hash O(1) mein update hota hai outgoing character ka yogdaan hataakar aur incoming ko shift karke — sliding-window idea ek hash par lagaya gaya. Barabar hashes ko abhi bhi ek asli comparison chahiye, kyunki collisions sambhav hain.',
      },
    ],

    mistakes: [
      {
        wrong: `// KMP falling back with lps[j] instead of lps[j - 1]
else if (j > 0) j = lps[j];   // off by one: uses the CURRENT index, not the matched length`,
        right: `else if (j > 0) j = lps[j - 1];   // j characters matched -> look up lps at j - 1`,
        why: 'j is the NUMBER of characters matched so far, so the last matched index is j - 1. Using lps[j] reads the entry for a character that has not been matched, which slides the pattern by the wrong amount and can skip real matches.',
        whyHi: 'j ab tak matched characters ki TADAAD hai, isliye aakhri matched index j - 1 hai. lps[j] istemal karna ek aise character ki entry padhta hai jo matched nahi hua, jo pattern ko galat maatra se slide karta hai aur asli matches skip kar sakta hai.',
      },
      {
        wrong: `// Rabin-Karp returning on a hash match without verifying
if (windowHash === patternHash) return i;   // hash collision -> FALSE MATCH`,
        right: `if (windowHash === patternHash && text.startsWith(pattern, i)) return i;`,
        why: 'Different strings can hash to the same value — Module 3 established that collisions are unavoidable when mapping a large space into a small one. The hash is only a fast filter; the actual character comparison is what confirms a match.',
        whyHi: 'Alag strings usi value par hash ho sakti hain — Module 3 ne sthaapit kiya ki ek badi space ko ek chhoti mein map karte waqt collisions anivaarya hain. Hash sirf ek tez filter hai; asli character comparison wo hai jo ek match confirm karta hai.',
      },
      {
        wrong: `// rolling hash going negative after the subtraction
windowHash = (windowHash - text.charCodeAt(i) * highestPower) % MOD;
// in JS, (-5) % 7 is -5, not 2 -> the hash no longer matches`,
        right: `windowHash = (windowHash - text.charCodeAt(i) * highestPower % MOD + MOD) % MOD;
// add MOD before the final % to force a non-negative result`,
        why: 'JavaScript\'s % keeps the sign of the dividend, so subtracting can leave a negative hash that will never equal the (non-negative) pattern hash. Adding MOD before the final modulo normalises it into the range 0..MOD-1.',
        whyHi: 'JavaScript ka % dividend ka sign rakhta hai, isliye subtract karna ek negative hash chhod sakta hai jo kabhi (non-negative) pattern hash ke barabar nahi hoga. Antim modulo se pehle MOD jodna ise range 0..MOD-1 mein normalise karta hai.',
      },
    ],

    realWorld: [
      {
        en: '**grep, editors, and log scanners** use linear-time matching (usually Boyer-Moore or a variant, with KMP\'s ideas) so that searching a gigabyte log does not degrade on repetitive input.',
        hi: '**grep, editors, aur log scanners** linear-time matching istemal karte hain (aksar Boyer-Moore ya ek variant, KMP ke ideas ke saath) taaki ek gigabyte log search karna repetitive input par degrade na ho.',
      },
      {
        en: '**Plagiarism detection and rsync-style file diffing use rolling hashes** — hash every window of a fixed length and compare hash sets, which is Rabin-Karp generalised to "find shared chunks".',
        hi: '**Plagiarism detection aur rsync-style file diffing rolling hashes istemal karte hain** — ek fixed length ka har window hash karo aur hash sets compare karo, jo "shared chunks dhoondho" tak generalised Rabin-Karp hai.',
      },
      {
        en: '**DNA sequence search** matches short patterns against enormous, highly repetitive strings — precisely the adversarial case where naive search degrades and linear-time matching is required.',
        hi: '**DNA sequence search** chhote patterns ko vishaal, bahut repetitive strings ke against match karta hai — bilkul wo adversarial case jahaan naive search degrade hota hai aur linear-time matching zaroori hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the LPS table in KMP and how it makes the search linear.',
        qHi: 'KMP mein LPS table samjhaao aur ye search ko linear kaise banaata hai.',
        a: 'The LPS table is computed from the pattern alone, before looking at the text. For each index i in the pattern, LPS at i is the length of the longest proper prefix of the pattern up to and including i that is also a suffix of that same stretch. Proper means it cannot be the whole stretch itself. So for the pattern a-b-a-b, the entry at the last index is two, because the stretch a-b-a-b begins with a-b and also ends with a-b. The reason this is useful is what happens on a mismatch during the search. Suppose we have matched j characters of the pattern and then the next character disagrees. We know something the naive algorithm throws away: the last j characters of the text are exactly the first j characters of the pattern. The naive algorithm slides the pattern forward by one position and re-reads all of those characters. But most of those alignments are hopeless, and we can compute which one is the first that could possibly work using only the pattern. That alignment is the one where the longest prefix of the pattern that is also a suffix of the matched part lines up with that suffix, and its length is exactly LPS at j minus one. So instead of resetting j to zero and moving the text pointer back, we set j to LPS at j minus one and leave the text pointer where it is. The text pointer therefore never decreases. That is what gives linear time, by an amortised argument: the text pointer i only increases, so it moves at most n times; j increases only when i increases, so j is incremented at most n times overall; and since j never goes below zero, it can be decreased at most as many times as it was increased. The total number of loop iterations is therefore bounded by about two n, and building the table beforehand costs m, giving O(n plus m).',
        aHi: 'LPS table sirf pattern se compute hoti hai, text dekhne se pehle. Pattern mein har index i ke liye, i par LPS pattern ke i tak aur i sameet sabse lambe proper prefix ki length hai jo us hi stretch ka ek suffix bhi hai. Proper matlab ye poora stretch khud nahi ho sakta. Toh pattern a-b-a-b ke liye, aakhri index par entry do hai, kyunki stretch a-b-a-b a-b se shuru hota hai aur a-b par khatam bhi hota hai. Ye upyogi kyun hai iska kaaran wo hai jo search ke dauraan ek mismatch par hota hai. Maano humne pattern ke j characters match kiye aur phir agla character asahmat hai. Hum kuch jaante hain jo naive algorithm phenk deta hai: text ke aakhri j characters bilkul pattern ke pehle j characters hain. Naive algorithm pattern ko ek position aage slide karta hai aur un sab characters ko dobara padhta hai. Par un alignments mein se adhikaansh nirash hain, aur hum compute kar sakte hain kaunsa pehla hai jo possibly kaam kar sakta hai sirf pattern istemal karke. Wo alignment wo hai jahaan pattern ka sabse lamba prefix jo matched hisse ka suffix bhi hai us suffix ke saath line up hota hai, aur iski length bilkul j minus ek par LPS hai. Toh j ko zero par reset karne aur text pointer wapas le jaane ke bajaye, hum j ko j minus ek par LPS set karte hain aur text pointer jahaan hai wahaan chhodte hain. Text pointer isliye kabhi nahi ghatta. Wahi linear time deta hai, ek amortised argument se: text pointer i sirf badhta hai, isliye ye zyaada se zyaada n baar move karta hai; j sirf tab badhta hai jab i badhta hai, isliye j kul zyaada se zyaada n baar increment hota hai; aur kyunki j kabhi zero se neeche nahi jaata, ise utni hi baar ghataaya jaa sakta hai jitni baar badhaaya gaya.',
      },
      {
        q: 'When would you use Rabin-Karp instead of KMP, and what is the one line you must not omit?',
        qHi: 'Aap KMP ke bajaye Rabin-Karp kab istemal karoge, aur wo ek line kya hai jo aapko nahi chhodni chahiye?',
        a: 'Rabin-Karp wins when you are searching for more than one pattern at the same time, or when the real question is about repeated substrings rather than a single fixed needle. The reason is that its comparison step is a numeric hash rather than a character-by-character check, so if you have a hundred patterns of the same length, you hash all hundred into a set once, then roll a single hash across the text and check set membership at each position. The cost is one pass over the text regardless of how many patterns you are looking for, whereas KMP would need a separate pass, and a separate table, for each pattern. The same property makes Rabin-Karp the natural tool for problems like finding the longest duplicated substring, where you binary search the length and hash every window of that length looking for a repeat, or for content-defined chunking in file synchronisation. KMP is preferable when there is exactly one pattern and you need a hard worst-case guarantee, because KMP is linear no matter what the input looks like, while Rabin-Karp is linear only in expectation. The line you must never omit is the verification after a hash match. A hash maps a large space of strings into a small space of numbers, so by the pigeonhole principle different strings must sometimes produce the same hash. If you return the index as soon as the window hash equals the pattern hash, you will report positions where the text does not actually contain the pattern. The correct form checks the hash first as a cheap filter, and only when it matches does it perform the real character comparison to confirm. That verification is also why the worst case is quadratic: an adversary who can predict your hash function can force a collision at every position, making you verify n times at m characters each.',
        aHi: 'Rabin-Karp tab jeetta hai jab aap ek se zyaada patterns ek saath dhoondh rahe ho, ya jab asli sawaal ek akele fixed needle ke bajaye repeated substrings ke baare mein hai. Kaaran ye hai ki iska comparison step ek character-dar-character check ke bajaye ek numeric hash hai, isliye agar aapke paas usi length ke sau patterns hain, aap saundon ko ek baar ek set mein hash karte ho, phir text par ek akela hash roll karte ho aur har position par set membership check karte ho. Cost text par ek pass hai chahe aap kitne bhi patterns dhoondh rahe ho, jabki KMP ko har pattern ke liye ek alag pass, aur ek alag table, chahiye. Wahi property Rabin-Karp ko sabse lambi duplicated substring dhoondhne jaisi problems ke liye natural tool banaati hai, jahaan aap length ko binary search karte ho aur us length ka har window hash karte ho ek repeat dhoondhte hue. KMP behtar hai jab bilkul ek pattern hai aur aapko ek hard worst-case guarantee chahiye, kyunki KMP linear hai chahe input kaisa bhi ho, jabki Rabin-Karp sirf expectation mein linear hai. Wo line jo aapko kabhi nahi chhodni chahiye wo ek hash match ke baad verification hai. Ek hash strings ki ek badi space ko numbers ki ek chhoti space mein map karta hai, isliye pigeonhole principle se alag strings ko kabhi-kabhi wahi hash banaana chahiye. Agar aap index return karte ho jaise hi window hash pattern hash ke barabar hai, aap wo positions report karoge jahaan text mein asal mein pattern nahi hai. Sahi form pehle hash ko ek saste filter ki tarah check karta hai, aur sirf jab ye match karta hai tab asli character comparison karta hai confirm karne ke liye.',
      },
    ],

    exercises: [
      {
        task: 'Implement buildLPS and verify it on "ababcabab" (expect [0,0,1,2,0,1,2,3,4]), "aaaa" (expect [0,1,2,3]), and "abcdef" (expect all zeros). Explain each non-zero entry in words.',
        taskHi: 'buildLPS implement karo aur ise "ababcabab" (expect [0,0,1,2,0,1,2,3,4]), "aaaa" (expect [0,1,2,3]), aur "abcdef" (expect sab zeros) par verify karo. Har non-zero entry ko shabdon mein samjhaao.',
        hint: 'For "aaaa", lps[3] = 3 because "aaaa" has "aaa" as both a proper prefix and a suffix. For "abcdef" no prefix ever reappears as a suffix, so every entry is 0 and KMP degenerates to the naive slide.',
        hintHi: '"aaaa" ke liye, lps[3] = 3 kyunki "aaaa" mein "aaa" ek proper prefix aur ek suffix dono hai. "abcdef" ke liye koi prefix kabhi ek suffix ki tarah dobara nahi aata, isliye har entry 0 hai aur KMP naive slide mein degenerate ho jaata hai.',
      },
      {
        task: 'Implement kmpSearch and indexOfNaive, both instrumented with a comparison counter. Run both on a text of 10,000 "a"s with pattern "a".repeat(50) + "b" and compare the counts.',
        taskHi: 'kmpSearch aur indexOfNaive dono implement karo, dono ek comparison counter se instrumented. Dono ko 10,000 "a" ke ek text par pattern "a".repeat(50) + "b" ke saath chalao aur counts compare karo.',
        hint: 'The naive version should do roughly 10,000 * 50 = 500,000 comparisons; KMP should do roughly 2 * 10,000. That ratio is the whole point of the algorithm.',
        hintHi: 'Naive version ko lagbhag 10,000 * 50 = 500,000 comparisons karne chahiye; KMP ko lagbhag 2 * 10,000. Wo ratio algorithm ka poora point hai.',
      },
      {
        task: 'Implement rabinKarp. Then deliberately delete the startsWith verification and construct (or search for) an input where it reports a false match. Also try removing the "+ MOD" and observe the negative-hash failure.',
        taskHi: 'rabinKarp implement karo. Phir jaan-boojhkar startsWith verification delete karo aur ek aisa input banao (ya dhoondho) jahaan ye ek jhootha match report kare. "+ MOD" hataakar bhi try karo aur negative-hash failure dekho.',
        hint: 'To force a collision quickly, use a tiny MOD such as 101 — collisions then appear within a few hundred characters and the unverified version returns a wrong index almost immediately.',
        hintHi: 'Ek collision jaldi majboor karne ke liye, ek tiny MOD jaisa 101 istemal karo — collisions phir kuch sau characters ke andar dikhte hain aur unverified version lagbhag turant ek galat index return karta hai.',
      },
    ],

    keyTakeaways: [
      'Naive substring search restarts the pattern at every text position, discarding what it just verified — O(n * m) on repetitive input, because the text pointer effectively moves backwards.',
      'KMP precomputes an LPS table: lps[i] = length of the longest proper prefix of pattern[0..i] that is also a suffix. It is built from the pattern alone, in O(m).',
      'On a mismatch after j matched characters, KMP sets j = lps[j - 1] and leaves the text pointer alone. Because the text pointer never decreases, the search is O(n + m) by an amortised argument.',
      'The classic KMP bug is using lps[j] instead of lps[j - 1] — j is the COUNT of matched characters, so the last matched index is j - 1.',
      'Rabin-Karp hashes a sliding window in O(1) per step (remove the outgoing character, shift in the incoming). Expected O(n + m), worst case O(n * m).',
      'Rabin-Karp MUST verify a hash match with a real comparison — collisions are unavoidable. It wins over KMP when searching many patterns at once or hunting repeated substrings.',
    ],
    keyTakeawaysHi: [
      'Naive substring search har text position par pattern phir se shuru karta hai, jo abhi verify kiya use phenkte hue — repetitive input par O(n * m), kyunki text pointer asal mein peechhe jaata hai.',
      'KMP ek LPS table precompute karta hai: lps[i] = pattern[0..i] ke sabse lambe proper prefix ki length jo ek suffix bhi hai. Ye sirf pattern se banti hai, O(m) mein.',
      'j matched characters ke baad ek mismatch par, KMP j = lps[j - 1] set karta hai aur text pointer ko akela chhodta hai. Kyunki text pointer kabhi nahi ghatta, search ek amortised argument se O(n + m) hai.',
      'Classic KMP bug lps[j - 1] ke bajaye lps[j] istemal karna hai — j matched characters ki COUNT hai, isliye aakhri matched index j - 1 hai.',
      'Rabin-Karp ek sliding window ko prati step O(1) mein hash karta hai (outgoing character hatao, incoming shift karo). Expected O(n + m), worst case O(n * m).',
      'Rabin-Karp ko ek hash match ko ek asli comparison se VERIFY KARNA CHAHIYE — collisions anivaarya hain. Ye KMP se tab jeetta hai jab ek saath kayi patterns dhoondhne ho ya repeated substrings.',
    ],
  },
];
